import Link from "next/link"
import { ReferenceProfileCard } from "@/components/reference/reference-profile-card"
import { getVisibleReferenceEntities } from "@/lib/field/items"
import { REFERENCE_PROFILE_CATALOG } from "@/lib/reference-profiles/catalog"
import type { Metadata } from "next"

export const metadata: Metadata = {
  title: "Reference profiles — IR Worldview Inventory",
  description:
    "Evidence-coded public postures of thinkers, doctrines, and governance currents, placed in the same field as the Foundation.",
}

export default function ReferenceBrowsePage() {
  const entities = getVisibleReferenceEntities()
  const hasDrafts = entities.length > 0 && REFERENCE_PROFILE_CATALOG.dataStatus !== "public"

  return (
    <div className="wide-container">
      <div className="article-header stack-md">
        <div className="stack-xs">
          <p className="eyebrow">Reference profiles</p>
          <h1>Evidence-coded public postures</h1>
        </div>
        <p className="muted atlas-page-lead">
          Each profile codes a public posture from cited sources: enacted policy, official
          statements, and canonical work. Every entry shows its scope, record date, evidence
          support, and open disputes.
        </p>
      </div>

      {hasDrafts ? (
        <div className="reference-draft-banner stack-xs">
          <p className="reference-draft-tag">Research preview</p>
          <p className="muted reference-draft-banner__note">
            {REFERENCE_PROFILE_CATALOG.notice}
          </p>
        </div>
      ) : null}

      {entities.length > 0 ? (
        <div className="reference-card-grid" role="list">
          {entities.map((entity) => (
            <ReferenceProfileCard key={entity.id} entity={entity} />
          ))}
        </div>
      ) : (
        <section className="panel stack-sm">
          <p className="eyebrow">Nothing published yet</p>
          <p className="muted">
            Reference profiles appear here once they pass independent editorial review.
          </p>
        </section>
      )}

      <div className="result-section stack-sm atlas-page-actions">
        <p className="eyebrow">Continue</p>
        <div className="row gap-sm wrap">
          <Link href="/explore/atlas?layers=my-profile,reference-profiles" className="cta-primary">
            Open the Field Explorer
          </Link>
          <Link href="/method" className="cta-secondary">Coding method</Link>
          <Link href="/perspectives" className="cta-secondary">Try another vantage point</Link>
        </div>
      </div>
    </div>
  )
}
