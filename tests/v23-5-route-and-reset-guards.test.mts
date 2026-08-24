import test from "node:test"
import assert from "node:assert/strict"
import { readFileSync } from "node:fs"
import { getZhHansWorldStageMenuItems } from "@/content/locales/zh-Hans/world-stage"

function source(relativePath: string) {
  return readFileSync(new URL(`../${relativePath}`, import.meta.url), "utf8")
}

test("English and Chinese home routes derive Current Case availability on every request", () => {
  for (const route of ["app/page.tsx", "app/[locale]/page.tsx"]) {
    const routeSource = source(route)
    assert.match(routeSource, /export const dynamic = "force-dynamic"/)
    assert.doesNotMatch(routeSource, /export const revalidate/)
    assert.match(routeSource, /getActivePublishedLaunchCurrentCase/)
    assert.match(routeSource, /hasActiveCurrentCase=/)
  }

  const inactiveChinese = getZhHansWorldStageMenuItems(false)
  assert.deepEqual(
    inactiveChinese.slice(0, 2).map(({ id, index, label, href, availability }) => ({
      id,
      index,
      label,
      href,
      availability,
    })),
    [
      {
        id: "foundation",
        index: "01",
        label: "基础问卷",
        href: "/quiz",
        availability: "available",
      },
      {
        id: "current-case",
        index: "02",
        label: "近期案例",
        href: "/cases",
        availability: "archive",
      },
    ],
  )
})

test("homepage preview state follows stable menu IDs instead of array positions", () => {
  const component = source("components/home/world-stage/world-stage-home.tsx")
  assert.match(component, /useState<WorldStageMenuId>/)
  assert.match(component, /item\.id === previewItemId/)
  assert.match(component, /hasActiveCurrentCase[\s\S]*review recent cases/)
  assert.doesNotMatch(component, /setPreviewIndex/)
})

test("development-only routes fail closed and remain out of search results", () => {
  for (const route of ["app/learn/page.tsx", "app/world-stage-prototype/page.tsx"]) {
    const routeSource = source(route)
    assert.match(routeSource, /process\.env\.NODE_ENV === "production"/)
    assert.match(routeSource, /notFound\(\)/)
    assert.match(routeSource, /robots:\s*\{ index: false, follow: false \}/)
  }
})

test("result-page feedback invitations match the corrections route boundary", () => {
  const feedback = source("app/feedback/page.tsx")
  assert.match(feedback, /factual, privacy, or security problem/u)
  assert.match(feedback, /does not accept general product submissions/u)

  for (const route of [
    "app/results/[payload]/page.tsx",
    "app/ai/results/[payload]/page.tsx",
  ]) {
    const routeSource = source(route)
    assert.match(routeSource, /Report a factual problem/u)
    assert.doesNotMatch(routeSource, /interface problem/u)
  }
})

test("destructive Foundation, AI, and Perspective resets use an inline confirmation", () => {
  const confirmation = source("components/ui/destructive-action-confirmation.tsx")
  assert.match(confirmation, /role="group"/)
  assert.match(confirmation, /aria-labelledby=/)
  assert.match(confirmation, /if \(hasData\)/)
  assert.doesNotMatch(confirmation, /window\.confirm/)

  for (const componentPath of [
    "components/quiz-app.tsx",
    "components/quiz/review-screen.tsx",
    "components/ai-governance-quiz-app.tsx",
    "components/quiz/ai-governance-review-screen.tsx",
    "components/perspectives/perspective-quiz.tsx",
  ]) {
    const component = source(componentPath)
    assert.match(component, /DestructiveActionConfirmation/, componentPath)
  }

  assert.match(source("components/quiz/review-screen.tsx"), /hasData=\{answeredCount > 0\}/)
  assert.match(
    source("components/quiz/ai-governance-review-screen.tsx"),
    /hasData=\{answeredCount > 0\}/,
  )
})
