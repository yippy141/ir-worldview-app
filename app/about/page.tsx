import type { Metadata } from "next"
import Link from "next/link"
import { createEnglishApprovedMetadata } from "@/i18n/metadata"
import { siteConfig } from "@/lib/site-config"

export const metadata: Metadata = createEnglishApprovedMetadata("/about", {
  title: `About | ${siteConfig.publicTitle}`,
  description:
    "Who made the IR Worldview Inventory, how it was built, and how to reach the project.",
})

export default function AboutPage() {
  const email = siteConfig.links.find(
    (link) => link.kind === "contact" && link.href.startsWith("mailto:"),
  )

  return (
    <div className="container stack-lg reading-page info-page">
      <header className="stack-md">
        <h1>About</h1>
        <p>People can agree on what should happen and disagree about why. They can also apply different standards to a military crisis, an export restriction or the release of a powerful AI model. I built this app to make those differences easier to examine.</p>
        <p>The questionnaires cover international politics, Security, Technology and AI Governance. The Library explains the arguments behind the results. Cases let you work through a particular decision, while AI Futures explores the conditions you would accept in very different possible worlds.</p>
        <p>You can start with whichever subject interests you. The aim is to leave with a clearer explanation of your choices and a question worth discussing with someone else.</p>
      </header>
      <section className="stack-md">
        <h2>Who made it</h2>
        <p>I&apos;m {siteConfig.author}. I studied international relations at Johns Hopkins SAIS, with a focus on technology and governance. I began this as a personal project and used AI tools extensively to build it. The design and interpretations have changed through successive rounds of testing, criticism and revision.</p>
        <p>This is an independent project. The scoring rules are available in <Link href="/method">Method</Link>, together with their limitations. Empirical validation remains work to do.</p>
      </section>
      <section className="stack-md">
        <h2>Corrections</h2>
        <p>A misleading question or an explanation that does not follow from your answers is useful feedback. Please name the page or question when contacting me. You do not need to include your result link or disclose your answers.</p>
        <p>{email && <a href={email.href}>Email the project</a>} · <Link href="/method">Method</Link> · <Link href="/privacy">Privacy</Link></p>
      </section>
    </div>
  )
}
