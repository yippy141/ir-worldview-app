import {
  getAiReadingList,
} from "@/lib/ai-governance-reading-lists-v2"
import type { AiArchetypeKey } from "@/lib/ai-governance-types"
import { ReadingPathSection } from "@/components/results/reading-path-section"

export function AiGovernanceReadingListSection({
  archetypeKey,
}: {
  archetypeKey: AiArchetypeKey
}) {
  const buckets = getAiReadingList(archetypeKey)
  const paths = [
    {
      key: "start-here",
      heading: "Start here",
      subheading:
        "Shared field maps and baseline texts before you settle into one governance camp.",
      entries: buckets.startHere.map((entry) => ({
        id: entry.id,
        title: entry.title,
        author: entry.author,
        year: entry.year,
        note: entry.whyItMatters,
        url: entry.url,
      })),
      links: [
        {
          href: "/ai/atlas",
          label: "Browse the AI atlas",
          text: "See nearby archetypes and the reading shelves that sit beside them.",
        },
      ],
    },
    {
      key: "go-deeper",
      heading: "Go deeper",
      subheading:
        "Operational frameworks, official documents, and live policy tools that show how these debates cash out in practice.",
      entries: buckets.practiceNow.map((entry) => ({
        id: entry.id,
        title: entry.title,
        author: entry.author,
        year: entry.year,
        note: entry.whyItMatters,
        url: entry.url,
      })),
      links: [
        {
          href: "/method",
          label: "Read methods",
          text: "See the scope, guardrails, and limits behind the whole project.",
        },
        {
          href: "/references",
          label: "Open references",
          text: "Use the broader bibliography when you want a wider shelf than the result page alone.",
        },
      ],
    },
    {
      key: "challenge-your-view",
      heading: "Challenge your view",
      subheading:
        "The strongest objections to the instincts your result is likely to reward. These are worth reading carefully rather than dismissing.",
      entries: buckets.bestCritique.map((entry) => ({
        id: entry.id,
        title: entry.title,
        author: entry.author,
        year: entry.year,
        note: entry.whyItMatters,
        url: entry.url,
      })),
      links: [
        {
          href: "/modules",
          label: "Cross-check in IR modules",
          text: "Pressure-test the AI result against the Security and Technology overlays.",
        },
      ],
    },
    {
      key: "widen-the-frame",
      heading: "Widen the frame",
      subheading:
        "How these debates look beyond U.S. and European defaults, including Chinese and broader global-governance lenses.",
      entries: buckets.chinaAndGlobalLens.map((entry) => ({
        id: entry.id,
        title: entry.title,
        author: entry.author,
        year: entry.year,
        note: entry.whyItMatters,
        url: entry.url,
      })),
      links: [
        {
          href: "/references",
          label: "Keep browsing the shelf",
          text: "Move from these entry points into the full bibliography when you want more range.",
        },
      ],
    },
  ]

  return (
    <ReadingPathSection
      title="Reading paths"
      intro="These shelves are not endorsements. They are structured ways to extend, deepen, and stress-test this result without leaving the product's existing source set."
      paths={paths}
    />
  )
}
