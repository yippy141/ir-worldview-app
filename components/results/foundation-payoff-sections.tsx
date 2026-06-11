import Link from "next/link"
import type { FoundationPayoff } from "@/lib/results/foundation-payoff"

type Props = {
  payoff: FoundationPayoff
  foundationPayload: string
}

export function FoundationPayoffSections({ payoff, foundationPayload }: Props) {
  const nextStepHref = withFoundationPayload(payoff.nextStep.href, foundationPayload)

  return (
    <section className="foundation-payoff result-section stack-lg" aria-labelledby="foundation-payoff-heading">
      <div className="foundation-payoff__intro stack-xs">
        <p className="eyebrow">Now what?</p>
        <h2 id="foundation-payoff-heading">How to use this result</h2>
        <p className="muted">
          The useful payoff is not the label by itself. It is how this profile changes what you
          notice, question, and pressure-test when a real debate gets hard.
        </p>
      </div>

      <div className="foundation-payoff__block stack-md">
        <div className="stack-xs">
          <p className="section-kicker">1. Your core pattern</p>
          <h3>Your first read of a case</h3>
        </div>
        <div className="foundation-payoff__card-grid">
          <PayoffCard title="What you notice first" text={payoff.corePattern.noticeFirst} />
          <PayoffCard title="What you tend to distrust" text={payoff.corePattern.distrust} />
          <PayoffCard title="What you may underweight" text={payoff.corePattern.underweight} />
        </div>
      </div>

      <div className="foundation-payoff__block foundation-payoff__tension stack-sm">
        <div className="stack-xs">
          <p className="section-kicker">2. Your main tension</p>
          <h3>{payoff.mainTension.title}</h3>
        </div>
        <p>{payoff.mainTension.body}</p>
        <p className="muted">{payoff.mainTension.rivalArgument}</p>
      </div>

      <div className="foundation-payoff__block stack-md">
        <div className="stack-xs">
          <p className="section-kicker">3. How this changes your reading of live debates</p>
          <h3>Questions your profile is likely to ask</h3>
        </div>
        <div className="foundation-payoff__lens-grid">
          {payoff.liveDebates.map((lens) => (
            <PayoffCard key={lens.title} title={lens.title} text={lens.text} />
          ))}
        </div>
      </div>

      <div className="foundation-payoff__block foundation-payoff__next stack-sm">
        <div className="stack-xs">
          <p className="section-kicker">4. What to pressure-test next</p>
          <h3>{payoff.nextStep.label}</h3>
        </div>
        <p>{payoff.nextStep.reason}</p>
        <p>
          <Link href={nextStepHref} className="cta-secondary">
            {payoff.nextStep.label}
          </Link>
        </p>
      </div>
    </section>
  )
}

function PayoffCard({ title, text }: { title: string; text: string }) {
  return (
    <article className="foundation-payoff__card stack-xs">
      <h4>{title}</h4>
      <p>{text}</p>
    </article>
  )
}

function withFoundationPayload(href: string, foundationPayload: string) {
  if (!href.startsWith("/modules/")) return href

  return `${href}?foundation=${encodeURIComponent(foundationPayload)}`
}
