"use client"

import { ConnectedProfile } from "@/components/profile/connected-profile"
import { DomainMark } from "@/components/results/domain-mark"
import { AiArchetypeMark } from "@/components/results/ai-archetype-mark"
import { resolveModulePayload } from "@/lib/modules/framework"
import { buildModuleInterpretation } from "@/lib/results/module-interpretation"
import { buildFoundationInterpretation } from "@/lib/results/foundation-interpretation"
import { buildAiInterpretation } from "@/lib/results/ai-interpretation"
import { resolveAiPayload } from "@/lib/ai-governance-share"
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

  return (
    <article className="result-article result-canvas profile-report">
      <nav className="profile-saved-index" aria-label="Open saved results">
        <span>{mode === "local" ? "Saved on this device" : "Included in this share"}</span>
        {foundation && foundationIdentity && <FoundationProfileResultLink href={foundation.resultPath} snapshot={foundation}>Foundation</FoundationProfileResultLink>}
        {moduleSnapshots.map(snapshot => <Link key={snapshot.slug} href={snapshot.resultPath}>{snapshot.title}</Link>)}
        {profile.aiGovernance && <Link href={profile.aiGovernance.resultPath}>AI Governance</Link>}
      </nav>
      {foundationArchetype && foundationIdentity && displayFoundation ? (
        <ResultCardHero
          eyebrow={mode === "local" ? "Your Foundation result" : "Shared Foundation result"}
          label={foundationArchetype.name}
          accent={FAMILY_ACCENT[foundationIdentity.result.familyKey]}
          modifiers={buildProfileModifiers(
            foundationIdentity.result,
            foundationArchetype.code,
          )}
          summary={buildFoundationInterpretation(foundationIdentity.result.dimensionScores).summary}
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
        <header className="profile-hero profile-hero--saved stack-md">
          <p className="eyebrow">{mode === "local" ? "Saved on this device" : "Shared Profile"}</p>
          <h1>Your saved work</h1>
          <p className="profile-hero-summary">Open a result to inspect its reasoning, or continue with another question.</p>
          {displayFoundation && <div className="stack-sm">
            <h2>Foundation result unavailable</h2>
            <p>The saved Foundation payload cannot be resolved, so this Profile does not infer a replacement reading. Other saved records remain available below.</p>
            <Link href={displayFoundation.resultPath}>Open saved Foundation result</Link>
          </div>}
          {actionSlot}
        </header>
      )}

      <ConnectedProfile profile={profile} mode={mode} />

      <DomainRecordsSection
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



      {mode === "local" ? <ResultHistoryDrawer profile={profile} /> : null}
    </article>
  )
}

function DomainRecordsSection({
  moduleSnapshots,
  aiSnapshot,
  mode,
}: {
  moduleSnapshots: ModuleSnapshot[]
  aiSnapshot: ProfileStore["aiGovernance"]
  mode: "local" | "shared"
}) {
  const aiResolved = aiSnapshot ? resolveAiPayload(aiSnapshot.payload) : null
  const aiInterpretation = aiResolved ? buildAiInterpretation(aiResolved) : null
  const modulesBySlug = Object.fromEntries(
    moduleSnapshots.map((snapshot) => [snapshot.slug, snapshot]),
  ) as Partial<Record<ModuleSnapshot["slug"], ModuleSnapshot>>

  if (moduleSnapshots.length === 0 && !aiSnapshot) return null

  return (
    <section className="result-section stack-md" aria-labelledby="profile-domain-records">
      <div className="stack-xs">
        <h2 id="profile-domain-records" className="profile-section-heading">
          Saved domain results
        </h2>
        <p className="muted profile-domain-intro">
          Each result answers its own set of questions. Open it for the full reading and evidence.
        </p>
      </div>

      <div className="profile-domain-records">
        {(["security", "technology"] as const).map((slug) => {
          const snapshot = modulesBySlug[slug]
          if (!snapshot) return null
          const resolved = snapshot?.payload ? resolveModulePayload(snapshot.payload) : null
          const moduleReading = resolved ? buildModuleInterpretation(resolved.definition, resolved.runtime.buildModuleResult(resolved.definition, resolved.payload.mode, resolved.payload.answers), resolved.runtime.getSelectedModuleOptions(resolved.definition, resolved.payload.mode, resolved.payload.answers).filter(({ question, primary }) => primary && question.cardType !== "actorLens").length, { bankVersion: resolved.bankVersion, scoringVersion: resolved.scoringVersion, mode: resolved.payload.mode, choices: resolved.runtime.getSelectedModuleOptions(resolved.definition, resolved.payload.mode, resolved.payload.answers) }) : null
          const title = slug === "security" ? "Security" : "Technology"


          return (
            <article key={slug} className="profile-domain-record">
              <div className="profile-domain-record__meta">
                <span>{title}</span>
                <span>Saved result</span>
              </div>
              <div className="stack-xs">
                <DomainMark domain={slug} />
                <h3>{snapshot.headline}</h3>
                <p className="muted profile-domain-record__summary">
                  {snapshot
                    ? moduleReading?.summary ?? snapshot.summary
                    : mode === "local"
                      ? `Complete ${title} to add its result here.`
                      : `This shared Profile does not include a ${title} result.`}
                </p>
              </div>
              <Link
                  href={snapshot.resultPath}
                  className="profile-domain-record__link"
                >
                  Open {title} result
                </Link>
            </article>
          )
        })}

        {aiSnapshot && <article className="profile-domain-record">
          <div className="profile-domain-record__meta">
            <span>AI Governance</span>
            <span>Saved result</span>
          </div>
          <div className="stack-xs">
            <AiArchetypeMark archetype={aiSnapshot.archetypeKey} size="compact" />
            <h3>{aiSnapshot.archetypeLabel}</h3>
            <p className="muted profile-domain-record__summary">
              {aiSnapshot
                ? aiInterpretation?.summary ?? aiSnapshot.summary
                : mode === "local"
                  ? "Complete AI Governance to add its result here."
                  : "This shared Profile does not include an AI Governance result."}
            </p>
          </div>
          <Link
              href={aiSnapshot.resultPath}
              className="profile-domain-record__link"
            >
              Open AI Governance result
            </Link>
        </article>}
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
