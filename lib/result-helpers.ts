import { dimensionLabels } from "@/lib/quiz-schema"
import { familyDescriptions } from "@/lib/scoring"
import { familyLabel } from "@/lib/worldview-config"
import { DimensionKey, DimensionScores, FamilyKey, StrategyModifier, NormativeModifier } from "@/lib/types"

// ── Family labels ─────────────────────────────────────────────────────────────

export function familyLabelFromKey(key: FamilyKey): string {
  return familyLabel(key)
}

export { familyDescriptions }

// ── Modifier labels ───────────────────────────────────────────────────────────

export function strategyModifierLabel(sm: StrategyModifier): string {
  return sm
}

export function normativeModifierLabel(nm: NormativeModifier): string {
  return nm
}

// ── Plain-English summary ─────────────────────────────────────────────────────

const familyLogicPhrases: Record<FamilyKey, string> = {
  realist:
    "strategic realism — uncertainty, positional advantage, and the durability of interstate rivalry",
  institutionalist:
    "liberal institutionalism — rules-based cooperation, domestic filters, and strategic restraint",
  constructivist:
    "constructivism — the role of identity, recognition, and shared expectations in shaping how threats are perceived",
  criticalPoliticalEconomy:
    "critical political economy — production structures, financial dependence, and global economic hierarchy",
}

export function buildSummary(familyKey: FamilyKey, dimensionScores: DimensionScores): string {
  const top2 = getTopDimensions(dimensionScores, 2)
  const dim0 = dimensionLabels[top2[0]].toLowerCase()
  const dim1 = dimensionLabels[top2[1]].toLowerCase()
  return `You tend to see world politics primarily through ${familyLogicPhrases[familyKey]}. Your answers also show notable weight on ${dim1}. In practice, you seem most persuaded by arguments about ${dim0} and how it intersects with ${dim1}.`
}

// ── Key drivers ───────────────────────────────────────────────────────────────

const dimensionDriverLabels: Record<DimensionKey, (score: number) => string> = {
  securityCompetition: (s) =>
    s >= 5
      ? "Rivalry as a persistent constraint"
      : s <= 3
        ? "Skeptical of rivalry framing"
        : "Competition, conditionally",
  institutions: (s) =>
    s >= 5
      ? "Institutions matter independently"
      : s <= 3
        ? "Institutions as power mirrors"
        : "Institutions, but conditionally",
  domesticFilters: (s) =>
    s >= 5
      ? "Domestic politics as a real driver"
      : s <= 3
        ? "External constraints dominate"
        : "Domestic factors, selectively",
  normsIdentity: (s) =>
    s >= 5
      ? "Identity and legitimacy are causal"
      : s <= 3
        ? "Norms as rhetorical cover"
        : "Norms matter, within limits",
  politicalEconomy: (s) =>
    s >= 5
      ? "Political economy is central"
      : s <= 3
        ? "Security and diplomacy first"
        : "Economics matters, not dominant",
  restraint: (s) =>
    s >= 5
      ? "Restraint as the safer path"
      : s <= 3
        ? "Maximization under uncertainty"
        : "Hedging between options",
  orderJustice: (s) =>
    s >= 5
      ? "Order over universal justice"
      : s <= 3
        ? "Justice can override sovereignty"
        : "Order and justice in tension",
}

const dimensionDriverDescriptions: Record<DimensionKey, (score: number) => string> = {
  securityCompetition: (s) =>
    s >= 5
      ? "You treat uncertainty about rivals' future intentions as a structural feature of international politics — not a problem to be solved through reassurance alone."
      : s <= 3
        ? "You are not persuaded that security competition is the central organizing logic of world politics."
        : "You see interstate rivalry as real but not as the only lens worth applying to most situations.",
  institutions: (s) =>
    s >= 5
      ? "You think well-designed rules and institutions can shift incentives and make cooperation more durable, independently of which power happens to be strongest."
      : s <= 3
        ? "You are skeptical that institutions do much beyond reflecting what the dominant states already want."
        : "You think institutions can matter, but mostly when they are credible and not obviously controlled by the powerful.",
  domesticFilters: (s) =>
    s >= 5
      ? "You place real weight on how regime type, coalitions, and bureaucratic capacity shape what states actually do in foreign policy."
      : s <= 3
        ? "You think external constraints explain most foreign policy; domestic politics adds noise, not signal."
        : "You give domestic factors a meaningful role, especially when they clearly override structural pressures.",
  normsIdentity: (s) =>
    s >= 5
      ? "You think the meaning of threats and alliances is partly constituted by identity, legitimacy, and shared understandings — not just material facts."
      : s <= 3
        ? "You read appeals to norms and legitimacy as mostly rhetorical packaging for material interests."
        : "You give norms some independent weight, but you hedge against treating legitimacy claims as automatically causal.",
  politicalEconomy: (s) =>
    s >= 5
      ? "You think world politics cannot be understood without examining capitalism, production structures, finance, and the distribution of economic dependence."
      : s <= 3
        ? "You think security and diplomacy can be largely explained without foregrounding global economic hierarchy."
        : "You see political economy as one important lens among several — useful, but not the master key.",
  restraint: (s) =>
    s >= 5
      ? "You think the safer grand strategy is usually to avoid overextension and resist the temptation toward permanent primacy."
      : s <= 3
        ? "You think major powers should exploit windows of opportunity and press for durable advantage when they can."
        : "You hedge: restraint is often right, but the case for maximization turns on the specific situation.",
  orderJustice: (s) =>
    s >= 5
      ? "You think preserving international order — even imperfect order — is usually more valuable than pursuing universal moral obligations across borders."
      : s <= 3
        ? "You think justice concerns can legitimately override sovereignty when the moral stakes are high enough."
        : "You hold the order-justice tradeoff open — neither side dominates in your view.",
}

export type DriverCard = {
  dimension: DimensionKey
  type: string
  label: string
  description: string
}

export function getKeyDrivers(dimensionScores: DimensionScores): DriverCard[] {
  const top3 = getTopDimensions(dimensionScores, 3)
  const labels = ["Strongest signal", "Second signal", "Third signal"]
  return top3.map((dim, i) => ({
    dimension: dim,
    type: labels[i],
    label: dimensionDriverLabels[dim](dimensionScores[dim]),
    description: dimensionDriverDescriptions[dim](dimensionScores[dim]),
  }))
}

// ── Dimension one-liners ──────────────────────────────────────────────────────

export const dimensionOneLiners: Record<DimensionKey, (score: number) => string> = {
  securityCompetition: (s) =>
    s >= 5
      ? "You treat uncertainty about rivals' intentions as a durable constraint, not a solvable problem."
      : s <= 3
        ? "You are less persuaded that security competition defines the international system."
        : "You see interstate rivalry as real, but not as the single organizing principle.",
  institutions: (s) =>
    s >= 5
      ? "You think institutions can matter independently — not just as mirrors of great-power interests."
      : s <= 3
        ? "You are skeptical that institutions shape outcomes beyond what powerful states would do anyway."
        : "You think institutions can matter, but only when credible and not obviously captured.",
  domesticFilters: (s) =>
    s >= 5
      ? "You give real weight to how regime type, coalitions, and bureaucratic capacity shape foreign policy."
      : s <= 3
        ? "You think external constraints explain most foreign policy; domestic politics adds noise."
        : "You give domestic factors some role, especially when they clearly override structural pressures.",
  normsIdentity: (s) =>
    s >= 5
      ? "You think the meaning of threats and alliances depends partly on identities and shared expectations."
      : s <= 3
        ? "You read norms and legitimacy as mostly rhetorical cover for material interests."
        : "You give norms some independent weight, while remaining cautious about treating rhetoric as causal.",
  politicalEconomy: (s) =>
    s >= 5
      ? "You think world politics cannot be understood without examining capitalism, finance, and dependence."
      : s <= 3
        ? "You think security and diplomacy can be largely explained without foregrounding economic hierarchy."
        : "You see political economy as one important lens among several — not the master key.",
  restraint: (s) =>
    s >= 5
      ? "You think the safest grand strategy usually involves avoiding overextension and resisting primacy."
      : s <= 3
        ? "You think major powers should press for durable advantage when windows of opportunity open."
        : "You hedge: restraint is often right, but the case for maximization is situation-dependent.",
  orderJustice: (s) =>
    s >= 5
      ? "You think preserving international order — even imperfect order — is usually more valuable than enforcing universal justice."
      : s <= 3
        ? "You think justice can legitimately override sovereignty when the moral stakes are high enough."
        : "You hold the order-justice tradeoff open — you don't let either side dominate.",
}

// ── Tensions ──────────────────────────────────────────────────────────────────

export type TensionRule = {
  key: string
  condition: (d: DimensionScores) => boolean
  text: string
}

export const tensionRules: TensionRule[] = [
  {
    key: "institutions-security",
    condition: (d) => d.institutions >= 5 && d.securityCompetition >= 5,
    text: "You are not a pure institutionalist. When the issue turns strategic, rivalry reasserts itself — institutions matter to you, but so does positional advantage. This is a coherent but unstable position that depends heavily on which issues dominate.",
  },
  {
    key: "restraint-competition",
    condition: (d) => d.restraint >= 5 && d.securityCompetition >= 5,
    text: "You prefer restraint as a strategy, but you also take security competition seriously. In practice, knowing when to hold back and when a window demands action is the hardest strategic call — and your profile leaves that question open.",
  },
  {
    key: "order-norms",
    condition: (d) => d.orderJustice >= 5 && d.normsIdentity >= 5,
    text: "You value international order, yet you also think identity and legitimacy are causally real. The tension: stable order sometimes depends on setting aside the moral commitments that constructivist logic takes seriously.",
  },
  {
    key: "economy-institutions",
    condition: (d) => d.politicalEconomy >= 5 && d.institutions >= 5,
    text: "You think political economy is central, yet you also believe institutions can work. The tension is structural: if global financial architecture is systematically biased, reform from within is a slow and uncertain bet.",
  },
  {
    key: "justice-sovereignty",
    condition: (d) => d.orderJustice <= 3 && d.institutions >= 5,
    text: "You are willing to override sovereignty for justice, yet you also invest weight in institutions. Institutions, however, are largely built on the norm of sovereignty — a tension worth sitting with.",
  },
  {
    key: "domestic-realist",
    condition: (d) => d.domesticFilters >= 5 && d.securityCompetition >= 5,
    text: "You give real weight to domestic politics while also treating security competition as a persistent constraint. When they conflict, your answers suggest the dominant factor depends on the issue — which is realistic, but it means your framework is less predictive across cases.",
  },
]

export function getActiveTensions(dimensionScores: DimensionScores): TensionRule[] {
  return tensionRules.filter((rule) => rule.condition(dimensionScores))
}

// ── Neighbor overlap text ─────────────────────────────────────────────────────

export const neighborOverlapTexts: Partial<Record<FamilyKey, Partial<Record<FamilyKey, string>>>> =
  {
    realist: {
      institutionalist:
        "Both traditions take power seriously, but institutionalists believe rules can make cooperation more durable even under anarchy. Your runner-up score reflects some openness to that possibility — you are not a pure skeptic.",
      constructivist:
        "The overlap lies in a shared attention to uncertainty and threat perception, but where constructivists see socially constructed meanings, your instinct is to treat uncertainty as a structural constraint independent of social context.",
      criticalPoliticalEconomy:
        "Both traditions are skeptical of liberal optimism. The difference is the frame: you locate the problem in security competition and power, while critical PE locates it in economic structure and dependence.",
    },
    institutionalist: {
      realist:
        "You invest in institutions but also take power and rivalry seriously. The runner-up score reflects a realist undertow — you know institutions can be captured or bypassed, and that knowledge shapes which ones you trust.",
      constructivist:
        "Both traditions see more than just power at work in world politics. For constructivists, identity is the causal variable; for institutionalists, the causal weight falls on rules, enforcement, and repeated interaction.",
      criticalPoliticalEconomy:
        "Both care about domestic and transnational filters. The difference is emphasis: you focus on institutions and governance reform; critical PE focuses on the structural economic power that institutions often encode.",
    },
    constructivist: {
      realist:
        "You give serious weight to identity and legitimacy, but your runner-up score on realism suggests you have not fully set aside the logic of power and uncertainty — the two frameworks coexist uneasily in your profile.",
      institutionalist:
        "Both traditions see more than raw power at work. Where institutionalists emphasize repeated interaction and rules, you emphasize the identities and expectations that give those rules meaning in the first place.",
      criticalPoliticalEconomy:
        "Both traditions look beyond the state-as-billiard-ball. Your overlap with critical PE reflects an interest in how ideas, identity, and material structures interact — a productive tension in the critical IR literature.",
    },
    criticalPoliticalEconomy: {
      realist:
        "Both traditions are skeptical of liberal optimism, but for different reasons. Your runner-up score on realism suggests you also take security competition and power seriously — possibly as a complement to, not replacement for, structural economic analysis.",
      institutionalist:
        "You see political economy as primary, but your runner-up score reflects some belief that institutions — if genuinely reformed — could matter. The question your profile leaves open is whether that reform window is realistic.",
      constructivist:
        "Both traditions look beyond material power and security. Your overlap with constructivism reflects an interest in how ideas, legitimacy, and economic structures interact — a key area in critical IPE scholarship.",
    },
  }

// ── Glossary ──────────────────────────────────────────────────────────────────

export const glossaryTerms: { term: string; definition: string }[] = [
  {
    term: "Realism",
    definition:
      "A tradition that treats states as the primary actors in world politics, emphasizes the role of power and uncertainty, and is skeptical that institutions or norms can fully restrain competition.",
  },
  {
    term: "Institutionalism",
    definition:
      "An approach arguing that international institutions — treaties, organizations, rules — can make cooperation more durable even in the absence of a central authority to enforce them.",
  },
  {
    term: "Constructivism",
    definition:
      "A perspective emphasizing how the meaning of threats, alliances, and interests is shaped by identity, recognition, and shared social expectations — not just material facts.",
  },
  {
    term: "Political economy",
    definition:
      "An approach explaining world politics through structures of production, finance, trade dependence, and economic power rather than security competition alone.",
  },
  {
    term: "Pluralism",
    definition:
      "In normative IR theory, the view that international order rests on sovereign equality and non-intervention — states should not be forced to conform to a single standard of governance.",
  },
  {
    term: "Solidarism",
    definition:
      "The view that there are universal moral obligations that can, in extreme cases, override state sovereignty — for instance, to stop mass atrocities.",
  },
  {
    term: "Restraint",
    definition:
      "A grand-strategy disposition that favors limiting military commitments, avoiding overextension, and resisting the temptation to seek permanent primacy.",
  },
]

// ── Suggested reading ─────────────────────────────────────────────────────────

export const suggestedReadings: Record<
  FamilyKey,
  { title: string; author: string; note: string }[]
> = {
  realist: [
    {
      title: "The Tragedy of Great Power Politics",
      author: "John Mearsheimer",
      note: "The clearest statement of offensive realism and why major powers rarely stop competing.",
    },
    {
      title: "Theory of International Politics",
      author: "Kenneth Waltz",
      note: "The foundational text of structural realism — why the distribution of power shapes state behavior regardless of intentions.",
    },
    {
      title: "The Peloponnesian War",
      author: "Thucydides",
      note: "The original source text for realist intuitions about fear, honor, and interest as drivers of conflict.",
    },
  ],
  institutionalist: [
    {
      title: "After Hegemony",
      author: "Robert Keohane",
      note: "The core argument for why international institutions can sustain cooperation even without a dominant enforcer.",
    },
    {
      title: "Designing Social Inquiry",
      author: "King, Keohane & Verba",
      note: "Not IR theory directly, but the methodological backbone of much liberal IR scholarship.",
    },
    {
      title: "The Great Transformation",
      author: "Karl Polanyi",
      note: "A historical argument for how markets and governance co-evolve — relevant to why domestic filters and transnational actors matter.",
    },
  ],
  constructivist: [
    {
      title: "Anarchy Is What States Make of It",
      author: "Alexander Wendt",
      note: "The article that put constructivism on the mainstream IR map — argues that anarchy's meaning depends on social interaction.",
    },
    {
      title: "The Culture of National Security",
      author: "ed. Peter Katzenstein",
      note: "A set of empirical applications of constructivist ideas to security policy in concrete cases.",
    },
    {
      title: "Social Theory of International Politics",
      author: "Alexander Wendt",
      note: "The full theoretical treatment of how identity constitutes interests in world politics.",
    },
  ],
  criticalPoliticalEconomy: [
    {
      title: "States and Markets",
      author: "Susan Strange",
      note: "The argument that financial structures create power independent of formal authority — still the sharpest introduction to structural power.",
    },
    {
      title: "Global Political Economy",
      author: "Robert Gilpin",
      note: "A readable overview of the three main approaches — realist, liberal, and Marxist — to international economic order.",
    },
    {
      title: "Development as Freedom",
      author: "Amartya Sen",
      note: "A normative and empirical complement that asks what development is actually for, beyond growth metrics.",
    },
  ],
}

// ── Shared helpers ────────────────────────────────────────────────────────────

export function getTopDimensions(scores: DimensionScores, n: number): DimensionKey[] {
  return (Object.entries(scores) as [DimensionKey, number][])
    .sort((a, b) => Math.abs(b[1] - 4) - Math.abs(a[1] - 4))
    .slice(0, n)
    .map(([key]) => key)
}
