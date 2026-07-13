import type { Metadata } from "next"
import { siteConfig } from "@/lib/site-config"
import LandingPage from "../page"

export const metadata: Metadata = {
  title: `About — ${siteConfig.publicTitle}`,
  description:
    "An overview of the IR Worldview Inventory, its purpose, entry points, and editorial limits.",
}

export default LandingPage
