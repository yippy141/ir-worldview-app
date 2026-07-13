---
target: V16 Perspective Field — Field Explorer
total_score: 31
p0_count: 0
p1_count: 1
timestamp: 2026-07-12T19-52-19Z
slug: components-field-field-explorer-tsx
---
## Design Health Score

| # | Heuristic | Score | Key issue |
|---|---|---:|---|
| 1 | Visibility of system status | 3 | Save, filter, loading, and copy states are explicit; the empty Reference layer still looks like an available feature. |
| 2 | Match with the real world | 3 | The policy-journal voice is strong, though “field,” “projection,” and evidence-status vocabulary still asks readers to learn the model. |
| 3 | User control and freedom | 4 | Answers never auto-advance, review is required, navigation reverses, and saved runs can be removed. |
| 4 | Consistency and standards | 3 | Object types are distinguished consistently; repeated card and panel treatments flatten hierarchy. |
| 5 | Error prevention | 4 | Baseline binding, fail-closed Reference visibility, bounded payloads, and explicit generation provenance prevent destructive cross-link behavior. |
| 6 | Recognition rather than recall | 3 | Persistent role context and semantic lists help; the Field’s layer/filter vocabulary remains cognitively dense. |
| 7 | Flexibility and efficiency | 3 | URL filters, keyboard movement, drafts, and direct result links work; full inventory paths remain intentionally long. |
| 8 | Aesthetic and minimalist design | 2 | Typography is editorial, but six similar brief cards and recurring bordered panels create visible template repetition. |
| 9 | Error recovery | 3 | Invalid links, blocked storage, and clipboard failure now recover visibly; future scenario/projection version compatibility is not yet version-routed. |
| 10 | Help and documentation | 3 | V16 method disclosure is substantial; core map limitations still sit away from the first interaction. |
| **Total** |  | **31/40** | **Good, with one release-level content gap** |

## Anti-Patterns Verdict

**LLM assessment:** The product does not read like a generic SaaS dashboard. The typography, restrained palette, and editorial sequence fit the policy-journal brief. The clearest AI-made tell is structural repetition: six role briefs use the same bordered card grammar, and many later surfaces reuse kickers, side rules, and panels with limited compositional variation.

**Deterministic scan:** The Impeccable CLI detector returned an empty findings array for `components/field/field-explorer.tsx`. This is accurate for its rule set, but it does not invalidate the source-review finding about repeated card composition or the release content gap.

**Visual overlays:** No reliable overlay was injected. The isolated detector assessment could not discover an in-app browser, and the available evaluation surface is read-only. Later release QA inspected the 390px and production surfaces without an overlay.

## Overall Impression

The interface now communicates a serious editorial instrument and protects the distinction between a personal baseline, a contextual run, and a public coded posture. The largest remaining opportunity is to make the Field feel complete without publishing evidence that has not earned publication: production correctly shows zero Reference Profiles, so the full V16 promise is not yet deliverable.

## What’s Working

- The Perspective flow keeps one decision on screen, preserves the role brief in a sticky context strip, requires review, and makes save/delete state explicit.
- Map/list parity, 44px targets, keyboard navigation, strong focus treatment, and reduced-motion rules make the Field materially more usable.
- Method copy now states authored placement, the seven-to-two projection, Atlas midpoint assumptions, evidence gates, and the absence of a calibrated map distance.

## Priority Issues

### [P1] The production Reference layer is empty

**Why it matters:** Reference Profiles are a named V16 pillar, but all four thinker records are single-coder drafts. Publishing them would violate the method; hiding them leaves the layer without payoff.

**Fix:** Complete independent review for a small thinker set, resolve disputes, verify every linked source, and explicitly change only those records to public/published.

**Suggested command:** `$impeccable harden`

### [P2] Repeated cards flatten the six Perspective briefs

**Why it matters:** Readers scan six nearly identical bordered cards with the same kicker, agenda, metadata, and action rhythm. The content feels more templated than editorial.

**Fix:** Introduce one compact comparative index treatment and reserve the full brief composition for the selected role.

**Suggested command:** `$impeccable distill`

### [P2] The mobile Field delays the semantic list payoff

**Why it matters:** On a narrow screen, layer controls and filters precede the list. A reader can spend substantial effort configuring an empty or sparse view before reaching the actual entries.

**Fix:** Keep the active-layer summary visible, collapse secondary filters, and move the result count plus first list group closer to the view switcher.

**Suggested command:** `$impeccable layout`

### [P2] Version compatibility remains procedural

**Why it matters:** Scenario-set and projection versions are validated, but a future version bump can make an old Perspective or Profile V2 link unreadable unless old definitions remain routed.

**Fix:** Add explicit supported-version registries and frozen fixtures before the first scenario or projection revision ships.

**Suggested command:** `$impeccable harden`

## Persona Red Flags

**Policy reader arriving from a shared link:** The result is now safely read-only and recoverable, but the map vocabulary still requires a Methods visit to understand what spacing does not mean.

**Mobile first-time reader:** The Perspective start and sticky brief work at 390px. In the Field, the control rail can still dominate before the reader reaches a substantive list item.

**Editorial reviewer:** Drafts fail closed in production and evidence is linked by dimension. The reviewer still lacks a dedicated strongest-source marker and a compact second-reader workflow summary.

## Minor Observations

- The manual share-link input is a sound fallback, though a successful native copy remains the cleaner path.
- The four tradition anchors remain appropriate on explanatory result maps; the Explorer correctly hides them to preserve semantic list parity.
- One-decimal dimension comparisons are legible, but future copy should continue avoiding statistical language around small shifts.

## Questions to Consider

- Should V16 launch without a Reference layer, or wait for two to four independently reviewed thinker profiles?
- Should the six Perspective cards become a compact comparison table on desktop and an index list on mobile?
- Before any projection or scenario revision, who owns the frozen-version compatibility registry?
