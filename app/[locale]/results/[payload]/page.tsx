import type { Metadata } from "next"
import Link from "next/link"
import { LanguageSwitcher } from "@/components/language-switcher"
import { FoundationProfileSync } from "@/components/profile/foundation-profile-sync"
import { ShareActions } from "@/components/results/share-actions"
import { localizedAlternates, publicPath } from "@/i18n/paths"
import {
  buildZhHansFoundationNarrative,
  zhHansFoundationDimensionRows,
} from "@/lib/narrative/foundation-zh-hans"
import { getKeyDrivers, getStrongLenses } from "@/lib/result-helpers"
import { resolveFoundationPayload } from "@/lib/share"

type Props = {
  params: Promise<{ locale: string; payload: string }>
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { payload } = await params
  const resolved = resolveFoundationPayload(payload)
  const chinesePath = publicPath("zh-Hans", `/results/${payload}`)
  const englishPath = publicPath("en", `/results/${payload}`)
  const narrative = resolved
    ? buildZhHansFoundationNarrative({
        familyKey: resolved.result.familyKey,
        runnerUpKey: resolved.result.runnerUpKey,
        strategyModifier: resolved.result.strategyModifier,
        normativeModifier: resolved.result.normativeModifier,
        dimensionScores: resolved.dimensionScores,
      })
    : null
  const title = narrative
    ? `${narrative.familyLabel}结果｜国际关系世界观清单`
    : "共享结果无法读取｜国际关系世界观清单"
  const description = narrative?.summary ?? "此基础结果链接无法解码。"

  return {
    title,
    description,
    openGraph: { title, description, type: "article" },
    alternates: {
      canonical: chinesePath,
      languages: {
        ...localizedAlternates(`/results/${payload}`),
        en: englishPath,
        "zh-Hans": chinesePath,
      },
    },
  }
}

export default async function ChineseFoundationResultPage({ params }: Props) {
  const { payload } = await params
  const resolved = resolveFoundationPayload(payload)

  if (!resolved) {
    return (
      <div className="container stack-lg result-invalid">
        <section className="panel stack-md">
          <p className="eyebrow">共享结果无效</p>
          <h1>这个链接无法解码。</h1>
          <p className="muted">链接可能不完整、已损坏，或来自无法识别的版本。</p>
          <div className="row gap-sm wrap">
            <Link href="/zh/quiz" className="cta-primary">开始基础问卷</Link>
            <Link href="/zh/method" className="cta-secondary">阅读方法</Link>
            <LanguageSwitcher label="englishPage" className="cta-secondary" />
          </div>
        </section>
      </div>
    )
  }

  const { dimensionScores, result, provenance } = resolved
  const narrative = buildZhHansFoundationNarrative({
    familyKey: result.familyKey,
    runnerUpKey: result.runnerUpKey,
    strategyModifier: result.strategyModifier,
    normativeModifier: result.normativeModifier,
    dimensionScores,
  })
  const dimensions = zhHansFoundationDimensionRows(dimensionScores)
  const keyDrivers = getKeyDrivers(dimensionScores)
  const strongLenses = getStrongLenses(dimensionScores)
  const completionLabel = provenance.completionLocale === "zh-Hans"
    ? "简体中文改编测试版完成记录"
    : "以英文完成的共享结果 · 当前以中文显示"

  return (
    <div className="wide-container locale-foundation-result">
      <article className="result-article">
        <FoundationProfileSync
          snapshot={{
            payload,
            resultPath: publicPath("zh-Hans", `/results/${payload}`),
            familyKey: result.familyKey,
            familyLabel: narrative.familyLabel,
            runnerUpKey: result.runnerUpKey,
            runnerUpLabel: narrative.runnerUpLabel,
            summary: narrative.summary,
            dimensionScores,
            strategyModifier: result.strategyModifier,
            normativeModifier: result.normativeModifier,
            keyDrivers: keyDrivers.map((driver) => ({
              type: driver.type,
              label: driver.label,
              description: driver.description,
            })),
            strongLenses: strongLenses.map((lens) => ({
              label: lens.label,
              description: lens.description,
            })),
          }}
        />

        <header className="result-section stack-lg" aria-labelledby="zh-foundation-result-heading">
          <div className="stack-md">
            <p className="eyebrow">基础画像</p>
            <h1 id="zh-foundation-result-heading" className="result-hero-title">
              {narrative.headline}
            </h1>
            <p className="muted result-lead">{narrative.summary}</p>
            <div className="row gap-sm wrap" aria-label="结果标签">
              <span className="atlas-tag">{narrative.familyLabel}</span>
              <span className="atlas-tag">{narrative.strategyLabel}</span>
              <span className="atlas-tag">{narrative.normativeLabel}</span>
              <span className="atlas-tag">相邻参照：{narrative.runnerUpLabel}</span>
            </div>
          </div>

          <ShareActions
            payload={payload}
            familyLabel={narrative.familyLabel}
            strategyModifier={narrative.strategyLabel}
            normativeModifier={narrative.normativeLabel}
            locale="zh-Hans"
          />
        </header>

        <section className="result-section stack-md" aria-labelledby="zh-result-reading-heading">
          <div className="stack-xs">
            <p className="eyebrow">解释</p>
            <h2 id="zh-result-reading-heading">如何阅读这组结果</h2>
          </div>
          <div className="driver-grid">
            {narrative.sections.map((section) => (
              <section key={section.title} className="driver-card stack-xs">
                <h3>{section.title}</h3>
                <p className="muted">{section.text}</p>
              </section>
            ))}
          </div>
        </section>

        <section className="result-section stack-md" aria-labelledby="zh-dimensions-heading">
          <div className="stack-xs">
            <p className="eyebrow">七维画像</p>
            <h2 id="zh-dimensions-heading">哪些判断把结果拉向不同方向</h2>
            <p className="muted result-note">
              分数表示你在本模型 1 至 7 量尺上的位置，不是百分位，也不是人群中的相对排名。
            </p>
          </div>
          <dl className="locale-profile-dimensions">
            {dimensions.map((dimension) => (
              <div key={dimension.key}>
                <dt>{dimension.label}</dt>
                <dd>
                  <strong>{dimension.score.toFixed(2)} / 7</strong>
                  <span className="muted">{dimension.reading}</span>
                </dd>
              </div>
            ))}
          </dl>
        </section>

        <aside className="result-section stack-md" aria-labelledby="zh-beta-note-heading">
          <div className="stack-xs">
            <p className="eyebrow">版本与边界</p>
            <h2 id="zh-beta-note-heading">{completionLabel}</h2>
            <p className="muted">
              中文版保留共享题目结构与计分规则，但它是经过编辑改编的测试版，尚未被验证为与英文版等价。不同完成语言的数据不会合并使用，也不据此作跨语言比较。
            </p>
            <p className="muted">
              结构版本 {provenance.instrumentStructuralVersion} · 计分版本 {provenance.scoringVersion} · 文案版本 {provenance.localeCopyVersion}
            </p>
          </div>
          <div className="row gap-sm wrap">
            <Link href="/zh/method" className="cta-secondary">阅读方法与局限</Link>
            <Link href="/zh/profile" className="cta-secondary">查看我的画像</Link>
            <LanguageSwitcher label="englishPage" className="cta-secondary" />
          </div>
        </aside>
      </article>
    </div>
  )
}
