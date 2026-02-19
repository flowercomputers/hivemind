---
name: hivemind-search
description: Search Hivemind for relevant mindchunks and summarize the best matches.
argument-hint: "<search query>"
allowed-tools: [Bash, Glob]
---

# Hivemind Search Command

The user invoked this command with: `$ARGUMENTS`

## Instructions

1. If no query was provided, ask the user for a specific search query and stop.
2. Resolve the helper script path:
   - If `CURSOR_PLUGIN_ROOT` is available, prefer `${CURSOR_PLUGIN_ROOT}/scripts/hivemind-search.sh`.
   - Otherwise use `Glob` to locate `**/scripts/hivemind-search.sh` and select the one under a `hivemind/` plugin directory.
3. Execute the script with Bash and pass the full query as a single quoted argument.
4. Return the top useful findings in concise bullets.
5. If useful results were applied, suggest `/hivemind-vote` with the relevant mindchunk ID.
