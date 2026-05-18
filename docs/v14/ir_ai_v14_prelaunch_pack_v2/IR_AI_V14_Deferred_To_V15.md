# V14 deferred to V15

These items were identified in the V14 red team and pack review. They are intentionally out of scope for V14 but should not be forgotten.

## V14.1 (immediately after V14 pilot feedback)

### Dynamic per-result OG images
Clone the browser result card layout into `opengraph-image.tsx` routes using Next.js `ImageResponse`. The OG card should render at 1200x630 with the tradition/archetype color accent, label, modifiers, and one-sentence summary. Font support in the JSX-to-PNG pipeline is limited (no CSS variables, limited font loading), so this needs its own design pass separate from the browser card.

### Result copy tightening
Run Claude Prompt 5 (result copy payoff pass) after pilot feedback confirms which phrases feel generic or AI-generated. Better to tighten copy with real user reactions than to guess.

## V15

### Document magic-number coefficients
Every magic number in the scoring files needs a one-line comment explaining the editorial reasoning:
- `SECOND_CHOICE_WEIGHT = 0.45` in `lib/scoring.ts`, `lib/modules/framework.ts`, `lib/ai-governance-scoring.ts`
- Critical-systemic-signal weights `0.55/0.25/0.35/0.15` in `lib/scoring.ts`
- CPE guard thresholds `1.8` and `0.75` in `lib/scoring.ts`
- Modifier cutoffs `5.15` and `3.85` in `lib/scoring.ts`
- Family profile reference vectors in `familyProfiles`
- Overlay-delta coefficients in `lib/modules/security.ts` and `lib/modules/technology.ts`

Format: `// Editorial choice: X because [reason]. No calibration data.`

### Break up quiz-app.tsx
Decompose the 800+ line component into:
- `components/quiz/mode-gate.tsx`
- `components/quiz/likert-card.tsx`
- `components/quiz/tradeoff-card.tsx`
- `components/quiz/quiz-navigation.tsx`
- Parent `QuizApp` becomes a thin orchestrator.

### Extract inline styles to CSS classes
Audit results, profile, and explore pages for repeated inline `style` props. Replace with utility or component classes. Target: zero inline `style` props on pages that ship to users.

### Signed share payloads
Add HMAC signature or checksum to share payloads to prevent URL manipulation. Requires a server route because client-side signing cannot protect a secret. See Codex Prompt 4B audit output in `plans/V14_SHARE_PAYLOAD_SECURITY.md`.

### Debate prompts replacing reading lists
Instead of "Read Waltz 1979," surface a debate: "Your realist instincts say the US-China competition is structurally driven. A constructivist would push back: maybe the rivalry is partly a product of threat narratives. Here is a text that makes that case." Creates engagement, not homework.

### "What would change your mind?" section
For each family result, generate 2-3 empirical scenarios that would pressure-test the user's worldview. Turns the result from a label into a living question.

### Comparison table on result page
Four-column table showing how the user's result compares to other traditions on the quiz's issue areas.

## V16+

### Class/group codes
Group organizer creates a code. Participants enter it after completing the quiz. Group page shows anonymous distribution. No individual results exposed. High-value for classroom adoption, but requires server-side persistence, privacy controls, and group management UI.

### Side-by-side comparison visual diff
Expand the compare page with visual dimension-bar overlays and a text summary: "You agree on X. You diverge on Y."

### Institutional features
Instructor dashboards, cohort analytics, exportable results, class comparison tools. Only relevant if the classroom adoption path is validated.

### Additional AI governance scenarios
The AI governance quiz has only Likert items. Adding scenario-based items (comparable to the Foundation's tradeoff and mini-case cards) would improve construct validity. Requires new question design and scoring work.

### Global South / non-Western perspectives
Both the IR Foundation and the AI Governance Compass currently reflect predominantly Western academic and policy discourse. Adding Chinese, Indian, African, and other governance perspectives requires new dimensions or question-bank items, not just content additions.
