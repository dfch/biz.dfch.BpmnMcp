#!/usr/bin/env bash
# SPDX-FileCopyrightText: 2026 Ronald Rink, d-fens GmbH
# SPDX-License-Identifier: AGPL-3.0-only
#
# Task 110.110 (ACC-002): proves the feat-29 prototype file API
# (web/server.mjs, 127.0.0.1:8123; confined to files/, REQ-002)
#   - seeds files/order-process.bpmn from the read-only repository
#     fixture apps/mcp-server/test/fixtures/order-process.bpmn
#     (the original is verified unmodified by a before/after sha256),
#   - answers POST /file?name= with 200 and the JSON confirmation,
#     and GET /file?name= with 200 and sha256-identical bytes (the
#     POST -> GET round trip),
#   - answers GET /files with 200 and a JSON array holding both the
#     seeded file and the round-trip file,
#   - answers 404 for a validated name that does not exist and 400
#     for a missing name,
#   - rejects traversal names with 400 (../evil.bpmn on POST and GET,
#     the %2e%2e%2f-encoded variant on POST, the absolute path
#     /etc/passwd on POST) and writes nothing outside files/,
#   - keeps the method discipline (POST /files and PUT /file are
#     404),
#   - and the server wrote nothing to stdout (REQ-001).
#
# Lifecycle per bin/100-110-00-verify-page.sh: the fixed port must be
# free beforehand (ss pre-check), the server starts in the background
# from the repo root, readiness is polled 10 x 0.5 s, the PID is
# killed+waited via an EXIT trap, and the raw run output is teed to
# bin/logs/110-110-verify-file-api.log. Exits non-zero on any failed
# assertion. At the end the round-trip test file is removed; the
# seeded files/order-process.bpmn stays (committed as a result).

set -euo pipefail

SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
FEAT_DIR="$(cd "$SCRIPT_DIR/.." && pwd)"
REPO_ROOT="$(cd "$FEAT_DIR/../../.." && pwd)"

HOST='127.0.0.1'
PORT=8123
BASE_URL="http://${HOST}:${PORT}"

LOG_DIR="$FEAT_DIR/bin/logs"
LOG_FILE="$LOG_DIR/110-110-verify-file-api.log"
SERVER_STDOUT_LOG="$LOG_DIR/110-110-verify-file-api-server-stdout.log"
SERVER_STDERR_LOG="$LOG_DIR/110-110-verify-file-api-server-stderr.log"

FILES_DIR="$FEAT_DIR/files"
FIXTURE="$REPO_ROOT/apps/mcp-server/test/fixtures/order-process.bpmn"
POST_NAME='roundtrip-test.bpmn'

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

echo "=== Task 110.110: verify-file-api (ACC-002) ==="
echo "date: $(date -u +%Y-%m-%dT%H:%M:%SZ)"
echo "repo root: $REPO_ROOT"

# --- the fixed port must be free before the server starts -------------
if ss -ltnH | awk '{print $4}' | grep -Eq "[:.]${PORT}$"; then
  fail "port ${PORT} on ${HOST} is already in use"
fi
pass "port ${PORT} is free"

# --- the read-only fixture must exist before the seed ------------------
[ -f "$FIXTURE" ] || fail "the repository fixture is missing: ${FIXTURE}"
fixture_sha_before="$(sha256sum "$FIXTURE" | awk '{print $1}')"
pass "the fixture is present (sha256 ${fixture_sha_before})"

# --- seed files/order-process.bpmn from the fixture (copied) -----------
mkdir -p "$FILES_DIR"
cp "$FIXTURE" "$FILES_DIR/order-process.bpmn"
seed_sha="$(sha256sum "$FILES_DIR/order-process.bpmn" | awk '{print $1}')"
[ "$seed_sha" = "$fixture_sha_before" ] || fail "the seeded copy is not sha256-identical to the fixture"
pass "seeded files/order-process.bpmn (sha256 ${seed_sha})"

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

# --- POST /file -> GET /file round trip (byte identity) ----------------
echo "--- POST /file?name=${POST_NAME} ---"
post_body="$TMP_DIR/post-body.bpmn"
cp "$FIXTURE" "$post_body"
posted_sha="$(sha256sum "$post_body" | awk '{print $1}')"
post_status="$(
  curl -s -o "$TMP_DIR/post-response.json" -w '%{http_code}' -X POST \
    --data-binary "@${post_body}" "${BASE_URL}/file?name=${POST_NAME}"
)"
[ "$post_status" = '200' ] || fail "POST /file returned HTTP ${post_status} (expected 200)"
grep -q '"ok":true' "$TMP_DIR/post-response.json" || fail "the POST confirmation is not ok: $(cat "$TMP_DIR/post-response.json")"
grep -q "\"name\":\"${POST_NAME}\"" "$TMP_DIR/post-response.json" || fail "the POST confirmation does not echo the name: $(cat "$TMP_DIR/post-response.json")"
pass "POST /file?name=${POST_NAME} returned 200 with the JSON confirmation"

echo "--- GET /file?name=${POST_NAME} (round trip) ---"
get_status="$(curl -s -o "$TMP_DIR/roundtrip-get.bpmn" -w '%{http_code}' "${BASE_URL}/file?name=${POST_NAME}")"
[ "$get_status" = '200' ] || fail "GET /file?name=${POST_NAME} returned HTTP ${get_status} (expected 200)"
got_sha="$(sha256sum "$TMP_DIR/roundtrip-get.bpmn" | awk '{print $1}')"
echo "posted: ${posted_sha}"
echo "got:    ${got_sha}"
[ "$got_sha" = "$posted_sha" ] || fail "the POST -> GET round trip is not sha256-identical"
pass "the POST -> GET round trip is sha256-identical (${got_sha})"

# --- the seeded file reads back identically -----------------------------
echo "--- GET /file?name=order-process.bpmn (the seed) ---"
seed_get_status="$(curl -s -o "$TMP_DIR/seed-get.bpmn" -w '%{http_code}' "${BASE_URL}/file?name=order-process.bpmn")"
[ "$seed_get_status" = '200' ] || fail "GET /file?name=order-process.bpmn returned HTTP ${seed_get_status} (expected 200)"
seed_get_sha="$(sha256sum "$TMP_DIR/seed-get.bpmn" | awk '{print $1}')"
[ "$seed_get_sha" = "$fixture_sha_before" ] || fail "the seeded file is not sha256-identical to the fixture after the GET"
pass "GET /file?name=order-process.bpmn returned 200 with sha256-identical bytes (${seed_get_sha})"

# --- GET /files listing --------------------------------------------------
echo "--- GET /files ---"
list_status="$(curl -s -o "$TMP_DIR/files-list.json" -w '%{http_code}' "${BASE_URL}/files")"
[ "$list_status" = '200' ] || fail "GET /files returned HTTP ${list_status} (expected 200)"
grep -Eq '^\[' "$TMP_DIR/files-list.json" || fail "GET /files did not return a JSON array: $(cat "$TMP_DIR/files-list.json")"
grep -q 'order-process.bpmn' "$TMP_DIR/files-list.json" || fail "the listing is missing the seeded order-process.bpmn"
grep -q "${POST_NAME}" "$TMP_DIR/files-list.json" || fail "the listing is missing the round-trip file ${POST_NAME}"
echo "listing: $(cat "$TMP_DIR/files-list.json")"
pass "GET /files returned 200 with a JSON array holding the seed and the round-trip file"

# --- name validation: the 400 and 404 legs -------------------------------
echo "--- name validation legs ---"
no_name_status="$(curl -s -o /dev/null -w '%{http_code}' "${BASE_URL}/file")"
[ "$no_name_status" = '400' ] || fail "GET /file without a name returned HTTP ${no_name_status} (expected 400)"
pass "GET /file without a name returned 400"

missing_status="$(curl -s -o /dev/null -w '%{http_code}' "${BASE_URL}/file?name=no-such-diagram.bpmn")"
[ "$missing_status" = '404' ] || fail "GET /file for a missing file returned HTTP ${missing_status} (expected 404)"
pass "GET /file for a missing file returned 404"

# --- traversal legs (each 400, nothing written outside files/) -----------
echo "--- traversal legs ---"
traversal_body="$TMP_DIR/traversal-body.bpmn"
cp "$FIXTURE" "$traversal_body"

tr1="$(
  curl -s -o /dev/null -w '%{http_code}' -X POST --data-binary "@${traversal_body}" \
    "${BASE_URL}/file?name=../evil.bpmn"
)"
[ "$tr1" = '400' ] || fail "POST /file?name=../evil.bpmn returned HTTP ${tr1} (expected 400)"
pass "POST /file?name=../evil.bpmn returned 400"

tr2="$(curl -s -o /dev/null -w '%{http_code}' "${BASE_URL}/file?name=../evil.bpmn")"
[ "$tr2" = '400' ] || fail "GET /file?name=../evil.bpmn returned HTTP ${tr2} (expected 400)"
pass "GET /file?name=../evil.bpmn returned 400"

tr3="$(
  curl -s -o /dev/null -w '%{http_code}' -X POST --data-binary "@${traversal_body}" \
    "${BASE_URL}/file?name=%2e%2e%2fevil.bpmn"
)"
[ "$tr3" = '400' ] || fail "POST /file?name=%2e%2e%2fevil.bpmn returned HTTP ${tr3} (expected 400)"
pass "POST /file?name=%2e%2e%2fevil.bpmn returned 400"

tr4="$(
  curl -s -o /dev/null -w '%{http_code}' -X POST --data-binary "@${traversal_body}" \
    "${BASE_URL}/file?name=/etc/passwd"
)"
[ "$tr4" = '400' ] || fail "POST /file?name=/etc/passwd returned HTTP ${tr4} (expected 400)"
pass "POST /file?name=/etc/passwd returned 400"

[ ! -e "$FEAT_DIR/evil.bpmn" ] || fail "the traversal name escaped files/ (wrote $FEAT_DIR/evil.bpmn)"
[ ! -d "$FILES_DIR/etc" ] || fail "the absolute traversal name nested a directory inside files/"
pass "nothing was written outside files/ (no evil.bpmn in the feat dir, no etc/ in files/)"

# --- method discipline ----------------------------------------------------
echo "--- method discipline ---"
md1="$(curl -s -o /dev/null -w '%{http_code}' -X POST "${BASE_URL}/files")"
[ "$md1" = '404' ] || fail "POST /files returned HTTP ${md1} (expected 404)"
pass "POST /files returned 404"

md2="$(
  curl -s -o /dev/null -w '%{http_code}' -X PUT --data-binary "@${traversal_body}" \
    "${BASE_URL}/file?name=put-test.bpmn"
)"
[ "$md2" = '404' ] || fail "PUT /file returned HTTP ${md2} (expected 404)"
pass "PUT /file returned 404"

# --- the fixture is unmodified -------------------------------------------
fixture_sha_after="$(sha256sum "$FIXTURE" | awk '{print $1}')"
[ "$fixture_sha_after" = "$fixture_sha_before" ] || fail "the fixture was modified by the run"
pass "the fixture is unmodified (sha256 ${fixture_sha_after})"

# --- the server's stdout discipline (REQ-001) ---------------------------
echo "--- server stdout discipline ---"
[ ! -s "$SERVER_STDOUT_LOG" ] || fail "the server wrote to stdout (REQ-001): ${SERVER_STDOUT_LOG}"
pass "the server wrote nothing to stdout"

# --- cleanup: remove the test artifact, keep the seed --------------------
rm -f "$FILES_DIR/${POST_NAME}"
pass "removed the round-trip test file; the seed files/order-process.bpmn stays committed-ready"

echo
echo "ALL CHECKS PASSED (ACC-002)"
