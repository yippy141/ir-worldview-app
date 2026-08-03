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
