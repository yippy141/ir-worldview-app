# IR Worldview Inventory — Phase 2 Spec (Updated after Claude questions)

## Goal of this pass
Implement **Phase 2 / P0 only**.
The aim is to turn the app from a promising prototype into a more coherent editorial product.

This pass should prioritize:
1. route architecture and trust
2. question-bank quality
3. shareable results
4. an educational Explore layer
5. a less “vibe-coded” information architecture

---

## Direct answers to Claude’s questions

### Q1 — New question content
**Decision:** do not block on another approval round. Implement now using the exact 21-item question bank in **Appendix A**.

Reason:
- the thin question set is one of the biggest credibility problems
- delaying for another wording loop adds friction without much upside
- we can do QA after implementation, but the content direction should be fixed now

Rule:
- if a tiny wording tweak improves plain-English readability, that is allowed
- do not change the construct being measured
- note any nontrivial copy deviations in the implementation summary

### Q2 — Explore content depth
**Decision:** implement now. Do not wait for another pre-approval loop.

Target:
- four modeled family pages
- one overview page
- a clear “important traditions not yet fully modeled” section

Writing target:
- roughly **450–700 words per modeled family page** plus structured subheads / bullets
- overview page should be shorter and more navigational

Reason:
- the site needs a real educational layer now
- the quiz becomes much more credible when users can understand the worldview families before or after taking it

### Q3 — Landing page register
**Decision:** use a short editorial note **plus** a small amount of restrained onboarding.

What the landing page should contain:
- title / framing sentence
- short note on what the inventory measures
- short note on what it does not measure
- estimated completion time
- CTA row:
  - Take the quiz
  - Explore the perspectives
  - Resume quiz (only if draft exists)

Do **not** build:
- a startup-style feature list
- a long “how it works” sales page
- a giant hero with vague copy

### Q4 — Brand and nav
**Decision:** yes, the brand should link to `/`.

Preferred header structure:
- brand links home
- nav links: `Explore`, `Method`
- a clear quiz CTA on the right: `Take the quiz`

If a local draft exists, you may label the CTA `Resume quiz` **on the landing page**, but do not make the global nav depend heavily on client-only state.

---

## Architectural clarifications

### 1) Edit-from-review flow
Use the following behavior:
- Review page shows all answers with `Edit` links
- `Edit` routes to `/quiz?q={index}&from=review`
- quiz page enters **review-edit mode**
- in review-edit mode, show a clear `Return to review` action
- keep Back / Next navigation available
- when the user reaches the final question in review-edit mode, the completion action returns them to `/quiz/review`
- do not show results on `/quiz`

This is deliberate and high-trust.

### 2) Canonical result path
Results should be available **only** through `/results/[payload]`.

That means:
- remove inline results rendering from `/quiz`
- after review, generate payload and route to `/results/[payload]`
- refresh, share, and direct open must all work from the result route

### 3) Resume-draft behavior
Landing page should detect localStorage state and offer:
- `Resume quiz`
- `Start over`

Implementation note:
- use a small client CTA component rather than converting the full landing page to a client component

### 4) Share payload format
Use a compact, versioned, URL-safe payload.

Recommended shape:
```ts
type SharePayload = {
  v: 2
  ds: [number, number, number, number, number, number, number]
  fk: FamilyKey
  nk: FamilyKey
  sm: StrategyModifier
  nm: NormativeModifier
}
```

Notes:
- `ds` is a fixed-order dimension score array to keep the payload shorter
- round to 2 decimal places before encoding
- use URL-safe Base64 without padding
- if later result narratives depend on scenario-specific signatures, add them in a future payload version rather than widening this one now

Invalid payload should render a friendly fallback page with links to:
- Take the quiz
- Explore the perspectives
- Method

---

## Product decisions on priority

### Build now in this pass
1. landing page with resume behavior
2. `/quiz` route and `/quiz/review` route
3. canonical `/results/[payload]` route
4. 21-item core bank with clarifications
5. Explore overview + four modeled family pages
6. design refinement that reduces repeated-card / repeated-panel feel

### Defer to later
- new scored families for feminist IR, postcolonial / decolonial IR, green IR
- nationality-adjusted scoring
- user accounts / backend persistence
- aggregate analytics dashboards

---

## Design direction for this pass
The app still risks looking “vibe-coded” if every page is just stacked bordered boxes. This pass should correct that.

### Required design moves
- reserve bordered panels for summary blocks, controls, and compact callouts
- let long-form reading pages feel more like articles
- use whitespace, dividers, and hierarchy more aggressively
- reduce the sense that every section is the same component repeated nine times

### Page-specific notes
#### Landing page
Should feel like an editorial invitation, not a control panel.

#### Review page
Should feel tabular / list-like and deliberate.
Use rows, dividers, section headers, and answer summaries rather than card stacks.

#### Result page
Should feel like a long-form interpretation page.
A good structure is:
- article-like hero
- summary block / quick facts
- main interpretation body
- linked paths into Explore and Method

#### Explore and Method pages
Should feel readable and reference-like.
Use comfortable line length and clean typographic hierarchy.

### Hard no
- gradients
- glass effects
- novelty charts
- generic startup metric tiles
- pseudo-scientific dashboards

---

## Explore section scope

### `/explore`
Must include:
- short introduction to why IR worldviews are not one-axis politics
- cards for the four modeled families
- clear block for “Important traditions not yet fully modeled”

### `/explore/[slug]`
Build pages for:
- realism
- institutionalism
- constructivism
- critical political economy

Each page should include:
1. plain-English summary
2. what it emphasizes
3. what it often underweights or misses
4. what kinds of arguments it tends to find persuasive
5. neighboring traditions and how they differ
6. signature thinkers / starter readings
7. how fully this version of the quiz models it
8. CTA to take the quiz

### Important traditions not yet fully modeled
Include concise, honest treatment of:
- feminist IR
- postcolonial / decolonial IR
- green IR / ecological security
- English School / international society

These should be framed as:
- important
- relevant to interpretation
- not yet fully modeled as scored outputs in this version

### National / comparative context note
Do **not** add nationality-based scoring.

Do include a short note in Explore or Method that:
- mainstream IR theory has historically been Western-centered
- strategic cultures and national policy traditions shape how people read the same question
- this version measures theoretical orientation, not national-strategic identity

---

## Question clarification rules
Clarifications are required for the 21 core items.
They should be:
- collapsed by default
- brief
- genuinely helpful
- neutral in tone

Each clarification should explain:
- what the question is asking
- what it is not asking
- any unavoidable term definitions

Do **not**:
- name theory schools in clarifications
- give examples that anchor the respondent toward a specific country answer
- smuggle in persuasive framing

Recommended data shape:
```ts
clarification?: {
  title?: string
  whatItAsks: string
  whatItDoesNotAsk?: string
  terms?: { term: string; definition: string }[]
}
```

---

## Appendix A — Core question bank v2 (21 items)

All core items should use a 1–7 Likert scale.

### Security competition
#### SC1
- **Prompt:** Uncertainty about what major powers will do in the future is a lasting feature of world politics.
- **Direction:** direct
- **Clarification:**
  - whatItAsks: Whether future intentions are hard to know in a durable way, even when present relations seem calm.
  - whatItDoesNotAsk: This is not asking whether war is inevitable or whether cooperation never happens.
  - terms:
    - term: major powers
      definition: States with unusually large military, economic, or political influence.

#### SC2
- **Prompt:** States often fall into rivalry because they cannot safely rely on others for protection.
- **Direction:** direct
- **Clarification:**
  - whatItAsks: Whether the lack of guaranteed protection pushes states toward self-protective behavior and rivalry.
  - whatItDoesNotAsk: This is not saying alliances are useless or that trust never matters.
  - terms:
    - term: rivalry
      definition: A recurring relationship of competition, suspicion, or strategic contest.

#### SC3
- **Prompt:** Long periods of peace between major powers usually depend on favorable conditions that can change.
- **Direction:** direct
- **Clarification:**
  - whatItAsks: Whether major-power peace is often contingent rather than permanently solved.
  - whatItDoesNotAsk: This is not denying that institutions, trade, or diplomacy can help preserve peace.

### Institutions
#### IN1
- **Prompt:** International rules and organizations can make cooperation last longer, even when no single state can enforce them.
- **Direction:** direct
- **Clarification:**
  - whatItAsks: Whether institutions can shape behavior by setting expectations, monitoring conduct, or lowering uncertainty.
  - whatItDoesNotAsk: This is not claiming institutions always work or that power stops mattering.

#### IN2
- **Prompt:** Monitoring and repeated interaction can reduce cheating in international agreements.
- **Direction:** direct
- **Clarification:**
  - whatItAsks: Whether transparency and repeated contact can help sustain cooperation.
  - whatItDoesNotAsk: This is not asking whether every agreement is equally credible.
  - terms:
    - term: monitoring
      definition: Procedures for checking whether parties are keeping their commitments.

#### IN3
- **Prompt:** Most international institutions do little more than reflect what powerful states already want.
- **Direction:** reverse
- **Clarification:**
  - whatItAsks: Whether institutions have little independent effect beyond the interests of the strongest actors.
  - whatItDoesNotAsk: This is not asking whether powerful states influence institutions at all; the question is whether institutions matter independently.

### Domestic filters
#### DF1
- **Prompt:** Domestic coalitions and interest groups often shape foreign policy as much as external threats do.
- **Direction:** direct
- **Clarification:**
  - whatItAsks: Whether internal political forces help explain foreign policy choices.
  - whatItDoesNotAsk: This is not denying that outside pressures matter.
  - terms:
    - term: domestic coalitions
      definition: Alliances of groups inside a country that push policy in a particular direction.

#### DF2
- **Prompt:** States facing similar outside pressures can still act differently because their internal politics differ.
- **Direction:** direct
- **Clarification:**
  - whatItAsks: Whether internal institutions, leadership, or social forces can filter the same external environment differently.
  - whatItDoesNotAsk: This is not saying domestic politics always outweighs external pressure.

#### DF3
- **Prompt:** Once the balance of power is clear, regime type and public opinion usually matter little.
- **Direction:** reverse
- **Clarification:**
  - whatItAsks: Whether external power conditions explain most behavior even after internal differences are considered.
  - whatItDoesNotAsk: This is not asking whether public opinion is always decisive.
  - terms:
    - term: balance of power
      definition: The relative distribution of capabilities among major states.

### Norms and identity
#### NI1
- **Prompt:** The same military move can look threatening or reassuring depending on the relationship between the states involved.
- **Direction:** direct
- **Clarification:**
  - whatItAsks: Whether the meaning of an action depends partly on trust, status, identity, or shared expectations.
  - whatItDoesNotAsk: This is not saying military capabilities do not matter.

#### NI2
- **Prompt:** State interests are shaped partly by identity, status, and recognition, not just material advantage.
- **Direction:** direct
- **Clarification:**
  - whatItAsks: Whether interests are socially formed rather than fixed in advance.
  - whatItDoesNotAsk: This is not denying that material interests exist.
  - terms:
    - term: recognition
      definition: Being treated by others as a legitimate or respected actor.

#### NI3
- **Prompt:** Talk about legitimacy usually matters less than material interests.
- **Direction:** reverse
- **Clarification:**
  - whatItAsks: Whether appeals to legitimacy are usually secondary to material incentives.
  - whatItDoesNotAsk: This is not asking whether leaders use moral language sincerely or cynically in every case.

### Political economy
#### PE1
- **Prompt:** World politics cannot be understood without looking at production, finance, and economic dependence.
- **Direction:** direct
- **Clarification:**
  - whatItAsks: Whether economic structures are necessary for explaining international outcomes.
  - whatItDoesNotAsk: This is not saying military or diplomatic factors are irrelevant.
  - terms:
    - term: economic dependence
      definition: A situation in which one actor’s options are heavily shaped by access to another’s capital, markets, or supply chains.

#### PE2
- **Prompt:** Control over supply chains, capital, or market access can matter as much as military power.
- **Direction:** direct
- **Clarification:**
  - whatItAsks: Whether economic leverage can be as strategically important as armed force.
  - whatItDoesNotAsk: This is not limited to trade policy in a narrow sense.

#### PE3
- **Prompt:** Security crises can usually be explained without paying much attention to economic hierarchy.
- **Direction:** reverse
- **Clarification:**
  - whatItAsks: Whether economic hierarchy is usually secondary when explaining crises.
  - whatItDoesNotAsk: This is not asking whether every conflict is “really about economics.”
  - terms:
    - term: economic hierarchy
      definition: Unequal control over wealth, production, finance, or market access across the international system.

### Restraint vs maximization
#### RS1
- **Prompt:** Major powers often make themselves less secure when they chase advantages beyond what defense requires.
- **Direction:** direct
- **Clarification:**
  - whatItAsks: Whether overextension and pursuit of excess advantage can create backlash and reduce security.
  - whatItDoesNotAsk: This is not asking whether all power accumulation is bad.

#### RS2
- **Prompt:** A safer grand strategy usually means limiting commitments rather than trying to dominate every key region.
- **Direction:** direct
- **Clarification:**
  - whatItAsks: Whether strategic restraint is often safer than broad primacy.
  - whatItDoesNotAsk: This is not asking whether states should become isolationist.
  - terms:
    - term: grand strategy
      definition: A state’s broad long-term approach to security, commitments, and power.

#### RS3
- **Prompt:** When an opportunity for lasting superiority appears, a major power should usually take it.
- **Direction:** reverse
- **Clarification:**
  - whatItAsks: Whether durable strategic advantage should normally be seized when available.
  - whatItDoesNotAsk: This is not asking about short-term tactical gains or one-off battlefield decisions.

### Order vs justice
#### OJ1
- **Prompt:** International order is usually worth protecting even when it leaves serious injustices unresolved.
- **Direction:** direct
- **Clarification:**
  - whatItAsks: Whether stability and order should usually take priority when they conflict with broader moral goals.
  - whatItDoesNotAsk: This is not saying injustice is unimportant.

#### OJ2
- **Prompt:** There should be a strong presumption against intervening in another state’s domestic affairs.
- **Direction:** direct
- **Clarification:**
  - whatItAsks: Whether non-intervention should be the default rule.
  - whatItDoesNotAsk: This is not asking whether intervention is never justified.

#### OJ3
- **Prompt:** When severe mass atrocities are underway, sovereignty should sometimes give way to outside action.
- **Direction:** reverse
- **Clarification:**
  - whatItAsks: Whether extreme moral emergencies can justify overriding non-intervention.
  - whatItDoesNotAsk: This is not a blanket endorsement of regime change or constant intervention.
  - terms:
    - term: sovereignty
      definition: A state’s recognized authority over its own territory and internal affairs.

---

## Recommended file changes
### Create
- `lib/share.ts`
- `lib/explore-content.ts`
- `components/landing/resume-cta.tsx`
- `components/quiz/review-screen.tsx`
- `components/results/result-view.tsx`
- `components/results/share-actions.tsx`
- `components/explore/family-card.tsx`
- `app/quiz/page.tsx`
- `app/quiz/review/page.tsx`
- `app/results/[payload]/page.tsx`
- `app/explore/page.tsx`
- `app/explore/[slug]/page.tsx`

### Modify
- `app/page.tsx`
- `app/layout.tsx`
- `app/globals.css`
- `lib/quiz-schema.ts`
- `lib/types.ts`
- `lib/scoring.ts`
- `components/quiz-app.tsx`

---

## Acceptance criteria for this pass
Phase 2 / P0 is complete when:
- landing page exists and offers Take quiz / Explore / Resume when relevant
- brand links home
- quiz lives on `/quiz`
- review screen exists and edit-from-review flow works cleanly
- `/quiz` never renders inline results
- results are only rendered from `/results/[payload]`
- share link survives refresh and reproduces the same result
- core bank is expanded to 21 items
- each core item has a collapsed clarification
- Explore overview exists
- four modeled family pages exist
- important unmodeled traditions are acknowledged honestly
- Method remains accurate
- the product feels less like a one-page coded prototype and more like an editorial interactive

