import type { Metadata } from "next"
import { notFound } from "next/navigation"
import { ArmillaryRoot } from "@/components/dev/v23-6/armillary-root"
import {
  readTypeTreatment,
  readVisitorMode,
} from "@/lib/v23-6/prototype-params"

export const metadata: Metadata = {
  title: "Root prototype: Armillary Atlas | IR Worldview Inventory",
  description:
    "An isolated root prototype that replaces the globe with a drawn armillary instrument behind a full-screen destination menu.",
  robots: { index: false, follow: false },
}

export default async function ArmillaryRootPage({
  searchParams,
}: {
  searchParams: Promise<Record<string, string | string[] | undefined>>
}) {
  if (process.env.NODE_ENV === "production") notFound()

  const params = await searchParams

  return (
    <ArmillaryRoot
      visitor={readVisitorMode(params.visitor)}
      typeTreatment={readTypeTreatment(params.type)}
    />
  )
}
