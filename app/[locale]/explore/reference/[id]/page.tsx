import type { Metadata } from "next"
import { ZhHansFieldMap } from "@/components/field/zh-hans-field-map"
import { zhHansReferenceProfilesUi as copy } from "@/content/locales/zh-Hans/reference-profiles-ui"
import { chineseShellContent } from "@/content/locales/zh-Hans"
import { formatLocalizedDate } from "@/i18n/format"
import { createDynamicLocalizedMetadata } from "@/i18n/metadata"
import { Link } from "@/i18n/navigation"
import { getVisibleReferenceEntities, getVisibleReferenceEntityById, isReferenceEntityDraft } from "@/lib/field/items"
import { REFERENCE_PROFILE_CATALOG } from "@/lib/reference-profiles/catalog"
import { getReferenceProfilePosition, REFERENCE_DIMENSION_KEYS } from "@/lib/reference-profiles/validation"
import type { ReferenceProfile } from "@/lib/reference-profiles/types"

export function generateStaticParams() {
  return getVisibleReferenceEntities().map((entity) => ({ id: entity.id }))
}

export async function generateMetadata({ params }: { params: Promise<{ id: string }> }): Promise<Metadata> {
  const { id } = await params
  const entity = getVisibleReferenceEntityById(id)
  return createDynamicLocalizedMetadata("zh-Hans", `/explore/reference/${id}`, {
    title: entity ? copy.metadata.detailTitle(entity.name) : copy.metadata.title,
    description: entity ? copy.metadata.detailDescription(entity.name) : copy.metadata.description,
  })
}

export default async function ChineseReferenceDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params
  const entity = getVisibleReferenceEntityById(id)

  if (!entity || entity.entityType === "movement") {
    return (
      <div className="container stack-lg">
        <div className="panel stack-md">
          <p className="eyebrow">{copy.unavailable.eyebrow}</p>
          <h1>{copy.unavailable.title}</h1>
          <p className="muted">{copy.unavailable.body}</p>
          <div className="row gap-sm wrap">
            <Link href="/explore/reference" className="cta-primary">{copy.unavailable.browse}</Link>
            <Link href="/explore/atlas" className="cta-secondary">{copy.unavailable.openMap}</Link>
          </div>
        </div>
      </div>
    )
  }

  const profile = entity as ReferenceProfile
  const draft = isReferenceEntityDraft(profile)
  const position = getReferenceProfilePosition(profile)
  const sources = profile.sourceIds.flatMap((sourceId) => {
    const source = REFERENCE_PROFILE_CATALOG.sources.find((candidate) => candidate.id === sourceId)
    return source ? [source] : []
  }).sort((left, right) => left.tier - right.tier)

  return (
    <div className="wide-container">
      <article className="result-article reference-detail">
        <header className="article-header stack-sm">
          <p className="eyebrow">{copy.detail.eyebrow(copy.entityTypes[profile.entityType])}</p>
          <h1 lang="en">{profile.name}</h1>
        </header>

        {draft ? <p className="reference-draft-tag">{copy.cards.draft}</p> : null}

        <div className="reference-record-strip" aria-label={copy.detail.codingRecordAria}>
          <span>{copy.detail.scope}：{copy.scopes[profile.scope]}</span>
          <span>{copy.detail.evidenceWindow}：{profile.evidenceWindow.start?.slice(0, 4) ?? "…"}—{profile.evidenceWindow.end.slice(0, 4)}</span>
          <span>{draft ? copy.detail.researchDated : copy.detail.reviewed}：{formatLocalizedDate(profile.reviewedAt, "zh-Hans")}</span>
          <span>{copy.detail.version}：{profile.version}</span>
        </div>

        <aside className="callout stack-xs" role="note">
          <p className="eyebrow">{copy.detail.publicPosture}</p>
          <p>{copy.detail.translationBoundary}</p>
        </aside>

        <section className="result-section stack-md" aria-labelledby="zh-reference-position">
          <p className="eyebrow" id="zh-reference-position">{copy.detail.position}</p>
          {position ? (
            <div className="panel result-panel reference-detail__map">
              <ZhHansFieldMap
                ariaLabel={`${profile.name} 的按来源编码公开立场在世界观地图中的位置。`}
                markers={[{ key: profile.id, kind: "reference-profile", entityType: profile.entityType, label: profile.shortName, position, labeled: true }]}
                caption={copy.detail.mapCaption}
              />
            </div>
          ) : <p className="muted">{copy.detail.readingCardNote}</p>}
        </section>

        <section className="result-section stack-md" aria-labelledby="zh-reference-support">
          <div className="stack-xs">
            <p className="eyebrow">{copy.detail.evidence}</p>
            <h2 id="zh-reference-support">{copy.detail.supportByDimension}</h2>
            <p className="muted">{copy.detail.supportIntro}</p>
          </div>
          {profile.scope !== "ai-governance" ? (
            <div className="reference-dimensions">
              {REFERENCE_DIMENSION_KEYS.map((key) => {
                const estimate = profile.dimensionEstimates[key]
                return (
                  <div key={key} className="reference-dimension-row">
                    <div className="reference-dimension-row__head">
                      <span className="reference-dimension-row__label">{chineseShellContent.methods.dimensions[key].heading}</span>
                      <span className="atlas-tag">{estimate ? copy.support[estimate.support] : copy.detail.noCodedPosition}</span>
                    </div>
                  </div>
                )
              })}
            </div>
          ) : <p className="muted">{copy.detail.aiMapNote}</p>}
        </section>

        <section className="result-section stack-md" aria-labelledby="zh-reference-sources">
          <div className="stack-xs">
            <p className="eyebrow">{copy.detail.sources}</p>
            <h2 id="zh-reference-sources">{copy.detail.sourceLedger}</h2>
            <p className="muted">{copy.detail.sourceTitleRule}</p>
          </div>
          <ol className="reference-source-ledger">
            {sources.map((source) => (
              <li key={source.id} className="reference-source-row">
                <span className="reference-source-row__kind">{copy.sourceKinds[source.kind]} · {copy.detail.sourceTier(source.tier)}</span>
                <span className="reference-source-row__work">
                  <span>{copy.detail.originalTitle}：</span>{" "}
                  <a href={source.url} target="_blank" rel="noopener noreferrer" lang="en">{source.title}<span aria-hidden="true"> ↗</span></a>
                  {source.author ? <span lang="en"> — {source.author}</span> : null}
                </span>
                <span className="muted reference-source-row__pub"><span lang="en">{source.publisher}</span> · {formatLocalizedDate(source.publishedAt, "zh-Hans")}</span>
              </li>
            ))}
          </ol>
        </section>

        <section className="result-section stack-sm">
          <p className="eyebrow">{copy.detail.continue}</p>
          <div className="row gap-sm wrap">
            <Link href={`/explore/atlas?layers=my-profile,reference-profiles&sel=${encodeURIComponent(`reference-profiles::${profile.id}`)}`} className="cta-secondary">{copy.detail.seeInField}</Link>
            <Link href="/explore/reference" className="cta-secondary">{copy.detail.allProfiles}</Link>
            <Link href="/method" className="cta-secondary">{copy.detail.codingMethod}</Link>
          </div>
        </section>
      </article>
    </div>
  )
}
