---
classification: null
created: '2026-11-07T08:58:41.011+01:00'
id: feat-19-validate-tool
status: planning
type: feat
updated: '2026-11-09T18:24:00.390+01:00'
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

- [ ] Task 100.100: Interop spike: pin the bpmnlint API shape (tree vs XML, finding structure, rule ids of the recommended preset, the exact `bpmnlint` version to commit per the feat-2 precedent of naming the spike's version) and the clean-fixture verdict (is `test/fixtures/order-process.bpmn` lint-clean under `bpmnlint:recommended` as extended by the config?) in a throwaway project outside the repository.
- [ ] Task 100.110: Add the `bpmnlint` runtime dependency (the exact version the Task 100.100 spike pinned) and the committed `.bpmnlintrc` extending `bpmnlint:recommended`, with package-relative resolution next to `logging.json`; verify `npm audit` against the documented residual.
- [ ] Task 100.115: Author the flawed lint fixture under `test/fixtures/` (a disconnected element, a process without an end event), settle the clean reference per the Task 100.100 spike verdict (reuse `order-process.bpmn` or author a dedicated lint-clean fixture), and verify the gate exemptions (`.bpmn` fixtures and the `.json` config need no machine-config change - the license gate and Prettier skip unrecognized extensions, the feat-2 "Gates and fixtures" precedent).
- [ ] Task 100.120: Add the core lint module (config load with structured failure, validate a parsed tree, finding normalization) and unit tests (clean, flawed, missing-config, cwd-independence legs).

#### Phase 110: Tool adapter

- [ ] Task 110.100: Register the `validate` tool (zod schema per REQ-004, the tool description - explicit-only framing per QA 1.0060, the result shape, a pointer to the `config` resource for the rule set - and the full structured-error set) on top of the store's re-read; the draft case per REQ-004 (draft-first, `outOfBandReRead: false`, no note).
- [ ] Task 110.110: Wire the `config` resource to report the configured preset (replace the placeholder).
- [ ] Task 110.120: Update the handshake test (the six-tool surface); add the spawn e2e legs (ACC-001, ACC-002, ACC-005, the draft leg, the error legs) and the config-drives-findings leg (ACC-004).

#### Phase 120: Gates and docs

- [ ] Task 120.100: Run the full gate chain on Node 26 and fix any drift (license headers, archunit, prettier).
- [ ] Task 120.110: Update both C4 variants - `docs/c4/c4-container.puml` and `docs/c4/workspace.dsl` (kept byte-identical per the feat-17/18 convention) - moving `validate` from the planned list into the exposed tools (six tools; only `preview` remains planned), and update this feat's Progress section.
- [ ] Task 120.120: Open the PR referencing issue #19.

## Progress

### Current Status

**As of 2026-11-09**: Planned; the config-location decision is
recorded (package-relative), and the 2026-11-09 refine-feature pass
pinned the remaining open points (draft-first uuid resolution, the
explicit fixture task with the spike-driven clean-fixture verdict, the
feat-11 `.bpmnlintrc` tarball obligation); no open decisions remain;
implementation not started.

### Updates

<!-- Newest entry first -- prepend new entries directly below this comment. -->

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
