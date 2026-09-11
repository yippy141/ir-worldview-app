import { AiGovernanceReadingListSection } from "@/components/results/ai-governance-reading-list-section"
import Link from "next/link"
import { notFound } from "next/navigation"
import type { Metadata } from "next"
import { AiResultReturnLink } from "@/components/ai/ai-result-return-link"
import { AiArchetypeFingerprint } from "@/components/atlas/ai-archetype-fingerprint"
import { AiArchetypeMark } from "@/components/results/ai-archetype-mark"
import {
  aiAtlasArchetypeLeaningTag,
  getAiAtlasEntries,
  getAiAtlasEntry,
  getAiAtlasHref,
  getAiAtlasLabel,
  getAiAxisLabel,
  type AiAtlasEntry,
} from "@/lib/ai-governance-atlas-content"
import { aiArchetypeDeepProfiles } from "@/lib/ai-governance-profile-copy"
import { getAiReadingList, type ReadingEntry } from "@/lib/ai-governance-reading-lists-v2"

const atlasEntries = getAiAtlasEntries()

export function generateStaticParams() {
  return atlasEntries.map((entry) => ({ id: entry.key }))
}

export async function generateMetadata(
  { params }: { params: Promise<{ id: string }> },
): Promise<Metadata> {
  const { id } = await params
  const entry = getAiAtlasEntry(id)

  if (!entry) {
    return {
      title: "AI Atlas | AI Governance Compass",
    }
  }

  return {
    title: `${entry.label} | AI Atlas`,
    description: entry.shortSummary,
  }
}

export default async function AiAtlasDetailPage(
  { params }: { params: Promise<{ id: string }> },
) {
  const { id } = await params
  const entry = getAiAtlasEntry(id)

  if (!entry) {
    notFound()
  }

  const profile = aiArchetypeDeepProfiles[entry.key]
  const readings = getAiReadingList(entry.key)
  const neighbors = entry.closestNeighbors
    .map((neighborKey) => getAiAtlasEntry(neighborKey))
    .filter((neighbor): neighbor is AiAtlasEntry => Boolean(neighbor))
  const startingReadings = uniqueReadings([
    entry.startHere,
    ...readings.startHere.slice(0, 2),
    ...readings.practiceNow.slice(0, 2),
  ]).slice(0, 4)
  const critiqueReading = entry.critique ?? readings.bestCritique[0]

  return (
    <div className="wide-container">
      <article className="result-article reading-page">
        <section className="result-hero stack-md ai-atlas-mark-hero">
          <AiArchetypeMark archetype={entry.key} />
          <div className="ai-hero-rule" />
          <p className="ai-hero-eyebrow">AI Governance</p>
          <h1 className="ai-hero-h1">{entry.label}</h1>
          <p className="ai-hero-summary">{entry.shortSummary}</p>
          <div className="row gap-sm wrap">
            <AiResultReturnLink />
            <Link href="/ai/atlas" className="cta-secondary">Back to AI Atlas</Link>
            <Link href="/ai/field-guide" className="cta-secondary">AI Field Guide</Link>
            <Link href="/profile" className="cta-secondary">Profile</Link>
          </div>
        </section>

        <section className="result-section ai-atlas-detail-hero-grid">
          <div className="stack-md">
            <div className="stack-xs">
              <p className="eyebrow">Definition</p>
              <h2 style={{ margin: 0 }}>The argument</h2>
              <p className="result-prose" style={{ lineHeight: "1.78" }}>
                {entry.coreBelief}
              </p>
            </div>

            <div className="ai-atlas-detail-columns">
              <article className="ai-atlas-detail-note stack-xs">
                <p className="eyebrow">Institutional priorities</p>
                <ul className="content-list">
                  {entry.wantsMost.map((item) => (
                    <li key={item}>{item}</li>
                  ))}
                </ul>
              </article>
              <article className="ai-atlas-detail-note stack-xs">
                <p className="eyebrow">Risks it foregrounds</p>
                <ul className="content-list">
                  {entry.worriesMost.map((item) => (
                    <li key={item}>{item}</li>
                  ))}
                </ul>
              </article>
            </div>
          </div>

          <aside className="ai-atlas-detail-side stack-sm">
            <div className="callout stack-sm atlas-detail-fingerprint-card" style={{ margin: 0 }}>
              <div className="stack-xs">
                <p className="eyebrow">Modeled emphasis</p>
                <p className="ai-atlas-detail-lean">
                  {aiAtlasArchetypeLeaningTag[entry.key]}
                </p>
              </div>
              <AiArchetypeFingerprint archetype={entry.key} />
              <div className="atlas-tag-list" aria-label={`${entry.label} contrast axes`}>
                {entry.contrastAxes.map((axisKey) => (
                  <span key={axisKey} className="atlas-tag">
                    {getAiAxisLabel(axisKey)}
                  </span>
                ))}
              </div>
            </div>
          </aside>
        </section>

        <section className="result-section ai-atlas-detail-columns">
          <article className="stack-md">
            <div className="stack-xs">
              <p className="eyebrow">Strongest critique</p>
              <h2 style={{ margin: 0 }}>The strongest objection</h2>
              <p className="result-prose" style={{ lineHeight: "1.75" }}>
                {profile.strongestCritique}
              </p>
            </div>
            {critiqueReading ? (
              <ReadingMiniCard
                label="Critique to start with"
                reading={critiqueReading}
              />
            ) : null}
          </article>

          <article className="stack-md">
            <div className="stack-xs">
              <p className="eyebrow">Question to sit with</p>
              <h2 style={{ margin: 0 }}>The live tension</h2>
              <p className="result-prose" style={{ lineHeight: "1.75" }}>
                {entry.questionToSitWith}
              </p>
            </div>
            <div className="callout stack-xs" style={{ margin: 0 }}>
              <p style={{ fontWeight: 600 }}>International lens</p>
              <p className="muted" style={{ lineHeight: "1.65", fontSize: "0.9rem" }}>
                {entry.internationalLens}
              </p>
            </div>
          </article>
        </section>

        <section className="result-section stack-md">
          <div className="ai-result-section-intro stack-xs">
            <p className="eyebrow">Core disagreement</p>
            <h2>The disagreement</h2>
            <p className="muted" style={{ lineHeight: "1.65", maxWidth: "760px" }}>
              The closest neighbors share most of the vocabulary. The split usually comes down
              to a small number of axes where this archetype makes a different call.
            </p>
          </div>
          <p className="result-prose" style={{ lineHeight: "1.78", maxWidth: "760px" }}>
            {entry.comparisonNote}
          </p>

          <div className="ai-atlas-detail-neighbor-grid">
            {neighbors.map((neighbor) => (
              <article key={neighbor.key} className="ai-atlas-detail-neighbor stack-xs">
                <p className="eyebrow">Nearby</p>
                <h3>{neighbor.label}</h3>
                <p className="muted" style={{ lineHeight: "1.62" }}>
                  {neighbor.shortSummary}
                </p>
                <Link href={getAiAtlasHref(neighbor.key)} className="atlas-pattern-cta">
                  Open {getAiAtlasLabel(neighbor.key)} →
                </Link>
              </article>
            ))}
          </div>
        </section>

        <section className="result-section stack-md">
          <div className="ai-result-section-intro stack-xs">
            <p className="eyebrow">Policy applications</p>
            <h2>What follows in practice</h2>
            <p className="muted" style={{ lineHeight: "1.65", maxWidth: "760px" }}>
              These proposals belong to this editorial category. A similar result does not establish that you support each one.
            </p>
          </div>
          <ul className="ai-atlas-detail-implications">
            {entry.resultImplications.map((item) => (
              <li key={item}>{item}</li>
            ))}
          </ul>
        </section>

        <section className="result-section stack-md">
          <div className="ai-result-section-intro stack-xs">
            <p className="eyebrow">Questions to examine</p>
            <h2>Where the argument is tested</h2>
            <p className="muted" style={{ lineHeight: "1.65", maxWidth: "760px" }}>
              These editorial questions explore the assumptions behind the proposals. They are not a report of current events.
            </p>
          </div>
          <div className="ai-atlas-detail-debates">
            {entry.currentDebates.map((debate) => (
              <article key={debate.title} className="ai-atlas-detail-debate stack-xs">
                <h3>{debate.title}</h3>
                <p className="muted" style={{ lineHeight: "1.65", fontSize: "0.92rem" }}>
                  {debate.prompt}
                </p>
              </article>
            ))}
          </div>
        </section>

        <section className="result-section stack-md">
          <div className="ai-result-section-intro stack-xs">
            <p className="eyebrow">Starting readings</p>
            <h2>Where to begin</h2>
            <p className="muted" style={{ lineHeight: "1.65", maxWidth: "760px" }}>
              Start with the central argument, then read its strongest challenge. The full shelves are available here without completing an assessment.
            </p>
          </div>
          <div className="ai-atlas-detail-reading-grid">
            {startingReadings.map((reading) => (
              <ReadingMiniCard key={reading.id} reading={reading} />
            ))}
          </div>
          <details className="reading-record">
            <summary>Full reading shelves</summary>
            <AiGovernanceReadingListSection archetypeKey={entry.key} />
          </details>
        </section>

        <section className="result-section stack-md">
          <div className="ai-result-section-intro stack-xs">
            <p className="eyebrow">Routes</p>
            <h2>Explore the consequences</h2>
          </div>
          <div className="row gap-sm wrap">
            <AiResultReturnLink className="cta-primary" />
            <Link href="/ai/atlas" className="cta-secondary">Browse all archetypes</Link>
            <Link href="/ai/field-guide" className="cta-secondary">Read the Field Guide</Link>
            <Link href="/profile" className="cta-secondary">Open Profile</Link>
            <Link href="/decisions/who-gets-access" className="cta-secondary">Decide who gets access</Link>
            <Link href="/futures" className="cta-secondary">Explore AI trajectories</Link>
          </div>
        </section>
      </article>
    </div>
  )
}

function ReadingMiniCard({
  reading,
  label = "Reading",
}: {
  reading: ReadingEntry
  label?: string
}) {
  return (
    <article className="ai-atlas-detail-reading stack-xs">
      <p className="eyebrow">{label}</p>
      {reading.url ? (
        <a
          href={reading.url}
          target="_blank"
          rel="noopener noreferrer"
          className="ai-atlas-detail-reading__title"
        >
          {reading.title}
        </a>
      ) : (
        <p className="ai-atlas-detail-reading__title">{reading.title}</p>
      )}
      <p className="ai-atlas-detail-reading__meta">
        {reading.author} · {reading.year}
      </p>
      <p className="muted" style={{ lineHeight: "1.6", fontSize: "0.9rem" }}>
        {reading.whyItMatters}
      </p>
    </article>
  )
}

function uniqueReadings(readings: Array<ReadingEntry | undefined>): ReadingEntry[] {
  const seen = new Set<string>()

  return readings.filter((reading): reading is ReadingEntry => {
    if (!reading || seen.has(reading.id)) return false
    seen.add(reading.id)
    return true
  })
}
