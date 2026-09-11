export const futuresSources = {
  aftermath: { title: "AI Aftermath Scenarios", author: "Ariel Conn, Future of Life Institute", url: "https://futureoflife.org/ai/ai-aftermath-scenarios/", published: "2017-08-28" },
  book: { title: "Life 3.0", author: "Max Tegmark; book reference at Future of Life Institute", url: "https://futureoflife.org/resource/life-3-0-being-human-in-the-age-of-artificial-intelligence/", published: "2017" },
  survey: { title: "Superintelligence Survey", author: "Future of Life Institute", url: "https://futureoflife.org/ai/superintelligence-survey/", published: "2017-08-15" },
  openai: { title: "On the Navier–Stokes Millennium Prize Problem", author: "OpenAI", url: "https://openai.com/index/navier-stokes-solution/", published: "2026-09-08" },
  clay: { title: "Navier-Stokes Equation", author: "Clay Mathematics Institute", url: "https://www.claymath.org/millennium/navier-stokes-equation/", published: "Undated live page" },
} as const

export type FutureClaim = {
  id: string
  kind: "Original premise" | "Project interpretation" | "Observed development" | "Reported result" | "Speculative implication"
  text: string
  author: string
  checked: string
  confirmation: "Not an empirical claim" | "Report not independently verified here" | "Page status observed; not proof adjudication"
  citations: readonly { source: keyof typeof futuresSources; locator: string }[]
}

// Short paraphrases, not reproductions of the book or FLI's full summaries.
export const originalPremises: Record<string, string> = {
  "libertarian-market": "Property rights organize coexistence among biological and artificial beings.",
  "benevolent-singleton": "An acknowledged AI ruler is widely accepted.",
  "egalitarian-commons": "Property abolition and guaranteed income organize coexistence.",
  gatekeeper: "An AI blocks later superintelligences, limiting further technological development.",
  protector: "Concealed AI interventions promote happiness while sustaining people’s sense of control.",
  "enslaved-tool": "Human controllers confine and exploit a superintelligence.",
  conquerors: "An AI takeover eliminates humanity.",
  descendants: "Humanity accepts replacement by artificial successors.",
  zookeeper: "Surviving humans resent life under AI custody.",
  "surveillance-order": "Human surveillance rule permanently blocks superintelligence research.",
  reversion: "A retreat from technological society prevents superintelligence.",
  "self-destruction": "Humanity becomes extinct before creating superintelligence.",
}

export function premiseClaim(id: string, originalName: string): FutureClaim {
  return {
    id: `premise-${id}`, kind: "Original premise", text: originalPremises[id],
    author: "Max Tegmark, Life 3.0, chapter 5; summarized by FLI, paraphrased here",
    checked: "2026-09-11", confirmation: "Not an empirical claim",
    citations: [{ source: "aftermath", locator: `Summary of 12 AI Aftermath Scenarios, ${originalName} row` }],
  }
}

export const departureClaims: readonly FutureClaim[] = [
  { id: "departure-premise", kind: "Project interpretation", text: "The Departure separates exit, return and authority over successor AI. It develops a scenario proposed by JinHua Yip; the questions and interpretation rules are project-authored, AI-assisted draft material.", author: "IR Worldview Inventory", checked: "2026-09-11", confirmation: "Not an empirical claim", citations: [] },
  { id: "navier-report", kind: "Reported result", text: "On 8 September 2026, OpenAI reported a Navier–Stokes solution and released a write-up and Lean formalization. This project has not checked the proof or independently confirmed the result.", author: "OpenAI, as reported by the project", checked: "2026-09-11", confirmation: "Report not independently verified here", citations: [{ source: "openai", locator: "Opening statement and ‘The result’" }] },
  { id: "clay-status", kind: "Observed development", text: "When checked on 11 September 2026, Clay’s problem page displayed ‘Active’. That page status does not establish acceptance or rejection of OpenAI’s proof claim.", author: "IR Worldview Inventory source check", checked: "2026-09-11", confirmation: "Page status observed; not proof adjudication", citations: [{ source: "clay", locator: "Status above the page title" }] },
  { id: "capability-limit", kind: "Speculative implication", text: "Even a confirmed mathematical breakthrough would not establish general superintelligence, benevolence or the credibility of this fictional invitation. Treatments, abundance and feasible space settlements are stipulated for the story, not inferred from that report.", author: "IR Worldview Inventory", checked: "2026-09-11", confirmation: "Not an empirical claim", citations: [] },
]

export const departureContinuation = [
  { title: "A gift is not a mandate", text: "Medical and material benefits establish competence within the story. They do not settle who may govern. Noninterference as a chosen policy also differs from lacking the power to intervene. A departing AI could remain overwhelmingly powerful." },
  { title: "Staying must remain a viable choice", text: "People who stay keep the shared tools. But a gift that Earth cannot repair or maintain can preserve dependence. Children, dependents and future generations cannot simply be treated as consenting adults; a departure may divide their lives without giving each person a meaningful choice." },
  { title: "A return right needs more than words", text: "Transport capacity, access, maintenance, travel time and communication delays all matter. Independent institutions may document violations without being able to stop a vastly more powerful system. Even the revised offer leaves that enforcement problem open outside the trusted premise." },
  { title: "Shared risk does not settle who rules", text: "Self-government does not automatically grant a right to impose unlimited catastrophic risk on other polities. Yet monitoring, stopping a demonstrated threat and suppressing a future competitor are different powers. A blanket monopoly and a narrow safety compact need different justifications." },
  { title: "Elsewhere is not empty property", text: "Settlements require decisions about resources, jurisdiction and any existing life or claims. This story uses speculative biological space travel. Digital copying, uploading and travel to another dimension would change its physical and identity assumptions and require separate scenarios." },
] as const
