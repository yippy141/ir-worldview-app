# V21 family weight rebalance

Date: 2026-07-29

## Decision

The four family-profile rows were zero-summed and then scaled to a common
L1 magnitude of 2.4875. The post-scoring Critical Political Economy
suppression rule was removed without replacement.

No item, dimension key, or `computeCoreDimensionScores` behavior changed.

## Derivation

> Family score is computed as Σ wᵢ · (xᵢ − 4). Decomposing each profile into a level component and a shape component, the score becomes m · Σwᵢ + Σ wᵢ dᵢ, where m is the respondent's mean centred score. Because acquiescence bias puts every observed dimension mean above 4, m is reliably positive. The current row sums are realist −0.45, institutionalist +2.25, constructivist +1.65, criticalPoliticalEconomy +0.90, so institutionalist receives a systematic advantage of roughly two points before any respondent-specific information is used.

For step 1, each transformed weight is
`w′ᵢ = wᵢ − (Σwᵢ / 7)`. For step 2, each row is multiplied by
`2.4875 / Σ|w′ᵢ|`.

Dimension columns below are the seven canonical keys in scoring order:

- `securityCompetition`
- `institutions`
- `domesticFilters`
- `normsIdentity`
- `politicalEconomy`
- `restraint`
- `orderJustice`

## Matrix before rebalance

| Family | securityCompetition | institutions | domesticFilters | normsIdentity | politicalEconomy | restraint | orderJustice | Row sum | L1 magnitude |
| --- | ---: | ---: | ---: | ---: | ---: | ---: | ---: | ---: | ---: |
| realist | 1.00000000 | −0.55000000 | −0.25000000 | −0.45000000 | 0.05000000 | −0.45000000 | 0.20000000 | −0.45 | 2.95 |
| institutionalist | −0.20000000 | 1.00000000 | 0.60000000 | 0.15000000 | 0.15000000 | 0.45000000 | 0.10000000 | 2.25 | 2.65 |
| constructivist | −0.20000000 | 0.25000000 | 0.10000000 | 1.00000000 | 0.10000000 | 0.20000000 | 0.20000000 | 1.65 | 2.05 |
| criticalPoliticalEconomy | −0.10000000 | −0.40000000 | 0.55000000 | 0.15000000 | 0.80000000 | 0.10000000 | −0.20000000 | 0.90 | 2.30 |

The baseline diagnostic in `diagnostics-before.txt` returned Liberal
Institutionalist for 500 of 500 random respondents (100.0%).

## Step 1: zero-sum rows

| Family | securityCompetition | institutions | domesticFilters | normsIdentity | politicalEconomy | restraint | orderJustice | Row sum | L1 magnitude |
| --- | ---: | ---: | ---: | ---: | ---: | ---: | ---: | ---: | ---: |
| realist | 1.06428571 | −0.48571429 | −0.18571429 | −0.38571429 | 0.11428571 | −0.38571429 | 0.26428571 | 1.11e−16 | 2.88571429 |
| institutionalist | −0.52142857 | 0.67857143 | 0.27857143 | −0.17142857 | −0.17142857 | 0.12857143 | −0.22142857 | −1.11e−16 | 2.17142857 |
| constructivist | −0.43571429 | 0.01428571 | −0.13571429 | 0.76428571 | −0.13571429 | −0.03571429 | −0.03571429 | −2.78e−17 | 1.55714286 |
| criticalPoliticalEconomy | −0.22857143 | −0.52857143 | 0.42142857 | 0.02142857 | 0.67142857 | −0.02857143 | −0.32857143 | 5.55e−17 | 2.22857143 |

Seeded family distribution after step 1:

| Family | Respondents | Share |
| --- | ---: | ---: |
| Liberal Institutionalist | 309 | 61.8% |
| Strategic Realist | 117 | 23.4% |
| Social Constructivist | 74 | 14.8% |
| Critical Political Economist | 0 | 0.0% |

## Step 2: equal L1 magnitude

The zero-sum rows were scaled by 0.8620049504950494,
1.1455592105263155, 1.5974770642201837, and 1.1161858974358974,
respectively.

| Family | securityCompetition | institutions | domesticFilters | normsIdentity | politicalEconomy | restraint | orderJustice | Row sum | L1 magnitude |
| --- | ---: | ---: | ---: | ---: | ---: | ---: | ---: | ---: | ---: |
| realist | 0.91741955 | −0.41868812 | −0.16008663 | −0.33248762 | 0.09851485 | −0.33248762 | 0.22781559 | 2.78e−17 | 2.4875 |
| institutionalist | −0.59732730 | 0.77734375 | 0.31912007 | −0.19638158 | −0.19638158 | 0.14728618 | −0.25365954 | −2.22e−16 | 2.4875 |
| constructivist | −0.69604358 | 0.02282110 | −0.21680046 | 1.22092890 | −0.21680046 | −0.05705275 | −0.05705275 | −1.39e−17 | 2.4875 |
| criticalPoliticalEconomy | −0.25512821 | −0.58998397 | 0.47039263 | 0.02391827 | 0.74943910 | −0.03189103 | −0.36674679 | 1.11e−16 | 2.4875 |

Seeded family distribution after step 2:

| Family | Respondents | Share |
| --- | ---: | ---: |
| Liberal Institutionalist | 292 | 58.4% |
| Strategic Realist | 113 | 22.6% |
| Social Constructivist | 95 | 19.0% |
| Critical Political Economist | 0 | 0.0% |

## Step 3: remove the CPE override

The matrix is unchanged from step 2. `computeCriticalSystemicSignal` and
the block that lowered a leading Critical Political Economy score beneath
the runner-up were deleted. The old suppression-behavior test was rewritten
to assert that a leading CPE score remains the direct rounded matrix product.

Seeded family distribution after step 3:

| Family | Respondents | Share |
| --- | ---: | ---: |
| Critical Political Economist | 423 | 84.6% |
| Liberal Institutionalist | 71 | 14.2% |
| Social Constructivist | 4 | 0.8% |
| Strategic Realist | 2 | 0.4% |

## Stop-threshold finding

The final 84.6% CPE share exceeds the specified 70% stop threshold.
`politicalEconomy` is the driving dimension:

- observed mean: 5.04672 (5.05 in the diagnostic)
- observed range: 4.23–5.78
- observed span: 1.55
- contribution to the CPE score at the mean profile: +0.78445
- contribution to CPE's advantage over institutionalist at the mean
  profile: +0.99001

As a read-only sensitivity check, setting only `politicalEconomy` to the
neutral midpoint reduced CPE outcomes from 423 of 500 (84.6%) to 3 of 500
(0.6%). No corrective override or further matrix adjustment was added.

Per the stop condition, the final lint, test, build, and repeated diagnostic
commands were not run.

## Step 4: standardise dimensions before family scoring

Step 3 established that equal row sums and magnitudes were not sufficient:
the random-respondent mean profile remained aligned with the CPE vector.
Step 4 therefore preserves the matrix and standardises each dimension only
inside `scoreFamilies`:

`zᵢ = (xᵢ − neutralMeanᵢ) / neutralSdᵢ`

Displayed dimension scores and `computeCoreDimensionScores` remain on their
natural 1–7 scale. A calibration SD below `1e−9` falls back to 1 and emits a
warning.

The note above that validation was not run records the required pause at the
end of step 3. Validation resumed after this separately requested step 4.

### Calibration

`CALIBRATION_VERSION` is `v21-random-baseline-2026-07-29`. The calibration
source is 500 seeded random respondents, seed `20260728`, analyst mode,
Foundation structural instrument version 3, generated on 2026-07-29.
Population standard deviations were calculated over the rounded dimension
scores used by family classification.

| Dimension | Mean | SD |
| --- | ---: | ---: |
| securityCompetition | 4.625600000000005 | 0.4968849363785998 |
| institutions | 4.627160000000002 | 0.20894098305496822 |
| domesticFilters | 5.225439999999994 | 0.3718542811372106 |
| normsIdentity | 4.728999999999997 | 0.49932975076598135 |
| politicalEconomy | 5.04672 | 0.307279093984641 |
| restraint | 4.736060000000002 | 0.24695966553259996 |
| orderJustice | 4.26404 | 0.298133658616421 |

The calibration is intentionally synthetic. Random respondents isolate
item-bank structure from population signal, and the baseline must be
regenerated whenever the item bank changes. Real-respondent percentiles
remain a separate Branch D percentile-service concern.

An invariant test now sets all seven dimensions to the calibration means and
requires all four family scores to equal zero within `1e−9`.

### Raw family-score consumer audit

Raw family-score magnitudes are not rendered as numbers, encoded into share
payloads, or persisted in current Foundation records. They do reach two live
UI decision paths:

1. `app/results/[payload]/page.tsx` passes `result.familyScores` to
   `getClosestTraditions` in `lib/result-helpers.ts`. That helper retains the
   raw primary and secondary scores and compares their gap to `0.45` to choose
   between single- and dual-tradition editorial copy. The numbers themselves
   are not rendered.
2. `analyzeScoreShape` passes the raw top-two gap through
   `assessFoundationNarrative` in `lib/narrative/foundation.ts`. Thresholds of
   `0.45` and `0.9` select low-differentiation versus sharply differentiated
   result and Profile narratives. The resulting state and copy reach the UI,
   and a derived summary string may be saved in `FoundationSnapshot`; the raw
   scores and gap are not saved.

These magnitude thresholds were not changed in step 4. Characterization tests
now record their behavior under standardised scores. Recalibrating those
thresholds requires a separate decision.

No raw family-score number crosses the other reviewed boundaries:

- Foundation V2/V3 share payloads contain dimension scores, family and
  runner-up keys, modifiers, and V3 provenance only. Family scores are
  recomputed transiently when a payload resolves.
- `FoundationSnapshot` in ProfileStore v5 persists dimension scores, family
  and runner-up keys, modifiers, payload, and provenance, but no family
  scores.
- legacy result history persists dimension scores, family and neighbor keys,
  modifiers, and provenance, but no family scores.
- the current research routes are inactive tombstones and store no family
  scores.

### Final Part 2 diagnostic

Family distribution:

| Family | Respondents | Share |
| --- | ---: | ---: |
| Liberal Institutionalist | 144 | 28.8% |
| Critical Political Economist | 131 | 26.2% |
| Strategic Realist | 129 | 25.8% |
| Social Constructivist | 96 | 19.2% |

Strategy modifier distribution:

| Modifier | Respondents | Share |
| --- | ---: | ---: |
| Hedger | 479 | 95.8% |
| Restrainer | 21 | 4.2% |

Normative modifier distribution:

| Modifier | Respondents | Share |
| --- | ---: | ---: |
| Conditional Solidarist | 456 | 91.2% |
| Universalist | 43 | 8.6% |
| Pluralist | 1 | 0.2% |

Full three-part label distribution:

| Label | Respondents | Share |
| --- | ---: | ---: |
| Strategic Realist / Hedger / Conditional Solidarist | 122 | 24.4% |
| Liberal Institutionalist / Hedger / Conditional Solidarist | 120 | 24.0% |
| Critical Political Economist / Hedger / Conditional Solidarist | 107 | 21.4% |
| Social Constructivist / Hedger / Conditional Solidarist | 86 | 17.2% |
| Critical Political Economist / Hedger / Universalist | 20 | 4.0% |
| Liberal Institutionalist / Hedger / Universalist | 14 | 2.8% |
| Liberal Institutionalist / Restrainer / Conditional Solidarist | 10 | 2.0% |
| Social Constructivist / Hedger / Universalist | 5 | 1.0% |
| Social Constructivist / Restrainer / Conditional Solidarist | 5 | 1.0% |
| Critical Political Economist / Restrainer / Conditional Solidarist | 4 | 0.8% |
| Strategic Realist / Hedger / Universalist | 4 | 0.8% |
| Strategic Realist / Restrainer / Conditional Solidarist | 2 | 0.4% |
| Strategic Realist / Hedger / Pluralist | 1 | 0.2% |

Observed dimension range:

| Dimension | Min | Max | Mean | SD | Span |
| --- | ---: | ---: | ---: | ---: | ---: |
| securityCompetition | 3.38 | 5.64 | 4.63 | 0.50 | 2.26 |
| institutions | 4.08 | 5.15 | 4.63 | 0.21 | 1.07 |
| domesticFilters | 4.18 | 6.07 | 5.23 | 0.37 | 1.89 |
| normsIdentity | 3.45 | 5.77 | 4.73 | 0.50 | 2.32 |
| politicalEconomy | 4.23 | 5.78 | 5.05 | 0.31 | 1.55 |
| restraint | 4.14 | 5.32 | 4.74 | 0.25 | 1.18 |
| orderJustice | 3.45 | 5.17 | 4.26 | 0.30 | 1.72 |

All four ideal profiles remain reachable.

### Sensitivity sweep

Each row holds the named dimension at its calibration mean for all 500
respondents. The four middle columns are the complete resulting family
distribution.

| Neutralised dimension | Realist | Institutionalist | Constructivist | CPE |
| --- | ---: | ---: | ---: | ---: |
| none (baseline) | 25.8% | 28.8% | 19.2% | 26.2% |
| securityCompetition | 37.6% | 21.2% | 19.2% | 22.0% |
| institutions | 23.4% | 31.8% | 18.8% | 26.0% |
| domesticFilters | 27.6% | 29.0% | 21.0% | 22.4% |
| normsIdentity | 23.4% | 22.4% | 33.6% | 20.6% |
| politicalEconomy | 28.8% | 27.8% | 20.4% | 23.0% |
| restraint | 27.4% | 28.6% | 19.0% | 25.0% |
| orderJustice | 26.4% | 28.6% | 18.4% | 26.6% |

The baseline leader is Liberal Institutionalist at 28.8%. Its share moves as
follows:

| Neutralised dimension | Resulting leader | Leader share | Institutionalist share | Move |
| --- | --- | ---: | ---: | ---: |
| securityCompetition | Strategic Realist | 37.6% | 21.2% | −7.6 pp |
| institutions | Liberal Institutionalist | 31.8% | 31.8% | +3.0 pp |
| domesticFilters | Liberal Institutionalist | 29.0% | 29.0% | +0.2 pp |
| normsIdentity | Social Constructivist | 33.6% | 22.4% | −6.4 pp |
| politicalEconomy | Strategic Realist | 28.8% | 27.8% | −1.0 pp |
| restraint | Liberal Institutionalist | 28.6% | 28.6% | −0.2 pp |
| orderJustice | Liberal Institutionalist | 28.6% | 28.6% | −0.2 pp |

The largest absolute movement is 7.6 percentage points when
`securityCompetition` is neutralised. This is far below the roughly
40-point fragility threshold and replaces the pre-standardisation
`politicalEconomy` movement from 84.6% to 0.6%.

### Outcome and validation

The outcome satisfies all specified checks:

- largest family: 28.8%, below 55%
- smallest family: 19.2%, above 5%
- largest single-dimension movement of the baseline leader: 7.6 percentage
  points, below about 40 points
- no family exceeds the 65% stop threshold

Final commands:

- `npm run lint`: passed
- `npm run test`: passed; 228 tests, 223 passed and 5 pre-existing skips
- `npm run build`: passed; production compilation, type checking, and 138
  static pages completed
- `npm run diagnose`: passed
- `npm run diagnose -- --sensitivity`: passed

## Step 5 — Narrative differentiation threshold calibration

The B2c standardisation changed raw family-score magnitudes, so the
pre-standardisation gap thresholds could no longer support the editorial
distinctions they governed. This step measured the current top-two family
score gap directly rather than scaling the old `0.45` and `0.9` constants.

### Gap distribution

`npm run diagnose -- --gaps` now reports the top-two family-score gap over the
same calibration sample: 500 seeded random respondents, seed `20260728`,
analyst mode, Foundation structural instrument version 3. Percentiles use
linear interpolation at rank `(N - 1) × p`.

| Statistic | Gap |
| --- | ---: |
| Min | 0.000000 |
| Max | 3.050000 |
| Mean | 0.552240 |
| Population SD | 0.450249 |
| p10 | 0.090000 |
| p25 | 0.210000 |
| p50 | 0.440000 |
| p75 | 0.790000 |
| p90 | 1.141000 |

The calibrated constants are therefore:

- `LOW_DIFFERENTIATION_THRESHOLD = 0.21`, the observed p25
- `SHARPLY_DIFFERENTIATED_THRESHOLD = 0.79`, the observed p75

Both now live in `lib/scoring-calibration.ts` alongside `NEUTRAL_BASELINE`.
The calibration comment records the full observed distribution, percentile
source, sample, and date (`2026-07-29`). The lower constant continues to
govern the `gap <= threshold` comparisons in `getClosestTraditions` and
`assessFoundationNarrative`; the upper constant continues to govern the
`gap >= threshold` comparison in `assessFoundationNarrative`.

The old sharply differentiated branch also had two non-gap `OR` fallbacks.
They caused 46.8% of the calibration sample to enter the sharp state even
after its gap threshold was set to p75. Those fallbacks were removed so the
sharp narrative state is actually governed by the requested upper-quartile
gap comparison. The existing low-state midpoint guard remains unchanged. No
narrative copy changed.

### Narrative-state distribution

| Narrative state | Before (`0.45` / `0.9`) | After (p25 / p75) |
| --- | ---: | ---: |
| Low differentiation | 38.8% | 19.4% |
| Stable moderation | 20.8% | 55.0% |
| Sharply differentiated | 40.4% | 25.6% |

The low state is below the raw gap quartile because its existing
`averageDistanceFromCenter <= 1.05` guard remains in place. Its observed
19.4% share is still within the required 25% ±8 percentage-point band. The
sharp state lands at 25.6%.

An invariant test now scores the same 500 seeded random respondents and
requires both tail-state shares to remain between 17% and 33%. Its comment
records that failure when the calibration and item bank drift out of sync is
intentional.

### Validation

- `npm run lint`: passed
- `npm run test`: passed; 229 tests, 224 passed and 5 pre-existing skips
- `npm run build`: passed; production compilation, type checking, and 138
  static pages completed
- `npm run diagnose`: passed
- `npm run diagnose -- --gaps`: passed; reported the distribution and
  post-calibration narrative-state shares above
