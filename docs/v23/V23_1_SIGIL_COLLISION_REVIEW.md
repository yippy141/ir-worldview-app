# V23.1 Sigil Collision Review

Status: draft review record

Outcome: `pending`

This record binds collision review to the exact deterministic geometry and
render artifact below. Automated structure and rendering checks are pretesting;
they do not constitute cultural, editorial, methodology, or owner clearance.

## Geometry and artifact binding

| Field | Value |
| --- | --- |
| Construction grammar | Exactly four lens bases (`P`, `R`, `M`, `S`) and two posture transforms (`project`, `contain`) |
| Output scope | Exactly eight pure codes; no blend mark |
| Geometry version | `v23.1b-geometry-v1` |
| Canonical geometry source | `lib/archetype-sigils.ts` |
| Renderer source | `components/archetypes/archetype-sigil.tsx` |
| Component commit |  |
| Geometry SHA-256 | `0c02d05b8bdbb814f64cb4633ba26ff467976ff8ad8fc71de630ae6fa1d7a6fe` |
| Render generator | `scripts/render-archetype-sigil-contact-sheet.mts` |
| Render artifact | `artifacts/v23/V23_1_SIGIL_CONTACT_SHEET.svg` |
| Artifact SHA-256 | `8f8328d17caf6e289240fcc0ae97c1bb5c3e7daa289d7f5bec8d2cb5681b00f2` |

The geometry digest is SHA-256 over `serializeSigilGrammar()`, which binds the
geometry version, four bases, posture anchors, two transformations, and all
eight derived definitions in canonical order. The artifact digest is SHA-256
over the exact UTF-8 SVG bytes generated from that manifest.

## Render matrix

Every rendered specimen contains the production `line` and `path` primitives
inline. The artifact contains no copied alternate artwork, external asset,
`use`, `href`, script, animation, mask, filter, or gradient.

| Context | 24px | 48px | 96px | 160px watermark | 200% optical/crop check | Reviewer notes |
| --- | --- | --- | --- | --- | --- | --- |
| Default Astrolabe dark | Rendered | Rendered | Rendered | Rendered at 16% |  |  |
| Black on white | Rendered | Rendered | Rendered | Rendered at 16% |  |  |
| White on black | Rendered | Rendered | Rendered | Rendered at 16% |  |  |
| Print specimen, black ink on white | Rendered | Rendered | Rendered | Rendered at 16% |  |  |

## Required collision checklist

The two reviewers complete these checks independently against the bound
artifact and its exact geometry digest.

- [ ] Religious symbols or devotional marks
- [ ] National, ethnic, or culturally proprietary symbols
- [ ] Occult symbols or esoteric insignia
- [ ] Political-party marks
- [ ] Military, police, extremist, or state-security insignia
- [ ] Major corporate or product logos
- [ ] Common certification, compliance, or quality marks
- [ ] Accidental letter, number, punctuation, or literal `+`/`-` dominance
- [ ] Collision between any two of the eight marks at 24px
- [ ] Collision between any two of the eight marks at 48px
- [ ] Misleading resemblance introduced by watermark scale or cropping
- [ ] Misleading resemblance introduced by dark or reversed rendering
- [ ] Misleading resemblance introduced by black-and-white print
- [ ] Clipping or terminal loss at 200% optical zoom

## Per-mark findings

| Code | 24/48/96 distinction | Cultural or institutional resemblance | Reverse/print/crop finding | Requested changes |
| --- | --- | --- | --- | --- |
| `P+` |  |  |  |  |
| `P-` |  |  |  |  |
| `R+` |  |  |  |  |
| `R-` |  |  |  |  |
| `M+` |  |  |  |  |
| `M-` |  |  |  |  |
| `S+` |  |  |  |  |
| `S-` |  |  |  |  |

## Independent reviewers

| Reviewer slot | Reviewer ID | Role | Review date | Disposition |
| --- | --- | --- | --- | --- |
| 1 |  |  |  |  |
| 2 |  |  |  |  |

## Outcome record

| Field | Value |
| --- | --- |
| Outcome | `pending` |
| Decision owner |  |
| Decision date |  |
| Conditions or requested changes |  |

Any geometry revision invalidates both digests. Regenerate the complete matrix,
record the new values, and restart both independent reviews before changing the
outcome.
