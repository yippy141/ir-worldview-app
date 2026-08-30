import assert from "node:assert/strict"
import { readFileSync } from "node:fs"
import path from "node:path"
import test from "node:test"

const repositoryRoot = process.cwd()

test("Chinese shared Profile answers the five locked questions in order", () => {
  const source = readFileSync(
    path.join(
      repositoryRoot,
      "app/[locale]/profile/share/[payload]/page.tsx",
    ),
    "utf8",
  )

  const questions = [
    'data-profile-question="foundation"',
    'data-profile-question="domains"',
    'data-profile-question="perspectives"',
    'data-profile-question="relations"',
    'data-profile-question="next"',
  ]
  for (const question of questions) assert.match(source, new RegExp(question, "u"))
  for (let index = 1; index < questions.length; index += 1) {
    assert.ok(
      source.indexOf(questions[index - 1]) < source.indexOf(questions[index]),
      `${questions[index - 1]} must precede ${questions[index]}`,
    )
  }
})

test("Chinese shared Profile always renders three separate domain slots", () => {
  const source = readFileSync(
    path.join(
      repositoryRoot,
      "app/[locale]/profile/share/[payload]/page.tsx",
    ),
    "utf8",
  )

  assert.match(source, /key: "security"/u)
  assert.match(source, /key: "technology"/u)
  assert.match(source, /key: "ai-governance"/u)
  assert.match(source, /data-profile-domain-slot=\{key\}/u)
  assert.match(source, /data-record-status=\{included \? "included" : "not-included"\}/u)
  assert.doesNotMatch(source, /view\.modules\.length > 0 \|\| view\.ai/u)
})

test("Chinese shared Profile exposes reviewed-relations and next-action states without bridge framing", () => {
  const source = readFileSync(
    path.join(
      repositoryRoot,
      "app/[locale]/profile/share/[payload]/page.tsx",
    ),
    "utf8",
  )
  const copy = readFileSync(
    path.join(repositoryRoot, "content/locales/zh-Hans/profile-records.ts"),
    "utf8",
  )
  const combined = `${source}\n${copy}`

  assert.match(source, /data-reviewed-relations="unavailable"/u)
  assert.match(copy, /目前没有经过审校、可在此展示的跨领域关系/u)
  assert.match(copy, /接下来应该打开什么/u)
  assert.match(source, /copy\.openFoundation/u)
  assert.match(source, /copy\.openAtlas/u)
  assert.match(source, /copy\.openCases/u)
  assert.doesNotMatch(combined, /ACTIVE_MODULE_COMPARISON_STATUS/u)
  assert.doesNotMatch(combined, /noNumericBridge|noMasterScore/u)
  assert.doesNotMatch(source, /profile-domain-status/u)
})

test("Chinese shared Profile keeps untranslated detail copy fail closed", () => {
  const source = readFileSync(
    path.join(
      repositoryRoot,
      "app/[locale]/profile/share/[payload]/page.tsx",
    ),
    "utf8",
  )

  assert.match(source, /<span lang="en">\{view\.foundation\.archetypeName\}<\/span>/u)
  assert.match(source, /copy\.foundationCanonicalNote/u)
  assert.doesNotMatch(
    source,
    /snapshot\.summary|snapshot\.headline|archetypeLabel/u,
  )
  assert.doesNotMatch(
    source,
    /No Perspective Runs|Separate domain records|Open Foundation result/u,
  )
})
