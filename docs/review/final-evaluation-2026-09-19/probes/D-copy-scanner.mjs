#!/usr/bin/env node
// Read-only source-copy candidate inventory. Uses only the existing `typescript` dep.
import { readFile, readdir, stat } from "node:fs/promises"
import { createHash } from "node:crypto"
import { extname, join, relative, resolve, sep } from "node:path"
import ts from "/private/tmp/ir-final-audit-20260919/source/node_modules/typescript/lib/typescript.js"

const ROOT = process.cwd()
const TARGETS = ["app", "components", "lib", "content", "messages", "i18n"]
const EXT = new Set([".ts", ".tsx", ".json"])
const SKIP_DIRS = new Set(["node_modules", ".next", "dist", "build", ".git", "coverage", "out", ".turbo", ".cache"])

const HOUSE_JARGON = /\b(?:layers?|registered|tuple|calibrat(?:ed|ion|ing))\b/iu
const RATHER_THAN = /\brather than\b/iu
const DISCLAIMER = /\b(?:this is not|does not claim|not a claim|is not a substitute|no substitute)\b/iu
const HABITUAL_YOU = /\b(?:you (?:often|usually|tend to|generally)|when you (?:usually|often)|you(?:'|’)?re someone who)\b/iu
const RANKING = /\bThe (?:real|deeper|sharper|first|true|actual|key) (?:question|issue|problem|answer)\b/iu

function toPosix(p) { return p.split(sep).join("/") }

async function walk(dir) {
  const out = []
  let entries
  try { entries = await readdir(dir, { withFileTypes: true }) } catch { return out }
  for (const e of entries) {
    if (e.name.startsWith(".") && e.name !== ".") continue
    if (SKIP_DIRS.has(e.name)) continue
    const full = join(dir, e.name)
    if (e.isDirectory()) out.push(...(await walk(full)))
    else if (e.isFile() && EXT.has(extname(e.name))) out.push(full)
  }
  return out
}

function wordCount(s) {
  const m = s.match(/[\p{L}\p{N}]+/gu)
  return m ? m.length : 0
}
function cjkCount(s) {
  const m = s.match(/[\u3400-\u9FFF\uF900-\uFAFF]/gu)
  return m ? m.length : 0
}
function isCopyWorthy(text) {
  const t = text.replace(/\s+/g, " ").trim()
  if (t.length < 4) return false
  if (cjkCount(t) > 10) return true
  return wordCount(t) >= 4
}
function looksLikePath(s) {
  return /^(?:@\/|\.\.?\/|https?:\/\/|[a-z0-9_-]+\.(?:ts|tsx|js|jsx|json|mjs|cjs))$/i.test(s)
    || /^[a-z0-9_][\w./:@-]*$/i.test(s) && /[-_./:@]/.test(s)
}
const NONCOPY_ATTRS = new Set(["className","href","id","key","name","type","role","value","src","rel","target","data-testid" ,"aria-labelledby","htmlFor","for"])

function scriptKind(file) {
  switch (extname(file)) {
    case ".tsx": return ts.ScriptKind.TSX
    case ".jsx": return ts.ScriptKind.JSX
    case ".js": case ".mjs": return ts.ScriptKind.JS
    default: return ts.ScriptKind.TS
  }
}

function extractFromSource(file, source) {
  const sf = ts.createSourceFile(file, source, ts.ScriptTarget.Latest, true, scriptKind(file))
  const out = []
  function push(node, text) {
    const t = text.replace(/\s+/g, " ").trim()
    if (!isCopyWorthy(t)) return
    if (looksLikePath(t)) return
    const pos = sf.getLineAndCharacterOfPosition(node.getStart(sf))
    out.push({ line: pos.line + 1, text: t })
  }
  function visit(node) {
    if (ts.isStringLiteral(node) || ts.isNoSubstitutionTemplateLiteral(node)) {
      let p = node.parent
      if (ts.isImportDeclaration(p) || ts.isExportDeclaration(p)) { ts.forEachChild(node, visit); return }
      if (p && ts.isExternalModuleReference(p)) { ts.forEachChild(node, visit); return }
      if (ts.isLiteralTypeNode(p)) { ts.forEachChild(node, visit); return }
      if (ts.isPropertyAssignment(p) && p.name === node) { ts.forEachChild(node, visit); return }
      if (ts.isElementAccessExpression(p) && p.argumentExpression === node) { ts.forEachChild(node, visit); return }
      if (ts.isJsxAttribute(p)) {
        const attr = p.name.getText(sf)
        if (NONCOPY_ATTRS.has(attr) || attr.startsWith("data-")) { ts.forEachChild(node, visit); return }
      }
      push(node, node.text)
    } else if (ts.isTemplateExpression(node)) {
      const parts = [node.head.text, ...node.templateSpans.map(s => s.literal.text)]
      push(node, node.getText(sf))
    } else if (ts.isJsxText(node)) {
      push(node, node.getText(sf))
    }
    ts.forEachChild(node, visit)
  }
  visit(sf)
  return out
}

function extractFromJson(file, source) {
  let parsed
  try { parsed = JSON.parse(source) } catch { return extractFromSource(file, source) }
  const out = []
  const seen = new Map()
  function visit(value, path) {
    if (typeof value === "string") {
      const last = path[path.length - 1] || ""
      if (/^(?:id|slug|href|url|key|sourceId|claimId|storageKey|code|status|kind|locale)$/i.test(last)) return
      if (/^(?:sourceRecords|sources)\.\d+\.title$/.test(path.join("."))) return
      if (/^[a-z0-9_][\w.:/@-]*$/i.test(value) && /[-_./:@]/.test(value)) return
      const t = value.replace(/\s+/g, " ").trim()
      if (!isCopyWorthy(t)) return
      const encoded = JSON.stringify(value)
      const from = seen.get(encoded) ?? 0
      const idx = source.indexOf(encoded, from)
      if (idx >= 0) seen.set(encoded, idx + encoded.length)
      const line = idx >= 0 ? source.slice(0, idx).split("\n").length : 1
      out.push({ line, text: t })
      return
    }
    if (Array.isArray(value)) { value.forEach((v, i) => visit(v, [...path, String(i)])); return }
    if (value && typeof value === "object") { for (const [k, v] of Object.entries(value)) visit(v, [...path, k]) }
  }
  visit(parsed, [])
  return out
}

function flagsFor(text) {
  const flags = []
  if (RATHER_THAN.test(text)) flags.push("rather_than")
  if (DISCLAIMER.test(text)) flags.push("disclaimer_negation")
  if (HABITUAL_YOU.test(text)) flags.push("unearned_habitual_you")
  if (HOUSE_JARGON.test(text)) flags.push("house_jargon")
  if (RANKING.test(text)) flags.push("ranking_opener")
  if (/\b[\w'’-]+(?:,\s+[\w'’-]+){2},\s+(?:and|or)\s+[\w'’-]+/u.test(text)) flags.push("list_of_three_rough")
  return flags
}

function openingKey(text) {
  const words = text.replace(/^[^\p{L}\p{N}]+/u, "").match(/[\p{L}\p{N}'’-]+/gu)
  if (!words || words.length < 4) return null
  return words.slice(0, 4).join(" ").toLowerCase()
}

const allFiles = []
for (const t of TARGETS) {
  const abs = resolve(ROOT, t)
  try { const s = await stat(abs); if (s.isFile()) allFiles.push(abs); else allFiles.push(...(await walk(abs))) } catch {}
}

const filesMeta = []
const rawCandidates = []
for (const abs of allFiles) {
  const rel = toPosix(relative(ROOT, abs))
  const source = await readFile(abs, "utf8")
  const lines = source.split("\n").length
  const sha256 = createHash("sha256").update(source).digest("hex")
  filesMeta.push({ path: rel, lines, sha256 })
  const extracted = extname(abs) === ".json" ? extractFromJson(abs, source) : extractFromSource(abs, source)
  for (const c of extracted) rawCandidates.push({ file: rel, line: c.line, text: c.text })
}

// Group by opening across DISTINCT strings; flag when 4+ distinct matches share opening.
const openingCounts = new Map()
const seenStrings = new Map()
for (const c of rawCandidates) {
  const key = openingKey(c.text)
  if (!key) continue
  let set = seenStrings.get(key)
  if (!set) { set = new Set(); seenStrings.set(key, set) }
  set.add(c.text)
}

const candidates = rawCandidates.map(c => {
  const flags = flagsFor(c.text)
  const key = openingKey(c.text)
  if (key && seenStrings.get(key)?.size >= 4) flags.push("repeated_sentence_opening")
  return { file: c.file, line: c.line, text: c.text, patternFlags: flags }
})

process.stdout.write(JSON.stringify({ files: filesMeta, candidates }, null, 2) + "\n")