import test from "node:test"
import assert from "node:assert/strict"
import { loadHistory, saveSnapshot, getLastComparableSnapshot, type ResultSnapshot } from "@/lib/result-history"
import { markProfileSaveIntent } from "@/lib/profile-save-intent"
import { saveProfileStore, emptyProfileStore } from "@/lib/profile-store"

const snapshot: ResultSnapshot = {
  timestamp: 1000, schemaVersion: 4, familyKey: "realist", neighborKey: "institutionalist",
  strategyModifier: "Restrainer", normativeModifier: "Pluralist",
  dimensionScores: { securityCompetition: 4, institutions: 4, domesticFilters: 4, normsIdentity: 4, politicalEconomy: 4, restraint: 4, orderJustice: 4 },
  locale: "en", localeCopyVersion: 1,
}

test("persistence helpers explicitly report successful, full, and unavailable storage", () => {
  const previous = Object.getOwnPropertyDescriptor(globalThis, "window")
  const values = new Map<string, string>()
  const storage = {
    getItem: (key: string) => values.get(key) ?? null,
    setItem: (key: string, value: string) => { values.set(key, value) },
  }
  try {
    Object.defineProperty(globalThis, "window", { configurable: true, value: { localStorage: storage, sessionStorage: storage } })
    assert.equal(saveSnapshot(snapshot), true)
    assert.deepEqual(loadHistory(), [snapshot])
    // Same locale/copy and scores cannot establish missing form/scoring provenance.
    assert.equal(getLastComparableSnapshot(snapshot), null)
    assert.equal(saveProfileStore(emptyProfileStore()), true)
    assert.equal(markProfileSaveIntent("foundation", "owned"), true)
    storage.setItem = () => { throw new Error("quota") }
    assert.equal(saveSnapshot(snapshot), false)
    assert.equal(saveProfileStore(emptyProfileStore()), false)
    assert.equal(markProfileSaveIntent("foundation", "owned"), false)
    Object.defineProperty(globalThis, "window", { configurable: true, value: {
      get localStorage() { throw new Error("blocked") },
      get sessionStorage() { throw new Error("blocked") },
    } })
    assert.equal(saveSnapshot(snapshot), false)
    assert.equal(saveProfileStore(emptyProfileStore()), false)
    assert.equal(markProfileSaveIntent("foundation", "owned"), false)
  } finally {
    if (previous) Object.defineProperty(globalThis, "window", previous)
    else delete (globalThis as { window?: unknown }).window
  }
})
