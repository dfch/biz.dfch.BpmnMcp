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

**Question.** How reliable is the pixel strategy over a full draw? Three
fresh-load pixel draws of the pinned Task A model (6 shapes + 6 sequence
flows; Task 160.100 verified the pin complete and drift-free across all
occurrences in the plan — the quoted labels are the pinned ids, element
names are not pinned and not scored). Each run: fresh
`browser_navigate` → pixel-native Load of the staged empty-process
baseline `r2-baseline.bpmn` (created from the terminal via the file API,
byte-exact `EMPTY_DIAGRAM_XML` from `web/bridge.js` — a precondition,
since Phase 130 finding 2 proved pixel creation is rejected on a truly
empty canvas) → full pixel-first draw (palette click → canvas click →
Escape per shape; the global connect tool re-armed before each of the 6
connects — the armed tool is single-use per the installed
diagram-js/bpmn-js source) → close: bridge `getState()` (final state
capture), bridge save as `r2-run-N.bpmn` (the plan's D4 allowed
measurement channel — state capture, not a strategy use, not a
fallback), screenshot. Per-run call count = the Playwright MCP calls
from after the baseline Load completes through the close (staging
excluded). Deviation = the approved Option A structural metric (D1 shape
counts + D2 flow count + D3 connectivity/types; 0 = perfect structure).
**Id-identity constant gap (one-time, not per-run scored):** the pinned
ids (`start`/`task`/`gw`/`task1`/`task2`/`end`, `f1`–`f6`) are
unmatchable against the factory-generated actual ids (12/12) under either
strategy — no id surface on the page (R3) and no id parameter in the
bridge API; the structural score is the deviation meter, and the three
runs produced three mutually disjoint factory id sets (listed in the raw
record).

| run | call count | retries after failure | deviation (D1+D2+D3)                        | aux. position drift                                                | wall time                    | state-capture channel                     | notes                                                                                                                                                                                                                                                                                                    | raw ref                    |
| --- | ---------- | --------------------- | ------------------------------------------- | ------------------------------------------------------------------ | ---------------------------- | ----------------------------------------- | -------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | -------------------------- |
| 1   | 43         | 0                     | 0 (D1 0 + D2 0 + D3 0: D3a 0, D3b 0, D3c 0) | ≈1.08 px (grid snap ≤5 px on start/gw/end; on-grid nominals exact) | 78.7 min (11:36:40→12:55:21) | bridge save (D4) `r2-run-1.bpmn` (3886 B) | recipe-development run: the first two shapes unbatched (separate Escape call) plus the run-1-only gateway type verification — live-confirmed `bpmn:ExclusiveGateway` after the single palette drop, so the anticipated "Change element" compound op was NOT needed (see summary); `160-110-r2-run-1.png` | `160-120-r2-raw.md` §Run 1 |
| 2   | 29         | 0                     | 0 (D1 0 + D2 0 + D3 0: D3a 0, D3b 0, D3c 0) | ≈1.08 px (the same six model centers as run 1)                     | 39.9 min (13:30:42→14:10:38) | bridge save (D4) `r2-run-2.bpmn` (3886 B) | fully batched convention (per shape: palette click + one click/Escape/probe call; per connect: palette re-arm + one clicks/probe call); every creation and connect first-try OK; `160-110-r2-run-2.png`                                                                                                  | `160-120-r2-raw.md` §Run 2 |
| 3   | 29         | 0                     | 0 (D1 0 + D2 0 + D3 0: D3a 0, D3b 0, D3c 0) | ≈1.08 px (the same six model centers as runs 1–2)                  | 24.6 min (14:20:04→14:44:37) | bridge save (D4) `r2-run-3.bpmn` (3886 B) | run 2's recipe verbatim; the third disjoint factory id set; every creation and connect first-try OK; `160-110-r2-run-3.png`                                                                                                                                                                              | `160-120-r2-raw.md` §Run 3 |

**Summary.** The pixel strategy did not wobble structurally in this phase:
3/3 runs reproduced the pinned Task A exactly (deviation min/mean/max =
0/0/0), with 0 retries and 0 bridge fallbacks in every run — no pixel
primitive ever failed, so the Strategy A fallback rule was never
triggered. The variance that the data does show is (1) **call count**:
43 vs 29 vs 29 — run 1 was the recipe-development run (the first two
shapes used the unbatched recipe with a separate Escape call, plus the
run-1-only gateway type-verification probe); runs 2–3 are stable at 29
under the documented batching convention (per shape: palette click + one
canvas-click/Escape/probe call; per connect: one palette re-arm + one
clicks/probe call); (2) **wall time**: 78.7 / 39.9 / 24.6 min — decaying
across the session with per-MCP-call round-trip latency (session
latency), not with draw complexity (runs 2–3 executed identical call
sequences); (3) **position**: exactly repeatable across runs (all three
landed on the same six model centers); the only systematic offset is the
pixel-create grid snap to 10 — start 118→120, gateway 425→430, end
738→740 (≤5 px vs the nominal layout, aux drift 1.08 px in every run),
whereas the bridge's `addShape` honors coordinates as-is (Phase 120) — a
constant, not a flake. The **gateway compound op was anticipated as the
hardest measurement point but was not an operation at all**: the
installed bpmn-js 18.31.1 palette "Create gateway" entry creates
`bpmn:ExclusiveGateway` directly (the entry's _icon_ is the generic
gateway glyph; `PaletteProvider.js`
`create.exclusive-gateway → createAction('bpmn:ExclusiveGateway', …,
"Create gateway")`, verified live in run 1), so the context-pad "Change
element" → exclusive path was never needed and the no-bridge-fallback
risk for it never materialized. Known constants carried by the pixel
strategy: the 12/12 id gap (three mutually disjoint factory id sets —
the structural score is the meter) and the one-shot connect tool (each of
the 6 connects needs its own palette re-arm — protocol overhead, zero
failures). **R4 qualification:** the bridge head-to-head reuses this
exact metric — D1+D2+D3 over the same slot mapping, the same
call-count convention (browser MCP calls in the run window, staging
excluded), plus wall time — so the R4 rows compare 1:1 against the
0/0/0 here.

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

**Question.** Head-to-head: for the same pinned Task A draw, how does
the bridge-only strategy (B) compare with the pixel strategy (A, Phase 160) on calls, failures, wall time, and deviation rate? Protocol mirror
of R2 — three fresh-load draws of the pinned Task A model (baseline per
run: fresh `browser_navigate` → `__bpmn.load('r2-baseline.bpmn')`, the
same staged empty-process file the pixel runs loaded, confirmed empty
in-page; the call-count window opens after that load, staging
excluded), the same structural metric (D1+D2+D3 over the same slot
mapping — start/end/gw by type, the pre-gw task by its incoming flow
from the start slot, task1 = the smaller-screen-x of the two post-gw
tasks), the same wall-time window (baseline-load-done to
score-recorded). One grain note (the counting convention made
operational for the bridge): a batched multi-statement
`browser_evaluate` counts as one call — the bridge's natural grain; this
phase ran at the per-primitive grain (one evaluate per `__bpmn` member →
6 addShape + 6 connect + state/geometry probe + save + screenshot = 15
counted calls per run). The bridge runs aimed at the R2 pixel runs'
ACHIEVED six model centers (center − half-size top-left corners — the
bridge honors coordinates as-is, Phase 120), so the two strategies'
geometry is directly comparable (aux drift measured against those
centers). Raw record: `bin/logs/170-120-r4-raw.md` (preamble + one block
per run); screenshots `170-110-r4-run-{1,2,3}.png`; saved models
`files/r4-run-{1,2,3}.bpmn`.

| strategy | run | call count | first-try failures / retries | deviation (D1+D2+D3)                        | aux. position drift                                                | wall time                    | notes                                                                                                                                                                                                                                        | raw ref                    |
| -------- | --- | ---------- | ---------------------------- | ------------------------------------------- | ------------------------------------------------------------------ | ---------------------------- | -------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | -------------------------- |
| pixel    | 1   | 43         | 0 / 0                        | 0 (D1 0 + D2 0 + D3 0: D3a 0, D3b 0, D3c 0) | ≈1.08 px (grid snap ≤5 px on start/gw/end; on-grid nominals exact) | 78.7 min (11:36:40→12:55:21) | recipe-development run: first two shapes unbatched (separate Escape call) plus the run-1-only gateway type probe (live-confirmed `bpmn:ExclusiveGateway` — the compound op was NOT needed); copied from the R2 table; `160-110-r2-run-1.png` | `160-120-r2-raw.md` §Run 1 |
| pixel    | 2   | 29         | 0 / 0                        | 0 (D1 0 + D2 0 + D3 0: D3a 0, D3b 0, D3c 0) | ≈1.08 px (the same six model centers as run 1)                     | 39.9 min (13:30:42→14:10:38) | fully batched convention (per shape: palette click + one click/Escape/probe call; per connect: palette re-arm + one clicks/probe call); copied from the R2 table; `160-110-r2-run-2.png`                                                     | `160-120-r2-raw.md` §Run 2 |
| pixel    | 3   | 29         | 0 / 0                        | 0 (D1 0 + D2 0 + D3 0: D3a 0, D3b 0, D3c 0) | ≈1.08 px (the same six model centers as runs 1–2)                  | 24.6 min (14:20:04→14:44:37) | run 2's recipe verbatim; the third pixel factory id set; copied from the R2 table; `160-110-r2-run-3.png`                                                                                                                                    | `160-120-r2-raw.md` §Run 3 |
| bridge   | 1   | 15         | 0 / 0                        | 0 (D1 0 + D2 0 + D3 0: D3a 0, D3b 0, D3c 0) | 0.0 px (aimed at R2's achieved centers; as-is coordinates)         | 12.7 min (17:43:09→17:55:53) | per-primitive grain: 6 addShape + 6 connect, all first-try `{ ok }`; close = state/geometry probe + `__bpmn.save('r4-run-1.bpmn')` (a strategy B member, 3886 B) + screenshot; `170-110-r4-run-1.png`                                        | `170-120-r4-raw.md` §Run 1 |
| bridge   | 2   | 15         | 0 / 0                        | 0 (D1 0 + D2 0 + D3 0: D3a 0, D3b 0, D3c 0) | 0.0 px (the same six model centers as run 1)                       | 10.4 min (17:58:53→18:09:16) | run 1's recipe verbatim; the second bridge factory id set; save 3886 B; `170-110-r4-run-2.png`                                                                                                                                               | `170-120-r4-raw.md` §Run 2 |
| bridge   | 3   | 15         | 0 / 0                        | 0 (D1 0 + D2 0 + D3 0: D3a 0, D3b 0, D3c 0) | 0.0 px (the same six model centers as runs 1–2)                    | 11.1 min (18:23:52→18:35:01) | run 1's recipe verbatim; the third bridge factory id set; save 3886 B; `170-110-r4-run-3.png`                                                                                                                                                | `170-120-r4-raw.md` §Run 3 |

**Id-variance observation (approved Option A supplement — the data point
for the user's C-question).** (a) the three R4 factory id sets are
mutually disjoint (random-suffix factory ids, verified against the saved
files: 72 unique model ids across the six artifacts, 0 shared); (b)
**one table row: same model, six id sets** — all six Task A artifacts
across R2+R4 (`r2-run-{1,2,3}.bpmn`, `r4-run-{1,2,3}.bpmn`) carry six
mutually disjoint id sets for the same pinned model: the id-instability
a pinned-id API (the user's considered Option C) would remove, measured
without changing the system under test (full id sets in
`170-120-r4-raw.md` §Id-variance; the R2 sets in `160-120-r2-raw.md`).

**Comparison (the R4 verdict).** Deviation rate: **0% vs 0%** — 3/3 runs
per strategy reproduced the pinned Task A exactly (D1+D2+D3 = 0 in all
six runs), with 0 first-try failures and 0 retries in every run: the
head-to-head is not a reliability difference in this workload. Calls:
**bridge 15/15/15 vs pixel 43/29/29** — a ~2× step-count advantage for
the bridge against the pixel runs' stable convention (and ~3× against
pixel run 1's recipe-development number); the grain difference is
structural, 1 `browser_evaluate` per bridge primitive vs 3–5 UI ops per
pixel primitive (palette click + canvas click + Escape + probe per
shape; palette re-arm + endpoint clicks + probe per connect — the armed
connect tool is one-shot). Wall time: **bridge 12.7/10.4/11.1 min vs
pixel 78.7/39.9/24.6 min**, with the session-latency caveat stated: the
bridge runs happened later in the session (17:43–18:35Z, after R2's
14:44Z finish), so raw totals mix call count with per-call latency;
per-call the two are the same order (R4 ≈ 50.8/41.6/44.4 s per MCP call
vs R2 ≈ 109.5/82.3/50.9 s — both decaying with the session), so the
wall-time gap is dominated by call count, not by the bridge being
faster per op. Geometry: the bridge's as-is coordinates reproduced the
pixel runs' ACHIEVED centers exactly (aux drift 0.0 px in every bridge
run; the pixel runs' 1.08 px drift is their own grid-snap offset versus
their off-grid nominals — with R4 aiming at the achieved centers, the
two strategies' geometry is directly comparable and identical).
Preconditions (the robustness side): a pixel draw needs the loaded-
diagram baseline, aiming probes (R3: the snapshot exposes no
coordinates), an Escape after every creation's auto-opened label
editor, a palette re-arm before each of the 6 connects (the one-shot
tool), and grid-snap tolerance; the bridge needs none of these — no
aiming (model coordinates), no editor-interaction hazard, no DnD
surface, no re-arm — and `addShape` even auto-seeds an empty canvas, so
the loaded baseline is a protocol choice here, not a requirement. How
this reads for the R6/verdict: the proposal's value shows up in step
count and robustness (fewer ops per draw, fewer failure surfaces per
op), not in per-call speed — and both strategies still need the bridge
for verification (R3: the pixels have hands but no eyes; every run
above, pixel or bridge, was measured through `getState()`/save or a DOM
probe), so the pixels do not replace the bridge.

## R5: Save fidelity (Phase 180)

**Protocol.** Task B under both strategies with the identical single
rename (task `review-task`: name "Review order" → "Review order R5" —
pixel: double-click inline edit on the page UI; bridge:
`__bpmn.setProp`; expected producer: the same attribute set on the
parsed moddle tree; no other mutation in either run): pixel-first
Load → rename → Save as `r5-pixel.bpmn` (the bridge used as measurement
channel only), bridge `load` → `setProp` → `save` as
`r5-bridge.bpmn`, plus one re-save stability leg
(`load('r5-bridge.bpmn')` → `save('r5-resave.bpmn')`, no mutation — the
Modeler's own output round-tripped through the Modeler again). The
expected producer (`bin/180-120-01-generate-expected.mjs`, run by
`bin/180-120-00-xml-diff.sh` part 1) serializes the fixture + the same
rename with the root `node_modules`' `bpmn-moddle` under EXACTLY the
MCP server's save options, `moddle.toXML(root, { format: true })`
(`serializeBpmn`, `apps/mcp-server/src/prc/moddle.ts`, read-only
reference). Byte policy (stated once): everything compared as-written
bytes, no newline normalization; the only known constant is the +1
trailing newline the pre-commit EOF hook adds to `files/` artifacts AT
COMMIT TIME — not in effect here (uncommitted on-disk bytes). Diff set:
six pairs, each sha256 + unified diff, all in
`bin/logs/180-120-xml-diff.log` (a non-empty diff is data, not a
failure). Raw record: `bin/logs/180-120-r5-raw.md`; pixel-native label
verify `180-100-r5-a-rename.yml` (L13).

| #   | pair                                   | identical? (sha256) | diff size (lines)  | decisive diff                                                                                                                                                       | raw ref                        |
| --- | -------------------------------------- | ------------------- | ------------------ | ------------------------------------------------------------------------------------------------------------------------------------------------------------------- | ------------------------------ |
| 1   | `r5-pixel` vs `expected-renamed`       | no                  | +30/−1 (whole doc) | serialization style (compact vs 2-space indent, no vs with EOF newline) + one extra empty `<bpmndi:BPMNLabel />` on `shape-task`; model content otherwise identical | `180-120-xml-diff.log` §pair 1 |
| 2   | `r5-bridge` vs `expected-renamed`      | no                  | +30/−1 (whole doc) | same as pair 1 (the bridge save is byte-identical to the pixel save)                                                                                                | `180-120-xml-diff.log` §pair 2 |
| 3   | `r5-pixel` vs `r5-bridge`              | yes (`dbcecb04…`)   | 0                  | byte-identical — the strategy does not affect serialization at all                                                                                                  | `180-120-xml-diff.log` §pair 3 |
| 4   | `r5-pixel` vs `order-process` (orig.)  | no                  | +30/−1 (whole doc) | the rename (one `name` attribute) + the extra empty `BPMNLabel` + the serialization-style change; all ids/types/refs/coordinates unchanged                          | `180-120-xml-diff.log` §pair 4 |
| 5   | `r5-bridge` vs `order-process` (orig.) | no                  | +30/−1 (whole doc) | same as pair 4                                                                                                                                                      | `180-120-xml-diff.log` §pair 5 |
| 6   | `r5-resave` vs `r5-bridge`             | yes (`dbcecb04…`)   | 0                  | re-save byte-identical (load→save of the Modeler's own output drifts nothing)                                                                                       | `180-120-xml-diff.log` §pair 6 |

The whole-document formatting swap hides the model facts, so the raw
record isolates them by re-serializing both sides with the server's
exact options: the original fixture is a byte-fixed point of that
serializer (`expected-renamed` = original + exactly the 3 bytes
" R5"), and the normalized `r5-pixel` vs `expected-renamed` diff is a
SINGLE line — the extra `<bpmndi:BPMNLabel />`
(`180-120-r5-raw.md` §Semantic isolation).

**DI present?** Yes — every save carries the full `BPMNDiagram`/
`BPMNPlane` with all three `BPMNShape`s and both `BPMNEdge`s at the
fixture's exact coordinates/waypoints (pairs 4/5 show no coordinate
line differing; run 1 on-disk confirm), and the expected producer
keeps the DI too (it is the original + rename). The only DI delta of
the Modeler saves: one extra empty `<bpmndi:BPMNLabel />` (no bounds)
on the renamed shape.

**Rename only?** At the flow-model level, exactly: the intended delta
is the one `name` attribute and nothing else — ids, types,
`isExecutable`, `targetNamespace`, flow refs, DI geometry all
unchanged (the single-line normalized diff). In the saved bytes, the
Modeler's rename command carries one DI-only side effect (that empty
`BPMNLabel`, added by bpmn-js's `BpmnUpdater.updateBPMNLabel` on
`element.updateLabel` — the command BOTH rename paths run; a pure
moddle rename never touches the DI), so "rename only" holds for model
content but not for byte content.

**Re-save stable?** Yes — pair 6 byte-identical (sha256 match, 0
diff lines): importing the Modeler's own compact output and saving
again drifts nothing (the empty label round-trips without bounds, DI
ordering stays, attribute order stays).

**R5 verdict.** "Save fidelity" splits into two layers, and the data
separates them cleanly. _Model-content fidelity: complete_ — the
Modeler's `saveXML()` is a faithful transport of the diagram state: DI
fully present, the rename the only flow-model delta, and the save
idempotent on its own output (re-save byte-stable). _Byte fidelity
against the MCP server's serialization: no, for two reasons, one
cosmetic and one minor-semantic._ Cosmetic: the page/bridge save calls
`saveXML()` with no options and the moddle-xml writer's default is
`format: false` — compact single-line, no EOF newline — where the
server's `serializeBpmn` passes `format: true` (2-space indent, EOF
newline); that style difference is the whole +30/−1 shape of pairs
1/2/4/5 and is invisible to any XML consumer. Minor-semantic: after a
rename, the Modeler's output carries one extra empty
`bpmndi:BPMNLabel` DI element a server-side rename would not write — a
no-bounds, no-content artifact of the Modeler's label behavior (raw
record §Mechanisms) that a byte-level diff against server-produced
files flags but a semantic one does not. And pair 3 is the clean
strategy result: the pixel and bridge saves are **byte-identical** —
both funnel through the same `modeler.saveXML()`, so the automation
strategy has zero effect on serialization; fidelity is a property of
the save path, not of how the edit was driven. For the proposal:
page-driven saves transport diagram state losslessly and
reproducibly, but their artifacts are not drop-in byte-equivalents of
the server's files (formatting, plus the label side effect after
renames) — a consideration for any workflow that byte-diffs or
version-stamps files across the two paths.

## R6: Human-in-the-loop (Phase 190)

**Leg as executed.** Task 190.090 (the hand-off) was performed by the
orchestrator with the user (2026-11-21); Task 190.110 (the user leg)
was performed by the user: the user opened the page in a browser on
their machine over an SSH port-forward to 127.0.0.1:8123 — sys0's
local display was not up in this environment (an environment note, not
a protocol deviation: every step of the leg ran against the same fixed
endpoint the plan's connect steps name) — loaded
`human-edit-start.bpmn` (the prep baseline: a byte-identical copy of
the Phase 170 final run `files/r4-run-3.bpmn`, 3887 B, sha256
`6846ea0b…`, structural baseline in
`bin/logs/190-100-prepare-human-edit.md`), inspected the agent-drawn
canvas, made manual edits, and saved via the page as
`human-edited.bpmn`. In the same leg the user reported the
icon-font bug: on the left palette the tool TOOLTIPS were visible but
NOT the tool ICONS (the user's browser runs Windows "High Contrast").
Root cause: the page never loaded `bpmn-font/css/bpmn.css` at all —
the `bpmn` icon font that provides every palette glyph via a `:before`
`content` was never defined, because the two CSS files the page did
load contain zero `@font-face` rules — so the glyphs were missing for
ALL users and ALL browsers (High Contrast was ruled out as the root
cause but is covered in the verification via a `forced-colors: active`
emulation). The fix was the one authorized line in `web/index.html`'s
`<head>` (`<link rel="stylesheet" href="/bpmn-js/assets/bpmn-font/css/bpmn.css" />`
over the existing `/bpmn-js/<file>` dist route), verified headless:
CSS + `bpmn.woff2` 200, the `bpmn` face `loaded` in `document.fonts`,
the first palette entry's `:before` carrying glyph U+E868 with a
matching width signature — under normal rendering AND forced colors
(full evidence + screenshots in `bin/logs/190-120-iconfix.md`).
Notably, the human leg itself completed successfully WITH the icons
missing: tooltips + canvas + inline rename + drag + Save were
sufficient for load/inspect/edit/save — the palette is what a human
needs for DRAWING, not for this leg's workload. Read-back protocol
(this session): file API → raw XML diff against the prep baseline →
moddle structural summaries → fresh `browser_navigate` →
`__bpmn.load('human-edited.bpmn')` → `__bpmn.getState()`. Raw record:
`bin/logs/190-120-r6-raw.md`.

| check                          | result                                                                                                                                                                                                                                                                                                                                   | evidence (raw ref)                  |
| ------------------------------ | ---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | ----------------------------------- |
| file API listing               | `GET /files` → 200; `human-edited.bpmn` in the 16-name listing                                                                                                                                                                                                                                                                           | `190-120-r6-raw.md` §Step 1         |
| file API fetch                 | `GET /file?name=human-edited.bpmn` → 200, 4157 B, sha256 `eb85da04…` byte-identical to the on-disk file                                                                                                                                                                                                                                  | `190-120-r6-raw.md` §Step 1         |
| raw-XML delta: renames         | FOUR renames (the baseline's six elements were all unnamed): `Activity_0y3fnmv` → "text in the first box", `Activity_14xbwag` → "some more text in the upper 2nd box", `Activity_18jggmj` → "the text in the lower box (moved the position too)", `Event_006yelo` → "the final state"; the start event and the gateway were left unnamed | `190-120-r6-raw.md` §Step 2, 1      |
| raw-XML delta: move            | `Activity_18jggmj_di` bounds (540,280,100,80) → (610,370,100,80) (center 590,320 → 660,410); the two touching edges re-routed (`Flow_0xamaaj_di` to (430,225)(430,410)(610,410), `Flow_0oijekh_di` 4 → 3 waypoints ending (722,200)); the other four edges byte-identical                                                                | `190-120-r6-raw.md` §Step 2, 2–3    |
| raw-XML delta: Modeler side fx | the four renamed shapes gained a `bpmndi:BPMNLabel` (three empty; the end event's with bounds (707,225,66,14) — the R5 rename side effect, carried 4× instead of 1×); the moved shape's DI re-appended last in the plane; no EOF newline (the compact `saveXML()` constant, R5)                                                          | `190-120-r6-raw.md` §Step 2, 4–5, 7 |
| raw-XML delta: invariants      | same 6 elements (ids/types), same 6 sequence flows (ids, sourceRef/targetRef), same definitions/namespace/process/`isExecutable`; no element added or removed, no condition expressions — the model is the baseline + 4 names + 1 move                                                                                                   | `190-120-r6-raw.md` §Step 2, 6      |
| bridge getState: renames       | `__bpmn.load('human-edited.bpmn')` → `{ ok: true }`; `getState()` carries ALL FOUR new names verbatim (and no `name` key on the two unnamed elements) — matching the XML exactly                                                                                                                                                         | `190-120-r6-raw.md` §Step 3         |
| bridge getState: structure     | 6 shapes + 6 flows with the baseline topology intact; zoom 1, scroll (0,0) (the import-time viewport — the bridge load does not `fit-viewport`)                                                                                                                                                                                          | `190-120-r6-raw.md` §Step 3         |
| bridge getState: the move      | n/a — `getState` mirrors the flow model; positions/DI are not in `getState` by design (the R5 finding), so the move is NOT model-visible there; the channel split is stated: names → both channels, move → raw-XML diff only                                                                                                             | `190-120-r6-raw.md` §Step 3         |

**The user's subjective notes (verbatim).** "Working with the process
was ok" — plus the icons report (tooltips visible, icons not; Windows
"High Contrast"). Recorded in `190-120-r6-raw.md` and, with the
finding, the root cause, the fix, and the verification, in
`190-120-iconfix.md`.

**R6 verdict.** The human-in-the-loop flow worked end to end: a human
opened the page, inspected the agent-drawn canvas, renamed four
elements inline, dragged one element (the two touching edges
re-routed correctly), and saved via the page UI — and the agent read
the entire edit back, with the four renames confirmed in BOTH the raw
XML and the bridge's `getState()` (model-visible) and the move
confirmed in the raw XML (DI-only, not in `getState` by design),
structure intact in both channels (ACC-006 met). What the icons
episode says for the proposal: a human needs the visual affordances
the headless agent doesn't — every automated phase (130–180) passed
with the palette glyphs missing, because the agent never looks at the
canvas (R3), while the FIRST human-eyes review in this feature found
a real rendering gap that was invisible to every automated gate; the
fix was one line, but it was exactly the class of defect only a human
leg can surface. The leg also shows the page surviving a real-world
accessibility setting (High Contrast / forced colors) once the font
is loaded — the glyphs are text and forced colors recolor rather than
erase them — and the tooltip-plus-canvas sufficiency of the
icons-missing leg (load/inspect/edit/save all worked) bounds the
palette's role: it is the affordance for DRAWING, not for
consuming-or-tweaking an existing diagram.
