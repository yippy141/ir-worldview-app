import Link from "next/link"
import { ExploreFamily } from "@/lib/explore-content"
import { coverageLevelLabels } from "@/lib/explore-content"
import { familySlug } from "@/lib/worldview-config"

type Props = {
  family: ExploreFamily
}

export function FamilyCard({ family }: Props) {
  return (
    <Link
      href={`/explore/${familySlug(family.familyKey)}`}
      style={{ textDecoration: "none", color: "inherit", display: "block" }}
    >
      <div className="explore-card">
        <div style={{ marginBottom: "8px" }}>
          <span
            style={{
              fontSize: "0.7rem",
              textTransform: "uppercase",
              letterSpacing: "0.1em",
              color: "var(--accent-light)",
              fontWeight: 600,
            }}
          >
            {coverageLevelLabels[family.quizCoverage.level]}
          </span>
        </div>
        <p
          style={{
            fontFamily: "Georgia, serif",
            fontWeight: 700,
            fontSize: "1.05rem",
            marginBottom: "8px",
            color: "var(--text)",
          }}
        >
          {family.name}
        </p>
        <p
          style={{
            fontSize: "0.875rem",
            lineHeight: "1.55",
            color: "var(--muted)",
          }}
        >
          {family.tagline}
        </p>
        <p
          style={{
            marginTop: "14px",
            fontSize: "0.8rem",
            color: "var(--accent-light)",
            fontWeight: 600,
          }}
        >
          Read more →
        </p>
      </div>
    </Link>
  )
}
