import { NextResponse, type NextRequest } from "next/server"
import { getLatestPublishedCurrentCase } from "@/lib/current-cases/catalog"

export function GET(request: NextRequest) {
  const latest = getLatestPublishedCurrentCase()
  const destination = latest ? `/zh/cases/${latest.slug}` : "/zh/cases"
  return NextResponse.redirect(new URL(destination, request.url), 307)
}
