#!/usr/bin/env bash

set -euo pipefail

if [[ "${HIVEMIND_HOOKS_DISABLE:-}" =~ ^(1|true|yes|on)$ ]]; then
  printf '{}\n'
  exit 0
fi

if ! command -v jq >/dev/null 2>&1; then
  printf '{}\n'
  exit 0
fi

STATE_FILE=".cursor/hooks/state/hivemind-user-prompt.json"
MIN_SECONDS="${HIVEMIND_AUTO_SEARCH_MIN_SECONDS:-900}"
mkdir -p "$(dirname "${STATE_FILE}")"

INPUT_JSON="$(cat)"
PROMPT_TEXT="$(
  printf '%s' "${INPUT_JSON}" | jq -r '
    .prompt //
    .user_prompt //
    .message //
    .text //
    ""
  ' | tr '\n' ' ' | sed 's/[[:space:]]\+/ /g'
)"

PROMPT_TEXT="${PROMPT_TEXT#"${PROMPT_TEXT%%[![:space:]]*}"}"
PROMPT_TEXT="${PROMPT_TEXT%"${PROMPT_TEXT##*[![:space:]]}"}"

if [[ -z "${PROMPT_TEXT}" || "${#PROMPT_TEXT}" -lt 20 ]]; then
  printf '{}\n'
  exit 0
fi

if [[ "${PROMPT_TEXT}" =~ ^/ ]]; then
  printf '{}\n'
  exit 0
fi

LOWER_PROMPT="$(printf '%s' "${PROMPT_TEXT}" | tr '[:upper:]' '[:lower:]')"
if [[ "${LOWER_PROMPT}" == *"hivemind"* ]]; then
  printf '{}\n'
  exit 0
fi

if [[ ! "${LOWER_PROMPT}" =~ (best\ practice|pattern|approach|how\ do\ i|how\ to|stuck|error|failed|fix|refactor|architecture|design) ]]; then
  printf '{}\n'
  exit 0
fi

PROMPT_SIG="$(printf '%s' "${LOWER_PROMPT}" | cksum | awk '{print $1}')"
NOW_EPOCH="$(date +%s)"

LAST_EPOCH=0
LAST_SIG=""
if [[ -f "${STATE_FILE}" ]]; then
  LAST_EPOCH="$(jq -r '.last_epoch // 0' "${STATE_FILE}" 2>/dev/null || echo 0)"
  LAST_SIG="$(jq -r '.last_sig // ""' "${STATE_FILE}" 2>/dev/null || echo "")"
fi

if [[ "${LAST_SIG}" == "${PROMPT_SIG}" ]] && (( NOW_EPOCH - LAST_EPOCH < MIN_SECONDS )); then
  printf '{}\n'
  exit 0
fi

SEARCH_QUERY="$(printf '%s' "${PROMPT_TEXT}" | awk '{for (i=1; i<=NF && i<=12; i++) printf("%s%s", $i, (i<NF && i<12 ? " " : ""))}')"
if [[ -z "${SEARCH_QUERY}" ]]; then
  printf '{}\n'
  exit 0
fi

printf '{"last_epoch": %s, "last_sig": "%s"}\n' "${NOW_EPOCH}" "${PROMPT_SIG}" >"${STATE_FILE}"

jq -n --arg query "${SEARCH_QUERY}" '{
  followup_message:
    ("Potential prior-art task detected. Consider running /hivemind-search \"" + $query + "\" before implementing. Do not store anything automatically; confirm before write actions.")
}'
