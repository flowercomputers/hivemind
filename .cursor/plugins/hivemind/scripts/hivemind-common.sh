#!/usr/bin/env bash

set -euo pipefail

HIVEMIND_API_URL="${HIVEMIND_API_URL:-https://hivemind.flowercomputer.com}"
HIVEMIND_CONFIG_DIR="${HIVEMIND_CONFIG_DIR:-${HOME}/.config/hivemind}"
HIVEMIND_AGENT_ID_FILE="${HIVEMIND_CONFIG_DIR}/.saved-ids"

mkdir -p "${HIVEMIND_CONFIG_DIR}"

hivemind_require_tools() {
  local missing=0
  for tool in "$@"; do
    if ! command -v "${tool}" >/dev/null 2>&1; then
      printf 'Error: required tool not found: %s\n' "${tool}" >&2
      missing=1
    fi
  done
  if [[ "${missing}" -eq 1 ]]; then
    return 1
  fi
}

hivemind_get_agent_id() {
  if [[ -f "${HIVEMIND_AGENT_ID_FILE}" ]]; then
    tr -d '[:space:]' <"${HIVEMIND_AGENT_ID_FILE}"
  fi
}

hivemind_save_agent_id() {
  local agent_id="$1"
  if [[ -n "${agent_id}" ]]; then
    printf '%s\n' "${agent_id}" >"${HIVEMIND_AGENT_ID_FILE}"
    chmod 600 "${HIVEMIND_AGENT_ID_FILE}"
  fi
}

hivemind_extract_header() {
  local header_name="$1"
  local headers_file="$2"

  awk -F': ' -v header="${header_name}" '
    tolower($1) == tolower(header) {
      gsub(/\r/, "", $2)
      print $2
      exit
    }
  ' "${headers_file}"
}

hivemind_curl() {
  local method="$1"
  local endpoint="$2"
  shift 2

  local headers_file
  local body_file
  local http_code
  local agent_id
  local response
  local new_agent_id

  headers_file="$(mktemp)"
  body_file="$(mktemp)"

  agent_id="$(hivemind_get_agent_id || true)"

  local curl_args=(
    -sS
    -X "${method}"
    "${HIVEMIND_API_URL}${endpoint}"
    -D "${headers_file}"
    -o "${body_file}"
    -w "%{http_code}"
  )

  if [[ -n "${agent_id}" ]]; then
    curl_args+=(-H "x-fab-id: ${agent_id}")
  fi

  http_code="$(curl "${curl_args[@]}" "$@")" || {
    rm -f "${headers_file}" "${body_file}"
    printf 'Error: failed to connect to %s\n' "${HIVEMIND_API_URL}" >&2
    return 1
  }

  new_agent_id="$(hivemind_extract_header "x-fab-id" "${headers_file}" || true)"
  hivemind_save_agent_id "${new_agent_id}"

  response="$(cat "${body_file}")"

  rm -f "${headers_file}" "${body_file}"

  if [[ "${http_code}" -ge 400 ]]; then
    if [[ -n "${response}" ]]; then
      printf '%s' "${response}"
    else
      printf '{"message":"request failed","status":%s}\n' "${http_code}"
    fi
    return 0
  fi

  printf '%s' "${response}"
}
