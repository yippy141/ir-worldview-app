import { DestinationLink } from "@/components/layout/destination-link"
import { ProfileCompare } from "@/components/profile/profile-compare"
import type { Metadata } from "next"

export const metadata: Metadata = {
  title: "Compare results | IR Worldview Inventory",
  description: "Compare voluntarily supplied results and examine the choices behind them.",
  robots: { index: false, follow: false },
}
export default function ComparePage() {
  return <div className="wide-container reading-page">
    <DestinationLink destination="profile" />
    <header className="article-header stack-sm"><h1>Compare results</h1><p>Bring one subject or a shared Profile. See where the supplied answers meet, where they differ, and what is worth discussing.</p></header>
    <ProfileCompare />
  </div>
}
