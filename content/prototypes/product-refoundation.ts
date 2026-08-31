/**
 * Prototype-only copy for the development route `/dev/product-refoundation`.
 *
 * It sits beside `content/root.ts` rather than under `lib/` because it is
 * authored prose, not product logic. Nothing here is published: the route
 * fails closed in production, and no string is migrated to metadata, share
 * cards, stored records, or production titles.
 */

export const PROTOTYPE_AREA_IDS = ["start", "cases", "field-guide", "my-record"] as const

export type PrototypeAreaId = (typeof PROTOTYPE_AREA_IDS)[number]

export type PrototypeItemCopy = Readonly<{ label: string; line: string }>

export const prototypeCopy = {
  brand: "Worldview Atlas",
  descriptor: "World politics · strategy · technology · AI",
  headline: "How do you explain world politics?",
  intro:
    "The project asks you to judge recurring problems in international affairs: whether force settles anything, what an alliance is actually for. First Principles is the broad starting point and takes about five minutes. Security, Technology, AI Governance, the case library, and the reference reading then push those judgments into narrower settings where they get harder to hold. What comes back is an interpretation of the answers you gave rather than a personality diagnosis.",
  primaryAction: "Begin First Principles",
  supportTemplate: "{{count}} questions · about 5 minutes",
  secondaryAction: "Open a case",
  tertiaryOpen: "See how the project works",
  tertiaryClose: "Hide how the project works",
  navigationLabel: "Areas",

  continuation: {
    draftTemplate: "Continue First Principles · {{answered}} of {{total}}",
    draftPlain: "Continue First Principles",
    latestTemplate: "Latest result: {{label}}",
    openRecord: "Open My Record",
  },

  areas: {
    start: {
      label: "Start",
      lead:
        "First Principles comes first. The other three ask about a narrower policy problem and keep their own result.",
      items: [
        {
          label: "First Principles",
          line: "Broad questions about how you explain recurring problems in world politics.",
        },
        {
          label: "Security",
          line: "Deterrence, escalation, alliances, coercion, and force.",
        },
        {
          label: "Technology",
          line: "Technology controls, capacity, dependence, and international rules.",
        },
        {
          label: "AI Governance",
          line: "Frontier capability, oversight, access, competition, and political authority.",
        },
      ],
      entry: "Begin First Principles",
    },
    cases: {
      label: "Cases",
      lead: "One decision at a time, with the evidence window and the sources attached.",
      // The first item's label and line come from the live case catalog.
      items: [
        {
          label: "Historical cases",
          line: "Closed cases keep their evidence window, their sources, and their corrections.",
        },
        {
          label: "From Another Seat",
          line: "You answer from another actor's institutional and strategic position.",
        },
        {
          label: "Futures",
          line: "Twelve Trajectories, an editorial map of where advanced AI could end up.",
        },
        {
          label: "Map",
          line: "The geographic view, with every scene tied to dated sources.",
        },
      ],
      entryTemplate: "Open {{label}}",
    },
    fieldGuide: {
      label: "Field Guide",
      lead: "The reading behind the questions, and the places where the model is thin.",
      items: [
        {
          label: "Foundation readings",
          line: "Where each question comes from, with reading for each tradition.",
        },
        {
          label: "Traditions",
          line: "Realism, institutionalism, constructivism, critical political economy, and what the model leaves out.",
        },
        {
          label: "Thinkers and public positions",
          line: "Dated, sourced positions from people and institutions, with the scope stated.",
        },
        {
          label: "AI governance approaches",
          line: "How the main positions on frontier AI differ, and where they agree.",
        },
        {
          label: "Methods and sources",
          line: "How answers are scored, what the result supports, and where it stops.",
        },
      ],
      entry: "Open the Field Guide",
    },
    myRecord: {
      label: "My Record",
      lead: "Saved work stays on this device.",
      entry: "Open My Record",
      emptyLine: "Nothing saved on this device yet.",
      emptyLink: "Begin First Principles",
      foundationLabel: "First Principles",
      unfinishedLabel: "Unfinished",
      saved: "Saved",
      notStarted: "Not started",
      draftTemplate: "First Principles, {{answered}} of {{total}}",
      draftPlainTemplate: "First Principles, {{answered}} answered",
      domainLabels: {
        security: "Security",
        technology: "Technology",
        aiGovernance: "AI Governance",
      },
    },
  },

  works: {
    heading: "How the project works",
    frame: "The four areas are Start, Cases, Field Guide, and My Record.",
    statements: [
      { label: "First Principles", line: "The broad starting point." },
      {
        label: "Specific areas",
        line: "Security, Technology, and AI ask different questions and keep their own results.",
      },
      { label: "Cases", line: "Apply the same habits of reasoning to an actual decision." },
      {
        label: "Field Guide",
        line: "Compare the ideas behind the results and see where the model is incomplete.",
      },
    ],
    record: "My Record keeps saved work on this device.",
    note:
      "Prototype note. Cases points at the existing case library and the existing geographic route. A shipped version would merge them into one case environment instead of a second menu.",
  },
} as const

export function fillPrototypeTemplate(
  template: string,
  replacements: Readonly<Record<string, string | number>>,
) {
  return Object.entries(replacements).reduce(
    (value, [key, replacement]) => value.replaceAll(`{{${key}}}`, String(replacement)),
    template,
  )
}
