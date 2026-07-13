import { dimensionLabels } from "@/lib/quiz-schema"
import type {
  CodedEstimate,
  EvidenceSupport,
  ReferenceProfile,
  ReferenceSource,
} from "@/lib/reference-profiles/types"
import type { DimensionKey } from "@/lib/types"

const SUPPORT_DOTS: Record<EvidenceSupport, string> = {
  strong: "●●●",
  partial: "●●○",
  sparse: "●○○",
}

const SOURCE_KIND_LABELS: Record<ReferenceSource["kind"], string> = {
  "enacted-policy": "Enacted policy",
  "official-statement": "Official statement",
  "canonical-work": "Canonical work",
  "documented-reporting": "Documented reporting",
  "expert-dataset": "Expert dataset",
  "analyst-interpretation": "Analyst interpretation",
}

export function sourceKindLabel(kind: ReferenceSource["kind"]): string {
  return SOURCE_KIND_LABELS[kind]
}

export function SupportBadge({ support }: { support: EvidenceSupport }) {
  return (
    <span className={`reference-support reference-support--${support}`}>
      <span aria-hidden="true">{SUPPORT_DOTS[support]}</span> {support}
    </span>
  )
}

type Props = {
  profile: ReferenceProfile
  sources: readonly ReferenceSource[]
}

/**
 * Support-by-dimension rows for an IR reference profile. Each row opens an
 * evidence disclosure scoped to that dimension: the coding note first, then
 * the cited items with their source lines.
 */
export function ReferenceEvidenceByDimension({ profile, sources }: Props) {
  if (profile.scope === "ai-governance") return null

  const sourceById = new Map(sources.map((source) => [source.id, source]))
  const dimensionKeys = Object.keys(dimensionLabels) as DimensionKey[]

  return (
    <div className="reference-dimensions">
      {dimensionKeys.map((dimension) => {
        const estimate: CodedEstimate | undefined = profile.dimensionEstimates[dimension]

        if (!estimate) {
          return (
            <div key={dimension} className="reference-dimension-row reference-dimension-row--uncoded">
              <div className="reference-dimension-row__head">
                <span className="reference-dimension-row__label">{dimensionLabels[dimension]}</span>
                <span className="muted reference-dimension-row__none">No coded position</span>
              </div>
            </div>
          )
        }

        const evidenceItems = profile.evidence.filter((item) =>
          item.dimensionKeys.includes(dimension),
        )

        return (
          <details key={dimension} className="reference-dimension-row" id={`evidence-${dimension}`}>
            <summary className="reference-dimension-row__head">
              <span className="reference-dimension-row__label">{dimensionLabels[dimension]}</span>
              <SupportBadge support={estimate.support} />
            </summary>
            <div className="reference-dimension-row__body stack-sm">
              <p className="reference-dimension-row__note">{estimate.note}</p>
              {evidenceItems.length > 0 ? (
                <ul className="reference-evidence-list">
                  {evidenceItems.map((item) => {
                    const source = sourceById.get(item.sourceId)
                    return (
                      <li key={item.id} className="reference-evidence-item stack-xs">
                        <p className="reference-evidence-item__note">{item.note}</p>
                        {source ? (
                          <p className="reference-evidence-item__source">
                            {sourceKindLabel(source.kind)} · Tier {source.tier} ·{" "}
                            <a href={source.url} target="_blank" rel="noopener noreferrer">
                              {source.title}
                              <span aria-hidden="true"> ↗</span>
                            </a>{" "}
                            ({source.publisher}, {source.publishedAt.slice(0, 4)})
                          </p>
                        ) : null}
                      </li>
                    )
                  })}
                </ul>
              ) : (
                <p className="muted reference-evidence-item__source">
                  Evidence for this dimension is cited in the source ledger below.
                </p>
              )}
            </div>
          </details>
        )
      })}
    </div>
  )
}
