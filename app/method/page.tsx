import Link from "next/link"
import type { Metadata } from "next"
import { createEnglishApprovedMetadata } from "@/i18n/metadata"
import { glossaryTerms } from "@/lib/content/glossary"
import styles from "./method.module.css"

export const metadata: Metadata = createEnglishApprovedMetadata("/method", {
  title: "Methods | IR Worldview Inventory",
  description:
    "How the IR Worldview Inventory works across the Foundation, separate Focus Area records, the Profile, and editorial limitations.",
})

const contents = [
  { href: "#what-results-mean", label: "What the result means" },
  { href: "#how-answers-become-a-profile", label: "How answers become a profile" },
  { href: "#evidence-and-versioning", label: "Evidence and versioning" },
  { href: "#limits-privacy-and-corrections", label: "Limits, privacy, and corrections" },
]

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
    heading: "Core profile",
    body: "The foundation result is a seven-dimension profile. This is the main output. It shows which lines of argument you lean toward and where you are mixed.",
  },
  {
    heading: "Closest traditions",
    body: "One or two IR traditions are shown as interpretive shorthand for that profile. They are labels for a pattern, not natural kinds or permanent identities.",
  },
  {
    heading: "Strategic and normative style",
    body: "The result also reports a strategic style and a normative style. These modifiers sit alongside the profile. They are not separate worldview families.",
  },
  {
    heading: "Focus Areas",
    body: "Security and Technology Focus Areas produce separate records from concrete issue files. Their domain scales are not translated onto the Foundation or combined into a master score.",
  },
]

const authoredChoices = [
  {
    heading: "Second-choice answers count at reduced weight",
    body: "In Advanced mode, tradeoff and mini-case questions let you pick a second-choice answer after your primary. That secondary answer is scored at 45% of the weight of your primary pick. This reflects the intuition that a genuine second choice is a softer signal than a clear primary commitment, but it is not derived from a validated weighting experiment. It is an authored judgment.",
  },
  {
    heading: "Family weights are authored reference profiles",
    body: "The four authored tradition reference points used to identify the closest tradition-level fit are realism, institutionalism, constructivism, and critical political economy. They are stylized summaries built from editorial judgment about what each tradition centrally holds. They are not derived from a sample of scholars or validated against an external standard. The closest modeled fit is an interpretive shorthand, not a certified diagnosis.",
  },
  {
    heading: "Focus Area results are separate records, not Foundation measurements",
    body: "Focus Area results come from issue-specific questions and are reported on their own domain scales. They sit beside the Foundation and do not rescore its seven dimensions or archetype. There is no numeric bridge and no master score combining the records.",
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

const references = [
  {
    citation:
      'Likert, Rensis. "A Technique for the Measurement of Attitudes." Archives of Psychology, no. 140 (1932).',
    note: "The core template behind agreement scales. Useful as a reminder that scaling answers is not the same thing as validating an instrument.",
  },
  {
    citation:
      'Converse, Philip E. "The Nature of Belief Systems in Mass Publics." In D. E. Apter (ed.), Ideology and Discontent. Free Press, 1964.',
    note: "A classic statement of the problem any worldview inventory faces: many people do not hold fully coherent, systematized belief structures across issues.",
  },
  {
    citation: "Zaller, John R. The Nature and Origins of Mass Opinion. Cambridge University Press, 1992.",
    note: "A reminder that survey responses often reflect which considerations are most available at the moment, not permanently fixed inner doctrines.",
  },
  {
    citation:
      "Tetlock, Philip E. Expert Political Judgment: How Good Is It? How Can We Know? Princeton University Press, 2005.",
    note: "Relevant here because eclectic thinkers often outperform those who force every question through one master lens.",
  },
  {
    citation:
      "Sil, Rudra and Katzenstein, Peter J. Beyond Paradigms: Analytic Eclecticism in the Study of World Politics. Palgrave Macmillan, 2010.",
    note: "The best justification for taking mixed results seriously rather than treating the runner-up as noise.",
  },
]

function BackToContents() {
  return (
    <a className={styles.backLink} href="#method-contents">
      Back to contents
    </a>
  )
}

export default function MethodPage() {
  return (
    <div className={`container ${styles.page}`}>
      <header className={styles.header}>
        <h1>How this inventory works</h1>
        <p className={styles.lede}>
          This editorial questionnaire compares your answers across seven foreign-policy
          tradeoffs. It shows which arguments recur and where your judgments pull in different
          directions.
        </p>
      </header>

      <nav id="method-contents" className={styles.contents} aria-label="Methods contents">
        <p className={styles.contentsTitle}>On this page</p>
        <ol className={styles.contentsList}>
          {contents.map((item) => (
            <li key={item.href}>
              <a href={item.href}>{item.label}</a>
            </li>
          ))}
        </ol>
      </nav>

      <article className={styles.record}>
        <section id="what-results-mean" className={styles.chapter}>
          <header className={styles.chapterHeader}>
            <p className={styles.chapterNumber}>Chapter 1</p>
            <h2>What the result means</h2>
            <p>
              Read the profile first. Tradition names provide concise references for nearby
              patterns across the seven dimensions.
            </p>
          </header>

          <section className={styles.subsection} aria-labelledby="what-it-can-tell-you">
            <h3 id="what-it-can-tell-you">What it can tell you</h3>
            <div className={styles.prose}>
              <p>
                The IR Worldview Inventory is best read as an editorially designed interpretation
                tool. It asks which arguments you tend to find more convincing, where your
                instincts cluster, and where they pull in different directions.
              </p>
              <p>
                The result summarizes your answers. It has not been validated as a scientific
                diagnostic or a measure of expertise, and it does not identify a permanent
                personality type.
              </p>
            </div>
            <div className={styles.keyPoints}>
              <p className={styles.keyPointsTitle}>In short</p>
              <ul>
                <li>This editorial questionnaire has not been validated as a scientific instrument.</li>
                <li>Tradition labels are shorthand for a multidimensional profile.</li>
                <li>Mixed outputs show where your answers draw on more than one modeled tradition.</li>
                <li>No score is a population percentile or population ranking.</li>
              </ul>
            </div>
          </section>

          <section className={styles.subsection} aria-labelledby="result-layers">
            <h3 id="result-layers">How to read the four result layers</h3>
            <ol className={styles.layerList}>
              {resultLayers.map((layer) => (
                <li key={layer.heading}>
                  <h4>{layer.heading}</h4>
                  <p>{layer.body}</p>
                </li>
              ))}
            </ol>
          </section>

          <section className={styles.subsection} aria-labelledby="audience">
            <h3 id="audience">Who it is for</h3>
            <div className={styles.prose}>
              <p>
                The main audience is people who think seriously about foreign policy,
                international order, or strategic affairs: students, practitioners, researchers,
                and engaged readers. Some IR background helps, but the main prompts are written in
                plain English rather than specialist jargon.
              </p>
              <p>
                It can also work as a classroom or discussion tool. The value is often in seeing
                where you expected one tradition label but the profile itself points somewhere
                more mixed.
              </p>
            </div>
          </section>

          <section className={styles.subsection} aria-labelledby="separate-modules">
            <h3 id="separate-modules">Why Focus Area records stay separate</h3>
            <div className={styles.prose}>
              <p>
                Broad priors and domain-specific instincts are related, but they are not the same
                thing. Someone can hold a generally institutionalist foundation profile and still
                lean toward deterrence-heavy arguments in a Security Focus Area. Someone else can read
                world politics through power and rivalry in the abstract but still resist
                escalation in a concrete case.
              </p>
              <p>
                That is why the inventory keeps the Foundation result separate from Focus Area
                records. Focus Areas show how a profile travels into live arguments. They do not
                add points to the core classification.
              </p>
              <p>
                Focus Area questions do three different jobs. Explanation cards ask what best
                explains a case. Decision cards ask what should carry the most weight in response.
                Actor-lens cards ask what logic would look strongest from that actor&apos;s own
                position, and are tracked separately so perspective-modeling does not overwrite
                your own judgment.
              </p>
              <p>
                In shared Foundation links, the Foundation profile, closest traditions, and
                style outputs travel with the result. Focus Area interpretation is
                treated as a separate applied readout.
              </p>
            </div>
            <div className={styles.note}>
              <h4>Why these issue areas</h4>
              <p>
                The focus-area structure is loosely inspired by how international affairs
                programs, including the SAIS MAIR curriculum, often group issue areas. This
                project is independent and does not imply affiliation or endorsement.
              </p>
            </div>
          </section>

          <BackToContents />
        </section>

        <section id="how-answers-become-a-profile" className={styles.chapter}>
          <header className={styles.chapterHeader}>
            <p className={styles.chapterNumber}>Chapter 2</p>
            <h2>How answers become a profile</h2>
            <p>
              The Foundation combines seven dimensions. Scoring and labels translate those values
              into a readable profile without turning the output into a permanent type.
            </p>
          </header>

          <section className={styles.subsection} aria-labelledby="scoring">
            <h3 id="scoring">How scoring works</h3>
            <div className={styles.prose}>
              <p>
                Scoring begins with the foundation questions. Some items are plain-language
                agreement prompts, while others are tradeoffs or mini-cases. Together they map
                onto the same seven dimensions and are averaged into a seven-dimension profile on
                a 1 to 7 scale.
              </p>
              <p>
                The model then compares that profile with four stylized tradition profiles:
                realism, institutionalism, constructivism, and critical political economy. The
                closest one or two are shown as interpretive shorthand.
              </p>
              <p>
                Strategic and normative style are reported separately from the restraint and
                order-versus-justice dimensions. They help describe the profile, but they do not
                create a new worldview family.
              </p>
              <p>
                Focus Area scores are issue-specific. Actor-lens responses are stored and shown, but
                they do not quietly become your main Focus Area read the way a normal own-judgment
                answer would.
              </p>
              <p>
                High political-economy salience does not automatically force a Critical Political
                Economy result. A stronger critical or systemic pattern is required before that
                tradition becomes the primary shorthand.
              </p>
            </div>
          </section>

          <section className={styles.subsection} aria-labelledby="seven-dimensions">
            <h3 id="seven-dimensions">The seven dimensions</h3>
            <p className={styles.subsectionIntro}>
              The foundation profile is built from seven dimensions drawn from major debates in
              IR. They are meant to capture broad explanatory priors and style differences without
              pretending to measure everything that matters.
            </p>
            <dl className={styles.definitionList}>
              {dimensions.map((dimension) => (
                <div key={dimension.label}>
                  <dt>{dimension.label}</dt>
                  <dd>{dimension.description}</dd>
                </div>
              ))}
            </dl>
          </section>

          <section className={styles.subsection} aria-labelledby="authored-choices">
            <h3 id="authored-choices">Which choices are authored</h3>
            <p className={styles.subsectionIntro}>
              Three aspects of the scoring model involve explicit editorial choices that are not
              derived from calibration data. Naming them plainly is part of honest instrument
              design.
            </p>
            <dl className={styles.definitionList}>
              {authoredChoices.map((item) => (
                <div key={item.heading}>
                  <dt>{item.heading}</dt>
                  <dd>{item.body}</dd>
                </div>
              ))}
            </dl>
          </section>

          <section className={styles.subsection} aria-labelledby="perspective-runs">
            <h3 id="perspective-runs">How Perspective Runs work</h3>
            <div className={styles.prose}>
              <p>
                Each Perspective Run answer adds a predefined change to one or more Foundation
                dimensions. The result compares those adjusted scores with your saved baseline.
              </p>
              <p>
                The saved Foundation remains your baseline. Perspective Runs do not assign another
                worldview family or feed points back into Foundation scoring.
              </p>
              <p>
                Small differences should be read lightly. The result names the scenario responsible
                for the largest change and the dimensions that stayed close to the baseline.
              </p>
            </div>
          </section>

          <section className={styles.subsection} aria-labelledby="plain-language">
            <h3 id="plain-language">Why the wording is plain English</h3>
            <div className={styles.prose}>
              <p>
                The prompts aim to be readable without prior theory training. Technical language
                lives in optional explainers, not in the main question stem.
              </p>
              <p>
                Jargon-heavy prompts can reward prior training instead of revealing the judgment
                the question is meant to test. Plain language reduces that problem and makes
                disagreement easier to interpret.
              </p>
            </div>
          </section>

          <BackToContents />
        </section>

        <section id="evidence-and-versioning" className={styles.chapter}>
          <header className={styles.chapterHeader}>
            <p className={styles.chapterNumber}>Chapter 3</p>
            <h2>Evidence and versioning</h2>
            <p>
              Maps and public-position records are editorial reference layers. Their construction,
              support, and limits remain visible rather than borrowing certainty from the scoring
              system.
            </p>
          </header>

          <section className={styles.subsection} aria-labelledby="worldview-map">
            <h3 id="worldview-map">How the Worldview Map is built</h3>
            <div className={styles.prose}>
              <p>
                The reference matrix is the default view. Its columns are Power, Rules, Meaning,
                and Structure; its rows are applying advantage and restraint. The eight cells hold
                the eight pure Foundation archetypes. An exact saved Foundation payload marks one
                cell for a pure result or two cells in the same row for a blend.
              </p>
              <p>
                The secondary continuous view has a horizontal axis from power and competition to
                rules and institutions, and a vertical axis from material and economic structure
                to ideas and norms. Each Foundation value is centered on the neutral score of 4,
                multiplied by an authored weight, and added to its axis. The two sums are divided
                by fixed spread constants and limited to the range from −1 to 1. This normalization
                is an editorial construction, not an estimate from a population.
              </p>
              <p>
                Eligible personal baselines and Perspective Runs use those coefficients. Decision
                Patterns and evidence-coded reference positions use the same projection as
                contextual overlays. Restraint is not part of either axis, so this view cannot
                distinguish the two matrix postures. Realism, Institutionalism, and Critical
                political economy all include material explanations, so the vertical axis
                separates those references only weakly.
              </p>
              <p>
                The continuous view supports orientation and side-by-side reading. Screen distance
                is not calibrated; it measures neither ideological difference nor uncertainty.
              </p>
              <p>
                Decision Patterns use authored fingerprints. Low, medium, and high levels become
                2.5, 4, and 5.5 on the internal Foundation scale. Dimensions absent from a pattern
                fingerprint use the midpoint of 4 for projection. Decision Pattern marks are
                authored editorial examples; no population sample underlies them.
              </p>
            </div>
          </section>

          <section className={styles.subsection} aria-labelledby="public-position-coding">
            <h3 id="public-position-coding">How thinkers and public positions are coded</h3>
            <div className={styles.prose}>
              <p>
                Thinkers and public positions summarize public postures from a dated source ledger.
                Each record carries an evidence window, dimension-level support, dispute notes,
                dated updates, and a second-person review before publication.
              </p>
              <p>
                A public reading card needs support on at least five Foundation dimensions. A map
                position requires linked evidence on all seven dimensions because the projection
                consumes all seven values. Missing values remain missing, and the profile stays off
                the map.
              </p>
              <p>
                The internal coding stores values on the Foundation&apos;s 1–7 scale. The public
                default view shows support levels, coding notes, sources, and disputes while
                keeping the coefficients hidden. Strong support requires linked evidence from at
                least two source records.
              </p>
              <p>
                AI-governance profiles use the separate AI Governance axes and their own
                visualization. Values from the two instruments are never merged into a single
                coordinate.
              </p>
            </div>
          </section>

          <section className={styles.subsection} aria-labelledby="saved-history">
            <h3 id="saved-history">Saved history and shared links</h3>
            <div className={styles.prose}>
              <p>
                Your browser can retain current and earlier Foundation, Focus Area, AI, and
                Perspective Run results. You can remove that history from the Privacy page.
              </p>
              <p>
                Shared Profile links can include AI Governance and Perspective Runs with their
                dates. Older shared links may contain fewer result types.
              </p>
            </div>
          </section>

          <section className={styles.subsection} aria-labelledby="glossary">
            <h3 id="glossary">Glossary</h3>
            <p className={styles.subsectionIntro}>
              Short definitions for the terms that recur across questions, results, and profiles.
            </p>
            <dl className={`${styles.definitionList} ${styles.glossaryList}`}>
              {glossaryTerms.map((entry) => (
                <div key={entry.term}>
                  <dt>{entry.term}</dt>
                  <dd>{entry.definition}</dd>
                </div>
              ))}
            </dl>
          </section>

          <section className={styles.subsection} aria-labelledby="sources-and-references">
            <h3 id="sources-and-references">Sources and references</h3>
            <p className={styles.subsectionIntro}>
              The theoretical content draws on major IR traditions and on classic work in survey
              design, political judgment, and belief systems. These references matter less as
              authorities to obey than as reminders of what this tool can and cannot honestly
              claim.
            </p>
            <ul className={styles.referenceList}>
              {references.map((item) => (
                <li key={item.citation}>
                  <cite>{item.citation}</cite>
                  <p>{item.note}</p>
                </li>
              ))}
            </ul>
            <p className={styles.relatedLink}>
              <Link href="/references">Full bibliography by tradition</Link>
            </p>
          </section>

          <BackToContents />
        </section>

        <section id="limits-privacy-and-corrections" className={styles.chapter}>
          <header className={styles.chapterHeader}>
            <p className={styles.chapterNumber}>Chapter 4</p>
            <h2>Limits, privacy, and corrections</h2>
            <p>
              The inventory states where interpretation stops, explains what generated links
              contain, and gives factual, privacy, and security problems a narrow correction route.
            </p>
          </header>

          <section className={styles.subsection} aria-labelledby="important-limitations">
            <h3 id="important-limitations">Important limitations</h3>
            <dl className={styles.definitionList}>
              {limitations.map((item) => (
                <div key={item.heading}>
                  <dt>{item.heading}</dt>
                  <dd>{item.body}</dd>
                </div>
              ))}
            </dl>
          </section>

          <section className={styles.subsection} aria-labelledby="privacy-and-research-data">
            <h3 id="privacy-and-research-data">Privacy and research data</h3>
            <div className={styles.prose}>
              <p>
                Draft answers and saved histories stay in this browser. Generating a result creates
                a URL with the data needed to reopen it; Focus Area result URLs include selected
                answer IDs. Separate first-party counters may receive derived buckets when coarse
                measurement is enabled. The site does not collect research responses or connect
                contact details to results.
              </p>
              <p>
                Any future study would require separate information about its purpose, data,
                consent, retention, deletion, security, and access rules. Product analytics remain
                coarse and do not accept answers, profiles, result links, or free text.
              </p>
            </div>
            <p className={styles.relatedLink}>
              <Link href="/privacy">Read privacy and data use</Link>
            </p>
          </section>

          <section className={styles.subsection} aria-labelledby="corrections">
            <h3 id="corrections">Corrections and contact</h3>
            <div className={styles.prose}>
              <p>
                Use the project contact route for a factual correction, privacy question, or
                security report. Do not include quiz answers, a result or Profile link, or another
                person&apos;s information.
              </p>
            </div>
            <p className={styles.relatedLink}>
              <Link href="/feedback">Read the corrections and contact boundary</Link>
            </p>
          </section>

          <BackToContents />
        </section>
      </article>
    </div>
  )
}
