---
classification: null
created: '2026-11-07T09:00:42.381+01:00'
id: feat-20-preview-tool
status: review
type: feat
updated: '2026-11-07T09:38:07.580+01:00'
version: 1.0.0
---

# Feature: The preview MCP Tool (Stage 1 Browser Viewer)

## Plan

### Overview

Implements the `preview` tool (REQ bb63c11f-c3e2-4ed0-8f4e-5453b28260f6)
per QA 4.0010/4.0020:
after an agent creates or changes a diagram, a human opens a local
browser and sees the current state rendered visually by a read-only
bpmn-js Viewer - a turn-based preview, not a continuously live
canvas (the live, two-way-synchronized Modeler is Stage 2, deferred
per the requirement's own note). The preview server is a
zero-dependency `node:http` server inside the MCP server process,
bound to `127.0.0.1` only (QA 6.0010) on a fixed port (8080) for this
stage, and it stays alive across repeated `preview` calls. The page
fetches the requested process from the `/processes/<uuid>` endpoint
(UUID addressing per QA 1.0080) and renders it with the unmodified
"powered by bpmn.io" watermark (the accepted bpmn.io License clause).
The `preview` tool opens the user's default browser pointed at the
process view. Anchored in GitHub issue #20.

### Requirements

- REQ-001: A preview HTTP server module: binds `127.0.0.1` only, fixed port 8080 (`DEFAULT_PORT`, test-injectable); a port already in use is a structured error at start - never a silent rebind; the server never writes to stdout (the stdio protocol constraint, QA 0.0050) - it logs through pino like everything else.
- REQ-002: Endpoints: `GET /processes/<uuid>` returns the process's current XML (`application/xml`) after the store's conditional re-read; an unknown uuid returns 404; the view page endpoint serves the preview page; there are no write endpoints and no authentication (local-only, QA 6.0010).
- REQ-003: The preview page is a single static asset (QA 4.0010) running the bpmn-js Viewer in read-only mode; the Viewer bundle and CSS are served from the installed `bpmn-js` package (a new runtime dependency, located via Node's own resolver - `createRequire`) at the pinned asset paths - `bpmn-viewer.production.min.js`, `assets/diagram-js.css`, and `assets/bpmn-js.css` under the package's `dist/` (plan fix G3; user decision 2026-11-07; vendoring into the build output was rejected: `dist/` is not self-contained in this architecture anyway - every code dependency resolves from `node_modules` at runtime - and a copy step plus drift gate would buy nothing).
- REQ-004: A `preview` tool: input a process uuid; ensures the server is running (idempotent - a second call reuses the live server); opens the user's default browser at the process view URL (`xdg-open` on Linux, `open` on macOS, `start` on Windows); returns `{ url, port, opened, reason? }` with `opened` false and a `reason` when no opener is available or the launch fails - the tool call itself succeeds, since the server is reachable by hand.
- REQ-005: Lifecycle: the server starts lazily on the first `preview` call and stays alive for the process lifetime; it is closed on clean shutdown (the unref plus the explicit close that Task 100.110 builds - the entry point ships no exit handling to reuse, plan fix E1); the turn-based contract holds - each `preview` reflects the state at call time (after its re-read), nothing refreshes automatically.
- REQ-006: Tests: HTTP legs against an ephemeral test port (page 200 with the viewer markers, XML endpoint 200 with re-read behavior, unknown-uuid 404, in-use-port structured error), a browser-opener unit leg with a stubbed spawn, and proof that the running server does not pollute stdout (the existing stdio handshake test keeps passing with the server up).

### Acceptance Criteria

- [ ] ACC-001: `preview` on an imported process returns the view URL; `GET` of the page and of `/processes/<uuid>` serve the viewer page and the current XML (verified at the HTTP level in tests).
- [ ] ACC-002: A second `preview` call (any process) reuses the running server: no second bind attempt, no error, same port.
- [ ] ACC-003: The served page renders through the unmodified bpmn-js Viewer: the watermark attribution is present and unstripped (the accepted license clause).
- [ ] ACC-004: With the preview server running, the stdio protocol stays clean (the handshake test passes; no stdout writes from the HTTP module), the full gate chain is green on Node 26 (DEC 5185d651-7283-4b1d-87e0-272795d15edf), and the handshake lists `preview`.
- [ ] ACC-005: The negative legs hold: a port already in use is a structured error at start (never a silent rebind), an unknown uuid returns 404, and non-GET methods get 405 (REQ-001/REQ-002, verified at the HTTP level in tests).
- [ ] ACC-006: The clean-shutdown leg holds: the listener does not keep the process alive on its own (unref), and the explicit close releases the port (REQ-005, built by Task 100.110 - plan fix E1).
- [ ] ACC-007: The `preview` tool returns `{ url, port, opened, reason? }`; when no opener is available or the launch fails, `opened` is false with a `reason` and the tool call still succeeds (REQ-004, the stubbed-spawn unit leg of Task 110.100).

### Scope

#### Included

- The preview HTTP server module (bind, endpoints, lifecycle, stdout discipline) and its tests.
- The preview page (single static asset) and the `bpmn-js` runtime dependency with asset serving.
- The cross-platform browser opener and the `preview` tool adapter.
- The C4 description update (the tool count goes six to seven and the
  "planned" qualifier drops from the preview tool - the in-process
  localhost:8080 endpoint is already drawn as the Stage 1 target, plan
  fix D1) and this feat's Progress discipline.

#### Explicitly Out Of Scope

- The bpmn-js Modeler, the properties panel, and any human editing (QA 4.0020: view only; Stage 2 territory).
- Live or two-way synchronization (the `yctimlin/mcp_excalidraw` canvas-server precedent applies to Stage 2 per DEC fdc84432's More Information).
- A configurable port or host, non-localhost binding, and any remote access.
- Caching or watching of diagram files (the turn-based contract plus the store's re-read is the whole mechanism).

### Dependencies

#### Depends On

- FEAT feat-2-prc-import-export (the `PrcStore`, the conditional re-read, the package-root pattern)
- DEC fdc84432-1b48-4eb9-82e0-ec13cb8cf8ba: Use a Node/TypeScript MCP Server for Agent-Driven BPMN Modeling (the bpmn.io License watermark clause)
- GitHub issue #20

### Design Notes

- **View URL scheme.** QA 1.0080 fixes the data endpoint as
  `/processes/<uuid>`; the page endpoint is an implementation choice -
  the recommendation is `GET /view/<uuid>` serving the same static
  page, whose JavaScript reads the uuid from the path and fetches
  `/processes/<uuid>`.
- **Single asset.** The page is one HTML document (QA 4.0010: "the
  preview page is a single static asset"); the Viewer's JS/CSS come
  from the installed `bpmn-js` package over fixed asset paths
  (REQ-003, decided).
- **Opener.** `child_process.spawn` of the platform opener
  (`xdg-open`/`open`/`start`) with `detached` and ignored stdio; a
  spawn failure or missing binary sets `opened: false` with a
  `reason` and never fails the tool call.
- **Placement.** The server module lives under `src/` (candidate
  `src/preview/`); it reads process XML through the store (core) and
  touches no filesystem itself beyond static asset reads, keeping the
  archunit layering (adapters never import `node:fs`) intact - the
  asset-reading belongs in the server module, which is not an MCP
  adapter.

### Related Decisions

- DEC fdc84432-1b48-4eb9-82e0-ec13cb8cf8ba: Use a Node/TypeScript MCP
  Server for Agent-Driven BPMN Modeling (the watermark clause, the Stage
  2 precedent)
- DEC 5185d651-7283-4b1d-87e0-272795d15edf: Adopt Node.js 26 as the Sole
  Supported Runtime (the Node 26 gate-chain floor of ACC-004/Task
  120.100)
- QA 818fac76-96fb-4e3c-acb8-e5520fab5913 (the implementation Q&A): the
  preview contract (pairs 4.0010/4.0020), view-only scope,
  localhost-only binding (pair 6.0010)

### Task List

#### Phase 100: Preview server and page

- [x] Task 100.100: Add the `bpmn-js` runtime dependency and the preview server module: 127.0.0.1 bind on the fixed port (test-injectable), the `/processes/<uuid>` XML endpoint on the store's re-read, the view page endpoint, static asset serving, 404s, the in-use-port structured error, and stdout discipline.
- [x] Task 100.110: Author the preview page (single static asset, read-only Viewer, watermark intact) and the lifecycle (lazy start, idempotent ensure, clean shutdown).
- [x] Task 100.120: HTTP-level tests on an ephemeral port (page markers, XML + re-read, 404 legs, in-use-port error) and the stdout-cleanliness leg with the server up.

#### Phase 110: Opener and tool

- [x] Task 110.100: Add the cross-platform browser opener (stubbed-spawn unit leg included) and register the `preview` tool (zod schema, `{ url, port, opened, reason? }` result, description stating the turn-based contract).
- [x] Task 110.110: Update the handshake test; add the spawn e2e legs (ACC-001, ACC-002).

#### Phase 120: Gates and docs

- [x] Task 120.100: Run the full gate chain on Node 26 and fix any drift (license headers, archunit, prettier).
- [x] Task 120.110: Update the C4 container description (six to seven MCP tools; the "planned" qualifier drops from the preview tool - the in-process localhost:8080 endpoint is already drawn as the Stage 1 target, plan fix D1) and this feat's Progress section.
- [x] Task 120.120: Open the PR referencing issue #20. (Executed by the orchestrator's final step per the feat-18/19 convention: PR #24, base dev, opened against the four feature commits (14a30c9, 6549d31, 45597c3, 82ed81f); the frontmatter status flip to review committed separately.)

## Progress

### Current Status

**As of 2026-11-13**: Phases 100-120 are implemented and
gate-green. Phase 100 (Preview server and page): the `src/preview/`
server module (the loopback bind on the fixed, test-injectable port
8080, the `/processes/<uuid>` XML endpoint over the store's new
`readProcessXml`, the `/view/<uuid>` page endpoint, the
`/bpmn-js/<file>` asset route over the installed `bpmn-js` dist, the
structured `port-in-use` start error, and the stdout discipline via
the injected logger), the single static preview page (the read-only
Viewer, the pinned bundle/CSS, the watermark intact), the unref plus
explicit-close lifecycle (plan fix E1), and the HTTP-level plus
child-process test legs. Phase 110 (Opener and tool): the
cross-platform browser opener (`src/preview/browser-opener.ts`: the
fire-and-forget spawn of `xdg-open`/`open`/`cmd /c start "" <url>`,
the injectable spawner seam, the never-rejecting failure contract),
the `preview` tool (the `{ url, port, opened, reason? }` result, the
turn-based contract in the description, the port-in-use `isError`
mapping), the one-server-per-lifetime wiring in `index.ts` with the
clean shutdown (`server.server.onclose` plus `SIGINT`/`SIGTERM`),
and the test legs (the stubbed-spawn unit leg, the seven-tool
handshake in-memory and over stdio, the spawn e2e legs, the SIGTERM
clean-shutdown leg). In this environment the two fixed-port spawn
legs (ACC-001/ACC-002) report themselves as skipped: an external
container-level Jetty/PlantUML service (root-owned) permanently owns
127.0.0.1:8080, and the entry point binds the fixed port
unconditionally (a configurable port is explicitly out of scope);
the port-in-use spawn leg then exercises exactly that state, and the
full composition was smoke-verified end to end on a scratch copy of
the built entry point with the port swapped. Phase 120 (gates and
docs): the full seven-command gate chain is green on Node 26.13.0
(`npm ci`, `npm run lint`, `npm run format:check`, `npm run build`,
`npm test -- --coverage` - 19 test files / 354 passed, 2 skipped,
the two fixed-port legs above, `npm audit`, `uvx pre-commit run
--all-files`); `npm audit` surfaced one new transitive advisory
(`hono` / `@hono/node-server` via `@modelcontextprotocol/sdk`)
beyond the documented residual, fixed by pinning the
advisory-release versions through root `overrides` plus the
lockfile so the audit is again byte-identical to the documented
archunit -> minimatch 10.2.6 residual (listed twice). The C4
container description in both `docs/c4` variants was corrected (six
to seven MCP tools, the "planned" qualifier dropped from `preview`,
plan fix D1) and the variants' shared description stays
byte-identical (the feat-17/18/19 convention, proven by sha256
before and after the edit). Task 120.120 (open the PR referencing
GitHub issue #20) was executed as the orchestrator's final step:
the frontmatter status remains review and PR #24 (base dev, opened
against GitHub issue #20) stays open and untouched.

### Updates

<!-- Newest entry first -- prepend new entries directly below this comment. -->

#### 2026-11-13T19:14:46.000Z - PR #24 opened (base dev); status to review

Task 120.120 was executed by the orchestrator's final step:
PR #24 opened (base dev, head feat-20, closing GitHub issue
#20) against the four feature commits (14a30c9, 6549d31,
45597c3, 82ed81f); the frontmatter status flipped planning
to review; the PR is recorded in Related PRs / Commits.

#### 2026-11-13T16:59:20.000Z - Phase 120: gates and docs

Phase 120 (Tasks 120.100/120.110) landed. The full seven-command
gate chain ran green on Node 26.13.0 from the repository root as the
final-state confirming run (after the C4 and Progress edits). One
drift item was found and fixed (the new transitive `hono` advisory,
below); no other drift (license headers, archunit, prettier) was
found to fix. Task 120.120 (open the PR referencing GitHub issue
#20) is left to the orchestrator's final step per the feat-18/19
convention and is intentionally left unticked in this plan.

- **Gate evidence (Task 120.100)**: `npm ci` (exit 0, fresh
  install from the lockfile); `npm run lint` (exit 0, clean);
  `npm run format:check` (exit 0, "All matched files use
  Prettier code style!" - `docs/` is in `.prettierignore`, so
  the C4 edits are exempt); `npm run build` (exit 0,
  type-check + emit, `dist/` rebuilt for the spawn tests);
  `npm test -- --coverage` (exit 0, 19 test files / 354
  tests passed, 2 skipped - the two documented fixed-port
  spawn legs ACC-001/ACC-002: a root-owned container-level
  Jetty/PlantUML service permanently owns 127.0.0.1:8080 in
  this sandbox and the entry point binds the fixed port
  unconditionally (a configurable port is explicitly out of
  scope), so they self-report a dynamic skip here and run
  un-skipped in CI with a clean 8080. Coverage report-only per
  QA 0.0260: 94.4% statements, 88.74% branches, 98.07%
  functions, 94.38% lines);
  `npm audit` (byte-identical to the documented residual after
  the fix below - archunit -> minimatch 10.2.6,
  GHSA-g3hv-75wg-m249, moderate, listed twice);
  `uvx pre-commit run --all-files` (all seven hooks passed:
  check yaml, fix end of files, trim trailing whitespace,
  ESLint, Prettier, tsc, vitest).
- **Audit drift found and fixed (Task 120.100)**: the first
  `npm audit` of this phase reported two NEW moderate advisories
  beyond the documented residual: `hono` <=4.13.15 (installed
  4.13.14) and `@hono/node-server` 2.0.0-2.1.5 (installed
  2.1.5). Both are pulled in transitively by
  `@modelcontextprotocol/sdk` 1.32.2, for which no newer release
  exists (its ranges: `hono: ^4.11.4` and
  `@hono/node-server: ^1.19.9 || ^2.0.5` already permit the
  fixed versions). Fixed by pinning the advisory-release
  versions through root-manifest `overrides`: `hono: 4.13.18`,
  `@hono/node-server: 2.1.8`, and updating the two
  `package-lock.json` entries (only `version`/`resolved`/
  `integrity` change; both keep the same `engines`/
  `peerDependencies` shape, and `@hono/node-server` 2.1.8's
  `hono: ^4 || ^5.0.0-0` peer is satisfied by 4.13.18). The
  change is at the workspace root (`package.json` +
  `package-lock.json`), not under `apps/`, and changes no
  production behavior (the server uses the stdio transport, not
  the hono-based HTTP transport). After the fix, `npm audit` is
  byte-identical to the documented residual.
- **C4 correction (Task 120.110)**: the MCP Server container
  description in both `docs/c4/c4-container.puml` and
  `docs/c4/workspace.dsl` moves `preview` from the planned list into
  the exposed tools - exactly one line changed per file (verified by
  `git diff`), everything else untouched; the in-process
  localhost:8080 preview endpoint clause, the HumanUser preview
  relation, and the `bpmn-js` techn entry were already correct and
  stay as they are (plan fix D1). The shared sentence reads: before -
  "Exposes six MCP tools (create, change, import, export, parse,
  validate) and two MCP resources (version, config) over stdio; the
  remaining Stage 1 tool (preview) is planned."; after - "Exposes
  seven MCP tools (create, change, import, export, parse, validate,
  preview) and two MCP resources (version, config) over stdio." A
  residual search for `planned` and `six MCP tools` across both
  files returns no hits (the Stage 2 "deferred" markings are
  legitimate and stay). **Byte-identity proof (the feat-17/18/19
  convention)**: the description string was extracted from each file
  before and after the edit and compared - before: both 1098 chars,
  sha256
  c2443719988302e49a7a4bcb6c1363a5438f3fb8d7e88f01026518d6cea92bed
  (identical in both files); after: both 1060 chars, sha256
  de2e3d6c3707dd531d93aa2997ed0d778a5012f8d00e681d8e7c07dfc5bc2bf8
  (identical in both files); with the corrected sentence masked out,
  the rest of each description is byte-identical to its pre-edit text
  (the -38 char delta is exactly the 161 -> 123 char sentence
  change). The updated `docs/c4/c4-container.puml` was validated with
  the `specmgr_validate_plantuml` tool: `structure_ok: true`,
  `checked_by: structure`, `source_state: none` (no
  SPECMGR_PLANTUML_* render source is configured in this
  environment, so the structure-check floor is the available
  verdict), no errors, no warnings.

#### 2026-11-13T11:37:00.000Z - Phase 110 implemented (Opener and tool)

Tasks 110.100/110.110 done. New: `src/preview/browser-opener.ts`
(the cross-platform opener: `xdg-open` (Linux), `open` (macOS),
`cmd /c start "" <url>` (Windows - `start` is a `cmd` builtin, so
`cmd` itself is spawned; the empty quoted title is mandatory when a
URL follows), the fire-and-forget `spawn` with `detached: true` and
ignored stdio, the child `unref()`ed on `spawn`; a missing binary
(ENOENT), any spawn error, a synchronous spawner throw, or an
unknown platform resolves to `opened: false` with a single-line
`reason` - it never rejects, ACC-007). The `preview` tool is
registered in `server.ts` (`createServer` now takes the constructed
`PreviewServer` as its third argument; the `lintPackageRoot`
injectable moves to fourth): the input is the process uuid (a
non-empty string), the success result is the `{ url, port, opened,
reason? }` JSON (the url from `buildViewUrl`), the `ensureServer`
port-in-use failure is the repo-standard single-line `isError`
result, and the description states the turn-based contract (the
served page reflects the state at call time after the conditional
re-read; nothing refreshes automatically; repeated calls reuse the
running server on the same port). `index.ts` constructs the single
preview server for the process lifetime and materializes the Phase
100 WIRING POINT: `server.server.onclose` (the SDK `Protocol`'s
public callback - the SDK `Server` is not an EventEmitter; the
plan's "'close' event" candidate does not exist on the installed
1.32.x) plus `SIGINT`/`SIGTERM` (the stdio session end the host
performs: the SDK's own `StdioClientTransport.close()` signals this
child with `SIGTERM` after a grace period), both funneling into one
idempotent routine that closes the preview server and exits (the
explicit exit is required - the stdio transport's stdin `data`
listener keeps the event loop alive). Tests: the stubbed-spawn unit
leg (`test/preview/browser-opener.test.ts`, 10 tests: the
per-platform command + args, the fire-and-forget options, the
unref, the success/ENOENT/spawn-error/synchronous-throw/unknown-
platform legs), the seven-tool handshake (in-memory and spawn), the
in-memory adapter legs (the zod input rejections, the port-in-use
mapping on an ephemeral port), and the spawn e2e legs (ACC-001: the
view URL plus the page and XML over real HTTP; ACC-002: the second
call reuses the running server; the REQ-001 port-in-use leg over
real stdio; the REQ-005 SIGTERM clean-shutdown leg: the handler
runs, the process exits deterministically, the `shutting-down`
event lands in the log). The fixed-port e2e legs guard themselves at
runtime: the entry point binds the fixed 8080 unconditionally (a
configurable port is out of scope), so when an external service
already owns it (this runtime: a container-level Jetty/PlantUML
service, root-owned) they report a dynamic skip (`ctx.skip`), and
the port-in-use leg - which takes the port itself when the
environment left it free - exercises exactly that state instead.
The full composition (the preview call, the page/XML fetch, the
reuse, the SIGTERM close of a RUNNING server with the port
released) was additionally smoke-verified end to end against a
scratch copy of the built entry point with the port swapped. Gate
chain green: `npm run build`, `npm run lint`, `npm run format:check`,
`npm test` (354 passed, 2 skipped - the two fixed-port legs above).

#### 2026-11-11T11:07:00.000Z - Phase 100 implemented (Preview server and page)

Tasks 100.100/100.110/100.120 done. New: `bpmn-js` (18.31.1) as a
runtime dependency; `src/preview/preview-server.ts` (the
zero-dependency `node:http` server: the `127.0.0.1` bind on the
fixed, test-injectable port, the `/processes/<uuid>` XML endpoint on
the store's conditional re-read, the `/view/<uuid>` page endpoint,
the `/bpmn-js/<file>` asset route, the 404/400/405 legs, the
structured `port-in-use` start error, and the stdout discipline via
the injected logger) and `src/preview/preview-page.ts` (the single
static asset: the read-only Viewer, the pinned bundle/CSS over the
fixed asset prefix, the watermark unmodified). The store gained the
read-only `readProcessXml` (draft-first, then the conditional
re-read) as the endpoint's data source. Lifecycle: lazy idempotent
`ensureServer()`, the listener `unref()`ed at start (E1a), and the
explicit `closeServer()` shutdown path with its Phase 110 wiring
point documented (E1b); a child-process test leg proves zero stdout
bytes with the server up, the natural process exit free of the
listener, and the close-released port (E1c). Plan fix G3: the
installed `bpmn-js` ships no `exports` map, so the asset resolution
uses Node's own resolver (`createRequire` on
`bpmn-js/package.json`, with a main-entry walk-up fallback for a
future restrictive map); the pinned assets are
`bpmn-viewer.production.min.js`, `assets/diagram-js.css`, and
`assets/bpmn-js.css`. Gate chain green: `npm run build`,
`npm run lint`, `npm run format:check`, `npm test` (338 tests).

#### 2026-11-07T09:02:00.000Z - Created

Initial feature plan for the `preview` tool, per GitHub issue #20 and
QA pairs 4.0010/4.0020/6.0010.

### Decisions Made

<!-- Newest entry first -- prepend new entries directly below this comment. -->

#### 2026-11-13T11:37:00.000Z - Phase 110 design decisions

Settled in implementation: (1) the clean-shutdown hook is
`server.server.onclose` plus `SIGINT`/`SIGTERM` - the SDK `Server`
is not an EventEmitter (the plan's "'close' event" candidate does
not exist on the installed 1.32.x); its base class `Protocol`
exposes a public `onclose` callback instead, and for stdio that
callback fires only on an explicit or error-driven close - the
stdio session end a host performs is its own
`StdioClientTransport.close()` signaling this child with `SIGTERM`
after a grace period (verified against the installed SDK sources);
the explicit `process.exit(0)` after the close is required because
the stdio transport's stdin `data` listener keeps the event loop
alive; (2) the `preview` tool's input is a non-empty string uuid
(the task's explicit shape) rather than the v4-shape `UUID_V4` the
other tools use - the store's not-registered error is the
unknown-uuid leg; (3) the spawn e2e's fixed-port legs (ACC-001/
ACC-002) are guarded by a runtime check of the actual `preview`
outcome (a dynamic `ctx.skip` on the exact port-in-use message)
rather than a module-load port probe: the entry point binds the
fixed 8080 unconditionally (a configurable port is explicitly out
of scope), so in an environment where an external service owns 8080
(this runtime: a container-level Jetty/PlantUML service, root-
owned, not stoppable from the repo) the bind-impossible legs report
themselves as skipped, and the port-in-use leg - which takes the
port itself when the environment left it free - exercises exactly
that state over real stdio.

#### 2026-11-11T11:07:00.000Z - Phase 100 design decisions

Settled in implementation (under plan fixes E1/G3): (1) the preview
page is embedded as a TypeScript string constant
(`src/preview/preview-page.ts`) rather than a separate `.html` file
-- `tsc` does not copy non-TS assets into `dist/`, and embedding
keeps the page a true single asset with no path resolution from
either the source or the compiled layout; (2) the asset URL scheme
is the fixed prefix `/bpmn-js/<file>`, mirroring the installed
package's `dist` layout 1:1, so any relative reference inside a
served CSS resolves to the mirrored file; (3) the clean shutdown
combines E1a and E1b: the listener is `unref()`ed at start (it never
keeps the process alive on its own) plus the explicit, idempotent
`closeServer()` (port release, keep-alive teardown), with the Phase
110 wiring point documented in its doc comment; (4) the XML
endpoint reads through the store's new read-only `readProcessXml`
(draft-first, then the conditional re-read), keeping the store the
sole filesystem owner (CONSTITUTION §4).

#### 2026-11-07T09:45:00.000Z - Viewer assets: served from the installed package

User decision (2026-11-07): the `bpmn-js` bundle/CSS are served from
the installed package at runtime (REQ-003). Rationale, settled with
the user: the shipped package already resolves every code dependency
from `node_modules` at runtime (`dist/` is compiled glue, not a
bundle), so reading two static asset files from the installed
`bpmn-js` adds no new deployment requirement; vendoring would add a
copy step and a drift gate for a self-containment that `dist/` does
not have anyway. The FEAT feat-11-npm-publish-mcp-registry packed
tarball holds for the same reason (`bpmn-js` is a declared dependency).

### Related PRs / Commits

- GitHub issue #20
- PR #24 (feat-20-preview-tool → dev): the preview MCP tool
