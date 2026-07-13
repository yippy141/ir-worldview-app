import test from "node:test"
import assert from "node:assert/strict"
import {
  consumeProfileSaveIntent,
  markProfileSaveIntent,
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
    markProfileSaveIntent("foundation", "local-result", { mode: "analyst" })

    assert.equal(consumeProfileSaveIntent("foundation", "shared-result"), null)
    assert.deepEqual(consumeProfileSaveIntent("foundation", "local-result"), {
      identity: "local-result",
      mode: "analyst",
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
