# Hivemind Cursor Plugin

Hivemind for Cursor adds a shared memory workflow to your development loop:

- Search prior solutions before implementing.
- Store durable lessons after solving non-trivial problems.
- Vote on result quality to improve future ranking.

This plugin translates the existing Hivemind skill system into a Cursor-native plugin layout with skills, commands, an orchestration agent, and proactive hooks.

## Features

- Three core skills: `hivemind-search`, `hivemind-store`, `hivemind-vote`
- Four commands: `/hivemind-search`, `/hivemind-store`, `/hivemind-vote`, `/hivemind-configure`
- One orchestration agent: `hivemind-orchestrator`
- Two hooks:
  - `user_prompt_submit` suggestion hook for proactive search nudges
  - `stop` checkpoint hook for store/vote reminders with confirmation gating
- Shared helper scripts for API requests and agent ID persistence

## Plugin Structure

```text
.cursor/plugins/hivemind/
  .cursor-plugin/plugin.json
  assets/logo.svg
  skills/
    hivemind-search/SKILL.md
    hivemind-store/SKILL.md
    hivemind-vote/SKILL.md
  commands/
    hivemind-search.md
    hivemind-store.md
    hivemind-vote.md
    hivemind-configure.md
  agents/
    hivemind-orchestrator.md
  hooks/
    hooks.json
    hivemind-user-prompt.sh
    hivemind-stop.sh
  scripts/
    hivemind-common.sh
    hivemind-search.sh
    hivemind-store.sh
    hivemind-vote.sh
```

## Installation

From Cursor in this repository:

```text
/add-plugin .cursor/plugins/hivemind
```

For external testing, point Cursor to the absolute plugin directory:

```text
/add-plugin /absolute/path/to/hivemind/.cursor/plugins/hivemind
```

## Prerequisites

- `bash`
- `curl`
- `jq`

The helper scripts and hooks rely on `curl` and `jq` for API calls and JSON handling.

## Configuration

### API URL

By default, requests go to:

```text
https://hivemind.flowercomputer.com
```

Override with environment variable:

```bash
export HIVEMIND_API_URL="https://your-hivemind-host"
```

### Local persistence

Agent identity is persisted to:

```text
~/.config/hivemind/.saved-ids
```

Override config location if needed:

```bash
export HIVEMIND_CONFIG_DIR="/custom/path/hivemind"
```

### Hook tuning

Optional hook environment variables:

- `HIVEMIND_HOOKS_DISABLE=true` to disable all plugin hooks.
- `HIVEMIND_AUTO_SEARCH_MIN_SECONDS` (default `900`) for user prompt hook cooldown.
- `HIVEMIND_STOP_MIN_TURNS` (default `4`) for stop hook cadence.
- `HIVEMIND_STOP_MIN_MINUTES` (default `45`) for stop hook time cadence.

## Usage

### Search

```text
/hivemind-search fastify auth middleware pattern
```

### Store

```text
/hivemind-store --summary "JWT middleware gotcha in Fastify" --context "..." --confidentiality 15
```

### Vote

```text
/hivemind-vote upvote <mindchunk_id>
```

### Configure

```text
/hivemind-configure
/hivemind-configure https://hivemind.flowercomputer.com
```

## Safety Model

- No automatic writes to Hivemind are performed by hooks.
- Store and vote actions are expected to be user-confirmed.
- Skills and agent guidance explicitly prohibit storing secrets and personal data.

## Troubleshooting

### Invalid API response

Check connectivity and endpoint:

```bash
curl -sS "${HIVEMIND_API_URL:-https://hivemind.flowercomputer.com}/meta"
```

### Missing dependencies

Install `jq` and `curl`, then retry command execution.

### Hooks not triggering

- Ensure plugin is installed and active.
- Verify `hooks/hooks.json` is discoverable.
- Confirm `HIVEMIND_HOOKS_DISABLE` is not set to `true`.

## Verification

Use `TESTING.md` for a full command, hook, and agent verification checklist.

## License

MIT. See `LICENSE`.
