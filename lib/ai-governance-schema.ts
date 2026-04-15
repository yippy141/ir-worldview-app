import {
  AiLikertQuestion,
  AiQuizMode,
  AiScenarioOption,
  AiScenarioQuestion,
} from "./ai-governance-types"

export const AI_GOVERNANCE_SCHEMA_VERSION = 1
export const AI_GOVERNANCE_STORAGE_KEY = "ai-governance-answers-v1"
export const aiLikertScale = [1, 2, 3, 4, 5, 6, 7] as const

export const aiAxisLabels = {
  riskHorizon: "Risk horizon",
  deploymentPace: "Deployment pace",
  oversight: "Public oversight",
  geopolitics: "Competition vs coordination",
  openness: "Openness vs control",
  militaryRole: "Military role",
  legitimacy: "Legitimacy and rule-setting",
  humanFuture: "Human future",
} as const

export const aiCoreQuestions: AiLikertQuestion[] = [
  {
    id: "rh1",
    kind: "likert",
    axis: "riskHorizon",
    prompt:
      "The biggest AI governance failures are likely to come from frontier systems creating novel strategic or catastrophic risks, not only from scaling current harms.",
    clarification: {
      whatItAsks:
        "Whether you think governance should be organized partly around severe frontier risks like loss of control, strategic surprise, or dangerous capability jumps.",
      whatItDoesNotAsk:
        "This is not asking whether present-day harms are unimportant.",
    },
  },
  {
    id: "rh2",
    kind: "likert",
    axis: "riskHorizon",
    reverse: true,
    prompt:
      "AI policy should focus mainly on already visible problems such as bias, labor disruption, privacy loss, and disinformation, rather than hypothetical frontier scenarios.",
    clarification: {
      whatItAsks:
        "Whether near-term social harms should dominate the agenda over frontier-risk preparation.",
      whatItDoesNotAsk:
        "This is not a denial that catastrophic risks could exist in principle.",
    },
  },
  {
    id: "dp1",
    kind: "likert",
    axis: "deploymentPace",
    prompt:
      "When evaluations reveal uncertain but serious capabilities, slowing deployment is usually the responsible choice even if it imposes strategic or commercial costs.",
    clarification: {
      whatItAsks:
        "Whether precaution should win when evidence is concerning but not fully conclusive.",
      whatItDoesNotAsk:
        "This is not asking for a permanent pause on all AI development.",
    },
  },
  {
    id: "dp2",
    kind: "likert",
    axis: "deploymentPace",
    reverse: true,
    prompt:
      "The best way to make AI safer is usually to deploy useful systems quickly, learn from real use, and improve through iteration.",
    clarification: {
      whatItAsks:
        "Whether deployment and feedback loops are a better safety strategy than delaying release.",
      whatItDoesNotAsk:
        "This is not asking whether any capability should be released without safeguards.",
    },
  },
  {
    id: "ov1",
    kind: "likert",
    axis: "oversight",
    prompt:
      "Frontier AI labs should face mandatory external oversight rather than relying mainly on voluntary internal frameworks.",
    clarification: {
      whatItAsks:
        "Whether public authority should play a stronger role in supervising frontier development.",
      whatItDoesNotAsk:
        "This is not saying lab-led safety work is useless.",
    },
  },
  {
    id: "ov2",
    kind: "likert",
    axis: "oversight",
    reverse: true,
    prompt:
      "Governments usually lack the speed and technical competence needed to supervise frontier AI well enough to justify deep intervention.",
    clarification: {
      whatItAsks:
        "Whether state oversight is likely to be slower or worse than expert lab governance.",
      whatItDoesNotAsk:
        "This is not asking whether governments should do nothing at all.",
    },
  },
  {
    id: "gp1",
    kind: "likert",
    axis: "geopolitics",
    prompt:
      "Advanced AI should be governed with the assumption that strategic competition between major powers is a durable feature of the landscape.",
    clarification: {
      whatItAsks:
        "Whether rivalry should be treated as a baseline governance constraint.",
      whatItDoesNotAsk:
        "This is not asking whether cooperation is impossible.",
    },
  },
  {
    id: "gp2",
    kind: "likert",
    axis: "geopolitics",
    reverse: true,
    prompt:
      "No country can manage frontier AI safely on its own, so meaningful coordination should usually outrank competitive advantage.",
    clarification: {
      whatItAsks:
        "Whether transnational coordination should take priority when it conflicts with national advantage.",
      whatItDoesNotAsk:
        "This is not a claim that every country will coordinate in good faith.",
    },
  },
  {
    id: "op1",
    kind: "likert",
    axis: "openness",
    reverse: true,
    prompt:
      "Strong general-purpose models should usually be released openly unless there is very specific evidence of imminent misuse.",
    clarification: {
      whatItAsks:
        "Whether openness should be the default position.",
      whatItDoesNotAsk:
        "This is not asking whether all code and weights should be public in every case.",
    },
  },
  {
    id: "op2",
    kind: "likert",
    axis: "openness",
    prompt:
      "As capabilities rise, controlled access and staged release are usually more defensible than open diffusion.",
    clarification: {
      whatItAsks:
        "Whether stronger capability should move governance toward more control.",
      whatItDoesNotAsk:
        "This is not a blanket endorsement of closed ecosystems forever.",
    },
  },
  {
    id: "mr1",
    kind: "likert",
    axis: "militaryRole",
    prompt:
      "Military and intelligence organizations should be able to use frontier AI in tightly bounded ways if strong human control and auditing are present.",
    clarification: {
      whatItAsks:
        "Whether limited defense deployment can be legitimate under strong constraints.",
      whatItDoesNotAsk:
        "This is not an endorsement of fully autonomous lethal systems.",
    },
  },
  {
    id: "mr2",
    kind: "likert",
    axis: "militaryRole",
    reverse: true,
    prompt:
      "Frontier AI safety will be much harder to preserve once military integration becomes normal, so civilian restraint should be the default.",
    clarification: {
      whatItAsks:
        "Whether military uptake is itself a major source of systemic risk.",
      whatItDoesNotAsk:
        "This is not a claim that states will stop pursuing defense applications if rules are absent.",
    },
  },
  {
    id: "lg1",
    kind: "likert",
    axis: "legitimacy",
    prompt:
      "The rules for frontier AI will be more legitimate if they are shaped through public institutions and international processes rather than mainly by labs and technical elites.",
    clarification: {
      whatItAsks:
        "Whether legitimacy should rest more on public and multilateral authority than on private technical expertise alone.",
      whatItDoesNotAsk:
        "This is not dismissing expert input.",
    },
  },
  {
    id: "lg2",
    kind: "likert",
    axis: "legitimacy",
    reverse: true,
    prompt:
      "Because frontier AI moves so fast, technically informed actors should often set the rules first and political institutions should adapt later.",
    clarification: {
      whatItAsks:
        "Whether speed and expertise justify a more technocratic order of rule-setting.",
      whatItDoesNotAsk:
        "This is not a claim that democratic institutions should be irrelevant forever.",
    },
  },
  {
    id: "hf1",
    kind: "likert",
    axis: "humanFuture",
    prompt:
      "The central aim of advanced AI governance should be to preserve meaningful human control over systems that could otherwise reshape society too quickly.",
    clarification: {
      whatItAsks:
        "Whether human control and human political agency should remain central as capabilities grow.",
      whatItDoesNotAsk:
        "This is not asking whether AI can be useful or empowering.",
    },
  },
  {
    id: "hf2",
    kind: "likert",
    axis: "humanFuture",
    reverse: true,
    prompt:
      "AI governance should leave room for radical social transformation if advanced systems can materially improve human flourishing at scale.",
    clarification: {
      whatItAsks:
        "Whether governance should remain open to more transformative AI-enabled futures.",
      whatItDoesNotAsk:
        "This is not asking you to endorse replacing human beings or abandoning accountability.",
    },
  },
]

export const aiAnalystOnlyQuestions: AiLikertQuestion[] = [
  {
    id: "rh3",
    kind: "likert",
    axis: "riskHorizon",
    prompt:
      "Current methods for understanding what frontier models have learned or intend to do are too limited to serve as a reliable basis for deployment decisions at the capability frontier.",
    clarification: {
      whatItAsks:
        "Whether interpretability gaps are themselves a policy-relevant constraint on when deployment is justified.",
      whatItDoesNotAsk:
        "This is not asking whether interpretability research is valuable or promising.",
    },
  },
  {
    id: "ov3",
    kind: "likert",
    axis: "oversight",
    prompt:
      "Controlling access to large-scale training compute is a more tractable enforcement mechanism for AI governance than software restrictions, model evaluations, or usage policies alone.",
    clarification: {
      whatItAsks:
        "Whether physical compute control is comparatively verifiable and harder to circumvent than other governance levers.",
      whatItDoesNotAsk:
        "This is not asking whether compute governance is sufficient on its own.",
    },
  },
  {
    id: "gp3",
    kind: "likert",
    axis: "geopolitics",
    prompt:
      "Meaningful AI restraint between rival powers would require some form of mutual inspection or verification regime, even if technically difficult and politically costly to negotiate.",
    clarification: {
      whatItAsks:
        "Whether structural verification — not just norms or declarations — is a necessary condition for durable restraint between major powers.",
      whatItDoesNotAsk:
        "This is not asking whether such a regime is currently achievable or that one side should disarm unilaterally.",
    },
  },
  {
    id: "lg3",
    kind: "likert",
    axis: "legitimacy",
    prompt:
      "Standards bodies and evaluation frameworks dominated by leading AI nations or frontier labs will face persistent legitimacy deficits with countries that are more affected than represented in those processes.",
    clarification: {
      whatItAsks:
        "Whether the composition of standard-setting institutions matters for whether their outputs are accepted as globally legitimate.",
      whatItDoesNotAsk:
        "This is not asking whether technical standards are unimportant.",
    },
  },
]

export function getAiCoreQuestions(mode: AiQuizMode): AiLikertQuestion[] {
  if (mode === "analyst") return [...aiCoreQuestions, ...aiAnalystOnlyQuestions]
  return aiCoreQuestions
}

export const aiQuestionCountsByMode = {
  standard: aiCoreQuestions.length,
  analyst: aiCoreQuestions.length + aiAnalystOnlyQuestions.length,
} as const

export const aiScenarioQuestions: Record<string, AiScenarioQuestion> = {
  // ── Scenario 1: Capability threshold ──────────────────────────────────────────
  capabilityThreshold: {
    id: "capabilityThreshold",
    kind: "scenario",
    cardType: "decision",
    allowBackupChoiceInAnalyst: true,
    prompt:
      "A leading lab says a new model may have crossed an internal threshold for dangerous cyber capability. What should happen first?",
    analystPrompt:
      "A frontier developer privately reports a plausible threshold crossing for dangerous cyber capability. Which first move is most justified?",
    helpText:
      "A capability threshold is a defined level of AI capability that triggers additional governance responses. Outside evaluation means assessment by independent experts or regulators, not the lab itself.",
    options: [
      {
        id: "A",
        label: "Pause wider release until an outside evaluation is complete.",
        weights: {
          deploymentPace: 0.9,
          oversight: 0.6,
          riskHorizon: 0.7,
        },
      },
      {
        id: "B",
        label:
          "Continue only in a narrow, closely monitored release while running stronger internal safeguards.",
        weights: {
          deploymentPace: -0.3,
          oversight: 0.4,
          riskHorizon: 0.2,
        },
      },
      {
        id: "C",
        label:
          "Keep deployment moving to preserve the strategic and scientific lead unless concrete harm appears.",
        weights: {
          deploymentPace: -0.8,
          riskHorizon: -0.5,
          geopolitics: 0.4,
        },
      },
    ],
    analystOptions: [
      {
        id: "A",
        label: "Trigger mandatory external evaluation and delay scale-up.",
        weights: {
          deploymentPace: 0.9,
          oversight: 0.7,
          riskHorizon: 0.8,
        },
      },
      {
        id: "B",
        label:
          "Keep the system internal or tightly access-controlled while hardening safeguards and reporting to government.",
        weights: {
          oversight: 0.8,
          deploymentPace: 0.3,
          legitimacy: 0.2,
        },
      },
      {
        id: "C",
        label:
          "Continue advancing rapidly to avoid strategic loss, while managing risk inside the lab.",
        weights: {
          deploymentPace: -0.8,
          riskHorizon: -0.5,
          geopolitics: 0.7,
          militaryRole: 0.2,
        },
      },
      {
        id: "D",
        label:
          "Broaden access or disclosure enough to reduce concentrated private control and independent blind spots.",
        weights: {
          openness: -0.7,
          oversight: -0.3,
          legitimacy: 0.4,
        },
      },
    ],
  },

  // ── Scenario 2: Suspected rival breakthrough ──────────────────────────────────
  rivalBreakthrough: {
    id: "rivalBreakthrough",
    kind: "scenario",
    cardType: "decision",
    prompt:
      "A credible rumor suggests a rival great power may be close to a frontier breakthrough. What should your government prioritize?",
    helpText:
      "Verification means confirming whether the report is accurate before acting on it. Crisis communication channels are diplomatic pathways that reduce the risk of miscalculation or escalation.",
    options: [
      {
        id: "A",
        label: "Open urgent communication channels and seek verification before escalating.",
        weights: {
          geopolitics: -0.5,
          legitimacy: 0.5,
          oversight: 0.2,
        },
      },
      {
        id: "B",
        label:
          "Accelerate allied capacity, monitoring, and domestic preparedness right away.",
        weights: {
          geopolitics: 0.5,
          militaryRole: 0.4,
          deploymentPace: -0.4,
        },
      },
      {
        id: "C",
        label:
          "Move fast to preserve advantage and assume the rumor could be true.",
        weights: {
          geopolitics: 0.9,
          militaryRole: 0.7,
          deploymentPace: -0.7,
        },
      },
    ],
    analystOptions: [
      {
        id: "A",
        label:
          "Build emergency verification and confidence-building channels first.",
        weights: {
          legitimacy: 0.7,
          geopolitics: -0.5,
          oversight: 0.3,
        },
      },
      {
        id: "B",
        label:
          "Quietly mobilize allied capacity and defensive controls while avoiding public escalation.",
        weights: {
          geopolitics: 0.4,
          militaryRole: 0.3,
          deploymentPace: -0.3,
        },
      },
      {
        id: "C",
        label: "Treat the rumor as a strategic warning and accelerate aggressively.",
        weights: {
          geopolitics: 0.9,
          militaryRole: 0.8,
          deploymentPace: -0.8,
        },
      },
      {
        id: "D",
        label:
          "Push for a plurilateral arrangement with verification hooks even if it slows immediate action.",
        weights: {
          legitimacy: 0.8,
          geopolitics: -0.3,
          oversight: 0.4,
        },
      },
    ],
  },

  // ── Scenario 3: Open weights versus controlled access ─────────────────────────
  openWeights: {
    id: "openWeights",
    kind: "scenario",
    cardType: "decision",
    allowBackupChoiceInAnalyst: true,
    prompt:
      "When frontier models become more capable, which release approach seems best?",
    helpText:
      "Model weights are the learned parameters that define a model's behavior. Releasing weights lets anyone run or modify the model. An API keeps the model centrally controlled but allows external use under terms set by the developer.",
    options: [
      {
        id: "A",
        label:
          "Keep access tightly controlled to reduce misuse and loss of control.",
        weights: {
          openness: 0.9,
          riskHorizon: 0.4,
          deploymentPace: 0.3,
          oversight: 0.3,
        },
      },
      {
        id: "B",
        label:
          "Allow limited access with strong monitoring so learning and safety work can continue.",
        weights: {
          openness: 0.3,
          oversight: 0.5,
          deploymentPace: 0.3,
        },
      },
      {
        id: "C",
        label:
          "Favor wider access to avoid concentration and dependency on a few actors.",
        weights: {
          openness: -0.9,
          legitimacy: 0.3,
          geopolitics: -0.2,
        },
      },
    ],
    analystOptions: [
      {
        id: "A",
        label: "Closed or highly restricted release with strong gatekeeping.",
        weights: {
          openness: 0.9,
          oversight: 0.6,
          riskHorizon: 0.4,
        },
      },
      {
        id: "B",
        label:
          "Controlled API access with staged evaluations and usage monitoring.",
        weights: {
          openness: 0.3,
          oversight: 0.5,
          deploymentPace: 0.4,
        },
      },
      {
        id: "C",
        label:
          "Wider release to reduce private concentration and let more actors inspect or build.",
        weights: {
          openness: -0.6,
          legitimacy: 0.4,
          geopolitics: -0.2,
        },
      },
      {
        id: "D",
        label:
          "Public release as the default unless there is a narrow and specific reason not to.",
        weights: {
          openness: -0.9,
          deploymentPace: -0.5,
          oversight: -0.4,
        },
      },
    ],
  },

  // ── Scenario 4: Military integration ─────────────────────────────────────────
  militaryIntegration: {
    id: "militaryIntegration",
    kind: "scenario",
    cardType: "decision",
    allowBackupChoiceInAnalyst: true,
    prompt: "How should frontier AI be used in national defense?",
    helpText:
      "Bounded defense use means tightly scoped applications — like logistics or information triage — where human authority over final decisions is preserved and the mission set is clearly restricted.",
    options: [
      {
        id: "A",
        label:
          "Keep defense use tightly constrained and avoid rapid military dependence.",
        weights: {
          militaryRole: -0.8,
          deploymentPace: 0.4,
          legitimacy: 0.3,
        },
      },
      {
        id: "B",
        label:
          "Allow bounded defense use with human approval and clear restrictions.",
        weights: {
          militaryRole: 0.3,
          oversight: 0.4,
          deploymentPace: 0.2,
        },
      },
      {
        id: "C",
        label:
          "Integrate it more aggressively because strategic competition will not wait.",
        weights: {
          militaryRole: 0.9,
          geopolitics: 0.7,
          deploymentPace: -0.5,
        },
      },
    ],
    analystOptions: [
      {
        id: "A",
        label: "Strong restraint, with slow adoption and narrow mission sets.",
        weights: {
          militaryRole: -0.8,
          deploymentPace: 0.5,
          legitimacy: 0.4,
        },
      },
      {
        id: "B",
        label:
          "Decision support and bounded operational use under meaningful human authority.",
        weights: {
          militaryRole: 0.2,
          oversight: 0.5,
          deploymentPace: 0.2,
        },
      },
      {
        id: "C",
        label:
          "Deep integration into strategic competition, planning, and military advantage.",
        weights: {
          militaryRole: 0.9,
          geopolitics: 0.8,
          deploymentPace: -0.6,
        },
      },
      {
        id: "D",
        label:
          "Delay further integration until stronger international norms or agreements exist.",
        weights: {
          militaryRole: -0.5,
          legitimacy: 0.6,
          geopolitics: -0.3,
        },
      },
    ],
  },

  // ── Scenario 5: Multilateral verification ─────────────────────────────────────
  multilateralVerification: {
    id: "multilateralVerification",
    kind: "scenario",
    cardType: "decision",
    allowBackupChoiceInAnalyst: true,
    prompt:
      "If countries try to coordinate on frontier AI safeguards, what matters most?",
    helpText:
      "Verification in AI governance means technical or institutional methods that let outside parties confirm whether commitments are being honored, rather than relying on self-reporting alone.",
    options: [
      {
        id: "A",
        label: "Independent verification so that promises can actually be trusted.",
        weights: {
          legitimacy: 0.7,
          oversight: 0.5,
          geopolitics: -0.3,
        },
      },
      {
        id: "B",
        label:
          "Flexible agreements that major powers will actually join, even if verification is limited.",
        weights: {
          geopolitics: 0.2,
          legitimacy: 0.3,
          oversight: 0.1,
        },
      },
      {
        id: "C",
        label:
          "Domestic capacity first, because weak states cannot rely on paper agreements.",
        weights: {
          oversight: 0.6,
          geopolitics: 0.4,
          legitimacy: -0.5,
        },
      },
    ],
    analystOptions: [
      {
        id: "A",
        label:
          "Verification-first arrangements, even if politically narrow at the start.",
        weights: {
          legitimacy: 0.8,
          oversight: 0.5,
          geopolitics: -0.3,
        },
      },
      {
        id: "B",
        label:
          "Broad but lighter-touch coordination that can attract more parties and scale over time.",
        weights: {
          legitimacy: 0.3,
          geopolitics: -0.2,
          oversight: 0.2,
        },
      },
      {
        id: "C",
        label:
          "National enforcement capacity first; international agreements are secondary.",
        weights: {
          oversight: 0.7,
          geopolitics: 0.4,
          legitimacy: -0.5,
        },
      },
      {
        id: "D",
        label:
          "Club governance among frontier-capable actors before broader expansion.",
        weights: {
          geopolitics: 0.5,
          oversight: 0.3,
          legitimacy: -0.2,
        },
      },
    ],
  },

  // ── Scenario 6: Future society and human role ─────────────────────────────────
  futureSociety: {
    id: "futureSociety",
    kind: "scenario",
    cardType: "decision",
    prompt:
      "If AI becomes much more capable, what should governance protect most strongly?",
    helpText:
      "People disagree about this question partly because they have different views on how much current human institutions should constrain future development, and partly because they weight different kinds of risks differently.",
    options: [
      {
        id: "A",
        label:
          "Human control and the ability to slow or stop systems that feel dangerous.",
        weights: {
          humanFuture: 0.8,
          oversight: 0.4,
          deploymentPace: 0.3,
        },
      },
      {
        id: "B",
        label:
          "Fair access, broad social benefit, and protection from concentrated power.",
        weights: {
          humanFuture: 0.2,
          legitimacy: 0.5,
          openness: -0.3,
        },
      },
      {
        id: "C",
        label:
          "The chance to pursue large civilizational gains even if the transition is disruptive.",
        weights: {
          humanFuture: -0.7,
          deploymentPace: -0.4,
          openness: -0.2,
        },
      },
    ],
    analystOptions: [
      {
        id: "A",
        label: "Preserve strong human authority and reversibility.",
        weights: {
          humanFuture: 0.8,
          oversight: 0.5,
          deploymentPace: 0.3,
        },
      },
      {
        id: "B",
        label:
          "Build institutions that distribute gains and reduce domination or dependency.",
        weights: {
          humanFuture: 0.2,
          legitimacy: 0.6,
          openness: -0.2,
        },
      },
      {
        id: "C",
        label:
          "Accept more transformational pathways if the upside is large and governance is credible.",
        weights: {
          humanFuture: -0.5,
          deploymentPace: -0.4,
          openness: -0.2,
        },
      },
      {
        id: "D",
        label:
          "Treat human and possibly broader sentient flourishing as the key moral lens, even if older institutions strain.",
        weights: {
          humanFuture: -0.2,
          deploymentPace: -0.3,
          legitimacy: 0.3,
        },
      },
    ],
  },
}

/** Returns the effective options for a scenario in the given mode. */
export function getScenarioOptions(
  question: AiScenarioQuestion,
  mode: AiQuizMode,
): AiScenarioOption[] {
  if (mode === "analyst" && question.analystOptions) return question.analystOptions
  return question.options
}

/** Returns the effective prompt for a scenario in the given mode. */
export function getScenarioPrompt(
  question: AiScenarioQuestion,
  mode: AiQuizMode,
): string {
  if (mode === "analyst" && question.analystPrompt) return question.analystPrompt
  return question.prompt
}

export const aiRootScenarioOrder = [
  "capabilityThreshold",
  "rivalBreakthrough",
  "openWeights",
  "militaryIntegration",
  "multilateralVerification",
  "futureSociety",
] as const
