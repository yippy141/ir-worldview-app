import { researchUnavailableResponse } from "@/lib/research/unavailable"

export const runtime = "nodejs"
export const dynamic = "force-dynamic"

export async function POST(_request: Request) {
  return researchUnavailableResponse()
}
