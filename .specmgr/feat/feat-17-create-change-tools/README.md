---
classification: null
created: '2026-11-07T08:55:38.554+01:00'
id: feat-17-create-change-tools
status: review
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

- [x] ACC-001: A spawn-level round trip works: `create` (empty) then `change` (add two elements, connect them) then `export` - the exported file re-parses, carries the requested element set, and the new elements have non-overlapping grid DI.
- [x] ACC-002: `update-element` renames, `delete-element` removes the element and its connected flows, and `connect` with a condition attaches the condition expression - each verifiable in the serialized XML.
- [x] ACC-003: Elements without coordinates are grid-placed at the standard sizes; explicit coordinates appear unchanged in the XML.
- [x] ACC-004: The handshake lists `create` and `change` in addition to the existing tools; all pre-existing tests pass; the full gate chain is green on Node 26 (`npm ci`, `lint`, `format:check`, `build`, `test --coverage`).
- [x] ACC-005: Each error leg (unknown uuid, unknown type, connect to a missing element, duplicate id) returns `isError` with a single-line message and leaves the server and the process state usable.

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

- [x] Task 120.100: Run the full gate chain on Node 26 and fix any drift (license headers, archunit, prettier).
- [x] Task 120.110: Update the C4 container description (the tool list) and this feat's Progress section.
- [x] Task 120.120: Open the PR referencing issue #17.

#### Phase 130: Post-implementation review findings

- [x] Task 130.100: Fix E1 — the single-line `isError` contract for uuid inputs.
- [x] Task 130.110: Close the negative-leg test gaps G1 (failed change on a file-backed process leaves the file byte-identical), G2 (change after out-of-band corruption returns structured `not-bpmn`, file untouched), G3 (`sizeForElement` gateway-family fallback).
- [x] Task 130.120: Plan hygiene and honest descriptions — tick ACC-001..ACC-005, document ignored foreign per-action fields (I1), note the intermediate-catch-event spec incompleteness (I4), and record the deferred improvements (I2, I3, I5, I6) in an Updates entry.

## Progress

### Current Status

**As of 2026-11-07 (status `review`)**: All three implementation
phases (100/110/120) and the post-implementation review-fix phase
(130) are done and the full gate chain is green on Node 26 (243
tests, 95.04% statement coverage). The PR referencing GitHub issue
#17 is opened from this branch; after this feat merges, continue
with feat-18, feat-19, and feat-20, in that order.

### Updates

<!-- Newest entry first -- prepend new entries directly below this comment. -->

#### 2026-11-07T20:53:00.000Z - Phase 130 complete (post-implementation review findings: E1 fixed in both layers, G1/G2/G3 test legs added, plan hygiene)

Addressed the read-only feat review findings. E1 (the one true
contract slip, REQ-007/ACC-005): fixed in both layers -- the core
now single-lines every user-supplied uuid the `changeProcess` path
interpolates into a message (the `oneLine` wrap, the export/import
paths untouched, feat-2 territory), and the adapter shape-constrains
`change`'s `uuid` to a v4 UUID at the zod layer, so a control-character
uuid is rejected with the SDK's single-line `-32602` input-validation
error before it reaches the store; a spawn-level wire leg pins
`change {uuid: "a\nb"}` to `isError: true`, no line break in the
text, and one follow-up successful call (a store-level leg pins the
core message composition as well). G1/G2/G3 (test holes): new
store-level legs pin a failed change on a file-backed process leaving
the own file byte-identical (SHA-256) with the process still usable
(G1), a change after out-of-band corruption returning structured
single-line `not-bpmn` with the corrupted file byte-identical and the
store still usable for other processes (G2), and the `sizeForElement`
gateway-family fallback for `bpmn:InclusiveGateway` (G3). D1/I1/I4
(plan hygiene, honest descriptions): ACC-001..ACC-005 ticked (the
reviewer verified all five genuinely met), one sentence in the
`change` tool description noting that fields not belonging to the
chosen action are ignored (I1), and one sentence there noting that
intermediate catch events are created without an event definition and
will be flagged by `validate` until the message-flow increment lands
(I4; `create` left unchanged, one sentence total). Deferred as
follow-ups, one line each -- I2: sub-process family reachability
(`$instanceOf('bpmn:SubProcess')` instead of the exact type) for
imported AdHocSubProcess/Transaction inner elements; I3: the DI
operations address only the first diagram's plane; I5: `findFreeSlot`
is O(n^2) and throws raw on grid exhaustion instead of a structured
code; I6: a no-op `update-element` still rewrites the own file
(`persisted: true`) -- all out of Stage 1 scope or a later increment,
no tasks added for them. The full gate chain is green on Node 26
(243 tests, 95.04% statement coverage; the five new tests above, the
pre-existing 238 all still pass).

#### 2026-11-07T19:30:00.000Z - Marked ready for review

All three implementation phases (100/110/120) are complete and the
full gate chain is green on Node 26 (238 tests, 94.64% statement
coverage). The PR referencing GitHub issue #17 is opened from this
branch; the feat's status is now `review`.

#### 2026-11-07T19:11:00.000Z - Phase 120 complete (gates green on Node 26, C4 tool surface corrected)

Landed the Phase 120 deliverables (Task 120.120, the PR against
issue #17, stays with the orchestrator). The full gate chain on
Node 26 (v26.13.0) is green with no drift found and nothing to
fix: `npm ci` (323 packages), `npm run lint` (ESLint, clean),
`npm run format:check` (Prettier, clean), `npm run build` (tsc
noEmit + build, clean), `npm test -- --coverage` (16 files, 238
tests, 94.64% statement coverage). The C4 container description
was corrected in both `docs/c4/c4-container.puml` and
`docs/c4/workspace.dsl` (kept byte-identical, everything else
untouched): the server now exposes four MCP tools (create,
change, import, export) with validate, parse, and preview as the
remaining planned Stage 1 tools (feat-19, feat-18, feat-20), and
the prc core sentence now carries the in-memory session-draft map
(created-but-not-yet-exported processes, lost on restart) and the
editing/layout operations (create/add/update/connect/delete with
grid-placed BPMN DI, write-through persistence for file-backed
processes).

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

#### 2026-11-07T20:53:00.000Z - E1 adapter constraint: `change`'s uuid is a v4-uuid regex at the zod layer

Scoped decision (Task 130.100): the review offered two adapter-layer
shapes for the `change` uuid -- the v4-uuid regex or a looser
non-empty/no-control-char constraint. The v4-uuid regex was chosen:
every uuid this server assigns is a v4 (`crypto.randomUUID`,
`generateUuid`), so the shape is exactly the input's identity space;
the regex is already the repository's convention (`UUID_V4_SHAPE` in
both MCP-level test files); and it rejects a control-character uuid
with the SDK's own single-line `-32602` input-validation error
(message style consistent with the other MCP-layer rejections, e.g.
`... at uuid`). The accepted trade-off: a non-v4-shaped uuid (e.g.
`foo`) now errors at the MCP layer with the SDK message instead of
the store's `process foo is not registered` -- both are single-line
`isError` results, the wire contract (REQ-007/ACC-005) holds at
either layer, and every pre-existing test leg uses a v4-shaped
unknown uuid, so it still reaches the store unchanged. The
pre-existing `import`/`export` tools keep their plain `z.string()`
(feat-2 territory, untouched per the review); the core's `oneLine`
wrap of the `changeProcess` messages is the defense-in-depth second
layer for any store-level caller.

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
- Pull request #21 (https://github.com/dfch/biz.dfch.BpmnMcp/pull/21): the create and change MCP tools (status: review)
