// SPDX-FileCopyrightText: 2026 Ronald Rink, d-fens GmbH
// SPDX-License-Identifier: AGPL-3.0-only

import { readdir } from 'node:fs/promises';
import { resolve } from 'node:path';
import { parsePrcFilename } from './filename.js';

/**
 * The process inventory (REQ-003, QA pair 0.0300): a directory scan
 * of the resolved `prc` directory -- the directory listing *is* the
 * inventory, because the UUID travels in the filename. Conforming
 * files (`prc-<uuid>-<slug>.bpmn`) yield one entry each; every other
 * file (a non-`.bpmn` name, a non-conforming `.bpmn` name, a
 * subdirectory) is ignored. A missing directory yields an empty
 * inventory, not an error -- and neither the scan nor any path
 * resolution here creates a directory (writes do, REQ-005/REQ-006).
 */

/** One registered process as seen by the directory scan. */
export interface PrcInventoryEntry {
  /** The process UUID, read from the filename. */
  uuid: string;
  /** The cosmetic slug, read from the filename. */
  slug: string;
  /** The process's absolute file path. */
  path: string;
}

/**
 * Scans the `prc` directory for conforming process files (REQ-003).
 *
 * @param prcDir - The absolute path of the `prc` directory to scan.
 * @returns The conforming entries, sorted by filename; an empty list
 *   when the directory does not exist. Rethrows any other
 *   filesystem failure (e.g. permissions) -- only the missing-
 *   directory case is folded into an empty inventory.
 */
export async function scanPrcDirectory(prcDir: string): Promise<PrcInventoryEntry[]> {
  let entries;
  try {
    entries = await readdir(prcDir, { withFileTypes: true });
  } catch (error) {
    if (isNotFoundError(error)) {
      return [];
    }
    throw error;
  }

  const result: PrcInventoryEntry[] = [];
  for (const entry of entries) {
    if (!entry.isFile() || !entry.name.endsWith('.bpmn')) {
      continue;
    }
    const parsed = parsePrcFilename(entry.name);
    if (parsed === null) {
      continue;
    }
    result.push({ uuid: parsed.uuid, slug: parsed.slug, path: resolve(prcDir, entry.name) });
  }
  return result.sort((a, b) => (a.path < b.path ? -1 : a.path > b.path ? 1 : 0));
}

/** Type guard: is this a filesystem not-found error (`ENOENT`)? */
function isNotFoundError(error: unknown): boolean {
  return error instanceof Error && 'code' in error && (error as NodeJS.ErrnoException).code === 'ENOENT';
}
