import type { Metadata } from "next"
import Link from "next/link"
import { LanguageSwitcher } from "@/components/language-switcher"
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
    ? buildLocalizedProfileShareView(resolved.profile, "zh-Hans")
    : null
  const englishPath = `/profile/share/${payload}`
  const chinesePath = publicPath("zh-Hans", englishPath)

  return {
    title: view
      ? `${view.foundation.familyLabel}｜共享世界观档案`
      : "共享档案无法读取｜国际关系世界观清单",
    description: view?.intro ?? "此共享档案链接无法解码。",
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
    ? buildLocalizedProfileShareView(resolved.profile, "zh-Hans")
    : null

  if (!view) {
    return (
      <div className="container stack-lg result-invalid">
        <section className="panel stack-md">
          <p className="eyebrow">共享档案无效</p>
          <h1>这个链接无法解码。</h1>
          <p className="muted">链接可能不完整、已损坏，或来自无法识别的版本。</p>
          <div className="row gap-sm wrap">
            <Link href="/zh" className="cta-primary">返回中文首页</Link>
            <LanguageSwitcher label="englishPage" className="cta-secondary" />
          </div>
        </section>
      </div>
    )
  }

  return (
    <div className="wide-container locale-profile-share">
      <article className="result-article">
        <header className="result-section stack-md">
          <p className="eyebrow">{view.eyebrow}</p>
          <h1>{view.title}</h1>
          <p className="muted result-lead">{view.intro}</p>
          <div className="row gap-sm wrap">
            <LanguageSwitcher label="englishPage" className="cta-secondary" />
          </div>
        </header>

        <section className="result-section stack-md">
          <div className="stack-xs">
            <p className="eyebrow">{view.foundation.heading}</p>
            <h2>{view.foundation.familyLabel}</h2>
            <p>{view.foundation.summary}</p>
            <p className="muted">最近的相邻参照：{view.foundation.runnerUpLabel}</p>
          </div>
          <div className="row gap-sm wrap" aria-label="结果修饰项">
            {view.foundation.modifiers.map((modifier) => (
              <span key={modifier} className="atlas-tag">{modifier}</span>
            ))}
          </div>
          <dl className="locale-profile-dimensions">
            {view.foundation.dimensions.map((dimension) => (
              <div key={dimension.key}>
                <dt>{dimension.label}</dt>
                <dd>{dimension.score.toFixed(2)} / 7</dd>
              </div>
            ))}
          </dl>
        </section>

        {view.modules.length > 0 ? (
          <section className="result-section stack-md">
            <div className="stack-xs">
              <p className="eyebrow">专题画像</p>
              <h2>情境如何改变侧重点</h2>
            </div>
            <div className="driver-grid">
              {view.modules.map((module) => (
                <article key={module.slug} className="driver-card stack-xs">
                  <h3>{module.title}</h3>
                  <p className="muted">{module.summary}</p>
                </article>
              ))}
            </div>
          </section>
        ) : null}

        {view.ai ? (
          <section className="result-section stack-sm">
            <p className="eyebrow">{view.ai.title}</p>
            <h2>{view.ai.label}</h2>
            <p className="muted">{view.ai.summary}</p>
          </section>
        ) : null}

        {view.perspectives.length > 0 ? (
          <section className="result-section stack-sm">
            <p className="eyebrow">视角演练</p>
            <h2>已保存的情境视角</h2>
            <ul className="content-list">
              {view.perspectives.map((run) => <li key={run.id}>{run.label}</li>)}
            </ul>
          </section>
        ) : null}

        {view.provenanceNotice ? (
          <aside className="callout stack-xs" role="note">
            <p className="eyebrow">版本说明</p>
            <p>{view.provenanceNotice}</p>
          </aside>
        ) : null}
      </article>
    </div>
  )
}
