# V23.3 Security v4 candidate item review

> **Superseded for new completions.** Security bank v4 remains a frozen
> historical bank, including the NO-GO finding below. The bank-v5 item review
> and owner public-beta decision are in
> [V23_3_SECURITY_V5_ITEM_REVIEW.md](./V23_3_SECURITY_V5_ITEM_REVIEW.md) and
> [V23_3_SECURITY_V5_BETA_RELEASE_DECISION.md](./V23_3_SECURITY_V5_BETA_RELEASE_DECISION.md).

Status: **complete design inventory; non-shipping; HOLD for implementation**
Canonical candidate copy for V23.3A: this document
Optional candidate JSON: intentionally omitted because the current closed schema cannot represent source, theater, actor, mechanism, or accepted-cost metadata without either dropping the audit trail or appearing production-compatible.

## 1. Review verdict

The candidate contains all 23 questions and all 92 options. Every option below separates a mechanism from an accepted cost. The 12 new Taiwan, Iran, and Ukraine cards follow the source pack's fully authored common-core and actor-lens families. The 11 retained v3 cards keep their IDs, modes, lanes, card types, and signal vectors while revising option copy; `ceasefire_accountability` also receives a genuine explanatory stem, and `nuclear_hedging` adds an on-card definition. No changed v3 response is eligible for silent migration.

The wording is ready for owner and subject-matter review, not for product implementation. Source resolution, cognitive testing, schema treatment, tuple-aware replay/calibration, and score diagnostics remain no-go gates.

### Red-team findings

| Severity | Finding | Reproduction | Disposition |
|---|---|---|---|
| Blocker | v3 calibration is not tuple-keyed; replacing global Security cuts can alter old result interpretation | replay the same v3 payload before and after loading different Security cuts | implementation HOLD; freeze v3 definition/calibration first |
| Blocker | T04, the Iranian half of I07, I11, and I13 are not fully resolved to exact named primary pages | follow every ID from the source register without using an opaque `turn…` marker | shipping HOLD; affected claims remain attributed/quarantined |
| Major | current output pools all lenses and usually suppresses the explanation/decision comparison | answer actor families in opposite directions and inspect `cardTypeRead` | do not promise named-actor or explanation/decision output |
| Major | technical-process answers can become a socially desirable “expert” middle | ask which answer looks most sophisticated to a policy professional before asking personal choice | parallel mechanisms/costs; cognitive interview still required |
| Major | Israel/U.S./Gulf and Washington/regional groupings can imply false unity | ask reviewers from each named perspective to identify divergent objectives | coalition prompts state the disagreement; regional review required |
| Minor | all options use dense signals, so non-declared midpoint keys still enter denominators | compare runtime signal-key weights with declared-axis counts | balance ledger uses actual signal-key presence |

### Candidate balance

| Mode | Total | Main-scored | Actor lenses | Scored decision | Scored explanation | Deterrence / alliances / legitimacy (scored) |
|---|---:|---:|---:|---:|---:|---:|
| Standard | 19 | 9 | 10 | 4 | 5 | 4 / 2 / 3 |
| Analyst | 23 | 13 | 10 | 6 | 7 | 4 / 4 / 5 |

| Mode | activism coverage | escalation coverage | alliance coverage | legitimacy coverage | Taiwan / Iran / Ukraine per-axis share | maximum scenario-family share |
|---|---:|---:|---:|---:|---:|---:|
| Standard | 7 | 5 | 4 | 5 | each 1/9 = 11.11% | 2/9 = 22.22% |
| Analyst | 7 | 6 | 8 | 7 | each 1/13 = 7.69% | 2/13 = 15.38% |

Coverage excludes actor lenses. Shares use every signal key actually scored. The Analyst maximum-secondary sensitivity has the same shares because each scored item may add the same `0.45` weight. `A/E/Al/L` in the option tables means `activism / escalation / alliance / legitimacy`. Signal values are content-design hypotheses, not calibrated or validated measurements.

Actor-lens option order is deliberately varied so the bundled or procedural choice is not always first. A later pilot may randomize order only if the same treatment is applied consistently and positional effects are measured.

## 2. Retained v3 cases with candidate-copy revisions

All facts in these generic cases are supplied scenario assumptions (`SAx`). They do not require outside-source knowledge. Production v3 copy remains untouched.

### 2.1 `gray_zone_sabotage` — Gray-zone sabotage

Metadata: Standard + Analyst · main-scored · deterrence · explanation · declared axes A/E · source `SAx`

**Scene.** Foreign ministers meet at an alliance ministerial tomorrow. After three weeks of cable cuts, rail disruptions, and port outages across two allied states, they must decide which vulnerability the campaign is testing before issuing a public statement.

**Question.** What is the most persuasive reading of what the rival is testing?

**Why hard.** If attribution stays contested, allies can agree the pattern is hostile while still disagreeing about whether it calls for punishment, resilience, or restraint.

| Option | Mechanism | Accepted cost | A/E/Al/L |
|---|---|---|---|
| `resolve_probe` — Test response thresholds | Publish a cumulative-disruption threshold and pair each attribution update with predefined response steps, testing whether ambiguity has enabled costs below that line. | This can mistake cumulative damage for a deliberate signal about thresholds. | 5.6 / 5.8 / 4 / 4 |
| `coalition_probe` — Test coalition fracture points | Create a joint attribution cell and consultation trigger, treating disagreement among partners as the campaign's main lever. | This centers allied politics and can understate direct operational damage. | 4.8 / 4.8 / 4 / 4 |
| `resilience_probe` — Map resilience gaps | Prioritize repair, redundancy, and recovery exercises, treating the incidents as exploitation of infrastructure weakness. | This can understate coercive intent and delay a firmer response. | 3.5 / 3.8 / 4 / 4 |
| `bait_for_escalation` — Deny an escalation opportunity | Hold punitive measures while hardening systems and building publishable attribution, treating a premature response as the vulnerability being tested. | Caution can leave sustained disruption insufficiently contested. | 3.4 / 3.6 / 4 / 4 |

Review: revised “overreacting” language and equalized the cost burden. No option requires cyber-attribution expertise beyond the supplied uncertainty.

### 2.2 `eastern_flank` — Eastern-flank reassurance

Metadata: Standard + Analyst · main-scored · alliances · decision · declared axes A/E/Al · source `SAx`

**Scene.** At next week's North Atlantic Treaty Organization (NATO) ministerial, allied governments must choose the eastern-flank posture after repeated sabotage scares and airspace incidents. A frontline member is asking for a more permanent allied presence.

**Question.** What should matter most in the posture decision?

**Why hard.** A signal that reassures exposed allies may also look like routine escalation if it becomes too rigid or too symbolic.

| Option | Mechanism | Accepted cost | A/E/Al/L |
|---|---|---|---|
| `make_the_promise_visible` — Put the commitment forward | Station a standing multinational unit under a joint command so an attack immediately implicates several allies. | This reduces crisis flexibility and makes a local incident more likely to implicate the whole alliance. | 5.9 / 6 / 6.3 / 4 |
| `build_reinforcement_depth` — Make reinforcement executable | Pre-position stocks, secure rail and air access, and rehearse reinforcement without permanently enlarging the forward force. | The peacetime signal is less visible, and reinforcements may arrive after a crisis begins. | 4.8 / 4.9 / 6 / 4 |
| `prioritize_local_denial` — Build frontline denial | Fund local air defense, mobilization, civil defense, and hardened infrastructure under the frontline state's command. | The frontline state bears more cost and opening-phase risk, with less automatic allied involvement. | 4.5 / 4.6 / 3 / 4 |
| `pair_reassurance_with_limits` — Pair presence with ceilings | Use rotational deployments with a public force ceiling, incident hotline, and review date. | Public ceilings may invite probing and leave the frontline ally less reassured. | 3.2 / 3.5 / 4.4 / 4 |

Review: removed “not just displayed” and “symbolic footprint” dismissals. The four choices now differ by commitment architecture, not simply posture intensity.

### 2.3 `maritime_pressure` — Outside help without formal alignment

Metadata: Standard + Analyst · main-scored · alliances · decision · declared axes Al/L · source `SAx`

**Scene.** A Southeast Asian state's cabinet must choose what outside support to accept before maritime patrol talks begin in 72 hours. A much larger power is applying repeated pressure, but the government does not want formal bloc alignment to narrow its diplomatic room.

**Question.** What should matter most when outside states offer support?

**Why hard.** Outside backing can strengthen the smaller state, but the wrong form of backing can also reduce the autonomy it is trying to preserve.

| Option | Mechanism | Accepted cost | A/E/Al/L |
|---|---|---|---|
| `hard_external_backing` — Accept joint operational backing | Authorize joint patrols and limited visiting-force access so outside material power directly offsets the larger state. | This narrows diplomatic autonomy and raises the chance that outside-force involvement intensifies the contest. | 5.1 / 5.3 / 6.2 / 4.2 |
| `protect_hedging_room` — Diversify support without basing | Take surveillance, training, and equipment from several partners while declining exclusive access or a defense commitment. | Immediate deterrence is weaker, and the larger power may exploit continued ambiguity. | 3.5 / 4 / 2.8 / 4.9 |
| `multilateralize_pressure` — Build regional monitoring and process | Create a shared coast-guard picture, coordinated legal filings, and a regional diplomatic contact group. | The response is slower and uneven and may not stop coercion at sea in the near term. | 4 / 4 / 4.9 / 5.9 |
| `build_local_resilience` — Keep combat control national | Accept surveillance support, coast-guard training, and nationally controlled equipment but no outside combat forces. | A near-term capability gap remains, with no assurance that outside forces will intervene if pressure escalates. | 4.7 / 4.6 / 3.6 / 3.2 |

Review: removed “more durable” language and made the multilateral option's time cost parallel to the other three.

### 2.4 `middle_power_alignment` — Border pressure when a state wants help but not full alignment

Metadata: Standard + Analyst · **actor lens; excluded from main score** · alliances · declared axis Al · source `SAx`

**Scene.** A large democracy faces repeated Chinese pressure along a disputed border. Its cabinet must choose an assistance package before next month's defense summit: weapons, intelligence help, and investment from the United States and other major powers, without letting that choice dictate every trade and diplomatic decision.

**Question.** Which logic should guide the cabinet's choice?

**Why hard.** From Washington or other allied capitals, closer alignment can look like the obvious answer. From inside this cabinet, preserving bargaining room may still look like part of security itself.

| Option | Mechanism | Accepted cost | A/E/Al/L |
|---|---|---|---|
| `ambiguity_will_fail` — Lock in the security partnership | Make multi-year intelligence, arms, logistics, and investment commitments with Washington before a sharper crisis limits the choice. | This creates earlier dependence on Washington and less freedom to compartmentalize trade and diplomacy. | 5 / 5.2 / 6.1 / 4 |
| `layered_alignment_is_real` — Compartmentalize cooperation | Deepen intelligence and defense ties while writing explicit carve-outs for trade, finance, and unrelated diplomacy. | A major crisis may collapse those compartments and force linked choices. | 4.2 / 4.3 / 5 / 4 |
| `autonomy_is_rational` — Build bargaining room into security | Combine domestic denial and diversified procurement while refusing exclusive basing or whole-of-state alignment. | Guarantees remain weaker, and potential partners may reserve support when the border crisis sharpens. | 3.7 / 4 / 2.8 / 4 |
| `problem_based_coalitions` — Use issue-specific coalitions | Join time-limited coalitions with defined missions and opt-outs rather than one comprehensive alignment. | Commitments are thinner and coordination is slower when a crisis crosses issue boundaries. | 4 / 4.1 / 4.8 / 4 |

Review: removed patriotic self-exoneration (“autonomy is national security”) and the unsupported “most durable” claim. This remains a perspective-modeling card, not an India loyalty test.

### 2.5 `atrocity_response` — Mass atrocity and outside action

Metadata: Standard + Analyst · main-scored · legitimacy · decision · declared axes A/L · source `SAx`

**Scene.** Mass civilian killing is underway, the United Nations (UN) Security Council is blocked, and outside military action would be legally contested. By tomorrow, an operational mission team must recommend whether to intervene and, if so, define the mission's scope and stopping rule.

**Question.** Which rule should guide the team's recommendation?

**Why hard.** The central tension is whether the gravity of the harm justifies acting without the level of legal and political grounding that would normally be required.

| Option | Mechanism | Accepted cost | A/E/Al/L |
|---|---|---|---|
| `legal_bar_remains_high` — Withhold force without durable authority | Use relief, sanctions, evidence preservation, and negotiations while seeking a mandate or regional agreement before military action. | Civilians may remain exposed while durable authority is unavailable. | 3.4 / 4 / 4 / 2.9 |
| `limited_protection_can_qualify` — Authorize a bounded protection mission | Permit a geographically and time-limited protection operation with defensive rules, a review date, and a stated stopping rule. | The mission has contested legality and can expand when forces come under fire. | 5.2 / 4.2 / 4 / 6.2 |
| `regional_authority_should_anchor` — Let nearby states bound the mission | Require regional governments to set the objective, force ceiling, and exit conditions before outside units deploy. | Agreement may be delayed and the resulting mission narrower than outside planners prefer. | 4.5 / 4.4 / 4 / 5.7 |
| `reduce_harm_without_widening` — Use noncombat harm-reduction tools | Expand relief, sanctions, monitoring, and documentation without deploying combat forces. | These tools may not halt the killing before more civilians die. | 3 / 3.5 / 4 / 4.8 |

Review: replaced “limited action to stop killing” as a morally dominant abstraction with a concrete mission, ceiling, and stopping rule.

### 2.6 `aid_corridor` — Aid corridors without clear authorization

Metadata: Standard + Analyst · main-scored · legitimacy · decision · declared axes A/L · source `SAx`

**Scene.** A government is choking off food and medicine to a besieged region, whose relief stocks will run out in five days. By tomorrow, a coalition of outside states must decide whether to escort maritime and air relief corridors despite unclear United Nations (UN) authorization and regional concern about a wider mission.

**Question.** Which course should the coalition choose?

**Why hard.** The problem is how to relieve urgent civilian harm without quietly turning a relief mission into a broader warfighting mandate.

| Option | Mechanism | Accepted cost | A/E/Al/L |
|---|---|---|---|
| `open_the_corridor` — Start a bounded escorted corridor | Begin escorted deliveries under defensive rules, a fixed route, and an initial review after 72 hours. | Escorts may exchange fire and turn a relief mission into a wider confrontation. | 5.6 / 4.1 / 4 / 6.1 |
| `seek_regional_cover` — Put regional states in the lead | Negotiate a regionally led corridor with designated ports, inspection rules, and a narrower cargo schedule. | Relief is delayed and the mission is constrained by regional bargaining. | 4.2 / 4.1 / 4 / 5.6 |
| `secure_authority_first` — Secure authority before escorts | Seek UN or host-state authority and pre-negotiate monitoring before armed escorts enter the contested area. | Some civilians may not receive relief before current stocks run out. | 3.2 / 3.9 / 4 / 3 |
| `intensify_indirect_pressure` — Coerce access without escorts | Apply targeted sanctions, publish evidence, and condition diplomatic relief on unimpeded aid deliveries. | Coercive diplomacy may fail before existing relief stocks run out. | 3.6 / 3.7 / 4 / 4.9 |

Review: “open now” is no longer the unbounded humane answer; it has an explicit route, rule, review point, and escalation cost.

### 2.7 `ceasefire_accountability` — Ceasefire versus accountability

Metadata: Standard + Analyst · main-scored · legitimacy · explanation · declared axis L · source `SAx`

**Scene.** The parties have accepted a 72-hour ceasefire draft, but disagree over monitors, access to evidence, and when investigations restart. Before the draft expires tomorrow night, the mediation team must recommend the verification package most likely to keep the ceasefire from becoming a pause before renewed violence.

**Question.** Which weakness is most likely to make this ceasefire a pause before renewed violence?

**Why hard.** The same compromise can look like prudence to one camp and norm erosion to another.

| Option | Mechanism | Accepted cost | A/E/Al/L |
|---|---|---|---|
| `stop_killing_first` — Monitoring starts too late | Without monitors at the start, small incidents generate competing stories and reciprocal fire before a common record exists. | Prioritizing rapid deployment means accepting thinner initial evidence access and a risk that accountability is deferred or lost. | 3.3 / 3.6 / 4 / 5.7 |
| `accountability_sets_limits` — Accountability has no clock | Without a fixed investigation date and access rule, each side expects evidence obligations to be postponed and sees less reason to preserve it. | Treating the clock as decisive accepts a greater chance that parties reject or break the ceasefire rather than face the obligation. | 3.7 / 3.9 / 4 / 2.9 |
| `regional_monitoring_compromise` — The monitor lacks political acceptance | A monitor seen as externally imposed will be denied access, while a first-stage regional team may obtain enough consent to keep observation operating. | Prioritizing political acceptance means tolerating uneven capacity and a risk that evidence is lost before broader access begins. | 3.8 / 3.8 / 4 / 5.1 |
| `bad_peace_can_recycle_harm` — Violations have no consequence ladder | Monitoring without a predefined, independently triggered consequence makes limited breaches cheap and allows them to accumulate. | Treating enforcement as the central weakness accepts that a contested finding can trigger consequences that destabilize the truce. | 4.4 / 4.2 / 4 / 4.7 |

Review: this is now a causal explanation card rather than a disguised package-choice card. Each option identifies a failure mechanism and the analytic cost of prioritizing it.

### 2.8 `nuclear_hedging` — Alliance guarantees and nuclear options

Metadata: Analyst only · main-scored · alliances · decision · declared axes E/Al · source `SAx`

**Scene.** A guarantor government's security team has five days to package a response for an allied meeting. An exposed ally is debating an independent nuclear option because it no longer fully trusts the outside guarantee. “Preparation short of a weapon” here means safeguarded civilian fuel-cycle capacity and planning without assembling a nuclear explosive.

**Question.** What should matter most in the response to the exposed ally's nuclear debate?

**Why hard.** Reassurance, nonproliferation, and autonomy all matter here, but pushing one too hard can undermine the others.

| Option | Mechanism | Accepted cost | A/E/Al/L |
|---|---|---|---|
| `restore_confidence_fast` — Add visible, time-limited reassurance | Use rotational deployments, joint nuclear consultation, and a scheduled guarantee review to make support observable. | The guarantor accepts deeper exposure and greater entrapment risk in the ally's future crises. | 5.3 / 5.6 / 6.3 / 4 |
| `lower_demand_for_latency` — Trade assurance for restraint | Offer integrated air/missile defense, assured fuel supply, and crisis consultation in return for verified limits on independent nuclear preparation. | Reassurance is slower, and the ally may keep hedging while the framework is negotiated. | 3.9 / 3.2 / 5 / 4 |
| `tolerate_some_hedging` — Permit a safeguarded hedge | Tolerate safeguarded civilian fuel-cycle work and planning short of assembly while increasing inspection and consultation. | Proliferation risk rises, and other allies may copy preparations short of weaponization. | 4.2 / 4.7 / 3.4 / 4 |
| `protect_nonproliferation_early` — Condition the guarantee on a verified ceiling | Tie fuel, technology, and parts of the guarantee to a monitored no-weaponization commitment and regional assurance talks. | This creates friction with the ally and leaves some immediate security fears unanswered. | 4.8 / 4.6 / 5.4 / 4 |

Review: defines the only specialist distinction in the scene and replaces desirable outcomes with concrete instruments.

### 2.9 `patron_trust_gap` — Security help without full trust

Metadata: Analyst only · main-scored · alliances · decision · declared axis Al · source `SAx`

**Scene.** A regional power faces a stronger neighbor and relies on an outside patron for air defense, intelligence, and financing. It wants deeper help, but doubts that the patron would bear equal risk in a longer crisis. Its cabinet must design the security relationship before new basing talks begin next week.

**Question.** From this partner state's side, what should carry the most weight?

**Why hard.** Outside guarantees can deter and entrap at the same time. The same tie can look like protection or dependence depending on how much trust remains.

| Option | Mechanism | Accepted cost | A/E/Al/L |
|---|---|---|---|
| `lock_in_guarantee` — Bind the patron through assets and agreements | Seek a treaty commitment, shared basing investment, and pooled procurement that are costly for the patron to reverse. | The state becomes more dependent and has less freedom to refuse the patron's basing or crisis demands. | 5.2 / 5.3 / 6.2 / 4 |
| `diversify_backers` — Spread critical functions across partners | Divide air defense, intelligence, financing, and procurement among several outside partners. | Duplication and coordination costs rise, and no partner is clearly responsible in a crisis. | 3.8 / 4 / 2.9 / 4 |
| `build_denial_home` — Shift the center of gravity home | Invest in national air defense, reserves, civil preparedness, and mobilization before expanding foreign basing. | Domestic costs are high and outside commitment stays limited during the years needed to build those defenses. | 4.9 / 4.6 / 3.4 / 4 |
| `keep_it_issue_based` — Contract for separate functions | Use separate, reviewable agreements for air defense, intelligence, financing, and basing rather than one comprehensive guarantee. | The guarantee is shallower, and partners may withhold support beyond the agreed function. | 4.1 / 4.2 / 4.8 / 4 |

Review: removes “safer” and specifies what makes a guarantee harder to reverse.

### 2.10 `sanctions_enforcement` — Sanctions leakage and swing states

Metadata: Analyst only · main-scored · legitimacy · explanation · declared axes Al/L · source `SAx`

**Scene.** The coalition's finance ministers have 72 hours before a vote to choose an enforcement package for third-country firms and ports. Several swing states say tighter enforcement would let wealthy powers export the rules and costs of their war through other people's trade networks.

**Question.** What is the strongest reading of why several swing states resist tighter enforcement?

**Why hard.** The same resistance can be read as opportunism, autonomy protection, or a real legitimacy objection to how coercion is being organized.

| Option | Mechanism | Accepted cost | A/E/Al/L |
|---|---|---|---|
| `resistance_is_about_leakage` — Avoid unshared compliance exposure | The states expect their firms and ports to bear penalties and administrative costs without influence over the coalition's strategy, so they demand assistance, safe harbors, and an appeals process. | Tailored exceptions slow enforcement and leave more room for evasion. | 5.5 / 4.9 / 5.2 / 3 |
| `resistance_is_about_coalition_breadth` — Preserve optional participation | They expect mandatory enforcement to push reluctant governments out, so they prefer reversible, minimum commitments that keep them at the table. | Continued leakage weakens sanctions in exchange for broader participation. | 4.2 / 4.1 / 6 / 5.2 |
| `resistance_is_about_autonomy` — Retain independent trade control | They reject serving as enforcement arms for another coalition and reserve licensing and port policy to their own governments. | Independent trade choices can materially reduce the coalition's leverage. | 3.7 / 3.8 / 2.9 / 5.1 |
| `resistance_is_about_legal_grounding` — Require a public legal mandate | They condition coercive inspections and penalties on a published legal basis, common definitions, and review rights. | Enforcement is delayed and evasion continues while that basis is built. | 4 / 3.9 / 4.6 / 6.2 |

Review: every option now answers why the swing states resist. The first no longer casts them as passive profiteers from evasion, and the legal option drops “law versus hierarchy” virtue language.

### 2.11 `selective_enforcement_memory` — Selective enforcement and intervention memory

Metadata: Analyst only · main-scored · legitimacy · explanation · declared axes Al/L · source `SAx`

**Scene.** Before a United Nations (UN) vote next week, a caucus of post-colonial states must agree its position on sanctions, no-fly options, and criminal investigations after mass repression in a weak state. The members condemn the violence but resist the enforcement push because the same wealthy powers have not acted with equal urgency in other crises.

**Question.** What is the strongest reading of why many post-colonial states resist harder enforcement?

**Why hard.** The resistance can reflect cynicism, sovereignty concerns, or a real judgment about how selective enforcement shapes order.

| Option | Mechanism | Accepted cost | A/E/Al/L |
|---|---|---|---|
| `selective_force_is_the_issue` — Demand consistent criteria | Require published thresholds and retrospective review across crises before supporting new coercive measures. | Withholding support over past inconsistency can leave people in the present crisis with fewer protections. | 3.9 / 4 / 4.5 / 6.1 |
| `sovereignty_barrier_is_the_issue` — Keep a high intervention threshold | Oppose no-fly or force measures without consent or a broadly accepted mandate, even when sanctions and investigations proceed. | Perpetrators retain greater freedom of action while the sovereignty threshold stays high. | 3.2 / 3.9 / 4.2 / 2.9 |
| `regional_ownership_is_missing` — Put regional institutions in control | Condition support on regional authority over the mission's scope, review, and exit. | Action is delayed and narrowed by regional states' competing interests. | 4.3 / 4.2 / 5.2 / 5.8 |
| `burden_is_asymmetric` — Offset spillover before escalating enforcement | Require financing, trade relief, and displacement support for affected third countries before backing stronger sanctions or no-fly measures. | Pressure on perpetrators is slower and weaker while third-country costs are negotiated. | 4 / 4.1 / 3 / 5.3 |

Review: changes the selective-enforcement critique from a stated moral fact into a testable institutional demand with a present-crisis cost.

## 3. New Taiwan family

All Taiwan cards use the same visibly stipulated below-war scenario boundary. “Inspection regime” is descriptive on the card; it does not ask the respondent to decide whether international law calls it a quarantine or blockade.

### 3.1 `taiwan_inspection_regime_core` — A reversible inspection regime

Metadata: Standard + Analyst · **neutral main-scored core** · deterrence · explanation · declared axes A/E/Al · sources T01, T02, T03, T05, T06 · claims T-C1, T-C2, T-C3, T-C4, T-C6, T-C7

**Scene.** Beijing announces a ten-day “maritime safety and customs enforcement” regime around three major Taiwanese ports. China Coast Guard (CCG) vessels order selected merchant ships to stop for inspection. People's Liberation Army (PLA) aircraft and naval vessels remain nearby but have not fired. Several major shipping firms suspend calls voluntarily, and Taipei refuses to recognize the inspections as lawful. These are stipulated scenario conditions; the card does not assume a settled legal classification.

**Question.** Which mechanism most threatens to turn this reversible coercive action into either a normalized restriction or an unintended escalation?

**Why hard.** Commercial withdrawal, precedent, coalition delay, and jurisdictional ambiguity can reinforce one another. Identifying one as primary changes what evidence and risk a response would emphasize.

| Option | Mechanism | Accepted cost | A/E/Al/L |
|---|---|---|---|
| `commercial_self_deterrence` — Commercial withdrawal amplifies limited enforcement | Insurers and carriers suspend service faster than vessels can be inspected, so selective interference produces broad disruption without a continuous cordon. | Prioritizing this mechanism can understate deliberate threshold testing and the military risk around inspections. | 3.8 / 3.2 / 4.2 / 4 |
| `precedent_through_nonchallenge` — Repetition creates an enforcement precedent | Each unopposed inspection makes the next one easier to describe and operate as routine, shifting expectations before formal status changes. | Prioritizing precedent can encourage a physical challenge that turns a legal-political contest into an armed encounter. | 6.1 / 6.2 / 5.2 / 4 |
| `encounter_commitment_spiral` — Local encounters activate wider commitments | Inspectors, protective vessels, and military overwatch operate under separate red lines, so a maneuver or collision can force leaders to defend credibility before intent is clarified. | Prioritizing this pathway can understate commercial withdrawal and the gradual precedent created without an armed encounter. | 5.5 / 6 / 5.8 / 4 |
| `jurisdictional_ambiguity` — Technical compliance hardens a contested frame | Temporary identification or safety arrangements let each side claim its legal position was preserved, allowing coercive procedures to continue under ambiguous language. | Prioritizing the jurisdictional frame can overstate symbolism relative to material traffic and escalation pressures. | 2.9 / 2.7 / 3.4 / 4 |

Review: this is a genuine explanation card: all four options identify causal pathways, not preferred response packages. The card remains neutral on sovereignty and legal classification.

### 3.2 `taiwan_beijing_instrument` — Beijing's pressure instrument

Metadata: Standard + Analyst · **actor lens; excluded from main score** · deterrence · declared axes A/E · sources T01, T02, T05 · claims T-C1, T-C3, T-C4, T-C6

**Scene.** Beijing has announced a ten-day “maritime safety and customs enforcement” regime around three major Taiwanese ports. China Coast Guard (CCG) vessels order selected merchant ships to stop for inspection; nearby People's Liberation Army (PLA) aircraft and naval vessels have not fired. Several major shipping firms suspend calls, and Taipei rejects the inspections as lawful. Assume a Beijing decision cell wants to increase pressure while retaining an off-ramp short of a major PLA attack. This is an instrument-fit question, not an endorsement of Beijing's claim or objective.

**Question.** Which operating logic should guide the cell's use of pressure?

**Why hard.** More disruption creates leverage but makes the operation harder to keep reversible or describe as enforcement below war.

| Option | Mechanism | Accepted cost | A/E/Al/L |
|---|---|---|---|
| `continuous_naval_exclusion` — Impose continuous naval exclusion | Use naval forces to exclude traffic around all major ports and maximize immediate disruption. | The operation becomes difficult to distinguish from a military blockade and raises intervention risk. | 6.3 / 6.2 / 4 / 4 |
| `reciprocal_pause_offer` — Trade suspension for a reciprocal pause | Suspend maritime interference in return for a pause in specified Taiwanese and foreign political or military activities. | Beijing must accept an outcome short of its broader political objectives. | 3.1 / 2.9 / 4 / 4 |
| `selective_ccg_inspections` — Use selective, expiring inspections | Conduct highly selective CCG inspections with announced expiry dates and heavy PLA overwatch, keeping daily encounters in a law-enforcement frame. | Selectivity reduces economic pressure and may be circumvented. | 4.9 / 4.5 / 4 / 4 |
| `distributed_nonseizure_pressure` — Shift to non-seizure pressure | Rely on licensing, aviation notices, cyber pressure, and information operations rather than ship seizures. | Effects are slower, less visible, and easier for Taiwan and partners to mitigate. | 4 / 3.5 / 4 / 4 |

Review: PRC policy is attributed, not treated as neutral intent. The card cannot be used to infer what Beijing will actually select.

### 3.3 `taiwan_taipei_continuity` — Taipei's commerce and continuity choice

Metadata: Standard + Analyst · **actor lens; excluded from main score** · deterrence · declared axes A/E/Al · sources T03, T04 · claim T-C2

**Scene.** Beijing has announced a ten-day “maritime safety and customs enforcement” regime around three major Taiwanese ports. China Coast Guard vessels order selected merchant ships to stop for inspection; nearby People's Liberation Army (PLA) aircraft and naval vessels have not fired. Several major shipping firms suspend calls, and Taipei rejects the inspections as lawful. Assume a Taipei decision cell must weigh commercial continuity, non-recognition of Beijing's claimed authority, and the risk of an uncontrolled clash.

**Question.** Which trade-off should govern the cell's next step?

**Why hard.** Visible resistance may reinforce non-acquiescence while raising the probability of an armed encounter; adaptation can preserve commerce while making coercion look effective.

| Option | Mechanism | Accepted cost | A/E/Al/L |
|---|---|---|---|
| `physically_prevent_inspections` — Prevent inspections physically | Order Taiwanese enforcement vessels to prevent every inspection and demonstrate immediate non-acquiescence. | Local encounters can rapidly become armed incidents under PLA overwatch. | 6.2 / 6.3 / 4.2 / 4 |
| `concentrate_traffic` — Concentrate traffic on less-contested approaches | Temporarily route traffic through less-contested approaches while pursuing international diplomatic action. | Beijing may treat adaptation as proof that its regime is changing behavior. | 3.2 / 3 / 4.7 / 4 |
| `conditional_stand_down_talks` — Offer conditional stand-down talks | Offer reciprocal stand-down talks if compulsory inspections cease, without recognizing jurisdiction. | Domestic audiences may perceive negotiation under pressure as a concession. | 2.8 / 2.7 / 3.5 / 4 |
| `operate_and_support_shipping` — Prioritize commercial continuity | Keep ports open, subsidize insurance and rerouting, and document interference without initially ordering force against inspectors. | Some vessels may still comply with PRC instructions, allowing the regime to operate visibly. | 4.5 / 3.8 / 5.7 / 4 |

Review: “continuity,” “non-recognition,” and “clash avoidance” are supplied objectives, not implied virtues. T04 must be owner-confirmed before shipping.

### 3.4 `taiwan_washington_coalition` — Coalition design under unequal exposure

Metadata: Standard + Analyst · **actor lens; excluded from main score** · alliances · declared axes E/Al · sources T06, T07, T08, T09, T10 · claims T-C7, T-C8, T-C9, T-C10

**Scene.** Beijing has announced a ten-day “maritime safety and customs enforcement” regime around three major Taiwanese ports. China Coast Guard vessels order selected merchant ships to stop for inspection; nearby People's Liberation Army (PLA) aircraft and naval vessels have not fired. Several major shipping firms suspend calls, and Taipei rejects the inspections as lawful. A U.S.–Japan–Philippines–Republic of Korea (South Korea) coordination group agrees that disruption and escalation matter, but members differ in exposure, legal authority, force priorities, and risk tolerance. No basing, escort, strike, or combat commitment is pre-authorized.

**Question.** Which organizing rule should govern coalition action under those differences?

**Why hard.** Uniformity can make commitment visible but gives the most exposed or reluctant member a veto; modularity moves sooner while displaying unequal participation.

| Option | Mechanism | Accepted cost | A/E/Al/L |
|---|---|---|---|
| `common_nonmilitary_floor` — Set a nonmilitary coalition floor | Keep forces distant and make commercial resilience plus diplomacy the response every member undertakes. | The common floor may not deter a coercive regime Beijing is prepared to sustain. | 3 / 2.7 / 3.3 / 4 |
| `modular_participation` — Use modular participation | Let each government opt into separately approved intelligence, commercial, diplomatic, or military blocks rather than require one package. | Beijing can exploit visible differences and gaps in participation. | 4.5 / 3.8 / 6 / 4 |
| `unanimous_military_package` — Require a common military package | Condition significant action on a shared military response by every partner. | The highest-risk or least-willing member effectively receives a veto and can delay response. | 5.8 / 5.8 / 6.3 / 4 |
| `us_led_action` — Use U.S.-led military action | Let Washington lead operations while partners provide primarily political endorsement and selected support. | Bases and partners may be exposed without comparable control, creating burden-sharing and legitimacy tensions. | 6.1 / 6 / 4.8 / 4 |

Review: the grouped lens is explicitly about coalition design amid disagreement, not a claim that all four governments share obligations or war aims.

## 4. New Iran/Gulf family

All Iran cards stipulate the ceasefire's status and define the International Atomic Energy Agency phrase needed for the choice. Respondents are not asked to know current enrichment levels, transit law, missile taxonomy, command relationships, or who caused an incident.

### 4.1 `iran_ceasefire_core` — A disputed incident inside a fragile ceasefire

Metadata: Standard + Analyst · **neutral main-scored core** · deterrence · explanation · declared axes A/E/Al/L · sources I01, I02, I04, I06, I10 · claims I-C1, I-C2, I-C7, I-C9, I-C12

**Scene.** A ceasefire remains formally in force. During the previous 72 hours, two merchant vessels have been attacked, Iran and the United States each accuse the other of violating the agreement, and Gulf governments report new drone interceptions. International Atomic Energy Agency (IAEA) inspectors still lack “continuity of knowledge”: they cannot verify what relevant nuclear material remains at affected declared sites or whether it was moved. Neither side has announced withdrawal from negotiations. These are stipulated scenario conditions; attribution remains unsettled.

**Question.** Which failure mechanism most threatens to let this disputed incident collapse the wider bargain?

**Why hard.** Attribution, issue linkage, deterrence, and commercial exit can each transmit a local incident into a wider breakdown. Treating one as primary can leave another pathway insufficiently managed.

| Option | Mechanism | Accepted cost | A/E/Al/L |
|---|---|---|---|
| `attribution_spiral` — Competing attribution triggers reciprocal action | Each party treats its own evidence as sufficient and retaliates before a shared or third-party process can separate the incidents. | Prioritizing attribution accepts a short response delay and the risk that parties dispute or manipulate the verifier. | 3.9 / 3.1 / 5.4 / 6 |
| `issue_linkage_overload` — Every file becomes one compliance test | Maritime incidents, IAEA access, sanctions, and force posture become conditions for one another, so failure on the hardest file blocks stabilization elsewhere. | Prioritizing issue linkage can delay action on the immediate shipping and military danger while a broader bargain is structured. | 4.3 / 3.6 / 4.7 / 6.2 |
| `deterrence_decay` — Unanswered violations invite further testing | Each side interprets restraint after an alleged breach as evidence that additional attacks will carry little cost. | Prioritizing deterrence accepts that even a limited response may trigger retaliation and renew general hostilities. | 6.1 / 6.2 / 4 / 2.9 |
| `commercial_exit` — Private withdrawal makes disruption self-sustaining | Carriers, crews, and insurers leave faster than negotiators can restore confidence, creating economic pressure that narrows every party's bargaining room. | Prioritizing commercial exit can defer accountability and nuclear uncertainty while parties use the pause to rebuild capabilities. | 2.8 / 3.2 / 3.3 / 4.5 |

Review: this is a genuine explanation card. The verification gap is explicitly an uncertainty, not evidence of weaponization; no option requires respondents to resolve attribution or nuclear status.

### 4.2 `iran_tehran_leverage` — Tehran's pause-and-leverage choice

Metadata: Standard + Analyst · **actor lens; excluded from main score** · deterrence · declared axes A/E · sources I06, I10, I11, I13 · claims I-C6, I-C9, I-C11

**Scene.** A ceasefire remains formally in force after two merchant-vessel attacks in 72 hours, mutual U.S.–Iranian accusations, and new Gulf drone interceptions. International Atomic Energy Agency (IAEA) inspectors cannot verify what relevant nuclear material remains at affected declared sites or whether it moved, and neither side has left negotiations. Assume a Tehran decision cell weighs a durable pause in strikes on Iran against preserving negotiating leverage. Aligned armed groups retain their own decision voices; the card does not assume Tehran directly commands every operation.

**Question.** Which use of leverage should guide the next phase?

**Why hard.** Using each source of leverage can make reciprocal bargaining possible, but continued disruption can trigger the renewed attacks the pause is intended to prevent.

| Option | Mechanism | Accepted cost | A/E/Al/L |
|---|---|---|---|
| `separate_hormuz_file` — Reopen Hormuz as a separate file | Restore navigation immediately while reserving nuclear and regional-force questions for later bargaining. | Tehran gives up a powerful source of economic leverage. | 2.8 / 3 / 4 / 4 |
| `maximum_disruption` — Hold disruption until a final settlement | Maintain maximum maritime and regional pressure until nuclear, sanctions, and regional questions are all settled. | The probability of renewed U.S., Israeli, and Gulf military action rises. | 6.2 / 6.3 / 4 / 4 |
| `phase_files_for_relief` — Sequence leverage for reciprocal relief | Phase maritime reopening and IAEA cooperation against military stand-downs and specified economic relief. | Each concession reduces leverage before a final agreement is complete. | 4.1 / 3.7 / 4 / 4 |
| `delegate_aligned_groups` — Give aligned groups more latitude | Let aligned armed groups choose more of their own pressure operations while Tehran formally observes the ceasefire. | Local actors can trigger escalation Tehran cannot control, and formal deniability may not persuade adversaries. | 5 / 5.5 / 4 / 4 |

Review: this lens is content-valid only as attributed instrument modeling. I11 and I13 exact primary links remain unresolved, so the card is a shipping HOLD.

### 4.3 `iran_israel_gulf_thresholds` — Coalition thresholds with divergent end states

Metadata: Standard + Analyst · **actor lens; excluded from main score** · alliances · declared axes E/Al · sources I03, I08, I09, I12, I14 · claims I-C4, I-C5, I-C10

**Scene.** A ceasefire remains formally in force after two merchant-vessel attacks in 72 hours, mutual U.S.–Iranian accusations, and new Gulf drone interceptions. International Atomic Energy Agency (IAEA) inspectors cannot verify what relevant nuclear material remains at affected declared sites or whether it moved, and neither side has left negotiations. Israeli, U.S., and Gulf decision cells agree that renewed attacks must be deterred but disagree about tolerable residual Iranian capability. Gulf governments do not automatically share every Israeli war aim.

**Question.** Which rule should govern coalition action while that disagreement persists?

**Why hard.** A narrow trigger can sustain unity without settling the desired end state; a comprehensive position can clarify aims while making interim stabilization harder.

| Option | Mechanism | Accepted cost | A/E/Al/L |
|---|---|---|---|
| `defense_verification_pause` — Emphasize defense and verification | Shift to missile defense, maritime protection, and verification while suspending offensive operations. | Iranian capabilities may recover during the pause. | 3 / 2.8 / 4.7 / 4 |
| `observable_violation_thresholds` — Agree on observable violation thresholds | Tie coalition response to behavior all members can observe, such as attacks on shipping or specified missile activity, while keeping broader objectives outside the trigger. | Deeper disagreement over Iran's long-term power remains unresolved. | 4.5 / 4.2 / 5.8 / 4 |
| `unilateral_israeli_prevention` — Separate Israeli prevention from other tracks | Preserve Israeli freedom for unilateral preventive action while Gulf states and Washington maintain separate ceasefire channels. | Unilateral action can collapse diplomacy and expose Gulf and U.S. assets to retaliation. | 6.2 / 6.3 / 3 / 4 |
| `consensus_final_posture` — Require consensus on the final posture | Withhold ceasefire incentives until the members agree on an acceptable Iranian nuclear, missile, and aligned-group posture. | Spoilers gain time, and interim stabilization becomes harder. | 5.7 / 5.6 / 6.2 / 4 |

Review: actor objectives are explicitly heterogeneous. White House and IDF rhetoric remains DP/DOC and is not repeated as neutral fact.

### 4.4 `iran_mediator_navigation` — Navigation without a comprehensive settlement

Metadata: Standard + Analyst · **actor lens; excluded from main score** · legitimacy · declared axes E/L · sources I04, I06, I07, I07-S1, I10 · claims I-C7, I-C8, I-C9, I-C12

**Scene.** A ceasefire remains formally in force after two merchant-vessel attacks in 72 hours, mutual U.S.–Iranian accusations, and new Gulf drone interceptions. International Atomic Energy Agency (IAEA) inspectors cannot verify what relevant nuclear material remains at affected declared sites or whether it moved, and neither side has left negotiations. A mediator or heavily exposed trading state must weigh predictable navigation, continued access to the parties, enforcement credibility, and independence from a fragile agreement while the wider disputes remain unsettled.

**Question.** Which operating rule should govern the state's response to commercial exposure?

**Why hard.** A narrow maritime bargain can protect third parties but compartmentalize the conflict; a comprehensive or enforced approach addresses more causes while extending exposure or confrontation.

| Option | Mechanism | Accepted cost | A/E/Al/L |
|---|---|---|---|
| `reroute_and_wait` — Reroute while waiting for exhaustion | Use temporary rerouting and strategic-stock releases while mediators wait for the parties' battlefield incentives to change. | Commercial disruption continues and the approach does little to arrest escalation. | 2.9 / 3.4 / 4 / 3.6 |
| `narrow_safe_navigation` — Build a narrow safe-navigation regime | Establish vessel notification, a hotline, rescue arrangements, and third-party incident investigation. | Nuclear, missile, and aligned-group disputes remain unresolved. | 3.2 / 2.8 / 4 / 6.2 |
| `naval_enforcement_without_iran` — Enforce transit without Iranian participation | Use an international naval force to sustain commercial passage without waiting for Iranian agreement. | Commercial protection becomes a potential recurring military confrontation. | 5.8 / 6 / 4 / 3 |
| `settlement_before_navigation` — Link navigation to a comprehensive settlement | Keep maritime normalization inside a bargain covering the wider political and security disputes. | Shipping remains exposed while a much harder agreement is negotiated. | 2.6 / 3 / 4 / 5.1 |

Review: Standard defines the objective and supplies the maritime facts. The Qatar half of I07 is resolved; the pack-named Iranian half remains unresolved and should be supplemented only through an explicit new source ID.

## 5. New Ukraine family

The Ukraine family preserves the authoritative legal baseline without turning the cards into blame or allegiance tests. Every card states that the United Nations General Assembly characterized Russia's invasion as aggression; Russian security arguments appear only as attributed bargaining positions. A temporary line of contact is never treated as legal recognition of a border change.

### 5.1 `ukraine_ceasefire_stall` — Why talks do not stop the war

Metadata: Standard + Analyst · **neutral main-scored core** · deterrence · explanation · declared axes A/E · sources U01, U03, U04, U05 · claims U-C1, U-C2, U-C4

**Scene.** United Nations General Assembly Resolution ES-11/1 characterized Russia's invasion as aggression and demanded withdrawal. Russia's full-scale invasion of Ukraine continues while talks remain open. Ukraine publicly pairs a ceasefire with outside security commitments; Russia publicly seeks a Ukraine outside military alliances and without nuclear weapons, among other terms. Here, an outside security commitment means promised weapons, intelligence, forces, or another response if war resumes. For this scenario, assume both sides accept outside monitoring in principle but disagree about what must be settled before a general ceasefire.

**Question.** What best explains why talks can continue without producing a general ceasefire?

**Why hard.** Future-force fears, coercive leverage, issue linkage, and verification can each sustain negotiations and fighting at the same time. The card asks which mechanism is most limiting, not which side is right or which settlement should be chosen.

| Option | Mechanism | Accepted cost | A/E/Al/L |
|---|---|---|---|
| `balance_shift_during_pause` — A pause could shift the balance | Each side fears the other will use a ceasefire to rebuild forces and improve its next-round position. | Treating that fear as decisive prolongs attacks and assumes agreed safeguards cannot contain the risk. | 4.8 / 5.7 / 4 / 4 |
| `pressure_changes_terms` — Fighting is bargaining leverage | Leaders may believe continued military and economic pressure will force better terms than are available now. | This accepts further deaths and damage, with no assurance that more pressure narrows the bargaining gap. | 5.9 / 5.4 / 4 / 4 |
| `issues_move_together` — The hardest issues are linked | Territory, sanctions, and future security arrangements affect one another, so a ceasefire is withheld until the wider package is clearer. | This keeps people exposed while the hardest issues are negotiated. | 4.2 / 4.3 / 4 / 4 |
| `monitoring_must_scale` — Monitoring has to prove itself | Neither side trusts a whole-front ceasefire, so smaller local or sector-specific pauses test whether violations can be detected before coverage expands. | This leaves uncovered areas under attack and lets actors exploit the boundaries. | 3.2 / 3.3 / 4 / 4 |

Review: the source pack's draft core was a sequencing decision mislabeled as diagnosis. This rewrite is a causal explanation card. Cognitive review must verify that Standard readers distinguish future-force balance, coercive leverage, issue linkage, and verification scaling rather than reading the options as four preferred policies.

### 5.2 `ukraine_kyiv_security_architecture` — Kyiv after a ceasefire

Metadata: Standard + Analyst · **actor lens; excluded from main score** · alliances · declared axes A/E/Al · sources U01, U03, U04 · claims U-C1, U-C2, U-C3

Actor-role note: this is a perspective test, not a request to declare support for an actor.

**Scene.** United Nations General Assembly Resolution ES-11/1 characterized Russia's invasion as aggression and demanded withdrawal. The territorial dispute remains unresolved. For this scenario, assume a ceasefire is available, Ukraine remains outside the North Atlantic Treaty Organization (NATO), and Kyiv must choose one post-ceasefire arrangement to reduce the risk of renewed attack. The arrangement can combine Ukrainian forces, foreign support, monitoring, and limits; none guarantees protection without shifting cost, exposure, or freedom of action.

**Question.** From Kyiv's decision-cell perspective, which security mechanism should carry the most weight?

**Why hard.** Each arrangement moves the burden, timing, and escalation risk differently; none provides both automatic outside protection and complete Ukrainian freedom of action at no cost.

| Option | Mechanism | Accepted cost | A/E/Al/L |
|---|---|---|---|
| `national_denial_capacity` — Build national denial capacity | Ukraine maintains large, dispersed forces, air defenses, reserves, and stockpiles so another attack cannot win quickly. | This diverts money and labor from reconstruction and leaves Kyiv carrying most of the opening risk. | 5.1 / 4.9 / 3 / 4 |
| `multinational_force` — Deploy a multinational force | Foreign units deploy after the ceasefire under a published response plan, so another attack immediately puts guarantor personnel at risk. | Contributors accept direct combat exposure, and Russia may reject a settlement that includes the force. | 5.8 / 6 / 6.2 / 4 |
| `triggered_remote_support` — Precommit support without foreign bases | Partners keep equipment ready nearby and agree that a verified attack releases arms, intelligence, financing, and sanctions without permanent foreign bases. | Ukraine may still absorb the first blow, and delivery depends on partners honoring the trigger under pressure. | 4.8 / 5 / 5.6 / 4 |
| `reciprocal_force_limits` — Use reciprocal force limits | Ukraine keeps a defined self-defense force while both sides accept monitored limits on foreign units and specified weapons near agreed areas. | Kyiv gives up some deployment freedom and risks limits that are harder to enforce against Russia. | 3.2 / 3.3 / 4.1 / 4 |

Review: the source-pack draft's reconstruction-first option was dominated because it did not answer the stipulated security problem. All four revised options now address renewed-attack risk through distinct, specified instruments.

### 5.3 `ukraine_moscow_bargaining_tradeoff` — Moscow's bargaining trade-off

Metadata: Standard + Analyst · **actor lens; excluded from main score** · deterrence · declared axes A/E · sources U01, U05 · claims U-C1, U-C4

Actor-role note: this lens models attributed bargaining logic; it does not justify the invasion or turn Moscow's demands into neutral facts.

**Scene.** United Nations General Assembly Resolution ES-11/1 characterized Russia's invasion as aggression and demanded withdrawal. Moscow publicly seeks a Ukraine outside military alliances and without nuclear weapons, together with territorial and wider security terms. For this scenario, assume Russian negotiators cannot obtain every stated demand and must decide which gain to prioritize to end large-scale fighting.

**Question.** From Moscow's decision-cell perspective, which logic should guide the next move if not every objective can be won at once?

**Why hard.** Each route exchanges territorial, economic, or deployment leverage for a different form of uncertainty; none converts coercion into every stated objective without continuing cost.

| Option | Mechanism | Accepted cost | A/E/Al/L |
|---|---|---|---|
| `deployment_limits_without_recognition` — Prioritize limits on outside forces | Russia accepts no immediate legal recognition of its territorial claims if Ukraine and outside states accept monitored limits on specified foreign forces and long-range weapons. | Moscow accepts an armed Ukrainian state and leaves sovereignty claims unresolved. | 3.8 / 3.6 / 4 / 4 |
| `claims_for_relief` — Exchange claims for economic relief | Russia withdraws from some occupied areas or drops some claims in return for staged lifting of trade and finance restrictions and a Ukrainian pledge to remain outside military alliances. | This gives up goals presented domestically as important and depends on outsiders delivering the relief. | 3.2 / 3.3 / 4 / 4 |
| `hold_line_defer_recognition` — Hold the line and defer recognition | Russia accepts a monitored ceasefire on the current line without legal recognition, keeping control in practice as leverage for later talks. | Trade restrictions and legal uncertainty persist, while Ukraine can rebuild during the pause. | 4.9 / 4.2 / 4 / 4 |
| `pressure_for_selected_recognition` — Use a deadline to seek territorial recognition | Russia continues military pressure for a stated period to seek recognition of selected occupied areas, then returns to ceasefire terms even if wider demands remain unresolved. | This accepts further losses and attacks on Russian territory, and the deadline may expire without improving the bargain. | 6.1 / 5.9 / 4 / 4 |

Review: U-C1 remains the authoritative baseline, while U-C4 is expressly a Russian declared position. The corrected `hold_line_defer_recognition` vector clears the current compromise-vector probe on the declared axes.

### 5.4 `ukraine_external_division_of_labor` — Dividing the outside role

Metadata: Standard + Analyst · **actor lens; excluded from main score** · alliances · declared axes E/Al/L · sources U01, U08, U10, U12 · claims U-C1, U-C8, U-C9 (dialogue portion only), U-C10

Actor-role note: this lens tests coalition design, not whether any outside state is morally obliged to fight.

**Scene.** United Nations General Assembly Resolution ES-11/1 characterized Russia's invasion as aggression and demanded withdrawal. At its July 2026 summit, the North Atlantic Treaty Organization (NATO) said European allies and Canada finance the vast majority of current outside security assistance to Ukraine; China and India publicly call for dialogue. For this scenario, assume the war and talks continue, and Europe, the United States, China, and India all want a ceasefire but differ over military risk. They need an arrangement for monitoring, deterrence, reconstruction, and enforcement without entering the current war.

**Question.** Which coordination rule should govern these outside states' roles?

**Why hard.** Specialized roles can match capability but fragment responsibility; narrower guarantor, verification, or economic arrangements each trade breadth for enforcement or military exposure.

| Option | Mechanism | Accepted cost | A/E/Al/L |
|---|---|---|---|
| `specialized_roles` — Assign separate roles | European states carry most military support and reconstruction, the United States supplies selected high-end capabilities, and China and India support talks and monitoring. | No actor owns cross-role enforcement, so a verified breach can fall between military and diplomatic mandates while the violator consolidates gains. | 4.6 / 4.4 / 5.3 / 5 |
| `willing_guarantor_core` — Use a narrower military-guarantor group | A smaller U.S.–European group publishes a response plan for renewed attack, while China and India join verification or reconstruction but not the military commitment. | The guarantee has narrower political backing and gives its military members greater risk of direct confrontation. | 5.8 / 5.9 / 6.2 / 3.6 |
| `joint_verification` — Use broad powers for verification, not force | Europe, the United States, China, and India jointly oversee monitoring and jointly state when a breach has occurred, but each chooses its own response. | Broad participation may make findings harder to dismiss, but divergent interests can delay or hollow out enforcement. | 3.5 / 3.3 / 5 / 6 |
| `economic_conditionality` — Build the deal around economic conditions | Outside states release reconstruction funds and lift trade or finance restrictions in stages when compliance is verified, without promising military intervention. | Economic leverage may not stop a renewed attack, leaving Ukraine to carry the security risk. | 3.2 / 3.2 / 3.3 / 4.9 |

Review: the pack's role-specialization option had a smart-middle pull. This rewrite removes the direct prompt match, gives another option both military and nonmilitary roles, and makes cross-role enforcement failure explicit. Option order must still be counterbalanced during testing.

## 6. Actor and option audit matrix

| Family | Neutral scored core | Actor lenses | Main-score effect | Options with explicit mechanism/cost | Primary review threat |
|---|---|---|---|---:|---|
| Taiwan | 1 | Beijing; Taipei; Washington/regional coalition | core only | 16 / 16 | patriotism/allegiance and settled-law cues |
| Iran | 1 | Tehran; Israel/U.S./Gulf; mediator/trading state | core only | 16 / 16 | belligerent rhetoric, false coalition unity, hidden nuclear knowledge |
| Ukraine | 1 | Kyiv; Moscow; external coalition/non-belligerents | core only | 16 / 16 | false legal equivalence, blame/allegiance, “peace versus victory” framing |
| Retained | 10 scored | middle-power alignment | actor lens excluded | 44 / 44 | moral/sophistication cues inherited from v3, revised here |
| Total | 13 scored | 10 actor lenses | 13 cards only | **92 / 92** | cognitive and regional review still required |

## 7. Required next review, not authorized in V23.3A

1. Have Taiwan, PRC-policy, Iranian, Israeli, Gulf, Ukrainian, Russian, European-security, and mediation reviewers mark every clause as neutral fact, attributed actor position, or visible scenario assumption.
2. Run masked-place-name cognitive interviews in Standard. Respondents must paraphrase the mechanism and cost without opening context; failure indicates a hidden-knowledge or wording problem.
3. Ask separately “Which answer looks most responsible to colleagues?” and “Which would you choose?” A large gap identifies social-desirability pull.
4. Randomize option presentation during testing and check for compromise-position attraction.
5. Review proposed signal directions and attainable ranges before any calibration. Copy completeness does not validate the numbers.
6. Preserve v3 replay and calibration before registering any v4 tuple.

Until those checks pass, this is a complete candidate design and an implementation **NO-GO**.
