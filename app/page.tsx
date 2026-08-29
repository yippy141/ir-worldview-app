import type { Metadata } from "next"
import { RootHome } from "@/components/home/root/root-home"
import { getRootCopy } from "@/content/root"
import { createEnglishApprovedMetadata } from "@/i18n/metadata"
import { ROOT_GLOBE_VISUAL } from "@/lib/root/orthographic"
import { siteConfig } from "@/lib/site-config"

export const metadata: Metadata = createEnglishApprovedMetadata("/", {
  title: siteConfig.publicTitle,
  description:
    "Map your foreign-policy judgments, test them in context, and explore the arguments behind the inventory.",
})

export default function HomePage() {
  return (
    <RootHome
      locale="en"
      copy={getRootCopy("en")}
      visual={ROOT_GLOBE_VISUAL}
    />
  )
}
