#!/usr/bin/env node

import { readFile, readdir, stat } from "node:fs/promises"
import { extname, relative, resolve, sep } from "node:path"
import ts from "typescript"
import { compareCodeUnitStrings } from "./code-unit-order.mjs"

const projectRoot = resolve(import.meta.dirname, "..")
const scanTargets = [
  "app",
  "components",
  "lib",
  "content/instrument",
  "content/current-cases",
  "content/archetypes.json",
  "content/locales",
  "messages",
  "i18n",
]
const supportedExtensions = new Set([".ts", ".tsx", ".mts", ".js", ".jsx", ".mjs", ".json"])
const excludedSegments = new Set(["tests", "test", "__tests__", "research-reports", "decisions"])
const nonCopyJsxAttributes = new Set([
  "className",
  "href",
  "id",
  "key",
  "name",
  "type",
  "role",
  "value",
  "src",
  "rel",
  "target",
])

const rules = [
  {
    id: "hard-coded-question-count",
    priority: "P0",
    kind: "claim",
    pattern: /\b16 questions\b/giu,
    reason: "The count can drift from the live questionnaire schema.",
    action: "Verify the count against the live schema or describe the questionnaire without a fixed count.",
    strict: true,
  },
  {
    id: "public-release-language",
    priority: "P0",
    kind: "release",
    pattern:
      /\bV\d+(?:\.\d+)*\b|\bBeta\b|\bversion history\b|\b(?:this|current|local-only|later|previous|older) (?:release|build)\b|\bset v\d*\b/giu,
    reason: "Release and schema-era labels expose internal product history in reader-facing copy.",
    action: "Describe current behavior; keep release history in engineering or decision records.",
    strict: true,
    unless: (_text, context) =>
      isActiveBetaProgramReference(context.match, context.file),
  },
  {
    id: "implementation-detail",
    priority: "P0",
    kind: "internal",
    pattern:
      /\b(?:environment variables?|request bod(?:y|ies)|legacy routes?|submit, event, and deletion routes?|first-party validator|provider wrapper|ProfileStore(?: v\d+)?|Profile Share V\d+|decoder|result payloads?|payload segment|browser storage slot|consent mock-up|backend|schema-driven MVP)\b/giu,
    reason: "The copy exposes an implementation contract instead of a reader-facing behavior or consequence.",
    action: "State what the reader can do, what is stored, or why an action is unavailable.",
    strict: true,
    unless: (text, context) => isNecessaryPrivacyDisclosure(text, context.file),
  },
  {
    id: "retired-product-history",
    priority: "P0",
    kind: "stale-history",
    pattern:
      /\b(?:previous scaffold|prior public form|former encrypted friend-challenge link|earlier versions?|Phase [A-Z0-9][A-Za-z0-9]*(?: pass \d+)?)\b/gu,
    reason: "Retired behavior and internal phase history are presented as current product copy.",
    action: "Move the history to a decision or release record and describe only current behavior here.",
    strict: true,
  },
  {
    id: "banned-contrastive-template",
    priority: "P1",
    kind: "template",
    pattern:
      /\bnot (?:just|only|simply|merely)\b[^.!?\n]{0,180}\bbut\b|\bno longer just\b[\s\S]{0,220}\bit is also\b|\bno longer about\b[\s\S]{0,180}\bit is about\b|\bno longer just\b[^.!?\n]{0,180}\b(?:also|but)\b|\bis not\b[^.!?\n]{1,120}\bbut\b|\bisn[’']t\b[^.!?\n]{0,160}\bit[’']s\b/giu,
    reason: "The sentence uses a high-confidence polished-antithesis template.",
    action: "Replace the contrastive frame with one direct, specific claim.",
    strict: true,
  },
  {
    id: "sits-between-template",
    priority: "P1",
    kind: "template-review",
    pattern: /\bsits? between\b/giu,
    reason: "“Sits between” can imply a calibrated midpoint or reduce a distinct position to two neighboring poles.",
    action: "Name the respondent’s result and the concrete commitments it combines.",
  },
  {
    id: "keeps-in-play-template",
    priority: "P1",
    kind: "template-review",
    pattern: /\bkeeps?\b[^.!?\n]{0,100}\bin play\b/giu,
    reason: "“Keeps … in play” is an abstract template that can conceal the actual judgment.",
    action: "Name the consideration retained and when it affects a decision.",
  },
  {
    id: "pulls-clear-template",
    priority: "P1",
    kind: "template-review",
    pattern: /\bpull(?:s|ing|ed)? clear\b/giu,
    reason: "“Pulls clear” implies movement without identifying a calibrated scale.",
    action: "Describe the result directly without directional movement language.",
  },
  {
    id: "what-matters-most-template",
    priority: "P2",
    kind: "template-review",
    pattern: /\bwhat matters most\b/giu,
    reason: "The phrase often introduces a generic hierarchy without naming the decision or tradeoff.",
    action: "Name the decisive consideration or use a heading tied to the reader’s result.",
  },
  {
    id: "you-generally-believe-template",
    priority: "P1",
    kind: "template-review",
    pattern: /\byou generally believe\b/giu,
    reason: "The phrase overstates a modeled response as a durable personal belief.",
    action: "Describe what this result emphasizes or how the respondent answered this domain.",
  },
  {
    id: "deeper-danger-template",
    priority: "P2",
    kind: "template-review",
    pattern: /\b(?:the )?deeper danger\b/giu,
    reason: "The phrase declares a hidden hierarchy without specifying the concrete risk.",
    action: "Name the risk, actor, and consequence directly.",
  },
  {
    id: "stronger-path-template",
    priority: "P2",
    kind: "template-review",
    pattern: /\b(?:the )?stronger path\b/giu,
    reason: "The phrase asserts superiority without stating the decision criterion.",
    action: "Name the preferred course and the reason this result favors it.",
  },
  {
    id: "unsupported-prevalence-language",
    priority: "P1",
    kind: "distributional-claim",
    pattern:
      /\bmost answer patterns?\b|\b(?:most|many|few|the majority of) (?:respondents?|people|users?|profiles?|results?|answer patterns?|cases?|analysts?|readers?)\b|\btypical(?:ly)? (?:profiles?|results?|respondents?|answer patterns?)\b|\b(?:common|frequent|prevalent|normal) (?:profiles?|results?|responses?|outputs?|answer patterns?)\b|\b(?:profiles?|results?|responses?|outputs?|answer patterns?) (?:are|look|remain) (?:common|frequent|prevalent|normal)\b|\b(?:often|usually) remains? close\b|\b(?:mixed )?(?:scores?|results?)\b[^.!?\n]{0,80}\busually means\b|\bmore likely than (?:most|other) profiles\b|\b\d+(?:\.\d+)?% of (?:respondents?|people|users?|profiles?|results?)\b|(?:大多数|多数)(?:受访者|用户|回答者|回答|结果|画像|案例|情形)|(?:混合)?(?:结果|回答)(?:很常见|并不异常)/giu,
    reason: "The copy makes a prevalence or distributional claim without naming its evidence base.",
    action: "Name the calibration artifact or aggregate cohort, or state this respondent’s result directly.",
    unless: (text, context) =>
      hasNamedDataSource(text) ||
      hasNearbyNamedDataSource(context.source, context.candidate) ||
      isNegatedPrevalenceClaim(text),
  },
  {
    id: "general-prevalence-language-review",
    priority: "P2",
    kind: "distributional-review",
    pattern: /\b(?:often|usually|normally|commonly|frequently)\b|(?:通常|往往|常常|经常)/giu,
    reason: "The frequency qualifier may imply an observed pattern without identifying its evidence base.",
    action: "Keep it for a sourced proposition; otherwise state the condition, tendency, or respondent result directly.",
    unless: (text, context) =>
      hasNamedDataSource(text) ||
      hasNearbyNamedDataSource(context.source, context.candidate) ||
      isNegatedPrevalenceClaim(text) ||
      hasHighConfidencePrevalencePhrase(text),
  },
  {
    id: "flagged-rhetorical-opener",
    priority: "P2",
    kind: "filler",
    pattern:
      /\b(?:this matters because|at its core|ultimately|the key question|structured way|contextual movement|modeled positions)\b/giu,
    reason: "The phrase delays the actor, decision, evidence, or consequence.",
    action: "Lead with the concrete actor, decision, evidence, or consequence.",
  },
  {
    id: "consequential-filler",
    priority: "P2",
    kind: "filler",
    pattern: /\b(?:the case is consequential because|most consequential long-run threats?)\b/giu,
    reason: "“Consequential” substitutes for the specific effect at stake.",
    action: "State the concrete consequence; retain the word only when it modifies a precise noun.",
  },
  {
    id: "abstract-generated-phrase",
    priority: "P1",
    kind: "generated",
    pattern:
      /\b(?:the reward is the map|deeper foreign-policy layer|one read across the saved layers|builds as you complete layers|adds texture|sit beside the baseline|fake master score)\b/giu,
    reason: "The phrase narrates an abstract product model instead of the reader’s action or result.",
    action: "Name the saved result, comparison, or action the reader will actually see.",
  },
  {
    id: "pressure-test-repetition",
    priority: "P2",
    kind: "metaphor",
    pattern: /\bpressure[- ]tests?\b/giu,
    reason: "The metaphor is often repeated where no named assumption is being tested.",
    action: "Keep it only for a stated assumption under a named challenge; otherwise use test, compare, or reconsider.",
  },
  {
    id: "lens-metaphor-review",
    priority: "P2",
    kind: "metaphor-review",
    pattern:
      /\b(?:actor|risk|escalation|alliance|legitimacy|strategic|default|master)[- ]lenses?\b|\b(?:several|multiple|different) lenses\b|\blens cards?\b/giu,
    reason: "Lens language can become decorative outside the defined actor-lens question type.",
    action: "Keep the defined question-type term; otherwise name the perspective or decision directly.",
  },
  {
    id: "layer-metaphor-review",
    priority: "P2",
    kind: "metaphor-review",
    pattern:
      /\b(?:saved|connected|separate|deeper|foreign-policy|module|AI|governance|applied|result) layers?\b|\bacross (?:the )?(?:saved )?layers\b|\bcomplete layers\b|\blayered in\b|\blayer underneath\b/giu,
    reason: "Layer is precise in the Worldview Map control but often abstract elsewhere.",
    action: "Use the named saved result or comparison unless this is the literal map control.",
  },
  {
    id: "field-metaphor-review",
    priority: "P2",
    kind: "metaphor-review",
    pattern:
      /\b(?:read|browse|navigate|map) the field\b|\bfield guide\b|\bwhole field\b|\bmap of the field\b|\bposition in the field\b|\bfield map\b/giu,
    reason: "The phrase may signal breadth without identifying an actual academic field or interface.",
    action: "Keep it for a literal field or interface label; otherwise name what the reader can browse or compare.",
  },
  {
    id: "map-metaphor-review",
    priority: "P2",
    kind: "metaphor-review",
    pattern:
      /\bmap your\b|\bmap how you\b|\bthe reward is the map\b|\bmap (?:your|the) (?:policy |foreign-policy |AI-policy )?instincts\b/giu,
    reason: "Map language can promise a projection that the interface does not actually show.",
    action: "Keep it for the named Worldview Map or an actual projection; otherwise state the result or action directly.",
  },
  {
    id: "weak-generic-heading",
    priority: "P2",
    kind: "heading",
    pattern:
      /^(?:where to go next|continue exploring|start here|what this means|the big picture|how it works)$/giu,
    reason: "The heading does not identify the next decision, evidence, comparison, or route.",
    action: "Replace it with a heading specific to the following content or action.",
  },
]

const args = new Set(process.argv.slice(2))
if (args.has("--help")) {
  console.log(`Usage: node scripts/audit-public-copy.mjs [--format=json] [--strict]

Scans advisory English public-copy signals in app, components, lib, instrument
and Current Case content, archetypes, and public locale sources. Tests,
research reports, decision records, source titles, legal quotations,
identifiers, and accessibility-only labels are out of scope. Operational and
frozen compatibility strings remain visible but cannot fail strict mode.
Default mode reports findings and exits 0. --strict exits 1 only when a
strict correctness, trust, implementation-leakage, stale-release, or
high-confidence template rule matches active public copy.`)
  process.exit(0)
}

const files = (await Promise.all(scanTargets.map(collectTarget))).flat()
const findings = []

for (const file of files) {
  const source = await readFile(file, "utf8")
  const candidates = extname(file) === ".json"
    ? jsonCandidates(file, source)
    : sourceCandidates(file, source)

  for (const candidate of candidates) {
    const audience = classifyAudience(file, candidate)
    for (const rule of rules) {
      rule.pattern.lastIndex = 0
      let match
      while ((match = rule.pattern.exec(candidate.text)) !== null) {
        if (!rule.unless?.(candidate.text, { file, source, candidate, match })) {
          findings.push(buildFinding({ file, source, candidate, match, rule, audience }))
        }
        if (match[0].length === 0) rule.pattern.lastIndex += 1
      }
    }
  }

  findings.push(...structuralFindings(file, source, candidates))
}

const deduped = deduplicate(findings).sort(compareFindings)

if (args.has("--format=json")) {
  console.log(JSON.stringify({ roots: scanTargets, targets: scanTargets, count: deduped.length, findings: deduped }, null, 2))
} else {
  const strictOnly = args.has("--strict")
  printTextReport(
    strictOnly ? deduped.filter((finding) => finding.strict) : deduped,
    deduped,
    strictOnly,
  )
}

if (args.has("--strict") && deduped.some((finding) => finding.strict)) {
  process.exitCode = 1
}

async function collectTarget(target) {
  const absolute = resolve(projectRoot, target)
  let details
  try {
    details = await stat(absolute)
  } catch (error) {
    if (error?.code === "ENOENT") return []
    throw error
  }
  if (details.isFile()) return supportedExtensions.has(extname(absolute)) ? [absolute] : []
  return collectFiles(absolute)
}

async function collectFiles(directory) {
  const entries = await readdir(directory, { withFileTypes: true })
  const collected = []
  for (const entry of entries) {
    if (entry.name.startsWith(".")) continue
    const path = resolve(directory, entry.name)
    const segments = relative(projectRoot, path).split(sep)
    if (segments.some((segment) => excludedSegments.has(segment))) continue
    if (entry.isDirectory()) collected.push(...(await collectFiles(path)))
    if (entry.isFile() && supportedExtensions.has(extname(entry.name))) collected.push(path)
  }
  return collected
}

function sourceCandidates(file, source) {
  const kind = scriptKindFor(file)
  const sourceFile = ts.createSourceFile(file, source, ts.ScriptTarget.Latest, true, kind)
  const candidates = []

  function visitNode(node) {
    if (isCandidateNode(node) && !isExcludedSourceNode(node)) {
      const text = sourceNodeText(node)
      if (looksLikePublicCopy(text)) {
        candidates.push({
          text,
          index: node.getStart(sourceFile),
          line: sourceFile.getLineAndCharacterOfPosition(node.getStart(sourceFile)).line + 1,
          path: sourceContentKey(node, sourceFile),
        })
      }
    }
    ts.forEachChild(node, visitNode)
  }

  visitNode(sourceFile)
  return candidates
}

function scriptKindFor(file) {
  switch (extname(file)) {
    case ".tsx": return ts.ScriptKind.TSX
    case ".jsx": return ts.ScriptKind.JSX
    case ".js":
    case ".mjs": return ts.ScriptKind.JS
    default: return ts.ScriptKind.TS
  }
}

function isCandidateNode(node) {
  return (
    ts.isStringLiteral(node) ||
    ts.isNoSubstitutionTemplateLiteral(node) ||
    ts.isTemplateExpression(node) ||
    ts.isJsxText(node)
  )
}

function isExcludedSourceNode(node) {
  if (ts.isJsxText(node)) return false
  if (ts.isImportDeclaration(node.parent) || ts.isExportDeclaration(node.parent)) return true
  if (ts.isExternalModuleReference(node.parent)) return true
  if (ts.isLiteralTypeNode(node.parent)) return true
  if (
    ts.isExpressionStatement(node.parent) &&
    node.parent.parent &&
    ts.isSourceFile(node.parent.parent)
  ) return true
  if (
    ts.isPropertyAssignment(node.parent) &&
    node.parent.name === node
  ) return true
  if (
    ts.isElementAccessExpression(node.parent) &&
    node.parent.argumentExpression === node
  ) return true
  if (ts.isJsxAttribute(node.parent)) {
    const name = node.parent.name.getText()
    return nonCopyJsxAttributes.has(name) || name.startsWith("data-") || name.startsWith("aria-")
  }
  return false
}

function sourceNodeText(node) {
  if (ts.isJsxText(node)) return node.getText().replace(/\s+/g, " ").trim()
  if (ts.isTemplateExpression(node)) {
    return [
      node.head.text,
      ...node.templateSpans.flatMap((span) => [" … ", span.literal.text]),
    ].join("")
  }
  return node.text
}

function sourceContentKey(node, sourceFile) {
  const parts = []
  let current = node
  let owner = null

  while (current?.parent && !ts.isSourceFile(current.parent)) {
    const parent = current.parent
    if (ts.isPropertyAssignment(parent) || ts.isShorthandPropertyAssignment(parent)) {
      parts.unshift(propertyName(parent.name, sourceFile))
    } else if (ts.isArrayLiteralExpression(parent)) {
      const index = parent.elements.indexOf(current)
      if (index >= 0) parts.unshift(String(index))
    } else if (ts.isVariableDeclaration(parent) && ts.isIdentifier(parent.name)) {
      owner = parent.name.text
      break
    } else if (ts.isFunctionDeclaration(parent) && parent.name) {
      owner = parent.name.text
      break
    } else if (ts.isJsxAttribute(parent)) {
      parts.unshift(parent.name.getText(sourceFile))
    } else if (ts.isJsxElement(parent)) {
      parts.unshift(parent.openingElement.tagName.getText(sourceFile))
      owner = nearestNamedOwner(parent)
      break
    } else if (ts.isJsxSelfClosingElement(parent)) {
      parts.unshift(parent.tagName.getText(sourceFile))
      owner = nearestNamedOwner(parent)
      break
    }
    current = parent
  }

  const key = [owner, ...parts].filter(Boolean).join(".")
  return key || nearestNamedOwner(node) || null
}

function propertyName(name, sourceFile) {
  if (ts.isIdentifier(name) || ts.isStringLiteral(name) || ts.isNumericLiteral(name)) return name.text
  return name.getText(sourceFile)
}

function nearestNamedOwner(node) {
  let current = node.parent
  while (current) {
    if (ts.isFunctionDeclaration(current) && current.name) return current.name.text
    if (ts.isVariableDeclaration(current) && ts.isIdentifier(current.name)) return current.name.text
    if (ts.isMethodDeclaration(current) && current.name) return current.name.getText()
    current = current.parent
  }
  return null
}

function jsonCandidates(file, source) {
  let parsed
  try {
    parsed = JSON.parse(source)
  } catch {
    return sourceCandidates(file, source)
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
      line: lineNumberAt(source, encodedIndex >= 0 ? encodedIndex + 1 : 0),
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
    /(?:^|\.)(?:\$id|\$schema|id|slug|href|url|sourceId|claimId|storageKey)$/.test(joined)
  )
}

function buildFinding({ file, source, candidate, match, rule, audience }) {
  const absoluteIndex = candidate.index + Math.max(0, match.index)
  const fileName = toPosix(relative(projectRoot, file))
  const isJson = extname(file) === ".json"
  return {
    priority: rule.priority,
    severity: rule.priority,
    rule: rule.id,
    kind: rule.kind,
    audience,
    file: fileName,
    line: candidate.line ?? lineNumberAt(source, absoluteIndex),
    route: routeForFile(fileName),
    context: findingContext(fileName, candidate, audience),
    key: candidate.path,
    contentKey: candidate.path,
    copyKey: isJson ? null : candidate.path,
    jsonPath: isJson ? candidate.path : null,
    matched: compact(match[0]),
    match: compact(match[0]),
    source: compact(candidate.text),
    reason: rule.reason,
    action: rule.action,
    suggestedAction: rule.action,
    strict: Boolean(rule.strict && audience === "public"),
  }
}

function structuralFindings(file, source, candidates) {
  const findings = []
  const fileName = toPosix(relative(projectRoot, file))

  for (const candidate of candidates) {
    const audience = classifyAudience(file, candidate)
    const abstractTerms = findAbstractTerms(candidate.text)
    if (abstractTerms.length >= 2) {
      findings.push(structuralFinding({
        id: "repeated-abstract-map-language",
        priority: "P2",
        kind: "structural-review",
        fileName,
        source,
        candidate,
        audience,
        matched: abstractTerms.join(", "),
        reason: "The same passage repeatedly relies on layer, lens, or map language instead of named records or decisions.",
        action: "Keep literal product terms where needed and replace the remaining abstractions with specific nouns.",
      }))
    }

    const repeatedOpening = repeatedSentenceOpening(candidate.text)
    if (repeatedOpening) {
      findings.push(structuralFinding({
        id: "repeated-sentence-opening",
        priority: "P2",
        kind: "structural-review",
        fileName,
        source,
        candidate,
        audience,
        matched: repeatedOpening,
        reason: "Two or more sentences in the passage begin with the same wording.",
        action: "Vary the sentence structure or combine sentences that make the same move.",
      }))
    }

    const threePartLists = findThreePartLists(candidate.text)
    if (threePartLists.length >= 2) {
      findings.push(structuralFinding({
        id: "repeated-three-part-list",
        priority: "P2",
        kind: "structural-review",
        fileName,
        source,
        candidate,
        audience,
        matched: threePartLists.slice(0, 2).join(" / "),
        reason: "The passage repeats a polished three-part list structure.",
        action: "Keep only distinctions needed for the result and vary the structure where both lists are necessary.",
      }))
    }
  }

  for (let index = 1; index < candidates.length; index += 1) {
    const previous = candidates[index - 1]
    const current = candidates[index]
    const previousOpening = sentenceOpening(previous.text)
    const currentOpening = sentenceOpening(current.text)
    const closeTogether = Math.abs((current.line ?? 0) - (previous.line ?? 0)) <= 12
    if (
      closeTogether &&
      previousOpening &&
      previousOpening === currentOpening &&
      comparableContext(previous.path, current.path)
    ) {
      const audience = classifyAudience(file, current)
      findings.push(structuralFinding({
        id: "repeated-adjacent-opening",
        priority: "P2",
        kind: "structural-review",
        fileName,
        source,
        candidate: current,
        audience,
        matched: currentOpening,
        reason: "Adjacent copy records repeat the same sentence opening.",
        action: "Lead each record with its distinguishing judgment rather than a shared template.",
      }))
    }

    const previousLists = findThreePartLists(previous.text)
    const currentLists = findThreePartLists(current.text)
    if (
      closeTogether &&
      previousLists.length >= 1 &&
      currentLists.length >= 1 &&
      comparableContext(previous.path, current.path)
    ) {
      const audience = classifyAudience(file, current)
      findings.push(structuralFinding({
        id: "repeated-adjacent-three-part-list",
        priority: "P2",
        kind: "structural-review",
        fileName,
        source,
        candidate: current,
        audience,
        matched: `${previousLists[0]} / ${currentLists[0]}`,
        reason: "Adjacent copy records repeat the same polished three-part list structure.",
        action: "Lead each record with its distinguishing judgment and keep only the list items needed for that result.",
      }))
    }

    const previousAbstractTerms = findAbstractTerms(previous.text)
    const currentAbstractTerms = findAbstractTerms(current.text)
    if (
      closeTogether &&
      previousAbstractTerms.length >= 1 &&
      currentAbstractTerms.length >= 1 &&
      comparableContext(previous.path, current.path)
    ) {
      const audience = classifyAudience(file, current)
      findings.push(structuralFinding({
        id: "repeated-adjacent-abstract-language",
        priority: "P2",
        kind: "structural-review",
        fileName,
        source,
        candidate: current,
        audience,
        matched: `${previousAbstractTerms.join(", ")} / ${currentAbstractTerms.join(", ")}`,
        reason: "Adjacent copy records repeat layer, lens, or map language instead of their specific records or decisions.",
        action: "Keep literal product terms where needed and lead each record with the concrete distinction it adds.",
      }))
    }
  }

  return findings
}

function structuralFinding({
  id,
  priority,
  kind,
  fileName,
  source,
  candidate,
  audience,
  matched,
  reason,
  action,
}) {
  const isJson = extname(fileName) === ".json"
  return {
    priority,
    severity: priority,
    rule: id,
    kind,
    audience,
    file: fileName,
    line: candidate.line ?? lineNumberAt(source, candidate.index),
    route: routeForFile(fileName),
    context: findingContext(fileName, candidate, audience),
    key: candidate.path,
    contentKey: candidate.path,
    copyKey: isJson ? null : candidate.path,
    jsonPath: isJson ? candidate.path : null,
    matched: compact(matched),
    match: compact(matched),
    source: compact(candidate.text),
    reason,
    action,
    suggestedAction: action,
    strict: false,
  }
}

function repeatedSentenceOpening(text) {
  const openings = text
    .split(/[.!?]+(?:\s+|$)/u)
    .map(sentenceOpening)
    .filter(Boolean)
  const counts = new Map()
  for (const opening of openings) counts.set(opening, (counts.get(opening) ?? 0) + 1)
  return [...counts.entries()].find(([, count]) => count >= 2)?.[0] ?? null
}

function sentenceOpening(text) {
  const words = compact(text)
    .replace(/^[“"'‘’([{\-–—\s]+/u, "")
    .match(/[\p{L}\p{N}’'-]+/gu)
  if (!words || words.length < 4) return null
  return words.slice(0, 3).join(" ").toLocaleLowerCase("en")
}

function findThreePartLists(text) {
  return [...text.matchAll(/\b[^,.;:!?\n]{2,55},\s+[^,.;:!?\n]{2,55},\s+(?:and|or)\s+[^,.;:!?\n]{2,55}(?=[.;:!?]|$)/giu)]
    .map((match) => compact(match[0]))
}

function findAbstractTerms(text) {
  return [...text.matchAll(/\b(?:layers?|lenses?|maps?|mapping|mapped)\b/giu)]
    .map((match) => match[0])
}

function comparableContext(left, right) {
  if (!left || !right) return true
  const normalize = (value) => value.replace(/\.\d+(?=\.|$)/g, ".#").replace(/\.[^.]+$/, "")
  return normalize(left) === normalize(right)
}

function classifyAudience(file, candidate) {
  const fileName = toPosix(relative(projectRoot, file))
  if (fileName.startsWith("app/api/")) return "operational"
  if (fileName.startsWith("lib/research/")) return "operational"
  if (/^lib\/modules\/(?:runtime-v1|[^/]+-v21)\.[cm]?[jt]sx?$/.test(fileName)) return "frozen"
  if (/^content\/instrument\/(?:security|technology|ai-governance)\.v2\.json$/.test(fileName)) {
    return "frozen"
  }
  if (/^(?:lib|i18n)\/.*(?:validation|validator|store|registry|versions?|request|routing|paths?)\.[cm]?[jt]sx?$/.test(fileName)) return "operational"
  if (/^content\/instrument\/(?:schema|foundation\.scoring\.v1)\.json$/.test(fileName)) return "operational"
  if (
    /^content\/locales\/.*(?:back-translations|item-analysis|item-intent|manifest)/.test(fileName) ||
    candidate.path?.includes("editorialMemo")
  ) return "editorial-source"
  return "public"
}

function findingContext(fileName, candidate, audience) {
  const route = routeForFile(fileName)
  const key = candidate.path || `line-${candidate.line ?? 1}`
  if (audience === "frozen") return `frozen-compatibility:${fileName}#${key}`
  if (route) return `route:${route}${candidate.path ? `#${candidate.path}` : ""}`
  return `content-key:${fileName}#${key}`
}

function routeForFile(fileName) {
  if (!fileName.startsWith("app/")) return null
  const segments = fileName.split("/").slice(1)
  const file = segments.at(-1) ?? ""
  if (!/^(?:page|route|layout|loading|error|not-found)\.[cm]?[jt]sx?$/.test(file)) return null
  const routeSegments = segments
    .slice(0, -1)
    .filter((segment) => !/^\(.+\)$/.test(segment) && !segment.startsWith("@"))
  return `/${routeSegments.join("/")}`.replace(/\/$/, "") || "/"
}

function hasNamedDataSource(text) {
  return /\b(?:according to|calibration (?:artifact|sample|dataset|study)|aggregate cohort|published (?:dataset|survey|study)|named (?:dataset|source)|among \d[\d,]* (?:respondents?|participants?))\b/iu.test(text)
}

function hasNearbyNamedDataSource(source, candidate) {
  if (!source || !candidate) return false
  const start = Math.max(0, candidate.index - 500)
  const end = Math.min(source.length, candidate.index + candidate.text.length + 100)
  const nearby = source.slice(start, end)
  return /\bcitation\s*:\s*.{1,400}\b(?:19|20)\d{2}\b/isu.test(nearby)
}

function hasHighConfidencePrevalencePhrase(text) {
  return (
    /\bmost answer patterns?\b|\b(?:most|many|few|the majority of) (?:respondents?|people|users?|profiles?|results?|answer patterns?|cases?|analysts?|readers?)\b|\btypical(?:ly)? (?:profiles?|results?|respondents?|answer patterns?)\b|\b(?:common|frequent|prevalent|normal) (?:profiles?|results?|responses?|outputs?|answer patterns?)\b|\b(?:profiles?|results?|responses?|outputs?|answer patterns?) (?:are|look|remain) (?:common|frequent|prevalent|normal)\b|\b(?:often|usually) remains? close\b|\b(?:mixed )?(?:scores?|results?)\b[^.!?\n]{0,80}\busually means\b|\bmore likely than (?:most|other) profiles\b|\b\d+(?:\.\d+)?% of (?:respondents?|people|users?|profiles?|results?)\b|(?:大多数|多数)(?:受访者|用户|回答者|回答|结果|画像|案例|情形)|(?:混合)?(?:结果|回答)(?:很常见|并不异常)/iu
  ).test(text)
}

function isNegatedPrevalenceClaim(text) {
  return /\b(?:does not mean|is not a claim that)\b/iu.test(text)
}

function isNecessaryPrivacyDisclosure(text, file) {
  const fileName = toPosix(relative(projectRoot, file))
  return (
    fileName === "app/privacy/page.tsx" &&
    /\b(?:excluded|does not include|not collected|not stored)\b/iu.test(text)
  )
}

function isActiveBetaProgramReference(match, file) {
  if (!match || !/^beta$/iu.test(match[0])) return false

  const fileName = toPosix(relative(projectRoot, file))
  return (
    fileName === "app/beta/page.tsx" ||
    fileName === "app/[locale]/beta/page.tsx" ||
    fileName.startsWith("components/beta/") ||
    /^content\/locales\/(?:en|zh-Hans)\/beta\.[cm]?[jt]s$/.test(fileName) ||
    fileName === "lib/beta-config.ts" ||
    fileName === "i18n/paths.ts" ||
    fileName === "messages/en.json" ||
    fileName === "messages/zh-Hans.json"
  )
}

function looksLikePublicCopy(text) {
  const normalized = compact(text)
  if (normalized.length < 3 || !/\p{L}/u.test(normalized)) return false
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
    const key = `${item.rule}:${item.file}:${item.line}:${item.context}:${item.matched}`
    if (seen.has(key)) return false
    seen.add(key)
    return true
  })
}

function compareFindings(left, right) {
  return (
    compareCodeUnitStrings(left.priority, right.priority) ||
    compareCodeUnitStrings(left.file, right.file) ||
    left.line - right.line ||
    compareCodeUnitStrings(left.rule, right.rule)
  )
}

function printTextReport(items, allItems = items, strictOnly = false) {
  const counts = Object.fromEntries(["P0", "P1", "P2"].map((priority) => [
    priority,
    allItems.filter((item) => item.priority === priority).length,
  ]))
  const strictCount = allItems.filter((item) => item.strict).length
  console.log(
    `Public-copy audit: ${allItems.length} signals ` +
    `(P0 ${counts.P0}, P1 ${counts.P1}, P2 ${counts.P2}; strict ${strictCount})`,
  )
  if (strictOnly) {
    console.log(
      strictCount === 0
        ? "Strict audit: no blocking public-copy findings.\n"
        : "Strict audit: blocking public-copy findings follow.\n",
    )
  } else {
    console.log("Advisory scan: review context before editing; not every pattern match is an error.\n")
  }

  for (const item of items) {
    console.log(`[${item.priority}] ${item.rule} — ${item.file}:${item.line} [${item.audience}]`)
    console.log(`  Context: ${item.context}`)
    if (item.jsonPath) console.log(`  JSON path: ${item.jsonPath}`)
    if (item.copyKey) console.log(`  Copy key: ${item.copyKey}`)
    console.log(`  Matched: ${truncate(item.matched, 140)}`)
    console.log(`  Copy: ${truncate(item.source, 220)}`)
    console.log(`  Reason: ${item.reason}`)
    console.log(`  Action: ${item.action}\n`)
  }
}

function truncate(value, max) {
  return value.length <= max ? value : `${value.slice(0, max - 1)}…`
}
