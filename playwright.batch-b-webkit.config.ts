import { defineConfig } from "@playwright/test"
export default defineConfig({
 testDir:"./e2e", workers:1, retries:0, reporter:"list",
 testMatch:["batch-b-reading.spec.ts","pr52-navigation.spec.ts","v23-6-root.spec.ts"],
 grep:/reading geometry|unknown and interrupted|no-JS, print|shared navigation fits 390|World Stage retains/,
 outputDir:"test-results/batch-b-webkit",
 projects:[{name:"webkit",use:{browserName:"webkit",viewport:{width:1440,height:900},baseURL:"http://127.0.0.1:3232"}}],
 webServer:{command:"npm run start -- --hostname 127.0.0.1 --port 3232",url:"http://127.0.0.1:3232",reuseExistingServer:true,timeout:120000},
})
