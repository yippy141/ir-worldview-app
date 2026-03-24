import type { FamilyKey } from "@/lib/types"
import { familyKeyFromSlug, familySlug } from "@/lib/worldview-config"

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
  coreClaims: string[]
  subtraditions: { name: string; note: string }[]
  emphasizes: string[]
  underweights: string[]
  persuasiveArguments: string[]
  issueReadings: { issue: string; note: string }[]
  neighbors: { familyKey: FamilyKey; contrast: string }[]
  readings: ExploreReading[]
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
    name: "Realism",
    tagline: "World politics is shaped by the distribution of power and the absence of any authority above states.",
    summary: `Realism begins with a blunt structural premise: there is no government above governments. In a world where no authority can reliably punish defection or guarantee protection, states have to look after themselves. This is not a claim about human nature being evil — it is a claim about the structure of the international system. Even states that want peace cannot be certain others feel the same, so they prepare for the worst.

That structural logic — anarchy plus uncertainty — is what realists argue drives the recurring patterns in world politics: arms races, balance-of-power dynamics, the tendency for states to compete even when they would prefer not to. The security dilemma captures the tragic version of this: measures taken for defense often look offensive from outside, producing arms spirals that no one wanted.

Realism is not a single view. Classical realists emphasize human nature and statecraft; structural realists emphasize the architecture of the system itself. Offensive realists argue that the structure pushes states toward maximizing power; defensive realists argue it often rewards restraint. What they share is the insistence that power and self-help are durable features of world politics, not temporary problems to be fixed by better institutions or warmer feelings.`,
    coreClaims: [
      "Anarchy — the absence of a central authority above states — is the defining structural condition of world politics.",
      "Under anarchy, states cannot be certain of others' intentions, so they must provide for their own security through self-help.",
      "The distribution of power (polarity) shapes patterns of conflict and cooperation more than any other variable.",
      "Relative gains matter: a cooperative arrangement that advantages a rival more than oneself weakens one's long-run position.",
      "The security dilemma: defensive measures often appear threatening from outside, generating arms spirals that no party intended.",
    ],
    subtraditions: [
      {
        name: "Classical realism",
        note:
          "Associated with Morgenthau and Niebuhr. Grounds the realist argument in human nature — a drive for power that is psychological, not merely structural. Emphasizes statecraft, the role of leaders, and the tragic character of international politics.",
      },
      {
        name: "Structural realism (neorealism)",
        note:
          "Associated with Waltz. Shifts the explanation from human drives to the architecture of the system — the anarchic structure and the distribution of capabilities among states. Leaders matter less; the structure constrains and shapes behavior.",
      },
      {
        name: "Offensive realism",
        note:
          "Associated with Mearsheimer. The structure of anarchy pushes states toward maximizing power because there is no safe stopping point — states can never know when they have enough security to stop competing.",
      },
      {
        name: "Defensive realism",
        note:
          "Associated with Glaser, Van Evera, and Snyder. Argues that the structure often rewards restraint and that most conflicts are caused by miscalculation, domestic pathologies, or offensive spirals — not by anarchy per se requiring endless expansion.",
      },
    ],
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
    issueReadings: [
      {
        issue: "Great-power rivalry",
        note:
          "Reads rising-power competition as structurally driven — the same pattern recurs regardless of ideology, regime type, or declared intentions. The rising power expands its reach; the established power balances. Conflict risk is highest in the transitional period when power parity is closest.",
      },
      {
        issue: "Trade and technology decoupling",
        note:
          "Reads economic interdependence primarily as a vulnerability. Reliance on adversary supply chains creates leverage. Technology leadership translates directly into military advantage, making restrictions rational even at significant economic cost.",
      },
      {
        issue: "Humanitarian intervention",
        note:
          "Deeply skeptical. States invoke humanitarian language to justify actions driven by strategic interests. The non-intervention norm protects weaker states as much as it shields bad actors. Realists prefer restraint unless core interests are directly engaged, and warn that intervention tends to create new instabilities.",
      },
    ],
    neighbors: [
      {
        familyKey: "institutionalist",
        contrast:
          "Both work within a state-centric frame and accept anarchy as the baseline. Institutionalists argue that repeated interaction and shared rules can make cooperation durable even without enforcement — realists are skeptical that this holds under real pressure.",
      },
      {
        familyKey: "criticalPoliticalEconomy",
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
    slug: familySlug("institutionalist"),
    familyKey: "institutionalist",
    name: "Institutionalism",
    tagline: "Cooperation can be made durable through shared rules, monitoring, and repeated interaction — even without a world government.",
    summary: `If realism treats anarchy as a trap, institutionalism treats it as a challenge that can be managed. The core argument is that states cooperate less than they could, not because they are inherently hostile, but because they lack reliable information about each other's intentions and no way to verify compliance. International institutions — treaties, organizations, monitoring bodies, dispute-resolution mechanisms — can solve those problems without requiring trust or a world government.

The logic is about changing incentive structures over time. When violations are visible and reputations accumulate across many interactions, the short-term gains from defection become less attractive. States that invest in institutions gain access to cooperation they could not sustain through bilateral deal-making alone.

Liberal institutionalism also takes domestic politics seriously. The "two-level game" insight — that governments are simultaneously negotiating with foreign counterparts and their own domestic constituencies — helps explain why states with similar external environments sometimes reach very different outcomes. Regime type, parliamentary constraints, and interest-group politics all shape what states bring to the table.`,
    coreClaims: [
      "Cooperation is underproduced not because states are inherently hostile, but because of information problems — they cannot verify intentions or detect cheating.",
      "International institutions reduce transaction costs: they make it easier to reach, implement, and enforce agreements.",
      "Repeated interaction under rules lengthens time horizons and diminishes the attractiveness of short-term defection.",
      "States pursue absolute gains — both parties benefit from cooperation even if the gains are asymmetric.",
      "Domestic politics filters international bargaining: regime type, parliamentary constraints, and interest coalitions shape what governments can credibly commit to.",
    ],
    subtraditions: [
      {
        name: "Liberal institutionalism (neoliberalism)",
        note:
          "The mainstream strand — associated with Keohane and Nye. Focuses on how international organizations and regimes lower the cost of verifying compliance and make cooperation self-sustaining across issue areas, even as power distributions shift.",
      },
      {
        name: "Two-level game / domestic politics",
        note:
          "Associated with Putnam. States simultaneously negotiate internationally and manage domestic ratification constituencies. 'Win-sets' — the range of agreements that can survive domestic approval — shape what is achievable abroad.",
      },
      {
        name: "Democratic peace theory",
        note:
          "The empirical claim that democracies rarely fight each other — explained institutionally by the constraints legislatures, publics, and transparency norms impose on executive discretion over the use of force.",
      },
      {
        name: "Global governance / regime complexity",
        note:
          "A more recent strand examining how overlapping institutional arrangements — trade regimes, climate agreements, human rights law — interact, sometimes synergistically and sometimes in contradiction, producing layered governance without a single hierarchy.",
      },
    ],
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
    issueReadings: [
      {
        issue: "Great-power rivalry",
        note:
          "Argues rivalry can be managed through sustained institutional engagement. Trade and investment ties create domestic constituencies for stability. Military confidence-building measures and arms-control regimes reduce miscalculation risk. The framework points to economic interdependence as a structural brake on conflict escalation.",
      },
      {
        issue: "Trade and technology decoupling",
        note:
          "Warns that broad decoupling is costly to all parties and erodes the trading rules that have underpinned growth since 1945. Prefers targeted measures — export controls narrowly scoped to genuinely dual-use items — embedded in multilateral frameworks rather than unilateral broad-spectrum restrictions.",
      },
      {
        issue: "Humanitarian intervention",
        note:
          "More permissive than realism when institutional authorization exists. R2P and UN Security Council authorization make intervention more legitimate and sustainable. Skeptical of unilateral action, but supports multilateral intervention with clear objectives, exit criteria, and post-conflict institution-building.",
      },
    ],
    neighbors: [
      {
        familyKey: "realist",
        contrast:
          "Both are state-centric and accept anarchy as the baseline. The disagreement is whether institutions can shift behavior independently of the underlying power distribution — institutionalists say yes, realists are skeptical.",
      },
      {
        familyKey: "constructivist",
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
    modelingNote:
      "This page models liberal institutionalism — the tradition associated with Keohane, Nye, and the study of international regimes and cooperation under anarchy. It does not model the full liberal tradition in IR. Other liberal strands — commercial liberalism (trade reduces the incentive for conflict), republican liberalism (democratic institutions shape foreign policy), and sociological liberalism (transnational actors and networks matter) — share a general optimism about cooperation but differ substantially in their explanatory emphasis. The quiz primarily tests institutionalist instincts.",
  },

  {
    slug: familySlug("constructivist"),
    familyKey: "constructivist",
    name: "Constructivism",
    tagline: "The meaning of threats, alliances, and interests is partly constituted by identity, norms, and shared social expectations.",
    summary: `Constructivism asks a different kind of question: where do interests come from? Realists and institutionalists largely treat state interests as given — states want security, growth, and survival. Constructivists argue that what counts as a threat, what counts as a win, and what kinds of cooperation are imaginable all depend on shared identities, social expectations, and the historical context that shapes how states understand themselves and each other.

The same military move can be threatening or reassuring, depending entirely on the relationship between the states involved. The United States and Canada do not experience each other's armed forces as threatening; the United States and China do, even when capabilities in a given situation are similar. That difference, constructivists argue, cannot be explained by military math alone — it requires understanding how identities and historical relationships shape what actors mean by their actions.

Constructivism also takes norms seriously as causal factors, not just as rhetorical cover for power. The post-1945 spread of human rights norms, the rise of anti-colonial international law, and changing standards around the use of chemical weapons all represent genuine shifts in what states consider legitimate — and those shifts have had real policy consequences.`,
    coreClaims: [
      "Interests are not given — they are socially constructed through processes of identity formation, norm diffusion, and shared expectations.",
      "Anarchy does not have a single fixed logic; its consequences depend on the identities and relationships states construct within it.",
      "Norms are causal, not merely rhetorical. Internalized norms shape what actors consider legitimate even in the absence of coercive enforcement.",
      "Recognition, status, and social belonging are genuine motivators of state behavior — not reducible to material calculation.",
      "Change in world politics happens through socialization, persuasion, and the gradual redefinition of what is considered a legitimate interest.",
    ],
    subtraditions: [
      {
        name: "Conventional constructivism",
        note:
          "The mainstream strand — associated with Wendt, Finnemore, Katzenstein, and Checkel. Takes a broadly scientific approach, arguing that norms and identities are empirically important variables that can be studied systematically alongside material factors.",
      },
      {
        name: "Critical constructivism",
        note:
          "More skeptical of the mainstream's positivist leanings. Draws on Frankfurt School critical theory, asking not just how norms work but whose interests prevailing norms serve and how they can be contested and changed.",
      },
      {
        name: "Poststructuralism",
        note:
          "Associated with Der Derian, Campbell, and Ashley. More radical in questioning the stable identities and fixed interests that even conventional constructivism tends to assume. Focuses on discourse, representation, and the politics of security as a speech act.",
      },
    ],
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
    issueReadings: [
      {
        issue: "Great-power rivalry",
        note:
          "Examines how threat perceptions are constructed through historical relationships, identity narratives, and strategic culture. The same military capability can be read as defensive or offensive depending on shared understandings. Constructivists point to the role of mutual misrecognition — failures of acknowledgment — in driving conflict spirals beyond what material factors alone predict.",
      },
      {
        issue: "Trade and technology decoupling",
        note:
          "Focuses on the framing: 'decoupling' and 'supply-chain security' are not neutral technical descriptions but constructions that activate particular identities (economic nationalism, existential competition) and foreclose others (mutual dependence, shared governance). The narrative shapes the policy as much as the underlying material reality.",
      },
      {
        issue: "Humanitarian intervention",
        note:
          "The tradition that best explains why the post-1990s norm of humanitarian intervention emerged when it did. Norm entrepreneur networks, the evolving meaning of sovereignty as responsibility, and the diffusion of R2P are prime constructivist cases. The tradition also raises critical questions about whose suffering activates the norm and whose does not.",
      },
    ],
    neighbors: [
      {
        familyKey: "institutionalist",
        contrast:
          "Both look beyond raw power. The key difference is the causal variable: institutionalists emphasize rules and monitoring; constructivists emphasize the shared identities and social expectations that give rules meaning in the first place.",
      },
      {
        familyKey: "criticalPoliticalEconomy",
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
    slug: familySlug("criticalPoliticalEconomy"),
    familyKey: "criticalPoliticalEconomy",
    name: "Critical Political Economy",
    tagline: "World politics is shaped by who controls production, finance, and access to markets — not just who has the most tanks.",
    summary: `Critical political economy starts from a different set of puzzles. It is less interested in who won the last great-power competition than in asking who sets the rules of the international economy, who benefits from them, and why some states have far less room to maneuver than their formal sovereignty might imply. The tradition draws on Marxist economics, dependency theory, and economic sociology to argue that the structure of global capitalism shapes world politics in ways that conventional security analysis misses.

Formal sovereignty does not equal actual independence. A state that must roll over its external debt every six months, whose exports consist of a single commodity, and whose currency is pegged to that of a much larger economy faces real constraints that do not show up in its formal legal status. Critical PE scholars argue that these structural conditions — not just military power or institutional design — explain patterns of alignment, crisis, and development outcomes.

The tradition also attends to who builds the rules. The institutions that govern international trade, investment, and finance were designed mostly by wealthy states in periods of their own dominance. The question of whether those institutions serve broad interests or narrow ones — and whether reform from within is possible — is a running debate within and around this tradition.`,
    coreClaims: [
      "The structure of the world economy — who controls production, finance, and access to markets — shapes state autonomy independent of military power.",
      "Formal sovereignty does not equal actual autonomy: debt structures, currency dependence, and commodity specialization impose real constraints on developing states.",
      "The international institutions governing trade and finance were designed in periods of Western dominance and structurally reflect those interests.",
      "Class interests and the imperatives of capital accumulation — not just state interests — drive foreign economic policy.",
      "Economic crises are not random shocks but reflect structural contradictions in how global capitalism is organized and reproduced.",
    ],
    subtraditions: [
      {
        name: "Marxist political economy",
        note:
          "Grounds analysis in the dynamics of capital accumulation, class struggle, and the state as an instrument of class interest. Imperialism — the extension of capitalist accumulation abroad — is a structural tendency, not a mere policy choice. Associated with Lenin, Gramsci, and in contemporary IR with Robert Cox and Stephen Gill.",
      },
      {
        name: "Dependency theory",
        note:
          "Developed by Prebisch, Cardoso, and the ECLAC school in Latin America. Argues that core-periphery relations in the world economy systematically disadvantage developing states: terms of trade deteriorate over time, capital flows upward, and industrialization in the periphery is distorted by the requirements of the core.",
      },
      {
        name: "World-systems theory",
        note:
          "Associated with Wallerstein. Extends dependency theory into a historical sociology of capitalism as a single world-system, with core, semi-periphery, and periphery zones whose relative positions are structurally reproduced across cycles of accumulation.",
      },
      {
        name: "Structural power and IPE",
        note:
          "Associated with Susan Strange. Focuses on structural power in international finance — who provides liquidity in a crisis, who sets interest rates, who controls access to credit — as a source of political leverage that operates independently of formal authority or military capability.",
      },
    ],
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
    issueReadings: [
      {
        issue: "Great-power rivalry",
        note:
          "Interprets US-China rivalry partly as a struggle over who controls the rules of the global economy — currency dominance, technology standards, supply-chain geography, and the institutions that set the terms of international investment and trade. Military competition is real, but the deeper contest is over whose production and financial structures anchor the next phase of global capitalism.",
      },
      {
        issue: "Trade and technology decoupling",
        note:
          "Reads decoupling as both a symptom of structural rivalry and a restructuring of global production hierarchies. Asks who bears the adjustment costs — typically workers and consumers in both countries — and who benefits from the restructuring (capital owners who relocate production, state contractors, defense industries). Skeptical of framing that treats decoupling as a cost-free national security necessity.",
      },
      {
        issue: "Humanitarian intervention",
        note:
          "Skeptical. Examines the material interests behind humanitarian rhetoric: strategic resources, access to markets, the interests of defense industries. Notes that intervention patterns correlate with economic stakes as much as with the severity of humanitarian crises, and that post-intervention economic arrangements tend to favor the intervening powers and their investors.",
      },
    ],
    neighbors: [
      {
        familyKey: "realist",
        contrast:
          "Both are skeptical of liberal optimism. The difference is the driving logic: realists focus on security competition and the distribution of military power; critical PE focuses on economic structure, class, and the politics of production and finance.",
      },
      {
        familyKey: "constructivist",
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
    modelingNote:
      "Critical political economy is an umbrella for several distinct but related strands. Marxist political economy foregrounds class and capital accumulation as the drivers of foreign economic policy. Dependency theory (Prebisch, Cardoso, Frank) emphasizes how core-periphery relations structurally reproduce underdevelopment. World-systems theory (Wallerstein) extends this to a long-run analysis of capitalism as a single historical system. Neo-Gramscian IPE (Cox, Gill) examines how hegemony and ideology reproduce international economic order. Structural power analysis (Strange) focuses on how control over production, finance, security, and knowledge structures creates power independent of formal authority. The quiz scores these strands together as a single orientation — it does not yet disaggregate them.",
  },
]

// ── Issue comparisons ─────────────────────────────────────────────────────────

export const issueCompares: IssueCompare[] = [
  {
    slug: "great-power-rivalry",
    title: "Great-power rivalry",
    summary:
      "How does each tradition explain the logic of major-power competition — its causes, its dynamics, and what, if anything, can constrain it?",
    readings: [
      {
        familyKey: "realist",
        note:
          "Reads rising-power competition as structurally determined. When a state grows strong enough to challenge the dominant power, conflict risk rises regardless of the challenger's ideology or intentions. The mechanism is not malice but the logic of self-help under anarchy: both sides must assume the worst. Balancing — through alliances, arms investment, and forward positioning — is the expected response.",
      },
      {
        familyKey: "institutionalist",
        note:
          "Argues that rivalry can be managed through sustained institutional engagement. Economic interdependence creates domestic stakeholders for stability on both sides. Military transparency and arms-control frameworks reduce the miscalculation risk that turns competition into crisis. The historical record of major-power peace among trading democracies is taken as evidence that structure alone does not determine outcomes.",
      },
      {
        familyKey: "constructivist",
        note:
          "Emphasizes that the intensity and character of rivalry are socially constructed — shaped by historical memories, mutual recognition failures, and identity narratives that make adversarial relationships feel inevitable. Points to cases of successful enmity transformation (Franco-German, US-Japanese) as evidence that structure is not destiny. Rival identity constructions can be disrupted through sustained diplomacy, socialization, and domestic political change.",
      },
      {
        familyKey: "criticalPoliticalEconomy",
        note:
          "Interprets great-power competition partly as a contest over economic governance — currency dominance, technology standards, supply-chain geography, and control of the institutions that set the rules of international trade and investment. Military rivalry is real, but the deeper contest is over whose production and financial structures define the next phase of the world economy.",
      },
    ],
  },
  {
    slug: "trade-technology-decoupling",
    title: "Trade and technology decoupling",
    summary:
      "How does each tradition interpret the drive to restrict trade and technology flows in the name of national security — and at what cost?",
    readings: [
      {
        familyKey: "realist",
        note:
          "Treats economic interdependence primarily as a vulnerability when a partner is also an adversary. Technology leadership translates into military advantage, making controls on dual-use exports rational even at economic cost. Relative gains logic applies: a trade arrangement that develops the adversary's industrial base is strategically harmful even if it produces net economic growth.",
      },
      {
        familyKey: "institutionalist",
        note:
          "Warns that broad decoupling is costly to both parties, undermines the multilateral trading rules that have underpinned global growth, and is likely to be self-defeating as third parties hedge rather than align. Prefers targeted, narrowly scoped controls embedded in multilateral frameworks — export controls on genuinely dual-use items, investment screening for critical sectors — over wholesale economic separation.",
      },
      {
        familyKey: "constructivist",
        note:
          "Focuses on the framing: 'decoupling' and 'supply-chain security' are not neutral technical descriptions but constructions that activate adversarial identities and foreclose alternative framings (mutual dependence, shared governance, managed competition). The political narrative shapes the policy as much as the underlying material reality, and the framing can become self-fulfilling.",
      },
      {
        familyKey: "criticalPoliticalEconomy",
        note:
          "Reads decoupling as a restructuring of global production hierarchies — a contest over which state's firms control key nodes in the technology supply chain. Asks who bears the adjustment costs (workers, consumers, smaller trading partners) and who benefits (domestic contractors, capital that relocates). Skeptical of framing that treats decoupling as a cost-free national security necessity rather than a political choice with distributional consequences.",
      },
    ],
  },
  {
    slug: "humanitarian-intervention",
    title: "Humanitarian intervention",
    summary:
      "When, if ever, does mass atrocity justify overriding sovereignty — and what explains the pattern of when interventions happen and when they do not?",
    readings: [
      {
        familyKey: "realist",
        note:
          "Deeply skeptical. States invoke humanitarian language to justify actions driven by strategic interests; the correlation between intervention and material stakes is too consistent to ignore. The non-intervention norm protects weaker states as much as it shields bad actors. Realists prefer restraint except where core interests are directly engaged, and warn that intervention tends to create new instabilities it cannot manage.",
      },
      {
        familyKey: "institutionalist",
        note:
          "More permissive when institutional authorization exists. R2P and UN Security Council authorization transform the legitimacy calculus — multilateral intervention with clear objectives and exit criteria is preferable to both unilateral action and inaction. Skeptical of unauthorized intervention on precedent grounds, but supports the institutional framework for managed, collective response to mass atrocity.",
      },
      {
        familyKey: "constructivist",
        note:
          "The tradition that best explains why the humanitarian intervention norm emerged when it did. Norm entrepreneur networks, the evolution of sovereignty as responsibility, and the diffusion of R2P are prime constructivist cases. The tradition also raises critical questions: whose suffering activates the norm, whose does not, and whether the norm has been selectively applied in ways that reflect power rather than principle.",
      },
      {
        familyKey: "criticalPoliticalEconomy",
        note:
          "Skeptical and critical. Examines the material interests behind humanitarian rhetoric: strategic resources, market access, defense industry interests. Notes that intervention patterns correlate with economic stakes as much as with the severity of crises, and that post-intervention economic arrangements tend to favor the intervening powers and their investors. Humanitarian framing is analyzed as ideology that obscures material motivations.",
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
