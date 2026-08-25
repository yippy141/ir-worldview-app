import type { Metadata } from "next"
import { notFound } from "next/navigation"
import { WorldStagePrototype } from "@/components/home/world-stage-prototype/world-stage-prototype"

export const metadata: Metadata = {
  title: "World Stage Prototype | IR Worldview Inventory",
  description:
    "An isolated visual prototype for a map-led entry experience to the IR Worldview Inventory.",
  robots: { index: false, follow: false },
}

export default function WorldStagePrototypePage() {
  if (process.env.NODE_ENV === "production") notFound()

  return <WorldStagePrototype />
}
