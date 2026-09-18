import Link from "next/link"
import { futuresRoutes } from "@/lib/futures/catalogue/index"
import { AiEntranceActions } from "@/components/ai/ai-entrance-actions"
import { aiTotalQuestionCountsByMode } from "@/lib/ai-governance-schema"
import type { Metadata } from "next"

const standardQuestionTotal = aiTotalQuestionCountsByMode.standard
const advancedQuestionTotal = aiTotalQuestionCountsByMode.analyst
const advancedExtra = advancedQuestionTotal - standardQuestionTotal

export const metadata: Metadata = {
  title: "AI Governance | IR Worldview Inventory",
  description: `Who should be allowed to build, release, and stop powerful AI? ${standardQuestionTotal} questions, about eight minutes.`,
}

export default function AiPage() {
  return (
    <div className="wide-container">
      <article className="lobby-page stack-xl">
        <section className="ai-landing-hero stack-md">
          <h1 className="ai-landing-hero__h1">Who should be allowed to build, release, and stop powerful AI?</h1>
          <AiEntranceActions>
          <p className="ai-landing-hero__sub">
            You take positions on release, oversight, military use, and rivalry between states.
            The result shows which of six governing approaches your answers came nearest, and
            where the closest rival approach would have decided differently.
          </p>
          </AiEntranceActions>
          <p className="ai-landing-hero__bridge">
            Advanced adds {advancedExtra} questions on compute, audits, and incident reporting.
          </p>
        </section>

        <section className="stack-md" aria-labelledby="ai-also-here">
          <div className="stack-xs">
            <h2 id="ai-also-here">Read the approaches, make a decision, or look further ahead</h2>
          </div>
          <div className="resource-list">
            <Link href="/ai/atlas" className="resource-list-link">
              <span className="resource-list-copy">
                <span className="resource-list-title">AI approaches</span>
                <span className="resource-list-text">What each one wants, worries about, and would decide.</span>
              </span>
            </Link>
            <Link href="/decisions/who-gets-access" className="resource-list-link">
              <span className="resource-list-copy">
                <span className="resource-list-title">Who gets access?</span>
                <span className="resource-list-text">A ten-minute decision exercise for a fictional research institute. No questionnaire needed.</span>
              </span>
            </Link>
            <Link href={futuresRoutes.collection} prefetch={false} className="resource-list-link">
              <span className="resource-list-copy">
                <span className="resource-list-title">AI Futures</span>
                <span className="resource-list-text">Nineteen possible worlds, and the conditions you would want in them.</span>
              </span>
            </Link>
            <Link href="/ai/field-guide" className="resource-list-link">
              <span className="resource-list-copy">
                <span className="resource-list-title">Field Guide</span>
                <span className="resource-list-text">Who can inspect, release, restrict, or stop a model, approach by approach.</span>
              </span>
            </Link>
          </div>
        </section>


      </article>
    </div>
  )
}
