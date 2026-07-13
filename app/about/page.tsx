import type { Metadata } from "next"
import { AboutOverview } from "@/components/about/about-overview"
import { siteConfig } from "@/lib/site-config"

export const metadata: Metadata = {
  title: `About — ${siteConfig.publicTitle}`,
  description:
    "An overview of the IR Worldview Inventory, its purpose, entry points, and editorial limits.",
}

export default function AboutPage() {
  return <AboutOverview />
}
