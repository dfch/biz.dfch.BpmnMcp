#!/usr/bin/env bash
# SPDX-FileCopyrightText: 2026 Ronald Rink, d-fens GmbH
# SPDX-License-Identifier: AGPL-3.0-only
#
# Task 120.110: proves the feat-29 prototype bridge (web/bridge.js,
# REQ-003) is in place and served:
#   - GET /bridge.js returns 200 and the served bytes contain the
#     selfTest marker (the in-page proof member of the REQ-003 API),
#   - GET / returns 200 and the served page references /bridge.js
#     (the src="/bridge.js" script tag),
#   - node --check web/bridge.js passes (syntax validity without a
#     browser),
#   - and the server wrote nothing to stdout (REQ-001).
#
# The browser execution of selfTest happens in Task 130.120 - no browser
# exists yet at this phase.
#
# Lifecycle per bin/100-110-00-verify-page.sh: the fixed port must be
# free beforehand (ss pre-check), the server starts in the background
# from the repo root, readiness is polled 10 x 0.5 s, the PID is
# killed+waited via an EXIT trap, and the raw run output is teed to
# bin/logs/120-110-verify-bridge-marker.log. Exits non-zero on any
# failed assertion.

set -euo pipefail

SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
FEAT_DIR="$(cd "$SCRIPT_DIR/.." && pwd)"
REPO_ROOT="$(cd "$FEAT_DIR/../../.." && pwd)"

HOST='127.0.0.1'
PORT=8123
BASE_URL="http://${HOST}:${PORT}"

LOG_DIR="$FEAT_DIR/bin/logs"
LOG_FILE="$LOG_DIR/120-110-verify-bridge-marker.log"
SERVER_STDOUT_LOG="$LOG_DIR/120-110-verify-bridge-marker-server-stdout.log"
SERVER_STDERR_LOG="$LOG_DIR/120-110-verify-bridge-marker-server-stderr.log"

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

echo "=== Task 120.110: verify-bridge-marker ==="
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

# --- GET /bridge.js : status and the selfTest marker -------------------
echo "--- GET /bridge.js ---"
bridge_status="$(curl -s -o "$TMP_DIR/bridge.js" -w '%{http_code}' "${BASE_URL}/bridge.js")"
[ "$bridge_status" = '200' ] || fail "GET /bridge.js returned HTTP ${bridge_status} (expected 200)"
pass "GET /bridge.js returned 200"

grep -q 'selfTest' "$TMP_DIR/bridge.js" || fail "the served bridge bytes are missing the selfTest marker"
pass "the served bridge bytes contain the selfTest marker"

# --- GET / : status and the /bridge.js reference -----------------------
echo "--- GET / ---"
page_status="$(curl -s -o "$TMP_DIR/page.html" -w '%{http_code}' "${BASE_URL}/")"
[ "$page_status" = '200' ] || fail "GET / returned HTTP ${page_status} (expected 200)"
pass "GET / returned 200"

grep -q 'src="/bridge.js"' "$TMP_DIR/page.html" || fail "the served page does not reference /bridge.js"
pass "the served page references /bridge.js (the src=\"/bridge.js\" script tag)"

# --- the bridge's syntax validity without a browser --------------------
echo "--- node --check web/bridge.js ---"
node --check "$FEAT_DIR/web/bridge.js" || fail "node --check rejected web/bridge.js (syntax error)"
pass "node --check web/bridge.js passed"

# --- the server's stdout discipline (REQ-001) ---------------------------
echo "--- server stdout discipline ---"
[ ! -s "$SERVER_STDOUT_LOG" ] || fail "the server wrote to stdout (REQ-001): ${SERVER_STDOUT_LOG}"
pass "the server wrote nothing to stdout"

echo
echo "ALL CHECKS PASSED (Task 120.110)"
