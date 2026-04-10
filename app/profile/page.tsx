import { ProfileDashboard } from "@/components/profile/profile-dashboard"
import type { Metadata } from "next"

export const metadata: Metadata = {
  title: "Profile — IR Worldview Inventory",
  description:
    "Your integrated IR Worldview profile across the Foundation baseline and any completed focus-area modules on this device.",
}

export default function ProfilePage() {
  return (
    <div className="wide-container">
      <ProfileDashboard />
    </div>
  )
}
