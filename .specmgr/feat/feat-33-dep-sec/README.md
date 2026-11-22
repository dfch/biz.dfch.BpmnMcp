---
classification: null
created: '2026-11-22T10:35:06.926+01:00'
id: feat-33-dep-sec
status: done
type: feat
updated: '2026-11-22T13:35:13.446+01:00'
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
- [x] ACC-002: Exactly one of these holds, matching the REQ-002 path taken. (A) The root `package.json` has no nested `archunit` override, `npm ls minimatch --all` shows no `minimatch` below 11.0.1, `npm audit` reports 0 moderate-or-higher advisories, and Dependabot alert #1 is closed as fixed. (B) The nested override is still there, `npm audit` reports only the residual (`archunit` → `minimatch 10.2.6`, moderate) and nothing else moderate-or-higher, Dependabot alert #1 is dismissed as "tolerable risk" with a comment citing the new decision record, the decision record exists, and both CI audit gates are green, because the residual is dev-only and below the `high` threshold.
- [x] ACC-003: On a clean checkout, `npm ci`, `npm run lint`, `npm run format:check`, `npm run build`, and `npm test -- --coverage` (including the archunit suite) pass locally and in CI.
- [x] ACC-004: `.github/workflows/ci.yml` has both audit steps (production at low, full tree at high). Each step is proven separately to fail: one test pins a production dependency to a version with a low or moderate advisory and shows that the production step fails, and another pins a dev dependency to a version with a high or critical advisory and shows that the full-tree step fails. The proof is a CI run on a draft PR (closed without merge), with each failing run's link recorded in a Progress Update entry.
- [x] ACC-005: The CodeQL default setup is `configured` for actions, javascript-typescript, and python, and its last scheduled run on `dev` or `main` is green. The result is recorded in a Progress Update entry.
- [x] ACC-006: `.github/dependabot.yml` has the minor/patch grouping with `applies-to: version-updates` for the npm and github-actions ecosystems, keeps the existing TypeScript-major ignore rule (DEC 5185d651), and Dependabot security updates are enabled in the repository settings.
- [x] ACC-007: `SECURITY.md` covers every item in REQ-007, including the 5-business-day acknowledgement, and GitHub private vulnerability reporting is enabled for the repository. `SECURITY.md` is documentation, so it needs no SPDX header (CONSTITUTION §1: documentation is covered by `LICENSE`).
- [x] ACC-008: QA 818fac76 7.0030's audit note, the gate list in `CONTRIBUTING.md`, and FEAT feat-11-npm-publish-mcp-registry (ACC-001, its out-of-scope residual line, and its CI-parity note) match the outcome of this feature.

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

- [x] Task 110.100: Add the `npm audit --omit=dev --audit-level=low` step to `.github/workflows/ci.yml`.
- [x] Task 110.110: Add the `npm audit --audit-level=high` step to `.github/workflows/ci.yml`.
- [x] Task 110.120: Prove that each gate fails separately: from a throwaway branch, open a draft PR that pins a production dependency with a low or moderate advisory (production step fails), then change it to pin a dev dependency with a high or critical advisory (full-tree step fails). Record both failing run links in a Progress Update entry, then close the PR without merging and delete the branch.
- [x] Task 110.130: Update the gate list in `CONTRIBUTING.md` so `npm audit` is listed as a CI gate with both thresholds, not as a local-only gate.

#### Phase 120: Scanning and Dependabot hygiene

- [x] Task 120.100: Confirm the CodeQL default-setup state (actions, javascript-typescript, python) and its last scheduled run, and record the result in a Progress Update entry.
- [x] Task 120.110: Add minor/patch `groups` with `applies-to: version-updates` to the npm and github-actions ecosystems in `.github/dependabot.yml`, and keep the TypeScript-major ignore rule.
- [x] Task 120.120: Enable Dependabot security updates in the repository settings, and confirm that they are on.

#### Phase 130: Security policy

- [x] Task 130.100: Enable GitHub private vulnerability reporting for the repository, then expand `SECURITY.md`: supported versions, private vulnerability reporting, the 5-business-day acknowledgement, the CodeQL note on Dependabot PRs, and the dependency-advisory policy (thresholds, override, dismissal, triage of a new advisory against an unchanged lockfile). Private vulnerability reporting was already enabled, so no repository setting was changed.
- [x] Task 130.110: Confirm that private vulnerability reporting is enabled and that the reporting link in `SECURITY.md` opens the GitHub report form.
- [x] Task 130.112: Amend the QA 818fac76 7.0030 "Dependency audit note (minimatch)": the residual is removed (main path) or formally dismissed with a reference to the new decision record (fallback path).
- [x] Task 130.114: Update FEAT feat-11-npm-publish-mcp-registry: ACC-001's residual baseline, the out-of-scope residual line, and the CI-parity note (`npm audit` is now a CI gate).
- [x] Task 130.120: Check every acceptance criterion and the CONSTITUTION, then mark the feature done. The check is done. ACC-002 (B) and ACC-003 are met with green CI on PR #37 (run 45013722456), and the feature status is `review` (not `done`).

## Progress

### Current Status

**As of 2026-11-22**: done. [PR #37](https://github.com/dfch/biz.dfch.BpmnMcp/pull/37)
was merged into `dev` (commit `6e678fc`) with green CI. All
acceptance criteria, ACC-001 to ACC-008, are met; Phase 100 took the
fallback path (REQ-002 B, DEC af53edf7-26d6-4773-9465-471377e42e54,
alert #1 dismissed as "tolerable risk"). The two deferred review
findings are tracked as GitHub issues: I1 (a separate audit job) as
[#39](https://github.com/dfch/biz.dfch.BpmnMcp/issues/39) and I2 (a
scheduled audit run) as
[#40](https://github.com/dfch/biz.dfch.BpmnMcp/issues/40).

### Updates

<!-- Newest entry first -- prepend new entries directly below this comment. -->

#### 2026-11-22T13:35:13.446+01:00 - PR #37 merged, feature done

PR #37 (branch `feat-33`) was merged into `dev` on 2026-11-22 (commit
`6e678fc`), with the post-implementation review fixes (G1, G2, D1 to
D4) included. The two deferred findings are tracked as GitHub issues:
I1 (a separate audit job) as #39 and I2 (a scheduled audit run) as
#40. Status moved from `review` to `done`.

#### 2026-11-22 11:01:28.237Z - Review follow-up

The post-implementation review findings are addressed in the working
tree (not committed):

- G1 (`SECURITY.md`, "A new advisory against an unchanged lockfile"):
  the temporary-allow route and the "Temporary allows" list are
  removed. `npm audit` has no allowlist, and `ci.yml` never read that
  list, so the route could not work. The section now says that while
  an advisory is at or above a gate threshold, CI stays red until an
  update or an exact-version override lands in a dedicated PR to
  `dev`. "Never lower the thresholds, never skip the step; on a
  registry outage, re-run the job" is kept. See Decisions Made.
- G2 (`SECURITY.md`, "Fixing an advisory" and "Dismissing an
  alert"): dismissing a Dependabot alert does not change `npm audit`.
  A dismissal is a valid resolution only when the advisory is already
  below both CI gate thresholds (a dev-only low or moderate advisory,
  as alert #1 is). For a production advisory, or a high or critical
  dev advisory, only an update or an override turns CI green.
- D1 (`SECURITY.md`, "Code Scanning"): "Dependabot changes only
  manifests and lockfiles" now covers npm PRs only. For
  github-actions PRs, which change the SHA-pinned actions in
  `.github/workflows/*.yml`, the text says that CodeQL's `actions`
  analysis checks the workflow changes on `dev` after the merge (the
  default setup runs on push to `dev`).
- D2: the dismissal comment on Dependabot alert #1 now also names "or
  stops calling `makeRe()`" as a second exit condition, matching DEC
  af53edf7. GitHub does not allow editing the comment of an alert that
  is already dismissed (HTTP 409), so the orchestrator reopened alert
  #1 and dismissed it again as `tolerable_risk` at
  2026-11-22T11:00:53Z with the new comment (ending "Exit: archunit on
  minimatch >=11.0.1 or no makeRe()."). The original dismissal was at
  2026-11-22T10:24:24Z.
- D3: ACC-002 (B) and ACC-003 are ticked. Evidence: PR #37 CI run
  [45013722456](https://github.com/dfch/biz.dfch.BpmnMcp/actions/runs/45013722456)
  (head bb22303, `pull_request`), job `build`: "Audit production
  dependencies (low)", "Audit all dependencies (high)", "Lint",
  "Format check", "Build (type-check gate)", and "Run tests with
  coverage" all `success`. `gh pr checks 37`: "Analyze (actions)",
  "Analyze (javascript-typescript)", "Analyze (python)", "CodeQL", and
  "build" all pass. Checked read-only with `gh run view 45013722456`
  and `gh pr checks 37`. Current Status and the Task 130.120 note are
  updated; the status is `review`.
- D4: correction to the "Phase 100 done" entry (left unchanged, append
  only). That entry says that alert #1 is dismissed, but the
  orchestrator dismissed it at 2026-11-22T10:24:24Z, after the entry
  was written (10:18:36Z). The Task 130.120 check in the "Phase 130
  done" entry confirmed the dismissal.

Deferred to a follow-up (see More Information):

- I1: move the two audit steps into a separate CI job, so a new
  advisory does not block lint, build, and tests.
- I2: a scheduled audit run, so a newly published advisory is found
  without a push or a pull request.

#### 2026-11-22 10:36:01.958Z - Phase 130 done: security policy

Task 130.100: `gh api repos/dfch/biz.dfch.BpmnMcp/private-vulnerability-reporting`
returns `{"enabled":true}`. It was already enabled, so no repository
setting was changed. `SECURITY.md` now has: supported versions (no
release exists yet, no git tags and no GitHub releases, and
`apps/mcp-server` is at 0.1.0, so `dev` is the supported line; after
the first release, only the latest release and `dev`); private
vulnerability reporting as the primary channel, with the link
https://github.com/dfch/biz.dfch.BpmnMcp/security/advisories/new and
`@dfch` only as a fallback to ask for a private channel (no email
address); acknowledgement within 5 business days; the dependency
advisory policy (the two CI thresholds with `info` ignored, the
fix order, when an override is allowed: exact-version pin, documented
reason, tracked removal trigger; dismissal only as "tolerable risk"
or "inaccurate" with a comment citing a decision record, with alert
#1 / DEC af53edf7 as the current entry; the triage of a new advisory
against an unchanged lockfile: a dedicated fix PR to `dev` before
other PRs merge, a temporary allow only as a dated `SECURITY.md`
entry naming the advisory and the follow-up, never lowering the
thresholds, re-running the job on a registry outage); and the CodeQL
note (default setup skips Dependabot PRs by design, status
"skipping"/neutral). `SECURITY.md` is documentation and has no SPDX
header (CONSTITUTION §1). It passes `npm run format:check`.

Task 130.110: confirmed without a browser login. The private
vulnerability reporting API returns `{"enabled":true}`. `curl -sI`
on the reporting link returns `302` to
`https://github.com/login?return_to=...%2Fsecurity%2Fadvisories%2Fnew`
(a control URL on a repository that does not exist returns `404`),
and Playwright lands on "Sign in to GitHub" with the same
`return_to`. The anonymous repository Security page
(`/security`, `200`) shows a "Report a vulnerability" link to
`security/advisories/new`, which GitHub shows only when private
vulnerability reporting is enabled. Not proven: the rendered report
form itself, which needs a signed-in session.

Task 130.112: QA 818fac76 7.0030 has a new "Amended (2026-11-22,
feat-33-dep-sec)" paragraph after the "Dependency audit note
(minimatch)": the residual is not removed but formally dismissed as
tolerable risk, citing DEC af53edf7-26d6-4773-9465-471377e42e54 and
its exit trigger. The historical note is unchanged.

Task 130.114: FEAT feat-11-npm-publish-mcp-registry: ACC-001 now
requires both CI audit gates to pass and names the residual as the
dismissed, DEC-recorded, dev-only moderate advisory (2 moderate
`npm audit` entries for the one advisory); the out-of-scope residual
line points to DEC af53edf7 and `SECURITY.md`; the CI-parity note
says that `npm audit` is now a CI gate and that the publish gate job
mirrors both audit steps (`pre-commit` stays local).

Task 130.120: acceptance criteria and CONSTITUTION check, on feat-33
at 7975b3f plus the Phase 130 changes, with Node 26.13.1 for the
tests:

- ACC-001: met (Phase 100; the lockfile carries `archunit` 2.5.5).
- ACC-002 (B): met locally, not ticked. The nested override is in the
  root `package.json`; `npm audit` reports only GHSA-g3hv-75wg-m249 on
  `node_modules/archunit/node_modules/minimatch` (2 moderate);
  `npm audit --omit=dev --audit-level=low` reports 0 vulnerabilities
  (exit 0) and `npm audit --audit-level=high` exits 0; alert #1 is
  `dismissed`, `tolerable_risk`, 2026-11-22T10:24:24Z, with a comment
  citing DEC af53edf7; the DEC exists. Open: both gates green in CI
  on the pushed feat-33 branch, which is not pushed yet.
- ACC-003: met locally, not ticked. `npm ci`, `npm run lint`,
  `npm run format:check`, and `npm run build` exit 0, and the vitest
  run with coverage passes (19 files, 361 passed, 2 skipped, including
  the architecture and license-header suites; 94.47 % statements).
  Open: the same in CI on the pushed feat-33 branch.
- ACC-004, ACC-005, ACC-006: met (Phases 110 and 120).
- ACC-007: met (Tasks 130.100 and 130.110).
- ACC-008: met (QA 7.0030 amended, `CONTRIBUTING.md` §3/§6 from Task
  110.130, FEAT feat-11 updated).
- CONSTITUTION: §1, no new source file; `SECURITY.md` and the
  specification documents are documentation, and the license-header
  gate passes. §2, no new dependency; the audit gates and GitHub
  security features add no runtime or cloud dependency to the tool.
  §3, the policy has a machine home (the CI audit steps, Dependabot,
  CodeQL), and `SECURITY.md` documents how to act on it. §4, the
  archunit architecture suite passes.

The orchestrator ticks ACC-002 (B) and ACC-003 after the PR's CI is
green and sets the feature status to `review` (not `done`).

#### 2026-11-22 10:31:11.755Z - Phase 120 done: scanning and Dependabot hygiene

Task 120.100: `gh api repos/dfch/biz.dfch.BpmnMcp/code-scanning/default-setup`
returns `state: configured`, languages `actions`, `javascript`,
`javascript-typescript`, `python`, `typescript` (GitHub lists the
aliases `javascript` and `typescript` next to `javascript-typescript`),
`query_suite: default`, `threat_model: remote`, `schedule: weekly`,
`updated_at: 2026-11-16T04:58:39Z`. The default branch is `dev`. Every
CodeQL run has `event: dynamic`, so the event does not tell scheduled
runs apart from push runs; the run name / display title does
("Scheduled", "Push on dev", "PR #N", "CodeQL Setup"). The most recent
scheduled run is
[44275303586](https://github.com/dfch/biz.dfch.BpmnMcp/actions/runs/44275303586)
(display title "Scheduled", `dev`, head 37eba32, 2026-11-18T09:22:27Z,
conclusion `success`), and its three jobs "Analyze (actions)",
"Analyze (javascript-typescript)", and "Analyze (python)" all
succeeded. It is the only scheduled run since the setup run
[43807152997](https://github.com/dfch/biz.dfch.BpmnMcp/actions/runs/43807152997)
("CodeQL Setup", 2026-11-16, success); the next weekly run is not due
yet. The later push runs on `dev` are also green, the newest being
[45011675229](https://github.com/dfch/biz.dfch.BpmnMcp/actions/runs/45011675229)
(2026-11-22). No CodeQL run exists on `main`.

Task 120.110: `.github/dependabot.yml` has a `minor-and-patch` group
(`applies-to: 'version-updates'`, `patterns: ['*']`, `update-types:
['minor', 'patch']`) in both the npm and the github-actions entries,
with a comment that security updates stay ungrouped (one PR per
advisory). The TypeScript-major ignore rule (DEC 5185d651) and the
SPDX header are unchanged. The file loads with `yaml.safe_load`,
validates against the SchemaStore `dependabot-2.0.json` schema, and
passes `npm run format:check`.

Task 120.120: `gh api repos/dfch/biz.dfch.BpmnMcp/automated-security-fixes`
returns `{"enabled":true,"paused":false}`, and
`gh api repos/dfch/biz.dfch.BpmnMcp/vulnerability-alerts` returns
`204 No Content` (Dependabot alerts on). Security updates were already
enabled, so no repository setting was changed; this task is a
confirmation only.

ACC-005 and ACC-006 are met. The new grouping takes effect once the
change is merged into `dev`.

#### 2026-11-22 10:28:14.394Z - Phase 110 done: CI audit gates

Tasks 110.100 and 110.110: `.github/workflows/ci.yml` has two new
steps in the `build` job, directly after "Install dependencies" and
before "Lint": "Audit production dependencies (low)" (`npm audit
--omit=dev --audit-level=low`, REQ-003) and "Audit all dependencies
(high)" (`npm audit --audit-level=high`, REQ-004). `permissions:
contents: read` is unchanged. On feat-33 locally, `npm audit
--omit=dev --audit-level=low` reports 0 vulnerabilities (exit 0), and
`npm audit --audit-level=high` reports only the 2 moderate residual
entries (exit 0).

Task 110.120: each gate was proven to fail on its own on the throwaway
draft [PR #36](https://github.com/dfch/biz.dfch.BpmnMcp/pull/36)
(branch `tmp/feat-33-audit-gate-proof` from e6d8f81 plus the new
`ci.yml`, base `dev`). The pins were picked with a local `npm audit`
first.

- Production step: commit 1 pinned the production dependency
  `cookie` 0.6.0 (exact) in `apps/mcp-server`
  ([GHSA-pxg6-pf52-xh8x](https://github.com/advisories/GHSA-pxg6-pf52-xh8x),
  low, `cookie <0.7.0`). Run
  [45012431794](https://github.com/dfch/biz.dfch.BpmnMcp/actions/runs/45012431794)
  failed at "Audit production dependencies (low)" ("1 low severity
  vulnerability", exit code 1); every later step was skipped.
- Full-tree step: commit 2 reverted the `cookie` pin and pinned the
  root dev dependency `lodash` 4.17.20 (exact; lodash is already a
  dev-only transitive dependency, at 4.18.1)
  ([GHSA-35jh-r3h4-6jhm](https://github.com/advisories/GHSA-35jh-r3h4-6jhm),
  high, `lodash <4.17.21`). Run
  [45012509394](https://github.com/dfch/biz.dfch.BpmnMcp/actions/runs/45012509394)
  passed "Audit production dependencies (low)" and failed at "Audit
  all dependencies (high)" ("3 vulnerabilities (2 moderate, 1 high)",
  exit code 1).

PR #36 was closed without merge at 2026-11-22T10:27:51Z. The remote
branch is deleted (the GitHub branches API returns 404), and the
scratch worktree and the local branch are removed.

Task 110.130: `CONTRIBUTING.md` §3 lists both audit commands, and §6
states that `npm audit` is a CI gate with both thresholds, not a
local-only check.

ACC-004 is met. ACC-002 (B) is not ticked yet: it also requires both
gates to be green in CI on the feat-33 branch, which is not pushed
yet.

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

#### 2026-11-22 11:01:28.237Z - No temporary allows for CI audit failures

The review (G1) found that the temporary-allow route in `SECURITY.md`
could not work: `npm audit` has no allowlist, and `ci.yml` does not
read the "Temporary allows" list. The route and the list are removed,
and no allowlist tool (for example a wrapper that filters `npm audit`
output by advisory ID) is added. While an advisory is at or above a
CI gate threshold, CI stays red until an update or an exact-version
override lands in a dedicated PR to `dev`. The thresholds are never
lowered and the audit steps are never skipped. Adding an allowlist
tool was rejected for this feature: it adds a dependency or custom
code to the gate, and it makes it possible to bypass the gate without
a fix. This supersedes the temporary-allow sentence in Design Notes.

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
- [PR #37](https://github.com/dfch/biz.dfch.BpmnMcp/pull/37): feat-33: dependency security policy and gates, merged into `dev` as `6e678fc`.
- [Issue #39](https://github.com/dfch/biz.dfch.BpmnMcp/issues/39) and [issue #40](https://github.com/dfch/biz.dfch.BpmnMcp/issues/40): the deferred review findings I1 and I2.
- [PR #36](https://github.com/dfch/biz.dfch.BpmnMcp/pull/36): THROWAWAY draft, the CI audit-gate failure proof (Task 110.120), closed without merge and its branch deleted.
- [Dependabot alert #1](https://github.com/dfch/biz.dfch.BpmnMcp/security/dependabot/1): minimatch [GHSA-g3hv-75wg-m249](https://github.com/advisories/GHSA-g3hv-75wg-m249) (moderate), the alert REQ-002 fixes or dismisses.

### More Information

Follow-up (not a blocker of this feature):

- Upstream pin: archunit 2.5.5 still declares `minimatch ^10.0.1`. Once ArchUnitTS ships a release that declares `minimatch >=11.0.1`, the tree-wide `minimatch` override can be re-checked. In the fallback path, that release is also the trigger to remove the nested override and close the dismissal.
- Separate audit job (review I1): move the two `npm audit` steps out of the `build` job into their own CI job, so a newly published advisory does not hide the lint, build, and test results.
- Scheduled audit run (review I2): run the audit steps on a schedule (for example weekly on `dev`), so a newly published advisory is found even when no push or pull request happens.
