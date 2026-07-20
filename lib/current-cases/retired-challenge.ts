export function retiredAnswerChallengeResponse() {
  return Response.json(
    {
      ok: false,
      disabled: true,
      reason: "answer-bearing-links-retired",
      message:
        "This older challenge link cannot reveal another reader’s answer. Open the case and compare after both readers finish.",
    },
    {
      status: 410,
      headers: {
        "cache-control": "no-store",
      },
    },
  )
}
