import assert from "node:assert/strict"
import { readFileSync } from "node:fs"
import { resolve } from "node:path"
import test from "node:test"
import foundationBank from "@/content/instrument/foundation.v2.json" with {
  type: "json",
}
import { V2_NEUTRAL_BASELINE } from "@/lib/scoring/v2-calibration"

const projectRoot = resolve(import.meta.dirname, "..")

type AuditItem = {
  id: string
  kind: "likert" | "tradeoff" | "miniCase"
  scoringBlock: string
  modes: readonly string[]
  dimension?: string
  reverse?: boolean
  options?: readonly {
    signals: { restraint?: number }
  }[]
}

function source(path: string) {
  return readFileSync(resolve(projectRoot, path), "utf8")
}

test("public Method copy states the bounded Foundation robustness diagnostic", () => {
  const english = source("app/method/page.tsx")
  const start = english.indexOf('aria-labelledby="foundation-robustness"')
  const end = english.indexOf('aria-labelledby="worldview-map"', start)
  const diagnostic = english.slice(start, end)

  assert.ok(start >= 0 && end > start)
  assert.match(diagnostic, /constructed answer sets, not human\s+participants/u)
  assert.match(diagnostic, /deterministic structural-sensitivity diagnostic/u)
  assert.match(diagnostic, /near family boundaries/u)
  assert.match(diagnostic, /correlated synthetic and canonical[\s\S]*changed less often/u)
  assert.match(diagnostic, /no claim about reliability, validity, or population\s+distributions/u)
  assert.match(diagnostic, /exact methods, seeds, protected-file digests, and generated\s+data/u)
  assert.match(diagnostic, /registered raw-score boundary/u)
  assert.match(diagnostic, /4\.657735/u)
  assert.doesNotMatch(diagnostic, /<table\b/u)
})

test("Simplified Chinese Method copy carries the same diagnostic boundary", () => {
  const chinese = source("content/locales/zh-Hans/editorial-pages.ts")
  const start = chinese.indexOf('id: "foundation-robustness"')
  const end = chinese.indexOf('id: "worldview-map"', start)
  const diagnostic = chinese.slice(start, end)

  assert.ok(start >= 0 && end > start)
  assert.match(diagnostic, /人工构造的完整回答，不使用人类参与者数据/u)
  assert.match(diagnostic, /确定性的结构敏感性/u)
  assert.match(diagnostic, /家族边界/u)
  assert.match(diagnostic, /带相关结构的合成组合与典型组合/u)
  assert.match(diagnostic, /不支持信度、效度或人群分布主张/u)
  assert.match(diagnostic, /完整的方法、随机种子、受保护文件摘要和生成数据/u)
  assert.match(diagnostic, /登记的原始分界值 4/u)
  assert.match(diagnostic, /4\.657735/u)
})

test("posture presentation calls 4 a registered boundary rather than a form center", () => {
  const posture = source("components/results/posture-strip.tsx")
  assert.match(posture, /registered raw-score routing boundary is 4/u)
  assert.match(posture, /registered routing boundary for the posture sign/u)
  assert.match(posture, /It is not a[\s\S]*symmetric center for every form/u)
})

test("posture audit derives its signal balance from the protected full bank", () => {
  const items = (foundationBank.items as unknown as readonly AuditItem[]).filter(
    (item) =>
      item.scoringBlock === "core" &&
      item.modes.includes("analyst"),
  )
  const restraintLikert = items.filter(
    (item) => item.kind === "likert" && item.dimension === "restraint",
  )
  assert.deepEqual(
    restraintLikert.map((item) => [item.id, item.reverse ?? false]),
    [
      ["rs1", false],
      ["rs2", false],
      ["v21_rs_rev_04", true],
      ["v21_rs_rev_05", true],
    ],
  )

  const choiceItems = items.filter(
    (item): item is AuditItem & { options: NonNullable<AuditItem["options"]> } =>
      item.kind !== "likert" && Array.isArray(item.options),
  )
  const signalSets = choiceItems.map((item) =>
    item.options.flatMap((option) =>
      typeof option.signals.restraint === "number"
        ? [option.signals.restraint]
        : [],
    ),
  )
  const declaredSignals = signalSets.flat()
  assert.equal(choiceItems.length, 22)
  assert.equal(signalSets.filter((signals) => signals.length > 0).length, 17)
  assert.equal(declaredSignals.length, 53)
  assert.equal(declaredSignals.filter((signal) => signal < 4).length, 13)
  assert.equal(declaredSignals.filter((signal) => signal === 4).length, 0)
  assert.equal(declaredSignals.filter((signal) => signal > 4).length, 40)
  assert.equal(
    Number((declaredSignals.reduce((sum, signal) => sum + signal, 0) / declaredSignals.length).toFixed(6)),
    4.79434,
  )

  const mandatorySignalSets = choiceItems
    .filter((item) => item.options.every((option) => typeof option.signals.restraint === "number"))
    .map((item) => item.options.map((option) => option.signals.restraint as number))
  assert.equal(mandatorySignalSets.length, 7)
  const lower = (
    4 + mandatorySignalSets.reduce((sum, signals) => sum + Math.min(...signals), 0)
  ) / (4 + mandatorySignalSets.length)
  const upper = (
    28 + mandatorySignalSets.reduce((sum, signals) => sum + Math.max(...signals), 0)
  ) / (4 + mandatorySignalSets.length)
  assert.equal(Number(lower.toFixed(5)), 2.51818)
  assert.equal(Number(upper.toFixed(5)), 6.43636)

  assert.deepEqual(V2_NEUTRAL_BASELINE.restraint, {
    mean: 4.657735,
    sd: 0.22382,
  })

  const audit = source("docs/research/v23-6-foundation-robustness/posture-audit.md")
  assert.match(audit, /authored form asymmetry, not an[\s\S]*implementation defect/u)
  assert.match(audit, /4\.02 to 5\.15/u)
  assert.match(audit, /2\.51818 to 6\.43636/u)
  assert.match(audit, /does not authorize a change to the scorer,[\s\S]*calibration, bank, or registered boundary/u)
})
