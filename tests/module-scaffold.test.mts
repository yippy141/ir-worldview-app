import { after, test } from "node:test"
import assert from "node:assert/strict"
import { mkdtemp, readFile, rm } from "node:fs/promises"
import { tmpdir } from "node:os"
import { join, resolve } from "node:path"
import { validateDomainModuleManifest } from "@/lib/modules/authoring-validation"
import { MODULE_AUTHORING_RECORDS } from "@/lib/modules/manifests"
import { MODULE_SLUGS } from "@/lib/modules/types"
// Node's strip-types runtime requires the explicit .mts extension.
// @ts-expect-error TypeScript's bundler resolver disallows that runtime form.
import * as scaffoldCli from "@/scripts/scaffold-module.mts"

const { parseScaffoldArguments, scaffoldModule } = scaffoldCli

const temporaryDirectories: string[] = []

after(async () => {
  await Promise.all(
    temporaryDirectories.map((directory) =>
      rm(directory, { recursive: true, force: true }),
    ),
  )
})

async function temporaryRoot() {
  const directory = await mkdtemp(join(tmpdir(), "ir-module-scaffold-"))
  temporaryDirectories.push(directory)
  return directory
}

test("scaffold creates deterministic non-shipping templates only", async () => {
  const outputRoot = await temporaryRoot()
  const registryBefore = MODULE_AUTHORING_RECORDS.map((record) => record.manifest.slug)
  const result = await scaffoldModule({
    slug: "economic-statecraft-and-interdependence",
    outputRoot,
  })

  assert.equal(
    result.targetDirectory,
    resolve(outputRoot, "economic-statecraft-and-interdependence"),
  )
  assert.deepEqual(
    result.files.map((file) => file.slice(result.targetDirectory.length + 1)),
    [
      "README.md",
      "module.manifest.json.template",
      "questions.json.template",
      "review-ledger.json.template",
    ],
  )

  const manifest = JSON.parse(
    await readFile(result.files[1], "utf8"),
  ) as Record<string, unknown>
  const questions = JSON.parse(
    await readFile(result.files[2], "utf8"),
  ) as Record<string, unknown>
  const readme = await readFile(result.files[0], "utf8")

  assert.equal(manifest.releaseState, "template")
  assert.deepEqual(manifest.bridges, [])
  assert.deepEqual(validateDomainModuleManifest(manifest), {
    ok: true,
    issues: [],
  })
  assert.equal(questions.releaseState, "template")
  assert.deepEqual(questions.items, [])
  assert.match(readme, /non-shipping template/)
  assert.match(readme, /does not add a[\s\S]*public route/)
  assert.deepEqual(
    MODULE_AUTHORING_RECORDS.map((record) => record.manifest.slug),
    registryBefore,
  )
  assert.deepEqual(MODULE_SLUGS, ["security", "technology"])
})

test("scaffold refuses invalid, shipping, and existing targets", async () => {
  const outputRoot = await temporaryRoot()
  await assert.rejects(
    scaffoldModule({ slug: "Bad Slug", outputRoot }),
    /lowercase words/,
  )
  await assert.rejects(
    scaffoldModule({ slug: "security", outputRoot }),
    /shipping security module/,
  )

  await scaffoldModule({ slug: "future-domain", outputRoot })
  await assert.rejects(
    scaffoldModule({ slug: "future-domain", outputRoot }),
    /already exists/,
  )
})

test("scaffold requires explicit output and refuses shipping source trees", async () => {
  assert.throws(
    () => parseScaffoldArguments(["future-domain"]),
    /explicit --output|Usage/,
  )
  assert.deepEqual(
    parseScaffoldArguments([
      "future-domain",
      "--output",
      "authoring/modules",
    ]),
    { slug: "future-domain", outputRoot: "authoring/modules" },
  )

  await assert.rejects(
    scaffoldModule({
      slug: "future-domain",
      outputRoot: "content/instrument",
      cwd: process.cwd(),
    }),
    /cannot be created under content\/instrument/,
  )
})
