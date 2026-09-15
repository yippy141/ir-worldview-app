import Link from "next/link"
import { DomainMark } from "@/components/results/domain-mark"
import { modules } from "@/lib/modules/framework"
import type { ModuleSlug } from "@/lib/modules/types"
import { resolveFoundationPayload } from "@/lib/share"
import type { Metadata } from "next"

/**
 * Reader-facing introductions. The scenes named here are cases in the
 * current banks (eastern_flank, maritime_pressure, ceasefire_accountability;
 * sovereign_stacks, open_weight_models, data_center_dependence).
 */
const introductions: Record<ModuleSlug, { covers: string; scenes: string }> = {
  security: {
    covers: "Deterrence, alliances, sanctions, and the use of force.",
    scenes:
      "Each case is set at a real table: a NATO ministerial choosing an eastern-flank posture, a coastal state deciding whose help to accept, a monitoring team watching a ceasefire fray.",
  },
  technology: {
    covers: "Export controls, chips, open models, sovereign clouds, and who writes the rules for AI.",
    scenes:
      "Each case is a budget or an access decision: a cabinet deciding whether to build a sovereign cloud, a research board choosing how far to open a capable model, a ministry signing for data-centre capacity it cannot build itself.",
  },
}

export const metadata: Metadata = {
  title: "Security and Technology | IR Worldview Inventory",
  description:
    "Two shorter questionnaires built from cases. Each gives its own result and leaves your Foundation result alone.",
}

export default async function ModulesPage(
  {
    searchParams,
  }: {
    searchParams: Promise<{ foundation?: string }>
  },
) {
  const { foundation } = await searchParams
  const verifiedFoundation = foundation && resolveFoundationPayload(foundation)
    ? foundation
    : undefined

  return (
    <div className="wide-container reading-page">
      <article className="lobby-page stack-xl">
        <section className="lobby-hero lobby-hero--plain">
          <div className="lobby-hero-grid">
            <div className="stack-lg">

              <h1>Security and Technology</h1>
              <p className="lobby-lead">
                An ally asks for troops on its border. A ministry decides whether to fund public
                compute. You choose, and the result shows which logic you kept returning to. Each
                questionnaire gives its own result and leaves your Foundation result alone.
              </p>

            </div>


          </div>
        </section>

        <section id="available-modules" className="stack-md lobby-band" aria-label="The two questionnaires">
          <div className="module-choice-grid">
            {modules.map((moduleDefinition) => {
              const intro = introductions[moduleDefinition.slug]
              const href = `/modules/${moduleDefinition.slug}${verifiedFoundation ? `?foundation=${encodeURIComponent(verifiedFoundation)}` : ""}`

              return (
                <article key={moduleDefinition.slug} className="module-choice-card module-choice-card--editorial stack-md">
                  <div className="stack-sm">
                    <div className="stack-xs">
                      <DomainMark domain={moduleDefinition.slug} compact />
                      <h2>{moduleDefinition.shortTitle}</h2>
                      <p className="module-choice-question">{intro.covers}</p>
                      <p className="lobby-entry-subtitle">{intro.scenes}</p>
                    </div>
                    <div className="stack-xs">
                      <Link href={href} className="cta-primary">
                        Start {moduleDefinition.shortTitle}
                      </Link>
                      <p className="module-choice-note">
                        Standard: {moduleDefinition.questionsByMode.standard.length} cases, {moduleDefinition.timeEstimate.standard}.
                        Advanced: {moduleDefinition.questionsByMode.analyst.length} cases, {moduleDefinition.timeEstimate.analyst}.
                      </p>
                    </div>
                  </div>

                  <dl className="module-choice-meta">
                    <div>
                      <dt>The result reads three things</dt>
                      {moduleDefinition.lanes.map((lane) => (
                        <dd key={lane.key}>{lane.description}</dd>
                      ))}
                    </div>
                  </dl>
                </article>
              )
            })}
          </div>
        </section>

        <section className="stack-sm lobby-band">
          <p className="muted lobby-section-copy">
            Already have results? <Link href="/profile">Open Profile</Link>. For who should govern
            powerful AI, <Link href="/ai">AI Governance</Link> is its own questionnaire.
          </p>
        </section>
      </article>
    </div>
  )
}
