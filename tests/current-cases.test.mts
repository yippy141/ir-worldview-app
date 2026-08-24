import test from "node:test"
import assert from "node:assert/strict"
import { readFileSync } from "node:fs"
import {
  CURRENT_CASE_CATALOG_STATUS,
  currentCaseCatalog,
  getActivePublishedLaunchCurrentCase,
  getLatestPublishedCurrentCase,
  getPublishedCurrentCases,
  getSourcesForCurrentCaseClaim,
  validateCurrentCaseCatalogForPublication,
} from "@/lib/current-cases/catalog"
import { currentCaseContent } from "@/content/locales/current-cases"
import { compareCompletedCaseWithFoundation } from "@/lib/current-cases/profile-connection"
import type {
  CompletedCurrentCaseResponse,
  CurrentCase,
} from "@/lib/current-cases/types"
import {
  getEffectiveCurrentCaseFreshnessStatus,
  getCurrentCaseOptionDifferentiationIssues,
  validateCurrentCaseForPublication,
} from "@/lib/current-cases/validation"
import { getPublishedZhHansCurrentCases } from "@/lib/current-cases/zh-hans"
import type { FoundationSnapshot } from "@/lib/profile-store"
import {
  validateWorldStageCatalog,
  worldStageMenuItems,
  worldStageMenuItemsWithCurrentCase,
  worldStageUtilityDestinations,
} from "@/lib/world-stage/scenes"

function words(count: number, stem: string) {
  return Array.from({ length: count }, (_, index) => `${stem}${index}`).join(" ")
}

function reviewedCase(): CurrentCase {
  return {
    schemaVersion: 2,
    id: "case-001",
    slug: "tested-strategic-choice",
    version: 1,
    publicationStatus: "published",
    launchRole: "launch",
    title: "A tested strategic choice",
    dek: "A neutral description of a consequential choice.",
    category: "security",
    publishedAt: "2026-07-17",
    updatedAt: "2026-07-17",
    asOf: "2026-07-17",
    reviewDueAt: "2026-07-24",
    freshnessStatus: "active",
    cadence: "fast",
    evidenceWindow: { start: "2026-07-01", end: "2026-07-16" },
    briefing: words(260, "briefing"),
    actors: ["Actor A", "Actor B"],
    perspectives: {
      global: "The choice affects rules and expectations beyond the immediate parties.",
      counterparties: [
        { actor: "Actor B", perspective: "Actor B disputes the premise and bears distinct costs." },
      ],
    },
    factualClaims: [
      { id: "c1", text: "Claim one." },
      { id: "c2", text: "Claim two." },
      { id: "c3", text: "Claim three." },
      { id: "c4", text: "Claim four." },
    ],
    knownUncertainties: ["The counterparty's implementation threshold remains uncertain."],
    reasoningTags: [
      { id: "capability", label: "Capability" },
      { id: "institutions", label: "Institutions" },
      { id: "escalation", label: "Escalation" },
    ],
    decision: {
      prompt: "Which course should the actor take?",
      options: [
        {
          id: "coordinate",
          label: "Coordinate a bounded response with partners.",
          logic: "Coalition durability",
          acceptedTradeoff: "Slower action and a narrower initial measure.",
        },
        {
          id: "signal",
          label: "Act early to establish a credible limit.",
          logic: "Deterrent signaling",
          acceptedTradeoff: "Higher near-term escalation risk.",
        },
        {
          id: "defer",
          label: "Defer action while testing the disputed premise.",
          logic: "Information preservation",
          acceptedTradeoff: "The opportunity to act may narrow.",
        },
      ],
    },
    worldviewReadings: [
      {
        profileId: "broad-spectrum-bridge-builder",
        noticesFirst: "Several mechanisms remain plausible.",
        interpretation: "The case rewards a course that preserves room to update.",
        recommendation: "Coordinate a bounded response.",
        recommendedOptionIds: ["coordinate"],
        strongestObjection: "A blended response can obscure which threat matters most.",
        updateCondition: "Clear evidence that delay irreversibly weakens deterrence.",
      },
      {
        profileId: "competitive-balancer",
        noticesFirst: "The counterparty may be testing resolve.",
        interpretation: "The immediate mechanism is competitive leverage.",
        recommendation: "Act early to establish a limit.",
        recommendedOptionIds: ["signal"],
        strongestObjection: "Visible pressure can harden the behavior it seeks to change.",
        updateCondition: "Evidence that the counterparty is seeking a negotiated off-ramp.",
      },
      {
        profileId: "institution-builder",
        noticesFirst: "A durable response needs a usable rule.",
        interpretation: "Legitimacy and repeatability shape the strategic payoff.",
        recommendation: "Coordinate a bounded response.",
        recommendedOptionIds: ["coordinate"],
        strongestObjection: "Process may move too slowly for a closing window.",
        updateCondition: "Evidence that coordination cannot occur before the relevant threshold.",
      },
    ],
    assumptionChallenge: {
      newInformation: "New evidence weakens the original estimate of urgency.",
      prompt: "How does this affect your first judgment?",
      options: [
        { id: "weakens", label: "It weakens my first read." },
        { id: "priority", label: "It changes the priority, not the conclusion." },
        { id: "strengthens", label: "It strengthens my first read." },
        { id: "unsure", label: "I remain unsure." },
      ],
    },
    nextRoutes: [
      { href: "/profile", label: "My Profile", reason: "Compare the case with a saved baseline." },
    ],
    sources: [
      {
        id: "s1",
        title: "Primary record one",
        publisher: "Institution A",
        publishedAt: "2026-07-10",
        accessedAt: "2026-07-17",
        url: "https://example.com/records/one?view=full#claim",
        kind: "primary",
        claimIds: ["c1"],
      },
      {
        id: "s2",
        title: "Primary record two",
        publisher: "Institution B",
        publishedAt: "2026-07-11",
        accessedAt: "2026-07-17",
        url: "https://example.org/records/two",
        kind: "primary",
        claimIds: ["c2", "c3"],
      },
      {
        id: "s3",
        title: "Authoritative analysis",
        publisher: "Research institute",
        publishedAt: "2026-07-15",
        accessedAt: "2026-07-17",
        url: "https://research.example.net/analysis",
        kind: "authoritative-research",
        claimIds: ["c4"],
      },
    ],
    disputes: { factual: [], interpretive: ["Analysts disagree about the likely response."] },
    sensitiveWording: [
      { term: "crisis", guidance: "Use only for the bounded episode described in the evidence." },
    ],
    correctionRisks: [
      { risk: "An official timeline may change.", mitigation: "Check primary notices before release." },
    ],
    editorialMemo: words(150, "memo"),
    editorialReview: {
      researchReviewedAt: "2026-07-17",
      sourceCheckedAt: "2026-07-17",
      copyReviewedAt: "2026-07-17",
      approvedAt: "2026-07-17",
      reviewerIds: ["research-editor", "copy-editor"],
    },
  }
}

const foundation: FoundationSnapshot = {
  timestamp: 1,
  payload: "payload",
  instrumentStructuralVersion: 3,
  scoringVersion: 1,
  resultPath: "/results/payload",
  familyKey: "realist",
  familyLabel: "Realist",
  runnerUpKey: "institutionalist",
  runnerUpLabel: "Institutionalist",
  summary: "Several lenses remain close.",
  dimensionScores: {
    securityCompetition: 4.2,
    institutions: 4.1,
    domesticFilters: 4,
    normsIdentity: 4,
    politicalEconomy: 4.1,
    restraint: 4,
    orderJustice: 4,
  },
  strategyModifier: "Hedger",
  normativeModifier: "Conditional Solidarist",
  keyDrivers: [],
  strongLenses: [],
  locale: "en",
  localeCopyVersion: 1,
}

const response: CompletedCurrentCaseResponse = {
  caseId: "case-001",
  caseSlug: "tested-strategic-choice",
  caseVersion: 1,
  initialOptionId: "signal",
  initialConfidence: 2,
  selectedOptionId: "coordinate",
  confidence: 3,
  reasoningTagIds: ["institutions"],
  challengeResponseId: "priority",
  openedReadingProfileIds: ["broad-spectrum-bridge-builder"],
  completedAt: "2026-07-17T10:00:00.000Z",
  locale: "en",
  localeCopyVersion: 1,
}

test("the production catalog preserves the three approved records without a stale launch", () => {
  assert.equal(CURRENT_CASE_CATALOG_STATUS, "approved-research-pack")
  assert.equal(currentCaseCatalog.length, 3)
  assert.deepEqual(validateCurrentCaseCatalogForPublication(), {
    ok: true,
    errors: [],
  })
  assert.deepEqual(
    validateCurrentCaseCatalogForPublication(currentCaseCatalog, {
      referenceDate: "2026-08-06",
    }),
    { ok: true, errors: [] },
  )
  assert.equal(getPublishedCurrentCases().length, 3)
  assert.equal(getActivePublishedLaunchCurrentCase(), null)
  assert.equal(getLatestPublishedCurrentCase(), null)
})

test("a complete reviewed case satisfies the publication contract", () => {
  const record = reviewedCase()
  assert.deepEqual(
    validateCurrentCaseForPublication(record, { referenceDate: record.reviewDueAt }),
    { ok: true, errors: [] },
  )
  assert.equal(getPublishedCurrentCases([record])[0], record)
})

test("launch freshness is valid through the review deadline and fails the next day", () => {
  const record = reviewedCase()

  assert.deepEqual(
    validateCurrentCaseForPublication(record, { referenceDate: "2026-07-24" }),
    { ok: true, errors: [] },
  )
  assert.equal(
    getActivePublishedLaunchCurrentCase([record], {
      referenceDate: "2026-07-24",
    }),
    record,
  )

  const expired = validateCurrentCaseForPublication(record, {
    referenceDate: "2026-07-25",
  })
  assert.equal(expired.ok, false)
  assert.equal(
    expired.errors.some((error) => error.code === "freshness.review-due"),
    true,
  )
  assert.equal(
    getActivePublishedLaunchCurrentCase([record], {
      referenceDate: "2026-07-25",
    }),
    null,
  )
  assert.equal(getPublishedCurrentCases([record])[0], record)
})

test("effective freshness uses an injected date and keeps the deadline inclusive", () => {
  const record = reviewedCase()

  assert.equal(
    getEffectiveCurrentCaseFreshnessStatus(record, "2026-07-24"),
    "active",
  )
  assert.equal(
    getEffectiveCurrentCaseFreshnessStatus(
      record,
      new Date("2026-07-25T00:00:00.000Z"),
    ),
    "review-due",
  )

  record.launchRole = "archive"
  record.freshnessStatus = "background"
  assert.equal(
    getEffectiveCurrentCaseFreshnessStatus(record, "2027-01-01"),
    "background",
  )
  assert.equal(
    getEffectiveCurrentCaseFreshnessStatus(record, "not-a-date"),
    null,
  )
})

test("English and Chinese publication sets both fail closed for an invalid catalog", () => {
  const invalidCatalog = structuredClone(currentCaseCatalog)
  invalidCatalog[1].id = invalidCatalog[0].id

  assert.equal(
    validateCurrentCaseCatalogForPublication(invalidCatalog, {
      referenceDate: "2026-08-06",
    }).ok,
    false,
  )
  assert.deepEqual(getPublishedCurrentCases(invalidCatalog), [])
  assert.deepEqual(getPublishedZhHansCurrentCases(invalidCatalog), [])
})

test("English and Chinese case indexes and details regenerate freshness hourly", () => {
  const routeFiles = [
    "app/cases/page.tsx",
    "app/cases/[slug]/page.tsx",
    "app/[locale]/cases/page.tsx",
    "app/[locale]/cases/[slug]/page.tsx",
  ]

  for (const routeFile of routeFiles) {
    const source = readFileSync(new URL(`../${routeFile}`, import.meta.url), "utf8")
    assert.match(
      source,
      /export const revalidate = 3600/,
      `${routeFile} must refresh deadline presentation hourly`,
    )
    assert.match(
      source,
      /new Date\(\)\.toISOString\(\)\.slice\(0, 10\)/,
      `${routeFile} must supply the date-only freshness contract`,
    )
  }
})

test("published catalogs allow no launch and reject multiple launches", () => {
  const archived = reviewedCase()
  archived.launchRole = "archive"
  archived.freshnessStatus = "background"

  assert.deepEqual(
    validateCurrentCaseCatalogForPublication([archived], {
      referenceDate: "2026-08-06",
    }),
    { ok: true, errors: [] },
  )
  assert.equal(
    getActivePublishedLaunchCurrentCase([archived], {
      referenceDate: "2026-08-06",
    }),
    null,
  )

  const secondLaunch = structuredClone(reviewedCase())
  secondLaunch.id = "case-002"
  secondLaunch.slug = "another-tested-strategic-choice"
  const duplicateLaunches = validateCurrentCaseCatalogForPublication(
    [reviewedCase(), secondLaunch],
    { referenceDate: "2026-07-24" },
  )
  assert.equal(duplicateLaunches.ok, false)
  assert.equal(
    duplicateLaunches.errors.some(
      (error) => error.caseId === "catalog" && error.path === "launchRole",
    ),
    true,
  )
})

test("active freshness and launch role must agree", () => {
  const inactiveLaunch = reviewedCase()
  inactiveLaunch.freshnessStatus = "review-due"
  const inactiveLaunchValidation = validateCurrentCaseForPublication(
    inactiveLaunch,
    { referenceDate: "2026-07-25" },
  )
  assert.equal(inactiveLaunchValidation.ok, false)
  assert.equal(
    inactiveLaunchValidation.errors.some(
      (error) =>
        error.code === "freshness.invalid" &&
        error.path === "freshnessStatus",
    ),
    true,
  )

  const activeArchive = reviewedCase()
  activeArchive.launchRole = "archive"
  const activeArchiveValidation = validateCurrentCaseForPublication(
    activeArchive,
    { referenceDate: "2026-07-24" },
  )
  assert.equal(activeArchiveValidation.ok, false)
  assert.equal(
    activeArchiveValidation.errors.some(
      (error) =>
        error.code === "freshness.invalid" && error.path === "launchRole",
    ),
    true,
  )
})

test("publication fails closed on uncovered claims and preserves recorded URLs", () => {
  const record = reviewedCase()
  const recordedUrl = record.sources[0].url
  assert.equal(getSourcesForCurrentCaseClaim(record, "c1")[0].url, recordedUrl)

  record.sources[0].claimIds = []
  const validation = validateCurrentCaseForPublication(record)
  assert.equal(validation.ok, false)
  assert.equal(validation.errors.some((error) => error.code === "claim.uncovered"), true)
  assert.deepEqual(getPublishedCurrentCases([record]), [])
})

test("readings require objections, update conditions, and stable Atlas IDs", () => {
  const record = reviewedCase()
  record.worldviewReadings[0].strongestObjection = ""
  record.worldviewReadings[1].updateCondition = ""
  record.worldviewReadings[2].profileId = "invented-family"

  const validation = validateCurrentCaseForPublication(record)
  assert.equal(validation.ok, false)
  assert.equal(validation.errors.some((error) => error.path.endsWith("strongestObjection")), true)
  assert.equal(validation.errors.some((error) => error.path.endsWith("updateCondition")), true)
  assert.equal(validation.errors.some((error) => error.code === "reading.profile-unknown"), true)
})

test("answer-option validation rejects duplicated logics and tradeoffs", () => {
  const record = reviewedCase()
  record.decision.options[2].logic = record.decision.options[0].logic
  record.decision.options[2].acceptedTradeoff = record.decision.options[0].acceptedTradeoff
  const issues = getCurrentCaseOptionDifferentiationIssues(record.decision.options)
  assert.equal(issues.some((issue) => issue.code === "option.duplicate-logic"), true)
  assert.equal(issues.some((issue) => issue.code === "option.duplicate-tradeoff"), true)
})

test("Foundation connection stays unavailable until a versioned authored mapping exists", () => {
  const record = reviewedCase()
  const recordBefore = structuredClone(record)
  const responseBefore = structuredClone(response)
  const foundationBefore = structuredClone(foundation)

  const connection = compareCompletedCaseWithFoundation(record, response, foundation)
  assert.deepEqual(connection, {
    kind: "unavailable",
    unavailableReason: "missing-authored-mapping",
    selectedOptionId: "coordinate",
  })
  assert.equal("score" in connection, false)
  assert.equal("foundationPatternId" in connection, false)
  assert.equal("readingProfileId" in connection, false)
  assert.deepEqual(record, recordBefore)
  assert.deepEqual(response, responseBefore)
  assert.deepEqual(foundation, foundationBefore)
})

test("Foundation connection unavailability is explicit in both public locales", () => {
  assert.match(
    currentCaseContent("en").flow.foundationConnectionUnavailable,
    /reviewed, versioned mapping/,
  )
  assert.match(
    currentCaseContent("zh-Hans").flow.foundationConnectionUnavailable,
    /编辑审核、注明版本/,
  )
})

test("Foundation connection never infers from missing or incompatible saved baselines", () => {
  for (const unavailableFoundation of [
    null,
    { ...foundation, locale: "zh-Hans" as const },
    { ...foundation, localeCopyVersion: foundation.localeCopyVersion + 1 },
  ]) {
    const connection = compareCompletedCaseWithFoundation(
      reviewedCase(),
      response,
      unavailableFoundation,
    )
    assert.equal(connection.kind, "unavailable")
    assert.equal(connection.unavailableReason, "missing-authored-mapping")
    assert.equal("foundationPatternId" in connection, false)
  }
})

test("Current Case leads the live numbered menu and My Profile remains a visible utility", () => {
  assert.equal(worldStageMenuItems[0]?.id, "current-case")
  assert.equal(worldStageMenuItems[0]?.href, "/current")
  assert.deepEqual(worldStageMenuItemsWithCurrentCase, worldStageMenuItems)
  assert.deepEqual(
    worldStageMenuItems.map(({ index, label }) => ({ index, label })),
    [
      { index: "01", label: "Current Case" },
      { index: "02", label: "Foundation" },
      { index: "03", label: "Focus Areas" },
      { index: "04", label: "Perspective Runs" },
      { index: "05", label: "Worldview Map" },
      { index: "06", label: "AI Governance" },
    ],
  )
  assert.deepEqual(validateWorldStageCatalog(undefined, worldStageMenuItemsWithCurrentCase), {
    ok: true,
    errors: [],
  })
  assert.deepEqual(worldStageUtilityDestinations, [
    { id: "profile", label: "My Profile", href: "/profile" },
  ])
})
