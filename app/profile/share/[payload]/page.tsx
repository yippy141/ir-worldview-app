import { ProfileReport } from "@/components/profile/profile-report"
import { ProfileShareActions } from "@/components/profile/profile-share-actions"
import { buildIntegratedHeadline } from "@/lib/profile-helpers"
import { resolveProfileSharePayload } from "@/lib/profile-share"
import type { Metadata } from "next"
import Link from "next/link"

export async function generateMetadata(
  { params }: { params: Promise<{ payload: string }> },
): Promise<Metadata> {
  const { payload } = await params
  const resolved = resolveProfileSharePayload(payload)

  if (!resolved?.profile.foundation) {
    const title = "Shared Profile — IR Worldview Inventory"
    const description =
      "Open a shared IR Worldview Profile, or create your own Foundation result and saved profile layers."

    return buildProfileMetadata(title, description)
  }

  const foundation = resolved.profile.foundation
  const headline = buildIntegratedHeadline(resolved.profile)
  const title = `${foundation.familyLabel} profile — IR Worldview Inventory`
  const description = `Shared IR Worldview Profile for a ${foundation.familyLabel} result: ${headline}`

  return buildProfileMetadata(title, description)
}

function buildProfileMetadata(title: string, description: string): Metadata {
  return {
    title,
    description,
    openGraph: {
      title,
      description,
      type: "profile",
    },
    twitter: {
      card: "summary",
      title,
      description,
    },
  }
}

export default async function SharedProfilePage(
  { params }: { params: Promise<{ payload: string }> },
) {
  const { payload } = await params
  const resolved = resolveProfileSharePayload(payload)

  if (!resolved?.profile.foundation) {
    return (
      <div className="container stack-lg" style={{ paddingTop: "48px" }}>
        <div className="panel stack-md">
          <p className="eyebrow">Invalid shared profile</p>
          <h1>This shared profile link could not be decoded.</h1>
          <p className="muted" style={{ lineHeight: "1.65" }}>
            The URL may be incomplete, corrupted, or from an older version of the inventory.
          </p>
          <div className="row gap-sm wrap">
            <Link href="/profile" className="cta-primary">Open your Profile</Link>
            <Link href="/compare" className="cta-secondary">Compare shared profiles</Link>
            <Link href="/quiz" className="cta-secondary">Take the Foundation</Link>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="wide-container">
      <ProfileReport
        profile={resolved.profile}
        mode="shared"
        actionSlot={
          <ProfileShareActions
            payload={payload}
            headline={buildIntegratedHeadline(resolved.profile)}
          />
        }
      />
    </div>
  )
}
