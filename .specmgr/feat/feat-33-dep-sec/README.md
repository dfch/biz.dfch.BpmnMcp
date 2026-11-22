---
classification: null
created: '2026-11-22T10:35:06.926+01:00'
id: feat-33-dep-sec
status: planning
type: feat
updated: '2026-11-22T11:21:40.585+01:00'
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
`node_modules/archunit/node_modules/minimatch@10.2.6`, and the
advisory covers `>=7.0.0 <11.0.1`.

This copy is a known, deliberately kept residual (QA 818fac76
7.0030, "Dependency audit note (minimatch)"). The root `package.json`
already pins `"minimatch": "11.0.1"` across the whole tree, and a
nested override `"archunit": { "minimatch": "10.2.6" }` keeps
archunit's own copy on 10.2.6, because archunit 2.5.4 calls
`minimatch.makeRe()`, which 11.0.1 removed from its public exports.
archunit 2.5.5 still declares `minimatch ^10.0.1`, so whether 2.5.5
still calls `makeRe()` decides whether the nested override can go.
Production dependencies are clean (`npm audit --omit=dev` reports 0
vulnerabilities). The repository also has no CI gate for dependency
advisories; `npm audit` is a local-only gate today.

This feature removes the residual where archunit allows it, or
otherwise formally dismisses it, and sets up a dependency-security
policy in line with the constitution's machine-gate culture. It adds
CI audit gates, confirms the CodeQL setup, adds Dependabot
security-update hygiene, and expands `SECURITY.md`.

### Requirements

- REQ-001: Precondition, also listed under Depends On: PR #33 (archunit 2.5.5) is merged into `dev`.
- REQ-002: Exactly one of these holds. (A) Main path: the nested `archunit` → `minimatch 10.2.6` override is removed from the root `package.json`, so the existing tree-wide `"minimatch": "11.0.1"` pin also applies to archunit, every `minimatch` in the tree resolves to a version not affected by GHSA-g3hv-75wg-m249 (`>=11.0.1`), and the archunit architecture suite still passes. (B) Fallback path, taken only if archunit 2.5.5 is not compatible with minimatch 11 (Task 100.105 or the suite in Task 100.120): the nested override stays, Dependabot alert #1 is dismissed with a recorded reason, and the residual is recorded in a new decision record.
- REQ-003: CI fails when a production dependency has an advisory of severity low or higher (`npm audit --omit=dev --audit-level=low`). npm's `info` level is ignored on purpose: it marks informational notices, not vulnerabilities.
- REQ-004: CI fails when any dependency, dev included, has a high or critical advisory (`npm audit --audit-level=high`).
- REQ-005: CodeQL code scanning (default setup) stays enabled for actions, javascript-typescript, and python, and `SECURITY.md` documents why CodeQL skips Dependabot PRs.
- REQ-006: `.github/dependabot.yml` groups minor and patch version updates (`applies-to: version-updates`) and keeps security updates in their own PRs, and Dependabot security updates are enabled for the repository, so advisories are not buried in routine bumps.
- REQ-007: `SECURITY.md` states the supported versions, a private reporting channel (GitHub private vulnerability reporting), the expected response time (acknowledgement within 5 business days), and the dependency-advisory handling policy: thresholds, when an override is allowed, when an alert may be dismissed and with what reason, and how to triage a CI audit failure caused by a newly published advisory against an unchanged lockfile.

### Acceptance Criteria

- [x] ACC-001: PR #33 is merged and the root lockfile carries `archunit` 2.5.5.
- [ ] ACC-002: Exactly one of these holds, matching the REQ-002 path taken. (A) The root `package.json` has no nested `archunit` override, `npm ls minimatch --all` shows no `minimatch` below 11.0.1, `npm audit` reports 0 moderate-or-higher advisories, and Dependabot alert #1 is closed as fixed. (B) The nested override is still there, `npm audit` reports only the residual (`archunit` → `minimatch 10.2.6`, moderate) and nothing else moderate-or-higher, Dependabot alert #1 is dismissed as "tolerable risk" with a comment citing the new decision record, the decision record exists, and both CI audit gates are green, because the residual is dev-only and below the `high` threshold.
- [ ] ACC-003: On a clean checkout, `npm ci`, `npm run lint`, `npm run format:check`, `npm run build`, and `npm test -- --coverage` (including the archunit suite) pass locally and in CI.
- [ ] ACC-004: `.github/workflows/ci.yml` has both audit steps (production at low, full tree at high). Each step is proven separately to fail: one test pins a production dependency to a version with a low or moderate advisory and shows that the production step fails, and another pins a dev dependency to a version with a high or critical advisory and shows that the full-tree step fails. The proof is a CI run on a draft PR (closed without merge), with each failing run's link recorded in a Progress Update entry.
- [ ] ACC-005: The CodeQL default setup is `configured` for actions, javascript-typescript, and python, and its last scheduled run on `dev` or `main` is green. The result is recorded in a Progress Update entry.
- [ ] ACC-006: `.github/dependabot.yml` has the minor/patch grouping with `applies-to: version-updates` for the npm and github-actions ecosystems, keeps the existing TypeScript-major ignore rule (DEC 5185d651), and Dependabot security updates are enabled in the repository settings.
- [ ] ACC-007: `SECURITY.md` covers every item in REQ-007, including the 5-business-day acknowledgement, and GitHub private vulnerability reporting is enabled for the repository. `SECURITY.md` is documentation, so it needs no SPDX header (CONSTITUTION §1: documentation is covered by `LICENSE`).
- [ ] ACC-008: QA 818fac76 7.0030's audit note, the gate list in `CONTRIBUTING.md`, and FEAT feat-11-npm-publish-mcp-registry (ACC-001, its out-of-scope residual line, and its CI-parity note) match the outcome of this feature.

### Scope

#### Included

- Merging PR #33.
- Removing the nested archunit `minimatch` override, or, in the fallback path, dismissing alert #1 with a recorded decision.
- The two CI `npm audit` gates.
- Checking the CodeQL default setup.
- Dependabot grouping and security-update configuration.
- The `SECURITY.md` expansion.
- Updating the documents that quote the residual or the local-only audit gate (QA 7.0030, `CONTRIBUTING.md`, feat-11).

#### Explicitly Out Of Scope

- Supply-chain attestation and provenance (SBOM, npm provenance, Sigstore). These belong to the FEAT feat-11-npm-publish-mcp-registry publishing work.
- Pinning every transitive dependency, or changing the lockfile policy beyond removing (or keeping) the existing nested `archunit` → `minimatch` override. The other existing overrides (`minimatch`, `hono`, `@hono/node-server`) stay as they are.
- Replacing `archunit` with another architecture-testing library.
- Auditing the dependencies of the unrelated Python `uv` scaffold (`pyproject.toml`/`uv.lock`). CodeQL code scanning of its Python files stays enabled (REQ-005).
- License-compliance scanning of dependencies.

### Dependencies

#### Depends On

- PR #33 (archunit 2.5.4 to 2.5.5) is merged first (REQ-001), so the override change targets archunit 2.5.5.

#### Blocks

- FEAT feat-11-npm-publish-mcp-registry (PR #28): nothing is published to npm or the MCP Registry until the dependency audit gate is in place.

### Design Notes

- Override change (main path): delete the nested `"archunit": { "minimatch": "10.2.6" }` entry from the root `package.json` `overrides`. The existing tree-wide exact pin `"minimatch": "11.0.1"` then applies to archunit too, so no new entry is needed and the exact-version style of the existing overrides is kept. The pin already forces every other consumer (the eslint subtree, typescript-estree) onto 11.0.1, so this change affects only archunit.
- Compatibility check: Task 100.105 first inspects the archunit 2.5.5 package source and changelog for `makeRe` use (the reason for the nested override in QA 7.0030). If 2.5.5 still calls `minimatch.makeRe()`, the main path is not attempted and the fallback is taken. A green `npm test` is weak evidence on its own, because the architecture suite may not run every archunit code path that uses `makeRe`, so the source inspection is the deciding check and the suite is a confirmation.
- Fallback path: keep the nested override, dismiss alert #1 as "tolerable risk" (dev-only consumer, glob patterns come only from this repository's committed code, so the vulnerable path is not reachable by untrusted input), and record a new decision record. This is a re-plan point: record it in Decisions Made and switch to ACC-002 (B). `npm audit` still reports the residual locally, and the CI full-tree gate stays green because the residual is moderate and the threshold is high.
- Audit thresholds: production code ships to users, so any advisory of severity low or higher there fails CI. Dev tooling runs only on developer and CI machines with repo-controlled inputs, so only high and critical advisories fail CI there. Moderate dev-only advisories are handled through Dependabot alerts and this policy.
- New advisory against an unchanged lockfile: a newly published advisory can turn CI red on every open PR without any change in them. Triage policy (to go into `SECURITY.md`): the maintainer fixes it in a dedicated PR to `dev` (update, override, or documented dismissal) before other PRs merge. A temporary allow is acceptable only as an explicit, dated `SECURITY.md` entry naming the advisory and the follow-up, never by lowering the audit thresholds. `npm audit` needs the npm registry to be reachable; a registry outage fails the step, and the fix is to re-run the job, not to skip the step.
- CodeQL: the default setup (weekly, `default` query suite, `remote` threat model) is already configured for actions, javascript-typescript, and python. The "skipping" status on Dependabot PRs is expected default-setup behaviour, not a gap.
- Dependabot: the `groups` entries use `applies-to: version-updates` explicitly (rather than relying on the default) so security updates are never grouped and stay one PR per advisory.
- The audit steps go after `npm ci` in the existing single `build` job, with `permissions: contents: read` unchanged. `ci.yml` runs on `push` only for `main`/`dev` and otherwise on `pull_request`, so the gate-failure proof (Task 110.120) needs a draft PR.

### Related Decisions

- DEC 5185d651-7283-4b1d-87e0-272795d15edf (dec): Node.js 26 as the sole runtime, and the precedent for the Dependabot TypeScript-major ignore rule this feature must keep.
- DEC fdc84432-1b48-4eb9-82e0-ec13cb8cf8ba (dec): the Node/TypeScript MCP server architecture whose dependency tree this feature secures.
- CONSTITUTION: FOSS and local-only, the machine-gate culture (policy is enforced by CI, not by convention), and §1 (documentation is covered by `LICENSE`, not by SPDX headers).
- QA 818fac76-96fb-4e3c-acb8-e5520fab5913 (qa): the toolchain and CI-gate decisions (QA 0.0180, 0.0220-0.0290) that the new audit steps extend, and QA 7.0030, whose "Dependency audit note (minimatch)" introduced the nested archunit override and owns the residual this feature removes or dismisses.

### Task List

#### Phase 100: Fix the current alert

- [x] Task 100.100: Review and merge PR #33 (archunit 2.5.5) into `dev`.
- [x] Task 100.105: Inspect the archunit 2.5.5 package source and changelog for `minimatch.makeRe()` use, and record the result in a Progress Update entry. If it is still used, skip Tasks 100.110 to 100.130 and go to Task 100.125.
- [ ] Task 100.110: Remove the nested `archunit` → `minimatch` override from the root `package.json` and regenerate `package-lock.json`. Skipped, not applicable: archunit 2.5.5 still calls `minimatch.makeRe()` (Task 100.105), so the fallback path is taken.
- [ ] Task 100.120: Verify with `npm ls minimatch --all` and `npm audit`, and run the full local gate (lint, format:check, build, test with coverage). If the archunit suite fails, revert Task 100.110 and go to Task 100.125. Skipped, not applicable: main path not attempted (Task 100.105).
- [x] Task 100.125: Fallback only (REQ-002 B): keep the nested override, dismiss Dependabot alert #1 as "tolerable risk" with the reason from Design Notes, record a new decision record, and add a Decisions Made entry that switches to ACC-002 (B).
- [ ] Task 100.130: Main path only: confirm that Dependabot alert #1 closes as fixed after the push. Skipped, not applicable: fallback path taken (Task 100.105).

#### Phase 110: CI audit gates

- [ ] Task 110.100: Add the `npm audit --omit=dev --audit-level=low` step to `.github/workflows/ci.yml`.
- [ ] Task 110.110: Add the `npm audit --audit-level=high` step to `.github/workflows/ci.yml`.
- [ ] Task 110.120: Prove that each gate fails separately: from a throwaway branch, open a draft PR that pins a production dependency with a low or moderate advisory (production step fails), then change it to pin a dev dependency with a high or critical advisory (full-tree step fails). Record both failing run links in a Progress Update entry, then close the PR without merging and delete the branch.
- [ ] Task 110.130: Update the gate list in `CONTRIBUTING.md` so `npm audit` is listed as a CI gate with both thresholds, not as a local-only gate.

#### Phase 120: Scanning and Dependabot hygiene

- [ ] Task 120.100: Confirm the CodeQL default-setup state (actions, javascript-typescript, python) and its last scheduled run, and record the result in a Progress Update entry.
- [ ] Task 120.110: Add minor/patch `groups` with `applies-to: version-updates` to the npm and github-actions ecosystems in `.github/dependabot.yml`, and keep the TypeScript-major ignore rule.
- [ ] Task 120.120: Enable Dependabot security updates in the repository settings, and confirm that they are on.

#### Phase 130: Security policy

- [ ] Task 130.100: Enable GitHub private vulnerability reporting for the repository, then expand `SECURITY.md`: supported versions, private vulnerability reporting, the 5-business-day acknowledgement, the CodeQL note on Dependabot PRs, and the dependency-advisory policy (thresholds, override, dismissal, triage of a new advisory against an unchanged lockfile).
- [ ] Task 130.110: Confirm that private vulnerability reporting is enabled and that the reporting link in `SECURITY.md` opens the GitHub report form.
- [ ] Task 130.112: Amend the QA 818fac76 7.0030 "Dependency audit note (minimatch)": the residual is removed (main path) or formally dismissed with a reference to the new decision record (fallback path).
- [ ] Task 130.114: Update FEAT feat-11-npm-publish-mcp-registry: ACC-001's residual baseline, the out-of-scope residual line, and the CI-parity note (`npm audit` is now a CI gate).
- [ ] Task 130.120: Check every acceptance criterion and the CONSTITUTION, then mark the feature done.

## Progress

### Current Status

**As of 2026-11-22**: Phase 100 done on the fallback path (REQ-002 B,
ACC-002 B). PR #33 is squash-merged into `dev` as 1bbb477, and the
lockfile carries archunit 2.5.5 (ACC-001 met). archunit 2.5.5 still
calls `minimatch.makeRe()`, so the nested archunit → `minimatch
10.2.6` override stays, and the residual is recorded in DEC
af53edf7-26d6-4773-9465-471377e42e54. Dependabot alert #1 is dismissed
as "tolerable risk" with a comment citing that DEC (dismissal
performed by the orchestrator). `npm audit` reports only the residual
(moderate); `npm audit --omit=dev` is clean. Next: Phase 110 (CI audit
gates).

### Updates

<!-- Newest entry first -- prepend new entries directly below this comment. -->

#### 2026-11-22 10:18:36.463Z - Phase 100 done: fallback path

Task 100.100: PR #33 (archunit 2.5.4 → 2.5.5) was reviewed and
squash-merged into `dev` as 1bbb477, and feat-33 was rebased onto it.
`package-lock.json` carries `node_modules/archunit` 2.5.5.

Task 100.105 result: archunit 2.5.5 still uses `minimatch.makeRe()`.
`npm pack archunit@2.5.5` shows
`dist/src/common/regex-factory.js:116`:
`const ret = minimatch_1.minimatch.makeRe(pattern);`
(`RegexFactory.globToRegExp`), and its `package.json` still declares
`"minimatch": "^10.0.1"`. `npm pack minimatch@11.0.1` has no
occurrence of `makeRe` anywhere (dist/commonjs, dist/esm, `.d.ts`).
The ArchUnitTS v2.5.5 release note (2026-11-13) lists only "bump the
minor-and-patch group across 1 directory with 9 updates" (dev
dependencies); there is no `minimatch` change. The main path is
therefore not attempted: Tasks 100.110, 100.120, and 100.130 are
skipped as not applicable.

Task 100.125: the nested override stays unchanged. The new decision
record DEC af53edf7-26d6-4773-9465-471377e42e54 records the residual,
the rejected options, and the exit trigger. Dependabot alert #1 is
dismissed as "tolerable risk" with a comment citing the DEC (performed
by the orchestrator). `npm audit` reports only GHSA-g3hv-75wg-m249 on
`node_modules/archunit/node_modules/minimatch` (npm counts it as "2
moderate", `minimatch` plus its dependent `archunit`), `npm audit
--omit=dev` reports 0 vulnerabilities, and `npm ls minimatch --all`
shows only archunit's copy on 10.2.6 (every other copy is 11.0.1).
Locally, lint, format:check, and build pass, and `npm test --
--coverage` passes 360 of 363 tests (2 skipped), including the
archunit architecture suite and the license-header gate. One
preview-server child-process test fails locally with `ECONNRESET`
because the local shell runs Node 22.22.1, not the required Node 26
(`.node-version`); Phase 100 changed only documentation. CI on Node 26
is green for 1bbb477 (run 45011674894, "Lint and Test").

#### 2026-11-22 09:46:45.330Z - Plan refined

The plan was refined after a review. The fix is now described as
removing the existing nested archunit override (QA 7.0030) rather
than adding a new one. A `makeRe` check (Task 100.105) and a
conditional fallback task (Task 100.125) with its own acceptance
criteria were added. The gate-failure proof now uses a draft PR and
proves each gate separately. Dependabot security updates, the
new-advisory triage rule, and the updates to QA 7.0030,
`CONTRIBUTING.md`, and feat-11 were added.

#### 2026-11-22 09:34:31.589Z - Created

The feature was created from Dependabot PR #33 after an analysis
showed that the archunit 2.5.5 bump leaves alert #1
(GHSA-g3hv-75wg-m249) open and that no CI gate exists for dependency
advisories.

### Decisions Made

<!-- Newest entry first -- prepend new entries directly below this comment. -->

#### 2026-11-22 10:18:36.463Z - Switch to the fallback path (ACC-002 B)

archunit 2.5.5 still calls `minimatch.makeRe()`, which `minimatch`
11.0.1 removed (Task 100.105), so removing the nested override would
break the architecture suite. This is the planned re-plan point: REQ-002
(B) and ACC-002 (B) now apply, and REQ-002 (A) / ACC-002 (A) do not.
The nested archunit → `minimatch 10.2.6` override stays, and
Dependabot alert #1 is dismissed as "tolerable risk": archunit is a
dev-only consumer, its glob patterns come only from this repository's
committed code, so the vulnerable path is not reachable by untrusted
input, and the advisory is moderate, below the CI full-tree `high`
threshold. Replacing archunit (out of scope) and leaving the alert
open were rejected. Recorded in DEC
af53edf7-26d6-4773-9465-471377e42e54; its exit trigger is an
ArchUnitTS release that declares `minimatch >=11.0.1` or stops calling
`makeRe()`.

#### 2026-11-22 09:34:31.589Z - Full dependency-security policy scope

The scope is the full policy: fix the current alert, add the CI audit
gate, check CodeQL, configure Dependabot hygiene, and expand
`SECURITY.md`. Fixing only the single alert was rejected, because the
same gap would let the next advisory through without notice.

#### 2026-11-22 09:34:31.589Z - Remove the nested archunit override

The fix is to remove the existing nested `overrides` entry
(`archunit` → `minimatch 10.2.6`, introduced in QA 7.0030), so the
tree-wide `minimatch 11.0.1` pin applies to archunit too. Waiting for
upstream and dismissing the alert as not exploitable were both
rejected as the first choice, so the alert is actually fixed and not
just accepted. If archunit 2.5.5 still needs `minimatch.makeRe()`,
the dismissal route (Task 100.125, ACC-002 B) becomes the fallback
and is recorded in a new decision record.

#### 2026-11-22 09:34:31.589Z - Audit thresholds

CI fails on a production advisory of severity low or higher and on a
high or critical advisory anywhere in the tree. Moderate and low
dev-only advisories go through Dependabot alerts and this policy.

### Related PRs / Commits

- [PR #33](https://github.com/dfch/biz.dfch.BpmnMcp/pull/33): chore(deps-dev): bump archunit from 2.5.4 to 2.5.5, the trigger for this feature.
- [Dependabot alert #1](https://github.com/dfch/biz.dfch.BpmnMcp/security/dependabot/1): minimatch [GHSA-g3hv-75wg-m249](https://github.com/advisories/GHSA-g3hv-75wg-m249) (moderate), the alert REQ-002 fixes or dismisses.

### More Information

Follow-up (not a blocker of this feature):

- Upstream pin: archunit 2.5.5 still declares `minimatch ^10.0.1`. Once ArchUnitTS ships a release that declares `minimatch >=11.0.1`, the tree-wide `minimatch` override can be re-checked. In the fallback path, that release is also the trigger to remove the nested override and close the dismissal.
