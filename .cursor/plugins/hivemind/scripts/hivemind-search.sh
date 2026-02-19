#!/usr/bin/env bash

set -euo pipefail

SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
source "${SCRIPT_DIR}/hivemind-common.sh"

hivemind_require_tools curl jq

if [[ $# -lt 1 ]]; then
  printf 'Error: search query required\n' >&2
  printf 'Usage: %s <query>\n' "$0" >&2
  exit 1
fi

QUERY="$*"
ENCODED_QUERY="$(printf '%s' "${QUERY}" | jq -sRr @uri)"
RESPONSE="$(hivemind_curl GET "/mindchunks/search?query=${ENCODED_QUERY}")"

if ! printf '%s' "${RESPONSE}" | jq . >/dev/null 2>&1; then
  printf 'Error: invalid response from Hivemind API\n' >&2
  printf '%s\n' "${RESPONSE}" >&2
  exit 1
fi

if printf '%s' "${RESPONSE}" | jq -e '.error' >/dev/null 2>&1; then
  printf '%s\n' "${RESPONSE}" | jq -r '.message // .error'
  exit 1
fi

COUNT="$(printf '%s' "${RESPONSE}" | jq '.mindchunks | length')"
if [[ "${COUNT}" -eq 0 ]]; then
  printf 'No relevant mindchunks found for: "%s"\n' "${QUERY}"
  exit 0
fi

printf 'Found %s mindchunk(s) for: "%s"\n\n' "${COUNT}" "${QUERY}"

printf '%s\n' "${RESPONSE}" | jq -r '
  .mindchunks[] |
  "Summary: \(.summary)\n" +
  "Context: \(.context)\n\n" +
  "Metadata:\n" +
  "  ID: \(.id // "N/A")\n" +
  "  Author: \(.author // "N/A")\n" +
  "  Votes: +\(.upvotes // 0) / -\(.downvotes // 0)\n" +
  "  Created: \(.created_at // "N/A")\n" +
  "----------------------------------------------------------------"
'
