"""Transactional photography library and explicit output intake."""

import os
from pathlib import Path
from uuid import uuid4

from sqlalchemy import delete, select

from ..core.errors import StorageError
from ..database.equipment_models import Equipment, OpticalTrain
from ..database.library_models import AssetAttributes, AssetImportFrame, FormalOutput, LibraryRecord
from ..database.models import Asset, AssetLocation, AssetSession
from ..storage.manager import source_stat
from ..storage.import_planner import managed_relative_key
from ..storage.paths import safe_join_workspace
from .import_groups import group_summaries
from .library_rules import (
    CONDITIONS, FIELDS, METADATA, calibration_differences, differences, identifier, identifiers, label, properties,
)


def _owns_imported_file(asset, relative, member):
    """Verify an imported key independently of the workspace's current absolute path."""
    directory, _, leaf = relative.rpartition("/")
    if directory == f"objects/{asset.id}":
        expected = {asset.name}
    elif directory in {"objects/masters", "objects/videos"}:
        attrs = {"role": "master_frame"} if directory == "objects/masters" else {"file_kind": "video"}
        expected = {managed_relative_key(asset.name, asset.id, attrs, None).rsplit("/", 1)[1]}
    elif member is not None and directory == f"objects/subframes/{member.group_id}":
        if leaf == asset.name:
            return True
        expected = {managed_relative_key(asset.name, asset.id, {"role": "raw"}, member.group_id,
                                         collision=True).rsplit("/", 1)[1]}
    else:
        return False
    # The compact leaf retains the stable asset UUID and original file extension.
    return leaf in expected or leaf == asset.id + Path(asset.name).suffix


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
    def _records(session, kind):
        return session.scalars(select(LibraryRecord).where(LibraryRecord.kind == kind))

    @staticmethod
    def _record(session, kind, record_id):
        row = session.get(LibraryRecord, identifier(record_id))
        if row is None or row.kind != kind:
            raise StorageError("LIBRARY_RECORD_NOT_FOUND")
        return row

    @staticmethod
    def _data(row):
        return {**row.data, "id": row.id, "revision": row.revision}

    @staticmethod
    def _attributes(session, asset_id):
        row = session.get(AssetAttributes, asset_id)
        return row.attributes if row else {}

    @staticmethod
    def _version(row, expected):
        if type(expected) is not int or expected != (row.revision if row else 0):
            raise StorageError("REVISION_CONFLICT")

    @staticmethod
    def _asset_fields(asset, location, details, frame):
        return {
            "id": asset.id, "name": asset.name, "size_bytes": asset.size_bytes, "mtime_ns": str(asset.mtime_ns),
            "revision": details.revision if details else 0, "attributes": details.attributes if details else {},
            "storage_mode": location.storage_mode, "workspace_id": location.workspace_id,
            "import_group_id": frame.group_id if frame else None, "import_index": frame.frame_index if frame else None,
        }

    def _asset_data(self, session, asset):
        location = self.runtime.assets._location(session, asset.id)
        result = self._asset_fields(asset, location, session.get(AssetAttributes, asset.id),
                                    session.get(AssetImportFrame, asset.id))
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
                return page(group_summaries(session), query)
            if kind not in FIELDS:
                raise StorageError("LIBRARY_RECORD_NOT_FOUND")
            rows = [self._data(row) for row in self._records(session, kind)]
            if kind == "collections":
                attrs = {record.asset_id: record.attributes for record in session.scalars(select(AssetAttributes))}
                for row in rows:
                    row["calibration_eligible"] = self._calibration_collection(row["asset_ids"], attrs)
            if kind == "sessions":
                links = {}
                for link in session.scalars(select(AssetSession).order_by(AssetSession.asset_id)):
                    links.setdefault(link.session_id, []).append(link.asset_id)
                for row in rows:
                    row["asset_ids"] = links.get(row["id"], [])
        for key in ("project_id", "parent_id", "folder_id", "asset_id", "collection_id"):
            if value := query.get(key):
                rows = [row for row in rows if row.get(key) == identifier(value)]
        if q := query.get("q", "").strip().casefold():
            rows = [row for row in rows if q in str(row.get("name", "")).casefold()]
        return page(sorted(rows, key=lambda row: row["id"]), query)

    def _search_assets(self, session, query):
        selection = select(Asset, AssetLocation, AssetAttributes, AssetImportFrame).join(
            AssetLocation, AssetLocation.asset_id == Asset.id
        ).outerjoin(AssetAttributes, AssetAttributes.asset_id == Asset.id).outerjoin(
            AssetImportFrame, AssetImportFrame.asset_id == Asset.id).order_by(Asset.id)
        if group_id := query.get("import_group_id"):
            if group_id == "ungrouped":
                selection = selection.where(AssetImportFrame.asset_id.is_(None))
            else:
                selection = selection.where(AssetImportFrame.group_id == identifier(group_id))
        if values := query.get("asset_ids"):
            asset_ids = values.split(",")
            if len(asset_ids) > 100:
                raise StorageError("INVALID_REQUEST")
            selection = selection.where(Asset.id.in_([identifier(value) for value in asset_ids]))
        locations = {}
        roots = {}
        rows = []
        for asset, location, details, frame in session.execute(selection):
            rows.append(self._asset_fields(asset, location, details, frame))
            locations[asset.id] = location
        if q := query.get("q", "").strip().casefold():
            rows = [row for row in rows if any(
                q in str(value).casefold() for value in (row["name"], row["attributes"].get("target"),
                                                        row["attributes"].get("notes")) if value is not None)]
        for key in METADATA | {"storage_mode", "workspace_id"}:
            if key in query:
                rows = [row for row in rows if self._matches(row.get(key, row["attributes"].get(key)), query[key])]
        if query.get("project_id") or query.get("folder_id"):
            for key, kind in (("project_id", "projects"), ("folder_id", "folders")):
                if value := query.get(key):
                    self._record(session, kind, value)
            placements = [p for p in self._records(session, "placements") if all(
                not query.get(key) or p.data.get(key) == query[key] for key in ("project_id", "folder_id"))]
            included = {p.data.get("asset_id") for p in placements}
            for placement in placements:
                if child := placement.data.get("collection_id"):
                    included.update(self._record(session, "collections", child).data["asset_ids"])
            rows = [row for row in rows if row["id"] in included]
        if value := query.get("collection_id"):
            members = set(self._record(session, "collections", value).data["asset_ids"])
            rows = [row for row in rows if row["id"] in members]
        if value := query.get("session_id"):
            members = set(session.scalars(select(AssetSession.asset_id).where(
                AssetSession.session_id == identifier(value))))
            rows = [row for row in rows if row["id"] in members]
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
            row = self._record(session, kind, record_id)
            result = self._data(row)
            if kind == "collections":
                attrs = {record.asset_id: record.attributes for record in session.scalars(select(AssetAttributes))}
                result["calibration_eligible"] = self._calibration_collection(row.data["asset_ids"], attrs)
            if kind == "folders":
                subtree = self._subtree(session, row)
                result["affected_references"] = sum(
                    child.data.get(key) in subtree
                    for child_kind, key in (("placements", "folder_id"), ("masters", "folder_id"),
                                            ("collections", "calibration_folder_id"))
                    for child in self._records(session, child_kind)
                )
            if kind == "sessions":
                result["asset_ids"] = list(session.scalars(select(AssetSession.asset_id).where(
                    AssetSession.session_id == record_id).order_by(AssetSession.asset_id)))
            return result

    def member_ids(self, collection_id):
        with self.db.session() as session:
            return tuple(self._record(session, "collections", collection_id).data["asset_ids"])

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
            self._record(session, "collections", value)
        if value := attrs.get("calibration_source_asset_id"):
            self._asset(session, value)
            if self._attributes(session, value).get("usage") != attrs.get("calibration_method"):
                raise StorageError("INVALID_CALIBRATION_MASTER")

    def validate_import(self, attrs, project_id):
        with self.db.session() as session:
            self._check_asset_links(session, attrs)
            if project_id:
                self._record(session, "projects", project_id)

    def finish_import(self, session, asset_id, attrs, project_id):
        if attrs:
            self._check_asset_links(session, attrs)
            session.add(AssetAttributes(asset_id=asset_id, attributes=attrs))
        if project_id:
            # Import has just inserted this asset in this transaction. Looking through
            # earlier placements for every new frame makes large project imports quadratic.
            self._record(session, "projects", project_id)
            self._save(session, "placements", {
                "project_id": project_id, "folder_id": None, "asset_id": asset_id,
                "collection_id": None, "position": 0,
            })

    def bind_imported_asset(self, session, asset_id, imported_attributes, binding):
        """Apply an approved per-asset binding within the caller's transaction."""
        self._asset(session, asset_id)
        changes = properties({key: value for key, value in binding.items() if key != "master_ids"})
        current = session.get(AssetAttributes, asset_id)
        attributes = current.attributes if current else {}
        if (any(attributes.get(key) != value for key, value in imported_attributes.items())
                or any(attributes.get(key) not in (None, value) for key, value in changes.items())):
            raise StorageError("REVISION_CONFLICT")
        updated = {**attributes, **changes}
        self._check_asset_links(session, updated)
        if updated != attributes:
            if current is None:
                session.add(AssetAttributes(asset_id=asset_id, attributes=updated))
            else:
                current.attributes = updated
                current.revision += 1
            session.flush()

        assigned = []
        existing = {row.data["master_id"]: row for row in self._target_assignments(session, asset_id, None)}
        for master_id in binding.get("master_ids", []):
            prior = existing.get(master_id)
            if prior is None:
                # An approved group is the user's confirmation of the calibration
                # differences shown in the chat before the binding runs.
                candidate = self._assignment(
                    session, {"asset_id": asset_id, "master_id": master_id, "confirmed": True}, None,
                )
                prior = self._save(session, "assignments", candidate)
                session.flush()
            assigned.append(prior.id)
        return assigned


    @staticmethod
    def _save(session, kind, data, row=None):
        if row is None:
            row = LibraryRecord(id=str(uuid4()), kind=kind, revision=1, data=data)
            session.add(row)
        else:
            row.data, row.revision = data, row.revision + 1
        return row

    def _placement(self, session, data, row=None):
        project = self._record(session, "projects", data.get("project_id"))
        folder_id = data.get("folder_id")
        if folder_id and self._record(session, "folders", folder_id).data.get("project_id") != project.id:
            raise StorageError("INVALID_LIBRARY_REFERENCE")
        asset_id, collection_id = data.get("asset_id"), data.get("collection_id")
        if bool(asset_id) == bool(collection_id):
            raise StorageError("INVALID_REQUEST")
        if asset_id:
            self._asset(session, asset_id)
        else:
            self._record(session, "collections", collection_id)
        position = data.get("position", 0)
        if type(position) is not int or position < 0:
            raise StorageError("INVALID_REQUEST")
        prior = next((item for item in self._records(session, "placements") if
                      item.data.get("project_id") == project.id and item.data.get("asset_id") == asset_id and
                      item.data.get("collection_id") == collection_id and (row is None or item.id != row.id)), None)
        if prior and row is not None:
            raise StorageError("REVISION_CONFLICT")
        return self._save(session, "placements", {
            "project_id": project.id, "folder_id": folder_id, "asset_id": asset_id,
            "collection_id": collection_id, "position": position,
        }, row or prior)

    def _collection(self, session, data, record_id):
        members = identifiers(data.get("asset_ids", []))
        for item in members:
            self._asset(session, item)
        for collection in self._records(session, "collections"):
            if collection.id != record_id and set(members).intersection(collection.data["asset_ids"]):
                raise StorageError("ASSET_ALREADY_IN_COLLECTION")
        if len(members) > 1:
            delta = differences([self._attributes(session, item) for item in members], (*CONDITIONS, "temperature"))
            if set(delta["conflicts"]) - {"temperature"}:
                raise StorageError("COLLECTION_CONFLICT", details=delta)
            if any(delta.values()) and data.get("confirmed") is not True:
                raise StorageError("CONFIRMATION_REQUIRED", details=delta)
        assignments = list(self._records(session, "assignments"))
        if record_id and any(item.data.get("collection_id") == record_id for item in assignments):
            if any(self._attributes(session, item).get("usage") != "light" for item in members):
                raise StorageError("INVALID_LIBRARY_REFERENCE")
        if any(item.data.get("asset_id") in members for item in assignments):
            raise StorageError("COLLECTION_CONFLICT", details={"conflicts": ["calibration_assignments"]})
        folder_id = data.get("calibration_folder_id")
        if folder_id:
            folder = self._record(session, "folders", folder_id)
            attrs = {record.asset_id: record.attributes for record in session.scalars(select(AssetAttributes))}
            if folder.data.get("project_id") or not self._calibration_collection(members, attrs):
                raise StorageError("INVALID_CALIBRATION_MASTER")
        return {"name": label(data.get("name")), "asset_ids": members, "calibration_folder_id": folder_id}

    @staticmethod
    def _calibration_collection(members, attrs):
        def eligible(entry):
            usage = entry.get("usage")
            if usage not in {"dark", "dark_flat", "flat", "bias"}:
                return False
            if usage != "flat":
                return True
            method = entry.get("calibration_method")
            return (entry.get("calibration_state") == "calibrated" and bool(entry.get("camera_id"))
                    and bool(entry.get("optical_train_id")) and method in {"bias", "dark_flat"}
                    and attrs.get(entry.get("calibration_source_asset_id"), {}).get("usage") == method)
        return bool(members) and all(eligible(attrs.get(member, {})) for member in members)

    def _master(self, session, data):
        asset_id = self._asset(session, data.get("asset_id")).id
        attrs = self._attributes(session, asset_id)
        usage = attrs.get("usage")
        if (usage not in {"dark", "dark_flat", "flat", "bias", "other"}
                or attrs.get("role") != "calibration_master" or not attrs.get("camera_id")):
            raise StorageError("INVALID_CALIBRATION_MASTER")
        folder_id = data.get("folder_id")
        if folder_id and self._record(session, "folders", folder_id).data.get("project_id"):
            raise StorageError("INVALID_LIBRARY_REFERENCE")
        method, source = data.get("method"), data.get("source_asset_id")
        if usage == "flat":
            if not (method in ("bias", "dark_flat") and source and source != asset_id and attrs.get("optical_train_id")
                    and attrs.get("calibration_state") == "calibrated"):
                raise StorageError("INVALID_CALIBRATION_MASTER")
            if self._attributes(session, self._asset(session, source).id).get("usage") != method:
                raise StorageError("INVALID_CALIBRATION_MASTER")
        elif method is not None:
            label(method)
        if source:
            self._asset(session, source)
        return {"asset_id": asset_id, "folder_id": folder_id, "method": method, "source_asset_id": source, "usage": usage}

    def _assignment(self, session, data, record_id):
        asset_id, collection_id = data.get("asset_id"), data.get("collection_id")
        if bool(asset_id) == bool(collection_id):
            raise StorageError("INVALID_REQUEST")
        if asset_id:
            members = [self._asset(session, asset_id).id]
            if any(asset_id in row.data["asset_ids"] for row in self._records(session, "collections")):
                raise StorageError("COLLECTION_CONFLICT")
        else:
            members = self._record(session, "collections", collection_id).data["asset_ids"]
        rows = [self._attributes(session, member) for member in members]
        if not rows or any(row.get("usage") != "light" for row in rows):
            raise StorageError("INVALID_LIBRARY_REFERENCE")
        master = self._record(session, "masters", data.get("master_id"))
        master_attrs = self._attributes(session, master.data["asset_id"])
        usage = master.data["usage"]
        delta = calibration_differences(master_attrs, rows, usage)
        if any(delta.values()) and data.get("confirmed") is not True:
            raise StorageError("CONFIRMATION_REQUIRED", details=delta)
        for prior in self._target_assignments(session, asset_id, collection_id):
            if prior.id != record_id and prior.data.get("usage") == usage:
                raise StorageError("DUPLICATE_CALIBRATION_ASSIGNMENT")
        return {"asset_id": asset_id, "collection_id": collection_id, "master_id": master.id, "usage": usage}

    @staticmethod
    def _target_assignments(session, asset_id, collection_id):
        return session.scalars(select(LibraryRecord).where(
            LibraryRecord.kind == "assignments",
            LibraryRecord.data["asset_id"].as_string() == asset_id,
            LibraryRecord.data["collection_id"].as_string() == collection_id,
        ))

    def assign_masters(self, payload):
        if not isinstance(payload, dict) or payload.keys() - {"asset_id", "collection_id", "master_ids", "confirmed"}:
            raise StorageError("INVALID_REQUEST")
        masters = identifiers(payload.get("master_ids"))
        if not 1 <= len(masters) <= 5:
            raise StorageError("INVALID_REQUEST")
        target = {key: payload[key] for key in ("asset_id", "collection_id", "confirmed") if key in payload}
        with self.db.session(transaction="write") as session:
            rows, warnings = [], []
            for master in masters:
                candidate = {**target, "master_id": master}
                try:
                    result = self._assignment(session, candidate, None)
                except StorageError as exc:
                    if exc.code != "CONFIRMATION_REQUIRED":
                        raise
                    warnings.append({"master_id": master, **exc.details})
                    result = self._assignment(session, {**candidate, "confirmed": True}, None)
                rows.append(self._data(self._save(session, "assignments", result)))
                # Make this usage visible to the subsequent checks in the same transaction.
                session.flush()
            if warnings:
                all_differences = {field: sorted({value for warning in warnings for value in warning[field]})
                                   for field in ("conflicts", "unknown")}
                raise StorageError("CONFIRMATION_REQUIRED", details={**all_differences, "masters": warnings})
            return {"items": rows, "next": None}

    def _folder(self, session, data, record_id):
        project_id, parent_id = data.get("project_id"), data.get("parent_id")
        if project_id:
            self._record(session, "projects", project_id)
        current = parent_id
        visited = {record_id}
        while current:
            if current in visited:
                raise StorageError("FOLDER_CYCLE")
            visited.add(current)
            parent = self._record(session, "folders", current)
            if parent.data.get("project_id") != project_id:
                raise StorageError("INVALID_LIBRARY_REFERENCE")
            current = parent.data.get("parent_id")
        return {"name": label(data.get("name")), "project_id": project_id, "parent_id": parent_id}

    def add_project_assets(self, project_id, payload):
        if not isinstance(payload, dict) or set(payload) != {"asset_ids"}:
            raise StorageError("INVALID_REQUEST")
        asset_ids = identifiers(payload["asset_ids"])
        if not asset_ids:
            raise StorageError("INVALID_REQUEST")
        with self.db.session(transaction="write") as session:
            self._record(session, "projects", identifier(project_id))
            placements = [row for row in self._records(session, "placements") if row.data.get("project_id") == project_id]
            existing = {row.data["asset_id"] for row in placements if row.data.get("asset_id")}
            collections = {row.id: row for row in self._records(session, "collections")}
            for placement in placements:
                collection = collections.get(placement.data.get("collection_id"))
                if collection:
                    existing.update(collection.data.get("asset_ids", []))
            for asset_id in asset_ids:
                self._asset(session, asset_id)
            added = 0
            for asset_id in asset_ids:
                if asset_id not in existing:
                    self._placement(session, {"project_id": project_id, "asset_id": asset_id})
                    added += 1
            return {"added": added, "already_present": len(asset_ids) - added}

    def write(self, kind, payload, record_id=None):
        if not isinstance(payload, dict):
            raise StorageError("INVALID_REQUEST")
        if kind == "assets":
            return self._edit_asset(payload, record_id) if record_id else self._collect_output(payload)
        if kind not in FIELDS or payload.keys() - (FIELDS[kind] | {"revision"}):
            raise StorageError("INVALID_REQUEST")
        with self.db.session(transaction="write") as session:
            row = self._record(session, kind, record_id) if record_id else None
            if row:
                self._version(row, payload.get("revision"))
            data = {**(row.data if row else {}), **payload}
            if kind == "placements":
                return self._data(self._placement(session, data, row))
            if kind == "folders":
                if row and row.data.get("project_id") != data.get("project_id"):
                    raise StorageError("INVALID_LIBRARY_REFERENCE")
                result = self._folder(session, data, record_id)
            elif kind == "collections":
                result = self._collection(session, data, record_id)
            elif kind == "masters":
                result = self._master(session, data)
                if row and (result["asset_id"] != row.data["asset_id"] or result["usage"] != row.data["usage"]):
                    raise StorageError("INVALID_LIBRARY_REFERENCE")
                if any(other.id != record_id and other.data["asset_id"] == result["asset_id"]
                       for other in self._records(session, "masters")):
                    raise StorageError("INVALID_LIBRARY_REFERENCE")
            elif kind == "assignments":
                result = self._assignment(session, data, record_id)
            else:
                result = {"name": label(data.get("name"))}
                for key in ("notes", "target"):
                    if key in FIELDS[kind] and data.get(key) is not None:
                        result[key] = label(data[key], 4000 if key == "notes" else 256)
            row = self._save(session, kind, result, row)
            session.flush()
            if kind == "sessions" and "asset_ids" in payload:
                members = identifiers(payload["asset_ids"])
                for asset_id in members:
                    self._asset(session, asset_id)
                session.execute(delete(AssetSession).where(AssetSession.session_id == row.id))
                session.add_all(AssetSession(asset_id=asset_id, session_id=row.id) for asset_id in members)
                result = {**result, "asset_ids": members}
            if kind == "projects" and not record_id and payload.get("template") is True:
                for name in ("Raw", "Intermediate", "Results"):
                    self._save(session, "folders", {"name": name, "project_id": row.id, "parent_id": None})
            return {**result, "id": row.id, "revision": row.revision}

    def _edit_asset(self, payload, record_id):
        if payload.keys() - {"revision", "attributes"} or "attributes" not in payload:
            raise StorageError("INVALID_REQUEST")
        changes = properties(payload["attributes"])
        with self.db.session(transaction="write") as session:
            asset = self._asset(session, record_id)
            attrs = session.get(AssetAttributes, asset.id)
            self._version(attrs, payload.get("revision"))
            previous = attrs.attributes if attrs else {}
            merged = {**previous, **changes}
            self._check_asset_links(session, merged, previous=previous)
            if attrs is None:
                session.add(AssetAttributes(asset_id=asset.id, attributes=merged, revision=1))
            else:
                attrs.attributes = merged
                attrs.revision += 1
            session.flush()
            for master in self._records(session, "masters"):
                if master.data["asset_id"] == asset.id or master.data.get("source_asset_id") == asset.id:
                    if self._master(session, master.data)["usage"] != master.data["usage"]:
                        raise StorageError("INVALID_CALIBRATION_MASTER")
            warnings = []
            for collection in self._records(session, "collections"):
                members = collection.data["asset_ids"]
                if asset.id in members and len(members) > 1:
                    delta = differences([self._attributes(session, item) for item in members], CONDITIONS)
                    if delta["conflicts"]:
                        warnings.append({"collection_id": collection.id, **delta})
            return {**self._asset_data(session, asset), "warnings": warnings}


    @staticmethod
    def _subtree(session, row):
        if row.kind == "projects":
            return {folder.id for folder in PhotographyLibrary._records(session, "folders")
                    if folder.data.get("project_id") == row.id}
        folders = list(PhotographyLibrary._records(session, "folders"))
        parents = {row.id}
        while extra := {folder.id for folder in folders if folder.data.get("parent_id") in parents} - parents:
            parents.update(extra)
        return parents

    def remove(self, kind, record_id, payload):
        if not isinstance(payload, dict) or payload.keys() - {"revision", "confirmed"}:
            raise StorageError("INVALID_REQUEST")
        with self.db.session(transaction="write") as session:
            if kind == "assets":
                self._remove_asset(session, record_id, payload.get("revision"))
                return {"id": record_id, "deleted": True}
            row = self._record(session, kind, record_id)
            self._version(row, payload.get("revision"))
            if kind in {"projects", "folders"}:
                subtree = self._subtree(session, row)
                placements = [item for item in self._records(session, "placements")
                              if item.data.get("folder_id") in subtree or item.data.get("project_id") == record_id]
                masters = [item for item in self._records(session, "masters") if item.data.get("folder_id") in subtree]
                collections = [item for item in self._records(session, "collections")
                               if item.data.get("calibration_folder_id") in subtree]
                count = len(placements) + len(masters) + len(collections)
                if (count or kind == "projects" or len(subtree) > 1) and payload.get("confirmed") is not True:
                    raise StorageError("CONFIRMATION_REQUIRED", details={"affected_references": count})
                for item in placements:
                    session.delete(item)
                for item in masters:
                    item.data = {**item.data, "folder_id": None}
                    item.revision += 1
                for item in collections:
                    item.data = {**item.data, "calibration_folder_id": None}
                    item.revision += 1
                for folder_id in subtree - {record_id}:
                    session.delete(self._record(session, "folders", folder_id))
            if kind == "sessions":
                session.execute(delete(AssetSession).where(AssetSession.session_id == record_id))
            if kind in {"collections", "masters"}:
                self._unlink(session, kind, record_id)
            session.delete(row)
        return {"id": record_id, "deleted": True}

    def _remove_asset(self, session, record_id, revision):
        self._asset(session, record_id)
        self._version(session.get(AssetAttributes, record_id), revision)
        self._unlink(session, "assets", record_id)
        session.execute(delete(AssetSession).where(AssetSession.asset_id == record_id))
        session.execute(delete(AssetLocation).where(AssetLocation.asset_id == record_id))
        session.execute(delete(Asset).where(Asset.id == record_id))

    def _unlink(self, session, kind, record_id):
        if kind == "assets":
            for master in self._records(session, "masters"):
                if record_id in (master.data["asset_id"], master.data.get("source_asset_id")):
                    raise StorageError("LIBRARY_RECORD_REFERENCED")
            for collection in self._records(session, "collections"):
                if record_id in collection.data["asset_ids"]:
                    collection.data = {**collection.data, "asset_ids": [i for i in collection.data["asset_ids"] if i != record_id]}
                    collection.revision += 1
        key = {"assets": "asset_id", "collections": "collection_id", "masters": "master_id"}[kind]
        for link_kind in ("placements", "assignments"):
            for link in self._records(session, link_kind):
                if link.data.get(key) == record_id:
                    session.delete(link)
        provenance_key = {"assets": "source_asset_id", "collections": "source_collection_id"}.get(kind)
        if provenance_key:
            for attrs in session.scalars(select(AssetAttributes)):
                keys = [provenance_key]
                if kind == "assets":
                    keys.append("calibration_source_asset_id")
                removed = {field: None for field in keys if attrs.attributes.get(field) == record_id}
                if removed:
                    attrs.attributes = {**attrs.attributes, **removed}
                    attrs.revision += 1

    def delete_file(self, record_id, revision, confirmed):
        # Keep the registration even after physical deletion so an interruption
        # cannot lose its metadata and the UI can distinguish offline from unregister.
        if confirmed is not True:
            raise StorageError("CONFIRMATION_REQUIRED")
        with self.db.session() as session:
            workspace_id = self.runtime.assets._location(session, record_id).workspace_id
        if not workspace_id:
            raise StorageError("ASSET_NOT_MANAGED")
        with self.runtime.workspaces.lease(workspace_id), self.db.session(transaction="write") as session:
            asset = self._asset(session, record_id)
            self._version(session.get(AssetAttributes, record_id), revision)
            location = self.runtime.assets._location(session, record_id)
            if location.workspace_id != workspace_id:
                raise StorageError("REVISION_CONFLICT")
            # Accept only the importer's namespaces. Formal outputs have separate ownership.
            member = session.get(AssetImportFrame, record_id)
            if not _owns_imported_file(asset, location.relative_key, member):
                raise StorageError("LIBRARY_RECORD_REFERENCED")
            root = self.runtime.workspaces.require(workspace_id)
            path = safe_join_workspace(root, location.relative_key)
            info = source_stat(path)
            if info.st_nlink != 1 or (info.st_size, info.st_mtime_ns) != (asset.size_bytes, asset.mtime_ns):
                raise StorageError("LIBRARY_RECORD_REFERENCED")
            if session.scalar(select(AssetLocation.id).where(
                AssetLocation.external_key == os.path.normcase(str(path)), AssetLocation.asset_id != record_id,
            )):
                raise StorageError("LIBRARY_RECORD_REFERENCED")
            if session.scalar(select(FormalOutput.id).where(FormalOutput.source_id == record_id).limit(1)):
                raise StorageError("LIBRARY_RECORD_REFERENCED")
            if any(record_id in row.data["asset_ids"] for row in self._records(session, "collections")):
                raise StorageError("LIBRARY_RECORD_REFERENCED")
            if any(record_id in (row.data["asset_id"], row.data.get("source_asset_id"))
                   for row in self._records(session, "masters")):
                raise StorageError("LIBRARY_RECORD_REFERENCED")
            path.unlink()
        return {"id": record_id, "deleted_file": True}

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

    def _collect_output(self, payload):
        if payload.keys() - {"output_id", "project_id", "attributes"}:
            raise StorageError("INVALID_REQUEST")
        output_id = identifier(payload.get("output_id"))
        attrs = properties(payload.get("attributes", {}))
        with self.db.session() as session:
            output = session.get(FormalOutput, output_id)
            if output is None:
                raise StorageError("OUTPUT_NOT_FOUND")
        workspace_id = output.workspace_id
        with self.runtime.workspaces.lease(workspace_id), self.db.session(transaction="write") as session:
            if existing := session.get(Asset, output_id):
                return self._asset_data(session, existing)
            output = session.get(FormalOutput, output_id)
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
            self.finish_import(session, asset.id, {"role": "processed", **attrs}, payload.get("project_id"))
            session.flush()
            return self._asset_data(session, asset)
