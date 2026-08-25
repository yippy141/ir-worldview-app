import Link from "next/link"

type Props = {
  instrumentLabel: string
}

export function ResearchStatusNotice({ instrumentLabel }: Props) {
  return (
    <section className="callout stack-sm" aria-label="Research collection status">
      <div className="stack-xs">
        <p className="eyebrow">Research collection</p>
        <h2 style={{ margin: 0, fontSize: "1.05rem" }}>Research responses are not collected</h2>
        <p className="muted" style={{ lineHeight: "1.65", fontSize: "0.9rem" }}>
          Draft answers and saved {instrumentLabel} history stay in this browser. Generated result
          links contain the data needed to reopen a result; Focus Area links include selected
          answer IDs. Separate first-party aggregate counters may receive derived buckets when
          coarse measurement is enabled. The site does not collect research responses or contact
          details.
        </p>
      </div>

      <p className="muted" style={{ lineHeight: "1.6", fontSize: "0.85rem", margin: 0 }}>
        Any future research study would require separate information about its purpose, consent,
        retention, deletion, and access rules.
      </p>

      <p className="muted" style={{ lineHeight: "1.6", fontSize: "0.82rem", margin: 0 }}>
        Read the{" "}
        <Link href="/privacy" style={{ color: "var(--accent)" }}>
          privacy and data-use note
        </Link>
        .
      </p>
    </section>
  )
}
