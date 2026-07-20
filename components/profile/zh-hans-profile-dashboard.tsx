"use client"

import { useEffect, useRef, useState } from "react"
import { Link } from "@/i18n/navigation"
import { zhHansProfileRecordsUi } from "@/content/locales/zh-Hans/profile-records"
import { trackProductEvent } from "@/lib/analytics/adapter"
import { buildLocalizedProfileShareView } from "@/lib/profile-share-locale"
import { loadProfileStore, type ProfileStore } from "@/lib/profile-store"

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
  if (!view) {
    return (
      <section className="profile-state-panel profile-state-panel--empty stack-lg">
        <div className="profile-state-panel__intro stack-sm">
          <p className="eyebrow">{zhHansProfileRecordsUi.empty.eyebrow}</p>
          <h1>{zhHansProfileRecordsUi.empty.title}</h1>
          <p className="profile-state-panel__body">{zhHansProfileRecordsUi.empty.body}</p>
        </div>
        <div className="profile-state-actions" aria-label={zhHansProfileRecordsUi.empty.eyebrow}>
          <Link href="/quiz" className="profile-state-action profile-state-action--primary">
            <span className="profile-state-action__label">{zhHansProfileRecordsUi.empty.action}</span>
          </Link>
          <Link href="/explore/atlas" className="profile-state-action">
            <span className="profile-state-action__label">{zhHansProfileRecordsUi.empty.map}</span>
          </Link>
        </div>
        <p className="profile-state-panel__note">{zhHansProfileRecordsUi.empty.note}</p>
      </section>
    )
  }

  const copy = zhHansProfileRecordsUi.report
  return (
    <article className="result-article locale-profile-share">
      <header className="result-section stack-md">
        <p className="eyebrow">{copy.eyebrow}</p>
        <h1>{copy.title(view.foundation.familyLabel)}</h1>
        <p className="muted result-lead">{copy.intro}</p>
      </header>

      <section className="result-section stack-md" aria-labelledby="zh-profile-foundation">
        <div className="stack-xs">
          <p className="eyebrow">{copy.foundation}</p>
          <h2 id="zh-profile-foundation">{copy.nearest}：{view.foundation.familyLabel}</h2>
          <p>{view.foundation.summary}</p>
          <p className="muted">{copy.runnerUp}：{view.foundation.runnerUpLabel}</p>
        </div>
        <div className="stack-xs">
          <p className="eyebrow">{copy.modifiers}</p>
          <div className="row gap-sm wrap">
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
          <Link href="/explore/atlas?layers=my-profile,atlas-patterns" className="cta-primary">
            {copy.map}
          </Link>
        </div>
      </section>

      {view.provenanceNotice ? (
        <aside className="callout stack-xs" role="note">
          <p className="eyebrow">{copy.provenance}</p>
          <p>{view.provenanceNotice}</p>
        </aside>
      ) : null}
    </article>
  )
}
