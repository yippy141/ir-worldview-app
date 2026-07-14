import test from "node:test"
import assert from "node:assert/strict"
import { trajectories, trajectoriesUpdated } from "@/lib/futures/trajectories"

test("Twelve Trajectories stays twelve — the AI landing states the count by name", () => {
  assert.equal(trajectories.length, 12)
})

test("trajectories carry an updated stamp for the landing meta line", () => {
  assert.match(trajectoriesUpdated, /^\d{4}-\d{2}$/)
})
