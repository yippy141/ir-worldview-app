import { createHash } from "node:crypto"
import assert from "node:assert/strict"
import { readFileSync } from "node:fs"
import test from "node:test"
import { createElement, type ComponentType } from "react"
import { renderToStaticMarkup } from "react-dom/server"
import * as jsxRuntime from "react/jsx-runtime"
import ts from "typescript"
import { archetypes } from "@/lib/archetypes"
import * as sigilGeometry from "@/lib/archetype-sigils"
import {
  archetypeSigils,
  deriveArchetypeSigils,
  getArchetypeSigil,
  lensSigilBases,
  postureTransforms,
  serializeSigilDefinition,
  serializeSigilGrammar,
  SIGIL_FILL,
  SIGIL_GEOMETRY_DIGEST_INPUT,
  SIGIL_STROKE,
  SIGIL_STROKE_LINECAP,
  SIGIL_STROKE_LINEJOIN,
  SIGIL_STROKE_WIDTH,
  SIGIL_VIEW_BOX,
  type SigilPoint,
  type SigilPrimitive,
} from "@/lib/archetype-sigils"

const EXPECTED_CODES = [
  "P+",
  "P-",
  "R+",
  "R-",
  "M+",
  "M-",
  "S+",
  "S-",
] as const
const CENTER: SigilPoint = [12, 12]
const COMPONENT_URL = new URL(
  "../components/archetypes/archetype-sigil.tsx",
  import.meta.url,
)
const COMPONENT_SOURCE = readFileSync(COMPONENT_URL, "utf8")

type RenderableSigilProps = {
  code: string
  size?: number
  className?: string
  decorative?: boolean
  label?: string
}

function compileSigilComponent(): ComponentType<RenderableSigilProps> {
  const transpiled = ts.transpileModule(COMPONENT_SOURCE, {
    compilerOptions: {
      esModuleInterop: true,
      jsx: ts.JsxEmit.ReactJSX,
      module: ts.ModuleKind.CommonJS,
      target: ts.ScriptTarget.ES2020,
    },
    fileName: "archetype-sigil.tsx",
    reportDiagnostics: true,
  })
  const errors = (transpiled.diagnostics ?? []).filter(
    ({ category }) => category === ts.DiagnosticCategory.Error,
  )
  assert.deepEqual(
    errors.map((diagnostic) =>
      ts.flattenDiagnosticMessageText(diagnostic.messageText, "\n"),
    ),
    [],
  )

  const compiledModule = {
    exports: {} as Record<string, unknown>,
  }
  const localRequire = (specifier: string): unknown => {
    if (specifier === "react/jsx-runtime") return jsxRuntime
    if (specifier === "@/lib/archetype-sigils") return sigilGeometry
    throw new Error(`Unexpected component dependency: ${specifier}`)
  }
  const evaluate = new Function(
    "exports",
    "require",
    "module",
    transpiled.outputText,
  )
  evaluate(compiledModule.exports, localRequire, compiledModule)

  const component = compiledModule.exports.ArchetypeSigil
  assert.equal(typeof component, "function")
  return component as ComponentType<RenderableSigilProps>
}

const ArchetypeSigilForTest = compileSigilComponent()

function vector(from: SigilPoint, to: SigilPoint): SigilPoint {
  return [to[0] - from[0], to[1] - from[1]]
}

function dot(left: SigilPoint, right: SigilPoint): number {
  return left[0] * right[0] + left[1] * right[1]
}

function magnitude(value: SigilPoint): number {
  return Math.hypot(value[0], value[1])
}

function distance(left: SigilPoint, right: SigilPoint): number {
  return magnitude(vector(left, right))
}

function primitiveCoordinates(primitive: SigilPrimitive): number[] {
  if (primitive.kind === "line") {
    return [...primitive.from, ...primitive.to]
  }

  assert.match(primitive.d, /^[MC\d.,\s-]+$/)
  return [...primitive.d.matchAll(/-?\d+(?:\.\d+)?/g)].map((match) =>
    Number(match[0]),
  )
}

test("sigil grammar has exactly four bases, two transforms, and eight pure definitions", () => {
  assert.equal(lensSigilBases.length, 4)
  assert.deepEqual(
    lensSigilBases.map(({ lens }) => lens),
    ["P", "R", "M", "S"],
  )
  assert.equal(postureTransforms.length, 2)
  assert.deepEqual(postureTransforms, [
    { posture: "+", operation: "project", extension: 2 },
    { posture: "-", operation: "contain", extension: 2 },
  ])
  assert.equal(archetypeSigils.length, 8)
  assert.deepEqual(
    archetypeSigils.map(({ code }) => code),
    EXPECTED_CODES,
  )
  assert.deepEqual(
    [...archetypeSigils.map(({ code }) => code)].sort(),
    [...archetypes.map(({ code }) => code)].sort(),
  )
  assert.equal(
    archetypeSigils.every(({ code }) => /^[PRMS][+-]$/.test(code)),
    true,
  )
  assert.equal(
    archetypeSigils.some(({ code }) => code.includes("/")),
    false,
  )
  assert.equal(getArchetypeSigil("P/R+"), null)
  assert.equal(getArchetypeSigil("P"), null)
})

test("the four bases preserve their contracted neutral topologies", () => {
  const [power, rules, meaning, structure] = lensSigilBases

  assert.deepEqual(
    power.primitives.map(({ kind }) => kind),
    ["line", "line", "line"],
  )
  assert.deepEqual(
    rules.primitives.map(({ kind }) => kind),
    ["line", "line", "line", "line"],
  )
  assert.deepEqual(
    meaning.primitives.map(({ kind }) => kind),
    ["path", "path"],
  )
  assert.deepEqual(
    structure.primitives.map(({ kind }) => kind),
    ["line", "line", "line", "line", "line", "line", "line"],
  )
  assert.equal(
    lensSigilBases.every(({ postureAnchors }) => postureAnchors.length === 2),
    true,
  )
  for (const base of lensSigilBases) {
    for (const postureAnchor of base.postureAnchors) {
      assert.equal(magnitude(postureAnchor.outward), 1)
    }
  }
})

test("definitions are mechanically derived from their lens base and posture operation", () => {
  for (const definition of archetypeSigils) {
    const base = lensSigilBases.find(({ lens }) => lens === definition.lens)
    const transform = postureTransforms.find(
      ({ posture }) => posture === definition.posture,
    )
    assert.ok(base)
    assert.ok(transform)
    assert.equal(definition.code, `${base.lens}${transform.posture}`)
    assert.deepEqual(
      definition.primitives.slice(0, base.primitives.length),
      base.primitives,
    )

    const terminals = definition.primitives.slice(base.primitives.length)
    assert.equal(terminals.length, 2)
    terminals.forEach((terminal, index) => {
      assert.equal(terminal.kind, "line")
      if (terminal.kind !== "line") return

      const postureAnchor = base.postureAnchors[index]
      const terminalVector = vector(terminal.from, terminal.to)
      assert.deepEqual(terminal.from, postureAnchor.point)
      assert.equal(magnitude(terminalVector), transform.extension)

      if (transform.operation === "project") {
        assert.equal(dot(terminalVector, postureAnchor.outward), 2)
        assert.ok(
          distance(terminal.to, CENTER) > distance(terminal.from, CENTER),
        )
      } else {
        assert.equal(Math.abs(dot(terminalVector, postureAnchor.outward)), 0)
        assert.ok(
          distance(terminal.to, CENTER) < distance(terminal.from, CENTER),
        )
      }
    })
  }
})

test("all eight geometries are unique and generation is deterministic", () => {
  const serialized = archetypeSigils.map(serializeSigilDefinition)
  assert.equal(new Set(serialized).size, 8)
  assert.equal(
    new Set(
      archetypeSigils.map(({ primitives }) => JSON.stringify(primitives)),
    ).size,
    8,
  )

  const firstRegeneration = deriveArchetypeSigils()
  const secondRegeneration = deriveArchetypeSigils()
  assert.notEqual(firstRegeneration, secondRegeneration)
  assert.deepEqual(firstRegeneration, archetypeSigils)
  assert.deepEqual(secondRegeneration, archetypeSigils)
  assert.equal(serializeSigilGrammar(), SIGIL_GEOMETRY_DIGEST_INPUT)

  for (const code of EXPECTED_CODES) {
    assert.deepEqual(getArchetypeSigil(code), archetypeSigils.find(
      (definition) => definition.code === code,
    ))
  }
})

test("render metadata uses currentColor and the allowed static primitive set", () => {
  for (const definition of archetypeSigils) {
    assert.equal(definition.viewBox, SIGIL_VIEW_BOX)
    assert.equal(definition.fill, SIGIL_FILL)
    assert.equal(definition.stroke, SIGIL_STROKE)
    assert.equal(definition.stroke, "currentColor")
    assert.equal(definition.strokeWidth, SIGIL_STROKE_WIDTH)
    assert.equal(definition.strokeLinecap, SIGIL_STROKE_LINECAP)
    assert.equal(definition.strokeLinejoin, SIGIL_STROKE_LINEJOIN)
    assert.equal(
      definition.primitives.every(({ kind }) =>
        kind === "line" || kind === "path",
      ),
      true,
    )
  }
})

test("coordinates stay in the safe area and cannot clip at zoom or in print", () => {
  for (const definition of archetypeSigils) {
    const coordinates = definition.primitives.flatMap(primitiveCoordinates)
    assert.ok(coordinates.length > 0)

    for (const coordinate of coordinates) {
      assert.equal(Number.isFinite(coordinate), true)
      assert.ok(coordinate >= 3, `${definition.code}: ${coordinate} < 3`)
      assert.ok(coordinate <= 21, `${definition.code}: ${coordinate} > 21`)
      assert.ok(coordinate - definition.strokeWidth / 2 > 0)
      assert.ok(coordinate + definition.strokeWidth / 2 < 24)
    }
  }
})

test("geometry descriptors exclude unsafe SVG elements, attributes, and runtime behavior", () => {
  const forbiddenKeys = new Set([
    "animate",
    "animation",
    "filter",
    "gradient",
    "href",
    "id",
    "image",
    "mask",
    "script",
    "text",
    "use",
  ])

  function inspect(value: unknown): void {
    if (Array.isArray(value)) {
      value.forEach(inspect)
      return
    }
    if (value === null || typeof value !== "object") return

    for (const [key, child] of Object.entries(value)) {
      assert.equal(forbiddenKeys.has(key.toLowerCase()), false, key)
      inspect(child)
    }
  }

  inspect(archetypeSigils)
  const serialized = JSON.stringify(archetypeSigils).toLowerCase()
  for (const token of [
    "<text",
    "<image",
    "<use",
    "href=",
    "url(",
    "filter=",
    "mask=",
    "gradient",
    "<script",
    "<animate",
    "@keyframes",
  ]) {
    assert.equal(serialized.includes(token), false, token)
  }
  assert.equal(serialized.includes("random"), false)
  assert.equal(serialized.includes("uuid"), false)
})

test("canonical grammar serialization has a stable review digest", () => {
  const digest = createHash("sha256")
    .update(SIGIL_GEOMETRY_DIGEST_INPUT, "utf8")
    .digest("hex")

  assert.equal(
    digest,
    "0c02d05b8bdbb814f64cb4633ba26ff467976ff8ad8fc71de630ae6fa1d7a6fe",
  )
})

test("server sigil renderer is static and decorative by default", () => {
  assert.equal(/^\s*["']use client["']/m.test(COMPONENT_SOURCE), false)

  const markup = renderToStaticMarkup(
    createElement(ArchetypeSigilForTest, {
      code: "M+",
      size: 48,
      className: "sigil-specimen",
    }),
  )
  assert.match(markup, /^<svg\b/)
  assert.match(markup, /viewBox="0 0 24 24"/)
  assert.match(markup, /width="48"/)
  assert.match(markup, /height="48"/)
  assert.match(markup, /class="sigil-specimen"/)
  assert.match(markup, /fill="none"/)
  assert.match(markup, /stroke="currentColor"/)
  assert.match(markup, /stroke-width="1.75"/)
  assert.match(markup, /aria-hidden="true"/)
  assert.match(markup, /focusable="false"/)
  assert.doesNotMatch(markup, /\brole=/)
  assert.doesNotMatch(markup, /aria-label=/)
  assert.equal(
    [...markup.matchAll(/<(?:line|path)\b/g)].length,
    getArchetypeSigil("M+")?.primitives.length,
  )
})

test("meaningful sigils expose only the caller-supplied accessible label", () => {
  const markup = renderToStaticMarkup(
    createElement(ArchetypeSigilForTest, {
      code: "P-",
      size: 96,
      decorative: false,
      label: "原型标记",
    }),
  )

  assert.match(markup, /role="img"/)
  assert.match(markup, /aria-label="原型标记"/)
  assert.match(markup, /focusable="false"/)
  assert.doesNotMatch(markup, /aria-hidden=/)
  assert.doesNotMatch(markup, /Kairos|Shi|Grotian|Concert|Satyagraha/)
  assert.doesNotMatch(markup, /Musyawarah|Dirigisme|Dependencia/)

  const missingLabel = renderToStaticMarkup(
    createElement(ArchetypeSigilForTest, {
      code: "P-",
      decorative: false,
    }),
  )
  const blankLabel = renderToStaticMarkup(
    createElement(ArchetypeSigilForTest, {
      code: "P-",
      decorative: false,
      label: "   ",
    }),
  )
  assert.equal(missingLabel, "")
  assert.equal(blankLabel, "")
  assert.equal(COMPONENT_SOURCE.includes("@/content/"), false)
  assert.equal(COMPONENT_SOURCE.includes("@/lib/archetypes"), false)
})

test("all eight server renders contain only canonical line and path geometry", () => {
  const forbiddenMarkup =
    /<(?:animate|defs|filter|foreignObject|image|linearGradient|mask|radialGradient|script|style|text|use)\b|\bhref=|\bxlink:/i

  for (const code of EXPECTED_CODES) {
    const props = { code, size: 24 }
    const first = renderToStaticMarkup(
      createElement(ArchetypeSigilForTest, props),
    )
    const second = renderToStaticMarkup(
      createElement(ArchetypeSigilForTest, props),
    )
    const definition = getArchetypeSigil(code)

    assert.ok(definition)
    assert.equal(first, second)
    assert.doesNotMatch(first, forbiddenMarkup)
    assert.equal(
      [...first.matchAll(/<(?:line|path)\b/g)].length,
      definition.primitives.length,
    )
  }

  assert.equal(
    renderToStaticMarkup(
      createElement(ArchetypeSigilForTest, { code: "P/R+" }),
    ),
    "",
  )
  assert.equal(
    renderToStaticMarkup(
      createElement(ArchetypeSigilForTest, { code: "P+", size: 0 }),
    ),
    "",
  )
})
