# Phase 6A - Inventory Integration, Focus-Area Clarity, and Scenario Semantics

## Why this phase exists

Phase 5M.1 improved readability, module depth, and layout, but the product still stops one step too early.

The main unresolved problems are no longer just wording or spacing. They are structural:

1. **The product object is still unclear.** It is being called a quiz, an inventory, and a modular platform at the same time.
2. **Foundation and module outputs do not yet synthesize into one satisfying profile.** Users get elegant fragments rather than one coherent worldview object.
3. **Module language still sounds too policy-school-coded or AI-smoothed.** The modules feel more like memo exercises than a public-facing inventory.
4. **Scenario instructions are still too ambiguous.** Users can reasonably wonder whether they are choosing what they personally believe, what they think is analytically strongest, or what policymakers should do.
5. **Module claims still outrun instrument depth.** The current module outputs sound more stable and typological than the current item count can support.
6. **Global perspective is present but still underweighted.** The modules are not purely American, but U.S./allied framing still exerts too much gravitational pull.

This phase is therefore not another broad expansion phase.
It is an **integration and meaning phase**.

The goal is to turn the current product from a promising prototype with separate outputs into a more coherent public-facing inventory with:
- one naming system,
- one integrated profile surface,
- clearer scenario semantics,
- plainer module rhetoric,
- and more visible cross-domain payoff.

## Strategic judgment

Do **not** add more modules in this phase.
Do **not** reopen the worldview-family ontology again.
Do **not** create a fake master score.
Do **not** introduce nationality-adjusted scoring.
Do **not** turn the whole app into a psychometric instrument.

Instead:
- stabilize the product identity,
- connect Foundation + Focus-area modules into one integrated profile,
- tighten scenario interaction design,
- lower the rhetorical claim of the modules where needed,
- and make the product feel more authored and more coherent.

## Core product decision

The product should now be framed as:

**IR Worldview Inventory**
- **Foundation** = the baseline worldview questionnaire
- **Focus-area modules** = domain stress tests / issue reads
- **Profile** = the integrated view across completed assessments
- **Results** = individual result pages for Foundation and modules

Use the word **quiz** only as secondary informal CTA language if needed, not as the main product identity.

## In scope

### 1. Naming system cleanup

Unify naming across the app.

Required changes:
- Product name should resolve to **IR Worldview Inventory**.
- Remove or retire **The Isms Quiz** from config and visible UI.
- Replace **Flagship modules** with **Focus-area modules**.
- Replace inconsistent references to quiz/inventory when they refer to the whole product.
- Standardize page and component language so the hierarchy is obvious:
  - Inventory
  - Foundation
  - Focus-area module
  - Profile
  - Results

Optional but recommended:
- rename **Analyst mode** to **Deep-dive mode** if the wording improves clarity.

### 2. Add a discreet focus-area inspiration note

Add a short note on the Modules page and Methods page clarifying that the focus-area structure is partly inspired by how international affairs programs organize issue areas, including the SAIS MAIR curriculum, while making clear this is an independent prototype.

Suggested tone:
- factual
- low-key
- not credential-seeking
- not implying endorsement

### 3. Scenario semantics and instruction clarity

This is one of the highest-value fixes.

For scenario, tradeoff, and case-style cards:
- clearly label the card type as one of:
  - **Explanation**
  - **Decision**
  - **Both**
- rewrite the instructions so users know they are answering from **their own analytic judgment**
- explicitly distinguish:
  - what best explains the case,
  - what should carry the most weight,
  - and what they personally find most persuasive

Required instruction direction:
- do not answer based on what sounds publicly defensible
- do not answer based on what another actor in the case believes
- do not answer based on what officials currently say unless that is genuinely your own judgment

### 4. Top-2 response handling for case cards

Keep single-select for simple baseline orientation items.

For case / scenario / tradeoff cards:
- in Standard mode, keep single-select
- in Deep-dive mode, use:
  - **most persuasive**
  - **second-most persuasive**
- second choice should carry reduced weight only

Use the existing lighter-weight second-choice approach where possible rather than inventing a fully new ranking system.

Do **not** introduce full ranking of all options in this phase.

### 5. Integrated profile dashboard

This is the central product change.

Build a minimum viable integrated profile that combines:
- the Foundation baseline,
- completed module overlays,
- strongest lenses,
- strategic / normative style,
- and visible cross-domain tensions.

Important rule:
- **Do not collapse everything into one fake total score.**

The dashboard can be implemented as:
- a new `/profile` page,
- or a strongly upgraded Foundation results page that becomes the integrated profile surface,
- or both if the architecture stays simple and coherent.

#### Minimum required integrated-profile elements

1. **Headline synthesis sentence**
   Example structure:
   - “Institutionalist-constructivist baseline with restrained strategy; harder-edged in technology, mixed under security pressure.”

2. **Foundation spine**
   - compact visual summary of the main baseline dimensions
   - short plain-English labels, not opaque theory jargon

3. **Strongest lenses / closest traditions**
   - primary tradition
   - runner-up tradition
   - top 2 or 3 drivers from the Foundation

4. **Strategic and normative style**
   - plain-language labels
   - no pseudo-clever compound coinages

5. **Module overlay cards**
   For each completed module:
   - one short issue-read headline
   - 2 or 3 strongest instincts
   - one sentence on how this module differs from the baseline

6. **Cross-domain tensions panel**
   Force at least 2 meaningful tensions when enough data exists.
   Example:
   - “You prefer restraint in the baseline, but become more control-first in technology.”
   - “You trust institutions in the abstract, but lean toward coalition durability over legal formality under security pressure.”

7. **Lower evidence drawer / accordion**
   Keep selected framings, evidence logs, and detailed case recalls lower on the page.

### 6. Module claim calibration

The modules should be framed more carefully.

Required shift:
- module outputs should read as **issue reads**, **domain reads**, or **stress tests**
- not as fully stable worldview identities

That means:
- reduce pseudo-distinctive labels
- prefer plainer, interpretable language
- anchor module outputs in how they differ from the Foundation

Examples of direction:
- instead of “Conditional statecraft hedger,” prefer something like “Security read: coalition-minded restraint under pressure” or another plainer formulation
- instead of “Conditional techno-strategist,” prefer something like “Technology read: selective control with capacity-building” or equivalent

Exact wording may differ, but the rule is:
- plain English first
- no half-jargon half-MBTI identity labels

### 7. Module result redesign

Module result pages should move away from feeling like dressed-up answer sheets.

Required top-of-page structure:
1. issue-read headline
2. one-sentence explanation
3. “How this differs from your Foundation” block if Foundation exists
4. strongest instincts
5. tensions / caveats
6. evidence log lower down

Each module result should also make clear:
- what this module **did** measure
- what it **did not** claim to measure

### 8. Global perspective balancing

Do not localize scoring by nationality.
Do not ask users to role-play another actor in every question.

Instead, improve content balance.

Each focus-area module should visibly include a spread of cases or framings that cover more than one strategic location.

Minimum expectation per module:
- at least one major-power / alliance-manager framing
- at least one middle-power / hedging or nonaligned framing
- at least one small-state / vulnerability framing or lower-income / developmental framing
- at least one perspective where legitimacy, hierarchy, distribution, or dependency is not simply a reaction to U.S.–China rivalry

This does not require massive module expansion in this phase, but the balance must become more visible and deliberate.

### 9. Copy cleanup for clarity and tone

Continue cleaning up language that feels:
- AI-coded
- overly hedged
- pseudo-distinctive
- policy-school coded
- or academic for its own sake

Priority targets:
- module intros
- module result headlines
- strongest-instinct labels
- instructions
- profile labels
- navigation labels

### 10. Layout and hierarchy pass for synthesis

The current app uses too many equally weighted rounded cards.

Improve hierarchy so the integrated profile feels like a destination.

Required direction:
- one clearly dominant synthesis object above the fold
- stronger contrast between hero, summary, overlay cards, and evidence drawers
- demote repetitive explanatory blocks
- make module-vs-foundation deltas visually obvious
- preserve mobile usability

## Out of scope

- New worldview families
- Full subtype system
- Additional focus-area modules beyond current Foundation + Security + Technology
- Share cards or social comparison features
- Population rarity / percentile claims
- Psychometric validation claims
- Nationality-adjusted scoring
- Full option ranking everywhere
- Backend accounts, authentication, or cloud persistence

## Product rules

1. The whole product is the **IR Worldview Inventory**.
2. Foundation produces the **baseline**.
3. Focus-area modules produce **issue reads / stress tests**.
4. The integrated profile combines those layers without pretending they are one total ideology score.
5. Second-choice weighting belongs on case cards in Deep-dive mode, not on every item.
6. Scenario instructions must separate explanation from prescription.
7. The profile should force meaningful tensions when enough data exists.
8. If a user has not completed modules, the profile should still feel complete, while clearly inviting modules as overlays.
9. Preserve the current version before beginning work on this phase.

## Suggested data / implementation approach

Keep implementation modest and local-first.

Recommended approach:
- create or extend a lightweight **local profile store** (for example, localStorage-backed)
- save the latest Foundation snapshot and module snapshots
- read from that store to build the integrated dashboard
- avoid backend complexity for this phase

Suggested stored objects:
- Foundation snapshot
  - timestamp
  - mode
  - closest traditions
  - strongest lenses
  - baseline dimensions
  - strategic style
  - normative style
  - summary sentence
- Module snapshot per module
  - timestamp
  - mode
  - issue-read headline
  - module axes
  - strongest instincts
  - delta vs Foundation
  - tensions / caveats

## Scenario instruction guidance

Recommended baseline instruction direction:

“Answer from your own analytic judgment. On **Explanation** cards, choose the option that best explains what is driving the case. On **Decision** cards, choose the consideration that should carry the most weight. On **Both** cards, choose the option you find most persuasive overall. Do not answer based on what would sound best publicly, what officials currently say, or what another actor in the case would prefer unless that is also your own view. In Deep-dive mode, add a second choice when another option also captures part of your judgment.”

## Result-language guidance

### Avoid
- “Flagship modules”
- “The Isms Quiz”
- pseudo-clever labels like “conditional techno-strategist”
- filler phrasing such as “in this model” everywhere
- overclaiming profile stability from thin module data

### Prefer
- “Focus-area modules”
- “issue read”
- “domain stress test”
- “how this differs from your baseline”
- “where your instincts pull in different directions”
- short, concrete labels in plain English

## Success criteria for this phase

At the end of Phase 6A:

1. The product name and noun system should be consistent.
2. A user who completes Foundation + at least one module should get one integrated profile view.
3. Scenario instructions should be materially clearer.
4. Deep-dive case cards should support a primary + second choice flow.
5. Module results should sound plainer and more grounded.
6. The app should look less like separate cards and more like one authored product.
7. The current Phase 5M.1 version should remain preserved on GitHub and Vercel.

## What to defer until later

- More modules
- Shareability / virality features
- Public comparisons or rarity claims
- Any institutional partnership / SAIS branding decisions beyond the discreet inspiration note
- Larger validation / calibration questions
