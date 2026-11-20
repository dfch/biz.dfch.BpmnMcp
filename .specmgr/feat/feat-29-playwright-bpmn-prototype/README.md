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

- [ ] ACC-001: REQ-001: `bin/100-110-00-verify-page.sh` proves `GET /` returns 200 with the Modeler markers (the `#canvas` container, the Modeler bundle `<script>` tag, the `BpmnJS` reference (the bundle's UMD global), the `/bridge.js` script tag) and the three pinned dist assets (`bpmn-modeler.production.min.js`, `assets/diagram-js.css`, `assets/bpmn-js.css`) return 200 with sha256-identical bytes to the installed `bpmn-js` dist files, and the served Modeler bundle's bytes contain the unmodified watermark markers (`bjs-powered-by`, `Powered by bpmn.io` - the feat-20 pin).
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

- [x] Task 100.090: Verify the workspace install holds the declared dependency - `node_modules/bpmn-js` exists at the root with the exact dist assets `bpmn-modeler.production.min.js`, `assets/diagram-js.css`, and `assets/bpmn-js.css`; the 2026-11-19 checkout is stale/partial (`bpmn-js` and `bpmnlint` are missing from `node_modules` although `package-lock.json` declares them), so if the check fails run `npm ci` and re-verify; record the outcome under `bin/logs/`. (Below-100 task number per the `190.090` precedent, so the install verification precedes the build - see Decisions Made.)
- [x] Task 100.100: Author `web/server.mjs` (127.0.0.1:8123; `GET /` -> the page; `GET /bpmn-js/<file>` -> the installed `bpmn-js` dist via `createRequire` resolution; `GET /bridge.js` -> the feat-local `web/bridge.js`; other routes 404; no stdout) and `web/index.html` (the full Modeler on `#canvas`; the `__bpmn` bridge loaded via `<script src="/bridge.js">`; the control strip: name input, Load/Save buttons; the `commandStack.changed` event log in a `<pre>`; the watermark unmodified).
- [x] Task 100.110: `bin/100-110-00-verify-page.sh` - start the server, curl `/` and the three pinned assets, sha256-compare the served bytes against the installed dist, assert the watermark markers (`bjs-powered-by`, `Powered by bpmn.io`) in the served Modeler bundle's bytes, stop the server; raw output under `bin/logs/`. (ACC-001)

#### Phase 110: File API and seed

- [x] Task 110.100: Add `GET /files`, `GET /file?name=`, and `POST /file` to `web/server.mjs` (confined to `files/`; traversal names -> 400).
- [x] Task 110.110: `bin/110-110-00-verify-file-api.sh` - seed `files/order-process.bpmn` from `apps/mcp-server/test/fixtures/order-process.bpmn` (read-only source, copied), prove the POST -> GET round trip is byte-identical, the listing, and the traversal leg; raw output under `bin/logs/`. (ACC-002)

#### Phase 120: `__bpmn` bridge

- [x] Task 120.100: Author `web/bridge.js` (the REQ-003 API including `selfTest()`; structured results; no uncaught throws to the page).
- [x] Task 120.110: `bin/120-110-00-verify-bridge-marker.sh` - start the server, assert via curl that `GET /bridge.js` returns 200 with the `selfTest` marker in its bytes and that the served page references `/bridge.js`, stop the server. (The browser execution of `selfTest` happens in 130.120 - no browser exists yet.)

#### Phase 130: Playwright MCP wiring and smoke

- [x] Task 130.100: Cite and confirm at execution time the existing Decisions Made entry "Environment preconditions (user statements, trusted, not verified)" (2026-11-18: the `playwright` MCP entry is already enabled in the user's global config; the Chromium download is pre-approved); do not re-record it, do not verify or modify the user's config.
- [x] Task 130.110: First Playwright MCP launch (`browser_navigate` to `about:blank`) - the browser downloads if missing (approved); record the browser version under `bin/logs/`.
- [x] Task 130.120: Smoke against the real page: start the server (`bin/130-120-00-start-server.sh`), `browser_navigate` to 127.0.0.1:8123, `browser_snapshot` (canvas plus control strip), `browser_evaluate` of `__bpmn.selfTest()` -> ok, one palette click plus one canvas drag; record the smoke result. (ACC-003, ACC-004)

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

**As of 2026-11-19**: Phase 130 (Playwright MCP wiring and smoke) complete - the first phase that drives a real headless browser. A real Chromium 157.0.0.0 (headless, `HeadlessChrome/157.0.0.0`) answers the `playwright_browser_*` tools in-session (version recorded under `bin/logs/130-110-browser-version.log`); the user's global opencode config was cited, not read or modified (Task 130.100). The smoke against the real page passed ACC-003 and ACC-004 (raw record: `bin/logs/130-120-smoke.md`): `browser_navigate` to 127.0.0.1:8123 loaded with 200 and a clean console (the only error, a `favicon.ico` 404, is the page declaring no favicon plus the Phase 100 unknown-routes-404 decision - re-checks on later loads show 0 errors); the `browser_snapshot` holds the control strip (name input, Load/Save), the palette inside the `#canvas` node (14 entries), and the unmodified watermark; `browser_evaluate` of `__bpmn.selfTest()` returned `{ ok: true, elements: 3, flows: 1, saved: "selftest.bpmn", restored: true }` (reproducible on a fresh load) and `__bpmn.getState()` succeeded both after the restore (0 elements / 0 flows) and after the pixel draw (the drawn task). One palette click plus one canvas drag completed without protocol errors - with an important finding for R1/R2 (below), the pixel path that works in this headless setup is palette click -> canvas click (places the task at the cursor) -> Escape (closes the auto-opened, pointer-intercepting label editor) -> a mouse drag of the created element on the canvas (moved the task exactly +150/+80, twice, reproducibly). The native palette-entry drag (HTML5 DnD) does not complete via `dragTo` here (`dragstart` fires, no `dragover`/`drop`) - all three instrumented attempts are recorded in the smoke file. The prototype server is left RUNNING for the evaluation phases (`bin/logs/server.pid`), started by the new idempotent, detached `bin/130-120-00-start-server.sh`; the browser tab is left at the prototype page (final state: one pixel-drawn task, selected, context pad shown). The phase-end gate is green: the three verify scripts (ACC-001, ACC-002, bridge marker) pass, and `npm run lint`, `npm run format:check`, `npm run build`, `npm test` all pass. Phases 100-120 remain as built (the `__bpmn` bridge over the page's Modeler, `getState()` mirroring the MCP `parse` tool exactly, the file API confined to `files/`, the page's `BpmnJS`/`saveXML()` fixes of the 2026-11-19 follow-up). Next: Phase 140 (R3 - state readability).

### Updates

<!-- Newest entry first -- prepend new entries directly below this comment. -->

#### 2026-11-20T00:56:14.000Z - Phase 130 complete (Playwright MCP wiring and smoke)

The real-browser phase. **Task 130.100:** cites the Decisions Made entry "Environment preconditions (user statements, trusted, not verified)" (2026-11-18: the `playwright` MCP entry is already enabled, headless-only, the Chromium download pre-approved) and confirms it at execution time - the browser tools work in this session (no retry needed; the user's config was neither read nor modified). **Task 130.110:** first launch at 2026-11-19T23:44:28Z (`browser_navigate` to `about:blank`, one attempt); browser recorded as **HeadlessChrome 157.0.0.0** (`Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) HeadlessChrome/157.0.0.0 Safari/537.36`, platform Linux x86_64, webdriver false) in `bin/logs/130-110-browser-version.log`. **Task 130.120:** the smoke (full raw record with timestamps and the instrumented event traces: `bin/logs/130-120-smoke.md`): (1) the new `bin/130-120-00-start-server.sh` (idempotent - an answering port 8123 prints "already running" and exits 0, refreshing a stale pidfile; otherwise starts the server detached via `setsid nohup`, cwd = repo root, stdout+stderr to `bin/logs/server.out`, PID to `bin/logs/server.pid`, readiness polled 10 x 0.5 s, non-zero on failure) left the server RUNNING; (2) `browser_navigate` to http://127.0.0.1:8123/ -> 200, title "BPMN Modeler (feat-29 prototype)", no navigation error - the only console error on the first load is a `favicon.ico` 404 (the page declares no favicon; unknown routes 404 per Phase 100), later loads 0 errors; (3) `browser_snapshot` holds the control strip (name input "diagram.bpmn", Load, Save) plus the `#canvas` node with the 14-entry palette and the unmodified "Powered by bpmn.io" watermark (pixel-checked: canvas rect (0,45,1280x538), watermark `.bjs-powered-by` visible at (1212,547)); (4) `__bpmn.selfTest()` -> `{ ok: true, elements: 3, flows: 1, saved: "selftest.bpmn", restored: true }` (ACC-003; reproducible on a fresh page load; the saved file verified on disk via the file API: start -> flow -> renamed task at the fixed DI positions); (5) `__bpmn.getState()` -> `{ ok: true, elements: [], flows: [], zoom: 1, scroll: {x:0, y:0} }` after the restore, and after the pixel draw `{ ok: true, elements: [{ id: "Activity_0cttj6q", type: "bpmn:Task" }], flows: [] }`; (6) one palette click plus one canvas drag without protocol errors (ACC-004) - the native palette-entry drag (HTML5 DnD: entries are `draggable="true"`, the create action is wired to `dragstart`) did NOT complete in three instrumented attempts (mousedown -> native dragstart -> no dragover/drop -> mouseup + synthetic click; consistent across the "Create task" and "Create start event" entries and with/without a prior activation click), so the recorded pixel path is: palette click "Create task" (arms the create session), pixel click on the canvas at (400,300) (creates the task centered on the cursor), Escape (the label editor opens and focuses automatically after creation and its overlay intercepts the pointer), then a mouse drag of the task (+150/+80, moved exactly, twice reproducibly - new `commandStack.changed` lines in the `<pre>`, visible in the follow-up snapshot, and the task present in `getState()`). Findings for R1/R2 are itemized in the smoke file (empty canvas without a loaded diagram rejects creation at the rules level; the auto-focus label editor; `getState()` element list includes sequence-flow entries per the MCP parse mirror). Gate: the three verify scripts were run with the smoke server STOPPED (they require port 8123 free and start their own instances) - all pass - then the server was restarted via the start-server script and left running; `npm run lint`, `npm run format:check`, `npm run build`, `npm test` all pass (the Playwright MCP's transient `.playwright-mcp/` snapshot artifacts at the repo root were removed to keep `format:check` green - see Decisions Made).

#### 2026-11-19T23:03:34.000Z - Phase 100 page-global bugs fixed (authorized follow-up to Phase 120)

Fixed the two pre-existing `web/index.html` bugs the Phase 120 de-risking harness found (user-authorized scope, 2026-11-19): (1) the inline IIFE constructed `new BpmnModeler({ container: canvas })`, but the installed `bpmn-js` 18.31.1 dist bundle defines the UMD global `BpmnJS` (0 occurrences of `BpmnModeler` in `bpmn-modeler.production.min.js`) - a `ReferenceError` that prevented `window.__modeler` from ever being assigned; it now constructs `new BpmnJS({ container: canvas })` (matching feat-20's working preview page). (2) the Save handler called `modeler.saveXml()`, but the Modeler API is `modeler.saveXML()` (uppercase); it now calls `saveXML()`. Consequence correction: the ACC-001 marker check in `bin/100-110-00-verify-page.sh` (and this plan's ACC-001 bullet) now greps `BpmnJS` instead of the unrealizable `BpmnModeler` reference; the other three markers are unchanged, and the acceptance intent (the page instantiates the full Modeler) is preserved. Verification: a jsdom page-load proof (real server, real fixed page, real bundle, real bridge) shows the page scripts now execute without errors (the pre-fix page fails the same proof with `Uncaught [ReferenceError: BpmnModeler is not defined]`), `window.__modeler` is a live Modeler, the bridge reports ready (`getState` no longer the not-ready error), and `load('order-process.bpmn')` + `getState()` through the real page report 5 elements / 2 flows; all three verify scripts (100/110/120) and the root gate chain (`lint`, `format:check`, `build`, `test`) pass.

#### 2026-11-19T22:35:00.000Z - Phase 120 complete (`__bpmn` bridge)

Built and verified the bridge. **Task 120.100:** `web/bridge.js` implements the full REQ-003 API over the page's Modeler (`getState`, `addShape`, `connect`, `setProp`, `move`, `load`, `save`, `selfTest`), as a classic script (no modules, no build step) that resolves `window.__modeler` lazily at call time (the page loads it before its inline IIFE creates the Modeler; a call before the Modeler exists resolves `{ error: 'the modeler is not ready yet' }`). Every member is async and returns `{ ok: true, ... }` or `{ error: <string> }`, never a throw to the page (each member catches internally, including async rejections - a rejected promise escaping `browser_evaluate` is a throw). `getState()` mirrors the MCP `parse` tool exactly (approach (b): `saveXML()` -> re-parse with the Modeler's own moddle -> a faithful port of the server's `collectAddressableInventory` walk with the same function names and semantics); `addShape`/`move` honor (x, y) as the DI bounds' top-left corner with the server's standard sizes (no grid snap - verified the Modeler's grid snapping only hooks `shape.resize` and the space tool); `addShape` on an empty canvas seeds the minimal empty-process diagram (the server's `createProcess` baseline, chosen over `modeler.createDiagram()` whose shipped initial diagram carries a stray `StartEvent_1`); `setProp` rejects a property the element's type does not declare via the same moddle descriptor lookup its setter uses. The bridge was verified end-to-end outside the feat folder (a throwaway Node + jsdom harness driving the real production dist bundle, the real Modeler, and the real prototype server): script load, the lazy `__modeler` not-ready legs, every member's success and error legs (unknown type, missing ids, `isInterrupting` on a task, 404/400 file-API legs), `getState()` byte-identical to the MCP server `parse` of the same XML, and `selfTest()` from a truly empty canvas and from a pre-loaded canvas (pre-state restored byte-identically; an empty pre-state restores as the clean, drawable seed - `modeler.clear()` alone leaves the stale `_definitions` object behind, which the harness caught). **Task 120.110:** `bin/120-110-00-verify-bridge-marker.sh` passes: `GET /bridge.js` 200 with the `selfTest` marker in the bytes, `GET /` 200 with the `src="/bridge.js"` tag, `node --check` clean, no server stdout. ACC-001 (`bin/100-110-00-verify-page.sh`) and ACC-002 (`bin/110-110-00-verify-file-api.sh`) re-run and still pass; the root gate chain (`lint`, `format:check`, `build`, `test`) is green. **Blocker found for Phase 130 (pre-existing, Phase 100, in `web/index.html` - which this phase must not modify):** (1) the inline IIFE calls `new BpmnModeler(...)`, but the installed `bpmn-js` 18.31.1 dist bundle defines the global `BpmnJS` (the Modeler class) - `BpmnModeler` is not a global, so the IIFE throws a `ReferenceError` before assigning `window.__modeler`, and every bridge member would resolve the not-ready error in a real browser; (2) the Save handler calls `modeler.saveXml()`, but the Modeler API is `saveXML()` (uppercase) - the page's Save button throws a caught `TypeError`. Both were verified against the installed bundle (evaluated in jsdom: only `window.BpmnJS` is defined). The one-line fixes are `BpmnModeler` -> `BpmnJS` (the IIFE) and `saveXml()` -> `saveXML()` (the Save handler); the Phase 130 smoke (130.120) will fail until they land.

#### 2026-11-19T17:30:43.000Z - Phase 110 complete (File API and seed)

Built and verified the file API. **Task 110.100:** `web/server.mjs` gained the REQ-002 file API confined to the feat-local `files/` scratch directory (resolved from `import.meta.url`, like every other feat-local path; the server ensures it at start, and the POST leg re-ensures it on demand): `GET /files` (a sorted JSON array of the directory's regular-file names, `[]` when empty), `GET /file?name=` (the raw bytes over the shared `serveFile` leg; a validated name that does not exist is 404), and `POST /file?name=` (the only write endpoint: writes the raw request body and answers `{ ok, name, bytes }`). The `name` goes through one shared validation leg on both `/file` routes: a missing parameter, invalid percent-encoding (the asset leg's `decodeSegment` idiom on the raw query value), a leading `/`, any path separator, or a `.`/`..` name is 400 (the flat-name rules are the primary leg), with the canonical `resolve` + `startsWith(FEAT_FILES_DIR + sep)` guard kept as defense in depth; errors keep the server's existing JSON shape. Method discipline keeps the Phase 100 404 stance (`POST` is known on `/file` only; a wrong method or route is 404, no 405 machinery). **Task 110.110:** `bin/110-110-00-verify-file-api.sh` (ACC-002) passes: it seeds `files/order-process.bpmn` from the read-only fixture (sha256 `5439db74...`, the fixture verified unmodified before/after the run), proves the POST -> GET round trip of `roundtrip-test.bpmn` is sha256-identical (`5439db74...`, the fixture XML as the controlled body), proves `GET /files` returns 200 with the listing `["order-process.bpmn","roundtrip-test.bpmn"]`, and rejects all four traversal legs with 400 (`../evil.bpmn` on POST and on GET, the `%2e%2e%2fevil.bpmn` encoded variant on POST, the absolute path `/etc/passwd` on POST) with nothing written outside `files/`; plus the 400 for a missing `name`, the 404 for a nonexistent file, the 404s for wrong methods (`POST /files`, `PUT /file`), and the empty-stdout check (REQ-001); the script removes its `roundtrip-test.bpmn` artifact at the end, keeping the seeded fixture committed-ready. Raw output in `bin/logs/110-110-verify-file-api.log`. Phase 100's proof re-run: `bin/100-110-00-verify-page.sh` still passes (ACC-001). Root gate chain green with the feat folder present: `npm run lint`, `npm run format:check`, `npm run build`, `npm test` (19 files, 361 passed / 2 pre-existing skipped).

#### 2026-11-19T15:51:00.000Z - Phase 100 complete (Server and Modeler page)

Built and verified the prototype server and Modeler page. **Task 100.090:** the initial check failed as predicted (the 2026-11-19 checkout had no `node_modules` at all); `npm ci` at the repo root restored the install (351 packages, bpmn-js 18.31.1) and the re-check found all three pinned dist assets - outcome in `bin/logs/100-090-install-verify.log`. **Task 100.100:** `web/server.mjs` (zero-dependency `node:http`, 127.0.0.1:8123 fixed, `GET /` -> `web/index.html`, `GET /bpmn-js/<file>` -> the installed dist via `createRequire` with the preview-server path-safety (invalid encoding/dot segments 400, canonical escape guard 404), `GET /bridge.js` -> the feat-local bridge when present (404 until Phase 120), other routes 404, nothing on stdout; all feat-local paths resolved from `import.meta.url`) and `web/index.html` (full `BpmnModeler` on `#canvas`, the three pinned assets over the `/bpmn-js/` prefix, `<script src="/bridge.js">`, the control strip with name input plus Load/Save over the future file API, a `commandStack.changed` event log in a `<pre>`, the Modeler instance exposed as `window.__modeler` for the Phase 120 bridge, watermark unmodified). **Task 100.110:** `bin/100-110-00-verify-page.sh` (ACC-001) passes: `GET /` 200 with the `#canvas`/bundle-script/`BpmnModeler`/`/bridge.js` markers, all three pinned assets 200 with sha256-identical served bytes (`bpmn-modeler.production.min.js` `052e46d0...`, `assets/diagram-js.css` `73f990dc...`, `assets/bpmn-js.css` `a1add5dc...`), the served Modeler bundle holds `bjs-powered-by` and `Powered by bpmn.io`, the server wrote nothing to stdout; raw output in `bin/logs/100-110-verify-page.log`. Root gate chain green with the feat folder present: `npm run lint`, `npm run format:check`, `npm run build`, `npm test` (19 files, 361 passed / 2 pre-existing skipped).

#### 2026-11-19T08:37:46.000Z - Plan refined (feat-refiner pass, 16 findings)

A plan-refinement pass fixed 16 findings without renumbering any existing task: **E1** the Task A target model has six sequence flows, not five (topology kept, count corrected, flow ids `f1`-`f6` pinned); **G1** `web/bridge.js` now has a route (`GET /bridge.js`) and a `<script>` tag (REQ-001, Task 100.100, Task 120.110); **G2** new Task 100.090 verifies/restores the workspace install before any asset pinning (the 2026-11-19 checkout is missing `bpmn-js` in `node_modules`); **G3** Task 180.120 now specifies the R5 expected-serialization producer (feat-local `bpmn-moddle` with the server's `format: true` options, the same rename); **G4** the Execution note requires every evaluation phase (140-180) to begin by confirming the server is running; **D1** the bridge `getState()` now mirrors the MCP `parse` tool exactly (elements by (type, id), flows by id, `conditionExpression` when non-empty); **D2** the ACC-001 watermark assertion moved from the page HTML to the served bundle bytes (the feat-20 pin); **D3** the ACC-008 naming regex now excludes `bin/logs/`; **D4** the Phase 160 bridge save is declared the allowed measurement channel, recorded in the R2 rows; **I1-I7** applied (130.100 cites rather than re-records; inline label edit wording; the nested `.gitignore` purpose stated; the Modeler markers named in ACC-001; Related PRs/Commits left empty pending a real PR/commit; a 'feat-20' disambiguation note added).

#### 2026-11-18T14:12:00.000Z - Created

Initial feature plan per GitHub issue #29: the throwaway
Playwright-MCP-plus-bpmn-js-Modeler evidence run, with the six-rubric
evaluation protocol (R1-R6), the two-strategy design (pixels versus
in-page bridge), and the confinement to this feat folder.

### Decisions Made

<!-- Newest entry first -- prepend new entries directly below this comment. -->

#### 2026-11-20T00:56:14.000Z - Phase 130 execution details

Settled during Phase 130 (details the plan left open; all verified empirically, instrumented traces in `bin/logs/130-120-smoke.md`): (1) **The pixel draw path** - the palette's create drag is native HTML5 DnD (entries are `<div class="entry" draggable="true">`; `PaletteProvider` wires `dragstart` to the create action; the palette container stops `mousedown` propagation, so no mouse-based drag can start one). In this headless Chromium 157, Playwright `dragTo` emits `mousedown` -> a native `dragstart` but never a `dragover`/`drop` (the gesture ends in `mouseup` + a synthetic `click`), so palette-entry drags create no shape - three attempts recorded (the "Create task" entry twice, the "Create start event" entry once, with and without a prior activation click). The path that works and is used for the smoke (and is the candidate default for R1/R2 pixel runs): palette click (arms the create session via the entry's `click` action) -> pixel click on the canvas (the task is created centered on the cursor) -> `Escape` (creation auto-opens and focuses the inline label editor; its `.djs-direct-editing-parent` overlay is pointer-events auto over the whole element box and intercepts any drag started before it is closed) -> mouse drag of the created element (a pure mouse-event drag the diagram-js translate handles natively; moved the task exactly +150/+80, twice). (2) **Creation needs a loaded diagram** - on a truly empty canvas (fresh load, nothing imported) the root is the implicit root with no process and `rules.allowed('shape.create', ...)` is `false`, so pixel creation is rejected at the rules level (bus trace: `create.end ... canExecute=false`); with the minimal empty-process diagram staged (selfTest's restore, or any Load) the root is `Process_1` and the rule is `true` - the smoke order (selfTest before the pixel ops) provides the staging. (3) **Server lifecycle for the gates** - the smoke server runs detached with its PID in `bin/logs/server.pid` and its output in `bin/logs/server.out`; the verify scripts require port 8123 free and start/stop their own instances, so the gate sequence is: stop the smoke server (kill the pidfile PID), run the three verify scripts, restart via `bin/130-120-00-start-server.sh` and leave it running for the evaluation phases (the script's idempotent "already running" leg also refreshes a stale pidfile). (4) **Playwright MCP artifacts** - the MCP tool writes transient snapshot/console files to `.playwright-mcp/` at the repo root (outside the feat folder, unformatted, not ignored): they were removed after the smoke to keep `npm run format:check` green; whether to root-ignore or root-prettier-ignore that directory is a root-config decision deferred to Phase 200 (confinement: no root config changes in the build phases). (5) **No page/bridge changes** - unlike the Phase 120 follow-up, the smoke forced no correction in `web/`: every observed failure was either a headless-DnD emulation limitation (finding 1), a missing staged diagram (finding 2), or the intended auto-focus label editor (finding 1/3 of the path).

#### 2026-11-19T23:03:34.000Z - Phase 100 page-global fix (authorized follow-up)

The Phase 100 page referenced a `BpmnModeler` global that does not exist in the installed bundle (verified against `node_modules/bpmn-js/dist/bpmn-modeler.production.min.js`: 0 occurrences of `BpmnModeler`, 1 of `BpmnJS` - the UMD global that carries the Modeler class; feat-20's working page, `apps/mcp-server/src/preview/preview-page.ts` line 84, uses `new BpmnJS({ container: canvas })`) and called `modeler.saveXml()` where the Modeler API is `modeler.saveXML()` (the bundle holds `saveXML`, no `saveXml`). The inline IIFE therefore threw a `ReferenceError` before it ever assigned `window.__modeler`, which would have made every bridge member resolve the not-ready error and failed the 130.120 smoke. Fixed (user-authorized follow-up to Phase 120, 2026-11-19): `web/index.html` now constructs `new BpmnJS({ container: canvas })` and the Save handler calls `modeler.saveXML()`. The ACC-001 marker in `bin/100-110-00-verify-page.sh` (and this plan's ACC-001 bullet) was corrected from `BpmnModeler` to `BpmnJS` because the old marker is unrealizable - the acceptance intent (the page instantiates the full Modeler) is unchanged. Found by the Phase 120 de-risking harness (the real bundle evaluated in jsdom); fixed and re-verified before the 130.120 smoke (the fixed page's scripts execute without errors, `window.__modeler` is a live Modeler, and the bridge reports ready).

#### 2026-11-19T22:35:00.000Z - Phase 120 implementation details

Settled during Phase 120 (all details the plan left open): (1) **`getState()` approach** - (b): `saveXML()` -> re-parse with the Modeler's own moddle (`modeler.get('moddle')`) -> the server's `collectAddressableInventory` walk ported verbatim (same function names/semantics: the metamodel-driven visited-set walk, the flow-model predicate `$instanceOf('bpmn:FlowElement') || $type === 'bpmn:MessageFlow'`, `referenceId`/`conditionText`, `compareElementRefs`/`compareFlowRefs`). Verified byte-identical to the server's real implementation over nine edge-case documents (subprocess depth, collaboration + message flow, condition expressions, dangling references, DI-less flow elements, artifacts, no-id elements), and in the harness byte-identical to the MCP `parse` of the Modeler's own `saveXML()`. An empty canvas (no loaded definitions) is a structured `getState` error - there is no document to parse. (2) **`selfTest` details** - fixed positions: start event at (150,150) named `selftest-start`, task at (280,120) named `selftest-task` (top-left corners, the server size semantics: 36x36 / 100x80); the task is renamed to `selftest-task-renamed`; the fixed scratch name is `selftest.bpmn` (left in `files/` as ACC-003 evidence - the file API has no delete endpoint). Success returns `{ ok: true, elements, flows, saved, restored }` (`elements`/`flows` are the final-state counts from the asserting `getState`). **Restore mechanism:** a loaded pre-state is re-imported from its captured `saveXML()` XML; an empty pre-state is re-seeded with the minimal empty-process document - `modeler.clear()` alone is not a valid reset (it fires `diagram.clear` but never nulls `_definitions`, so the next `addShape` would fail with `parent required` while `ensureLoadedDiagram` believes a diagram is loaded). (3) **`connect` is sequence-flow-only** (message flows are out of scope for this prototype, per the task); both endpoints are resolved via `elementRegistry` (missing -> `{ error }`), and the created flow's `source.parent` is passed as the connection parent (the `connection.create` handler requires one). (4) **Structured-return fields per member** - `getState`: `{ ok, elements, flows, zoom, scroll: { x, y } }`; `addShape`: `{ ok, id }` (the created element's actual factory-assigned id - this bpmn-js version generates random-suffix ids like `Event_1k16hrr`, not `Event_1`); `connect`: `{ ok, id }` (the created flow's actual id); `setProp`/`move`/`load`: `{ ok }`; `save`: `{ ok, bytes }` (echoing the server's JSON confirmation); `selfTest`: `{ ok, elements, flows, saved, restored }`; every failure `{ error: <string> }` (single-line, member-prefixed for member-level errors, e.g. `addShape: unknown type <bpmn:Nope>`). (5) **Lazy `__modeler` resolution** - a `modeler()` accessor reads `window.__modeler` at call time (the classic script is evaluated before the page's inline IIFE assigns it); a call before the Modeler exists resolves `{ error: 'the modeler is not ready yet' }`. (6) **Verified API shapes against the installed bpmn-js 18.31.1 / diagram-js 15.28.1** (the task sketch's legacy forms do not hold in this version): `modeling.createShape(shapeOrAttrs, position, parent)` - parent third, not first, and the parent is `canvas.getRootElement()` (never the canvas object); `name` does not reach the businessObject through `createShape` attrs (only `processRef`/`isInterrupting`/`associationDirection`/`isForCompensation` do), so `addShape`/`connect` apply a given `name` via `modeling.updateModdleProperties` after creation; `modeling.moveElements(elements, delta)` (the diagram-js 15 name - `moveElement` does not exist); `modeler.saveXML()` (uppercase - `saveXml` does not exist); `modeler.getDefinitions()` is the public loaded-document accessor (undefined on a fresh Modeler); `importXML` replaces any loaded diagram (its `open()` leg clears the rendered canvas first); a document needs at least one `bpmn:BPMNDiagram` with a plane to import, which the seed document carries; the property-existence check for `setProp` is `businessObject.$model.properties.getProperty(bo, prop)` (the same descriptor lookup the moddle setter performs - `isInterrupting` is declared on `bpmn:StartEvent` and the catch events, not on `bpmn:Task`).

#### 2026-11-19T17:30:43.000Z - Phase 110 implementation details

Settled during Phase 110 (all details the plan left open): (1) **`GET /files` shape** - a plain sorted JSON array of regular-file name strings (not objects with sizes), `[]` for an empty directory - minimal per REQ-002. (2) **`POST /file` response** - 200 with `{ ok: true, name, bytes }` (the name echo plus the written byte count); the raw request body is written verbatim, with no content-type requirement and no size limit (loopback-only prototype). (3) **`files/` creation** - the server ensures the scratch directory at start (a top-level `mkdir` recursive before `listen`; a failure is a start failure on stderr with a non-zero exit, like a port failure), and the POST leg re-ensures it on demand. (4) **Name validation** - one shared leg for `GET /file` and `POST /file`: missing/empty `name`, invalid percent-encoding, a leading `/`, any path separator, or a `.`/`..` name -> 400; the canonical `resolve(join(FEAT_FILES_DIR, name))` + `startsWith(FEAT_FILES_DIR + sep)` guard stays as defense in depth and also 400s (REQ-002 rejects every escape with 400, unlike the asset leg's 404); the query parameter is extracted raw (no `URL`/`URLSearchParams` normalization, so a literal `+` stays `+` and an invalid escape reaches the 400 leg). (5) **Method discipline** - `GET` is known on every route and `POST` on `/file` only (the single write endpoint); a wrong method on a route keeps the Phase 100 simple 404 stance (no 405 machinery). (6) **Cleanup** - the verify script removes its `roundtrip-test.bpmn` test artifact at the end; the seeded `files/order-process.bpmn` stays in place, committed as a result.

#### 2026-11-19T15:51:00.000Z - Phase 100 implementation details

Settled during Phase 100 (all details the plan left open): (1) **Verify-script server lifecycle** - `bin/100-110-00-verify-page.sh` fails loudly on a pre-check (`ss -ltnH`) if port 8123 is already in use, then starts the server as a direct background process (`node web/server.mjs`, cwd = repo root), captures the PID, polls `curl -sf` 10x0.5s for readiness, and kills+waits the PID via an `EXIT` trap (no orphaned server, no `pkill`-style matching). (2) **Routing semantics of `web/server.mjs`** - non-`GET` methods and unknown routes both answer 404 (the plan names only `GET` routes and says "other routes 404" - no 405 machinery); every 4xx/5xx body uses the preview server's JSON shape `{ error: { code, message } }`. (3) **Asset path safety** - the raw request path is taken verbatim (no `URL` normalization, exactly like the preview server's dispatcher) so that literal `.`/`..` segments hit the 400 leg; `%2f`-joined traversal survives decoding as a single segment and is stopped by the canonical `resolve` + `startsWith(distDir + sep)` guard with 404. (4) **Bridge access to the Modeler** - the page stores its instance as `window.__modeler`, so the Phase 120 `bridge.js` can wire `window.__bpmn` as a thin pass-through without the page needing bridge-specific code. (5) **Load/Save URL shape** - both use `name` as a query parameter (`GET /file?name=`, `POST /file?name=` with the XML body), mirroring each other; Phase 110 owns the exact file-API contract.

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
