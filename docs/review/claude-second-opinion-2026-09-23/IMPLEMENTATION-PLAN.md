# Implementation plan and prompts

Written 23 September 2026 against `fix/pilot-trust-storage` at `a3e8d39`, whose parent is PR 64 (`b49365f`, current `origin/main`). Two pieces are already built and tested here: the corrected PR1 and the copy ratchet. The rest are prompts for Codex or Claude Code, in the order I would run them.

## 0. Git hygiene first (you, ten minutes)

PR1 went wrong because Codex branched from your local `main`, which carries an unpushed "Sprint A pass 1" commit (`dc1e95f`) on an older base, about three weeks and sixteen PRs behind `origin/main`. Its new end-to-end test was written for a quiz screen that no longer exists, and it never updated the older spec that tests the component it deleted. Run this once so no agent can do that again:

```
git status                                # commit or stash anything uncommitted first
git fetch origin
git branch sprint-a-pass-1 dc1e95f        # keep the unpushed work
git switch main
git reset --hard origin/main              # local main now equals the remote
git worktree add ../irw-ratchet -b copy-ratchet origin/main
```

Every prompt below starts with the same three lines. Paste them verbatim:

```
Before anything else: git fetch origin; confirm HEAD's parent is origin/main (git log --oneline -3); if it is not, stop and say so.
Work only in this worktree. Never branch from local main.
Before handing off, run: npm run lint, npm run test, npx tsc --noEmit, npm run copy:ratchet, and the e2e specs named in the task. Paste the pass/fail lines.
```

## 1. PR-A: pilot trust, corrected (built, ready to review)

These files sit in your repo at `docs/review/claude-second-opinion-2026-09-23/`, untracked. Apply PR-A on `fix/pilot-trust-storage`:

```
R=docs/review/claude-second-opinion-2026-09-23
git switch fix/pilot-trust-storage
git apply --index $R/patches/pr-a-pilot-trust.patch
git commit -m "Pilot trust: say when a result is saved, identify shared views"
```

What it does, in plain terms:

- A person who finishes the Foundation now sees "Saved to your Profile on this device." If the browser blocks storage they see "This browser blocked saving. Copy the link to keep this result." Codex's version removed every confirmation, so a real completer got silence.
- Share buttons now add `?via=share` to the link. The server renders "You are looking at someone else's result. Take the Foundation to see where you land." before the result, so there is no flash and no reliance on JavaScript. If the owner opens their own share link on the same device, the notice hides itself.
- A result opened without that marker (a bookmark, or a link copied from the address bar) shows a softer notice, but only when this browser's Profile has no copy of it.
- For recipients the retake button reads "Take the Foundation" and the native share text reads "An IR worldview result: …" instead of "My IR worldview result".
- The duplicate "Copy share link" button on the Foundation result is removed. There were two identical ones.
- `lib/result-history.ts` is deleted (no production callers after Codex's change). `e2e/history-copy-provenance.spec.ts` is deleted because it tested the removed comparison UI; its one surviving guarantee (legacy history is never rewritten) is covered in `pilot-trust.spec.ts`.
- Codex's "genuine completion" test is fixed. It never clicked "Start Foundation", so it failed on the real branch.
- Three older specs that encoded the old behaviour are updated: the share URL now ends in `?via=share`, and opening a link must leave legacy history untouched instead of adding to it.

How it was verified: typecheck and lint clean; the unit suite fails the same tests by name before and after, all of them reading `docs/` and `artifacts/` files I did not copy into the test machine; production build passes; on the full Playwright suite Codex's branch fails six tests and the corrected branch fails none (two screenshot tests excluded on both sides for lack of reference images). Details in `VERIFICATION.md`.

Two things to do on your machine: run the two Chinese screenshot tests in `e2e/i18n.spec.ts` once with `--update-snapshots`, because fresh-browser Chinese result pages now carry the notice, and eyeball `/results/<payload>?via=share` on a phone.

## 2. PR-B: copy ratchet and voice (built, ready to review)

Apply in the `copy-ratchet` worktree (the patch lives in the main checkout), then generate the baseline on that tree:

```
cd ../irw-ratchet
git apply --index ../ir-worldview-app-clean/docs/review/claude-second-opinion-2026-09-23/patches/pr-b-copy-ratchet.patch
npm ci
npm run copy:ratchet:update          # writes scripts/copy-baseline.json
git add scripts/copy-baseline.json
git commit -m "Copy ratchet: public copy may only get better"
```

What it adds: `scripts/copy-voice-rules.mjs` (seven structural rules the phrase list could not see), `scripts/copy-ratchet.mjs`, `docs/voice/VOICE.md`, a Writing section in `AGENTS.md`, a corrected paragraph in the style guide, a CI step, and ten unit tests. How the ratchet works is in the report. The short version: counts per file may only fall, and any string someone edits must pass the high-precision rules, so pages get cleaner exactly when they are touched.

## 3. PR-C: a result for level answers (one day)

```
Task: give the Foundation a real result for level answers instead of a tie-break hero.

Today the all-midpoint answer set, and 823,542 other answer patterns, give an all-4 profile. The four-way family tie is resolved by enumeration order to Realism and Institutionalism, the page names the hero "Kairos–Grotian", prints a contribution table of +0.000 rows, and says "the two finished close".

1. Add a tested predicate in lib/results (for example isLevelFoundationProfile) that is true when no family leads the third-placed family by more than the calibration's lowDifferentiationThreshold. Unit-test: the all-4 vector is level; tests/fixtures/profile-store-v5.json's Foundation is not; a two-way close result is not level (it keeps today's "close" treatment).
2. When level, in both app/results/[payload]/page.tsx and app/[locale]/results/[payload]/page.tsx: no archetype name, mark, code, or matrix highlight. Heading "No clear lean yet" (zh: 暂时没有明显倾向). Body from EXEMPLARS.md section 4. Primary action: the full extended set, since targeted items need two named families. Hide the contribution table when every term rounds to 0.000.
3. Social card and share text for a level result say "No clear lean yet", never an archetype.
4. e2e/critical-smoke.spec.ts answers every Likert item with the midpoint, so it produces exactly this case. Update it to expect the new heading, and add a second walk that answers 1 and 7 alternately so the archetype path is still covered.
5. In the PR description, report how many of these synthetic answer sets are level: all-midpoint, all-agree, all-disagree, and 1,000 uniform random sets from tests/decision-exercises/fixtures.
Do not change scoring, coefficients, or payload format.
```

## 4. PR-D: stop rendering the audit schema (two days)

The copy has the shape of the data model, and several fields are named for an auditor: `measures`, `doesNotClaim`, `whatItAsks`, `evidenceThatWouldWeakenFit`, `qualification`, `technicalDescriptor`. Components render them straight to readers, so the pages inherit the spec's voice. Rewriting sentences inside those fields cannot fix that.

```
Task: stop rendering internal and audit-shaped fields to readers. Read docs/voice/VOICE.md and EXEMPLARS.md sections 5, 6, 7 and 11.

1. components/modules/module-app.tsx: replace the "Scope, lanes, and how to read the cases" panel with a two-sentence introduction per module stored in content (EXEMPLARS.md section 7). Keep measures and doesNotClaim in the module definitions for Method and tests; stop rendering them in the intro.
2. content/archetypes.json identity.gloss: rewrite all eight in the third person ("Kairos puts power and timing first…"). The result page may add its own second-person line.
3. Every site listed by `npm run copy:audit -- --format=json | jq '.findings[] | select(.rule=="internal-label-render")'` renders the public name only: traditionNounLabel instead of FAMILY_LABELS or familyLabel, and publicName without technicalDescriptor.
4. The result page's "What this model can and cannot say" section becomes "How far to trust this" with the text in EXEMPLARS.md section 11.
5. The Chinese result page's version line (结构版本 3 · 评分版本 1 · 中文文案版本 1) moves into the existing details disclosure.
6. The archetype route disclosure is an owner-contracted string in scripts/public-copy-contracts.mjs. Do not change it; list it in the PR description for the owner to decide.
Acceptance: copy:ratchet shows audit-voice, catalogue-second-person and internal-label-render at zero in public copy outside the contracted string. Update the baseline. After-passages file as the style guide describes.
```

## 5. PR-E: one surface per PR, under the ratchet (one day each)

Order by where people spend time: result page, quiz screens (not scored wording), archetypes, Library, Method, Security and Technology, Futures, Decisions. Use the brief at the end of `docs/voice/VOICE.md` with the file list for one surface and the matching EXEMPLARS.md sections.

Your part is ten minutes per surface: read only the after-passages file. When you rewrite a passage yourself, paste your version into EXEMPLARS.md before the next surface starts. That is the feedback loop that replaces editing every page: your edits become the model's examples.

Kill criterion: if after the first two surfaces you are still rewriting more than a third of the passages, stop the sequence and spend an hour adding your rewrites and the reasons to VOICE.md and the voice skill. Then resume.

## 6. PR-F: Perspective Runs stability (half a day)

Take ChatGPT's N02 as written. `lib/perspectives/scoring.ts` forces at least one "stable" dimension even when none qualifies. Allow an empty set, separate "not covered by these scenarios" from "held steady", and say when a displayed change was clipped at 1 or 7.

## 7. PR-G: journey and layout (two to three days)

```
Task: make each screen do one job. Keep the landing page and menu as they are, except item 4.

1. Quiz (/quiz): before Start, show only the title, one sentence, the question count and time, and Start. Today the first question, progress bar, "Context assist off", "Start over" and "View your position so far" all render under the intro. After Start, show the statement, the scale, Back/Next and progress; put Context assist and position-so-far into one Options menu; show Start over only after at least one answer.
2. Foundation result, three layers. First screen on a 390px phone: name and mark (or "No clear lean yet"), the three-sentence reading, the nearest alternative line, Share, and the saved note. Second layer, "Why this reading": the comparison rows as one visual, one sentence on what did the work, the decimal table in a disclosure. Third layer, "Test it": the case, the other questionnaires, the Library. Reading code, the matrix, and "What this model covers" go into one "How this works" disclosure linking to Method.
3. Do not render "Your other results on this device" for a shared view, or when nothing is saved. Today a recipient sees three "Checking this device for a saved record" placeholders.
4. Menu: add one line for first-time visitors ("New here? Start with the Foundation") and remove the duplicate Library link.
5. Pass sharedView from the page into FoundationResultStory and switch the hero and section openers from "your answers" to "these answers" when true.
Acceptance: screenshots at 390px and 1280px for owner, recipient and level results; the first-screen check in item 2 holds without scrolling.
```

## 8. PR-H: dependencies (half a day)

I ran `npm audit` on the branch today. Full tree: 15 advisories (1 critical, 11 high, 2 moderate, 1 low). Production only: 5 (1 critical, 3 high, 1 moderate). The critical one is Next.js 16.2.11, with two remote-code-execution advisories fixed in 16.3.3; `npm audit` offers 16.3.6, a minor bump that also clears the `sharp`, `postcss` and `nanoid` highs. The app does not import `next/image`, but I did not verify whether the default image endpoint is reachable in your Vercel setup, so upgrade rather than argue applicability.

```
Task: upgrade next to 16.3.6 and eslint-config-next to match; run the full CI locally including all three Playwright configs. Then run npm audit fix without --force for the dev tree. The remaining highs come from the impeccable dev dependency (puppeteer, extract-zip); find where impeccable is used, and if it is not in CI or a script you run, remove it. Report before/after npm audit counts for the full and --omit=dev trees.
```

## 9. Later, with the pilot

Bank v3: the item and explainer rewrites in EXEMPLARS.md sections 1 and 2, the Agree if / Disagree if / Term schema, a new instrument version, and recalibration. The instrument options are in the report; my recommendation is to ship the report-your-answers display now and trial bipolar items against the current form with a small pilot before committing.

Brand: rename after you choose a name. The mechanical part is small: "IR Worldview" appears 91 times in 62 files under app, components, lib, content, messages and i18n; the Chinese brand string is `messages/zh-Hans.json` → `brand`; the social card is `app/api/card/route.tsx`; share text is in `components/results/share-actions.tsx` and three `ResultCardHeroShare` call sites; plus README, TRADEMARK.md and metadata titles. The brief for Claude Design is in `BRAND-BRIEF.md`.
