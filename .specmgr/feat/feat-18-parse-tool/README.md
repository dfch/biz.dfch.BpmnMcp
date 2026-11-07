---
classification: null
created: '2026-11-07T08:56:51.646+01:00'
id: feat-18-parse-tool
status: planning
type: feat
updated: '2026-11-07T08:56:51.646+01:00'
version: 1.0.0
---

# Feature: The parse MCP Tool

## Plan

### Overview

Implements the `parse` tool (REQ a36fb3d9) per QA 1.0040: it exposes a
registered process as a structured, addressable model instead of raw
XML. For a given uuid (after the store's conditional re-read, QA
1.0080), it returns every element with its BPMN id, type, and name,
plus every sequence and message flow with its id, source, target, and
condition expression where present. The agent addresses elements by
their BPMN id in subsequent `change` calls. Builds on the existing
metamodel-driven inventory walk in `src/prc/moddle.ts`
(`collectElementInventory`, currently id + type only), which is
extended rather than replaced. Anchored in GitHub issue #18.

### Requirements

- REQ-001: A `parse` tool: input a process uuid; output structured JSON - `{ elements: [{ id, type, name? }], flows: [{ id, kind, source, target, conditionExpression? }] }` where `name` and `conditionExpression` are omitted when absent and `kind` is `sequence` or `message` (derived from the moddle type).
- REQ-002: The inventory walk (`moddle.ts`) is extended to capture element names and flow references (`sourceRef`/`targetRef`, condition expression text) while staying metamodel-driven, cycle-safe, and deterministic; BPMNDI elements are excluded from `elements` (they are not addressable model elements - recorded decision).
- REQ-003: The tool operates on the current on-disk state: the store's conditional re-read runs first, and an out-of-band re-read is noted in the result the same way `import`/`export` already do.
- REQ-004: Structured errors (`isError`, single-line message, no crash): unknown uuid, unparseable file (the store's existing `not-bpmn` path).
- REQ-005: Tests: unit legs for the extended inventory (names, flows with and without conditions, a message flow, DI exclusion, deterministic ordering) and a spawn e2e leg (import a committed fixture, parse it, assert the exact element/flow set).
- REQ-006: The full gate chain stays green on Node 26; the handshake lists `parse`; the archunit layering and the license-header gate hold (the extension lives in the core, the adapter only registers the tool).

### Acceptance Criteria

- [ ] ACC-001: `parse` on a committed fixture returns the expected, deterministically ordered element and flow sets with names and condition expressions exactly as present in the file.
- [ ] ACC-002: An out-of-band edit of the process file between two `parse` calls is detected: the second result reflects the new state and notes the re-read.
- [ ] ACC-003: Unknown uuid and unparseable-file legs return `isError` single-line; the server stays usable.
- [ ] ACC-004: The handshake lists `parse` in addition to the existing tools; all pre-existing tests pass; `npm ci`, `lint`, `format:check`, `build`, and `test --coverage` are green on Node 26.

### Scope

#### Included

- The `collectElementInventory` extension (names, flow references, DI exclusion) and its unit tests.
- The `parse` tool adapter (zod schema, description) and the spawn e2e leg.
- The C4 description update and this feat's Progress discipline.

#### Explicitly Out Of Scope

- Raw XML output (`export` already covers it) and nested/recursive tree renderings beyond the flat element/flow lists.
- Element properties beyond `name` (e.g. documentation, due dates) - a follow-up via numbering gaps.
- Any mutation: `parse` is read-only (the checksum re-read may update the cache, nothing else).

### Dependencies

#### Depends On

- feat-2-prc-import-export (the `PrcStore`, `moddle.ts` inventory walk, the re-read machinery)
- DEC fdc84432-1b48-4eb9-82e0-ec13cb8cf8ba: Use a Node/TypeScript MCP Server for Agent-Driven BPMN Modeling
- GitHub issue #18

### Design Notes

- `kind` derives from the moddle type: `bpmn:SequenceFlow` to
  `sequence`, `bpmn:MessageFlow` to `message`; any other flow-like
  element type is an implementation-time question (expect none in
  Stage 1 diagrams) - recorded, not decided.
- `conditionExpression` is the text of the element's
  `conditionExpression` child where present.
- Ordering: elements and flows are each sorted by id, matching the
  existing inventory's deterministic sort (QA 1.0040 asks for a
  stable, addressable result).

### Related Decisions

- DEC fdc84432-1b48-4eb9-82e0-ec13cb8cf8ba: Use a Node/TypeScript MCP Server for Agent-Driven BPMN Modeling
- QA pair 1.0040 (docs/qa/qa-818fac76): what parse returns

### Task List

#### Phase 100: Core inventory extension

- [ ] Task 100.100: Extend `collectElementInventory` (or add a sibling function) to capture element names and flow references with condition text, excluding BPMNDI elements; keep the walk metamodel-driven and cycle-safe.
- [ ] Task 100.110: Unit tests: names present/absent, sequence and message flows, condition with/without, DI exclusion, deterministic ordering.

#### Phase 110: Tool adapter

- [ ] Task 110.100: Register the `parse` tool (zod schema, description, structured errors per REQ-004) on top of the store's re-read.
- [ ] Task 110.110: Update the handshake test; add the spawn e2e leg (ACC-001) and the out-of-band re-read leg (ACC-002).

#### Phase 120: Gates and docs

- [ ] Task 120.100: Run the full gate chain on Node 26 and fix any drift (license headers, archunit, prettier).
- [ ] Task 120.110: Update the C4 container description (the tool list) and this feat's Progress section.
- [ ] Task 120.120: Open the PR referencing issue #18.

## Progress

### Current Status

**As of 2026-11-07**: Planned; no implementation started.

### Updates

<!-- Newest entry first -- prepend new entries directly below this comment. -->

#### 2026-11-07T08:58:00.000Z - Created

Initial feature plan for the `parse` tool, per GitHub issue #18 and
QA pair 1.0040.

### Related PRs / Commits

- GitHub issue #18
