# IR editorial style guide

Version 2, 13 September 2026. Sits under `CONSTITUTION` and `AGENTS.md`; overrides neither. Every model and every person writing public copy for this product reads this first. `npm run copy:audit` enforces the mechanical parts.

## The one test

Before a sentence ships, ask: **does it give the reader something, or does it describe the product?**

Something the reader can use: a question, a decision, a finding about their answers, a comparison, an action.
Describing the product: what a page is, what it is not, where data is stored, how the score was computed, what a label does not claim, which version produced it.

A sentence of the second kind is allowed only when the reader needs it to act safely at that moment (sharing, deleting, a result that cannot be shown). Otherwise it goes to Method, once.

## Four rules

### 1. Do not narrate the product

Never use these as the subject of a public sentence: record, read (as a noun), layer, inventory (as the name of a questionnaire), scorer, calibration, payload, tuple, matrix, form, version, evidence record. "Lens" is allowed only for the defined actor-lens question type. "Baseline" is allowed only inside Perspective Runs, where it is a defined term. "Posture" is allowed only as the Foundation strategic modifier.

Do not write section headings that are disclaimers: "What it does not claim", "What this page is", "Domain inventories remain separate records". Attach a necessary limit to the claim it qualifies, in one sentence.

Before: "Each result remains a separate domain record and leaves the Foundation unchanged."
After: "Each questionnaire gives its own result and leaves your Foundation result alone."

### 2. Compose to the content, not to a template

Do not reuse the kicker, serif heading, muted lead, three-column list, resource list pattern on every page. Each page type has its own shape:

| Page | Shape |
| --- | --- |
| Hub (a questionnaire's front door) | The question the questionnaire asks. What the reader will do and how long it takes. What they get at the end, with one labelled example. One start action. Secondary destinations as a short list, each with a reason to go there. |
| Result | The name and the mark. One paragraph that says something about this person's answers. Why this reading and not the nearest rival. What would change it. Then the reader's own choices. Limits in one sentence, with a link. |
| Reference (a tradition, a thinker, an approach) | The argument. The mechanism it proposes. Where it falls short. The source. |
| Case or exercise | The situation, the decision, the options, the cost of each. |
| Method, Privacy, About | Plain prose. Say it once. |

Numbered chapters, section symbols, and eyebrow labels are allowed only when the order carries meaning. Repeated control labels and standard navigation are desirable: avoid repeated empty explanations, not useful interface consistency.

### 3. Retired words and reflexes

These recur across the product and read as generated. The audit flags them.

- durable, sharpen, genuinely, meaningful, nuanced, robust, navigate the, landscape, journey, on its own terms, real weight, at stake (as a reflex)
- "not just X", "not X but Y", "X, not Y", "rather than" as a reflex, "the point is not"
- "The real / deeper / sharper / first / decisive / critical question is…" (inside answer options this tells the reader which option is the clever one)
- "This is not asking…" as a reflexive clarification
- "Accepted cost:" as a fixed label
- "sits beside", "keeps in play", "pulls clear", "what matters most"
- em dashes (hard rule from the Constitution)
- the same sentence opener on adjacent records ("The strongest objection is…" three times in a row)

Allowed once per page, when it is the precise word: tradeoff, tension, signal (as a verb about states, not about the product).

### 4. One name per thing

| Thing | Name, everywhere | Retired names |
| --- | --- | --- |
| The product | IR Worldview Inventory (until a brand decision) | the inventory (as a quiz name) |
| The fourteen-question questionnaire | Foundation | Inventory, Foundation read, the Foundation baseline |
| The AI questionnaire | AI Governance | AI Governance Compass, the Compass, AI Questionnaire |
| The two case questionnaires | Security, Technology | Focus Areas, issue reads, domain records, domain inventories, modules |
| `/modules` | Security and Technology | Focus Areas |
| `/profile` | Profile | My Profile |
| A saved result | result | record, read, layer, snapshot |
| `/explore` | Library | Explore, Atlas, field guide |
| `/explore/atlas` | Worldview Map | Atlas |
| `/ai/atlas` | AI approaches | AI Atlas, The six approaches (as navigation) |
| `/explore/reference` | Thinkers | Thinkers & public positions (until there are positions) |
| Perspective Runs | Perspective Runs | briefs, role runs |

## Sentence rules

1. **First read.** If a sentence needs a second read, split it.
2. **One idea per sentence.** Around twenty words. A full stop beats a semicolon.
3. **Concrete nouns and verbs.** Power, trade, leverage, trust, threat, rules, pressure, bargaining. Not "legitimacy architecture", "normative configuration", "strategic disposition".
4. **No filler.** fundamentally, increasingly, in many ways, in practice, broadly speaking, complex, dynamic, multifaceted, significant.
5. **No fake precision.** Not "this reveals your underlying worldview architecture". Say "your answers put power and timing first".
6. **Contrast only when both halves carry information.** State the claim. Put a real limit in its own sentence.
7. **A personalized sentence must follow the data.** "On X you leaned the other way" may appear only when a contribution row is negative. "The nearest rival stayed close" only when the differentiation flag says so. Never invent a preference, a tie, or a policy choice the data does not contain.
8. **Limits go where the reader needs them.** A share warning sits next to the share button. A result that cannot be shown says so in one sentence where it would have appeared. Explanations needed to read a figure may stay beside it. Everything general lives in Method. Reviewers’ notes correcting an earlier draft belong in the before/after file, not the public explanation.

## Question rules

- Twelve to twenty-four words. One claim.
- At most one technical term, defined in the clarification.
- A clarification adds scope or defines a term. It does not restate the stem as a question, and it does not hint which answer is sophisticated.
- Options are different logics, not different intensities. Never A (extreme), B (sensible middle), C (opposite extreme).
- Where a question has two parts (is this happening; what should we do), ask two questions.
- Administered wording, options, and clarifications change only through a copy version or a bank version. The audit still flags them; fix them in the versioned task.

## Result rules

Each result section answers one of: What did I put first? Where am I mixed? Why this reading and not that one? What would change it? What should I not read into this?

The first paragraph after the name says something true about this person's answers. It does not describe the model.

## Exemplars from this product

**Hub.** Before: "Add a focused issue read beside the Foundation. Use Security and Technology to examine concrete policy judgments." After: "Two shorter questionnaires built from cases. An ally asks for troops on its border. A ministry decides whether to fund public compute. You choose, and the result shows which logic you kept returning to."

**Result chapter.** Before: "This calculation uses the calibration registered for the exact completed form. It does not treat distance from the raw scale midpoint as classification evidence." Conditional example: "The strongest contribution to Institutionalism's lead came from your answers about institutions." This requires an actual largest positive contribution to the lead over the compared rival. It is a relative scoring statement, never a belief inferred from a label. Then a disclosure: "How this is calculated."

**Root menu.** Before: "Start with the Foundation when the site is new to you. It asks fourteen broad questions about recurring disputes in international politics." After: "Answer fourteen questions about international politics, then explore the arguments behind your result."

**A warning that stays, made plain.** Before: "The saved name is preserved. These rounded coordinates do not reproduce it as a leading model score; use the positions below as the supported reading." After: "This link stores rounded positions. Recomputed from them, Coordination Architect is no longer the top-scoring approach, so the name you were given is kept and the positions below are what the link contains." (The condition is whether the saved label still leads after rounding, not the scoring version.)

**An option, opener removed (versioned task).** Before: "The real question is whether domestic coalitions, public tolerance, and fiscal capacity can carry the strategy at all." After: "Whether domestic coalitions, public tolerance, and fiscal capacity can carry the strategy at all."

**A cost, label removed (versioned task).** Before: "Station a standing multinational unit under a joint command so an attack immediately implicates several allies. Accepted cost: This reduces crisis flexibility." After: "Station a standing multinational unit under joint command, so any attack immediately involves several allies. That buys deterrence at the price of flexibility: a local incident can pull in the whole alliance."

**Labels.** "Saved Foundation read" becomes "Your Foundation result". "Separate domain records" becomes "Your other results". "Complete the Security inventory to add a separate result here" becomes "Complete Security to add its result here".

## The owner's read

Ten minutes per page, before anyone else sees it. Read it on a phone.

1. In the first screen, do I know what this page is for and what to do?
2. Is there a sentence about the product itself that a reader did not need?
3. Is there a heading that is a disclaimer?
4. Does this page look like the last page I read?
5. Are there three things in a row with the same sentence shape?
6. Do I see a retired word?
7. If this is a result: does the first paragraph say something about my answers that I could not have guessed from the name?
8. Can I get back to the section this page belongs to in one click, without the browser Back button?
9. Is there a number, a name, or a claim here that I could not point to a source for?
10. Would I screenshot this?

If any answer is wrong, the page is not done.

## How to brief an implementer on prose

Use this for Codex, Opus, or any model. Paste the guide's path, then this:

```
Rewrite the public copy in these files only: [list]. Read IR_EDITORIAL_STYLE_GUIDE.md first and follow it.

Deliver:
1. The code changes.
2. One file, docs/review/after-passages-[task].md, containing every changed passage as before/after pairs, grouped by page, so the prose can be read together without the code.
3. The output of npm run copy:audit for the changed files, with the count before and after.

Rules that override anything else you infer:
- A personalized sentence appears only when the data it depends on is present. Name the field it depends on in a code comment.
- Do not add a disclaimer, a "what this does not claim" block, or a sentence about storage, versions, or calculation to any page. If a limit is necessary, one sentence next to the claim, or a link to Method.
- Do not reuse a heading, a three-column block, or a sentence shape from another page.
- Do not change administered questions, options, clarifications, scoring, or bank versions.
- Do not delete a component because its introduction is badly written. Rewrite the introduction.
- Update tests that assert the old wording. Do not weaken behavioral tests.
- Run the unit suite and lint before handing off.

Stop after the diff and the after-passages file. Do not write an audit, a coverage table, or a handoff memo.
```

The reviewer then reads only the after-passages file against "The owner's read". If a passage fails, send back the passage, not the task.

## Machine checks

`npm run copy:audit` reports every rule in this guide it can detect. `copy:audit:strict` runs in CI and fails on the P0 and P1 template rules. After the Sprint A rewrite lands, promote `product-self-narration`, `ranking-opener-in-option`, and `does-not-claim-heading` to strict so the patterns cannot return.

## Owner-approved copy

Preserve owner-approved paragraphs when adjusting layout or reviewing advisory audit counts. Do not regenerate them to satisfy a pattern quota. Explain any necessary semantic correction with the actual sentence and the evidence requiring it. Root/menu copy lives in `content/root.ts`; names and destinations live in `lib/navigation.ts` and `messages/{en,zh-Hans}.json`.
