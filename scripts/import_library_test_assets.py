"""Import a generated fixture manifest through the local AstroPhoto HTTP API.

Run with ROOT (the directory containing manifest.json) and --data-root pointing
at the expected AstroPhoto data root. Use --execute to perform imports; without
it the script resolves and prints the complete plan without writing to the API.
An optional --mapping JSON object maps manifest paths to objects containing
train_name, filter_name and/or catalog overrides. Existing records are not
silently overwritten. Results are printed as JSON lines for auditability.
"""
from __future__ import annotations

import argparse
import json
import sys
import time
from pathlib import Path
from urllib.error import HTTPError
from urllib.parse import urlencode
from urllib.request import Request, build_opener, ProxyHandler
from uuid import uuid4

from seed_equipment_fixture import DEVICES, MORE, SECOND_DEVICES

BASE = "http://127.0.0.1:8188/astrophoto/v1"
HEADERS = {"X-AstroPhoto-Local": "1", "Sec-Fetch-Site": "same-origin"}
OPENER = build_opener(ProxyHandler({}))


def request(method, path, body=None):
    data = json.dumps(body, ensure_ascii=False).encode("utf-8") if body is not None else None
    headers = {**HEADERS, **({"Content-Type": "application/json"} if data is not None else {})}
    req = Request(BASE + path, data=data, headers=headers, method=method)
    try:
        with OPENER.open(req, timeout=60) as response:
            return json.load(response)
    except HTTPError as exc:
        raise RuntimeError(f"{method} {path}: HTTP {exc.code}: {exc.read().decode('utf-8', 'replace')}") from exc


def all_pages(path):
    rows, after = [], None
    while True:
        query = {"limit": 100}
        if after:
            query["after"] = after
        page = request("GET", path + "?" + urlencode(query))
        rows.extend(page["items"])
        if not page["next"]:
            return rows
        if page["next"] == after:
            raise RuntimeError(f"Repeated pagination cursor for {path}")
        after = page["next"]


def safe_path(root, relative):
    path = (root / relative).resolve()
    if not path.is_relative_to(root) or not path.exists():
        raise ValueError(f"Manifest path missing or outside source root: {relative}")
    return path


def optical(train_name, filter_name, trains):
    if not train_name:
        raise ValueError("Subframe groups and videos require an explicit train_name")
    if train_name not in trains:
        raise ValueError(f"Unknown equipment train: {train_name}")
    train = trains[train_name]
    data = {"equipment_train_id": train["id"], "filter_state": "none" if filter_name is None else "selected"}
    if filter_name is not None:
        matches = [row for row in train["components"] if row["id"] in train["filter_ids"] and row["name"] == filter_name]
        if len(matches) != 1:
            raise ValueError(f"Filter {filter_name!r} is not uniquely present in train {train_name!r}")
        data["filter_id"] = matches[0]["id"]
    return data


def make_tasks(root, manifest, mapping, trains):
    tasks = []
    entries = mapping.get("entries", {})
    for group in manifest["groups"]:
        rel = group["path"]
        meta = {**group, **entries.get(rel, {})}
        params = group.get("named_parameters") or {}
        frame = str(params.get("frame_type") or "unknown").lower().replace("darkflat", "dark_flat")
        config = {"kind": "subframe_collection", "name": Path(rel).name, "frame_type": frame,
                  "calibration_state": "uncalibrated", **optical(meta.get("train_name"), meta.get("filter_name"), trains)}
        if params.get("settings") == "gain100":
            config.update(gain=100, binning="1")
        if params.get("temperature_c") is not None:
            config["temperature_c"] = params["temperature_c"]
        exposure = params.get("exposure")
        if isinstance(exposure, str) and exposure.endswith("s"):
            config["exposure_seconds"] = float(exposure[:-1])
        config.update(meta.get("catalog", {}))
        tasks.append({"path": rel, "source": str(safe_path(root, rel)), "catalog": config,
                      "project_path": meta.get("project_path", "/Raw/" + frame), "expected_count": group["count"], "mode": meta.get("mode", "copy")})
    for file in manifest["files"]:
        rel = file["path"]
        kind = file["import_entry"]
        if kind in {"subframe_collection", "edge_case"}:
            continue
        meta = {**file, **entries.get(rel, {})}
        source = safe_path(root, rel)
        if kind == "video":
            config = {"kind": "video", "name": source.stem,
                      **optical(meta.get("train_name"), meta.get("filter_name"), trains)}
        elif kind in {"master_frame", "image_result"}:
            config = {"kind": "image_result", "name": source.stem, "result_type": kind}
        elif kind == "calibration_master":
            config = {"kind": "calibration_master", "name": source.stem, "type": file["category"]}
            if "gain100" in source.stem:
                config.update(gain=100, binning="1")
            for token in source.stem.split("_"):
                if token.endswith("s") and token[:-1].isdigit():
                    config["exposure_seconds"] = float(token[:-1])
                if token.endswith("C") and token[:-1].lstrip("-").isdigit():
                    config["temperature_c"] = float(token[:-1])
            if meta.get("train_name"):
                config.update(optical(meta["train_name"], meta.get("filter_name"), trains))
        else:
            raise ValueError(f"Unsupported import entry: {kind!r}")
        config.update(meta.get("catalog", {}))
        default_path = {"video": "/Videos", "master_frame": "/Integrate", "image_result": "/Processed"}.get(kind)
        tasks.append({"path": rel, "source": str(source), "catalog": config,
                      "project_path": meta.get("project_path", default_path), "expected_count": 1, "mode": meta.get("mode", "reference" if source.stem == "Sun_ASI662MC" else "copy")})
    return tasks


def seed_equipment():
    fixtures = {"设备1": DEVICES, "设备2": SECOND_DEVICES, **{f"设备{i}": rows for i, rows in MORE.items()}}
    fixtures["深空彩色宽场"] = [("camera", "ZWO ASI2600MC Pro"), ("primary_optics", "RedCat 51")]
    fixtures["便携相机待配镜筒"] = [("camera", "Canon EOS Ra")]
    devices = {row["name"]: row for row in all_pages("/equipment")}
    trains = {row["name"] for row in all_pages("/optical-trains")}
    for name, rows in fixtures.items():
        if name in trains:
            continue
        members = {}
        for category, model in rows:
            if model not in devices:
                devices[model] = request("POST", "/equipment", {"name": model, "product_name": model, "equipment_type": category})
            members.setdefault(category, []).append(devices[model]["id"])
        payload = {"name": name, "filter_ids": members.get("filter", []), "other_ids": members.get("other", [])}
        for category, field in (("camera", "camera_id"), ("primary_optics", "primary_optics_id"),
                                ("optical_accessory", "accessory_id")):
            if category in members:
                payload[field] = members[category][0]
        request("POST", "/optical-trains", payload)


def add_project_references(project_api, references):
    for row, parent, alias in references:
        kind = row["kind"]
        node = {"kind": "image_result" if kind == "calibration_master" else kind,
                "resource_id": row["id"], "parent_path": parent}
        if alias:
            node["name"] = alias
        result = request("POST", project_api + "/nodes", node)
        path = parent.rstrip("/") + "/" + result["name"]
        lookup = request("GET", project_api + "?" + urlencode({"path": path}))
        if lookup["resource"]["id"] != row["id"]:
            raise RuntimeError(f"Project readback mismatch for {path}")


def main():
    parser = argparse.ArgumentParser(description=__doc__)
    parser.add_argument("root", type=Path)
    parser.add_argument("--data-root", type=Path, required=True, help="Expected active AstroPhoto data root")
    parser.add_argument("--mapping", type=Path, help="Optional JSON overrides keyed by manifest path")
    parser.add_argument("--project-name", help="Project name (defaults to manifest project suggestion)")
    parser.add_argument("--execute", action="store_true", help="Perform the import after validating the complete plan")
    parser.add_argument("--seed-equipment", action="store_true")
    args = parser.parse_args()
    root = args.root.resolve(strict=True)
    manifest = json.loads((root / "manifest.json").read_text(encoding="utf-8"))
    mapping = json.loads(args.mapping.read_text(encoding="utf-8")) if args.mapping else {}
    storage = request("GET", "/storage")
    if Path(storage["data_root"]["path"]).resolve() != args.data_root.resolve():
        raise RuntimeError("Active data root does not match --data-root")
    if args.seed_equipment and args.execute:
        seed_equipment()
    trains = {}
    for row in all_pages("/optical-trains"):
        detail = request("GET", "/optical-trains/" + row["id"])
        if detail["name"] in trains:
            raise RuntimeError(f"Ambiguous train name: {detail['name']}")
        trains[detail["name"]] = detail
    tasks = make_tasks(root, manifest, mapping, trains)
    project_name = args.project_name or mapping.get("project_name") or manifest["project_suggestion"]["name"]
    projects = all_pages("/catalog/projects")
    if any(row["name"].casefold() == project_name.casefold() for row in projects):
        raise RuntimeError(f"Project {project_name!r} already exists; refusing duplicate project")
    suggested_paths = manifest["project_suggestion"].get("folders", [])
    project_paths = sorted(set(suggested_paths + [task["project_path"] for task in tasks if task["project_path"]]))
    existing = {kind: {row["name"] for row in all_pages("/catalog/" + kind)} for kind in
                ("subframe_collection", "video", "image_result", "calibration_master")}
    for task in tasks:
        cat = task["catalog"]
        if cat["name"] in existing[cat["kind"]]:
            raise RuntimeError(f"Existing catalog record: {cat['kind']} {cat['name']!r}; refusing duplicates")
        existing[cat["kind"]].add(cat["name"])
        print(json.dumps({"status": "planned", **task}, ensure_ascii=False), flush=True)
    print(json.dumps({"status": "project_planned", "name": project_name, "folders": project_paths,
                      "calibration_master_note": "calibration masters cannot be project nodes"}, ensure_ascii=False), flush=True)
    if not args.execute:
        return
    project = request("POST", "/catalog/projects", {"name": project_name, "notes": "Synthetic test assets"})
    project_api = "/catalog/projects/" + project["id"]
    request("POST", project_api + "/folders", {"paths": project_paths})
    print(json.dumps({"status": "project_created", "name": project_name, "id": project["id"]}, ensure_ascii=False), flush=True)
    imported = {}
    for task in tasks:
        settings = request("GET", "/storage")["imports"]
        if settings["default_mode"] != task["mode"]:
            request("PATCH", "/storage/settings", {"expected_revision": settings["revision"],
                                                    "imports": {"default_mode": task["mode"]}})
            settings = request("GET", "/storage")["imports"]
        payload = {"sources": [task["source"]], "settings_revision": settings["revision"],
                   "catalog": task["catalog"]}
        preview = request("POST", "/assets/import/preview", payload)
        if preview["failed"] or preview["file_count"] != task["expected_count"]:
            raise RuntimeError(f"Preflight count mismatch for {task['path']}: {preview}")
        operation = request("POST", "/assets/import", {**payload, "preview_id": preview["preview_id"],
                                                         "idempotency_key": str(uuid4())})
        for _ in range(600):
            status = request("GET", "/assets/imports/" + operation["operation_id"])
            if status["phase"] in {"completed", "failed", "cancelled"}:
                break
            time.sleep(0.1)
        else:
            raise RuntimeError(f"Import timed out: {operation['operation_id']}")
        receipt = status["receipt"]
        if status["phase"] != "completed" or receipt.get("failed") or receipt.get("skipped") or receipt.get("binding_error"):
            raise RuntimeError(f"Import failed or partially completed: {status}")
        if receipt.get("copied" if task["mode"] == "copy" else "registered") != task["expected_count"]:
            raise RuntimeError(f"Import receipt count mismatch for {task['path']}: {receipt}")
        rows = [row for row in all_pages("/catalog/" + task["catalog"]["kind"]) if row["name"] == task["catalog"]["name"]]
        if len(rows) != 1:
            raise RuntimeError(f"Cannot uniquely verify {task['path']}: {rows}")
        row = rows[0]
        for key in ("equipment_train_id", "filter_id", "filter_state"):
            if key in task["catalog"] and row.get(key) != task["catalog"][key]:
                raise RuntimeError(f"Readback mismatch for {task['path']}: {key}")
        imported[task["path"]] = {**row, "kind": task["catalog"]["kind"]}
        if task["project_path"]:
            add_project_references(project_api, [(imported[task["path"]], task["project_path"], None)])
        print(json.dumps({"status": "imported", "path": task["path"], "id": row["id"],
                          "operation_id": operation["operation_id"], "receipt": receipt}, ensure_ascii=False), flush=True)

    for scenario in manifest.get("calibration_scenarios", []):
        group, master = imported[scenario["collection"]], imported[scenario["master"]]
        group_api = "/catalog/subframe_collection/" + group["id"]
        request("POST", group_api + "/bindings", {"master_ids": [master["id"]]})
        if master["id"] not in request("GET", group_api)["master_ids"]:
            raise RuntimeError("Calibration binding readback mismatch")
    for spec in manifest.get("additional_projects", []):
        project = request("POST", "/catalog/projects", {"name": spec["name"], "notes": "Synthetic test assets"})
        extra_api = "/catalog/projects/" + project["id"]
        request("POST", extra_api + "/folders", {"paths": spec["folders"]})
        add_project_references(extra_api, [(imported[ref["material"]], ref["parent"], ref.get("alias"))
                                            for ref in spec["references"]])
        print(json.dumps({"status": "project_verified", "name": spec["name"], "id": project["id"]}, ensure_ascii=False))


if __name__ == "__main__":
    try:
        main()
    except (OSError, ValueError, KeyError, RuntimeError) as exc:
        print(str(exc), file=sys.stderr)
        raise SystemExit(1) from exc
