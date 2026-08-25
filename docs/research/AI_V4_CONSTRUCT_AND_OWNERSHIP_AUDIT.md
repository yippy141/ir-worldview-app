# AI Governance v4 Construct and Ownership Audit

Status: research scaffold, no bank authorization
Current bank: v3
Current scorer: v2
Expected future tuple: bank v4, scorer v3, payload v3
Entry gate: V23.5 human-evidence gate complete

## 1. Decision this audit must support

Decide whether the current AI Governance bank needs a new construct model and, if so, which axes and items belong in an additive v4 bank.

This document does not presume that the current eight axes are obsolete. It also does not presume that every AI policy question belongs in the AI module. The audit begins with v3, checks domain ownership and discrimination, and authorizes v4 only through a written owner decision backed by item and reviewer evidence.

No coding, v4 identifier allocation, item freezing, or public copy starts before the V23.5 release evidence gate.

## 2. Immutable compatibility boundary

Current registered tuples:

| Bank | Scorer | Status |
| ---: | ---: | --- |
| 2 | 1 | Issued and replayable |
| 3 | 2 | Current and replayable |

Future default hypothesis:

| Bank | Scorer | Payload | Status |
| ---: | ---: | ---: | --- |
| 4 | 3 | 3 | Proposed only |

A methodology ADR must authorize any different tuple before code changes.

Requirements:

- Preserve v2/scorer1 and v3/scorer2 replay exactly.
- Preserve issued URLs, ProfileStore records, share payloads, checksums, and result meaning.
- Never render a v3 result with v4 item or interpretation copy.
- Freeze factual context, sources, and expiry to the bank version.
- Fail closed on an unsupported bank, scorer, payload, or locale combination.
- Treat synthetic diagnostic distributions as scorer checks only.
- Make no prevalence, norm, rarity, percentile, or population claim.

## 3. Current v3 inventory

Source: `content/instrument/ai-governance.v3.json`
Instrument version: 3
Total items: 37
Standard path: 16 Likert items plus 6 scenarios
Analyst path: 28 Likert items plus 9 scenarios

### 3.1 Likert item matrix

| Axis | Standard items | Analyst-only items | Total | Initial audit concern |
| --- | --- | --- | ---: | --- |
| Risk horizon | `rh1`, `rh2` | `rh3` | 3 | Present harms versus frontier risk may combine agenda priority, likelihood, and severity |
| Deployment pace | `dp1`, `dp2` | `dp3`, `dp4` | 4 | Precaution, safety cases, and real-world learning may be mechanisms rather than one latent direction |
| Oversight | `ov1`, `ov2` | `ov3`, `ov4`, `ov5` | 5 | External authority, compute controls, incident reporting, and audit ownership may need separation |
| Geopolitics | `gp1`, `gp2` | `gp3` | 3 | Strong overlap with Foundation, Security, and international coordination |
| Openness | `op1`, `op2` | `op3` | 3 | Access, weight release, innovation, scrutiny, and misuse may create different decisions |
| Military role | `mr1`, `mr2` | none | 2 | Insufficient independent coverage and likely Security ownership |
| Legitimacy | `lg1`, `lg2` | `lg3`, `lg4` | 4 | Public authority, technical competence, representation, and process legitimacy may not form one scale |
| Human future | `hf1`, `hf2` | `hf3`, `hf4` | 4 | Human control, transformation, digital moral status, and enhancement are distinct normative questions |

### 3.2 Scenario matrix

| Item | Modes | Current discriminating axes | Primary decision under audit |
| --- | --- | --- | --- |
| `capabilityThreshold` | Standard, Analyst | Risk horizon, deployment pace, oversight | Response to evidence of dangerous capability |
| `rivalBreakthrough` | Standard, Analyst | Deployment pace, geopolitics, military role, legitimacy | Government response under strategic uncertainty |
| `openWeights` | Standard, Analyst | Oversight, openness | Model-weight access and release conditions |
| `militaryIntegration` | Standard, Analyst | Deployment pace, geopolitics, military role | Defense use and control boundary |
| `multilateralVerification` | Standard, Analyst | Oversight, geopolitics, legitimacy | Verification and coordination design |
| `futureSociety` | Standard, Analyst | Deployment pace, legitimacy, human future | Protected value under transformative capability |
| `auditIncidentRegime` | Analyst | Deployment pace, oversight, legitimacy | Incident reporting and redeployment rule |
| `computeGovernance` | Analyst | Oversight, geopolitics, openness, legitimacy | Training-run licensing and weight security |
| `criticalInfrastructure` | Analyst | Deployment pace, oversight, legitimacy | Assurance before high-impact deployment |

The current matrix records scorer ownership. It does not prove construct ownership or discrimination.

## 4. Required item audit schema

Create one row for every current and proposed item. Do not leave a retained item on inherited assumptions.

| Field | Required entry |
| --- | --- |
| Item ID and revision | Stable research ID, wording revision, status |
| Mode and form | Standard or Analyst; Likert, threshold, implementation, scenario, ranked choice |
| Stable construct | One bounded construct stated without the item wording |
| Policy mechanism | Decision, authority, threshold, instrument, or tradeoff the item activates |
| Setting | Lab, regulator, military, international body, infrastructure operator, public institution, or other |
| Jurisdiction | Explicit jurisdiction or justified comparative scope |
| Time horizon | Present, near frontier, post-threshold, or transformative |
| Knowledge prerequisite | Facts or terms needed for an honest response |
| Social-desirability risk | Which answer sounds decent, safe, expert, moderate, democratic, or responsible |
| Response-process risk | Double question, actor confusion, likelihood versus desirability, unavailable judgment, midpoint misuse |
| Module ownership | Foundation, Security, Technology, AI, editorial Current Case, or remove |
| Neighboring constructs | Constructs that could explain the same answer |
| Expected distinction | Concrete reason the item should discriminate its construct from neighbors |
| Source snapshot | Source IDs, evidence window, retrieval date, and factual claims supported |
| Expiry | Review date or event that invalidates context |
| Reviewer status | Pending, changes required, approved, or rejected, with reviewer IDs |
| Interview evidence | Session issue IDs and revision outcome, never participant-level notes |

## 5. Ownership matrix

The entries below are hypotheses for review. They do not authorize transfer or removal.

| Content area | Foundation claim | Security claim | Technology claim | AI claim | Initial ownership hypothesis |
| --- | --- | --- | --- | --- | --- |
| Major-power competition | General view of durable rivalry | Threat, deterrence, escalation, alliance response | Chokepoints, diffusion, industrial strategy | Frontier AI race dynamics and mutual restraint | Foundation supplies baseline; AI owns only AI-specific mechanism; Security owns military response |
| Multilateral coordination | General institutional confidence | Arms-control and verification under conflict | Standards, export controls, technology alliances | Model evaluation, compute, incident, and frontier-lab coordination | Split by mechanism, not by mention of AI |
| Deployment precaution | General risk posture only | Safety in conflict or military adoption | Critical technology deployment and infrastructure | Frontier capability thresholds and safety cases | AI if capability-specific; Technology if general deployment governance |
| External oversight | General authority preference is insufficient | Military or intelligence oversight | Regulator, standards, audit, and industrial control | Frontier-lab audit, evaluation access, incident reporting | AI only where frontier-lab or model-specific |
| Openness and diffusion | No direct scored ownership | Security implications of proliferation | Open ecosystems, weights, export control, diffusion | Model-weight release and misuse thresholds | Technology and AI need a discriminant boundary |
| Military use | No direct module ownership | Defense adoption, human control, escalation | Technical assurance for military systems | Frontier-model properties relevant to military use | Security primary; AI may own a narrow capability-specific item |
| Legitimacy | General order, justice, and institutional views | Wartime or security authority | Standards representation and regulatory competence | Who sets frontier rules and whose risks count | Baseline may explain but cannot score AI answers; mechanism determines module |
| Human future | Normative modifier may overlap | Usually none | Enhancement and distribution may overlap | Human control, digital moral status, transformative governance | AI candidate, likely multiple constructs rather than one axis |
| Present harms | General justice concerns may overlap | Disinformation and conflict cases | Labor, privacy, market power, public-sector use | AI-specific governance of measured harms | Ownership depends on policy mechanism and item goal |

### Ownership decision rules

1. Replace the technology noun with another strategic technology. If the decision is unchanged, Technology may own it.
2. Replace the AI system with a military capability. If the decision is unchanged, Security may own it.
3. Remove the policy mechanism. If the item becomes a broad belief about rivalry, institutions, or justice, Foundation may already model it.
4. Keep the item in AI only when AI-specific capability, evaluation, compute, model access, lab structure, or deployment properties are essential to the decision.
5. A useful editorial Current Case is not automatically a stable scored item.
6. When two modules plausibly own the item, revise toward one mechanism or remove it from scoring. Do not double-count the same judgment.

## 6. Candidate construct hypotheses

These hypotheses organize review. They are not a proposed final axis set.

| Hypothesis | Possible v3 sources | Distinction to establish | Main risk |
| --- | --- | --- | --- |
| Capability evidence and action threshold | `rh1`, `rh3`, `capabilityThreshold` | Evidence standard for action, separate from preferred pace | Conflates belief about risk with willingness to act |
| Deployment assurance | `dp1`, `dp3`, `dp4`, `criticalInfrastructure` | Safety case and staged assurance, separate from broad precaution | Middle option may look professionally responsible |
| Audit and incident accountability | `ov1`, `ov4`, `ov5`, `auditIncidentRegime` | Who verifies and who must report | External oversight may carry obvious legitimacy valence |
| Compute and access governance | `ov3`, `op1`, `op2`, `op3`, `computeGovernance`, `openWeights` | Training control versus model-weight access versus use control | Several mechanisms may not form one direction |
| Competitive strategy and restraint | `gp1`, `gp2`, `gp3`, `rivalBreakthrough` | AI-specific response under rivalry | Strong Foundation and Security contamination |
| International verification | `gp3`, `multilateralVerification`, parts of `computeGovernance` | Monitoring feasibility under low trust | Knowledge load and institutional optimism |
| Military AI authorization | `mr1`, `mr2`, `militaryIntegration` | AI-specific authorization condition | Security likely owns most variance |
| Rule-making authority and representation | `lg1` to `lg4` | Competence, public authority, and representation as separable constructs | Democratic or inclusive answer may look morally preferred |
| Transformative-value protection | `hf1` to `hf4`, `futureSociety` | Human control, transformation, moral status, and distribution | Four distinct moral questions grouped by futuristic setting |
| Present-harm governance | parts of `rh2` and new items only if justified | Governance of current harms, separate from frontier-risk priority | Agenda tradeoff may force false zero-sum answers |

No axis proceeds because it is topical. It proceeds only if the retained item set meets the standard below and reviewers can explain its boundary.

## 7. Minimum retained-axis standard

An axis needs all of the following:

- at least three independent Standard items;
- at least four Analyst items;
- at least two settings;
- at least two item forms;
- no single jurisdiction above roughly one-third of the supporting evidence;
- no repeated attractive-middle, smart-answer, or high-knowledge-load defect;
- a written distinction from each neighboring axis;
- at least one item that could falsify the apparent pattern rather than repeat its wording;
- successful cognitive pretesting on the retained wording;
- methodology and external-review approval.

Coverage count alone is insufficient. Items that restate one claim with reversed valence are not independent.

## 8. Source and expiry policy

### Source record

Each factual item context records:

- source ID, title, publisher, URL, publication date, retrieval date, and locator;
- evidence class and why it supports the exact factual premise;
- jurisdiction and affected population or institution;
- evidence window;
- contested or uncertain points;
- review owner and review due date.

### Expiry

Assign the earliest applicable trigger:

- 6 months for current lab policy, frontier evaluation practice, named regulation in motion, or current capability claims;
- 12 months for active institutional arrangements, compute thresholds, reporting rules, or deployment standards;
- 24 months for established statutory or treaty mechanisms unless implementation is changing;
- event-triggered review when a named law, model threshold, institution, or crisis changes;
- no automatic expiry for a deliberately abstract item with no factual scenario, but annual construct review still applies.

Expired context cannot ship in a new bank. An old bank retains its frozen context and displays its version provenance.

### Jurisdiction balance

Create an evidence count by jurisdiction and institutional perspective. Leading AI nations may supply necessary frontier evidence, but no single jurisdiction should provide more than roughly one-third of an axis's evidence without a written exception. Include affected states and institutions that do not control frontier development.

## 9. Item review workflow

1. Inventory v3 without rewriting.
2. Apply ownership tests.
3. Define candidate constructs in one sentence each.
4. Map each v3 item to zero, one, or ambiguous candidate constructs.
5. Remove duplicate mechanisms from the candidate set before drafting gaps.
6. Build a source pack and expiry table.
7. Draft Standard coverage first, then Analyst depth.
8. Run internal valence, knowledge-load, actor, and overlap review.
9. Obtain external review.
10. Conduct cognitive interviews and revise.
11. Retest consequential wording.
12. Write the construct decision and methodology ADR.
13. Only then allocate immutable v4 identifiers and implement.

AI assistance may inventory, compare, and route. It cannot decide construct validity or approve item wording.

## 10. External review plan

Recruit 3 to 5 independent reviewers across these roles:

- AI governance policy and institutions;
- comparative or non-US regulation;
- IR, security, or strategic stability;
- measurement, survey design, or cognitive interviewing.

One person may cover two roles. At least three independent people must review the final proposed construct map.

For each reviewer, record only a reviewer code, relevant role, material version, date, decision, issue IDs, and conflicts or limitations. Public professional identity requires consent.

Required questions:

1. What decision does each axis claim to measure?
2. Which items belong to another module?
3. Which pairs can be answered from one general ideology rather than the stated mechanism?
4. Which option looks most informed, moderate, responsible, or globally legitimate?
5. Which item demands facts not supplied?
6. Which settings or jurisdictions are missing?
7. Which axis lacks a falsifying or contrasting item?
8. Which conclusion would the evidence not support?

### Reviewer evidence table

| Review ID | Reviewer role | Material version | Outcome | Blocking issue IDs | Resolved by | Retest needed |
| --- | --- | --- | --- | --- | --- | --- |
| Pending | | | | | | |

## 11. Cognitive pretesting evidence

Use the amended V22.5 cognitive-interview pack. Record aggregate issue IDs only.

| Item or axis | Build and wording revision | Sessions | Comprehension | Knowledge load | Valence | Ownership confusion | Decision |
| --- | --- | ---: | --- | --- | --- | --- | --- |
| Pending | | | | | | | |

Stop item work after two independent reports of the same consequential comprehension, valence, knowledge-load, or ownership problem. Revise and retest with new participants.

## 12. Paired-reflection research contract

This is a separate research prototype, not part of scoring and not a shortcut to v4.

Each proposed pair records:

| Field | Requirement |
| --- | --- |
| Pair ID | Stable research ID |
| Foundation binding | Bank, item, copy, and locale version |
| AI binding | Bank, item, copy, and locale version |
| Juxtaposition reason | Authored explanation of the shared decision or tension |
| Limitation | What the pair cannot show |
| Reviewer status | Required before use |
| Order condition | Foundation-first or AI-first for counterbalancing |

Prototype behavior:

- disabled research flag and `noindex`;
- re-ask both questions;
- reveal both choices only after both are answered;
- hold answers in component memory only;
- discard on navigation or refresh;
- exclude from storage, URL, analytics, Profile, sharing, and Open Graph;
- show no match, mismatch, rate, consistency, inferred logic, or moral evaluation;
- fail closed on a missing or mismatched version.

The research question is whether participants can reflect on two bounded choices without treating the juxtaposition as a test of consistency. If they cannot, do not ship it.

## 13. Final construct decision template

Complete only after source, reviewer, and interview gates.

```text
Decision ID:
Date:
Owner:
Evidence cutoff:
Current v3 disposition:
Retained v4 constructs:
Rejected or merged hypotheses:
Transferred items and owning modules:
Removed items and reasons:
Standard coverage by construct:
Analyst coverage by construct:
Jurisdiction and form balance:
Unresolved limitations:
External reviews:
Cognitive-interview evidence:
Expected immutable tuple:
Compatibility proof plan:
Locale decision:
Paired-reflection decision:
Owner authorization to implement: yes or no
```

## 14. Release gate

AI v4 remains blocked until:

- V23.5 human-evidence gate is complete;
- every retained axis meets the coverage standard;
- no ownership conflict remains;
- external review succeeds;
- item pretesting and consequential retesting are complete;
- old v2 and v3 results reproduce exactly;
- the final construct decision and methodology ADR are approved;
- English copy is owner-reviewed;
- unsupported locales fail closed;
- paired reflection, if pursued, is not interpreted as a consistency test;
- no cohort or prevalence claim appears.
