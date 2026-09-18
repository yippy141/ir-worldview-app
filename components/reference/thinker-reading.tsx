import Link from "next/link"
import { DestinationLink } from "@/components/layout/destination-link"
import type { AdditionalThinker } from "@/content/reading/additional-thinkers"

export function ThinkerReading({ thinker }: { thinker: AdditionalThinker }) {
  return <article className="container reading-page info-page stack-lg" data-thinker-reading>
    <DestinationLink destination="thinkers" />
    <header className="article-header stack-sm">
      <h1>{thinker.name}</h1><p className="muted">{thinker.topic}</p>
    </header>
    <section className="stack-md"><h2>The argument</h2><p>{thinker.argument}</p><p>{thinker.explanation}</p></section>
    <section className="stack-sm"><h2>A question to consider</h2><p>{thinker.question}</p><p className="small muted">An illustration for this Library, not a policy recommendation attributed to {thinker.name}.</p></section>
    <section className="stack-sm"><h2>Keep in mind</h2><p>{thinker.limit}</p><p className="muted">This is a reading essay. It has no questionnaire scores or position on the Worldview Map.</p></section>
    <section className="stack-sm"><h2>Read the source</h2><p><a href={thinker.source.url} target="_blank" rel="noopener noreferrer">{thinker.source.title}<span className="sr-only"> (opens in another tab)</span> ↗</a></p><p className="small muted">{thinker.source.publisher} · {thinker.year}</p><p>{thinker.source.scope}</p></section>
    <Link href="/explore/reference">Browse all thinkers →</Link>
  </article>
}
