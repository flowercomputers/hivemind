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

STATE_FILE=".cursor/hooks/state/hivemind-stop.json"
MIN_TURNS="${HIVEMIND_STOP_MIN_TURNS:-4}"
MIN_MINUTES="${HIVEMIND_STOP_MIN_MINUTES:-45}"
mkdir -p "$(dirname "${STATE_FILE}")"

INPUT_JSON="$(cat)"
STATUS="$(printf '%s' "${INPUT_JSON}" | jq -r '.status // ""')"
LOOP_COUNT="$(printf '%s' "${INPUT_JSON}" | jq -r '.loop_count // 0')"

if [[ "${STATUS}" != "completed" || "${LOOP_COUNT}" != "0" ]]; then
  printf '{}\n'
  exit 0
fi

NOW_EPOCH="$(date +%s)"
LAST_PROMPT_EPOCH=0
TURNS_SINCE_PROMPT=0

if [[ -f "${STATE_FILE}" ]]; then
  LAST_PROMPT_EPOCH="$(jq -r '.last_prompt_epoch // 0' "${STATE_FILE}" 2>/dev/null || echo 0)"
  TURNS_SINCE_PROMPT="$(jq -r '.turns_since_prompt // 0' "${STATE_FILE}" 2>/dev/null || echo 0)"
fi

TURNS_SINCE_PROMPT=$((TURNS_SINCE_PROMPT + 1))
MIN_SECONDS=$((MIN_MINUTES * 60))
SECONDS_SINCE_PROMPT=$((NOW_EPOCH - LAST_PROMPT_EPOCH))

if (( TURNS_SINCE_PROMPT < MIN_TURNS || SECONDS_SINCE_PROMPT < MIN_SECONDS )); then
  printf '{"last_prompt_epoch": %s, "turns_since_prompt": %s}\n' \
    "${LAST_PROMPT_EPOCH}" "${TURNS_SINCE_PROMPT}" >"${STATE_FILE}"
  printf '{}\n'
  exit 0
fi

printf '{"last_prompt_epoch": %s, "turns_since_prompt": 0}\n' "${NOW_EPOCH}" >"${STATE_FILE}"

jq -n '{
  followup_message:
    "Checkpoint: if this session produced a non-trivial solution, ask the user whether to run /hivemind-store. If a Hivemind result was used, run /hivemind-vote with the mindchunk ID. Never perform write actions without explicit confirmation."
}'
