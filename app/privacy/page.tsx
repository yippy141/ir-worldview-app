import Link from "next/link"
import type { Metadata } from "next"
import { AnalyticsOptOut } from "@/components/privacy/analytics-opt-out"
import { LocalDataControls } from "@/components/privacy/local-data-controls"

export const metadata: Metadata = {
  title: "Privacy and Data Use — IR Worldview Inventory",
  description:
    "How the IR Worldview Inventory handles local results, sharing, coarse measurement, and research collection.",
}

const commitments = [
  "Foundation, Focus Area, AI, Perspective, Profile, and Current Case histories remain browser-local.",
  "V19 has no active research-response intake or research contact form.",
  "Research routes do not read request bodies and cannot be activated with environment variables.",
  "Product measurement uses a closed event and property allowlist with a browser opt-out.",
  "No ads, profile-data sale, political targeting, session replay, or individual scoring dashboard.",
]

export default function PrivacyPage() {
  return (
    <div className="container stack-lg">
      <section className="panel stack-md">
        <p className="eyebrow">Privacy and data use</p>
        <h1>Your results stay in this browser unless you choose to share them.</h1>
        <p className="muted" style={{ lineHeight: "1.7", maxWidth: "720px" }}>
          The inventory requires no account. Saved layers and Current Case judgments support your
          Profile on this device. Research-response collection is unavailable in V19.
        </p>
      </section>

      <section className="panel stack-md">
        <h2>Current boundary</h2>
        <ul className="content-list">
          {commitments.map((item) => (
            <li key={item}>{item}</li>
          ))}
        </ul>
      </section>

      <section className="panel stack-md">
        <h2>Research collection is not active</h2>
        <p style={{ lineHeight: "1.7" }}>
          The previous scaffold allowed persistent respondent and session IDs, contact email,
          exact times, derived profiles, arbitrary JSON, and natural-language fields. That contract
          has been removed. The legacy submit, event, and deletion routes now return a fixed
          unavailable response without reading the body.
        </p>
        <p style={{ lineHeight: "1.7" }}>
          A future study needs an owner-approved data dictionary and separate legal, ethics,
          consent, retention, deletion, security, and access review. The default proposal is one
          server-issued ID per run with no cross-run linkage. No future-study consent control is
          shown now because it would suggest a collection path that does not exist.
        </p>
      </section>

      <section className="panel stack-md">
        <h2>Coarse product measurement</h2>
        <p style={{ lineHeight: "1.7" }}>
          Vercel Web Analytics receives a small set of named interactions through a first-party
          validator. Automatic pageview tracking is not installed. The only custom properties are
          a published Current Case ID when relevant, broad route category, device class, referrer
          category, and broad return-age bucket.
        </p>
        <p style={{ lineHeight: "1.7" }}>
          Full URLs, result payloads, answer IDs, confidence, reasoning tags, profile families,
          saved-result flags, dimension scores, email, free text, custom timestamps, and app-owned
          IP records are rejected. Referrer URLs are reduced to categories in the browser, and the
          provider wrapper does not forward request IP, cookie, user-agent, or referrer headers.
        </p>
        <p style={{ lineHeight: "1.7" }}>
          A first-seen UTC date stays in this browser to create the return-age bucket. It is not sent
          as an identifier and is deleted when you opt out or delete local history.
        </p>
        <AnalyticsOptOut />
      </section>

      <section className="panel stack-md">
        <h2>Sharing</h2>
        <p style={{ lineHeight: "1.7" }}>
          Foundation, AI, module, Perspective, and shared Profile links encode the data needed to
          reopen the shared view. Treat those URLs as disclosures you control. Removing local
          history does not retract a link already sent or remove it from browser or message history.
        </p>
        <p style={{ lineHeight: "1.7" }}>
          Ordinary Current Case links contain no answer. You may explicitly add your own final
          reading to native share or copied text. The former encrypted friend-challenge link has
          been retired because it was a non-revocable bearer disclosure of choice and confidence.
          V19 now offers a case-only invitation for direct comparison after both readers finish.
        </p>
      </section>

      <section className="panel stack-md">
        <h2>Corrections and contact</h2>
        <p style={{ lineHeight: "1.7" }}>
          The prior Google Form accepted free text and optional contact details, so the product no
          longer links to it. The narrow contact route is for factual corrections, privacy
          questions, and security reports. It is not automatically linked to a result, Profile,
          Current Case response, or analytics event.
        </p>
        <p style={{ margin: 0 }}>
          <Link href="/feedback">Read the corrections and contact boundary →</Link>
        </p>
      </section>

      <section id="delete-data" className="panel stack-md">
        <h2>Delete local history</h2>
        <p style={{ lineHeight: "1.7" }}>
          This control removes app-owned results, drafts, and judgment history from this browser.
          There is no server-side research record to request or identify in V19.
        </p>
        <LocalDataControls />
        <p style={{ margin: 0 }}>
          <Link href="/method">Read Methods →</Link>
        </p>
      </section>
    </div>
  )
}
