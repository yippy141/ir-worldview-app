# V22 core reshape: selection and migration analysis

Date: 2 August 2026
Status: implementation hold pending version/compatibility approval

## Decision sought

The proposed 18–20-item core is editorially stronger than the current
all-Likert core, but it is not a local tier-label change. Approve a versioned
form migration before retiering any item.

Recommended contract:

- retain the current 14-item core and its calibration as the V21 historical
  contract;
- ship the reshaped Foundation as a new structural/item-bank/scoring tuple;
- keep V21 V5 result links decodable with their original identity;
- migrate resumable drafts explicitly and require all newly selected core
  items before submission;
- preserve the full 68-item form by removing promoted cases from the later
  extension rather than asking them twice;
- regenerate the six targeted discriminator sets and their calibrations.

## Projection ranking

The existing projection method projects each option vector onto standardized
family-weight differences, takes the within-item range, and averages across
the six family pairs.

### Unconstrained top six

| Rank | Item | Mean separation | Current modes |
|---:|---|---:|---|
| 1 | `an_tradeoff_evidence` | 45.19 | Analyst only |
| 2 | `an_tradeoff_tech_order` | 44.76 | Analyst only |
| 3 | `an_case_rising_power_voice` | 44.72 | Analyst only |
| 4 | `an_case_digital_stack` | 43.93 | Analyst only |
| 5 | `an_case_middle_power` | 40.46 | Analyst only |
| 6 | `an_tradeoff_parallel_order` | 40.40 | Analyst only |

This mechanically optimal set is a poor default-core contract. All six are
currently analyst-only, several assume more background knowledge, and using
them in a shared core would either expose Standard users to formerly
analyst-only content or require separate form/calibration contracts by mode.

### Highest-separation Standard-compatible six

| Rank | Item | Mean separation |
|---:|---|---:|
| 1 | `tradeoff_interdependence` | 39.87 |
| 2 | `tradeoff_alliances` | 38.96 |
| 3 | `case_semiconductors` | 37.60 |
| 4 | `tradeoff_intervention` | 30.07 |
| 5 | `case_protection` | 29.87 |
| 6 | `tradeoff_strategy` | 28.79 |

These six are the recommended candidate set because they preserve one common
core across Standard and Analyst while still adding concrete decisions and
tradeoffs. Numeric separation is necessary, not sufficient: the final item
review still needs actor/decision/clock clarity, low assumed knowledge, and
dimension-coverage checks.

## Proposed 20-item order

The order below opens with two concrete cases, keeps the balanced Likert block
intact, and closes on a tradeoff.

1. `case_semiconductors`
2. `case_protection`
3. `sc2`
4. `v21_sc_rev_02`
5. `in2`
6. `v21_in_rev_03`
7. `df1`
8. `v21_df_rev_04`
9. `ni2`
10. `v21_ni_rev_05`
11. `pe2`
12. `v21_pe_rev_02`
13. `rs2`
14. `v21_rs_rev_04`
15. `oj1`
16. `oj2`
17. `tradeoff_strategy`
18. `tradeoff_intervention`
19. `tradeoff_alliances`
20. `tradeoff_interdependence`

This is a proposed canonical order, not an implementation. The repository
needs an explicit ordered core-ID source of truth; the current comparator is
not a total order once cases join the core.

## Required recalibration

Promoting six cases changes more than the core contract.

- Core: 14 → 20 items; regenerate seven neutral means/SDs, strategy and norm
  thresholds, family-gap thresholds, attainable ranges, and resolution-rate
  diagnostics.
- Targeted forms: 14+5 → 20+5; remove promoted IDs from discriminator
  eligibility, select a new five-item set for every family pair, and regenerate
  all six form-specific calibration contracts.
- Full extended: remains the same 68 scored items if promoted cases are not
  duplicated. Its numeric calibration can remain stable, subject to a
  regression check.
- `scripts/calibrate-targeted-forms.mts` must stop hardcoding 19-item forms.

## Compatibility work required

### Result links

V5 Foundation payloads carry structural, bank, and scoring provenance, but the
decoder currently accepts only the active tuple. Shipping the reshaped core
under the old tuple would silently reinterpret historical dimension scores;
rejecting the old tuple would break V21 links.

Recommended implementation:

- freeze V21 scoring/calibration under its existing tuple;
- add the reshaped form as a new supported tuple;
- dispatch decode/reconstruction through an explicit supported-version
  registry;
- add fixtures proving a V21 V5 link keeps its encoded family, modifiers,
  archetype, and dimensions after V22 ships.

### Drafts

The current session record lacks exact form provenance. A migration must:

- preserve known answers and the option-order seed;
- route an old “core complete” draft to the first newly required case;
- prevent submission until the exact new core/targeted/full form is complete;
- preserve a clear recovery path instead of silently clearing work.

### Aggregates

The new form must use a distinct Tier 1 cohort tuple. Old and new form results
cannot be pooled as if they were one empirical distribution.

## Resolution gate corrections

The proposed gate counts dimensions near the exact core-form calibration mean.
Use standardized distance rather than a raw ±0.25 score window so the rule has
comparable meaning across dimensions. Describe it as an editorial
under-resolution rule, not reliability or confidence.

The initial unresolved presentation should show the top two nearby modeled
families and route to the existing pair-targeted extension. “Two or three live
archetypes” is not yet computable because posture, three normative states,
blends, and family uncertainty have no shared candidate algorithm.

The suppression contract must apply to the visible result, metadata, Open
Graph card, Profile sync, Profile Share, history/comparison, and rarity/share
copy. Hiding a headline only in the result body would still overclaim
elsewhere.

## Stability gate

The existing `--stability` run is for the 68-item analyst form. A two-answer
perturbation there is not equivalent to two answers out of a 20-item core.
After the new form and calibrations exist, rerun stability separately for:

- the 20-item core;
- the full 68-item result;
- all six 25-item targeted forms;
- top-deviating-dimension identity as well as family/modifier/narrative state.

Only the final core-form run can gate provisional archetype presentation.

## Time claim

Do not publish “roughly four minutes” from item count alone. The current UI
already estimates 6–8 minutes for 14 items. Update the estimate only after
observed completion timing on the proposed case-led form.
