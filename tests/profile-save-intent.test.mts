import test from "node:test"
import assert from "node:assert/strict"
import {
  consumeProfileSaveIntent,
  markProfileSaveIntent,
  PROFILE_SAVE_INTENT_KEY,
} from "@/lib/profile-save-intent"

class MemorySessionStorage {
  private values = new Map<string, string>()

  getItem(key: string) {
    return this.values.get(key) ?? null
  }

  setItem(key: string, value: string) {
    this.values.set(key, value)
  }

  removeItem(key: string) {
    this.values.delete(key)
  }
}

test("result save intents are identity-bound and consumed once", () => {
  const previousWindow = Object.getOwnPropertyDescriptor(globalThis, "window")
  Object.defineProperty(globalThis, "window", {
    configurable: true,
    value: { sessionStorage: new MemorySessionStorage() },
  })

  try {
    markProfileSaveIntent("foundation", "local-result", {
      mode: "analyst",
      localEvidenceId: "evidence-completion-1",
    })

    assert.equal(consumeProfileSaveIntent("foundation", "shared-result"), null)
    assert.deepEqual(consumeProfileSaveIntent("foundation", "local-result"), {
      identity: "local-result",
      mode: "analyst",
      localEvidenceId: "evidence-completion-1",
    })
    assert.equal(consumeProfileSaveIntent("foundation", "local-result"), null)
  } finally {
    if (previousWindow) {
      Object.defineProperty(globalThis, "window", previousWindow)
    } else {
      delete (globalThis as { window?: unknown }).window
    }
  }
})

test("blocked intent removal uses an empty marker, or fails closed if all writes fail", () => {
  const previousWindow = Object.getOwnPropertyDescriptor(globalThis, "window")
  const storage = new MemorySessionStorage()
  Object.defineProperty(globalThis, "window", { configurable: true, value: { sessionStorage: storage } })
  try {
    markProfileSaveIntent("foundation", "removal-blocked")
    storage.removeItem = () => { throw new Error("blocked") }
    assert.deepEqual(consumeProfileSaveIntent("foundation", "removal-blocked"), { identity: "removal-blocked" })
    assert.equal(storage.getItem(PROFILE_SAVE_INTENT_KEY), "{}")
    assert.equal(consumeProfileSaveIntent("foundation", "removal-blocked"), null)

    markProfileSaveIntent("foundation", "all-writes-blocked")
    storage.setItem = () => { throw new Error("blocked") }
    let failures = 0
    for (let i = 0; i < 2; i++) {
      assert.equal(consumeProfileSaveIntent("foundation", "all-writes-blocked", () => { failures++ }), null)
    }
    assert.equal(failures, 2)
  } finally {
    if (previousWindow) Object.defineProperty(globalThis, "window", previousWindow)
    else delete (globalThis as { window?: unknown }).window
  }
})

test("unavailable session storage keeps only a one-use, identity-bound memory intent", () => {
  const previousWindow = Object.getOwnPropertyDescriptor(globalThis, "window")
  Object.defineProperty(globalThis, "window", { configurable: true, value: {
    get sessionStorage() { throw new Error("blocked") },
  } })
  try {
    assert.equal(markProfileSaveIntent("foundation", "memory-only", { mode: "standard" }), false)
    assert.equal(consumeProfileSaveIntent("foundation", "shared-result"), null)
    assert.deepEqual(consumeProfileSaveIntent("foundation", "memory-only"), { identity: "memory-only", mode: "standard" })
    assert.equal(consumeProfileSaveIntent("foundation", "memory-only"), null)
  } finally {
    if (previousWindow) Object.defineProperty(globalThis, "window", previousWindow)
    else delete (globalThis as { window?: unknown }).window
  }
})
