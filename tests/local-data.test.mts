import test from "node:test"
import assert from "node:assert/strict"
import {
  LOCAL_HISTORY_STORAGE_KEYS,
  SESSION_HISTORY_STORAGE_KEYS,
  clearLocalWorldviewHistory,
} from "@/lib/local-data"
import {
  ANALYTICS_OPT_OUT_STORAGE_KEY,
  TIER1_SUBMITTED_RESULTS_STORAGE_KEY,
} from "@/lib/storage-keys"

test("local history deletion covers every registered result and draft key", () => {
  const localRemoved: string[] = []
  const sessionRemoved: string[] = []

  const result = clearLocalWorldviewHistory(
    { removeItem: (key) => localRemoved.push(key) },
    { removeItem: (key) => sessionRemoved.push(key) },
  )

  assert.equal(localRemoved.includes(ANALYTICS_OPT_OUT_STORAGE_KEY), false)
  assert.equal(localRemoved.includes(TIER1_SUBMITTED_RESULTS_STORAGE_KEY), true)
  assert.deepEqual(localRemoved, [...LOCAL_HISTORY_STORAGE_KEYS])
  assert.deepEqual(sessionRemoved, [...SESSION_HISTORY_STORAGE_KEYS])
  assert.deepEqual(result, {
    removed: LOCAL_HISTORY_STORAGE_KEYS.length + SESSION_HISTORY_STORAGE_KEYS.length,
    failed: [],
  })
})

test("local history deletion reports blocked storage without hiding partial failure", () => {
  const result = clearLocalWorldviewHistory(
    {
      removeItem: (key) => {
        if (key === LOCAL_HISTORY_STORAGE_KEYS[0]) throw new Error("blocked")
      },
    },
    { removeItem: () => undefined },
  )

  assert.deepEqual(result.failed, [LOCAL_HISTORY_STORAGE_KEYS[0]])
  assert.equal(
    result.removed,
    LOCAL_HISTORY_STORAGE_KEYS.length + SESSION_HISTORY_STORAGE_KEYS.length - 1,
  )
})
