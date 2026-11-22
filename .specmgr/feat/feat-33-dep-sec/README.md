---
classification: null
created: '2026-11-22T10:35:06.926+01:00'
id: feat-33-dep-sec
status: planning
type: feat
updated: '2026-11-22T10:35:06.926+01:00'
version: 1.0.0
---

# Feature: Dependency Security Policy and Gates

## Plan

### Overview

Dependabot PR #33 bumps the dev dependency `archunit` from 2.5.4 to
2.5.5, with `brace-expansion` moving from 5.0.12 to 5.0.13
transitively. The PR does not close the open Dependabot alert #1
(GHSA-g3hv-75wg-m249, moderate, CWE-405: minimatch denial of service
through globparts amplification). That alert is on
`node_modules/archunit/node_modules/minimatch@10.2.6`: the advisory
covers `>=7.0.0 <11.0.1`, and archunit 2.5.5 still declares
`minimatch ^10.0.1`. Production dependencies are clean
(`npm audit --omit=dev` reports 0 vulnerabilities). The repository
also has no machine gate for dependency advisories.

This feature fixes the current alert and sets up a dependency-security
policy in line with the constitution's machine-gate culture. It adds a
CI audit gate, confirms the CodeQL setup, adds Dependabot
security-update hygiene, and expands `SECURITY.md`.

### Requirements

- REQ-001: PR #33 (archunit 2.5.5) is merged into `dev`.
- REQ-002: The nested `minimatch` under `archunit` resolves to a version that is not affected by GHSA-g3hv-75wg-m249 (`>=11.0.1`), enforced through an `overrides` entry in the root `package.json`, and the archunit architecture suite still passes.
- REQ-003: CI fails when a production dependency has an advisory of any severity (`npm audit --omit=dev --audit-level=low`).
- REQ-004: CI fails when any dependency, dev included, has a high or critical advisory (`npm audit --audit-level=high`).
- REQ-005: CodeQL code scanning (default setup) stays enabled for the repository's languages, and the feature documents why it skips Dependabot PRs.
- REQ-006: `.github/dependabot.yml` groups minor and patch updates and keeps security updates in their own PRs, so advisories are not buried in routine bumps.
- REQ-007: `SECURITY.md` states the supported versions, a private reporting channel (GitHub private vulnerability reporting), the expected response time, and the dependency-advisory handling policy: thresholds, when an override is allowed, and when an alert may be dismissed and with what rationale.

### Acceptance Criteria

- [ ] ACC-001: PR #33 is merged and the root lockfile carries `archunit` 2.5.5.
- [ ] ACC-002: `npm ls minimatch --all` shows no `minimatch` below 11.0.1, `npm audit` reports 0 moderate-or-higher advisories, and Dependabot alert #1 is closed as fixed.
- [ ] ACC-003: On a clean checkout, `npm ci`, `npm run lint`, `npm run format:check`, `npm run build`, and `npm test -- --coverage` (including the archunit suite) pass locally and in CI.
- [ ] ACC-004: `.github/workflows/ci.yml` has both audit steps (prod at any severity, full tree at high), and a deliberate test, such as a temporary branch that pins a known-vulnerable version, shows that the gate fails.
- [ ] ACC-005: The CodeQL default setup is `configured` for javascript-typescript and actions, and its last scheduled run on `dev` or `main` is green.
- [ ] ACC-006: `.github/dependabot.yml` has the minor/patch grouping and keeps the existing TypeScript-major ignore rule (DEC 5185d651).
- [ ] ACC-007: `SECURITY.md` covers every item in REQ-007 and still has the SPDX header if it is in the scope of the license-header gate.

### Scope

#### Included

- Merging PR #33.
- The `minimatch` override that fixes GHSA-g3hv-75wg-m249.
- The two CI `npm audit` gates.
- Checking the CodeQL default setup.
- Dependabot grouping and security-update configuration.
- The `SECURITY.md` expansion.

#### Explicitly Out Of Scope

- Supply-chain attestation and provenance (SBOM, npm provenance, Sigstore). These belong to the feat-11 publishing work.
- Pinning every transitive dependency, or changing the lockfile policy beyond the single override.
- Replacing `archunit` with another architecture-testing library.
- Auditing the unrelated Python `uv` scaffold (`pyproject.toml`/`uv.lock`).
- License-compliance scanning of dependencies.

### Dependencies

#### Depends On

- PR #33 (archunit 2.5.4 to 2.5.5) is merged first, so the override targets archunit 2.5.5.

#### Blocks

- feat-11-npm-publish-mcp-registry (PR #28): nothing is published to npm or the MCP Registry until the dependency audit gate is in place.

### Design Notes

- Override shape: `"overrides": { "archunit": { "minimatch": "^11.0.1" } }` in the root `package.json`, scoped to archunit so that no other consumer is forced onto minimatch 11. This crosses a semver-major boundary for archunit's own dependency, so the archunit suite (`npm test`) is the compatibility check. If it fails, change course to a documented dismissal (dev-only, repo-controlled glob patterns, so not exploitable) and record a new decision.
- Audit thresholds: production code ships to users, so any advisory there fails CI. Dev tooling runs only on developer and CI machines with repo-controlled inputs, so only high and critical advisories fail CI there. Moderate dev-only advisories are handled through Dependabot alerts and this policy.
- CodeQL: the default setup (weekly, `default` query suite, `remote` threat model) is already configured for actions, javascript-typescript, and python. The "skipping" status on Dependabot PRs is expected default-setup behaviour, not a gap.
- The audit steps go after `npm ci` in the existing single `build` job, with `permissions: contents: read` unchanged.

### Related Decisions

- DEC 5185d651-7283-4b1d-87e0-272795d15edf (dec): Node.js 26 as the sole runtime, and the precedent for the Dependabot TypeScript-major ignore rule this feature must keep.
- DEC fdc84432-1b48-4eb9-82e0-ec13cb8cf8ba (dec): the Node/TypeScript MCP server architecture whose dependency tree this feature secures.
- CONSTITUTION: FOSS and local-only, and the machine-gate culture (policy is enforced by CI, not by convention).
- QA 818fac76-96fb-4e3c-acb8-e5520fab5913 (qa): the toolchain and CI-gate decisions (QA 0.0180, 0.0220-0.0290) that the new audit steps extend.

### Task List

#### Phase 100: Fix the current alert

- [ ] Task 100.100: Review and merge PR #33 (archunit 2.5.5) into `dev`.
- [ ] Task 100.110: Add the scoped `minimatch` override to the root `package.json` and regenerate `package-lock.json`.
- [ ] Task 100.120: Verify with `npm ls minimatch --all` and `npm audit`, and run the full local gate (lint, format:check, build, test with coverage).
- [ ] Task 100.130: Confirm that Dependabot alert #1 closes as fixed after the push.

#### Phase 110: CI audit gates

- [ ] Task 110.100: Add the `npm audit --omit=dev --audit-level=low` step to `.github/workflows/ci.yml`.
- [ ] Task 110.110: Add the `npm audit --audit-level=high` step to `.github/workflows/ci.yml`.
- [ ] Task 110.120: Prove that the gate fails, using a throwaway branch that pins a known-vulnerable version, then discard the branch.

#### Phase 120: Scanning and Dependabot hygiene

- [ ] Task 120.100: Confirm the CodeQL default-setup state and its last scheduled run, and record the result.
- [ ] Task 120.110: Add minor/patch `groups` to the npm and github-actions ecosystems in `.github/dependabot.yml`, and keep the TypeScript-major ignore rule.

#### Phase 130: Security policy

- [ ] Task 130.100: Expand `SECURITY.md`: supported versions, private vulnerability reporting, response time, and the dependency-advisory policy (thresholds, override, dismissal).
- [ ] Task 130.110: Enable GitHub private vulnerability reporting for the repository.
- [ ] Task 130.120: Check every acceptance criterion and the CONSTITUTION, then mark the feature done.

## Progress

### Current Status

**As of 2026-11-22**: Planning. PR #33 is open with CI `build` green
(CodeQL skipped, as expected for Dependabot PRs). Dependabot alert #1
(GHSA-g3hv-75wg-m249) is open on the dev-only nested
`minimatch@10.2.6`. `npm audit --omit=dev` is clean. No implementation
work has started.

### Blockers

- [ ] Upstream pin: archunit 2.5.5 still declares `minimatch ^10.0.1`. The scoped override is a workaround until ArchUnitTS raises its own range. Remove the override once upstream ships `minimatch >=11.0.1`.

### Updates

<!-- Newest entry first -- prepend new entries directly below this comment. -->

#### 2026-11-22 09:34:31.589Z - Created

The feature was created from Dependabot PR #33 after an analysis
showed that the archunit 2.5.5 bump leaves alert #1
(GHSA-g3hv-75wg-m249) open and that no CI gate exists for dependency
advisories.

### Decisions Made

<!-- Newest entry first -- prepend new entries directly below this comment. -->

#### 2026-11-22 09:34:31.589Z - Full dependency-security policy scope

The scope is the full policy: fix the current alert, add the CI audit
gate, check CodeQL, configure Dependabot hygiene, and expand
`SECURITY.md`. Fixing only the single alert was rejected, because the
same gap would let the next advisory through without notice.

#### 2026-11-22 09:34:31.589Z - npm overrides for the nested minimatch

The fix is a scoped `overrides` entry (`archunit` → `minimatch ^11.0.1`).
Waiting for upstream and dismissing the alert as not exploitable were
both rejected, so the alert is actually fixed and not just accepted.
If the archunit suite fails, the dismissal route becomes the fallback.

#### 2026-11-22 09:34:31.589Z - Audit thresholds

CI fails on a production advisory of any severity and on a high or
critical advisory anywhere in the tree. Moderate and low dev-only
advisories go through Dependabot alerts and this policy.

### Related PRs / Commits

- [PR #33](https://github.com/dfch/biz.dfch.BpmnMcp/pull/33): chore(deps-dev): bump archunit from 2.5.4 to 2.5.5, the trigger for this feature.
- [Dependabot alert #1](https://github.com/dfch/biz.dfch.BpmnMcp/security/dependabot/1): minimatch [GHSA-g3hv-75wg-m249](https://github.com/advisories/GHSA-g3hv-75wg-m249) (moderate), the alert REQ-002 fixes.
