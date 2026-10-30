---
classification: null
created: '2026-10-29T11:13:26.433+01:00'
id: feat-1-bpmn-mcp-scaffold
status: planning
type: feat
updated: '2026-10-30T08:55:25.860+01:00'
version: 1.0.0
---

# Feature: Scaffold and Walking Skeleton for the BPMN MCP Server

## Plan

### Overview

The repository holds specifications and conventions, but no implementation. Every gate that CONSTITUTION principle 3 and CONTRIBUTING describe (ESLint, Prettier, tsc, vitest, the license-header drift gate) exists only as prose, and CI fails today because `npm ci` has no `package.json` to read. This feature closes that gap in two phases within one pull request that leaves CI green. Phase 100 creates the npm-workspaces scaffold so that every gate runs for real, and ends with a throwaway interop spike that confirms the Phase 110 dependency choices before anything beyond the scaffold is committed. Phase 110 adds the walking skeleton: an MCP server over stdio that exposes the `version` and `config` resources, logs to a file and to stderr, resolves its paths, and is verified through an in-memory MCP client test. The BPMN tools (`import`, `export`, and the rest) are not part of this feature, and neither is the browser preview server; this feature is only the scaffold-and-skeleton slice of the decision record's Confirmation criterion and of QA pair 1.0070's "first increment" (resources plus `import`/`export`/logging) -- both are satisfied only once the next feature (see Dependencies, Blocks) ships.

### Requirements

- REQ-001: The repository root is a private npm-workspaces manifest (`workspaces: ["apps/*", "packages/*"]`, `"engines": {"node": ">=24"}`) with a committed `package-lock.json`, and the only component is `apps/mcp-server/` (package name `biz.dfch.bpmnmcp`, with a `bin` entry pointing at `dist/index.js`).
- REQ-002: The root manifest delegates the scripts `build`, `lint`, `format`, `format:check`, `test`, and `dev` to the workspaces; the root `test` script forwards extra arguments to the workspace's vitest invocation (e.g. `npm test -- --coverage` actually runs vitest with coverage, not an npm flag that is silently swallowed).
- REQ-003: The machine configs exist and carry the conventions of QA 0.0220 to 0.0280: a root `.prettierrc` (K&R braces, 2 spaces, `printWidth` 120, single quotes, semicolons, trailing commas) plus a root `.prettierignore` (generated output, lockfiles, `docs/` content mdformat already owns, and the historical session transcript), a per-component `eslint.config.js` (`complexity` at 10, `@typescript-eslint/naming-convention`, `no-console`, `eslint-config-prettier`), and a per-component `tsconfig.json` with `strict: true`, both living in `apps/mcp-server/`.
- REQ-004: A license-header drift gate (vitest, resolving the repository root independent of the test runner's working directory) enumerates the in-scope files with `git ls-files --cached --others --exclude-standard` (tracked and staged files alike, so an uncommitted fixture is still seen), applies the exemptions of QA 0.0290 once its now-superseded `diagrams/` entry is dropped (see Design Notes) and an explicit extension/path list for every new file type this feature adds (`.gitignore`, `.node-version`, `.env.example`, `.prettierrc`, `.prettierignore`, `eslint.config.js`, `apps/mcp-server/logging.json`), and fails on any in-scope file without the two-line SPDX header (or without `"license": "AGPL-3.0-only"` for a `package.json`).
- REQ-005: CI and pre-commit run the same gates -- lint, `format:check`, build, and test (CI with coverage) -- over the same file scope: the pre-commit `files:` pattern widens to also match the root configs (`.prettierrc`, `.prettierignore`, `eslint.config.js`, `.gitignore`, `.node-version`) and a new `format:check` hook is added; neither workflow's comments mention Allman braces any longer.
- REQ-006: The server starts over the stdio transport using the official MCP SDK, and writes nothing to stdout except protocol frames.
- REQ-007: The server exposes a `version` MCP resource (the server's name and version, mirroring `specmgr://version`) and a `config` MCP resource (mirroring `specmgr://config`): the effective log destination, level, and rotation (REQ-008), the OTel endpoint state (always "disabled" in this feature, since instrumentation is out of scope), the resolved `docs`/`prc` paths (REQ-010) as absolute paths, and the bpmnlint preset name (reported as "not yet configured", since bpmnlint is out of scope).
- REQ-008: The server logs JSON lines with pino, through `pino-roll`, to a rolling file under `./logs` (base name `server`, daily rotation, `pino-roll`'s own `<base>.<date>.<count>.<ext>` naming -- the exact rotated-file name and the `limit.count` value needed to keep seven files total, active file included, are confirmed by the Task 100.165 interop spike, not assumed up front) and to stderr, with `BPMN_MCP_LOG_FILE`, `BPMN_MCP_LOG_LEVEL`, `BPMN_MCP_LOG_ROTATE`, and `BPMN_MCP_LOG_RETAIN` as overrides.
- REQ-009: Configuration precedence is real environment (including `.env`, which never overrides a variable the real environment already provides), then `logging.json`, then built-in defaults; `.env` is loaded with Node's `process.loadEnvFile()`, and a missing `.env` or a missing `logging.json` is not an error (both tiers simply fall through to the next).
- REQ-010: The documents root is `BPMN_MCP_DOCS_DIR` (default `./docs`) with the `prc` subdirectory hardcoded, so processes live in `docs/prc/`; resolving the path never creates a directory. This feature does not read or write anything under `docs/prc/`: the directory inventory, the `prc-<uuid>-<slug>.bpmn` filename scheme, and the checksum cache are the next feature's job (see Scope, Dependencies); this feature only resolves and reports the path.
- REQ-011: An MCP-level test drives the server through the SDK `Client` on an in-memory transport and asserts the resource list, the `version` content, and the `config` content.

### Acceptance Criteria

- [x] ACC-001: On a clean clone, `npm ci`, `npm run lint`, `npm run format:check`, `npm run build`, and `npm test -- --coverage` all pass from the repository root, and the last command's output includes a coverage summary (proving the flag reached vitest, not npm).
- [ ] ACC-002: The CI workflow is green on the pull request, and `pre-commit run --all-files` passes locally.
- [x] ACC-003: A deliberately header-less in-scope file, staged but not committed (`git add` only), makes the drift gate fail; the exempt paths of QA 0.0290 are not asserted.
- [x] ACC-004: A temporary `console.log` in a source file makes `npm run lint` fail.
- [x] ACC-005: A function with a cyclomatic complexity above 10 makes `npm run lint` fail.
- [ ] ACC-006: Starting the built server (`node apps/mcp-server/dist/index.js`) and listing its resources with the MCP inspector shows `version` and `config`; stdout carries only protocol frames.
- [ ] ACC-007: After a start, the active log file exists under `./logs` (named per the scheme ACC-012's spike confirms) and contains JSON lines; the same lines appear on stderr.
- [ ] ACC-008: With `BPMN_MCP_DOCS_DIR` set to a temporary directory, the `config` resource reports the absolute path `<tmp>/prc`, and the directory is not created by reading the resource.
- [ ] ACC-009: A variable set in the real environment wins over the same key loaded from `.env`, and a variable set only in `.env` wins over the same key in `logging.json`; a clone with neither a `.env` nor a `logging.json` present still starts, using only built-in defaults.
- [ ] ACC-010: The MCP-level test passes without spawning a process.
- [ ] ACC-011: `npm run dev` starts a watch build (a source file edit is picked up without re-running the command).
- [x] ACC-012: The interop spike of Task 100.165 succeeds: `bpmn-moddle` and `bpmnlint` load under Node 24 from the ESM TypeScript workspace layout, `bpmnlint` finds `bpmnlint:recommended` with hoisted dependencies, the MCP SDK registration API and whether it needs `zod` as a peer are confirmed, `pino-roll`'s actual rotated-file naming and the `limit.count` value needed for "seven files total" are confirmed under Node 24 with a stderr multistream, and the bpmn-js dist-asset serving approach is confirmed; the result (pass, or which check failed) is recorded as a Progress → Updates entry, and no `feat:` commit is made (Phase 100's scaffold stays local/uncommitted beyond the earlier `chore:`/`ci:`/`docs:` commits) until this acceptance criterion is green.
- [x] ACC-013: The repository's `.gitignore`, after Task 100.100, no longer references `diagrams/` anywhere, and `BPMN_MCP_DOCS_DIR`'s resolved path is the only runtime artifact location this feature's tests assert (besides `./logs`).

### Scope

#### Included

- The root manifest, the lock file, `apps/mcp-server/` with its `package.json`, `tsconfig.json`, `eslint.config.js`, `src/`, `test/`, and `apps/mcp-server/logging.json`.
- The root `.prettierrc`, `.prettierignore`, `.env.example`, and the `.gitignore`, `.node-version`, and Dependabot changes of Task 100.100 (see Task List).
- The `format:check` gate in CI and pre-commit, the widened pre-commit `files:` scope, and the corrected comments in both.
- The license-header drift gate, the smoke test, and the MCP-level test.
- The server entry point, path resolution, configuration loading, logging, and the two resources.
- The interop spike that confirms the dependency choices, including the `pino-roll` naming/retention check (see Design Notes).
- The `docs:` commit's requirement/Q&A updates (see Design Notes and Task 100.120), and the pull request itself.

#### Explicitly Out Of Scope

- Every BPMN tool: `import`, `export`, `parse`, `validate`, `preview`, `create`, `change`.
- The `prc` artifact core: the `prc-<uuid>-<slug>.bpmn` filename scheme, the directory scan that builds the process inventory from it, and the checksum cache -- all of this belongs to the next feature. This feature only records the filename-scheme decision (QA pair 0.0300, Design Notes) so the next feature does not have to re-elicit it; it implements none of it.
- OpenTelemetry instrumentation and the `precondition` and `postcondition` helpers; they arrive with the first code that uses them.
- The preview server and bpmn-js.
- Coverage thresholds, per-artifact locking, and the dependency-license gate.
- Stage 2 (live canvas) and an OpenCode plugin adapter.

### Dependencies

#### Depends On

- DEC fdc84432-1b48-4eb9-82e0-ec13cb8cf8ba: the Node/TypeScript MCP server decision.
- QA 818fac76-96fb-4e3c-acb8-e5520fab5913: the implementation Q&A, pairs 0.0030 to 0.0290, plus pairs 1.0020, 1.0030, 1.0070, and 1.0080 (the state/registry/UUID design this feature's Task 100.120 corrects -- see Design Notes). Pair 0.0300 (the SpecMgr-model path convention and the `prc` filename scheme referenced in Design Notes) does not exist yet; this feature's own Task 100.120 adds it as part of the `docs:` commit, so it is a task of this feature, not a precondition for it.

#### Blocks

- The next feature: the `prc` artifact core with `import` and `export`, built on the filename scheme this feature's `docs:` commit records.

### Design Notes

One pull request with these commits, in order: `chore:` (`.gitignore`, `.node-version`, Dependabot), `ci:` (the `format:check` gate, the Allman comments, the pre-commit `files:` gate), `docs:` (Q&A pair 0.0300, the superseded-in-part markers, CONTRIBUTING, `AGENTS.md`), then the Phase 100 scaffold is built and the interop spike (Task 100.165) is run against it -- locally, uncommitted -- and only once it is green does `feat:` (Phase 100 and Phase 110 together) get committed. If the spike fails, this pull request still ships `chore:`/`ci:`/`docs:` on their own (CI stays green on just those, since they touch no `apps/mcp-server` code yet), and the scaffold/skeleton work continues in a follow-up: no half-built, committed skeleton is ever left behind. Only the final state has to be green.

Phase 100 installs development dependencies only (`typescript`, `vitest`, `@vitest/coverage-v8`, `@types/node`, `eslint`, `typescript-eslint`, `prettier`, `eslint-config-prettier`). Runtime dependencies arrive in Phase 110 with the code that uses them (`@modelcontextprotocol/sdk`, `pino`, `pino-roll`, and `zod` if the spike confirms the SDK needs it, or if it otherwise helps -- e.g. as the validation layer for tool input once tools exist), so no dependency sits unused and Dependabot stays quiet. The interop spike itself installs `bpmn-moddle`/`bpmnlint`/`zod` ad hoc, outside `package.json`, purely to exercise them under Node 24 in the workspace layout; none of the three become a committed dependency through the spike alone.

**Why zod, if it comes up**: `zod` is a TypeScript runtime-schema-validation library. It is not a requirement from this repository's elicitation; QA pair 0.0200 records an agent's recommendation (compile-time `tsc` types vanish at runtime, and the official MCP SDK's tool-registration helper takes a zod schema as a tool's input definition, so using it validates every tool call at the protocol boundary). This feature ships no tools, so nothing here uses zod yet; whether the MCP SDK pulls it in as a peer dependency regardless is exactly what Task 100.165 checks, and QA pair 0.0200's "added to the dependency set" wording is superseded accordingly (see below) to "added when the code that needs it lands".

**No `diagrams/` runtime directory, no registry file**: the file path model is `BPMN_MCP_DOCS_DIR` / `docs/prc/` (REQ-010), scanned directly -- there is no `diagrams/` directory and no `registry.json`. QA pairs 0.0040, 0.0120, and 0.0290 all still mention `diagrams/` as a runtime directory from the superseded single-diagram design (0.0040 in its project-layout prose, 0.0120 in its gitignored-runtime-artifacts list and shown `.gitignore` template, 0.0290 in its exempt-generated-artifact list); Task 100.120 corrects all three and the repository's actual `.gitignore` never gains a `diagrams/` line (see ACC-013). Dropping the registry **only** removes the `registry.json` file and its checksum-cache bookkeeping -- it does not remove process identification by UUID: pairs 1.0070/1.0080's "every process gets a UUID" and the `.../processes/<uuid>` preview URL scheme (4.0010) stand, because the UUID will instead live in the process's own filename. Task 100.120 records that filename scheme as the new QA pair 0.0300: `prc-<uuid>-<slug>.bpmn` under `docs/prc/`, matching this repository's own `<type>-<uuid>-<slug>` convention for its specification documents (`req-...`, `dec-...`, `qa-...`). The directory listing is then the inventory; no separate registry file is needed. Pair 1.0070 is corrected to drop "registered path" in favor of this filename scheme. Pair 9.0010 (export overwrites the target file only when an explicit path is given) was re-read and needs no change -- it was already explicit-path-only and never mentioned a registered path; it is not part of Task 100.120. None of this is implemented in this feature (see Scope); it is recorded now so the next feature does not re-derive it.

The drift gate lives in `apps/mcp-server/test/` as QA 0.0290 says, but reads the file list from the repository root (resolved via `import.meta.url`, not the test runner's working directory) with `git ls-files --cached --others --exclude-standard`, so it also covers the root configs, the Python scaffold, and any staged-but-uncommitted fixture (ACC-003). In-scope and exempt paths follow QA 0.0290, amended by this feature's new file types (REQ-004) and by dropping `diagrams/` from the exemption list (immediately above). Documentation under `docs/` is exempt, so committed diagrams in `docs/prc/` need no header.

Paths follow the SpecMgr model (QA 0.0300). `BPMN_MCP_DOCS_DIR` is a root with a hardcoded per-type subdirectory, like `SPECMGR_DOCS_DIR`. The server expects the host to start it in the consuming repository, so relative defaults resolve against the working directory. Logs go to `./logs`. Tests run with a temporary working directory and set `BPMN_MCP_DOCS_DIR`; no test-only override exists.

`no-console` is the machine gate for the rule that nothing writes to stdout. It does not cover third-party code that calls `console.log`, so ACC-006 (and, where practical, an automated spawn-based test) checks stdout at runtime. The logger is constructed with explicit destinations (file and stderr via `pino.multistream`), because pino writes to stdout by default.

Interop spike (Task 100.165, throwaway, run against the Phase 100 scaffold before any `feat:` commit -- see the commit-order paragraph above): load `bpmn-moddle` and `bpmnlint` under Node 24 from an ESM TypeScript project in the workspace layout; check that `bpmnlint` finds `bpmnlint:recommended` with hoisted dependencies; check the MCP SDK registration API and whether it needs `zod` as a peer; check `pino-roll`'s actual rotated-file naming (its documented `<base>.<date>.<count>.<ext>` scheme) and the `limit.count` value needed to keep seven files total (active file included) under a `pino.multistream` with a stderr stream on Node 24; and check how the bpmn-js dist assets can be served locally. A failure puts Option 1 of the decision record at risk; if any check fails, Task 100.165 stops, the failing check and its details are recorded as a Progress → Updates entry (and, if it blocks further work, as a Progress → Blockers entry), and no `feat:` commit is made.

### Related Decisions

This section lists the artifacts this feature implements or is traced to (the "why", for anyone auditing the implementation); see Dependencies above for what this feature needs before it can start or is blocked on.

- DEC fdc84432-1b48-4eb9-82e0-ec13cb8cf8ba: Use a Node/TypeScript MCP Server for Agent-Driven BPMN Modeling -- this feature implements the scaffold half of Option 1, not yet its full Confirmation criterion (see Overview).
- QA 818fac76-96fb-4e3c-acb8-e5520fab5913: BPMN MCP Server Stage 1 Implementation Research Q&A -- source of the machine-gate conventions (pairs 0.0220-0.0290) and the logging/config design (0.0160-0.0170) this feature implements; this feature's Task 100.120 adds the new pair 0.0300 and corrects the now-superseded registry/`diagrams/` wording in pairs 0.0030 (the "trivial placeholder tool" this feature does not ship), 0.0040, 0.0120, 0.0200, 0.0290, 1.0020, 1.0030, 1.0070, and 1.0080. Pairs 0.0090, 0.0160, and 0.0220 were checked and need no change (none mention diagrams, a registry, or zod); pair 9.0010 likewise needs no change (see Design Notes).
- REQ 0caae3bd-b4e8-47c6-a417-520766031f27: The tool shall expose its functionality as a Model Context Protocol server

### Task List

#### Phase 100: Scaffold, Gates, and the Interop Spike

- [x] Task 100.100: Add the `chore:` commit: merged `.gitignore` (with `logs/`, and no `diagrams/` line), `.node-version` (24), and the `github-actions` ecosystem in `dependabot.yml`.
- [x] Task 100.110: Add the `ci:` commit: the `format:check` step in `ci.yml` and the pre-commit config, corrected Allman comments, and a pre-commit `files:` gate widened to also cover the root configs and the Python scaffold.
- [x] Task 100.120: Add the `docs:` commits (REQ-004, Dependencies): Q&A pair 0.0300 (path model and the `prc-<uuid>-<slug>.bpmn` filename scheme); superseded-in-part markers in 0.0030 (the "trivial placeholder tool" this feature does not ship), 0.0040, 0.0120, 0.0200, 0.0290, 1.0020, 1.0030, and 1.0080 (registry/`diagrams/` wording only -- UUID identification stays); the 1.0070 fix ("registered path" -> the filename scheme); `AGENTS.md`'s stale `diagrams/`/in-memory-diagram wording; and CONTRIBUTING. No REQ document's content changes for this feature (none reference diagrams, a registry, or UUIDs; `list_references` shows only REQ 0caae3bd linked to this feature already) and pairs 0.0090, 0.0160, 0.0220, and 9.0010 need no change -- none are part of this task.
- [x] Task 100.130: Create the root `package.json` (private, workspaces, `engines.node`, delegating scripts including the argument-forwarding `test` script, `"license": "AGPL-3.0-only"`) and `apps/mcp-server/package.json` (with its `bin` entry).
- [x] Task 100.140: Create `apps/mcp-server/tsconfig.json` (strict, `include` covering at least `test/` so an empty `src/` still type-checks), the root `.prettierrc` and `.prettierignore`, and `apps/mcp-server/eslint.config.js` with `complexity`, `naming-convention`, and `no-console`.
- [x] Task 100.150: Set up vitest (root config resolving the repository root via `import.meta.url`) and write the license-header drift gate (REQ-004) and one smoke test (a placeholder source file so Task 100.170's `build`/`lint` have something to check).
- [x] Task 100.160: Add `.env.example` and run `npm install` to commit the lock file.
- [x] Task 100.165: Run the interop spike (ACC-012) against the scaffold from Tasks 100.130-100.160 and record the result as a Progress → Updates entry; stop and report if a check fails -- no `feat:` commit follows until this passes.
- [x] Task 100.170: Run all gates locally (ACC-001 to ACC-005, ACC-013) and fix findings.

#### Phase 110: Walking Skeleton

- [ ] Task 110.100: Add the runtime dependencies confirmed by Task 100.165 and implement path resolution (REQ-010: `BPMN_MCP_DOCS_DIR`, hardcoded `prc`, no directory creation) and configuration loading (REQ-009: `.env`, `logging.json`, defaults, precedence, missing-file tolerance).
- [ ] Task 110.110: Implement logging (REQ-008) with pino and `pino-roll`, using the naming/retention values Task 100.165 confirmed (file and stderr via `pino.multistream`, never stdout) and `logging.json`.
- [ ] Task 110.120: Implement the server entry point over stdio (REQ-006), with the `version` and `config` resources (REQ-007).
- [ ] Task 110.130: Write unit tests for path resolution, configuration precedence (including the missing-`.env`/missing-`logging.json` cases), and logging destinations.
- [ ] Task 110.140: Write the MCP-level test (REQ-011) with the SDK `Client` on an in-memory transport (ACC-010), and, where practical, automated spawn-based tests for ACC-006/007/008/009's runtime behavior in place of a manual check.
- [ ] Task 110.150: Verify, manually with the MCP inspector and temporary directories, whatever ACC-006 to ACC-009 and ACC-011 behavior Task 110.140 could not automate.
- [ ] Task 110.160: Update CONTRIBUTING (commands, variables, working-directory assumption) and open the pull request.

## Progress

### Current Status

**As of 2026-10-29**: Planned, not started. The design is settled in the planning conversation and is recorded in Q&A pair 0.0300, which the first documentation commit adds.

### Blockers

None.

### Updates

<!-- Newest entry first -- prepend new entries directly below this comment. -->

#### 2026-10-30 09:20:00.000Z - Phase 100 complete: scaffold built, gates green

Built the npm-workspaces scaffold (Tasks 100.130-100.160): root `package.json` (private, `workspaces: ["apps/*", "packages/*"]`, `engines.node >=24`, `license: AGPL-3.0-only`, delegating `build`/`lint`/`format`/`format:check`/`test`/`dev` scripts, the `test` script forwarding extra args via `npm run test --workspace=apps/mcp-server --`), `apps/mcp-server/package.json` (`biz.dfch.bpmnmcp`, `bin` -> `dist/index.js`, ESM `type: module`), `apps/mcp-server/tsconfig.json` (`strict: true`, NodeNext ESM, `include` covering `src/` and `test/`), the root `.prettierrc`/`.prettierignore`, `apps/mcp-server/eslint.config.js` (flat config, typescript-eslint, `complexity: 10`, `@typescript-eslint/naming-convention`, `no-console: error`, `eslint-config-prettier` last), `apps/mcp-server/vitest.config.ts`, the license-header drift gate (`apps/mcp-server/test/license-header.test.ts`, resolving the repo root via `import.meta.url` and `git ls-files --cached --others --exclude-standard`, amended per QA 0.0290 as corrected -- no `diagrams/` exemption, explicit coverage for `.gitignore`/`.node-version`/`.env.example`/`.prettierrc`/`.prettierignore`/`eslint.config.js`/future `logging.json`), a trivial placeholder source file (`apps/mcp-server/src/placeholder.ts`, a `greet()` function) plus its smoke test, `.env.example` (documenting `BPMN_MCP_LOG_*`, `BPMN_MCP_DOCS_DIR`, and the OTel env vars as disabled placeholders), and the generated `package-lock.json`. Applying `npm run format:check` to the pre-existing `.github/dependabot.yml`, `.github/workflows/ci.yml`, and `AGENTS.md` required a cosmetic Prettier reformat (single quotes, indentation) of those three files -- no content change.

#### 2026-10-30 09:15:00.000Z - Interop spike (Task 100.165/ACC-012): all five checks passed

Ran the Task 100.165 interop spike ad hoc in `/tmp/opencode/interop-spike` (a scratch npm project outside the repository, `npm install --save` there only -- nothing landed in the committed root/`apps/mcp-server` `package.json` or lockfile from the spike). Node v24.22.1, npm 11.19.1.

1. **bpmn-moddle / bpmnlint load under Node 24 ESM**: PASS. `bpmn-moddle@10.3.1` is a pure-ESM package (`"type": "module"`, `exports["."] = "./dist/index.js"`) exporting the **named** export `BpmnModdle` (not `default` -- `import { BpmnModdle } from 'bpmn-moddle'`). Parsing and serializing a minimal BPMN 2.0 XML document round-tripped successfully. `bpmnlint@12.0.0` is CJS (`main: lib/index.js`, no `"type": "module"`), loaded fine from an ESM project via its `exports` map (e.g. `import Linter from 'bpmnlint/lib/linter.js'`) -- Node's CJS/ESM interop handled it transparently, no `createRequire` needed.
2. **`bpmnlint:recommended` with hoisted dependencies**: PASS. The preset ships inside the `bpmnlint` package itself at `bpmnlint/config/recommended.js` (not a separate npm package) and resolves via `bpmnlint/lib/resolver/node-resolver.js`'s `NodeResolver`; linting a minimal process produced real findings (`end-event-required`, `label-required`), confirming the resolver and preset both work under a single hoisted `node_modules/`.
3. **MCP SDK registration API and the zod peer**: PASS, and **zod is a mandatory (non-optional) peer dependency** of `@modelcontextprotocol/sdk@1.32.2` (`peerDependencies.zod: "^3.25 || ^4.0"`, `peerDependenciesMeta.zod.optional: false`; `@cfworker/json-schema` is the only optional peer). The registration API: `server.registerResource(name, uri, metadata, handler)` for resources (handler returns `{ contents: [{ uri, text }] }`), and `server.registerTool(name, { title, description, inputSchema: <zod-shape> }, handler)` for tools, where `inputSchema` is a plain object of zod schemas (not a `z.object(...)` wrapper). Verified end to end: a `version` resource and an `echo` tool, driven through `InMemoryTransport.createLinkedPair()` and the SDK `Client` (`listResources`, `readResource`, `callTool`) -- all returned the expected shapes. **Consequence for Phase 110**: `zod` must be added as a committed runtime dependency alongside `@modelcontextprotocol/sdk`, since the SDK will not function without it.
4. **`pino-roll`'s rotated-file naming and the `limit.count` value for seven files total**: PASS, pinned precisely. `pino-roll@4.0.0`'s actual naming scheme (confirmed by writing through it and inspecting the files on disk, not assumed): with no `dateFormat` option set, rotated files are named **`<base>.<count>.<ext>`** (e.g. `server.1.log`, `server.2.log`, ...) -- **no date segment appears** unless `dateFormat` is explicitly configured (the README's `prod.2025-08-19.1.log` example only applies when `dateFormat` is set); with `frequency: 'daily'` and no `dateFormat`, a single write produced exactly `server.1.log`. Forcing rapid rotation (`frequency: 100` ms, 12 writes 150ms apart) with **`limit: { count: 6 }`** left exactly **7 files on disk** (`server.15.log` through `server.21.log` in that run) -- confirming `limit.count` is "rotated files to keep _in addition to_ the active file" (the README's own wording), so **`limit.count: 6` is the value that yields seven files total, active file included** (REQ-008's "seven files kept" default). Also confirmed `pino.multistream([{ stream: fileStream }, { stream: process.stderr }])` works correctly with a `pino-roll`-built stream as one of the multistream destinations (both the file and stderr received the same JSON line).
5. **bpmn-js dist asset serving**: PASS. `bpmn-js@18.31.1`'s published package ships a plain `dist/` directory with `bpmn-viewer.development.js` (580 KB) and `bpmn-viewer.production.min.js` (186 KB) as self-contained, directly servable static JS files (plus `bpmn-modeler.*` and `bpmn-navigated-viewer.*` variants, out of scope here), and `dist/assets/` with `bpmn-js.css`, `diagram-js.css`, and the `bpmn-font/` icon font -- all plain static files a Node `http` server can serve with no build step.

All five checks passed; ACC-012 is satisfied. No check failed, so Task 100.170's gate and the `feat:` commit proceed.

#### 2026-10-30 08:50:00.000Z - Corrected the docs: commit scope (Task 100.120)

Re-derived Task 100.120's supersede list from the actual zod/registry/filename-scheme decisions, instead of carrying the prior list forward unchecked. Dropped 0.0090 (multi-component layout), 0.0160 (log config), and 0.0220 (linter/Allman choice) -- none mention diagrams, a registry, or zod, and 0.0220 already carries its own supersede marker from before this feature existed. Dropped 9.0010 -- re-read, it was already explicit-path-only and never mentioned a "registered path", so it needs no correction. Added 0.0290 and 0.0040 explicitly to the stated `diagrams/` corrections (0.0290's exempt-generated-artifact list, 0.0040's project-layout prose), which the prior wording implied but did not spell out. Dropped "the five requirement updates" entirely: no REQ document's content references diagrams, a registry, or UUIDs, and `list_references` confirms only REQ 0caae3bd is linked to this feature -- there was never a concrete set of five updates behind that phrase.

#### 2026-10-29 16:00:00.000Z - Refined after feat-refiner review

Applied the errors, gaps, and discrepancies found by a `feat-refiner` pass: fixed the drift-gate file enumeration and the `npm test -- --coverage` argument-forwarding risk, replaced the assumed `pino-roll` file name and retention count with a spike-verified value, scoped `format:check`/the drift gate's new-file-type rule, filled in the `config` resource's fields, added missing acceptance criteria and REQ/ACC cross-references, named the `docs:` commit's scope, moved the interop spike ahead of any `feat:` commit (Task 100.165, so a spike failure never leaves a committed skeleton), and resolved several QA 818fac76 discrepancies: corrected pairs 0.0120/0.0290's stale `diagrams/` wording (the registry and its runtime directory are dropped, but UUID process identification is not -- it moves into the `prc-<uuid>-<slug>.bpmn` filename, recorded as part of the new pair 0.0300), left zod's adoption conditional on whether the MCP SDK needs it or it otherwise helps (no change to the decision, only to pair 0.0200's wording once Task 100.120 lands), and added the missing QA dependency pairs (1.0020/1.0030/1.0070/1.0080/9.0010) to Depends On.

#### 2026-10-29 10:13:26.433Z - Created

Feature plan drafted for the first pull request: scaffold with real gates (Phase 100) and the walking skeleton (Phase 110).

### Decisions Made

<!-- Newest entry first -- prepend new entries directly below this comment. -->

#### 2026-10-29 16:00:00.000Z - Filename scheme carries the UUID; no registry file

Dropping the registry file (`diagrams/registry.json`) and its `diagrams/` runtime directory does not drop UUID process identification: each process file is named `prc-<uuid>-<slug>.bpmn` under `docs/prc/`, matching this repository's own `<type>-<uuid>-<slug>` convention, so a directory scan is the inventory. This feature only records the scheme (QA pair 0.0300); implementing the scan and the filename scheme is the next feature's job.

#### 2026-10-29 10:13:26.433Z - One pull request, CI green

Phases 100 and 110 ship in one pull request because a pull request that leaves CI red is not acceptable. Runtime dependencies are added in Phase 110 only, with the code that uses them.

### Related PRs / Commits

- [Issue #1](https://github.com/dfch/biz.dfch.BpmnMcp/issues/1): Create an MCP server for BPMN 2.0 modeling with a local browser viewer interface.

### More Information

The later phases (the `prc` artifact core with `import` and `export`, the remaining tools, and hardening) are separate features.
