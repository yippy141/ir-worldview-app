# v15 Paste-Ready Coding Agent Prompts

Use one prompt at a time. Do not paste the entire file into a coding agent. Each sprint should be its own conversation or task.

## General rule for every prompt

After the agent replies with a plan, read the allowed-file list. If it wants to edit scoring, payloads, taxonomy, or module schema when the prompt did not ask for that, stop and reject the plan.

---

# Prompt 0 — Baseline inspection only

```text
You are working on the IR Worldview Inventory repo.

Before changing code, inspect the current branch and summarize:
1. current git branch;
2. whether the working tree is clean;
3. whether .github/workflows/ci.yml exists;
4. current npm scripts in package.json;
5. current result-related files for Foundation, AI Governance, Profile, and Compare.

Do not change code. Do not run destructive commands. Report only what you found and the safest next step.
```

---

# Prompt 1 — Add CI

```text
You are a senior Next.js engineer adding CI to this repo.

Goal: create .github/workflows/ci.yml so GitHub verifies lint, tests, typecheck, and production build.

Allowed files:
- .github/workflows/ci.yml

Do not edit app code, scoring, payloads, package.json, tests, or configuration unless the repo cannot run the existing scripts.

Use Node 22. Use npm ci. Run:
- npm run lint
- npm run test
- npx tsc --noEmit
- npm run build

After editing, run the local checks if possible and summarize the result.
```

---

# Prompt 2 — Update AGENTS for v15

```text
You are updating the repo instructions for the v15 sprint.

Goal: edit only the current sprint section of AGENTS.md so agents understand v15.

Allowed files:
- AGENTS.md

Replace the v14 current-sprint section with a v15 section:
- v15 is coherence and payoff.
- Results should be verdict-first and plain-English before labels.
- Landing page should frame the product as a scenario-based inventory for geopolitical judgment.
- Do not change scoring, payloads, taxonomy, module schema, or add new modules.
- Do not add Three.js, accounts, or real research-data storage.
- Preserve share-link compatibility.
- Run npm run lint, npm run test, npx tsc --noEmit, and npm run build after meaningful edits.

Do not edit anything else. Run npm run lint only and summarize.
```

---

# Prompt 3 — Landing page coherence pass

```text
You are improving the IR Worldview Inventory landing page.

Goal: make the first screen explain the product clearly and give users three sensible paths:
1. Start the Foundation.
2. Try AI Governance.
3. Explore the field guide.

Product frame:
- This is a scenario-based inventory for geopolitical judgment.
- It gives users a personal briefing on the arguments they trust, tradeoffs they accept, and places their instincts split.
- It is not a personality test, not a diagnosis, and not a claim about a true ideology.

Allowed files:
- app/page.tsx
- components/landing/resume-cta.tsx
- app/globals.css
- lib/site-config.ts only if needed for copy consistency

Forbidden files:
- lib/scoring.ts
- lib/share.ts
- lib/quiz-schema.ts
- lib/modules/**
- lib/ai-governance-*
- tests/** unless you only update a copy snapshot required by an existing test

Requirements:
- Use wider desktop layout, not a narrow single-column page.
- Foundation remains the default route.
- AI Governance is a parallel entry point for AI-policy users, not a disconnected product.
- Explore is educational and useful even if users do not finish a quiz.
- Remove label-first copy like “Find out which IR tradition shapes your instincts.”
- Keep the tone editorial: Economist / Foreign Affairs / policy briefing, not startup landing page.

Before coding, summarize the current page structure and list exact files you will edit. Then implement. After coding run:
- npm run lint
- npm run test
- npx tsc --noEmit
- npm run build

Stop and summarize changed files, route behavior to test, and any rough edges.
```

---

# Prompt 4 — Shared result hero hierarchy

```text
You are improving the shared result hero across IR Foundation and AI Governance.

Goal: make the hero verdict-first. Lead with a plain-English judgment pattern, then show labels/modifiers as metadata.

Allowed files:
- components/results/result-card-hero.tsx
- app/results/[payload]/page.tsx
- app/ai/results/[payload]/page.tsx
- app/globals.css

Forbidden files:
- lib/scoring.ts
- lib/share.ts
- lib/ai-governance-share.ts
- lib/quiz-schema.ts
- lib/modules/**
- payload encode/decode files

Requirements:
- Preserve share-link compatibility.
- Do not change scoring or payloads.
- Keep invalid-result handling working.
- Modifier chips should be muted metadata, not the dominant result.
- The hero should answer “what is my pattern?” before naming the tradition/archetype.
- AI Governance should use the same hierarchy.
- Keep the component API backward-compatible if practical; otherwise update all call sites safely.

Before coding, inspect current callers of ResultCardHero and explain your plan. After coding run:
- npm run lint
- npm run test
- npx tsc --noEmit
- npm run build

Then summarize changed files and how to manually QA a Foundation result and AI result.
```

---

# Prompt 5 — Foundation payoff sections

```text
You are adding share-link-safe payoff sections to the Foundation result page.

Goal: help users understand “now what?” after seeing their result.

Allowed files:
- app/results/[payload]/page.tsx
- components/results/foundation-payoff-sections.tsx
- lib/results/foundation-payoff.ts
- app/globals.css
- tests/foundation-result.test.mts or a new small test if helper logic needs one

Forbidden files:
- lib/scoring.ts
- lib/share.ts
- lib/quiz-schema.ts
- payload formats
- module schemas

Requirements:
- Create a helper that derives payoff copy only from decoded payload/canonical result data: dimension scores, family, runner-up, strategy modifier, normative modifier.
- Do not depend on raw answers or localStorage.
- Add sections:
  1. Your core pattern.
  2. Your main tension.
  3. How this changes your reading of live debates.
  4. What to pressure-test next.
- Keep copy short and concrete.
- Avoid jargon unless defined.
- Do not make claims about current facts or live news.
- Put these sections above long glossary/reading/evidence material.

Before coding, show the data inputs you will use and explain why this is share-link safe. After coding run:
- npm run lint
- npm run test
- npx tsc --noEmit
- npm run build

Then summarize three manually testable result cases: clearly realist, clearly institutionalist, and mixed/low-differentiation.
```

---

# Prompt 6 — AI Governance payoff sections

```text
You are applying the v15 result hierarchy to AI Governance.

Goal: make the AI Governance result feel like a serious standalone policy profile without repeating the label-stack problem.

Allowed files:
- app/ai/results/[payload]/page.tsx
- components/results/ai-governance-profile-sections.tsx
- lib/ai-governance-results-v2.ts
- optionally lib/results/ai-governance-payoff.ts
- optionally components/results/ai-governance-payoff-sections.tsx
- app/globals.css

Forbidden files:
- lib/ai-governance-share.ts
- lib/ai-governance-scoring.ts
- lib/ai-governance-schema.ts
- IR scoring/payload files

Requirements:
- Do not change AI scoring or payloads.
- Use decoded AI payload data only.
- Lead with governing instinct, not archetype + three modifiers.
- Demote clarity/hybrid language so it does not look psychometric.
- Add a short “policy debates you will read differently” section.
- Keep the bridge to IR Foundation as optional depth.
- Shared AI result links must still work.

Before coding, explain how the current AI result is reconstructed from share payload data. After coding run:
- npm run lint
- npm run test
- npx tsc --noEmit
- npm run build

Then summarize manual QA steps for /ai, /ai/quiz, /ai/review, and a shared /ai/results/[payload] link.
```

---

# Prompt 7 — Compare page social payoff

```text
You are improving the Compare page.

Goal: make Compare explain the one argument two profiles would probably have, before showing detailed deltas.

Allowed files:
- app/compare/page.tsx
- components/profile/profile-compare.tsx
- lib/profile-compare.ts
- app/globals.css
- tests/profile-compare.test.mts if helper logic changes

Forbidden files:
- profile-share encode/decode formats
- scoring files
- Foundation/AI/module payload formats

Requirements:
- Keep Compare backend-free.
- Keep accepting full shared-profile links or payload strings.
- Do not add a compatibility score.
- Add a top card titled “The argument you would probably have.”
- Use existing biggest-difference logic where possible.
- Translate the disagreement into plain English: what one side starts from, what the other starts from, and what kind of case would expose the split.
- Keep detailed comparison below.

Before coding, inspect current ProfileCompare and profile-compare helper. After coding run:
- npm run lint
- npm run test
- npx tsc --noEmit
- npm run build

Then summarize how to manually test with two profile share links.
```

---

# Prompt 8 — Profile loading and empty state

```text
You are improving Profile page loading and no-data states.

Goal: make Profile feel intentional even before local browser data exists.

Allowed files:
- components/profile/profile-dashboard.tsx
- app/globals.css

Forbidden files:
- profile-store logic unless there is a visible bug
- profile-share encode/decode
- scoring/payload files

Requirements:
- Loading state should explain that Profile loads from this browser.
- Empty state should explain that Profile builds as results are completed.
- Include clear buttons: Start the Foundation, Try AI Governance, Browse the field guide.
- Do not imply account creation or backend storage.
- Keep mobile clean.

After coding run:
- npm run lint
- npm run test
- npx tsc --noEmit
- npm run build

Then summarize manual QA for first-time profile state and saved-profile state.
```

---

# Prompt 9 — Research opt-in copy only

```text
You are tightening research opt-in copy only.

Goal: make privacy/data language precise and trustworthy while keeping storage inactive.

Allowed files:
- components/research/research-opt-in.tsx
- app/globals.css only if needed for layout
- app/privacy/page.tsx only if a privacy route already exists or the current link is broken and needs a static note

Forbidden files:
- API routes
- database code
- analytics vendors
- scoring/payload files
- localStorage/profile-store files

Requirements:
- Do not activate real data storage.
- Say users can use, save, and share results without contributing data.
- Say current build does not submit answers from this block.
- Use “pseudonymous” or “de-identified,” not “anonymous,” unless the architecture truly guarantees anonymity.
- Include no ads, no sale of profile data, no political targeting.
- Optional contact details must be described as separate from answer data.

After coding run:
- npm run lint
- npm run test
- npx tsc --noEmit
- npm run build

Then summarize changed copy and confirm no API/storage code was added.
```

---

# Prompt 10 — Final v15 review before PR

```text
Do not change code yet.

Review the v15 branch for release readiness. Inspect the diff against feature/v14-prelaunch-payoff and report:
1. files changed;
2. whether any forbidden files changed;
3. whether scoring or payload compatibility was touched;
4. whether result pages are still share-link safe;
5. whether landing, Foundation result, AI result, Compare, Profile, and Research opt-in meet the v15 goals;
6. which commands still need to be run;
7. any high-risk issues before opening a PR.

Do not edit code. Report only.
```
