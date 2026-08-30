"use client"

import Link from "next/link"
import type { ReactNode } from "react"
import { FoundationProfileResultLink } from "@/components/profile/foundation-profile-result-link"
import { PerspectiveRunsSection } from "@/components/profile/perspective-runs-section"
import {
  ResultCardHero,
  type ResultCardAccent,
  type ResultCardModifier,
} from "@/components/results/result-card-hero"
import { normFromNormativeModifier } from "@/lib/archetypes"
import {
  formatArchetypeReadingCode,
  formatArchetypeReadingCodeForSpeech,
  type ArchetypeDisplayCode,
} from "@/lib/archetype-display"
import { formatFieldDate } from "@/lib/field/items"
import { resolveFoundationIdentityFromSnapshot } from "@/lib/profile-foundation-identity"
import type { ProfileShareFoundationRecord } from "@/lib/profile-share"
import { type ModuleSnapshot, type ProfileStore } from "@/lib/profile-store"
import type { CanonicalFoundationResult } from "@/lib/scoring"
import type { FamilyKey } from "@/lib/types"
import { traditionNounLabel } from "@/lib/worldview-config"

const FAMILY_ACCENT: Record<FamilyKey, ResultCardAccent> = {
  realist: "realist",
  institutionalist: "institutionalist",
  constructivist: "constructivist",
  criticalPoliticalEconomy: "cpe",
}

type Props = {
  profile: ProfileStore
  mode: "local" | "shared"
  actionSlot?: ReactNode
  foundationRecord?: ProfileShareFoundationRecord
}

export function ProfileReport({ profile, mode, actionSlot, foundationRecord }: Props) {
  const foundation = profile.foundation
  const displayFoundation = foundation ?? foundationRecord ?? null
  const foundationIdentity = foundation
    ? resolveFoundationIdentityFromSnapshot(foundation)
    : null
  const foundationArchetype = foundationIdentity?.archetype ?? null
  const moduleSnapshots = Object.values(profile.modules)
    .filter((moduleSnapshot): moduleSnapshot is ModuleSnapshot => Boolean(moduleSnapshot))
    .sort((left, right) => right.timestamp - left.timestamp)
  const securitySnapshot = moduleSnapshots.find((snapshot) => snapshot.slug === "security") ?? null
  const technologySnapshot = moduleSnapshots.find((snapshot) => snapshot.slug === "technology") ?? null
  const nextSteps = buildProfileNextSteps({
    foundationPayload: foundationIdentity ? displayFoundation?.payload ?? null : null,
    securitySnapshot,
    technologySnapshot,
    aiSnapshot: profile.aiGovernance,
    mode,
  })

  return (
    <article className="result-article">
      {foundationArchetype && foundationIdentity && displayFoundation ? (
        <ResultCardHero
          eyebrow={mode === "local" ? "Saved Foundation read" : "Shared Foundation read"}
          label={foundationArchetype.name}
          accent={FAMILY_ACCENT[foundationIdentity.result.familyKey]}
          modifiers={buildProfileModifiers(
            foundationIdentity.result,
            foundationArchetype.code,
          )}
          summary={foundationArchetype.gloss}
          actions={
            <>
              {mode === "local" && foundation ? (
                <FoundationProfileResultLink
                  href={displayFoundation.resultPath}
                  snapshot={foundation}
                  className="result-card-hero__primary"
                >
                  Open Foundation result
                </FoundationProfileResultLink>
              ) : (
                <Link
                  href={displayFoundation.resultPath}
                  className="result-card-hero__primary"
                >
                  Open Foundation result
                </Link>
              )}
              {actionSlot}
            </>
          }
        />
      ) : (
        <section className="profile-hero profile-hero--anchored stack-md">
          <div className="profile-hero-head stack-sm">
            <p className="eyebrow">
              {mode === "local" ? "Saved Foundation read" : "Shared Foundation read"}
            </p>
            <h1>
              {displayFoundation
                ? "Foundation result unavailable"
                : "No Foundation read is saved"}
            </h1>
          </div>
          <p className="profile-hero-summary">
            {displayFoundation
              ? "The saved Foundation payload cannot be resolved, so this Profile does not infer a replacement reading. Other saved records remain available below."
              : "This device has no saved Foundation result. Separate domain records and Perspective Runs remain available below when they exist."}
          </p>
          <div className="row gap-sm wrap">
            {mode === "local" ? (
              displayFoundation ? (
                foundation ? (
                  <FoundationProfileResultLink
                    href={displayFoundation.resultPath}
                    snapshot={foundation}
                    className="cta-secondary"
                  >
                    Open saved result
                  </FoundationProfileResultLink>
                ) : (
                  <Link href={displayFoundation.resultPath} className="cta-secondary">
                    Open saved result
                  </Link>
                )
              ) : (
                <Link href="/quiz" className="cta-primary">
                  Start the Foundation
                </Link>
              )
            ) : null}
            {actionSlot}
          </div>
        </section>
      )}

      <DomainRecordsSection
        foundationPayload={foundationIdentity ? displayFoundation?.payload ?? null : null}
        moduleSnapshots={moduleSnapshots}
        aiSnapshot={profile.aiGovernance}
        mode={mode}
      />

      {mode === "shared" && profile.perspectiveRuns.length === 0 ? (
        <section className="result-section stack-sm" aria-labelledby="profile-perspective-runs">
          <p className="eyebrow">Perspective Runs</p>
          <h2 id="profile-perspective-runs" className="profile-section-heading">
            No Perspective Runs are included
          </h2>
          <p className="muted profile-section-note">
            This shared Profile contains no saved Perspective Run record.
          </p>
        </section>
      ) : (
        <PerspectiveRunsSection
          key={`${mode}-${profile.perspectiveRuns.length}`}
          initialRuns={profile.perspectiveRuns}
          baselineScores={foundationIdentity?.result.dimensionScores ?? null}
          mode={mode}
        />
      )}

      <ReviewedRelationsSection />

      <NextActionsSection steps={nextSteps} />

      {mode === "local" ? <ResultHistoryDrawer profile={profile} /> : null}
    </article>
  )
}

function DomainRecordsSection({
  foundationPayload,
  moduleSnapshots,
  aiSnapshot,
  mode,
}: {
  foundationPayload: string | null
  moduleSnapshots: ModuleSnapshot[]
  aiSnapshot: ProfileStore["aiGovernance"]
  mode: "local" | "shared"
}) {
  const modulesBySlug = Object.fromEntries(
    moduleSnapshots.map((snapshot) => [snapshot.slug, snapshot]),
  ) as Partial<Record<ModuleSnapshot["slug"], ModuleSnapshot>>

  return (
    <section className="result-section stack-md" aria-labelledby="profile-domain-records">
      <div className="stack-xs">
        <p className="eyebrow">Domain records</p>
        <h2 id="profile-domain-records" className="profile-section-heading">
          Separate domain records
        </h2>
        <p className="muted profile-domain-intro">
          Foundation and issue records stay separate. Completed Focus Areas and AI results appear beside
          the saved Foundation read; none changes the Foundation result.
        </p>
      </div>

      <div className="profile-domain-records">
        {(["security", "technology"] as const).map((slug) => {
          const snapshot = modulesBySlug[slug]
          const title = slug === "security" ? "Security" : "Technology"
          const startPath = foundationPayload
            ? `/modules/${slug}?foundation=${encodeURIComponent(foundationPayload)}`
            : `/modules/${slug}`

          return (
            <article key={slug} className="profile-domain-record">
              <div className="profile-domain-record__meta">
                <span>{title}</span>
                <span>Separate domain record</span>
              </div>
              <div className="stack-xs">
                <h3>{title} record</h3>
                <p className="profile-domain-record__result">
                  {snapshot
                    ? snapshot.headline
                    : mode === "local"
                      ? "Not saved"
                      : "Not included"}
                </p>
                <p className="muted profile-domain-record__summary">
                  {snapshot
                    ? snapshot.summary
                    : mode === "local"
                      ? `Complete the ${title} inventory to add a separate result here.`
                      : `This shared Profile does not include a ${title} result.`}
                </p>
              </div>
              {mode === "local" ? (
                <Link
                  href={snapshot?.resultPath ?? startPath}
                  className="profile-domain-record__link"
                >
                  {snapshot ? `Open ${title} result` : `Add ${title} result`}
                </Link>
              ) : null}
            </article>
          )
        })}

        <article className="profile-domain-record">
          <div className="profile-domain-record__meta">
            <span>AI Governance</span>
            <span>Separate domain record</span>
          </div>
          <div className="stack-xs">
            <h3>AI Governance record</h3>
            <p className="profile-domain-record__result">
              {aiSnapshot
                ? aiSnapshot.archetypeLabel
                : mode === "local"
                  ? "Not saved"
                  : "Not included"}
            </p>
            <p className="muted profile-domain-record__summary">
              {aiSnapshot
                ? aiSnapshot.summary
                : mode === "local"
                  ? "Complete the AI Governance inventory to add a separate governance result here."
                  : "This shared Profile does not include an AI Governance result."}
            </p>
          </div>
          {mode === "local" ? (
            <Link
              href={aiSnapshot?.resultPath ?? "/ai"}
              className="profile-domain-record__link"
            >
              {aiSnapshot ? "Open AI Governance result" : "Add AI Governance result"}
            </Link>
          ) : null}
        </article>
      </div>
    </section>
  )
}

function ReviewedRelationsSection() {
  return (
    <section className="result-section stack-sm" aria-labelledby="profile-reviewed-relations">
      <p className="eyebrow">Reviewed relations</p>
      <h2 id="profile-reviewed-relations" className="profile-section-heading">
        Reviewed cross-domain relations
      </h2>
      <div className="callout stack-xs" role="note">
        <p><strong>No reviewed cross-domain relation is available.</strong></p>
        <p>
          The Profile keeps each saved record separate and does not infer a relationship from
          similar labels or numbers.
        </p>
      </div>
    </section>
  )
}

function NextActionsSection({ steps }: { steps: ProfileNextStep[] }) {
  return (
    <section className="result-section stack-md" aria-labelledby="profile-next-action">
      <div className="stack-xs">
        <p className="eyebrow">Next action</p>
        <h2 id="profile-next-action" className="profile-section-heading">
          What to open next
        </h2>
      </div>
      <div className="profile-state-actions" aria-label="Recommended next destinations">
        {steps.map((step, index) => (
          <Link
            key={step.href}
            href={step.href}
            className={`profile-state-action${index === 0 ? " profile-state-action--primary" : ""}`}
          >
            <span className="profile-state-action__label">{step.title}</span>
            <span className="profile-state-action__meta">{step.description}</span>
          </Link>
        ))}
      </div>
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
    <section className="result-section stack-sm" aria-label="Saved result history">
      <details className="profile-details profile-details--secondary">
        <summary>
          Result history · {totalEarlier} earlier {totalEarlier === 1 ? "result" : "results"}
        </summary>
        <div className="profile-collapsed-detail stack-sm">
          <p className="muted profile-history-note">Earlier results saved on this device.</p>
          <ul className="profile-history-list">
            {earlierFoundation
              .slice()
              .sort((left, right) => right.timestamp - left.timestamp)
              .map((snapshot) => {
                const identity = resolveFoundationIdentityFromSnapshot(snapshot)
                return (
                  <li key={`f-${snapshot.timestamp}`} className="profile-history-row">
                    <span className="profile-history-row__date">{formatFieldDate(snapshot.timestamp)}</span>
                    <span className="profile-history-row__label">
                      Foundation · {identity?.archetype.name ?? "result unavailable"}
                    </span>
                    <FoundationProfileResultLink
                      href={snapshot.resultPath}
                      snapshot={snapshot}
                      className="profile-history-row__view"
                    >
                      View
                    </FoundationProfileResultLink>
                  </li>
                )
              })}
            {earlierModules
              .slice()
              .sort((left, right) => right.timestamp - left.timestamp)
              .map((snapshot) => (
                <li key={`m-${snapshot.slug}-${snapshot.timestamp}`} className="profile-history-row">
                  <span className="profile-history-row__date">{formatFieldDate(snapshot.timestamp)}</span>
                  <span className="profile-history-row__label">
                    {snapshot.title} · {snapshot.headline}
                  </span>
                  <Link href={snapshot.resultPath} className="profile-history-row__view">
                    View
                  </Link>
                </li>
              ))}
            {earlierAi
              .slice()
              .sort((left, right) => right.timestamp - left.timestamp)
              .map((snapshot) => (
                <li key={`a-${snapshot.timestamp}`} className="profile-history-row">
                  <span className="profile-history-row__date">{formatFieldDate(snapshot.timestamp)}</span>
                  <span className="profile-history-row__label">
                    AI Governance · {snapshot.archetypeLabel}
                  </span>
                  <Link href={snapshot.resultPath} className="profile-history-row__view">
                    View
                  </Link>
                </li>
              ))}
          </ul>
        </div>
      </details>
    </section>
  )
}

function buildProfileModifiers(
  foundation: CanonicalFoundationResult,
  archetypeCode: ArchetypeDisplayCode,
): ResultCardModifier[] {
  const normativeSuffix = normFromNormativeModifier(
    foundation.normativeModifier,
  )
  return [
    {
      label: formatArchetypeReadingCode(archetypeCode, normativeSuffix),
      accessibleLabel: formatArchetypeReadingCodeForSpeech(
        archetypeCode,
        normativeSuffix,
      ),
    },
    `Closest tradition: ${traditionNounLabel(foundation.familyKey)}`,
    `Nearest alternative: ${traditionNounLabel(foundation.runnerUpKey)}`,
  ]
}

type ProfileNextStep = {
  title: string
  description: string
  href: string
}

function buildProfileNextSteps({
  foundationPayload,
  securitySnapshot,
  technologySnapshot,
  aiSnapshot,
  mode,
}: {
  foundationPayload: string | null
  securitySnapshot: ModuleSnapshot | null
  technologySnapshot: ModuleSnapshot | null
  aiSnapshot: ProfileStore["aiGovernance"]
  mode: "local" | "shared"
}): ProfileNextStep[] {
  if (mode === "shared") {
    return [
      {
        title: "Create your own Foundation read",
        description: "Answer the fourteen-question Foundation inventory.",
        href: "/quiz",
      },
      {
        title: "Open Atlas",
        description: "Compare traditions, thinkers, and reviewed public positions.",
        href: "/explore/atlas",
      },
    ]
  }

  const steps: ProfileNextStep[] = []

  if (!foundationPayload) {
    steps.push({
      title: "Start the Foundation",
      description: "Add the broad baseline while keeping existing records separate.",
      href: "/quiz",
    })
  } else {
    if (!securitySnapshot) {
      steps.push({
        title: "Add Security",
        description: "Test the baseline against security policy choices.",
        href: `/modules/security?foundation=${encodeURIComponent(foundationPayload)}`,
      })
    }
    if (!technologySnapshot) {
      steps.push({
        title: "Add Technology",
        description: "Create a separate technology and power record.",
        href: `/modules/technology?foundation=${encodeURIComponent(foundationPayload)}`,
      })
    }
    if (!aiSnapshot) {
      steps.push({
        title: "Add AI Governance",
        description: "Create a separate record for AI governance judgments.",
        href: "/ai",
      })
    }
    if (steps.length === 0) {
      steps.push({
        title: "Open Perspective Runs",
        description: "Test how the saved baseline changes inside another actor's constraints.",
        href: "/perspectives",
      })
    }
  }

  steps.push({
    title: "Open Atlas",
    description: "Use the reference map without assigning a Decision Pattern to this Profile.",
    href: "/explore/atlas",
  })

  return steps.slice(0, 3)
}
