import assert from "node:assert/strict"
import test from "node:test"
import { getQuizChromeMeta } from "@/lib/quiz-chrome"

test("Foundation focused chrome has equivalent English and Chinese route states", () => {
  assert.deepEqual(getQuizChromeMeta("/quiz", "en"), {
    title: "Foundation Questionnaire",
    sectionLabel: "IR Worldview Inventory",
    exitHref: "/",
    exitLabel: "Exit to home",
    progressLabel: "Route progress",
    steps: ["Quiz", "Review"],
    activeStep: "Quiz",
  })
  assert.deepEqual(getQuizChromeMeta("/quiz/review", "zh-Hans"), {
    title: "基础问卷",
    sectionLabel: "国际关系世界观清单",
    exitHref: "/",
    exitLabel: "返回首页",
    progressLabel: "问卷进度",
    steps: ["问卷", "检查"],
    activeStep: "检查",
  })
})

test("unapproved Chinese instruments do not receive misleading focused chrome", () => {
  assert.equal(getQuizChromeMeta("/ai/quiz", "zh-Hans"), null)
  assert.equal(getQuizChromeMeta("/modules/security", "zh-Hans"), null)
  assert.ok(getQuizChromeMeta("/ai/quiz", "en"))
  assert.ok(getQuizChromeMeta("/modules/security", "en"))
})
