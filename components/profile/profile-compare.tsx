import Link from "next/link"
import { AtlasFingerprint } from "@/components/atlas/atlas-fingerprint"
import { AtlasPatternFamily } from "@/components/atlas/atlas-pattern-family"
import { getAtlasPatternHref, matchAtlasLiteProfile } from "@/lib/atlas-lite"
import { buildIntegratedHeadline } from "@/lib/profile-helpers"
import { buildProfileComparison } from "@/lib/profile-compare"
import type { ResolvedProfileShare } from "@/lib/profile-share"
import type { ModuleSnapshot } from "@/lib/profile-store"

type Props = {
  left: ResolvedProfileShare
  right: ResolvedProfileShare
  leftPayload: string
  rightPayload: string
}

export function ProfileCompare({ left, right, leftPayload, rightPayload }: Props) {
  const comparison = buildProfileComparison(left.profile, right.profile)
  const leftHeadline = buildIntegratedHeadline(left.profile)
  const rightHeadline = buildIntegratedHeadline(right.profile)
  const leftAtlas = matchAtlasLiteProfile({
    foundation: left.profile.foundation!,
    profileState: left.assessment.state,
    moduleSnapshots: Object.values(left.profile.modules).filter(
      (snapshot): snapshot is ModuleSnapshot => Boolean(snapshot),
    ),
  })
  const rightAtlas = matchAtlasLiteProfile({
    foundation: right.profile.foundation!,
    profileState: right.assessment.state,
    moduleSnapshots: Object.values(right.profile.modules).filter(
      (snapshot): snapshot is ModuleSnapshot => Boolean(snapshot),
    ),
  })

  return (
    <section className="stack-lg">
      <section className="compare-summary-grid">
        <article className="panel stack-sm">
          <p className="eyebrow">Left profile</p>
          <h2 style={{ marginBottom: 0 }}>{leftHeadline}</h2>
          <p className="muted" style={{ lineHeight: "1.65", marginBottom: 0 }}>
            {left.assessment.summary}
          </p>
          <p style={{ marginBottom: 0 }}>
            <Link href={`/profile/share/${leftPayload}`} style={{ color: "var(--accent)" }}>
              Open shared profile →
            </Link>
          </p>
        </article>

        <article className="panel stack-sm">
          <p className="eyebrow">Right profile</p>
          <h2 style={{ marginBottom: 0 }}>{rightHeadline}</h2>
          <p className="muted" style={{ lineHeight: "1.65", marginBottom: 0 }}>
            {right.assessment.summary}
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
            This is the cleanest shared reference point before the domain overlays are added back in.
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

      <section className="compare-summary-grid">
        <article className="atlas-pattern-card stack-sm">
          <div className="stack-xs">
            <p className="eyebrow">Left Atlas pattern</p>
            <h2 style={{ marginBottom: 0 }}>{leftAtlas.nearest.name}</h2>
            <AtlasPatternFamily pattern={leftAtlas.nearest} compact />
            <p className="muted" style={{ lineHeight: "1.65", fontSize: "0.92rem" }}>
              {leftAtlas.nearest.cardSummary}
            </p>
          </div>
          <AtlasFingerprint fingerprint={leftAtlas.nearest.fingerprint} compact />
          <div className="atlas-inline-links">
            <Link href={getAtlasPatternHref(leftAtlas.nearest.id)} style={{ color: "var(--accent)" }}>
              Read pattern
            </Link>
            {leftAtlas.neighbors.map((pattern) => (
              <Link key={pattern.id} href={getAtlasPatternHref(pattern.id)} style={{ color: "var(--accent)" }}>
                {pattern.name}
              </Link>
            ))}
          </div>
        </article>

        <article className="atlas-pattern-card stack-sm">
          <div className="stack-xs">
            <p className="eyebrow">Right Atlas pattern</p>
            <h2 style={{ marginBottom: 0 }}>{rightAtlas.nearest.name}</h2>
            <AtlasPatternFamily pattern={rightAtlas.nearest} compact />
            <p className="muted" style={{ lineHeight: "1.65", fontSize: "0.92rem" }}>
              {rightAtlas.nearest.cardSummary}
            </p>
          </div>
          <AtlasFingerprint fingerprint={rightAtlas.nearest.fingerprint} compact />
          <div className="atlas-inline-links">
            <Link href={getAtlasPatternHref(rightAtlas.nearest.id)} style={{ color: "var(--accent)" }}>
              Read pattern
            </Link>
            {rightAtlas.neighbors.map((pattern) => (
              <Link key={pattern.id} href={getAtlasPatternHref(pattern.id)} style={{ color: "var(--accent)" }}>
                {pattern.name}
              </Link>
            ))}
          </div>
        </article>
      </section>
    </section>
  )
}
