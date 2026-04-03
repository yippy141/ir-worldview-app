import type { ModuleDefinition } from "@/lib/modules/types"

const securityStandardQuestions: ModuleDefinition["questionsByMode"]["standard"] = [
  {
    id: "ukraine_termination",
    title: "Ukraine support and war termination",
    prompt:
      "The war is grinding on. Kyiv wants additional support, several European states fear attrition, and outside partners disagree on what a politically sustainable end state looks like. What is the strongest framing?",
    primer:
      "This asks what should anchor strategy under pressure: battlefield leverage, coalition durability, frontline reassurance, or war termination.",
    options: [
      {
        id: "pressure",
        title: "Shift the battlefield before the bargaining",
        label:
          "If Russian gains harden, every later settlement gets worse. More pressure now can improve the eventual bargaining range.",
        signals: { activism: 6.2, escalation: 5.8, alliance: 4.8 },
      },
      {
        id: "coalition",
        title: "Keep support tied to coalition endurance",
        label:
          "Sustain military backing, but keep the objective bounded enough that partners can carry it for years rather than weeks.",
        signals: { alliance: 6.0, activism: 4.8, escalation: 4.3, legitimacy: 4.5 },
      },
      {
        id: "frontline",
        title: "Frontline states need harder reassurance",
        label:
          "For countries living beside Russia, ambiguity is its own escalation risk. The priority is a posture that convinces exposed allies the line will hold.",
        signals: { alliance: 6.3, escalation: 5.2, activism: 5.3, legitimacy: 4.4 },
      },
      {
        id: "termination",
        title: "Cap the war before it widens further",
        label:
          "The deeper danger is a long war with expanding costs and shrinking diplomatic exits. War termination should come first.",
        signals: { activism: 2.8, escalation: 3.1, alliance: 3.8 },
      },
    ],
  },
  {
    id: "eastern_flank",
    title: "Eastern-flank reassurance",
    prompt:
      "After repeated sabotage scares and airspace incidents, a NATO state on the eastern flank asks for a more permanent allied presence. What is the strongest framing?",
    primer:
      "This asks whether security comes mainly from visible commitments, resilient reinforcement, local depth, or deliberate restraint.",
    options: [
      {
        id: "tripwire",
        title: "Make the promise visible",
        label:
          "A permanent forward presence matters because exposed allies need proof that any attack immediately implicates the wider alliance.",
        signals: { activism: 5.9, escalation: 6.1, alliance: 6.2 },
      },
      {
        id: "resilience",
        title: "Build depth, mobility, and reinforcement",
        label:
          "The strongest deterrent is not symbolism alone but a posture partners can reinforce quickly and sustain politically.",
        signals: { alliance: 6.1, activism: 4.7, escalation: 4.9, legitimacy: 4.4 },
      },
      {
        id: "local_capacity",
        title: "Local capacity has to come first",
        label:
          "Frontline states should invest first in their own mobilization, civil defense, and denial capacity rather than assuming outsiders will carry the burden.",
        signals: { alliance: 2.9, activism: 4.4, escalation: 4.7 },
      },
      {
        id: "limits",
        title: "Do not turn every incident into a test",
        label:
          "A thicker posture can calm allies, but it can also harden routine escalation. Reassurance should stay paired with explicit limits.",
        signals: { activism: 3.1, escalation: 3.4, alliance: 4.2, legitimacy: 4.5 },
      },
    ],
  },
  {
    id: "taiwan_blockade",
    title: "Taiwan deterrence and blockade pressure",
    prompt:
      "Concern rises that Beijing could use blockade pressure or coercive quarantine rather than immediate invasion. What should drive policy first?",
    primer:
      "This case asks whether deterrence works mainly through clearer commitments, coalition denial, regional hedging, or wider legitimacy costs.",
    options: [
      {
        id: "clarity",
        title: "Reduce ambiguity about response",
        label:
          "Visible resolve lowers the chance that Beijing mistakes caution for unwillingness to respond.",
        signals: { activism: 6.1, escalation: 6.2, alliance: 5.1 },
      },
      {
        id: "denial",
        title: "Build a denial coalition",
        label:
          "The most credible answer is a coalition that can absorb a blockade, coordinate sanctions, and sustain pressure over time.",
        signals: { alliance: 6.3, activism: 5.3, escalation: 5.2 },
      },
      {
        id: "hedging",
        title: "Keep room for regional hedging",
        label:
          "Many Asian states want coercion resisted without being locked into a maximal military coalition they cannot control.",
        signals: { activism: 3.0, escalation: 3.5, alliance: 3.2, legitimacy: 4.9 },
      },
      {
        id: "legitimacy",
        title: "Make coercion politically and economically costly",
        label:
          "The key is to widen the diplomatic and economic cost of coercion while keeping direct military commitments carefully bounded.",
        signals: { legitimacy: 6.0, alliance: 5.1, activism: 4.2, escalation: 4.0 },
      },
    ],
  },
  {
    id: "maritime_coercion",
    title: "Maritime coercion short of alliance",
    prompt:
      "A Southeast Asian state faces repeated maritime pressure from a much larger power. It wants support, but not formal bloc alignment. What is the strongest framing?",
    primer:
      "This asks how smaller states should think about autonomy, outside support, law, and local capacity under persistent coercion.",
    options: [
      {
        id: "external_balancing",
        title: "Outside balancing is unavoidable",
        label:
          "Without harder external backing, legal claims and coast guards will not offset material asymmetry for long.",
        signals: { alliance: 6.2, activism: 5.1, escalation: 5.4 },
      },
      {
        id: "autonomy",
        title: "Protect room for hedging",
        label:
          "Smaller states often survive by diversifying ties and avoiding formal alignment that would narrow their diplomatic options.",
        signals: { alliance: 2.8, escalation: 4.0, activism: 3.5, legitimacy: 4.8 },
      },
      {
        id: "multilateral",
        title: "Multilateralize the pressure",
        label:
          "The most durable answer is to widen the political cost of coercion through legal rulings, regional diplomacy, and collective monitoring.",
        signals: { legitimacy: 5.9, alliance: 5.0, activism: 4.0 },
      },
      {
        id: "self_strengthening",
        title: "Invest in denial at home",
        label:
          "The priority is resilient local capacity: coastal defense, surveillance, and economic shock absorption.",
        signals: { alliance: 3.5, activism: 4.8, escalation: 4.6, legitimacy: 4.3 },
      },
    ],
  },
  {
    id: "iran_threshold",
    title: "Iran's nuclear threshold and preventive force",
    prompt:
      "Iran moves closer to a nuclear threshold. Inspections strain, regional partners push for harder measures, and preventive force returns to the table. Which framing is strongest?",
    primer:
      "This asks what matters most when deterrence, legitimacy, and preventive action all look incomplete.",
    options: [
      {
        id: "preventive",
        title: "Keep preventive force credible",
        label:
          "A believable willingness to strike is necessary because once threshold status is normalized, diplomacy loses leverage fast.",
        signals: { activism: 6.4, escalation: 6.0, alliance: 4.7 },
      },
      {
        id: "coercive_diplomacy",
        title: "Use hard coercive diplomacy",
        label:
          "Sustained pressure, regional deterrence, and constrained bargaining are stronger than either passivity or immediate force.",
        signals: { activism: 5.2, escalation: 4.9, alliance: 5.4, legitimacy: 4.5 },
      },
      {
        id: "containment",
        title: "Set a high bar for force",
        label:
          "The first goal is to avoid creating a wider war. Containment and patient pressure are safer than preventive action.",
        signals: { activism: 2.7, escalation: 3.2, alliance: 4.0 },
      },
      {
        id: "inspection",
        title: "Preserve inspection authority and legitimacy",
        label:
          "Broader legitimacy, inspection credibility, and coordinated pressure matter more than acting early without sustainable backing.",
        signals: { legitimacy: 6.1, alliance: 5.0, activism: 4.0 },
      },
    ],
  },
  {
    id: "red_sea",
    title: "Maritime chokepoints and limited strikes",
    prompt:
      "Shipping attacks around a major maritime chokepoint continue. Several governments support limited strikes; others warn about mission creep and regional backlash. Which framing is strongest?",
    primer:
      "This asks whether order is best protected through quick punishment, a bounded coalition mission, restraint, or stronger regional legitimacy.",
    options: [
      {
        id: "restore_deterrence",
        title: "Restore deterrence quickly",
        label:
          "If attacks on commercial shipping become routine, the cost of delayed response compounds across the whole system.",
        signals: { activism: 5.9, escalation: 5.6, legitimacy: 4.2 },
      },
      {
        id: "defensive_coalition",
        title: "Protect the route, not the whole conflict",
        label:
          "A narrow multinational defensive mission is stronger than treating every proxy attack as a reason to widen the war.",
        signals: { alliance: 6.0, activism: 4.5, escalation: 4.1, legitimacy: 5.0 },
      },
      {
        id: "limit_theater",
        title: "Do not let a side theater set the agenda",
        label:
          "The bigger danger is being pulled into a broader regional war through incremental retaliation.",
        signals: { activism: 2.8, escalation: 3.0, alliance: 3.9 },
      },
      {
        id: "regional_legitimacy",
        title: "Regional backing determines durability",
        label:
          "Maritime order is easier to defend when nearby states see the mission as protecting commerce rather than imposing another outside campaign.",
        signals: { legitimacy: 6.0, alliance: 4.8, escalation: 4.2 },
      },
    ],
  },
  {
    id: "civilian_protection",
    title: "Mass atrocity and outside action",
    prompt:
      "Mass civilian killing is underway, but the Security Council is blocked and outside military action would be contested. What is the strongest framing?",
    primer:
      "This asks how you weigh order, protection, regional authority, and escalation when legal and moral signals point in different directions.",
    options: [
      {
        id: "order_bar",
        title: "The bar for force remains high",
        label:
          "However terrible the case, overriding sovereignty without durable legal and political grounding can damage order beyond the immediate crisis.",
        signals: { legitimacy: 2.8, activism: 3.4, escalation: 4.0 },
      },
      {
        id: "limited_protection",
        title: "Protection can justify limited force",
        label:
          "If the threshold is truly extreme, narrow action to stop mass killing can be defensible even without perfect consensus.",
        signals: { legitimacy: 6.3, activism: 5.4, escalation: 4.2 },
      },
      {
        id: "regional_lead",
        title: "Regional actors should define the mission",
        label:
          "External action is more defensible when the most affected regional states define the aim, ceiling, and exit conditions.",
        signals: { legitimacy: 5.7, alliance: 5.0, activism: 4.6 },
      },
      {
        id: "civilian_relief",
        title: "Reduce harm without opening a larger war",
        label:
          "Humanitarian corridors, sanctions, and documentation may achieve less, but they avoid normalizing poorly bounded intervention.",
        signals: { activism: 3.0, escalation: 3.4, legitimacy: 4.6 },
      },
    ],
  },
  {
    id: "synthesis",
    kind: "synthesis",
    title: "Cross-case synthesis",
    prompt: "Across these cases, what recurring failure worries you most?",
    primer:
      "This final question is meant to surface the instinct you carry across different security problems.",
    options: [
      {
        id: "undeterrence",
        title: "Under-deterrence",
        label:
          "If adversaries doubt resolve, they press harder and make every later correction more expensive.",
        signals: { activism: 6.2, escalation: 6.1, alliance: 5.0 },
      },
      {
        id: "overreach",
        title: "Overreach and escalation",
        label:
          "The sharper danger is widening wars, unsustainable commitments, and strategic exhaustion.",
        signals: { activism: 2.7, escalation: 3.0, alliance: 4.0 },
      },
      {
        id: "alliance",
        title: "Alliance fragmentation",
        label:
          "Security strategy fails when coalitions split, signals diverge, and exposed partners stop trusting the larger grouping.",
        signals: { alliance: 6.4, activism: 4.8, legitimacy: 4.6 },
      },
      {
        id: "legitimacy",
        title: "Legitimacy decay",
        label:
          "Coercive strategy rarely holds if it sheds legitimacy faster than it produces durable order.",
        signals: { legitimacy: 6.2, activism: 4.3, escalation: 4.0 },
      },
    ],
  },
]

const securityAnalystAdditions: ModuleDefinition["questionsByMode"]["analyst"] = [
  {
    id: "sanctions_enforcement",
    title: "Sanctions leakage and swing states",
    prompt:
      "A coalition wants third-country firms and ports to enforce sanctions more tightly. Several swing states say that looks like wealthy powers exporting their war discipline. What is the strongest framing?",
    primer:
      "This case asks whether leakage, coalition breadth, autonomy, or legal grounding should dominate the argument.",
    allowSecondChoiceInAnalyst: true,
    options: [
      {
        id: "secondary_pressure",
        title: "Leakage has to carry a cost",
        label:
          "Sanctions lose strategic meaning when outside actors can profit from evasion without consequence.",
        signals: { activism: 5.6, alliance: 5.3, escalation: 5.0 },
      },
      {
        id: "coalition_breadth",
        title: "Preserve the coalition's political breadth",
        label:
          "A broad but imperfect coalition often lasts longer than a cleaner coalition built on coercing reluctant states.",
        signals: { alliance: 6.2, legitimacy: 5.2, activism: 4.4 },
      },
      {
        id: "autonomy_space",
        title: "Swing states will protect autonomy",
        label:
          "Many middle powers will resist being turned into enforcement arms for conflicts they do not fully own.",
        signals: { alliance: 2.9, legitimacy: 4.8, escalation: 3.8 },
      },
      {
        id: "legal_authority",
        title: "Legitimacy depends on clear legal grounding",
        label:
          "The more coercive the enforcement, the more it needs a clear public legal basis rather than improvised pressure.",
        signals: { legitimacy: 6.2, alliance: 4.7, activism: 4.0 },
      },
    ],
  },
  {
    id: "nuclear_hedging",
    title: "Extended deterrence and nuclear hedging",
    prompt:
      "An exposed ally begins debating an independent nuclear option because it no longer fully trusts extended deterrence. What is the strongest framing?",
    primer:
      "This asks how you balance reassurance, nonproliferation, autonomy, and arms control when the guarantee itself is in doubt.",
    allowSecondChoiceInAnalyst: true,
    options: [
      {
        id: "reinforce_umbrella",
        title: "Make the outside guarantee unmistakable",
        label:
          "The priority is to restore confidence in extended deterrence before doubts cascade into regional proliferation.",
        signals: { alliance: 6.4, escalation: 5.8, activism: 5.3 },
      },
      {
        id: "latency",
        title: "Tolerate hedging short of weaponization",
        label:
          "Some allies will want a latent option even if they stop short of crossing the line. That may be politically unavoidable.",
        signals: { alliance: 3.4, escalation: 4.8, activism: 4.2, legitimacy: 4.5 },
      },
      {
        id: "arms_control",
        title: "Rebuild regional arms control and assurance",
        label:
          "The answer is a political framework that lowers demand for new arsenals rather than assuming every credibility problem needs harder posture.",
        signals: { legitimacy: 5.7, alliance: 4.9, activism: 3.8, escalation: 3.9 },
      },
      {
        id: "nonproliferation",
        title: "Stop the proliferation cascade early",
        label:
          "The wider regional danger is the spread of nuclear latency itself, even if current fears about abandonment are understandable.",
        signals: { legitimacy: 5.4, alliance: 5.5, activism: 4.8, escalation: 4.7 },
      },
    ],
  },
  {
    id: "gray_zone_retaliation",
    title: "Gray-zone sabotage and retaliation",
    prompt:
      "A rival is linked to cyber disruption and undersea infrastructure sabotage, but attribution remains politically contested. What is the strongest framing?",
    primer:
      "This case asks whether the best answer is retaliation, coalition attribution, resilience, or a high threshold for crossing into overt response.",
    allowSecondChoiceInAnalyst: true,
    options: [
      {
        id: "retaliate",
        title: "Retaliate in a calibrated way",
        label:
          "Letting gray-zone attacks accumulate without visible cost invites further testing under the cover of ambiguity.",
        signals: { activism: 5.7, escalation: 5.4, legitimacy: 4.2 },
      },
      {
        id: "joint_attribution",
        title: "Attribute with partners before acting",
        label:
          "Shared attribution and coordinated response matter because the political meaning of the incident is part of the deterrent signal.",
        signals: { alliance: 6.0, legitimacy: 5.0, activism: 4.5 },
      },
      {
        id: "resilience",
        title: "Resilience is the first line of defense",
        label:
          "Hardening infrastructure and recovery capacity may matter more than dramatic retaliation in an ambiguous domain.",
        signals: { activism: 3.0, escalation: 3.6, alliance: 4.6 },
      },
      {
        id: "high_threshold",
        title: "Keep the threshold for overt retaliation high",
        label:
          "Ambiguity is exactly why states should resist being maneuvered into visible escalation on incomplete evidence.",
        signals: { legitimacy: 5.8, escalation: 3.8, activism: 3.4 },
      },
    ],
  },
  {
    id: "middle_power_alignment",
    title: "Middle-power alignment under pressure",
    prompt:
      "A middle power wants security ties with Washington, trade with China, and no formal bloc discipline. What is the strongest framing?",
    primer:
      "This asks whether alignment, layered partnerships, autonomy, or issue-based coalitions best fit a world of sharper competition.",
    allowSecondChoiceInAnalyst: true,
    options: [
      {
        id: "camp_choice",
        title: "Partners eventually have to choose",
        label:
          "When rivalry sharpens, strategic ambiguity becomes a liability. Security partners need to know where the line really is.",
        signals: { alliance: 6.2, escalation: 5.4, activism: 5.0 },
      },
      {
        id: "layered_alignment",
        title: "Allow layered alignment",
        label:
          "States can be security partners in one domain, economic partners in another, and still remain useful coalition members.",
        signals: { alliance: 5.1, legitimacy: 4.7, activism: 4.2 },
      },
      {
        id: "autonomy",
        title: "Autonomy is not fence-sitting",
        label:
          "Many states are managing vulnerability, not avoiding responsibility. For them, autonomy is a rational strategic posture.",
        signals: { alliance: 2.8, legitimacy: 5.2, escalation: 4.1 },
      },
      {
        id: "issue_coalitions",
        title: "Build narrow coalitions by problem",
        label:
          "Issue-specific coalitions are often more durable than demanding whole-of-state alignment across every file at once.",
        signals: { alliance: 4.8, legitimacy: 5.5, activism: 4.0 },
      },
    ],
  },
]

export const securityModule: ModuleDefinition = {
  slug: "security",
  shortTitle: "Security",
  title: "Security, Strategy, and Statecraft",
  timeEstimate: {
    standard: "7 to 9 minutes",
    analyst: "11 to 14 minutes",
  },
  description:
    "A beta module on deterrence, escalation, alliance politics, coercion, and the legitimacy of force in hard cases.",
  measures: [
    "restraint versus coercive activism",
    "credibility versus escalation aversion",
    "alliance-centered versus autonomy-sensitive instincts",
    "order and sovereignty versus protection and legitimacy",
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
  questionsByMode: {
    standard: securityStandardQuestions,
    analyst: [...securityStandardQuestions, ...securityAnalystAdditions],
  },
  interpret(scores) {
    const activism = scores.activism
    const escalation = scores.escalation
    const alliance = scores.alliance
    const legitimacy = scores.legitimacy

    if (activism >= 5.5 && escalation >= 5.3) {
      return {
        headline: "Credibility-first power balancer",
        summary:
          "You are comparatively willing to use pressure, visible resolve, and harder commitments to prevent revisionist gains.",
        instincts: [
          "You worry most about the cost of hesitation once a rival starts testing limits.",
          "You treat deterrence failures as harder to reverse than overcommitment.",
          "You are comfortable with coercive tools when they clarify commitment rather than blur it.",
        ],
        challenge:
          "This style can underrate how quickly credibility campaigns turn into escalation traps or politically unsustainable commitments.",
      }
    }

    if (activism <= 3.5 && escalation <= 3.8) {
      return {
        headline: "Restrained crisis manager",
        summary:
          "You put more weight on escalation control, war termination, and limiting commitments than on pressing every available strategic opening.",
        instincts: [
          "You look first for off-ramps, ceilings, and ways to keep crises bounded.",
          "You are skeptical that visible toughness automatically produces better outcomes.",
          "You see overextension as a strategic danger in its own right.",
        ],
        challenge:
          "This style can underrate the cumulative cost of under-deterrence when rivals conclude that caution will keep winning out.",
      }
    }

    if (alliance >= 5.6) {
      return {
        headline: "Alliance-first deterrence strategist",
        summary:
          "You think durable security comes less from unilateral sharpness than from coalitions that can coordinate signals, costs, and endurance over time.",
        instincts: [
          "You treat alliance coherence as a strategic asset, not diplomatic decoration.",
          "You look for policies that partners can sustain together rather than dramatic solo moves.",
          "You see burden-sharing and political alignment as part of deterrence itself.",
        ],
        challenge:
          "This style can assume more allied durability than actually exists when domestic politics diverge under pressure.",
      }
    }

    if (legitimacy >= 5.5) {
      return {
        headline: "Legitimacy-aware security strategist",
        summary:
          "You think force, deterrence, and alliance politics hold up only when they remain tied to a defensible political and legal frame.",
        instincts: [
          "You look for strategies that preserve legitimacy as well as leverage.",
          "You distinguish narrow, bounded coercion from open-ended authorization to act.",
          "You worry about how today's precedent changes tomorrow's harder cases.",
        ],
        challenge:
          "This style can overestimate how much legitimacy alone constrains rivals that are willing to bear reputational cost.",
      }
    }

    return {
      headline: "Conditional statecraft hedger",
      summary:
        "You do not carry one fixed security rule from case to case. You balance deterrence, escalation risk, coalition management, and legitimacy together.",
      instincts: [
        "You resist turning every crisis into a single test of resolve.",
        "You look for strategies that keep options open rather than settle the argument in advance.",
        "You expect the right answer to shift across theaters and political contexts.",
      ],
      challenge:
        "This style can leave your own threshold for decisive action harder to specify when a crisis suddenly sharpens.",
    }
  },
  compareToFoundation(scores, foundation) {
    const notes: string[] = []

    if (foundation.restraint >= 5.15 && scores.activism >= 5.2) {
      notes.push("In security crises, you are more coercive than your general foundation profile suggests.")
    } else if (foundation.restraint <= 3.85 && scores.activism <= 3.8) {
      notes.push("In security crises, you are more restrained than your general foundation profile suggests.")
    }

    if (foundation.orderJustice >= 5.15 && scores.legitimacy >= 5.1) {
      notes.push("Compared with your foundation result, this module makes you more willing to treat protection and legitimacy as active constraints.")
    } else if (foundation.orderJustice <= 3.85 && scores.legitimacy <= 4.2) {
      notes.push("Your module result reinforces a justice-sensitive baseline rather than pulling you back toward order-first caution.")
    }

    if (foundation.institutions >= 5 && scores.alliance >= 5.2) {
      notes.push("Your institutional instinct also stays visible here through coalition management and alliance design.")
    }

    return notes.join(" ")
  },
}
