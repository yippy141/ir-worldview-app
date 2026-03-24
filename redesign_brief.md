# IR Worldview Inventory - Redesign Brief (Phase 1)

## Product goal
Transform the current MVP from a schema demo into an editorial, premium-feeling interactive experience that feels closer to a serious policy publication than a coding prototype.

## North star
The experience should feel like:
- A Foreign Affairs interactive for tone and reading comfort
- A McKinsey digital explainer for spacing, hierarchy, and polish
- A strategy product, not a personality-test gimmick

## Main problems in the current MVP
1. The visual system feels generic and developer-first rather than editorial.
2. The quiz auto-advances on click, which reduces deliberation and makes the flow feel flimsy.
3. The results screen shows labels and bars, but not the interpretation layer.
4. The methodology page explains files, not the actual method.
5. The terminology assumes prior IR knowledge.

## Phase 1 outcomes
1. Introduce a real design system
2. Add explicit navigation and review states
3. Rewrite the results page around "so what?"
4. Expand the methodology page into a transparent public methods page
5. Keep the schema/scoring architecture intact

## Design direction
### Tone
- Calm
- High-trust
- Editorial
- Serious, not gamified
- Subtle motion only

### Visual rules
- Light theme first
- Serif display font for headings
- Sans-serif body font
- Large white space
- Thin dividers
- Soft neutrals with one restrained accent color
- Avoid gradients, neon blues, glassmorphism, and dashboard-heavy aesthetics

### Recommended palette
- Background: off-white / warm gray
- Text: near-black / charcoal
- Secondary text: muted gray
- Accent: restrained dark green or navy
- Borders: light neutral gray

## UX changes
### Quiz flow
- Do not auto-advance on answer selection
- Selecting an answer should only select it
- Add:
  - Back
  - Next
  - Save and exit
  - Restart
- Show section name and question count
- Add an optional review screen before final submission

### Results page structure
1. Headline result
2. One-paragraph summary in plain English
3. "What most drove your result"
4. Dimension chart
5. Family comparison
6. Tensions / tradeoffs in your worldview
7. Blind spots and cautions
8. What could change your profile
9. Glossary for jargon
10. Suggested reading

### Methods page structure
1. What the quiz is and is not
2. Who it is for
3. Core dimensions
4. Why branching is used
5. How scoring works at a high level
6. Important limitations
7. Version history / changelog

## IA / routes
- /
- /quiz
- /results/[profile]
- /method
- /glossary
- /about

## Components to build first
- Site header
- Editorial hero
- Question card
- Likert scale row
- Scenario option cards
- Sticky navigation footer
- Dimension bar chart
- Family comparison chart
- Insight cards
- Glossary drawer / modal

## Technical constraints
- Keep Next.js App Router
- Keep schema-driven quiz logic
- Keep scoring isolated in lib/scoring.ts
- Introduce component primitives instead of styling everything in one CSS file

## Success criteria for Phase 1
- A first-time visitor can understand the purpose of the project in under 20 seconds
- A user can move backward and forward deliberately
- The result page explains meaning, not just scores
- A non-IR reader can understand core jargon without leaving the page
- The methods page feels publishable
