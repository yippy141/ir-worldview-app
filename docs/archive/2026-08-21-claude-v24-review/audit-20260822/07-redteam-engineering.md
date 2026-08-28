> **HISTORICAL, SUPERSEDED, NON-EXECUTABLE.** Preserved only for provenance. Verify every claim against the current roadmap, Git state, and runtime before reuse.

# Hostile review: V24 five-day sprint

> **HISTORICAL AND SUPERSEDED AS EXECUTION AUTHORITY.** Preserve findings for provenance. Do not dispatch the reviewed sprint.

## Verdict up front

This plan does not ship. Not because the work is wrong — most of it is right — but because it is sequenced so that the only genuinely required change is buried behind two days of the highest-risk work in the pack, split across surfaces so that stopping early leaves it half-done, and guarded by an abort rule that **names the wrong prompt**.

**The framing fact nobody in this document set is confronting:** your own `V24_PRODUCT_EVALUATION_MULTI_PERSPECTIVE` §11 scopes V23.5 — content extraction, token unification, percentile removal, sigil animation, hero, scroll structure, Explore rebuild, homepage — at **"4–6 weeks."** The sprint pack takes that same list, adds share cards and card consolidation, and packages it as **five days, part time, one person.** That is a 15–30× compression against your own estimate, written by the same author, in the same week, and neither document mentions the other's number. Every problem below is downstream of that.

---

## 1. Is the seven-prompt sprint achievable? No. — **FATAL**

### The arithmetic you have not done

Nobody has timed the gate. It is ten commands including `rm -rf .next`, a cold Next.js 16 build, **two** full typechecks, and a complete Playwright suite in CI mode. On a repo with a 227KB stylesheet and ~300KB of TS content modules, that is realistically 12–25 minutes wall clock. It will not pass first time. Budget 3–6 cycles per prompt at the stop point.

Per prompt: agent run 30–90 min + gate cycles 45–150 min + human review of a 1,000–8,000 line diff. Seven prompts. Part time at ~4h/day is **20 hours available against 60–100 hours of work.**

And that ignores the deliverables. Checkpoint A wants a contact sheet of 8 marks × 6 sizes × 4 contexts = **192 renders**. V-2 wants screenshots at 4 breakpoints × 4 payload types. V-3 wants "a video or frame sequence." V-6 wants cards at 3 font configurations × 2 result types. **No prompt specifies a screenshot harness, and none exists in the plan.** Building it is an unscoped hour minimum, and it is a hard requirement of three checkpoints.

### The off-by-one that will cost you the sprint — **FATAL**

The brief §10 says: *"If it runs out before step 3, the sprint failed, because step 3 is where the percentile defect gets closed."* Brief step 3 = **V-2**.

The pack says: *"Stopping before V-3 is a failed sprint, because V-3 is where the percentile defect closes."*

**V-3 is scrollytelling. It contains no percentile work.** The pack's own day table says *"V-2 … carries the percentile fix."* The abort rule was transcribed from a 1-indexed list into a 0-indexed one and is wrong at both ends: it tells you the good outcome is one prompt earlier than the brief does, and it tells you to burn a day on the riskiest UI in the pack believing it is the thing that closes the defect. Checkpoint B — *"the checkpoint that matters"* — is also placed one prompt late, so the percentile audit happens after you have already spent the day.

Compound this with *"Do not merge anything until Checkpoint C"* and the plan's default behaviour on running out of credit is: **merge nothing, ship nothing, percentiles still live.**

**Fix:** renumber the abort rule. Percentile work closes at **V-2**. Checkpoint B moves to **after V-2**. And delete "do not merge until Checkpoint C" — merge each green prompt.

### Realistic day-by-day forecast

**Day 1 — planned V-0 + V-1. Actual: V-0 Part 1 only, unfinished.**
Extraction of 175KB across three modules produces a 4,000–8,000 line diff. Then `copy:audit:strict` fails — because V-0 instructs you to *extend the auditor's scan roots to the new files*, which means the auditor now sees editorial prose it has never scanned before and flags pre-existing violations. You are deadlocked: V-0 forbids changing any string, and the gate now demands it. Byte-identity is unverifiable (see §2). Tree dirty, nothing merged, V-1 never starts.

**Day 2 — planned V-2. Actual: salvage V-0, start V-1.**
Tokens land. The contrast audit misroutes some sites (§2). V-1 immediately hits its internal contradiction: Part 1 says *"do not change any existing `d` value"* and *"existing serialization tests must pass unchanged"*; Part 3 says *"adjust one or both marks"* to separate Kairos and Concert. Best case the agent stops and asks — an hour of your attention. Worst case it edits geometry and breaks the serialization snapshot, and you spend three hours deciding whether the snapshot or the mark is canonical.

**Day 3 — planned V-3. Actual: V-1 finishes badly.**
Mask-reveal animation for the three fill-based marks half-works. The fresh-result-only gate is unresolved because it is a server/client problem nobody decided (§3g). Checkpoint A demands 192 renders; you skip the contact sheet or you spend two hours building the harness. Either way Checkpoint A does not actually approve anything, and the pack says an unresolved collision blocks V-2 — **the must-ship prompt is gated behind a subjective design approval on the critical path.**

**Day 4 — V-2, the only thing that had to happen.**
Percentiles come out of the hero. They remain in the dimension tables below it, because V-2 Part 4 explicitly says everything below the hero stays and *"V-3 handles what happens below."* The hero does not fit 390px, because the honest replacement copy is longer than the dishonest copy it replaces (§4). Gate green on a half-honest page.

**Day 5 — V-4 through V-6 do not happen.**
You choose between finishing the percentile removal below the fold and rebuilding the share card. You do neither. Credit expires. **The share card still says "6% of respondents share this reading"** — on the single surface seen by the most people, including everyone who never clicks.

**Modal outcome: five days of credit spent, nothing merged, a 10,000-line unreviewed branch, and the reputational defect still live on the highest-visibility surface.**

**Which prompt blows up:** V-0 blows up *first* and poisons everything downstream. V-3 blows up *worst*. Cut both (§2, §3d).

---

## 2. V-0: one task or three? It is five. — **FATAL as written**

1. Content extraction (mechanical, high-volume, byte-fidelity)
2. A build-time loader and validator — **a new architecture decision**, not mechanical: RSC JSON import? codegen? a build step?
3. Token migration across a 227KB stylesheet with Tailwind v4 present
4. A per-site contrast audit requiring rendering to judge
5. A 227KB CSS audit document

**They have opposite acceptance criteria in the same prompt.** *"Acceptance. Zero perceptible visual change"* and *"fix every light-ground brass text use"* cannot both hold. Routing brass from `#C9A227` to `#7A5F26` **is** a perceptible visual change — that is the point of it. A reviewer taking the acceptance criterion literally must reject the required work.

### What specifically breaks on "byte-identical"

- **"Byte-identical output" of what?** Source strings or rendered HTML? Nobody has a harness that captures rendered HTML across routes to diff. **The acceptance criterion is unverifiable as written**, which means the agent will assert it and you will believe it.
- **Template literals.** `result-helpers.ts` is 54KB and named *helpers* — it composes strings conditionally. `` `${dim} sits ${band}` `` has no JSON representation without inventing an interpolation syntax. That is a judgment call, in a prompt that claims to be mechanical.
- **Typographic bytes.** Curly quotes, em dashes, ellipses, NBSP, thin spaces. JSON round-trip + Prettier will normalise or re-escape some of them. `\u00a0` vs a literal NBSP is a byte difference nobody will see in review.
- **Types collapse.** JSON imports widen to `string`. Any consumer relying on a literal union derived from the content (`keyof typeof EXPLORE_CONTENT`) breaks typecheck, and the fix is either codegen or hand-written assertions — architecture, mid-"mechanical" task.
- **Bundle regression.** A single default-exported JSON object is not tree-shaken the way per-export TS constants are. If any of the 300KB reaches a client component, it ships to the browser. On a performance-motivated redesign.
- **`content/copy/en/` is a locale-structure change.** The universal contract forbids touching *"published Chinese content, or the fail-closed locale behaviour."* Introducing an `en/` directory and a locale-keyed loader is exactly that boundary.
- **The auditor scan-root extension** (above) is a guaranteed day-one deadlock.

### Fix — the scope cut

**Cut Part 1 entirely from this sprint.** The claimed dependency is asserted, not real: V-2 through V-6 rewrite components, they do not edit prose. "Layout prompts then touch layout only" is a next-quarter benefit bought with the highest-risk day of a five-day window.

**Keep Part 2, reduced:** define the tokens, replace the two retired literals `#0a1322` and `#cea857`. Mechanical, greppable, verifiable.

**Split Part 4 into its own prompt** with per-site before/after screenshots. And note the trap: `#7A5F26` on `#0F1B2D` is **~3.0:1** — worse than what you have, on the *default* build. A static pass over a 227KB cascade cannot determine what ground a rule paints on. Misrouting is a regression to the primary theme introduced by an accessibility fix. **SERIOUS.**

**Drop Part 3.** A "how much is dead" number derived from static analysis of a 227KB stylesheet will be confidently wrong, and someone will act on it. Dead-CSS requires coverage instrumentation across routes, viewports, and states. This is next week's cheap-tier task, not sprint-week work.

**The Tailwind v4 trap nobody mentioned — SERIOUS.** Tailwind v4 emits into `@layer theme, base, components, utilities`. **Unlayered CSS beats layered CSS in the cascade regardless of specificity.** Your 227KB of unlayered legacy CSS silently overrides every Tailwind utility the new components use. You will spend hours on "why isn't this class applying." Fix: one line — wrap the legacy sheet in `@layer legacy` — and verify before V-2 starts, not during it.

---

## 3. IntersectionObserver + `position: sticky`, no dependencies

The no-dependency call is correct. The implementation problems are all unaddressed.

**a) Sticky inside overflow containers — SERIOUS, and it is the one that will actually bite.**
`position: sticky` silently does nothing if any ancestor has `overflow` other than `visible`. `overflow-x: hidden` computes `overflow-y` to `auto` and creates a scroll container. **Your brief demands "390px with no horizontal overflow" — and `overflow-x: hidden` on a layout wrapper is the universal fix for that.** In a 227KB legacy stylesheet, it is near-certain one already exists. So the plan's own accessibility requirement is the most likely cause of its centerpiece interaction failing, and the failure is invisible in code review because the offending rule is three levels up in a file nobody opened. `transform`, `filter`, `contain: paint`, and `backdrop-filter` on an ancestor cause related clipping bugs.
**Fix:** day 0, run a computed-style ancestor walk on the result route and report every non-`visible` overflow. Ten minutes. Do it before V-3 is written, not during it.

**b) Sticky in a flex/grid parent — MINOR but costs an hour.** A sticky child of a flex container with `align-items: stretch` fills the container and has nowhere to move. The "graphic pinned, prose beside it" layout is exactly this shape. Needs `align-self: start`.

**c) iOS Safari — SERIOUS.**
- The collapsing toolbar changes the visual viewport during scroll. `100dvh` resizes mid-scroll, so a sticky element jitters. Your hero is specified as *"fold at 844px mobile"* — that is the iPhone height with chrome **expanded**; the fold moves under the user as they scroll. A hero designed to fit exactly one viewport will overflow or gap depending on toolbar state, and it is not a bug you can fix, only design around.
- Safari has a long-standing failure to repaint sticky elements whose contents change during scroll — you get a stale paint until a nudge. **Your entire register two is "the pinned graphic changes state as you scroll."** That is precisely the bug shape. The workaround (`translateZ(0)`) creates a containing block and a compositor layer, with its own side effects.
- IO callbacks coalesce at the end of a momentum fling, so a step activates one step late after a fast flick.
- **Playwright's WebKit is not iOS Safari.** None of this reproduces in your gate. The plan has no real-device check anywhere.

**d) The 390px pinning case — SERIOUS, and worse than the brief admits.**
The brief specifies mobile Plate-A for the *hero* and then says **nothing** about what register two does at 390px. V-3's acceptance only requires "no horizontal overflow." **There is no mobile design for the centerpiece interaction of the release.** At 390px there is no "beside" — a pinned graphic consuming the top half of the viewport while prose scrolls beneath it is a hostile pattern, and it interacts badly with the toolbar collapse in (c). Given that V-6 exists specifically to drive social traffic, and social traffic is majority mobile, the flagship interaction is undesigned for the majority case.
**Fix, and it is free:** decide now, in writing, that **register two does not pin below 768px.** Below that it renders as the JS-disabled section stack, which the plan already requires you to build and which is already complete and correct. One sentence, decided by a human before V-3 runs, removes an entire class of failure.

**e) CLS — SERIOUS, and unmeasurable as specified.**
Sources the plan misses: the fixed-72px Newsreader archetype name is a webfont headline explicitly *"never fitted to width"* — on `font-display: swap` it reflows on font load and pushes the rule and everything under it. That is your largest element and probably your LCP. You need metric-matched fallbacks (`size-adjust`, `ascent-override`) or `font-display: optional`. The position map SVG needs an explicit aspect-ratio box. And the rule *"no IO callback may write layout-affecting styles — class toggles only"* is unenforceable: a class toggle can absolutely change layout.
**The real problem: "no layout shift after first paint" is a gate item with no instrument.** So is "no animation loops in production." So are all eight accessibility bullets. An agent will report them green because there is nothing that can report them red.
**Fix:** one Playwright test with a `PerformanceObserver` on `layout-shift` and a hard threshold. Otherwise delete the requirement — an unmeasurable gate is worse than no gate, because it manufactures false confidence.

**f) App Router streaming and hydration — SERIOUS.**
- Observers created in `useEffect` attach after hydration. Browsers restore scroll position on reload. On attach, the observer fires for everything currently on screen and slams several steps into final state simultaneously, or into the wrong one. You need an explicit "on attach, compute state from current scroll position and apply without transition" step. Not mentioned anywhere.
- Suspense boundaries mean content below the fold arrives after first paint. Observers created before targets exist never fire; ratios computed against a document that then grows are wrong.
- **V-4's "highlight the reader's tradition if a Foundation result exists in localStorage" is a textbook hydration mismatch.** Server has no localStorage. React 19 recovers by re-rendering the subtree client-side — a flash and a layout shift, on the page whose gate forbids layout shift. Fix must be stated: render neutral on the server, reserve the space, apply after mount.
- Soft navigations via `next/link` must tear down and rebuild observers. A leaked IO across route changes is the standard bug.

**g) "Fires on first paint of a freshly generated result only" — SERIOUS, and unsolvable as stated.**
`/results/[payload]` is a URL. A reload of that URL is server-side indistinguishable from the first visit. So freshness is a client-only fact, which forces you to choose between: render drawn then swap to undrawn and animate (a visible flash of the finished mark — the exact opposite of *"the resting state is the finished state"*), or render undrawn server-side and animate on mount (violating *"unstarted paints drawn"* for anyone with slow hydration or JS off). The brief calls this *"the rule most likely to be violated by a well-meaning implementation"* without noticing it is the rule that is hardest to implement correctly.
**Fix:** make freshness a server-visible signal — the generation navigation adds `?new=1`, stripped after mount. The server then deliberately renders the undrawn state for exactly that one navigation. Decide this before V-1 runs, or the agent will invent something worse.

**h) `animation-timeline: view()` as an "enhancement" — MINOR. Cut it.** Two systems driving the same custom property means a `@supports` guard that disables the IO path, which means writing the state machine twice and keeping them identical. Doubles the surface for zero user-visible gain.

**i) 4.2 seconds — MINOR, product point.** A 4.2s draw-on lands at the single moment of peak impatience: the user has just finished the instrument and wants the answer. Nobody questioned the duration. Try 1.8s.

---

## 4. Is the percentile removal clean? No — **FATAL as scoped**

It is described as a display change riding along with a hero rebuild. It is a cross-cutting change across at least seven surfaces:

**1. The result page below the hero.** V-2 Part 4 says every section below the hero stays and *"V-3 handles what happens below."* Register three contains *"dimension tables"* — which render percentiles. So V-2's acceptance (*"No ordinal percentile in any new render"*) contradicts V-2 Part 4 **inside the same prompt.** Either V-2 also rewrites the tables — in which case it is a two-day prompt, not a one-day one — or the page ships with percentiles removed from the hero and intact 800px lower. Which is arguably worse than not touching it, because it looks like you tried.

**2. The share card — the highest-visibility surface, scheduled last and marked "most droppable."** The rarity line survives every realistic early stop. **Your abort ordering ships the honest result page and the dishonest share card.** For a defect whose entire justification is *"a hiring manager or a faculty reviewer will ask '88th of what?' within ten seconds"* — the hiring manager sees the card in a timeline. Most of them never click.

**3. `app/cases/[slug]/opengraph-image.tsx`** — a second OG generator, named only in V-6's read-first list, with no acceptance criterion attached.

**4. Legacy payload rendering — a spec contradiction.** *"Keep the percentile code frozen and reachable for old payload rendering only."* But payload encoding is on the forbidden list, so there is **no version discriminator.** A payload from yesterday and one from tomorrow are structurally identical. **You cannot branch on a distinction you have forbidden yourself from encoding.** The agent will burn hours discovering this.
**Fix, and it is better anyway:** all payloads render bands. An old link showing "88th" is exactly the thing you are trying to eliminate — you do not want that path reachable. Keep `lib/percentiles.ts` only because tests reference it. Delete the legacy-rendering clause.

**5. Third-party OG caches.** X, LinkedIn, Slack, and Facebook cache scraped cards for weeks or indefinitely. Rewriting the generator does not touch cards already scraped. Every link shared before the fix keeps showing *"6% of respondents"* forever. **Nobody mentions this.** Fix: bump the OG image path or add a cache-busting param so new shares re-scrape.

**6. Static generation / ISR.** If any relevant route is statically generated, deploying does not invalidate cached HTML. Not checked anywhere.

**7. The design file is a reinfection vector.** `Sigils and Result Hero.dc.html` is declared *"source of truth for visual decisions"* and **contains the rarity line.** An agent handed it as spec will re-implement what it sees. Also: no prompt says where this file lives or how the agent reads it, and V-1/V-2/V-3/V-6 all reference "the design artifact" as if attached. **If it is not in the repo, the agent invents.** Commit it to `docs/v24/design/` on day 0.

**8. Prose paraphrases.** A grep for `% of respondents` catches nothing else: "rarer than," "most people," "a typical respondent," "an uncommon reading," "only one in six." Give the agent an explicit pattern list and make `copy:audit:strict` carry a permanent rule so it cannot come back.

**And the conflict nobody noticed — SERIOUS.** The honest copy is **longer** than the dishonest copy. `"88th"` is 4 characters; `"high in this instrument's range"` is 31, three times over, plus a 90-character disclaimer sentence. At 390px that is 150–250px of additional vertical content **in the one region required to fit a single viewport without scrolling**, alongside the sigil, name at 44px, a two-sentence gloss, a 2×2 map with four `nowrap` corner labels and a posture strip, the new firmness sentence, and a scroll cue. **It does not fit.** The percentile fix and the one-viewport hero are in direct conflict, and the plan pairs them in the same prompt.

---

## 5. The cheap tier next week — what the doc does not warn about

The "not during the sprint" advice is right. These are the gaps:

**a) "Byte-identical output is the test" — SERIOUS.** The doc names V-0 extraction as the ideal first Tier B task *"because byte-identical output is the test."* **There is no such test in the repo.** The doc asserts the test as a property of the task rather than a file someone must write — violating its own rule (*"Write the test first. In Tier A. Before the cheap model runs."*). Fix: write `scripts/copy-fingerprint.mjs` emitting a sorted hash of every exported string; commit the pre-change fingerprint. Thirty minutes, and it converts the task from unverifiable to genuinely Tier B.

**b) The Tier B gate is weaker than the real gate — SERIOUS.** The handoff template runs `typecheck && lint && test && build`. It omits `validate`, `evidence:audit:check`, `copy:audit:strict`, and e2e. For a **content extraction task**, `copy:audit:strict` is the check that matters most, and it is the one omitted.

**c) Week 2's first task is backwards — SERIOUS.** *"Give it the V-0 leftovers as its first real task."* The leftovers are by definition the residue a frontier agent could not finish — template literals, ambiguous strings, the hard cases. Giving those to a weaker model is exactly inverted. First cheap-tier task should be from the doc's own list and boring: `phase*-docs/` → `docs/history/`, or generalising the two validators.

**d) Auto-approve — SERIOUS.** The doc sells Cline's diff review as *the* safety property and predicts the failure (*"if you find yourself approving diffs without reading them"*) without naming the mechanism: it is a checkbox, it is right there, and there is a separate one for **auto-approving terminal commands.** The Codex contract forbids `git reset --hard`; the cheap-tier template does not. Fix: never auto-approve commands; run the cheap tier in a git worktree or a fresh clone; commit before every task so recovery is `git checkout .`.

**e) Cost estimates are the wrong shape — MINOR in dollars, serious in what it teaches.** The table computes "500k in / 200k out" as a single pass. Cline is an agentic loop: **every tool call resends the whole conversation.** Effective input is roughly quadratic in steps. A V-0-scale task is 5–15M input tokens, not 500k. At Flash prices that is still trivial — but the same error applied to a $3/$15 model later is $40, not $2. Set a hard spend cap on the OpenRouter key before the first task.

**f) OpenRouter routing — MINOR but confusing.** The same slug can be served by multiple providers at different quantisations and context limits. A task that worked yesterday fails today because routing moved. Pin the provider (`order` + `allow_fallbacks: false`) and record slug + provider in the commit message. Also expect at least one model name in that table to be a 404 by the time you paste it.

**g) The doc contradicts your own orchestration doc — SERIOUS.** §6.2 recommends *"Cline on the mechanical work, running in parallel in a second VS Code window."* `V24_AGENT_ORCHESTRATION` §3.3 says *"Parallelise the reading. Serialise the writing"* and *"two agents editing `globals.css` is not parallelism, it is a conflict you will resolve by hand."* Two agents on one working tree produces corrupted diffs and a `git status` neither can interpret. Fix: git worktrees, one per agent, or do not run them concurrently.

**h) Key hygiene — MINOR.** VS Code Settings Sync will sync settings to the cloud. STATE.md notes the repo is **public.** An agent that can write files plus a careless `.env` commit is one mistake from a leaked key. Secret storage only, `.env*` gitignored, spend cap so a leak is bounded.

---

## 6. What is missing entirely

**a) Visual regression testing — FATAL omission.** A sprint whose entire purpose is visual change, with a gate containing **zero pixel comparison.** V-0's acceptance is literally *"zero perceptible visual change"* — unverifiable, on the largest and least reviewable diff of the week. Playwright is already installed and ships `toHaveScreenshot()`. **Fix: day 0, capture baselines across a route list at 390/768/1440 in both schemes, commit them.** One hour. It is the only thing that makes "no visual change" checkable and the only defence against an agent quietly breaking a route nobody screenshots. Every subsequent prompt gets a real pass/fail, and an intentional change becomes an explicit baseline update you review as images.

**b) No real-device check — SERIOUS.** Every acceptance criterion is about how it looks and behaves; the entire verification is agent-produced Playwright screenshots. Playwright WebKit does not reproduce the iOS toolbar, the sticky repaint bug, or momentum-scroll IO coalescing — the three things most likely to break. Fix: 20 minutes a day on an actual phone against the Vercel preview. Free.

**c) No rollback story, no incremental merge — SERIOUS.** Seven prompts of interdependent change to a live site in one draft PR at the end. If anything breaks in production you revert everything, including the percentile fix. Fix: merge each green prompt to main behind preview verification.

**d) No performance budget — SERIOUS.** The brief identifies mapbox at ~800KB as *"the largest available performance win"* and then explicitly defers removal (*"do not remove it in this prompt"*). So the sprint adds animation and removes nothing. No LCP/CLS/TBT before or after. Fix: capture Lighthouse on three routes on day 0; add a First Load JS assertion to the gate that fails on >10% growth.

**e) No accessibility instrument — SERIOUS.** Eight a11y requirements, zero automated checks, and `@axe-core/playwright` would be a forbidden dependency. Fix: state that the no-dependency rule governs **runtime bundle weight**, not devDependencies, and add axe. Or delete the a11y bullets from the gate and stop pretending they are verified.

**f) Nobody timed the gate — SERIOUS.** Measure it once on day 0. If it exceeds 8 minutes, define a fast inner loop (typecheck + affected tests + build) and run the full gate once per prompt at the stop point only. Otherwise you spend a quarter of the week watching a terminal.

**g) No owner-copy budget.** The sprint ends with an empty authorial-note slot (V-4 forbids writing it), a pending Advanced/analyst label decision (V-5), and new band copy (V-2) — all owner-only decisions with no scheduled time. Budget 90 minutes on day 5 or ship the note slot hidden.

**h) "One viewport" vs "400% reflow" are mutually hostile and both are gates.** Nobody says which wins. State that 772/844 is design intent, not a gate; the gates are no-overflow and reflow.

**i) Checkpoint A gates the must-ship prompt behind a design opinion.** *"Do not carry an unresolved collision into the hero"* puts a subjective mark approval on the critical path to V-2. **Fix — pure scope cut:** drop the Kairos/Concert geometry change entirely. Enforce `ARCHETYPE_MARK_MIN_PICTORIAL_SIZE = 32` and render the code below it. That alone resolves the collision by never showing the marks at a size where they collide, costs one constant and one conditional, removes the V-1 internal contradiction (don't change `d` vs. change the geometry), and unblocks the critical path.

---

## The single change that most increases the chance this ships

**Pull the percentile and rarity removal out of V-2, make it prompt zero, run it first, merge it to main on day one.**

It touches display strings and one library call. It has no dependency on content extraction, tokens, the sigil system, or the hero. It is the only item in this entire document set that is a **defect** rather than an improvement — the one thing that is currently false on a public site. Right now it is scheduled behind two days of the riskiest groundwork in the pack, coupled to the largest visual rebuild, split so that stopping early leaves it half-done, protected by an abort rule that names the wrong prompt, and blocked from merging by a checkpoint the sprint will not reach.

Scoped as its own prompt it covers all seven surfaces at once — hero, dimension tables, both OG generators, the design file, the prose paraphrases, and a permanent `copy:audit:strict` rule — and it is done in half a day.

That single re-ordering converts the sprint from *"a five-day gamble that must complete to be worth anything"* into *"a guaranteed win banked on day one, plus optional upside."* It costs nothing. It is not new work, more time, or a different scope. It is a reordering, and it makes the credit expiry irrelevant to the outcome that actually matters.

Then, in descending value, if you want the sprint to survive contact: capture visual regression baselines on day 0; cut V-0 Part 1 entirely; decide in writing that register two does not pin below 768px; and delete the "do not merge until Checkpoint C" rule.
