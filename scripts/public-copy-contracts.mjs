export const ARCHETYPE_BETA_QUALIFICATION =
  "Owner-authorized AI-assisted English beta copy; pending human editorial review; no external expert review; no validation claim."

export const ARCHETYPE_BETA_CONTENT_CLASS =
  "ai-assisted-english-beta-copy"

export const ARCHETYPE_BETA_ROUTE_DISCLOSURE =
  "Owner-authorized AI-assisted English beta copy; pending human editorial review. No external expert review or validation has been completed."

function compact(value) {
  return value.replace(/\s+/gu, " ").trim()
}

/**
 * Exact exception for the owner-mandated V23.1 beta provenance record. This
 * does not admit generic beta/release language elsewhere in public copy.
 */
export function isContractedArchetypeBetaReference({
  text,
  fileName,
  path,
}) {
  const normalized = compact(text)

  if (fileName === "content/archetypes.json") {
    if (path === "publicationAuthorization.contentClass") {
      return normalized === ARCHETYPE_BETA_CONTENT_CLASS
    }
    return (
      /(?:^|\.)qualification$/u.test(path ?? "") &&
      normalized === ARCHETYPE_BETA_QUALIFICATION
    )
  }

  return (
    fileName === "app/archetypes/[slug]/page.tsx" &&
    path === "ArchetypeDetailPage.p" &&
    normalized === ARCHETYPE_BETA_ROUTE_DISCLOSURE
  )
}
