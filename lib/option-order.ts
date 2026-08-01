export type PinnedOptionPosition = "last"

type OrderableOption = {
  id: string
  pinned?: PinnedOptionPosition
}

/**
 * Creates a draft-scoped seed. It is stored only with the local in-progress
 * draft and is replaced when the respondent starts over.
 */
export function createOptionOrderSeed(): string {
  if (typeof globalThis.crypto?.randomUUID === "function") {
    return globalThis.crypto.randomUUID()
  }

  return `${Date.now().toString(36)}-${Math.random().toString(36).slice(2)}`
}

/**
 * Returns a deterministic presentation order for one question without
 * mutating the canonical schema. Pinned options are excluded from the shuffle.
 */
export function getSeededOptionOrder<T extends OrderableOption>(
  options: readonly T[],
  orderSeed: string,
  questionId: string,
): T[] {
  const shuffled = options.filter((option) => option.pinned !== "last")
  const pinnedLast = options.filter((option) => option.pinned === "last")
  const rng = makeSeededRng(hashString(`${orderSeed}\u0000${questionId}`))

  for (let index = shuffled.length - 1; index > 0; index -= 1) {
    const swapIndex = Math.floor(rng() * (index + 1))
    ;[shuffled[index], shuffled[swapIndex]] = [shuffled[swapIndex], shuffled[index]]
  }

  return [...shuffled, ...pinnedLast]
}

function hashString(value: string): number {
  let hash = 2166136261

  for (let index = 0; index < value.length; index += 1) {
    hash ^= value.charCodeAt(index)
    hash = Math.imul(hash, 16777619)
  }

  return hash >>> 0
}

function makeSeededRng(seed: number) {
  let state = seed >>> 0

  return () => {
    state += 0x6d2b79f5
    let value = state
    value = Math.imul(value ^ (value >>> 15), value | 1)
    value ^= value + Math.imul(value ^ (value >>> 7), value | 61)
    return ((value ^ (value >>> 14)) >>> 0) / 0x100000000
  }
}
