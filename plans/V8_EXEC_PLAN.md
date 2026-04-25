# V8.1 Execution Plan

## Sprint Goal

V8.1 is a coherence, payoff, and trust cleanup sprint. The aim is to make the
existing product easier to understand and easier to trust without expanding the
model underneath it.

The user should understand the product as one connected sequence:

1. Foundation establishes the shared IR baseline.
2. Modules pressure-test that baseline in focus areas.
3. AI Governance is a related domain overlay, not a separate product.
4. Profile is the accumulated home for completed layers.

The sprint should improve first-screen payoff, clarify transitions between
layers, humanize surface copy, and reduce clutter. It should not add live
modules, rewrite scoring, or make the instrument look more precise than it is.

## Product Guardrails

- Keep the product editorial, reflective, and policy-literate.
- Prioritize clarity over cleverness and payoff before caveat.
- Treat labels as interpretive summaries of continuous profiles, not fixed
  identities.
- Keep trust notes compact and below the main payoff, not in heroes.
- Avoid fake precision, population-percentile language, and confidence claims
  not supported by the methodology.
- Keep navigation reversible. Do not auto-advance answers. Preserve review
  before results.
- Frame under-modeled traditions honestly. Do not add new scored worldview
  families without item coverage.

## Technical Guardrails

- No scoring rewrite.
- No payload-format rewrite unless a blocker requires the smallest possible
  fix.
- No new live modules.
- No broad question-bank rewrite.
- No new dependencies.
- Do not edit `tmp/` files or import from temporary artifacts.
- Keep slug definitions and encode/decode logic centralized.
- Prefer typed config and existing helpers over new scattered string literals.
- Make the smallest coherent diff for each implementation prompt.

## Execution Order

1. Preflight functional/trust check
   - Confirm share/result links survive refresh and copy/paste.
   - Confirm compare/profile share parsing still works.
   - Confirm key dynamic routes open correctly.
   - Confirm app code does not import from `tmp/`.
   - Fix only blocker issues.

2. Prompt 0: planning and guardrails
   - Maintain this single plan document.
   - Do not change app code.

3. Prompt 1: homepage and linkage consolidation
   - Keep one obvious primary start path: the IR Foundation.
   - Show one conditional resume action only when a draft exists.
   - Make Foundation -> Modules -> AI -> Profile legible.
   - Reuse or simplify existing bridge/path explanation UI.
   - Avoid adding a duplicate explanatory strip.

4. Prompt 3: Profile and result-page payoff compression
   - Move the first-screen experience toward baseline, biggest shift, what
     stayed steady, unresolved tension, completed layers, and one next step.
   - Move dense explanation lower.
   - Do not invent a master score.
   - Demote AI clarity score if it over-signals precision.

5. Prompt 4A: surface copy humanization
   - Edit homepage, Foundation intro, module landing surfaces, result tops, AI
     result tops, and Profile top surfaces.
   - Keep the voice closer to Foreign Affairs or Lawfare than SaaS copy.
   - Avoid “discover,” “unlock,” “journey,” “reveal,” and “explore your.”
   - Do not edit question stems, answer options, schema IDs, or scoring
     semantics.

6. Prompt 5: compact result-page trust and coverage note
   - Add compact trust/coverage notes to IR and AI result pages.
   - Place notes below the first payoff.
   - Link to Methods for fuller explanation.
   - Keep the note explanatory, not apologetic.

7. Prompt 6: repo and public-packaging trust cleanup
   - Remove obvious committed backup/temp artifacts only if they are not needed
     by the app.
   - Ensure no app imports point into `tmp/`.
   - Update ignore rules only for true non-source artifacts.
   - Update README opening copy only if it no longer matches the current
     product shape.

8. Prompt 7: final friend-beta QA pass
   - Fix friend-beta blockers only: broken share links, dead-end navigation,
     non-responsive primary cards, duplicated CTA language, placeholder copy,
     contradictions across home/modules/AI/profile/method, or duplicated
     explanation UI.
   - Do not redesign again.

9. Optional Prompt 4B: limited question wording patch
   - Run only if specific high-friction questions are named after manual review.
   - Preserve IDs, polarity, scoring behavior, and meaning.
   - No broad bank rewrite.

10. Mini beta
   - Send a stable preview to 3-5 people.
   - Collect notes on comprehension, trust, dead ends, and whether Profile feels
     like the natural accumulated home.

## Likely Touch Zones

- Homepage and lobby surfaces.
- Shared layout/navigation surfaces.
- Foundation intro and review-adjacent copy.
- Modules landing and transition copy.
- AI landing, AI result top, and AI-to-Profile bridge copy.
- Profile top-level presentation.
- IR and AI result-page top sections.
- Compact trust/coverage note components or local result-page blocks.
- README and ignore files only if Prompt 6 confirms they are stale or leaky.

## Things To Avoid

- New live module routes or clickable module experiences.
- New duplicate bridge/path/explainer components.
- More same-weight cards when hierarchy would be clearer.
- Decorative charts or visuals that imply stronger measurement than the model
  supports.
- Copy that markets the tool as a personality test or AI demo.
- Nationality, citizenship, or culture as scoring adjustments.
- Treating AI Governance as a standalone product when linking it from the main
  IR worldview path.

## Manual QA Checklist

- Homepage has one obvious start path.
- Resume appears only when a draft exists.
- Foundation feels complete on its own.
- Modules and AI feel optional but meaningful.
- Profile clearly reads as the place where layers accumulate.
- Result pages answer “so what?” before methods caveats.
- Trust/coverage notes are compact and below the first payoff.
- Share links, profile share links, compare links, and direct result URLs work.
- Dynamic routes for results, modules, AI results, Profile share, compare,
  explore pages, and atlas pages open correctly.
- No visible copy contradicts the product shape across home, modules, AI,
  Profile, Method, and result pages.
- No app code imports from `tmp/`.

## Verification Standard

After each meaningful implementation prompt, run:

- `npm run lint`
- `npm run test`
- `npm run build`

Stop and summarize if any command fails. Planning-only updates do not require
the full verification run.

## Commit Rhythm

Commit after each successful implementation step with a clear message. Keep
planning, functional fixes, UI/linkage changes, copy passes, trust notes, and
repo cleanup in separate commits when practical.
