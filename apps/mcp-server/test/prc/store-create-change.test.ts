// SPDX-FileCopyrightText: 2026 Ronald Rink, d-fens GmbH
// SPDX-License-Identifier: AGPL-3.0-only

import { createHash } from 'node:crypto';
import { existsSync, mkdirSync, mkdtempSync, readFileSync, rmSync, writeFileSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { join } from 'node:path';
import { afterEach, beforeEach, describe, expect, it } from 'vitest';
import type { EditingOperation } from '../../src/prc/editing.js';
import { buildPrcFilename } from '../../src/prc/filename.js';
import { collectElementInventory, getProcessId, parseBpmn } from '../../src/prc/moddle.js';
import type { ChangeResult, CreateResult, ExportResult, ImportResult, PrcLogger } from '../../src/prc/store.js';
import { PrcStore } from '../../src/prc/store.js';

// Resolve the fixture directory independent of the test runner's
// working directory (test/prc/ -> test/ -> fixtures/).
import { fileURLToPath } from 'node:url';
import { resolve } from 'node:path';

const FIXTURES_DIR = resolve(fileURLToPath(new URL('../fixtures/', import.meta.url)));
const ORDER_FIXTURE = join(FIXTURES_DIR, 'order-process.bpmn');
const MALFORMED_FIXTURE = join(FIXTURES_DIR, 'malformed.bpmn');

const UUID_V4_SHAPE = /^[0-9a-f]{8}-[0-9a-f]{4}-4[0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/;

/** The SHA-256 (hex) of a file's content (the byte-identity probes, review finding G1/G2). */
function sha256Hex(path: string): string {
  return createHash('sha256').update(readFileSync(path)).digest('hex');
}

interface LogRecord {
  level: 'info' | 'warn' | 'error';
  event: string | undefined;
  msg: string;
}

/** A recording fake of the store's structural `PrcLogger`. */
function createFakeLogger(): { logger: PrcLogger; records: LogRecord[] } {
  const records: LogRecord[] = [];
  const push = (level: LogRecord['level']) => (obj: unknown, msg?: string) => {
    records.push({ level, event: (obj as { event?: string } | undefined)?.event, msg: msg ?? '' });
  };
  const logger: PrcLogger = { info: push('info'), warn: push('warn'), error: push('error') };
  return { logger, records };
}

/** Narrows a `CreateResult` to its success side for the test body. */
function expectCreated(result: CreateResult): Extract<CreateResult, { ok: true }> {
  expect(result.ok).toBe(true);
  if (!result.ok) {
    throw new Error('unreachable: the create result must be a success');
  }
  return result;
}

/** Narrows a `ChangeResult` to its success side for the test body. */
function expectChanged(result: ChangeResult): Extract<ChangeResult, { ok: true }> {
  expect(result.ok).toBe(true);
  if (!result.ok) {
    throw new Error('unreachable: the change result must be a success');
  }
  return result;
}

/** Narrows an `ImportResult` to its success side for the test body. */
function expectImportOk(result: ImportResult): Extract<ImportResult, { ok: true }> {
  expect(result.ok).toBe(true);
  if (!result.ok) {
    throw new Error('unreachable: the import result must be a success');
  }
  return result;
}

/** Narrows an `ExportResult` to its success side for the test body. */
function expectExportOk(result: ExportResult): Extract<ExportResult, { ok: true }> {
  expect(result.ok).toBe(true);
  if (!result.ok) {
    throw new Error('unreachable: the export result must be a success');
  }
  return result;
}

describe('PrcStore session drafts and change (feat-17 REQ-001..REQ-005, REQ-007)', () => {
  let tempDir: string;
  let prcDir: string;
  let logger: PrcLogger;
  let records: LogRecord[];
  let store: PrcStore;

  beforeEach(() => {
    tempDir = mkdtempSync(join(tmpdir(), 'bpmnmcp-drafts-'));
    prcDir = join(tempDir, 'docs', 'prc');
    ({ logger, records } = createFakeLogger());
    store = new PrcStore(prcDir, logger);
  });

  afterEach(() => {
    rmSync(tempDir, { recursive: true, force: true });
  });

  describe('createProcess (REQ-001, QA 1.0070)', () => {
    it('registers a session draft: a fresh v4 uuid, the derived identity, no file on disk', async () => {
      const created = expectCreated(
        await store.createProcess('Order Process', [{ type: 'start-event' }, { type: 'task', name: 'Work' }]),
      );

      expect(created.uuid).toMatch(UUID_V4_SHAPE);
      expect(created.name).toBe('Order Process');
      expect(created.processId).toBe('order-process');
      expect(created.slug).toBe('order-process');
      expect(created.elementCount).toBe(2);
      // No file, no checksum: the draft is in memory only.
      expect(existsSync(prcDir)).toBe(false);
      expect(records.some((record) => record.event === 'prc-create')).toBe(true);
    });

    it('assigns distinct uuids to distinct creates', async () => {
      const first = expectCreated(await store.createProcess('A'));
      const second = expectCreated(await store.createProcess('B'));
      expect(first.uuid).not.toBe(second.uuid);
    });

    it('returns structured errors for blank names and malformed initial elements, registering nothing', async () => {
      const blank = await store.createProcess('   ');
      expect(blank.ok).toBe(false);
      if (blank.ok) {
        throw new Error('unreachable: a blank name must fail');
      }
      expect(blank.error.code).toBe('invalid-property');

      const badType = await store.createProcess('P', [{ type: 'warp-gate' }]);
      expect(badType.ok).toBe(false);
      if (badType.ok) {
        throw new Error('unreachable: an unknown type must fail');
      }
      expect(badType.error.code).toBe('unknown-element-type');
      expect(badType.error.message).not.toMatch(/[\r\n]/);

      expect(existsSync(prcDir)).toBe(false);
      expect(records.filter((record) => record.event === 'prc-create')).toHaveLength(0);
    });
  });

  describe('changeProcess (REQ-002/REQ-005/REQ-007)', () => {
    it('applies a change to a draft in memory only (no file appears, persisted: false)', async () => {
      const created = expectCreated(await store.createProcess('Order Process', [{ type: 'start-event' }]));

      const changed = expectChanged(await store.changeProcess(created.uuid, { action: 'add-element', type: 'task' }));

      expect(changed.persisted).toBe(false);
      expect(changed.outOfBandReRead).toBe(false);
      expect(changed.action).toBe('add-element');
      expect(changed.detail).toMatchObject({ id: 'task_1' });
      expect(existsSync(prcDir)).toBe(false);
      expect(records.some((record) => record.event === 'prc-change' && record.level === 'info')).toBe(true);

      // The mutation is visible to the next draft operation.
      const connected = expectChanged(
        await store.changeProcess(created.uuid, {
          action: 'connect',
          sourceId: 'startEvent_1',
          targetId: 'task_1',
        }),
      );
      expect(connected.detail).toMatchObject({ flowId: 'sequenceFlow_1' });
      expect(existsSync(prcDir)).toBe(false);
    });

    it('keeps a draft usable after a failed change (the tree is untouched)', async () => {
      const created = expectCreated(await store.createProcess('P', [{ type: 'task' }]));
      const failed = await store.changeProcess(created.uuid, { action: 'update-element', id: 'ghost' });
      expect(failed.ok).toBe(false);
      if (failed.ok) {
        throw new Error('unreachable: an unknown id must fail');
      }
      expect(failed.error.code).toBe('unknown-element-id');

      const ok = expectChanged(await store.changeProcess(created.uuid, { action: 'add-element', type: 'end-event' }));
      expect(ok.detail).toMatchObject({ id: 'endEvent_1' });
    });

    it('maps every editing error code onto the structured store error', async () => {
      const created = expectCreated(await store.createProcess('P', [{ type: 'task' }]));
      const cases: { operation: EditingOperation; code: string }[] = [
        { operation: { action: 'add-element', type: 'warp-gate' }, code: 'unknown-element-type' },
        { operation: { action: 'add-element', type: 'task', x: -1 }, code: 'invalid-coordinates' },
        { operation: { action: 'add-element', type: 'task', id: 'task_1' }, code: 'duplicate-element-id' },
        { operation: { action: 'add-element', type: 'task', id: 'bad id' }, code: 'invalid-id' },
        { operation: { action: 'update-element', id: 'ghost' }, code: 'unknown-element-id' },
        { operation: { action: 'update-element', id: 'task_1', isInterrupting: true }, code: 'unsupported-property' },
        { operation: { action: 'connect', sourceId: 'ghost', targetId: 'task_1' }, code: 'unknown-element-id' },
        { operation: { action: 'connect', sourceId: 'task_1', targetId: 'task_1' }, code: 'self-connect' },
        { operation: { action: 'delete-element', id: 'ghost' }, code: 'unknown-element-id' },
      ];
      for (const { operation, code } of cases) {
        const result = await store.changeProcess(created.uuid, operation);
        expect(result.ok, `operation ${operation.action} must fail`).toBe(false);
        if (result.ok) {
          throw new Error('unreachable: the operation must fail');
        }
        expect(result.error.code).toBe(code);
        expect(result.error.message).not.toMatch(/[\r\n]/);
      }
    });

    it('a failed change on a file-backed process leaves the own file byte-identical (G1)', async () => {
      const source = join(tempDir, 'src.bpmn');
      writeFileSync(source, readFileSync(ORDER_FIXTURE));
      const imported = expectImportOk(await store.importProcess(source));
      const beforeHash = sha256Hex(imported.path);

      const failed = await store.changeProcess(imported.uuid, { action: 'delete-element', id: 'ghost' });
      expect(failed.ok).toBe(false);
      if (failed.ok) {
        throw new Error('unreachable: a missing id must fail the change');
      }
      expect(failed.error.code).toBe('unknown-element-id');

      // The failed edit wrote nothing: the own file is byte-identical...
      expect(sha256Hex(imported.path)).toBe(beforeHash);
      // ...and the process stays usable (a successful change after).
      const changed = expectChanged(await store.changeProcess(imported.uuid, { action: 'add-element', type: 'task' }));
      expect(changed.persisted).toBe(true);
    });

    it('write-through: a change on a file-backed process updates the file and the checksum (REQ-005)', async () => {
      const source = join(tempDir, 'src.bpmn');
      writeFileSync(source, readFileSync(ORDER_FIXTURE));
      const imported = expectImportOk(await store.importProcess(source));
      const before = readFileSync(imported.path, 'utf8');

      const changed = expectChanged(
        await store.changeProcess(imported.uuid, { action: 'update-element', id: 'review-task', name: 'Second look' }),
      );

      expect(changed.persisted).toBe(true);
      expect(changed.outOfBandReRead).toBe(false);
      const after = readFileSync(imported.path, 'utf8');
      expect(after).not.toBe(before);
      expect(after).toContain('name="Second look"');

      // The checksum tracks the written file: the next operation is a cache hit.
      const reImport = expectImportOk(await store.importProcess(imported.path));
      expect(reImport.outOfBandReRead).toBe(false);
    });

    it('a fresh store instance over the same directory re-reads the mutated tree (the file is the source of truth)', async () => {
      const source = join(tempDir, 'src.bpmn');
      writeFileSync(source, readFileSync(ORDER_FIXTURE));
      const imported = expectImportOk(await store.importProcess(source));
      expectChanged(
        await store.changeProcess(imported.uuid, { action: 'add-element', type: 'end-event', name: 'Extra' }),
      );

      const freshStore = new PrcStore(prcDir, logger);
      const reImported = expectImportOk(await freshStore.importProcess(imported.path));
      expect(reImported.uuid).toBe(imported.uuid);
      const tree = (await parseBpmn(readFileSync(imported.path))).rootElement;
      const ids = collectElementInventory(tree).map((ref) => ref.id);
      expect(ids).toContain('endEvent_1');
    });

    it('detects an out-of-band change before applying a change, then writes through over it', async () => {
      const source = join(tempDir, 'src.bpmn');
      writeFileSync(source, readFileSync(ORDER_FIXTURE));
      const imported = expectImportOk(await store.importProcess(source));
      writeFileSync(imported.path, readFileSync(imported.path, 'utf8').replace('Review order', 'Out of band'));

      const changed = expectChanged(await store.changeProcess(imported.uuid, { action: 'add-element', type: 'task' }));

      expect(changed.outOfBandReRead).toBe(true);
      const written = readFileSync(imported.path, 'utf8');
      expect(written).toContain('Out of band');
      expect(written).toContain('task_1');
      expect(records.some((record) => record.event === 'prc-reread-out-of-band')).toBe(true);
    });

    it('returns process-not-registered for an unknown uuid in every directory state (drafts never shadow disk uuids)', async () => {
      const unknown = 'ffffffff-ffff-4fff-afff-ffffffffffff';
      const expectedError = {
        ok: false,
        error: { code: 'process-not-registered', message: `process ${unknown} is not registered` },
      } as const;

      // (a) the directory is absent, even with a live draft in the session.
      const draft = expectCreated(await store.createProcess('Draft'));
      expect(draft.uuid).not.toBe(unknown);
      let result = await store.changeProcess(unknown, { action: 'add-element', type: 'task' });
      expect(result).toEqual(expectedError);
      expect(existsSync(prcDir)).toBe(false);

      // (b) the directory is empty.
      mkdirSync(prcDir, { recursive: true });
      result = await store.changeProcess(unknown, { action: 'delete-element', id: 'x' });
      expect(result).toEqual(expectedError);

      // (c) a conforming file on disk that was never imported in this session
      // (registration is in-memory only, drafts and all).
      const diskOnlyUuid = '11111111-1111-4111-8111-111111111111';
      writeFileSync(join(prcDir, buildPrcFilename(diskOnlyUuid, 'disk-only')), readFileSync(ORDER_FIXTURE));
      result = await store.changeProcess(diskOnlyUuid, { action: 'add-element', type: 'task' });
      expect(result).toEqual({
        ok: false,
        error: { code: 'process-not-registered', message: `process ${diskOnlyUuid} is not registered` },
      });
    });

    it('returns a structured read error when the own file was deleted out of band', async () => {
      const source = join(tempDir, 'src.bpmn');
      writeFileSync(source, readFileSync(ORDER_FIXTURE));
      const imported = expectImportOk(await store.importProcess(source));
      rmSync(imported.path);

      const result = await store.changeProcess(imported.uuid, { action: 'add-element', type: 'task' });
      expect(result.ok).toBe(false);
      if (result.ok) {
        throw new Error('unreachable: a deleted own file must fail the change');
      }
      expect(result.error.code).toBe('path-missing');
    });

    it('a change after out-of-band corruption returns structured not-bpmn, the file untouched (G2)', async () => {
      const source = join(tempDir, 'src.bpmn');
      writeFileSync(source, readFileSync(ORDER_FIXTURE));
      const imported = expectImportOk(await store.importProcess(source));

      // Corrupt the registered own file out of band (unparseable XML).
      writeFileSync(imported.path, readFileSync(MALFORMED_FIXTURE));
      const corruptedHash = sha256Hex(imported.path);

      const result = await store.changeProcess(imported.uuid, { action: 'add-element', type: 'task' });
      expect(result.ok).toBe(false);
      if (result.ok) {
        throw new Error('unreachable: a corrupted own file must fail the change');
      }
      expect(result.error.code).toBe('not-bpmn');
      expect(result.error.message).not.toMatch(/[\r\n]/);

      // The corrupted file is byte-identical (nothing was written over it)...
      expect(sha256Hex(imported.path)).toBe(corruptedHash);
      // ...and the store stays usable for other processes.
      const otherSource = join(tempDir, 'other.bpmn');
      writeFileSync(otherSource, readFileSync(ORDER_FIXTURE));
      const other = expectImportOk(await store.importProcess(otherSource));
      expect(other.uuid).not.toBe(imported.uuid);
      expectChanged(await store.changeProcess(other.uuid, { action: 'add-element', type: 'task' }));
    });

    it('single-lines a control-character uuid in the not-registered message (E1 core leg)', async () => {
      const result = await store.changeProcess('a\nb', { action: 'delete-element', id: 'x' });
      expect(result.ok).toBe(false);
      if (result.ok) {
        throw new Error('unreachable: an unregistered uuid must fail');
      }
      expect(result.error.code).toBe('process-not-registered');
      expect(result.error.message).toBe('process a b is not registered');
      expect(result.error.message).not.toMatch(/[\r\n]/);
    });
  });

  describe('exportProcess draft promotion (REQ-001, design note "Session drafts")', () => {
    it('promotes a draft: the own prc file appears, re-parses, and the draft leaves the draft map', async () => {
      const created = expectCreated(await store.createProcess('Invoice Run', [{ type: 'task', name: 'Bill' }]));

      const exported = expectExportOk(await store.exportProcess(created.uuid));

      expect(exported.promoted).toBe(true);
      expect(exported.outOfBandReRead).toBe(false);
      expect(exported.path).toBe(join(prcDir, `prc-${created.uuid}-invoice-run.bpmn`));
      expect(existsSync(exported.path)).toBe(true);
      expect(records.some((record) => record.event === 'prc-export')).toBe(true);

      // The file re-parses to the draft's element set, with the derived process id.
      const tree = (await parseBpmn(readFileSync(exported.path))).rootElement;
      expect(getProcessId(tree)).toBe('invoice-run');
      expect(collectElementInventory(tree).map((ref) => ref.id)).toContain('task_1');

      // The draft is gone: the next change is write-through (persisted),
      // the next export is a plain registered export (not a promotion).
      const changed = expectChanged(
        await store.changeProcess(created.uuid, { action: 'add-element', type: 'end-event' }),
      );
      expect(changed.persisted).toBe(true);
      const reExported = expectExportOk(await store.exportProcess(created.uuid));
      expect(reExported.promoted).toBe(false);
      expect(reExported.path).toBe(exported.path);
    });

    it('a promoted draft keeps its mutations across a fresh store instance', async () => {
      const created = expectCreated(await store.createProcess('Persist Check', [{ type: 'task' }]));
      const exported = expectExportOk(await store.exportProcess(created.uuid));
      expectChanged(await store.changeProcess(created.uuid, { action: 'update-element', id: 'task_1', name: 'Kept' }));

      const freshStore = new PrcStore(prcDir, logger);
      const reImported = expectImportOk(await freshStore.importProcess(exported.path));
      expect(reImported.uuid).toBe(created.uuid);
      expect(readFileSync(exported.path, 'utf8')).toContain('name="Kept"');
    });

    it('rejects an explicit target path for a draft (the own path is the promotion), leaving the draft intact', async () => {
      const created = expectCreated(await store.createProcess('Stay Draft'));
      const explicitPath = join(tempDir, 'explicit', 'out.bpmn');

      const result = await store.exportProcess(created.uuid, explicitPath);

      expect(result.ok).toBe(false);
      if (result.ok) {
        throw new Error('unreachable: an explicit draft export must fail');
      }
      expect(result.error.code).toBe('draft-export-explicit-path');
      expect(result.error.message).not.toMatch(/[\r\n]/);
      expect(existsSync(explicitPath)).toBe(false);
      expect(existsSync(prcDir)).toBe(false);

      // The draft is still addressable and still a draft.
      const changed = expectChanged(await store.changeProcess(created.uuid, { action: 'add-element', type: 'task' }));
      expect(changed.persisted).toBe(false);
    });

    it('a failed draft promotion (write failure) leaves the draft intact and registers nothing', async () => {
      const created = expectCreated(await store.createProcess('Blocked'));
      // Occupy the would-be own path with a directory: the atomic rename fails.
      mkdirSync(join(prcDir, buildPrcFilename(created.uuid, 'blocked')), { recursive: true });

      const result = await store.exportProcess(created.uuid);

      expect(result.ok).toBe(false);
      if (result.ok) {
        throw new Error('unreachable: a blocked promotion must fail');
      }
      expect(result.error.code).toBe('write-failed');
      // The draft survives: a later change still works in memory.
      const changed = expectChanged(await store.changeProcess(created.uuid, { action: 'add-element', type: 'task' }));
      expect(changed.persisted).toBe(false);
    });
  });
});
