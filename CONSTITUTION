# CONSTITUTION

The single source of truth for how everything I build looks, sounds, and behaves.

This file governs every repository, every page, and every AI agent that touches my work. If anything else disagrees with this file, this file wins. When you start a coding or design session, read this first.

How it is wired into a repo: `CLAUDE.md` points to `AGENTS.md`, and `AGENTS.md` points to this file. So every agent that opens a repo is told to read this before doing anything.

Last updated: 2026-05-31

---

## 1. Who this is for and what it represents

Jinhua Yip builds source-backed intelligence products about frontier technology and great-power competition.

The recurring form is the **atlas**: a public, source-traceable map of a hard domain. China's AI stack. Semiconductor tooling. Rare-earth capability. Commercial space. AI safety and governance. Each atlas is built so a newcomer can learn the domain and a specialist can still find something they had not been tracking.

The standard for every product is one line: **confident presentation, humble architecture.** State findings clearly. Show the evidence and its limits honestly. Never blur a claim with a guess.

Background, in case an agent needs the register: trained at SAIS in the intersection of emerging technology, governance, security, and climate. Currently in political risk. Moving toward AI safety, governance, and alignment. Lives in the DC area, grew up across Shanghai, Beijing, and Hong Kong.

The work is not decorative. It is not a SaaS landing page, a personality quiz, or a developer toy. The reader is a think-tank analyst, an AI governance hire, a journalist, or a curious professional. Earn their trust with rigor, not spectacle.

---

## 2. Voice and tone

Write the way a sharp analyst writes a brief, not the way a chatbot writes a summary.

Rules, in priority order:

1. **No em dashes.** Use a period, a comma, a colon, or rewrite the sentence. This is a hard rule.
2. **No AI filler.** Ban these words and their cousins: "genuinely", "honestly", "actually", "delve", "navigate the landscape", "in today's fast-paced world", "it's worth noting", "robust", "leverage" as a verb when "use" works, "seamless", "game-changing", "unlock", "empower".
3. **No hype adjectives.** "Comprehensive", "cutting-edge", "powerful", "stunning" earn nothing. Show the thing instead of praising it.
4. **Limit parentheses.** If a thought needs a parenthesis, it usually wants its own sentence.
5. **Make claims, then source them.** A paragraph that asserts nothing checkable is filler. Every public claim should trace to a source record.
6. **State uncertainty plainly.** "Confidence: medium. Official PRC sourcing is thin on the early sequencing." That sentence builds more trust than a confident overstatement.
7. **Short sentences carry weight.** Vary length, but default to clear and direct.
8. **First person is fine** on the personal site. The atlases speak in a neutral analytical voice.

When in doubt, cut. The most common failure is writing too much, too warmly, with too little said.

---

## 3. Design system

### 3.1 The one idea behind the look

The aesthetic is an **editorial intelligence instrument**: part think-tank dossier, part maritime archive, part precision research terminal. Two registers sit on top of each other and never blur:

- A **reading room**: warm archival paper, an editorial serif, calm and legible. This is where analysis lives.
- **Deep water**: an oceanic near-black, used for the homepage front door and dark mode. This is where atmosphere and personality live.

The typography encodes the north star directly. A serif voice carries the analysis, that is the confident presentation. A mono layer carries the evidence, source IDs, coordinates, confidence ratings, that is the humble architecture. When you see mono type on the page, it means the machinery is being shown honestly.

This is a refined, minimal direction. Elegance comes from spacing, hairline rules, and restraint, not from effects. Save motion and spectacle for the homepage only.

### 3.2 Typography

Three typefaces, all free on Google Fonts, none of them an AI default.

| Role | Typeface | Used for |
|---|---|---|
| Voice (display + long-form body) | **Newsreader** | Headlines, article body, project descriptions. An editorial serif designed for screen reading. Use its optical sizing. |
| Chrome (UI) | **IBM Plex Sans** | Navigation, labels, buttons, metadata, captions. Technical and humanist. |
| Evidence (data + machinery) | **IBM Plex Mono** | Source IDs, confidence ratings, coordinates, status tags, code, dates, anything from the evidence layer. |

Loading them in Next.js, drop this near the root layout:

```ts
import { Newsreader, IBM_Plex_Sans, IBM_Plex_Mono } from "next/font/google";

export const fontSerif = Newsreader({
  subsets: ["latin"],
  variable: "--font-serif",
  display: "swap",
});

export const fontSans = IBM_Plex_Sans({
  subsets: ["latin"],
  weight: ["400", "500", "600"],
  variable: "--font-sans",
  display: "swap",
});

export const fontMono = IBM_Plex_Mono({
  subsets: ["latin"],
  weight: ["400", "500"],
  variable: "--font-mono",
  display: "swap",
});
```

Approved swaps if you ever want a different feel, change in one place only: voice serif to **Spectral** or **Source Serif 4**; chrome sans to **Hanken Grotesk**; evidence mono to **JetBrains Mono**. If the serif body ever feels too heavy for a long article, body text may move to IBM Plex Sans while headlines stay serif. Do not introduce a fourth family.

Type scale, editorial and calm:

- Body: 18px, line height 1.65. Long reading should feel unhurried.
- Small print and metadata: 14px mono or sans.
- Headings step up by roughly 1.25x each level. The homepage hero may go large, up to 6 to 8x body. Inner pages stay restrained.

### 3.3 Color tokens

These hex values are the source of truth. An agent wires them into Tailwind and CSS variables per the installed Tailwind version. Do not invent colors outside this set.

```css
:root {
  /* Reading room (light, default for content pages) */
  --paper:      #F4F0E6; /* warm archival ivory, never pure white */
  --paper-2:    #ECE7D9; /* slightly deeper panel / card surface */
  --ink:        #1E1A16; /* warm near-black, never pure #000 */
  --ink-2:      #5A5249; /* muted secondary text */
  --rule:       #D8D1BE; /* hairline borders and dividers */

  /* Signature accent: oxblood. Primary actions, links, the one sharp accent. */
  --oxblood:      #7E2B22;
  --oxblood-soft: #A6463B; /* hover / lighter state */

  /* Depth accent: oceanic teal. Sparing use, mostly the front door. */
  --tide: #356B66;
  --sonar: #4FB3BF; /* rare highlight on dark only */

  /* Evidence semantics: calm, not traffic lights */
  --confidence-high:   #2F5D4A; /* deep green-slate */
  --confidence-medium: #9A6B27; /* ochre */
  --confidence-low:    #6B6258; /* warm gray */
}

[data-theme="dark"] {
  /* Deep water (homepage front door + dark mode) */
  --paper:   #07100F; /* abyssal blue-green-black */
  --paper-2: #0C1A17; /* panel on dark */
  --ink:     #EDEFEA; /* off-white, slightly cool */
  --ink-2:   #9DB0A8; /* muted sea-gray */
  --rule:    #1C2B27;

  --oxblood:      #C2685C; /* lightened so it reads on dark */
  --oxblood-soft: #D88476;
}
```

Color discipline: one dominant surface, ink for text, oxblood as the single sharp accent, teal only as a rare oceanic note. Do not distribute many colors evenly. Per-project accent colors exist in the data file for the homepage nodes only, they do not leak into the reading room.

### 3.4 Shape, space, motion

- **Radius:** 4px maximum on most elements. This is editorial, not bubbly. No large rounded SaaS cards.
- **Borders:** 1px hairlines in `--rule`. Lean on rules and spacing for structure, not on boxes and shadows.
- **Shadows:** almost none in the reading room. Depth in deep water comes from gradient and fog, not drop shadows.
- **Motion principles:** slow, tidal, intentional. Ambient motion runs 400 to 900ms. UI feedback runs 150 to 250ms. Easing leans to ease-out, for example `cubic-bezier(0.22, 1, 0.36, 1)`. No bounce or spring on the reading room. Springiness is allowed only on the homepage, and only lightly. Always respect `prefers-reduced-motion` and provide a still fallback.

---

## 4. The evidence contract

This is the methodological spine. Every atlas obeys it. It is also the credibility moat: it is what separates this work from a pile of dashboards.

**Rule zero:** every public claim traces to a source record. No orphan facts.

**Rule one:** never present mock or placeholder data as real. Mock is always visibly labeled and styled differently (see status tags below).

**Source record fields**, attached to claims and entities:

```txt
source_name
title
url
publisher
published_at
retrieved_at
evidence_class
confidence
last_verified
locator          (page, sheet, table, row, cell range, or timestamp)
uncertainty_note
```

**Evidence classes**, strongest to weakest:

```txt
official              official report, order book, filing, primary document
press_release         company or government announcement
filing                investor or regulatory filing
regulator             regulator or standards body source
media_context         reputable media used for context, not as primary proof
third_party_dataset   licensed or external dataset, rights permitting
manual_estimate       your own estimate, always labeled
mock                  placeholder, never shown as real
```

**Confidence:** `high`, `medium`, `low`. Define it in plain words next to the claim when it matters. High means multiple strong primary sources agree. Medium means the direction is clear but sourcing is thin or partly secondary. Low means a single weak source or an inference.

**Claim status**, generalized across domains:

```txt
confirmed   confirmed by a primary source
reported    announced or reported, not yet confirmed in primary records
projected   forward-looking, plan, target, or forecast
mock        placeholder, visibly labeled
```

The aircraft project's firm / option / MOU / LOI vocabulary is a domain-specific refinement of `reported` and `confirmed`. Keep that nuance inside that atlas, but the four statuses above are the shared baseline.

---

## 5. Shared component contract

These primitives look and behave identically across every atlas. Build them once in the shared kit, reuse everywhere. Consistency here is what makes six projects feel like one body of work.

- **SourceDrawer.** A slide-in panel that lists the source records behind a claim or entity. Mono type. Shows evidence class, confidence, publisher, date, locator, and a link out.
- **SourceCite.** A small inline marker on a claim that opens the SourceDrawer. Subtle, not a loud footnote.
- **ConfidenceBadge.** A small mono tag reading high, medium, or low, colored with the confidence tokens. Calm, never a red alarm.
- **StatusTag.** Shows claim status: confirmed, reported, projected, or mock. Mock uses a dashed border and muted fill so it can never be mistaken for real.
- **EntityChip.** A clickable label for a concept-graph node (for example "compute" or "rare earths"). Clicking it surfaces every project and claim that touches that entity. This chip is the connective tissue between projects.
- **MethodologyLink.** Every atlas links back to the shared methodology page that explains this contract to readers.

---

## 6. Banned: the tell-tale AI look

If a design includes any of the following, it is wrong, regardless of which tool produced it. This list exists so that AI design output, including Claude Design, gets pulled toward this system instead of its own defaults.

**Banned fonts:** Inter, Roboto, Arial, Geist (the Vercel default), Space Grotesk, Poppins, Montserrat, and "system-ui" as a deliberate brand choice.

**Banned color moves:** purple, indigo, or violet gradients on white. Neon anything. Glassmorphism, the frosted-blur translucent card. Pure black `#000000` or pure white `#FFFFFF`. Traffic-light red/yellow/green for confidence.

**Banned layout and component patterns:** centered hero with a gradient-filled headline. Oversized pill buttons. The three-up row of big rounded "feature cards" with an icon on top. Emoji used as interface icons. A generic "trusted by" logo strip. Bouncy spring animation on serious content. The glowing animated gradient border on a card. Auto-playing carousels.

**The shape of the right answer instead:** warm paper or deep water surfaces, hairline rules, an editorial serif doing the talking, mono type marking the evidence, one oxblood accent, generous space, and motion reserved for the front door.

---

## 7. How to use AI tools under this constitution

The tools serve this file, not the other way around.

- **Any coding agent** (Claude Code, Codex): read this file at the start of every session. Use the tokens, the fonts, the voice rules. Obey the evidence contract. Make the smallest coherent change. End with review notes and a commit message.
- **Claude Design or any visual tool:** paste sections 3 and 6 into it before you ask for anything. Treat its first output as a rough sketch. Reject any result that reaches for a banned font, color, or pattern. Re-prompt it with the exact tokens until it conforms. Never ship its defaults.
- **The loop:** one agent builds, one agent critiques. Small branches. Preview deploy. Review in the browser. Commit. The rhythm matters more than which model.

The fastest way to lose the unique look is to let a tool decide the look. This file is how you keep the decision.
