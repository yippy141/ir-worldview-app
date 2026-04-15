import { getReadingBuckets, type ReadingEntry } from "@/lib/ai-governance-reading-lists"
import type { AiArchetypeKey } from "@/lib/ai-governance-types"

export function AiGovernanceReadingListSection({
  archetypeKey,
}: {
  archetypeKey: AiArchetypeKey
}) {
  const buckets = getReadingBuckets(archetypeKey)

  return (
    <section className="result-section stack-md">
      <div className="ai-result-section-intro stack-xs result-prose">
        <h2>Reading list</h2>
        <p className="ai-result-body muted">
          Four curated entry points. These are not endorsements — they are the sources most useful
          for deepening, extending, and stress-testing the position your result reflects.
        </p>
      </div>

      <div className="stack-md">
        <ReadingBucket
          heading="Start here"
          subheading="Foundational framings that map the governance debate regardless of where you sit in it."
          entries={buckets.startHere}
        />

        <ReadingBucket
          heading="For your type"
          subheading="Sources that reason from premises close to yours — useful for understanding the strongest version of your position."
          entries={buckets.forYourType}
        />

        <ReadingBucket
          heading="Best critique"
          subheading="The most serious challenges to the assumptions behind your result. These are worth reading carefully rather than dismissing."
          entries={buckets.bestCritique}
        />

        <ReadingBucket
          heading="China and global lens"
          subheading="How these debates look beyond U.S. and European contexts — including non-Western governance frameworks and the Global South perspective."
          entries={buckets.chinaAndGlobalLens}
        />
      </div>
    </section>
  )
}

function ReadingBucket({
  heading,
  subheading,
  entries,
}: {
  heading: string
  subheading: string
  entries: ReadingEntry[]
}) {
  return (
    <div className="stack-sm">
      <div className="stack-xs">
        <h3 style={{ fontSize: "1rem", fontWeight: 700, margin: 0 }}>{heading}</h3>
        <p className="muted" style={{ fontSize: "0.825rem", lineHeight: "1.55", margin: 0 }}>
          {subheading}
        </p>
      </div>
      <div className="stack-sm">
        {entries.map((entry) => (
          <ReadingItem key={entry.id} entry={entry} />
        ))}
      </div>
    </div>
  )
}

function ReadingItem({ entry }: { entry: ReadingEntry }) {
  return (
    <article
      className="ai-result-card stack-xs"
      style={{ padding: "14px 18px" }}
    >
      <div>
        {entry.url ? (
          <a
            href={entry.url}
            target="_blank"
            rel="noopener noreferrer"
            style={{
              fontWeight: 600,
              fontSize: "0.9rem",
              color: "var(--accent)",
              textDecoration: "none",
              lineHeight: "1.4",
            }}
          >
            {entry.title}
          </a>
        ) : (
          <p
            style={{
              fontWeight: 600,
              fontSize: "0.9rem",
              margin: 0,
              lineHeight: "1.4",
            }}
          >
            {entry.title}
          </p>
        )}
        <p
          className="muted"
          style={{ fontSize: "0.78rem", margin: "3px 0 0", lineHeight: "1.4" }}
        >
          {entry.author} · {entry.year}
        </p>
      </div>
      <p
        className="ai-result-body muted"
        style={{ fontSize: "0.85rem", margin: 0 }}
      >
        {entry.description}
      </p>
    </article>
  )
}
