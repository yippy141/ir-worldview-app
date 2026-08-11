import test from "node:test"
import assert from "node:assert/strict"
import { readFileSync } from "node:fs"
import {
  decodeProfileSharePayload,
  encodeProfileSharePayload,
  normalizeProfileShareInput,
  resolveProfileSharePayload,
  type ProfileSharePayload,
} from "@/lib/profile-share"
import {
  loadProfileStore,
  parseProfileStore,
  saveModuleSnapshot,
  serializeProfileStore,
  type ModuleSnapshot,
} from "@/lib/profile-store"
import { resolveFoundationArchetypeFromSnapshot } from "@/lib/profile-foundation-identity"
import { PROFILE_STORAGE_KEY } from "@/lib/storage-keys"

function readStoreFixture(version: 1 | 2 | 3 | 4 | 5) {
  return readFileSync(
    new URL(`./fixtures/profile-store-v${version}.json`, import.meta.url),
    "utf8",
  )
}

function readShareFixture(version: 1 | 2 | 3): ProfileSharePayload {
  return JSON.parse(
    readFileSync(
      new URL(`./fixtures/profile-share-v${version}.json`, import.meta.url),
      "utf8",
    ),
  ) as ProfileSharePayload
}

test("saving separate domain records leaves the layered Profile Foundation identity unchanged", () => {
  const foundationProfile = parseProfileStore(readStoreFixture(5), "en")
  const legacySecurity = parseProfileStore(
    readStoreFixture(4),
    "en",
  ).modules.security
  const legacyTechnology = parseProfileStore(
    readStoreFixture(2),
    "en",
  ).modules.technology
  const legacyAiGovernance = parseProfileStore(
    readStoreFixture(3),
    "en",
  ).aiGovernance
  assert.ok(foundationProfile.foundation)
  assert.ok(legacySecurity)
  assert.ok(legacyTechnology)
  assert.ok(legacyAiGovernance)

  const foundationBefore = structuredClone(foundationProfile.foundation)
  const identityBefore = resolveFoundationArchetypeFromSnapshot(foundationBefore)
  assert.ok(identityBefore)

  let storedProfile = serializeProfileStore({
    ...foundationProfile,
    aiGovernance: legacyAiGovernance,
  })
  const previousWindow = Object.getOwnPropertyDescriptor(globalThis, "window")
  Object.defineProperty(globalThis, "window", {
    configurable: true,
    value: {
      localStorage: {
        getItem(key: string) {
          return key === PROFILE_STORAGE_KEY ? storedProfile : null
        },
        setItem(key: string, value: string) {
          assert.equal(key, PROFILE_STORAGE_KEY)
          storedProfile = value
        },
      },
    },
  })

  try {
    assert.equal(
      saveModuleSnapshot({
        ...legacySecurity,
        timestamp: legacySecurity.timestamp + 1,
      } as ModuleSnapshot),
      true,
    )
    assert.equal(
      saveModuleSnapshot({
        ...legacyTechnology,
        timestamp: legacyTechnology.timestamp + 1,
      } as ModuleSnapshot),
      true,
    )

    const saved = loadProfileStore("en")
    assert.ok(saved.foundation)
    const identityAfter = resolveFoundationArchetypeFromSnapshot(saved.foundation)
    assert.ok(identityAfter)

    assert.equal(saved.foundation.payload, foundationBefore.payload)
    assert.deepEqual(
      saved.foundation.dimensionScores,
      foundationBefore.dimensionScores,
    )
    assert.deepEqual(
      { code: identityAfter.code, name: identityAfter.name },
      { code: identityBefore.code, name: identityBefore.name },
    )
    assert.deepEqual(Object.keys(saved.modules).sort(), ["security", "technology"])
    assert.equal(saved.modules.security?.slug, "security")
    assert.equal(saved.modules.technology?.slug, "technology")
    assert.equal(saved.aiGovernance?.payload, legacyAiGovernance.payload)
    assert.equal(saved.aiGovernance?.archetypeKey, legacyAiGovernance.archetypeKey)
  } finally {
    if (previousWindow) {
      Object.defineProperty(globalThis, "window", previousWindow)
    } else {
      delete (globalThis as { window?: unknown }).window
    }
  }
})

test("frozen module snapshots retain legacy fields through V5 migration and hydration", () => {
  const cases = [
    {
      version: 1 as const,
      slug: "security" as const,
      overlayDeltas: {},
      headline: "Legacy security result",
    },
    {
      version: 2 as const,
      slug: "technology" as const,
      overlayDeltas: {
        securityCompetition: 0.4,
        politicalEconomy: 0.3,
      },
      headline: "Legacy technology result",
    },
    {
      version: 4 as const,
      slug: "security" as const,
      overlayDeltas: { securityCompetition: 0.25 },
      headline: "V4 security interpretation",
    },
  ]

  for (const expected of cases) {
    const migrated = parseProfileStore(readStoreFixture(expected.version), "en")
    const hydrated = parseProfileStore(serializeProfileStore(migrated), "en")
    const snapshot = hydrated.modules[expected.slug]

    assert.ok(snapshot, `expected ProfileStore V${expected.version} module`)
    assert.equal(snapshot.headline, expected.headline)
    assert.deepEqual(snapshot.overlayDeltas, expected.overlayDeltas)
    assert.equal(snapshot.legacyEnglishCopy?.headline, expected.headline)
  }
})

test("frozen Profile Share V1, V2, and V3 links still decode and resolve", () => {
  for (const version of [1, 2, 3] as const) {
    const fixture = readShareFixture(version)
    const encoded = encodeProfileSharePayload(fixture)
    const fullUrl = `https://inventory.test/profile/share/${encoded}?source=compat`

    assert.equal(normalizeProfileShareInput(fullUrl), encoded)
    assert.equal(decodeProfileSharePayload(encoded)?.v, version)

    const resolved = resolveProfileSharePayload(encoded, "en")
    assert.ok(resolved, `expected Profile Share V${version} to resolve`)
    assert.equal(resolved.profile.foundation?.payload, fixture.v === 3
      ? fixture.f.p
      : fixture.f)
    assert.deepEqual(
      resolved.profile.foundation?.dimensionScores,
      {
        securityCompetition: 4.3,
        institutions: 5.8,
        domesticFilters: 4.9,
        normsIdentity: 5.1,
        politicalEconomy: 4.7,
        restraint: 5.4,
        orderJustice: 5.3,
      },
    )
    assert.equal(
      resolved.profile.foundation
        ? resolveFoundationArchetypeFromSnapshot(resolved.profile.foundation)?.code
        : null,
      "R-",
    )
  }
})
