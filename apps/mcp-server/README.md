# biz.dfch.bpmnmcp

A Model Context Protocol (MCP) server for agent-and-human BPMN 2.0
process modeling: create, change, import, export, validate, and parse
BPMN diagrams, with a turn-based local browser preview. Free and Open
Source Software (AGPL-3.0-only), runs entirely locally / on-premises
over stdio.

## Requirements

- Node.js >= 26. Node 26 ("Lithium") is the sole supported runtime,
  per decision record
  [`5185d651-7283-4b1d-87e0-272795d15edf`](https://github.com/dfch/biz.dfch.BpmnMcp/blob/dev/docs/dec/dec-5185d651-7283-4b1d-87e0-272795d15edf-adopt-node-js-26-as-the-sole-supported-runtime.md)
  ("Adopt Node.js 26 as the Sole Supported Runtime"); the manifest's
  `engines` floor is `>=26` (older Node versions get an `EBADENGINE`
  warning, not a hard failure).

## Usage

The server is a stdio MCP server: an MCP client (an agent host or a
human via a compatible client) launches it as a child process, and it
speaks JSON-RPC over stdin/stdout. Nothing is written to stdout except
protocol frames; logs go to a rolling file and stderr.

### With `npx` (the published package)

```sh
npx -y biz.dfch.bpmnmcp
```

### With `node` (a local checkout or an installed copy)

```sh
# Local checkout (after `npm ci` and `npm run build`):
node apps/mcp-server/dist/index.js

# An installed copy (the package's bin target):
node node_modules/biz.dfch.bpmnmcp/dist/index.js
```

Both invocations run the same entry point; the installed copy's
`dist/index.js` carries the shebang and the exec bit added by the
package's `prepack` pipeline, so the `bin` also works as a direct
executable (the `npx` counterpart).

## MCP client configuration

Example client configuration (the `mcpServers` shape used by common
MCP clients; adjust the key name to taste):

```json
{
  "mcpServers": {
    "bpmn": {
      "command": "npx",
      "args": ["-y", "biz.dfch.bpmnmcp"],
      "env": {
        "BPMN_MCP_DOCS_DIR": "./docs"
      }
    }
  }
}
```

To point the client at an installed copy instead of `npx`, use
`"command": "node"` with
`"args": ["node_modules/biz.dfch.bpmnmcp/dist/index.js"]` (or the
absolute path of the bin target).

## Environment variables

The server reads exactly five `BPMN_MCP_*` variables. Precedence: the
real environment (including a `.env` file in the working directory,
which is loaded without overwriting real variables) > the package's
`logging.json` (shipped in the tarball) > the built-in defaults.

| Variable              | Default       | Purpose                                                                                                         |
| --------------------- | ------------- | --------------------------------------------------------------------------------------------------------------- |
| `BPMN_MCP_DOCS_DIR`   | `./docs`      | Documents root, resolved against the working directory; registered processes live under its `prc` subdirectory. |
| `BPMN_MCP_LOG_FILE`   | `logs/server` | Rolling log file base path (no extension), relative to the working directory.                                   |
| `BPMN_MCP_LOG_LEVEL`  | `info`        | Minimum pino log level (`fatal`, `error`, `warn`, `info`, `debug`, `trace`).                                    |
| `BPMN_MCP_LOG_ROTATE` | `daily`       | Log rotation: `daily`, `hourly`, or a numeric string read as a number of milliseconds.                          |
| `BPMN_MCP_LOG_RETAIN` | `7`           | How many log files to keep in total, the active file included.                                                  |

## The Stage 1 tool surface

The handshake lists the seven Stage 1 tools:

- `create` — create a new process as a session draft (in memory until
  exported), with optional initial elements and grid placement.
- `change` — apply exactly one change to a process (add/update/connect/
  delete an element, or create a sequence flow).
- `import` — import a BPMN 2.0 XML file from any path as a registered
  process (byte-identical copy into the `prc` directory, fresh v4 UUID).
- `export` — export a registered process as formatted BPMN 2.0 XML (to
  its own `prc` file or an explicit path).
- `parse` — return a process as a structured, addressable model
  (elements and flows) instead of raw XML.
- `validate` — check a process against the committed bpmnlint rule set
  (`bpmnlint:recommended`) and report every finding.
- `preview` — serve a turn-based, read-only browser view of a process
  at `http://127.0.0.1:8080/view/<uuid>` (the port is fixed for Stage
  1; call `preview` again after changes, nothing refreshes
  automatically).

## Preview and the bpmn.io attribution watermark

The `preview` tool renders the diagram in a browser with the bpmn.io
[`bpmn-js`](https://github.com/bpmn-io/bpmn-js) viewer, which this
package ships as a dependency (it is not bundled or vendored).
`bpmn-js` is provided under the "bpmn.io License": MIT plus a clause
requiring its small attribution watermark to remain visible and
unmodified on any rendered canvas. The watermark is part of the
license grant — do not strip, hide, or cover it in the preview page or
any derivative rendering.

## License

`biz.dfch.bpmnmcp` is licensed under the AGPL-3.0-only. The full
license text ships with the package as `LICENSE`.

## Repository

<https://github.com/dfch/biz.dfch.BpmnMcp>
