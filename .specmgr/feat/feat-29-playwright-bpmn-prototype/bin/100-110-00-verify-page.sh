#!/usr/bin/env bash
# SPDX-FileCopyrightText: 2026 Ronald Rink, d-fens GmbH
# SPDX-License-Identifier: AGPL-3.0-only
#
# Task 100.110 (ACC-001): proves the feat-29 prototype page server
# (web/server.mjs, 127.0.0.1:8123) serves
#   - GET / with the Modeler markers (the #canvas container, the
#     Modeler bundle <script> tag, the BpmnJS reference (the bundle's
#     UMD global), the /bridge.js script tag),
#   - the three pinned bpmn-js dist assets with 200 and sha256-
#     identical bytes against the installed node_modules/bpmn-js/dist,
#   - the served Modeler bundle holding the unmodified watermark
#     markers (bjs-powered-by, "Powered by bpmn.io" - the feat-20 pin),
#   - and no stdout output from the server (REQ-001).
#
# Starts the server in the background from the repo root (the fixed
# port must be free beforehand), kills it on exit (trap), and tees the
# raw run output to bin/logs/100-110-verify-page.log. Exits non-zero
# on any failed assertion.

set -euo pipefail

SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
FEAT_DIR="$(cd "$SCRIPT_DIR/.." && pwd)"
REPO_ROOT="$(cd "$FEAT_DIR/../../.." && pwd)"

HOST='127.0.0.1'
PORT=8123
BASE_URL="http://${HOST}:${PORT}"

LOG_DIR="$FEAT_DIR/bin/logs"
LOG_FILE="$LOG_DIR/100-110-verify-page.log"
SERVER_STDOUT_LOG="$LOG_DIR/100-110-verify-page-server-stdout.log"
SERVER_STDERR_LOG="$LOG_DIR/100-110-verify-page-server-stderr.log"

mkdir -p "$LOG_DIR"

# Tee the raw run output (stdout and stderr) to the log file.
exec > >(tee "$LOG_FILE") 2> >(tee -a "$LOG_FILE" >&2)

pass() {
  echo "PASS: $1"
}

fail() {
  echo "FAIL: $1"
  exit 1
}

echo "=== Task 100.110: verify-page (ACC-001) ==="
echo "date: $(date -u +%Y-%m-%dT%H:%M:%SZ)"
echo "repo root: $REPO_ROOT"

# --- the fixed port must be free before the server starts -------------
if ss -ltnH | awk '{print $4}' | grep -Eq "[:.]${PORT}$"; then
  fail "port ${PORT} on ${HOST} is already in use"
fi
pass "port ${PORT} is free"

TMP_DIR="$(mktemp -d)"
SERVER_PID=''
cleanup() {
  if [ -n "$SERVER_PID" ]; then
    kill "$SERVER_PID" 2>/dev/null || true
    wait "$SERVER_PID" 2>/dev/null || true
  fi
  rm -rf "$TMP_DIR"
}
trap cleanup EXIT

# --- start the server in the background from the repo root ------------
echo "--- starting the server (node web/server.mjs, cwd=${REPO_ROOT}) ---"
cd "$REPO_ROOT"
node "$FEAT_DIR/web/server.mjs" >"$SERVER_STDOUT_LOG" 2>"$SERVER_STDERR_LOG" &
SERVER_PID=$!

# --- wait for readiness (10 x 0.5 s) -----------------------------------
echo "--- waiting for the server to become ready (10 x 0.5 s) ---"
ready=0
for _ in $(seq 1 10); do
  if curl -sf -o /dev/null "${BASE_URL}/"; then
    ready=1
    break
  fi
  sleep 0.5
done
[ "$ready" -eq 1 ] || fail "the server did not become ready within 5 s (server stderr: ${SERVER_STDERR_LOG})"
pass "the server is ready at ${BASE_URL}"

# --- GET / : status and the Modeler markers ----------------------------
echo "--- GET / ---"
page_status="$(curl -s -o "$TMP_DIR/page.html" -w '%{http_code}' "${BASE_URL}/")"
[ "$page_status" = '200' ] || fail "GET / returned HTTP ${page_status} (expected 200)"
pass "GET / returned 200"

grep -q 'id="canvas"' "$TMP_DIR/page.html" || fail "the page is missing the #canvas container"
pass "the page holds the #canvas container"

grep -q 'bpmn-modeler.production.min.js' "$TMP_DIR/page.html" || fail "the page is missing the Modeler bundle <script> tag"
pass "the page references /bpmn-js/bpmn-modeler.production.min.js"

grep -q 'BpmnJS' "$TMP_DIR/page.html" || fail "the page is missing the BpmnJS reference"
pass "the page references BpmnJS"

grep -q 'src="/bridge.js"' "$TMP_DIR/page.html" || fail "the page is missing the /bridge.js script tag"
pass "the page loads /bridge.js"

# --- the three pinned dist assets: 200 + sha256 identity ---------------
ASSETS=(
  'bpmn-modeler.production.min.js'
  'assets/diagram-js.css'
  'assets/bpmn-js.css'
)
for asset in "${ASSETS[@]}"; do
  echo "--- GET /bpmn-js/${asset} ---"
  out="${TMP_DIR}/$(echo "$asset" | tr '/' '_')"
  asset_status="$(curl -s -o "$out" -w '%{http_code}' "${BASE_URL}/bpmn-js/${asset}")"
  [ "$asset_status" = '200' ] || fail "GET /bpmn-js/${asset} returned HTTP ${asset_status} (expected 200)"
  installed="${REPO_ROOT}/node_modules/bpmn-js/dist/${asset}"
  [ -f "$installed" ] || fail "the installed asset is missing: ${installed}"
  served_sha="$(sha256sum "$out" | awk '{print $1}')"
  installed_sha="$(sha256sum "$installed" | awk '{print $1}')"
  echo "served:    ${served_sha}"
  echo "installed: ${installed_sha}"
  [ "$served_sha" = "$installed_sha" ] || fail "the served bytes of /bpmn-js/${asset} are not sha256-identical to the installed dist file"
  pass "GET /bpmn-js/${asset} returned 200 with sha256-identical bytes (${served_sha})"
done

# --- the watermark markers in the served Modeler bundle ----------------
echo "--- watermark in the served Modeler bundle ---"
bundle="$TMP_DIR/bpmn-modeler.production.min.js"
grep -q 'bjs-powered-by' "$bundle" || fail "the served Modeler bundle is missing the bjs-powered-by watermark marker"
pass "the served Modeler bundle holds the bjs-powered-by marker"
grep -q 'Powered by bpmn.io' "$bundle" || fail "the served Modeler bundle is missing the 'Powered by bpmn.io' watermark marker"
pass "the served Modeler bundle holds the 'Powered by bpmn.io' marker"

# --- the server's stdout discipline (REQ-001) ---------------------------
echo "--- server stdout discipline ---"
[ ! -s "$SERVER_STDOUT_LOG" ] || fail "the server wrote to stdout (REQ-001): ${SERVER_STDOUT_LOG}"
pass "the server wrote nothing to stdout"

echo
echo "ALL CHECKS PASSED (ACC-001)"
