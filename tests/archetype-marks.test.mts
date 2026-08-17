import assert from "node:assert/strict"
import { readFileSync } from "node:fs"
import test from "node:test"
import { createElement, type ComponentType } from "react"
import { renderToStaticMarkup } from "react-dom/server"
import * as jsxRuntime from "react/jsx-runtime"
import ts from "typescript"
import * as archetypeDisplay from "@/lib/archetype-display"
import * as markGeometry from "@/lib/archetype-marks"
import {
  ARCHETYPE_MARK_DIRECTORY_SIZE,
  ARCHETYPE_MARK_HERO_SIZE,
  ARCHETYPE_MARK_MIN_PICTORIAL_SIZE,
  ARCHETYPE_MARK_VERSION,
  ARCHETYPE_MARK_VIEW_BOX,
  archetypeMarks,
  getArchetypeMark,
  serializeArchetypeMarkBody,
  type ArchetypeMarkNode,
} from "@/lib/archetype-marks"
import * as archetypeCatalog from "@/lib/archetypes"
import { archetypes } from "@/lib/archetypes"

const MANIFEST_URL = new URL(
  "../docs/v23/assets/V23_SYSTEM_A_DERIVED_SIGILS_MANIFEST.json",
  import.meta.url,
)
const COMPONENT_URL = new URL(
  "../components/archetypes/archetype-mark.tsx",
  import.meta.url,
)
const COMPONENT_SOURCE = readFileSync(COMPONENT_URL, "utf8")

type SystemAManifest = {
  version: string
  status: string
  contract: {
    minimumPictorialSizePx: number
    directorySizePx: number
    heroSizePx: number
    animation: string
    blendHero: string
    blendCompact: string
  }
  marks: Array<{
    code: string
    displayCode: string
    id: string
    name: string
    viewBox: string
    svgBody: string
  }>
}

type RenderableComponent = ComponentType<Record<string, unknown>>

function compileComponents(): {
  ArchetypeMark: RenderableComponent
  FoundationMark: RenderableComponent
} {
  const transpiled = ts.transpileModule(COMPONENT_SOURCE, {
    compilerOptions: {
      esModuleInterop: true,
      jsx: ts.JsxEmit.ReactJSX,
      module: ts.ModuleKind.CommonJS,
      target: ts.ScriptTarget.ES2020,
    },
    fileName: "archetype-mark.tsx",
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

  const compiledModule = { exports: {} as Record<string, unknown> }
  const localRequire = (specifier: string): unknown => {
    if (specifier === "react/jsx-runtime") return jsxRuntime
    if (specifier === "@/lib/archetype-display") return archetypeDisplay
    if (specifier === "@/lib/archetype-marks") return markGeometry
    if (specifier === "@/lib/archetypes") return archetypeCatalog
    throw new Error(`Unexpected component dependency: ${specifier}`)
  }
  const evaluate = new Function(
    "exports",
    "require",
    "module",
    transpiled.outputText,
  )
  evaluate(compiledModule.exports, localRequire, compiledModule)

  assert.equal(typeof compiledModule.exports.ArchetypeMark, "function")
  assert.equal(typeof compiledModule.exports.FoundationMark, "function")
  return {
    ArchetypeMark: compiledModule.exports.ArchetypeMark as RenderableComponent,
    FoundationMark: compiledModule.exports.FoundationMark as RenderableComponent,
  }
}

const manifest = JSON.parse(
  readFileSync(MANIFEST_URL, "utf8"),
) as SystemAManifest
const { ArchetypeMark, FoundationMark } = compileComponents()

function render(
  component: RenderableComponent,
  props: Record<string, unknown>,
): string {
  return renderToStaticMarkup(createElement(component, props))
}

function svgBodies(markup: string): string[] {
  return [...markup.matchAll(/<svg\b[^>]*>([\s\S]*?)<\/svg>/gu)].map(
    ([, body]) => body.replace(/><\/(path|circle)>/gu, "/>"),
  )
}

function pictorialSizes(markup: string): number[] {
  return [...markup.matchAll(/<svg\b[^>]*\bwidth="([0-9.]+)"/gu)].map(
    ([, value]) => Number(value),
  )
}

test("System A owns exactly eight manifest-bound pure marks and no blend mark", () => {
  assert.equal(ARCHETYPE_MARK_VERSION, manifest.version)
  assert.equal(manifest.status, "owner-selected-editorial-beta")
  assert.equal(ARCHETYPE_MARK_VIEW_BOX, "0 0 100 100")
  assert.equal(
    ARCHETYPE_MARK_MIN_PICTORIAL_SIZE,
    manifest.contract.minimumPictorialSizePx,
  )
  assert.equal(ARCHETYPE_MARK_DIRECTORY_SIZE, manifest.contract.directorySizePx)
  assert.equal(ARCHETYPE_MARK_HERO_SIZE, manifest.contract.heroSizePx)
  assert.equal(manifest.contract.animation, "deferred")
  assert.equal(manifest.contract.blendHero, "diptych")
  assert.equal(manifest.contract.blendCompact, "hallmark")

  assert.equal(archetypeMarks.length, 8)
  assert.deepEqual(
    archetypeMarks.map(({ code }) => code),
    ["P+", "P-", "R+", "R-", "M+", "M-", "S+", "S-"],
  )
  assert.deepEqual(
    archetypeMarks.map(({ code }) => code),
    manifest.marks.map(({ code }) => code),
  )
  assert.deepEqual(
    archetypeMarks.map(({ code }) => code).sort(),
    archetypes.map(({ code }) => code).sort(),
  )
  assert.equal(new Set(archetypeMarks.map(({ code }) => code)).size, 8)
  assert.equal(
    new Set(archetypeMarks.map(serializeArchetypeMarkBody)).size,
    8,
  )
  assert.equal(
    archetypeMarks.every(({ code }) => /^[PRMS][+-]$/u.test(code)),
    true,
  )
  assert.equal(archetypeMarks.some(({ code }) => code.includes("/")), false)
  assert.equal(getArchetypeMark("P/R+"), null)

  for (const supplied of manifest.marks) {
    const definition = getArchetypeMark(supplied.code)
    assert.ok(definition, supplied.code)
    assert.equal(definition.viewBox, supplied.viewBox)
    assert.equal(serializeArchetypeMarkBody(definition), supplied.svgBody)
    assert.equal(
      archetypeDisplay.formatArchetypeDisplayCode(definition.code),
      supplied.displayCode,
    )
    assert.equal(
      archetypes.find(({ code }) => code === definition.code)?.name,
      supplied.name,
    )
  }
})

test("the rendered JSX geometry is byte-equivalent to every manifest body", () => {
  for (const supplied of manifest.marks) {
    const markup = render(ArchetypeMark, {
      code: supplied.code,
      size: ARCHETYPE_MARK_DIRECTORY_SIZE,
    })
    assert.match(markup, /^<svg\b/u)
    assert.match(markup, /viewBox="0 0 100 100"/u)
    assert.deepEqual(svgBodies(markup), [supplied.svgBody], supplied.code)
  }
})

test("mark geometry is monochrome currentColor, static, inline, and bounded", () => {
  const forbiddenMarkup =
    /<(?:animate|animateMotion|animateTransform|defs|filter|foreignObject|image|linearGradient|mask|radialGradient|script|set|style|symbol|text|use)\b|\b(?:href|xlink:href|src)=|url\s*\(/iu

  function inspect(
    node: ArchetypeMarkNode,
    inherited: Readonly<{ fill?: string; stroke?: string; strokeWidth?: number }>,
    code: string,
  ): void {
    const paint = {
      fill: node.fill ?? inherited.fill,
      stroke: node.stroke ?? inherited.stroke,
      strokeWidth: node.strokeWidth ?? inherited.strokeWidth ?? 0,
    }
    if (node.fill !== undefined) {
      assert.ok(node.fill === "none" || node.fill === "currentColor", code)
    }
    if (node.stroke !== undefined) assert.equal(node.stroke, "currentColor", code)

    if (node.kind === "group") {
      node.children.forEach((child) => inspect(child, paint, code))
      return
    }

    assert.ok(
      paint.fill === "currentColor" || paint.stroke === "currentColor",
      `${code}: unpainted ${node.kind}`,
    )
    const halfStroke = paint.stroke === "currentColor" ? paint.strokeWidth / 2 : 0
    const coordinates =
      node.kind === "circle"
        ? [
            node.cx - node.r,
            node.cx + node.r,
            node.cy - node.r,
            node.cy + node.r,
          ]
        : [...node.d.matchAll(/-?\d+(?:\.\d+)?/gu)].map(([value]) =>
            Number(value),
          )
    assert.ok(coordinates.length > 0, code)
    for (const coordinate of coordinates) {
      assert.ok(coordinate - halfStroke > 0, `${code}: ${coordinate}`)
      assert.ok(coordinate + halfStroke < 100, `${code}: ${coordinate}`)
    }
  }

  for (const definition of archetypeMarks) {
    definition.nodes.forEach((node) => inspect(node, {}, definition.code))
    const markup = render(ArchetypeMark, {
      code: definition.code,
      size: ARCHETYPE_MARK_HERO_SIZE * 2,
    })
    assert.deepEqual(pictorialSizes(markup), [224])
    assert.match(markup, /currentColor/u)
    assert.doesNotMatch(markup, forbiddenMarkup)
  }

  assert.doesNotMatch(COMPONENT_SOURCE, /^\s*["']use client["']/mu)
  assert.doesNotMatch(
    COMPONENT_SOURCE,
    /dangerouslySetInnerHTML|\.svg["']|<use\b|href=|<mask\b|<filter\b|<animate\b|<script\b|gradient|@keyframes/iu,
  )
})

test("ArchetypeMark uses visible U+2212 code below 32px and pictorial SVG at 32px", () => {
  const fallback = render(ArchetypeMark, {
    code: "P-",
    size: ARCHETYPE_MARK_MIN_PICTORIAL_SIZE - 1,
    decorative: false,
    label: "P minus",
  })
  assert.match(fallback, /^<span\b/u)
  assert.match(fallback, /data-archetype-mark-render="code"/u)
  assert.match(fallback, /role="img"/u)
  assert.match(fallback, /aria-label="P minus"/u)
  assert.match(fallback, />P−<\/span>$/u)
  assert.doesNotMatch(fallback, /<svg\b/u)
  assert.doesNotMatch(fallback, />P-<\/span>/u)

  const threshold = render(ArchetypeMark, {
    code: "P-",
    size: ARCHETYPE_MARK_MIN_PICTORIAL_SIZE,
  })
  assert.match(threshold, /^<svg\b/u)
  assert.deepEqual(pictorialSizes(threshold), [32])
  assert.match(threshold, /aria-hidden="true"/u)
  assert.match(threshold, /focusable="false"/u)

  const defaultSize = render(ArchetypeMark, { code: "P+" })
  assert.deepEqual(pictorialSizes(defaultSize), [ARCHETYPE_MARK_DIRECTORY_SIZE])
  assert.equal(render(ArchetypeMark, { code: "P+", size: 0 }), "")
  assert.equal(
    render(ArchetypeMark, {
      code: "P+",
      decorative: false,
      label: "   ",
    }),
    "",
  )
})

test("pure marks support decorative and concise meaningful accessibility modes", () => {
  const decorative = render(ArchetypeMark, {
    code: "M+",
    size: ARCHETYPE_MARK_DIRECTORY_SIZE,
    className: "route-mark",
  })
  assert.match(decorative, /class="archetype-mark archetype-mark--pictorial route-mark"/u)
  assert.match(decorative, /aria-hidden="true"/u)
  assert.doesNotMatch(decorative, /\brole=/u)
  assert.doesNotMatch(decorative, /aria-label=/u)

  const meaningful = render(ArchetypeMark, {
    code: "M+",
    size: ARCHETYPE_MARK_HERO_SIZE,
    decorative: false,
    label: "Satyagraha mark",
  })
  assert.match(meaningful, /role="img"/u)
  assert.match(meaningful, /aria-label="Satyagraha mark"/u)
  assert.doesNotMatch(meaningful, /aria-hidden=/u)
  assert.match(meaningful, /focusable="false"/u)
})

test("FoundationMark renders pure hero and compact contracts without a client boundary", () => {
  const hero = render(FoundationMark, {
    code: "S-",
    presentation: "hero",
  })
  assert.match(hero, /data-foundation-mark="pure"/u)
  assert.match(hero, /data-foundation-mark-presentation="hero"/u)
  assert.deepEqual(pictorialSizes(hero), [ARCHETYPE_MARK_HERO_SIZE])
  assert.equal(svgBodies(hero).length, 1)

  const compact = render(FoundationMark, {
    code: "S-",
    presentation: "compact",
    decorative: false,
    label: "Dependencia mark",
  })
  assert.match(compact, /data-foundation-mark-presentation="compact"/u)
  assert.deepEqual(pictorialSizes(compact), [ARCHETYPE_MARK_DIRECTORY_SIZE])
  assert.match(compact, /aria-label="Dependencia mark"/u)
})

test("blend hero uses an equal-size Diptych with two pure marks and no blend mark", () => {
  const markup = render(FoundationMark, {
    code: "P/R+",
    primaryCode: "R+",
    presentation: "hero",
  })

  assert.match(markup, /data-foundation-mark="blend"/u)
  assert.match(markup, /data-foundation-mark-layout="diptych"/u)
  assert.match(markup, /data-foundation-mark-primary="R\+"/u)
  assert.match(markup, /data-foundation-mark-runner-up="P\+"/u)
  assert.match(markup, /data-foundation-mark-connector/u)
  assert.deepEqual(pictorialSizes(markup), [112, 112])
  assert.equal(svgBodies(markup).length, 2)
  assert.doesNotMatch(markup, /data-archetype-mark="P\/R\+"/u)
  assert.match(markup, />P\/R\+</u)
  assert.match(markup, />Grotian</u)
  assert.match(markup, />Kairos</u)
  assert.equal((markup.match(/aria-hidden="true"/gu) ?? []).length >= 3, true)
  assert.doesNotMatch(markup, /role="img"/u)
})

test("compact blend uses a 48/32 Hallmark with bordered runner-up and both names", () => {
  const markup = render(FoundationMark, {
    code: "P/R-",
    primaryCode: "R-",
    presentation: "compact",
  })

  assert.match(markup, /data-foundation-mark-layout="hallmark"/u)
  assert.match(markup, /data-foundation-mark-primary="R-"/u)
  assert.match(markup, /data-foundation-mark-runner-up="P-"/u)
  assert.match(markup, /data-foundation-mark-bordered="true"/u)
  assert.match(markup, /border:1px solid currentColor/u)
  assert.deepEqual(pictorialSizes(markup), [48, 32])
  assert.equal(
    pictorialSizes(markup).every(
      (size) => size >= ARCHETYPE_MARK_MIN_PICTORIAL_SIZE,
    ),
    true,
  )
  assert.equal(svgBodies(markup).length, 2)
  assert.doesNotMatch(markup, /data-archetype-mark="P\/R-"/u)
  assert.match(markup, />P\/R−</u)
  assert.match(markup, /aria-label="P slash R minus"/u)
  assert.match(markup, />Concert</u)
  assert.match(markup, />Shi \(勢\)</u)
})

test("invalid blend-primary pairings fail closed", () => {
  assert.equal(
    render(FoundationMark, {
      code: "P/R+",
      primaryCode: "M+",
      presentation: "hero",
    }),
    "",
  )
})
