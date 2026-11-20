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

**Question.** For each of the five primitives {add-shape, connect,
rename, load, save}, does each strategy succeed on the first genuine
attempt? Strategy A = pixels (palette click, canvas pixel clicks,
double-click inline edit, the page's Load/Save buttons — the bridge
only as a documented fallback after a failure, per the Strategy A rule);
Strategy B = `window.__bpmn` only, via `browser_evaluate`. Every run
started from a fresh `browser_navigate` plus the documented baseline
(fixture `order-process.bpmn`, loaded pixel-natively for A, via
`__bpmn.load` for B — the load primitive itself carries no baseline);
each result was confirmed through the labeled measurement channel
(bridge `getState()` — the R3 implication — or the terminal file API
for the two save runs). Pixel aiming used the DOM `data-element-id`
screen-rect probe (operational aiming, per the R3 raw record §5). Raw
record: `bin/logs/150-120-r1-raw.md` (one § per run); evidence
snapshots `150-100-r1-a-rename.yml`, `150-100-r1-a-load.yml`.

| primitive | strategy   | first-try | retries | fallback used                                                                                                                                      | confirmed by (channel)                     | notes                                                                                                                                                                                                                                                                                                                                 | raw ref                                             |
| --------- | ---------- | --------- | ------- | -------------------------------------------------------------------------------------------------------------------------------------------------- | ------------------------------------------ | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | --------------------------------------------------- |
| add-shape | A (pixels) | ok        | 0       | none                                                                                                                                               | bridge `getState()`                        | palette "Create task" → canvas click (600,300) → Escape (the label editor auto-opens on creation — the Phase 130 finding); new unnamed Task `Activity_0q4vh8s`; required the loaded-diagram baseline (empty canvas rejects `shape.create`)                                                                                            | `150-120-r1-raw.md` §A1                             |
| connect   | A (pixels) | ok        | 0       | none                                                                                                                                               | bridge `getState()`                        | first-try approach: the global connect tool (activate → click `start-event` (170,165) → click `end-event` (420,165)); new flow `Flow_06e1o5y` (start-event→end-event); the port-drag retry path (`page.mouse` down/move/up) was never needed — the connect tool is plain mouse clicks, sidestepping the headless HTML5-DnD limitation | `150-120-r1-raw.md` §A2                             |
| rename    | A (pixels) | ok        | 0       | none                                                                                                                                               | bridge `getState()` + snapshot label       | double-click `review-task` at (302,165) → inline editor filled with "Review order R1" → Enter; confirmed in `getState()` AND the rendered label (`150-100-r1-a-rename.yml` L13)                                                                                                                                                       | `150-120-r1-raw.md` §A3 + `150-100-r1-a-rename.yml` |
| load      | A (pixels) | ok        | 0       | none                                                                                                                                               | bridge `getState()` + snapshot status text | `#name` filled to `order-process.bpmn` → Load clicked; 3 shapes / 2 flows; status "loaded order-process.bpmn" (`150-100-r1-a-load.yml` L7)                                                                                                                                                                                            | `150-120-r1-raw.md` §A4 + `150-100-r1-a-load.yml`   |
| save      | A (pixels) | ok        | 0       | none                                                                                                                                               | file API (terminal)                        | baseline fixture → `#name` = `r1-pixel-save.bpmn` → Save clicked; listed by `GET /files` and written with the full model + DI (`GET /file`); status "saved r1-pixel-save.bpmn"                                                                                                                                                        | `150-120-r1-raw.md` §A5                             |
| add-shape | B (bridge) | ok        | 0       | n/a — the fallback concept exists only for Strategy A (the pixel strategy); Strategy B is the bridge itself, per the Design Notes' Strategy A rule | bridge `getState()`                        | `addShape('bpmn:Task', 450, 200, 'r1-bridge-task')` → `{ ok, id: "Activity_1qj7imq" }`; (x, y) honored as the DI top-left corner (the bridge's as-is coordinate semantics)                                                                                                                                                            | `150-120-r1-raw.md` §B1                             |
| connect   | B (bridge) | ok        | 0       | n/a — same reason as the add-shape B row                                                                                                           | bridge `getState()`                        | `connect('start-event', 'end-event')` → `{ ok, id: "Flow_1x3cd9d" }`; flow confirmed with correct source/target                                                                                                                                                                                                                       | `150-120-r1-raw.md` §B2                             |
| rename    | B (bridge) | ok        | 0       | n/a — same reason as the add-shape B row                                                                                                           | bridge `getState()`                        | `setProp('review-task', 'Review order R1B')` → `{ ok }`; name confirmed                                                                                                                                                                                                                                                               | `150-120-r1-raw.md` §B3                             |
| load      | B (bridge) | ok        | 0       | n/a — same reason as the add-shape B row                                                                                                           | bridge `getState()`                        | `load('order-process.bpmn')` → `{ ok }`; 3 shapes / 2 flows                                                                                                                                                                                                                                                                           | `150-120-r1-raw.md` §B4                             |
| save      | B (bridge) | ok        | 0       | n/a — same reason as the add-shape B row                                                                                                           | file API (terminal)                        | staged load + `setProp` rename → `save('r1-bridge-save.bpmn')` → `{ ok, bytes: 1557 }`; the on-disk XML carries the staged rename                                                                                                                                                                                                     | `150-120-r1-raw.md` §B5                             |

**Analysis.** All ten runs succeeded on the first genuine attempt (A
5/5, B 5/5); zero retries and zero bridge fallbacks anywhere in the
phase — no pixel primitive ever failed, so the Strategy A fallback rule
was never triggered. Where pixels succeed on first try: all five
primitives, but only with the three operational preconditions
established in Phases 130/140 in place: (1) a loaded diagram before
creation (an empty canvas has the implicit root, and `shape.create` is
rejected at the rules level — hence the pixel-native fixture Load as
baseline for A1–A3/A5); (2) the Escape step after a creation's
auto-opened label editor (its overlay intercepts any pointer event
until closed); (3) pixel coordinates from the DOM `data-element-id`
probe — `browser_snapshot` exposes no coordinates at all (R3), so
aiming accuracy is a _precondition_ of pixel first-try success, not a
consequence of it. The connect primitive succeeded first-try via the
global connect tool, the approach chosen precisely because the
palette's HTML5-DnD create drag does not complete in this headless
setup (Phase 130 finding 1): the connect tool is plain mouse clicks
(activate → source → target) and sidesteps DnD entirely; the
alternative port drag (`page.mouse` down on a source port, move, up on
the target) was recorded as the retry path and never needed. Strategy B
compares cleanly: also 5/5 first-try, but each primitive is a single
`browser_evaluate` returning `{ ok, ... }` (against 3–5 UI operations
plus baseline plus aiming for the same primitive under A), with no
aiming, no editor-interaction hazard, and no DnD limitation surface —
its only precondition is a loaded diagram for the mutating members
(`addShape` even auto-seeds an empty canvas, the Phase 120 bridge
design). The honest R1 reading: first-try reliability is equivalent
(10/10 either way) — the difference between the strategies is step
count and preconditions, not failure rate; a difference that R2 (pixel
flakiness over full draws) and R4 (head-to-head) stress under a much
heavier workload.

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
