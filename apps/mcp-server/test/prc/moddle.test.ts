// SPDX-FileCopyrightText: 2026 Ronald Rink, d-fens GmbH
// SPDX-License-Identifier: AGPL-3.0-only

import { readFileSync } from 'node:fs';
import { dirname, join, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';
import { describe, expect, it } from 'vitest';
import {
  BpmnParseError,
  collectAddressableInventory,
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

describe('collectAddressableInventory (REQ-001/REQ-002)', () => {
  /** Wraps a definitions body in a minimal BPMN 2.0 document. */
  const definitions = (body: string): string =>
    `<?xml version="1.0" encoding="UTF-8"?>
<bpmn:definitions xmlns:bpmn="http://www.omg.org/spec/BPMN/20100524/MODEL" id="Definitions_1" targetNamespace="http://bpmn.io/schema/bpmn">
  ${body}
</bpmn:definitions>`;

  it('records element names (an empty name is omitted like an absent one)', async () => {
    const { rootElement } = await parseBpmn(
      definitions(
        `
    <bpmn:process id="process">
      <bpmn:startEvent id="named" name="Has a name" />
      <bpmn:task id="empty-name" name="" />
      <bpmn:endEvent id="no-name" />
    </bpmn:process>`,
      ),
    );
    const { elements } = collectAddressableInventory(rootElement);
    // toStrictEqual pins the exact shape: the `name` property is not
    // set for the empty-name and no-name elements alike.
    expect(elements).toStrictEqual([
      { id: 'no-name', type: 'bpmn:EndEvent' },
      { id: 'named', name: 'Has a name', type: 'bpmn:StartEvent' },
      { id: 'empty-name', type: 'bpmn:Task' },
    ]);
  });

  it('records sequence and message flows with their kind', async () => {
    const { rootElement } = await parseBpmn(
      definitions(
        `
    <bpmn:collaboration id="collab">
      <bpmn:participant id="p1" processRef="process1" />
      <bpmn:participant id="p2" processRef="process2" />
      <bpmn:messageFlow id="mf-1" sourceRef="p1" targetRef="p2" />
    </bpmn:collaboration>
    <bpmn:process id="process1">
      <bpmn:startEvent id="start" />
      <bpmn:endEvent id="end" />
      <bpmn:sequenceFlow id="sf-1" sourceRef="start" targetRef="end" />
    </bpmn:process>
    <bpmn:process id="process2" />`,
      ),
    );
    const { elements, flows } = collectAddressableInventory(rootElement);
    expect(flows).toStrictEqual([
      { id: 'mf-1', kind: 'message', source: 'p1', target: 'p2' },
      { id: 'sf-1', kind: 'sequence', source: 'start', target: 'end' },
    ]);
    // Both flow kinds are flow-model elements as well; the collaboration
    // scope (the collaboration, its participants) and the process itself
    // are containers, not elements.
    const byId = new Map(elements.map((element) => [element.id, element]));
    expect(byId.get('mf-1')).toStrictEqual({ id: 'mf-1', type: 'bpmn:MessageFlow' });
    expect(byId.get('sf-1')).toStrictEqual({ id: 'sf-1', type: 'bpmn:SequenceFlow' });
    expect(byId.has('collab')).toBe(false);
    expect(byId.has('p1')).toBe(false);
    expect(byId.has('process1')).toBe(false);
  });

  it('records the condition expression text (missing and empty both omit the property)', async () => {
    const { rootElement } = await parseBpmn(
      definitions(
        `
    <bpmn:process id="process">
      <bpmn:startEvent id="start" />
      <bpmn:task id="task" />
      <bpmn:endEvent id="end" />
      <bpmn:sequenceFlow id="cond-text" sourceRef="start" targetRef="task">
        <bpmn:conditionExpression>amount &gt; 1000</bpmn:conditionExpression>
      </bpmn:sequenceFlow>
      <bpmn:sequenceFlow id="cond-absent" sourceRef="task" targetRef="end" />
      <bpmn:sequenceFlow id="cond-empty" sourceRef="task" targetRef="end">
        <bpmn:conditionExpression />
      </bpmn:sequenceFlow>
    </bpmn:process>`,
      ),
    );
    const { flows } = collectAddressableInventory(rootElement);
    expect(flows).toStrictEqual([
      { id: 'cond-absent', kind: 'sequence', source: 'task', target: 'end' },
      { id: 'cond-empty', kind: 'sequence', source: 'task', target: 'end' },
      { id: 'cond-text', kind: 'sequence', source: 'start', target: 'task', conditionExpression: 'amount > 1000' },
    ]);
  });

  it('omits a flow reference that does not resolve', async () => {
    const { rootElement } = await parseBpmn(
      definitions(
        `
    <bpmn:process id="process">
      <bpmn:task id="task" />
      <bpmn:sequenceFlow id="broken" sourceRef="ghost" targetRef="task" />
    </bpmn:process>`,
      ),
    );
    const { flows } = collectAddressableInventory(rootElement);
    expect(flows).toStrictEqual([{ id: 'broken', kind: 'sequence', target: 'task' }]);
  });

  it('omits a dangling flow target (the source still resolves)', async () => {
    const { rootElement } = await parseBpmn(
      definitions(
        `
    <bpmn:process id="process">
      <bpmn:startEvent id="start" />
      <bpmn:sequenceFlow id="broken-target" sourceRef="start" targetRef="ghost" />
    </bpmn:process>`,
      ),
    );
    const { flows } = collectAddressableInventory(rootElement);
    expect(flows).toStrictEqual([{ id: 'broken-target', kind: 'sequence', source: 'start' }]);
  });

  it('reaches flow-model elements at any sub-process depth', async () => {
    const { rootElement } = await parseBpmn(
      definitions(
        `
    <bpmn:process id="process">
      <bpmn:startEvent id="outer-start" />
      <bpmn:subProcess id="sub">
        <bpmn:startEvent id="inner-start" />
        <bpmn:task id="inner-task" />
        <bpmn:endEvent id="inner-end" />
        <bpmn:sequenceFlow id="inner-flow-1" sourceRef="inner-start" targetRef="inner-task" />
        <bpmn:sequenceFlow id="inner-flow-2" sourceRef="inner-task" targetRef="inner-end" />
      </bpmn:subProcess>
      <bpmn:sequenceFlow id="outer-flow-1" sourceRef="outer-start" targetRef="sub" />
    </bpmn:process>`,
      ),
    );
    const { elements, flows } = collectAddressableInventory(rootElement);
    // The inner elements (and the sub-process itself) are flow-model
    // elements at a deeper container level; the inner flows resolve
    // inside the sub-process.
    expect(elements).toStrictEqual([
      { id: 'inner-end', type: 'bpmn:EndEvent' },
      { id: 'inner-flow-1', type: 'bpmn:SequenceFlow' },
      { id: 'inner-flow-2', type: 'bpmn:SequenceFlow' },
      { id: 'outer-flow-1', type: 'bpmn:SequenceFlow' },
      { id: 'inner-start', type: 'bpmn:StartEvent' },
      { id: 'outer-start', type: 'bpmn:StartEvent' },
      { id: 'sub', type: 'bpmn:SubProcess' },
      { id: 'inner-task', type: 'bpmn:Task' },
    ]);
    expect(flows).toStrictEqual([
      { id: 'inner-flow-1', kind: 'sequence', source: 'inner-start', target: 'inner-task' },
      { id: 'inner-flow-2', kind: 'sequence', source: 'inner-task', target: 'inner-end' },
      { id: 'outer-flow-1', kind: 'sequence', source: 'outer-start', target: 'sub' },
    ]);
  });

  it('excludes the BPMNDI interchange information and the container elements', async () => {
    const { rootElement } = await parseBpmn(readFixture('order-process.bpmn'));
    const { elements, flows } = collectAddressableInventory(rootElement);
    expect(elements).toStrictEqual([
      { id: 'end-event', name: 'Order done', type: 'bpmn:EndEvent' },
      { id: 'flow-1', type: 'bpmn:SequenceFlow' },
      { id: 'flow-2', type: 'bpmn:SequenceFlow' },
      { id: 'start-event', name: 'Order received', type: 'bpmn:StartEvent' },
      { id: 'review-task', name: 'Review order', type: 'bpmn:Task' },
    ]);
    expect(flows).toStrictEqual([
      { id: 'flow-1', kind: 'sequence', source: 'start-event', target: 'review-task' },
      { id: 'flow-2', kind: 'sequence', source: 'review-task', target: 'end-event' },
    ]);
    // No DI/DC id and no container id appears anywhere in the inventory.
    const ids = new Set<string>([...elements.map((element) => element.id), ...flows.map((flow) => flow.id)]);
    const excluded = [
      'Definitions_1',
      'order-process',
      'BPMNDiagram_1',
      'BPMNPlane_1',
      'shape-start',
      'shape-task',
      'shape-end',
      'edge-1',
      'edge-2',
    ];
    for (const id of excluded) {
      expect(ids.has(id)).toBe(false);
    }
  });

  it('excludes artifacts from both lists (an association is not a flow-model element)', async () => {
    // Pins the corrected understanding (Phase 130, review finding I1/G3,
    // correction of Phase 100 Decision 1's example): artifacts (e.g.
    // bpmn:Association, bpmn:Group) are not flow-model elements -- per
    // the BPMN 2.0 XSD they are in the artifact, not the flowElement,
    // substitution group -- and are excluded from both lists like the
    // container elements and the BPMNDI information, because they are
    // not change-addressable.
    const { rootElement } = await parseBpmn(
      definitions(
        `
    <bpmn:collaboration id="collab">
      <bpmn:participant id="p1" processRef="process1" />
      <bpmn:participant id="p2" processRef="process2" />
      <bpmn:association id="assoc-1" sourceRef="p1" targetRef="p2" />
    </bpmn:collaboration>
    <bpmn:process id="process1">
      <bpmn:task id="task-1" />
    </bpmn:process>
    <bpmn:process id="process2" />`,
      ),
    );
    const { elements, flows } = collectAddressableInventory(rootElement);
    // The association (in collaboration.artifacts) and the participants
    // (collaboration scope) appear in neither list; the one flow-model
    // element in p1's process appears in elements, so the leg proves
    // artifact exclusion, not whole-document exclusion.
    expect(elements).toStrictEqual([{ id: 'task-1', type: 'bpmn:Task' }]);
    expect(flows).toStrictEqual([]);
    const ids = new Set<string>([...elements.map((element) => element.id), ...flows.map((flow) => flow.id)]);
    const excluded = ['collab', 'p1', 'p2', 'assoc-1', 'process1', 'process2'];
    for (const id of excluded) {
      expect(ids.has(id)).toBe(false);
    }
  });

  it('is deterministically ordered (elements by (type, id), flows by id)', async () => {
    const body = `
    <bpmn:process id="process">
      <bpmn:task id="task-z" />
      <bpmn:task id="task-a" />
      <bpmn:startEvent id="start-b" />
      <bpmn:startEvent id="start-a" />
      <bpmn:endEvent id="end-m" />
      <bpmn:exclusiveGateway id="gateway-x" />
      <bpmn:sequenceFlow id="f-c" sourceRef="start-b" targetRef="gateway-x" />
      <bpmn:sequenceFlow id="f-a" sourceRef="start-a" targetRef="task-a" />
      <bpmn:sequenceFlow id="f-b" sourceRef="task-z" targetRef="end-m" />
    </bpmn:process>`;
    const first = collectAddressableInventory((await parseBpmn(definitions(body))).rootElement);
    const second = collectAddressableInventory((await parseBpmn(definitions(body))).rootElement);
    expect(second).toStrictEqual(first);
    expect(first.elements.map((element) => [element.type, element.id])).toStrictEqual([
      ['bpmn:EndEvent', 'end-m'],
      ['bpmn:ExclusiveGateway', 'gateway-x'],
      ['bpmn:SequenceFlow', 'f-a'],
      ['bpmn:SequenceFlow', 'f-b'],
      ['bpmn:SequenceFlow', 'f-c'],
      ['bpmn:StartEvent', 'start-a'],
      ['bpmn:StartEvent', 'start-b'],
      ['bpmn:Task', 'task-a'],
      ['bpmn:Task', 'task-z'],
    ]);
    expect(first.flows.map((flow) => flow.id)).toStrictEqual(['f-a', 'f-b', 'f-c']);
  });
});
