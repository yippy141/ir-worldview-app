import { defineConfig, devices } from "@playwright/test"
export default defineConfig({
  testDir: "./e2e", testMatch: ["futures-catalogue.spec.ts", "futures-departure.spec.ts"], workers: 1, reporter: "line",
  use: { baseURL: "http://127.0.0.1:3110", trace: "off" },
  projects: [{ name: "chromium", use: { ...devices["Desktop Chrome"] } }],
  webServer: { command: "npm run start -- --hostname 127.0.0.1 --port 3110", url: "http://127.0.0.1:3110", reuseExistingServer: false, timeout: 120_000 },
})
