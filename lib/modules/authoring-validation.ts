import { createHash } from "node:crypto"
import {
  DEFAULT_DOMAIN_RELATION_POLICY,
  DOMAIN_BRIDGE_AUTHORING_STATUSES,
  DOMAIN_BRIDGE_EVIDENCE_STATUSES,
  DOMAIN_BRIDGE_REVIEW_STATUSES,
  DOMAIN_DIRECTION_POLES,
  DOMAIN_MODULE_MANIFEST_SCHEMA_VERSION,
  DOMAIN_RELATIONS,
  MODULE_CALIBRATION_STATUSES,
  MODULE_CARD_TYPES,
  MODULE_EVIDENCE_STATUSES,
  MODULE_LOCALE_STATUSES,
  MODULE_MANIFEST_ORIGINS,
  MODULE_QUESTION_TYPES,
  MODULE_RELEASE_DECISION_STATUSES,
  MODULE_RELEASE_STATES,
  MODULE_SLUG_PATTERN,
  STABLE_AUTHORING_ID_PATTERN,
  isFoundationDimensionKey,
  type DomainBridgeDefinition,
  type DomainModuleManifest,
} from "@/lib/modules/authoring-contract"
import { validateRepositoryRegularFilePath } from "@/lib/modules/path-safety"
import { getRecognizedModuleReleaseDecision } from "@/lib/modules/release-decisions"
import type { ModuleDefinition, ModuleQuestion } from "@/lib/modules/types"
import type { QuizMode } from "@/lib/types"

export type ModuleAuthoringValidationIssue = {
  code: string
  path: string
  message: string
}

export type ModuleAuthoringValidationResult =
  | { ok: true; issues: readonly [] }
  | { ok: false; issues: readonly ModuleAuthoringValidationIssue[] }

export type ModuleRegistrationVersions = {
  bankVersion: number
  scoringVersion: number
}

export type ModuleAuthoringValidationOptions = {
  referenceDate?: Date | string
}

const MANIFEST_KEYS = [
  "schemaVersion",
  "manifestOrigin",
  "releaseState",
  "releaseDecision",
  "evidenceStatus",
  "manifestFingerprint",
  "slug",
  "versions",
  "axes",
  "lanes",
  "questionTypes",
  "cardTypes",
  "calibration",
  "resultCopy",
  "localeStatus",
  "evidenceAuditHooks",
  "relationPolicy",
  "bridges",
] as const

const BRIDGE_KEYS = [
  "id",
  "moduleSlug",
  "moduleAxis",
  "foundationDimension",
  "relation",
  "rationale",
  "direction",
  "authoringStatus",
  "reviewStatus",
  "evidenceStatus",
  "publication",
  "versionContext",
  "sourceIds",
  "reviewIds",
] as const

const MODES = ["standard", "analyst"] as const satisfies readonly QuizMode[]
const PLACEHOLDER_PATTERN =
  /\b(?:draft|pending|placeholder|replace(?:d)?|scaffold|todo|tbd)\b/iu

function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === "object" && value !== null && !Array.isArray(value)
}

function isNonEmptyString(value: unknown): value is string {
  return typeof value === "string" && value.trim().length > 0
}

function isPositiveInteger(value: unknown): value is number {
  return typeof value === "number" && Number.isInteger(value) && value > 0
}

function isStringArray(value: unknown, minimum = 0): value is string[] {
  return (
    Array.isArray(value) &&
    value.length >= minimum &&
    value.every(isNonEmptyString)
  )
}

function isStableId(value: unknown): value is string {
  return isNonEmptyString(value) && STABLE_AUTHORING_ID_PATTERN.test(value)
}

function hasUniqueValues(values: readonly string[]) {
  return new Set(values).size === values.length
}

function sameValue(left: unknown, right: unknown) {
  return JSON.stringify(left) === JSON.stringify(right)
}

function addUnexpectedKeys(
  value: Record<string, unknown>,
  allowed: readonly string[],
  path: string,
  add: (code: string, path: string, message: string) => void,
) {
  for (const key of Object.keys(value)) {
    if (!allowed.includes(key)) {
      add(
        "field.unexpected",
        `${path}.${key}`,
        `${key} is not part of the authoring contract.`,
      )
    }
  }
}

function parseFutureDate(
  value: unknown,
  path: string,
  referenceDate: Date,
  add: (code: string, path: string, message: string) => void,
) {
  if (!isNonEmptyString(value)) {
    add("date.invalid", path, "A review-due date is required.")
    return
  }
  const timestamp = Date.parse(value)
  if (!Number.isFinite(timestamp)) {
    add("date.invalid", path, "Review-due date must be a valid ISO timestamp.")
  } else if (timestamp < referenceDate.getTime()) {
    add("date.overdue", path, "Review-due date has passed.")
  }
}

function stableJson(value: unknown): string {
  if (Array.isArray(value)) return `[${value.map(stableJson).join(",")}]`
  if (isRecord(value)) {
    return `{${Object.keys(value)
      .sort()
      .map((key) => `${JSON.stringify(key)}:${stableJson(value[key])}`)
      .join(",")}}`
  }
  return JSON.stringify(value)
}

export function computeManifestFingerprint(
  manifest: Pick<
    DomainModuleManifest<string, string, string>,
    | "schemaVersion"
    | "slug"
    | "manifestOrigin"
    | "releaseState"
    | "releaseDecision"
    | "versions"
    | "axes"
    | "lanes"
    | "questionTypes"
    | "cardTypes"
    | "calibration"
    | "resultCopy"
    | "localeStatus"
    | "evidenceStatus"
    | "evidenceAuditHooks"
    | "relationPolicy"
    | "bridges"
  >,
) {
  return createHash("sha256")
    .update(
      stableJson({
        schemaVersion: manifest.schemaVersion,
        slug: manifest.slug,
        manifestOrigin: manifest.manifestOrigin,
        releaseState: manifest.releaseState,
        releaseDecision: manifest.releaseDecision,
        versions: manifest.versions,
        axes: manifest.axes,
        lanes: manifest.lanes,
        questionTypes: manifest.questionTypes,
        cardTypes: manifest.cardTypes,
        calibration: manifest.calibration,
        resultCopy: manifest.resultCopy,
        localeStatus: manifest.localeStatus,
        evidenceStatus: manifest.evidenceStatus,
        evidenceAuditHooks: manifest.evidenceAuditHooks,
        relationPolicy: manifest.relationPolicy,
        bridges: manifest.bridges,
      }),
    )
    .digest("hex")
}

function validateReleaseDecision(
  value: Record<string, unknown>,
  referenceDate: Date,
  add: (code: string, path: string, message: string) => void,
) {
  const publicRelease =
    value.releaseState === "public-beta" || value.releaseState === "shipping"
  if (!publicRelease) return

  const decision = value.releaseDecision
  if (!isRecord(decision)) {
    add(
      "release-decision.required",
      "releaseDecision",
      "Public-beta and shipping manifests require a recognized exact-tuple decision.",
    )
    return
  }
  const decisionKeys = [
    "decisionId",
    "decisionPath",
    "approvedQuestionBankVersion",
    "approvedScoringVersion",
    "approvedResultCopyVersion",
    "approvedManifestVersion",
    "decisionStatus",
    "reviewDueAt",
  ] as const
  addUnexpectedKeys(decision, decisionKeys, "releaseDecision", add)
  if (!isStableId(decision.decisionId)) {
    add("release-decision.invalid", "releaseDecision.decisionId", "Decision ID is invalid.")
    return
  }
  const recognized = getRecognizedModuleReleaseDecision(decision.decisionId)
  if (!recognized) {
    add(
      "release-decision.unrecognized",
      "releaseDecision.decisionId",
      "Decision ID is not in the structured release-decision registry.",
    )
    return
  }
  const expectedStatus =
    value.releaseState === "public-beta"
      ? "approved-public-beta"
      : "approved-shipping"
  if (
    !MODULE_RELEASE_DECISION_STATUSES.includes(decision.decisionStatus as never) ||
    decision.decisionStatus !== expectedStatus
  ) {
    add(
      "release-decision.status",
      "releaseDecision.decisionStatus",
      `Release state ${String(value.releaseState)} requires ${expectedStatus}.`,
    )
  }
  const exactReference = {
    decisionId: recognized.decisionId,
    decisionPath: recognized.decisionPath,
    approvedQuestionBankVersion: recognized.approvedQuestionBankVersion,
    approvedScoringVersion: recognized.approvedScoringVersion,
    approvedResultCopyVersion: recognized.approvedResultCopyVersion,
    approvedManifestVersion: recognized.approvedManifestVersion,
    decisionStatus: recognized.decisionStatus,
    reviewDueAt: recognized.reviewDueAt,
  }
  if (recognized.slug !== value.slug || !sameValue(decision, exactReference)) {
    add(
      "release-decision.mismatch",
      "releaseDecision",
      "Release decision must match one recognized slug-bound record exactly.",
    )
  }
  if (isRecord(value.versions)) {
    const tuple = [
      ["approvedQuestionBankVersion", "questionBank"],
      ["approvedScoringVersion", "scoring"],
      ["approvedResultCopyVersion", "resultCopy"],
      ["approvedManifestVersion", "manifest"],
    ] as const
    for (const [decisionKey, versionKey] of tuple) {
      if (decision[decisionKey] !== value.versions[versionKey]) {
        add(
          "release-decision.tuple",
          `releaseDecision.${decisionKey}`,
          `Decision ${decisionKey} must match versions.${versionKey}.`,
        )
      }
    }
  }
  parseFutureDate(
    decision.reviewDueAt,
    "releaseDecision.reviewDueAt",
    referenceDate,
    add,
  )
}

function validateBridge(
  value: unknown,
  index: number,
  manifest: Record<string, unknown>,
  axisKeys: ReadonlySet<string>,
  evidenceHookIds: ReadonlySet<string>,
  reviewHookIds: ReadonlySet<string>,
  referenceDate: Date,
  add: (code: string, path: string, message: string) => void,
) {
  const path = `bridges[${index}]`
  if (!isRecord(value)) {
    add("bridge.invalid", path, "Bridge proposals must be objects.")
    return
  }
  addUnexpectedKeys(value, BRIDGE_KEYS, path, add)
  if (!isStableId(value.id)) add("bridge.id", `${path}.id`, "Bridge ID is invalid.")
  if (value.moduleSlug !== manifest.slug) {
    add("bridge.slug", `${path}.moduleSlug`, "Bridge slug must match the manifest.")
  }
  if (typeof value.moduleAxis !== "string" || !axisKeys.has(value.moduleAxis)) {
    add("bridge.axis", `${path}.moduleAxis`, "Bridge axis must resolve in the manifest.")
  }
  if (
    value.foundationDimension !== undefined &&
    !isFoundationDimensionKey(value.foundationDimension)
  ) {
    add("bridge.foundation-dimension", `${path}.foundationDimension`, "Foundation dimension is invalid.")
  }
  if (!DOMAIN_RELATIONS.includes(value.relation as never)) {
    add("bridge.relation", `${path}.relation`, "Bridge relation is outside the fixed vocabulary.")
  }
  if (!isNonEmptyString(value.rationale)) {
    add("bridge.rationale", `${path}.rationale`, "Bridge rationale is required.")
  }
  if (!DOMAIN_BRIDGE_AUTHORING_STATUSES.includes(value.authoringStatus as never)) {
    add("bridge.authoring-status", `${path}.authoringStatus`, "Authoring status is invalid.")
  }
  if (!DOMAIN_BRIDGE_REVIEW_STATUSES.includes(value.reviewStatus as never)) {
    add("bridge.review-status", `${path}.reviewStatus`, "Review status is invalid.")
  }
  if (!DOMAIN_BRIDGE_EVIDENCE_STATUSES.includes(value.evidenceStatus as never)) {
    add("bridge.evidence-status", `${path}.evidenceStatus`, "Evidence status is invalid.")
  }
  if (value.publication !== "internal") {
    add(
      "bridge.publication-forbidden",
      `${path}.publication`,
      "Public bridge publication is forbidden under the current contract.",
    )
  }

  if (!isRecord(value.direction)) {
    add("bridge.direction", `${path}.direction`, "Bridge direction is required.")
  } else {
    addUnexpectedKeys(value.direction, ["modulePole", "foundationPole", "semantics"], `${path}.direction`, add)
    if (!DOMAIN_DIRECTION_POLES.includes(value.direction.modulePole as never)) {
      add("bridge.direction", `${path}.direction.modulePole`, "Module pole is invalid.")
    }
    if (
      value.direction.foundationPole !== undefined &&
      !DOMAIN_DIRECTION_POLES.includes(value.direction.foundationPole as never)
    ) {
      add("bridge.direction", `${path}.direction.foundationPole`, "Foundation pole is invalid.")
    }
    if (!isNonEmptyString(value.direction.semantics)) {
      add("bridge.direction", `${path}.direction.semantics`, "Direction semantics are required.")
    }
    if (
      (value.foundationDimension === undefined) !==
      (value.direction.foundationPole === undefined)
    ) {
      add("bridge.direction", `${path}.direction.foundationPole`, "Foundation dimension and pole must be authored together.")
    }
  }
  if (value.relation !== "not-comparable" && value.foundationDimension === undefined) {
    add("bridge.foundation-dimension", `${path}.foundationDimension`, "Comparative relations require a Foundation dimension.")
  }

  for (const field of ["sourceIds", "reviewIds"] as const) {
    const ids = value[field]
    if (ids === undefined) continue
    if (!isStringArray(ids) || !ids.every(isStableId) || !hasUniqueValues(ids)) {
      add("bridge.reference-id", `${path}.${field}`, `${field} must contain unique stable IDs.`)
      continue
    }
    const available = field === "sourceIds" ? evidenceHookIds : reviewHookIds
    for (const id of ids) {
      if (!available.has(id)) {
        add("bridge.reference-unknown", `${path}.${field}`, `${id} does not resolve through manifest hooks.`)
      }
    }
  }
  if (
    value.reviewStatus === "expert-reviewed" &&
    (!Array.isArray(value.reviewIds) || value.reviewIds.length === 0)
  ) {
    add("bridge.review-required", `${path}.reviewIds`, "Expert-reviewed proposals require review IDs.")
  }
  if (
    value.evidenceStatus === "pilot-supported" &&
    (!Array.isArray(value.sourceIds) || value.sourceIds.length === 0)
  ) {
    add("bridge.evidence-required", `${path}.sourceIds`, "Pilot-supported proposals require source IDs.")
  }

  const context = value.versionContext
  if (!isRecord(context)) {
    add("bridge.version-context", `${path}.versionContext`, "Exact bridge version context is required.")
    return
  }
  addUnexpectedKeys(
    context,
    [
      "moduleManifestVersion",
      "moduleQuestionBankVersion",
      "moduleScoringVersion",
      "moduleResultCopyVersion",
      "foundation",
      "bridgeContentVersion",
      "reviewDueAt",
    ],
    `${path}.versionContext`,
    add,
  )
  const versions = isRecord(manifest.versions) ? manifest.versions : {}
  for (const [contextKey, versionKey] of [
    ["moduleManifestVersion", "manifest"],
    ["moduleQuestionBankVersion", "questionBank"],
    ["moduleScoringVersion", "scoring"],
    ["moduleResultCopyVersion", "resultCopy"],
  ] as const) {
    if (!isPositiveInteger(context[contextKey]) || context[contextKey] !== versions[versionKey]) {
      add("bridge.version-context", `${path}.versionContext.${contextKey}`, `Bridge context must match versions.${versionKey}.`)
    }
  }
  if (!isPositiveInteger(context.bridgeContentVersion)) {
    add("bridge.version-context", `${path}.versionContext.bridgeContentVersion`, "Bridge content version must be positive.")
  }
  parseFutureDate(context.reviewDueAt, `${path}.versionContext.reviewDueAt`, referenceDate, add)
  const foundation = context.foundation
  if (!isRecord(foundation)) {
    add("bridge.foundation-context", `${path}.versionContext.foundation`, "A Foundation semantic or scorer/calibration context is required.")
  } else {
    const hasSemantic = isStableId(foundation.semanticContractId)
    const hasScorer =
      isPositiveInteger(foundation.scoringVersion) &&
      isStableId(foundation.calibrationVersion)
    if (hasSemantic === hasScorer) {
      add("bridge.foundation-context", `${path}.versionContext.foundation`, "Name exactly one Foundation semantic contract or scorer/calibration tuple.")
    }
  }
}

export function validateDomainModuleManifest(
  value: unknown,
  options: ModuleAuthoringValidationOptions = {},
): ModuleAuthoringValidationResult {
  const issues: ModuleAuthoringValidationIssue[] = []
  const add = (code: string, path: string, message: string) =>
    issues.push({ code, path, message })
  const referenceDate = new Date(options.referenceDate ?? Date.now())

  if (!isRecord(value)) {
    return {
      ok: false,
      issues: [{ code: "manifest.invalid", path: "manifest", message: "Module manifest must be an object." }],
    }
  }
  addUnexpectedKeys(value, MANIFEST_KEYS, "manifest", add)
  if (value.schemaVersion !== DOMAIN_MODULE_MANIFEST_SCHEMA_VERSION) {
    add("manifest.schema-version", "schemaVersion", `Manifest schemaVersion must be ${DOMAIN_MODULE_MANIFEST_SCHEMA_VERSION}.`)
  }
  if (!MODULE_MANIFEST_ORIGINS.includes(value.manifestOrigin as never)) {
    add("manifest.origin", "manifestOrigin", "Manifest origin is invalid.")
  }
  if (!MODULE_RELEASE_STATES.includes(value.releaseState as never)) {
    add("manifest.release-state", "releaseState", "Manifest release state is invalid.")
  }
  if (!MODULE_EVIDENCE_STATUSES.includes(value.evidenceStatus as never)) {
    add("manifest.evidence-status", "evidenceStatus", "Manifest evidence status is invalid.")
  }
  if (!isNonEmptyString(value.manifestFingerprint) || !/^[a-f0-9]{64}$/u.test(value.manifestFingerprint)) {
    add("manifest.fingerprint", "manifestFingerprint", "Manifest fingerprint must be a SHA-256 hex digest.")
  }
  const slug = typeof value.slug === "string" && MODULE_SLUG_PATTERN.test(value.slug) ? value.slug : null
  if (!slug) add("manifest.slug", "slug", "Module slug must use lowercase hyphenated words.")

  if (!isRecord(value.versions)) {
    add("manifest.versions", "versions", "Manifest versions are required.")
  } else {
    addUnexpectedKeys(value.versions, ["manifest", "questionBank", "scoring", "resultCopy"], "versions", add)
    for (const key of ["manifest", "questionBank", "scoring", "resultCopy"] as const) {
      if (!isPositiveInteger(value.versions[key])) add("manifest.versions", `versions.${key}`, `${key} must be positive.`)
    }
  }
  validateReleaseDecision(value, referenceDate, add)
  const publicRelease =
    value.releaseState === "public-beta" || value.releaseState === "shipping"

  const axisKeys = new Set<string>()
  if (!Array.isArray(value.axes) || value.axes.length === 0) {
    add("manifest.axes", "axes", "At least one axis is required.")
  } else {
    value.axes.forEach((axis, index) => {
      const path = `axes[${index}]`
      if (!isRecord(axis)) return add("manifest.axis", path, "Axis must be an object.")
      addUnexpectedKeys(axis, ["key", "label", "lowLabel", "highLabel"], path, add)
      if (!isStableId(axis.key)) add("manifest.axis", `${path}.key`, "Axis key is invalid.")
      else if (axisKeys.has(axis.key)) add("manifest.axis-duplicate", `${path}.key`, "Axis keys must be unique.")
      else axisKeys.add(axis.key)
      for (const field of ["label", "lowLabel", "highLabel"] as const) {
        if (!isNonEmptyString(axis[field])) add("manifest.axis", `${path}.${field}`, `${field} is required.`)
      }
    })
  }

  const laneKeys = new Set<string>()
  if (!Array.isArray(value.lanes) || value.lanes.length === 0) {
    add("manifest.lanes", "lanes", "At least one lane is required.")
  } else {
    value.lanes.forEach((lane, index) => {
      const path = `lanes[${index}]`
      if (!isRecord(lane)) return add("manifest.lane", path, "Lane must be an object.")
      addUnexpectedKeys(lane, ["key", "label", "description", "scoreKey", "lowLabel", "highLabel"], path, add)
      if (!isStableId(lane.key)) add("manifest.lane", `${path}.key`, "Lane key is invalid.")
      else if (laneKeys.has(lane.key)) add("manifest.lane-duplicate", `${path}.key`, "Lane keys must be unique.")
      else laneKeys.add(lane.key)
      if (typeof lane.scoreKey !== "string" || !axisKeys.has(lane.scoreKey)) add("manifest.lane-axis", `${path}.scoreKey`, "Lane scoreKey must resolve to an axis.")
      for (const field of ["label", "description", "lowLabel", "highLabel"] as const) {
        if (!isNonEmptyString(lane[field])) add("manifest.lane", `${path}.${field}`, `${field} is required.`)
      }
    })
  }
  if (!isStringArray(value.questionTypes, 1) || !value.questionTypes.every((item) => MODULE_QUESTION_TYPES.includes(item as never)) || !hasUniqueValues(value.questionTypes)) {
    add("manifest.question-types", "questionTypes", "Question types must use the unique fixed vocabulary.")
  }
  if (!isStringArray(value.cardTypes, 1) || !value.cardTypes.every((item) => MODULE_CARD_TYPES.includes(item as never)) || !hasUniqueValues(value.cardTypes)) {
    add("manifest.card-types", "cardTypes", "Card types must use the unique fixed vocabulary.")
  }

  if (!isRecord(value.calibration)) {
    add("manifest.calibration", "calibration", "Calibration metadata is required.")
  } else {
    addUnexpectedKeys(value.calibration, ["status", "id", "questionBankVersion", "scoringVersion", "modes", "method", "artifactPath"], "calibration", add)
    if (!MODULE_CALIBRATION_STATUSES.includes(value.calibration.status as never)) add("manifest.calibration", "calibration.status", "Calibration status is invalid.")
    if (!isStableId(value.calibration.id)) add("manifest.calibration", "calibration.id", "Calibration ID must be stable.")
    if (!isStringArray(value.calibration.modes, 1) || !value.calibration.modes.every((mode) => MODES.includes(mode as never)) || !hasUniqueValues(value.calibration.modes)) add("manifest.calibration", "calibration.modes", "Calibration modes are invalid.")
    if (!isNonEmptyString(value.calibration.method)) add("manifest.calibration", "calibration.method", "Calibration method is required.")
    if (isRecord(value.versions)) {
      if (value.calibration.questionBankVersion !== value.versions.questionBank) add("manifest.calibration-version", "calibration.questionBankVersion", "Calibration bank version must match.")
      if (value.calibration.scoringVersion !== value.versions.scoring) add("manifest.calibration-version", "calibration.scoringVersion", "Calibration scoring version must match.")
    }
  }

  if (!isRecord(value.resultCopy)) {
    add("manifest.result-copy", "resultCopy", "Result copy is required.")
  } else {
    const resultCopy = value.resultCopy
    addUnexpectedKeys(resultCopy, ["defaultHeadline", "title", "shortTitle", "subtitle", "shorthand", "timeEstimate", "description", "measures", "doesNotClaim"], "resultCopy", add)
    for (const field of ["defaultHeadline", "title", "shortTitle", "subtitle", "shorthand", "description"] as const) {
      if (!isNonEmptyString(resultCopy[field])) add("manifest.result-copy", `resultCopy.${field}`, `${field} is required.`)
    }
    if (!isRecord(resultCopy.timeEstimate) || MODES.some((mode) => !isNonEmptyString((resultCopy.timeEstimate as Record<string, unknown>)[mode]))) add("manifest.result-copy", "resultCopy.timeEstimate", "Both mode estimates are required.")
    for (const field of ["measures", "doesNotClaim"] as const) {
      if (!isStringArray(resultCopy[field], 1)) add("manifest.result-copy", `resultCopy.${field}`, `${field} must be non-empty.`)
    }
    if ((value.releaseState === "public-beta" || value.releaseState === "shipping") && PLACEHOLDER_PATTERN.test(stableJson(resultCopy))) {
      add("manifest.result-copy-placeholder", "resultCopy", "Public result copy cannot contain scaffold placeholders.")
    }
  }

  if (!isRecord(value.localeStatus)) {
    add("manifest.locale-status", "localeStatus", "Locale status is required.")
  } else {
    const localeStatus = value.localeStatus
    addUnexpectedKeys(localeStatus, ["sourceLocale", "locales"], "localeStatus", add)
    if (!isNonEmptyString(localeStatus.sourceLocale) || !Array.isArray(localeStatus.locales)) {
      add("manifest.locale-status", "localeStatus", "Source locale and locale records are required.")
    } else {
      const ids: string[] = []
      localeStatus.locales.forEach((locale, index) => {
        const path = `localeStatus.locales[${index}]`
        if (!isRecord(locale)) return add("manifest.locale-status", path, "Locale record must be an object.")
        addUnexpectedKeys(locale, ["locale", "status", "contentVersion", "reviewIds"], path, add)
        if (!isNonEmptyString(locale.locale)) add("manifest.locale-status", `${path}.locale`, "Locale is required.")
        else ids.push(locale.locale)
        if (!MODULE_LOCALE_STATUSES.includes(locale.status as never)) add("manifest.locale-status", `${path}.status`, "Locale status is invalid.")
        if (locale.contentVersion !== undefined && !isPositiveInteger(locale.contentVersion)) add("manifest.locale-status", `${path}.contentVersion`, "Locale version must be positive.")
      })
      if (!hasUniqueValues(ids)) add("manifest.locale-status", "localeStatus.locales", "Locale IDs must be unique.")
      const source = localeStatus.locales.find((locale) => isRecord(locale) && locale.locale === localeStatus.sourceLocale)
      if (
        publicRelease &&
        (!isRecord(source) || source.status !== "authored-complete")
      ) {
        add("manifest.locale-source-incomplete", "localeStatus.sourceLocale", "Source-language copy must be authored-complete.")
      }
    }
  }

  if (publicRelease && value.calibration && isRecord(value.calibration) && value.calibration.status === "not-calibrated") {
    add("manifest.calibration-required", "calibration.status", "Public releases cannot be not-calibrated.")
  }
  if (!isRecord(value.evidenceAuditHooks)) {
    add("manifest.hooks", "evidenceAuditHooks", "Evidence, review, and audit hooks are required.")
  } else {
    addUnexpectedKeys(value.evidenceAuditHooks, ["evidence", "reviews", "audits"], "evidenceAuditHooks", add)
    for (const field of ["evidence", "reviews"] as const) {
      const hooks = value.evidenceAuditHooks[field]
      if (!Array.isArray(hooks) || (publicRelease && hooks.length === 0)) {
        add("manifest.hooks", `evidenceAuditHooks.${field}`, `Public releases require ${field} hooks.`)
        continue
      }
      const ids: string[] = []
      hooks.forEach((hook, index) => {
        const path = `evidenceAuditHooks.${field}[${index}]`
        if (!isRecord(hook)) return add("manifest.hooks", path, "Hook must be an object.")
        addUnexpectedKeys(hook, ["id", "path"], path, add)
        if (!isStableId(hook.id) || !isNonEmptyString(hook.path)) add("manifest.hooks", path, "Hook requires a stable ID and path.")
        else ids.push(hook.id)
      })
      if (!hasUniqueValues(ids)) add("manifest.hooks", `evidenceAuditHooks.${field}`, "Hook IDs must be unique.")
    }
    const audits = value.evidenceAuditHooks.audits
    if (!Array.isArray(audits) || (publicRelease && audits.length === 0)) {
      add("manifest.hooks", "evidenceAuditHooks.audits", "Public releases require audit hooks.")
    } else {
      const ids: string[] = []
      audits.forEach((hook, index) => {
        const path = `evidenceAuditHooks.audits[${index}]`
        if (!isRecord(hook)) return add("manifest.hooks", path, "Audit hook must be an object.")
        addUnexpectedKeys(hook, ["id", "packageScript", "path"], path, add)
        if (!isStableId(hook.id) || !isStableId(hook.packageScript) || !isNonEmptyString(hook.path)) add("manifest.hooks", path, "Audit hook requires an ID, package script, and implementation path.")
        else ids.push(hook.id)
      })
      if (!hasUniqueValues(ids)) add("manifest.hooks", "evidenceAuditHooks.audits", "Audit IDs must be unique.")
    }
  }
  if (!sameValue(value.relationPolicy, DEFAULT_DOMAIN_RELATION_POLICY)) {
    add("manifest.relation-policy", "relationPolicy", "Relation policy must forbid public bridges and cross-scale scores under the current contract.")
  }
  if (!Array.isArray(value.bridges)) {
    add("manifest.bridges", "bridges", "Bridge proposals must be an explicit list.")
  } else {
    const evidenceHookIds = new Set<string>(
      isRecord(value.evidenceAuditHooks) && Array.isArray(value.evidenceAuditHooks.evidence)
        ? value.evidenceAuditHooks.evidence.flatMap((hook) => isRecord(hook) && typeof hook.id === "string" ? [hook.id] : [])
        : [],
    )
    const reviewHookIds = new Set<string>(
      isRecord(value.evidenceAuditHooks) && Array.isArray(value.evidenceAuditHooks.reviews)
        ? value.evidenceAuditHooks.reviews.flatMap((hook) => isRecord(hook) && typeof hook.id === "string" ? [hook.id] : [])
        : [],
    )
    const ids: string[] = []
    value.bridges.forEach((bridge, index) => {
      validateBridge(bridge, index, value, axisKeys, evidenceHookIds, reviewHookIds, referenceDate, add)
      if (isRecord(bridge) && typeof bridge.id === "string") ids.push(bridge.id)
    })
    if (!hasUniqueValues(ids)) add("bridge.id-duplicate", "bridges", "Bridge IDs must be unique.")
  }

  if (
    /^[a-f0-9]{64}$/u.test(String(value.manifestFingerprint)) &&
    Array.isArray(value.axes) &&
    Array.isArray(value.lanes) &&
    Array.isArray(value.questionTypes) &&
    Array.isArray(value.cardTypes) &&
    isRecord(value.calibration) &&
    isRecord(value.resultCopy) &&
    isRecord(value.localeStatus) &&
    typeof value.slug === "string" &&
    typeof value.manifestOrigin === "string" &&
    typeof value.evidenceStatus === "string"
  ) {
    const computed = computeManifestFingerprint(value as unknown as DomainModuleManifest)
    if (computed !== value.manifestFingerprint) {
      add("manifest.fingerprint-mismatch", "manifestFingerprint", "Manifest fingerprint does not match authored claims.")
    }
  }

  return issues.length === 0 ? { ok: true, issues: [] } : { ok: false, issues }
}

/** Filesystem-aware validation for every approval, evidence, review, audit, and calibration hook. */
export function validateDomainModuleManifestPaths(
  manifest: DomainModuleManifest<string, string, string>,
  repositoryRoot: string,
): ModuleAuthoringValidationResult {
  const issues: ModuleAuthoringValidationIssue[] = []
  const paths = [
    ...(manifest.releaseDecision
      ? [{ code: "release-decision.path", id: manifest.releaseDecision.decisionId, path: manifest.releaseDecision.decisionPath }]
      : []),
    ...(manifest.calibration.artifactPath
      ? [{ code: "calibration.path", id: manifest.calibration.id, path: manifest.calibration.artifactPath }]
      : []),
    ...manifest.evidenceAuditHooks.evidence.map((hook) => ({ code: "hook.path", ...hook })),
    ...manifest.evidenceAuditHooks.reviews.map((hook) => ({ code: "hook.path", ...hook })),
    ...manifest.evidenceAuditHooks.audits.map((hook) => ({ code: "hook.path", id: hook.id, path: hook.path })),
  ]
  for (const entry of paths) {
    const validation = validateRepositoryRegularFilePath(repositoryRoot, entry.path)
    if (!validation.ok) {
      issues.push({
        code: entry.code,
        path: entry.path,
        message: `${entry.id} is unsafe: ${validation.reason}.`,
      })
    }
  }
  return issues.length === 0 ? { ok: true, issues: [] } : { ok: false, issues }
}

export type ModuleAuthoringRecord = {
  manifest: DomainModuleManifest<string, string, string>
  definition: ModuleDefinition
}

function uniqueQuestions(definition: ModuleDefinition): ModuleQuestion[] {
  const byId = new Map<string, ModuleQuestion>()
  for (const mode of MODES) {
    for (const question of definition.questionsByMode[mode]) byId.set(question.id, question)
  }
  return [...byId.values()]
}

export function validateModuleAuthoringRecord(
  record: ModuleAuthoringRecord,
  registered: ModuleRegistrationVersions,
  options: ModuleAuthoringValidationOptions = {},
): ModuleAuthoringValidationResult {
  const { definition, manifest } = record
  const base = validateDomainModuleManifest(manifest, options)
  const issues: ModuleAuthoringValidationIssue[] = base.ok ? [] : [...base.issues]
  const add = (code: string, path: string, message: string) => issues.push({ code, path, message })
  if (manifest.releaseState !== "public-beta" && manifest.releaseState !== "shipping") {
    add("registration.non-public", "releaseState", "Only public-beta or shipping manifests may enter the runtime registry.")
  }
  if (definition.slug !== manifest.slug) add("registration.slug", "slug", "Definition slug must match its manifest.")
  if (manifest.versions.questionBank !== registered.bankVersion) add("registration.version", "versions.questionBank", "Manifest bank version must match the registry.")
  if (manifest.versions.scoring !== registered.scoringVersion) add("registration.version", "versions.scoring", "Manifest scoring version must match the registry.")
  if (!sameValue(definition.axes, manifest.axes)) add("registration.axes", "axes", "Definition axes must equal its legacy-adapter manifest.")
  if (!sameValue(definition.lanes, manifest.lanes)) add("registration.lanes", "lanes", "Definition lanes must equal its legacy-adapter manifest.")
  for (const [key, value] of Object.entries(manifest.resultCopy)) {
    if (!sameValue(definition[key as keyof ModuleDefinition], value)) add("registration.result-copy", `resultCopy.${key}`, `Definition ${key} must equal its manifest copy.`)
  }
  const axisKeys = new Set(manifest.axes.map((axis) => axis.key))
  const laneKeys = new Set(manifest.lanes.map((lane) => lane.key))
  const usedQuestionTypes = new Set<string>()
  const usedCardTypes = new Set<string>()
  for (const question of uniqueQuestions(definition)) {
    const path = `questions.${question.id}`
    if (!question.kind || !manifest.questionTypes.includes(question.kind)) add("registration.question-type", `${path}.kind`, "Question kind must be declared.")
    else usedQuestionTypes.add(question.kind)
    if (!manifest.cardTypes.includes(question.cardType)) add("registration.card-type", `${path}.cardType`, "Card type must be declared.")
    else usedCardTypes.add(question.cardType)
    if (!laneKeys.has(question.lane)) add("registration.lane", `${path}.lane`, "Question lane must resolve.")
    for (const axis of question.discriminatingAxes) if (!axisKeys.has(axis)) add("registration.axis", `${path}.discriminatingAxes`, `Unknown axis ${axis}.`)
    for (const option of question.options) for (const axis of Object.keys(option.signals)) if (!axisKeys.has(axis)) add("registration.axis", `${path}.options.${option.id}.signals`, `Unknown axis ${axis}.`)
  }
  for (const questionType of manifest.questionTypes) if (!usedQuestionTypes.has(questionType)) add("registration.question-type-unused", "questionTypes", `Declared question type ${questionType} is unused.`)
  for (const cardType of manifest.cardTypes) if (!usedCardTypes.has(cardType)) add("registration.card-type-unused", "cardTypes", `Declared card type ${cardType} is unused.`)
  return issues.length === 0 ? { ok: true, issues: [] } : { ok: false, issues }
}

export function formatModuleAuthoringIssues(
  slug: string,
  issues: readonly ModuleAuthoringValidationIssue[],
) {
  return issues.map((issue) => `${slug}: ${issue.path} [${issue.code}] ${issue.message}`)
}

export type AnyDomainModuleManifest = DomainModuleManifest<string, string, string>
export type AnyDomainBridgeDefinition = DomainBridgeDefinition<string, string>
