// SPDX-FileCopyrightText: 2026 Ronald Rink, d-fens GmbH
// SPDX-License-Identifier: AGPL-3.0-only

/**
 * The feat-29 prototype server (REQ-001/REQ-002, Task 100.100 plus
 * Task 110.100): a zero-dependency `node:http` server bound to
 * `127.0.0.1` only on the
 * fixed port 8123 (8123 avoids 127.0.0.1:8080, permanently owned on
 * this system by an external root-owned service - the feat-20 note;
 * a configurable port or host is out of scope).
 *
 * Endpoints (the file API is Phase 110; `web/bridge.js` lands in
 * Phase 120):
 * - `GET /` - the Modeler page (`web/index.html`).
 * - `GET /bpmn-js/<file>` - files of the installed `bpmn-js`
 *   package's `dist` directory, resolved with Node's own resolver
 *   (`createRequire`) - the feat-20 asset pattern, mirroring
 *   `apps/mcp-server/src/preview/preview-server.ts` (including its
 *   path-safety: invalid percent-encoding and dot segments are 400,
 *   a path outside the `dist` directory is 404).
 * - `GET /bridge.js` - the feat-local `web/bridge.js`, when it exists
 *   (404 until Phase 120).
 * - the file API (REQ-002), confined to the feat-local `files/`
 *   scratch directory:
 *   - `GET /files` - a JSON array of the directory's regular-file
 *     names, sorted; an empty directory is `[]`.
 *   - `GET /file?name=` - the raw bytes of one scratch file; a
 *     validated name that does not exist is 404.
 *   - `POST /file?name=` - the only write endpoint: writes the raw
 *     request body to `files/<name>` and answers a small JSON
 *     confirmation.
 *   A `name` that escapes the scratch directory (a leading `/`, a
 *   path separator, a `.`/`..` name, or an encoded traversal) is
 *   rejected with 400; the flat-name rules are the primary 400 leg
 *   and a canonical `resolve` + `startsWith` guard stays as defense
 *   in depth.
 * - anything else, including a wrong method on a route - 404.
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
import { mkdir, readFile, readdir, stat, writeFile } from 'node:fs/promises';
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

/** This feat's `files/` scratch directory (REQ-002: the file API's only read/write location). */
const FEAT_FILES_DIR = join(FEAT_DIR, 'files');

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

/**
 * Extracts the raw (still percent-encoded) value of the first `name`
 * parameter from a raw query string; `null` when the query holds no
 * `name` parameter. The value may legitimately be the empty string
 * (`name=`), which the name validation rejects.
 */
function rawNameFromQuery(query) {
  for (const pair of query.split('&')) {
    const eq = pair.indexOf('=');
    if (eq > 0 && pair.slice(0, eq) === 'name') {
      return pair.slice(eq + 1);
    }
  }
  return null;
}

/**
 * Validates a file-API `name` (the shared leg of `GET /file?name=`
 * and `POST /file?name=`, REQ-002): the scratch directory is flat, so
 * the name must be a single non-empty file name - no leading `/` (an
 * absolute path), no path separator, no `.`/`..` - and its resolved
 * path must stay inside the `files/` directory (the canonical
 * `resolve` + `startsWith(FEAT_FILES_DIR + sep)` guard, defense in
 * depth; the flat-name rules are the primary 400 leg). Returns the
 * validated name with its resolved absolute path, or `null` when the
 * name must be rejected with 400.
 */
function resolveFileName(name) {
  if (name.length === 0) {
    return null;
  }
  if (name.startsWith('/') || name.includes(sep)) {
    return null;
  }
  if (name === '.' || name === '..') {
    return null;
  }
  const filePath = resolve(join(FEAT_FILES_DIR, name));
  if (!filePath.startsWith(FEAT_FILES_DIR + sep)) {
    return null;
  }
  return { name, filePath };
}

/**
 * Reads and validates the `name` query parameter for the file-API
 * routes (REQ-002): a missing parameter, invalid percent-encoding, or
 * a name that escapes the flat `files/` scratch directory is a 400 in
 * this server's JSON error shape; on success returns the validated
 * name and resolved path.
 */
function validatedFileName(query, response) {
  const raw = rawNameFromQuery(query);
  if (raw === null) {
    sendJson(response, 400, 'bad-request', 'the name query parameter is missing');
    return null;
  }
  const name = decodeSegment(raw);
  if (name === null) {
    sendJson(response, 400, 'bad-request', 'the name is not valid percent-encoding');
    return null;
  }
  const resolved = resolveFileName(name);
  if (resolved === null) {
    sendJson(response, 400, 'bad-request', 'the name must be a single file name inside the scratch directory');
    return null;
  }
  return resolved;
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
 * `GET /bridge.js`, `GET /bpmn-js/<file>`, and `GET /file?name=`): a
 * missing path or a non-file is 404, a regular file is 200 with
 * `cache-control: no-cache` (the served content reflects the state at
 * call time - the turn-based contract).
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

/**
 * The `GET /files` leg (REQ-002, Phase 110): a JSON array of the
 * scratch directory's regular-file names, sorted; an empty directory
 * is `[]`.
 */
async function listFiles(response) {
  const entries = await readdir(FEAT_FILES_DIR, { withFileTypes: true });
  const names = entries
    .filter((entry) => entry.isFile())
    .map((entry) => entry.name)
    .sort();
  response.writeHead(200, {
    'content-type': 'application/json; charset=utf-8',
    'cache-control': 'no-cache',
  });
  response.end(JSON.stringify(names));
}

/**
 * The `GET /file?name=` leg (REQ-002, Phase 110): the raw bytes of one
 * scratch file; a validated name that does not exist is 404 (the
 * `serveFile` leg).
 */
async function getFile(query, response) {
  const resolved = validatedFileName(query, response);
  if (resolved === null) {
    return;
  }
  await serveFile(resolved.filePath, response);
}

/**
 * The `POST /file?name=` leg (REQ-002, Phase 110): the only write
 * endpoint. Writes the raw request body to `files/<name>` (the
 * scratch directory is ensured on demand) and answers a small JSON
 * confirmation (`{ ok, name, bytes }`).
 */
async function postFile(query, request, response) {
  const resolved = validatedFileName(query, response);
  if (resolved === null) {
    return;
  }
  const chunks = [];
  for await (const chunk of request) {
    chunks.push(chunk);
  }
  const body = Buffer.concat(chunks);
  await mkdir(FEAT_FILES_DIR, { recursive: true });
  await writeFile(resolved.filePath, body);
  response.writeHead(200, {
    'content-type': 'application/json; charset=utf-8',
    'cache-control': 'no-cache',
  });
  response.end(JSON.stringify({ ok: true, name: resolved.name, bytes: body.byteLength }));
}

/** The request dispatcher: the static routes, the file API (`GET /files`, `GET /file?name=`, `POST /file?name=`), and 404 for everything else. */
async function handleRequest(request, response) {
  // The raw request path (like the preview server's dispatcher, not a
  // `URL`-normalized one): `..` segments stay visible so the asset
  // leg can reject them with 400. The query is split off raw as well,
  // so the file-API leg sees invalid percent-encoding (400).
  const rawUrl = request.url ?? '/';
  const queryIndex = rawUrl.indexOf('?');
  const pathname = queryIndex === -1 ? rawUrl : rawUrl.slice(0, queryIndex);
  const query = queryIndex === -1 ? '' : rawUrl.slice(queryIndex + 1);

  // Method discipline (Phase 110): `GET` is known on every route;
  // `POST` is known on `/file` only (the single write endpoint,
  // REQ-002). A wrong method keeps the server's simple 404 stance
  // (the Phase 100 decision) - no 405 machinery.
  if (request.method !== 'GET' && !(pathname === '/file' && request.method === 'POST')) {
    sendJson(response, 404, 'not-found', 'the route or method is not known on the prototype server');
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

  if (pathname === '/files') {
    await listFiles(response);
    return;
  }

  if (pathname === '/file') {
    if (request.method === 'GET') {
      await getFile(query, response);
    } else {
      await postFile(query, request, response);
    }
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

// The `files/` scratch directory exists before the first request
// (REQ-002): a creation failure is a start failure, reported on
// stderr with a non-zero exit, like a port failure.
try {
  await mkdir(FEAT_FILES_DIR, { recursive: true });
} catch (error) {
  process.stderr.write(`the scratch directory could not be created: ${error.message}\n`);
  process.exit(1);
}

server.listen(PORT, HOST);
