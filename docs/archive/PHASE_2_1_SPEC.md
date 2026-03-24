# PHASE 2.1 SPEC — Stability, discrimination, and editorial depth

## Objective

This phase is a **stabilization + depth pass**.

The current build has three major problems:
1. core route failures (`/results/[payload]` decode failure and `/explore/[slug]` 404s)
2. scenario answer architecture that invites users into the “reasonable middle” by design
3. an Explore section that is too thin to feel like a true editorial companion to the quiz

Phase 2.1 should fix those issues before any larger expansion.

---

# PRIORITY ORDER

## P0 — Fix broken functionality

### 1. Fix result payload generation and decoding
**Problem:** clicking “Generate my result” can route to `/results/[payload]`, but the result page rejects the payload as invalid.

### Required implementation
- Create a single shared utility: `lib/share.ts` or `lib/result-payload.ts`
- It must export:
  - `encodeSharePayload(...)`
  - `decodeSharePayload(...)`
  - `isValidSharePayload(...)`
- The same functions must be used by:
  - review screen when generating the URL
  - result route when decoding the URL

### Payload format
Use a compact URL-safe JSON payload:

```ts
export type SharePayload = {
  v: 1
  fk: FamilyKey
  sm: string
  nm: string
  nk: FamilyKey
  ds: Record<DimensionKey, number>
}
```

### Encoding rules
- JSON stringify
- UTF-8 encode
- base64url encode (`+` → `-`, `/` → `_`, remove trailing `=`)
- decode must reverse the process exactly
- dimension scores should be rounded to **1 decimal place** before encoding

### Validation rules
Decoder must check:
- `v === 1`
- all required keys exist
- `fk` and `nk` are valid family keys
- `ds` contains all expected dimension keys
- all dimension values are finite numbers within `1.0` to `7.0`

### UX fallback
If decoding fails:
- show a polite invalid-result page
- explain the likely reasons
- offer links to quiz, explore, and methods
- do **not** expose raw parser errors to the UI

### Acceptance criteria
- A result generated from the review page always opens successfully in a new tab or pasted URL
- Copied result links open on a clean browser session with no localStorage

---

### 2. Fix `/explore/[slug]` routes
**Problem:** perspective pages linked from Explore can return 404.

### Likely causes to check
- mismatch between family keys and route slugs
- `constructivist` vs `constructivism` naming inconsistency
- missing `page.tsx` in `app/explore/[slug]/`
- link generation from a separate string source rather than a shared config

### Required implementation
Create a single source of truth for worldview metadata:
- `lib/worldview-config.ts`

It must define, per worldview:
- `key`
- `slug`
- `label`
- `shortLabel`
- `dek`
- `colorAccent` (optional)

All of these must drive:
- result labels where relevant
- explore cards
- dynamic route lookup
- neighboring worldview references

### Canonical slugs
Use these exact slugs in this phase:
- `realism`
- `institutionalism`
- `constructivism`
- `critical-political-economy`

Map them explicitly to internal family keys:
- `realist`
- `institutionalist`
- `constructivist`
- `criticalPoliticalEconomy`

### Acceptance criteria
- Every worldview card on `/explore` resolves to a working detail page
- Manually visiting each slug works
- No worldview detail route depends on fragile string inference

---

## P1 — Improve quiz discrimination

### 3. Reduce the “default B” problem in scenario items
**Problem:** many scenario items are currently structured as:
- A = hardline position
- B = measured compromise
- C = opposite hardline position

That makes B feel like the “smart” or “adult” answer rather than one distinct worldview logic.

### Product decision
Do **not** fully redesign the entire scenario engine in this phase.
That is too big.

Instead, do a targeted Phase 2.1 fix:
- rewrite the most obviously compromise-shaped scenario options
- make each option reflect a different *logic* rather than a different *temperature*
- where necessary, relabel option order so the moderate-sounding answer is not always in the middle

### Specific content rules
For each scenario:
- every option should sound like something an intelligent analyst could sincerely believe
- options should differ by priority structure, not just intensity
- avoid obvious “extreme / moderate / extreme” sequencing
- randomizing option order is **not** required in this phase

### Initial target scenarios
Prioritize revising:
- humanitarian intervention
- strategic technology / export controls
- institution capture / reform vs bypass
- ally trade agreement / relative vs absolute gains

### Example rewrite principle
Bad:
- A: never intervene
- B: intervene only in extreme cases and narrowly
- C: intervene whenever stakes are high

Better:
- A: legality first — coercive action without UNSC authorization damages order more than it helps
- B: regional legitimacy + threshold — limited action can be justified if threshold and mandate are narrow
- C: moral primacy — sovereignty should not block action when large-scale killing is underway

These are still three options, but they are framed as different organizing logics.

### Acceptance criteria
- At least 4 scenario clusters are rewritten under this principle
- A reasonable reviewer can no longer identify a single “default sensible middle” in each case

---

### 4. Add optional neutral clarifications to confusing questions
**Problem:** some prompts are too compressed or abstract (for example, question 2).

### Required implementation
For every core question, support an optional collapsed clarification block.

UI behavior:
- small text link: `What this is asking`
- expands inline beneath the prompt
- collapsed by default
- animation optional, subtle only

### Clarification writing rules
Clarifications must:
- explain what distinction the item is getting at
- define difficult terms in plain language
- avoid naming theorists or schools unless essential
- avoid telling the user which interpretation is more nuanced

### Required questions to clarify in this phase
At minimum, add clarifications to:
- q2
- q4
- q7
- q11
- q14
- any new core items introduced in the 21-item set

### Acceptance criteria
- Clarifications are available inline without leaving the flow
- They improve comprehension without inflating length or biasing responses

---

## P2 — Deepen Explore into an editorial field guide

### 5. Expand `/explore` and worldview detail pages
**Problem:** Explore currently feels too thin. It should be a destination in its own right.

### Product goal
Create an experience loosely analogous to “type explorer” pages, but more academically honest.

### Home explore page should include
1. Intro section: what Explore is for
2. The 4 modeled worldview families
3. Strategy modifiers
   - Restrainer
   - Hedger
   - Maximizer
4. Normative modifiers
   - Pluralist
   - Conditional Solidarist
   - Universalist
5. Example composite profiles
6. Coverage gaps / traditions not yet fully modeled

### Important editorial note
The page must explicitly say:
- this is **not** a claim that IR views reduce to fixed personality boxes
- the quiz measures continuous dimensions
- the labels are shorthand for recurring patterns in answers
- many people will sit between families or combine them

### Detail pages for each worldview family
Each of the 4 worldview detail pages should include:
1. A strong plain-English definition
2. What this family sees most clearly
3. What it tends to underweight
4. Signature arguments
5. Common internal splits or variants
6. How it differs from neighboring families
7. Suggested readings
8. “How this model captures it — and what it misses”

### Additional pages/sections
Do **not** create separate fully scored family pages yet for:
- feminist IR
- postcolonial IR
- green IR
- English School

Instead, include them under a clearly labeled section:
**Important traditions not yet fully modeled**

For each, provide:
- 1–2 paragraph explainer
- what the current quiz captures partially
- what it currently misses

### Example composite profiles
Add a section that introduces the idea of combinations without pretending they are fixed natural types.
Use 6–8 example composites such as:
- Critical Institutionalist • Restrainer • Pluralist
- Strategic Realist • Hedger • Pluralist
- Social Constructivist • Restrainer • Conditional Solidarist
- Critical Political Economist • Restrainer • Universalist

For each composite, include:
- one short paragraph
- what answers usually generate it
- why nearby users may still differ meaningfully

### Acceptance criteria
- Explore becomes a genuinely useful standalone section
- It explains why the tool uses named profiles while still relying on continuous dimensions

---

## P3 — Sharing and saving

### 6. Improve result sharing
Add the following to the result page:
- Copy link
- Native share button on supported devices (`navigator.share`)
- Print-friendly layout via `@media print`
- Button text: `Save or print as PDF`

### Product note
Do **not** build a custom PDF generation pipeline in this phase.
A print stylesheet is enough and more maintainable.

### Print stylesheet requirements
- hide nav and unnecessary controls
- keep result title, summary, drivers, tensions, dimension profile, glossary, and readings
- ensure bars still print legibly in grayscale
- avoid page breaks inside key sections where possible

### Acceptance criteria
- User can copy a stable result link
- User can use system share on supported browsers/devices
- User can print/save a clean PDF from the browser

---

## P4 — Visual refinement

### 7. Move accent palette to mahogany / dark red
The current green accent is not aligned with the desired brand direction.

### New color direction
Use approximately:
- paper background: `#f7f2ec`
- panel background: `#fffdf9`
- text: `#1b1716`
- muted text: `#6f6762`
- border: `#ddd3ca`
- primary accent: `#6b1f1a` or similar mahogany
- primary accent hover: slightly darker/browner variant
- optional minor accent: muted brass `#b08a5a` used sparingly

### Rules
- no bright green anywhere
- no black hero sections or stark inverted routes
- worldview detail pages must inherit the same theme as the rest of the site
- selections, progress fills, buttons, and links should use the new accent

### Acceptance criteria
- Theme is coherent across quiz, results, methods, explore, invalid-result page, and 404 page
- Brand feels closer to the uploaded mark and Substack identity

---

# ROUTE STRUCTURE AFTER PHASE 2.1

Required routes:
- `/`
- `/quiz`
- `/quiz/review`
- `/results/[payload]`
- `/explore`
- `/explore/[slug]`
- `/method`

No route should fall back to an unrelated default visual theme or generic black 404 if a themed page exists.

---

# DECISIONS ON NATIONAL / CULTURAL PERSPECTIVES

## Not in scoring for this phase
Do **not** change scoring based on nationality, citizenship, or geography.

## Allowed in editorial content
It is acceptable to add a short editorial note on Explore or Methods saying:
- mainstream IR theory has historically been Western-centered
- strategic cultures can shape how people interpret the same question
- future versions may include comparative strategic-culture modules

Keep this contextual, not algorithmic.

---

# APPENDIX — CONTENT DIRECTION NOTE

The product should move closer to this positioning:

> A serious interactive for mapping how people reason about world politics — not by forcing them into airtight boxes, but by showing which traditions, tradeoffs, and tensions best describe their assumptions.

That sentence should guide both design and copy.
