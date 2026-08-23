import assert from "node:assert/strict"
import {
  lstat,
  mkdir,
  mkdtemp,
  readFile,
  realpath,
  rm,
  symlink,
  writeFile,
} from "node:fs/promises"
import { tmpdir } from "node:os"
import { join, resolve } from "node:path"
import { after, test } from "node:test"
import { validateDomainModuleManifest } from "@/lib/modules/authoring-validation"
import { MODULE_AUTHORING_RECORDS } from "@/lib/modules/manifests"
import { MODULE_SLUGS } from "@/lib/modules/types"
// Node's strip-types runtime requires the explicit .mts extension.
// @ts-expect-error TypeScript's bundler resolver disallows that runtime form.
import * as scaffoldCli from "@/scripts/scaffold-module.mts"

const {
  ModuleScaffoldError,
  parseScaffoldArguments,
  scaffoldModule,
} = scaffoldCli
const temporaryDirectories: string[] = []

after(async () => {
  await Promise.all(
    temporaryDirectories.map((directory) =>
      rm(directory, { recursive: true, force: true }),
    ),
  )
})

async function temporaryRoot() {
  const directory = await realpath(
    await mkdtemp(join(tmpdir(), "ir-module-scaffold-")),
  )
  temporaryDirectories.push(directory)
  return directory
}

test("outside-repository root creates deterministic exclusive templates", async () => {
  const outputRoot = await temporaryRoot()
  const registryBefore = MODULE_AUTHORING_RECORDS.map(
    (record) => record.manifest.slug,
  )
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
  const manifest = JSON.parse(await readFile(result.files[1], "utf8"))
  const questions = JSON.parse(await readFile(result.files[2], "utf8"))
  const readme = await readFile(result.files[0], "utf8")
  assert.equal(manifest.releaseState, "template")
  assert.equal(manifest.manifestOrigin, "authored-manifest")
  assert.deepEqual(manifest.bridges, [])
  assert.deepEqual(validateDomainModuleManifest(manifest), {
    ok: true,
    issues: [],
  })
  assert.equal(questions.releaseState, "template")
  assert.deepEqual(questions.items, [])
  assert.match(readme, /non-shipping template/u)
  assert.match(readme, /Schema v1 publishes no bridges/u)
  assert.deepEqual(
    MODULE_AUTHORING_RECORDS.map((record) => record.manifest.slug),
    registryBefore,
  )
  assert.deepEqual(MODULE_SLUGS, ["security", "technology"])
})

test("approved existing in-repository authoring root is allowed", async () => {
  const slug = `scaffold-test-${process.pid}`
  const result = await scaffoldModule({
    slug,
    outputRoot: "docs/module-authoring",
    cwd: process.cwd(),
  })
  temporaryDirectories.push(result.targetDirectory)
  assert.equal(
    result.targetDirectory,
    resolve(process.cwd(), "docs/module-authoring", slug),
  )
})

test("protected repository roots and unapproved in-repo roots fail closed", async () => {
  for (const outputRoot of ["lib", "content/instrument", "components", "docs/v23"]) {
    await assert.rejects(
      scaffoldModule({ slug: "future-domain", outputRoot, cwd: process.cwd() }),
      /approved module-authoring root/u,
    )
  }
})

test("output root symlink to lib and a symlinked intermediate component fail", async () => {
  const temp = await temporaryRoot()
  const rootLink = resolve(temp, "lib-link")
  await symlink(resolve(process.cwd(), "lib"), rootLink, "dir")
  await assert.rejects(
    scaffoldModule({ slug: "future-domain", outputRoot: rootLink }),
    /cannot be a symlink/u,
  )

  const realParent = resolve(temp, "real-parent")
  const nestedRoot = resolve(realParent, "authoring")
  await mkdir(nestedRoot, { recursive: true })
  const intermediateLink = resolve(temp, "intermediate-link")
  await symlink(realParent, intermediateLink, "dir")
  await assert.rejects(
    scaffoldModule({
      slug: "future-domain",
      outputRoot: resolve(intermediateLink, "authoring"),
    }),
    /symlinked component/u,
  )
})

test("output root must exist and target creation is atomic", async () => {
  const outputRoot = await temporaryRoot()
  await assert.rejects(
    scaffoldModule({
      slug: "future-domain",
      outputRoot: resolve(outputRoot, "missing"),
    }),
    /must already exist/u,
  )

  await scaffoldModule({ slug: "existing-domain", outputRoot })
  await assert.rejects(
    scaffoldModule({ slug: "existing-domain", outputRoot }),
    /already exists/u,
  )
})

test("partial writes report exact created files and never overwrite", async () => {
  const outputRoot = await temporaryRoot()
  let calls = 0
  let captured: unknown
  try {
    await scaffoldModule({
      slug: "partial-domain",
      outputRoot,
      fileWriter: async (path, content) => {
        calls += 1
        await writeFile(path, content, { encoding: "utf8", flag: "wx" })
        if (calls === 2) throw new Error("synthetic second-write failure")
      },
    })
  } catch (error) {
    captured = error
  }
  assert.ok(captured instanceof ModuleScaffoldError)
  assert.equal(captured.createdFiles.length, 2)
  assert.match(captured.message, /stopped after creating 2 file\(s\)/u)
  for (const file of captured.createdFiles) {
    assert.equal((await lstat(file)).isFile(), true)
  }

  await assert.rejects(
    scaffoldModule({ slug: "partial-domain", outputRoot }),
    /already exists/u,
  )
  assert.equal(
    await readFile(captured.createdFiles[0], "utf8"),
    await readFile(
      resolve(outputRoot, "partial-domain", "README.md"),
      "utf8",
    ),
  )
})

test("CLI parsing requires one explicit output root", () => {
  assert.throws(
    () => parseScaffoldArguments(["future-domain"]),
    /explicit --output|Usage/u,
  )
  assert.deepEqual(
    parseScaffoldArguments([
      "future-domain",
      "--output",
      "docs/module-authoring",
    ]),
    { slug: "future-domain", outputRoot: "docs/module-authoring" },
  )
})
