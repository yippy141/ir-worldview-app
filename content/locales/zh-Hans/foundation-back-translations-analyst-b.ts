import type { FoundationBackTranslationRecord } from "@/content/locales/zh-Hans/foundation-types"

export const zhHansFoundationAnalystBackTranslationsB = [
  {
    questionId: "an_tradeoff_evidence",
    backTranslation: {
      prompt: "When information in a crisis conflicts, which type of evidence should be trusted first?",
      helpText: "Choose the basis for judgment you would use first.",
      options: [
        { id: "capabilities", title: "Actual capability and military posture", label: "When deployments, readiness posture, and shifts in hard power conflict with other signals, give the former more weight." },
        { id: "commitments", title: "Institutional constraints and existing commitments", label: "Treaty compliance, verification, and crisis rules change incentives and raise the cost of bluffing, so they are more informative." },
        { id: "coalitions", title: "Whether domestic politics can provide sustained support", label: "Ask whether leaders have enough political coalition, fiscal capacity, and public room to sustain their current policy." },
        { id: "status", title: "Status claims and relationship signals", label: "Changes in status claims, recognition disputes, and political language can alter the meaning of an action before capabilities change." },
      ],
    },
  },
  {
    questionId: "an_tradeoff_tech_order",
    backTranslation: {
      prompt: "A group of states plans to respond to a rival through export controls, investment-security review, and coordination on technical standards. What problem is the package mainly addressing?",
      helpText: "Choose the explanation that best captures the whole package.",
      clarification: {
        whatItAsks: "Is the core aim to slow the rival, control key nodes, confine security rules to what is necessary, or avoid a new international hierarchy?",
        terms: [
          { term: "Export controls", definition: "Policy rules that restrict the sale of sensitive products or technologies to specified foreign parties." },
          { term: "Investment-security review", definition: "Government review of foreign investment transactions that may create security or strategic risks." },
          { term: "Technical-standards coordination mechanism", definition: "An arrangement in which some states or firms coordinate technical rules without waiting for global agreement." },
        ],
      },
      options: [
        { id: "edge", title: "Slow the rival's industrial upgrading", label: "The central purpose is to slow the rival in sectors that support military and industrial strength." },
        { id: "chokepoints", title: "Control irreplaceable key nodes", label: "The underlying issue is who controls supply bottlenecks, data, and standards that other states cannot easily replace." },
        { id: "narrow", title: "Keep security rules within necessary limits", label: "Use narrowly scoped allied rules to protect security while avoiding damage to the wider international system." },
        { id: "hierarchy", title: "Do not create a new hierarchy", label: "The risk is that a few leading states set the rules while others can only accept them and bear most of the costs." },
      ],
    },
  },
  {
    questionId: "an_case_middle_power",
    backTranslation: {
      prompt: "A middle-power state relies on one side for security and the other for trade. From that state's perspective, which approach is most reasonable?",
      helpText: "Answer from the state's strategic position.",
      options: [
        { id: "shield", title: "Lock in the security guarantee early", label: "Clearly rely on the existing security partner before a crisis forces the choice on worse terms." },
        { id: "hedge", title: "Hedge strategically and diversify risk", label: "Spread risk across multiple markets, partners, and supply lines to preserve room for independent choice." },
        { id: "peers", title: "Join other middle powers to shape rules", label: "Cooperation among similarly placed states can increase bargaining space and resist pressure from great-power blocs." },
        { id: "extract", title: "Turn a pivotal position into leverage", label: "Do not choose sides early; use the fact that both sides court the state to obtain concessions." },
      ],
    },
  },
  {
    questionId: "an_case_green_finance",
    backTranslation: {
      prompt: "A lower-income state can obtain green finance but must accept specified procurement and reform conditions. From the borrower's perspective, what matters most?",
      helpText: "Answer from the borrowing state's policy position.",
      options: [
        { id: "stabilize", title: "Obtain funds and stabilize public finances first", label: "Access to finance and policy credibility should come first; bargaining space is limited under severe fiscal pressure." },
        { id: "space", title: "Preserve policy and development space", label: "Ask whether the conditions create long-term dependence and weaken local industry." },
        { id: "bloc", title: "Bargain jointly with other borrowers", label: "States facing the same terms usually have more leverage negotiating together than accepting terms one by one." },
        { id: "home", title: "First examine how gains and losses are distributed at home", label: "Even a fair external package cannot be implemented if the distribution of domestic winners and losers prevents sustained support." },
      ],
    },
  },
  {
    questionId: "an_case_maritime_crisis",
    backTranslation: {
      prompt: "An ally makes risky probes in disputed waters and asks this state for public backing. What factor should matter most in the response?",
      helpText: "Choose the primary basis for the policy response.",
      options: [
        { id: "deter", title: "Maintain the credibility of deterrence", label: "Publicly standing with the ally can deter the rival from further testing the alliance commitment." },
        { id: "entrapment", title: "Avoid being dragged into conflict by the ally", label: "The greater risk is that the ally's local gamble pulls the state into an escalating conflict." },
        { id: "offramp", title: "Arrange a route to de-escalation for both sides", label: "Prioritize monitoring, crisis-communication rules, and quiet bargaining so both sides have room to step back." },
        { id: "ally_politics", title: "Assess the ally's domestic political motives", label: "Before backing the action, determine whether the probe is driven by domestic political weakness or elite competition in the ally." },
      ],
    },
  },
  {
    questionId: "an_case_digital_stack",
    backTranslation: {
      prompt: "A government must choose between a low-cost foreign digital infrastructure package and a more expensive allied option. What should be the main basis for the choice?",
      helpText: "Consider long-term risk, not only the initial purchase price.",
      clarification: {
        whatItAsks: "Should the government first guard against system-security risk, hard-to-reverse dependence, incompatibility with partners, or loss of autonomy through bloc choice?",
        terms: [
          { term: "Digital stack", definition: "The combined hardware, software, cloud services, and technical standards supporting a digital system." },
          { term: "Interoperability", definition: "The ability of systems from different countries or suppliers to connect reliably and operate together." },
        ],
      },
      options: [
        { id: "security", title: "Security of critical systems", label: "If the allied option reduces the chance that a rival could later coerce or disable critical systems, the extra cost is worth paying." },
        { id: "dependence", title: "Long-term dependence and control of standards", label: "Once the system is hard to replace, ask who controls maintenance, standards, and irreplaceable key components." },
        { id: "interoperability", title: "Interoperability with partners", label: "The choice should fit common rules among trusted partners and allow systems to coordinate technically." },
        { id: "autonomy", title: "Avoid bloc lock-in", label: "If every digital choice becomes a bloc label, national autonomy will narrow and division will deepen." },
      ],
    },
  },
  {
    questionId: "an_tradeoff_parallel_order",
    backTranslation: {
      prompt: "Rising powers build alternative banks, payment systems, and development-cooperation platforms. Why are these alternatives attractive?",
      helpText: "Choose the source of their appeal, not how you think reform should proceed.",
      options: [
        { id: "reform", title: "The old governance arrangements stopped adapting", label: "Existing international institutions have not given rising states enough voice, protection, or agenda-setting authority." },
        { id: "power", title: "The distribution of power changed first", label: "Conflict over institutions and rules is the expression within international arrangements of a deeper shift in power." },
        { id: "hierarchy", title: "They provide choices outside the established hierarchy", label: "Alternative institutions let states bypass credit, payment, and development-finance channels dominated by others." },
        { id: "legitimation", title: "They display autonomous status at home and abroad", label: "Building alternatives lets leaders show domestic audiences and partners that their state is not permanently trapped in systems dominated by others." },
      ],
    },
  },
  {
    questionId: "an_case_sanctions_alignment",
    backTranslation: {
      prompt: "A nonaligned state opposes aggression, but its cheap energy and fertilizer come mainly from the aggressor. From that state's perspective, what consideration is most reasonable?",
      helpText: "Answer from the constraints on that state's policy.",
      options: [
        { id: "norm", title: "Bear the cost and defend the rule against conquest", label: "To make its opposition to aggression credible, the state may have to uphold the common rule even when costs appear." },
        { id: "stability", title: "Protect domestic stability first", label: "First secure energy, food, and the domestic coalition; a government cannot sustain a foreign-policy line that destroys its domestic base of support." },
        { id: "diversify", title: "Use the crisis to diversify sources", label: "Gradually reduce structural dependence while avoiding a hurried move into a new one-sided dependence." },
        { id: "hedge", title: "Condemn aggression while preserving room for strategic hedging", label: "The state can oppose a breach of the rules without becoming the implementing arm of another state's broader strategy." },
      ],
    },
  },
  {
    questionId: "an_case_intervention_memory",
    backTranslation: {
      prompt: "A neighboring state carries out severe repression and calls arise for military intervention. How might a state with a colonial history view the matter?",
      helpText: "Choose the most persuasive judgment from that government's perspective.",
      options: [
        { id: "shield", title: "Do not lower the threshold for intervention easily", label: "Intervention has never been applied equally, so weaker states cannot regard it as an impartial rule." },
        { id: "threshold", title: "Mass killing may create a genuine exception", label: "Strong protection of sovereignty does not mean outside action must always be rejected in the face of extreme atrocity." },
        { id: "regional", title: "Regional backing is the key test", label: "An exception has a stronger case when neighboring states jointly define its aims and limits rather than distant powers framing it alone." },
        { id: "aftermath", title: "Assess what happens after intervention", label: "Ask whether outside force will protect people or deepen collapse and external control." },
      ],
    },
  },
  {
    questionId: "an_case_rising_power_voice",
    backTranslation: {
      prompt: "A rising power seeks a greater voice in global rules while also expanding its military reach. Which reading is most persuasive?",
      helpText: "Choose the explanation with the most force, not your preferred response.",
      options: [
        { id: "security_transition", title: "This is mainly a power transition", label: "As the old arrangements become less favorable, the rising state makes greater demands in both the military and institutional spheres." },
        { id: "status_recognition", title: "Recognition of status is the core issue", label: "Beyond practical interests, the state wants its claims to status and authority treated as legitimate." },
        { id: "representation", title: "Representation has not adjusted quickly enough", label: "Existing rules and leadership structures have not given the state participation commensurate with its new weight." },
        { id: "hierarchy_contest", title: "It is challenging international hierarchy", label: "The conflict concerns not only voice but also who dominates finance, technology, and agenda-setting." },
      ],
    },
  },
  {
    questionId: "an_tradeoff_energy_alignment",
    backTranslation: {
      prompt: "A government opposes aggression abroad, but rapidly breaking economic ties would cause a severe domestic price shock. What should lead its policy line?",
      helpText: "Choose the real policy priority, not the public position easiest to defend.",
      options: [
        { id: "defend_rule", title: "Quickly take concrete action to defend the rule", label: "Bearing real costs is part of preventing aggression and territorial seizure from gradually becoming normalized." },
        { id: "protect_home", title: "First stabilize domestic society and political support", label: "A foreign policy that rapidly breaks the domestic coalition cannot be sustained and will struggle to remain credible." },
        { id: "phase_reduction", title: "Reduce dependence in stages", label: "Gradual adjustment can reduce external dependence while avoiding a one-time shock that strengthens domestic hard-liners." },
        { id: "hedge_diplomatically", title: "Oppose aggression while preserving diplomatic maneuver", label: "Domestic economic pain should not automatically lock the state into another state's broader strategy." },
      ],
    },
  },
  {
    questionId: "an_tradeoff_ceasefire_settlement",
    backTranslation: {
      prompt: "Ending a brutal war may require outside states to defer accountability and accept a plainly unequal ceasefire settlement. What is the fundamental tradeoff?",
      helpText: "Choose the core of the conflict, not the outcome you most hope to achieve.",
      options: [
        { id: "stop_harm_now", title: "Stop the killing first", label: "If it substantially reduces casualties and buys time for political repair, an imperfect peace may still have a defensible basis." },
        { id: "hold_accountability_line", title: "Hold the line on accountability", label: "If the most brutal wars always suspend justice, the relevant norm is weakened exactly when future perpetrators are paying the most attention." },
        { id: "sequence_peace_and_justice", title: "Sequence the ceasefire and accountability", label: "A monitored arrangement can stop the war immediately while preserving a credible path to later accountability." },
        { id: "read_the_power_distribution", title: "See the distribution of power behind the terms", label: "Whoever holds the leverage can define peace and justice; the settlement language reflects that imbalance." },
      ],
    },
  },
] as const satisfies readonly FoundationBackTranslationRecord[]
