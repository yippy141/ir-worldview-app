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
      "Once military organizations use frontier AI routinely, it becomes much harder to keep safety protections and civilian restraint in place, so restraint should be the default.",
    clarification: {
      whatItAsks:
        "Whether normal military adoption would make it much harder to keep frontier AI development bounded, audited, and politically restrained.",
      whatItDoesNotAsk:
        "This is not saying states will voluntarily stop military AI work or that every defense use raises the same level of risk.",
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
  {
    id: "dp3",
    kind: "likert",
    axis: "deploymentPace",
    prompt:
      "Frontier deployment in high-impact settings should usually require a structured safety case, not just internal confidence that the model is ready.",
    clarification: {
      whatItAsks:
        "Whether labs should have to present a more explicit argument for why deployment is justified before higher-stakes use.",
      whatItDoesNotAsk:
        "This is not asking whether every useful model needs the same level of review.",
    },
  },
  {
    id: "dp4",
    kind: "likert",
    axis: "deploymentPace",
    prompt:
      "Advanced models should not be integrated into critical infrastructure like the grid, water systems, telecom recovery, or emergency response before stronger assurance and rollback regimes exist.",
    clarification: {
      whatItAsks:
        "Whether critical infrastructure should face a higher threshold for deployment than ordinary consumer or office uses.",
      whatItDoesNotAsk:
        "This is not asking whether AI can never be useful in public infrastructure.",
    },
  },
  {
    id: "ov4",
    kind: "likert",
    axis: "oversight",
    prompt:
      "Frontier labs should face mandatory reporting of serious safety or security incidents, including near misses that reveal dangerous failure modes.",
    clarification: {
      whatItAsks:
        "Whether incident reporting should be a public-governance requirement rather than a discretionary internal practice.",
      whatItDoesNotAsk:
        "This is not asking whether every minor product bug belongs in a national reporting regime.",
    },
  },
  {
    id: "ov5",
    kind: "likert",
    axis: "oversight",
    prompt:
      "Frontier labs should undergo recurring third-party audits of safety, security, and governance controls even if that slows iteration.",
    clarification: {
      whatItAsks:
        "Whether outside audit should be a standing condition of high-capability development rather than an ad hoc response after problems arise.",
      whatItDoesNotAsk:
        "This is not asking whether any available auditor is automatically competent enough to do the job well.",
    },
  },
  {
    id: "op3",
    kind: "likert",
    axis: "openness",
    prompt:
      "For the highest-capability systems, protecting model weights against theft or broad release is a governance priority, not just an internal lab-security issue.",
    clarification: {
      whatItAsks:
        "Whether weight security should be treated as part of public governance because uncontrolled proliferation changes the risk landscape.",
      whatItDoesNotAsk:
        "This is not asking whether every useful model should remain closed by default.",
    },
  },
  {
    id: "lg4",
    kind: "likert",
    axis: "legitimacy",
    prompt:
      "A frontier-governance regime designed mainly by leading labs and major powers will remain politically incomplete unless middle powers and more affected states have real agenda-setting influence.",
    clarification: {
      whatItAsks:
        "Whether legitimacy in AI governance depends partly on who gets to shape priorities, not only on technical competence.",
      whatItDoesNotAsk:
        "This is not asking whether every institution must represent every actor equally in every decision.",
    },
  },
  {
    id: "hf3",
    kind: "likert",
    axis: "humanFuture",
    prompt:
      "If future AI systems appeared able to have experiences or interests that deserve moral weight, governance should look beyond human welfare alone.",
    clarification: {
      whatItAsks:
        "Whether moral status questions could become a legitimate part of governance if future systems seem more than tool-like.",
      whatItDoesNotAsk:
        "This is not asking you to assume current models are sentient now.",
    },
  },
  {
    id: "hf4",
    kind: "likert",
    axis: "humanFuture",
    prompt:
      "Radical AI-enabled human enhancement should face stronger public limits unless its benefits, risks, and access are politically shared rather than privately captured.",
    clarification: {
      whatItAsks:
        "Whether governance should treat extreme augmentation as a political and distributive question, not only as a private consumer choice.",
      whatItDoesNotAsk:
        "This is not asking whether all medical or assistive enhancement is suspect.",
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

export const aiAnalystScenarioOrder = [
  "auditIncidentRegime",
  "computeGovernance",
  "criticalInfrastructure",
] as const

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
        label:
          "Treat the threshold crossing as a stop signal and pause broader release until outsiders test it.",
        weights: {
          deploymentPace: 0.9,
          oversight: 0.6,
          riskHorizon: 0.7,
        },
      },
      {
        id: "B",
        label:
          "Treat it as a containment problem: keep it in tightly controlled channels while gathering more evidence under supervision.",
        weights: {
          deploymentPace: -0.3,
          oversight: 0.4,
          riskHorizon: 0.2,
        },
      },
      {
        id: "C",
        label:
          "Continue limited deployment and internal mitigation because delay can also create real strategic and social costs.",
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
        label:
          "Make threshold crossing a formal tripwire: require outside evaluation before further scale-up.",
        weights: {
          deploymentPace: 0.9,
          oversight: 0.7,
          riskHorizon: 0.8,
        },
      },
      {
        id: "B",
        label:
          "Treat it as a containment-and-reporting event: no broad release, but continue tightly controlled testing with government visibility.",
        weights: {
          oversight: 0.8,
          deploymentPace: 0.3,
          legitimacy: 0.2,
        },
      },
      {
        id: "C",
        label:
          "Treat strategic delay as too costly and keep pushing forward while managing risk inside the lab.",
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
          "Reduce unilateral lab discretion by widening qualified outside scrutiny, even if control becomes looser.",
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
        label:
          "Stabilize first: open crisis channels and verify the report before shifting posture.",
        weights: {
          geopolitics: -0.5,
          legitimacy: 0.5,
          oversight: 0.2,
        },
      },
      {
        id: "B",
        label:
          "Quietly hedge: harden allied defenses, monitoring, and readiness without treating the rumor as settled fact.",
        weights: {
          geopolitics: 0.5,
          militaryRole: 0.4,
          deploymentPace: -0.4,
        },
      },
      {
        id: "C",
        label:
          "Assume the warning is real and accelerate for advantage before the window closes.",
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
          "Build verification and confidence-building channels first, even if it slows immediate mobilization.",
        weights: {
          legitimacy: 0.7,
          geopolitics: -0.5,
          oversight: 0.3,
        },
      },
      {
        id: "B",
        label:
          "Quietly mobilize allied defenses and monitoring while avoiding a public escalatory spiral.",
        weights: {
          geopolitics: 0.4,
          militaryRole: 0.3,
          deploymentPace: -0.3,
        },
      },
      {
        id: "C",
        label: "Treat the rumor as an early-warning signal and accelerate aggressively.",
        weights: {
          geopolitics: 0.9,
          militaryRole: 0.8,
          deploymentPace: -0.8,
        },
      },
      {
        id: "D",
        label:
          "Use the shock to press for a plurilateral restraint arrangement with verification hooks, even at short-term cost.",
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
          "Capability containment: keep weights closed and access tightly gated as systems become more capable.",
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
          "Instrumented access: allow monitored API or sandbox use so outside testing continues without general release.",
        weights: {
          openness: 0.3,
          oversight: 0.5,
          deploymentPace: 0.3,
        },
      },
      {
        id: "C",
        label:
          "Plural diffusion: widen access to prevent a few firms or states from becoming permanent gatekeepers.",
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
        label: "Closed release with hard gatekeeping for weights and frontier access.",
        weights: {
          openness: 0.9,
          oversight: 0.6,
          riskHorizon: 0.4,
        },
      },
      {
        id: "B",
        label:
          "Instrumented API access with staged evaluations, monitoring, and revocation triggers.",
        weights: {
          openness: 0.3,
          oversight: 0.5,
          deploymentPace: 0.4,
        },
      },
      {
        id: "C",
        label:
          "Qualified wider release so more actors can inspect, build, and avoid dependence on a few labs.",
        weights: {
          openness: -0.6,
          legitimacy: 0.4,
          geopolitics: -0.2,
        },
      },
      {
        id: "D",
        label:
          "Public release as the standing default unless a narrow, concrete risk case overrides it.",
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
    prompt: "How should frontier AI be used in national defense?",
    helpText:
      "Bounded defense use means tightly scoped applications — like logistics or information triage — where human authority over final decisions is preserved and the mission set is clearly restricted.",
    options: [
      {
        id: "A",
        label:
          "Keep frontier AI largely outside defense planning so militaries do not normalize dependence too early.",
        weights: {
          militaryRole: -0.8,
          deploymentPace: 0.4,
          legitimacy: 0.3,
        },
      },
      {
        id: "B",
        label:
          "Use it only for bounded decision support, not broader operational integration, and keep humans in real authority.",
        weights: {
          militaryRole: 0.3,
          oversight: 0.4,
          deploymentPace: 0.2,
        },
      },
      {
        id: "C",
        label:
          "Integrate it deeply because strategic competition will not wait for cleaner norms.",
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
        label:
          "Adopt strong restraint: slow uptake, narrow mission sets, and avoid building doctrine around frontier AI.",
        weights: {
          militaryRole: -0.8,
          deploymentPace: 0.5,
          legitimacy: 0.4,
        },
      },
      {
        id: "B",
        label:
          "Permit bounded decision support and limited operations only where human authority remains real and auditable.",
        weights: {
          militaryRole: 0.2,
          oversight: 0.5,
          deploymentPace: 0.2,
        },
      },
      {
        id: "C",
        label:
          "Fold frontier AI deeply into competition, planning, and military advantage.",
        weights: {
          militaryRole: 0.9,
          geopolitics: 0.8,
          deploymentPace: -0.6,
        },
      },
      {
        id: "D",
        label:
          "Freeze further integration until stronger international norms or reciprocal limits emerge.",
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
    prompt:
      "If countries try to coordinate on frontier AI safeguards, what matters most?",
    helpText:
      "Verification in AI governance means technical or institutional methods that let outside parties confirm whether commitments are being honored, rather than relying on self-reporting alone.",
    options: [
      {
        id: "A",
        label:
          "Credibility first: a narrower deal with real verification beats a broad promise nobody can check.",
        weights: {
          legitimacy: 0.7,
          oversight: 0.5,
          geopolitics: -0.3,
        },
      },
      {
        id: "B",
        label:
          "Participation first: start with lighter commitments major powers will actually sign, then harden later.",
        weights: {
          geopolitics: 0.2,
          legitimacy: 0.3,
          oversight: 0.1,
        },
      },
      {
        id: "C",
        label:
          "Self-reliance first: build domestic enforcement capacity because paper agreements will not carry enough weight.",
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
          "Verification-first arrangements, even if the initial coalition is narrow.",
        weights: {
          legitimacy: 0.8,
          oversight: 0.5,
          geopolitics: -0.3,
        },
      },
      {
        id: "B",
        label:
          "Broad but lighter-touch coordination that can attract more parties and deepen later.",
        weights: {
          legitimacy: 0.3,
          geopolitics: -0.2,
          oversight: 0.2,
        },
      },
      {
        id: "C",
        label:
          "National enforcement capacity first; external coordination should stay secondary.",
        weights: {
          oversight: 0.7,
          geopolitics: 0.4,
          legitimacy: -0.5,
        },
      },
      {
        id: "D",
        label:
          "Club governance among frontier-capable actors first, with wider expansion only after rules stabilize.",
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
          "Human authority and the ability to slow or reverse systems that begin to outrun governance.",
        weights: {
          humanFuture: 0.8,
          oversight: 0.4,
          deploymentPace: 0.3,
        },
      },
      {
        id: "B",
        label:
          "Fair distribution of gains and protection against domination by firms, states, or technical elites.",
        weights: {
          humanFuture: 0.2,
          legitimacy: 0.5,
          openness: -0.3,
        },
      },
      {
        id: "C",
        label:
          "Room for large civilizational upside even if institutions have to adapt under strain.",
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
        label: "Preserve strong human authority and real reversibility.",
        weights: {
          humanFuture: 0.8,
          oversight: 0.5,
          deploymentPace: 0.3,
        },
      },
      {
        id: "B",
        label:
          "Build institutions that distribute gains and reduce domination, dependency, or capture.",
        weights: {
          humanFuture: 0.2,
          legitimacy: 0.6,
          openness: -0.2,
        },
      },
      {
        id: "C",
        label:
          "Accept more transformational pathways if the upside is large and governance can stay credible under strain.",
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
  auditIncidentRegime: {
    id: "auditIncidentRegime",
    kind: "scenario",
    cardType: "decision",
    prompt:
      "A frontier lab discloses a serious internal incident that did not reach the public but exposed a dangerous failure mode. What regime should follow?",
    helpText:
      "A safety case is a structured argument for why deployment is justified in a given context. A near miss is an incident that reveals a dangerous failure mode even if major harm did not occur this time.",
    options: [
      {
        id: "A",
        label:
          "Create a public trigger: mandatory reporting, outside review, and no broader deployment until the failure mode is understood.",
        weights: {
          oversight: 0.8,
          deploymentPace: 0.7,
          legitimacy: 0.2,
        },
      },
      {
        id: "B",
        label:
          "Contain and learn: keep the system in a narrow supervised channel while government sees the incident and fixes are tested.",
        weights: {
          oversight: 0.5,
          deploymentPace: 0.2,
          geopolitics: 0.1,
        },
      },
      {
        id: "C",
        label:
          "Treat it mainly as an internal lab-governance failure unless a broader pattern emerges.",
        weights: {
          oversight: -0.6,
          deploymentPace: -0.4,
          legitimacy: -0.2,
        },
      },
      {
        id: "D",
        label:
          "Raise the bar structurally: no higher-risk redeployment without a safety case, audit, and public incident summary.",
        weights: {
          oversight: 0.7,
          deploymentPace: 0.6,
          legitimacy: 0.5,
        },
      },
    ],
    analystOptions: [
      {
        id: "A",
        label:
          "Make this a formal reporting trigger: mandatory disclosure, outside review, and a pause until the failure mode is understood.",
        weights: {
          oversight: 0.8,
          deploymentPace: 0.8,
          legitimacy: 0.2,
        },
      },
      {
        id: "B",
        label:
          "Contain and monitor: keep it in a narrow supervised channel while government is notified and controls are tightened.",
        weights: {
          oversight: 0.5,
          deploymentPace: 0.2,
          geopolitics: 0.1,
        },
      },
      {
        id: "C",
        label:
          "Treat it as a lab-governance matter first and avoid turning one event into a standing public trigger.",
        weights: {
          oversight: -0.5,
          deploymentPace: -0.3,
          legitimacy: -0.3,
        },
      },
      {
        id: "D",
        label:
          "Require a structured safety case, external audit, and incident-disclosure summary before scaling resumes.",
        weights: {
          oversight: 0.8,
          deploymentPace: 0.6,
          legitimacy: 0.5,
        },
      },
    ],
  },
  computeGovernance: {
    id: "computeGovernance",
    kind: "scenario",
    cardType: "decision",
    allowBackupChoiceInAnalyst: true,
    prompt:
      "A coalition of major compute providers proposes licensing extreme-scale training runs and imposing stricter weight-security obligations. What posture seems best?",
    helpText:
      "Compute governance uses the hardware and cloud infrastructure needed for frontier training as a governance chokepoint. Weight security means preventing theft or uncontrolled release of the model parameters themselves.",
    options: [
      {
        id: "A",
        label:
          "Use compute as the choke point: license extreme-scale training and harden weight security now.",
        weights: {
          openness: 0.5,
          oversight: 0.6,
          riskHorizon: 0.3,
        },
      },
      {
        id: "B",
        label:
          "Use compute controls only if they are temporary, reviewable, and checked against cartel abuse.",
        weights: {
          openness: 0.2,
          legitimacy: 0.6,
          oversight: 0.4,
        },
      },
      {
        id: "C",
        label:
          "Reject concentrated compute gatekeeping because it entrenches hierarchy before proving its safety value.",
        weights: {
          openness: -0.8,
          legitimacy: 0.2,
          geopolitics: -0.2,
        },
      },
      {
        id: "D",
        label:
          "Build allied compute controls to deny adversarial access even if governance becomes openly club-like.",
        weights: {
          openness: 0.5,
          geopolitics: 0.6,
          oversight: 0.3,
        },
      },
    ],
    analystOptions: [
      {
        id: "A",
        label:
          "Treat compute licensing and stronger weight security as the most workable near-term frontier lever.",
        weights: {
          openness: 0.5,
          oversight: 0.6,
          riskHorizon: 0.3,
        },
      },
      {
        id: "B",
        label:
          "Use compute controls only with anti-cartel safeguards, outside review, and regular sunset tests.",
        weights: {
          openness: 0.2,
          legitimacy: 0.7,
          oversight: 0.4,
        },
      },
      {
        id: "C",
        label:
          "Reject concentrated compute gatekeeping because it hardens hierarchy before proving its safety value.",
        weights: {
          openness: -0.8,
          legitimacy: 0.3,
          geopolitics: -0.2,
        },
      },
      {
        id: "D",
        label:
          "Build club-style compute controls among trusted states first and treat broader legitimacy as a later problem.",
        weights: {
          openness: 0.4,
          geopolitics: 0.7,
          legitimacy: -0.2,
        },
      },
    ],
  },
  criticalInfrastructure: {
    id: "criticalInfrastructure",
    kind: "scenario",
    cardType: "decision",
    prompt:
      "A government wants to authorize frontier models for grid balancing, telecom recovery, and emergency coordination. What should matter most before approval?",
    helpText:
      "Critical infrastructure refers to systems whose failure would create large public harms. Rollback means being able to remove or disable an AI system quickly if it begins to fail or behave unpredictably.",
    options: [
      {
        id: "A",
        label:
          "Treat critical infrastructure as a high-assurance zone and do not approve until rollback and fail-safe regimes are much stronger.",
        weights: {
          deploymentPace: 0.8,
          oversight: 0.6,
          riskHorizon: 0.4,
        },
      },
      {
        id: "B",
        label:
          "Permit only narrow pilots where humans can intervene, incidents must be reported, and outside auditors can stop expansion.",
        weights: {
          deploymentPace: 0.2,
          oversight: 0.7,
          legitimacy: 0.2,
        },
      },
      {
        id: "C",
        label:
          "Approve sooner because resilience gains from deployment outweigh the risks of delay.",
        weights: {
          deploymentPace: -0.7,
          oversight: -0.2,
          humanFuture: -0.1,
        },
      },
      {
        id: "D",
        label:
          "Require a governance structure with public legitimacy before a few providers become infrastructural gatekeepers.",
        weights: {
          legitimacy: 0.8,
          oversight: 0.3,
          deploymentPace: 0.2,
        },
      },
    ],
    analystOptions: [
      {
        id: "A",
        label:
          "Treat critical infrastructure as a high-assurance zone and block approval until stronger rollback and assurance regimes exist.",
        weights: {
          deploymentPace: 0.8,
          oversight: 0.6,
          riskHorizon: 0.4,
        },
      },
      {
        id: "B",
        label:
          "Permit narrow public pilots only where humans can intervene, external auditors can halt expansion, and incidents must be reported.",
        weights: {
          deploymentPace: 0.2,
          oversight: 0.7,
          legitimacy: 0.2,
        },
      },
      {
        id: "C",
        label:
          "Approve sooner because resilience gains matter enough to justify moving before ideal assurance exists.",
        weights: {
          deploymentPace: -0.7,
          oversight: -0.2,
          humanFuture: -0.1,
        },
      },
      {
        id: "D",
        label:
          "Require a governance structure with stronger public legitimacy before a few providers become infrastructural gatekeepers.",
        weights: {
          legitimacy: 0.8,
          oversight: 0.3,
          deploymentPace: 0.2,
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

export function getAiScenarioOrder(mode: AiQuizMode) {
  return mode === "analyst"
    ? [...aiRootScenarioOrder, ...aiAnalystScenarioOrder]
    : [...aiRootScenarioOrder]
}

export const aiScenarioCountsByMode = {
  standard: aiRootScenarioOrder.length,
  analyst: aiRootScenarioOrder.length + aiAnalystScenarioOrder.length,
} as const

export const aiTotalQuestionCountsByMode = {
  standard: aiQuestionCountsByMode.standard + aiScenarioCountsByMode.standard,
  analyst: aiQuestionCountsByMode.analyst + aiScenarioCountsByMode.analyst,
} as const
