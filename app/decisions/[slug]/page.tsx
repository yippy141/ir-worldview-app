import { notFound } from "next/navigation"
import { EpisodePlayer } from "@/components/decision-exercises/episode-player"
import { decisionPublications, getPublishedDecision } from "@/lib/decision-exercises/catalog"
export function generateStaticParams() { return decisionPublications.map(({ slug }) => ({ slug })) }
export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }) {
 const episode = getPublishedDecision((await params).slug)
 return { title: episode ? `${episode.title} | IR Worldview Inventory` : "Decision unavailable", description: episode?.invitation }
}
export default async function DecisionPage({ params }: { params: Promise<{ slug: string }> }) {
 const episode = getPublishedDecision((await params).slug)
 if (!episode) notFound()
 return <EpisodePlayer episode={episode} />
}
