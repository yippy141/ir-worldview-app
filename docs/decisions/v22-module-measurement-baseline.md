# V22 module and AI measurement baseline

Date: 2 August 2026
Base: `6ab5704` (`origin/main`, completed V21)
Sample: 500 deterministic primary-only respondents per instrument and mode
Command: `npm run diagnose -- --modules --ai`

## Method

This baseline follows the runtime rather than inferring product behavior from
the JSON alone.

- Module results are reported separately for Standard and Advanced, using the
  same `cardType !== "actorLens"` exclusion as `buildModuleAnalytics`.
  Actor-lens option sets remain visible in the per-card audit because they
  still need to be coherent, but they do not affect the overall attainable
  ranges below.
- AI Governance is also reported separately by mode and uses the effective
  option set selected by the runtime, including `analystOptions` in Advanced.
  A missing scenario signal is a zero delta, which is how
  `applyScenarioWeights` evaluates it. The baseline reports scenario-delta
  extrema and final scores separately.
- Random results use seeded uniform Likert responses and seeded uniform
  primary choices. They are synthetic diagnostics, not population estimates.
- Optional backup choices are left blank. This primary-only baseline therefore
  does not claim to represent the separate backup-choice path.
- The exact module expectation averages each scored card's uniform option
  mean. The exact AI expectation enumerates each axis's Likert and scenario
  response distribution through the runtime's sequential clamp. The seeded
  sample is reported alongside those exact expectations.
- An item-level straddle is strict: a 1–7 option set needs a value below and
  above 4; a delta option set needs a value below and above 0.

## Acceptance table: before repair

| Gate | Baseline | Status |
|---|---|---|
| Every module axis has an attainable range of at least 3.0 | Standard: Security 1.60–2.17, Technology 1.37–2.53. Advanced: Security 1.57–2.22, Technology 1.19–2.66 | Fail in both modes |
| Every AI scenario axis spans zero with aggregate range at least 0.8 | Standard oversight is one-sided (+0.10 to +2.70); the other Standard axes and all Advanced axes span zero | Fail in Standard; pass in Advanced at bank level |
| Random baseline is within 0.3 of attainable-range centre | All 16 module mode-axis combinations pass | Pass |
| Exact module random baseline is within 0.3 of the scale midpoint | Only Security Standard activism is within 0.3; every other module mode-axis combination is farther from 4.0 | Diagnostic failure; add as a bank-level gate |
| Modal AI archetype is below 40% | Standard: Strategic Competitor 27.8%. Advanced: Democratic Guardrailist 53.4% | Standard passes; Advanced fails |
| Every Likert axis is at least 40% reverse-coded | Standard is 50% on every axis; seven of eight Advanced axes fail | Standard passes; Advanced fails |
| Every item-level scored axis straddles its midpoint with minimum spread | All 30 module cards and all 9 AI scenarios have at least one reported failure under the literal rule | Fail; rule needs construct review |
| Validator checks are blocking and passing | V22 A2 is reporting-only | Pending |

The module failure is decisive even without the item-level rule. The default
Security headline appears for 91.8% of Standard and 97.4% of Advanced seeded
respondents. The default Technology headline appears for 99.6% of Standard
and 100% of Advanced seeded respondents.

## Security module

### Standard runtime overall score

| Axis | Exact random mean | Seeded mean | Lowest attainable | Highest attainable | Range |
|---|---:|---:|---:|---:|---:|
| activism | 4.241 | 4.243 | 3.21 | 5.38 | 2.17 |
| escalation | 4.303 | 4.305 | 3.58 | 5.18 | 1.60 |
| alliance | 4.663 | 4.649 | 3.67 | 5.69 | 2.02 |
| legitimacy | 4.800 | 4.793 | 3.67 | 5.84 | 2.17 |

### Advanced runtime overall score

| Axis | Exact random mean | Seeded mean | Lowest attainable | Highest attainable | Range |
|---|---:|---:|---:|---:|---:|
| activism | 4.321 | 4.311 | 3.33 | 5.38 | 2.05 |
| escalation | 4.361 | 4.348 | 3.64 | 5.21 | 1.57 |
| alliance | 4.673 | 4.667 | 3.59 | 5.81 | 2.22 |
| legitimacy | 4.880 | 4.888 | 3.93 | 5.79 | 1.86 |

### Result and lane distributions

| Overall headline | Standard | Advanced |
|---|---:|---:|
| Targeted pressure with limits | 91.8% | 97.4% |
| Protection-sensitive statecraft | 4.2% | 1.8% |
| Restraint and crisis ceilings | 3.6% | 0.6% |
| Coalition-centered pressure management | 0.4% | 0.2% |

The lane table below records the Advanced primary-only baseline. The CLI now
prints the corresponding Standard distributions separately.

| Advanced lane | Modal summary | Share |
|---|---|---:|
| Deterrence and escalation | Bounded deterrence | 85.8% |
| Alliances and autonomy | Layered alignment | 73.4% |
| Order, legitimacy, and protection | Keeps order, protection, and legitimacy in view | 60.2% |

### Per-card failures

Ranges are `minimum–maximum`; `S` means the range does not strictly straddle
4.0 and `R` means its spread is below 2.0.

| Item | Failing axes |
|---|---|
| `taiwan_quarantine` | legitimacy 4.20–6.00 (S, R) |
| `gray_zone_sabotage` | alliance 4.20–6.10 (S, R); legitimacy 4.10–5.80 (S, R) |
| `shipping_attacks` | alliance 4.00–5.90 (S, R); legitimacy 4.00–6.00 (S) |
| `eastern_flank` | legitimacy 4.10–5.00 (S, R) |
| `maritime_pressure` | activism 3.50–5.10 (R); escalation 4.00–5.30 (S, R); legitimacy 4.20–5.90 (S, R) |
| `middle_power_alignment` (actor lens) | activism 3.70–5.00 (R); escalation 4.00–5.20 (S, R); legitimacy 4.10–5.50 (S, R) |
| `atrocity_response` | escalation 3.50–4.40 (R); alliance 4.10–5.00 (S, R) |
| `aid_corridor` | activism 3.20–4.80 (R); escalation 3.70–4.10 (R); alliance 4.00–5.10 (S, R) |
| `ceasefire_accountability` | activism 3.30–4.40 (R); escalation 3.60–4.20 (R); alliance 4.10–5.00 (S, R) |
| `iran_threshold` | alliance 4.10–5.90 (S, R); legitimacy 4.00–6.00 (S) |
| `beijing_below_war` | alliance 4.10–6.20 (S); legitimacy 4.00–5.10 (S, R) |
| `nuclear_hedging` | activism 3.90–5.30 (R); escalation 4.00–5.60 (S, R); legitimacy 4.20–5.60 (S, R) |
| `patron_trust_gap` | activism 3.80–5.20 (R); escalation 4.00–5.30 (S, R); legitimacy 4.10–5.40 (S, R) |
| `sanctions_enforcement` | activism 3.70–5.50 (R); escalation 3.80–4.90 (R); legitimacy 4.00–6.20 (S) |
| `selective_enforcement_memory` | activism 3.20–4.30 (R); escalation 3.90–4.20 (R); alliance 3.40–5.20 (R); legitimacy 5.30–6.10 (S, R) |

## Technology module

### Standard runtime overall score

| Axis | Exact random mean | Seeded mean | Lowest attainable | Highest attainable | Range |
|---|---:|---:|---:|---:|---:|
| control | 4.553 | 4.527 | 3.16 | 5.69 | 2.53 |
| governance | 4.697 | 4.714 | 3.54 | 6.04 | 2.50 |
| industrial | 4.797 | 4.794 | 3.63 | 5.81 | 2.18 |
| safety | 4.572 | 4.572 | 3.79 | 5.16 | 1.37 |

### Advanced runtime overall score

| Axis | Exact random mean | Seeded mean | Lowest attainable | Highest attainable | Range |
|---|---:|---:|---:|---:|---:|
| control | 4.523 | 4.528 | 3.19 | 5.73 | 2.54 |
| governance | 4.708 | 4.712 | 3.46 | 6.12 | 2.66 |
| industrial | 4.779 | 4.787 | 3.61 | 5.72 | 2.11 |
| safety | 4.554 | 4.553 | 3.90 | 5.09 | 1.19 |

### Result and lane distributions

| Overall headline | Standard | Advanced |
|---|---:|---:|
| Selective control with coordination | 99.6% | 100.0% |
| Coordinated governance | 0.2% | 0.0% |
| Openness with targeted safeguards | 0.2% | 0.0% |

The lane table below records the Advanced primary-only baseline. The CLI now
prints the corresponding Standard distributions separately.

| Advanced lane | Modal summary | Share |
|---|---|---:|
| Controls and dependence | Selective control | 73.4% |
| Capacity and industrial policy | Mixed market adaptation and public investment | 62.0% |
| Governance, access, and safety | Keeps coordination, access, and safety in frame | 77.0% |

### Per-card failures

| Item | Failing axes |
|---|---|
| `chips_controls` | safety 3.90–4.80 (R) |
| `open_weight_models` | governance 4.10–6.10 (S); industrial 4.00–4.60 (S, R) |
| `sovereign_stacks` | industrial 4.00–5.80 (S, R); safety 4.10–4.50 (S, R) |
| `fab_resilience` | safety 4.00–4.20 (S, R) |
| `industrial_policy` | safety 4.00–4.20 (S, R) |
| `public_compute` | control 3.20–4.20 (R); governance 4.00–6.10 (S); safety 4.00–4.70 (S, R) |
| `frontier_ai_governance` | industrial 4.00–5.90 (S, R) |
| `military_ai` | control 4.40–5.60 (S, R); industrial 4.00–5.20 (S, R) |
| `digital_development` (actor lens) | safety 4.00–4.30 (S, R) |
| `containment_critique` (actor lens) | industrial 4.60–5.60 (S, R); safety 4.00–4.60 (S, R) |
| `data_center_dependence` | safety 4.00–4.40 (S, R) |
| `subsidy_race` | safety 4.00–4.20 (S, R) |
| `regional_public_compute` | safety 4.00–4.30 (S, R) |
| `incident_reporting` | industrial 4.00–4.40 (S, R); safety 4.20–6.00 (S, R) |
| `ai_standards_voice` | control 3.90–5.50 (R); industrial 4.30–5.50 (S, R); safety 4.20–6.00 (S, R) |

## AI Governance Compass

### Standard runtime behavior

| Axis | Exact scenario delta total | Scenario delta min | Scenario delta max | Exact final mean | Seeded final mean | Seeded observed range | At floor | At ceiling |
|---|---:|---:|---:|---:|---:|---:|---:|---:|
| riskHorizon | +0.267 | −0.50 | +1.10 | 4.256 | 4.243 | 1.00–7.00 | 1.4% | 3.6% |
| deploymentPace | −0.233 | −2.40 | +1.90 | 3.788 | 3.908 | 1.00–7.00 | 2.2% | 2.4% |
| oversight | +1.333 | +0.10 | +2.70 | 5.236 | 5.184 | 1.90–7.00 | 0.0% | 12.4% |
| geopolitics | +0.700 | −1.00 | +2.40 | 4.649 | 4.638 | 1.00–7.00 | 1.2% | 7.0% |
| openness | −0.067 | −1.20 | +0.90 | 3.937 | 3.909 | 1.00–7.00 | 2.4% | 0.6% |
| militaryRole | +0.500 | −0.80 | +1.60 | 4.467 | 4.348 | 1.00–7.00 | 2.0% | 7.0% |
| legitimacy | +0.700 | −0.50 | +2.30 | 4.659 | 4.771 | 1.00–7.00 | 0.2% | 8.0% |
| humanFuture | +0.100 | −0.70 | +0.80 | 4.097 | 4.172 | 1.00–7.00 | 1.6% | 2.6% |

Standard oversight is directionally one-sided at the scenario-bank level and
already sends 12.4% of the seeded sample to the ceiling, but the combined
Likert-plus-scenario score can still move well below the midpoint.

### Advanced runtime behavior

| Axis | Exact scenario delta total | Scenario delta min | Scenario delta max | Exact final mean | Seeded final mean | Seeded observed range | At floor | At ceiling |
|---|---:|---:|---:|---:|---:|---:|---:|---:|
| riskHorizon | +0.350 | −0.50 | +1.90 | 4.344 | 4.343 | 1.00–7.00 | 0.6% | 1.6% |
| deploymentPace | +0.175 | −4.10 | +3.70 | 4.177 | 4.071 | 1.00–7.00 | 2.4% | 2.0% |
| oversight | +2.325 | −1.20 | +5.60 | 6.050 | 6.006 | 2.50–7.00 | 0.0% | 24.8% |
| geopolitics | +0.625 | −1.50 | +3.70 | 4.590 | 4.721 | 1.10–7.00 | 0.0% | 5.8% |
| openness | −0.275 | −2.60 | +1.40 | 3.744 | 3.626 | 1.00–7.00 | 1.6% | 1.2% |
| militaryRole | +0.275 | −0.80 | +1.90 | 4.252 | 4.332 | 1.00–7.00 | 1.4% | 4.0% |
| legitimacy | +1.750 | −1.00 | +5.60 | 5.609 | 5.574 | 1.55–7.00 | 0.0% | 16.6% |
| humanFuture | +0.050 | −0.60 | +0.80 | 4.049 | 3.988 | 1.00–6.80 | 0.4% | 0.0% |

All eight Advanced axes can move in both directions across the actual scenario
path. Oversight and legitimacy are nevertheless strongly elevated and heavily
ceiling-saturated in final random results, so the bias is real even though the
supplied “cannot go negative” explanation is not.

### Mode-specific archetype distributions

| Archetype | Standard | Advanced |
|---|---:|---:|
| Democratic Guardrailist | 24.8% | 53.4% |
| Strategic Competitor | 27.8% | 22.0% |
| Open Ecosystem Builder | 15.4% | 8.8% |
| Precautionary Steward | 15.4% | 8.0% |
| Coordination Architect | 9.2% | 4.2% |
| State Capacity Builder | 7.4% | 3.6% |

The modal-archetype failure is specific to Advanced in this seeded baseline.
Standard passes the proposed 40% gate.

### Mode-specific Likert reverse coding

| Axis | Standard | Advanced |
|---|---:|---:|
| riskHorizon | 1/2 (50.0%) | 1/3 (33.3%) |
| deploymentPace | 1/2 (50.0%) | 1/4 (25.0%) |
| oversight | 1/2 (50.0%) | 1/5 (20.0%) |
| geopolitics | 1/2 (50.0%) | 1/3 (33.3%) |
| openness | 1/2 (50.0%) | 1/3 (33.3%) |
| militaryRole | 1/2 (50.0%) | 1/2 (50.0%) |
| legitimacy | 1/2 (50.0%) | 1/4 (25.0%) |
| humanFuture | 1/2 (50.0%) | 1/4 (25.0%) |

Seven axes require at least one Advanced-only item rewrite each to reach 40%.
The prompt estimate of “roughly 4 new reverse items and 2 rewrites” cannot
cover seven independently scored axes.

### Per-scenario Advanced option-set failures

The literal item-level rule produces failures on incidental as well as primary
axes. Omitted signals count as zero, matching the scorer.

| Scenario | Axes without a strict straddle and/or 0.5 spread |
|---|---|
| `capabilityThreshold` | geopolitics, openness, militaryRole, legitimacy |
| `rivalBreakthrough` | deploymentPace, oversight, militaryRole, legitimacy |
| `openWeights` | riskHorizon, geopolitics, legitimacy |
| `militaryIntegration` | oversight, legitimacy |
| `multilateralVerification` | oversight |
| `futureSociety` | oversight, openness, legitimacy |
| `auditIncidentRegime` | geopolitics |
| `computeGovernance` | riskHorizon, oversight |
| `criticalInfrastructure` | riskHorizon, legitimacy, humanFuture |

## Correction to the supplied evaluation

The V22 evaluation's AI table is reproducible only by using standard options
for the analyst-only scenario list, excluding omitted signals instead of
treating them as zero, and then excluding scenarios that do not mention the
axis. That is a defined-signal average, not an attainable range. The claim
that oversight, legitimacy, and risk horizon cannot move negative is therefore
false for the actual analyst scorer.

The module table is directionally correct, but it includes actor-lens cards
that the overall scorer intentionally excludes. The runtime ranges above are
the appropriate acceptance baseline. The evaluation also says four of eight
saved module deltas are non-positive; its own table contains three.

## Gate design issue found by A2

The literal per-item rule treats each dense four-axis module card as four
simultaneous bipolar mini-scales and every sparse AI side-effect as a primary
construct. Making that rule blocking would pressure the item bank toward
construct contamination and low-pole filler—the failure mode the editorial
guardrails explicitly prohibit.

Before A3, each choice item should declare one or more intended discriminating
axes. CI should enforce per-item span on those declared axes, while enforcing
range, random-centre alignment, outcome distribution, and pole reachability at
the bank-and-mode level across all axes. The vector-midpoint “compromise” test
should remain a review warning: numeric proximity cannot establish that a
substantively distinct option is merely a compromise.

## Stability run already present

`npm run diagnose -- --stability` was already implemented in V21. The missing
piece was a recorded run, not code. On the current 68-item analyst form, a
two-answer perturbation changes family for 9.0%, strategy modifier for 6.6%,
normative modifier for 5.8%, the full three-part label for 20.4%, and narrative
differentiation state for 18.4% of the seeded sample. This passes the proposed
20% normative-variant gate on the current full form, but it is not the required
post-reshape core-form stability test.

## Revised Prompt 2B module-bank repair log

Date: 5 August 2026

The revised Prompt 2B withdraws the 3.0 raw attainable-range gate. A module
score is a mean across bounded items, so compression of that mean is not by
itself evidence that the bank cannot discriminate. The replacement gates test
centering, saturation, calibrated threshold reachability, default-headline
concentration, and declared construct coverage.

### 2B-0 — calibration before item edits

The V22 module scorer now standardises scores only for headline and lane
classification. Displayed axis and lane coordinates remain on their natural
scale. Low and high cuts are the p33 and p67 values from 500 deterministic
uniform-primary respondents, using base seed `20260728`, bank version 3,
scorer version 2, and linear interpolation at rank `(N - 1) × p`.
The reproducible instrument streams use seed `20261728` for Security and
`20261729` for Technology in both Standard and Advanced mode.

The calibration is deliberately synthetic: uniform choices isolate bank
structure from population signal. It must be regenerated after every bank
change.

One supporting integration sits outside the track's primary ownership list:
`lib/profile-store.ts` passes the payload mode when it regenerates V22
headline and lane copy. Without that small consumer change, a saved Advanced
result would silently be reclassified with Standard cuts. A focused
rehydration regression covers both modes; no component or app route changed.

| Instrument and mode | Default before | Default after calibration | Largest post-calibration headline |
|---|---:|---:|---:|
| Security Standard | 91.8% | 21.0% | 28.2% |
| Security Advanced | 97.4% | 20.2% | 29.4% |
| Technology Standard | 99.6% | 30.0% | 30.0% |
| Technology Advanced | 100.0% | 28.4% | 28.4% |

All calibrated cuts are inside their exact attainable ranges. Exact floor and
ceiling saturation remains 0.0% on every module axis. Uniform-choice
centering remains within 0.3 on all 16 instrument-mode-axis combinations.

The pre-edit calibration checkpoint left 14 reporting-only findings: 10
item-level straddle/spread findings and four coverage findings. Coverage still
failed for Security Standard escalation (2), Technology Standard industrial
(3), Technology Standard safety (2), and Technology Advanced safety (3).

Checkpoint bank hashes:

- Security V22: `eafeffb0e43aef796f969c592a701ec17098d52fa85b55761f88d586ab1b5f8e`
- Technology V22: `0c44343f35b6ff2a042791b4c0f8d84816477bb1eee9652bd966a6a94d4fe21c`

### Batch 1 — Security items 1–5

Edited, in source order:
`taiwan_quarantine`, `gray_zone_sabotage`, `shipping_attacks`,
`eastern_flank`, and `maritime_pressure`.
Calibration was regenerated before the checkpoint diagnostic.

Every signal-value change in this batch is recorded below. Values not listed
were unchanged.

| Item | Option | Axis | Before | After |
|---|---|---|---:|---:|
| `taiwan_quarantine` | `clarify_response` | legitimacy | 4.2 | 4.0 |
| `taiwan_quarantine` | `build_denial_endurance` | legitimacy | 4.8 | 4.0 |
| `taiwan_quarantine` | `preserve_hedging_space` | legitimacy | 4.9 | 4.0 |
| `taiwan_quarantine` | `raise_political_costs` | legitimacy | 6.0 | 4.0 |
| `gray_zone_sabotage` | `resolve_probe` | alliance | 4.9 | 4.0 |
| `gray_zone_sabotage` | `resolve_probe` | legitimacy | 4.1 | 4.0 |
| `gray_zone_sabotage` | `coalition_probe` | alliance | 6.1 | 4.0 |
| `gray_zone_sabotage` | `coalition_probe` | legitimacy | 4.8 | 4.0 |
| `gray_zone_sabotage` | `resilience_probe` | alliance | 4.5 | 4.0 |
| `gray_zone_sabotage` | `resilience_probe` | legitimacy | 4.4 | 4.0 |
| `gray_zone_sabotage` | `bait_for_escalation` | alliance | 4.2 | 4.0 |
| `gray_zone_sabotage` | `bait_for_escalation` | legitimacy | 5.8 | 4.0 |
| `shipping_attacks` | `punish_fast` | alliance | 4.4 | 4.0 |
| `shipping_attacks` | `protect_the_route` | alliance | 5.9 | 4.0 |
| `shipping_attacks` | `protect_the_route` | legitimacy | 5.1 | 4.0 |
| `shipping_attacks` | `keep_a_ceiling` | legitimacy | 4.6 | 4.0 |
| `shipping_attacks` | `anchor_in_regional_backing` | alliance | 4.9 | 4.0 |
| `shipping_attacks` | `anchor_in_regional_backing` | legitimacy | 6.0 | 4.0 |
| `eastern_flank` | `make_the_promise_visible` | legitimacy | 4.3 | 4.0 |
| `eastern_flank` | `build_reinforcement_depth` | legitimacy | 4.7 | 4.0 |
| `eastern_flank` | `prioritize_local_denial` | legitimacy | 4.1 | 4.0 |
| `eastern_flank` | `pair_reassurance_with_limits` | legitimacy | 5.0 | 4.0 |
| `maritime_pressure` | `build_local_resilience` | legitimacy | 4.2 | 3.2 |

The two new escalation declarations are on
`taiwan_quarantine` and `eastern_flank`; no option or item ID
changed. Editorial edits make the actor, decision, and clock explicit and
replace specialist-only option labels on the touched cards.

`npm run diagnose -- --modules` after this batch produced:

| Instrument and mode | Default headline | Largest headline | Minimum discriminating coverage | Largest centre error | Floor / ceiling saturation |
|---|---:|---:|---:|---:|---:|
| Security Standard | 19.0% | 28.2% | 4 | 0.124 | 0.0% / 0.0% |
| Security Advanced | 19.8% | 29.4% | 5 | 0.064 | 0.0% / 0.0% |
| Technology Standard | 30.0% | 30.0% | 2 | 0.128 | 0.0% / 0.0% |
| Technology Advanced | 28.4% | 28.4% | 3 | 0.114 | 0.0% / 0.0% |

All calibrated cuts remained reachable. Security coverage now passes in both
modes. The checkpoint printed 11 remaining findings: eight item-level
straddle/spread findings and three Technology coverage findings. Checkpoint
hashes:

- Security V22: `12fb15f5b2f82b5f5f248911d58d4fc01dfc8207524f5da1321e6daa5a0490cd`
- Technology V22: `0c44343f35b6ff2a042791b4c0f8d84816477bb1eee9652bd966a6a94d4fe21c`

### Batch 2 — Security items 6–10

Edited, in source order:
`middle_power_alignment`, `atrocity_response`, `aid_corridor`,
`ceasefire_accountability`, and `iran_threshold`.

| Item | Option | Axis | Before | After |
|---|---|---|---:|---:|
| `middle_power_alignment` | `ambiguity_will_fail` | legitimacy | 4.1 | 4.0 |
| `middle_power_alignment` | `layered_alignment_is_real` | legitimacy | 4.9 | 4.0 |
| `middle_power_alignment` | `autonomy_is_rational` | legitimacy | 5.3 | 4.0 |
| `middle_power_alignment` | `problem_based_coalitions` | legitimacy | 5.5 | 4.0 |
| `atrocity_response` | `legal_bar_remains_high` | alliance | 4.1 | 4.0 |
| `atrocity_response` | `limited_protection_can_qualify` | alliance | 4.6 | 4.0 |
| `atrocity_response` | `regional_authority_should_anchor` | alliance | 5.0 | 4.0 |
| `atrocity_response` | `reduce_harm_without_widening` | alliance | 4.3 | 4.0 |
| `aid_corridor` | `open_the_corridor` | activism | 4.8 | 5.6 |
| `aid_corridor` | `open_the_corridor` | alliance | 4.5 | 4.0 |
| `aid_corridor` | `seek_regional_cover` | alliance | 5.1 | 4.0 |
| `aid_corridor` | `intensify_indirect_pressure` | alliance | 4.5 | 4.0 |
| `ceasefire_accountability` | `stop_killing_first` | alliance | 4.1 | 4.0 |
| `ceasefire_accountability` | `accountability_sets_limits` | alliance | 4.2 | 4.0 |
| `ceasefire_accountability` | `regional_monitoring_compromise` | alliance | 5.0 | 4.0 |
| `ceasefire_accountability` | `bad_peace_can_recycle_harm` | alliance | 4.6 | 4.0 |
| `iran_threshold` | `threshold_is_a_leverage_problem` | alliance | 4.8 | 4.0 |
| `iran_threshold` | `threshold_is_a_containment_problem` | alliance | 4.1 | 4.0 |
| `iran_threshold` | `threshold_is_a_containment_problem` | legitimacy | 4.8 | 4.0 |
| `iran_threshold` | `threshold_is_a_coalition_problem` | alliance | 5.9 | 4.0 |
| `iran_threshold` | `threshold_is_a_coalition_problem` | legitimacy | 4.8 | 4.0 |
| `iran_threshold` | `threshold_is_a_legitimacy_problem` | alliance | 4.5 | 4.0 |
| `iran_threshold` | `threshold_is_a_legitimacy_problem` | legitimacy | 6.0 | 4.0 |

The `aid_corridor` activism repair gives the corridor-opening position an
honest high-activism pole; it is not a relabelled declaration. The five
scenes now name the deciding cabinet, mission team, coalition, mediation
team, or joint review team; name the decision; and set a deadline. The
ceasefire card now tests a concrete verification-package choice within a
72-hour draft rather than repeating Foundation's general settlement
principle.

After regenerating calibration, `npm run diagnose -- --modules` produced:

| Instrument and mode | Default headline | Largest headline | Minimum discriminating coverage | Largest centre error | Floor / ceiling saturation |
|---|---:|---:|---:|---:|---:|
| Security Standard | 17.2% | 27.2% | 4 | 0.124 | 0.0% / 0.0% |
| Security Advanced | 21.6% | 29.0% | 5 | 0.075 | 0.0% / 0.0% |
| Technology Standard | 30.0% | 30.0% | 2 | 0.128 | 0.0% / 0.0% |
| Technology Advanced | 28.4% | 28.4% | 3 | 0.114 | 0.0% / 0.0% |

All calibrated cuts remained reachable. The checkpoint printed 10 remaining
findings: seven item-level straddle/spread findings and three Technology
coverage findings. The geometric detector printed one non-blocking review
finding for `ceasefire_accountability.regional_monitoring_compromise`; the
option remains substantively distinct because it assigns first-watch
authority to regional monitors, rather than averaging immediate harm
cessation with later violation costs.

Checkpoint hashes:

- Security V22: `2f3369efd075d534310a28010bc1d0190a12faa5258e72c9877d1dbbc36c0305`
- Technology V22: `0c44343f35b6ff2a042791b4c0f8d84816477bb1eee9652bd966a6a94d4fe21c`

### Batch 3 — Security items 11–15

Edited, in source order:
`beijing_below_war`, `nuclear_hedging`, `patron_trust_gap`,
`sanctions_enforcement`, and `selective_enforcement_memory`.

| Item | Option | Axis | Before | After |
|---|---|---|---:|---:|
| `beijing_below_war` | `normalize_baseline` | alliance | 4.7 | 4.0 |
| `beijing_below_war` | `split_coalition` | alliance | 6.2 | 4.0 |
| `beijing_below_war` | `split_coalition` | legitimacy | 4.8 | 4.0 |
| `beijing_below_war` | `probe_thresholds` | alliance | 4.8 | 4.0 |
| `beijing_below_war` | `probe_thresholds` | legitimacy | 4.1 | 4.0 |
| `beijing_below_war` | `hold_military_ceiling` | alliance | 4.1 | 4.0 |
| `beijing_below_war` | `hold_military_ceiling` | legitimacy | 5.1 | 4.0 |
| `nuclear_hedging` | `restore_confidence_fast` | legitimacy | 4.2 | 4.0 |
| `nuclear_hedging` | `lower_demand_for_latency` | escalation | 4.0 | 3.2 |
| `nuclear_hedging` | `lower_demand_for_latency` | legitimacy | 5.6 | 4.0 |
| `nuclear_hedging` | `tolerate_some_hedging` | legitimacy | 4.8 | 4.0 |
| `nuclear_hedging` | `protect_nonproliferation_early` | legitimacy | 5.2 | 4.0 |
| `patron_trust_gap` | `lock_in_guarantee` | legitimacy | 4.1 | 4.0 |
| `patron_trust_gap` | `diversify_backers` | legitimacy | 5.0 | 4.0 |
| `patron_trust_gap` | `build_denial_home` | legitimacy | 4.2 | 4.0 |
| `patron_trust_gap` | `keep_it_issue_based` | legitimacy | 5.4 | 4.0 |
| `sanctions_enforcement` | `resistance_is_about_leakage` | legitimacy | 4.0 | 3.0 |
| `selective_enforcement_memory` | `sovereignty_barrier_is_the_issue` | legitimacy | 5.9 | 2.9 |
| `selective_enforcement_memory` | `burden_is_asymmetric` | alliance | 3.4 | 3.0 |

`selective_enforcement_memory` now declares legitimacy because historical
selectivity, sovereignty precedent, regional authority, and unequal burdens
are the substance of the card. Its options genuinely span that construct.
The nuclear low pole now represents a defensible framework designed to reduce
demand for an independent bomb option. The sanctions hard-ban was replaced
with a direct autonomy claim. All five scenes identify the deciding body, its
decision, and a deadline.

After regenerating calibration, `npm run diagnose -- --modules` produced:

| Instrument and mode | Default headline | Largest headline | Minimum discriminating coverage | Largest centre error | Floor / ceiling saturation |
|---|---:|---:|---:|---:|---:|
| Security Standard | 17.2% | 27.2% | 4 | 0.124 | 0.0% / 0.0% |
| Security Advanced | 22.6% | 28.0% | 6 | 0.131 | 0.0% / 0.0% |
| Technology Standard | 30.0% | 30.0% | 2 | 0.128 | 0.0% / 0.0% |
| Technology Advanced | 28.4% | 28.4% | 3 | 0.114 | 0.0% / 0.0% |

All calibrated cuts remained reachable. Security has no remaining blocking
measurement finding; all six remaining findings are in Technology. The
geometric detector also flagged `beijing_below_war.split_coalition`. It is
retained after review: splitting outside partners is a coalition mechanism,
not a numeric compromise between learning response thresholds and avoiding
open-war costs.

Checkpoint hashes:

- Security V22: `4ada4a5625952dcdce6113414e5796295625939d2ad18341d8451898a6b923ea`
- Technology V22: `0c44343f35b6ff2a042791b4c0f8d84816477bb1eee9652bd966a6a94d4fe21c`

### Batch 4 — Technology items 1–5

Edited, in source order:
`chips_controls`, `open_weight_models`, `sovereign_stacks`,
`fab_resilience`, and `industrial_policy`.

| Item | Option | Axis | Before | After |
|---|---|---|---:|---:|
| `chips_controls` | `preserve_the_chokepoint` | industrial | 5.0 | 4.0 |
| `chips_controls` | `coordinate_narrow_controls` | industrial | 4.6 | 4.0 |
| `chips_controls` | `build_capacity_instead` | industrial | 6.3 | 4.0 |
| `chips_controls` | `avoid_total_securitization` | industrial | 3.9 | 4.0 |
| `open_weight_models` | `restrict_above_threshold` | governance | 4.7 | 4.0 |
| `open_weight_models` | `restrict_above_threshold` | industrial | 4.2 | 4.0 |
| `open_weight_models` | `staged_release_rules` | governance | 6.1 | 4.0 |
| `open_weight_models` | `staged_release_rules` | industrial | 4.4 | 4.0 |
| `open_weight_models` | `keep_access_broad` | governance | 4.1 | 4.0 |
| `open_weight_models` | `focus_on_deployer_controls` | governance | 5.1 | 4.0 |
| `open_weight_models` | `focus_on_deployer_controls` | industrial | 4.6 | 4.0 |
| `sovereign_stacks` | `fragmentation_cost_logic` | industrial | 4.0 | 2.9 |

`sovereign_stacks` now declares industrial because its choice among local
capacity, dependency management, development room, and fragmentation cost is
genuinely a productive-capacity decision. The low pole states the opportunity
cost of spending scarce money on a fragmented local stack. The hard-ban copy
now names export controls, sanctions, and provider withdrawal directly. The
fab and industrial-policy rewrites distinguish a semiconductor resilience
portfolio from a national AI-capacity investment model.

After regenerating calibration, `npm run diagnose -- --modules` produced:

| Instrument and mode | Default headline | Largest headline | Minimum discriminating coverage | Largest centre error | Floor / ceiling saturation |
|---|---:|---:|---:|---:|---:|
| Security Standard | 17.2% | 27.2% | 4 | 0.124 | 0.0% / 0.0% |
| Security Advanced | 22.6% | 28.0% | 6 | 0.131 | 0.0% / 0.0% |
| Technology Standard | 28.6% | 28.6% | 2 | 0.132 | 0.0% / 0.0% |
| Technology Advanced | 28.6% | 28.8% | 3 | 0.152 | 0.0% / 0.0% |

All calibrated cuts remained reachable. Industrial coverage now passes in
both modes. Five findings remain: the `public_compute` governance straddle,
the two `ai_standards_voice` safety findings, and two Technology safety
coverage findings.

The geometric detector also flagged
`open_weight_models.focus_on_deployer_controls`. It remains after review
because regulating deployed high-risk systems changes the regulated object;
it is not a compromise between staged weight release and open weights.

Checkpoint hashes:

- Security V22: `4ada4a5625952dcdce6113414e5796295625939d2ad18341d8451898a6b923ea`
- Technology V22: `e2f4e37a2e74debc785d2dd077f958c17af63d38896db1bed7817e3f8210c569`

### Batch 5 — Technology items 6–10

Edited, in source order:
`public_compute`, `frontier_ai_governance`, `military_ai`,
`digital_development`, and `containment_critique`.

| Item | Option | Axis | Before | After |
|---|---|---|---:|---:|
| `public_compute` | `build_public_compute` | safety | 4.6 | 5.0 |
| `public_compute` | `share_trusted_infrastructure` | safety | 4.7 | 6.0 |
| `public_compute` | `let_private_scale_lead` | governance | 4.0 | 3.2 |
| `public_compute` | `let_private_scale_lead` | safety | 4.0 | 3.0 |
| `public_compute` | `treat_access_as_development` | safety | 4.4 | 3.4 |
| `frontier_ai_governance` | `use_hard_thresholds` | industrial | 4.2 | 4.0 |
| `frontier_ai_governance` | `govern_with_capable_partners` | industrial | 4.5 | 4.0 |
| `frontier_ai_governance` | `treat_capability_as_strategic` | industrial | 5.9 | 4.0 |
| `military_ai` | `field_quickly` | industrial | 5.2 | 4.0 |
| `military_ai` | `gate_the_fielding` | industrial | 4.5 | 4.0 |
| `military_ai` | `set_coalition_baselines` | industrial | 4.4 | 4.0 |
| `digital_development` | `sovereign_capacity_problem` | industrial | 5.8 | 4.0 |
| `digital_development` | `interoperability_problem` | industrial | 4.8 | 4.0 |
| `digital_development` | `collective_capacity_problem` | industrial | 6.0 | 4.0 |
| `digital_development` | `exclusion_problem` | industrial | 3.8 | 4.0 |
| `containment_critique` | `strategic_denial_is_real` | industrial | 5.0 | 4.0 |
| `containment_critique` | `rule_design_is_the_issue` | industrial | 4.6 | 4.0 |
| `containment_critique` | `hierarchy_management_is_real` | industrial | 5.6 | 4.0 |
| `containment_critique` | `nonalignment_will_persist` | industrial | 4.6 | 4.0 |

`public_compute` and `frontier_ai_governance` now declare safety. The former
was rewritten as a domestic research-computing allocation with explicit
screening, monitoring, and high-risk-use constraints; the latter already
offered an honest 3.3–6.3 safety span. These declarations bring safety
coverage to four Standard items and five Advanced items. The other changes
remove incidental industrial nudges without changing the cards' declared
logics.

The editorial pass distinguishes domestic public-compute access and
safeguards from a later cross-border financing decision; distinguishes a
sanctions-constrained national technology strategy from one provider
contract; and keeps the containment card focused on export-control legitimacy
and technological hierarchy rather than generic alignment.

After regenerating calibration, `npm run diagnose -- --modules` produced:

| Instrument and mode | Default headline | Largest headline | Minimum discriminating coverage | Largest centre error | Floor / ceiling saturation |
|---|---:|---:|---:|---:|---:|
| Security Standard | 17.2% | 27.2% | 4 | 0.124 | 0.0% / 0.0% |
| Security Advanced | 22.6% | 28.0% | 6 | 0.131 | 0.0% / 0.0% |
| Technology Standard | 31.2% | 31.2% | 4 | 0.179 | 0.0% / 0.0% |
| Technology Advanced | 31.0% | 31.0% | 5 | 0.181 | 0.0% / 0.0% |

All calibrated cuts remained reachable. All coverage findings are gone. The
only two remaining findings are the midpoint-straddle and minimum-spread
findings on `ai_standards_voice.safety`, assigned to the final five-item
batch.

Checkpoint hashes:

- Security V22: `4ada4a5625952dcdce6113414e5796295625939d2ad18341d8451898a6b923ea`
- Technology V22: `84e50c3d78aa87c4a202b3effb6bdeb4b902938fe01ceea40635d870e6bfc4f8`

### Batch 6 — Technology items 11–15

Edited, in source order:
`data_center_dependence`, `subsidy_race`, `regional_public_compute`,
`incident_reporting`, and `ai_standards_voice`.

| Item | Option | Axis | Before | After |
|---|---|---|---:|---:|
| `data_center_dependence` | `take_access_now` | industrial | 3.8 | 4.0 |
| `data_center_dependence` | `control_sensitive_layers` | industrial | 5.0 | 4.0 |
| `data_center_dependence` | `diversify_before_lockin` | industrial | 4.8 | 4.0 |
| `data_center_dependence` | `pool_regionally_first` | industrial | 6.0 | 4.0 |
| `incident_reporting` | `shift_liability_to_deployment` | industrial | 4.4 | 4.0 |
| `incident_reporting` | `avoid_overgeneralizing_from_one_incident` | industrial | 4.1 | 4.0 |
| `ai_standards_voice` | `capable_states_must_lead` | industrial | 4.3 | 4.0 |
| `ai_standards_voice` | `legitimacy_needs_voice` | industrial | 4.5 | 4.0 |
| `ai_standards_voice` | `development_costs_are_hidden` | industrial | 5.5 | 4.0 |
| `ai_standards_voice` | `sovereignty_room_matters` | industrial | 4.8 | 4.0 |
| `ai_standards_voice` | `sovereignty_room_matters` | safety | 4.2 | 3.0 |

There were no signal changes on `subsidy_race` or
`regional_public_compute`. Their editorial rewrites still make the allied
subsidy-budget decision and the cross-border financing-and-control decision
concrete. `ai_standards_voice` now gives national discretion an explicit
tradeoff—greater variation and slower shared safeguards—so its safety low
pole is defensible rather than weak. Its hard-ban prompt is now a direct
question about which concern should govern standards that apply globally.

After regenerating calibration, `npm run diagnose -- --modules` produced:

| Instrument and mode | Default headline | Largest headline | Minimum discriminating coverage | Largest centre error | Floor / ceiling saturation |
|---|---:|---:|---:|---:|---:|
| Security Standard | 17.2% | 27.2% | 4 | 0.124 | 0.0% / 0.0% |
| Security Advanced | 22.6% | 28.0% | 6 | 0.131 | 0.0% / 0.0% |
| Technology Standard | 31.2% | 31.2% | 4 | 0.179 | 0.0% / 0.0% |
| Technology Advanced | 32.2% | 32.2% | 5 | 0.198 | 0.0% / 0.0% |

All calibrated headline and lane cuts are reachable. The diagnostic prints
zero measurement-gate failures and zero items without a qualifying
discriminating axis. The three geometric review findings are the already
reviewed, substantively distinct options recorded in Batches 2–4.

Final module-bank hashes:

- Security V22: `4ada4a5625952dcdce6113414e5796295625939d2ad18341d8451898a6b923ea`
- Technology V22: `babfdcd7cf84130adb0736ee5abe49c661836ba1cee9ad1fde8799840042a968`

The module-specific regression now blocks on the revised 2B acceptance
criteria even while the broader 2A gates remain reporting-only until 2C.
Coverage counts only declared items whose option sets actually straddle 4.0
with at least 2.0 spread; a declaration alone cannot raise the count. The
standalone diagnostic derives threshold reachability from the live questions,
not from the generated range stored beside each cut. Only the declared
default-headline share is gated; the largest headline remains reported for
review.

## Final verification — 2026-08-05

The required commands were rerun on the completed tree:

- `npm run lint` — pass.
- `npm run validate` — pass. The generated module calibration is current and
  the module diagnostics report zero failures. The command still prints the
  35 previously declared AI Governance findings because the broader V22 gates
  remain reporting-only until the end of 2C; those findings are outside this
  module-bank repair.
- `npm run test` — pass, 368 tests.
- `npm run build` — pass, including strict TypeScript checking and generation
  of all 146 application pages.
- `npm run diagnose -- --modules` — pass, with zero measurement-gate failures
  and zero items without a qualifying discriminating axis.

The final diagnostic retains three permanently non-blocking geometric-
compromise review findings. Their editorial dispositions are recorded in the
batch notes above; none is being used to satisfy a measurement gate.

## Prompt 2C AI Compass repair — 2026-08-06

The repair changes only the V22 bank, `ai-governance.v3.json`. The frozen V21
bank and scorer remain unchanged. Its SHA-256 is still
`7a6fc3af779f29c04a249e92c887bc9168af9f49eeb7b436e29f8c3116c0810c`.
The active tuple remains bank version 3 and scoring version 2; no scorer,
rescaling, or post-hoc presentation override was added.

### 2C1 — Advanced Likert valence

Standard already had one forward and one reverse item on every axis. Seven
Advanced axes failed independently because their analyst-only additions were
all forward-coded. One analyst-only proposition on each failing axis was
rewritten as a substantively opposed position and marked `reverse: true`.
No item was added, and every rewritten proposition avoids `not`, `never`, and
`no longer`.

| Axis | Rewritten item | Standard before → after | Advanced before → after |
|---|---|---:|---:|
| riskHorizon | `rh3` | 1/2 (50.0%) → 1/2 (50.0%) | 1/3 (33.3%) → 2/3 (66.7%) |
| deploymentPace | `dp4` | 1/2 (50.0%) → 1/2 (50.0%) | 1/4 (25.0%) → 2/4 (50.0%) |
| oversight | `ov5` | 1/2 (50.0%) → 1/2 (50.0%) | 1/5 (20.0%) → 2/5 (40.0%) |
| geopolitics | `gp3` | 1/2 (50.0%) → 1/2 (50.0%) | 1/3 (33.3%) → 2/3 (66.7%) |
| openness | `op3` | 1/2 (50.0%) → 1/2 (50.0%) | 1/3 (33.3%) → 2/3 (66.7%) |
| militaryRole | — | 1/2 (50.0%) → 1/2 (50.0%) | 1/2 (50.0%) → 1/2 (50.0%) |
| legitimacy | `lg4` | 1/2 (50.0%) → 1/2 (50.0%) | 1/4 (25.0%) → 2/4 (50.0%) |
| humanFuture | `hf3` | 1/2 (50.0%) → 1/2 (50.0%) | 1/4 (25.0%) → 2/4 (50.0%) |

The opposed propositions represent, respectively: confidence in behavioral
evaluation despite incomplete mechanistic understanding; staged deployment
as a route to critical-infrastructure assurance; lab-led continuous audit;
reciprocal monitoring under rivalry; wider weight access as distributed
scrutiny; performance and competence as sources of legitimacy; and possible
future machine interests as morally relevant. These are positions a trained
reader could defend, rather than grammatical negations of the forward items.

After this valence-only batch, Standard was unchanged. Advanced
Democratic Guardrailist concentration moved from 53.4% in the original
baseline to 52.4%; the scenario repair therefore remained necessary.

### 2C2 — mode-specific scenario repair

Standard `options` and Advanced `analystOptions` were repaired separately.
An omitted signal is recorded below as `0`, matching the scorer.

Standard signal changes:

- `capabilityThreshold.C`: oversight 0 → −1.0.
- `rivalBreakthrough.A`: deploymentPace 0 → +0.7; militaryRole 0 → −0.7.
- `rivalBreakthrough.B`: geopolitics +0.5 → 0.
- `rivalBreakthrough.C`: legitimacy 0 → −0.7.
- `openWeights.C`: oversight 0 → −1.0.
- `militaryIntegration.A`: geopolitics 0 → −0.7.
- `multilateralVerification.B`: oversight +0.1 → −1.0.
- `futureSociety.C`: legitimacy 0 → −0.5.

Advanced signal changes:

- `capabilityThreshold.A`: riskHorizon +0.8 → +0.5.
- `capabilityThreshold.C`: oversight 0 → −1.0; legitimacy 0 → −1.0.
- `rivalBreakthrough.A`: deploymentPace 0 → +0.4; militaryRole 0 → −0.5.
- `rivalBreakthrough.B`: geopolitics +0.4 → 0.
- `rivalBreakthrough.C`: oversight 0 → −1.0; legitimacy 0 → −1.0.
- `openWeights.A`: legitimacy 0 → −1.0.
- `openWeights.C`: oversight 0 → −1.0.
- `militaryIntegration.A`: geopolitics 0 → −1.0.
- `militaryIntegration.C`: oversight 0 → −1.0; legitimacy 0 → −1.0.
- `multilateralVerification.D`: oversight +0.3 → −1.0.
- `futureSociety.C`: oversight 0 → −1.0.
- `futureSociety.D`: legitimacy +0.3 → −1.0.
- `computeGovernance.C`: oversight 0 → −1.0.
- `computeGovernance.D`: oversight 0 → −1.0.
- `criticalInfrastructure.C`: legitimacy 0 → −1.0.

The negative poles attach to choices that place authority inside a lab,
accelerate under rivalry, diffuse control, privilege a frontier-capable club,
or accept institutional strain. They therefore encode the option's stated
logic rather than serving as numerical ballast. All 15 previously failing
declared scenario axes now strictly straddle zero with at least 0.5 spread.

### Final exact mode-level results

The diagnostic's exact enumerated saturation is the blocking measure. The
prompt's 24.8% and 16.6% figures were the accompanying seeded estimates; the
corresponding pre-repair exact Advanced ceiling rates were stricter at 27.9%
for oversight and 17.5% for legitimacy.

| Mode | Axis | Exact uniform mean | Distance from attainable centre | Exact floor / ceiling |
|---|---|---:|---:|---:|
| Standard | riskHorizon | 4.256 | 0.256 | 1.4% / 3.9% |
| Standard | deploymentPace | 3.999 | 0.001 | 2.5% / 3.2% |
| Standard | oversight | 4.290 | 0.290 | 2.7% / 7.4% |
| Standard | geopolitics | 4.273 | 0.273 | 1.4% / 4.3% |
| Standard | openness | 3.937 | 0.063 | 3.6% / 0.9% |
| Standard | militaryRole | 4.251 | 0.251 | 2.7% / 5.9% |
| Standard | legitimacy | 4.280 | 0.280 | 1.6% / 4.8% |
| Standard | humanFuture | 4.097 | 0.097 | 2.0% / 2.7% |
| Advanced | riskHorizon | 4.272 | 0.272 | 0.2% / 1.2% |
| Advanced | deploymentPace | 4.269 | 0.269 | 1.1% / 3.5% |
| Advanced | oversight | 4.267 | 0.267 | 1.8% / 6.5% |
| Advanced | geopolitics | 4.256 | 0.256 | 1.0% / 3.2% |
| Advanced | openness | 3.744 | 0.256 | 2.4% / 1.1% |
| Advanced | militaryRole | 4.135 | 0.135 | 2.7% / 4.0% |
| Advanced | legitimacy | 4.186 | 0.186 | 3.2% / 6.0% |
| Advanced | humanFuture | 4.049 | 0.049 | 0.2% / 0.3% |

The seeded modal archetype is now Strategic Competitor at 25.2% in Standard
and 27.0% in Advanced. Democratic Guardrailist falls from 53.4% to 16.8% in
Advanced. Every scenario-delta bank reaches both sides of zero, every exact
centre error is at most 0.290, and every exact floor and ceiling rate is below
10%.

### Gate activation

The repair reduced the combined AI finding count from 35 before 2C, to 28
after the valence batch, to zero after the mode-specific scenario batch.
`MEASUREMENT_GATES_BLOCKING` is now `true`. Structural validation and the
bank diagnostics therefore fail the build on any gate finding. Geometric
compromise findings remain a separate review classification and never enter
the blocking error path. The three previously reviewed module findings remain
visible during validation; AI has zero geometric findings.

Final V22 AI bank SHA-256:
`c61fc704a2121696effc2323f78ba0133ec8c7ae13b60133ef7928fb6f65bfd6`.

### Final verification

The completed bank and blocking gates passed `npm run lint`,
`npm run validate`, all 384 tests in `npm run test`, the 146-page production
build in `npm run build`, and `npm run diagnose -- --ai`. The standalone AI
diagnostic reported zero blocking findings, zero items without a qualifying
discriminating axis, and zero AI geometric-compromise findings. The V21
immutable snapshot and golden replay also passed unchanged; the V22 golden
fixture was updated to record the repaired bank's intended result.
