# v15 Coherence & Payoff Pack

**Project:** IR Worldview Inventory  
**Target branch:** `feature/v14-prelaunch-payoff` → new branch `feature/v15-coherence-payoff`  
**Theme:** make the product easier to understand, harder to dismiss, and more rewarding after a result.

## What v15 is for

v15 is not a new methodology phase. It is a product-coherence and payoff release. The user should understand the product faster, get a result that reads like a briefing rather than a taxonomy dump, and have a clearer next click.

The release has five user-facing goals:

1. **Clarify the front door.** The product is a scenario-based inventory for geopolitical judgment, not a personality test or a loose collection of quizzes.
2. **Make results verdict-first.** Lead with the user's judgment pattern, not a stack of labels.
3. **Add “so what” payoff.** Show how the result changes how a user reads current events, history, and future policy debates.
4. **Improve comparison and profile loops.** The social layer should explain the argument two people would actually have, not just show numeric deltas.
5. **Keep trust intact.** No fake precision, no hidden data storage, no scoring/payload rewrites unless explicitly handled as a separate migration.

## What v15 is not

Do not add new focus-area modules.  
Do not add Three.js.  
Do not add real response-data storage yet.  
Do not rebuild scoring.  
Do not change share payload formats in the main v15 pass.  
Do not turn Profile into one master score.  
Do not make the result page look more rigorous than the instrument can support.

## Recommended implementation order

1. Add CI and branch-protection workflow.
2. Update sprint instructions in `AGENTS.md`.
3. Rewrite the landing page around a single promise.
4. Redesign the shared result hero so labels are secondary.
5. Add Foundation payoff sections.
6. Apply the same result hierarchy to AI Governance.
7. Reframe Compare around one sharp disagreement.
8. Improve Profile loading/empty states and next-clicks.
9. Tighten research opt-in copy while keeping storage inactive.
10. Run full QA, then a small user test.

## Files in this pack

- `V15_NOVICE_IMPLEMENTATION_GUIDE.md` — step-by-step walkthrough with commands and explanations.
- `V15_CODING_AGENT_PROMPTS.md` — paste-ready prompts for Codex / Claude Code / VS Code agents.
- `V15_ACCEPTANCE_CHECKLIST.md` — what to verify before merging.
- `V15_COPY_BANK.md` — suggested landing, result, Profile, Compare, and privacy copy.
- `V15_CLAUDE_DESIGN_BRIEF.md` — token-efficient Claude Design brief.
- `V15_RED_TEAM_PROMPT.md` — final review prompt after implementation.
- `V15_DECISION_RECORD.md` — decisions and tradeoffs for this release.
- `ci.yml` — GitHub Actions workflow to add at `.github/workflows/ci.yml`.

## The main discipline

Implement v15 as small branches or small commits. After each sprint, run:

```bash
npm run lint
npm run test
npx tsc --noEmit
npm run build
```

If any command fails, stop and fix that before asking the next agent to continue.
