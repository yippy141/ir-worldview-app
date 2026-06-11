import Link from "next/link"
import { ProfileCompare } from "@/components/profile/profile-compare"
import {
  normalizeProfileShareInput,
  resolveProfileSharePayload,
} from "@/lib/profile-share"
import type { Metadata } from "next"

export const metadata: Metadata = {
  title: "Compare Profiles — IR Worldview Inventory",
  description:
    "Compare two shared IR Worldview profiles side by side without creating an account or saving anything to a backend.",
}

export default async function ComparePage(
  {
    searchParams,
  }: {
    searchParams: Promise<Record<string, string | string[] | undefined>>
  },
) {
  const params = await searchParams
  const rawLeft = firstValue(params.left)
  const rawRight = firstValue(params.right)
  const leftPayload = rawLeft ? normalizeProfileShareInput(rawLeft) : null
  const rightPayload = rawRight ? normalizeProfileShareInput(rawRight) : null
  const leftResolved = leftPayload ? resolveProfileSharePayload(leftPayload) : null
  const rightResolved = rightPayload ? resolveProfileSharePayload(rightPayload) : null
  const attemptedCompare = Boolean(rawLeft || rawRight)
  const invalidInput = attemptedCompare && (!leftResolved || !rightResolved)

  return (
    <div className="wide-container">
      <div className="article-header stack-sm">
        <p className="eyebrow">Compare</p>
        <h1>Compare two shared profiles</h1>
        <p className="muted" style={{ lineHeight: "1.72", fontSize: "1.02rem", maxWidth: "760px" }}>
          Paste two shared-profile links or payloads. The page compares the two read-only profiles
          by naming the argument they would probably have, then showing the detailed deltas without
          a backend, account system, or compatibility score.
        </p>
      </div>

      <form className="panel stack-md compare-input-panel" action="/compare" method="get">
        <div className="compare-form-grid">
          <label className="stack-xs">
            <span style={{ fontWeight: 600 }}>Left profile link or payload</span>
            <textarea
              name="left"
              defaultValue={rawLeft}
              className="compare-textarea"
              placeholder="https://.../profile/share/..."
            />
          </label>
          <label className="stack-xs">
            <span style={{ fontWeight: 600 }}>Right profile link or payload</span>
            <textarea
              name="right"
              defaultValue={rawRight}
              className="compare-textarea"
              placeholder="https://.../profile/share/..."
            />
          </label>
        </div>
        <div className="row gap-sm wrap">
          <button type="submit" className="primary-button">Compare profiles</button>
          <Link href="/profile" className="secondary-button">
            Open your Profile
          </Link>
        </div>
      </form>

      {invalidInput ? (
        <div className="panel stack-sm" style={{ marginTop: "28px" }}>
          <p className="eyebrow">Could not compare</p>
          <h2 style={{ marginBottom: 0 }}>One or both shared profiles could not be decoded.</h2>
          <p className="muted" style={{ lineHeight: "1.65", marginBottom: 0 }}>
            Paste the full shared-profile link or just the payload segment from a URL that looks
            like <code>/profile/share/&lt;payload&gt;</code>.
          </p>
        </div>
      ) : null}

      {leftResolved && rightResolved && leftPayload && rightPayload ? (
        <div style={{ marginTop: "28px" }}>
          <ProfileCompare
            left={leftResolved}
            right={rightResolved}
            leftPayload={leftPayload}
            rightPayload={rightPayload}
          />
        </div>
      ) : null}
    </div>
  )
}

function firstValue(value: string | string[] | undefined) {
  if (Array.isArray(value)) {
    return value[0] ?? ""
  }

  return value ?? ""
}
