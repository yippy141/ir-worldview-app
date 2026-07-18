#!/usr/bin/env node

import { readFile, readdir } from "node:fs/promises"
import { extname, relative, resolve, sep } from "node:path"

const projectRoot = resolve(import.meta.dirname, "..")
const scanRoots = ["app", "components", "lib", "content/current-cases"]
const supportedExtensions = new Set([".ts", ".tsx", ".js", ".jsx", ".json"])
const excludedSegments = new Set(["tests", "test", "__tests__", "research-reports", "decisions"])

const rules = [
  {
    id: "hard-coded-question-count",
    priority: "P0",
    kind: "claim",
    pattern: /\b16 questions\b/giu,
    note: "Verify hard-coded counts against the live questionnaire schema.",
    strict: true,
  },
  {
    id: "public-release-language",
    priority: "P0",
    kind: "release",
    pattern:
      /\bV\d+(?:\.\d+)*\b|\bBeta\b|\bversion history\b|\b(?:this|current|local-only|later|previous|older) (?:release|build)\b|\bset v\d*\b/giu,
    note: "Describe current behavior instead of exposing sprint, build, beta, or schema-era labels.",
    strict: true,
  },
  {
    id: "implementation-detail",
    priority: "P0",
    kind: "internal",
    pattern:
      /\b(?:environment variables?|request bod(?:y|ies)|legacy routes?|submit, event, and deletion routes?|first-party validator|provider wrapper|ProfileStore(?: v\d+)?|Profile Share V\d+|decoder|result payloads?|payload segment|browser storage slot|consent mock-up|backend|schema-driven MVP)\b/giu,
    note: "Ordinary-user copy should state the behavior or consequence, not the implementation contract.",
    strict: true,
  },
  {
    id: "retired-product-history",
    priority: "P0",
    kind: "stale-history",
    pattern:
      /\b(?:previous scaffold|prior public form|former encrypted friend-challenge link|earlier versions?|Phase [A-Z0-9][A-Za-z0-9]*(?: pass \d+)?)\b/gu,
    note: "Move retired behavior and engineering history to decision or release records.",
    strict: true,
  },
  {
    id: "banned-contrastive-template",
    priority: "P1",
    kind: "template",
    pattern:
      /\bnot (?:just|only|simply|merely)\b[^.!?\n]{0,180}\bbut\b|\bno longer just\b[\s\S]{0,220}\bit is also\b|\bno longer about\b[\s\S]{0,180}\bit is about\b|\bno longer just\b[^.!?\n]{0,180}\b(?:also|but)\b|\bis not\b[^.!?\n]{1,120}\bbut\b|\bisn[’']t\b[^.!?\n]{0,160}\bit[’']s\b/giu,
    note: "Replace the polished antithesis with a direct, specific claim.",
    strict: true,
  },
  {
    id: "flagged-rhetorical-opener",
    priority: "P2",
    kind: "filler",
    pattern:
      /\b(?:this matters because|at its core|ultimately|the key question|structured way|contextual movement|modeled positions)\b/giu,
    note: "Name the actor, decision, evidence, or consequence directly.",
  },
  {
    id: "consequential-filler",
    priority: "P2",
    kind: "filler",
    pattern: /\b(?:the case is consequential because|most consequential long-run threats?)\b/giu,
    note: "State the concrete consequence; keep “consequential” when it modifies a precise noun in domain copy.",
  },
  {
    id: "abstract-generated-phrase",
    priority: "P1",
    kind: "generated",
    pattern:
      /\b(?:the reward is the map|deeper foreign-policy layer|one read across the saved layers|builds as you complete layers|adds texture|sit beside the baseline|fake master score)\b/giu,
    note: "Replace abstract product narration with the action or comparison the reader will actually get.",
  },
  {
    id: "pressure-test-repetition",
    priority: "P2",
    kind: "metaphor",
    pattern: /\bpressure[- ]tests?\b/giu,
    note: "Keep only where a named challenge tests a stated assumption; otherwise use test, compare, or reconsider.",
  },
  {
    id: "lens-metaphor-review",
    priority: "P2",
    kind: "metaphor-review",
    pattern:
      /\b(?:actor|risk|escalation|alliance|legitimacy|strategic|default|master)[- ]lenses?\b|\b(?:several|multiple|different) lenses\b|\blens cards?\b/giu,
    note: "Actor-lens is a defined question type; decorative lens language should be rewritten.",
  },
  {
    id: "layer-metaphor-review",
    priority: "P2",
    kind: "metaphor-review",
    pattern:
      /\b(?:saved|connected|separate|deeper|foreign-policy|module|AI|governance|applied|result) layers?\b|\bacross (?:the )?(?:saved )?layers\b|\bcomplete layers\b|\blayered in\b|\blayer underneath\b/giu,
    note: "Layer is precise in the Worldview Map control; elsewhere prefer the named saved result or comparison.",
  },
  {
    id: "field-metaphor-review",
    priority: "P2",
    kind: "metaphor-review",
    pattern:
      /\b(?:read|browse|navigate|map) the field\b|\bfield guide\b|\bwhole field\b|\bmap of the field\b|\bposition in the field\b|\bfield map\b/giu,
    note: "Keep for the academic field or a literal interface label; rewrite when it only signals breadth.",
  },
  {
    id: "map-metaphor-review",
    priority: "P2",
    kind: "metaphor-review",
    pattern:
      /\bmap your\b|\bmap how you\b|\bthe reward is the map\b|\bmap (?:your|the) (?:policy |foreign-policy |AI-policy )?instincts\b/giu,
    note: "Keep for the named Worldview Map or an actual projection; rewrite metaphorical promises.",
  },
  {
    id: "weak-generic-heading",
    priority: "P2",
    kind: "heading",
    pattern:
      /^(?:where to go next|continue exploring|start here|what this means|the big picture|how it works)$/giu,
    note: "Name the next decision, evidence, comparison, or route.",
  },
]

const args = new Set(process.argv.slice(2))
if (args.has("--help")) {
  console.log(`Usage: node scripts/audit-public-copy.mjs [--format=json] [--strict]

Scans advisory English public-copy signals in app, components, lib, and
content/current-cases. Tests, reports, decision records, source titles, legal
quotations, identifiers, and already-clear accessibility-only labels are out of
scope. Default mode reports findings and exits 0. --strict exits 1 when a
hard-fail rule (P0, leaked implementation detail, or banned contrastive
template) matches.`)
  process.exit(0)
}

const files = (
  await Promise.all(scanRoots.map((root) => collectFiles(resolve(projectRoot, root))))
).flat()

const findings = []
for (const file of files) {
  const source = await readFile(file, "utf8")
  const candidates = extname(file) === ".json"
    ? jsonCandidates(file, source)
    : sourceCandidates(source)

  for (const candidate of candidates) {
    for (const rule of rules) {
      rule.pattern.lastIndex = 0
      let match
      while ((match = rule.pattern.exec(candidate.text)) !== null) {
        const absoluteIndex = candidate.index + match.index
        findings.push({
          priority: rule.priority,
          rule: rule.id,
          kind: rule.kind,
          file: toPosix(relative(projectRoot, file)),
          line: lineNumberAt(source, absoluteIndex),
          source: compact(candidate.text),
          note: rule.note,
          strict: Boolean(rule.strict),
          path: candidate.path,
        })
        if (match[0].length === 0) rule.pattern.lastIndex += 1
      }
    }
  }
}

const deduped = deduplicate(findings).sort(compareFindings)

if (args.has("--format=json")) {
  console.log(JSON.stringify({ roots: scanRoots, count: deduped.length, findings: deduped }, null, 2))
} else {
  printTextReport(deduped)
}

if (args.has("--strict") && deduped.some((finding) => finding.strict)) {
  process.exitCode = 1
}

async function collectFiles(directory) {
  const entries = await readdir(directory, { withFileTypes: true })
  const collected = []
  for (const entry of entries) {
    if (entry.name.startsWith(".")) continue
    if (entry.name.endsWith("validation.ts")) continue
    const path = resolve(directory, entry.name)
    const segments = relative(projectRoot, path).split(sep)
    if (segments.some((segment) => excludedSegments.has(segment))) continue
    if (entry.isDirectory()) collected.push(...(await collectFiles(path)))
    if (entry.isFile() && supportedExtensions.has(extname(entry.name))) collected.push(path)
  }
  return collected
}

function sourceCandidates(source) {
  const candidates = []
  const stringPattern = /(["'`])((?:\\.|(?!\1)[\s\S])*?)\1/g
  let match
  while ((match = stringPattern.exec(source)) !== null) {
    const text = match[2]
    const lineStart = source.lastIndexOf("\n", match.index) + 1
    const before = source.slice(lineStart, match.index)
    const line = source.slice(lineStart, source.indexOf("\n", match.index) < 0 ? source.length : source.indexOf("\n", match.index))
    const isComment = /^\s*(?:\/\/|\*|\/\*)/.test(line)
    const isImport = /(?:\bfrom|\bimport\s*\(|\brequire\s*\()\s*$/.test(before)
    const isNonCopyAttribute = /(?:className|href|id|key|name|type|role|value|data-[\w-]+)\s*=\s*$/.test(before)
    if (looksLikePublicCopy(text) && !isComment && !isImport && !isNonCopyAttribute) {
      candidates.push({ text, index: match.index + 1, path: null })
    }
  }

  let offset = 0
  for (const line of source.split("\n")) {
    const raw = line.trim()
    const text = line
      .replace(/<[^>]+>/g, " ")
      .replace(/\{[^{}]*\}/g, " ")
      .trim()
    const looksLikeCode =
      /^(?:(?:import|export|const|let|var|type|interface|function|return|if|else|for|while)\b|\/\/|\/\*|\*)/.test(raw) ||
      /^\w+\??:\s*[\w<>{}\[\]|]+,?$/.test(raw) ||
      /[=;{}]/.test(raw) ||
      /["'`]/.test(raw) ||
      raw.endsWith(",")
    if (looksLikePublicCopy(text) && !looksLikeCode) {
      candidates.push({ text, index: offset + Math.max(0, line.indexOf(text)), path: null })
    }
    offset += line.length + 1
  }
  return candidates
}

function jsonCandidates(file, source) {
  let parsed
  try {
    parsed = JSON.parse(source)
  } catch {
    return sourceCandidates(source)
  }

  const candidates = []
  const seenAt = new Map()
  visit(parsed, [], (value, path) => {
    if (excludedJsonPath(path)) return
    const encoded = JSON.stringify(value)
    const from = seenAt.get(encoded) ?? 0
    const encodedIndex = source.indexOf(encoded, from)
    if (encodedIndex >= 0) seenAt.set(encoded, encodedIndex + encoded.length)
    candidates.push({
      text: value,
      index: encodedIndex >= 0 ? encodedIndex + 1 : 0,
      path: path.join("."),
    })
  })
  return candidates
}

function visit(value, path, onString) {
  if (typeof value === "string") {
    onString(value, path)
    return
  }
  if (Array.isArray(value)) {
    value.forEach((item, index) => visit(item, [...path, String(index)], onString))
    return
  }
  if (value && typeof value === "object") {
    Object.entries(value).forEach(([key, item]) => visit(item, [...path, key], onString))
  }
}

function excludedJsonPath(path) {
  const joined = path.join(".")
  const last = path.at(-1) ?? ""
  return (
    last === "editorialMemo" ||
    /(?:^|\.)(?:sourceRecords|sources)\.\d+\.title$/.test(joined) ||
    /(?:legalQuotation|legalQuote|quotation|verbatimQuote)$/i.test(last) ||
    /(?:^|\.)(?:id|slug|href|url|sourceId|claimId)$/.test(joined)
  )
}

function looksLikePublicCopy(text) {
  const normalized = compact(text)
  if (normalized.length < 3 || !/[A-Za-z]/.test(normalized)) return false
  if (/^(?:@\/|\.\.?\/|https?:\/\/|[a-z0-9_-]+\.(?:ts|tsx|js|jsx|json))/.test(normalized)) return false
  if (/^--[a-z0-9_-]+$/i.test(normalized)) return false
  if (/^[a-z0-9_][\w.:/@-]*$/i.test(normalized) && /[-_./:@]/.test(normalized)) return false
  if (/^[a-z][A-Za-z0-9]*(?:\.[a-zA-Z0-9]+)+$/.test(normalized)) return false
  return true
}

function lineNumberAt(source, index) {
  return source.slice(0, Math.max(0, index)).split("\n").length
}

function compact(value) {
  return value.replace(/\\n/g, " ").replace(/\s+/g, " ").trim()
}

function toPosix(path) {
  return path.split(sep).join("/")
}

function deduplicate(items) {
  const seen = new Set()
  return items.filter((item) => {
    const key = `${item.rule}:${item.file}:${item.line}:${item.source}`
    if (seen.has(key)) return false
    seen.add(key)
    return true
  })
}

function compareFindings(left, right) {
  return (
    left.priority.localeCompare(right.priority) ||
    left.file.localeCompare(right.file) ||
    left.line - right.line ||
    left.rule.localeCompare(right.rule)
  )
}

function printTextReport(items) {
  const counts = Object.fromEntries(["P0", "P1", "P2"].map((priority) => [
    priority,
    items.filter((item) => item.priority === priority).length,
  ]))
  console.log(`Public-copy audit: ${items.length} signals (P0 ${counts.P0}, P1 ${counts.P1}, P2 ${counts.P2})`)
  console.log("Advisory scan: review context before editing; not every metaphor match is an error.\n")

  for (const item of items) {
    const location = `${item.file}:${item.line}${item.path ? ` [${item.path}]` : ""}`
    console.log(`[${item.priority}] ${item.rule} — ${location}`)
    console.log(`  ${truncate(item.source, 220)}`)
    console.log(`  ${item.note}\n`)
  }
}

function truncate(value, max) {
  return value.length <= max ? value : `${value.slice(0, max - 1)}…`
}
