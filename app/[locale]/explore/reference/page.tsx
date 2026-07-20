import type { Metadata } from "next"
import { ZhHansReferenceProfileCard } from "@/components/reference/zh-hans-reference-profile-card"
import { zhHansReferenceProfilesUi as copy } from "@/content/locales/zh-Hans/reference-profiles-ui"
import { zhHansRouteMetadata } from "@/content/locales/zh-Hans/metadata"
import { Link } from "@/i18n/navigation"
import { createDynamicLocalizedMetadata } from "@/i18n/metadata"
import { getVisibleReferenceEntities } from "@/lib/field/items"

export const metadata: Metadata = createDynamicLocalizedMetadata(
  "zh-Hans",
  "/explore/reference",
  zhHansRouteMetadata.publicPositions,
)

export default function ChineseReferenceBrowsePage() {
  const entities = getVisibleReferenceEntities()
  return (
    <div className="wide-container">
      <div className="article-header stack-md">
        <div className="stack-xs">
          <p className="eyebrow">{copy.browse.eyebrow}</p>
          <h1>{copy.browse.title}</h1>
        </div>
        <p className="muted atlas-page-lead">{copy.browse.intro}</p>
      </div>

      {entities.length > 0 ? (
        <div className="reference-card-grid" role="list">
          {entities.map((entity) => <ZhHansReferenceProfileCard key={entity.id} entity={entity} />)}
        </div>
      ) : (
        <section className="panel stack-sm">
          <p className="eyebrow">{copy.browse.emptyEyebrow}</p>
          <p className="muted">{copy.browse.emptyBody}</p>
        </section>
      )}

      <div className="result-section stack-sm atlas-page-actions">
        <p className="eyebrow">{copy.browse.continue}</p>
        <div className="row gap-sm wrap">
          <Link href="/explore/atlas?layers=my-profile,reference-profiles" className="cta-primary">
            {copy.browse.openMap}
          </Link>
          <Link href="/method" className="cta-secondary">{copy.browse.codingMethod}</Link>
          <Link href="/perspectives" locale="en" className="cta-secondary">{copy.browse.tryPerspective}</Link>
        </div>
      </div>
    </div>
  )
}
