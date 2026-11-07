---
classification: null
created: '2026-11-07T07:26:52.924+01:00'
id: feat-12-node-26-minimum
status: planning
type: feat
updated: '2026-11-07T07:40:38.654+01:00'
version: 1.0.0
---

# Feature: Node.js 26 as the Sole Supported Runtime

## Plan

### Overview

Per DEC 5185d651-7283-4b1d-87e0-272795d15edf (accepted), this feature
raises the project's Node.js floor from 24 to 26, making Node 26
("Lithium") the only supported runtime. It aligns every engine
declaration, CI, and doc with the floor, moves `@types/node` to 26
(aligning the type declarations with the oldest supported runtime), and
adds Dependabot housekeeping so a blocked major (TypeScript 7, held by
the `typescript-eslint` peer cap < 6.1.0) stops re-opening as a red PR.

### Requirements

- REQ-001: The Node.js floor is 26 in every engine declaration: `engines.node` is `>=26` in the root `package.json` and in `apps/mcp-server/package.json`, and `.node-version` contains `26`.
- REQ-002: CI runs the gates on Node 26: `node-version: 26` in `.github/workflows/ci.yml`, with `npm ci`, `lint`, `format:check`, `build`, and `test --coverage` green.
- REQ-003: The docs agree: the `CONTRIBUTING.md` prerequisite and the C4 docs (`docs/c4/workspace.dsl`, `docs/c4/c4-container.puml`) state Node.js 26.
- REQ-004: `@types/node` matches the floor: the root devDependency is `^26.6.6`, merged via Dependabot PR #9.
- REQ-005: `.github/dependabot.yml` ignores TypeScript major updates, and PR #6 is closed with the blocking reason recorded.

### Acceptance Criteria

- [ ] ACC-001: No live config or doc still says Node 24: no `>=24` engine, no `node-version: 24`, no "Node.js 24" outside the historical records (the done feat-1/feat-2 plans, `docs/qa`) and the `FORCE_JAVASCRIPT_ACTIONS_TO_NODE24` env (Actions runtime, not the project runtime).
- [ ] ACC-002: On a clean checkout with Node 26, `npm ci`, `npm run lint`, `npm run format:check`, `npm run build`, and `npm test -- --coverage` all pass locally and in CI.
- [ ] ACC-003: PR #9 is merged into `dev` and the root lockfile carries `@types/node` 26.x.
- [ ] ACC-004: The Dependabot TypeScript-major ignore rule is in place and PR #6 is closed.

### Scope

#### Included

- The floor-raise change (REQ-001..003), including the stale
  action-version comments in `ci.yml`.
- The `@types/node` 26 alignment (REQ-004) via PR #9.
- The Dependabot housekeeping (REQ-005).

#### Explicitly Out Of Scope

- Upgrading to TypeScript 7 (blocked by the `typescript-eslint`
  < 6.1.0 peer cap; revisit when typescript-eslint supports it).
- The feat-11 publishing work (npm/MCP Registry) and the `bin` shebang;
  feat-11's plan is only pointed at this feat.
- A Node 24 compatibility window or CI matrix (rejected by the DEC).

### Dependencies

#### Depends On

- DEC 5185d651-7283-4b1d-87e0-272795d15edf (accepted)
- GitHub issue #12

#### Blocks

- The engines wording of feat-11-npm-publish-mcp-registry
  (`engines >=26`)

### Design Notes

Historical records (the done feat-1 and feat-2 plans, `docs/qa`, the
"confirmed against Node 24.22.1" verification comment in
`apps/mcp-server/src/env.ts`) keep their "Node 24" wording as fact;
only live config and docs change. `FORCE_JAVASCRIPT_ACTIONS_TO_NODE24`
governs the runtime GitHub Actions uses for its own JS actions, not the
project runtime; it stays.

### Related Decisions

- DEC 5185d651-7283-4b1d-87e0-272795d15edf: Adopt Node.js 26 as the
  sole supported runtime (the rationale)
- DEC fdc84432-1b48-4eb9-82e0-ec13cb8cf8ba: Use a Node/TypeScript MCP
  Server for Agent-Driven BPMN Modeling

### Task List

#### Phase 100: Raise the floor to Node 26

- [x] Task 100.100: Set `engines.node` to `>=26` in the root `package.json` and `apps/mcp-server/package.json`; set `.node-version` to `26`.
- [x] Task 100.110: Set `node-version: 26` in `ci.yml`; fix the stale `checkout@v5` / `setup-node@v4 (v4.4.0)` comments to match the pinned v7 action SHAs.
- [x] Task 100.120: Update the `CONTRIBUTING.md` prerequisite and the C4 docs (`workspace.dsl`, `c4-container.puml`) from "Node.js 24" to "Node.js 26".
- [x] Task 100.130: Add the TypeScript-major ignore rule to `.github/dependabot.yml`.
- [x] Task 100.140: Run the gates locally on Node 26 (`npm ci`, `lint`, `format:check`, `build`, `test --coverage`) and open the PR referencing issue #12, the DEC, and this feat.

#### Phase 110: Align @types/node (PR #9)

- [ ] Task 110.100: After the Phase 100 PR merges, rebase Dependabot PR #9 (`@dependabot rebase`) and check CI green on Node 26.
- [ ] Task 110.110: Merge PR #9; verify the lockfile carries `@types/node` 26.x and re-run the gates.

#### Phase 120: Close out

- [ ] Task 120.100: Close PR #6 (TypeScript 7) with the blocking reason (typescript-eslint peer cap < 6.1.0).
- [ ] Task 120.110: Point the feat-11 plan at `engines >=26`; mark this feat done and record the merged PRs in Progress.

## Progress

### Current Status

**As of 2026-11-07**: Phase 100 complete. The floor raise, the doc
updates, the stale `ci.yml` comment fix, and the Dependabot ignore rule
are committed; all gates pass locally on Node 26.13.0 (153/153 tests,
95.07% statement coverage). The feat-11 plan is pointed at
`engines >=26`. Awaiting the PR merge; Phase 110 (PR #9) and Phase 120
(PR #6) follow.

### Updates

<!-- Newest entry first -- prepend new entries directly below this comment. -->

#### 2026-11-07T07:45:00.000Z - Phase 100 complete

Raised the Node.js floor to 26 (`engines` in both `package.json`
files, `.node-version`, `ci.yml` `node-version`), updated
`CONTRIBUTING.md` and the C4 docs, fixed the stale action-version
comments in `ci.yml`, added the TypeScript-major Dependabot ignore
rule, and pointed the feat-11 plan at `engines >=26`. Gates green on
Node 26.13.0: `npm ci`, `lint`, `format:check`, `build`, and
`test --coverage` (153/153 tests, 95.07% statements).

#### 2026-11-07T07:30:00.000Z - Created

Initial feature plan for the Node 26 floor raise, per DEC
5185d651-7283-4b1d-87e0-272795d15edf and issue #12.

### Decisions Made

<!-- Newest entry first -- prepend new entries directly below this comment. -->

#### 2026-11-07T07:30:00.000Z - One PR for the floor raise

The floor raise, the doc updates, and the Dependabot ignore rule ship
in a single PR (issue #12); PR #9 (Dependabot, `@types/node` 26) is a
separate merge that Phase 110 follows up. Historical "Node 24" records
stay untouched.

### Related PRs / Commits

- GitHub issue #12; DEC 5185d651-7283-4b1d-87e0-272795d15edf
- PR #9 (Dependabot: `@types/node` 26) - merges in Phase 110
- PR #6 (Dependabot: TypeScript 7) - closes in Phase 120
