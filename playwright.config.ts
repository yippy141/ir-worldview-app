import { defineConfig, devices } from "@playwright/test"

const e2eChallengeSecret =
  process.env.CURRENT_CASE_CHALLENGE_SECRET ?? Buffer.alloc(32, 29).toString("base64url")
process.env.CURRENT_CASE_CHALLENGE_SECRET = e2eChallengeSecret

export default defineConfig({
  testDir: "./e2e",
  fullyParallel: true,
  forbidOnly: Boolean(process.env.CI),
  retries: process.env.CI ? 2 : 0,
  workers: process.env.CI ? 1 : undefined,
  reporter: "line",
  use: {
    baseURL: "http://127.0.0.1:3000",
    trace: "on-first-retry",
    screenshot: "only-on-failure",
  },
  projects: [
    {
      name: "chromium",
      use: { ...devices["Desktop Chrome"] },
    },
  ],
  webServer: {
    command: "npm run dev -- --hostname 127.0.0.1",
    url: "http://127.0.0.1:3000",
    env: { CURRENT_CASE_CHALLENGE_SECRET: e2eChallengeSecret },
    reuseExistingServer: !process.env.CI,
    timeout: 120_000,
  },
})
