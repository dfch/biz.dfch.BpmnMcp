---
classification: null
created: '2026-11-18T15:16:37.073+01:00'
id: feat-29-playwright-bpmn-prototype
status: planning
type: feat
updated: '2026-11-19T11:02:39.530+01:00'
version: 1.0.0
---

# Feature: Playwright + bpmn-js Modeler Prototype (Evidence Run)

## Plan

### Overview

Throwaway evidence run, not an architectural commitment: tests the user
proposal (2026-11-18) that a local page hosting the full bpmn-js
Modeler, driven by the agent through the Playwright MCP (load, save,
draw), delivers agent-driven BPMN editing without the file-backed MCP
server's tool layer. The prototype builds a minimal local server
(127.0.0.1:8123) under this feat folder serving the Modeler page, the
installed bpmn-js dist assets, a file API confined to `files/`, and a
`window.__bpmn` bridge over the Modeler API. An agent session then runs
a fixed evaluation protocol (Task A: full draw; Task B:
load/rename/save round trip) under two strategies - pixel automation
and in-page API - and scores six rubric items (R1 first-try success per
primitive, R2 flakiness across three pixel draws, R3 state readability
via browser snapshot alone, R4 pixel-vs-bridge head-to-head, R5 save
fidelity against the expected moddle serialization, R6 human-in-the-loop
on sys0's local display). Deliverables are `results.md` (structured
rows over raw data) and `VERDICT.md` (viable/conditional/no plus a
project recommendation feeding the Stage 2 decision per DEC fdc84432).
Everything lives under this feat folder: no code under `apps/`, no root
config changes. Playwright MCP runs headless on this system (user
constraint, 2026-11-18); its entry in the user's global opencode config
is already enabled and is neither verified nor modified by this feat.
Anchored in GitHub issue #29.

### Requirements

- REQ-001: The local server: a zero-dependency `node:http` server bound to 127.0.0.1 only on the fixed port 8123 (chosen to avoid 127.0.0.1:8080, permanently owned on this system by an external root-owned service - the feat-20 note); `GET /` serves the Modeler page; `GET /bpmn-js/<file>` serves files from the installed `bpmn-js` package's `dist` directory (resolved via Node's own resolver, `createRequire` - the feat-20 asset pattern); `GET /bridge.js` serves the feat-local `web/bridge.js`; the page runs the full Modeler (not the Viewer) and leaves the unmodified "powered by bpmn.io" watermark in the served Modeler bundle (the watermark lives in the bundle, not the page HTML); the server never writes to stdout.
- REQ-002: The file API is confined to `files/`: `GET /files` lists the scratch directory as JSON; `GET /file?name=` returns the raw file; `POST /file` writes the `name` plus the XML body; every read and write stays inside this feat's `files/` directory - a name that escapes it (`..`, absolute paths, encoded traversal) is rejected with 400; there are no other write endpoints.
- REQ-003: The `window.__bpmn` bridge over the Modeler API: `getState()` returning `{ elements: [{id, type, name?}], flows: [{id, kind, source, target?, conditionExpression?}], zoom, scroll }` (mirroring the MCP server's `parse` tool exactly: elements sorted by (type, id), flows sorted by id, and `conditionExpression` carried when non-empty, so results are comparable across approaches); `addShape(type, x, y, name?)`; `connect(sourceId, targetId, name?)`; `setProp(id, name?, isInterrupting?)`; `move(id, x, y)`; `load(name)`; `save(name)` (via the file API); plus `selfTest()` running an in-page addShape -> connect -> setProp -> getState -> save sequence; every member returns a structured `{ ok, ... }` or `{ error }` and never throws to the page.
- REQ-004: Playwright-MCP drivability (headless): the agent can `browser_navigate` to the page, `browser_snapshot` it, `browser_evaluate` the `__bpmn` members, and perform palette clicks and canvas drags without protocol errors.
- REQ-005: The evaluation protocol runs one phase per rubric item (R1..R6, Phases 140-190): raw data under `bin/logs/`, structured rows in `results.md` with one section per rubric item; an `n/a` cell must carry a reason.
- REQ-006: Human-in-the-loop: the user can open the page in a browser on sys0's local display (Task 190.090 hands over the exact connecting command at phase start), inspect an agent-drawn canvas, edit it manually, and save it via the page; the agent subsequently reads the human's edit back through the file API and the bridge.
- REQ-007: The verdict: `VERDICT.md` answers "is Playwright + Modeler a viable foundation for agent-driven BPMN editing?" (viable / conditional / no) with the R1-R6 evidence table, the predicted cons that materialized versus the predicted pros that held, and a project-direction recommendation.
- REQ-008: Confinement and gates: all prototype artifacts live under this feat folder; auxiliary scripts under `bin/` are named `PPP-TTT-NN-slug.ext` (PPP = phase number, TTT = task number within the phase, NN = script number within the task starting at 00; raw logs under `bin/logs/`); the root gate chain (`lint`, `format:check`, `build`, `test`) stays green with the feat folder present; no changes under `apps/`, no root manifest changes, no workspace entry.

### Acceptance Criteria

- [ ] ACC-001: REQ-001: `bin/100-110-00-verify-page.sh` proves `GET /` returns 200 with the Modeler markers (the `#canvas` container, the Modeler bundle `<script>` tag, the `BpmnModeler` reference, the `/bridge.js` script tag) and the three pinned dist assets (`bpmn-modeler.production.min.js`, `assets/diagram-js.css`, `assets/bpmn-js.css`) return 200 with sha256-identical bytes to the installed `bpmn-js` dist files, and the served Modeler bundle's bytes contain the unmodified watermark markers (`bjs-powered-by`, `Powered by bpmn.io` - the feat-20 pin).
- [ ] ACC-002: REQ-002: `bin/110-110-00-verify-file-api.sh` proves a POST -> GET round trip is byte-identical, the file appears in `GET /files`, and a traversal name is rejected with 400; `files/order-process.bpmn` is seeded from the repository fixture (the original is never modified).
- [ ] ACC-003: REQ-003: `__bpmn.selfTest()` returns `ok` in a real headless browser (the Phase 130 smoke): the mutate -> getState-reflects -> save-on-disk sequence holds.
- [ ] ACC-004: REQ-004: the Phase 130 smoke pass records `browser_navigate` 200, a `browser_snapshot` containing the canvas node, a successful `browser_evaluate` of `__bpmn.getState()`, and one palette click plus one canvas drag completing without protocol errors.
- [ ] ACC-005: REQ-005: `results.md` holds all six rubric sections (R1-R6) with filled cells; every `n/a` cell carries a reason; raw data is referenced under `bin/logs/`.
- [ ] ACC-006: REQ-006: after the user's manual edit and save on the local display (Task 190.110), the agent's read back (Task 190.120) shows the edit both in the raw XML and in the bridge's `getState()`.
- [ ] ACC-007: REQ-007: `VERDICT.md` exists with the verdict word (viable/conditional/no), the R1-R6 evidence table, the materialized-cons/held-pros analysis, and the recommendation; the README's Progress references it.
- [ ] ACC-008: REQ-008: every file under `bin/` except `bin/logs/` matches the `PPP-TTT-NN-slug.ext` naming regex, and the root gate chain is green with the feat folder present (no root config changes; `bin/logs/` excluded via a nested `.gitignore`).

### Scope

#### Included

- `web/server.mjs`, `web/index.html`, and `web/bridge.js` under this feat folder.
- The `files/` scratch directory, seeded from the `order-process` fixture.
- The `bin/` scripts per the `PPP-TTT-NN-slug.ext` convention, raw logs under `bin/logs/`.
- `results.md` and `VERDICT.md`.
- The Playwright-MCP agent-run evaluation protocol (Phases 130-190).
- The nested `.gitignore` for `bin/logs/` (kept for robustness if the feat folder is ever extracted or copied standalone; the root `.gitignore`'s `logs/` pattern already covers it in-repo).

#### Explicitly Out Of Scope

- Any change under `apps/`, `packages/`, the root manifest, or any machine config.
- The properties panel (`bpmn-js-properties-panel`) - double-click rename plus the bridge cover the protocol's needs.
- Live or two-way synchronization (the `yctimlin/mcp_excalidraw` canvas-server precedent is the Stage 2 shape; this prototype is turn-based and file-backed).
- Headed Playwright on this system (user constraint: headless only; the human leg uses the local display).
- A configurable port or host, and any non-localhost binding.
- Productionizing the bridge or the page.
- Committing `bin/logs/` raw data.

### Dependencies

#### Depends On

- GitHub issue #29
- DEC fdc84432-1b48-4eb9-82e0-ec13cb8cf8ba: Use a Node/TypeScript MCP Server for Agent-Driven BPMN Modeling (the Stage 2 precedent the verdict feeds; the watermark clause)
- DEC 5185d651-7283-4b1d-87e0-272795d15edf: Adopt Node.js 26 as the Sole Supported Runtime (the runtime floor everything here runs on)
- FEAT feat-20-preview-tool (the asset-serving pattern and the watermark-pin precedent)
- The installed `bpmn-js` package (root `node_modules`) - verified and restored by Task 100.090 before any asset pinning
- The user's global opencode config's `playwright` MCP entry (headless; already enabled per the user, 2026-11-18 - not verified or modified by this feat)
- The local display of sys0 (the R6 human leg)

### Design Notes

- **Port 8123.** 127.0.0.1:8080 is owned on this system by a root-owned external Jetty/PlantUML service (the feat-20 note); 8123 is arbitrary but fixed and documented; a configurable port is out of scope.
- **Asset pinning.** The page references the Modeler bundle plus the two CSS files at the same `/bpmn-js/<file>` prefix that mirrors the installed `dist` layout 1:1 (the feat-20 REQ-003/G2 convention); the verify script sha256-pins the served bytes against the installed files.
- **Bridge sketch.** `window.__bpmn` is a thin pass-through over the Modeler API (`modeler.createShape`, `modeler.createConnection`, the `modeling`/`elementRegistry` modules, save via `modeler.save_xml` plus the file API); `getState()` mirrors the MCP server's `parse` tool exactly (elements sorted by (type, id), flows sorted by id, `conditionExpression` carried when non-empty) so the two approaches are directly comparable.
- **Strategies under test.** Strategy A (pixels): palette drags, canvas drops, port clicks, double-click rename, the page's Load/Save buttons - the bridge may be used only as a documented fallback after a failure, and every such use is recorded (the R1 "fallback used" column) - the single declared exception is the Phase 160 post-draw bridge save (`r2-run-N.bpmn`), which is an allowed measurement channel (state capture), not a strategy use, and is recorded as such in the R2 rows. Strategy B (bridge): `__bpmn` only, via `browser_evaluate`.
- **Task A target model (pinned by Task 160.100).** start-event "start" -> task "task" -> exclusive-gateway "gw" -> task "task1" / task "task2" -> end-event "end", six sequence flows (`f1` start->task, `f2` task->gw, `f3` gw->task1, `f4` gw->task2, `f5` task1->end, `f6` task2->end; no condition expressions).
- **Task B.** Load the seeded `order-process.bpmn`; rename one element; save under the strategy-suffixed name; compare against the expected moddle serialization.
- **Evaluation data flow.** The agent appends structured rows to `results.md` as it goes; raw snapshot/screenshot/log files land in `bin/logs/` (gitignored); `bin/200-100-00-collect-results.sh` finalizes.
- **Prettier.** The feat folder is in Prettier scope (`.prettierignore` does not exclude `.specmgr`); Phase 200 runs `prettier --write` on the feat folder before the final gate.
- **'feat-20' references.** Unqualified 'feat-20' in this plan means this repo's `feat-20-preview-tool` (the asset-serving pattern, the port-8080 note, the watermark pin); the `PPP-TTT-NN` naming-convention precedent is the cross-repo one (biz.dfch.LlmOps feat-20), cited in Decisions Made.
- **Execution note.** Phases 140-190 are interactive agent work against the Playwright MCP and need a session with the browser tools; the build phases (100-130) are mostly script work. Expected cost: three full pixel draws plus three bridge draws, the primitive passes, and the round trips - a few hundred MCP calls in total. Execution may span sessions; every evaluation phase (140-180) begins by confirming the prototype server is running (start via `bin/130-120-00-start-server.sh` if not).

### Related Decisions

- DEC fdc84432-1b48-4eb9-82e0-ec13cb8cf8ba: Use a Node/TypeScript MCP Server for Agent-Driven BPMN Modeling (the Stage 2 live-canvas precedent and the watermark clause - the verdict feeds that decision)
- DEC 5185d651-7283-4b1d-87e0-272795d15edf: Adopt Node.js 26 as the Sole Supported Runtime (the Node 26 floor)
- QA 818fac76-96fb-4e3c-acb8-e5520fab5913 (the implementation Q&A): the tool surface the prototype is compared against

### Task List

#### Phase 100: Server and Modeler page

- [ ] Task 100.090: Verify the workspace install holds the declared dependency - `node_modules/bpmn-js` exists at the root with the exact dist assets `bpmn-modeler.production.min.js`, `assets/diagram-js.css`, and `assets/bpmn-js.css`; the 2026-11-19 checkout is stale/partial (`bpmn-js` and `bpmnlint` are missing from `node_modules` although `package-lock.json` declares them), so if the check fails run `npm ci` and re-verify; record the outcome under `bin/logs/`. (Below-100 task number per the `190.090` precedent, so the install verification precedes the build - see Decisions Made.)
- [ ] Task 100.100: Author `web/server.mjs` (127.0.0.1:8123; `GET /` -> the page; `GET /bpmn-js/<file>` -> the installed `bpmn-js` dist via `createRequire` resolution; `GET /bridge.js` -> the feat-local `web/bridge.js`; other routes 404; no stdout) and `web/index.html` (the full Modeler on `#canvas`; the `__bpmn` bridge loaded via `<script src="/bridge.js">`; the control strip: name input, Load/Save buttons; the `commandStack.changed` event log in a `<pre>`; the watermark unmodified).
- [ ] Task 100.110: `bin/100-110-00-verify-page.sh` - start the server, curl `/` and the three pinned assets, sha256-compare the served bytes against the installed dist, assert the watermark markers (`bjs-powered-by`, `Powered by bpmn.io`) in the served Modeler bundle's bytes, stop the server; raw output under `bin/logs/`. (ACC-001)

#### Phase 110: File API and seed

- [ ] Task 110.100: Add `GET /files`, `GET /file?name=`, and `POST /file` to `web/server.mjs` (confined to `files/`; traversal names -> 400).
- [ ] Task 110.110: `bin/110-110-00-verify-file-api.sh` - seed `files/order-process.bpmn` from `apps/mcp-server/test/fixtures/order-process.bpmn` (read-only source, copied), prove the POST -> GET round trip is byte-identical, the listing, and the traversal leg; raw output under `bin/logs/`. (ACC-002)

#### Phase 120: `__bpmn` bridge

- [ ] Task 120.100: Author `web/bridge.js` (the REQ-003 API including `selfTest()`; structured results; no uncaught throws to the page).
- [ ] Task 120.110: `bin/120-110-00-verify-bridge-marker.sh` - start the server, assert via curl that `GET /bridge.js` returns 200 with the `selfTest` marker in its bytes and that the served page references `/bridge.js`, stop the server. (The browser execution of `selfTest` happens in 130.120 - no browser exists yet.)

#### Phase 130: Playwright MCP wiring and smoke

- [ ] Task 130.100: Cite and confirm at execution time the existing Decisions Made entry "Environment preconditions (user statements, trusted, not verified)" (2026-11-18: the `playwright` MCP entry is already enabled in the user's global config; the Chromium download is pre-approved); do not re-record it, do not verify or modify the user's config.
- [ ] Task 130.110: First Playwright MCP launch (`browser_navigate` to `about:blank`) - the browser downloads if missing (approved); record the browser version under `bin/logs/`.
- [ ] Task 130.120: Smoke against the real page: start the server (`bin/130-120-00-start-server.sh`), `browser_navigate` to 127.0.0.1:8123, `browser_snapshot` (canvas plus control strip), `browser_evaluate` of `__bpmn.selfTest()` -> ok, one palette click plus one canvas drag; record the smoke result. (ACC-003, ACC-004)

#### Phase 140: R3 - state readability

- [ ] Task 140.100: Capture `browser_snapshot` of: the empty canvas, the fixture-loaded canvas (via Load), the shown palette, and the inline label edit (double-click rename - not a dialog); store the snapshot text under `bin/logs/`.
- [ ] Task 140.110: Document what the agent can read without the bridge (shape labels? BPMN ids? palette entries? coordinates?).
- [ ] Task 140.120: The R3 verdict in `results.md` plus the implication (can the pixel strategy stand alone, or does it need the bridge as its eyes - qualifies how R1/R2 are read).

#### Phase 150: R1 - first-try success per primitive

- [ ] Task 150.100: Pixel-first pass over {add-shape, connect, rename, load, save}; the bridge as the documented fallback after a failure; record first-try ok/fail, fallback use, and notes.
- [ ] Task 150.110: The same five primitives via `__bpmn` only (`browser_evaluate`); record first-try ok/fail and notes.
- [ ] Task 150.120: The R1 table in `results.md` (primitive x strategy).

#### Phase 160: R2 - flakiness, pixel strategy

- [ ] Task 160.100: Confirm before the first run that the Design Notes' Task A target model is fully pinned (element ids `start`, `task`, `gw`, `task1`, `task2`, `end`; sequence-flow ids `f1`-`f6` per the Design Notes; no condition expressions) - this is the R2 baseline; correct any residual drift between the two occurrences.
- [ ] Task 160.110: Runs 1-3: fresh page reload per run; the full pixel-first draw of Task A; after each run save via the bridge as `r2-run-N.bpmn` (the allowed measurement channel per the Strategy A note - not a fallback) and screenshot under `bin/logs/`.
- [ ] Task 160.120: The R2 summary in `results.md` (per run: call count, retries after failure, deviation of the final `getState()` from the target, wall time, state-capture channel recorded as bridge save).

#### Phase 170: R4 - head-to-head, bridge strategy

- [ ] Task 170.100: Runs 1-3: fresh page reload; the full draw of Task A via `__bpmn` only; save `r4-run-N.bpmn` plus screenshots under `bin/logs/`.
- [ ] Task 170.110: The R4 comparison in `results.md` - pixel (Phase 160) versus bridge (Phase 170): calls, failures, wall time, deviation rate.

#### Phase 180: R5 - save fidelity

- [ ] Task 180.100: Task B pixel-first: Load `order-process.bpmn`, double-click rename one element, Save as `r5-pixel.bpmn`.
- [ ] Task 180.110: Task B bridge: `__bpmn.load` plus `setProp` plus save as `r5-bridge.bpmn`.
- [ ] Task 180.120: `bin/180-120-00-xml-diff.sh` - generate the expected serialization first (the script's documented producer step: load `files/order-process.bpmn` with `bpmn-moddle` from the root `node_modules`, applying the same save options the MCP server uses (`format: true`, per `apps/mcp-server/src/prc/moddle.ts`), apply the identical single rename that both Task B runs perform, serialize to `bin/logs/expected-renamed.bpmn`), then diff both outputs against it (DI present? rename only? re-save stability?); the R5 verdict in `results.md`.

#### Phase 190: R6 - human-in-the-loop

- [ ] Task 190.090: When this phase starts, hand the user the exact command to connect to the page on sys0's local display (open `http://127.0.0.1:8123/` in the local browser; confirm the server is running) - if it does not work, troubleshoot with the user before proceeding.
- [ ] Task 190.100: `bin/190-100-00-prepare-human-edit.sh` - place a stable canvas name (`human-edit-start.bpmn`) in `files/` from the Phase 170 final run, ensure the server is running, and record the URL for the user.
- [ ] Task 190.110: User leg (local display): open the page, inspect the agent-drawn canvas, make a manual edit (e.g. rename a task, move an element), and Save as `human-edited.bpmn` via the page.
- [ ] Task 190.120: Agent pickup: read `human-edited.bpmn` via the file API and `__bpmn.load`; confirm the user's edit in the raw XML and `getState()`; the R6 verdict plus the user's subjective notes (how "normal" did drawing feel) in `results.md`. (ACC-006)

#### Phase 200: Verdict and close

- [ ] Task 200.100: `bin/200-100-00-collect-results.sh` - finalize the six `results.md` sections from the `bin/logs/` raw data; enforce the no-unexplained-`n/a` rule. (ACC-005)
- [ ] Task 200.110: Author `VERDICT.md` (the verdict word, the R1-R6 evidence table, the materialized predicted cons versus the held predicted pros, the project-direction recommendation feeding the Stage 2 decision per DEC fdc84432). (ACC-007)
- [ ] Task 200.120: Close - add the nested `.gitignore` (`bin/logs/`), `prettier --write` on the feat folder, the root gate chain green (`lint`, `format:check`, `build`, `test`), stop the server, and update the README's Progress (Current Status plus an Updates entry plus Decisions Made for any deviation). (ACC-008)

## Progress

### Current Status

**As of 2026-11-18**: Planning. Anchored in GitHub issue #29; the phase structure (100-200, one phase per rubric item for R1-R6) is fixed; implementation has not started.

### Updates

<!-- Newest entry first -- prepend new entries directly below this comment. -->

#### 2026-11-19T08:37:46.000Z - Plan refined (feat-refiner pass, 16 findings)

A plan-refinement pass fixed 16 findings without renumbering any existing task: **E1** the Task A target model has six sequence flows, not five (topology kept, count corrected, flow ids `f1`-`f6` pinned); **G1** `web/bridge.js` now has a route (`GET /bridge.js`) and a `<script>` tag (REQ-001, Task 100.100, Task 120.110); **G2** new Task 100.090 verifies/restores the workspace install before any asset pinning (the 2026-11-19 checkout is missing `bpmn-js` in `node_modules`); **G3** Task 180.120 now specifies the R5 expected-serialization producer (feat-local `bpmn-moddle` with the server's `format: true` options, the same rename); **G4** the Execution note requires every evaluation phase (140-180) to begin by confirming the server is running; **D1** the bridge `getState()` now mirrors the MCP `parse` tool exactly (elements by (type, id), flows by id, `conditionExpression` when non-empty); **D2** the ACC-001 watermark assertion moved from the page HTML to the served bundle bytes (the feat-20 pin); **D3** the ACC-008 naming regex now excludes `bin/logs/`; **D4** the Phase 160 bridge save is declared the allowed measurement channel, recorded in the R2 rows; **I1-I7** applied (130.100 cites rather than re-records; inline label edit wording; the nested `.gitignore` purpose stated; the Modeler markers named in ACC-001; Related PRs/Commits left empty pending a real PR/commit; a 'feat-20' disambiguation note added).

#### 2026-11-18T14:12:00.000Z - Created

Initial feature plan per GitHub issue #29: the throwaway
Playwright-MCP-plus-bpmn-js-Modeler evidence run, with the six-rubric
evaluation protocol (R1-R6), the two-strategy design (pixels versus
in-page bridge), and the confinement to this feat folder.

### Decisions Made

<!-- Newest entry first -- prepend new entries directly below this comment. -->

#### 2026-11-19T08:37:46.000Z - Refinement decisions

From the 2026-11-19 plan-refinement pass: (1) **E1** - Task A's topology is kept; the flow count is corrected to six and the flow ids `f1`-`f6` are pinned, since the R2 deviation check compares against them. (2) **G2** - `Task 100.090` is a below-100 task number per the `Task 190.090` precedent, so the install verification precedes the build. (3) **D4** - the Phase 160 post-draw bridge save is the allowed measurement channel (state capture), exempt from Strategy A's fallback rule, recorded in the R2 rows. (4) **I4** - the nested `.gitignore` for `bin/logs/` is kept with its purpose stated (robustness for an extracted or copied feat folder) although the root `.gitignore` already covers it in-repo. (5) The DEC the verdict feeds (`fdc84432`) is still draft - consistent with the plan's framing ("the verdict feeds that decision"), now stated explicitly.

#### 2026-11-18T14:12:00.000Z - Environment preconditions (user statements, trusted, not verified)

The `playwright` MCP entry in the user's global opencode config is
already enabled and stays enabled in every session (user flipped it,
2026-11-18); Playwright MCP is headless-only on this system; the
Chromium download is pre-approved. This feat neither verifies nor
modifies the user's config. Port 8123 is fixed (127.0.0.1:8080 is
permanently owned on this system by an external root-owned service -
the feat-20 note).

#### 2026-11-18T14:12:00.000Z - Phase structure

One phase per rubric item R1..R6 (user instruction 2026-11-18); the
build side decomposed into four small phases (100-130). Phases start
at 100, step 10, per the feat-numbering skill; `Task 190.090` is the
user-directed exception below 100 (prepended 2026-11-18: at phase
start, hand the user the exact local-display connecting command and
troubleshoot if it fails - sys0 has a local display).

#### 2026-11-18T14:12:00.000Z - Storage and naming

Everything under this feat folder; auxiliary scripts under `bin/`
per the `PPP-TTT-NN-slug.ext` convention (user instruction
2026-11-18; family precedent biz.dfch.LlmOps feat-20: PPP = phase,
TTT = task within phase, NN = script within task starting at 00,
raw logs under `bin/logs/`).

### Related PRs / Commits

<!-- Empty until a PR or commit exists; the GitHub issue #29 anchor is carried by Current Status and Updates. -->
