import assert from "node:assert/strict"
import { readFileSync } from "node:fs"
import test from "node:test"
import {
  DEFAULT_DOMAIN_RELATION_POLICY,
  DEFAULT_DOMAIN_RELATION_READ,
  DOMAIN_BRIDGE_AUTHORING_STATUSES,
  DOMAIN_BRIDGE_EVIDENCE_STATUSES,
  DOMAIN_BRIDGE_REVIEW_STATUSES,
  DOMAIN_RELATIONS,
  getPublishedDomainBridges,
  isDomainBridgePubliclyEligible,
  resolveDomainRelationRead,
  type DomainBridgeDefinition,
} from "@/lib/modules/authoring-contract"
import {
  computeManifestFingerprint,
  validateDomainModuleManifest,
} from "@/lib/modules/authoring-validation"
import {
  securityModuleManifest,
  technologyModuleManifest,
} from "@/lib/modules/manifests"

function holdDocumentBridge(): DomainBridgeDefinition<"security", "activism"> {
  return {
    id: "security.activism-restraint.v1",
    moduleSlug: "security",
    moduleAxis: "activism",
    foundationDimension: "restraint",
    relation: "pulls-against",
    rationale:
      "An internal proposal used only to prove that review labels and existing files cannot publish a bridge.",
    direction: {
      modulePole: "high",
      foundationPole: "high",
      semantics:
        "The authored poles would be compared categorically, never by subtracting raw scores.",
    },
    authoringStatus: "authored",
    reviewStatus: "expert-reviewed",
    evidenceStatus: "untested",
    publication: "internal",
    versionContext: {
      moduleManifestVersion: securityModuleManifest.versions.manifest,
      moduleQuestionBankVersion: securityModuleManifest.versions.questionBank,
      moduleScoringVersion: securityModuleManifest.versions.scoring,
      moduleResultCopyVersion: securityModuleManifest.versions.resultCopy,
      foundation: {
        semanticContractId: "foundation-v22-seven-dimension-semantics",
      },
      bridgeContentVersion: 1,
      reviewDueAt: "2026-11-21T00:00:00Z",
    },
    sourceIds: ["security-v4-source-ledger"],
    reviewIds: ["security-v4-contract"],
  }
}

function manifestWithHoldBridge(
  bridge: DomainBridgeDefinition<"security", "activism"> =
    holdDocumentBridge(),
) {
  const manifest = {
    ...securityModuleManifest,
    evidenceAuditHooks: {
      ...securityModuleManifest.evidenceAuditHooks,
      evidence: [
        ...securityModuleManifest.evidenceAuditHooks.evidence,
        {
          id: "security-v4-source-ledger",
          path: "docs/v23/security/V23_3_SECURITY_SOURCE_LEDGER.md",
        },
      ],
      reviews: [
        ...securityModuleManifest.evidenceAuditHooks.reviews,
        {
          id: "security-v4-contract",
          path: "docs/v23/security/V23_3_SECURITY_V4_CONTRACT.md",
        },
      ],
    },
    bridges: [bridge],
  }
  return {
    ...manifest,
    manifestFingerprint: computeManifestFingerprint(manifest),
  }
}

test("schema-v1 relation vocabulary preserves semantics but forbids publication", () => {
  assert.deepEqual(DOMAIN_RELATIONS, [
    "reinforces",
    "qualifies",
    "pulls-against",
    "not-comparable",
  ])
  assert.deepEqual(DOMAIN_BRIDGE_AUTHORING_STATUSES, ["draft", "authored"])
  assert.deepEqual(DOMAIN_BRIDGE_REVIEW_STATUSES, [
    "unreviewed",
    "expert-reviewed",
  ])
  assert.deepEqual(DOMAIN_BRIDGE_EVIDENCE_STATUSES, [
    "untested",
    "pilot-supported",
  ])
  assert.deepEqual(DEFAULT_DOMAIN_RELATION_POLICY, {
    defaultRelation: "not-comparable",
    defaultRead: "separate-domain-read",
    rawScoreComparison: "forbidden",
    masterScore: "forbidden",
    publicRelations: "forbidden-in-schema-v1",
  })
  assert.deepEqual(DEFAULT_DOMAIN_RELATION_READ, {
    kind: "separate-domain-read",
    relation: "not-comparable",
    numericBridge: "none",
    masterScore: "none",
  })
})

test("all current manifests keep an empty bridge catalog and separate reads", () => {
  for (const manifest of [securityModuleManifest, technologyModuleManifest]) {
    assert.deepEqual(manifest.bridges, [])
    assert.deepEqual(getPublishedDomainBridges(manifest), [])
    assert.deepEqual(
      resolveDomainRelationRead(manifest, {
        id: "missing-bridge.v1",
        bridgeContentVersion: 1,
        moduleAxis: manifest.axes[0].key,
      }),
      DEFAULT_DOMAIN_RELATION_READ,
    )
  }
})

test("an expert-reviewed bridge citing existing Security HOLD files is still non-public", () => {
  const bridge = holdDocumentBridge()
  const manifest = manifestWithHoldBridge(bridge)

  assert.match(
    readFileSync(
      new URL(
        "../docs/v23/security/V23_3_SECURITY_V4_CONTRACT.md",
        import.meta.url,
      ),
      "utf8",
    ),
    /HOLD for implementation/u,
  )
  assert.deepEqual(validateDomainModuleManifest(manifest), {
    ok: true,
    issues: [],
  })
  assert.equal(isDomainBridgePubliclyEligible(manifest, bridge), false)
  assert.deepEqual(getPublishedDomainBridges(manifest), [])
  assert.deepEqual(
    resolveDomainRelationRead(manifest, {
      id: bridge.id,
      bridgeContentVersion: bridge.versionContext.bridgeContentVersion,
      moduleAxis: bridge.moduleAxis,
      foundationDimension: bridge.foundationDimension,
    }),
    DEFAULT_DOMAIN_RELATION_READ,
  )
})

test("runtime-cast public bridges remain invalid and non-public", () => {
  const bridge = {
    ...holdDocumentBridge(),
    publication: "public",
  }
  const manifest = manifestWithHoldBridge(
    bridge as unknown as DomainBridgeDefinition<"security", "activism">,
  )
  const result = validateDomainModuleManifest(manifest)
  assert.equal(result.ok, false)
  assert.equal(
    !result.ok &&
      result.issues.some(
        (issue) => issue.code === "bridge.publication-forbidden",
      ),
    true,
  )
  assert.deepEqual(getPublishedDomainBridges(manifest), [])
  assert.equal(isDomainBridgePubliclyEligible(manifest, bridge), false)
})

test("bridge review context is invalidated by any exact module tuple drift", () => {
  for (const field of [
    "moduleManifestVersion",
    "moduleQuestionBankVersion",
    "moduleScoringVersion",
    "moduleResultCopyVersion",
  ] as const) {
    const bridge = holdDocumentBridge()
    bridge.versionContext[field] += 1
    const result = validateDomainModuleManifest(manifestWithHoldBridge(bridge))
    assert.equal(result.ok, false)
    assert.equal(
      !result.ok &&
        result.issues.some(
          (issue) =>
            issue.code === "bridge.version-context" &&
            issue.path.endsWith(field),
        ),
      true,
    )
  }
})

test("bridge dimensions reject numeric comparison fields and conflated statuses", () => {
  const bridge = {
    ...holdDocumentBridge(),
    status: "expert-reviewed",
    rawScore: 6.2,
    masterScore: 5.8,
  }
  const result = validateDomainModuleManifest(
    manifestWithHoldBridge(
      bridge as unknown as DomainBridgeDefinition<"security", "activism">,
    ),
  )
  assert.equal(result.ok, false)
  assert.equal(
    !result.ok &&
      result.issues.filter((issue) => issue.code === "field.unexpected")
        .length >= 3,
    true,
  )
})

test("AI results do not publish automatic Foundation synthesis", () => {
  const source = readFileSync(
    new URL("../components/ai/ai-project-bridge.tsx", import.meta.url),
    "utf8",
  )
  assert.match(source, /DEFAULT_DOMAIN_RELATION_READ/u)
  assert.match(source, /No explicit reviewed bridge/u)
  assert.match(source, /does not combine them into a master score/u)
  assert.doesNotMatch(source, /getCrossModuleSynthesis/u)
  assert.doesNotMatch(source, /likelyAlignment|likelyTensions/u)
})
