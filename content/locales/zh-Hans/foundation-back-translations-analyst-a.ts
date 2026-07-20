import type { FoundationBackTranslationRecord } from "@/content/locales/zh-Hans/foundation-types"

export const zhHansFoundationAnalystBackTranslationsA = [
  {
    questionId: "an_sc3",
    backTranslation: {
      prompt: "The long continuation of peace among major powers often depends on conditions that may weaken or disappear.",
      clarification: {
        whatItAsks: "Does major-power peace rely on supporting conditions that are not permanently reliable?",
      },
    },
  },
  {
    questionId: "an_in3",
    backTranslation: {
      prompt: "Many international institutional arrangements mainly give expression to the preexisting wishes of powerful states.",
      clarification: {
        whatItAsks: "Do international institutions themselves change state behavior, or mainly reflect the settled preferences of powerful states?",
      },
    },
  },
  {
    questionId: "an_pe3",
    backTranslation: {
      prompt: "In most international crises, who controls credit, productive capacity, and market access usually matters less than the immediate security and diplomatic situation.",
      clarification: {
        whatItAsks: "When a crisis is moving quickly, do security and diplomatic factors usually explain the situation better than economic interdependence does?",
      },
    },
  },
  {
    questionId: "an_oj3",
    backTranslation: {
      prompt: "International relations should normally treat freedom from outside intervention in a state's internal affairs as a strong basic principle.",
      clarification: {
        whatItAsks: "Should non-intervention be the normal position even in morally very difficult cases?",
        terms: [
          { term: "Principle of non-intervention", definition: "The principle that outside states should not ordinarily use force or coercion within another state's territory." },
        ],
      },
    },
  },
  {
    questionId: "an_sc4",
    backTranslation: {
      prompt: "When a state's public statements and actual troop deployments are inconsistent, it is usually safer to judge the direction of policy from the deployments.",
      clarification: {
        whatItAsks: "When political words conflict with military deployments, should actual deployments be trusted more?",
      },
    },
  },
  {
    questionId: "an_ni3",
    backTranslation: {
      prompt: "Disputes between states over status and recognition are not merely rhetorical packaging; they may genuinely indicate a rival's future behavior.",
      clarification: {
        whatItAsks: "Do status and recognition disputes contain information useful for judging a rival's future actions?",
      },
    },
  },
  {
    questionId: "an_pe4",
    backTranslation: {
      prompt: "The future formation of geopolitical power will depend more deeply on who controls technical standards, digital platforms, and data, not only on military and territorial competition.",
      clarification: {
        whatItAsks: "Will control over technical standards, platforms, and data affect international power more deeply than military strength and territory do?",
      },
    },
  },
  {
    questionId: "an_in4",
    backTranslation: {
      prompt: "When rules are mainly written by a few powerful states and others can only accept them, the legitimacy of international institutions erodes faster.",
      clarification: {
        whatItAsks: "When most states lack a voice in making the rules, are the institutions more likely to lose support and compliance?",
      },
    },
  },
  {
    questionId: "an_tradeoff_legitimacy",
    backTranslation: {
      prompt: "A global institution operates reasonably well, but rising powers increasingly question its legitimate basis. What best explains the problem?",
      options: [
        { id: "governance", title: "Its governance has not kept up with change", label: "Voting weights, access to leadership, and transparency rules have not adjusted enough, so institutional credibility is declining." },
        { id: "exclusion", title: "Its shared basis of identification is contested", label: "The institution carries particular norms and voices that other participants never truly regarded as neutral or universal." },
        { id: "power", title: "Power changed before the institutional dispute", label: "When the old institution is no longer as beneficial, states turn to legitimacy language; the underlying change remains a shift in power." },
        { id: "hierarchy", title: "The institution has always sat within an unequal system", label: "The institution is embedded in a broader hierarchy of finance, production, and agenda-setting; changing procedure alone is insufficient." },
      ],
    },
  },
  {
    questionId: "an_tradeoff_rival",
    backTranslation: {
      prompt: "A long-standing rival undergoes a democratic transition, joins major international organizations, and begins sending more cooperative signals. How much should the original threat judgment be updated?",
      options: [
        { id: "update", title: "Substantially revise the threat judgment", label: "Changes in regime, elite discourse, and relationship history are substantive evidence for judging future behavior." },
        { id: "minimal", title: "Make only a cautious revision", label: "Capabilities and structural incentives remain more reliable, and political signals may reverse quickly." },
        { id: "integration", title: "Watch the depth of institutional integration", label: "Participation in shared institutions changes incentives and raises the cost of aggression, so it says more than verbal declarations of values." },
        { id: "durability", title: "Watch whether domestic politics can sustain the change", label: "The key is whether the new course is rooted in stable domestic coalitions rather than lasting only one leadership cycle." },
      ],
    },
  },
  {
    questionId: "an_case_finance",
    backTranslation: {
      prompt: "A middle-income state experiences capital outflow and creditor pressure for fiscal austerity, leaving its economy near collapse. Which reading is most persuasive?",
      helpText: "Choose the judgment that best explains the crisis.",
      options: [
        { id: "credibility", title: "Domestic policy lost credibility", label: "External pressure exposed internal fragility; restoring policy credibility is the first condition for exiting the crisis." },
        { id: "pragmatic", title: "Domestic and structural problems are intertwined", label: "The crisis has both domestic and structural causes. Temporary controls and renegotiation are appropriate while seeking repair within the existing system." },
        { id: "dependence", title: "Structural dependence has been exposed", label: "The crisis comes from dependence on external capital and creditor leverage; without structural change, similar crises will recur." },
        { id: "coalitions", title: "Domestic politics distributes the adjustment costs", label: "External financial pressure limits the room for action, while domestic politics decides which groups bear the cost." },
      ],
    },
  },
  {
    questionId: "an_case_burdens",
    backTranslation: {
      prompt: "An important ally has long underinvested in defense while continuing to rely on this state's security guarantee. What response is most persuasive?",
      helpText: "Set aside your feelings about the ally and choose a policy response.",
      options: [
        { id: "credibility", title: "Free-riding erodes the credibility of deterrence", label: "A long-term imbalance in burdens damages collective defense and ultimately weakens deterrence itself." },
        { id: "capacity", title: "Look at shared capability, not only spending shares", label: "Ask whether the alliance still produces usable capability and effective coordination, not whether each member contributes the same proportion." },
        { id: "purpose", title: "The parties do not share a view of the alliance's purpose", label: "Surface disputes over burdens often come from disagreement about the alliance's goal and whose strategy it serves." },
        { id: "rebalance", title: "The security guarantor is already overextended", label: "Narrow commitments first; an alliance that can survive only on an unsustainable security guarantee has a flawed arrangement." },
      ],
    },
  },
] as const satisfies readonly FoundationBackTranslationRecord[]
