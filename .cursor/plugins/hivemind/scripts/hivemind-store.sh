#!/usr/bin/env bash

set -euo pipefail

SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
source "${SCRIPT_DIR}/hivemind-common.sh"

hivemind_require_tools curl jq

SUMMARY=""
CONTEXT=""
CONFIDENTIALITY=""
AUTO_CONFIRM=false
QUIET=false
POSITIONAL_ARGS=()

while [[ $# -gt 0 ]]; do
  case "$1" in
    --summary)
      SUMMARY="${2:-}"
      shift 2
      ;;
    --context)
      CONTEXT="${2:-}"
      shift 2
      ;;
    --context-file)
      if [[ -z "${2:-}" || ! -f "${2}" ]]; then
        printf 'Error: context file not found: %s\n' "${2:-<empty>}" >&2
        exit 1
      fi
      CONTEXT="$(cat "${2}")"
      shift 2
      ;;
    --confidentiality)
      CONFIDENTIALITY="${2:-}"
      shift 2
      ;;
    -y|--yes)
      AUTO_CONFIRM=true
      shift
      ;;
    -q|--quiet)
      QUIET=true
      shift
      ;;
    -h|--help)
      cat <<'EOF'
Store knowledge in Hivemind.

Usage:
  hivemind-store.sh --summary "..." --context "..." [--confidentiality 15] [--yes]
  hivemind-store.sh "summary" "context" [confidentiality]

Options:
  --summary TEXT         Short searchable summary.
  --context TEXT         Detailed context and rationale.
  --context-file PATH    Read context from file.
  --confidentiality NUM  Integer from 0 to 100 (default: 15).
  -y, --yes              Skip confirmation prompt.
  -q, --quiet            Only output mindchunk id.
  -h, --help             Show this help text.
EOF
      exit 0
      ;;
    -*)
      printf 'Error: unknown option: %s\n' "$1" >&2
      exit 1
      ;;
    *)
      POSITIONAL_ARGS+=("$1")
      shift
      ;;
  esac
done

if [[ -z "${SUMMARY}" && ${#POSITIONAL_ARGS[@]} -ge 1 ]]; then
  SUMMARY="${POSITIONAL_ARGS[0]}"
fi
if [[ -z "${CONTEXT}" && ${#POSITIONAL_ARGS[@]} -ge 2 ]]; then
  CONTEXT="${POSITIONAL_ARGS[1]}"
fi
if [[ -z "${CONFIDENTIALITY}" && ${#POSITIONAL_ARGS[@]} -ge 3 ]]; then
  CONFIDENTIALITY="${POSITIONAL_ARGS[2]}"
fi

if [[ -z "${SUMMARY}" ]]; then
  printf 'Error: summary is required\n' >&2
  exit 1
fi
if [[ -z "${CONTEXT}" ]]; then
  printf 'Error: context is required\n' >&2
  exit 1
fi

CONFIDENTIALITY="${CONFIDENTIALITY:-15}"
if ! [[ "${CONFIDENTIALITY}" =~ ^[0-9]+$ ]] || [[ "${CONFIDENTIALITY}" -lt 0 ]] || [[ "${CONFIDENTIALITY}" -gt 100 ]]; then
  printf 'Error: confidentiality must be an integer between 0 and 100\n' >&2
  exit 1
fi

if [[ "${AUTO_CONFIRM}" == false ]]; then
  cat <<EOF
About to store this mindchunk:
- Summary: ${SUMMARY}
- Confidentiality: ${CONFIDENTIALITY}
EOF
  printf 'Proceed? (y/N): '
  read -r confirm
  if [[ ! "${confirm}" =~ ^[Yy]$ ]]; then
    printf 'Cancelled.\n'
    exit 0
  fi
fi

PAYLOAD="$(jq -n \
  --arg summary "${SUMMARY}" \
  --arg context "${CONTEXT}" \
  --argjson confidentiality "${CONFIDENTIALITY}" \
  '{summary: $summary, context: $context, confidentiality: $confidentiality}'
)"

RESPONSE="$(hivemind_curl POST "/mindchunks/create" -H "Content-Type: application/json" -d "${PAYLOAD}")"

if ! printf '%s' "${RESPONSE}" | jq . >/dev/null 2>&1; then
  printf 'Error: invalid response from Hivemind API\n' >&2
  printf '%s\n' "${RESPONSE}" >&2
  exit 1
fi

MINDCHUNK_ID="$(printf '%s' "${RESPONSE}" | jq -r '.id // empty')"
if [[ -z "${MINDCHUNK_ID}" ]]; then
  printf 'Error: create request failed\n' >&2
  printf '%s\n' "${RESPONSE}" >&2
  exit 1
fi

if [[ "${QUIET}" == true ]]; then
  printf '%s\n' "${MINDCHUNK_ID}"
else
  printf 'Stored successfully.\n'
  printf 'Mindchunk ID: %s\n' "${MINDCHUNK_ID}"
fi
