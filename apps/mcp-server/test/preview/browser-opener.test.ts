// SPDX-FileCopyrightText: 2026 Ronald Rink, d-fens GmbH
// SPDX-License-Identifier: AGPL-3.0-only

import type { ChildProcess, SpawnOptions } from 'node:child_process';
import { EventEmitter } from 'node:events';
import { describe, expect, it } from 'vitest';
import {
  openBrowser,
  OPENER_SPAWN_OPTIONS,
  resolveOpenerCommand,
  type Spawner,
} from '../../src/preview/browser-opener.js';

/**
 * The stubbed-spawn unit leg of the cross-platform browser opener
 * (feat-20 REQ-004, REQ-006, ACC-007): the spawner seam is stubbed,
 * so the per-platform command + args, the fire-and-forget options
 * (detached, ignored stdio), the `unref` handling, the success leg,
 * the missing-binary (ENOENT) leg, and the spawn-failure legs
 * (single-line `reason`, never a rejection) are all asserted without
 * ever launching a real process.
 */

const VIEW_URL = 'http://127.0.0.1:8080/view/00000000-0000-4000-8000-000000000000';

interface SpawnCall {
  command: string;
  args: string[];
  options: SpawnOptions;
}

interface FakeChild {
  child: ChildProcess;
  unrefCount: () => number;
}

/** A stub child process: an `EventEmitter` plus the `unref` the opener calls. */
function createFakeChild(): FakeChild {
  const emitter = new EventEmitter();
  let unrefCount = 0;
  (emitter as unknown as { unref: () => void }).unref = (): void => {
    unrefCount += 1;
  };
  return { child: emitter as unknown as ChildProcess, unrefCount: () => unrefCount };
}

/**
 * A recording spawner: captures every call and returns a fake child
 * whose `spawn`/`error` event fires on the next `setImmediate` (the
 * opener attaches its listeners only after the spawner returns).
 */
function createSpawner(script: { spawn?: boolean; error?: NodeJS.ErrnoException; throw?: Error }): {
  spawner: Spawner;
  calls: SpawnCall[];
  unrefCount: () => number;
} {
  const calls: SpawnCall[] = [];
  const fake = createFakeChild();
  const spawner: Spawner = (command, args, options) => {
    if (script.throw !== undefined) {
      // The synchronous-throw leg: the spawner itself throws.
      throw script.throw;
    }
    calls.push({ command, args, options });
    setImmediate(() => {
      if (script.error !== undefined) {
        fake.child.emit('error', script.error);
      } else {
        fake.child.emit('spawn');
      }
    });
    return fake.child;
  };
  return { spawner, calls, unrefCount: fake.unrefCount };
}

describe('browser opener (feat-20 REQ-004, REQ-006, ACC-007)', () => {
  describe('the per-platform command + args (REQ-004, QA 4.0010)', () => {
    it('resolves xdg-open on Linux, open on macOS', () => {
      expect(resolveOpenerCommand(VIEW_URL, 'linux')).toEqual({ command: 'xdg-open', args: [VIEW_URL] });
      expect(resolveOpenerCommand(VIEW_URL, 'darwin')).toEqual({ command: 'open', args: [VIEW_URL] });
    });

    it('resolves cmd /c start "" <url> on Windows (the empty quoted title is mandatory when a URL follows)', () => {
      expect(resolveOpenerCommand(VIEW_URL, 'win32')).toEqual({
        command: 'cmd',
        args: ['/c', 'start', '', VIEW_URL],
      });
    });

    it('resolves null on a platform with no known opener', () => {
      expect(resolveOpenerCommand(VIEW_URL, 'freebsd')).toBeNull();
    });
  });

  it('pins the fire-and-forget spawn options: detached, stdio ignored', () => {
    expect(OPENER_SPAWN_OPTIONS).toEqual({ detached: true, stdio: 'ignore' });
  });

  it('launches the platform opener with the fire-and-forget options and unrefs the child (success leg)', async () => {
    const { spawner, calls, unrefCount } = createSpawner({ spawn: true });

    const result = await openBrowser(VIEW_URL, { spawner, platform: 'linux' });

    expect(result).toEqual({ opened: true });
    expect(calls).toEqual([{ command: 'xdg-open', args: [VIEW_URL], options: OPENER_SPAWN_OPTIONS }]);
    expect(unrefCount()).toBe(1);
  });

  it('launches the Windows cmd /c start "" <url> shape (success leg)', async () => {
    const { spawner, calls } = createSpawner({ spawn: true });

    const result = await openBrowser(VIEW_URL, { spawner, platform: 'win32' });

    expect(result).toEqual({ opened: true });
    expect(calls).toEqual([{ command: 'cmd', args: ['/c', 'start', '', VIEW_URL], options: OPENER_SPAWN_OPTIONS }]);
  });

  it('a missing binary (ENOENT) is opened:false with a single-line reason, no unref (never a rejection)', async () => {
    const { spawner, unrefCount } = createSpawner({
      error: Object.assign(new Error('spawn xdg-open ENOENT'), { code: 'ENOENT' }),
    });

    const result = await openBrowser(VIEW_URL, { spawner, platform: 'linux' });

    expect(result.opened).toBe(false);
    if (!result.opened) {
      expect(result.reason).toContain('xdg-open');
      expect(result.reason).toContain('not available');
      expect(result.reason).not.toContain('\n');
    }
    expect(unrefCount()).toBe(0);
  });

  it('any other spawn error is opened:false with a single-line reason (never a rejection)', async () => {
    const { spawner } = createSpawner({
      error: Object.assign(new Error('spawn open EACCES\n(multi-line detail)'), { code: 'EACCES' }),
    });

    const result = await openBrowser(VIEW_URL, { spawner, platform: 'darwin' });

    expect(result.opened).toBe(false);
    if (!result.opened) {
      expect(result.reason).toContain('failed to start');
      // The multi-line detail is collapsed to a single line.
      expect(result.reason).not.toContain('\n');
    }
  });

  it('a spawner that throws synchronously is opened:false with a single-line reason (never a rejection)', async () => {
    const { spawner, calls } = createSpawner({ throw: new Error('the spawner exploded\nbadly') });

    const result = await openBrowser(VIEW_URL, { spawner, platform: 'linux' });

    expect(calls).toHaveLength(0); // the spawner threw before recording the call
    expect(result.opened).toBe(false);
    if (!result.opened) {
      expect(result.reason).toContain('could not be started');
      expect(result.reason).not.toContain('\n');
    }
  });

  it('a platform with no known opener is opened:false with a reason, and the spawner is never called', async () => {
    const { spawner, calls } = createSpawner({ spawn: true });

    const result = await openBrowser(VIEW_URL, { spawner, platform: 'freebsd' });

    expect(calls).toHaveLength(0);
    expect(result.opened).toBe(false);
    if (!result.opened) {
      expect(result.reason).toContain('freebsd');
      expect(result.reason).toContain(VIEW_URL);
      expect(result.reason).not.toContain('\n');
    }
  });
});
