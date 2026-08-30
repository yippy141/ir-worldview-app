"use client"

import NextLink from "next/link"
import { useEffect, useRef, useState } from "react"
import { Link as LocaleLink } from "@/i18n/navigation"
import { zhHansProfileRecordsUi } from "@/content/locales/zh-Hans/profile-records"
import { FoundationProfileResultLink } from "@/components/profile/foundation-profile-result-link"
import { ProfileShareActions } from "@/components/profile/profile-share-actions"
import { hasAnyCurrentProfileRecord } from "@/components/profile/profile-record-presence"
import { trackProductEvent } from "@/lib/analytics/adapter"
import { formatFieldDate } from "@/lib/field/items"
import { resolveFoundationIdentityFromSnapshot } from "@/lib/profile-foundation-identity"
import {
  getProfileResultHref,
  getProfileResultRoute,
} from "@/lib/profile-result-routes"
import {
  buildCompatibleProfileSharePayload,
  encodeProfileSharePayload,
} from "@/lib/profile-share"
import { buildLocalizedProfileShareView } from "@/lib/profile-share-locale"
import {
  loadProfileStore,
  removePerspectiveRun,
  type ModuleSnapshot,
  type ProfileStore,
} from "@/lib/profile-store"

export function ZhHansProfileDashboard() {
  const [profile, setProfile] = useState<ProfileStore | null>(null)
  const tracked = useRef(false)

  useEffect(() => {
    if (!tracked.current) {
      tracked.current = true
      trackProductEvent("profile_viewed")
    }
    const load = () => setProfile(loadProfileStore("zh-Hans"))
    load()
    window.addEventListener("storage", load)
    return () => window.removeEventListener("storage", load)
  }, [])

  if (profile === null) {
    return (
      <section className="profile-state-panel profile-state-panel--loading stack-md" aria-busy="true">
        <p className="eyebrow">{zhHansProfileRecordsUi.loading.eyebrow}</p>
        <div className="stack-xs">
          <h1>{zhHansProfileRecordsUi.loading.title}</h1>
          <p className="profile-state-panel__body">{zhHansProfileRecordsUi.loading.body}</p>
        </div>
        <div className="profile-state-loading-bar" aria-hidden="true" />
      </section>
    )
  }

  if (!hasAnyCurrentProfileRecord(profile)) {
    return (
      <section className="profile-state-panel profile-state-panel--empty stack-lg">
        <div className="profile-state-panel__intro stack-sm">
          <p className="eyebrow">{zhHansProfileRecordsUi.empty.eyebrow}</p>
          <h1>{zhHansProfileRecordsUi.empty.title}</h1>
          <p className="profile-state-panel__body">{zhHansProfileRecordsUi.empty.body}</p>
        </div>
        <div className="profile-state-actions" aria-label={zhHansProfileRecordsUi.empty.eyebrow}>
          <LocaleLink href="/quiz" className="profile-state-action profile-state-action--primary">
            <span className="profile-state-action__label">{zhHansProfileRecordsUi.empty.action}</span>
          </LocaleLink>
          <LocaleLink href="/explore/atlas" className="profile-state-action">
            <span className="profile-state-action__label">{zhHansProfileRecordsUi.empty.map}</span>
          </LocaleLink>
        </div>
        <p className="profile-state-panel__note">{zhHansProfileRecordsUi.empty.note}</p>
      </section>
    )
  }

  const copy = zhHansProfileRecordsUi.report
  const unavailable = zhHansProfileRecordsUi.unavailableFoundation
  const foundationSnapshot = profile.foundation
  const view = buildLocalizedProfileShareView(profile, "zh-Hans", {
    preserveUnavailableFoundation: true,
  })

  if (!view) return null

  const sharePayload = (() => {
    const payload = buildCompatibleProfileSharePayload(profile)
    return payload ? encodeProfileSharePayload(payload) : null
  })()
  const foundationRoute = foundationSnapshot
    ? getProfileResultRoute("foundation", foundationSnapshot.resultPath)
    : null
  const nextSteps = buildZhHansNextSteps({
    foundationPayload: view.foundation ? foundationSnapshot?.payload ?? null : null,
    securitySnapshot: profile.modules.security ?? null,
    technologySnapshot: profile.modules.technology ?? null,
    aiSnapshot: profile.aiGovernance,
  })

  return (
    <article className="result-article locale-profile-share">
      <header className="result-section stack-md">
        <p className="eyebrow">{copy.eyebrow}</p>
        <h1>{copy.title}</h1>
        <p className="muted result-lead">{copy.intro}</p>
      </header>

      <section className="result-section stack-md" aria-labelledby="zh-profile-foundation">
        <div className="stack-xs">
          <p className="eyebrow">{copy.foundationEyebrow}</p>
          <h2 id="zh-profile-foundation">
            {view.foundation
              ? copy.savedFoundation
              : foundationSnapshot
                ? unavailable.archivedTitle
                : copy.noFoundation}
          </h2>
        </div>

        {view.foundation ? (
          <div className="stack-sm">
            <p className="profile-domain-record__result">
              {copy.foundationRead(
                view.foundation.familyLabel,
                view.foundation.runnerUpLabel,
              )}
            </p>
            <p>{view.foundation.summary}</p>
            <p className="muted">
              {copy.nearest}：{view.foundation.familyLabel}；{copy.runnerUp}：
              {view.foundation.runnerUpLabel}。
            </p>
            {foundationRoute && foundationSnapshot ? (
              <FoundationProfileResultLink
                href={getProfileResultHref(foundationRoute, "zh-Hans")}
                snapshot={foundationSnapshot}
                className="cta-secondary"
              >
                {copy.openFoundation}
              </FoundationProfileResultLink>
            ) : null}
          </div>
        ) : foundationSnapshot ? (
          <div className="stack-sm">
            <p className="muted">{unavailable.archivedBody}</p>
            {foundationRoute ? (
              <FoundationProfileResultLink
                href={getProfileResultHref(foundationRoute, "zh-Hans")}
                snapshot={foundationSnapshot}
                className="cta-secondary"
              >
                {unavailable.openArchived}
              </FoundationProfileResultLink>
            ) : null}
          </div>
        ) : (
          <div className="stack-sm">
            <p className="muted">{copy.noFoundationBody}</p>
            <LocaleLink href="/quiz" className="cta-primary">
              {copy.startFoundation}
            </LocaleLink>
          </div>
        )}

        {sharePayload ? (
          <ProfileShareActions
            payload={sharePayload}
            headline={view.foundation?.familyLabel ?? unavailable.title}
            locale="zh-Hans"
          />
        ) : null}
      </section>

      <ZhHansDomainRecords profile={profile} view={view} />

      <ZhHansPerspectiveRuns
        initialRuns={profile.perspectiveRuns}
        localizedRuns={view.perspectives}
        foundationAvailable={Boolean(view.foundation)}
      />

      <section className="result-section stack-sm" aria-labelledby="zh-profile-relations">
        <p className="eyebrow">{copy.relationsEyebrow}</p>
        <h2 id="zh-profile-relations" className="profile-section-heading">
          {copy.relationsTitle}
        </h2>
        <div className="callout stack-xs" role="note">
          <p><strong>{copy.relationsUnavailable}</strong></p>
          <p>{copy.relationsNote}</p>
        </div>
      </section>

      <section className="result-section stack-md" aria-labelledby="zh-profile-next">
        <div className="stack-xs">
          <p className="eyebrow">{copy.nextEyebrow}</p>
          <h2 id="zh-profile-next" className="profile-section-heading">
            {copy.nextTitle}
          </h2>
        </div>
        <div className="profile-state-actions" aria-label={copy.nextTitle}>
          {nextSteps.map((step, index) => {
            const className = `profile-state-action${index === 0 ? " profile-state-action--primary" : ""}`
            const contents = (
              <>
                <span className="profile-state-action__label">{step.title}</span>
                <span className="profile-state-action__meta">{step.description}</span>
              </>
            )
            return step.englishOnly ? (
              <NextLink key={step.href} href={step.href} className={className}>
                {contents}
              </NextLink>
            ) : (
              <LocaleLink key={step.href} href={step.href} className={className}>
                {contents}
              </LocaleLink>
            )
          })}
        </div>
      </section>

      <ZhHansResultHistory profile={profile} />

      {view.provenanceNotice ? (
        <aside className="callout stack-xs" role="note">
          <p className="eyebrow">{copy.provenance}</p>
          <p>{view.provenanceNotice}</p>
        </aside>
      ) : null}
    </article>
  )
}

function ZhHansDomainRecords({
  profile,
  view,
}: {
  profile: ProfileStore
  view: NonNullable<ReturnType<typeof buildLocalizedProfileShareView>>
}) {
  const copy = zhHansProfileRecordsUi.report

  return (
    <section className="result-section stack-md" aria-labelledby="zh-profile-domains">
      <div className="stack-xs">
        <p className="eyebrow">{copy.domainsEyebrow}</p>
        <h2 id="zh-profile-domains">{copy.domainsTitle}</h2>
        <p className="muted profile-domain-intro">{copy.domainsNote}</p>
        <p className="muted profile-domain-intro">{copy.englishOnlyDetails}</p>
      </div>

      <div className="profile-domain-records">
        {(["security", "technology"] as const).map((slug) => {
          const snapshot = profile.modules[slug]
          const localized = view.modules.find((module) => module.slug === slug)
          const label = copy.domainLabels[slug]
          const route = getProfileResultRoute(
            "module",
            snapshot?.resultPath ?? `/modules/${slug}`,
          )

          return (
            <article key={slug} className="profile-domain-record">
              <div className="profile-domain-record__meta">
                <span>{label}</span>
                <span>{copy.separateRecord}</span>
              </div>
              <div className="stack-xs">
                <h3>{copy.record(label)}</h3>
                <p className="profile-domain-record__result">
                  {snapshot ? copy.saved : copy.notAdded}
                </p>
                <p className="muted profile-domain-record__summary">
                  {localized?.summary ?? copy.missingModule(label)}
                </p>
              </div>
              <NextLink href={route.href} className="profile-domain-record__link">
                {snapshot ? copy.openEnglishResult : copy.addEnglishResult}
              </NextLink>
            </article>
          )
        })}

        {(() => {
          const route = getProfileResultRoute(
            "ai",
            profile.aiGovernance?.resultPath ?? "/ai",
          )
          return (
            <article className="profile-domain-record">
              <div className="profile-domain-record__meta">
                <span>{copy.domainLabels.ai}</span>
                <span>{copy.separateRecord}</span>
              </div>
              <div className="stack-xs">
                <h3>{copy.record(copy.domainLabels.ai)}</h3>
                <p className="profile-domain-record__result">
                  {view.ai?.label ?? copy.notAdded}
                </p>
                <p className="muted profile-domain-record__summary">
                  {view.ai?.summary ?? copy.missingAi}
                </p>
              </div>
              <NextLink href={route.href} className="profile-domain-record__link">
                {profile.aiGovernance ? copy.openEnglishResult : copy.addEnglishResult}
              </NextLink>
            </article>
          )
        })()}
      </div>
    </section>
  )
}

function ZhHansPerspectiveRuns({
  initialRuns,
  localizedRuns,
  foundationAvailable,
}: {
  initialRuns: ProfileStore["perspectiveRuns"]
  localizedRuns: Array<{ id: string; label: string }>
  foundationAvailable: boolean
}) {
  const copy = zhHansProfileRecordsUi.report
  const [runs, setRuns] = useState(initialRuns)
  const [confirmingId, setConfirmingId] = useState<string | null>(null)
  const [storageError, setStorageError] = useState(false)

  function handleRemove(id: string) {
    if (confirmingId !== id) {
      setConfirmingId(id)
      return
    }
    if (!removePerspectiveRun(id)) {
      setStorageError(true)
      return
    }
    setRuns((current) => current.filter((run) => run.id !== id))
    setConfirmingId(null)
  }

  return (
    <section className="result-section stack-md" aria-labelledby="zh-profile-perspectives">
      <div className="stack-xs">
        <p className="eyebrow">{copy.perspectivesEyebrow}</p>
        <h2 id="zh-profile-perspectives">{copy.perspectivesTitle}</h2>
        <p className="muted profile-section-note">
          {foundationAvailable
            ? copy.perspectivesWithBaseline
            : copy.perspectivesWithoutBaseline}
        </p>
      </div>

      {runs.length > 0 ? (
        <ul className="profile-run-list">
          {runs
            .slice()
            .sort((left, right) => right.timestamp - left.timestamp)
            .map((run) => {
              const route = getProfileResultRoute("perspective", run.resultPath)
              const label =
                localizedRuns.find((candidate) => candidate.id === run.id)?.label
                ?? copy.perspectiveUnavailable
              return (
                <li key={run.id} className="profile-run-row">
                  <div className="profile-run-row__main">
                    <p className="profile-run-row__title">{label}</p>
                    <p className="muted profile-run-row__shift">
                      {formatFieldDate(run.timestamp, "zh-Hans")}
                    </p>
                  </div>
                  <div className="profile-run-row__actions">
                    <NextLink href={route.href} className="profile-run-row__view">
                      {copy.openEnglishResult}
                    </NextLink>
                    <button
                      type="button"
                      className="profile-run-row__remove"
                      onClick={() => handleRemove(run.id)}
                      onBlur={() => setConfirmingId((current) => current === run.id ? null : current)}
                    >
                      {confirmingId === run.id ? copy.confirmRemove : copy.remove}
                    </button>
                  </div>
                </li>
              )
            })}
        </ul>
      ) : (
        <div className="stack-sm">
          <p className="muted">{copy.perspectivesEmpty}</p>
          <NextLink href="/perspectives" className="cta-secondary">
            {copy.addEnglishPerspective}
          </NextLink>
        </div>
      )}

      {storageError ? (
        <p className="muted" role="alert">{copy.removeError}</p>
      ) : null}
    </section>
  )
}

function ZhHansResultHistory({ profile }: { profile: ProfileStore }) {
  const copy = zhHansProfileRecordsUi.report
  const earlierFoundation = profile.foundationHistory.filter(
    (snapshot) => snapshot.timestamp !== profile.foundation?.timestamp,
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
  const totalEarlier = earlierFoundation.length + earlierModules.length + earlierAi.length

  if (totalEarlier === 0) return null

  return (
    <section className="result-section stack-sm">
      <details className="profile-details profile-details--secondary">
        <summary>{copy.historyTitle(totalEarlier)}</summary>
        <div className="profile-collapsed-detail stack-sm">
          <p className="muted profile-history-note">{copy.historyNote}</p>
          <ul className="profile-history-list">
            {earlierFoundation
              .slice()
              .sort((left, right) => right.timestamp - left.timestamp)
              .map((snapshot) => {
                const route = getProfileResultRoute("foundation", snapshot.resultPath)
                const identity = resolveFoundationIdentityFromSnapshot(snapshot)
                return (
                  <li key={`f-${snapshot.timestamp}`} className="profile-history-row">
                    <span className="profile-history-row__date">
                      {formatFieldDate(snapshot.timestamp, "zh-Hans")}
                    </span>
                    <span className="profile-history-row__label">
                      {copy.historyFoundation} · {identity ? copy.saved : copy.historyUnavailable}
                    </span>
                    <FoundationProfileResultLink
                      href={getProfileResultHref(route, "zh-Hans")}
                      snapshot={snapshot}
                      className="profile-history-row__view"
                    >
                      {copy.historyView}
                    </FoundationProfileResultLink>
                  </li>
                )
              })}
            {earlierModules
              .slice()
              .sort((left, right) => right.timestamp - left.timestamp)
              .map((snapshot) => {
                const route = getProfileResultRoute("module", snapshot.resultPath)
                return (
                  <li key={`m-${snapshot.slug}-${snapshot.timestamp}`} className="profile-history-row">
                    <span className="profile-history-row__date">
                      {formatFieldDate(snapshot.timestamp, "zh-Hans")}
                    </span>
                    <span className="profile-history-row__label">
                      {copy.domainLabels[snapshot.slug]} · {copy.saved}
                    </span>
                    <NextLink href={route.href} className="profile-history-row__view">
                      {copy.historyView}
                    </NextLink>
                  </li>
                )
              })}
            {earlierAi
              .slice()
              .sort((left, right) => right.timestamp - left.timestamp)
              .map((snapshot) => {
                const route = getProfileResultRoute("ai", snapshot.resultPath)
                return (
                  <li key={`a-${snapshot.timestamp}`} className="profile-history-row">
                    <span className="profile-history-row__date">
                      {formatFieldDate(snapshot.timestamp, "zh-Hans")}
                    </span>
                    <span className="profile-history-row__label">
                      {copy.historyAi} · {copy.saved}
                    </span>
                    <NextLink href={route.href} className="profile-history-row__view">
                      {copy.historyView}
                    </NextLink>
                  </li>
                )
              })}
          </ul>
        </div>
      </details>
    </section>
  )
}

type ZhHansNextStep = {
  title: string
  description: string
  href: string
  englishOnly: boolean
}

function buildZhHansNextSteps({
  foundationPayload,
  securitySnapshot,
  technologySnapshot,
  aiSnapshot,
}: {
  foundationPayload: string | null
  securitySnapshot: ModuleSnapshot | null
  technologySnapshot: ModuleSnapshot | null
  aiSnapshot: ProfileStore["aiGovernance"]
}): ZhHansNextStep[] {
  const copy = zhHansProfileRecordsUi.report
  const steps: ZhHansNextStep[] = []

  if (!foundationPayload) {
    steps.push({
      title: copy.nextFoundation,
      description: copy.nextFoundationDescription,
      href: "/quiz",
      englishOnly: false,
    })
  } else {
    if (!securitySnapshot) {
      steps.push({
        title: copy.nextSecurity,
        description: copy.nextSecurityDescription,
        href: `/modules/security?foundation=${encodeURIComponent(foundationPayload)}`,
        englishOnly: true,
      })
    }
    if (!technologySnapshot) {
      steps.push({
        title: copy.nextTechnology,
        description: copy.nextTechnologyDescription,
        href: `/modules/technology?foundation=${encodeURIComponent(foundationPayload)}`,
        englishOnly: true,
      })
    }
    if (!aiSnapshot) {
      steps.push({
        title: copy.nextAi,
        description: copy.nextAiDescription,
        href: "/ai",
        englishOnly: true,
      })
    }
    if (steps.length === 0) {
      steps.push({
        title: copy.nextPerspectives,
        description: copy.nextPerspectivesDescription,
        href: "/perspectives",
        englishOnly: true,
      })
    }
  }

  steps.push({
    title: copy.nextAtlas,
    description: copy.nextAtlasDescription,
    href: "/explore/atlas",
    englishOnly: false,
  })

  return steps.slice(0, 3)
}
