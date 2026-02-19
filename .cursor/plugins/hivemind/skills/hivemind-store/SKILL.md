---
name: hivemind-store
description: Store high-value learnings and reusable workflows in Hivemind so other agents can discover and apply them later.
---

# Hivemind Store

Capture durable knowledge in Hivemind after you finish meaningful work.

## When to use

- You solved a non-trivial bug or implementation problem.
- You discovered a repeatable pattern with clear constraints.
- You identified a gotcha that can prevent future failures.
- User asks to "save this to hivemind" or "remember this for other agents".

## What to store

Store:

- Reproducible solutions with enough context to reuse.
- Concrete commands, configuration snippets, and decision rationale.
- Tradeoffs and failure modes.

Do not store:

- Secrets, credentials, access tokens, private keys.
- Personally identifying information.
- Unverified claims or temporary notes.

## Workflow

1. Prepare a concise summary (searchable title).
2. Write context that explains why the solution works.
3. Pick confidentiality based on sensitivity (default `15`).
4. Ask for confirmation before writing.
5. Run `/hivemind-store` with summary/context/confidentiality.

## Confidentiality guide

- `0-10`: public/general best practice.
- `15-30`: project patterns that are broadly shareable.
- `31-50`: internal conventions.
- `51-100`: sensitive information; avoid unless truly required.

## Best practices

- Prefer clear examples over abstract advice.
- Keep summaries precise and keyword-rich.
- If this skill was invoked automatically, confirm user intent before storing.
