> **HISTORICAL, SUPERSEDED, NON-EXECUTABLE.** Preserved only for provenance. Verify every claim against the current roadmap, Git state, and runtime before reuse.

# Closed Trial Protocol and Go-to-Market Plan

> **HISTORICAL, SUPERSEDED, NON-EXECUTABLE.** Use `docs/research/V22_5_COGNITIVE_INTERVIEW_PACK.md` for current fielding.

**Date:** 21 August 2026
**Decision taken:** an informal two-to-three person round now, by text; the full paid twelve-person trial after V25.
**This document designs for that sequence**, with one modification to the informal round that costs nothing and materially reduces the risk of powering through.

---

# PART ONE — THE TRIAL

## 1. The risk you are accepting, stated once

Building V24 and V25 before the full trial means authoring roughly forty more scored items against item-design assumptions that no human has tested. If the trial then finds a systematic item problem — options that differ by intensity rather than logic, a morally attractive choice in each set, knowledge load that quietly filters out non-specialists — the fix is not a copy edit. It is rewriting items, recalibrating, re-versioning, and doing it in two banks instead of one.

That risk is real and it is bounded. The V23.4 authoring guide already forces construct review before items are written, so a construct-level error should surface in the research pack. The item-level errors are the ones that slip through.

**So the modification is this: make the informal round ask the item questions, not the interface questions.** Three friends answering two specific questions about the Foundation and Security v5 will tell you more about whether V24's bank is safe to write than any amount of feedback about buttons.

The two questions are in §2.3. They are the entire hedge.

---

## 2. Round 0 — the informal round, this week

### 2.1 Shape

Two to three people. Unpaid. By text or voice note. No screen share, no scheduling, no consent form, because nothing is being recorded or retained beyond a conversation you would have had anyway.

**One constraint that makes it useful:** do not watch, and do not explain. The instinct to narrate the design while a friend uses it destroys the only signal the round produces. Send the link, send the questions, wait.

### 2.2 Who

- one person with IR training who is not a close collaborator
- one person with no IR background at all, ideally someone who would never take this voluntarily
- optionally one person who works in tech or AI policy but not IR

The second is the most valuable and the easiest to skip. The instrument's stated promise is that it works without prior theory training. Nobody has tested that.

### 2.3 The message to send

> Would you do me a favour and spend about 20 minutes on this? irworldview.jhyip.com
>
> Take the Foundation questionnaire, read your result, then click into one of the Focus Areas. Then send me whatever you think, and specifically these:
>
> 1. In your own words, what did the site say your result was?
> 2. Did any answer look like the obviously decent, smart, or moderate one?
> 3. Was there a question where you didn't know enough to answer honestly, so you guessed?
> 4. At what point, if any, did you consider stopping?
> 5. Which sentence or page felt generic, robotic, or pointless?
>
> Don't be nice about it. I've been staring at this for months and I can't see it any more.

**Questions 2 and 3 are the hedge.** Question 2 detects option-valence problems: if one answer is the respectable one, the instrument is measuring self-presentation. Question 3 detects knowledge load: if a respondent guessed, the item is measuring familiarity with the news rather than judgment.

Both defects, if present in the Foundation or Security v5, are almost certainly present in whatever gets authored for V24, because the same person will author it the same way. That is the whole reason to ask now rather than in December.

**Question 1 is the comprehension test.** If someone says "it said I'm a Concert" you have a working label. If they say "it gave me a bunch of numbers and a Greek word," the result page is not delivering a result.

### 2.4 What to do with three answers

Almost nothing, deliberately. Three people are three people.

The only action rule worth having: **if the same thing appears twice, write it down. If it appears once, note it and wait.** Do not redesign anything from one comment. Do not let a coding agent redesign anything from three comments.

Keep the notes in `docs/v23.5/ROUND_0_NOTES.md` with dates and no names.

### 2.5 The one thing this round should trigger immediately

If two of three people say an answer looked like the obviously decent one, **stop before authoring V24's bank** and run an option-valence review across the existing Foundation and Security items first. That review is a day of work now and a month of rework later.

---

## 3. Round 1 — the full trial, after V25

### 3.1 Shape and budget

| Item | Assumption | Cost |
|---|---|---|
| Participants | 12 | — |
| Session length | 75 minutes, paid as 1.5 hours | — |
| Rate | $20/hr | $30 each |
| Participant payment | 12 × $30 | **$360** |
| Pilot sessions | 2, same terms | $60 |
| Transcription | free tier or manual | $0 |
| Contingency | reschedules, overrun | $80 |
| **Total** | | **~$500** |

Roughly $500 for the project's first human evidence after two years. That is a good trade and it should not be trimmed. If anything, paying $25/hr for faculty is worth the goodwill.

### 3.2 Composition

Twelve people, purposively sampled. Not a random sample and it must never be described as one.

| # | Segment | Why |
|---|---|---|
| 1–3 | IR-trained, SAIS or equivalent, faculty or advanced | Construct credibility. They will attack the taxonomy. |
| 4–5 | IR-trained, early career or student | The realistic core user. |
| 6–7 | Policy-adjacent, no IR training — tech, law, journalism | Tests the "works without theory training" promise. |
| 8 | No policy background at all | The honest floor. |
| 9–10 | Non-Western IR training or lived regional expertise | Tests the naming, the actor lenses, and the Taiwan and Iran cases. |
| 11 | Chinese-language user | Tests the locale boundary and the fail-closed behaviour. |
| 12 | AI governance practitioner | Tests the AI Compass and the Transfer Test specifically. |

Participants 9 and 10 are the ones most likely to be dropped for convenience and the ones most likely to surface the finding that matters.

### 3.3 Before the first session

Non-negotiable, in this order:

1. **A written consent document.** Purpose, what is collected, how long it is kept, deletion on request, right to stop at any point, whether findings will be published. One page.
2. **A decision, in writing, about publication.** Made before the sessions, not after. If there is any chance of a public write-up or a methods note, seek a JHU IRB determination rather than assuming one. Product usability testing is very often determined not-human-subjects research, but that determination should be obtained.
3. **A retention and deletion plan.** Where recordings live, who can access them, and the date they are destroyed.
4. **A check on faculty compensation disclosure.** $30 is small. The obligation to disclose outside payment is not always proportional to the amount.
5. **Two pilot sessions**, run and analysed, before the ten that count. Every protocol has a broken question and the pilot is how you find it.

### 3.4 Session structure — 75 minutes

**0–5 · Setup.** Consent confirmed. Recording started. One instruction, delivered exactly: *"Think out loud. Say what you are reading, what you are deciding, and what confuses you. I am testing the instrument, not you, and I will not defend it."*

**5–25 · Foundation, 14-item core.** Silent observation. Note every hesitation over three seconds, every re-read, every scroll-back, every audible reaction. **Do not answer questions during this block.** Deflect with "what would you do if I weren't here?"

**25–35 · The result.** Before anything else, the comprehension probe:

> In your own words, what did the site just tell you?

Then, in order:
> What is the difference between an archetype, a tradition, and a Focus Area result?
> What would have to be different about you for this to have come out differently?
> Is there anything here you would disagree with?

**35–50 · One assigned module.** Rotate: Security v5 with a Taiwan sequence, Security v5 with an Iran sequence, Technology, AI Compass. Same think-aloud rules.

For an actor-lens card, probe immediately after:
> Whose position were you reasoning from? Were you answering what that actor would do, what it should do, or what you would prefer?
> Did the instruction feel like it was asking you to endorse anything?

**50–60 · Item-level probes.** Return to three items flagged during observation. For each:
> Tell me what this question was asking, in your own words.
> What did [specialist term] mean here?
> Which of these answers makes the person choosing it look best?
> Was there an answer you wanted that wasn't there?

That third probe is the option-valence measure and it must be asked separately from "which did you agree with." They are different questions and conflating them is how instruments end up measuring self-presentation.

**60–70 · Free exploration.** Archetype page, Explore, Worldview Map, Profile. Unguided. Watch what they click and what they never click.

**70–75 · Closing.**
> Which sentence or page felt generic, robotic, confusing, or pointless?
> Is there a way of thinking about world politics that these questions did not give you room to express?
> Would you send this to anyone? Who, and what would you say about it?
> What did you expect to be able to do next that you couldn't?

The second question is the one that feeds the archetype expansion gate. Ask it of all twelve, verbatim, and record the answers verbatim.

### 3.5 Rotation matrix

| P | Language | Device | Module | Mode |
|---|---|---|---|---|
| 1 | EN | desktop | Security · Taiwan | Standard |
| 2 | EN | mobile | Security · Iran | Standard |
| 3 | EN | desktop | Technology | Advanced |
| 4 | EN | mobile | AI Compass | Standard |
| 5 | EN | desktop | Security · Taiwan | Advanced |
| 6 | EN | mobile | Technology | Standard |
| 7 | EN | desktop | AI Compass + Transfer Test | Standard |
| 8 | EN | mobile | Security · Iran | Standard |
| 9 | EN | desktop | Security · Taiwan | Advanced |
| 10 | EN | mobile | Economic Statecraft | Standard |
| 11 | zh-Hans | desktop | Foundation only, locale boundary | Standard |
| 12 | EN | desktop | AI Compass + Transfer Test | Advanced |

### 3.6 What twelve sessions can and cannot establish

**Can:** whether people understand the result; whether the ontology is learnable; where they stop; which items are ambiguous; which options carry moral valence; whether actor-lens instructions read as endorsement; whether the archetype names land or offend; whether the Transfer Test is legible; which traditions are missing.

**Cannot:** validity, reliability, factor structure, population prevalence, test-retest stability, cross-cultural equivalence, or that the archetypes are real kinds.

Write both lists into the methods note before running the sessions, so the temptation to overclaim afterwards meets a sentence written by a more careful version of yourself.

### 3.7 Analysis

- transcribe or timestamp-note every session within 24 hours, while memory is still doing work
- code against a fixed frame: comprehension failure, item ambiguity, option valence, knowledge load, navigation failure, trust reaction, coverage gap, visual or copy reaction
- **the reporting rule: a finding that appeared twice is a finding. A finding that appeared once is an observation.** Report both, labelled.
- produce `docs/research/V25_CLOSED_TRIAL_FINDINGS.md` with a bounded fix list. Bounded is the operative word. Do not let twelve opinions become a redesign.

---

# PART TWO — GO TO MARKET

## 4. The four objectives are in tension

You selected all four: revenue, audience, research rigor, and job credibility. They do not compose evenly.

- **Rigor and audience pull opposite ways on claim strength.** The sentence that spreads is usually the sentence the methodology forbids.
- **Revenue and job credibility pull opposite ways on time.** Both are full-time.
- **Rigor and job credibility are the same work.** Doing one does the other.
- **Audience is the input to revenue**, not a parallel track.

So the honest ordering is: rigor and credibility now, audience as a byproduct of doing them in public, revenue last and indirect.

## 5. Do not monetise the quiz

Free worldview quizzes have close to zero consumer willingness to pay. The comparables monetise on volume — millions of sessions, ads or cheap reports — which is not available at this scale and is contrary to everything the brand is built on. A paywall here converts a credibility asset into a low-revenue consumer product and loses at both.

## 6. The four revenue paths, ranked

### 6.1 Sell the method, not the product

**"Evidence-coded interactive instruments for institutions that cannot afford to be wrong in public."**

The IR Worldview Inventory is the portfolio piece. The differentiator is not the design. It is the governance layer: a release-decision record, a manifest fingerprint, frozen replay, a documented refusal to fuse scores, a public list of what the instrument cannot see. No other public quiz has any of that, and it is exactly what a think tank's general counsel worries about.

Buyers: think tanks wanting a public interactive without the reputational risk; university programmes; foundation communications teams; policy shops with a report they want to make interactive.

Realistic engagement: $5k–25k. Highest-probability path, and it uses everything already built.

### 6.2 Institutional licensing and teaching

A programme running a version as a course instrument. Low revenue, high credibility, and it solves the deepest problem in the project: a single course adoption produces real respondent data with a natural consent path, which is the thing two years of engineering has not produced.

Worth pursuing at close to zero price for the first adopter.

### 6.3 Editorial subscription

The Current Case pipeline is already an editorial product with evidence windows, claim-level sourcing, uncertainty, and options with accepted tradeoffs. That is the audience asset and the conversion channel into 6.1 and 6.2. Build the audience, not the paywall.

### 6.4 A paid depth layer

Advanced mode, the full 68-item Foundation, the archived case library. The ceiling is small. Do not build payments this year.

## 7. Social: pick one platform

- **X — primary.** Where IR and AI-policy people argue. Where a Current Case thread has a natural home. Where the job-relevant audience already is.
- **LinkedIn — secondary, cheap.** The same content in a different register. Directly serves the job goal and you already have a presence.
- **Instagram — third at best.** Where the sigils would perform visually and where the audience is not. Open it only once the visual system is genuinely finished, and treat it as an archive rather than a channel.

Running three accounts badly is worse than running one well.

## 8. The content engine

One Current Case per week produces a thread, one graphic, and a link. That is the whole engine, and the schema already contains every field it needs.

**The weekly loop:**

| Day | Output |
|---|---|
| Mon | Case published. Thread: the decision, the options, what each accepts as a cost. |
| Wed | One graphic: the four-tradition reading of that case. |
| Fri | The authorial note. One paragraph of actual opinion, signed. |

**The recurring visual identity** is the eight sigils and the four-tradition comparison. Those are the two things nobody else is making, and they are the reason to finish the visual system before opening an account rather than after.

## 9. The rule that keeps this from going wrong

A public account creates standing pressure to publish claims. The whole V22.5 to V23.4 arc was about not overclaiming. **The social layer is the most likely place that discipline breaks**, because the post that performs is the post the methodology forbids.

**Extend the copy audit to cover drafts.** The same P0 rules apply to a post: no unversioned distributional claims, no validity or reliability language, no population inference, no stale count. If `scripts/audit-public-copy.mjs` can lint a text file, run drafts through it. If not, keep the checklist beside the compose box.

**Never post:**
- a percentile or "N% of respondents"
- an archetype distribution
- anything implying the instrument is validated
- a result screenshot containing either of the first two

Those are the three most tempting and most damaging posts available, and the third is dangerous because it happens by accident.

## 10. The single artifact worth writing

One well-made public case study of how this instrument was built, methodological limits included: the decision to refuse score fusion, the release-decision record, the percentile problem and how it was found and fixed, the four under-modeled traditions, the Transfer Test and why it is not a bridge.

That one document is simultaneously:

- the job-application evidence, because it demonstrates judgment under uncertainty rather than a list of features
- the anchor post for the newsletter
- the sales collateral for 6.1
- the draft of a methods note

It costs one weekend and it is the highest-leverage writing available. Write it after the visual sprint, when the percentile fix is a story with an ending rather than an open defect.

---

# PART THREE — NINETY DAYS

| Weeks | Build | Evidence | Audience |
|---|---|---|---|
| 1 | Codex visual sprint, V-0 to V-6 | Round 0 with 3 friends | — |
| 2–3 | Sprint overflow, gate, merge V23.5 | Round 0 notes; option-valence review if triggered | — |
| 2–4 | — | R-1 AI source pack, R-2 Transfer pairs, R-5 naming review run in parallel | — |
| 4–6 | Transfer Test built against AI bank v2 | R-3 Economic Statecraft pack | Write the case study |
| 6–8 | AI onto the authoring framework, authored manifest, release decision | R-7 trial methods pack | X account opens with the case study |
| 8–12 | V24 Economic Statecraft implementation | R-4 Energy pack | Weekly case loop running |
| 12+ | V25 | Closed trial | Ongoing |

**The one non-negotiable:** the percentile removal ships in week 1. Everything else can slip.

## The three things that matter most, in order

1. **Remove the percentiles.** Everything else in the product is defensible. That one display is not, and it is the first thing a faculty reviewer or a hiring manager will find.
2. **Build the Transfer Test.** It converts the product's most awkward disclaimer into its most interesting claim, costs almost nothing, and is the thing you would actually want to describe in an interview.
3. **Ask the two item questions this week.** Option valence and knowledge load. Three friends, two questions. It is the entire hedge against powering through to V25, and it costs a text message.
