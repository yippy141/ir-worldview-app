# V21 Foundation core and extended split

**Status:** Implemented  
**Date:** 29 July 2026  
**Instrument version:** 2  
**Structural schema version:** 4

## Decision

The Foundation now begins with 14 core Likert items: two for each of the
seven scored dimensions, with one forward-coded and one reverse-coded item in
every pair. All 54 remaining items stay in the bank as the extended tier.
No item was removed and no scoring signal or weight changed.

## Core selection method

Family separation is calculated from the existing family-profile weight
matrix after applying the existing per-dimension standardisation. For a
Likert item on dimension \(d\), the theoretical separation between families
\(a\) and \(b\) across the seven-point response span is:

`6 × abs((familyWeight[a,d] - familyWeight[b,d]) / calibrationSD[d])`

Every Likert item on the same dimension has the same theoretical separation:
the scoring model gives them the same unit weight, and reverse coding changes
direction but not magnitude. Selection therefore used two ordered criteria:

1. Cover each dimension with both response directions so that the 14-item
   core is valence-balanced.
2. Within the resulting same-dimension mathematical ties, prefer the item
   with the clearest single-construct wording, the lowest assumed knowledge,
   and the most direct forward/reverse contrast.

## Selected core items

| Dimension | Forward-coded | Reverse-coded |
| --- | --- | --- |
| Security competition | `sc2` | `v21_sc_rev_02` |
| Institutions | `in2` | `v21_in_rev_03` |
| Domestic filters | `df1` | `v21_df_rev_04` |
| Norms and identity | `ni2` | `v21_ni_rev_05` |
| Political economy | `pe2` | `v21_pe_rev_02` |
| Restraint | `rs2` | `v21_rs_rev_04` |
| Order and justice | `oj1` | `oj2` |

## Extended discriminator method

The six unordered family-pair mappings are stored in
`content/instrument/foundation.v2.json`. Validation-scale items are excluded
because they do not contribute to family scores.

For a choice item, each option's signal vector is projected onto the
standardised difference between the two family weight vectors. The item's
separation is the range between the highest and lowest option projections.
For an extended Likert item, the seven-point-span formula above is used. The
five highest-separation extended items are stored for each family pair in
descending order.

The mapping is precomputed rather than recalculated in the browser. Any
future change to family weights, calibration standard deviations, item
signals, or tier assignments requires regenerating and reviewing the table.
