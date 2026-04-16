# AGENTS.md

You are working on the **IR Worldview Inventory**.

This is not a startup-dashboard app. It should feel like a serious, editorial, intellectually honest interactive: closer to **Foreign Affairs / Economist / policy-journal interactive** than to a SaaS tool or AI demo.

## Product principles

1. **Clarity over cleverness**
   - No fake precision.
   - No "confidence" language unless it is methodologically justified.
   - No decorative charts that imply more rigor than the model has.

2. **Editorial, not vibe-coded**
   - Fewer repeated cards/panels.
   - Strong typography and spacing hierarchy.
   - Calm, deliberate interactions.
   - Avoid gradients, neon, glassmorphism, oversized shadows, dashboard tropes.

3. **Rigorous but legible**
   - Results should explain "so what" in plain English.
   - Jargon must be defined.
   - Methods must be transparent about limitations.
   - The app should openly distinguish between modeled traditions and unmodeled/under-modeled traditions.

4. **Continuous profile, not essentialist box**
   - The quiz can output named profile families and modifiers.
   - The site must explain that these are interpretive summaries of a multidimensional profile, not natural kinds.
   - Composite outcomes should be presented as families of nearby profiles, not absolute identities.

5. **Respect the user's time**
   - Navigation must always be reversible.
   - Answer selection must never auto-advance.
   - Review before results is required.
   - Resume flow should be supported when a draft exists.

## Current priorities

### P0 — Fix broken functionality immediately
- Fix share-payload encoding/decoding so generated result URLs always open correctly.
- Fix `/explore/[slug]` dynamic pages so linked perspectives do not 404.
- Remove any stale or mismatched slug/key naming between route params, family keys, and links.
- Make result generation canonical through `/results/[payload]`; no inline fallback result rendering on `/quiz`.

### P1 — Improve decision quality of the quiz
- Reduce the "safe middle option" problem in scenario items.
- Clarify confusing prompts with optional, neutral explainers.
- Keep wording balanced and non-priming.

### P2 — Improve product depth
- Expand Explore into a true field guide:
  - modeled worldview families
  - strategy modifiers
  - normative modifiers
  - example composite profiles
  - coverage gaps / traditions not yet fully modeled
- Add share UX:
  - copy link
  - native Web Share API where available
  - print-friendly result page for Save as PDF

### P3 — Visual refinement
- Shift accent palette from green to **mahogany / dark red**, aligned with the brand mark.
- Use restrained gold only as a minor accent if needed.
- Keep paper/off-white background and editorial typography.

## Design system guidance

### Tone
- Serious, polished, policy-journal, bookish, reflective.
- Not playful, gamified, meme-y, or personality-test kitsch.

### Visual direction
- Background: warm off-white / paper.
- Text: near-black or charcoal.
- Accent: mahogany / oxblood / dark red.
- Optional secondary accent: muted brass/gold, sparingly.
- Serif display headings, clean sans-serif body.
- Thin borders, subtle shadows, generous whitespace.
- Prefer sections and dividers over stacking many identical bordered cards.

### Result design
The result page should feel like an article + analysis memo, not a dashboard.

### Explore design
The explore area should not promise that IR worldviews are perfectly typable. It should say plainly:
- the model uses continuous dimensions
- labels are shorthand summaries
- some traditions are only partially represented in the current version

## Methodology guardrails

1. Do not present percentages as population percentiles unless they actually are.
2. Do not add new scored worldview families without corresponding item coverage.
3. Do not use nationality, citizenship, or culture to alter scoring in this phase.
4. It is acceptable to discuss strategic culture or national perspective as editorial context, but not as a scoring adjustment.
5. If a feature would make the tool look more rigorous than it is, avoid it.

## Content guardrails

### Scenario design
Avoid a simple structure where:
- A = extreme hawk
- B = sensible compromise
- C = extreme dove

That format mechanically attracts users to B and weakens discrimination.

Scenario options should instead represent **distinct logics**, not just intensity levels.
Where useful, use a two-step design:
- threshold question first
- implementation question second

### Clarifications
Question clarifications must:
- be collapsed by default
- be short
- explain scope/terms only
- not hint at which answer is more sophisticated

Bad clarification:
> Realists think X, liberals think Y, so consider whether...

Good clarification:
> This asks whether durable rivalry is built into the system or depends more on the issue and relationship involved.

## Technical guardrails

- Centralize encode/decode logic in one shared library.
- Centralize slug definitions in one source of truth.
- Do not duplicate worldview labels/keys across multiple files if avoidable.
- Prefer typed config data over scattered string literals.
- Add graceful invalid-result handling, but fix the generator first.

## Repository rules
- Do not break existing share payloads unless explicitly asked.
- Preserve existing scoring semantics unless explicitly asked.
- Use parallel routes and minimal diffs where possible.
- Run npm run lint after edits.
- Run npm run test and npm run build for milestone prompts.
- Do not run npm run dev unless explicitly asked.
- Prefer fewer, bigger, high-confidence changes.
- Keep IR and AI content globally legible, not just US-policy-legible.

## Expected deliverable quality

When implementing a phase:
- keep diffs coherent
- do not refactor unrelated files without reason
- preserve readability
- leave comments only where they genuinely help future maintenance

When a spec is ambiguous, choose the path that improves:
1. trust
2. clarity
3. maintainability
4. editorial quality

in that order.
