import type { PerspectiveDefinition, PerspectiveId } from "@/lib/perspectives/types"

export const PERSPECTIVE_SCENARIO_SET_VERSION = 1

const securityShockWeights = {
  securityCompetition: 1.2,
  institutions: 1,
  restraint: 1,
} as const

const publicAuthorityWeights = {
  domesticFilters: 1,
  normsIdentity: 1.1,
  orderJustice: 1,
} as const

const economicExposureWeights = {
  institutions: 0.8,
  politicalEconomy: 1.2,
  restraint: 0.8,
} as const

export const perspectiveCatalog: readonly PerspectiveDefinition[] = [
  {
    id: "incumbent-great-power",
    label: "Incumbent great power",
    shortLabel: "Incumbent power",
    description:
      "Advise a state with global commitments, established advantages, and allies who watch how it uses power.",
    scenarioSetVersion: PERSPECTIVE_SCENARIO_SET_VERSION,
    scenarios: [
      {
        id: "incumbent-regional-probe",
        mirrorPairId: "abrupt-security-shock",
        actor: "The cabinet of an incumbent great power",
        objective: "Preserve allied confidence during a fast-moving regional crisis.",
        constraint: "Forward forces are finite, and commitments span several theaters.",
        uncertainty: "The challenger’s next move and allied staying power remain unclear.",
        task: "Choose the first recommendation for the next seventy-two hours.",
        dimensionWeights: securityShockWeights,
        options: [
          {
            id: "limited-reinforcement",
            title: "Visible readiness",
            response: "Move a limited reinforcement and publish a clear defensive trigger.",
            signals: { securityCompetition: 1.5, institutions: 0.3, restraint: -0.9 },
          },
          {
            id: "coalition-protocol",
            title: "Coalition procedure",
            response: "Convene allies, agree on thresholds, and issue a joint response plan.",
            signals: { securityCompetition: 0.4, institutions: 1.4, restraint: 0.4 },
          },
          {
            id: "reciprocal-channel",
            title: "Reciprocal risk channel",
            response: "Offer a mutual pause tied to verification and a direct crisis channel.",
            signals: { securityCompetition: -0.7, institutions: 0.4, restraint: 1.5 },
          },
        ],
      },
      {
        id: "incumbent-emergency-authority",
        mirrorPairId: "public-authority-under-pressure",
        actor: "The executive and legislature of an incumbent great power",
        objective: "Sustain legitimate authority for a costly external commitment.",
        constraint: "Legislative support is narrow, and the public expects a defined endpoint.",
        uncertainty: "The partner’s future conduct could weaken support for the mission.",
        task: "Choose the authorization process that should govern the commitment.",
        dimensionWeights: publicAuthorityWeights,
        options: [
          {
            id: "time-limited-executive-order",
            title: "Time-limited executive authority",
            response: "Authorize immediate action with an early legislative renewal date.",
            signals: { domesticFilters: -0.5, normsIdentity: -0.1, orderJustice: 1.2 },
          },
          {
            id: "cross-party-mandate",
            title: "Cross-party mandate",
            response: "Build a legislative coalition around goals, costs, and review points.",
            signals: { domesticFilters: 1.4, normsIdentity: 0.5, orderJustice: 0.3 },
          },
          {
            id: "public-conditions",
            title: "Public conditions",
            response: "Tie support to published civilian-protection and accountability conditions.",
            signals: { domesticFilters: 0.5, normsIdentity: 1.4, orderJustice: -0.5 },
          },
        ],
      },
      {
        id: "incumbent-critical-supply",
        mirrorPairId: "strategic-economic-exposure",
        actor: "The economic security council of an incumbent great power",
        objective: "Reduce exposure in a critical industrial supply chain.",
        constraint: "Allies and domestic firms carry different adjustment costs.",
        uncertainty: "The supplier may retaliate across finance, trade, or security ties.",
        task: "Choose the organizing logic for the resilience package.",
        dimensionWeights: economicExposureWeights,
        options: [
          {
            id: "domestic-capacity",
            title: "Domestic capacity",
            response: "Fund national production and accept a period of higher costs.",
            signals: { institutions: -0.5, politicalEconomy: 1.1, restraint: -0.2 },
          },
          {
            id: "allied-standards",
            title: "Allied standards",
            response: "Pool procurement and enforce common supply-chain standards.",
            signals: { institutions: 1.4, politicalEconomy: 0.8, restraint: 0.5 },
          },
          {
            id: "portfolio-diversification",
            title: "Portfolio diversification",
            response: "Spread contracts across suppliers and preserve limited commercial ties.",
            signals: { institutions: 0.1, politicalEconomy: 1.4, restraint: 1.2 },
          },
        ],
      },
    ],
  },
  {
    id: "rising-peer-competitor",
    label: "Rising peer competitor",
    shortLabel: "Rising competitor",
    description:
      "Advise a state seeking greater influence while facing containment risks and an established coalition.",
    scenarioSetVersion: PERSPECTIVE_SCENARIO_SET_VERSION,
    scenarios: [
      {
        id: "rising-power-encirclement-risk",
        mirrorPairId: "abrupt-security-shock",
        actor: "The security council of a rising peer competitor",
        objective: "Prevent a nearby military arrangement from hardening into containment.",
        constraint: "A forceful response could strengthen the opposing coalition.",
        uncertainty: "The new arrangement may be temporary, defensive, or a durable realignment.",
        task: "Choose the first recommendation for the next seventy-two hours.",
        dimensionWeights: securityShockWeights,
        options: [
          {
            id: "measured-readiness",
            title: "Measured readiness",
            response: "Raise readiness near the affected area and publish bounded objectives.",
            signals: { securityCompetition: 1.4, institutions: 0.1, restraint: -0.7 },
          },
          {
            id: "regional-consultation",
            title: "Regional consultation",
            response: "Call for an urgent regional meeting with a monitored standstill period.",
            signals: { securityCompetition: 0.3, institutions: 1.5, restraint: 0.5 },
          },
          {
            id: "assurance-package",
            title: "Assurance package",
            response: "Offer reciprocal deployment limits and direct military communication.",
            signals: { securityCompetition: -0.8, institutions: 0.5, restraint: 1.5 },
          },
        ],
      },
      {
        id: "rising-power-national-mandate",
        mirrorPairId: "public-authority-under-pressure",
        actor: "The leadership council of a rising peer competitor",
        objective: "Maintain support for a prolonged contest over regional influence.",
        constraint: "Economic costs are rising across provinces and social groups.",
        uncertainty: "Public patience and elite cohesion could change as costs accumulate.",
        task: "Choose the process for setting the next phase of policy.",
        dimensionWeights: publicAuthorityWeights,
        options: [
          {
            id: "central-directive",
            title: "Central directive",
            response: "Set a fixed national plan with scheduled internal review.",
            signals: { domesticFilters: -0.7, normsIdentity: 0.2, orderJustice: 1.2 },
          },
          {
            id: "provincial-bargain",
            title: "Provincial bargain",
            response: "Negotiate burden sharing with provincial and industrial leaders.",
            signals: { domesticFilters: 1.5, normsIdentity: 0.3, orderJustice: 0.4 },
          },
          {
            id: "regional-legitimacy-case",
            title: "Regional legitimacy case",
            response: "Publish principles and invite neighboring states to evaluate compliance.",
            signals: { domesticFilters: 0.3, normsIdentity: 1.5, orderJustice: -0.4 },
          },
        ],
      },
      {
        id: "rising-power-technology-access",
        mirrorPairId: "strategic-economic-exposure",
        actor: "The development commission of a rising peer competitor",
        objective: "Maintain access to advanced technology under tightening controls.",
        constraint: "Domestic substitution is expensive and foreign suppliers face pressure.",
        uncertainty: "Control regimes may widen or fragment among participating states.",
        task: "Choose the main resilience strategy.",
        dimensionWeights: economicExposureWeights,
        options: [
          {
            id: "national-substitution",
            title: "National substitution",
            response: "Concentrate public finance on domestic production and research capacity.",
            signals: { institutions: -0.6, politicalEconomy: 1.5, restraint: -0.3 },
          },
          {
            id: "trade-law-challenge",
            title: "Rules challenge",
            response: "Build a legal coalition around predictable access and licensing rules.",
            signals: { institutions: 1.5, politicalEconomy: 0.8, restraint: 0.5 },
          },
          {
            id: "supplier-network",
            title: "Supplier network",
            response: "Diversify suppliers and narrow the sectors treated as strategic.",
            signals: { institutions: 0.2, politicalEconomy: 1.3, restraint: 1.2 },
          },
        ],
      },
    ],
  },
  {
    id: "exposed-ally",
    label: "Exposed ally or vulnerable small state",
    shortLabel: "Exposed ally",
    description:
      "Advise a state whose survival depends on credible partners, rapid warning, and room for independent judgment.",
    scenarioSetVersion: PERSPECTIVE_SCENARIO_SET_VERSION,
    scenarios: [
      {
        id: "exposed-ally-border-probe",
        mirrorPairId: "abrupt-security-shock",
        actor: "The national security council of an exposed ally",
        objective: "Deter a larger neighbor while keeping allied support credible.",
        constraint: "National forces can delay an attack but cannot sustain a long campaign alone.",
        uncertainty: "Allied reinforcement timing and the neighbor’s immediate intent remain unclear.",
        task: "Choose the first recommendation for the next seventy-two hours.",
        dimensionWeights: securityShockWeights,
        options: [
          {
            id: "mobilize-and-signal",
            title: "Mobilize and signal",
            response: "Mobilize selected units and request visible allied deployments.",
            signals: { securityCompetition: 1.6, institutions: 0.5, restraint: -0.8 },
          },
          {
            id: "alliance-consultation",
            title: "Alliance consultation",
            response: "Trigger formal consultations and agree on public response thresholds.",
            signals: { securityCompetition: 0.5, institutions: 1.6, restraint: 0.3 },
          },
          {
            id: "verified-freeze",
            title: "Verified freeze",
            response: "Propose reciprocal force limits backed by allied monitoring.",
            signals: { securityCompetition: -0.6, institutions: 0.7, restraint: 1.5 },
          },
        ],
      },
      {
        id: "exposed-ally-emergency-consent",
        mirrorPairId: "public-authority-under-pressure",
        actor: "The government and opposition of an exposed ally",
        objective: "Maintain public authority during an extended security emergency.",
        constraint: "Emergency measures affect civil life and opposition participation.",
        uncertainty: "The duration of the threat and allied support remain uncertain.",
        task: "Choose the framework for renewing emergency powers.",
        dimensionWeights: publicAuthorityWeights,
        options: [
          {
            id: "short-renewals",
            title: "Short renewals",
            response: "Use short executive renewals with judicial review.",
            signals: { domesticFilters: 0.1, normsIdentity: -0.2, orderJustice: 1.2 },
          },
          {
            id: "unity-committee",
            title: "Unity committee",
            response: "Give a cross-party committee access to plans, costs, and intelligence.",
            signals: { domesticFilters: 1.5, normsIdentity: 0.6, orderJustice: 0.4 },
          },
          {
            id: "rights-benchmarks",
            title: "Rights benchmarks",
            response: "Set public rights protections and automatic review dates.",
            signals: { domesticFilters: 0.5, normsIdentity: 1.5, orderJustice: -0.5 },
          },
        ],
      },
      {
        id: "exposed-ally-energy-dependence",
        mirrorPairId: "strategic-economic-exposure",
        actor: "The economic cabinet of an exposed ally",
        objective: "Reduce reliance on a coercive energy supplier.",
        constraint: "Households face immediate price pressure and replacement infrastructure takes time.",
        uncertainty: "External finance and alternative supplies may arrive slowly.",
        task: "Choose the core of the transition plan.",
        dimensionWeights: economicExposureWeights,
        options: [
          {
            id: "national-reserve",
            title: "National reserve",
            response: "Build public reserves and subsidize domestic replacement capacity.",
            signals: { institutions: -0.3, politicalEconomy: 1.4, restraint: -0.2 },
          },
          {
            id: "allied-purchasing",
            title: "Allied purchasing",
            response: "Join pooled purchasing with financing and common storage rules.",
            signals: { institutions: 1.5, politicalEconomy: 0.9, restraint: 0.4 },
          },
          {
            id: "staged-diversification",
            title: "Staged diversification",
            response: "Add several suppliers while reducing exposure on a published schedule.",
            signals: { institutions: 0.2, politicalEconomy: 1.5, restraint: 1.2 },
          },
        ],
      },
    ],
  },
  {
    id: "middle-power-hedger",
    label: "Middle power or nonaligned hedger",
    shortLabel: "Middle-power hedger",
    description:
      "Advise a state protecting policy autonomy while major powers compete for access and alignment.",
    scenarioSetVersion: PERSPECTIVE_SCENARIO_SET_VERSION,
    scenarios: [
      {
        id: "hedger-access-demand",
        mirrorPairId: "abrupt-security-shock",
        actor: "The cabinet of a nonaligned middle power",
        objective: "Protect maritime access while preserving working ties with two rival powers.",
        constraint: "Defense capacity is limited, and both powers offer valuable cooperation.",
        uncertainty: "A recent naval incident may be isolated or part of a wider campaign.",
        task: "Choose the first recommendation for the next seventy-two hours.",
        dimensionWeights: securityShockWeights,
        options: [
          {
            id: "bounded-patrol",
            title: "Bounded patrol",
            response: "Escort national shipping and publish the patrol’s geographic limits.",
            signals: { securityCompetition: 1.3, institutions: 0.1, restraint: -0.3 },
          },
          {
            id: "regional-monitoring",
            title: "Regional monitoring",
            response: "Organize a regional monitoring mission with shared incident reporting.",
            signals: { securityCompetition: 0.2, institutions: 1.6, restraint: 0.7 },
          },
          {
            id: "dual-de-escalation",
            title: "Dual de-escalation",
            response: "Seek matching restraint pledges from both powers and maintain open ports.",
            signals: { securityCompetition: -0.8, institutions: 0.4, restraint: 1.6 },
          },
        ],
      },
      {
        id: "hedger-alignment-debate",
        mirrorPairId: "public-authority-under-pressure",
        actor: "The coalition government of a nonaligned middle power",
        objective: "Set a durable policy toward rival security partnerships.",
        constraint: "Coalition parties and major economic sectors favor different partners.",
        uncertainty: "The next election may shift the governing coalition.",
        task: "Choose the process for setting partnership limits.",
        dimensionWeights: publicAuthorityWeights,
        options: [
          {
            id: "cabinet-framework",
            title: "Cabinet framework",
            response: "Adopt a renewable cabinet directive covering access, exercises, and basing.",
            signals: { domesticFilters: -0.4, normsIdentity: -0.1, orderJustice: 1.1 },
          },
          {
            id: "parliamentary-compact",
            title: "Parliamentary compact",
            response: "Negotiate a cross-party compact with regular public review.",
            signals: { domesticFilters: 1.6, normsIdentity: 0.5, orderJustice: 0.4 },
          },
          {
            id: "regional-principles",
            title: "Regional principles",
            response: "Anchor policy in published regional principles on access and sovereignty.",
            signals: { domesticFilters: 0.4, normsIdentity: 1.5, orderJustice: -0.3 },
          },
        ],
      },
      {
        id: "hedger-infrastructure-bid",
        mirrorPairId: "strategic-economic-exposure",
        actor: "The infrastructure ministry of a nonaligned middle power",
        objective: "Finance a strategic port while preserving control over future access.",
        constraint: "Domestic capital is scarce, and each foreign offer carries conditions.",
        uncertainty: "Future trade flows and refinancing terms are difficult to forecast.",
        task: "Choose the financing structure.",
        dimensionWeights: economicExposureWeights,
        options: [
          {
            id: "public-finance",
            title: "Public finance",
            response: "Scale the project to domestic finance and retain full public control.",
            signals: { institutions: -0.4, politicalEconomy: 1.5, restraint: 0.1 },
          },
          {
            id: "multilateral-tender",
            title: "Multilateral tender",
            response: "Use a multilateral tender with common disclosure and debt rules.",
            signals: { institutions: 1.6, politicalEconomy: 1, restraint: 0.5 },
          },
          {
            id: "split-contracts",
            title: "Split contracts",
            response: "Divide construction, finance, and operations among separate partners.",
            signals: { institutions: 0.2, politicalEconomy: 1.5, restraint: 1.4 },
          },
        ],
      },
    ],
  },
  {
    id: "capacity-constrained-state",
    label: "Developmental or capacity-constrained state",
    shortLabel: "Capacity-constrained state",
    description:
      "Advise a state balancing urgent development needs, limited administrative capacity, and unequal external leverage.",
    scenarioSetVersion: PERSPECTIVE_SCENARIO_SET_VERSION,
    scenarios: [
      {
        id: "capacity-state-border-spillover",
        mirrorPairId: "abrupt-security-shock",
        actor: "The cabinet of a capacity-constrained state",
        objective: "Contain armed spillover while keeping trade and humanitarian routes open.",
        constraint: "Border forces, logistics, and public funds are thinly stretched.",
        uncertainty: "Armed groups and neighboring forces have overlapping areas of operation.",
        task: "Choose the first recommendation for the next seventy-two hours.",
        dimensionWeights: securityShockWeights,
        options: [
          {
            id: "protective-deployment",
            title: "Protective deployment",
            response: "Concentrate forces at transport hubs and designated crossing points.",
            signals: { securityCompetition: 1.3, institutions: 0, restraint: -0.2 },
          },
          {
            id: "regional-mission",
            title: "Regional mission",
            response: "Request a regional monitoring and logistics mission.",
            signals: { securityCompetition: 0.3, institutions: 1.6, restraint: 0.6 },
          },
          {
            id: "local-ceasefire-access",
            title: "Local access compact",
            response: "Broker local standstill zones around trade and aid corridors.",
            signals: { securityCompetition: -0.7, institutions: 0.4, restraint: 1.6 },
          },
        ],
      },
      {
        id: "capacity-state-reform-mandate",
        mirrorPairId: "public-authority-under-pressure",
        actor: "The reform cabinet of a capacity-constrained state",
        objective: "Build authority for a demanding fiscal and administrative reform plan.",
        constraint: "Public services are fragile, and benefits will arrive unevenly.",
        uncertainty: "External financing and domestic coalition support may shift.",
        task: "Choose the process for setting reform priorities.",
        dimensionWeights: publicAuthorityWeights,
        options: [
          {
            id: "emergency-program",
            title: "Emergency program",
            response: "Authorize a short executive program with published delivery targets.",
            signals: { domesticFilters: -0.5, normsIdentity: -0.1, orderJustice: 1.2 },
          },
          {
            id: "local-bargain",
            title: "Local bargain",
            response: "Negotiate priorities with local governments, unions, and producers.",
            signals: { domesticFilters: 1.6, normsIdentity: 0.4, orderJustice: 0.3 },
          },
          {
            id: "equity-commitments",
            title: "Equity commitments",
            response: "Publish distribution goals and independent access audits.",
            signals: { domesticFilters: 0.5, normsIdentity: 1.4, orderJustice: -0.6 },
          },
        ],
      },
      {
        id: "capacity-state-digital-network",
        mirrorPairId: "strategic-economic-exposure",
        actor: "The digital infrastructure authority of a capacity-constrained state",
        objective: "Expand national connectivity with affordable long-term maintenance.",
        constraint: "Technical staff and fiscal space are limited.",
        uncertainty: "Vendor dependence and future upgrade costs are hard to price.",
        task: "Choose the procurement model.",
        dimensionWeights: economicExposureWeights,
        options: [
          {
            id: "public-core-network",
            title: "Public core network",
            response: "Build a smaller public network around essential services and local training.",
            signals: { institutions: -0.4, politicalEconomy: 1.6, restraint: 0.1 },
          },
          {
            id: "development-bank-framework",
            title: "Development-bank framework",
            response: "Use pooled procurement with open standards and external audits.",
            signals: { institutions: 1.6, politicalEconomy: 1, restraint: 0.6 },
          },
          {
            id: "modular-vendors",
            title: "Modular vendors",
            response: "Split the network into interoperable contracts across several vendors.",
            signals: { institutions: 0.3, politicalEconomy: 1.5, restraint: 1.3 },
          },
        ],
      },
    ],
  },
  {
    id: "protection-authority",
    label: "International institution or protection authority",
    shortLabel: "Protection authority",
    description:
      "Advise an institution charged with preserving access, legitimacy, and protection across competing state interests.",
    scenarioSetVersion: PERSPECTIVE_SCENARIO_SET_VERSION,
    scenarios: [
      {
        id: "authority-protection-corridor",
        mirrorPairId: "abrupt-security-shock",
        actor: "The crisis group of an international protection authority",
        objective: "Keep a civilian corridor open during a sudden military escalation.",
        constraint: "The authority relies on state consent and limited monitoring capacity.",
        uncertainty: "Each belligerent disputes responsibility for recent attacks.",
        task: "Choose the first recommendation for the next seventy-two hours.",
        dimensionWeights: securityShockWeights,
        options: [
          {
            id: "protected-presence",
            title: "Protected presence",
            response: "Deploy available monitors with a clearly defined protective escort.",
            signals: { securityCompetition: 1.1, institutions: 0.8, restraint: -0.2 },
          },
          {
            id: "joint-verification",
            title: "Joint verification",
            response: "Create a joint incident cell and publish verified access reports.",
            signals: { securityCompetition: 0.1, institutions: 1.7, restraint: 0.7 },
          },
          {
            id: "staged-access-pause",
            title: "Staged access pause",
            response: "Negotiate timed movement windows with reciprocal standstill zones.",
            signals: { securityCompetition: -0.8, institutions: 0.5, restraint: 1.6 },
          },
        ],
      },
      {
        id: "authority-contested-mandate",
        mirrorPairId: "public-authority-under-pressure",
        actor: "The governing council of an international protection authority",
        objective: "Renew a field mandate amid disputes over consent and civilian harm.",
        constraint: "Member states disagree on enforcement and funding.",
        uncertainty: "Local consent and operational access may change quickly.",
        task: "Choose the basis for renewing the mandate.",
        dimensionWeights: publicAuthorityWeights,
        options: [
          {
            id: "bounded-renewal",
            title: "Bounded renewal",
            response: "Renew core operations for a short term under existing authority.",
            signals: { domesticFilters: -0.3, normsIdentity: -0.1, orderJustice: 1.3 },
          },
          {
            id: "member-state-compact",
            title: "Member-state compact",
            response: "Negotiate funding, access, and oversight commitments among member states.",
            signals: { domesticFilters: 1.3, normsIdentity: 0.5, orderJustice: 0.5 },
          },
          {
            id: "protection-benchmarks",
            title: "Protection benchmarks",
            response: "Tie renewal to public access and civilian-protection benchmarks.",
            signals: { domesticFilters: 0.4, normsIdentity: 1.6, orderJustice: -0.7 },
          },
        ],
      },
      {
        id: "authority-aid-supply",
        mirrorPairId: "strategic-economic-exposure",
        actor: "The procurement office of an international protection authority",
        objective: "Secure essential aid supplies across several unstable regions.",
        constraint: "Funding is volatile, and a few vendors control key logistics routes.",
        uncertainty: "Transport access and donor commitments may change during the contract.",
        task: "Choose the procurement structure.",
        dimensionWeights: economicExposureWeights,
        options: [
          {
            id: "authority-owned-reserve",
            title: "Authority-owned reserve",
            response: "Build a central reserve for the most critical supplies.",
            signals: { institutions: -0.2, politicalEconomy: 1.4, restraint: -0.1 },
          },
          {
            id: "shared-procurement-rules",
            title: "Shared procurement rules",
            response: "Pool orders with partner agencies under common disclosure rules.",
            signals: { institutions: 1.7, politicalEconomy: 0.9, restraint: 0.5 },
          },
          {
            id: "regional-supplier-pool",
            title: "Regional supplier pool",
            response: "Maintain qualified suppliers in several regions with modular contracts.",
            signals: { institutions: 0.3, politicalEconomy: 1.5, restraint: 1.3 },
          },
        ],
      },
    ],
  },
] as const

const perspectiveById = new Map(
  perspectiveCatalog.map((perspective) => [perspective.id, perspective]),
)

export const perspectives = perspectiveCatalog

export function isPerspectiveId(value: unknown): value is PerspectiveId {
  return typeof value === "string" && perspectiveById.has(value as PerspectiveId)
}

export function getPerspectiveDefinition(id: string): PerspectiveDefinition | null {
  return perspectiveById.get(id as PerspectiveId) ?? null
}

export const getPerspectivePack = getPerspectiveDefinition
