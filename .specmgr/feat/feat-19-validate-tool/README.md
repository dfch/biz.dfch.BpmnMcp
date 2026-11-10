---
classification: null
created: '2026-11-07T08:58:41.011+01:00'
id: feat-19-validate-tool
status: review
type: feat
updated: '2026-11-10T03:02:52.332+01:00'
version: 1.0.0
---

# Feature: The validate MCP Tool (bpmnlint)

## Plan

### Overview

Implements the `validate` tool (REQ f93fb1c1-a2ad-4adc-9c7b-dd8a817449d0)
per QA 7.0020: it checks a process (a registered one or a session
draft) against configurable BPMN modeling rules using bpmnlint - the
separate rule-based library that bpmn-moddle alone does not provide
(bpmn-moddle guarantees well-formed XML, not a sound diagram). For a
given uuid (after the store's conditional re-read; an in-memory draft
without an on-disk file is served and linted draft-first), `validate`
reports each finding as rule, element id (where the finding attaches to
one), and message, plus an overall status (`no-findings` / the finding
count) and the re-read convention fields (`outOfBandReRead`, `note`).
The rule set is configurable through a committed `.bpmnlintrc` JSON file
that extends `bpmnlint:recommended` - that config is the single source
for the rules, and custom rules remain possible by extending it.
`bpmnlint` joins the app's runtime dependencies, and the `config` MCP
resource replaces its `bpmnlint.preset: 'not yet configured'`
placeholder with the preset the config actually extends. Validation is
explicit-only (QA 1.0060): `create`/`change` never auto-lint. Anchored
in GitHub issue #19.

### Requirements

- REQ-001: A committed `.bpmnlintrc` JSON config extending `bpmnlint:recommended` via its `extends` block - the single source for the rules and the configurability answer to the requirement.
- REQ-002: The config resolves package-relative (next to the app's committed `logging.json`, via feat-1's `findPackageRoot()` package-root pattern), so the same behavior holds from a repository checkout and from an installed/npx-ed package (user decision 2026-11-07; the QA's repository-root wording is superseded for the runtime, because an installed package has no repository root - the installed-package leg carries a cross-feature obligation on feat-11, see the Design Notes forward reference); the five documented `BPMN_MCP_*` variables stay unchanged, so no new env var is introduced. A unit leg loads the config with the process working directory elsewhere, pinning cwd-independence (ACC-006).
- REQ-003: `bpmnlint` is added to the app's `dependencies` (runtime, not dev) and the lockfile is updated; the install stays clean on Node 26.
- REQ-004: A `validate` tool: input a process uuid (zod-validated to the v4 shape, the `UUID_V4` schema `change`/`parse` already use); output `{ uuid, status, findings, outOfBandReRead, note? }` where `uuid` echoes the input, `status` is the literal `no-findings` or the non-negative finding count (zod: `z.union([z.literal('no-findings'), z.number().int().nonnegative()])`), `findings` is a list of `{ rule, elementId?, message }`, and `outOfBandReRead`/`note` carry the store's conditional re-read the same way `import`/`export`/`parse` do. The tool operates on the current state: the store's conditional re-read runs first, and for a uuid that resolves to an in-memory draft with no on-disk file (a feat-17 `create` without export), `validate` serves the draft's tree, lints it, and reports `outOfBandReRead: false` with no note (draft-first, per the feat-18 `parse` convention). Every failure the store's resolution and re-read path can surface - unknown uuid, path missing (the on-disk file deleted out of band), unparseable file, filesystem read failure - maps to a structured single-line `isError` result (no crash).
- REQ-005: The `config` MCP resource reports the preset the committed config extends (replacing the `'not yet configured'` placeholder in `server.ts`).
- REQ-006: Tests: a lint-clean process yields `no-findings` (or a pinned expected set if the recommended preset reports on clean diagrams); a deliberately flawed fixture (a disconnected element, a process without an end event) yields the expected rule ids with element attachment; the fixture set is explicit - Task 100.115 authors the flawed fixture, and the Task 100.100 spike decides the clean reference (reuse `test/fixtures/order-process.bpmn` if it is lint-clean under the committed config, otherwise a dedicated lint-clean fixture); a draft-first leg (a draft-only uuid is linted from the in-memory tree, `outOfBandReRead: false`, no note); error legs for the full store failure set (unknown uuid, path missing, unparseable file, read failure); a config-loading leg (missing/invalid config is a structured failure, not a crash); a cwd-independence leg for the package-relative config load (ACC-006); the full gate chain stays green on Node 26 with archunit and the license gate holding (the lint logic lives in a core module).

### Acceptance Criteria

- [ ] ACC-001: `validate` on the flawed fixture reports findings carrying the expected rule ids, element ids where applicable, and messages, and `status` matches the finding count.
- [ ] ACC-002: `validate` on a clean process reports `no-findings` (or the pinned set), and the `config` resource shows the configured preset.
- [ ] ACC-003: The handshake lists `validate` (the six-tool surface); all pre-existing tests pass; `npm ci`, `npm run lint`, `npm run format:check`, `npm run build`, `npm test -- --coverage`, `npm audit` (no vulnerabilities other than the documented residual), and `uvx pre-commit run --all-files` are green on Node 26.
- [ ] ACC-004: Editing `.bpmnlintrc` (e.g. disabling a rule) changes the reported findings accordingly - the config demonstrably drives validation.
- [ ] ACC-005: A missing or invalid `.bpmnlintrc` is a structured failure, not a crash: `validate` returns a single-line `isError` result naming the config problem, and the `config` resource surfaces the same structured failure instead of a preset.
- [ ] ACC-006: Config resolution is cwd-independent: a unit leg loads the committed `.bpmnlintrc` with the process working directory set elsewhere (not the package root) and resolves the same config.

### Scope

#### Included

- The `.bpmnlintrc` config and its package-relative resolution.
- The `bpmnlint` runtime dependency.
- The core lint module (config load + validate a parsed tree + finding normalization) and the `validate` tool adapter.
- The `config` resource wiring, tests, the C4 description update (both variants), and this feat's Progress discipline.
- The lint fixtures (the flawed fixture authored here; the clean reference per the Task 100.100 spike verdict) and their verified gate exemptions.

#### Explicitly Out Of Scope

- Per-process or per-call rule overrides, and custom bpmnlint rule authoring (possible by extending the config, not built here).
- Automatic validation on `create`/`change` (QA 1.0060 rejects it for Stage 1).
- A UI for findings; reporting beyond the tool result JSON.
- Any change to the five documented `BPMN_MCP_*` variables (feat-11's drift contract).

### Dependencies

#### Depends On

- FEAT feat-2-prc-import-export (the `PrcStore`, the moddle parse path)
- FEAT feat-1-bpmn-mcp-scaffold (the `findPackageRoot()` package-root pattern the config resolves against)
- DEC fdc84432-1b48-4eb9-82e0-ec13cb8cf8ba: Use a Node/TypeScript MCP Server for Agent-Driven BPMN Modeling
- GitHub issue #19

### Design Notes

- **API spike first.** bpmnlint's entry API (lint a moddle tree vs.
  XML text, how findings attach to elements) is pinned by a throwaway
  interop spike before any code lands - the feat-1 Task 100.165
  precedent for the bpmn-moddle/bpmnlint interop.
- **Finding normalization.** A bpmnlint finding maps to the shape
  `{ rule, elementId?, message }`: the rule id, the attached element's
  id where present, and the rule message; findings without element
  attachment (process-level) carry no `elementId`.
- **Core placement.** Config loading and linting touch the file
  system (the config) and the parsed tree: a core module under
  `src/` (candidate `src/prc/lint.ts`), never in the adapter, so the
  archunit rules (adapters do not import `node:fs`; the core owns the
  filesystem) hold.
- **Preset reporting.** The `config` resource reads the same resolved
  config and reports its `extends` value - one resolution path, two
  consumers.
- **feat-11 forward reference (the installed-package legs).** The
  installed/npx-ed behavior promised by REQ-002 is unreachable until
  feat-11 (status `planning`) ships `.bpmnlintrc`: its `files`
  whitelist (`["dist", "logging.json"]`) and its packed-tarball set
  test must gain `.bpmnlintrc` - a cross-feature obligation recorded
  here for feat-11's own pass. The "drift contract" cited in Out Of
  Scope is feat-11's bidirectional drift test, which does not exist
  yet: until it lands, the no-new-`BPMN_MCP_*`-variable guard is
  self-policed, and this feature requires no `server.json` change.
  feat-11's packed-artifact handshake pin ("exactly `import` and
  `export`") also predates the cumulative tool surface (`create`/
  `change`/`parse` already landed, `validate` here, `preview`
  planned) and needs the same fix in feat-11's pass.

### Related Decisions

- DEC fdc84432-1b48-4eb9-82e0-ec13cb8cf8ba: Use a Node/TypeScript MCP Server for Agent-Driven BPMN Modeling
- QA pairs 7.0020 and 1.0060 (QA 818fac76-96fb-4e3c-acb8-e5520fab5913): the bpmnlint config and findings contract; explicit-only validation

### Task List

#### Phase 100: Spike, config, and core

- [x] Task 100.100: Interop spike: pin the bpmnlint API shape (tree vs XML, finding structure, rule ids of the recommended preset, the exact `bpmnlint` version to commit per the feat-2 precedent of naming the spike's version) and the clean-fixture verdict (is `test/fixtures/order-process.bpmn` lint-clean under `bpmnlint:recommended` as extended by the config?) in a throwaway project outside the repository. (bpmnlint 12.0.0 pinned; tree linting via `Linter`/`NodeResolver`, explicit config as the `lint` second argument; clean-fixture verdict: `order-process.bpmn` is lint-clean only with the core's `incoming`/`outgoing` backfill - see the 2026-11-09 Updates entry.)
- [x] Task 100.110: Add the `bpmnlint` runtime dependency (the exact version the Task 100.100 spike pinned) and the committed `.bpmnlintrc` extending `bpmnlint:recommended`, with package-relative resolution next to `logging.json`; verify `npm audit` against the documented residual. (`bpmnlint: ^12.0.0` in `apps/mcp-server/package.json` dependencies, lockfile at 12.0.0; `apps/mcp-server/.bpmnlintrc` = `{"extends": "bpmnlint:recommended"}`; audit byte-identical to the baseline - only the documented archunit -> minimatch residual.)
- [x] Task 100.115: Author the flawed lint fixture under `test/fixtures/` (a disconnected element, a process without an end event), settle the clean reference per the Task 100.100 spike verdict (reuse `order-process.bpmn` or author a dedicated lint-clean fixture), and verify the gate exemptions (`.bpmn` fixtures and the `.json` config need no machine-config change - the license gate and Prettier skip unrecognized extensions, the feat-2 "Gates and fixtures" precedent). (`test/fixtures/flawed-process.bpmn` authored: disconnected `orphan-task`, `flawed-process` without an end event; five pinned findings; clean reference: reuse `order-process.bpmn` per the spike verdict - no new file; gate exemptions verified with the full suite green.)
- [x] Task 100.120: Add the core lint module (config load with structured failure, validate a parsed tree, finding normalization) and unit tests (clean, flawed, missing-config, cwd-independence legs). (`src/prc/lint.ts` + the ambient `src/prc/bpmnlint.d.ts`, `walkElements` exported from `moddle.ts` for the backfill; `test/prc/lint.test.ts` with 11 tests incl. the tree byte-stability and the two cwd-independence legs.)

#### Phase 110: Tool adapter

- [x] Task 110.100: Register the `validate` tool (zod schema per REQ-004, the tool description - explicit-only framing per QA 1.0060, the result shape, a pointer to the `config` resource for the rule set - and the full structured-error set) on top of the store's re-read; the draft case per REQ-004 (draft-first, `outOfBandReRead: false`, no note). (the `PrcStore.validateProcess(uuid, lintPackageRoot = PACKAGE_ROOT)` store operation - draft-first, the conditional re-read mirroring `parseProcess`, then the core's `validateTree`; the `UUID_V4` input; the result built from the `VALIDATE_OUTPUT` zod schema (the plan's `status` union); the explicit-only description with the `config`-resource pointer; every failure - store-side and lint-core - a single-line `isError` through `PrcErrorCode` += `LintErrorCode`.)
- [x] Task 110.110: Wire the `config` resource to report the configured preset (replace the placeholder). (the `bpmnlint` member carries the resolved preset from the same `loadLintConfig` result the `validate` tool lints with - one resolution path, two consumers; `buildEffectiveConfig`/`createServer` take an injectable `lintPackageRoot` (default `PACKAGE_ROOT`, `index.ts` unchanged); the failure shape is the core's `LintError` verbatim, ACC-005.)
- [x] Task 110.120: Update the handshake test (the six-tool surface); add the spawn e2e legs (ACC-001, ACC-002, ACC-005, the draft leg, the error legs) and the config-drives-findings leg (ACC-004). (six-tool handshake in both suites; unit +1 leg (the built-tree `$parent` backfill pin: a sound seeded draft lints to zero findings, byte-stable); in-memory +13 legs (flawed/clean/empty-draft/seeded-draft/promotion/re-read-note/error legs + the ACC-004/ACC-005 legs against an injected temporary lint root - the committed config never touched); spawn +6 legs (ACC-001, ACC-002, the draft legs, the error legs with server-usability proofs); 304 tests total.)

#### Phase 120: Gates and docs

- [x] Task 120.100: Run the full gate chain on Node 26 and fix any drift (license headers, archunit, prettier). (the final-state confirming run after the C4 edits - all seven commands green, no drift found to fix: `npm ci`, `npm run lint`, `npm run format:check`, `npm run build`, `npm test -- --coverage` (17 files / 304 tests), `npm audit` (byte-identical to the documented residual), `uvx pre-commit run --all-files` (all seven hooks passed).)
- [x] Task 120.110: Update both C4 variants - `docs/c4/c4-container.puml` and `docs/c4/workspace.dsl` (kept byte-identical per the feat-17/18 convention) - moving `validate` from the planned list into the exposed tools (six tools; only `preview` remains planned), and update this feat's Progress section. (exactly one line changed per file; the shared description now reads "Exposes six MCP tools (create, change, import, export, parse, validate) ... the remaining Stage 1 tool (preview) is planned." - byte-identity between the variants verified by sha256 of the extracted description before and after the edit.)
- [ ] Task 120.120: Open the PR referencing issue #19. (left to the orchestrator's final step - the feat-18 convention - together with the frontmatter status flip from planning to review.)

## Progress

### Current Status

**As of 2026-11-10**: Phases 100-120 are implemented and
committed (e74c611 "feat(feat-19): add the bpmnlint dep,
.bpmnlintrc config, and core lint module" - Phase 100; c27760c
"feat(feat-19): add the validate MCP tool and wire the config
resource" - Phase 110; the Phase 120 docs/gates commit - the C4
tool-surface correction and this bookkeeping - lands on top) -
the feature implementation is complete and pending review.
All seven quality gates are green on Node 26 in the final-state
confirming run (17 test files / 304 tests; `npm audit`
unchanged from the baseline - only the documented archunit ->
minimatch 10.2.6 residual, listed twice). The C4 container
description in both `docs/c4` variants now lists the six
exposed tools (create, change, import, export, parse,
validate) with only `preview` remaining planned (the variants'
descriptions stay byte-identical, the feat-17/18 convention).
Task 120.120 (open the PR referencing GitHub issue #19) and the
frontmatter status flip are left to the orchestrator's final
step.

Background: `bpmnlint` 12.0.0 is committed as a runtime
dependency with the package-relative `.bpmnlintrc` extending
`bpmnlint:recommended` (next to `logging.json`); the core lint
module (`src/prc/lint.ts`) loads the config with structured
failure, validates a parsed or built tree (with the spike-driven
derived-reference backfill - `incoming`/`outgoing` plus the
`$parent` back-reference, restored after the lint), and
normalizes findings to `{ rule, elementId?, message }`; the
fixture pair is settled (`flawed-process.bpmn` authored with five
pinned findings; the clean reference reuses `order-process.bpmn`
per the spike verdict).

### Updates

<!-- Newest entry first -- prepend new entries directly below this comment. -->

#### 2026-11-10T02:03:57.000+01:00 - Phase 120: gates and docs

Phase 120 (Tasks 120.100-120.110) landed. The full gate chain
re-ran green on Node 26 as the final-state confirming run,
after the C4 edits, with no drift found to fix (all seven
commands from the repository root):

- **Gate evidence (Task 120.100)**: `npm ci` (exit 0, fresh
  install from the lockfile - `package-lock.json` unmodified,
  this phase added no dependencies); `npm run lint` (exit 0,
  clean); `npm run format:check` (exit 0, "All matched files
  use Prettier code style!" - `docs/` is in `.prettierignore`,
  so the C4 edits are exempt); `npm run build` (exit 0,
  type-check + emit, `dist/` rebuilt for the spawn tests);
  `npm test -- --coverage` (exit 0, 17 test files / 304 tests
  passed; coverage report-only per QA 0.0260: 94.8%
  statements, 88.47% branches, 99.38% functions, 94.83%
  lines - identical to the Phase 110 baseline); `npm audit`
  (only the documented residual - archunit -> minimatch 10.2.6,
  GHSA-g3hv-75wg-m249, moderate, listed twice: byte-identical
  to the Phase 100/110 baseline, as the npm manifests and
  lockfile are unchanged since c27760c); `uvx pre-commit run
--all-files` (all seven hooks passed: check yaml, fix end of
  files, trim trailing whitespace, ESLint, Prettier, tsc,
  vitest).
- **C4 correction (Task 120.110)**: the MCP Server container
  description in both `docs/c4/c4-container.puml` and
  `docs/c4/workspace.dsl` moves `validate` from the planned
  list into the exposed tools - exactly one line changed per
  file (verified by `git diff`), everything else untouched,
  and the pre-existing "bpmnlint validation (.bpmnlintrc,
  bpmnlint:recommended)" core-enumeration clause left as is
  (accurate, landed with the Phase 100 description). The
  shared sentence reads: before - "Exposes five MCP tools
  (create, change, import, export, parse) and two MCP
  resources (version, config) over stdio; the remaining Stage
  1 tools (validate, preview) are planned."; after - "Exposes
  six MCP tools (create, change, import, export, parse,
  validate) and two MCP resources (version, config) over
  stdio; the remaining Stage 1 tool (preview) is planned."
  **Byte-identity proof (the feat-17/18 convention)**: the
  description string was extracted from each file before and
  after the edit and compared - before: both 1101 chars,
  sha256
  4afae27609ce33b706dc4e020ae13a0a616ab9166d2e3da880022f13797cb61b
  (identical in both files); after: both 1098 chars, sha256
  c2443719988302e49a7a4bcb6c1363a5438f3fb8d7e88f01026518d6cea92bed
  (identical in both files), and `diff` of the two
  after-extractions exits 0 with no output; with the
  corrected sentence masked out, the rest of each description
  is byte-identical to its pre-edit text.
- **Task 120.120 and the status flip**: left to the
  orchestrator's final step (the feat-18 convention) - open
  the PR referencing GitHub issue #19 and flip the frontmatter
  status from planning to review; the Task 120.120 checkbox
  stays unticked in this plan.

#### 2026-11-10T00:50:48.000+01:00 - Phase 110: tool adapter (validate tool, config resource, the $parent backfill fix, tests)

Phase 110 (Tasks 110.100-110.120) landed, all seven quality gates
green from the repository root (amended 2026-11-10 with the
`$parent` backfill fix required by the orchestrator's verification):

- **`validate` tool (Task 110.100)**: registered on top of a new
  store operation `PrcStore.validateProcess(uuid, lintPackageRoot =
PACKAGE_ROOT)` (the store composes the lint, the adapter stays the
  1:1 mapper): draft-first (a session draft is linted from its
  in-memory tree, `outOfBandReRead: false`, no note - the feat-18
  `parse` convention), then the conditional re-read for registered
  processes; it mirrors `parseProcess` exactly (the `prc-validate`
  log event, the `precondition` usage, the `oneLine(uuid)`
  defense-in-depth comment). The input is the existing `UUID_V4`
  schema; the result is built from a `ValidateOutput` type inferred
  from the `VALIDATE_OUTPUT` zod schema (`status` is the plan's
  `z.union([z.literal('no-findings'), z.number().int().nonnegative()])`,
  `elementId` omitted when the finding attaches to no element, the
  `RE_READ_NOTE` spread convention). The description frames
  validation as explicit-only per QA 1.0060, documents the result
  shape and the current-state semantics, and points at the `config`
  resource for the rule set. Every failure the resolution and
  re-read path can surface (`process-not-registered`, `path-missing`,
  `not-bpmn`, `read-failed`) plus every lint-core failure
  (`config-missing`, `config-invalid`, `lint-failed`) is a
  single-line `isError` result (`PrcErrorCode` now includes
  `LintErrorCode`; nothing crashes the server). `store.ts` imports
  `lint.ts` (no cycle: `lint.ts` never imports the store);
  archunit stays green.
- **`config` resource (Task 110.110)**: the `bpmnlint` member
  replaces the `'not yet configured'` placeholder with the preset
  the committed config actually extends - read from the same
  `loadLintConfig` result the `validate` tool lints with (one
  resolution path, two consumers; `buildEffectiveConfig` and
  `createServer` take an injectable `lintPackageRoot`, default
  `PACKAGE_ROOT`, so `index.ts` is unchanged and the production
  behavior is byte-identical). Shape: on success `{ preset: string }`
  (the resolved `extends` - a string, the comma-joined array, or the
  `none` sentinel when the config extends no preset); on a missing
  or invalid config (ACC-005) the core's structured failure
  verbatim: `{ error: { code, message } }` (the core's
  `LintError` - the same code and message the `validate` tool
  reports).
- **The `$parent` backfill fix (orchestrator-verified defect,
  fixed in Phase 110)**: bpmnlint's connectivity rules
  (`no-disconnected`, `no-implicit-start`, `no-implicit-end`) read
  `node.$parent` unguarded; parsed trees carry the back-reference,
  but in-process-built trees (session drafts, and drafts promoted
  within the same session - promotion caches the built tree without
  a re-parse) never set it, so a sound seeded draft reported three
  crash-derived findings (the TypeError recorded as a finding). The
  lint core's backfill (now `backfillDerivedReferences`, the
  function formerly `backfillFlowReferences`) sets `child.$parent =
parent` first-write-wins in the same root-order walk that
  backfills `incoming`/`outgoing` (`walkElements` in `moddle.ts`
  gained an optional per-edge callback - the existing inventories
  are unchanged) and restores it exactly in the same `finally`
  (delete when it was not an own property, reset to `undefined`
  when it was): the caller's tree stays byte-stable on built trees
  as well (a re-export right after a validation does not flip
  `outOfBandReRead` - verified end-to-end). Parsed trees are
  untouched (first-write-wins). The flawed fixture's five pinned
  findings and the clean reference's zero findings are unchanged.
- **Tests (Task 110.120)**: 20 new legs (304 total, up from 284).
  Unit (`test/prc/lint.test.ts`, +1): a sound in-process-built
  draft (start -> task -> end, all named) validates to zero
  findings and its serialization stays byte-identical (this leg
  fails with a crash-derived finding before the fix - the pin).
  In-memory (`test/mcp-server.test.ts`, +13): the handshake
  asserts the six-tool surface; the config resource pins
  `bpmnlint: { preset: 'bpmnlint:recommended' }`; the validate
  block pins the five flawed-fixture findings with `status: 5`
  (ACC-001), `no-findings` for the clean reference (ACC-002), the
  empty-draft leg (an empty `create`d draft lints to the two
  required-event findings on the process id, `outOfBandReRead:
false`, no note, no file), the SEEDED-draft leg (named elements +
  connects -> `no-findings` from the in-memory tree), the
  PROMOTION leg (seeded draft -> export -> validate in the same
  session -> `no-findings`, pinning the built-tree cache path), an
  out-of-band re-read note leg, and the error legs (unknown uuid,
  deleted own file, corrupted own file, the uuid-shape zod
  rejection); the ACC-004/ACC-005 legs run against a temporary
  lint root injected through `createServer` (the committed
  `.bpmnlintrc` is never touched): a `rules` override
  (`no-disconnected: 'off'`) drops the corresponding finding (5 -> 4) while the resource still reports the extended preset, and a
  missing or malformed config is the same structured failure in
  both the resource and the `validate` result (identical code and
  message). Spawn (`test/mcp-server.spawn.test.ts`, +6): the
  six-tool handshake over real stdio, ACC-001 (the five pinned
  findings, `status: 5`), ACC-002 (clean reference `no-findings` +
  the resource's preset over stdio), the empty-draft leg
  (in-memory tree, no note, no prc file), the SEEDED-draft leg
  (over stdio, `no-findings`), and the error legs (unknown uuid,
  corrupted own file - each followed by a successful call proving
  the server and the registration stay usable).
- **Gate evidence** (final run, after the `$parent` fix): `npm ci`
  (exit 0, fresh install from the lockfile); `npm run lint` (exit
  0, clean); `npm run format:check` (exit 0, all matched files
  OK); `npm run build` (exit 0, type-check + emit, `dist/` rebuilt
  for the spawn tests); `npm test -- --coverage` (exit 0, 17 test
  files / 304 tests passed; coverage report-only per QA 0.0260:
  94.8% statements, 88.47% branches, 99.38% functions, 94.83%
  lines); `npm audit` (only the documented residual - minimatch
  7.0.0-11.0.0 GHSA-g3hv-75wg-m249 moderate via archunit, listed
  twice, identical to the Phase 100 baseline); `uvx pre-commit run
--all-files` (all seven hooks passed: check yaml, fix end of
  files, trim trailing whitespace, ESLint, Prettier, tsc, vitest).

#### 2026-11-09T21:10:30.000+01:00 - Phase 100: spike, config, and core

Phase 100 (Tasks 100.100-100.120) landed, all seven quality gates
green from the repository root:

- **Interop spike (Task 100.100)**: throwaway project
  (`/tmp/opencode/bpmnlint-spike`, outside the repository,
  `bpmnlint` latest + `bpmn-moddle` 10.3.1 - the workspace's exact
  version) pinned: (1) the version to commit is **bpmnlint 12.0.0**
  (MIT, `engines: node >= 24`; deps `@bpmn-io/lint-core` ^0.1.0,
  `bpmn-moddle` ^10.1.0, `bpmnlint-utils`, `min-dash`); (2) the entry
  API lints a **parsed moddle tree, not an XML string**: ESM
  `import { Linter } from 'bpmnlint'` (named export over the CJS
  `module.exports = { Linter }`) and
  `import NodeResolver from 'bpmnlint/lib/resolver/node-resolver'`
  (default export - the subpath exports the constructor itself);
  `new Linter({ resolver: new NodeResolver() })`, then
  `await linter.lint(rootElement, config)` with the **explicit config
  object as the second argument** - that is the package-relative
  resolution path: `extends: 'bpmnlint:recommended'` loads through
  the resolver's package-scoped `requireLocal` (verified identical
  results from an empty foreign cwd); (3) findings are a rule-keyed
  report map: `Record<ruleId, { id?, message, path?, meta, category }[]>`
  - `id` is the attached element's BPMN id (absent for process-level
    reports); (4) a bad `extends` preset or an unknown rule makes
    `lint` **throw synchronously** (not a rejection - the resolver
    throws during config resolution) with
    `cannot resolve config <X> from <bpmnlint>` /
    `cannot resolve rule <X> from <bpmnlint>`; (5) the
    `bpmnlint:recommended` preset carries 26 rules (17 `error`, 9
    `warn`: `ad-hoc-sub-process`, `conditional-flows`,
    `end-event-required`, `event-based-gateway`,
    `event-sub-process-typed-start-event`, `fake-join`, `global`,
    `label-required`, `link-event`, `no-bpmndi`, `no-complex-gateway`,
    `no-disconnected`, `no-duplicate-sequence-flows`,
    `no-gateway-join-fork`, `no-implicit-split`, `no-implicit-end`,
    `no-implicit-start`, `no-inclusive-gateway`,
    `no-overlapping-elements`, `single-blank-start-event`,
    `single-event-definition`, `start-event-required`,
    `sub-process-blank-start-event`, `superfluous-gateway`,
    `superfluous-label`, `superfluous-termination`). **The pivotal
    finding**: the connectivity rules read the derived BPMN 2.0
    attributes `incoming`/`outgoing` on flow nodes, which the
    bpmn-moddle parse leaves unset (the XSD declares them as optional
    child elements; bpmnlint's own rule-test fixtures write them into
    the XML explicitly). On a plain parse, `order-process.bpmn` reports
    seven spurious errors (`no-disconnected` x3, `no-implicit-end` x2,
    `no-implicit-start` x2) - the same CLI output. The core module
    therefore **backfills `incoming`/`outgoing` from every sequence
    flow's resolved `sourceRef`/`targetRef` before linting and restores
    the original property state in a `finally`** (serialization
    verified byte-identical after the restore, so the store's cached
    tree stays export-stable). **Clean-fixture verdict**: with the
    backfill, `test/fixtures/order-process.bpmn` lints to **zero
    findings** under `bpmnlint:recommended` -> **reused as the clean
    reference** (no dedicated fixture; the file is untouched).
- **Dependency and config (Task 100.110)**: `bpmnlint: ^12.0.0`
  added to `apps/mcp-server/package.json` `dependencies` (caret
  convention, the feat-2 precedent; the lockfile pins exactly
  12.0.0, and its `bpmn-moddle` range dedupes to the workspace's
  10.3.1 - a single copy). The committed `apps/mcp-server/.bpmnlintrc`
  (plain JSON, next to `logging.json`) is
  `{"extends": "bpmnlint:recommended"}` - the `extends` value the
  Phase 110 `config` resource will report. `npm audit` is
  byte-identical to the pre-change baseline (verified by re-running
  the audit against the HEAD manifests): the single documented
  residual, archunit -> minimatch 10.2.6 (GHSA-g3hv-75wg-m249,
  moderate, listed twice - once per tree node). No new advisories
  from bpmnlint or its transitive deps.
- **Fixtures (Task 100.115)**: `test/fixtures/flawed-process.bpmn`
  authored - a valid, parseable process `flawed-process` with a
  named start event, a `review` task, one sequence flow, a
  disconnected `orphan-task` (no sequence flow to/from it), and no
  end event, plus non-overlapping BPMNDI shapes (so
  `no-bpmndi`/`no-overlapping-elements`/`label-required` stay quiet
  and only the intended flaws report). Pinned findings (spike + unit
  test): `end-event-required` @ `flawed-process` ("Process is missing
  end event"), `no-disconnected` @ `orphan-task` ("Element is not
  connected"), `no-implicit-end` @ `orphan-task` and @ `review`
  ("Element is an implicit end"), `no-implicit-start` @ `orphan-task`
  ("Element is an implicit start") - the two intended flaws plus the
  connectivity consequences the recommended preset derives from the
  same gaps. Gate exemptions verified (feat-2 precedent): the
  license-header gate skips `.bpmn` and `.bpmnlintrc`
  (unrecognized extension / JSON - no comment support) and Prettier
  matches neither; no machine-config change was needed, and the full
  suite (incl. the `git ls-files`-based license gate) passes with
  both files present. No existing test scans `test/fixtures/` by
  name (all fixture access is by explicit filename; the inventory
  scans target `BPMN_MCP_DOCS_DIR`), so the new file changes no
  existing behavior.
- **Core module (Task 100.120)**: `src/prc/lint.ts` (the
  bpmnlint touch point, mirroring how `moddle.ts` owns bpmn-moddle):
  `loadLintConfig(packageRoot = PACKAGE_ROOT)` - the committed config
  resolved package-relative (never `process.cwd()`), a missing file
  is the structured `config-missing` failure and a non-object file
  (unparseable JSON, array, scalar, directory) is `config-invalid` -
  single-line message naming the path, never a throw (ACC-005;
  unlike `logging.json` there is no default to fall through to);
  `lintTree(rootElement, config)` - a fresh `Linter` + `NodeResolver`
  lints the tree with the derived-attribute backfill restored in
  `finally`, an unresolvable config (the synchronous throw pinned
  above) is the structured `lint-failed` failure; `validateTree`
  composes load + lint; findings normalize to
  `{ rule, elementId?, message }` (a process-level report carries no
  `elementId`), sorted by rule then element id for determinism. The
  ambient declaration `src/prc/bpmnlint.d.ts` closes the same
  no-`types`-condition gap as `bpmn-moddle.d.ts` (documenting the
  spike-verified CJS/ESM import shapes and the synchronous-throw
  caveat); `walkElements` is exported from `moddle.ts` for the
  backfill's cycle-safe walk. Unit tests `test/prc/lint.test.ts`
  (11 tests): the clean reference yields zero findings; the flawed
  fixture yields the five pinned findings (exact rule ids, element
  attachment, messages); a validation leaves the tree's
  serialization byte-identical (the backfill/restore contract);
  missing/malformed/non-object configs are structured failures; the
  bad-extends leg is a structured `lint-failed`; two
  cwd-independence legs (ACC-006) `chdir` into a temp dir and assert
  the same resolved path/config and the same pinned findings
  (restored in `afterEach`).
- **Gate evidence**: `npm ci` (exit 0, fresh install from the
  updated lockfile); `npm run lint` (clean); `npm run format:check`
  (all matched files OK); `npm run build` (type-check + emit,
  `dist/` rebuilt for the spawn tests); `npm test -- --coverage`
  (17 files / 284 tests passed; coverage report-only per QA 0.0260);
  `npm audit` (only the documented residual - identical listing to
  the pre-change baseline); `uvx pre-commit run --all-files` (all
  seven hooks passed).

#### 2026-11-09T18:17:10.000+01:00 - Refine-feature findings incorporated (pre-implementation)

The `feat-refiner` pass (2026-11-09) walked the full reference graph
(18 specmgr nodes + GitHub issue #19, verified open) and checked the
plan against the working tree. All findings are incorporated: E1
(`FEAT`-tagged dependencies; feat-1 added for the package-root
pattern), G1 (draft-first uuid resolution per the feat-18 `parse`
convention, user-confirmed), G2 (the full store failure set mapped to
structured `isError` results), G3 (ACC-005), G4 (Task 100.115 authors
the flawed fixture; the spike decides the clean reference,
user-confirmed), G5 (ACC-006, cwd-independence), G6 (the result shape
gains `uuid`, `outOfBandReRead`, `note`), D1 (the feat-11
`.bpmnlintrc` tarball obligation recorded in Design Notes,
user-confirmed option (a)), D2 (this `updated` bump), D3 (the
package-root pattern reattributed to feat-1), D4 (feat-11's stale
handshake pin recorded in Design Notes), and I1-I7 (reference tagging,
the seven-gate ACC-003, the `status` zod union, the `UUID_V4` uuid
shape / tool description / spike-pinned `bpmnlint` version, the
feat-11 forward reference, normalized timestamps, both C4 variants).

#### 2026-11-07T09:00:00.000+01:00 - Created

Initial feature plan for the `validate` tool, per GitHub issue #19
and QA pairs 7.0020/1.0060.

### Decisions Made

<!-- Newest entry first -- prepend new entries directly below this comment. -->

#### 2026-11-10T00:50:48.000+01:00 - Phase 110: store-side lint composition, the injectable lint root, the config failure shape, and the extended derived-reference backfill ($parent)

Decided in Phase 110: (1) the lint is composed in the STORE -- a
new `PrcStore.validateProcess(uuid, lintPackageRoot = PACKAGE_ROOT)`
runs the draft-first tree resolution + the conditional re-read
(mirroring `parseProcess` exactly) and then the core's
`validateTree`; the adapter maps the result 1:1 and never touches
the linter or the tree (store -> lint -> moddle; no cycle,
archunit green). `PrcErrorCode` gains the lint core's
`LintErrorCode` so every failure -- store-side and lint-side --
flows through the same `PrcError` shape and the existing
`toolError` mapping; (2) testability of ACC-004/ACC-005 via an
INJECTABLE LINT PACKAGE ROOT -- `createServer` (and
`buildEffectiveConfig`) take an optional `lintPackageRoot`
(default `PACKAGE_ROOT`), so the in-memory tests point the config
load at a temporary directory (a rewritten / absent / malformed
`.bpmnlintrc`) without ever touching the committed file;
`index.ts` passes the default and the production behavior is
byte-identical -- the ACC-004/ACC-005 legs are therefore tested
in-memory, and no spawn-level config mutation is needed; (3) the
`config` resource's `bpmnlint` member shape: `{ preset: string }`
on success (the resolved `extends` -- a string, the comma-joined
array, or the `none` sentinel following the otel member's
`disabled` convention) and `{ error: { code, message } }` on a
load failure (the core's `LintError` verbatim -- the same code and
message the `validate` tool reports, ACC-005); (4) the backfill was
EXTENDED IN PHASE 110 to set/restore the moddle `$parent`
back-reference as well (the function is now
`backfillDerivedReferences`): the same root-order walk that
backfills `incoming`/`outgoing` sets `child.$parent = parent`
first-write-wins (only when currently undefined -- parsed trees
already carry it, so they are untouched; the root keeps `$parent`
undefined) and restores it exactly in the same `finally` (delete
when it was not an own property, reset to `undefined` when it was),
keeping every caller's tree byte-stable. Rationale: the draft-first
decision (G1) plus export/promotion caching the in-memory BUILT
tree (no re-parse) make seeded drafts a first-class `validate`
target, and without the pass bpmnlint's connectivity rules
(`no-disconnected`, `no-implicit-start`, `no-implicit-end`) crash
per element on the unset `$parent` (`is(node.$parent,
'bpmn:AdHocSubProcess')`) -- bpmnlint records each TypeError as a
finding, so a sound seeded draft reported three crash-derived
findings, violating the finding-normalization contract (verified
against the built dist by the orchestrator; pinned by the new unit
leg, the in-memory seeded-draft and promotion legs, and the spawn
seeded-draft leg). The draft legs pin: the EMPTY `create`d process
(exactly two findings: `end-event-required` + `start-event-required`
on the process id), the sound SEEDED draft (zero findings), and the
PROMOTED seeded draft (zero findings, same session).

#### 2026-11-09T21:10:30.000+01:00 - Phase 100: the pinned bpmnlint version, the derived-attribute backfill, and the clean-reference verdict

Pinned by the Phase 100 spike and implementation: (1) the exact
`bpmnlint` version to commit is **12.0.0** (the spike's version,
declared `^12.0.0` per the workspace caret convention, lockfile-pinned
to 12.0.0) - the 12.x line is a thin wrapper over the internal
`@bpmn-io/lint-core` package, which the spike verified against
bpmn-moddle 10.3.1 (the workspace's exact version; the lockfile
dedupes to a single bpmn-moddle copy); (2) the **clean-reference
verdict: reuse `test/fixtures/order-process.bpmn`** - it lints to
zero findings under the committed config, but only with decision (3):
the core lint module **backfills the derived BPMN 2.0 attributes
`incoming`/`outgoing` from the sequence flows' resolved
`sourceRef`/`targetRef` before linting and restores the original
property state afterwards** (a `finally`, byte-stable serialization
verified) - without it, the `bpmnlint:recommended` connectivity rules
(`no-disconnected`, `no-implicit-start`, `no-implicit-end`) misfire on
every connected diagram, because the bpmn-moddle parse leaves the
derived attributes unset (bpmnlint's own rule-test fixtures write
them into the XML explicitly); the backfill is the interop contract
of `lintTree`/`validateTree`, so Phase 110's tool adapter gets it for
free; (3) the config-load failure codes are **`config-missing`**
(absent file) and **`config-invalid`** (unparseable/non-object file),
plus **`lint-failed`** for linter-level resolution failures (unknown
`extends` preset or rule - bpmnlint throws these synchronously from
`lint`, so the core guards the call); all follow the store's
kebab-case `PrcError` code convention; (4) findings are normalized to
`{ rule, elementId?, message }` and sorted by rule then element id
(deterministic output regardless of the linter's rule resolution
order); (5) the flawed fixture `test/fixtures/flawed-process.bpmn`
pins five findings - the two intended flaws
(`no-disconnected` @ `orphan-task`, `end-event-required` @
`flawed-process`) plus the recommended preset's derived
consequences (`no-implicit-end` @ `orphan-task` and @ `review`,
`no-implicit-start` @ `orphan-task`) - all asserted exactly (rule id,
element attachment, message).

#### 2026-11-09T18:17:10.000+01:00 - Draft-first resolution, the spike-driven clean fixture, and the feat-11 obligation

User decisions (2026-11-09, the refine-feature pass): (1) `validate`
on a draft-only uuid (no on-disk file) serves the in-memory draft's
tree and lints it - `outOfBandReRead: false`, no note - per the
feat-18 `parse` convention (G1); (2) the flawed fixture is authored
by Task 100.115, and the clean reference is decided by the Task
100.100 spike (reuse `order-process.bpmn` if lint-clean, else author
a dedicated fixture) (G4); (3) REQ-002's installed-package promise
stands - the obligation that feat-11's `files` whitelist and
packed-tarball set test gain `.bpmnlintrc` is recorded in Design
Notes for feat-11's own pass (D1, option (a)).

#### 2026-11-07T09:30:00.000+01:00 - .bpmnlintrc location: package-relative

User decision (2026-11-07): the config resolves package-relative
next to `logging.json` (REQ-002); the QA's repository-root wording is
superseded for the runtime, because an installed package has no
repository root. No new `BPMN_MCP_*` variable is introduced.

### Related PRs / Commits

- GitHub issue #19
