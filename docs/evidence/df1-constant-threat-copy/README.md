# df1: coalition change with the external threat held constant

Owner-authorized copy revision, 10 September 2026. PR53 merged at `bb3f93b20c772f55774ecb0699a1def7feecf02e` on 9 September; fetched main was that same commit. This candidate starts there on `release/df1-constant-threat-copy`. The [original finding](../batch-b-reading-and-localization/semantic-dispositions.json) retains its original date and disposition, with a subsequent-resolution link here.

The proposition concerns whether a new governing coalition **often** redirects foreign policy **while the external threat remains unchanged**. It does not compare the magnitude of domestic and external influences. The owner resolved this previously ambiguous meaning choice. Textual alignment establishes neither the proposition's causal truth nor construct validity, reliability, response equivalence or cross-language validation. No punctuation or idiomatic adjustments were made to the authorized wording.

## Exact wording and versions

| Administration | Prompt | Clarification |
| --- | --- | --- |
| English 1 (preserved) | A new governing coalition often redirects foreign policy even when the external threat remains unchanged. | Can elections, leadership changes, and domestic coalitions shift foreign policy as much as events abroad? |
| English **2** (new default) | A new governing coalition often redirects foreign policy even when the external threat remains unchanged. | Does a new governing coalition often change foreign policy even without a change in the external threat? |
| Chinese 1 and 2 (preserved df1) | 执政者及其问责对象的变化，对外交政策的影响往往不亚于外部威胁。 | 选举、领导层更替和国内政治联盟，能否像外部事态一样推动外交政策转向？ |
| Chinese **3** (new default) | 即使外部威胁保持不变，新的执政联盟也常会使外交政策转向。 | 外部威胁没有变化时，执政联盟的更替是否仍经常促使外交政策转向？ |

[Exact fixtures](copy-fixtures.json) preserve all five revisions. Chinese 2 retains its nine Batch B corrections; Chinese 3 layers only df1 on top. All item/option IDs, signals, ordering, other fields and the English prompt stay fixed. Issued English `content/instrument/foundation.v2.json` SHA-256 remains `1d47666272d54557313d89ccd437497bda685bac63f814044afff833f114e0e6`. df1 remains a direct, non-reversed core Likert input to `domesticFilters`, weight 1. No scoring or form revision is needed for this copy-only change; this does not mean the old and new response tasks are empirically interchangeable.

## Dispatch and compatibility

A small shared Foundation supported-copy definition covers en 1/2 and zh-Hans 1/2/3. The English display accessor applies its override separately from the immutable issued-bank accessor; the Chinese display accessor layers the selected revision. Quiz, real clarification controls, review, carried-core repair and saved evidence explicitly use the draft's binding. Calling the new display accessor without a version selects current copy; historical `quiz-schema` accessors remain bank copy 1. Tests check both defaults and explicit dispatch.

An empty new draft binds en2 or zh3. Known older drafts retain their recorded wording through edit, reload, review and extension. df1 belongs to Core14, carried into baseline56, historical68 and all six targeted pairs (Realist–Liberal, Realist–Constructivist, Realist–Critical, Liberal–Constructivist, Liberal–Critical, Constructivist–Critical). Starting an extension does not upgrade already answered core wording. Historic mode accessors remain available.

Answered unbound/unknown drafts continue with legacy wording and complete as copy0. They cannot create answer-wording evidence or qualify for automatic history comparison, including 0/0. Unsupported future revisions are withheld. A language mismatch offers return to the bound language or an explicit confirmed restart; cancelling keeps the draft. Restart leaves the existing saved profile intact. No exposure history is inferred from completion language.

Share wrappers accept supported historical/new copies and preserve unknown0; the issued payload shape and codec are untouched. Result links retain their recorded provenance, scores and identities. Evidence lookup reads saved wording with exact binding rather than regenerating it from current defaults; unknown/future or mismatched bindings remain unavailable. Matching known revisions is only metadata eligibility, not empirical comparability. Languages and revisions remain separate. Existing history deduplication and copy0 safeguards are untouched.

Two historical synthetic fixture generators had inherited the current default. They are pinned to their original Foundation copies: result-payoff en1; v23-6 en1/zh2. This preserves their pre-revision payload/evidence meaning; their answers, scoring and historical artifacts were not regenerated.

## Verification and scope

Execution results and the implementation commit are recorded in [verification.json](verification.json). Synthetic unit fixtures check exact fields, all supported forms, supported/unknown/future dispatch, score/identity preservation and evidence binding. Browser tests use actual help buttons, review/edit/reload, missing-core repair, result completion and real extension entry for every copy revision. New administrations start empty; preserved revisions start with bound synthetic answers. Synthetic setup occurs away from the quiz to avoid racing autosave; navigation waits precede reload.

Only two new screenshots are retained and visually inspected: [English copy2, 1440×900](screenshots/en-copy-2-clarification.png) and [Chinese copy3, 390×844](screenshots/zh-Hans-copy-3-clarification.png). Both show the actual expanded clarification, with readable wrapping and unchanged controls. Broader regression captures are test output, not a new visual audit. WebKit automation is not native Safari or a physical-device check. No human bilingual equivalence, source re-verification or retention claim is made.

Authorized runtime scope: two local copy override files; shared supported-copy/default declaration; English/Chinese display dispatch; draft parsing/types; copy-share wrapper; quiz/review consumers; exact-version local-evidence generation/lookup. The active evidence summary is regenerated by the existing audit; its two new prevalence-language advisories reflect the deliberately preserved frequency claim, not measured prevalence. The audit algorithm/baseline is unchanged.

Protected: issued English and historical Chinese copy files, banks/scorers/calibrations, canonical identities/marks, share codec/payload schema, storage keys and existing stored records, history safeguard/deduplication, APIs, collection/telemetry settings, dependencies/lockfile, public reading layouts, root and PR52 repairs. No collection, backend activation, migration of saved results, merge or manual deployment is performed.
