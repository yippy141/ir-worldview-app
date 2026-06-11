# V13 question hardening audit

Audit date: 2026-05-15

Scope read:
- Foundation schema: `lib/quiz-schema.ts`
- Security module schema: `lib/modules/security.ts`
- Technology module schema: `lib/modules/technology.ts`
- AI Governance schema: `lib/ai-governance-schema.ts`
- Methods limitations: `app/method/page.tsx`

No scoring keys, scoring weights, result payloads, dimensions, axes, module lanes, or archetypes should change in this pass.

## 1. Item balance by dimension and axis

### Foundation

| Dimension | Current item shape | Balance note | V13 risk |
| --- | --- | --- | --- |
| Security rivalry | Mostly forward-coded Likert plus many tradeoff/mini-case signals. | Good scenario coverage; limited direct reverse-coded coverage. | Some cases can make pressure-forward answers sound more decisive than alternatives. |
| Institutions and rules | Forward Likert, one reverse-coded analyst item, many tradeoff signals. | Better balanced than most dimensions. | "Rules and routines" options can sound like the sensible middle unless paired against equally concrete alternatives. |
| Domestic politics | Forward Likert plus tradeoff/mini-case options. | Under-reverse-coded; often appears as "coalitions/budgets/public tolerance" in cases. | Can read like implementation practicality rather than a distinct explanatory logic. |
| Identity and legitimacy | Forward Likert plus tradeoff/mini-case options. | Mostly forward-coded; strong explanation cases. | Some status/recognition language remains abstract for novice users. |
| Markets and dependence | Forward Likert, one reverse-coded analyst item, many political-economy cases. | Good case coverage; reverse item is cognitively awkward. | Jargon load: credit, production, chokepoints, technical standards, platform architecture. |
| Restraint and advantage | Forward Likert plus decision tradeoffs. | Good tradeoff coverage; limited reverse-coded direct items. | "Overreach" wording can make restraint sound wiser by default. |
| Order and justice | Forward and reverse Likert plus intervention/protection cases. | Good tradeoff coverage. | Humanitarian prompts can make protection answers sound morally obvious unless legality and consequences stay concrete. |

### Security module

| Axis/lane | Current item shape | Balance note | V13 risk |
| --- | --- | --- | --- |
| Force posture / Deterrence | Case-based; explanation and decision cards; several actor-vantage prompts in analyst mode. | Strong scenario coverage, no Likert/reverse format. | Some "restore deterrence" options may sound operationally urgent relative to slower coalition or legitimacy options. |
| Escalation lens | Case-based; usually paired with force posture. | Often measured through the same cases as force posture. | Could blur "pressure-forward" and "credibility-first" if users skim. |
| Alliance lens | Case-based; many small-state, ally, patron, and middle-power cases. | Strong perspective diversity. | Actor role can be complex; prompts must keep "answer from this actor's position" clear without implying nationality-based scoring. |
| Legitimacy lens | Case-based; protection, legality, sanctions, selective enforcement. | Good tradeoff coverage. | Postcolonial/nonaligned perspectives are present but can carry high historical and legal context load. |

### Technology module

| Axis/lane | Current item shape | Balance note | V13 risk |
| --- | --- | --- | --- |
| Control posture / Controls | Case-based; export controls, open weights, sovereign stacks, lock-in. | Strong case coverage. | "Control" can sound like safety/common sense unless openness options name their own governance logic. |
| Governance lens | Case-based; shared rules, standards, incident reporting, military AI. | Strong scenario coverage. | "Coordinated rules" can sound intrinsically more sophisticated than national or market tools. |
| Industrial lens | Case-based; public compute, subsidies, public infrastructure, regional pooling. | Strong case coverage. | State-capacity language can blur development, sovereignty, and industrial-policy arguments. |
| AI risk lens | Case-based and often secondary within technology cases. | Present in AI governance cases but less independently isolated. | Safety-heavy options can become the obviously cautious answer if not set against concrete costs. |

### AI Governance Compass

| Axis | Current item shape | Balance note | V13 risk |
| --- | --- | --- | --- |
| Risk horizon | One forward and one reverse core Likert; one analyst forward Likert; scenario weights. | Good direct balance. | "Catastrophic risks" versus "current harms" can polarize users into time-horizon camps too quickly. |
| Deployment pace | One forward and one reverse core Likert; multiple analyst forward Likert; scenario weights. | Good but more precaution-forward analyst coverage. | Slowing language can sound more responsible unless fast-deployment options name a positive safety logic. |
| Public oversight | One forward and one reverse core Likert; several analyst forward Likert; scenario weights. | Strong coverage. | Government-competence reverse item is useful but blunt. |
| Competition vs coordination | One forward and one reverse core Likert; one analyst forward Likert; scenario weights. | Good balance. | Rivalry scenarios sometimes make acceleration sound like the only hard-headed answer. |
| Openness vs control | One forward and one forward-control core Likert; analyst forward-control item; scenario weights. | Balanced poles, but "reverse" is implemented through low-score openness. | Open release can sound careless unless framed as anti-concentration and auditability. |
| Military role | One forward and one reverse core Likert; scenario weights. | Good balance. | Needs clear distinction between bounded defense use and full normalization. |
| Legitimacy and rule-setting | One forward and one reverse core Likert; analyst forward legitimacy items; scenario weights. | Strong coverage. | "Public institutions and international processes" may sound normatively superior unless paired with speed/competence costs. |
| Human future | One forward and one reverse core Likert; analyst forward items; scenario weights. | Coverage is broad but abstract. | "Sentient or morally considerable" and "radical transformation" are high-jargon/high-speculation items. |

## 2. Highest-risk items and recommended rewrites

| Item | Risk type | Why it is high-risk | Recommended rewrite |
| --- | --- | --- | --- |
| Foundation `rs1` | Acquiescence / weak discrimination | "Grand strategy" and "advantages clearly beyond what defense requires" are abstract; many users will agree because "overreach causes backlash" sounds prudent. | "When a state keeps pushing for gains beyond what it needs for defense, rivals and bystanders often respond in ways that leave it less secure." |
| Foundation `an_pe3` | Reverse-coded confusion / jargon | "You do not need to look closely at..." is cognitively awkward and piles credit, production, market access into a negative item. | "For most international crises, who controls credit, production, or market access is secondary to the immediate security and diplomatic facts." |
| AI `hf3` | Jargon / speculative load | "Plausibly sentient or morally considerable" is philosophically loaded and may test familiarity with AI ethics vocabulary. | "If future AI systems appeared able to have experiences or interests that deserve moral weight, governance should look beyond human welfare alone." |
| AI scenario `capabilityThreshold` option C | Extreme-option risk | "Keep scaling unless concrete harm appears" can read as reckless compared with A/B. | "Continue limited deployment and internal mitigation because delay can also create real strategic and social costs." |
| Security `taiwan_quarantine` context | Actor-vantage confusion | Standard-mode users are asked from Beijing's position; without a short guardrail this can feel like endorsement or nationality role-play. | Add to actor role: "This is a perspective test, not an endorsement of the action." |
| Technology `open_weight_models` option C | Weak discrimination / openness caricature | "Openness should remain the default" is clear, but the option can understate safety governance and sound naive. | Add the positive logic: openness preserves independent scrutiny, downstream innovation, and anti-concentration pressure. |
| AI `ov2` | Blunt reverse-code wording | "Governments usually lack..." may overstate incompetence and attract anti-government sentiment rather than governance-design judgment. | "Government oversight often moves too slowly or lacks enough technical depth to justify deep intervention in frontier AI development." |
| Foundation `an_tradeoff_tech_order` | Jargon load | Export controls, investment screening, standards, chokepoints, data, hierarchy all arrive in one prompt. | Keep the item, but simplify the prompt and move tool definitions into clarification. |
| Security `selective_enforcement_memory` | Western/default framing / context load | Good under-modeled perspective, but "post-colonial states" plus no-fly, criminal investigations, selective enforcement is dense. | Preserve the case but shorten the scene and clarify that resistance is not defense of violence. |

## 3. Fix now group

Implement only these wording changes in V13. They are local text changes and do not alter scoring keys:

1. Foundation `rs1` prompt.
2. Foundation `an_pe3` prompt.
3. AI `hf3` prompt.
4. AI `capabilityThreshold` standard option C label.
5. Security `taiwan_quarantine` actor-role context line.

## 4. Deferred backlog

Defer these until a later hardening pass:

- Review all Foundation reverse-coded items for cognitive load and accidental double negatives.
- Balance Security/Technology actor-vantage cards with a consistent "perspective test, not endorsement" microcopy pattern.
- Revisit Technology open-release options so openness is consistently framed as a governance logic, not merely less control.
- Revisit AI fast-deployment options so speed/iteration is not reduced to commercial impatience.
- Consider a small coverage note for postcolonial, feminist, and green IR perspectives before expanding item coverage.
- Audit whether "coordination" and "public legitimacy" options are repeatedly written as more sophisticated than national, market, or competitive alternatives.
- Do not add new scored families, axes, modules, or archetypes as part of this backlog.
