import Link from "next/link"
import { notFound } from "next/navigation"
import { ModuleApp } from "@/components/modules/module-app"
import styles from "@/components/modules/module-app.module.css"
import { getModuleDefinition } from "@/lib/modules/framework"
import { acceptsModuleCompletions, getModuleAuthoringRecord } from "@/lib/modules/manifests"
import { linkedFoundationTitle } from "@/lib/results/foundation-result-heading"
import { resolveFoundationPayload } from "@/lib/share"
import type { Metadata } from "next"

interface Props {
  params: Promise<{ slug: string }>
  searchParams: Promise<{ foundation?: string }>
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params
  const moduleDefinition = getModuleDefinition(slug)

  if (!moduleDefinition) {
    return { title: "Module | IR Worldview Inventory" }
  }

  return {
    title: `${moduleDefinition.title} | IR Worldview Inventory`,
    description: moduleDefinition.description,
  }
}

export default async function ModulePage({ params, searchParams }: Props) {
  const { slug } = await params
  const { foundation } = await searchParams
  const moduleDefinition = getModuleDefinition(slug)

  if (!moduleDefinition) notFound()

  const resolved = foundation ? resolveFoundationPayload(foundation) : null
  if (!acceptsModuleCompletions(moduleDefinition.slug)) {
    const security = moduleDefinition.slug === "security"
    return (
      <article className="container reading-page stack-lg" data-module-withdrawn>
        <Link href="/modules">Security and Technology</Link>
        <h1>{moduleDefinition.shortTitle} questionnaire paused</h1>
        <p>New answers are closed while the editors review this questionnaire. You can still open an earlier result from its link or from <Link href="/profile">your Profile</Link>.</p>
        {resolved && <p>Your linked Foundation result: <Link href={`/results/${foundation}`}>{linkedFoundationTitle(resolved)}</Link>.</p>}
        <p>{security ? "Two countries agree to limit AI training. Who should inspect their research sites?" : "A research institute has a powerful AI model. Who should be allowed to use it?"} <Link href={security ? "/decisions/who-gets-to-verify" : "/decisions/who-gets-access"}>Try the decision exercise</Link>.</p>
      </article>
    )
  }
  const { versions } = getModuleAuthoringRecord(moduleDefinition.slug).manifest
  return (
    <div className={styles.container}>
      <ModuleApp slug={moduleDefinition.slug} bankVersion={versions.questionBank} scoringVersion={versions.scoring} foundationPayload={resolved ? foundation : undefined} />
    </div>
  )
}
