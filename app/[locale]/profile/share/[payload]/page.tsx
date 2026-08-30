import type { Metadata } from "next"
import Link from "next/link"
import { LanguageSwitcher } from "@/components/language-switcher"
import { ProfileShareActions } from "@/components/profile/profile-share-actions"
import { zhHansProfileRecordsUi } from "@/content/locales/zh-Hans/profile-records"
import { publicPath } from "@/i18n/paths"
import { buildLocalizedProfileShareView } from "@/lib/profile-share-locale"
import { resolveProfileSharePayload } from "@/lib/profile-share"

type Props = {
  params: Promise<{ locale: string; payload: string }>
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { payload } = await params
  const resolved = resolveProfileSharePayload(payload, "zh-Hans")
  const view = resolved
    ? buildLocalizedProfileShareView(resolved.profile, "zh-Hans", {
        preserveUnavailableFoundation:
          resolved.foundationStatus === "unavailable",
      })
    : null
  const englishPath = `/profile/share/${payload}`
  const chinesePath = publicPath("zh-Hans", englishPath)
  const copy = zhHansProfileRecordsUi.share

  return {
    title: view
      ? view.foundation
        ? copy.metadataTitle(view.foundation.archetypeName)
        : copy.unavailableMetadataTitle
      : copy.invalidMetadataTitle,
    description: view
      ? view.foundation
        ? copy.intro
        : copy.unavailableMetadataDescription
      : copy.invalidMetadataDescription,
    robots: { index: false, follow: false },
    alternates: {
      canonical: chinesePath,
      languages: {
        en: englishPath,
        "zh-Hans": chinesePath,
        "x-default": englishPath,
      },
    },
  }
}

export default async function ChineseSharedProfilePage({ params }: Props) {
  const { payload } = await params
  const resolved = resolveProfileSharePayload(payload, "zh-Hans")
  const view = resolved
    ? buildLocalizedProfileShareView(resolved.profile, "zh-Hans", {
        preserveUnavailableFoundation:
          resolved.foundationStatus === "unavailable",
      })
    : null
  const copy = zhHansProfileRecordsUi.share
  const unavailable = zhHansProfileRecordsUi.unavailableFoundation

  if (!view || !resolved) {
    return (
      <div className="container stack-lg result-invalid">
        <section className="panel stack-md">
          <p className="eyebrow">{copy.invalidEyebrow}</p>
          <h1>{copy.invalidTitle}</h1>
          <p className="muted">{copy.invalidBody}</p>
          <div className="row gap-sm wrap">
            <Link href="/zh" className="cta-primary">{copy.home}</Link>
            <LanguageSwitcher label="englishPage" className="cta-secondary" />
          </div>
        </section>
      </div>
    )
  }

  const security = view.modules.find(({ slug }) => slug === "security") ?? null
  const technology = view.modules.find(({ slug }) => slug === "technology") ?? null
  const domains = [
    {
      key: "security",
      label: zhHansProfileRecordsUi.report.domainLabels.security,
      included: Boolean(security),
      result: security ? copy.included : copy.notIncluded,
      summary: security?.summary
        ?? copy.missingDomain(zhHansProfileRecordsUi.report.domainLabels.security),
    },
    {
      key: "technology",
      label: zhHansProfileRecordsUi.report.domainLabels.technology,
      included: Boolean(technology),
      result: technology ? copy.included : copy.notIncluded,
      summary: technology?.summary
        ?? copy.missingDomain(zhHansProfileRecordsUi.report.domainLabels.technology),
    },
    {
      key: "ai-governance",
      label: zhHansProfileRecordsUi.report.domainLabels.ai,
      included: Boolean(view.ai),
      result: view.ai?.label ?? copy.notIncluded,
      summary: view.ai?.summary
        ?? copy.missingDomain(zhHansProfileRecordsUi.report.domainLabels.ai),
    },
  ] as const
  const foundationResultHref = view.foundation && resolved.profile.foundation
    ? publicPath(
        "zh-Hans",
        `/results/${resolved.profile.foundation.payload}`,
      )
    : null
  const nextActions = [
    foundationResultHref
      ? {
          href: foundationResultHref,
          label: copy.openFoundation,
          description: copy.openFoundationDescription,
        }
      : {
          href: publicPath("zh-Hans", "/quiz"),
          label: copy.takeFoundation,
          description: copy.takeFoundationDescription,
        },
    {
      href: publicPath("zh-Hans", "/explore/atlas"),
      label: copy.openAtlas,
      description: copy.openAtlasDescription,
    },
    {
      href: publicPath("zh-Hans", "/cases"),
      label: copy.openCases,
      description: copy.openCasesDescription,
    },
  ]

  return (
    <div className="wide-container locale-profile-share">
      <article className="result-article" data-zh-shared-profile>
        <header className="result-section stack-md">
          <p className="eyebrow">
            {view.foundation ? copy.eyebrow : unavailable.eyebrow}
          </p>
          <h1>{view.foundation ? copy.title : unavailable.title}</h1>
          <p className="muted result-lead">
            {view.foundation ? copy.intro : unavailable.body}
          </p>
          <div className="row gap-sm wrap">
            <LanguageSwitcher label="englishPage" className="cta-secondary" />
          </div>
          <ProfileShareActions
            payload={payload}
            headline={view.foundation?.archetypeName ?? unavailable.title}
            locale="zh-Hans"
          />
        </header>

        <section
          className="result-section stack-md"
          aria-labelledby="zh-shared-profile-foundation"
          data-profile-question="foundation"
        >
          <div className="stack-xs">
            <p className="eyebrow">
              {view.foundation ? copy.foundationEyebrow : unavailable.eyebrow}
            </p>
            <h2 id="zh-shared-profile-foundation">
              {view.foundation ? copy.savedFoundation : unavailable.archivedTitle}
            </h2>
          </div>

          {view.foundation ? (
            <div className="stack-sm">
              <p className="profile-domain-record__result">
                {view.foundation.summary}
              </p>
              <p className="muted">
                {copy.runnerUp}：{view.foundation.runnerUpLabel}
              </p>
              <p className="muted">
                {copy.foundationCanonicalName}：
                <span lang="en">{view.foundation.archetypeName}</span>
                <span> · {view.foundation.archetypeCode}</span>
              </p>
              <p className="muted">{copy.foundationCanonicalNote}</p>
              <div className="row gap-sm wrap" aria-label={copy.modifiersAria}>
                {view.foundation.modifiers.map((modifier) => (
                  <span key={modifier} className="atlas-tag">{modifier}</span>
                ))}
              </div>
            </div>
          ) : (
            <p className="muted">{unavailable.archivedBody}</p>
          )}
        </section>

        <section
          className="result-section stack-md"
          aria-labelledby="zh-shared-profile-domains"
          data-profile-question="domains"
        >
          <div className="stack-xs">
            <p className="eyebrow">{copy.modulesEyebrow}</p>
            <h2 id="zh-shared-profile-domains">{copy.modulesTitle}</h2>
            <p className="muted profile-domain-intro">{copy.domainsNote}</p>
          </div>

          <div className="profile-domain-records">
            {domains.map(({ key, label, included, result, summary }) => (
              <article
                key={key}
                className="profile-domain-record"
                data-profile-domain-slot={key}
                data-record-status={included ? "included" : "not-included"}
              >
                <div className="profile-domain-record__meta">
                  <span>{label}</span>
                  <span>{copy.separateRecord}</span>
                </div>
                <div className="stack-xs">
                  <h3>{label}记录</h3>
                  <p className="profile-domain-record__result">{result}</p>
                  <p className="muted profile-domain-record__summary">{summary}</p>
                </div>
              </article>
            ))}
          </div>
        </section>

        <section
          className="result-section stack-sm"
          aria-labelledby="zh-shared-profile-perspectives"
          data-profile-question="perspectives"
        >
          <p className="eyebrow">{copy.perspectivesEyebrow}</p>
          <h2 id="zh-shared-profile-perspectives">{copy.perspectivesTitle}</h2>
          <p className="muted profile-section-note">{copy.perspectivesNote}</p>
          {view.perspectives.length > 0 ? (
            <ul className="content-list">
              {view.perspectives.map((run) => <li key={run.id}>{run.label}</li>)}
            </ul>
          ) : (
            <p className="muted" data-profile-perspectives-status="not-included">
              {copy.perspectivesEmpty}
            </p>
          )}
        </section>

        <section
          className="result-section stack-sm"
          aria-labelledby="zh-shared-profile-relations"
          data-profile-question="relations"
        >
          <p className="eyebrow">{copy.relationsEyebrow}</p>
          <h2 id="zh-shared-profile-relations" className="profile-section-heading">
            {copy.relationsTitle}
          </h2>
          <div className="callout stack-xs" role="note" data-reviewed-relations="unavailable">
            <p><strong>{copy.relationsUnavailable}</strong></p>
            <p>{copy.relationsNote}</p>
          </div>
        </section>

        <section
          className="result-section stack-md"
          aria-labelledby="zh-shared-profile-next"
          data-profile-question="next"
        >
          <div className="stack-xs">
            <p className="eyebrow">{copy.nextEyebrow}</p>
            <h2 id="zh-shared-profile-next" className="profile-section-heading">
              {copy.nextTitle}
            </h2>
          </div>
          <div className="profile-state-actions" aria-label={copy.nextTitle}>
            {nextActions.map((action, index) => (
              <Link
                key={action.href}
                href={action.href}
                className={`profile-state-action${index === 0 ? " profile-state-action--primary" : ""}`}
              >
                <span className="profile-state-action__label">{action.label}</span>
                <span className="profile-state-action__meta">{action.description}</span>
              </Link>
            ))}
          </div>
        </section>

        {view.provenanceNotice ? (
          <aside className="callout stack-xs" role="note">
            <p className="eyebrow">{copy.provenance}</p>
            <p>{view.provenanceNotice}</p>
          </aside>
        ) : null}
      </article>
    </div>
  )
}
