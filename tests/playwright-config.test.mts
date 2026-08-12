import test from "node:test"
import assert from "node:assert/strict"
import playwrightConfig from "@/playwright.config"

test("Playwright uses one worker and never reuses a branch-stale server", () => {
  assert.equal(playwrightConfig.workers, 1)

  const webServer = playwrightConfig.webServer
  assert.ok(webServer && !Array.isArray(webServer))
  assert.equal(webServer.reuseExistingServer, false)
  assert.equal(
    webServer.command,
    process.env.CI
      ? "npm run start -- --hostname 127.0.0.1"
      : "npm run dev -- --hostname 127.0.0.1",
  )
})
