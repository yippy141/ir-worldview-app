# V13 audit

Audit date: 2026-05-15

Scope read:
- `AGENTS.md`
- `plans/V13_SOURCE_OF_TRUTH.md`
- `docs/v13/ir_ai_v13_pilot_data_profile_pack/*`
- Current Profile, AI Atlas, AI Field Guide, module result, Methods, and scoring files.

No app code was changed in this pass.

## 1. Profile payoff blockers

The Profile surface is already moving in the right V13 direction: it leads layered profiles with the nearest Atlas-style pattern, keeps Foundation visible as the closest modeled baseline, and uses one anchored-spread visual rather than a decorative map. The blocker is not the core direction. The blocker is that the page still asks the user to synthesize too many synthesis layers.

Current blockers:
- The hero has a strong integrated headline, but the summary immediately adds a methods caveat about the chart. That violates the V13 "payoff before caveat" rule. The caveat belongs under or after the visual, not inside the main payoff paragraph.
- Above the fold still contains more than one set of chips/facts: the layer strip, three stat chips, AI band, next-step CTAs, and saved-layer meta line. The V13 target is one headline, one short paragraph, one dominant visual, and max three chips/facts.
- The AI band in the hero competes with the anchored spread. It is useful, but it reads as a second mini-payoff before the user has absorbed the integrated pattern.
- The "Layer relationships" section repeats the Foundation-anchor/module-pull idea already introduced in the hero and anchored spread.
- The "Longer profile interpretation" drawer repeats stable thread, pressure shifts, reasoning style, then appends narrative sections that repeat integrated read, module change, stability/tension, so what, and probe-next logic.
- The Atlas section repeats the nearest pattern already used as the layered hero title.
- The "What to open next" section duplicates CTAs already shown in the hero.
- The "AI layer detail" drawer repeats the AI band and adds alignment/conflict/practical implication blocks.
- The "Issue overlays you've completed" section repeats module result summaries and mini-scales that also appear in module results and the appendix.
- The appendix is properly below the fold and collapsed, but still adds another Foundation/overlay/evidence pass after multiple previous summaries.

Repeated synthesis sections to consolidate:
- Hero integrated Atlas match and anchored spread.
- Layer relationships stack.
- Longer profile interpretation drawer.
- Atlas nearest-pattern feature.
- AI layer band plus AI layer detail drawer.
- Completed overlays summaries.
- Appendix Foundation anchors and module evidence.

## 2. Recommended Profile layout direction

Keep the current anchored-spread direction, but make it more editorial and less dashboard-like.

Recommended V13 layout:
1. Hero payoff:
   - Eyebrow: Profile or Shared profile.
   - H1: integrated Atlas-style pattern when 2+ layers exist; Foundation headline when Foundation-only.
   - One short synthesis paragraph that answers "so what" without caveat language.
   - Up to three facts: closest modeled Foundation baseline, strongest shift, open layer or next probe.
2. Dominant visual:
   - Keep `ProfileAnchoredSpread`.
   - Put the directional-pull caveat in the visual footnote, not the hero paragraph.
   - Keep labels plain: "Foundation anchor", "Security pull", "Technology pull".
3. One visible synthesis block:
   - "What stayed steady"
   - "What shifted"
   - "Open tension"
   This should replace the current repeated stable/shift/reasoning blocks.
4. Next actions:
   - One small row after the synthesis block.
   - Avoid duplicating the same CTAs in hero and lower sections.
5. Below-fold reference:
   - Collapse layer relationships, AI layer detail, completed overlays, and appendix into a smaller "Evidence and saved layers" area.
   - Keep Atlas links, but avoid a second large nearest-pattern feature when the Atlas match already leads the page.

This direction preserves V13 constraints: no scoring changes, no new modules, no decorative constellation, no radar chart, and no payload changes.

## 3. AI Atlas card/detail gaps

What is already working:
- `/ai/atlas` exists as a compact browse surface.
- `/ai/atlas/[id]` exists and uses current archetype keys.
- Detail pages include a definition, wants/worries, compact fingerprint, nearest neighbors, critique, live tension question, international lens, readings, and links back to Atlas/Field Guide/Profile.
- `/ai/field-guide` is clearly marked as an explainer, not a second assessment.

Gaps against V13:
- AI Atlas browse cards have a text CTA, but the full card is not clickable. V13 asks for cards to click into detail pages.
- Detail pages do not yet have a distinct "current debates to watch" rail. The current "live tension" question is useful but not the same as manually curated debates.
- Detail pages do not clearly label "core disagreement" or "result implications" as their own sections.
- `/ai/field-guide` links to `/ai/atlas` generally, but its nearby-split rows do not deep-link specific archetype detail pages.
- The browse page contains both the fingerprint grid and a second "Nearby comparisons" card grid. The comparison grid is useful but makes `/ai/atlas` less shelf-like and partially duplicates detail-page comparison content.
- `lib/ai-governance-atlas-content.ts` has no content field for current debates, so Prompt 3 will need either a small typed field on atlas entries or a local detail-page map. Prefer typed atlas content if the change stays small.

## 4. Module result clutter issues

The module result page is honest and complete, but it is still too dense for a payoff surface.

Clutter issues:
- The first result section includes headline, summary, every lane summary, every lane scale, Foundation deltas, and a challenge callout. It is a lot before the user reaches the actual relation to Foundation.
- "Foundation linkage" adds three more cards: Reinforces, Complicates, Pulls away. This is directionally right, but it repeats the lane deltas and challenge text above.
- "Decisive calls" can show up to six full cases. That is useful evidence, but too large for a primary result path.
- The card-type read, instincts list, scope notes, module profile scale bars, and evidence log all follow as separate sections. Each is defensible alone; together they read like an audit dump.
- The same lane summaries and mini-scales are repeated again inside Profile's completed-overlay summaries.

Recommended later pass:
- Keep module hero as headline + summary + one compact "how it relates to Foundation" block.
- Show only 2-3 decisive signals before the fold, not six.
- Move full lane meters, card-type read, scope notes, and evidence log into collapsed or lower reference sections.
- Keep "directional pull" language, but avoid making module scores feel like re-measured Foundation dimensions.

## 5. Trust and precision inconsistencies for Codex

Second-choice weighting:
- Prompt 2 decision: keep scoring stable and make Methods match the code at 45%.
- `app/method/page.tsx` now says Analyst-mode second choices count at 45%.
- `lib/scoring.ts` uses `SECOND_CHOICE_WEIGHT = 0.45`.
- `lib/modules/framework.ts` uses `SECOND_CHOICE_WEIGHT = 0.45`.
- `lib/ai-governance-scoring.ts` uses `AI_BACKUP_CHOICE_WEIGHT = 0.45`.
- `components/modules/module-result.tsx` uses `0.35` only to rank "Decisive calls"; that is display ranking, not core scoring.

No scoring weights were changed in Prompt 2, so no scoring-version bump was introduced.

AI clarity/settledness:
- Prompt 2 removed the visible AI settledness/clarity labels from `components/results/ai-governance-profile-sections.tsx`.
- `lib/ai-governance-results-v2.ts` now exposes nearby-alternative framing rather than named settledness buckets.
- The AI result section now uses "Closest modeled fit" and "Nearby alternative" language.

Foundation/result wording:
- Prompt 2 renamed the Foundation result callout from "How settled this result is" to "How close the neighboring read is".
- Foundation and AI result pages now use "closest modeled fit" language where appropriate. Preserve and standardize it.

Overlay precision:
- `components/profile/profile-report.tsx` and `app/method/page.tsx` describe overlay visuals as directional/editorial pulls, not fresh scores. Keep that language.
- Move the Profile caveat out of the hero summary and keep it attached to the visual or methods note.

Privacy/data language:
- There is no active first-party research opt-in UI or `app/api/research/*` route yet.
- `app/feedback/page.tsx` says the Google Form is "anonymous by default." That may be acceptable for a generic external feedback form, but V13 raw-answer storage must use "pseudonymous" or "de-identified" and must not imply stored answer history is anonymous.
- No privacy/data-use page is present.
- No deletion path exists beyond the external feedback form.

Known deferred trust items:
- Share payloads remain unsigned and user-editable.
- Scoring coefficients and archetype/family profiles remain hand-tuned.
- Feminist IR, postcolonial theory, green IR, and other traditions remain under-modeled.
- Typecheck status has not been checked in this audit-only prompt.

## 6. Files to touch by prompt

Prompt 1 - Profile payoff:
- `components/profile/profile-report.tsx`
- `components/profile/profile-dashboard.tsx` only if empty/local states need small copy alignment.
- `lib/profile-helpers.ts`
- `lib/narrative/profile.ts`
- `app/globals.css`
- Do not touch scoring, payload, or taxonomy files.

Prompt 2 - Method truthfulness and precision cleanup:
- `app/method/page.tsx`
- `app/results/[payload]/page.tsx`
- `app/ai/results/[payload]/page.tsx`
- `components/results/ai-governance-profile-sections.tsx`
- `lib/ai-governance-results-v2.ts`
- Possibly tests covering scoring/method copy if present.
- Do not change scoring weights unless explicitly chosen as a versioned scoring change.

Prompt 3 - AI Atlas detail depth and Field Guide links:
- `app/ai/atlas/page.tsx`
- `app/ai/atlas/[id]/page.tsx`
- `app/ai/field-guide/page.tsx`
- `lib/ai-governance-atlas-content.ts`
- `lib/ai-governance-field-guide-content.ts` if specific Field Guide content needs typed links.
- `app/globals.css`
- Do not add new AI archetypes or scoring logic.

Prompt 4 - Question hardening lite:
- Create `plans/V13_QUESTION_HARDENING_AUDIT.md`.
- Read and possibly lightly edit:
  - `lib/quiz-schema.ts`
  - `lib/modules/security.ts`
  - `lib/modules/technology.ts`
  - `lib/ai-governance-schema.ts`
  - `app/method/page.tsx`
- Limit implemented copy changes to the "fix now" group and preserve scoring keys.

Prompt 5 - Privacy and research opt-in surfaces:
- Add a privacy/data-use route, likely `app/privacy/page.tsx` or a clearly named equivalent.
- Add a reusable component under `components/research/` or another existing component area.
- Add opt-in surfaces to:
  - `app/results/[payload]/page.tsx`
  - `app/modules/[slug]/results/[payload]/page.tsx` and/or `components/modules/module-result.tsx`
  - `app/ai/results/[payload]/page.tsx`
  - possibly `app/profile/page.tsx` or `components/profile/profile-report.tsx` if Profile becomes an opt-in entry point.
- Update `app/feedback/page.tsx` for deletion/request language.
- Update navigation/footer if a footer privacy link exists in `components/layout/site-chrome.tsx`.
- Do not create database writes in this prompt.

Prompt 6 - Research route scaffolding:
- `app/api/research/submit/route.ts`
- `app/api/research/delete/route.ts`
- Optional `app/api/research/event/route.ts` only if kept no-raw-answer.
- `lib/research/*` or equivalent server-only helper.
- `docs/v13/ir_ai_v13_pilot_data_profile_pack/V13_research_schema.sql` or a repo-local copy if the project standardizes one.
- Minimal route tests if the current test setup supports them.
- Keep routes safely disabled without env vars.

Prompt 7 - Release hygiene and typecheck visibility:
- `README.md`
- `next.config.ts`
- `package.json` only if scripts/version metadata need small alignment.
- `plans/V13_TYPECHECK_DEFERRED.md` if `npx tsc --noEmit` has broad failures.
- Remove only safe committed temp/backup artifacts. Leave unrelated untracked local files alone unless explicitly asked.

Prompt 8 - Final visual/mobile polish:
- `app/globals.css`
- The touched result/profile/atlas/field-guide surfaces above.
- No scoring, payload, taxonomy, or data architecture changes.
