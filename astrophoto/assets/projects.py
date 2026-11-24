"""Project trees organize catalog references without changing file ownership."""

from uuid import uuid4

from sqlalchemy import select

from ..core.errors import StorageError
from ..database.catalog_models import CalibrationMaster, ImageResult, Project, ProjectNode
from .catalog import MODELS, choice, data, image_result_type, name_key, now, require, revision
from .library_rules import identifier, label

KINDS = {"folder", "subframe_collection", "video", "image_result"}


def node_name(value):
    name = label(value)
    if name in {".", ".."} or any(c in name for c in "/\\") or any(ord(c) < 32 for c in name):
        raise StorageError("INVALID_REQUEST")
    return name


def save_project(session, body, key=None):
    row = require(session, Project, key) if key else None
    if row:
        revision(row, body.get("revision"))
    name = label(body.get("name", row.name if row else None))
    normalized = name_key(name)
    other = session.scalar(select(Project).where(Project.name_key == normalized))
    if other and other is not row:
        raise StorageError("REVISION_CONFLICT", details={"name": name})
    notes = body.get("notes", row.notes if row else None)
    notes = label(notes, 4000) if notes is not None else None
    stamp = now()
    if row is None:
        row = Project(id=str(uuid4()), created_at_utc=stamp)
        session.add(row)
    else:
        row.revision += 1
    row.name, row.name_key, row.notes, row.updated_at_utc = name, normalized, notes, stamp
    session.flush()
    return data(row, ("name_key",))


def find_project(session, name):
    row = session.scalar(select(Project).where(Project.name_key == name_key(label(name))))
    if row is None:
        raise StorageError("LIBRARY_RECORD_NOT_FOUND")
    return row


def nodes(session, project_id):
    return list(session.scalars(select(ProjectNode).where(ProjectNode.project_id == project_id)
                                .order_by(ProjectNode.name_key, ProjectNode.id)))


def by_path(rows, path):
    if not isinstance(path, str) or not path.startswith("/"):
        raise StorageError("INVALID_REQUEST")
    index = {(row.parent_id, row.name_key): row for row in rows}
    current = None
    for part in path[1:].split("/") if path != "/" else ():
        current = index.get((current.id if current else None, name_key(node_name(part))))
        if not current:
            raise StorageError("LIBRARY_RECORD_NOT_FOUND")
    return current


def resolve_resource(session, kind, resource_id):
    if kind == "image_result":
        key = identifier(resource_id)
        image = session.get(ImageResult, key)
        if image is None:
            return "calibration_master", require(session, CalibrationMaster, key)
        return kind, image
    return kind, require(session, MODELS[kind], resource_id)


def describe(session, row):
    result = data(row, ("name_key",))
    if row.kind != "folder":
        kind, resource = resolve_resource(session, row.kind, row.resource_id)
        result["resource_name"] = resource.name
        result["asset_type"] = "master_frame" if kind == "calibration_master" else (
            image_result_type(session, row.resource_id) if kind == "image_result" else kind)
        if kind != row.kind:
            result["resource_kind"] = kind
    return result


def add_folders(session, project, paths):
    if not isinstance(paths, list) or not 1 <= len(paths) <= 1000:
        raise StorageError("INVALID_REQUEST")
    rows = nodes(session, project.id)
    index = {(row.parent_id, row.name_key): row for row in rows}
    created = []
    for path in paths:
        if not isinstance(path, str) or not path.startswith("/"):
            raise StorageError("INVALID_REQUEST")
        parent = None
        for part in path[1:].split("/") if path != "/" else ():
            name = node_name(part)
            key = (parent, name_key(name))
            row = index.get(key)
            if row and row.kind != "folder":
                raise StorageError("REVISION_CONFLICT", details={"path": path})
            if row is None:
                row = ProjectNode(id=str(uuid4()), project_id=project.id, parent_id=parent,
                                  name=name, name_key=key[1], kind="folder")
                session.add(row)
                session.flush()
                index[key] = row
                created.append(row)
            parent = row.id
    session.flush()
    return {"items": [describe(session, row) for row in created]}


def save_node(session, project, body, key=None):
    rows = nodes(session, project.id)
    index = {row.id: row for row in rows}
    row = index.get(key) if key else None
    if key and row is None:
        raise StorageError("LIBRARY_RECORD_NOT_FOUND")
    if row:
        revision(row, body.get("revision"))
    kind = row.kind if row else choice(body.get("kind"), KINDS)
    resource_id = row.resource_id if row else body.get("resource_id")
    if kind == "folder" and resource_id is not None:
        raise StorageError("INVALID_REQUEST")
    resource = resolve_resource(session, kind, resource_id)[1] if kind != "folder" else None
    parent_id = body.get("parent_id", row.parent_id if row else None)
    if parent_id is not None and not isinstance(parent_id, str):
        raise StorageError("INVALID_REQUEST")
    if "parent_path" in body:
        if "parent_id" in body:
            raise StorageError("INVALID_REQUEST")
        parent = by_path(rows, body["parent_path"])
        parent_id = parent.id if parent else None
    current = parent_id
    while current is not None:
        parent = index.get(current)
        if parent is None or parent.kind != "folder" or parent is row:
            raise StorageError("INVALID_LIBRARY_REFERENCE")
        current = parent.parent_id
    name = node_name(body.get("name", row.name if row else resource.name if resource else None))
    normalized = name_key(name)
    for item in rows:
        if item is row:
            continue
        if (item.parent_id, item.name_key) == (parent_id, normalized):
            raise StorageError("REVISION_CONFLICT", details={"name": name})
        if resource_id is not None and (item.kind, item.resource_id) == (kind, resource_id):
            names = [item.name]
            parent_id_of_item = item.parent_id
            while parent_id_of_item is not None:
                parent = index[parent_id_of_item]
                names.append(parent.name)
                parent_id_of_item = parent.parent_id
            raise StorageError("REVISION_CONFLICT", details={"existing_path": "/" + "/".join(reversed(names))})
    if row is None:
        row = ProjectNode(id=str(uuid4()), project_id=project.id, kind=kind, resource_id=resource_id)
        session.add(row)
    else:
        row.revision += 1
    row.parent_id, row.name, row.name_key = parent_id, name, normalized
    session.flush()
    return describe(session, row)


def subtree(rows, root):
    children = {}
    for item in rows:
        children.setdefault(item.parent_id, []).append(item)
    stack = list(children.get(root, []))
    found = []
    while stack:
        row = stack.pop()
        found.append(row)
        stack.extend(children.get(row.id, []))
    return found


def impact(rows):
    folders = sum(row.kind == "folder" for row in rows)
    return {"affected_folders": folders, "affected_references": len(rows) - folders}


def remove(session, project, body, node=None):
    row = node if node else project
    revision(row, body.get("revision"))
    descendants = subtree(nodes(session, project.id), node.id if node else None)
    counts = impact(descendants)
    if (descendants or node is None) and body.get("confirmed") is not True:
        raise StorageError("CONFIRMATION_REQUIRED", details=counts)
    session.delete(row)
    return {"id": row.id, "deleted": True, **counts}
