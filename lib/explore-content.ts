import { FamilyKey } from "@/lib/types"

export type ExploreReading = {
  title: string
  author: string
  note: string
}

export type ExploreFamily = {
  slug: string
  familyKey: FamilyKey
  name: string
  tagline: string
  summary: string
  emphasizes: string[]
  underweights: string[]
  persuasiveArguments: string[]
  neighbors: { name: string; contrast: string }[]
  readings: ExploreReading[]
  quizCoverage: { level: "strong" | "moderate" | "partial"; note: string }
}

export type ExploreGapEntry = {
  slug: string
  name: string
  summary: string
  whyNotYetModeled: string
}

// ── Modeled families ──────────────────────────────────────────────────────────

export const exploreFamilies: ExploreFamily[] = [
  {
    slug: "realism",
    familyKey: "realist",
    name: "Realism",
    tagline: "World politics is shaped by the distribution of power and the absence of any authority above states.",
    summary: `Realism begins with a blunt structural premise: there is no government above governments. In a world where no authority can reliably punish defection or guarantee protection, states have to look after themselves. This is not a claim about human nature being evil — it is a claim about the structure of the international system. Even states that want peace cannot be certain others feel the same, so they prepare for the worst.

That structural logic — anarchy plus uncertainty — is what realists argue drives the recurring patterns in world politics: arms races, balance-of-power dynamics, the tendency for states to compete even when they would prefer not to. The security dilemma captures the tragic version of this: measures taken for defense often look offensive from outside, producing arms spirals that no one wanted.

Realism is not a single view. Classical realists emphasize human nature and statecraft; structural realists emphasize the architecture of the system itself. Offensive realists argue that the structure pushes states toward maximizing power; defensive realists argue it often rewards restraint. What they share is the insistence that power and self-help are durable features of world politics, not temporary problems to be fixed by better institutions or warmer feelings.`,
    emphasizes: [
      "The permanence of uncertainty about others' intentions",
      "Relative power: what matters is not just how much you have, but how your position compares",
      "The security dilemma: defensive moves often look offensive from outside",
      "The tendency of states to balance against, rather than bandwagon with, rising powers",
      "Skepticism that rules, norms, or institutions can reliably constrain powerful states under pressure",
    ],
    underweights: [
      "How domestic politics, regime type, and bureaucratic capacity produce variation across states with similar external constraints",
      "The role of institutions in making cooperation more durable across lower-stakes issue areas",
      "How identity, legitimacy, and social expectations shape what counts as a threat",
      "Structural economic factors: dependence, supply chain vulnerability, capital flows",
      "The possibility that norms diffuse and genuinely change state behavior over time",
    ],
    persuasiveArguments: [
      "Overextension erodes the power base that makes a state secure — empires typically collapse from excessive commitments",
      "Major-power peace depends on favorable power distributions, not transformations of political character",
      "Attempts to build liberal order often serve the interests of the most powerful state that designed it",
      "States with similar strategic positions tend to behave similarly, regardless of regime type or ideology",
    ],
    neighbors: [
      {
        name: "Institutionalism",
        contrast:
          "Both work within a state-centric frame and accept anarchy as the baseline. Institutionalists argue that repeated interaction and shared rules can make cooperation durable even without enforcement — realists are skeptical that this holds under real pressure.",
      },
      {
        name: "Critical Political Economy",
        contrast:
          "Both are skeptical of liberal optimism, but locate the driving logic differently. Realists focus on security competition and power distribution; critical PE focuses on economic structure, capital flows, and dependence as the real constraints on state autonomy.",
      },
    ],
    readings: [
      {
        title: "Theory of International Politics",
        author: "Kenneth Waltz",
        note: "The foundational text of structural realism — argues that the distribution of power, not human nature, explains recurring patterns of conflict.",
      },
      {
        title: "The Tragedy of Great Power Politics",
        author: "John Mearsheimer",
        note: "The clearest statement of offensive realism: why major powers can never be satisfied with the status quo.",
      },
      {
        title: "Politics Among Nations",
        author: "Hans Morgenthau",
        note: "Classical realism's core text — focuses on the statecraft required to manage power competition in a world without common authority.",
      },
    ],
    quizCoverage: {
      level: "strong",
      note:
        "Realism is the most directly modeled tradition in the current quiz. The security competition dimension (uncertainty, rivalry, self-help) captures its core logic, and the restraint-vs-maximization dimension captures the debate within realism about grand strategy. The strategic technology and ally trade scenarios also probe realist instincts about relative gains. The model does not distinguish between offensive realism, defensive realism, and classical realism — these are treated as variations within a shared structural frame.",
    },
  },

  {
    slug: "institutionalism",
    familyKey: "institutionalist",
    name: "Institutionalism",
    tagline: "Cooperation can be made durable through shared rules, monitoring, and repeated interaction — even without a world government.",
    summary: `If realism treats anarchy as a trap, institutionalism treats it as a challenge that can be managed. The core argument is that states cooperate less than they could, not because they are inherently hostile, but because they lack reliable information about each other's intentions and no way to verify compliance. International institutions — treaties, organizations, monitoring bodies, dispute-resolution mechanisms — can solve those problems without requiring trust or a world government.

The logic is about changing incentive structures over time. When violations are visible and reputations accumulate across many interactions, the short-term gains from defection become less attractive. States that invest in institutions gain access to cooperation they could not sustain through bilateral deal-making alone.

Liberal institutionalism also takes domestic politics seriously. The "two-level game" insight — that governments are simultaneously negotiating with foreign counterparts and their own domestic constituencies — helps explain why states with similar external environments sometimes reach very different outcomes. Regime type, parliamentary constraints, and interest-group politics all shape what states bring to the table.`,
    emphasizes: [
      "Absolute gains: both parties can benefit from cooperation even if one gains relatively more",
      "How institutions lower the transaction costs of reaching and verifying agreements",
      "The role of monitoring and transparency in reducing cheating",
      "Domestic politics and regime type as filters on what states can credibly commit to",
      "Repeated interaction: longer time horizons reduce the pull of short-term defection",
    ],
    underweights: [
      "How the most powerful states shape which institutions get built, and in whose interest",
      "Structural economic power: who sets the rules, who pays the costs of adjustment",
      "The extent to which institutions can be bypassed or dismantled under acute security pressure",
      "Identity and legitimacy: why some institutions are seen as credible by some actors but not others",
      "The difficulty of building institutions for genuinely novel problems before the political will exists",
    ],
    persuasiveArguments: [
      "Trade regimes create export constituencies that make future protectionism politically costly",
      "Transparency mechanisms in arms control reduce uncertainty without requiring prior trust",
      "Alliance management benefits from institutional frameworks that prevent miscalculation",
      "International courts and dispute-resolution bodies reduce the cost of peaceful conflict resolution",
    ],
    neighbors: [
      {
        name: "Realism",
        contrast:
          "Both are state-centric and accept anarchy as the baseline. The disagreement is whether institutions can shift behavior independently of the underlying power distribution — institutionalists say yes, realists are skeptical.",
      },
      {
        name: "Constructivism",
        contrast:
          "Both look beyond raw power. The key difference is the causal variable: institutionalists emphasize rules and repeated interaction; constructivists emphasize shared identity and the social meaning of cooperation.",
      },
    ],
    readings: [
      {
        title: "After Hegemony",
        author: "Robert Keohane",
        note: "The core argument for why international institutions can sustain cooperation even after the dominant power that created them declines.",
      },
      {
        title: "Diplomacy and Domestic Politics",
        author: "Robert Putnam",
        note: "The two-level game paper — how domestic politics constrains and shapes international bargaining.",
      },
      {
        title: "Power and Governance in a Partially Globalized World",
        author: "Robert Keohane",
        note: "A more recent reflection on the limits and possibilities of global governance.",
      },
    ],
    quizCoverage: {
      level: "strong",
      note:
        "Institutionalism is one of the most directly modeled traditions. The institutions dimension captures the core question — do rules shape outcomes independently? The domestic filters dimension captures liberal arguments about how internal politics shape foreign policy. The scenarios on institutional capture and sanctions-monitoring probe institutionalist instincts about when rules fail. This tradition is modeled with reasonable depth.",
    },
  },

  {
    slug: "constructivism",
    familyKey: "constructivist",
    name: "Constructivism",
    tagline: "The meaning of threats, alliances, and interests is partly constituted by identity, norms, and shared social expectations.",
    summary: `Constructivism asks a different kind of question: where do interests come from? Realists and institutionalists largely treat state interests as given — states want security, growth, and survival. Constructivists argue that what counts as a threat, what counts as a win, and what kinds of cooperation are imaginable all depend on shared identities, social expectations, and the historical context that shapes how states understand themselves and each other.

The same military move can be threatening or reassuring, depending entirely on the relationship between the states involved. The United States and Canada do not experience each other's armed forces as threatening; the United States and China do, even when capabilities in a given situation are similar. That difference, constructivists argue, cannot be explained by military math alone — it requires understanding how identities and historical relationships shape what actors mean by their actions.

Constructivism also takes norms seriously as causal factors, not just as rhetorical cover for power. The post-1945 spread of human rights norms, the rise of anti-colonial international law, and changing standards around the use of chemical weapons all represent genuine shifts in what states consider legitimate — and those shifts have had real policy consequences.`,
    emphasizes: [
      "The social construction of threats: who is doing something matters as much as what they are doing",
      "How identities and norms shape the menu of legitimate options for state behavior",
      "Legitimacy as a real causal variable, not just rhetorical packaging for power",
      "The possibility of norm diffusion: how standards spread and become internalized across the international system",
      "The role of recognition, status, and social expectations in driving state behavior beyond narrow calculation",
    ],
    underweights: [
      "Material power and structural constraints: hard limits on what norms can achieve against determined resistance",
      "The difficulty of changing norms against the resistance of powerful actors who benefit from the status quo",
      "Economic structural power and its role in shaping which ideas gain traction internationally",
      "Crisis behavior: norms tend to be most contested precisely when they are most needed",
    ],
    persuasiveArguments: [
      "Longstanding enemies can genuinely become friends through sustained interaction and identity change — Franco-German relations after 1945 being the clearest example",
      "International law works partly because states internalize its obligations, not just because they fear punishment",
      "The spread of human rights norms since 1945 represents a genuine transformation, not just rhetorical window-dressing",
      "Domestic audiences care about legitimacy in ways that constrain even powerful governments",
    ],
    neighbors: [
      {
        name: "Institutionalism",
        contrast:
          "Both look beyond raw power. The key difference is the causal variable: institutionalists emphasize rules and monitoring; constructivists emphasize the shared identities and social expectations that give rules meaning in the first place.",
      },
      {
        name: "Critical Political Economy",
        contrast:
          "Both are critical of the positivist mainstream in IR. Constructivism focuses on ideas and norms; critical PE focuses on economic structures and class. The two traditions sometimes converge in asking whose interests a given set of norms actually serves.",
      },
    ],
    readings: [
      {
        title: "Anarchy Is What States Make of It",
        author: "Alexander Wendt",
        note: "The seminal article — argues that anarchy does not have a fixed meaning; its consequences depend on the identities and relationships that states construct.",
      },
      {
        title: "The Culture of National Security",
        author: "ed. Peter Katzenstein",
        note: "A set of empirical applications of constructivist ideas to security policy — shows how norms and identity shape concrete decisions.",
      },
      {
        title: "Rules for the World",
        author: "Martha Finnemore & Michael Barnett",
        note: "An examination of how international organizations develop their own institutional logics and shape state behavior.",
      },
    ],
    quizCoverage: {
      level: "moderate",
      note:
        "Constructivism is modeled through the norms-and-identity dimension, which captures questions about whether identity shapes interests and whether legitimacy matters independently of power. The scenario on former rivals transforming also probes constructivist instincts about identity change. The current question bank does not fully capture the constructivist debate about norm diffusion, socialization, and the conditions under which identity change is possible — these are areas for future expansion.",
    },
  },

  {
    slug: "critical-political-economy",
    familyKey: "criticalPoliticalEconomy",
    name: "Critical Political Economy",
    tagline: "World politics is shaped by who controls production, finance, and access to markets — not just who has the most tanks.",
    summary: `Critical political economy starts from a different set of puzzles. It is less interested in who won the last great-power competition than in asking who sets the rules of the international economy, who benefits from them, and why some states have far less room to maneuver than their formal sovereignty might imply. The tradition draws on Marxist economics, dependency theory, and economic sociology to argue that the structure of global capitalism shapes world politics in ways that conventional security analysis misses.

Formal sovereignty does not equal actual independence. A state that must roll over its external debt every six months, whose exports consist of a single commodity, and whose currency is pegged to that of a much larger economy faces real constraints that do not show up in its formal legal status. Critical PE scholars argue that these structural conditions — not just military power or institutional design — explain patterns of alignment, crisis, and development outcomes.

The tradition also attends to who builds the rules. The institutions that govern international trade, investment, and finance were designed mostly by wealthy states in periods of their own dominance. The question of whether those institutions serve broad interests or narrow ones — and whether reform from within is possible — is a running debate within and around this tradition.`,
    emphasizes: [
      "The international division of production: who makes what, and under whose terms",
      "Structural power in finance: who sets interest rates, who provides liquidity, who imposes conditionality",
      "Economic dependence as a form of political constraint: formal sovereignty does not equal actual independence",
      "Capital flows and their relationship to crisis, vulnerability, and leverage",
      "How economic hierarchies reproduce themselves through the design of international institutions",
    ],
    underweights: [
      "Security competition that is not straightforwardly reducible to economic interests",
      "Identity, legitimacy, and the social meaning of cooperation and conflict",
      "Domestic politics variation: why do similarly positioned states respond differently to structural constraints?",
      "Military and security crises driven primarily by strategic logic rather than economic position",
    ],
    persuasiveArguments: [
      "IMF conditionality historically reflects the interests of creditor states more than the development needs of debtor states",
      "The dollar's reserve-currency status gives the United States structural leverage that is independent of military power",
      "Financial crises in developing economies are partly produced by the structure of global finance, not just domestic mismanagement",
      "Trade and investment agreements systematically tilt bargaining power toward capital over labor and governments",
    ],
    neighbors: [
      {
        name: "Realism",
        contrast:
          "Both are skeptical of liberal optimism. The difference is the driving logic: realists focus on security competition and the distribution of military power; critical PE focuses on economic structure, class, and the politics of production and finance.",
      },
      {
        name: "Constructivism",
        contrast:
          "Both are critical of the positivist mainstream. Critical PE emphasizes material structures — who controls capital and supply chains; constructivism emphasizes ideas and norms. The two traditions sometimes converge in asking whose interests prevailing arrangements serve.",
      },
    ],
    readings: [
      {
        title: "States and Markets",
        author: "Susan Strange",
        note: "The argument that financial structures create power independent of formal authority — still the sharpest introduction to structural power in the international economy.",
      },
      {
        title: "The Political Economy of International Relations",
        author: "Robert Gilpin",
        note: "A more liberal framing that maps the three main approaches (realist, liberal, Marxist) to international economic order — useful as an orientation.",
      },
      {
        title: "Social Forces, States and World Orders",
        author: "Robert Cox",
        note: "The critical IR theory argument that theory always serves someone's interests — a key text in critical PE and IPE.",
      },
    ],
    quizCoverage: {
      level: "partial",
      note:
        "Critical political economy is modeled through the political economy dimension, which captures instincts about whether global economics is necessary to explain international outcomes. The scenarios on financial crisis and capital controls also probe these instincts. The current model is thinner here than for realism or institutionalism — it captures the core orientation but does not have dedicated dimensions for questions about class, production hierarchies, or the granular politics of global finance. This is the tradition most underrepresented in the current version, and an area for expansion in future iterations.",
    },
  },
]

// ── Traditions not yet fully modeled ─────────────────────────────────────────

export const exploreGaps: ExploreGapEntry[] = [
  {
    slug: "feminist-ir",
    name: "Feminist IR",
    summary:
      "Feminist IR asks who is made invisible by mainstream IR's focus on states, power, and security. It argues that the discipline's core concepts — security, sovereignty, power — are shaped by assumptions about gender that are rarely examined. Feminist scholars have examined how war affects women differently from men, how militarism is connected to masculine norms, and what a security agenda centered on human vulnerability rather than state survival would look like. The tradition spans liberal feminism (getting more women into existing institutions) and more radical critiques of militarism and the gendered foundations of the state.",
    whyNotYetModeled:
      "Adding feminist IR as a scored family would require new dimensions on human security, gender analysis, and the critique of militarism that the current item bank does not support. Doing it with the current questions would produce spurious classifications.",
  },
  {
    slug: "postcolonial-ir",
    name: "Postcolonial and Decolonial IR",
    summary:
      "Postcolonial and decolonial IR scholars argue that the mainstream discipline was built on and for a world organized by European colonial power, and that this origin shapes what questions get asked and which actors get treated as agents rather than objects. They emphasize the colonial legacies that structure contemporary international inequality, the silenced perspectives of the global South, and the need to decolonize both the canon and the practice of IR. They also challenge the universality of Western IR concepts — asking whether 'sovereignty,' 'anarchy,' and 'security' mean the same things to states whose borders were drawn by colonial powers.",
    whyNotYetModeled:
      "Its inclusion would require dimensions on colonial legacies, Eurocentrism, and the politics of knowledge production in IR that would require substantial new question design and validation. The current instrument is likely to misclassify people whose primary orientation is postcolonial — they may land in critical PE or constructivism as the closest available buckets.",
  },
  {
    slug: "green-ir",
    name: "Green IR and Ecological Security",
    summary:
      "Green IR asks what the international system looks like when ecological limits are taken seriously. Climate change, resource scarcity, and biodiversity loss are not just environmental problems — they reshape security calculations, economic structures, and the legitimacy of governance in ways the traditional paradigms were not designed to address. Green IR scholars argue that the state-centric security frame systematically misses the most consequential long-run threats to human welfare, and that a meaningful international order must grapple with planetary boundaries rather than treating nature as a backdrop to great-power politics.",
    whyNotYetModeled:
      "Adding green IR would require new dimensions on ecological security, the relationship between development and environmental constraint, and the governance of global commons. These are distinct theoretical commitments that cannot be captured by the current seven dimensions without stretching their meaning.",
  },
  {
    slug: "english-school",
    name: "English School / International Society",
    summary:
      "The English School occupies a middle ground between realism and liberalism. It argues that states form something like an international society — a community with shared norms, rules, and institutions that constrain behavior, even in the absence of world government. It is distinctive for taking international law and diplomacy seriously as social practices rather than mere instruments of power. The pluralism-solidarism debate within the English School — whether international society is primarily organized around state sovereignty or broader humanitarian norms — maps onto this quiz's order-justice dimension, making it the tradition most partially captured by the current instrument.",
    whyNotYetModeled:
      "The English School's full theoretical depth — its account of international society, the role of diplomacy as a social institution, and the historical sociology of international order — is not yet modeled. The order-justice dimension captures one important debate within the tradition, but the broader framework deserves dedicated dimensions and item coverage.",
  },
]

// ── Lookup helpers ────────────────────────────────────────────────────────────

export function getFamilyBySlug(slug: string): ExploreFamily | null {
  return exploreFamilies.find((f) => f.slug === slug) ?? null
}

export function getFamilyByKey(key: FamilyKey): ExploreFamily | null {
  return exploreFamilies.find((f) => f.familyKey === key) ?? null
}

export const coverageLevelLabels: Record<"strong" | "moderate" | "partial", string> = {
  strong: "Strongly modeled",
  moderate: "Moderately modeled",
  partial: "Partially modeled",
}
