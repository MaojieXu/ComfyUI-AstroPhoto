"""Public catalog and project API through the local library authorization boundary."""


from sqlalchemy import delete, func, select

from ..assets import catalog, projects
from ..assets.managed_rename import catalog_edit
from ..assets.library import page
from ..assets.library_rules import identifier, identifiers, label, properties
from ..core.errors import StorageError
from ..database.catalog_models import CalibrationBinding, CalibrationMaster, ImageResult, Project, ProjectNode, Subframe, SubframeCollection
from ..database.library_models import AssetAttributes, LibraryRecord
from .storage import fields


def filtered_page(rows, query):
    if exact := query.get("exact_name"):
        rows = [row for row in rows if catalog.name_key(row["name"]) == catalog.name_key(exact.strip())]
    if term := query.get("q"):
        rows = [row for row in rows if catalog.name_key(term) in catalog.name_key(row["name"])]
    sort = query.get("sort")
    if sort in {"name_asc", "name_desc"}:
        rows.sort(key=lambda row: (catalog.name_key(row["name"]), row["id"]), reverse=sort == "name_desc")
    elif sort in {"created_desc", "updated_desc"}:
        rows.sort(key=lambda row: (row.get(sort.split("_")[0] + "_at_utc", ""), row["id"]), reverse=True)
    return {**page(rows, query), "total": len(rows)}


def listing_rows(session, kind):
    model = catalog.MODELS[kind]
    query = select(model, LibraryRecord.data).outerjoin(LibraryRecord, LibraryRecord.id == "catalog_dates_" + model.id)
    if kind == "image_result":
        query = (query.add_columns(AssetAttributes.attributes, CalibrationMaster)
                 .outerjoin(AssetAttributes, AssetAttributes.asset_id == model.id)
                 .outerjoin(CalibrationMaster, CalibrationMaster.id == model.id))
    for row, dates, *image_fields in session.execute(query.order_by(model.id)):
        summary = {**catalog.data(row), **(dates or {})}
        if image_fields:
            attrs, master = image_fields
            attrs = attrs or {}
            result_type = "image_result" if attrs.get("role") == "processed" else "master_frame"
            summary["result_type"] = result_type
            summary["master_type"] = master.type if master else (
                attrs.get("master_type", "unknown") if attrs and result_type == "master_frame" else None)
            if master:
                summary.update({field: getattr(master, field) for field in (*catalog.CAPTURE, "camera_id", "camera_snapshot")})
            elif result_type == "image_result":
                for field in catalog.CAPTURE:
                    summary.pop(field, None)
        yield row, summary


def filter_listing(rows, kind, query):
    if result_type := query.get("result_type"):
        if kind != "image_result" or result_type not in {"master_frame", "image_result"}:
            raise StorageError("INVALID_REQUEST")
        rows = [row for row in rows if row["result_type"] == result_type]
    for field in ("frame_type", "master_type", "calibration_state", "type", *catalog.CAPTURE):
        if value := query.get(field):
            if field in {"exposure_seconds", "iso", "gain", "offset", "temperature_c"}:
                value = float(value)
            rows = [row for row in rows if row.get(field) == value]
    for field in ("equipment", "filter", "camera"):
        if value := query.get(field):
            rows = [row for row in rows if catalog.name_key(
                (row.get(field + "_snapshot") or {}).get("name", "")) == catalog.name_key(value.strip())]
    return rows


def listing(service, _runtime, request, _body):
    kind = catalog.choice(request.match_info["resource"], {*catalog.MODELS, "assets"})
    query = request.query
    with service.db.session(transaction="read") as session:
        kinds = ("subframe_collection", "video", "image_result") if kind == "assets" else (kind,)
        records, rows = {}, []
        for key in kinds:
            for row, summary in listing_rows(session, key):
                records[row.id] = (key, row)
                rows.append(summary)
        if collection_id := query.get("collection"):
            if kind != "calibration_master":
                raise StorageError("INVALID_REQUEST")
            collection = catalog.require(session, SubframeCollection, collection_id)
            allowed = catalog.binding_types(collection.frame_type)
            bound = set(session.scalars(select(CalibrationBinding.master_id).where(
                CalibrationBinding.collection_id == collection.id)))
            rows = [row for row in rows if row["id"] not in bound and row["type"] in allowed]
            capture = catalog.data(collection)
            for row in rows:
                comparison = catalog.comparison(capture, records[row["id"]][1])
                states = {item["status"] for item in comparison.values()}
                row.update(comparison=comparison,
                           status="difference" if "difference" in states else "unknown" if "unknown" in states else "match")
            rows.sort(key=lambda row: (row["status"], catalog.name_key(row["name"]), row["id"]))
        result = filtered_page(filter_listing(rows, kind, query), query)
        items = []
        for summary in result["items"]:
            key, row = records[summary["id"]]
            view = catalog.view(service, session, key, row)
            if kind == "assets":
                view["asset_type"] = summary.get("result_type", key)
            if "comparison" in summary:
                view.update(comparison=summary["comparison"], status=summary["status"])
            items.append(view)
        return {**result, "items": items}


def detail(service, _runtime, request, _body):
    kind = catalog.choice(request.match_info["resource"], catalog.MODELS)
    with service.db.session(transaction="read") as session:
        row = catalog.require(session, catalog.MODELS[kind], request.match_info["id"])
        return catalog.view(service, session, kind, row, detail=request.query.get("summary") != "1",
                            bindings=request.query.get("bindings") == "1")


def edit(service, _runtime, request, body):
    kind = catalog.choice(request.match_info["resource"], catalog.MODELS)
    requested_kind = kind
    optional = ("name", "notes", *catalog.OPTICAL_FIELDS)
    if kind == "subframe_collection":
        optional += ("frame_type", "calibration_state", *catalog.CAPTURE)
    if kind == "calibration_master":
        optional += ("master_type", "camera_id", "source_collection_id", *catalog.CAPTURE)
    if kind == "image_result":
        optional += ("master_type", "camera_id", "source_collection_id", *catalog.CAPTURE)
    fields(body, (), ("revision", *optional))
    body = dict(body)
    with catalog_edit(service, "name" in body) as (session, rename_directories):
        row = catalog.require(session, catalog.MODELS[kind], request.match_info["id"])
        if "revision" in body:
            current = session.get(CalibrationMaster, row.id) if kind == "image_result" else None
            catalog.revision(current or row, body["revision"])
        if "name" in body:
            catalog.reserve_name(session, label(body["name"]), row.id)
        image = row if kind == "image_result" else None
        if kind == "calibration_master":
            image = catalog.require(session, ImageResult, row.id)
            if "master_type" in body:
                requested_kind = "image_result"
        master = session.get(CalibrationMaster, row.id) if image else None
        old_master = catalog.data(master) if master else None
        desired = body.pop("master_type", None) if image else None
        if desired is not None:
            catalog.choice(desired, catalog.MASTER_TYPES | {"light", "unknown"})
            if catalog.image_result_type(session, image.id) != "master_frame":
                raise StorageError("INVALID_REQUEST")
            source_id = body.get("source_collection_id", master.source_collection_id if master else image.source_collection_id)
            source = catalog.require(session, SubframeCollection, source_id) if source_id else None
            if source and desired != "unknown" and source.frame_type != desired:
                raise StorageError("INVALID_CALIBRATION_MASTER")
            if master and desired != master.type:
                session.execute(delete(CalibrationBinding).where(CalibrationBinding.master_id == master.id))
                image.revision = master.revision
                for key in (*catalog.CAPTURE, "source_collection_id"):
                    setattr(image, key, getattr(master, key))
                session.delete(master)
                session.flush()
                master = None
            if desired in catalog.MASTER_TYPES and not master:
                config = {"kind": "calibration_master", "name": image.name, "notes": image.notes, "type": desired}
                if not old_master:
                    config.update({key: getattr(image, key) for key in (*catalog.CAPTURE, "source_collection_id")})
                if old_master:
                    config.update({key: old_master[key] for key in catalog.CAPTURE})
                    if old_master.get("source_collection_id"):
                        config["source_collection_id"] = old_master["source_collection_id"]
                config.update({key: value for key, value in body.items() if key in (*catalog.CAPTURE, "camera_id", "source_collection_id")})
                plan = catalog.prepare(session, config)
                if set(body) & set(catalog.OPTICAL_FIELDS) or not body.get("source_collection_id"):
                    plan["fields"].update({key: getattr(image, key) for key in (*catalog.OPTICAL_FIELDS, "equipment_snapshot", "filter_snapshot")})
                    if "camera_id" not in body and not old_master:
                        plan["fields"]["camera_id"], plan["fields"]["camera_snapshot"] = catalog.inherited_camera_binding(
                            session, image.equipment_snapshot)
                if old_master and "camera_id" not in body:
                    plan["fields"].update(camera_id=catalog.current_camera_id(session, old_master["camera_id"]),
                                          camera_snapshot=old_master["camera_snapshot"])
                stamp = catalog.now()
                master = CalibrationMaster(id=image.id, revision=image.revision, created_at_utc=stamp, updated_at_utc=stamp, **plan["fields"])
                session.add(master)
                session.flush()
                for key in (*catalog.CAPTURE, "source_collection_id"):
                    setattr(image, key, None)
            attrs = session.get(AssetAttributes, image.id)
            if attrs:
                attrs.attributes = {**attrs.attributes, "master_type": desired, "role": "master_frame"}
                attrs.revision += 1
        if image and not master and set(body) & {"camera_id", "source_collection_id", *catalog.CAPTURE}:
            if catalog.image_result_type(session, image.id) != "master_frame" or "camera_id" in body:
                raise StorageError("INVALID_REQUEST")
            if "source_collection_id" in body:
                source_id = body["source_collection_id"]
                source = catalog.require(session, SubframeCollection, source_id) if source_id else None
                attrs = session.get(AssetAttributes, image.id)
                master_type = desired or ((attrs.attributes or {}).get("master_type", "unknown") if attrs else "unknown")
                if source and master_type != "unknown" and source.frame_type != master_type:
                    raise StorageError("INVALID_CALIBRATION_MASTER")
                image.source_collection_id = source.id if source else None
            values = properties({legacy: body[key] for key, legacy in catalog.CAPTURE.items() if key in body})
            for key, legacy in catalog.CAPTURE.items():
                if legacy in values:
                    setattr(image, key, values[legacy])
        if master:
            kind, row = "calibration_master", master
        if kind == "calibration_master":
            if "camera_id" in body:
                row.camera_id, row.camera_snapshot = catalog.camera_binding(session, body["camera_id"])
            if "source_collection_id" in body:
                source_id = body["source_collection_id"]
                source = catalog.require(session, SubframeCollection, source_id) if source_id else None
                if source and source.frame_type != row.type:
                    raise StorageError("INVALID_CALIBRATION_MASTER")
                row.source_collection_id = source.id if source else None
            values = properties({legacy: body[key] for key, legacy in catalog.CAPTURE.items() if key in body})
            for key, legacy in catalog.CAPTURE.items():
                if legacy in values:
                    setattr(row, key, values[legacy])
        if kind == "subframe_collection":
            frame_type = (catalog.choice(body["frame_type"], catalog.MASTER_TYPES | {"light", "unknown"})
                          if "frame_type" in body else row.frame_type)
            if frame_type != row.frame_type:
                allowed = catalog.binding_types(frame_type)
                bound = session.execute(select(CalibrationBinding, CalibrationMaster.type).join(
                    CalibrationMaster, CalibrationBinding.master_id == CalibrationMaster.id
                ).where(CalibrationBinding.collection_id == row.id))
                for binding, master_type in bound:
                    if master_type not in allowed:
                        session.delete(binding)
                for master_source in session.scalars(select(CalibrationMaster).where(CalibrationMaster.source_collection_id == row.id)):
                    if master_source.type != frame_type:
                        master_source.source_collection_id = None
                sources = session.execute(select(ImageResult, AssetAttributes.attributes).join(
                    AssetAttributes, ImageResult.id == AssetAttributes.asset_id
                ).where(ImageResult.source_collection_id == row.id))
                for image_source, attrs in sources:
                    if (attrs or {}).get("master_type", "unknown") not in ("unknown", frame_type):
                        image_source.source_collection_id = None
                row.frame_type = frame_type
            if "calibration_state" in body:
                row.calibration_state = catalog.choice(body["calibration_state"], {"unknown", "calibrated", "uncalibrated"})
            values = properties({legacy: body[key] for key, legacy in catalog.CAPTURE.items() if key in body})
            for key, legacy in catalog.CAPTURE.items():
                if legacy in values:
                    setattr(row, key, values[legacy])
            if "frame_type" in body or "calibration_state" in body:
                for attrs in session.scalars(select(AssetAttributes).join(Subframe, Subframe.id == AssetAttributes.asset_id)
                                             .where(Subframe.collection_id == row.id)):
                    attrs.attributes = {**attrs.attributes, "usage": row.frame_type, "calibration_state": row.calibration_state}
                    attrs.revision += 1
        if "name" in body:
            new_name = label(body["name"])
            if new_name != row.name:
                rename_directories(session, kind, row.id, new_name)
            row.name = new_name
        if "notes" in body:
            row.notes = label(body["notes"], 4000) if body["notes"] is not None else None
        if set(body) & set(catalog.OPTICAL_FIELDS):
            values = {key: body.get(key, getattr(row, key)) for key in catalog.OPTICAL_FIELDS}
            train_changed = values["equipment_train_id"] != row.equipment_train_id
            if train_changed:
                values.update(filter_id=body.get("filter_id"), filter_state=body.get("filter_state", "unknown"))
            binding = catalog.optical(session, values)
            if not train_changed:
                binding.pop("equipment_snapshot")
            for key, value in binding.items():
                setattr(row, key, value)
            if kind == "calibration_master" and train_changed and "camera_id" not in body:
                row.camera_id, row.camera_snapshot = catalog.inherited_camera_binding(session, row.equipment_snapshot)
        if hasattr(row, "updated_at_utc"):
            row.updated_at_utc = catalog.now()
        row.revision += 1
        catalog.touch_dates(session, row.id)
        if kind == "calibration_master":
            image = image or session.get(ImageResult, row.id)
            if image:
                for key in ("name", "notes", "equipment_train_id", "equipment_snapshot", "filter_state", "filter_id", "filter_snapshot"):
                    setattr(image, key, getattr(row, key))
                image.revision += 1
        if requested_kind == "image_result" and image:
            return catalog.view(service, session, "image_result", image, detail=True)
        return catalog.view(service, session, kind, row, detail=True)


def remove_collection(service, _runtime, request, body):
    fields(body, (), ("revision",))
    with service.db.session(transaction="write") as session:
        row = catalog.require(session, SubframeCollection, request.match_info["id"])
        if "revision" in body:
            catalog.revision(row, body["revision"])
        session.execute(delete(ProjectNode).where(ProjectNode.kind == "subframe_collection", ProjectNode.resource_id == row.id))
        for model in (CalibrationMaster, ImageResult):
            for item in session.scalars(select(model).where(model.source_collection_id == row.id)):
                item.source_collection_id = None
        service.library.remove_collection_assets(session, row.id)
        catalog.forget_dates(session, row.id)
        session.delete(row)
    return {"id": row.id, "deleted": True}


def append_subframes(service, _runtime, request, body):
    from uuid import uuid4
    from ..core.config import load_storage_settings
    from .library import catalog_task

    fields(body, ("sources",))
    with service.db.session(transaction="read") as session:
        catalog.require(session, SubframeCollection, request.match_info["id"])
    payload = {"sources": body["sources"], "append_collection_id": request.match_info["id"],
               "settings_revision": load_storage_settings(service.root)["revision"], "allow_duplicate": False}
    preview = service.imports.preview(payload)
    operation_id = service.imports.import_assets({**payload, "preview_id": preview["preview_id"], "idempotency_key": str(uuid4())})
    return catalog_task(service, {"operation_id": operation_id})


def assignments(service, _runtime, request, body):
    fields(body, ("master_ids",), ("confirmed", "preview", "comparison"))
    keys = identifiers(body["master_ids"])
    for flag in ("confirmed", "preview"):
        if flag in body and type(body[flag]) is not bool:
            raise StorageError("INVALID_REQUEST")
    preview_only = body.get("preview", False)
    with service.db.session(transaction="read" if preview_only else "write") as session:
        collection = catalog.require(session, SubframeCollection, request.match_info["id"])
        rows = catalog.comparisons(session, {"fields": catalog.data(collection), "master_ids": keys})
        if not preview_only:
            catalog.bind(session, collection, keys, body.get("confirmed", False))
        return {"items": rows, "requires_confirmation": False}


def unlink(service, _runtime, request, _body):
    key = tuple(identifier(request.match_info[field]) for field in ("id", "master_id"))
    with service.db.session(transaction="write") as session:
        row = session.get(CalibrationBinding, key)
        if row:
            session.delete(row)
            catalog.touch_dates(session, key[0])
    return {"deleted": True}


def remove_master(service, _runtime, request, body):
    fields(body, (), ("revision",))
    with service.db.session(transaction="write") as session:
        row = catalog.require(session, CalibrationMaster, request.match_info["id"])
        if "revision" in body:
            catalog.revision(row, body["revision"])
        service.library._remove_asset(session, row.id)
        return {"id": row.id, "deleted": True}


def inspect_folder(service, _runtime, request, body):
    fields(body, ("path",))
    root = service.imports.validate_selected_source_path(body["path"])
    if not root.is_dir():
        raise StorageError("INVALID_SOURCES")
    names = []
    from ..assets.imports import MAX_FILES

    for file in service.imports._walk(root):
        names.append(file.relative_to(root).as_posix())
        if len(names) > MAX_FILES:
            raise StorageError("TOO_MANY_FILES")
    names.sort(key=lambda name: (name.casefold(), name))
    if "limit" not in request.query:
        return {"names": names}
    return folder_page(names, request)


def folder_page(names, request):
    limit = int(request.query["limit"])
    after = request.query.get("after")
    if not 1 <= limit <= 100:
        raise StorageError("INVALID_REQUEST")
    if after is not None and after not in names:
        raise StorageError("REVISION_CONFLICT")
    start = names.index(after) + 1 if after is not None else 0
    items = names[start:start + limit]
    return {"items": items, "total": len(names), "next": items[-1] if start + limit < len(names) else None}


def collection_files(service, _runtime, request, _body):
    with service.db.session(transaction="read") as session:
        group = catalog.require(session, SubframeCollection, request.match_info["id"])
        if key := request.match_info.get("file_id"):
            member = catalog.require(session, Subframe, key)
            if member.collection_id != group.id:
                raise StorageError("LIBRARY_RECORD_NOT_FOUND")
            return catalog.collection_members(session, group.id, member_id=member.id)[0]
        limit = int(request.query.get("limit", 50))
        if not 1 <= limit <= 100:
            raise StorageError("INVALID_REQUEST")
        membership = Subframe.collection_id == group.id
        total = session.scalar(select(func.count()).select_from(Subframe).where(membership))
        after_key = None
        if after := request.query.get("after"):
            cursor = session.get(Subframe, identifier(after))
            if cursor is None or cursor.collection_id != group.id:
                raise StorageError("REVISION_CONFLICT")
            after_key = (cursor.frame_index, cursor.id)
        members = catalog.collection_members(session, group.id, after=after_key, limit=limit + 1)
        items = members[:limit]
        if items and request.query.get("view") == "assets":
            ids = ",".join(item["id"] for item in items)
            assets = service.library._search_assets(session, {"asset_ids": ids, "sort": "import_index"})
            by_id = {item["id"]: item for item in assets["items"]}
            items = [by_id[item["id"]] for item in items]
        return {"items": items, "total": total, "collection_name": group.name,
                "next": members[limit - 1]["id"] if len(members) > limit else None}


def remove_file(service, _runtime, request, body):
    fields(body, (), ("revision",))
    with service.db.session(transaction="write") as session:
        ident = request.match_info.get("file_id", request.match_info["id"])
        if "file_id" in request.match_info:
            row = catalog.require(session, Subframe, ident)
            if row.collection_id != request.match_info["id"]:
                raise StorageError("INVALID_LIBRARY_REFERENCE")
            record = catalog.require(session, SubframeCollection, row.collection_id)
            if "revision" in body:
                catalog.revision(record, body["revision"])
            record.revision += 1
            record.updated_at_utc = catalog.now()
            catalog.touch_dates(session, record.id)
        else:
            kind = catalog.choice(request.match_info["resource"], {"image_result", "video"})
            row = catalog.require(session, catalog.MODELS[kind], ident)
            if kind == "image_result":
                row = session.get(CalibrationMaster, row.id) or row
            if "revision" in body:
                catalog.revision(row, body["revision"])
        service.library._remove_asset(session, ident)
        return {"id": ident, "deleted": True}


def add_references(service, _runtime, request, body):
    fields(body, ("parent_path", "assets"))
    items = body["assets"]
    if not isinstance(items, list) or not 1 <= len(items) <= 100:
        raise StorageError("INVALID_REQUEST")
    with service.db.session(transaction="write") as session:
        project = catalog.require(session, Project, request.match_info["id"])
        added = []
        for item in items:
            fields(item, ("kind", "resource_id"), ("name",))
            catalog.choice(item["kind"], {"subframe_collection", "image_result", "video"})
            added.append(projects.save_node(session, project, {**item, "parent_path": body["parent_path"]}))
        return {"items": added}


def linked_masters(service, _runtime, request, _body):
    with service.db.session(transaction="read") as session:
        group = catalog.require(session, SubframeCollection, request.match_info["id"])
        query = select(CalibrationMaster).join(CalibrationBinding, CalibrationBinding.master_id == CalibrationMaster.id)
        rows = session.scalars(query.where(CalibrationBinding.collection_id == group.id).order_by(CalibrationMaster.id))
        return {"items": [catalog.view(service, session, "calibration_master", row) for row in rows]}


def project_route(service, _runtime, request, body):
    method = request.method
    with service.db.session(transaction="read" if method == "GET" else "write") as session:
        key = request.match_info.get("id")
        if method == "POST":
            fields(body, ("name",), ("notes",))
            return projects.save_project(session, body)
        if not key and method == "GET" and "name" not in request.query:
            rows = session.scalars(select(Project).order_by(Project.id))
            return filtered_page([catalog.data(row, ("name_key",)) for row in rows], request.query)
        project = (catalog.require(session, Project, key) if key else
                   projects.find_project(session, request.query.get("name")))
        if method == "PATCH":
            fields(body, (), ("revision", "name", "notes"))
            if "revision" in body:
                catalog.revision(project, body["revision"])
            return projects.save_project(session, body, project.id)
        if method == "DELETE":
            fields(body)
            return projects.remove(session, project)
        if request.query.get("view") == "summary":
            return {"project": catalog.data(project, ("name_key",))}
        rows = projects.nodes(session, project.id)
        if "path" in request.query:
            row = projects.by_path(rows, request.query["path"])
            if request.query.get("view") == "node" and row:
                return {"node": projects.describe(session, row)}
            if request.query.get("view") == "impact":
                descendants = projects.subtree(rows, row.id if row else None)
                return projects.impact(descendants)
            if row and row.kind != "folder":
                kind, resource = projects.resolve_resource(session, row.kind, row.resource_id)
                return {"node": projects.describe(session, row),
                        "resource": catalog.view(service, session, kind, resource, detail=True)}
            descendants = projects.subtree(rows, row.id if row else None)
            if request.query.get("view") == "children":
                parent = row.id if row else None
                entries = [projects.describe(session, child) for child in rows if child.parent_id == parent]
                return {"project": catalog.data(project, ("name_key",)), **filtered_page(entries, request.query)}
            if request.query.get("view") == "descendants":
                base = request.query["path"].rstrip("/")
                paths = {row.id if row else None: base}
                children = {}
                for child in descendants:
                    children.setdefault(child.parent_id, []).append(child)
                for siblings in children.values():
                    siblings.sort(key=lambda child: (child.name_key, child.id))
                entries = []
                stack = list(reversed(children.get(row.id if row else None, [])))
                while stack:
                    child = stack.pop()
                    parent_path = paths[child.parent_id]
                    paths[child.id] = parent_path + "/" + child.name
                    entries.append({**projects.describe(session, child), "parent_path": parent_path})
                    stack.extend(reversed(children.get(child.id, [])))
                return {"project": catalog.data(project, ("name_key",)), **page(entries, request.query),
                        "total": len(entries)}
            rows = descendants
        return {"project": catalog.data(project, ("name_key",)),
                "items": [projects.describe(session, row) for row in rows], **projects.impact(rows)}


def project_node(service, _runtime, request, body):
    with service.db.session(transaction="write") as session:
        project = catalog.require(session, Project, request.match_info["id"])
        key = request.match_info.get("node_id")
        if request.method == "DELETE":
            fields(body)
            row = catalog.require(session, ProjectNode, key)
            if row.project_id != project.id:
                raise StorageError("INVALID_LIBRARY_REFERENCE")
            return projects.remove(session, project, row)
        if key:
            fields(body, (), ("revision", "name", "parent_id", "parent_path"))
            if "revision" in body:
                catalog.revision(catalog.require(session, ProjectNode, key), body["revision"])
        else:
            fields(body, ("kind",), ("name", "parent_id", "parent_path", "resource_id"))
        return projects.save_node(session, project, body, key)


def project_folders(service, _runtime, request, body):
    fields(body, ("paths",))
    with service.db.session(transaction="write") as session:
        project = catalog.require(session, Project, request.match_info["id"])
        return projects.add_folders(session, project, body["paths"])


def catalog_routes():
    return [
        ("GET", "/catalog/projects", project_route, 200),
        ("POST", "/catalog/projects", project_route, 201),
        ("GET", "/catalog/projects/{id}", project_route, 200),
        ("PATCH", "/catalog/projects/{id}", project_route, 200),
        ("DELETE", "/catalog/projects/{id}", project_route, 200),
        ("POST", "/catalog/projects/{id}/folders", project_folders, 201),
        ("POST", "/catalog/source-folder", inspect_folder, 200),
        ("POST", "/catalog/projects/{id}/nodes", project_node, 201),
        ("POST", "/catalog/projects/{id}/references", add_references, 201),
        ("GET", "/catalog/subframe_collection/{id}/files", collection_files, 200),
        ("GET", "/catalog/subframe_collection/{id}/files/{file_id}", collection_files, 200),
        ("POST", "/catalog/subframe_collection/{id}/files", append_subframes, 202),
        ("DELETE", "/catalog/subframe_collection/{id}/files/{file_id}", remove_file, 200),
        ("PATCH", "/catalog/projects/{id}/nodes/{node_id}", project_node, 200),
        ("DELETE", "/catalog/projects/{id}/nodes/{node_id}", project_node, 200),
        ("POST", "/catalog/subframe_collection/{id}/bindings", assignments, 200),
        ("GET", "/catalog/subframe_collection/{id}/bindings", linked_masters, 200),
        ("DELETE", "/catalog/subframe_collection/{id}/bindings/{master_id}", unlink, 200),
        ("DELETE", "/catalog/calibration_master/{id}", remove_master, 200),
        ("DELETE", "/catalog/subframe_collection/{id}", remove_collection, 200),
        ("GET", "/catalog/{resource}", listing, 200),
        ("GET", "/catalog/{resource}/{id}", detail, 200),
        ("PATCH", "/catalog/{resource}/{id}", edit, 200),
        ("DELETE", "/catalog/{resource}/{id}", remove_file, 200),
    ]
