export const ANALYTICS_EVENT_NAMES = [
  "current_case_viewed",
  "current_case_started",
  "current_case_completed",
  "reading_opened",
  "challenge_opened",
  "case_shared",
  "foundation_started",
  "foundation_completed",
  "profile_viewed",
  "worldview_map_viewed",
  "newsletter_clicked",
] as const

export const ANALYTICS_PROPERTY_KEYS = [
  "caseId",
  "routeCategory",
  "deviceClass",
  "referrerCategory",
  "returningAgeBucket",
] as const

const CASE_EVENT_NAMES = new Set<AnalyticsEventName>([
  "current_case_viewed",
  "current_case_started",
  "current_case_completed",
  "reading_opened",
  "challenge_opened",
  "case_shared",
])

const ROUTE_CATEGORIES = [
  "home",
  "current-case",
  "foundation",
  "profile",
  "worldview-map",
  "field-guide",
  "focus-area",
  "ai-governance",
  "perspective-run",
  "futures",
  "methods",
  "privacy",
  "feedback",
  "other",
] as const

const DEVICE_CLASSES = ["mobile", "tablet", "desktop", "unknown"] as const
const REFERRER_CATEGORIES = [
  "direct",
  "internal",
  "search",
  "social",
  "newsletter",
  "other",
] as const
const RETURNING_AGE_BUCKETS = [
  "under-1-day",
  "1-6-days",
  "7-29-days",
  "30-plus-days",
  "unknown",
] as const

const ALLOWED_TOP_LEVEL_KEYS = new Set(["name", "properties"])
const ALLOWED_PROPERTY_KEYS = new Set<string>(ANALYTICS_PROPERTY_KEYS)
const EVENT_NAMES = new Set<string>(ANALYTICS_EVENT_NAMES)
const CASE_ID_PATTERN = /^[a-z0-9](?:[a-z0-9-]{0,98}[a-z0-9])?$/
const DAY_MS = 24 * 60 * 60 * 1000

type AnalyticsEventName = (typeof ANALYTICS_EVENT_NAMES)[number]
type RouteCategory = (typeof ROUTE_CATEGORIES)[number]
type DeviceClass = (typeof DEVICE_CLASSES)[number]
type ReferrerCategory = (typeof REFERRER_CATEGORIES)[number]
type ReturningAgeBucket = (typeof RETURNING_AGE_BUCKETS)[number]

export type AnalyticsEventProperties = {
  caseId?: string
  routeCategory: RouteCategory
  deviceClass: DeviceClass
  referrerCategory: ReferrerCategory
  returningAgeBucket: ReturningAgeBucket
}

export type AnalyticsEvent = {
  name: AnalyticsEventName
  properties: AnalyticsEventProperties
}

export type AnalyticsValidationResult =
  | { ok: true; event: AnalyticsEvent }
  | { ok: false; error: string }

export type AnalyticsDeliveryResult =
  | { accepted: false; delivered: false; reason: "invalid"; error: string }
  | {
      accepted: true
      delivered: boolean
      reason?: "provider-unavailable" | "provider-error"
    }

export type AnalyticsProvider = (event: AnalyticsEvent) => void | Promise<void>

export function createAnalyticsAdapter(provider?: AnalyticsProvider) {
  return {
    async track(value: unknown): Promise<AnalyticsDeliveryResult> {
      const validation = validateAnalyticsEvent(value)
      if (!validation.ok) {
        return {
          accepted: false,
          delivered: false,
          reason: "invalid",
          error: validation.error,
        }
      }

      if (!provider) {
        return {
          accepted: true,
          delivered: false,
          reason: "provider-unavailable",
        }
      }

      try {
        await provider(validation.event)
        return { accepted: true, delivered: true }
      } catch {
        return {
          accepted: true,
          delivered: false,
          reason: "provider-error",
        }
      }
    },
  }
}

export function validateAnalyticsEvent(value: unknown): AnalyticsValidationResult {
  if (!isRecord(value)) return invalid("Analytics event must be an object.")

  const unknownTopLevelKey = Object.keys(value).find(
    (key) => !ALLOWED_TOP_LEVEL_KEYS.has(key),
  )
  if (unknownTopLevelKey) return invalid(`Forbidden event field: ${unknownTopLevelKey}.`)
  if (!EVENT_NAMES.has(String(value.name))) return invalid("Unknown analytics event name.")
  if (!isRecord(value.properties)) return invalid("Event properties must be an object.")

  const unknownProperty = Object.keys(value.properties).find(
    (key) => !ALLOWED_PROPERTY_KEYS.has(key),
  )
  if (unknownProperty) return invalid(`Forbidden event property: ${unknownProperty}.`)

  const name = value.name as AnalyticsEventName
  const properties = value.properties
  const hasCaseId = Object.hasOwn(properties, "caseId")

  if (CASE_EVENT_NAMES.has(name) && !hasCaseId) {
    return invalid(`caseId is required for ${name}.`)
  }
  if (!CASE_EVENT_NAMES.has(name) && hasCaseId) {
    return invalid(`caseId is not allowed for ${name}.`)
  }
  if (hasCaseId && (typeof properties.caseId !== "string" || !CASE_ID_PATTERN.test(properties.caseId))) {
    return invalid("caseId must be a stable, non-URL identifier.")
  }
  if (!isMember(properties.routeCategory, ROUTE_CATEGORIES)) {
    return invalid("Unknown routeCategory.")
  }
  if (!isMember(properties.deviceClass, DEVICE_CLASSES)) {
    return invalid("Unknown deviceClass.")
  }
  if (!isMember(properties.referrerCategory, REFERRER_CATEGORIES)) {
    return invalid("Unknown referrerCategory.")
  }
  if (!isMember(properties.returningAgeBucket, RETURNING_AGE_BUCKETS)) {
    return invalid("Unknown returningAgeBucket.")
  }

  return {
    ok: true,
    event: {
      name,
      properties: {
        ...(hasCaseId ? { caseId: properties.caseId as string } : {}),
        routeCategory: properties.routeCategory,
        deviceClass: properties.deviceClass,
        referrerCategory: properties.referrerCategory,
        returningAgeBucket: properties.returningAgeBucket,
      },
    },
  }
}

export function trackProductEvent(name: AnalyticsEventName, input: { caseId?: string } = {}) {
  if (typeof window === "undefined" || analyticsOptedOut()) return

  const event: AnalyticsEvent = {
    name,
    properties: {
      ...(input.caseId ? { caseId: input.caseId } : {}),
      routeCategory: categorizeRoute(window.location.pathname),
      deviceClass: categorizeDevice(window.innerWidth),
      referrerCategory: categorizeReferrer(document.referrer, window.location.hostname),
      returningAgeBucket: getReturningAgeBucket(),
    },
  }

  const adapter = createAnalyticsAdapter(async (validatedEvent) => {
    if (typeof window.fetch !== "function") return
    await window.fetch("/api/analytics/event", {
      method: "POST",
      headers: { "content-type": "application/json" },
      body: JSON.stringify(validatedEvent),
      credentials: "omit",
      keepalive: true,
      referrerPolicy: "no-referrer",
    })
  })

  void adapter.track(event)
}

export function analyticsOptedOut() {
  if (typeof window === "undefined") return true
  if (sessionOptOut) return true

  try {
    return window.localStorage.getItem(ANALYTICS_OPT_OUT_STORAGE_KEY) === "true"
  } catch {
    // If the browser cannot read the local preference, fail closed.
    return true
  }
}

export function setAnalyticsOptOut(optedOut: boolean) {
  if (typeof window === "undefined") return
  sessionOptOut = optedOut

  try {
    if (optedOut) {
      window.localStorage.setItem(ANALYTICS_OPT_OUT_STORAGE_KEY, "true")
      window.localStorage.removeItem(ANALYTICS_FIRST_SEEN_STORAGE_KEY)
    } else {
      window.localStorage.removeItem(ANALYTICS_OPT_OUT_STORAGE_KEY)
    }
  } catch {
    // The in-memory flag still provides a no-op fallback for this tab.
  }
}

export function categorizeRoute(pathname: string): RouteCategory {
  if (pathname === "/") return "home"
  if (pathname === "/current" || pathname.startsWith("/cases")) return "current-case"
  if (pathname.startsWith("/quiz") || pathname.startsWith("/results")) return "foundation"
  if (pathname.startsWith("/profile") || pathname.startsWith("/compare")) return "profile"
  if (pathname.startsWith("/explore/atlas")) return "worldview-map"
  if (pathname.startsWith("/explore") || pathname.startsWith("/learn")) return "field-guide"
  if (pathname.startsWith("/modules")) return "focus-area"
  if (pathname.startsWith("/ai")) return "ai-governance"
  if (pathname.startsWith("/perspectives")) return "perspective-run"
  if (pathname.startsWith("/futures")) return "futures"
  if (pathname.startsWith("/method")) return "methods"
  if (pathname.startsWith("/privacy")) return "privacy"
  if (pathname.startsWith("/feedback")) return "feedback"
  return "other"
}

export function categorizeDevice(viewportWidth: number): DeviceClass {
  if (!Number.isFinite(viewportWidth) || viewportWidth <= 0) return "unknown"
  if (viewportWidth < 640) return "mobile"
  if (viewportWidth < 1024) return "tablet"
  return "desktop"
}

export function categorizeReferrer(referrer: string, currentHostname: string): ReferrerCategory {
  if (!referrer) return "direct"

  try {
    const hostname = new URL(referrer).hostname.toLowerCase()
    const localHostname = currentHostname.toLowerCase()
    if (hostname === localHostname || hostname.endsWith(`.${localHostname}`)) return "internal"
    if (matchesDomain(hostname, ["google.", "bing.com", "duckduckgo.com", "baidu.com", "yahoo."])) {
      return "search"
    }
    if (
      matchesDomain(hostname, [
        "linkedin.com",
        "x.com",
        "twitter.com",
        "facebook.com",
        "instagram.com",
        "reddit.com",
        "bsky.app",
        "t.co",
      ])
    ) {
      return "social"
    }
    if (
      matchesDomain(hostname, [
        "substack.com",
        "buttondown.email",
        "mailchi.mp",
        "mailchimp.com",
        "beehiiv.com",
      ])
    ) {
      return "newsletter"
    }
    return "other"
  } catch {
    return "other"
  }
}

let sessionOptOut = false

function getReturningAgeBucket(): ReturningAgeBucket {
  try {
    const today = new Date().toISOString().slice(0, 10)
    const stored = window.localStorage.getItem(ANALYTICS_FIRST_SEEN_STORAGE_KEY)
    if (!stored) {
      window.localStorage.setItem(ANALYTICS_FIRST_SEEN_STORAGE_KEY, today)
      return "under-1-day"
    }

    const elapsed = Date.now() - Date.parse(`${stored}T00:00:00.000Z`)
    if (!Number.isFinite(elapsed) || elapsed < 0) return "unknown"
    const days = Math.floor(elapsed / DAY_MS)
    if (days < 1) return "under-1-day"
    if (days < 7) return "1-6-days"
    if (days < 30) return "7-29-days"
    return "30-plus-days"
  } catch {
    return "unknown"
  }
}

function matchesDomain(hostname: string, candidates: string[]) {
  return candidates.some((candidate) =>
    candidate.endsWith(".")
      ? hostname.includes(candidate)
      : hostname === candidate || hostname.endsWith(`.${candidate}`),
  )
}

function invalid(error: string): AnalyticsValidationResult {
  return { ok: false, error }
}

function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === "object" && value !== null && !Array.isArray(value)
}

function isMember<const T extends readonly string[]>(
  value: unknown,
  values: T,
): value is T[number] {
  return typeof value === "string" && (values as readonly string[]).includes(value)
}
import {
  ANALYTICS_FIRST_SEEN_STORAGE_KEY,
  ANALYTICS_OPT_OUT_STORAGE_KEY,
} from "@/lib/storage-keys"

export {
  ANALYTICS_FIRST_SEEN_STORAGE_KEY,
  ANALYTICS_OPT_OUT_STORAGE_KEY,
} from "@/lib/storage-keys"
