import { retiredAnswerChallengeResponse } from "@/lib/current-cases/retired-challenge"

export const runtime = "nodejs"
export const dynamic = "force-dynamic"

export async function POST(_request: Request) {
  return retiredAnswerChallengeResponse()
}
