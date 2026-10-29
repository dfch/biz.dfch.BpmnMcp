---
classification: null
created: '2026-10-29T11:13:26.433+01:00'
id: feat-1-bpmn-mcp-scaffold
status: planning
type: feat
updated: '2026-10-29T15:31:04.008+01:00'
version: 1.0.0
---

# Feature: Scaffold and Walking Skeleton for the BPMN MCP Server

## Plan

### Overview

The repository holds specifications and conventions, but no implementation. Every gate that CONSTITUTION principle 3 and CONTRIBUTING describe (ESLint, Prettier, tsc, vitest, the license-header drift gate) exists only as prose, and CI fails today because `npm ci` has no `package.json` to read. This feature closes that gap in two phases within one pull request that leaves CI green. Phase 100 creates the npm-workspaces scaffold so that every gate runs for real. Phase 110 adds the walking skeleton: an MCP server over stdio that exposes the `version` and `config` resources, logs to a file and to stderr, resolves its paths, and is verified through an in-memory MCP client test. The BPMN tools (`import`, `export`, and the rest) are not part of this feature, and neither is the browser preview server; this feature is only the scaffold-and-skeleton slice of the decision record's Confirmation criterion and of QA pair 1.0070's "first increment" (resources plus `import`/`export`/logging) -- both are satisfied only once the next feature (see Dependencies, Blocks) ships.

### Requirements

- REQ-001: The repository root is a private npm-workspaces manifest (`workspaces: ["apps/*", "packages/*"]`) with a committed `package-lock.json`, and the only component is `apps/mcp-server/` (package name `biz.dfch.bpmnmcp`).
- REQ-002: The root manifest delegates the scripts `build`, `lint`, `format`, `format:check`, `test`, and `dev` to the workspaces.
- REQ-003: The machine configs exist and carry the conventions of QA 0.0220 to 0.0280: `.prettierrc` (K&R braces, 2 spaces, `printWidth` 120, single quotes, semicolons, trailing commas), `eslint.config.js` (`complexity` at 10, `@typescript-eslint/naming-convention`, `no-console`, `eslint-config-prettier`), and `tsconfig.json` with `strict: true`.
- REQ-004: A license-header drift gate (vitest) enumerates the in-scope files with `git ls-files`, applies the exemptions of QA 0.0290, and fails on any in-scope file without the two-line SPDX header (or without `"license": "AGPL-3.0-only"` for a `package.json`).
- REQ-005: CI and pre-commit run the same gates: lint, `format:check`, build, and test (CI with coverage), and their comments no longer mention Allman braces.
- REQ-006: The server starts over the stdio transport using the official MCP SDK, and writes nothing to stdout except protocol frames.
- REQ-007: The server exposes a `version` resource (server name and version) and a `config` resource (the effective configuration, including the absolute paths in use).
- REQ-008: The server logs JSON lines with pino to `./logs/server.log` (daily rotation, seven files kept) and to stderr, with `BPMN_MCP_LOG_FILE`, `BPMN_MCP_LOG_LEVEL`, `BPMN_MCP_LOG_ROTATE`, and `BPMN_MCP_LOG_RETAIN` as overrides.
- REQ-009: Configuration precedence is real environment (including `.env`, which never overrides a variable the real environment already provides), then `logging.json`, then built-in defaults; `.env` is loaded with Node's `process.loadEnvFile()` and a missing file is not an error.
- REQ-010: The documents root is `BPMN_MCP_DOCS_DIR` (default `./docs`) with the `prc` subdirectory hardcoded, so processes live in `docs/prc/`; resolving the path never creates a directory.
- REQ-011: An MCP-level test drives the server through the SDK `Client` on an in-memory transport and asserts the resource list, the `version` content, and the `config` content.

### Acceptance Criteria

- [ ] ACC-001: On a clean clone, `npm ci`, `npm run lint`, `npm run format:check`, `npm run build`, and `npm test -- --coverage` all pass from the repository root.
- [ ] ACC-002: The CI workflow is green on the pull request, and `pre-commit run --all-files` passes locally.
- [ ] ACC-003: A deliberately header-less in-scope file (a temporary fixture, not committed) makes the drift gate fail; the exempt paths of QA 0.0290 are not asserted.
- [ ] ACC-004: A temporary `console.log` in a source file makes `npm run lint` fail.
- [ ] ACC-005: A function with a cyclomatic complexity above 10 makes `npm run lint` fail.
- [ ] ACC-006: Starting the built server (`node apps/mcp-server/dist/index.js`) and listing its resources with the MCP inspector shows `version` and `config`; stdout carries only protocol frames.
- [ ] ACC-007: After a start, `./logs/server.log` exists in the working directory and contains JSON lines; the same lines appear on stderr.
- [ ] ACC-008: With `BPMN_MCP_DOCS_DIR` set to a temporary directory, the `config` resource reports the absolute path `<tmp>/prc`, and the directory is not created by reading the resource.
- [ ] ACC-009: A variable set in the real environment wins over the same key loaded from `.env`, and a variable set only in `.env` wins over the same key in `logging.json`.
- [ ] ACC-010: The MCP-level test passes without spawning a process.
- [ ] ACC-011: `npm run dev` starts a watch build (a source file edit is picked up without re-running the command).
- [ ] ACC-012: The interop spike of Task 110.100 succeeds: `bpmn-moddle` and `bpmnlint` load under Node 24 from the ESM TypeScript workspace layout, `bpmnlint` finds `bpmnlint:recommended` with hoisted dependencies, the MCP SDK registration API and its `zod` requirement are confirmed, and the bpmn-js dist-asset serving approach is confirmed; the result (pass, or which check failed) is recorded as a Progress → Updates entry before any further Phase 110 task starts.

### Scope

#### Included

- The root manifest, the lock file, `apps/mcp-server/` with its `package.json`, `tsconfig.json`, `eslint.config.js`, `src/`, `test/`, and `apps/mcp-server/logging.json`.
- The root `.prettierrc`, `.env.example`, and the `.gitignore`, `.node-version`, and Dependabot changes of Task 100.100 (see Task List).
- The `format:check` gate in CI and pre-commit, and the corrected comments in both.
- The license-header drift gate, the smoke test, and the MCP-level test.
- The server entry point, path resolution, configuration loading, logging, and the two resources.
- The interop spike that confirms the dependency choices (see Design Notes).

#### Explicitly Out Of Scope

- Every BPMN tool: `import`, `export`, `parse`, `validate`, `preview`, `create`, `change`.
- The `prc` artifact core (filename scheme, directory scan, checksum cache), which belongs to the next feature.
- OpenTelemetry instrumentation and the `precondition` and `postcondition` helpers; they arrive with the first code that uses them.
- The preview server and bpmn-js.
- Coverage thresholds, per-artifact locking, and the dependency-license gate.
- Stage 2 (live canvas) and an OpenCode plugin adapter.

### Dependencies

#### Depends On

- DEC fdc84432-1b48-4eb9-82e0-ec13cb8cf8ba: the Node/TypeScript MCP server decision.
- QA 818fac76-96fb-4e3c-acb8-e5520fab5913: the implementation Q&A, pairs 0.0030 to 0.0290. Pair 0.0300 (the SpecMgr-model path convention referenced in Design Notes) does not exist yet; this feature's own Task 100.120 adds it as part of the `docs:` commit, so it is a task of this feature, not a precondition for it.

#### Blocks

- The next feature: the `prc` artifact core with `import` and `export`.

### Design Notes

One pull request with these commits, in order: `chore:` (`.gitignore`, `.node-version`, Dependabot), `ci:` (the `format:check` gate, the Allman comments, the pre-commit `files:` gate), `docs:` (Q&A pair 0.0300, superseded markers, CONTRIBUTING, the requirement updates), and `feat:` (Phase 100 and Phase 110). Only the final state has to be green.

Phase 100 installs development dependencies only (`typescript`, `vitest`, `@vitest/coverage-v8`, `@types/node`, `eslint`, `typescript-eslint`, `prettier`, `eslint-config-prettier`). Runtime dependencies arrive in Phase 110 with the code that uses them (`@modelcontextprotocol/sdk`, `pino`, `pino-roll`, and `zod` if the SDK needs it as a peer), so no dependency sits unused and Dependabot stays quiet.

The drift gate lives in `apps/mcp-server/test/` as QA 0.0290 says, but reads the file list from `git ls-files` at the repository root, so it also covers the root configs and the Python scaffold. In-scope and exempt paths follow QA 0.0290 exactly. Documentation under `docs/` is exempt, so committed diagrams in `docs/prc/` need no header.

Paths follow the SpecMgr model (QA 0.0300). `BPMN_MCP_DOCS_DIR` is a root with a hardcoded per-type subdirectory, like `SPECMGR_DOCS_DIR`. The server expects the host to start it in the consuming repository, so relative defaults resolve against the working directory. There is no state directory and no registry. Logs go to `./logs`. Tests run with a temporary working directory and set `BPMN_MCP_DOCS_DIR`; no test-only override exists.

`no-console` is the machine gate for the rule that nothing writes to stdout. It does not cover third-party code that calls `console.log`, so ACC-006 checks stdout at runtime. The logger is constructed with explicit destinations (file and stderr), because pino writes to stdout by default.

Interop spike (first task of Phase 110, throwaway): load `bpmn-moddle` and `bpmnlint` under Node 24 from an ESM TypeScript project in the workspace layout, check that `bpmnlint` finds `bpmnlint:recommended` with hoisted dependencies, check the MCP SDK registration API and its `zod` requirement, and check how the bpmn-js dist assets can be served locally. A failure puts Option 1 of the decision record at risk; if any check fails, Task 110.100 stops, the failing check and its details are recorded as a Progress → Updates entry (and, if it blocks further work, as a Progress → Blockers entry) before any later Phase 110 task starts. The first two checks only need the libraries loaded; they add no dependency to the committed code in this feature unless the spike commits to them.

### Related Decisions

This section lists the artifacts this feature implements or is traced to (the "why", for anyone auditing the implementation); see Dependencies above for what this feature needs before it can start or is blocked on.

- DEC fdc84432-1b48-4eb9-82e0-ec13cb8cf8ba: Use a Node/TypeScript MCP Server for Agent-Driven BPMN Modeling -- this feature implements the scaffold half of Option 1, not yet its full Confirmation criterion (see Overview).
- QA 818fac76-96fb-4e3c-acb8-e5520fab5913: BPMN MCP Server Stage 1 Implementation Research Q&A -- source of the machine-gate conventions (pairs 0.0220-0.0290) and the logging/config design (0.0160-0.0170) this feature implements; this feature's Task 100.120 adds the new pair 0.0300.
- REQ 0caae3bd-b4e8-47c6-a417-520766031f27: The tool shall expose its functionality as a Model Context Protocol server

### Task List

#### Phase 100: Scaffold and Gates

- [ ] Task 100.100: Add the `chore:` commit: merged `.gitignore` (with `logs/`), `.node-version` (24), and the `github-actions` ecosystem in `dependabot.yml`.
- [ ] Task 100.110: Add the `ci:` commit: the `format:check` step in `ci.yml` and the pre-commit config, corrected Allman comments, and a pre-commit `files:` gate that also covers root configs and the Python scaffold.
- [ ] Task 100.120: Add the `docs:` commits: Q&A pair 0.0300, superseded markers in 0.0040, 0.0090, 0.0160, 0.0220, 1.0020, 1.0030, and 1.0080, the 1.0070 and 9.0010 fixes, CONTRIBUTING, and the five requirement updates.
- [ ] Task 100.130: Create the root `package.json` (private, workspaces, delegating scripts, `"license": "AGPL-3.0-only"`) and `apps/mcp-server/package.json`.
- [ ] Task 100.140: Create `tsconfig.json` (strict), `.prettierrc`, and `eslint.config.js` with `complexity`, `naming-convention`, and `no-console`.
- [ ] Task 100.150: Set up vitest and write the license-header drift gate and one smoke test.
- [ ] Task 100.160: Add `.env.example` and run `npm install` to commit the lock file.
- [ ] Task 100.170: Run all gates locally (ACC-001 to ACC-005) and fix findings.

#### Phase 110: Walking Skeleton

- [ ] Task 110.100: Run the interop spike (throwaway) and record the result (pass, or which check failed) as a Progress → Updates entry (ACC-012); stop and report if a check fails before starting any later task in this phase.
- [ ] Task 110.110: Add the runtime dependencies and implement path resolution (`BPMN_MCP_DOCS_DIR`, hardcoded `prc`, no directory creation) and configuration loading (`.env`, `logging.json`, defaults, precedence).
- [ ] Task 110.120: Implement logging with pino and pino-roll (file and stderr, never stdout) and `logging.json`.
- [ ] Task 110.130: Implement the server entry point over stdio, with the `version` and `config` resources.
- [ ] Task 110.140: Write unit tests for path resolution, configuration precedence, and logging destinations.
- [ ] Task 110.150: Write the MCP-level test with the SDK `Client` on an in-memory transport (ACC-010).
- [ ] Task 110.160: Verify ACC-006 to ACC-009 and ACC-011 manually with the MCP inspector and temporary directories.
- [ ] Task 110.170: Update CONTRIBUTING (commands, variables, working-directory assumption) and open the pull request.

## Progress

### Current Status

**As of 2026-10-29**: Planned, not started. The design is settled in the planning conversation and is recorded in Q&A pair 0.0300, which the first documentation commit adds.

### Blockers

None.

### Updates

<!-- Newest entry first -- prepend new entries directly below this comment. -->

#### 2026-10-29 10:13:26.433Z - Created

Feature plan drafted for the first pull request: scaffold with real gates (Phase 100) and the walking skeleton (Phase 110).

### Decisions Made

<!-- Newest entry first -- prepend new entries directly below this comment. -->

#### 2026-10-29 10:13:26.433Z - One pull request, CI green

Phases 100 and 110 ship in one pull request because a pull request that leaves CI red is not acceptable. Runtime dependencies are added in Phase 110 only, with the code that uses them.

### Related PRs / Commits

- [Issue #1](https://github.com/dfch/biz.dfch.BpmnMcp/issues/1): Create an MCP server for BPMN 2.0 modeling with a local browser viewer interface.

### More Information

The later phases (the `prc` artifact core with `import` and `export`, the remaining tools, and hardening) are separate features.
