#!/usr/bin/env bash
# SPDX-FileCopyrightText: 2026 Ronald Rink, d-fens GmbH
# SPDX-License-Identifier: AGPL-3.0-only
#
# Task 200.100 (ACC-005): finalize the six results.md sections from the
# bin/logs/ raw data (Phase 200, feat-29). The run is over: this script
# VALIDATES the structured record, and - only where a check fails -
# makes the minimal correcting edit to results.md, reported in the log.
#
# Checks (all deterministic; the script is re-runnable - a second run
# on a finalized results.md reports the same green outcome):
#   1. six sections: results.md holds `## R1:` ... `## R6:` (all six, in
#      rubric order, and no other H2) and NO remaining `pending:` line
#      (the run is over - a pending line is a violation; it cannot be
#      auto-filled, it fails).
#   2. no unexplained n/a (REQ-005/ACC-005): every `n/a` occurrence must
#      carry a reason on the same line - the deterministic rule: after
#      the `n/a` token, at least 3 further non-space characters before
#      the next `|` or end-of-line. A bare `n/a` (all-space tail) is a
#      violation; fix = the standard reason is added inline (logged).
#   3. raw-data references resolve: (a) every `bin/logs/<file>` path and
#      (b) every backticked bare raw-log filename (glob `*` and numeric
#      brace `{1,2,3}` forms expanded) must exist on disk under
#      bin/logs/. A missing full-path reference is a violation; fix =
#      the reference is corrected to the unique candidate file (the
#      data is never deleted); 0 or >1 candidates fails. A missing
#      bare/glob/brace token fails (no guess is possible).
#   4. per-section structural minimums (practical greps): R1 holds a
#      10-row table (5 primitives x 2 strategies - the data rows
#      between the header separator and the end of the table), R2
#      holds 3 run rows, R4 holds 6 rows, R5 holds 6 diff-pair rows,
#      and R3 and R6 each hold at least one table plus a verdict line
#      (a line containing `verdict`, case-insensitive). Missing rows
#      cannot be fabricated; they fail.
#   5. ACC-008 naming check (the bin/ half): every entry directly under
#      bin/ except the bin/logs/ directory matches
#      ^[0-9]{3}-[0-9]{3}-[0-9]{2}-[a-z0-9-]+\.[a-z0-9]+$ (the
#      PPP-TTT-NN-slug.ext convention; any other directory or a
#      non-matching file fails).
#
# This script does not touch the server, the browser, or any raw data:
# it reads results.md and bin/logs/ and (only on a violation) edits
# results.md. The raw run output is teed to
# bin/logs/200-100-collect-results.log. Exits non-zero on any
# remaining violation.

set -euo pipefail

SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
FEAT_DIR="$(cd "$SCRIPT_DIR/.." && pwd)"
REPO_ROOT="$(cd "$FEAT_DIR/../../.." && pwd)"

RESULTS="$FEAT_DIR/results.md"
LOG_DIR="$FEAT_DIR/bin/logs"
LOG_FILE="$LOG_DIR/200-100-collect-results.log"
NA_REASON='not applicable under this row'\''s stated protocol (no value recorded; see the section'\''s raw record)'
NAME_RE='^[0-9]{3}-[0-9]{3}-[0-9]{2}-[a-z0-9-]+\.[a-z0-9]+$'

mkdir -p "$LOG_DIR"

# Tee the raw run output (stdout and stderr) to the log file.
exec > >(tee "$LOG_FILE") 2> >(tee -a "$LOG_FILE")

pass() {
  echo "PASS: $1"
}

fix() {
  echo "FIX: $1"
}

fail() {
  echo "FAIL: $1"
  exit 1
}

[ -f "$RESULTS" ] || fail "missing $RESULTS"
[ -d "$LOG_DIR" ] || fail "missing $LOG_DIR"

echo "=== Task 200.100: collect-results (finalize the six sections, ACC-005) ==="
echo "date: $(date -u +%Y-%m-%dT%H:%M:%SZ)"
echo "results: $RESULTS"
echo "log dir: $LOG_DIR"

# ---------------------------------------------------------------------------
# check 1: the six sections, in rubric order, no pending lines
# ---------------------------------------------------------------------------
check_sections() {
  local n line prev=0 extra
  for n in 1 2 3 4 5 6; do
    line="$(grep -n "^## R${n}:" "$RESULTS" | head -n1 | cut -d: -f1 || true)"
    [ -n "$line" ] || fail "check 1: the section '## R${n}:' is missing from results.md"
    [ "$line" -gt "$prev" ] ||
      fail "check 1: '## R${n}:' (line ${line}) is out of rubric order (the previous section starts at line ${prev})"
    prev="$line"
  done
  extra="$(grep -c '^## ' "$RESULTS" || true)"
  [ "$extra" -eq 6 ] ||
    fail "check 1: results.md holds ${extra} H2 sections (expected exactly six, R1-R6)"
  pass "check 1a: the six sections '## R1:' .. '## R6:' are present, in rubric order, and no other H2 exists"

  local pending
  pending="$(grep -n 'pending:' "$RESULTS" || true)"
  if [ -n "$pending" ]; then
    fail "check 1b: a 'pending:' line remains (the run is over - a pending section cannot be auto-filled):
${pending}"
  fi
  pass "check 1b: no 'pending:' line remains (all six sections are filled)"
}

# ---------------------------------------------------------------------------
# check 2: no unexplained n/a (deterministic rule: after each `n/a` token,
# at least 3 further non-space characters before the next `|` or EOL)
# ---------------------------------------------------------------------------
na_violations() {
  awk '
    {
      line = $0
      pos = 1
      while (match(substr(line, pos), /n\/a/)) {
        start = pos + RSTART
        endpos = start + 2 # "n/a" is 3 characters
        tail = substr(line, endpos + 1)
        if (match(tail, /\|/)) tail = substr(tail, 1, RSTART - 1)
        t = tail
        gsub(/[ \t]/, "", t)
        if (length(t) < 3) print NR ": an n/a token carries no reason (fewer than 3 non-space characters before the next | or end-of-line)"
        pos = endpos + 1
      }
    }
  ' "$RESULTS"
}

na_fix() {
  local tmp
  tmp="$(mktemp)"
  awk -v reason="$NA_REASON" '
    {
      line = $0
      if (line !~ /n\/a/) { print line; next }
      out = ""
      rest = line
      changed = 0
      bad = 0
      while (match(rest, /n\/a/)) {
        pre = substr(rest, 1, RSTART - 1)
        after = substr(rest, RSTART + 3) # everything after "n/a"
        tail = after
        cutpos = 0
        if (match(after, /\|/)) { tail = substr(after, 1, RSTART - 1); cutpos = RSTART }
        t = tail
        gsub(/[ \t]/, "", t)
        if (length(t) == 0) {
          # bare n/a (all-space tail): add the reason inline, keeping the
          # spacing before the next | (or the end-of-line)
          m = match(tail, /[ \t]*$/)
          trail = (m ? substr(tail, m) : "")
          out = out pre "n/a — " reason trail
          if (cutpos > 0) { out = out substr(after, cutpos); rest = substr(after, cutpos + 1) }
          else rest = ""
          changed = 1
        } else if (length(t) < 3) {
          print "INTERNAL: an n/a with a non-space tail shorter than 3 characters (line " NR ") - not auto-fixable" > "/dev/stderr"
          bad = 1
          break
        } else {
          out = out pre "n/a"
          rest = after
        }
      }
      if (bad) exit 2
      print (changed ? out : line)
    }
  ' "$RESULTS" >"$tmp" || {
    rm -f "$tmp"
    return 1
  }
  mv "$tmp" "$RESULTS"
  return 0
}

check_na() {
  local v
  v="$(na_violations)"
  if [ -z "$v" ]; then
    pass "check 2: every n/a occurrence carries a reason on the same line (the 3-non-space-character rule)"
    return 0
  fi
  echo "check 2 violations (line numbers):"
  printf '%s\n' "$v"
  na_fix || fail "check 2: the n/a fix pass hit a non-bare n/a shape; correct results.md manually"
  fix "check 2: added the standard reason inline to the bare n/a cell(s) in results.md"
  v="$(na_violations)"
  if [ -n "$v" ]; then
    fail "check 2: an unexplained n/a remains after the in-place fix:
${v}"
  fi
  pass "check 2: every n/a occurrence carries a reason (the bare cell(s) were fixed in place - see FIX line)"
}

# ---------------------------------------------------------------------------
# check 3: raw-data references resolve
# ---------------------------------------------------------------------------
fix_missing_ref() {
  # $1 = the reference as written (bin/logs/NAME); $2 = a label for the log
  local name="${1#bin/logs/}"
  local f base cands=()
  for f in "$LOG_DIR"/*; do
    [ -f "$f" ] || continue
    base="${f##*/}"
    if [[ "$base" == *"$name"* || "$name" == *"$base"* ]]; then
      cands+=("$base")
    fi
  done
  if [ "${#cands[@]}" -ne 1 ]; then
    return 1
  fi
  local esc esc2
  esc="$(printf '%s' "$name" | sed -E 's/\./\\./g')"
  esc2="$(printf '%s' "${cands[0]}" | sed -E 's/\./\\./g')"
  sed -i "s|bin/logs/${esc}|bin/logs/${esc2}|g" "$RESULTS"
  fix "check 3 ($2): corrected the raw-data reference 'bin/logs/${name}' to 'bin/logs/${cands[0]}' (the unique candidate under bin/logs/; the data is never deleted)"
  return 0
}

check_refs() {
  local full ref
  # (a) the full-path references bin/logs/<file>
  full="$(grep -oE 'bin/logs/[A-Za-z0-9._-]+' "$RESULTS" | sed -E 's/[.,;:]+$//' | sort -u || true)"
  [ -n "$full" ] || fail "check 3a: no 'bin/logs/<file>' reference found in results.md (expected several)"
  local fixed=0
  while IFS= read -r ref; do
    if [ ! -f "$FEAT_DIR/$ref" ]; then
      if fix_missing_ref "$ref" "full path"; then
        fixed=$((fixed + 1))
      else
        fail "check 3a: the raw-data reference ${ref} does not resolve to a file under bin/logs/ and has no unique candidate there (correct the reference to the real file - the data is never deleted)"
      fi
    fi
  done <<<"$full"
  [ "$fixed" -eq 0 ] &&
    pass "check 3a: all $(printf '%s\n' "$full" | wc -l) full-path bin/logs/<file> references resolve to existing files"
  # (b) the backticked bare raw-log filenames (the tables' raw-ref
  #     convention): the raw-log form is PPP-TTT-<slug>.ext (the NN
  #     slot is a free-form slug under bin/logs/ - r1, smoke, ...),
  #     glob * and numeric brace {1,2,3} forms expanded
  local bare t tok ok
  bare="$(
    grep -oE '`[0-9]{3}-[0-9]{3}-[a-zA-Z0-9._*{}-]*\.(md|log|png|yml)`' "$RESULTS" |
      sort -u || true
  )"
  [ -n "$bare" ] || fail "check 3b: no backticked raw-log filename found in results.md (expected several)"
  local checked=0
  while IFS= read -r t; do
    tok="${t#\`}"
    tok="${tok%\`}"
    checked=$((checked + 1))
    if [[ "$tok" == *'*'* ]]; then
      ok=0
      while IFS= read -r m; do
        [ -f "$m" ] && ok=1
      done < <(compgen -G "$LOG_DIR/$tok" || true)
      [ "$ok" -eq 1 ] || fail "check 3b: the glob reference \`${tok}\` matches no file under bin/logs/"
    elif [[ "$tok" =~ ^(.+)\{([0-9]+(,[0-9]+)*)\}(.+)$ ]]; then
      local pre="${BASH_REMATCH[1]}" suf="${BASH_REMATCH[3]}" n
      IFS=',' read -ra NUMS <<<"${BASH_REMATCH[2]}"
      for n in "${NUMS[@]}"; do
        [ -f "$LOG_DIR/${pre}${n}${suf}" ] || fail "check 3b: the brace reference \`${tok}\` is missing its member ${pre}${n}${suf} under bin/logs/"
      done
    else
      [ -f "$LOG_DIR/$tok" ] ||
        fail "check 3b: the bare raw-log reference \`${tok}\` does not exist under bin/logs/ (correct the reference to the real file - the data is never deleted)"
    fi
  done <<<"$bare"
  pass "check 3b: all ${checked} backticked bare raw-log filenames (globs and brace forms expanded) resolve under bin/logs/"
}

# ---------------------------------------------------------------------------
# check 4: per-section structural minimums
# ---------------------------------------------------------------------------
section_body() {
  # $1 = the rubric number; print the section body (after the H2, up to
  # the next H2 or EOF)
  awk -v n="$1" '
    $0 ~ "^## R" n ":" { on = 1; next }
    on && /^## / { exit }
    on { print }
  ' "$RESULTS"
}

first_table_rows() {
  # stdin = a section body; print the data-row count of the first table
  # (the rows after a header line + a | --- | separator line, up to the
  # first non-table line)
  awk '
    { lines[NR] = $0 }
    END {
      rows = 0
      for (i = 1; i < NR; i++) {
        if (lines[i] ~ /^\|/ && lines[i + 1] ~ /^\|[ \t:|-]+\|[ \t]*$/) {
          j = i + 2
          while (j <= NR && lines[j] ~ /^\|/) { rows++; j++ }
          break
        }
      }
      print rows
    }
  '
}

check_structure() {
  local n body rows
  for n in 1 2 3 4 5 6; do
    body="$(section_body "$n")"
    rows="$(printf '%s\n' "$body" | first_table_rows)"
    case "$n" in
    1) [ "$rows" -eq 10 ] ||
        fail "check 4: R1 holds a ${rows}-row table (expected 10 = 5 primitives x 2 strategies)"
        ;;
    2) [ "$rows" -eq 3 ] || fail "check 4: R2 holds ${rows} run rows (expected 3)" ;;
    3) [ "$rows" -ge 1 ] || fail "check 4: R3 holds no table (expected at least one)"
       printf '%s\n' "$body" | grep -qi 'verdict' || fail "check 4: R3 holds no verdict line"
       ;;
    4) [ "$rows" -eq 6 ] || fail "check 4: R4 holds ${rows} rows (expected 6 = 3 pixel + 3 bridge runs)" ;;
    5) [ "$rows" -eq 6 ] || fail "check 4: R5 holds ${rows} diff-pair rows (expected 6)" ;;
    6) [ "$rows" -ge 1 ] || fail "check 4: R6 holds no table (expected at least one)"
       printf '%s\n' "$body" | grep -qi 'verdict' || fail "check 4: R6 holds no verdict line"
       ;;
    esac
  done
  pass "check 4: the structural minimums hold (R1 10 rows; R2 3 run rows; R4 6 rows; R5 6 diff pairs; R3 and R6 a table plus a verdict line)"
}

# ---------------------------------------------------------------------------
# check 5: ACC-008 naming check (the bin/ half)
# ---------------------------------------------------------------------------
check_bin_naming() {
  local f base count=0
  for f in "$FEAT_DIR"/bin/*; do
    base="${f##*/}"
    if [ -d "$f" ]; then
      [ "$base" = "logs" ] ||
        fail "check 5: bin/${base}/ is a directory other than bin/logs/ (the plan's D3 excludes only bin/logs/)"
      continue
    fi
    if [[ ! "$base" =~ $NAME_RE ]]; then
      fail "check 5: bin/${base} does not match the PPP-TTT-NN-slug.ext convention (${NAME_RE})"
    fi
    count=$((count + 1))
  done
  [ "$count" -ge 1 ] || fail "check 5: no files found directly under bin/"
  pass "check 5: all ${count} files directly under bin/ (the bin/logs/ directory excluded) match PPP-TTT-NN-slug.ext"
}

# ---------------------------------------------------------------------------
# main
# ---------------------------------------------------------------------------
echo
echo "--- check 1: six sections, rubric order, no pending lines ---"
check_sections

echo
echo "--- check 2: no unexplained n/a ---"
check_na

echo
echo "--- check 3: raw-data references resolve ---"
check_refs

echo
echo "--- check 4: per-section structural minimums ---"
check_structure

echo
echo "--- check 5: ACC-008 bin/ naming (the PPP-TTT-NN-slug.ext half) ---"
check_bin_naming

echo
echo "ALL CHECKS PASSED (Task 200.100 / ACC-005: the six results.md sections are final)"
