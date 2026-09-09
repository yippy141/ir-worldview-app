/** Bounded reading notes, not new coding. Locators were opened 9 September 2026.
 * Source IDs resolve through the existing reference catalog; its historical records stay intact.
 */
export const referenceIntroductions: Readonly<Record<string, {
  argument: string; mechanism: string; limitation: string; sourceId: string; locator: string;
}>> = {
  "robert-keohane": {
    argument: "Cooperation need not depend on states becoming altruistic. Keohane asks how governments with competing interests can still make agreements worth keeping. Institutions matter when they change the practical conditions under which those governments bargain.",
    mechanism: "Repeated negotiations make reputation consequential. Shared information and monitoring help governments judge whether partners have kept an agreement; established procedures lower the cost of negotiating the next one. Reciprocity then has something observable to work with, even without a world government enforcing every promise.",
    limitation: "This argument does not remove power from cooperation. A government may still reject a mutually beneficial arrangement if it fears that a rival will gain more from it. Institutional design therefore cannot be read as a guarantee of agreement.",
    sourceId: "S7", locator: "International Institutions: Can Interdependence Work? (1998), PDF pp. 2–3, Theory and Reality / Challenges to Institutional Theory",
  },
  "alexander-wendt": {
    argument: "Wendt questions a starting assumption shared by many debates about cooperation: that states arrive with fixed, self-interested identities. His 1994 argument asks whether interaction can change who states understand themselves to be, and therefore what they want.",
    mechanism: "If repeated interaction produces a collective identity, another state's interests can become part of how an actor defines its own. The proposed mechanism is a change in interests, beyond bargaining more efficiently over interests that stay fixed.",
    limitation: "This is a hypothesis about how collective identities could form, not evidence that any particular rivalry will disappear. The article also raises a political cost: transnational authority could weaken the territorial basis of democratic accountability.",
    sourceId: "S11", locator: "Collective Identity Formation and the International State (1994), abstract; full article not consulted for this note",
  },
  "susan-strange": {
    argument: "Strange asks who can shape the conditions within which other people, firms and governments must act. A territorial map of states can miss authority exercised through markets, credit and control of knowledge.",
    mechanism: "Her structural account follows security, production, finance and knowledge rather than assuming that all consequential authority lies with governments. A relationship called interdependence may contain unequal dependence: one side has alternatives that the other lacks.",
    limitation: "More rules do not necessarily mean more effective state authority. Strange distinguishes the quantity of regulation from governments' ability to perform basic functions. This is an argument from her 1996 preface, not a claim that states have vanished or a new assessment of today's balance of power.",
    sourceId: "S13", locator: "The Retreat of the State (1996), preface, publisher preview PDF pp. 11–14",
  },
  "john-mearsheimer": {
    argument: "In his 2019 argument about international order, Mearsheimer links the limits of liberal projects to nationalism and great-power competition. The question is how far a shared order can reach when its political ambitions provoke resistance.",
    mechanism: "The published summary distinguishes an order that manages the world economy from more bounded orders organized around competing powers. Cooperation over some functions and security competition can therefore coexist in this account.",
    limitation: "The predicted configuration is Mearsheimer's 2019 argument, not an established outcome or a current forecast by this project. The summary supports this narrow account; it does not establish how every institution or conflict will develop.",
    sourceId: "S2", locator: "Bound to Fail (Spring 2019), Belfer Center published summary",
  },
}
