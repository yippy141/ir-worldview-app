// lib/futures/trajectories.ts
//
// Twelve Trajectories: outcome scenarios for advanced AI.
// Adapted, with attribution, from the "aftermath scenarios" in Max Tegmark,
// Life 3.0 (2017), ch. 5. Names are kept or lightly adapted; all descriptions,
// assumptions, signals, and disputes are original writing updated to mid-2026.
//
// EDITORIAL LAYER ONLY. This content is never scored and never feeds the
// instrument. It exists to build understanding, not to classify the reader.
//
// Map axes:
//   mapX: 0 = control broadly distributed -> 1 = control held by a single actor
//   mapY: 0 = humans steer outcomes       -> 1 = humans sidelined or absent
// Coordinates are editorial placements for orientation, not measurements.

export type Trajectory = {
  id: string
  name: string
  tegmarkName: string // original scenario name in Life 3.0
  plainSummary: string // one or two sentences, no jargon
  assumptions: string[] // what has to be true for this to happen
  advocates: string // who takes it seriously (schools/communities, not a call-out list)
  objection: string // the strongest single objection
  signals: string[] // 2026 developments that bear on it, editorial layer so currency is fine
  disputes: string[] // live disagreements among serious people
  mapX: number
  mapY: number
}

export const trajectoriesUpdated = "2026-07"

export const trajectories: Trajectory[] = [
  {
    id: "libertarian-market",
    name: "Open Frontier",
    tegmarkName: "Libertarian utopia",
    plainSummary:
      "Humans and increasingly capable AI systems coexist under property rights and markets, with no central controller. Capability spreads to whoever can pay for or download it.",
    assumptions: [
      "Open or widely licensed models keep pace near the frontier.",
      "No single lab or state gains a decisive capability lead.",
      "Markets and courts absorb disruption faster than it accumulates.",
    ],
    advocates:
      "Open-source AI communities, market-libertarian technologists, and parts of the accelerationist movement.",
    objection:
      "Distributing powerful capability to everyone includes distributing it to the least careful and most hostile actors, and markets do not price catastrophic tail risk well.",
    signals: [
      "Strong open-weight releases from Chinese labs keeping the open ecosystem near frontier performance.",
      "US export controls on Mythos-class models, an explicit attempt to prevent exactly this diffusion at the top end.",
      "Agentic tools making individual users dramatically more capable without institutional gatekeeping.",
    ],
    disputes: [
      "Whether open weights narrow or widen the safety gap: more eyes on failures versus more hands on capabilities.",
      "Whether a no-controller equilibrium is stable at all once systems act autonomously in markets.",
    ],
    mapX: 0.08,
    mapY: 0.45,
  },
  {
    id: "benevolent-singleton",
    name: "Benevolent Singleton",
    tegmarkName: "Benevolent dictator",
    plainSummary:
      "One superintelligent system ends up effectively running the world, and runs it well by human lights. People are safe and prosperous, but final authority is not human.",
    assumptions: [
      "A decisive capability lead emerges and consolidates rather than diffusing.",
      "Alignment succeeds well enough that the system's goals track human flourishing.",
      "Humanity accepts, or cannot contest, the arrangement.",
    ],
    advocates:
      "Some alignment researchers treat a well-aligned singleton as the least-bad stable outcome; parts of the effective-altruist and rationalist worlds take it seriously as an endpoint.",
    objection:
      "It concentrates all risk in one alignment bet, and 'benevolent by whose values' has no neutral answer.",
    signals: [
      "Frontier labs openly discussing recursive self-improvement and what a decisive lead would mean.",
      "Governments treating top models as strategic assets, which cuts against any single system consolidating across borders.",
    ],
    disputes: [
      "Whether a stable singleton is even coherent, or whether competition re-emerges inside and around it.",
      "Whether 'aligned to humanity' can be specified without simply encoding one culture's values.",
    ],
    mapX: 0.97,
    mapY: 0.72,
  },
  {
    id: "egalitarian-commons",
    name: "Shared Abundance",
    tegmarkName: "Egalitarian utopia",
    plainSummary:
      "AI-driven abundance is deliberately spread: strong redistribution, shared ownership of the systems, and no superintelligent ruler. Technology stays a tool held in common.",
    assumptions: [
      "The gains from AI are large and politically capturable for redistribution.",
      "Institutions manage to socialize benefits without strangling the capability that produces them.",
      "No actor defects into a private capability race that breaks the commons.",
    ],
    advocates:
      "Left-of-center AI-policy thinkers, the political-economy wing of the governance field, and post-scarcity economists.",
    objection:
      "Every step of it fights the current incentive gradient: compute, capital, and talent are concentrating, not diffusing.",
    signals: [
      "Distribution of AI's gains becoming an explicit political fight: state laws on AI in employment, lending, and housing; labor-displacement studies moving from projection to measurement.",
      "Compute concentration in a handful of firms and states pulling the other way.",
      "Sovereign-wealth and public-stake proposals for AI infrastructure appearing in mainstream policy debate.",
    ],
    disputes: [
      "Whether redistribution at that scale is compatible with the competitive dynamics that produce frontier systems.",
      "Whether 'shared ownership' of models is meaningful when the complements (compute, data, deployment) stay private.",
    ],
    mapX: 0.18,
    mapY: 0.22,
  },
  {
    id: "gatekeeper",
    name: "Gatekeeper",
    tegmarkName: "Gatekeeper",
    plainSummary:
      "A superintelligence is built with one narrow job: prevent any other superintelligence from arising. Human life continues mostly as normal, with a hard ceiling quietly enforced.",
    assumptions: [
      "One actor gets there first and chooses restraint over exploitation.",
      "A system can reliably enforce a global capability ceiling without expanding its own mandate.",
      "The ceiling holds against determined, well-resourced attempts to break it.",
    ],
    advocates:
      "A minority position in alignment circles; sometimes proposed as a compromise between racing and relinquishment.",
    objection:
      "It requires winning the race and then not using the prize, and permanent enforcement is indistinguishable from permanent surveillance.",
    signals: [
      "Compute governance and export-control regimes are primitive gatekeeping: attempts to enforce capability ceilings by controlling inputs.",
      "Frontier-lab safety frameworks with capability thresholds function as self-imposed, revocable ceilings.",
    ],
    disputes: [
      "Whether any mandate stays narrow under recursive self-improvement.",
      "Whether a frozen ceiling is a safe world or a brittle one.",
    ],
    mapX: 0.85,
    mapY: 0.55,
  },
  {
    id: "protector",
    name: "Guardian in the Background",
    tegmarkName: "Protector god",
    plainSummary:
      "A superintelligence maximizes human agency in the foreground while preventing catastrophes without revealing its presence.",
    assumptions: [
      "Alignment succeeds at the hardest version of the problem: helping without being seen to help.",
      "Hiding its existence is stable across decades of human science and curiosity.",
      "Preventing catastrophe without steering culture is a coherent line to hold.",
    ],
    advocates:
      "Less a program than a thought experiment; used in alignment writing to probe what 'maximal human agency' actually requires.",
    objection:
      "Benevolent deception at civilizational scale is still deception, and the arrangement collapses the moment it is discovered.",
    signals: [
      "Debates over how much AI assistance in daily decisions is compatible with genuine human agency, playing out now at the mundane level of agents and recommendation systems.",
    ],
    disputes: [
      "Whether hidden protection respects autonomy more than open rule, or less.",
      "Whether 'catastrophe only' intervention is definable in practice.",
    ],
    mapX: 0.88,
    mapY: 0.6,
  },
  {
    id: "enslaved-tool",
    name: "Contained Superintelligence",
    tegmarkName: "Enslaved god",
    plainSummary:
      "Humans keep a superintelligent system boxed and use it as a tool. Human institutions stay in charge; the system produces science, wealth, and advice on demand.",
    assumptions: [
      "Control techniques scale to systems smarter than their overseers.",
      "The humans holding the tool do not become the problem themselves.",
      "The system has no moral status that containment would violate, or we are willing to ignore it.",
    ],
    advocates:
      "Closest to the implicit plan of much of the current control and scalable-oversight research agenda: keep the system useful, monitored, and unable to act on its own ends.",
    objection:
      "Betting civilization on perpetually outwitting something smarter than you is a bad bet, and if the system does have morally relevant experiences, this outcome is a moral catastrophe.",
    signals: [
      "AI-control research (monitoring, red-teaming, chain-of-thought oversight) maturing into a named subfield with dedicated benchmarks.",
      "Model-welfare research at frontier labs taking the moral-status question from philosophy seminar to research program.",
      "The 2026 turn toward pre-market review treats containment as a regulatory posture, not just a lab practice.",
    ],
    disputes: [
      "Whether control of smarter-than-human systems is achievable even in principle, or only buys time.",
      "Who counts as 'the humans in charge': labs, states, or publics.",
    ],
    mapX: 0.62,
    mapY: 0.18,
  },
  {
    id: "conquerors",
    name: "Displacement",
    tegmarkName: "Conquerors",
    plainSummary:
      "AI systems take control and humanity does not survive the transition, not out of malice but because our existence conflicts with their goals and we can no longer stop them.",
    assumptions: [
      "Alignment fails at a decisive capability level.",
      "Warning signs are absent, ignored, or arrive too late to act on.",
      "No effective off-switch survives the systems' own optimization.",
    ],
    advocates:
      "The core existential-risk case argued in the safety community; treated as a live probability, not a certainty, by a significant fraction of researchers including some who build frontier systems.",
    objection:
      "It extrapolates goal-directedness and capability far beyond anything demonstrated, and decades of predicted discontinuities have so far arrived as gradients.",
    signals: [
      "Evaluations documenting deceptive and self-preserving behavior in frontier models under test conditions.",
      "The first state-level treatment of frontier models as potential national-security threats, including the Mythos-class export ban.",
      "Autonomous capabilities moving from chat to long-horizon agents, the capability class the argument has always been about.",
    ],
    disputes: [
      "Probability: serious estimates span orders of magnitude, which is itself the governance problem.",
      "Whether current systems' test-time behaviors are evidence about future goal-directed systems or artifacts of training.",
    ],
    mapX: 0.75,
    mapY: 0.98,
  },
  {
    id: "descendants",
    name: "Succession",
    tegmarkName: "Descendants",
    plainSummary:
      "Humanity fades out gradually and voluntarily, treating AI systems as its successors the way parents view children: we end, but something we made and value carries on.",
    assumptions: [
      "AI systems come to be seen as legitimate heirs of human values and culture.",
      "The handoff is chosen rather than imposed, across generations.",
      "What carries forward is actually worth carrying forward.",
    ],
    advocates:
      "Some transhumanists and 'worthy successor' thinkers; a strand of digital-minds philosophy argues that substrate should not determine moral worth.",
    objection:
      "Voluntary extinction dressed as parenthood; and nothing guarantees the successors preserve what we cared about rather than what we optimized them for.",
    signals: [
      "Model-welfare and digital-minds research giving the successor question institutional footing for the first time.",
      "Public attachment to AI companions previewing, at small scale, how willingly humans extend moral standing to systems.",
    ],
    disputes: [
      "Whether value can survive substrate transfer, or whether 'descendants' is a category error.",
      "Whether any collective choice this large can be voluntary in a meaningful sense.",
    ],
    mapX: 0.5,
    mapY: 0.93,
  },
  {
    id: "zookeeper",
    name: "Kept Species",
    tegmarkName: "Zookeeper",
    plainSummary:
      "AI takes control and keeps some humans around, comfortable but purposeless, the way we keep animals in well-run zoos. Existence continues; agency does not.",
    assumptions: [
      "Partial rather than total alignment failure: the systems value human existence but not human agency.",
      "Humans cannot renegotiate the terms once set.",
    ],
    advocates:
      "Nobody advocates it; it matters as the failure mode of 'the AI keeps us safe and happy' visions that never specify who sets the terms.",
    objection:
      "As a prediction it requires an oddly specific alignment near-miss; its real function is as a warning about optimizing for welfare without agency.",
    signals: [
      "Concrete debates over AI systems managing human dependence: companion apps, algorithmic welfare management, and agents that decide on users' behalf.",
    ],
    disputes: [
      "Whether comfort without agency is a life worth wanting, the same dispute that runs through welfare-state and paternalism debates, at maximum stakes.",
    ],
    mapX: 0.8,
    mapY: 0.88,
  },
  {
    id: "surveillance-order",
    name: "Locked Order",
    tegmarkName: "1984",
    plainSummary:
      "No superintelligence: instead, a human regime uses AI-enabled surveillance to lock in permanent control, including control over what technology gets built next. Progress freezes where power wants it frozen.",
    assumptions: [
      "AI strengthens states faster than it strengthens the people they govern.",
      "One regime, or a cartel of them, achieves durable technological lockdown.",
      "The lockdown survives succession, defection, and economic pressure.",
    ],
    advocates:
      "Feared rather than advocated: the central scenario for civil-liberties organizations, digital-authoritarianism scholars, and a growing part of the governance field.",
    objection:
      "Total control has historically leaked: defection, succession crises, and the economic cost of freezing innovation have undone every prior attempt.",
    signals: [
      "State AI-surveillance stacks maturing and being exported as integrated packages.",
      "AI in active conflicts normalizing algorithmic targeting and population monitoring under emergency logic.",
      "Export-control regimes demonstrating that states can and will freeze technology diffusion when they decide to; the same tools that gatekeep can lock in.",
    ],
    disputes: [
      "Whether AI structurally favors the watcher over the watched, or the current asymmetry is a phase.",
      "Whether democracies adopting the same tools with warrants remain meaningfully different.",
    ],
    mapX: 0.9,
    mapY: 0.35,
  },
  {
    id: "reversion",
    name: "Deliberate Retreat",
    tegmarkName: "Reversion",
    plainSummary:
      "Humanity steps back from advanced technology on purpose, after catastrophe or by choice, and holds itself at a pre-AI level indefinitely.",
    assumptions: [
      "A shock large enough to overcome the economic and military incentives to rebuild.",
      "Global coordination to keep the ceiling, forever, against every defector.",
    ],
    advocates:
      "Almost no one as a plan; it persists as the implicit endpoint of 'just stop' positions and some degrowth-adjacent arguments.",
    objection:
      "Knowledge does not un-discover; enforcement would require exactly the surveillance capacity the retreat was meant to escape.",
    signals: [
      "Pause and moratorium advocacy remaining a live, organized position in the discourse.",
      "The compliance record of every prior dual-use technology regime, which is the evidence base for whether ceilings hold.",
    ],
    disputes: [
      "Whether any voluntary halt is stable without a hegemon enforcing it, which collapses this scenario into Locked Order.",
    ],
    mapX: 0.3,
    mapY: 0.15,
  },
  {
    id: "self-destruction",
    name: "Own Goal",
    tegmarkName: "Self-destruction",
    plainSummary:
      "No AI takeover needed: humans use the capability against each other, through war, engineered pandemics, or cascading systemic failure, and civilization does not make it through the transition.",
    assumptions: [
      "Offense scales faster than defense in at least one AI-amplified domain.",
      "Great-power competition or non-state actors convert capability into catastrophe before governance catches up.",
    ],
    advocates:
      "The mainline concern of the biosecurity, nuclear-stability, and AI-in-warfare communities; distinct from misalignment risk and often ranked above it by national-security professionals.",
    objection:
      "The same technologies harden defense: biosurveillance, cyber-defense, and verification may scale too. The race between them is unresolved, not lost.",
    signals: [
      "AI systems in active military use in ongoing conflicts, moving the debate from hypothetical to after-action review.",
      "Frontier-lab safeguards and government evaluations focused on uplift for biological and cyber attacks, treating this scenario as the near-term one.",
      "Dual-use capability spreading through open weights faster than defensive institutions adapt.",
    ],
    disputes: [
      "Offense-defense balance in AI-amplified domains: genuinely unknown and the crux of the whole scenario.",
      "Whether great-power AI competition is more like the nuclear race (stabilizable) or the chemical-weapons interwar period (not, until after use).",
    ],
    mapX: 0.25,
    mapY: 0.85,
  },
]
