export const EPSILON = 1e-9
export const MEASUREMENT_EPSILON = EPSILON
// Prompt 2C completed the bank repairs, so both structural validation and
// bank diagnostics now fail the build on measurement-gate findings.
export const MEASUREMENT_GATES_BLOCKING = true

export type MeasurementFindingCode =
  | "no-discriminating-axis"
  | "item-midpoint-straddle"
  | "item-minimum-spread"
  | "discriminating-coverage"
  | "bank-attainable-range"
  | "bank-pole-access"
  | "bank-uniform-mean"
  | "threshold-outside-attainable-range"
  | "outcome-concentration"
  | "floor-saturation"
  | "ceiling-saturation"
  | "reverse-coding"
  | "compromise-option"

export type MeasurementFinding = {
  code: MeasurementFindingCode
  classification: "gate" | "review"
  subject: string
  message: string
}

export type MeasurementOption<Axis extends string> = {
  id: string
  signals: Partial<Record<Axis, number>>
}

export type AxisOptionStats<Axis extends string> = {
  axis: Axis
  minimum: number
  maximum: number
  spread: number
}

export type OptionSignalStats = {
  minimum: number
  maximum: number
  mean: number
  spread: number
  straddles: boolean
}

export type DeclaredAxisEvaluation = OptionSignalStats & {
  meetsMinimumSpread: boolean
  passes: boolean
}

export type AxisSpread<Axis extends string> = {
  axis: Axis
  spread: number
}

export type BankGateSummaryInput = {
  minimum: number
  maximum: number
  midpoint: number
  minimumRange: number
  uniformMean: number
  maximumCenterDistance: number
  modalShare: number
  maximumConcentration: number
  floorShare: number
  ceilingShare: number
  maximumSaturation: number
  reverseRatio?: number
  minimumReverseRatio?: number
}

export type BankGateSummary = {
  minimumRangeMet: boolean
  bothPolesReached: boolean
  uniformMeanCentered: boolean
  concentrationBelowLimit: boolean
  floorSaturationBelowLimit: boolean
  ceilingSaturationBelowLimit: boolean
  reverseCodingMet: boolean | null
}

type DeclaredAxisFindingOptions<Axis extends string> = {
  subject: string
  declaredAxes: readonly Axis[]
  options: readonly MeasurementOption<Axis>[]
  midpoint: number
  minimumSpread: number
}

type CompromiseFindingOptions<Axis extends string> = {
  subject: string
  options: readonly MeasurementOption<Axis>[]
  axes: readonly Axis[]
  midpoint: number
  tolerance?: number
}

function gateFinding(
  code: MeasurementFindingCode,
  subject: string,
  message: string,
): MeasurementFinding {
  return { code, classification: "gate", subject, message }
}

function reviewFinding(
  code: MeasurementFindingCode,
  subject: string,
  message: string,
): MeasurementFinding {
  return { code, classification: "review", subject, message }
}

export function isMeasurementFindingBlocking(
  finding: MeasurementFinding,
  measurementGatesBlocking: boolean,
): boolean {
  return finding.classification === "gate" && measurementGatesBlocking
}

export function getOptionSignalStats(
  values: readonly number[],
  midpoint: number,
): OptionSignalStats {
  const finiteValues = values.map((value) =>
    Number.isFinite(value) ? value : midpoint,
  )
  const minimum =
    finiteValues.length > 0 ? Math.min(...finiteValues) : midpoint
  const maximum =
    finiteValues.length > 0 ? Math.max(...finiteValues) : midpoint

  return {
    minimum,
    maximum,
    mean:
      finiteValues.length > 0
        ? finiteValues.reduce((sum, value) => sum + value, 0) /
          finiteValues.length
        : midpoint,
    spread: maximum - minimum,
    straddles: reachesBothSides(minimum, maximum, midpoint),
  }
}

export function evaluateDeclaredAxis(
  values: readonly number[],
  midpoint: number,
  minimumSpread: number,
): DeclaredAxisEvaluation {
  const stats = getOptionSignalStats(values, midpoint)
  const meetsSpread = meetsMinimumRange(stats.spread, minimumSpread)
  return {
    ...stats,
    meetsMinimumSpread: meetsSpread,
    passes: stats.straddles && meetsSpread,
  }
}

export function getAxisOptionStats<Axis extends string>(
  options: readonly MeasurementOption<Axis>[],
  axes: readonly Axis[],
  midpoint: number,
): AxisOptionStats<Axis>[] {
  return [...new Set(axes)].map((axis) => {
    const stats = getOptionSignalStats(options.map((option) => {
      const value = option.signals[axis]
      return typeof value === "number" && Number.isFinite(value)
        ? value
        : midpoint
    }), midpoint)

    return {
      axis,
      minimum: stats.minimum,
      maximum: stats.maximum,
      spread: stats.spread,
    }
  })
}

export function getTopHalfQualifyingAxes<Axis extends string>(
  spreads: readonly AxisSpread<Axis>[],
  minimumSpread: number,
  epsilon = EPSILON,
): Axis[] {
  if (spreads.length === 0) return []

  const topHalfCount = Math.ceil(spreads.length / 2)
  const ranked = [...spreads].sort(
    (left, right) =>
      right.spread - left.spread || left.axis.localeCompare(right.axis),
  )
  const cutoff = ranked[topHalfCount - 1].spread

  return spreads
    .filter(
      ({ spread }) =>
        spread + epsilon >= minimumSpread &&
        spread + epsilon >= cutoff,
    )
    .map(({ axis }) => axis)
}

export function qualifyDiscriminatingAxes<Axis extends string>(
  stats: readonly AxisOptionStats<Axis>[],
  minimumSpread: number,
  epsilon = EPSILON,
): Axis[] {
  return getTopHalfQualifyingAxes(stats, minimumSpread, epsilon)
}

export function meetsMinimumRange(
  observedRange: number,
  minimumRange: number,
): boolean {
  return observedRange + EPSILON >= minimumRange
}

export function reachesBothSides(
  minimum: number,
  maximum: number,
  midpoint: number,
): boolean {
  return minimum < midpoint && maximum > midpoint
}

export function isWithinAttainableCentre(
  uniformMean: number,
  attainableMinimum: number,
  attainableMaximum: number,
  maximumDistance: number,
): boolean {
  const centre = (attainableMinimum + attainableMaximum) / 2
  return Math.abs(uniformMean - centre) <= maximumDistance + EPSILON
}

export function isBelowMaximumShare(
  observedShare: number,
  maximumShare: number,
): boolean {
  return observedShare < maximumShare - EPSILON
}

export function meetsMinimumRatio(
  observedRatio: number,
  minimumRatio: number,
): boolean {
  return observedRatio + EPSILON >= minimumRatio
}

export function evaluateBankGateSummary({
  minimum,
  maximum,
  midpoint,
  minimumRange,
  uniformMean,
  maximumCenterDistance,
  modalShare,
  maximumConcentration,
  floorShare,
  ceilingShare,
  maximumSaturation,
  reverseRatio,
  minimumReverseRatio,
}: BankGateSummaryInput): BankGateSummary {
  return {
    minimumRangeMet: meetsMinimumRange(maximum - minimum, minimumRange),
    bothPolesReached: reachesBothSides(minimum, maximum, midpoint),
    uniformMeanCentered: isWithinAttainableCentre(
      uniformMean,
      minimum,
      maximum,
      maximumCenterDistance,
    ),
    concentrationBelowLimit: isBelowMaximumShare(
      modalShare,
      maximumConcentration,
    ),
    floorSaturationBelowLimit: isBelowMaximumShare(
      floorShare,
      maximumSaturation,
    ),
    ceilingSaturationBelowLimit: isBelowMaximumShare(
      ceilingShare,
      maximumSaturation,
    ),
    reverseCodingMet:
      reverseRatio === undefined || minimumReverseRatio === undefined
        ? null
        : meetsMinimumRatio(reverseRatio, minimumReverseRatio),
  }
}

export function findNoQualifyingAxisFindings(
  subject: string,
  qualifyingAxes: readonly string[],
): MeasurementFinding[] {
  if (qualifyingAxes.length > 0) return []

  return [
    gateFinding(
      "no-discriminating-axis",
      subject,
      `${subject} has no axis that meets the discriminating-axis qualification rule.`,
    ),
  ]
}

export function findMissingDeclaredAxisFindings(
  subject: string,
  declaredAxes: readonly string[],
): MeasurementFinding[] {
  if (declaredAxes.length > 0) return []

  return [
    gateFinding(
      "no-discriminating-axis",
      subject,
      `${subject} declares no discriminating axis.`,
    ),
  ]
}

export function findDeclaredAxisFindings<Axis extends string>({
  subject,
  declaredAxes,
  options,
  midpoint,
  minimumSpread,
}: DeclaredAxisFindingOptions<Axis>): MeasurementFinding[] {
  const findings: MeasurementFinding[] = []
  const stats = getAxisOptionStats(options, declaredAxes, midpoint)

  for (const { axis, minimum, maximum, spread } of stats) {
    const axisSubject = `${subject}.${axis}`
    if (!reachesBothSides(minimum, maximum, midpoint)) {
      findings.push(
        gateFinding(
          "item-midpoint-straddle",
          axisSubject,
          `${axisSubject} does not straddle ${midpoint.toFixed(1)} ` +
            `(min ${minimum.toFixed(2)}, max ${maximum.toFixed(2)}).`,
        ),
      )
    }
    if (!meetsMinimumRange(spread, minimumSpread)) {
      findings.push(
        gateFinding(
          "item-minimum-spread",
          axisSubject,
          `${axisSubject} spread is ${spread.toFixed(2)}; ` +
            `minimum ${minimumSpread.toFixed(2)}.`,
        ),
      )
    }
  }

  return findings
}

export function findAttainableRangeFindings(
  subject: string,
  minimum: number,
  maximum: number,
  minimumRange: number,
): MeasurementFinding[] {
  const range = maximum - minimum
  if (meetsMinimumRange(range, minimumRange)) return []

  return [
    gateFinding(
      "bank-attainable-range",
      subject,
      `${subject} attainable range is ${range.toFixed(3)}; ` +
        `minimum ${minimumRange.toFixed(3)}.`,
    ),
  ]
}

export function findDiscriminatingCoverageFindings(
  subject: string,
  observedCount: number,
  minimumCount: number,
): MeasurementFinding[] {
  if (observedCount >= minimumCount) return []

  return [
    gateFinding(
      "discriminating-coverage",
      subject,
      `${subject} has ${observedCount} discriminating items; ` +
        `minimum ${minimumCount}.`,
    ),
  ]
}

export function findThresholdRangeFindings(
  subject: string,
  threshold: number,
  attainableMinimum: number,
  attainableMaximum: number,
): MeasurementFinding[] {
  if (
    threshold + EPSILON >= attainableMinimum &&
    threshold - EPSILON <= attainableMaximum
  ) return []

  return [
    gateFinding(
      "threshold-outside-attainable-range",
      subject,
      `${subject} threshold ${threshold.toFixed(3)} is outside its ` +
        `attainable range ${attainableMinimum.toFixed(3)}–` +
        `${attainableMaximum.toFixed(3)}.`,
    ),
  ]
}

export function findPoleAccessFindings(
  subject: string,
  minimum: number,
  maximum: number,
  midpoint: number,
): MeasurementFinding[] {
  if (reachesBothSides(minimum, maximum, midpoint)) return []

  return [
    gateFinding(
      "bank-pole-access",
      subject,
      `${subject} does not reach both sides of ${midpoint.toFixed(1)} ` +
        `(min ${minimum.toFixed(2)}, max ${maximum.toFixed(2)}).`,
    ),
  ]
}

export function findUniformMeanCenteringFindings(
  subject: string,
  uniformMean: number,
  attainableMinimum: number,
  attainableMaximum: number,
  maximumDistance: number,
): MeasurementFinding[] {
  const centre = (attainableMinimum + attainableMaximum) / 2
  const distance = Math.abs(uniformMean - centre)
  if (
    isWithinAttainableCentre(
      uniformMean,
      attainableMinimum,
      attainableMaximum,
      maximumDistance,
    )
  ) return []

  return [
    gateFinding(
      "bank-uniform-mean",
      subject,
      `${subject} uniform-choice mean is ${uniformMean.toFixed(3)}, ` +
        `${distance.toFixed(3)} from attainable-range centre ` +
        `${centre.toFixed(3)}; maximum ${maximumDistance.toFixed(3)}.`,
    ),
  ]
}

export function findConcentrationFindings(
  subject: string,
  modalShare: number,
  maximumShare: number,
  outcomeLabel = "modal outcome",
): MeasurementFinding[] {
  if (isBelowMaximumShare(modalShare, maximumShare)) return []

  return [
    gateFinding(
      "outcome-concentration",
      subject,
      `${subject} ${outcomeLabel} share is ${(modalShare * 100).toFixed(1)}%; ` +
        `it must stay below ${(maximumShare * 100).toFixed(1)}%.`,
    ),
  ]
}

export function findSaturationFindings(
  subject: string,
  floorShare: number,
  ceilingShare: number,
  maximumShare: number,
): MeasurementFinding[] {
  const findings: MeasurementFinding[] = []

  if (!isBelowMaximumShare(floorShare, maximumShare)) {
    findings.push(
      gateFinding(
        "floor-saturation",
        subject,
        `${subject} floor saturation is ${(floorShare * 100).toFixed(1)}%; ` +
          `it must stay below ${(maximumShare * 100).toFixed(1)}%.`,
      ),
    )
  }
  if (!isBelowMaximumShare(ceilingShare, maximumShare)) {
    findings.push(
      gateFinding(
        "ceiling-saturation",
        subject,
        `${subject} ceiling saturation is ${(ceilingShare * 100).toFixed(1)}%; ` +
          `it must stay below ${(maximumShare * 100).toFixed(1)}%.`,
      ),
    )
  }

  return findings
}

export function findReverseCodingFindings(
  subject: string,
  reverseRatio: number,
  minimumRatio: number,
): MeasurementFinding[] {
  if (meetsMinimumRatio(reverseRatio, minimumRatio)) return []

  return [
    gateFinding(
      "reverse-coding",
      subject,
      `${subject} reverse-coding ratio is ${(reverseRatio * 100).toFixed(1)}%; ` +
        `minimum ${(minimumRatio * 100).toFixed(1)}%.`,
    ),
  ]
}

export function findCompromiseReviewFindings<Axis extends string>({
  subject,
  options,
  axes,
  midpoint,
  tolerance = 0.15,
}: CompromiseFindingOptions<Axis>): MeasurementFinding[] {
  const findings: MeasurementFinding[] = []

  for (let candidateIndex = 0; candidateIndex < options.length; candidateIndex += 1) {
    const candidate = options[candidateIndex]
    let foundPair = false

    for (
      let leftIndex = 0;
      leftIndex < options.length && !foundPair;
      leftIndex += 1
    ) {
      if (leftIndex === candidateIndex) continue

      for (
        let rightIndex = leftIndex + 1;
        rightIndex < options.length;
        rightIndex += 1
      ) {
        if (rightIndex === candidateIndex) continue

        const liesAtMean = axes.every((axis) => {
          const candidateValue = candidate.signals[axis] ?? midpoint
          const pairMean =
            ((options[leftIndex].signals[axis] ?? midpoint) +
              (options[rightIndex].signals[axis] ?? midpoint)) /
            2
          return Math.abs(candidateValue - pairMean) <= tolerance
        })
        if (!liesAtMean) continue

        findings.push(
          reviewFinding(
            "compromise-option",
            `${subject}.${candidate.id}`,
            `${subject} option ${candidate.id} is within ${tolerance.toFixed(2)} ` +
              `of the full-vector mean of ${options[leftIndex].id} and ` +
              `${options[rightIndex].id}; this requires editorial review.`,
          ),
        )
        foundPair = true
        break
      }
    }
  }

  return findings
}
