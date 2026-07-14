import verifiedCaseLibraryJson from "@/research/worldview-cases/verified-case-library.json" with {
  type: "json",
}

export type VerifiedClaimType =
  | "historical_fact"
  | "interpretation"
  | "current_policy_claim"

export type VerifiedCaseClaim = {
  claimId: string
  claimType: VerifiedClaimType
  text: string
}

export type VerifiedCaseSource = {
  sourceId: string
  title: string
  authorInstitution: string
  publicationDate: string | null
  url: string
  sourceType: string
  claimsSupported: string[]
  accessDate: string
}

export type VerifiedCaseProfileReading = {
  bestFitProfileId: string
  bestFitProfileLabel: string
  confidence: "high" | "medium" | "low"
  whyItResemblesTheLogicOf: string
  strongestRivalProfileId: string
  strongestRivalProfileLabel: string
  whyRivalAlsoFits: string
  whereAnalogyBreaks: string[]
}

export type VerifiedCaseRecord = {
  caseId: string
  theme: string
  title: string
  neutralContext: string
  claimLedger: VerifiedCaseClaim[]
  sourceRecords: VerifiedCaseSource[]
  staleOrDisputedClaims: Array<{
    claim: string
    status: string
    reason: string
    suggestedWording: string
  }>
  verifiedProfileReading: VerifiedCaseProfileReading
  claimsRequiringWordingChanges: Array<{
    from: string
    to: string
  }>
}

type VerifiedCaseLibrary = {
  libraryId: string
  language: string
  asOfDate: string
  notes: string[]
  cases: VerifiedCaseRecord[]
}

export type ReviewedCaseRole = "best-fit" | "strongest-rival"

export type ReviewedProfileReading = {
  patternId: string
  internalLabel: string
  role: ReviewedCaseRole
  rationale: string
}

export type ReviewedPatternCase = {
  caseStudy: VerifiedCaseRecord
  currentReading: ReviewedProfileReading
  otherReading: ReviewedProfileReading
}

export type ReviewedCaseCoverage = "several" | "thin" | "none"

export const verifiedCaseLibrary = verifiedCaseLibraryJson as VerifiedCaseLibrary

export const verifiedCaseLibraryMeta = {
  libraryId: verifiedCaseLibrary.libraryId,
  language: verifiedCaseLibrary.language,
  asOfDate: verifiedCaseLibrary.asOfDate,
  recordCount: verifiedCaseLibrary.cases.length,
  researchStatus: "Source-verified research record",
  editorialStatus: "V18 proposed library",
} as const

export function getReviewedCasesForPattern(patternId: string): ReviewedPatternCase[] {
  const readings: ReviewedPatternCase[] = []

  for (const caseStudy of verifiedCaseLibrary.cases) {
    const { verifiedProfileReading } = caseStudy
    const bestFit = toBestFitReading(verifiedProfileReading)
    const strongestRival = toStrongestRivalReading(verifiedProfileReading)

    if (bestFit.patternId === patternId) {
      readings.push({ caseStudy, currentReading: bestFit, otherReading: strongestRival })
    } else if (strongestRival.patternId === patternId) {
      readings.push({ caseStudy, currentReading: strongestRival, otherReading: bestFit })
    }
  }

  return readings
}

export function getReviewedCaseCoverage(patternId: string): {
  level: ReviewedCaseCoverage
  renderedRecordCount: number
  withheldRecordCount: number
} {
  const renderedRecordCount = getReviewedCasesForPattern(patternId).length

  return {
    level:
      renderedRecordCount === 0
        ? "none"
        : renderedRecordCount === 1
          ? "thin"
          : "several",
    renderedRecordCount,
    withheldRecordCount: verifiedCaseLibrary.cases.length - renderedRecordCount,
  }
}

/**
 * The reviewed pack can contain editorial claim-ledger entries that no source
 * record explicitly covers. Keep those out of the rendered evidence ledger.
 */
export function getSourceCoveredClaims(caseStudy: VerifiedCaseRecord) {
  const coveredClaimIds = new Set(
    caseStudy.sourceRecords.flatMap((source) => source.claimsSupported),
  )

  return caseStudy.claimLedger.filter((claim) => coveredClaimIds.has(claim.claimId))
}

function toBestFitReading(
  reading: VerifiedCaseProfileReading,
): ReviewedProfileReading {
  return {
    patternId: reading.bestFitProfileId,
    internalLabel: reading.bestFitProfileLabel,
    role: "best-fit",
    rationale: reading.whyItResemblesTheLogicOf,
  }
}

function toStrongestRivalReading(
  reading: VerifiedCaseProfileReading,
): ReviewedProfileReading {
  return {
    patternId: reading.strongestRivalProfileId,
    internalLabel: reading.strongestRivalProfileLabel,
    role: "strongest-rival",
    rationale: reading.whyRivalAlsoFits,
  }
}
