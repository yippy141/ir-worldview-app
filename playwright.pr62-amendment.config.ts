import { defineConfig } from "@playwright/test"

export default defineConfig({
  testDir: "./e2e", testMatch: ["pr62-amendment.spec.ts", "product-experience.spec.ts", "v23-6-root.spec.ts"],
  workers: 1, retries: 0, reporter: "list", outputDir: "test-results/pr62-amendment/interaction",
  use: { baseURL: process.env.E2E_BASE_URL ?? "http://127.0.0.1:3255", viewport: { width: 1440, height: 1000 }, trace: "retain-on-failure" },
  projects: [{ name: "chromium", use: { browserName: "chromium" } }, { name: "webkit", use: { browserName: "webkit" } }],
})
