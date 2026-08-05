import Link from "next/link"
import type { Metadata } from "next"
import { AnalyticsOptOut } from "@/components/privacy/analytics-opt-out"
import { LocalDataControls } from "@/components/privacy/local-data-controls"
import { createEnglishApprovedMetadata } from "@/i18n/metadata"

export const metadata: Metadata = createEnglishApprovedMetadata("/privacy", {
  title: "Privacy and Data Use — IR Worldview Inventory",
  description:
    "How the IR Worldview Inventory handles local results, sharing, coarse measurement, and research collection.",
})

const commitments = [
  "Raw answers and saved Foundation, Focus Area, AI, Perspective, Profile, and Current Case histories remain browser-local.",
  "The site does not collect research responses or research contact details.",
  "Product measurement uses a closed event and property allowlist with a browser opt-out.",
  "No ads, profile-data sale, political targeting, session replay, or individual scoring dashboard.",
]

export default function PrivacyPage() {
  return (
    <div className="container stack-lg">
      <section className="panel stack-md">
        <p className="eyebrow">Privacy and data use</p>
        <h1>Your raw answers and saved history stay in this browser.</h1>
        <p className="muted" style={{ lineHeight: "1.7", maxWidth: "720px" }}>
          The inventory requires no account. Saved results and Current Case judgments support your
          Profile on this device. When coarse measurement is enabled, the separate aggregate
          counters described below receive derived buckets. Raw answers and saved histories stay
          outside those counters.
          The site does not collect research responses.
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
        <h2>Research responses</h2>
        <p style={{ lineHeight: "1.7" }}>
          The site does not ask for consent to a study, collect research responses, or connect
          contact details to quiz results. A future study would need separate information about its
          purpose, data, consent, retention, deletion, security, and access rules before collection
          could begin.
        </p>
      </section>

      <section className="panel stack-md">
        <h2>Coarse product measurement</h2>
        <p style={{ lineHeight: "1.7" }}>
          Separate first-party aggregate counters record each Foundation step reached. On result
          generation, they also receive derived score and label buckets plus each item ID and a
          coarse response-time bucket. These counters receive no answers, raw timestamps, response
          ordering, respondent or session identifier, credentials, or referrer.
        </p>
        <p style={{ lineHeight: "1.7" }}>
          Vercel Web Analytics receives a small set of named interactions. Automatic pageview
          tracking is not installed. The only custom properties are a published Current Case ID
          when relevant, broad route category, device class, referrer category, and broad
          return-age bucket.
        </p>
        <p style={{ lineHeight: "1.7" }}>
          Full URLs, result payloads, answer IDs, confidence, reasoning tags, profile families,
          saved-result flags, dimension scores, email, free text, custom timestamps, and app-owned
          persistent IP records are excluded. Referrer URLs are reduced to categories in the
          browser. The analytics request does not include request IP, cookie, user-agent, or
          referrer headers.
        </p>
        <p style={{ lineHeight: "1.7" }}>
          To limit aggregate-counter abuse, the write endpoint converts the request IP into a
          process-salted, one-way bucket key. Neither the IP nor that key is written to the
          aggregate database. The key stays only in server memory and expires with the server
          process.
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
          Ordinary Current Case links contain no answer. You may explicitly add your final reading
          to native share or copied text. A case invitation contains no judgment from the sender;
          both readers complete the case before comparing their answers directly.
        </p>
      </section>

      <section className="panel stack-md">
        <h2>Corrections and contact</h2>
        <p style={{ lineHeight: "1.7" }}>
          The contact route is limited to factual corrections, privacy questions, and security
          reports. Correspondence is not automatically linked to a result, Profile, Current Case
          response, or analytics event.
        </p>
        <p style={{ margin: 0 }}>
          <Link href="/feedback">Read the corrections and contact boundary →</Link>
        </p>
      </section>

      <section id="delete-data" className="panel stack-md">
        <h2>Delete local history</h2>
        <p style={{ lineHeight: "1.7" }}>
          This control removes app-owned results, drafts, and judgment history from this browser.
          The site holds no server-side research response for you to identify or delete.
        </p>
        <LocalDataControls />
        <p style={{ margin: 0 }}>
          <Link href="/method">Read Methods →</Link>
        </p>
      </section>
    </div>
  )
}
