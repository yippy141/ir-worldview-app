"use client"

import Link from "next/link"
import type { ReactNode } from "react"
import { AtlasFingerprint } from "@/components/atlas/atlas-fingerprint"
import { AtlasPatternFamily } from "@/components/atlas/atlas-pattern-family"
import { getAtlasPatternHref, matchAtlasLiteProfile } from "@/lib/atlas-lite"
import { getCrossModuleSynthesis } from "@/lib/ai-governance-cross-module-synthesis"
import { buildProfileNarrative } from "@/lib/narrative/profile"
import {
  buildIntegratedHeadline,
  buildProfileAssessment,
  buildProfileSynthesisLite,
  buildProfileSpineRows,
} from "@/lib/profile-helpers"
import { type ModuleSnapshot, type ProfileStore } from "@/lib/profile-store"

const MODULE_COLORS = {
  security: "var(--accent)",
  technology: "var(--t-institutionalist)",
} as const

type Props = {
  profile: ProfileStore
  mode: "local" | "shared"
  actionSlot?: ReactNode
}

export function ProfileReport({ profile, mode, actionSlot }: Props) {
  if (!profile.foundation) {
    return null
  }

  const foundation = profile.foundation
  const moduleSnapshots = Object.values(profile.modules)
    .filter((moduleSnapshot): moduleSnapshot is ModuleSnapshot => Boolean(moduleSnapshot))
    .sort((a, b) => b.timestamp - a.timestamp)
  const assessment = buildProfileAssessment(profile)
  const profileSynthesis = buildProfileSynthesisLite(profile)
  const profileNarrative = buildProfileNarrative(profile, assessment)
  const spineRows = buildProfileSpineRows(profile)
  const aiSnapshot = profile.aiGovernance
  const crossModuleSynthesis = getCrossModuleSynthesis(
    foundation.familyKey,
    aiSnapshot?.archetypeKey ?? null,
  )
  const atlasMatch = matchAtlasLiteProfile({
    foundation,
    profileState: assessment.state,
    moduleSnapshots,
  })
  const soWhatBlock = profileNarrative.sections.find(
    (section) => section.title === "So what this usually means",
  )
  const deepReadSections = profileNarrative.sections.filter(
    (section) => section.title !== "So what this usually means",
  )
  const contextLabel = mode === "local" ? "on this device" : "in this shared profile"
  const topParagraph = soWhatBlock?.text ?? profileNarrative.summary
  const coverageText = getProfileMosaicCoverageText(profileSynthesis.layers, mode)

  return (
    <article className="result-article">
      <section className="profile-hero stack-lg">
        <div className="stack-sm">
          <p className="eyebrow">{mode === "local" ? "Profile" : "Shared profile"}</p>
          <h1>{buildIntegratedHeadline(profile)}</h1>
          <p className="muted" style={{ lineHeight: "1.75", maxWidth: "760px" }}>
            {topParagraph}
          </p>
          <div className="row gap-sm wrap">
            <span className="mode-pill">{foundation.familyLabel}</span>
          </div>
          {actionSlot ? <div style={{ marginTop: "10px" }}>{actionSlot}</div> : null}
        </div>
        <section className="profile-mosaic stack-md">
          <div className="profile-mosaic-header">
            <div className="stack-xs">
              <p className="eyebrow">Worldview mosaic</p>
              <h2 style={{ margin: 0, fontSize: "1.2rem" }}>How the saved layers read together</h2>
              <p className="muted" style={{ fontSize: "0.9rem", lineHeight: "1.65", maxWidth: "760px" }}>
                This keeps the no-single-score approach. It names the stable thread, the pressure
                shifts, and the reasoning style that keeps showing up across the saved layers.
              </p>
            </div>
            <div className="profile-layer-strip" aria-label="Saved profile layers">
              {profileSynthesis.layers.map((layer) => (
                <span
                  key={layer.key}
                  className={`profile-layer-pill${layer.present ? "" : " profile-layer-pill--inactive"}`}
                >
                  {layer.label}
                  {!layer.present ? " pending" : ""}
                </span>
              ))}
            </div>
          </div>

          <div className="profile-mosaic-grid">
            <div className="profile-mosaic-card stack-xs">
              <p className="eyebrow">Stable across layers</p>
              <p className="profile-mosaic-title">What keeps returning</p>
              <p className="profile-mosaic-body">{profileSynthesis.stableAcross}</p>
            </div>
            <div className="profile-mosaic-card stack-xs">
              <p className="eyebrow">Shifts under pressure</p>
              <p className="profile-mosaic-title">Where the emphasis moves</p>
              <p className="profile-mosaic-body">{profileSynthesis.shiftsUnderPressure}</p>
            </div>
            <div className="profile-mosaic-card stack-xs">
              <p className="eyebrow">Overall style of reasoning</p>
              <p className="profile-mosaic-title">How you tend to sort cases</p>
              <p className="profile-mosaic-body">{profileSynthesis.reasoningStyle}</p>
            </div>
          </div>

          <p className="muted profile-mosaic-note">{coverageText}</p>
        </section>
      </section>

      <section className="result-section stack-md">
        <div className="profile-spine-panel stack-sm">
          <div className="stack-xs">
            <h2>Foundation spine with overlays</h2>
            <p className="muted" style={{ fontSize: "0.9rem", lineHeight: "1.65", maxWidth: "760px" }}>
              The Foundation stays fixed. Saved modules show where pressure pulls nearby dimensions
              harder, softer, or in a different direction.
            </p>
          </div>
          <ProfileSpine rows={spineRows} />
          <p className="muted" style={{ fontSize: "0.88rem", lineHeight: "1.6" }}>
            {assessment.changedMost}
          </p>
        </div>
      </section>

      <section className="result-section stack-md">
        <div className="stack-xs">
          <h2>Atlas</h2>
          <p className="muted" style={{ fontSize: "0.9rem", lineHeight: "1.65" }}>
            A browse map of recurring profile patterns in the model. It is an editorial guide, not
            a rarity claim or live population map.
          </p>
        </div>
        <div className="profile-atlas-feature stack-md">
          <div className="profile-atlas-feature__intro">
            <div className="stack-xs">
              <p className="eyebrow">Nearest Atlas pattern</p>
              <p style={{ fontWeight: 700, fontFamily: "Georgia, serif", fontSize: "1.05rem" }}>
                {atlasMatch.nearest.name}
              </p>
              <AtlasPatternFamily pattern={atlasMatch.nearest} compact />
              <p className="muted" style={{ lineHeight: "1.65", fontSize: "0.9rem" }}>
                {atlasMatch.nearest.cardSummary}
              </p>
            </div>
            <p className="muted profile-atlas-feature__pressure">
              <strong>Under pressure:</strong> {atlasMatch.nearest.cardPressureNote}
            </p>
          </div>

          <div className="profile-atlas-feature__details">
            <div className="stack-xs">
              <p className="profile-section-kicker">Pattern fingerprint</p>
              <AtlasFingerprint fingerprint={atlasMatch.nearest.fingerprint} compact />
            </div>

            <div className="stack-md">
              <div className="stack-xs">
                <p className="profile-section-kicker">What usually drives it</p>
                <div className="atlas-tag-list">
                  {atlasMatch.nearest.cardDrivers.map((driver) => (
                    <span key={driver} className="atlas-tag">
                      {driver}
                    </span>
                  ))}
                </div>
              </div>

              <div className="stack-xs">
                <p className="profile-section-kicker">Nearby patterns worth opening</p>
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
          </div>
        </div>
      </section>

      <section className="result-section stack-md">
        <div className="stack-xs">
          <h2>Integrated interpretation</h2>
          <p className="muted" style={{ fontSize: "0.9rem", lineHeight: "1.65" }}>
            A plain-English read of the Foundation baseline and the completed focus-area overlays {contextLabel}.
          </p>
        </div>
        <div className="result-prose stack-md">
          {deepReadSections.map((section) => (
            <div key={section.title} className="stack-xs">
              <p className="eyebrow">{section.title}</p>
              <p style={{ lineHeight: "1.7" }}>{section.text}</p>
            </div>
          ))}
        </div>
      </section>

      <section className="result-section stack-md">
        <div className="stack-xs">
          <h2>IR + AI cross-read</h2>
          <p className="muted" style={{ fontSize: "0.9rem", lineHeight: "1.65" }}>
            A more detailed side-by-side read of the IR Foundation and the AI Governance Compass.
            It still does not create a master score.
          </p>
        </div>

        {aiSnapshot ? (
          <>
            <div className="row gap-sm wrap">
              <span className="mode-pill">{foundation.familyLabel}</span>
              <span className="ai-mode-pill">{aiSnapshot.archetypeLabel}</span>
            </div>

            <div className="profile-analysis-grid">
              <div className="profile-analysis-card stack-xs">
                <p className="eyebrow">{crossModuleSynthesis.title}</p>
                <p style={{ fontWeight: 600, fontFamily: "Georgia, serif" }}>Short read</p>
                <p className="muted" style={{ fontSize: "0.86rem", lineHeight: "1.6" }}>
                  {crossModuleSynthesis.shortReadout}
                </p>
              </div>
              <div className="profile-analysis-card stack-xs">
                <p className="eyebrow">Where they align</p>
                <ul className="content-list" style={{ margin: 0 }}>
                  {crossModuleSynthesis.likelyAlignment.map((item) => (
                    <li key={item} className="muted" style={{ fontSize: "0.86rem", lineHeight: "1.6" }}>
                      {item}
                    </li>
                  ))}
                </ul>
              </div>
              <div className="profile-analysis-card stack-xs">
                <p className="eyebrow">Where they may conflict</p>
                <ul className="content-list" style={{ margin: 0 }}>
                  {crossModuleSynthesis.likelyTensions.map((item) => (
                    <li key={item} className="muted" style={{ fontSize: "0.86rem", lineHeight: "1.6" }}>
                      {item}
                    </li>
                  ))}
                </ul>
              </div>
            </div>

            <div className="profile-analysis-note stack-xs">
              <p className="eyebrow">What this combination implies</p>
              <p style={{ lineHeight: "1.7", margin: 0 }}>
                {crossModuleSynthesis.practicalImplication}
              </p>
            </div>

            <div className="stack-xs">
              <p className="muted" style={{ fontSize: "0.88rem", lineHeight: "1.65", margin: 0 }}>
                <strong>AI result:</strong> {aiSnapshot.summary}
              </p>
              {mode === "local" ? (
                <p style={{ margin: 0 }}>
                  <Link href={aiSnapshot.resultPath} style={{ color: "var(--accent)" }}>
                    Open AI result →
                  </Link>
                </p>
              ) : null}
            </div>
          </>
        ) : (
          <div className="profile-analysis-note stack-xs">
            <p style={{ fontWeight: 600 }}>
              {mode === "local"
                ? "AI governance not yet added"
                : "AI governance not included in this shared profile"}
            </p>
            <p className="muted" style={{ lineHeight: "1.65", fontSize: "0.9rem" }}>
              {mode === "local"
                ? "This block appears once this device has a saved AI Governance Compass result. It reads the IR baseline and AI result side by side rather than folding them into one score."
                : "Shared profiles currently carry the IR foundation and saved IR module overlays only. The synthesis block needs a saved AI result to do more than offer a generic framing."}
            </p>
            {mode === "local" ? (
              <p style={{ margin: 0 }}>
                <Link href="/ai" style={{ color: "var(--accent)" }}>
                  Add an AI result →
                </Link>
              </p>
            ) : null}
          </div>
        )}
      </section>

      <section className="result-section stack-md">
        <div className="stack-xs">
          <h2>Focus-area overlays</h2>
          <p className="muted" style={{ fontSize: "0.9rem", lineHeight: "1.65" }}>
            Each completed module is shown as a domain overlay with its internal lane reads.
          </p>
        </div>
        {moduleSnapshots.length > 0 ? (
          <div className="profile-module-grid profile-module-grid--report">
            {moduleSnapshots.map((moduleSnapshot) => (
              <article key={moduleSnapshot.slug} className="profile-module-entry stack-md">
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
                      <div key={`${moduleSnapshot.slug}-${lane.key}`} className="profile-module-lane stack-xs">
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
                  <div className="profile-module-note stack-xs">
                    <p className="eyebrow">{moduleSnapshot.cardTypeRead.headline}</p>
                    <p className="muted" style={{ fontSize: "0.85rem", lineHeight: "1.6" }}>
                      {moduleSnapshot.cardTypeRead.summary}
                    </p>
                  </div>
                ) : null}

                {moduleSnapshot.comparison ? (
                  <div className="profile-module-note profile-module-note--accent">
                    <p style={{ fontSize: "0.88rem", lineHeight: "1.6" }}>
                      <strong>Baseline delta:</strong> {moduleSnapshot.comparison}
                    </p>
                  </div>
                ) : null}

                {mode === "local" && moduleSnapshot.resultPath ? (
                  <p>
                    <Link href={moduleSnapshot.resultPath} style={{ color: "var(--accent)" }}>
                      Open full result →
                    </Link>
                  </p>
                ) : null}
              </article>
            ))}
          </div>
        ) : (
          <div className="profile-analysis-note stack-xs">
            <p style={{ fontWeight: 600 }}>No focus-area overlays yet</p>
            <p className="muted" style={{ lineHeight: "1.65", fontSize: "0.9rem" }}>
              The Foundation already gives you a complete baseline. Focus-area modules add pressure
              tests in Security and Technology when you want to see how that baseline travels.
            </p>
            {mode === "local" ? (
              <p>
                <Link href={`/modules?foundation=${encodeURIComponent(foundation.payload)}`} style={{ color: "var(--accent)" }}>
                  Browse focus-area modules →
                </Link>
              </p>
            ) : null}
          </div>
        )}
      </section>

      {mode === "local" ? (
        <section className="result-section profile-appendix stack-md">
          <div className="stack-xs">
            <p className="eyebrow">Appendix</p>
            <h2>Evidence and detail</h2>
            <p className="muted profile-appendix-note">
              Open the drawers below for the saved Foundation result and the lower-evidence module
              recall on this device.
            </p>
          </div>

          <details className="profile-details profile-details--appendix">
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

          <details className="profile-details profile-details--appendix">
            <summary>Foundation anchors</summary>
            <div className="profile-anchor-grid">
              {foundation.keyDrivers.map((driver) => (
                <div key={driver.label} className="profile-anchor-item stack-xs">
                  <p className="eyebrow">{driver.type}</p>
                  <p style={{ fontWeight: 600, fontFamily: "Georgia, serif" }}>{driver.label}</p>
                  <p className="muted" style={{ fontSize: "0.86rem", lineHeight: "1.6" }}>
                    {driver.description}
                  </p>
                </div>
              ))}
              {foundation.strongLenses.map((lens) => (
                <div key={lens.label} className="profile-anchor-item stack-xs">
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
            <details key={moduleSnapshot.slug} className="profile-details profile-details--appendix">
              <summary>{moduleSnapshot.title} evidence log</summary>
              <div className="stack-sm">
                <p className="muted" style={{ lineHeight: "1.65", fontSize: "0.9rem" }}>
                  What it measured: {moduleSnapshot.measures.join("; ")}.
                </p>
                <p className="muted" style={{ lineHeight: "1.65", fontSize: "0.9rem" }}>
                  What it did not claim: {moduleSnapshot.doesNotClaim.join("; ")}.
                </p>
                <div className="profile-evidence-list">
                  {moduleSnapshot.evidence.map((item) => (
                    <div key={`${moduleSnapshot.slug}-${item.question}`} className="profile-evidence-item stack-xs">
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
      ) : null}
    </article>
  )
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

function getProfileMosaicCoverageText(
  layers: ReturnType<typeof buildProfileSynthesisLite>["layers"],
  mode: "local" | "shared",
) {
  const present = layers.filter((layer) => layer.present).map((layer) => layer.label)
  const missing = layers.filter((layer) => !layer.present).map((layer) => layer.label)

  if (missing.length === 0) {
    return "Built from Foundation, Security, Technology, and AI. The page is still reading them as one mosaic, not a master score."
  }

  const missingLine = missing.length === 1
    ? mode === "local"
      ? "is not saved on this device yet."
      : "is not included in this shared view."
    : mode === "local"
      ? "are not saved on this device yet."
      : "are not included in this shared view."

  return `${formatLabelList(present)} ${present.length === 1 ? "is" : "are"} currently in view. ${formatLabelList(missing)} ${missingLine}`
}

function formatLabelList(labels: string[]) {
  if (labels.length === 0) {
    return "No layers"
  }

  if (labels.length === 1) {
    return labels[0]
  }

  if (labels.length === 2) {
    return `${labels[0]} and ${labels[1]}`
  }

  return `${labels.slice(0, -1).join(", ")}, and ${labels.at(-1)}`
}
