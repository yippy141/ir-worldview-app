import { WorldviewProfilePage } from "@/components/worldview-profile/worldview-profile-page"
import { getAtlasLitePattern, getAtlasLitePatterns } from "@/lib/atlas-lite"
import type { Metadata } from "next"
import { notFound } from "next/navigation"

export function generateStaticParams() {
  return getAtlasLitePatterns().map((pattern) => ({
    id: pattern.id,
  }))
}

export async function generateMetadata(
  { params }: { params: Promise<{ id: string }> },
): Promise<Metadata> {
  const { id } = await params
  const pattern = getAtlasLitePattern(id)

  if (!pattern) {
    return { title: "Worldview profiles — IR Worldview Inventory" }
  }

  return {
    title: `${pattern.publicName} — Worldview profile — IR Worldview Inventory`,
    description: `${pattern.decisionRule} ${pattern.cardSummary}`,
  }
}

export default async function AtlasPatternDetailPage(
  { params }: { params: Promise<{ id: string }> },
) {
  const { id } = await params
  const pattern = getAtlasLitePattern(id)

  if (!pattern) {
    notFound()
  }

  return <WorldviewProfilePage pattern={pattern} />
}
