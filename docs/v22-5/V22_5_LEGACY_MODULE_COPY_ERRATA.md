# V22.5 legacy module copy errata

Date: 2026-08-11  
Correction history: `60dcd5543683900ea5cef4b282cc4d8a29fdc249`
made the initial description and summary corrections on 2026-08-10;
`7288192bf63bf604163a302a4f075cbb57284884` made the final copy-only correction
on 2026-08-11. The full two-commit correction range is
`9e7761797a0dbc204d39b78832deb4de0d1e9e45..7288192bf63bf604163a302a4f075cbb57284884`;
the final follow-up delta alone is
`60dcd5543683900ea5cef4b282cc4d8a29fdc249..7288192bf63bf604163a302a4f075cbb57284884`.
In the current branch ancestry, the original fallback prevalence wording was
introduced in `1fd4c8659fb8c4d81b27989e234de2c3c3b8a0be` and carried into the
frozen V21 definitions in `402dcd72e0bfb88a0be6b64b0338c26d92a9ccb6`.

## Scope and affected versions

This erratum applies only to the English reader-facing description and fallback
result summary in the frozen V21 Security and Technology module definitions:

- module bank version `2`;
- module scoring version `1`;
- module runtime version `1`;
- persisted English module copy version `1`; and
- older records without explicit locale-copy provenance, which normalize to
  legacy English copy version `0`.

The bank/scoring tuple selects the frozen definition when an old result link is
decoded. Locale-copy provenance describes a saved record; it does not select a
different scorer or rewrite an already saved snapshot.

## Security: original and replacement pairs

### Description

Original:

> Most cases start from familiar security debates about deterrence, alliances,
> escalation, and legitimacy. A smaller set of pressure tests shifts to
> exposed partners, rival powers, and nonaligned states when the vantage point
> changes the strategic read.

Replacement:

> The cases start from familiar security debates about deterrence, alliances,
> escalation, and legitimacy. A separate set of pressure tests shifts to
> exposed partners, rival powers, and nonaligned states when the vantage point
> changes the strategic read.

### Fallback summary

Original:

> Your answers sit between deterrence, alliance management, and legitimacy
> without any one of them pulling clear. On the current question set most
> answer patterns land here, so treat this as an unsettled position and read
> the lane meters for the detail.

Interim replacement in `60dcd554`:

> Your answers sit between deterrence, alliance management, and legitimacy
> without any one of them pulling clear. The current question set did not
> separate these lanes enough to support a single leader, so treat this as an
> unsettled position and read the lane meters for the detail.

Final replacement in `7288192`:

> Your answers sit between deterrence, alliance management, and legitimacy
> without any one of them pulling clear. Your answers did not separate these
> lanes enough to support a single leader, so treat this as an unsettled
> position and read the lane meters for the detail.

## Technology: original and replacement pairs

### Description

Original:

> Most cases start from familiar debates about chokepoints, industrial policy,
> AI governance, and strategic dependence. A smaller set of pressure tests
> shifts to sanctioned, middle-power, and nonaligned perspectives when the
> vantage point changes the policy read.

Replacement:

> The cases start from familiar debates about chokepoints, industrial policy,
> AI governance, and strategic dependence. A separate set of pressure tests
> shifts to sanctioned, middle-power, and nonaligned perspectives when the
> vantage point changes the policy read.

### Fallback summary

Original:

> Your answers sit between control, capacity-building, and coordinated rules
> without any one of them pulling clear. On the current question set most
> answer patterns land here, so treat this as an unsettled position and read
> the lane meters for the detail.

Interim replacement in `60dcd554`:

> Your answers sit between control, capacity-building, and coordinated rules
> without any one of them pulling clear. The current question set did not
> separate these tools enough to support a single leader, so treat this as an
> unsettled position and read the lane meters for the detail.

Final replacement in `7288192`:

> Your answers sit between control, capacity-building, and coordinated rules
> without any one of them pulling clear. Your answers did not separate these
> tools enough to support a single leader, so treat this as an unsettled
> position and read the lane meters for the detail.

## Reason for the correction

“Most cases,” “a smaller set,” and “most answer patterns land here” were
prevalence claims. The description did not state the effective option-set
counts behind its relative case-frequency claim. No named respondent sample,
population distribution, or approved aggregate cohort supported the result
claim. The 2026-08-10 replacements removed those frequency claims, but the
interim summary attributed a measurement conclusion to the question set. The
final wording confines that statement to the decoded respondent's answers and
makes no population or instrument-performance claim.

This is a copy-only erratum. It does not change scores, scorer logic,
thresholds, classifications, item signals, answer handling, payload schemas,
encoded identities, or the historical decode path. Existing V21 payloads still
resolve to bank version `2`, scoring version `1`, and the V1 runtime. An old link
that reaches the fallback classification now renders the corrected summary;
its scores and classification are unchanged. Saved snapshots that already
contain rendered historical prose are not migrated.

The checked-in golden fixture
`tests/fixtures/v21-module-copy-golden.json` pins both descriptions and all
original, interim, and final copy states. The compatibility test also requires
the erratum to contain those exact strings, so changing frozen V21 copy
requires a deliberate fixture and erratum update.
