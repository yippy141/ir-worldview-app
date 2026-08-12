"use client"

import NextLink from "next/link"
import { useEffect, useRef, useState } from "react"
import { Link as LocaleLink } from "@/i18n/navigation"
import { zhHansProfileRecordsUi } from "@/content/locales/zh-Hans/profile-records"
import { ProfileShareActions } from "@/components/profile/profile-share-actions"
import { trackProductEvent } from "@/lib/analytics/adapter"
import { formatFieldDate } from "@/lib/field/items"
import { ACTIVE_MODULE_COMPARISON_STATUS } from "@/lib/modules/types"
import { resolveFoundationIdentityFromSnapshot } from "@/lib/profile-foundation-identity"
import { getProfileResultRoute } from "@/lib/profile-result-routes"
import {
  buildCompatibleProfileSharePayload,
  encodeProfileSharePayload,
} from "@/lib/profile-share"
import { buildLocalizedProfileShareView } from "@/lib/profile-share-locale"
import {
  loadProfileStore,
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

  const view = buildLocalizedProfileShareView(profile, "zh-Hans")
  if (!view || !profile.foundation) {
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
  const comparisonStatus = ACTIVE_MODULE_COMPARISON_STATUS
  const foundationSnapshot = profile.foundation
  const foundationRoute = getProfileResultRoute(
    "foundation",
    foundationSnapshot.resultPath,
  )
  const sharePayload = (() => {
    const payload = buildCompatibleProfileSharePayload(profile)
    return payload ? encodeProfileSharePayload(payload) : null
  })()

  return (
    <article className="result-article locale-profile-share">
      <header className="result-section stack-md">
        <p className="eyebrow">
          {view.foundation ? copy.eyebrow : unavailable.eyebrow}
        </p>
        <h1>
          {view.foundation
            ? copy.title(view.foundation.archetypeName)
            : unavailable.title}
        </h1>
        <p className="muted result-lead">
          {view.foundation ? copy.intro : unavailable.body}
        </p>
      </header>

      {view.foundation ? (
        <section className="result-section stack-md" aria-labelledby="zh-profile-foundation">
          <div className="stack-xs">
            <p className="eyebrow">{copy.foundation}</p>
            <h2 id="zh-profile-foundation">
              {copy.nearest}：{view.foundation.familyLabel}
            </h2>
            <p>{view.foundation.summary}</p>
            <p className="muted">
              {copy.runnerUp}：{view.foundation.runnerUpLabel}
            </p>
          </div>
          <div className="stack-xs">
            <p className="eyebrow">{copy.modifiers}</p>
            <div className="row gap-sm wrap">
              <span className="atlas-tag">
                {copy.archetypeCode}：{view.foundation.archetypeCode}
              </span>
              {view.foundation.modifiers.map((modifier) => (
                <span key={modifier} className="atlas-tag">{modifier}</span>
              ))}
            </div>
          </div>
          <div className="stack-xs">
            <p className="eyebrow">{copy.dimensions}</p>
            <dl className="locale-profile-dimensions">
              {view.foundation.dimensions.map((dimension) => (
                <div key={dimension.key}>
                  <dt>{dimension.label}</dt>
                  <dd>{copy.score(dimension.score)}</dd>
                </div>
              ))}
            </dl>
          </div>
          <div className="row gap-sm wrap">
            <LocaleLink
              href="/explore/atlas?layers=my-profile,atlas-patterns"
              className="cta-primary"
            >
              {copy.map}
            </LocaleLink>
          </div>
        </section>
      ) : (
        <section className="result-section stack-md" aria-labelledby="zh-profile-foundation">
          <div className="stack-xs">
            <p className="eyebrow">{copy.foundation}</p>
            <h2 id="zh-profile-foundation">{unavailable.archivedTitle}</h2>
            <p className="muted">{unavailable.archivedBody}</p>
          </div>
          <LocaleLink href={foundationRoute.href} className="cta-secondary">
            {unavailable.openArchived} →
          </LocaleLink>
        </section>
      )}

      <section className="result-section stack-md" aria-labelledby="zh-profile-domains">
        <div className="stack-xs">
          <p className="eyebrow">{copy.domainsEyebrow}</p>
          <h2 id="zh-profile-domains">{copy.domainsTitle}</h2>
          <p className="muted profile-domain-intro">{copy.domainsNote}</p>
          <p className="muted profile-domain-intro">{copy.englishOnlyDetails}</p>
        </div>

        <div className="profile-domain-status" aria-label={copy.status}>
          <span>
            <strong>{copy.status}</strong>
            <code>{comparisonStatus.kind}</code>
          </span>
          <span>{copy.noNumericBridge}</span>
          <span>{copy.noMasterScore}</span>
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
                <NextLink
                  href={route.href}
                  className="profile-domain-record__link"
                >
                  {snapshot ? copy.openResult : copy.addResult} →
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
                <NextLink
                  href={route.href}
                  className="profile-domain-record__link"
                >
                  {profile.aiGovernance ? copy.openResult : copy.addResult} →
                </NextLink>
              </article>
            )
          })()}
        </div>

        {sharePayload ? (
          <div className="profile-secondary-actions">
            <ProfileShareActions
              payload={sharePayload}
              headline={view.foundation?.archetypeName ?? unavailable.title}
              locale="zh-Hans"
            />
          </div>
        ) : null}
      </section>

      <ZhHansPerspectiveRuns
        profile={profile}
        localizedRuns={view.perspectives}
        foundationAvailable={Boolean(view.foundation)}
      />

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

function ZhHansPerspectiveRuns({
  profile,
  localizedRuns,
  foundationAvailable,
}: {
  profile: ProfileStore
  localizedRuns: Array<{ id: string; label: string }>
  foundationAvailable: boolean
}) {
  const copy = zhHansProfileRecordsUi.report

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

      {profile.perspectiveRuns.length > 0 ? (
        <ul className="profile-run-list">
          {profile.perspectiveRuns
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
  const totalEarlier =
    earlierFoundation.length + earlierModules.length + earlierAi.length

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
                const route = getProfileResultRoute(
                  "foundation",
                  snapshot.resultPath,
                )
                const identity =
                  resolveFoundationIdentityFromSnapshot(snapshot)
                return (
                  <li key={`f-${snapshot.timestamp}`} className="profile-history-row">
                    <span className="profile-history-row__date">
                      {formatFieldDate(snapshot.timestamp, "zh-Hans")}
                    </span>
                    <span className="profile-history-row__label">
                      {copy.historyFoundation} ·{" "}
                      {identity ? copy.saved : copy.historyUnavailable}
                    </span>
                    <LocaleLink href={route.href} className="profile-history-row__view">
                      {copy.historyView}
                    </LocaleLink>
                  </li>
                )
              })}
            {earlierModules
              .slice()
              .sort((left, right) => right.timestamp - left.timestamp)
              .map((snapshot) => {
                const route = getProfileResultRoute(
                  "module",
                  snapshot.resultPath,
                )
                return (
                  <li
                    key={`m-${snapshot.slug}-${snapshot.timestamp}`}
                    className="profile-history-row"
                  >
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
