#!/usr/bin/env bash
# SPDX-FileCopyrightText: 2026 Ronald Rink, d-fens GmbH
# SPDX-License-Identifier: AGPL-3.0-only
#
# Task 180.120: the R5 save-fidelity diff (Phase 180, feat-29).
#
# Compares the two Task B save outputs (r5-pixel.bpmn - Strategy A,
# r5-bridge.bpmn - Strategy B) and the re-save-stability artifact
# (r5-resave.bpmn) against the EXPECTED serialization: the fixture with
# the identical single rename (review-task name -> "Review order R5"),
# produced by the root node_modules' bpmn-moddle with EXACTLY the MCP
# server's save options (moddle.toXML(root, { format: true }), per
# apps/mcp-server/src/prc/moddle.ts serializeBpmn - read-only
# reference).
#
# Byte policy (stated once here and in the raw record): every file is
# compared EXACTLY as written to disk by its writer. No newline
# normalization anywhere in this script or the producer. The only known
# constant in play is the +1 trailing newline the pre-commit EOF hook
# adds to files/ artifacts AT COMMIT TIME - it does not affect this
# script's inputs, since the script runs on the uncommitted on-disk
# bytes.
#
# Two documented parts:
#   Part 1 - the expected producer: runs the sibling script
#     bin/180-120-01-generate-expected.mjs (both scripts are part of
#     Task 180.120, NN numbering) and asserts its output exists.
#   Part 2 - the diffs: for each of the six pairs below, sha256sum of
#     both files plus a unified diff. The script ALWAYS produces every
#     section: a non-empty diff is DATA (the R5 answer), not a failure.
#     A failure is a producer error, a missing input file, or a diff
#     that errors (exit > 1).
#
# Pairs (1-6, in order):
#   1. r5-pixel.bpmn  vs expected-renamed.bpmn
#   2. r5-bridge.bpmn vs expected-renamed.bpmn
#   3. r5-pixel.bpmn  vs r5-bridge.bpmn   (strategy consistency)
#   4. r5-pixel.bpmn  vs order-process.bpmn (the "rename only?" leg,
#      against the ORIGINAL: the full delta the pixel run introduced)
#   5. r5-bridge.bpmn vs order-process.bpmn
#   6. r5-resave.bpmn vs r5-bridge.bpmn   (re-save stability)
#
# Raw output is teed to bin/logs/180-120-xml-diff.log.

set -euo pipefail

SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
FEAT_DIR="$(cd "$SCRIPT_DIR/.." && pwd)"
REPO_ROOT="$(cd "$FEAT_DIR/../../.." && pwd)"

FILES_DIR="$FEAT_DIR/files"
LOG_DIR="$FEAT_DIR/bin/logs"
LOG_FILE="$LOG_DIR/180-120-xml-diff.log"

EXPECTED="$LOG_DIR/expected-renamed.bpmn"
PIXEL="$FILES_DIR/r5-pixel.bpmn"
BRIDGE="$FILES_DIR/r5-bridge.bpmn"
RESAVE="$FILES_DIR/r5-resave.bpmn"
ORIGINAL="$FILES_DIR/order-process.bpmn"

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

echo "=== Task 180.120: R5 save-fidelity xml-diff ==="
echo "date: $(date -u +%Y-%m-%dT%H:%M:%SZ)"
echo "repo root: $REPO_ROOT"
echo "byte policy: as-written bytes; no newline normalization; the only known constant is the +1 trailing newline the pre-commit EOF hook adds to files/ artifacts AT COMMIT TIME (not in effect here - uncommitted on-disk bytes)."

# --- pre-check: every input must exist before any section --------------
for f in "$PIXEL" "$BRIDGE" "$RESAVE" "$ORIGINAL"; do
  [ -f "$f" ] || fail "missing input file: $f (run the Phase 180 Task B runs first)"
done
pass "all four Phase 180 artifacts present under files/"

# --- Part 1: the expected producer (the documented producer step) ------
echo
echo "--- Part 1: expected producer (bin/180-120-01-generate-expected.mjs) ---"
node "$SCRIPT_DIR/180-120-01-generate-expected.mjs" || fail "the expected producer failed"
[ -s "$EXPECTED" ] || fail "the producer wrote no output: $EXPECTED"
pass "expected serialization produced: $EXPECTED"

# --- Part 2: the six diffs ----------------------------------------------
# diff_pair LABEL A B: prints sha256sum of both files and a unified diff.
# A non-empty diff is data (the R5 answer), not a failure; only a diff
# error (exit > 1) fails the run.
IDENTICAL_PAIRS=''

diff_pair() {
  local label="$1" a="$2" b="$3" rc identical
  echo
  echo "--- Pair ${label}: ${a##*/} vs ${b##*/} ---"
  sha256sum "$a" "$b"
  if diff -u "$a" "$b"; then
    rc=0
  else
    rc=$?
  fi
  if [ "$rc" -gt 1 ]; then
    fail "pair ${label}: diff errored (exit ${rc})"
  fi
  if [ "$rc" -eq 0 ]; then
    echo "pair ${label}: IDENTICAL (byte-for-byte)"
    IDENTICAL_PAIRS="${IDENTICAL_PAIRS}${label} "
  else
    echo "pair ${label}: DIFFERENT (the diff above is data, not a failure)"
  fi
}

echo
echo "--- Part 2: the six diffs (a non-empty diff is DATA, not a failure) ---"
diff_pair 1 "$PIXEL" "$EXPECTED"
diff_pair 2 "$BRIDGE" "$EXPECTED"
diff_pair 3 "$PIXEL" "$BRIDGE"
diff_pair 4 "$PIXEL" "$ORIGINAL"
diff_pair 5 "$BRIDGE" "$ORIGINAL"
diff_pair 6 "$RESAVE" "$BRIDGE"

# --- summary -------------------------------------------------------------
echo
echo "=== summary ==="
echo "identical pairs: ${IDENTICAL_PAIRS:-none}"
echo "log: $LOG_FILE"
echo "ALL SECTIONS PRODUCED (Task 180.120)"
