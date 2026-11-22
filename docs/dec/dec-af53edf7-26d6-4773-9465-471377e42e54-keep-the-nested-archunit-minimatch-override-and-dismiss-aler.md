---
classification: null
created: '2026-11-22T11:18:57.854+01:00'
id: af53edf7-26d6-4773-9465-471377e42e54
status: accepted
type: dec
updated: '2026-11-22T11:22:04.727+01:00'
version: 1.0.0
---

# Keep the Nested archunit minimatch Override and Dismiss Alert 1 as Tolerable Risk

## Context and Problem Statement

Dependabot alert #1 reports GHSA-g3hv-75wg-m249 (moderate, CWE-405: a
potential denial of service in `minimatch` through globparts
amplification, affected range `>=7.0.0 <11.0.1`) on
`node_modules/archunit/node_modules/minimatch@10.2.6`. That copy is a
known residual from QA 818fac76 7.0030 ("Dependency audit note
(minimatch)"): the root `package.json` pins `"minimatch": "11.0.1"`
across the tree, and a nested override `"archunit": { "minimatch":
"10.2.6" }` keeps archunit's own copy on 10.2.6, because archunit calls
`minimatch.makeRe()`, which `minimatch` 11.0.1 removed.

FEAT feat-33-dep-sec planned to remove the nested override after the
bump to archunit 2.5.5 (PR #33, squash-merged as 1bbb477). Its
compatibility check (Task 100.105, 2026-11-22) found that archunit
2.5.5 still calls `minimatch.makeRe()` in
`dist/src/common/regex-factory.js:116` (`RegexFactory.globToRegExp`)
and still declares `"minimatch": "^10.0.1"`, and that the `minimatch`
11.0.1 package has no `makeRe` anywhere. The ArchUnitTS v2.5.5 release
note lists only a dev-dependency group bump. The question is how to
handle the residual and the open alert while no compatible archunit
release exists.

## Decision Drivers

- The architecture suite (CONSTITUTION §4) must keep working; it runs
  through archunit and its glob-to-regex code path.
- The residual is dev-only: `npm audit --omit=dev` reports 0
  vulnerabilities, and archunit runs only on developer and CI machines.
- The vulnerable path needs attacker-crafted glob patterns. The only
  glob patterns that reach archunit's `minimatch` come from this
  repository's committed test code, so no untrusted input reaches it.
- The advisory is moderate, below the planned CI full-tree audit
  threshold (`high`, feat-33 REQ-004).
- An open alert that is known and accepted hides new alerts; an
  accepted risk must be recorded with a reason and an exit trigger
  (machine-gate culture, CONSTITUTION §3).
- Replacing archunit is out of scope of feat-33.

## Considered Options

- Option 1: Keep the nested override and dismiss alert #1 as tolerable
  risk, with this record as the reason.
- Option 2: Remove the nested override, so archunit also gets
  `minimatch` 11.0.1.
- Option 3: Replace archunit with another architecture-testing library.
- Option 4: Keep the nested override and leave alert #1 open until
  upstream ships a fix.

## Decision Outcome

Chosen option: "Keep the nested override and dismiss alert #1 as
tolerable risk", because it is the only option that keeps the
architecture suite working without a scope change, and the residual is
not reachable by untrusted input: archunit is a dev-only consumer, and
its glob patterns come only from this repository's committed code.
Option 2 breaks archunit at runtime (`makeRe` is not a function in
`minimatch` 11.0.1). Option 3 is out of scope of feat-33. Option 4
leaves a permanently open, already-triaged alert that hides new ones.

### Consequences

- The root `package.json` keeps `"archunit": { "minimatch": "10.2.6" }`
  in `overrides`; the tree-wide `"minimatch": "11.0.1"` pin stays for
  every other consumer.
- Dependabot alert #1 is dismissed as "tolerable risk" with a comment
  that cites this decision record.
- `npm audit` continues to report the residual locally as moderate
  (`archunit` -> `minimatch` 10.2.6; npm counts `minimatch` and its
  dependent `archunit` as two entries of the same advisory).
  `npm audit --omit=dev` stays at 0, and the planned CI full-tree gate
  at `high` stays green.
- Exit trigger: when an ArchUnitTS release declares
  `minimatch >=11.0.1` or stops calling `minimatch.makeRe()`, upgrade archunit,
  remove the nested override, confirm with `npm ls minimatch --all` and
  `npm audit`, and re-open the dismissed alert so that it closes as
  fixed. Then mark this decision superseded.

### Confirmation

This decision is confirmed when the nested override is still in the
root `package.json`, `npm audit` reports only this residual as
moderate-or-higher, `npm audit --omit=dev` reports 0 vulnerabilities,
the archunit architecture suite passes, and Dependabot alert #1 is
dismissed as "tolerable risk" with a comment citing this record
(feat-33-dep-sec ACC-002 B).

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

- security
- dependencies
- toolchain

## Source

FEAT feat-33-dep-sec (Dependency Security Policy and Gates), Task
100.105 and Task 100.125 (2026-11-22): inspection of the
`archunit@2.5.5` and `minimatch@11.0.1` npm packages and the ArchUnitTS
v2.5.5 release note; Dependabot alert #1 and GHSA-g3hv-75wg-m249. The
residual originates in QA 818fac76-96fb-4e3c-acb8-e5520fab5913 pair
7.0030 ("Dependency audit note (minimatch)"), which introduced the
nested archunit override.

## Related Artifacts

### Decisions

- DEC fdc84432-1b48-4eb9-82e0-ec13cb8cf8ba: Use a Node/TypeScript MCP
  Server for Agent-Driven BPMN Modeling

## Pros and Cons

### Option 1: Keep the nested override and dismiss alert #1

- Good, because the architecture suite keeps working unchanged.
- Good, because the accepted risk is recorded with a reason and an
  exit trigger, and the alert list shows only untriaged alerts.
- Good, because production dependencies stay clean and the planned CI
  gates stay green.
- Bad, because a moderate advisory stays in the dev tree and in local
  `npm audit` output until upstream ships a fix.
- Bad, because the dismissal must be revisited by hand when the exit
  trigger fires.

### Option 2: Remove the nested override

- Good, because every `minimatch` in the tree would be on 11.0.1 and
  the alert would close as fixed.
- Bad, because archunit 2.5.5 calls `minimatch.makeRe()`, which
  11.0.1 removed, so the architecture suite breaks at runtime.

### Option 3: Replace archunit

- Good, because it could remove the dependency on `minimatch` 10.
- Bad, because it is out of scope of feat-33 and needs its own recorded
  decision (CONSTITUTION §4; QA 818fac76 7.0030 chose ArchUnitTS).

### Option 4: Keep the override and leave the alert open

- Good, because it needs no action now.
- Bad, because an open, already-triaged alert hides new alerts and
  records no reason or exit trigger.

## More Information

Related: QA 818fac76-96fb-4e3c-acb8-e5520fab5913 7.0030 (owns the
residual) and FEAT feat-33-dep-sec (`.specmgr/feat/feat-33-dep-sec/`,
Task 100.125, ACC-002 B).

Evidence (2026-11-22): `npm pack archunit@2.5.5` ->
`dist/src/common/regex-factory.js:116`:
`const ret = minimatch_1.minimatch.makeRe(pattern);`, and its
`package.json` declares `"minimatch": "^10.0.1"`. `npm pack
minimatch@11.0.1` -> no occurrence of `makeRe` in the package.
ArchUnitTS v2.5.5 release (2026-11-13,
https://github.com/LukasNiessen/ArchUnitTS/releases/tag/v2.5.5): "bump
the minor-and-patch group across 1 directory with 9 updates" only.
`npm audit fix --force` would downgrade archunit to 2.1.31 (breaking),
rejected as in QA 7.0030.
