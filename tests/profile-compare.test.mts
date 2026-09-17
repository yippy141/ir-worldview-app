import test from "node:test"
import assert from "node:assert/strict"
import { buildEvidenceComparison } from "@/lib/profile-compare"
import { evidenceFromToken, compareProvenance, type ResultEvidence } from "@/lib/connected/evidence"
import { foundationToken, aiFixture, moduleToken } from "@/tests/connected-fixtures"
import { parseComparisonInput } from "@/lib/connected/input"
const f = (values?: number[]) => evidenceFromToken("foundation", foundationToken(values))!
const compare = (l: ResultEvidence, r: ResultEvidence) => buildEvidenceComparison({ [l.domain]: l }, { [r.domain]: r })[0]
test("identical, midpoint and tiny boundary pairs never become disagreement", () => {
  for (const values of [undefined, [4,4,4,4,4,4,4]]) {
    const result = compare(f(values), f(values))
    assert.equal(result.state, "identical"); assert.equal(result.largest.length, 0)
    assert.match(result.summary, /supplied scores match/)
    assert.doesNotMatch(result.summary, /stable trait|probably|split on/)
  }
  const small = compare(f([3.99,4,4,4,4,4,4]), f([4.01,4,4,4,4,4,4]))
  assert.equal(small.state, "small"); assert.match(small.rows[0].reading, /does not establish opposed/)
})
test("same-side strength, opposite positions, largest ties and swap symmetry", () => {
  const left = f([6,2,4,4,4,4,4]), right = f([5,3,4,4,4,4,4])
  const forward = compare(left, right), backward = compare(right, left)
  assert.equal(forward.largest.length, 2)
  assert.equal(forward.summary, backward.summary)
  forward.rows.forEach((row, i) => { assert.equal(row.diff + backward.rows[i].diff, 0); assert.equal(row.left, backward.rows[i].right); assert.equal(row.reading, backward.rows[i].reading) })
  assert.match(forward.rows[0].reading, /same direction/)
  assert.match(compare(left, f([2,6,4,4,4,4,4])).rows[0].reading, /different sides/)
})
test("same coordinates do not authorize subtraction across provenance or unknowns", () => {
  const left = f()
  for (const key of ["bank", "scorer", "form", "language", "copy"] as const) {
    const other = structuredClone(left)
    other.provenance = { ...other.provenance, [key]: typeof other.provenance[key] === "number" ? 99 : "different" }
    assert.equal(compareProvenance(left, other).status, "incompatible")
    assert.equal(compare(left, other).rows.length, 0)
    other.provenance[key] = null
    assert.equal(compareProvenance(left, other).status, "unknown")
  }
  assert.equal(compareProvenance(left, undefined).status, "missing")
})
test("compatible AI-only and module-only comparisons; unknown AI stays independent", () => {
  const ai = aiFixture().token
  const known = evidenceFromToken("ai", ai, { language: "en", copy: 1, form: "standard", declared: true })!
  assert.equal(compare(known, known).state, "identical")
  const unknown = evidenceFromToken("ai", ai)!
  assert.equal(compare(unknown, unknown).comparability.status, "unknown")
  for (const slug of ["security", "technology"] as const) {
    const left = evidenceFromToken(slug, moduleToken(slug), { language: "en", copy: 1 })!
    const right = evidenceFromToken(slug, moduleToken(slug, 1), { language: "en", copy: 1 })!
    assert.equal(compare(left, right).comparability.status, "comparable")
    assert.ok(compare(left, right).differentChoices.length > 0)
    assert.equal(compareProvenance(left, evidenceFromToken(slug, moduleToken(slug, 0, "analyst"), { language: "en", copy: 1 })!).status, "incompatible")
  }
})
test("approved parsing is bounded, rejects foreign origins and never accepts HTML or arbitrary URLs", () => {
  const token = foundationToken()
  assert.equal(parseComparisonInput(`/results/${token}`).ok, true)
  assert.equal(parseComparisonInput(`https://irworldview.jhyip.com/results/${token}`).ok, true)
  assert.equal(parseComparisonInput(`https://foreign.example/results/${token}`).ok, false)
  for (const raw of ["", "a".repeat(50001), "<script>alert(1)</script>", `https://irworldview.jhyip.com/results/${token}?redirect=1`, `https://evil@irworldview.jhyip.com/results/${token}`, "javascript:alert(1)"]) assert.equal(parseComparisonInput(raw).ok, false)
})
test("declared details fill missing exposure without overriding issued provenance", async () => {
  const { withDeclaredExposure, evidenceFromProfile } = await import("@/lib/connected/evidence")
  const { syntheticProfile } = await import("@/tests/connected-fixtures")
  const { encodeProfileSharePayload, buildCompatibleProfileSharePayload } = await import("@/lib/profile-share")
  const profile = syntheticProfile().profile
  const bundle = evidenceFromProfile(profile)
  const augmented = withDeclaredExposure(bundle, { form: "standard", language: "en", copy: 1 })
  assert.equal(augmented.foundation!.provenance.copy, bundle.foundation!.provenance.copy)
  assert.equal(augmented.ai!.provenance.form, "standard")
  const share = buildCompatibleProfileSharePayload(profile)
  assert.ok(share)
  const link = encodeProfileSharePayload(share)
  const parsed = parseComparisonInput(`/zh/profile/share/${link}`, undefined, { form: "standard", language: "en", copy: 1 })
  assert.ok(parsed.ok)
  assert.equal(parsed.evidence.ai!.provenance.form, "standard")
})
test("scale meanings and discussion follow actual largest gaps, retaining ties", () => {
  const left = f([6,2,4,4,4,4,4]), right = f([2,6,4,4,4,4,4])
  const result = compare(left, right)
  assert.deepEqual(result.rows[0].poles, { low: "Reassurance", high: "Rivalry" })
  assert.match(result.prompt, /change a rivalry/)
  assert.match(result.prompt, /institutional limit/)
  assert.match(compareProvenance(left, undefined).reason, /neither agreement nor difference/)
  const ai = evidenceFromToken("ai", aiFixture().token, { form: "standard", language: "en", copy: 1 })!
  const other = structuredClone(ai); other.scores.riskHorizon = ai.scores.riskHorizon < 4 ? 7 : 1
  assert.match(compare(ai, other).prompt, /frontier hazard/)
  assert.doesNotMatch(compare(ai, other).prompt, /downloadable/)
})
