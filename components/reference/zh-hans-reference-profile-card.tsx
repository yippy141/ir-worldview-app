import { Link } from "@/i18n/navigation"
import { zhHansReferenceProfilesUi as copy } from "@/content/locales/zh-Hans/reference-profiles-ui"
import { formatLocalizedDate } from "@/i18n/format"
import { isReferenceEntityDraft } from "@/lib/field/items"
import { isReferenceProfileMappable } from "@/lib/reference-profiles/validation"
import type { ReferenceEntity, ReferenceProfile } from "@/lib/reference-profiles/types"

export function ZhHansReferenceProfileCard({ entity }: { entity: ReferenceEntity }) {
  const draft = isReferenceEntityDraft(entity)
  const profile = entity.entityType === "movement" ? null : entity as ReferenceProfile
  const count = profile
    ? profile.scope === "ai-governance"
      ? Object.keys(profile.axisEstimates).length
      : Object.keys(profile.dimensionEstimates).length
    : null
  const mappable = profile ? isReferenceProfileMappable(profile) : false

  return (
    <article className="reference-card stack-xs" role="listitem">
      <div className="reference-card__meta-row">
        <span className="reference-card__type">
          {copy.entityTypes[entity.entityType]} · {copy.scopes[entity.scope]}
        </span>
        <span className="reference-card__reviewed">
          {draft ? copy.cards.researchDated : copy.cards.reviewed}{" "}
          {formatLocalizedDate(entity.reviewedAt, "zh-Hans")}
        </span>
      </div>
      <h3 className="reference-card__name" lang="en">{entity.name}</h3>
      <div className="reference-card__foot">
        <span className="reference-card__coding">
          {entity.entityType === "movement"
            ? copy.cards.movement
            : mappable
              ? copy.cards.dimensionsCoded(count ?? 0)
              : profile?.scope === "ai-governance"
                ? copy.cards.aiAxesCoded(count ?? 0)
                : copy.cards.readingCard}
        </span>
        <Link href={`/explore/reference/${entity.id}`} className="reference-card__link">
          {copy.cards.readProfile} →
        </Link>
      </div>
      {draft ? <p className="reference-draft-tag">{copy.cards.draft}</p> : null}
    </article>
  )
}
