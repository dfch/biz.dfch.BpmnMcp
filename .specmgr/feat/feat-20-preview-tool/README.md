---
classification: null
created: '2026-11-07T09:00:42.381+01:00'
id: feat-20-preview-tool
status: planning
type: feat
updated: '2026-11-07T09:38:07.580+01:00'
version: 1.0.0
---

# Feature: The preview MCP Tool (Stage 1 Browser Viewer)

## Plan

### Overview

Implements the `preview` tool (REQ bb63c11f) per QA 4.0010/4.0020:
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
- REQ-003: The preview page is a single static asset (QA 0.0250) running the bpmn-js Viewer in read-only mode; the Viewer bundle and CSS are served from the installed `bpmn-js` package (a new runtime dependency, located via Node's own resolver - `createRequire`) at fixed asset paths (user decision 2026-11-07; vendoring into the build output was rejected: `dist/` is not self-contained in this architecture anyway - every code dependency resolves from `node_modules` at runtime - and a copy step plus drift gate would buy nothing).
- REQ-004: A `preview` tool: input a process uuid; ensures the server is running (idempotent - a second call reuses the live server); opens the user's default browser at the process view URL (`xdg-open` on Linux, `open` on macOS, `start` on Windows); returns `{ url, port, opened, reason? }` with `opened` false and a `reason` when no opener is available or the launch fails - the tool call itself succeeds, since the server is reachable by hand.
- REQ-005: Lifecycle: the server starts lazily on the first `preview` call and stays alive for the process lifetime; it is closed on clean shutdown (the server's existing exit handling); the turn-based contract holds - each `preview` reflects the state at call time (after its re-read), nothing refreshes automatically.
- REQ-006: Tests: HTTP legs against an ephemeral test port (page 200 with the viewer markers, XML endpoint 200 with re-read behavior, unknown-uuid 404, in-use-port structured error), a browser-opener unit leg with a stubbed spawn, and proof that the running server does not pollute stdout (the existing stdio handshake test keeps passing with the server up).

### Acceptance Criteria

- [ ] ACC-001: `preview` on an imported process returns the view URL; `GET` of the page and of `/processes/<uuid>` serve the viewer page and the current XML (verified at the HTTP level in tests).
- [ ] ACC-002: A second `preview` call (any process) reuses the running server: no second bind attempt, no error, same port.
- [ ] ACC-003: The served page renders through the unmodified bpmn-js Viewer: the watermark attribution is present and unstripped (the accepted license clause).
- [ ] ACC-004: With the preview server running, the stdio protocol stays clean (the handshake test passes; no stdout writes from the HTTP module), the full gate chain is green on Node 26, and the handshake lists `preview`.

### Scope

#### Included

- The preview HTTP server module (bind, endpoints, lifecycle, stdout discipline) and its tests.
- The preview page (single static asset) and the `bpmn-js` runtime dependency with asset serving.
- The cross-platform browser opener and the `preview` tool adapter.
- The C4 description update (the localhost:8080 endpoint becomes real) and this feat's Progress discipline.

#### Explicitly Out Of Scope

- The bpmn-js Modeler, the properties panel, and any human editing (QA 4.0020: view only; Stage 2 territory).
- Live or two-way synchronization (the `yctimlin/mcp_excalidraw` canvas-server precedent applies to Stage 2 per DEC fdc84432's More Information).
- A configurable port or host, non-localhost binding, and any remote access.
- Caching or watching of diagram files (the turn-based contract plus the store's re-read is the whole mechanism).

### Dependencies

#### Depends On

- feat-2-prc-import-export (the `PrcStore`, the conditional re-read, the package-root pattern)
- DEC fdc84432-1b48-4eb9-82e0-ec13cb8cf8ba: Use a Node/TypeScript MCP Server for Agent-Driven BPMN Modeling (the bpmn.io License watermark clause)
- GitHub issue #20

### Design Notes

- **View URL scheme.** QA 1.0080 fixes the data endpoint as
  `/processes/<uuid>`; the page endpoint is an implementation choice -
  the recommendation is `GET /view/<uuid>` serving the same static
  page, whose JavaScript reads the uuid from the path and fetches
  `/processes/<uuid>`.
- **Single asset.** The page is one HTML document (QA 0.0250: "the
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

- DEC fdc84432-1b48-4eb9-82e0-ec13cb8cf8ba: Use a Node/TypeScript MCP Server for Agent-Driven BPMN Modeling (the watermark clause, the Stage 2 precedent)
- QA pairs 4.0010/4.0020/6.0010 (docs/qa/qa-818fac76): the preview contract, view-only scope, localhost-only binding

### Task List

#### Phase 100: Preview server and page

- [ ] Task 100.100: Add the `bpmn-js` runtime dependency and the preview server module: 127.0.0.1 bind on the fixed port (test-injectable), the `/processes/<uuid>` XML endpoint on the store's re-read, the view page endpoint, static asset serving, 404s, the in-use-port structured error, and stdout discipline.
- [ ] Task 100.110: Author the preview page (single static asset, read-only Viewer, watermark intact) and the lifecycle (lazy start, idempotent ensure, clean shutdown).
- [ ] Task 100.120: HTTP-level tests on an ephemeral port (page markers, XML + re-read, 404 legs, in-use-port error) and the stdout-cleanliness leg with the server up.

#### Phase 110: Opener and tool

- [ ] Task 110.100: Add the cross-platform browser opener (stubbed-spawn unit leg included) and register the `preview` tool (zod schema, `{ url, port, opened, reason? }` result, description stating the turn-based contract).
- [ ] Task 110.110: Update the handshake test; add the spawn e2e legs (ACC-001, ACC-002).

#### Phase 120: Gates and docs

- [ ] Task 120.100: Run the full gate chain on Node 26 and fix any drift (license headers, archunit, prettier).
- [ ] Task 120.110: Update the C4 container description (the in-process localhost:8080 endpoint becomes implemented) and this feat's Progress section.
- [ ] Task 120.120: Open the PR referencing issue #20.

## Progress

### Current Status

**As of 2026-11-07**: Planned; the Viewer-asset decision is recorded
(served from the installed package); no open decisions remain.

### Updates

<!-- Newest entry first -- prepend new entries directly below this comment. -->

#### 2026-11-07T09:02:00.000Z - Created

Initial feature plan for the `preview` tool, per GitHub issue #20 and
QA pairs 4.0010/4.0020/6.0010.

### Decisions Made

<!-- Newest entry first -- prepend new entries directly below this comment. -->

#### 2026-11-07T09:45:00.000Z - Viewer assets: served from the installed package

User decision (2026-11-07): the `bpmn-js` bundle/CSS are served from
the installed package at runtime (REQ-003). Rationale, settled with
the user: the shipped package already resolves every code dependency
from `node_modules` at runtime (`dist/` is compiled glue, not a
bundle), so reading two static asset files from the installed
`bpmn-js` adds no new deployment requirement; vendoring would add a
copy step and a drift gate for a self-containment that `dist/` does
not have anyway. The feat-11 packed tarball holds for the same
reason (`bpmn-js` is a declared dependency).

### Related PRs / Commits

- GitHub issue #20
