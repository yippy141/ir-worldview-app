import { defineConfig } from "@playwright/test"
const external = process.env.DECISION_BASE_URL
export default defineConfig({
 testDir: "./tests/decision-exercises", testMatch: "*.spec.ts", workers: 1, retries: 0, reporter: "list",
 outputDir: "test-results/decision-exercises",
 use: { baseURL: external ?? "http://127.0.0.1:3232", viewport: { width:1440,height:900 }, browserName: "chromium" },
 webServer: external ? undefined : { command:"npm run start -- --hostname 127.0.0.1 --port 3232",url:"http://127.0.0.1:3232/decisions",reuseExistingServer:true,timeout:120000 },
})
