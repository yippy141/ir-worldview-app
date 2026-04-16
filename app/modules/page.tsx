import Link from "next/link"
import { modules } from "@/lib/modules/framework"
import type { Metadata } from "next"

export const metadata: Metadata = {
  title: "Focus-Area Modules — IR Worldview Inventory",
  description:
    "Take a focus-area module in Security or Technology and compare the result back to your Foundation baseline.",
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
        <p className="eyebrow">Focus-area modules</p>
        <h1>Stress-test your baseline in one issue area</h1>
        <p className="muted" style={{ lineHeight: "1.7", fontSize: "1.05rem", maxWidth: "640px" }}>
          These modules sit on top of the shared Foundation. They do not replace the baseline;
          they show how your instincts travel when the questions become more issue-specific.
        </p>
      </div>

      <div className="callout stack-xs" style={{ marginBottom: "28px" }}>
        <p style={{ fontWeight: 600 }}>Why these issue areas</p>
        <p className="muted" style={{ lineHeight: "1.65", fontSize: "0.9rem" }}>
          The focus-area structure is loosely inspired by how international affairs programs,
          including the SAIS MAIR curriculum, often group issue areas. This project is independent
          and does not imply affiliation or endorsement.
        </p>
      </div>

      <div className="callout stack-sm" style={{ marginBottom: "28px" }}>
        <p style={{ fontWeight: 600, margin: 0 }}>Companion AI module</p>
        <p className="muted" style={{ lineHeight: "1.65", fontSize: "0.9rem", margin: 0 }}>
          The AI Governance Compass is a parallel companion module with its own quiz and atlas.
          Use the atlas if you want the quickest way into the modeled AI-governance families
          before taking the inventory.
        </p>
        <div className="row gap-sm wrap">
          <Link href="/ai" className="cta-secondary">AI home</Link>
          <Link href="/ai/atlas" className="cta-primary">AI atlas</Link>
          <Link href="/ai/quiz" className="cta-secondary">AI quiz</Link>
        </div>
      </div>

      {foundation ? (
        <div className="callout stack-xs" style={{ marginBottom: "28px" }}>
          <p style={{ fontWeight: 600 }}>Foundation comparison is available</p>
          <p className="muted" style={{ lineHeight: "1.65", fontSize: "0.9rem" }}>
            If you open a module from here, the result page will compare that module back to your
            Foundation baseline.
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
            <p className="eyebrow" style={{ marginBottom: "10px" }}>Focus-area module</p>
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
            <p style={{ fontWeight: 600, marginBottom: "8px", fontSize: "0.9rem" }}>
              {moduleDefinition.subtitle}
            </p>
            <p className="muted" style={{ lineHeight: "1.6", fontSize: "0.88rem" }}>
              {moduleDefinition.description}
            </p>
            <p className="muted" style={{ marginTop: "12px", fontSize: "0.82rem", lineHeight: "1.55" }}>
              Lanes: {moduleDefinition.lanes.map((lane) => lane.label).join(" · ")}
            </p>
            <p style={{ marginTop: "14px", fontSize: "0.82rem", color: "var(--accent-light)", fontWeight: 600 }}>
              Standard: {moduleDefinition.timeEstimate.standard} · Advanced: {moduleDefinition.timeEstimate.analyst}
            </p>
          </Link>
        ))}
      </div>
    </div>
  )
}
