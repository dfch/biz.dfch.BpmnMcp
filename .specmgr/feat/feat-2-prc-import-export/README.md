---
classification: null
created: '2026-10-31T18:47:11.018+01:00'
id: feat-2-prc-import-export
status: planning
type: feat
updated: '2026-10-31T19:57:38.174+01:00'
version: 1.0.0
---

# Feature: PRC Artifact Core with Import and Export Tools

## Plan

### Overview

feat-1-bpmn-mcp-scaffold delivered the npm-workspaces scaffold, the quality gates, and the walking-skeleton MCP server (the `version`/`config` resources, pino logging, and `BPMN_MCP_DOCS_DIR`/`prc` path resolution). QA pair 1.0070's "first increment" -- scaffold + the two resources + `import` + `export` + logging -- is therefore half done: this feature delivers the other half, in one pull request. It implements the file-backed `prc` artifact core and the two MCP tools `import` and `export`. The core (a new `src/prc/` module group, following pair 7.0010's core-module/thin-adapter layout) owns the `prc-<uuid>-<slug>.bpmn` filename scheme (pair 0.0300), the directory scan that makes the listing of `docs/prc/` the process inventory, the in-memory bpmn-moddle tree cache, and the conditional SHA-256 checksum re-read (pairs 1.0020/1.0080); `import` ingests a BPMN 2.0 file from any path into the `prc` directory and returns its UUID, and `export` serializes a process (after the checksum re-read) to BPMN 2.0 XML and writes it to the process's own `prc` path or to an explicitly given path (pair 9.0010's overwrite rule). End-to-end verification is the 1.0070 milestone round-trip: import a `.bpmn` file from outside the tree, export it, diff the result. The remaining Stage 1 tools (`create`, `change`, `validate`, `parse`, `preview`) are out of scope and deferred to separate features.

### Requirements

- REQ-001: `bpmn-moddle` (10.3.x, the version the feat-1 Task 100.165 interop spike confirmed to load under Node 24 ESM) is added as a committed runtime dependency of `apps/mcp-server` and imported as the named ESM export (`import { BpmnModdle } from 'bpmn-moddle'`).
- REQ-002: The core builds and parses the filename scheme `prc-<uuid>-<slug>.bpmn` under the resolved `prc` directory: `<uuid>` is a v4 UUID and `<slug>` is derived by slugifying the `id` of the document's `<bpmn:process>` element (lowercase, runs of non-alphanumerics collapsed to a single hyphen, leading/trailing hyphens stripped), falling back to the source filename's stem when the document has no process `id`. Non-conforming files in the `prc` directory are ignored by the inventory, and no tool of this feature modifies or deletes them.
- REQ-003: The process inventory is a directory scan of the resolved `prc` directory (feat-1's REQ-010 path model): each conforming file yields `(uuid, slug, absolute path)`, and a missing directory yields an empty inventory, not an error. Neither the scan nor any path resolution creates a directory (directory creation happens only in the REQ-005/REQ-006 write operations, where a file must be placed).
- REQ-004: Every imported process has an in-memory cache entry (`uuid` to the bpmn-moddle tree plus the SHA-256 checksum of the on-disk file at parse time), held for the lifetime of the server process only (decision recorded in Design Notes). Every tool operation touching a process performs the conditional re-read: if the file's current SHA-256 equals the cached checksum, the cached tree is served without re-parsing; if it differs (an out-of-band change by a user or another instance), the file is re-parsed, the cache and checksum are updated, and the re-read is noted in the tool result and in the structured log. Polling at operation time only, no file watcher; loss of the cache on server restart is acceptable (pair 5.0010).
- REQ-005: The `import` MCP tool takes one file-path input and: rejects a missing path, a directory, or non-BPMN/unparseable XML with a structured error, registering nothing and writing nothing; reuses a process's UUID and performs the REQ-004 conditional re-read when the given path is already that process's registered own path (a conforming name in the `prc` directory); otherwise assigns a new v4 UUID, derives the slug per REQ-002, copies the file to `prc/prc-<uuid>-<slug>.bpmn` (creating the `prc` directory when needed, leaving the original file byte-identical), registers the copy as the process, and returns the UUID and the registered path. Re-importing the same outside-tree source path within a server session returns the same UUID (session-scoped source-path to UUID map, per Design Notes).
- REQ-006: The `export` MCP tool takes a process UUID and an optional explicit target path; after the REQ-004 conditional re-read it serializes the cached tree with bpmn-moddle (`format: true`) to BPMN 2.0 XML and writes it: by default to the process's own `prc` path, or to the explicit path when given (pair 9.0010: a file that is not the process's own path is overwritten only via an explicit path). The write is atomic (temporary file in the same directory, then rename). The checksum cache is updated to the SHA-256 of the file as written, and the tool returns the written path. The `export` postcondition (REQ-009) verifies that the written file re-parses to the same element set as the serialized tree (pair 0.0260's example).
- REQ-007: Both tools are registered via the MCP SDK's `registerTool` with zod input shapes (`zod` is already a committed dependency as the SDK's mandatory peer, feat-1 Phase 110); `import` and `export` appear in the MCP tool list, which holds exactly those two tools since feat-1 registered none. Invalid input (an unknown UUID for `export`, a directory as the `import` path) yields a structured `isError` tool result, not an exception that crashes the server.
- REQ-008: Tests cover: unit tests of the filename scheme (build/parse round-trip, slug derivation from the process `id` and from the filename fallback, non-conforming-name rejection, UUID v4 shape), of the inventory scan (conforming files, non-conforming files ignored, missing directory), of the conditional re-read (cache hit; out-of-band change detected and the re-read noted), of `import` (new foreign file, re-import of a registered path, structured errors), and of `export` (own path, explicit path, atomic write, checksum update, the REQ-006 postcondition); `.bpmn` test fixtures under `apps/mcp-server/test/fixtures/` (verified exempt from the license-header drift gate as an unrecognized extension and ignored by Prettier, with no machine-config change); an MCP-level in-memory client test driving both tools; a spawn-based test against the built `dist/index.js`; and the 1.0070 round-trip end-to-end.
- REQ-009: The in-house assertion module recorded in pair 0.0260 -- a small `src/assertions.ts` defining `precondition(condition: unknown, message: string): asserts condition` and `postcondition(condition: unknown, message: string): asserts condition`, both throwing an `Error` carrying `message` on a falsy condition -- is created in this feature (the first code with contracts; feat-1's out-of-scope note says the helpers "arrive with the first code that uses them") and used in the `prc` store operations: `precondition` at entry (input invariants) and `postcondition` at exit (the REQ-006 `export` check, and the `import` check that the copy exists and re-parses).

### Acceptance Criteria

- [ ] ACC-001: On a clean clone, `npm ci`, `npm run lint`, `npm run format:check`, `npm run build`, and `npm test -- --coverage` all pass from the repository root, and `uvx pre-commit run --all-files` passes; `npm audit` against the committed lock file reports no vulnerabilities other than the documented residual (archunit's transitive `minimatch` 10.2.6, GHSA-g3hv-75wg-m249, tracked in QA 7.0030 until a minimatch-11-compatible archunit release ships).
- [ ] ACC-002: Calling `import` with the path of an outside-tree `.bpmn` fixture returns a v4 UUID and creates `prc-<uuid>-<slug>.bpmn` in the resolved `prc` directory whose `<slug>` matches the fixture's slugified `<bpmn:process id>`; the original fixture file is byte-identical after the call.
- [ ] ACC-003: Re-calling `import` with the registered own path (`prc/prc-<uuid>-<slug>.bpmn`) returns the same UUID and creates no second file; re-calling `import` with the same outside-tree source path within the same server session returns the same UUID.
- [ ] ACC-004: Calling `import` with a nonexistent path, a directory, and a non-BPMN/malformed XML file each returns a structured error result; in all three cases nothing is registered and nothing is written in the `prc` directory.
- [ ] ACC-005: Calling `export` with a registered UUID and no explicit path writes only to the process's own `prc` path; calling `export` with an explicit path under a temporary directory writes only to that path (overwriting a pre-existing file there); no other file is modified in either case.
- [ ] ACC-006: After the on-disk file of a registered process is modified out of band (its bytes change), the next `import` or `export` call for that process re-parses the file, notes the out-of-band re-read in the tool result, and the served/serialized content reflects the modification.
- [ ] ACC-007: The 1.0070 round-trip is executed and recorded as a Progress entry: import an outside-tree fixture, export it to a temporary path, and re-parse the export; the element/flow inventory (every element's BPMN id, type, and name, plus every flow's id, source, and target) of the export is identical to the source's, and any byte-level diff between source and export is recorded and is formatting-only (attribute order / whitespace, no semantic change).
- [ ] ACC-008: The in-memory MCP-level test asserts that the tool list is exactly `import` and `export` and drives both tools through the SDK `Client` without spawning a process; a spawn-based test drives both tools over real stdio against the built `dist/index.js`.
- [ ] ACC-009: With no `prc` directory present, the inventory is empty without an error, `import` of a foreign fixture works (creating the directory when needed to place the copy), and `export` of the process's own path works; with an empty `prc` directory present, `export` of an unknown UUID returns a structured "process not registered" error.
- [ ] ACC-010: The assertion module (REQ-009) compiles under `strict` with its `asserts` signatures (type narrowing at call sites is exercised in the store), and its unit tests prove that a falsy condition throws an `Error` carrying the given message for both `precondition` and `postcondition`.

### Scope

#### Included

- The committed runtime dependency `bpmn-moddle` (plus the lock file update).
- The in-house assertion module (`src/assertions.ts`, REQ-009) and its unit tests.
- The `src/prc/` core modules: filename scheme, inventory scan, bpmn-moddle parse/serialize wrappers, the cache + conditional re-read store, and the `import`/`export` operations.
- The `import` and `export` MCP tools with zod input shapes and structured errors, wired into `createServer` (store injection).
- The `.bpmn` test fixture set under `apps/mcp-server/test/fixtures/`.
- Unit tests, the MCP-level in-memory tests, the spawn-based tests, and the 1.0070 round-trip end-to-end with its recorded diff.
- The removal of feat-1's throwaway `src/placeholder.ts` and `test/placeholder.test.ts` (real code replaces the placeholder; the build/lint gates have had something to check since feat-1's Phase 110).
- CONTRIBUTING.md touch-ups only where accuracy requires (the `import`/`export` behavior, copy-on-import, the `prc` directory that writes create, the assertion module now existing in code).
- The pull request itself.

#### Explicitly Out Of Scope

- Every other Stage 1 tool: `create`, `change`, `validate`, `parse`, `preview` (deferred to separate features per pair 1.0070).
- `bpmnlint` and the `.bpmnlintrc` configuration (they arrive with the `validate` feature, pair 7.0020; the `config` resource keeps reporting "not yet configured" until then).
- The preview HTTP server and bpmn-js (pairs 4.0010/4.0020; the "view it in the preview" leg of the 1.0070 milestone is satisfied by that later feature).
- OpenTelemetry instrumentation and SDK initialization (pair 0.0170: a no-op until an endpoint is configured; the first feature that spans named operations brings it -- the store operations stay instrumentation-free so adding spans later is a local change).
- Persistence of the checksum cache or the source-path to UUID map beyond the server's in-memory lifetime (decided: in-memory only, see Design Notes).
- Per-process locking of the read-check-act sequence (recorded known limitation, pairs 1.0020/1.0080).
- File watching (polling at operation time only, pair 1.0080).
- Renaming or moving a registered process (no rename tool exists; the slug is derived once at import).
- Coverage thresholds, per-artifact locking, and the dependency-license gate (carried over from feat-1's out-of-scope).

### Dependencies

#### Depends On

- feat-1-bpmn-mcp-scaffold (status `done`, PR #2 merged): the scaffold, the gates, logging, the `BPMN_MCP_DOCS_DIR`/`prc` path resolution (its REQ-010), the MCP server entry point over the SDK + zod, and the interop-spike facts this feature builds on (named ESM `BpmnModdle` import, `zod` as a mandatory peer, the pino logging shape).
- DEC fdc84432-1b48-4eb9-82e0-ec13cb8cf8ba: the Node/TypeScript MCP server decision.
- QA 818fac76-96fb-4e3c-acb8-e5520fab5913: pair 0.0300 (the filename scheme, the directory listing as inventory, the checksum home left open to this feature), 1.0020/1.0080 (file-backed source of truth, the conditional re-read with checksum, the recorded locking limitation), 1.0070 (the first increment and its round-trip milestone), 9.0010 (the overwrite rule), 7.0010 (the core-module/thin-adapter layout), 0.0260 (the assertion module and its `export` postcondition example), 5.0010 (in-memory loss acceptable).
- REQ 5e0fa899-683e-4c32-bb13-6a2dee03a516: The tool shall import existing BPMN 2.0 XML files.
- REQ b4d4fa31-9ba8-4967-be59-9d23cc7f9213: The tool shall export the current diagram as BPMN 2.0 XML.

#### Blocks

- The `preview` feature (the Stage 1 browser viewer): it addresses processes by UUID over the `.../processes/<uuid>` URL scheme (pair 4.0010) and needs the inventory and the checksum re-read this feature implements.
- The `validate`, `parse`, `create`, and `change` features: each operates on a registered process UUID and the cached moddle tree.

### Design Notes

The three open points that pairs 0.0300/1.0020 explicitly left to this feature are decided (user, 2026-10-31):

1. **Checksum cache home: in-memory only.** A `Map` from `uuid` to `{ tree, sha256 }` lives in the server process, alongside the session-scoped source-path to UUID map. No sidecar file; the registry concept does not return. Restarting the server loses both maps, and the first operation after a restart parses fresh -- acceptable per pair 5.0010 (in-memory loss is acceptable; the file on disk is the source of truth and always re-derivable).
2. **Foreign-source import: copy, not move.** The original file stays byte-identical (pair 9.0010's no-silent-clobber spirit); the copy under `prc/` becomes the process's own path and therefore the sole source of truth -- edits to the original after import are invisible to this process by design. Re-importing the original within the same session returns the same UUID (the decision #1 map); after a server restart it assigns a new UUID and creates a second file -- a recorded known limitation of decision #1, not to be "fixed" by reintroducing a registry.
3. **Slug derivation: the document's `<bpmn:process id>`**, slugified (lowercase, runs of non-alphanumerics to a single hyphen, leading/trailing hyphens stripped), with the source filename's stem as fallback when the document has no process `id`. The slug is cosmetic for addressing (the UUID is the identifier); it is derived once at import and never re-derived, so a later in-file process-`id` rename does not rename the file (no rename tool exists, see out of scope). Filename collisions are impossible because the UUID is part of the name.

**Writes create, resolutions do not.** feat-1's REQ-010 invariant -- resolving paths never creates a directory, and reading the `config` resource does not create `docs/prc/` (its ACC-008) -- stays intact: it constrains reads/resolutions. `import` and `export` are write operations and create the `prc` directory when they must place a file (`mkdir -p` semantics). A bare inventory scan of a missing `prc` directory still yields an empty inventory without creating anything (REQ-003, ACC-009).

**Module layout (pair 7.0010's core module / thin adapters).** New `src/prc/` package: `filename.ts` (scheme build/parse, slugify, UUID v4), `moddle.ts` (the `BpmnModdle` singleton, parse with structured error wrapping, serialize with `format: true`), `inventory.ts` (the directory scan), `store.ts` (the cache `Map`, the session source-path map, the conditional re-read, the import/export operations, the atomic write). The assertion module lives at `src/assertions.ts` (shared, per pair 0.0260's "small in-house module in the core component"). `src/server.ts` registers the two tools as thin adapters (zod shapes, error mapping to `isError` results) over `store.ts`'s operations -- the tools never touch the filesystem directly, so the later `preview`/`validate`/`parse` features reuse the same core, and a Stage 2 canvas-server process (the decision record's deferred split) could host the core without the MCP server. The wiring consequence: `createServer`'s signature gains a store (or store factory) parameter alongside the existing `LoggingConfig`, and `index.ts` constructs the store with the resolved `prc` path and the logger. The store takes `prcDir` and the logger explicitly, so unit tests point it at a temporary directory without touching environment variables, while the MCP-level/spawn tests set `BPMN_MCP_DOCS_DIR` + `cwd` as feat-1's `paths.test.ts` does.

**Gates and fixtures.** `.bpmn` files need no machine-config change: the license-header drift gate maps unrecognized extensions to no comment prefix and skips them (`commentPrefixFor` returns `null`), and Prettier only checks recognized extensions, so `prettier --check .` ignores `.bpmn`. REQ-008/ACC-001 therefore _verify_ the exemption (the gates pass with the fixtures committed) rather than _add_ it. The fixtures: a minimal but real BPMN 2.0 process document (a process with an `id`, one start event, one task, one end event, one sequence flow, and BPMNDI shapes, so the later `preview` feature can reuse the same fixture), a document without a process `id` (the slug fallback), and an intentionally malformed XML file (ACC-004).

**Structured tool errors.** Tool failures return `isError: true` results with a single-line, human-readable message (path missing, path is a directory, unparseable XML with the bpmn-moddle cause, UUID not registered, write failed). Nothing is thrown across the MCP boundary, and a bad input never crashes the server (REQ-007).

**Architecture gate (CONSTITUTION §4, QA 7.0030).** This feature lands `src/prc/`, the module the architecture suite's forward-looking rules target: from Phase 100 onward, the `src/prc/**` rules (no dependency on the adapter files `src/server.ts`/`src/index.ts`, no `@modelcontextprotocol/sdk` import) stop passing via `allowEmptyTests` and bite for real. The store must therefore import neither the SDK nor the adapter files (it takes the `prc` path and the logger as parameters, per the module-layout note above), and `src/server.ts` must keep importing no `node:fs` (the tools stay thin adapters over `store.ts`). The architecture suite runs inside `npm test`, so ACC-001's gate list covers it; no new gate is added by this feature.

**Dependency overrides (QA 7.0030's audit note).** The root `package.json` pins `minimatch` to 11.0.1 tree-wide (the advisory GHSA-g3hv-75wg-m249 fix), with a nested override keeping `archunit`'s own copy at 10.2.6 (archunit 2.5.4 requires the `makeRe` export that 11 removed). The known residual audit finding (archunit -> minimatch 10.2.6, moderate) is tracked in QA 7.0030 until a minimatch-11-compatible archunit release ships. This feature's ACC-001 therefore asserts "no vulnerabilities other than the documented residual", not "0 vulnerabilities"; dropping the nested override and the residual finding is a follow-up task for that release, not part of this feature.

**Serialization and the round-trip.** `export` serializes the cached tree (not the raw file bytes): for a freshly imported, unmodified process, the exported XML may differ from the source at the byte level (attribute order, whitespace, namespace declarations) while remaining semantically identical -- hence ACC-007 compares element/flow inventories after re-parsing and _records_ any byte diff, requiring it to be formatting-only. `export` is also the normalization step: after one import + default export, the file on disk is the bpmn-moddle serialization.

### Related Decisions

- DEC fdc84432-1b48-4eb9-82e0-ec13cb8cf8ba: Use a Node/TypeScript MCP Server for Agent-Driven BPMN Modeling -- this feature implements the tool half (`import`/`export`) of the first increment toward that decision's Confirmation criterion.
- QA 818fac76-96fb-4e3c-acb8-e5520fab5913: the source of every design point above (pairs 0.0300, 1.0020, 1.0070, 1.0080, 9.0010, 7.0010, 0.0260, 5.0010); its Design Notes record the three decisions that pairs 0.0300/1.0020 explicitly deferred to this feature.
- REQ 5e0fa899-683e-4c32-bb13-6a2dee03a516: The tool shall import existing BPMN 2.0 XML files.
- REQ b4d4fa31-9ba8-4967-be59-9d23cc7f9213: The tool shall export the current diagram as BPMN 2.0 XML.
- REQ 0caae3bd-b4e8-47c6-a417-520766031f27: The tool shall expose its functionality as a Model Context Protocol server (`import`/`export` extend its tool surface).

### Task List

#### Phase 100: The `prc` Artifact Core

- [ ] Task 100.100: Add `bpmn-moddle` (10.3.x per the feat-1 spike) as a committed runtime dependency of `apps/mcp-server`, regenerate `package-lock.json`, and verify `npm audit` reports no findings other than the documented residual (QA 7.0030) and the named ESM import compiles under the workspace layout.
- [ ] Task 100.105: Create the in-house assertion module `src/assertions.ts` per pair 0.0260 (`precondition`/`postcondition` with `asserts` signatures, throwing an `Error` carrying the given message on a falsy condition) and its unit tests (ACC-010).
- [ ] Task 100.110: Implement `src/prc/filename.ts` (build/parse `prc-<uuid>-<slug>.bpmn`, slugify with the process-`id` to filename-stem fallback, UUID v4, non-conforming-name rejection) and its unit tests (REQ-002).
- [ ] Task 100.115: Create the `.bpmn` fixture set under `apps/mcp-server/test/fixtures/` (a minimal process with an `id` + BPMNDI, a process without an `id`, a malformed XML file) and verify the license-header drift gate and Prettier skip them with no config change (Design Notes, "Gates and fixtures").
- [ ] Task 100.120: Implement `src/prc/moddle.ts` (the `BpmnModdle` singleton, parse with structured error wrapping, serialize with `format: true`) and its unit tests (parse, serialize, re-parse round-trip of the fixtures; REQ-001/REQ-006).
- [ ] Task 100.130: Implement `src/prc/inventory.ts` (the directory scan, the conforming filter, missing directory to empty inventory, no directory creation) and its unit tests against temporary directories (REQ-003).
- [ ] Task 100.140: Implement `src/prc/store.ts`: the cache `Map` + the session source-path map, the conditional SHA-256 re-read with the out-of-band re-read note (tool result + structured log), the import operation (copy into `prc/`, reuse, structured errors), the export operation (own path or explicit path, atomic write, checksum update, the REQ-006 postcondition), using the REQ-009 assertions; unit tests for each, including the ACC-004/ACC-006/ACC-009 cases.
- [ ] Task 100.150: Remove feat-1's throwaway `src/placeholder.ts` and `test/placeholder.test.ts`, and run all gates (lint, format:check, build, test), fixing findings.

#### Phase 110: The `import` and `export` MCP Tools

- [ ] Task 110.100: Wire the store into the server: construct it in `index.ts` (the resolved `prc` path, the logger), extend `createServer`'s signature, and register the `import` tool (zod input shape, error mapping to `isError` results) with unit tests for the adapter layer (REQ-005/REQ-007).
- [ ] Task 110.110: Register the `export` tool (zod input shape: UUID + optional explicit path, error mapping) with its unit tests (REQ-006/REQ-007).
- [ ] Task 110.120: Extend the MCP-level in-memory client test: assert the tool list is exactly `import` and `export`, and drive import, then export, through the SDK `Client` against a temporary `BPMN_MCP_DOCS_DIR` without spawning a process (ACC-008, the in-process leg of ACC-007).
- [ ] Task 110.130: Extend the spawn-based test to drive `import` and `export` over real stdio against the built `dist/index.js`, including a process-level out-of-band re-read case (ACC-008, ACC-006).
- [ ] Task 110.140: Execute the 1.0070 round-trip end-to-end (ACC-007) and record the result -- including any byte diff and its formatting-only analysis -- as a Progress, Updates entry.
- [ ] Task 110.150: Update CONTRIBUTING.md only where accuracy requires (the import/export behavior, copy-on-import, the `prc` directory that writes create, the assertion module now existing in code), run the full quality gate from the repository root (`npm ci`, `npm run lint`, `npm run format:check`, `npm run build`, `npm test -- --coverage`, `uvx pre-commit run --all-files`), and open the pull request.

## Progress

### Current Status

**As of 2026-10-31**: planned. The spec is drafted from QA pair 1.0070's first increment and the three design decisions the user confirmed on 2026-10-31 (in-memory checksum cache, copy-on-import, process-`id` slug). Awaiting the user's review; no implementation has started.

### Blockers

None.

### Updates

<!-- Newest entry first -- prepend new entries directly below this comment. -->

#### 2026-10-31 18:40:17.375+01:00 - Created

Drafted the spec for the `prc` artifact core with the `import`/`export` tools -- the remaining half of QA pair 1.0070's first increment and the feature feat-1-bpmn-mcp-scaffold's Blocks section names. The three open design points that pairs 0.0300/1.0020 deferred to this feature (checksum cache home, foreign-source import semantics, slug derivation) were decided by the user during planning: in-memory `Map` (no sidecar file), copy-into-`prc/` (original untouched), and the document's `<bpmn:process id>` with a filename fallback. The pair 0.0260 assertion module arrives with this feature as the first code with contracts. Awaiting the user's review before implementation starts.
