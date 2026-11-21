import Link from "next/link"

export function ProfileMethodCallout({ domain = "foundation" }: { domain?: "foundation" | "ai" }) {
  return <aside className="callout">
    <p><strong>How to read this profile: </strong>{domain === "foundation"
      ? "This reading maps your instinctive priorities across four traditions (Realism, Institutionalism, Constructivism, and Critical Political Economy) and two strategic postures."
      : "This reading maps your priorities across eight AI governance questions and six approaches to governing the technology."} Treat it as a starting lens for debate rather than a fixed label. <Link href={domain === "foundation" ? "/method#how-answers-become-a-profile" : "/ai/field-guide"}>{domain === "foundation" ? "See how Foundation answers are interpreted" : "Explore the AI governance dimensions"} →</Link></p>
  </aside>
}
