import type { BetaPageContent } from "@/content/locales/beta-types"

export const englishBetaPage = {
  metadata: {
    title: "Controlled Beta | IR Worldview Inventory",
    description:
      "Optional interviews and product feedback about whether the IR Worldview Inventory is clear, fair, and useful.",
    openGraph: {
      type: "website",
      title: "Controlled Beta | IR Worldview Inventory",
      description:
        "Help test the comprehension, fairness, and usefulness of this editorial interactive.",
    },
  },
  eyebrow: "Controlled beta",
  title: "Help test whether the Inventory is clear, fair, and useful.",
  intro:
    "This limited beta is gathering product feedback about how people understand and use the Inventory. Participation is optional and does not affect your results or access to the site.",
  testingTitle: "What the project is testing",
  testingItems: [
    "Comprehension: whether the questions, results, and limitations make sense without extra explanation.",
    "Fairness: whether competing positions are represented accurately and without steering the reader.",
    "Usefulness: whether the experience helps people reflect on a judgment or discuss it more clearly.",
  ],
  participationTitle: "Take part outside the app",
  participationBody:
    "The project owner may provide an external interview scheduler or feedback form. It opens outside this site.",
  optionalNote:
    "Participation is optional. You can use every public part of the Inventory without booking an interview or submitting feedback.",
  participationLink: "Open the beta participation page",
  linkUnavailable:
    "Beta interviews are not accepting bookings from this page right now. The rest of the site remains available.",
  opensNewTab: "Opens in a new tab.",
  boundariesTitle: "Do not include private result or identity details",
  boundariesIntro:
    "Whether you join an interview or use an external form, do not paste or send:",
  prohibitedItems: [
    "quiz answers or Current Case answers;",
    "result URLs or Profile links;",
    "details about your employer or school; or",
    "another person’s information.",
  ],
  dataTitle: "Product feedback is separate from aggregate counters",
  productFeedbackBody:
    "Product feedback is what you deliberately choose to share through the external participation service. It is used to assess the design and editorial experience.",
  tier1Body:
    "Tier 1 aggregate counters, when enabled, record coarse derived measures of product use. They are not feedback, do not enroll anyone in the beta, and contain no message or contact field.",
  externalDataBody:
    "The app has no beta-feedback form and does not store free text or contact data in its database. Anything you choose to submit through the external service is handled under that service’s terms.",
  otherRoutesTitle: "Factual, privacy, and security reports",
  correctionsBody:
    "Use the corrections and contact route only for a factual correction, privacy question, or security report. General product feedback belongs in the optional beta process.",
  correctionsLink: "Read corrections and contact",
  privacyLink: "Read privacy and data use",
  homeLink: "Return home",
} as const satisfies BetaPageContent
