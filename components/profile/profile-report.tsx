"use client"

import Link from "next/link"
import type { ReactNode } from "react"
import { AtlasFingerprint } from "@/components/atlas/atlas-fingerprint"
import { ResultCardHero, type ResultCardAccent } from "@/components/results/result-card-hero"
import { getAtlasPatternHref, matchAtlasLiteProfile } from "@/lib/atlas-lite"
import { getCrossModuleSynthesis } from "@/lib/ai-governance-cross-module-synthesis"
import { buildProfileNarrative } from "@/lib/narrative/profile"
import {
  buildProfileAssessment,
  buildProfileSynthesisLite,
  buildProfileSpineRows,
  buildProfileTriad,
  type ProfileSpineRow,
} from "@/lib/profile-helpers"
import { type ModuleSnapshot, type ProfileStore } from "@/lib/profile-store"
import type { FamilyKey } from "@/lib/types"

const FAMILY_ACCENT: Record<FamilyKey, ResultCardAccent> = {
  realist: "realist",
  institutionalist: "institutionalist",
  constructivist: "constructivist",
  criticalPoliticalEconomy: "cpe",
}

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
  const triad = buildProfileTriad(profile)
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
  const topParagraph = soWhatBlock?.text ?? profileNarrative.summary
  const securitySnapshot = moduleSnapshots.find((snapshot) => snapshot.slug === "security") ?? null
  const technologySnapshot = moduleSnapshots.find((snapshot) => snapshot.slug === "technology") ?? null
  const nextSteps = buildProfileNextSteps({
    foundationPayload: foundation.payload,
    securitySnapshot,
    technologySnapshot,
    aiSnapshot,
    mode,
  })
  const spreadHeadline = computeSpreadHeadline(spineRows)
  const savedLayerCount = profileSynthesis.layers.filter((layer) => layer.present).length
  const isLayeredProfile = savedLayerCount >= 2
  const heroTitle = isLayeredProfile ? atlasMatch.nearest.name : assessment.synthesis
  const heroSummary = isLayeredProfile ? atlasMatch.nearest.soWhat : topParagraph

  return (
    <article className="result-article">
      {isLayeredProfile ? (
        <ResultCardHero
          eyebrow={mode === "local" ? "Profile" : "Shared profile"}
          label={heroTitle}
          accent={FAMILY_ACCENT[foundation.familyKey]}
          modifiers={buildProfileModifiers(foundation, aiSnapshot)}
          summary={heroSummary}
          finding={
            triad.tension
              ? { label: "Open tension", text: triad.tension }
              : { label: "Under pressure", text: atlasMatch.nearest.cardPressureNote }
          }
          actions={
            nextSteps.length > 0 ? (
              <>
                {nextSteps.slice(0, 1).map((step) => (
                  <Link
                    key={step.href}
                    href={step.href}
                    className="result-card-hero__primary"
                  >
                    {step.title}
                  </Link>
                ))}
                {nextSteps.slice(1, 3).map((step) => (
                  <Link
                    key={step.href}
                    href={step.href}
                    className="result-card-hero__secondary"
                  >
                    {step.title} →
                  </Link>
                ))}
              </>
            ) : null
          }
        />
      ) : (
        <section className="profile-hero profile-hero--anchored stack-md">
          <div className="profile-hero-head stack-sm">
            <p className="eyebrow">{mode === "local" ? "Profile" : "Shared profile"}</p>
            <h1>{heroTitle}</h1>
          </div>
          <p className="profile-hero-summary">{heroSummary}</p>
          {nextSteps.length > 0 ? (
            <nav className="profile-hero-ctas" aria-label="Profile next steps">
              {nextSteps.slice(0, 3).map((step, index) => (
                <Link
                  key={step.href}
                  href={step.href}
                  className={`profile-hero-cta${index === 0 ? " profile-hero-cta--primary" : ""}`}
                >
                  <span className="profile-hero-cta__title">{step.title}</span>
                  <span className="profile-hero-cta__arr" aria-hidden="true">↗</span>
                </Link>
              ))}
            </nav>
          ) : null}
        </section>
      )}

      <section className="result-section stack-md">
        <div className="profile-stat-chips" aria-label="Profile facts">
          <span className="profile-stat-chip">
            <span className="profile-stat-chip__k">Stable thread</span>
            <span className="profile-stat-chip__v">{stableThreadChip(foundation.familyKey)}</span>
          </span>
          <span className="profile-stat-chip profile-stat-chip--high">
            <span className="profile-stat-chip__k">Biggest shift</span>
            <span className="profile-stat-chip__v">{spreadHeadline.changedMostChip}</span>
          </span>
          <span className="profile-stat-chip profile-stat-chip--stable">
            <span className="profile-stat-chip__k">AI layer</span>
            <span className="profile-stat-chip__v">
              {aiSnapshot ? aiSnapshot.archetypeLabel : "Not added"}
            </span>
          </span>
        </div>

        <ProfileAnchoredSpread rows={spineRows} />
      </section>

      <section className="result-section stack-md">
        <div className="stack-xs">
          <h2 style={{ margin: 0, fontSize: "1.2rem" }}>What stayed steady, what shifted</h2>
          <p className="muted" style={{ fontSize: "0.9rem", lineHeight: "1.65", maxWidth: "760px" }}>
            One read across the saved layers — what the profile keeps coming back to, where saved
            modules pull it, and any open tension worth holding onto.
          </p>
        </div>
        <div className="profile-triad">
          <div className="profile-triad__item stack-xs">
            <p className="eyebrow">What stayed steady</p>
            <p style={{ lineHeight: "1.7", margin: 0 }}>{triad.steady}</p>
          </div>
          <div className="profile-triad__item stack-xs">
            <p className="eyebrow">What shifted</p>
            <p style={{ lineHeight: "1.7", margin: 0 }}>{triad.shifted}</p>
          </div>
          {triad.tension ? (
            <div className="profile-triad__item stack-xs">
              <p className="eyebrow">Open tension</p>
              <p style={{ lineHeight: "1.7", margin: 0 }}>{triad.tension}</p>
            </div>
          ) : null}
        </div>
        {actionSlot ? <div className="profile-secondary-actions">{actionSlot}</div> : null}
      </section>

      <section className="result-section stack-md">
        <div className="stack-xs">
          <h2 style={{ margin: 0, fontSize: "1.2rem" }}>Evidence and saved layers</h2>
          <p className="muted" style={{ fontSize: "0.9rem", lineHeight: "1.65", maxWidth: "760px" }}>
            The Atlas pattern, AI layer, completed overlays, and Foundation anchors that this
            profile reads from. Open each drawer when you want to look at the evidence.
          </p>
        </div>

        <details className="profile-details profile-details--secondary">
          <summary>
            {isLayeredProfile
              ? `Atlas pattern: ${atlasMatch.nearest.name}`
              : "Nearest Atlas pattern"}
          </summary>
          <div className="profile-collapsed-detail stack-md">
            {!isLayeredProfile ? (
              <p style={{ fontWeight: 700, fontFamily: "Georgia, serif", margin: 0 }}>
                {atlasMatch.nearest.name}
              </p>
            ) : null}
            <p className="muted" style={{ lineHeight: "1.65", fontSize: "0.9rem", margin: 0 }}>
              {atlasMatch.nearest.cardSummary}
            </p>
            <p className="muted" style={{ fontSize: "0.86rem", lineHeight: "1.6", margin: 0 }}>
              <strong>Under pressure:</strong> {atlasMatch.nearest.cardPressureNote}
            </p>
            <div className="stack-xs">
              <p className="profile-section-kicker">Pattern fingerprint</p>
              <AtlasFingerprint fingerprint={atlasMatch.nearest.fingerprint} compact />
            </div>
            <div className="atlas-inline-links">
              <Link href={getAtlasPatternHref(atlasMatch.nearest.id)} style={{ color: "var(--accent)" }}>
                Read this pattern
              </Link>
              {atlasMatch.neighbors.slice(0, 2).map((pattern) => (
                <Link key={pattern.id} href={getAtlasPatternHref(pattern.id)} style={{ color: "var(--accent)" }}>
                  {pattern.name}
                </Link>
              ))}
              <Link href="/explore/atlas" style={{ color: "var(--accent)" }}>
                Browse Atlas
              </Link>
            </div>
          </div>
        </details>

        <details className="profile-details profile-details--secondary">
          <summary>AI layer detail</summary>
          <div className="profile-collapsed-detail stack-md">
            {aiSnapshot ? (
              <>
                <div className="row gap-sm wrap">
                  <span className="mode-pill">{foundation.familyLabel}</span>
                  <span className="ai-mode-pill">{aiSnapshot.archetypeLabel}</span>
                </div>

                <div className="stack-xs">
                  <p className="eyebrow">{crossModuleSynthesis.title}</p>
                  <p className="muted" style={{ fontSize: "0.9rem", lineHeight: "1.6", margin: 0 }}>
                    {crossModuleSynthesis.shortReadout}
                  </p>
                </div>

                <div className="stack-xs">
                  <p className="eyebrow">What this combination implies</p>
                  <p style={{ lineHeight: "1.7", margin: 0 }}>
                    {crossModuleSynthesis.practicalImplication}
                  </p>
                </div>

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
              </>
            ) : (
              <>
                <p style={{ fontWeight: 600, margin: 0 }}>
                  {mode === "local"
                    ? "AI governance not yet added"
                    : "AI governance not included in this shared profile"}
                </p>
                <p className="muted" style={{ lineHeight: "1.65", fontSize: "0.9rem", margin: 0 }}>
                  {mode === "local"
                    ? "Add the AI Governance Compass when you want to read it as a connected layer, not a replacement label."
                    : "Shared profiles currently carry the IR foundation and saved IR module overlays only."}
                </p>
                {mode === "local" ? (
                  <p style={{ margin: 0 }}>
                    <Link href="/ai" style={{ color: "var(--accent)" }}>
                      Add an AI result →
                    </Link>
                  </p>
                ) : null}
              </>
            )}
          </div>
        </details>

        {moduleSnapshots.length > 0 ? (
          <details className="profile-details profile-details--secondary">
            <summary>Completed issue overlays</summary>
            <div className="profile-module-grid profile-module-grid--report profile-collapsed-detail">
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
                          <p className="muted" style={{ fontSize: "0.84rem", lineHeight: "1.55" }}>
                            {lane.summary}
                          </p>
                        </div>
                      ))}
                    </div>
                  ) : null}

                  {moduleSnapshot.comparison ? (
                    <div className="profile-module-note profile-module-note--accent">
                      <p style={{ fontSize: "0.88rem", lineHeight: "1.6" }}>
                        <strong>Directional read:</strong> {moduleSnapshot.comparison}
                      </p>
                    </div>
                  ) : null}

                  {mode === "local" && moduleSnapshot.resultPath ? (
                    <p>
                      <Link href={moduleSnapshot.resultPath} style={{ color: "var(--accent)" }}>
                        View full result →
                      </Link>
                    </p>
                  ) : null}
                </article>
              ))}
            </div>
          </details>
        ) : null}

        {mode === "local" ? (
          <>
            <details className="profile-details profile-details--secondary">
              <summary>Foundation result and anchors</summary>
              <div className="profile-collapsed-detail stack-md">
                <p className="muted" style={{ lineHeight: "1.65", fontSize: "0.9rem", margin: 0 }}>
                  Closest traditions: {foundation.familyLabel} and {foundation.runnerUpLabel}.
                </p>
                <p style={{ margin: 0 }}>
                  <Link href={foundation.resultPath} style={{ color: "var(--accent)" }}>
                    Open Foundation result →
                  </Link>
                </p>
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
              </div>
            </details>

            {moduleSnapshots.map((moduleSnapshot) => (
              <details key={moduleSnapshot.slug} className="profile-details profile-details--secondary">
                <summary>{moduleSnapshot.title} evidence log</summary>
                <div className="profile-collapsed-detail stack-sm">
                  <p className="muted" style={{ lineHeight: "1.65", fontSize: "0.9rem", margin: 0 }}>
                    What it measured: {moduleSnapshot.measures.join("; ")}.
                  </p>
                  <p className="muted" style={{ lineHeight: "1.65", fontSize: "0.9rem", margin: 0 }}>
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
          </>
        ) : null}
      </section>
    </article>
  )
}

function buildProfileModifiers(
  foundation: NonNullable<ProfileStore["foundation"]>,
  aiSnapshot: ProfileStore["aiGovernance"],
): string[] {
  const modifiers: string[] = [foundation.familyLabel]
  if (aiSnapshot) modifiers.push(aiSnapshot.archetypeLabel)
  return modifiers
}

function buildProfileNextSteps({
  foundationPayload,
  securitySnapshot,
  technologySnapshot,
  aiSnapshot,
  mode,
}: {
  foundationPayload: string
  securitySnapshot: ModuleSnapshot | null
  technologySnapshot: ModuleSnapshot | null
  aiSnapshot: ProfileStore["aiGovernance"]
  mode: "local" | "shared"
}) {
  if (mode !== "local") {
    return [
      {
        title: "Open the Atlas",
        href: "/explore/atlas",
      },
      {
        title: "Compare shared profiles",
        href: "/compare",
      },
    ]
  }

  const steps: { title: string; href: string }[] = []

  if (!securitySnapshot) {
    steps.push({
      title: "Add Security overlay",
      href: `/modules/security?foundation=${encodeURIComponent(foundationPayload)}`,
    })
  }

  if (!technologySnapshot) {
    steps.push({
      title: "Add Technology overlay",
      href: `/modules/technology?foundation=${encodeURIComponent(foundationPayload)}`,
    })
  }

  if (!aiSnapshot) {
    steps.push({
      title: "Add AI layer",
      href: "/ai",
    })
  }

  steps.push({
    title: "Open the Atlas",
    href: "/explore/atlas",
  })

  return steps.slice(0, 3)
}

const STABLE_THRESHOLD = 0.5
const HEAVY_THRESHOLD = 1.0
const HALF_RANGE = 3

type DominantOverlay = {
  slug: "security" | "technology"
  label: string
  delta: number
  magnitude: number
  isStable: boolean
}

function pickDominantOverlay(row: ProfileSpineRow): DominantOverlay | null {
  let best: DominantOverlay | null = null
  for (const overlay of row.overlays) {
    const delta = overlay.value - row.baseline
    const magnitude = Math.abs(delta)
    if (!best || magnitude > best.magnitude) {
      best = {
        slug: overlay.slug,
        label: overlay.label,
        delta,
        magnitude,
        isStable: magnitude < STABLE_THRESHOLD,
      }
    }
  }
  return best
}

function leansPhrase(magnitude: number): string {
  if (magnitude < STABLE_THRESHOLD) return "stable"
  if (magnitude < HEAVY_THRESHOLD) return "leans"
  return "leans heavily"
}

function ProfileAnchoredSpread({ rows }: { rows: ProfileSpineRow[] }) {
  return (
    <div className="profile-spread" role="img" aria-label="Relative directional pulls from the Foundation anchor under saved module pressure">
      <div className="profile-spread__head">
        <span className="profile-spread__title">Relative pull from the Foundation anchor</span>
        <div className="profile-spread__scale" aria-hidden="true">
          <span className="profile-spread__scale-l">Toward low pole</span>
          <span className="profile-spread__scale-c">Foundation anchor</span>
          <span className="profile-spread__scale-r">Toward high pole</span>
        </div>
      </div>

      {rows.map((row) => {
        const dominant = pickDominantOverlay(row)
        const isStable = !dominant || dominant.isStable
        const widthPercent = dominant
          ? Math.min(50, (dominant.magnitude / HALF_RANGE) * 50)
          : 0
        const leftPercent = dominant && dominant.delta < 0 ? 50 - widthPercent : 50
        const directionLabel = dominant
          ? dominant.delta >= 0
            ? row.highLabel
            : row.lowLabel
          : null
        const phrase = dominant ? leansPhrase(dominant.magnitude) : "no overlay"
        const anchorMeta = dominant
          ? `Foundation anchor · ${dominant.label} pull`
          : "Foundation anchor · no saved module pull yet"

        return (
          <div
            key={row.dimension}
            className={`profile-spread__row${isStable ? " profile-spread__row--stable" : ""}`}
          >
            <div className="profile-spread__label">
              <span className="profile-spread__name">{row.label}</span>
              <span className="profile-spread__anchor">{anchorMeta}</span>
            </div>
            <div className="profile-spread__bar">
              <div className="profile-spread__track" aria-hidden="true">
                <span className="profile-spread__grid" style={{ left: "16.66%" }} />
                <span className="profile-spread__grid" style={{ left: "33.33%" }} />
                <span className="profile-spread__axis" />
                <span className="profile-spread__grid" style={{ left: "66.66%" }} />
                <span className="profile-spread__grid" style={{ left: "83.33%" }} />
                {dominant ? (
                  <span
                    className={`profile-spread__fill${isStable ? " profile-spread__fill--stable" : ""}`}
                    style={{ left: `${leftPercent}%`, width: `${Math.max(widthPercent, 0.6)}%` }}
                  />
                ) : null}
              </div>
              <div className="profile-spread__lane-meta">
                <span>{dominant ? `Layer: ${dominant.label}` : "No saved module overlay yet"}</span>
                <span className="profile-spread__delta">
                  {dominant && directionLabel
                    ? `${phrase} · ${directionLabel.toLowerCase()}`
                    : phrase}
                </span>
              </div>
            </div>
          </div>
        )
      })}

      <div className="profile-spread__foot">
        <span>
          <span className="profile-spread__sw profile-spread__sw--move" aria-hidden="true" />
          Noticeable pull
        </span>
        <span>
          <span className="profile-spread__sw profile-spread__sw--stable" aria-hidden="true" />
          Little or no pull
        </span>
        <span className="profile-spread__anchor-key">
          Directional pulls inside this model, not a new combined score.
        </span>
      </div>
    </div>
  )
}

type SpreadHeadline = {
  changedMostChip: string
}

function stableThreadChip(familyKey: FamilyKey) {
  if (familyKey === "realist") return "Power and constraint"
  if (familyKey === "institutionalist") return "Rules and coordination"
  if (familyKey === "constructivist") return "Legitimacy and meaning"
  return "Dependence and hierarchy"
}

function computeSpreadHeadline(rows: ProfileSpineRow[]): SpreadHeadline {
  let strongest: { row: ProfileSpineRow; dominant: DominantOverlay } | null = null

  for (const row of rows) {
    const dominant = pickDominantOverlay(row)
    if (dominant && (!strongest || dominant.magnitude > strongest.dominant.magnitude)) {
      strongest = { row, dominant }
    }
  }

  if (!strongest) {
    return {
      changedMostChip: "No overlay yet",
    }
  }

  const { row, dominant } = strongest
  const phrase = leansPhrase(dominant.magnitude)

  return {
    changedMostChip: `${row.label} · ${phrase}`,
  }
}
