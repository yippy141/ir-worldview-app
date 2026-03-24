# AGENTS.md — IR Worldview Inventory

## Mission
Build an editorial-grade IR worldview tool that feels serious, legible, and intellectually honest. This is **not** a playful personality quiz clone. The goal is a product that can stand up as a strong portfolio piece for policy, strategy, and research audiences.

## Implementation instruction for this pass
Work on **Phase 2 / P0 only** in this round.
Do not expand into P1 or P2 work unless it is required to complete a P0 dependency.

## What success looks like
The app should feel:
- deliberate rather than gimmicky
- transparent rather than black-box
- editorial rather than dashboard-like
- interpretive rather than merely numeric
- rigorous about limitations without becoming sterile

## Current stage
We are in **Phase 2**.

Phase 1 solved the basic interaction and trust floor:
- light editorial theme
- Back / Next navigation
- initial results dashboard
- methodology page

Phase 2 / P0 should now turn the prototype into a more complete product by improving:
1. route architecture and shareability
2. question clarity and content coverage
3. editorial exploration pages
4. review-before-results trust flow
5. overall information architecture

## Product principles
1. **No fake precision.**
   Never present heuristic outputs as validated confidence, percentiles, or scientific certainty.

2. **Content before chrome.**
   Stronger copy, question design, and interpretation matter more than decorative UI.

3. **Editorial, not startup.**
   Avoid gradients, flashy widgets, radar charts, generic AI-dashboard patterns, stock photos, emoji decoration, and “glassmorphism”.

4. **Neutral guidance only.**
   Question clarifications must help comprehension without priming users toward a theory family or “correct” answer.

5. **Hybridity is real.**
   Results should allow mixed or conditional profiles. Do not force overly binary classification language.

6. **Transparency is part of the product.**
   The method page, explore pages, and result caveats are core UX, not side content.

## Architectural clarifications for this round
### Canonical routes
Use this route structure:
- `/` = landing page
- `/quiz` = active quiz flow only
- `/quiz/review` = answer review before scoring
- `/results/[payload]` = shareable result route
- `/explore` = worldview library
- `/explore/[slug]` = worldview detail pages
- `/method` = methodology page

### Remove inline results from `/quiz`
`/quiz` must no longer render results inline.
Results should be available only through the canonical `/results/[payload]` route.

### Review-edit mode
If a user clicks **Edit** on the review screen:
- route to `/quiz?q={index}&from=review`
- show a visible **Return to review** control
- keep normal Back / Next navigation available
- do **not** auto-generate or auto-show results from `/quiz`
- if the user reaches the end while in review-edit mode, the primary completion action should return them to `/quiz/review`, not bypass it

### Resume draft on landing page
The landing page should detect whether a local draft exists and, if so, offer:
- **Resume quiz**
- **Start over** / clear draft

Because this depends on localStorage, implement this with a small client component rather than forcing the entire landing page to be client-rendered.

### Share payload
Use a compact, versioned, URL-safe payload that contains **result state**, not raw answers.
A server result route wrapping a client share-actions component is correct.

## Content decisions
### Core question bank
Do not pause to request approval for new question text.
Use the **21-item bank specified in the Phase 2 spec appendix** as the source of truth for this pass.
Minor copy edits are allowed only if they improve plain-English readability without changing meaning.

### Explore content
Do not block implementation on a prose review.
Author the Explore pages now, but keep them:
- editorial rather than encyclopedic
- substantial enough to feel real
- concise enough to remain readable

Target length per modeled worldview page:
- roughly **450–700 words** of prose plus structured subheads / bullets

### Landing page register
The landing page should feel like a short editorial introduction, not a startup feature list.
It should include:
- a strong title
- a short explanation of what the inventory measures
- a short note on what it does **not** measure
- two clear CTAs: **Take the quiz** and **Explore the perspectives**
- a third **Resume quiz** CTA only when a draft exists

A small amount of onboarding structure is good. A long marketing-style breakdown is not.

### Brand and nav
Yes:
- the brand should link to `/`
- top nav should include `Explore`, `Method`, and a quiz CTA

Do **not** make the top nav feel like an app dashboard.
A restrained editorial header is preferred.

## Scope decisions
### Thin question set
Yes, Phase 2 must expand the core question bank from 14 to 21 items.
Three core items per dimension is required.

### Missing critical traditions
Do **not** add feminist IR, postcolonial / decolonial IR, green IR, or national-strategic-culture families as scored outputs in this pass.

Instead:
- represent them honestly in Explore and Method as important but not yet fully modeled
- note the coverage gap clearly

### National perspectives
Do **not** use nationality, civilizational identity, or country background in scoring in this pass.

Acceptable treatment in this round:
- a brief note in Explore or Method about Western-centered IR canons
- a future-facing note about comparative strategic cultures

Unacceptable in this round:
- country-based score adjustment
- national profile types
- demographic tailoring of results

## Design rules for reducing the remaining “vibe-coded” feel
- Stop wrapping every major section in an identical bordered box.
- On reading-heavy pages, prefer article-like sections with dividers and whitespace.
- Reserve boxed surfaces for callouts, controls, and small summary modules.
- Avoid generic startup-card repetition.
- The product should read more like a serious interactive essay than a SaaS dashboard.

## Engineering rules
- Prefer schema-driven content over hardcoded JSX strings where practical.
- Keep content, logic, and rendering separated.
- Use typed helpers and keep payload/version handling explicit.
- Add comments only where they explain rationale, not obvious syntax.
- Preserve accessibility: labels, button states, keyboard behavior, and readable contrast.

## Testing / QA minimums for this pass
Before marking Phase 2 / P0 done:
- `/` renders a landing page with CTA(s)
- landing page offers Resume when a draft exists
- `/quiz` collects answers only and never renders inline results
- `/quiz/review` lists answers and supports edit-jumps
- edit-from-review mode shows Return to review and ends back at review
- `/results/[payload]` survives refresh and renders the same result
- copied share URL reproduces the same result on another tab
- invalid payload shows graceful fallback
- all 21 core items render and score correctly
- clarifications open/close correctly and are collapsed by default
- `/explore` renders modeled families and additional unmodeled traditions
- `/explore/[slug]` renders for all modeled families
- `/method` remains accurate
- mobile quiz remains usable

## Non-goals for this pass
Do not:
- add auth or database persistence
- add nationality-based scoring
- add new scored family labels without corresponding dimensions/items
- reintroduce “clarity %” or similar quasi-confidence indicators
- widen scope into backend analytics or account systems

## If tradeoffs are necessary
Prefer this order:
1. review-before-results flow
2. canonical shareable result route
3. 21-item core bank with clarifications
4. explore section
5. landing page and resume flow
6. design polish
