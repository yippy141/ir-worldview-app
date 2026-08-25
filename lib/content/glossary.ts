// Shared definitions for the recurring terms in the inventory. These live on
// the Methods page, where a reader who needs a definition can find all of them
// together instead of meeting them one at a time under a result.

export type GlossaryTerm = {
  term: string
  definition: string
}

export const glossaryTerms: GlossaryTerm[] = [
  {
    term: "Realism",
    definition:
      "A tradition that treats states as the primary actors in world politics, emphasizes the role of power and uncertainty, and is skeptical that institutions or norms can fully restrain competition.",
  },
  {
    term: "Institutionalism",
    definition:
      "An approach arguing that international institutions, including treaties, organizations, and rules, can make cooperation more durable even in the absence of a central authority to enforce them.",
  },
  {
    term: "Constructivism",
    definition:
      "A perspective emphasizing how the meaning of threats, alliances, and interests is shaped by identity, recognition, and shared social expectations beyond the material facts.",
  },
  {
    term: "Political economy",
    definition:
      "An approach explaining world politics through structures of production, finance, trade dependence, and economic power where a security-first account would look to military rivalry alone.",
  },
  {
    term: "Pluralism",
    definition:
      "In normative IR theory, the view that international order rests on sovereign equality and non-intervention. States should not be forced to conform to a single standard of governance.",
  },
  {
    term: "Solidarism",
    definition:
      "The view that there are universal moral obligations that can, in extreme cases, override state sovereignty, for instance to stop mass atrocities.",
  },
  {
    term: "Restraint",
    definition:
      "A grand-strategy disposition that favors limiting military commitments, avoiding overextension, and resisting the temptation to seek permanent primacy.",
  },
]
