---
task: drawing-persistence
status: completed
updated: 2026-11-17
---

## Goal
Fix drawing workflow persistence/restoration and missing Chinese pen tooltip. User explicitly excludes IMAGE path fix.

## Progress
- Read AGENTS/task-notes, existing sidebar note and current sources via CodeGraph.
- Verified 1.59.1 DOMWidget native getValue/setValue hooks; serializeValue is separate API prompt serialization.
- Save optional canvasDataURL in workflow widget value, restore exact PNG pixels asynchronously, retain API {image} upload output.
- Added translated restore error and Chinese pen tooltip; legacy empty values remain supported.

## Verified
- pnpm -C frontend typecheck / check:build PASS; test: 9 Chromium tests PASS including exact PNG round-trip, invalid payload recovery, legacy empty value and key parity. Vite rebuilt js/main.js.
- COMFYUI_TEST_URL=http://127.0.0.1:8188 pnpm -C frontend test:host --skip-image-execution: 16 checks PASS, IMAGE explicitly SKIP; native graphToPrompt/handleFile restored actual black pixels. Exit 0, no browser pageerrors.

## Decisions
- Embed small 300x300 drawing PNG in native workflow Widget value; no separate storage.
- Do not alter Python LoadImage delegation. Explicit host test flag skips only IMAGE execution; not a claimed pass.

## Blockers
- Old workflows already saved without pixels cannot recover missing data.

## Next
- Complete. Refresh ComfyUI browser to load rebuilt JS. IMAGE backend remains untouched by user instruction.
