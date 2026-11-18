# Changelog

All notable changes to this project will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.0.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [Unreleased]

### Added

- The Stage 1 MCP server: the seven tools (`import`, `export`,
  `create`, `change`, `parse`, `validate`, `preview`) over stdio, the
  turn-based local browser preview (a read-only bpmn-js Viewer page on
  localhost:8080, opened after an agent-driven change), and the
  file-backed process storage (`<BPMN_MCP_DOCS_DIR>/prc`, one
  `prc-<uuid>-<slug>.bpmn` file per process).
- The first public release (v0.1.0) and its distribution: the
  `biz.dfch.bpmnmcp` npm package (unscoped, public; run with
  `npx -y biz.dfch.bpmnmcp`), the GitHub Release with the packed
  tarball attached, and the MCP Registry entry
  `io.github.dfch/biz-dfch-bpmnmcp` - all published by
  `.github/workflows/publish.yml` when the `v0.1.0` tag is pushed
  (gates -> npm -> GitHub Release -> MCP Registry).
- `CHANGELOG.md` (this file) and the release procedure in
  `CONTRIBUTING.md` (section 8).
