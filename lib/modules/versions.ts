import {
  SECURITY_BANK_VERSION,
  SECURITY_SCORING_VERSION,
  SECURITY_V4_BANK_VERSION,
  SECURITY_V4_SCORING_VERSION,
  securityModule,
  securityV4Module,
} from "@/lib/modules/security"
import {
  SECURITY_V22_BANK_VERSION,
  SECURITY_V22_SCORING_VERSION,
  securityV22Module,
} from "@/lib/modules/security-v22"
import {
  SECURITY_V21_BANK_VERSION,
  SECURITY_V21_SCORING_VERSION,
  securityV21Module,
} from "@/lib/modules/security-v21"
import {
  TECHNOLOGY_BANK_VERSION,
  TECHNOLOGY_SCORING_VERSION,
  technologyModule,
} from "@/lib/modules/technology"
import {
  TECHNOLOGY_V21_BANK_VERSION,
  TECHNOLOGY_V21_SCORING_VERSION,
  technologyV21Module,
} from "@/lib/modules/technology-v21"
import type { ModuleDefinition, ModuleSlug } from "@/lib/modules/types"
import * as runtimeV1 from "@/lib/modules/runtime-v1"
import * as runtimeV2 from "@/lib/modules/runtime-v2"

export type ModuleVersionTuple = {
  bankVersion: number
  scoringVersion: number
}

export type ModuleVersion = ModuleVersionTuple & {
  definition: ModuleDefinition
  runtime: typeof runtimeV1 | typeof runtimeV2
}

export const MODULE_V21_TUPLE = {
  bankVersion: 2,
  scoringVersion: 1,
} as const satisfies ModuleVersionTuple

export const MODULE_V22_TUPLE = {
  bankVersion: 3,
  scoringVersion: 2,
} as const satisfies ModuleVersionTuple

export const SECURITY_V4_TUPLE = {
  bankVersion: SECURITY_V4_BANK_VERSION,
  scoringVersion: SECURITY_V4_SCORING_VERSION,
} as const satisfies ModuleVersionTuple

export const SECURITY_V5_TUPLE = {
  bankVersion: SECURITY_BANK_VERSION,
  scoringVersion: SECURITY_SCORING_VERSION,
} as const satisfies ModuleVersionTuple

export const CURRENT_MODULE_TUPLES = {
  security: SECURITY_V5_TUPLE,
  technology: MODULE_V22_TUPLE,
} as const satisfies Record<ModuleSlug, ModuleVersionTuple>

export const SUPPORTED_MODULE_VERSIONS = {
  security: [
    {
      bankVersion: SECURITY_V21_BANK_VERSION,
      scoringVersion: SECURITY_V21_SCORING_VERSION,
      definition: securityV21Module,
      runtime: runtimeV1,
    },
    {
      bankVersion: SECURITY_V22_BANK_VERSION,
      scoringVersion: SECURITY_V22_SCORING_VERSION,
      definition: securityV22Module,
      runtime: runtimeV2,
    },
    {
      bankVersion: SECURITY_V4_BANK_VERSION,
      scoringVersion: SECURITY_V4_SCORING_VERSION,
      definition: securityV4Module,
      runtime: runtimeV2,
    },
    {
      bankVersion: SECURITY_BANK_VERSION,
      scoringVersion: SECURITY_SCORING_VERSION,
      definition: securityModule,
      runtime: runtimeV2,
    },
  ],
  technology: [
    {
      bankVersion: TECHNOLOGY_V21_BANK_VERSION,
      scoringVersion: TECHNOLOGY_V21_SCORING_VERSION,
      definition: technologyV21Module,
      runtime: runtimeV1,
    },
    {
      bankVersion: TECHNOLOGY_BANK_VERSION,
      scoringVersion: TECHNOLOGY_SCORING_VERSION,
      definition: technologyModule,
      runtime: runtimeV2,
    },
  ],
} as const satisfies Record<ModuleSlug, readonly ModuleVersion[]>

export function getModuleVersion(
  slug: ModuleSlug,
  bankVersion: number,
  scoringVersion: number,
): ModuleVersion | null {
  return (
    SUPPORTED_MODULE_VERSIONS[slug].find(
      (candidate) =>
        candidate.bankVersion === bankVersion &&
        candidate.scoringVersion === scoringVersion,
    ) ?? null
  )
}

export function getCurrentModuleVersion(slug: ModuleSlug): ModuleVersion {
  const current = CURRENT_MODULE_TUPLES[slug]
  const version = getModuleVersion(
    slug,
    current.bankVersion,
    current.scoringVersion,
  )
  if (!version) {
    throw new Error(`Missing current module version for ${slug}.`)
  }
  return version
}
