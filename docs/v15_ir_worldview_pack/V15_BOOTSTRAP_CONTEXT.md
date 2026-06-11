# v15 Bootstrap Context for a New AI Chat

You are helping implement **v15 Coherence & Payoff** for the IR Worldview Inventory.

The product is a scenario-based interactive about how users read world politics. It should feel like a serious editorial interactive with a thin social/share layer, closer to Foreign Affairs / The Economist / McKinsey interactive than a personality-test app or AI demo.

## v15 goal

Make the product easier to understand and more rewarding after a result, without changing scoring or payloads.

The main user problem is: users get labels and dimensions, but still ask “cool, now what?” v15 should answer that question.

## Core decisions

- Foundation remains the default broad-audience entry.
- AI Governance Compass remains a visible standalone AI-policy entry point.
- Explore / Atlas are educational surfaces, not separate starting points competing with the inventory.
- Results should lead with a plain-English judgment pattern, then show formal labels as metadata.
- Profile should synthesize saved results without creating a fake master score.
- Compare should identify the argument two users would actually have, not assign compatibility.
- Research opt-in stays inactive; no real storage in v15.
- No new modules, no Three.js, no scoring rewrite, no payload rewrite.

## Must preserve

- Existing share links.
- Canonical Foundation result route `/results/[payload]`.
- AI result route `/ai/results/[payload]`.
- Profile share route `/profile/share/[payload]`.
- Existing tests.
- Local-storage-first privacy posture.

## Main files likely involved

- `AGENTS.md`
- `.github/workflows/ci.yml`
- `app/page.tsx`
- `components/landing/resume-cta.tsx`
- `components/results/result-card-hero.tsx`
- `app/results/[payload]/page.tsx`
- `app/ai/results/[payload]/page.tsx`
- `components/results/ai-governance-profile-sections.tsx`
- `lib/ai-governance-results-v2.ts`
- `app/compare/page.tsx`
- `components/profile/profile-compare.tsx`
- `lib/profile-compare.ts`
- `components/profile/profile-dashboard.tsx`
- `components/research/research-opt-in.tsx`
- `app/globals.css`

Potential new files:

- `lib/results/foundation-payoff.ts`
- `components/results/foundation-payoff-sections.tsx`
- `lib/results/ai-governance-payoff.ts`
- `components/results/ai-governance-payoff-sections.tsx`

## Forbidden unless explicitly requested

- `lib/scoring.ts`
- `lib/share.ts`
- `lib/ai-governance-share.ts`
- `lib/profile-share.ts`
- `lib/quiz-schema.ts`
- `lib/modules/**`
- payload formats
- scoring weights
- new dependencies
- real analytics/storage/API routes

## Verification after meaningful edits

Run:

```bash
npm run lint
npm run test
npx tsc --noEmit
npm run build
```

Manual QA:

- `/`
- `/quiz`
- `/quiz/review`
- `/results/[payload]`
- `/ai`
- `/ai/quiz`
- `/ai/review`
- `/ai/results/[payload]`
- `/profile`
- `/compare`
- `/explore`
- `/method`
- `/references`
- `/feedback`

## Tone rules

Avoid AI-coded abstractions. Use concrete language. A result should answer:

- What line of argument do I trust more?
- Where am I mixed?
- What changed my result?
- What should I not overread?
- What should I pressure-test next?
