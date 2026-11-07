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

- [x] Task 100.100: Add the core editing module: `createProcess` (definitions/process tree, id generation) and the four change operations (add/update/connect/delete) on a parsed tree, with structured error types.
- [x] Task 100.110: Add the grid layout module (constants, first-free-slot placement, shape/edge emission) and wire DI into the editing operations.
- [x] Task 100.120: Add session-draft resolution to `PrcStore` (draft-first lookup, draft promotion on export) with unit tests.
- [x] Task 100.130: Unit tests for the editing and layout modules (fixture trees, error legs, grid non-overlap).

#### Phase 110: Tool adapters

- [x] Task 110.100: Register the `create` tool (zod schema, description per REQ-006) and the `change` tool (discriminated action union).
- [x] Task 110.110: Update the handshake/tool-surface tests and add spawn-level e2e legs (ACC-001..ACC-003).
- [x] Task 110.120: Verify every REQ-007 error leg returns `isError` single-line and keeps the server usable.

#### Phase 120: Gates and docs

- [ ] Task 120.100: Run the full gate chain on Node 26 and fix any drift (license headers, archunit, prettier).
- [ ] Task 120.110: Update the C4 container description (the tool list) and this feat's Progress section.
- [ ] Task 120.120: Open the PR referencing issue #17.

## Progress

### Current Status

**As of 2026-11-07 (Phase 110 complete)**: The `create` and `change`
tools are registered over the Phase 100 core (the flat advertised
input, the discriminated-union operation assembly in the handler,
the 1:1 result mapping), the handshake lists all four tools, and the
spawn-level e2e legs prove ACC-001..ACC-003 and ACC-005 (every
REQ-007 error leg single-line `isError`, the server and the draft
state intact) over real stdio; the in-process adapter legs cover
the JSON shapes, the write-through persistence (REQ-005), and the
re-read note (REQ-004) for `change`. No core module changed. The
Phase 110 gate chain (`npm ci`, `lint`, `format:check`, `build`,
`test --coverage`) is green on Node 26 (238 tests, 94.64% statement
coverage). Next is Phase 120 (the full gate re-run and drift
checks, the C4 container description update, and the PR against
issue #17); after this feat merges, continue with feat-18, feat-19,
and feat-20 (all planned on `dev`), in that order.

### Updates

<!-- Newest entry first -- prepend new entries directly below this comment. -->

#### 2026-11-07T18:55:00.000Z - Phase 110 complete (create/change tool adapters, e2e legs)

Landed the Phase 110 deliverables. `src/server.ts` registers the
`create` tool (a name plus the optional initial elements in; the
draft identity JSON out) and the `change` tool (a uuid plus the
top-level action parameter per QA 1.0010 in; the flattened
operation detail out), both thin adapters over the Phase 100
`PrcStore` surface: zod validates the shape (unknown action and
element type, negative coordinates, empty name rejected at the MCP
layer), the handler re-parses the change arguments against the
`EDITING_OPERATION` discriminated union (the field-for-field mirror
of the core's `EditingOperation`), store failures map 1:1 to
single-line `isError` results, and successes map to flat JSON (the
change detail spread one level deep, its redundant `ok` dropped,
the re-read note convention kept). No core module changed. Tests:
the handshake assertion now lists exactly `change`, `create`,
`export`, `import` (in-process and spawn, feat-17 ACC-004); new
in-process adapter legs cover the create/change JSON shapes, the
family-aware generated ids, write-through for registered processes
(REQ-005), the change re-read note (REQ-004), and the REQ-007 error
legs (MCP-layer and core structured errors alike, single-line, the
draft left usable); new spawn e2e legs over real stdio prove
ACC-001 (create/add/add/connect/export round trip, re-parse,
element set, non-overlapping grid DI), ACC-002 (rename, delete
cascade, condition expression in the serialized XML), ACC-003
(standard sizes, first-free-slot grid placement, explicit
coordinates unchanged), and ACC-005 (the full error-leg sequence
followed by a successful change, the export promotion, and a
write-through update in the same session). One SDK finding shaped
the test assertions: the client prefixes MCP-layer validation
failures with `MCP error -32602: ` (still single-line) and renders
numeric issue paths in bracket form (`elements[0].type`). The full
Phase 110 gate chain is green on Node 26 (238 tests, 94.64%
statement coverage; `server.ts` at 100% statements).

#### 2026-11-07T14:05:00.000Z - Phase 100 complete (core editing, grid layout, session drafts)

Landed the Phase 100 deliverables. New core modules: `src/prc/editing.ts`
(`createProcess` plus the `addElement`/`updateElement`/`connect`/
`deleteElement` operations with the `EditingErrorCode` structured
errors, the family-aware generated ids, and the scoped property set)
and `src/prc/layout.ts` (the UPPER_SNAKE_CASE grid constants, the
first-free-slot scan, and the shape/edge emission the editing ops wire
in). `src/prc/moddle.ts` gained `createBpmnElement` (the factory touch
point) and an exported `isModdleElement` guard. `src/prc/store.ts` now
carries the in-memory draft map and the `createProcess`/`changeProcess`
operations (draft-first resolution, write-through for file-backed
processes, draft promotion on `exportProcess` with an explicit-path
rejection), and its `PrcErrorCode` is now `StoreErrorCode |
EditingErrorCode`. New tests: `test/prc/editing.test.ts`,
`test/prc/layout.test.ts`, and `test/prc/store-create-change.test.ts`.
A metamodel finding shaped the property set: bpmn-moddle declares
`isInterrupting` only on `bpmn:StartEvent`, so the core accepts it
there only (other types are a structured `unsupported-property`
error rather than a silently dropped value). The full Phase 100 gate
chain is green on Node 26 (223 tests, 94.46% statement coverage).

#### 2026-11-07T08:40:00.000Z - Created

Initial feature plan for the `create` and `change` tools, per GitHub
issue #17 and QA pairs 1.0010/1.0050/1.0060/1.0070.

### Decisions Made

<!-- Newest entry first -- prepend new entries directly below this comment. -->

#### 2026-11-07T18:55:00.000Z - change input: flat advertised shape, discriminated-union parse in the handler

Scoped decision (Task 110.100): the `change` tool advertises a flat
top-level input (uuid, the action enum, every per-action field
optional) -- QA 1.0010 makes `action` a top-level parameter, and
this MCP SDK version degrades a non-object input schema to an empty
object schema in `tools/list` (verified against the SDK source),
which would leave the agent blind to the tool's parameters. The
handler re-parses the arguments against `EDITING_OPERATION`, a real
`z.discriminatedUnion('action', ...)` mirroring the core's
`EditingOperation` field for field: its parse output is exactly the
operation the store takes (no casting), a missing per-action field
is a single-line `isError` worded like the SDK's own MCP-layer
validation error, and the unknown-action / unknown-element-type /
negative-coordinate rejections already happen at the MCP layer
through the flat shape's enums and coordinate guards.

#### 2026-11-07T18:52:00.000Z - create name blank-guard: min(1) at the MCP layer, the core owns "non-blank"

Scoped decision (Task 110.100): `create`'s name is
`z.string().min(1)` -- the empty string is rejected at the MCP
layer, and a whitespace-only name flows to the core's structured
`invalid-property` error ("the process name must be a non-blank
string"), so the semantic blank check has a single owner (the core,
implemented and unit-tested in Phase 100). Both legs are single-line
`isError` results, proven over the wire.

#### 2026-11-07T18:50:00.000Z - change success JSON: detail flattened one level deep, redundant `ok` dropped

Scoped decision (Task 110.100): the `change` success payload is
`{ uuid, action, ...detail, persisted, outOfBandReRead, note? }`
with the operation detail (ids, positions, or removal counts)
spread one level deep, consistent with the import/export style; the
detail's `ok: true` flag is dropped because the tool result already
conveys success through the absence of `isError`. `connect` exposes
its optional `name` as input (the core treats a blank name as
absent); its success detail stays the core's
`flowId`/`sourceId`/`targetId`/`conditionSet` (the flow name is not
echoed -- no core change for it).

#### 2026-11-07T14:02:00.000Z - Generated element ids start at `<prefix>_1`

Scoped decision 2, refined during implementation: generated ids are
`<type-prefix>_<n>` with the smallest free n starting at 1 (never the
bare prefix, e.g. the first generated task is `task_1`), respecting
existing ids of the same family. The bare-prefix variant was dropped
because it could collide with a caller-supplied bare id and reads
less consistently in serialized XML.

#### 2026-11-07T14:01:00.000Z - Coordinate rules for add/update

Coordinates are non-negative integers (NaN/Infinity/fractional/negative
are `invalid-coordinates`), honored as-is (never grid-snapped).
`add-element` needs both or neither of x/y (an omitted pair is grid
auto-placed); `update-element` accepts a single axis when the element
already has a DI shape (the other axis is kept) and fails otherwise.

#### 2026-11-07T14:00:00.000Z - connect auto-places missing endpoint DI

`connect` emits its DI edge from the two endpoint shapes; an endpoint
without a shape (e.g. an imported document without DI) gets a
grid-placed one as part of the connect, so every created or
repositioned element always carries DI (REQ-003) while pre-existing
DI is never modified.

#### 2026-11-07T13:59:00.000Z - update-element rejects x/y on sequence flows

Flow geometry belongs to `connect` (edge waypoints between shapes);
`update-element` with x/y on a sequence flow id is a structured
`unsupported-property` error rather than an ill-defined re-route.

#### 2026-11-07T13:58:00.000Z - Draft export to an explicit target path is rejected

`exportProcess` of a session draft with an explicit target path returns
a structured `draft-export-explicit-path` error: the own
`prc-<uuid>-<slug>.bpmn` write is the promotion, and an extra copy
would leave two files behind one process (breaking the single source
of truth, QA 1.0020). The draft stays intact and addressable after a
rejected promotion.

#### 2026-11-07T13:57:00.000Z - Process id derived from the create name

`createProcess` derives the `bpmn:Process` id from the given name: the
slugified name, prefixed `process-` when it would start with a digit
(BPMN ids are NCNames), and the constant `process` when the name
slugifies to nothing. The export slug derives from that id via
`deriveSlug` (the fallback filename stem never triggers because the
id is always slug-shaped).

#### 2026-11-07T13:56:00.000Z - update-element property set: name + isInterrupting (start events)

Scoped decision 1: beyond `name` (any flow element, nodes and sequence
flows alike), the documented simple-property set is `isInterrupting`
(a boolean) on start events only. During implementation it turned out
the bpmn-moddle metamodel declares `isInterrupting` on
`bpmn:StartEvent` only (default `true`, so a value equal to the
default is omitted from the XML, as BPMN semantics intend); setting it
on any other element type would be silently dropped by the serializer,
so those combinations are a structured `unsupported-property` error
instead. Every other property/element combination stays unsupported.

#### 2026-11-07T13:55:00.000Z - Caller-supplied element ids: optional, validated, generated otherwise

Scoped decision 2 (REQ-004): `add-element` and the initial elements of
`createProcess` accept an OPTIONAL id. When omitted (or empty) a
unique id is generated (element-type prefix plus incrementing numeric
suffix, e.g. `task_1`, `startEvent_2`); when supplied it must fit the
BPMN id shape (`invalid-id` otherwise) and must not already exist
anywhere in the document, model or DI (`duplicate-element-id`).

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
