# Source-Backed Educational Case Library for the IR Worldview Inventory

## Scope and editorial method

The IR Worldview Inventory explicitly presents itself as a scenario-based tool for mapping geopolitical judgment, not a personality test, not a diagnosis, and not a validated psychometric instrument. Its own methods page says the output is a structured interpretation of how a user reasons under pressure; tradition labels are shorthand, mixed outputs are normal, modules are kept separate from the Foundation result, and atlas patterns are authored editorial examples rather than population-backed natural kinds. The repo README makes the same point in plainer terms: the quiz produces an interpretive summary, not a natural-kind identity. citeturn31view0turn32view0turn31view1turn26view0

The JSON below therefore treats each case as a reusable teaching file, not as evidence that any public figure, government, electorate, or movement “is” a profile. Where the case analysis borrows the repo’s internal pattern logic, it does so cautiously and only as an editorial aid for classroom-style interpretation. citeturn32view0turn24view0turn24view1turn24view2turn24view3turn24view4turn25view0turn26view0turn26view1

## Working profile logic

For this draft library, I treated the ten public labels supplied in the request as public-facing names that *resemble the logic of* the repo’s ten recurring atlas patterns: Several Lenses ≈ Bridge Builder; Power with Limits ≈ Constraint-First Realist; Power and Leverage ≈ Competitive Balancer; Coalitions First ≈ Coalition Pragmatist; Rules and Cooperation ≈ Institution Builder; Meaning and Legitimacy ≈ Legitimacy Reader; Justice and Protection ≈ Justice-Forward Solidarist; Power Behind the Rules ≈ Structural Inequality Critic; Capacity and Autonomy ≈ Development-Sovereignty Builder; Different by Domain ≈ Cross-Pressured Synthesizer. That mapping is an editorial inference from the project’s own pattern descriptions, not a claim that the public names are already hard-coded one-to-one in the currently visible site text. citeturn24view0turn24view1turn24view2turn24view3turn24view4turn25view0turn26view0turn26view1turn32view0

## Structured JSON

```json
{
  "meta": {
    "project": "IR Worldview Inventory case library",
    "language": "en-CA",
    "date": "2026-07-13",
    "editorial_status": "research draft",
    "coding_guardrail": "Do not assign a public figure, government, or movement to a profile without dated evidence; use 'resembles the logic of' and explain limits."
  },
  "cases": [
    {
      "case_id": "cuban_missile_crisis_escalation_ceilings",
      "title": "Cuban Missile Crisis and escalation ceilings",
      "neutral_context_120_words": "In October 1962, U.S. reconnaissance confirmed that the Soviet Union was installing nuclear-capable missiles in Cuba. President Kennedy and his advisers then debated air strikes, invasion, diplomacy, and a naval 'quarantine.' Kennedy announced the discovery publicly on October 22, demanded removal of the missiles, and ordered the quarantine to stop further deliveries. The crisis moved through public threats, secret messages, and rapid military signalling, while dangerous events occurred outside tight political control, including the downing of a U.S. U-2 and confrontations at sea. It ended after Khrushchev agreed to remove the missiles in exchange for a U.S. non-invasion pledge and, separately and privately, a later U.S. commitment to remove Jupiter missiles from Turkey.",
      "primary_or_authoritative_sources": [
        "U.S. Department of State, Office of the Historian, \"The Cuban Missile Crisis, October 1962\"",
        "Foreign Relations of the United States, 1961-1963, Volume XI, \"Cuban Missile Crisis and Aftermath\"",
        "JFK Library, \"Cuban Missile Crisis\" overview",
        "JFK Library, Kennedy's \"Radio and Television Report to the American People on the Soviet Arms Buildup in Cuba,\" 22 October 1962",
        "FRUS Document 91, Khrushchev message to Kennedy",
        "FRUS documents on 27 October 1962, including the Turkey trade-off record"
      ],
      "key_factual_disputes": [
        "How decisive was the secret Jupiter-missiles-in-Turkey assurance relative to the quarantine and public pressure?",
        "Did ExComm crisis management control escalation, or did luck and unauthorized local actions matter more than the standard '13 days' narrative implies?",
        "Was the quarantine a prudential intermediate option, or mainly a coercive signal backed by the threat of larger war?",
        "How much agency should be attributed to Cuba itself, rather than treating the crisis only as a Washington-Moscow confrontation?"
      ],
      "profile_readings": [
        {
          "profile_name": "Several Lenses",
          "resembles_the_logic_of": "Bridge Builder",
          "notices_first": "That multiple credible courses remained open for several days, and that the crisis was shaped by misperception, signalling, backchannels, alliance concerns, and procedural luck rather than one clean logic.",
          "likely_recommendation": "Use bounded pressure plus private off-ramps: maintain deterrence, keep a visible ceiling, and create channels for mutual retreat without public humiliation.",
          "strongest_objection": "It can hold too many considerations open too long in a crisis that eventually forces a hard choice."
        },
        {
          "profile_name": "Power with Limits",
          "resembles_the_logic_of": "Constraint-First Realist",
          "notices_first": "Escalation ceilings. The missiles matter because they shift the strategic balance, but overreaction could trigger the very war the United States sought to avoid.",
          "likely_recommendation": "Signal resolve, avoid open-ended invasion if a coercive but limited option can preserve position, and keep tight civilian control over any military move.",
          "strongest_objection": "A rival may read restraint as hesitation and use time to consolidate gains."
        },
        {
          "profile_name": "Power and Leverage",
          "resembles_the_logic_of": "Competitive Balancer",
          "notices_first": "The need to restore bargaining position quickly and visibly once a rival has imposed a strategic fait accompli.",
          "likely_recommendation": "Apply early coercive leverage, make non-compliance costly, and preserve credible military options behind diplomacy.",
          "strongest_objection": "This reading can underweight accident risk, reciprocal fear, and the value of quiet concessions that make de-escalation possible."
        },
        {
          "profile_name": "Rules and Cooperation",
          "resembles_the_logic_of": "Institution Builder",
          "notices_first": "The weakness of crisis prevention and the need for inspection, verification, and authoritative third-party arrangements once missiles are discovered.",
          "likely_recommendation": "Pair coercive containment with an enforceable monitored settlement, ideally through a legitimizing international mechanism.",
          "strongest_objection": "In the acute phase, institutions had limited ability to compel immediate compliance; force posture and bargaining still did most of the work."
        }
      ],
      "where_the_analogy_breaks": [
        "The crisis was bipolar, nuclear, and unusually concentrated in time; many contemporary disputes are multipolar, slower, and technologically more diffuse.",
        "Today’s 'chokepoint' or cyber confrontations often lack the clear geography and observable hardware that made missile removal verifiable.",
        "Modern domestic media ecosystems and alliance structures can make secret trade-offs harder to sustain politically."
      ],
      "suitability_for_lay_readers": {
        "rating": "High",
        "why": "It is dramatic, well documented, and intuitive: the stakes, options, and danger of escalation are easy to grasp without prior IR theory."
      },
      "sensitive_or_contested_claims_requiring_careful_wording": [
        "Avoid saying the crisis was 'solved' solely by toughness; that oversimplifies the role of bargaining, secrecy, and luck.",
        "Describe the Turkey element carefully as a private assurance tied to later removal, not as a publicly announced formal swap.",
        "Avoid erasing Cuban agency or reducing the episode to heroic bilateral management."
      ]
    },
    {
      "case_id": "alliance_burden_sharing_coalition_durability",
      "title": "Alliance burden sharing and coalition durability",
      "neutral_context_120_words": "Alliance burden sharing concerns more than headline spending ratios. Coalitions must decide who pays, who deploys, who accepts frontline risk, who builds enabling capabilities, and how far members can sustain a common strategy under domestic political pressure. NATO offers the clearest contemporary teaching case. The North Atlantic Treaty links collective defence to both Article 5 mutual assistance and Article 3 obligations to maintain national capacity. After Russia's 2014 seizure of Crimea, Allies adopted the Wales Defence Investment Pledge, encouraging movement toward spending 2 percent of GDP on defence and 20 percent on major equipment. Later communiqués stressed that fair sharing involves cash, capabilities, and contributions. The debate intensified again as deterrence requirements rose and members committed in 2025 to a higher long-run spending benchmark.",
      "primary_or_authoritative_sources": [
        "The North Atlantic Treaty",
        "NATO, Wales Summit Declaration, 2014",
        "NATO, Brussels Summit Communiqué, 2021",
        "NATO, \"Funding NATO\"",
        "NATO, Defence Expenditure of NATO Countries update",
        "NATO, The Hague Summit Declaration, 2025"
      ],
      "key_factual_disputes": [
        "Should burden sharing be judged mainly by percentage-of-GDP spending, or by usable capabilities, readiness, geography, and actual operational contributions?",
        "Does tougher burden-sharing pressure strengthen alliances by correcting free-riding, or weaken them by turning solidarity into a recurrent legitimacy fight?",
        "How much coalition durability depends on domestic politics inside member states, rather than on the external threat alone?",
        "Are higher spending pledges credible measures of long-run commitment, or mainly political signals that still require follow-through?"
      ],
      "profile_readings": [
        {
          "profile_name": "Power and Leverage",
          "resembles_the_logic_of": "Competitive Balancer",
          "notices_first": "Relative capability gaps and whether alliance asymmetry is reducing deterrent credibility.",
          "likely_recommendation": "Use sharper pressure on laggards, push for faster capability growth, and treat burden sharing as a strategic bargaining issue rather than a polite procedural concern.",
          "strongest_objection": "Public coercion can erode trust and produce exactly the political backlash that makes coalitions brittle."
        },
        {
          "profile_name": "Coalitions First",
          "resembles_the_logic_of": "Coalition Pragmatist",
          "notices_first": "Whether partners can actually carry the line together over time, politically as well as militarily.",
          "likely_recommendation": "Distribute costs in ways that preserve partner buy-in, recognise differentiated contributions, and prefer durable common lines over rhetorically satisfying but unsustainable demands.",
          "strongest_objection": "This can shade into excessive accommodation of underperformance."
        },
        {
          "profile_name": "Rules and Cooperation",
          "resembles_the_logic_of": "Institution Builder",
          "notices_first": "The institutional side of credibility: agreed targets, reporting, interoperability, and predictable consultation routines.",
          "likely_recommendation": "Treat burden sharing as an institutional design problem: clearer metrics, better transparency, and stronger links between agreed targets and alliance planning.",
          "strongest_objection": "Metrics and process can become substitutes for hard strategic choices if threat perceptions diverge."
        },
        {
          "profile_name": "Capacity and Autonomy",
          "resembles_the_logic_of": "Development-Sovereignty Builder",
          "notices_first": "Whether alliance obligations expand national capacity or lock states into forms of dependence they cannot control.",
          "likely_recommendation": "Support alliance participation that also builds domestic defence-industrial and logistical depth, rather than relying permanently on one dominant member.",
          "strongest_objection": "An autonomy-sensitive approach may move too slowly when immediate deterrence gaps are acute."
        }
      ],
      "where_the_analogy_breaks": [
        "NATO is unusually institutionalised, wealthy, and treaty-bound; many coalitions are looser and shorter-lived.",
        "The 2-percent debate travels poorly to non-military coalitions where technology, sanctions, aid, or basing access matter more than budgets.",
        "A strong common external threat can temporarily mask unfairness that would otherwise fracture a coalition."
      ],
      "suitability_for_lay_readers": {
        "rating": "High",
        "why": "The fairness-versus-effectiveness tension is easy to understand and connects directly to contemporary debate."
      },
      "sensitive_or_contested_claims_requiring_careful_wording": [
        "Avoid equating low spending automatically with disloyalty; contributions vary by geography, readiness, logistics, and political risk.",
        "Avoid implying that a single budget target measures alliance health on its own.",
        "Be careful with current spending claims because they change year to year and are often reported as estimates."
      ]
    },
    {
      "case_id": "arms_control_verification",
      "title": "Arms-control verification",
      "neutral_context_120_words": "Arms-control verification addresses a basic problem of trust under rivalry. States may accept limits on dangerous capabilities only if they believe violations can be detected with enough confidence to make cheating unattractive and politically costly. Verification therefore combines political agreement with technical procedures: agreed definitions, baseline declarations, notifications, data exchanges, inspections, monitoring rules, and mechanisms for resolving disputes. U.S.-Russian strategic arms treaties made this especially visible. New START included numerical limits, treaty text, protocols, and verification provisions, while later implementation disputes showed that verification systems depend not only on technology but also on continuing political consent. This makes verification a strong educational case because it sits between power and rules: it is never pure trust, but neither is it simply coercion. It is organised suspicion made usable.",
      "primary_or_authoritative_sources": [
        "New START treaty text and protocol",
        "U.S. State Department, \"The New START Treaty\" summary",
        "U.S. State Department, \"Key Facts about New START Treaty Implementation\"",
        "U.S. State Department, 2024 Report to Congress on Implementation of the New START Treaty",
        "U.S. State Department, 2025 Arms Control Treaty Compliance Report",
        "U.S. State Department statement noting New START's expiry in February 2026"
      ],
      "key_factual_disputes": [
        "How intrusive must verification be before it is politically acceptable yet still strategically useful?",
        "Can inspections and notifications deter militarily significant cheating, or do they mainly provide reassurance against worst-case imagination?",
        "Do verification disputes show the failure of the treaty, or the normal operation of a system designed to surface ambiguity before crises grow?",
        "How much arms control can survive when broader political relationships deteriorate, as the final years of New START suggest?"
      ],
      "profile_readings": [
        {
          "profile_name": "Rules and Cooperation",
          "resembles_the_logic_of": "Institution Builder",
          "notices_first": "That verification is the practical machinery that turns declared restraint into something other states can test and trust.",
          "likely_recommendation": "Invest in clear definitions, routine inspections, dispute-resolution channels, and monitored reciprocity rather than broad promises alone.",
          "strongest_objection": "This can overestimate the durability of procedures once strategic distrust becomes dominant."
        },
        {
          "profile_name": "Power with Limits",
          "resembles_the_logic_of": "Constraint-First Realist",
          "notices_first": "Verification as a way to cap uncertainty, prevent worst-case planning, and avoid costly arms races without assuming friendship.",
          "likely_recommendation": "Keep agreements narrow, verifiable, and tied to national technical means and enforceable consequences.",
          "strongest_objection": "Minimalist design may leave too much unregulated outside the treaty frame."
        },
        {
          "profile_name": "Power and Leverage",
          "resembles_the_logic_of": "Competitive Balancer",
          "notices_first": "Whether the regime prevents a rival from gaining concealed advantage and whether the cost of compliance is asymmetric.",
          "likely_recommendation": "Accept verification only where it clearly constrains the other side and preserves freedom to respond quickly to violations.",
          "strongest_objection": "If pushed too far, this reading can hollow out the mutual transparency that makes arms control worthwhile."
        },
        {
          "profile_name": "Different by Domain",
          "resembles_the_logic_of": "Cross-Pressured Synthesizer",
          "notices_first": "A split between diagnosis and endorsement: rivalry explains why verification is needed, but domain-specific technical practice still makes cooperation possible.",
          "likely_recommendation": "Use verification aggressively in narrowly defined domains even when the broader political relationship is deteriorating.",
          "strongest_objection": "This can be difficult to communicate because it sounds harder-headed in diagnosis than in prescription."
        }
      ],
      "where_the_analogy_breaks": [
        "Strategic nuclear treaties involve unusually observable systems and relatively small numbers compared with dispersed dual-use technologies.",
        "Verification works differently for weapons, materials, software, or knowledge flows; one model does not fit all.",
        "Post-2026 strategic arms control lacks the stable treaty frame that made earlier verification cases easier to teach."
      ],
      "suitability_for_lay_readers": {
        "rating": "Medium",
        "why": "The core logic is intuitive, but treaty procedures and technical terms can feel abstract without good teaching scaffolding."
      },
      "sensitive_or_contested_claims_requiring_careful_wording": [
        "Avoid implying that verification can prove the total absence of cheating; it is about detection, deterrence, and confidence thresholds.",
        "Avoid conflating treaty expiry with proof that verification never worked.",
        "Be precise about dates and status: New START remained in force through 5 February 2026 and then expired."
      ]
    },
    {
      "case_id": "humanitarian_intervention_contested_authority",
      "title": "Humanitarian intervention and contested authority",
      "neutral_context_120_words": "Humanitarian intervention sits at the intersection of sovereignty, atrocity prevention, legality, and political legitimacy. The debate sharpened after failures in Rwanda and Srebrenica, NATO's 1999 intervention in Kosovo without explicit Security Council authorisation, and later efforts to formulate the Responsibility to Protect in the 2005 World Summit Outcome. Libya in 2011 then became the central test of intervention backed by a Security Council mandate. Resolutions 1970 and 1973 condemned violence, recalled the Libyan authorities' responsibility to protect their population, imposed sanctions, and authorised 'all necessary measures' to protect civilians while excluding a foreign occupation force. Supporters viewed Libya as timely civilian protection under multilateral authority. Critics argued that the operation slid from protection into regime change, weakening later trust in intervention mandates.",
      "primary_or_authoritative_sources": [
        "United Nations Charter (full text)",
        "ICISS, \"The Responsibility to Protect\" report, 2001",
        "UN General Assembly, 2005 World Summit Outcome, paragraphs 138-139",
        "UN Security Council Resolution 1970 (2011)",
        "UN Security Council Resolution 1973 (2011)",
        "NATO, Kosovo Air Campaign official history"
      ],
      "key_factual_disputes": [
        "Was Kosovo an instance of illegal but legitimate action, or a damaging breach of the Charter order?",
        "Did Libya remain within a civilian-protection mandate, or did the coalition use Resolution 1973 as cover for regime change?",
        "How much authority should regional organisations and broad multilateral support carry when Security Council consensus is blocked or fragile?",
        "Does R2P create a standing permissive norm for force, or mainly a conditional framework centred on prevention, assistance, and exceptional collective action?"
      ],
      "profile_readings": [
        {
          "profile_name": "Justice and Protection",
          "resembles_the_logic_of": "Justice-Forward Solidarist",
          "notices_first": "The civilian stakes and the moral cost of inaction when mass harm is foreseeable.",
          "likely_recommendation": "Keep sovereignty important but not absolute; where atrocity thresholds are crossed, seek the strongest possible legal grounding and act early enough to protect civilians.",
          "strongest_objection": "Interventions justified by protection can expand in scope, produce precedent costs, and become harder to limit than supporters expect."
        },
        {
          "profile_name": "Meaning and Legitimacy",
          "resembles_the_logic_of": "Legitimacy Reader",
          "notices_first": "Who authorises action, how affected populations and regional actors read it, and whether the same use of force would be judged differently depending on the intervener.",
          "likely_recommendation": "Prioritise legitimacy-building, regional support, and careful public framing; legitimacy is part of causal effectiveness, not decorative cover.",
          "strongest_objection": "Heavy concern with legitimacy can paralyse action when the procedural conditions for consensus never arrive."
        },
        {
          "profile_name": "Rules and Cooperation",
          "resembles_the_logic_of": "Institution Builder",
          "notices_first": "The Charter framework, Security Council authorisation, and the long-run costs of bending rules meant to constrain force.",
          "likely_recommendation": "Exhaust preventive diplomacy, sanctions, monitoring, and lawful authorisation pathways before endorsing force, and keep any mandate narrow and reviewable.",
          "strongest_objection": "Strict proceduralism can leave civilians exposed when institutions fail to move in time."
        },
        {
          "profile_name": "Power with Limits",
          "resembles_the_logic_of": "Constraint-First Realist",
          "notices_first": "Mission creep, escalation, and the danger that moral urgency can outrun feasible political end states.",
          "likely_recommendation": "Set high thresholds for armed intervention, define clear ceilings, and avoid commitments that cannot be contained politically or militarily.",
          "strongest_objection": "An insistence on ceilings can underestimate the strategic and moral costs of standing aside during mass atrocity."
        }
      ],
      "where_the_analogy_breaks": [
        "Kosovo and Libya are not interchangeable: one lacked explicit Security Council authorisation, the other had it.",
        "Atrocity cases vary widely in local partners, regional politics, and feasible post-conflict governance.",
        "Modern debates about intervention now overlap with drones, cyber operations, proxy warfare, and disinformation in ways that older doctrines did not anticipate."
      ],
      "suitability_for_lay_readers": {
        "rating": "High",
        "why": "The moral stakes are clear and the tension between sovereignty and protection is immediately legible."
      },
      "sensitive_or_contested_claims_requiring_careful_wording": [
        "Do not state baldly that humanitarian intervention is either always legal or always illegal; specify the legal argument and forum.",
        "Treat the Libya regime-change critique carefully as a contested interpretation with major diplomatic consequences, not as an uncontested fact.",
        "Avoid presenting R2P as a blank cheque for Western military action; its own UN formulation is narrower."
      ]
    },
    {
      "case_id": "sanctions_finance_network_chokepoints",
      "title": "Sanctions, finance, and network chokepoints",
      "neutral_context_120_words": "Modern sanctions increasingly work through financial and informational networks rather than broad trade embargoes alone. States or institutions with central positions in payments, banking, reserve currency use, insurance, export licensing, and financial messaging can raise transaction costs, immobilise assets, and pressure third parties to comply. U.S. programmes administered by OFAC, EU measures, UN sanctions, and messaging restrictions involving SWIFT illustrate how coercion now often travels through systems that many actors rely on daily. This makes sanctions a particularly strong case for teaching leverage under interdependence. Yet centrality does not equal omnipotence. Sanctions work unevenly, depend on coalition breadth and enforcement, and often create humanitarian, distributional, and legitimacy disputes. They also invite evasion, adaptation, and efforts to reduce future exposure to the same chokepoints.",
      "primary_or_authoritative_sources": [
        "U.S. Treasury OFAC, \"Sanctions Programs and Country Information\"",
        "U.S. Treasury OFAC, \"Russia-related Sanctions Programs\"",
        "SWIFT, \"Swift and sanctions\"",
        "United Nations Security Council, sanctions information page",
        "IMF, \"Dollar Dominance in the International Reserve System: An Update\"",
        "IMF External Sector Report chapter on currencies in a shifting world",
        "U.S. International Trade Commission, \"Economic Sanctions: An Overview\""
      ],
      "key_factual_disputes": [
        "How often sanctions materially change target behaviour, as opposed to signalling disapproval, imposing costs, or constraining capacity?",
        "Are network chokepoints the main driver of effectiveness, or is broad coalition participation more important than infrastructural centrality alone?",
        "Do expansive financial sanctions strengthen deterrence, or accelerate hedging, evasion, and longer-run efforts to de-dollarise?",
        "How should humanitarian and distributional spillovers be weighed when sanctions are formally targeted but operate through risk-averse private intermediaries?"
      ],
      "profile_readings": [
        {
          "profile_name": "Power and Leverage",
          "resembles_the_logic_of": "Competitive Balancer",
          "notices_first": "Where the chokepoints are and how quickly they can be used to impose asymmetric costs.",
          "likely_recommendation": "Exploit network centrality early, pair sanctions with enforcement and secondary pressure, and keep escalation ladders visible.",
          "strongest_objection": "This can overrate coercive efficacy and underrate adaptation, leakage, and coalition fatigue."
        },
        {
          "profile_name": "Power Behind the Rules",
          "resembles_the_logic_of": "Structural Inequality Critic",
          "notices_first": "That apparently neutral financial infrastructures are embedded in hierarchy and can shift adjustment costs onto weaker actors.",
          "likely_recommendation": "Interrogate who writes the rules, who bears the hidden costs, and whether 'coordination' is masking unequal control over global finance.",
          "strongest_objection": "A hierarchy-centred reading can miss cases where sanctions genuinely constrain acute security threats."
        },
        {
          "profile_name": "Rules and Cooperation",
          "resembles_the_logic_of": "Institution Builder",
          "notices_first": "Whether sanctions are lawful, coordinated, monitored, and bounded enough to remain credible and politically sustainable.",
          "likely_recommendation": "Prefer multilateral, clearly scoped measures with exemptions, review mechanisms, and alignment between legal design and political objective.",
          "strongest_objection": "Procedural caution can reduce speed and blunt pressure in fast-moving crises."
        },
        {
          "profile_name": "Capacity and Autonomy",
          "resembles_the_logic_of": "Development-Sovereignty Builder",
          "notices_first": "Exposure to external finance and the long-run risks of dependence on infrastructures another power can weaponise.",
          "likely_recommendation": "Diversify payment channels, reserves, industrial inputs, and trusted partners to preserve policy room without embracing full autarky.",
          "strongest_objection": "Autonomy-building can be expensive, partial, and too slow to answer immediate pressure."
        }
      ],
      "where_the_analogy_breaks": [
        "Sanctions cases differ sharply by target size, coalition breadth, commodity exposure, and access to alternative networks.",
        "SWIFT is a messaging system, not the whole of global payments and settlement; users often conflate those layers.",
        "Financial coercion against states does not map neatly onto sanctions against non-state armed groups or illicit networks."
      ],
      "suitability_for_lay_readers": {
        "rating": "Medium",
        "why": "The logic of leverage is intuitive, but the infrastructure of global finance is less visible than troops or borders."
      },
      "sensitive_or_contested_claims_requiring_careful_wording": [
        "Avoid saying sanctions always fail or always work; outcomes vary by objective, time horizon, and coalition breadth.",
        "Be precise that SWIFT follows legal obligations under the jurisdictions governing it; it is not a sovereign actor choosing policy in a vacuum.",
        "Separate the claim that sanctions impose costs from the stronger claim that they achieve durable behavioural change."
      ]
    },
    {
      "case_id": "industrial_policy_technology_controls_developmental_autonomy",
      "title": "Industrial policy, technology controls, and developmental autonomy",
      "neutral_context_120_words": "Industrial policy and technology controls now sit at the centre of debates about security, competitiveness, and development. Semiconductors provide the clearest teaching case because they combine extreme capital intensity, concentrated production, military relevance, and deep cross-border dependence. Governments have responded with subsidies, tax incentives, public research programmes, export controls, investment screening, and resilience strategies. In the United States, the CHIPS and Science Act provided major support for domestic manufacturing and R&D, while export-control packages from 2022 onward sought to restrict China's access to advanced computing chips and semiconductor manufacturing equipment. The European Union's Chips Act likewise aimed to strengthen resilience and reduce external dependence. The resulting debate is not just commercial. It concerns who sets technical rules, who controls chokepoints, and how states preserve future room to manoeuvre.",
      "primary_or_authoritative_sources": [
        "CHIPS for America / NIST overview",
        "CHIPS incentives funding opportunities page",
        "CHIPS for America fact sheet on federal semiconductor programmes",
        "U.S. BIS, 7 October 2022 advanced-computing and semiconductor-manufacturing controls",
        "U.S. BIS, 17 October 2023 strengthening restrictions",
        "U.S. BIS, 2 December 2024 export-control expansion",
        "European Commission, European Chips Act",
        "OECD, vulnerabilities in the semiconductor supply chain"
      ],
      "key_factual_disputes": [
        "Do subsidies and controls genuinely increase resilience, or mainly redistribute production while raising costs?",
        "Can export controls slow strategic rivals enough to matter, or do they mainly incentivise costly indigenous substitution and third-country adjustment?",
        "When does resilience policy become protectionism by another name?",
        "How should smaller and middle-income states balance participation in trusted supply chains with the desire to preserve developmental autonomy?"
      ],
      "profile_readings": [
        {
          "profile_name": "Capacity and Autonomy",
          "resembles_the_logic_of": "Development-Sovereignty Builder",
          "notices_first": "Industrial depth, lock-in risk, and whether today's participation terms expand or narrow tomorrow's bargaining room.",
          "likely_recommendation": "Build domestic capability where feasible, diversify dependencies, and join external partnerships only when they leave policy space for future upgrading.",
          "strongest_objection": "This can underestimate the scale, cost, and time required to build high-end semiconductor capacity."
        },
        {
          "profile_name": "Power and Leverage",
          "resembles_the_logic_of": "Competitive Balancer",
          "notices_first": "Strategic chokepoints in advanced chips, tools, and know-how, and whether control of them can preserve military-technological advantage.",
          "likely_recommendation": "Use targeted controls, screening, and alliance coordination to deny rivals critical capabilities while deepening trusted production networks.",
          "strongest_objection": "A leverage-first strategy can provoke retaliation, leakage, and long-run fragmentation costs."
        },
        {
          "profile_name": "Power Behind the Rules",
          "resembles_the_logic_of": "Structural Inequality Critic",
          "notices_first": "How rule-setting, subsidies, and controls can entrench hierarchy by deciding who gets access to advanced production and who remains downstream.",
          "likely_recommendation": "Examine distributional effects, rule-writing power, and whether resilience language is legitimising a new form of managed dependence.",
          "strongest_objection": "This can underweight the genuinely security-driven side of semiconductor policy."
        },
        {
          "profile_name": "Different by Domain",
          "resembles_the_logic_of": "Cross-Pressured Synthesizer",
          "notices_first": "A split between diagnosis and prescription: rivalry is real in high-end segments, but not every node or tool should be treated identically.",
          "likely_recommendation": "Use differentiated policy by domain: tighter controls on frontier military-relevant capabilities, broader coordination and openness where resilience and innovation benefit from scale.",
          "strongest_objection": "Granular tailoring is administratively hard and can be politically unstable."
        }
      ],
      "where_the_analogy_breaks": [
        "Semiconductors are unusually capital-intensive and concentrated; lessons do not transfer cleanly to every strategic sector.",
        "The distinction between mature-node and leading-edge production matters greatly; one industrial-policy lesson can hide several different markets.",
        "Controls on hardware, software, talent, and investment do not operate with the same timelines or enforcement problems."
      ],
      "suitability_for_lay_readers": {
        "rating": "Medium-High",
        "why": "The case is highly relevant and concrete, but the value chain is technically layered and benefits from diagrams or a short explainer."
      },
      "sensitive_or_contested_claims_requiring_careful_wording": [
        "Be precise with money: the CHIPS and Science Act authorised broader funding, while the CHIPS Program Office itself administers the manufacturing-incentives portion.",
        "Avoid implying that controls can 'stop' technological development outright; the stronger and safer wording is that they can raise costs, slow access, or redirect adjustment.",
        "Avoid collapsing 'resilience,' 'friend-shoring,' 'sovereignty,' and 'autarky' into one concept; they are not the same policy."
      ]
    }
  ]
}
```

## Editorial memo

### What this library does well

As a set, the six cases cover the inventory’s main argumentative terrain unusually well. The Cuban Missile Crisis tests security rivalry, restraint, and escalation ceilings; alliance burden sharing turns institutions, domestic politics, and coalition durability into a concrete fairness-versus-effectiveness problem; arms-control verification sits exactly where rules meet organised suspicion; humanitarian intervention forces trade-offs between sovereignty, legitimacy, and protection; sanctions bring political economy and leverage into visible focus; and semiconductors connect technology, industrial capacity, dependence, and strategic competition. That distribution fits the project’s own seven-dimensional design and its decision to keep domain-specific modules separate from the Foundation baseline. citeturn32view0turn31view0

The source base is also strong for educational reuse because it leans heavily on official texts, archives, and institutional summaries rather than pundit commentary. The Cuban case is unusually well served by FRUS and the JFK Library; the alliance case relies on treaty text and NATO communiqués; the verification case draws from treaty text, implementation reporting, and compliance reporting; the intervention case rests on the UN Charter, Security Council resolutions, and R2P documents; the sanctions case is anchored in OFAC, SWIFT, IMF, and UN material; and the semiconductor case uses NIST, BIS, the European Commission, and the OECD. That is exactly the right mix for a source-backed educational library intended to survive changes in day-to-day commentary. citeturn9search0turn9search6turn10search2turn29search0turn14search0turn23search0turn13search2turn30search1turn17search3turn15search1turn18search2turn18search1turn19search1turn22search2turn20search1turn20search2turn20search19

### Editorial cautions before publication

The most important caution is to preserve the Inventory’s own anti-essentialist stance. The methods page repeatedly warns that closest traditions are shorthand, that atlas patterns are authored examples, and that mixed outputs are meaningful. The case library should therefore frame each profile reading as “a reading that resembles the logic of…” rather than as a fixed identity category. That is not just good politics; it is faithful to the product’s published methodology. citeturn32view0turn31view1turn31view0

A second caution is to keep monocausal overclaiming out of the short case notes. Each of these cases is famous precisely because later scholars and officials still dispute what “really” drove the outcome. In the Cuban case, the relative causal weight of the quarantine, the Turkey assurance, and sheer luck remains contested. In NATO burden sharing, 2 percent of GDP is politically salient but not identical to military usefulness. In verification, “effective” does not mean omniscient. In intervention, Kosovo and Libya should not be blended into one undifferentiated precedent. In sanctions, cost imposition is easier to show than durable behavioural change. In semiconductors, resilience, competitiveness, and autonomy overlap but do not collapse into one policy goal. citeturn9search27turn10search17turn10search9turn23search5turn23search0turn16search0turn16search3turn18search1turn18search6turn22search2turn20search19

### What I would keep exactly as drafted

The lay-reader suitability ratings are well chosen for a public-facing educational tool. Cuban, alliance burden sharing, and humanitarian intervention are strong front-of-funnel cases because the stakes and trade-offs are instantly legible. Arms-control verification and sanctions are best placed one step later, after the user already accepts that procedure and infrastructure can be politically decisive. Semiconductor industrial policy can work well in a technology module because it shows how “security” now extends well beyond troops and treaties into production networks, subsidies, and export licensing. That sequencing also matches the site’s emphasis on plain-English prompts and concrete scenario-based judgment. citeturn31view0turn32view0

The per-case field set is also useful as-is. “What each reading notices first,” “likely recommendation,” and “strongest objection” together force the profiles to behave like rival interpretive logics rather than static labels. “Where the analogy breaks” is especially important because it directly counters the tendency to turn famous historical cases into lazy all-purpose templates. That is pedagogically valuable and methodologically honest. citeturn32view0turn24view0turn24view1turn24view2turn24view3turn24view4turn25view0turn26view0turn26view1

### Editorial cautions before publication

If this library is published on the site, I would add two UI conventions around contested material. First, each case should visibly flag the small number of claims that require the most careful wording: Cuba/Turkey, NATO spending versus contribution, the limits of verification, Libya and regime change, sanctions effectiveness versus coercive signal, and the difference between resilience and autarky in semiconductors. Second, source presentation should privilege institutional provenance over quantity: archives and official texts first, explanatory summaries second. Those choices would align the library with the site’s existing trust-and-legibility posture. citeturn31view0turn32view0

Finally, if you ever extend these cases into reference-profile coding, the methods page already provides the right discipline: date the evidence window, preserve disputes notes, and avoid pretending that a profile is more scientifically settled than the evidence warrants. In other words, the case library is strongest when it teaches structured disagreement rather than classification certainty. citeturn32view0
