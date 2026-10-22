---
classification: null
created: '2026-10-22T17:50:35.975+02:00'
id: abdcf9d7-a7e0-465e-9fc2-a9f5748e38f6
status: draft
type: req
updated: '2026-10-22T17:52:01.925+02:00'
version: 1.0.0
---

# The tool must be free and open source software

Every component of the tool must be licensed under a Free and Open
Source Software (FOSS) license, with no license fee, subscription, or
account necessary to operate it.

## Description

Every runtime component of the tool (the MCP server itself and every
library it depends on for BPMN parsing, validation, and rendering)
must be distributed under a Free and Open Source Software (FOSS)
license. No component may require a paid license, subscription, or
account to operate.

## Characteristics

1. Portability

## Level

MUST

## Priority

10

## Tags

- foss
- licensing

## Source

User requirement, stated directly at the start of this project.

## Related Artifacts

### Decisions

- DEC fdc84432-1b48-4eb9-82e0-ec13cb8cf8ba: Use a Node/TypeScript MCP Server for Agent-Driven BPMN Modeling

## Notes

bpmn-js ships under the "bpmn.io License" (MIT plus a clause requiring
a small, unremovable attribution watermark on any rendered canvas).
This is accepted as compliant with this requirement: the license
imposes no fee and no closed-source obligation, only an attribution
display rule.
