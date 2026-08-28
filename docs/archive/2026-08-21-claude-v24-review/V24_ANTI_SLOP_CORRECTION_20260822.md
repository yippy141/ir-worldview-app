> **HISTORICAL, SUPERSEDED, NON-EXECUTABLE.** Preserved only for provenance. Verify every claim against the current roadmap, Git state, and runtime before reuse.

# Correction to the anti-slop system

> **HISTORICAL, SUPERSEDED, NON-EXECUTABLE.** Preserve for provenance. Use the runtime-copy system in the current master roadmap.

**Date:** 22 August 2026
**Supersedes parts of:** `docs/v24/V24_ANTI_SLOP_SYSTEM_20260821.md`

I wrote that document having read `IR_EDITORIAL_STYLE_GUIDE.md` and `scripts/audit-public-copy.mjs`, but not `CONSTITUTION`. That was a mistake, and it changes three things.

---

## 1. The standard already exists and is better than what I proposed

`CONSTITUTION` §2 is byte-identical across ir-worldview, asia-ai-safety-atlas, mine-to-magnet, and psii-dashboard. It already contains:

| I proposed | The constitution already says |
|---|---|
| Flag em-dash density above 1.0 per 100 words | §2.1 "**No em dashes.** Use a period, a comma, a colon, or rewrite. This is a hard rule." |
| Hedge and filler measures | §2.2 A named ban list: genuinely, honestly, actually, delve, robust, leverage, seamless, game-changing, unlock, empower |
| Nominalization density | §2.3 "No hype adjectives. Show the thing instead of praising it." |
| Punctuation tic measure | §2.4 "Limit parentheses. If a thought needs a parenthesis, it usually wants its own sentence." |
| The contestability test | §2.5 "**A paragraph that asserts nothing checkable is filler.**" |
| Sentence-length variance | §2.7 "Short sentences carry weight. Vary length." |
| Design slop tells | §6 A specific banned list: Inter, Roboto, Geist, Space Grotesk, Poppins, Montserrat; purple gradients, neon, glassmorphism, pure #000/#fff; centered gradient hero, oversized pills, three-up feature cards, emoji icons, bouncy spring animation |

§2.5 is the contestability test, stated in eight words. Use that phrasing, not mine.

**So do not write a second standard.** The anti-slop document's §5.1 generation contract should be replaced by: *paste CONSTITUTION §2 and §6.* That is what §7 already instructs.

---

## 2. The real gap is enforcement, not authorship

The constitution is a document agents are asked to read. Nothing checks it. `audit-public-copy.mjs` enforces roughly twenty phrase rules and six structural checks, none of which map to §2.1, §2.2, §2.3, or §2.4.

So the useful work is narrow: **make the audit enforce the constitution that already exists.**

- §2.1, em dashes. A hard rule with a hard check. Currently unenforced, and the 22 Aug audit found em dashes throughout ir-worldview's copy.
- §2.2, the ban list. Mechanical. The audit already has the machinery.
- §2.4, parentheses. Mechanical.
- §2.5, contestability. The claim-extraction pass. Still the right idea.

Drop the measures the audit disproved: hedge density fires on 1% of the corpus because earlier sweeps already fixed it, and the em-dash *density* measure had balanced accuracy 0.42. Note that §2.1 is a categorical ban, not a density threshold, so enforcing it is simpler than what I proposed and does not have the same failure mode.

---

## 3. One genuine conflict, and you have to decide it

§2.1 bans em dashes absolutely. The 22 Aug audit measured ir-worldview's copy and found that its three strongest passages all use an em-dash pair for definitional apposition:

> "International institutions — treaties, organizations, monitoring bodies, dispute-resolution mechanisms — can solve those problems without requiring trust or a world government."

That is the device doing real work. A hard ban removes it.

Two defensible resolutions:

- **Keep the ban.** It is a hard rule for a reason: em dashes are the strongest register tell in machine prose, and losing one good device is worth removing the tell. Rewrite those three passages with colons or separate sentences.
- **Amend §2.1** to ban the em dash as a *rhythmic* connector and permit the definitional pair. More precise, harder to enforce mechanically, and it weakens a rule whose value is that it is absolute.

I would keep the ban. But the choice is yours, and either way the constitution should say what you decided rather than being quietly violated.

---

## 4. What still stands from the original document

- **§3, the style corpus.** The constitution says what to avoid. It does not supply exemplars. Fifteen to twenty-five paragraphs of your own writing is still the highest-value thing on the list.
- **§4, the claim-extraction pass.** Now grounded in §2.5 rather than invented.
- **The runtime-assembly finding**, which the 22 Aug audit produced and the constitution cannot address: the worst copy in ir-worldview is assembled at runtime from fragments in `lib/narrative/foundation.ts`. Roughly 50 paragraphs that have never been read in the form a user sees. No constitution catches what nobody reads.
- **The router**, instrument-as-subject, which isolates about 8% of copy for human review.
