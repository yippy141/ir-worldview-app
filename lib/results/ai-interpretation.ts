import { aiPayloadToAxisScores, type ResolvedAiPayload } from "@/lib/ai-governance-share"
import type { AiAxisKey, AiAxisScores } from "@/lib/ai-governance-types"
import { positionBand, strongestPair, type ResultInterpretation } from "@/lib/results/interpretation"

const readings: Record<AiAxisKey, Record<ReturnType<typeof positionBand>, string>> = {
  riskHorizon: { low: "Present harms carry more weight than distant frontier hazards on this axis.", middle: "The risk score alone does not settle the balance between present harms and frontier hazards.", high: "Severe frontier hazards carry substantial weight in this reading." },
  deploymentPace: { low: "The pace position favors learning through deployment over waiting for stronger assurances.", middle: "The pace score does not establish a general release or delay rule.", high: "The pace position favors slowing deployment when concerning evidence emerges." },
  oversight: { low: "Oversight leans toward developers and technical experts rather than stronger public supervision.", middle: "The oversight score leaves the allocation of public and developer authority unsettled.", high: "Oversight leans toward stronger public supervision rather than developer discretion." },
  geopolitics: { low: "Coordination receives more weight than preserving competitive advantage on this axis.", middle: "The geopolitical score leaves room for both coordination and strategic competition; it does not specify which comes first in a conflict.", high: "Strategic competition receives more weight than coordination on this axis." },
  openness: { low: "Wider access carries more weight than restricting diffusion.", middle: "The access score does not establish either open diffusion or restricted access as a standing rule.", high: "Controlled access carries more weight than broad diffusion." },
  militaryRole: { low: "The military-use position leans against integrating frontier AI into defense.", middle: "The military-use score does not identify which specific uses would be acceptable.", high: "The military-use position gives more weight to a role for AI in defense." },
  legitimacy: { low: "Expert authority receives more weight than a broader public mandate in rule-setting.", middle: "The legitimacy score does not resolve a disagreement between expertise and public authorization.", high: "Public authorization receives more weight than expert discretion in rule-setting." },
  humanFuture: { low: "This position sits toward the transformation end of a mixed axis. It cannot identify a preferred future or establish support for AI rule.", middle: "This mixed axis cannot separate views on transformation, human agency and particular imagined futures.", high: "This position sits toward the human-control end of a mixed axis; the required institutions remain unspecified." },
}

export function aiAxisReading(axis: AiAxisKey, score: number) {
  return readings[axis][positionBand(score)]
}

/** Accept only an already resolved registered tuple. No latest-version fallback. */
export function buildAiInterpretation(resolved: ResolvedAiPayload): ResultInterpretation {
  const scores = aiPayloadToAxisScores(resolved.payload)
  return interpretAiPositions(scores)
}

export function interpretAiPositions(s: AiAxisScores): ResultInterpretation {
  const pair = strongestPair(s, [["openness", "riskHorizon"], ["oversight", "legitimacy"], ["geopolitics", "deploymentPace"]])
  const summary = pair.map(axis => aiAxisReading(axis, s[axis])).join(" ")
  const scope = "An interpretation of the recorded scores. This link does not contain an answer transcript; the example below is an application of the reasoning, not a forecast of your choice."
  if (pair[0] === "openness") {
    const open = positionBand(s.openness)
    const risk = positionBand(s.riskHorizon)
    const relationship = open === "low" && risk === "high"
      ? "Together, these positions make independent scrutiny important without treating AI as harmless. Restricting access can itself concentrate the power to decide what gets investigated."
      : open === "high" && risk === "low"
        ? "The case for access controls here need not rest on catastrophe: present misuse, accountability or market power could also motivate limits. The scores cannot distinguish those reasons."
        : open === "high" && risk === "high"
          ? "Together, these positions support keeping the ability to contain a serious hazard while evidence is gathered. The cost is concentrating access in the institutions that decide whether release is safe."
          : open === "low" && risk === "low"
            ? "Together, these positions give weight to the costs of excluding outside users and investigators. Wider access still leaves a separate question about who bears harm from misuse."
            : "The combination leaves a material choice open: whether access should expand before a particular hazard is understood. A middle score can also combine opposing answers."
    return { kind: "model-interpretation", summary: `${summary} ${relationship}`, scope,
      example: { kind: "illustrative-implication", title: "A frontier model with disputed misuse evidence", facts: "Suppose an independent team reports a serious misuse capability. Other researchers cannot yet reproduce the finding, and the developer controls admission to its testing service.",
        application: open === "low" ? "Applied here, the access-oriented argument is to enable independent investigation with meaningful publication rights. If uncontrolled copies would make the hazard irreversible, supervised research access could serve scrutiny without settling the separate weights-release decision." : open === "high" ? "Applied here, the control-oriented argument is to retain restrictions while independent investigators test the reported hazard. Developer-only review would leave a conflict of interest even if the restriction itself were justified." : "Applied here, the scores leave two live routes: expand independent research access, or retain restrictions until the hazard is better understood. Reversibility and who can veto investigation would help distinguish them.",
        rival: open === "low" ? "The strongest objection is that even screened access may transfer a capability that cannot later be recalled. Independence alone does not solve that risk." : "The strongest objection is that the gatekeeper can suppress inconvenient findings or protect incumbents. Restriction can make the evidence needed to justify release harder to obtain.",
        change: "The argument changes if independent reproduction shows that the proposed access channel either contains the hazard or reliably enables it." },
      followUp: { kind: "follow-up", question: "Would you allow independent research access if the developer could veto admission, while public release remained irreversible?" } }
  }
  if (pair[0] === "oversight") {
    const publicControl = positionBand(s.oversight)
    const mandate = positionBand(s.legitimacy)
    const relationship = publicControl === "high" && mandate === "low"
      ? "This separates state capacity from democratic authorization: a capable public agency may matter more here than broad participation. The two are not interchangeable."
      : publicControl === "low" && mandate === "high"
        ? "This separates public legitimacy from direct state supervision. An accountable rule-making process could matter even if technical implementation remains outside government."
        : publicControl === "high" && mandate === "high"
          ? "The combination asks for both authority to enforce rules and a public basis for using it. Technical competence alone would not settle who may impose the costs."
          : "These positions leave distinct questions about who can enforce a rule and who can authorize it. Neither score tells us how an appeal should work."
    return { kind: "model-interpretation", summary: `${summary} ${relationship}`, scope,
      example: { kind: "illustrative-implication", title: "Who can stop a deployment?", facts: "Suppose a regulator and a developer disagree over a failed safety evaluation. A one-month delay would disrupt a useful public service, and the regulator's technical team is small.",
        application: publicControl === "high" ? "Applied here, the supervision argument gives the regulator an enforceable stop power, with access to outside technical evidence. Its legitimacy still depends on the grounds for intervention and a way to challenge errors." : publicControl === "low" ? "Applied here, the expert-led argument places initial technical assessment with developers and independent specialists. It then has to explain who can compel disclosure when those specialists disagree." : "Applied here, the oversight score cannot allocate final authority. A narrow temporary stop, independent review and a time limit are one possible arrangement to examine, not a recorded preference.",
        rival: publicControl === "high" ? "A poorly equipped regulator can become dependent on the firms it oversees. Formal authority may then slow useful deployment without producing independent judgment." : "Experts can have financial or institutional interests in release. A technically informed decision may still lack an accountable way for affected people to contest it.",
        change: "The argument changes if the regulator can obtain independent expertise, publish its reasons and resolve appeals before delay defeats the service's purpose." },
      followUp: { kind: "follow-up", question: "Who should have the final say when an expert panel recommends release but an accountable public body refuses it?" } }
  }
  const competition = positionBand(s.geopolitics)
  const pace = positionBand(s.deploymentPace)
  const relationship = competition === "high" && pace === "high"
    ? "Competition does not erase caution in this combination. It raises the cost of delay while leaving reasons to delay intact."
    : competition === "low" && pace === "low"
      ? "Coordination here need not mean a general pause. It could organize shared evaluation and learning while deployment continues."
      : "The combination makes the timing of deployment inseparable from what other developers and states can credibly commit to."
  return { kind: "model-interpretation", summary: `${summary} ${relationship}`, scope,
    example: { kind: "illustrative-implication", title: "A reciprocal deployment limit", facts: "Suppose two rival states can verify tests at declared frontier labs, but neither can rule out undeclared facilities. A proposed reciprocal delay would buy time for evaluation.",
      application: competition === "high" ? "Applied here, the competitive argument asks what a compliant state gives up if its rival cheats. A limited agreement would need a response to evasion; the recorded pace position determines whether delay itself is a cost or also a safeguard." : competition === "low" ? "Applied here, the coordination argument treats reciprocal access to declared labs as useful even without complete trust. Its value depends on whether that partial visibility changes incentives enough to justify the concessions." : "Applied here, the geopolitical score does not decide whether partial verification is enough. Comparing the safety gained from delay with the advantage obtainable through evasion would expose the unresolved choice.",
      rival: competition === "high" ? "Rejecting a partial agreement can also accelerate a race in which both sides accept risks they would prefer to avoid. Imperfect visibility may still be better than none." : "A reciprocal rule can burden visible, compliant labs while leaving hidden activity untouched. Coordination is not evidence that concessions are equally costly.",
      change: "The argument changes if inspections can detect evasion soon enough for the agreed response to matter, or if delay would avert a specific, independently demonstrated hazard." },
    followUp: { kind: "follow-up", question: "Would partial verification justify a reciprocal delay if undeclared labs remained possible?" } }
}

/** Exact linear terms from the frozen model, including its separate rounding residual. */
export function aiComparisonTerms(resolved: ResolvedAiPayload) {
  const s = aiPayloadToAxisScores(resolved.payload)
  const { ak, nk } = resolved.payload
  const profiles = resolved.scoring.archetypeProfiles
  const totals = resolved.scoring.scoreArchetypes(s)
  const rows = (Object.keys(s) as AiAxisKey[]).map(axis => ({ axis,
    term: (s[axis] - 4) * ((profiles[ak][axis] ?? 0) - (profiles[nk][axis] ?? 0)),
  })).sort((a, b) => Math.abs(b.term) - Math.abs(a.term))
  const questions: Record<AiAxisKey, string> = {
    riskHorizon: "Would a poorly quantified catastrophic hazard justify a delay when deployment already reduces a documented present-day harm?",
    deploymentPace: "Would evidence from a reversible public trial justify proceeding before a comprehensive evaluation was complete?",
    oversight: "Who should be able to halt deployment when an independent evaluator and the developer disagree about a failed test?",
    geopolitics: "Would partial verification justify a reciprocal deployment limit when a rival could still operate undeclared facilities?",
    openness: "Should independent researchers receive access when downloadable copies could also make a demonstrated misuse capability irreversible?",
    militaryRole: "Would a bounded defensive use justify introducing AI into a military system whose next use is harder to constrain?",
    legitimacy: "Who should authorize a consequential release when technical experts and an accountable public body reach different conclusions?",
    humanFuture: "Which specific future proposition do you accept or reject? This mixed axis cannot distinguish preferred futures without separate answers.",
  }
  const contrast = rows[0].term !== 0 ? rows[0].axis : (Object.keys(s) as AiAxisKey[]).sort((a, b) => Math.abs((profiles[ak][b] ?? 0) - (profiles[nk][b] ?? 0)) - Math.abs((profiles[ak][a] ?? 0) - (profiles[nk][a] ?? 0)))[0]
  return { rows, question: questions[contrast], difference: totals[ak] - totals[nk], residual: totals[ak] - totals[nk] - rows.reduce((sum, row) => sum + row.term, 0) }
}
