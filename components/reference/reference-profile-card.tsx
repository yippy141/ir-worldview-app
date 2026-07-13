import Link from "next/link"
import {
  formatFieldDateString,
  isReferenceEntityDraft,
  referenceEntityTypeLabel,
} from "@/lib/field/items"
import { isReferenceProfileMappable } from "@/lib/reference-profiles/validation"
import type { ReferenceEntity, ReferenceProfile } from "@/lib/reference-profiles/types"

const SCOPE_LABELS: Record<string, string> = {
  foundation: "Foundation",
  security: "Security",
  technology: "Technology",
  "ai-governance": "AI governance",
}

export function referenceScopeLabel(scope: string): string {
  return SCOPE_LABELS[scope] ?? scope
}

export function ReferenceProfileCard({ entity }: { entity: ReferenceEntity }) {
  const draft = isReferenceEntityDraft(entity)
  const isMovement = entity.entityType === "movement"
  const profile = isMovement ? null : (entity as ReferenceProfile)
  const codedCount = profile
    ? profile.scope === "ai-governance"
      ? Object.keys(profile.axisEstimates).length
      : Object.keys(profile.dimensionEstimates).length
    : null
  const mappable = profile ? isReferenceProfileMappable(profile) : false

  return (
    <article className="reference-card stack-xs" role="listitem">
      <div className="reference-card__meta-row">
        <span className="reference-card__type">
          {referenceEntityTypeLabel(entity.entityType)} · {referenceScopeLabel(entity.scope)}
        </span>
        <span className="reference-card__reviewed">
          {draft ? "Research dated" : "Reviewed"} {formatFieldDateString(entity.reviewedAt)}
        </span>
      </div>
      <h3 className="reference-card__name">{entity.name}</h3>
      {profile ? (
        <p className="muted reference-card__domain">{profile.domain}</p>
      ) : null}
      <p className="reference-card__summary">
        {profile ? profile.summary : entity.scopeNote}
      </p>
      <div className="reference-card__foot">
        <span className="reference-card__coding">
          {isMovement
            ? "Constellation of member profiles"
            : mappable
              ? `${codedCount} of 7 dimensions coded`
              : profile?.scope === "ai-governance"
                ? `${codedCount} AI axes coded · list only`
                : "Reading card · no map position"}
        </span>
        <Link href={`/explore/reference/${entity.id}`} className="reference-card__link">
          Read the profile →
        </Link>
      </div>
      {draft ? (
        <p className="reference-draft-tag">Research draft · pending editorial review</p>
      ) : null}
    </article>
  )
}
