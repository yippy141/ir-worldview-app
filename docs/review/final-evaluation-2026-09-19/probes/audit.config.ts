import { defineConfig } from '/private/tmp/ir-final-audit-20260919/source/node_modules/@playwright/test/index.mjs'
export default defineConfig({testDir:'.',testMatch:'behavior.spec.ts',workers:1,retries:0,timeout:30000,reporter:'list',use:{baseURL:'http://127.0.0.1:3319',browserName:'chromium'}})
