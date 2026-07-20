# V19 English public-copy audit

Status: approved audit implemented on `feature/v19-1-editorial-hardening`. See
`V19_1_ENGLISH_COPY_BEFORE_AFTER.md` for the 30 highest-impact changes.

Audit date: 2026-07-18

## Scope and method

This audit covers English copy that an ordinary reader can encounter through `app/**`, `components/**`, `lib/**`, and `content/current-cases/**`, including metadata and the homepage, Privacy, Methods, Corrections, World Stage, Current Case, Foundation, results, Profile, Worldview Map, AI, Perspective Runs, and worldview-profile surfaces.

It excludes tests, research reports, decision records, source titles, legal quotations, code identifiers, and already-clear accessibility-only labels. Current Case `editorialMemo` fields are also excluded because the public presentation does not render them.

The inventory below contains 43 editorial findings: 20 P0, 14 P1, and 9 P2. Related lines are grouped only when they create the same reader-facing problem and take the same replacement. “Fact check” means the replacement must be checked against current behavior or cited evidence before publication; it does not mean the existing claim is necessarily false.

The companion scanner, `scripts/audit-public-copy.mjs`, is deliberately advisory by default. It reports possible problems and contextual metaphor matches; it does not declare every match an error. `--strict` returns a failure when it finds P0 rules, leaked implementation language, or a banned contrastive template.

## P0 — false, unsupported, internally leaked, or stale claims

### P0-01 — AI question count is stale

- File: `app/ai/page.tsx:11`, `app/ai/page.tsx:22`
- Source text: “Map your instincts on frontier AI governance — 16 questions, around 8 minutes.” / “16 questions. Around 8 minutes.”
- Why it fails: the live schema reports 20 total questions in Standard mode. A fixed count has drifted from the questionnaire.
- Direct replacement: use the live totals in both metadata and body copy: “{standardQuestionTotal} questions. Around 8 minutes.”
- Fact check: Yes — verify the time estimate and count from the schema in the release build.

### P0-02 — AI page exposes an internal polish status

- File: `app/ai/page.tsx:167`
- Source text: “Send notes on the AI module while this beta polish pass is in progress.”
- Why it fails: “beta polish pass” is internal release language and will become stale independently of the route’s purpose.
- Direct replacement: “Report a factual error or interface problem.”
- Fact check: No.

### P0-03 — global footer exposes a release label

- File: `components/layout/site-chrome.tsx:321`
- Source text: “Beta”
- Why it fails: the label gives ordinary readers no useful product boundary and can contradict the production release state.
- Direct replacement: remove the label; keep the title and the stable footer links.
- Fact check: Yes — confirm whether any legally or operationally required beta designation exists.

### P0-04 — Privacy describes the sprint instead of current behavior

- File: `app/privacy/page.tsx:14`, `app/privacy/page.tsx:28`, `app/privacy/page.tsx:110`
- Source text: “V19 has no active research-response intake or research contact form.” / “Research-response collection is unavailable in V19.” / “There is no server-side research record to request or identify in V19.”
- Why it fails: a public privacy promise should remain true without knowing the sprint name. The version qualifier weakens a current behavior statement and will become stale.
- Direct replacement: “The inventory does not collect research responses or provide a research contact form.” / “Research responses are not collected.” / “The inventory does not hold a server-side research response for you.”
- Fact check: Yes — verify production behavior immediately before publication.

### P0-05 — Privacy leaks route and environment controls

- File: `app/privacy/page.tsx:15`
- Source text: “Research routes do not read request bodies and cannot be activated with environment variables.”
- Why it fails: request bodies, routes, and environment variables are engineering controls, not a reader-facing privacy explanation.
- Direct replacement: “The inactive research endpoints do not accept or store submitted data.”
- Fact check: Yes.

### P0-06 — Privacy publishes retired schema history

- File: `app/privacy/page.tsx:44-47`
- Source text: “The previous scaffold allowed persistent respondent and session IDs, contact email, exact times, derived profiles, arbitrary JSON, and natural-language fields. That contract has been removed. The legacy submit, event, and deletion routes now return a fixed unavailable response without reading the body.”
- Why it fails: this is a retired data contract and route implementation. It belongs in a decision record, while Privacy should describe what happens now.
- Direct replacement: “Research collection is inactive. The inventory does not accept research responses, contact details, or free-text submissions.”
- Fact check: Yes.

### P0-07 — Privacy over-exposes analytics implementation

- File: `app/privacy/page.tsx:60-70`
- Source text: “Vercel Web Analytics receives a small set of named interactions through a first-party validator.” / “the provider wrapper does not forward request IP, cookie, user-agent, or referrer headers.”
- Why it fails: validator and wrapper details are hard to verify as a durable public promise and obscure the useful boundary: which data is and is not measured.
- Direct replacement: “The inventory records a limited set of product interactions. It does not send answers, scores, profile labels, free text, full URLs, or precise identifiers with those events.”
- Fact check: Yes — compare with the production analytics allowlist and provider behavior.

### P0-08 — Privacy recounts a retired sharing feature

- File: `app/privacy/page.tsx:86-90`
- Source text: “The former encrypted friend-challenge link has been retired because it was a non-revocable bearer disclosure of choice and confidence. V19 now offers a case-only invitation for direct comparison after both readers finish.”
- Why it fails: it exposes product archaeology and sprint language instead of explaining the active share boundary.
- Direct replacement: “Current Case invitations contain the case link, not your answer. You can add your final reading only through an explicit share action.”
- Fact check: Yes.

### P0-09 — the result trust notice exposes build controls

- File: `components/research/research-status-notice.tsx:11-23`
- Source text: “Local-only release” / “V19 has no research-response intake, consent mock-up, contact field, or persistent research identifier.” / “It cannot be activated in this build by changing an environment variable.”
- Why it fails: release, mock-up, build, and environment-variable language is internal. The notice repeats caveats after the result instead of stating one stable promise.
- Direct replacement: heading “Research responses are not collected”; body “This result stays in your browser unless you choose to share it. Any future research study would require separate information and consent.”
- Fact check: Yes.

### P0-10 — Methods repeats privacy implementation details

- File: `app/method/page.tsx:133-141`
- Source text: “V19 keeps results and histories in this browser…” / “It has no active research-response intake, persistent research ID, research contact field, or mock consent control.” / “Product analytics remain coarse and cannot accept answers, profiles, result payloads, or free text.”
- Why it fails: sprint labels, mock controls, and payload vocabulary do not explain the method. Privacy should own the current data boundary.
- Direct replacement: “Results and histories stay in this browser unless you share them. The inventory does not collect research responses. See Privacy for the current analytics and sharing boundary.”
- Fact check: Yes.

### P0-11 — Methods publishes storage and share schemas

- File: `app/method/page.tsx:289-300`
- Source text: “ProfileStore v4…” / “migrates ProfileStore v1, v2, and v3…” / “Profile Share V2…” / “The decoder continues to read Profile Share V1…”
- Why it fails: storage keys, schema versions, migration behavior, and decoder compatibility are engineering details. They distract from the stable reader promise.
- Direct replacement: “Saved results remain on this device. Shared links contain the information needed to reopen the shared view, and older valid links remain readable when possible.”
- Fact check: Yes — confirm current backward compatibility.

### P0-12 — Methods contains an internal release log

- File: `app/method/page.tsx:384`, `app/method/page.tsx:476-510`
- Source text: “What is hand-tuned in this beta” / “Version history” / “Minimal stable Phase 5M pass” / “Phase 4R pass 2” / “Schema-driven MVP…”
- Why it fails: “beta,” phase names, UI-theme history, and MVP/schema notes are release artifacts. The hand-tuned methodological choices are useful; the release log is not.
- Direct replacement: heading “Editorial choices in the model”; keep the three methodological disclosures under it. Remove the public version-history section and preserve that history in release documentation.
- Fact check: No for the heading/removal; Yes for any retained compatibility claim.

### P0-13 — Corrections exposes record-version mechanics

- File: `app/cases/[slug]/corrections/page.tsx:37-53`
- Source text: “This page records the public version…” / “Version {record.version}” / “A later change…will receive a new record version.”
- Why it fails: the useful information is the date, evidence cutoff, and correction history. The internal version number makes the page read like a schema record.
- Direct replacement: “This page lists reviewed corrections and evidence updates.” / remove “Version {record.version}” / “Changes that could affect the judgment or readings will be recorded here with their date.”
- Fact check: No.

### P0-14 — Corrections/contact is framed around V19 and a retired form

- File: `app/feedback/page.tsx:19-28`
- Source text: “Open-ended product submissions are paused for V19.” / “The prior public form…” / “this release does not collect research responses.”
- Why it fails: the route should tell readers what they can report now. Sprint and retired-form history can become stale and delays the usable contact boundary.
- Direct replacement: heading “Report a factual, privacy, or security problem.” Body: “Use the project email for factual corrections, privacy questions, or security reports. Do not include quiz answers, result links, or information about another person.”
- Fact check: Yes — confirm the mailbox and handling boundary.

### P0-15 — Compare asks ordinary users for a “payload”

- File: `app/compare/page.tsx:12`, `app/compare/page.tsx:38-40`, `app/compare/page.tsx:47-79`
- Source text: “links or payloads” / “without a backend” / “payload segment” / “could not be decoded”
- Why it fails: payload, decoder, and backend are implementation terms. The task is simply to paste two shared-profile links.
- Direct replacement: “Paste two shared-profile links. The comparison is read-only and is not saved to an account.” Labels: “First shared-profile link” and “Second shared-profile link.” Error: “One or both links could not be read.”
- Fact check: Yes — confirm that full links are sufficient for every supported share format.

### P0-16 — Perspective cards expose scenario-set versions

- File: `components/perspectives/perspective-picker.tsx:64-67`, `components/profile/perspective-runs-section.tsx:140`
- Source text: “3 scenarios · about 5 min · set v{scenarioSetVersion}”
- Why it fails: the scenario-set version is useful for storage compatibility, not for choosing or reviewing a Perspective Run.
- Direct replacement: “3 scenarios · about 5 min”
- Fact check: Yes — verify the time estimate.

### P0-17 — retired Current Case links name the sprint

- File: `lib/current-cases/retired-challenge.ts:7`
- Source text: “Answer-bearing Current Case challenge links are not available in V19.”
- Why it fails: the recovery message should explain the active behavior, not the sprint in which it changed.
- Direct replacement: “This older challenge link cannot reveal another reader’s answer. Open the case and compare after both readers finish.”
- Fact check: Yes.

### P0-18 — research endpoint response names a release

- File: `lib/research/unavailable.ts:13`
- Source text: “Research-response collection is not available in this release.”
- Why it fails: the route response is public behavior and should not expire with a release label.
- Direct replacement: “Research-response collection is not available.”
- Fact check: Yes.

### P0-19 — a public prototype route exposes an old milestone

- File: `components/home/world-stage-prototype/world-stage-prototype.tsx:60`
- Source text: “V17 prototype”
- Why it fails: an ordinary public route exposes an internal milestone and suggests an obsolete product state.
- Direct replacement: remove the label from public output; if the route is still needed for internal review, keep the status outside rendered copy.
- Fact check: Yes — confirm whether the route should remain publicly reachable.

### P0-20 — worldview-profile methodology exposes internal review records

- File: `components/worldview-profile/worldview-profile-page.tsx:86`, `components/worldview-profile/worldview-profile-page.tsx:260-275`; `lib/content/verified-case-library.ts:91`; `lib/reference-profiles/catalog.ts:204`
- Source text: “source-verified record” / “This page renders {x} of the {y} verified case records” / “V18 proposed library” / “approved V16 source pack”
- Why it fails: counts, milestone names, and source-pack labels describe the editorial implementation. Readers need the evidence rule and review date.
- Direct replacement: “Reviewed case” / “Only cases that explicitly name this profile as the best fit or strongest rival appear here.” / “Reviewed through {date}.”
- Fact check: Yes — verify the displayed coverage rule and review date.

## P1 — generated-sounding copy on high-payoff routes

### P1-01 — homepage promise stacks three abstractions

- File: `components/home/world-stage/world-stage-home.tsx:187-188`
- Source text: “Choose where to begin. Map your judgments, test them in context, or read the field.”
- Why it fails: “map,” “context,” and “field” are three metaphors before the reader learns what they can do.
- Direct replacement: “Choose a starting point. Answer the Foundation, work through a current decision, or compare the arguments behind the profiles.”
- Fact check: No.

### P1-02 — homepage Worldview Map entry uses flagged abstractions

- File: `lib/world-stage/scenes.ts:318-319`
- Source text: “Modeled positions” / “Browse nearby profiles, contextual movement, and the model’s limits.”
- Why it fails: both phrases hide the actors and comparison. “Contextual movement” sounds generated and suggests more measurement than the authored projection supports.
- Direct replacement: “Profiles and public postures” / “Compare your baseline with nearby worldview profiles, Perspective Runs, and reviewed public postures.”
- Fact check: No.

### P1-03 — AI landing copy repeats “map” and “layer” promises

- File: `app/ai/page.tsx:20-38`, `app/ai/page.tsx:123-126`
- Source text: “Map your instincts…” / “A structured read across eight axes” / “Want the deeper foreign-policy layer?” / “the deeper foreign-policy layer underneath it”
- Why it fails: it narrates the product architecture instead of the choices the questionnaire examines.
- Direct replacement: “Compare your judgments on frontier AI governance.” / “The result summarizes how you weigh risk, deployment, oversight, competition, openness, military use, legitimacy, and human futures.” / “Want to compare this with your wider foreign-policy judgments?”
- Fact check: No.

### P1-04 — Current Case instructs with a repeated product metaphor

- File: `components/current-case/current-case-app.tsx:340-344`
- Source text: “Each reading notices a different mechanism. Open the ones that help you pressure-test your first judgment.”
- Why it fails: “pressure-test” is repeated throughout the product and does not tell the reader what to compare.
- Direct replacement: “Each reading emphasizes a different cause and policy risk. Open any that challenge the reasons behind your first judgment.”
- Fact check: No.

### P1-05 — Europe Current Case uses a banned contrastive template

- File: `content/current-cases/europe-missile-defence-coalition-ukraine.json:17`
- Source text: “The case is consequential because it is no longer just about helping Ukraine survive the next wave of strikes. It is also about whether Europe can turn Ukrainian wartime demand into a scalable, interoperable, partly sovereign missile-defence architecture…”
- Why it fails: “consequential because” plus “no longer just…it is also” is a polished template. The concrete decision is stronger without the rhetorical staging.
- Direct replacement: “European governments now face two linked demands: supplying Ukraine against the next wave of strikes and building a missile-defence system that European forces can produce, integrate, and operate at scale.”
- Fact check: Yes — check the two-demand framing against the cited declarations and reporting.

### P1-06 — South China Sea Current Case uses the same template

- File: `content/current-cases/south-china-sea-award-at-ten.json:17`
- Source text: “The case is consequential because it is no longer about whether the award exists; that is settled. It is about whether repeated legal reaffirmation still matters…”
- Why it fails: the template delays the actual dispute and repeats the generated cadence used in another case.
- Direct replacement: “The award’s legal status is settled; its political force is not. Supporters must decide whether repeated public backing can shape conduct when enforcement remains indirect and selective.”
- Fact check: Yes — preserve the distinction between legal status and political effect.

### P1-07 — Foundation’s Analyst description uses internal jargon

- File: `components/quiz-app.tsx:264-266`, `components/quiz/review-screen.tsx:183-203`
- Source text: “more cross-pressure cases and actor-lens questions” / “it just gives the model more to work with”
- Why it fails: “cross-pressure,” “actor-lens,” and “gives the model more to work with” describe internal content types rather than the reader’s task.
- Direct replacement: “more scenarios that require tradeoffs and more questions asked from a defined actor’s position.” / “The scoring method is the same; Analyst mode adds more evidence from specific tradeoffs.”
- Fact check: Yes — confirm scoring parity between modes.

### P1-08 — low-differentiation result promises “the map” as the payoff

- File: `app/results/[payload]/page.tsx:291-294`
- Source text: “The reward is the map: which questions remain open when the scenarios get harder.”
- Why it fails: “reward” and “map” are generic product narration. The reader needs the substantive payoff of a mixed result.
- Direct replacement: “Your result identifies the tradeoffs that remain unsettled and the scenarios most likely to separate them.”
- Fact check: No.

### P1-09 — result copy repeats modeled-map and pressure-test language

- File: `app/results/[payload]/page.tsx:335-340`, `app/results/[payload]/page.tsx:453`
- Source text: “Closest modeled fit within the current map.” / “Pressure-test questions”
- Why it fails: the first phrase stacks model and map caveats; the second repeats a metaphor instead of naming the purpose of the questions.
- Direct replacement: “Closest fit among the four scored families.” / “Questions that could change this reading”
- Fact check: No.

### P1-10 — Profile empty state describes product architecture

- File: `components/profile/profile-dashboard.tsx:63-67`
- Source text: “Your Profile builds as you complete layers.” / “Focus Areas and AI Governance can sit beside the baseline without becoming one fake master score.”
- Why it fails: “builds,” “layers,” “sit beside,” and “fake master score” are product jargon and meta-criticism. They do not tell a new reader what the Profile retains.
- Direct replacement: “Your Profile begins with the Foundation.” / “Afterward, you can add Focus Area and AI results. Each remains separate so you can compare where your judgments agree or diverge.”
- Fact check: No.

### P1-11 — Profile overview is abstract and layer-heavy

- File: `components/profile/profile-report.tsx:170-173`
- Source text: “One read across the saved layers — what the profile keeps coming back to, where saved modules pull it, and any open tension worth holding onto.”
- Why it fails: “one read,” “layers,” “pull,” and “open tension” make the summary sound generated rather than analytical.
- Direct replacement: “Compare what stayed consistent across your saved results, where Security or Technology changed the emphasis, and which tradeoff remains unresolved.”
- Fact check: No.

### P1-12 — Profile evidence heading describes the data structure

- File: `components/profile/profile-report.tsx:204-207`
- Source text: “Evidence and saved layers” / “The worldview profile, AI layer, completed overlays, and Foundation anchors that this profile reads from.”
- Why it fails: the heading and lead enumerate internal containers without explaining what evidence the reader can inspect.
- Direct replacement: heading “Results behind this profile”; lead “Open your Foundation answers, completed Focus Areas, AI result, and the evidence used for each comparison.”
- Fact check: No.

### P1-13 — Perspective Runs repeat “contextual shift” as if it were a natural measure

- File: `components/perspectives/perspective-picker.tsx:77-81`, `components/perspectives/perspective-quiz.tsx:306-310`
- Source text: “A run produces a contextual shift” / “The result appears beside your baseline as a contextual shift.”
- Why it fails: the phrase is abstract and can imply a measured psychological change. The result is an authored comparison under a specified role.
- Direct replacement: “The result compares these role-based answers with your saved Foundation scores.”
- Fact check: No.

### P1-14 — AI result copy uses a banned “not X but Y” construction

- File: `lib/ai-governance-scoring.ts:108`
- Source text: “You think the key governance bottleneck is not abstract principle but practical state capacity…”
- Why it fails: “the key…not X but Y” is a banned contrastive template and overstates one result as the governing essence.
- Direct replacement: “You give greatest weight to practical state capacity: who can supervise, procure, verify, and adopt AI without becoming dependent.”
- Fact check: No.

## P2 — repetition, jargon, nominalization, metaphor overload, and weak headings

### P2-01 — About opens with “structured way” filler

- File: `app/about/page.tsx:16`
- Source text: “A structured way to examine foreign-policy judgment.”
- Why it fails: the heading could describe almost any generated assessment product.
- Direct replacement: “See which foreign-policy arguments you rely on—and where they conflict.”
- Fact check: No.

### P2-02 — Methods repeats “structured” instead of naming the method

- File: `app/method/page.tsx:101-117`
- Source text: “structured thought exercise” / “structured read of your answers”
- Why it fails: repeated nominalization makes the limitation less concrete.
- Direct replacement: “This editorial questionnaire compares your answers across seven foreign-policy tradeoffs.” / “The result summarizes those answers; it is not a scientific diagnosis or a measure of expertise.”
- Fact check: No.

### P2-03 — Methods uses a flagged rhetorical opener

- File: `app/method/page.tsx:343-344`
- Source text: “This matters because jargon-heavy wording can accidentally test training rather than instinct.”
- Why it fails: “This matters because” is filler; the causal claim can stand directly.
- Direct replacement: “Jargon-heavy prompts can reward prior training instead of revealing the judgment the question is meant to test.”
- Fact check: No.

### P2-04 — Perspective methodology stacks authored abstractions

- File: `app/method/page.tsx:228-240`
- Source text: “applies authored signals” / “contextual overlays” / “editorial transforms” / “largest modeled movement”
- Why it fails: four internal terms make a short, authored comparison sound like a technical measurement system.
- Direct replacement: “Each answer adds a predefined change to one or more Foundation dimensions. The result compares the adjusted scores with the saved baseline and names the scenario responsible for the largest change.”
- Fact check: Yes — verify that this accurately describes the scoring function.

### P2-05 — “pressure-test” is overused across modules and results

- File: `app/modules/page.tsx:141`, `app/modules/page.tsx:153`, `components/modules/module-app.tsx:207`, `components/results/foundation-payoff-sections.tsx:19`, `lib/narrative/foundation.ts:174-249`, `lib/profile-helpers.ts:359-711`
- Source text: examples include “actor-lens pressure tests,” “Choose the focus area you want to pressure-test first,” “What to pressure-test,” and “The main pressure test…”
- Why it fails: the metaphor is doing several jobs—choose, compare, challenge, and reconsider—so it no longer carries a precise meaning.
- Direct replacement: reserve “test” for a named assumption. Elsewhere use “compare in Security,” “reconsider after Technology,” “question this result,” or “next issue to examine,” according to the action.
- Fact check: No.

### P2-06 — Profile narrative repeats layer and texture metaphors

- File: `lib/narrative/profile.ts:103-110`, `components/profile/profile-report.tsx:250-294`
- Source text: “saved modules layered in” / “add texture” / “across the layers you have completed” / “AI layer detail” / “connected layer”
- Why it fails: the repeated spatial metaphor hides which saved result agrees or disagrees with the Foundation.
- Direct replacement: name the result: “Even after the saved Focus Areas are included…” / “The saved Focus Areas add issue-specific differences…” / “AI result details.”
- Fact check: No.

### P2-07 — “ultimately” adds drama without information

- File: `lib/profile-helpers.ts:654`
- Source text: “more control-heavy terms than you ultimately endorse when choosing policy.”
- Why it fails: “ultimately” implies a narrative resolution that the sentence already states.
- Direct replacement: “more control-heavy terms than you endorse in your policy choices.”
- Fact check: No.

### P2-08 — worldview-profile domain copy repeats layers

- File: `components/worldview-profile/worldview-profile-page.tsx:191-215`
- Source text: “Domain results are saved as separate layers” / “add a separate governance layer” / “keep that contextual shift separate from your baseline”
- Why it fails: the section is about Security, Technology, AI, and Perspective results; “layer” needlessly abstracts all four.
- Direct replacement: “Domain results are saved separately and do not change the Foundation.” / “The AI Governance Compass adds a separate AI result.” / “Perspective Runs compare role-based answers with the Foundation without changing it.”
- Fact check: No.

### P2-09 — generic continuation headings repeat across routes

- File: `components/current-case/current-case-app.tsx:530`, `app/results/[payload]/page.tsx:469`, `app/explore/atlas/page.tsx:47`, `app/ai/atlas/page.tsx:172`
- Source text: “Where to go next” / “Where to go next” / “Continue exploring” / “Where this map sends you”
- Why it fails: these headings could appear in any AI-generated product and do not preview the available choice.
- Direct replacement: “Compare this judgment elsewhere” / “Read the result from another angle” / “Compare another profile or posture” / “Read the evidence behind an AI profile.”
- Fact check: No.

## Context reviewed and retained

These uses should not be treated as errors merely because the scanner finds the same word:

- **Worldview Map / map / projection:** precise when copy refers to the named route, plotted coordinates, axes, markers, or the documented seven-to-two-dimensional projection. Examples: `app/explore/atlas/page.tsx:19-41`, `components/field/field-explorer.tsx`, and `app/method/page.tsx:245-262`.
- **Layer:** precise in the Worldview Map control because readers can visibly turn datasets on and off. Keep “Layers,” “Active layers,” and “Choose one or two layers” in `components/field/layer-controls.tsx` and `components/field/field-explorer.tsx`.
- **Field:** precise for the academic field of international relations. “The whole field” can also be defensible when it literally means the full policy domain; review it for breadth, but do not replace it mechanically.
- **Actor lens:** a defined question type that asks which logic looks strongest from an actor’s strategic position. Keep it where the interface defines that task; replace it in promotional shorthand such as “more actor-lens questions.”
- **Modeled traditions / modeled dimensions:** precise in Methods and limitations when distinguishing the four scored families from under-modeled traditions. “Modeled positions” on the homepage is not precise because it does not tell the reader whose positions are shown.
- **Consequential:** precise in `lib/modules/technology.ts:774`, where it modifies “incidents” and distinguishes a reporting threshold. It is filler in “The case is consequential because…” because the next clause can state the consequence directly.
- **Version:** useful in invalid-link recovery when it explains that an old shared link may no longer open, for example `app/results/[payload]/page.tsx:110`. Do not mechanically remove those recovery explanations. Public sprint names, schema versions, and storage versions remain P0.
- **Source and case titles:** intentionally excluded. The audit reviews surrounding descriptions and annotations, not bibliographic names or quoted legal language.

## First rewrite pass order

1. Correct the AI count and remove public sprint/build/schema labels.
2. Simplify Privacy and Corrections to current behavior; move retired contracts and implementation controls to decision or release records.
3. Replace P1 copy on the homepage, Current Case, Foundation, results, Profile, AI, and Perspective Runs.
4. Consolidate “pressure-test” and layer/lens/map metaphors only after the high-priority replacements establish a clearer vocabulary.
5. Re-run the scanner, then fact-check every replacement marked “Yes” against the production build and cited case sources.
