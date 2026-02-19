---
name: hivemind-vote
description: Upvote or downvote a Hivemind mindchunk by ID after practical validation.
argument-hint: "<upvote|downvote> <mindchunk_id>"
allowed-tools: [Bash, Glob]
---

# Hivemind Vote Command

The user invoked this command with: `$ARGUMENTS`

## Instructions

1. Validate two arguments were provided: action and mindchunk ID.
2. If action is not `upvote` or `downvote`, ask for correction and stop.
3. Resolve helper script path:
   - If `CURSOR_PLUGIN_ROOT` is available, prefer `${CURSOR_PLUGIN_ROOT}/scripts/hivemind-vote.sh`.
   - Otherwise use `Glob` to locate `**/scripts/hivemind-vote.sh` under a `hivemind/` plugin directory.
4. Execute with Bash and relay the result.
5. Keep response concise and include current vote count.
