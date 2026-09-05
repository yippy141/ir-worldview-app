/* eslint-disable @next/next/no-html-link-for-pages -- Full document navigation is intentional: leaving clears ephemeral answers and avoids speculative prefetch. */
import { ReplayMarks } from "./hero-marks"
import { makeSyntheticRecord, foundationAnswers, aiAnswers } from "./fixtures"
import styles from "./payoff.module.css"


export default async function Experiment({ searchParams }: { searchParams: Promise<{ fixture?: string; episode?: string }> }) {
  const [{ ResultReading, MissingReading }, { EpisodePlayer }, { episodes, syntheticPrior, completeEpisode }] = await Promise.all([
    import("./result-reading"), import("./episode-player"), import("./episodes"),
  ])
  const prior = completeEpisode(episodes[syntheticPrior.episode], syntheticPrior.first, syntheticPrior.second)!
  const params = await searchParams
  const fixture = ["foundation", "ai", "missing", "episode-first", "returning", "counterexample", "ai-pair-low", "ai-pair-mid"].includes(params.fixture ?? "") ? params.fixture! : "foundation"
  const episodeId = params.episode === "access" || params.episode === "verify" ? params.episode : fixture === "returning" ? "access" : fixture === "episode-first" ? "verify" : null
  return <main id="site-main" className={styles.page}>
    <div className={styles.devControls}>
      <span>Local experiment · examples are synthetic</span>
      <form method="get"><label htmlFor="fixture">Development fixture</label><select id="fixture" name="fixture" defaultValue={episodeId && !params.fixture ? "episode-first" : fixture}>
        <option value="foundation">Foundation example</option><option value="ai">AI Governance example</option><option value="missing">Incomplete / legacy evidence</option><option value="episode-first">Episode first, no baseline</option><option value="returning">Returning reader, synthetic history</option>
      <option value="counterexample">Valid Foundation counterexample</option><option value="ai-pair-low">AI pair: both disagree</option><option value="ai-pair-mid">AI pair: both midpoint</option></select><button type="submit">Open</button></form>
      {!episodeId && <ReplayMarks />}
      <span><a href="/dev/result-payoff?episode=verify">Verification episode</a>{" · "}<a href="/dev/result-payoff?episode=access">Access episode</a></span>
    </div>
    {fixture === "returning" && <div className={styles.returning}>
      <h2>A new decision is ready to try</h2><p>Who decides which qualified outsiders get to test a model? Open the access episode below; no baseline retake is needed.</p>
      <p className={styles.small}>Synthetic prior completion: {episodes[syntheticPrior.episode].title} · {syntheticPrior.completedOn}. Fixture-only history; nothing was read from this browser.</p>
      <details><summary>Inspect fictional prior completion</summary><p>{prior.observation.text}</p><p>These are authored fixture selections, not yours.</p></details>
    </div>}
    {episodeId ? <EpisodePlayer episode={episodes[episodeId]} /> : fixture === "missing" ? <MissingReading /> : <ResultReading instrument={fixture.startsWith("ai") ? "ai" : "foundation"} record={fixture === "counterexample" ? makeSyntheticRecord("foundation", { ...foundationAnswers, sc2: 1, in2: 1, rs2: 1 }) : fixture === "ai-pair-low" || fixture === "ai-pair-mid" ? makeSyntheticRecord("ai-governance", { ...aiAnswers, gp1: fixture === "ai-pair-low" ? 1 : 4, gp2: fixture === "ai-pair-low" ? 1 : 4 }) : undefined} />}
    {!episodeId && <footer className={styles.footer}><p>Follow-ups remain in page memory. Leaving or resetting clears them. Existing saved results stay untouched.</p><a href="/">Close experiment</a></footer>}
  </main>
}
