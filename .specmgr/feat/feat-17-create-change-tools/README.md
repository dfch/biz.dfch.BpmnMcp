---
classification: null
created: '2026-11-07T08:55:38.554+01:00'
id: feat-17-create-change-tools
status: planning
type: feat
updated: '2026-11-07T09:56:22.910+01:00'
version: 1.0.0
---

# Feature: The create and change MCP Tools

## Plan

### Overview

Implements the two remaining mutating Stage 1 tools per QA 1.0010: a
`create` tool that builds a new BPMN 2.0 process from a structured
request (empty or with initial elements), and a single `change` tool
with an action parameter (`add-element`, `update-element`, `connect`,
`delete-element`) rather than a set of finer-grained tools. Both
address processes by UUID and operate on the bpmn-moddle tree through a
new core editing module on top of the feat-2 `PrcStore`; every
created or moved element always carries BPMN DI (explicit x/y or grid
auto-placement, QA 1.0050), so a diagram is viewable without a layout
dependency. Validation stays explicit-only (QA 1.0060): neither tool
runs bpmnlint, and the descriptions tell the agent to call `validate`.
Covers REQ 7b9dca78 (create) and REQ 8b53fa5a (change). Anchored in
GitHub issue #17.

### Requirements

- REQ-001: A `create` tool: input a process name plus optional initial elements (type, name, optional x/y); builds a new `bpmn:Definitions`/`BPMNProcess` tree with a fresh v4 UUID via bpmn-moddle; the process lives as an in-memory session draft (no file, no checksum) until the first `export` writes it to `docs/prc/` and registers it (QA 1.0070); returns the uuid and a created summary.
- REQ-002: A `change` tool: input uuid plus a discriminated `action` - `add-element` (type from the Stage 1 element set: start/end/intermediate-catch events, task, sub-process, exclusive/parallel gateway), `update-element` (name, plus a documented set of simple properties), `connect` (source/target element ids, optional condition expression text), `delete-element` (element id; connected sequence flows are removed with it - recorded decision); every element input accepts optional x/y.
- REQ-003: DI emission: every element created or repositioned by `create`/`change` gets a BPMNDI shape or edge; explicit x/y is honored as-is; omitted positions are grid auto-placed (fixed cell size, standard element sizes, first free slot); pre-existing DI is never touched.
- REQ-004: New elements receive unique ids within the process (generated prefix plus suffix); supplying an existing id is a structured error.
- REQ-005: Persistence of `change` mutations is write-through: every mutation serializes to the process's prc file and updates the checksum, keeping the file the single source of truth (QA 1.0020; user decision 2026-11-07).
- REQ-006: Tool descriptions state that the agent should call `validate` after a change it cares about (QA 1.0060); neither tool performs validation.
- REQ-007: Structured errors (`isError`, single-line message, no crash): unknown uuid, unknown action or element type, missing/unknown element id on connect/delete, invalid coordinates, duplicate element id.
- REQ-008: Architecture rules hold: the editing and layout logic lives in core modules under `src/` (no `@modelcontextprotocol/sdk` import, no adapter dependency); `server.ts` only registers the tools; the archunit suite and the license-header gate stay green.

### Acceptance Criteria

- [ ] ACC-001: A spawn-level round trip works: `create` (empty) then `change` (add two elements, connect them) then `export` - the exported file re-parses, carries the requested element set, and the new elements have non-overlapping grid DI.
- [ ] ACC-002: `update-element` renames, `delete-element` removes the element and its connected flows, and `connect` with a condition attaches the condition expression - each verifiable in the serialized XML.
- [ ] ACC-003: Elements without coordinates are grid-placed at the standard sizes; explicit coordinates appear unchanged in the XML.
- [ ] ACC-004: The handshake lists `create` and `change` in addition to the existing tools; all pre-existing tests pass; the full gate chain is green on Node 26 (`npm ci`, `lint`, `format:check`, `build`, `test --coverage`).
- [ ] ACC-005: Each error leg (unknown uuid, unknown type, connect to a missing element, duplicate id) returns `isError` with a single-line message and leaves the server and the process state usable.

### Scope

#### Included

- The core editing module (tree construction, add/update/connect/delete, id generation) and the grid layout module.
- The `create` and `change` tool adapters with zod input schemas, and the session-draft resolution in `PrcStore`.
- Unit tests (core) and spawn/e2e tests (tools), the handshake update.
- The C4 description update and this feat's Progress discipline.

#### Explicitly Out Of Scope

- Pools/lanes and message flows, data objects, groups, labels, multi-instance behavior (single-process Stage 1 diagrams; revisit via numbering gaps).
- Algorithmic auto-layout (QA 1.0050 records it as a follow-up improvement).
- The `validate` (feat-19), `parse` (feat-18), and `preview` (feat-20) tools.
- Any persistence-mode switch beyond the single recorded decision (REQ-005).

### Dependencies

#### Depends On

- feat-2-prc-import-export (the `PrcStore` core, the moddle helpers, the filename scheme)
- DEC fdc84432-1b48-4eb9-82e0-ec13cb8cf8ba: Use a Node/TypeScript MCP Server for Agent-Driven BPMN Modeling
- GitHub issue #17

### Design Notes

- **Session drafts.** A `create`d process has no file yet, so nothing to checksum: it lives in an in-memory draft map (uuid to tree) on the store. Every uuid-addressed tool resolves draft-first, then the on-disk inventory; a draft lost on restart is recorded, not recovered (QA 5.0010). `export` of a draft writes `prc-<uuid>-<slug>.bpmn` and promotes it to the inventory.
- **Change persistence (decided 2026-11-07, user): write-through.**
  Every `change` mutation serializes to the process's prc file and
  updates the checksum, keeping the file the single source of truth
  (QA 1.0020). The in-memory-until-export alternative (QA 5.0010's
  wording) was rejected: it would desynchronize the checksum/re-read
  machinery from the on-disk state.
- **Element set (decided 2026-11-07, user): sequence flows only.**
  REQ 8b53fa5a's text includes message flows, but a message flow only
  exists between two pools; pools/lanes are not in the REQ's element
  list, and containment layout is a different problem. Sequence flows
  plus the listed node types ship in this feat; pools/lanes/message
  flows are deferred to a later increment (numbering gaps reserved).
- **Delete semantics.** `delete-element` on a node removes the node and every sequence flow referencing it; on a flow removes just the flow.
- **Grid.** Fixed cell (80px), standard sizes (task/sub-process 100x80, event 36x36, gateway 50x50), first free slot from a fixed origin; the constants live in the layout module (UPPER_SNAKE_CASE, QA 0.0250).

### Related Decisions

- DEC fdc84432-1b48-4eb9-82e0-ec13cb8cf8ba: Use a Node/TypeScript MCP Server for Agent-Driven BPMN Modeling
- QA pairs 1.0010/1.0050/1.0060/1.0070 (docs/qa/qa-818fac76): the seven-tool surface, DI placement, explicit-only validation, phasing

### Task List

#### Phase 100: Core editing and layout

- [ ] Task 100.100: Add the core editing module: `createProcess` (definitions/process tree, id generation) and the four change operations (add/update/connect/delete) on a parsed tree, with structured error types.
- [ ] Task 100.110: Add the grid layout module (constants, first-free-slot placement, shape/edge emission) and wire DI into the editing operations.
- [ ] Task 100.120: Add session-draft resolution to `PrcStore` (draft-first lookup, draft promotion on export) with unit tests.
- [ ] Task 100.130: Unit tests for the editing and layout modules (fixture trees, error legs, grid non-overlap).

#### Phase 110: Tool adapters

- [ ] Task 110.100: Register the `create` tool (zod schema, description per REQ-006) and the `change` tool (discriminated action union).
- [ ] Task 110.110: Update the handshake/tool-surface tests and add spawn-level e2e legs (ACC-001..ACC-003).
- [ ] Task 110.120: Verify every REQ-007 error leg returns `isError` single-line and keeps the server usable.

#### Phase 120: Gates and docs

- [ ] Task 120.100: Run the full gate chain on Node 26 and fix any drift (license headers, archunit, prettier).
- [ ] Task 120.110: Update the C4 container description (the tool list) and this feat's Progress section.
- [ ] Task 120.120: Open the PR referencing issue #17.

## Progress

### Current Status

**As of 2026-11-07**: Ready for implementation. All design decisions
are recorded in Decisions Made (write-through persistence, sequence
flows only). Start on branch `feat-17-create-change-tools` (created
from `dev`); run the Task List phases in order (100 -> 110 -> 120),
with the phase-end gates per CONTRIBUTING section 6 (`npm ci`, `lint`,
`format:check`, `build`, `test --coverage` on Node 26); close with
one PR referencing issue #17. After this feat merges, continue with
feat-18, feat-19, and feat-20 (all planned on `dev`), in that order.

### Updates

<!-- Newest entry first -- prepend new entries directly below this comment. -->

#### 2026-11-07T08:40:00.000Z - Created

Initial feature plan for the `create` and `change` tools, per GitHub
issue #17 and QA pairs 1.0010/1.0050/1.0060/1.0070.

### Decisions Made

<!-- Newest entry first -- prepend new entries directly below this comment. -->

#### 2026-11-07T09:45:00.000Z - Element set: sequence flows only

User decision (2026-11-07): this feat ships sequence flows plus the
listed node types; pools/lanes/message flows are deferred (they
require the collaboration surface and containment layout - a later
increment; the numbering gaps are reserved for it).

#### 2026-11-07T09:30:00.000Z - Change persistence: write-through

User decision (2026-11-07): `change` mutations are write-through to
the process's prc file (REQ-005); the in-memory-until-export
alternative is dropped.

### Related PRs / Commits

- GitHub issue #17
