import type { FoundationBackTranslationRecord } from "@/content/locales/zh-Hans/foundation-types"

export const zhHansFoundationStandardBackTranslations = [
  {
    questionId: "sc1",
    backTranslation: {
      prompt: "When the relative strength of major powers changes, peace between them is often difficult to keep stable.",
      clarification: {
        whatItAsks: "Does a change in relative major-power strength make a peaceful relationship harder to maintain?",
        terms: [
          {
            term: "Relative strength",
            definition: "The relative distribution of military, economic, and strategic capabilities among major powers.",
          },
        ],
      },
    },
  },
  {
    questionId: "in1",
    backTranslation: {
      prompt: "Even without a world government, rules followed in common can make cooperation more durable.",
      clarification: {
        whatItAsks: "Can common rules sustain cooperation when no authority above states can enforce them?",
      },
    },
  },
  {
    questionId: "df1",
    backTranslation: {
      prompt: "Changes in who governs and to whom they are accountable often influence foreign policy no less than external threats do.",
      clarification: {
        whatItAsks: "Can elections, leadership changes, and domestic political coalitions redirect foreign policy as much as external developments?",
      },
    },
  },
  {
    questionId: "ni1",
    backTranslation: {
      prompt: "In judging what a state's military expansion means, the history and mutual trust between states matter more than the size of the force.",
      clarification: {
        whatItAsks: "Do relationship history and mutual trust explain the meaning of military moves better than force size does?",
      },
    },
  },
  {
    questionId: "pe1",
    backTranslation: {
      prompt: "In a crisis, who controls credit, productive capacity, and key supply-chain nodes often shapes state choices more than military strength itself.",
      clarification: {
        whatItAsks: "Do financial and supply-chain dependencies limit state choices more than differences in military capability do?",
      },
    },
  },
  {
    questionId: "rs1",
    backTranslation: {
      prompt: "When a state continues to seek advantages beyond what self-defense requires, rivals and other states often react in ways that ultimately worsen its security position.",
      clarification: {
        whatItAsks: "Does seeking advantages beyond defense usually trigger counteraction and make the state less secure?",
      },
    },
  },
  {
    questionId: "oj1",
    backTranslation: {
      prompt: "Even when major injustice remains unresolved, maintaining a stable international order is often still necessary.",
      clarification: {
        whatItAsks: "When stability and correcting injustice cannot both be achieved, should preserving international order usually come first?",
      },
    },
  },
  {
    questionId: "tradeoff_alliances",
    backTranslation: {
      prompt: "What is the most common reason an alliance holds together under severe pressure?",
      helpText: "Choose the explanation you would use first.",
      options: [
        { id: "power", title: "Strength and commitment", label: "An alliance stands when members believe the leading state both can and will bear the cost of collective defense." },
        { id: "rules", title: "Rules and coordination mechanisms", label: "Standing plans, clear commitments, and sustained coordination make alliance guarantees more credible." },
        { id: "domestic", title: "Domestic support", label: "An alliance endures when domestic political coalitions, fiscal investment, and public tolerance can be sustained." },
        { id: "meaning", title: "Shared political identification", label: "When members see an alliance as justified and consistent with their identity, it is held together by more than an exchange of interests." },
      ],
    },
  },
  {
    questionId: "sc2",
    backTranslation: {
      prompt: "Because states cannot be confident that others will remain non-hostile, they often take precautions against risk.",
      clarification: {
        whatItAsks: "Does uncertainty about whether another state will remain non-hostile push states to prepare for conflict?",
      },
    },
  },
  {
    questionId: "in2",
    backTranslation: {
      prompt: "Even when mutual trust is limited, verification mechanisms and regular communication can keep international agreements in operation.",
      clarification: {
        whatItAsks: "Can verification and sustained communication keep an agreement operating when the parties lack trust?",
      },
    },
  },
  {
    questionId: "tradeoff_interdependence",
    backTranslation: {
      prompt: "When economic interdependence creates danger, where does the deeper problem usually lie?",
      helpText: "Choose the cause, not the policy response you favor.",
      options: [
        { id: "rivalry", title: "Strategic competition turns ties into leverage", label: "As strategic competition intensifies, states begin treating external economic dependence as a security risk, and existing ties mainly become instruments of pressure." },
        { id: "rules", title: "Multilateral rules failed to keep up", label: "The problem is weak constraints; stronger multilateral rules could sustain openness while reducing exposure to coercion." },
        { id: "domestic", title: "Domestic dependence has hardened", label: "Firms, regions, and interest groups have become so bound to existing relationships that domestic politics cannot adjust promptly when risk rises." },
        { id: "structure", title: "The structure of dependence is asymmetric", label: "The key is who controls credit, productive capacity, and supply bottlenecks; surface interdependence hides this asymmetry until pressure begins." },
      ],
    },
  },
  {
    questionId: "df2",
    backTranslation: {
      prompt: "Even under similar external pressure, differences in domestic politics can produce very different policy responses.",
      clarification: {
        whatItAsks: "Can differences in political systems and domestic coalitions change how states respond to the same external pressure?",
      },
    },
  },
  {
    questionId: "ni2",
    backTranslation: {
      prompt: "International status, recognition by other states, and political legitimacy not only affect how states pursue interests; they also change how states define their interests.",
      clarification: {
        whatItAsks: "Is a state's understanding of its own interests partly shaped by status, identity, and recognition by others?",
      },
    },
  },
  {
    questionId: "pe2",
    backTranslation: {
      prompt: "International economic rules often entrench long-term structural advantages for stronger states, leaving weaker states to find ways to cope.",
      clarification: {
        whatItAsks: "Do global economic rules give some states lasting advantages created by institutional arrangements?",
        terms: [
          { term: "Structural advantage", definition: "An advantage continuously produced by rules or institutional arrangements, not a benefit won in a single negotiation." },
        ],
      },
    },
  },
  {
    questionId: "rs2",
    backTranslation: {
      prompt: "Avoiding strategic burdens beyond a state's capacity is usually more important than turning every opportunity into a lasting advantage.",
      clarification: {
        whatItAsks: "Is limiting the scope of commitments usually safer than continually pursuing advantage?",
      },
    },
  },
  {
    questionId: "oj2",
    backTranslation: {
      prompt: "When mass atrocities reach an extreme level, outside states may have justified grounds to break through the sovereignty protections a state normally enjoys in order to stop the atrocities.",
      clarification: {
        whatItAsks: "Can extreme harm to civilians justify military action when the government concerned does not consent?",
        whatItDoesNotAsk: "This concerns only extreme emergencies, not ordinary intervention or regime change without a time limit.",
        terms: [
          { term: "Sovereignty", definition: "The principle that a state has jurisdiction over matters within its territory." },
        ],
      },
    },
  },
  {
    questionId: "tradeoff_strategy",
    backTranslation: {
      prompt: "A rival is gradually gaining the upper hand. What should be considered first?",
      options: [
        { id: "press", title: "Use the moment to expand advantage", label: "If a lasting strategic lead can be created now but no action is taken, it may later be seen as a missed opportunity." },
        { id: "limit", title: "Guard against strategic overextension", label: "The greater risk may come from the state itself: excessive commitments or escalation may do more damage than the rival's limited gains." },
        { id: "base", title: "Assess domestic carrying capacity", label: "The first question is whether domestic coalitions, public tolerance, and fiscal room can carry the strategy over time." },
        { id: "industrial", title: "Strengthen the technological and industrial base", label: "Long-term power is determined less by short-term posture than by who controls technology, industrial capacity, and supply chains." },
      ],
    },
  },
  {
    questionId: "tradeoff_intervention",
    backTranslation: {
      prompt: "A government is committing mass atrocities. Using force may save lives, but may also disrupt the legal boundaries constraining future outside intervention. What should be the principal basis for the decision?",
      clarification: {
        whatItAsks: "When legal rules, civilian protection, authorization, and expected effects point in different directions, which should come first?",
        whatItDoesNotAsk: "The situation is limited to severe mass atrocities, not ordinary intervention or regime change without a time limit.",
        terms: [
          { term: "Authorization for action", definition: "Formal approval that publicly and narrowly defines the purpose and scope of action." },
        ],
      },
      options: [
        { id: "precedent", title: "Hold the intervention threshold", label: "If this case easily crosses the non-intervention boundary, later abuses of the precedent may cause greater harm." },
        { id: "protection", title: "Protect civilians first", label: "When civilian harm reaches an extreme level, the moral case for saving people can outweigh the normal presumption against intervention." },
        { id: "mandate", title: "Examine the basis of authorization", label: "The decisive question is whether there is a narrowly defined and legitimate authorization; emergency action has a stronger case when its aims are limited and collectively framed." },
        { id: "consequences", title: "Look first at actual effects", label: "First ask whether force is genuinely likely to protect civilians rather than widen the conflict or create a greater disaster." },
      ],
    },
  },
  {
    questionId: "case_semiconductors",
    backTranslation: {
      prompt: "A rival is narrowing the gap in advanced semiconductors while domestic firms depend on the rival's supply chain. What goal should come first in the response?",
      helpText: "Choose the primary goal of the response.",
      options: [
        { id: "edge", title: "Keep the strategic advantage", label: "Impose broad restrictions now; the rival narrowing the capability gap is itself a threat, and trade costs should yield to maintaining strategic leadership." },
        { id: "dependence", title: "Reduce structural dependence", label: "The central contest is over who controls production bottlenecks. Expand domestic capacity and gradually unwind one-sided dependence." },
        { id: "coalition", title: "Set precise limits with allies", label: "Control only the highest-risk technologies and coordinate with allies; broad unilateral restrictions will tear at an international order that is still necessary." },
        { id: "framing", title: "Avoid securitizing everything", label: "Defining every technological gap as a security crisis will harden competition and reduce space for future cooperation." },
      ],
    },
  },
  {
    questionId: "case_protection",
    backTranslation: {
      prompt: "Mass killing continues. A Security Council veto prevents UN authorization, but a regional organization supports limited action. What should be decisive?",
      helpText: "Choose the principle that should come first.",
      clarification: {
        whatItAsks: "Which should be most decisive: UN authorization, stopping the killing, regional backing, or the risk of worsening the situation?",
        whatItDoesNotAsk: "Support from a regional organization is not equivalent to UN authorization.",
        terms: [
          { term: "Formal authorization", definition: "Formal approval given through the proper procedure by an authorized international body such as the UN Security Council." },
        ],
      },
      options: [
        { id: "law", title: "Preserve the legal process first", label: "Acting around the Security Council weakens the international legal framework on which weaker states rely against intervention." },
        { id: "moral", title: "Stop extreme harm first", label: "At an extreme level, humanitarian harm can outweigh the normal procedural objection; the scale of the atrocities changes how the general principle applies." },
        { id: "bounded", title: "Limited emergency legitimacy", label: "Regional support combined with tightly bounded authorization can justify emergency action without creating a general permission." },
        { id: "prudence", title: "Assess escalation and the aftermath", label: "First ask whether outside action will actually protect civilians rather than widen the conflict and leave a more severe political vacuum." },
      ],
    },
  },
] as const satisfies readonly FoundationBackTranslationRecord[]
