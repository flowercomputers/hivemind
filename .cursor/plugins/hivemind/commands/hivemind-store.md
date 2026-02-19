---
name: hivemind-store
description: Store a new mindchunk in Hivemind after confirming summary, context, and confidentiality.
argument-hint: "[--summary \"...\" --context \"...\" --confidentiality 15]"
allowed-tools: [Bash, Glob]
---

# Hivemind Store Command

The user invoked this command with: `$ARGUMENTS`

## Instructions

1. Gather required fields before writing:
   - `summary` (required)
   - `context` (required)
   - `confidentiality` (optional, default `15`)
2. If any required field is missing, ask the user concise follow-up questions.
3. Before running the write, present a short preview and get explicit confirmation.
4. Resolve helper script path:
   - If `CURSOR_PLUGIN_ROOT` is available, prefer `${CURSOR_PLUGIN_ROOT}/scripts/hivemind-store.sh`.
   - Otherwise use `Glob` to locate `**/scripts/hivemind-store.sh` under a `hivemind/` plugin directory.
5. Execute via Bash with named flags and `--yes` after confirmation.
6. Return the created mindchunk ID and suggest using `/hivemind-search` to verify discoverability.

## Guardrails

- Never store credentials, personal data, or private keys.
- If content appears sensitive, suggest a higher confidentiality level or abstain from storing.
