import type { Metadata } from "next"

export const metadata: Metadata = {
  title: "Methods — IR Worldview Inventory",
  description:
    "How the IR Worldview Inventory works: dimensions, scoring, branching logic, and important limitations.",
}

const dimensions = [
  {
    label: "Security competition",
    description:
      "How much weight do you give to interstate rivalry, uncertainty about intentions, and positional competition among major powers? High scores indicate a realist-adjacent orientation. Low scores suggest skepticism that rivalry is the dominant organizing logic.",
  },
  {
    label: "Institutional efficacy",
    description:
      "Do you think international institutions can make cooperation more durable, even without a central enforcer? High scores indicate institutionalist-adjacent views. Low scores suggest skepticism that institutions matter beyond the preferences of powerful states.",
  },
  {
    label: "Domestic and transnational filters",
    description:
      "How much do domestic coalitions, regime type, public opinion, and transnational actors shape foreign policy relative to external constraints? This dimension captures liberal and two-level-game arguments about why states with similar external environments behave differently.",
  },
  {
    label: "Norms and identity",
    description:
      "Do you think the meaning of a threat or alliance is shaped by identity, recognition, and social expectations? High scores indicate constructivist leanings — the view that anarchy is a social condition, not a fixed one. Low scores suggest you treat norm language as cover for material interests.",
  },
  {
    label: "Political economy",
    description:
      "How central are production structures, global finance, trade dependence, and economic hierarchy to your understanding of world politics? This dimension captures the critical political economy tradition, which holds that security and diplomacy cannot be understood without examining who controls capital and supply chains.",
  },
  {
    label: "Restraint vs. maximization",
    description:
      "Does your instinct run toward limiting commitments and avoiding overextension, or toward seizing windows for durable advantage? This disposition cuts across the main paradigm families. A restrained realist and a maximizing institutionalist can land at very different ends of this scale.",
  },
  {
    label: "Order vs. justice",
    description:
      "When international order and universal moral obligations conflict, which wins in your judgment? This captures the pluralism-solidarism debate in English School theory. Pluralists privilege sovereignty and non-intervention. Solidarists hold that sufficiently grave violations can override them.",
  },
]

const limitations = [
  {
    heading: "Not validated",
    body: "This instrument has not been tested for reliability or validity against established psychometric instruments or expert ratings. The family profiles and weights reflect theoretical judgment, not empirical calibration.",
  },
  {
    heading: "The paradigms are stylized",
    body: "The four family profiles are idealized for classification purposes. In practice, most scholars draw on multiple traditions depending on the issue. The runner-up in your results may be as revealing as the primary.",
  },
  {
    heading: "Branching logic is heuristic",
    body: "The scenario weights and branching rules were designed by hand to capture theoretically meaningful distinctions. They have not been validated against a large sample, and the weights have not been calibrated empirically.",
  },
  {
    heading: "Self-report limitations",
    body: "What you believe you think and what your actual instincts imply are not always the same. The scenario section is intended to surface that gap, but it cannot resolve it fully. People often hold different instincts across issue areas without experiencing them as contradictory.",
  },
  {
    heading: "Scores are relative, not absolute",
    body: "A score of 5.3 on institutional efficacy means you lean institutionalist relative to this model's scale. It does not mean 76% of the population agrees with you. The scores are not population percentiles.",
  },
  {
    heading: "Coverage is incomplete",
    body: "The instrument covers seven dimensions and five major scenario clusters. Important traditions — feminist IR, postcolonial theory, green IR — are not yet represented. Results should be read with that gap in mind.",
  },
]

export default function MethodPage() {
  return (
    <div className="container stack-lg">
      {/* Header */}
      <section className="panel stack-md">
        <p className="eyebrow">Methodology</p>
        <h1>How this inventory works</h1>
        <p className="muted" style={{ lineHeight: "1.7" }}>
            This page explains what the IR Worldview Inventory is, how it works, and what the results
          should and should not mean. A classification tool that does not explain itself is a black
          box.
        </p>
      </section>

      {/* What it is */}
      <section className="panel stack-md">
        <h2>What this is — and what it is not</h2>
        <p style={{ lineHeight: "1.7" }}>
          The IR Worldview Inventory is a <strong>prototype classification tool</strong>, not a
          validated psychometric instrument. It helps you see which traditions in International
          Relations most closely match your implicit assumptions. It does not diagnose your
          personality, measure intelligence, or assess expertise.
        </p>
        <p style={{ lineHeight: "1.7" }}>
          There are no right or wrong answers. High scores in any dimension are not better than low
          scores. The result is a prompt, not a verdict.
        </p>
        <div className="panel-flush stack-xs">
          <p style={{ fontWeight: 600 }}>In short</p>
          <ul style={{ margin: "8px 0 0", paddingLeft: "20px", lineHeight: "1.85", color: "var(--muted)" }}>
            <li>This is a prototype, not a finished or validated instrument.</li>
            <li>Results are comparative within this model, not population percentiles.</li>
            <li>No answer is more correct than any other.</li>
            <li>This tool does not measure knowledge, expertise, or moral standing.</li>
          </ul>
        </div>
      </section>

      {/* Who it's for */}
      <section className="panel stack-md">
        <h2>Who it is for</h2>
        <p style={{ lineHeight: "1.7" }}>
          The primary audience is people who think seriously about foreign policy, international
          order, or strategic affairs — practitioners, students, researchers, or engaged readers.
          Some background in IR theory helps, but the quiz is accessible without it. Jargon is
          defined where it appears.
        </p>
        <p style={{ lineHeight: "1.7" }}>
          It also works as a teaching tool. Taking it before and after reading core IR texts tends
          to surface assumptions that coursework alone leaves implicit — in particular, the gap
          between stated theoretical views and what scenario choices reveal.
        </p>
      </section>

      {/* Dimensions */}
      <section className="panel stack-md">
        <div className="stack-xs">
          <h2>The seven dimensions</h2>
          <p className="muted" style={{ lineHeight: "1.65" }}>
            Each question maps to one of seven dimensions drawn from the major traditions in IR
            theory. They were chosen to capture meaningful variation across the leading paradigms
            without collapsing everything into a single axis.
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

      {/* Why branching */}
      <section className="panel stack-md">
        <h2>Why branching scenarios are used</h2>
        <p style={{ lineHeight: "1.7" }}>
          The core questions are Likert-scale items. They ask you to rate your agreement with
          theoretical propositions. They are good at measuring your orientation on each dimension,
          but they can feel abstract.
        </p>
        <p style={{ lineHeight: "1.7" }}>
          The branching scenarios follow up with concrete policy situations — sanctions, trade
          restrictions, humanitarian intervention, financial crises. Your instincts in these cases
          often differ from your stated theoretical preferences. Many people hold realist instincts
          on strategic technology and institutionalist instincts on trade, even when they describe
          themselves as one thing throughout.
        </p>
        <p style={{ lineHeight: "1.7" }}>
          Branching means your path through the scenarios depends on earlier choices. If you
          restrict trade aggressively in the technology scenario, you see a follow-up about ally
          trade that a more open respondent will not. This probes the conditions under which your
          instincts shift, not just your baseline preference.
        </p>
      </section>

      {/* Why plain English */}
      <section className="panel stack-md">
        <h2>Why the wording is plain English</h2>
        <p style={{ lineHeight: "1.7" }}>
          The question prompts are written to be readable without prior IR training. Technical terms
          appear in the optional clarifications, not the main prompts.
        </p>
        <p style={{ lineHeight: "1.7" }}>
          A question that requires IR jargon produces different answers from specialists and
          non-specialists — not because their instincts differ, but because the question is asking
          each of them something different. Plain wording reduces that artifact.
        </p>
        <p style={{ lineHeight: "1.7" }}>
          Technical language is still available via the clarification disclosures. The aim is to
          make jargon optional, not invisible.
        </p>
      </section>

      {/* How scoring works */}
      <section className="panel stack-md">
        <h2>How scoring works</h2>
        <p style={{ lineHeight: "1.7" }}>Scoring happens in two stages.</p>
        <p style={{ lineHeight: "1.65" }}>
          <strong>Stage 1 — Core dimension scores.</strong> Each Likert question maps to one
          dimension. Some items are reverse-scored: high agreement lowers the relevant dimension
          score because the item contradicts that dimension&apos;s logic. Dimension scores are averaged
          within each group and run from 1 to 7.
        </p>
        <p style={{ lineHeight: "1.65" }}>
          <strong>Stage 2 — Scenario adjustments.</strong> Each scenario choice carries a small
          weight vector across the dimensions it is most relevant to. These weights are added to the
          core dimension scores and clamped to the 1–7 range. The effect is deliberately modest:
          scenarios sharpen the profile rather than overriding the core.
        </p>
        <p style={{ lineHeight: "1.7" }}>
          Once dimension scores are finalized, the model computes a similarity score between your
          dimension profile and four idealized family profiles — realist, institutionalist,
          constructivist, and critical political economist. The family with the highest score
          becomes your primary classification.
        </p>
        <p style={{ lineHeight: "1.7" }}>
          Two additional modifiers — strategy disposition and normative orientation — are computed
          separately from the restraint and order-justice dimensions plus specific scenario choices.
          These modify the label without changing the underlying family classification.
        </p>
        <div className="panel-flush">
          <p className="muted" style={{ lineHeight: "1.65", fontSize: "0.875rem" }}>
            <strong>Note on &ldquo;profile clarity&rdquo;:</strong> Earlier versions displayed a clarity
            percentage. This figure measured the gap between the top and second-place family
            scores — an internal heuristic, not a validated confidence metric. It has been removed
            to avoid implying a precision the model does not have.
          </p>
        </div>
      </section>

      {/* Limitations */}
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

      {/* Sources */}
      <section className="panel stack-md">
        <h2>Sources and references</h2>
        <p className="muted" style={{ lineHeight: "1.65" }}>
          The theoretical content draws on the primary texts of each tradition. The measurement
          design draws on the survey and political psychology literature below.
        </p>
        <div>
          {[
            {
              citation: "Likert, Rensis. \"A Technique for the Measurement of Attitudes.\" Archives of Psychology, no. 140 (1932).",
              note: "The original Likert summated-rating scale. The seven-point format used here is a standard extension of Likert's five-point design.",
            },
            {
              citation: "Converse, Philip E. \"The Nature of Belief Systems in Mass Publics.\" In D. E. Apter (ed.), Ideology and Discontent. Free Press, 1964.",
              note: "The foundational study of constraint in political belief systems. Raises the core question this inventory must answer honestly: do self-reported attitudes form coherent patterns?",
            },
            {
              citation: "Zaller, John R. The Nature and Origins of Mass Opinion. Cambridge University Press, 1992.",
              note: "Argues that survey responses capture a running sample of considerations, not stable fixed preferences. One reason this inventory describes results as interpretive rather than definitive.",
            },
            {
              citation: "Tetlock, Philip E. Expert Political Judgment: How Good Is It? How Can We Know? Princeton University Press, 2005.",
              note: "The finding that people who draw on multiple frameworks outperform single-paradigm thinkers is directly relevant to why the runner-up classification matters here.",
            },
            {
              citation: "Sil, Rudra and Katzenstein, Peter J. Beyond Paradigms: Analytic Eclecticism in the Study of World Politics. Palgrave Macmillan, 2010.",
              note: "The case for drawing on multiple IR traditions rather than committing to one. Frames the intellectual rationale for treating the runner-up as important, not a rounding error.",
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

      {/* Version history */}
      <section className="panel stack-md">
        <h2>Version history</h2>
        <div className="stack-md">
          <div className="stack-xs">
            <p style={{ fontWeight: 600 }}>v0.2 — March 2026</p>
            <p className="muted" style={{ lineHeight: "1.65" }}>
              Phase 1 redesign. Editorial light theme. Explicit Back / Next navigation — no more
              auto-advance. Rewrote results screen with plain-English summary, key drivers,
              tensions, dimension one-liners, neighbor overlap text, glossary, and suggested
              reading. Removed profile clarity display. Added this methods page. Nav updated from
              /learn to /method.
            </p>
          </div>
          <div className="stack-xs">
            <p style={{ fontWeight: 600 }}>v0.1 — Initial release</p>
            <p className="muted" style={{ lineHeight: "1.65" }}>
              Schema-driven MVP with 14 core Likert questions and five branching scenario clusters.
              Results showed dimension bars and family fit scores. Dark theme. Auto-advance on
              selection.
            </p>
          </div>
        </div>
      </section>
    </div>
  )
}
