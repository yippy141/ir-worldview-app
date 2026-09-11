import { defineConfig, devices } from "@playwright/test"

export default defineConfig({
  testDir: "./e2e",
  testMatch: "futures-departure.spec.ts",
  workers: 1,
  reporter: "line",
  use: { baseURL: "http://127.0.0.1:3107", trace: "retain-on-failure" },
  projects: [{ name: "chromium", use: { ...devices["Desktop Chrome"] } }],
  webServer: { command: "npm run start -- --hostname 127.0.0.1 --port 3107", url: "http://127.0.0.1:3107", reuseExistingServer: false, timeout: 120_000 },
})
