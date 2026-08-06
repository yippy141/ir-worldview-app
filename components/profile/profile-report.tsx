"use client"

import Link from "next/link"
import type { ReactNode } from "react"
import { PerspectiveRunsSection } from "@/components/profile/perspective-runs-section"
import { ResultCardHero, type ResultCardAccent } from "@/components/results/result-card-hero"
import { formatFieldDate } from "@/lib/field/items"
import { WORLDVIEW_MAP_LABEL } from "@/lib/field/layers"
import { normFromNormativeModifier } from "@/lib/archetypes"
import { ACTIVE_MODULE_COMPARISON_STATUS } from "@/lib/modules/types"
import { resolveFoundationIdentityFromSnapshot } from "@/lib/profile-foundation-identity"
import { type ModuleSnapshot, type ProfileStore } from "@/lib/profile-store"
import type { CanonicalFoundationResult } from "@/lib/scoring"
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
  const aiSnapshot = profile.aiGovernance
  const foundationIdentity = resolveFoundationIdentityFromSnapshot(foundation)
  const foundationArchetype = foundationIdentity?.archetype ?? null
  const securitySnapshot = moduleSnapshots.find((snapshot) => snapshot.slug === "security") ?? null
  const technologySnapshot = moduleSnapshots.find((snapshot) => snapshot.slug === "technology") ?? null
  const nextSteps = buildProfileNextSteps({
    foundationPayload: foundation.payload,
    securitySnapshot,
    technologySnapshot,
    aiSnapshot,
    mode,
  })

  return (
    <article className="result-article">
      {foundationArchetype && foundationIdentity ? (
        <ResultCardHero
          eyebrow={mode === "local" ? "Foundation profile" : "Shared Foundation profile"}
          label={foundationArchetype.name}
          accent={FAMILY_ACCENT[foundationIdentity.result.familyKey]}
          modifiers={buildProfileModifiers(
            foundationIdentity.result,
            foundationArchetype.code,
          )}
          summary={foundationArchetype.gloss}
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
            <p className="eyebrow">{mode === "local" ? "Profile unavailable" : "Shared profile unavailable"}</p>
            <h1>Foundation identity unavailable</h1>
          </div>
          <p className="profile-hero-summary">
            This Profile’s Foundation payload could not be resolved, so no
            archetype has been inferred. The saved result remains unchanged.
          </p>
          {mode === "local" ? (
            <p style={{ margin: 0 }}>
              <Link href={foundation.resultPath} style={{ color: "var(--accent)" }}>
                Open the saved Foundation result →
              </Link>
            </p>
          ) : null}
        </section>
      )}

      <DomainRecordsSection
        foundation={foundation}
        foundationIdentity={foundationIdentity}
        moduleSnapshots={moduleSnapshots}
        aiSnapshot={aiSnapshot}
        mode={mode}
        actionSlot={actionSlot}
      />

      <PerspectiveRunsSection
        key={`${mode}-${profile.perspectiveRuns.length}`}
        initialRuns={profile.perspectiveRuns}
        baselineScores={foundationIdentity?.result.dimensionScores ?? null}
        mode={mode}
      />

      <section className="result-section stack-md">
        <h2 className="profile-section-heading">Results behind this profile</h2>

        <details className="profile-details profile-details--secondary">
          <summary>Decision Patterns</summary>
          <div className="profile-collapsed-detail stack-md">
            <p className="muted" style={{ lineHeight: "1.65", fontSize: "0.9rem", margin: 0 }}>
              Decision Patterns are authored reading aids, not identities
              assigned from this Profile. Browse them as editorial comparisons
              without treating any one pattern as your result.
            </p>
            <div className="atlas-inline-links">
              <Link href="/explore/atlas" style={{ color: "var(--accent)" }}>
                Browse Decision Patterns on the Worldview Map
              </Link>
            </div>
          </div>
        </details>

        <details className="profile-details profile-details--secondary">
          <summary>AI result details</summary>
          <div className="profile-collapsed-detail stack-md">
            {aiSnapshot ? (
              <>
                <div className="row gap-sm wrap">
                  <span className="mode-pill">
                    Foundation: {foundationArchetype?.name ?? "identity unavailable"}
                  </span>
                  <span className="ai-mode-pill">
                    AI result: {aiSnapshot.archetypeLabel}
                  </span>
                </div>

                <div className="stack-xs">
                  <p className="eyebrow">Separate result</p>
                  <p className="muted" style={{ fontSize: "0.9rem", lineHeight: "1.6", margin: 0 }}>
                    The AI result describes a domain-specific governance
                    posture. It does not replace or rename the Foundation
                    archetype.
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
                    ? "No AI Governance result saved yet"
                    : "This shared profile has no AI Governance result"}
                </p>
                  <p className="muted" style={{ lineHeight: "1.65", fontSize: "0.9rem", margin: 0 }}>
                  {mode === "local"
                    ? "Add the AI Governance Compass for a separate domain-specific result."
                    : "This shared profile includes the Foundation and saved Focus Area results."}
                </p>
                {mode === "local" ? (
                  <p style={{ margin: 0 }}>
                    <Link href="/ai" style={{ color: "var(--accent)" }}>
                      Add AI result →
                    </Link>
                  </p>
                ) : null}
              </>
            )}
          </div>
        </details>

        {moduleSnapshots.length > 0 ? (
          <details className="profile-details profile-details--secondary">
            <summary>Completed Focus Areas</summary>
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
                            <span>{lane.score.toFixed(1)}</span>
                          </div>
                          <div className="profile-mini-scale" aria-hidden="true">
                            <div
                              className="profile-mini-scale-fill"
                              style={{
                                width: `${Math.max(0, Math.min(100, ((lane.score - 1) / 6) * 100))}%`,
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
            {foundationIdentity ? (
              <details className="profile-details profile-details--secondary">
                <summary>Foundation result and anchors</summary>
                <div className="profile-collapsed-detail stack-md">
                  <p className="muted" style={{ lineHeight: "1.65", fontSize: "0.9rem", margin: 0 }}>
                    Closest traditions: {foundationIdentity.result.familyLabel} and{" "}
                    {foundationIdentity.result.runnerUpLabel}.
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
                        <p className="eyebrow">Emphasis</p>
                        <p style={{ fontWeight: 600, fontFamily: "Georgia, serif" }}>{lens.label}</p>
                        <p className="muted" style={{ fontSize: "0.86rem", lineHeight: "1.6" }}>
                          {lens.description}
                        </p>
                      </div>
                    ))}
                  </div>
                </div>
              </details>
            ) : (
              <details className="profile-details profile-details--secondary">
                <summary>Archived Foundation record</summary>
                <div className="profile-collapsed-detail stack-sm">
                  <p className="muted" style={{ lineHeight: "1.65", fontSize: "0.9rem", margin: 0 }}>
                    This legacy record’s Foundation token cannot be resolved.
                    Cached family labels and derived anchors are therefore not
                    presented as a current identity.
                  </p>
                  <p style={{ margin: 0 }}>
                    <Link href={foundation.resultPath} style={{ color: "var(--accent)" }}>
                      Open the archived result route →
                    </Link>
                  </p>
                </div>
              </details>
            )}

            <ResultHistoryDrawer profile={profile} />

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

function DomainRecordsSection({
  foundation,
  foundationIdentity,
  moduleSnapshots,
  aiSnapshot,
  mode,
  actionSlot,
}: {
  foundation: NonNullable<ProfileStore["foundation"]>
  foundationIdentity: ReturnType<typeof resolveFoundationIdentityFromSnapshot>
  moduleSnapshots: ModuleSnapshot[]
  aiSnapshot: ProfileStore["aiGovernance"]
  mode: "local" | "shared"
  actionSlot?: ReactNode
}) {
  const comparisonStatus = ACTIVE_MODULE_COMPARISON_STATUS
  const modulesBySlug = Object.fromEntries(
    moduleSnapshots.map((snapshot) => [snapshot.slug, snapshot]),
  ) as Partial<Record<ModuleSnapshot["slug"], ModuleSnapshot>>

  return (
    <section className="result-section stack-md">
      <div className="stack-xs">
        <p className="eyebrow">Profile structure</p>
        <h2 className="profile-section-heading">Foundation and issue records</h2>
        <p className="muted profile-domain-intro">
          Issue results sit beside the Foundation and do not rescore it.
        </p>
      </div>

      <div className="profile-domain-status" aria-label="Issue comparison status">
        <span>
          <strong>Status</strong>
          <code>{comparisonStatus.kind}</code>
        </span>
        <span>
          {comparisonStatus.numericBridge === "none"
            ? "No numeric bridge"
            : comparisonStatus.numericBridge}
        </span>
        <span>
          {comparisonStatus.masterScore === "none"
            ? "No master score"
            : comparisonStatus.masterScore}
        </span>
      </div>

      <div className="profile-domain-records">
        <article className="profile-domain-record">
          <div className="profile-domain-record__meta">
            <span>Foundation</span>
            <span>Primary identity · unchanged</span>
          </div>
          <div className="stack-xs">
            <h3>Foundation record</h3>
            <p className="profile-domain-record__result">
              {foundationIdentity?.archetype.name ?? "Identity unavailable"}
            </p>
            <p className="muted profile-domain-record__summary">
              {foundationIdentity
                ? foundationIdentity.archetype.gloss
                : "The saved Foundation token cannot be resolved, so this record is shown without inferring a replacement identity."}
            </p>
          </div>
          {mode === "local" ? (
            <Link href={foundation.resultPath} className="profile-domain-record__link">
              Open Foundation result →
            </Link>
          ) : null}
        </article>

        {(["security", "technology"] as const).map((slug) => {
          const snapshot = modulesBySlug[slug]
          const title = slug === "security" ? "Security" : "Technology"

          return (
            <article key={slug} className="profile-domain-record">
              <div className="profile-domain-record__meta">
                <span>{title}</span>
                <span>Separate issue record</span>
              </div>
              <div className="stack-xs">
                <h3>{title} record</h3>
                <p className="profile-domain-record__result">
                  {snapshot
                    ? snapshot.headline
                    : mode === "local"
                      ? "Not added"
                      : "Not included"}
                </p>
                <p className="muted profile-domain-record__summary">
                  {snapshot
                    ? snapshot.summary
                    : mode === "local"
                      ? `Add the ${title} Focus Area for a domain-specific result.`
                      : `This shared Profile does not include a ${title} result.`}
                </p>
              </div>
              {mode === "local" ? (
                <Link
                  href={
                    snapshot?.resultPath
                    ?? `/modules/${slug}?foundation=${encodeURIComponent(foundation.payload)}`
                  }
                  className="profile-domain-record__link"
                >
                  {snapshot ? `Open ${title} result →` : `Add ${title} result →`}
                </Link>
              ) : null}
            </article>
          )
        })}

        <article className="profile-domain-record">
          <div className="profile-domain-record__meta">
            <span>AI Governance</span>
            <span>Separate issue record</span>
          </div>
          <div className="stack-xs">
            <h3>AI Governance record</h3>
            <p className="profile-domain-record__result">
              {aiSnapshot
                ? aiSnapshot.archetypeLabel
                : mode === "local"
                  ? "Not added"
                  : "Not included"}
            </p>
            <p className="muted profile-domain-record__summary">
              {aiSnapshot
                ? aiSnapshot.summary
                : mode === "local"
                  ? "Add the AI Governance Compass for a domain-specific governance result."
                  : "This shared Profile does not include an AI Governance result."}
            </p>
          </div>
          {mode === "local" ? (
            <Link
              href={aiSnapshot?.resultPath ?? "/ai"}
              className="profile-domain-record__link"
            >
              {aiSnapshot ? "Open AI result →" : "Add AI result →"}
            </Link>
          ) : null}
        </article>
      </div>

      {actionSlot ? <div className="profile-secondary-actions">{actionSlot}</div> : null}
    </section>
  )
}

function ResultHistoryDrawer({ profile }: { profile: ProfileStore }) {
  const foundation = profile.foundation
  const earlierFoundation = profile.foundationHistory.filter(
    (snapshot) => snapshot.timestamp !== foundation?.timestamp,
  )
  const earlierAi = profile.aiHistory.filter(
    (snapshot) => snapshot.timestamp !== profile.aiGovernance?.timestamp,
  )
  const currentModuleTimestamps = new Set(
    Object.values(profile.modules)
      .filter((snapshot): snapshot is ModuleSnapshot => Boolean(snapshot))
      .map((snapshot) => snapshot.timestamp),
  )
  const earlierModules = profile.moduleHistory.filter(
    (snapshot) => !currentModuleTimestamps.has(snapshot.timestamp),
  )

  const totalEarlier = earlierFoundation.length + earlierAi.length + earlierModules.length
  if (totalEarlier === 0) return null

  return (
    <details className="profile-details profile-details--secondary">
      <summary>Baseline history · {totalEarlier} earlier {totalEarlier === 1 ? "result" : "results"}</summary>
      <div className="profile-collapsed-detail stack-sm">
        <p className="muted profile-history-note">Earlier results saved on this device.</p>
        <ul className="profile-history-list">
          {earlierFoundation
            .slice()
            .sort((a, b) => b.timestamp - a.timestamp)
            .map((snapshot) => {
              const identity =
                resolveFoundationIdentityFromSnapshot(snapshot)
              return (
                <li key={`f-${snapshot.timestamp}`} className="profile-history-row">
                  <span className="profile-history-row__date">{formatFieldDate(snapshot.timestamp)}</span>
                  <span className="profile-history-row__label">
                    Foundation · {identity?.archetype.name ?? "identity unavailable"}
                    {snapshot.mode ? ` · ${snapshot.mode === "analyst" ? "Analyst" : "Standard"}` : ""}
                  </span>
                  <Link href={snapshot.resultPath} className="profile-history-row__view">
                    View
                  </Link>
                </li>
              )
            })}
          {earlierModules
            .slice()
            .sort((a, b) => b.timestamp - a.timestamp)
            .map((snapshot) => (
              <li key={`m-${snapshot.slug}-${snapshot.timestamp}`} className="profile-history-row">
                <span className="profile-history-row__date">{formatFieldDate(snapshot.timestamp)}</span>
                <span className="profile-history-row__label">{snapshot.title} · {snapshot.headline}</span>
                <Link href={snapshot.resultPath} className="profile-history-row__view">
                  View
                </Link>
              </li>
            ))}
          {earlierAi
            .slice()
            .sort((a, b) => b.timestamp - a.timestamp)
            .map((snapshot) => (
              <li key={`a-${snapshot.timestamp}`} className="profile-history-row">
                <span className="profile-history-row__date">{formatFieldDate(snapshot.timestamp)}</span>
                <span className="profile-history-row__label">AI Governance · {snapshot.archetypeLabel}</span>
                <Link href={snapshot.resultPath} className="profile-history-row__view">
                  View
                </Link>
              </li>
            ))}
        </ul>
      </div>
    </details>
  )
}

function buildProfileModifiers(
  foundation: CanonicalFoundationResult,
  archetypeCode: string,
): string[] {
  return [
    `${archetypeCode} / ${normFromNormativeModifier(foundation.normativeModifier)}`,
    `Closest tradition: ${foundation.familyLabel}`,
    foundation.strategyModifier,
    foundation.normativeModifier,
  ]
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
        title: "Open the Worldview Map",
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
      title: "Add Security result",
      href: `/modules/security?foundation=${encodeURIComponent(foundationPayload)}`,
    })
  }

  if (!technologySnapshot) {
    steps.push({
      title: "Add Technology result",
      href: `/modules/technology?foundation=${encodeURIComponent(foundationPayload)}`,
    })
  }

  if (!aiSnapshot) {
    steps.push({
      title: "Add AI result",
      href: "/ai",
    })
  }

  steps.push({
    title: "Try another vantage point",
    href: "/perspectives",
  })

  steps.push({
    title: `Open the ${WORLDVIEW_MAP_LABEL}`,
    href: "/explore/atlas",
  })

  return steps.slice(0, 3)
}
