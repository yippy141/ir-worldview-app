import { AiArchetypeKey } from "./ai-governance-types"

export type AiArchetypeDeepProfile = {
  governingInstinct: string
  policyBundle: string[]
  internationalOrder: string[]
  strongestCritique: string
  evidenceShift: string[]
  questionToSitWith: string
  shareBlurb: string
}

export const aiArchetypeDeepProfiles: Record<AiArchetypeKey, AiArchetypeDeepProfile> = {
  precautionarySteward: {
    governingInstinct:
      "Protect against severe capability surprises before diffusion, institutional drift, or strategic pressure makes meaningful control impossible.",
    policyBundle: [
      "Back stronger external evaluations before broad release when dangerous capability signals appear.",
      "Prefer staged deployment, threshold triggers, and visible incident escalation paths over default rapid rollout.",
      "Support governance that can slow or narrow access when evidence becomes worrying, even if that imposes real commercial or geopolitical costs.",
    ],
    internationalOrder: [
      "Likely to support selective coordination and verification mechanisms if they look credible rather than purely rhetorical.",
      "Likely to resist a pure race frame, but still worry that weak legitimacy can turn safety language into a cover for advantage-seeking.",
      "Often sympathetic to international processes that can justify restraint without simply empowering one state or one lab bloc.",
    ],
    strongestCritique:
      "Your critics will say that precaution can become an incumbent-friendly politics of delay, especially if the institutions doing the slowing are not broadly trusted.",
    evidenceShift: [
      "Robust evidence that controlled real-world deployment reduces risk faster than withholding systems.",
      "Strong evidence that rivals would systematically exploit unilateral restraint without meaningful verification.",
      "Repeated cases where precautionary institutions fail to act competently enough to justify the delays they impose.",
    ],
    questionToSitWith:
      "How do you slow or narrow diffusion without simply hardening concentration and calling it safety?",
    shareBlurb:
      "You would rather absorb real costs now than discover too late that capability outran control.",
  },
  strategicCompetitor: {
    governingInstinct:
      "Treat frontier AI as a strategic technology whose governance has to survive rivalry, not wish rivalry away.",
    policyBundle: [
      "Prioritize institutions that preserve national or alliance-level capability without ignoring safety.",
      "Back safeguards that are enforceable under competition rather than relying on universal trust.",
      "Accept bounded military and intelligence use if refusal would create serious strategic vulnerability.",
    ],
    internationalOrder: [
      "Likely to view coordination through the lens of reciprocity, verification, and durable competitive asymmetry.",
      "More willing to support club-based or alliance-based governance than universal processes that cannot be enforced.",
      "Often sympathetic to strategic chokepoints, export controls, and state-backed capability shaping when the stakes rise.",
    ],
    strongestCritique:
      "Your critics will say that a competition-first worldview can smuggle escalation into governance and gradually normalize risk in the name of realism.",
    evidenceShift: [
      "Credible proof that broad-based coordination can actually constrain rivals rather than merely slowing the compliant.",
      "Repeated evidence that military and strategic integration reliably erodes safety boundaries faster than it protects them.",
      "Evidence that advantage-preserving controls mainly entrench incumbents without producing better security outcomes.",
    ],
    questionToSitWith:
      "What kinds of restraint are still possible once every safety move is interpreted as a move in a race?",
    shareBlurb:
      "You think the hard part of AI governance is making safety survive competition rather than pretending competition will disappear.",
  },
  coordinationArchitect: {
    governingInstinct:
      "Build rules that can outlast temporary advantage because frontier AI risks are too transnational for one state or one lab to govern alone.",
    policyBundle: [
      "Support verification, shared standards, and institutional arrangements that make restraint legible across borders.",
      "Prefer governance designs that do not depend entirely on the benevolence of frontier developers.",
      "Accept slower deployment if that buys broader legitimacy and stronger coordination capacity.",
    ],
    internationalOrder: [
      "Likely to favor multilateral or plurilateral mechanisms that can still include broader legitimacy over time.",
      "Often sympathetic to independent verification because coordination without trust is fragile and trust without verification is naive.",
      "More likely than most profiles to worry that a pure sovereignty frame leaves everyone less safe in the long run.",
    ],
    strongestCritique:
      "Your critics will say that coordination can become a beautiful theory with weak enforcement, or worse, a legitimating layer over unequal power.",
    evidenceShift: [
      "Strong evidence that coordination efforts repeatedly fail when they collide with hard security incentives.",
      "Evidence that narrower club governance outperforms broader institutions on both safety and legitimacy.",
      "Evidence that slower, more legitimate processes simply cannot keep up with capability tempo.",
    ],
    questionToSitWith:
      "Who actually has authority when public legitimacy, technical competence, and national sovereignty point in different directions?",
    shareBlurb:
      "You think frontier AI becomes governable only when the rules can travel beyond any one lab or country.",
  },
  democraticGuardrailist: {
    governingInstinct:
      "Keep frontier AI answerable to public authority so governance is not quietly privatized by the actors building the systems.",
    policyBundle: [
      "Support mandatory external oversight, reporting duties, and visible accountability structures.",
      "Prefer rules that remain legible to democratic and civic institutions rather than only technical insiders.",
      "Back stronger guardrails on deployment if the alternative is rule-setting by frontier labs alone.",
    ],
    internationalOrder: [
      "Likely to favor public legitimacy and institutional accountability over fast technocratic coordination.",
      "Often attentive to whether governance is answerable to citizens, not only to states or labs.",
      "More likely to worry that governance built without civic legitimacy will fail politically even if it looks technically elegant.",
    ],
    strongestCritique:
      "Your critics will say that democratic legitimacy is essential but often too slow, too fragmented, or too technically thin to supervise frontier systems well in real time.",
    evidenceShift: [
      "Strong evidence that public institutions cannot build or hire enough expertise to supervise credibly.",
      "Evidence that certain technocratic or lab-led mechanisms outperform public processes without becoming self-serving.",
      "Repeated cases where formal accountability structures exist on paper but fail to shape actual deployment behavior.",
    ],
    questionToSitWith:
      "How do you make governance publicly answerable without making it performative, symbolic, or too slow to matter?",
    shareBlurb:
      "You want frontier AI governed by institutions that can be questioned, contested, and held answerable in public.",
  },
  stateCapacityBuilder: {
    governingInstinct:
      "The central governance question is who can actually supervise, procure, verify, and absorb advanced AI without becoming structurally dependent.",
    policyBundle: [
      "Focus on administrative capacity, technical talent, procurement competence, and enforcement capability.",
      "Support governance that reduces dangerous dependence on a tiny number of firms or foreign providers.",
      "Prefer practical supervisory machinery over abstract principle that no institution can implement.",
    ],
    internationalOrder: [
      "Likely to ask what middle powers, developing states, and public institutions can realistically do, not just what ideal theory recommends.",
      "Often more attentive than other profiles to sovereignty, implementation bottlenecks, and state dependence on frontier vendors.",
      "May favor diversified supply, procurement leverage, and domestic supervisory competence before grander institutional visions.",
    ],
    strongestCritique:
      "Your critics will say that capacity-building can slide into managerialism, missing deeper legitimacy problems or wider civilizational stakes.",
    evidenceShift: [
      "Evidence that lighter-touch governance consistently outperforms heavier administrative structures.",
      "Evidence that international coordination solves dependence problems better than domestic capacity-building does.",
      "Evidence that state intervention without clear legitimacy mainly concentrates power without improving competence.",
    ],
    questionToSitWith:
      "What does good governance look like for states that are neither frontier leaders nor able simply to opt out?",
    shareBlurb:
      "You think the real divide is between actors that can govern AI in practice and those that become dependent on those who can.",
  },
  openEcosystemBuilder: {
    governingInstinct:
      "Prevent frontier governance from hardening into a closed political economy where safety language mainly protects incumbents and restricts social value.",
    policyBundle: [
      "Defend wider access, diffusion, and iterative learning unless misuse evidence becomes specific and strong.",
      "Worry that concentrated control will narrow innovation, entrench dominant labs, and make dependence harder to escape.",
      "Prefer lighter, more targeted restrictions over broad capability bottlenecks that default toward closure.",
    ],
    internationalOrder: [
      "Likely to be skeptical of governance that looks like cartelization by powerful firms or states.",
      "More likely to emphasize access, competition, and lower barriers for smaller actors and non-frontier countries.",
      "Often attentive to whether safety regimes are genuinely risk-driven or mostly reallocating power upward.",
    ],
    strongestCritique:
      "Your critics will say that openness can underweight tail risks and become complacent about the speed at which misuse and systemic danger can scale.",
    evidenceShift: [
      "Clear evidence that controlled release genuinely reduces severe systemic risk rather than just concentrating power.",
      "Evidence that open diffusion repeatedly creates harms that cannot be managed through targeted safeguards.",
      "Evidence that frontier capability jumps make iterative learning too dangerous to remain the default posture.",
    ],
    questionToSitWith:
      "How do you protect openness and access when the strongest case for restriction appears exactly at the frontier where evidence arrives late?",
    shareBlurb:
      "You worry that AI governance can become a politics of concentration long before it proves it is a politics of safety.",
  },
}
