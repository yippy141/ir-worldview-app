import type { Metadata } from "next"
import Link from "next/link"
import { trajectories, trajectoriesUpdated } from "@/lib/futures/trajectories"
import { TrajectoryMap } from "@/components/futures/trajectory-map"
import { TrajectoryCard } from "@/components/futures/trajectory-card"
import { departure } from "@/lib/futures/departure"
import { futuresSources } from "@/lib/futures/sources"

export const metadata: Metadata = {
  title: "Twelve Trajectories | IR Worldview Inventory",
  description:
    "An editorial field map of twelve overlapping outcome scenarios adapted from Max Tegmark's Life 3.0. Source premises and project interpretations, never scored.",
}

export default function FuturesPage() {
  return (
    <div className="wide-container">
      <div className="article-header stack-sm">
        <p className="eyebrow">Editorial field map</p>
        <h1>Twelve Trajectories</h1>
        <p className="muted" style={{ lineHeight: "1.7", fontSize: "1.05rem", maxWidth: "620px" }}>
          A field map of where sustained progress in advanced AI could take us. The twelve
          trajectories below are overlapping outcome scenarios. They are not forecasts, rankings, or
          scored results. Nothing here feeds the inventory or your Profile. The map gives the debate a
          shared shape: the original premises, this project’s extensions, and the questions they raise.
        </p>
        <p className="muted" style={{ lineHeight: "1.7", maxWidth: "620px" }}>
          Read the map for orientation, then open any card for the reasoning behind it.
        </p>
      </div>

      <section className="article-section stack-sm" aria-labelledby="departure-link-title">
        <h2 id="departure-link-title">An invitation to leave Earth</h2>
        <p className="muted" style={{ maxWidth: "620px", lineHeight: "1.7" }}>An AI offers settlements beyond Earth. Those who stay keep the tools and govern themselves. Consider departure, return and the authority it leaves behind in a separate, unscored exercise.</p>
        <p><Link href={departure.href} prefetch={false} className="cta-secondary">Try {departure.title} · English draft</Link></p>
      </section>

      <hr className="divider" />

      {/* Map */}
      <div className="article-section stack-sm">
        <div className="stack-xs">
          <h2>The field</h2>
          <p className="muted" style={{ lineHeight: "1.65", maxWidth: "620px" }}>
            Two questions organize the space. Left to right: is control over advanced AI broadly
            distributed, or held by a single actor? Top to bottom: do humans still steer outcomes,
            or are they sidelined? Placements are an authored reading for orientation, not a
            measurement.
          </p>
        </div>
        <TrajectoryMap />
      </div>

      <hr className="divider" />

      {/* Card grid */}
      <div className="article-section stack-md">
        <div className="stack-xs">
          <h2>The twelve trajectories</h2>
          <p className="muted" style={{ lineHeight: "1.65", maxWidth: "620px" }}>
            Each card distinguishes the original premise from our interpretation. Expand it for
            source context, possible assumptions, criticism and unresolved questions.
          </p>
        </div>
        <div className="trajectory-grid">
          {trajectories.map((trajectory) => (
            <TrajectoryCard key={trajectory.id} trajectory={trajectory} />
          ))}
        </div>
      </div>

      <hr className="divider" />

      {/* Attribution + scope */}
      <div className="article-section stack-sm">
        <h2>Source and scope</h2>
        <p style={{ lineHeight: "1.7", maxWidth: "620px" }}>
          The twelve scenarios are adapted, with attribution, from the aftermath scenarios in Max
          Tegmark&apos;s{" "}
          <a
            href={futuresSources.book.url}
            target="_blank"
            rel="noopener noreferrer"
            style={{ color: "var(--accent)" }}
          >
            Life 3.0
          </a>{" "}
          (Knopf, 2017), chapter 5. Original names remain visible. <a href={futuresSources.aftermath.url}>FLI’s reference</a> anchors the short premise paraphrases. The descriptions, assumptions, criticism and extensions are this project’s editorial writing. Attribution does not imply permission or endorsement.
        </p>
        <p className="muted" style={{ lineHeight: "1.7", maxWidth: "620px" }}>
          This is an editorial layer. It is never scored, never feeds the instrument, and does not
          classify the reader. The trajectories are families of nearby outcomes, not a fixed menu;
          earlier unsourced current-development and community claims are withheld from display.
          The historical records from {trajectoriesUpdated} remain preserved. Source premises checked 11 September 2026. Map placements are editorial, can overlap and may concern different time horizons.
        </p>
      </div>
    </div>
  )
}
