"use client"

import Link from "next/link"
import type { ReactNode } from "react"
import { AtlasFingerprint } from "@/components/atlas/atlas-fingerprint"
import { AtlasPatternFamily } from "@/components/atlas/atlas-pattern-family"
import { LayerRelationshipStack } from "@/components/visual-primitives"
import { getAtlasPatternHref, matchAtlasLiteProfile } from "@/lib/atlas-lite"
import { getCrossModuleSynthesis } from "@/lib/ai-governance-cross-module-synthesis"
import { buildProfileNarrative } from "@/lib/narrative/profile"
import {
  buildIntegratedHeadline,
  buildProfileAssessment,
  buildProfileSynthesisLite,
  buildProfileSpineRows,
  type ProfileSpineRow,
} from "@/lib/profile-helpers"
import { type ModuleSnapshot, type ProfileStore } from "@/lib/profile-store"
import type { FamilyKey } from "@/lib/types"

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
  const securitySnapshot = moduleSnapshots.find((snapshot) => snapshot.slug === "security") ?? null
  const technologySnapshot = moduleSnapshots.find((snapshot) => snapshot.slug === "technology") ?? null
  const mosaicNodes = buildProfileMosaicNodes({
    foundation,
    securitySnapshot,
    technologySnapshot,
    aiSnapshot,
    crossModuleSynthesis,
    mode,
  })
  const relationshipItems = mosaicNodes.map((node) => ({
    id: node.key,
    label: node.label,
    title: node.title,
    status: node.status,
    statusLabel: node.statusLabel,
    text: node.text,
    action: node.href ? (
      <Link href={node.href} style={{ color: "var(--accent)" }}>
        {node.linkLabel}
      </Link>
    ) : undefined,
  }))
  const nextSteps = buildProfileNextSteps({
    foundationPayload: foundation.payload,
    securitySnapshot,
    technologySnapshot,
    aiSnapshot,
    mode,
  })
  const completedLayerText = getCompletedLayerText(profileSynthesis.layers)
  const spreadHeadline = computeSpreadHeadline(spineRows)
  const savedLayerCount = profileSynthesis.layers.filter((layer) => layer.present).length
  const isLayeredProfile = savedLayerCount >= 2
  const heroTitle = isLayeredProfile ? atlasMatch.nearest.name : buildIntegratedHeadline(profile)
  const heroSummary = isLayeredProfile
    ? `${atlasMatch.nearest.soWhat} The chart below shows where saved modules pull against the Foundation anchor; it is a directional read inside this model, not a new combined score.`
    : topParagraph

  return (
    <article className="result-article">
      <section className="profile-hero profile-hero--anchored stack-md">
        <div className="profile-hero-head stack-sm">
          <p className="eyebrow">{mode === "local" ? "Profile" : "Shared profile"}</p>
          <h1>{heroTitle}</h1>
          {isLayeredProfile ? (
            <p className="profile-foundation-subtitle">
              Closest modeled Foundation family: <strong>{foundation.familyLabel}</strong>
              {" · "}
              {foundation.strategyModifier} · {foundation.normativeModifier}
            </p>
          ) : null}
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

        <p className="profile-hero-summary">{heroSummary}</p>

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
            <span className="profile-stat-chip__v">{aiSnapshot ? "Present" : "Not added"}</span>
          </span>
        </div>

        <ProfileAnchoredSpread rows={spineRows} />

        {aiSnapshot ? (
          <div className="profile-ai-band">
            <span className="profile-ai-band__lbl">AI Governance</span>
            <span className="profile-ai-band__body">
              {aiSnapshot.archetypeLabel} reads as a related layer · {crossModuleSynthesis.shortReadout}
            </span>
            {mode === "local" ? (
              <Link href={aiSnapshot.resultPath} className="profile-ai-band__open">
                Open AI result →
              </Link>
            ) : null}
          </div>
        ) : (
          <p className="profile-ai-band profile-ai-band--pending">
            <span className="profile-ai-band__lbl">AI Governance</span>
            <span className="profile-ai-band__body">
              {mode === "local"
                ? "Not yet added · open the AI Governance Compass to read it as a connected layer."
                : "Not included in this shared profile."}
            </span>
            {mode === "local" ? (
              <Link href="/ai" className="profile-ai-band__open">
                Add AI layer →
              </Link>
            ) : null}
          </p>
        )}

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

        <p className="muted profile-hero-meta">{completedLayerText}</p>
      </section>

      <section className="result-section stack-md">
        <div className="stack-xs">
          <p className="eyebrow">Layer relationships</p>
          <h2 style={{ margin: 0, fontSize: "1.2rem" }}>How the saved layers connect</h2>
          <p className="muted" style={{ fontSize: "0.9rem", lineHeight: "1.65", maxWidth: "760px" }}>
            The Foundation stays as the anchor. Saved layers show where it holds, sharpens, or
            starts to pull in different directions.
          </p>
        </div>
        <LayerRelationshipStack items={relationshipItems} />
        <p className="muted profile-mosaic-note">{coverageText}</p>

        <details className="profile-details">
          <summary>Longer profile interpretation</summary>
          <div className="result-prose stack-md" style={{ marginTop: "16px" }}>
            <div className="stack-xs">
              <p className="eyebrow">Stable thread</p>
              <p style={{ lineHeight: "1.7", margin: 0 }}>{profileSynthesis.stableAcross}</p>
            </div>
            <div className="stack-xs">
              <p className="eyebrow">Pressure shifts</p>
              <p style={{ lineHeight: "1.7", margin: 0 }}>{profileSynthesis.shiftsUnderPressure}</p>
            </div>
            <div className="stack-xs">
              <p className="eyebrow">Reasoning style</p>
              <p style={{ lineHeight: "1.7", margin: 0 }}>{profileSynthesis.reasoningStyle}</p>
            </div>
            {deepReadSections.map((section) => (
              <div key={section.title} className="stack-xs">
                <p className="eyebrow">{section.title}</p>
                <p style={{ lineHeight: "1.7", margin: 0 }}>{section.text}</p>
              </div>
            ))}
            <p className="muted" style={{ fontSize: "0.88rem", lineHeight: "1.6", margin: 0 }}>
              {assessment.changedMost}
            </p>
            <p className="muted" style={{ fontSize: "0.85rem", lineHeight: "1.6", margin: 0 }}>
              A short read of the Foundation and completed modules {contextLabel}.
            </p>
          </div>
        </details>
      </section>

      <section className="result-section stack-md">
        <div className="stack-xs">
          <h2>Atlas</h2>
          <p className="muted" style={{ fontSize: "0.9rem", lineHeight: "1.65" }}>
            Atlas gives plain-English names to patterns that show up repeatedly in the current
            model. It is a browsing aid, not a live population map.
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
                <p className="profile-section-kicker">Nearby patterns</p>
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
                    Browse Atlas
                  </Link>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="result-section stack-md">
        <div className="stack-xs">
          <h2>What to open next</h2>
          <p className="muted" style={{ fontSize: "0.9rem", lineHeight: "1.65" }}>
            The profile works best when it gives you one or two clear next moves inside the same map.
          </p>
        </div>
        <div className="profile-next-grid">
          {nextSteps.map((step) => (
            <Link key={step.href} href={step.href} className="profile-next-card stack-xs">
              <span className="profile-next-kicker">{step.kicker}</span>
              <span className="profile-next-title">{step.title}</span>
              <span className="profile-next-text">{step.text}</span>
            </Link>
          ))}
        </div>
        {actionSlot ? <div className="profile-secondary-actions">{actionSlot}</div> : null}
      </section>

      <section className="result-section stack-md">
        <details className="profile-details profile-details--secondary">
          <summary>AI layer detail</summary>
          <div className="stack-md profile-collapsed-detail">
            <div className="stack-xs">
              <h2>AI layer</h2>
              <p className="muted" style={{ fontSize: "0.9rem", lineHeight: "1.65" }}>
                The AI Governance Compass belongs to the same project, but it does not rewrite your
                IR baseline. Read it as a connected layer, not a replacement label.
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
          </div>
        </details>
      </section>

      <section className="result-section stack-md">
        <div className="stack-xs">
          <h2>Issue overlays you&apos;ve completed</h2>
          <p className="muted" style={{ fontSize: "0.9rem", lineHeight: "1.65" }}>
            Each completed IR module sits beside the Foundation as a domain-specific pressure test.
          </p>
        </div>
        {moduleSnapshots.length > 0 ? (
          <details className="profile-details profile-details--secondary">
            <summary>Open issue overlay summaries</summary>
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
                          <div className="progress-meta" style={{ fontSize: "0.78rem" }}>
                            <span>{lane.lowLabel}</span>
                            <span>{lane.highLabel}</span>
                          </div>
                          <p className="muted" style={{ fontSize: "0.84rem", lineHeight: "1.55" }}>
                            {lane.summary}
                          </p>
                          {lane.delta ? (
                            <p className="muted" style={{ fontSize: "0.8rem", lineHeight: "1.5" }}>
                              <strong>Directional pull:</strong> {lane.delta}
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
                  Browse Focus Areas →
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

type MosaicNode = {
  key: "foundation" | "security" | "technology" | "ai"
  label: string
  title: string
  text: string
  status: "anchor" | "reinforces" | "complicates" | "diverges" | "pending"
  statusLabel: string
  pending: boolean
  href?: string
  linkLabel?: string
}

function buildProfileMosaicNodes({
  foundation,
  securitySnapshot,
  technologySnapshot,
  aiSnapshot,
  crossModuleSynthesis,
  mode,
}: {
  foundation: ProfileStore["foundation"]
  securitySnapshot: ModuleSnapshot | null
  technologySnapshot: ModuleSnapshot | null
  aiSnapshot: ProfileStore["aiGovernance"]
  crossModuleSynthesis: ReturnType<typeof getCrossModuleSynthesis>
  mode: "local" | "shared"
}): MosaicNode[] {
  const canLink = mode === "local"

  return [
    {
      key: "foundation",
      label: "Foundation",
      title: foundation ? foundation.familyLabel : "No baseline saved",
      text: foundation
        ? `${foundation.strategyModifier} · ${foundation.normativeModifier}`
        : "Complete the Foundation to anchor the rest of the profile.",
      status: "anchor",
      statusLabel: "Anchor",
      pending: !foundation,
      ...(canLink && foundation?.resultPath
        ? { href: foundation.resultPath, linkLabel: "Open Foundation result →" }
        : {}),
    },
    buildModuleMosaicNode("security", "Security", securitySnapshot, canLink),
    buildModuleMosaicNode("technology", "Technology", technologySnapshot, canLink),
    {
      key: "ai",
      label: "AI Governance",
      title: aiSnapshot ? aiSnapshot.archetypeLabel : "AI layer not yet added",
      text: aiSnapshot
        ? crossModuleSynthesis.shortReadout
        : "Add the AI Governance Compass when you want to see how the baseline travels in frontier AI governance.",
      status: aiSnapshot ? classifyAiState(crossModuleSynthesis) : "pending",
      statusLabel: aiSnapshot ? statusLabelFor(classifyAiState(crossModuleSynthesis)) : "Not yet taken",
      pending: !aiSnapshot,
      ...(canLink && aiSnapshot?.resultPath
        ? { href: aiSnapshot.resultPath, linkLabel: "Open AI result →" }
        : {}),
    },
  ]
}

function buildModuleMosaicNode(
  key: "security" | "technology",
  label: string,
  snapshot: ModuleSnapshot | null,
  canLink: boolean,
): MosaicNode {
  const status = snapshot ? classifyModuleState(snapshot) : "pending"

  return {
    key,
    label,
    title: snapshot ? snapshot.headline : `${label} overlay not yet added`,
    text: snapshot
      ? snapshot.summary
      : `Add the ${label} overlay to see how your Foundation changes once the cases become more concrete.`,
    status,
    statusLabel: statusLabelFor(status),
    pending: !snapshot,
    ...(canLink && snapshot?.resultPath
      ? { href: snapshot.resultPath, linkLabel: "Open overlay result →" }
      : {}),
  }
}

function classifyModuleState(snapshot: ModuleSnapshot): MosaicNode["status"] {
  const comparisonText = `${snapshot.comparison ?? ""} ${snapshot.laneSummaries.map((lane) => lane.delta ?? "").join(" ")}`

  if (/(reinforces|stays visible|still visible|already treats|baseline stays recognizable)/i.test(comparisonText)) {
    return "reinforces"
  }

  if (/(pulls you|harder-edged|more control|more capacity|more coordination|more coalition|more protection|more bounded|more order-first|more crisis-limiting)/i.test(comparisonText)) {
    return "diverges"
  }

  return "complicates"
}

function classifyAiState(
  synthesis: ReturnType<typeof getCrossModuleSynthesis>,
): MosaicNode["status"] {
  return /do not collapse into one ideology/i.test(synthesis.shortReadout)
    ? "complicates"
    : "reinforces"
}

function statusLabelFor(status: MosaicNode["status"]) {
  if (status === "anchor") return "Anchor"
  if (status === "reinforces") return "Reinforces"
  if (status === "complicates") return "Complicates"
  if (status === "diverges") return "Diverges"
  return "Not yet taken"
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
        kicker: "Browse",
        title: "Open the Atlas",
        text: "Use Atlas to compare this profile against nearby recurring patterns in the model.",
        href: "/explore/atlas",
      },
      {
        kicker: "Compare",
        title: "Compare shared profiles",
        text: "Read two saved profiles side by side without turning them into one score.",
        href: "/compare",
      },
    ]
  }

  const steps = []

  if (!securitySnapshot) {
    steps.push({
      kicker: "Next overlay",
      title: "Add Security",
      text: "Pressure-test the baseline in deterrence, alliances, and protection cases.",
      href: `/modules/security?foundation=${encodeURIComponent(foundationPayload)}`,
    })
  }

  if (!technologySnapshot) {
    steps.push({
      kicker: "Next overlay",
      title: "Add Technology",
      text: "See how the baseline changes under industrial policy, controls, and governance pressure.",
      href: `/modules/technology?foundation=${encodeURIComponent(foundationPayload)}`,
    })
  }

  if (!aiSnapshot) {
    steps.push({
      kicker: "Same project",
      title: "Add the AI layer",
      text: "Use the AI Governance Compass as a connected overlay, not a rewritten Foundation label.",
      href: "/ai",
    })
  }

  steps.push({
    kicker: "Browse",
    title: "Open the Atlas",
    text: "Compare this profile against nearby recurring patterns in the model.",
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
          Bars show direction and relative size inside this model, not a fresh score.
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

function getProfileMosaicCoverageText(
  layers: ReturnType<typeof buildProfileSynthesisLite>["layers"],
  mode: "local" | "shared",
) {
  const present = layers.filter((layer) => layer.present).map((layer) => layer.label)
  const missing = layers.filter((layer) => !layer.present).map((layer) => layer.label)

  if (missing.length === 0) {
    return "Built from Foundation, Security, Technology, and AI. The page reads them as one mosaic, not a single score."
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

function getCompletedLayerText(
  layers: ReturnType<typeof buildProfileSynthesisLite>["layers"],
) {
  const present = layers.filter((layer) => layer.present).map((layer) => layer.label)
  const missingCount = layers.length - present.length

  if (missingCount === 0) {
    return `Saved layers: ${formatLabelList(present)}.`
  }

  return `Saved layers: ${formatLabelList(present)}. ${missingCount} layer${missingCount === 1 ? "" : "s"} still open.`
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
