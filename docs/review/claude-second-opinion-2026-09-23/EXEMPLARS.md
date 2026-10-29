# Exemplar rewrites

These are the reference rewrites for the voice in `docs/voice/VOICE.md`. They are meant to be pasted into a copy task as models, not applied as a batch. Each one shows the pattern it fixes so a model can generalise from it. Every "before" is current text from `fix/pilot-trust-storage` (PR 64 plus the branch).

Scored question wording and explainers only change with a new bank version, so sections 1 and 2 are proposals for that version. Everything else can ship as ordinary copy.

## 1. Questions: one claim, plain nouns

The core items pack a claim and a concession into abstract nouns. Four of the seven forward-worded core items use "even when" or "even during". The condition is often doing measurement work, so the fix is plain words, not dropping the condition.

**sc2** (17 words, four abstract nouns)
Before: Uncertainty about another state's long-term intentions makes continued military preparation necessary even during sustained cooperation.
After: Two states that cooperate well today should still prepare militarily, because neither can know what the other will want in ten years.

**df1**
Before: A new governing coalition often redirects foreign policy even when the external threat remains unchanged.
After: Foreign policy often changes with a new government, even when nothing abroad has changed.

**v21_df_rev_04** (reverse item)
Before: Regime change rarely alters a state's basic interests when its external position stays constant.
After: If a country's position in the world stays the same, a change of regime rarely changes what it wants.

**v21_ni_rev_05** (reverse item)
Before: Recognition from other states rarely changes what governments seek in major security disputes.
After: In a serious security dispute, respect from other states rarely changes what a government is after.

## 2. Explainers: show both answers on one case

The current `whatItAsks` field forces a restatement of the question as a question. Either it repeats the item (v21_ni_rev_05's explainer reuses 83% of the item's content words) or it quietly asks something else. df1's explainer asks whether domestic politics shifts policy "as much as events abroad", which is a comparison the item never makes. oj2's explainer turns "override a state's sovereignty" into "military action", which is narrower. People who open those explainers answer a different question from people who do not.

Replace the field with Agree if / Disagree if / Term, and use one case for both sides so the illustration does not tilt the answer.

**in2**: Monitoring and repeated contact can keep international agreements alive even when trust is thin.
Before: Can monitoring and regular contact keep an agreement working when the parties do not trust each other?
After:
Agree if you think on-site inspections kept the 1987 INF Treaty working between two governments that distrusted each other.
Disagree if you think the INF Treaty lasted only as long as both sides wanted it, and inspections did not change that.

**oj2**: When mass atrocities become severe enough, outside powers can justifiably override a state's sovereignty to stop them.
Before: Can extreme harm to civilians justify military action without the government's consent?
After:
Agree if you think NATO was right to bomb Yugoslavia over Kosovo in 1999 without Security Council approval.
Disagree if you think that campaign did more damage to the rules on force than it prevented.
Term. Sovereignty: a state's claim to decide what happens inside its borders.

## 3. Result hero, clear result

Before (Shi, P−, Justice-first):
> Realism leads this Foundation read. Your recorded position treats enduring rivalry as a constraint that favorable intentions alone cannot remove. The strategic position leans toward setting limits on pressure and avoiding overextension. The normative position gives justice claims more room to override established order. The lead is clearer within the current item set. Critical political economy remains the nearest alternative. This is a model result. It does not establish a durable trait.

After:
> **Shi (勢)** · Realism, with restraint
> You expect rivals to stay rivals whatever they say about their intentions. You would build a position and wait before you would press an advantage now. On intervention you let justice override sovereignty, which is where you part company with most realists.
> Nearest alternative: critical political economy, mostly because of how you answered on order and justice.

Why: three sentences about the person instead of six about "the position", "the item set", and "the model". The last two sentences of the original are deleted outright. "Your answers" already scopes the claim.

## 4. Result hero, flat or tied answers

The all-midpoint answer set (and 823,542 other answer patterns) produces a four-way tie that enumeration order resolves to Realism and Institutionalism. The page then names a hero, "Kairos–Grotian", shows a "What did the work" table where every row is +0.000, and says "the two finished close".

Before:
> **Kairos–Grotian.** An initial Foundation read: Realism and Institutionalism. The rivalry score alone does not establish whether cooperation can change the relationship. The strategic position leaves the boundary between applying pressure and setting limits unresolved. The normative position leaves the threshold for overriding established order unresolved.

After (no archetype name, no mark, no contribution table):
> **No clear lean yet**
> Your answers came out level on all seven dimensions, so no tradition is ahead. That happens when someone holds both sides of each argument, and also when the questions were too blunt to separate them.
> Five follow-up questions put the traditions against each other directly. [Answer five more]

## 5. Archetype card and detail (catalogue page)

Before (gloss, shown on /archetypes to people who have not answered, and used as the meta description):
> Your answers put power and timing first: a strategic opening is an opportunity to act.

After:
> Kairos puts power and timing first. When an opening appears, it acts before the opening closes.

Before (historicalAnalogue.whereItBreaks):
> The dialogue can also be read as Thucydides' indictment of imperial arrogance and overreach. It is an extreme episode, not a neutral summary of every realist position.

After:
> Thucydides may have meant it as an indictment. Athens took Melos in 416 BC and sailed for Sicily the next year, where the expedition was destroyed.

Why: the rewrite shows the failure mode with a date instead of denying a claim nobody made.

## 6. Decision Pattern comparison

The card currently prints "Several Lenses" as the title and "Bridge Builder" underneath, two names for one thing.

Before (confusionNote):
> It is easy to mistake for Coalitions First, because both resist maximalism, and for Different by Domain, because both can look unsettled. The difference: Several Lenses keeps the overlap between arguments intact, while Different by Domain shows a real split between domains or between diagnosis and decision.

After:
> Nearest neighbours: Coalitions First and Different by Domain. Coalitions First also avoids hard lines, but because it is counting partners. Several Lenses is waiting for the evidence. Different by Domain gives firm answers that disagree across domains. Several Lenses stays open until a case forces it, as dependence on a rival's technology does.

## 7. Security, before the first card

Before: a panel titled "Scope, lanes, and how to read the cases" with "What it tests" (four bullets such as "alliance-centered versus autonomy-sensitive coalition instincts"), "What it does not claim" (three bullets such as "a fixed security identity that overrides the Foundation baseline"), "Lanes", and a "Reading rule" paragraph.

After:
> {count} cases, about {minutes} minutes. You are at the table each time: NATO ministers choosing a posture for the eastern flank after months of sabotage scares, a Southeast Asian cabinet deciding whose help to accept against a much larger neighbour, monitors watching a ceasefire fray.
> Some cards ask what explains what happened. Others ask what you would do. Your result shows where those two answers part ways.

The `measures` and `doesNotClaim` arrays stay in the module definition for Method and tests. They stop rendering here.

## 8. Library

Six of nine section intros end on a limit: "Nothing in the Library changes your result", "Each is broader than fourteen questions can capture", "not a percentile", "none is assigned to you", "No thinker is assigned a Foundation reading", "Four traditions do not cover the field".

After, hero:
> The arguments behind the questions. Look up the reading you were given, read a thinker you have heard of, or find the decision you would have made differently.

After, sections:
> **Readings.** Eight readings: four traditions, each in a pressing and a restrained version.
> **Traditions.** Realism, institutionalism, constructivism and critical political economy: the central argument of each, its best case, and where it fails.
> **Dimensions.** The seven questions every reading answers, from how long rivalry lasts to when justice can override order.
> **Decision Patterns.** Ways of approaching a hard choice, compared on the same cases.
> **Beyond the four.** Feminist, postcolonial and green IR ask questions these seven dimensions leave out. What each would add.

## 9. Method, opening

Before: seven dimension descriptions, five of which end on a denial ("This is a strategic style dimension, not a standalone worldview family", "not a claim about who is more moral"), followed by "This is not a validated psychometric instrument."

After:
> Fourteen statements, two for each of seven dimensions. One statement in each pair is worded in reverse, so agreeing with everything cancels out. Your seven positions are compared with four reference profiles, one per tradition, which the author wrote from the literature. The closest profile names your reading and the next closest is your nearest alternative.
> How much to trust that: the profiles are one person's summary of each tradition, and fourteen statements make a short test. Treat the result as an opening argument about your views, then test it on the cases.

Restraint dimension, before: "When a major power has room to press for advantage, is the safer instinct to hold back or to exploit the opening? This is a strategic style dimension, not a standalone worldview family."
After: "When a major power has room to press, does it hold back or take the opening? This sets the + or − in your reading code."

## 10. Readbacks after an exercise

Futures, before: "You prefer irrevocable membership for a society you join. This is a positive preference for binding commitment, rather than merely declining to make exit indispensable."
After: "You chose membership that cannot be revoked. That is a commitment to being bound, which goes further than not insisting on a way out."

Decision exercise, before: "Neither your original domestic checks nor the custodian's rights were directly changed by the national-access provision."
After: "The national-access rule left your domestic checks and the custodian's rights as they were."

Decision exercise, before: "This bounded choice set did not supply the information or terms you needed; it does not locate you between the three policies."
After: "You rejected all three options as incomplete. That answer stands on its own, outside the three policies."

## 11. The limits section on the result page

Before: heading "What this model can and cannot say", then "Your answers were compared with four authored tradition profiles. It is a reading of those answers, not a measurement of proven accuracy, and not a personal trait."

After: heading "How far to trust this", then "Fourteen answers, compared with four reference profiles. A result near the line between two traditions can flip with one answer. Method explains the scoring."

## 12. Chinese

Before (zh result utility): 中文解释保留既有的经审校基础家族长文。模型规范专名仍以英文显示，并明确标注其编辑状态。
After: 部分专名保留英文，便于对照原文。
