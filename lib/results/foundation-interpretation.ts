import type { DimensionKey, DimensionScores } from "@/lib/types"
import { positionBand, type ResultInterpretation } from "@/lib/results/interpretation"

const explanations: Record<DimensionKey, [string, string, string]> = {
  securityCompetition: ["On rivalry, your score leans toward reassurance. A rival that keeps a promise can give the other side a reason to cooperate.", "The rivalry score leaves open how much reassurance can achieve.", "Your rivalry score gives weight to military preparations even when relations improve."],
  institutions: ["Your score on agreements points to enforcement. A treaty lasts while its members have the power to uphold it.", "The score on agreements leaves open how far rules can bind a powerful state.", "Your score on agreements points to monitoring. When treaty partners can spot cheating, keeping a promise can pay even when trust is thin."],
  domesticFilters: ["Your domestic-politics score points to pressures that governments face abroad, even when different parties hold office.", "The domestic-politics score leaves open how much a change of government matters.", "Your domestic-politics score points to differences at home. A change in the governing coalition can alter foreign policy even when the threat abroad stays the same."],
  normsIdentity: ["Your score on identity gives greater weight to material interests in explaining what states do.", "The identity score leaves open whether diplomatic recognition changes a state’s interests.", "Your score on identity gives diplomatic standing a role in shaping what governments want."],
  politicalEconomy: ["Your economic score gives greater weight to bargaining and security interests in explaining what states do.", "The economic score leaves open how much control of markets shapes a government’s choices.", "Your economic score points to a source of bargaining power. A government that controls a market or a crucial supply can limit the choices open to other countries."],
  restraint: ["On strategy, the score leans toward using an advantage while it lasts.", "The restraint score leaves open when to press an advantage and when to stop.", "On strategy, the score leans toward limiting commitments that could stretch a country too thin."],
  orderJustice: ["On justice, the score gives weight to protecting people even when doing so would challenge a state’s sovereignty.", "The justice score leaves open when protecting people should outweigh respect for a state’s sovereignty.", "On justice, the score gives greater weight to sovereignty and the risks of outside intervention."],
}

export function foundationAxisReading(key: DimensionKey, score: number) {
  return explanations[key][positionBand(score) === "low" ? 0 : positionBand(score) === "high" ? 2 : 1]
}

/** Uses reported dimension positions, never a raw-midpoint claim about family contribution. */
export function buildFoundationInterpretation(scores: DimensionScores): ResultInterpretation {
  const explanatory: DimensionKey[] = ["securityCompetition", "institutions", "domesticFilters", "normsIdentity", "politicalEconomy"]
  const first = [...explanatory].sort((a, b) => Math.abs(scores[b] - 4) - Math.abs(scores[a] - 4))[0]
  const posture = foundationAxisReading("restraint", scores.restraint)
  const summary = first === "domesticFilters" && positionBand(scores.domesticFilters) === "high" && positionBand(scores.restraint) === "middle" && positionBand(scores.orderJustice) === "middle"
    ? "You give domestic politics an important role in foreign policy. Parties, interest groups and political institutions help explain why governments facing similar pressures can make different choices.\n\nThe summary scores do not settle how far you would press an advantage, or when justice should take priority over sovereignty and established rules. Those questions need a more specific case."
    : `${foundationAxisReading(first, scores[first])} ${posture} ${foundationAxisReading("orderJustice", scores.orderJustice)}`
  const high = positionBand(scores[first]) === "high"
  const lenses: Record<string, { application: string; rival: string }> = {
    securityCompetition: high
      ? { application: "The rivalry-centered argument asks whether the agreement changes incentives to cheat or merely records a temporary bargain. Independent inspection matters insofar as it makes evasion costly.", rival: "The strongest rival argument is that repeated inspection can itself make cooperation more durable, even when the initial political bargain is fragile." }
      : { application: "The cooperation-oriented argument asks whether inspections and reciprocal concessions can make the relationship less threatening. This requires more than trusting the other side's stated intentions.", rival: "The strongest rival argument is that a state can use the concession to improve its position and later defect; reassurance does not remove that opportunity." },
    institutions: high
      ? { application: "The institutional argument gives weight to verification, repeat dealings and the cost of exclusion. It asks how those mechanisms change the payoff from compliance.", rival: "The strongest rival argument is that a sufficiently valuable strategic advantage can outweigh the costs imposed by the institution." }
      : { application: "The power-centered argument asks which actors can enforce the agreement and why they would continue to do so. The existence of a written obligation is insufficient.", rival: "The strongest rival argument is that information and reciprocal access can sustain cooperation even without a single powerful enforcer." },
    domesticFilters: high
      ? { application: "The domestic-politics argument compares who gains and loses from compliance inside each state. The same inspection demand can strengthen one coalition and threaten another.", rival: "The strongest rival argument is that external vulnerability can impose similar behavior across very different domestic coalitions." }
      : { application: "The system-pressure argument asks whether the same strategic exposure drives both governments toward the same bargain, despite their different domestic institutions.", rival: "The strongest rival argument is that domestic veto players can prevent an agreement that appears advantageous at the state level." },
    normsIdentity: high
      ? { application: "The legitimacy argument asks whether equal inspection rights recognize both parties as acceptable partners. That status can affect what each treats as a tolerable concession.", rival: "The strongest rival argument is that reciprocal language can mask unequal military vulnerability; recognition may not change the material stakes." }
      : { application: "The material-interest argument focuses on what each side gives up and can verify. Recognition alone would not compensate for an unfavorable security bargain.", rival: "The strongest rival argument is that humiliating or unequal terms can make even a materially useful bargain politically unacceptable." },
    politicalEconomy: high
      ? { application: "The structural argument follows control of the technology and supply chains needed for verification. Formally equal inspection rights may still create dependence on one side's infrastructure.", rival: "The strongest rival argument is that negotiated rules and alternative suppliers can constrain that dependence enough for the agreement to work." }
      : { application: "The diplomatic argument starts with the security bargain and the reciprocal commitments. It asks whether a workable deal is possible despite unequal economic resources.", rival: "The strongest rival argument is that control of finance, production or inspection technology can shape the choices available before negotiations begin." },
  }
  const middle = positionBand(scores[first]) === "middle"
  return { kind: "model-interpretation", summary,
    scope: "This interpretation combines the reported positions. It does not identify particular answers or establish a lasting personal trait.",
    example: { kind: "illustrative-implication", title: "An arms-control bargain under pressure",
      facts: "Suppose two rivals offer reciprocal inspections at declared facilities. Undeclared sites remain possible, and compliance requires a real concession from each side.",
      application: `${middle ? "The scores do not establish a dominant explanation here. One live argument is that inspections change incentives; another is that they work only while the strategic bargain holds." : lenses[first].application} ${scores.restraint >= 5 ? "The restraint position adds a reason to preserve a limited bargain even if it leaves some advantage unused." : scores.restraint <= 3 ? "The advantage-oriented position adds a reason to demand stronger terms while bargaining power is available." : "The strategic score does not settle how hard to press for better terms."}`,
      rival: middle ? "A middle score may combine opposing answers. It cannot show that both arguments would receive equal weight in this case." : lenses[first].rival,
      change: "The argument changes if inspections reveal violations soon enough to matter, or if the concession materially changes one side's ability to coerce the other." },
    followUp: { kind: "follow-up", question: "Would you accept verified limits at declared sites if neither side could rule out undeclared facilities? Which concession would make you refuse?" } }
}
