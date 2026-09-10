import { defineConfig } from "@playwright/test"

const external = process.env.JOURNEY_BASE_URL
export default defineConfig({
  testDir: "./e2e",
  testMatch: ["module-journey.spec.ts", "v23-5-module-flow.spec.ts"],
  workers: 1,
  retries: 0,
  reporter: "list",
  outputDir: "test-results/module-journey",
  use: { baseURL: external ?? "http://127.0.0.1:3240", viewport: { width: 1440, height: 900 }, trace: "retain-on-failure" },
  projects: [{ name: "chromium", use: { browserName: "chromium" } }, { name: "webkit", use: { browserName: "webkit" } }],
  webServer: external ? undefined : {
    command: "npm run start -- --hostname 127.0.0.1 --port 3240",
    url: "http://127.0.0.1:3240", reuseExistingServer: false, timeout: 120_000,
  },
})
