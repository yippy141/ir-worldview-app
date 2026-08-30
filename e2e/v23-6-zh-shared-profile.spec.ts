import { expect, test } from "@playwright/test"
import { AI_GOVERNANCE_V22_TUPLE } from "../lib/ai-governance-versions"
import { encodeAiPayload } from "../lib/ai-governance-share"
import {
  buildCompatibleProfileSharePayload,
  encodeProfileSharePayload,
} from "../lib/profile-share"
import {
  parseProfileStore,
  type ProfileStore,
} from "../lib/profile-store"
import profileStoreV2 from "../tests/fixtures/profile-store-v2.json"
import profileStoreV3 from "../tests/fixtures/profile-store-v3.json"
import profileStoreV4 from "../tests/fixtures/profile-store-v4.json"
import profileStoreV5 from "../tests/fixtures/profile-store-v5.json"

function encodeSharedProfile(profile: ProfileStore) {
  const payload = buildCompatibleProfileSharePayload(profile)
  if (!payload) throw new Error("Expected a compatible shared Profile payload.")
  return encodeProfileSharePayload(payload)
}

const foundationOnlyProfile = parseProfileStore(
  JSON.stringify(profileStoreV5),
  "zh-Hans",
)
const EMPTY_DOMAIN_PROFILE = encodeSharedProfile(foundationOnlyProfile)

const security = parseProfileStore(
  JSON.stringify(profileStoreV4),
  "zh-Hans",
).modules.security
const technology = parseProfileStore(
  JSON.stringify(profileStoreV2),
  "zh-Hans",
).modules.technology
const aiGovernance = parseProfileStore(
  JSON.stringify(profileStoreV3),
  "zh-Hans",
).aiGovernance

const AI_DOMAIN_PAYLOAD = encodeAiPayload({
  v: 2,
  bv: AI_GOVERNANCE_V22_TUPLE.bankVersion,
  sv: AI_GOVERNANCE_V22_TUPLE.scoringVersion,
  as: [4.2, 5.1, 6, 3.8, 4.6, 2.9, 5.4, 4],
  ak: "coordinationArchitect",
  nk: "stateCapacityBuilder",
  rl: "Frontier-risk first",
  pm: "Threshold guardrails",
  gm: "Coordination-first",
})

if (!security || !technology || !aiGovernance) {
  throw new Error("Shared Profile domain fixtures did not hydrate.")
}

const COMPLETE_DOMAIN_PROFILE = encodeSharedProfile({
  ...foundationOnlyProfile,
  modules: { security, technology },
  moduleHistory: [],
  aiGovernance: {
    ...aiGovernance,
    payload: AI_DOMAIN_PAYLOAD,
    resultPath: `/ai/results/${AI_DOMAIN_PAYLOAD}`,
  },
  aiHistory: [],
})

test.describe("V23.6 Simplified Chinese shared Profile", () => {
  test.use({ viewport: { width: 390, height: 844 } })

  test("foundation-only share keeps all five questions and empty slots visible", async ({ page }) => {
    await page.goto(`/zh/profile/share/${EMPTY_DOMAIN_PROFILE}`)

    await expect(page.getByRole("heading", {
      level: 1,
      name: "共享的画像记录",
    })).toBeVisible()
    await expect(page.locator("[data-profile-question]"))
      .toHaveCount(5)
    await expect(page.locator("[data-profile-domain-slot]"))
      .toHaveCount(3)
    await expect(page.locator('[data-profile-domain-slot][data-record-status="not-included"]'))
      .toHaveCount(3)
    await expect(page.locator('[data-profile-perspectives-status="not-included"]'))
      .toContainText("没有包含情境视角记录")
    await expect(page.locator('[data-reviewed-relations="unavailable"]'))
      .toContainText("目前没有经过审校、可在此展示的跨领域关系")
    await expect(page.getByRole("heading", { name: "接下来应该打开什么" }))
      .toBeVisible()
    await expect(page.getByRole("link", { name: /打开完整基础结果/ }))
      .toHaveAttribute("href", /^\/zh\/results\//u)

    const body = await page.locator("main").innerText()
    expect(body).not.toContain("无数值桥接")
    expect(body).not.toContain("无总分")
    expect(body).not.toContain("Separate domain records")
    const width = await page.evaluate(() => ({
      scrollWidth: document.documentElement.scrollWidth,
      clientWidth: document.documentElement.clientWidth,
    }))
    expect(width.scrollWidth).toBeLessThanOrEqual(width.clientWidth)
  })

  test("share with domain records reports each one without inferring a relation", async ({ page }) => {
    await page.goto(`/zh/profile/share/${COMPLETE_DOMAIN_PROFILE}`)

    await expect(page.locator('[data-profile-domain-slot][data-record-status="included"]'))
      .toHaveCount(3)
    await expect(page.locator('[data-profile-domain-slot="security"]'))
      .toContainText("已包含")
    await expect(page.locator('[data-profile-domain-slot="technology"]'))
      .toContainText("已包含")
    await expect(page.locator('[data-profile-domain-slot="ai-governance"]'))
      .toContainText("协调架构者")
    await expect(page.locator('[data-reviewed-relations="unavailable"]'))
      .toContainText("不会因为标签或数值相近而自行推断")
    await expect(page.getByRole("heading", { name: "这份档案包含哪些情境视角" }))
      .toBeVisible()
    await expect(page.locator('[data-profile-perspectives-status="not-included"]'))
      .toBeVisible()

    const body = await page.locator("main").innerText()
    expect(body).not.toContain("Legacy security result")
    expect(body).not.toContain("Coordination Architect")
    expect(body).not.toContain("无数值桥接")
    expect(body).not.toContain("无总分")
  })
})
