# IR + AI V14 project-manager brief

## Sprint name
V14 — Prelaunch payoff, trust, and AI-first wedge

## One-sentence goal
Make the product safe and compelling enough to share with LinkedIn connections, SAIS classmates/alumni, and selected AI-governance contacts by fixing the result payoff loop, removing the most obvious engineering trust risk, and making the AI Governance Compass a standalone entry point inside the same app.

## Strategic decision
V14 should commit to this stance:

**Primary public wedge:** AI Governance Compass.
**Institutional / SAIS depth layer:** IR Worldview Inventory.
**Shared product architecture:** one Next.js repo, one site, one Profile, but two clearly understandable entry points.

This is not a compromise. It is a positioning decision. For AI governance / safety policy opportunities, the AI Compass is the sharper hook. For SAIS / IR credibility, the IR Foundation and modules show depth. The site should let people start from either door without feeling they are in the wrong place.

## Why V14 is needed
V13 made the product coherent and pilotable. The remaining risk is that a serious user opens the site, invests effort, and still does not get a fast enough reward. The current red team identifies five major issues:

1. Results still feel more like a report than a reward.
2. The AI Compass is the best top-of-funnel asset but still reads as a companion layer rather than an independent hook.
3. `typescript.ignoreBuildErrors` is still an unacceptable engineering trust risk.
4. The quiz still asks for too much cognitive work before the user sees the payoff.
5. Sharing still does not create a strong social loop.

## V14 priorities

### P0 — Engineering trust gate
No broader sharing until:
- `npx tsc --noEmit` passes.
- `typescript.ignoreBuildErrors` is removed or set to false.
- `npm run lint`, `npm run test`, and `npm run build` all pass.
- 4 to 6 quiz-to-result integration tests exist.

This is the one place V14 should be strict. If the app cannot pass typecheck, do not share it as a serious portfolio artifact.

### P1 — Result Card hero
Build one reusable result-card visual system for:
- IR Foundation result
- AI Governance result
- Profile top card if the user has 2+ saved layers

The result card should be screenshot-worthy. It should show:
- label / archetype
- modifiers or key chips
- one sentence in plain English
- one non-obvious finding / tension (see "Surprising finding spec" below)
- one clean share action

Everything else moves below.

#### Visual direction for the result card
The card should feel editorial, not gamified. Think of how The Economist or Financial Times present data callouts, not how BuzzFeed presents quiz results.

Specifically:
- A contained panel with the tradition color as a left border or top accent bar (2-4px, using the existing `--t-realist`, `--t-institutionalist`, `--t-constructivist`, `--t-cpe` CSS variables).
- The label (e.g. "Strategic Realist") in Georgia serif at roughly 1.4-1.6rem, tracking tight.
- Modifier chips ("Hedger", "Conditional Solidarist") as small, muted pill elements below the label — not bright colored badges.
- A one-sentence summary in the body font at standard size, with comfortable line height.
- The tension/surprise callout in a slightly inset box or with a subtle left-border accent, visually distinct from the summary but not loud.
- Share and "What's next" actions at the bottom of the card, not competing with the main read.
- Background should be `--panel` or very close. No gradients, no shadows heavier than the existing `--shadow` token.

The card must not look like a Bootstrap card with rounded corners, a centered heading, and a "Your result is..." preamble. It should look like a pull-quote panel in a serious publication.

#### Surprising finding spec
The "non-obvious finding" on the result card is the feature that counters the "it told me what I already know" complaint. It must come from existing data, not from new scoring logic.

**For Foundation results,** use this priority chain:
1. If `getActiveTensions(dimensionScores)` returns one or more tensions, use the first one. These fire when two strong dimensions pull in contradictory directions (e.g., high institutions + high security competition). They are the most genuinely interesting signal.
2. If no tension fires, use `getSubtraditionAffinity(familyKey, dimensionScores)`. This tells the user which specific strand of their tradition they land in (e.g., "defensive realism" vs "offensive realism" within realism). Most users will not expect this level of specificity.
3. If subtradition returns the generic/default case and feels uninformative, fall back to `neighborOverlapTexts[familyKey][runnerUpKey]`, which describes the productive tension between the user's primary and runner-up tradition.

Copy template: keep it under two sentences. Example: "You scored as a Strategic Realist, but your high restraint pull is unusual for that profile. That combination points toward defensive realism — the argument that overextension provokes more danger than it prevents." Do not add a caveat sentence. The card is the reward; caveats go lower.

**For AI Governance results,** use `getActiveAiGovernanceTensions(axisScores)`. If a tension fires, use it. If none fire, use the nearest-alternative framing from `lib/ai-governance-results-v2.ts`. Same copy constraint: under two sentences, no caveat.

### P2 — AI Governance as standalone entry point
Rewrite `/ai` so it leads with standalone value:

> Map your instincts on frontier AI governance. 16 questions. Around 8 minutes.

Then mention the IR connection as optional depth, not as a prerequisite.

Keep same repo and route family. Do not fork the product.

### P3 — Landing page rewrite
The current landing page hero tries to explain the entire product architecture (Foundation, Modules, AI Governance, Profile) before the user has decided to do anything. This kills conversion.

Rewrite the hero to:
- Lead with a short question: "What's your foreign policy worldview?"
- One sentence: "25 questions. 12 minutes. Find out which IR tradition shapes your instincts."
- One big CTA: "Take the quiz"
- One secondary link: "Or start with AI Governance (8 min)"
- Move the how-to-use sidebar and product-layer sections below the fold.

Below the fold, add a sample result preview so users can see what they are working toward. This can be a fictional/anonymized result card rendered with the same visual system from P1.

### P4 — Quiz friction reduction
Do not rewrite the question bank. Do reduce friction:
- default first-time users to Standard mode
- move Analyst mode into a secondary upgrade path (offered after completion, not before)
- add section markers in the quiz flow (see section groupings below)
- add light CSS transitions between questions (150ms fade or slide)

#### Quiz section groupings for Standard mode
The Foundation Standard quiz has 20 questions. Group them into labeled sections for the progress indicator:

1. **"Your IR baseline"** — sc1, in1, df1, ni1, pe1, rs1, oj1 (7 Likert items, one per dimension)
2. **"Alliances and interdependence"** — tradeoff_alliances, sc2, in2, tradeoff_interdependence (2 tradeoffs + 2 Likerts)
3. **"Domestic politics and identity"** — df2, ni2, pe2 (3 Likerts)
4. **"Strategy and values"** — rs2, oj2, tradeoff_strategy, tradeoff_intervention (2 Likerts + 2 tradeoffs)
5. **"Applied cases"** — case_semiconductors, case_protection (2 mini-cases)

Display format: a compact section label above the question area that updates as the user crosses section boundaries. Example: "Part 2 of 5 — Alliances and interdependence". Keep it small and unobtrusive.

### P5 — Midpoint preview (restored)
After the user completes section 1 (the first 7 Likert items, one per dimension), show a brief interstitial:

> "Your profile is starting to take shape. You have strong pulls on [top 2 dimensions by distance from center]."

Mark it explicitly as preliminary: "This is a partial read based on your first answers. The remaining questions will sharpen it." Include a "Continue" button.

This is the moment where a tired user decides to finish vs. quit. The data exists after 7 questions — `computeCoreDimensionScores` can run on partial answers since unanswered dimensions fall back to 4.0. Use `getTopDimensions(scores, 2)` to pick the two most pronounced signals.

Do not show a family label yet. Just dimensions. The family label at the halfway point would feel premature and might anchor the user's expectations in a way that makes the final result feel like a correction rather than a reveal.

### P6 — Social share and metadata
At minimum:
- result card is visually strong enough to screenshot
- share button copies a clean URL
- result page metadata is not generic
- AI and IR results have distinct social titles/descriptions

**Dynamic OG images are deferred to V14.1.** Building per-result OG images using `ImageResponse` is technically feasible but visually fiddly (fixed viewport, no CSS variables, limited font support in the JSX-to-PNG pipeline). Trying to build both the browser result card and the OG card simultaneously means the OG constraints will compromise the browser design. Get the result card right first. Then clone its layout into an OG image route as a follow-up.

For V14, ship static route-level OG metadata with accurate titles and descriptions. If the result card looks good enough to screenshot, that covers 80% of the sharing use case.

### P7 — Pilot instrumentation gate
Keep V13 research storage optional and conservative. Before broader testing:
- product works without opt-in
- research opt-in is unchecked by default
- no raw answers go to third-party analytics
- deletion path is visible
- if storage env vars are absent, endpoints fail safely

## V14 non-goals
Do not do these in V14:
- no new IR families
- no new live modules
- no new AI archetypes
- no scoring rewrite
- no account system
- no group codes
- no dashboard
- no class/cohort analytics
- no broad research validation pass
- no full mobile redesign
- no separate codebase for AI
- no dynamic per-result OG images (deferred to V14.1)

## What to cut or demote in V14
- Do not invest more in Atlas before the quiz-result-share loop works.
- Do not deepen Analyst mode before Standard feels rewarding.
- Do not expand reading lists; convert only the top result shelf into debate prompts if time allows.
- Do not keep building Profile as a dashboard. Profile should show the integrated card, saved layers, and a clear next action.

## Explicitly deferred to V15
The following items were identified in the red team but are intentionally out of scope for V14. They are recorded here so they do not disappear.

- **Document magic-number coefficients.** Every magic number in `scoring.ts`, `ai-governance-scoring.ts`, `security.ts`, and `technology.ts` needs a one-line comment explaining the editorial reasoning. Format: `// Editorial choice: X because [reason]. No calibration data.`
- **Break up `quiz-app.tsx`.** The 800+ line component should be decomposed into `ModeGate`, `LikertCard`, `TradeoffCard`, `QuizNavigation`, and a thin orchestrator parent.
- **Extract inline styles to CSS classes.** Audit results, profile, and explore pages for repeated `style` props and replace with utility or component classes.
- **Dynamic per-result OG images.** Clone the result card layout into `opengraph-image.tsx` routes using Next.js `ImageResponse`.
- **Signed share payloads.** Add HMAC to prevent URL manipulation. Requires audit (see Codex Prompt 4B).
- **Class/group codes.** Group organizer creates a code, participants enter it, group page shows anonymous distribution. High-value for classroom adoption, high complexity for V14.
- **Debate prompts replacing reading lists.** "Your realist instincts say X. A constructivist would push back: Y. Here is a text that makes that case." Creates engagement, not homework.
- **"What would change your mind?" section.** Empirical scenarios that pressure-test the user's worldview.
- **Comparison table on result page.** Four-column table showing how the user's result compares to other traditions on the quiz's issue areas.

## Acceptance standard
V14 is ready to share when a tester can answer these in under 30 seconds after finishing:

1. What did you get?
2. What was the interesting or surprising part?
3. What would you share with a friend or colleague?
4. Where would you click next?

If the answer is still "I need to read the whole page," V14 failed.
