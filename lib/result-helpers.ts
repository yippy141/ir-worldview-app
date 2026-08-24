import { dimensionLabels } from "@/lib/quiz-schema"
import { familyDescriptions, familyProfiles } from "@/lib/scoring"
import { LOW_DIFFERENTIATION_THRESHOLD } from "@/lib/scoring-calibration"
import { familyLabel, traditionNounLabel } from "@/lib/worldview-config"
import type {
  DimensionKey,
  DimensionScores,
  FamilyKey,
  NormativeModifier,
  StrategyModifier,
} from "@/lib/types"
import {
  quickTakeData,
  whyItMattersData,
  buildIssueStances,
  blindSpotsData,
  pressureTestQuestions,
} from "@/lib/result-content"
export type { QuickTake, WhyItMatters, IssueStance, BlindSpot } from "@/lib/result-content"

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

const explanatoryDimensions = [
  "securityCompetition",
  "institutions",
  "domesticFilters",
  "normsIdentity",
  "politicalEconomy",
] as const satisfies readonly DimensionKey[]

const profileTitlePhrases: Record<
  (typeof explanatoryDimensions)[number],
  { high: string; low: string }
> = {
  securityCompetition: {
    high: "competition-centered",
    low: "less competition-centered",
  },
  institutions: {
    high: "institution-minded",
    low: "institution-skeptical",
  },
  domesticFilters: {
    high: "domestic-politics aware",
    low: "system-pressure first",
  },
  normsIdentity: {
    high: "legitimacy-aware",
    low: "norm-skeptical",
  },
  politicalEconomy: {
    high: "political-economy attuned",
    low: "security-and-diplomacy first",
  },
}

function getTopExplanatoryDimensions(scores: DimensionScores, n: number): DimensionKey[] {
  return explanatoryDimensions
    .slice()
    .sort((a, b) => Math.abs(scores[b] - 4) - Math.abs(scores[a] - 4))
    .slice(0, n)
}

function getProfileTitlePhrase(dimension: DimensionKey, score: number): string {
  if (!(dimension in profileTitlePhrases)) {
    return dimensionLabels[dimension].toLowerCase()
  }

  const phrases = profileTitlePhrases[dimension as (typeof explanatoryDimensions)[number]]
  return score >= 4 ? phrases.high : phrases.low
}

export function buildProfileTitle(dimensionScores: DimensionScores): string {
  const [primary, secondary] = getTopExplanatoryDimensions(dimensionScores, 2)
  const primaryPhrase = getProfileTitlePhrase(primary, dimensionScores[primary])
  const secondaryPhrase = getProfileTitlePhrase(secondary, dimensionScores[secondary])
  return `A ${primaryPhrase}, ${secondaryPhrase} foundation profile`
}

export function buildSummary(familyKey: FamilyKey, dimensionScores: DimensionScores): string {
  const top2 = getTopExplanatoryDimensions(dimensionScores, 2)
  const dim0 = dimensionLabels[top2[0]].toLowerCase()
  const dim1 = dimensionLabels[top2[1]].toLowerCase()
  return `The strongest signals in your Foundation profile are ${dim0} and ${dim1}. ${traditionNounLabel(familyKey)} is the closest tradition-level shorthand for that pattern. The label summarizes this result and does not define a permanent identity.`
}

// ── Closest traditions ────────────────────────────────────────────────────────

export type ClosestTradition = {
  key: FamilyKey
  label: string
  score: number
}

export type ClosestTraditionsSummary = {
  primary: ClosestTradition
  secondary: ClosestTradition
  showBoth: boolean
  displayLabel: string
  note: string
}

export function getClosestTraditions(
  familyScores: Record<FamilyKey, number>,
  identity?: {
    familyKey: FamilyKey
    runnerUpKey: FamilyKey
    nearestFitGap: number
    lowDifferentiationThreshold: number
  },
): ClosestTraditionsSummary {
  const ordered = (Object.entries(familyScores) as [FamilyKey, number][])
    .sort((a, b) => b[1] - a[1])
    .map(([key, score]) => ({
      key,
      score,
      label: traditionNounLabel(key),
    }))

  const primary = identity
    ? {
        key: identity.familyKey,
        score: familyScores[identity.familyKey],
        label: traditionNounLabel(identity.familyKey),
      }
    : ordered[0]
  const secondary = identity
    ? {
        key: identity.runnerUpKey,
        score: familyScores[identity.runnerUpKey],
        label: traditionNounLabel(identity.runnerUpKey),
      }
    : ordered[1]
  const gap = identity?.nearestFitGap ?? primary.score - secondary.score
  const showBoth =
    gap <=
    (identity?.lowDifferentiationThreshold ??
      LOW_DIFFERENTIATION_THRESHOLD)

  return {
    primary,
    secondary,
    showBoth,
    displayLabel: showBoth
      ? `${primary.label} and ${secondary.label}`
      : primary.label,
    note: showBoth
      ? `${primary.label} and ${secondary.label} are both close shorthand for this foundation profile. The gap between them is narrow enough that forcing a single tradition would hide part of the mix.`
      : `${primary.label} is the closest shorthand for this foundation profile. ${secondary.label} is the nearest overlap, so this is better read as a profile with a clear neighbor than as a sealed box.`,
  }
}

// ── Strong lenses ─────────────────────────────────────────────────────────────

export type StrongLens = {
  key: string
  label: string
  description: string
}

type RawDimensionPosition = "high" | "midRange" | "low"

function rawDimensionPosition(score: number): RawDimensionPosition {
  if (score > 4) return "high"
  if (score < 4) return "low"
  return "midRange"
}

function byRawPosition<T>(
  score: number,
  copy: Record<RawDimensionPosition, T>,
): T {
  return copy[rawDimensionPosition(score)]
}

function getRawPoleStrength(score: number): number {
  return Math.abs(score - 4) / 3
}

export function getStrongLenses(dimensionScores: DimensionScores): StrongLens[] {
  const lenses: { weight: number; lens: StrongLens }[] = []

  if (dimensionScores.politicalEconomy >= 5) {
    lenses.push({
      weight: getRawPoleStrength(dimensionScores.politicalEconomy),
      lens: {
        key: "political-economy-salience",
        label: "Political-economy salience",
        description:
          "The aggregate score lies toward explanations centered on trade, finance, sanctions, and dependence. That dimension alone does not produce a Critical political economy Foundation reading.",
      },
    })
  }

  if (dimensionScores.domesticFilters >= 5) {
    lenses.push({
      weight: getRawPoleStrength(dimensionScores.domesticFilters),
      lens: {
        key: "domestic-politics",
        label: "Domestic-politics sensitivity",
        description:
          "The aggregate score lies toward explanations centered on coalitions, regime type, and bureaucratic capacity.",
      },
    })
  }

  if (dimensionScores.normsIdentity >= 5) {
    lenses.push({
      weight: getRawPoleStrength(dimensionScores.normsIdentity),
      lens: {
        key: "identity-legitimacy",
        label: "Identity / legitimacy sensitivity",
        description:
          "The aggregate score lies toward explanations in which legitimacy, recognition, and shared expectations shape threats, interests, and obligations.",
      },
    })
  }

  const orderJusticePosition = rawDimensionPosition(dimensionScores.orderJustice)
  if (dimensionScores.orderJustice >= 5 || dimensionScores.orderJustice <= 3) {
    lenses.push({
      weight: getRawPoleStrength(dimensionScores.orderJustice),
      lens: {
        key: "normative-justice",
        label: "Normative / justice sensitivity",
        description:
          orderJusticePosition === "low"
            ? "The aggregate score lies toward allowing extreme moral stakes to outweigh sovereignty in some hard cases."
            : "The aggregate score lies toward giving order, precedent, and the costs of intervention substantial weight.",
      },
    })
  }

  return lenses
    .sort((a, b) => b.weight - a.weight)
    .slice(0, 3)
    .map(({ lens }) => lens)
}

// ── Key drivers ───────────────────────────────────────────────────────────────

const dimensionDriverLabels: Record<DimensionKey, (score: number) => string> = {
  securityCompetition: (s) =>
    byRawPosition(s, {
      high: "Closer to persistent rivalry",
      midRange: "No directional pull on rivalry",
      low: "Closer to conditional rivalry",
    }),
  institutions: (s) =>
    byRawPosition(s, {
      high: "Closer to rules that bind",
      midRange: "No directional pull on institutions",
      low: "Closer to power-first institutions",
    }),
  domesticFilters: (s) =>
    byRawPosition(s, {
      high: "Closer to domestic-politics explanations",
      midRange: "No directional pull on domestic filters",
      low: "Closer to system-pressure explanations",
    }),
  normsIdentity: (s) =>
    byRawPosition(s, {
      high: "Closer to legitimacy as causal",
      midRange: "No directional pull on legitimacy",
      low: "Closer to material-interest explanations",
    }),
  politicalEconomy: (s) =>
    byRawPosition(s, {
      high: "Closer to markets and dependence",
      midRange: "No directional pull on political economy",
      low: "Closer to security and diplomacy",
    }),
  restraint: (s) =>
    byRawPosition(s, {
      high: "Closer to setting strategic limits",
      midRange: "No directional pull on restraint",
      low: "Closer to pressing advantage",
    }),
  orderJustice: (s) =>
    byRawPosition(s, {
      high: "Closer to order first",
      midRange: "No directional pull on order and justice",
      low: "Closer to justice overriding sovereignty",
    }),
}

const dimensionDriverDescriptions: Record<DimensionKey, (score: number) => string> = {
  securityCompetition: (s) =>
    byRawPosition(s, {
      high: "The aggregate score lies toward persistent rivalry over reassurance or issue-specific cooperation.",
      midRange: "The aggregate score is at the midpoint. Individual answers may be neutral or may offset one another.",
      low: "The aggregate score lies toward reassurance and issue-specific cooperation over persistent rivalry.",
    }),
  institutions: (s) =>
    byRawPosition(s, {
      high: "The aggregate score lies toward institutional rules having independent effects on incentives and cooperation.",
      midRange: "The aggregate score is at the midpoint. Individual answers may be neutral or may offset one another.",
      low: "The aggregate score lies toward institutions reflecting underlying state power.",
    }),
  domesticFilters: (s) =>
    byRawPosition(s, {
      high: "The aggregate score lies toward regime type, coalitions, and bureaucratic capacity as explanations.",
      midRange: "The aggregate score is at the midpoint. Individual answers may be neutral or may offset one another.",
      low: "The aggregate score lies toward external constraints over domestic-politics explanations.",
    }),
  normsIdentity: (s) =>
    byRawPosition(s, {
      high: "The aggregate score lies toward identity, legitimacy, and shared understandings as explanations.",
      midRange: "The aggregate score is at the midpoint. Individual answers may be neutral or may offset one another.",
      low: "The aggregate score lies toward material interests over norms or legitimacy as explanations.",
    }),
  politicalEconomy: (s) =>
    byRawPosition(s, {
      high: "The aggregate score lies toward production, finance, and economic dependence as explanations.",
      midRange: "The aggregate score is at the midpoint. Individual answers may be neutral or may offset one another.",
      low: "The aggregate score lies toward security and diplomacy over economic hierarchy as explanations.",
    }),
  restraint: (s) =>
    byRawPosition(s, {
      high: "The aggregate score lies toward avoiding overextension and setting limits.",
      midRange: "The aggregate score is at the midpoint. Individual answers may be neutral or may offset one another.",
      low: "The aggregate score lies toward using windows of opportunity and pursuing durable advantage.",
    }),
  orderJustice: (s) =>
    byRawPosition(s, {
      high: "The aggregate score lies toward order, precedent, and sovereignty.",
      midRange: "The aggregate score is at the midpoint. Individual answers may be neutral or may offset one another.",
      low: "The aggregate score lies toward justice claims when sovereignty and moral stakes conflict.",
    }),
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
    byRawPosition(s, {
      high: "Your answers lean toward persistent rivalry as a constraint on cooperation.",
      midRange: "Your answers sit at the midpoint between persistent and conditional rivalry.",
      low: "Your answers lean toward rivalry as conditional on the issue and relationship.",
    }),
  institutions: (s) =>
    byRawPosition(s, {
      high: "Your answers lean toward institutions changing incentives and outcomes.",
      midRange: "Your answers sit at the midpoint between rules that bind and power-first institutions.",
      low: "Your answers lean toward institutions reflecting what powerful states already want.",
    }),
  domesticFilters: (s) =>
    byRawPosition(s, {
      high: "Your answers lean toward domestic institutions and coalitions shaping foreign policy.",
      midRange: "Your answers sit at the midpoint between domestic and systemic explanations.",
      low: "Your answers lean toward external constraints shaping foreign policy.",
    }),
  normsIdentity: (s) =>
    byRawPosition(s, {
      high: "Your answers lean toward identity and shared expectations shaping threats and alliances.",
      midRange: "Your answers sit at the midpoint between legitimacy and material-interest explanations.",
      low: "Your answers lean toward material interests explaining appeals to norms and legitimacy.",
    }),
  politicalEconomy: (s) =>
    byRawPosition(s, {
      high: "Your answers lean toward production, finance, and economic dependence as explanatory forces.",
      midRange: "Your answers sit at the midpoint between political-economy and security-first explanations.",
      low: "Your answers lean toward security and diplomacy as the primary explanation.",
    }),
  restraint: (s) =>
    byRawPosition(s, {
      high: "Your answers lean toward avoiding overextension and setting strategic limits.",
      midRange: "Your answers sit at the midpoint between restraint and pressing advantage.",
      low: "Your answers lean toward pressing for durable advantage when opportunities open.",
    }),
  orderJustice: (s) =>
    byRawPosition(s, {
      high: "Your answers lean toward preserving order and sovereignty under pressure.",
      midRange: "Your answers sit at the midpoint between order and justice.",
      low: "Your answers lean toward justice overriding sovereignty in some high-stakes cases.",
    }),
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
    text: "When the issue turns strategic, rivalry reasserts itself. You believe institutions matter, but so does positional advantage. Which one wins depends on the issue. The position is coherent, but harder to apply in advance.",
  },
  {
    key: "restraint-competition",
    condition: (d) => d.restraint >= 5 && d.securityCompetition >= 5,
    text: "You prefer restraint as a strategy but take security competition seriously. Knowing when to hold back and when a window demands action is the hardest strategic call. Your profile leaves that question open.",
  },
  {
    key: "order-norms",
    condition: (d) => d.orderJustice >= 5 && d.normsIdentity >= 5,
    text: "You value international order and also think identity and legitimacy are causally real. The tension is that stable order sometimes requires setting aside the moral commitments that follow from the constructivist position.",
  },
  {
    key: "economy-institutions",
    condition: (d) => d.politicalEconomy >= 5 && d.institutions >= 5,
    text: "You think political economy is central but also believe institutions can work. The tension is structural: if global financial architecture is systematically biased, reform from within is a slow and uncertain bet.",
  },
  {
    key: "justice-sovereignty",
    condition: (d) => d.orderJustice <= 3 && d.institutions >= 5,
    text: "You are willing to override sovereignty for justice and also invest weight in institutions. Institutions, however, are largely built on the norm of sovereignty. That tension is worth sitting with.",
  },
  {
    key: "domestic-realist",
    condition: (d) => d.domesticFilters >= 5 && d.securityCompetition >= 5,
    text: "You emphasize domestic politics while also treating security competition as a persistent constraint. When they conflict, which factor dominates depends on the issue. That is realistic, but it also makes your framework harder to apply predictively across cases.",
  },
]

export function getActiveTensions(dimensionScores: DimensionScores): TensionRule[] {
  return tensionRules.filter((rule) => rule.condition(dimensionScores))
}

// ── Surprising finding for the result-card hero ───────────────────────────────

export type SurprisingFinding = {
  kind: "tension" | "subtradition" | "neighbor"
  label: string
  text: string
}

// True when the user's dimension scores trigger a named subtradition strand
// rather than the catch-all "mainstream" fallback in getSubtraditionAffinity.
function hasSpecificSubtradition(familyKey: FamilyKey, d: DimensionScores): boolean {
  switch (familyKey) {
    case "realist":
      return d.restraint >= 5 || d.restraint <= 3 || d.domesticFilters >= 5
    case "institutionalist":
      return d.domesticFilters >= 5
    case "constructivist":
      return d.politicalEconomy >= 5 || d.normsIdentity >= 6
    case "criticalPoliticalEconomy":
      return d.domesticFilters >= 5 || d.institutions >= 4.5
  }
}

export function getFoundationSurprisingFinding(
  familyKey: FamilyKey,
  runnerUpKey: FamilyKey,
  dimensionScores: DimensionScores,
): SurprisingFinding | null {
  const tensions = getActiveTensions(dimensionScores)
  if (tensions.length > 0) {
    return { kind: "tension", label: "Tension to watch", text: tensions[0].text }
  }

  if (hasSpecificSubtradition(familyKey, dimensionScores)) {
    const sub = getSubtraditionAffinity(familyKey, dimensionScores)
    if (sub) {
      return { kind: "subtradition", label: sub.name, text: sub.note }
    }
  }

  const neighbor = neighborOverlapTexts[familyKey]?.[runnerUpKey]
  if (neighbor) {
    return { kind: "neighbor", label: "Nearest overlap", text: neighbor }
  }

  return null
}

// ── Neighbor overlap text ─────────────────────────────────────────────────────

export const neighborOverlapTexts: Partial<Record<FamilyKey, Partial<Record<FamilyKey, string>>>> =
  {
    realist: {
      institutionalist:
        "Both traditions take power seriously. Institutionalists believe rules can make cooperation more durable even under anarchy. Your runner-up score reflects some openness to that possibility.",
      constructivist:
        "Both traditions pay attention to uncertainty and threat perception. Where constructivists see socially constructed meanings, your instinct is to treat uncertainty as a structural constraint, independent of social context.",
      criticalPoliticalEconomy:
        "Both traditions are skeptical of liberal optimism. You locate the problem in security competition and power. Critical PE locates it in economic structure and dependence.",
    },
    institutionalist: {
      realist:
        "You invest in institutions but also take power and rivalry seriously. The runner-up score reflects a realist undertow. You know institutions can be captured or bypassed, and that knowledge shapes which ones you trust.",
      constructivist:
        "Both traditions see more than power at work in world politics. For constructivists, identity is the causal variable. For institutionalists, the causal weight falls on rules, enforcement, and repeated interaction.",
      criticalPoliticalEconomy:
        "Both care about domestic and transnational filters. You focus on institutions and governance reform. Critical PE focuses on the structural economic power that institutions often encode.",
    },
    constructivist: {
      realist:
        "You give serious weight to identity and legitimacy. Your runner-up score on realism suggests you have not fully set aside the logic of power and uncertainty. The two frameworks coexist uneasily in your profile.",
      institutionalist:
        "Both traditions see more than raw power at work. Where institutionalists emphasize repeated interaction and rules, you emphasize the identities and expectations that give those rules meaning.",
      criticalPoliticalEconomy:
        "Both traditions look beyond the state as a billiard ball. Your overlap with critical PE reflects an interest in how ideas, identity, and material structures interact, a productive tension in critical IR scholarship.",
    },
    criticalPoliticalEconomy: {
      realist:
        "Both traditions are skeptical of liberal optimism, for different reasons. Your runner-up score on realism suggests you also take security competition seriously, as a complement to structural economic analysis.",
      institutionalist:
        "You see political economy as primary. Your runner-up score reflects some belief that institutions, if genuinely reformed, could matter. The question your profile leaves open is whether that reform is realistic.",
      constructivist:
        "Both traditions look beyond material power and security. Your overlap with constructivism reflects an interest in how ideas, legitimacy, and economic structures interact, a key area in critical IPE scholarship.",
    },
  }

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
      note: "The foundational text of structural realism, explaining why the distribution of power shapes state behavior regardless of intentions.",
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
      note: "A historical argument for how markets and governance co-evolve, relevant to why domestic filters and transnational actors matter.",
    },
  ],
  constructivist: [
    {
      title: "Anarchy Is What States Make of It",
      author: "Alexander Wendt",
      note: "The article that put constructivism on the mainstream IR map. It argues that anarchy's meaning depends on social interaction.",
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
      note: "The argument that financial structures create power independent of formal authority. It remains the sharpest introduction to structural power.",
    },
    {
      title: "Global Political Economy",
      author: "Robert Gilpin",
      note: "A readable overview of the three main approaches to international economic order: realist, liberal, and Marxist.",
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
            "Compared with the authored realist reference, your restraint score is notably high. Defensive realists argue that the structure of anarchy often rewards restraint because overextension and offensive moves provoke balancing coalitions more than they produce durable security. This is consistent with your answers.",
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
            "A realist who also gives weight to domestic politics and statecraft leans toward the classical tradition, with Morgenthau's emphasis on prudence, leadership, and the human drives behind power competition rather than purely structural accounts.",
        }
      return {
        name: "Structural realism",
        note:
          "Your answers are closest to the mainstream structural realist position: the distribution of power and the condition of anarchy explain most of what matters, with relatively little variance from domestic or ideational factors.",
      }

    case "institutionalist":
      if (d.domesticFilters >= 5 && d.institutions >= 5)
        return {
          name: "Two-level game / democratic peace",
          note:
            "You give high weight to both institutions and domestic politics, the combination that characterizes the democratic peace and two-level game strands of liberal institutionalism. Domestic constraints are not noise; they shape what governments can credibly commit to internationally.",
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
            "A strong identity and legitimacy score combined with constructivism as the closest modeled tradition fits the mainstream conventional strand: norms and identities are empirically important variables that shape what counts as a legitimate policy option.",
        }
      return {
        name: "Soft constructivism",
        note:
          "You lean constructivist but with moderate scores, suggesting an openness to ideational explanations without fully committing to identity as the master variable. This is sometimes called 'soft' or 'thin' constructivism.",
      }

    case "criticalPoliticalEconomy":
      if (d.domesticFilters >= 5)
        return {
          name: "Dependency theory / development focus",
          note:
            "Your attention to domestic political economy alongside global structures is consistent with the dependency theory strand, which emphasizes how core-periphery dynamics are reproduced through domestic class coalitions and development policy, not just external imposition.",
        }
      if (d.institutions >= 4.5)
        return {
          name: "Structural power / IPE",
          note:
            "You score higher on institutions than most critical PE adherents, suggesting an orientation closer to Strange's structural power framework. This approach treats international institutions as sites of structural power rather than dismissing them entirely.",
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
        "The realist closest-tradition fit is tempered by a notably high institutions score. On trade and economic governance, where enforcement is easier and stakes lower than in security, your answers may draw more on institutionalist logic than that closest fit alone suggests.",
    })
  }

  if (familyKey === "realist" && d.normsIdentity >= 5) {
    tilts.push({
      issue: "Alliance management",
      tilt: "Identity-sensitive",
      note:
        "Your identity and legitimacy score adds shared recognition to the capability questions in this realist closest-tradition result. On alliance politics, your answers may draw more on constructivist logic than that closest fit alone suggests.",
    })
  }

  if (familyKey === "institutionalist" && d.securityCompetition >= 5) {
    tilts.push({
      issue: "Hard security and military competition",
      tilt: "Realist undertow",
      note:
        "The institutionalist closest-tradition fit has a realist undertow on security: when strategic competition intensifies, your scores suggest less confidence that institutions can hold. On military competition and major-power deterrence, your answers may lean more realist than that closest fit alone suggests.",
    })
  }

  if (familyKey === "institutionalist" && d.politicalEconomy >= 5) {
    tilts.push({
      issue: "Global finance and development",
      tilt: "Critical PE awareness",
      note:
        "Your political economy score adds attention to the structural advantages encoded in international institutions. On IMF conditionality, debt relief, or development finance, your answers may draw more on critical-political-economy logic than the institutionalist closest fit alone suggests.",
    })
  }

  if (familyKey === "constructivist" && d.politicalEconomy >= 5) {
    tilts.push({
      issue: "Trade and economic rules",
      tilt: "Structural economic skepticism",
      note:
        "Your political economy score adds a distributional question to the constructivist closest-tradition result: whose interests do these norms serve? On trade rules and financial governance, that question brings critical-political-economy logic into the reading.",
    })
  }

  if (familyKey === "constructivist" && d.securityCompetition >= 5) {
    tilts.push({
      issue: "Great-power competition",
      tilt: "Security-realist tilt",
      note:
        "Your security-competition score adds material constraints to the constructivist closest-tradition result. On great-power rivalry, your answers may give weight to both threat construction and the distribution of capabilities.",
    })
  }

  if (familyKey === "criticalPoliticalEconomy" && d.institutions >= 4.5) {
    tilts.push({
      issue: "International economic reform",
      tilt: "Reform-oriented",
      note:
        "With critical political economy as the closest modeled tradition, a relatively high institutions score adds a reform-oriented qualification. On reform questions (IMF governance, WTO dispute mechanisms, climate finance), your instinct may be more reformist than transformational, suggesting openness to institutional change from within.",
    })
  }

  if (familyKey === "criticalPoliticalEconomy" && d.normsIdentity >= 5) {
    tilts.push({
      issue: "Human rights and humanitarian norms",
      tilt: "Norm-sensitive",
      note:
        "Your identity and legitimacy score adds moral commitments to the structural questions in this critical-political-economy closest-tradition result. On intervention, your answers may treat human-rights norms as meaningful while still asking how powerful states use them.",
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
        ? `Your institutions score (${s.toFixed(1)}) is relatively high for the authored realist reference. You are more open to institutional mechanisms than that reference. This is the main bridge between the closest modeled tradition and the runner-up.`
        : `Your low institutions score (${s.toFixed(1)}) is the clearest gap between your answers and the institutionalist runner-up. Institutionalism rests on the premise that rules and monitoring can sustain cooperation. Your answers are skeptical of that.`,
    constructivist: (s) =>
      s >= 4
        ? `Compared with the authored realist reference, an identity and legitimacy score of ${s.toFixed(1)} gives more weight to legitimacy and identity. That is the bridge to your constructivist runner-up.`
        : `Your low identity and legitimacy score (${s.toFixed(1)}) marks the main separation from the constructivist runner-up. Where constructivists treat identity and norms as causally real, your answers are skeptical of that framing.`,
    criticalPoliticalEconomy: (s) =>
      s >= 4
        ? `Compared with the authored realist reference, a political economy score of ${s.toFixed(1)} gives more weight to economic structures alongside military power. That overlap drives the runner-up score.`
        : `Your low political economy score (${s.toFixed(1)}) marks the gap from the critical PE runner-up. You locate the main constraint in security competition rather than economic hierarchy.`,
  },
  institutionalist: {
    realist: (s) =>
      s >= 4
        ? `Compared with the authored institutionalist reference, a security competition score of ${s.toFixed(1)} gives more weight to rivalry alongside institutions. That realist undertow is what makes realism your runner-up.`
        : `Your relatively low security competition score (${s.toFixed(1)}) anchors the separation from realism. The realist runner-up reflects some structural pessimism, while the closest modeled tradition reflects more optimism about institutional management.`,
    constructivist: (s) =>
      s >= 4
        ? `An identity and legitimacy score of ${s.toFixed(1)} shows that legitimacy and identity remain important in your answers, bridging institutionalism and constructivism. The difference is causal: you emphasize rules and monitoring more than identity per se.`
        : `Your modest identity and legitimacy score (${s.toFixed(1)}) marks the gap from the constructivist runner-up. You are focused on rules and incentive structures; the constructivist move to identity as a primary cause is a step further than your answers take.`,
    criticalPoliticalEconomy: (s) =>
      s >= 4
        ? `Compared with the authored institutionalist reference, a political economy score of ${s.toFixed(1)} gives more weight to how economic hierarchy shapes governance. That overlap is what makes critical PE your runner-up.`
        : `Your lower political economy score (${s.toFixed(1)}) marks the main gap from the critical PE runner-up. You focus on institutional design and rules; critical PE focuses on the structural economic power encoded in institutions.`,
  },
  constructivist: {
    realist: (s) =>
      s >= 4
        ? `Compared with the authored constructivist reference, a security competition score of ${s.toFixed(1)} gives more weight to power and uncertainty alongside identity. That coexistence is what makes realism your runner-up.`
        : `Your low security competition score (${s.toFixed(1)}) marks the clearest separation from the realist runner-up. Your answers lean toward the view that social change can genuinely transform threat perceptions.`,
    institutionalist: (s) =>
      s >= 4
        ? `Compared with the authored constructivist reference, an institutions score of ${s.toFixed(1)} gives more weight to rules and monitoring, even as identity remains the stronger emphasis.`
        : `Your moderate institutions score (${s.toFixed(1)}) reflects the authored constructivist reference: institutions matter, but what makes them work is shared identity and legitimacy, not just the rules themselves.`,
    criticalPoliticalEconomy: (s) =>
      s >= 4
        ? `Compared with the authored constructivist reference, a political economy score of ${s.toFixed(1)} adds the question of whose interests prevailing norms serve, not just whether norms are real. That critical edge is what brings critical PE close as a runner-up.`
        : `Your lower political economy score (${s.toFixed(1)}) marks the gap from the critical PE runner-up. You see ideas and norms as primary; critical PE sees economic structure as the deeper determinant.`,
  },
  criticalPoliticalEconomy: {
    realist: (s) =>
      s >= 4
        ? `Compared with the authored critical-political-economy reference, a security competition score of ${s.toFixed(1)} gives more weight to military rivalry alongside economic structure. That combination is what makes realism your runner-up.`
        : `Your low security competition score (${s.toFixed(1)}) marks the gap from the realist runner-up. Both traditions are skeptical of liberal optimism, but you locate the constraint in economic hierarchy rather than military power distribution.`,
    institutionalist: (s) =>
      s >= 4
        ? `Compared with the authored critical-political-economy reference, an institutions score of ${s.toFixed(1)} shows more openness to institutional reform. That openness is what brings institutionalism close as a runner-up.`
        : `Your low institutions score (${s.toFixed(1)}) marks the gap from the institutionalist runner-up. You see international institutions as encoding structural economic power rather than as genuine solutions to cooperation problems.`,
    constructivist: (s) =>
      s >= 4
        ? `Compared with the authored critical-political-economy reference, an identity and legitimacy score of ${s.toFixed(1)} gives more weight to legitimacy and identity alongside economic structure. The overlap with constructivism is in asking whose interests prevailing norms serve.`
        : `Your lower identity and legitimacy score (${s.toFixed(1)}) marks the gap from the constructivist runner-up. You are focused on material structures; constructivism's emphasis on ideas and identities as primary causes is a step your answers do not fully take.`,
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

// ── What would change this reading ────────────────────────────────────────────

// One sentence naming the dimension that holds the primary family apart from
// its nearest neighbour, and the score currently sitting on it. Reads the same
// authored separation map getRunnerUpSeparation uses, so it makes no claim the
// scoring model does not already make.
export function getWhatWouldChangeThis(
  fk: FamilyKey,
  nk: FamilyKey,
  d: DimensionScores,
): string {
  const nkLabel = traditionNounLabel(nk)
  const dim = separatingDimension[fk]?.[nk]

  if (!dim) {
    return `A firmer lean on any one of the seven dimensions would move this reading toward ${nkLabel}.`
  }

  return `A different answer on ${dimensionLabels[dim].toLowerCase()}, now ${d[dim].toFixed(1)}, is what would move this reading toward ${nkLabel}.`
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
  const nkLabel = traditionNounLabel(nk)

  if (score >= 4) {
    return `A ${dimLabel} score of ${score.toFixed(1)} is close enough to keep ${nkLabel} relevant. Stronger answers on this dimension would make ${nkLabel} the closest modeled tradition.`
  } else {
    return `At ${score.toFixed(1)}, ${dimLabel} remains near neutral. Giving this dimension more weight would move the result toward ${nkLabel}, which explains why that tradition remains the runner-up.`
  }
}

// ── Why this result won ───────────────────────────────────────────────────────

// Returns 2–4 bullets explaining which dimensions most drove the primary result
// over the runner-up, in plain English.
export function getWhyThisResult(
  fk: FamilyKey,
  nk: FamilyKey,
  d: DimensionScores,
): string[] {
  const primaryProfile = familyProfiles[fk]
  const runnerProfile = familyProfiles[nk]
  const dims = Object.keys(d) as DimensionKey[]

  // For each dimension, compute how much it favored primary over runner-up
  const contributions = dims.map((dim) => {
    const centered = d[dim] - 4
    const primaryWeight = primaryProfile[dim] ?? 0
    const runnerWeight = runnerProfile[dim] ?? 0
    const diff = centered * (primaryWeight - runnerWeight)
    return { dim, diff, score: d[dim] }
  })

  const top = contributions
    .filter((c) => c.diff > 0.1)
    .sort((a, b) => b.diff - a.diff)
    .slice(0, 4)

  if (top.length === 0) {
    return ["Your answers aligned consistently with the overall profile of this tradition across multiple dimensions."]
  }

  const fkLabel = traditionNounLabel(fk)
  const nkLabel = traditionNounLabel(nk)

  return top.map(({ dim, score }) => {
    const dimLabel = dimensionLabels[dim].toLowerCase()
    const directionWord = score >= 4.5 ? "high" : score <= 3.5 ? "low" : "moderate"
    return `Your ${directionWord} score on ${dimLabel} aligned more closely with ${fkLabel} than with ${nkLabel}.`
  })
}

// ── Comparison strip ──────────────────────────────────────────────────────────

export type ComparisonDimension = {
  dim: DimensionKey
  label: string
  userScore: number
  primaryExpected: "high" | "neutral" | "low"
  runnerUpExpected: "high" | "neutral" | "low"
}

// Returns the top 3 dimensions where primary and runner-up profiles diverge
// most, for rendering a comparison strip on the results page.
export function getComparisonDimensions(
  fk: FamilyKey,
  nk: FamilyKey,
  d: DimensionScores,
): ComparisonDimension[] {
  const primaryProfile = familyProfiles[fk]
  const runnerProfile = familyProfiles[nk]
  const dims = Object.keys(d) as DimensionKey[]

  const divergence = dims.map((dim) => {
    const pWeight = primaryProfile[dim] ?? 0
    const rWeight = runnerProfile[dim] ?? 0
    return { dim, gap: Math.abs(pWeight - rWeight), pWeight, rWeight }
  })

  const top3 = divergence.sort((a, b) => b.gap - a.gap).slice(0, 3)

  return top3.map(({ dim, pWeight, rWeight }) => ({
    dim,
    label: dimensionLabels[dim],
    userScore: d[dim],
    primaryExpected: pWeight > 0.2 ? "high" : pWeight < -0.2 ? "low" : "neutral",
    runnerUpExpected: rWeight > 0.2 ? "high" : rWeight < -0.2 ? "low" : "neutral",
  }))
}

// ── Quick take ────────────────────────────────────────────────────────────────

export function getQuickTake(fk: FamilyKey) {
  return quickTakeData[fk]
}

// ── Why this worldview matters ────────────────────────────────────────────────

export function getWhyItMatters(fk: FamilyKey) {
  return whyItMattersData[fk]
}

// ── How you'd likely read the world ──────────────────────────────────────────

export function getHowYouReadTheWorld(
  fk: FamilyKey,
  sm: StrategyModifier,
  nm: NormativeModifier,
) {
  return buildIssueStances(fk, sm, nm)
}

// ── Blind spots and counterarguments ─────────────────────────────────────────

export function getBlindSpots(fk: FamilyKey) {
  return blindSpotsData[fk]
}

// ── Pressure-test questions ───────────────────────────────────────────────────

export function getPressureTestQuestions(fk: FamilyKey): string[] {
  return pressureTestQuestions[fk]
}

// ── What could shift your result ─────────────────────────────────────────────

export function getWhatCouldShift(
  fk: FamilyKey,
  nk: FamilyKey,
  d: DimensionScores,
  sm: StrategyModifier,
  nm: NormativeModifier,
): string[] {
  const results: string[] = []

  // 1. Closest modeled tradition: which dimension shift would flip to runner-up
  const dim = separatingDimension[fk]?.[nk]
  if (dim) {
    const dimLabel = dimensionLabels[dim].toLowerCase()
    const nkLabel = traditionNounLabel(nk)
    const score = d[dim]
    const dir = score < 4 ? "higher" : "lower"
    results.push(
      `${nkLabel} could become the closest modeled tradition if your score on ${dimLabel} were notably ${dir}. Your current raw score is ${score.toFixed(1)}.`,
    )
  }

  // 2. Strategy modifier: what would shift it
  if (sm === "Restrainer") {
    results.push(
      "Your Restrainer modifier would shift to Hedger if your answers on restraint and overextension moved closer to the middle of the scale and gave more weight to pressing advantages when conditions are favorable.",
    )
  } else if (sm === "Maximizer") {
    results.push(
      "Your Maximizer modifier would shift to Hedger if your answers gave more weight to the risks of overextension and the long-term costs of forward commitments.",
    )
  } else {
    results.push(
      "Your Hedger modifier reflects a mixed strategy instinct. A more consistent lean toward either restraint or maximization in the foundation answers would shift the modifier.",
    )
  }

  // 3. Normative modifier: what would shift it
  if (nm === "Pluralist") {
    results.push(
      "Your Pluralist modifier would shift to Conditional Solidarist if your order-versus-justice answers gave more weight to cases where sufficiently grave violations can override sovereignty.",
    )
  } else if (nm === "Universalist") {
    results.push(
      "Your Universalist modifier would shift to Conditional Solidarist if your answers gave more weight to the institutional and precedential risks created by external intervention.",
    )
  } else {
    results.push(
      "Your Conditional Solidarist modifier reflects genuine tension between order and justice. A more consistent position on either side of that debate in the foundation answers would shift the modifier.",
    )
  }

  return results
}
