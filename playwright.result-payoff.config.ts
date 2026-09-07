import { defineConfig } from "@playwright/test"

export default defineConfig({
  testDir: "./tests/result-payoff", testMatch: "*.spec.ts", workers: 1, retries: 0, reporter: "list",
  outputDir: "test-results/result-payoff",
  use: { baseURL: "http://127.0.0.1:3231", browserName: "chromium", viewport: { width: 1440, height: 900 } },
  webServer: [
    { command: "npm run dev -- --hostname 127.0.0.1 --port 3231", url: "http://127.0.0.1:3231/dev/result-payoff", reuseExistingServer: true, timeout: 120000 },
    { command: "npm run start -- --hostname 127.0.0.1 --port 3232", url: "http://127.0.0.1:3232", reuseExistingServer: true, timeout: 120000 },
  ],
})
