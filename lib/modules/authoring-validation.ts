import {
  DEFAULT_DOMAIN_RELATION_POLICY,
  DOMAIN_BRIDGE_PUBLICATION_STATES,
  DOMAIN_DIRECTION_POLES,
  DOMAIN_MODULE_MANIFEST_SCHEMA_VERSION,
  DOMAIN_RELATIONS,
  DOMAIN_RELATION_STATUSES,
  MODULE_CALIBRATION_STATUSES,
  MODULE_CARD_TYPES,
  MODULE_LOCALE_STATUSES,
  MODULE_QUESTION_TYPES,
  MODULE_RELEASE_STATES,
  MODULE_SLUG_PATTERN,
  STABLE_AUTHORING_ID_PATTERN,
  isFoundationDimensionKey,
  type DomainModuleManifest,
} from "@/lib/modules/authoring-contract"
import type {
  ModuleDefinition,
  ModuleQuestion,
} from "@/lib/modules/types"
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

const MANIFEST_KEYS = [
  "schemaVersion",
  "releaseState",
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
  "status",
  "contentVersion",
  "sourceIds",
  "reviewIds",
  "publication",
] as const

const DIRECTION_KEYS = [
  "modulePole",
  "foundationPole",
  "semantics",
] as const

const MODES = ["standard", "analyst"] as const satisfies readonly QuizMode[]

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

function hasUniqueValues(values: readonly string[]) {
  return new Set(values).size === values.length
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

function isStableId(value: unknown): value is string {
  return isNonEmptyString(value) && STABLE_AUTHORING_ID_PATTERN.test(value)
}

function isSafeRepoPath(value: unknown): value is string {
  return (
    isNonEmptyString(value) &&
    !value.startsWith("/") &&
    !value.split("/").includes("..") &&
    !value.startsWith("tmp/")
  )
}

function sameValue(left: unknown, right: unknown) {
  return JSON.stringify(left) === JSON.stringify(right)
}

function validateBridge(
  value: unknown,
  index: number,
  slug: string | null,
  axisKeys: ReadonlySet<string>,
  evidenceHookIds: ReadonlySet<string>,
  reviewHookIds: ReadonlySet<string>,
  add: (code: string, path: string, message: string) => void,
) {
  const path = `bridges[${index}]`
  if (!isRecord(value)) {
    add("bridge.invalid", path, "Bridge definitions must be objects.")
    return
  }
  addUnexpectedKeys(value, BRIDGE_KEYS, path, add)

  if (!isStableId(value.id)) {
    add("bridge.id", `${path}.id`, "Bridge ID must be a stable lowercase authoring ID.")
  }
  if (typeof value.moduleSlug !== "string" || value.moduleSlug !== slug) {
    add("bridge.slug", `${path}.moduleSlug`, "Bridge moduleSlug must match the manifest slug.")
  }
  if (typeof value.moduleAxis !== "string" || !axisKeys.has(value.moduleAxis)) {
    add("bridge.axis", `${path}.moduleAxis`, "Bridge moduleAxis must resolve to a manifest axis.")
  }
  if (
    value.foundationDimension !== undefined &&
    !isFoundationDimensionKey(value.foundationDimension)
  ) {
    add(
      "bridge.foundation-dimension",
      `${path}.foundationDimension`,
      "Foundation dimension must use a stable Foundation key.",
    )
  }
  if (!DOMAIN_RELATIONS.includes(value.relation as never)) {
    add("bridge.relation", `${path}.relation`, "Bridge relation is outside the fixed vocabulary.")
  }
  if (!isNonEmptyString(value.rationale)) {
    add("bridge.rationale", `${path}.rationale`, "Bridge rationale is required.")
  }
  if (!DOMAIN_RELATION_STATUSES.includes(value.status as never)) {
    add("bridge.status", `${path}.status`, "Bridge status is outside the fixed vocabulary.")
  }
  if (!DOMAIN_BRIDGE_PUBLICATION_STATES.includes(value.publication as never)) {
    add("bridge.publication", `${path}.publication`, "Bridge publication state is invalid.")
  }
  if (!isPositiveInteger(value.contentVersion)) {
    add("bridge.content-version", `${path}.contentVersion`, "Bridge contentVersion must be a positive integer.")
  }

  if (!isRecord(value.direction)) {
    add("bridge.direction", `${path}.direction`, "Bridge direction semantics are required.")
  } else {
    addUnexpectedKeys(value.direction, DIRECTION_KEYS, `${path}.direction`, add)
    if (!DOMAIN_DIRECTION_POLES.includes(value.direction.modulePole as never)) {
      add(
        "bridge.direction",
        `${path}.direction.modulePole`,
        "Module direction must name the low or high semantic pole.",
      )
    }
    if (
      value.direction.foundationPole !== undefined &&
      !DOMAIN_DIRECTION_POLES.includes(value.direction.foundationPole as never)
    ) {
      add(
        "bridge.direction",
        `${path}.direction.foundationPole`,
        "Foundation direction must name the low or high semantic pole.",
      )
    }
    if (!isNonEmptyString(value.direction.semantics)) {
      add(
        "bridge.direction",
        `${path}.direction.semantics`,
        "Bridge direction requires plain-language semantics.",
      )
    }
    if (
      value.foundationDimension !== undefined &&
      value.direction.foundationPole === undefined
    ) {
      add(
        "bridge.direction",
        `${path}.direction.foundationPole`,
        "A Foundation-linked bridge must name the relevant Foundation pole.",
      )
    }
    if (
      value.foundationDimension === undefined &&
      value.direction.foundationPole !== undefined
    ) {
      add(
        "bridge.direction",
        `${path}.direction.foundationPole`,
        "A bridge without a Foundation dimension cannot name a Foundation pole.",
      )
    }
  }

  if (
    value.relation !== "not-comparable" &&
    value.foundationDimension === undefined
  ) {
    add(
      "bridge.foundation-dimension",
      `${path}.foundationDimension`,
      "A comparative relation requires an explicit Foundation dimension.",
    )
  }

  for (const field of ["sourceIds", "reviewIds"] as const) {
    const ids = value[field]
    if (ids === undefined) continue
    if (
      !isStringArray(ids) ||
      !ids.every((id) => isStableId(id)) ||
      !hasUniqueValues(ids)
    ) {
      add(
        "bridge.reference-id",
        `${path}.${field}`,
        `${field} must contain unique stable IDs.`,
      )
    } else {
      const availableIds = field === "sourceIds" ? evidenceHookIds : reviewHookIds
      for (const id of ids) {
        if (!availableIds.has(id)) {
          add(
            "bridge.reference-unknown",
            `${path}.${field}`,
            `${id} does not resolve through the manifest's ${field === "sourceIds" ? "evidence" : "review"} hooks.`,
          )
        }
      }
    }
  }

  if (value.status === "authored" && value.publication === "public") {
    add(
      "bridge.review-required",
      `${path}.publication`,
      "Authored-only bridges cannot be public.",
    )
  }
  if (
    (value.status === "expert-reviewed" ||
      value.status === "pilot-supported") &&
    (!Array.isArray(value.reviewIds) || value.reviewIds.length === 0)
  ) {
    add(
      "bridge.review-required",
      `${path}.reviewIds`,
      "Reviewed bridge statuses require stable review IDs.",
    )
  }
  if (
    value.status === "pilot-supported" &&
    (!Array.isArray(value.sourceIds) || value.sourceIds.length === 0)
  ) {
    add(
      "bridge.evidence-required",
      `${path}.sourceIds`,
      "Pilot-supported bridges require stable evidence source IDs.",
    )
  }
  if (
    value.publication === "public" &&
    (!(value.status === "expert-reviewed" || value.status === "pilot-supported") ||
      !Array.isArray(value.reviewIds) ||
      value.reviewIds.length === 0 ||
      !Array.isArray(value.sourceIds) ||
      value.sourceIds.length === 0)
  ) {
    add(
      "bridge.publication-blocked",
      path,
      "A public bridge requires reviewed status plus review and source IDs.",
    )
  }
}

export function validateDomainModuleManifest(
  value: unknown,
): ModuleAuthoringValidationResult {
  const issues: ModuleAuthoringValidationIssue[] = []
  const add = (code: string, path: string, message: string) =>
    issues.push({ code, path, message })

  if (!isRecord(value)) {
    return {
      ok: false,
      issues: [
        {
          code: "manifest.invalid",
          path: "manifest",
          message: "Module manifest must be an object.",
        },
      ],
    }
  }
  addUnexpectedKeys(value, MANIFEST_KEYS, "manifest", add)

  if (value.schemaVersion !== DOMAIN_MODULE_MANIFEST_SCHEMA_VERSION) {
    add(
      "manifest.schema-version",
      "schemaVersion",
      `Manifest schemaVersion must be ${DOMAIN_MODULE_MANIFEST_SCHEMA_VERSION}.`,
    )
  }
  if (!MODULE_RELEASE_STATES.includes(value.releaseState as never)) {
    add("manifest.release-state", "releaseState", "Manifest releaseState is invalid.")
  }
  const slug =
    typeof value.slug === "string" && MODULE_SLUG_PATTERN.test(value.slug)
      ? value.slug
      : null
  if (!slug) {
    add("manifest.slug", "slug", "Module slug must use lowercase hyphenated words.")
  }

  if (!isRecord(value.versions)) {
    add("manifest.versions", "versions", "Manifest versions are required.")
  } else {
    addUnexpectedKeys(
      value.versions,
      ["manifest", "questionBank", "scoring", "resultCopy"],
      "versions",
      add,
    )
    for (const key of ["manifest", "questionBank", "scoring", "resultCopy"] as const) {
      if (!isPositiveInteger(value.versions[key])) {
        add("manifest.versions", `versions.${key}`, `${key} must be a positive integer.`)
      }
    }
  }

  const axisKeys = new Set<string>()
  if (!Array.isArray(value.axes) || value.axes.length === 0) {
    add("manifest.axes", "axes", "At least one module axis is required.")
  } else {
    value.axes.forEach((axis, index) => {
      const path = `axes[${index}]`
      if (!isRecord(axis)) {
        add("manifest.axis", path, "Axis must be an object.")
        return
      }
      addUnexpectedKeys(axis, ["key", "label", "lowLabel", "highLabel"], path, add)
      if (!isStableId(axis.key)) {
        add("manifest.axis", `${path}.key`, "Axis key must be a stable authoring ID.")
      } else {
        if (axisKeys.has(axis.key)) {
          add("manifest.axis-duplicate", `${path}.key`, "Axis keys must be unique.")
        }
        axisKeys.add(axis.key)
      }
      for (const field of ["label", "lowLabel", "highLabel"] as const) {
        if (!isNonEmptyString(axis[field])) {
          add("manifest.axis", `${path}.${field}`, `Axis ${field} is required.`)
        }
      }
    })
  }

  const laneKeys = new Set<string>()
  if (!Array.isArray(value.lanes) || value.lanes.length === 0) {
    add("manifest.lanes", "lanes", "At least one module lane is required.")
  } else {
    value.lanes.forEach((lane, index) => {
      const path = `lanes[${index}]`
      if (!isRecord(lane)) {
        add("manifest.lane", path, "Lane must be an object.")
        return
      }
      addUnexpectedKeys(
        lane,
        ["key", "label", "description", "scoreKey", "lowLabel", "highLabel"],
        path,
        add,
      )
      if (!isStableId(lane.key)) {
        add("manifest.lane", `${path}.key`, "Lane key must be a stable authoring ID.")
      } else {
        if (laneKeys.has(lane.key)) {
          add("manifest.lane-duplicate", `${path}.key`, "Lane keys must be unique.")
        }
        laneKeys.add(lane.key)
      }
      if (typeof lane.scoreKey !== "string" || !axisKeys.has(lane.scoreKey)) {
        add("manifest.lane-axis", `${path}.scoreKey`, "Lane scoreKey must resolve to an axis.")
      }
      for (const field of ["label", "description", "lowLabel", "highLabel"] as const) {
        if (!isNonEmptyString(lane[field])) {
          add("manifest.lane", `${path}.${field}`, `Lane ${field} is required.`)
        }
      }
    })
  }

  if (
    !isStringArray(value.questionTypes, 1) ||
    !value.questionTypes.every((kind) => MODULE_QUESTION_TYPES.includes(kind as never)) ||
    !hasUniqueValues(value.questionTypes)
  ) {
    add(
      "manifest.question-types",
      "questionTypes",
      "Question types must be unique values from the fixed vocabulary.",
    )
  }
  if (
    !isStringArray(value.cardTypes, 1) ||
    !value.cardTypes.every((kind) => MODULE_CARD_TYPES.includes(kind as never)) ||
    !hasUniqueValues(value.cardTypes)
  ) {
    add(
      "manifest.card-types",
      "cardTypes",
      "Card types must be unique values from the fixed vocabulary.",
    )
  }

  if (!isRecord(value.calibration)) {
    add("manifest.calibration", "calibration", "Calibration metadata is required.")
  } else {
    addUnexpectedKeys(
      value.calibration,
      [
        "status",
        "id",
        "questionBankVersion",
        "scoringVersion",
        "modes",
        "method",
        "artifactPath",
      ],
      "calibration",
      add,
    )
    if (!MODULE_CALIBRATION_STATUSES.includes(value.calibration.status as never)) {
      add("manifest.calibration", "calibration.status", "Calibration status is invalid.")
    }
    if (!isStableId(value.calibration.id)) {
      add("manifest.calibration", "calibration.id", "Calibration ID must be stable.")
    }
    for (const field of ["questionBankVersion", "scoringVersion"] as const) {
      if (!isPositiveInteger(value.calibration[field])) {
        add("manifest.calibration", `calibration.${field}`, `${field} must be positive.`)
      }
    }
    if (
      !isStringArray(value.calibration.modes, 1) ||
      !value.calibration.modes.every((mode) => MODES.includes(mode as never)) ||
      !hasUniqueValues(value.calibration.modes)
    ) {
      add("manifest.calibration", "calibration.modes", "Calibration modes are invalid.")
    }
    if (!isNonEmptyString(value.calibration.method)) {
      add("manifest.calibration", "calibration.method", "Calibration method is required.")
    }
    if (
      value.calibration.artifactPath !== undefined &&
      !isSafeRepoPath(value.calibration.artifactPath)
    ) {
      add("manifest.calibration", "calibration.artifactPath", "Artifact path must be repository-relative.")
    }
    if (isRecord(value.versions)) {
      if (value.calibration.questionBankVersion !== value.versions.questionBank) {
        add("manifest.calibration-version", "calibration.questionBankVersion", "Calibration bank version must match the manifest.")
      }
      if (value.calibration.scoringVersion !== value.versions.scoring) {
        add("manifest.calibration-version", "calibration.scoringVersion", "Calibration scoring version must match the manifest.")
      }
    }
  }

  if (!isRecord(value.resultCopy)) {
    add("manifest.result-copy", "resultCopy", "Result copy metadata is required.")
  } else {
    const resultCopy = value.resultCopy
    addUnexpectedKeys(
      resultCopy,
      [
        "defaultHeadline",
        "title",
        "shortTitle",
        "subtitle",
        "shorthand",
        "timeEstimate",
        "description",
        "measures",
        "doesNotClaim",
      ],
      "resultCopy",
      add,
    )
    for (const field of [
      "defaultHeadline",
      "title",
      "shortTitle",
      "subtitle",
      "shorthand",
      "description",
    ] as const) {
      if (!isNonEmptyString(resultCopy[field])) {
        add("manifest.result-copy", `resultCopy.${field}`, `${field} is required.`)
      }
    }
    const timeEstimate = resultCopy.timeEstimate
    if (
      !isRecord(timeEstimate) ||
      MODES.some((mode) => !isNonEmptyString(timeEstimate[mode]))
    ) {
      add("manifest.result-copy", "resultCopy.timeEstimate", "Both mode estimates are required.")
    }
    for (const field of ["measures", "doesNotClaim"] as const) {
      if (!isStringArray(resultCopy[field], 1)) {
        add("manifest.result-copy", `resultCopy.${field}`, `${field} must be a non-empty list.`)
      }
    }
  }

  if (!isRecord(value.localeStatus)) {
    add("manifest.locale-status", "localeStatus", "Locale status is required.")
  } else {
    const localeStatus = value.localeStatus
    addUnexpectedKeys(localeStatus, ["sourceLocale", "locales"], "localeStatus", add)
    if (!isNonEmptyString(localeStatus.sourceLocale)) {
      add("manifest.locale-status", "localeStatus.sourceLocale", "Source locale is required.")
    }
    if (!Array.isArray(localeStatus.locales) || localeStatus.locales.length === 0) {
      add("manifest.locale-status", "localeStatus.locales", "At least one locale record is required.")
    } else {
      const localeIds: string[] = []
      localeStatus.locales.forEach((locale, index) => {
        const path = `localeStatus.locales[${index}]`
        if (!isRecord(locale)) {
          add("manifest.locale-status", path, "Locale record must be an object.")
          return
        }
        addUnexpectedKeys(locale, ["locale", "status", "contentVersion", "reviewIds"], path, add)
        if (!isNonEmptyString(locale.locale)) {
          add("manifest.locale-status", `${path}.locale`, "Locale ID is required.")
        } else {
          localeIds.push(locale.locale)
        }
        if (!MODULE_LOCALE_STATUSES.includes(locale.status as never)) {
          add("manifest.locale-status", `${path}.status`, "Locale status is invalid.")
        }
        if (locale.contentVersion !== undefined && !isPositiveInteger(locale.contentVersion)) {
          add("manifest.locale-status", `${path}.contentVersion`, "Locale contentVersion must be positive.")
        }
        if (
          locale.reviewIds !== undefined &&
          (!isStringArray(locale.reviewIds) ||
            !locale.reviewIds.every(isStableId) ||
            !hasUniqueValues(locale.reviewIds))
        ) {
          add("manifest.locale-status", `${path}.reviewIds`, "Locale review IDs must be stable and unique.")
        }
      })
      if (!hasUniqueValues(localeIds)) {
        add("manifest.locale-status", "localeStatus.locales", "Locale IDs must be unique.")
      }
      const sourceRecord = localeStatus.locales.find(
        (locale) => isRecord(locale) && locale.locale === localeStatus.sourceLocale,
      )
      if (!isRecord(sourceRecord) || sourceRecord.status === "not-authored") {
        add("manifest.locale-status", "localeStatus.sourceLocale", "Source locale must resolve to authored copy.")
      }
    }
  }

  if (!isRecord(value.evidenceAuditHooks)) {
    add("manifest.hooks", "evidenceAuditHooks", "Evidence and audit hooks are required.")
  } else {
    addUnexpectedKeys(
      value.evidenceAuditHooks,
      ["evidence", "reviews", "audits"],
      "evidenceAuditHooks",
      add,
    )
    for (const field of ["evidence", "reviews"] as const) {
      const hooks = value.evidenceAuditHooks[field]
      if (!Array.isArray(hooks)) {
        add("manifest.hooks", `evidenceAuditHooks.${field}`, `${field} hooks must be a list.`)
        continue
      }
      const hookIds: string[] = []
      hooks.forEach((hook, index) => {
        const path = `evidenceAuditHooks.${field}[${index}]`
        if (!isRecord(hook) || !isStableId(hook.id) || !isSafeRepoPath(hook.path)) {
          add("manifest.hooks", path, "Evidence hooks require a stable ID and repository-relative path.")
          return
        }
        addUnexpectedKeys(hook, ["id", "path"], path, add)
        hookIds.push(hook.id)
      })
      if (!hasUniqueValues(hookIds)) {
        add("manifest.hooks", `evidenceAuditHooks.${field}`, `${field} hook IDs must be unique.`)
      }
    }
    const audits = value.evidenceAuditHooks.audits
    if (!Array.isArray(audits) || audits.length === 0) {
      add("manifest.hooks", "evidenceAuditHooks.audits", "At least one audit hook is required.")
    } else {
      const auditIds: string[] = []
      audits.forEach((hook, index) => {
        const path = `evidenceAuditHooks.audits[${index}]`
        if (
          !isRecord(hook) ||
          !isStableId(hook.id) ||
          !isStableId(hook.packageScript)
        ) {
          add("manifest.hooks", path, "Audit hooks require stable IDs and package script names.")
          return
        }
        addUnexpectedKeys(hook, ["id", "packageScript"], path, add)
        auditIds.push(hook.id)
      })
      if (!hasUniqueValues(auditIds)) {
        add("manifest.hooks", "evidenceAuditHooks.audits", "Audit hook IDs must be unique.")
      }
    }
  }

  if (!sameValue(value.relationPolicy, DEFAULT_DOMAIN_RELATION_POLICY)) {
    add(
      "manifest.relation-policy",
      "relationPolicy",
      "Relation policy must keep the fixed not-comparable, no-score defaults.",
    )
  }

  if (!Array.isArray(value.bridges)) {
    add("manifest.bridges", "bridges", "Bridge definitions must be an explicit list.")
  } else {
    const evidenceHookIds = new Set(
      isRecord(value.evidenceAuditHooks) &&
      Array.isArray(value.evidenceAuditHooks.evidence)
        ? value.evidenceAuditHooks.evidence.flatMap((hook) =>
            isRecord(hook) && typeof hook.id === "string" ? [hook.id] : [],
          )
        : [],
    )
    const reviewHookIds = new Set(
      isRecord(value.evidenceAuditHooks) &&
      Array.isArray(value.evidenceAuditHooks.reviews)
        ? value.evidenceAuditHooks.reviews.flatMap((hook) =>
            isRecord(hook) && typeof hook.id === "string" ? [hook.id] : [],
          )
        : [],
    )
    const ids: string[] = []
    const publicTargets: string[] = []
    value.bridges.forEach((bridge, index) => {
      validateBridge(
        bridge,
        index,
        slug,
        axisKeys,
        evidenceHookIds,
        reviewHookIds,
        add,
      )
      if (isRecord(bridge) && typeof bridge.id === "string") ids.push(bridge.id)
      if (
        isRecord(bridge) &&
        bridge.publication === "public" &&
        typeof bridge.moduleAxis === "string"
      ) {
        publicTargets.push(
          `${bridge.moduleAxis}:${String(bridge.foundationDimension ?? "none")}`,
        )
      }
    })
    if (!hasUniqueValues(ids)) {
      add("bridge.id-duplicate", "bridges", "Bridge IDs must be unique within a manifest.")
    }
    if (!hasUniqueValues(publicTargets)) {
      add(
        "bridge.publication-ambiguous",
        "bridges",
        "Only one public bridge may target an axis/Foundation pair.",
      )
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
    for (const question of definition.questionsByMode[mode]) {
      byId.set(question.id, question)
    }
  }
  return [...byId.values()]
}

export function validateModuleAuthoringRecord(
  record: ModuleAuthoringRecord,
  registered: ModuleRegistrationVersions,
): ModuleAuthoringValidationResult {
  const { definition, manifest } = record
  const base = validateDomainModuleManifest(manifest)
  const issues: ModuleAuthoringValidationIssue[] = base.ok ? [] : [...base.issues]
  const add = (code: string, path: string, message: string) =>
    issues.push({ code, path, message })

  if (manifest.releaseState !== "shipping") {
    add(
      "registration.non-shipping",
      "releaseState",
      "Template manifests cannot enter the shipping registry.",
    )
  }
  if (definition.slug !== manifest.slug) {
    add("registration.slug", "slug", "Definition slug must come from its manifest.")
  }
  if (manifest.versions.questionBank !== registered.bankVersion) {
    add("registration.version", "versions.questionBank", "Manifest bank version must match the registry.")
  }
  if (manifest.versions.scoring !== registered.scoringVersion) {
    add("registration.version", "versions.scoring", "Manifest scoring version must match the registry.")
  }
  if (!sameValue(definition.axes, manifest.axes)) {
    add("registration.axes", "axes", "Definition axes must come from its manifest.")
  }
  if (!sameValue(definition.lanes, manifest.lanes)) {
    add("registration.lanes", "lanes", "Definition lanes must come from its manifest.")
  }
  for (const [key, value] of Object.entries(manifest.resultCopy)) {
    if (!sameValue(definition[key as keyof ModuleDefinition], value)) {
      add(
        "registration.result-copy",
        `resultCopy.${key}`,
        `Definition ${key} must come from its manifest.`,
      )
    }
  }

  const axisKeys = new Set(manifest.axes.map((axis) => axis.key))
  const laneKeys = new Set(manifest.lanes.map((lane) => lane.key))
  const usedQuestionTypes = new Set<string>()
  const usedCardTypes = new Set<string>()
  for (const question of uniqueQuestions(definition)) {
    const path = `questions.${question.id}`
    if (!question.kind || !manifest.questionTypes.includes(question.kind)) {
      add("registration.question-type", `${path}.kind`, "Question kind must be declared by the manifest.")
    } else {
      usedQuestionTypes.add(question.kind)
    }
    if (!manifest.cardTypes.includes(question.cardType)) {
      add("registration.card-type", `${path}.cardType`, "Card type must be declared by the manifest.")
    } else {
      usedCardTypes.add(question.cardType)
    }
    if (!laneKeys.has(question.lane)) {
      add("registration.lane", `${path}.lane`, "Question lane must resolve through the manifest.")
    }
    for (const axis of question.discriminatingAxes) {
      if (!axisKeys.has(axis)) {
        add("registration.axis", `${path}.discriminatingAxes`, `Unknown manifest axis ${axis}.`)
      }
    }
    for (const option of question.options) {
      for (const axis of Object.keys(option.signals)) {
        if (!axisKeys.has(axis)) {
          add("registration.axis", `${path}.options.${option.id}.signals`, `Unknown manifest axis ${axis}.`)
        }
      }
    }
  }
  for (const questionType of manifest.questionTypes) {
    if (!usedQuestionTypes.has(questionType)) {
      add("registration.question-type-unused", "questionTypes", `Declared question type ${questionType} is unused.`)
    }
  }
  for (const cardType of manifest.cardTypes) {
    if (!usedCardTypes.has(cardType)) {
      add("registration.card-type-unused", "cardTypes", `Declared card type ${cardType} is unused.`)
    }
  }

  return issues.length === 0 ? { ok: true, issues: [] } : { ok: false, issues }
}

export function formatModuleAuthoringIssues(
  slug: string,
  issues: readonly ModuleAuthoringValidationIssue[],
) {
  return issues.map(
    (issue) => `${slug}: ${issue.path} [${issue.code}] ${issue.message}`,
  )
}

export type AnyDomainModuleManifest = DomainModuleManifest<string, string, string>
