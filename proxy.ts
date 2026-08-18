import createMiddleware from "next-intl/middleware"
import { NextResponse, type NextRequest } from "next/server"
import { routing } from "@/i18n/routing"
import {
  isSensitiveSharePath,
  privateNoStoreHeader,
} from "@/lib/http-headers"

const handleLocaleRouting = createMiddleware(routing)

export default function proxy(request: NextRequest) {
  const pathname = request.nextUrl.pathname

  // `zh-Hans` is the internal locale identifier, not a public prefix. A
  // direct request lacks the next-intl locale header; the internal rewrite
  // from `/zh` carries it and must be allowed through.
  if (
    (pathname === "/zh-Hans" || pathname.startsWith("/zh-Hans/")) &&
    request.headers.get("x-next-intl-locale") !== "zh-Hans"
  ) {
    const canonical = request.nextUrl.clone()
    canonical.pathname =
      pathname === "/zh-Hans"
        ? "/zh"
        : `/zh${pathname.slice("/zh-Hans".length)}`
    return applyPrivateShareHeaders(
      NextResponse.redirect(canonical, 308),
      canonical.pathname,
    )
  }

  // English remains on the legacy, unprefixed route tree. next-intl only needs
  // to rewrite the public Chinese prefix and remove a superfluous /en prefix.
  if (
    pathname !== "/zh" &&
    !pathname.startsWith("/zh/") &&
    pathname !== "/en" &&
    !pathname.startsWith("/en/")
  ) {
    return applyPrivateShareHeaders(NextResponse.next(), pathname)
  }

  return applyPrivateShareHeaders(handleLocaleRouting(request), pathname)
}

function applyPrivateShareHeaders(response: NextResponse, pathname: string) {
  if (isSensitiveSharePath(pathname)) {
    response.headers.set("Cache-Control", privateNoStoreHeader)
  }
  return response
}

export const config = {
  matcher: [
    "/((?!api|_next|_vercel|.*\\..*).*)",
    "/zh/results/:path*",
    "/zh/ai/results/:path*",
    "/zh/modules/:slug/results/:path*",
    "/zh/perspectives/:perspectiveId/result/:path*",
    "/zh/profile/share/:path*",
  ],
}
