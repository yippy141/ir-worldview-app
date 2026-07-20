import "./globals.css"
import { Newsreader, Archivo, Space_Mono } from "next/font/google"
import { NextIntlClientProvider } from "next-intl"
import { getLocale, getMessages } from "next-intl/server"
import { siteConfig } from "@/lib/site-config"
import { SiteChrome } from "@/components/layout/site-chrome"
import { resolveMetadataBase } from "@/i18n/paths"
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

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
}

export default async function RootLayout({ children }: { children: React.ReactNode }) {
  const locale = await getLocale()
  const messages = await getMessages()

  return (
    <html
      lang={locale}
      data-locale={locale}
      className={`${newsreader.variable} ${archivo.variable} ${spaceMono.variable}`}
    >
      <body>
        <NextIntlClientProvider locale={locale} messages={messages}>
          <SiteChrome>{children}</SiteChrome>
        </NextIntlClientProvider>
      </body>
    </html>
  )
}
