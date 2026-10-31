// SPDX-FileCopyrightText: 2026 Ronald Rink, d-fens GmbH
// SPDX-License-Identifier: AGPL-3.0-only

import { existsSync, mkdirSync, mkdtempSync, rmSync, writeFileSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { join } from 'node:path';
import { afterEach, beforeEach, describe, expect, it } from 'vitest';
import { buildPrcFilename } from '../../src/prc/filename.js';
import { scanPrcDirectory } from '../../src/prc/inventory.js';

describe('scanPrcDirectory (REQ-003)', () => {
  let tempDir: string;

  beforeEach(() => {
    tempDir = mkdtempSync(join(tmpdir(), 'bpmnmcp-inventory-'));
  });

  afterEach(() => {
    rmSync(tempDir, { recursive: true, force: true });
  });

  it('returns an empty inventory for a missing directory, without creating it', async () => {
    const missing = join(tempDir, 'does-not-exist');
    const result = await scanPrcDirectory(missing);
    expect(result).toEqual([]);
    expect(existsSync(missing)).toBe(false);
  });

  it('returns an empty inventory for an empty directory', async () => {
    const result = await scanPrcDirectory(tempDir);
    expect(result).toEqual([]);
  });

  it('lists conforming files and ignores everything else', async () => {
    // Two fixed, valid UUID v4 values keep the sorted expectation
    // deterministic.
    const uuid1 = '11111111-1111-4111-8111-111111111111';
    const uuid2 = '22222222-2222-4222-9222-222222222222';
    writeFileSync(join(tempDir, buildPrcFilename(uuid1, 'order-process')), '<xml/>');
    writeFileSync(join(tempDir, buildPrcFilename(uuid2, 'a-b')), '<xml/>');
    writeFileSync(join(tempDir, 'notes.bpmn'), '<xml/>'); // non-conforming name
    writeFileSync(join(tempDir, 'prc-not-a-uuid-x.bpmn'), '<xml/>'); // bad UUID
    writeFileSync(join(tempDir, 'readme.txt'), 'hello'); // not a .bpmn file
    mkdirSync(join(tempDir, 'subdir.bpmn')); // a directory with a .bpmn name

    const result = await scanPrcDirectory(tempDir);
    expect(result).toEqual([
      { uuid: uuid1, slug: 'order-process', path: join(tempDir, `prc-${uuid1}-order-process.bpmn`) },
      { uuid: uuid2, slug: 'a-b', path: join(tempDir, `prc-${uuid2}-a-b.bpmn`) },
    ]);
  });
});
