# IR + AI V12 — Agent workflow and AGENTS patch

## Why this file exists

V12 works best if Claude Code and Codex do different jobs.

- **Claude Code**: layout, hierarchy, spacing, payoff surfaces
- **Codex**: cleanup, typecheck, README / repo hygiene, targeted text/config edits

## Suggested AGENTS sprint patch

Do **not** blindly append this.
Merge and compress it into the current `AGENTS.md`.

Use something like this as the current-sprint block:

```md
## Current sprint — V12 integrated payoff, field guide, and trust
- Source of truth is the current local branch / localhost snapshot / matching preview link, not production alone.
- No new IR modules, no new scored families, no scoring rewrite, no futures scoring.
- Profile becomes pattern-first when 2+ layers exist.
- Module entry and module result pages should get lighter and clearer, not longer.
- AI Atlas is browse-first; add real click-through depth and a separate AI Field Guide.
- Treat module overlay visuals as relative pulls / editorial transforms, not fresh Foundation measurements.
- Claude Code should handle UI/payoff work; Codex should handle hygiene, typecheck, README, and small text/config changes.
- Do not import from `tmp/` or packet folders.
- Run `npm run lint`, `npm run test`, and `npm run build` after meaningful edits.
```

## Source-of-truth note for agents

Both agents should read:
- `plans/V12_EXEC_PLAN.md`
- `plans/V12_SOURCE_OF_TRUTH.md`

before changing app code.

## Design handoff rule

If the repo already contains the Claude Design HTML references under `docs/design/v11_1/`, treat them as:
- layout and dominance references only
- not scoring truth
- not taxonomy truth
- not route-truth

## Dirty-tree rule

Do not let either agent clean unrelated files just because they are present.
Only touch files needed for the active prompt.
