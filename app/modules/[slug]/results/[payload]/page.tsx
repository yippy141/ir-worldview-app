import Link from "next/link"
import { notFound } from "next/navigation"
import { ModuleResultView } from "@/components/modules/module-result"
import { getModuleDefinition, resolveModulePayload } from "@/lib/modules/framework"
import type { Metadata } from "next"

interface Props {
  params: Promise<{ slug: string; payload: string }>
  searchParams: Promise<{ foundation?: string }>
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug, payload } = await params
  const resolved = resolveModulePayload(payload)
  const moduleDefinition =
    resolved?.payload.slug === slug
      ? resolved.definition
      : getModuleDefinition(slug)

  if (!moduleDefinition) {
    return { title: "Focus Area result | IR Worldview Inventory" }
  }

  return {
    title: `${moduleDefinition.title} result | IR Worldview Inventory`,
    description: `Your ${moduleDefinition.title} Focus Area result.`,
  }
}

export default async function ModuleResultPage({ params, searchParams }: Props) {
  const { slug, payload } = await params
  const { foundation } = await searchParams
  const currentDefinition = getModuleDefinition(slug)
  const resolved = resolveModulePayload(payload)

  if (!currentDefinition) notFound()

  if (!resolved || resolved.payload.slug !== currentDefinition.slug) {
    return (
      <div className="container stack-lg" style={{ paddingTop: "48px" }}>
        <div className="panel stack-md">
          <p className="eyebrow">Invalid Focus Area result</p>
          <h1>This Focus Area result could not be decoded.</h1>
          <p className="muted" style={{ lineHeight: "1.65" }}>
            The link may be incomplete, corrupted, or from an older version of the module.
          </p>
          <div className="row gap-sm" style={{ flexWrap: "wrap" }}>
            <Link href="/modules" className="cta-primary">Go to Focus Areas</Link>
            <Link href={`/modules/${slug}`} className="cta-secondary">Retake this module</Link>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="wide-container">
      <ModuleResultView
        moduleDefinition={resolved.definition}
        runtime={resolved.runtime}
        bankVersion={resolved.bankVersion}
        payload={payload}
        mode={resolved.payload.mode}
        answers={resolved.payload.answers}
        foundationPayload={foundation}
      />
    </div>
  )
}
