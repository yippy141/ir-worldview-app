import Link from "next/link"
import type { Metadata } from "next"

export const metadata: Metadata = {
  title: "References — IR Worldview Inventory",
  description:
    "Selected bibliography for the IR Worldview Inventory — primary texts and foundational works by tradition.",
}

type RefEntry = {
  author: string
  title: string
  year: number
  publisher: string
  note: string
  // Stable source link: publisher catalog page, JSTOR stable URL, or DOI.
  // Only populated where a durable, publicly accessible link is known.
  url?: string
}

const realistRefs: RefEntry[] = [
  {
    author: "Thucydides",
    title: "History of the Peloponnesian War",
    year: -431,
    publisher: "Various translations. Recommended: Strassler ed., The Landmark Thucydides (Free Press, 1996).",
    note: "The original source for realist intuitions about fear, honor, and interest as drivers of conflict. The Melian Dialogue remains the clearest statement of power-over-principle logic.",
  },
  {
    author: "Morgenthau, Hans J.",
    title: "Politics Among Nations: The Struggle for Power and Peace",
    year: 1948,
    publisher: "Alfred A. Knopf. Sixth edition revised by Kenneth W. Thompson (McGraw-Hill, 1985).",
    note: "Classical realism's foundational text. Grounds the argument in a concept of the national interest defined in terms of power. Still the best statement of statecraft as a discipline.",
  },
  {
    author: "Waltz, Kenneth N.",
    title: "Theory of International Politics",
    year: 1979,
    publisher: "Addison-Wesley. Reissued by McGraw-Hill.",
    note: "The founding text of structural realism (neorealism). Shifts the causal argument from human nature to the architecture of the system — anarchy and the distribution of capabilities. Sets the terms for most subsequent theoretical debate.",
    url: "https://www.waveland.com/browse.php?t=144",
  },
  {
    author: "Waltz, Kenneth N.",
    title: "Man, the State and War",
    year: 1959,
    publisher: "Columbia University Press.",
    note: "Introduces the three-image framework for understanding the causes of war: human nature, the state, and the structure of the international system. Required background for understanding what structural realism is reacting against.",
  },
  {
    author: "Mearsheimer, John J.",
    title: "The Tragedy of Great Power Politics",
    year: 2001,
    publisher: "W. W. Norton. Updated edition 2014.",
    note: "The clearest statement of offensive realism. Argues that anarchy compels states to maximize power because there is no safe stopping point. China's rise, he argues, will not be peaceful.",
  },
  {
    author: "Jervis, Robert",
    title: "Perception and Misperception in International Politics",
    year: 1976,
    publisher: "Princeton University Press.",
    note: "The essential text on how cognitive biases and the security dilemma interact. Bridges classical realism and the psychology of strategic decision-making.",
  },
  {
    author: "Gilpin, Robert",
    title: "War and Change in World Politics",
    year: 1981,
    publisher: "Cambridge University Press.",
    note: "A structural account of how hegemonic transitions produce conflict. Relevant to contemporary US-China dynamics and to the question of whether power transitions are inherently destabilizing.",
  },
]

const institutionalistRefs: RefEntry[] = [
  {
    author: "Keohane, Robert O.",
    title: "After Hegemony: Cooperation and Discord in the World Political Economy",
    year: 1984,
    publisher: "Princeton University Press.",
    note: "The central text of liberal institutionalism. Argues that international regimes can sustain cooperation even after the dominant power that created them declines — against the realist expectation that order depends on hegemony.",
    url: "https://press.princeton.edu/books/paperback/9780691122489/after-hegemony",
  },
  {
    author: "Keohane, Robert O. and Nye, Joseph S.",
    title: "Power and Interdependence",
    year: 1977,
    publisher: "Little, Brown. Fourth edition, Longman, 2011.",
    note: "Introduces complex interdependence as an alternative to realist assumptions — multiple channels of contact, no hierarchy of issues, military force not always effective. A key bridge between realism and institutionalism.",
  },
  {
    author: "Putnam, Robert D.",
    title: "Diplomacy and Domestic Politics: The Logic of Two-Level Games",
    year: 1988,
    publisher: "International Organization, vol. 42, no. 3.",
    note: "Argues that international negotiations are simultaneously domestic political contests. Win-sets — the range of agreements that can survive ratification — shape what is achievable abroad. One of the most cited articles in IR.",
    url: "https://www.jstor.org/stable/2706785",
  },
  {
    author: "Ikenberry, G. John",
    title: "After Victory: Institutions, Strategic Restraint, and the Rebuilding of Order After Major Wars",
    year: 2001,
    publisher: "Princeton University Press.",
    note: "Explains why post-war hegemons sometimes bind themselves through institutions rather than simply imposing order. Relevant to debates about whether US-led liberal order is durable.",
  },
  {
    author: "Axelrod, Robert",
    title: "The Evolution of Cooperation",
    year: 1984,
    publisher: "Basic Books.",
    note: "Uses iterated prisoner's dilemma to show how cooperation can emerge among self-interested actors without central authority. The game-theoretic foundation for much institutionalist reasoning.",
  },
  {
    author: "Mearsheimer, John J.",
    title: "The False Promise of International Institutions",
    year: 1994,
    publisher: "International Security, vol. 19, no. 3.",
    note: "A sharp realist challenge to institutionalism. Argues that institutions reflect the interests of powerful states and cannot independently cause peace. Essential reading for understanding what institutionalism is up against.",
    url: "https://www.jstor.org/stable/2539078",
  },
]

const constructivistRefs: RefEntry[] = [
  {
    author: "Wendt, Alexander",
    title: "Anarchy Is What States Make of It: The Social Construction of Power Politics",
    year: 1992,
    publisher: "International Organization, vol. 46, no. 2.",
    note: "The article that established constructivism as a mainstream IR approach. Argues that anarchy has no single fixed logic — its consequences depend on the identities and relationships states construct. Directly challenges Waltz.",
    url: "https://www.jstor.org/stable/2706858",
  },
  {
    author: "Wendt, Alexander",
    title: "Social Theory of International Politics",
    year: 1999,
    publisher: "Cambridge University Press.",
    note: "The full theoretical treatment. Distinguishes three cultures of anarchy (Hobbesian, Lockean, Kantian) and argues that state identities are both constructed and capable of change through sustained interaction.",
    url: "https://www.cambridge.org/core/books/social-theory-of-international-politics/",
  },
  {
    author: "Katzenstein, Peter J. (ed.)",
    title: "The Culture of National Security: Norms and Identity in World Politics",
    year: 1996,
    publisher: "Columbia University Press.",
    note: "A landmark collection applying constructivist ideas to security policy empirically. Contributors examine how norms shaped German rearmament, Japanese security policy, and US nuclear doctrine.",
  },
  {
    author: "Finnemore, Martha and Sikkink, Kathryn",
    title: "International Norm Dynamics and Political Change",
    year: 1998,
    publisher: "International Organization, vol. 52, no. 4.",
    note: "Introduces the norm life cycle — emergence, cascade, internalization — and explains how norms spread and gain causal force. The most cited constructivist article on norm diffusion.",
    url: "https://www.jstor.org/stable/2601361",
  },
  {
    author: "Hopf, Ted",
    title: "The Promise of Constructivism in International Relations Theory",
    year: 1998,
    publisher: "International Security, vol. 23, no. 1.",
    note: "A clear critical overview distinguishing conventional and critical constructivism. Useful entry point for understanding the range of positions within the tradition.",
  },
  {
    author: "Mearsheimer, John J. and Walt, Stephen M.",
    title: "Leaving Theory Behind: Why Simplistic Hypothesis Testing Is Bad for International Relations",
    year: 2013,
    publisher: "European Journal of International Relations, vol. 19, no. 3.",
    note: "Not primarily a constructivism critique, but includes a sharp challenge to the empirical research program constructivism has produced. A useful counterpoint for evaluating constructivist claims.",
  },
]

const critPERefs: RefEntry[] = [
  {
    author: "Strange, Susan",
    title: "States and Markets",
    year: 1988,
    publisher: "Blackwell. Second edition, Pinter, 1994.",
    note: "Argues that structural power — control over production, finance, security, and knowledge — creates political authority independent of formal state power. The sharpest introduction to international political economy as a distinct field.",
  },
  {
    author: "Cox, Robert W.",
    title: "Social Forces, States and World Orders: Beyond International Relations Theory",
    year: 1981,
    publisher: "Millennium: Journal of International Studies, vol. 10, no. 2.",
    note: "The founding text of neo-Gramscian IPE. Argues that theory always serves someone's interests — that hegemony operates as much through ideas and institutions as through force. 'Problem-solving theory versus critical theory' is a central distinction.",
  },
  {
    author: "Gilpin, Robert",
    title: "The Political Economy of International Relations",
    year: 1987,
    publisher: "Princeton University Press.",
    note: "A comprehensive survey of the three main approaches to IPE — nationalism, liberalism, and Marxism — through major policy debates. Useful background for understanding where critical PE positions itself.",
  },
  {
    author: "Prebisch, Raúl",
    title: "The Economic Development of Latin America and Its Principal Problems",
    year: 1950,
    publisher: "United Nations Economic Commission for Latin America.",
    note: "The founding document of structuralist development economics and dependency theory. Argues that the terms of trade systematically favor industrialized core countries over commodity-exporting periphery countries.",
  },
  {
    author: "Cardoso, Fernando Henrique and Faletto, Enzo",
    title: "Dependency and Development in Latin America",
    year: 1979,
    publisher: "University of California Press. (Originally published in Spanish, 1969.)",
    note: "The most sophisticated dependency theory text — avoids mechanical determinism by examining how domestic class alliances mediate dependency relations. Influential in both IR and comparative politics.",
  },
  {
    author: "Helleiner, Eric",
    title: "States and the Reemergence of Global Finance: From Bretton Woods to the 1990s",
    year: 1994,
    publisher: "Cornell University Press.",
    note: "Shows that financial globalization was a political choice, not a natural outgrowth of markets. States actively created the conditions for global capital mobility. Essential for understanding structural financial power.",
  },
]

const methodsRefs: RefEntry[] = [
  {
    author: "Likert, Rensis",
    title: "A Technique for the Measurement of Attitudes",
    year: 1932,
    publisher: "Archives of Psychology, no. 140.",
    note: "The original description of the Likert summated-rating scale. The five-point format described here is the ancestor of the seven-point format used in this inventory.",
  },
  {
    author: "Converse, Philip E.",
    title: "The Nature of Belief Systems in Mass Publics",
    year: 1964,
    publisher: "In D. E. Apter (ed.), Ideology and Discontent. Free Press.",
    note: "The foundational text on constraint in political belief systems. Asks whether ordinary citizens hold coherent ideological positions — relevant to what self-report instruments like this one can and cannot measure.",
  },
  {
    author: "Zaller, John R.",
    title: "The Nature and Origins of Mass Opinion",
    year: 1992,
    publisher: "Cambridge University Press.",
    note: "Argues that survey responses capture a running sample of considerations, not stable underlying attitudes. One of the strongest challenges to the idea that self-report instruments measure fixed preferences.",
  },
  {
    author: "Tetlock, Philip E.",
    title: "Expert Political Judgment: How Good Is It? How Can We Know?",
    year: 2005,
    publisher: "Princeton University Press.",
    note: "A large-scale study of expert forecasting accuracy. The finding that fox-like analysts (who draw on many frameworks) outperform hedgehog-like ones (committed to a single theory) is directly relevant to how this inventory should be interpreted.",
  },
  {
    author: "Sil, Rudra and Katzenstein, Peter J.",
    title: "Beyond Paradigms: Analytic Eclecticism in the Study of World Politics",
    year: 2010,
    publisher: "Palgrave Macmillan.",
    note: "The case for drawing on multiple IR traditions rather than committing to one paradigm. Directly relevant to why this inventory treats the runner-up classification as important, not just the primary.",
  },
]

function RefSection({ id, title, entries }: { id: string; title: string; entries: RefEntry[] }) {
  return (
    <section id={id} className="article-section stack-md">
      <h2>{title}</h2>
      <div>
        {entries.map((ref) => (
          <div key={`${ref.author}-${ref.title}`} className="ref-entry">
            <p className="ref-citation">
              {ref.author}.{" "}
              <em>{ref.title}</em>.{" "}
              {ref.year > 0 ? ref.year : `${Math.abs(ref.year)} BCE`}.
            </p>
            <p className="muted" style={{ fontSize: "0.85rem", marginTop: "3px" }}>
              {ref.publisher}
            </p>
            <p style={{ fontSize: "0.875rem", lineHeight: "1.6", marginTop: "8px" }}>
              {ref.note}
            </p>
            {ref.url && (
              <p style={{ fontSize: "0.8rem", marginTop: "6px" }}>
                <a
                  href={ref.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  style={{ color: "var(--accent)" }}
                >
                  View source →
                </a>
              </p>
            )}
          </div>
        ))}
      </div>
    </section>
  )
}

export default function ReferencesPage() {
  return (
    <div className="wide-container">
      <div className="article-header stack-sm">
        <p className="eyebrow">Selected bibliography</p>
        <h1>References</h1>
        <p className="muted" style={{ lineHeight: "1.7", fontSize: "1.05rem", maxWidth: "560px" }}>
          Canonical texts organized by tradition. These are the works the inventory draws on most
          directly. Each entry includes a short note on why it is relevant to this tool.
        </p>
        <p className="muted" style={{ fontSize: "0.875rem", lineHeight: "1.65", maxWidth: "560px" }}>
          This is not an exhaustive literature review. The goal is to give readers a clear path into
          each tradition. For deeper coverage of each family, see the{" "}
          <Link href="/explore" style={{ color: "var(--accent)" }}>Explore</Link> section.
        </p>
      </div>

      <nav className="ref-toc" aria-label="Jump to section">
        {[
          ["#realism", "Realism"],
          ["#institutionalism", "Institutionalism"],
          ["#constructivism", "Constructivism"],
          ["#critical-pe", "Critical political economy"],
          ["#methods", "Methods and design"],
        ].map(([href, label]) => (
          <a key={href} href={href} className="ref-toc-link">
            {label}
          </a>
        ))}
      </nav>

      <hr className="divider" />

      <RefSection id="realism" title="Realism" entries={realistRefs} />

      <hr className="divider" />

      <RefSection id="institutionalism" title="Institutionalism" entries={institutionalistRefs} />

      <hr className="divider" />

      <RefSection id="constructivism" title="Constructivism" entries={constructivistRefs} />

      <hr className="divider" />

      <RefSection id="critical-pe" title="Critical political economy" entries={critPERefs} />

      <hr className="divider" />

      <RefSection id="methods" title="Methods and design" entries={methodsRefs} />

      <hr className="divider" />

      <div className="article-section">
        <Link href="/explore" className="cta-secondary">← Explore the traditions</Link>
      </div>
    </div>
  )
}
