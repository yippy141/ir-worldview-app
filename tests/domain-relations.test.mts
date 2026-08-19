import test from "node:test"
import assert from "node:assert/strict"
import { readFileSync } from "node:fs"
import {
  DEFAULT_DOMAIN_RELATION_POLICY,
  DEFAULT_DOMAIN_RELATION_READ,
  DOMAIN_RELATIONS,
  DOMAIN_RELATION_STATUSES,
  getPublishedDomainBridges,
  isDomainBridgePubliclyEligible,
  resolveDomainRelationRead,
  type DomainBridgeDefinition,
} from "@/lib/modules/authoring-contract"
import { validateDomainModuleManifest } from "@/lib/modules/authoring-validation"
import {
  securityModuleManifest,
  technologyModuleManifest,
} from "@/lib/modules/manifests"

function reviewedBridge(): DomainBridgeDefinition<"security", "activism"> {
  return {
    id: "security.activism-restraint.v1",
    moduleSlug: "security",
    moduleAxis: "activism",
    foundationDimension: "restraint",
    relation: "pulls-against",
    rationale:
      "The high activism pole and high restraint pole express different authored decision logics in this reviewed comparison.",
    direction: {
      modulePole: "high",
      foundationPole: "high",
      semantics:
        "Read the named poles as a categorical tension; do not subtract or compare their scores.",
    },
    status: "expert-reviewed",
    contentVersion: 1,
    sourceIds: ["security-v4-source-ledger"],
    reviewIds: ["security-v4-contract"],
    publication: "public",
  }
}

function selectorFor(bridge: DomainBridgeDefinition<"security", "activism">) {
  return {
    id: bridge.id,
    contentVersion: bridge.contentVersion,
    moduleAxis: bridge.moduleAxis,
    ...(bridge.foundationDimension
      ? { foundationDimension: bridge.foundationDimension }
      : {}),
  }
}

test("relation vocabulary and default contract are exact", () => {
  assert.deepEqual(DOMAIN_RELATIONS, [
    "reinforces",
    "qualifies",
    "pulls-against",
    "not-comparable",
  ])
  assert.deepEqual(DOMAIN_RELATION_STATUSES, [
    "authored",
    "expert-reviewed",
    "pilot-supported",
  ])
  assert.deepEqual(DEFAULT_DOMAIN_RELATION_POLICY, {
    defaultRelation: "not-comparable",
    defaultRead: "separate-domain-read",
    rawScoreComparison: "forbidden",
    masterScore: "forbidden",
    publicRelations: "explicit-reviewed-bridge-only",
  })
  assert.deepEqual(DEFAULT_DOMAIN_RELATION_READ, {
    kind: "separate-domain-read",
    relation: "not-comparable",
    numericBridge: "none",
    masterScore: "none",
  })
})

test("Security and Technology default to separate domain reads with no public bridge", () => {
  for (const manifest of [securityModuleManifest, technologyModuleManifest]) {
    assert.deepEqual(getPublishedDomainBridges(manifest), [])
    assert.deepEqual(
      resolveDomainRelationRead(manifest, {
        id: "missing-bridge.v1",
        contentVersion: 1,
        moduleAxis: manifest.axes[0].key,
      }),
      DEFAULT_DOMAIN_RELATION_READ,
    )
  }
})

test("only an explicit reviewed bridge can become public", () => {
  const bridge = reviewedBridge()
  const manifest = {
    ...securityModuleManifest,
    bridges: [bridge],
  }
  assert.equal(isDomainBridgePubliclyEligible(manifest, bridge), true)
  assert.deepEqual(validateDomainModuleManifest(manifest), {
    ok: true,
    issues: [],
  })
  const read = resolveDomainRelationRead(manifest, selectorFor(bridge))
  assert.equal(read.kind, "reviewed-bridge")
  assert.equal(read.relation, "pulls-against")
  assert.equal(read.numericBridge, "none")
  assert.equal(read.masterScore, "none")

  const authored = {
    ...bridge,
    status: "authored" as const,
    publication: "internal" as const,
  }
  const authoredManifest = { ...securityModuleManifest, bridges: [authored] }
  assert.equal(isDomainBridgePubliclyEligible(authoredManifest, authored), false)
  assert.deepEqual(
    resolveDomainRelationRead(authoredManifest, selectorFor(authored)),
    DEFAULT_DOMAIN_RELATION_READ,
  )
})

test("public resolution revalidates bridge structure and manifest references", () => {
  const bridge = reviewedBridge()
  const invalidRecords = [
    {
      ...bridge,
      foundationDimension: undefined,
      direction: {
        modulePole: "high" as const,
        semantics: "A comparative relation is missing its Foundation context.",
      },
    },
    {
      ...bridge,
      sourceIds: ["missing-evidence-hook"],
    },
    {
      ...bridge,
      reviewIds: ["missing-review-hook"],
    },
    {
      ...bridge,
      rawScore: 6.2,
    },
  ]

  for (const invalid of invalidRecords) {
    const manifest = { ...securityModuleManifest, bridges: [invalid] }
    assert.equal(isDomainBridgePubliclyEligible(manifest, invalid), false)
    assert.deepEqual(
      resolveDomainRelationRead(manifest, selectorFor(invalid)),
      DEFAULT_DOMAIN_RELATION_READ,
    )
  }

  const templateManifest = {
    ...securityModuleManifest,
    releaseState: "template" as const,
    bridges: [bridge],
  }
  assert.equal(
    isDomainBridgePubliclyEligible(templateManifest, bridge),
    false,
  )
  assert.deepEqual(
    resolveDomainRelationRead(templateManifest, selectorFor(bridge)),
    DEFAULT_DOMAIN_RELATION_READ,
  )
})

test("public resolution selects one exact bridge identity and content context", () => {
  const restraintBridge = reviewedBridge()
  const institutionsBridge: DomainBridgeDefinition<"security", "activism"> = {
    ...restraintBridge,
    id: "security.activism-institutions.v1",
    foundationDimension: "institutions",
    relation: "qualifies",
    rationale:
      "The reviewed activism pole qualifies the named institutions pole without comparing raw values.",
  }
  const manifest = {
    ...securityModuleManifest,
    bridges: [restraintBridge, institutionsBridge],
  }

  assert.deepEqual(validateDomainModuleManifest(manifest), { ok: true, issues: [] })
  assert.deepEqual(getPublishedDomainBridges(manifest), [
    restraintBridge,
    institutionsBridge,
  ])
  assert.equal(
    resolveDomainRelationRead(manifest, selectorFor(restraintBridge)).relation,
    "pulls-against",
  )
  assert.equal(
    resolveDomainRelationRead(manifest, selectorFor(institutionsBridge)).relation,
    "qualifies",
  )

  for (const selector of [
    { ...selectorFor(restraintBridge), id: "missing-bridge.v1" },
    { ...selectorFor(restraintBridge), contentVersion: 2 },
    { ...selectorFor(restraintBridge), foundationDimension: "institutions" as const },
    { ...selectorFor(restraintBridge), rawScore: 7 },
  ]) {
    assert.deepEqual(
      resolveDomainRelationRead(manifest, selector),
      DEFAULT_DOMAIN_RELATION_READ,
    )
  }
})

test("validator rejects unreviewed publication, missing IDs, and numeric bridge fields", () => {
  const bridge = reviewedBridge()
  const unsafe = {
    ...bridge,
    status: "authored",
    sourceIds: [],
    reviewIds: [],
    rawScore: 6.2,
    masterScore: 5.8,
    direction: {
      ...bridge.direction,
      threshold: 4,
    },
  }
  const result = validateDomainModuleManifest({
    ...securityModuleManifest,
    bridges: [unsafe],
  })
  assert.equal(result.ok, false)
  if (result.ok) return
  assert.equal(
    result.issues.some((issue) => issue.code === "field.unexpected"),
    true,
  )
  assert.equal(
    result.issues.some((issue) => issue.code === "bridge.review-required"),
    true,
  )
  assert.equal(
    result.issues.some((issue) => issue.code === "bridge.publication-blocked"),
    true,
  )
})

test("comparative relations require an explicit Foundation dimension and direction semantics", () => {
  const bridge = reviewedBridge()
  const invalid = {
    ...bridge,
    foundationDimension: undefined,
    direction: {
      modulePole: "high",
      semantics: "No Foundation pole was authored.",
    },
  }
  const result = validateDomainModuleManifest({
    ...securityModuleManifest,
    bridges: [invalid],
  })
  assert.equal(result.ok, false)
  assert.equal(
    !result.ok &&
      result.issues.some(
        (issue) => issue.code === "bridge.foundation-dimension",
      ),
    true,
  )
})

test("AI results do not publish automatic Foundation-family synthesis", () => {
  const source = readFileSync(
    new URL("../components/ai/ai-project-bridge.tsx", import.meta.url),
    "utf8",
  )
  assert.match(source, /DEFAULT_DOMAIN_RELATION_READ/)
  assert.match(source, /No explicit reviewed bridge/)
  assert.match(source, /does not combine them into a master score/)
  assert.doesNotMatch(source, /getCrossModuleSynthesis/)
  assert.doesNotMatch(source, /likelyAlignment|likelyTensions/)
})
