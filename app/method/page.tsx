import Link from "next/link"
import type { Metadata } from "next"
import { createEnglishApprovedMetadata } from "@/i18n/metadata"
import { glossaryTerms } from "@/lib/content/glossary"

export const metadata: Metadata = createEnglishApprovedMetadata("/method", {
  title: "Methods — IR Worldview Inventory",
  description:
    "How the IR Worldview Inventory works across the Foundation, separate Focus Area records, the Profile, and editorial limitations.",
})

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
    heading: "4. Focus Areas",
    body: "Security and Technology Focus Areas produce separate records from concrete issue files. Their domain scales are not translated onto the Foundation or combined into a master score.",
  },
]

const limitations = [
  {
    heading: "Not validated",
    body: "This is not a validated psychometric instrument. The dimensions, family profiles, and thresholds reflect theoretical judgment and editorial design, not large-sample calibration.",
  },
  {
    heading: "Traditions are shorthand",
    body: "Realism, institutionalism, constructivism, and critical political economy are modeled here as simplified reference profiles. The inventory preserves issue-specific combinations instead of forcing every answer into one tradition.",
  },
  {
    heading: "Political economy is not a catch-all",
    body: "The model distinguishes broad political-economy salience from a stronger critical or systemic commitment. Thinking economics matters does not automatically make someone a Critical Political Economy result.",
  },
  {
    heading: "Focus Areas are separate",
    body: "Focus Areas are meant to surface domain-specific instinct, not to masquerade as extra scientific precision. Their readouts are kept separate from the Foundation result.",
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
          This editorial questionnaire compares your answers across seven foreign-policy
          tradeoffs. It shows which arguments recur and where your judgments pull in different
          directions.
        </p>
      </section>

      <section className="panel stack-md">
        <h2>What the result can tell you</h2>
        <p style={{ lineHeight: "1.7" }}>
          The IR Worldview Inventory is best read as an editorially designed interpretation tool. It
          asks which arguments you tend to find more convincing, where your instincts cluster, and
          where they pull in different directions.
        </p>
        <p style={{ lineHeight: "1.7" }}>
          The result summarizes your answers. It has not been validated as a scientific diagnostic
          or a measure of expertise, and it does not identify a permanent personality type.
        </p>
        <div className="panel-flush stack-xs">
          <p style={{ fontWeight: 600 }}>In short</p>
          <ul style={{ margin: "8px 0 0", paddingLeft: "20px", lineHeight: "1.85", color: "var(--muted)" }}>
            <li>This editorial questionnaire has not been validated as a scientific instrument.</li>
            <li>Tradition labels are shorthand for a multidimensional profile.</li>
            <li>Mixed outputs show where your answers draw on more than one modeled tradition.</li>
            <li>No score is a population percentile. Sample percentiles appear only when a comparable cohort is large enough.</li>
          </ul>
        </div>
      </section>

      <section className="panel stack-md">
        <h2>Privacy and research data</h2>
        <p style={{ lineHeight: "1.7" }}>
          Raw answers and saved histories stay in this browser unless you explicitly share a
          link. Separate first-party counters may receive derived buckets when coarse measurement
          is enabled. The site does not collect research responses or connect contact details to
          results.
        </p>
        <p style={{ lineHeight: "1.7" }}>
          Any future study would require separate information about its purpose, data, consent,
          retention, deletion, security, and access rules. Product analytics remain coarse and do
          not accept answers, profiles, result links, or free text.
        </p>
        <p style={{ margin: 0 }}>
          <Link href="/privacy" style={{ color: "var(--accent)" }}>
            Read privacy and data use →
          </Link>
        </p>
      </section>

      <section className="panel stack-md">
              <div className="stack-xs">
          <h2>How to read a result</h2>
          <p className="muted" style={{ lineHeight: "1.65" }}>
            Read the profile first. Tradition names provide concise references for nearby patterns
            across the seven dimensions.
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
        <div className="stack-xs">
          <h2>Glossary</h2>
          <p className="muted" style={{ lineHeight: "1.65" }}>
            Short definitions for the terms that recur across questions, results, and profiles.
          </p>
        </div>
        <div>
          {glossaryTerms.map((entry) => (
            <div
              key={entry.term}
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
                {entry.term}
              </p>
              <p className="muted" style={{ lineHeight: "1.65" }}>{entry.definition}</p>
            </div>
          ))}
        </div>
      </section>

      <section className="panel stack-md">
        <h2>How Perspective Runs work</h2>
        <p style={{ lineHeight: "1.7" }}>
          Each Perspective Run answer adds a predefined change to one or more Foundation
          dimensions. The result compares those adjusted scores with your saved baseline.
        </p>
        <p style={{ lineHeight: "1.7" }}>
          The saved Foundation remains your baseline. Perspective Runs do not assign another
          worldview family or feed points back into Foundation scoring.
        </p>
        <p style={{ lineHeight: "1.7" }}>
          Small differences should be read lightly. The result names the scenario responsible for
          the largest change and the dimensions that stayed close to the baseline.
        </p>
      </section>

      <section className="panel stack-md">
        <h2>How the Worldview Map is built</h2>
        <p style={{ lineHeight: "1.7" }}>
          The reference matrix is the default view. Its columns are Power, Rules, Meaning, and
          Structure; its rows are applying advantage and restraint. The eight cells hold the eight
          pure Foundation archetypes. An exact saved Foundation payload marks one cell for a pure
          result or two cells in the same row for a blend.
        </p>
        <p style={{ lineHeight: "1.7" }}>
          The secondary continuous view has a horizontal axis from power and competition to rules
          and institutions, and a vertical axis from material and economic structure to ideas and
          norms. Each Foundation value is centered on the neutral score of 4, multiplied by an
          authored weight, and added to its axis. The two sums are divided by fixed spread constants
          and limited to the range from −1 to 1. This normalization is an editorial construction,
          not an estimate from a population.
        </p>
        <p style={{ lineHeight: "1.7" }}>
          Eligible personal baselines and Perspective Runs use those coefficients. Decision
          Patterns and evidence-coded reference positions use the same projection as contextual
          overlays. Restraint is not part of either axis, so this view cannot distinguish the two
          matrix postures. Realism, Institutionalism, and Critical political economy all include
          material explanations, so the vertical axis separates those references only weakly.
        </p>
        <p style={{ lineHeight: "1.7" }}>
          The continuous view supports orientation and side-by-side reading. Screen distance is not
          calibrated; it measures neither ideological difference nor uncertainty.
        </p>
        <p style={{ lineHeight: "1.7" }}>
          Decision Patterns use authored fingerprints. Low, medium, and high levels become 2.5,
          4, and 5.5 on the internal Foundation scale. Dimensions absent from a pattern fingerprint
          use the midpoint of 4 for projection. Decision Pattern marks are authored editorial
          examples; no population sample underlies them.
        </p>
      </section>

      <section className="panel stack-md">
        <h2>How thinkers and public positions are coded</h2>
        <p style={{ lineHeight: "1.7" }}>
          Thinkers and public positions summarize public postures from a dated source ledger. Each record
          carries an evidence window, dimension-level support, dispute notes, dated updates, and
          a second-person review before publication.
        </p>
        <p style={{ lineHeight: "1.7" }}>
          A public reading card needs support on at least five Foundation dimensions. A map position
          requires linked evidence on all seven dimensions because the projection consumes all
          seven values. Missing values remain missing, and the profile stays off the map.
        </p>
        <p style={{ lineHeight: "1.7" }}>
          The internal coding stores values on the Foundation&apos;s 1–7 scale. The public default view
          shows support levels, coding notes, sources, and disputes while keeping the coefficients
          hidden. Strong support requires linked evidence from at least two source records.
        </p>
        <p style={{ lineHeight: "1.7" }}>
          AI-governance profiles use the separate AI Governance axes and their own visualization.
          Values from the two instruments are never merged into a single coordinate.
        </p>
      </section>

      <section className="panel stack-md">
        <h2>Saved history and shared links</h2>
        <p style={{ lineHeight: "1.7" }}>
          Your browser can retain current and earlier Foundation, Focus Area, AI, and Perspective
          Run results. You can remove that history from the Privacy page.
        </p>
        <p style={{ lineHeight: "1.7" }}>
          Shared Profile links can include AI Governance and Perspective Runs with their dates.
          Older shared links may contain fewer result types.
        </p>
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
          That is why the inventory keeps the Foundation result separate from the focus-area
          modules. The modules are there to show how a profile travels into live arguments, not to
          smuggle extra points back into the core classification.
        </p>
        <p style={{ lineHeight: "1.7" }}>
          The module cards now do three different jobs. Explanation cards ask what best explains a
          case. Decision cards ask what should carry the most weight in response. Actor-lens cards
          ask what logic would look strongest from that actor&apos;s own position, and are tracked
          separately so perspective-modeling does not overwrite your own judgment.
        </p>
        <p style={{ lineHeight: "1.7" }}>
          In the current shared-result flow, the foundation profile, closest traditions, and style
          outputs are what travel with the main result link. Module interpretation is treated as a
          separate applied readout.
        </p>
        <div className="panel-flush stack-xs">
          <p style={{ fontWeight: 600 }}>Why these issue areas</p>
          <p className="muted" style={{ lineHeight: "1.65" }}>
            The focus-area structure is loosely inspired by how international affairs programs,
            including the SAIS MAIR curriculum, often group issue areas. This project is
            independent and does not imply affiliation or endorsement.
          </p>
        </div>
      </section>

      <section className="panel stack-md">
        <h2>Why the wording is plain English</h2>
        <p style={{ lineHeight: "1.7" }}>
          The prompts aim to be readable without prior theory training. Technical language lives in
          optional explainers, not in the main question stem.
        </p>
        <p style={{ lineHeight: "1.7" }}>
          Jargon-heavy prompts can reward prior training instead of revealing the judgment the
          question is meant to test. Plain language reduces that problem and makes disagreement
          easier to interpret.
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
          Module scores are issue-specific. Actor-lens responses are stored and shown, but they do
          not quietly become your main module read the way a normal own-judgment answer would.
        </p>
        <p style={{ lineHeight: "1.7" }}>
          High political-economy salience does not automatically force a Critical Political Economy
          result. A stronger critical or systemic pattern is required before that tradition becomes
          the primary shorthand.
        </p>
      </section>

      <section className="panel stack-md">
        <h2>Which choices are authored</h2>
        <p style={{ lineHeight: "1.7" }}>
          Three aspects of the scoring model involve explicit editorial choices that are not derived
          from calibration data. Naming them plainly is part of honest instrument design.
        </p>
        <div>
          {[
            {
              heading: "Second-choice answers count at reduced weight",
              body: "In Analyst mode, tradeoff and mini-case questions let you pick a second-choice answer after your primary. That secondary answer is scored at 45% of the weight of your primary pick. This reflects the intuition that a genuine second choice is a softer signal than a clear primary commitment — but it is not derived from a validated weighting experiment. It is an authored judgment.",
            },
            {
              heading: "Family weights are authored reference profiles",
              body: "The four authored tradition reference points used to identify the closest tradition-level fit — realism, institutionalism, constructivism, and critical political economy — are stylized summaries built from editorial judgment about what each tradition centrally holds. They are not derived from a sample of scholars or validated against an external standard. The closest modeled fit is an interpretive shorthand, not a certified diagnosis.",
            },
            {
              heading: "Module results are separate domain records, not Foundation measurements",
              body: "Module results come from module-specific questions and are reported on their own domain scales. They sit beside the Foundation and do not rescore its seven dimensions or archetype. There is no numeric bridge and no master score combining the records.",
            },
          ].map((item) => (
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
          <Link href="/references" style={{ color: "var(--accent)" }}>Full bibliography by tradition →</Link>
        </p>
      </section>

    </div>
  )
}
