import {
  createCipheriv,
  createDecipheriv,
  createSecretKey,
  randomBytes,
} from "node:crypto"
import {
  CURRENT_CASE_CHALLENGE_LIFETIME_SECONDS,
  CURRENT_CASE_CHALLENGE_SCHEMA_VERSION,
  type CurrentCaseChallengeClaims,
  type CurrentCaseChallengeFailureReason,
} from "@/lib/current-cases/challenge"
import {
  isCurrentCaseConfidence,
  type CurrentCaseConfidence,
} from "@/lib/current-cases/types"

const TOKEN_PREFIX = "cc1"
const TOKEN_AAD = Buffer.from("ir-worldview:current-case-challenge:v1", "utf8")
const IV_BYTES = 12
const AUTH_TAG_BYTES = 16
const MAX_TOKEN_LENGTH = 2048
const CLAIM_KEYS = [
  "schemaVersion",
  "caseId",
  "inviterFinalOptionId",
  "inviterConfidence",
  "issuedAt",
  "expiresAt",
  "nonce",
] as const

type ChallengeTokenOptions = {
  secret?: string
  now?: Date
}

export type CreateCurrentCaseChallengeResult =
  | { ok: true; token: string; claims: CurrentCaseChallengeClaims }
  | { ok: false; reason: "missing-secret" }

export type ReadCurrentCaseChallengeResult =
  | { ok: true; claims: CurrentCaseChallengeClaims }
  | { ok: false; reason: CurrentCaseChallengeFailureReason }

export function createCurrentCaseChallengeToken(
  input: {
    caseId: string
    inviterFinalOptionId: string
    inviterConfidence: CurrentCaseConfidence
  },
  options: ChallengeTokenOptions = {},
): CreateCurrentCaseChallengeResult {
  const key = readEncryptionKey(options.secret)
  if (!key) return { ok: false, reason: "missing-secret" }

  const issuedAt = toEpochSeconds(options.now ?? new Date())
  const claims: CurrentCaseChallengeClaims = {
    schemaVersion: CURRENT_CASE_CHALLENGE_SCHEMA_VERSION,
    caseId: input.caseId,
    inviterFinalOptionId: input.inviterFinalOptionId,
    inviterConfidence: input.inviterConfidence,
    issuedAt,
    expiresAt: issuedAt + CURRENT_CASE_CHALLENGE_LIFETIME_SECONDS,
    nonce: randomBytes(16).toString("base64url"),
  }
  const iv = randomBytes(IV_BYTES)
  const cipher = createCipheriv("aes-256-gcm", key, iv)
  cipher.setAAD(TOKEN_AAD)
  const ciphertext = Buffer.concat([
    cipher.update(JSON.stringify(claims), "utf8"),
    cipher.final(),
  ])
  const authTag = cipher.getAuthTag()

  return {
    ok: true,
    token: [
      TOKEN_PREFIX,
      iv.toString("base64url"),
      ciphertext.toString("base64url"),
      authTag.toString("base64url"),
    ].join("."),
    claims,
  }
}

export function readCurrentCaseChallengeToken(
  token: string,
  options: ChallengeTokenOptions & { expectedCaseId?: string } = {},
): ReadCurrentCaseChallengeResult {
  const key = readEncryptionKey(options.secret)
  if (!key) return { ok: false, reason: "missing-secret" }
  if (!token || token.length > MAX_TOKEN_LENGTH) {
    return { ok: false, reason: "malformed" }
  }

  const parts = token.split(".")
  if (parts.length !== 4 || parts[0] !== TOKEN_PREFIX) {
    return { ok: false, reason: "malformed" }
  }

  const iv = decodeBase64Url(parts[1])
  const ciphertext = decodeBase64Url(parts[2])
  const authTag = decodeBase64Url(parts[3])
  if (
    !iv ||
    !ciphertext ||
    !authTag ||
    iv.length !== IV_BYTES ||
    ciphertext.length === 0 ||
    authTag.length !== AUTH_TAG_BYTES
  ) {
    return { ok: false, reason: "malformed" }
  }

  let parsed: unknown
  try {
    const decipher = createDecipheriv("aes-256-gcm", key, iv)
    decipher.setAAD(TOKEN_AAD)
    decipher.setAuthTag(authTag)
    const plaintext = Buffer.concat([
      decipher.update(ciphertext),
      decipher.final(),
    ]).toString("utf8")
    parsed = JSON.parse(plaintext) as unknown
  } catch {
    return { ok: false, reason: "invalid" }
  }

  const claims = parseClaims(parsed)
  if (!claims) return { ok: false, reason: "invalid" }
  if (options.expectedCaseId && claims.caseId !== options.expectedCaseId) {
    return { ok: false, reason: "wrong-case" }
  }
  if (toEpochSeconds(options.now ?? new Date()) >= claims.expiresAt) {
    return { ok: false, reason: "expired" }
  }

  return { ok: true, claims }
}

function readEncryptionKey(secretOverride?: string) {
  const secret = secretOverride ?? process.env.CURRENT_CASE_CHALLENGE_SECRET
  if (!secret || !/^[A-Za-z0-9_-]{43}$/.test(secret)) return null

  const decoded = decodeBase64Url(secret)
  if (!decoded || decoded.length !== 32) return null
  return createSecretKey(decoded)
}

function decodeBase64Url(value: string) {
  if (!value || !/^[A-Za-z0-9_-]+$/.test(value)) return null
  try {
    const decoded = Buffer.from(value, "base64url")
    return decoded.toString("base64url") === value ? decoded : null
  } catch {
    return null
  }
}

function parseClaims(value: unknown): CurrentCaseChallengeClaims | null {
  if (!isRecord(value)) return null
  const keys = Object.keys(value).sort()
  const expectedKeys = [...CLAIM_KEYS].sort()
  if (
    keys.length !== expectedKeys.length ||
    keys.some((key, index) => key !== expectedKeys[index])
  ) {
    return null
  }
  if (
    value.schemaVersion !== CURRENT_CASE_CHALLENGE_SCHEMA_VERSION ||
    !isBoundedString(value.caseId, 128) ||
    !isBoundedString(value.inviterFinalOptionId, 128) ||
    !isCurrentCaseConfidence(value.inviterConfidence) ||
    !isEpochSeconds(value.issuedAt) ||
    !isEpochSeconds(value.expiresAt) ||
    value.expiresAt - value.issuedAt !== CURRENT_CASE_CHALLENGE_LIFETIME_SECONDS ||
    !isNonce(value.nonce)
  ) {
    return null
  }

  return {
    schemaVersion: value.schemaVersion,
    caseId: value.caseId,
    inviterFinalOptionId: value.inviterFinalOptionId,
    inviterConfidence: value.inviterConfidence,
    issuedAt: value.issuedAt,
    expiresAt: value.expiresAt,
    nonce: value.nonce,
  }
}

function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === "object" && value !== null && !Array.isArray(value)
}

function isBoundedString(value: unknown, maximum: number): value is string {
  return typeof value === "string" && value.length > 0 && value.length <= maximum
}

function isEpochSeconds(value: unknown): value is number {
  return typeof value === "number" && Number.isInteger(value) && value > 0
}

function isNonce(value: unknown): value is string {
  return (
    typeof value === "string" &&
    value.length === 22 &&
    /^[A-Za-z0-9_-]+$/.test(value)
  )
}

function toEpochSeconds(value: Date) {
  return Math.floor(value.valueOf() / 1000)
}
