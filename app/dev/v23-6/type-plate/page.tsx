import type { Metadata } from "next"
import { notFound } from "next/navigation"
import { ArmillaryRoot } from "@/components/dev/v23-6/armillary-root"
import { TypePlate } from "@/components/dev/v23-6/type-plate"
import { readTypeTreatment } from "@/lib/v23-6/prototype-params"

export const metadata: Metadata = {
  title: "Typography plate | IR Worldview Inventory",
  description:
    "One root composition rendered in three typography treatments at two widths for a direction comparison.",
  robots: { index: false, follow: false },
}

export default async function TypePlatePage({
  searchParams,
}: {
  searchParams: Promise<Record<string, string | string[] | undefined>>
}) {
  if (process.env.NODE_ENV === "production") notFound()

  const params = await searchParams
  const single = Array.isArray(params.treatment)
    ? params.treatment[0]
    : params.treatment

  if (single) {
    return (
      <ArmillaryRoot visitor="returning" typeTreatment={readTypeTreatment(single)} />
    )
  }

  return <TypePlate />
}
