# IR + AI V13 project-manager brief

## Sprint name
V13 — Pilotable Profile + privacy-first research layer

## One-sentence goal
Make the product coherent enough to trial beyond friends by reducing Profile overload, correcting trust/precision inconsistencies, and adding an opt-in, first-party response-data architecture that does not feel like adtech.

## Current take-stock
The project has crossed an important threshold. The shell and product path are now legible: Foundation gives the baseline; Modules pressure-test the baseline; AI Governance is a companion layer; Profile is the accumulating home; Atlas and Field Guide are interpretation surfaces. The next problem is not that users cannot find their way around. The problem is that the payoff still asks too much of them.

V12 made the project more serious and more portfolio-worthy, but it still has four blockers before a broader pilot:

1. **Profile payoff remains overbuilt.** The page still repeats similar ideas across hero, stable/shift summary, layer relationships, overlay movement, AI layer, completed overlays, and appendix. A user should not have to synthesize the synthesis.
2. **Truthfulness and precision signals are uneven.** Methods has become much more honest, but scoring and result language still contain inconsistencies such as the 35% vs 45% second-choice issue and AI clarity/settledness language that reads too scientific for an editorial prototype.
3. **Data collection is absent.** You cannot learn systematically from broader testing without a response-data architecture. But because this product collects governance/worldview judgments, data collection has to be conservative, opt-in, and first-party.
4. **Public trust packaging still lags.** The mature feature branch, live deployment, public README/About text, and release hygiene should tell the same story before the project is used for fellowships, jobs, or public discourse.

## V13 lane
Stay in the serious editorial interactive lane.

V13 should feel like:
- a sharp policy-world interactive
- a bounded interpretive tool
- a portfolio-quality IR/AI product
- a privacy-conscious beta research instrument

V13 should not feel like:
- a psychometric diagnostic
- a SaaS dashboard
- a viral MBTI clone
- an adtech funnel
- a research product pretending it already has validation

## V13 workstreams

### Track 1 — Profile payoff and visual truthfulness
Make Profile lead with the integrated pattern when the user has two or more saved layers.

Required changes:
- Above the fold: one headline, one short synthesis paragraph, one anchored-spread visual, maximum three chips.
- If 2+ layers exist, lead with the integrated Atlas-style pattern, not only the Foundation family.
- Show Foundation family as “closest modeled baseline,” not as the whole identity.
- Keep one “what stayed steady / what shifted / open tension” section.
- Remove repeated stable/shift/reasoning blocks.
- Move appendices, evidence, and module summaries below the fold and collapse where possible.
- Overlay visuals must be framed as directional pulls, not re-measured dimensions.

### Track 2 — Method truthfulness and scoring legibility
Fix obvious trust bugs before wider testing.

Required changes:
- Reconcile Methods and code on second-choice weight. Choose one: 0.35 or 0.45. My recommendation: change the public method to match actual code if changing scoring would alter old shared links or tests; otherwise change code/tests to 0.35 only if you are comfortable with a scoring-version bump.
- Remove “Mostly settled,” “Hybrid zone,” or equivalent clarity/settledness language from AI hero surfaces.
- Replace with softer language such as “nearby alternative” or “close neighboring read,” placed lower on the page.
- Add a compact “where this model can be wrong” note to result pages.
- Keep “closest modeled fit” visible on result/Profile surfaces, not only Methods.

### Track 3 — Question hardening lite
Do not rewrite the whole instrument. Audit and fix only high-risk items.

Required changes:
- Create `plans/V13_QUESTION_HARDENING_AUDIT.md`.
- Count forward-coded / reverse-coded / tradeoff / scenario items by dimension.
- Identify the 6–10 weakest items: too easy to agree with, too abstract, too jargon-heavy, or too weakly discriminating.
- Fix only the most confusing 3–5 in V13.
- Put the rest into a named backlog.

### Track 4 — AI Atlas / Field Guide strengthening
Build the AI side for fellowship/portfolio leverage without scoring sprawl.

Required changes:
- Keep `/ai/atlas` as the compact browse shelf.
- Make AI Atlas cards clickable to detail pages.
- Keep AI detail pages focused: definition, nearby archetype, key disputes, live/recent discourse to watch, readings.
- Keep `/ai/field-guide` as the serious explainer.
- Add an optional non-scored AI Futures Mirror only if time allows. It should ask plausible future vs desirable future and should not change the AI archetype score.

### Track 5 — Privacy-first research/data layer
Add the architecture for collecting useful beta data without creepy surveillance.

Required changes:
- Split analytics into two layers:
  - anonymous aggregate product analytics for funnels/page views
  - explicit opt-in pseudonymous research-response storage for raw answers/results
- Use Next.js Route Handlers for first-party intake.
- Use managed Postgres, preferably Supabase or Neon, with server-side inserts only.
- Do not send raw answers to third-party analytics.
- Do not collect accounts, names, employers, precise location, or demographic enrichment by default.
- Store optional contact info separately from answer data.
- Add retention and deletion language before collecting responses.

## Critical privacy correction
Do not call stored raw answer data “anonymous” if it includes a persistent respondent ID and raw answer history. Call it **pseudonymous** or **de-identified**. “Anonymized” should be reserved for data that cannot reasonably be linked back to a person or device.

## Recommended execution order
1. Backup branch and create source-of-truth plan.
2. Preflight audit: routes, result links, profile surfaces, AI atlas, methods/scoring mismatches, public repo hygiene.
3. Profile payoff pass with Claude Code.
4. Method truthfulness and AI precision-language cleanup with Codex.
5. AI Atlas detail pages and Field Guide cross-linking with Claude Code or Codex.
6. Question hardening lite audit and only the smallest copy fixes.
7. Privacy/consent copy and data architecture scaffolding.
8. Optional: activate database storage after privacy page and env vars are ready.
9. Release hygiene, typecheck, build, deploy preview.
10. Run a 10–20 person beta with opt-in data collection.

## Non-goals
- No new scored IR families.
- No new live IR modules.
- No full psychometric validation claim.
- No account system.
- No social login.
- No dashboards.
- No session replay.
- No adtech.
- No broad question rewrite.
- No new AI archetype scoring layer.

## Go/no-go rule
V13 is pilotable when a new tester can answer these in under 20 seconds after opening Profile:

1. What is my baseline?
2. What changed after modules/AI?
3. What stayed stable?
4. What should I try next?
5. Is this a model interpretation or a validated diagnosis?

If any answer requires scrolling through multiple summaries, Profile is still not done.
