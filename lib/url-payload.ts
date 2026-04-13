export function encodeUrlPayload(value: unknown): string {
  return btoa(JSON.stringify(value))
    .replace(/\+/g, "-")
    .replace(/\//g, "_")
    .replace(/=+$/g, "")
}

export function decodeUrlPayload(encoded: string): unknown | null {
  try {
    const normalized = encoded.replace(/-/g, "+").replace(/_/g, "/")
    const paddingLength = (4 - (normalized.length % 4)) % 4
    const json = atob(`${normalized}${"=".repeat(paddingLength)}`)
    return JSON.parse(json)
  } catch {
    return null
  }
}
