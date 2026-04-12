"use client"

import Link from "next/link"
import { useEffect, useState } from "react"
import { AtlasFingerprint } from "@/components/atlas/atlas-fingerprint"
import { getAtlasPatternHref, matchAtlasLiteProfile } from "@/lib/atlas-lite"
import { buildProfileNarrative } from "@/lib/narrative/profile"
import {
  loadProfileStore,
  type ModuleSnapshot,
  type ProfileStore,
} from "@/lib/profile-store"
import {
  buildIntegratedHeadline,
  buildProfileAssessment,
  buildProfileSpineRows,
} from "@/lib/profile-helpers"

const STRATEGY_LABELS = {
  Restrainer: "Restrained strategy",
  Hedger: "Conditional strategy",
  Maximizer: "Harder competitive strategy",
} as const

const NORMATIVE_LABELS = {
  Pluralist: "Order-first normative style",
  "Conditional Solidarist": "Mixed normative style",
  Universalist: "Justice-forward normative style",
} as const

const MODULE_COLORS = {
  security: "var(--accent)",
  technology: "var(--t-institutionalist)",
} as const

export function ProfileDashboard() {
  const [profile, setProfile] = useState<ProfileStore | null>(null)

  useEffect(() => {
    const load = () => setProfile(loadProfileStore())

    load()
    window.addEventListener("storage", load)
    return () => window.removeEventListener("storage", load)
  }, [])

  if (profile === null) {
    return <div className="panel" style={{ padding: "40px" }}>Loading your profile…</div>
  }

  if (!profile.foundation) {
    return (
      <div className="stack-lg">
        <section className="panel stack-md">
          <p className="eyebrow">Profile</p>
          <h1>Your integrated profile will appear here</h1>
          <p className="muted" style={{ lineHeight: "1.7", maxWidth: "720px" }}>
            Start with the Foundation. Once you generate a result, this page will combine that
            baseline with any completed focus-area modules on this device.
          </p>
          <div className="row gap-sm wrap">
            <Link href="/quiz" className="cta-primary">Take the Foundation</Link>
            <Link href="/explore" className="cta-secondary">Explore the perspectives</Link>
          </div>
        </section>
      </div>
    )
  }

  const foundation = profile.foundation
  const moduleSnapshots = Object.values(profile.modules)
    .filter((moduleSnapshot): moduleSnapshot is ModuleSnapshot => Boolean(moduleSnapshot))
    .sort((a, b) => b.timestamp - a.timestamp)
  const assessment = buildProfileAssessment(profile)
  const profileNarrative = buildProfileNarrative(profile, assessment)
  const spineRows = buildProfileSpineRows(profile)
  const atlasMatch = matchAtlasLiteProfile({
    foundation,
    profileState: assessment.state,
    moduleSnapshots,
  })
  const securitySnapshot = moduleSnapshots.find((snapshot) => snapshot.slug === "security")
  const technologySnapshot = moduleSnapshots.find((snapshot) => snapshot.slug === "technology")

  return (
    <article className="result-article">
      <section className="profile-hero stack-md">
        <div className="stack-sm">
          <p className="eyebrow">Profile</p>
          <h1>{buildIntegratedHeadline(profile)}</h1>
          <p className="muted" style={{ lineHeight: "1.75", maxWidth: "760px" }}>
            {profileNarrative.summary}
          </p>
          <div className="row gap-sm wrap" style={{ marginTop: "10px" }}>
            <span className="mode-pill">{assessment.stateLabel}</span>
            <span className="mode-pill">{foundation.familyLabel}</span>
            <span className="mode-pill">{foundation.runnerUpLabel}</span>
            <span className="mode-pill">{STRATEGY_LABELS[foundation.strategyModifier]}</span>
            <span className="mode-pill">{NORMATIVE_LABELS[foundation.normativeModifier]}</span>
          </div>
        </div>

        <section className="profile-spine-card stack-sm">
          <div className="stack-xs">
            <h2>Foundation spine with overlays</h2>
            <p className="muted" style={{ fontSize: "0.9rem", lineHeight: "1.65", maxWidth: "760px" }}>
              The baseline stays fixed. Module overlays show directional pressure on related
              dimensions; they are not recalculated Foundation scores.
            </p>
          </div>
          <ProfileSpine rows={spineRows} />
          <p className="muted" style={{ fontSize: "0.88rem", lineHeight: "1.6" }}>
            {assessment.changedMost}
          </p>
        </section>
      </section>

      <section className="result-section stack-md">
        <div className="stack-xs">
          <h2>Profile highlights</h2>
          <p className="muted" style={{ fontSize: "0.9rem", lineHeight: "1.65" }}>
            The top-line shifts and continuities in the Foundation-plus-overlay profile on this
            device.
          </p>
        </div>
        <div className="driver-grid">
          <div className="driver-card stack-xs">
            <p className="eyebrow">Security shift</p>
            <p style={{ fontWeight: 600, fontFamily: "Georgia, serif" }}>
              {securitySnapshot ? "Security overlay completed" : "Security overlay not yet saved"}
            </p>
            <p className="muted" style={{ fontSize: "0.86rem", lineHeight: "1.6" }}>
              {getModuleHighlightText(
                securitySnapshot,
                "Security has not been completed yet, so the baseline still carries the full weight here.",
              )}
            </p>
          </div>
          <div className="driver-card stack-xs">
            <p className="eyebrow">Technology shift</p>
            <p style={{ fontWeight: 600, fontFamily: "Georgia, serif" }}>
              {technologySnapshot ? "Technology overlay completed" : "Technology overlay not yet saved"}
            </p>
            <p className="muted" style={{ fontSize: "0.86rem", lineHeight: "1.6" }}>
              {getModuleHighlightText(
                technologySnapshot,
                "Technology has not been completed yet, so the baseline still carries the full weight here.",
              )}
            </p>
          </div>
          <div className="driver-card stack-xs">
            <p className="eyebrow">Stable trait</p>
            <p style={{ fontWeight: 600, fontFamily: "Georgia, serif" }}>What persists</p>
            <p className="muted" style={{ fontSize: "0.86rem", lineHeight: "1.6" }}>
              {getStableTraitText(foundation)}
            </p>
          </div>
          <div className="driver-card stack-xs">
            <p className="eyebrow">Unstable or contested trait</p>
            <p style={{ fontWeight: 600, fontFamily: "Georgia, serif" }}>Where the profile is least settled</p>
            <p className="muted" style={{ fontSize: "0.86rem", lineHeight: "1.6" }}>
              {getContestedTraitText(assessment)}
            </p>
          </div>
        </div>
      </section>

      <section className="result-section stack-md">
        <div className="stack-xs">
          <h2>Atlas</h2>
          <p className="muted" style={{ fontSize: "0.9rem", lineHeight: "1.65" }}>
            A browse map of recurring profile patterns in the model. It is an editorial guide, not
            a rarity claim or a user distribution.
          </p>
        </div>
        <div className="atlas-pattern-card atlas-pattern-card--compact stack-sm">
          <div className="stack-xs">
            <p className="eyebrow">Nearest Atlas pattern</p>
            <p style={{ fontWeight: 700, fontFamily: "Georgia, serif", fontSize: "1.05rem" }}>
              {atlasMatch.nearest.name}
            </p>
            <p className="muted" style={{ lineHeight: "1.65", fontSize: "0.9rem" }}>
              {atlasMatch.nearest.cardSummary}
            </p>
          </div>
          <AtlasFingerprint fingerprint={atlasMatch.nearest.fingerprint} compact />
          <div className="stack-xs">
            <p style={{ fontWeight: 600 }}>What usually drives it</p>
            <div className="atlas-tag-list">
              {atlasMatch.nearest.cardDrivers.map((driver) => (
                <span key={driver} className="atlas-tag">
                  {driver}
                </span>
              ))}
            </div>
          </div>
          <p className="muted atlas-pressure-note">
            <strong>Under pressure:</strong> {atlasMatch.nearest.cardPressureNote}
          </p>
          <div className="stack-xs">
            <p style={{ fontWeight: 600 }}>Nearby patterns worth opening</p>
            <div className="atlas-inline-links">
              {atlasMatch.neighbors.map((pattern) => (
                <Link key={pattern.id} href={getAtlasPatternHref(pattern.id)} style={{ color: "var(--accent)" }}>
                  {pattern.name}
                </Link>
              ))}
              <Link href={getAtlasPatternHref(atlasMatch.nearest.id)} style={{ color: "var(--accent)" }}>
                Read this pattern
              </Link>
              <Link href="/explore/atlas" style={{ color: "var(--accent)" }}>
                Open Atlas
              </Link>
            </div>
          </div>
        </div>
      </section>

      <section className="result-section stack-md">
        <div className="stack-xs">
          <h2>Integrated interpretation</h2>
          <p className="muted" style={{ fontSize: "0.9rem", lineHeight: "1.65" }}>
            Controlled narrative synthesis of the Foundation baseline and the completed focus-area
            overlays on this device.
          </p>
        </div>
        <div className="result-prose stack-md">
          {profileNarrative.sections.map((section) => (
            <div key={section.title} className="stack-xs">
              <p className="eyebrow">{section.title}</p>
              <p style={{ lineHeight: "1.7" }}>{section.text}</p>
            </div>
          ))}
        </div>
      </section>

      <section className="result-section stack-md">
        <div className="stack-xs">
          <h2>Focus-area overlays</h2>
          <p className="muted" style={{ fontSize: "0.9rem", lineHeight: "1.65" }}>
            Each completed module is shown as a domain overlay with its three internal lane reads.
          </p>
        </div>
        {moduleSnapshots.length > 0 ? (
          <div className="profile-module-grid">
            {moduleSnapshots.map((moduleSnapshot) => (
              <div key={moduleSnapshot.slug} className="explore-card stack-sm">
                <div className="stack-xs">
                  <p className="eyebrow">{moduleSnapshot.title}</p>
                  <h3>{moduleSnapshot.headline}</h3>
                  {moduleSnapshot.subtitle ? (
                    <p style={{ fontWeight: 600, fontSize: "0.92rem" }}>{moduleSnapshot.subtitle}</p>
                  ) : null}
                  <p className="muted" style={{ lineHeight: "1.65", fontSize: "0.9rem" }}>
                    {moduleSnapshot.summary}
                  </p>
                </div>

                {moduleSnapshot.laneSummaries.length > 0 ? (
                  <div className="stack-sm">
                    {moduleSnapshot.laneSummaries.map((lane) => (
                      <div key={`${moduleSnapshot.slug}-${lane.key}`} className="module-lane-summary stack-xs">
                        <div className="progress-meta">
                          <span style={{ fontWeight: 600, color: "var(--text)" }}>{lane.label}</span>
                          <span>{lane.score.toFixed(1)} / 7</span>
                        </div>
                        <div className="profile-mini-scale" aria-hidden="true">
                          <div
                            className="profile-mini-scale-fill"
                            style={{
                              width: `${(lane.score / 7) * 100}%`,
                              background: MODULE_COLORS[moduleSnapshot.slug],
                            }}
                          />
                        </div>
                        <div className="progress-meta" style={{ fontSize: "0.78rem" }}>
                          <span>{lane.lowLabel}</span>
                          <span>{lane.highLabel}</span>
                        </div>
                        <p className="muted" style={{ fontSize: "0.84rem", lineHeight: "1.55" }}>
                          {lane.summary}
                        </p>
                        {lane.delta ? (
                          <p className="muted" style={{ fontSize: "0.8rem", lineHeight: "1.5" }}>
                            <strong>Relative to Foundation:</strong> {lane.delta}
                          </p>
                        ) : null}
                      </div>
                    ))}
                  </div>
                ) : null}

                {moduleSnapshot.cardTypeRead ? (
                  <div className="callout stack-xs">
                    <p className="eyebrow">{moduleSnapshot.cardTypeRead.headline}</p>
                    <p className="muted" style={{ fontSize: "0.85rem", lineHeight: "1.6" }}>
                      {moduleSnapshot.cardTypeRead.summary}
                    </p>
                  </div>
                ) : null}

                {moduleSnapshot.comparison ? (
                  <div className="callout">
                    <p style={{ fontSize: "0.88rem", lineHeight: "1.6" }}>
                      <strong>Baseline delta:</strong> {moduleSnapshot.comparison}
                    </p>
                  </div>
                ) : null}

                <p>
                  <Link href={moduleSnapshot.resultPath} style={{ color: "var(--accent)" }}>
                    Open full result →
                  </Link>
                </p>
              </div>
            ))}
          </div>
        ) : (
          <div className="callout stack-xs">
            <p style={{ fontWeight: 600 }}>No focus-area overlays yet</p>
            <p className="muted" style={{ lineHeight: "1.65", fontSize: "0.9rem" }}>
              The Foundation already gives you a complete baseline. Focus-area modules add
              pressure tests in Security and Technology when you want to see how that baseline
              travels.
            </p>
            <p>
              <Link href={`/modules?foundation=${encodeURIComponent(foundation.payload)}`} style={{ color: "var(--accent)" }}>
                Browse focus-area modules →
              </Link>
            </p>
          </div>
        )}
      </section>

      <section className="result-section stack-md">
        <div className="stack-xs">
          <h2>Evidence and detail</h2>
          <p className="muted" style={{ fontSize: "0.9rem", lineHeight: "1.65" }}>
            Open the drawers below for the saved Foundation result and the lower-evidence module
            recall on this device.
          </p>
        </div>

        <details className="profile-details">
          <summary>Foundation result</summary>
          <div className="stack-sm">
            <p className="muted" style={{ lineHeight: "1.65", fontSize: "0.9rem" }}>
              Closest traditions: {foundation.familyLabel} and {foundation.runnerUpLabel}.
            </p>
            <p>
              <Link href={foundation.resultPath} style={{ color: "var(--accent)" }}>
                Open Foundation result →
              </Link>
            </p>
          </div>
        </details>

        <details className="profile-details">
          <summary>Foundation anchors</summary>
          <div className="driver-grid" style={{ marginTop: "16px" }}>
            {foundation.keyDrivers.map((driver) => (
              <div key={driver.label} className="driver-card stack-xs">
                <p className="eyebrow">{driver.type}</p>
                <p style={{ fontWeight: 600, fontFamily: "Georgia, serif" }}>{driver.label}</p>
                <p className="muted" style={{ fontSize: "0.86rem", lineHeight: "1.6" }}>
                  {driver.description}
                </p>
              </div>
            ))}
            {foundation.strongLenses.map((lens) => (
              <div key={lens.label} className="driver-card stack-xs">
                <p className="eyebrow">Lens</p>
                <p style={{ fontWeight: 600, fontFamily: "Georgia, serif" }}>{lens.label}</p>
                <p className="muted" style={{ fontSize: "0.86rem", lineHeight: "1.6" }}>
                  {lens.description}
                </p>
              </div>
            ))}
          </div>
        </details>

        {moduleSnapshots.map((moduleSnapshot) => (
          <details key={moduleSnapshot.slug} className="profile-details">
            <summary>{moduleSnapshot.title} evidence log</summary>
            <div className="stack-sm">
              <p className="muted" style={{ lineHeight: "1.65", fontSize: "0.9rem" }}>
                What it measured: {moduleSnapshot.measures.join("; ")}.
              </p>
              <p className="muted" style={{ lineHeight: "1.65", fontSize: "0.9rem" }}>
                What it did not claim: {moduleSnapshot.doesNotClaim.join("; ")}.
              </p>
              <div className="stack-xs">
                {moduleSnapshot.evidence.map((item) => (
                  <div key={`${moduleSnapshot.slug}-${item.question}`} className="panel-flush stack-xs">
                    <p style={{ fontWeight: 600, fontSize: "0.92rem" }}>{item.question}</p>
                    <p className="muted" style={{ fontSize: "0.86rem", lineHeight: "1.6" }}>
                      Most persuasive: {item.primary}
                      {item.secondary ? ` · Second-most persuasive: ${item.secondary}` : ""}
                    </p>
                  </div>
                ))}
              </div>
            </div>
          </details>
        ))}
      </section>
    </article>
  )
}

function getModuleHighlightText(snapshot: ModuleSnapshot | undefined, fallback: string) {
  if (!snapshot) return fallback

  const dominantLane = snapshot.laneSummaries
    .slice()
    .sort((a, b) => Math.abs(b.score - 4) - Math.abs(a.score - 4))[0]

  if (!dominantLane) {
    return snapshot.summary
  }

  return `${dominantLane.label}: ${dominantLane.summary}`
}

function getStableTraitText(foundation: ProfileStore["foundation"]) {
  if (!foundation) {
    return "The Foundation baseline is not saved yet."
  }

  const strongestDriver = foundation.keyDrivers[0]
  if (strongestDriver) {
    return `${strongestDriver.label}. ${strongestDriver.description}`
  }

  const firstLens = foundation.strongLenses[0]
  if (firstLens) {
    return `${firstLens.label}. ${firstLens.description}`
  }

  return "The Foundation remains the anchor until issue overlays complicate it."
}

function getContestedTraitText(assessment: ReturnType<typeof buildProfileAssessment>) {
  if (assessment.state === "trueTension") {
    return assessment.points[0] ?? assessment.changedMost
  }

  if (assessment.state === "domainConditionedShift") {
    return assessment.changedMost
  }

  if (assessment.state === "lowDifferentiation") {
    return "No single contested trait dominates yet. The main signal remains overlap rather than one sharp split."
  }

  return "No major contested fault line has opened yet. The completed overlays still sit relatively close to the baseline."
}

function ProfileSpine({ rows }: { rows: ReturnType<typeof buildProfileSpineRows> }) {
  const overlayLegend = Array.from(
    new Map(
      rows
        .flatMap((row) => row.overlays)
        .map((overlay) => [overlay.slug, overlay]),
    ).values(),
  )

  return (
    <div className="stack-sm">
      <div className="profile-spine-legend">
        <span className="profile-spine-legend-item">
          <span className="profile-spine-swatch profile-spine-swatch--baseline" />
          Foundation
        </span>
        {overlayLegend.map((overlay) => (
          <span key={overlay.slug} className="profile-spine-legend-item">
            <span className={`profile-spine-swatch profile-spine-swatch--${overlay.slug}`} />
            {overlay.label}
          </span>
        ))}
      </div>

      <div className="profile-spine-table">
        {rows.map((row) => (
          <div key={row.dimension} className="profile-spine-row">
            <div className="profile-spine-label">
              <p style={{ fontWeight: 600, color: "var(--text)" }}>{row.label}</p>
            </div>
            <div className="profile-spine-scale">
              <span className="profile-spine-end">{row.lowLabel}</span>
              <div className="profile-spine-track">
                <div
                  className="profile-spine-dot profile-spine-dot--baseline"
                  style={{ left: `${((row.baseline - 1) / 6) * 100}%` }}
                  title={`Foundation: ${row.baseline.toFixed(1)}`}
                />
                {row.overlays.map((overlay) => (
                  <div
                    key={`${row.dimension}-${overlay.slug}`}
                    className={`profile-spine-dot profile-spine-dot--${overlay.slug}`}
                    style={{ left: `${((overlay.value - 1) / 6) * 100}%` }}
                    title={`${overlay.label}: ${overlay.value.toFixed(1)}`}
                  />
                ))}
              </div>
              <span className="profile-spine-end">{row.highLabel}</span>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}
