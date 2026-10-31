// SPDX-FileCopyrightText: 2026 Ronald Rink, d-fens GmbH
// SPDX-License-Identifier: AGPL-3.0-only

import { readFileSync } from 'node:fs';
import { dirname, join, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';
import { describe, expect, it } from 'vitest';
import {
  BpmnParseError,
  collectElementInventory,
  getProcessId,
  parseBpmn,
  serializeBpmn,
  type BpmnElementRef,
} from '../../src/prc/moddle.js';

// Resolve the fixture directory independent of the test runner's
// working directory (test/prc/ -> test/ -> fixtures/).
const FIXTURES_DIR = resolve(dirname(fileURLToPath(import.meta.url)), '../fixtures');

/** Reads a committed fixture as text. */
const readFixture = (name: string): string => readFileSync(join(FIXTURES_DIR, name), 'utf8');

/** Reads a committed fixture as raw bytes (the string|Uint8Array input path). */
const readFixtureBytes = (name: string): Buffer => readFileSync(join(FIXTURES_DIR, name));

describe('parseBpmn (REQ-001)', () => {
  it('parses a BPMN 2.0 document into a Definitions root', async () => {
    const { rootElement } = await parseBpmn(readFixture('order-process.bpmn'));
    expect(rootElement.$type).toBe('bpmn:Definitions');
    expect(getProcessId(rootElement)).toBe('order-process');
  });

  it('parses raw bytes (UTF-8 decoded before the string-only reader)', async () => {
    const { rootElement } = await parseBpmn(readFixtureBytes('order-process.bpmn'));
    expect(getProcessId(rootElement)).toBe('order-process');
  });

  it('reports no process id for a document whose process has none', async () => {
    const { rootElement } = await parseBpmn(readFixture('no-process-id.bpmn'));
    expect(getProcessId(rootElement)).toBeUndefined();
  });

  it('wraps a malformed document in a structured BpmnParseError', async () => {
    const promise = parseBpmn(readFixture('malformed.bpmn'));
    await expect(promise).rejects.toBeInstanceOf(BpmnParseError);
    await expect(parseBpmn(readFixture('malformed.bpmn'))).rejects.toMatchObject({
      name: 'BpmnParseError',
      message: expect.stringMatching(/^failed to parse BPMN 2\.0 XML: /),
    });
    // The bpmn-moddle cause is carried, and the message stays single-line.
    try {
      await parseBpmn(readFixture('malformed.bpmn'));
      expect.unreachable('the malformed fixture must not parse');
    } catch (error) {
      expect(error).toBeInstanceOf(BpmnParseError);
      expect((error as BpmnParseError).cause).toBeInstanceOf(Error);
      expect((error as BpmnParseError).message).not.toMatch(/\n/);
    }
  });

  it('wraps a valid-XML but non-BPMN document in a structured BpmnParseError', async () => {
    await expect(parseBpmn('<foo><bar /></foo>')).rejects.toBeInstanceOf(BpmnParseError);
  });
});

describe('serializeBpmn (REQ-006)', () => {
  it('serializes with format: true (indented, definitions root)', async () => {
    const { rootElement } = await parseBpmn(readFixture('order-process.bpmn'));
    const xml = await serializeBpmn(rootElement);
    expect(xml.startsWith('<?xml version="1.0"')).toBe(true);
    expect(xml).toContain('\n  <bpmn:process id="order-process"');
    expect(xml.trimEnd().endsWith('</bpmn:definitions>')).toBe(true);
  });
});

describe('parse/serialize/re-parse round-trip (REQ-001/REQ-006)', () => {
  it('keeps the element set identical across a round-trip', async () => {
    const first = await parseBpmn(readFixture('order-process.bpmn'));
    const xml = await serializeBpmn(first.rootElement);
    const second = await parseBpmn(xml);
    expect(collectElementInventory(second.rootElement)).toEqual(collectElementInventory(first.rootElement));
  });

  it('the inventory covers the process model and the BPMNDI interchange information', async () => {
    const { rootElement } = await parseBpmn(readFixture('order-process.bpmn'));
    const inventory = collectElementInventory(rootElement);
    const byId = new Map(inventory.map((ref) => [ref.id, ref.type]));
    expect(byId.get('order-process')).toBe('bpmn:Process');
    expect(byId.get('start-event')).toBe('bpmn:StartEvent');
    expect(byId.get('review-task')).toBe('bpmn:Task');
    expect(byId.get('end-event')).toBe('bpmn:EndEvent');
    expect(byId.get('flow-1')).toBe('bpmn:SequenceFlow');
    expect(byId.get('flow-2')).toBe('bpmn:SequenceFlow');
    expect(byId.get('BPMNDiagram_1')).toBe('bpmndi:BPMNDiagram');
    expect(byId.get('BPMNPlane_1')).toBe('bpmndi:BPMNPlane');
    expect(byId.get('shape-task')).toBe('bpmndi:BPMNShape');
    expect(byId.get('edge-1')).toBe('bpmndi:BPMNEdge');
  });

  it('the inventory is deterministic (two parses compare equal)', async () => {
    const a = await parseBpmn(readFixture('order-process.bpmn'));
    const b = await parseBpmn(readFixture('order-process.bpmn'));
    const inventoryA: BpmnElementRef[] = collectElementInventory(a.rootElement);
    const inventoryB = collectElementInventory(b.rootElement);
    expect(inventoryA).toEqual(inventoryB);
    expect(inventoryA).toEqual(
      [...inventoryA].sort((x, y) => (x.type === y.type ? (x.id < y.id ? -1 : 1) : x.type < y.type ? -1 : 1)),
    );
  });
});
