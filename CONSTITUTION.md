# Constitution of biz.dfch.BpmnMcp

The inviolable principles of this repository. Where any other
document here — the requirements, decisions, and Q&A records under
`docs/`, or the root documentation — appears to conflict with a
principle, the principle stands and the conflict is a defect to be
fixed by a recorded decision in the implementation Q&A, never by a
silent edit. Where a principle has a machine home, the machine
config is the source of truth for its enforcement.

## 1. Licensing: AGPL-3.0-only, declared in every source file

The project is released under the GNU Affero General Public
License v3.0, only (QA 3.0020). Every source file of the project
carries that license at its top as the two-line SPDX declaration
header, in the file type's comment syntax (`#` for Python, YAML,
TOML, and INI; `//` for JavaScript and TypeScript):

```
# SPDX-FileCopyrightText: 2026 Ronald Rink, d-fens GmbH
# SPDX-License-Identifier: AGPL-3.0-only
```

JSON cannot carry comments: every `package.json` manifest declares
the license via its `"license": "AGPL-3.0-only"` field instead, and
other JSON config files are exempt for that reason. The identifier
is always the SPDX 3.x form `AGPL-3.0-only` — never the deprecated
bare `AGPL-3.0`, never `AGPL-3.0-or-later`. Documentation,
specification artifacts, and historical records are not source
files; they are covered by the verbatim `LICENSE` at the repository
root. Machine home: the license-header drift gate (a vitest suite,
QA 0.0290), running in CI and pre-commit.

## 2. Free and Open Source, local-only

Every component of the tool is Free and Open Source Software, with
no license fee, subscription, or account necessary to operate it,
and the tool runs entirely locally / on-premises on the same system
as the agent host, with no mandatory cloud dependency. The
requirement documents under `docs/req/` and the decision record
under `docs/dec/` are the normative scope and rationale;
AGPL-3.0-only (principle 1) is the license under which this project
satisfies them.

## 3. Machine-gate culture

Every convention of this repository has a machine home: the
machine configs are the source of truth for the rules, a
convention that exists only in prose is drift-prone and does not
count, and CI plus pre-commit are the authoritative gates (QA
0.0210/0.0180/0.0190). When a document and a machine config
disagree, the config wins — it is what CI enforces.
