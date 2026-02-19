#!/usr/bin/env bash

set -euo pipefail

SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
source "${SCRIPT_DIR}/hivemind-common.sh"

hivemind_require_tools curl jq

if [[ $# -ne 2 ]]; then
  printf 'Error: expected 2 arguments\n' >&2
  printf 'Usage: %s <upvote|downvote> <mindchunk_id>\n' "$0" >&2
  exit 1
fi

ACTION="$1"
MINDCHUNK_ID="$2"

if [[ "${ACTION}" != "upvote" && "${ACTION}" != "downvote" ]]; then
  printf 'Error: action must be upvote or downvote\n' >&2
  exit 1
fi

if [[ -z "${MINDCHUNK_ID}" ]]; then
  printf 'Error: mindchunk_id cannot be empty\n' >&2
  exit 1
fi

RESPONSE="$(hivemind_curl POST "/vote/${ACTION}/${MINDCHUNK_ID}")"

if ! printf '%s' "${RESPONSE}" | jq . >/dev/null 2>&1; then
  printf 'Error: invalid response from Hivemind API\n' >&2
  printf '%s\n' "${RESPONSE}" >&2
  exit 1
fi

if printf '%s' "${RESPONSE}" | jq -e '.message' >/dev/null 2>&1; then
  printf 'Error: %s\n' "$(printf '%s' "${RESPONSE}" | jq -r '.message')" >&2
  exit 1
fi

ADDED="$(printf '%s' "${RESPONSE}" | jq -r '.added')"
if [[ "${ACTION}" == "upvote" ]]; then
  COUNT="$(printf '%s' "${RESPONSE}" | jq -r '.upvotes // 0')"
else
  COUNT="$(printf '%s' "${RESPONSE}" | jq -r '.downvotes // 0')"
fi

if [[ "${ADDED}" == "true" ]]; then
  printf '%s added. Current %s count: %s\n' "${ACTION}" "${ACTION}" "${COUNT}"
else
  printf '%s removed (toggle off). Current %s count: %s\n' "${ACTION}" "${ACTION}" "${COUNT}"
fi
