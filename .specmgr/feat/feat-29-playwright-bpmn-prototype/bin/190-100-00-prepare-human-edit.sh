#!/usr/bin/env bash
# SPDX-FileCopyrightText: 2026 Ronald Rink, d-fens GmbH
# SPDX-License-Identifier: AGPL-3.0-only
#
# Task 190.100: the R6 human-in-the-loop preparation (Phase 190,
# feat-29). Stages the stable canvas name for the user's manual edit
# and records everything the user leg needs:
#
#   1. files/human-edit-start.bpmn is staged as a byte-identical copy
#      of the Phase 170 final run (files/r4-run-3.bpmn - the Task A
#      model the agent drew). Idempotent: if the destination already
#      exists it is re-copied from the source, so the user may re-run
#      this preparation if their first attempt goes wrong. The source
#      is never modified - verified with sha256 before and after.
#   2. The server is ensured running (bin/130-120-00-start-server.sh,
#      idempotent) and GET / -> 200 is confirmed.
#   3. The seed is confirmed servable: GET /files lists
#      human-edit-start.bpmn and GET /file?name=human-edit-start.bpmn
#      returns 200 with sha256-identical bytes.
#   4. The user's URL and the exact connect steps are recorded in
#      bin/logs/190-100-prepare-human-edit.md and printed to this
#      script's output.
#   5. The sha256 of files/human-edit-start.bpmn and a short
#      structural summary (bin/190-100-01-summarize-canvas.mjs, the
#      root node_modules' bpmn-moddle) are recorded in the same file -
#      the pickup session (Task 190.120) diffs the human's edit
#      against this baseline.
#
# The server is left RUNNING (the user leg, Task 190.110, needs it).
#
# This is an operator script: its own stdout is for the operator (the
# no-stdout rule of REQ-001 applies to the server process itself). The
# raw run output is teed to bin/logs/190-100-prepare-human-edit.log.
# Exits non-zero on any failed check.

set -euo pipefail

SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
FEAT_DIR="$(cd "$SCRIPT_DIR/.." && pwd)"
REPO_ROOT="$(cd "$FEAT_DIR/../../.." && pwd)"

HOST='127.0.0.1'
PORT=8123
BASE_URL="http://${HOST}:${PORT}"

FILES_DIR="$FEAT_DIR/files"
LOG_DIR="$FEAT_DIR/bin/logs"
LOG_FILE="$LOG_DIR/190-100-prepare-human-edit.log"
RECORD_FILE="$LOG_DIR/190-100-prepare-human-edit.md"

SOURCE="$FILES_DIR/r4-run-3.bpmn"
DEST="$FILES_DIR/human-edit-start.bpmn"
DEST_NAME="human-edit-start.bpmn"

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

TMP_DIR="$(mktemp -d)"
trap 'rm -rf "$TMP_DIR"' EXIT

echo "=== Task 190.100: prepare the human edit (R6) ==="
echo "date: $(date -u +%Y-%m-%dT%H:%M:%SZ)"
echo "repo root: $REPO_ROOT"

# --- step 1: stage the stable canvas name (idempotent re-copy) ----------
[ -f "$SOURCE" ] || fail "missing source: $SOURCE (the Phase 170 final run)"

SRC_SHA_BEFORE="$(sha256sum "$SOURCE" | awk '{print $1}')"
if [ -f "$DEST" ]; then
  echo "the destination ${DEST} already exists; re-copying from the source (idempotent)"
fi
cp -f "$SOURCE" "$DEST"

SRC_SHA_AFTER="$(sha256sum "$SOURCE" | awk '{print $1}')"
DEST_SHA="$(sha256sum "$DEST" | awk '{print $1}')"
DEST_SIZE="$(wc -c < "$DEST" | tr -d '[:space:]')"

[ "$SRC_SHA_BEFORE" = "$SRC_SHA_AFTER" ] ||
  fail "the source was modified by the copy (sha256 ${SRC_SHA_BEFORE} -> ${SRC_SHA_AFTER})"
pass "the source was never modified (sha256 ${SRC_SHA_BEFORE} before and after the copy)"

[ "$SRC_SHA_BEFORE" = "$DEST_SHA" ] ||
  fail "the staged copy is not byte-identical to the source (sha256 ${DEST_SHA} != ${SRC_SHA_BEFORE})"
pass "files/${DEST_NAME} staged as a byte-identical copy of r4-run-3.bpmn (${DEST_SIZE} B, sha256 ${DEST_SHA})"

# --- step 2: ensure the server is running --------------------------------
bash "$SCRIPT_DIR/130-120-00-start-server.sh"

ROOT_STATUS="$(curl -s -o /dev/null -w '%{http_code}' "${BASE_URL}/")"
[ "$ROOT_STATUS" = '200' ] || fail "GET ${BASE_URL}/ returned HTTP ${ROOT_STATUS} (expected 200)"
pass "GET ${BASE_URL}/ returned 200 (the server is running; left running for the user leg)"

# --- step 3: confirm the seed is servable ---------------------------------
LISTING="$(curl -s "${BASE_URL}/files")"
echo "GET /files -> ${LISTING}"
grep -q "\"${DEST_NAME}\"" <<<"$LISTING" || fail "GET /files does not list ${DEST_NAME}"
pass "GET /files lists ${DEST_NAME}"

SERVED_STATUS="$(
  curl -s -o "$TMP_DIR/served.bpmn" -w '%{http_code}' "${BASE_URL}/file?name=${DEST_NAME}"
)"
[ "$SERVED_STATUS" = '200' ] || fail "GET /file?name=${DEST_NAME} returned HTTP ${SERVED_STATUS} (expected 200)"
SERVED_SHA="$(sha256sum "$TMP_DIR/served.bpmn" | awk '{print $1}')"
[ "$SERVED_SHA" = "$DEST_SHA" ] ||
  fail "the served bytes are not sha256-identical to the staged file (sha256 ${SERVED_SHA} != ${DEST_SHA})"
pass "GET /file?name=${DEST_NAME} returned 200 with sha256-identical bytes (${SERVED_SHA})"

# --- step 4 + 5: the structural summary, then the record ------------------
SUMMARY="$(node "$SCRIPT_DIR/190-100-01-summarize-canvas.mjs")" ||
  fail "the structural summary failed (see the summarize-canvas output above)"

{
  cat <<EOF
# Task 190.100 - the human-edit preparation record

Date: $(date -u +%Y-%m-%dT%H:%M:%SZ)

The agent-drawn canvas is staged under the stable name **${DEST_NAME}**
(a byte-identical copy of files/r4-run-3.bpmn, the Phase 170 final run
- the Task A model the agent drew; the source is never modified). The
server at ${BASE_URL} is running. If the first attempt goes wrong,
re-run bin/190-100-00-prepare-human-edit.sh (it re-copies the seed
from the source, idempotent) and repeat the steps below.

## Connect steps (local display)

1. Open ${BASE_URL}/ in a browser on the local display.
2. In the "Diagram name" field, enter ${DEST_NAME}.
3. Click **Load**.
4. Inspect the agent-drawn canvas (the Task A model: start → task → gateway → two tasks → end, six sequence flows).
5. Make a manual edit (suggested: rename a task via double-click and/or move an element by dragging).
6. Change the name field to **human-edited.bpmn** and click **Save**.

Expected status text: "loaded human-edit-start.bpmn" after step 3 and
"saved human-edited.bpmn" after step 6.

## Seed baseline (the pickup session diffs the human's edit against this)

- sha256 of files/${DEST_NAME}: ${DEST_SHA} (${DEST_SIZE} B)
- sha256 of the source files/r4-run-3.bpmn (verified unmodified): ${SRC_SHA_BEFORE}

${SUMMARY}
EOF
} > "$RECORD_FILE"

echo
echo "--- record written to ${RECORD_FILE} (repeated below) ---"
cat "$RECORD_FILE"

echo
echo "ALL CHECKS PASSED (Task 190.100); the server is left RUNNING for the user leg (Task 190.110)"
