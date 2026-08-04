# V22 archetype naming decision

Date: 2026-08-05

Status: locked for V22. Supersedes `docs/v21/V21_ARCHETYPE_NAMING_REVIEW.md`.

This is the V22 re-evaluation the V21 record deferred. It changes names,
glosses, and analogues only. Codes, `familyKey` values, scoring, calibration,
and the share payload are untouched.

## Owner decision

| Code | From | To | Analogue |
| --- | --- | --- | --- |
| P+ | The Hegemon | Kairos | The Melian Dialogue, 416 BC (unchanged) |
| P− | Shi (勢) | Shi (勢) (unchanged) | The Art of War, 5th C. BC (unchanged) |
| R+ | Grotian | Grotian (unchanged) | Hugo Grotius / *De Jure Belli ac Pacis*, 1625 (unchanged) |
| R− | Concert | Concert (unchanged) | The Congress of Vienna, 1815 (unchanged) |
| M+ | The Iconoclast | Satyagraha | The Salt March, 1930 (was Finnemore & Sikkink) |
| M− | Nemawashi (根回し) | Musyawarah | The ASEAN Way, 1967 (unchanged) |
| S+ | Dirigisme | Dirigisme (unchanged) | The Monnet Plan, 1946 (was Hamilton) |
| S− | Dependencia | Dependencia (unchanged) | Raúl Prebisch, 1950 (unchanged) |

`content/archetypes.json` remains the single source of truth for exact names,
glosses, and links. This record does not duplicate them.

## Reasons

**Kairos (P+).** The existing gloss already describes kairos, the opportune
moment. `Hegemon` named a structural position rather than a posture, and
carried an institutionalist meaning from hegemonic stability theory. Kairos
also pairs with Shi as two theories of timing, Greek and Chinese.

**Satyagraha (M+).** The old name contradicted its own analogue. Finnemore and
Sikkink describe norm builders; an iconoclast destroys received belief.
Finnemore and Sikkink remain the scholarly frame on the evidence page. The
limitation note addresses Gandhi's contested record directly rather than
eliding it: the archetype cites a method, not a biography.

**Musyawarah (M−).** Nemawashi is Japanese and the ASEAN Way is Southeast
Asian. Pairing them collapsed two traditions into one category. Musyawarah,
with mufakat, is the actual normative vocabulary of the ASEAN Way.

**The Monnet Plan (S+).** Dirigisme is French indicative planning. Hamilton is
the American School, theorised by List. French name, French analogue.

## Evidence-page notes

Two names carry a footnote about the name itself, rendered on the evidence page
under "A note on the name" and stored as `nameNote` in
`content/archetype-evidence.json`.

- **R+ Grotian.** In Martin Wight's three traditions — which this product
  already borrows from with `Pluralist` and `Solidarist` — `Grotian` names the
  rationalist middle way, not the enforcement-forward pole it marks here. The
  collision is footnoted rather than resolved.
- **P− Shi.** 勢 and 大势 are in live use in contemporary PRC official
  discourse, where 大势 carries the sense of the trend of history. The note
  acknowledges the contemporary usage rather than presenting the term as purely
  classical.

## S lens gloss

The user-facing gloss of the S lens states the premise itself — production,
finance, and dependence organize politics — rather than naming critical
political economy. Dirigisme and Dependencia are both members of that premise
and differ on posture. The internal `familyKey` stays
`criticalPoliticalEconomy` for compatibility.

## Simplified Chinese

The narrow Chinese contract applies. The archetype layer — names, glosses,
analogues, and the `/archetypes/[slug]` evidence pages — has no approved
Chinese copy. It is declared in `content/locales/zh-Hans/manifest.ts` under
`excludes` as `archetype-layer`. Chinese result routes render the family
narrative and omit the archetype layer entirely; they do not fall back to
English.

## Boundaries carried forward from V21

- Historical analogues appear only on pure archetypes. A blend does not
  fabricate a combined analogue.
- Each analogue states why the comparison fits and where it breaks. The
  analogue is a comparison, not an identity claim or endorsement.
- Naming stays presentation-only. It must not modify
  `computeCoreDimensionScores`, `scoreFamilies`, modifiers, calibration, or
  share-payload resolution.
- No V22 name carries a leading article, so the blend rule that strips a
  leading `The` is currently unexercised. It is retained as a presentation
  rule, not a rename.
