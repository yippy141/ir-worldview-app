import { ProfileDashboard } from "@/components/profile/profile-dashboard"
import type { Metadata } from "next"

export const metadata: Metadata = {
  title: "Profile — IR Worldview Inventory",
  description:
    "Your integrated profile across the IR Foundation baseline, saved focus-area modules, and any AI governance result on this device.",
}

export default function ProfilePage() {
  return (
    <div className="wide-container">
      <ProfileDashboard />
    </div>
  )
}
