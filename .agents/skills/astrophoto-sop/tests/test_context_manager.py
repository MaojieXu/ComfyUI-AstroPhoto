"""CLI acceptance tests for the structured context lifecycle.

Run from the skill directory with:
    python -B -m unittest discover -s tests -p test_context_manager.py -v

All records are synthetic. Tests write only isolated temporary directories and
exercise the public commands and complete exported files, not private helpers.
"""

import copy
import hashlib
import json
import os
from pathlib import Path
import subprocess
import sys
import tempfile
import unittest


SCRIPT = Path(__file__).resolve().parents[1] / "scripts" / "context_manager.py"
BODY = (
    "Original synthetic error: retain the failed input.\n\n"
    "Condition: recovery was cancelled after the temporary output was created.\n"
    "The input must remain byte-identical; cleanup concerns temporary output only.\n"
    "独有限定：只在用户明确授权范围内恢复；旧失败仍然是 FAIL。"
)


def record(item_id="DEMO-E1", kind="ERROR", body=BODY, pinned=False):
    return {
        "id": item_id,
        "type": kind,
        "title": "Synthetic recovery evidence",
        "body_md": body,
        "business_state": {"execution_result": "FAIL", "resolved": False},
        "aliases": [],
        "source_refs": ["DEMO-LC1:message-001"],
        "related_ids": [],
        "pinned": pinned,
        "pin_reason": "Current effective constraint" if pinned else "",
    }


def event(event_id, item_id="DEMO-E1", kind="MENTION", origin="NEW_INPUT", **changes):
    value = {
        "event_id": event_id,
        "item_id": item_id,
        "kind": kind,
        "origin": origin,
        "source_id": "DEMO-LC1",
        "source_revision": "export-1",
        "locator": "message-" + event_id,
        "excerpt": "New synthetic discussion of " + item_id,
    }
    value.update(changes)
    return value


def observation(item_id, result="UNCHANGED"):
    return {
        "id": item_id,
        "result": result,
        "evidence_refs": ["DEMO-LC1:review-current-state:" + item_id],
        "reason": "Synthetic qualified review; no omitted source range.",
    }


def string_values(value):
    if isinstance(value, str):
        yield value
    elif isinstance(value, dict):
        for child in value.values():
            yield from string_values(child)
    elif isinstance(value, list):
        for child in value:
            yield from string_values(child)


class ContextLifecycleAcceptance(unittest.TestCase):
    def setUp(self):
        self.temporary = tempfile.TemporaryDirectory(prefix="astrophoto-context-tests-")
        self.addCleanup(self.temporary.cleanup)
        self.root = Path(self.temporary.name)
        self.store = self.root / "store"
        self.input_number = 0
        self.environment = dict(os.environ, PYTHONDONTWRITEBYTECODE="1")

    def command(self, *args):
        return [sys.executable, "-B", str(SCRIPT), *map(str, args)]

    def run_cli(self, *args, expected=0):
        result = subprocess.run(
            self.command(*args), cwd=self.root, env=self.environment,
            text=True, encoding="utf-8", capture_output=True, timeout=20,
        )
        self.assertEqual(
            result.returncode, expected,
            f"{args!r}\nstdout={result.stdout}\nstderr={result.stderr}",
        )
        if result.stdout.strip():
            try:
                return json.loads(result.stdout)
            except json.JSONDecodeError:
                self.fail("CLI must return JSON: " + result.stdout)
        return None

    def input_file(self, packet):
        self.input_number += 1
        path = self.root / f"input-{self.input_number:03}.json"
        path.write_text(json.dumps(packet, ensure_ascii=False, indent=2), encoding="utf-8")
        return path

    def packet_cli(self, command, packet, apply=True, expected=0, extra=()):
        arguments = [command, "--store", self.store, "--input", self.input_file(packet)]
        if apply:
            arguments.append("--apply")
        arguments.extend(extra)
        return self.run_cli(*arguments, expected=expected)

    def current_dir(self):
        pointer = (self.store / "CURRENT").read_text(encoding="utf-8").strip()
        path = self.store / pointer
        self.assertTrue(path.resolve().is_relative_to(self.store.resolve()))
        self.assertTrue(path.is_dir())
        return path

    def state(self):
        return json.loads((self.current_dir() / "state.json").read_text(encoding="utf-8"))

    def item(self, item_id="DEMO-E1"):
        return self.state()["items"][item_id]

    def frozen_bytes(self, directory=None):
        directory = directory or self.store
        if not directory.exists():
            return None
        return {
            p.relative_to(directory).as_posix(): p.read_bytes()
            for p in directory.rglob("*") if p.is_file()
        }

    def cycle(self, number, upserts=None, events=None, observations=None):
        current = self.state() if (self.store / "CURRENT").exists() else None
        existing = current["items"] if current else {}
        upserts, events = upserts or [], events or []
        if observations is None:
            active = {key for key, value in existing.items() if value["attention_state"] == "ACTIVE"}
            touched = {
                e["item_id"] for e in events
                if e["origin"] == "NEW_INPUT"
                and e["kind"] in {"MENTION", "CHANGE", "TEST_RUN", "ERROR_RECURRED", "USER_DIRECTIVE"}
            }
            changed = {r["id"] for r in upserts}
            observations = [
                observation(key, "CHANGED" if key in changed else "MENTIONED" if key in touched else "UNCHANGED")
                for key in sorted(active | touched | changed)
            ]
        return {
            "schema_version": 1,
            "expected_revision": current["revision"] if current else 0,
            "handoff": {
                "id": f"DEMO-H{number}",
                "parent_id": current["last_handoff_id"] if current else None,
                "source_batch_id": f"DEMO-B{number}",
                "completed": True,
                "intake_closed": True,
                "coverage_complete": True,
                "evidence_refs": [f"DEMO-H{number}:intake-and-package-checks"],
            },
            "upserts": upserts,
            "observations": observations,
            "events": events,
        }

    def bootstrap(self, records=None):
        records = records or [record()]
        events = [event("CREATE-" + r["id"], r["id"], "CHANGE") for r in records]
        packet = self.cycle(0, records, events)
        self.packet_cli("advance", packet)
        return packet

    def age_to(self, count, first=1):
        for number in range(first, first + count):
            self.packet_cli("advance", self.cycle(number))

    def touch_packet(self, events, upserts=None):
        return {"schema_version": 1, "upserts": upserts or [], "events": events}

    def test_five_completed_successors_archive_without_changing_business_facts(self):
        self.bootstrap()
        first_dir = self.current_dir()
        first_bytes = self.frozen_bytes(first_dir)
        self.assertEqual(self.item()["idle_handoffs"], 0)
        self.age_to(4)
        self.assertEqual((self.item()["idle_handoffs"], self.item()["attention_state"]), (4, "ACTIVE"))
        self.age_to(1, first=5)
        self.assertEqual((self.item()["idle_handoffs"], self.item()["attention_state"]), (5, "ARCHIVED"))
        self.assertEqual(self.item()["record"]["business_state"], {"execution_result": "FAIL", "resolved": False})
        self.assertIn(BODY, (self.current_dir() / "16_ARCHIVED_ITEMS.md").read_text(encoding="utf-8"))
        self.assertNotIn(BODY, (self.current_dir() / "ACTIVE_CONTEXT.md").read_text(encoding="utf-8"))
        self.assertEqual(first_bytes, self.frozen_bytes(first_dir))

    def test_identical_cycle_retry_is_idempotent_but_reused_id_with_new_payload_fails(self):
        packet = self.bootstrap()
        before = self.frozen_bytes()
        self.packet_cli("advance", packet)
        self.assertEqual(before, self.frozen_bytes())
        changed = copy.deepcopy(packet)
        changed["handoff"]["evidence_refs"].append("different-receipt")
        self.packet_cli("advance", changed, expected=2)
        self.assertEqual(before, self.frozen_bytes())

    def test_wrong_parent_cannot_create_a_parallel_counted_handoff(self):
        self.bootstrap()
        self.age_to(1)
        packet = self.cycle(2)
        packet["handoff"]["parent_id"] = "DEMO-H0"
        before = self.frozen_bytes()
        self.packet_cli("advance", packet, expected=2)
        self.assertEqual(before, self.frozen_bytes())
        for revision in (self.state()["revision"] - 1, True):
            with self.subTest(expected_revision=revision):
                stale = self.cycle(2)
                stale["expected_revision"] = revision
                self.packet_cli("advance", stale, expected=2)
                self.assertEqual(before, self.frozen_bytes())

    def test_incomplete_global_gates_never_age_any_item(self):
        self.bootstrap()
        self.age_to(4)
        for gate in ("completed", "intake_closed", "coverage_complete"):
            with self.subTest(gate=gate):
                packet = self.cycle(5)
                packet["handoff"][gate] = False
                before = self.frozen_bytes()
                self.packet_cli("advance", packet, expected=2)
                self.assertEqual(before, self.frozen_bytes())
                self.assertEqual(self.item()["idle_handoffs"], 4)

    def test_missing_or_unknown_observation_blocks_the_whole_cycle(self):
        self.bootstrap([record(), record("DEMO-E2")])
        self.age_to(4)
        for observations in (
            [observation("DEMO-E1")],
            [observation("DEMO-E1"), observation("DEMO-E2", "UNKNOWN")],
        ):
            with self.subTest(observations=observations):
                before = self.frozen_bytes()
                self.packet_cli("advance", self.cycle(5, observations=observations), expected=2)
                self.assertEqual(before, self.frozen_bytes())

    def test_new_mention_resets_idle_age_even_if_record_body_is_unchanged(self):
        self.bootstrap()
        self.age_to(3)
        packet = self.cycle(4, events=[event("CURRENT-MENTION")])
        self.packet_cli("advance", packet)
        self.assertEqual(self.item()["idle_handoffs"], 0)
        self.assertEqual(self.item()["record"]["body_md"], BODY)
        self.age_to(1, first=5)
        self.assertEqual(self.item()["idle_handoffs"], 1)

    def test_touch_restores_full_archived_body_and_next_handoff_is_new_h0(self):
        self.bootstrap()
        self.age_to(5)
        archived_dir = self.current_dir()
        archived_bytes = self.frozen_bytes(archived_dir)
        previous_handoff = self.state()["last_handoff_id"]
        self.packet_cli("touch", self.touch_packet([event("WAKE")]))
        value = self.item()
        self.assertEqual((value["attention_state"], value["idle_handoffs"]), ("ACTIVE", 0))
        self.assertTrue(value["pending_baseline"])
        self.assertEqual(self.state()["last_handoff_id"], previous_handoff)
        self.assertIn(BODY, (self.current_dir() / "ACTIVE_CONTEXT.md").read_text(encoding="utf-8"))
        self.assertNotIn(BODY, (self.current_dir() / "16_ARCHIVED_ITEMS.md").read_text(encoding="utf-8"))
        self.assertEqual(archived_bytes, self.frozen_bytes(archived_dir))
        self.packet_cli("advance", self.cycle(6))
        self.assertEqual(self.item()["idle_handoffs"], 0)
        self.assertEqual(self.item()["baseline_handoff_id"], "DEMO-H6")
        self.assertFalse(self.item()["pending_baseline"])
        self.packet_cli("advance", self.cycle(7))
        self.assertEqual(self.item()["idle_handoffs"], 1)

    def test_reexported_old_occurrence_does_not_repeatedly_wake_or_reset(self):
        self.bootstrap()
        original = event("WAKE-ONCE")
        self.packet_cli("touch", self.touch_packet([original]))
        before = self.frozen_bytes()
        self.packet_cli("touch", self.touch_packet([original]))
        self.assertEqual(before, self.frozen_bytes())
        self.packet_cli("advance", self.cycle(1))
        self.age_to(2, first=2)
        self.assertEqual(self.item()["idle_handoffs"], 2)
        reexport = dict(original, event_id="WAKE-REEXPORT", source_revision="export-2")
        self.packet_cli("touch", self.touch_packet([reexport]))
        self.assertEqual(self.item()["idle_handoffs"], 2)
        self.assertFalse(self.item()["pending_baseline"])

    def test_copied_history_and_routine_checks_do_not_reactivate_archives(self):
        self.bootstrap()
        self.age_to(5)
        old_events = [
            event("COPIED", kind="MENTION", origin="CARRY_FORWARD"),
            event("ROUTINE", kind="ROUTINE_CHECK"),
            event("QUOTE", kind="HISTORICAL_QUOTE"),
        ]
        self.packet_cli("touch", self.touch_packet(old_events))
        self.assertEqual((self.item()["attention_state"], self.item()["idle_handoffs"]), ("ARCHIVED", 5))
        self.assertEqual(self.item()["record"]["body_md"], BODY)

    def test_fresh_test_execution_and_error_recurrence_reset_attention_only(self):
        test_record = record("DEMO-T1", "TEST")
        test_record["business_state"] = {"execution_result": "PASS", "environment": "synthetic"}
        self.bootstrap([record(), test_record])
        self.age_to(3)
        events = [event("NEW-ERROR", kind="ERROR_RECURRED"), event("NEW-RUN", "DEMO-T1", "TEST_RUN")]
        self.packet_cli("advance", self.cycle(4, events=events))
        self.assertEqual(self.item()["idle_handoffs"], 0)
        self.assertEqual(self.item("DEMO-T1")["idle_handoffs"], 0)
        self.assertEqual(self.item()["record"]["business_state"]["execution_result"], "FAIL")
        self.assertEqual(self.item("DEMO-T1")["record"]["business_state"]["execution_result"], "PASS")

    def test_effective_constraint_stays_active_and_cannot_be_imported_unpinned(self):
        constrained = record("DEMO-C1", "CONSTRAINT", pinned=True)
        self.bootstrap([constrained])
        self.age_to(6)
        self.assertEqual(self.item("DEMO-C1")["attention_state"], "ACTIVE")
        invalid = record("DEMO-C2", "CONSTRAINT", pinned=False)
        packet = self.cycle(7, [invalid], [event("BAD-CONSTRAINT", "DEMO-C2", "CHANGE")])
        before = self.frozen_bytes()
        self.packet_cli("advance", packet, expected=2)
        self.assertEqual(before, self.frozen_bytes())

    def test_pinned_active_view_stays_compact_while_full_idle_history_is_preserved(self):
        constrained = record("DEMO-C1", "CONSTRAINT", pinned=True)
        self.bootstrap([constrained])
        self.age_to(8)
        current = self.item("DEMO-C1")
        idle_history = [entry for entry in current["history"] if entry["action"] == "IDLE_REVIEW"]
        self.assertEqual(len(idle_history), 8)
        active = (self.current_dir() / "ACTIVE_CONTEXT.md").read_text(encoding="utf-8")
        self.assertIn(BODY, active)
        self.assertIn("FAIL", active)
        self.assertNotIn('"action": "IDLE_REVIEW"', active)
        self.assertNotIn("DEMO-H1", active)
        self.assertNotIn("DEMO-H7", active)
        self.assertEqual(current["record"], constrained)

    def test_missing_current_with_existing_generation_cannot_reinitialize_the_store(self):
        self.bootstrap()
        self.age_to(1)
        lost_pointer = self.store / "CURRENT"
        saved_pointer = lost_pointer.read_bytes()
        lost_pointer.unlink()
        before = self.frozen_bytes()
        replacement = {
            "schema_version": 1,
            "handoff": {
                "id": "DEMO-RESTART-H0", "parent_id": None,
                "source_batch_id": "DEMO-RESTART-B0", "completed": True,
                "intake_closed": True, "coverage_complete": True,
                "evidence_refs": ["DEMO:must-not-reset-existing-history"],
            },
            "upserts": [record()],
            "observations": [observation("DEMO-E1", "CHANGED")],
            "events": [event("RESTART-CREATE", kind="CHANGE")],
        }
        try:
            self.packet_cli("advance", replacement, expected=2)
            self.assertFalse(lost_pointer.exists())
            self.assertEqual(before, self.frozen_bytes())
            self.run_cli("render", "--store", self.store, "--out", self.root / "lost-pointer-export", expected=2)
            self.assertFalse((self.root / "lost-pointer-export").exists())
            self.assertEqual(before, self.frozen_bytes())
        finally:
            lost_pointer.write_bytes(saved_pointer)
        self.assertEqual(self.state()["last_handoff_id"], "DEMO-H1")
        self.assertEqual(self.item()["idle_handoffs"], 1)

    def test_scan_uses_exact_id_boundaries_and_only_reports_alias_candidates(self):
        first = record("DEMO-D08", "DECISION")
        second = record("DEMO-D09", "DECISION")
        first["aliases"] = ["shared-restore", "unique-restore"]
        second["aliases"] = ["shared-restore"]
        self.bootstrap([first, second])
        text = self.root / "new-message.txt"
        text.write_text("DEMO-D080 is another identifier. shared-restore and unique-restore.\n", encoding="utf-8")
        before = self.frozen_bytes()
        report = self.run_cli("scan", "--store", self.store, "--text", text, "--source-id", "DEMO-LC2", "--source-revision", "r1")
        candidates = report["candidates"]
        self.assertFalse(any(c["match_type"] == "EXACT_ID" for c in candidates))
        ambiguous = [c for c in candidates if c["match_type"] == "AMBIGUOUS_ALIAS"]
        self.assertTrue(ambiguous)
        self.assertEqual(set(ambiguous[0]["candidate_item_ids"]), {"DEMO-D08", "DEMO-D09"})
        self.assertTrue(all(c["requires_classification"] for c in candidates))
        self.assertEqual(before, self.frozen_bytes())
        text.write_text("Please discuss DEMO-D08 again.\n", encoding="utf-8")
        report = self.run_cli("scan", "--store", self.store, "--text", text, "--source-id", "DEMO-LC2", "--source-revision", "r2")
        self.assertEqual([c["candidate_item_ids"] for c in report["candidates"] if c["match_type"] == "EXACT_ID"], [["DEMO-D08"]])
        self.run_cli("scan", "--store", self.store, "--text", self.current_dir() / "16_ARCHIVED_ITEMS.md", "--source-id", "DEMO-LC2", "--source-revision", "r3", expected=2)

    def test_changed_body_and_previous_evidence_survive_complete_export(self):
        self.bootstrap()
        changed = record(body="New synthetic condition: keep both failed inputs.\n所有旧限定继续保留。")
        changed["business_state"] = {"execution_result": "NOT_RUN", "resolved": False}
        self.packet_cli("advance", self.cycle(1, [changed], [event("CHANGE-BODY", kind="CHANGE")]))
        self.assertEqual(self.item()["record"], changed)
        output = self.root / "complete-export"
        self.run_cli("render", "--store", self.store, "--out", output)
        exported = json.loads((output / "state.json").read_text(encoding="utf-8"))
        strings = list(string_values(exported))
        self.assertIn(BODY, strings)
        self.assertIn("FAIL", strings)
        self.assertIn(changed["body_md"], (output / "ACTIVE_CONTEXT.md").read_text(encoding="utf-8"))

    def test_default_dry_runs_do_not_create_or_mutate_the_store(self):
        initial = record()
        packet = self.cycle(0, [initial], [event("DRY-CREATE", kind="CHANGE")])
        self.packet_cli("advance", packet, apply=False)
        self.assertFalse(self.store.exists())
        self.packet_cli("advance", packet)
        before = self.frozen_bytes()
        self.packet_cli("advance", self.cycle(1), apply=False)
        self.packet_cli("touch", self.touch_packet([event("DRY-TOUCH")]), apply=False)
        self.assertEqual(before, self.frozen_bytes())

    def test_script_owned_counter_injection_and_invalid_identifiers_are_rejected(self):
        self.bootstrap()
        for field, value in (("idle_handoffs", 999), ("attention_state", "ARCHIVED")):
            with self.subTest(field=field):
                injected = record()
                injected[field] = value
                before = self.frozen_bytes()
                self.packet_cli("advance", self.cycle(1, [injected], [event("INJECT-" + field, kind="CHANGE")]), expected=2)
                self.assertEqual(before, self.frozen_bytes())
        bad = record("../outside")
        self.packet_cli("advance", self.cycle(1, [bad], [event("BAD-ID", "../outside", "CHANGE")]), expected=2)
        self.assertFalse((self.root / "outside").exists())
        pointer = self.store / "CURRENT"
        original_pointer = pointer.read_bytes()
        try:
            pointer.write_text("../outside\n", encoding="utf-8")
            self.run_cli("render", "--store", self.store, "--out", self.root / "escape-export", expected=2)
            self.assertFalse((self.root / "escape-export").exists())
        finally:
            pointer.write_bytes(original_pointer)

    def test_fifth_round_preview_does_not_commit_before_completion_gate(self):
        self.bootstrap()
        self.age_to(4)
        packet = self.cycle(5)
        packet["handoff"]["completed"] = False
        before = self.frozen_bytes()
        output = self.root / "candidate-preview"
        self.packet_cli("advance", packet, apply=False, extra=("--preview-dir", output))
        self.assertEqual(before, self.frozen_bytes())
        self.assertEqual((self.item()["idle_handoffs"], self.item()["attention_state"]), (4, "ACTIVE"))
        self.assertTrue(output.is_dir())
        self.assertTrue(any("PREVIEW" in p.read_text(encoding="utf-8") for p in output.rglob("*.md")))
        self.packet_cli("advance", packet, expected=2)
        self.assertEqual(before, self.frozen_bytes())
        packet["handoff"]["completed"] = True
        self.packet_cli("advance", packet)
        self.assertEqual((self.item()["idle_handoffs"], self.item()["attention_state"]), (5, "ARCHIVED"))

    def test_rendered_files_are_complete_hashed_and_existing_export_is_not_overwritten(self):
        self.bootstrap()
        output = self.root / "rendered"
        before = self.frozen_bytes()
        self.run_cli("render", "--store", self.store, "--out", output)
        self.assertEqual(before, self.frozen_bytes())
        self.assertEqual(json.loads((output / "state.json").read_text()), self.state())
        inventory = {}
        for line in (output / "MANIFEST.sha256").read_text().splitlines():
            digest, name = line.split("  ", 1)
            self.assertNotEqual(name, "MANIFEST.sha256")
            self.assertEqual(hashlib.sha256((output / name).read_bytes()).hexdigest(), digest)
            inventory[name] = digest
        actual = {p.relative_to(output).as_posix() for p in output.rglob("*") if p.is_file() and p.name != "MANIFEST.sha256"}
        self.assertEqual(set(inventory), actual)
        rendered = self.frozen_bytes(output)
        self.run_cli("render", "--store", self.store, "--out", output, expected=2)
        self.assertEqual(rendered, self.frozen_bytes(output))

    def test_two_same_parent_commits_cannot_both_advance_the_store(self):
        self.bootstrap()
        packets = [self.cycle(1), self.cycle(2)]
        processes = [
            subprocess.Popen(
                self.command("advance", "--store", self.store, "--input", self.input_file(packet), "--apply"),
                cwd=self.root, env=self.environment, text=True, encoding="utf-8",
                stdout=subprocess.PIPE, stderr=subprocess.PIPE,
            ) for packet in packets
        ]
        output = [process.communicate(timeout=20) for process in processes]
        codes = [process.returncode for process in processes]
        self.assertEqual(sorted(codes), [0, 2], output)
        self.assertEqual(self.item()["idle_handoffs"], 1)
        self.assertIn(self.state()["last_handoff_id"], {"DEMO-H1", "DEMO-H2"})


if __name__ == "__main__":
    unittest.main()
