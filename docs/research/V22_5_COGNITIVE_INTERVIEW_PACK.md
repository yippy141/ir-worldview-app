# V22.5 cognitive-interview pack

**Prepared:** 6 August 2026  
**Program:** V22.5 evidence-ready controlled beta  
**Purpose:** moderated pretesting and evidence for revision  
**Applies to:** Wave 0 walkthroughs and cognitive-interview Waves 1 and 2

## Purpose and limits

This pack is for finding interpretation, response, hierarchy, and interaction
failures before wider use. It produces structured qualitative evidence for
revision. It does not establish population performance, reliability, construct
sufficiency, archetype distinctness, or prevalence.

Use the terms **walkthrough**, **pretesting**, **cognitive interview**, and
**evidence for revision** in recruitment, moderation, notes, and reporting.
Do not describe a participant's answers as correct or incorrect. The object of
study is the instrument and its presentation, not the participant.

Before each wave, record:

| Field | Required record |
| --- | --- |
| Build | Git commit and deployment URL used in every session |
| Foundation | Structural, scoring, and locale-copy versions |
| Security | Bank and scoring versions |
| Profile | ProfileStore version and visible module-comparison status |
| Locale | `en` or `zh-Hans`; record any English-only surface separately |
| Materials | Revision of this pack and CSV templates |
| Owner | Research lead, moderator, and note-taker codes |

Do not compare notes across builds as if the wording were unchanged. If a
participant encounters a different build, mark the session as a protocol
deviation and decide whether to repeat it.

## Required participant path

Every Wave 0, Wave 1, and Wave 2 participant completes the following path:

1. the 14-item Foundation core;
2. the Foundation result;
3. the Standard Security module;
4. the Security module result; and
5. the Profile.

Every Wave 1 and Wave 2 participant also completes an assigned nine-item
extended Foundation block. Wave 0 participants complete three assigned
extended items to rehearse the protocol without turning the walkthrough into a
full item interview.

Within the Standard Security module, every participant receives focused probes
on:

- `gray_zone_sabotage`, the common non-actor-lens Security anchor; and
- `middle_power_alignment`, the common actor-perspective item.

The common anchor is called “neutral” in this protocol only because it is the
same non-actor-lens comparison item for every participant. It is still a scored
item. Do not tell participants that an answer is neutral, centrist, preferred,
or methodologically privileged.

The extended block is administered after the first Foundation result so that
the participant can describe the 14-item result without the additional items
changing that first impression. The researcher records extended-item findings;
the participant does not need to generate a second Foundation result unless the
session script explicitly calls for a retest of revised result copy.

Use Standard Security because its nine-item path contains both common probe
items and produces a real module result. Do not construct a result from only
the two probed items.

### Result hierarchy under test

The intended hierarchy is:

1. the Foundation archetype is the user-level identity;
2. the closest modeled tradition and the posture and normative modifiers are
   supporting interpretation;
3. Security is a separate issue record beside the Foundation;
4. Security does not rescore or rename the Foundation;
5. Decision Patterns are optional editorial reading aids, not assigned
   identities.

The moderator must not teach this hierarchy before asking the result probes.

## Simplified Chinese coverage and current boundary

Across Waves 1 and 2, conduct at least four sessions with the Foundation,
Foundation result, and Profile in Simplified Chinese. Use the public `/zh`
routes and the `zh-Hans` instrument copy. Aim for at least two such sessions in
each wave.

The current declared Chinese contract excludes module and perspective
instruments. The Security module is therefore an English-only leg of a
Simplified Chinese session. Until approved Chinese module copy exists:

- recruit bilingual participants for the four required Chinese-interface
  sessions;
- tell them before scheduling that one section remains in English;
- record `zh-Hans + English module` as the actual language path;
- do not translate Security wording or options ad hoc;
- let the participant explain their reasoning in Chinese;
- code language burden separately from item-meaning burden; and
- do not report these sessions as evidence about a monolingual Chinese Security
  module.

If a participant cannot comfortably complete the English module, stop that leg,
record `LOC-BOUNDARY`, and do not pressure them to continue. The completed
Chinese Foundation and Profile observations remain usable, but the session does
not satisfy the full-path count and must be replaced.

For Chinese items, first ask for the participant's paraphrase in Chinese. Record
a short de-identified Chinese paraphrase and a separate English analytic
summary. Do not silently replace the participant's wording with an English
translation.

## Study structure

| Stage | Participants | Main purpose | Change rule |
| --- | ---: | --- | --- |
| Wave 0 | 3–5 | Catch broken instructions, route failures, obvious jargon, and result-hierarchy problems | Fix release blockers before Wave 1; log lower-severity findings for Wave 1 |
| Wave 1 | 6–8 new users | Locate recurrent interpretation, knowledge, response-selection, moral-valence, actor-role, and result failures | Apply triggered revisions and run the release/copy checks before Wave 2 |
| Wave 2 | 6–8 new users | Retest revised material and look for remaining or newly introduced failures | Close, revise again, or defer each issue with a written rationale |

Waves 1 and 2 total approximately 12–16 new participants. Wave 0 participants
do not count toward that total and may not return in either cognitive-interview
wave.

### Independence

“Independent participants” means people who did not observe one another's
session, were not given previous findings, and were not coached on intended
interpretations. Do not recruit pairs into the same session.

### Gates

Do not begin Wave 1 until:

- all required routes complete on the frozen test build;
- the note and issue templates are ready;
- the moderator has rehearsed neutral probing;
- the six extended blocks match the current 54-item extended bank; and
- participant information accurately describes the locale boundary.

Do not begin Wave 2 until:

- every Wave 1 note is coded;
- triggered revisions have an owner and revision reference;
- changed copy has passed the public-copy checks;
- the Wave 2 build and item wording are frozen;
- material item changes have new coverage targets; and
- no open severity-1 issue remains.

## Purposive sampling matrix

Use the sampling template at
`docs/research/templates/V22_5_COGNITIVE_INTERVIEW_SAMPLE.csv`. The matrix is
purposive: it seeks known differences in terminology familiarity, training,
language, and policy context. It is not a population sample.

The following quotas apply across the 12–16 Wave 1/2 participants:

| Sampling dimension | Minimum or target | Why it is included |
| --- | ---: | --- |
| IR-trained | At least 4 | Tests whether field terminology is precise rather than merely familiar |
| Informed non-specialist | At least 4 | Tests whether the instrument works without formal IR training |
| Low or no policy-school terminology familiarity | At least 4 | Exposes unexplained terms and hidden coursework assumptions |
| High policy-school terminology familiarity | At least 4 | Exposes false precision and theoretically muddled wording |
| Simplified Chinese interface | At least 4, with at least 2 per wave | Tests the approved Chinese Foundation/result/Profile copy |
| Non-U.S. or non-Western lived or educational context | At least 4 | Challenges U.S.-default framing without using background to alter scoring |
| Early-career or undergraduate | Target 3–5 | Adds participants with less accumulated policy shorthand |
| Practitioner or policy-adjacent, non-academic | Target 3–5 | Tests decision language outside classroom interpretation |

Categories may overlap. Language is not a proxy for nationality, culture, or
worldview. Do not infer a participant's background from their name, accent, or
selected locale. Let participants choose `yes`, `no`, or `decline` for the
coarse “non-U.S. or non-Western context” planning field; do not record a
country, employer, school, political affiliation, or citizenship.

For the minimum 12-session design:

- schedule six participants in each wave;
- assign blocks B1–B6 once in each wave;
- schedule at least two `zh-Hans + English module` sessions per wave;
- include at least two IR-trained and two informed non-specialists per wave;
- vary policy-term familiarity within both segments.

Participants 13–16 are not convenience overflow. Assign them to:

1. materially revised extended items needing two observations of new wording;
2. blocks with a severity-2 issue;
3. a locale or segment quota that is still short; then
4. blocks with the thinnest completed coverage.

If a required session is incomplete, recruit a replacement with the same block
and the closest feasible locale and sampling target.

## Rotating extended-item blocks

The current Foundation has 54 extended items. The six blocks below contain nine
items each. Assign each block to one Wave 1 participant and one Wave 2
participant. This yields two independent discussions of every extended item at
the 12-participant floor.

| Block | Extended item IDs |
| --- | --- |
| B1 | `sc1`, `rs1`, `tradeoff_interdependence`, `val_ci_4`, `v21_sc_rev_01`, `an_sc3`, `an_pe4`, `an_tradeoff_evidence`, `an_tradeoff_parallel_order` |
| B2 | `in1`, `val_iso_1`, `df2`, `tradeoff_strategy`, `v21_sc_rev_05`, `an_in3`, `an_in4`, `an_tradeoff_tech_order`, `an_case_sanctions_alignment` |
| B3 | `val_mi_1`, `tradeoff_alliances`, `val_mi_3`, `val_iso_4`, `v21_df_rev_01`, `an_pe3`, `an_tradeoff_legitimacy`, `an_case_middle_power`, `an_case_intervention_memory` |
| B4 | `ni1`, `val_mi_2`, `val_ci_3`, `tradeoff_intervention`, `v21_ni_rev_01`, `an_oj3`, `an_tradeoff_rival`, `an_case_green_finance`, `an_case_rising_power_voice` |
| B5 | `val_ci_1`, `val_ci_2`, `val_iso_3`, `case_semiconductors`, `v21_rs_rev_05`, `an_sc4`, `an_case_finance`, `an_case_maritime_crisis`, `an_tradeoff_energy_alignment` |
| B6 | `pe1`, `val_iso_2`, `val_mi_4`, `case_protection`, `v21_oj_rev_02`, `an_ni3`, `an_case_burdens`, `an_case_digital_stack`, `an_tradeoff_ceasefire_settlement` |

Use current on-screen wording, options, clarifications, and locale copy. Item IDs
are stable references; this pack does not duplicate production wording.

For Wave 0, assign three items from one block to each participant to rehearse
the probing sequence. Do not count Wave 0 toward the two-observation floor.

For each extended item:

- record one concise paraphrase;
- probe the decision or belief the participant thinks it asks about;
- probe the reason they could or could not select a response;
- probe knowledge burden;
- probe whether a response appears smarter, safer, more moderate, or more
  morally decent;
- record hesitation and clarification use; and
- add an issue code only when there is an observable problem.

If wording changes materially after Wave 1, keep pre-change and post-change
counts separate. The revised wording should receive two Wave 2 observations
where capacity permits; reassign participants 13–16 before treating the issue
as closed.

Track assignments and completed counts in
`docs/research/templates/V22_5_EXTENDED_ITEM_COVERAGE.csv`.

## Roles and materials

### Roles

- **Moderator:** gives tasks, uses neutral probes, and protects participant
  choice.
- **Note-taker:** records behavior and short de-identified paraphrases without
  turning notes into a transcript.
- **Research lead:** reviews coding, adjudicates triggers, and owns revision
  decisions.

One person may moderate and take notes, but should complete the session summary
within 30 minutes after the interview.

### Session materials

- frozen test URL and commit;
- clean browser profile with no saved Foundation or module result;
- this protocol;
- one row in the sampling template;
- the participant's extended block;
- session-notes CSV;
- aggregate issue-log CSV;
- coverage CSV; and
- a visible clock.

Do not ask the participant to share, copy, paste, email, or message a result URL
or Profile link. If screen sharing is used, the participant navigates their own
browser and the moderator does not capture the URL.

## Session timing and sequence

Plan 75–90 minutes for Waves 1 and 2. Use the table below for those waves.
Plan 60–75 minutes for Wave 0, where only three extended items are probed.

| Minutes | Stage | Moderation mode |
| ---: | --- | --- |
| 0–5 | Participant information and agreement to notes | Scripted |
| 5–8 | Warm-up and think-aloud practice | Neutral practice |
| 8–20 | 14-item Foundation core | Mostly uninterrupted observation |
| 20–32 | Core retrospective item probes and Foundation result | Targeted probes |
| 32–50 | Assigned nine-item extended block | Concurrent think-aloud plus item probes |
| 50–66 | Standard Security module | Natural completion; deep probes on two common items |
| 66–75 | Security module result | Result and domain-separation probes |
| 75–84 | Profile | Hierarchy and next-action probes |
| 84–90 | Closing questions and participant check | Scripted |

If time runs short, reduce the number of optional follow-ups. Do not omit a
required surface or rush the participant's reading. Mark an incomplete path and
replace it for coverage purposes.

## Wave 0 walkthrough protocol

### Purpose

Wave 0 catches obvious faults before the interview waves:

- instructions that do not tell users what to do;
- missing, broken, or irreversible navigation;
- answer selection or review defects;
- jargon that blocks task completion;
- Foundation-result hierarchy failures;
- module-to-Foundation claims that suggest rescoring;
- Profile hierarchy failures;
- locale-routing defects; and
- accessibility barriers observable in the session.

Wave 0 is not used to estimate how often a problem occurs.

### Participants

Run three to five sessions. Include:

- at least one IR-trained participant;
- at least one informed non-specialist;
- at least one low-familiarity participant; and
- if feasible, one bilingual participant using the Chinese interface.

These participants cannot return in Waves 1 or 2.

### Moderator sequence

1. Read the participant information script.
2. Confirm the participant is willing to continue and to have de-identified
   notes taken.
3. Ask them to start from the Foundation landing point with a clean browser.
4. Say: “Please use this as you naturally would. Tell me what you expect before
   you click, but I may wait until the end of a page before asking questions.”
5. Let them complete the 14-item core without teaching terms or suggesting
   answers.
6. On the review screen, ask what they think will happen next and whether they
   can still change an answer.
7. On the Foundation result, run the result-hierarchy probes before explaining
   anything.
8. Administer the three assigned extended items and rehearse all five item-probe
   domains.
9. Complete Standard Security. Probe `gray_zone_sabotage` and
   `middle_power_alignment`.
10. On the module result, ask whether anything changed the Foundation.
11. Open Profile and run the hierarchy and next-action probes.
12. Close with the participant check and explain that the product, not their
    beliefs, was being tested.

### Wave 0 release blockers

Fix before Wave 1 if any participant:

- cannot complete the required path because of a product defect;
- cannot review or change an answer before results;
- is assigned a Decision Pattern as their identity;
- reasonably reads a module as rescoring the Foundation;
- encounters silent English fallback on an approved Chinese surface;
- exposes or is asked to transmit a sensitive result URL; or
- encounters a serious accessibility or privacy failure.

Other findings enter the issue log and are assessed with the revision triggers
below.

## Waves 1 and 2 cognitive-interview protocol

### Interview method

Use a mixed method:

- **mostly uninterrupted first pass** for the 14-item core, preserving a
  realistic completion experience;
- **retrospective probing** on four preassigned core items and any item with
  visible hesitation or clarification use;
- **concurrent think-aloud** for all nine assigned extended items;
- **focused concurrent and retrospective probes** for the two common Security
  items; and
- **retrospective hierarchy probes** on each result and Profile.

Silence is evidence, not an invitation to teach. Wait at least five seconds
after asking a probe. Use “What are you thinking?” rather than “Do you
understand?”

Never disclose scoring direction, dimension weights, expected result changes,
or a preferred interpretation during the interview.

### Wave 1 objectives

Wave 1 looks broadly for:

- item meaning that differs from the intended decision or belief;
- missing information needed to form a judgment;
- response options that fail to express the participant's judgment;
- moral, intellectual, moderate, or expert-sounding option cues;
- actor-perspective instructions read as endorsement;
- Chinese wording that changes the construct or adds burden;
- Foundation result elements mistaken for multiple assigned identities;
- module results mistaken for a changed Foundation;
- Profile hierarchy failures; and
- next actions that are invisible, misleading, or not useful.

### Between-wave review

Within two working days after the last Wave 1 session:

1. finalize all session notes;
2. update extended-item coverage;
3. merge repeated observations into aggregate issues;
4. count independent participants, not comments;
5. apply the revision triggers;
6. document each decision as `revise`, `retest`, `monitor`, `defer`, or
   `close-no-change`;
7. make only approved product changes in a separate implementation task;
8. run the release and copy checks; and
9. freeze the Wave 2 build.

This pack does not authorize product edits.

### Wave 2 objectives

Wave 2:

- repeats B1–B6 with new participants;
- retests triggered revisions without telling participants what changed;
- checks whether a fix introduced a new interpretation;
- completes any missing locale or segment quota;
- gives priority to revised items for participants 13–16; and
- distinguishes a resolved issue from a participant merely tolerating it.

An issue closes only when its action and evidence are documented. Lack of a
second complaint is not by itself evidence that a revision worked.

## Participant information script

### English

> Thank you for taking part in this pretest of the IR Worldview Inventory. We
> are examining how people understand the questions, results, and next steps.
> We are not testing your knowledge or judging your political beliefs. The
> session should take about [60 to 75 minutes for Wave 0 / 75 to 90 minutes for
> Waves 1 and 2].
>
> Participation is optional. You may skip a question, take a break, or stop at
> any time without giving a reason. Please do not share anything you would
> rather keep private.
>
> We will take de-identified notes about confusing wording, response choices,
> page behavior, and result interpretation. We will not record your full answer
> set, result URL, Profile link, employer, school, citizenship, political
> affiliation, contact details, or information about another person. Recruiting
> contact information stays in the external scheduling or recruitment tool and
> is not joined to your results.
>
> Recording is off by default. [If an approved recording procedure is being
> used: explain what will be recorded, who can access it, when it will be
> deleted, and ask separately for permission.] You can still participate if you
> decline recording.
>
> The browser may keep your result locally so the required pages can be opened
> during this session. Please do not copy or send the result or Profile link.
> We will clear the test browser after the session.
>
> [State compensation accurately, or say that there is no compensation.] Do
> you have any questions? Are you willing to continue and to have
> de-identified notes taken?

Record only `yes`, `no`, or `stopped` for agreement. Do not record a signature
or legal name in the research files.

### 简体中文

> 感谢你参加“国际关系世界观清单”的预试。我们想了解用户如何理解题目、结果和下一步操作。我们不是在考查你的知识，也不会评价你的政治观点。本次访谈预计需要【Wave 0：60 至 75 分钟 / Wave 1 或 Wave 2：75 至 90 分钟】。
>
> 参加完全自愿。你可以跳过任何问题、随时休息，或不说明理由直接结束。请不要分享任何你不愿公开的信息。
>
> 我们会做去标识化笔记，记录哪些表述让人困惑、选项是否容易作答、页面如何使用，以及用户怎样理解结果。我们不会记录你的完整答案组合、结果网址、画像链接、工作单位、学校、国籍、公民身份、政治立场、联系方式，或他人的信息。招募所需的联系方式只保存在外部预约或招募工具中，不会与你的结果合并。
>
> 默认不录音也不录像。[如使用经过批准的录音流程：说明录制内容、访问人员和删除时间，并另行征求同意。] 即使你不同意录音，也可以继续参加。
>
> 本次简体中文流程中的基础问卷、基础结果和画像使用中文；当前安全专题仍为英文。我们不会在访谈中临时翻译安全专题，以免改变题意。你可以用中文解释自己的思考。如果英文部分影响作答，请直接告诉我们。
>
> 为了在本次访谈中打开所需页面，浏览器可能会在本地暂存你的结果。请不要复制或发送结果网址或画像链接。访谈结束后，我们会清除测试浏览器中的本地记录。
>
> [如实说明补偿安排；如无补偿，也应直接说明。] 你有什么问题吗？你是否愿意继续，并同意我们做去标识化笔记？

研究文件中只记录 `yes`、`no` 或 `stopped`，不记录签名或真实姓名。

## Moderator language and neutral-probing rules

Use:

- “What does this question mean in your own words?”
- “Tell me more about how you got there.”
- “What made the response easy or hard to choose?”
- “What did you expect to see next?”
- “Where on the page did you get that impression?”

Avoid:

- “You understood that, right?”
- “Did you notice that this is only a modifier?”
- “Most people choose…”
- “The intended meaning is…”
- “That option is the balanced one.”
- “The system thinks you are…”

If asked what an item means, first say:

> I want to understand how the wording works without extra explanation. Please
> choose the response that best fits your reading, or tell me that you cannot
> choose. I can explain the intended scope after we finish this part.

After the observation is complete, the moderator may explain only what is
necessary for participant comfort. Mark the item as having required moderator
help.

## Item probe bank

Apply the five domains below to the preassigned core items, all assigned
extended items, and the two common Security items. Shorten follow-ups when the
first answer is complete and unambiguous.

| Domain | Required primary probe | Follow-ups | Evidence to note |
| --- | --- | --- | --- |
| Comprehension | “Explain the question in your own words.” | “What decision or belief is it asking about?” “What does [term] mean here?” | Construct substitution, ambiguous actor/timeframe, unread term, double question |
| Judgment | “How did you decide what you think about this?” | “Did you use a general belief, a case, or a guess?” “What information did you assume?” | Unavailable judgment, unstable frame, recalled example dominating wording |
| Response selection | “Why did you choose that response?” | “Was the response you wanted available?” “What is the difference between the two closest options?” | Missing response, overlapping options, scale mapping, midpoint misuse |
| Knowledge burden | “Did you need background knowledge the question did not supply?” | “Which fact or term?” “Could you answer without guessing?” | Hidden course knowledge, country-specific knowledge, glossary dependence |
| Moral valence | “Did any response look more intelligent, moderate, responsible, safe, or morally decent?” | “Would that appearance change what you selected?” “Did another option seem reckless or naive?” | Respectability cue, loaded actor, false compromise, moral ranking |

Ask once per probed item:

> What result change, if any, did you expect this answer to cause?

Record the expectation without confirming or correcting it. This tests whether
copy or interface cues imply an unsupported mapping.

### Likert-specific probes

- “What is the difference between one step and the next on this scale?”
- “What did the midpoint mean to you?”
- “Did you answer whether the statement is true, whether it is desirable, or
  whether you support a policy?”
- For reverse-worded items: “What would agreement with this statement say about
  your view?”

### Choice and scenario probes

- “Which part of the scene mattered most?”
- “Were you answering what is likely, what is wise, or what is morally right?”
- “Could more than one option express the same logic?”
- “Did one option combine several attractive ideas while others made one
  tradeoff?”
- “What information would have changed your choice?”

## Actor-perspective and endorsement-confusion probes

Use `middle_power_alignment` as the common actor-perspective item. Do not call
it role-play. Before the participant answers, ask:

1. “Whose decision are you making?”
2. “What is that actor trying to protect?”
3. “What constraints are you supposed to hold fixed?”
4. “Are you answering what you personally support, or what looks strongest
   from the stated position?”

After the participant answers, ask:

1. “Did reasoning from this actor's position feel like endorsing the actor or
   its conduct?”
2. “Could you choose a strategically coherent option that you would not support
   as policy?”
3. “Did the instruction give you enough permission to separate explanation
   from approval?”
4. “Was any option hard to select because it sounded like moral approval?”
5. “How would you describe what the resulting score says—and does not say—about
   you?”

Do not reassure the participant that the item is harmless before these probes.
If they experience the task as endorsement, ask which exact instruction,
scenario sentence, option, or result caused that reading.

Code:

- `ACTR-OWNER` when the decision-maker is unclear;
- `ACTR-CONSTRAINT` when the participant ignores or cannot use the stated
  constraints;
- `ACTR-ENDORSE` when reasoning is experienced as personal or moral
  endorsement; and
- `ACTR-RESULT` when the participant thinks the result assigns the actor's
  ideology or identity to them.

## Foundation result probes

Ask before the participant opens details or Methods:

1. “What is the main result on this page?”
2. “If you told a friend one result, what would you call it?”
3. “What is supporting evidence rather than another assigned type?”
4. “What do the archetype, closest tradition, posture, and normative modifier
   each appear to do?”
5. “Which two elements, if any, seem to conflict?”
6. “What did the explanation tell you that the label alone did not?”
7. “Which sentence sounded generic, machine-written, or empty?”
8. “What does the page suggest you should do next?”
9. “What do you expect that next action to change?”
10. “Would you need the Methods page to explain your result in ordinary
    language?”

Then ask the participant to point to the Foundation archetype, closest
tradition, modifiers, evidence, and primary next action. Record what they point
to; do not count a correct verbal answer if the page location remains unclear.

## Security module-result probes

1. “What is the main Security result?”
2. “What does this result measure in this set of cases?”
3. “Did completing Security change your Foundation?”
4. “Does this result sit under, beside, or above the Foundation? What on the
   page gave you that impression?”
5. “Do the Security axes appear comparable to Foundation dimensions?”
6. “Did you see any master score or implied movement between the two?”
7. “What does ‘separate issue record’ mean to you?”
8. “What would you do next from this result?”

If the participant says that Security changed the Foundation, ask them to show
the exact copy, visual, or navigation cue. Do not explain the intended
separation until the observation is recorded.

## Profile hierarchy and next-action probes

1. “What is the title of your Profile?”
2. “Which element, if any, is presented as your identity?”
3. “What are the modifiers doing?”
4. “How are the Foundation and Security records related?”
5. “Which result is more authoritative? Why?”
6. “Did the Security result rescore, move, rename, or replace the Foundation?”
7. “What are Decision Patterns? Is one being assigned to you?”
8. “What would you click next?”
9. “What do you expect that click to do?”
10. “What is missing if you wanted to use this result for reflection or
    discussion?”
11. “Which paragraph is most specific to your answers?”
12. “Which paragraph could be shown to almost anyone?”

Record the first click or stated next action as observed behavior, not as an
endorsement metric. Tier 1 counters and interview notes remain separate.

## Closing questions

1. “Where did you first feel interested?”
2. “Where did you first feel lost, bored, or overloaded?”
3. “Which question was hardest for a reason other than the policy tradeoff
   itself?”
4. “Which result sentence was most useful?”
5. “Which result sentence felt least earned by your answers?”
6. “Was there a view you wanted to express but could not?”
7. “Did any name or modifier imply a moral ranking?”
8. “What would you do next if the moderator were not here?”
9. “Is there anything in my notes that you do not want quoted, even without
   your name?”

End with:

> Thank you. The purpose was to find where the instrument or interface needs
> revision. Difficulty answering is useful evidence about the product, not a
> judgment about you.

## Note-taking template

Use
`docs/research/templates/V22_5_COGNITIVE_INTERVIEW_SESSION_NOTES.csv` for
observation-level notes. Do not create a transcript.

### Session header

| Field | Entry |
| --- | --- |
| Participant code | |
| Wave and block | |
| Build commit | |
| Planned and actual locale path | |
| Segment and terminology-familiarity bands | |
| Moderator and note-taker codes | |
| Start/end time | |
| Agreement to notes | `yes`, `no`, or `stopped` |
| Recording | `off` unless separately approved |
| Protocol deviations | |

### Observation format

For each meaningful observation, record:

| Field | What to write |
| --- | --- |
| Stage | Core, Foundation result, extended, Security, module result, or Profile |
| Route/content ID | Route, item ID, or stable content key |
| Probe domain | One taxonomy code |
| Evidence | Short de-identified paraphrase or directly observed behavior |
| Context | What the participant was trying to do |
| Severity | S1–S4 using the rules below |
| Moderator interpretation | Clearly separated from participant evidence |
| Follow-up | Needed, completed, or not needed |

### End-of-session summary

Complete within 30 minutes:

- top three observed failures;
- strongest evidence that hierarchy was understood;
- strongest evidence that hierarchy was not understood;
- any item needing moderator help;
- any actor-perspective endorsement concern;
- any locale-specific concern;
- any privacy, accessibility, or distress event;
- required coverage completed or missing;
- proposed aggregate issue IDs; and
- material marked `do not quote`.

## Issue coding taxonomy

One observation can carry more than one code, but designate one primary code.

| Code | Category | Use when |
| --- | --- | --- |
| `COMP-SCOPE` | Comprehension: scope | The actor, timeframe, comparison, or decision is misread |
| `COMP-TERM` | Comprehension: term | A word or phrase is unknown or read differently from its intended use |
| `COMP-DOUBLE` | Comprehension: double question | The participant answers one of two embedded claims |
| `JUDG-FRAME` | Judgment | The participant cannot form a judgment without choosing an unstated frame |
| `JUDG-RECALL` | Judgment | One recalled case overrides the general question in an unintended way |
| `RESP-MISSING` | Response selection | The participant's answer is not available |
| `RESP-OVERLAP` | Response selection | Options or scale points are not distinguishable |
| `RESP-MIDPOINT` | Response selection | The midpoint is used for “don't know,” refusal, or compromise ambiguously |
| `KNOW-TERM` | Knowledge burden | Specialized terminology blocks response |
| `KNOW-CONTEXT` | Knowledge burden | Missing factual or institutional context forces guessing |
| `VAL-DECENT` | Moral valence | A response attracts because it sounds morally decent or responsible |
| `VAL-SMART` | Intellectual valence | A response attracts because it sounds expert, nuanced, or intelligent |
| `VAL-MODERATE` | Moderation cue | A middle or blended option appears presumptively sensible |
| `ACTR-OWNER` | Actor perspective | The decision-maker or viewpoint is unclear |
| `ACTR-CONSTRAINT` | Actor perspective | The stated actor constraints cannot be held in view |
| `ACTR-ENDORSE` | Actor perspective | Reasoning from the position feels like endorsement |
| `ACTR-RESULT` | Actor perspective | The result appears to assign the actor's identity to the participant |
| `HIER-IDENTITY` | Result hierarchy | Supporting material is mistaken for another assigned identity |
| `HIER-DOMAIN` | Result hierarchy | A module appears to rescore, move, or outrank the Foundation |
| `HIER-PATTERN` | Result hierarchy | A Decision Pattern appears assigned to the participant |
| `NEXT-HIDDEN` | Next action | The participant cannot find a plausible next action |
| `NEXT-EXPECT` | Next action | The destination or consequence of an action is misunderstood |
| `COPY-GENERIC` | Result copy | Copy is described as interchangeable, empty, or machine-written |
| `COPY-CLAIM` | Trust/correctness | Copy claims more precision, prevalence, or linkage than the evidence supports |
| `LOC-MEANING` | Localization | Chinese copy changes or obscures the intended distinction |
| `LOC-BURDEN` | Localization | Chinese wording itself adds avoidable reading burden |
| `LOC-BOUNDARY` | Locale boundary | An English-only surface blocks a Chinese-interface session |
| `UX-INSTRUCTION` | Interaction | The participant cannot tell what to do |
| `UX-NAV` | Interaction | Navigation, review, resume, or reversal fails |
| `A11Y` | Accessibility | A perceivable, operable, or understandable barrier appears |
| `PRIVACY` | Data handling | The flow or protocol invites sensitive sharing or exceeds the stated data scope |
| `TECH` | Product defect | A route, payload, save, or rendering fault blocks or changes the task |

### Severity

| Severity | Definition | Default handling |
| --- | --- | --- |
| S1 — blocker | Privacy/security harm, serious accessibility barrier, broken required path, assigned wrong identity, or materially misleading result relationship | Stop affected fielding; owner review before the next session |
| S2 — high | Likely to change an answer, actor-role reading, main result, or next action | Trigger review as soon as recurrence threshold is met |
| S3 — moderate | Creates effort or ambiguity but participant can recover without coaching | Aggregate and prioritize between waves |
| S4 — observation | Preference, isolated hesitation, or polish issue without demonstrated effect | Monitor; do not revise solely from count |

Severity describes product impact, not how articulate or confident the
participant appears.

### Issue IDs and aggregation

Use `V225-[SURFACE]-NNN`, for example `V225-EXT-004` or
`V225-PROFILE-002`. The aggregate issue log contains de-identified summaries
and counts, not participant codes. A research lead may inspect the restricted
session notes to confirm independence.

Use
`docs/research/templates/V22_5_COGNITIVE_INTERVIEW_ISSUE_LOG.csv`.

## Revision triggers

Revise before the next wave when any of the following occurs:

- two independent participants misinterpret the same item in the same
  consequential way;
- two independent participants experience an actor-perspective exercise as
  endorsement;
- a participant cannot explain a result label without rereading Methods;
- two participants cannot distinguish archetype, closest tradition, modifier,
  and module;
- two participants select or seriously consider the same response because it
  sounds more decent, intelligent, moderate, or responsible rather than because
  its logic fits;
- two participants describe the same result paragraph as generic,
  machine-written, or empty;
- two participants think a module changed, moved, or rescored the Foundation;
- two participants think a Decision Pattern was assigned to them;
- two participants require the same unstated background knowledge to answer;
- two participants cannot predict the destination or effect of the same primary
  next action; or
- a Chinese wording issue changes the apparent actor, direction, tradeoff, or
  response meaning.

Immediate owner review is required after one:

- privacy or security failure;
- serious accessibility barrier;
- broken required route or unrecoverable payload;
- identity assignment contrary to the intended hierarchy;
- participant distress reasonably caused by endorsement framing; or
- silent English fallback on an approved Chinese surface.

Do not revise solely because:

- a participant dislikes their result;
- a participant disagrees with an item's premise but can answer the intended
  distinction;
- an option is uncommon in this small sample;
- an archetype or modifier appears only once;
- a moderator prefers different prose; or
- a Tier 1 counter moves unexpectedly without qualitative evidence about why.

### Revision decision record

Every triggered issue receives:

1. the item ID, route, or content key;
2. locale scope;
3. participant-type bands and independent count;
4. de-identified evidence;
5. severity and trigger;
6. action: `revise`, `retest`, `monitor`, `defer`, or `close-no-change`;
7. rationale;
8. owner and revision reference;
9. affected build/copy version; and
10. Wave 2 retest assignment.

An item revision must state which problem it is intended to fix. Avoid broad
rewrites that make it impossible to attribute a later improvement.

## Data-minimization rules

### Collect

- pseudonymous participant code;
- wave, locale path, broad sampling bands, and extended block;
- agreement to de-identified notes;
- route or content key;
- short paraphrases needed to establish the issue;
- observed behavior and hesitation band;
- issue codes, severity, and action;
- aggregate independent-participant counts; and
- `do not quote` instruction.

### Do not collect

- legal name in research notes;
- email, phone number, social handle, or address;
- exact age or birth date;
- employer, school, job title, citizenship, nationality, political party, or
  named community;
- raw 14-item, extended-item, or module answer vectors;
- result payloads, result URLs, or Profile share links;
- browser history beyond the observed test path;
- free-form biographical detail;
- another person's information; or
- Tier 1 records joined to interview notes or recruitment data.

If an exact selected option is essential to document an issue, describe only
the response-selection problem in the restricted session note. Do not build a
participant-level answer table.

### Contact separation

Recruitment and scheduling contact data remains in the owner-configured
external tool. The research files contain only the participant code. Keep the
code-to-contact lookup out of this repository and out of product storage.
Delete it when follow-up and compensation are complete under the owner's
retention policy.

### Recording and screenshots

Recording is off by default. Do not take screenshots containing payloads,
Profile links, browser history, notifications, or personal tabs.

If recording is exceptionally approved:

- obtain separate, explicit permission;
- allow full participation without recording;
- restrict access to named research staff;
- transcribe only the evidence needed for coding;
- de-identify the extract;
- delete the recording within seven days of transcription; and
- record deletion without storing the recording location in the issue log.

### Retention and access

- Store session notes in a restricted research location, not in product data.
- Limit access to the research lead, assigned moderator, and note-taker.
- Retain the aggregate issue and decision log without participant identifiers.
- Review session-level notes 90 days after the V22.5 revision decisions are
  complete and delete them unless a documented research need requires a
  shorter extension.
- Delete exported scheduler files immediately after they are no longer needed.
- Never commit completed participant notes, recordings, contact lookups, or
  sensitive URLs to this repository. Only blank templates belong here.

### Reporting

Report patterns as small-sample pretesting findings:

- “Two participants interpreted…”
- “This wording repeatedly led to…”
- “The revised wording still produced…”

Do not report percentages, subgroup rankings, prevalence, or participant
profiles from these interviews. Avoid quotes that could identify a participant
through distinctive experience. Honor every `do not quote` instruction.

## Distress, refusal, and stopping

If a participant appears distressed or says an item feels personally accusatory:

1. pause immediately;
2. remind them they may skip or stop;
3. do not ask them to justify the reaction;
4. ask only whether they want the observation excluded or marked
   `do not quote`;
5. end the session if requested;
6. record the product location and minimal issue code; and
7. escalate an S1 actor-framing or privacy concern to the research lead.

Do not continue probing in order to obtain a cleaner finding.

## End-of-wave outputs

Produce a short revision memo containing:

- frozen build and material versions;
- completed sample against the purposive matrix;
- English, Chinese-interface, and English-module counts;
- extended-item coverage and material wording changes;
- open issues by code and severity;
- revision triggers met;
- changes approved for retest;
- issues deferred with rationale;
- protocol deviations;
- data deletion due dates; and
- the next fielding decision.

Describe the memo as **pretesting evidence and revision decisions**.

## Field checklist

### Before every session

- [ ] Participant is new to the relevant interview wave.
- [ ] Participant code exists; no name appears in research files.
- [ ] Planned locale, segment, and extended block are recorded.
- [ ] Frozen build commit matches the wave record.
- [ ] Browser profile is clean.
- [ ] Recording is off unless separately approved.
- [ ] Participant information matches compensation and locale reality.
- [ ] Module English-only boundary is disclosed for Chinese-interface sessions.
- [ ] Note template contains no result URL or answer-vector fields.

### During every session

- [ ] Read the participant information script.
- [ ] Record agreement to notes.
- [ ] Complete all 14 core items and the first Foundation result.
- [ ] Complete three assigned extended items in Wave 0 or the assigned
      nine-item block in Wave 1/2.
- [ ] Complete Standard Security.
- [ ] Probe `gray_zone_sabotage`.
- [ ] Probe `middle_power_alignment` and endorsement confusion.
- [ ] Open and probe the Security result.
- [ ] Open and probe Profile hierarchy and next action.
- [ ] Mark any material as `do not quote`.

### After every session

- [ ] Clear local test-browser results.
- [ ] Complete the summary within 30 minutes.
- [ ] Update completed extended-item coverage.
- [ ] Propose issue codes without overcounting comments.
- [ ] Keep participant codes out of the aggregate issue log.
- [ ] Escalate S1 findings immediately.
- [ ] Store notes only in the approved restricted location.

### Before closing the program

- [ ] Wave 0 includes 3–5 complete walkthroughs.
- [ ] Waves 1 and 2 include approximately 12–16 new complete participants.
- [ ] At least four participants are IR-trained.
- [ ] At least four are informed non-specialists.
- [ ] At least four use the Simplified Chinese Foundation/result/Profile path.
- [ ] Every unchanged extended item has at least two independent discussions.
- [ ] Materially revised items have documented retest coverage.
- [ ] Every triggered issue has a decision and rationale.
- [ ] Completed participant files have deletion dates.
- [ ] Reporting uses pretesting and revision language only.
