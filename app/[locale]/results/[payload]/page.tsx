import type { Metadata } from "next"
import Link from "next/link"
import { LanguageSwitcher } from "@/components/language-switcher"
import { FoundationProfileSync } from "@/components/profile/foundation-profile-sync"
import {
  ZhHansFoundationResultStory,
  type ZhHansComparisonRow,
} from "@/components/i18n/zh-hans-foundation-result-story"
import { ShareActions } from "@/components/results/share-actions"
import {
  zhHansFoundationDimensionPoles,
  zhHansFoundationQuizUi,
} from "@/content/locales/zh-Hans/foundation-ui"
import { localizedAlternates, publicPath } from "@/i18n/paths"
import {
  buildZhHansFoundationNarrative,
} from "@/lib/narrative/foundation-zh-hans"
import { getComparisonDimensions, getKeyDrivers, getStrongLenses } from "@/lib/result-helpers"
import { decomposeFoundationFamilyDifference } from "@/lib/results/foundation-contributions"
import { resolveFoundationPayload } from "@/lib/share"
import { getV2ScoringCalibration } from "@/lib/scoring"
import {
  lensFromFamily,
  resolveArchetype,
} from "@/lib/archetypes"
import { formatArchetypeDisplayCode } from "@/lib/archetype-display"
import { buildZhHansFoundationResultSocialCopy } from "@/lib/foundation-social-copy"
import type { PureArchetypeCode } from "@/lib/archetype-marks"

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
        scoringCalibration: resolved.scoringCalibration,
      })
    : null
  const archetype = resolved
    ? resolveArchetype(
        resolved.result,
        getV2ScoringCalibration(resolved.scoringCalibration)
          .lowDifferentiationThreshold,
      )
    : null
  const socialCopy = narrative && archetype
    ? buildZhHansFoundationResultSocialCopy(archetype, narrative.summary)
    : null
  const title = socialCopy?.title ?? "共享结果无法读取｜国际关系世界观清单"
  const description = socialCopy?.description ?? "此基础结果链接无法解码。"

  return {
    title,
    description,
    openGraph: {
      title,
      description,
      type: "article",
      url: chinesePath,
    },
    twitter: {
      card: "summary",
      title,
      description,
    },
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

  const { dimensionScores, result, provenance, resultTier } = resolved
  const calibration = getV2ScoringCalibration(resolved.scoringCalibration)
  const lowDifferentiation =
    result.nearestFitGap < calibration.lowDifferentiationThreshold
  const currentPayload = resolved.payload.v === 5
  const narrative = buildZhHansFoundationNarrative({
    familyKey: result.familyKey,
    runnerUpKey: result.runnerUpKey,
    strategyModifier: result.strategyModifier,
    normativeModifier: result.normativeModifier,
    dimensionScores,
    scoringCalibration: resolved.scoringCalibration,
  })
  const archetype = resolveArchetype(
    result,
    calibration.lowDifferentiationThreshold,
  )
  const keyDrivers = getKeyDrivers(dimensionScores)
  const strongLenses = getStrongLenses(dimensionScores)
  const comparisonRows: ZhHansComparisonRow[] = getComparisonDimensions(
    result.familyKey,
    result.runnerUpKey,
    dimensionScores,
  ).map((row) => ({
    key: row.dim,
    label: zhHansFoundationQuizUi.dimensionLabels[row.dim],
    lowLabel: zhHansFoundationDimensionPoles[row.dim].low,
    highLabel: zhHansFoundationDimensionPoles[row.dim].high,
    userScore: row.userScore,
    primaryExpected: row.primaryExpected,
    runnerUpExpected: row.runnerUpExpected,
  }))
  const contribution = currentPayload
    ? decomposeFoundationFamilyDifference({
        dimensionScores,
        calibration: resolved.scoringCalibration,
        primaryFamily: result.familyKey,
        runnerUpFamily: result.runnerUpKey,
      })
    : null
  const primaryMatrixCode = `${lensFromFamily(result.familyKey)}${archetype.posture}` as PureArchetypeCode
  const runnerMatrixCode = `${lensFromFamily(result.runnerUpKey)}${archetype.posture}` as PureArchetypeCode
  const completionLabel = provenance.completionLocale === "zh-Hans"
    ? "此结果由简体中文改编测试版生成"
    : "此共享结果以英文完成，当前页面仅提供经审校的中文结果说明"
  const targetedExtensionHref = `${publicPath("zh-Hans", "/quiz")}?extension=targeted&first=${result.familyKey}&second=${result.runnerUpKey}`
  const fullExtensionHref = `${publicPath("zh-Hans", "/quiz")}?extension=full`
  const nextAction = !currentPayload
    ? {
        href: publicPath("zh-Hans", "/quiz"),
        label: "完成当前基础问卷",
        reason: "较早版本链接没有精确的完成题组元组。重新完成当前问卷后，可查看与本次提交相绑定的解释。",
      }
    : resultTier === "core"
      ? lowDifferentiation
        ? {
            href: targetedExtensionHref,
            label: "回答五道定向题",
            reason: `${narrative.familyLabel}与${narrative.runnerUpLabel}仍然接近。五道跟进题专门检验两者之间的区别。`,
          }
        : {
            href: fullExtensionHref,
            label: "完成全部扩展题",
            reason: "扩展题会为这份核心初步读法增加更多题目依据，同时保留当前结果。",
          }
      : {
          href: publicPath("zh-Hans", "/cases"),
          label: "用一个案例检验这份读法",
          reason: "选择一个有明确证据时间窗的案例，比较具体约束出现时哪些判断仍然成立。",
        }

  return (
    <div className="wide-container locale-foundation-result">
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

      <ZhHansFoundationResultStory
        payload={payload}
        resultTier={resultTier}
        questionSet={resolved.questionSet}
        legacy={!currentPayload}
        lowDifferentiation={lowDifferentiation}
        primaryFamily={result.familyKey}
        primaryLabel={narrative.familyLabel}
        runnerUpFamily={result.runnerUpKey}
        runnerUpLabel={narrative.runnerUpLabel}
        strategyModifier={result.strategyModifier}
        normativeModifier={result.normativeModifier}
        strategyLabel={narrative.strategyLabel}
        normativeLabel={narrative.normativeLabel}
        archetype={archetype}
        archetypeCode={formatArchetypeDisplayCode(archetype.code)}
        primaryMatrixCode={primaryMatrixCode}
        runnerMatrixCode={runnerMatrixCode}
        comparisonRows={comparisonRows}
        contributionRows={contribution?.rows ?? []}
        immediateHeadline={narrative.headline}
        familyMeaning={narrative.sections[0].text}
        strategicMeaning={narrative.sections[2].text}
        caseTest={narrative.sections[3].text}
        nextAction={nextAction}
        completionLabel={completionLabel}
        provenance={{
          instrumentStructuralVersion: provenance.instrumentStructuralVersion,
          scoringVersion: provenance.scoringVersion,
          localeCopyVersion: provenance.localeCopyVersion,
        }}
        utility={
          <>
            <ShareActions
              payload={payload}
              familyLabel={narrative.familyLabel}
              strategyModifier={narrative.strategyLabel}
              normativeModifier={narrative.normativeLabel}
              displayLabel={`${archetype.name} · ${formatArchetypeDisplayCode(archetype.code)} · ${narrative.strategyLabel} · ${narrative.normativeLabel}`}
              locale="zh-Hans"
            />
            <p className="muted">
              中文解释保留既有的经审校基础家族长文。模型规范专名仍以英文显示，并明确标注其编辑状态。
            </p>
            <LanguageSwitcher label="englishPage" className="cta-secondary print-hidden" />
          </>
        }
      />
    </div>
  )
}
