// SPDX-FileCopyrightText: 2026 Ronald Rink, d-fens GmbH
// SPDX-License-Identifier: AGPL-3.0-only

import { existsSync } from 'node:fs';
import type { Stats } from 'node:fs';
import { readFile, stat } from 'node:fs/promises';
import { createServer } from 'node:http';
import type { IncomingMessage, Server, ServerResponse } from 'node:http';
import { createRequire } from 'node:module';
import { dirname, join, resolve, sep } from 'node:path';
import { precondition } from '../assertions.js';
import { findPackageRoot } from '../package-root.js';
import type { PrcError, PrcLogger, PrcStore } from '../prc/store.js';
import { PREVIEW_PAGE } from './preview-page.js';

/**
 * The Stage 1 preview HTTP server (REQ-001..REQ-003, REQ-005, QA
 * 4.0010/4.0020/6.0010): a zero-dependency `node:http` server inside
 * the MCP server process, bound to `127.0.0.1` only (QA 6.0010) on a
 * fixed port (8080, test-injectable) that stays alive across repeated
 * `preview` calls (the turn-based contract).
 *
 * Endpoints (REQ-002; no write endpoints, no authentication --
 * local-only):
 * - `GET /processes/<uuid>` -- the process's current XML
 *   (`application/xml`) after the store's conditional re-read (the
 *   store's `readProcessXml`, draft-first); an unknown uuid is 404.
 * - `GET /view/<uuid>` -- the static preview page (`preview-page.ts`,
 *   REQ-003's single asset), a read-only bpmn-js Viewer (QA 4.0020);
 *   the page reads the uuid from its own path and fetches
 *   `/processes/<uuid>`.
 * - `GET /bpmn-js/<file>` -- the assets of the installed `bpmn-js`
 *   package, served from its `dist` directory (REQ-003): the pinned
 *   viewer bundle and CSS files, plus every other file under the
 *   prefix (e.g. resources a CSS references).
 *
 * Lifecycle (REQ-005, plan fix E1): `ensureServer()` starts the
 * server on first call (the lazy start -- the first `preview` call
 * materializes it in Phase 110) and is idempotent afterwards;
 * `closeServer()` is the explicit clean-shutdown path (Phase 110 /
 * the entry point wire it -- see its doc). A port already in use is a
 * structured `port-in-use` error at start -- never a silent rebind
 * (REQ-001). The listener is `unref()`ed at start so it cannot keep
 * the process alive on its own once the stdio work is done (E1a);
 * the explicit `closeServer()` remains the deterministic shutdown leg
 * that releases the port (E1b).
 *
 * Stdout discipline (REQ-001, QA 0.0050): nothing in this module
 * writes to stdout -- every log line goes through the injected
 * pino-compatible logger (stderr and the rolling file, like
 * everything else), and the request handlers write only to the HTTP
 * response.
 *
 * Layering (CONSTITUTION §4, QA 7.0010/7.0030): this module is not an
 * MCP adapter -- it reads process XML exclusively through the store
 * (core) and touches the filesystem only for static asset reads; it
 * imports neither the MCP SDK nor the adapter files.
 */

/** The fixed preview port (REQ-001, QA 4.0010: 8080 for Stage 1). */
export const DEFAULT_PORT = 8080;

/** The only host the preview server binds (REQ-001, QA 6.0010: loopback, never a network interface). */
export const PREVIEW_HOST = '127.0.0.1';

/** The fixed URL prefix under which the installed `bpmn-js` package's `dist` assets are served (REQ-003). */
export const ASSET_URL_PREFIX = '/bpmn-js/';

/** The pinned viewer JS bundle, relative to the `bpmn-js` package's `dist` directory (REQ-003, plan fix G3). */
export const VIEWER_JS_ASSET = 'bpmn-viewer.production.min.js';

/** The pinned diagram-js base CSS, relative to `dist` (REQ-003, plan fix G3). */
export const DIAGRAM_JS_CSS_ASSET = 'assets/diagram-js.css';

/** The pinned bpmn-js CSS, relative to `dist` (REQ-003, plan fix G3). */
export const BPMN_JS_CSS_ASSET = 'assets/bpmn-js.css';

/** The content types the preview server sends for the file extensions it can serve. */
const CONTENT_TYPES: Record<string, string> = {
  '.js': 'text/javascript; charset=utf-8',
  '.css': 'text/css; charset=utf-8',
  '.xml': 'application/xml; charset=utf-8',
  '.html': 'text/html; charset=utf-8',
  '.svg': 'image/svg+xml',
  '.woff': 'font/woff',
  '.woff2': 'font/woff2',
  '.ttf': 'font/ttf',
};

/** The fallback content type for a served file without a known extension. */
const OCTET_STREAM = 'application/octet-stream';

/** The `createRequire` bound to this module's own URL (REQ-003: Node's own resolver). */
const bpmnRequire = createRequire(import.meta.url);

/** The preview server's structured error: a code plus a single-line message (the store's `PrcError` shape). */
export interface PreviewError {
  code: 'port-in-use';
  /** The port the error is about. */
  port: number;
  message: string;
}

/** The `ensureServer` success result (REQ-001, REQ-005). */
export interface EnsurePreviewServerSuccess {
  ok: true;
  /** The port the server listens on (on `127.0.0.1`). */
  port: number;
  /** Whether a live server was reused instead of a fresh bind (idempotent ensure, ACC-002). */
  reused: boolean;
}

/** The `ensureServer` failure result (REQ-001: the port is already in use -- never a silent rebind). */
export interface EnsurePreviewServerFailure {
  ok: false;
  error: PreviewError;
}

export type EnsurePreviewServerResult = EnsurePreviewServerSuccess | EnsurePreviewServerFailure;

/** The `PreviewServer` options (REQ-001: the port is test-injectable). */
export interface PreviewServerOptions {
  /** The port to bind (defaults to `DEFAULT_PORT`, 8080). */
  port?: number;
  /**
   * The directory the `/bpmn-js/` prefix route serves from (defaults
   * to the installed `bpmn-js` package's `dist` directory; injectable
   * for the tests).
   */
  assetDir?: string;
}

/**
 * Resolves the installed `bpmn-js` package's root directory
 * (REQ-003, plan fix G3): through Node's own resolver
 * (`createRequire`), preferring the package manifest subpath -- the
 * installed `bpmn-js` (18.x) ships no `exports` map, so the subpath
 * resolves -- and falling back to resolving the main entry and walking
 * up to the package root (the `findPackageRoot` idiom) when a future
 * version adds a restrictive `exports` map that rejects the manifest
 * subpath (`ERR_PACKAGE_PATH_NOT_EXPORTED`).
 */
export function resolveBpmnJsPackageRoot(): string {
  try {
    return dirname(bpmnRequire.resolve('bpmn-js/package.json'));
  } catch {
    // A restrictive `exports` map rejects the manifest subpath:
    // resolve the main entry and walk up to the package root.
    return findPackageRoot(dirname(bpmnRequire.resolve('bpmn-js')));
  }
}

/**
 * Resolves the installed `bpmn-js` package's `dist` directory
 * (REQ-003, plan fix G3): the package root's `dist`, asserting the
 * pinned asset files' existence (a package that does not ship them is
 * a broken install -- a crashed invariant, not a tool error).
 */
export function resolveBpmnJsDistDir(): string {
  const distDir = join(resolveBpmnJsPackageRoot(), 'dist');
  for (const asset of [VIEWER_JS_ASSET, DIAGRAM_JS_CSS_ASSET, BPMN_JS_CSS_ASSET]) {
    precondition(existsSync(join(distDir, asset)), `the installed bpmn-js package must ship ${asset} under ${distDir}`);
  }
  return distDir;
}

/**
 * Builds the view URL for a process (the plan's Design Notes view-URL
 * scheme): `http://127.0.0.1:<port>/view/<uuid>` -- the URL the Phase
 * 110 browser opener points the user's default browser at.
 *
 * @param port - The port the preview server listens on.
 * @param uuid - The process UUID.
 */
export function buildViewUrl(port: number, uuid: string): string {
  return `http://${PREVIEW_HOST}:${port}/view/${uuid}`;
}

/** The preview server (see the module documentation). */
export class PreviewServer {
  private readonly store: PrcStore;

  private readonly logger: PrcLogger;

  private readonly port: number;

  private readonly assetDir: string;

  private httpServer: Server | null = null;

  private pendingEnsure: Promise<EnsurePreviewServerResult> | null = null;

  /**
   * @param store - The `prc` artifact store the XML endpoint reads from (the core).
   * @param logger - The pino-compatible structured logger (never stdout, REQ-001).
   * @param options - The port (defaults to `DEFAULT_PORT`) and the asset directory (defaults to the installed `bpmn-js` `dist`).
   */
  constructor(store: PrcStore, logger: PrcLogger, options: PreviewServerOptions = {}) {
    precondition(
      typeof logger.info === 'function' && typeof logger.warn === 'function' && typeof logger.error === 'function',
      'the logger must be a pino-compatible logger (info/warn/error)',
    );
    const port = options.port ?? DEFAULT_PORT;
    precondition(Number.isInteger(port) && port > 0 && port <= 65535, 'the port must be a positive integer');
    this.store = store;
    this.logger = logger;
    this.port = port;
    this.assetDir = resolve(options.assetDir ?? resolveBpmnJsDistDir());
  }

  /**
   * Starts the server when it is not running and resolves with the
   * bound port (REQ-001, REQ-005). Idempotent: a call while the
   * server is live (or while a start is pending) reuses it -- no
   * second bind attempt, no error (ACC-002). A port already in use is
   * a structured `port-in-use` error -- never a silent rebind
   * (REQ-001); a later call may retry the bind.
   */
  ensureServer(): Promise<EnsurePreviewServerResult> {
    if (this.httpServer !== null) {
      return Promise.resolve({ ok: true, port: this.port, reused: true });
    }
    if (this.pendingEnsure !== null) {
      return this.pendingEnsure;
    }
    this.pendingEnsure = this.startServer().finally(() => {
      this.pendingEnsure = null;
    });
    return this.pendingEnsure;
  }

  /**
   * Closes the preview server (REQ-005, plan fix E1b): stops
   * accepting new connections, closes the idle (keep-alive)
   * connections immediately, and resolves when the listener is fully
   * down and the port released. Idempotent -- closing a server that
   * was never started, or was already closed, is a no-op;
   * `ensureServer()` may start a fresh server afterwards.
   *
   * WIRING POINT (Phase 110 / the entry point): the `preview` tool
   * keeps one `PreviewServer` for the process lifetime; the clean
   * shutdown path that Phase 110 materializes in `src/index.ts` (the
   * MCP session end) calls `await previewServer.closeServer()` there.
   * The `unref()` at start (E1a) only guarantees the listener does
   * not keep the process alive on its own; this explicit close is the
   * deterministic shutdown leg that releases the port and pending
   * keep-alive connections.
   */
  async closeServer(): Promise<void> {
    const server = this.httpServer;
    if (server === null) {
      return;
    }
    this.httpServer = null;
    await new Promise<void>((resolveClose) => {
      server.close(() => resolveClose());
      // Deterministic shutdown: the idle (keep-alive) connections are
      // closed immediately so the `close` callback cannot be held open
      // by pooled browser/test sockets (Node >= 18.2).
      server.closeIdleConnections();
    });
    this.logger.info({ event: 'preview-server-closed', port: this.port }, 'the preview server was closed');
  }

  /** Whether the server is currently listening (the idempotent-ensure state, REQ-005). */
  isRunning(): boolean {
    return this.httpServer !== null;
  }

  /** The configured port (the bound port once running). */
  getPort(): number {
    return this.port;
  }

  /**
   * The actual bind (the non-idempotent leg of `ensureServer`):
   * creates the `node:http` server, listens on `127.0.0.1:<port>`,
   * and `unref()`s the listener at start (E1a: the listener must not
   * keep the process alive on its own once the stdio work is done).
   * An `EADDRINUSE` is a structured `port-in-use` failure (REQ-001 --
   * never a silent rebind); any other start error is rethrown (a
   * crashed invariant / environment failure, not a tool error).
   */
  private startServer(): Promise<EnsurePreviewServerResult> {
    const server = createServer((request, response) => {
      this.handleRequest(request, response).catch((error: unknown) => {
        this.logger.error(
          { event: 'preview-request-failed', error: error instanceof Error ? error.message : String(error) },
          'a preview request failed',
        );
        this.sendJson(response, 500, {
          error: { code: 'internal', message: 'an unexpected error occurred while serving the request' },
        });
      });
    });

    return new Promise<EnsurePreviewServerResult>((resolveStart) => {
      const onStartError = (error: NodeJS.ErrnoException): void => {
        if (error.code === 'EADDRINUSE') {
          this.logger.warn(
            { event: 'preview-port-in-use', port: this.port },
            'the preview port is already in use; the preview server did not start',
          );
          resolveStart({
            ok: false,
            error: {
              code: 'port-in-use',
              port: this.port,
              message: `port ${this.port} on ${PREVIEW_HOST} is already in use; the preview server did not start`,
            },
          });
          return;
        }
        throw error;
      };
      server.once('error', onStartError);
      server.listen(this.port, PREVIEW_HOST, () => {
        server.removeListener('error', onStartError);
        server.on('error', (error: NodeJS.ErrnoException) => {
          this.logger.error(
            { event: 'preview-server-error', code: error.code, error: error.message },
            'a preview server error occurred',
          );
        });
        // E1a: the listener must not keep the process alive on its
        // own once the stdio work is done (the explicit close is
        // `closeServer`, the E1b leg).
        server.unref();
        this.httpServer = server;
        this.logger.info(
          { event: 'preview-server-started', port: this.port, host: PREVIEW_HOST },
          'the preview server is listening',
        );
        resolveStart({ ok: true, port: this.port, reused: false });
      });
    });
  }

  /**
   * The request dispatcher (REQ-002): routes on the URL path -- the
   * data endpoint (`/processes/<uuid>`), the page endpoint
   * (`/view/<uuid>`), the asset prefix (`/bpmn-js/<file>`), and a 404
   * for everything else -- and logs each request through the injected
   * logger (never stdout, REQ-001).
   */
  private async handleRequest(request: IncomingMessage, response: ServerResponse): Promise<void> {
    const pathname = (request.url ?? '/').split('?')[0];
    const segments = pathname.split('/').filter((segment) => segment.length > 0);
    const status = await this.route(request, segments, response);
    this.logger.info(
      { event: 'preview-request', method: request.method, path: pathname, status },
      'served a preview request',
    );
  }

  /** Routes one request to its endpoint handler (or the 404). */
  private async route(request: IncomingMessage, segments: string[], response: ServerResponse): Promise<number> {
    if (segments.length === 2 && segments[0] === 'processes') {
      return this.methodAllowed(request, response, () => this.serveProcessXml(segments[1], response));
    }
    if (segments.length === 2 && segments[0] === 'view') {
      return this.methodAllowed(request, response, () => Promise.resolve(this.servePage(response)));
    }
    // The first segment is the `ASSET_URL_PREFIX` route (minus its
    // slashes): the installed `bpmn-js` package's `dist` assets.
    if (segments.length >= 2 && segments[0] === 'bpmn-js') {
      return this.methodAllowed(request, response, () => this.serveAsset(segments.slice(1), response));
    }
    this.sendJson(response, 404, { error: { code: 'not-found', message: 'the preview path is not known' } });
    return 404;
  }

  /**
   * The method gate (REQ-002: no write endpoints): `GET`/`HEAD` pass
   * to the route's handler; every other method is a 405 with the
   * `Allow` header.
   */
  private methodAllowed(
    request: IncomingMessage,
    response: ServerResponse,
    handler: () => Promise<number>,
  ): Promise<number> {
    if (request.method !== 'GET' && request.method !== 'HEAD') {
      response.setHeader('allow', 'GET, HEAD');
      this.sendJson(response, 405, {
        error: { code: 'method-not-allowed', message: 'only GET is allowed on the preview routes' },
      });
      return Promise.resolve(405);
    }
    return handler();
  }

  /** The `GET /view/<uuid>` leg: the single static preview page (REQ-003). */
  private servePage(response: ServerResponse): number {
    this.sendHtml(response, PREVIEW_PAGE);
    return 200;
  }

  /** The `GET /processes/<uuid>` leg: the store's current XML (REQ-002). */
  private async serveProcessXml(encodedUuid: string, response: ServerResponse): Promise<number> {
    const uuid = decodeSegment(encodedUuid);
    if (uuid === null) {
      this.sendJson(response, 400, {
        error: { code: 'bad-request', message: 'the process uuid is not valid percent-encoding' },
      });
      return 400;
    }
    const result = await this.store.readProcessXml(uuid);
    if (!result.ok) {
      return this.sendStoreError(result.error, response);
    }
    this.sendXml(response, result.xml);
    return 200;
  }

  /**
   * The `GET /bpmn-js/<file>` leg (REQ-003): serves one file from the
   * asset directory (the installed `bpmn-js` package's `dist` by
   * default). Invalid percent-encoding and dot segments are 400; a
   * path that resolves outside the asset directory, or a missing
   * file, is 404.
   */
  private async serveAsset(segments: string[], response: ServerResponse): Promise<number> {
    const decoded = segments.map(decodeSegment);
    if (decoded.some((segment) => segment === null)) {
      this.sendJson(response, 400, {
        error: { code: 'bad-request', message: 'the asset path is not valid percent-encoding' },
      });
      return 400;
    }
    if (decoded.some((segment) => segment === '.' || segment === '..')) {
      this.sendJson(response, 400, {
        error: { code: 'bad-request', message: 'the asset path must not contain dot segments' },
      });
      return 400;
    }
    const filePath = resolve(join(this.assetDir, ...(decoded as string[])));
    // The canonical guard: a decoded path that escapes the asset
    // directory (e.g. a `%2f`-joined sequence) never reads a file.
    if (!filePath.startsWith(this.assetDir + sep)) {
      this.sendJson(response, 404, { error: { code: 'not-found', message: 'the asset is not found' } });
      return 404;
    }
    let info: Stats;
    try {
      info = await stat(filePath);
    } catch {
      this.sendJson(response, 404, { error: { code: 'not-found', message: 'the asset is not found' } });
      return 404;
    }
    if (!info.isFile()) {
      this.sendJson(response, 404, { error: { code: 'not-found', message: 'the asset is not found' } });
      return 404;
    }
    const content = await readFile(filePath);
    response.writeHead(200, { 'content-type': contentTypeFor(filePath), 'content-length': content.byteLength });
    response.end(content);
    return 200;
  }

  /** Maps the store's structured error to an HTTP status (REQ-002): an unknown uuid is 404; a broken registered file is 500. */
  private sendStoreError(error: PrcError, response: ServerResponse): number {
    const status = error.code === 'process-not-registered' ? 404 : 500;
    this.sendJson(response, status, { error });
    return status;
  }

  private sendHtml(response: ServerResponse, html: string): void {
    response.writeHead(200, { 'content-type': 'text/html; charset=utf-8' });
    response.end(html);
  }

  private sendXml(response: ServerResponse, xml: string): void {
    response.writeHead(200, { 'content-type': 'application/xml; charset=utf-8' });
    response.end(xml);
  }

  private sendJson(response: ServerResponse, status: number, payload: unknown): void {
    response.writeHead(status, { 'content-type': 'application/json; charset=utf-8' });
    response.end(JSON.stringify(payload));
  }
}

/** Decodes one URL path segment; `null` on invalid percent-encoding. */
function decodeSegment(segment: string): string | null {
  try {
    return decodeURIComponent(segment);
  } catch {
    return null;
  }
}

/** The content type for a file by its extension (the pinned extensions; `application/octet-stream` otherwise). */
function contentTypeFor(filePath: string): string {
  const dot = filePath.lastIndexOf('.');
  if (dot < 0) {
    return OCTET_STREAM;
  }
  return CONTENT_TYPES[filePath.slice(dot)] ?? OCTET_STREAM;
}
