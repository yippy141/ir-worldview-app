/**
 * Compare strings by ECMAScript UTF-16 code units.
 *
 * This deliberately matches the evidence layer's locale-independent ordering:
 * unlike `localeCompare`, relational string comparison does not depend on the
 * host locale or ICU build.
 *
 * @param {string} left
 * @param {string} right
 * @returns {number}
 */
export function compareCodeUnitStrings(left, right) {
  if (left < right) return -1
  if (left > right) return 1
  return 0
}
