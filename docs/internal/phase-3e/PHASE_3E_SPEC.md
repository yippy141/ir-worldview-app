# PHASE 3E SPEC — RED TEAM, PILOT POLISH, AND TRUST LAYER

## Goal
Make the app feel publication-ready for a small SAIS pilot.

This is not a new theory/scoring phase. It is a trust, clarity, and presentation phase.

## Product stance
Do not add new scored families.
Do not add nationality-adjusted scoring.
Do not add a backend.
Do not add gamified visuals.

Do:
- make the site easier to trust
- make the language easier to parse
- make the reading and source layer stronger
- improve the top navigation and desktop shell
- red-team the classification before outside testing

## Priorities

### P0 — Header and shell polish
1. Make the brand/title an explicit link to `/`.
2. Enlarge the header and make it feel editorial rather than wiki-like.
3. Desktop nav should include: Home, Explore, Methods, Take the quiz.
4. Keep the header restrained; no heavy app chrome.
5. Improve spacing and hierarchy in the top bar.

### P1 — Source and reference layer
1. Add a `/references` page.
2. Organize references by family and by methods/design.
3. Use real, reputable sources:
   - primary texts where practical
   - publisher pages, JSTOR, Cambridge, OUP, MIT Press, etc.
4. On `/explore/[slug]`, add a short “Sources and further reading” block linking to `/references` anchors.
5. On `/method`, add a small references block for survey/method sources.
6. Do not clutter every paragraph with inline citations; use endnote-style source blocks instead.

### P2 — Reading list expansion
For each modeled family:
- 3 starter readings
- 3 advanced readings
- 2 counter-readings / critiques

Also add:
- one short “If you liked this result, read next…” suggestion
- one “Read the strongest critique of this tradition” suggestion

### P3 — Result visuals
Add only restrained visuals. Preferred options:
1. Ranked worldview-fit bars (primary plus runner-up comparison)
2. Change-from-last-time mini delta rows in history compare
3. Issue-area tilt chips or compact rows

Do not add:
- radar charts
- circular personality wheels
- fake precision graphics

### P4 — Feedback flow polish
1. Keep Google Form for the pilot.
2. Improve `/feedback` so it feels native to the site:
   - why feedback matters
   - what questions are asked
   - how long it takes
   - privacy note
3. Add a “Back to result” button when arriving from a result page.
4. Replace placeholder form URL with the real one.

### P5 — Copy tightening
Do a copy-only pass on:
- core question prompts
- scenario prompts
- result microcopy
- nav labels
- feedback page

Tone target:
- DGA / Eurasia Group / The Economist
- plain-English briefing style
- no seminar jargon in the visible sentence
- no AI-speak or inflated phrasing

### P6 — Red team suite
Build a red-team matrix before the SAIS pilot.

#### A. Theoretical red team
Test at least these expected profiles:
- offensive realist
- defensive realist
- neoclassical realist
- liberal institutionalist
- commercial/republican liberal
- constructivist
- Marxist / dependency-oriented thinker
- mixed institutionalist-constructivist
- order-first pluralist
- justice-first solidarist

For each, record:
- expected result
- actual result
- what felt off
- which question caused drift

#### B. Language red team
For 5–10 smart non-specialists:
- Which question took longest to understand?
- Which question felt like jargon?
- Which option felt like the obvious “smart middle” answer?
- Which result sentence felt vague or generic?

#### C. Product red team
Check:
- can a new user understand the purpose in 15 seconds?
- does the result page answer “so what?” clearly?
- can a user find home, explore, method, and feedback easily?
- does the Google Form handoff feel abrupt?
- does the result feel overconfident?

## Out of scope
- backend analytics
- accounts
- nationality-adjusted scoring
- new scored families
- mobile-first redesign

## Definition of done
- header feels publication-grade and includes a clear Home path
- references page exists and is useful
- reading lists are deeper and better structured
- result visuals are clearer without looking gimmicky
- feedback page feels intentional, not bolted on
- a written red-team matrix exists and can be used before SAIS testing
- tests, lint, and build pass
