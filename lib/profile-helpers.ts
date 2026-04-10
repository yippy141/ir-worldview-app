import type { ModuleSlug } from "@/lib/modules/types"
import type { ProfileStore } from "@/lib/profile-store"

export function buildIntegratedHeadline(profile: ProfileStore): string {
  const foundation = profile.foundation
  if (!foundation) {
    return "Complete the Foundation first to build your integrated profile."
  }

  const clauses = Object.values(profile.modules)
    .filter((moduleSnapshot): moduleSnapshot is NonNullable<typeof moduleSnapshot> => Boolean(moduleSnapshot))
    .sort((a, b) => a.timestamp - b.timestamp)
    .map((moduleSnapshot) => moduleHeadlineClause(moduleSnapshot.slug, moduleSnapshot.scores))

  const base = `${foundation.familyLabel} baseline with ${strategyPhrase(foundation.strategyModifier)} and ${normativePhrase(foundation.normativeModifier)}`

  if (clauses.length === 0) {
    return `${base}.`
  }

  return `${base}; ${clauses.join(", ")}.`
}

export function buildCrossDomainTensions(profile: ProfileStore): string[] {
  const foundation = profile.foundation
  if (!foundation) {
    return []
  }

  const securityTensions: string[] = []
  const technologyTensions: string[] = []
  const crossDomainTensions: string[] = []
  const security = profile.modules.security
  const technology = profile.modules.technology

  if (security) {
    if (foundation.dimensionScores.restraint >= 5.15 && security.scores.activism >= 5.2) {
      securityTensions.push(
        "You lean toward restraint in the baseline, but become more pressure-minded when security crises sharpen.",
      )
    } else if (foundation.dimensionScores.restraint <= 3.85 && security.scores.activism <= 3.8) {
      securityTensions.push(
        "Your baseline is more competition-minded than your security read, which puts clearer limits on force and escalation.",
      )
    }

    if (foundation.dimensionScores.orderJustice >= 5.15 && security.scores.legitimacy >= 5.1) {
      securityTensions.push(
        "You are more order-first in the abstract, but become more protection-sensitive when force and civilian risk are directly in view.",
      )
    }

    if (foundation.dimensionScores.institutions >= 5.15 && security.scores.alliance >= 5.3) {
      securityTensions.push(
        "You trust institutions in the baseline, but under security pressure that instinct shows up more as coalition durability than as legal formality alone.",
      )
    }
  }

  if (technology) {
    if (foundation.dimensionScores.restraint >= 5.15 && technology.scores.control >= 5.4) {
      technologyTensions.push(
        "You prefer restraint as a general strategy, but become more control-first when technology, dependence, and chokepoints come into focus.",
      )
    }

    if (foundation.dimensionScores.institutions >= 5.15 && technology.scores.governance <= 4.2) {
      technologyTensions.push(
        "You trust shared rules in the baseline, but lean toward narrower national tools when technology governance looks too slow or too weak.",
      )
    } else if (foundation.dimensionScores.institutions < 5 && technology.scores.governance >= 5.4) {
      technologyTensions.push(
        "Your baseline is not especially institution-forward, but technology pushes you toward shared standards and coordinated governance.",
      )
    }
  }

  if (security && technology) {
    if (security.scores.alliance >= 5.5 && technology.scores.governance <= 4.2) {
      crossDomainTensions.push(
        "You are more coalition-centered in security than in technology, where you are more willing to fall back on narrower national tools.",
      )
    }

    if (security.scores.activism <= 3.8 && technology.scores.control >= 5.4) {
      crossDomainTensions.push(
        "Across domains, you are more cautious about force than about control: restrained in security crises, but firmer on technological leverage.",
      )
    }
  }

  return uniqueStrings([
    ...securityTensions.slice(0, 1),
    ...technologyTensions.slice(0, 1),
    ...crossDomainTensions.slice(0, 1),
    ...securityTensions.slice(1),
    ...technologyTensions.slice(1),
    ...crossDomainTensions.slice(1),
  ]).slice(0, 3)
}

export function moduleHeadlineClause(slug: ModuleSlug, scores: Record<string, number>) {
  if (slug === "security") {
    if (scores.alliance >= 5.5) return "coalition-centered in security"
    if (scores.activism >= 5.2) return "harder-edged in security"
    if (scores.activism <= 3.8) return "more restraint-minded in security"
    return "mixed under security pressure"
  }

  if (scores.control >= 5.4 && scores.industrial >= 5.1) {
    return "more control-first in technology"
  }

  if (scores.governance >= 5.4) {
    return "more coordination-minded in technology"
  }

  if (scores.control <= 3.8) {
    return "more open by default in technology"
  }

  return "mixed in technology"
}

function strategyPhrase(modifier: string) {
  if (modifier === "Restrainer") return "a restrained strategic style"
  if (modifier === "Maximizer") return "a harder competitive style"
  return "a conditional strategic style"
}

function normativePhrase(modifier: string) {
  if (modifier === "Pluralist") return "an order-first normative style"
  if (modifier === "Universalist") return "a justice-forward normative style"
  return "a mixed normative style"
}

function uniqueStrings(values: string[]) {
  return Array.from(new Set(values))
}
