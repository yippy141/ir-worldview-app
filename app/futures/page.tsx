import type { Metadata } from "next"
import { trajectories, trajectoriesUpdated } from "@/lib/futures/trajectories"
import { TrajectoryMap } from "@/components/futures/trajectory-map"
import { TrajectoryCard } from "@/components/futures/trajectory-card"

export const metadata: Metadata = {
  title: "Twelve Trajectories | IR Worldview Inventory",
  description:
    "An editorial field map of where advanced AI could take us: twelve outcome scenarios adapted from Max Tegmark's Life 3.0 and updated with 2026 signals. Not predictions, not scored.",
}

export default function FuturesPage() {
  return (
    <div className="wide-container">
      <div className="article-header stack-sm">
        <p className="eyebrow">Editorial field map</p>
        <h1>Twelve Trajectories</h1>
        <p className="muted" style={{ lineHeight: "1.7", fontSize: "1.05rem", maxWidth: "620px" }}>
          A field map of where sustained progress in advanced AI could take us. The twelve
          trajectories below are distinct outcome scenarios. They are not forecasts, rankings, or
          scored results. Nothing here feeds the inventory or your Profile. The map gives the debate a
          shared shape: what each outcome assumes, who takes it seriously, and which 2026 signals
          bear on it.
        </p>
        <p className="muted" style={{ lineHeight: "1.7", maxWidth: "620px" }}>
          Read the map for orientation, then open any card for the reasoning behind it.
        </p>
      </div>

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
            Each card opens with a plain-English summary. Expand it for how a path might come about,
            who takes it seriously and the strongest objection, the 2026 signals worth watching, and
            where serious people still disagree.
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
            href="https://en.wikipedia.org/wiki/Life_3.0"
            target="_blank"
            rel="noopener noreferrer"
            style={{ color: "var(--accent)" }}
          >
            Life 3.0
          </a>{" "}
          (Knopf, 2017), chapter 5. The scenario names are kept or lightly adapted; every summary,
          assumption, signal, and dispute is original writing, rewritten and updated to mid-2026.
        </p>
        <p className="muted" style={{ lineHeight: "1.7", maxWidth: "620px" }}>
          This is an editorial layer. It is never scored, never feeds the instrument, and does not
          classify the reader. The trajectories are families of nearby outcomes, not a fixed menu;
          the 2026 signals are illustrative of the current debate, not evidence that any path is
          arriving. Signals last reviewed {trajectoriesUpdated}.
        </p>
      </div>
    </div>
  )
}
