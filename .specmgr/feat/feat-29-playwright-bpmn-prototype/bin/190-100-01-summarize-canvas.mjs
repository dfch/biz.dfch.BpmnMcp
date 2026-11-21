// SPDX-FileCopyrightText: 2026 Ronald Rink, d-fens GmbH
// SPDX-License-Identifier: AGPL-3.0-only

/**
 * Task 190.100 (script 01 of 2): the structural summary of the staged
 * human-edit canvas for R6 (Phase 190, feat-29).
 *
 * Parses files/human-edit-start.bpmn (the byte copy of the Phase 170
 * final run files/r4-run-3.bpmn - the Task A model the agent drew via
 * the bridge) with the ROOT node_modules' bpmn-moddle (read-only) and
 * prints a short structural summary to stdout: the file's byte count
 * and sha256, the definitions and process, every element's id and type
 * (names as-is - the bridge draw left them unnamed), every sequence
 * flow's source and target, the condition-expression count (none, as
 * pinned for the Task A model), and the DI inventory (diagram, plane,
 * BPMNShape and BPMNEdge counts).
 *
 * The pickup session (Task 190.120) diffs the human's edit
 * (files/human-edited.bpmn) against this summary and the sha256, so
 * this output is the pre-edit baseline.
 *
 * Read-only: writes nothing anywhere; the summary goes to stdout. An
 * unreadable input, a parse failure, or a missing process exits
 * non-zero with the cause on stderr.
 *
 * Invoked by bin/190-100-00-prepare-human-edit.sh. Standalone
 * re-runnable: node bin/190-100-01-summarize-canvas.mjs.
 */

import { createHash } from 'node:crypto';
import { readFileSync } from 'node:fs';
import path from 'node:path';
import process from 'node:process';
import { fileURLToPath } from 'node:url';

import { BpmnModdle } from 'bpmn-moddle';

const SCRIPT_DIR = path.dirname(fileURLToPath(import.meta.url));
const FEAT_DIR = path.resolve(SCRIPT_DIR, '..');
const INPUT = path.join(FEAT_DIR, 'files', 'human-edit-start.bpmn');

function fail(message) {
  process.stderr.write(`summarize-canvas: ${message}\n`);
  process.exit(1);
}

function sha256(buf) {
  return createHash('sha256').update(buf).digest('hex');
}

async function main() {
  let bytes;
  try {
    bytes = readFileSync(INPUT);
  } catch (error) {
    fail(`cannot read ${INPUT}: ${error.message}`);
  }

  const moddle = new BpmnModdle();

  let rootElement;
  try {
    const result = await moddle.fromXML(bytes.toString('utf8'));
    rootElement = result.rootElement;
  } catch (error) {
    fail(`bpmn-moddle cannot parse ${INPUT}: ${error.message}`);
  }

  const lines = [];
  lines.push(`summarize-canvas: file ${path.relative(FEAT_DIR, INPUT)} (${bytes.length} B, sha256 ${sha256(bytes)})`);
  lines.push(`summarize-canvas: definitions id="${rootElement.id}" targetNamespace="${rootElement.targetNamespace}"`);

  const processElement = rootElement.rootElements.find((element) => element.$type === 'bpmn:Process');
  if (!processElement) {
    fail('no bpmn:Process in the diagram');
  }
  lines.push(`summarize-canvas: process id="${processElement.id}" isExecutable=${processElement.isExecutable}`);

  const flowElements = processElement.flowElements ?? [];
  const elements = flowElements.filter((element) => element.$type !== 'bpmn:SequenceFlow');
  const flows = flowElements.filter((element) => element.$type === 'bpmn:SequenceFlow');

  lines.push(`summarize-canvas: elements (${elements.length}):`);
  for (const element of elements) {
    const name = element.name ? `name="${element.name}"` : 'no name';
    lines.push(`  ${element.id}  ${element.$type}  ${name}`);
  }

  lines.push(`summarize-canvas: sequence flows (${flows.length}):`);
  for (const flow of flows) {
    const condition = flow.conditionExpression ? `  conditionExpression="${flow.conditionExpression.text}"` : '';
    lines.push(`  ${flow.id}  ${flow.sourceRef.id} -> ${flow.targetRef.id}${condition}`);
  }
  const conditions = flows.filter((flow) => flow.conditionExpression).length;
  lines.push(
    conditions === 0
      ? 'summarize-canvas: condition expressions: none (as pinned for the Task A model)'
      : `summarize-canvas: condition expressions: ${conditions}`,
  );

  const diagrams = rootElement.diagrams ?? [];
  if (diagrams.length === 0) {
    lines.push('summarize-canvas: DI: none');
  } else {
    for (const diagram of diagrams) {
      const plane = diagram.plane;
      const children = plane?.planeElement ?? [];
      const shapes = children.filter((element) => element.$type === 'bpmndi:BPMNShape');
      const edges = children.filter((element) => element.$type === 'bpmndi:BPMNEdge');
      lines.push(
        `summarize-canvas: DI: diagram "${diagram.id}", plane "${plane?.id}" (bpmnElement=${
          plane?.bpmnElement?.id
        }), ${shapes.length} BPMNShape, ${edges.length} BPMNEdge`,
      );
    }
  }

  process.stdout.write(lines.join('\n') + '\n');
}

await main();
