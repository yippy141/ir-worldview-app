# Phase 6C — Content Discipline, Standard-Mode Compression, and Exploration Lite

## Why this phase exists

Phase 6B2 appears to have fixed the catastrophic Foundation collapse bug. The architecture is now mostly correct:
- Foundation baseline
- Focus-area modules
- Integrated Profile

The remaining problems are no longer taxonomy or identity problems. They are:
- module content is still too broad, too context-leaky, and too coalition-manager/U.S.-allied coded
- answer options are still sometimes memo fragments rather than one clean logic
- Standard-mode results are still too meta, too boxy, and too jargon-heavy
- the Profile is better, but still too memo-like and not visually dominant enough
- the product still lacks a light “return/explore” layer; users cannot yet see the map of possible profile patterns in a satisfying way
- public-surface naming and copy still drift between “quiz,” “tool,” “inventory,” “foundation,” “modules,” and “profile”

This phase is the last major pre-friend-round consolidation pass.

It intentionally combines what would otherwise be two or three smaller iterations:
1. content tightening
2. Standard-vs-Deep-dive compression and payoff cleanup
3. a lightweight exploration layer (Atlas Lite)

It does **not** include:
- Crisis Lab / simulation
- new focus-area modules
- full friend comparison / dual-profile compare page
- public percentile / rarity claims
- live data collection or aggregation

## Product stance for this phase

The product is:
- **IR Worldview Inventory** = whole product
- **Foundation** = baseline worldview instrument
- **Focus-area modules** = issue-area stress tests / issue files
- **Profile** = integrated cross-domain synthesis

Use the word **quiz** only in casual UI language if absolutely necessary (for example, a button label), but not as the formal noun system.

## Goals

### Goal 1: Make module content tighter and more answerable

Each focus-area module should feel like a structured issue file, not a basket of smart adjacent cases.

#### Module structure remains:
- Security, Strategy, and Statecraft
- Technology, AI, and Geoeconomics

#### Visible lanes remain, but now become stricter production units:

Security lanes:
- Deterrence and escalation
- Alliances and autonomy
- Order, legitimacy, and protection

Technology lanes:
- Controls and dependence
- Capacity and industrial policy
- Governance, access, and safety

#### Content rules

Every scenario/tradeoff card must follow these rules:
1. **One case = one primary dilemma**
2. **One option = one primary logic**
3. Every card must have:
   - `scene` (1–2 sentences)
   - `whyHard` (1 sentence)
   - `contextBullets` (optional drawer)
4. The card must be answerable by a smart non-specialist after reading the card once
5. No answer option should mix diagnosis + prudence + coalition logic + legitimacy + domestic politics all in one paragraph
6. Avoid rhetorical moderation as the “best-sounding” option

#### Perspective-balance matrix

Each full module should visibly cover all of these roles across its cards:
- alliance manager / status quo coalition actor
- rival or rising-power logic
- exposed ally or vulnerable smaller state
- nonaligned / middle-power hedging logic
- developmental / dependency / capacity-constrained actor
- legality / protection / humanitarian authority logic

This should be implemented as metadata and used to audit the case bank.

#### High-priority card rewrites

At minimum, revisit these cards first:
- Taiwan blockade / quarantine response
- gray-zone sabotage / infrastructure coercion
- semiconductor export controls / chokepoints
- military AI deployment / adoption threshold
- any card where attribution, actor role, or crisis stage is still underspecified

## Goal 2: Standard mode should feel like payoff, not methods disclaimer

The Standard result surfaces should read like a smart editorial explanation, not a cautious issue memo.

### Standard mode rules

Above the fold on Foundation / module / Profile pages should prioritize:
1. what the user got
2. the strongest signals
3. what shifted or stayed stable
4. what this tends to mean
5. one challenge / pressure point

### Deep-dive mode can keep more of:
- explanation vs decision nuance
- methodology notes
- evidence logs
- tradition comparison
- reading list

### Standard mode copy rules

- shorter sentences
- fewer taxonomy words
- fewer labels like “conditional,” “mixed,” “nearest fit,” “issue read,” “broad-spectrum” in the visible hero zone
- plain English before theory language
- no section should repeat what the previous section already said

### Standard mode section hierarchy (target)

#### Foundation result
Above the fold:
- hero
- one plain-English summary paragraph
- main dimension visual
- three strongest signals
- one stability/tension or low-differentiation note
- CTA to take a module

Below the fold / collapsible:
- closest traditions
- deeper interpretive blocks
- why the model landed here
- pressure-test
- readings
- methods / caveats

#### Module result
Above the fold:
- hero issue read
- three lane visuals
- one summary of what pulled hardest
- one comparison with Foundation
- one challenge / caveat

Below the fold / collapsible:
- explanation vs decision split
- evidence log
- methods / what this does not mean

#### Profile
Above the fold:
- one integrated sentence
- one dominant visual spine with module overlays
- biggest shift in Security
- biggest shift in Technology
- one stable trait that persisted
- one unstable or contested trait

Below the fold:
- longer integrated read
- evidence drawers
- glossary / methods

## Goal 3: Reduce boxiness and improve visual hierarchy

Target style:
- calmer editorial surface
- fewer bordered/tinted containers
- one dominant visual per page
- fewer uppercase micro-headings
- whitespace/hairlines over repeated cards

Implementation direction:
- replace some boxed panels with plain sections
- collapse evidence and methods sections by default
- reduce top-bar weight and over-inset layout where practical
- keep one or two tinted surfaces max per result page

Do not overbuild or introduce dashboard clutter.
Do not use radar charts.
Do not add decorative consultant-ware.

## Goal 4: Add Exploration Lite (Atlas Lite)

The product still lacks a “return/explore/map” layer. This phase adds the lightest useful version.

### Atlas Lite

Add a lightweight page that shows a small map of canonical profile patterns grounded in the current model.

Purpose:
- let users see that there are multiple recognizable patterns in the inventory
- give a sense of neighboring profiles and possible combinations
- add some return/explore value without pretending to be psychometrically complete

### Scope rules

Atlas Lite is **not**:
- a rarity map
- a percentile distribution
- a public leaderboard
- a live user-data aggregation page

Atlas Lite **is**:
- a curated browse page of 8–12 canonical profile patterns
- each pattern should include:
  - name
  - one-line description
  - strongest likely drivers
  - likely module shifts
  - neighboring profiles

### Result-page integration

Foundation and Profile pages should include:
- nearest atlas pattern
- 1–2 neighboring patterns worth exploring
- a link to Atlas Lite

This should be editorial and curated, not algorithmically overconfident.

## Goal 5: Keep explanation and decision distinct where it matters

Phase 6B introduced Explanation / Decision / Both labeling.
Phase 6C should preserve and use that distinction more clearly in result copy and lane summaries.

At minimum, module results and Profile should be able to say things like:
- “You explain this issue structurally but decide more cautiously.”
- “Your strongest explanation is power- and control-first, but your preferred response remains coalition-preserving.”

Do not flatten these back into one generic label.

## Goal 6: Low-differentiation mode must remain honest

If the Foundation is broad-spectrum or only weakly differentiated:
- say so clearly
- do not dress moderation up with label soup
- nearest fit should remain shorthand, not the main claim

Likewise, if the Profile shows stability rather than deep tension:
- say what remains stable
- do not force tension language

## Data / schema expectations

Where helpful, extend existing content schema with metadata such as:
- lane
- cardType
- perspectiveTags
- knowledgeLoad
- scene
- whyHard
- contextBullets
- actorLens (optional)
- moduleCategory / atlas tags

Do not create a giant new system if current schema can handle this with small extensions.

## Acceptance criteria

### P0
- Foundation scoring stays trustworthy and distinct fixtures produce distinct outputs
- No new collapse/default/fallback bug

### P1
- Standard mode results are visibly shorter, plainer, and less meta above the fold
- Module cards feel more targeted and less memo-like
- Security and Technology both visibly reflect perspective-balance rules across their case sets
- Profile page has clearer dominant visual hierarchy and less card soup
- Atlas Lite exists in a minimum viable form and links from Foundation/Profile

### P2
- Explanation vs Decision distinction shows up in module/profile synthesis when materially relevant
- Public-surface naming is cleaned up on the current working branch

## Explicit deferrals

Do not build these in Phase 6C:
- Compare-with-friends page
- Live multi-user data features
- Percentiles / rarity claims
- Crisis Lab / simulation
- New focus-area modules
- Full fictional universe / mirror-world mainline

Those belong later, after content validity and payoff are stronger.

## Working principle for this phase

The question is no longer “what is this product?”
The question is:
**Does the product feel sharper, clearer, and more useful after the user finishes it?**

That is the standard for this phase.
