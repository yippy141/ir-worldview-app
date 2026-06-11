import { ProfileDashboard } from "@/components/profile/profile-dashboard"
import type { Metadata } from "next"

export const metadata: Metadata = {
  title: "Profile — IR Worldview Inventory",
  description:
    "Your saved IR Foundation baseline, focus-area modules, and AI governance result in one place.",
}

export default function ProfilePage() {
  return (
    <div className="wide-container">
      <ProfileDashboard />
    </div>
  )
}
