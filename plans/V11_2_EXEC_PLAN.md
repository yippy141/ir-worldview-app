# V11.2 execution plan — design-to-code pass

## Audit basis

Read before this plan:
- `AGENTS.md`
- `plans/V11_1_SELECTED_DIRECTIONS.md`
- `plans/V11_1_DESIGN_BRIEF.md`
- existing `plans/V11_1_EXEC_PLAN.md`
- `tmp/v11-1-pack/ir_ai_v11_1_claude_first_pack/*`
- `docs/design/v11_1/Claude Design IR Worldviews Designs/*`
- current app files for Profile, AI Atlas, AI result navigation, visual primitives, AI taxonomy/content, and global CSS

Note: `docs/design/v11_1/*.html` has no top-level HTML files; the HTML mockups are under `docs/design/v11_1/Claude Design IR Worldviews Designs/`.

## Source of truth rule

Mockups are visual references only. The mockup taxonomy is not source of truth.

Implementation must preserve the current app taxonomy and axis model from:
- `lib/ai-governance-types.ts`
- `lib/ai-governance-schema.ts`
- `lib/ai-governance-scoring.ts`
- `lib/ai-governance-atlas-content.ts`
- `lib/ai-governance-results.ts`
- `lib/ai-governance-results-v2.ts`

Important drift to guard against:
- Mockups/handoff mention archetypes such as `Civic Risk Steward`, `Industrial Statist`, and `Multilateral Coordinator`; the current app source of truth uses `Precautionary Steward`, `Strategic Competitor`, `Coordination Architect`, `Democratic Guardrailist`, `State Capacity Builder`, and `Open Ecosystem Builder`.
- Mockups/handoff mention an alternate eight-axis vocabulary; the current app source of truth uses `Risk horizon`, `Deployment pace`, `Public oversight`, `Competition vs coordination`, `Openness vs control`, `Military role`, `Legitimacy and rule-setting`, and `Human future`.

## Current branch / drift note

- Current branch: `feature/v11-1-profile-payoff`
- Current commit: `909fc4c`
- Working tree already has unrelated design-file movement: deleted files under `plans/Claude Design IR Worldviews Designs/`, deleted `plans/V11_1_SOURCE_OF_TRUTH.md`, and untracked `docs/design/`.
- Do not revert or reorganize those existing changes during implementation.

## Current Profile above-the-fold blocks

Current `/profile` top screen in `components/profile/profile-report.tsx`:
- `profile-hero--compact`: keep the editorial opener, but refactor hierarchy.
- Headline and summary: keep, tighten to payoff-first language.
- `profile-layer-strip`: keep or demote into compact saved-layer metadata.
- `actionSlot`: keep, but avoid competing with the chart.
- `profile-payoff-grid`: refactor from six co-equal payoff items to at most three compact fact chips.
- Current repeated facts: demote or remove above the fold. `Stable thread`, `Pressure shifts`, `Reasoning style`, `Continuities`, `Tensions`, and `Reasoning style` repeat below the hero and should not compete before the main chart.
- `ProfileSpine` / comparison rows currently sit below Layer relationships; promote/refactor into the dominant above-fold visual.
- `LayerRelationshipStack`: keep, but place below the dominant visual.
- AI layer: keep as related-layer context; demote to a thin ruled band or concise CTA, not a separate heavyweight section above the fold.
- Appendix/details: keep collapsed by default.

## Files to touch

Primary implementation files:
- `components/profile/profile-report.tsx`
- `components/visual-primitives.tsx`
- `app/ai/atlas/page.tsx`
- `app/ai/results/[payload]/page.tsx`
- `app/ai/page.tsx`
- `app/globals.css`

Likely new route:
- `app/ai/field-guide/page.tsx`

Content/config reuse only, no taxonomy edits unless a type-safe helper is needed:
- `lib/ai-governance-atlas-content.ts`
- `lib/ai-governance-schema.ts`
- `lib/ai-governance-results.ts`
- `lib/ai-governance-results-v2.ts`

Optional only if shared helpers are clearly worth it:
- `components/results/ai-governance-profile-sections.tsx`
- `components/results/ai-governance-reading-list-section.tsx`
- `components/ai/ai-project-bridge.tsx`

Plan/documentation files:
- `plans/V11_2_EXEC_PLAN.md`

## Files not to touch

Do not touch:
- `tmp/**`
- `package.json` / lockfiles; no new dependencies
- `AGENTS.md` unless explicitly asked
- scoring and payload code: `lib/scoring.ts`, `lib/ai-governance-scoring.ts`, `lib/share.ts`, `lib/profile-share.ts`, `lib/url-payload.ts`, `lib/ai-governance-share.ts`
- persistence/session code: `lib/profile-store.ts`, `lib/quiz-session.ts`, `lib/result-history.ts`
- quiz/question surfaces: `components/quiz-app.tsx`, `components/ai-governance-quiz-app.tsx`, `components/quiz/*`, `app/quiz/**`, `app/ai/quiz/**`, `app/ai/review/**`
- IR module scoring/content unless a local display import already depends on it: `lib/modules/**`
- unrelated routes: homepage, compare, references, feedback, method, explore detail pages

## Risk notes

- Taxonomy drift risk: design mockups use non-current AI archetype and axis names. Preserve repo source truth and translate only layout patterns.
- Precision risk: mockups show deltas and decimals. Implementation should avoid making deltas feel more precise than the model supports; use qualitative `leans`, `leans heavily`, and `stable` language where possible.
- Scope risk: Field Guide is an explainer route, not a second quiz, second scoring layer, or new ontology.
- Visual grammar risk: existing `ComparisonRow` already has shape markers and collision offsets. Reuse or extend shared primitives before inventing a new chart style.
- Profile synthesis risk: current Profile repeats stable/shift/tension/reasoning concepts in several places. The implementation should reduce repetition rather than restyle all of it.
- Mobile/PDF risk: anchored spread, fingerprints, and rail layouts must not depend on faint backgrounds or color alone.
- Dirty tree risk: design files were moved before this plan. Do not clean up, restore, or re-stage unrelated file movement during implementation.
- CSS risk: `app/globals.css` is large and shared. Keep selectors narrow and remove dead CSS only after `rg` confirms it is unused.

## Exact execution order

1. Baseline audit before app edits
   - Record current `git status --short --branch`.
   - Inspect `/profile`, `/ai`, `/ai/atlas`, one AI result route, and shared primitives.
   - Do not alter app code during this step.

2. Profile payoff surgery
   - In `components/profile/profile-report.tsx`, restructure the top of Profile around Direction 03 Anchored Spread.
   - Keep headline, short summary, max three fact chips, saved-layer metadata, action slot, and next-step CTAs.
   - Promote the overlay/spine read above Layer relationships.
   - Demote duplicated stable/shift/tension/reasoning blocks below the main visual.
   - Keep AI as a concise related-layer band if saved.

3. Anchored spread and comparison primitive cleanup
   - First try to adapt current `ComparisonRow` behavior or add a narrowly scoped profile-local anchored spread component.
   - Touch `components/visual-primitives.tsx` only for reusable marker/legend/collision improvements.
   - Ensure legend meaning uses marker shape, not color alone.
   - Offset near-coincident markers; show missing overlays deliberately.

4. Profile secondary sections
   - Place `LayerRelationshipStack` below the main visual.
   - Collapse evidence-heavy appendix/details by default.
   - Keep links to Foundation, module results, AI result, Atlas, and compare visible but not dominant.

5. Visual grammar pass on touched surfaces only
   - Replace visible legacy `profile-mini-scale` usage in touched Profile/module-summary areas with existing `ScaleBar` or another shared primitive.
   - Do not reopen all result pages globally.

6. AI Atlas browse refactor
   - In `app/ai/atlas/page.tsx`, implement Direction 02 Fingerprint Row as compact browse.
   - Use current six archetypes from `lib/ai-governance-atlas-content.ts`.
   - Cards show name, short definition, nearest neighbor(s), one or two differentiators, and compact fingerprint.
   - Move long reading shelf / critique / comparison depth off browse cards and route to Field Guide.

7. AI Field Guide route
   - Add `app/ai/field-guide/page.tsx`.
   - Reuse existing `aiAtlasAxisGuide`, atlas entries, reading lists, and cross-read content.
   - Implement Direction 02 Two-Column Explainer where desktop uses a rail and mobile stacks sections.
   - Include clear banner: explainer / reading surface only, no scoring, no second assessment.
   - Futures content only if optional, non-scored, and visually demoted.

8. AI result and AI home linkage
   - In `app/ai/results/[payload]/page.tsx`, add concise CTAs to Profile, AI Atlas, and AI Field Guide without changing result logic or payloads.
   - In `app/ai/page.tsx`, make Atlas and Field Guide routes distinct: Atlas is browse, Field Guide is explainer.

9. CSS cleanup for touched surfaces
   - Add or adjust only necessary selectors in `app/globals.css`.
   - Keep editorial typography, ruled rows, restrained cards, no decorative gradients/orbs.
   - Check mobile constraints around 390px and print/PDF basics.

10. Verification
   - Run `npm run lint`.
   - Run `npm run test`.
   - Run `npm run build`.
   - Run one `npx tsc --noEmit` check during cleanup and document scope if it fails.
   - Manually check `/profile`, `/ai`, `/ai/atlas`, `/ai/field-guide`, and one AI result route.

11. Final audit summary
   - List files changed.
   - List any intentionally deferred legacy primitives.
   - Note remaining rough edges for mobile/PDF/export.
   - Note that no scoring, payload, route meaning, quiz, or taxonomy changes were made.
