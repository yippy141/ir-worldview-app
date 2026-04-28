# Phase 6C.1 — Atlas Clarity, Copy Hygiene, and Visual Storytelling

## Why this phase exists

Phase 6C moved the product in the right direction:
- tighter module content
- lighter Standard-mode payoff
- Atlas Lite as a first exploration layer
- better profile/payoff structure

But Atlas Lite is still too verbose, too policy-analyst-coded, and too hard to scan for a lay reader.
The current cards read more like compressed internal notes than public-facing editorial summaries.

The next pass should **not** be a big architecture rethink.
It should be a focused polish-and-clarity pass that makes the Atlas and the top result surfaces more usable, more natural in voice, and more visually informative.

This phase is intentionally narrower than 6C.
It should feel like a high-value editorial/UI pass, not a new subsystem explosion.

## Product stance

Keep the current noun system:
- **IR Worldview Inventory** = product
- **Foundation** = baseline questionnaire
- **Focus-area modules** = issue-area stress tests
- **Profile** = integrated synthesis
- **Atlas** = curated browse map of canonical profile patterns

Do **not** add compare-with-friends, rarity claims, or new modules in this phase.
Do **not** start the crisis lab in this phase.

## Goals

### Goal 1: Make Atlas cards understandable in one quick scan

Atlas cards should work like executive summaries, not memo fragments.

Each Atlas card should contain:
- pattern name
- one plain-English summary sentence
- 2–3 short driver bullets or tags
- one short note on how this pattern often shifts under Security or Technology pressure
- a clear CTA to open the pattern detail page

#### Card copy rules

- The summary sentence should be understandable to a smart lay reader.
- Avoid policy-school compression.
- Avoid taxonomy-heavy wording above the fold.
- Avoid AI-coded phrasing such as:
  - “X matters”
  - “you think X matters”
  - “you place real emphasis on…”
  - “nearest-fit shorthand”
  - “broad-spectrum” on the visible card surface
- Prefer more natural wording such as:
  - “You usually start with…”
  - “You are more likely to…”
  - “You are less likely to assume…”
  - “This pattern usually treats…”
  - “You often come back to…”

#### Card length target

A card should be readable in 5 seconds.
If a user needs to stop and parse the sentence structure, the card is too dense.

### Goal 2: Add Atlas detail pages

Atlas Lite should stop being a one-page dead end.
Each pattern should be clickable into a dedicated detail page.

Add route:
- `/explore/atlas/[id]`

Each detail page should include:
1. pattern name
2. one plain-English executive summary
3. one simple visual fingerprint
4. “What usually drives this pattern”
5. “How it often looks in Security”
6. “How it often looks in Technology”
7. “Where it is often confused with neighboring patterns”
8. “Questions to pressure-test this pattern”
9. neighboring patterns with links

This should feel like an editorial explainer page, not a dense taxonomy dossier.

### Goal 3: Add simple, meaningful visuals

The Atlas and top result surfaces should do more interpretive work visually.

#### Allowed visuals

Use restrained, readable visuals such as:
- small dot/tilt strips
- short aligned fingerprints across a limited number of core dimensions
- mini lane bars or shift chips
- simple comparison rows

#### Avoid

- radar charts
- decorative dashboards
- faux precision visuals
- cluttered consultant-style walls of cards

#### Atlas visual target

Each Atlas pattern should get a small illustrative fingerprint that helps a user grasp the shape quickly.
This can be approximate/editorial rather than pretending to be a measured user score.

Good example structure:
- competition: high / medium / low
- institutions: high / medium / low
- identity/legitimacy: high / medium / low
- political economy: high / medium / low
- restraint: high / medium / low

### Goal 4: Tighten copy across Atlas and visible Standard-mode surfaces

This phase should include a focused copy hygiene pass on:
- Atlas cards
- Atlas detail pages
- above-the-fold Foundation result summary
- above-the-fold Profile summary
- above-the-fold module result summary

#### Copy rules

- shorter sentences
- more natural rhythm
- less self-conscious taxonomy language
- less “careful model explaining itself” tone
- fewer repeated qualifiers like “conditional,” “selective,” “mixed,” unless they are necessary and immediately unpacked
- plain English first, theory language second

The goal is not to make the product simplistic.
The goal is to make it sound like a sharp human editor instead of a careful model narrator.

### Goal 5: Add copy-hygiene guardrails

This phase should add a light copy-hygiene check so future changes do not reintroduce the most disliked patterns.

Scope:
- Atlas card summaries
- Atlas detail hero summaries
- visible Standard-mode result summaries

Implementation can be lightweight:
- a curated list of flagged phrases
- one test file that scans the relevant string surfaces
- failing only on a small list of clearly undesirable phrases

This should be modest and practical, not an overbuilt NLP system.

## Implementation shape

### Atlas data model changes

Refactor the atlas pattern content so it clearly separates:
- card summary
- short card bullets/tags
- detailed summary
- detail-page driver bullets
- security shift summary
- technology shift summary
- pressure-test questions
- neighbors
- illustrative visual fingerprint

Do not force one long text field to do every job.

### Atlas surface changes

#### `/explore/atlas`
Should become:
- calmer layout
- clearer card scanning
- less verbose cards
- stronger visual rhythm

#### `/explore/atlas/[id]`
Should be added as:
- editorial detail page
- useful to both lay users and serious users
- clearly connected back to Foundation/Profile/neighbor patterns

### Result surface changes (light only)

Do **not** redesign result pages from scratch in this phase.
But do lightly improve the visible Atlas-related and summary surfaces so they use the new, cleaner copy.

That means:
- nearest atlas pattern blocks should use the new executive-summary wording
- neighbor pattern callouts should be clearer and shorter
- any obvious “X matters” / “you think X matters” phrasing in visible summary blocks should be rewritten

## Explicit deferrals

Do **not** do these in 6C.1:
- compare page
- friend comparison
- rarity or percentile claims
- new focus-area modules
- crisis lab
- mirror-world mainline integration
- large repo-wide wording sweep
- data collection or analytics

## Acceptance criteria

Phase 6C.1 is successful if:

1. Atlas cards are clearly more scannable and understandable to a lay reader.
2. Every Atlas pattern has a detail page.
3. The Atlas detail page adds real value rather than just repeating the card.
4. Atlas and visible Standard-mode summaries sound more natural and less AI-coded.
5. There is at least one lightweight visual improvement on Atlas/detail surfaces.
6. Copy-hygiene tests exist for the relevant surfaces.
7. Lint, tests, and build all pass.

## What to defer to the next phase

If 6C.1 lands well, the next likely phase is:
- compare / share / map / return-layer expansion

But do not bring that into this pass.
