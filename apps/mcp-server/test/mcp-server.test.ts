// SPDX-FileCopyrightText: 2026 Ronald Rink, d-fens GmbH
// SPDX-License-Identifier: AGPL-3.0-only

import { InMemoryTransport } from '@modelcontextprotocol/sdk/inMemory.js';
import { Client } from '@modelcontextprotocol/sdk/client/index.js';
import { afterEach, beforeEach, describe, expect, it } from 'vitest';
import type { LoggingConfig } from '../src/config.js';
import { readPackageMetadata } from '../src/package-metadata.js';
import { createServer } from '../src/server.js';

/**
 * MCP-level test (REQ-011, ACC-010): drives the real `createServer()`
 * factory through the SDK `Client` over an in-memory transport pair --
 * no process spawn, exactly as the Task 100.165 interop spike
 * validated.
 */
describe('MCP server resources (REQ-011, ACC-010)', () => {
  let client: Client;

  const loggingConfig: LoggingConfig = {
    logFile: 'logs/server',
    logLevel: 'info',
    logRotate: 'daily',
    logRetain: 7,
  };

  beforeEach(async () => {
    const server = createServer(loggingConfig);
    const [clientTransport, serverTransport] = InMemoryTransport.createLinkedPair();

    client = new Client({ name: 'test-client', version: '0.0.0' });

    await Promise.all([server.connect(serverTransport), client.connect(clientTransport)]);
  });

  afterEach(async () => {
    await client.close();
  });

  it('lists both the version and config resources', async () => {
    const { resources } = await client.listResources();
    const names = resources.map((resource) => resource.name);
    expect(names).toContain('version');
    expect(names).toContain('config');
  });

  it('reads the version resource with the correct server name and version', async () => {
    const expected = readPackageMetadata();
    const { contents } = await client.readResource({ uri: 'bpmnmcp://version' });
    const [content] = contents;
    if (!('text' in content)) {
      throw new Error('expected a text resource content');
    }
    const parsed = JSON.parse(content.text) as { name: string; version: string };
    expect(parsed).toEqual(expected);
  });

  it('reads the config resource with the expected shape', async () => {
    const { contents } = await client.readResource({ uri: 'bpmnmcp://config' });
    const [content] = contents;
    if (!('text' in content)) {
      throw new Error('expected a text resource content');
    }
    const parsed = JSON.parse(content.text);

    expect(parsed).toEqual({
      logging: {
        destination: 'logs/server',
        level: 'info',
        rotation: 'daily',
      },
      otel: {
        endpoint: 'disabled',
      },
      paths: {
        docsPrcDir: expect.stringContaining('prc'),
      },
      bpmnlint: {
        preset: 'not yet configured',
      },
    });
  });
});
