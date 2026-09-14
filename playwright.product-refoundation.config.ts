import { defineConfig } from "@playwright/test"

// Isolated ports keep this study independent of other local development tasks.
export default defineConfig({
  testDir: "./tests/browser",
  testMatch: "product-refoundation.spec.ts",
  workers: 1,
  retries: 0,
  reporter: "list",
  use: { baseURL: "http://127.0.0.1:3217", browserName: "chromium", viewport: { width: 1440, height: 1000 } },
  webServer: [
    { command: "npm run dev -- --hostname 127.0.0.1 --port 3217", url: "http://127.0.0.1:3217", reuseExistingServer: true },
    { command: "npm run start -- --hostname 127.0.0.1 --port 3218", url: "http://127.0.0.1:3218", reuseExistingServer: true },
  ],
})
