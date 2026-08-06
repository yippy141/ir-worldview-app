import "./globals.css"
import localFont from "next/font/local"
import { NextIntlClientProvider } from "next-intl"
import { getLocale, getMessages } from "next-intl/server"
import { siteConfig } from "@/lib/site-config"
import { SiteChrome } from "@/components/layout/site-chrome"
import { resolveMetadataBase } from "@/i18n/paths"
import { betaNavigationEnabled } from "@/lib/beta-config"
import type { Metadata } from "next"
import type { Viewport } from "next"

// Bundled fonts keep builds and social cards independent of third-party font
// availability. CSS variables preserve the existing typography contract.
const newsreader = localFont({
  src: "../public/fonts/newsreader-variable.ttf",
  weight: "200 800",
  display: "swap",
  variable: "--font-serif",
})

const archivo = localFont({
  src: "../public/fonts/archivo-variable.ttf",
  weight: "100 900",
  display: "swap",
  variable: "--font-sans",
})

const spaceMono = localFont({
  src: [
    {
      path: "../public/fonts/space-mono-regular.woff2",
      weight: "400",
      style: "normal",
    },
    {
      path: "../public/fonts/space-mono-bold.woff2",
      weight: "700",
      style: "normal",
    },
  ],
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
  const showBetaInPrimaryNavigation = betaNavigationEnabled()

  return (
    <html
      lang={locale}
      data-locale={locale}
      className={`${newsreader.variable} ${archivo.variable} ${spaceMono.variable}`}
    >
      <body>
        <NextIntlClientProvider locale={locale} messages={messages}>
          <SiteChrome betaNavigationEnabled={showBetaInPrimaryNavigation}>
            {children}
          </SiteChrome>
        </NextIntlClientProvider>
      </body>
    </html>
  )
}
