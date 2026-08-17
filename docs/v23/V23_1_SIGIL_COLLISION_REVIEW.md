# V23.1 Editorial-Mark Collision Decision

Status: active V23.1 release record

Outcome: `owner-selected-editorial-beta`

Decision date: 2026-08-18

This record distinguishes two geometries. It does not rehabilitate the rejected
first geometry and it does not claim universal cultural clearance.

## Geometry v1 remains blocked

Geometry `v23.1b-geometry-v1` remains rejected. Its geometry digest is
`0c02d05b8bdbb814f64cb4633ba26ff467976ff8ad8fc71de630ae6fa1d7a6fe`.
The capital-H, punctuation, input-control, hamburger-menu, and insufficient
posture-distinction findings in `V23_1_DESIGN_REVIEW.md` still block that exact
set. The byte-preserved contact sheet and full rejection record remain only in
`design-history/rejected-sigil-geometry-v1/`.

## System A binding

The owner selected the separate System A set for bounded editorial-beta use.

| Artifact | Binding value |
| --- | --- |
| Manifest | `assets/V23_SYSTEM_A_DERIVED_SIGILS_MANIFEST.json` |
| Version | `v23-system-a-derived-1` |
| Manifest SHA-256 | `0f84bc56ccb84f51f6c045bf403472cd52617484c7cf7a947e3acea44baa12ff` |
| Documentation sprite SHA-256 | `d19dcf0cfa7b253cbb928fee6634efe1ec57eb2c954a4492a1f66cb24a13ada7` |
| Documentation contact-sheet SHA-256 | `b677cac719745e601aa1ba0646510e797134d4800db28a6f48617576e557e3c6` |
| Pure codes | `P+`, `P−`, `R+`, `R−`, `M+`, `M−`, `S+`, `S−` |
| Blend definition | none |
| Production sizes | 112px hero; 48px directory; visible code only below 32px |
| Blend composition | Diptych hero; Hallmark compact; no new mark |

The SVG bodies in the documentation sprite and contact sheet match the
manifest exactly. Production renders typed inline geometry and does not fetch
or reference those documentation assets.

## Automated review completed

The automated review covered:

- exact one-to-one manifest, production, and pure-code coverage;
- eight unique mark bodies and the absence of a blend mark;
- allowed inline elements and `currentColor` paint only;
- absence of script, animation, mask, filter, gradient, image, external
  reference, generated ID, and runtime asset request;
- 112px, 48px, and sub-32px fallback behavior;
- pure, Diptych, and Hallmark server-rendered output;
- decorative and meaningful accessibility modes;
- dark, reversed, print, reduced-motion, and 200%-zoom containment;
- pairwise non-identity and safe view-box bounds for all eight marks.

All eight marks remain inside the `0 0 100 100` view box at 200% raster review.
The closest observed boundary is approximately eight view-box units, leaving
room for the manifest stroke widths. No automated blocker was recorded.

Automated review can identify structural and visual collisions in the tested
matrix. It cannot establish how every community will interpret a mark.

## Owner risk decision

The owner accepts the bounded residual cultural risk for this editorial beta.
The marks are contemporary editorial artwork and mnemonic visual references;
they are not authentic historical emblems, religious or national symbols,
cultural classifications, or endorsements of the people, texts, practices,
or institutions used in historical comparisons.

This decision is not external-expert review, human cultural validation, or
universal cultural clearance. A material geometry change requires a new
manifest version, new digests, a repeated automated matrix, and a new owner
decision. A concrete collision report can still block an individual mark or
the set during beta.
