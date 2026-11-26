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
  securityV4Module,
  SECURITY_V4_BANK_VERSION,
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

// Frozen manifests of the last public betas, retained for provenance and replay tests.
export const ARCHIVED_BETA_RECORDS = [
  { manifest: securityModuleManifest, definition: securityModule },
  { manifest: technologyModuleManifest, definition: technologyModule },
] as const satisfies readonly ModuleAuthoringRecord[]

// Rollback tuples are specified by the two August 21 owner decisions. No beta
// decision is attached to a compatibility-only manifest.
const withdrawalReview = {
  id: "november-beta-withdrawal",
  path: "docs/pm/MODULE_BETA_WITHDRAWAL.md",
}
const securityCompatibilityManifest: DomainModuleManifest<"security"> = {
  ...securityModuleManifest,
  releaseState: "withdrawn",
  releaseDecision: undefined,
  versions: { manifest: 1, questionBank: SECURITY_V4_BANK_VERSION, scoring: 2, resultCopy: 1 },
  resultCopy: resultCopyFromDefinition(securityV4Module),
  calibration: {
    ...securityModuleManifest.calibration,
    questionBankVersion: SECURITY_V4_BANK_VERSION,
    id: "v23.3-security-bank4-scorer2-uniform-primary-2026-08-19",
    artifactPath: "lib/modules/calibration-data-v4.ts",
  },
  localeStatus: {
    sourceLocale: "en",
    locales: [{ locale: "en", status: "authored-complete", contentVersion: 1 }, { locale: "zh-Hans", status: "not-authored" }],
  },
  evidenceAuditHooks: {
    evidence: [{ id: "security-v4-sources", path: "docs/v23/security/V23_3_SECURITY_SOURCE_LEDGER.md" }],
    reviews: [withdrawalReview, { id: "security-v4-hold", path: "docs/v23/security/V23_3_SECURITY_V4_CONTRACT.md" }],
    audits: [{ id: "security-v4-balance", packageScript: "validate:security-v4", path: "scripts/validate-security-v4.mts" }],
  },
  manifestFingerprint: "4e78a6053e00793e66ad9e77d316e49622b4ad0f0df93e19b067e628d80d67dc",
}

const technologyCompatibilityManifest: DomainModuleManifest<"technology"> = {
  ...technologyModuleManifest,
  releaseState: "withdrawn",
  releaseDecision: undefined,
  versions: { ...technologyModuleManifest.versions, manifest: 1 },
  evidenceAuditHooks: {
    ...technologyModuleManifest.evidenceAuditHooks,
    reviews: [...technologyModuleManifest.evidenceAuditHooks.reviews, withdrawalReview],
  },
  manifestFingerprint: "a36cadde5cd33e33405ea8305c0b2369fad00f863874e313ac22bd946e710b5d",
}

export const MODULE_AUTHORING_RECORDS = [
  { manifest: securityCompatibilityManifest, definition: securityV4Module },
  { manifest: technologyCompatibilityManifest, definition: technologyModule },
] as const satisfies readonly ModuleAuthoringRecord[]

export const MODULE_AUTHORING_MANIFESTS = MODULE_AUTHORING_RECORDS.map(
  (record) => record.manifest,
)

const MODULE_AUTHORING_RECORD_MAP = Object.fromEntries(
  MODULE_AUTHORING_RECORDS.map((record) => [record.manifest.slug, record]),
) as Record<ModuleSlug, (typeof MODULE_AUTHORING_RECORDS)[number]>

type RegisteredModule = (typeof MODULE_AUTHORING_RECORDS)[number]

export function getModuleAuthoringRecord(slug: ModuleSlug): RegisteredModule
export function getModuleAuthoringRecord(slug: string): RegisteredModule | null
export function getModuleAuthoringRecord(slug: string): RegisteredModule | null {
  return Object.prototype.hasOwnProperty.call(MODULE_AUTHORING_RECORD_MAP, slug)
    ? MODULE_AUTHORING_RECORD_MAP[slug as ModuleSlug]
    : null
}

export function acceptsModuleCompletions(slug: ModuleSlug) {
  const { manifest } = getModuleAuthoringRecord(slug)
  return manifest.releaseState === "shipping" || manifest.releaseState === "public-beta"
}
