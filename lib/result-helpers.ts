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

// ── Subtradition affinity ─────────────────────────────────────────────────────

export type SubtraditionAffinity = {
  name: string
  note: string
}

export function getSubtraditionAffinity(
  familyKey: FamilyKey,
  d: DimensionScores,
): SubtraditionAffinity | null {
  switch (familyKey) {
    case "realist":
      if (d.restraint >= 5)
        return {
          name: "Defensive realism",
          note:
            "Your restraint score is notably high for a realist. Defensive realists argue that the structure of anarchy often rewards restraint — that overextension and offensive moves provoke balancing coalitions more than they produce durable security. This is consistent with your profile.",
        }
      if (d.restraint <= 3)
        return {
          name: "Offensive realism",
          note:
            "Your low restraint score within a realist frame points toward offensive realism: the structure of anarchy pushes major powers to maximize power because there is no safe stopping point. Windows of opportunity should be exploited.",
        }
      if (d.domesticFilters >= 5)
        return {
          name: "Classical realism",
          note:
            "A realist who also gives weight to domestic politics and statecraft leans toward the classical tradition — Morgenthau's emphasis on prudence, leadership, and the human drives behind power competition, rather than purely structural accounts.",
        }
      return {
        name: "Structural realism",
        note:
          "Your profile fits the mainstream structural realist position: the distribution of power and the condition of anarchy explain most of what matters, with relatively little variance from domestic or ideational factors.",
      }

    case "institutionalist":
      if (d.domesticFilters >= 5 && d.institutions >= 5)
        return {
          name: "Two-level game / democratic peace",
          note:
            "You give high weight to both institutions and domestic politics — the combination that characterizes the democratic peace and two-level game strands of liberal institutionalism. Domestic constraints are not noise; they shape what governments can credibly commit to internationally.",
        }
      if (d.domesticFilters >= 5)
        return {
          name: "Liberal internationalism (domestic emphasis)",
          note:
            "Your high domestic-filters score alongside institutionalist leanings places you closer to the liberal internationalist tradition that emphasizes regime type, public opinion, and two-level constraints rather than purely organizational design.",
        }
      return {
        name: "Neoliberal institutionalism",
        note:
          "Your profile matches the core neoliberal institutionalist position: international organizations and regimes can lower the cost of cooperation and make compliance more durable, even in the absence of a dominant enforcer.",
      }

    case "constructivist":
      if (d.politicalEconomy >= 5)
        return {
          name: "Critical constructivism",
          note:
            "Your constructivism has a material-structural edge: you think norms and identities matter, but you also ask whose interests prevailing norms serve. This places you in the critical constructivist strand, which is skeptical of treating 'good norms' as unambiguously emancipatory.",
        }
      if (d.normsIdentity >= 6)
        return {
          name: "Conventional constructivism",
          note:
            "A strong normsIdentity score combined with a constructivist primary classification fits the mainstream conventional strand: norms and identities are empirically important variables that shape what counts as a legitimate policy option.",
        }
      return {
        name: "Soft constructivism",
        note:
          "You lean constructivist but with moderate scores — suggesting an openness to ideational explanations without fully committing to identity as the master variable. This is sometimes called 'soft' or 'thin' constructivism.",
      }

    case "criticalPoliticalEconomy":
      if (d.domesticFilters >= 5)
        return {
          name: "Dependency theory / development focus",
          note:
            "Your attention to domestic political economy alongside global structures is consistent with the dependency theory strand — which emphasizes how core-periphery dynamics are reproduced through domestic class coalitions and development policy, not just external imposition.",
        }
      if (d.institutions >= 4.5)
        return {
          name: "Structural power / IPE",
          note:
            "You score higher on institutions than most critical PE adherents, suggesting an orientation closer to Strange's structural power framework — which takes international institutions seriously as sites of structural power rather than dismissing them entirely.",
        }
      return {
        name: "Marxist / world-systems",
        note:
          "Your skepticism of institutions combined with high political-economy salience fits the Marxist and world-systems strand: global capitalism reproduces core-periphery hierarchy through the structure of production and finance, and reform from within existing institutions is a limited bet.",
      }
  }
}

// ── Issue-area tilts ──────────────────────────────────────────────────────────

export type IssueTilt = {
  issue: string
  tilt: string
  note: string
}

export function getIssueAreaTilts(familyKey: FamilyKey, d: DimensionScores): IssueTilt[] {
  const tilts: IssueTilt[] = []

  // Cross-cutting patterns that surface regardless of primary family
  if (familyKey === "realist" && d.institutions >= 5) {
    tilts.push({
      issue: "Trade and economic governance",
      tilt: "Institutionalist undertow",
      note:
        "Your realist primary is tempered by a notably high institutions score. On trade and economic governance — where enforcement is easier and stakes lower than in security — your instinct may be more institutionalist than your primary classification suggests.",
    })
  }

  if (familyKey === "realist" && d.normsIdentity >= 5) {
    tilts.push({
      issue: "Alliance management",
      tilt: "Identity-sensitive",
      note:
        "Realists who also score high on normsIdentity often hold a more textured view of alliances — one that includes legitimacy, shared identity, and mutual recognition, not just capability aggregation. On alliance politics, your instinct may draw more on constructivist logic than on pure power accounting.",
    })
  }

  if (familyKey === "institutionalist" && d.securityCompetition >= 5) {
    tilts.push({
      issue: "Hard security and military competition",
      tilt: "Realist undertow",
      note:
        "Your institutionalist primary has a realist undertow on security: when strategic competition intensifies, your scores suggest you are less confident that institutions can hold. On military competition and major-power deterrence, your instincts may lean more realist than your overall classification.",
    })
  }

  if (familyKey === "institutionalist" && d.politicalEconomy >= 5) {
    tilts.push({
      issue: "Global finance and development",
      tilt: "Critical PE awareness",
      note:
        "An institutionalist who also scores high on political economy holds a more critical view of international economic institutions — aware that they encode structural advantages for some states. On IMF conditionality, debt relief, or development finance, your instincts may diverge from mainstream liberal institutionalism.",
    })
  }

  if (familyKey === "constructivist" && d.politicalEconomy >= 5) {
    tilts.push({
      issue: "Trade and economic rules",
      tilt: "Structural economic skepticism",
      note:
        "Your constructivism is inflected by political-economy awareness. On trade rules and financial governance, you are likely to ask not just 'are these legitimate norms?' but 'whose interests do these norms serve?' — a critical IPE question embedded in a constructivist frame.",
    })
  }

  if (familyKey === "constructivist" && d.securityCompetition >= 5) {
    tilts.push({
      issue: "Great-power competition",
      tilt: "Security-realist tilt",
      note:
        "Your constructivism coexists with a notable security-competition score. On great-power rivalry, you may read threat construction and identity politics as causally real while also recognizing that the material distribution of capabilities creates genuine constraints on what social change can achieve.",
    })
  }

  if (familyKey === "criticalPoliticalEconomy" && d.institutions >= 4.5) {
    tilts.push({
      issue: "International economic reform",
      tilt: "Reform-oriented",
      note:
        "Your critical PE primary is moderated by a relatively high institutions score — unusual in this tradition. On reform questions (IMF governance, WTO dispute mechanisms, climate finance), your instinct may be more reformist than transformational, suggesting openness to institutional change from within.",
    })
  }

  if (familyKey === "criticalPoliticalEconomy" && d.normsIdentity >= 5) {
    tilts.push({
      issue: "Human rights and humanitarian norms",
      tilt: "Norm-sensitive",
      note:
        "Critical PE adherents who also score high on normsIdentity tend to take seriously how humanitarian and human rights norms can be both genuine moral commitments and strategic resources for powerful states. On intervention debates, your view is likely more nuanced than pure skepticism.",
    })
  }

  return tilts
}

// ── Runner-up separation ──────────────────────────────────────────────────────

// Which dimension most separates each family pair, and in what direction.
const separatingDimension: Partial<Record<FamilyKey, Partial<Record<FamilyKey, DimensionKey>>>> = {
  realist: {
    institutionalist: "institutions",
    constructivist: "normsIdentity",
    criticalPoliticalEconomy: "politicalEconomy",
  },
  institutionalist: {
    realist: "securityCompetition",
    constructivist: "normsIdentity",
    criticalPoliticalEconomy: "politicalEconomy",
  },
  constructivist: {
    realist: "securityCompetition",
    institutionalist: "institutions",
    criticalPoliticalEconomy: "politicalEconomy",
  },
  criticalPoliticalEconomy: {
    realist: "securityCompetition",
    institutionalist: "institutions",
    constructivist: "normsIdentity",
  },
}

const separationPhrases: Partial<
  Record<FamilyKey, Partial<Record<FamilyKey, (score: number) => string>>>
> = {
  realist: {
    institutionalist: (s) =>
      s >= 4
        ? `Your institutions score (${s.toFixed(1)}) is relatively high for a realist — you are more open to institutional mechanisms than a typical realist profile. This is the main bridge between your primary classification and the runner-up.`
        : `Your low institutions score (${s.toFixed(1)}) is the clearest gap between you and the institutionalist runner-up. Institutionalism rests on the premise that rules and monitoring can sustain cooperation — your profile is skeptical of that.`,
    constructivist: (s) =>
      s >= 4
        ? `A normsIdentity score of ${s.toFixed(1)} is moderate-to-high for a realist — you give more weight to legitimacy and identity than a strict structural realist would. That is the bridge to your constructivist runner-up.`
        : `Your low normsIdentity score (${s.toFixed(1)}) marks the main separation from the constructivist runner-up. Where constructivists treat identity and norms as causally real, your profile is skeptical of that framing.`,
    criticalPoliticalEconomy: (s) =>
      s >= 4
        ? `A political economy score of ${s.toFixed(1)} is relatively high for a realist — you share the critical PE view that economic structures matter, not just military power. That overlap drives the runner-up score.`
        : `Your low political economy score (${s.toFixed(1)}) marks the gap from the critical PE runner-up. You locate the main constraint in security competition rather than economic hierarchy.`,
  },
  institutionalist: {
    realist: (s) =>
      s >= 4
        ? `A security competition score of ${s.toFixed(1)} is notable for an institutionalist — you take rivalry seriously even while investing in institutions. That realist undertow is what makes realism your runner-up.`
        : `Your relatively low security competition score (${s.toFixed(1)}) anchors the separation from realism. The realist runner-up reflects some structural pessimism, but your primary classification reflects more optimism about institutional management.`,
    constructivist: (s) =>
      s >= 4
        ? `A normsIdentity score of ${s.toFixed(1)} shows you give real weight to legitimacy and identity — bridging institutionalism and constructivism. The difference is causal: you emphasize rules and monitoring more than identity per se.`
        : `Your modest normsIdentity score (${s.toFixed(1)}) marks the gap from the constructivist runner-up. You are focused on rules and incentive structures; the constructivist move to identity as a primary cause is a step further than your profile takes.`,
    criticalPoliticalEconomy: (s) =>
      s >= 4
        ? `A political economy score of ${s.toFixed(1)} is high for an institutionalist — you share the critical PE view that economic hierarchy shapes governance. That overlap is what makes critical PE your runner-up.`
        : `Your lower political economy score (${s.toFixed(1)}) marks the main gap from the critical PE runner-up. You focus on institutional design and rules; critical PE focuses on the structural economic power that institutions often encode.`,
  },
  constructivist: {
    realist: (s) =>
      s >= 4
        ? `A security competition score of ${s.toFixed(1)} is notable for a constructivist — you have not set aside the logic of power and uncertainty even while emphasizing identity. That coexistence is what makes realism your runner-up.`
        : `Your low security competition score (${s.toFixed(1)}) marks the clearest separation from the realist runner-up. A realist constructivist is possible, but your profile leans toward the view that social change can genuinely transform threat perceptions.`,
    institutionalist: (s) =>
      s >= 4
        ? `An institutions score of ${s.toFixed(1)} is relatively high for a constructivist — you share the institutionalist interest in rules and monitoring, even if your primary emphasis is on the identities that give rules meaning.`
        : `Your moderate institutions score (${s.toFixed(1)}) reflects the standard constructivist position: institutions matter, but what makes them work is shared identity and legitimacy, not just the rules themselves.`,
    criticalPoliticalEconomy: (s) =>
      s >= 4
        ? `A political economy score of ${s.toFixed(1)} is notable in a constructivist profile — you ask whose interests prevailing norms serve, not just whether norms are real. That critical edge is what brings critical PE close as a runner-up.`
        : `Your lower political economy score (${s.toFixed(1)}) marks the gap from the critical PE runner-up. You see ideas and norms as primary; critical PE sees economic structure as the deeper determinant.`,
  },
  criticalPoliticalEconomy: {
    realist: (s) =>
      s >= 4
        ? `A security competition score of ${s.toFixed(1)} is higher than typical for a critical PE primary — you take military rivalry seriously alongside economic structure. That combination is what makes realism your runner-up.`
        : `Your low security competition score (${s.toFixed(1)}) marks the gap from the realist runner-up. Both traditions are skeptical of liberal optimism, but you locate the constraint in economic hierarchy rather than military power distribution.`,
    institutionalist: (s) =>
      s >= 4
        ? `An institutions score of ${s.toFixed(1)} is high for a critical PE primary — you are more open to the possibility of institutional reform than the pure skeptic position. That openness is what brings institutionalism close as a runner-up.`
        : `Your low institutions score (${s.toFixed(1)}) marks the gap from the institutionalist runner-up. You see international institutions as encoding structural economic power rather than as genuine solutions to cooperation problems.`,
    constructivist: (s) =>
      s >= 4
        ? `A normsIdentity score of ${s.toFixed(1)} is notable in a critical PE profile — you take legitimacy and identity seriously alongside economic structure. The overlap with constructivism is in asking whose interests prevailing norms serve.`
        : `Your lower normsIdentity score (${s.toFixed(1)}) marks the gap from the constructivist runner-up. You are focused on material structures; constructivism's emphasis on ideas and identities as primary causes is a step your profile does not fully take.`,
  },
}

export function getRunnerUpSeparation(
  fk: FamilyKey,
  nk: FamilyKey,
  d: DimensionScores,
): string {
  const dim = separatingDimension[fk]?.[nk]
  if (!dim) return ""
  const phrase = separationPhrases[fk]?.[nk]
  if (!phrase) return ""
  return phrase(d[dim])
}

// ── Flip analysis ─────────────────────────────────────────────────────────────

export function getFlipAnalysis(
  fk: FamilyKey,
  nk: FamilyKey,
  d: DimensionScores,
): string | null {
  const dim = separatingDimension[fk]?.[nk]
  if (!dim) return null

  const score = d[dim]
  // Only surface when the score is within 1.2 of neutral — a genuinely close call
  if (Math.abs(score - 4) > 1.2) return null

  const dimLabel = dimensionLabels[dim].toLowerCase()
  const nkLabel = familyLabel(nk)

  if (score >= 4) {
    return `Your ${dimLabel} score (${score.toFixed(1)}) is in the moderate-high range — closer to the ${nkLabel} position than a decisive primary score would be. If your instincts on this dimension were somewhat stronger, the model would classify you as ${nkLabel}. The runner-up is not a distant second.`
  } else {
    return `Your ${dimLabel} score (${score.toFixed(1)}) is in the moderate-low range — closer to neutral than a decisive position would be. A shift toward taking ${dimLabel} more seriously would move the result toward ${nkLabel}. The runner-up captures a real part of your profile.`
  }
}
