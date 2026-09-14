import type { Metadata } from "next"
import { notFound } from "next/navigation"

export const metadata: Metadata = {
  title: "Worldview Atlas | Development prototype",
  description: "An interactive project on how people reason about world politics.",
  robots: { index: false, follow: false },
}

// Match the existing development-route convention; do not make this deployable.
export const dynamic = "force-dynamic"

export default async function ProductRefoundationPage() {
  if (process.env.NODE_ENV === "production") notFound()

  const [{ ProductRefoundation }, { ROOT_GLOBE_VISUAL }, catalog, menu] = await Promise.all([
    import("./prototype"),
    import("@/lib/root/orthographic"),
    import("@/lib/current-cases/catalog"),
    import("@/lib/world-stage/scenes"),
  ])
  const active = catalog.getActivePublishedLaunchCurrentCase(undefined, {
    referenceDate: new Date().toISOString().slice(0, 10),
  })
  const entry = active ?? catalog.getPublishedCurrentCases()[0]
  const caseEntry = {
    label: active ? menu.currentCaseWorldStageMenuItem.label : menu.recentCasesWorldStageMenuItem.label,
    title: entry?.title ?? null,
    href: entry ? `/cases/${entry.slug}` : "/cases",
  }

  return <ProductRefoundation visual={ROOT_GLOBE_VISUAL} caseEntry={caseEntry} />
}
