// SPDX-FileCopyrightText: 2026 Ronald Rink, d-fens GmbH
// SPDX-License-Identifier: AGPL-3.0-only

/**
 * Task 190.120 (script 01 of 1): the structural summary of the
 * HUMAN-EDITED canvas for R6 (Phase 190, feat-29).
 *
 * Sibling of bin/190-100-01-summarize-canvas.mjs (the pre-edit
 * baseline summary of files/human-edit-start.bpmn, the prep record
 * bin/logs/190-100-prepare-human-edit.md): this one parses
 * files/human-edited.bpmn (the user's edit + save via the page)
 * with the ROOT node_modules' bpmn-moddle (read-only) and prints
 * the same short structural summary to stdout, so the pickup can
 * diff the human's edit against the baseline summary plus the raw
 * XML diff (the DI geometry lives in the raw XML, not in this
 * summary).
 *
 * Read-only: writes nothing anywhere; the summary goes to stdout.
 * An unreadable input, a parse failure, or a missing process exits
 * non-zero with the cause on stderr.
 *
 * Standalone re-runnable: node bin/190-120-01-summarize-edited.mjs.
 */

import { createHash } from 'node:crypto';
import { readFileSync } from 'node:fs';
import path from 'node:path';
import process from 'node:process';
import { fileURLToPath } from 'node:url';

import { BpmnModdle } from 'bpmn-moddle';

const SCRIPT_DIR = path.dirname(fileURLToPath(import.meta.url));
const FEAT_DIR = path.resolve(SCRIPT_DIR, '..');
const INPUT = path.join(FEAT_DIR, 'files', 'human-edited.bpmn');

function fail(message) {
  process.stderr.write(`summarize-edited: ${message}\n`);
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
  lines.push(`summarize-edited: file ${path.relative(FEAT_DIR, INPUT)} (${bytes.length} B, sha256 ${sha256(bytes)})`);
  lines.push(`summarize-edited: definitions id="${rootElement.id}" targetNamespace="${rootElement.targetNamespace}"`);

  const processElement = rootElement.rootElements.find((element) => element.$type === 'bpmn:Process');
  if (!processElement) {
    fail('no bpmn:Process in the diagram');
  }
  lines.push(`summarize-edited: process id="${processElement.id}" isExecutable=${processElement.isExecutable}`);

  const flowElements = processElement.flowElements ?? [];
  const elements = flowElements.filter((element) => element.$type !== 'bpmn:SequenceFlow');
  const flows = flowElements.filter((element) => element.$type === 'bpmn:SequenceFlow');

  lines.push(`summarize-edited: elements (${elements.length}):`);
  for (const element of elements) {
    const name = element.name ? `name="${element.name}"` : 'no name';
    lines.push(`  ${element.id}  ${element.$type}  ${name}`);
  }

  lines.push(`summarize-edited: sequence flows (${flows.length}):`);
  for (const flow of flows) {
    const condition = flow.conditionExpression ? `  conditionExpression="${flow.conditionExpression.body}"` : '';
    lines.push(`  ${flow.id}  ${flow.sourceRef.id} -> ${flow.targetRef.id}${condition}`);
  }
  const conditions = flows.filter((flow) => flow.conditionExpression).length;
  lines.push(
    conditions === 0
      ? 'summarize-edited: condition expressions: none (as pinned for the Task A model)'
      : `summarize-edited: condition expressions: ${conditions}`,
  );

  const diagrams = rootElement.diagrams ?? [];
  if (diagrams.length === 0) {
    lines.push('summarize-edited: DI: none');
  } else {
    for (const diagram of diagrams) {
      const plane = diagram.plane;
      const children = plane?.planeElement ?? [];
      const shapes = children.filter((element) => element.$type === 'bpmndi:BPMNShape');
      const edges = children.filter((element) => element.$type === 'bpmndi:BPMNEdge');
      lines.push(
        `summarize-edited: DI: diagram "${diagram.id}", plane "${plane?.id}" (bpmnElement=${
          plane?.bpmnElement?.id
        }), ${shapes.length} BPMNShape, ${edges.length} BPMNEdge`,
      );
    }
  }

  process.stdout.write(lines.join('\n') + '\n');
}

await main();
