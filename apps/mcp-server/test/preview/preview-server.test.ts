// SPDX-FileCopyrightText: 2026 Ronald Rink, d-fens GmbH
// SPDX-License-Identifier: AGPL-3.0-only

import { spawn } from 'node:child_process';
import { existsSync, mkdirSync, mkdtempSync, readFileSync, rmSync, writeFileSync } from 'node:fs';
import { request as httpRequest } from 'node:http';
import type { IncomingHttpHeaders } from 'node:http';
import { createServer as createNetServer } from 'node:net';
import type { AddressInfo } from 'node:net';
import { tmpdir } from 'node:os';
import { dirname, join, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';
import { afterEach, beforeEach, describe, expect, it } from 'vitest';
import {
  BPMN_JS_CSS_ASSET,
  buildViewUrl,
  DIAGRAM_JS_CSS_ASSET,
  DEFAULT_PORT,
  PREVIEW_HOST,
  PreviewServer,
  resolveBpmnJsDistDir,
  VIEWER_JS_ASSET,
} from '../../src/preview/preview-server.js';
import { resolveDocsPrcDir } from '../../src/paths.js';
import { collectElementInventory, parseBpmn } from '../../src/prc/moddle.js';
import type { PrcLogger } from '../../src/prc/store.js';
import { PrcStore } from '../../src/prc/store.js';

/**
 * HTTP-level tests of the Stage 1 preview server (feat-20 Phase 100,
 * REQ-001..REQ-003, REQ-005, REQ-006): every leg runs against an
 * ephemeral test port (the fixed 8080 is test-injectable, REQ-001),
 * with the store constructed exactly as `index.ts` constructs it (the
 * temporary working directory + `BPMN_MCP_DOCS_DIR`, the
 * `mcp-server.test.ts` idiom). The stdout-discipline / clean-shutdown
 * legs (REQ-001, REQ-005, plan fix E1) run in a child process against
 * the built `dist/` output, so the child's stdout is fully under the
 * test's control (the suite already requires a build: see
 * `mcp-server.spawn.test.ts`).
 */

// Resolve the component root and the fixture directory independent of
// the test runner's working directory (test/preview/ -> component root;
// test/fixtures/).
const COMPONENT_ROOT = resolve(dirname(fileURLToPath(import.meta.url)), '../..');
const FIXTURES_DIR = resolve(fileURLToPath(new URL('../fixtures/', import.meta.url)));
const ORDER_FIXTURE = join(FIXTURES_DIR, 'order-process.bpmn');
const FLAWED_FIXTURE = join(FIXTURES_DIR, 'flawed-process.bpmn');

// The built artifacts the child-process legs import (the tsconfig.build
// `rootDir: src` layout: dist/src-free top level).
const DIST_PREVIEW_SERVER = join(COMPONENT_ROOT, 'dist', 'preview', 'preview-server.js');
const DIST_STORE = join(COMPONENT_ROOT, 'dist', 'prc', 'store.js');

/** A well-formed v4 UUID that no test registers (the unknown-uuid legs). */
const UNKNOWN_UUID = '00000000-0000-4000-8000-000000000000';

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

/** Frees an ephemeral test port (a probe listener on port 0). */
async function getFreePort(): Promise<number> {
  const probe = createNetServer();
  await new Promise<void>((resolveProbe) => probe.listen(0, PREVIEW_HOST, resolveProbe));
  const { port } = probe.address() as AddressInfo;
  await new Promise<void>((resolveClose) => probe.close(() => resolveClose()));
  return port;
}

interface RawGetResult {
  status: number;
  body: string;
  headers: IncomingHttpHeaders;
}

/**
 * A raw `node:http` GET (no URL normalization on the client side): the
 * traversal legs send paths `fetch` would canonicalize away.
 */
function rawGet(port: number, path: string): Promise<RawGetResult> {
  return new Promise((resolveGet, rejectGet) => {
    const outgoing = httpRequest({ host: PREVIEW_HOST, port, path, method: 'GET' });
    outgoing.once('error', rejectGet);
    outgoing.end();
    outgoing.on('response', (response) => {
      const chunks: Buffer[] = [];
      response.on('data', (chunk: Buffer) => chunks.push(chunk));
      response.on('end', () =>
        resolveGet({
          status: response.statusCode ?? 0,
          body: Buffer.concat(chunks).toString('utf8'),
          headers: response.headers,
        }),
      );
    });
  });
}

/** The child-process stdout/stdout-leg script (plan fix E1, REQ-001/REQ-005). See the describe below. */
const CHILD_SHUTDOWN_SCRIPT = `
import { createServer } from 'node:net';
import { get } from 'node:http';
import { writeFileSync } from 'node:fs';
import { pathToFileURL } from 'node:url';

const [storePath, previewPath, prcDir, markerPath] = process.argv.slice(1);
const { PrcStore } = await import(pathToFileURL(storePath));
const { PreviewServer } = await import(pathToFileURL(previewPath));
const noop = { info: function () {}, warn: function () {}, error: function () {} };

function freePort() {
  return new Promise(function (resolvePort, rejectPort) {
    const probe = createServer();
    probe.once('error', rejectPort);
    probe.listen(0, '127.0.0.1', function () {
      const { port } = probe.address();
      probe.close(function () { resolvePort(port); });
    });
  });
}

function httpGet(port, path) {
  return new Promise(function (resolveGet, rejectGet) {
    get({ host: '127.0.0.1', port: port, path: path }, function (response) {
      response.resume();
      response.on('end', function () { resolveGet(response.statusCode); });
    }).on('error', rejectGet);
  });
}

async function main() {
  const store = new PrcStore(prcDir, noop);
  const created = await store.createProcess('Child Draft');
  if (!created.ok) {
    process.stderr.write('create failed: ' + JSON.stringify(created.error) + '\\n');
    process.exitCode = 1;
    return;
  }
  const port = await freePort();
  const preview = new PreviewServer(store, noop, { port: port });
  const started = await preview.ensureServer();
  if (!started.ok) {
    process.stderr.write('ensure failed: ' + JSON.stringify(started.error) + '\\n');
    process.exitCode = 1;
    return;
  }
  const pageStatus = await httpGet(port, '/view/' + created.uuid);
  const xmlStatus = await httpGet(port, '/processes/' + created.uuid);
  if (pageStatus !== 200 || xmlStatus !== 200) {
    process.stderr.write('request legs failed: page=' + pageStatus + ' xml=' + xmlStatus + '\\n');
    process.exitCode = 1;
    return;
  }
  // Leg 1 (E1c): the explicit close releases the port.
  await preview.closeServer();
  await new Promise(function (resolveRebind, rejectRebind) {
    const rebind = createServer();
    rebind.once('error', rejectRebind);
    rebind.listen(port, '127.0.0.1', function () {
      rebind.close(function () { resolveRebind(); });
    });
  });
  writeFileSync(markerPath, 'closed-and-rebound');
  // Leg 2 (E1a): start again and finish WITHOUT closing and WITHOUT
  // process.exit - the unref'd listener must not keep this process
  // alive on its own (a hang here ends as the test's timeout kill).
  const again = await preview.ensureServer();
  if (!again.ok) {
    process.stderr.write('restart ensure failed\\n');
    process.exitCode = 1;
    return;
  }
  const status = await httpGet(port, '/processes/' + created.uuid);
  if (status !== 200) {
    process.stderr.write('restart request leg failed: ' + status + '\\n');
    process.exitCode = 1;
    return;
  }
}

main();
`;

/** Runs the child script (ESM `node -e`), capturing its stdout/stderr and exit code. */
function runChild(script: string, args: string[]): Promise<{ code: number | null; stdout: Buffer; stderr: string }> {
  return new Promise((resolveRun, rejectRun) => {
    const child = spawn(process.execPath, ['--input-type=module', '-e', script, ...args], {
      stdio: ['ignore', 'pipe', 'pipe'],
    });
    const chunks: Buffer[] = [];
    let stderr = '';
    child.stdout.on('data', (chunk: Buffer) => chunks.push(chunk));
    child.stderr.on('data', (chunk: Buffer) => {
      stderr += chunk.toString();
    });
    child.on('error', rejectRun);
    const timer = setTimeout(() => child.kill('SIGKILL'), 20_000);
    child.on('close', (code) => {
      clearTimeout(timer);
      resolveRun({ code, stdout: Buffer.concat(chunks), stderr });
    });
  });
}

describe('preview server (feat-20 Phase 100, REQ-001..REQ-003, REQ-005, REQ-006)', () => {
  let tempDir: string;
  let store: PrcStore;
  let logger: PrcLogger;
  let records: LogRecord[];
  let originalCwd: string;
  let originalDocsDir: string | undefined;
  const servers: PreviewServer[] = [];

  function createPreviewServer(options: { port: number; assetDir?: string }): PreviewServer {
    const preview = new PreviewServer(store, logger, options);
    servers.push(preview);
    return preview;
  }

  async function startPreview(port?: number): Promise<{ preview: PreviewServer; port: number }> {
    const boundPort = port ?? (await getFreePort());
    const preview = createPreviewServer({ port: boundPort });
    const result = await preview.ensureServer();
    expect(result).toEqual({ ok: true, port: boundPort, reused: false });
    return { preview, port: boundPort };
  }

  function baseUrl(port: number): string {
    return `http://${PREVIEW_HOST}:${port}`;
  }

  beforeEach(() => {
    originalCwd = process.cwd();
    originalDocsDir = process.env.BPMN_MCP_DOCS_DIR;
    tempDir = mkdtempSync(join(tmpdir(), 'bpmnmcp-preview-'));
    process.chdir(tempDir);
    process.env.BPMN_MCP_DOCS_DIR = join(tempDir, 'docs');
    ({ logger, records } = createFakeLogger());
    store = new PrcStore(resolveDocsPrcDir(), logger);
  });

  afterEach(async () => {
    for (const preview of servers.splice(0)) {
      await preview.closeServer();
    }
    process.chdir(originalCwd);
    if (originalDocsDir === undefined) {
      delete process.env.BPMN_MCP_DOCS_DIR;
    } else {
      process.env.BPMN_MCP_DOCS_DIR = originalDocsDir;
    }
    rmSync(tempDir, { recursive: true, force: true });
  });

  describe('the pinned constants (REQ-001, REQ-003, plan fix G3)', () => {
    it('pins the fixed port, the loopback host, and the view URL scheme', () => {
      expect(DEFAULT_PORT).toBe(8080);
      expect(PREVIEW_HOST).toBe('127.0.0.1');
      expect(buildViewUrl(DEFAULT_PORT, UNKNOWN_UUID)).toBe(`http://127.0.0.1:8080/view/${UNKNOWN_UUID}`);
    });

    it('resolves the installed bpmn-js dist directory with the pinned assets present (G3)', () => {
      const distDir = resolveBpmnJsDistDir();
      expect(distDir).toContain('bpmn-js');
      for (const asset of [VIEWER_JS_ASSET, DIAGRAM_JS_CSS_ASSET, BPMN_JS_CSS_ASSET]) {
        expect(existsSync(join(distDir, asset))).toBe(true);
      }
    });
  });

  describe('the lifecycle (REQ-001, REQ-005, ACC-002 leg, plan fix E1)', () => {
    it('starts lazily on the first ensure and reuses the live server on the second (no second bind, same port)', async () => {
      const { preview, port } = await startPreview();

      const second = await preview.ensureServer();
      expect(second).toEqual({ ok: true, port, reused: true });
      expect(preview.isRunning()).toBe(true);
      expect(preview.getPort()).toBe(port);
      // The same port is still serving (no rebind, no error).
      const page = await fetch(`${baseUrl(port)}/view/${UNKNOWN_UUID}`);
      expect(page.status).toBe(200);
      await page.body?.cancel();
    });

    it('concurrent ensures perform exactly one bind (REQ-005)', async () => {
      const port = await getFreePort();
      const preview = createPreviewServer({ port });

      const results = await Promise.all([preview.ensureServer(), preview.ensureServer(), preview.ensureServer()]);
      for (const result of results) {
        expect(result.ok).toBe(true);
      }
      expect(preview.isRunning()).toBe(true);
      // If two binds had happened, a fresh server on the same port
      // would hit the in-use error.
      const other = createPreviewServer({ port });
      const clash = await other.ensureServer();
      expect(clash).toEqual({
        ok: false,
        error: { code: 'port-in-use', port, message: expect.stringContaining(String(port)) },
      });
    });

    it('an in-use port is a structured error at start - never a silent rebind (REQ-001)', async () => {
      const port = await getFreePort();
      const blocker = createNetServer();
      await new Promise<void>((resolveBlocker) => blocker.listen(port, PREVIEW_HOST, resolveBlocker));
      try {
        const preview = createPreviewServer({ port });
        const result = await preview.ensureServer();
        expect(result).toEqual({
          ok: false,
          error: { code: 'port-in-use', port, message: expect.stringContaining(String(port)) },
        });
        expect(preview.isRunning()).toBe(false);
        // No poisoned state: a later ensure on a free port starts.
        const retry = createPreviewServer({ port: await getFreePort() });
        expect(retry.isRunning()).toBe(false);
        const retried = await retry.ensureServer();
        expect(retried.ok).toBe(true);
        if (retried.ok) {
          expect(retried.port).toBe(retry.getPort());
        }
        // The structured failure was logged through the injected logger
        // (never stdout, REQ-001).
        expect(records.some((record) => record.event === 'preview-port-in-use' && record.level === 'warn')).toBe(true);
      } finally {
        await new Promise<void>((resolveClose) => blocker.close(() => resolveClose()));
      }
    });

    it('close releases the port and is idempotent (REQ-005, E1c leg)', async () => {
      const { preview, port } = await startPreview();
      const page = await fetch(`${baseUrl(port)}/view/${UNKNOWN_UUID}`);
      expect(page.status).toBe(200);
      await page.body?.cancel();

      await preview.closeServer();
      expect(preview.isRunning()).toBe(false);

      // The port is free: a fresh listener can bind it.
      const rebind = createNetServer();
      await new Promise<void>((resolveRebind) => rebind.listen(port, PREVIEW_HOST, resolveRebind));
      await new Promise<void>((resolveClose) => rebind.close(() => resolveClose()));

      // A second close is a no-op.
      await expect(preview.closeServer()).resolves.toBeUndefined();
    });

    it('logs the start and each request through the injected logger (never stdout, REQ-001)', async () => {
      const { port } = await startPreview();
      const response = await fetch(`${baseUrl(port)}/view/${UNKNOWN_UUID}`);
      expect(response.status).toBe(200);
      await response.body?.cancel();

      expect(records.some((record) => record.event === 'preview-server-started' && record.level === 'info')).toBe(true);
      expect(
        records.some(
          (record) => record.event === 'preview-request' && record.level === 'info' && record.msg.includes('served'),
        ),
      ).toBe(true);
      expect(records.some((record) => record.event === 'preview-request-failed')).toBe(false);
    });
  });

  describe('the view page (REQ-003, ACC-003 leg)', () => {
    it('serves the single static asset with the viewer markers and the intact watermark', async () => {
      const { port } = await startPreview();
      const response = await fetch(`${baseUrl(port)}/view/${UNKNOWN_UUID}`);
      expect(response.status).toBe(200);
      expect(response.headers.get('content-type')).toContain('text/html');
      const html = await response.text();

      // The page runs the read-only Viewer from the pinned bundle over
      // the fixed asset prefix, with both pinned CSS files.
      expect(html).toContain('id="bpmn-canvas"');
      expect(html).toContain(`src="/bpmn-js/${VIEWER_JS_ASSET}"`);
      expect(html).toContain(`href="/bpmn-js/${DIAGRAM_JS_CSS_ASSET}"`);
      expect(html).toContain(`href="/bpmn-js/${BPMN_JS_CSS_ASSET}"`);
      expect(html).toContain('new BpmnJS(');
      // The turn-based fetch of the current state (QA 4.0010).
      expect(html).toContain("/processes/' +");
      // Read-only: the Viewer bundle is loaded, never the Modeler build.
      expect(html).not.toContain('bpmn-modeler');
      // The "powered by bpmn.io" watermark (the accepted bpmn.io License
      // clause) is unmodified: the page applies no CSS override to the
      // powered-by element.
      expect(html).not.toContain('powered-by');
    });
  });

  describe('the /processes/<uuid> XML endpoint (REQ-002, ACC-001 leg)', () => {
    it('serves the imported process XML as application/xml (re-read state)', async () => {
      const { port } = await startPreview();
      const imported = await store.importProcess(ORDER_FIXTURE);
      expect(imported.ok).toBe(true);
      if (!imported.ok) {
        return;
      }

      const response = await fetch(`${baseUrl(port)}/processes/${imported.uuid}`);
      expect(response.status).toBe(200);
      expect(response.headers.get('content-type')).toContain('application/xml');
      const xml = await response.text();
      expect(xml).toContain('order-process');
      // The served XML re-parses to the fixture's element inventory.
      const served = (await parseBpmn(xml)).rootElement;
      const expected = (await parseBpmn(readFileSync(ORDER_FIXTURE))).rootElement;
      expect(collectElementInventory(served)).toEqual(collectElementInventory(expected));
    });

    it('serves an out-of-band modification after the store conditional re-read (turn-based, REQ-002)', async () => {
      const { port } = await startPreview();
      const imported = await store.importProcess(ORDER_FIXTURE);
      expect(imported.ok).toBe(true);
      if (!imported.ok) {
        return;
      }

      expect(await (await fetch(`${baseUrl(port)}/processes/${imported.uuid}`)).text()).toContain('order-process');
      // The out-of-band change: the registered file is replaced (same
      // conforming name), the way another instance would do it.
      writeFileSync(imported.path, readFileSync(FLAWED_FIXTURE));

      const xml = await (await fetch(`${baseUrl(port)}/processes/${imported.uuid}`)).text();
      expect(xml).toContain('flawed-process');
      expect(xml).not.toContain('order-process');
    });

    it('serves a session draft from memory (draft-first, the store convention)', async () => {
      const { port } = await startPreview();
      const created = await store.createProcess('Preview Draft', [{ type: 'task', name: 'Draft Task' }]);
      expect(created.ok).toBe(true);
      if (!created.ok) {
        return;
      }

      const response = await fetch(`${baseUrl(port)}/processes/${created.uuid}`);
      expect(response.status).toBe(200);
      const xml = await response.text();
      expect(xml).toContain(created.processId);
    });

    it('returns 404 for an unknown uuid and 400 for a malformed one (REQ-002)', async () => {
      const { port } = await startPreview();
      const response = await fetch(`${baseUrl(port)}/processes/${UNKNOWN_UUID}`);
      expect(response.status).toBe(404);
      const body = (await response.json()) as { error: { code: string } };
      expect(body.error.code).toBe('process-not-registered');

      const malformed = await fetch(`${baseUrl(port)}/processes/%zz`);
      expect(malformed.status).toBe(400);
      await malformed.body?.cancel();
    });
  });

  describe('the static assets (REQ-003, plan fix G3)', () => {
    it('serves the pinned viewer bundle and both pinned CSS files with sensible content types', async () => {
      const { port } = await startPreview();

      const js = await fetch(`${baseUrl(port)}/bpmn-js/${VIEWER_JS_ASSET}`);
      expect(js.status).toBe(200);
      expect(js.headers.get('content-type')).toContain('javascript');
      const jsText = await js.text();
      expect(jsText.length).toBeGreaterThan(10_000);
      expect(jsText).toContain('BpmnJS');

      const diagramCss = await fetch(`${baseUrl(port)}/bpmn-js/${DIAGRAM_JS_CSS_ASSET}`);
      expect(diagramCss.status).toBe(200);
      expect(diagramCss.headers.get('content-type')).toContain('text/css');
      expect(await diagramCss.text()).toContain('.djs-');

      const bpmnCss = await fetch(`${baseUrl(port)}/bpmn-js/${BPMN_JS_CSS_ASSET}`);
      expect(bpmnCss.status).toBe(200);
      expect(bpmnCss.headers.get('content-type')).toContain('text/css');
    });

    it('resolves every relative url() reference of the served CSS (no dangling asset)', async () => {
      const { port } = await startPreview();
      for (const asset of [DIAGRAM_JS_CSS_ASSET, BPMN_JS_CSS_ASSET]) {
        const css = await (await fetch(`${baseUrl(port)}/bpmn-js/${asset}`)).text();
        const references = [...css.matchAll(/url\(\s*(['"]?)([^'")]+)\1\s*\)/g)].map((match) => match[2]);
        for (const reference of references) {
          if (reference.startsWith('data:')) {
            continue;
          }
          const url = new URL(reference, `${baseUrl(port)}/bpmn-js/${asset}`).href;
          const response = await fetch(url);
          expect({ asset, reference, status: response.status }).toEqual({ asset, reference, status: 200 });
          await response.body?.cancel();
        }
      }
    });

    it('rejects traversal out of the asset directory (400 dot segments, 404 escapes; no file read)', async () => {
      const { port } = await startPreview();

      // Raw (unnormalized) paths: fetch would canonicalize these away.
      const dot = await rawGet(port, '/bpmn-js/..');
      expect(dot.status).toBe(400);
      expect(dot.body).not.toContain('"name"');
      const encodedDot = await rawGet(port, '/bpmn-js/%2e%2e');
      expect(encodedDot.status).toBe(400);
      // A `%2f`-joined sequence decodes to a slash inside one segment:
      // the canonical guard (not the dot check) stops it.
      const escape = await rawGet(port, '/bpmn-js/..%2f..%2fpackage.json');
      expect(escape.status).toBe(404);
      expect(escape.body).not.toContain('"name"');
      const missing = await rawGet(port, '/bpmn-js/does-not-exist.js');
      expect(missing.status).toBe(404);
    });

    it('serves an unknown extension as octet-stream from an injected asset dir', async () => {
      const port = await getFreePort();
      const assetDir = join(tempDir, 'assets');
      mkdirSync(assetDir, { recursive: true });
      writeFileSync(join(assetDir, 'note.txt'), 'hello');

      const preview = createPreviewServer({ port, assetDir });
      const result = await preview.ensureServer();
      expect(result).toEqual({ ok: true, port, reused: false });

      const response = await fetch(`${baseUrl(port)}/bpmn-js/note.txt`);
      expect(response.status).toBe(200);
      expect(response.headers.get('content-type')).toContain('application/octet-stream');
      expect(await response.text()).toBe('hello');
    });
  });

  describe('unknown paths and methods (REQ-002: no write endpoints)', () => {
    it('404s the unknown routes', async () => {
      const { port } = await startPreview();
      const paths = [
        '/',
        '/processes',
        '/view',
        '/bpmn-js',
        '/nope',
        `/processes/${UNKNOWN_UUID}/extra`,
        `/view/${UNKNOWN_UUID}/extra`,
      ];
      for (const path of paths) {
        const response = await fetch(`${baseUrl(port)}${path}`);
        expect({ path, status: response.status }).toEqual({ path, status: 404 });
        await response.body?.cancel();
      }
    });

    it('405s non-GET methods on the known routes with the Allow header', async () => {
      const { port } = await startPreview();
      const post = await fetch(`${baseUrl(port)}/view/${UNKNOWN_UUID}`, { method: 'POST' });
      expect(post.status).toBe(405);
      expect(post.headers.get('allow')).toBe('GET, HEAD');
      await post.body?.cancel();

      const put = await fetch(`${baseUrl(port)}/processes/${UNKNOWN_UUID}`, { method: 'PUT' });
      expect(put.status).toBe(405);
      await put.body?.cancel();

      // An unknown route 404s regardless of the method.
      const unknown = await fetch(`${baseUrl(port)}/nope`, { method: 'POST' });
      expect(unknown.status).toBe(404);
      await unknown.body?.cancel();
    });
  });

  describe('stdout discipline and clean shutdown (REQ-001, REQ-005, plan fix E1)', () => {
    it('exists as built artifacts to import (run `npm run build` first)', () => {
      expect(existsSync(DIST_PREVIEW_SERVER)).toBe(true);
      expect(existsSync(DIST_STORE)).toBe(true);
    });

    it('writes nothing to stdout with the server up, exits free of the listener, and close releases the port (child-process leg)', async () => {
      const marker = join(tempDir, 'shutdown-marker');
      const prcDir = join(tempDir, 'docs', 'prc');
      const { code, stdout, stderr } = await runChild(CHILD_SHUTDOWN_SCRIPT, [
        DIST_STORE,
        DIST_PREVIEW_SERVER,
        prcDir,
        marker,
      ]);

      // The child finished on its own (no timeout kill): exit code 0.
      // It ended with the preview server still up - so the unref'd
      // listener (E1a) kept the process free to exit on its own.
      expect({ code, stderr }).toEqual({ code: 0, stderr: '' });
      // REQ-001 / QA 0.0050: the server wrote nothing to stdout while
      // serving (the stdio protocol constraint).
      expect(stdout.length).toBe(0);
      // E1c: the explicit close released the port (the rebind marker
      // is only written after the successful rebind).
      expect(existsSync(marker)).toBe(true);
    }, 30_000);
  });
});
