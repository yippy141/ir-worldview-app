import Link from "next/link"
import { notFound } from "next/navigation"
import {
  archetypeEvidence,
  archetypeEvidenceSlug,
  getArchetypeEvidenceBySlug,
  parseArchetypeEvidenceReturnPath,
} from "@/lib/archetype-evidence"
import { getArchetypeBySlug } from "@/lib/archetypes"
import type { Metadata } from "next"

interface Props {
  params: Promise<{ slug: string }>
  searchParams: Promise<{ from?: string | string[] }>
}

export function generateStaticParams() {
  return archetypeEvidence.map(({ code }) => ({
    slug: archetypeEvidenceSlug(code),
  }))
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params
  const resolved = getArchetypeEvidenceBySlug(slug)
  const archetype = getArchetypeBySlug(slug)

  if (!resolved) {
    return {
      title: archetype
        ? `${archetype.name}: historical analogue — IR Worldview Inventory`
        : "Historical analogue — IR Worldview Inventory",
    }
  }

  return {
    title: `${resolved.archetype.name}: historical analogue — IR Worldview Inventory`,
    description:
      `Why ${resolved.analogue.label} is used as a historical analogue for ` +
      `${resolved.archetype.name}, and where the comparison breaks down.`,
  }
}

export default async function ArchetypeEvidencePage({
  params,
  searchParams,
}: Props) {
  const [{ slug }, { from }] = await Promise.all([params, searchParams])
  const identity = getArchetypeBySlug(slug)
  if (!identity) notFound()

  const resolved = getArchetypeEvidenceBySlug(slug)
  const returnPath = parseArchetypeEvidenceReturnPath(from)

  if (!resolved) {
    return (
      <article className="container archetype-evidence-page stack-xl">
        <header className="stack-md">
          <Link
            href={returnPath ?? "/quiz"}
            className="archetype-evidence-back"
          >
            {returnPath ? "← Back to your result" : "← Take the Foundation"}
          </Link>
          <div className="stack-sm">
            <p className="eyebrow">Historical analogue</p>
            <h1>{identity.name}</h1>
            <p className="foundation-result-code">{identity.code}</p>
          </div>
        </header>
        <section className="panel stack-sm" role="status">
          <h2>Historical comparison under review</h2>
          <p>
            The historical comparison for this archetype is temporarily
            unavailable while its evidence record is reviewed.
          </p>
        </section>
      </article>
    )
  }

  const { archetype, analogue, evidence } = resolved

  return (
    <article className="container archetype-evidence-page stack-xl">
      <header className="stack-md">
        <Link
          href={returnPath ?? "/quiz"}
          className="archetype-evidence-back"
        >
          {returnPath ? "← Back to your result" : "← Take the Foundation"}
        </Link>
        <div className="stack-sm">
          <p className="eyebrow">Historical analogue</p>
          <h1>{archetype.name}</h1>
          <p className="foundation-result-code">{archetype.code}</p>
          <p className="archetype-evidence-analogue">
            {analogue.label} <span>· {analogue.year}</span>
          </p>
        </div>
        <p className="archetype-evidence-intro">
          This is a comparison, not an identity or endorsement. It anchors one
          part of the archetype in a documented argument or practice; it does
          not claim that a result reproduces the historical case.
        </p>
      </header>

      <div className="archetype-evidence-grid">
        <section className="panel stack-sm">
          <h2>Why this comparison fits</h2>
          <p>{evidence.whyItFits}</p>
        </section>
        <section className="panel stack-sm">
          <h2>Where the comparison breaks</h2>
          <p>{evidence.whereItBreaks}</p>
        </section>
      </div>

      <p className="muted result-note" role="note">
        {evidence.qualification}
      </p>

      {evidence.nameNote ? (
        <section
          className="panel stack-sm archetype-evidence-name-note"
          aria-labelledby="archetype-name-note-heading"
        >
          <h2 id="archetype-name-note-heading">A note on the name</h2>
          <p>{evidence.nameNote}</p>
        </section>
      ) : null}

      <section className="stack-md" aria-labelledby="archetype-sources-heading">
        <h2 id="archetype-sources-heading">Sources and further reading</h2>
        <ul className="archetype-evidence-sources">
          <li>
            <a href={analogue.href} target="_blank" rel="noreferrer">
              {analogue.label}
            </a>
            <span>Analogue overview</span>
          </li>
          {evidence.sources.map((source) => (
            <li key={source.href}>
              <a href={source.href} target="_blank" rel="noreferrer">
                {source.label}
              </a>
              <span>Provisional source</span>
            </li>
          ))}
        </ul>
      </section>

      <footer className="archetype-evidence-footer">
        <p>
          Archetypes summarize a continuous, multidimensional profile. They do
          not change the underlying Foundation score.
        </p>
        <Link href="/method">Read the method →</Link>
      </footer>
    </article>
  )
}
