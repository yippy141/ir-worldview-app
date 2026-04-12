import type {
  ModuleAnalytics,
  ModuleDefinition,
  ModuleLaneSummary,
} from "@/lib/modules/types"
import type { DimensionKey, DimensionScores } from "@/lib/types"

const technologyLanes: ModuleDefinition["lanes"] = [
  {
    key: "controls",
    label: "Controls and dependence",
    description: "How you read chokepoints, openness, restriction, and strategic dependence.",
    scoreKey: "control",
    lowLabel: "Open by default",
    highLabel: "Control-first",
  },
  {
    key: "capacity",
    label: "Capacity and industrial policy",
    description: "How you think durable advantage is built, financed, and distributed.",
    scoreKey: "industrial",
    lowLabel: "Market-led",
    highLabel: "State-capacity led",
  },
  {
    key: "governance",
    label: "Governance, access, and safety",
    description: "How you weigh shared rules, access gaps, deployment limits, and enforceable guardrails.",
    scoreKey: "governance",
    lowLabel: "National tools",
    highLabel: "Coordinated rules",
  },
]

const technologyStandardQuestions: ModuleDefinition["questionsByMode"]["standard"] = [
  {
    id: "chips_controls",
    kind: "case",
    lane: "controls",
    cardType: "decision",
    title: "Semiconductor export controls",
    prompt: "What should carry the most weight first?",
    scene:
      "The United States considers tightening semiconductor controls on China while allies worry about retaliation, fragmentation, and commercial loss. The dispute is not only over scope, but over what export controls are actually supposed to achieve.",
    whyHard:
      "Controls can preserve leverage, but they can also speed up duplication and strain the coalition needed to keep them effective.",
    contextBullets: [
      { label: "Actor / stake", text: "Governments are weighing security advantage against the costs of splitting technology supply chains faster than partners can adapt." },
      { label: "Uncertainty", text: "No one knows whether broader controls preserve leverage or just speed up duplication and bloc hardening." },
    ],
    perspectiveTags: ["major-power", "alliance-manager", "industrial", "export-controls"],
    knowledgeLoad: "medium",
    allowSecondChoiceInAnalyst: true,
    options: [
      {
        id: "preserve_the_chokepoint",
        title: "Protect the chokepoint",
        label:
          "Broad control is justified because letting a rival close the capability gap would reshape the wider strategic balance.",
        signals: { control: 6.3, governance: 3.4, industrial: 5.0, safety: 4.6 },
      },
      {
        id: "coordinate_narrow_controls",
        title: "Coordinate narrow controls",
        label:
          "Controls should stay narrow and coordinated so they do not damage the wider order they are supposed to defend.",
        signals: { control: 5.2, governance: 6.2, industrial: 4.6, safety: 4.8 },
      },
      {
        id: "build_capacity_instead",
        title: "Build capacity first",
        label:
          "The more durable answer is productive depth at home and across partners, not ever-broader restriction by itself.",
        signals: { control: 4.8, governance: 4.8, industrial: 6.3, safety: 4.4 },
      },
      {
        id: "avoid_total_securitization",
        title: "Avoid total securitization",
        label:
          "Turning every technology gap into a security contest can shrink the room for adaptation faster than it solves the underlying problem.",
        signals: { control: 2.9, governance: 4.2, industrial: 3.9, safety: 3.9 },
      },
    ],
  },
  {
    id: "open_weight_models",
    kind: "case",
    lane: "controls",
    cardType: "decision",
    title: "Open-weight frontier models",
    prompt: "What should govern the release decision?",
    scene:
      "A frontier lab can release a powerful open-weight model. Advocates point to research diffusion and broader access; critics warn about misuse, proliferation, and the difficulty of containing highly capable systems once the weights are public.",
    whyHard:
      "The same release can widen innovation and widen misuse at the same time, so the question is which risk should anchor the policy line.",
    contextBullets: [
      { label: "Actor / stake", text: "Labs, governments, researchers, and smaller developers do not bear the gains and risks of release equally." },
      { label: "Uncertainty", text: "It is unclear where targeted openness ends and uncontrolled proliferation begins." },
    ],
    perspectiveTags: ["ai-governance", "research-access", "safety"],
    knowledgeLoad: "low",
    allowSecondChoiceInAnalyst: true,
    options: [
      {
        id: "restrict_above_threshold",
        title: "Restrict above threshold",
        label:
          "Once capability crosses a line, broad release stops being a normal research choice and becomes a misuse and security problem.",
        signals: { control: 5.9, governance: 4.7, industrial: 4.2, safety: 6.4 },
      },
      {
        id: "staged_release_rules",
        title: "Use staged release",
        label:
          "Access can stay broad, but only through common testing, security baselines, and release protocols that others can also adopt.",
        signals: { control: 4.9, governance: 6.1, industrial: 4.4, safety: 5.7 },
      },
      {
        id: "keep_access_broad",
        title: "Keep access broad",
        label:
          "Locking powerful models behind a few firms or governments carries its own political and innovation costs. Openness should remain the default.",
        signals: { control: 2.8, governance: 4.1, industrial: 4.0, safety: 3.2 },
      },
      {
        id: "focus_on_deployer_controls",
        title: "Focus on deployers",
        label:
          "The stronger line is to regulate who deploys high-risk systems and how, rather than treating the weights themselves as the whole problem.",
        signals: { control: 3.9, governance: 5.1, industrial: 4.6, safety: 4.6 },
      },
    ],
  },
  {
    id: "sovereign_stacks",
    kind: "case",
    lane: "controls",
    cardType: "explanation",
    title: "Data localization and sovereign stacks",
    prompt: "What is the strongest reading of why states are building sovereign AI stacks?",
    scene:
      "Governments are choosing between interoperable data rules, local storage mandates, and more sovereign AI stacks. The same move is described by some as necessary risk control and by others as hierarchy management or industrial self-protection.",
    whyHard:
      "A sovereignty move can be about security, development, bargaining power, or domestic politics, and the right explanation changes what policy follows.",
    contextBullets: [
      { label: "Actor / stake", text: "Large and small states do not face the same dependence risks or the same costs of fragmentation." },
      { label: "Uncertainty", text: "It is not obvious whether sovereignty measures reduce exposure or just move dependence into a different layer of the stack." },
    ],
    perspectiveTags: ["developmental", "digital-sovereignty", "state-capacity"],
    knowledgeLoad: "medium",
    allowSecondChoiceInAnalyst: true,
    options: [
      {
        id: "strategic_control_logic",
        title: "It is about control",
        label:
          "The main driver is strategic control over sensitive data, compute, and deployment pathways that states no longer trust outsiders to hold.",
        signals: { control: 6.1, governance: 3.2, industrial: 5.8, safety: 4.5 },
      },
      {
        id: "dependency_management_logic",
        title: "It is about dependence",
        label:
          "The stronger explanation is that states fear being locked into infrastructures they cannot shape when pressure sharpens.",
        signals: { control: 5.6, governance: 4.0, industrial: 5.1, safety: 4.4 },
      },
      {
        id: "development_room_logic",
        title: "It is about development room",
        label:
          "For many states the issue is not strategic closure but building enough local room to avoid permanent digital dependence.",
        signals: { control: 4.2, governance: 4.8, industrial: 5.4, safety: 4.2 },
      },
      {
        id: "fragmentation_cost_logic",
        title: "It is about fragmentation",
        label:
          "The more persuasive reading is that governments are overlearning security language and underestimating the cost of splintering interoperable systems.",
        signals: { control: 3.0, governance: 5.4, industrial: 4.0, safety: 4.1 },
      },
    ],
  },
  {
    id: "fab_resilience",
    kind: "case",
    lane: "capacity",
    cardType: "decision",
    title: "Fab resilience without closing trade",
    prompt: "What should carry the most weight in the resilience strategy?",
    scene:
      "A government deeply dependent on Taiwanese and Korean fabs wants more resilience without collapsing open trade. Officials disagree on whether the answer is duplication at home, allied production networks, portfolio redundancy, or simple restraint against overcorrection.",
    whyHard:
      "Concentration at the frontier is risky, but trying to duplicate everything can be wasteful enough to weaken the capacity you are trying to build.",
    contextBullets: [
      { label: "Actor / stake", text: "The state needs more resilience but cannot cheaply recreate the whole semiconductor stack on its own." },
      { label: "Uncertainty", text: "There is no clean line between prudent redundancy and politically expensive overbuilding." },
    ],
    perspectiveTags: ["industrial", "alliance-manager", "supply-chain"],
    knowledgeLoad: "medium",
    allowSecondChoiceInAnalyst: true,
    options: [
      {
        id: "duplicate_capacity_home",
        title: "Duplicate more at home",
        label:
          "Frontier concentration is itself the vulnerability. Strategic sectors need more domestic slack even when it is expensive.",
        signals: { control: 5.2, governance: 3.8, industrial: 6.1, safety: 4.0 },
      },
      {
        id: "trusted_networks",
        title: "Build trusted networks",
        label:
          "Resilience comes from a broader allied manufacturing map, not every state trying to rebuild the full stack alone.",
        signals: { control: 4.4, governance: 6.0, industrial: 5.0, safety: 4.2 },
      },
      {
        id: "portfolio_depth",
        title: "Build portfolio depth",
        label:
          "The practical answer is redundancy across design tools, packaging, inventories, and inputs rather than one giant reshoring gesture.",
        signals: { control: 4.5, governance: 4.8, industrial: 5.6, safety: 4.1 },
      },
      {
        id: "avoid_overcorrection",
        title: "Avoid overcorrection",
        label:
          "Concentration is risky, but duplicating everything can freeze resources and lock in the wrong industrial bets.",
        signals: { control: 3.0, governance: 4.3, industrial: 3.4, safety: 4.0 },
      },
    ],
  },
  {
    id: "industrial_policy",
    kind: "case",
    lane: "capacity",
    cardType: "explanation",
    title: "AI and industrial policy",
    prompt: "What is the strongest reading of how durable technological advantage is built?",
    scene:
      "Governments are weighing subsidies, public compute, talent pipelines, allied specialization, and strategic autonomy in AI buildout. The disagreement is not just about instruments. It is about what kind of system actually produces durable advantage.",
    whyHard:
      "If you misidentify the engine of advantage, you can spend heavily on the wrong layer of the stack.",
    contextBullets: [
      { label: "Actor / stake", text: "States want frontier capability, but they vary widely in fiscal capacity, scale, and existing ecosystem depth." },
      { label: "Uncertainty", text: "It is unclear whether strategic industries are best built through state direction, market discovery, or coalition specialization." },
    ],
    perspectiveTags: ["industrial", "state-capacity", "alliance-manager"],
    knowledgeLoad: "low",
    allowSecondChoiceInAnalyst: true,
    options: [
      {
        id: "state_buildout_logic",
        title: "State buildout matters most",
        label:
          "Strategic industries do not reliably appear at the needed scale or speed without sustained public direction and infrastructure.",
        signals: { control: 5.1, governance: 4.2, industrial: 6.4, safety: 4.1 },
      },
      {
        id: "specialization_logic",
        title: "Specialization matters most",
        label:
          "The stronger model is interoperable ecosystems across partners, not every country trying to reproduce the whole stack.",
        signals: { control: 4.3, governance: 6.1, industrial: 4.8, safety: 4.2 },
      },
      {
        id: "market_adaptation_logic",
        title: "Market adaptation matters most",
        label:
          "States should set guardrails and basic infrastructure, but heavy planning often freezes the field around political guesses.",
        signals: { control: 3.1, governance: 4.1, industrial: 2.8, safety: 4.0 },
      },
      {
        id: "autonomy_depth_logic",
        title: "Autonomy depth matters most",
        label:
          "Too much dependence on allies or open supply chains creates future vulnerability. Strategic sectors need protected domestic depth.",
        signals: { control: 6.2, governance: 3.0, industrial: 5.9, safety: 4.2 },
      },
    ],
  },
  {
    id: "public_compute",
    kind: "case",
    lane: "capacity",
    cardType: "decision",
    title: "Public compute and access gaps",
    prompt: "What should carry the most weight in the response to access concentration?",
    scene:
      "Universities, startups, and smaller states argue that frontier AI is increasingly shaped by whoever controls the largest compute budgets. Policymakers debate public compute, shared research infrastructure, private scaling, and more development-focused access strategies.",
    whyHard:
      "The frontier is expensive because it is hard, but that does not answer whether concentrated access is merely efficient or politically distorting.",
    contextBullets: [
      { label: "Actor / stake", text: "Access affects who can do research, train talent, and build downstream capability." },
      { label: "Uncertainty", text: "A public-access fix can widen participation, but it may still fall short of what the frontier actually costs." },
    ],
    perspectiveTags: ["developmental", "research", "state-capacity"],
    knowledgeLoad: "low",
    allowSecondChoiceInAnalyst: true,
    options: [
      {
        id: "build_public_compute",
        title: "Build public compute",
        label:
          "If compute stays concentrated in a few private actors, broad research access and public oversight will keep shrinking.",
        signals: { control: 4.2, governance: 5.1, industrial: 6.2, safety: 4.6 },
      },
      {
        id: "share_trusted_infrastructure",
        title: "Share trusted infrastructure",
        label:
          "A network of trusted research clouds can widen access without requiring every state to finance a frontier stack alone.",
        signals: { control: 4.0, governance: 6.1, industrial: 5.0, safety: 4.7 },
      },
      {
        id: "let_private_scale_lead",
        title: "Let private scale lead",
        label:
          "The frontier is expensive because it is genuinely difficult. Heavy public intervention may spread resources thin without matching private speed.",
        signals: { control: 3.2, governance: 4.0, industrial: 2.9, safety: 4.0 },
      },
      {
        id: "treat_access_as_development",
        title: "Treat access as development",
        label:
          "The core issue is not only frontier competition. It is whether poorer states and public institutions are being locked out of the next production stack.",
        signals: { control: 3.8, governance: 5.2, industrial: 5.4, safety: 4.4 },
      },
    ],
  },
  {
    id: "frontier_ai_governance",
    kind: "case",
    lane: "governance",
    cardType: "decision",
    title: "Frontier AI governance",
    prompt: "What should anchor policy first?",
    scene:
      "Frontier AI capabilities are accelerating. Policymakers debate licensing, compute thresholds, open models, and national-security risk. The underlying dispute is over what kind of governance is strong enough to matter before the field outruns it.",
    whyHard:
      "Move too slowly and guardrails arrive after the capabilities that need them. Move too heavily and you risk locking in the wrong institutions or actors.",
    contextBullets: [
      { label: "Actor / stake", text: "States want to manage real risk without handing the field by default to a few governments or firms." },
      { label: "Uncertainty", text: "No one knows whether capability growth will outpace voluntary norms, hard rules, or both." },
    ],
    perspectiveTags: ["ai-governance", "safety", "major-power"],
    knowledgeLoad: "low",
    allowSecondChoiceInAnalyst: true,
    options: [
      {
        id: "use_hard_thresholds",
        title: "Use hard thresholds",
        label:
          "Licensing and compute thresholds are necessary because some risks arrive before markets or informal norms can catch up.",
        signals: { control: 6.0, governance: 4.6, industrial: 4.2, safety: 6.3 },
      },
      {
        id: "govern_with_capable_partners",
        title: "Govern with capable partners",
        label:
          "The strongest path is shared standards and coordinated restrictions among states that can actually enforce them.",
        signals: { control: 5.0, governance: 6.4, industrial: 4.5, safety: 5.6 },
      },
      {
        id: "keep_innovation_open",
        title: "Keep innovation open",
        label:
          "Heavy gating will entrench incumbents and slow useful progress. Safeguards should stay targeted rather than general.",
        signals: { control: 2.9, governance: 4.0, industrial: 4.0, safety: 3.3 },
      },
      {
        id: "treat_capability_as_strategic",
        title: "Treat capability as strategic",
        label:
          "The first priority is national capability. Governance should not become a back door to long-run self-limitation.",
        signals: { control: 5.8, governance: 2.9, industrial: 5.9, safety: 4.3 },
      },
    ],
  },
  {
    id: "military_ai",
    kind: "case",
    lane: "governance",
    cardType: "decision",
    title: "Military AI deployment",
    prompt: "What should carry the most weight in the deployment choice?",
    scene:
      "A defense establishment wants rapid AI deployment despite weak testing standards because it fears a rival will move first. Others argue that once military AI diffuses under unclear thresholds, doctrine, coalition discipline, and accountability may weaken faster than anyone intends.",
    whyHard:
      "Speed and caution are both strategic arguments here, so the choice is not simply innovation versus ethics.",
    contextBullets: [
      { label: "Actor / stake", text: "The decision affects not only one state but also partners that may inherit the doctrine and the operating risk." },
      { label: "Uncertainty", text: "A slower rollout may preserve control, but it may also hand the first-mover advantage to a rival." },
    ],
    perspectiveTags: ["military", "alliance-manager", "safety"],
    knowledgeLoad: "medium",
    allowSecondChoiceInAnalyst: true,
    options: [
      {
        id: "field_quickly",
        title: "Field before the rival sets the baseline",
        label:
          "A military that waits for high confidence may discover that its rival set the operational baseline first.",
        signals: { control: 4.8, governance: 3.9, industrial: 5.2, safety: 3.8 },
      },
      {
        id: "gate_the_fielding",
        title: "Gate deployment through thresholds",
        label:
          "Deployment can continue, but only through staged testing, auditable logs, and hard limits on autonomous action.",
        signals: { control: 5.6, governance: 4.8, industrial: 4.5, safety: 6.2 },
      },
      {
        id: "set_coalition_baselines",
        title: "Set coalition baselines first",
        label:
          "The bigger danger is close partners racing ahead with different thresholds and incompatible doctrine.",
        signals: { control: 4.6, governance: 6.0, industrial: 4.4, safety: 5.5 },
      },
      {
        id: "protect_human_accountability",
        title: "Keep responsibility legible",
        label:
          "The deepest risk is not only technical error but the erosion of responsibility once command decisions become opaque.",
        signals: { control: 4.4, governance: 5.0, industrial: 4.0, safety: 6.0 },
      },
    ],
  },
  {
    id: "digital_development",
    kind: "case",
    lane: "governance",
    cardType: "explanation",
    title: "Digital development without dependency",
    prompt: "What is the strongest reading of the middle-income state's problem?",
    scene:
      "A middle-income state wants AI capacity but worries that both U.S. platforms and Chinese infrastructure create dependency. Policymakers disagree on whether the problem is mainly sovereignty, lock-in, access, or fiscal scale.",
    whyHard:
      "The state needs more capability, but the path that looks cheapest now may deepen the dependence it most wants to avoid later.",
    contextBullets: [
      { label: "Actor / stake", text: "The state cannot finance every layer of the stack, but it still wants room to bargain and adapt." },
      { label: "Uncertainty", text: "It is unclear whether sovereignty, diversification, regional pooling, or simple access is the decisive constraint." },
    ],
    perspectiveTags: ["developmental", "middle-income", "digital-sovereignty"],
    knowledgeLoad: "low",
    allowSecondChoiceInAnalyst: true,
    options: [
      {
        id: "sovereign_capacity_problem",
        title: "It is a sovereignty problem",
        label:
          "The main issue is how to build enough domestic depth in data, talent, and cloud access to reduce future coercive vulnerability.",
        signals: { control: 5.8, governance: 3.3, industrial: 5.8, safety: 4.1 },
      },
      {
        id: "interoperability_problem",
        title: "It is a lock-in problem",
        label:
          "The stronger answer is diversified suppliers and portable standards that keep dependence from hardening into captivity.",
        signals: { control: 4.3, governance: 6.0, industrial: 4.8, safety: 4.3 },
      },
      {
        id: "collective_capacity_problem",
        title: "It is a scale problem",
        label:
          "Shared compute, training, and procurement are the only realistic way for many states to widen room to maneuver.",
        signals: { control: 4.1, governance: 5.6, industrial: 6.0, safety: 4.2 },
      },
      {
        id: "exclusion_problem",
        title: "It is an exclusion problem",
        label:
          "For many states the bigger danger is being left out of the technology shift altogether, not becoming too dependent within it.",
        signals: { control: 2.8, governance: 4.2, industrial: 3.8, safety: 4.0 },
      },
    ],
  },
]

const technologyAnalystAdditions: ModuleDefinition["questionsByMode"]["analyst"] = [
  {
    id: "containment_critique",
    kind: "case",
    lane: "controls",
    cardType: "explanation",
    title: "Containment critique and export controls",
    prompt: "What is the strongest reading of how non-Western governments see the controls debate?",
    scene:
      "A non-Western government hears U.S. officials describe export controls as security policy and Chinese officials describe them as an attempt to freeze hierarchy. Its own policymakers are deciding whether the issue is mainly strategic denial, rule design, hierarchy management, or long-run hedging.",
    whyHard:
      "More than one critique can be true at once, but the main diagnosis determines whether the government narrows cooperation, pushes back, or keeps room to hedge.",
    contextBullets: [
      { label: "Actor / stake", text: "The state wants technology access without becoming permanently subordinate to either camp." },
      { label: "Uncertainty", text: "It is unclear whether controls are a temporary security measure or a more durable hierarchy-preserving strategy." },
    ],
    perspectiveTags: ["nonaligned", "developmental", "export-controls"],
    knowledgeLoad: "medium",
    allowSecondChoiceInAnalyst: true,
    options: [
      {
        id: "strategic_denial_is_real",
        title: "Strategic denial is real",
        label:
          "Some technologies really do alter the balance of power. Governments will act on that whether rivals call it containment or not.",
        signals: { control: 6.0, governance: 3.6, industrial: 5.0, safety: 4.4 },
      },
      {
        id: "rule_design_is_the_issue",
        title: "Rule design is the issue",
        label:
          "Controls become easier to defend when they are narrow, public, and coordinated rather than sprawling and improvised.",
        signals: { control: 5.0, governance: 6.2, industrial: 4.6, safety: 4.6 },
      },
      {
        id: "hierarchy_management_is_real",
        title: "Hierarchy management is real",
        label:
          "The hierarchy critique is partly right: security concerns can be real and still preserve unequal control over technological advancement.",
        signals: { control: 4.2, governance: 4.8, industrial: 5.6, safety: 4.2 },
      },
      {
        id: "nonalignment_will_persist",
        title: "Hedging will persist",
        label:
          "Many states will protect room to maneuver because both camps offer leverage and dependency in different forms.",
        signals: { control: 3.0, governance: 4.6, industrial: 4.6, safety: 4.0 },
      },
    ],
  },
  {
    id: "subsidy_race",
    kind: "case",
    lane: "capacity",
    cardType: "decision",
    title: "Allied subsidy races",
    prompt: "What should carry the most weight when close partners back the same strategic sectors?",
    scene:
      "Close partners are subsidizing the same semiconductor and AI sectors, risking duplication and political backlash. Some see healthy redundancy; others see a preventable race for symbolic industrial wins.",
    whyHard:
      "A bit of redundancy can be useful, but too much turns allied resilience into allied competition for the same bottlenecks.",
    contextBullets: [
      { label: "Actor / stake", text: "Governments want both strategic depth and domestic political credit, even when those goals conflict." },
      { label: "Uncertainty", text: "It is unclear where resilience ends and expensive duplication begins." },
    ],
    perspectiveTags: ["alliance-manager", "industrial", "subsidies"],
    knowledgeLoad: "low",
    allowSecondChoiceInAnalyst: true,
    options: [
      {
        id: "accept_some_duplication",
        title: "Accept some duplication",
        label:
          "Strategic industries are too important to optimize only for efficiency. Some overlap is the price of resilience.",
        signals: { control: 5.0, governance: 3.9, industrial: 5.7, safety: 4.0 },
      },
      {
        id: "negotiate_specialization",
        title: "Negotiate specialization",
        label:
          "Partners gain more from complementary roles than from spending public money to outbid each other in the same sectors.",
        signals: { control: 4.2, governance: 6.3, industrial: 5.0, safety: 4.2 },
      },
      {
        id: "keep_national_depth",
        title: "Keep national depth",
        label:
          "Specialization is useful, but no government wants to discover too late that its most strategic capacity lives abroad.",
        signals: { control: 6.0, governance: 3.2, industrial: 5.8, safety: 4.1 },
      },
      {
        id: "let_market_discipline_sort",
        title: "Let market discipline sort",
        label:
          "Public subsidy races can spend enormous sums on political symbolism while crowding out more adaptive private investment.",
        signals: { control: 3.2, governance: 4.0, industrial: 2.9, safety: 4.0 },
      },
    ],
  },
  {
    id: "incident_reporting",
    kind: "case",
    lane: "governance",
    cardType: "decision",
    title: "Model incidents and mandatory reporting",
    prompt: "What should matter most after a serious model incident?",
    scene:
      "A frontier model contributes to a serious cyber and biosecurity incident. Governments now debate whether reporting should become mandatory, whether sensitive details should stay national, and whether liability should shift toward deployers rather than model developers alone.",
    whyHard:
      "Disclosure can make safety governance real, but it can also expose information that governments and firms do not want to standardize publicly.",
    contextBullets: [
      { label: "Actor / stake", text: "The incident has made the gap between voluntary safety talk and enforceable governance impossible to ignore." },
      { label: "Uncertainty", text: "Too little disclosure preserves opacity; too much may create new security problems or freeze cooperation." },
    ],
    perspectiveTags: ["safety", "regulation", "incident-response"],
    knowledgeLoad: "medium",
    allowSecondChoiceInAnalyst: true,
    options: [
      {
        id: "mandate_shared_reporting",
        title: "Mandate shared reporting",
        label:
          "Serious incidents should trigger common disclosure and audit baselines or governance will remain mostly rhetorical.",
        signals: { control: 4.8, governance: 6.3, industrial: 4.0, safety: 6.0 },
      },
      {
        id: "keep_sensitive_reporting_national",
        title: "Keep sensitive reporting national",
        label:
          "Governments should require reporting, but the most consequential incidents belong in controlled national channels rather than broad shared disclosure.",
        signals: { control: 5.7, governance: 3.8, industrial: 4.0, safety: 5.8 },
      },
      {
        id: "shift_liability_to_deployment",
        title: "Shift liability to deployment",
        label:
          "The better lever is to make downstream deployers bear more responsibility instead of assuming model developers are the only governance choke point.",
        signals: { control: 4.1, governance: 5.2, industrial: 4.4, safety: 5.3 },
      },
      {
        id: "avoid_overgeneralizing_from_one_incident",
        title: "Avoid overgeneralizing",
        label:
          "A serious incident matters, but rushing to one broad reporting regime may harden rules before the causal picture is actually clear.",
        signals: { control: 3.2, governance: 4.2, industrial: 4.1, safety: 4.2 },
      },
    ],
  },
]

export const technologyModule: ModuleDefinition = {
  slug: "technology",
  shortTitle: "Technology",
  title: "Technology, AI, and Geoeconomics",
  subtitle: "Technology controls, industrial policy, and AI governance",
  shorthand: "Tech Power",
  timeEstimate: {
    standard: "8 to 10 minutes",
    analyst: "11 to 14 minutes",
  },
  description:
    "An issue-specific read on chokepoints, industrial capacity, coordinated governance, access gaps, and safety constraints.",
  measures: [
    "openness versus control",
    "market adaptation versus state-capacity building",
    "national tools versus coordinated governance",
    "how explanation cards differ from decision cards when the technology case sharpens",
  ],
  doesNotClaim: [
    "a stable technology identity that overrides the Foundation baseline",
    "a single answer for semiconductors, AI governance, and digital development alike",
    "a measure of technical expertise rather than issue instincts",
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
  lanes: technologyLanes,
  questionsByMode: {
    standard: technologyStandardQuestions,
    analyst: [...technologyStandardQuestions, ...technologyAnalystAdditions],
  },
  interpret(analytics) {
    const { control, governance, industrial, safety } = analytics.scores

    if (control >= 5.5 && industrial >= 5.3) {
      return {
        headline: "Technology read: control with capacity-building",
        summary:
          "You generally believe technological advantage depends on guarding chokepoints, building productive depth, and treating dependence as an exposure to manage.",
        instincts: [
          "You are comfortable using control and industrial policy together.",
          "You treat productive capacity as a strategic asset, not just an economic one.",
          "You are skeptical that open markets alone will preserve a favorable balance.",
        ],
        challenge:
          "This style can normalize broad control measures faster than partners and institutions can absorb them.",
      }
    }

    if (governance >= 5.5) {
      return {
        headline: "Technology read: coordinated governance",
        summary:
          "You generally believe the stronger technology strategy is coordinated rather than purely national: shared standards, narrow controls, and durable alignment among capable partners.",
        instincts: [
          "You prefer tools that partners can actually implement together.",
          "You treat governance capacity as part of strategic power, not a soft add-on.",
          "You look for ways to preserve access selectively rather than abandon it wholesale.",
        ],
        challenge:
          "This style can assume more allied cohesion than actually exists once commercial interests and security priorities split.",
      }
    }

    if (safety >= 5.8) {
      return {
        headline: "Technology read: safety-first constraint",
        summary:
          "You are comparatively willing to slow, gate, or channel frontier systems when safety and security risks begin to outrun existing guardrails.",
        instincts: [
          "You do not treat frontier risk as a side issue to capability growth.",
          "You are skeptical that voluntary norms alone will keep pace with the field.",
          "You prefer enforceable thresholds to vague hope that actors will self-police.",
        ],
        challenge:
          "This style can become too comfortable with central control and understate the innovation cost of broad gating regimes.",
      }
    }

    if (control <= 3.7 && industrial <= 4.0) {
      return {
        headline: "Technology read: openness with targeted safeguards",
        summary:
          "You generally believe over-securitizing technology can do more long-run damage than the risks it is meant to solve, especially when it hardens the field too early.",
        instincts: [
          "You default toward openness with targeted safeguards rather than broad control.",
          "You trust competitive adaptation more than heavy industrial direction.",
          "You worry about regulation entrenching incumbents and shrinking useful experimentation.",
        ],
        challenge:
          "This style can understate how quickly strategic rivals exploit asymmetric openness in critical sectors.",
      }
    }

    return {
      headline: "Technology read: calibrated control by sector",
      summary:
        "You balance openness, control, capacity-building, and governance case by case rather than carrying one fixed doctrine across the whole domain.",
      instincts: [
        "You expect the right answer to shift across semiconductors, frontier AI, and digital development.",
        "You are open to both controls and openness depending on the strategic setting.",
        "You look for selective intervention rather than a fully market-led or fully closed model.",
      ],
      challenge:
        "This style can leave your threshold for harder control or broader openness less explicit than the policy environment may demand.",
    }
  },
  summarizeLanes(analytics, foundation) {
    return [
      summarizeTechnologyLane("controls", analytics.laneScores.controls, foundation),
      summarizeTechnologyLane("capacity", analytics.laneScores.capacity, foundation),
      summarizeTechnologyLane("governance", analytics.laneScores.governance, foundation),
    ]
  },
  summarizeCardTypes(analytics) {
    const explanation = analytics.cardTypeScores.explanation
    const decision = analytics.cardTypeScores.decision

    if (!explanation || !decision) return undefined

    if (explanation.control - decision.control >= 0.65) {
      return {
        headline: "Explanation and Decision",
        summary:
          "You explain technology cases through rivalry and dependence more than you endorse maximal closure once the policy tradeoffs are directly on the table.",
      }
    }

    if (decision.governance - explanation.governance >= 0.65) {
      return {
        headline: "Explanation and Decision",
        summary:
          "You often diagnose the field in strategic terms, but your decision cards still put more weight on coordinated rules and shared standards.",
      }
    }

    if (decision.safety - explanation.safety >= 0.65) {
      return {
        headline: "Explanation and Decision",
        summary:
          "You do not always explain the field through safety first, but your decision cards become much more willing to slow or gate deployment when the consequences sharpen.",
      }
    }

    return {
      headline: "Explanation and Decision",
      summary:
        "Your explanation and decision cards mostly move together. The same technology logic tends to survive when the question shifts from diagnosis to policy choice.",
    }
  },
  buildOverlayDeltas(analytics) {
    const { control, governance, industrial, safety } = analytics.scores

    return {
      securityCompetition: compress((control - 4) * 0.45),
      institutions: compress((governance - 4) * 0.55),
      domesticFilters: compress((industrial - 4) * 0.2),
      politicalEconomy: compress((((control - 4) * 0.45) + ((industrial - 4) * 0.55)) * 0.6),
      restraint: compress((4 - control) * 0.22),
      normsIdentity: compress((((governance - 4) * 0.35) + ((safety - 4) * 0.25)) * 0.25),
    }
  },
  compareToFoundation(analytics, foundation) {
    const notes: string[] = []
    const { control, governance, industrial } = analytics.scores

    if (foundation.politicalEconomy >= 5.15 && industrial >= 5.2) {
      notes.push("This module reinforces a baseline that already treats production, dependence, and economic leverage as strategically central.")
    } else if (foundation.politicalEconomy <= 3.85 && industrial >= 5.2) {
      notes.push("Compared with the Foundation, this module pulls you toward capacity-building and production depth.")
    }

    if (foundation.institutions >= 5.15 && governance <= 4.2) {
      notes.push("Compared with your Foundation profile, this module makes you more comfortable with national tools than coordinated rules.")
    } else if (foundation.institutions < 5 && governance >= 5.4) {
      notes.push("Compared with your Foundation profile, this module pulls you toward shared standards and coordinated governance.")
    }

    if (foundation.restraint >= 5.15 && control >= 5.3) {
      notes.push("Even with a more restrained baseline, technology pressure makes you noticeably more control-oriented.")
    }

    return notes.join(" ")
  },
}

function summarizeTechnologyLane(
  laneKey: string,
  scores: Record<string, number>,
  foundation?: DimensionScores,
): ModuleLaneSummary {
  const lane = technologyLanes.find((candidate) => candidate.key === laneKey)
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

  if (laneKey === "controls") {
    const control = scores.control ?? 4
    let summary = "This lane prefers selective control rather than either broad closure or broad openness."

    if (control >= 5.2) {
      summary =
        "This lane hardens toward chokepoint protection and dependence management. Openness looks fragile when strategic leverage is at stake."
    } else if (control <= 3.8) {
      summary =
        "This lane stays more open by default. It resists treating every technology gap as a reason for broad restriction."
    }

    return {
      key: lane.key,
      label: lane.label,
      summary,
      score: control,
      lowLabel: lane.lowLabel,
      highLabel: lane.highLabel,
      delta:
        foundation && control >= 5.2 && foundation.restraint >= 5.15
          ? "More control-first than your baseline strategic restraint."
          : undefined,
    }
  }

  if (laneKey === "capacity") {
    const industrial = scores.industrial ?? 4
    let summary = "This lane mixes market adaptation with selective public investment."

    if (industrial >= 5.2) {
      summary =
        "This lane is capacity-led. It treats public investment, productive depth, and shared infrastructure as strategic necessities rather than optional economic policy."
    } else if (industrial <= 3.8) {
      summary =
        "This lane is more market-led. It worries that heavy planning can freeze the field around political guesses."
    }

    return {
      key: lane.key,
      label: lane.label,
      summary,
      score: industrial,
      lowLabel: lane.lowLabel,
      highLabel: lane.highLabel,
      delta:
        foundation && industrial >= 5.2 && foundation.politicalEconomy <= 3.85
          ? "More capacity-led than your Foundation's lighter political-economy read."
          : undefined,
    }
  }

  const governance = scores.governance ?? 4
  const safety = scores.safety ?? 4
  let summary = "This lane keeps coordination, access, and safety in the frame at the same time."

  if (governance >= 5.2 && safety >= 5.0) {
    summary =
      "This lane favors shared rules and enforceable guardrails. Access should stay open enough to matter, but not so open that governance becomes ceremonial."
  } else if (governance <= 3.8) {
    summary =
      "This lane is more national and tool-specific. It doubts that slow or weak coordination can keep pace with the field."
  }

  return {
    key: lane.key,
    label: lane.label,
    summary,
    score: governance,
    lowLabel: lane.lowLabel,
    highLabel: lane.highLabel,
    delta:
      foundation && governance >= 5.2 && foundation.institutions <= 3.85
        ? "More coordination-minded than your more skeptical Foundation baseline."
        : undefined,
  }
}

function compress(value: number) {
  const bounded = Math.max(-1.2, Math.min(1.2, value))
  return Number(bounded.toFixed(2))
}

export const technologyOverlayDimensions: readonly DimensionKey[] = [
  "securityCompetition",
  "institutions",
  "domesticFilters",
  "politicalEconomy",
  "restraint",
  "normsIdentity",
] as const
