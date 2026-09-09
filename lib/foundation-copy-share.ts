import { buildFoundationSharePayload } from "@/lib/share"

/** Bind an already resolved result to the wording actually supported by this draft.
 * The issued generator and codec stay unchanged; cv already supports unknown=0.
 */
export function buildFoundationCopySharePayload(
  result: Parameters<typeof buildFoundationSharePayload>[0],
  locale: Parameters<typeof buildFoundationSharePayload>[1],
  questionSet: Parameters<typeof buildFoundationSharePayload>[2],
  targetedPair: Parameters<typeof buildFoundationSharePayload>[3],
  copyVersion: number,
) {
  if (!(copyVersion === 0 || copyVersion === 1 || (locale === "zh-Hans" && copyVersion === 2))) {
    throw new Error("Unsupported Foundation copy revision")
  }
  return { ...buildFoundationSharePayload(result, locale, questionSet, targetedPair), cv: copyVersion }
}
