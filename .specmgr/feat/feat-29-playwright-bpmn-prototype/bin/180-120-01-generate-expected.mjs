// SPDX-FileCopyrightText: 2026 Ronald Rink, d-fens GmbH
// SPDX-License-Identifier: AGPL-3.0-only

/**
 * Task 180.120 (script 01 of 2): the expected-serialization producer for
 * the R5 save-fidelity evaluation (Phase 180, feat-29).
 *
 * Produces `bin/logs/expected-renamed.bpmn`: the byte-exact serialization
 * of the seeded fixture AFTER the identical single rename both Task B runs
 * perform (element `review-task`: name "Review order" -> "Review order
 * R5"), written by the ROOT node_modules' `bpmn-moddle` with EXACTLY the
 * save options the MCP server uses — `moddle.toXML(rootElement, { format:
 * true })`, per `apps/mcp-server/src/prc/moddle.ts` (`serializeBpmn`,
 * read-only reference).
 *
 * Byte policy (stated once here and in the raw record): everything the
 * R5 diff compares is written to disk verbatim by its writer — no
 * newline normalization in this producer or in the diff driver. The only
 * known constant in play is the +1 trailing newline the pre-commit EOF
 * hook adds to `files/` artifacts AT COMMIT TIME; it does not affect this
 * script's inputs, since the script runs on the uncommitted on-disk
 * bytes. The output below is therefore the serialized string's exact
 * UTF-8 bytes, nothing more.
 *
 * Invoked by the driver `bin/180-120-00-xml-diff.sh` (part 1). A
 * producer error (unreadable input, parse failure, rename target not
 * found) exits non-zero with the cause on stderr.
 */

import { createHash } from 'node:crypto';
import { readFileSync, writeFileSync } from 'node:fs';
import path from 'node:path';
import process from 'node:process';
import { fileURLToPath } from 'node:url';

import { BpmnModdle } from 'bpmn-moddle';

const SCRIPT_DIR = path.dirname(fileURLToPath(import.meta.url));
const FEAT_DIR = path.resolve(SCRIPT_DIR, '..');

const INPUT = path.join(FEAT_DIR, 'files', 'order-process.bpmn');
const OUTPUT = path.join(FEAT_DIR, 'bin', 'logs', 'expected-renamed.bpmn');

// The identical single rename both Task B runs perform (recorded in the
// plan's Decisions Made): task `review-task` gets this name.
const RENAME_ID = 'review-task';
const RENAME_NAME = 'Review order R5';

function fail(message) {
  process.stderr.write(`generate-expected: ${message}\n`);
  process.exit(1);
}

function sha256(buf) {
  return createHash('sha256').update(buf).digest('hex');
}

async function main() {
  let inputBytes;
  try {
    inputBytes = readFileSync(INPUT);
  } catch (error) {
    fail(`cannot read the input fixture ${INPUT}: ${error.message}`);
  }

  const moddle = new BpmnModdle();

  let rootElement;
  try {
    const result = await moddle.fromXML(inputBytes.toString('utf8'));
    rootElement = result.rootElement;
  } catch (error) {
    fail(`bpmn-moddle cannot parse ${INPUT}: ${error.message}`);
  }

  // The parsed tree's process and the element to rename (a plain
  // attribute-level mutation — no structural change, mirroring what both
  // Task B runs do to the model).
  const processes = rootElement.rootElements.filter((element) => element.$type === 'bpmn:Process');
  if (processes.length !== 1) {
    fail(`expected exactly one bpmn:Process in the fixture, found ${processes.length}`);
  }
  const target = (processes[0].flowElements ?? []).find((element) => element.id === RENAME_ID);
  if (!target) {
    fail(`element ${RENAME_ID} not found in the fixture's process flowElements`);
  }
  const beforeName = target.name;
  target.name = RENAME_NAME;

  // Serialize with EXACTLY the MCP server's options (serializeBpmn in
  // apps/mcp-server/src/prc/moddle.ts): { format: true } — nothing else.
  let xml;
  try {
    ({ xml } = await moddle.toXML(rootElement, { format: true }));
  } catch (error) {
    fail(`bpmn-moddle cannot serialize the renamed tree: ${error.message}`);
  }

  // Write the bytes verbatim (no newline normalization, no added
  // trailing newline).
  const outputBytes = Buffer.from(xml, 'utf8');
  writeFileSync(OUTPUT, outputBytes);

  process.stdout.write(
    [
      `generate-expected: input  ${INPUT} (${inputBytes.length} B, sha256 ${sha256(inputBytes)})`,
      `generate-expected: rename ${RENAME_ID} name "${beforeName}" -> "${RENAME_NAME}"`,
      `generate-expected: serialize moddle.toXML(rootElement, { format: true }) (the MCP server's options)`,
      `generate-expected: output ${OUTPUT} (${outputBytes.length} B, sha256 ${sha256(outputBytes)})`,
    ].join('\n'),
  );
}

await main();
