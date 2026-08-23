#!/usr/bin/env node

import { lstat, mkdir, realpath, writeFile } from "node:fs/promises"
import { isAbsolute, parse, relative, resolve, sep } from "node:path"
import { pathToFileURL } from "node:url"
import {
  DEFAULT_DOMAIN_RELATION_POLICY,
  DOMAIN_MODULE_MANIFEST_SCHEMA_VERSION,
  MODULE_SLUG_PATTERN,
} from "@/lib/modules/authoring-contract"
import { computeManifestFingerprint } from "@/lib/modules/authoring-validation"
import { MODULE_SLUGS } from "@/lib/modules/types"

const APPROVED_REPOSITORY_AUTHORING_ROOTS = [
  "docs/module-authoring",
  "research/module-authoring",
] as const

export type ModuleScaffoldFileWriter = (
  path: string,
  content: string,
) => Promise<void>

export type ModuleScaffoldOptions = {
  slug: string
  outputRoot: string
  cwd?: string
  /** Test seam for deterministic partial-write failure coverage. */
  fileWriter?: ModuleScaffoldFileWriter
}

export type ModuleScaffoldResult = {
  targetDirectory: string
  files: string[]
}

export class ModuleScaffoldError extends Error {
  readonly targetDirectory: string
  readonly createdFiles: readonly string[]

  constructor(
    message: string,
    targetDirectory: string,
    createdFiles: readonly string[],
  ) {
    super(message)
    this.name = "ModuleScaffoldError"
    this.targetDirectory = targetDirectory
    this.createdFiles = createdFiles
  }
}

function isWithin(parent: string, candidate: string) {
  const path = relative(parent, candidate)
  return (
    path === "" ||
    (!path.startsWith(`..${sep}`) && path !== ".." && !isAbsolute(path))
  )
}

async function assertRealDirectory(path: string, label: string) {
  let status
  try {
    status = await lstat(path)
  } catch {
    throw new Error(`${label} must already exist: ${path}`)
  }
  if (status.isSymbolicLink()) throw new Error(`${label} cannot be a symlink: ${path}`)
  if (!status.isDirectory()) throw new Error(`${label} must be a directory: ${path}`)
}

async function assertNoSymlinkedComponents(path: string) {
  const root = parse(path).root
  const parts = relative(root, path).split(sep).filter(Boolean)
  let cursor = root
  for (const part of parts) {
    cursor = resolve(cursor, part)
    const status = await lstat(cursor)
    if (status.isSymbolicLink()) {
      throw new Error(`Output path contains a symlinked component: ${cursor}`)
    }
  }
}

function templateManifest(slug: string) {
  const manifest = {
    schemaVersion: DOMAIN_MODULE_MANIFEST_SCHEMA_VERSION,
    manifestOrigin: "authored-manifest" as const,
    releaseState: "template" as const,
    evidenceStatus: "unrecorded" as const,
    manifestFingerprint: "",
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
    questionTypes: ["case" as const],
    cardTypes: ["decision" as const],
    calibration: {
      status: "not-calibrated" as const,
      id: `${slug}-calibration-pending`,
      questionBankVersion: 1,
      scoringVersion: 1,
      modes: ["standard" as const, "analyst" as const],
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
        { locale: "en", status: "partial" as const, contentVersion: 1 },
        { locale: "zh-Hans", status: "not-authored" as const },
      ],
    },
    evidenceAuditHooks: {
      evidence: [],
      reviews: [],
      audits: [
        {
          id: "instrument-structure",
          packageScript: "validate:structure",
          path: "scripts/validate-instrument.mts",
        },
      ],
    },
    relationPolicy: DEFAULT_DOMAIN_RELATION_POLICY,
    bridges: [],
  }
  manifest.manifestFingerprint = computeManifestFingerprint(manifest)
  return manifest
}

function templateReadme(slug: string) {
  return `# ${slug} module authoring scaffold

**Status:** non-shipping template

This directory is authoring workspace only. The scaffold command does not add a
public route, module slug, registry entry, item bank, scoring implementation, or
published relation.

Before any later public-release proposal:

1. Define and review the domain boundary, axes, lanes, and result claims.
2. Replace every placeholder and attach evidence and review hook IDs.
3. Draft questions outside the public instrument directory.
4. Run cognitive review, diagnostics, calibration, locale review, and replay.
5. Create an exact-tuple release decision before explicit registration.

Schema v1 publishes no bridges. Internal proposals remain \`not-comparable\`,
must bind exact module and Foundation contexts, and cannot compare raw 1–7
values or construct a master score.
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
    factualSourceIds: [],
    constructReviewIds: [],
    notes: [
      "Use stable IDs. Missing evidence or review cannot be replaced by inferred metadata.",
    ],
  }
}

async function defaultExclusiveWriter(path: string, content: string) {
  await writeFile(path, content, { encoding: "utf8", flag: "wx" })
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

  await assertRealDirectory(cwd, "Repository root")
  const realRepositoryRoot = await realpath(cwd)
  const lexicalOutputRoot = resolve(cwd, options.outputRoot)
  await assertRealDirectory(lexicalOutputRoot, "Output root")
  await assertNoSymlinkedComponents(lexicalOutputRoot)
  const outputRoot = await realpath(lexicalOutputRoot)

  if (isWithin(realRepositoryRoot, outputRoot)) {
    const allowed = APPROVED_REPOSITORY_AUTHORING_ROOTS.some((path) =>
      isWithin(resolve(realRepositoryRoot, path), outputRoot),
    )
    if (!allowed) {
      throw new Error(
        "Inside the repository, scaffolds require an approved module-authoring root.",
      )
    }
  }

  const targetDirectory = resolve(outputRoot, slug)
  if (!isWithin(outputRoot, targetDirectory)) {
    throw new Error("Scaffold target escapes the requested output directory.")
  }
  try {
    await lstat(targetDirectory)
    throw new Error(`Scaffold target already exists: ${targetDirectory}`)
  } catch (error) {
    if (
      error instanceof Error &&
      "code" in error &&
      error.code === "ENOENT"
    ) {
      // Expected: mkdir below performs the atomic, non-recursive claim.
    } else {
      throw error
    }
  }

  await mkdir(targetDirectory, { recursive: false })
  const fileContents = [
    ["README.md", templateReadme(slug)],
    [
      "module.manifest.json.template",
      `${JSON.stringify(templateManifest(slug), null, 2)}\n`,
    ],
    [
      "questions.json.template",
      `${JSON.stringify(templateQuestions(slug), null, 2)}\n`,
    ],
    [
      "review-ledger.json.template",
      `${JSON.stringify(templateReviewLedger(slug), null, 2)}\n`,
    ],
  ] as const
  const createdFiles: string[] = []
  const writer = options.fileWriter ?? defaultExclusiveWriter
  try {
    for (const [file, content] of fileContents) {
      const path = resolve(targetDirectory, file)
      await writer(path, content)
      createdFiles.push(path)
    }
  } catch (error) {
    // A writer can fail after its exclusive create succeeds. Reconcile the
    // bounded target list so the failure report names every entry left behind.
    for (const [file] of fileContents) {
      const path = resolve(targetDirectory, file)
      if (createdFiles.includes(path)) continue
      try {
        await lstat(path)
        createdFiles.push(path)
      } catch {
        // This expected target was never created.
      }
    }
    throw new ModuleScaffoldError(
      `Scaffold stopped after creating ${createdFiles.length} file(s): ${error instanceof Error ? error.message : String(error)}`,
      targetDirectory,
      createdFiles,
    )
  }

  return { targetDirectory, files: createdFiles }
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
    if (argument.startsWith("-")) throw new Error(`Unknown scaffold option: ${argument}`)
    if (slug) throw new Error("Pass exactly one module slug.")
    slug = argument
  }
  if (!slug || !outputRoot) {
    throw new Error("Usage: npm run module:scaffold -- <slug> --output <authoring-directory>")
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
  return Boolean(entryPoint && pathToFileURL(resolve(entryPoint)).href === import.meta.url)
}

if (isMainModule()) {
  main().catch((error: unknown) => {
    if (error instanceof ModuleScaffoldError && error.createdFiles.length > 0) {
      console.error(error.message)
      for (const file of error.createdFiles) console.error(`- created: ${file}`)
    } else {
      console.error(error instanceof Error ? error.message : String(error))
    }
    process.exitCode = 1
  })
}
