# feat-29 prototype — evaluation results (R1–R6)

Purpose: the six-rubric evaluation per REQ-005 of the Playwright-MCP +
bpmn-js Modeler prototype (throwaway evidence run, GitHub issue #29):
does driving a local Modeler page through the Playwright MCP tools
deliver agent-driven BPMN editing without the file-backed MCP server's
tool layer? Each rubric item is filled by its own phase; raw evidence
lives under `bin/logs/` (gitignored) and every filled cell references
that raw data.

Date: 2026-11-20 (R3 captured in two sessions, 01:52–02:10Z and
04:36–04:55Z UTC; later phases append their sections).

Strategies under test (per the plan's Design Notes):

- **Strategy A (pixels):** palette drags/clicks, canvas drops, port
  clicks, double-click rename, the page's Load/Save buttons — driven
  through the Playwright MCP tools against the page UI; the bridge may
  be used only as a documented fallback after a failure (recorded in the
  R1 "fallback used" column) — the single declared exception being the
  Phase 160 post-draw bridge save (`r2-run-N.bpmn`), which is an allowed
  measurement channel (state capture), not a strategy use.
- **Strategy B (bridge):** `window.__bpmn` only, via `browser_evaluate`.

Raw-data convention: every row/cell references files under `bin/logs/`
(R3 snapshots `140-100-r3-*.yml`, the running record
`140-120-r3-raw.md`; later phases add their own logs/screenshots).
Later phases (150–190) append their sections in place; Phase 200
finalizes all six sections, enforces the no-unexplained-`n/a` rule, and
collects via `bin/200-100-00-collect-results.sh`. An `n/a` (or empty)
cell must always carry a reason.

## R1: First-try success per primitive (Phase 150)

- pending: Phase 150 — pixel-first pass over {add-shape, connect,
  rename, load, save} with the bridge as documented fallback after a
  failure, then the same five primitives via `__bpmn` only; one table
  row per primitive × strategy (first-try ok/fail, fallback used,
  notes). Not filled here: this phase (140) owns R3 only.

## R2: Flakiness, pixel strategy (Phase 160)

- pending: Phase 160 — three fresh-load full pixel draws of the pinned
  Task A model; per run: call count, retries after failure, deviation
  of the final `getState()` from the target, wall time, state-capture
  channel recorded as the bridge save. Not filled here: this phase (140)
  owns R3 only.

## R3: State readability via browser_snapshot alone (Phase 140)

**Question.** What can the agent read of the diagram/page state from
`browser_snapshot` alone — no bridge, no `browser_evaluate`? Captures
(each saved with an explicit `filename` under `bin/logs/`): the empty
canvas, the fixture-loaded canvas via the page's Load button
(`order-process.bpmn`), a dedicated palette capture, the inline
(double-click) label edit while the direct-editing overlay is open, and
— for the event-log and selection rows — one pixel drag plus one
keyboard undo so the log is non-empty and an element is selected.
Ground-truth reference: `window.__bpmn.getState()` on the fixture-loaded
canvas (labeled measurement channel, not a strategy use) — recorded in
`bin/logs/140-120-r3-raw.md` §3; it matches `files/order-process.bpmn`
exactly (3 named elements, 2 sequence flows, zoom 1 after
`fit-viewport`, no committed rename). Every readability finding below
is based on snapshot content; where `browser_evaluate` was required it
is said so.

| item                               | readable by snapshot alone   | evidence (`bin/logs/` file + what to look for)                                                                                                                                                                                                        | notes                                                                                                                                                                          |
| ---------------------------------- | ---------------------------- | ----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------ |
| shape labels (element names)       | yes                          | `140-100-r3-fixture-loaded.yml` L12–14: the three labels as bare text under the canvas `img` node                                                                                                                                                     | labels are unbound: no id/type/position association; the inline-edit snapshot shows the edited label as an `active` text node (`140-100-r3-inline-edit.yml` L33)               |
| BPMN element ids                   | no                           | absent from all five snapshots (e.g. `140-100-r3-fixture-loaded.yml`); ids exist only in the DOM as `data-element-id` (raw record §2/§5)                                                                                                              | needs `browser_evaluate` (DOM probe) or bridge `getState().elements[].id`                                                                                                      |
| element types (event/gateway/task) | no                           | snapshot shows label text and palette names only — no per-shape type marker; the DOM class is only `djs-shape`/`djs-connection` (raw record §5)                                                                                                       | needs bridge `getState().elements[].type` (a DOM probe cannot tell a task from an event)                                                                                       |
| palette entries                    | yes                          | `140-100-r3-palette.yml` L28–45 (dedicated capture; identical in `140-100-r3-empty-canvas.yml` L10–26): 14 named, ref-addressable entries                                                                                                             | directly clickable/type-able by ref — the one model-adjacent surface the pixel strategy can read fully                                                                         |
| coordinates / positions            | no                           | no coordinate data in any snapshot; positions live only in DOM transforms (task screen rect (252,125,100×80), viewport `matrix(1 0 0 1 0 0)` — raw record §2)                                                                                         | needs a DOM probe or bridge + file API (the DI in the saved XML)                                                                                                               |
| zoom level                         | no                           | no zoom node in the a11y tree — and no zoom widget in the DOM at all (`#canvas [class*="zoom"]` → `[]`, raw record §2)                                                                                                                                | needs a DOM probe (viewport transform) or `getState().zoom`                                                                                                                    |
| selection state                    | partial                      | nothing in the tree while unselected (`140-100-r3-fixture-loaded.yml`); when selected, the context pad appears — `140-100-r3-event-log.yml` L15–26 (8 named entries, e.g. `generic "Append end event" [ref=e52]` … `generic "Delete" [ref=e58]`)      | the pad carries no id/coordinate binding to the selected element; "which element" needs evaluate/bridge; Escape during direct-edit also clears the selection (raw record §6.9) |
| commandStack.changed event log     | partial (yes when non-empty) | empty log → no node at all (`140-100-r3-fixture-loaded.yml`: an empty `<pre>` is absent from the a11y tree, so "no commands yet" is indistinguishable from "no log"); after drag + undo → both lines as ONE text node: `140-100-r3-event-log.yml` L48 | lines are `timestamp + "commandStack.changed"` only — no command type, no element, no undo/redo marker; Phase 130 corroborates visibility with 8 lines (`130-120-smoke.md`)    |
| watermark                          | yes                          | all five snapshots: `link "Powered by bpmn.io" [ref=e29/f4e29]` → `http://bpmn.io`                                                                                                                                                                    | unmodified per REQ-001; no caveat — readable as-is in every capture                                                                                                            |
| flow connectivity                  | no                           | the 2 sequence flows are invisible in every snapshot (unlabeled `djs-connection` paths — raw record §5); only their shapes' labels are present                                                                                                        | needs bridge `getState().flows` (or the file API on the saved XML)                                                                                                             |

What the snapshot does NOT expose (raw record §5, the core R3 data):
BPMN ids (the `data-element-id` DOM attribute only), exact model
coordinates (SVG/viewport transforms only), element types
(business-object data only), flow connectivity (unlabeled paths),
zoom/scroll (no widget in the DOM at all), selection binding (the
context pad is unbound), and command semantics (event-log lines are
typeless).

**R3 verdict (one line):** `browser_snapshot` exposes the UI chrome
(control strip incl. status text, the 14-entry palette, the watermark,
event-log lines once non-empty, the selection context pad) and the
rendered shape labels — but not a single BPMN model fact (ids, types,
coordinates, zoom, connectivity, selection binding), so the pixel
strategy has hands but no eyes.

**Implication (how R1/R2 are read).** The pixel strategy cannot stand
alone: it can execute (Phase 130: palette-click create, canvas mouse
drag, keyboard undo all worked; the palette-entry HTML5-DnD drag does
not complete in this headless setup), but it cannot verify. Every R1
success check (did the shape land? did the rename commit? did the save
write the right bytes?) and every R2 deviation metric (final state vs
the pinned Task A model) must therefore be measured through the bridge
(`getState()`, save + file API) or a DOM `browser_evaluate` — the
bridge is the measurement channel even for Strategy A runs, and R1/R2
rows record which channel confirmed each result; a pixel action whose
result cannot be confirmed by that channel does not count as
successful. Without the bridge, the pixel strategy's only feedback is
page-level (status text, event-log line count) — enough to notice that
a command happened, not enough to know what the diagram is. The
proposal's value (pixels replacing the file-backed MCP tool layer)
holds only insofar as `window.__bpmn` stays in the page: the pixels do
not replace it.

## R4: Pixel vs bridge head-to-head (Phase 170)

- pending: Phase 170 — three fresh-load bridge-only draws of Task A
  (`r4-run-N.bpmn` + screenshots), compared against the Phase 160 pixel
  runs: calls, failures, wall time, deviation rate. Not filled here:
  this phase (140) owns R3 only.

## R5: Save fidelity (Phase 180)

- pending: Phase 180 — Task B pixel-first (Load, double-click rename,
  Save as `r5-pixel.bpmn`) and Task B bridge (`r5-bridge.bpmn`);
  `bin/180-120-00-xml-diff.sh` generates the expected moddle
  serialization and diffs both outputs (DI present? rename only?
  re-save stability?). Not filled here: this phase (140) owns R3 only.

## R6: Human-in-the-loop (Phase 190)

- pending: Phase 190 — the user's manual edit + save on sys0's local
  display (`human-edit-start.bpmn` → `human-edited.bpmn`), then the
  agent's read-back via the file API and the bridge, plus the user's
  subjective notes. Not filled here: this phase (140) owns R3 only.
