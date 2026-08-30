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

// Official OFL assets are bundled so rendering never depends on a third-party
// request. Simplified Chinese continues to use the reviewed system stacks in
// globals.css.
const spectral = localFont({
  src: [
    {
      path: "../public/fonts/spectral-latin-regular.woff2",
      weight: "400",
      style: "normal",
    },
    {
      path: "../public/fonts/spectral-latin-medium.woff2",
      weight: "500",
      style: "normal",
    },
    {
      path: "../public/fonts/spectral-latin-semibold.woff2",
      weight: "600",
      style: "normal",
    },
  ],
  display: "swap",
  variable: "--font-serif",
})

const libreFranklin = localFont({
  src: "../public/fonts/libre-franklin-latin-variable.woff2",
  weight: "300 700",
  display: "swap",
  variable: "--font-sans",
})

export const metadata: Metadata = {
  metadataBase: resolveMetadataBase(),
  title: siteConfig.publicTitle,
  description:
    "Map how you think about world politics across IR theory, security, technology, and AI governance.",
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
      className={`${spectral.variable} ${libreFranklin.variable}`}
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
