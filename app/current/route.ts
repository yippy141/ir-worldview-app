import { NextResponse, type NextRequest } from "next/server"
import { getLatestPublishedCurrentCase } from "@/lib/current-cases/catalog"

export function GET(request: NextRequest) {
  const latest = getLatestPublishedCurrentCase()
  const destination = latest ? `/cases/${latest.slug}` : "/cases"
  return NextResponse.redirect(new URL(destination, request.url), 307)
}
