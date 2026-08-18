# V23.1 Visual, Copy, and Sigil Collision Review

Status: `review record`

Outcome: **BOUNDED V23.1 PATCH REQUIRED**

Review date: 2026-08-14

Subsequent disposition: findings 1–3 remain binding only against geometry v1,
which is blocked in `V23_1_SIGIL_COLLISION_REVIEW.md` and retained as rejected
history. On 2026-08-18 the owner separately selected the exact System A
manifest for bounded editorial-beta use after automated review and accepted
the residual cultural risk. That later decision supersedes this review's
recommendation to reject System A; it does not turn this document into an
approval and does not grant universal cultural clearance.

This is an independent read-only review of the V23.1B implementation. It is not
an approval, and it is **not universal cultural clearance**. See
[Scope and limits](#scope-and-limits).

## Checkpoint

| Field | Value |
| --- | --- |
| Review branch | `claude/v23-1-design-review-9c82d7` |
| Review branch HEAD | `b06637107579ebb9bfa5f2e7be1b5c72a1642a6e` |
| Review branch status | clean |
| Implementation branch | `v23-1-archetype-explore` |
| Implementation state | 20 modified, 11 untracked, uncommitted |
| Geometry SHA-256 | `0c02d05b8bdbb814f64cb4633ba26ff467976ff8ad8fc71de630ae6fa1d7a6fe` — reproduced |
| Contact-sheet SHA-256 | `8f8328d17caf6e289240fcc0ae97c1bb5c3e7daa289d7f5bec8d2cb5681b00f2` — reproduced |

The review branch does **not** contain V23.1B. It is clean at the pre-V23.1B
checkpoint. The implementation was reviewed in place, read-only, in the main
worktree at the state described above. Both digests reproduce exactly.

## Method

- Playwright at 390, 768 and 1440 CSS px; 320 CSS px (equivalent to 400% reflow
  at a 1280 base); and `print` media emulation.
- Routes: `/explore`, `/archetypes`, all eight `/archetypes/[slug]`, one pure
  Foundation result (`P+`), one blend Foundation result (`P/R+`), `/profile`,
  one tradition page (`/explore/realism`), `/zh/explore`, `/zh/archetypes`.
- Sigils rasterized directly from `lib/archetype-sigils.ts` and diffed pairwise
  at the two production sizes plus the proofed 24px size.
- Copy analysed by extracting every authored sentence from
  `content/archetypes.json` grouped by field.

Only a gitignored `.next/` dev cache was written. No repository file was
modified during the review itself.

---

## Findings

Fifteen findings, ordered by harm.

### 1. `P+` is the capital letter H

Not "resembles" — at 24, 48, 96 and 112px, in dark, reversed and print modes,
`P+` is a geometric sans capital H. `P−` is the same H with 2px inward ticks.
On the detail hero the mark sits inside a bordered square, so it reads as a
boxed "H": a certification badge or helipad mark.

Fails the collision checklist item *"Accidental letter, number, punctuation, or
literal `+`/`-` dominance"*, which is currently unchecked.

### 2. The posture distinction is visually absent; the eight marks are effectively four

Share of inked pixels that differ between marks:

| Pair | 24px | 48px | 112px |
| --- | --- | --- | --- |
| `S+` / `S−` | 9.0% | 10.4% | 10.3% |
| `P+` / `P−` | 11.1% | 15.6% | 15.8% |
| `M+` / `M−` | 13.0% | 18.8% | 17.3% |
| `R+` / `R−` | 14.3% | 16.8% | 15.9% |
| *nearest cross-lens pair* | *52.9%* | *53.0%* | *51.3%* |

Posture is half the ontology, and it is carried by a 2-unit stub drawn at the
same 1.75 weight as the 14-unit lens strokes. **This does not improve with
size** — `S+`/`S−` is still ~10% different at the 112px hero — so it is a
failure of the construction grammar, not a small-size artifact.

Fails both *"Collision between any two of the eight marks"* checklist items.

### 3. Further letter, punctuation, and UI-convention collisions

- `M+` is `⟨⟩` — angle brackets. In any tech-adjacent context this reads as "code".
- `M−` reads as `O` / `0`.
- `R+` and `R−` both collapse toward `=` at 24px; `R−` at large size is a plain
  rounded rectangle, i.e. a button or input field.
- `S+` / `S−` are `≡` with a vertical strike. Three stacked horizontal bars is
  *the* hamburger-menu affordance, and at 390px these render on pages whose
  header carries a literal **Menu** button.

### 4. Two parallel naming systems for the same four traditions

| Source | Labels | Used on |
| --- | --- | --- |
| `FAMILY_LABELS`, `lib/worldview-config.ts:13` | Strategic Realist, Liberal Institutionalist, Social Constructivist, Critical Political Economist | result hero, 2×2 map, `/archetypes` band headers |
| `exploreFamilies`, `lib/explore-content.ts:300` | Realism, Institutionalism, Constructivism, Critical Political Economy | `/explore` §04, every tradition page |

A reader told "Closest modeled tradition: Strategic Realist" follows the link
and lands on a page titled **Realism**. The label they were given never
appears. "Closest modeled tradition: Critical Political Economist" is also
ungrammatical — a person is not a tradition.

### 5. Six of eight content fields are fill-in-the-blank templates

Across the eight records:

| Field | Instances | Frame |
| --- | --- | --- |
| `noticesFirst` | 8/8 | "This reading notices…" |
| `acceptedTradeoff` | 8/8 | "This reading accepts X in exchange for Y." |
| `strongestCaseForReading` | 8/8 | "This reading is strongest when…" |
| `strongestObjection` | 8/8 | "Its strongest objection is that…" |
| `commonFailureMode` | 8/8 | "Its common failure mode is to…" |
| `evidenceThatWouldWeakenFit` | 16/16 | "The fit would (also) weaken if…" |
| `interpretation` | 24/24 | "[Orientation] [Name] would…" |

7 of 8 "Conditional" variant lines use the identical phrase *"the authority,
stakes, and likely consequences"*. That is roughly 104 sentences on seven
frames, and each sentence restates its own section heading verbatim
("Strongest objection" → "Its strongest objection is that…").

`whyItFits` and `whereItBreaks` are the opposite — specific, varied, clearly
edited (the Ambedkar caveat, the Monnet Plan sector list, the contested ASEAN
Way). The contrast makes the templated fields read worse, not better.

### 6. The archetype is called "the assigned general identity"

`content/explore/hub.en.json:64`. This contradicts `/archetypes` ("not a
permanent type or a rank"), `/explore` §02 ("they are not population types"),
the detail page ("do not … assign people, organizations, or traditions to a
fixed type"), and AGENTS.md principle 4. It is the essentialist framing the
rest of the product explicitly disclaims.

### 7. The R lens has two public names, and a third internally

- "Rules and institutions" — `app/archetypes/page.tsx:30`
- "Rules and settlement" — `content/explore/hub.en.json:91`
- "rules" — `LENS_LABELS`, `lib/archetypes.ts:71`, used in blend glosses

Three uncoordinated definitions, already diverged in shipped copy. AGENTS.md
forbids exactly this duplication.

### 8. The result hero leaves ~500px of empty column at 1440

`foundation-result-lede` measures left 531px / right 1054px on the pure result
and 531/1054 on the blend — a half-screen void beside the map, on the primary
payoff surface. Pre-existing V22 component, outside the V23.1 contract, but
inside the scope of this review.

### 9. The normative code is surfaced raw with no key

The hero prints `P+ / j` and `P/R+ / o` in Space Mono at 12.48px. Nothing in
the UI maps `o` / `j` / `c` to Order-first / Conditional / Justice-first —
`/archetypes` names the three orientations but never gives their letters. At
that size lowercase `o` (U+006F) reads as a zero.

### 10. Two different minus characters on one page

The `/archetypes` posture key legend uses U+2212 (`−`). All eight row codes and
every archetype code use U+002D (`-`). The key does not match the labels it
explains.

### 11. Four dead sections on the archetype detail page

Nearest neighbors (`RESEARCH REQUIRED`), Blends (`WITHHELD`), Domain
expressions (`WITHHELD`), Related records ("No Current Cases or Decision
Patterns are assigned"). The two withheld blocks sit consecutively between the
orientations and the Historical comparison — the section that actually pays
off. Honest, but it puts caveat ahead of payoff, against AGENTS.md principle 6.

### 12. The contact sheet does not proof the production sizes

The sheet proofs 24 / 48 / 96 / 160-watermark. Production uses **48**
(`app/archetypes/page.tsx:107`) and **112** (`app/archetypes/[slug]/page.tsx:93`).
112px is never proofed; 24, 96 and 160 are never used. The checklist's
mark-versus-mark items only require 24 and 48. The artifact that the digests
bind does not cover the hero.

### 13. `/explore` §02 duplicates the entire `/archetypes` directory

All eight codes, names and glosses, under different band titles and different
lens descriptions. Two canonical-looking directories that have already drifted
(see finding 7).

### 14. §08 introduces four record kinds in one section

`FOCUS AREA`, `DOMAIN RESULT`, `CONTEXTUAL COMPARISON` and `SAVED JUDGMENT`
appear as four distinct eyebrow labels under one heading, with no statement of
how they relate to each other or to the archetype / tradition / Decision
Pattern tiers the page has just established.

"Module" correctly never surfaces publicly.

### 15. Directory row link names are full sentences

"Read →" is `aria-hidden`, so each row's accessible name is code + name + the
entire gloss; a screen-reader link list becomes eight paragraphs. Separately,
the hero sigil's label "Kairos archetype sigil" is announced immediately before
the H1 "Kairos".

---

## Verified as sound

- No horizontal page overflow at 320, 390, 768 or 1440 on any reviewed route.
- Print output is strong: white ground, `#111` strokes, source URLs exposed,
  disclosures expanded, status chips intact, no clipping.
- The comparison table sits in an `overflow-x: auto` container — scrollable,
  not clipped.
- Both `/zh` routes fail closed with a Chinese status surface and an English
  link. No silent English fallback.
- Tradition pages are excellent and unmistakably hand-written.
- The circular badge overlapping the `P−` sigil in dev screenshots is the
  Next.js dev-tools indicator, not a product defect.

## Historical assessment of the prior design exploration

The recommendation in this section is preserved as reviewer history and was
superseded by the owner's 2026-08-18 System A beta decision. It is not the
current production decision.

The external design exploration is better than what shipped, and the
implementation was right to reject part of it.

Rejecting **System A (Derived)** was correct: culturally-referential marks "cut
with that culture's tool" maximize exactly the religious, national and ethnic
collision surface the checklist screens for. Dropping the animation, masks,
filled-mark companion paths and share-card scope was also correct. Its **System
C (Quoted)** section is the most valuable part of the document precisely
because it records a failure rather than assuming one: four of eight archetypes
have no script to quote, and the four that do fill in at index size.

However, the document also contained the fix for finding 2, and it was
discarded. Its sigil contract specifies **three ink weights** (1.1 hairline /
2.8 rule / 3.4 primary), a **100×100 viewBox with a 20–86 safe area**, and
**"minimum size 20px — below that, use the code, not the mark."** The shipped
system uses one uniform 1.75 weight in a 24×24 box, which is the direct
mechanical cause of the posture stub vanishing into the silhouette: with no
weight hierarchy, a 2-unit modifier and a 14-unit lens stroke read as equally
important, so the eye takes the silhouette and drops the modifier.

Recommended remedies for finding 2, in order of preference:

1. Move posture into the **topology** of the mark rather than appending a stub.
2. Failing that, introduce a hairline/primary weight split so the modifier is
   not competing at equal weight with the lens strokes.

The exploration's blend rule — "must not invent a third mark" — matches the
shipped constraint and is worth stating explicitly in the contract. Its hero
contract ("five elements above the fold, no chips, no CTA, no caveat; map
bare") speaks directly to finding 8.

## Scope and limits

**This review is not universal cultural clearance.**

The eight marks were screened against the listed categories and against each
other at both production sizes and the proofed 24px size. Findings 1–3 are
letter, punctuation and UI-convention collisions plus intra-set collision. No
religious, national, ethnic, occult, political, military, extremist, corporate
or certification-mark collision was identified.

That negative result is bounded. A single automated reviewer at four scales in
four rendering modes is not a cultural review. At the time of this review, both
reviewer slots in `docs/v23/V23_1_SIGIL_COLLISION_REVIEW.md` were blank. The
bounded patch subsequently records this Claude review as the independent
blocking review; the second slot remains incomplete. Findings 1–3 alone
invalidate the current geometry before a cultural pass would be worth running.

Any geometry revision invalidates both digests recorded above and requires this
review to be repeated.
