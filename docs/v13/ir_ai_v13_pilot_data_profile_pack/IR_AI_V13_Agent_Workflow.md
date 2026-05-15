# V13 agent workflow

## Best split
Use Claude Code for:
- Profile payoff layout
- AI Atlas visual/detail polish
- final responsive visual pass

Use Codex for:
- audit files
- method/scoring consistency cleanup
- question hardening audit
- privacy copy / data routes
- release hygiene

## Why this split
Claude Code tends to do better on visual hierarchy and layout translation when you give it a clear design direction. Codex tends to be reliable for structural edits, route handlers, tests, docs, and careful repo hygiene.

## Agent safety rules
- One agent at a time.
- One prompt at a time.
- Commit after each prompt.
- No broad rewrites.
- No scoring changes unless the prompt explicitly says so.
- Agents must read `plans/V13_SOURCE_OF_TRUTH.md` before changes.

## AGENTS.md patch
Add or merge this into AGENTS.md. Do not duplicate contradictory older instructions.

```md
## V13 sprint rules
- Current sprint: V13 pilotable Profile + privacy-first research layer.
- Preserve product lane: serious editorial interactive, not dashboard, not MBTI, not validated psychometric instrument.
- Preserve nouns: Foundation, Modules, AI Governance, Profile, Atlas, Field Guide.
- Do not add new scored IR families, AI archetypes, or live modules.
- Do not change scoring unless the prompt explicitly requests it.
- Profile should prioritize payoff and truthfulness over completeness.
- Raw worldview answers must not be sent to third-party analytics.
- Research response storage must be explicit opt-in and pseudonymous, not called anonymous.
- Run npm run lint and npm run test after app-code changes.
```
