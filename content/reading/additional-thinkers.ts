/** Reading essays only. These carry no dimension estimates or claimed coding review. */
export const additionalThinkers = [
  {
    id: "hedley-bull", name: "Hedley Bull", topic: "Order among sovereign states", year: "1977",
    argument: "How can states maintain an international order without a world government? Bull examines the rules and practices that make a society of states possible, even when its members compete and sometimes go to war.",
    explanation: "His account gives diplomacy, international law and the balance of power a place alongside conflict. It asks what holds an order together and whether alternatives to the states system would do better.",
    question: "When rival governments keep diplomatic channels open during a crisis, what shared practices are they trying to preserve?",
    limit: "Explaining how an order survives does not settle whether it treats everyone fairly. Bull addresses order and justice as distinct questions.",
    source: { title: "The Anarchical Society", publisher: "Columbia University Press", url: "https://cup.columbia.edu/book/the-anarchical-society/9780231161299/", scope: "Publisher description and contents for the fourth edition of the 1977 work; not a review of the full text." },
  },
  {
    id: "elinor-ostrom", name: "Elinor Ostrom", topic: "Governing shared resources", year: "1990",
    argument: "Shared resources do not always require a choice between state control and private ownership. Ostrom studies how people who depend on the same forests, fisheries or water supplies can sometimes govern them together.",
    explanation: "Governing the Commons compares arrangements that worked with ones that failed. The point is to understand the conditions that support cooperation, rather than assume that one form of ownership will solve every problem.",
    question: "If several communities depend on the same water supply, who should help write its rules and how would they know whether those rules are being followed?",
    limit: "Success in one community does not establish that the same arrangement will work across countries or at a larger scale.",
    source: { title: "Governing the Commons", publisher: "Cambridge University Press", url: "https://www.cambridge.org/core/books/governing-the-commons/7AB7AE11BADA84409C34815CC288CD79", scope: "Publisher description and chapter contents for the 1990 book; not a review of every case study." },
  },
  {
    id: "amitav-acharya", name: "Amitav Acharya", topic: "How ideas change as they travel", year: "2004",
    argument: "An idea promoted internationally does not arrive in an empty political landscape. Acharya asks how local actors adapt outside norms to beliefs and practices they already regard as legitimate.",
    explanation: "His account of norm localization shifts attention from whether a region accepts or rejects an outside rule to how people reshape it. Local actors help determine what the rule comes to mean.",
    question: "When a regional organization adopts an international principle, which parts change to fit local concerns, and who gets to decide?",
    limit: "Adaptation is not necessarily agreement with the original proposal. This account does not establish that every local practice is fair or that outside pressure never matters.",
    source: { title: "How Ideas Spread: Whose Norms Matter? Norm Localization and Institutional Change in Asian Regionalism", publisher: "International Organization / Cambridge University Press", url: "https://www.cambridge.org/core/journals/international-organization/article/how-ideas-spread-whose-norms-matter-norm-localization-and-institutional-change-in-asian-regionalism/7C6449C7612BC9AEE0C574C4CD9E7B63", scope: "Published abstract of the 2004 article; a reading introduction, not a present-day policy profile." },
  },
  {
    id: "amartya-sen", name: "Amartya Sen", topic: "Whose welfare counts", year: "1998",
    argument: "A policy can improve a national total while leaving the poorest people no better off. Sen’s work asks what information we need to judge welfare, poverty and decisions made on behalf of society.",
    explanation: "Counting everyone below a poverty line misses how far below it they are and how hardship is distributed. Sen also examines how collective decisions can take individual values and rights into account.",
    question: "If a policy raises average income, what would you need to know about who gains and who loses before calling it a success?",
    limit: "A better measure makes a tradeoff easier to see; it does not choose the policy for us. This essay covers the research described by the Academy in 1998, not Sen’s later work or a position on a current dispute.",
    source: { title: "The Prize in Economic Sciences 1998: Social Choice, Welfare Distributions, and Poverty", publisher: "Royal Swedish Academy of Sciences / NobelPrize.org", url: "https://www.nobelprize.org/prizes/economic-sciences/1998/press-release/?app=true", scope: "The Academy’s 14 October 1998 explanation of Sen’s research contributions." },
  },
] as const
export type AdditionalThinker = typeof additionalThinkers[number]
export function getAdditionalThinker(id: string) { return additionalThinkers.find(thinker => thinker.id === id) }
