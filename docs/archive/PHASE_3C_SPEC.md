# PHASE 3C SPEC — DISCRIMINATOR ENGINE, TAXONOMY CLARITY, AND RESULT PERSONALIZATION

## Goal
Turn the current prototype from a good editorial atlas with a working quiz into a more discriminating, better-explained assessment.

This phase should make the quiz feel:
- less like a generic branching form
- more theoretically precise
- more personalized without pretending to be a validated psychometric instrument

## Product stance
Do not add many new final “types.”
Do not add fake precision.
Do not claim scientific validation.

Instead:
- keep continuous dimension scores
- improve question discrimination
- clarify umbrella traditions and subtraditions
- explain overlap and ambiguity more honestly

## P0 quick fixes before any major 3C work
These should be done first in the same branch if not already fixed.

### 1. Fix hydration mismatch on landing page
Current issue: `ResumeCta` reads `localStorage` during initial client render, while the server render cannot. This creates a server/client mismatch whenever a stored draft exists.

Preferred fix:
- make `ResumeCta` render a stable server-safe default on first render
- then hydrate client-only draft status after mount
- simplest acceptable solution: use `next/dynamic` with `ssr: false` for `ResumeCta`
- acceptable alternative: gate draft UI behind a mounted flag

### 2. Fix family label clarity
The product currently editorially describes the institutionalist family as liberal institutionalism, but the user-facing label should not be “Critical Institutionalist.”

Change:
- primary display label should be `Liberal Institutionalist`
- supporting copy can note that this sits within the broader liberal tradition

### 3. Add one lightweight regression test if practical
- landing page renders without hydration mismatch for no-draft path
- or at minimum add a code comment and architecture note if this is hard to test quickly

## Core 3C deliverables

### A. Rewrite the scenario/discriminator layer
The current scenario logic is still too often read as:
- hardline
- moderate compromise
- opposite hardline

Replace this with a discriminator model where each option represents a distinct theoretical logic.

#### Required changes
1. Keep the 21 core anchor items unchanged for now.
2. Rewrite the scenario bank so each branch option maps to a worldview logic, not a temperature.
3. Keep answer options to three choices, but make all three defensible.
4. Use clearer issue labels and less “what is the best response?” framing.

#### Target scenario clusters
At minimum include or revise items in these issue areas:
- strategic technology / economic statecraft
- ally burden-sharing / alliance bargaining
- institutional legitimacy under capture
- humanitarian intervention / sovereignty
- financial crisis / external constraint
- rival transformation / trust and identity

#### Design rule for options
Each scenario should feel like:
- Option A = coherent logic
- Option B = coherent but different logic
- Option C = coherent but different logic

not:
- A = extreme
- B = sensible middle
- C = opposite extreme

### B. Move from static branching to ambiguity-driven tie-breakers
After the 21 anchor items:
1. calculate the top two family scores
2. identify the top one or two ambiguous dimensions
3. ask only 3 to 5 tie-breaker items chosen from a larger bank

This is still rule-based adaptivity, not full CAT.

#### Tie-breaker selection rules
Examples:
- if realism and institutionalism are close: show strategic technology and institutional capture
- if institutionalism and constructivism are close: show institution legitimacy and rival transformation
- if realism and critical PE are close: show financial crisis and economic coercion
- if order/justice is near neutral: show humanitarian intervention threshold item

### C. Clarify taxonomy: umbrella traditions and subtraditions
The atlas should make this explicit:
- Realism is an umbrella
- Liberalism is an umbrella
- Constructivism has internal variants
- Critical political economy includes Marxist, dependency, neo-Gramscian, and structural-power strands

#### Required product changes
1. On `/explore`, add a short “umbrella traditions and subtraditions” section near the top.
2. On the institutionalist page, explicitly say this page models **liberal institutionalism**, not the whole liberal tradition.
3. Add a non-scored editorial note that other liberal strands include commercial and republican liberalism.
4. On the critical PE page, make Marxism and dependency visible without implying separate quiz scoring yet.

### D. Improve result personalization
Add sections that answer “why you, not just what label?”

#### New result sections
1. **Why this result won**
   - 2 to 4 bullet points
   - refer to strongest differentiating dimensions and tie-breakers

2. **Where you overlap with your runner-up**
   - one short paragraph

3. **What would have changed your result**
   - only when the result is genuinely close
   - describe a plausible directional shift, not fake percentages

4. **Issue-area tilts**
   - 2 or 3 short rows like:
     - “On strategic technology, your instincts become more realist than your overall profile.”

5. **Subtradition affinity**
   - keep this, but make it more explicit and more legible

### E. Add better explanation to the questions without priming
The current clarifications are strong. Keep them hidden by default.

Improve question UI so that each item can reveal:
- what this asks
- what this does not ask
- key terms

But do not make the explanation visually dominant.
Use a compact disclosure pattern.

### F. Add one new desktop result visualization
No radar charts.

Add one of these:
- ranked worldview fit bars
- dimension quadrant map
- primary vs runner-up comparison strip

Preferred:
- a simple primary vs runner-up comparison strip showing where they diverged most

## UX and writing constraints
- desktop-first
- serious editorial tone
- no startup-dashboard look
- no gamified badges
- no fake “confidence score” unless clearly labeled as heuristic and internal
- no pseudo-scientific percentages

## Files likely to change
- `lib/quiz-schema.ts`
- `lib/scoring.ts`
- `lib/result-helpers.ts`
- `app/results/[payload]/page.tsx`
- `app/explore/page.tsx`
- `app/explore/[slug]/page.tsx`
- `components/quiz-app.tsx`
- `components/landing/resume-cta.tsx`
- `app/globals.css`
- optionally `tests/*`

## Out of scope for 3C
- user accounts
- backend analytics
- nationality-adjusted scoring
- new scored families for feminist, postcolonial, or green IR
- mobile-first redesign

## Definition of done
- landing page no longer throws hydration mismatch
- institutionalist label is clarified as liberal institutionalism
- scenario options no longer funnel smart users toward the middle by design
- quiz asks a smaller set of better tie-breakers after anchors
- result page feels noticeably more personal and interpretive
- `/explore` explains umbrella traditions and subtraditions more clearly
- tests, lint, and build all pass
