---
classification: null
created: '2026-10-22T17:50:46.722+02:00'
id: f93fb1c1-a2ad-4adc-9c7b-dd8a817449d0
status: draft
type: req
updated: '2026-10-22T17:52:12.470+02:00'
version: 1.0.0
---

# The tool shall validate a diagram against configurable modeling rules

The tool must check the current diagram against configurable BPMN
modeling rules and report the findings.

## Description

The tool must check the current diagram for BPMN modeling-correctness
and best-practice issues (for example: a process missing a start or
end event, a disconnected element, a sequence flow missing a
condition) using bpmnlint, and report the findings. The rule set must
be configurable.

## Characteristics

1. Functional correctness

## Level

MUST

## Priority

20

## Tags

- bpmn
- validate
- bpmnlint

## Source

User requirement, stated directly at the start of this project.

## Related Artifacts

### Decisions

- DEC fdc84432-1b48-4eb9-82e0-ec13cb8cf8ba: Use a Node/TypeScript MCP Server for Agent-Driven BPMN Modeling

## Notes

bpmn-moddle alone only guarantees structurally well-formed XML; it has
no opinion on modeling completeness or style. bpmnlint runs on top of
the object tree bpmn-moddle produces and supplies this requirement.
