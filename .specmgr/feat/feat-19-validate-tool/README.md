---
classification: null
created: '2026-11-07T08:58:41.011+01:00'
id: feat-19-validate-tool
status: planning
type: feat
updated: '2026-11-07T09:11:29.048+01:00'
version: 1.0.0
---

# Feature: The validate MCP Tool (bpmnlint)

## Plan

### Overview

Implements the `validate` tool (REQ f93fb1c1) per QA 7.0020: it checks
a registered process against configurable BPMN modeling rules using
bpmnlint - the separate rule-based library that bpmn-moddle alone does
not provide (bpmn-moddle guarantees well-formed XML, not a sound
diagram). For a given uuid (after the store's conditional re-read),
`validate` reports each finding as rule, element id (where the finding
attaches to one), and message, plus an overall status (no findings /
N findings). The rule set is configurable through a committed
`.bpmnlintrc` JSON file that extends `bpmnlint:recommended` - that
config is the single source for the rules, and custom rules remain
possible by extending it. `bpmnlint` joins the app's runtime
dependencies, and the `config` MCP resource replaces its
`bpmnlint.preset: 'not yet configured'` placeholder with the preset
the config actually extends. Validation is explicit-only (QA 1.0060):
`create`/`change` never auto-lint. Anchored in GitHub issue #19.

### Requirements

- REQ-001: A committed `.bpmnlintrc` JSON config extending `bpmnlint:recommended` via its `extends` block - the single source for the rules and the configurability answer to the requirement.
- REQ-002: The config resolves package-relative (next to the app's committed `logging.json`, via the existing package-root pattern), so the same behavior holds from a repository checkout and from an installed/npx-ed package (user decision 2026-11-07; the QA's repository-root wording is superseded for the runtime, because an installed package has no repository root); the five documented `BPMN_MCP_*` variables stay unchanged, so no new env var is introduced.
- REQ-003: `bpmnlint` is added to the app's `dependencies` (runtime, not dev) and the lockfile is updated; the install stays clean on Node 26.
- REQ-004: A `validate` tool: input a process uuid; output `{ status, findings }` where `status` is `no-findings` or the finding count and `findings` is a list of `{ rule, elementId?, message }`; unknown uuid and unparseable files return structured `isError` results (single-line, no crash).
- REQ-005: The `config` MCP resource reports the preset the committed config extends (replacing the `'not yet configured'` placeholder in `server.ts`).
- REQ-006: Tests: a lint-clean process yields `no-findings` (or a pinned expected set if the recommended preset reports on clean diagrams); a deliberately flawed fixture (a disconnected element, a process without an end event) yields the expected rule ids with element attachment; a config-loading leg (missing/invalid config is a structured failure, not a crash); the full gate chain stays green on Node 26 with archunit and the license gate holding (the lint logic lives in a core module).

### Acceptance Criteria

- [ ] ACC-001: `validate` on the flawed fixture reports findings carrying the expected rule ids, element ids where applicable, and messages, and `status` matches the finding count.
- [ ] ACC-002: `validate` on a clean process reports `no-findings` (or the pinned set), and the `config` resource shows the configured preset.
- [ ] ACC-003: The handshake lists `validate`; all pre-existing tests pass; `npm ci`, `lint`, `format:check`, `build`, and `test --coverage` are green on Node 26.
- [ ] ACC-004: Editing `.bpmnlintrc` (e.g. disabling a rule) changes the reported findings accordingly - the config demonstrably drives validation.

### Scope

#### Included

- The `.bpmnlintrc` config and its package-relative resolution.
- The `bpmnlint` runtime dependency.
- The core lint module (config load + validate a parsed tree + finding normalization) and the `validate` tool adapter.
- The `config` resource wiring, tests, the C4 description update, and this feat's Progress discipline.

#### Explicitly Out Of Scope

- Per-process or per-call rule overrides, and custom bpmnlint rule authoring (possible by extending the config, not built here).
- Automatic validation on `create`/`change` (QA 1.0060 rejects it for Stage 1).
- A UI for findings; reporting beyond the tool result JSON.
- Any change to the five documented `BPMN_MCP_*` variables (feat-11's drift contract).

### Dependencies

#### Depends On

- feat-2-prc-import-export (the `PrcStore`, the moddle parse path, the package-root pattern)
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

### Related Decisions

- DEC fdc84432-1b48-4eb9-82e0-ec13cb8cf8ba: Use a Node/TypeScript MCP Server for Agent-Driven BPMN Modeling
- QA pairs 7.0020 and 1.0060 (docs/qa/qa-818fac76): the bpmnlint config and findings contract; explicit-only validation

### Task List

#### Phase 100: Spike, config, and core

- [ ] Task 100.100: Interop spike: pin the bpmnlint API shape (tree vs XML, finding structure, rule ids of the recommended preset) in a throwaway project outside the repository.
- [ ] Task 100.110: Add the `bpmnlint` runtime dependency and the committed `.bpmnlintrc` extending `bpmnlint:recommended`, with package-relative resolution next to `logging.json`.
- [ ] Task 100.120: Add the core lint module (config load with structured failure, validate a parsed tree, finding normalization) and unit tests (clean, flawed, missing-config legs).

#### Phase 110: Tool adapter

- [ ] Task 110.100: Register the `validate` tool (zod schema, description, structured errors) on top of the store's re-read.
- [ ] Task 110.110: Wire the `config` resource to report the configured preset (replace the placeholder).
- [ ] Task 110.120: Update the handshake test; add the spawn e2e legs (ACC-001, ACC-002) and the config-drives-findings leg (ACC-004).

#### Phase 120: Gates and docs

- [ ] Task 120.100: Run the full gate chain on Node 26 and fix any drift (license headers, archunit, prettier).
- [ ] Task 120.110: Update the C4 container description (the tool list) and this feat's Progress section.
- [ ] Task 120.120: Open the PR referencing issue #19.

## Progress

### Current Status

**As of 2026-11-07**: Planned; the config-location decision is
recorded (package-relative); no open decisions remain.

### Updates

<!-- Newest entry first -- prepend new entries directly below this comment. -->

#### 2026-11-07T09:00:00.000Z - Created

Initial feature plan for the `validate` tool, per GitHub issue #19
and QA pairs 7.0020/1.0060.

### Decisions Made

<!-- Newest entry first -- prepend new entries directly below this comment. -->

#### 2026-11-07T09:30:00.000Z - .bpmnlintrc location: package-relative

User decision (2026-11-07): the config resolves package-relative
next to `logging.json` (REQ-002); the QA's repository-root wording is
superseded for the runtime, because an installed package has no
repository root. No new `BPMN_MCP_*` variable is introduced.

### Related PRs / Commits

- GitHub issue #19
