# V21 Foundation instrument v2

**Status:** Accepted  
**Date:** 29 July 2026  
**Instrument version:** 2  
**Foundation scoring version:** 2

## Decision

The Foundation analyst instrument adds 12 reverse-coded Likert items and rewrites four existing forward-coded prompts. The additions bring every Foundation dimension to at least 40% reverse-coded Likert coverage. Existing item IDs, dimensions, scoring directions, modes, clarifications, and other metadata remain unchanged by the rewrites.

The reverse-coding coverage rule in `scripts/validate-instrument.mts` is now blocking for Foundation dimensions. Every Likert item in every instrument must continue to state `reverse` explicitly.

## Added items

All additions use `kind: "likert"`, `modes: ["analyst"]`, and `reverse: true`.

| ID | Dimension | Prompt |
| --- | --- | --- |
| `v21_sc_rev_01` | `securityCompetition` | Major powers can build durable peace when each side accepts limits on military advantage. |
| `v21_sc_rev_02` | `securityCompetition` | A rival's sustained restraint can provide credible evidence that its peaceful intentions will last. |
| `v21_sc_rev_05` | `securityCompetition` | Deep regional cooperation can make armed conflict among member states politically unthinkable. |
| `v21_in_rev_03` | `institutions` | International agreements endure when participating states retain enough power to enforce the bargain. |
| `v21_df_rev_01` | `domesticFilters` | States facing the same external threat usually adopt similar policies despite different political systems. |
| `v21_df_rev_04` | `domesticFilters` | Regime change rarely alters a state's basic interests when its external position stays constant. |
| `v21_ni_rev_01` | `normsIdentity` | States define their interests mainly through security needs, resources, and geographic position. |
| `v21_ni_rev_05` | `normsIdentity` | Recognition from other states rarely changes what governments seek in major security disputes. |
| `v21_pe_rev_02` | `politicalEconomy` | Open markets usually give states enough flexibility to replace suppliers and absorb economic pressure. |
| `v21_rs_rev_04` | `restraint` | Preventing a hostile power from dominating a key region can justify long-term commitments far from home. |
| `v21_rs_rev_05` | `restraint` | Sustained forward presence gives allies confidence and denies rivals room to test regional limits. |
| `v21_oj_rev_02` | `orderJustice` | International courts should pursue grave crimes even when prosecutions complicate peace negotiations. |

## Rewritten items

Only prompt text changed.

| ID | Dimension | Previous prompt | Scoring-v2 prompt |
| --- | --- | --- | --- |
| `sc2` | `securityCompetition` | States often prepare for danger because they cannot be sure others will stay benign. | Uncertainty about another state's long-term intentions makes continued military preparation necessary even during sustained cooperation. |
| `df1` | `domesticFilters` | Changes in who governs and whom they answer to often shift foreign policy as much as outside threats do. | A new governing coalition often redirects foreign policy even when the external threat remains unchanged. |
| `ni2` | `normsIdentity` | Status, recognition, and legitimacy help shape what states want, not just how they pursue fixed interests. | A state's demand for recognition often changes which foreign-policy goals its leaders consider important. |
| `an_pe4` | `politicalEconomy` | In the coming decade, power will depend as much on who sets the rules and controls the infrastructure for chips, cloud services, payments, and cross-border data as on military strength or territory. | Control over technology rules and critical infrastructure will rival military strength as a source of international power in the coming decade. |

## Reverse-coded coverage

| Dimension | Previous | Scoring v2 |
| --- | ---: | ---: |
| Security competition | 0 / 4, 0% | 3 / 7, 42.9% |
| Institutions | 1 / 4, 25% | 2 / 5, 40% |
| Domestic filters | 0 / 2, 0% | 2 / 4, 50% |
| Norms and identity | 0 / 3, 0% | 2 / 5, 40% |
| Political economy | 1 / 4, 25% | 2 / 5, 40% |
| Restraint | 0 / 2, 0% | 2 / 4, 50% |
| Order and justice | 1 / 3, 33.3% | 2 / 4, 50% |

## Calibration

Changing the bank invalidated constants derived from the previous 500-respondent seeded sample. Scoring version 2 therefore regenerates:

- each dimension's random-response mean and population standard deviation;
- the restraint and order-justice modifier cut points at their observed 33rd and 67th percentiles; and
- the low- and high-differentiation cut points at the observed 25th and 75th percentiles of top-two family-score gaps.

The regenerated constants use analyst mode, 500 seeded synthetic respondents, and seed `20260728`.

## Diagnostic comparison

| Measure | Before | Scoring v2 | Change |
| --- | ---: | ---: | ---: |
| Strategic Realist | 25.8% | 29.6% | +3.8 pp |
| Liberal Institutionalist | 28.8% | 25.2% | -3.6 pp |
| Social Constructivist | 19.2% | 24.6% | +5.4 pp |
| Critical Political Economist | 26.2% | 20.6% | -5.6 pp |
| Largest family | 28.8% | 29.6% | +0.8 pp |
| Largest three-part label | 7.0% | 6.6% | -0.4 pp |

The yea-sayer and nay-sayer both remain Strategic Realists. This is the intended response-style invariant because their answer profiles differ only in Likert level. `YEA + LAST` remains a Critical Political Economist, confirming that a different cross-dimension choice shape can change the family.

All four textbook family profiles remain reachable. The scoring-v2 random sample has roughly even strategy and normative modifier distributions after recalibration.
