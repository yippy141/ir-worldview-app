# Phase 6E — Plain-English Payoff, Actor Lens, and Public Surface Alignment

## Why this phase exists

Phase 6D proved the architecture can hold. The next bottleneck is not more features. It is content discipline.

The current product still has four problems:
- the top of the Profile and result pages still sounds too much like internal project language
- the Security module still centers alliance-manager / outside-response logic too often
- some cases remain under-specified, so omitted facts do too much work
- public-facing surfaces still describe an older product state

This phase is a focused refinement pass. It is not a new-concept phase.

## Goals

1. Make the top of Foundation, module, and Profile surfaces answer "so what" in plain English.
2. Add a real `Actor lens` card type and use it to diversify module perspective coverage without collapsing into role-play.
3. Rewrite the most underdetermined cases so actor role, crisis stage, attribution, and immediate constraint are explicit.
4. Reduce label and precision clutter above the fold.
5. Bring the public root / Explore / Methods / README closer to the product that now actually exists.

## Non-goals

Do not do any of the following in this phase:
- no new focus-area modules
- no crisis lab or simulation work
- no percentile / rarity / popularity layer
- no database or account system
- no major scoring redesign unless required by the new card type
- no broad compare/share expansion beyond preserving what already exists

## Main product rules

### 1. Standard mode must read like a product, not a spec

Above the fold, every main result surface should answer four questions only:
- what is the main read?
- what pulled hardest?
- what shifted under pressure?
- what is the one thing this still does not settle?

Do not lead with methods, caveats, or architecture language.

### 2. Deep-dive can stay denser, but not self-conscious

Deep-dive can keep more labels, evidence, and nuance.
It should still sound like an editor explaining the result, not like a model managing its own uncertainty.

### 3. Actor-lens is not role-play

`Actor lens` means:
- choose the logic that would look strongest from that actor's strategic position
- do not choose what you personally want that actor to do
- do not score these cards as if they were normal own-judgment decision cards

This card type exists to reveal perspective-modeling and asymmetry, not endorsement.

### 4. Module lanes are issue-file lanes, not latent mini-scales

Security and Technology should keep three visible lanes.
The UI should treat them as tilts / tendencies, not scientific subscales.
Avoid over-emphasizing 4.8 vs 5.0 style precision.

## Required scope

### A. Rewrite the top of the Profile page

Replace internal-project voice like:
- controlled synthesis
- integrated payoff is not a cleaner box
- smooth the tension away

with plain-English copy.

Desired top structure:
1. one sentence headline
2. one short paragraph: what this usually means
3. three concise callouts:
   - what stayed stable
   - what hardened in Security
   - what hardened in Technology
4. one short tension / unresolved question block

Keep Atlas, evidence, and method details lower on the page.

### B. Rewrite the top of the Foundation result page

Desired Standard-mode top structure:
1. one clear read
2. dimension visual
3. strongest signals
4. one sentence on where the result is broad, sharp, or mixed
5. CTA to take a module / inspect the profile

Demote or collapse:
- long tradition comparison
- heavy explanatory meta
- readings / glossary / detailed methodology
- speculative "how this may travel across issues" content

### C. Tighten module result pages

Desired Standard-mode top structure:
1. one main issue read
2. three lane tilts
3. one sentence on how this differs from the Foundation
4. one sentence on what remains unresolved

Below fold:
- explanation vs decision split
- evidence log
- module details / method note

### D. Add `Actor lens` card type

Update the schema, UI badges, instructions, scoring/result handling, and any relevant tests.

Required visible badges:
- Explanation
- Decision
- Actor lens

Required instruction text (or very close equivalent):

> Read the scene first, then the tradeoff.
> 
> - On **Explanation** cards, choose the logic that best explains the case.
> - On **Decision** cards, choose the consideration that should carry the most weight in the response.
> - On **Actor lens** cards, choose the logic that would look strongest from that actor's own strategic position.
> 
> Answer from your own analytic judgment - not from what sounds most moderate or most publicly defensible. If another option also fits, add it as your second-most persuasive answer.

### E. Perspective-balance pass on the modules

Each full module should cover, across its full question set:
- one status-quo coalition-manager case
- one rival / rising-power case
- one exposed smaller-state case
- one nonaligned or hedging middle-power case
- one developmental / dependency case
- one legality / regional-authority case

This can be implemented with metadata and content auditing.

### F. Rewrite the most underdetermined cards first

Required first targets:
- Security: Taiwan quarantine
- Security: gray-zone sabotage
- Security: Iran nuclear threshold
- Technology: military AI deployment
- Technology: export controls / containment critique (if still too one-sided)

Every rewritten case must specify:
- actor role
- crisis stage
- attribution quality (if relevant)
- immediate constraint / dilemma

### G. Public surface alignment

Bring the public-facing copy closer to the actual product.

Required:
- home hero should not lead with "A prototype classification tool"
- Explore should not repeatedly describe the product as only "the quiz"
- Methods should describe the current Foundation + focus-area + Profile architecture
- README should stop sounding like a blank scaffold

Manual follow-up may still be needed for GitHub About text and Vercel production deployment.

## Label discipline rules

Above the fold, do not show more than two label-like summary objects at once.

Good examples:
- closest tradition
- one style tag

Bad examples:
- closest tradition
- runner-up tradition
- strategy style
- normative style
- atlas pattern
- tension state
all visible together at the top.

## Copy rules

Use plain English first.

Prefer:
- you usually start with...
- when issues get hard, you tend to...
- you are more willing to...
- you are less likely to...
- this stays stable across domains...
- this shifts once the issue becomes...

Avoid or sharply reduce:
- X matters
- you think X matters
- controlled synthesis
- integrated payoff
- nearest-fit shorthand
- broad-spectrum baseline as headline copy
- true tension as a standalone label with no explanation
- case by case as a summary without explanation

## Acceptance criteria

Phase 6E is done when all of the following are true:

1. The top of the Profile reads like a product explanation, not internal architecture notes.
2. The Foundation result top is shorter and plainer.
3. Module results feel like issue files with tilts, not mini-identities.
4. `Actor lens` exists end to end: schema, UI, instruction, scoring/output, tests.
5. The rewritten Security and Technology cards are more specific and less coalition-manager-coded.
6. Public site copy is materially closer to the current product.
7. Lint, tests, and build all pass.

## Suggested implementation order

1. Add `Actor lens` card type and instruction layer.
2. Rewrite the highest-priority Security and Technology cases.
3. Update module result language and label discipline.
4. Rewrite Foundation/Profile top blocks in plain English.
5. Align home / Explore / Methods / README surfaces.
6. Add or update tests.

## Explicit deferrals

Keep these out of this phase:
- crisis lab
- more modules
- mirror-world mainline
- compare/social expansion beyond preserving what exists
- data collection or logins
- any major scoring overhaul beyond what `Actor lens` requires
