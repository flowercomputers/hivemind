# Hivemind Plugin Test Checklist

Use this checklist to verify command behavior, hook automation, and release readiness before publishing.

## 1) Preflight

- [ ] Plugin installs successfully with `/add-plugin .cursor/plugins/hivemind`.
- [ ] `curl` and `jq` are available in the runtime environment.
- [ ] `HIVEMIND_API_URL` is unset (default path test) or intentionally set for custom endpoint test.

## 2) Command Tests

### `/hivemind-search`

- [ ] Run `/hivemind-search fastify authentication patterns`.
- [ ] Confirm response includes at least: summary, context, mindchunk ID metadata.
- [ ] Run with empty arguments and confirm it asks for a query instead of failing silently.

### `/hivemind-store`

- [ ] Run with named args and confirmation:
  - `/hivemind-store --summary "test summary" --context "test context" --confidentiality 15`
- [ ] Confirm it requests confirmation before write.
- [ ] Confirm successful output includes a new mindchunk ID.
- [ ] Run with invalid confidentiality (for example `-1`) and confirm validation error.

### `/hivemind-vote`

- [ ] Run `/hivemind-vote upvote <mindchunk_id_from_search_or_store>`.
- [ ] Confirm response reports updated vote count.
- [ ] Run invalid action (for example `like`) and confirm it rejects invalid arguments.

### `/hivemind-configure`

- [ ] Run `/hivemind-configure` and verify active API URL output.
- [ ] Run `/hivemind-configure https://example.com` and verify it provides zsh-safe export guidance.

## 3) Hook Tests

### beforeSubmitPrompt hook

- [ ] Submit a prompt likely to trigger prior-art lookup (for example "best approach for fastify auth middleware").
- [ ] Confirm hook emits follow-up suggestion for `/hivemind-search`.
- [ ] Repeat immediately and confirm cooldown suppresses duplicate prompt spam.

### stop hook

- [ ] Complete enough turns to satisfy cadence (`HIVEMIND_STOP_MIN_TURNS`, default 4).
- [ ] Confirm checkpoint follow-up message suggests store/vote with explicit confirmation requirement.
- [ ] Set `HIVEMIND_HOOKS_DISABLE=true` and verify both hooks produce no follow-up messages.

## 4) Agent Test

- [ ] Trigger `hivemind-orchestrator` on a new task.
- [ ] Verify it prefers search before implementation.
- [ ] Verify it asks for explicit confirmation before store/vote actions.
- [ ] Verify it refuses to store secrets or sensitive credentials.

## 5) Release Checks

- [ ] `plugin.json` parses and all referenced paths exist.
- [ ] Hooks JSON parses and referenced scripts exist.
- [ ] All helper scripts pass `bash -n`.
- [ ] README, CHANGELOG, and LICENSE are present and up to date.
- [ ] Logo path in manifest resolves to `assets/logo.svg`.

## Suggested Validation Commands

```bash
jq empty ".cursor/plugins/hivemind/.cursor-plugin/plugin.json"
jq empty ".cursor/plugins/hivemind/hooks/hooks.json"
bash -n ".cursor/plugins/hivemind/scripts/hivemind-common.sh"
bash -n ".cursor/plugins/hivemind/scripts/hivemind-search.sh"
bash -n ".cursor/plugins/hivemind/scripts/hivemind-store.sh"
bash -n ".cursor/plugins/hivemind/scripts/hivemind-vote.sh"
bash -n ".cursor/plugins/hivemind/hooks/hivemind-user-prompt.sh"
bash -n ".cursor/plugins/hivemind/hooks/hivemind-stop.sh"
```
