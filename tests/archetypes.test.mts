import test from "node:test"
import assert from "node:assert/strict"
import {
  archetypes,
  getArchetypeByCode,
  resolveArchetype,
  type BlendArchetype,
} from "@/lib/archetypes"
import { getFoundationQuestions } from "@/lib/quiz-schema"
import {
  buildCanonicalFoundationResult,
  computeCoreDimensionScores,
} from "@/lib/scoring"
import type { Answers, QuizMode } from "@/lib/types"

const MODE: QuizMode = "analyst"
const RANDOM_N = 500
const RANDOM_SEED = 20260728

const goldenBlendOutputs = [
  {
    input: "P/R+",
    code: "P/R+",
    name: "Kairos–Grotian",
    gloss:
      "You read world politics through power and through rules at the same time, and you do not resolve the tension in advance.",
    lenses: ["P", "R"],
    posture: "+",
    familyKeys: ["realist", "institutionalist"],
    componentCodes: ["P+", "R+"],
    analogue: null,
  },
  {
    input: "P/R-",
    code: "P/R-",
    name: "Shi (勢)–Concert",
    gloss:
      "You read world politics through power and through rules at the same time, and you do not resolve the tension in advance.",
    lenses: ["P", "R"],
    posture: "-",
    familyKeys: ["realist", "institutionalist"],
    componentCodes: ["P-", "R-"],
    analogue: null,
  },
  {
    input: "P/M+",
    code: "P/M+",
    name: "Kairos–Satyagraha",
    gloss:
      "You read world politics through power and through meaning at the same time, and you do not resolve the tension in advance.",
    lenses: ["P", "M"],
    posture: "+",
    familyKeys: ["realist", "constructivist"],
    componentCodes: ["P+", "M+"],
    analogue: null,
  },
  {
    input: "P/M-",
    code: "P/M-",
    name: "Shi (勢)–Musyawarah",
    gloss:
      "You read world politics through power and through meaning at the same time, and you do not resolve the tension in advance.",
    lenses: ["P", "M"],
    posture: "-",
    familyKeys: ["realist", "constructivist"],
    componentCodes: ["P-", "M-"],
    analogue: null,
  },
  {
    input: "P/S+",
    code: "P/S+",
    name: "Kairos–Dirigisme",
    gloss:
      "You read world politics through power and through structure at the same time, and you do not resolve the tension in advance.",
    lenses: ["P", "S"],
    posture: "+",
    familyKeys: ["realist", "criticalPoliticalEconomy"],
    componentCodes: ["P+", "S+"],
    analogue: null,
  },
  {
    input: "P/S-",
    code: "P/S-",
    name: "Shi (勢)–Dependencia",
    gloss:
      "You read world politics through power and through structure at the same time, and you do not resolve the tension in advance.",
    lenses: ["P", "S"],
    posture: "-",
    familyKeys: ["realist", "criticalPoliticalEconomy"],
    componentCodes: ["P-", "S-"],
    analogue: null,
  },
  {
    input: "R/M+",
    code: "R/M+",
    name: "Grotian–Satyagraha",
    gloss:
      "You read world politics through rules and through meaning at the same time, and you do not resolve the tension in advance.",
    lenses: ["R", "M"],
    posture: "+",
    familyKeys: ["institutionalist", "constructivist"],
    componentCodes: ["R+", "M+"],
    analogue: null,
  },
  {
    input: "R/M-",
    code: "R/M-",
    name: "Concert–Musyawarah",
    gloss:
      "You read world politics through rules and through meaning at the same time, and you do not resolve the tension in advance.",
    lenses: ["R", "M"],
    posture: "-",
    familyKeys: ["institutionalist", "constructivist"],
    componentCodes: ["R-", "M-"],
    analogue: null,
  },
  {
    input: "R/S+",
    code: "R/S+",
    name: "Grotian–Dirigisme",
    gloss:
      "You read world politics through rules and through structure at the same time, and you do not resolve the tension in advance.",
    lenses: ["R", "S"],
    posture: "+",
    familyKeys: ["institutionalist", "criticalPoliticalEconomy"],
    componentCodes: ["R+", "S+"],
    analogue: null,
  },
  {
    input: "R/S-",
    code: "R/S-",
    name: "Concert–Dependencia",
    gloss:
      "You read world politics through rules and through structure at the same time, and you do not resolve the tension in advance.",
    lenses: ["R", "S"],
    posture: "-",
    familyKeys: ["institutionalist", "criticalPoliticalEconomy"],
    componentCodes: ["R-", "S-"],
    analogue: null,
  },
  {
    input: "M/S+",
    code: "M/S+",
    name: "Satyagraha–Dirigisme",
    gloss:
      "You read world politics through meaning and through structure at the same time, and you do not resolve the tension in advance.",
    lenses: ["M", "S"],
    posture: "+",
    familyKeys: ["constructivist", "criticalPoliticalEconomy"],
    componentCodes: ["M+", "S+"],
    analogue: null,
  },
  {
    input: "M/S-",
    code: "M/S-",
    name: "Musyawarah–Dependencia",
    gloss:
      "You read world politics through meaning and through structure at the same time, and you do not resolve the tension in advance.",
    lenses: ["M", "S"],
    posture: "-",
    familyKeys: ["constructivist", "criticalPoliticalEconomy"],
    componentCodes: ["M-", "S-"],
    analogue: null,
  },
] as const

type AnyQuestion = ReturnType<typeof getFoundationQuestions>[number] & {
  options?: { id: string }[]
  allowSecondChoiceInAnalyst?: boolean
}

function makeRng(seed: number) {
  let state = seed >>> 0

  return () => {
    state = (state * 1664525 + 1013904223) >>> 0
    return state / 0x100000000
  }
}

function buildRandomAnswers(rng: () => number): Answers {
  const answers: Answers = {}
  const likertValue = 1 + Math.floor(rng() * 7)

  for (const raw of getFoundationQuestions(MODE)) {
    const question = raw as AnyQuestion

    if (question.kind === "likert") {
      answers[question.id] = likertValue
      continue
    }

    const options = question.options ?? []
    if (options.length === 0) continue

    const primaryIndex = Math.floor(rng() * options.length)
    const secondaryIndex = (primaryIndex + 1) % options.length
    answers[question.id] = {
      primary: options[primaryIndex].id,
      secondary:
        options.length > 1 && secondaryIndex !== primaryIndex
          ? options[secondaryIndex].id
          : undefined,
    }
  }

  return answers
}

function isBlend(
  archetype: ReturnType<typeof resolveArchetype>,
): archetype is BlendArchetype {
  return "lenses" in archetype
}

function measureArchetypes() {
  const rng = makeRng(RANDOM_SEED)
  const pureCounts = Object.fromEntries(
    archetypes.map((archetype) => [archetype.code, 0]),
  ) as Record<(typeof archetypes)[number]["code"], number>
  const blendCounts: Record<string, number> = {}

  for (let index = 0; index < RANDOM_N; index += 1) {
    const answers = buildRandomAnswers(rng)
    const result = buildCanonicalFoundationResult(
      computeCoreDimensionScores(answers, MODE),
    )

    let resolved: ReturnType<typeof resolveArchetype> | undefined
    assert.doesNotThrow(() => {
      resolved = resolveArchetype(result)
    })
    assert.ok(resolved)

    if (isBlend(resolved)) {
      blendCounts[resolved.code] = (blendCounts[resolved.code] ?? 0) + 1
    } else {
      pureCounts[resolved.code] += 1
    }
  }

  return { pureCounts, blendCounts }
}

test("all twelve same-posture blend outputs preserve their compatibility contract", () => {
  for (const expected of goldenBlendOutputs) {
    const resolved = getArchetypeByCode(expected.input)

    assert.ok(resolved)
    assert.equal(isBlend(resolved), true, `${expected.input} must stay a blend`)
    if (!isBlend(resolved)) continue

    assert.deepEqual(
      {
        code: resolved.code,
        name: resolved.name,
        gloss: resolved.gloss,
        lenses: resolved.lenses,
        posture: resolved.posture,
        familyKeys: resolved.familyKeys,
        componentCodes: resolved.archetypes.map(({ code }) => code),
        analogue: resolved.analogue,
      },
      {
        code: expected.code,
        name: expected.name,
        gloss: expected.gloss,
        lenses: [...expected.lenses],
        posture: expected.posture,
        familyKeys: [...expected.familyKeys],
        componentCodes: [...expected.componentCodes],
        analogue: expected.analogue,
      },
    )
  }
})

test("seeded respondents always resolve to a valid, distributed archetype", (context) => {
  const { pureCounts, blendCounts } = measureArchetypes()
  const pureTotal = Object.values(pureCounts).reduce((sum, count) => sum + count, 0)
  const blendTotal = Object.values(blendCounts).reduce((sum, count) => sum + count, 0)
  const appearingPureArchetypes = Object.values(pureCounts).filter(
    (count) => count > 0,
  ).length
  const largestPureShare = Math.max(...Object.values(pureCounts)) / pureTotal
  const blendShare = blendTotal / RANDOM_N

  assert.ok(
    largestPureShare <= 0.5,
    `Expected no pure archetype above 50%; got ${(largestPureShare * 100).toFixed(1)}%.`,
  )
  assert.ok(
    appearingPureArchetypes >= 6,
    `Expected at least six pure archetypes; got ${appearingPureArchetypes}.`,
  )
  assert.ok(
    blendShare >= 0.05 && blendShare <= 0.4,
    `Expected blends between 5% and 40%; got ${(blendShare * 100).toFixed(1)}%.`,
  )

  context.diagnostic(
    `pure=${JSON.stringify(pureCounts)} blends=${JSON.stringify(blendCounts)}`,
  )
})
