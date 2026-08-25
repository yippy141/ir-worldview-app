import Link from "next/link"
import { PerspectiveQuiz } from "@/components/perspectives/perspective-quiz"
import { isPerspectiveId, perspectiveCatalog } from "@/lib/perspectives/catalog"
import type { Metadata } from "next"

export function generateStaticParams() {
  return perspectiveCatalog.map((perspective) => ({ perspectiveId: perspective.id }))
}

export async function generateMetadata(
  { params }: { params: Promise<{ perspectiveId: string }> },
): Promise<Metadata> {
  const { perspectiveId } = await params
  const perspective = perspectiveCatalog.find((candidate) => candidate.id === perspectiveId)
  const title = perspective
    ? `${perspective.label} | Perspective Run`
    : "Perspective Run | IR Worldview Inventory"

  return {
    title,
    description:
      "A short scenario set answered from a defined strategic position, compared with your Foundation baseline.",
  }
}

export default async function PerspectiveRunPage(
  { params }: { params: Promise<{ perspectiveId: string }> },
) {
  const { perspectiveId } = await params

  if (!isPerspectiveId(perspectiveId)) {
    return (
      <div className="container stack-lg">
        <div className="panel stack-md">
          <p className="eyebrow">Unknown brief</p>
          <h1>This vantage point is unavailable.</h1>
          <p className="muted">Choose one of the six role briefs to start a run.</p>
          <div className="row gap-sm wrap">
            <Link href="/perspectives" className="cta-primary">Browse the briefs</Link>
            <Link href="/quiz" className="cta-secondary">Take the Foundation</Link>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="container">
      <PerspectiveQuiz perspectiveId={perspectiveId} />
    </div>
  )
}
