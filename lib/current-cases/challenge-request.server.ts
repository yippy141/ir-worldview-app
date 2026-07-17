const MAX_CHALLENGE_REQUEST_BYTES = 2048

export type ChallengeRequestJsonResult =
  | { ok: true; value: unknown }
  | { ok: false; status: 400 | 413; error: string }

export async function readChallengeRequestJson(
  request: Request,
): Promise<ChallengeRequestJsonResult> {
  const declaredLength = Number(request.headers.get("content-length") ?? 0)
  if (Number.isFinite(declaredLength) && declaredLength > MAX_CHALLENGE_REQUEST_BYTES) {
    return { ok: false, status: 413, error: "Request is too large." }
  }

  let raw = ""
  try {
    raw = await request.text()
  } catch {
    return { ok: false, status: 400, error: "Request could not be read." }
  }
  if (Buffer.byteLength(raw, "utf8") > MAX_CHALLENGE_REQUEST_BYTES) {
    return { ok: false, status: 413, error: "Request is too large." }
  }

  try {
    return { ok: true, value: JSON.parse(raw) as unknown }
  } catch {
    return { ok: false, status: 400, error: "Request must be valid JSON." }
  }
}

export function hasExactKeys(value: unknown, expected: readonly string[]) {
  if (typeof value !== "object" || value === null || Array.isArray(value)) return false
  const keys = Object.keys(value).sort()
  const expectedKeys = [...expected].sort()
  return (
    keys.length === expectedKeys.length &&
    keys.every((key, index) => key === expectedKeys[index])
  )
}
