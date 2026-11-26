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
    <header className="article-header stack-sm"><h1>Compare results</h1><p>Paste two result links to compare the same subject. Start your conversation with the question where your scores differ most.</p></header>
    <ProfileCompare />
  </div>
}
