import Link from "next/link"

/** Connections are authored in the additive evidence contract, not the frozen
 * module-schema bridge. This invitation never pools scores or assigns a view. */
export function AiProjectBridge({ mode }: { mode: "landing" | "result" }) {
  return <section className="result-section stack-sm">
    <h2>{mode === "result" ? "Connect this with another question" : "Start with the subject that interests you"}</h2>
    <p>{mode === "result" ? "Profile connects available choices about access, public capacity and cooperation. With one saved subject, it offers a question to examine next." : "AI Governance works on its own. You can return to your saved results or compare a result someone chooses to share."}</p>
    <p><Link href="/profile">Open Profile</Link> · <Link href="/compare">Compare results</Link></p>
  </section>
}
