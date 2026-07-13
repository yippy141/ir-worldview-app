import type { Metadata } from "next"
import { WorldStagePrototype } from "@/components/home/world-stage-prototype/world-stage-prototype"

export const metadata: Metadata = {
  title: "World Stage Prototype | IR Worldview Inventory",
  description:
    "An isolated visual prototype for a map-led entry experience to the IR Worldview Inventory.",
}

export default function WorldStagePrototypePage() {
  return <WorldStagePrototype />
}
