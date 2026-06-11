import { notFound } from "next/navigation"
import { ModuleApp } from "@/components/modules/module-app"
import { getModuleDefinition } from "@/lib/modules/framework"
import type { Metadata } from "next"

interface Props {
  params: Promise<{ slug: string }>
  searchParams: Promise<{ foundation?: string }>
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params
  const moduleDefinition = getModuleDefinition(slug)

  if (!moduleDefinition) {
    return { title: "Module — IR Worldview Inventory" }
  }

  return {
    title: `${moduleDefinition.title} — IR Worldview Inventory`,
    description: moduleDefinition.description,
  }
}

export default async function ModulePage({ params, searchParams }: Props) {
  const { slug } = await params
  const { foundation } = await searchParams
  const moduleDefinition = getModuleDefinition(slug)

  if (!moduleDefinition) notFound()

  return (
    <div className="wide-container">
      <ModuleApp slug={moduleDefinition.slug} foundationPayload={foundation} />
    </div>
  )
}
