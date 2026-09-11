import {
  fillPrototypeTemplate,
  prototypeCopy,
  PROTOTYPE_AREA_IDS,
  type PrototypeAreaId,
} from "@/content/prototypes/product-refoundation"
import { getActivePublishedLaunchCurrentCase, getPublishedCurrentCases } from "@/lib/current-cases/catalog"
import { getCurrentCaseDestination } from "@/lib/current-cases/routes"
import { foundationCoreQuestions, questionCountsBySet } from "@/lib/quiz-schema"
import {
  currentCaseWorldStageMenuItem,
  recentCasesWorldStageMenuItem,
} from "@/lib/world-stage/scenes"

/**
 * Assembles the development-only prototype architecture from prototype copy
 * and the live catalogs. It reads existing routes, labels, and counts; it
 * defines no scoring, payload, storage, or navigation contract of its own.
 */

export { PROTOTYPE_AREA_IDS }
export type { PrototypeAreaId }

export type PrototypeAreaItem = Readonly<{ label: string; line: string; href: string }>

export type PrototypeArea = Readonly<{
  id: PrototypeAreaId
  label: string
  navHref: string
  lead: string
  items: readonly PrototypeAreaItem[]
  entry: Readonly<{ label: string; href: string }>
}>

export type PrototypeConfig = Readonly<{
  copy: typeof prototypeCopy
  areas: readonly PrototypeArea[]
  primaryHref: string
  secondaryHref: string
  supportLine: string
  recordHref: string
  domains: readonly Readonly<{ key: "security" | "technology" | "aiGovernance"; label: string }>[]
  coreQuestionIds: readonly string[]
  coreQuestionCount: number
}>

const FOUNDATION_HREF = "/quiz"
const PROFILE_HREF = "/profile"

function withHrefs(
  items: readonly Readonly<{ label: string; line: string }>[],
  hrefs: readonly string[],
): PrototypeAreaItem[] {
  return items.map((item, index) => ({ ...item, href: hrefs[index] }))
}

function liveCaseEntry(referenceDate: string) {
  const active = getActivePublishedLaunchCurrentCase(undefined, { referenceDate })
  const menuItem = active ? currentCaseWorldStageMenuItem : recentCasesWorldStageMenuItem
  return {
    label: menuItem.label,
    line: menuItem.description,
    href: getCurrentCaseDestination("en", undefined, { referenceDate }),
  }
}

function historicalCaseHref() {
  const background = getPublishedCurrentCases().find(
    (record) => record.freshnessStatus === "background",
  )
  return background ? `/cases/${background.slug}` : "/cases"
}

/**
 * Case availability follows an editorial date window, so the architecture is
 * built per request instead of frozen at module load.
 */
export function getPrototypeConfig(referenceDate: string): PrototypeConfig {
  const liveCase = liveCaseEntry(referenceDate)
  const { start, cases, fieldGuide, myRecord } = prototypeCopy.areas

  return {
    copy: prototypeCopy,
    primaryHref: FOUNDATION_HREF,
    secondaryHref: liveCase.href,
    recordHref: PROFILE_HREF,
    supportLine: fillPrototypeTemplate(prototypeCopy.supportTemplate, {
      count: questionCountsBySet.core,
    }),
    areas: [
      {
        id: "start",
        label: start.label,
        navHref: FOUNDATION_HREF,
        lead: start.lead,
        items: withHrefs(start.items, [
          FOUNDATION_HREF,
          "/modules/security",
          "/modules/technology",
          "/ai",
        ]),
        entry: { label: start.entry, href: FOUNDATION_HREF },
      },
      {
        id: "cases",
        label: cases.label,
        navHref: liveCase.href,
        lead: cases.lead,
        items: [
          { label: liveCase.label, line: liveCase.line, href: liveCase.href },
          ...withHrefs(cases.items, [
            historicalCaseHref(),
            "/perspectives",
            "/futures",
            "/world-stage",
          ]),
        ],
        entry: {
          label: fillPrototypeTemplate(cases.entryTemplate, { label: liveCase.label }),
          href: liveCase.href,
        },
      },
      {
        id: "field-guide",
        label: fieldGuide.label,
        navHref: "/explore",
        lead: fieldGuide.lead,
        items: withHrefs(fieldGuide.items, [
          "/explore",
          "/explore#modeled-traditions",
          "/explore/reference",
          "/ai/field-guide",
          "/method",
        ]),
        entry: { label: fieldGuide.entry, href: "/explore" },
      },
      {
        id: "my-record",
        label: myRecord.label,
        navHref: PROFILE_HREF,
        lead: myRecord.lead,
        items: [],
        entry: { label: myRecord.entry, href: PROFILE_HREF },
      },
    ],
    domains: [
      { key: "security", label: myRecord.domainLabels.security },
      { key: "technology", label: myRecord.domainLabels.technology },
      { key: "aiGovernance", label: myRecord.domainLabels.aiGovernance },
    ],
    coreQuestionIds: foundationCoreQuestions.map((question) => question.id),
    coreQuestionCount: questionCountsBySet.core,
  }
}
