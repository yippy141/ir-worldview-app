import type { ModuleDefinition, ModuleResult, ModuleAxisKey } from "@/lib/modules/types"
import { standardizeModuleAxis } from "@/lib/modules/calibration"
import type { QuizMode } from "@/lib/types"
import { positionBand, type ResultInterpretation } from "@/lib/results/interpretation"

type Context = { bankVersion: number; scoringVersion: number; mode: QuizMode }

/** Reuse the issued form cuts. Bank 2 has no per-axis calibration table. */
export function modulePositionBand(definition: ModuleDefinition, context: Context, axis: ModuleAxisKey, score: number) {
  if (context.bankVersion === 2) return positionBand(score)
  const position = standardizeModuleAxis(definition.slug, context.mode, { kind: "headline" }, axis, score, context)
  return position.value <= position.lower ? "low" : position.value >= position.upper ? "high" : "middle"
}

/** The definition and result must come from the same resolved module runtime. */
export function buildModuleInterpretation(definition: ModuleDefinition, result: ModuleResult, scoredAnswerCount: number, context: Context): ResultInterpretation & { axisReadings: Record<string, string> } {
  const s = result.scores
  const bands = Object.fromEntries(definition.axes.map(axis => [axis.key, modulePositionBand(definition, context, axis.key, s[axis.key])]))
  const axisReadings = Object.fromEntries(definition.axes.map(axis => [axis.key, scoredAnswerCount === 0 ? "No scored answers support a personal interpretation of this position." : bands[axis.key] === "middle" ? `This ${context.bankVersion === 2 ? "score on the 1–7 scale" : "form"} does not select a strong direction between ${axis.lowLabel.toLowerCase()} and ${axis.highLabel.toLowerCase()}. Opposing answers can also yield this value.` : `${context.bankVersion === 2 ? "On the 1–7 scale" : "Within this form’s model"}, this position leans toward ${(bands[axis.key] === "low" ? axis.lowLabel : axis.highLabel).toLowerCase()}.`]))
  const security = definition.slug === "security"
  const summary = security
    ? `${bands.activism === "high" ? "The recorded security positions favor using pressure" : bands.activism === "low" ? "The recorded security positions favor limiting coercive involvement" : "The recorded security positions leave the extent of coercive involvement open"}, ${bands.escalation === "low" ? "while treating escalation as a reason to limit the means used" : bands.escalation === "high" ? "while giving credibility more weight when escalation risks rise" : "with no settled priority between credibility and escalation limits"}. ${bands.alliance === "high" ? "Alliance commitments also carry weight, so action has to be judged through its consequences for partners." : bands.alliance === "low" ? "Autonomy also carries weight, so a partner's request is not enough by itself to settle the response." : "The alliance position does not settle when a partner's request creates an obligation."}`
    : `${bands.control === "high" ? "The recorded technology positions favor controlling access to sensitive capabilities" : bands.control === "low" ? "The recorded technology positions favor wider access to capabilities" : "The recorded technology positions leave the scope of capability controls open"}, ${bands.governance === "high" ? "with coordinated rules carrying more weight than unilateral national tools" : bands.governance === "low" ? "with national tools carrying more weight than coordinated rules" : "without a settled choice between national tools and coordinated rules"}. ${bands.industrial === "high" ? "Public capacity also carries weight; restrictions alone would not address the ability to build and use technology." : bands.industrial === "low" ? "Market-led development also carries weight; intervention has to account for its effects on independent firms." : "The industrial position leaves the balance between public capacity and market-led development unresolved."}`
  const pressure = bands[security ? "activism" : "control"]
  const additional = security
    ? bands.legitimacy === "high" ? "Civilian protection also carries weight; a deterrence benefit alone would not settle the legitimacy of a response." : bands.legitimacy === "low" ? "Order and legal authority also carry weight; a protective aim alone would not establish permission to use force." : ""
    : bands.safety === "high" ? "The AI risk position adds a safety constraint: a useful deployment can still warrant delay when its harms are unresolved." : bands.safety === "low" ? "The AI risk position gives innovation more room; delay has to be weighed against the benefits that deployment could deliver." : ""
  const aiRiskCase = !security && pressure === "middle" && bands.safety !== "middle"
  const example = aiRiskCase ? {
    title: "A useful AI service misses a safety threshold",
    facts: "Suppose a public agency can use a new AI system to cut a severe backlog. An independent audit finds a recurring failure affecting a small group, and fixing it would delay deployment by three months.",
    application: bands.safety === "high" ? "Applied here, the safety-constrained argument asks whether the failure can be contained before people depend on the system. A limited trial with a reliable alternative could be examined separately from full deployment." : "Applied here, the innovation-oriented argument asks whether a reversible trial can reduce the backlog without committing the agency to a system it cannot correct. Useful deployment and unconditional deployment are different proposals.",
    rival: bands.safety === "high" ? "The strongest objection is that waiting also has consequences: the backlog may already impose larger and less visible harms. A safety threshold needs to account for that comparison." : "The strongest objection is that a small affected group can bear a concentrated cost while the majority receives the benefit. Reversibility at the agency level may not repair an individual's loss.",
    change: "The argument changes if an independently audited mitigation controls the failure, or if evidence shows that the cost of waiting exceeds the cost of a bounded trial.",
  } : security ? {
    title: "A partner requests a response to sabotage",
    facts: "Suppose a partner attributes a serious infrastructure attack to a rival. The evidence is credible but incomplete, and an immediate military response could widen the conflict.",
    application: pressure === "high" ? "Applied here, the pressure-oriented argument looks for a response that imposes a cost. The separate escalation position determines whether a reversible economic measure or a more forceful step better serves that argument." : pressure === "low" ? "Applied here, the restraint-oriented argument puts weight on preserving room to investigate and avoiding an open-ended commitment. It still needs a response to the partner's immediate vulnerability." : "Applied here, the involvement score does not select a response. Attribution quality, reversibility and the partner's exposure would distinguish a limited pressure campaign from an initially protective response.",
    rival: pressure === "high" ? "The strongest objection is that an uncertain attribution can turn a credibility signal into an avoidable confrontation. Pressure may also bind the partner to an escalation it cannot control." : "The strongest objection is that withholding a consequential response can leave the partner exposed and make further attacks less costly for the rival.",
    change: "The argument changes if attribution becomes independently verifiable, another attack is imminent, or the proposed response has a credible path to termination.",
  } : {
    title: "A chip restriction with costs at home",
    facts: "Suppose advanced chips have a documented military use, but a proposed export restriction would also reduce domestic firms' research revenue. Partner countries can supply substitutes.",
    application: pressure === "high" ? "Applied here, the control-oriented argument asks whether the restriction can deny a consequential capability. The governance position matters because substitution through partners can defeat a national rule; the industrial position matters because lost revenue may weaken future capacity." : pressure === "low" ? "Applied here, the access-oriented argument asks whether a broad restriction sacrifices useful exchange without preventing the military use. A narrow, enforceable end-use condition is a distinct possibility to examine." : "Applied here, the control score does not establish the right restriction. Its reach, partners' incentives and the domestic capacity cost determine what is gained by acting.",
    rival: pressure === "high" ? "The strongest objection is that substitution can preserve the target's access while the restricting country's firms absorb the loss. A visible control is not necessarily an effective denial." : "The strongest objection is that diffuse commercial access may also transfer the capability that creates the security problem. An end-use promise may be difficult to enforce.",
    change: "The argument changes if partners close the substitute channels, or if evidence shows that civilian substitutes already meet the relevant military need.",
  }
  return { kind: "model-interpretation", axisReadings,
    summary: scoredAnswerCount > 0 ? `${summary}${additional ? ` ${additional}` : ""}` : "No scored selections are available in this record. Its preserved calculation cannot establish a personal position; the scenario below shows what another answer would need to resolve.",
    scope: context.bankVersion === 2 ? "This legacy reading describes directions on the recorded 1–7 scale. Its original headline uses separate combination rules; no later form’s calibration is applied here." : "An interpretation of this module's recorded positions under its registered form. The scenario is illustrative and does not add an answer or alter any score.",
    example: { kind: "illustrative-implication", ...example, ...(scoredAnswerCount === 0 ? { application: "The missing evidence is how you weigh the stated benefit against the cost under these facts. The preserved default calculation cannot choose an argument for you." } : {}) },
    followUp: { kind: "follow-up", question: security ? "Which would change your response first: weaker attribution, a more exposed partner, or a higher risk of escalation?" : "Would you keep the restriction if partners supplied substitutes and domestic research capacity fell?" } }
}
