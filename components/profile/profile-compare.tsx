import Link from "next/link"
import { normFromNormativeModifier } from "@/lib/archetypes"
import { buildProfileComparison } from "@/lib/profile-compare"
import { resolveFoundationIdentityFromSnapshot } from "@/lib/profile-foundation-identity"
import type { ResolvedProfileShare } from "@/lib/profile-share"

type Props = {
  left: ResolvedProfileShare
  right: ResolvedProfileShare
  leftPayload: string
  rightPayload: string
}

export function ProfileCompare({ left, right, leftPayload, rightPayload }: Props) {
  const comparison = buildProfileComparison(left.profile, right.profile)
  const leftFoundation = left.profile.foundation!
  const rightFoundation = right.profile.foundation!
  const leftIdentity = resolveFoundationIdentityFromSnapshot(leftFoundation)
  const rightIdentity = resolveFoundationIdentityFromSnapshot(rightFoundation)

  return (
    <section className="stack-lg">
      <section className="panel stack-md compare-argument-card" aria-labelledby="compare-argument-heading">
        <div className="stack-xs">
          <p className="eyebrow">Main disagreement</p>
          <h2 id="compare-argument-heading">The argument you would probably have.</h2>
          <p className="compare-argument-card__summary">{comparison.probableArgument.summary}</p>
        </div>

        <div className="compare-argument-grid">
          <article className="compare-argument-point stack-xs">
            <p className="eyebrow">Left starts from</p>
            <p>{comparison.probableArgument.leftStartsFrom}</p>
          </article>
          <article className="compare-argument-point stack-xs">
            <p className="eyebrow">Right starts from</p>
            <p>{comparison.probableArgument.rightStartsFrom}</p>
          </article>
          <article className="compare-argument-point compare-argument-point--wide stack-xs">
            <p className="eyebrow">Case that exposes the split</p>
            <p>{comparison.probableArgument.caseThatExposesSplit}</p>
          </article>
        </div>
      </section>

      <section className="compare-summary-grid">
        <article className="panel stack-sm">
          <p className="eyebrow">Left Foundation archetype</p>
          <h2 style={{ marginBottom: 0 }}>
            {leftIdentity?.archetype.name ?? "Foundation identity unavailable"}
          </h2>
          {leftIdentity ? (
            <p className="foundation-result-code">
              {leftIdentity.archetype.code} / {normFromNormativeModifier(leftIdentity.result.normativeModifier)}
            </p>
          ) : null}
          <p className="muted" style={{ lineHeight: "1.65", marginBottom: 0 }}>
            {leftIdentity?.archetype.gloss
              ?? "This shared Profile’s Foundation payload could not be resolved, so no identity was inferred."}
          </p>
          <p style={{ marginBottom: 0 }}>
            <Link href={`/profile/share/${leftPayload}`} style={{ color: "var(--accent)" }}>
              Open shared profile →
            </Link>
          </p>
        </article>

        <article className="panel stack-sm">
          <p className="eyebrow">Right Foundation archetype</p>
          <h2 style={{ marginBottom: 0 }}>
            {rightIdentity?.archetype.name ?? "Foundation identity unavailable"}
          </h2>
          {rightIdentity ? (
            <p className="foundation-result-code">
              {rightIdentity.archetype.code} / {normFromNormativeModifier(rightIdentity.result.normativeModifier)}
            </p>
          ) : null}
          <p className="muted" style={{ lineHeight: "1.65", marginBottom: 0 }}>
            {rightIdentity?.archetype.gloss
              ?? "This shared Profile’s Foundation payload could not be resolved, so no identity was inferred."}
          </p>
          <p style={{ marginBottom: 0 }}>
            <Link href={`/profile/share/${rightPayload}`} style={{ color: "var(--accent)" }}>
              Open shared profile →
            </Link>
          </p>
        </article>
      </section>

      <section className="panel stack-md compare-dominant-panel">
        <div className="stack-xs">
          <p className="eyebrow">Foundation spine comparison</p>
          <h2>Where the baseline lines up, and where it does not</h2>
          <p className="muted" style={{ lineHeight: "1.65", maxWidth: "760px" }}>
            This section compares Foundation dimensions only. Security and Technology differences
            below compare the same domain with itself.
          </p>
        </div>
        <div className="compare-spine-legend">
          <span className="compare-spine-legend-item">
            <span className="compare-spine-swatch compare-spine-swatch--left" />
            Left
          </span>
          <span className="compare-spine-legend-item">
            <span className="compare-spine-swatch compare-spine-swatch--right" />
            Right
          </span>
        </div>
        <div className="compare-spine-table">
          {comparison.foundationRows.map((row) => (
            <div key={row.dimension} className="compare-spine-row">
              <div className="compare-spine-label">
                <p style={{ fontWeight: 600, color: "var(--text)" }}>{row.label}</p>
              </div>
              <div className="compare-spine-scale">
                <span className="compare-spine-end">1</span>
                <div className="compare-spine-track">
                  <div
                    className="compare-spine-dot compare-spine-dot--left"
                    style={{ left: `${((row.left - 1) / 6) * 100}%` }}
                    title={`Left: ${row.left.toFixed(1)}`}
                  />
                  <div
                    className="compare-spine-dot compare-spine-dot--right"
                    style={{ left: `${((row.right - 1) / 6) * 100}%` }}
                    title={`Right: ${row.right.toFixed(1)}`}
                  />
                </div>
                <span className="compare-spine-end">7</span>
              </div>
            </div>
          ))}
        </div>
      </section>

      <section className="compare-summary-grid">
        <article className="driver-card stack-xs">
          <p className="eyebrow">Shared stable trait</p>
          <p style={{ lineHeight: "1.65", marginBottom: 0 }}>{comparison.sharedStableTrait}</p>
        </article>
        <article className="driver-card stack-xs">
          <p className="eyebrow">Biggest divergence</p>
          <p style={{ lineHeight: "1.65", marginBottom: 0 }}>{comparison.biggestDivergence}</p>
        </article>
        <article className="driver-card stack-xs">
          <p className="eyebrow">Security difference</p>
          <p style={{ lineHeight: "1.65", marginBottom: 0 }}>
            {comparison.biggestSecurityDifference
              ? comparison.biggestSecurityDifference.summary
              : "No clear Security gap stands out, or one shared profile does not include the Security module."}
          </p>
        </article>
        <article className="driver-card stack-xs">
          <p className="eyebrow">Technology difference</p>
          <p style={{ lineHeight: "1.65", marginBottom: 0 }}>
            {comparison.biggestTechnologyDifference
              ? comparison.biggestTechnologyDifference.summary
              : "No clear Technology gap stands out, or one shared profile does not include the Technology module."}
          </p>
        </article>
      </section>

    </section>
  )
}
