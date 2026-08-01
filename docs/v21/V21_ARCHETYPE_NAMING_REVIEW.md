# V21 archetype owner decision

Date: 2026-08-01

Status: locked for V21; re-evaluation deferred to V22

## Owner decision

The V21 pure-archetype names, glosses, family mappings, and historical
analogues are the owner-authored records in `content/archetypes.json`. They
must not be rewritten for tone or replaced with earlier working alternatives.
The locked names are:

| Code | Name | Historical analogue |
| --- | --- | --- |
| P+ | The Hegemon | The Melian Dialogue, 416 BC |
| P- | Shi (勢) | The Art of War, 5th C. BC |
| R+ | Grotian | Hugo Grotius / *De Jure Belli ac Pacis*, 1625 |
| R- | Concert | The Congress of Vienna, 1815 |
| M+ | The Iconoclast | Finnemore & Sikkink / The Norm Lifecycle, 1998 |
| M- | Nemawashi (根回し) | The ASEAN Way, 1967 |
| S+ | Dirigisme | Alexander Hamilton / Report on Manufactures, 1791 |
| S- | Dependencia | Raúl Prebisch, 1950 |

The JSON file remains the single source of truth for the exact glosses and
links; this decision record intentionally does not duplicate them.

## Implementation boundaries

- Pure results retain the exact owner-authored names, including the leading
  article in `The Hegemon` and `The Iconoclast`.
- Blend names remove a leading `The` only when composing two names. For
  example, `P/M+` renders as `Hegemon–Iconoclast`. This is a grammatical
  presentation rule, not a rename.
- Historical analogues appear only on pure archetypes. A blend does not
  fabricate a combined historical analogue.
- Each analogue has an internal note stating why the comparison fits and
  where it breaks. The analogue is explicitly a comparison, not an identity
  claim or endorsement.
- The analogue layer and all naming changes remain presentation-only. They
  must not modify `computeCoreDimensionScores`, `scoreFamilies`, modifiers,
  calibration, or share-payload resolution.

## V22 re-evaluation rule

V22 may reassess whether readers understand each name and whether each
historical comparison does the intended editorial work. That review should
separate three questions:

1. Does the name communicate the intended posture?
2. Does the historical analogue illuminate the name without overclaiming?
3. Does observed measurement evidence support the underlying archetype
   mapping?

A weakness in one question is not evidence for changing the other two.
Renaming remains a typed presentation-data change. Remapping requires separate
measurement evidence and a versioned scoring decision.

Earlier suggestions such as `Kairos`, `Nomos`, `Mandala`, `Norm Shaper`, and
`Structural Strategist` are superseded as V21 recommendations. They may be
consulted as rejected or comparative options during the V22 review, but they
have no authority over the locked V21 copy.
