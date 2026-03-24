import Link from "next/link"
import { exploreFamilies, exploreGaps, issueCompares } from "@/lib/explore-content"
import { FamilyCard } from "@/components/explore/family-card"
import { familyLabel } from "@/lib/worldview-config"
import type { Metadata } from "next"

export const metadata: Metadata = {
  title: "Explore — IR Worldview Inventory",
  description:
    "A field guide to the worldview families the inventory draws on — what each tradition emphasizes, what it misses, and what it tends to find persuasive.",
}

export default function ExplorePage() {
  return (
    <div className="wide-container">
      {/* Header */}
      <div className="article-header stack-sm">
        <p className="eyebrow">Worldview library</p>
        <h1>Explore the perspectives</h1>
        <p className="muted" style={{ lineHeight: "1.7", fontSize: "1.05rem", maxWidth: "560px" }}>
          International Relations theory is not a single political spectrum. The traditions below
          disagree about what drives world politics, what evidence is most relevant, and what kinds
          of arguments are most persuasive. This is a field guide, not an endorsement of any one
          view.
        </p>
      </div>

      <hr className="divider" />

      {/* Why this is not a left-right spectrum note */}
      <div className="article-section stack-sm">
        <h2>Why this is not a political compass</h2>
        <p style={{ lineHeight: "1.7" }}>
          The worldview families here are theoretical orientations, not political positions. A
          person can hold realist instincts on great-power rivalry while holding solidarist
          instincts on humanitarian law. They can be persuaded by critical political economy on
          trade and by institutionalism on arms control. Most serious analysts in this field draw on
          more than one tradition, depending on the issue.
        </p>
        <p style={{ lineHeight: "1.7" }}>
          The quiz is designed to surface which framework dominates your instincts in aggregate —
          not to assign you a permanent label. The runner-up family often matters as much as the
          primary one.
        </p>
      </div>

      <hr className="divider" />

      {/* Umbrella traditions */}
      <div className="article-section stack-md">
        <h2>Each tradition is an umbrella</h2>
        <p style={{ lineHeight: "1.7" }}>
          None of the families below is a single unified school. Each is a grouping of related
          arguments that share certain premises — a family resemblance, not a doctrine.
        </p>
        <div className="stack-sm">
          <div>
            <p style={{ lineHeight: "1.7" }}>
              <strong>Realism</strong> includes classical realists (who ground the argument in human
              nature and statecraft), structural realists (who locate the explanation in systemic
              anarchy), offensive realists (who argue the structure pushes toward power maximization),
              and defensive realists (who argue it often rewards restraint). They share the premise
              that power and self-help are durable features of world politics — they disagree on what
              follows from that.
            </p>
          </div>
          <div>
            <p style={{ lineHeight: "1.7" }}>
              <strong>Liberalism</strong> is also an umbrella. The tradition modeled here —
              liberal institutionalism — emphasizes how rules, monitoring, and repeated interaction
              can make cooperation more durable. Other liberal strands include commercial liberalism
              (trade and economic interdependence reduce the incentive for conflict), republican
              liberalism (democratic institutions shape what governments can credibly commit to
              internationally), and sociological liberalism (transnational actors and networks
              matter). The quiz primarily tests institutionalist instincts.
            </p>
          </div>
          <div>
            <p style={{ lineHeight: "1.7" }}>
              <strong>Constructivism</strong> ranges from conventional constructivism (norms and
              identity are empirically important variables) to critical constructivism (which asks
              whose interests prevailing norms serve) to poststructuralism (which questions the
              stable identities that even conventional constructivism assumes). What they share is
              the claim that the meaning of threats and interests is partly socially constructed.
            </p>
          </div>
          <div>
            <p style={{ lineHeight: "1.7" }}>
              <strong>Critical political economy</strong> includes Marxist political economy,
              dependency theory, world-systems theory, neo-Gramscian IPE, and structural power
              analysis. They agree that global economic structures shape state autonomy in ways
              that conventional security analysis misses — they differ on which structural mechanisms
              matter most and whether reform from within is possible.
            </p>
          </div>
        </div>
      </div>

      <hr className="divider" />

      {/* Modeled families grid */}
      <div className="article-section stack-md">
        <h2>Traditions modeled in the quiz</h2>
        <p className="muted" style={{ lineHeight: "1.65" }}>
          These four traditions are classified by the inventory. Each page explains what the
          tradition emphasizes, what it misses, and how well the current quiz models it.
        </p>
        <div className="explore-grid">
          {exploreFamilies.map((family) => (
            <FamilyCard key={family.slug} family={family} />
          ))}
        </div>
      </div>

      <hr className="divider" />

      {/* Issue comparisons */}
      <div className="article-section stack-md">
        <div className="stack-xs">
          <h2>How the traditions read major issues</h2>
          <p className="muted" style={{ lineHeight: "1.65" }}>
            Three recurring questions in contemporary foreign policy — seen through all four
            modeled traditions side by side.
          </p>
        </div>
        <div>
          {issueCompares.map((issue) => (
            <div key={issue.slug} className="compare-issue">
              <h3 style={{ fontFamily: "Georgia, serif", fontSize: "1.1rem", marginBottom: "6px" }}>
                {issue.title}
              </h3>
              <p className="muted" style={{ fontSize: "0.875rem", lineHeight: "1.55", marginBottom: "0" }}>
                {issue.summary}
              </p>
              <div className="compare-grid">
                {issue.readings.map((r) => (
                  <div key={r.familyKey} className="compare-cell">
                    <p className="compare-cell-label">{familyLabel(r.familyKey)}</p>
                    <p style={{ fontSize: "0.875rem", lineHeight: "1.6", color: "var(--muted)" }}>
                      {r.note}
                    </p>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>

      <hr className="divider" />

      {/* Coverage gaps */}
      <div className="article-section stack-md">
        <div className="stack-xs">
          <h2>Important traditions not yet fully modeled</h2>
          <p className="muted" style={{ lineHeight: "1.65" }}>
            These traditions matter for understanding world politics. They are not yet scored
            outputs of this version of the inventory — adding them would require new dimensions and
            items that the current question bank does not support. They are included here because
            omitting them without explanation would misrepresent the theoretical landscape.
          </p>
        </div>
        <div className="stack-md">
          {exploreGaps.map((gap) => (
            <div key={gap.slug} className="gap-entry">
              <h3>{gap.name}</h3>
              <p style={{ lineHeight: "1.65", marginTop: "8px" }}>{gap.summary}</p>
              <p
                className="muted"
                style={{
                  fontSize: "0.875rem",
                  lineHeight: "1.6",
                  marginTop: "10px",
                  paddingTop: "10px",
                  borderTop: "1px solid var(--border)",
                }}
              >
                <strong>Why not yet modeled:</strong> {gap.whyNotYetModeled}
              </p>
            </div>
          ))}
        </div>
      </div>

      <hr className="divider" />

      {/* Western-canon note */}
      <div className="article-section stack-sm">
        <h2>A note on coverage and the Western canon</h2>
        <p style={{ lineHeight: "1.7" }}>
          The traditions described here — and the quiz that draws on them — reflect IR theory as it
          has been predominantly taught and published in Anglo-American and Western European
          universities. This is a real limitation. IR as a discipline has been shaped by the
          strategic concerns, historical experiences, and institutional positions of a particular
          set of actors. Scholars from non-Western contexts often read the same international
          situations through different priors, shaped by colonial legacies, geographic position, and
          strategic cultures that the mainstream theoretical canon was not designed to capture.
        </p>
        <p style={{ lineHeight: "1.7" }}>
          This inventory measures theoretical orientation as expressed through questions drawn from
          that canon. It does not adjust scores for national background, and it does not claim to
          capture how people from all strategic cultures approach world politics. The postcolonial
          and decolonial traditions in the gap section above are partly a response to this problem.
        </p>
      </div>

      <hr className="divider" />

      <div className="article-section">
        <Link href="/quiz" className="cta-primary">Take the quiz →</Link>
      </div>
    </div>
  )
}
