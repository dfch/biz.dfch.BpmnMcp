---
classification: null
created: '2026-11-07T08:56:51.646+01:00'
id: feat-18-parse-tool
status: review
type: feat
updated: '2026-11-09T06:56:50.083+01:00'
version: 1.0.0
---

# Feature: The parse MCP Tool

## Plan

### Overview

Implements the `parse` tool (REQ a36fb3d9-a285-49c9-b5b4-deb2f55b8998)
per QA 818fac76-96fb-4e3c-acb8-e5520fab5913 (pair 1.0040): it
exposes a registered process as a structured, addressable model
instead of raw XML. For a given uuid (after the store's conditional
re-read, pair 1.0080), it returns every flow-model element with its
BPMN id, type, and name, plus every sequence and message flow with
its id, source, target, and condition expression where present. The
agent addresses elements by their BPMN id in subsequent `change`
calls. Builds on the existing metamodel-driven inventory walk in
`apps/mcp-server/src/prc/moddle.ts`: a new sibling function
`collectAddressableInventory` reuses the walk's machinery, while
`collectElementInventory` (currently id + type only, BPMNDI
included) is deliberately unchanged (Design Notes). Anchored in
GitHub issue #18.

### Requirements

- REQ-001: A `parse` tool: input a process uuid; output structured JSON - `{ elements: [{ id, type, name? }], flows: [{ id, kind, source, target, conditionExpression? }] }` where `name` and `conditionExpression` are omitted when absent or empty (`undefined` or `""`), `source`/`target` are omitted when the corresponding reference does not resolve to an element, and `kind` is `sequence` or `message` (derived from the moddle type). The result uses the same JSON text-block shape `import`/`export` already return, carrying `outOfBandReRead` and, on a re-read, the conditional single-line note (REQ-003).
- REQ-002: A sibling function `collectAddressableInventory` in `apps/mcp-server/src/prc/moddle.ts` captures element names and flow references (resolved `sourceRef`/`targetRef`, condition expression text) while staying metamodel-driven, cycle-safe, and deterministic; BPMNDI elements are excluded from its `elements` - the agent addresses elements by BPMN id in `change` calls and DI shapes/edges are not change-addressable (this feature's own recorded decision; QA pair 1.0040's "every element" reads as every flow-model element). `collectElementInventory` is deliberately unchanged: `uniqueDiId` (`apps/mcp-server/src/prc/layout.ts`) computes its taken-id set from it and relies on the full id set including BPMNDI ids, and feat-2's recorded decision that the production walk stays id/type only remains in force.
- REQ-003: The tool operates on the current state: the store's conditional re-read runs first, and an out-of-band re-read is noted in the result the same way `import`/`export` already do. For a uuid that resolves to an in-memory draft with no on-disk file, the tool serves the draft's tree with `outOfBandReRead: false` and no note (the draft is the current state; parse is read-only).
- REQ-004: Structured errors (`isError`, single-line message, no crash): unknown uuid, unparseable file (the store's existing `not-bpmn` path). Parse warnings (an unresolvable reference leaves the property unset) are swallowed, matching the current `parseBpmn` behavior; surfacing them is a follow-up candidate - recorded, not decided.
- REQ-005: Tests: unit legs for the new inventory (names present/non-empty/empty/absent, flows with and without conditions and with an empty condition, a message flow, an unresolvable flow reference, DI exclusion, deterministic ordering) and a spawn e2e leg (import the committed fixture `apps/mcp-server/test/fixtures/order-process.bpmn`, parse it, assert the exact element/flow set as hardcoded expected literals - not a set computed by the walk under test).
- REQ-006: The full gate chain stays green on Node 26; the handshake lists `parse`; the archunit layering and the license-header gate hold (the new function lives in the core, the adapter only registers the tool).

### Acceptance Criteria

- [x] ACC-001: `parse` on the committed fixture `order-process.bpmn` returns exactly the hardcoded expected element and flow literals, deterministically ordered (elements by (type, id), flows by id), with names and condition expressions exactly as present in the file.
- [x] ACC-002: An out-of-band edit of the process file between two `parse` calls is detected: the second result reflects the new state and notes the re-read.
- [x] ACC-003: Unknown uuid and unparseable-file legs return `isError` single-line; the server stays usable.
- [x] ACC-004: The handshake lists `parse` in addition to the existing tools; all pre-existing tests pass; `npm ci`, `lint`, `format:check`, `build`, and `test --coverage` are green on Node 26.

### Scope

#### Included

- The new `collectAddressableInventory` sibling function in `apps/mcp-server/src/prc/moddle.ts` (names, flow references, DI exclusion) and its unit tests; `collectElementInventory` itself stays unchanged.
- The `parse` tool adapter (zod schema, description) and the spawn e2e leg.
- The deletion of the test-local `collectRoundTripInventory` duplication, with the ACC-007 round-trip leg re-pointed at the production functions (Task 110.120).
- The C4 description update and this feat's Progress discipline.

#### Explicitly Out Of Scope

- Raw XML output (`export` already covers it) and nested/recursive tree renderings beyond the flat element/flow lists.
- Element properties beyond `name` (e.g. documentation, due dates) - a follow-up via numbering gaps.
- Any mutation: `parse` is read-only (the checksum re-read may update the cache, nothing else).

### Dependencies

#### Depends On

- FEAT feat-2-prc-import-export (the `PrcStore`, the `moddle.ts` inventory walk, the re-read machinery)
- DEC fdc84432-1b48-4eb9-82e0-ec13cb8cf8ba: Use a Node/TypeScript MCP Server for Agent-Driven BPMN Modeling
- GitHub issue #18

### Design Notes

- `kind` derives from the moddle type: `bpmn:SequenceFlow` to
  `sequence`, `bpmn:MessageFlow` to `message`; any other flow-like
  element type is an implementation-time question (expect none in
  Stage 1 diagrams) - recorded, not decided.
- `conditionExpression` is the text of the element's
  `conditionExpression` child where present and non-empty (text
  `""` counts as absent, as for `name`).
- Ordering: elements sorted by (type, id), matching the existing
  `compareElementRefs` comparator in
  `apps/mcp-server/src/prc/moddle.ts`; flows sorted by id, matching
  the existing ACC-007 e2e leg's sort. QA pair 1.0040 asks for a
  stable, addressable result, not a specific order.
- Sibling function, not in-place extension: `uniqueDiId`
  (`apps/mcp-server/src/prc/layout.ts`) takes its used-id set from
  `collectElementInventory` and needs the full id set including
  BPMNDI ids; feat-2's Progress 2026-11-01 Decisions Made (4) and
  post-implementation review finding I3 recorded the walk's current
  id/type-only, DI-inclusive shape; and feat-17 (create/change,
  status review) calls it through the store, so an in-place change
  would race that review. The function is named
  `collectAddressableInventory` and lives in `moddle.ts` beside the
  existing walk (a new file is out: `src/prc/inventory.ts` already
  means the process-directory inventory).

### Related Decisions

- DEC fdc84432-1b48-4eb9-82e0-ec13cb8cf8ba: Use a Node/TypeScript MCP Server for Agent-Driven BPMN Modeling
- QA 818fac76-96fb-4e3c-acb8-e5520fab5913 (pair 1.0040): what parse returns

### Task List

#### Phase 100: Core inventory extension

- [x] Task 100.100: Add `collectAddressableInventory` in `apps/mcp-server/src/prc/moddle.ts` beside the existing walk: element names and flow references (resolved `sourceRef`/`targetRef`, condition expression text); BPMNDI elements excluded; elements sorted by (type, id), flows by id; metamodel-driven and cycle-safe like the existing walk. `collectElementInventory` and `compareElementRefs` stay unchanged.
- [x] Task 100.110: Unit tests: names present/non-empty/empty/absent (empty and absent both omitted), sequence and message flows, condition with/without/empty, an unresolvable flow reference (omitted), DI exclusion, deterministic ordering.

#### Phase 110: Tool adapter

- [x] Task 110.100: Register the `parse` tool (zod schema, description, structured errors per REQ-004) on top of the store's re-read; the draft case per REQ-003.
- [x] Task 110.110: Update the handshake test; add the spawn e2e leg (ACC-001: import the `order-process.bpmn` fixture, parse, assert the hardcoded expected literals); add the out-of-band re-read leg (ACC-002: import the fixture so the process is registered, parse, edit the on-disk file out-of-band, parse again, assert the second result reflects the new state with `outOfBandReRead: true` and the single-line note); add the draft leg (REQ-003: parse a uuid with an in-memory draft and no on-disk file serves the draft's tree with `outOfBandReRead: false` and no note).
- [x] Task 110.120: Delete the test-local `collectRoundTripInventory` helper (`apps/mcp-server/test/mcp-server.test.ts`); re-point the ACC-007 round-trip leg's two-sided comparison at the production functions - flow-model invariance (elements with names, flows with resolved references) via `collectAddressableInventory`, full id-set invariance including BPMNDI via `collectElementInventory` - keeping the existing flow-shape pin; both production sorts match the helper's sort, so the assertions stay neutral; update the helper's doc-comment rationale (the feat-2 "not extended for the test's sake" note) to the sibling-function decision.

#### Phase 120: Gates and docs

- [x] Task 120.100: Run the full gate chain on Node 26 and fix any drift (license headers, archunit, prettier).
- [x] Task 120.110: Update the C4 container description (the tool list) and this feat's Progress section.
- [x] Task 120.120: Open the PR referencing issue #18.

#### Phase 130: Post-implementation review fixes

- [x] Task 130.100: Add the missing test legs (review finding I1): a dangling flow target leg in `apps/mcp-server/test/prc/moddle.test.ts` (G1: the `sourceRef` resolves, the `targetRef` dangles; the flow carries `source` and omits `target`, asserted with `toStrictEqual` like the neighboring legs), a sub-process depth leg in the same file (G4: a `bpmn:subProcess` with an inner start event, task, end event, and two inner sequence flows; the inner elements appear in `elements` with their types and the inner flows in `flows` with their resolved references, pinning the recorded Phase 100 Decision 2 "at any subprocess depth"), the `parseProcess` deleted-own-file leg in `apps/mcp-server/test/prc/store.test.ts` (G2: import the fixture, `rmSync` the own path, `parseProcess` returns `ok: false` with `error.code === 'path-missing'`, mirroring the `exportProcess` leg; closes the last unexecuted branch of `parseProcess`, the `toIoError` leg at `store.ts` ~line 670), and an artifact-exclusion leg in `moddle.test.ts` (G3, resolved per the orchestrator's option (a) after the finding came out wrong as described: a `bpmn:association` between the two participants of a `bpmn:collaboration` appears in NEITHER `elements` NOR `flows`, the participants and processes appear in neither, and the one flow-model element in a participant's process appears in `elements`; pins the corrected Phase 100 Decision 1 -- the rule stands, but its example was factually wrong: a `bpmn:Association` is an `Artifact` per the BPMN 2.0 XSD (`substitutionGroup="artifact"`) and the bpmn-moddle metamodel, not a flow-model element, and is excluded like the containers and the BPMNDI information because it is not change-addressable; the two JSDoc sentences in `apps/mcp-server/src/prc/moddle.ts` are corrected to match).
- [x] Task 130.110: Add the message-flow clause to the `parse` tool description in `apps/mcp-server/src/server.ts` (review finding I2): a message flow's source and target are its referenced participants, which are not part of elements -- in the existing string-concatenation style, every line within 120 columns, the rest of the description byte-identical.
- [x] Task 130.120: Make the `exportProcess` and `parseProcess` not-registered error messages parity-defensive in `apps/mcp-server/src/prc/store.ts` (review finding I3): the interpolated uuid is wrapped with `oneLine(uuid)` and each site carries the explanatory comment citing the finding (defense-in-depth: safe today only because the adapter enforces the v4-shape constraint), matching the `changeProcess` leg; the existing clean-uuid tests are unchanged and stay green (`oneLine` is the identity for them).
- [x] Task 130.130: Re-wrap the `createServer` JSDoc in `apps/mcp-server/src/server.ts` (review finding I4): the whole block now fills its lines naturally toward the 120-column limit (the two awkward short line pairs left over from the Phase 110 edit are gone); the comment text is byte-identical to the pre-re-wrap text except for where the line breaks fall (verified by whitespace-normalized comparison).

## Progress

### Current Status

**As of 2026-11-09**: Phases 100-120 implemented and
committed (9ddb91f, 1aa82d5, 8508017); Phase 130 (the
post-implementation review fixes, findings I1-I4) complete: all
four missing test legs added -- G1 (dangling flow target), G4
(sub-process depth), G2 (`parseProcess` path-missing), and G3
(artifact exclusion, resolved per the orchestrator's option
(a) after the finding came out wrong as described: a
`bpmn:Association` is an `Artifact`, not a `FlowElement`, so it
is excluded from both lists; the leg pins the actual behavior
and the two JSDoc sentences in `moddle.ts` are corrected, with
the correction of Phase 100 Decision 1's example recorded in
the Updates entry) -- plus the `parse` description
message-flow clause (I2, `server.ts`), the `exportProcess`/
`parseProcess` not-registered `oneLine` message parity (I3,
`store.ts`), and the `createServer` JSDoc re-wrap (I4,
`server.ts`). Gate chain green on Node 26: lint, format:check,
build, 270 tests with coverage (up from 266: the four added
legs). Status remains review; PR #22 open.

### Updates

<!-- Newest entry first -- prepend new entries directly below this comment. -->

#### 2026-11-09T05:56:50.083Z - Phase 130: post-implementation review fixes (I1-I4 addressed; G3 resolved per option (a): pin actual behavior, correct the JSDoc)

Finding I1 (the four missing test legs): three of the four
added. G1 in `apps/mcp-server/test/prc/moddle.test.ts` (the leg
"omits a dangling flow target (the source still resolves)"): a
sequence flow whose `sourceRef` resolves to a start event and
whose `targetRef` dangles carries `source` and omits `target`
(`toStrictEqual`, the symmetric leg of the existing
source-dangling leg) -- closes review gap G1. G4 in the same
file (the leg "reaches flow-model elements at any sub-process
depth"): a `bpmn:subProcess` with an inner start event, task,
end event, and two inner sequence flows -- the inner elements
appear in `elements` with their types (and the sub-process
itself, `bpmn:SubProcess`), the inner flows in `flows` with
their resolved references, the outer flow resolving to the
sub-process id -- closes review gap G4 and pins the recorded
Phase 100 Decision 2 ("at any subprocess depth"). G2 in
`apps/mcp-server/test/prc/store.test.ts` (the leg "returns a
structured path-missing error when the own file was deleted out
of band (REQ-004)"): the `parseProcess` mirror of the existing
`exportProcess` leg -- import the fixture, `rmSync` the own
path, parse -> `ok: false` with `error.code === 'path-missing'`
-- closes review gap G2 and executes the last unexecuted branch
of `parseProcess` (the `toIoError` leg, `store.ts` ~line 670).
G3 is resolved per the orchestrator's decision (option (a): pin
the actual behavior and correct the statements, no core change)
and added as the fourth leg in `moddle.test.ts` ("excludes
artifacts from both lists (an association is not a flow-model
element)"): a collaboration with two participants and a
`bpmn:association` between them (the association lives in
`collaboration.artifacts`) -- the association appears in
NEITHER `elements` NOR `flows`, the participants and the
processes appear in neither, and the one flow-model element in a
participant's process appears in `elements`, proving artifact
exclusion rather than whole-document exclusion. The original
finding asked to assert that the association "appears in
`elements` (it is a `bpmn:FlowElement`)", pinning the recorded
Phase 100 Decision 1 -- that premise was wrong, verified at
three levels before the decision: the official BPMN 2.0 XSD (the
bpmn-moddle-bundled `Semantic.xsd` line 66) places
`association` in `substitutionGroup="artifact"` (extending
`tArtifact`), the bpmn-moddle metamodel
(`resources/bpmn/json/bpmn.json`) declares `Association`'s
superClass as `Artifact` (the attribute names `sourceRef`/
`targetRef` were verified against it), and an end-to-end run of
`collectAddressableInventory` returns the association in
NEITHER list (`$instanceOf('bpmn:FlowElement') === false` at
runtime). Compressed rationale for pinning the actual behavior:
REQ-002 scopes `elements` to what the agent addresses by BPMN id
in `change` calls; `change` (feat-17's editing core) resolves
ids exclusively through the flow-model walk (`findFlowElement`,
the recursive `flowElements` walk) and has no operation for
artifacts, so an association id would be unaddressable --
listing it in `elements` would advertise an id the agent cannot
use. Option (b) (broadening the core) was rejected: it would
contradict the recorded design rationale, change the tool's
output shape post-PR, and still leave the artifact
unaddressable by `change`. CORRECTION of the recorded Phase 100
Decision 1: the rule it states stands unchanged (`flows`
carries only `bpmn:SequenceFlow` and `bpmn:MessageFlow`; any
other flow-like element type, expect none in Stage 1 diagrams,
appears in `elements` but in no `flows` entry), but its example
was factually wrong -- a `bpmn:Association` is an artifact, not
a flow-like element, and is excluded from both lists like the
container elements and the BPMNDI information because it is not
change-addressable. The two JSDoc sentences in
`apps/mcp-server/src/prc/moddle.ts` (`collectAddressableInventory`
and `toFlowRef`) that repeated the wrong example are corrected
to match.

Finding I2 (the `parse` tool description clause):
`apps/mcp-server/src/server.ts` -- the flows sentence of the
`parse` description now reads "(omitted when a reference does
not resolve; a message flow's source and target are its
referenced participants, which are not part of elements)",
inserted in the existing string-concatenation style with every
line within 120 columns and the rest of the description
byte-identical. It closes review finding I2 (the description
claimed the resolved endpoints are "the referenced elements'
BPMN ids", which is false for `kind: 'message'` -- the
endpoints are collaboration participants, never in `elements`,
the recorded Phase 100 Decision 2).

Finding I3 (the store not-registered message parity):
`apps/mcp-server/src/prc/store.ts` -- `exportProcess` and
`parseProcess` now single-line the user-input uuid with
`oneLine(uuid)` before interpolation into the
`process-not-registered` message, each site carrying the
explanatory comment citing this finding (defense-in-depth: safe
today only because the adapter enforces the v4-shape
constraint), matching the `changeProcess` leg. Identity-safe:
every existing test uses a clean v4-shaped uuid, for which
`oneLine` is the identity -- the pinned `process <uuid> is not
registered` messages in `store.test.ts` (the `exportProcess`
and `parseProcess` unknown-uuid legs) stay byte-identical and
unchanged, all green.

Finding I4 (the `createServer` JSDoc re-wrap):
`apps/mcp-server/src/server.ts` -- the JSDoc block now fills
its lines naturally toward the 120-column limit (the two
awkward short line pairs left over from the Phase 110 edit are
gone); verified the comment text is byte-identical to the
pre-re-wrap text except for where the line breaks fall
(whitespace-normalized comparison). `npm run format:check`
passes.

Gate chain green on Node 26 (lint, format:check, build,
`npm test -- --coverage`): 270 tests (266 + the four added
legs), `package-lock.json` unmodified.

#### 2026-11-09T00:29:38.776Z - All phases complete - feature ready for review

All three phases are implemented and committed: 9ddb91f
"feat(feat-18): add the collectAddressableInventory core walk"
(Phase 100), 1aa82d5 "feat(feat-18): register the parse MCP
tool" (Phase 110), and 8508017 "docs(feat-18): run the full
gate chain and update the C4 tool surface" (Phase 120). The
full gate chain is green on Node 26 with no drift: npm ci
(`package-lock.json` unmodified), lint, format:check, build,
and 266 tests with coverage (95.12% statements / 89.73%
branches / 99.31% functions / 95.15% lines; license-header and
archunit legs pass within the suite). The C4 container
description is updated in both `docs/c4` variants (five
exposed tools including parse; validate and preview remain
planned). All four acceptance criteria are met: ACC-001 by
the spawn hardcoded-literal leg, ACC-002 by the spawn
out-of-band re-read leg, ACC-003 by the spawn unknown-uuid and
corrupted-file legs, and ACC-004 by the five-tool handshake
pins in both MCP-level suites plus the full gate chain.

#### 2026-11-09T00:22:49.577Z - Phase 120 implemented (gates and docs)

Tasks 120.100/120.110 done. The full gate chain ran on Node
26.13.0 in order, every command exit 0, no drift found to fix:
`npm ci` (`package-lock.json` unmodified - this feature added no
dependencies), `npm run lint`, `npm run format:check` ("All
matched files use Prettier code style!"), `npm run build`
(typecheck + emit), and `npm test -- --coverage` (16 test files,
266 tests passed, coverage 95.12% statements / 89.73% branches
/ 99.31% functions / 95.15% lines; the license-header drift
gate and the archunit architecture legs - CONSTITUTION §4, QA
7.0030 - pass within the suite, verified by name). The MCP
Server container description in `docs/c4/c4-container.puml` and
`docs/c4/workspace.dsl` (kept byte-identical, the feat-17
convention) now lists five exposed tools (create, change,
import, export, parse) with only validate and preview remaining
planned, and the prc core enumeration gains the compact clause
"the addressable inventory for parse (flow-model elements with
names, sequence/message flows with resolved references, BPMNDI
excluded)". Task 120.120 (open the PR referencing issue #18)
and the status flip are left to the orchestrator's final step.

#### 2026-11-09T00:05:24.485Z - Phase 110 implemented (the parse tool adapter)

Tasks 110.100/110.110/110.120 done. `apps/mcp-server/src/prc/store.ts`
gains the public `parseProcess(uuid)` (exported `ParseSuccess`/
`ParseFailure`/`ParseResult`): DRAFT-FIRST resolution (a session
draft is served from its in-memory tree -- no file access, no
checksum, `outOfBandReRead: false`; a registered process is served
after the conditional re-read, REQ-003), the `AddressableInventory`
computed by `collectAddressableInventory` (imported from
`./moddle.js`), unknown uuid -> `process-not-registered` (the
`exportProcess` message shape), a re-read that no longer parses ->
`not-bpmn`, a filesystem failure -> `read-failed`, and a
`prc-parse` structured log event on both success legs.
`apps/mcp-server/src/server.ts` registers the `parse` tool (input
`{ uuid }` with the v4-shape zod constraint; the multi-line
description; the success payload `uuid`/`elements`/`flows`/
`outOfBandReRead` plus `note` only on re-read; failures via
`toolError`). Tests: the handshake now pins five tools in both
`mcp-server.test.ts` and `mcp-server.spawn.test.ts`; the spawn
suite gains the ACC-001 leg (the hardcoded element/flow literals of
`order-process.bpmn`), the ACC-002 out-of-band re-read leg, the
REQ-003 draft leg (created, not exported; no prc file), and the
ACC-003 legs (unknown uuid, corrupted own file -- the server and
the registration stay usable); `store.test.ts` gains five
`parseProcess` legs (registered success, draft-first without file
access, unknown uuid in every directory state, out-of-band
modification, `not-bpmn`); the in-process suite gains a minimal
adapter block (success JSON shape, unknown uuid, zod shape
rejection) without duplicating the mandated spawn legs. The
test-local `collectRoundTripInventory` helper (and its local
types/guards) is deleted; the ACC-007 leg re-points at
`collectAddressableInventory` (flow-model invariance) and
`collectElementInventory` (full id-set invariance, BPMNDI
included, pinned strictly richer), keeps the flow-shape pin
(extended with `kind: 'sequence'`), and carries the relocated
sibling-function rationale as its comment. Gate chain green on
Node 26: lint, format:check, build, 266 tests (coverage 95.12%
statements).

Decisions Made:

1. The store-level `parseProcess` is the home of the conditional
   re-read, the draft-first resolution, and the inventory
   computation; the adapter stays a thin mapper (architecturally
   forced by the core/adapter layering: `src/prc` never sees the
   MCP SDK, and the tool result's `elements`/`flows` come from the
   store's `inventory` field, spread one level deep).
2. The `parse` uuid input uses the v4-shape zod constraint (the
   `UUID_V4` schema), for consistency with `change`, the newest
   uuid-input tool; `import`/`export` keep their legacy plain
   `z.string()` (feat-2 territory, untouched).
3. The success payload carries `uuid` like import/export, and the
   `note` only on a re-read (the established convention).
4. The unknown-uuid message follows `exportProcess`'s shape
   (`process ${uuid} is not registered`, no `oneLine` wrap): at
   the adapter layer the v4-shape constraint makes the uuid safe,
   and the store-level shape matches the sibling the task pinned.
5. The ACC-007 leg additionally asserts the full
   (`collectElementInventory`) id set is strictly larger than the
   addressable element set, pinning the container/BPMNDI coverage
   the test-local helper never had.
6. The spawn ACC-003(b) leg proves registration survival by
   restoring the original bytes after the corrupted parse and
   asserting a successful cache-hit parse (`outOfBandReRead:
false` -- the failed re-read left the cache untouched).

#### 2026-11-08T23:10:10.913Z - Phase 100 implemented (core inventory extension)

Tasks 100.100/100.110 done. `apps/mcp-server/src/prc/moddle.ts`
gains the exported `collectAddressableInventory(rootElement)`
(returning `{ elements: AddressableElement[], flows:
AddressableFlow[] }`, the new exported types `FlowKind`,
`AddressableElement`, `AddressableFlow`, `AddressableInventory`)
beside the existing walk: elements carry `id`, `type`, and `name`
(omitted when absent or empty); flows carry `id`, `kind`
(`sequence`/`message`), `source`/`target` resolved from
`sourceRef`/`targetRef` (omitted when unresolvable), and
`conditionExpression` (omitted when absent or empty). The
visited-set loop was factored into a shared private `walkElements`
helper (allowed by the task); `collectElementInventory`'s output and
its JSDoc (including the "covered alike" statement) and
`compareElementRefs` are unchanged - the pre-existing unit and
ACC-007 legs still pass byte-identical. Six unit legs added to
`apps/mcp-server/test/prc/moddle.test.ts` (names, flow kinds,
condition with/without/empty, unresolvable reference, DI exclusion
on the `order-process.bpmn` fixture, deterministic ordering). Gate
chain green on Node 26: lint, format:check, build, 253 tests
(coverage 95.11% statements).

Decisions Made:

1. The Design Notes' "implementation-time question" is resolved:
   `flows` carries only `bpmn:SequenceFlow` (`kind: 'sequence'`) and
   `bpmn:MessageFlow` (`kind: 'message'`); any other flow-like type
   (e.g. `bpmn:Association`) appears in `elements` but in no `flows`
   entry.
2. The `elements` predicate: the flow-model elements are the
   `bpmn:FlowElement` instances of every process (at any subprocess
   depth, via `$instanceOf`) plus the collaboration-scoped
   `bpmn:MessageFlow` elements matched by type - the metamodel
   declares them as plain `bpmn:BaseElement`, not flow elements
   (matching the BPMN 2.0 XSD). The container elements
   (`bpmn:Definitions`, `bpmn:Process`, collaboration/participants)
   and all BPMNDI/DC elements are thus excluded.
3. The condition expression text is the `body` attribute of the
   `conditionExpression` child (verified: bpmn-moddle reads the
   element's text content into `body`); a `bpmn:MessageFlow` carries
   no `conditionExpression` property in the metamodel, so it never
   has a condition.
4. `referenceId` (private) mirrors the test-local ACC-007 helper: a
   resolved element yields its id, a raw string reference its own
   value (defensive - a full parse leaves unresolvable references
   unset), everything else nothing.
5. The exact-shape test assertions use `toStrictEqual` (first use in
   the repo) to pin that omitted optionals are truly not set; no
   non-null assertions were introduced.

#### 2026-11-08T16:51:26.877Z - Plan refined (feat-refiner pass)

The feat-refiner findings (E1-E3, D1, G1-G6, I1-I5) were applied to
the plan.

Decisions Made:

1. Sibling function `collectAddressableInventory` in `moddle.ts`;
   `collectElementInventory` deliberately unchanged - `uniqueDiId`
   relies on its full (DI-inclusive) id set, feat-2's Decisions Made
   (4) and review finding I3 stay in force, and this avoids racing
   the feat-17 review (status review).
2. `parse` on a draft uuid (in-memory, no on-disk file) serves the
   draft's tree with `outOfBandReRead: false` and no note.
3. Parse warnings are swallowed (matches current `parseBpmn`
   behavior); surfacing them is a follow-up candidate - recorded, not
   decided.
4. The test-local `collectRoundTripInventory` dedup is in scope
   (Task 110.120): the ACC-007 leg re-points at both production
   functions, keeping the DI invariance coverage.

#### 2026-11-07T08:58:00.000Z - Created

Initial feature plan for the `parse` tool, per GitHub issue #18 and
QA 818fac76-96fb-4e3c-acb8-e5520fab5913 (pair 1.0040).

### Related PRs / Commits

- GitHub issue #18
- PR #22 (feat-18-parse-tool → dev): the parse MCP tool
