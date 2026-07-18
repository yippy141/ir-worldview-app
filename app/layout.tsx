import "./globals.css"
import { Newsreader, Archivo, Space_Mono } from "next/font/google"
import { siteConfig } from "@/lib/site-config"
import { SiteChrome } from "@/components/layout/site-chrome"
import type { Metadata } from "next"
import type { Viewport } from "next"

// Newsreader: serif for headings and body. Archivo: sans for UI labels.
// Space Mono: mono for micro/technical labels. Exposed as CSS variables.
const newsreader = Newsreader({
  subsets: ["latin"],
  display: "swap",
  variable: "--font-serif",
})

const archivo = Archivo({
  subsets: ["latin"],
  display: "swap",
  variable: "--font-sans",
})

const spaceMono = Space_Mono({
  subsets: ["latin"],
  weight: ["400", "700"],
  display: "swap",
  variable: "--font-mono",
})

export const metadata: Metadata = {
  metadataBase: resolveMetadataBase(),
  title: siteConfig.publicTitle,
  description:
    "Map how you think about world politics — IR theory, security, technology, and AI governance.",
}

function resolveMetadataBase() {
  const configured = process.env.SITE_URL?.trim()
  const vercelProductionHost = process.env.VERCEL_PROJECT_PRODUCTION_URL?.trim()
  const candidate = configured || (vercelProductionHost ? `https://${vercelProductionHost}` : "")

  try {
    return new URL(candidate || "http://localhost:3000")
  } catch {
    return new URL("http://localhost:3000")
  }
}

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html
      lang="en"
      className={`${newsreader.variable} ${archivo.variable} ${spaceMono.variable}`}
    >
      <body>
        <SiteChrome>{children}</SiteChrome>
      </body>
    </html>
  )
}
