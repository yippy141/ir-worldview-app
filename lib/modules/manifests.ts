import {
  DEFAULT_DOMAIN_RELATION_POLICY,
  DOMAIN_MODULE_MANIFEST_SCHEMA_VERSION,
  type DomainModuleManifest,
  type DomainModuleResultCopy,
} from "@/lib/modules/authoring-contract"
import {
  MODULE_CALIBRATION_SOURCE,
  MODULE_CALIBRATION_VERSION,
} from "@/lib/modules/calibration"
import {
  SECURITY_BANK_VERSION,
  SECURITY_SCORING_VERSION,
  securityModule,
} from "@/lib/modules/security"
import {
  TECHNOLOGY_BANK_VERSION,
  TECHNOLOGY_SCORING_VERSION,
  technologyModule,
} from "@/lib/modules/technology"
import type {
  ModuleAuthoringRecord,
} from "@/lib/modules/authoring-validation"
import type { ModuleDefinition, ModuleSlug } from "@/lib/modules/types"

function axesFromDefinition(definition: ModuleDefinition) {
  return definition.axes.map((axis) => ({ ...axis }))
}

function lanesFromDefinition(definition: ModuleDefinition) {
  return definition.lanes.map((lane) => ({ ...lane }))
}

function resultCopyFromDefinition(
  definition: ModuleDefinition,
): DomainModuleResultCopy {
  if (!definition.defaultHeadline) {
    throw new Error(
      `Current module ${definition.slug} must declare a default headline.`,
    )
  }

  return {
    defaultHeadline: definition.defaultHeadline,
    title: definition.title,
    shortTitle: definition.shortTitle,
    subtitle: definition.subtitle,
    shorthand: definition.shorthand,
    timeEstimate: { ...definition.timeEstimate },
    description: definition.description,
    measures: [...definition.measures],
    doesNotClaim: [...definition.doesNotClaim],
  }
}

export const securityModuleManifest = {
  schemaVersion: DOMAIN_MODULE_MANIFEST_SCHEMA_VERSION,
  manifestOrigin: "derived-legacy-adapter",
  releaseState: "public-beta",
  releaseDecision: {
    decisionId: "security-v5-public-beta-2026-08-21",
    decisionPath:
      "docs/v23/security/V23_3_SECURITY_V5_BETA_RELEASE_DECISION.md",
    approvedQuestionBankVersion: 5,
    approvedScoringVersion: 2,
    approvedResultCopyVersion: 2,
    approvedManifestVersion: 2,
    decisionStatus: "approved-public-beta",
    reviewDueAt: "2026-11-21T00:00:00Z",
  },
  evidenceStatus: "provenance-recorded",
  manifestFingerprint:
    "5b6e6acf8387d5f990d9f9e7b3a678aa3d99aabe62f21c704a9627c3be2473ca",
  slug: "security",
  versions: {
    manifest: 2,
    questionBank: SECURITY_BANK_VERSION,
    scoring: SECURITY_SCORING_VERSION,
    resultCopy: 2,
  },
  axes: axesFromDefinition(securityModule),
  lanes: lanesFromDefinition(securityModule),
  questionTypes: ["case"],
  cardTypes: ["explanation", "decision", "actorLens"],
  calibration: {
    status: "synthetic-diagnostic",
    id: MODULE_CALIBRATION_VERSION,
    questionBankVersion: SECURITY_BANK_VERSION,
    scoringVersion: SECURITY_SCORING_VERSION,
    modes: ["standard", "analyst"],
    method: MODULE_CALIBRATION_SOURCE.securityMethod,
    artifactPath: "lib/modules/calibration-data.ts",
  },
  resultCopy: resultCopyFromDefinition(securityModule),
  localeStatus: {
    sourceLocale: "en",
    locales: [
      { locale: "en", status: "authored-complete", contentVersion: 2 },
      { locale: "zh-Hans", status: "not-authored" },
    ],
  },
  evidenceAuditHooks: {
    evidence: [
      {
        id: "security-v5-source-ledger",
        path: "docs/v23/security/V23_3_SECURITY_V5_SOURCE_LEDGER.md",
      },
      {
        id: "security-v5-actor-balance-ledger",
        path: "docs/v23/security/V23_3_SECURITY_V5_ACTOR_BALANCE_LEDGER.csv",
      },
    ],
    reviews: [
      {
        id: "security-v5-item-review",
        path: "docs/v23/security/V23_3_SECURITY_V5_ITEM_REVIEW.md",
      },
      {
        id: "security-v5-beta-decision",
        path: "docs/v23/security/V23_3_SECURITY_V5_BETA_RELEASE_DECISION.md",
      },
    ],
    audits: [
      {
        id: "instrument-structure",
        packageScript: "validate:structure",
        path: "scripts/validate-instrument.mts",
      },
      {
        id: "security-v5-balance",
        packageScript: "validate:security-v5",
        path: "scripts/validate-security-v5.mts",
      },
      {
        id: "module-calibration",
        packageScript: "calibrate:modules",
        path: "scripts/calibrate-modules.mts",
      },
    ],
  },
  relationPolicy: DEFAULT_DOMAIN_RELATION_POLICY,
  bridges: [],
} satisfies DomainModuleManifest<"security">

export const technologyModuleManifest = {
  schemaVersion: DOMAIN_MODULE_MANIFEST_SCHEMA_VERSION,
  manifestOrigin: "derived-legacy-adapter",
  releaseState: "public-beta",
  releaseDecision: {
    decisionId: "technology-v3-public-beta-2026-08-21",
    decisionPath:
      "docs/v23/V23_4_TECHNOLOGY_V3_BETA_RELEASE_DECISION.md",
    approvedQuestionBankVersion: 3,
    approvedScoringVersion: 2,
    approvedResultCopyVersion: 1,
    approvedManifestVersion: 2,
    decisionStatus: "approved-public-beta",
    reviewDueAt: "2026-11-21T00:00:00Z",
  },
  evidenceStatus: "provenance-recorded",
  manifestFingerprint:
    "0dee7367ac98a0af6ce2903b6687a36fb27c1b81a9b0fb7b282badebd55f719e",
  slug: "technology",
  versions: {
    manifest: 2,
    questionBank: TECHNOLOGY_BANK_VERSION,
    scoring: TECHNOLOGY_SCORING_VERSION,
    resultCopy: 1,
  },
  axes: axesFromDefinition(technologyModule),
  lanes: lanesFromDefinition(technologyModule),
  questionTypes: ["case"],
  cardTypes: ["explanation", "decision", "actorLens"],
  calibration: {
    status: "synthetic-diagnostic",
    id: MODULE_CALIBRATION_VERSION,
    questionBankVersion: TECHNOLOGY_BANK_VERSION,
    scoringVersion: TECHNOLOGY_SCORING_VERSION,
    modes: ["standard", "analyst"],
    method: MODULE_CALIBRATION_SOURCE.method,
    artifactPath: "lib/modules/calibration-data.ts",
  },
  resultCopy: resultCopyFromDefinition(technologyModule),
  localeStatus: {
    sourceLocale: "en",
    locales: [
      { locale: "en", status: "authored-complete", contentVersion: 1 },
      { locale: "zh-Hans", status: "not-authored" },
    ],
  },
  evidenceAuditHooks: {
    evidence: [
      {
        id: "technology-v3-instrument",
        path: "content/instrument/technology.v3.json",
      },
    ],
    reviews: [
      {
        id: "technology-v3-measurement-baseline",
        path: "docs/decisions/v22-module-measurement-baseline.md",
      },
    ],
    audits: [
      {
        id: "instrument-structure",
        packageScript: "validate:structure",
        path: "scripts/validate-instrument.mts",
      },
      {
        id: "module-calibration",
        packageScript: "calibrate:modules",
        path: "scripts/calibrate-modules.mts",
      },
      {
        id: "module-diagnostics",
        packageScript: "diagnose",
        path: "scripts/diagnose-instrument.mts",
      },
    ],
  },
  relationPolicy: DEFAULT_DOMAIN_RELATION_POLICY,
  bridges: [],
} satisfies DomainModuleManifest<"technology">

export const MODULE_AUTHORING_RECORDS = [
  { manifest: securityModuleManifest, definition: securityModule },
  { manifest: technologyModuleManifest, definition: technologyModule },
] as const satisfies readonly ModuleAuthoringRecord[]

export const MODULE_AUTHORING_MANIFESTS = MODULE_AUTHORING_RECORDS.map(
  (record) => record.manifest,
)

const MODULE_AUTHORING_RECORD_MAP = Object.fromEntries(
  MODULE_AUTHORING_RECORDS.map((record) => [record.manifest.slug, record]),
) as Record<ModuleSlug, (typeof MODULE_AUTHORING_RECORDS)[number]>

export function getModuleAuthoringRecord(
  slug: string,
): (typeof MODULE_AUTHORING_RECORDS)[number] | null {
  return Object.prototype.hasOwnProperty.call(MODULE_AUTHORING_RECORD_MAP, slug)
    ? MODULE_AUTHORING_RECORD_MAP[slug as ModuleSlug]
    : null
}
