export const RESEARCH_UNAVAILABLE_REASON = "privacy-review-required" as const

/**
 * V19 has no research intake. Keep the legacy routes as explicit tombstones so
 * an environment variable cannot reactivate an unreviewed collection contract.
 */
export function researchUnavailableResponse() {
  return Response.json(
    {
      ok: false,
      disabled: true,
      reason: RESEARCH_UNAVAILABLE_REASON,
      message: "This site does not collect research responses.",
    },
    {
      status: 410,
      headers: {
        "cache-control": "no-store",
      },
    },
  )
}
