#!/usr/bin/env node

import { mkdir, stat, writeFile } from "node:fs/promises"
import { isAbsolute, relative, resolve, sep } from "node:path"
import { pathToFileURL } from "node:url"
import {
  DEFAULT_DOMAIN_RELATION_POLICY,
  DOMAIN_MODULE_MANIFEST_SCHEMA_VERSION,
  MODULE_SLUG_PATTERN,
} from "@/lib/modules/authoring-contract"
import { MODULE_SLUGS } from "@/lib/modules/types"

const SHIPPING_ROOTS = [
  "app",
  "components",
  "content/instrument",
  "lib",
  "public",
] as const

export type ModuleScaffoldOptions = {
  slug: string
  outputRoot: string
  cwd?: string
}

export type ModuleScaffoldResult = {
  targetDirectory: string
  files: string[]
}

function isWithin(parent: string, candidate: string) {
  const path = relative(parent, candidate)
  return path === "" || (!path.startsWith(`..${sep}`) && path !== ".." && !isAbsolute(path))
}

function templateManifest(slug: string) {
  return {
    schemaVersion: DOMAIN_MODULE_MANIFEST_SCHEMA_VERSION,
    releaseState: "template",
    slug,
    versions: {
      manifest: 1,
      questionBank: 1,
      scoring: 1,
      resultCopy: 1,
    },
    axes: [
      {
        key: "replace-axis",
        label: "Replace with an authored axis",
        lowLabel: "Authored low pole",
        highLabel: "Authored high pole",
      },
    ],
    lanes: [
      {
        key: "replace-lane",
        label: "Replace with an authored lane",
        description: "Define the bounded domain question this lane summarizes.",
        scoreKey: "replace-axis",
        lowLabel: "Authored low pole",
        highLabel: "Authored high pole",
      },
    ],
    questionTypes: ["case"],
    cardTypes: ["decision"],
    calibration: {
      status: "not-calibrated",
      id: `${slug}-calibration-pending`,
      questionBankVersion: 1,
      scoringVersion: 1,
      modes: ["standard", "analyst"],
      method: "Pending an authored diagnostic and pilot plan.",
    },
    resultCopy: {
      defaultHeadline: "Draft result: no authored headline yet",
      title: "Draft module title",
      shortTitle: "Draft module",
      subtitle: "Non-shipping authoring placeholder",
      shorthand: "Draft",
      timeEstimate: {
        standard: "Pending item bank",
        analyst: "Pending item bank",
      },
      description: "Define the domain boundary before drafting questions.",
      measures: ["Replace with an evidenced construct claim."],
      doesNotClaim: ["This template is not a validated or shipping instrument."],
    },
    localeStatus: {
      sourceLocale: "en",
      locales: [
        { locale: "en", status: "partial", contentVersion: 1 },
        { locale: "zh-Hans", status: "not-authored" },
      ],
    },
    evidenceAuditHooks: {
      evidence: [],
      reviews: [],
      audits: [
        { id: "instrument-structure", packageScript: "validate:structure" },
      ],
    },
    relationPolicy: DEFAULT_DOMAIN_RELATION_POLICY,
    bridges: [],
  }
}

function templateReadme(slug: string) {
  return `# ${slug} module authoring scaffold

**Status:** non-shipping template

This directory is authoring workspace only. The scaffold command does not add a
public route, module slug, registry entry, item bank, scoring implementation, or
published relation.

Before any later shipping proposal:

1. Define and review the domain boundary, axes, lanes, and result claims.
2. Replace every placeholder and attach evidence and review hook IDs.
3. Draft questions outside the public instrument directory.
4. Run cognitive review, diagnostics, calibration, locale review, and replay.
5. Seek an explicit implementation decision before registering the module.

Relations remain \`not-comparable\` unless an explicit reviewed bridge record is
authored. Never compare raw 1–7 values across this module and the Foundation,
and never construct a master score.
`
}

function templateQuestions(slug: string) {
  return {
    instrument: slug,
    instrumentVersion: 1,
    releaseState: "template",
    items: [],
  }
}

function templateReviewLedger(slug: string) {
  return {
    schemaVersion: 1,
    moduleSlug: slug,
    releaseState: "template",
    sourceIds: [],
    reviewIds: [],
    notes: [
      "Use stable IDs. Do not replace missing evidence or review with inferred metadata.",
    ],
  }
}

async function pathExists(path: string) {
  try {
    await stat(path)
    return true
  } catch (error) {
    if (
      error instanceof Error &&
      "code" in error &&
      error.code === "ENOENT"
    ) {
      return false
    }
    throw error
  }
}

export async function scaffoldModule(
  options: ModuleScaffoldOptions,
): Promise<ModuleScaffoldResult> {
  const cwd = resolve(options.cwd ?? process.cwd())
  const { slug } = options
  if (!MODULE_SLUG_PATTERN.test(slug)) {
    throw new Error("Module slug must use lowercase words separated by hyphens.")
  }
  if ((MODULE_SLUGS as readonly string[]).includes(slug)) {
    throw new Error(`Cannot scaffold over the shipping ${slug} module.`)
  }
  if (!options.outputRoot.trim()) {
    throw new Error("An explicit --output directory is required.")
  }

  const outputRoot = resolve(cwd, options.outputRoot)
  const targetDirectory = resolve(outputRoot, slug)
  if (!isWithin(outputRoot, targetDirectory)) {
    throw new Error("Scaffold target escapes the requested output directory.")
  }
  for (const shippingRoot of SHIPPING_ROOTS) {
    if (isWithin(resolve(cwd, shippingRoot), targetDirectory)) {
      throw new Error(
        `Non-shipping scaffolds cannot be created under ${shippingRoot}.`,
      )
    }
  }
  if (await pathExists(targetDirectory)) {
    throw new Error(`Scaffold target already exists: ${targetDirectory}`)
  }

  const files = [
    "README.md",
    "module.manifest.json.template",
    "questions.json.template",
    "review-ledger.json.template",
  ]
  await mkdir(targetDirectory, { recursive: true })
  await Promise.all([
    writeFile(resolve(targetDirectory, files[0]), templateReadme(slug), "utf8"),
    writeFile(
      resolve(targetDirectory, files[1]),
      `${JSON.stringify(templateManifest(slug), null, 2)}\n`,
      "utf8",
    ),
    writeFile(
      resolve(targetDirectory, files[2]),
      `${JSON.stringify(templateQuestions(slug), null, 2)}\n`,
      "utf8",
    ),
    writeFile(
      resolve(targetDirectory, files[3]),
      `${JSON.stringify(templateReviewLedger(slug), null, 2)}\n`,
      "utf8",
    ),
  ])

  return {
    targetDirectory,
    files: files.map((file) => resolve(targetDirectory, file)),
  }
}

export function parseScaffoldArguments(args: readonly string[]): {
  slug: string
  outputRoot: string
} {
  let slug: string | undefined
  let outputRoot: string | undefined

  for (let index = 0; index < args.length; index += 1) {
    const argument = args[index]
    if (argument === "--output") {
      outputRoot = args[index + 1]
      index += 1
      continue
    }
    if (argument.startsWith("-")) {
      throw new Error(`Unknown scaffold option: ${argument}`)
    }
    if (slug) throw new Error("Pass exactly one module slug.")
    slug = argument
  }

  if (!slug || !outputRoot) {
    throw new Error(
      "Usage: npm run module:scaffold -- <slug> --output <authoring-directory>",
    )
  }
  return { slug, outputRoot }
}

async function main() {
  const result = await scaffoldModule(parseScaffoldArguments(process.argv.slice(2)))
  console.log("Created non-shipping module authoring scaffold:")
  for (const file of result.files) console.log(`- ${file}`)
  console.log("No public registry, route, payload, or item bank was changed.")
}

function isMainModule() {
  const entryPoint = process.argv[1]
  return Boolean(
    entryPoint && pathToFileURL(resolve(entryPoint)).href === import.meta.url,
  )
}

if (isMainModule()) {
  main().catch((error: unknown) => {
    console.error(error instanceof Error ? error.message : String(error))
    process.exitCode = 1
  })
}
