import Link from "next/link"
import { aiArchetypeDeepProfiles } from "@/lib/ai-governance-profile-copy"
import { getReadingBuckets } from "@/lib/ai-governance-reading-lists"
import { archetypeDescriptions, archetypeLabelFromKey } from "@/lib/ai-governance-results"
import type { AiArchetypeKey } from "@/lib/ai-governance-types"
import type { Metadata } from "next"

const atlasKeys: AiArchetypeKey[] = [
  "precautionarySteward",
  "strategicCompetitor",
  "coordinationArchitect",
  "democraticGuardrailist",
  "stateCapacityBuilder",
  "openEcosystemBuilder",
]

const atlasEntries = atlasKeys.map((key) => {
  const profile = aiArchetypeDeepProfiles[key]
  const readings = getReadingBuckets(key)

  return {
    key,
    label: archetypeLabelFromKey(key),
    description: archetypeDescriptions[key],
    governingInstinct: profile.governingInstinct,
    questionToSitWith: profile.questionToSitWith,
    startHere: readings.forYourType[0],
    critique: readings.bestCritique[0],
  }
})

const sharedReadings = getReadingBuckets(atlasKeys[0]).startHere.slice(0, 4)

export const metadata: Metadata = {
  title: "Atlas — AI Governance Compass",
  description:
    "Browse the modeled AI-governance families, their central instincts, and a concise reading path into the field.",
}

export default function AiAtlasPage() {
  return (
    <div className="wide-container">
      <article className="result-article">
        <section className="result-hero stack-md">
          <div className="ai-hero-rule" />
          <p className="ai-hero-eyebrow">AI Governance Compass</p>
          <h1 className="ai-hero-h1">AI Governance Atlas</h1>
          <p className="ai-hero-summary">
            These six families are the shorthand archetypes used in the AI result layer. They are
            summaries of recurring patterns inside the model, not natural kinds and not the full
            field of AI governance thought.
          </p>
          <div className="row gap-sm wrap">
            <Link href="/ai" className="cta-secondary">Back to AI home</Link>
            <Link href="/ai/quiz" className="cta-primary">Take the inventory</Link>
          </div>
        </section>

        <section className="result-section stack-lg">
          <div className="profile-module-grid">
            <div className="callout stack-sm">
              <p style={{ fontWeight: 600, margin: 0 }}>How to use the atlas</p>
              <p className="muted" style={{ lineHeight: "1.68", margin: 0 }}>
                Read these as reference families that help interpret a continuous profile. Real
                people often borrow from more than one logic depending on the issue, institution,
                or level of analysis.
              </p>
            </div>

            <div className="callout stack-sm">
              <p style={{ fontWeight: 600, margin: 0 }}>What it leaves open</p>
              <p className="muted" style={{ lineHeight: "1.68", margin: 0 }}>
                The atlas does not claim exhaustive coverage of the field, and the quiz result can
                still be mixed even when one archetype leads. Modifiers and axis scores matter as
                much as the headline label.
              </p>
            </div>
          </div>

          <div className="atlas-pattern-grid">
            {atlasEntries.map((entry) => (
              <article key={entry.key} className="explore-card ai-atlas-card stack-sm">
                <div className="stack-xs">
                  <p className="eyebrow">Modeled family</p>
                  <p
                    style={{
                      fontWeight: 600,
                      fontFamily: "Georgia, 'Times New Roman', serif",
                      fontSize: "1.1rem",
                      lineHeight: "1.28",
                      margin: 0,
                    }}
                  >
                    {entry.label}
                  </p>
                  <p className="muted" style={{ lineHeight: "1.68", margin: 0 }}>
                    {entry.description}
                  </p>
                </div>

                <div className="stack-xs">
                  <p className="eyebrow">Central instinct</p>
                  <p style={{ lineHeight: "1.68", fontSize: "0.92rem", margin: 0 }}>
                    {entry.governingInstinct}
                  </p>
                </div>

                <div className="ai-atlas-reading stack-xs">
                  <p className="eyebrow">Pressure test</p>
                  <p className="muted" style={{ lineHeight: "1.65", margin: 0 }}>
                    {entry.questionToSitWith}
                  </p>
                </div>

                {entry.startHere ? (
                  <div className="ai-atlas-reading stack-xs">
                    <p className="eyebrow">Read first</p>
                    <p style={{ fontWeight: 600, fontSize: "0.9rem", margin: 0 }}>
                      {entry.startHere.title}
                    </p>
                    <p className="muted" style={{ fontSize: "0.82rem", lineHeight: "1.55", margin: 0 }}>
                      {entry.startHere.author} · {entry.startHere.year}
                    </p>
                  </div>
                ) : null}

                {entry.critique ? (
                  <div className="ai-atlas-reading stack-xs">
                    <p className="eyebrow">Best critique</p>
                    <p className="muted" style={{ lineHeight: "1.6", margin: 0 }}>
                      {entry.critique.title}
                    </p>
                  </div>
                ) : null}
              </article>
            ))}
          </div>
        </section>

        <section className="result-section stack-md">
          <div className="ai-result-section-intro stack-xs">
            <p className="eyebrow">Shared starting points</p>
            <h2>Read these before you settle on a camp</h2>
          </div>

          <div>
            {sharedReadings.map((reading) => (
              <div key={reading.id} className="neighbor-entry">
                <p style={{ fontWeight: 600, marginBottom: "4px" }}>{reading.title}</p>
                <p className="muted" style={{ fontSize: "0.84rem", marginBottom: "6px" }}>
                  {reading.author} · {reading.year}
                </p>
                <p className="muted" style={{ lineHeight: "1.65", margin: 0 }}>
                  {reading.description}
                </p>
              </div>
            ))}
          </div>

          <div className="atlas-inline-links">
            <Link href="/method" style={{ color: "var(--accent)" }}>
              Methods →
            </Link>
            <Link href="/references" style={{ color: "var(--accent)" }}>
              References →
            </Link>
          </div>
        </section>
      </article>
    </div>
  )
}
