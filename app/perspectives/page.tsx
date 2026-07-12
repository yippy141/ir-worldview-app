import { PerspectivePicker } from "@/components/perspectives/perspective-picker"
import type { Metadata } from "next"

export const metadata: Metadata = {
  title: "Perspectives — IR Worldview Inventory",
  description:
    "Advise from a defined strategic position and see the contextual shift plotted beside your Foundation baseline.",
}

export default function PerspectivesPage() {
  return (
    <div className="wide-container">
      <PerspectivePicker />
    </div>
  )
}
