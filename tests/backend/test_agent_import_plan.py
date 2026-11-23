from uuid import uuid4

import numpy as np
import pytest
from astropy.io import fits
from sqlalchemy import select

from astrophoto.assets.agent_import_plan import plan_agent_import
from astrophoto.database.library_models import AssetAttributes, LibraryRecord
from astrophoto.database.models import Asset
from astrophoto.storage.manager import fingerprint, source_stat
from astrophoto.storage.runtime import StorageRuntime


@pytest.fixture
def runtime(tmp_path):
    service = StorageRuntime.initialize(tmp_path / "data", {})
    try:
        yield service
    finally:
        service.close()


def make_train(runtime, *, name="Deep sky"):
    camera = runtime.equipment.create_equipment({
        "equipment_type": "camera", "name": "Main camera", "manufacturer": "ZWO", "model": "ASI2600",
    })
    optics = runtime.equipment.create_equipment({"equipment_type": "primary_optics", "name": "RedCat"})
    train = runtime.optical_trains.create_train({
        "name": name, "draft": {"name": name, "camera_id": camera["id"], "primary_optics_id": optics["id"]},
    })
    return camera, optics, train


def write_frame(directory, name, **values):
    cards = {"IMAGETYP": "Light Frame", "INSTRUME": "ZWO ASI2600", "TELESCOP": "RedCat", "OBJECT": "M31",
             "FILTER": "Ha", "GAIN": 100, "OFFSET": 50, "XBINNING": 1, "YBINNING": 1, "EXPTIME": 60,
             "CCD-TEMP": -10}
    cards.update(values)
    header = fits.Header({k: v for k, v in cards.items() if v is not None})
    path = directory / name
    fits.writeto(path, np.zeros((2, 2), dtype=np.uint16), header)
    return path


def add_master(runtime, usage, **attributes):
    asset_id = str(uuid4())
    attrs = {"usage": usage, "role": "calibration_master", "gain": 100, "offset": 50, "binning": "1x1",
             "exposure": 60, "temperature": -10, **attributes}
    with runtime.db.session(transaction="write") as session:
        session.add(Asset(id=asset_id, name=f"Master_{usage}.fits", size_bytes=0, mtime_ns=0))
        session.flush()
        session.add(AssetAttributes(asset_id=asset_id, attributes=attrs))
        row = runtime.library._save(session, "masters", {"asset_id": asset_id, "usage": usage})
        result = row.id
    return result


def test_mixed_selected_paths_group_by_target_conditions_and_bindings(runtime, tmp_path):
    camera, _, train = make_train(runtime)
    project = runtime.library.write("projects", {"name": "Andromeda", "target": "M31"})
    dark = add_master(runtime, "dark", camera_id=camera["id"])
    flat = add_master(runtime, "flat", camera_id=camera["id"], optical_train_id=train["id"], filter="Ha")
    original = [
        write_frame(tmp_path, "ha-01.fits"),
        write_frame(tmp_path, "oiii.fits", FILTER="OIII"),
        write_frame(tmp_path, "ha-02.fits"),
        write_frame(tmp_path, "different-object.fits", OBJECT="M33"),
        write_frame(tmp_path, "different-exposure.fits", EXPTIME=30),
        write_frame(tmp_path, "dark.fits", IMAGETYP="Dark Frame", OBJECT=None, FILTER=None),
        write_frame(tmp_path, "unknown.fits", INSTRUME="Unregistered camera"),
    ]
    paths = [{"path": str(p)} for p in original]
    plan = plan_agent_import(runtime, {"items": paths})
    assert [len(group["items"]) for group in plan["groups"]] == [2, 1, 1, 1, 1]
    ha, oiii, other_target, short, dark_group = plan["groups"]
    assert ha["sources"] == [str(original[0]), str(original[2])]
    assert [item["index"] for item in ha["items"]] == [1, 3]
    assert ha["items"][0]["fingerprint"] == fingerprint(source_stat(original[0]))
    assert ha["project_id"] == project["id"]
    assert ha["binding"] == {"camera_id": camera["id"], "optical_train_id": train["id"], "master_ids": [dark, flat]}
    assert ha["target_versions"] == {
        "equipment": {camera["id"]: camera["row_version"]},
        "train": train["row_version"], "masters": {dark: [1, 1], flat: [1, 1]}, "project": project["revision"],
    }
    assert {row["name"] for row in ha["master_labels"]} == {"Master_flat.fits", "Master_dark.fits"}
    assert oiii["binding"]["master_ids"] == [dark]
    assert "flat" in oiii["items"][0]["evidence"]["calibration"]["unmatched_usage"]
    assert other_target["attributes"]["target"] == "M33" and "project_id" not in other_target
    assert short["binding"]["master_ids"] == [flat]
    assert dark_group["attributes"]["usage"] == "dark" and dark_group["binding"] == {"camera_id": camera["id"]}
    assert "camera_id" not in ha["attributes"] and "optical_train_id" not in ha["attributes"]
    assert [row["issues"][0]["code"] for row in plan["unresolved"]] == ["MATCH_NOT_FOUND"]
    with runtime.db.session() as session:
        assert len(list(session.scalars(select(Asset)))) == 2
        assert {row.kind for row in session.scalars(select(LibraryRecord))} == {"projects", "masters"}


def test_ambiguous_equipment_and_calibration_require_explicit_selection(runtime, tmp_path):
    camera, optics, train = make_train(runtime)
    second = runtime.optical_trains.create_train({
        "name": "Second setup",
        "draft": {"name": "Second setup", "camera_id": camera["id"], "primary_optics_id": optics["id"]},
    })
    first_master = add_master(runtime, "dark", camera_id=camera["id"])
    second_master = add_master(runtime, "dark", camera_id=camera["id"])
    file = write_frame(tmp_path, "frame.fits")
    item = {"path": str(file)}
    ambiguous = plan_agent_import(runtime, {"items": [item]})["unresolved"][0]["issues"][0]
    assert ambiguous["field"] == "optical_train_id"
    assert {entry["id"] for entry in ambiguous["candidates"]} == {train["id"], second["id"]}
    item["optical_train_name"] = "deep sky"
    ambiguous = plan_agent_import(runtime, {"items": [item]})["unresolved"][0]["issues"][0]
    assert ambiguous["field"] == "master_ids"
    assert {entry["id"] for entry in ambiguous["candidates"]} == {first_master, second_master}
    item["master_ids"] = [first_master]
    selected = plan_agent_import(runtime, {"items": [item]})["groups"][0]
    assert selected["binding"]["master_ids"] == [first_master]
    item["master_ids"] = []
    assert "master_ids" not in plan_agent_import(runtime, {"items": [item]})["groups"][0]["binding"]


def test_no_unsafe_source_or_calibration_guess(runtime, tmp_path):
    camera, _, train = make_train(runtime)
    mismatched = add_master(runtime, "dark", camera_id=camera["id"], exposure=180)
    source = write_frame(tmp_path, "frame.fits")
    forbidden = runtime.root / "userdata.fits"
    fits.writeto(forbidden, np.zeros((1, 1), dtype=np.uint16))
    invalid = plan_agent_import(runtime, {"items": [
        {"path": str(source), "attributes": {"exposure": 1234}},
        {"path": str(forbidden)}, {"path": str(tmp_path)},
    ]})
    assert not invalid["groups"]
    assert [entry["issues"][0]["code"] for entry in invalid["unresolved"]] == [
        "MATCH_CONFLICT", "SOURCE_NOT_AUTHORIZED", "SOURCE_NOT_AUTHORIZED",
    ]
    plan = plan_agent_import(runtime, {"items": [
        {"path": str(source), "attributes": {"optical_train_id": train["id"]}, "master_ids": [mismatched]},
    ]})
    assert not plan["unresolved"]
    assert plan["groups"][0]["calibration"]["differences"] == {
        mismatched: {"conflicts": ["exposure"], "unknown": []},
    }


def test_explicit_calibration_differences_are_reported_and_confirmed(runtime, tmp_path):
    camera, _, train = make_train(runtime)
    mismatched = add_master(runtime, "dark", camera_id=camera["id"], exposure=180)
    frame = write_frame(tmp_path, "frame.fits")
    planned = plan_agent_import(runtime, {"items": [
        {"path": str(frame), "attributes": {"optical_train_id": train["id"]}, "master_ids": [mismatched]},
    ]})
    assert not planned["unresolved"]
    group = planned["groups"][0]
    assert group["binding"]["master_ids"] == [mismatched]
    assert group["calibration"]["strategy"] == "selected"
    assert group["calibration"]["matched_usage"] == ["dark"]
    assert group["calibration"]["differences"] == {mismatched: {"conflicts": ["exposure"], "unknown": []}}


def test_missing_calibration_cards_are_reported_separately_from_conflicts(runtime, tmp_path):
    camera, _, train = make_train(runtime)
    master = add_master(runtime, "dark", camera_id=camera["id"])
    frame = write_frame(tmp_path, "frame.fits", GAIN=None, **{"CCD-TEMP": None})
    planned = plan_agent_import(runtime, {"items": [
        {"path": str(frame), "attributes": {"optical_train_id": train["id"]}, "master_ids": [master]},
    ]})
    assert not planned["unresolved"]
    differences = planned["groups"][0]["calibration"]["differences"]
    assert differences == {master: {"conflicts": [], "unknown": ["gain", "temperature"]}}


def test_incomplete_optical_train_reports_missing_fields_instead_of_conflict(runtime, tmp_path):
    camera, _, complete = make_train(runtime)
    partial = runtime.optical_trains.create_train({
        "name": "Partial rig", "draft": {"name": "Partial rig", "camera_id": camera["id"]},
    })
    runtime.optical_trains.set_archived(complete["id"], complete["row_version"], True)
    frame = write_frame(tmp_path, "frame.fits")
    inferred = plan_agent_import(runtime, {"items": [{"path": str(frame)}]})
    error = inferred["unresolved"][0]["issues"][0]
    assert error["code"] == "MATCH_INCOMPLETE" and error["field"] == "optical_train_id"
    explicit = plan_agent_import(runtime, {"items": [
        {"path": str(frame), "optical_train_name": "Partial rig"},
    ]})
    group = explicit["groups"][0]
    assert group["binding"]["optical_train_id"] == partial["id"]
    assert group["configuration_gaps"] == ["optical_train_id"]
    assert group["items"][0]["evidence"]["configuration_gaps"] == ["optical_train_id"]
    assert explicit["groups"][0]["binding"]["camera_id"] == camera["id"]


def test_filename_evidence_and_explicit_non_fits_classification(runtime, tmp_path):
    camera, _, _ = make_train(runtime)
    dark = write_frame(tmp_path, "Dark-001.fits", IMAGETYP=None)
    png = tmp_path / "science.png"
    png.write_bytes(b"fixture")
    planned = plan_agent_import(runtime, {"items": [
        {"path": str(dark)},
        {"path": str(png), "attributes": {"usage": "light", "camera_id": camera["id"]}, "master_ids": []},
    ]})
    first, second = planned["groups"]
    assert first["attributes"]["usage"] == "dark"
    assert first["items"][0]["evidence"]["source_metadata"]["filename_usage"] == "dark"
    assert second["attributes"]["file_kind"] == "image"
    assert second["calibration"]["strategy"] == "import_only"


def test_name_lookup_excludes_deleted_optical_train_but_allows_new_same_name(runtime, tmp_path):
    camera, optics, old = make_train(runtime)
    frame = write_frame(tmp_path, "reassigned.fits", APTRAIN="Deep sky")
    runtime.optical_trains.delete_train(old["id"], old["row_version"])
    new = runtime.optical_trains.create_train({
        "name": old["name"],
        "draft": {"name": old["name"], "camera_id": camera["id"], "primary_optics_id": optics["id"]},
    })
    proposal = plan_agent_import(runtime, {"items": [{"path": str(frame)}]})
    assert proposal["groups"][0]["binding"]["optical_train_id"] == new["id"]
    stale = plan_agent_import(runtime, {"items": [
        {"path": str(frame), "attributes": {"optical_train_id": old["id"]}},
    ]})
    assert stale["unresolved"][0]["issues"][0]["code"] == "INVALID_LIBRARY_REFERENCE"
