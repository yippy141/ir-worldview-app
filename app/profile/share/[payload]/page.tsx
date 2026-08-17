import { ProfileReport } from "@/components/profile/profile-report"
import { ProfileShareActions } from "@/components/profile/profile-share-actions"
import { resolveFoundationArchetypeFromSnapshot } from "@/lib/profile-foundation-identity"
import { resolveProfileSharePayload } from "@/lib/profile-share"
import type { Metadata } from "next"
import Link from "next/link"

export async function generateMetadata(
  { params }: { params: Promise<{ payload: string }> },
): Promise<Metadata> {
  const { payload } = await params
  const resolved = resolveProfileSharePayload(payload)

  if (!resolved) {
    const title = "Shared Profile — IR Worldview Inventory"
    const description =
      "Open a shared IR Worldview Profile, or create your own Foundation result and saved profile layers."

    return buildProfileMetadata(title, description, payload)
  }

  const foundation = resolved.profile.foundation
  const archetype = foundation
    ? resolveFoundationArchetypeFromSnapshot(foundation)
    : null
  const title = archetype
    ? `${archetype.name} profile — IR Worldview Inventory`
    : "Foundation result unavailable — Shared Profile"
  const description = archetype
    ? `Shared Foundation profile: ${archetype.name}. ${archetype.gloss}`
    : "This shared Profile preserves its saved results, but its Foundation payload cannot be resolved and no Foundation reading is inferred."

  return buildProfileMetadata(title, description, payload)
}

function buildProfileMetadata(
  title: string,
  description: string,
  payload: string,
): Metadata {
  const englishPath = `/profile/share/${payload}`
  const chinesePath = `/zh${englishPath}`
  return {
    title,
    description,
    robots: { index: false, follow: false },
    alternates: {
      canonical: englishPath,
      languages: {
        en: englishPath,
        "zh-Hans": chinesePath,
        "x-default": englishPath,
      },
    },
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

  if (!resolved) {
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
  const foundationArchetype = resolved.profile.foundation
    ? resolveFoundationArchetypeFromSnapshot(resolved.profile.foundation)
    : null

  return (
    <div className="wide-container">
      <ProfileReport
        profile={resolved.profile}
        mode="shared"
        foundationRecord={
          resolved.foundationStatus === "unavailable"
            ? resolved.foundationRecord
            : undefined
        }
        actionSlot={
          <ProfileShareActions
            payload={payload}
            headline={
              foundationArchetype?.name ?? "Foundation result unavailable"
            }
          />
        }
      />
    </div>
  )
}
