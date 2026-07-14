/**
 * Approved editorial case library (V17).
 *
 * Content is transcribed verbatim from the reviewed research deliverable in
 * `lib/content/case-library.json` (research draft, 2026-07-13). Do not add or
 * reword cases, readings, or sources here without going back through the
 * editorial review flow described in that file's memo.
 *
 * Coding guardrail from the source: do not assign a public figure, government,
 * or movement to a profile without dated evidence; use "resembles the logic
 * of" and explain limits.
 */

export type CaseProfileReading = {
  /** AtlasLitePattern id this reading belongs to. */
  patternId: string
  /** Public profile name used in the source deliverable. */
  profileName: string
  /** Internal pattern name the reading resembles, per the source mapping. */
  resemblesTheLogicOf: string
  noticesFirst: string
  likelyRecommendation: string
  strongestObjection: string
}

export type CaseSuitability = {
  rating: string
  why: string
}

export type CaseStudy = {
  id: string
  title: string
  /** 120-word neutral context from the source deliverable. */
  context: string
  sources: readonly string[]
  keyFactualDisputes: readonly string[]
  readings: readonly CaseProfileReading[]
  whereTheAnalogyBreaks: readonly string[]
  suitabilityForLayReaders: CaseSuitability
  /** Editorial-caution notes. Kept for editors; not rendered verbatim. */
  sensitiveClaims: readonly string[]
}

export const caseLibraryMeta = {
  project: "IR Worldview Inventory case library",
  date: "2026-07-13",
  editorialStatus: "research draft",
  codingGuardrail:
    "Do not assign a public figure, government, or movement to a profile without dated evidence; use 'resembles the logic of' and explain limits.",
} as const

export const caseLibrary: readonly CaseStudy[] = [
  {
    id: "cuban_missile_crisis_escalation_ceilings",
    title: "Cuban Missile Crisis and escalation ceilings",
    context:
      "In October 1962, U.S. reconnaissance confirmed that the Soviet Union was installing nuclear-capable missiles in Cuba. President Kennedy and his advisers then debated air strikes, invasion, diplomacy, and a naval 'quarantine.' Kennedy announced the discovery publicly on October 22, demanded removal of the missiles, and ordered the quarantine to stop further deliveries. The crisis moved through public threats, secret messages, and rapid military signalling, while dangerous events occurred outside tight political control, including the downing of a U.S. U-2 and confrontations at sea. It ended after Khrushchev agreed to remove the missiles in exchange for a U.S. non-invasion pledge and, separately and privately, a later U.S. commitment to remove Jupiter missiles from Turkey.",
    sources: [
      'U.S. Department of State, Office of the Historian, "The Cuban Missile Crisis, October 1962"',
      'Foreign Relations of the United States, 1961-1963, Volume XI, "Cuban Missile Crisis and Aftermath"',
      'JFK Library, "Cuban Missile Crisis" overview',
      'JFK Library, Kennedy\'s "Radio and Television Report to the American People on the Soviet Arms Buildup in Cuba," 22 October 1962',
      "FRUS Document 91, Khrushchev message to Kennedy",
      "FRUS documents on 27 October 1962, including the Turkey trade-off record",
    ],
    keyFactualDisputes: [
      "How decisive was the secret Jupiter-missiles-in-Turkey assurance relative to the quarantine and public pressure?",
      "Did ExComm crisis management control escalation, or did luck and unauthorized local actions matter more than the standard '13 days' narrative implies?",
      "Was the quarantine a prudential intermediate option, or mainly a coercive signal backed by the threat of larger war?",
      "How much agency should be attributed to Cuba itself, rather than treating the crisis only as a Washington-Moscow confrontation?",
    ],
    readings: [
      {
        patternId: "broad-spectrum-bridge-builder",
        profileName: "Several Lenses",
        resemblesTheLogicOf: "Bridge Builder",
        noticesFirst:
          "That multiple credible courses remained open for several days, and that the crisis was shaped by misperception, signalling, backchannels, alliance concerns, and procedural luck rather than one clean logic.",
        likelyRecommendation:
          "Use bounded pressure plus private off-ramps: maintain deterrence, keep a visible ceiling, and create channels for mutual retreat without public humiliation.",
        strongestObjection:
          "It can hold too many considerations open too long in a crisis that eventually forces a hard choice.",
      },
      {
        patternId: "constraint-first-realist",
        profileName: "Power with Limits",
        resemblesTheLogicOf: "Constraint-First Realist",
        noticesFirst:
          "Escalation ceilings. The missiles matter because they shift the strategic balance, but overreaction could trigger the very war the United States sought to avoid.",
        likelyRecommendation:
          "Signal resolve, avoid open-ended invasion if a coercive but limited option can preserve position, and keep tight civilian control over any military move.",
        strongestObjection:
          "A rival may read restraint as hesitation and use time to consolidate gains.",
      },
      {
        patternId: "competitive-balancer",
        profileName: "Power and Leverage",
        resemblesTheLogicOf: "Competitive Balancer",
        noticesFirst:
          "The need to restore bargaining position quickly and visibly once a rival has imposed a strategic fait accompli.",
        likelyRecommendation:
          "Apply early coercive leverage, make non-compliance costly, and preserve credible military options behind diplomacy.",
        strongestObjection:
          "This reading can underweight accident risk, reciprocal fear, and the value of quiet concessions that make de-escalation possible.",
      },
      {
        patternId: "institution-builder",
        profileName: "Rules and Cooperation",
        resemblesTheLogicOf: "Institution Builder",
        noticesFirst:
          "The weakness of crisis prevention and the need for inspection, verification, and authoritative third-party arrangements once missiles are discovered.",
        likelyRecommendation:
          "Pair coercive containment with an enforceable monitored settlement, ideally through a legitimizing international mechanism.",
        strongestObjection:
          "In the acute phase, institutions had limited ability to compel immediate compliance; force posture and bargaining still did most of the work.",
      },
    ],
    whereTheAnalogyBreaks: [
      "The crisis was bipolar, nuclear, and unusually concentrated in time; many contemporary disputes are multipolar, slower, and technologically more diffuse.",
      "Today’s 'chokepoint' or cyber confrontations often lack the clear geography and observable hardware that made missile removal verifiable.",
      "Modern domestic media ecosystems and alliance structures can make secret trade-offs harder to sustain politically.",
    ],
    suitabilityForLayReaders: {
      rating: "High",
      why: "It is dramatic, well documented, and intuitive: the stakes, options, and danger of escalation are easy to grasp without prior IR theory.",
    },
    sensitiveClaims: [
      "Avoid saying the crisis was 'solved' solely by toughness; that oversimplifies the role of bargaining, secrecy, and luck.",
      "Describe the Turkey element carefully as a private assurance tied to later removal, not as a publicly announced formal swap.",
      "Avoid erasing Cuban agency or reducing the episode to heroic bilateral management.",
    ],
  },
  {
    id: "alliance_burden_sharing_coalition_durability",
    title: "Alliance burden sharing and coalition durability",
    context:
      "Alliance burden sharing concerns more than headline spending ratios. Coalitions must decide who pays, who deploys, who accepts frontline risk, who builds enabling capabilities, and how far members can sustain a common strategy under domestic political pressure. NATO offers the clearest contemporary teaching case. The North Atlantic Treaty links collective defence to both Article 5 mutual assistance and Article 3 obligations to maintain national capacity. After Russia's 2014 seizure of Crimea, Allies adopted the Wales Defence Investment Pledge, encouraging movement toward spending 2 percent of GDP on defence and 20 percent on major equipment. Later communiqués stressed that fair sharing involves cash, capabilities, and contributions. The debate intensified again as deterrence requirements rose and members committed in 2025 to a higher long-run spending benchmark.",
    sources: [
      "The North Atlantic Treaty",
      "NATO, Wales Summit Declaration, 2014",
      "NATO, Brussels Summit Communiqué, 2021",
      'NATO, "Funding NATO"',
      "NATO, Defence Expenditure of NATO Countries update",
      "NATO, The Hague Summit Declaration, 2025",
    ],
    keyFactualDisputes: [
      "Should burden sharing be judged mainly by percentage-of-GDP spending, or by usable capabilities, readiness, geography, and actual operational contributions?",
      "Does tougher burden-sharing pressure strengthen alliances by correcting free-riding, or weaken them by turning solidarity into a recurrent legitimacy fight?",
      "How much coalition durability depends on domestic politics inside member states, rather than on the external threat alone?",
      "Are higher spending pledges credible measures of long-run commitment, or mainly political signals that still require follow-through?",
    ],
    readings: [
      {
        patternId: "competitive-balancer",
        profileName: "Power and Leverage",
        resemblesTheLogicOf: "Competitive Balancer",
        noticesFirst:
          "Relative capability gaps and whether alliance asymmetry is reducing deterrent credibility.",
        likelyRecommendation:
          "Use sharper pressure on laggards, push for faster capability growth, and treat burden sharing as a strategic bargaining issue rather than a polite procedural concern.",
        strongestObjection:
          "Public coercion can erode trust and produce exactly the political backlash that makes coalitions brittle.",
      },
      {
        patternId: "coalition-pragmatist",
        profileName: "Coalitions First",
        resemblesTheLogicOf: "Coalition Pragmatist",
        noticesFirst:
          "Whether partners can actually carry the line together over time, politically as well as militarily.",
        likelyRecommendation:
          "Distribute costs in ways that preserve partner buy-in, recognise differentiated contributions, and prefer durable common lines over rhetorically satisfying but unsustainable demands.",
        strongestObjection: "This can shade into excessive accommodation of underperformance.",
      },
      {
        patternId: "institution-builder",
        profileName: "Rules and Cooperation",
        resemblesTheLogicOf: "Institution Builder",
        noticesFirst:
          "The institutional side of credibility: agreed targets, reporting, interoperability, and predictable consultation routines.",
        likelyRecommendation:
          "Treat burden sharing as an institutional design problem: clearer metrics, better transparency, and stronger links between agreed targets and alliance planning.",
        strongestObjection:
          "Metrics and process can become substitutes for hard strategic choices if threat perceptions diverge.",
      },
      {
        patternId: "development-sovereignty-builder",
        profileName: "Capacity and Autonomy",
        resemblesTheLogicOf: "Development-Sovereignty Builder",
        noticesFirst:
          "Whether alliance obligations expand national capacity or lock states into forms of dependence they cannot control.",
        likelyRecommendation:
          "Support alliance participation that also builds domestic defence-industrial and logistical depth, rather than relying permanently on one dominant member.",
        strongestObjection:
          "An autonomy-sensitive approach may move too slowly when immediate deterrence gaps are acute.",
      },
    ],
    whereTheAnalogyBreaks: [
      "NATO is unusually institutionalised, wealthy, and treaty-bound; many coalitions are looser and shorter-lived.",
      "The 2-percent debate travels poorly to non-military coalitions where technology, sanctions, aid, or basing access matter more than budgets.",
      "A strong common external threat can temporarily mask unfairness that would otherwise fracture a coalition.",
    ],
    suitabilityForLayReaders: {
      rating: "High",
      why: "The fairness-versus-effectiveness tension is easy to understand and connects directly to contemporary debate.",
    },
    sensitiveClaims: [
      "Avoid equating low spending automatically with disloyalty; contributions vary by geography, readiness, logistics, and political risk.",
      "Avoid implying that a single budget target measures alliance health on its own.",
      "Be careful with current spending claims because they change year to year and are often reported as estimates.",
    ],
  },
  {
    id: "arms_control_verification",
    title: "Arms-control verification",
    context:
      "Arms-control verification addresses a basic problem of trust under rivalry. States may accept limits on dangerous capabilities only if they believe violations can be detected with enough confidence to make cheating unattractive and politically costly. Verification therefore combines political agreement with technical procedures: agreed definitions, baseline declarations, notifications, data exchanges, inspections, monitoring rules, and mechanisms for resolving disputes. U.S.-Russian strategic arms treaties made this especially visible. New START included numerical limits, treaty text, protocols, and verification provisions, while later implementation disputes showed that verification systems depend not only on technology but also on continuing political consent. This makes verification a strong educational case because it sits between power and rules: it is never pure trust, but neither is it simply coercion. It is organised suspicion made usable.",
    sources: [
      "New START treaty text and protocol",
      'U.S. State Department, "The New START Treaty" summary',
      'U.S. State Department, "Key Facts about New START Treaty Implementation"',
      "U.S. State Department, 2024 Report to Congress on Implementation of the New START Treaty",
      "U.S. State Department, 2025 Arms Control Treaty Compliance Report",
      "U.S. State Department statement noting New START's expiry in February 2026",
    ],
    keyFactualDisputes: [
      "How intrusive must verification be before it is politically acceptable yet still strategically useful?",
      "Can inspections and notifications deter militarily significant cheating, or do they mainly provide reassurance against worst-case imagination?",
      "Do verification disputes show the failure of the treaty, or the normal operation of a system designed to surface ambiguity before crises grow?",
      "How much arms control can survive when broader political relationships deteriorate, as the final years of New START suggest?",
    ],
    readings: [
      {
        patternId: "institution-builder",
        profileName: "Rules and Cooperation",
        resemblesTheLogicOf: "Institution Builder",
        noticesFirst:
          "That verification is the practical machinery that turns declared restraint into something other states can test and trust.",
        likelyRecommendation:
          "Invest in clear definitions, routine inspections, dispute-resolution channels, and monitored reciprocity rather than broad promises alone.",
        strongestObjection:
          "This can overestimate the durability of procedures once strategic distrust becomes dominant.",
      },
      {
        patternId: "constraint-first-realist",
        profileName: "Power with Limits",
        resemblesTheLogicOf: "Constraint-First Realist",
        noticesFirst:
          "Verification as a way to cap uncertainty, prevent worst-case planning, and avoid costly arms races without assuming friendship.",
        likelyRecommendation:
          "Keep agreements narrow, verifiable, and tied to national technical means and enforceable consequences.",
        strongestObjection: "Minimalist design may leave too much unregulated outside the treaty frame.",
      },
      {
        patternId: "competitive-balancer",
        profileName: "Power and Leverage",
        resemblesTheLogicOf: "Competitive Balancer",
        noticesFirst:
          "Whether the regime prevents a rival from gaining concealed advantage and whether the cost of compliance is asymmetric.",
        likelyRecommendation:
          "Accept verification only where it clearly constrains the other side and preserves freedom to respond quickly to violations.",
        strongestObjection:
          "If pushed too far, this reading can hollow out the mutual transparency that makes arms control worthwhile.",
      },
      {
        patternId: "cross-pressured-synthesizer",
        profileName: "Different by Domain",
        resemblesTheLogicOf: "Cross-Pressured Synthesizer",
        noticesFirst:
          "A split between diagnosis and endorsement: rivalry explains why verification is needed, but domain-specific technical practice still makes cooperation possible.",
        likelyRecommendation:
          "Use verification aggressively in narrowly defined domains even when the broader political relationship is deteriorating.",
        strongestObjection:
          "This can be difficult to communicate because it sounds harder-headed in diagnosis than in prescription.",
      },
    ],
    whereTheAnalogyBreaks: [
      "Strategic nuclear treaties involve unusually observable systems and relatively small numbers compared with dispersed dual-use technologies.",
      "Verification works differently for weapons, materials, software, or knowledge flows; one model does not fit all.",
      "Post-2026 strategic arms control lacks the stable treaty frame that made earlier verification cases easier to teach.",
    ],
    suitabilityForLayReaders: {
      rating: "Medium",
      why: "The core logic is intuitive, but treaty procedures and technical terms can feel abstract without good teaching scaffolding.",
    },
    sensitiveClaims: [
      "Avoid implying that verification can prove the total absence of cheating; it is about detection, deterrence, and confidence thresholds.",
      "Avoid conflating treaty expiry with proof that verification never worked.",
      "Be precise about dates and status: New START remained in force through 5 February 2026 and then expired.",
    ],
  },
  {
    id: "humanitarian_intervention_contested_authority",
    title: "Humanitarian intervention and contested authority",
    context:
      "Humanitarian intervention sits at the intersection of sovereignty, atrocity prevention, legality, and political legitimacy. The debate sharpened after failures in Rwanda and Srebrenica, NATO's 1999 intervention in Kosovo without explicit Security Council authorisation, and later efforts to formulate the Responsibility to Protect in the 2005 World Summit Outcome. Libya in 2011 then became the central test of intervention backed by a Security Council mandate. Resolutions 1970 and 1973 condemned violence, recalled the Libyan authorities' responsibility to protect their population, imposed sanctions, and authorised 'all necessary measures' to protect civilians while excluding a foreign occupation force. Supporters viewed Libya as timely civilian protection under multilateral authority. Critics argued that the operation slid from protection into regime change, weakening later trust in intervention mandates.",
    sources: [
      "United Nations Charter (full text)",
      'ICISS, "The Responsibility to Protect" report, 2001',
      "UN General Assembly, 2005 World Summit Outcome, paragraphs 138-139",
      "UN Security Council Resolution 1970 (2011)",
      "UN Security Council Resolution 1973 (2011)",
      "NATO, Kosovo Air Campaign official history",
    ],
    keyFactualDisputes: [
      "Was Kosovo an instance of illegal but legitimate action, or a damaging breach of the Charter order?",
      "Did Libya remain within a civilian-protection mandate, or did the coalition use Resolution 1973 as cover for regime change?",
      "How much authority should regional organisations and broad multilateral support carry when Security Council consensus is blocked or fragile?",
      "Does R2P create a standing permissive norm for force, or mainly a conditional framework centred on prevention, assistance, and exceptional collective action?",
    ],
    readings: [
      {
        patternId: "justice-forward-solidarist",
        profileName: "Justice and Protection",
        resemblesTheLogicOf: "Justice-Forward Solidarist",
        noticesFirst: "The civilian stakes and the moral cost of inaction when mass harm is foreseeable.",
        likelyRecommendation:
          "Keep sovereignty important but not absolute; where atrocity thresholds are crossed, seek the strongest possible legal grounding and act early enough to protect civilians.",
        strongestObjection:
          "Interventions justified by protection can expand in scope, produce precedent costs, and become harder to limit than supporters expect.",
      },
      {
        patternId: "legitimacy-attuned-reader",
        profileName: "Meaning and Legitimacy",
        resemblesTheLogicOf: "Legitimacy Reader",
        noticesFirst:
          "Who authorises action, how affected populations and regional actors read it, and whether the same use of force would be judged differently depending on the intervener.",
        likelyRecommendation:
          "Prioritise legitimacy-building, regional support, and careful public framing; legitimacy is part of causal effectiveness, not decorative cover.",
        strongestObjection:
          "Heavy concern with legitimacy can paralyse action when the procedural conditions for consensus never arrive.",
      },
      {
        patternId: "institution-builder",
        profileName: "Rules and Cooperation",
        resemblesTheLogicOf: "Institution Builder",
        noticesFirst:
          "The Charter framework, Security Council authorisation, and the long-run costs of bending rules meant to constrain force.",
        likelyRecommendation:
          "Exhaust preventive diplomacy, sanctions, monitoring, and lawful authorisation pathways before endorsing force, and keep any mandate narrow and reviewable.",
        strongestObjection:
          "Strict proceduralism can leave civilians exposed when institutions fail to move in time.",
      },
      {
        patternId: "constraint-first-realist",
        profileName: "Power with Limits",
        resemblesTheLogicOf: "Constraint-First Realist",
        noticesFirst:
          "Mission creep, escalation, and the danger that moral urgency can outrun feasible political end states.",
        likelyRecommendation:
          "Set high thresholds for armed intervention, define clear ceilings, and avoid commitments that cannot be contained politically or militarily.",
        strongestObjection:
          "An insistence on ceilings can underestimate the strategic and moral costs of standing aside during mass atrocity.",
      },
    ],
    whereTheAnalogyBreaks: [
      "Kosovo and Libya are not interchangeable: one lacked explicit Security Council authorisation, the other had it.",
      "Atrocity cases vary widely in local partners, regional politics, and feasible post-conflict governance.",
      "Modern debates about intervention now overlap with drones, cyber operations, proxy warfare, and disinformation in ways that older doctrines did not anticipate.",
    ],
    suitabilityForLayReaders: {
      rating: "High",
      why: "The moral stakes are clear and the tension between sovereignty and protection is immediately legible.",
    },
    sensitiveClaims: [
      "Do not state baldly that humanitarian intervention is either always legal or always illegal; specify the legal argument and forum.",
      "Treat the Libya regime-change critique carefully as a contested interpretation with major diplomatic consequences, not as an uncontested fact.",
      "Avoid presenting R2P as a blank cheque for Western military action; its own UN formulation is narrower.",
    ],
  },
  {
    id: "sanctions_finance_network_chokepoints",
    title: "Sanctions, finance, and network chokepoints",
    context:
      "Modern sanctions increasingly work through financial and informational networks rather than broad trade embargoes alone. States or institutions with central positions in payments, banking, reserve currency use, insurance, export licensing, and financial messaging can raise transaction costs, immobilise assets, and pressure third parties to comply. U.S. programmes administered by OFAC, EU measures, UN sanctions, and messaging restrictions involving SWIFT illustrate how coercion now often travels through systems that many actors rely on daily. This makes sanctions a particularly strong case for teaching leverage under interdependence. Yet centrality does not equal omnipotence. Sanctions work unevenly, depend on coalition breadth and enforcement, and often create humanitarian, distributional, and legitimacy disputes. They also invite evasion, adaptation, and efforts to reduce future exposure to the same chokepoints.",
    sources: [
      'U.S. Treasury OFAC, "Sanctions Programs and Country Information"',
      'U.S. Treasury OFAC, "Russia-related Sanctions Programs"',
      'SWIFT, "Swift and sanctions"',
      "United Nations Security Council, sanctions information page",
      'IMF, "Dollar Dominance in the International Reserve System: An Update"',
      "IMF External Sector Report chapter on currencies in a shifting world",
      'U.S. International Trade Commission, "Economic Sanctions: An Overview"',
    ],
    keyFactualDisputes: [
      "How often sanctions materially change target behaviour, as opposed to signalling disapproval, imposing costs, or constraining capacity?",
      "Are network chokepoints the main driver of effectiveness, or is broad coalition participation more important than infrastructural centrality alone?",
      "Do expansive financial sanctions strengthen deterrence, or accelerate hedging, evasion, and longer-run efforts to de-dollarise?",
      "How should humanitarian and distributional spillovers be weighed when sanctions are formally targeted but operate through risk-averse private intermediaries?",
    ],
    readings: [
      {
        patternId: "competitive-balancer",
        profileName: "Power and Leverage",
        resemblesTheLogicOf: "Competitive Balancer",
        noticesFirst: "Where the chokepoints are and how quickly they can be used to impose asymmetric costs.",
        likelyRecommendation:
          "Exploit network centrality early, pair sanctions with enforcement and secondary pressure, and keep escalation ladders visible.",
        strongestObjection:
          "This can overrate coercive efficacy and underrate adaptation, leakage, and coalition fatigue.",
      },
      {
        patternId: "structural-inequality-critic",
        profileName: "Power Behind the Rules",
        resemblesTheLogicOf: "Structural Inequality Critic",
        noticesFirst:
          "That apparently neutral financial infrastructures are embedded in hierarchy and can shift adjustment costs onto weaker actors.",
        likelyRecommendation:
          "Interrogate who writes the rules, who bears the hidden costs, and whether 'coordination' is masking unequal control over global finance.",
        strongestObjection:
          "A hierarchy-centred reading can miss cases where sanctions genuinely constrain acute security threats.",
      },
      {
        patternId: "institution-builder",
        profileName: "Rules and Cooperation",
        resemblesTheLogicOf: "Institution Builder",
        noticesFirst:
          "Whether sanctions are lawful, coordinated, monitored, and bounded enough to remain credible and politically sustainable.",
        likelyRecommendation:
          "Prefer multilateral, clearly scoped measures with exemptions, review mechanisms, and alignment between legal design and political objective.",
        strongestObjection: "Procedural caution can reduce speed and blunt pressure in fast-moving crises.",
      },
      {
        patternId: "development-sovereignty-builder",
        profileName: "Capacity and Autonomy",
        resemblesTheLogicOf: "Development-Sovereignty Builder",
        noticesFirst:
          "Exposure to external finance and the long-run risks of dependence on infrastructures another power can weaponise.",
        likelyRecommendation:
          "Diversify payment channels, reserves, industrial inputs, and trusted partners to preserve policy room without embracing full autarky.",
        strongestObjection: "Autonomy-building can be expensive, partial, and too slow to answer immediate pressure.",
      },
    ],
    whereTheAnalogyBreaks: [
      "Sanctions cases differ sharply by target size, coalition breadth, commodity exposure, and access to alternative networks.",
      "SWIFT is a messaging system, not the whole of global payments and settlement; users often conflate those layers.",
      "Financial coercion against states does not map neatly onto sanctions against non-state armed groups or illicit networks.",
    ],
    suitabilityForLayReaders: {
      rating: "Medium",
      why: "The logic of leverage is intuitive, but the infrastructure of global finance is less visible than troops or borders.",
    },
    sensitiveClaims: [
      "Avoid saying sanctions always fail or always work; outcomes vary by objective, time horizon, and coalition breadth.",
      "Be precise that SWIFT follows legal obligations under the jurisdictions governing it; it is not a sovereign actor choosing policy in a vacuum.",
      "Separate the claim that sanctions impose costs from the stronger claim that they achieve durable behavioural change.",
    ],
  },
  {
    id: "industrial_policy_technology_controls_developmental_autonomy",
    title: "Industrial policy, technology controls, and developmental autonomy",
    context:
      "Industrial policy and technology controls now sit at the centre of debates about security, competitiveness, and development. Semiconductors provide the clearest teaching case because they combine extreme capital intensity, concentrated production, military relevance, and deep cross-border dependence. Governments have responded with subsidies, tax incentives, public research programmes, export controls, investment screening, and resilience strategies. In the United States, the CHIPS and Science Act provided major support for domestic manufacturing and R&D, while export-control packages from 2022 onward sought to restrict China's access to advanced computing chips and semiconductor manufacturing equipment. The European Union's Chips Act likewise aimed to strengthen resilience and reduce external dependence. The resulting debate is not just commercial. It concerns who sets technical rules, who controls chokepoints, and how states preserve future room to manoeuvre.",
    sources: [
      "CHIPS for America / NIST overview",
      "CHIPS incentives funding opportunities page",
      "CHIPS for America fact sheet on federal semiconductor programmes",
      "U.S. BIS, 7 October 2022 advanced-computing and semiconductor-manufacturing controls",
      "U.S. BIS, 17 October 2023 strengthening restrictions",
      "U.S. BIS, 2 December 2024 export-control expansion",
      "European Commission, European Chips Act",
      "OECD, vulnerabilities in the semiconductor supply chain",
    ],
    keyFactualDisputes: [
      "Do subsidies and controls genuinely increase resilience, or mainly redistribute production while raising costs?",
      "Can export controls slow strategic rivals enough to matter, or do they mainly incentivise costly indigenous substitution and third-country adjustment?",
      "When does resilience policy become protectionism by another name?",
      "How should smaller and middle-income states balance participation in trusted supply chains with the desire to preserve developmental autonomy?",
    ],
    readings: [
      {
        patternId: "development-sovereignty-builder",
        profileName: "Capacity and Autonomy",
        resemblesTheLogicOf: "Development-Sovereignty Builder",
        noticesFirst:
          "Industrial depth, lock-in risk, and whether today's participation terms expand or narrow tomorrow's bargaining room.",
        likelyRecommendation:
          "Build domestic capability where feasible, diversify dependencies, and join external partnerships only when they leave policy space for future upgrading.",
        strongestObjection:
          "This can underestimate the scale, cost, and time required to build high-end semiconductor capacity.",
      },
      {
        patternId: "competitive-balancer",
        profileName: "Power and Leverage",
        resemblesTheLogicOf: "Competitive Balancer",
        noticesFirst:
          "Strategic chokepoints in advanced chips, tools, and know-how, and whether control of them can preserve military-technological advantage.",
        likelyRecommendation:
          "Use targeted controls, screening, and alliance coordination to deny rivals critical capabilities while deepening trusted production networks.",
        strongestObjection: "A leverage-first strategy can provoke retaliation, leakage, and long-run fragmentation costs.",
      },
      {
        patternId: "structural-inequality-critic",
        profileName: "Power Behind the Rules",
        resemblesTheLogicOf: "Structural Inequality Critic",
        noticesFirst:
          "How rule-setting, subsidies, and controls can entrench hierarchy by deciding who gets access to advanced production and who remains downstream.",
        likelyRecommendation:
          "Examine distributional effects, rule-writing power, and whether resilience language is legitimising a new form of managed dependence.",
        strongestObjection: "This can underweight the genuinely security-driven side of semiconductor policy.",
      },
      {
        patternId: "cross-pressured-synthesizer",
        profileName: "Different by Domain",
        resemblesTheLogicOf: "Cross-Pressured Synthesizer",
        noticesFirst:
          "A split between diagnosis and prescription: rivalry is real in high-end segments, but not every node or tool should be treated identically.",
        likelyRecommendation:
          "Use differentiated policy by domain: tighter controls on frontier military-relevant capabilities, broader coordination and openness where resilience and innovation benefit from scale.",
        strongestObjection: "Granular tailoring is administratively hard and can be politically unstable.",
      },
    ],
    whereTheAnalogyBreaks: [
      "Semiconductors are unusually capital-intensive and concentrated; lessons do not transfer cleanly to every strategic sector.",
      "The distinction between mature-node and leading-edge production matters greatly; one industrial-policy lesson can hide several different markets.",
      "Controls on hardware, software, talent, and investment do not operate with the same timelines or enforcement problems.",
    ],
    suitabilityForLayReaders: {
      rating: "Medium-High",
      why: "The case is highly relevant and concrete, but the value chain is technically layered and benefits from diagrams or a short explainer.",
    },
    sensitiveClaims: [
      "Be precise with money: the CHIPS and Science Act authorised broader funding, while the CHIPS Program Office itself administers the manufacturing-incentives portion.",
      "Avoid implying that controls can 'stop' technological development outright; the stronger and safer wording is that they can raise costs, slow access, or redirect adjustment.",
      "Avoid collapsing 'resilience,' 'friend-shoring,' 'sovereignty,' and 'autarky' into one concept; they are not the same policy.",
    ],
  },
] as const

const casesById = new Map(caseLibrary.map((caseStudy) => [caseStudy.id, caseStudy]))

export function getCaseStudy(id: string): CaseStudy | null {
  return casesById.get(id) ?? null
}

export type PatternCaseReading = {
  caseStudy: CaseStudy
  reading: CaseProfileReading
}

/** Every case in which the given atlas pattern has an approved reading. */
export function getCaseReadingsForPattern(patternId: string): PatternCaseReading[] {
  const readings: PatternCaseReading[] = []

  for (const caseStudy of caseLibrary) {
    const reading = caseStudy.readings.find((entry) => entry.patternId === patternId)
    if (reading) readings.push({ caseStudy, reading })
  }

  return readings
}
