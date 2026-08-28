> **HISTORICAL, SUPERSEDED, NON-EXECUTABLE.** Preserved only for provenance. Verify every claim against the current roadmap, Git state, and runtime before reuse.

# The Anti-Slop System

> **HISTORICAL, SUPERSEDED, NON-EXECUTABLE.** Preserve for provenance. Its proposed quantitative gates are not current release blockers.

**Date:** 21 August 2026
**Problem stated by the owner:** AI-register writing and design keep returning after every manual sweep, despite a style guide, a copy audit script with roughly twenty banned-phrase rules and six structural checks, and `impeccable` installed.
**Claim of this document:** the sweeps fail for structural reasons, and there is a fix. It is not more rules.

---

## 1. Why the sweeps do not hold

Four mechanisms, in order of how much damage each does.

### 1.1 The blocklist is trained on the last sweep

Every phrase rule in `scripts/audit-public-copy.mjs` is a phrase a previous sweep found: `sits-between`, `pulls-clear`, `deeper-danger`, `stronger-path`, `what-matters-most`, `you-generally-believe`, `keeps-in-play`. Each was correct to add. None of them prevents the next one.

Ban "sits between" and the next generation produces "occupies the middle ground," "falls between," "straddles," "holds a position between." The supply of substitutes is effectively unlimited, and each costs you a sweep to discover. This is an arms race you lose by construction, and the loss rate does not improve with effort.

### 1.2 Slop is a property of information, not of vocabulary

Take the two examples from your own style guide:

> Bad: "State interests are constituted through social interaction rather than existing in a fixed, exogenous form."
> Better: "States do not walk into world politics with fixed interests; interaction helps shape what they want."

No banned phrase appears in the bad version. What makes it bad is measurable and it is not lexical:

- four nominalizations in one clause (`interests`, `interaction`, `form`, plus `constituted` doing nominal work)
- zero concrete anchors: no state, no date, no case
- the contrastive antithesis structure you already ban, in a form the regex misses
- it could be about anything

Your audit catches *repetition* of these properties. `repeated-sentence-opening`, `repeated-three-part-list`, `repeated-abstract-map-language` all fire when the same tell appears twice. They do not fire on a single well-formed empty sentence, and a page of well-formed empty sentences is exactly what slop is.

### 1.3 Every constraint is negative, so the generator has no target

The style guide has forty prohibitions and six positive examples. Ask any writer, human or model, to produce prose under forty prohibitions and no exemplars, and you get the safest available output. The safest available output is the blandest available output.

This is also why editing slop produces more slop. The edit operation is generation under the same negative constraints, so it regresses to the same register. You have felt this: you rewrite a sentence, it is technically better, and the page still reads wrong.

### 1.4 The editing loop is expensive, so you batch, and batching means fatigue

Copy lives in `lib/explore-content.ts` (73KB), `lib/archetype-content.ts` (48KB), `lib/result-helpers.ts` (54KB). Fixing one sentence means editing a TypeScript module and running the gate. That cost pushes you toward large batched sweeps. Large batched sweeps are done tired, and tired is when "fine" gets accepted.

The V-0 content extraction in the Codex pack fixes this one directly. It matters more than it looks.

**A note on `impeccable`:** it appears to be a product-spec and critique tool. `.impeccable/` holds a `product-schema` marker in `PRODUCT.md` and two critique files. It is not a prose linter and it is not going to catch this. Do not count it in this stack.

---

## 2. What slop is, stated so a machine can find it

Ten measures. Seven are regex or arithmetic. Three need a model. Together they catch far more than a phrase list, and they do not need updating after each sweep because they measure the property rather than its current vocabulary.

| # | Measure | Definition | Flag at | Why |
|---|---|---|---|---|
| M1 | Nominalization density | Words matching `/(tion\|sion\|ment\|ness\|ity\|ance\|ence\|ism\|[iy]zation\|[iy]sation)s?$/i` per sentence | 3+ in one sentence; 2+ in a sentence under 15 words | Your style guide already says three abstract nouns means rewrite. Nothing enforces it. |
| M2 | Concrete anchor floor | Per paragraph: proper nouns mid-sentence (minus a product stoplist), numerals, four-digit years, gazetteer hits | 0 anchors in case, result, or Current Case copy | A paragraph about world politics with no actor, place, date, or instrument is decoration. |
| M3 | Sentence-length variance | Coefficient of variation over sentence token counts in a block | CV below 0.35 | Editorial prose runs 0.45 to 0.65. Uniform rhythm is the most reliable machine tell. |
| M4 | Hedge density | Lexicon count per 100 words, plus per-sentence cap | 2+ in one sentence, or 6+ per 100 words | Your specific complaint. Currently unmeasured. |
| M5 | Three-item-list share | Share of all lists with exactly three items | Above 55% where a file has 4+ lists | The triad is the single most recognisable generated form. |
| M6 | Opening monotony | Share of sentences opening with determiner-plus-subject | Above 75% | Human paragraphs vary the entry point. Generated ones do not. |
| M7 | Cross-file n-gram repetition | Any 5-gram in 3+ distinct files | Any hit | Catches the template problem across the product, which the current per-file checks cannot see. |
| M8 | Punctuation tics | Em-dashes and parentheticals per 100 words | Above 1.0 | Your stated pet peeve, and a strong register tell. |
| M9 | Clause symmetry | Two clauses joined by comma or `and` with token counts within 15% and parallel opening part-of-speech | 2+ per paragraph | Symmetry that adds shape without adding information. Your contrastive-antithesis rule generalised. |
| M10 | Claim extraction | Model pass: for each paragraph, state its claim in one sentence, or return `NONE` | Any `NONE` in public copy | The one that catches word salad. See §4. |

M2 and M10 are the two that matter most. M10 is the one that solves the complaint you actually voiced, which is prose that says a lot without saying anything.

### 2.1 What these measures should not do

They should report, not block, except for M1 and M4 which are hard rules you already believe in. A paragraph can legitimately have no proper noun. A file can legitimately be triad-heavy. The value is a per-file score you can sort by, so a sweep starts at the worst page instead of page one.

Add a `copy:score` command that prints a table sorted by badness. That table is your sweep queue.

---

## 3. The style corpus

This is the highest-value item in this document and it is the one nobody builds.

### 3.1 Why it works

A model told only what to avoid produces the median of its training distribution. A model given six paragraphs you wrote, and told to match their rhythm and their appetite for making claims, produces something much closer to you. Exemplars do work that prohibitions cannot, because they carry information about what to aim at.

You want the product to sound like a person, and that person should be you. That is the whole logic of tying it to jhyip.com.

### 3.2 What to collect

Target 2,000 to 2,500 words, in 15 to 25 excerpts, each 60 to 150 words. Sources, in order of usefulness:

1. **SAIS seminar papers and your capstone.** The register is closest to what this product needs.
2. **Anything already on jhyip.com.**
3. **Application essays and cover letters.** You have written a lot of these recently and they are the most voice-forward thing you produce.
4. **Analytical emails and messages** where you explained something to a colleague and had a view.

**Do not use DGA-ASG client memos.** Client work is almost certainly confidential, and a public repo is the wrong place for it even in paraphrase. If a memo's structure is the thing you want to capture, rewrite the same analysis about a public case and use that.

### 3.3 Tag each excerpt by form

The prompt pulls exemplars matching the form being written. Seven forms cover this product:

| Tag | What it is | Where it gets used |
|---|---|---|
| `verdict` | A sentence that takes a position and does not soften it | Archetype glosses, result headlines |
| `mechanism` | Explaining how something actually works | Explore prose, methodology |
| `scene` | Establishing a situation with specific facts | Scenario setups, Current Cases |
| `tradeoff` | Naming what a choice costs | Option text, accepted-tradeoff lines |
| `limit` | A caveat that carries information instead of hedging | Methods notes, coverage gaps |
| `contest` | A claim an informed person would argue with | Authorial notes, archetype objections |
| `turn` | A sentence that pivots the argument | Transitions, "where this breaks" |

### 3.4 Where to keep it

Your repo is public. Your unpublished seminar papers going into it is a decision, not a default.

Two options:

- **`content/style/corpus/` in the repo**, if you are comfortable with the excerpts being public. Simplest, and the prompts can read it directly.
- **A gitignored `style-corpus/` directory**, with a committed `README` explaining what belongs there. The prompts reference it by path when run locally, and you paste it when working in chat.

Take the second unless you are certain about every excerpt. You can always promote it later.

### 3.5 The format

```markdown
---
tag: verdict
source: SAIS capstone, spring 2025
---
The sanctions regime did not fail because it was too weak. It failed because
the states enforcing it wanted three incompatible things from it at once, and
each of the three was defensible on its own terms.
```

That is the whole schema. One file per excerpt, or one file per tag with excerpts separated by rules. Do not over-engineer it.

### 3.6 The 45 minutes

Set a timer. Open your old papers, pull anything you still like, paste it in, tag it, move on. Do not edit the excerpts. The rough ones are useful, because polish is exactly the property you are trying not to teach.

If you can only find ten, ten is enough to start.

---

## 4. The claim-extraction pass

M10 deserves its own section because it is the only measure that catches word salad, and because it is the single best use of a cheap model in this whole project.

### 4.1 The pass

Run over every string of public copy longer than 25 words:

> For this paragraph, state in one sentence the claim it makes. A claim is something a well-informed person could disagree with. If the paragraph describes without asserting, hedges without committing, or restates its own opening, return exactly `NONE`.
>
> Return only the claim sentence or `NONE`. Do not explain. Do not improve the paragraph.

Output a CSV: file, key, first eight words, claim-or-NONE.

### 4.2 What to do with it

Every `NONE` is a candidate for deletion. Not a rewrite. Deletion.

That is the part that will feel wrong and is correct. A paragraph that makes no claim is not an underwritten paragraph. It is a paragraph that should not exist, and rewriting it usually produces a longer version of the same nothing.

Expect the first run to return `NONE` on 20 to 35% of your public prose. Expect that to be uncomfortable. Expect the product to be better at the end of it.

### 4.3 Why this is a cheap-model job

It is high volume, mechanically specified, and the output is trivially verifiable by spot-checking ten rows. At DeepSeek V4-Flash rates the whole corpus costs well under a dollar. Details in the workflow document.

---

## 5. Constraining generation, not just review

The audit runs after the copy exists. By then the register is set. Move the constraint upstream.

### 5.1 The copy generation contract

Paste this into any prompt that will produce public copy, in Codex, Claude Code, or chat.

> **Style contract for public copy.**
>
> **Exemplars.** Match the rhythm and the appetite for claims in these paragraphs. Do not copy their subject matter or their phrasing.
> [paste 3 to 5 corpus excerpts matching the form you are writing]
>
> **Hard constraints.**
> - No sentence contains three or more nominalizations. Two is the cap in any sentence under fifteen words.
> - No sentence contains more than one hedge. Hedges include: can, may, might, could, tends to, often, generally, somewhat, relatively, arguably, largely, broadly, typically, usually, in some cases, to some extent.
> - Vary sentence length deliberately. A paragraph where every sentence is fifteen to twenty-five words is a failed paragraph. Put a short one in.
> - Not every list is three items. Use two, use four, use a sentence instead.
> - No em-dashes. Use a full stop, a colon, or a comma.
> - No contrastive antithesis: no "X, not Y", "not just", "less about, more about", "rather than", "the point is not", "more than a".
> - In case, result, and Current Case copy, every paragraph names at least one actor, place, date, instrument, or number.
>
> **The contestability test.** Every paragraph must contain at least one sentence a well-informed reader could disagree with. If nothing in the paragraph is arguable, delete the paragraph. Do not lengthen it.
>
> **Before you return anything**, run the contestability test on your own output and report which paragraphs failed and what you did about them.

That last line does real work. Asking for self-review inside the same call catches a meaningful share of it before you ever see it.

### 5.2 The one-line version, for quick tasks

> Write it the way you would explain it to a colleague who is smart, busy, and will push back. Make a claim. Vary the sentence lengths. No em-dashes.

---

## 6. Design slop

Same problem, different surface. Same fix: decisions beat goals.

### 6.1 The principle

**An agent asked to improve something produces the median of its training distribution. An agent given a decision executes the decision.**

Compare:

> "Make the result hero look better."

against the line from your own Claude Design file:

> "Set the masthead at a fixed 72px rather than fitting to width. Concert at 82px and Dependencia at 72px are visibly different weights of statement, which the instrument should not imply."

The first produces slop with certainty. The second cannot, because there is nothing left to guess. Your design artifact is good precisely because it is full of decisions with reasons attached. That is the template for every design instruction you write.

### 6.2 Your design is currently not sloppy, and the risk is regression

The stack you have is deliberate and unusual. Newsreader, Archivo, and Space Mono is not a default pairing. Navy `#0F1B2D` with brass `#C9A227` on off-white `#F4F1EA` is a committed palette. The spacing scale of 7, 14, 18, 24, 28, 44, 64 is non-uniform, which means someone chose it rather than doubling from 8.

All three are exactly the kind of thing a coding agent will quietly normalise. It will reach for Inter. It will round the spacing to multiples of 8. It will add a border radius.

### 6.3 The tells, so you can name them in prompts

Design slop in 2026 looks like: Inter or the Google Fonts top ten; a uniform border radius applied everywhere; a strict 8px grid with no deliberate exception; equal-weight cards in an even grid; gradients, glass, or large soft shadows; centred everything; one accent colour used for every kind of emphasis; a stock icon set used decoratively; identical vertical spacing between every section; and full-width sections that all start and end at the same measure.

### 6.4 Enforce it with lint, not vigilance

Three rules, cheap to add, and they hold when you are not looking:

1. **No raw hex outside the token file.** Every colour is a `var(--token)`.
2. **No raw px outside the declared spacing scale**, except in a small allowlist for optical adjustments, each of which carries a comment saying why.
3. **No `border-radius` value outside the declared set.**

Add them in the V-0 token prompt. They cost an hour and they permanently remove a category of drift.

### 6.5 The design prompt block

Paste into any visual prompt:

> **Design constraints.**
> - Use only the declared tokens. No new colours, no new type sizes, no new spacing values. If you believe one is needed, stop and say so.
> - Do not add gradients, glass effects, large shadows, or decorative icons.
> - Do not normalise the spacing scale. It is 7, 14, 18, 24, 28, 44, 64 and it is deliberately not a doubling scale.
> - Do not substitute fonts. Newsreader, Archivo, Space Mono, with declared fallbacks.
> - Cards in a group are not required to be equal weight. Hierarchy is allowed.
> - Every visual decision you make that is not specified here must be reported with your reasoning, so it can be reversed.

---

## 7. The routine

What this looks like week to week, once it is set up.

**Continuously, in the editor.** Copy lives in `content/copy/` as JSON after V-0. Fixing a sentence is a two-second edit in a content file. Do it when you notice it, not in a sweep.

**On every commit, in CI.** `copy:audit:strict` blocks on P0 rules and on M1 and M4. Everything else reports.

**Weekly, five minutes.** Run `copy:score`. Look at the three worst files. Fix the top of each.

**Per subrelease, one hour.** Run the claim-extraction pass. Delete the `NONE` paragraphs. This replaces the manual sweep and it is faster and less painful, because you are deciding what to cut rather than what to rewrite.

**Per subrelease, ten minutes.** Add anything new you wrote and liked to the corpus. It compounds.

**Never again.** The line-by-line read of the whole product looking for bad sentences. That is what the score table and the claim pass are for.

---

## 8. The build prompt

Give this to Codex, or to a cheap model if you have one running by then. It is well-specified and testable, which makes it Tier B work.

> **Goal.** Extend `scripts/audit-public-copy.mjs` with ten statistical measures and a scoring command. Do not remove or weaken any existing rule.
>
> **Read first:** `scripts/audit-public-copy.mjs`, `IR_EDITORIAL_STYLE_GUIDE.md`, `package.json`, and the existing `structuralFindings` implementation, which you are extending rather than replacing.
>
> **Add these measures.** Each returns a per-block score and a list of offending locations.
>
> 1. `nominalization-density` — words matching `/(tion|sion|ment|ness|ity|ance|ence|ism|[iy]zation|[iy]sation)s?$/i` per sentence. **P0 at 3+ in one sentence.** P1 at 2+ in a sentence under 15 words. Exclude a stoplist of unavoidable domain terms: institution, government, information, condition, position, question, relationship, security.
> 2. `concrete-anchor-floor` — per paragraph, count capitalised words not at sentence start (minus a product stoplist of archetype names, module names, and product nouns), numerals, and four-digit years. P1 when a paragraph in case, result, or Current Case copy has zero.
> 3. `sentence-length-variance` — coefficient of variation over sentence token counts per block. P2 below 0.35. Skip blocks under four sentences.
> 4. `hedge-density` — **P0 at 2+ hedges in one sentence.** P1 above 6 per 100 words. Lexicon: can, may, might, could, tends to, often, generally, somewhat, relatively, arguably, largely, broadly, typically, usually, in some cases, to some extent, particularly, especially.
> 5. `triad-share` — share of lists with exactly three items. P2 above 55% where a file has four or more lists. Count both bullet groups and comma series of three.
> 6. `opening-monotony` — share of sentences opening with determiner-plus-subject. P2 above 75%. Skip blocks under six sentences.
> 7. `cross-file-ngram` — any 5-gram appearing in three or more distinct files. P1. Exclude proper nouns and product terms.
> 8. `punctuation-tics` — em-dashes and parentheticals per 100 words. P1 above 1.0.
> 9. `clause-symmetry` — two clauses joined by comma or `and`, token counts within 15%, same opening part of speech. P2 at 2+ per paragraph. Use a simple heuristic; do not add a parser dependency.
>
> **Add a command.**
>
> ```json
> "copy:score": "node scripts/audit-public-copy.mjs --score"
> ```
>
> It prints one row per file: path, audience, word count, each measure's value, and a composite badness score, sorted worst first. Write the same data to `artifacts/copy-score.csv`.
>
> **Add `--fixture` mode** that runs the measures over `tests/fixtures/copy-samples/`, so the thresholds can be tuned without touching production copy. Create that fixture directory with six samples: three you judge sloppy and three drawn from `IR_EDITORIAL_STYLE_GUIDE.md`'s "Better" examples. The measures must separate them.
>
> **Constraints.**
> - No new dependencies. No parser, no NLP library. Regex and arithmetic only.
> - Do not change any existing rule's id, priority, or pattern.
> - Do not modify any production copy in this task.
> - Every threshold is a named constant at the top of the file with a comment explaining the number.
>
> **Acceptance.** `copy:audit:strict` behaves identically on existing rules. `copy:score` produces a sorted table. The fixture set separates cleanly. Full gate green.
>
> **Return:** the score table for the current repo, the three worst files, and the gate table.
