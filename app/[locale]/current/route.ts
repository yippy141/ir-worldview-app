import { NextResponse, type NextRequest } from "next/server"
import { getCurrentCaseDestination } from "@/lib/current-cases/routes"

export function GET(request: NextRequest) {
  const destination = getCurrentCaseDestination("zh-Hans")
  return NextResponse.redirect(new URL(destination, request.url), 307)
}
