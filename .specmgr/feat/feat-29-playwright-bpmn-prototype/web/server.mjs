// SPDX-FileCopyrightText: 2026 Ronald Rink, d-fens GmbH
// SPDX-License-Identifier: AGPL-3.0-only

/**
 * The feat-29 prototype server (REQ-001, Task 100.100): a
 * zero-dependency `node:http` server bound to `127.0.0.1` only on the
 * fixed port 8123 (8123 avoids 127.0.0.1:8080, permanently owned on
 * this system by an external root-owned service - the feat-20 note;
 * a configurable port or host is out of scope).
 *
 * Endpoints (this phase only - the file API lands in Phase 110 and
 * `web/bridge.js` in Phase 120):
 * - `GET /` - the Modeler page (`web/index.html`).
 * - `GET /bpmn-js/<file>` - files of the installed `bpmn-js`
 *   package's `dist` directory, resolved with Node's own resolver
 *   (`createRequire`) - the feat-20 asset pattern, mirroring
 *   `apps/mcp-server/src/preview/preview-server.ts` (including its
 *   path-safety: invalid percent-encoding and dot segments are 400,
 *   a path outside the `dist` directory is 404).
 * - `GET /bridge.js` - the feat-local `web/bridge.js`, when it exists
 *   (404 until Phase 120).
 * - anything else - 404.
 *
 * Stdout discipline (REQ-001): nothing in this module writes to
 * stdout; the start failure is reported on stderr with a non-zero
 * exit.
 *
 * All feat-local paths are resolved relative to this file's own
 * `import.meta.url` (never `process.cwd()`), so
 * `node .specmgr/feat/feat-29-playwright-bpmn-prototype/web/server.mjs`
 * works from any working directory.
 */

import { existsSync } from 'node:fs';
import { readFile, stat } from 'node:fs/promises';
import { createServer } from 'node:http';
import { createRequire } from 'node:module';
import { dirname, extname, join, resolve, sep } from 'node:path';
import { fileURLToPath } from 'node:url';

/** The only host the server binds (REQ-001: loopback, never a network interface). */
const HOST = '127.0.0.1';

/** The fixed prototype port (REQ-001; 8080 is owned by an external service on this system). */
const PORT = 8123;

/** This feat's directory (the parent of this file's `web/` directory). */
const FEAT_DIR = resolve(dirname(dirname(fileURLToPath(import.meta.url))));

/** This feat's `web/` directory (the page, the future bridge). */
const WEB_DIR = join(FEAT_DIR, 'web');

/** The `createRequire` bound to this module's own URL (Node's own resolver). */
const prototypeRequire = createRequire(import.meta.url);

/**
 * Finds the directory holding a `package.json` by walking up from
 * `startDir` - inlined from the `findPackageRoot` idiom in
 * `apps/mcp-server/src/package-root.ts` (this feat's files must not
 * import component code).
 */
function findPackageRoot(startDir) {
  let current = resolve(startDir);
  for (;;) {
    if (existsSync(join(current, 'package.json'))) {
      return current;
    }
    const parent = dirname(current);
    if (parent === current) {
      throw new Error(`Could not locate a package.json above ${startDir}`);
    }
    current = parent;
  }
}

/**
 * Resolves the installed `bpmn-js` package's root directory, mirroring
 * `resolveBpmnJsPackageRoot` in
 * `apps/mcp-server/src/preview/preview-server.ts`: preferring the
 * package manifest subpath (the installed `bpmn-js` 18.x ships no
 * `exports` map, so the subpath resolves) and falling back to
 * resolving the main entry and walking up to the package root when a
 * future version adds a restrictive `exports` map.
 */
function resolveBpmnJsPackageRoot() {
  try {
    return dirname(prototypeRequire.resolve('bpmn-js/package.json'));
  } catch {
    return findPackageRoot(dirname(prototypeRequire.resolve('bpmn-js')));
  }
}

/** The installed `bpmn-js` package's `dist` directory (the asset root of `/bpmn-js/<file>`). */
const BPMN_JS_DIST_DIR = join(resolveBpmnJsPackageRoot(), 'dist');

/** The content types the server sends for the file extensions it can serve. */
const CONTENT_TYPES = {
  '.js': 'text/javascript; charset=utf-8',
  '.css': 'text/css; charset=utf-8',
  '.html': 'text/html; charset=utf-8',
  '.xml': 'application/xml; charset=utf-8',
  '.svg': 'image/svg+xml',
  '.woff': 'font/woff',
  '.woff2': 'font/woff2',
  '.ttf': 'font/ttf',
};

/** Decodes one URL path segment; `null` on invalid percent-encoding. */
function decodeSegment(segment) {
  try {
    return decodeURIComponent(segment);
  } catch {
    return null;
  }
}

/** The content type for a file by its extension (`application/octet-stream` otherwise). */
function contentTypeFor(filePath) {
  return CONTENT_TYPES[extname(filePath)] ?? 'application/octet-stream';
}

/** Sends one JSON error body (the consistent 4xx/5xx shape of this server). */
function sendJson(response, status, code, message) {
  response.writeHead(status, { 'content-type': 'application/json; charset=utf-8' });
  response.end(JSON.stringify({ error: { code, message } }));
}

/**
 * Serves one file by absolute path (the shared serving leg of `GET /`,
 * `GET /bridge.js`, and `GET /bpmn-js/<file>`): a missing path or a
 * non-file is 404, a regular file is 200 with `cache-control: no-cache`
 * (the served content reflects the state at call time - the
 * turn-based contract).
 */
async function serveFile(filePath, response) {
  let info;
  try {
    info = await stat(filePath);
  } catch {
    sendJson(response, 404, 'not-found', 'the resource is not found');
    return;
  }
  if (!info.isFile()) {
    sendJson(response, 404, 'not-found', 'the resource is not found');
    return;
  }
  const content = await readFile(filePath);
  response.writeHead(200, {
    'content-type': contentTypeFor(filePath),
    'content-length': content.byteLength,
    'cache-control': 'no-cache',
  });
  response.end(content);
}

/**
 * The `GET /bpmn-js/<file>` leg (REQ-001): serves one file from the
 * installed `bpmn-js` package's `dist` directory. Mirrors the
 * `serveAsset` leg of `apps/mcp-server/src/preview/preview-server.ts`:
 * percent-decode each segment (invalid encoding is 400), reject
 * dot segments (400), then the canonical guard - a decoded path that
 * resolves outside the `dist` directory never reads a file (404).
 */
async function serveBpmnJsAsset(segments, response) {
  const decoded = segments.map(decodeSegment);
  if (decoded.some((segment) => segment === null)) {
    sendJson(response, 400, 'bad-request', 'the asset path is not valid percent-encoding');
    return;
  }
  if (decoded.some((segment) => segment === '.' || segment === '..')) {
    sendJson(response, 400, 'bad-request', 'the asset path must not contain dot segments');
    return;
  }
  const filePath = resolve(join(BPMN_JS_DIST_DIR, ...decoded));
  if (!filePath.startsWith(BPMN_JS_DIST_DIR + sep)) {
    sendJson(response, 404, 'not-found', 'the asset is not found');
    return;
  }
  await serveFile(filePath, response);
}

/** The request dispatcher: `GET /`, `GET /bridge.js`, `GET /bpmn-js/<file>`, and 404 for everything else. */
async function handleRequest(request, response) {
  // The raw request path (like the preview server's dispatcher, not a
  // `URL`-normalized one): `..` segments stay visible so the asset
  // leg can reject them with 400.
  const pathname = (request.url ?? '/').split('?')[0];

  if (request.method !== 'GET') {
    sendJson(response, 404, 'not-found', 'only GET is known on the prototype server');
    return;
  }

  if (pathname === '/') {
    await serveFile(join(WEB_DIR, 'index.html'), response);
    return;
  }

  if (pathname === '/bridge.js') {
    // The feat-local bridge; 404 until Phase 120 creates it.
    await serveFile(join(WEB_DIR, 'bridge.js'), response);
    return;
  }

  if (pathname.startsWith('/bpmn-js/')) {
    const segments = pathname
      .split('/')
      .filter((segment) => segment.length > 0)
      .slice(1);
    await serveBpmnJsAsset(segments, response);
    return;
  }

  sendJson(response, 404, 'not-found', 'the route is not known');
}

const server = createServer((request, response) => {
  handleRequest(request, response).catch(() => {
    sendJson(response, 500, 'internal', 'an unexpected error occurred while serving the request');
  });
});

// A start failure is reported on stderr with a non-zero exit (never
// stdout, REQ-001): the port is fixed by the plan, so a busy port is a
// blocker, not a rebind.
server.on('error', (error) => {
  if (error.code === 'EADDRINUSE') {
    process.stderr.write(`the port ${PORT} on ${HOST} is already in use; the server did not start\n`);
  } else {
    process.stderr.write(`the server failed to start: ${error.message}\n`);
  }
  process.exit(1);
});

server.listen(PORT, HOST);
