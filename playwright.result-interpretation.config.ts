import { defineConfig } from "@playwright/test"

const external = process.env.RESULT_BASE_URL
export default defineConfig({
  testDir: "./tests/result-interpretation", workers: 1, retries: 0, reporter: "list",
  outputDir: "test-results/result-interpretation",
  use: { baseURL: external ?? "http://127.0.0.1:3241", viewport: { width: 1440, height: 1000 }, contextOptions: { reducedMotion: "reduce" }, trace: "retain-on-failure" },
  projects: [{ name: "chromium", use: { browserName: "chromium" } }, { name: "webkit", use: { browserName: "webkit" } }],
  webServer: external ? undefined : { command: "npm run start -- --hostname 127.0.0.1 --port 3241", url: "http://127.0.0.1:3241", reuseExistingServer: false, timeout: 120_000 },
})
