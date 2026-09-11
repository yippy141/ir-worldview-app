export type ObservedRequest = { url: string; method: string; body: string | null }
const footerDocuments = new Set(["/privacy", "/method", "/feedback"])
/** The shared footer may fetch only these static RSC documents, never answer data. */
export function isAllowedFooterPrefetch(request: ObservedRequest, pageOrigin: string): boolean {
  try {
    const url = new URL(request.url)
    const query = [...url.searchParams.entries()]
    return url.origin === new URL(pageOrigin).origin && !url.username && !url.password && !url.hash &&
      request.method === "GET" && (request.body === null || request.body === "") &&
      footerDocuments.has(url.pathname) && query.length === 1 && query[0][0] === "_rsc" &&
      /^[A-Za-z0-9_-]+$/.test(query[0][1])
  } catch { return false }
}
