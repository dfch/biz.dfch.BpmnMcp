// SPDX-FileCopyrightText: 2026 Ronald Rink, d-fens GmbH
// SPDX-License-Identifier: AGPL-3.0-only

import { spawn } from 'node:child_process';
import type { ChildProcess, SpawnOptions } from 'node:child_process';
import { platform as osPlatform } from 'node:os';

/**
 * The cross-platform browser opener (feat-20 REQ-004, QA 4.0010): a
 * fire-and-forget `child_process.spawn` of the platform's default
 * browser opener - `xdg-open` (Linux), `open` (macOS), and
 * `cmd /c start "" <url>` (Windows, where `start` is a shell
 * builtin, so `cmd` itself is spawned) - with `detached: true` and
 * stdio ignored, and the child `unref()`ed, so the opener never
 * holds the MCP server process.
 *
 * Failure contract (REQ-004, ACC-007): a missing binary (ENOENT),
 * any other spawn error, a synchronous throw from the spawner, or a
 * platform with no known opener resolves to `{ opened: false,
 * reason }` with a single-line `reason` - `openBrowser` never
 * rejects, so the `preview` tool call itself succeeds (the server
 * stays reachable by hand at the returned URL).
 *
 * The spawner is an injectable seam: the stubbed-spawn unit leg
 * (`test/preview/browser-opener.test.ts`) asserts the per-platform
 * command + args and the detached/ignored-stdio/unref handling
 * without ever launching a real process.
 *
 * Layering (CONSTITUTION §4, QA 7.0030): this module lives in
 * `src/preview/` - it imports neither the MCP SDK nor the adapter
 * files, and it touches no filesystem (`node:fs`) at all.
 */

/** The platform opener command + args for one URL (the stubbed-spawn unit leg asserts this exact shape). */
export interface OpenerCommand {
  /** The executable to spawn. */
  command: string;
  /** The arguments passed to the executable (the URL in the per-platform shape). */
  args: string[];
}

/** The `openBrowser` success result (REQ-004). */
export interface OpenBrowserSuccess {
  opened: true;
}

/** The `openBrowser` failure result (REQ-004, ACC-007): a single-line reason, never a throw. */
export interface OpenBrowserFailure {
  opened: false;
  /** The single-line human-readable explanation (never contains a newline). */
  reason: string;
}

export type OpenBrowserResult = OpenBrowserSuccess | OpenBrowserFailure;

/**
 * The spawn seam the unit leg stubs (REQ-004): the real
 * implementation is `node:child_process`'s own `spawn`, invoked
 * with the fire-and-forget options below.
 */
export type Spawner = (command: string, args: string[], options: SpawnOptions) => ChildProcess;

/**
 * The fire-and-forget spawn options every opener launch uses
 * (REQ-004, QA 4.0010): the child is a detached session leader with
 * its stdio ignored - it is fully independent of this process and
 * never inherits the MCP protocol channels (the stdout discipline,
 * REQ-001).
 */
export const OPENER_SPAWN_OPTIONS: SpawnOptions = {
  detached: true,
  stdio: 'ignore',
};

/**
 * Resolves the platform opener command + args for a URL (REQ-004):
 * `xdg-open` (Linux), `open` (macOS), and `cmd /c start "" <url>`
 * (Windows - `start` is a `cmd` builtin, so `cmd` itself is spawned;
 * the empty quoted title is mandatory when a URL follows, otherwise
 * `start` reads the URL as the window title). `null` on a platform
 * with no known opener (the `openBrowser` no-op failure leg).
 *
 * @param url - The URL to open.
 * @param target - The target platform (`os.platform()` by default in `openBrowser`).
 */
export function resolveOpenerCommand(url: string, target: NodeJS.Platform): OpenerCommand | null {
  if (target === 'linux') {
    return { command: 'xdg-open', args: [url] };
  }
  if (target === 'darwin') {
    return { command: 'open', args: [url] };
  }
  if (target === 'win32') {
    return { command: 'cmd', args: ['/c', 'start', '', url] };
  }
  return null;
}

/** The `openBrowser` options (the injectable spawner seam and platform; the stubbed-spawn unit leg). */
export interface OpenBrowserOptions {
  /** The spawn seam (defaults to the real `node:child_process` `spawn`). */
  spawner?: Spawner;
  /** The target platform (defaults to `os.platform()`). */
  platform?: NodeJS.Platform;
}

/** Collapses every whitespace run (including newlines) to a single space. */
function oneLine(value: string): string {
  return value.replace(/\s+/g, ' ').trim();
}

/**
 * Opens the user's default browser at `url` (REQ-004, QA 4.0010).
 *
 * Resolves with `{ opened: true }` when the opener process started
 * (the launch is fire-and-forget from here - the browser's own
 * outcome is not tracked), with `{ opened: false, reason }` (single
 * line) when the platform has no known opener, the opener binary is
 * missing (ENOENT), the spawn fails, or the spawner throws
 * synchronously. It never rejects: a spawn failure is a tool-result
 * detail, not a crash (ACC-007).
 *
 * @param url - The URL to open (the process view URL, typically).
 * @param options - The injectable spawner seam and platform (the unit leg).
 */
export function openBrowser(url: string, options: OpenBrowserOptions = {}): Promise<OpenBrowserResult> {
  const spawner = options.spawner ?? spawnBrowser;
  const target = options.platform ?? osPlatform();
  const opener = resolveOpenerCommand(url, target);
  if (opener === null) {
    return Promise.resolve({
      opened: false,
      reason: `no browser opener is known for the platform ${target}; open ${url} by hand`,
    });
  }
  return new Promise<OpenBrowserResult>((resolveOpen) => {
    let child: ChildProcess;
    try {
      child = spawner(opener.command, opener.args, OPENER_SPAWN_OPTIONS);
    } catch (error: unknown) {
      resolveOpen({
        opened: false,
        reason: `the browser opener could not be started: ${oneLine(String(error))}`,
      });
      return;
    }
    child.once('error', (error: NodeJS.ErrnoException) => {
      const detail = oneLine(error.message);
      if (error.code === 'ENOENT') {
        resolveOpen({ opened: false, reason: `the browser opener ${opener.command} is not available: ${detail}` });
      } else {
        resolveOpen({ opened: false, reason: `the browser opener failed to start: ${detail}` });
      }
    });
    child.once('spawn', () => {
      // The opener child is fire-and-forget (REQ-004): it must never
      // hold this process (the same discipline as the Phase 100
      // listener `unref()`, plan fix E1a).
      child.unref();
      resolveOpen({ opened: true });
    });
  });
}

/** The real spawn seam: `node:child_process`'s own `spawn` (REQ-004). */
function spawnBrowser(command: string, args: string[], spawnOptions: SpawnOptions): ChildProcess {
  return spawn(command, args, spawnOptions);
}
