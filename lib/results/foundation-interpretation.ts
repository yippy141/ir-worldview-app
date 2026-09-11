import type { DimensionKey, DimensionScores } from "@/lib/types"
import { positionBand, type ResultInterpretation } from "@/lib/results/interpretation"

const explanations: Record<DimensionKey, [string, string, string]> = {
  securityCompetition: ["Your recorded position gives reassurance and the possibility of cooperation more room than enduring rivalry.", "The rivalry score alone does not establish whether cooperation can change the relationship.", "Your recorded position treats enduring rivalry as a constraint that favorable intentions alone cannot remove."],
  institutions: ["Your recorded position gives power more weight than the independent force of rules.", "The institutional score does not establish how far rules can bind powerful actors.", "Your recorded position gives institutions a role in changing incentives, beyond reflecting existing power."],
  domesticFilters: ["Your recorded position emphasizes system pressures over differences in domestic politics.", "The domestic-politics score does not settle how differently states respond to the same external pressure.", "Your recorded position gives domestic coalitions and political institutions a role in explaining different responses to the same external pressure."],
  normsIdentity: ["Your recorded position gives material interests more weight than legitimacy and identity in explaining behavior.", "The legitimacy score does not settle whether recognition changes interests or mainly expresses them.", "Your recorded position treats recognition and legitimacy as forces that can shape interests themselves."],
  politicalEconomy: ["Your recorded position gives security and diplomacy more weight than market structure and dependence.", "The political-economy score does not settle whether economic structure or diplomatic choice does more explanatory work.", "Your recorded position looks to control of markets, resources and dependencies as a source of political power."],
  restraint: ["The strategic position leans toward applying advantage when an opening appears.", "The strategic position leaves the boundary between applying pressure and setting limits unresolved.", "The strategic position leans toward setting limits on pressure and avoiding overextension."],
  orderJustice: ["The normative position gives justice claims more room to override established order.", "The normative position leaves the threshold for overriding established order unresolved.", "The normative position gives order and sovereignty priority over attempts to impose justice from outside."],
}

export function foundationAxisReading(key: DimensionKey, score: number) {
  return explanations[key][positionBand(score) === "low" ? 0 : positionBand(score) === "high" ? 2 : 1]
}

/** Uses reported dimension positions, never a raw-midpoint claim about family contribution. */
export function buildFoundationInterpretation(scores: DimensionScores): ResultInterpretation {
  const explanatory: DimensionKey[] = ["securityCompetition", "institutions", "domesticFilters", "normsIdentity", "politicalEconomy"]
  const first = [...explanatory].sort((a, b) => Math.abs(scores[b] - 4) - Math.abs(scores[a] - 4))[0]
  const posture = foundationAxisReading("restraint", scores.restraint)
  const summary = `${foundationAxisReading(first, scores[first])} ${posture} ${foundationAxisReading("orderJustice", scores.orderJustice)}`
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
    scope: "This reading combines the reported positions. It does not identify particular answers or establish a lasting personal trait.",
    example: { kind: "illustrative-implication", title: "An arms-control bargain under pressure",
      facts: "Suppose two rivals offer reciprocal inspections at declared facilities. Undeclared sites remain possible, and compliance requires a real concession from each side.",
      application: `${middle ? "The scores do not establish a dominant explanation here. One live argument is that inspections change incentives; another is that they work only while the strategic bargain holds." : lenses[first].application} ${scores.restraint >= 5 ? "The restraint position adds a reason to preserve a limited bargain even if it leaves some advantage unused." : scores.restraint <= 3 ? "The advantage-oriented position adds a reason to demand stronger terms while bargaining power is available." : "The strategic score does not settle how hard to press for better terms."}`,
      rival: middle ? "A middle score may combine opposing answers. It cannot show that both arguments would receive equal weight in this case." : lenses[first].rival,
      change: "The argument changes if inspections reveal violations soon enough to matter, or if the concession materially changes one side's ability to coerce the other." },
    followUp: { kind: "follow-up", question: "Would you accept verified limits at declared sites if neither side could rule out undeclared facilities? Which concession would make you refuse?" } }
}
