import type { Metadata } from "next"
import { notFound } from "next/navigation"
import { ZhHansWorldviewProfilePage } from "@/components/worldview-profile/zh-hans-worldview-profile-page"
import { zhHansWorldviewProfileById } from "@/content/locales/zh-Hans/worldview-profiles"
import { zhHansWorldviewProfileMetadata } from "@/content/locales/zh-Hans/metadata"
import { createDynamicLocalizedMetadata } from "@/i18n/metadata"
import { getAtlasLitePattern, getAtlasLitePatterns } from "@/lib/atlas-lite"

export function generateStaticParams() {
  return getAtlasLitePatterns().map((pattern) => ({ id: pattern.id }))
}

export async function generateMetadata({ params }: { params: Promise<{ id: string }> }): Promise<Metadata> {
  const { id } = await params
  const copy = zhHansWorldviewProfileMetadata[id]
  if (!copy) return { title: "世界观画像｜国际关系世界观清单" }
  return createDynamicLocalizedMetadata("zh-Hans", `/explore/atlas/${id}`, copy)
}

export default async function ChineseAtlasPatternDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params
  const pattern = getAtlasLitePattern(id)
  if (!pattern || !zhHansWorldviewProfileById[id]) notFound()
  return <ZhHansWorldviewProfilePage pattern={pattern} />
}
