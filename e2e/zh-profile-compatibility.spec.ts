import { expect, test } from "@playwright/test"
import { aiAxisScoresToArray, encodeAiPayload } from "../lib/ai-governance-share"
import { PROFILE_STORAGE_KEY } from "../lib/storage-keys"
import {
  parseProfileStore,
  serializeProfileStore,
  type ProfileStore,
} from "../lib/profile-store"
import type { PerspectiveRunSnapshot } from "../lib/perspectives/types"
import {
  buildCompatibleProfileSharePayload,
  encodeProfileSharePayload,
} from "../lib/profile-share"
import profileStoreV1 from "../tests/fixtures/profile-store-v1.json"
import profileStoreV3 from "../tests/fixtures/profile-store-v3.json"
import profileStoreV4 from "../tests/fixtures/profile-store-v4.json"

function buildDomainLinkProfile(): string {
  const profile = parseProfileStore(
    JSON.stringify({
      ...profileStoreV4,
      aiGovernance: profileStoreV3.aiGovernance,
    }),
    "zh-Hans",
  )
  return serializeProfileStore(profile)
}

function buildUnresolvableProfile(): { stored: string; sharePath: string } {
  const legacy = parseProfileStore(JSON.stringify(profileStoreV1), "zh-Hans")
  const ai = parseProfileStore(JSON.stringify(profileStoreV3), "zh-Hans")
  const foundation = legacy.foundation
  const security = legacy.modules.security
  const aiGovernance = ai.aiGovernance
  if (!foundation || !security || !aiGovernance) {
    throw new Error("Legacy Profile fixtures did not hydrate.")
  }
  const aiPayload = encodeAiPayload({
    v: 1,
    as: aiAxisScoresToArray(aiGovernance.axisScores),
    ak: aiGovernance.archetypeKey,
    nk: "precautionarySteward",
    rl: aiGovernance.riskLens,
    pm: aiGovernance.paceModifier,
    gm: aiGovernance.geopoliticsModifier,
  })
  const shareableAiGovernance = {
    ...aiGovernance,
    payload: aiPayload,
    resultPath: `/ai/results/${aiPayload}`,
  }

  const perspective: PerspectiveRunSnapshot = {
    id: "legacy-perspective",
    timestamp: 1730000001000,
    perspectiveId: "exposed-ally",
    perspectiveLabel: "Exposed ally or vulnerable small state",
    scenarioSetVersion: 1,
    dimensionScores: foundation.dimensionScores,
    baselineDeltas: {},
    strongestShiftKeys: [],
    resultPath:
      "/perspectives/exposed-ally/result/legacy-perspective-token",
    payload: "legacy-perspective-token",
    locale: "zh-Hans",
    localeCopyVersion: 1,
  }
  const profile: ProfileStore = {
    ...legacy,
    foundationHistory: [
      { ...foundation, timestamp: foundation.timestamp - 1000 },
      foundation,
    ],
    moduleHistory: [
      { ...security, timestamp: security.timestamp - 1000 },
      security,
    ],
    aiGovernance: shareableAiGovernance,
    aiHistory: [
      {
        ...shareableAiGovernance,
        timestamp: shareableAiGovernance.timestamp - 1000,
      },
      shareableAiGovernance,
    ],
    perspectiveRuns: [perspective],
  }
  const sharePayload = buildCompatibleProfileSharePayload(profile)
  if (!sharePayload) {
    throw new Error("Legacy Profile did not produce a compatible share payload.")
  }
  return {
    stored: serializeProfileStore(profile),
    sharePath: `/zh/profile/share/${encodeProfileSharePayload(sharePayload)}`,
  }
}

test("Chinese Profile links translated results once and English-only results canonically", async ({
  page,
}) => {
  await page.addInitScript(
    ({ key, value }) => window.localStorage.setItem(key, value),
    { key: PROFILE_STORAGE_KEY, value: buildDomainLinkProfile() },
  )
  await page.goto("/zh/profile")

  await expect(
    page.getByText(
      "安全、技术、人工智能治理与视角演练的详细结果页目前没有经审校的中文版；相关链接会明确打开英文页面。",
      { exact: true },
    ),
  ).toBeVisible()
  await expect(
    page.getByRole("link", { name: /打开图谱/ }),
  ).toHaveAttribute("href", "/zh/explore/atlas")

  const security = page.locator("article.profile-domain-record").filter({
    has: page.getByRole("heading", { name: "安全记录" }),
  })
  const technology = page.locator("article.profile-domain-record").filter({
    has: page.getByRole("heading", { name: "技术与权力记录" }),
  })
  const ai = page.locator("article.profile-domain-record").filter({
    has: page.getByRole("heading", { name: "人工智能治理记录" }),
  })

  await expect(security.getByRole("link", { name: "打开英文结果" })).toHaveAttribute(
    "href",
    "/modules/security/results/retired-v4-token",
  )
  await expect(technology.getByRole("link", { name: "添加英文结果" })).toHaveAttribute(
    "href",
    "/modules/technology",
  )
  await expect(ai.getByRole("link", { name: "打开英文结果" })).toHaveAttribute(
    "href",
    "/ai/results/legacy-ai-v1",
  )
  for (const link of [security, technology, ai]) {
    await expect(link.locator("a")).not.toHaveAttribute("href", /\/zh\/zh\//)
    await expect(link.locator("a")).not.toHaveAttribute(
      "href",
      /^\/zh\/(?:modules|ai)/,
    )
  }
})

test("legacy Chinese Profiles keep saved records without inventing a Foundation identity", async ({
  page,
}) => {
  const fixture = buildUnresolvableProfile()
  await page.addInitScript(
    ({ key, value }) => window.localStorage.setItem(key, value),
    { key: PROFILE_STORAGE_KEY, value: fixture.stored },
  )
  await page.goto("/zh/profile")

  await expect(
    page.getByRole("heading", { level: 1, name: "保存在这台设备上的画像记录" }),
  ).toBeVisible()
  await expect(page.getByText("你的画像从基础问卷开始。")).toHaveCount(0)
  await expect(
    page.getByRole("heading", { name: "已归档的基础记录" }),
  ).toBeVisible()
  const archivedResult = page.getByRole("link", {
    name: /打开已保存的基础结果/,
  })
  await expect(archivedResult).toHaveAttribute(
    "href",
    "/zh/results/legacy-foundation-v1",
  )
  await expect(archivedResult).not.toHaveAttribute("href", /\/zh\/zh\//)

  await expect(page.getByText("Saved before module overlays were added.")).toHaveCount(0)
  await expect(page.getByRole("heading", { name: "安全记录" })).toBeVisible()
  await expect(page.getByText("协调架构者", { exact: true })).toBeVisible()
  await expect(
    page.getByRole("heading", { name: "已保存的情境视角" }),
  ).toBeVisible()
  await expect(
    page.getByText("处于暴露位置的盟友或脆弱小国", { exact: true }),
  ).toBeVisible()

  await page.getByText("结果历史 · 3 条较早记录", { exact: true }).click()
  await expect(
    page.getByText("以下是当前浏览器保存的较早结果。", { exact: true }),
  ).toBeVisible()
  await expect(page.getByText("Legacy security result", { exact: true })).toHaveCount(0)
  await expect(page.getByText("Coordination Architect", { exact: true })).toHaveCount(0)
  await expect(
    page.getByText(/这份档案包含来自不同语言或文案版本的完成记录/),
  ).toBeVisible()
  await expect(page.getByRole("button", { name: "分享画像" })).toBeVisible()

  await page.goto(fixture.sharePath)
  await expect(
    page.getByRole("heading", { level: 1, name: "基础身份不可用" }),
  ).toBeVisible()
  await expect(page.getByText("这个链接无法解码。")).toHaveCount(0)
  await expect(
    page.getByRole("heading", { name: "已归档的基础记录" }),
  ).toBeVisible()
  await expect(page.getByRole("heading", { name: "安全" })).toBeVisible()
  await expect(page.getByText("协调架构者", { exact: true })).toBeVisible()
  await expect(
    page.getByRole("heading", { name: "这份档案包含哪些情境视角" }),
  ).toBeVisible()
  await expect(page.getByRole("button", { name: "分享画像" })).toBeVisible()
})
