---
name: hivemind-configure
description: Show or configure Hivemind API URL and local agent-id persistence behavior.
argument-hint: "[optional API URL]"
allowed-tools: [Bash]
---

# Hivemind Configure Command

The user invoked this command with: `$ARGUMENTS`

## Instructions

1. Determine active API URL:
   - `HIVEMIND_API_URL` if set
   - otherwise default to `https://hivemind.flowercomputer.com`
2. Check whether an agent ID exists at `~/.config/hivemind/.saved-ids`.
3. Report current configuration clearly:
   - Active API URL
   - Agent ID presence (print value only if user asked)
4. If a URL argument was provided:
   - Validate it starts with `http://` or `https://`.
   - Ask the user whether to set it for current shell only or persist in shell profile.
   - Provide exact export command(s) based on user choice.

## Notes

- Do not write to shell profile files automatically unless the user explicitly asks.
- Keep recommendations compatible with zsh.
