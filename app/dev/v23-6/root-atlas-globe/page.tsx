import type { Metadata } from "next"
import { notFound } from "next/navigation"
import { AtlasGlobeRoot } from "@/components/dev/v23-6/atlas-globe-root"
import {
  readTypeTreatment,
  readVisitorMode,
} from "@/lib/v23-6/prototype-params"

export const metadata: Metadata = {
  title: "Root prototype: Atlas Globe | IR Worldview Inventory",
  description:
    "An isolated root prototype that keeps the existing globe in a quiet state behind a full-screen destination menu.",
  robots: { index: false, follow: false },
}

export default async function AtlasGlobeRootPage({
  searchParams,
}: {
  searchParams: Promise<Record<string, string | string[] | undefined>>
}) {
  if (process.env.NODE_ENV === "production") notFound()

  const params = await searchParams

  return (
    <AtlasGlobeRoot
      visitor={readVisitorMode(params.visitor)}
      typeTreatment={readTypeTreatment(params.type)}
    />
  )
}
