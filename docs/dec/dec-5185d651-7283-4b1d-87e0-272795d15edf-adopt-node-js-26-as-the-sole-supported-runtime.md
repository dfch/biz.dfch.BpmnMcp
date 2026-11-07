---
classification: null
created: '2026-11-07T07:22:29.487+01:00'
id: 5185d651-7283-4b1d-87e0-272795d15edf
status: accepted
type: dec
updated: '2026-11-07T07:22:34.345+01:00'
version: 1.0.0
---

# Adopt Node.js 26 as the Sole Supported Runtime

## Context and Problem Statement

When this project started (see the related decision record), Node.js 24
("Krypton") was the newest LTS line and was chosen as the runtime floor.
Node.js 26 ("Lithium") entered Active LTS on 2026-10-28, and Node.js 24
moved to Maintenance LTS on 2026-10-20.

Dependabot PR #9 (bump `@types/node` from 24 to 26) forced the question
of which Node.js major this project supports: the `@types/node` major
should match the lowest Node version the code is allowed to run on. With
types at 26 and a runtime floor at 24, the compiler would accept
Node 25/26-only APIs that then fail at runtime on 24; keeping types at 24
while the floor moves to 26 leaves the new platform's APIs untyped.

## Decision Drivers

- `@types/node` must match the runtime floor, so type checking is
  meaningful on the oldest Node the project claims to support.
- The longest end-of-life window of the available LTS lines (Node 26:
  2029-04-30, versus Node 24: 2028-04-30).
- A single supported major keeps CI, docs, and `engines` unambiguous.
- Dependency compatibility: `vitest` 5 explicitly supports `>=26`, and
  every other direct dependency declares an `engines.node` range that
  Node 26 satisfies (pre-merge review of PR #9, 2026-11-07).
- Local-only / FOSS (CONSTITUTION) imposes no distribution constraint
  that would pin the floor lower; the package is `private` until feat-11
  publishes it.
- No Node 25/26-only feature is required today; the move is about the
  support window and types/runtime consistency, not new APIs.

## Considered Options

- Option 1: Node 26 only - raise the floor to 26 and align
  `@types/node` to 26 (PR #9).
- Option 2: Node 24 only - keep the floor at 24 and ignore
  `@types/node` major bumps until the floor moves.
- Option 3: Support both 24 and 26 - a CI matrix over both versions,
  `engines: >=24`, and `@types/node` pinned to 24.

## Decision Outcome

Chosen option: "Node 26 only", because it is the only option that
resolves the types/runtime mismatch (the driver that produced the
question), it buys roughly a year of additional end-of-life
(2029-04-30 over 2028-04-30), and it costs nothing: the codebase uses
only stable `node:` builtins that exist on both lines, and every direct
dependency accepts Node 26. Node 24 remains a supported (Maintenance)
LTS for users who stay on it; this project simply stops guaranteeing it.

### Consequences

- `engines.node` becomes `>=26` in the root `package.json` and in
  `apps/mcp-server/package.json`; Node 24 users get an `EBADENGINE`
  warning, not a hard failure (no `engine-strict` is configured).
- `.node-version`, `.github/workflows/ci.yml` (`node-version`),
  `CONTRIBUTING.md`, and the C4 documents all move to 26 in one change
  (feat-12).
- PR #9 (`@types/node` 26) is the aligned types dependency and is merged
  with or after the floor raise.
- PR #6 (TypeScript 7) stays blocked independently of this decision:
  `typescript-eslint` caps TypeScript below 6.1.0. A Dependabot ignore
  rule for TypeScript major updates is added alongside.
- The feat-11 (npm publish) plan publishes with `engines >=26`.

### Confirmation

This decision is confirmed when the gates (`npm ci`, `lint`,
`format:check`, `build`, `test --coverage`) pass in CI on Node 26
(`node-version: 26`) and every engine declaration and Node-version
reference in the repository states 26 (feat-12 acceptance criteria).

## Roles and Responsibilities

### Accountable

Ronald Rink

### Responsible

- Ronald Rink
- The implementing AI coding agent

### Support

### Consulted

### Informed

## Tags

- nodejs
- toolchain
- architecture

## Source

Dependabot PR #9 (`@types/node` 26) and the follow-up discussion of the
Node 24 vs. 26 LTS status (nodejs.org release schedule, checked
2026-11-07).

## Related Artifacts

### Decisions

- DEC fdc84432-1b48-4eb9-82e0-ec13cb8cf8ba: Use a Node/TypeScript MCP
  Server for Agent-Driven BPMN Modeling

## Pros and Cons

### Option 1: Node 26 only

- Good, because `@types/node` matches the runtime floor, so type
  checking is meaningful on the oldest Node the project supports.
- Good, because Node 26 (Lithium) is Active LTS with maintenance
  starting 2027-10-20 and end-of-life 2029-04-30 - about a year longer
  than Node 24.
- Good, because every direct dependency accepts Node 26; `vitest` 5
  declares `>=26` explicitly.
- Good, because a single supported major keeps CI, docs, and `engines`
  unambiguous.
- Bad, because developers and agent hosts still on Node 24 must upgrade;
  the `EBADENGINE` warning makes the mismatch visible but does not
  hard-fail.
- Bad, because it narrows the window in which an agent host can run the
  server; relevant once feat-11 publishes the package.

### Option 2: Node 24 only

- Good, because it keeps the widest compatibility with existing Node 24
  setups.
- Good, because Node 24 remains a supported LTS until 2028-04-30.
- Bad, because `@types/node` must then stay at 24 for as long as the
  floor holds, giving the project the shortest support window of the
  available lines.
- Bad, because it needs a standing Dependabot ignore rule for
  `@types/node` majors.

### Option 3: Support both 24 and 26

- Good, because it maximizes compatibility while still allowing 26.
- Bad, because `@types/node` must be pinned to 24 (the lowest supported
  version), so Node 26 APIs stay untyped - the driver of the question
  is not resolved.
- Bad, because a CI matrix over two Node versions doubles gate runtime
  for a project with a single build job.
- Bad, because the codebase uses no Node 25/26-only feature, so the
  extra coverage buys nothing today.

## More Information

Node.js release schedule (checked 2026-11-07, nodejs.org dist index and
Release/schedule.json): v24 "Krypton" - LTS 2025-10-28, maintenance from
2026-10-20, EOL 2028-04-30; v26 "Lithium" - LTS 2026-10-28, maintenance
from 2027-10-20, EOL 2029-04-30. The read-only pre-merge review of PR #9
(2026-11-07) found no deprecated or removed `node:` API usage in
`apps/mcp-server` and no dependency engine conflict on Node 26.
