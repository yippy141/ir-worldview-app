import Link from "next/link"

type Props = {
  instrumentLabel: string
}

export function ResearchStatusNotice({ instrumentLabel }: Props) {
  return (
    <section className="callout stack-sm" aria-label="Research collection status">
      <div className="stack-xs">
        <p className="eyebrow">Local-only release</p>
        <h2 style={{ margin: 0, fontSize: "1.05rem" }}>Research responses are not collected</h2>
        <p className="muted" style={{ lineHeight: "1.65", fontSize: "0.9rem" }}>
          This {instrumentLabel} result stays in your browser unless you explicitly share it. V19
          has no research-response intake, consent mock-up, contact field, or persistent research
          identifier.
        </p>
      </div>

      <p className="muted" style={{ lineHeight: "1.6", fontSize: "0.85rem", margin: 0 }}>
        Any later research study will be a separately reviewed release with its own purpose,
        consent, retention, deletion, and access controls. It cannot be activated in this build by
        changing an environment variable.
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
