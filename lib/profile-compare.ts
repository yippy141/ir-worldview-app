import { DOMAINS, DOMAIN_LABELS, compareProvenance, evidenceFromProfile, type EvidenceBundle, type ResultEvidence, type Comparability } from "@/lib/connected/evidence"
import type { ProfileStore } from "@/lib/profile-store"

// Editorial display rule, not a significance test or a population norm.
export const APPRECIABLE_SCORE_GAP = 0.35
export type ComparisonRow = { key: string; label: string; left: number; right: number; diff: number; reading: string; poles?: { low: string; high: string } }
export type DomainComparison = { domain: typeof DOMAINS[number]; title: string; comparability: Comparability; left?: ResultEvidence; right?: ResultEvidence; rows: ComparisonRow[]; largest: ComparisonRow[]; state: "identical" | "small" | "different" | "withheld"; summary: string; prompt: string; sharedChoices: string[]; differentChoices: string[] }
export function buildEvidenceComparison(left: EvidenceBundle, right: EvidenceBundle): DomainComparison[] {
  return DOMAINS.filter(d => left[d] || right[d]).map(domain => {
    const l = left[domain], r = right[domain]
    const comparability = compareProvenance(l, r)
    const rows: ComparisonRow[] = comparability.status === "comparable" ? Object.keys(l!.scores).filter(k => Number.isFinite(l!.scores[k]) && Number.isFinite(r!.scores[k])).map(key => {
      const a = l!.scores[key], b = r!.scores[key], diff = Number((a - b).toFixed(4))
      const magnitude = Math.abs(diff)
      const reading = magnitude === 0 ? "The supplied scores match."
        : magnitude < APPRECIABLE_SCORE_GAP ? "A small numerical difference; it does not establish opposed views."
          : (a >= 4.35 && b >= 4.35) || (a <= 3.65 && b <= 3.65) ? "The scores point in the same direction with different strength."
            : (a >= 4.35 && b <= 3.65) || (b >= 4.35 && a <= 3.65) ? "The scores sit on different sides of the scale, away from its midpoint."
              : "A difference in degree; the positions alone do not establish opposed beliefs."
      return { key, label: l!.labels[key], left: a, right: b, diff, reading, poles: l!.poles?.[key] }
    }) : []
    const max = Math.max(0, ...rows.map(row => Math.abs(row.diff)))
    const state = rows.length === 0 ? "withheld" : max === 0 ? "identical" : max < APPRECIABLE_SCORE_GAP ? "small" : "different"
    const largest = state === "different" ? rows.filter(row => Math.abs(Math.abs(row.diff) - max) < 1e-6) : []
    const sharedChoices: string[] = [], differentChoices: string[] = []
    if (comparability.status === "comparable") for (const a of l!.observations.filter(o => o.questionId)) {
      const b = r!.observations.find(o => o.questionId === a.questionId && o.kind === a.kind)
      if (!b) continue
      ;(a.text === b.text && a.secondChoice === b.secondChoice ? sharedChoices : differentChoices).push(a.id)
    }
    return { domain, title: DOMAIN_LABELS[domain], comparability, left: l, right: r, rows, largest, state, sharedChoices, differentChoices,
      summary: state === "identical" ? "The supplied scores match. Matching scores do not establish identical answers or reasoning."
        : state === "small" ? "The supplied scores are close. These small differences do not establish a disagreement."
          : state === "different" ? `The largest ${largest.length > 1 ? "gaps are tied across" : "gap is on"} ${largest.map(row => row.label).join(", ")}.`
            : comparability.reason,
      prompt: state === "withheld" ? "These scores are not being compared. Choose a recorded answer or a condition from either result and explain why it matters; no disagreement is assumed."
        : state === "identical" || state === "small" ? "Which question mattered most to each of you, and did you choose it for the same reason?"
          : largest.map(row => `${row.label}: ${discussionQuestions[domain][row.key] ?? "Which condition would change this position for each of you?"}`).join(" "),
    }
  })
}
export function buildProfileComparison(left: ProfileStore, right: ProfileStore) {
  return buildEvidenceComparison(evidenceFromProfile(left), evidenceFromProfile(right))
}

// Authored questions follow displayed differences; they do not predict either answer.
const discussionQuestions: Record<DomainComparison["domain"], Record<string, string>> = {
  foundation: {
    securityCompetition: "What would let repeated cooperation change a rivalry rather than merely pause it?",
    institutions: "When would a powerful state accept an institutional limit that carries a real cost?",
    domesticFilters: "Which domestic difference would make two similarly exposed states respond differently?",
    normsIdentity: "Could equal recognition change what a state wants, even without a material concession?",
    politicalEconomy: "How would dependence on a single supplier change the diplomatic choices available?",
    restraint: "What cost would make each of you stop pressing an advantage?",
    orderJustice: "When would preventing an injustice justify overriding sovereignty?",
  },
  ai: {
    riskHorizon: "What evidence would make you prioritize a possible frontier hazard over harms already occurring?",
    deploymentPace: "What evidence would justify delaying a useful deployment, and what would justify proceeding?",
    oversight: "When should a public authority be able to overrule a developer's deployment decision?",
    geopolitics: "Under what verification conditions would cooperation with a rival be worth the exposure?",
    openness: "Would independent researchers need downloadable copies, or could supervised access be enough?",
    militaryRole: "Which military use would you permit or prohibit, and what makes that boundary matter?",
    legitimacy: "Who should decide when expert advice and public authorization point in different directions?",
    humanFuture: "Which prospect matters here: human agency, transformation, or a particular imagined future? This mixed axis does not separate them.",
  },
  security: {
    activism: "What would justify coercive involvement when the costs of acting and waiting are uncertain?",
    escalation: "What escalation risk would change your response to a threat against a partner?",
    alliance: "When would a partner's request outweigh the value of keeping independent options?",
    legitimacy: "When would civilian protection justify acting without settled legal authorization?",
  },
  technology: {
    control: "Which capability or end use would justify restricting access?",
    governance: "When would shared rules be more effective than national controls?",
    industrial: "What capacity should public investment provide that private suppliers would not?",
    safety: "What evidence of harm would justify delaying a useful AI service?",
  },
}
