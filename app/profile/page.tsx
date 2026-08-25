import { ProfileDashboard } from "@/components/profile/profile-dashboard"
import type { Metadata } from "next"

export const metadata: Metadata = {
  title: "Profile | IR Worldview Inventory",
  description:
    "Your saved Foundation baseline, Focus Areas, Perspective Runs, AI result, and Current Case judgments in one place.",
}

export default function ProfilePage() {
  return (
    <div className="wide-container">
      <ProfileDashboard />
    </div>
  )
}
