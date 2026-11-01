---
classification: null
created: '2026-11-01T13:06:50.041+01:00'
id: feat-11-npm-publish-mcp-registry
status: planning
type: feat
updated: '2026-11-01T13:18:15.727+01:00'
version: 1.0.0
---

# Feature: npm and MCP Registry Publishing for the MCP Server

## Plan

### Overview

feat-1 delivered the scaffold, the gates, and the walking-skeleton server; feat-2 delivered the `prc` artifact core and the `import`/`export` tools (PR #10, merged as `bed6cab`). The server is currently consumable only from a local checkout (`node apps/mcp-server/dist/index.js`). This feature makes it distributable in the same shape as the sibling repo `biz.dfch.SpecMgr`: a published **npm package** (the `npx` counterpart of the sibling's `uvx biz-dfch-specmgr`), a **GitHub Release** carrying the packed tarball, and an entry in the official **MCP Registry** (`registry.modelcontextprotocol.io`) driven by a hand-maintained `server.json` at the repository root — all published by one tag-driven workflow. Scope: the packaging gaps in `apps/mcp-server/package.json` (the private flag, the `files` whitelist including `logging.json`, metadata, a `prepack` pipeline that adds the shebang and exec bit to build output only, a package README), the `server.json` manifest plus a bidirectional drift test (manifest ↔ package, manifest env vars ↔ the vars actually read in `src/`, offline validation against a vendored schema copy), `publish.yml` (gate re-run + tag/version consistency → npm publish → GitHub Release → `mcp-publisher` to the MCP Registry via GitHub OIDC), `CHANGELOG.md` + the release procedure in CONTRIBUTING, the README badge, and the first public publish (v0.1.0). Anchored in GitHub issue #11. The remaining Stage 1 tools (`create`, `change`, `validate`, `parse`, `preview`) are out of scope and stay deferred to their own features.

### Requirements

- REQ-001: `apps/mcp-server/package.json` is publishable: `"private"` removed; `"files": ["dist", "logging.json"]` added (`logging.json` is the committed component config that ships with the code per `config.ts` — a tarball without it would silently fall npm consumers back to the built-in defaults); `description`, `keywords` (`mcp`, `model-context-protocol`, `bpmn`, `bpmn-io`), and `repository` added; the `license` (`AGPL-3.0-only`, already gate-asserted), `bin` (`biz.dfch.bpmnmcp` → `dist/index.js`), and `engines` (`node >= 24`) entries are kept.
- REQ-002: A `prepack` pipeline (new `apps/mcp-server/scripts/prepare-publish.mjs`, two-line SPDX header) runs `npm run build`, then post-processes build output only: prepends `#!/usr/bin/env node` to `dist/index.js` when absent, sets the exec bit, and copies the repository-root `LICENSE` into the package directory (npm auto-includes `LICENSE` only from the package directory; AGPL requires the license text to travel with the distributed package). No source file is ever touched — the license drift gate keeps asserting the SPDX header on lines 0/1 of every in-scope source (`dist/` is exempt, which is what makes this safe).
- REQ-003: The published tarball (`npm pack` / `npm publish --dry-run`) contains exactly: `package.json`, the package `README.md`, `LICENSE`, `dist/**` (with the shebang-ed `index.js`), and `logging.json` — and nothing else (no `src/`, `test/`, fixtures, `tsconfig*`, `vitest.config.ts`, `eslint.config.js`, `coverage/`, `node_modules`). A test leg pins the set.
- REQ-004: The packed artifact works standalone in a clean environment: a test leg (and its CI equivalent) installs the `npm pack` tarball into a temporary prefix, launches its `bin`, and asserts the MCP handshake lists exactly the `import` and `export` tools over stdio — the packed counterpart of the existing spawn test.
- REQ-005: A hand-maintained `server.json` at the repository root conforms to the `2025-12-11` `server.schema.json` (a vendored copy committed as a test fixture, so the gate validates offline per the CONSTITUTION's local-only principle) and carries: `name` `io.github.dfch/biz-dfch-bpmnmcp` (resolved decision, Design Notes), `title`, `description`, `websiteUrl`/`repository` pointing at this repo, `version` equal to the app's `package.json` version, and a single `packages` entry: `registryType` `npm`, `registryBaseUrl` `https://registry.npmjs.org`, `identifier` `biz.dfch.bpmnmcp`, `version` equal to `package.json`, `runtimeHint` `npx`, `transport` `{ "type": "stdio" }`, no runtime/package arguments (the bin is the server).
- REQ-006: `server.json`'s `environmentVariables` documents exactly the five variables the server reads — `BPMN_MCP_DOCS_DIR` (default `./docs`, `filepath`), `BPMN_MCP_LOG_FILE` (default `logs/server`), `BPMN_MCP_LOG_LEVEL` (default `info`), `BPMN_MCP_LOG_ROTATE` (default `daily`), `BPMN_MCP_LOG_RETAIN` (default `7`, `number`) — and a bidirectional drift test (vitest, the npm analog of the sibling's `tests/test_server_json.py`) asserts set equality in both directions between the manifest entries and the `BPMN_MCP_*` read sites in `src/`, plus the structural invariants (unique names, non-empty descriptions, `default` present iff the code reads the variable with a default), with at least one negative leg pinning a failure.
- REQ-007: `.github/workflows/publish.yml` (SPDX header; actions pinned by SHA with the version in a comment, per `ci.yml`'s convention) triggers on `push` of tags `v*` and runs, in order: (a) a gate job re-running `npm ci`, `npm run lint`, `npm run format:check`, `npm run build`, `npm test -- --coverage` from the repository root plus a tag/version consistency check (the tag's version must equal the app's `package.json` version — a mismatch fails the workflow before anything is published); (b) `npm publish` with the `NPM_TOKEN` repository secret; (c) a GitHub Release for the tag attaching the `npm pack` tarball (`gh` CLI, the sibling's pattern); (d) an MCP Registry job following the sibling verbatim: download the `mcp-publisher` release binary, `jq` the tag version into `server.json`'s `.version` and `.packages[0].version`, `mcp-publisher login github-oidc`, `mcp-publisher publish`, with `permissions: id-token: write, contents: write`.
- REQ-008: A `CHANGELOG.md` (Keep-a-Changelog shape, starting with an `Unreleased` section) and a documented release procedure in `CONTRIBUTING.md`: move `Unreleased` into a dated `## [x.y.z]` section, bump the version in `apps/mcp-server/package.json` (the single source of truth — the MCP `version` resource already reports it), commit as `chore(release): bump version to vX.Y.Z`, fast-forward-only merge of `dev` into `main`, tag `vX.Y.Z` on `main`, push the tag; the publish workflow handles the rest (the sibling's README release section, npm-adapted).

### Acceptance Criteria

- [ ] ACC-001: On a clean clone, `npm ci`, `npm run lint`, `npm run format:check`, `npm run build`, and `npm test -- --coverage` all pass from the repository root, `npm audit` reports no vulnerabilities other than the documented residual (archunit → minimatch 10.2.6, GHSA-g3hv-75wg-m249, QA 7.0030), and `uvx pre-commit run --all-files` passes.
- [ ] ACC-002: `npm pack` produces a tarball whose file list is exactly the REQ-003 set; the test leg fails on any extra or missing file.
- [ ] ACC-003: After `prepack`, `dist/index.js` starts with `#!/usr/bin/env node` and carries the exec bit; `src/index.ts` is byte-unchanged (the license gate still passes); the package-directory `LICENSE` is byte-identical to the repository root's.
- [ ] ACC-004: The clean-environment packed-artifact leg installs the tarball into a temporary prefix, launches the `bin`, and the MCP handshake over stdio lists exactly `import` and `export`.
- [ ] ACC-005: `server.json` validates against the vendored `2025-12-11` schema; its `identifier` and `version` equal the app's `package.json` `name` and `version`; the env-var drift test passes, and its negative leg proves the suite fails when a `BPMN_MCP_*` read site and the manifest disagree.
- [ ] ACC-006: `publish.yml` is valid YAML (the pre-commit `check yaml` hook covers it), its jobs run in the order gates → npm → release → registry, the registry job carries `id-token: write`, and the tag/version consistency check fails a mismatched tag.
- [ ] ACC-007: The first publish completes: `npm view biz.dfch.bpmnmcp version` reports the released version; the GitHub Release exists with the tarball attached; `mcp-publisher publish` exits 0 and the MCP Registry lists `io.github.dfch/biz-dfch-bpmnmcp` at that version; `npx -y biz.dfch.bpmnmcp` completes a handshake in a clean directory.
- [ ] ACC-008: The root `README.md` carries the MCP Registry badge (sibling style) and the "live on npm and in the MCP Registry as of vX.Y.Z" note; `CHANGELOG.md` and the CONTRIBUTING release procedure are committed; the Progress section records the published artifacts.

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
- SSE / streamable-http transports and any `remotes` manifest entries (the later `preview` feature's territory; the manifest declares `stdio` only).
- Docker/OCI package entries and MCPB bundles.
- Private or test registries (npm has no TestPyPI; the staging legs are the `--dry-run`/`npm pack` test legs and the clean-environment install).
- Remediating the documented archunit → minimatch 10.2.6 audit residual (tracked in QA 7.0030 until a minimatch-11-compatible archunit release ships).
- The remaining Stage 1 tools: `create`, `change`, `validate`, `parse`, `preview`.

### Dependencies

#### Depends On

- FEAT feat-2-prc-import-export (status `done`, PR #10 merged as `bed6cab`): the server, the `import`/`export` tools, the declared `bin`, the five `BPMN_MCP_*` variables, and the `version` resource this feature packages.
- FEAT feat-1-bpmn-mcp-scaffold (status `done`, PR #2): the quality gates, `ci.yml`'s SHA-pinned action convention, the `BPMN_MCP_DOCS_DIR`/`prc` path model, and the logging configuration this feature extends.
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

**Three user decisions (resolved, user, 2026-11-01).** (1) Registry name: `io.github.dfch/biz-dfch-bpmnmcp` — mirrors the sibling's `io.github.dfch/biz-dfch-specmgr` (kebab-cased package name; npm's dots become hyphens); registry names are effectively permanent once the first publish lands. (2) First public version: `0.1.0` — matches the sibling's first publish and signals Stage 1 partial (five of the seven tools still deferred). (3) Release branch: fast-forward-only merge of `dev` into `main`, tag on `main` (sibling parity). `main` is dormant today (initial commit only, a strict ancestor of `dev` — the ff-merge is verified possible); the release procedure (REQ-008) establishes the release line, and the first dev→main merge brings in everything committed to `dev` to date.

**Name claim.** npm names cannot be pre-claimed; the first publish claims `biz.dfch.bpmnmcp` permanently. The 2026-11-01 unclaimed check is recorded as evidence; a name conflict at publish time is a hard stop for the operator (the workflow's npm leg fails loudly).

### Related Decisions

- GitHub issue #11: the planning anchor (scope, out-of-scope list, and the decisions this plan extended to three).
- DEC fdc84432-1b48-4eb9-82e0-ec13cb8cf8ba: Use a Node/TypeScript MCP Server — this feature is the distribution half of that decision's confirmation path.
- QA 818fac76-96fb-4e3c-acb8-e5520fab5913: pairs 0.0180/0.0270/0.0280 (the CI family pattern, workspaces delegation, the format gate) — `publish.yml` follows the same conventions as `ci.yml`.
- Sibling repo `biz.dfch.SpecMgr`: `server.json`, `.github/workflows/publish.yml`, `tests/test_server_json.py`, and the README release section are the pattern source for REQ-005/REQ-006/REQ-007/REQ-008.
- MCP Registry: the `2025-12-11` `server.schema.json` format and the `mcp-publisher` tool (`modelcontextprotocol/registry`).

### Task List

#### Phase 100: The publishable npm package

- [ ] Task 100.100: Make `apps/mcp-server/package.json` publishable per REQ-001: drop `private`, add `files` (`dist`, `logging.json`), `description`, `keywords`, `repository`; keep `license`/`bin`/`engines` (the license field stays gate-asserted).
- [ ] Task 100.110: Create `apps/mcp-server/scripts/prepare-publish.mjs` (SPDX header) implementing the REQ-002 `prepack` pipeline (build → shebang + exec bit on `dist/index.js` → root `LICENSE` copied into the package directory), wired as the `prepack` script, with unit tests (shebang idempotence, LICENSE byte-identity, sources untouched).
- [ ] Task 100.120: Add the tarball-set test leg: `npm pack` contents equal exactly the REQ-003 set (fails on any extra or missing file).
- [ ] Task 100.130: Add the clean-environment packed-artifact leg: install the tarball into a temporary prefix, launch the `bin`, MCP handshake asserts exactly the `import` and `export` tools (REQ-004).
- [ ] Task 100.140: Write the package `README.md`: usage (the `npx` and `node` invocations), the MCP client config snippet, the five `BPMN_MCP_*` variables, the node >= 24 requirement, the AGPL note.
- [ ] Task 100.150: Run all gates from the repository root (`npm ci`, `lint`, `format:check`, `build`, `test --coverage`, `audit`, `uvx pre-commit run --all-files`), fixing findings.

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

- [ ] Task 130.100: Verify the user-side prerequisites: npmjs account with 2FA, the `NPM_TOKEN` repository secret set, and the MCP Registry GitHub App installed for OIDC — block and report if any is missing.
- [ ] Task 130.110: Execute the release procedure: date the CHANGELOG section, bump `package.json` to `0.1.0`, the `chore(release)` commit, the dev→main fast-forward-only merge, tag `v0.1.0` on `main`, push the tag; follow the publish workflow through all four legs.
- [ ] Task 130.120: Verify the public artifacts per ACC-007: `npm view biz.dfch.bpmnmcp version`, the GitHub Release with the tarball, the MCP Registry entry, and a clean-directory `npx -y biz.dfch.bpmnmcp` handshake.
- [ ] Task 130.130: Add the README badge and the "live as of vX.Y.Z" note (ACC-008), record the published artifacts in the Progress section, and close the feature per house convention (status flip + closing commit after review).

## Progress

### Current Status

**As of 2026-11-01**: Drafted against GitHub issue #11; the three user decisions (registry name `io.github.dfch/biz-dfch-bpmnmcp`, first version `0.1.0`, release via dev→main fast-forward-only merge + tag on `main`) were resolved the same day and are recorded in Design Notes. Awaiting implementation approval.

### Blockers

None for Phases 100–120. The user-side prerequisites (npm account, `NPM_TOKEN`, the MCP Registry GitHub App) gate Phase 130 only.

### Updates

<!-- Newest entry first -- prepend new entries directly below this comment. -->

#### 2026-11-01 12:52:45.474+01:00 - Created

Drafted the spec for npm + MCP Registry publishing of the MCP server, anchored in GitHub issue #11: the publishable package (the manifest gaps, the `prepack` shebang/LICENSE pipeline, the exact-tarball and clean-environment test legs), the repository-root `server.json` with its vendored-schema and bidirectional env-var drift test, the tag-driven `publish.yml` (gates + tag/version consistency → npm → GitHub Release → MCP Registry via `mcp-publisher`/OIDC), the `CHANGELOG.md`/CONTRIBUTING release procedure, and the first public publish as Phase 130. The three decisions (registry name `io.github.dfch/biz-dfch-bpmnmcp`, first version `0.1.0`, release branch dev→main ff-only + tag on `main`) were resolved by the user the same day (Design Notes). Awaiting the user's review before implementation starts.
