import type {
  ModuleAnalytics,
  ModuleDefinition,
  ModuleLaneSummary,
} from "@/lib/modules/types"
import type { DimensionKey, DimensionScores } from "@/lib/types"

const securityLanes: ModuleDefinition["lanes"] = [
  {
    key: "deterrence",
    label: "Deterrence and escalation",
    description: "How you handle probing, coercion, and crisis ceilings.",
    scoreKey: "activism",
    lowLabel: "Crisis-limiting",
    highLabel: "Pressure-forward",
  },
  {
    key: "alliances",
    label: "Alliances and autonomy",
    description: "How exposed partners, coalition durability, and hedging space should be read.",
    scoreKey: "alliance",
    lowLabel: "Autonomy space",
    highLabel: "Alliance-centered",
  },
  {
    key: "legitimacy",
    label: "Order, legitimacy, and protection",
    description: "How you weigh order, legal authority, civilian protection, and bounded action.",
    scoreKey: "legitimacy",
    lowLabel: "Order-first",
    highLabel: "Protection-sensitive",
  },
]

const securityStandardQuestions: ModuleDefinition["questionsByMode"]["standard"] = [
  {
    id: "taiwan_quarantine",
    kind: "case",
    lane: "deterrence",
    cardType: "decision",
    title: "Beijing's quarantine calculus",
    prompt: "What should carry the most weight first?",
    scene:
      "Day three of a quarantine around Taiwan. Insurers are pulling back, container traffic is slowing, and no shots have been fired. In Beijing, leaders are deciding what should govern the next move while they still claim the inspections are lawful and limited.",
    whyHard:
      "Too little pressure can make the move look hollow. Too much pressure can turn coercion below war into a direct clash before Beijing knows how far outside powers will go.",
    contextBullets: [
      {
        label: "Actor role",
        text: "Answer from Beijing's strategic position, not from Taiwan's domestic politics or Washington's preferred response.",
      },
      {
        label: "Crisis stage",
        text: "The pressure campaign has begun, but the crisis is still below open war.",
      },
      {
        label: "Immediate constraint",
        text: "Beijing wants to squeeze Taipei and deter outside intervention without triggering a coalition it cannot control.",
      },
      {
        label: "Term",
        text: "A quarantine here means coercive inspections and movement limits without a formally declared blockade.",
      },
    ],
    perspectiveTags: ["major-power", "deterrence", "maritime", "frontline-state"],
    knowledgeLoad: "medium",
    allowSecondChoiceInAnalyst: true,
    options: [
      {
        id: "clarify_response",
        title: "Make the line unmistakable",
        label:
          "The first job is to show that pressure below invasion can still change behavior before outside coalitions settle.",
        signals: { activism: 6.1, escalation: 6.0, alliance: 5.0, legitimacy: 4.2 },
      },
      {
        id: "build_denial_endurance",
        title: "Build a long squeeze",
        label:
          "The stronger move is to wear down traffic, insurers, and political stamina over time rather than force one dramatic showdown.",
        signals: { activism: 5.1, escalation: 5.0, alliance: 5.9, legitimacy: 4.8 },
      },
      {
        id: "preserve_hedging_space",
        title: "Keep regional states divided",
        label:
          "Pressure works best if nearby states are not pushed into a fast, hard anti-China alignment.",
        signals: { activism: 3.2, escalation: 3.6, alliance: 3.2, legitimacy: 4.9 },
      },
      {
        id: "raise_political_costs",
        title: "Keep the pressure framed as law and politics",
        label:
          "Economic and diplomatic pressure matters most if the operation still looks limited enough to avoid a wider military jump.",
        signals: { activism: 4.1, escalation: 4.0, alliance: 5.0, legitimacy: 6.0 },
      },
    ],
  },
  {
    id: "gray_zone_sabotage",
    kind: "case",
    lane: "deterrence",
    cardType: "explanation",
    title: "Gray-zone sabotage",
    prompt: "What is the most persuasive reading of what the rival is testing?",
    scene:
      "After three weeks of cable cuts, rail disruptions, and port outages across two allied states, intelligence services privately assess a rival state's hand as likely but not courtroom-grade. An alliance ministerial must decide what the campaign is really testing before it makes the next public statement.",
    whyHard:
      "If attribution stays contested, allies can agree the pattern is hostile while still disagreeing about whether it calls for punishment, resilience, or restraint.",
    contextBullets: [
      { label: "Actor role", text: "You are judging the campaign from an allied ministerial trying to hold both credibility and cohesion together." },
      { label: "Crisis stage", text: "The sabotage pattern is ongoing but still below any openly declared military threshold." },
      { label: "Attribution quality", text: "Private confidence is higher than public proof." },
      { label: "Immediate constraint", text: "Partners will fracture if they define the problem differently." },
    ],
    perspectiveTags: ["alliance-manager", "cyber", "infrastructure", "major-power"],
    knowledgeLoad: "medium",
    allowSecondChoiceInAnalyst: true,
    options: [
      {
        id: "resolve_probe",
        title: "Test response thresholds",
        label:
          "The incidents are mainly testing whether ambiguity lets the rival impose costs without triggering a firm threshold response.",
        signals: { activism: 5.6, escalation: 5.8, alliance: 4.9, legitimacy: 4.1 },
      },
      {
        id: "coalition_probe",
        title: "Test coalition fracture points",
        label:
          "The target is the political gap between partners with different thresholds for acting on incomplete evidence.",
        signals: { activism: 4.8, escalation: 4.8, alliance: 6.1, legitimacy: 4.8 },
      },
      {
        id: "resilience_probe",
        title: "Map resilience gaps",
        label:
          "The rival is exploiting repair, redundancy, and recovery weaknesses more than it is trying to trigger one dramatic showdown.",
        signals: { activism: 3.5, escalation: 3.8, alliance: 4.5, legitimacy: 4.4 },
      },
      {
        id: "bait_for_escalation",
        title: "Create an attribution trap",
        label:
          "The point is to provoke an overreaction on partial evidence and turn allied caution into a strategic restraint on themselves.",
        signals: { activism: 3.4, escalation: 3.6, alliance: 4.2, legitimacy: 5.8 },
      },
    ],
  },
  {
    id: "shipping_attacks",
    kind: "case",
    lane: "deterrence",
    cardType: "decision",
    title: "Iran's retaliation ladder",
    prompt: "What should govern Tehran's response?",
    scene:
      "After a covert strike on a sensitive site and a wave of proxy attacks across the region, Tehran is deciding how to respond. Some officials want a visible strike to restore deterrence. Others argue that survival under sanctions matters more than one dramatic answer.",
    whyHard:
      "A restrained response can invite more pressure. A direct response can widen the war under conditions Iran may not control.",
    contextBullets: [
      {
        label: "Actor role",
        text: "Answer from Tehran's strategic position, not from what outside powers would prefer.",
      },
      {
        label: "Crisis stage",
        text: "The crisis has moved beyond signaling, but it has not yet become an open state-to-state war.",
      },
      {
        label: "Immediate constraint",
        text: "Iran faces sanctions, surveillance, and the risk that a visible strike could justify a broader campaign against it.",
      },
      {
        label: "Uncertainty",
        text: "It is unclear whether a limited direct response would restore deterrence or expose Iran's weaker position.",
      },
    ],
    perspectiveTags: ["regional-security", "maritime", "sanctions"],
    knowledgeLoad: "low",
    allowSecondChoiceInAnalyst: true,
    options: [
      {
        id: "punish_fast",
        title: "Restore deterrence visibly",
        label:
          "If the answer looks weak, outside strikes and covert pressure may start to look low-cost.",
        signals: { activism: 5.9, escalation: 5.6, alliance: 4.4, legitimacy: 4.0 },
      },
      {
        id: "protect_the_route",
        title: "Work through deniable channels",
        label:
          "The stronger path is to use partners, proxies, and indirect pressure where the balance is less exposed.",
        signals: { activism: 4.3, escalation: 4.1, alliance: 5.9, legitimacy: 5.1 },
      },
      {
        id: "keep_a_ceiling",
        title: "Keep the ceiling low",
        label:
          "The deeper danger is being pulled into a broader war that Iran cannot bound on favorable terms.",
        signals: { activism: 2.9, escalation: 3.1, alliance: 4.0, legitimacy: 4.6 },
      },
      {
        id: "anchor_in_regional_backing",
        title: "Raise the political cost through diplomacy",
        label:
          "Iran gains more by widening the diplomatic and regional cost of further strikes than by chasing immediate military drama.",
        signals: { activism: 4.0, escalation: 4.0, alliance: 4.9, legitimacy: 6.0 },
      },
    ],
  },
  {
    id: "eastern_flank",
    kind: "case",
    lane: "alliances",
    cardType: "decision",
    title: "Eastern-flank reassurance",
    prompt: "What should matter most in the posture decision?",
    scene:
      "After repeated sabotage scares and airspace incidents, a NATO state on the eastern flank asks for a more permanent allied presence. Some partners favor a visible tripwire; others want a posture built around reinforcement, mobility, and local denial.",
    whyHard:
      "A signal that reassures exposed allies may also look like routine escalation if it becomes too rigid or too symbolic.",
    contextBullets: [
      { label: "Actor / stake", text: "Frontline allies want a posture that proves the alliance would not hesitate in a real crisis." },
      { label: "Uncertainty", text: "It is unclear whether deterrence comes more from symbolism, local resilience, or reinforcement depth." },
    ],
    perspectiveTags: ["alliance-manager", "frontline-state", "deterrence"],
    knowledgeLoad: "low",
    allowSecondChoiceInAnalyst: true,
    options: [
      {
        id: "make_the_promise_visible",
        title: "Make the promise visible",
        label:
          "A forward presence matters first because exposed allies need proof that any attack instantly widens the coalition.",
        signals: { activism: 5.9, escalation: 6.0, alliance: 6.3, legitimacy: 4.3 },
      },
      {
        id: "build_reinforcement_depth",
        title: "Build reinforcement depth",
        label:
          "Deterrence is strongest when the posture can be reinforced quickly and sustained politically, not just displayed.",
        signals: { activism: 4.8, escalation: 4.9, alliance: 6.0, legitimacy: 4.7 },
      },
      {
        id: "prioritize_local_denial",
        title: "Prioritize local denial",
        label:
          "Frontline states need their own mobilization, civil defense, and denial capacity more than they need a symbolic outside footprint.",
        signals: { activism: 4.5, escalation: 4.6, alliance: 3.0, legitimacy: 4.1 },
      },
      {
        id: "pair_reassurance_with_limits",
        title: "Pair reassurance with limits",
        label:
          "Reassurance should stay tied to explicit ceilings so that every incident does not become a crisis of posture.",
        signals: { activism: 3.2, escalation: 3.5, alliance: 4.4, legitimacy: 5.0 },
      },
    ],
  },
  {
    id: "maritime_pressure",
    kind: "case",
    lane: "alliances",
    cardType: "decision",
    title: "Maritime pressure short of alliance",
    prompt: "What should carry the most weight when outside states offer support?",
    scene:
      "A Southeast Asian state faces repeated maritime pressure from a much larger power. It wants help, but not formal bloc alignment that would narrow its diplomatic room or turn every dispute into a camp test.",
    whyHard:
      "Outside backing can strengthen the smaller state, but the wrong form of backing can also reduce the autonomy it is trying to preserve.",
    contextBullets: [
      { label: "Actor / stake", text: "The state is vulnerable to coercion but still wants room to trade, bargain, and hedge." },
      { label: "Uncertainty", text: "Support that looks stabilizing to one actor may look like bloc capture to another." },
    ],
    perspectiveTags: ["small-state", "middle-power", "hedging", "maritime"],
    knowledgeLoad: "low",
    allowSecondChoiceInAnalyst: true,
    options: [
      {
        id: "hard_external_backing",
        title: "Use hard external backing",
        label:
          "Without stronger outside balancing, legal claims and coast guards will not offset material asymmetry for long.",
        signals: { activism: 5.1, escalation: 5.3, alliance: 6.2, legitimacy: 4.2 },
      },
      {
        id: "protect_hedging_room",
        title: "Protect hedging room",
        label:
          "Smaller states often survive by diversifying ties and avoiding security arrangements that narrow their diplomatic options too early.",
        signals: { activism: 3.5, escalation: 4.0, alliance: 2.8, legitimacy: 4.9 },
      },
      {
        id: "multilateralize_pressure",
        title: "Multilateralize pressure",
        label:
          "The more durable answer is to widen the political cost of coercion through law, regional diplomacy, and shared monitoring.",
        signals: { activism: 4.0, escalation: 4.0, alliance: 4.9, legitimacy: 5.9 },
      },
      {
        id: "build_local_resilience",
        title: "Build local resilience",
        label:
          "What matters first is resilient local capacity: surveillance, denial tools, and shock absorption at home.",
        signals: { activism: 4.7, escalation: 4.6, alliance: 3.6, legitimacy: 4.2 },
      },
    ],
  },
  {
    id: "middle_power_alignment",
    kind: "case",
    lane: "alliances",
    cardType: "actorLens",
    title: "Strategic autonomy under border pressure",
    prompt: "From this state's strategic position, which logic looks strongest?",
    scene:
      "A large democracy faces a coercive neighbor on its border. It wants weapons, investment, and intelligence help from several major powers, but it does not want one bloc to dictate every trade and diplomatic decision. Its cabinet is deciding how to defend that strategy before outside partners demand a cleaner line.",
    whyHard:
      "From outside, this can look evasive. From inside, it may be the state's best way to preserve leverage and avoid new dependence.",
    contextBullets: [
      {
        label: "Actor role",
        text: "Answer from the state's own strategic position, not from what any outside patron would prefer.",
      },
      {
        label: "Crisis stage",
        text: "Pressure is rising, but the state is not yet being forced into a formal bloc break.",
      },
      {
        label: "Immediate constraint",
        text: "The state wants security help without surrendering room on trade, diplomacy, and future bargaining.",
      },
    ],
    perspectiveTags: ["middle-power", "nonaligned", "hedging"],
    knowledgeLoad: "low",
    allowSecondChoiceInAnalyst: true,
    options: [
      {
        id: "ambiguity_will_fail",
        title: "Prepare for a forced choice",
        label:
          "If rivalry keeps sharpening, the state may need to bank credibility with Washington before the room to hedge closes.",
        signals: { activism: 5.0, escalation: 5.2, alliance: 6.1, legitimacy: 4.1 },
      },
      {
        id: "layered_alignment_is_real",
        title: "Keep the files separate",
        label:
          "The state can deepen security ties where needed without turning trade, finance, and diplomacy into the same bloc decision.",
        signals: { activism: 4.2, escalation: 4.3, alliance: 5.0, legitimacy: 4.9 },
      },
      {
        id: "autonomy_is_rational",
        title: "Treat autonomy as security",
        label:
          "From this position, bargaining room is part of national security, not a refusal to take threats seriously.",
        signals: { activism: 3.7, escalation: 4.0, alliance: 2.8, legitimacy: 5.3 },
      },
      {
        id: "problem_based_coalitions",
        title: "Stay issue by issue",
        label:
          "The most durable strategy is to join coalitions on specific problems without accepting whole-of-state alignment.",
        signals: { activism: 4.0, escalation: 4.1, alliance: 4.8, legitimacy: 5.5 },
      },
    ],
  },
  {
    id: "atrocity_response",
    kind: "case",
    lane: "legitimacy",
    cardType: "decision",
    title: "Mass atrocity and outside action",
    prompt: "What should govern the decision?",
    scene:
      "Mass civilian killing is underway, the Security Council is blocked, and outside military action would be legally contested. Some governments argue that the humanitarian threshold is already clear; others warn that poorly bounded intervention could damage order beyond the immediate crisis.",
    whyHard:
      "The central tension is whether the gravity of the harm justifies acting without the level of legal and political grounding that would normally be required.",
    contextBullets: [
      { label: "Actor / stake", text: "Civilians face immediate danger, but outside action would also create a precedent for future cases." },
      { label: "Uncertainty", text: "No option offers a clean combination of effectiveness, legality, and political durability." },
    ],
    perspectiveTags: ["vulnerable-state", "humanitarian", "regional-order"],
    knowledgeLoad: "low",
    allowSecondChoiceInAnalyst: true,
    options: [
      {
        id: "legal_bar_remains_high",
        title: "Keep the legal bar high",
        label:
          "However terrible the case, overriding sovereignty without durable grounding can damage order well beyond the crisis at hand.",
        signals: { activism: 3.4, escalation: 4.0, alliance: 4.1, legitimacy: 2.9 },
      },
      {
        id: "limited_protection_can_qualify",
        title: "Allow limited protection",
        label:
          "If the threshold is truly extreme, narrow action to stop mass killing can still be defensible without perfect consensus.",
        signals: { activism: 5.2, escalation: 4.2, alliance: 4.6, legitimacy: 6.2 },
      },
      {
        id: "regional_authority_should_anchor",
        title: "Anchor in regional authority",
        label:
          "Outside action is more defensible when nearby states define the aim, ceiling, and exit conditions.",
        signals: { activism: 4.5, escalation: 4.4, alliance: 5.0, legitimacy: 5.7 },
      },
      {
        id: "reduce_harm_without_widening",
        title: "Reduce harm without widening",
        label:
          "Relief, sanctions, monitoring, and documentation may do less, but they avoid normalizing open-ended force on weak authorization.",
        signals: { activism: 3.0, escalation: 3.5, alliance: 4.3, legitimacy: 4.8 },
      },
    ],
  },
  {
    id: "aid_corridor",
    kind: "case",
    lane: "legitimacy",
    cardType: "decision",
    title: "Aid corridors without clear authorization",
    prompt: "What should carry the most weight?",
    scene:
      "A government is choking off food and medicine to a besieged region. Outside states consider escorting maritime and air relief corridors, but there is no clear UN authorization and several regional actors worry about mission creep.",
    whyHard:
      "The problem is how to relieve urgent civilian harm without quietly turning a relief mission into a broader warfighting mandate.",
    contextBullets: [
      { label: "Actor / stake", text: "The people at risk need access quickly, but the legal and political basis for coercive escort is disputed." },
      { label: "Uncertainty", text: "A corridor could save lives, but it could also force escalation if the government challenges it directly." },
    ],
    perspectiveTags: ["humanitarian", "regional-order", "civilian-protection"],
    knowledgeLoad: "low",
    allowSecondChoiceInAnalyst: true,
    options: [
      {
        id: "open_the_corridor",
        title: "Open the corridor",
        label:
          "When starvation or siege tactics are already being used, relief access itself becomes the urgent strategic priority.",
        signals: { activism: 4.8, escalation: 4.1, alliance: 4.5, legitimacy: 6.1 },
      },
      {
        id: "seek_regional_cover",
        title: "Seek regional cover",
        label:
          "Even under pressure, the mission needs regional political ownership if it is going to remain bounded and defensible.",
        signals: { activism: 4.2, escalation: 4.1, alliance: 5.1, legitimacy: 5.6 },
      },
      {
        id: "secure_authority_first",
        title: "Secure authority first",
        label:
          "The mission should not move faster than its legal and political basis, even when the delay is painful.",
        signals: { activism: 3.2, escalation: 3.9, alliance: 4.0, legitimacy: 3.0 },
      },
      {
        id: "intensify_indirect_pressure",
        title: "Intensify indirect pressure",
        label:
          "The better route is harder sanctions, public evidence, and coercive diplomacy short of escorting contested corridors.",
        signals: { activism: 3.6, escalation: 3.7, alliance: 4.5, legitimacy: 4.9 },
      },
    ],
  },
  {
    id: "ceasefire_accountability",
    kind: "case",
    lane: "legitimacy",
    cardType: "explanation",
    title: "Ceasefire versus accountability",
    prompt: "What is the strongest framing of the tradeoff?",
    scene:
      "Mediators think they can likely secure a ceasefire in a brutal war, but only if accountability is delayed and monitors are weaker than many activists want. The debate turns on whether stopping the killing, preserving legal norms, or building a politically workable settlement matters most.",
    whyHard:
      "The same compromise can look like prudence to one camp and norm erosion to another.",
    contextBullets: [
      { label: "Actor / stake", text: "Negotiators, affected communities, and outside supporters all define a 'responsible' peace differently." },
      { label: "Uncertainty", text: "A harder accountability demand may preserve principle but also delay a fragile chance to stop the war." },
    ],
    perspectiveTags: ["post-conflict", "humanitarian", "transitional-justice"],
    knowledgeLoad: "medium",
    allowSecondChoiceInAnalyst: true,
    options: [
      {
        id: "stop_killing_first",
        title: "Stop the killing first",
        label:
          "The strongest justification for compromise is that ending mass harm now outweighs getting the legal architecture right immediately.",
        signals: { activism: 3.3, escalation: 3.6, alliance: 4.1, legitimacy: 5.7 },
      },
      {
        id: "accountability_sets_limits",
        title: "Accountability sets limits",
        label:
          "If accountability can always be postponed in the hardest cases, the norm against atrocity steadily weakens where it matters most.",
        signals: { activism: 3.7, escalation: 3.9, alliance: 4.2, legitimacy: 2.9 },
      },
      {
        id: "regional_monitoring_compromise",
        title: "Use a monitored compromise",
        label:
          "The better answer is a politically workable ceasefire tied to regional monitoring and a sequenced accountability path.",
        signals: { activism: 3.8, escalation: 3.8, alliance: 5.0, legitimacy: 5.1 },
      },
      {
        id: "bad_peace_can_recycle_harm",
        title: "A bad peace recycles harm",
        label:
          "A ceasefire without credible enforcement or future constraint can freeze violence temporarily while preserving its drivers.",
        signals: { activism: 4.4, escalation: 4.2, alliance: 4.6, legitimacy: 4.7 },
      },
    ],
  },
]

const securityAnalystAdditions: ModuleDefinition["questionsByMode"]["analyst"] = [
  {
    id: "iran_threshold",
    kind: "case",
    lane: "deterrence",
    cardType: "explanation",
    title: "Nuclear threshold and preventive force",
    prompt: "What is the strongest reading of what this case is mainly about?",
    scene:
      "At a regional crisis review, inspectors report Iran is closer to weapons-grade breakout than six months ago, but intent and weaponization timelines remain disputed. Israel, Gulf partners, and Western governments are arguing over whether this is mainly a failing leverage game, a future containment problem, a coalition-discipline problem, or a legitimacy-boundary problem.",
    whyHard:
      "The closer threshold status feels, the easier it is for the argument to slide from pressure and bargaining into preventive-war logic.",
    contextBullets: [
      { label: "Actor role", text: "You are judging the case from a coalition debating its next line, not from Tehran's internal politics." },
      { label: "Crisis stage", text: "The crisis is still in the threshold-and-signaling phase, before an open strike decision." },
      { label: "Attribution quality", text: "Inspection access is degrading, but knowledge about intent and timeline is still incomplete." },
      { label: "Immediate constraint", text: "Partners want urgency without stumbling into a war they may not be able to bound." },
    ],
    perspectiveTags: ["regional-security", "nuclear", "alliance-manager"],
    knowledgeLoad: "medium",
    allowSecondChoiceInAnalyst: true,
    options: [
      {
        id: "threshold_is_a_leverage_problem",
        title: "Leverage is evaporating",
        label:
          "The real issue is that once threshold status feels normal, diplomacy loses pressure faster than it can recover it.",
        signals: { activism: 6.0, escalation: 5.7, alliance: 4.8, legitimacy: 4.0 },
      },
      {
        id: "threshold_is_a_containment_problem",
        title: "Containment is safer",
        label:
          "The key problem is how to avoid turning a bad nuclear position into an even wider war through premature force.",
        signals: { activism: 2.8, escalation: 3.2, alliance: 4.1, legitimacy: 4.8 },
      },
      {
        id: "threshold_is_a_coalition_problem",
        title: "Coalition management comes first",
        label:
          "The central question is whether partners can sustain a credible common line long enough for pressure to mean anything.",
        signals: { activism: 4.6, escalation: 4.5, alliance: 5.9, legitimacy: 4.8 },
      },
      {
        id: "threshold_is_a_legitimacy_problem",
        title: "Legitimacy sets the ceiling",
        label:
          "What matters most is whether any harder move can still be defended as bounded and politically sustainable.",
        signals: { activism: 4.0, escalation: 4.1, alliance: 4.5, legitimacy: 6.0 },
      },
    ],
  },
  {
    id: "nuclear_hedging",
    kind: "case",
    lane: "alliances",
    cardType: "decision",
    title: "Extended deterrence and nuclear hedging",
    prompt: "What should matter most in the response to an exposed ally's nuclear debate?",
    scene:
      "An exposed ally begins debating an independent nuclear option because it no longer fully trusts extended deterrence. Some officials want unmistakable reassurance; others think the moment calls for a broader political framework that lowers demand for new arsenals.",
    whyHard:
      "Reassurance, nonproliferation, and autonomy all matter here, but pushing one too hard can undermine the others.",
    contextBullets: [
      { label: "Actor / stake", text: "The ally is not only judging the adversary. It is also judging the reliability of its own coalition." },
      { label: "Uncertainty", text: "A stronger guarantee may calm fears, but it may also tie the guarantor more tightly to future escalation." },
    ],
    perspectiveTags: ["alliance-manager", "frontline-state", "nuclear"],
    knowledgeLoad: "medium",
    allowSecondChoiceInAnalyst: true,
    options: [
      {
        id: "restore_confidence_fast",
        title: "Restore confidence fast",
        label:
          "The first job is to make the outside guarantee unmistakable before the hedging debate cascades further.",
        signals: { activism: 5.3, escalation: 5.6, alliance: 6.3, legitimacy: 4.2 },
      },
      {
        id: "lower_demand_for_latency",
        title: "Lower demand for latency",
        label:
          "What matters most is a political and military framework that reduces the felt need for an independent option.",
        signals: { activism: 3.9, escalation: 4.0, alliance: 5.0, legitimacy: 5.6 },
      },
      {
        id: "tolerate_some_hedging",
        title: "Tolerate some hedging",
        label:
          "Some allies will want a latent option even if they do not cross the line, and treating that as pure disloyalty misreads the problem.",
        signals: { activism: 4.2, escalation: 4.7, alliance: 3.4, legitimacy: 4.8 },
      },
      {
        id: "protect_nonproliferation_early",
        title: "Protect nonproliferation early",
        label:
          "The wider danger is the spread of nuclear latency itself, even if the ally's anxiety is understandable.",
        signals: { activism: 4.8, escalation: 4.6, alliance: 5.4, legitimacy: 5.2 },
      },
    ],
  },
  {
    id: "sanctions_enforcement",
    kind: "case",
    lane: "legitimacy",
    cardType: "explanation",
    title: "Sanctions leakage and swing states",
    prompt: "What is the strongest reading of why several swing states resist tighter enforcement?",
    scene:
      "A wartime coalition wants third-country firms and ports to enforce sanctions more tightly. Several swing states say that looks like wealthy powers exporting their war discipline through other people's trade networks.",
    whyHard:
      "The same resistance can be read as opportunism, autonomy protection, or a real legitimacy objection to how coercion is being organized.",
    contextBullets: [
      { label: "Actor / stake", text: "The coalition wants enforcement credibility; swing states want to avoid becoming instruments of a conflict they do not fully own." },
      { label: "Uncertainty", text: "It is unclear whether harder pressure would strengthen the coalition or merely narrow it." },
    ],
    perspectiveTags: ["middle-power", "nonaligned", "sanctions", "developmental"],
    knowledgeLoad: "medium",
    allowSecondChoiceInAnalyst: true,
    options: [
      {
        id: "resistance_is_about_leakage",
        title: "Leakage changes the war",
        label:
          "The central issue is that sanctions lose strategic meaning when outside actors can profit from evasion without consequence.",
        signals: { activism: 5.5, escalation: 4.9, alliance: 5.2, legitimacy: 4.0 },
      },
      {
        id: "resistance_is_about_coalition_breadth",
        title: "Breadth is the real stake",
        label:
          "A broad but imperfect coalition often lasts longer than a cleaner coalition built on coercing reluctant states.",
        signals: { activism: 4.2, escalation: 4.1, alliance: 6.0, legitimacy: 5.2 },
      },
      {
        id: "resistance_is_about_autonomy",
        title: "Autonomy is the real stake",
        label:
          "Many middle powers resist not because they support the target, but because they do not want to be turned into enforcement arms for others.",
        signals: { activism: 3.7, escalation: 3.8, alliance: 2.9, legitimacy: 5.1 },
      },
      {
        id: "resistance_is_about_legal_grounding",
        title: "Legal grounding is the real stake",
        label:
          "The more coercive the enforcement becomes, the more it needs a public basis that looks like law rather than improvised hierarchy.",
        signals: { activism: 4.0, escalation: 3.9, alliance: 4.6, legitimacy: 6.2 },
      },
    ],
  },
]

export const securityModule: ModuleDefinition = {
  slug: "security",
  shortTitle: "Security",
  title: "Security, Strategy, and Statecraft",
  subtitle: "Deterrence, alliances, and protection under pressure",
  shorthand: "Security Pressure",
  timeEstimate: {
    standard: "8 to 10 minutes",
    analyst: "11 to 14 minutes",
  },
  description:
    "An issue-specific read on deterrence, alliance politics, crisis ceilings, and the legitimacy of force under pressure.",
  measures: [
    "pressure versus crisis-limiting instincts",
    "alliance-centered versus autonomy-sensitive coalition instincts",
    "order-first versus protection-sensitive views of force and legitimacy",
    "how explanation cards differ from decision cards when the case sharpens",
  ],
  doesNotClaim: [
    "a fixed security identity that overrides the Foundation baseline",
    "a full theory of grand strategy across every theater",
    "role-play or nationality-adjusted answers",
  ],
  axes: [
    {
      key: "activism",
      label: "Force posture",
      lowLabel: "Restrained",
      highLabel: "Coercive",
    },
    {
      key: "escalation",
      label: "Escalation lens",
      lowLabel: "Escalation-averse",
      highLabel: "Credibility-first",
    },
    {
      key: "alliance",
      label: "Alliance lens",
      lowLabel: "Autonomy-sensitive",
      highLabel: "Alliance-centric",
    },
    {
      key: "legitimacy",
      label: "Legitimacy lens",
      lowLabel: "Order-first",
      highLabel: "Protection-sensitive",
    },
  ],
  lanes: securityLanes,
  questionsByMode: {
    standard: securityStandardQuestions,
    analyst: [...securityStandardQuestions, ...securityAnalystAdditions],
  },
  interpret(analytics) {
    const { activism, escalation, alliance, legitimacy } = analytics.scores

    if (activism >= 5.4 && escalation >= 5.1) {
      return {
        headline: "Security read: pressure and visible deterrence",
        summary:
          "Under security pressure, you generally believe delay is costly and visible commitment helps keep rivals from pushing further.",
        instincts: [
          "You worry most about what hesitation teaches an adversary.",
          "You treat credibility failures as harder to reverse than bounded overcommitment.",
          "You are comfortable with pressure when it clarifies the line rather than blurs it.",
        ],
        challenge:
          "This style can understate how quickly credibility campaigns become escalation traps or politically unsustainable commitments.",
      }
    }

    if (activism <= 3.7 && escalation <= 3.9) {
      return {
        headline: "Security read: restraint and crisis ceilings",
        summary:
          "You look first for ceilings, off-ramps, and ways to keep coercion from widening into a harder war than the original problem requires.",
        instincts: [
          "You are skeptical that visible toughness automatically produces better outcomes.",
          "You see overextension and mission creep as strategic dangers in their own right.",
          "You prefer bounded responses that do not quietly redefine the whole conflict.",
        ],
        challenge:
          "This style can understate how much cumulative advantage a rival can gain when caution keeps winning the first move.",
      }
    }

    if (alliance >= 5.4) {
      return {
        headline: "Security read: coalition-centered pressure management",
        summary:
          "You generally believe security holds best when exposed partners trust the coalition and the coalition can carry the policy together.",
        instincts: [
          "You treat alliance cohesion as part of deterrence, not diplomatic decoration.",
          "You prefer strategies that partners can sustain together over dramatic unilateral gestures.",
          "You pay close attention to how frontline and middle-power states read outside commitments.",
        ],
        challenge:
          "This style can assume more allied durability than domestic politics will actually deliver under stress.",
      }
    }

    if (legitimacy >= 5.3) {
      return {
        headline: "Security read: protection-sensitive statecraft",
        summary:
          "You generally believe force and deterrence hold best when they remain bounded by civilian protection, political legitimacy, and defensible authority.",
        instincts: [
          "You keep asking what kind of precedent a response is setting.",
          "You distinguish narrow protection from open-ended license to act.",
          "You see legitimacy as part of strategic durability rather than as a separate moral clean-up step.",
        ],
        challenge:
          "This style can overestimate how much legitimacy itself constrains rivals willing to absorb reputational cost.",
      }
    }

    return {
      headline: "Security read: targeted pressure with limits",
      summary:
        "You prefer targeted pressure over either passivity or maximal escalation. Alliance durability, crisis ceilings, and legitimacy all stay in view.",
      instincts: [
        "You resist turning every crisis into a single test of resolve.",
        "You look for responses that keep options open rather than settle the argument too early.",
        "You expect the strongest security logic to shift with theater, partner exposure, and political context.",
      ],
      challenge:
        "This style can leave your own threshold for decisive action harder to specify when a crisis suddenly sharpens.",
    }
  },
  summarizeLanes(analytics, foundation) {
    const deterrence = analytics.laneScores.deterrence
    const alliances = analytics.laneScores.alliances
    const legitimacy = analytics.laneScores.legitimacy

    return [
      summarizeSecurityLane("deterrence", deterrence, foundation),
      summarizeSecurityLane("alliances", alliances, foundation),
      summarizeSecurityLane("legitimacy", legitimacy, foundation),
    ]
  },
  summarizeCardTypes(analytics) {
    const explanation = analytics.cardTypeScores.explanation
    const decision = analytics.cardTypeScores.decision
    const actorLens = analytics.cardTypeScores.actorLens

    if (actorLens) {
      if (decision && decision.alliance - actorLens.alliance >= 0.65) {
        return {
          headline: "Explanation, Decision, and Actor lens",
          summary:
            "Your own decision cards lean more toward alliance management than your actor-lens cards do. When you switch into another state's position, autonomy and exposure become more visible. That perspective read is tracked separately so it does not overwrite your own security judgment.",
        }
      }

      return {
        headline: "Explanation, Decision, and Actor lens",
        summary:
          "The actor-lens cards are doing a different job from the decision cards. They track how security logic looks from inside another actor's position, so perspective-modeling does not overwrite your own issue read.",
      }
    }

    if (!explanation || !decision) return undefined

    if (explanation.activism - decision.activism >= 0.65) {
      return {
        headline: "Explanation and Decision",
        summary:
          "You explain security cases through harder pressure and deterrence logics than you are willing to endorse outright once the decision costs are in view.",
      }
    }

    if (decision.legitimacy - explanation.legitimacy >= 0.65) {
      return {
        headline: "Explanation and Decision",
        summary:
          "You often read cases structurally, but your decision cards keep legitimacy, civilian risk, and bounded action more active than your explanations alone would suggest.",
      }
    }

    if (decision.alliance - explanation.alliance >= 0.65) {
      return {
        headline: "Explanation and Decision",
        summary:
          "Your explanation cards are not especially coalition-first, but your decision cards put much more weight on what exposed partners and alliances can actually carry together.",
      }
    }

    return {
      headline: "Explanation and Decision",
      summary:
        "Your explanation and decision cards mostly point in the same direction. The same security logic tends to survive when the question shifts from diagnosis to choice.",
    }
  },
  buildOverlayDeltas(analytics) {
    const { activism, escalation, alliance, legitimacy } = analytics.scores

    return {
      securityCompetition: compress(((activism - 4) * 0.6 + (escalation - 4) * 0.4) * 0.55),
      institutions: compress(((alliance - 4) * 0.75 + (legitimacy - 4) * 0.25) * 0.4),
      normsIdentity: compress((legitimacy - 4) * 0.22),
      restraint: compress((4 - activism) * 0.55),
      orderJustice: compress((4 - legitimacy) * 0.55),
    }
  },
  compareToFoundation(analytics, foundation) {
    const notes: string[] = []
    const { activism, alliance, legitimacy } = analytics.scores

    if (foundation.restraint >= 5.15 && activism >= 5.1) {
      notes.push("Under security pressure, you harden relative to your more restrained Foundation baseline.")
    } else if (foundation.restraint <= 3.85 && activism <= 3.8) {
      notes.push("Under security pressure, you become more bounded than your harder-edged Foundation baseline might imply.")
    }

    if (foundation.institutions >= 5.15 && alliance >= 5.2) {
      notes.push("Your institutional baseline stays visible here through coalition endurance and alliance design.")
    } else if (foundation.institutions <= 3.85 && alliance >= 5.2) {
      notes.push("Even with a more skeptical Foundation baseline, security pressure pushes you toward coalition management and exposed-partner reassurance.")
    }

    if (foundation.orderJustice >= 5.15 && legitimacy >= 5.1) {
      notes.push("Compared with the Foundation, this module makes protection and political legitimacy more active constraints.")
    } else if (foundation.orderJustice <= 3.85 && legitimacy <= 4.0) {
      notes.push("This module reinforces a more justice-sensitive baseline rather than pulling you back toward order-first caution.")
    }

    return notes.join(" ")
  },
}

function summarizeSecurityLane(
  laneKey: string,
  scores: Record<string, number>,
  foundation?: DimensionScores,
): ModuleLaneSummary {
  const lane = securityLanes.find((candidate) => candidate.key === laneKey)
  if (!lane) {
    return {
      key: laneKey,
      label: laneKey,
      summary: "This lane does not yet have a defined summary.",
      score: 4,
      lowLabel: "Lower",
      highLabel: "Higher",
    }
  }

  if (laneKey === "deterrence") {
    const activism = scores.activism ?? 4
    const escalation = scores.escalation ?? 4
    let summary = "This lane prefers bounded deterrence over pure signaling or pure restraint."

    if (activism >= 5.2 && escalation >= 5.0) {
      summary =
        "This lane leans toward visible deterrence and earlier pressure when ambiguity itself starts to reward probing."
    } else if (activism <= 3.8) {
      summary =
        "This lane looks first for ceilings, route protection, resilience, and ways to keep coercion from widening into a larger war."
    }

    return {
      key: lane.key,
      label: lane.label,
      summary,
      score: activism,
      lowLabel: lane.lowLabel,
      highLabel: lane.highLabel,
      delta:
        foundation && Math.abs(foundation.restraint - 4) > 0.4
          ? activism >= 5.1 && foundation.restraint >= 5.15
            ? "Harder-edged than your baseline restraint score."
            : activism <= 3.8 && foundation.restraint <= 3.85
              ? "More crisis-limiting than your baseline strategic style."
              : undefined
          : undefined,
    }
  }

  if (laneKey === "alliances") {
    const alliance = scores.alliance ?? 4
    let summary = "This lane favors layered alignment: support where needed, but without assuming every partner fits one template."

    if (alliance >= 5.2) {
      summary =
        "This lane becomes coalition-centered. Exposed allies, reassurance, and partner endurance are part of the security answer itself."
    } else if (alliance <= 3.8) {
      summary =
        "This lane is autonomy-sensitive. It gives smaller and middle powers more room to hedge, diversify, and resist bloc compression."
    }

    return {
      key: lane.key,
      label: lane.label,
      summary,
      score: alliance,
      lowLabel: lane.lowLabel,
      highLabel: lane.highLabel,
      delta:
        foundation && alliance >= 5.2 && foundation.institutions <= 3.85
          ? "More coalition-centered than your baseline institutions score."
          : undefined,
    }
  }

  const legitimacyScore = scores.legitimacy ?? 4
  let summary = "This lane tries to keep order, protection, and political legitimacy in view at the same time."

  if (legitimacyScore >= 5.2) {
    summary =
      "This lane is protection-sensitive. It keeps civilian risk, regional backing, and defensible authority active even when harder action is on the table."
  } else if (legitimacyScore <= 3.8) {
    summary =
      "This lane stays order-first. It sets a higher bar for force when legal authority and precedent are weak."
  }

  return {
    key: lane.key,
    label: lane.label,
    summary,
    score: legitimacyScore,
    lowLabel: lane.lowLabel,
    highLabel: lane.highLabel,
    delta:
      foundation && legitimacyScore >= 5.2 && foundation.orderJustice >= 5.15
        ? "More protection-sensitive than your order-first Foundation baseline."
        : foundation && legitimacyScore <= 3.8 && foundation.orderJustice <= 3.85
          ? "More order-first than your justice-sensitive Foundation baseline."
          : undefined,
  }
}

function compress(value: number) {
  const bounded = Math.max(-1.2, Math.min(1.2, value))
  return Number(bounded.toFixed(2))
}

export const securityOverlayDimensions: readonly DimensionKey[] = [
  "securityCompetition",
  "institutions",
  "normsIdentity",
  "restraint",
  "orderJustice",
] as const
