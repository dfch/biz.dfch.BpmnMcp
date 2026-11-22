#!/usr/bin/env bash
# SPDX-FileCopyrightText: 2026 Ronald Rink, d-fens GmbH
# SPDX-License-Identifier: AGPL-3.0-only
#
# Task 130.120: starts the feat-29 prototype server (web/server.mjs,
# 127.0.0.1:8123) detached from this shell and leaves it running for
# the later evaluation phases (the plan's Execution note: every
# evaluation phase begins by confirming the server is running, "start
# via bin/130-120-00-start-server.sh if not").
#
# Idempotent: if 127.0.0.1:8123 already answers GET / (curl), print
# that the server is already running and exit 0 - no second instance.
#
# Otherwise: start the server detached (setsid + nohup + &, so it
# survives after this shell session ends), with the repo root as the
# working directory, stdout+stderr to bin/logs/server.out, and the
# server's PID to bin/logs/server.pid. Readiness is polled 10 x 0.5 s
# (GET /); the script exits non-zero if the server does not come up.
#
# This is an operator script: its own stdout is for the operator (the
# no-stdout rule of REQ-001 applies to the server process itself).

set -euo pipefail

SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
FEAT_DIR="$(cd "$SCRIPT_DIR/.." && pwd)"
REPO_ROOT="$(cd "$FEAT_DIR/../../.." && pwd)"

HOST='127.0.0.1'
PORT=8123
BASE_URL="http://${HOST}:${PORT}"

LOG_DIR="$FEAT_DIR/bin/logs"
SERVER_LOG="$LOG_DIR/server.out"
PID_FILE="$LOG_DIR/server.pid"

# The pgrep match for the server's command line: the absolute form
# started by this script (`node <feat-dir>/web/server.mjs`) and the
# bare relative form an operator may start from the feat dir
# (`node web/server.mjs`) both end in `web/server.mjs`.
SERVER_PATTERN='node (.*\/)?web/server\.mjs'

mkdir -p "$LOG_DIR"

# --- idempotency: an already-answering server is not a failure -------
if curl -sf -o /dev/null "${BASE_URL}/"; then
  echo "the server is already running at ${BASE_URL} (port ${PORT} answers GET /); nothing to do"
  if [ -f "$PID_FILE" ] && kill -0 "$(cat "$PID_FILE")" 2>/dev/null; then
    echo "pidfile: ${PID_FILE} -> $(cat "$PID_FILE") (alive)"
  else
    # A manual start (or a setsid fork) may have left no usable
    # pidfile: refresh it from the live process so the stop step
    # (kill "$(cat bin/logs/server.pid)") keeps working.
    pid="$(pgrep -f "$SERVER_PATTERN" | head -n 1 || true)"
    if [ -n "${pid:-}" ]; then
      echo "$pid" > "$PID_FILE"
      echo "the pidfile was missing or stale; refreshed it to ${pid}"
    else
      echo "the pidfile is missing or stale and no matching server process was found"
    fi
  fi
  exit 0
fi

# --- start the server detached from this shell ------------------------
echo "starting the server (node ${FEAT_DIR}/web/server.mjs, cwd=${REPO_ROOT})"
cd "$REPO_ROOT"
setsid nohup node "${FEAT_DIR}/web/server.mjs" >"${SERVER_LOG}" 2>&1 </dev/null &
LAUNCH_PID=$!

# --- wait for readiness (10 x 0.5 s) -----------------------------------
ready=0
for _ in $(seq 1 10); do
  if curl -sf -o /dev/null "${BASE_URL}/"; then
    ready=1
    break
  fi
  sleep 0.5
done
if [ "$ready" -ne 1 ]; then
  echo "FAIL: the server did not become ready within 5 s (log: ${SERVER_LOG})"
  cat "$SERVER_LOG" 2>/dev/null || true
  kill "$LAUNCH_PID" 2>/dev/null || true
  exit 1
fi

# --- record the server's PID -------------------------------------------
# setsid forks when it is a process group leader, in which case the
# launch PID is not the node process: resolve the real server PID by
# command line and fall back to the launch PID.
SERVER_PID="$(pgrep -f "$SERVER_PATTERN" | head -n 1 || true)"
if [ -z "${SERVER_PID:-}" ]; then
  SERVER_PID="$LAUNCH_PID"
fi
echo "$SERVER_PID" > "$PID_FILE"
echo "the server is ready at ${BASE_URL} (pid ${SERVER_PID}, pidfile ${PID_FILE}, log ${SERVER_LOG})"
