import Link from "next/link"
import type { Metadata } from "next"

export const metadata: Metadata = {
  title: "Privacy and Data Use — IR Worldview Inventory",
  description:
    "How the IR Worldview Inventory handles local results, optional research storage, contact information, and deletion requests.",
}

const commitments = [
  "Product use works without research opt-in.",
  "Raw answers are never sent to third-party analytics.",
  "No ads, no sale of profile data, no political targeting, and no session replay.",
  "Optional contact information is handled separately from answer and result records.",
  "Stored raw answer records, if activated in beta, are pseudonymous or de-identified rather than strictly anonymous.",
]

export default function PrivacyPage() {
  return (
    <div className="container stack-lg">
      <section className="panel stack-md">
        <p className="eyebrow">Privacy and data use</p>
        <h1>Use the inventory without contributing research data.</h1>
        <p className="muted" style={{ lineHeight: "1.7", maxWidth: "720px" }}>
          The IR Worldview Inventory stores normal results in your browser so Profile can work on
          this device. V13 adds copy and interface scaffolding for an optional research layer, but
          database storage is not activated in this build.
        </p>
      </section>

      <section className="panel stack-md">
        <h2>Current default</h2>
        <p style={{ lineHeight: "1.7" }}>
          Your Foundation, module, AI, and Profile flows should work whether or not you opt into
          research. Result links encode the result data needed to open the page. Local Profile data
          stays in browser storage on the device unless you clear it.
        </p>
        <ul className="content-list">
          {commitments.map((item) => (
            <li key={item}>{item}</li>
          ))}
        </ul>
      </section>

      <section className="panel stack-md">
        <h2>Optional research layer</h2>
        <p style={{ lineHeight: "1.7" }}>
          During a later beta, you may be asked whether you want to contribute answers and derived
          results to a first-party research dataset. That storage must be explicit opt-in and
          unchecked by default. It is meant for question improvement, model testing, and aggregate
          insight posts, not advertising or targeting.
        </p>
        <p style={{ lineHeight: "1.7" }}>
          Because raw answers plus a persistent respondent or session ID can still be linked within
          the dataset, stored research records will be described as pseudonymous or de-identified,
          not truly anonymous.
        </p>
      </section>

      <section className="panel stack-md">
        <h2>Contact information</h2>
        <p style={{ lineHeight: "1.7" }}>
          Optional contact email, if offered, is for follow-up only. It should be kept separate from
          answer and result records. Do not put email, name, employer, or other contact details
          inside answer payloads.
        </p>
      </section>

      <section id="delete-data" className="panel stack-md">
        <h2>Delete stored research data</h2>
        <p style={{ lineHeight: "1.7" }}>
          If you opted into research storage and want stored responses deleted, use the feedback
          form and include your respondent ID, result link, or session ID if you have it. If you did
          not opt into research storage, clearing browser data is enough to remove local Profile
          continuity from your device.
        </p>
        <div className="row gap-sm wrap">
          <Link href="/feedback?topic=deletion" className="cta-primary">
            Request deletion
          </Link>
          <Link href="/method" className="cta-secondary">
            Read Methods
          </Link>
        </div>
      </section>
    </div>
  )
}
