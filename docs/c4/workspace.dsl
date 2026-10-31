workspace "biz.dfch.BpmnMcp" "Agent-driven BPMN 2.0 modeling tool. Stage 1 (target): an AI agent drives BPMN diagrams through an MCP server; a human views them in a local browser. Stage 2 (deferred, annotated): a live two-way canvas. Per docs/dec, docs/req, docs/qa, and GitHub issue #1." {
    model {
        agent = person "AI Coding Agent" "An AI agent running in any MCP-compatible host (OpenCode, Claude Desktop, Cursor, ...). Creates and changes BPMN 2.0 diagrams by calling the MCP server's tools."

        human = person "Human User" "The developer. Opens the browser preview to view a diagram after an agent-driven change, and may edit the .bpmn process files directly, out of band."

        bpmnMcp = softwareSystem "biz.dfch.BpmnMcp" "FOSS (AGPL-3.0-only), local-only tool for creating, changing, importing, exporting, validating, and parsing BPMN 2.0 process diagrams. Stage 1: turn-based agent editing with a browser preview. Elements marked (Stage 2, deferred) are the anticipated live-canvas evolution per the decision record." {
            mcpServer = container "MCP Server" "The single Stage 1 process (apps/mcp-server, started as node dist/index.js). Exposes seven MCP tools (create, change, import, export, validate, parse, preview) and two MCP resources (version, config) over stdio. Contains the prc artifact core (bpmn-moddle parse/serialize, the docs/prc/ directory scan as process inventory, in-memory moddle-tree cache with SHA-256 conditional re-read), bpmnlint validation (.bpmnlintrc, bpmnlint:recommended), and the in-process localhost:8080 HTTP preview endpoint serving the bpmn-js Viewer page. In Stage 2 it also acts as the thin MCP client that drives the canvas server. Logs structured JSON lines to logs/ and stderr; never writes to stdout." "Node.js 24, TypeScript, @modelcontextprotocol/sdk, bpmn-moddle, bpmnlint, bpmn-js, pino"
            prcStore = container "BPMN Process Files" "The committed docs/prc/ directory: one .bpmn file per process, named prc-<uuid>-<slug>.bpmn. The file on disk is the single source of truth for each process; the directory listing is the process inventory (no registry file)." "Filesystem, BPMN 2.0 XML"
            logStore = container "Log Files" "Structured JSON log lines (pino + pino-roll), rolling: daily, seven files kept." "Filesystem"
            canvasServer = container "Canvas Server (Stage 2, deferred)" "A separate process (apps/canvas-server, the yctimlin/mcp_excalidraw precedent): hosts the web canvas UI and provides REST + WebSocket synchronization for the live, two-way-synced diagram. Not in Stage 1 scope." "Node.js, REST, WebSocket"
            webCanvas = container "Web Canvas (Stage 2, deferred)" "The browser page (apps/web) with the full bpmn-js Modeler (drag/drop, connect, delete; bpmn-js-properties-panel optional) for live human editing. Runs in the user's browser. Not in Stage 1 scope." "bpmn-js Modeler (browser)"
            bpmnCore = container "BPMN Core Library (Stage 2, deferred)" "The shared operations package (packages/bpmn-core) extracted from the MCP server's prc core so the MCP server and the canvas server reuse one implementation. Not in Stage 1 scope." "TypeScript library"
        }

        agent -> mcpServer "Creates, changes, imports, exports, validates, and parses BPMN processes and requests previews" "MCP (JSON-RPC) over stdio"
        mcpServer -> prcStore "Reads and writes BPMN 2.0 XML: bpmn-moddle parse/serialize, atomic export writes, SHA-256 conditional re-read on every operation"
        human -> mcpServer "Views a process diagram in the browser after agent-driven changes (turn-based preview)" "HTTP, localhost:8080, bpmn-js Viewer"
        human -> prcStore "May edit .bpmn files directly; out-of-band changes are detected by the checksum re-read"
        mcpServer -> logStore "Writes structured JSON log lines (file + stderr dual output)"
        mcpServer -> canvasServer "Drives the live canvas (Stage 2, deferred)" "REST + WebSocket"
        webCanvas -> canvasServer "Loads and live-edits the diagram in the bpmn-js Modeler (Stage 2, deferred)" "HTTP + WebSocket (browser)"
        human -> webCanvas "Live-edits the diagram in the browser (Stage 2, deferred)"
        canvasServer -> prcStore "Reads and writes .bpmn files; the file on disk remains the source of truth (Stage 2, deferred)"
        mcpServer -> bpmnCore "Reuses the shared BPMN operations after extraction (Stage 2, deferred)"
        canvasServer -> bpmnCore "Reuses the shared BPMN operations (Stage 2, deferred)"
    }

    views {
        container bpmnMcp "c4-container" "Container diagram of biz.dfch.BpmnMcp. Stage 1 target: an AI coding agent and a human user interact with the MCP server process; the .bpmn process files under docs/prc/ are the source of truth. Elements marked (Stage 2, deferred) show the anticipated live-canvas evolution." {
            include *
            autoLayout
        }
    }
}
