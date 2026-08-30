# V23.6 full-form posture audit

## Decision

The fact that all 160 full-form uniform diagnostic records scored above the
raw restraint boundary of 4 is an authored form asymmetry, not an
implementation defect. This audit does not authorize a change to the scorer,
calibration, bank, or registered boundary.

The public result must describe 4 as the registered raw-score routing
boundary. It must not describe 4 as the center of the exact full form or imply
that the form is symmetric around it.

## Contracts traced

The audit reads the checked-in Foundation v2 bank and live scorer. The
protected-file digests in `current-run.json` bind those inputs to the accepted
diagnostic run.

- [`foundation.v2.json`](../../../content/instrument/foundation.v2.json) owns
  the item signals and answer options.
- [`v2.ts`](../../../lib/scoring/v2.ts) collects declared signals, weights a
  recorded second choice at 0.45, divides each dimension's signal sum by its
  actual signal weight, and rounds the resulting dimension score to two
  decimals.
- [`v2-calibration.ts`](../../../lib/scoring/v2-calibration.ts) records the
  exact full-form independent-null restraint center and standard deviation.
- [`archetypes.ts`](../../../lib/archetypes.ts) keeps the posture-sign routing
  boundary at the raw restraint score of 4.
- [`methodology.md`](methodology.md) defines the constructed ensembles and
  deterministic perturbations. [`current-run.json`](current-run.json) records
  the accepted seeds, sample counts, digests, and interpretation boundary.

## Exact restraint inputs

Four scored Likert items feed restraint in the full form. `rs1` and `rs2` are
forward-coded; `v21_rs_rev_04` and `v21_rs_rev_05` are reverse-coded. Under the
registered independent-uniform construction, these four inputs are balanced
around 4.

Seventeen of the 22 scored forced-choice items declare at least one restraint
signal. Five declare none. Across the 88 forced-choice options, 53 declare a
restraint value and 35 do not contribute to that dimension. Of the 53 declared
values, 13 are below 4, none equal 4, and 40 are above 4. Their unweighted mean
is 4.794340. The relevant signals are:

| Item | Declared restraint signals by option |
| --- | --- |
| `tradeoff_alliances` | `power` 3.6; `rules` 4.7; `domestic` 4.5 |
| `tradeoff_interdependence` | `rules` 4.8; `domestic` 4.4 |
| `tradeoff_strategy` | `press` 2.4; `limit` 6.2; `base` 5.1; `industrial` 4.4 |
| `tradeoff_intervention` | `precedent` 5.2; `protection` 3.3; `mandate` 4.9; `consequences` 6.1 |
| `case_semiconductors` | `edge` 2.8; `coalition` 5.0; `framing` 5.7 |
| `case_protection` | `law` 5.1; `moral` 3.4; `bounded` 5.0; `prudence` 6.2 |
| `an_case_finance` | `pragmatic` 4.8 |
| `an_case_burdens` | `credibility` 3.4; `capacity` 4.8; `rebalance` 6.3 |
| `an_tradeoff_evidence` | `commitments` 4.8; `coalitions` 4.9 |
| `an_tradeoff_tech_order` | `edge` 3.4; `narrow` 5.0 |
| `an_case_middle_power` | `shield` 3.7; `hedge` 5.9; `extract` 4.4 |
| `an_case_maritime_crisis` | `deter` 3.3; `entrapment` 6.3; `offramp` 5.2; `ally_politics` 4.8 |
| `an_case_digital_stack` | `security` 3.7; `interoperability` 4.8; `autonomy` 5.4 |
| `an_case_sanctions_alignment` | `norm` 3.8; `stability` 5.1; `diversify` 5.4; `hedge` 6.0 |
| `an_case_intervention_memory` | `shield` 5.4; `threshold` 3.8; `regional` 5.0; `aftermath` 6.2 |
| `an_tradeoff_energy_alignment` | `defend_rule` 3.7; `protect_home` 5.3; `phase_reduction` 5.8; `hedge_diplomatically` 5.7 |
| `an_tradeoff_ceasefire_settlement` | `stop_harm_now` 5.9; `hold_accountability_line` 4.1; `sequence_peace_and_justice` 5.2 |

An absent restraint signal contributes neither a value nor a denominator
weight. In Analyst mode, an authored secondary choice contributes its declared
signal and 0.45 denominator weight. The accepted uniform ensemble samples each
primary option uniformly and samples the optional-secondary state plus each
distinct alternative uniformly. The registered full-form calibration uses the
same exact answer space at larger scale.

## Calibration and observed diagnostic range

The registered full-form independent-null calibration used 500,000 constructed
records with seed `20260728`. Its restraint center is **4.657735** and its
standard deviation is **0.223820**. Calibration standardizes family scoring;
it does not move the raw posture-sign boundary of 4.

In the accepted deterministic uniform full-form sample, restraint ranged from
**4.02 to 5.15** and the median was **4.65**. All 160 records were above 4.
The sample therefore follows the authored signal balance and the registered
exact-form null center. It does not reveal a direction reversal or a scorer
error.

## Attainable range

The full form can produce restraint scores on both sides of 4. Its theoretical
attainable range under the live scoring contract is **2.51818 to 6.43636**
before the scorer's two-decimal display rounding.

Seven forced-choice items declare restraint on every option. For the lower
bound, select raw 1 on all four restraint Likert items, take the minimum
restraint option on each of those seven forced-choice items, and choose options
without restraint signals on the remaining choice items. The resulting ratio
is `(4 + 23.7) / 11 = 2.51818...`. For the upper bound, raw 7 on the four
Likert items and the seven mandatory-item maxima produce
`(28 + 42.8) / 11 = 6.43636...`. No optional second choice extends either
bound.

The issue is therefore not reachability. The issue is that the authored
forced-choice signal set places the exact full-form constructed null center
above the registered raw routing boundary.

## Public-copy consequence

The result may say that the raw score falls on one side of the registered
posture boundary. It may not call 4 a neutral center for the full form, infer a
symmetrically centered scale, or treat equal distances from 4 as equivalent
evidence. The detailed diagnostic tables remain in this research directory,
not on the main result page.
