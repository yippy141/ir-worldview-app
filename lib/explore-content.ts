import exploreHubData from "@/content/explore/hub.en.json" with { type: "json" }
import type { LensCode } from "@/lib/archetypes"
import type { DimensionKey, FamilyKey } from "@/lib/types"
import {
  familyKeyFromSlug,
  familySlug,
  traditionNounLabel,
} from "@/lib/worldview-config"

export const EXPLORE_HUB_SCHEMA_VERSION = 2 as const

export const EXPLORE_HUB_SECTION_ORDER = [
  "how-labels-fit",
  "foundation-archetypes",
  "variants-blends",
  "modeled-traditions",
  "foundation-dimensions",
  "decision-patterns",
  "reference-positions",
  "focus-context",
  "coverage-methods",
] as const

export const EXPLORE_HUB_LENS_ORDER = ["P", "R", "M", "S"] as const

export const EXPLORE_HUB_DIMENSION_ORDER = [
  "securityCompetition",
  "institutions",
  "domesticFilters",
  "normsIdentity",
  "politicalEconomy",
  "restraint",
  "orderJustice",
] as const satisfies readonly DimensionKey[]

const EXPLORE_HUB_HIERARCHY_ORDER = [
  "identity",
  "support",
  "context",
] as const

const EXPLORE_HUB_CONTEXT_ORDER = [
  ["security", "/modules/security"],
  ["technology", "/modules/technology"],
  ["ai-governance", "/ai"],
  ["perspective-runs", "/perspectives"],
  ["current-cases", "/cases"],
] as const

export type ExploreHubSectionId = (typeof EXPLORE_HUB_SECTION_ORDER)[number]

export type ExploreHubContent = {
  schemaVersion: typeof EXPLORE_HUB_SCHEMA_VERSION
  contentVersion: string
  locale: "en"
  hero: {
    title: string
    payoff: [string, string]
    boundary: string
  }
  sections: Array<{
    id: ExploreHubSectionId
    heading: string
    intro: string
  }>
  hierarchy: Array<{
    id: (typeof EXPLORE_HUB_HIERARCHY_ORDER)[number]
    label: string
    description: string
  }>
  scoringEvidence: {
    summary: string
    body: string
    href: "/method"
    linkLabel: string
  }
  lensBands: Array<{
    lens: LensCode
    description: string
  }>
  normativeAliases: Array<{
    state: "o" | "c" | "j"
    label: "Order-first" | "Conditional" | "Justice-first"
    description: string
  }>
  blendExplanation: string
  dimensions: Array<{
    key: DimensionKey
    description: string
  }>
  decisionPatternDirectory: {
    summary: string
    mapLinkLabel: string
    mapHref: "/explore/atlas"
  }
  referenceDirectory: {
    countLabel: string
    linkLabel: string
    href: "/explore/reference"
  }
  contextBoundary: string
  contextRecords: Array<{
    id: (typeof EXPLORE_HUB_CONTEXT_ORDER)[number][0]
    title: string
    description: string
    href: (typeof EXPLORE_HUB_CONTEXT_ORDER)[number][1]
  }>
  coverage: {
    detailsSummary: string
    canonNote: string
    methodLinkLabel: string
    methodHref: "/method"
  }
}

const rawExploreHubContent: unknown = exploreHubData

export const exploreHubContentValidationErrors =
  validateExploreHubContent(rawExploreHubContent)

export function getExploreHubContent(
  value: unknown = rawExploreHubContent,
): ExploreHubContent | null {
  return validateExploreHubContent(value).length === 0
    ? (value as ExploreHubContent)
    : null
}

export function validateExploreHubContent(value: unknown): string[] {
  const errors: string[] = []
  if (!isExploreRecord(value)) return ["explore hub must be an object."]

  requireExploreKeys(
    value,
    [
      "schemaVersion",
      "contentVersion",
      "locale",
      "hero",
      "sections",
      "hierarchy",
      "scoringEvidence",
      "lensBands",
      "normativeAliases",
      "blendExplanation",
      "dimensions",
      "decisionPatternDirectory",
      "referenceDirectory",
      "contextBoundary",
      "contextRecords",
      "coverage",
    ],
    "explore hub",
    errors,
  )
  if (value.schemaVersion !== EXPLORE_HUB_SCHEMA_VERSION) {
    errors.push(`schemaVersion must be ${EXPLORE_HUB_SCHEMA_VERSION}.`)
  }
  if (
    !isExploreString(value.contentVersion) ||
    !/^\d+\.\d+\.\d+(?:[-.][A-Za-z0-9]+)*$/u.test(value.contentVersion)
  ) {
    errors.push("contentVersion must be a semantic content version.")
  }
  if (value.locale !== "en") errors.push("locale must be en.")

  validateExploreHero(value.hero, errors)
  validateOrderedExploreRecords(
    value.sections,
    EXPLORE_HUB_SECTION_ORDER,
    "sections",
    ["id", "heading", "intro"],
    errors,
  )
  validateOrderedExploreRecords(
    value.hierarchy,
    EXPLORE_HUB_HIERARCHY_ORDER,
    "hierarchy",
    ["id", "label", "description"],
    errors,
  )
  validateExploreLinkRecord(
    value.scoringEvidence,
    "scoringEvidence",
    ["summary", "body", "href", "linkLabel"],
    "href",
    "/method",
    errors,
  )
  validateOrderedExploreRecords(
    value.lensBands,
    EXPLORE_HUB_LENS_ORDER,
    "lensBands",
    ["lens", "description"],
    errors,
    "lens",
  )
  validateNormativeAliases(value.normativeAliases, errors)
  if (!isExploreString(value.blendExplanation)) {
    errors.push("blendExplanation is required.")
  }
  validateOrderedExploreRecords(
    value.dimensions,
    EXPLORE_HUB_DIMENSION_ORDER,
    "dimensions",
    ["key", "description"],
    errors,
    "key",
  )
  validateExploreLinkRecord(
    value.decisionPatternDirectory,
    "decisionPatternDirectory",
    ["summary", "mapLinkLabel", "mapHref"],
    "mapHref",
    "/explore/atlas",
    errors,
  )
  validateExploreLinkRecord(
    value.referenceDirectory,
    "referenceDirectory",
    ["countLabel", "linkLabel", "href"],
    "href",
    "/explore/reference",
    errors,
  )
  if (!isExploreString(value.contextBoundary)) {
    errors.push("contextBoundary is required.")
  }
  validateContextRecords(value.contextRecords, errors)
  validateExploreLinkRecord(
    value.coverage,
    "coverage",
    ["detailsSummary", "canonNote", "methodLinkLabel", "methodHref"],
    "methodHref",
    "/method",
    errors,
  )

  return errors
}

export type ExploreReading = {
  title: string
  author: string
  note: string
}

export type ExploreThinker = {
  name: string
  role: string   // institutional role / era — kept brief
  note: string   // what this thinker contributed to the tradition
}

export type ExploreFamily = {
  slug: string
  familyKey: FamilyKey
  name: string
  tagline: string
  summary: string
  coreClaims: string[]
  subtraditions: { name: string; note: string }[]
  emphasizes: string[]
  underweights: string[]
  persuasiveArguments: string[]
  issueReadings: { issue: string; note: string }[]
  neighbors: { familyKey: FamilyKey; contrast: string }[]
  readings: ExploreReading[]
  advancedReadings?: ExploreReading[]
  counterReadings?: ExploreReading[]
  associatedThinkers?: ExploreThinker[]
  quizCoverage: { level: "strong" | "moderate" | "partial"; note: string }
  modelingNote?: string
}

export type ExploreGapEntry = {
  slug: string
  name: string
  summary: string
  whyNotYetModeled: string
}

export type IssueCompare = {
  slug: string
  title: string
  summary: string
  readings: { familyKey: FamilyKey; note: string }[]
}

// ── Modeled families ──────────────────────────────────────────────────────────

export const exploreFamilies: ExploreFamily[] = [
  {
    slug: familySlug("realist"),
    familyKey: "realist",
    name: traditionNounLabel("realist"),
    tagline: "No authority stands above states, so power and self-help decide more than rules or good intentions.",
    summary: `Realism starts from a blunt fact: there is no government above governments. Nobody can reliably punish a state that cheats or protect a state that is attacked. So states look after themselves. Structural realists put the whole argument on that fact. Classical realists add a second one, a drive for power in human nature that statecraft has to manage. Both conclude that even a state that wants peace cannot be sure its neighbors do, and prepares for the worst.

From that premise realists expect recurring patterns: arms races, balancing coalitions, and competition between states that would each prefer to cooperate. The security dilemma is the tragic version. Weapons bought for defense look like preparation for attack from across the border, and the reply looks the same from the other side. Nobody wanted the spiral, and nobody can safely step out of it.

Realism is a family of arguments, and the family quarrels. Offensive realists hold that anarchy pushes great powers to seek as much power as they can, because there is no safe point to stop. Defensive realists reply that the system often rewards restraint and punishes expansion. What the family shares is the claim that power and self-help are permanent features of world politics, and that better institutions or warmer feelings will not remove them.`,
    coreClaims: [
      "Anarchy, the absence of a central authority above states, is the condition everything else follows from.",
      "Because states cannot be sure of one another's intentions, each must provide for its own security.",
      "The distribution of power among states, whether one leads or several compete, shapes conflict and cooperation more than any other factor.",
      "Relative gains matter. A deal that strengthens a rival more than it strengthens you weakens your position over time.",
      "Defensive measures look threatening from outside. The security dilemma produces arms spirals that no party intended.",
    ],
    subtraditions: [
      {
        name: "Classical realism",
        note:
          "Morgenthau and Niebuhr ground the argument in a human drive for power, with the structure of the system as a second factor. The tradition concerns itself with statecraft, the judgment of leaders, and the tragic character of politics among nations.",
      },
      {
        name: "Structural realism (neorealism)",
        note:
          "Waltz moves the explanation from human nature to the shape of the system: anarchy plus the distribution of capabilities. Leaders matter less. The structure rewards some behavior and punishes the rest, whoever is in office.",
      },
      {
        name: "Offensive realism",
        note:
          "Mearsheimer argues that anarchy pushes great powers to maximize their power, because a state can never know how much security is enough. The safest position is to be the strongest, so competition never settles.",
      },
      {
        name: "Defensive realism",
        note:
          "Glaser, Van Evera, and Snyder argue that the system often rewards restraint. Most wars come from miscalculation, domestic pathologies, or spirals that both sides could have avoided. Anarchy by itself does not require endless expansion.",
      },
    ],
    emphasizes: [
      "Uncertainty about other states' intentions, which never goes away",
      "Relative power: what a state can do compared with its rivals",
      "The security dilemma: defensive moves read as offensive from across the border",
      "Balancing: states tend to line up against a rising power, not behind it",
      "Skepticism that rules, norms, or institutions can hold a powerful state when its interests are at stake",
    ],
    underweights: [
      "Why states under similar external pressure behave differently: regime type, domestic coalitions, bureaucratic capacity",
      "How institutions make cooperation last in lower-stakes areas such as trade and standards",
      "How identity, legitimacy, and expectation decide what counts as a threat in the first place",
      "Economic structure: dependence, supply-chain exposure, and who controls credit",
      "The possibility that norms spread and change what states are willing to do",
    ],
    persuasiveArguments: [
      "Overextension eats the power base that makes a state secure; empires tend to collapse under commitments they cannot carry",
      "Peace among major powers rests on a favorable distribution of power, not on a change in their political character",
      "A liberal order tends to serve the interests of the most powerful state that designed it",
      "States in similar strategic positions behave in similar ways, whatever their ideology",
    ],
    issueReadings: [
      {
        issue: "Great-power rivalry",
        note:
          "The rivalry is built into the structure. A rising power extends its reach; the established power balances; declared intentions and regime type change little. Realists disagree about timing. Balance-of-power theorists expect rough parity to restrain both sides, while power-transition arguments, including Gilpin's account of hegemonic war, expect the danger to peak when a rising state finds the existing order no longer fits its interests.",
      },
      {
        issue: "Trade and technology decoupling",
        note:
          "Interdependence with an adversary is a vulnerability first and a benefit second. Reliance on a rival's supply chains hands it leverage, and a lead in technology becomes a lead in arms. Restricting trade is rational even at real economic cost, because relative gains count.",
      },
      {
        issue: "Humanitarian intervention",
        note:
          "Realists are deeply skeptical. Governments reach for humanitarian language to justify what strategic interest already recommends. The rule against intervention protects weak states as much as it shelters bad ones. Intervene only where core interests are engaged, and expect the intervention to create instabilities of its own.",
      },
    ],
    neighbors: [
      {
        familyKey: "institutionalist",
        contrast:
          "Both start from states under anarchy. Institutionalists argue that repeated dealings and shared rules can make cooperation last even without an enforcer. Realists doubt that any of it holds once a powerful state is under real pressure.",
      },
      {
        familyKey: "criticalPoliticalEconomy",
        contrast:
          "Both distrust liberal optimism, and they locate the driving force in different places. Realists watch security competition and the distribution of military power. Critical political economy watches capital, production, and dependence as the limits on what a state can do.",
      },
    ],
    readings: [
      {
        title: "Theory of International Politics",
        author: "Kenneth Waltz",
        note: "The founding text of structural realism. The distribution of power among states, and neither human nature nor the character of governments, explains the recurring patterns of conflict.",
      },
      {
        title: "The Tragedy of Great Power Politics",
        author: "John Mearsheimer",
        note: "The clearest statement of offensive realism: why great powers cannot rest content with the status quo.",
      },
      {
        title: "Politics Among Nations",
        author: "Hans Morgenthau",
        note: "The core text of classical realism, on the statecraft needed to manage power in a world with no common authority.",
      },
    ],
    advancedReadings: [
      {
        title: "War and Change in World Politics",
        author: "Robert Gilpin",
        note: "A structural account of hegemonic transition. Wars of redistribution become likelier when a rising power finds that the existing order no longer reflects its interests. Bears directly on the United States and China.",
      },
      {
        title: "Perception and Misperception in International Politics",
        author: "Robert Jervis",
        note: "The essential treatment of the security dilemma and of bias in strategic judgment. Shows how defensive intentions can be read as offensive, and under what conditions a spiral follows.",
      },
      {
        title: "The Origins of Alliances",
        author: "Stephen Walt",
        note: "States balance against threats, not against power alone. A refinement of Waltz that explains why alliances form the way they do, and a key text in defensive realism.",
      },
    ],
    counterReadings: [
      {
        title: "After Hegemony",
        author: "Robert Keohane",
        note: "The strongest institutionalist challenge. Cooperation can be sustained without a dominant enforcer, against the realist expectation that order depends on hegemony.",
      },
      {
        title: "Anarchy Is What States Make of It",
        author: "Alexander Wendt",
        note: "The constructivist challenge. Anarchy has no fixed logic; what rivalry and self-help mean depends on the identities and relationships states build through interaction.",
      },
    ],
    associatedThinkers: [
      {
        name: "Hans Morgenthau (1904–1980)",
        role: "Political scientist, University of Chicago",
        note: "The founding figure of classical realism. Defined the national interest in terms of power and treated statecraft as a discipline of tragic judgment that no set of rules can replace.",
      },
      {
        name: "Kenneth Waltz (1924–2013)",
        role: "Political scientist, Columbia University and UC Berkeley",
        note: "Founded structural realism. Moved the cause of conflict from human nature to the architecture of the system, anarchy and the distribution of capabilities, and set the terms of debate for two generations.",
      },
      {
        name: "John Mearsheimer (b. 1947)",
        role: "Political scientist, University of Chicago",
        note: "The leading offensive realist. Great powers must maximize relative power because there is no safe stopping point, so conflict recurs whatever the ideology of the day.",
      },
      {
        name: "Robert Jervis (1940–2021)",
        role: "Political scientist, Columbia University",
        note: "The essential scholar of the security dilemma. Showed how cognitive bias and the balance between offense and defense combine to produce arms races and wars nobody chose.",
      },
    ],
    quizCoverage: {
      level: "strong",
      note:
        "Two dimensions carry the realist reading: security competition (uncertainty, rivalry, self-help) and restraint (whether to press an advantage or hold back). The fourteen core questions ask two per dimension. Longer forms add cases such as a rival gaining ground and a supplier catching up in semiconductors. Offensive, defensive, and classical realism are not separated: a high realist score fits all three.",
    },
  },

  {
    slug: familySlug("institutionalist"),
    familyKey: "institutionalist",
    name: traditionNounLabel("institutionalist"),
    tagline: "Shared rules, monitoring, and repeated dealings can make cooperation last without a world government.",
    summary: `Where realism sees anarchy as a trap, institutionalism sees a problem that can be managed. States cooperate less than they could, the argument runs, because they cannot see one another's intentions and cannot check whether the other side is keeping its word. That problem can block cooperation even where neither side is hostile. Treaties, organizations, monitoring bodies, and dispute panels supply the missing information. They do not require trust, and they do not require a world government.

The mechanism works on incentives over time. When violations are visible and reputations follow a state from one negotiation to the next, cheating today costs deals tomorrow. Governments that invest in institutions gain access to cooperation they could never sustain through one-off bargains.

Liberal institutionalism also takes domestic politics seriously. A government negotiates with foreign counterparts and with its own constituencies at the same time, the two-level game. That is why states under similar external pressure can reach very different outcomes: regime type, parliaments, and interest groups decide what a government can bring to the table and what it can deliver afterward.`,
    coreClaims: [
      "Missing information can block cooperation on its own. States that cannot verify intentions or detect cheating may hold back even when nobody is hostile.",
      "Institutions lower the cost of reaching, carrying out, and enforcing agreements.",
      "Repeated dealings under rules lengthen time horizons. The gain from cheating once shrinks beside the cost of being shut out later.",
      "States can pursue absolute gains: both sides benefit from a deal even when one benefits more.",
      "Domestic politics filters every bargain. Regime type, legislatures, and interest coalitions decide what a government can credibly promise.",
    ],
    subtraditions: [
      {
        name: "Liberal institutionalism (neoliberalism)",
        note:
          "The mainstream strand, built by Keohane and Nye. International organizations and regimes lower the cost of checking compliance, so cooperation can outlast shifts in the distribution of power.",
      },
      {
        name: "Two-level game / domestic politics",
        note:
          "Putnam's model: a government bargains abroad and manages ratification at home at the same time. The set of agreements that can survive domestic approval, the win-set, decides what is achievable abroad.",
      },
      {
        name: "Democratic peace theory",
        note:
          "The finding that established democracies rarely fight one another, explained through the checks that legislatures, publics, and open debate place on a leader's freedom to use force.",
      },
      {
        name: "Global governance / regime complexity",
        note:
          "A newer strand studies how overlapping arrangements, trade regimes, climate agreements, human rights law, interact. They govern in layers without a single hierarchy, and the layers sometimes reinforce and sometimes obstruct one another.",
      },
    ],
    emphasizes: [
      "Absolute gains: both sides can win from a deal even when one wins more",
      "How institutions cut the cost of reaching and checking agreements",
      "Monitoring and transparency as the cure for cheating",
      "Domestic politics and regime type as filters on what a state can credibly promise",
      "Repeated dealings: longer time horizons weaken the pull of cheating now",
    ],
    underweights: [
      "How the most powerful states decide which institutions get built, and in whose interest",
      "Structural economic power: who writes the rules and who pays the cost of adjusting to them",
      "How easily institutions are bypassed or dismantled once a state feels its security is at stake",
      "Identity and legitimacy: why the same institution looks credible to some actors and rigged to others",
      "The difficulty of building institutions for a new problem before the political will exists",
    ],
    persuasiveArguments: [
      "Trade regimes create export constituencies that make a later turn to protectionism politically costly",
      "Transparency in arms control reduces uncertainty without requiring prior trust",
      "Alliances run better inside institutions that prevent miscalculation",
      "Courts and dispute panels make settling a quarrel peacefully cheaper than escalating it",
    ],
    issueReadings: [
      {
        issue: "Great-power rivalry",
        note:
          "Rivalry can be managed through sustained engagement. Trade and investment create domestic constituencies for stability on both sides. Confidence-building measures and arms control cut the risk of miscalculation. Interdependence is read as a brake on escalation, though a brake that can fail.",
      },
      {
        issue: "Trade and technology decoupling",
        note:
          "Broad decoupling costs every party and erodes the postwar trading rules that made growth possible. The better course is targeted: export controls scoped to items with real military use, embedded in multilateral arrangements, instead of unilateral restrictions across whole sectors.",
      },
      {
        issue: "Humanitarian intervention",
        note:
          "More permissive than realism when an institution authorizes the action. The responsibility to protect and a Security Council mandate make intervention more legitimate and easier to sustain. Unilateral action is suspect. Collective action with clear objectives, an exit plan, and institution-building afterward is defensible.",
      },
    ],
    neighbors: [
      {
        familyKey: "realist",
        contrast:
          "Both start from states under anarchy. The dispute is whether institutions can change behavior independently of the distribution of power. Institutionalists say yes. Realists say only until it matters.",
      },
      {
        familyKey: "constructivist",
        contrast:
          "Both look past raw power. They differ on the cause. Institutionalists point to rules and repeated dealings; constructivists point to the shared identities that give the rules their meaning.",
      },
    ],
    readings: [
      {
        title: "After Hegemony",
        author: "Robert Keohane",
        note: "The core argument for why institutions can sustain cooperation after the dominant power that built them has declined.",
      },
      {
        title: "Diplomacy and Domestic Politics",
        author: "Robert Putnam",
        note: "The two-level game paper: how domestic politics constrains and shapes what can be agreed abroad.",
      },
      {
        title: "Power and Governance in a Partially Globalized World",
        author: "Robert Keohane",
        note: "A later reflection on what global governance can and cannot do.",
      },
    ],
    advancedReadings: [
      {
        title: "After Victory: Institutions, Strategic Restraint, and the Rebuilding of Order After Major Wars",
        author: "G. John Ikenberry",
        note: "Why a victorious power sometimes binds itself through institutions instead of simply imposing order. A constitutional settlement lowers the cost of running a liberal order, which bears on whether the US-led institutions can outlast US primacy.",
      },
      {
        title: "The Evolution of Cooperation",
        author: "Robert Axelrod",
        note: "Repeated prisoner's dilemma experiments show how cooperation can emerge among self-interested players with no central authority. The game-theoretic ground under much institutionalist reasoning.",
      },
      {
        title: "A New World Order",
        author: "Anne-Marie Slaughter",
        note: "Global governance runs largely through networks of regulators, judges, and legislators working across borders, with formal international organizations as only part of the picture.",
      },
    ],
    counterReadings: [
      {
        title: "The False Promise of International Institutions",
        author: "John Mearsheimer",
        note: "The sharpest realist challenge. Institutions reflect what powerful states already want and cannot constrain them when core interests are at stake. The most direct engagement with institutionalist claims.",
      },
      {
        title: "War and Change in World Politics",
        author: "Robert Gilpin",
        note: "International order rests on hegemony. When the hegemon declines, the order it built does not carry on under its own momentum; it collapses or is renegotiated by force.",
      },
    ],
    associatedThinkers: [
      {
        name: "Robert Keohane (b. 1941)",
        role: "Political scientist, Princeton University",
        note: "The central figure of liberal institutionalism. Made the theoretical case that institutions can sustain cooperation among self-interested states after the power that created them has declined.",
      },
      {
        name: "Joseph Nye (b. 1937)",
        role: "Political scientist, Harvard University",
        note: "Developed complex interdependence with Keohane and introduced soft power, the ability to shape what others want through attraction instead of coercion. Read in both academic and policy circles.",
      },
      {
        name: "G. John Ikenberry (b. 1954)",
        role: "Political scientist, Princeton University",
        note: "Argues that the postwar US-led order succeeded partly because the United States bound itself through institutions, which made the order acceptable to others. Central to the debate over whether that order survives US retrenchment.",
      },
      {
        name: "Robert Putnam (b. 1941)",
        role: "Political scientist, Harvard University",
        note: "Built the two-level game: an international negotiation is also a domestic political contest, and what a government can ratify at home sets what it can agree abroad.",
      },
    ],
    quizCoverage: {
      level: "strong",
      note:
        "Two dimensions carry the institutionalist reading: institutions (can rules change behavior on their own?) and domestic filters (how internal politics shapes what a government can promise). The fourteen core questions ask two per dimension. Longer forms add cases on what holds an alliance together and on an institution that rising powers reject.",
    },
    modelingNote:
      "This page covers liberal institutionalism, the tradition of Keohane, Nye, and the study of regimes and cooperation under anarchy. Liberalism in International Relations is wider. Commercial liberalism holds that trade reduces the incentive for war; republican liberalism that democratic institutions shape foreign policy; sociological liberalism that transnational actors and networks matter. They share an optimism about cooperation and differ on what explains it. The Foundation tests institutionalist instincts and does not score the other strands separately.",
  },

  {
    slug: familySlug("constructivist"),
    familyKey: "constructivist",
    name: traditionNounLabel("constructivist"),
    tagline: "What counts as a threat, an ally, or an interest depends on identity, norms, and shared expectation.",
    summary: `Constructivism asks a prior question: where do interests come from? Realists and institutionalists mostly take them as given. States want security, growth, and survival, and the argument starts there. Constructivists reply that what counts as a threat, what counts as a win, and which kinds of cooperation are even imaginable depend on shared identities, social expectations, and the history through which states came to understand one another.

Wendt's example makes the point. Five hundred British nuclear weapons worry Washington less than five North Korean ones. The arithmetic of capability cannot explain that difference. Britain is a friend and North Korea an enemy, and those identities decide what a weapon means. The same military move reassures one neighbor and alarms another, depending on the relationship between them.

Norms, on this view, do causal work of their own. The spread of human rights norms after 1945, the growth of anti-colonial international law, and the taboo on chemical weapons changed what states treat as legitimate. Governments that break those norms pay a price even when nobody can enforce them.`,
    coreClaims: [
      "Interests are made, through identity formation, the spread of norms, and shared expectation. They are not given by the structure alone.",
      "Anarchy has no single logic. What it produces depends on the identities and relationships states build within it.",
      "Norms cause behavior. Once internalized, they decide what actors consider legitimate, with or without enforcement.",
      "Recognition, status, and belonging move states in ways that material calculation cannot explain on its own.",
      "Change comes through socialization, persuasion, and the gradual redefinition of what a legitimate interest is.",
    ],
    subtraditions: [
      {
        name: "Conventional constructivism",
        note:
          "The mainstream strand of Wendt, Finnemore, Katzenstein, and Checkel. Norms and identities are treated as variables that can be studied systematically alongside material factors, with the ordinary tools of social science.",
      },
      {
        name: "Critical constructivism",
        note:
          "More skeptical of the mainstream's positivist leanings. Drawing on Frankfurt School critical theory, it asks how norms work, whose interests they serve, and how they can be contested and changed.",
      },
      {
        name: "Poststructuralism",
        note:
          "Der Derian, Campbell, and Ashley go further, questioning the stable identities and fixed interests that even conventional constructivism assumes. The focus is discourse, representation, and security as something that is spoken into being.",
      },
    ],
    emphasizes: [
      "The making of threats: who is acting matters as much as what they are doing",
      "How identities and norms set the menu of options a state can legitimately choose from",
      "Legitimacy as a cause in its own right",
      "The spread of norms: how a standard travels and becomes internalized across the system",
      "Recognition, status, and expectation as motives that narrow calculation misses",
    ],
    underweights: [
      "Material power and structural limits: what norms cannot achieve against determined resistance",
      "How hard it is to change a norm when powerful actors profit from the old one",
      "Economic structure and its part in deciding which ideas gain a hearing",
      "Crisis behavior: norms are most contested at the moment they are most needed",
    ],
    persuasiveArguments: [
      "Old enemies can become friends through sustained interaction and a change of identity; France and Germany after 1945 are the clearest case",
      "International law works partly because states internalize its obligations; fear of punishment is only part of the story",
      "The spread of human rights norms since 1945 is a real transformation, whatever its gaps",
      "Domestic audiences care about legitimacy in ways that constrain even powerful governments",
    ],
    issueReadings: [
      {
        issue: "Great-power rivalry",
        note:
          "Threat perception is built from history, identity narratives, and strategic culture. The same capability reads as defensive or offensive depending on the shared understanding between the two states. Failures of recognition, each side denying the other's standing, can drive a spiral further than the material facts alone would predict.",
      },
      {
        issue: "Trade and technology decoupling",
        note:
          "The framing is the policy. 'Decoupling' and 'supply-chain security' are not neutral descriptions. They summon certain identities, economic nationalism, existential competition, and push others out of view, mutual dependence, shared governance. Once the frame is set, the frame can fulfill itself.",
      },
      {
        issue: "Humanitarian intervention",
        note:
          "The tradition best placed to explain why the norm of humanitarian intervention appeared when it did. Networks of norm entrepreneurs, sovereignty redefined as responsibility, and the spread of the responsibility to protect are its prime cases. It also asks the uncomfortable question: whose suffering activates the norm, and whose does not.",
      },
    ],
    neighbors: [
      {
        familyKey: "institutionalist",
        contrast:
          "Both look past raw power. Institutionalists point to rules and monitoring. Constructivists point to the shared identities and expectations that give the rules their meaning in the first place.",
      },
      {
        familyKey: "criticalPoliticalEconomy",
        contrast:
          "Both criticize the positivist mainstream. Constructivism works on ideas and norms; critical political economy on economic structure and class. They meet when either asks whose interests a given set of norms serves.",
      },
    ],
    readings: [
      {
        title: "Anarchy Is What States Make of It",
        author: "Alexander Wendt",
        note: "The article that made the argument: anarchy has no fixed meaning, and what it produces depends on the identities and relationships states construct.",
      },
      {
        title: "The Culture of National Security",
        author: "ed. Peter Katzenstein",
        note: "Empirical studies of how norms and identity shaped concrete security decisions.",
      },
      {
        title: "Rules for the World",
        author: "Michael Barnett & Martha Finnemore",
        note: "How international organizations develop logics of their own and shape state behavior beyond what their founders intended.",
      },
    ],
    advancedReadings: [
      {
        title: "Social Theory of International Politics",
        author: "Alexander Wendt",
        note: "The full statement. Distinguishes three cultures of anarchy, Hobbesian, Lockean, and Kantian, and argues that state identities are constructed and can change. Harder going than the 1992 article, and definitive.",
      },
      {
        title: "International Norm Dynamics and Political Change",
        author: "Martha Finnemore and Kathryn Sikkink",
        note: "The norm life cycle: emergence, cascade, internalization. Explains how a norm spreads and gains force without a central enforcer. Among the most cited articles in constructivist IR.",
      },
      {
        title: "The Chemical Weapons Taboo",
        author: "Richard Price",
        note: "How a norm became nearly universal despite the battlefield advantages chemical weapons can offer. The constructivist argument tested on a hard case.",
      },
    ],
    counterReadings: [
      {
        title: "Rationalist Explanations for War",
        author: "James Fearon",
        note: "A rationalist challenge to explanations built on misperception, identity, or construction. The puzzle is why wars happen at all when they cost both sides, and the answer lies in bargaining failure.",
      },
      {
        title: "The Great Delusion: Liberal Dreams and International Realities",
        author: "John Mearsheimer",
        note: "A realist attack on liberal internationalism that also disputes the claim that norms can transform world politics. Nationalism and realist logic, it argues, reliably defeat attempts to spread liberal order through socialization.",
      },
    ],
    associatedThinkers: [
      {
        name: "Alexander Wendt (b. 1958)",
        role: "Political scientist, Ohio State University",
        note: "The central theorist of conventional constructivism. His 1992 article 'Anarchy Is What States Make of It' brought the approach into the mainstream: anarchy has no fixed logic, and its consequences depend on the identities states construct.",
      },
      {
        name: "Martha Finnemore (b. 1959)",
        role: "Political scientist, George Washington University",
        note: "Showed that international organizations shape what states want, and do not merely serve it. With Kathryn Sikkink, set out the norm life cycle of emergence, cascade, and internalization.",
      },
      {
        name: "Peter Katzenstein (b. 1945)",
        role: "Political scientist, Cornell University",
        note: "Gave constructivism its empirical footing in security studies through The Culture of National Security, showing how norms and identity shaped German, Japanese, and US policy.",
      },
      {
        name: "Nicholas Onuf (b. 1941)",
        role: "Political scientist, Florida International University",
        note: "Coined 'constructivism' for International Relations. Argued that social reality, including the rules of international life, is built through speech acts and shared practice.",
      },
    ],
    quizCoverage: {
      level: "moderate",
      note:
        "One dimension carries the constructivist reading, norms and identity: whether recognition and legitimacy shape what states want. The fourteen core questions ask two on it. Longer forms add a case on a rival that democratizes and turns cooperative. Nothing asks how norms spread or when identities change, so the reading is broader than the questions behind it.",
    },
  },

  {
    slug: familySlug("criticalPoliticalEconomy"),
    familyKey: "criticalPoliticalEconomy",
    name: traditionNounLabel("criticalPoliticalEconomy"),
    tagline: "Who controls production, finance, and market access shapes world politics alongside military power.",
    summary: `Critical political economy starts from a different puzzle. It cares less about who won the last great-power contest than about who writes the rules of the world economy, who profits from them, and why some states have far less room to move than their sovereignty on paper suggests. It draws on Marxist economics, dependency theory, and economic sociology to argue that the structure of global capitalism shapes world politics in ways that security analysis does not see.

Formal sovereignty is one thing; independence is another. A state that must roll over its debt every six months, sells one commodity, and pegs its currency to a much larger economy faces limits that appear nowhere in its legal status. Those limits, the tradition argues, explain alignment, crisis, and development as much as armies and institutions do.

The tradition also asks who built the rules. The institutions that govern trade, investment, and finance were designed mostly by wealthy states at the height of their dominance. Whether they serve broad interests or narrow ones, and whether they can be reformed from inside, are open arguments within the tradition and around it.`,
    coreClaims: [
      "The structure of the world economy, who controls production, finance, and access to markets, limits what states can do, independently of military power.",
      "Sovereignty on paper is not autonomy. Debt, currency dependence, and reliance on one export impose real limits on developing states.",
      "The institutions that govern trade and finance were built during Western dominance and carry those interests in their design.",
      "Class interests and the demands of capital accumulation drive foreign economic policy alongside the interests of the state.",
      "Economic crises are not random shocks. They express contradictions in how global capitalism is organized.",
    ],
    subtraditions: [
      {
        name: "Marxist political economy",
        note:
          "Grounds the analysis in capital accumulation, class struggle, and the state as an instrument of class interest. Imperialism, the extension of accumulation abroad, is a structural tendency, whatever any one government intends. Lenin and Gramsci are the roots; in IR, Robert Cox and Stephen Gill.",
      },
      {
        name: "Dependency theory",
        note:
          "Grew out of Prebisch and the ECLAC school in Latin America and was developed by Cardoso, Faletto, and Frank. Core-periphery relations work against developing states: terms of trade worsen over time, capital flows upward, and industry in the periphery grows in the shape the core requires.",
      },
      {
        name: "World-systems theory",
        note:
          "Wallerstein extends dependency into a historical sociology of capitalism as one world-system. Core, semi-periphery, and periphery are positions that the system reproduces across long cycles of accumulation.",
      },
      {
        name: "Structural power and IPE",
        note:
          "Susan Strange's contribution: power in international finance belongs to whoever supplies liquidity in a crisis, sets interest rates, and controls access to credit. That power works without formal authority or military force.",
      },
    ],
    emphasizes: [
      "The international division of production: who makes what, and on whose terms",
      "Structural power in finance: who sets interest rates, who provides liquidity, who attaches conditions",
      "Economic dependence as a political limit: sovereignty on paper and independence in practice are different things",
      "Capital flows and their link to crisis, vulnerability, and leverage",
      "How economic hierarchy reproduces itself through the design of international institutions",
    ],
    underweights: [
      "Security competition that does not reduce to economic interest",
      "Identity, legitimacy, and the social meaning of cooperation and conflict",
      "Variation in domestic politics: why similarly placed states respond differently to the same structural pressure",
      "Military crises driven by strategic logic more than by economic position",
    ],
    persuasiveArguments: [
      "IMF conditionality has served creditor states' interests more than debtor states' development",
      "The dollar's reserve-currency status gives the United States leverage that owes nothing to its military",
      "Financial crises in developing economies are produced by the structure of global finance as well as by domestic mismanagement",
      "Trade and investment agreements tilt bargaining power toward capital and away from labor and governments",
    ],
    issueReadings: [
      {
        issue: "Great-power rivalry",
        note:
          "US-China rivalry is partly a contest over the rules of the world economy: whose currency dominates, whose technical standards spread, where supply chains run, and who controls the institutions that set the terms of investment and trade. Military competition is real, and a second contest runs alongside it: whose production and financial structures anchor the next phase of global capitalism.",
      },
      {
        issue: "Trade and technology decoupling",
        note:
          "Decoupling is a symptom of structural rivalry and a rearrangement of the global hierarchy of production. Ask who pays for the adjustment, usually workers and consumers in both countries, and who gains, capital that relocates, state contractors, defense industries. The claim that decoupling is a cost-free security necessity deserves suspicion.",
      },
      {
        issue: "Humanitarian intervention",
        note:
          "Skeptical. The tradition looks for the material interests behind humanitarian language: resources, market access, defense industries. It argues that where intervention happens tracks economic stakes as closely as the scale of suffering, and that the economic settlement afterward tends to favor the intervening powers and their investors.",
      },
    ],
    neighbors: [
      {
        familyKey: "realist",
        contrast:
          "Both distrust liberal optimism. Realists watch security competition and the distribution of military power. Critical political economy watches economic structure, class, and the politics of production and finance.",
      },
      {
        familyKey: "constructivist",
        contrast:
          "Both criticize the positivist mainstream. Critical political economy works on material structure, who controls capital and supply chains; constructivism works on ideas and norms. They meet when either asks whose interests the prevailing arrangements serve.",
      },
    ],
    readings: [
      {
        title: "States and Markets",
        author: "Susan Strange",
        note: "Financial structures create power independent of formal authority. Still the clearest introduction to structural power in the world economy.",
      },
      {
        title: "The Political Economy of International Relations",
        author: "Robert Gilpin",
        note: "A realist's survey of the three main approaches to the international economy, liberal, nationalist, and Marxist. Useful for orientation.",
      },
      {
        title: "Social Forces, States and World Orders",
        author: "Robert Cox",
        note: "The critical-theory argument that theory always serves someone's interests. A key text in critical political economy.",
      },
    ],
    advancedReadings: [
      {
        title: "Dependency and Development in Latin America",
        author: "Fernando Henrique Cardoso and Enzo Faletto",
        note: "The most careful dependency text. Avoids mechanical determinism by showing how domestic class alliances mediate dependence, which explains why similarly placed states respond differently to the same external constraint.",
      },
      {
        title: "States and the Reemergence of Global Finance",
        author: "Eric Helleiner",
        note: "Financial globalization was a political choice. States dismantled capital controls; the market did not do it for them. Essential for seeing structural financial power as a political variable.",
      },
      {
        title: "Production, Power, and World Order: Social Forces in the Making of History",
        author: "Robert Cox",
        note: "The book-length development of Cox's neo-Gramscian framework. Hegemony is reproduced through material power, institutions, and prevailing ideas together, across successive phases of world order.",
      },
    ],
    counterReadings: [
      {
        title: "In Defense of Globalization",
        author: "Jagdish Bhagwati",
        note: "A liberal-economic challenge to dependency and critical political economy. Trade and investment liberalization, when managed well, reduce poverty and widen opportunity in developing countries.",
      },
      {
        title: "Defending the National Interest: Raw Materials Investments and U.S. Foreign Policy",
        author: "Stephen Krasner",
        note: "A state-centric realist challenge to Marxist IPE. State interests drive foreign economic policy, and states sometimes act against the wishes of their own dominant economic actors.",
      },
    ],
    associatedThinkers: [
      {
        name: "Susan Strange (1923–1998)",
        role: "Political economist, LSE and University of Warwick",
        note: "Developed structural power: the ability to shape the rules and structures within which everyone else must operate. Argued that the United States rules through finance and knowledge as much as through formal authority.",
      },
      {
        name: "Robert Cox (1926–2018)",
        role: "Political economist, York University",
        note: "The founder of neo-Gramscian IPE. 'Theory is always for someone and for some purpose.' Hegemony is reproduced through material power, institutions, and prevailing ideas together; problem-solving theory and critical theory are his central distinction.",
      },
      {
        name: "Immanuel Wallerstein (1930–2019)",
        role: "Sociologist, Binghamton University",
        note: "Built world-systems theory: capitalism as one historical system with core, semi-periphery, and periphery. Underdevelopment, he argued, is produced by integration into the world economy, not by isolation from it.",
      },
      {
        name: "Raúl Prebisch (1901–1986)",
        role: "Economist, UN Economic Commission for Latin America (ECLAC)",
        note: "Author of the Prebisch-Singer thesis on deteriorating terms of trade: commodity exporters in the periphery face a lasting structural disadvantage against the industrial core. The foundation of dependency theory and structuralist development economics.",
      },
    ],
    quizCoverage: {
      level: "partial",
      note:
        "One dimension carries this reading, political economy: whether control of credit, production, and market access explains outcomes. The fourteen core questions ask two on it. Longer forms add a currency-peg crisis and a green-finance offer with conditions attached. Class, production hierarchies, and the politics of finance have no questions of their own, so this is the thinnest of the four readings.",
    },
    modelingNote:
      "Critical political economy is an umbrella. Marxist political economy puts class and capital accumulation first. Dependency theory (Prebisch, Cardoso, Frank) shows how core-periphery relations reproduce underdevelopment. World-systems theory (Wallerstein) extends that into a long history of capitalism as one system. Neo-Gramscian IPE (Cox, Gill) studies how hegemony and ideology hold an economic order together. Structural power analysis (Strange) follows control of production, finance, security, and knowledge. The Foundation scores them as one orientation and does not tell them apart.",
  },
]

// ── Issue comparisons ─────────────────────────────────────────────────────────

export const issueCompares: IssueCompare[] = [
  {
    slug: "great-power-rivalry",
    title: "Great-power rivalry",
    summary:
      "What causes competition between major powers, what drives it, and what, if anything, can hold it back?",
    readings: [
      {
        familyKey: "realist",
        note:
          "The structure does the work. When a state grows strong enough to challenge the leading power, the risk of conflict rises whatever the challenger says it wants. Under anarchy both sides must assume the worst. The expected response is balancing: alliances, arms, and forward positions.",
      },
      {
        familyKey: "institutionalist",
        note:
          "Rivalry can be managed through sustained engagement. Interdependence creates domestic stakeholders for stability on both sides. Military transparency and arms control reduce the miscalculation that turns competition into crisis. Democratic-peace research, the finding that established democracies rarely fight one another, is read as evidence that structure alone does not decide the outcome.",
      },
      {
        familyKey: "constructivist",
        note:
          "Historical memory, failures of recognition, and identity narratives build the rivalry and make it feel inevitable. Enemies have become partners before, France and Germany, the United States and Japan, which shows that structure is not destiny. Sustained diplomacy, socialization, and domestic political change can loosen a rival identity.",
      },
      {
        familyKey: "criticalPoliticalEconomy",
        note:
          "The rivalry is partly a contest over economic governance: currency dominance, technology standards, the geography of supply chains, and control of the institutions that set the rules of trade and investment. Military competition is real, and a second contest runs alongside it: whose production and financial structures define the next phase of the world economy.",
      },
    ],
  },
  {
    slug: "trade-technology-decoupling",
    title: "Trade and technology decoupling",
    summary:
      "How does each tradition read the push to cut trade and technology ties in the name of security, and who pays for it?",
    readings: [
      {
        familyKey: "realist",
        note:
          "Interdependence with an adversary is a vulnerability. A lead in technology becomes a lead in arms, so controls on dual-use exports are rational even at economic cost. Relative gains apply: a trade arrangement that builds the adversary's industrial base is harmful even if both economies grow.",
      },
      {
        familyKey: "institutionalist",
        note:
          "Broad decoupling costs both parties, undermines the multilateral trading rules that made growth possible, and is likely to fail as third countries hedge instead of choosing sides. The alternative is targeted controls inside multilateral arrangements: export limits on items with real military use, investment screening in critical sectors, and no wholesale separation.",
      },
      {
        familyKey: "constructivist",
        note:
          "The framing decides the policy. 'Decoupling' and 'supply-chain security' are not neutral descriptions. They summon adversarial identities and crowd out other framings, mutual dependence, shared governance, managed competition. Once adopted, the frame can fulfill itself.",
      },
      {
        familyKey: "criticalPoliticalEconomy",
        note:
          "Decoupling rearranges the global hierarchy of production, shaped by a contest over which state's firms control the key nodes of the technology supply chain. Ask who pays, workers, consumers, smaller trading partners, and who gains, domestic contractors, capital that relocates. The claim that this is a cost-free security necessity conceals a political choice with winners and losers.",
      },
    ],
  },
  {
    slug: "humanitarian-intervention",
    title: "Humanitarian intervention",
    summary:
      "When, if ever, does mass atrocity justify overriding sovereignty, and why do some crises bring intervention while others do not?",
    readings: [
      {
        familyKey: "realist",
        note:
          "Deeply skeptical. Governments reach for humanitarian language to justify what strategic interest already recommends, and the match between intervention and material stakes is too regular to dismiss. The rule against intervention protects weak states as much as it shelters bad ones. Intervene only where core interests are engaged, and expect the intervention to breed instabilities it cannot manage.",
      },
      {
        familyKey: "institutionalist",
        note:
          "More permissive when an institution authorizes the action. The responsibility to protect and a Security Council mandate change the legitimacy of the decision. Collective action with clear objectives and an exit plan beats both unilateral action and doing nothing. Unauthorized intervention sets a bad precedent, but the institutional route to a managed, collective response deserves support.",
      },
      {
        familyKey: "constructivist",
        note:
          "The tradition best placed to explain why the norm of humanitarian intervention appeared when it did. Norm entrepreneurs, sovereignty redefined as responsibility, and the spread of the responsibility to protect are its prime cases. It also asks whose suffering activates the norm and whose does not, and whether selective application reflects power more than principle.",
      },
      {
        familyKey: "criticalPoliticalEconomy",
        note:
          "Skeptical and critical. Look for the material interests behind humanitarian language: resources, market access, defense industries. The tradition argues that where intervention happens tracks economic stakes as closely as the scale of the crisis, and that the economic settlement afterward favors the intervening powers and their investors. Humanitarian framing is read as ideology that hides the motive.",
      },
    ],
  },
]

// ── Traditions not yet fully modeled ─────────────────────────────────────────

export const exploreGaps: ExploreGapEntry[] = [
  {
    slug: "feminist-ir",
    name: "Feminist IR",
    summary:
      "Feminist IR asks who disappears when the discipline looks only at states, power, and security. Its core concepts, security, sovereignty, power, rest on assumptions about gender that are rarely examined. Feminist scholars have studied how war falls differently on women and men, how militarism draws on ideas of masculinity, and what security would mean if it started from human vulnerability instead of state survival. The tradition runs from liberal feminism, which wants more women inside existing institutions, to critiques of militarism and of the gendered foundations of the state itself.",
    whyNotYetModeled:
      "Scoring feminist IR would need questions on human security, gender, and the critique of militarism that the bank does not contain. Scoring it with the current questions would produce readings the answers cannot support.",
  },
  {
    slug: "postcolonial-ir",
    name: "Postcolonial and Decolonial IR",
    summary:
      "Postcolonial and decolonial scholars argue that the discipline was built by and for a world organized by European colonial power, and that this origin decides which questions get asked and which actors count as agents. They trace how colonial legacies structure inequality today, recover perspectives from the global South that the canon left out, and ask whether 'sovereignty', 'anarchy', and 'security' mean the same thing to states whose borders were drawn by colonial powers.",
    whyNotYetModeled:
      "Scoring it would need questions on colonial legacies, Eurocentrism, and the politics of knowledge that would have to be written and tested from scratch. Someone whose first orientation is postcolonial is likely to land in critical political economy or constructivism, the nearest readings the questions can reach.",
  },
  {
    slug: "green-ir",
    name: "Green IR and Ecological Security",
    summary:
      "Green IR asks what the international system looks like once ecological limits are taken seriously. Climate change, resource scarcity, and biodiversity loss reshape security calculations, economic structures, and the legitimacy of governments in ways the older paradigms were not built to handle. The state-centered security frame, green scholars argue, misses the largest long-run threats to human welfare, and an international order worth the name has to reckon with planetary boundaries instead of treating nature as scenery behind great-power politics.",
    whyNotYetModeled:
      "Scoring green IR would need questions on ecological security, the relation between development and environmental limits, and the governance of the global commons. Those are commitments of their own, and the seven dimensions cannot carry them without changing what the dimensions mean.",
  },
  {
    slug: "english-school",
    name: "English School / International Society",
    summary:
      "The English School stands between realism and liberalism. States, it argues, form an international society: a community with shared norms, rules, and institutions that constrain behavior even without a world government. It takes international law and diplomacy seriously as social practices in their own right. Its pluralism-solidarism debate asks whether that society is organized around state sovereignty or around wider humanitarian norms. That debate maps onto the Foundation's order-justice dimension, which makes the English School the tradition the questions come closest to reaching without scoring.",
    whyNotYetModeled:
      "The order-justice dimension captures one debate inside the tradition. Its account of international society, of diplomacy as an institution, and of how international orders form historically has no questions of its own.",
  },
]

// ── Lookup helpers ────────────────────────────────────────────────────────────

export function getFamilyBySlug(slug: string): ExploreFamily | null {
  const key = familyKeyFromSlug(slug)
  return key ? getFamilyByKey(key) : null
}

export function getFamilyByKey(key: FamilyKey): ExploreFamily | null {
  return exploreFamilies.find((f) => f.familyKey === key) ?? null
}

export const coverageLevelLabels: Record<"strong" | "moderate" | "partial", string> = {
  strong: "Strongly modeled",
  moderate: "Moderately modeled",
  partial: "Partially modeled",
}

function validateExploreHero(value: unknown, errors: string[]): void {
  if (!isExploreRecord(value)) {
    errors.push("hero must be an object.")
    return
  }
  requireExploreKeys(
    value,
    ["title", "payoff", "boundary"],
    "hero",
    errors,
  )
  for (const key of ["title", "boundary"] as const) {
    if (!isExploreString(value[key])) errors.push(`hero.${key} is required.`)
  }
  if (
    !Array.isArray(value.payoff) ||
    value.payoff.length !== 2 ||
    value.payoff.some((sentence) => !isExploreString(sentence))
  ) {
    errors.push("hero.payoff must contain exactly two sentences.")
  }
}

function validateOrderedExploreRecords(
  value: unknown,
  order: readonly string[],
  path: string,
  keys: readonly string[],
  errors: string[],
  orderKey = "id",
): void {
  if (!Array.isArray(value) || value.length !== order.length) {
    errors.push(`${path} must contain exactly ${order.length} records.`)
    return
  }
  value.forEach((candidate, index) => {
    const itemPath = `${path}[${index}]`
    if (!isExploreRecord(candidate)) {
      errors.push(`${itemPath} must be an object.`)
      return
    }
    requireExploreKeys(candidate, keys, itemPath, errors)
    if (candidate[orderKey] !== order[index]) {
      errors.push(`${itemPath}.${orderKey} must be ${order[index]}.`)
    }
    for (const key of keys) {
      if (key !== orderKey && !isExploreString(candidate[key])) {
        errors.push(`${itemPath}.${key} is required.`)
      }
    }
  })
}

function validateExploreLinkRecord(
  value: unknown,
  path: string,
  keys: readonly string[],
  hrefKey: string,
  expectedHref: string,
  errors: string[],
): void {
  if (!isExploreRecord(value)) {
    errors.push(`${path} must be an object.`)
    return
  }
  requireExploreKeys(value, keys, path, errors)
  for (const key of keys) {
    if (!isExploreString(value[key])) errors.push(`${path}.${key} is required.`)
  }
  if (value[hrefKey] !== expectedHref) {
    errors.push(`${path}.${hrefKey} must be ${expectedHref}.`)
  }
}

function validateNormativeAliases(value: unknown, errors: string[]): void {
  const expected = [
    ["o", "Order-first"],
    ["c", "Conditional"],
    ["j", "Justice-first"],
  ] as const
  if (!Array.isArray(value) || value.length !== expected.length) {
    errors.push("normativeAliases must contain exactly three records.")
    return
  }
  value.forEach((candidate, index) => {
    const path = `normativeAliases[${index}]`
    if (!isExploreRecord(candidate)) {
      errors.push(`${path} must be an object.`)
      return
    }
    requireExploreKeys(candidate, ["state", "label", "description"], path, errors)
    if (
      candidate.state !== expected[index][0] ||
      candidate.label !== expected[index][1]
    ) {
      errors.push(`${path} must preserve the equal-weight o/c/j alias order.`)
    }
    if (!isExploreString(candidate.description)) {
      errors.push(`${path}.description is required.`)
    }
  })
}

function validateContextRecords(value: unknown, errors: string[]): void {
  if (!Array.isArray(value) || value.length !== EXPLORE_HUB_CONTEXT_ORDER.length) {
    errors.push(
      `contextRecords must contain exactly ${EXPLORE_HUB_CONTEXT_ORDER.length} records.`,
    )
    return
  }
  value.forEach((candidate, index) => {
    const path = `contextRecords[${index}]`
    if (!isExploreRecord(candidate)) {
      errors.push(`${path} must be an object.`)
      return
    }
    requireExploreKeys(
      candidate,
      ["id", "title", "description", "href"],
      path,
      errors,
    )
    const [id, href] = EXPLORE_HUB_CONTEXT_ORDER[index]
    if (candidate.id !== id) errors.push(`${path}.id must be ${id}.`)
    if (candidate.href !== href) errors.push(`${path}.href must be ${href}.`)
    for (const key of ["title", "description"] as const) {
      if (!isExploreString(candidate[key])) errors.push(`${path}.${key} is required.`)
    }
  })
}

function requireExploreKeys(
  value: Record<string, unknown>,
  expected: readonly string[],
  path: string,
  errors: string[],
): void {
  const actual = Object.keys(value).sort()
  const allowed = [...expected].sort()
  if (
    actual.length !== allowed.length ||
    actual.some((key, index) => key !== allowed[index])
  ) {
    errors.push(`${path} has unexpected or missing fields.`)
  }
}

function isExploreRecord(value: unknown): value is Record<string, unknown> {
  return Boolean(value && typeof value === "object" && !Array.isArray(value))
}

function isExploreString(value: unknown): value is string {
  return typeof value === "string" && value.trim().length > 0
}
