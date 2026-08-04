export const ZH_HANS_COPY_DECK_VERSION = 1 as const

export const zhHansCopyDeckManifest = {
  locale: "zh-Hans",
  copyVersion: ZH_HANS_COPY_DECK_VERSION,
  sourceCopyVersion: "V19.1",
  implementationRange: "V19.1–V20",
  status: "approved",
  preparedAt: "2026-07-20",
  includes: [
    "product-glossary",
    "navigation-and-controls",
    "world-stage",
    "current-case-archive",
    "current-case-records",
    "about",
    "methods",
    "privacy",
    "corrections",
    "worldview-map-ui",
    "worldview-profile-public-copy",
    "thinkers-and-public-position-ui",
    "metadata-and-open-graph",
    "foundation-instrument",
    "foundation-result-narratives",
  ],
  excludes: [
    "ai-instrument",
    "module-instruments",
    "perspective-instruments",
    // The archetype layer — names, glosses, historical analogues, and the
    // evidence pages — has no approved Chinese copy. Chinese result routes
    // omit it and render the family narrative instead. It is never shown in
    // English as a silent fallback. See docs/v22/V22_ARCHETYPE_NAMING_DECISION.md.
    "archetype-layer",
  ],
} as const
