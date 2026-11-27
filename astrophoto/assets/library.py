"""Transactional photography library and explicit output intake."""

from pathlib import Path
from uuid import uuid4

from sqlalchemy import delete, select

from ..core.errors import StorageError
from ..database.equipment_models import Equipment, OpticalTrain
from ..database.catalog_models import CATALOG_MODELS, CalibrationBinding, CalibrationMaster, ImageResult, ProjectNode, Subframe, SubframeCollection, Video
from ..database.library_models import AssetAttributes, AssetImportFrame, FormalOutput, LibraryRecord
from ..database.models import Asset, AssetLocation
from ..storage.manager import source_stat
from ..storage.paths import safe_join_workspace
from .import_groups import group_summaries
from .library_rules import METADATA, identifier, properties


def page(rows, query):
    limit = int(query.get("limit", 100))
    if not 1 <= limit <= 100:
        raise StorageError("INVALID_REQUEST")
    if after := query.get("after"):
        identifier(after)
        offset = next((i + 1 for i, row in enumerate(rows) if row["id"] == after), None)
        if offset is None:
            raise StorageError("REVISION_CONFLICT")
        rows = rows[offset:]
    return {"items": rows[:limit], "next": rows[limit - 1]["id"] if len(rows) > limit else None}


class PhotographyLibrary:
    def __init__(self, runtime):
        self.runtime = runtime
        self.db = runtime.db

    @staticmethod
    def _asset(session, asset_id):
        row = session.get(Asset, identifier(asset_id))
        if row is None:
            raise StorageError("ASSET_NOT_FOUND")
        return row

    @staticmethod
    def _attributes(session, asset_id):
        row = session.get(AssetAttributes, asset_id)
        return row.attributes if row else {}

    @staticmethod
    def _asset_fields(asset, location, details, frame, typed=None):
        attrs = details.attributes if details else {}
        if typed:
            attrs = {**attrs, "notes": typed.notes}
        return {
            "id": asset.id, "name": typed.name if typed else asset.name,
            "size_bytes": asset.size_bytes, "mtime_ns": str(asset.mtime_ns),
            "revision": details.revision if details else 0, "attributes": attrs,
            **({"catalog_resource": next(kind for kind, model in CATALOG_MODELS.items() if type(typed) is model)} if typed else {}),
            "storage_mode": location.storage_mode, "workspace_id": location.workspace_id,
            "import_group_id": frame.group_id if frame else None, "import_index": frame.frame_index if frame else None,
        }

    def _asset_data(self, session, asset):
        location = self.runtime.assets._location(session, asset.id)
        typed = next((row for model in (CalibrationMaster, ImageResult, Video)
                      if (row := session.get(model, asset.id)) is not None), None)
        result = self._asset_fields(asset, location, session.get(AssetAttributes, asset.id),
                                    session.get(AssetImportFrame, asset.id), typed)
        return self._check_availability(result, location, {})

    def _check_availability(self, result, location, roots):
        workspace = location.workspace_id
        try:
            if location.external_path:
                path = Path(location.external_path)
            else:
                if workspace not in roots:
                    try:
                        roots[workspace] = self.runtime.workspaces.require(workspace, write=False)
                    except (StorageError, OSError) as exc:
                        roots[workspace] = exc
                root = roots[workspace]
                if isinstance(root, Exception):
                    return {**result, "available": False, "reason": getattr(root, "code", "SOURCE_UNREADABLE")}
                path = safe_join_workspace(root, location.relative_key)
            source_stat(path)
            result.update(available=True, reason=None)
        except (StorageError, OSError) as exc:
            result.update(available=False, reason=getattr(exc, "code", "SOURCE_UNREADABLE"))
        return result

    def list(self, kind, query):
        with self.db.session(transaction="read") as session:
            if kind == "assets":
                return self._search_assets(session, query)
            if kind == "import-groups":
                groups = group_summaries(session)
                roots = {}
                for group in groups:
                    locations = session.scalars(select(AssetLocation).join(Subframe, Subframe.id == AssetLocation.asset_id)
                                                .where(Subframe.collection_id == group['id']))
                    group['available'] = (all(self._check_availability({}, location, roots)['available']
                                              for location in locations) if group['count'] else None)
                return page(groups, query)
            raise StorageError("LIBRARY_RECORD_NOT_FOUND")

    def _search_assets(self, session, query):
        selection = select(Asset, AssetLocation, AssetAttributes, AssetImportFrame, Video, ImageResult, CalibrationMaster).join(
            AssetLocation, AssetLocation.asset_id == Asset.id
        ).outerjoin(AssetAttributes, AssetAttributes.asset_id == Asset.id).outerjoin(
            AssetImportFrame, AssetImportFrame.asset_id == Asset.id).outerjoin(
            Video, Video.id == Asset.id).outerjoin(ImageResult, ImageResult.id == Asset.id).outerjoin(
            CalibrationMaster, CalibrationMaster.id == Asset.id).order_by(Asset.id)
        if query.get("exclude_calibration") == "true":
            selection = selection.where(CalibrationMaster.id.is_(None))
        if group_id := query.get("import_group_id"):
            selection = selection.outerjoin(Subframe, Subframe.id == Asset.id)
            if group_id == "ungrouped":
                selection = selection.where(Subframe.id.is_(None))
            else:
                selection = selection.where(Subframe.collection_id == identifier(group_id))
        if values := query.get("asset_ids"):
            asset_ids = values.split(",")
            if len(asset_ids) > 100:
                raise StorageError("INVALID_REQUEST")
            selection = selection.where(Asset.id.in_([identifier(value) for value in asset_ids]))
        locations = {}
        roots = {}
        rows = []
        for asset, location, details, frame, video, image, master in session.execute(selection):
            rows.append(self._asset_fields(asset, location, details, frame, master or image or video))
            locations[asset.id] = location
        if q := query.get("q", "").strip().casefold():
            rows = [row for row in rows if any(
                q in str(value).casefold() for value in (row["name"], row["attributes"].get("target"),
                                                        row["attributes"].get("notes")) if value is not None)]
        for key in METADATA | {"storage_mode", "workspace_id"}:
            if key in query:
                rows = [row for row in rows if self._matches(row.get(key, row["attributes"].get(key)), query[key])]
        if query.keys() & {"project_id", "folder_id", "collection_id", "session_id"}:
            raise StorageError("INVALID_REQUEST")
        if "extension" in query:
            suffix = "." + query["extension"].lstrip(".").casefold()
            rows = [row for row in rows if Path(row["name"]).suffix.casefold() == suffix]
        sort = query.get("sort", "import_index" if group_id and group_id != "ungrouped" else "id")
        field = sort.removeprefix("-")
        if field not in METADATA | {"id", "name", "size_bytes", "mtime_ns", "import_index"} or field == "equipment_ids":
            raise StorageError("INVALID_REQUEST")

        def value_for(row):
            value = row.get(field, row["attributes"].get(field))
            if field == "mtime_ns":
                return int(value)
            return value.casefold() if isinstance(value, str) else value

        known = [row for row in rows if value_for(row) is not None]
        missing = [row for row in rows if value_for(row) is None]
        known.sort(key=value_for, reverse=sort.startswith("-"))
        rows = known + missing
        if "available" in query:
            if query["available"] not in ("true", "false"):
                raise StorageError("INVALID_REQUEST")
            full = [self._check_availability(row, locations[row["id"]], roots) for row in rows]
            return page([row for row in full if row["available"] == (query["available"] == "true")], query)
        result = page(rows, query)
        result["items"] = [self._check_availability(row, locations[row["id"]], roots) for row in result["items"]]
        return result

    @staticmethod
    def _matches(value, match):
        if isinstance(value, list):
            return match in value
        if value is None:
            return match == "unknown"
        if type(value) in (int, float):
            return value == float(match)
        return str(value).casefold() == match.casefold()

    def get(self, kind, record_id):
        with self.db.session(transaction="read") as session:
            if kind == "assets":
                return self._asset_data(session, self._asset(session, record_id))
            raise StorageError("LIBRARY_RECORD_NOT_FOUND")

    def member_ids(self, collection_id):
        with self.db.session() as session:
            if session.get(SubframeCollection, identifier(collection_id)) is None:
                raise StorageError("LIBRARY_RECORD_NOT_FOUND")
            return tuple(session.scalars(select(Subframe.id).where(Subframe.collection_id == collection_id)
                                         .order_by(Subframe.frame_index, Subframe.id)))

    def _check_asset_links(self, session, attrs, *, previous=None):
        for key, model in (("camera_id", Equipment), ("optical_train_id", OpticalTrain)):
            if value := attrs.get(key):
                row = session.get(model, value)
                if row is None or (key == "camera_id" and row.equipment_type != "camera"):
                    raise StorageError("INVALID_LIBRARY_REFERENCE")
                if key == "optical_train_id" and row.deleted_at_utc and (previous or {}).get(key) != value:
                    raise StorageError("INVALID_LIBRARY_REFERENCE")
        for value in attrs.get("equipment_ids") or []:
            if session.get(Equipment, value) is None:
                raise StorageError("INVALID_LIBRARY_REFERENCE")
        if value := attrs.get("source_asset_id"):
            self._asset(session, value)
        if value := attrs.get("source_collection_id"):
            if session.get(SubframeCollection, value) is None:
                raise StorageError("INVALID_LIBRARY_REFERENCE")
        if value := attrs.get("calibration_source_asset_id"):
            self._asset(session, value)
            if self._attributes(session, value).get("usage") != attrs.get("calibration_method"):
                raise StorageError("INVALID_CALIBRATION_MASTER")

    def validate_import(self, attrs):
        with self.db.session() as session:
            self._check_asset_links(session, attrs)

    def finish_import(self, session, asset_id, attrs):
        if attrs:
            self._check_asset_links(session, attrs)
            session.add(AssetAttributes(asset_id=asset_id, attributes=attrs))
    def write(self, kind, payload, record_id=None):
        if kind != "assets":
            raise StorageError("LIBRARY_RECORD_NOT_FOUND")
        if not isinstance(payload, dict):
            raise StorageError("INVALID_REQUEST")
        return self._edit_asset(payload, record_id) if record_id else self._collect_output(payload)

    def _edit_asset(self, payload, record_id):
        if payload.keys() != {"attributes"}:
            raise StorageError("INVALID_REQUEST")
        changes = properties(payload["attributes"])
        with self.db.session(transaction="write") as session:
            asset = self._asset(session, record_id)
            if session.get(Subframe, asset.id) and changes.keys() & {
                "exposure", "iso", "gain", "offset", "binning", "readout_mode", "temperature",
                "usage", "calibration_state", "camera_id", "optical_train_id", "filter",
            }:
                raise StorageError("INVALID_REQUEST")
            attrs = session.get(AssetAttributes, asset.id)
            previous = attrs.attributes if attrs else {}
            merged = {**previous, **changes}
            if session.get(CalibrationMaster, asset.id):
                if merged.get("role") != "master_frame":
                    raise StorageError("INVALID_REQUEST", "Calibration masters require a master_frame role")
            elif session.get(ImageResult, asset.id):
                self._validate_image_role(merged)
            self._check_asset_links(session, merged, previous=previous)
            if attrs is None:
                session.add(AssetAttributes(asset_id=asset.id, attributes=merged, revision=1))
            else:
                attrs.attributes = merged
                attrs.revision += 1
            session.flush()
            return self._asset_data(session, asset)

    def _remove_asset(self, session, record_id):
        self._asset(session, record_id)
        self._remove_assets(session, [record_id])

    @staticmethod
    def _remove_assets(session, record_ids, removed_collection_id=None):
        if not record_ids and removed_collection_id is None:
            return
        # Keep each statement within SQLite's parameter limit.
        batches = [record_ids[index:index + 500] for index in range(0, len(record_ids), 500)]
        for batch in batches:
            session.execute(delete(CalibrationBinding).where(CalibrationBinding.master_id.in_(batch)))
            session.execute(delete(ProjectNode).where(
                ProjectNode.resource_id.in_(batch), ProjectNode.kind.in_(("video", "image_result")),
            ))
        removed_ids = set(record_ids)
        for attrs in session.scalars(select(AssetAttributes)):
            if attrs.asset_id in removed_ids:
                continue
            removed = {field: None for field in ("source_asset_id", "calibration_source_asset_id")
                       if isinstance(value := attrs.attributes.get(field), str) and value in removed_ids}
            if removed_collection_id and attrs.attributes.get("source_collection_id") == removed_collection_id:
                removed["source_collection_id"] = None
            if removed:
                attrs.attributes = {**attrs.attributes, **removed}
                attrs.revision += 1
        for batch in batches:
            session.execute(delete(LibraryRecord).where(LibraryRecord.id.in_(["catalog_dates_" + key for key in batch])))
            session.execute(delete(LibraryRecord).where(
                LibraryRecord.kind == "catalog_source", LibraryRecord.data["asset_id"].as_string().in_(batch),
            ))
            session.execute(delete(CalibrationMaster).where(CalibrationMaster.id.in_(batch)))
            session.execute(delete(FormalOutput).where(FormalOutput.id.in_(batch)))
            session.execute(delete(AssetLocation).where(AssetLocation.asset_id.in_(batch)))
            session.execute(delete(Asset).where(Asset.id.in_(batch)))

    def record_output(self, output_id, workspace_id, relative_key, source_id, provenance):
        self.record_outputs(workspace_id, ((output_id, relative_key, source_id, provenance),))

    def record_outputs(self, workspace_id, outputs):
        root = self.runtime.workspaces.require(workspace_id, migrating=True)
        rows = []
        for output_id, relative_key, source_id, provenance in outputs:
            identifier(output_id)
            source_stat(safe_join_workspace(root, relative_key))
            rows.append(FormalOutput(id=output_id, workspace_id=workspace_id, relative_key=relative_key,
                                     source_id=source_id, provenance=provenance))
        with self.db.session(transaction="write") as session:
            session.add_all(rows)

    def has_output(self, output_id):
        with self.db.session() as session:
            return session.get(FormalOutput, output_id) is not None

    def has_session_outputs(self, workspace_id, run_id):
        with self.db.session() as session:
            return session.scalar(select(FormalOutput.id).where(
                FormalOutput.workspace_id == workspace_id,
                FormalOutput.provenance["run_id"].as_string() == run_id,
            ).limit(1)) is not None

    def resolve_output(self, output_id):
        with self.db.session() as session:
            output = session.get(FormalOutput, identifier(output_id))
            if output is None:
                raise StorageError("OUTPUT_NOT_FOUND")
            root = self.runtime.workspaces.require(output.workspace_id, write=False, migrating=True)
            path = safe_join_workspace(root, output.relative_key)
        source_stat(path)
        return path

    @staticmethod
    def _validate_image_role(attributes):
        if attributes.get("role") not in ("processed", "master_frame"):
            raise StorageError("INVALID_REQUEST", "Image results require a processed or master_frame role")

    def _collect_output(self, payload):
        if payload.keys() - {"output_id", "attributes"}:
            raise StorageError("INVALID_REQUEST")
        output_id = identifier(payload.get("output_id"))
        attrs = {"role": "processed", **properties(payload.get("attributes", {}))}
        self._validate_image_role(attrs)
        with self.db.session() as session:
            output = session.get(FormalOutput, output_id)
            if output is None:
                raise StorageError("OUTPUT_NOT_FOUND")
        workspace_id = output.workspace_id
        with self.runtime.workspaces.lease(workspace_id), self.db.session(transaction="write") as session:
            if existing := session.get(Asset, output_id):
                return self._asset_data(session, existing)
            output = session.get(FormalOutput, output_id)
            if output is None:
                raise StorageError("OUTPUT_NOT_FOUND")
            if output.workspace_id != workspace_id:
                raise StorageError("REVISION_CONFLICT")
            root = self.runtime.workspaces.require(workspace_id, write=False)
            path = safe_join_workspace(root, output.relative_key)
            info = source_stat(path)
            if output.provenance.get("size_bytes", info.st_size) != info.st_size:
                raise StorageError("SOURCE_CHANGED")
            asset = Asset(id=output_id, name=path.name, size_bytes=info.st_size, mtime_ns=info.st_mtime_ns)
            session.add(asset)
            session.flush()
            session.add(AssetLocation(id=str(uuid4()), asset_id=asset.id, storage_mode="managed",
                                      workspace_id=output.workspace_id, relative_key=output.relative_key))
            if output.source_id and session.get(Asset, output.source_id):
                attrs.setdefault("source_asset_id", output.source_id)
            for key, value in (("node", output.provenance.get("node_id")), ("workflow", output.provenance.get("workflow_id"))):
                if isinstance(value, str):
                    attrs.setdefault(key, value)
            from .catalog import reserve_name, touch_dates

            reserve_name(session, asset.name, asset.id)
            touch_dates(session, asset.id, created=True)
            session.add(ImageResult(id=asset.id, name=asset.name, notes=attrs.get("notes")))
            self.finish_import(session, asset.id, attrs)
            session.flush()
            return self._asset_data(session, asset)
