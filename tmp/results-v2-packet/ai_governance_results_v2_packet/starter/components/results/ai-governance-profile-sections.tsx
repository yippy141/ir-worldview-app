import {
  buildAiGovernanceDeepDive,
  getPrimaryAxisSummary,
} from "@/lib/ai-governance-results-v2"
import { AiResult } from "@/lib/ai-governance-types"

export function AiGovernanceProfileSections({ result }: { result: AiResult }) {
  const deepDive = buildAiGovernanceDeepDive(result)

  return (
    <div className="space-y-8">
      <section className="rounded-2xl border border-black/10 bg-white p-6 md:p-8">
        <div className="flex flex-col gap-3 md:flex-row md:items-start md:justify-between">
          <div className="space-y-3">
            <p className="text-xs font-medium uppercase tracking-[0.18em] text-black/55">
              {deepDive.clarityLabel}
              {deepDive.comparison.hybridLabel ? ` - ${deepDive.comparison.hybridLabel}` : ""}
            </p>
            <h2 className="font-serif text-3xl leading-tight md:text-4xl">
              Your governing instinct
            </h2>
            <p className="max-w-3xl text-base leading-8 text-black/80 md:text-lg">
              {deepDive.governingInstinct}
            </p>
          </div>
          <div className="rounded-2xl border border-black/10 bg-neutral-50 px-4 py-3 text-sm text-black/70 md:max-w-sm">
            <div className="font-medium text-black">Profile clarity</div>
            <div className="mt-1 text-2xl font-semibold text-black">{result.clarity} / 100</div>
            <p className="mt-2 leading-6">
              A higher score means your top archetype pulled clearly ahead of the field. A lower score means you sit in a more mixed or hybrid zone.
            </p>
          </div>
        </div>

        <div className="mt-6 grid gap-4 md:grid-cols-2">
          <div className="rounded-2xl border border-black/10 bg-neutral-50 p-5">
            <div className="text-xs font-medium uppercase tracking-[0.18em] text-black/55">
              Shareable read
            </div>
            <p className="mt-3 text-base leading-7 text-black/80">{deepDive.shareBlurb}</p>
          </div>
          <div className="rounded-2xl border border-black/10 bg-neutral-50 p-5">
            <div className="text-xs font-medium uppercase tracking-[0.18em] text-black/55">
              Strongest signals
            </div>
            <p className="mt-3 text-base leading-7 text-black/80">
              {getPrimaryAxisSummary(result.axisScores)}
            </p>
          </div>
        </div>
      </section>

      <section className="space-y-4">
        <div>
          <h2 className="font-serif text-3xl leading-tight">Likely policy package</h2>
          <p className="mt-2 max-w-3xl text-base leading-7 text-black/75">
            These are the policy instincts that most naturally follow from your result. They are not fixed party positions. They are the directions your worldview pulls when concrete governance choices arrive.
          </p>
        </div>

        <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
          {deepDive.policySignals.map((signal) => (
            <article
              key={signal.title}
              className="rounded-2xl border border-black/10 bg-white p-5"
            >
              <div className="text-xs font-medium uppercase tracking-[0.18em] text-black/55">
                {signal.title}
              </div>
              <div className="mt-3 text-xl font-semibold text-black">{signal.stance}</div>
              <p className="mt-3 text-sm leading-6 text-black/75">{signal.explanation}</p>
            </article>
          ))}
        </div>
      </section>

      <section className="grid gap-4 lg:grid-cols-[1.2fr_0.8fr]">
        <article className="rounded-2xl border border-black/10 bg-white p-6">
          <h2 className="font-serif text-3xl leading-tight">International order implications</h2>
          <p className="mt-2 text-base leading-7 text-black/75">
            This is where your AI worldview becomes geopolitical. These points are especially useful for thinking about U.S.-China rivalry, middle-power dependence, standards politics, and whether legitimacy has to travel beyond one lab or one state.
          </p>
          <ul className="mt-5 space-y-3 text-sm leading-7 text-black/80">
            {deepDive.internationalOrder.map((item) => (
              <li key={item} className="rounded-xl border border-black/10 bg-neutral-50 px-4 py-3">
                {item}
              </li>
            ))}
          </ul>
        </article>

        <article className="rounded-2xl border border-black/10 bg-white p-6">
          <h2 className="font-serif text-3xl leading-tight">What would change your mind</h2>
          <p className="mt-2 text-base leading-7 text-black/75">
            Worldviews are strongest when they can say what evidence would actually move them.
          </p>
          <ul className="mt-5 space-y-3 text-sm leading-7 text-black/80">
            {deepDive.evidenceShift.map((item) => (
              <li key={item} className="rounded-xl border border-black/10 bg-neutral-50 px-4 py-3">
                {item}
              </li>
            ))}
          </ul>
        </article>
      </section>

      <section className="space-y-4">
        <div>
          <h2 className="font-serif text-3xl leading-tight">Pressure points</h2>
          <p className="mt-2 max-w-3xl text-base leading-7 text-black/75">
            These are the places where your values and strategic instincts can pull in different directions under pressure.
          </p>
        </div>

        <div className="grid gap-4 md:grid-cols-3">
          {deepDive.tensions.map((tension) => (
            <article
              key={`${tension.title}-${tension.text}`}
              className="rounded-2xl border border-black/10 bg-white p-5"
            >
              <h3 className="text-lg font-semibold leading-7 text-black">{tension.title}</h3>
              <p className="mt-3 text-sm leading-6 text-black/75">{tension.text}</p>
            </article>
          ))}
        </div>
      </section>

      <section className="grid gap-4 lg:grid-cols-2">
        <article className="rounded-2xl border border-black/10 bg-white p-6">
          <div className="text-xs font-medium uppercase tracking-[0.18em] text-black/55">
            Runner-up comparison
          </div>
          <h2 className="mt-2 font-serif text-3xl leading-tight">
            Why you are not {deepDive.comparison.runnerUpLabel}
          </h2>
          <p className="mt-4 text-base leading-7 text-black/80">{deepDive.comparison.contrastText}</p>
        </article>

        <article className="rounded-2xl border border-black/10 bg-white p-6">
          <div className="text-xs font-medium uppercase tracking-[0.18em] text-black/55">
            Most distant archetype
          </div>
          <h2 className="mt-2 font-serif text-3xl leading-tight">
            Farthest from {deepDive.comparison.farthestLabel}
          </h2>
          <p className="mt-4 text-base leading-7 text-black/80">{deepDive.comparison.farthestText}</p>
        </article>
      </section>

      <section className="grid gap-4 lg:grid-cols-[1.1fr_0.9fr]">
        <article className="rounded-2xl border border-black/10 bg-white p-6">
          <h2 className="font-serif text-3xl leading-tight">Best critique of your worldview</h2>
          <p className="mt-4 text-base leading-7 text-black/80">{deepDive.strongestCritique}</p>
        </article>

        <article className="rounded-2xl border border-black/10 bg-neutral-50 p-6">
          <div className="text-xs font-medium uppercase tracking-[0.18em] text-black/55">
            Sit with this question
          </div>
          <p className="mt-4 text-lg leading-8 text-black/85">{deepDive.questionToSitWith}</p>
        </article>
      </section>
    </div>
  )
}
