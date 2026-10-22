---
classification: null
created: '2026-10-22T17:50:38.126+02:00'
id: 94d75c0f-da9d-4f43-8253-936747ff2fe9
status: draft
type: req
updated: '2026-10-22T17:52:03.681+02:00'
version: 1.0.0
---

# The tool must run entirely locally or on-premises

The tool must operate fully on the system that hosts the agent, with
no required connection to a remote service or cloud account for its
core functions.

## Description

The tool must operate fully on the same system as the agent host, with
no mandatory dependency on a remote service, cloud account, or network
connection for its core functionality (create, change, import, export,
validate, parse).

## Characteristics

1. Portability
2. Security

## Level

MUST

## Priority

10

## Tags

- local
- on-prem
- offline

## Source

User requirement, stated directly at the start of this project.

## Related Artifacts

### Decisions

- DEC fdc84432-1b48-4eb9-82e0-ec13cb8cf8ba: Use a Node/TypeScript MCP Server for Agent-Driven BPMN Modeling

## Notes

bpmn-js's canvas page loads its hand-drawn fonts from a CDN by
default; this is a cosmetic fallback only (plain system fonts are used
if unavailable) and must not be relied on for any functional behavior.
