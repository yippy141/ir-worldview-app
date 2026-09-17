import type { EvidenceBundle, Observation } from "@/lib/connected/evidence"
import { aiAxisReading } from "@/lib/results/ai-interpretation"
import { foundationAxisReading } from "@/lib/results/foundation-interpretation"

export type Relation = {
  ruleId: string; topic: "access" | "authority" | "cooperation"; title: string
  state: "applicable" | "contrary" | "mixed" | "score-only" | "unavailable"
  text: string; evidence: Observation[]; applicability: string; changesWith: string
  followUp: { scenario: string; question: string; options: string[] }; exercise: string
}
function exact(bundle: EvidenceBundle, domain: keyof EvidenceBundle, id: string) {
  return bundle[domain]?.observations.find(o => o.questionId === id && o.permittedUse === "describe-and-relate" && o.kind !== "actor-role-judgment")
}
function score(bundle: EvidenceBundle, domain: keyof EvidenceBundle, key: string) {
  return bundle[domain]?.observations.find(o => o.id === `score:${key}`)
}
const present = (values: (Observation | undefined)[]) => values.filter((v): v is Observation => Boolean(v))

/** Authored semantic relations, never subtraction across instruments. */
export function buildConnectedRelations(b: EvidenceBundle): Relation[] {
  const release = b.technology?.provenance.bank === 3 ? exact(b, "technology", "open_weight_models") : undefined
  const access = score(b, "ai", "openness")
  const risk = score(b, "ai", "riskHorizon")
  const aiRelease = exact(b, "ai", "openWeights")
  const aiAccess = aiRelease ?? exact(b, "ai", "op1")
  const accessState = !release || !access ? "unavailable" : !aiAccess ? "score-only" : access.value! > 3 && access.value! < 5 ? "mixed" : (release.choiceId === "keep_access_broad" && access.value! >= 5) || (release.choiceId === "restrict_above_threshold" && access.value! <= 3) ? "contrary" : "applicable"
  const releaseRead = release?.choiceId === "staged_release_rules"
    ? "Your Technology choice opens access in stages after shared tests. Wider investigation and restricted release can coexist."
    : release?.choiceId === "restrict_above_threshold"
      ? "Your Technology choice restricts broad release above a capability threshold. Independent investigation remains a separate access question."
      : release?.choiceId === "keep_access_broad"
        ? "Your Technology choice keeps model access broad by default, placing weight on the costs of concentrated control."
        : "Your Technology choice puts safeguards on high-risk uses. That leaves a separate question about distributing model copies."
  const compute = b.technology?.provenance.bank === 3 ? exact(b, "technology", "public_compute") : undefined
  const oversight = score(b, "ai", "oversight")
  const mandate = score(b, "ai", "legitimacy")
  const institutions = score(b, "foundation", "institutions")
  const authorityState = !compute || !oversight ? "unavailable" : !exact(b, "ai", "ov1") ? "score-only" : (oversight.value! > 3 && oversight.value! < 5) ? "mixed" : compute.choiceId === "let_private_scale_lead" && oversight.value! >= 5 ? "contrary" : "applicable"
  const rivalry = score(b, "foundation", "securityCompetition")
  const security = b.security?.observations.find(o => o.kind === "exact-decision" && o.permittedUse === "describe-and-relate")
  const gp1 = exact(b, "ai", "gp1")
  const gp2 = exact(b, "ai", "gp2")
  const cooperationEvidence = present([rivalry, security, gp1, gp2])
  const domains = new Set(cooperationEvidence.map(e => e.domain))
  return [
    { ruleId: "access-control-v1", topic: "access", title: "Access and control", state: accessState,
      applicability: "Technology bank 3 release decision plus a resolved AI openness axis; exact AI release choice when supplied.",
      changesWith: "A different release choice, a different AI openness or risk position, or an exact AI release answer changes this text.",
      text: accessState === "unavailable" ? "A Technology release choice and an AI access position are needed to connect these subjects."
        : `${releaseRead} ${aiAxisReading("openness", access!.value!)} ${risk ? aiAxisReading("riskHorizon", risk.value!) : ""} ${aiAccess ? "The recorded answers below let you compare the conditions in each question." : "The underlying AI choices are unavailable, so no reason for that position is inferred."}`,
      evidence: present([release, aiAccess ?? access, exact(b, "ai", "op2"), risk]),
      followUp: { scenario: "Independent researchers may test a powerful model in a supervised environment; downloadable copies cannot be recalled.", question: "Which access condition would most affect your decision?", options: ["Who is admitted", "What can leave the environment", "Publication rights", "Inability to recall copies", "I am uncertain", "Another reason"] }, exercise: "/decisions/who-gets-access" },
    { ruleId: "authority-capacity-v1", topic: "authority", title: "Public authority and practical capacity", state: authorityState,
      applicability: "Technology bank 3 public-compute decision plus a resolved AI oversight axis; Foundation institutions and AI legitimacy add distinct observations only.",
      changesWith: "The public-compute choice and AI oversight position determine the relation; institutional and legitimacy scores only add their own context.",
      text: authorityState === "unavailable" ? "A concrete public-capacity choice and an AI oversight position are needed for this connection."
        : `${compute!.choiceId === "let_private_scale_lead" ? "In Technology, you chose to buy access from private providers under public safety terms." : compute!.choiceId === "build_public_compute" ? "In Technology, you chose a public computing service with screening and monitoring." : compute!.choiceId === "share_trusted_infrastructure" ? "In Technology, you chose shared facilities and screening with trusted partners." : "In Technology, you prioritized lower-risk services for underserved users."} ${aiAxisReading("oversight", oversight!.value!)} Public rule-setting, the ability to deliver a service and national ownership are separate decisions. ${institutions ? foundationAxisReading("institutions", institutions.value!) : ""}`,
      evidence: present([compute, exact(b, "ai", "ov1") ?? oversight, mandate, institutions]),
      followUp: { scenario: "A public regulator can enforce rules, but private or shared facilities can deliver a computing service sooner.", question: "What would justify public ownership of the service?", options: ["Independent technical capacity", "Access for underserved users", "Control of sensitive systems", "Ownership is unnecessary if rules are enforceable", "I am uncertain", "Another reason"] }, exercise: "/decisions/who-gets-access" },
    { ruleId: "cooperation-security-v1", topic: "cooperation", title: "Cooperation and security conditions", state: domains.size < 2 ? "unavailable" : b.ai && !(gp1 && gp2) ? "score-only" : rivalry && rivalry.value! > 3 && rivalry.value! < 5 ? "mixed" : gp1 && gp2 && ((gp1.value! >= 5 && gp2.value! <= 3) || (gp1.value! <= 3 && gp2.value! >= 5)) ? "contrary" : "applicable",
      applicability: "At least two subjects provide Foundation rivalry, a personal Security decision, or the separate exact AI rivalry/cooperation answers. Actor-role judgments are excluded.",
      changesWith: "A different Security decision, Foundation rivalry position, or separate AI cooperation answers changes this text. An AI geopolitics average cannot replace those answers.",
      text: domains.size < 2 ? "The supplied information does not yet connect cooperation with a decision in another subject."
        : `${rivalry ? foundationAxisReading("securityCompetition", rivalry.value!) : "The AI answers below preserve the separate rivalry and coordination propositions."} ${security ? "Your Security decision below concerns a particular request and its costs." : ""} Expecting rivalry does not establish whether you want cooperation. ${b.ai && !(gp1 && gp2) ? "The AI average cannot recover that distinction; its separate answers are unavailable here." : "Compare the actors, verification and commitments in each question."}`,
      evidence: cooperationEvidence,
      followUp: { scenario: "Two rival states can inspect declared AI laboratories but cannot rule out undeclared facilities.", question: "What would make a reciprocal deployment limit acceptable?", options: ["Timely detection and a response to evasion", "Useful partial visibility even without full trust", "A smaller concession that limits exposure", "I would decline under these conditions", "I am uncertain", "Another reason"] }, exercise: "/decisions" },
  ]
}
