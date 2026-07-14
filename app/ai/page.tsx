import Link from "next/link"
import { SectionStage } from "@/components/landing/section-stage"
import { aiTotalQuestionCountsByMode } from "@/lib/ai-governance-schema"
import { trajectories, trajectoriesUpdated } from "@/lib/futures/trajectories"
import { getSectionStage } from "@/lib/world-stage/section-stages"
import type { Metadata } from "next"
import styles from "./page.module.css"

const standardQuestionTotal = aiTotalQuestionCountsByMode.standard
const advancedQuestionTotal = aiTotalQuestionCountsByMode.analyst
const futuresStage = getSectionStage("ai-futures")

export const metadata: Metadata = {
  title: "AI & Futures — IR Worldview Inventory",
  description:
    "Map your instincts on frontier AI governance, then read twelve editorial trajectories for where advanced AI could go.",
}

export default function AiPage() {
  return (
    <div className="wide-container">
      <article className="lobby-page stack-xl">
        <section className={`stack-md ${styles.hero}`} aria-labelledby="ai-futures-heading">
          <p className="section-kicker">AI &amp; Futures</p>
          <h1 id="ai-futures-heading">The AI layer: governance choices and where they lead</h1>
          <p className={styles.heroLead}>
            Two entry points share this layer. The Compass maps your own instincts on frontier AI
            governance. The Trajectories read the longer arc those governance choices could bend.
          </p>

          <SectionStage stage={futuresStage} variant="band" className={styles.stageBand} />

          <div className={styles.entryGrid}>
            <div className={styles.entry}>
              <p className="eyebrow">Questionnaire</p>
              <h2 className={styles.entryTitle}>AI Governance Compass</h2>
              <p className={styles.entryText}>
                A structured read of your instincts across eight governance axes, from risk horizon
                to human future. Advanced mode adds denser prompts on audits, compute, security
                competition, and legitimacy.
              </p>
              <p className={styles.entryMeta}>
                {standardQuestionTotal} questions · about 8 min · advanced: {advancedQuestionTotal}
              </p>
              <div className={styles.entryActions}>
                <Link href="/ai/quiz?mode=standard" className="cta-primary">
                  Take the AI Compass
                </Link>
                <Link href="/ai/quiz?mode=advanced" className={styles.entryAltLink}>
                  Start in Advanced instead →
                </Link>
              </div>
            </div>

            <div className={styles.entry}>
              <p className="eyebrow">Editorial field map</p>
              <h2 className={styles.entryTitle}>Twelve Trajectories</h2>
              <p className={styles.entryText}>
                Twelve outcome scenarios for where sustained progress in advanced AI could take us,
                adapted with attribution from Life 3.0 and updated with current signals. Not
                predictions, and not scored.
              </p>
              <p className={styles.entryMeta}>
                {trajectories.length} scenarios · reading, not a quiz · updated {trajectoriesUpdated}
              </p>
              <div className={styles.entryActions}>
                <Link href="/futures" className="cta-primary">
                  Read the Trajectories
                </Link>
                <Link href="/ai/field-guide" className={styles.entryAltLink}>
                  Open the field guide →
                </Link>
              </div>
            </div>
          </div>

          <p className={styles.entryNote}>
            Neither surface certifies expertise or reduces the field to one permanent identity. The
            Compass result is a structured read of your answers; the Trajectories are editorial
            scenarios with named sources. The <Link href="/ai/atlas">AI Atlas</Link> holds the
            Compass&rsquo;s reference positions.
          </p>
        </section>

        <section className="lobby-related-grid">
          <div className="stack-sm">
            <p className="section-kicker">Optional depth</p>
            <h2>Where the AI layer connects to the rest of the project</h2>
            <p className="muted lobby-side-text">
              The AI result stands on its own. If you want the deeper foreign-policy layer
              underneath it, the IR Foundation and issue modules sit one click away.
            </p>
          </div>
          <div className="resource-list">
            <Link href="/quiz" className="resource-list-link">
              <span className="resource-list-copy">
                <span className="resource-list-title">Foundation Questionnaire</span>
                <span className="resource-list-text">Open the shared IR baseline.</span>
              </span>
            </Link>
            <Link href="/modules" className="resource-list-link">
              <span className="resource-list-copy">
                <span className="resource-list-title">Focus Areas</span>
                <span className="resource-list-text">See the Security and Technology theatres that sit beside AI.</span>
              </span>
            </Link>
            <Link href="/profile" className="resource-list-link">
              <span className="resource-list-copy">
                <span className="resource-list-title">Profile</span>
                <span className="resource-list-text">Keep saved IR and AI results in one place.</span>
              </span>
            </Link>
            <Link href="/method" className="resource-list-link">
              <span className="resource-list-copy">
                <span className="resource-list-title">Methods</span>
                <span className="resource-list-text">Read the guardrails and scope notes behind the whole project.</span>
              </span>
            </Link>
            <Link href="/references" className="resource-list-link">
              <span className="resource-list-copy">
                <span className="resource-list-title">References</span>
                <span className="resource-list-text">Use the bibliography while comparing positions.</span>
              </span>
            </Link>
            <Link href="/feedback?module=ai" className="resource-list-link">
              <span className="resource-list-copy">
                <span className="resource-list-title">Feedback</span>
                <span className="resource-list-text">Send notes on the AI module while this beta polish pass is in progress.</span>
              </span>
            </Link>
          </div>
        </section>
      </article>
    </div>
  )
}
