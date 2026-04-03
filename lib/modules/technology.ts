import type { ModuleDefinition } from "@/lib/modules/types"

const technologyStandardQuestions: ModuleDefinition["questionsByMode"]["standard"] = [
  {
    id: "chips_controls",
    title: "Semiconductor export controls",
    prompt:
      "The United States considers tightening semiconductor controls on China while allies worry about fragmentation, retaliation, and commercial cost. What is the strongest framing?",
    primer:
      "This case asks what should drive the strategy first: preserving chokepoints, coordinating rules, building capacity, or keeping more of the system open.",
    options: [
      {
        id: "chokepoint",
        title: "Preserve the chokepoint",
        label:
          "Broad controls are justified because losing the technological edge would reshape the wider strategic balance.",
        signals: { control: 6.3, governance: 3.4, industrial: 5.0, safety: 4.7 },
      },
      {
        id: "coordinated_controls",
        title: "Keep controls narrow and coordinated",
        label:
          "Controls should be tightly scoped and built through allied coordination so they do not damage the wider order they are meant to defend.",
        signals: { control: 5.3, governance: 6.2, industrial: 4.6, safety: 4.9 },
      },
      {
        id: "capacity",
        title: "Build productive capacity first",
        label:
          "The longer-run answer is domestic and allied manufacturing depth. Controls matter less than who can still make the critical things.",
        signals: { industrial: 6.4, control: 4.9, governance: 4.8 },
      },
      {
        id: "openness",
        title: "Do not securitize everything",
        label:
          "Turning every technological gap into a security contest hardens rivalry, raises costs, and shrinks room for adaptation.",
        signals: { control: 2.9, governance: 4.2, safety: 3.8 },
      },
    ],
  },
  {
    id: "fab_vulnerability",
    title: "Supply-chain vulnerability around leading-edge fabs",
    prompt:
      "A government deeply dependent on Taiwanese and Korean fabs wants more resilience without collapsing open trade. What is the strongest framing?",
    primer:
      "This asks whether resilience comes mainly from duplication, allied production networks, portfolio depth, or avoiding overreaction.",
    options: [
      {
        id: "duplicate_capacity",
        title: "Duplicate more capacity at home",
        label:
          "Concentration at the frontier is itself the vulnerability. Strategic sectors need more domestic slack even if it is expensive.",
        signals: { industrial: 6.1, control: 5.2, governance: 3.8 },
      },
      {
        id: "friendly_networks",
        title: "Build trusted production networks",
        label:
          "Resilience comes from a broader allied manufacturing map, not every state trying to recreate the entire stack on its own.",
        signals: { governance: 6.0, industrial: 5.0, control: 4.5 },
      },
      {
        id: "portfolio",
        title: "Diversify design, inputs, and shock absorption",
        label:
          "The practical answer is redundancy across inventory, design tools, and packaging rather than a single dramatic reshoring push.",
        signals: { industrial: 5.5, control: 4.6, governance: 4.8, safety: 4.2 },
      },
      {
        id: "dont_overcorrect",
        title: "Do not overcorrect from dependence to waste",
        label:
          "Concentration is risky, but duplicating everything is too costly and may freeze the very innovation you are trying to protect.",
        signals: { control: 3.0, industrial: 3.4, governance: 4.3 },
      },
    ],
  },
  {
    id: "frontier_ai",
    title: "Frontier AI governance",
    prompt:
      "Frontier AI capabilities are accelerating. Policymakers debate licensing, compute thresholds, open models, and national-security risk. What is the strongest framing?",
    primer:
      "This asks what should anchor policy first: safety controls, allied governance, openness, or national capability.",
    options: [
      {
        id: "thresholds",
        title: "Use hard capability thresholds",
        label:
          "Licensing and compute thresholds are necessary because some risks arrive before markets or informal norms can catch up.",
        signals: { safety: 6.4, control: 6.1, governance: 4.6 },
      },
      {
        id: "allied_governance",
        title: "Govern with capable partners",
        label:
          "The strongest path is shared standards, common safety baselines, and coordinated restrictions among states that can actually enforce them.",
        signals: { governance: 6.4, safety: 5.7, control: 5.1 },
      },
      {
        id: "open_default",
        title: "Keep innovation open by default",
        label:
          "Heavy gating will entrench incumbents and slow useful progress. Use targeted safeguards rather than a general frontier veto.",
        signals: { control: 2.9, safety: 3.3, industrial: 3.8 },
      },
      {
        id: "capability_race",
        title: "Treat capability as a strategic race",
        label:
          "The first priority is ensuring national capability. Safety matters, but not in ways that lock in long-run disadvantage.",
        signals: { industrial: 6.0, control: 5.8, governance: 2.8, safety: 4.4 },
      },
    ],
  },
  {
    id: "open_models",
    title: "Open-weight frontier models",
    prompt:
      "A frontier lab can release a powerful open-weight model. Advocates cite diffusion and research access; critics cite misuse and proliferation. What is the strongest framing?",
    primer:
      "This asks how you weigh diffusion, safety, standards, and access when the same model can widen innovation and misuse at once.",
    options: [
      {
        id: "restrict_release",
        title: "Restrict release above a capability threshold",
        label:
          "Once a model crosses a certain line, broad release becomes a security and misuse problem rather than a normal open-science decision.",
        signals: { safety: 6.4, control: 5.9, governance: 4.8 },
      },
      {
        id: "staged_release",
        title: "Use staged release with shared standards",
        label:
          "Access can remain broad, but only through common testing, security baselines, and release protocols that other labs can also adopt.",
        signals: { governance: 6.0, safety: 5.6, control: 4.9 },
      },
      {
        id: "open_research",
        title: "Keep research access broad",
        label:
          "Locking models behind a few firms or governments carries its own political and innovation costs. Openness should remain the default.",
        signals: { control: 2.8, safety: 3.3, industrial: 4.1 },
      },
      {
        id: "access_equity",
        title: "Do not let safety become incumbency protection",
        label:
          "A blanket closure regime can widen the gap between wealthy firms and everyone else while still failing to solve the hardest misuse risks.",
        signals: { governance: 4.9, industrial: 4.8, control: 3.4, safety: 4.0 },
      },
    ],
  },
  {
    id: "industrial_policy",
    title: "AI and industrial policy",
    prompt:
      "Governments weigh subsidies, public compute, talent pipelines, allied specialization, and strategic autonomy in AI buildout. What is the strongest framing?",
    primer:
      "This asks how advantage is really built over time: markets, states, alliances, or protected stacks.",
    options: [
      {
        id: "state_buildout",
        title: "Use state-backed buildout",
        label:
          "Large public investment is justified because strategic industries do not reliably emerge at the needed scale or speed on their own.",
        signals: { industrial: 6.4, control: 5.2, governance: 4.2 },
      },
      {
        id: "specialization",
        title: "Specialize across allies",
        label:
          "The stronger path is interoperable ecosystems across partners, not every country trying to replicate the whole stack.",
        signals: { governance: 6.1, industrial: 4.8, control: 4.4 },
      },
      {
        id: "market",
        title: "Let firms and markets adapt",
        label:
          "States should set broad guardrails and basic infrastructure, but heavy industrial planning usually locks in the wrong bets.",
        signals: { industrial: 2.8, control: 3.2, governance: 4.1 },
      },
      {
        id: "autonomy",
        title: "Protect strategic autonomy",
        label:
          "Too much dependence on allies or open supply chains creates future vulnerability. Strategic sectors need protected domestic depth.",
        signals: { control: 6.2, industrial: 5.9, governance: 3.0 },
      },
    ],
  },
  {
    id: "data_governance",
    title: "Data localization and sovereign AI stacks",
    prompt:
      "Governments are choosing between interoperable data rules, local storage mandates, and sovereign AI stacks. What is the strongest framing?",
    primer:
      "This case asks how to weigh interoperability, safety, autonomy, and development needs when data policy becomes industrial policy.",
    options: [
      {
        id: "interoperability",
        title: "Keep interoperable rules at the center",
        label:
          "Cross-border compatibility matters because fragmented data regimes raise costs and weaken common standards without guaranteeing safety.",
        signals: { governance: 6.2, control: 4.5, safety: 4.9 },
      },
      {
        id: "sovereign_stack",
        title: "Build a sovereign stack where it matters",
        label:
          "Strategic sectors need national control over sensitive data, compute, and downstream deployment even if that narrows interoperability.",
        signals: { control: 6.1, industrial: 5.8, governance: 3.0 },
      },
      {
        id: "sectoral",
        title: "Localize only by sector and risk",
        label:
          "The right answer is not blanket localization, but tighter control over the domains where exposure carries real safety or security cost.",
        signals: { safety: 5.6, control: 5.0, governance: 4.4 },
      },
      {
        id: "development",
        title: "Keep access open enough for development",
        label:
          "Many states still need outside infrastructure, models, and markets. A sovereignty model built for large powers will not fit everyone.",
        signals: { control: 2.9, industrial: 4.2, governance: 4.7 },
      },
    ],
  },
  {
    id: "compute_access",
    title: "Public compute and access gaps",
    prompt:
      "Universities and smaller states argue that frontier AI is being shaped by whoever controls the largest compute budgets. What is the strongest framing?",
    primer:
      "This asks whether the answer is public capacity, allied sharing, market scaling, or a broader development lens.",
    options: [
      {
        id: "public_compute",
        title: "Build public compute capacity",
        label:
          "If compute remains fully concentrated in a few private actors, public oversight and broad research access will keep shrinking.",
        signals: { industrial: 6.3, governance: 5.0, safety: 4.8 },
      },
      {
        id: "shared_clouds",
        title: "Share research infrastructure across partners",
        label:
          "A network of trusted research clouds can widen access without each state trying to finance a frontier stack alone.",
        signals: { governance: 6.1, industrial: 5.1, safety: 4.9 },
      },
      {
        id: "market_scale",
        title: "Private scale still matters most",
        label:
          "The frontier is expensive because it is hard. Heavy public intervention may spread resources thin without matching private innovation speed.",
        signals: { industrial: 2.9, control: 3.3, safety: 4.0 },
      },
      {
        id: "access_gap",
        title: "Access gaps are geopolitical too",
        label:
          "Who gets compute shapes who can do research, train talent, and build downstream capability. That is also a strategic distribution question.",
        signals: { industrial: 5.4, governance: 4.8, control: 3.8, safety: 4.2 },
      },
    ],
  },
  {
    id: "synthesis",
    kind: "synthesis",
    title: "Cross-case synthesis",
    prompt: "Across these cases, what matters most for long-run technological advantage?",
    primer:
      "This final question is meant to pull out the logic that keeps reappearing across controls, AI governance, and industrial policy.",
    options: [
      {
        id: "chokepoints",
        title: "Control key chokepoints",
        label:
          "Who controls the hard bottlenecks in compute, chips, and infrastructure sets the terms of competition.",
        signals: { control: 6.3, industrial: 5.0, governance: 3.8 },
      },
      {
        id: "capacity",
        title: "Build productive capacity",
        label:
          "States and coalitions that can finance, build, and scale the stack over time will shape the field.",
        signals: { industrial: 6.4, control: 5.0, governance: 4.8 },
      },
      {
        id: "governance",
        title: "Align rules among capable partners",
        label:
          "Shared standards and aligned restrictions matter because fragmented policy burns leverage and trust.",
        signals: { governance: 6.4, safety: 5.0, control: 4.8 },
      },
      {
        id: "safety",
        title: "Keep frontier risk bounded",
        label:
          "The decisive question is whether safety and security constraints remain strong enough to keep capability races politically sustainable.",
        signals: { safety: 6.4, governance: 5.0, control: 5.3 },
      },
    ],
  },
]

const technologyAnalystAdditions: ModuleDefinition["questionsByMode"]["analyst"] = [
  {
    id: "containment_critique",
    title: "Containment critique and export controls",
    prompt:
      "A non-Western government hears U.S. officials describe export controls as security policy and PRC officials describe them as an attempt to freeze hierarchy. What is the strongest framing?",
    primer:
      "This asks whether the best answer is strategic denial, narrow rule-setting, critique of hierarchy, or selective nonalignment.",
    allowSecondChoiceInAnalyst: true,
    options: [
      {
        id: "strategic_denial",
        title: "Strategic denial is sometimes necessary",
        label:
          "Some technologies really do alter the balance of power. Governments will act on that whether rivals call it containment or not.",
        signals: { control: 6.1, industrial: 5.1, governance: 3.6 },
      },
      {
        id: "narrow_rules",
        title: "The answer is narrower, clearer rules",
        label:
          "Controls are easier to defend when they are specific, publicly justified, and coordinated rather than sprawling and improvised.",
        signals: { governance: 6.2, control: 5.0, safety: 4.8 },
      },
      {
        id: "hierarchy_critique",
        title: "The hierarchy critique is partly right",
        label:
          "Controls can preserve real security interests and still entrench existing technological hierarchy. Both claims can be true at once.",
        signals: { industrial: 5.6, governance: 4.8, control: 4.1 },
      },
      {
        id: "nonalignment",
        title: "Smaller states will protect room to maneuver",
        label:
          "Many states will resist choosing a permanent technological camp if both camps increase dependence in different ways.",
        signals: { control: 3.0, governance: 4.5, industrial: 4.6 },
      },
    ],
  },
  {
    id: "military_ai",
    title: "Military AI deployment under uncertainty",
    prompt:
      "A defense establishment wants rapid AI deployment despite weak testing standards because it fears a rival will move first. What is the strongest framing?",
    primer:
      "This case asks how you balance deployment speed, enforceable safeguards, coalition discipline, and human accountability in a military setting.",
    allowSecondChoiceInAnalyst: true,
    options: [
      {
        id: "deploy_fast",
        title: "Field quickly and learn in practice",
        label:
          "A state that waits for perfect confidence may discover that its rival defined the operational baseline first.",
        signals: { safety: 3.8, control: 4.8, industrial: 5.3 },
      },
      {
        id: "gated_fielding",
        title: "Use gated fielding with hard red lines",
        label:
          "Deployment can continue, but only through staged testing, auditable logs, and clear limits on autonomous action.",
        signals: { safety: 6.2, control: 5.7, governance: 4.8 },
      },
      {
        id: "coalition_norms",
        title: "Set coalition baselines before diffusion",
        label:
          "Military adoption becomes more dangerous when close partners are racing under different thresholds and doctrine.",
        signals: { governance: 6.1, safety: 5.5, control: 4.7 },
      },
      {
        id: "human_accountability",
        title: "Keep meaningful human accountability central",
        label:
          "The deepest risk is not just technical failure but the erosion of responsibility once command decisions become opaque.",
        signals: { safety: 6.0, governance: 5.0, control: 4.5 },
      },
    ],
  },
  {
    id: "subsidy_race",
    title: "Allied subsidy races",
    prompt:
      "Close partners are subsidizing the same semiconductor and AI sectors, risking duplication and political backlash. What is the strongest framing?",
    primer:
      "This asks whether healthy rivalry, negotiated specialization, national depth, or market discipline is the better answer when allies all want the same strategic industries.",
    allowSecondChoiceInAnalyst: true,
    options: [
      {
        id: "accept_race",
        title: "Some duplication is the price of resilience",
        label:
          "Strategic industries are too important to optimize only for efficiency. A bit of redundancy is worth the cost.",
        signals: { industrial: 5.7, control: 5.0, governance: 3.9 },
      },
      {
        id: "specialize",
        title: "Negotiate specialization early",
        label:
          "Allies gain more from agreeing on complementary roles than from spending public money to outbid each other in the same bottlenecks.",
        signals: { governance: 6.3, industrial: 5.0, control: 4.2 },
      },
      {
        id: "national_depth",
        title: "Each state still needs real domestic depth",
        label:
          "Specialization is useful, but no government wants to discover too late that its most strategic capacity lives abroad.",
        signals: { control: 6.0, industrial: 5.8, governance: 3.2 },
      },
      {
        id: "market_discipline",
        title: "Let market discipline sort it out",
        label:
          "Public subsidy races can spend vast sums on political symbolism while crowding out more adaptive private investment.",
        signals: { industrial: 2.9, control: 3.2, governance: 4.0 },
      },
    ],
  },
  {
    id: "digital_development",
    title: "Digital development without dependency",
    prompt:
      "A middle-income state wants AI capacity but worries that both U.S. platforms and Chinese infrastructure create dependency. What is the strongest framing?",
    primer:
      "This asks whether the answer is sovereign stacks, diversified interoperability, public-capacity coalitions, or simple openness to the cheapest option.",
    allowSecondChoiceInAnalyst: true,
    options: [
      {
        id: "sovereign_capacity",
        title: "Build sovereign capacity where you can",
        label:
          "Even partial domestic depth in cloud, data, and talent can reduce vulnerability to future pressure from larger powers.",
        signals: { control: 5.9, industrial: 5.9, governance: 3.1 },
      },
      {
        id: "diversify",
        title: "Diversify and keep interfaces interoperable",
        label:
          "Total autonomy is unrealistic for many states. The better answer is diversified suppliers and portable standards that reduce lock-in.",
        signals: { governance: 6.0, control: 4.4, industrial: 4.8 },
      },
      {
        id: "public_capacity",
        title: "Build capacity through public or regional coalitions",
        label:
          "Shared compute, training, and procurement can widen room to maneuver for states that cannot finance the frontier alone.",
        signals: { industrial: 6.1, governance: 5.6, control: 4.2 },
      },
      {
        id: "cheapest_access",
        title: "Take the cheapest path to access",
        label:
          "For many states, the bigger danger is exclusion from the technology shift rather than dependence within it.",
        signals: { control: 2.8, industrial: 3.8, governance: 4.1 },
      },
    ],
  },
]

export const technologyModule: ModuleDefinition = {
  slug: "technology",
  shortTitle: "Technology",
  title: "Technology, AI, and Geoeconomics",
  timeEstimate: {
    standard: "7 to 9 minutes",
    analyst: "11 to 14 minutes",
  },
  description:
    "A beta module on export controls, AI governance, industrial policy, openness, and strategic dependence.",
  measures: [
    "openness versus control",
    "innovation speed versus safety and security constraint",
    "market dynamism versus industrial policy",
    "national strategy versus coordinated governance",
  ],
  axes: [
    {
      key: "control",
      label: "Control posture",
      lowLabel: "Open",
      highLabel: "Control-first",
    },
    {
      key: "governance",
      label: "Governance lens",
      lowLabel: "National",
      highLabel: "Coordinated",
    },
    {
      key: "industrial",
      label: "Industrial lens",
      lowLabel: "Market-led",
      highLabel: "State-capacity led",
    },
    {
      key: "safety",
      label: "AI risk lens",
      lowLabel: "Innovation-first",
      highLabel: "Safety-constrained",
    },
  ],
  questionsByMode: {
    standard: technologyStandardQuestions,
    analyst: [...technologyStandardQuestions, ...technologyAnalystAdditions],
  },
  interpret(scores) {
    const control = scores.control
    const governance = scores.governance
    const industrial = scores.industrial
    const safety = scores.safety

    if (control >= 5.6 && industrial >= 5.3) {
      return {
        headline: "Strategic control builder",
        summary:
          "You think technological advantage depends on guarding chokepoints, building capacity, and treating interdependence as an exposure to manage.",
        instincts: [
          "You are comfortable using control, restriction, and industrial policy together.",
          "You treat productive capacity as a strategic asset, not just an economic one.",
          "You are skeptical that open markets alone will preserve a favorable balance.",
        ],
        challenge:
          "This style can normalize broad control measures faster than institutions and partners can absorb them, raising fragmentation risk.",
      }
    }

    if (governance >= 5.6) {
      return {
        headline: "Alliance-governance coordinator",
        summary:
          "You think the stronger technological strategy is coordinated rather than purely national: narrow controls, shared standards, and durable alignment among capable partners.",
        instincts: [
          "You prefer strategies that partners can implement together over dramatic unilateral moves.",
          "You treat governance capacity as part of strategic power, not a soft add-on.",
          "You look for ways to preserve openness selectively rather than abandon it wholesale.",
        ],
        challenge:
          "This style can assume more allied cohesion than actually exists when commercial interests and security priorities begin to split.",
      }
    }

    if (safety >= 5.8) {
      return {
        headline: "Safety-first technology governor",
        summary:
          "You are comparatively willing to slow or channel frontier development when safety and security risks begin to outrun existing guardrails.",
        instincts: [
          "You treat legitimacy and control over frontier risk as strategic assets in their own right.",
          "You are skeptical that voluntary norms alone will keep pace with capability growth.",
          "You prefer enforceable thresholds to vague hope that actors will self-police.",
        ],
        challenge:
          "This style can become too comfortable with central control and underestimate the innovation cost of broad gating regimes.",
      }
    }

    if (control <= 3.6 && industrial <= 4.0) {
      return {
        headline: "Innovation-first openness advocate",
        summary:
          "You think over-securitizing technology can do more long-run damage than the risks it is supposed to solve, especially when it freezes adaptation.",
        instincts: [
          "You default toward openness with targeted safeguards rather than broad control.",
          "You trust competitive adaptation more than heavy industrial direction.",
          "You worry about regulation hardening incumbents and shrinking useful experimentation.",
        ],
        challenge:
          "This style can underrate how quickly strategic rivals exploit asymmetric openness in critical sectors.",
      }
    }

    return {
      headline: "Conditional techno-strategist",
      summary:
        "You are balancing openness, control, industrial capacity, and risk management case by case rather than carrying one fixed doctrine across the whole domain.",
      instincts: [
        "You expect the right balance to shift across semiconductors, frontier AI, and industrial policy.",
        "You are open to both controls and openness depending on the strategic setting.",
        "You look for selective intervention rather than a fully market-led or fully nationalized model.",
      ],
      challenge:
        "This style can leave your threshold for harder control or broader openness less explicit than the policy environment may demand.",
    }
  },
  compareToFoundation(scores, foundation) {
    const notes: string[] = []

    if (foundation.politicalEconomy >= 5.15 && scores.industrial >= 5.2) {
      notes.push("This module reinforces a foundation that already treats production and dependence as strategically important.")
    }

    if (foundation.institutions >= 5.15 && scores.governance <= 4.2) {
      notes.push("Compared with your foundation profile, this module makes you more comfortable with national or unilateral tools than coordinated rules.")
    } else if (foundation.institutions < 5 && scores.governance >= 5.4) {
      notes.push("Compared with your foundation profile, this module pulls you toward coordinated governance and shared standards.")
    }

    if (foundation.restraint >= 5.15 && scores.control >= 5.4) {
      notes.push("Even with a more restrained foundation, you become more control-oriented when technology and dependence are on the table.")
    }

    return notes.join(" ")
  },
}
