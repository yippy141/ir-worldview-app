# V23.1 Rejected Sigil Geometry v1 Collision Review

Status: rejected design-history record

Outcome: `blocked`

This record binds the rejection to the exact deterministic geometry and render
artifact below. It is retained only as non-production design history. The
archived contact sheet still says `PENDING` because its bytes are preserved so
the original artifact digest remains reproducible; this blocked record
supersedes that embedded status.

The review was an independent AI visual review, not universal cultural
clearance. It found enough letter, punctuation, UI-convention, and intra-set
collisions to block geometry v1 before a cultural review would be meaningful.
No replacement geometry is approved by this record.

## Geometry and artifact binding

| Field | Value |
| --- | --- |
| Construction grammar | Exactly four lens bases (`P`, `R`, `M`, `S`) and two posture transforms (`project`, `contain`) |
| Output scope | Exactly eight pure codes; no blend mark |
| Geometry version | `v23.1b-geometry-v1` |
| Original geometry source | `lib/archetype-sigils.ts` (retired from production) |
| Original renderer source | `components/archetypes/archetype-sigil.tsx` (retired from production) |
| Component commit |  |
| Geometry SHA-256 | `0c02d05b8bdbb814f64cb4633ba26ff467976ff8ad8fc71de630ae6fa1d7a6fe` |
| Original render generator | `scripts/render-archetype-sigil-contact-sheet.mts` (retired from production) |
| Archived render artifact | `docs/v23/design-history/rejected-sigil-geometry-v1/V23_1_SIGIL_GEOMETRY_V1_CONTACT_SHEET.svg` |
| Artifact SHA-256 | `8f8328d17caf6e289240fcc0ae97c1bb5c3e7daa289d7f5bec8d2cb5681b00f2` |

The geometry digest is SHA-256 over `serializeSigilGrammar()`, which binds the
geometry version, four bases, posture anchors, two transformations, and all
eight derived definitions in canonical order. The artifact digest is SHA-256
over the exact UTF-8 SVG bytes generated from that manifest.

## Render matrix

Every rendered specimen contains the then-production `line` and `path`
primitives inline. The artifact contains no copied alternate artwork, external
asset, `use`, `href`, script, animation, mask, filter, or gradient.

| Context | 24px | 48px | 96px | 160px watermark | 200% optical/crop check | Reviewer notes |
| --- | --- | --- | --- | --- | --- | --- |
| Default Astrolabe dark | Rendered | Rendered | Rendered | Rendered at 16% |  |  |
| Black on white | Rendered | Rendered | Rendered | Rendered at 16% |  |  |
| White on black | Rendered | Rendered | Rendered | Rendered at 16% |  |  |
| Print specimen, black ink on white | Rendered | Rendered | Rendered | Rendered at 16% |  |  |

## Required collision checklist

The independent reviewer blocked the bound artifact on the checked failures
below. Unchecked categories were not granted clearance.

- [ ] Religious symbols or devotional marks
- [ ] National, ethnic, or culturally proprietary symbols
- [ ] Occult symbols or esoteric insignia
- [ ] Political-party marks
- [ ] Military, police, extremist, or state-security insignia
- [ ] Major corporate or product logos
- [ ] Common certification, compliance, or quality marks
- [x] **Failed:** accidental letter, number, punctuation, or literal `+`/`-` dominance
- [x] **Failed:** collision between marks at 24px because same-lens posture distinction is insufficient
- [x] **Failed:** collision between marks at 48px because same-lens posture distinction is insufficient
- [ ] Misleading resemblance introduced by watermark scale or cropping
- [ ] Misleading resemblance introduced by dark or reversed rendering
- [ ] Misleading resemblance introduced by black-and-white print
- [ ] Clipping or terminal loss at 200% optical zoom

## Per-mark findings

| Code | 24/48/96 distinction | Cultural or institutional resemblance | Reverse/print/crop finding | Requested changes |
| --- | --- | --- | --- | --- |
| `P+` | Insufficient distinction from `P-` | Capital letter `H` | Persists across dark, reverse, print, and reviewed sizes | Replace geometry; do not ship |
| `P-` | Insufficient distinction from `P+` | Same `H` silhouette with small inward ticks | Posture distinction remains weak at large size | Replace geometry; do not ship |
| `R+` | Insufficient distinction from `R-` | Equals-sign / input-control collision | Collapses toward `=` at 24px | Replace geometry; do not ship |
| `R-` | Insufficient distinction from `R+` | Equals-sign / input-control collision | Rounded rectangle reads as an input at large size | Replace geometry; do not ship |
| `M+` | Insufficient distinction from `M-` | Angle-bracket collision | Reads as `⟨⟩` | Replace geometry; do not ship |
| `M-` | Insufficient distinction from `M+` | `O` / `0` collision | Letter/number reading persists | Replace geometry; do not ship |
| `S+` | Insufficient distinction from `S-` | Hamburger-menu collision | Three stacked rules compete with the product's Menu control | Replace geometry; do not ship |
| `S-` | Insufficient distinction from `S+` | Hamburger-menu collision | Three stacked rules compete with the product's Menu control | Replace geometry; do not ship |

## Independent reviewers

| Reviewer slot | Reviewer ID | Role | Review date | Disposition |
| --- | --- | --- | --- | --- |
| 1 | [Claude design review](../../V23_1_DESIGN_REVIEW.md) | Independent AI visual reviewer | 2026-08-14 | `blocked` |
| 2 |  |  |  |  |

Reviewer slot 2 was not completed. The single independent review is sufficient
to reject geometry v1, but it is not sufficient to approve this or any future
geometry.

## Outcome record

| Field | Value |
| --- | --- |
| Outcome | `blocked` |
| Decision authority | Bounded V23.1 project-manager patch instruction |
| Decision date | Not separately supplied |
| Conditions or requested changes | Geometry digest v1 cannot ship. Remove it from public routes and production imports. Use code labels as the temporary public fallback. |

The geometry digest `0c02d05b8bdbb814f64cb4633ba26ff467976ff8ad8fc71de630ae6fa1d7a6fe`
cannot ship. Any replacement is a new geometry version: it invalidates both v1
digests, requires a newly generated complete matrix, and restarts both
independent reviews. This history record cannot approve a replacement.
