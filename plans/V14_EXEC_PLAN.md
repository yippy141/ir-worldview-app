# V14 execution plan

## Sprint frame
V14 is **prelaunch payoff, trust, and AI-first wedge**. The goal is to make the app credible enough for selective sharing by fixing the result reward loop, closing the typecheck trust gap, and making the AI Governance Compass a standalone public entry point inside the same product.

Primary wedge: AI Governance Compass.
Depth layer: IR Worldview Inventory.
Architecture: one Next.js repo, one site, one Profile, two clear entry points.

## Hard gates
- `npx tsc --noEmit` passes.
- `typescript.ignoreBuildErrors` is removed or set to false.
- `npm run lint`, `npm run test`, and `npm run build` pass after meaningful edits.
- 4 to 6 quiz-to-result integration tests exist before broad sharing.
- Product works without research opt-in or research-storage env vars.

## Non-goals
- No scoring rewrite.
- No payload rewrite.
- No new IR families, AI archetypes, or live modules.
- No account system, group codes, dashboard, or cohort analytics.
- No separate AI codebase.
- No dynamic per-result OG images in V14; defer to V14.1.
- No broad research-validation pass.

## Work sequence

### Prompt 1 - Typecheck and build trust gate
Scope:
- Remove or disable `typescript.ignoreBuildErrors`.
- Run `npx tsc --noEmit` and fix blocking type errors with small diffs.
- Add or tighten 4 to 6 quiz-to-result integration tests if current coverage is missing.

Acceptance:
- Typecheck, lint, test, and build pass or failures are documented with exact blockers.
- No scoring, taxonomy, or payload behavior changes unless required to fix an existing invalid generator path.

### Prompt 2 - Shared result-card payoff system
Scope:
- Create one reusable editorial result-card visual grammar for Foundation, AI Governance, and Profile with 2+ saved layers.
- Card content: label/archetype, muted modifiers or key chips, one plain-English sentence, one non-obvious finding, and one clean share action.
- Use existing data for surprise/tension logic:
  - Foundation: `getActiveTensions`, then `getSubtraditionAffinity`, then `neighborOverlapTexts`.
  - AI: `getActiveAiGovernanceTensions`, then nearest-alternative framing from `lib/ai-governance-results-v2.ts`.

Acceptance:
- The result opens with the payoff card before dense readings, tables, Atlas, or method notes.
- The card uses restrained editorial styling: existing tradition variables as a narrow accent, serif label, muted chips, subtle tension callout, no gradients or heavy shadows.
- Caveats and trust notes sit below the first payoff.

### Prompt 3 - AI Governance standalone entry
Scope:
- Rewrite `/ai` around the standalone promise: "Map your instincts on frontier AI governance. 16 questions. Around 8 minutes."
- Present IR Foundation as optional depth, not required context.
- Keep AI Atlas and Field Guide available but secondary to the quiz CTA.

Acceptance:
- `/ai` can be sent directly to AI governance contacts without explaining the IR app first.
- AI result pages remain understandable without IR context while still linking back to IR as optional depth.

### Prompt 4 - Landing page conversion rewrite
Scope:
- Rewrite the landing hero around:
  - "What's your foreign policy worldview?"
  - "25 questions. 12 minutes. Find out which IR tradition shapes your instincts."
  - Primary CTA: "Take the quiz"
  - Secondary link: "Or start with AI Governance (8 min)"
- Move product architecture and how-to-use material below the fold.
- Add a sample result preview using the same result-card visual system.

Acceptance:
- The first viewport asks for one clear action rather than explaining the full architecture.
- The user can see what payoff they are working toward before committing too much time.

### Prompt 5 - Quiz friction and midpoint preview
Scope:
- Default first-time users to Standard mode.
- Move Analyst mode into a secondary upgrade path, preferably after completion.
- Add compact Standard-mode section markers:
  - Part 1: Your IR baseline
  - Part 2: Alliances and interdependence
  - Part 3: Domestic politics and identity
  - Part 4: Strategy and values
  - Part 5: Applied cases
- Restore a midpoint preview after section 1 using partial `computeCoreDimensionScores` and `getTopDimensions(scores, 2)`.
- Add subtle 150ms question transitions if they do not create layout jank.

Acceptance:
- Answer selection does not auto-advance.
- The midpoint preview is explicitly preliminary and shows dimensions only, not a family label.

### Prompt 6 - Sharing and metadata
Scope:
- Ensure share buttons copy clean URLs.
- Add route-specific static metadata for IR results, AI results, and Profile share pages.
- Keep dynamic OG images deferred to V14.1.

Acceptance:
- Result cards are strong enough for screenshots.
- Shared result routes refresh cleanly in a fresh browser.
- Metadata is accurate and not generic.

### Prompt 7 - Privacy-first research storage readiness
Scope:
- Keep research opt-in unchecked by default.
- Confirm product behavior without opt-in.
- Confirm no raw answers are sent to third-party analytics.
- Keep contact info separate from answers.
- Keep deletion path visible.
- Confirm research endpoints fail safely when env vars are absent.

Acceptance:
- Copy uses pseudonymous/de-identified language unless data is truly anonymous.
- Storage remains conservative and optional for pilot use.

### Prompt 8 - Prelaunch QA and packaging
Scope:
- Run `npm run lint`, `npm run test`, `npx tsc --noEmit`, and `npm run build`.
- Check mobile at roughly 390px on landing, quiz, IR result, AI result, and Profile.
- Update README or public packaging only if stale enough to harm sharing.
- Leave V15 deferred items visible in the V14 pack docs.

Acceptance:
- A tester can answer within 30 seconds after finishing:
  1. What did you get?
  2. What was the interesting or surprising part?
  3. What would you share?
  4. Where would you click next?

## Deferred
Keep these out of V14 unless explicitly re-scoped:
- Dynamic per-result OG images.
- Signed share payloads.
- Class/group codes.
- Debate prompts replacing reading lists.
- "What would change your mind?" sections.
- Comparison table on result pages.
- Magic-number coefficient documentation.
- Breaking up `quiz-app.tsx`.
- Broad inline-style cleanup.
