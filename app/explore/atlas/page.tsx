import Link from "next/link"
import { Suspense } from "react"
import { FieldExplorer } from "@/components/field/field-explorer"
import type { Metadata } from "next"

export const metadata: Metadata = {
  title: "Field Explorer — IR Worldview Inventory",
  description:
    "A layered field map: your saved profile, recurring Atlas patterns, Perspective Runs, and evidence-coded reference profiles on one shared projection.",
}

export default function FieldExplorerPage() {
  return (
    <div className="wide-container">
      <div className="article-header stack-md">
        <div className="stack-xs">
          <p className="eyebrow">Field</p>
          <h1>Browse the field in layers.</h1>
        </div>
        <p className="muted atlas-page-lead">
          Plot your saved profile beside recurring Atlas patterns, saved Perspective Runs, and
          evidence-coded reference profiles. Two layers can be active at once. Every point on the
          map also appears in the list.
        </p>
        <p className="muted atlas-page-intro__note">
          Atlas patterns are authored reading aids that describe recurring answer patterns in the
          current model. Reference profiles are coded public postures with cited sources. Some
          traditions and strategic cultures are still under-modeled — see{" "}
          <Link href="/method">Methods</Link>.
        </p>
      </div>

      <Suspense
        fallback={
          <div className="panel field-map-panel__loading-panel">
            <p className="muted">Loading the field…</p>
          </div>
        }
      >
        <FieldExplorer />
      </Suspense>

      <div className="result-section stack-sm atlas-page-actions">
        <p className="eyebrow">Continue</p>
        <div className="row gap-sm wrap">
          <Link href="/quiz" className="cta-primary">Take the Foundation</Link>
          <Link href="/perspectives" className="cta-secondary">Try another vantage point</Link>
          <Link href="/explore/reference" className="cta-secondary">Browse reference profiles</Link>
          <Link href="/profile" className="cta-secondary">View Profile</Link>
        </div>
      </div>
    </div>
  )
}
