# V22 item-bank editorial preflight

Date: 2 August 2026
Status: audit complete; production rewrites held for instrument versioning and
item-axis contract

## Why this is a preflight

The V22 prompt correctly combines measurement and prose work so each card is
touched once. It does not specify how existing answer-based module links keep
their original result after signals or membership change, and its literal
four-axis-per-card span rule would over-constrain the items. This record
therefore identifies copy failures and duplicate candidates without changing
production IDs, signals, or membership.

## Exact banned-copy hits

| Bank / item | Field | Hit | Required edit |
|---|---|---|---|
| Security / `selective_enforcement_memory` | option label | “not because … but because …” | State the positive causal claim directly. |
| Technology / `sovereign_stacks` | option label | “when pressure sharpens” | Name the concrete pressure or consequence. |
| Technology / `ai_standards_voice` | prompt | “the deeper issue” | Ask for the decision or governing concern directly. |
| AI Governance / `auditIncidentRegime` | prompt | “did not reach the public but exposed …” | Preserve the factual contrast without the banned antithesis construction. |

No other exact matches were found for `sharpens`, intransitive `tracks`, `in
play`, intransitive `lands`, `sits`, `surfaces`, “what this leaves open,” or
the specified `not X but Y` pattern in the three V22 banks.

## Similarity candidates requiring editorial review

The list below is a lexical screen, not an instruction to delete. A pair is a
true duplicate only when it asks the same actor to make the same tradeoff and
the option logics provide no distinct measurement value.

| Candidate pair | Why it was flagged | Initial judgment |
|---|---|---|
| Security `ceasefire_accountability` / Foundation `an_tradeoff_ceasefire_settlement` | Both test whether accountability should constrain a settlement that can stop ongoing harm. | High-priority review; likely overlap, but module context may justify a sharper security-specific decision. |
| Technology `fab_resilience` / `industrial_policy` | Both ask how government should rebuild strategic productive capacity amid disagreement over vulnerability. | Merge/rewrite candidate; preserve lane balance if one leaves. |
| Technology `industrial_policy` / `regional_public_compute` | Public capacity-building and market-vs-state provision recur across industrial and compute settings. | Probably distinct sectors, but current option logics need a clearer difference. |
| Security `maritime_pressure` / `patron_trust_gap` | Exposed smaller states weigh outside support against room for autonomy. | Likely distinct crisis stages; sharpen actor, clock, and decision. |
| Technology `digital_development` / `data_center_dependence` | Both ask how a lower-capacity state avoids cloud/infrastructure dependence. | High-priority review; actor-lens versus direct decision must be unmistakable. |
| Security `sanctions_enforcement` / `selective_enforcement_memory` | Both explain why middle powers resist sanctions enforcement associated with powerful states. | High-priority review; one can test immediate enforcement, the other legitimacy formed by historical selectivity. |
| Security `taiwan_quarantine` / `beijing_below_war` | Both model Beijing calibrating pressure below invasion around Taiwan. | Likely duplicate unless one is a threshold decision and the other a mechanism explanation. |
| Security `middle_power_alignment` / Foundation `an_case_middle_power` | Both ask a middle power to preserve room under bloc pressure. | Cross-instrument overlap; module version should add a genuinely security-specific constraint. |
| Security `atrocity_response` / Foundation `case_protection` | Both weigh limited protection action amid mass killing and weak Security Council authority. | High-priority cross-instrument overlap review. |
| Technology `data_center_dependence` / `regional_public_compute` | Both concern shared public infrastructure as an answer to external cloud dependence. | Likely complementary only if one diagnoses dependence and one chooses financing/governance. |
| Technology `public_compute` / `regional_public_compute` | Both ask how public compute should widen access. | Strong duplicate candidate; regional coordination must add a distinct logic or one item should be replaced. |
| Technology `containment_critique` / Foundation `an_case_middle_power` | Both model a pressured middle power seeking bargaining room rather than full alignment. | Cross-instrument overlap; technology dependence must be essential to the answer structure. |

## Removal gate

Do not remove an item until all four conditions hold:

1. A reviewer records the shared actor/decision/clock and overlapping option
   logics, rather than relying on lexical similarity.
2. The weaker item has a named replacement or the lane/card-type coverage
   remains adequate after deletion.
3. Historical module payloads dispatch to a frozen V2 bank, so old links do
   not fail validation.
4. The new bank reruns range, outcome-distribution, perspective-coverage, and
   editorial validation in both Standard and Advanced modes.

## Correct item-axis contract needed before rewriting

Every dense module option currently carries all four axis values. Treating
every cross-loading as a construct that each card must independently span
would force each card to contain four simultaneous bipolar scales. Sparse AI
signals have the mirror problem: an incidental delta would require an opposed
option even when that axis is not the scenario's decision.

Add typed `discriminatingAxes` metadata and enforce per-card span only on those
declared axes. Keep bank-level range, true-midpoint balance, pole access,
outcome distribution, and saturation gates across every axis. The geometric
“compromise” detector should require review, not prove that an option is
substantively empty.
