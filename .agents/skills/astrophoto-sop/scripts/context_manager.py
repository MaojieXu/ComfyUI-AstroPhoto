#!/usr/bin/env python3
"""Structured context aging, explicit mention recovery, and loss-preserving views.

Python 3.9+ standard library only. No network or business-code operations.
advance/touch are read-only unless --apply is supplied. --preview-dir writes
only a new candidate export, never the store. A completed S8 is an external
attestation: this tool verifies structure and history, not a reader's attention
or the truth of test results. Raw body Markdown stays literal inside a fence.
"""

import argparse
import copy
import hashlib
import json
import os
from pathlib import Path
import re
import shutil
import sys
import tempfile


SCHEMA_VERSION = 1
THRESHOLD = 5
TYPES = {"DECISION", "TEST", "ERROR", "RISK", "QUESTION", "CONSTRAINT", "ATTEMPT"}
WAKE_KINDS = {"MENTION", "CHANGE", "TEST_RUN", "ERROR_RECURRED", "USER_DIRECTIVE"}
EVENT_KINDS = WAKE_KINDS | {"CARRY_FORWARD", "ROUTINE_CHECK", "HISTORICAL_QUOTE", "NOT_RELEVANT"}
RECORD_KEYS = {"id", "type", "title", "body_md", "business_state", "aliases",
               "source_refs", "related_ids", "pinned", "pin_reason"}
EVENT_KEYS = {"event_id", "item_id", "kind", "origin", "source_id",
              "source_revision", "locator", "excerpt"}
OBSERVATION_KEYS = {"id", "result", "evidence_refs", "reason"}
HANDOFF_KEYS = {"id", "parent_id", "source_batch_id", "completed",
                "intake_closed", "coverage_complete", "evidence_refs"}
OUTPUTS = {"state.json", "ACTIVE_CONTEXT.md", "16_ARCHIVED_ITEMS.md",
           "CONTEXT_INDEX.md", "MANIFEST.sha256"}
ID_RE = re.compile(r"^[A-Za-z0-9][A-Za-z0-9_.:-]{0,127}$")
POINTER_RE = re.compile(r"^snapshots/[0-9]{8}$")
LIMITS = (
    "Structural/provenance checks only. Source read receipts, semantic extraction, "
    "pinning policy, business truth, and complete S8 package validation require Main. "
    "A scan match is a candidate, never an automatic event."
)


class ContextError(ValueError):
    pass


def require(condition, message):
    if not condition:
        raise ContextError(message)


def canonical(value):
    return json.dumps(value, ensure_ascii=False, sort_keys=True,
                      separators=(",", ":"), allow_nan=False)


def digest(value):
    return hashlib.sha256(canonical(value).encode("utf-8")).hexdigest()


def file_digest(data):
    return hashlib.sha256(data).hexdigest()


def strict_object(pairs):
    result = {}
    for key, value in pairs:
        require(key not in result, "duplicate JSON key: " + key)
        result[key] = value
    return result


def read_json(path):
    def reject_constant(value):
        raise ContextError("non-finite JSON number: " + value)
    try:
        return json.loads(path.read_text(encoding="utf-8-sig"),
                          object_pairs_hook=strict_object,
                          parse_constant=reject_constant)
    except (OSError, UnicodeError, json.JSONDecodeError) as exc:
        raise ContextError("cannot read JSON {}: {}".format(path, exc)) from exc


def obj(value, keys, label, optional=()):
    require(type(value) is dict, label + " must be an object")
    require(set(value) <= set(keys) | set(optional),
            label + " contains unknown fields: " + ", ".join(sorted(set(value) - set(keys) - set(optional))))
    require(set(keys) <= set(value),
            label + " is missing fields: " + ", ".join(sorted(set(keys) - set(value))))
    return value


def string(value, label, nonempty=True):
    require(type(value) is str and "\x00" not in value, label + " must be a string without NUL")
    require(not nonempty or bool(value.strip()), label + " must not be empty")
    return value


def identifier(value, label):
    string(value, label)
    require(bool(ID_RE.fullmatch(value)), label + " must be a stable ASCII ID (1-128 characters)")
    return value


def strings(value, label, nonempty=False):
    require(type(value) is list, label + " must be an array")
    require(not nonempty or bool(value), label + " must contain evidence")
    for entry in value:
        string(entry, label + " entry")
    require(len(value) == len(set(value)), label + " contains duplicates")
    return value


def boolean(value, label):
    require(type(value) is bool, label + " must be a boolean")
    return value


def integer(value, label):
    require(type(value) is int and value >= 0, label + " must be a nonnegative integer")
    return value


def validate_record(record):
    obj(record, RECORD_KEYS, "record")
    identifier(record["id"], "record.id")
    require(record["type"] in TYPES, "unknown record.type")
    string(record["title"], "record.title")
    string(record["body_md"], "record.body_md")
    require(type(record["business_state"]) is dict, "record.business_state must be an object")
    canonical(record["business_state"])
    strings(record["aliases"], "record.aliases")
    strings(record["source_refs"], "record.source_refs", nonempty=True)
    strings(record["related_ids"], "record.related_ids")
    for item_id in record["related_ids"]:
        identifier(item_id, "related item ID")
    boolean(record["pinned"], "record.pinned")
    string(record["pin_reason"], "record.pin_reason", nonempty=record["pinned"])
    require(record["type"] != "CONSTRAINT" or record["pinned"],
            "CONSTRAINT records must be pinned; split effective rules from archival discussion")
    return copy.deepcopy(record)


def validate_event(event):
    obj(event, EVENT_KEYS, "event")
    for key in ("event_id", "item_id", "source_id"):
        identifier(event[key], "event." + key)
    require(event["kind"] in EVENT_KINDS, "unknown event.kind")
    require(event["origin"] in {"NEW_INPUT", "CARRY_FORWARD"}, "unknown event.origin")
    for key in ("source_revision", "locator", "excerpt"):
        string(event[key], "event." + key)
    return copy.deepcopy(event)


def validate_packet(packet, operation):
    required = {"schema_version", "events"}
    if operation == "advance":
        required |= {"handoff", "observations"}
    obj(packet, required, operation + " packet", optional={"upserts", "expected_revision"})
    require(type(packet["schema_version"]) is int and packet["schema_version"] == SCHEMA_VERSION,
            "unsupported schema_version")
    packet = copy.deepcopy(packet)
    packet.setdefault("upserts", [])
    for key in ("upserts", "events"):
        require(type(packet[key]) is list, key + " must be an array")
    packet["upserts"] = [validate_record(value) for value in packet["upserts"]]
    packet["events"] = [validate_event(value) for value in packet["events"]]
    require(len({x["id"] for x in packet["upserts"]}) == len(packet["upserts"]), "duplicate upsert ID")
    require(len({x["event_id"] for x in packet["events"]}) == len(packet["events"]), "duplicate event_id in packet")
    if "expected_revision" in packet:
        integer(packet["expected_revision"], "expected_revision")
    if operation == "advance":
        handoff = obj(packet["handoff"], HANDOFF_KEYS, "handoff")
        for key in ("id", "source_batch_id"):
            identifier(handoff[key], "handoff." + key)
        if handoff["parent_id"] is not None:
            identifier(handoff["parent_id"], "handoff.parent_id")
        for key in ("completed", "intake_closed", "coverage_complete"):
            boolean(handoff[key], "handoff." + key)
        strings(handoff["evidence_refs"], "handoff.evidence_refs", nonempty=True)
        require(type(packet["observations"]) is list, "observations must be an array")
        for observation in packet["observations"]:
            obj(observation, OBSERVATION_KEYS, "observation")
            identifier(observation["id"], "observation.id")
            require(observation["result"] in {"UNCHANGED", "CHANGED", "MENTIONED", "UNKNOWN"},
                    "unknown observation.result")
            strings(observation["evidence_refs"], "observation.evidence_refs", nonempty=True)
            string(observation["reason"], "observation.reason")
        require(len({x["id"] for x in packet["observations"]}) == len(packet["observations"]),
                "duplicate observation ID")
    return packet


def empty_state():
    return {"schema_version": SCHEMA_VERSION, "publication_status": "COMMITTED",
            "revision": 0, "last_handoff_id": None, "items": {},
            "processed_handoffs": {}, "processed_events": {}, "occurrences": {}}


def validate_state(state):
    obj(state, {"schema_version", "publication_status", "revision", "last_handoff_id",
                "items", "processed_handoffs", "processed_events", "occurrences"}, "state")
    require(type(state["schema_version"]) is int and state["schema_version"] == SCHEMA_VERSION,
            "unsupported stored schema")
    require(state["publication_status"] == "COMMITTED", "CURRENT cannot refer to PREVIEW state")
    integer(state["revision"], "state.revision")
    if state["last_handoff_id"] is not None:
        identifier(state["last_handoff_id"], "state.last_handoff_id")
    for key in ("items", "processed_handoffs", "processed_events", "occurrences"):
        require(type(state[key]) is dict, "state." + key + " must be an object")
    for item_id, item in state["items"].items():
        identifier(item_id, "stored item ID")
        obj(item, {"record", "attention_state", "idle_handoffs", "baseline_handoff_id",
                   "pending_baseline", "archived_at_handoff_id", "versions", "history"}, "stored item")
        validate_record(item["record"])
        require(item["record"]["id"] == item_id, "stored ID differs from record ID")
        require(item["attention_state"] in {"ACTIVE", "ARCHIVED"}, "invalid attention_state")
        integer(item["idle_handoffs"], "idle_handoffs")
        require(item["idle_handoffs"] <= THRESHOLD, "idle_handoffs exceeds threshold")
        boolean(item["pending_baseline"], "pending_baseline")
        for key in ("baseline_handoff_id", "archived_at_handoff_id"):
            if item[key] is not None:
                identifier(item[key], key)
        require(type(item["versions"]) is list and type(item["history"]) is list, "invalid item history")
        require(not item["record"]["pinned"] or item["attention_state"] == "ACTIVE",
                "pinned record cannot be archived")
        for version in item["versions"]:
            require(type(version) is dict and "record" in version, "invalid historical record")
            validate_record(version["record"])
    return state


def checked_store(path):
    require(not path.is_symlink(), "store must not be a symlink")
    root = path.absolute()
    require(not root.exists() or root.is_dir(), "store must be a directory")
    return root


def read_state(root):
    pointer = root / "CURRENT"
    require(not pointer.is_symlink(), "CURRENT must not be a symlink")
    if not pointer.exists():
        if root.exists():
            require(set(p.name for p in root.iterdir()) <= {"snapshots", ".context_manager.lock"},
                    "store has unrelated contents but no CURRENT; choose a dedicated empty directory")
            snapshots = root / "snapshots"
            require(not snapshots.is_symlink(), "snapshots must not be a symlink")
            if snapshots.exists():
                require(snapshots.is_dir(), "snapshots must be a directory")
                require(not any(snapshots.iterdir()),
                        "CURRENT is missing but snapshots is nonempty; recover the verified intended pointer instead of reinitializing or guessing the latest generation")
        return empty_state()
    name = pointer.read_text(encoding="utf-8").strip()
    require(bool(POINTER_RE.fullmatch(name)), "invalid CURRENT pointer")
    require(not (root / "snapshots").is_symlink(), "snapshots must not be a symlink")
    directory = root / name
    require(directory.is_dir() and not directory.is_symlink(), "CURRENT generation is missing or a symlink")
    entries = list(directory.iterdir())
    require({p.name for p in entries} == OUTPUTS, "generation inventory differs from expected files")
    require(all(p.is_file() and not p.is_symlink() for p in entries), "generation contains non-file or symlink")
    manifest = (directory / "MANIFEST.sha256").read_text(encoding="utf-8")
    expected = {}
    for line in manifest.splitlines():
        match = re.fullmatch(r"([0-9a-f]{64})  ([A-Za-z0-9_.]+)", line)
        require(match is not None, "invalid generation manifest")
        require(match[2] not in expected, "duplicate generation manifest entry")
        expected[match[2]] = match[1]
    require(set(expected) == OUTPUTS - {"MANIFEST.sha256"}, "incomplete generation manifest")
    for filename, value in expected.items():
        require(file_digest((directory / filename).read_bytes()) == value,
                "generation hash mismatch: " + filename)
    state = validate_state(read_json(directory / "state.json"))
    require(int(directory.name) == state["revision"], "generation revision mismatch")
    return state


def next_revision(root, state):
    largest = state["revision"]
    snapshots = root / "snapshots"
    require(not snapshots.is_symlink(), "snapshots must not be a symlink")
    if snapshots.exists():
        require(snapshots.is_dir(), "snapshots must be a directory")
        for entry in snapshots.iterdir():
            require(not entry.is_symlink(), "snapshot entries must not be symlinks")
            if re.fullmatch(r"[0-9]{8}", entry.name):
                largest = max(largest, int(entry.name))
    require(largest < 99999999, "revision range exhausted")
    return largest + 1


def occurrence_key(event):
    # A source revision identifies an export, not a new message occurrence.
    return digest({key: event[key] for key in
                   ("item_id", "kind", "origin", "source_id", "locator", "excerpt")})


def wake_event(event):
    return event["origin"] == "NEW_INPUT" and event["kind"] in WAKE_KINDS


def audit(item, revision, action, **details):
    item["history"].append({"revision": revision, "action": action, **details})


def apply_events_and_upserts(state, packet, revision):
    items = state["items"]
    supplied = {r["id"]: r for r in packet["upserts"]}
    all_ids = set(items) | set(supplied)
    for record in supplied.values():
        require(set(record["related_ids"]) <= all_ids, "unknown related_ids for " + record["id"])
    for event in packet["events"]:
        require(event["item_id"] in all_ids, "event refers to unknown item: " + event["item_id"])
    new_events, effective = [], {}
    duplicate_events = []
    ignored_events = []
    for event in packet["events"]:
        event_id = event["event_id"]
        fingerprint = digest(event)
        occurrence = occurrence_key(event)
        prior = state["processed_events"].get(event_id)
        if prior is not None:
            require(prior["digest"] == fingerprint, "event_id conflict: " + event_id)
            duplicate_events.append(event_id)
            continue
        prior_id = state["occurrences"].get(occurrence)
        if prior_id is not None:
            effect = "DUPLICATE_OCCURRENCE"
            duplicate_events.append(event_id)
        elif wake_event(event):
            effect = "TOUCHED"
            effective.setdefault(event["item_id"], []).append(event_id)
        else:
            effect = "IGNORED"
            ignored_events.append(event_id)
        state["processed_events"][event_id] = {
            "digest": fingerprint, "occurrence_digest": occurrence,
            "payload": copy.deepcopy(event), "effect": effect, "revision": revision}
        state["occurrences"].setdefault(occurrence, event_id)
        new_events.append(event_id)
    changed, created, touched, reactivated = [], [], [], []
    for item_id, record in supplied.items():
        old = items.get(item_id)
        if old is not None and old["record"] == record:
            continue
        require(item_id in effective,
                "new/changed upsert requires a new-input event for " + item_id)
        if old is None:
            items[item_id] = {
                "record": copy.deepcopy(record), "attention_state": "ACTIVE",
                "idle_handoffs": 0, "baseline_handoff_id": None,
                "pending_baseline": True, "archived_at_handoff_id": None,
                "versions": [], "history": []}
            audit(items[item_id], revision, "CREATED", event_ids=effective[item_id])
            created.append(item_id)
        else:
            old["versions"].append({
                "replaced_in_revision": revision, "record": copy.deepcopy(old["record"]),
                "event_ids": list(effective[item_id])})
            old["record"] = copy.deepcopy(record)
            audit(old, revision, "CONTENT_CHANGED", event_ids=effective[item_id])
            changed.append(item_id)
    for item_id, event_ids in effective.items():
        item = items[item_id]
        old_state = item["attention_state"]
        old_count = item["idle_handoffs"]
        item["attention_state"] = "ACTIVE"
        item["idle_handoffs"] = 0
        item["pending_baseline"] = True
        if old_state == "ARCHIVED":
            reactivated.append(item_id)
            audit(item, revision, "REACTIVATED", event_ids=event_ids,
                  previous_idle_handoffs=old_count)
        else:
            audit(item, revision, "TOUCHED", event_ids=event_ids,
                  previous_idle_handoffs=old_count)
        touched.append(item_id)
    return {"created": sorted(created), "content_changed": sorted(changed),
            "touched": sorted(touched), "reactivated": sorted(reactivated),
            "new_events": new_events, "duplicate_events": duplicate_events,
            "ignored_events": ignored_events, "archived": []}


def project(state, packet, operation, revision, preview=False):
    packet = validate_packet(packet, operation)
    fingerprint = digest(packet)
    if operation == "advance":
        handoff = packet["handoff"]
        prior = state["processed_handoffs"].get(handoff["id"])
        if prior is not None:
            require(prior["packet_digest"] == fingerprint, "handoff ID conflict: " + handoff["id"])
            return state, {"status": "NOOP", "reason": "identical handoff already committed"}
        require(handoff["parent_id"] == state["last_handoff_id"], "wrong parent_handoff_id")
        require(handoff["intake_closed"] and handoff["coverage_complete"],
                "input gates incomplete: intake_closed and coverage_complete must be true")
        require(handoff["completed"] or preview,
                "handoff.completed must be true before committing or planning a final advance; use --preview-dir for an incomplete candidate")
        require(not any(x["source_batch_id"] == handoff["source_batch_id"]
                        for x in state["processed_handoffs"].values()),
                "source_batch_id already belongs to a committed handoff; a re-export is not a new round")
    draft = copy.deepcopy(state)
    changes = apply_events_and_upserts(draft, packet, revision)
    payload_changed = draft != state
    if operation == "touch" and not payload_changed:
        return state, {"status": "NOOP", "reason": "all events/upserts already applied", **changes}
    if "expected_revision" in packet:
        require(packet["expected_revision"] == state["revision"],
                "expected_revision conflict; reload CURRENT before applying new work")
    if operation == "advance":
        observations = {o["id"]: o for o in packet["observations"]}
        require(set(observations) <= set(draft["items"]), "observation refers to unknown item")
        required_ids = {i for i, value in draft["items"].items()
                        if value["attention_state"] == "ACTIVE"}
        missing = sorted(required_ids - set(observations))
        require(not missing, "missing ACTIVE observations: " + ", ".join(missing))
        for item_id, observation in observations.items():
            require(observation["result"] != "UNKNOWN",
                    "UNKNOWN observation blocks this entire round: " + item_id)
            if observation["result"] == "CHANGED":
                require(item_id in changes["created"] or item_id in changes["content_changed"],
                        "CHANGED needs a changed/new full upsert: " + item_id)
            if observation["result"] == "MENTIONED":
                require(item_id in changes["touched"],
                        "MENTIONED needs a new effective event: " + item_id)
            if item_id in changes["created"] or item_id in changes["content_changed"]:
                require(observation["result"] == "CHANGED", "changed/new record must be observed CHANGED: " + item_id)
            elif item_id in changes["touched"]:
                require(observation["result"] == "MENTIONED", "new mention must be observed MENTIONED: " + item_id)
        for item_id, item in draft["items"].items():
            if item["attention_state"] == "ARCHIVED":
                continue
            observation = observations[item_id]
            before = item["idle_handoffs"]
            if item["pending_baseline"] or item["baseline_handoff_id"] is None:
                item["baseline_handoff_id"] = handoff["id"]
                item["pending_baseline"] = False
                item["idle_handoffs"] = 0
                action = "BASELINE"
            else:
                require(observation["result"] == "UNCHANGED",
                        "a counted idle round requires UNCHANGED: " + item_id)
                item["idle_handoffs"] = min(THRESHOLD, before + 1)
                action = "IDLE_REVIEW"
            audit(item, revision, action, handoff_id=handoff["id"],
                  parent_id=handoff["parent_id"], source_batch_id=handoff["source_batch_id"],
                  observation=copy.deepcopy(observation), idle_handoffs=item["idle_handoffs"])
            if item["idle_handoffs"] >= THRESHOLD and not item["record"]["pinned"]:
                item["attention_state"] = "ARCHIVED"
                item["archived_at_handoff_id"] = handoff["id"]
                audit(item, revision, "ARCHIVED", handoff_id=handoff["id"], idle_handoffs=THRESHOLD)
                changes["archived"].append(item_id)
        draft["last_handoff_id"] = handoff["id"]
        draft["processed_handoffs"][handoff["id"]] = {
            "packet_digest": fingerprint, "source_batch_id": handoff["source_batch_id"],
            "parent_id": handoff["parent_id"], "revision": revision,
            "handoff": copy.deepcopy(handoff), "observations": copy.deepcopy(packet["observations"])}
    draft["revision"] = revision
    draft["publication_status"] = "PREVIEW" if preview else "COMMITTED"
    return draft, {"status": "PREVIEW" if preview else "PLANNED", **changes}


def anchor(item_id):
    return "item-" + item_id.encode("utf-8").hex()


def fenced(body, language=""):
    longest = max([len(x) for x in re.findall(chr(96) + r"+", body)] or [0])
    fence = chr(96) * max(3, longest + 1)
    return fence + language + "\n" + body + ("" if body.endswith("\n") else "\n") + fence + "\n"


def literal(value):
    value = str(value).replace("\r", "\\r").replace("\n", "\\n")
    fence = chr(96) * (max([len(x) for x in re.findall(chr(96) + r"+", value)] or [0]) + 1)
    return fence + " " + value + " " + fence


def item_section(item_id, item):
    record = item["record"]
    metadata = {key: record[key] for key in
                ("id", "type", "title", "business_state", "pinned", "pin_reason", "source_refs", "related_ids")}
    metadata.update({key: item[key] for key in
                     ("attention_state", "idle_handoffs", "baseline_handoff_id",
                      "pending_baseline", "archived_at_handoff_id")})
    result = '<a id="{}"></a>\n## {}\n\n'.format(anchor(item_id), item_id)
    result += fenced(json.dumps(metadata, ensure_ascii=False, indent=2), "json") + "\n"
    result += "### 完整当前正文（原样 Markdown）\n\n" + fenced(record["body_md"], "markdown") + "\n"
    if item["attention_state"] == "ARCHIVED":
        result += "### 完整复核与状态事件\n\n"
        result += fenced(json.dumps(item["history"], ensure_ascii=False, indent=2), "json") + "\n"
    else:
        recent = next((event for event in reversed(item["history"])
                       if event["action"] != "IDLE_REVIEW"), None)
        if recent is not None:
            location = {key: recent[key] for key in ("revision", "action", "handoff_id")
                        if key in recent}
            result += "### 最近一次关注变化的定位\n\n"
            result += fenced(json.dumps(location, ensure_ascii=False, indent=2), "json") + "\n"
        result += "日常活动视图不展开逐轮重复复核账；完整 history 保存在同包 state.json，未删除任何事件。\n\n"
    result += "历次完整正文与业务状态保存在 [state.json](state.json) 的 versions；原始来源另按 source_refs 随完整 Handoff 携带。\n\n"
    return result


def output_bytes(state):
    preview = state["publication_status"] == "PREVIEW"
    notice = ("**PREVIEW：候选预览，计数与归档尚未固化，不能作为完成交接。**\n\n"
              if preview else
              "**结构化状态视图；不是业务已解决、测试已通过或来源已实读的证明。**\n\n")
    common = notice + "状态版本：{}；最后正式 Handoff：{}。\n\n".format(
        state["revision"], literal(state["last_handoff_id"]))
    nav = "[活动全文](ACTIVE_CONTEXT.md) · [归档全文](16_ARCHIVED_ITEMS.md) · [轻量索引](CONTEXT_INDEX.md) · [完整记录与历史](state.json)\n\n"
    active = "# 当前活动上下文\n\n" + common + nav
    archive = "# 16 · 当前归档上下文\n\n" + common + nav
    index = "# 结构化上下文索引\n\n" + common + nav
    index += "仅将当前相关活动正文与有效规则读入任务上下文；完整存储继续携带所有记录。\n\n"
    index += "| ID | 标题 | 类型 | 关注状态 | 未用轮次 | 固定 | 定位 |\n|---|---|---|---|---:|---|---|\n"
    reactivated = []
    active_count = archive_count = 0
    for item_id, item in sorted(state["items"].items()):
        location = "ACTIVE_CONTEXT.md" if item["attention_state"] == "ACTIVE" else "16_ARCHIVED_ITEMS.md"
        index += "| {} | {} | {} | {} | {} | {} | [全文]({}#{}) |\n".format(
            item_id, literal(item["record"]["title"].replace("|", "\\|")),
            item["record"]["type"], item["attention_state"], item["idle_handoffs"],
            item["record"]["pinned"], location, anchor(item_id))
        if item["attention_state"] == "ACTIVE":
            active += item_section(item_id, item)
            active_count += 1
            if any(e["action"] == "ARCHIVED" for e in item["history"]):
                reactivated.append(item_id)
        else:
            archive += item_section(item_id, item)
            archive_count += 1
    if not active_count:
        active += "本状态中无 ACTIVE 条目；这不证明未登记来源没有事项。\n\n"
    if not archive_count:
        archive += "本状态中无 ARCHIVED 条目；此前事件仍保留在完整记录中。\n\n"
    if reactivated:
        archive += "## 已移回活动区的条目\n\n旧归档锚点继续可达；当前全文只在活动区，完整历史仍在 state.json 与旧快照。\n\n"
        for item_id in reactivated:
            archive += '<a id="{}"></a>\n### {}\n\n已重新激活：[当前完整正文](ACTIVE_CONTEXT.md#{})。\n\n'.format(
                anchor(item_id), item_id, anchor(item_id))
    data = {
        "state.json": (json.dumps(state, ensure_ascii=False, sort_keys=True, indent=2,
                                  allow_nan=False) + "\n").encode("utf-8"),
        "ACTIVE_CONTEXT.md": active.encode("utf-8"),
        "16_ARCHIVED_ITEMS.md": archive.encode("utf-8"),
        "CONTEXT_INDEX.md": index.encode("utf-8"),
    }
    data["MANIFEST.sha256"] = "".join(
        "{}  {}\n".format(file_digest(data[name]), name) for name in sorted(data)
    ).encode("ascii")
    return data


def fsync_directory(directory):
    if hasattr(os, "O_DIRECTORY"):
        try:
            fd = os.open(str(directory), os.O_RDONLY | os.O_DIRECTORY)
            try:
                os.fsync(fd)
            finally:
                os.close(fd)
        except OSError:
            pass  # Files and CURRENT are still explicitly flushed on every OS.


def write_export(directory, state):
    # The caller reserves the destination. Never overwrite existing files.
    for name, content in output_bytes(state).items():
        path = directory / name
        with path.open("xb") as stream:
            stream.write(content)
            stream.flush()
            os.fsync(stream.fileno())
    fsync_directory(directory)


def export_new(directory, state):
    require(not directory.exists() and not directory.is_symlink(), "export directory already exists")
    directory.parent.mkdir(parents=True, exist_ok=True)
    directory.mkdir()
    try:
        write_export(directory, state)
    except Exception:
        # Keep a partial export visible for diagnosis; it is never a CURRENT generation.
        raise


def commit(root, packet, operation):
    root.mkdir(parents=True, exist_ok=True)
    lock = root / ".context_manager.lock"
    try:
        stream = lock.open("x", encoding="utf-8")
    except FileExistsError as exc:
        raise ContextError("another writer or interrupted writer holds .context_manager.lock; inspect it before any manual recovery") from exc
    try:
        with stream:
            stream.write(json.dumps({"pid": os.getpid()}) + "\n")
            stream.flush()
            os.fsync(stream.fileno())
        state = read_state(root)
        revision = next_revision(root, state)
        draft, report = project(state, packet, operation, revision)
        if draft is state:
            return {**report, "revision": state["revision"], "last_handoff_id": state["last_handoff_id"],
                    "committed": False, "limits": LIMITS}
        snapshots = root / "snapshots"
        snapshots.mkdir(exist_ok=True)
        target = snapshots / "{:08d}".format(revision)
        require(not target.exists(), "generation already exists; never overwrite")
        temporary = Path(tempfile.mkdtemp(prefix=".pending-", dir=str(snapshots)))
        try:
            write_export(temporary, draft)
            os.replace(str(temporary), str(target))
            fsync_directory(snapshots)
        except Exception:
            if temporary.exists():
                shutil.rmtree(temporary)
            raise
        fd, temporary_name = tempfile.mkstemp(prefix=".CURRENT-", dir=str(root))
        temporary_pointer = Path(temporary_name)
        try:
            with os.fdopen(fd, "w", encoding="utf-8", newline="\n") as pointer:
                pointer.write("snapshots/{:08d}\n".format(revision))
                pointer.flush()
                os.fsync(pointer.fileno())
            os.replace(str(temporary_pointer), str(root / "CURRENT"))
            fsync_directory(root)
        finally:
            if temporary_pointer.exists():
                temporary_pointer.unlink()
        return {**report, "status": "COMMITTED", "revision": revision,
                "last_handoff_id": draft["last_handoff_id"], "committed": True,
                "generation": str(target), "limits": LIMITS}
    finally:
        lock.unlink()


def scan(root, path, source_id, source_revision):
    identifier(source_id, "source_id")
    string(source_revision, "source_revision")
    require(path.is_file() and not path.is_symlink(), "scan requires one readable regular text file")
    resolved = path.resolve()
    require(not resolved.is_relative_to(root.resolve()), "scan refuses store-generated content")
    require(path.name not in OUTPUTS and path.name not in {"FULL_HANDOFF.md", "FULL_REQUIREMENTS.md"},
            "scan refuses known generated views; supply only an explicit new message segment")
    text = path.read_text(encoding="utf-8-sig")
    state = read_state(root)
    aliases = {}
    for item_id, item in state["items"].items():
        for alias in item["record"]["aliases"]:
            aliases.setdefault(alias, set()).add(item_id)
    candidates, unknown = [], []
    ids = set(state["items"])
    for number, line in enumerate(text.splitlines(), 1):
        matches = []
        for item_id in sorted(ids):
            if re.search(r"(?<![A-Za-z0-9_.:-])" + re.escape(item_id) + r"(?![A-Za-z0-9_.:-])", line):
                matches.append(("EXACT_ID", item_id, [item_id]))
        for alias, targets in sorted(aliases.items()):
            if alias in ids:
                continue
            pattern = re.escape(alias)
            if re.fullmatch(r"[A-Za-z0-9_.:-]+", alias):
                pattern = r"(?<![A-Za-z0-9_.:-])" + pattern + r"(?![A-Za-z0-9_.:-])"
            if re.search(pattern, line):
                matches.append(("ALIAS" if len(targets) == 1 else "AMBIGUOUS_ALIAS", alias, sorted(targets)))
        locator = "{}:L{}".format(path.name, number)
        for match_type, matched, targets in matches:
            candidate = {"match_type": match_type, "candidate_item_ids": targets,
                         "source_id": source_id, "source_revision": source_revision,
                         "locator": locator, "excerpt": line, "matched_text": matched,
                         "requires_classification": True}
            candidate["candidate_id"] = "candidate-" + digest(candidate)[:20]
            candidates.append(candidate)
        marked = re.findall(r"\[\[([A-Za-z0-9][A-Za-z0-9_.:-]{0,127})\]\]", line)
        probable = re.findall(r"(?<![A-Za-z0-9_.:-])(?:[A-Z][A-Z0-9]*(?:[-_][A-Z0-9]+)*-\d+|[A-Z]+\d+)(?![A-Za-z0-9_.:-])", line)
        for value in sorted((set(marked) | set(probable)) - ids):
            unknown.append({"candidate_id": value, "locator": locator, "excerpt": line,
                            "reason": "unregistered reference candidate; do not guess its identity"})
    return {"status": "CANDIDATES_ONLY", "revision": state["revision"],
            "source_file": str(path), "source_sha256": file_digest(path.read_bytes()),
            "candidates": candidates, "unknown_refs": unknown,
            "writes": False, "limits": LIMITS}


def main(argv=None):
    parser = argparse.ArgumentParser(description=__doc__)
    sub = parser.add_subparsers(dest="command", required=True)
    for name in ("advance", "touch"):
        command = sub.add_parser(name)
        command.add_argument("--store", required=True, type=Path)
        command.add_argument("--input", required=True, type=Path)
        command.add_argument("--apply", action="store_true")
        if name == "advance":
            command.add_argument("--preview-dir", type=Path)
    command = sub.add_parser("scan")
    command.add_argument("--store", required=True, type=Path)
    command.add_argument("--text", required=True, type=Path)
    command.add_argument("--source-id", required=True)
    command.add_argument("--source-revision", required=True)
    command = sub.add_parser("render")
    command.add_argument("--store", required=True, type=Path)
    command.add_argument("--out", required=True, type=Path)
    args = parser.parse_args(argv)
    try:
        root = checked_store(args.store)
        if args.command == "scan":
            result = scan(root, args.text, args.source_id, args.source_revision)
        elif args.command == "render":
            state = read_state(root)
            require((root / "CURRENT").exists(), "render needs a committed CURRENT")
            require(not args.out.resolve().is_relative_to(root.resolve()), "render destination must be outside store")
            export_new(args.out, state)
            result = {"status": "EXPORTED", "revision": state["revision"],
                      "out": str(args.out), "limits": LIMITS}
        else:
            preview_dir = getattr(args, "preview_dir", None)
            require(not (args.apply and preview_dir), "--apply and --preview-dir are mutually exclusive")
            packet = read_json(args.input)
            if args.apply:
                result = commit(root, packet, args.command)
            else:
                state = read_state(root)
                draft, report = project(state, packet, args.command, next_revision(root, state),
                                        preview=bool(preview_dir))
                if preview_dir:
                    require(not preview_dir.resolve().is_relative_to(root.resolve()),
                            "preview destination must be outside store")
                    # Even an idempotent preview is visibly a preview.
                    draft = copy.deepcopy(draft)
                    draft["publication_status"] = "PREVIEW"
                    export_new(preview_dir, draft)
                result = {**report, "status": "PREVIEW" if preview_dir else report["status"],
                          "revision": draft["revision"], "last_handoff_id": draft["last_handoff_id"],
                          "committed": False, "writes": bool(preview_dir),
                          "preview_dir": str(preview_dir) if preview_dir else None, "limits": LIMITS}
        print(json.dumps(result, ensure_ascii=False, indent=2))
        return 0
    except (ContextError, OSError, UnicodeError, TypeError, KeyError) as exc:
        print(json.dumps({"status": "ERROR", "error": str(exc), "committed": False,
                          "limits": LIMITS}, ensure_ascii=False, indent=2))
        return 2


if __name__ == "__main__":
    sys.exit(main())
