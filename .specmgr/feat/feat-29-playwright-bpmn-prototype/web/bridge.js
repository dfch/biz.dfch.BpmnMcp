// SPDX-FileCopyrightText: 2026 Ronald Rink, d-fens GmbH
// SPDX-License-Identifier: AGPL-3.0-only

/**
 * The feat-29 prototype bridge (REQ-003, Task 120.100): `window.__bpmn`, a
 * thin pass-through over the page's BpmnModeler instance (web/index.html
 * exposes it as `window.__modeler`).
 *
 * Classic script, no build step: the page loads it with a plain
 * `<script src="/bridge.js">`, evaluated BEFORE the page's inline IIFE
 * creates the Modeler - so every member resolves `window.__modeler`
 * lazily at call time (a call before the Modeler exists resolves
 * `{ error: 'the modeler is not ready yet' }`, never a throw).
 *
 * Every member is async and returns a structured result: `{ ok: true, ... }`
 * on success, `{ error: <string> }` on any failure - including failures of
 * async legs. A rejected promise escaping `browser_evaluate` is a throw, so
 * each member catches internally and resolves the `{ error }` shape.
 *
 * Members:
 * - `getState()` -> `{ ok, elements, flows, zoom, scroll }`
 * - `addShape(type, x, y, name?)` -> `{ ok, id }` (the created element's actual id)
 * - `connect(sourceId, targetId, name?)` -> `{ ok, id }` (the created flow's id; sequence flows only)
 * - `setProp(id, name?, isInterrupting?)` -> `{ ok }`
 * - `move(id, x, y)` -> `{ ok }` (absolute top-left move of a shape)
 * - `load(name)` -> `{ ok }` (via the file API)
 * - `save(name)` -> `{ ok, bytes }` (via the file API, echoing the server confirmation)
 * - `selfTest()` -> `{ ok, elements, flows, saved, restored }` (the in-page
 *   addShape -> connect -> setProp -> getState -> save proof of ACC-003)
 *
 * `getState()` mirrors the MCP server's `parse` tool exactly (the plan's D1
 * refinement): the current diagram is serialized with `saveXML()` and
 * re-parsed with the Modeler's own moddle, then the server's
 * addressable-inventory walk (apps/mcp-server/src/prc/moddle.ts) runs on the
 * tree. The walk port below keeps the server's function names and semantics:
 * every flow-model element carrying a non-empty id (the `bpmn:FlowElement`
 * instances at any subprocess depth plus collaboration-scoped
 * `bpmn:MessageFlow`), containers (Definitions/Process/Collaboration) and
 * the entire BPMNDI excluded; `elements` sorted by (type, id), `flows`
 * (kind `sequence`/`message`) sorted by id; `name` and
 * `conditionExpression` omitted when absent or empty, `source`/`target`
 * omitted when the reference does not resolve. For any diagram, the result
 * equals what the MCP server's `parse` tool returns for the same XML.
 *
 * Coordinate semantics: `addShape(type, x, y, ...)` and `move(id, x, y)`
 * honor (x, y) as-is as the DI bounds' top-left corner with the server's
 * standard element sizes (the server's `addElement`, never grid-snapped -
 * verified: the Modeler's grid snapping only hooks `shape.resize` and the
 * space tool, not `shape.create`/`elements.move`).
 */

(function () {
  'use strict';

  // ---------------------------------------------------------------------
  // Result helpers (REQ-003: structured returns, no throws to the page)
  // ---------------------------------------------------------------------

  /** Collapses every whitespace run to a single space (the server's oneLine, moddle.ts). */
  function oneLine(text) {
    return String(text).replace(/\s+/g, ' ').trim();
  }

  /** A structured failure for one member (the message is the whole error surface). */
  function fail(member, message) {
    return { error: oneLine(member + ': ' + message) };
  }

  /** The message of an unknown caught value. */
  function errorMessage(error) {
    return error instanceof Error ? error.message : String(error);
  }

  // ---------------------------------------------------------------------
  // The Modeler, resolved lazily (script order: bundle -> this file -> the
  // page's inline IIFE that assigns window.__modeler)
  // ---------------------------------------------------------------------

  /** The page's Modeler instance, or null when the page has not created it yet. */
  function modelerInstance() {
    const candidate = window.__modeler;
    if (candidate && typeof candidate.importXML === 'function' && typeof candidate.get === 'function') {
      return candidate;
    }
    return null;
  }

  /** The Modeler or a thrown not-ready error (the member's catch shapes it). */
  function requireModeler() {
    const candidate = modelerInstance();
    if (candidate === null) {
      throw new Error('the modeler is not ready yet');
    }
    return candidate;
  }

  /**
   * A loaded diagram or a thrown not-loaded error. The Modeler starts with
   * no definitions at all (the canvas is empty, not an empty document), so
   * every mutating member needs a loaded diagram first.
   */
  function requireLoadedDiagram(modeler) {
    const definitions = modeler.getDefinitions();
    if (!definitions) {
      throw new Error('no diagram loaded; call load(name) first');
    }
    return definitions;
  }

  // ---------------------------------------------------------------------
  // Empty-canvas seeding (addShape / selfTest on a fresh page)
  // ---------------------------------------------------------------------

  /**
   * The minimal empty-process document the Modeler can import: the server's
   * createProcess baseline (one process plus the DI plane the importer needs
   * to display it) with no flow elements. Chosen over modeler.createDiagram()
   * whose shipped initial diagram carries a stray StartEvent_1.
   */
  const EMPTY_DIAGRAM_XML =
    '<?xml version="1.0" encoding="UTF-8"?>\n' +
    '<bpmn:definitions xmlns:bpmn="http://www.omg.org/spec/BPMN/20100524/MODEL" ' +
    'xmlns:bpmndi="http://www.omg.org/spec/BPMN/20100524/DI" ' +
    'xmlns:dc="http://www.omg.org/spec/DD/20100524/DC" ' +
    'id="Definitions_1" targetNamespace="http://bpmn.io/schema/bpmn">\n' +
    '  <bpmn:process id="Process_1" isExecutable="false" />\n' +
    '  <bpmndi:BPMNDiagram id="BPMNDiagram_1">\n' +
    '    <bpmndi:BPMNPlane id="BPMNPlane_1" bpmnElement="Process_1" />\n' +
    '  </bpmndi:BPMNDiagram>\n' +
    '</bpmn:definitions>';

  /** Seeds an empty canvas with the minimal empty-process diagram (awaited by the caller). */
  async function ensureLoadedDiagram(modeler) {
    if (!modeler.getDefinitions()) {
      await modeler.importXML(EMPTY_DIAGRAM_XML);
    }
    return modeler.getDefinitions();
  }

  // ---------------------------------------------------------------------
  // Standard element sizes (the server's layout.ts table + family fallback)
  // ---------------------------------------------------------------------

  /** The server's exact standard size per Stage 1 metamodel type (layout.ts). */
  const SIZE_BY_MODDLER_TYPE = {
    'bpmn:Task': { width: 100, height: 80 },
    'bpmn:SubProcess': { width: 100, height: 80 },
    'bpmn:StartEvent': { width: 36, height: 36 },
    'bpmn:EndEvent': { width: 36, height: 36 },
    'bpmn:IntermediateCatchEvent': { width: 36, height: 36 },
    'bpmn:ExclusiveGateway': { width: 50, height: 50 },
    'bpmn:ParallelGateway': { width: 50, height: 50 },
  };

  /**
   * The standard size for a type (the server's sizeForElement): the exact
   * Stage 1 match, else the metamodel family (gateway 50x50, event 36x36,
   * everything else the 100x80 task standard) via a throwaway businessObject.
   */
  function sizeForType(modeler, moddleType) {
    const exact = SIZE_BY_MODDLER_TYPE[moddleType];
    if (exact !== undefined) {
      return exact;
    }
    const probe = modeler.get('moddle').create(moddleType);
    if (probe.$instanceOf('bpmn:Gateway') === true) {
      return { width: 50, height: 50 };
    }
    if (probe.$instanceOf('bpmn:Event') === true) {
      return { width: 36, height: 36 };
    }
    return { width: 100, height: 80 };
  }

  // ---------------------------------------------------------------------
  // Argument validation (the member's catch shapes the thrown errors)
  // ---------------------------------------------------------------------

  function requireNonEmptyString(member, value, label) {
    if (typeof value !== 'string' || value.length === 0) {
      throw new Error(label + ' must be a non-empty string');
    }
  }

  function requireFinitePoint(member, x, y) {
    if (typeof x !== 'number' || !Number.isFinite(x) || typeof y !== 'number' || !Number.isFinite(y)) {
      throw new Error('x and y must be finite numbers');
    }
  }

  function requireOptionalString(member, value, label) {
    if (value !== undefined && typeof value !== 'string') {
      throw new Error(label + ' must be a string');
    }
  }

  // ---------------------------------------------------------------------
  // The MCP parse mirror (a faithful port of apps/mcp-server/src/prc/moddle.ts:
  // the metamodel-driven walk, the addressable recording, the flow refs, and
  // the two comparators - same function names, same semantics)
  // ---------------------------------------------------------------------

  /** Type guard: is this value a moddle element (anything carrying a string `$type`)? */
  function isModdleElement(value) {
    return value !== null && typeof value === 'object' && typeof value.$type === 'string';
  }

  /**
   * The moddle elements an element directly references: the values of its
   * many-valued properties that are element arrays, plus the values of its
   * single-valued element-reference properties.
   */
  function childReferences(element) {
    const children = [];
    const descriptor = element.$descriptor;
    if (descriptor === undefined || !Array.isArray(descriptor.properties)) {
      return children;
    }
    for (const property of descriptor.properties) {
      const value = element[property.name];
      if (property.isMany && Array.isArray(value)) {
        for (const child of value) {
          if (isModdleElement(child)) {
            children.push(child);
          }
        }
      } else if (isModdleElement(value)) {
        children.push(value);
      }
    }
    return children;
  }

  /** The cycle-safe metamodel-driven walk (visited set, root first). */
  function walkElements(start, record) {
    const seen = new Set();
    const visit = (element) => {
      if (seen.has(element)) {
        return;
      }
      seen.add(element);
      record(element);
      for (const child of childReferences(element)) {
        visit(child);
      }
    };
    visit(start);
  }

  /**
   * Whether the element belongs in the addressable inventory: a flow-model
   * element - a `bpmn:FlowElement` instance (any subprocess depth) or a
   * collaboration-scoped `bpmn:MessageFlow` (a plain `bpmn:BaseElement` in
   * the metamodel, matched by type).
   */
  function isAddressableElement(element) {
    return element.$instanceOf('bpmn:FlowElement') === true || element.$type === 'bpmn:MessageFlow';
  }

  /**
   * The BPMN id an element reference resolves to: a resolved reference
   * yields the referenced element's id, a raw string reference its own
   * value, every other value nothing.
   */
  function referenceId(reference) {
    if (typeof reference === 'string' && reference.length > 0) {
      return reference;
    }
    if (isModdleElement(reference) && typeof reference.id === 'string' && reference.id.length > 0) {
      return reference.id;
    }
    return undefined;
  }

  /** The text of the element's conditionExpression child, when present and non-empty. */
  function conditionText(element) {
    const expression = element.conditionExpression;
    if (!isModdleElement(expression)) {
      return undefined;
    }
    const body = expression.body;
    return typeof body === 'string' && body.length > 0 ? body : undefined;
  }

  /** The flow entry for a sequence or message flow, undefined for every other type. */
  function toFlowRef(element, id) {
    let kind;
    if (element.$type === 'bpmn:SequenceFlow') {
      kind = 'sequence';
    } else if (element.$type === 'bpmn:MessageFlow') {
      kind = 'message';
    }
    if (kind === undefined) {
      return undefined;
    }
    const source = referenceId(element.sourceRef);
    const target = referenceId(element.targetRef);
    const condition = conditionText(element);
    const flow = { id, kind };
    if (source !== undefined) {
      flow.source = source;
    }
    if (target !== undefined) {
      flow.target = target;
    }
    if (condition !== undefined) {
      flow.conditionExpression = condition;
    }
    return flow;
  }

  /** Records a flow-model element carrying a non-empty id (elements, and flows for flow types). */
  function recordAddressableElement(element, inventory) {
    const id = element.id;
    if (typeof id !== 'string' || id.length === 0) {
      return;
    }
    if (!isAddressableElement(element)) {
      return;
    }
    const name = element.name;
    const entry = { id, type: element.$type };
    if (typeof name === 'string' && name.length > 0) {
      entry.name = name;
    }
    inventory.elements.push(entry);
    const flow = toFlowRef(element, id);
    if (flow !== undefined) {
      inventory.flows.push(flow);
    }
  }

  /** The deterministic inventory order: by type, then by id (the server's compareElementRefs). */
  function compareElementRefs(a, b) {
    if (a.type !== b.type) {
      return a.type < b.type ? -1 : 1;
    }
    if (a.id !== b.id) {
      return a.id < b.id ? -1 : 1;
    }
    return 0;
  }

  /** The deterministic flow order: by id (the server's compareFlowRefs). */
  function compareFlowRefs(a, b) {
    if (a.id !== b.id) {
      return a.id < b.id ? -1 : 1;
    }
    return 0;
  }

  /** The addressable inventory of a parsed tree (the server's collectAddressableInventory). */
  function collectAddressableInventory(rootElement) {
    const inventory = { elements: [], flows: [] };
    walkElements(rootElement, (element) => recordAddressableElement(element, inventory));
    inventory.elements.sort(compareElementRefs);
    inventory.flows.sort(compareFlowRefs);
    return inventory;
  }

  // ---------------------------------------------------------------------
  // Members
  // ---------------------------------------------------------------------

  /**
   * getState() -> { ok, elements, flows, zoom, scroll } | { error }
   *
   * The MCP parse mirror: saveXML() -> re-parse with the Modeler's own
   * moddle -> the addressable inventory walk. Plus the canvas's current zoom
   * (a number) and scroll offset ({ x, y }). An empty canvas (no loaded
   * diagram) is a structured error: there is no document to parse.
   */
  async function getState() {
    try {
      const modeler = requireModeler();
      requireLoadedDiagram(modeler);
      const canvas = modeler.get('canvas');
      const saved = await modeler.saveXML();
      const parsed = await modeler.get('moddle').fromXML(saved.xml);
      const inventory = collectAddressableInventory(parsed.rootElement);
      const scroll = canvas.scroll();
      return {
        ok: true,
        elements: inventory.elements,
        flows: inventory.flows,
        zoom: canvas.zoom(),
        scroll: { x: scroll.x, y: scroll.y },
      };
    } catch (error) {
      return fail('getState', errorMessage(error));
    }
  }

  /**
   * addShape(type, x, y, name?) -> { ok, id } | { error }
   *
   * Creates a shape at (x, y) (the DI bounds' top-left corner, honored
   * as-is, the server's standard size for the type). An empty canvas is
   * seeded with the minimal empty-process diagram first. The id is the
   * created element's actual (factory-assigned) id.
   */
  async function addShape(type, x, y, name) {
    try {
      requireNonEmptyString('addShape', type, 'type');
      requireFinitePoint('addShape', x, y);
      requireOptionalString('addShape', name, 'name');
      const modeler = requireModeler();
      await ensureLoadedDiagram(modeler);
      const size = sizeForType(modeler, type);
      const modeling = modeler.get('modeling');
      const canvas = modeler.get('canvas');
      const shape = modeling.createShape(
        { type },
        { x, y, width: size.width, height: size.height },
        canvas.getRootElement(),
      );
      if (name !== undefined) {
        modeling.updateModdleProperties(shape, shape.businessObject, { name });
      }
      return { ok: true, id: shape.id };
    } catch (error) {
      return fail('addShape', errorMessage(error));
    }
  }

  /**
   * connect(sourceId, targetId, name?) -> { ok, id } | { error }
   *
   * Creates a sequence flow between the two resolved elements (sequence
   * flows only - message flows are out of scope for this prototype). The
   * id is the created flow's actual (factory-assigned) id.
   */
  async function connect(sourceId, targetId, name) {
    try {
      requireNonEmptyString('connect', sourceId, 'sourceId');
      requireNonEmptyString('connect', targetId, 'targetId');
      requireOptionalString('connect', name, 'name');
      const modeler = requireModeler();
      requireLoadedDiagram(modeler);
      const registry = modeler.get('elementRegistry');
      const source = registry.get(sourceId);
      if (!source) {
        throw new Error('source element not found: ' + sourceId);
      }
      const target = registry.get(targetId);
      if (!target) {
        throw new Error('target element not found: ' + targetId);
      }
      const modeling = modeler.get('modeling');
      const connection = modeling.createConnection(source, target, { type: 'bpmn:SequenceFlow' }, source.parent);
      if (name !== undefined) {
        modeling.updateModdleProperties(connection, connection.businessObject, { name });
      }
      return { ok: true, id: connection.id };
    } catch (error) {
      return fail('connect', errorMessage(error));
    }
  }

  /**
   * setProp(id, name?, isInterrupting?) -> { ok } | { error }
   *
   * Updates at least one of the element's businessObject properties. A
   * property the element's type does not declare (e.g. isInterrupting on a
   * task) is a structured error - the moddle check is the same
   * descriptor lookup the moddle setter performs internally.
   */
  async function setProp(id, name, isInterrupting) {
    try {
      requireNonEmptyString('setProp', id, 'id');
      if (name === undefined && isInterrupting === undefined) {
        throw new Error('at least one of name or isInterrupting must be provided');
      }
      requireOptionalString('setProp', name, 'name');
      if (isInterrupting !== undefined && typeof isInterrupting !== 'boolean') {
        throw new Error('isInterrupting must be a boolean');
      }
      const modeler = requireModeler();
      requireLoadedDiagram(modeler);
      const element = modeler.get('elementRegistry').get(id);
      if (!element) {
        throw new Error('element not found: ' + id);
      }
      const businessObject = element.businessObject;
      const properties = {};
      if (name !== undefined) {
        if (!businessObject.$model.properties.getProperty(businessObject, 'name')) {
          throw new Error('element ' + id + ' of type ' + businessObject.$type + ' has no property name');
        }
        properties.name = name;
      }
      if (isInterrupting !== undefined) {
        if (!businessObject.$model.properties.getProperty(businessObject, 'isInterrupting')) {
          throw new Error('element ' + id + ' of type ' + businessObject.$type + ' has no property isInterrupting');
        }
        properties.isInterrupting = isInterrupting;
      }
      modeler.get('modeling').updateModdleProperties(element, businessObject, properties);
      return { ok: true };
    } catch (error) {
      return fail('setProp', errorMessage(error));
    }
  }

  /**
   * move(id, x, y) -> { ok } | { error }
   *
   * Absolute move of a shape: the diff from its current (x, y) top-left
   * corner to the requested one, applied as-is (the server's
   * update-element reposition semantics, never grid-snapped).
   */
  async function move(id, x, y) {
    try {
      requireNonEmptyString('move', id, 'id');
      requireFinitePoint('move', x, y);
      const modeler = requireModeler();
      requireLoadedDiagram(modeler);
      const element = modeler.get('elementRegistry').get(id);
      if (!element) {
        throw new Error('element not found: ' + id);
      }
      if (typeof element.x !== 'number' || typeof element.y !== 'number') {
        throw new Error('element ' + id + ' is not a shape with absolute coordinates');
      }
      modeler.get('modeling').moveElements([element], { x: x - element.x, y: y - element.y });
      return { ok: true };
    } catch (error) {
      return fail('move', errorMessage(error));
    }
  }

  /**
   * load(name) -> { ok } | { error }
   *
   * Fetches the diagram from the file API and imports it (replacing any
   * loaded diagram). A missing file (404) or a non-BPMN body (an import
   * rejection) is a structured error with the cause.
   */
  async function load(name) {
    try {
      requireNonEmptyString('load', name, 'name');
      const modeler = requireModeler();
      const response = await fetch('/file?name=' + encodeURIComponent(name));
      if (!response.ok) {
        throw new Error('the file is not available (HTTP ' + response.status + ')');
      }
      const xml = await response.text();
      await modeler.importXML(xml);
      return { ok: true };
    } catch (error) {
      return fail('load', errorMessage(error));
    }
  }

  /**
   * save(name) -> { ok, bytes } | { error }
   *
   * Serializes the current diagram (saveXML) and POSTs it to the file API;
   * bytes echoes the server's JSON confirmation. A non-2xx response is a
   * structured error.
   */
  async function save(name) {
    try {
      requireNonEmptyString('save', name, 'name');
      const modeler = requireModeler();
      requireLoadedDiagram(modeler);
      const saved = await modeler.saveXML();
      const response = await fetch('/file?name=' + encodeURIComponent(name), {
        method: 'POST',
        headers: { 'content-type': 'application/xml' },
        body: saved.xml,
      });
      if (!response.ok) {
        throw new Error('the file could not be written (HTTP ' + response.status + ')');
      }
      const confirmation = await response.json();
      return { ok: true, bytes: confirmation.bytes };
    } catch (error) {
      return fail('save', errorMessage(error));
    }
  }

  // ---------------------------------------------------------------------
  // selfTest (the in-page proof of ACC-003)
  // ---------------------------------------------------------------------

  /** The fixed self-test scratch file name (left in files/ as evidence; the file API has no delete endpoint). */
  const SELF_TEST_FILE = 'selftest.bpmn';

  /** The fixed self-test grid positions (top-left corners, the server size semantics). */
  const SELF_TEST_START = { x: 150, y: 150 };
  const SELF_TEST_TASK = { x: 280, y: 120 };

  /**
   * selfTest() -> { ok, elements, flows, saved, restored } | { error }
   *
   * The in-page addShape -> connect -> setProp -> getState -> save
   * sequence: seeds an empty canvas first (the minimal empty-process
   * diagram), draws a start event and a task at fixed positions, connects
   * them, renames the task, asserts the final getState() reflects every
   * mutation, saves under the fixed scratch name, and restores the exact
   * pre-state afterwards (a loaded diagram is re-imported from its
   * captured XML; an empty canvas is re-seeded with the minimal
   * empty-process diagram - modeler.clear() alone would leave the stale
   * definitions object behind, so the seed import is the reset).
   */
  async function selfTest() {
    try {
      const modeler = requireModeler();

      // 1. Capture the pre-state (the restore target).
      const preState = modeler.getDefinitions()
        ? { empty: false, xml: (await modeler.saveXML()).xml }
        : { empty: true };

      // 2. addShape a start event and a task at fixed positions (an empty
      //    canvas is seeded by addShape's ensureLoadedDiagram leg).
      const startResult = await addShape('bpmn:StartEvent', SELF_TEST_START.x, SELF_TEST_START.y, 'selftest-start');
      if (!startResult.ok) {
        throw new Error('addShape(start) failed: ' + startResult.error);
      }
      const taskResult = await addShape('bpmn:Task', SELF_TEST_TASK.x, SELF_TEST_TASK.y, 'selftest-task');
      if (!taskResult.ok) {
        throw new Error('addShape(task) failed: ' + taskResult.error);
      }

      // 3. connect the two.
      const connectResult = await connect(startResult.id, taskResult.id);
      if (!connectResult.ok) {
        throw new Error('connect failed: ' + connectResult.error);
      }

      // 4. setProp the task (rename it).
      const setPropResult = await setProp(taskResult.id, 'selftest-task-renamed');
      if (!setPropResult.ok) {
        throw new Error('setProp failed: ' + setPropResult.error);
      }

      // 5. getState() and assert the mutation is reflected.
      const stateResult = await getState();
      if (!stateResult.ok) {
        throw new Error('getState failed: ' + stateResult.error);
      }
      const startEntry = stateResult.elements.find((entry) => entry.id === startResult.id);
      if (!startEntry || startEntry.type !== 'bpmn:StartEvent' || startEntry.name !== 'selftest-start') {
        throw new Error('getState does not reflect the start event ' + startResult.id);
      }
      const taskEntry = stateResult.elements.find((entry) => entry.id === taskResult.id);
      if (!taskEntry || taskEntry.type !== 'bpmn:Task' || taskEntry.name !== 'selftest-task-renamed') {
        throw new Error('getState does not reflect the renamed task ' + taskResult.id);
      }
      const matchingFlows = stateResult.flows.filter(
        (flow) => flow.source === startResult.id && flow.target === taskResult.id,
      );
      if (
        matchingFlows.length !== 1 ||
        matchingFlows[0].kind !== 'sequence' ||
        matchingFlows[0].id !== connectResult.id
      ) {
        throw new Error('getState does not reflect the flow ' + connectResult.id);
      }

      // 6. save under the fixed scratch name.
      const saveResult = await save(SELF_TEST_FILE);
      if (!saveResult.ok) {
        throw new Error('save failed: ' + saveResult.error);
      }

      // 7. Restore the pre-state (a later phase needs a known-clean canvas).
      // A loaded diagram is re-imported from its captured XML. An empty
      // pre-state is re-seeded with the minimal empty-process diagram:
      // modeler.clear() alone would leave the stale definitions object
      // behind (it fires diagram.clear but never nulls _definitions), which
      // would make the next addShape fail with "parent required" (no root)
      // while ensureLoadedDiagram still believes a diagram is loaded.
      await modeler.importXML(preState.empty ? EMPTY_DIAGRAM_XML : preState.xml);

      return {
        ok: true,
        elements: stateResult.elements.length,
        flows: stateResult.flows.length,
        saved: SELF_TEST_FILE,
        restored: true,
      };
    } catch (error) {
      // A restore failure is reported too: the canvas may then be left
      // mutated (the self-test elements present) - a later phase reloads
      // the page for a clean state.
      return fail('selfTest', errorMessage(error));
    }
  }

  window.__bpmn = {
    getState,
    addShape,
    connect,
    setProp,
    move,
    load,
    save,
    selfTest,
  };
})();
