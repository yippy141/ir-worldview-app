import assert from "node:assert/strict"
import { readFileSync } from "node:fs"
import path from "node:path"
import test from "node:test"
import { buildZhHansFoundationResultHeading } from "@/lib/results/zh-hans-foundation-result"

const repositoryRoot = process.cwd()

test("Chinese low-differentiation core heading names both live readings", () => {
  const heading = buildZhHansFoundationResultHeading({
    resultTier: "core",
    questionSet: "core",
    legacy: false,
    lowDifferentiation: true,
    primaryLabel: "战略现实主义",
    runnerUpLabel: "自由制度主义",
  })

  assert.equal(
    heading.title,
    "初步基础读法：战略现实主义与自由制度主义",
  )
  assert.match(heading.eyebrow, /十四道核心题/u)
  assert.match(heading.lead, /这两种读法都仍然成立/u)
  assert.match(heading.lead, /五道定向跟进题/u)
  assert.doesNotMatch(heading.lead, /[0-9]+\.[0-9]+/u)
})

test("Chinese clearer core, targeted, and full headings retain the runner-up and model limit", () => {
  for (const fixture of [
    { resultTier: "core" as const, questionSet: "core" as const, form: "十四道核心题" },
    { resultTier: "extended" as const, questionSet: "targetedExtended" as const, form: "定向扩展题组" },
    { resultTier: "extended" as const, questionSet: "fullExtended" as const, form: "完整扩展题组" },
  ]) {
    const heading = buildZhHansFoundationResultHeading({
      ...fixture,
      legacy: false,
      lowDifferentiation: false,
      primaryLabel: "社会建构主义",
      runnerUpLabel: "战略现实主义",
    })

    assert.match(heading.eyebrow, new RegExp(fixture.form, "u"))
    assert.equal(heading.title, "社会建构主义在这次基础读法中领先")
    assert.match(heading.lead, /只在当前题组中较为清楚/u)
    assert.match(heading.lead, /战略现实主义仍是最近的替代读法/u)
    assert.match(heading.lead, /模型结果/u)
    assert.match(heading.lead, /不代表持久不变的个人特质/u)
  }
})

test("Chinese blend and legacy headings remain distinct", () => {
  const blend = buildZhHansFoundationResultHeading({
    resultTier: "extended",
    questionSet: "fullExtended",
    legacy: false,
    lowDifferentiation: true,
    primaryLabel: "社会建构主义",
    runnerUpLabel: "自由制度主义",
  })
  assert.equal(blend.title, "社会建构主义与自由制度主义仍然接近")
  assert.match(blend.lead, /没有让其中一种读法形成清楚的模型领先/u)

  const legacy = buildZhHansFoundationResultHeading({
    resultTier: "extended",
    questionSet: null,
    legacy: true,
    lowDifferentiation: false,
    primaryLabel: "战略现实主义",
    runnerUpLabel: "自由制度主义",
  })
  assert.equal(legacy.title, "较早版本的基础读法：战略现实主义")
  assert.match(legacy.lead, /无法确认其完整题组与校准元组/u)
  assert.doesNotMatch(legacy.lead, /领先/u)
})

test("Chinese route uses current V5 contribution math and exact local evidence", () => {
  const routeSource = readFileSync(
    path.join(repositoryRoot, "app/[locale]/results/[payload]/page.tsx"),
    "utf8",
  )
  const storySource = readFileSync(
    path.join(
      repositoryRoot,
      "components/i18n/zh-hans-foundation-result-story.tsx",
    ),
    "utf8",
  )
  const combined = `${routeSource}\n${storySource}`

  assert.match(routeSource, /resolved\.payload\.v === 5/u)
  assert.match(routeSource, /decomposeFoundationFamilyDifference/u)
  assert.match(
    storySource,
    /<FoundationLocalEvidence payload=\{props\.payload\} locale="zh-Hans" \/>/u,
  )
  assert.match(storySource, /data-contribution-status="current-v5"/u)
  assert.match(storySource, /data-contribution-status="legacy-unavailable"/u)
  assert.doesNotMatch(
    combined,
    /getDimensionPush|PlacementFirmnessBar|nearestFitGap\.toFixed/u,
  )
  assert.doesNotMatch(
    combined,
    /Firmly fixed|stable enough to argue from|high confidence|validated|reliable/u,
  )
})

test("Chinese story uses localized domain chrome and fails closed on English detail text", () => {
  const storySource = readFileSync(
    path.join(
      repositoryRoot,
      "components/i18n/zh-hans-foundation-result-story.tsx",
    ),
    "utf8",
  )

  for (const copy of [
    "安全",
    "技术与权力",
    "人工智能治理",
    "打开英文结果",
    "打开英文问卷",
  ]) {
    assert.match(storySource, new RegExp(copy, "u"))
  }
  assert.doesNotMatch(
    storySource,
    /Checking this device|No saved Security|Open Technology|Open AI Governance/u,
  )
  assert.match(storySource, /lang="en"/u)
  assert.match(storySource, /规范英文名称/u)
})

test("Chinese story keeps chapter visuals in DOM order across sticky and linear layouts", () => {
  const storySource = readFileSync(
    path.join(
      repositoryRoot,
      "components/i18n/zh-hans-foundation-result-story.tsx",
    ),
    "utf8",
  )
  const stylesSource = readFileSync(
    path.join(
      repositoryRoot,
      "components/i18n/zh-hans-foundation-result-story.module.css",
    ),
    "utf8",
  )

  assert.equal(
    (storySource.match(/data-zh-foundation-sticky-region/g) ?? []).length,
    1,
  )
  assert.match(storySource, /data-zh-foundation-chapter-visual/u)
  assert.doesNotMatch(storySource, /IntersectionObserver|data-enhanced/u)
  assert.match(stylesSource, /@media \(min-width: 768px\)/u)
  assert.match(stylesSource, /\.inlineVisual\s*\{[\s\S]*?position:\s*sticky/u)
  assert.match(stylesSource, /@media \(max-width: 767px\)/u)
  assert.match(stylesSource, /@media \(prefers-reduced-motion: reduce\)/u)
  assert.match(stylesSource, /@media print/u)
  assert.match(stylesSource, /\.inlineVisual\s*\{[\s\S]*?display:\s*block/u)
  assert.match(storySource, /<details className=\{styles\.matrixDisclosure\}>/u)
})

test("Chinese invalid result and editorial ledger remain explicit", () => {
  const routeSource = readFileSync(
    path.join(repositoryRoot, "app/[locale]/results/[payload]/page.tsx"),
    "utf8",
  )
  const ledgerSource = readFileSync(
    path.join(
      repositoryRoot,
      "docs/editorial/V23_6_ROOT_RESULT_COPY_LEDGER.md",
    ),
    "utf8",
  )

  assert.match(routeSource, /共享结果无效/u)
  assert.match(routeSource, /这个链接无法解码/u)
  assert.match(ledgerSource, /## Root/u)
  assert.match(ledgerSource, /## Foundation result headline states/u)
  assert.match(ledgerSource, /Owner note on typography direction/u)
  assert.match(ledgerSource, /Spectral/u)
  assert.match(ledgerSource, /Libre Franklin/u)
  assert.match(ledgerSource, /preference for C/u)
})
