import Link from "next/link"
import { FieldMap } from "@/components/field/field-map"
import {
  ReferenceEvidenceByDimension,
  SupportBadge,
  sourceKindLabel,
} from "@/components/reference/reference-evidence-drawer"
import { referenceScopeLabel } from "@/components/reference/reference-profile-card"
import {
  formatFieldDateString,
  getMovementMemberPositions,
  getVisibleReferenceEntityById,
  isReferenceEntityDraft,
  referenceEntityTypeLabel,
} from "@/lib/field/items"
import { calculateMovementHull } from "@/lib/field/position"
import { aiAxisLabels } from "@/lib/ai-governance-schema"
import { REFERENCE_PROFILE_CATALOG } from "@/lib/reference-profiles/catalog"
import {
  getReferenceProfilePosition,
  REFERENCE_AI_AXIS_KEYS,
} from "@/lib/reference-profiles/validation"
import type {
  ReferenceMovement,
  ReferenceProfile,
} from "@/lib/reference-profiles/types"
import { getVisibleReferenceEntities } from "@/lib/field/items"
import type { Metadata } from "next"

export function generateStaticParams() {
  return getVisibleReferenceEntities().map((entity) => ({ id: entity.id }))
}

export async function generateMetadata(
  { params }: { params: Promise<{ id: string }> },
): Promise<Metadata> {
  const { id } = await params
  const entity = getVisibleReferenceEntityById(id)
  const title = entity
    ? `${entity.name} — Reference profile`
    : "Reference profile — IR Worldview Inventory"

  return {
    title,
    description: entity
      ? `Evidence-coded public posture: ${entity.name}.`
      : "Browse evidence-coded reference profiles in the IR Worldview field.",
  }
}

export default async function ReferenceDetailPage(
  { params }: { params: Promise<{ id: string }> },
) {
  const { id } = await params
  const entity = getVisibleReferenceEntityById(id)

  if (!entity) {
    return (
      <div className="container stack-lg">
        <div className="panel stack-md">
          <p className="eyebrow">Reference profile</p>
          <h1>This profile is unavailable.</h1>
          <p className="muted">
            The link may be outdated, or the profile may have been withdrawn for re-coding.
          </p>
          <div className="row gap-sm wrap">
            <Link href="/explore/reference" className="cta-primary">Browse reference profiles</Link>
            <Link href="/explore/atlas" className="cta-secondary">Open the Field Explorer</Link>
          </div>
        </div>
      </div>
    )
  }

  if (entity.entityType === "movement") {
    return <MovementDetail movement={entity} />
  }

  return <ProfileDetail profile={entity as ReferenceProfile} />
}

function DraftNotice({ draft }: { draft: boolean }) {
  if (!draft) return null
  return (
    <div className="reference-draft-banner stack-xs">
      <p className="reference-draft-tag">Research draft · pending editorial review</p>
      <p className="muted reference-draft-banner__note">
        {REFERENCE_PROFILE_CATALOG.notice}
      </p>
    </div>
  )
}

function CorrectionsLine({ entityId }: { entityId: string }) {
  return (
    <p className="muted reference-corrections">
      See an error in this coding? Send the source and the disputed dimension through{" "}
      <Link href={`/feedback?reference=${encodeURIComponent(entityId)}`}>the feedback page</Link>.
      Accepted corrections appear under Revisions.
    </p>
  )
}

function ProfileDetail({ profile }: { profile: ReferenceProfile }) {
  const draft = isReferenceEntityDraft(profile)
  const position = getReferenceProfilePosition(profile)
  const sources = profile.sourceIds
    .map((sourceId) =>
      REFERENCE_PROFILE_CATALOG.sources.find((source) => source.id === sourceId),
    )
    .filter((source): source is NonNullable<typeof source> => Boolean(source))
    .sort((left, right) => left.tier - right.tier)

  return (
    <div className="wide-container">
      <article className="result-article reference-detail">
        <header className="article-header stack-sm">
          <p className="eyebrow">
            Reference profile · {referenceEntityTypeLabel(profile.entityType)}
          </p>
          <h1>{profile.name}</h1>
          <p className="muted reference-detail__domain">{profile.domain}</p>
        </header>

        <DraftNotice draft={draft} />

        <section className="result-section stack-sm" aria-labelledby="reference-posture-heading">
          <p className="eyebrow" id="reference-posture-heading">Public posture</p>
          <p className="reference-detail__summary">{profile.summary}</p>
          <p className="muted reference-detail__scope-note">{profile.scopeNote}</p>
        </section>

        <div className="reference-record-strip" aria-label="Coding record">
          <span>Scope: {referenceScopeLabel(profile.scope)}</span>
          <span>
            Evidence window: {profile.evidenceWindow.start?.slice(0, 4) ?? "…"}–
            {profile.evidenceWindow.end.slice(0, 4)}
          </span>
          <span>
            {draft ? "Research dated" : "Reviewed"} {formatFieldDateString(profile.reviewedAt)}
          </span>
          <span>Version {profile.version}</span>
        </div>

        <section className="result-section stack-md" aria-labelledby="reference-position-heading">
          <div className="stack-xs">
            <p className="eyebrow" id="reference-position-heading">Position in the field</p>
          </div>
          {profile.scope === "ai-governance" ? (
            <p className="muted reference-detail__map-note">
              AI-governance profiles use their own axes. This profile appears in lists and on the
              AI axis readout below. It has no position on the IR field map.
            </p>
          ) : position ? (
            <div className="panel result-panel reference-detail__map">
              <FieldMap
                ariaLabel={`Field map placing the coded public posture of ${profile.name} among the four modeled traditions.`}
                markers={[
                  {
                    key: profile.id,
                    kind: "reference-profile",
                    entityType: profile.entityType,
                    label: profile.shortName,
                    position,
                    labeled: true,
                  },
                ]}
                caption="The mark is the coded public posture, computed through the same projection as every Foundation result."
              />
            </div>
          ) : (
            <p className="muted reference-detail__map-note">
              This profile appears as a reading card. A map position requires all seven Foundation
              dimensions, linked evidence, and a completed second-person review.
            </p>
          )}
        </section>

        <section className="result-section stack-md" aria-labelledby="reference-support-heading">
          <div className="stack-xs">
            <p className="eyebrow" id="reference-support-heading">Evidence</p>
            <h2>Support by dimension</h2>
            <p className="muted reference-detail__section-note">
              Open a dimension to read the coding note and the cited evidence. Raw coding
              coefficients stay in the <Link href="/method">Methods</Link> record.
            </p>
          </div>
          {profile.scope === "ai-governance" ? (
            <div className="reference-dimensions">
              {REFERENCE_AI_AXIS_KEYS.map((axis) => {
                const estimate = profile.axisEstimates[axis]
                if (!estimate) {
                  return (
                    <div key={axis} className="reference-dimension-row reference-dimension-row--uncoded">
                      <div className="reference-dimension-row__head">
                        <span className="reference-dimension-row__label">{aiAxisLabels[axis]}</span>
                        <span className="muted reference-dimension-row__none">No coded position</span>
                      </div>
                    </div>
                  )
                }
                return (
                  <div key={axis} className="reference-dimension-row">
                    <div className="reference-dimension-row__head">
                      <span className="reference-dimension-row__label">{aiAxisLabels[axis]}</span>
                      <SupportBadge support={estimate.support} />
                    </div>
                    <p className="reference-dimension-row__note-inline">{estimate.note}</p>
                  </div>
                )
              })}
            </div>
          ) : (
            <ReferenceEvidenceByDimension
              profile={profile}
              sources={REFERENCE_PROFILE_CATALOG.sources}
            />
          )}
        </section>

        <section className="result-section stack-md" aria-labelledby="reference-sources-heading">
          <div className="stack-xs">
            <p className="eyebrow" id="reference-sources-heading">Sources</p>
            <h2>Source ledger</h2>
          </div>
          <ol className="reference-source-ledger">
            {sources.map((source) => (
              <li key={source.id} className="reference-source-row">
                <span className="reference-source-row__kind">
                  {sourceKindLabel(source.kind)} · Tier {source.tier}
                </span>
                <span className="reference-source-row__work">
                  <a href={source.url} target="_blank" rel="noopener noreferrer">
                    {source.title}
                    <span aria-hidden="true"> ↗</span>
                  </a>
                  {source.author ? ` — ${source.author}` : ""}
                </span>
                <span className="muted reference-source-row__pub">
                  {source.publisher}, {source.publishedAt.slice(0, 4)}
                </span>
              </li>
            ))}
          </ol>
        </section>

        <section className="result-section stack-md" aria-labelledby="reference-disputes-heading">
          <div className="stack-xs">
            <p className="eyebrow" id="reference-disputes-heading">Disputed readings</p>
          </div>
          {profile.disputes.length > 0 ? (
            <ul className="content-list reference-disputes">
              {profile.disputes.map((dispute, index) => (
                <li key={index}>{dispute}</li>
              ))}
            </ul>
          ) : (
            <p className="muted">No coded disputes on file for this evidence window.</p>
          )}
        </section>

        <section className="result-section stack-md" aria-labelledby="reference-revisions-heading">
          <div className="stack-xs">
            <p className="eyebrow" id="reference-revisions-heading">Revisions</p>
          </div>
          <ol className="reference-revisions">
            {profile.versionHistory.map((record) => (
              <li key={record.version} className="reference-revisions__row">
                <span className="reference-revisions__version">v{record.version}</span>
                <span className="reference-revisions__date">
                  {formatFieldDateString(record.changedAt)}
                </span>
                <span className="reference-revisions__note">{record.changeNote}</span>
              </li>
            ))}
          </ol>
          <CorrectionsLine entityId={profile.id} />
        </section>

        <section className="result-section stack-sm">
          <p className="eyebrow">Continue</p>
          <div className="row gap-sm wrap">
            <Link
              href={`/explore/atlas?layers=my-profile,reference-profiles&sel=${encodeURIComponent(`reference-profiles::${profile.id}`)}`}
              className="cta-secondary"
            >
              See this profile in the field
            </Link>
            <Link href="/explore/reference" className="cta-secondary">All reference profiles</Link>
            <Link href="/method" className="cta-secondary">Coding method</Link>
          </div>
        </section>
      </article>
    </div>
  )
}

function MovementDetail({ movement }: { movement: ReferenceMovement }) {
  const draft = isReferenceEntityDraft(movement)
  const members = movement.memberProfileIds
    .map((memberId) =>
      REFERENCE_PROFILE_CATALOG.profiles.find((profile) => profile.id === memberId),
    )
    .filter((profile): profile is ReferenceProfile => Boolean(profile))
  const memberPositions = getMovementMemberPositions(movement)
  const hull = calculateMovementHull(memberPositions)

  return (
    <div className="wide-container">
      <article className="result-article reference-detail">
        <header className="article-header stack-sm">
          <p className="eyebrow">Reference profile · Movement</p>
          <h1>{movement.name}</h1>
          <p className="muted reference-detail__scope-note">{movement.scopeNote}</p>
        </header>

        <DraftNotice draft={draft} />

        <div className="reference-record-strip" aria-label="Coding record">
          <span>Scope: {referenceScopeLabel(movement.scope)}</span>
          <span>
            {draft ? "Research dated" : "Reviewed"} {formatFieldDateString(movement.reviewedAt)}
          </span>
          <span>Version {movement.version}</span>
        </div>

        <section className="result-section stack-md">
          <div className="stack-xs">
            <p className="eyebrow">Member positions</p>
            <p className="muted reference-detail__section-note">
              A movement appears as a spread of nearby positions, because its members share a core
              claim and disagree at the edges.
            </p>
          </div>
          {memberPositions.length >= 2 ? (
            <div className="panel result-panel reference-detail__map">
              <FieldMap
                ariaLabel={`Field map showing the span of coded member positions for ${movement.name}.`}
                markers={members
                  .map((member) => {
                    const position = getReferenceProfilePosition(member)
                    if (!position) return null
                    return {
                      key: member.id,
                      kind: "reference-profile" as const,
                      entityType: member.entityType,
                      label: member.shortName,
                      position,
                      labeled: true,
                    }
                  })
                  .filter((marker): marker is NonNullable<typeof marker> => marker !== null)}
                hulls={[{ id: movement.id, label: movement.shortName, points: hull }]}
                caption="The outline spans the coded positions of listed members. Members disagree inside it."
              />
            </div>
          ) : (
            <p className="muted reference-detail__map-note">
              Member profiles gain map positions as their codings pass the evidence rule.
            </p>
          )}
        </section>

        <section className="result-section stack-md">
          <div className="stack-xs">
            <p className="eyebrow">Where members split</p>
          </div>
          {movement.internalDisagreements.length > 0 ? (
            <ul className="content-list reference-disputes">
              {movement.internalDisagreements.map((item, index) => (
                <li key={index}>{item}</li>
              ))}
            </ul>
          ) : (
            <p className="muted">Internal disagreements are still being coded.</p>
          )}
        </section>

        <section className="result-section stack-md">
          <div className="stack-xs">
            <p className="eyebrow">Members</p>
          </div>
          <ul className="reference-member-list">
            {members.map((member) => (
              <li key={member.id}>
                <Link href={`/explore/reference/${member.id}`}>{member.name}</Link>
                <span className="muted"> — {member.domain}</span>
              </li>
            ))}
          </ul>
          <CorrectionsLine entityId={movement.id} />
        </section>

        <section className="result-section stack-sm">
          <p className="eyebrow">Continue</p>
          <div className="row gap-sm wrap">
            <Link href="/explore/reference" className="cta-secondary">All reference profiles</Link>
            <Link href="/explore/atlas" className="cta-secondary">Open the Field Explorer</Link>
          </div>
        </section>
      </article>
    </div>
  )
}
