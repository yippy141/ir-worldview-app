"use client"

import NextLink from "next/link"
import { useEffect, useState, type CSSProperties, type ReactNode } from "react"
import { FoundationMark } from "@/components/archetypes/archetype-mark"
import { FoundationLocalEvidence } from "@/components/results/foundation-local-evidence"
import { zhHansFoundationQuizUi } from "@/content/locales/zh-Hans/foundation-ui"
import { chineseShellContent } from "@/content/locales/index"
import { ARCHETYPE_MATRIX_CELLS } from "@/lib/field/archetype-matrix"
import type { PureArchetypeCode } from "@/lib/archetype-marks"
import type { Archetype, BlendArchetype } from "@/lib/archetypes"
import {
  emptyProfileStore,
  loadProfileStore,
  type ProfileStore,
} from "@/lib/profile-store"
import type { FoundationContributionRow } from "@/lib/results/foundation-contributions"
import { buildZhHansFoundationResultHeading } from "@/lib/results/zh-hans-foundation-result"
import type {
  FamilyKey,
  FoundationQuestionSet,
  FoundationTier,
  NormativeModifier,
  StrategyModifier,
} from "@/lib/types"
import styles from "./zh-hans-foundation-result-story.module.css"

type ComparisonExpectation = "high" | "neutral" | "low"

export type ZhHansComparisonRow = {
  key: string
  label: string
  lowLabel: string
  highLabel: string
  userScore: number
  primaryExpected: ComparisonExpectation
  runnerUpExpected: ComparisonExpectation
}

type NextAction = {
  href: string
  label: string
  reason: string
}

export type ZhHansFoundationResultStoryProps = {
  payload: string
  resultTier: FoundationTier
  questionSet: FoundationQuestionSet | null
  legacy: boolean
  lowDifferentiation: boolean
  primaryFamily: FamilyKey
  primaryLabel: string
  runnerUpFamily: FamilyKey
  runnerUpLabel: string
  strategyModifier: StrategyModifier
  normativeModifier: NormativeModifier
  strategyLabel: string
  normativeLabel: string
  archetype: Archetype | BlendArchetype
  archetypeCode: string
  primaryMatrixCode: PureArchetypeCode
  runnerMatrixCode: PureArchetypeCode
  comparisonRows: ZhHansComparisonRow[]
  contributionRows: FoundationContributionRow[]
  immediateHeadline: string
  familyMeaning: string
  strategicMeaning: string
  caseTest: string
  nextAction: NextAction
  completionLabel: string
  provenance: {
    instrumentStructuralVersion: number
    scoringVersion: number
    localeCopyVersion: number
  }
  utility: ReactNode
}

export function ZhHansFoundationResultStory(
  props: ZhHansFoundationResultStoryProps,
) {
  const heading = buildZhHansFoundationResultHeading(props)
  const primaryMarkCode = "archetypes" in props.archetype
    ? props.archetype.archetypes.find(
        ({ familyKey }) => familyKey === props.primaryFamily,
      )?.code
    : null

  const chapters: StoryChapterDefinition[] = [
    {
      id: "nearest",
      number: "01",
      title: `当前读法与${props.runnerUpLabel}的差异`,
      copy: (
        <>
          <p>
            先看两组作者设定的参考画像在哪些维度上预期不同，以及你的原始量尺位置。这个比较描述模型轮廓，不把离量尺中点的距离当作分类贡献。
          </p>
          <p>
            下一章会使用本次完成题组所注册的校准和评分函数，逐项展示精确的分类贡献。
          </p>
        </>
      ),
      visualLabel: "最近的模型替代读法",
      renderVisual: () => (
        <ZhHansNearestAlternative
          primaryLabel={props.primaryLabel}
          runnerUpLabel={props.runnerUpLabel}
          rows={props.comparisonRows}
        />
      ),
    },
    {
      id: "contribution",
      number: "02",
      title: "两种读法之间的精确分类贡献",
      copy: (
        <>
          <p>
            每一行都是当前评分函数中“{props.primaryLabel}减去
            {props.runnerUpLabel}”的一项。正值增加前一种读法的相对得分，负值则减少它的相对得分。
          </p>
          <p>
            计算使用本次完成题组所注册的校准。图中不会把原始量尺中点的距离说成分类依据，也不会公开内部的前两名差值。
          </p>
        </>
      ),
      visualLabel: `${props.primaryLabel}减去${props.runnerUpLabel}`,
      renderVisual: () => (
        <ZhHansContributionView
          rows={props.contributionRows}
          primaryLabel={props.primaryLabel}
          runnerUpLabel={props.runnerUpLabel}
          unavailable={props.legacy}
        />
      ),
    },
    {
      id: "matrix",
      number: "03",
      title: "这组读法在注册矩阵中的位置",
      copy: (
        <>
          <p>
            基础模型在四种理论传统和两种克制姿态之间注册了八个参照读法。高亮位置分别表示当前领先家族和最近替代家族在本结果姿态中的位置。
          </p>
          <p>
            这张矩阵只是一套参照系统，不用于给人排序，也不表示任何人口类别。
          </p>
        </>
      ),
      visualLabel: "八个注册基础读法",
      renderVisual: () => (
        <ZhHansArchetypeMatrix
          primaryCode={props.primaryMatrixCode}
          runnerCode={props.runnerMatrixCode}
        />
      ),
    },
    {
      id: "evidence",
      number: "04",
      title: "本次提交中能够显示的具体选择",
      copy: (
        <>
          <p>
            如果结果是在这个浏览器中生成，系统最多会保留三条从确切答案集推导出的本地依据。结果网址不包含这些记录，也不包含原始答案。
          </p>
          <p>
            共享、较早版本、已删除、语言不匹配或完整元组不匹配的记录都会如实显示为不可用。本页不会根据维度汇总分数反推题目依据。
          </p>
        </>
      ),
      visualLabel: "保存在当前设备上的题目依据",
      renderVisual: () => (
        <FoundationLocalEvidence payload={props.payload} locale="zh-Hans" />
      ),
    },
    {
      id: "domains",
      number: "05",
      title: "领域问卷仍是彼此独立的记录",
      copy: (
        <>
          <p>
            安全、技术与权力、人工智能治理分别使用自己的问题和量尺。相近的标签或数值并不会自动构成它们与基础结果之间经过审校的关系。
          </p>
          <p>
            下方只报告当前设备上是否保存了相应记录。详细领域结果尚无经审校的中文长文版本，因此链接会明确标注为英文页面。
          </p>
        </>
      ),
      visualLabel: "当前设备上的独立领域记录",
      renderVisual: () => <ZhHansDomainRecords />,
    },
    {
      id: "case",
      number: "06",
      title: "把基础读法带入一个有证据时间窗的案例",
      copy: (
        <>
          <p>{props.caseTest}</p>
          <p>
            案例用于检验证据条件或实施约束发生变化时，哪项考虑会优先。它不能证明注册名称是一项持久身份。
          </p>
        </>
      ),
      visualLabel: "案例检验",
      renderVisual: () => <ZhHansCasePanel />,
    },
    {
      id: "limits",
      number: "07",
      title: "把方法边界与结果放在一起阅读",
      copy: (
        <>
          <p>
            这项清单把答案与四组作者设定的传统参照画像比较。它不提出信度、效度或人口推断，也不把模型结果解释为持久的个人特质。
          </p>
          <p>
            公开方法页说明基础稳健性诊断，包括构造输入、边界附近更高的结构敏感性，以及完整方法和数据所在的代码仓库。
          </p>
          <p>
            <NextLink href="/zh/method">阅读基础方法与局限</NextLink>
          </p>
        </>
      ),
      visualLabel: "模型范围、诊断与版本",
      renderVisual: () => (
        <ZhHansLimitsPanel
          completionLabel={props.completionLabel}
          provenance={props.provenance}
        />
      ),
    },
  ]

  return (
    <article
      className={styles.story}
      data-zh-foundation-result-story
    >
      <header
        className={styles.hero}
        aria-labelledby="zh-foundation-result-heading"
      >
        <div className={styles.heroCopy}>
          <p className={styles.sectionLabel}>{heading.eyebrow}</p>
          <h1 id="zh-foundation-result-heading" className={styles.headline}>
            {heading.title}
          </h1>
          <p className={styles.lead}>{heading.lead}</p>

          <div className={styles.payoff} aria-label="结果要点">
            <p className={styles.payoffItem}>
              <strong>你会先注意什么</strong>
              <span>{props.immediateHeadline}</span>
              <span>{props.familyMeaning}</span>
            </p>
            <p className={styles.payoffItem}>
              <strong>战略与规范取舍</strong>
              <span>{props.strategicMeaning}</span>
            </p>
          </div>

          {!props.legacy && props.lowDifferentiation && props.resultTier === "core" ? (
            <div className={`${styles.targetedAction} print-hidden`}>
              <NextLink href={props.nextAction.href} className="cta-primary">
                {props.nextAction.label}
              </NextLink>
              <p>{props.nextAction.reason}</p>
            </div>
          ) : null}
        </div>

        <aside className={styles.identity} aria-label="注册读法">
          {primaryMarkCode ? (
            <FoundationMark
              code={props.archetype.code as BlendArchetype["code"]}
              primaryCode={primaryMarkCode}
              presentation="hero"
              className={styles.mark}
            />
          ) : (
            <FoundationMark
              code={props.archetype.code as PureArchetypeCode}
              presentation="hero"
              className={styles.mark}
            />
          )}
          <div className={styles.registered}>
            <p className={styles.registeredLabel}>模型注册名称</p>
            <p className={styles.registeredName} lang="en">
              {props.archetype.name}
            </p>
            <p className={styles.registeredCode}>{props.archetypeCode}</p>
            <p className={styles.registeredNote}>
              原型专名沿用基础模型的规范英文名称；中文专名与原型释义尚未完成编辑审校。
            </p>
            <div className={styles.tags} aria-label="结果标签">
              <span className="atlas-tag">当前参照：{props.primaryLabel}</span>
              <span className="atlas-tag">最近替代：{props.runnerUpLabel}</span>
              <span className="atlas-tag">{props.strategyLabel}</span>
              <span className="atlas-tag">{props.normativeLabel}</span>
            </div>
          </div>
        </aside>
      </header>

      <div className={styles.storyBody}>
        <div
          className={styles.chapters}
          data-zh-foundation-sticky-region
          role="group"
          aria-label="滚动阅读结果章节"
        >
          {chapters.map((chapter) => (
            <StoryChapter key={chapter.id} {...chapter} />
          ))}
        </div>
      </div>

      <footer className={styles.footer}>
        <div>
          <p className={styles.sectionLabel}>从这份结果继续</p>
          <h2>打开下一项记录，或继续核对当前读法。</h2>
        </div>
        <div className={`${styles.actions} print-hidden`}>
          <NextLink href={props.nextAction.href} className="cta-primary">
            {props.nextAction.label}
          </NextLink>
          <NextLink href="/zh/profile" className="cta-secondary">
            查看档案
          </NextLink>
          <NextLink href="/zh/cases" className="cta-secondary">
            打开案例库
          </NextLink>
          <NextLink href="/zh/method" className="cta-secondary">
            阅读方法
          </NextLink>
        </div>
        <p className={styles.visualNote}>{props.nextAction.reason}</p>
        <div className={styles.utility}>{props.utility}</div>
      </footer>
    </article>
  )
}

type StoryChapterDefinition = {
  id: string
  number: string
  title: string
  copy: ReactNode
  visualLabel: string
  renderVisual: () => ReactNode
}

function StoryChapter({
  id,
  number,
  title,
  copy,
  visualLabel,
  renderVisual,
}: StoryChapterDefinition) {
  const headingId = `zh-foundation-story-chapter-${number}`

  return (
    <section
      className={styles.chapter}
      aria-labelledby={headingId}
      data-zh-foundation-story-chapter={id}
    >
      <div className={styles.chapterCopy}>
        <p className={styles.chapterNumber}>第 {number} 章</p>
        <h2 id={headingId} className={styles.chapterTitle}>{title}</h2>
        {copy}
      </div>
      <div className={styles.inlineVisual} data-zh-foundation-chapter-visual>
        <p className={styles.visualLabel}>{visualLabel}</p>
        {renderVisual()}
      </div>
    </section>
  )
}

const EXPECTATION_COPY: Record<ComparisonExpectation, string> = {
  high: "预期偏高",
  neutral: "无明显方向预期",
  low: "预期偏低",
}

function ZhHansNearestAlternative({
  primaryLabel,
  runnerUpLabel,
  rows,
}: {
  primaryLabel: string
  runnerUpLabel: string
  rows: ZhHansComparisonRow[]
}) {
  return (
    <div
      className={styles.tableScroll}
      role="region"
      aria-label={`${primaryLabel}与${runnerUpLabel}的参照画像比较`}
      tabIndex={0}
    >
      <table className={styles.comparisonTable}>
        <caption className="sr-only">
          两种模型传统在预期差异最大的三个维度上的比较
        </caption>
        <thead>
          <tr>
            <th scope="col">维度</th>
            <th scope="col">{primaryLabel}</th>
            <th scope="col">{runnerUpLabel}</th>
            <th scope="col">你的原始位置</th>
          </tr>
        </thead>
        <tbody>
          {rows.map((row) => (
            <tr key={row.key}>
              <th scope="row">
                {row.label}
                <span className={styles.dimensionPoles}>
                  {row.lowLabel} — {row.highLabel}
                </span>
              </th>
              <td>{EXPECTATION_COPY[row.primaryExpected]}</td>
              <td>{EXPECTATION_COPY[row.runnerUpExpected]}</td>
              <td className={styles.numericValue}>{row.userScore.toFixed(1)}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}

function ZhHansContributionView({
  rows,
  primaryLabel,
  runnerUpLabel,
  unavailable,
}: {
  rows: FoundationContributionRow[]
  primaryLabel: string
  runnerUpLabel: string
  unavailable: boolean
}) {
  if (unavailable) {
    return (
      <p
        className={styles.visualNote}
        data-contribution-status="legacy-unavailable"
      >
        这份较早版本结果没有可核对的完整题组元组，因此无法显示精确分类贡献。本页不会根据汇总分数重新构造这些数值。
      </p>
    )
  }

  const maxMagnitude = Math.max(
    ...rows.map((row) => Math.abs(row.signedContribution)),
    Number.EPSILON,
  )

  return (
    <div data-contribution-status="current-v5">
      <ol className={styles.contributionList}>
        {rows.map((row) => {
          const magnitude = Math.abs(row.signedContribution) / maxMagnitude
          const signedValue = `${row.signedContribution >= 0 ? "+" : ""}${row.signedContribution.toFixed(3)}`
          const sign = row.signedContribution >= 0 ? "positive" : "negative"
          const contributionStyle = {
            "--zh-contribution-size": magnitude,
          } as CSSProperties
          const label = zhHansFoundationQuizUi.dimensionLabels[row.dimension]

          return (
            <li key={row.dimension} className={styles.contributionRow}>
              <span className={styles.contributionLabel}>{label}</span>
              <span className={styles.contributionTrack} aria-hidden="true">
                <span
                  className={styles.contributionFill}
                  data-sign={sign}
                  style={contributionStyle}
                />
              </span>
              <span
                className={styles.numericValue}
                aria-label={`${label}的分类贡献为${signedValue}`}
              >
                {signedValue}
              </span>
            </li>
          )
        })}
      </ol>
      <p className={styles.visualNote}>
        正值计入{primaryLabel}，负值计入{runnerUpLabel}。数值保留三位小数；确定性测试另行核对评分函数最后的两位小数舍入步骤。
      </p>
    </div>
  )
}

function ZhHansArchetypeMatrix({
  primaryCode,
  runnerCode,
}: {
  primaryCode: PureArchetypeCode
  runnerCode: PureArchetypeCode
}) {
  const rows = ["+", "-"] as const
  const labels = chineseShellContent.profileShare.familyLabels
  const matrixTable = (
    <table className={styles.matrix}>
      <caption className="sr-only">
        四种模型传统与两种克制姿态组成的八项基础读法矩阵
      </caption>
      <thead>
        <tr>
          <th scope="col">姿态</th>
          <th scope="col">{labels.realist}</th>
          <th scope="col">{labels.institutionalist}</th>
          <th scope="col">{labels.constructivist}</th>
          <th scope="col">{labels.criticalPoliticalEconomy}</th>
        </tr>
      </thead>
      <tbody>
        {rows.map((posture) => (
          <tr key={posture}>
            <th scope="row">
              {posture === "+" ? "运用优势" : "战略克制"}
            </th>
            {ARCHETYPE_MATRIX_CELLS
              .filter((cell) => cell.posture === posture)
              .map((cell) => {
                const active = cell.archetypeCode === primaryCode
                  ? "primary"
                  : cell.archetypeCode === runnerCode
                    ? "runner"
                    : undefined
                const familyLabel = labels[cell.archetype.familyKey]

                return (
                  <td key={cell.archetypeCode} data-active={active}>
                    <span className={styles.matrixCode}>
                      {cell.archetypeCode}
                    </span>
                    <span className={styles.matrixName}>
                      {familyLabel} · {posture === "+" ? "优势" : "克制"}
                    </span>
                  </td>
                )
              })}
          </tr>
        ))}
      </tbody>
    </table>
  )

  return (
    <>
      <div className={`${styles.tableScroll} ${styles.matrixDesktop}`}>
        {matrixTable}
      </div>
      <details className={styles.matrixDisclosure}>
        <summary>展开八项参照矩阵</summary>
        <div className={styles.tableScroll}>{matrixTable}</div>
      </details>
    </>
  )
}

function ZhHansDomainRecords() {
  const [profile, setProfile] = useState<ProfileStore>(() => emptyProfileStore())
  const [ready, setReady] = useState(false)

  useEffect(() => {
    const load = () => {
      setProfile(loadProfileStore("zh-Hans"))
      setReady(true)
    }
    load()
    window.addEventListener("storage", load)
    return () => window.removeEventListener("storage", load)
  }, [])

  const records = [
    {
      key: "security",
      label: "安全",
      record: profile.modules.security ?? null,
      startHref: "/modules/security",
    },
    {
      key: "technology",
      label: "技术与权力",
      record: profile.modules.technology ?? null,
      startHref: "/modules/technology",
    },
    {
      key: "ai-governance",
      label: "人工智能治理",
      record: profile.aiGovernance,
      startHref: "/ai",
    },
  ] as const

  return (
    <div className={styles.domainRecords} aria-live="polite">
      {records.map(({ key, label, record, startHref }) => (
        <article
          key={key}
          className={styles.domainRecord}
          data-domain-record-status={!ready ? "checking" : record ? "saved" : "empty"}
        >
          <h3>{label}</h3>
          {!ready ? (
            <p>正在检查当前设备上的保存记录。</p>
          ) : record ? (
            <>
              <p>当前设备已保存一份独立的{label}记录。</p>
              <NextLink href={record.resultPath}>打开英文结果</NextLink>
            </>
          ) : (
            <>
              <p>当前设备尚无可读取的{label}记录。</p>
              <NextLink href={startHref}>打开英文问卷</NextLink>
            </>
          )}
        </article>
      ))}
    </div>
  )
}

function ZhHansCasePanel() {
  return (
    <article className={styles.casePanel}>
      <p className={styles.caseMeta}>有明确证据时间窗的案例记录</p>
      <h3>选择一个案例，先写下你会作出的决定。</h3>
      <p>
        再比较：当证据窗口或其他实施约束改变时，你是否仍会保留同一个基础判断。
      </p>
      <NextLink href="/zh/cases" className="cta-secondary">
        打开案例库
      </NextLink>
    </article>
  )
}

function ZhHansLimitsPanel({
  completionLabel,
  provenance,
}: {
  completionLabel: string
  provenance: ZhHansFoundationResultStoryProps["provenance"]
}) {
  return (
    <dl className={styles.limits}>
      <div>
        <dt>模型覆盖</dt>
        <dd>
          现实主义、制度主义、建构主义和批判政治经济学四组参照画像。女性主义、后殖民与去殖民、绿色理论和英国学派等路径尚未成为计分家族。
        </dd>
      </div>
      <div>
        <dt>稳健性诊断</dt>
        <dd>
          诊断使用构造输入而非人类参与者，检验确定性的结构敏感性。家族或组合边界附近更不稳定；离开边界后，相关合成组和规范组合组更稳定。
        </dd>
      </div>
      <div>
        <dt>不能据此声称</dt>
        <dd>不据此提出信度、效度或人口层面的结论。</dd>
      </div>
      <div>
        <dt>原始克制量尺</dt>
        <dd>
          注册的克制姿态分界不表示完整题组以该原始数值为对称中心。
        </dd>
      </div>
      <div>
        <dt>中文与版本</dt>
        <dd>
          {completionLabel}。中文版保留共享题目结构与评分规则，但它是经过编辑改编的测试版，尚未被证明与英文版等价。不同完成语言不会据此作直接比较。
          <span className={styles.versionLine}>
            结构版本 {provenance.instrumentStructuralVersion} · 评分版本 {provenance.scoringVersion} · 中文文案版本 {provenance.localeCopyVersion}
          </span>
        </dd>
      </div>
      <div>
        <dt>完整记录</dt>
        <dd>
          <NextLink
            href="https://github.com/yippy141/ir-worldview-app/tree/main/docs/research/v23-6-foundation-robustness"
          >
            在代码仓库中查看精确方法与诊断数据
          </NextLink>
        </dd>
      </div>
    </dl>
  )
}
