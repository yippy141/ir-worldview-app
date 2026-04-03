import type { Metadata } from "next"

export const metadata: Metadata = {
  title: "Methods — IR Worldview Inventory",
  description:
    "How the IR Worldview Inventory works: foundation profile, tradition shorthand, style outputs, modules, and limitations.",
}

const dimensions = [
  {
    label: "Security rivalry",
    description:
      "How much weight do you give to rivalry, uncertainty about intentions, and positional competition among major powers? High scores lean toward the view that security competition is a durable constraint. Low scores suggest skepticism that rivalry is the main organizing logic.",
  },
  {
    label: "Institutions and rules",
    description:
      "Do you think rules, monitoring, and repeated interaction can make cooperation more durable even without a world government? High scores lean institutionalist. Low scores suggest you see institutions mostly as mirrors of power.",
  },
  {
    label: "Domestic politics",
    description:
      "How much do coalitions, regime type, bureaucratic capacity, and transnational actors shape foreign policy relative to external pressure? This dimension captures whether you think states facing similar environments can still behave differently for domestic reasons.",
  },
  {
    label: "Identity and legitimacy",
    description:
      "Do legitimacy, recognition, and social meaning help shape interests and threats, or are they mostly rhetorical cover for material interests? High scores lean constructivist. Low scores suggest skepticism that norms have much independent force.",
  },
  {
    label: "Markets and dependence",
    description:
      "How central are production, finance, trade dependence, sanctions, and leverage to your explanation of world politics? High scores mean you keep political economy firmly in view. They do not, by themselves, make you a critical political economist.",
  },
  {
    label: "Restraint and advantage",
    description:
      "When a major power has room to press for advantage, is the safer instinct to hold back or to exploit the opening? This is a strategic style dimension, not a standalone worldview family.",
  },
  {
    label: "Order and justice",
    description:
      "When sovereignty and wider moral obligations clash, which usually carries more weight in your judgment? This is a normative style dimension, not a claim about who is more moral.",
  },
]

const resultLayers = [
  {
    heading: "1. Core profile",
    body: "The foundation result is a seven-dimension profile. This is the main output. It shows which lines of argument you lean toward and where you are mixed.",
  },
  {
    heading: "2. Closest traditions",
    body: "One or two IR traditions are shown as interpretive shorthand for that profile. They are labels for a pattern, not natural kinds or permanent identities.",
  },
  {
    heading: "3. Strategic and normative style",
    body: "The result also reports a strategic style and a normative style. These modifiers sit alongside the profile. They are not separate worldview families.",
  },
  {
    heading: "4. Flagship modules",
    body: "Security and Technology modules sit on top of the foundation. They show how your instincts travel in a specific issue domain, but they do not replace the foundation result.",
  },
]

const limitations = [
  {
    heading: "Not validated",
    body: "This is not a validated psychometric instrument. The dimensions, family profiles, and thresholds reflect theoretical judgment and editorial design, not large-sample calibration.",
  },
  {
    heading: "Traditions are shorthand",
    body: "Realism, institutionalism, constructivism, and critical political economy are modeled here as simplified reference profiles. Most serious readers draw from more than one tradition depending on the issue.",
  },
  {
    heading: "Political economy is not a catch-all",
    body: "This version distinguishes broad political-economy salience from a stronger critical or systemic commitment. Thinking economics matters does not automatically make someone a Critical Political Economy result.",
  },
  {
    heading: "Modules are separate",
    body: "The flagship modules are meant to surface domain-specific instinct, not to masquerade as extra scientific precision. Their readouts are kept separate from the foundation result.",
  },
  {
    heading: "Scores are relative, not absolute",
    body: "A score of 5.4 on a dimension means you lean that way within this model's scale. It does not mean 54% of people agree with you, and it is not a percentile.",
  },
  {
    heading: "Coverage is incomplete",
    body: "The current model does not fully represent several important traditions, including feminist IR, postcolonial theory, and green IR. People anchored in those traditions may be mapped onto the nearest modeled family instead.",
  },
]

export default function MethodPage() {
  return (
    <div className="container stack-lg">
      <section className="panel stack-md">
        <p className="eyebrow">Methodology</p>
        <h1>How this inventory works</h1>
        <p className="muted" style={{ lineHeight: "1.7" }}>
          This inventory is a structured thought exercise about how you read world politics. It is
          meant to surface patterns in your answers, not to diagnose a hidden essence or certify a
          single correct school of thought.
        </p>
      </section>

      <section className="panel stack-md">
        <h2>What this is — and what it is not</h2>
        <p style={{ lineHeight: "1.7" }}>
          The IR Worldview Inventory is best read as an editorially designed interpretation tool. It
          asks which arguments you tend to find more convincing, where your instincts cluster, and
          where they pull in different directions.
        </p>
        <p style={{ lineHeight: "1.7" }}>
          It is not a scientific diagnostic, not a personality test, and not a measure of knowledge
          or expertise. The result is a structured read of your answers, not objective truth about
          you.
        </p>
        <div className="panel-flush stack-xs">
          <p style={{ fontWeight: 600 }}>In short</p>
          <ul style={{ margin: "8px 0 0", paddingLeft: "20px", lineHeight: "1.85", color: "var(--muted)" }}>
            <li>This is a structured thought exercise, not a validated instrument.</li>
            <li>Tradition labels are shorthand for a multidimensional profile.</li>
            <li>Mixed outputs are normal and can be meaningful.</li>
            <li>No score is a percentile, and no answer is morally superior.</li>
          </ul>
        </div>
      </section>

      <section className="panel stack-md">
        <div className="stack-xs">
          <h2>How to read a result</h2>
          <p className="muted" style={{ lineHeight: "1.65" }}>
            The result has layers. The point is to show the profile first, then use tradition names
            as shorthand rather than as rigid boxes.
          </p>
        </div>
        <div>
          {resultLayers.map((layer) => (
            <div
              key={layer.heading}
              style={{ padding: "20px 0", borderBottom: "1px solid var(--border)" }}
            >
              <p
                style={{
                  fontWeight: 600,
                  fontFamily: "Georgia, serif",
                  marginBottom: "8px",
                  fontSize: "1rem",
                }}
              >
                {layer.heading}
              </p>
              <p className="muted" style={{ lineHeight: "1.65" }}>{layer.body}</p>
            </div>
          ))}
        </div>
      </section>

      <section className="panel stack-md">
        <h2>Who it is for</h2>
        <p style={{ lineHeight: "1.7" }}>
          The main audience is people who think seriously about foreign policy, international order,
          or strategic affairs: students, practitioners, researchers, and engaged readers. Some IR
          background helps, but the main prompts are written in plain English rather than specialist
          jargon.
        </p>
        <p style={{ lineHeight: "1.7" }}>
          It can also work as a classroom or discussion tool. The value is often in seeing where
          you expected one tradition label but the profile itself points somewhere more mixed.
        </p>
      </section>

      <section className="panel stack-md">
        <div className="stack-xs">
          <h2>The seven dimensions</h2>
          <p className="muted" style={{ lineHeight: "1.65" }}>
            The foundation profile is built from seven dimensions drawn from major debates in IR.
            They are meant to capture broad explanatory priors and style differences without
            pretending to measure everything that matters.
          </p>
        </div>
        <div>
          {dimensions.map((dim) => (
            <div
              key={dim.label}
              style={{ padding: "20px 0", borderBottom: "1px solid var(--border)" }}
            >
              <p
                style={{
                  fontWeight: 600,
                  fontFamily: "Georgia, serif",
                  marginBottom: "8px",
                  fontSize: "1rem",
                }}
              >
                {dim.label}
              </p>
              <p className="muted" style={{ lineHeight: "1.65" }}>{dim.description}</p>
            </div>
          ))}
        </div>
      </section>

      <section className="panel stack-md">
        <h2>Why the module layer is separate</h2>
        <p style={{ lineHeight: "1.7" }}>
          Broad priors and domain-specific instincts are related, but they are not the same thing.
          Someone can hold a generally institutionalist foundation profile and still lean toward
          deterrence-heavy arguments in a security module. Someone else can read world politics
          through power and rivalry in the abstract but still resist escalation in a concrete case.
        </p>
        <p style={{ lineHeight: "1.7" }}>
          That is why the inventory keeps the foundation result separate from the flagship modules.
          The modules are there to show how a profile travels into live arguments, not to smuggle
          extra points back into the core classification.
        </p>
        <p style={{ lineHeight: "1.7" }}>
          In the current shared-result flow, the foundation profile, closest traditions, and style
          outputs are what travel with the main result link. Module interpretation is treated as a
          separate applied readout.
        </p>
      </section>

      <section className="panel stack-md">
        <h2>Why the wording is plain English</h2>
        <p style={{ lineHeight: "1.7" }}>
          The prompts aim to be readable without prior theory training. Technical language lives in
          optional explainers, not in the main question stem.
        </p>
        <p style={{ lineHeight: "1.7" }}>
          This matters because jargon-heavy wording can accidentally test training rather than
          instinct. Plain language reduces that problem and makes disagreement easier to interpret.
        </p>
      </section>

      <section className="panel stack-md">
        <h2>How scoring works</h2>
        <p style={{ lineHeight: "1.7" }}>
          Scoring begins with the foundation questions. Some items are plain-language agreement
          prompts, while others are tradeoffs or mini-cases. Together they map onto the same seven
          dimensions and are averaged into a seven-dimension profile on a 1 to 7 scale.
        </p>
        <p style={{ lineHeight: "1.7" }}>
          The model then compares that profile with four stylized tradition profiles: realism,
          institutionalism, constructivism, and critical political economy. The closest one or two
          are shown as interpretive shorthand.
        </p>
        <p style={{ lineHeight: "1.7" }}>
          Strategic and normative style are reported separately from the restraint and
          order-versus-justice dimensions. They help describe the profile, but they do not create a
          new worldview family.
        </p>
        <p style={{ lineHeight: "1.7" }}>
          High political-economy salience does not automatically force a Critical Political Economy
          result. A stronger critical or systemic pattern is required before that tradition becomes
          the primary shorthand.
        </p>
        <div className="panel-flush">
          <p className="muted" style={{ lineHeight: "1.65", fontSize: "0.875rem" }}>
            <strong>On precision:</strong> Earlier versions used a &ldquo;clarity&rdquo; figure.
            That metric has been removed because it risked sounding more scientific than the model
            is.
          </p>
        </div>
      </section>

      <section className="panel stack-md">
        <h2>Important limitations</h2>
        <div>
          {limitations.map((item) => (
            <div
              key={item.heading}
              style={{ padding: "18px 0", borderBottom: "1px solid var(--border)" }}
            >
              <p style={{ fontWeight: 600, marginBottom: "7px" }}>{item.heading}</p>
              <p className="muted" style={{ lineHeight: "1.65" }}>{item.body}</p>
            </div>
          ))}
        </div>
      </section>

      <section className="panel stack-md">
        <h2>Sources and references</h2>
        <p className="muted" style={{ lineHeight: "1.65" }}>
          The theoretical content draws on major IR traditions and on classic work in survey
          design, political judgment, and belief systems. These references matter less as
          authorities to obey than as reminders of what this tool can and cannot honestly claim.
        </p>
        <div>
          {[
            {
              citation: "Likert, Rensis. \"A Technique for the Measurement of Attitudes.\" Archives of Psychology, no. 140 (1932).",
              note: "The core template behind agreement scales. Useful as a reminder that scaling answers is not the same thing as validating an instrument.",
            },
            {
              citation: "Converse, Philip E. \"The Nature of Belief Systems in Mass Publics.\" In D. E. Apter (ed.), Ideology and Discontent. Free Press, 1964.",
              note: "A classic statement of the problem any worldview inventory faces: many people do not hold fully coherent, systematized belief structures across issues.",
            },
            {
              citation: "Zaller, John R. The Nature and Origins of Mass Opinion. Cambridge University Press, 1992.",
              note: "A reminder that survey responses often reflect which considerations are most available at the moment, not permanently fixed inner doctrines.",
            },
            {
              citation: "Tetlock, Philip E. Expert Political Judgment: How Good Is It? How Can We Know? Princeton University Press, 2005.",
              note: "Relevant here because eclectic thinkers often outperform those who force every question through one master lens.",
            },
            {
              citation: "Sil, Rudra and Katzenstein, Peter J. Beyond Paradigms: Analytic Eclecticism in the Study of World Politics. Palgrave Macmillan, 2010.",
              note: "The best justification for taking mixed results seriously rather than treating the runner-up as noise.",
            },
          ].map((item) => (
            <div key={item.citation} style={{ padding: "14px 0", borderBottom: "1px solid var(--border)" }}>
              <p style={{ fontSize: "0.875rem", lineHeight: "1.6", fontStyle: "italic" }}>
                {item.citation}
              </p>
              <p className="muted" style={{ fontSize: "0.85rem", lineHeight: "1.55", marginTop: "6px" }}>
                {item.note}
              </p>
            </div>
          ))}
        </div>
        <p style={{ fontSize: "0.875rem" }}>
          <a href="/references" style={{ color: "var(--accent)" }}>Full bibliography by tradition →</a>
        </p>
      </section>

      <section className="panel stack-md">
        <h2>Version history</h2>
        <div className="stack-md">
          <div className="stack-xs">
            <p style={{ fontWeight: 600 }}>v0.4 — April 2026</p>
            <p className="muted" style={{ lineHeight: "1.65" }}>
              Minimal stable Phase 5M pass. Added Standard and Analyst foundation modes, mixed
              question types, cleaner plain-language stems, and two flagship modules for Security
              and Technology.
            </p>
          </div>
          <div className="stack-xs">
            <p style={{ fontWeight: 600 }}>v0.3 — April 2026</p>
            <p className="muted" style={{ lineHeight: "1.65" }}>
              Phase 4R pass 2. Results are now framed profile-first and tradition-second. Methods
              copy now describes the tool as a structured thought exercise, clarifies that mixed
              outputs are meaningful, and keeps the applied layer separate from the foundation result.
            </p>
          </div>
          <div className="stack-xs">
            <p style={{ fontWeight: 600 }}>v0.2 — March 2026</p>
            <p className="muted" style={{ lineHeight: "1.65" }}>
              Editorial light-theme redesign. Added clearer navigation, plain-English result
              sections, glossary, suggested reading, and the first methods page. Removed the
              earlier clarity display.
            </p>
          </div>
          <div className="stack-xs">
            <p style={{ fontWeight: 600 }}>v0.1 — Initial release</p>
            <p className="muted" style={{ lineHeight: "1.65" }}>
              Schema-driven MVP with core Likert items and branching scenarios. Dark theme.
              Results centered on family fit and dimension bars.
            </p>
          </div>
        </div>
      </section>
    </div>
  )
}
