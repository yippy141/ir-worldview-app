import Link from "next/link"
import { modules } from "@/lib/modules/framework"
import type { Metadata } from "next"

export const metadata: Metadata = {
  title: "Modules — IR Worldview Inventory",
  description:
    "Take a flagship module in Security or Technology and compare the result back to your foundation profile.",
}

export default async function ModulesPage(
  {
    searchParams,
  }: {
    searchParams: Promise<{ foundation?: string }>
  },
) {
  const { foundation } = await searchParams

  return (
    <div className="wide-container">
      <div className="article-header stack-sm">
        <p className="eyebrow">Flagship modules</p>
        <h1>Go deeper in one issue domain</h1>
        <p className="muted" style={{ lineHeight: "1.7", fontSize: "1.05rem", maxWidth: "640px" }}>
          These modules sit on top of the shared foundation. They do not replace the foundation
          result; they show how your instincts travel when the questions become more issue-specific.
        </p>
      </div>

      {foundation ? (
        <div className="callout stack-xs" style={{ marginBottom: "28px" }}>
          <p style={{ fontWeight: 600 }}>Foundation comparison is available</p>
          <p className="muted" style={{ lineHeight: "1.65", fontSize: "0.9rem" }}>
            If you open a module from here, the result page will compare that module back to your
            foundation profile.
          </p>
        </div>
      ) : null}

      <div className="module-card-grid">
        {modules.map((moduleDefinition) => (
          <Link
            key={moduleDefinition.slug}
            href={`/modules/${moduleDefinition.slug}${foundation ? `?foundation=${encodeURIComponent(foundation)}` : ""}`}
            className="explore-card"
            style={{ textDecoration: "none", color: "inherit" }}
          >
            <p className="eyebrow" style={{ marginBottom: "10px" }}>Flagship module</p>
            <p
              style={{
                fontFamily: "Georgia, serif",
                fontWeight: 700,
                fontSize: "1.05rem",
                marginBottom: "8px",
              }}
            >
              {moduleDefinition.title}
            </p>
            <p className="muted" style={{ lineHeight: "1.6", fontSize: "0.88rem" }}>
              {moduleDefinition.description}
            </p>
            <p style={{ marginTop: "14px", fontSize: "0.82rem", color: "var(--accent-light)", fontWeight: 600 }}>
              Standard: {moduleDefinition.timeEstimate.standard} · Analyst: {moduleDefinition.timeEstimate.analyst}
            </p>
          </Link>
        ))}
      </div>
    </div>
  )
}
