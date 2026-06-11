import Link from "next/link"
import { notFound } from "next/navigation"
import { ModuleResultView } from "@/components/modules/module-result"
import { decodeModulePayload, getModuleDefinition } from "@/lib/modules/framework"
import { decodePayload, payloadToDimensionScores } from "@/lib/share"
import type { Metadata } from "next"

interface Props {
  params: Promise<{ slug: string; payload: string }>
  searchParams: Promise<{ foundation?: string }>
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params
  const moduleDefinition = getModuleDefinition(slug)

  if (!moduleDefinition) {
    return { title: "Module result — IR Worldview Inventory" }
  }

  return {
    title: `${moduleDefinition.title} result — IR Worldview Inventory`,
    description: `Your ${moduleDefinition.title} module result.`,
  }
}

export default async function ModuleResultPage({ params, searchParams }: Props) {
  const { slug, payload } = await params
  const { foundation } = await searchParams
  const moduleDefinition = getModuleDefinition(slug)
  const data = decodeModulePayload(payload)
  const foundationData = foundation ? decodePayload(foundation) : null

  if (!moduleDefinition) notFound()

  if (!data || data.slug !== moduleDefinition.slug) {
    return (
      <div className="container stack-lg" style={{ paddingTop: "48px" }}>
        <div className="panel stack-md">
          <p className="eyebrow">Invalid module result</p>
          <h1>This module result could not be decoded.</h1>
          <p className="muted" style={{ lineHeight: "1.65" }}>
            The link may be incomplete, corrupted, or from an older version of the module.
          </p>
          <div className="row gap-sm" style={{ flexWrap: "wrap" }}>
            <Link href="/modules" className="cta-primary">Go to focus-area modules</Link>
            <Link href={`/modules/${slug}`} className="cta-secondary">Retake this module</Link>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="wide-container">
      <ModuleResultView
        slug={moduleDefinition.slug}
        payload={payload}
        mode={data.mode}
        answers={data.answers}
        foundation={foundationData ? payloadToDimensionScores(foundationData) : undefined}
        foundationPayload={foundation}
      />
    </div>
  )
}
