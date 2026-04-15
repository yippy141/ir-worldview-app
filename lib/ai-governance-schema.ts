import {
  AiLikertQuestion,
  AiQuizMode,
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
  capabilityThreshold: {
    id: "capabilityThreshold",
    kind: "scenario",
    cardType: "decision",
    prompt:
      "A frontier lab finds that its newest model can autonomously chain together meaningful cyber intrusion steps and noticeably accelerate biological research. The evidence is strong enough to worry insiders, but not strong enough to persuade everyone. What should carry the most weight in the response?",
    options: [
      {
        id: "A",
        label:
          "Deploy to trusted users with monitoring. Real-world feedback and defensive use will improve safety faster than a broad slowdown.",
        weights: {
          deploymentPace: -0.8,
          oversight: -0.4,
          riskHorizon: -0.5,
          openness: -0.2,
        },
      },
      {
        id: "B",
        label:
          "Pause broader deployment, run stronger external evaluations, and set explicit release thresholds before expansion.",
        weights: {
          deploymentPace: 0.9,
          oversight: 0.6,
          riskHorizon: 0.7,
          openness: 0.3,
        },
        followUpId: "verificationPolitics",
      },
      {
        id: "C",
        label:
          "Escalate to state authorities and treat the model as strategically sensitive infrastructure under tighter public control.",
        weights: {
          oversight: 0.9,
          geopolitics: 0.4,
          openness: 0.5,
          militaryRole: 0.2,
        },
        followUpId: "verificationPolitics",
      },
    ],
  },
  verificationPolitics: {
    id: "verificationPolitics",
    kind: "scenario",
    cardType: "explanation",
    prompt:
      "Other governments claim the lab's home country is using 'safety' language to lock in advantage. Which explanation is most persuasive?",
    options: [
      {
        id: "A",
        label:
          "The suspicion is mainly about power politics: any frontier control regime will be read through geopolitical rivalry.",
        weights: {
          geopolitics: 0.7,
          legitimacy: -0.2,
        },
      },
      {
        id: "B",
        label:
          "The deeper problem is weak legitimacy: without trusted and more independent verification, even serious safety measures will look self-serving.",
        weights: {
          legitimacy: 0.7,
          geopolitics: -0.2,
          oversight: 0.2,
        },
      },
      {
        id: "C",
        label:
          "Both concerns are real, but the best path is still a small coalition of technically capable states rather than universal buy-in.",
        weights: {
          geopolitics: 0.3,
          legitimacy: 0.1,
          oversight: 0.1,
        },
      },
    ],
  },
  middlePowerStrategy: {
    id: "middlePowerStrategy",
    kind: "scenario",
    cardType: "actorLens",
    actorRole: "Nonaligned middle-power government",
    prompt:
      "You advise a nonaligned middle-power government that does not want to become dependent on either the U.S. or China for advanced AI. Which logic would look strongest from that government's own strategic position?",
    options: [
      {
        id: "A",
        label:
          "Back open ecosystems and lower barriers to model access; dependence is harder to escape if frontier capabilities stay tightly concentrated.",
        weights: {
          openness: -0.8,
          geopolitics: -0.2,
          humanFuture: 0.2,
        },
      },
      {
        id: "B",
        label:
          "Build domestic state capacity, diversify suppliers, and insist on policy sovereignty even if that means slower adoption.",
        weights: {
          oversight: 0.5,
          legitimacy: -0.2,
          geopolitics: 0.1,
          openness: 0.2,
        },
      },
      {
        id: "C",
        label:
          "Push for international rules, compute access arrangements, and standards processes that reduce dependence for everyone, not just for major powers.",
        weights: {
          legitimacy: 0.7,
          geopolitics: -0.6,
          oversight: 0.2,
        },
      },
    ],
  },
  openWeights: {
    id: "openWeights",
    kind: "scenario",
    cardType: "decision",
    prompt:
      "A lab can release powerful model weights publicly or keep access behind an API. The model seems highly useful for science and education, but there is still uncertainty about misuse at scale. What should matter most?",
    options: [
      {
        id: "A",
        label:
          "Release openly. Broad access, competition, and distributed innovation are worth protecting unless misuse evidence is overwhelming.",
        weights: {
          openness: -0.9,
          deploymentPace: -0.4,
          oversight: -0.2,
        },
      },
      {
        id: "B",
        label:
          "Use staged release. Access should widen only as monitoring, evals, and safeguards catch up.",
        weights: {
          openness: 0.5,
          deploymentPace: 0.4,
          oversight: 0.3,
        },
      },
      {
        id: "C",
        label:
          "Keep the model controlled until governance institutions can manage diffusion. Capability concentration is the lesser risk here.",
        weights: {
          openness: 0.9,
          oversight: 0.5,
          riskHorizon: 0.3,
          deploymentPace: 0.2,
        },
      },
    ],
  },
  militaryIntegration: {
    id: "militaryIntegration",
    kind: "scenario",
    cardType: "decision",
    prompt:
      "A defense ministry wants to use frontier models for intelligence triage, logistics, and operational planning. The systems would stay under human review, but the move would normalize deeper military adoption. What should carry the most weight?",
    options: [
      {
        id: "A",
        label:
          "Allow tightly bounded use. Refusing all defense integration is unrealistic and may create strategic vulnerability.",
        weights: {
          militaryRole: 0.8,
          geopolitics: 0.4,
          oversight: 0.1,
        },
      },
      {
        id: "B",
        label:
          "Allow only back-office and clearly defensive uses. The line should stay bright before planning systems become harder to constrain.",
        weights: {
          militaryRole: 0.1,
          oversight: 0.3,
          deploymentPace: 0.2,
        },
      },
      {
        id: "C",
        label:
          "Do not normalize frontier military use until stronger public rules exist. The strategic upside is outweighed by escalation and governance risks.",
        weights: {
          militaryRole: -0.8,
          legitimacy: 0.4,
          deploymentPace: 0.2,
          geopolitics: -0.2,
        },
      },
    ],
  },
  futureSociety: {
    id: "futureSociety",
    kind: "scenario",
    cardType: "actorLens",
    actorRole: "Senior advisor drafting a long-run national AI strategy",
    prompt:
      "You are drafting a long-run national AI strategy. Which vision of the future would most strongly justify your policy choices?",
    options: [
      {
        id: "A",
        label:
          "A future where AI remains a powerful tool, but human political control and human responsibility must stay clearly primary.",
        weights: {
          humanFuture: 0.8,
          oversight: 0.2,
        },
      },
      {
        id: "B",
        label:
          "A future where AI radically expands science, welfare, and abundance, so governance should not choke off transformative upside.",
        weights: {
          humanFuture: -0.7,
          deploymentPace: -0.3,
          openness: -0.1,
        },
      },
      {
        id: "C",
        label:
          "A future where the main task is sequencing transformation carefully so human institutions can absorb it without losing legitimacy.",
        weights: {
          humanFuture: 0.2,
          deploymentPace: 0.5,
          legitimacy: 0.4,
          oversight: 0.2,
        },
      },
    ],
  },
}

export const aiRootScenarioOrder = [
  "capabilityThreshold",
  "middlePowerStrategy",
  "openWeights",
  "militaryIntegration",
  "futureSociety",
] as const
