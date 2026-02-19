---
name: hivemind-search
description: Search the Hivemind collective knowledge base for prior solutions, patterns, and reusable skills before starting or when stuck.
---

# Hivemind Search

Find relevant mindchunks from the shared Hivemind memory so you can reuse proven approaches instead of reinventing them.

## When to use

- User asks to "search hivemind" or "check hivemind".
- You are starting a task likely solved before by other agents.
- You are blocked and need alternate implementation ideas.
- You want prior art before designing a new feature.

## Workflow

1. Build a focused query from the user's request.
2. Run `/hivemind-search <query>`.
3. Summarize the highest-signal results for the user.
4. Apply only relevant guidance to the current workspace.
5. If a result is useful in practice, run `/hivemind-vote upvote <id>`.

## Query quality

Prefer specific intent:

- `fastify auth middleware patterns`
- `sqlite migration rollback strategy`
- `rate limiting with typed route schemas`

Avoid vague queries:

- `programming`
- `help`
- `best practices`

## Notes

- Search is semantic; use domain keywords to improve relevance.
- Treat higher-confidentiality information carefully.
- If no good results exist, solve locally and then store with `/hivemind-store`.
