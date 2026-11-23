"""Plan mixed host-file imports using catalog IDs and read-only metadata evidence."""

import json
import math
import os
import re
from collections import defaultdict

from sqlalchemy import select

from ..core.errors import StorageError
from ..database.equipment_models import Equipment, OpticalTrain, OpticalTrainDraft
from ..database.library_models import AssetAttributes, LibraryRecord
from ..database.models import Asset
from ..equipment.service import name_key
from ..equipment.snapshots import validate_train_snapshot
from ..equipment.trains import selected_revisions
from ..storage.manager import fingerprint, source_stat
from .fits import SUFFIXES, image_hdu
from .imports import MAX_FILES
from .library_rules import calibration_differences, identifier, identifiers, label, properties

ITEM_FIELDS = {"path", "attributes", "project_id", "camera_name", "optical_train_name", "master_ids"}
BINDING_FIELDS = {"camera_id", "optical_train_id", "equipment_ids"}
FRAME_TYPES = {
    "light": "light", "object": "light", "dark": "dark", "flat": "flat",
    "bias": "bias", "offset": "bias", "dark flat": "dark_flat", "flat dark": "dark_flat",
    "darkflat": "dark_flat", "flatdark": "dark_flat",
}
CALIBRATION_TYPES = ("bias", "dark", "flat", "dark_flat")
NUMBER_CARDS = {"exposure": "EXPTIME", "gain": "GAIN", "offset": "OFFSET", "temperature": "CCD-TEMP"}


def issue(code, **details):
    return StorageError(code, details=details)


def _header_text(header, *keys):
    for key in keys:
        value = header.get(key)
        if isinstance(value, str) and 0 < len(value.strip()) <= 256:
            return value.strip()
    return None


def _header_number(header, key):
    try:
        value = float(header.get(key))
    except (ValueError, TypeError, OverflowError):
        return None
    return value if math.isfinite(value) else None


def _frame_usage(value):
    if not value:
        return None
    text = re.sub(r"[\s_-]+", " ", value.casefold()).removesuffix(" frame")
    return FRAME_TYPES.get(text)


def _path_usage(path):
    text = re.sub(r"[\s_-]+", " ", path.stem.casefold()).split()
    if text[:2] in (["dark", "flat"], ["flat", "dark"]):
        return "dark_flat"
    leading = FRAME_TYPES.get(text[0]) if text else None
    folder = _frame_usage(path.parent.name)
    if leading and folder and leading != folder:
        raise issue("MATCH_CONFLICT", field="usage", filename=leading, folder=folder)
    return leading or folder


def _fits_evidence(path):
    if path.suffix.casefold() not in SUFFIXES:
        suffix = path.suffix.casefold()
        kind = "video" if suffix in {".ser", ".avi", ".mp4", ".mov"} else (
            "image" if suffix in {".png", ".jpg", ".jpeg", ".tif", ".tiff", ".xisf"} else None
        )
        return ({"file_kind": kind} if kind else {}), {}
    try:
        from astropy.io import fits
    except ImportError as exc:
        raise StorageError("FITS_DEPENDENCY_UNAVAILABLE") from exc
    try:
        with fits.open(path, mode="readonly", memmap=True, do_not_scale_image_data=True) as hdus:
            index, hdu = image_hdu(hdus)
            header = hdus[0].header.copy()
            if index:
                header.update(hdu.header)
            cards = {
                "camera": _header_text(header, "INSTRUME", "CAMERA"),
                "optical_train": _header_text(header, "APTRAIN", "OPTTRAIN"),
                "optics": _header_text(header, "TELESCOP"),
                "frame_type": _header_text(header, "IMAGETYP", "FRAME"),
                "target": _header_text(header, "OBJECT"),
            }
            attrs = {"file_kind": "image", "filter": _header_text(header, "FILTER")}
            usage = _frame_usage(cards["frame_type"])
            if usage:
                attrs.update(usage=usage, role="raw")
            if usage == "light":
                attrs["target"] = _header_text(header, "OBJECT")
            for field, key in NUMBER_CARDS.items():
                attrs[field] = _header_number(header, key)
            if attrs["exposure"] is not None and attrs["exposure"] < 0:
                attrs["exposure"] = None
            bx = _header_number(header, "XBINNING")
            by = _header_number(header, "YBINNING")
            if bx and by and bx > 0 and by > 0 and bx.is_integer() and by.is_integer():
                attrs["binning"] = f"{int(bx)}x{int(by)}"
    except (OSError, ValueError, TypeError, IndexError) as exc:
        raise StorageError("FITS_INVALID") from exc
    return {key: value for key, value in attrs.items() if value is not None}, {
        key: value for key, value in cards.items() if value is not None
    }


def _same(expected, observed):
    if isinstance(expected, str) and isinstance(observed, str):
        return name_key(expected) == name_key(observed)
    return expected == observed


def _aliases(equipment):
    return {name_key(value) for value in (
        equipment.name, equipment.model,
        " ".join(v for v in (equipment.manufacturer, equipment.model) if v),
    ) if value}


def _named(rows, hint, aliases):
    return {uid for uid, record in rows.items() if name_key(hint) in aliases(record)} if hint else set()


class PlanningCatalog:
    def __init__(self, session):
        self.session = session
        self.equipment = {row.id: row for row in session.scalars(select(Equipment).where(
            Equipment.archived_at_utc.is_(None),
        ))}
        self.cameras = {uid: row for uid, row in self.equipment.items() if row.equipment_type == "camera"}
        self.optics = {uid: row for uid, row in self.equipment.items() if row.equipment_type == "primary_optics"}
        self.trains = {row.id: row for row in session.scalars(select(OpticalTrain).where(
            OpticalTrain.archived_at_utc.is_(None), OpticalTrain.deleted_at_utc.is_(None),
        ))}
        self.configurations = {}
        self.projects = {}
        self.project_versions = {}
        for row in session.scalars(select(LibraryRecord).where(LibraryRecord.kind == "projects")):
            self.projects[row.id] = row.data
            self.project_versions[row.id] = row.revision
        self.masters = {}
        self.master_versions = {}
        statement = (
            select(LibraryRecord, Asset, AssetAttributes)
            .join(Asset, Asset.id == LibraryRecord.data["asset_id"].as_string())
            .join(AssetAttributes, AssetAttributes.asset_id == Asset.id)
            .where(LibraryRecord.kind == "masters")
            .order_by(LibraryRecord.id)
        )
        for row, asset, attrs in session.execute(statement):
            self.masters[row.id] = ({"id": row.id, "name": asset.name, "usage": row.data["usage"]}, attrs.attributes)
            self.master_versions[row.id] = [row.revision, attrs.revision]

    def configuration(self, uid):
        if uid not in self.configurations:
            draft = self.session.get(OpticalTrainDraft, uid)
            if draft:
                config = draft.draft_json
            else:
                latest, default = selected_revisions(self.session, self.trains[uid])
                revision = default or latest
                config = validate_train_snapshot(revision.snapshot_json, uid, revision.id) if revision else {}
            self.configurations[uid] = config
        return self.configurations[uid]


def _select_match(field, rows, aliases, explicit, explicit_name, observed):
    exact = _named(rows, explicit_name, aliases)
    header = _named(rows, observed, aliases)
    if explicit and explicit not in rows:
        raise issue("INVALID_LIBRARY_REFERENCE", field=field, id=explicit)
    if (explicit_name and not exact) or (observed and not header and not explicit):
        raise issue("MATCH_NOT_FOUND", field=field, value=explicit_name or observed)
    cues = [values for values in ({explicit} if explicit else set(), exact, header) if values]
    if not cues:
        return None
    matches = set.intersection(*cues)
    if len(matches) != 1:
        ids = sorted(matches or set.union(*cues))
        raise issue("MATCH_AMBIGUOUS" if matches else "MATCH_CONFLICT", field=field,
                    candidates=[{"id": uid, "name": rows[uid].name} for uid in ids])
    return next(iter(matches))


def _project(catalog, item, attributes):
    if "project_id" in item:
        value = item["project_id"]
        if value is not None and identifier(value) not in catalog.projects:
            raise issue("INVALID_LIBRARY_REFERENCE", field="project_id", id=value)
        return value
    target = attributes.get("target")
    if not target or attributes.get("usage") != "light":
        return None
    matches = [uid for uid, project in catalog.projects.items() if any(
        isinstance(value, str) and _same(value, target) for value in (project.get("name"), project.get("target"))
    )]
    if len(matches) > 1:
        raise issue("MATCH_AMBIGUOUS", field="project_id", candidates=[
            {"id": uid, "name": catalog.projects[uid]["name"]} for uid in matches
        ])
    return matches[0] if matches else None


def _equipment(catalog, item, supplied, observed, usage):
    skip_camera = "camera_id" in supplied and supplied["camera_id"] is None
    skip_train = "optical_train_id" in supplied and supplied["optical_train_id"] is None
    # A combination the user named or identified is never discarded because its saved
    # configuration still lacks a field; missing fields are reported instead.
    chosen_train = bool(supplied.get("optical_train_id") or item.get("optical_train_name"))
    camera = None if skip_camera else _select_match(
        "camera_id", catalog.cameras, _aliases, supplied.get("camera_id"), item.get("camera_name"),
        observed.get("camera"),
    )
    train = None if skip_train else _select_match(
        "optical_train_id", catalog.trains, lambda row: {name_key(row.name)},
        supplied.get("optical_train_id"), item.get("optical_train_name"), observed.get("optical_train"),
    )
    gaps = []
    if not skip_train and usage in {"light", "flat"} and (camera or train or observed.get("optics")):
        optics = _named(catalog.optics, observed.get("optics"), _aliases)
        if observed.get("optics") and not optics and not supplied.get("optical_train_id"):
            raise issue("MATCH_NOT_FOUND", field="primary_optics_id", value=observed["optics"])
        matches = []
        missing_fields = set()
        for uid in (train,) if train else catalog.trains:
            config = catalog.configuration(uid)
            missed = None
            if optics:
                saved = config.get("primary_optics_id")
                if saved is None:
                    missed = "missing"
                elif saved not in optics:
                    missed = "conflict"
            if missed != "conflict" and camera:
                saved = config.get("camera_id")
                if saved is None:
                    missed = missed or "missing"
                elif saved != camera:
                    missed = "conflict"
            if missed == "conflict":
                continue
            if missed == "missing":
                missing_fields.add(uid)
                if not chosen_train:
                    continue
            matches.append(uid)
        if len(matches) > 1:
            raise issue("MATCH_AMBIGUOUS", field="optical_train_id", candidates=[
                {"id": uid, "name": catalog.trains[uid].name} for uid in matches
            ])
        if matches:
            train = matches[0]
            if train in missing_fields:
                gaps.append("optical_train_id")
        elif chosen_train:
            raise issue("MATCH_CONFLICT", field="optical_train_id")
        elif train or optics:
            raise issue("MATCH_INCOMPLETE" if missing_fields else "MATCH_CONFLICT", field="optical_train_id")
    if train:
        paired_camera = catalog.configuration(train).get("camera_id")
        if paired_camera is not None and camera and paired_camera != camera:
            raise issue("MATCH_CONFLICT", field="camera_id", camera_id=camera, optical_train_id=train)
        if paired_camera is None and camera:
            gaps.append("camera_id")
        if not skip_camera and paired_camera in catalog.cameras:
            camera = paired_camera
    if usage in {"light", "flat", "dark", "bias", "dark_flat"} and not (camera or train or skip_camera):
        raise issue("MATCH_INCOMPLETE", field="camera_id")
    equipment_ids = supplied.get("equipment_ids") or []
    if any(uid not in catalog.equipment for uid in equipment_ids):
        raise issue("INVALID_LIBRARY_REFERENCE", field="equipment_ids")
    binding = {key: value for key, value in {
        "camera_id": camera, "optical_train_id": train, "equipment_ids": equipment_ids,
    }.items() if value}
    return binding, gaps


def _calibration(catalog, item, attrs, auto_calibration):
    explicit = "master_ids" in item
    chosen = identifiers(item["master_ids"]) if explicit else []
    if len(chosen) > len(CALIBRATION_TYPES) or chosen and attrs.get("usage") != "light":
        raise issue("INVALID_REQUEST", field="master_ids")
    if attrs.get("usage") != "light":
        return [], {"strategy": "not_applicable", "matched_usage": [], "unmatched_usage": []}
    if (explicit and not chosen) or (not explicit and not auto_calibration):
        return [], {"strategy": "import_only", "matched_usage": [], "unmatched_usage": []}
    groups = defaultdict(list)
    differences = {}
    for master_id in chosen if explicit else catalog.masters:
        if master_id not in catalog.masters:
            raise issue("INVALID_LIBRARY_REFERENCE", field="master_ids", id=master_id)
        master, attributes = catalog.masters[master_id]
        usage = master["usage"]
        if usage not in CALIBRATION_TYPES:
            if explicit:
                raise issue("INVALID_LIBRARY_REFERENCE", field="master_ids", id=master_id)
            continue
        delta = calibration_differences(attributes, [attrs], usage)
        if any(delta.values()):
            if not explicit:
                continue
            # The chat confirmation is the user's explicit acceptance of these
            # differences, matching the library's existing confirmed-assignment rule.
            differences[master_id] = {"conflicts": delta["conflicts"], "unknown": delta["unknown"]}
        groups[usage].append(master)
    for usage, matches in groups.items():
        if len(matches) > 1:
            raise issue("MATCH_AMBIGUOUS", field="master_ids", usage=usage, candidates=matches)
    matches = [groups[usage][0] for usage in CALIBRATION_TYPES if groups.get(usage)]
    evidence = {
        "strategy": "selected" if explicit else "unique_compatible",
        "matched_usage": [master["usage"] for master in matches],
        "unmatched_usage": [] if explicit else [usage for usage in CALIBRATION_TYPES if usage not in groups],
    }
    if differences:
        evidence["differences"] = differences
    return matches, evidence


def _item(catalog, service, item, auto_calibration, seen):
    if (not isinstance(item, dict) or item.keys() - ITEM_FIELDS or not isinstance(item.get("path"), str)
            or not item["path"] or any(key in item and not isinstance(item[key], str)
                                      for key in ("camera_name", "optical_train_name"))):
        raise StorageError("INVALID_REQUEST")
    for field in ("camera_name", "optical_train_name"):
        if field in item:
            label(item[field], 256)
    source = service.imports.validate_selected_source_path(item["path"])
    stamp = fingerprint(source_stat(source))
    key = os.path.normcase(os.fspath(source))
    identity = tuple(stamp[3:]) if stamp[-1] else None
    if key in seen or identity in seen:
        raise StorageError("DUPLICATE_ASSET")
    seen.add(key)
    if identity is not None:
        seen.add(identity)
    inferred, observed = _fits_evidence(source)
    if stamp != fingerprint(source_stat(source)):
        raise StorageError("SOURCE_CHANGED")
    supplied = properties(item.get("attributes", {}))
    if inferred.get("file_kind") == "image" and not inferred.get("usage") and not supplied.get("usage"):
        path_usage = _path_usage(source)
        if path_usage:
            inferred["usage"] = path_usage
            observed["filename_usage"] = path_usage
    if (supplied.get("usage", inferred.get("usage")) == "light" and observed.get("target")
            and "target" not in inferred):
        inferred["target"] = observed["target"]
    for field in ("file_kind", "usage", "filter", "target", *NUMBER_CARDS, "binning"):
        if field in supplied and field in inferred and not _same(supplied[field], inferred[field]):
            raise issue("MATCH_CONFLICT", field=field, supplied=supplied[field], observed=inferred[field])
    attrs = {**inferred, **{key: value for key, value in supplied.items() if key not in BINDING_FIELDS}}
    if not attrs.get("file_kind") or attrs["file_kind"] == "unknown":
        raise issue("MATCH_INCOMPLETE", field="file_kind")
    if attrs["file_kind"] == "image" and not attrs.get("usage"):
        raise issue("MATCH_INCOMPLETE", field="usage")
    if attrs["file_kind"] == "image" and attrs.get("usage") in FRAME_TYPES.values():
        attrs.setdefault("role", "raw")
    equipment, gaps = _equipment(catalog, item, supplied, observed, attrs.get("usage"))
    project_id = _project(catalog, item, attrs)
    masters, matches = _calibration(catalog, item, {**attrs, **equipment}, auto_calibration)
    binding = {**equipment}
    if masters:
        binding["master_ids"] = [row["id"] for row in masters]
    camera = catalog.cameras.get(binding.get("camera_id"))
    train = catalog.trains.get(binding.get("optical_train_id"))
    device_ids = set(binding.get("equipment_ids", []))
    if camera:
        device_ids.add(camera.id)
    versions = {
        "equipment": {uid: catalog.equipment[uid].row_version for uid in sorted(device_ids)},
        "masters": {master["id"]: catalog.master_versions[master["id"]] for master in masters},
    }
    group = {
        "attributes": attrs, "binding": binding, "master_labels": masters, "calibration": matches,
        "target_versions": versions,
    }
    if gaps:
        group["configuration_gaps"] = sorted(set(gaps))
    if project_id:
        group.update(project_id=project_id, project_name=catalog.projects[project_id]["name"])
        versions["project"] = catalog.project_versions[project_id]
    if camera:
        group["camera_name"] = camera.name
    if train:
        group["optical_train_name"] = train.name
        versions["train"] = train.row_version
    evidence = {"source_metadata": {**inferred, **observed}, "supplied": supplied, "calibration": matches,
                "configuration_gaps": sorted(set(gaps))}
    return group, str(source), stamp, evidence


def plan_agent_import(service, body):
    """Return stable, ordered homogeneous groups and per-file unresolved issues."""
    if (not isinstance(body, dict) or body.keys() - {"items", "auto_calibration"}
            or not isinstance(body.get("items"), list) or not 1 <= len(body["items"]) <= MAX_FILES
            or type(body.get("auto_calibration", True)) is not bool):
        raise StorageError("INVALID_REQUEST")
    groups, unresolved, seen = {}, [], set()
    with service.db.session(transaction="read") as session:
        catalog = PlanningCatalog(session)
        for index, item in enumerate(body["items"], 1):
            try:
                group, source, stamp, evidence = _item(catalog, service, item, body.get("auto_calibration", True), seen)
            except StorageError as exc:
                if exc.code == "DATABASE_INVALID":
                    raise
                unresolved.append({"index": index, "path": item.get("path") if isinstance(item, dict) else None,
                                   "issues": [{"code": exc.code, **(exc.details or {})}]})
                continue
            key = json.dumps(group, ensure_ascii=False, sort_keys=True)
            result = groups.setdefault(key, {**group, "sources": [], "items": []})
            result["sources"].append(source)
            result["items"].append({"index": index, "path": source, "fingerprint": stamp, "evidence": evidence})
    return {"groups": list(groups.values()), "unresolved": unresolved}
