import { createHash } from "node:crypto"

export type CountEntry = {
  key: string
  count: number
}

/**
 * Locale-independent ordering for evidence output.
 *
 * `localeCompare` can vary with the host ICU build and locale. Relational
 * string comparison follows ECMAScript's UTF-16 code-unit ordering instead,
 * which keeps checked-in digests and array order stable across environments.
 */
export function compareEvidenceStrings(left: string, right: string): number {
  if (left < right) return -1
  if (left > right) return 1
  return 0
}

export function canonicalizeJson(value: unknown): unknown {
  if (
    value === null ||
    typeof value === "string" ||
    typeof value === "boolean"
  ) {
    return value
  }

  if (typeof value === "number") {
    if (!Number.isFinite(value)) {
      throw new TypeError("Evidence output cannot contain non-finite numbers.")
    }
    return Object.is(value, -0) ? 0 : value
  }

  if (Array.isArray(value)) {
    return value.map(canonicalizeJson)
  }

  if (typeof value === "object") {
    return Object.fromEntries(
      Object.entries(value)
        .filter(([, entry]) => entry !== undefined)
        .sort(([left], [right]) => compareEvidenceStrings(left, right))
        .map(([key, entry]) => [key, canonicalizeJson(entry)]),
    )
  }

  throw new TypeError(
    `Evidence output contains unsupported ${typeof value} value.`,
  )
}

export function stableJson(value: unknown): string {
  return `${JSON.stringify(canonicalizeJson(value), null, 2)}\n`
}

export function stableCompactJson(value: unknown): string {
  return JSON.stringify(canonicalizeJson(value))
}

export function hashText(value: string): string {
  return createHash("sha256").update(value).digest("hex")
}

export function hashJson(value: unknown): string {
  return hashText(stableCompactJson(value))
}

export function countValues(values: readonly string[]): CountEntry[] {
  const counts = new Map<string, number>()
  for (const value of values) {
    counts.set(value, (counts.get(value) ?? 0) + 1)
  }

  return [...counts.entries()]
    .sort(([left], [right]) => compareEvidenceStrings(left, right))
    .map(([key, count]) => ({ key, count }))
}

export function roundEvidence(value: number, digits = 4): number {
  return Number(value.toFixed(digits))
}
