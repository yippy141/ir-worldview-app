import test from "node:test"
import assert from "node:assert/strict"
import { readFileSync } from "node:fs"
import { resolve } from "node:path"
import goldenCopy from "@/tests/fixtures/v21-module-copy-golden.json" with {
  type: "json",
}
import { securityV21Module } from "@/lib/modules/security-v21"
import { technologyV21Module } from "@/lib/modules/technology-v21"
import { MODULE_V21_TUPLE } from "@/lib/modules/versions"
import {
  INSTRUMENT_COPY_VERSIONS,
  LEGACY_LOCALE_COPY_VERSION,
} from "@/lib/locale-provenance"
import type { ModuleAnalytics, ModuleDefinition } from "@/lib/modules/types"

const projectRoot = resolve(import.meta.dirname, "..")
const neutralAnalytics: ModuleAnalytics = {
  scores: {
    activism: 4.5,
    escalation: 4.5,
    alliance: 4.5,
    legitimacy: 4.5,
    control: 4.5,
    governance: 4.5,
    industrial: 4.5,
    safety: 4.5,
  },
  laneScores: {},
  cardTypeScores: {},
}

function compact(value: string): string {
  return value.replace(/^\s*>\s?/gm, "").replace(/\s+/g, " ").trim()
}

function fallbackSummary(definition: ModuleDefinition): string {
  return definition.interpret(neutralAnalytics).summary
}

test("frozen V21 module descriptions and fallback summaries match the golden copy", () => {
  assert.deepEqual(MODULE_V21_TUPLE, goldenCopy.tuple)
  assert.deepEqual(
    {
      legacyEnglish: LEGACY_LOCALE_COPY_VERSION,
      moduleEnglish: INSTRUMENT_COPY_VERSIONS.module.en,
    },
    goldenCopy.localeCopyVersions,
  )

  assert.deepEqual(
    {
      security: {
        description: securityV21Module.description,
        fallbackSummary: fallbackSummary(securityV21Module),
      },
      technology: {
        description: technologyV21Module.description,
        fallbackSummary: fallbackSummary(technologyV21Module),
      },
    },
    {
      security: {
        description: goldenCopy.security.replacementDescription,
        fallbackSummary: goldenCopy.security.replacementSummary,
      },
      technology: {
        description: goldenCopy.technology.replacementDescription,
        fallbackSummary: goldenCopy.technology.replacementSummary,
      },
    },
  )
})

test("the V21 copy fixture and erratum stay coupled", () => {
  const erratum = compact(
    readFileSync(resolve(projectRoot, goldenCopy.erratumDocument), "utf8"),
  )

  for (const copy of [goldenCopy.security, goldenCopy.technology]) {
    for (const field of [
      "originalDescription",
      "replacementDescription",
      "originalPrevalenceSummary",
      "interimSummary",
      "replacementSummary",
    ] as const) {
      assert.ok(
        erratum.includes(compact(copy[field])),
        `erratum is missing frozen ${field}`,
      )
    }
  }
})
