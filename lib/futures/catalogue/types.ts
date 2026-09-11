import type { Features } from "@/lib/futures/catalogue/features"
export type CatalogueSource = { title: string; url: string; locator: string; checked: string; kind: "Inherited concept" | "Project-authored hypothetical" }
export type FutureScenario = {
  id: string
  name: string
  aliases: readonly string[]
  version: string
  origin: "inherited" | "project"
  comparisonKind?: "catastrophic-endpoint"
  legacySummary?: string
  premise: string
  life: string
  authority: string
  distribution: string
  status: string
  assumptions: string
  attractions: string
  costs: string
  unknowns: string
  comparisons: readonly string[]
  sources: readonly CatalogueSource[]
  features: Features
  exercise?: { href: string; label: string }
}
