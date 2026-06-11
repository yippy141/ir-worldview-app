export function encodeUrlPayload(value: unknown): string {
  return bytesToBase64(new TextEncoder().encode(JSON.stringify(value)))
    .replace(/\+/g, "-")
    .replace(/\//g, "_")
    .replace(/=+$/g, "")
}

export function decodeUrlPayload(encoded: string): unknown | null {
  try {
    const normalized = encoded.replace(/-/g, "+").replace(/_/g, "/")
    const paddingLength = (4 - (normalized.length % 4)) % 4
    const json = new TextDecoder().decode(
      base64ToBytes(`${normalized}${"=".repeat(paddingLength)}`),
    )
    return JSON.parse(json)
  } catch {
    return null
  }
}

function bytesToBase64(bytes: Uint8Array) {
  let binary = ""
  for (let index = 0; index < bytes.length; index += 0x8000) {
    binary += String.fromCharCode(...bytes.subarray(index, index + 0x8000))
  }
  return btoa(binary)
}

function base64ToBytes(base64: string) {
  const binary = atob(base64)
  const bytes = new Uint8Array(binary.length)
  for (let index = 0; index < binary.length; index += 1) {
    bytes[index] = binary.charCodeAt(index)
  }
  return bytes
}
