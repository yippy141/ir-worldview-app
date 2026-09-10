import test from "node:test"
import assert from "node:assert/strict"
import { getPublishedDecision } from "@/lib/decision-exercises/catalog"
import { accessPresentation, accessComparisonRows, enclaveRights } from "@/lib/decision-exercises/access-presentation"

const episode = getPublishedDecision("who-gets-access")!
test("only proposed or selected enclave access is governed by the changed admission authority", () => {
  for (const id of ["", ...episode.options.map(option => option.id), "defer"]) {
    const first = accessPresentation(episode, id, false)
    const second = accessPresentation(episode, id, true)
    if (id === "" || id === "enclave") {
      assert.equal(first.authority, "independent")
      assert.equal(second.authority, "developer")
      assert.equal(first.label, second.label)
    } else {
      assert.deepEqual(first, second)
      assert.equal(first.admission, null)
    }
  }
})
test("the exhibit covers each registered arrangement and does not invent enclave revocation terms", () => {
  const rows = accessComparisonRows(episode)
  assert.deepEqual(rows.map(row => row.label), episode.options.map(option => option.label))
  const enclave = rows.find(row => row.id === "enclave")!
  assert.equal(enclave.observation, enclaveRights.observation)
  assert.equal(enclave.publication, enclaveRights.publication)
  assert.match(enclave.revocation, /not specified/)
  assert.match(rows.find(row => row.id === "weights")!.revocation, /cannot recall/)
})
