# IR Worldview Astrolabe Design Authority

Status: binding for V23.6 presentation work
Applies to: IR Worldview Inventory only
Last reviewed: 2026-08-30

## 1. Scope and override

The product keeps its current **Astrolabe** identity: a dark navy editorial field, brass instrument details, restrained maps, and an explicit evidence layer.

This file sits below `AGENTS.md`, `PRODUCT.md`, and `CONSTITUTION`. It overrides the Constitution only where the shared studio defaults conflict with this product's established font, palette, tokens, or composition. It does not override trust, evidence, voice, accessibility, privacy, compatibility, or anti-slop rules.

The missing Claude Design artifact is not an authority. Static mockups may inform discussion only after their copy, data claims, and component behavior are checked against this repository.

## 2. Design intent

IR Worldview is an editorial interactive, not a dashboard and not a personality test. The interface should feel like a policy-journal feature built around a measuring instrument.

The visual hierarchy serves three layers:

1. **Reading:** the result, argument, question, or explanation comes first.
2. **Orientation:** labels, progress, section markers, and navigation show where the reader is.
3. **Evidence:** version labels, source records, status, and method remain available without competing with the first payoff.

Atmosphere is strongest at the homepage and map. Questionnaires, results, Profile, Method, and reference pages use the same identity with less spectacle.

## 3. Typography

V23.6 supersedes the V23.5 Newsreader, Archivo, and Space Mono decision. The
bundled fonts in `app/layout.tsx` are authoritative.

| Role | Typeface | Use |
| --- | --- | --- |
| Editorial voice | Spectral | Wordmark, active root destination, display headings, result headlines, long-form reading, important questions |
| Interface | Libre Franklin | Navigation, controls, body copy, labels, and short explanatory text |
| Evidence | System mono | Genuine sources, dates, version data, and codes after definition |

Simplified Chinese uses the declared system stacks in `app/globals.css`: Songti-style serif for editorial voice, PingFang or equivalent sans for interface text, and a compatible mono stack for evidence.

Rules:

- Spectral and Libre Franklin are bundled from the official Google Fonts
  releases under the SIL Open Font License 1.1. Their licence files remain
  beside the assets in `public/fonts/`.
- Do not introduce a typography package or an additional display family.
- Use no more than the three existing roles on one surface.
- A first-contact reader should not need an internal code to understand a heading.
- Body copy should stay readable at browser zoom and 400 percent reflow.
- Use balanced wrapping for short headings and natural wrapping for paragraphs.
- Do not use all caps for sentences. Reserve tracked uppercase for rare, short
  orientation labels. Reserve mono for evidence and version metadata, not
  ordinary navigation or editorial framing.
- Prefer hierarchy from scale, weight, and whitespace over repeated uniform
  hairlines.

## 4. Color

The current root tokens are the source of truth for V23.6.

```css
:root {
  --bg: #0a1322;
  --bg-2: #0e1a2e;
  --panel: #122139;
  --line: #22344f;
  --line-2: #304563;
  --text: #eef2f7;
  --text-2: #c7d2e0;
  --muted: #8295ab;
  --faint: #788ca3;
  --accent: #cea857;
  --accent-dim: #9a7d3e;
  --steel: #86abd2;
}
```

The four tradition accents may distinguish traditions in chips, rules, or tightly scoped diagrams:

- Realist: `#d98a5a`
- Institutionalist: `#7aa8d8`
- Constructivist: `#62c2a3`
- Critical Political Economy: `#c198d8`

Rules:

- Navy is the dominant field. Brass is the single recurring action and instrument accent.
- Tradition colors communicate a declared category. They are not decoration.
- Normal explanatory text must meet WCAG AA contrast of at least 4.5:1 against its actual surface.
- `--faint` is authorized for normal secondary prose on `--bg`, `--bg-2`, and `--panel`. Its measured contrast is 5.38:1, 5.04:1, and 4.67:1 respectively. Recheck it against any color-mixed or new surface before use.
- Color cannot be the only signal for status, selection, confidence, or category.
- Do not add a light theme in V23.6.
- Do not adopt an alternate navy and gold palette from a mockup.
- Raw colors already used by maps, share cards, or print are technical debt to inventory. Do not replace them mechanically without a visual comparison.

## 5. Space and composition

Use a small set of relationships rather than forcing every historical value onto a numeric gate.

Preferred spacing for new work:

| Relationship | Preferred range |
| --- | --- |
| Icon or label to adjacent text | 4 to 8px |
| Control internals | 8 to 12px |
| Related controls or paragraph groups | 12 to 18px |
| Component sections | 24 to 32px |
| Major page sections | 44 to 64px |

Rules:

- Maintain one dominant reading column on text-heavy pages.
- Use asymmetry when it clarifies priority. Do not fill space with matching cards.
- The V23.6 homepage is the approved exception: its single editorial menu has
  exactly five peer destinations, with one selected explanation and visual
  state at a time.
- Result pages show payoff before caveat.
- The Method page may use an anchored contents rail or index, but the reading order must remain coherent without it.
- Evidence ledgers follow the introduction and primary task in the document order.
- On mobile, remove ornamental spacing before shrinking readable type.
- Sticky chrome cannot conceal content or create a tall stacked questionnaire header.

## 6. Shape, borders, and elevation

- Editorial panels use square corners or radii from 0 to 5px.
- A pill radius is allowed only for compact chips, status tags, segmented controls, and circular controls whose shape carries meaning.
- Do not add 8 to 18px radii to ordinary content cards.
- Use 1px tokenized rules for structure.
- Accent borders have one semantic job: a reviewed editorial callout that changes how a nearby claim should be read. They are not generic card decoration.
- Avoid stacked bordered panels when headings and spacing can show the hierarchy.
- Shadows remain rare and low contrast. No elevated SaaS-card stacks or oversized glow.

Existing radius variation is debt, not precedent for new values. V23.6 may normalize a touched component when screenshots prove that the change preserves identity and meaning.

## 7. Controls and interaction

- All primary mobile targets are at least 44 by 44 CSS pixels.
- Answer selection never auto-advances.
- Back, Next, review, and exit remain visible or readily discoverable.
- Destructive reset requires confirmation when work exists.
- Focus Area mode switching preserves each mode's separate draft.
- Selected, focused, disabled, loading, and error states must be visually distinct.
- Keyboard focus must remain visible against navy, panel, and brass surfaces.
- Native controls and browser confirmation are preferred when they meet the behavior need.
- A disabled control should explain the blocking condition nearby.

## 8. Motion

Motion explains state or supports the homepage atmosphere. It does not decorate every interaction.

| Motion type | Timing |
| --- | --- |
| Direct control feedback | 120 to 220ms |
| Panel or section transition | 220 to 420ms |
| Map or narrative scene transition | 420 to 1100ms |

Use ease-out curves for direct feedback. Map motion may use the established longer Astrolabe timing. Avoid bounce, overshoot, parallax reading effects, and repeated entrance animation.

`prefers-reduced-motion` must disable ambient spin, nonessential transitions, and autoplay behavior. The still state must retain all information and controls.

## 9. Responsive and print rules

Every meaningful visual change is checked at 320, 390, 768, and 1440 CSS pixels.

- No horizontal overflow on a critical route.
- Locale and motion controls form one compact responsive group.
- The questionnaire header retains only identity, progress, and exit functions needed for the task.
- Focus Area questionnaires show one question unit at a time on mobile and desktop.
- Maps retain a semantic non-map alternative.
- The accessibility tree presents the introduction and primary choices before map details.
- Supported English and Chinese task chrome should perform the same task, while untranslated surfaces fail closed.
- Print output uses readable contrast, exposes essential source information, and removes controls or atmosphere that have no printed purpose.

## 10. Component patterns

### Result hero

- One clear result headline.
- One plain-language interpretation tied to the user's answers.
- Supporting family, posture, or domain information follows at lower hierarchy.
- No percentile, rarity, prevalence, confidence, or population language without an authorized real sample policy.

### Question unit

- Prompt and necessary scope first.
- Clarification collapsed by default.
- Options express distinct logics, not a bad extreme, respectable middle, and bad opposite.
- Selection is reversible.
- Navigation is separate from selection.

### Evidence and limitation block

- State one job: evidence, source, method, limitation, or correction.
- Use a heading that names that job.
- Use accent borders only when the note changes interpretation.
- Do not repeat the same invariant across neighboring panels.

### Card collection

- Use cards only when each item is independently actionable or comparable.
- Vary composition when items have different importance.
- Do not create a three-up marketing grid for editorial content.

## 11. Copy as interface

Every public block declares one job: payoff, mechanism, definition, instruction, limitation, evidence, or tradeoff.

- Delete no block automatically.
- Route a block for review if its job cannot be named or duplicates its neighbor.
- Prefer the reader or policy problem as the grammatical subject when that is the real focus.
- Render composed text before review.
- Ban em dashes in authored English prose. Exempt Chinese typography, quotations, proper names, and machine separators.
- Define internal codes such as `P+`, `Kairos`, and version tuples before using them as interface shorthand.

## 12. Banned patterns

- gradients introduced as a visual upgrade
- glass panels or blurred floating cards as the main composition
- neon accents
- oversized shadows or glows
- generic three-card feature rows
- repeated icon-title-paragraph tiles where prose or a list is clearer
- dashboard KPI treatment for interpretive results
- decorative charts that imply measured certainty
- huge numeric percentiles or rarity statements
- raw schema statuses presented as reader copy
- identical panel treatment for payoff, method, evidence, and limits
- animation that delays reading or hides state

## 13. Review evidence

Every visual PR attaches:

- before and after screenshots at the required viewports;
- a note on typography, hierarchy, spacing, and identity preservation;
- keyboard and reduced-motion observations;
- measured contrast for changed text tokens;
- bundle comparison when the route includes a map or new client behavior;
- print output when a printable route changed.

A screenshot is review evidence. It becomes regression coverage only when a deterministic assertion runs in CI.
