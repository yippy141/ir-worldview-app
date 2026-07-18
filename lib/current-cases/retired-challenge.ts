export function retiredAnswerChallengeResponse() {
  return Response.json(
    {
      ok: false,
      disabled: true,
      reason: "answer-bearing-links-retired",
      message: "Answer-bearing Current Case challenge links are not available in V19.",
    },
    {
      status: 410,
      headers: {
        "cache-control": "no-store",
      },
    },
  )
}
