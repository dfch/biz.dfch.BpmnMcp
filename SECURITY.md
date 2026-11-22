# Security Policy

## Supported Versions

Only the newest code gets security fixes. No version of the MCP server
(`biz.dfch.bpmnmcp`, `apps/mcp-server`) has been released yet, so
today the only supported line is the `dev` branch (the default
branch). After the first release, only the latest release and `dev`
are supported. Older releases do not get backported fixes; upgrade to
the latest release instead.

| Version                         | Supported |
| ------------------------------- | --------- |
| `dev` (default branch)          | Yes       |
| Latest release (none yet)       | Yes       |
| Any older release or any branch | No        |

## Reporting a Vulnerability

Do not report a vulnerability in a public issue, pull request, or
discussion.

Report it privately through GitHub private vulnerability reporting:
[open a private report](https://github.com/dfch/biz.dfch.BpmnMcp/security/advisories/new)
(or select **Report a vulnerability** on the repository's **Security**
tab). You need a GitHub account. Only you and the maintainers can see
the report.

If you cannot use GitHub private vulnerability reporting, contact the
maintainer [@dfch](https://github.com/dfch) on GitHub and ask for a
private channel. Do not put the details in the first message.

Include, where possible: the affected version or commit, the steps to
reproduce, the impact you expect, and any fix that you suggest.

### What to expect

- We acknowledge your report within **5 business days**.
- We tell you if we accept or decline the report, and we keep you
  informed while we prepare a fix.
- When we accept a report, we publish a GitHub security advisory
  after the fix is available.

## Dependency Advisory Policy

This policy applies to the npm dependency tree (the root
`package-lock.json`). CI is the gate (CONSTITUTION §3); this section
tells you what to do when the gate fails or Dependabot opens an alert.

### CI audit thresholds

The `build` job in `.github/workflows/ci.yml` runs two audit steps
after `npm ci`:

| Step                                     | Scope                                | Fails on                      |
| ---------------------------------------- | ------------------------------------ | ----------------------------- |
| `npm audit --omit=dev --audit-level=low` | Production dependencies              | low, moderate, high, critical |
| `npm audit --audit-level=high`           | The whole tree, dev dependencies too | high, critical                |

npm's `info` level is ignored on purpose: it marks informational
notices, not vulnerabilities. Production code ships to users, so every
advisory there fails CI. Dev tooling runs only on developer and CI
machines with inputs from this repository, so only high and critical
dev advisories fail CI. Moderate and low dev-only advisories are
handled through Dependabot alerts and this policy.

Run both commands locally before you open a pull request that changes
dependencies.

### Fixing an advisory

Fix an advisory in this order of preference:

1. Update the dependency to a fixed version (a Dependabot security
   update, or a manual update).
2. Add an `overrides` entry in the root `package.json`, if no fixed
   version of the direct dependency exists yet.
3. Dismiss the alert, if no fix is possible and the risk is accepted
   (see "Dismissing an alert"). This is only valid for an advisory
   that is already below both CI audit thresholds.

Dismissing a Dependabot alert does not change `npm audit`: the CI
audit steps still report the advisory. For a production advisory, or
a high or critical dev advisory, only an update (1) or an override (2)
makes CI green again.

Do not use `npm audit fix --force`: it can install breaking major
versions or downgrades.

### When an override is allowed

An `overrides` entry is allowed only when all of these are true:

- It pins an **exact version** (for example `"minimatch": "11.0.1"`),
  never a range.
- Its reason is **documented** in a decision record or a QA pair (which
  advisory, which consumer, why an update of the direct dependency is
  not possible).
- It has a **tracked removal trigger**: the upstream release that makes
  the override unnecessary, recorded with the reason. When the trigger
  fires, remove the override.

### Dismissing an alert

A Dependabot alert may be dismissed only with one of these reasons:

- **Tolerable risk**: the vulnerable code path cannot be reached by
  untrusted input, or the impact is accepted.
- **Inaccurate**: the alert does not apply to how this repository uses
  the package.

A dismissal is a valid resolution only when the advisory is already
below both CI audit thresholds, that is, a low or moderate advisory
in a dev-only dependency (as alert #1 below is). A dismissal does not
change `npm audit`, so it cannot make a failing CI audit step pass.
Do not dismiss an alert for a production advisory or for a high or
critical dev advisory; update the dependency or add an override.

Every dismissal has a comment that cites the decision record that
accepts the risk, including its exit trigger. The other dismissal
reasons ("fix started", "no bandwidth", "not used") are not
allowed; a dismissal without a decision record is not allowed.

Current dismissals:

- [Dependabot alert #1](https://github.com/dfch/biz.dfch.BpmnMcp/security/dependabot/1),
  [GHSA-g3hv-75wg-m249](https://github.com/advisories/GHSA-g3hv-75wg-m249)
  (moderate, `minimatch` 10.2.6 under the dev dependency `archunit`):
  dismissed as tolerable risk on 2026-11-22, per DEC
  af53edf7-26d6-4773-9465-471377e42e54
  (`docs/dec/dec-af53edf7-26d6-4773-9465-471377e42e54-*.md`). archunit
  still calls `minimatch.makeRe()`, which `minimatch` 11.0.1 removed,
  so a nested override keeps archunit's copy on 10.2.6. Its glob
  patterns come only from this repository's committed code. Exit
  trigger: an archunit release that declares `minimatch >=11.0.1` or
  stops calling `makeRe()`. `npm audit` still shows this advisory
  locally (as 2 moderate entries); it is below the CI `high` threshold.

### A new advisory against an unchanged lockfile

A newly published advisory can make CI fail on every open pull
request, although none of them changed the dependencies. Then:

1. The maintainer fixes it in a **dedicated pull request to `dev`**:
   an update of the dependency or an exact-version override, as
   above. A dismissal does not help here, because it does not change
   `npm audit`.
2. While the advisory is at or above a CI audit threshold, CI stays
   red. There is no temporary allow: `npm audit` has no allowlist.
   Other pull requests merge only after the fix is merged and they
   are rebased or updated.
3. **Never lower the audit thresholds** and never remove or skip an
   audit step to make CI pass.
4. `npm audit` needs the npm registry. If the step fails because the
   registry is not reachable, **re-run the job**. Do not skip the
   step.

## Code Scanning

CodeQL code scanning runs in GitHub's **default setup** (weekly, the
`default` query suite) for `actions`, `javascript-typescript`, and
`python`, on pushes to `dev` and on pull requests.

The default setup does not analyze pull requests opened by Dependabot.
This is how GitHub designed it, not a gap in the setup: the CodeQL
check on a Dependabot pull request shows as **skipping** (neutral).
A Dependabot pull request for npm changes only manifests and
lockfiles, and CodeQL analyzes the code on `dev` again after the
merge. A Dependabot pull request for GitHub Actions changes the
SHA-pinned actions in `.github/workflows/*.yml`; CodeQL's `actions`
analysis checks these workflow changes on `dev` after the merge (the
default setup runs on every push to `dev`).
