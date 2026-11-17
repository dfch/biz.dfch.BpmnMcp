---
classification: null
created: '2026-11-01T13:06:50.041+01:00'
id: feat-11-npm-publish-mcp-registry
status: planning
type: feat
updated: '2026-11-17T15:08:17.433+01:00'
version: 1.0.0
---

# Feature: npm and MCP Registry Publishing for the MCP Server

## Plan

### Overview

feat-1 delivered the scaffold, the gates, and the walking-skeleton server; feat-2 delivered the `prc` artifact core and the `import`/`export` tools (PR #10, merged as `bed6cab`). The server is currently consumable only from a local checkout (`node apps/mcp-server/dist/index.js`). This feature makes it distributable in the same shape as the sibling repo `biz.dfch.SpecMgr`: a published **npm package** (the `npx` counterpart of the sibling's `uvx biz-dfch-specmgr`), a **GitHub Release** carrying the packed tarball, and an entry in the official **MCP Registry** (`registry.modelcontextprotocol.io`) driven by a hand-maintained `server.json` at the repository root — all published by one tag-driven workflow. Scope: the packaging gaps in `apps/mcp-server/package.json` (the private flag, the `files` whitelist including `logging.json`, metadata, a `prepack` pipeline that adds the shebang and exec bit to build output only, a package README), the `server.json` manifest plus a bidirectional drift test (manifest ↔ package, manifest env vars ↔ the vars actually read in `src/`, offline validation against a vendored schema copy), `publish.yml` (gate re-run + tag/version consistency → npm publish → GitHub Release → `mcp-publisher` to the MCP Registry via GitHub OIDC), `CHANGELOG.md` + the release procedure in CONTRIBUTING, the README badge, and the first public publish (v0.1.0). Anchored in GitHub issue #11. All of the remaining Stage 1 tools have since been delivered (feat-17/18/19/20, PR #21–#24, all `done`), the Stage 1 tool surface is complete, and this feature packages and publishes that complete surface.

### Requirements

- REQ-001: `apps/mcp-server/package.json` is publishable: `"private"` removed; `"files": ["dist", "logging.json"]` added (`logging.json` is the committed component config that ships with the code per `config.ts` — a tarball without it would silently fall npm consumers back to the built-in defaults); `description`, `keywords` (`mcp`, `model-context-protocol`, `bpmn`, `bpmn-io`), and `repository` added; the `license` (`AGPL-3.0-only`, already gate-asserted), `bin` (`biz.dfch.bpmnmcp` → `dist/index.js`), and `engines` (`node >= 26`, the manifest's current floor per DEC 5185d651-7283-4b1d-87e0-272795d15edf, feat-12) entries are kept.
- REQ-002: A `prepack` pipeline (new `apps/mcp-server/scripts/prepare-publish.mjs`, two-line SPDX header) runs `npm run build`, then post-processes build output only: prepends `#!/usr/bin/env node` to `dist/index.js` when absent, sets the exec bit, and copies the repository-root `LICENSE` into the package directory (npm auto-includes `LICENSE` only from the package directory; AGPL requires the license text to travel with the distributed package). No source file is ever touched — the license drift gate keeps asserting the SPDX header on lines 0/1 of every in-scope source (`dist/` is exempt, which is what makes this safe).
- REQ-003: The published tarball (`npm pack` / `npm publish --dry-run`) contains exactly: `package.json`, the package `README.md`, `LICENSE`, `dist/**` (with the shebang-ed `index.js`), and `logging.json` — and nothing else (no `src/`, `test/`, fixtures, `tsconfig*`, `vitest.config.ts`, `eslint.config.js`, `coverage/`, `node_modules`). A test leg pins the set.
- REQ-004: The packed artifact works standalone in a clean environment: a test leg (and its CI equivalent) installs the `npm pack` tarball into a temporary prefix, launches its `bin`, and asserts the MCP handshake lists exactly the seven Stage 1 tools (`import`, `export`, `create`, `change`, `parse`, `validate`, `preview`) over stdio — matching the set registered on `dev` (see, e.g., the in-process tool list in `apps/mcp-server/src/server.ts`), so a future tool-surface change updates one source, not this spec — the packed counterpart of the existing spawn test.
- REQ-005: A hand-maintained `server.json` at the repository root conforms to the `2025-12-11` `server.schema.json` (a vendored copy committed as a test fixture, so the gate validates offline per the CONSTITUTION's local-only principle) and carries: `name` `io.github.dfch/biz-dfch-bpmnmcp` (resolved decision, Design Notes), `title`, `description`, `websiteUrl`/`repository` pointing at this repo, `version` equal to the app's `package.json` version, and a single `packages` entry: `registryType` `npm`, `registryBaseUrl` `https://registry.npmjs.org`, `identifier` `biz.dfch.bpmnmcp`, `version` equal to `package.json`, `runtimeHint` `npx`, `transport` `{ "type": "stdio" }`, no runtime/package arguments (the bin is the server).
- REQ-006: `server.json`'s `environmentVariables` documents exactly the five variables the server reads — `BPMN_MCP_DOCS_DIR` (default `./docs`, `filepath`), `BPMN_MCP_LOG_FILE` (default `logs/server`), `BPMN_MCP_LOG_LEVEL` (default `info`), `BPMN_MCP_LOG_ROTATE` (default `daily`), `BPMN_MCP_LOG_RETAIN` (default `7`, `number`) — and a bidirectional drift test (vitest, the npm analog of the sibling's `tests/test_server_json.py`) asserts set equality in both directions between the manifest entries and the `BPMN_MCP_*` read sites in `src/`, plus the structural invariants (unique names, non-empty descriptions, `default` present iff the code reads the variable with a default), with at least one negative leg pinning a failure.
- REQ-007: `.github/workflows/publish.yml` (SPDX header; actions pinned by SHA with the version in a comment, per `ci.yml`'s convention) triggers on `push` of tags `v*` and runs, in order: (a) a gate job re-running `npm ci`, `npm run lint`, `npm run format:check`, `npm run build`, `npm test -- --coverage` from the repository root plus a tag/version consistency check (the tag's version must equal the app's `package.json` version — a mismatch fails the workflow before anything is published); (b) `npm publish` with the `NPM_TOKEN` repository secret; (c) a GitHub Release for the tag attaching the `npm pack` tarball (`gh` CLI, the sibling's pattern); (d) an MCP Registry job following the sibling verbatim: download the `mcp-publisher` release binary, `jq` the tag version into `server.json`'s `.version` and `.packages[0].version`, `mcp-publisher login github-oidc`, `mcp-publisher publish`, with `permissions: id-token: write, contents: write`.
- REQ-008: A `CHANGELOG.md` (Keep-a-Changelog shape, starting with an `Unreleased` section) and a documented release procedure in `CONTRIBUTING.md`: move `Unreleased` into a dated `## [x.y.z]` section, bump the version in `apps/mcp-server/package.json` (the single source of truth — the MCP `version` resource already reports it), commit as `chore(release): bump version to vX.Y.Z`, fast-forward-only merge of `dev` into `main`, tag `vX.Y.Z` on `main`, push the tag; the publish workflow handles the rest (the sibling's README release section, npm-adapted).
- REQ-009: The first public publish (v0.1.0) — npm, the GitHub Release with the packed tarball, the MCP Registry entry `io.github.dfch/biz-dfch-bpmnmcp`, and the root `README.md` badge plus the "live on npm and in the MCP Registry as of vX.Y.Z" note — is delivered and verified (ACC-007/ACC-008 trace here).

### Acceptance Criteria

- [ ] ACC-001: On a clean clone, `npm ci`, `npm run lint`, `npm run format:check`, `npm run build`, and `npm test -- --coverage` all pass from the repository root, `npm audit` reports no vulnerabilities other than the documented residual (archunit → minimatch 10.2.6, GHSA-g3hv-75wg-m249, QA 7.0030), and `uvx pre-commit run --all-files` passes.
- [ ] ACC-002: `npm pack` produces a tarball whose file list is exactly the REQ-003 set; the test leg fails on any extra or missing file.
- [ ] ACC-003: After `prepack`, `dist/index.js` starts with `#!/usr/bin/env node` and carries the exec bit; `src/index.ts` is byte-unchanged (the license gate still passes); the package-directory `LICENSE` is byte-identical to the repository root's.
- [ ] ACC-004: The clean-environment packed-artifact leg installs the tarball into a temporary prefix, launches the `bin`, and the MCP handshake over stdio lists exactly the seven Stage 1 tools (`import`, `export`, `create`, `change`, `parse`, `validate`, `preview`) — matching the set registered on `dev` (see, e.g., the in-process tool list in `apps/mcp-server/src/server.ts`), so a future tool-surface change updates one source, not this spec.
- [ ] ACC-005: `server.json` validates against the vendored `2025-12-11` schema; its `identifier` and `version` equal the app's `package.json` `name` and `version`; the env-var drift test passes, and its negative leg proves the suite fails when a `BPMN_MCP_*` read site and the manifest disagree.
- [ ] ACC-006: `publish.yml` is valid YAML (the pre-commit `check yaml` hook covers it), its jobs run in the order gates → npm → release → registry, the registry job carries `id-token: write`, and the tag/version consistency check fails a mismatched tag.
- [ ] ACC-007: The first publish completes: `npm view biz.dfch.bpmnmcp version` reports the released version and the published manifest's `description`, `keywords`, `repository`, and `engines` fields equal the app's `package.json` values (verify via `npm view`); the GitHub Release exists with the tarball attached; `mcp-publisher publish` exits 0 and the MCP Registry lists `io.github.dfch/biz-dfch-bpmnmcp` at that version; `npx -y biz.dfch.bpmnmcp` completes a handshake in a clean directory.
- [ ] ACC-008: The root `README.md` carries the MCP Registry badge (sibling style) and the "live on npm and in the MCP Registry as of vX.Y.Z" note; `CHANGELOG.md` and the CONTRIBUTING release procedure are committed; the Progress section records the published artifacts.
- [ ] ACC-009: The package `README.md` (Task 100.140) documents usage (the `npx` and `node` invocations), the MCP client config snippet, the five `BPMN_MCP_*` variables with defaults, the `node >= 26` requirement per DEC 5185d651-7283-4b1d-87e0-272795d15edf, the AGPL-3.0-only licensing note, and the bpmn.io attribution-watermark clause (the viewer ships as a dependency; the watermark must stay visible on rendered canvases per AGENTS.md's licensing note).

### Scope

#### Included

- The publishable `apps/mcp-server` manifest (REQ-001), the `prepack` pipeline and its tests (REQ-002/REQ-003), the clean-environment packed-artifact leg (REQ-004), and the package `README.md`.
- The vendored `server.schema.json` fixture, the repository-root `server.json`, and the drift test (REQ-005/REQ-006).
- `.github/workflows/publish.yml` (REQ-007).
- `CHANGELOG.md`, the CONTRIBUTING release procedure (REQ-008), and the root README badge (ACC-008).
- The first public publish (v0.1.0): npm, GitHub Release, MCP Registry.
- The pull request itself (opened by the orchestrator after review, per house convention).

#### Explicitly Out Of Scope

- Renaming or scoping the npm package: `biz.dfch.bpmnmcp` stays (verified unclaimed on 2026-11-01; the first publish claims it permanently).
- User-side account and trust setup: the npmjs.com account + 2FA, the `NPM_TOKEN` repository secret, and the MCP Registry GitHub App installation for OIDC (recorded as Phase 130 prerequisites, not implementation tasks).
- SSE / streamable-http transports and any `remotes` manifest entries: the `stdio`-only exclusion stays (the manifest declares `stdio` only); the `preview` feature (feat-20, done) delivered a browser viewer only (no additional MCP transport; the preview server binds 127.0.0.1), so Stage 1 is complete and SSE/streamable-http (if ever pursued) is an open follow-up without an owning feature.
- Docker/OCI package entries and MCPB bundles.
- Private or test registries (npm has no TestPyPI; the staging legs are the `--dry-run`/`npm pack` test legs and the clean-environment install).
- Remediating the documented archunit → minimatch 10.2.6 audit residual (tracked in QA 7.0030 until a minimatch-11-compatible archunit release ships).
- The implementation of the Stage 1 tools (`create`, `change`, `validate`, `parse`, `preview`): already complete on `dev` (feat-17/18/19/20, all `done`); this feature only packages and publishes.

### Dependencies

#### Depends On

- FEAT feat-2-prc-import-export (status `done`, PR #10 merged as `bed6cab`): the server, the `import`/`export` tools, the declared `bin`, the five `BPMN_MCP_*` variables, and the `version` resource this feature packages.
- FEAT feat-1-bpmn-mcp-scaffold (status `done`, PR #2): the quality gates, `ci.yml`'s SHA-pinned action convention, the `BPMN_MCP_DOCS_DIR`/`prc` path model, and the logging configuration this feature extends.
- FEAT feat-12-node-26-minimum (status `done`, PR #13 merged as `e07c184`): the `node >= 26` engines floor this feature publishes (DEC 5185d651-7283-4b1d-87e0-272795d15edf).
- FEAT feat-17-create-change-tools (status `done`, PR #21), FEAT feat-18-parse-tool (status `done`, PR #22), FEAT feat-19-validate-tool (status `done`, PR #23), and FEAT feat-20-preview-tool (status `done`, PR #24): the five remaining Stage 1 tools that complete the seven-tool handshake surface this feature packages (and, for feat-20, the `bpmn-js` dependency shipped in the package).
- GitHub issue #11: the planning anchor for this feature.

#### Blocks

- External consumption of the server by any agent or human on any machine (`npx -y biz.dfch.bpmnmcp`, MCP Registry discovery) — the CONSTITUTION's local-only principle stays intact: the server remains stdio and fully offline at runtime; npm and the MCP Registry are distribution/discovery mechanisms, not runtime dependencies.

### Design Notes

**Shebang in build output, never in source.** The license drift gate pins lines 0/1 of every in-scope source file to the two-line SPDX header with no shebang tolerance, and Prettier enforces the same on write. `dist/` is explicitly exempt from the gate (`EXEMPT_PREFIXES`), so the `prepack` script adds the shebang to the _built_ `dist/index.js` — this is what makes `npx` work on Unix (npm's bin links are symlinks; direct exec needs a shebang) without touching `src/index.ts`.

**`logging.json` ships.** `config.ts`/`package-root.ts` document it as "a committed component config shipped alongside the code", resolved against the package root rather than `process.cwd()` — unlike `BPMN_MCP_DOCS_DIR`, which is deliberately cwd-relative. A `files: ["dist"]`-only tarball would therefore work today (the file currently mirrors the built-in defaults) and silently regress the day anyone edits it; REQ-001/ACC-002 pin it in the tarball set.

**Version: one source of truth.** `apps/mcp-server/package.json`'s `version` is it (the MCP `version` resource already reports it via `package-metadata.ts`). The tag must equal it — the publish workflow's consistency check fails otherwise — and `server.json`'s version is CI-synced from the tag by `jq` at publish time (the sibling's pattern) while the local drift test pins manifest ↔ package equality in the meantime.

**Auth.** npm publishes with an `NPM_TOKEN` repository secret (an automation token). The sibling's PyPI leg uses GitHub OIDC trusted publishing (no stored token); npm's equivalent is unconfirmed as of this draft, so the token is the plan, with a revisit note. The MCP Registry leg uses `mcp-publisher login github-oidc`, which requires the registry's GitHub App to be installed on this repository — a user-side prerequisite gating Phase 130 only.

**Offline validation.** The `2025-12-11` server schema is vendored as a committed fixture (source URL + fetch date recorded in the test); the gate never fetches from `static.modelcontextprotocol.io`. `mcp-publisher`'s own validation at publish time is distribution-time network use, the same class as publishing to PyPI itself.

**CI parity.** The publish gate job mirrors `ci.yml`'s build job (the five commands) plus the tag/version check; `npm audit` and `pre-commit` remain local gates, as they are today in `ci.yml` (parity recorded, not a gap to close here). Actions are pinned by SHA with the version in a comment, and `FORCE_JAVASCRIPT_ACTIONS_TO_NODE24` is set, per `ci.yml`.

**Three user decisions (resolved, user, 2026-11-01).** (1) Registry name: `io.github.dfch/biz-dfch-bpmnmcp` — mirrors the sibling's `io.github.dfch/biz-dfch-specmgr` (kebab-cased package name; npm's dots become hyphens); registry names are effectively permanent once the first publish lands. (2) First public version: `0.1.0` — matches the sibling's first publish; the "signals Stage 1 partial (five of the seven tools still deferred)" claim is stale — Stage 1 is complete as of feat-20 (PR #24). The manifest has carried `0.1.0` since the feat-1 scaffold commit, so the first release requires no version bump (the bump step applies from the next release onward). (3) Release branch: fast-forward-only merge of `dev` into `main`, tag on `main` (sibling parity). `main` is dormant today (initial commit only, a strict ancestor of `dev` — the ff-merge is verified possible); the release procedure (REQ-008) establishes the release line, and the first dev→main merge brings in everything committed to `dev` to date.

**Name claim.** npm names cannot be pre-claimed; the first publish claims `biz.dfch.bpmnmcp` permanently. The 2026-11-01 unclaimed check is recorded as evidence; a name conflict at publish time is a hard stop for the operator (the workflow's npm leg fails loudly).

### Related Decisions

- GitHub issue #11: the planning anchor (scope, out-of-scope list, and the decisions this plan extended to three).
- DEC fdc84432-1b48-4eb9-82e0-ec13cb8cf8ba: Use a Node/TypeScript MCP Server — this feature is the distribution half of that decision's confirmation path.
- DEC 5185d651-7283-4b1d-87e0-272795d15edf: Node 26 minimum (status `accepted`) — its Consequences state that the feat-11 (npm publish) plan publishes with `engines >=26`; Task 100.140 cites it.
- QA 818fac76-96fb-4e3c-acb8-e5520fab5913: pairs 0.0180/0.0270/0.0280 (the CI family pattern, workspaces delegation, the format gate) — `publish.yml` follows the same conventions as `ci.yml`.
- Sibling repo `biz.dfch.SpecMgr`: `server.json`, `.github/workflows/publish.yml`, `tests/test_server_json.py`, and the README release section are the pattern source for REQ-005/REQ-006/REQ-007/REQ-008.
- MCP Registry: the `2025-12-11` `server.schema.json` format and the `mcp-publisher` tool (`modelcontextprotocol/registry`).

### Task List

#### Phase 100: The publishable npm package

- [x] Task 100.100: Make `apps/mcp-server/package.json` publishable per REQ-001: drop `private`, add `files` (`dist`, `logging.json`), `description`, `keywords`, `repository`; keep `license`/`bin`/`engines` (the license field stays gate-asserted).
- [x] Task 100.110: Create `apps/mcp-server/scripts/prepare-publish.mjs` (SPDX header) implementing the REQ-002 `prepack` pipeline (build → shebang + exec bit on `dist/index.js` → root `LICENSE` copied into the package directory), wired as the `prepack` script, with unit tests (shebang idempotence, LICENSE byte-identity, sources untouched).
- [x] Task 100.120: Add the tarball-set test leg: `npm pack` contents equal exactly the REQ-003 set (fails on any extra or missing file).
- [x] Task 100.130: Add the clean-environment packed-artifact leg: install the tarball into a temporary prefix, launch the `bin`, MCP handshake asserts exactly the seven Stage 1 tools (`import`, `export`, `create`, `change`, `parse`, `validate`, `preview`) — matching the set registered on `dev` (see, e.g., the in-process tool list in `apps/mcp-server/src/server.ts`), so a future tool-surface change updates one source, not this spec (REQ-004).
- [x] Task 100.140: Write the package `README.md`: usage (the `npx` and `node` invocations), the MCP client config snippet, the five `BPMN_MCP_*` variables, the node >= 26 requirement (per DEC 5185d651-7283-4b1d-87e0-272795d15edf), the AGPL note, and the bpmn.io attribution-watermark clause (the viewer ships as a dependency; the watermark must stay visible on rendered canvases per AGENTS.md's licensing note).
- [x] Task 100.150: Run all gates from the repository root (`npm ci`, `lint`, `format:check`, `build`, `test --coverage`, `audit`, `uvx pre-commit run --all-files`), fixing findings.

#### Phase 110: The MCP Registry manifest and drift gate

- [ ] Task 110.100: Vendor the `2025-12-11` `server.schema.json` as a committed test fixture, with the source URL and fetch date recorded (offline validation, Design Notes).
- [ ] Task 110.110: Create the repository-root `server.json` per REQ-005 (registry name per the resolved decision (1); the npm package entry; the five `environmentVariables` with the `config.ts` defaults).
- [ ] Task 110.120: Implement the drift test per REQ-006 (schema validation, `identifier`/`version` ↔ `package.json`, the bidirectional env-var set equality with the structural invariants, at least one negative leg).
- [ ] Task 110.130: Run all gates from the repository root, fixing findings.

#### Phase 120: The tag-driven publish pipeline

- [ ] Task 120.100: Create `.github/workflows/publish.yml` per REQ-007 (SPDX header, SHA-pinned actions, the gate job with the tag/version consistency check, the npm publish job, the GitHub Release job, the MCP Registry job with `id-token: write`).
- [ ] Task 120.110: Create `CHANGELOG.md` (Keep-a-Changelog, `Unreleased` first) and document the release procedure in `CONTRIBUTING.md` per REQ-008 (including the dev→main fast-forward-only merge and the tag-on-`main` step, per the resolved decision (3)).
- [ ] Task 120.120: Run the full quality gate from the repository root and open the pull request (the orchestrator opens it after review, per house convention).

#### Phase 130: The first publish (executed after the PR merges)

- [ ] Task 130.100: Verify the user-side prerequisites: npmjs account with 2FA, the `NPM_TOKEN` repository secret set, and the MCP Registry GitHub App installed for OIDC — block and report if any is missing; then, before anything is published, re-run `npm view biz.dfch.bpmnmcp` and confirm the name is still unclaimed (registry 404), superseding the 2026-11-01 snapshot evidence recorded in Design Notes — a claim by a third party is a hard stop for the operator.
- [ ] Task 130.110: Execute the release procedure: date the CHANGELOG section, the `chore(release)` commit, the dev→main fast-forward-only merge, tag `v0.1.0` on `main`, push the tag; follow the publish workflow through all four legs. No version bump in this task: the manifest already carries `0.1.0` (since the feat-1 scaffold), so the first release needs none — the bump step applies from the next release onward.
- [ ] Task 130.120: Verify the public artifacts per ACC-007: `npm view biz.dfch.bpmnmcp version`, the GitHub Release with the tarball, the MCP Registry entry, and a clean-directory `npx -y biz.dfch.bpmnmcp` handshake.
- [ ] Task 130.130: Add the README badge and the "live as of vX.Y.Z" note (ACC-008), record the published artifacts in the Progress section, and close the feature per house convention (status flip + closing commit after review).

## Progress

### Current Status

**As of 2026-11-17**: Phase 100 (the publishable npm package) implemented — the manifest is publishable per REQ-001, the `prepack` pipeline (build → shebang + exec bit on `dist/index.js` → root `LICENSE` into the package directory) runs with unit tests, the tarball-set and clean-environment packed-artifact legs pin the REQ-003 file set and the REQ-004 tool surface, and the package `README.md` covers usage, client config, the five `BPMN_MCP_*` variables, the `node >= 26` floor, the AGPL note, and the bpmn.io watermark clause (ACC-002/ACC-003/ACC-004/ACC-009); all gates green (the plan's re-baseline and the feat-12 partial update remain recorded below). Next: Phase 110 (the MCP Registry manifest and drift gate).

### Blockers

None for Phases 100–120. The user-side prerequisites (npm account, `NPM_TOKEN`, the MCP Registry GitHub App) gate Phase 130 only.

### Updates

<!-- Newest entry first -- prepend new entries directly below this comment. -->

#### 2026-11-17 14:45:21.208+01:00 - Phase 100 implemented: the publishable npm package

Implemented Phase 100 (Tasks 100.100–100.150): Task 100.100 made `apps/mcp-server/package.json` publishable per REQ-001 (dropped `private`; added `files` (`dist`, `logging.json`), `description`, the `mcp`/`model-context-protocol`/`bpmn`/`bpmn-io` `keywords`, and the git `repository` — the gate-asserted `license`, `bin`, and `engines` (`node >= 26`) kept); Task 100.110 added `scripts/prepare-publish.mjs` (SPDX header, wired as the `prepack` script: `npm run build` → shebang + exec bit on `dist/index.js` only → repository-root `LICENSE` copied byte-identically into the package directory; no source file touched) plus 9 unit tests (shebang idempotence, LICENSE byte-identity, sources untouched, and a missing-LICENSE negative leg); Task 100.120 added the tarball-set leg in `test/mcp-server.packed.test.ts` (`npm pack` contents equal exactly the REQ-003 set — `package.json`, the package `README.md`, `LICENSE`, `dist/**` with the shebang-ed `index.js`, `logging.json` — failing on any extra or missing file, with the `dist/**` half derived independently from the `src/` tree); Task 100.130 added the clean-environment packed-artifact leg (the tarball installs into a fresh temporary prefix from the registry, the installed `bin` launches directly — proving shebang + exec bit end to end — and the stdio MCP handshake lists exactly the tool set registered on `dev`, derived in-process from `src/server.ts`, so a future tool-surface change updates one source, not this spec; today that set is the seven Stage 1 tools); Task 100.140 wrote the package `README.md` (the `npx`/`node` invocations, the MCP client config snippet, the five `BPMN_MCP_*` variables with defaults and the three-tier precedence, the `node >= 26` requirement per DEC 5185d651-7283-4b1d-87e0-272795d15edf, the AGPL-3.0-only note, and the bpmn.io attribution-watermark clause per AGENTS.md's licensing note); Task 100.150 ran all gates from the repository root — `npm ci`, `npm run lint`, `npm run format:check`, `npm run build`, `npm test -- --coverage` (21 files, 377 passed / 2 skipped, the skipped being the spawn suite's pre-existing port-8080-occupied conditional legs), `npm audit` (only the documented residual archunit → minimatch 10.2.6, GHSA-g3hv-75wg-m249, QA 7.0030 — no new findings, `package-lock.json` untouched), `uvx pre-commit run --all-files` — all green. One supporting decision, settled in this phase: `vitest.config.ts` now sets `fileParallelism: false` (test files run serially) because in the default parallel mode the packed leg's `npm pack` (whose `prepack` re-emits `dist/`) plus its registry install overlapped the spawn suite's launched servers and produced a rare (1 in 46 full runs) spawn-suite flake, while the pre-change baseline was stable (15/15); under serial execution the suite is green across 30 consecutive full runs (~25 s each), and the stale "parallel workers" comment in `mcp-server.test.ts` was updated to match.

#### 2026-11-17 05:38:59.000+01:00 - Re-baselined against repository state

Re-baselined the plan after the read-only refinement review (findings E1, E2, D1–D5, G1–G6, I1–I6): the handshake assertions (REQ-004/ACC-004/Task 100.130) now name the seven Stage 1 tools and match the set registered on `dev` drift-resistently (per I2), so a future tool-surface change updates one source, not this spec; REQ-001's `engines` floor is `node >= 26`; new REQ-009 (the first public publish) and ACC-009 (the package `README.md` content, including the bpmn.io attribution-watermark clause, added to Task 100.140 as well); ACC-007 asserts the published manifest's `description`/`keywords`/`repository`/`engines` fields equal the app's `package.json`; the Out-of-Scope bullets for the Stage 1 tools and the SSE/streamable-http transport exclusion are rewritten (Stage 1 complete; the transport follow-up has no owning feature); Depends On extended with feat-12/17/18/19/20; Task 130.110 drops the version bump (the manifest carries `0.1.0` since the feat-1 scaffold; the bump applies from the next release onward); Task 130.100 gains a fresh `npm view` name-claim check superseding the 2026-11-01 snapshot evidence; DEC 5185d651-7283-4b1d-87e0-272795d15edf added to Related Decisions; the stale "signals Stage 1 partial" rationale in Design Notes corrected; Current Status updated; the 2026-11-07 `e07c184` touch is recorded retroactively in the entry below.

#### 2026-11-07 08:07:51.000+01:00 - feat-12 partial update (recorded retroactively)

Commit `e07c184` (feat-12, PR #13) updated Task 100.140 to cite DEC 5185d651-7283-4b1d-87e0-272795d15edf and the `node >= 26` requirement, and bumped the frontmatter `updated`, without an entry in this log — recorded here at re-baseline time (2026-11-17) to restore the log's completeness.

#### 2026-11-01 12:52:45.474+01:00 - Created

Drafted the spec for npm + MCP Registry publishing of the MCP server, anchored in GitHub issue #11: the publishable package (the manifest gaps, the `prepack` shebang/LICENSE pipeline, the exact-tarball and clean-environment test legs), the repository-root `server.json` with its vendored-schema and bidirectional env-var drift test, the tag-driven `publish.yml` (gates + tag/version consistency → npm → GitHub Release → MCP Registry via `mcp-publisher`/OIDC), the `CHANGELOG.md`/CONTRIBUTING release procedure, and the first public publish as Phase 130. The three decisions (registry name `io.github.dfch/biz-dfch-bpmnmcp`, first version `0.1.0`, release branch dev→main ff-only + tag on `main`) were resolved by the user the same day (Design Notes). Awaiting the user's review before implementation starts.
