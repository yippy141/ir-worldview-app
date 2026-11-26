# Current project state

## PR 66, November 26

The release candidate builds on the [previously tested PR head](https://github.com/yippy141/ir-worldview-app/commit/6f28274b1086f36fb79bb0324a8b5bbe020611de). Packages A and B are complete. This pass edits the English reader journey, keeps answer evidence bound to the completed form, and repairs a conflict between the family match and the restraint score in the result, Profile and sharing. Foundation and AI Governance remain open. [Current PR](https://github.com/yippy141/ir-worldview-app/pull/66) · [Checks on the candidate](https://github.com/yippy141/ir-worldview-app/pull/66/checks)

Both issue questionnaires reached their owner-review deadline on November 21. The candidate applies their existing withdrawal decisions. New Security and Technology completions are closed. Historical results, drafts and registered scorers remain available. Reopening requires a separate dated decision for each tuple and its allowed modes. [Withdrawal and evidence](MODULE_BETA_WITHDRAWAL.md)

## Production provenance and search indexing

On November 26 the public domain served the same eleven homepage script URLs as the recorded October 29 Production deployment of [da875d3](https://github.com/yippy141/ir-worldview-app/commit/da875d34ec7d0791e1cbfb2737e047a30c3a5053). That lockfile contains Next.js 16.2.11. The production-only npm audit reported one critical, four high and one moderate package entry. The application uses ImageResponse, one of the APIs named in the [Next.js advisory](https://github.com/advisories/GHSA-vcvr-r3jv-pc5j). The release candidate uses 16.4.6 and its production-only audit reported zero. Its full tree still has twelve high-severity development-tool entries. These are registry and source findings. Deployment and remediation on the public domain need an owner release decision.

English and Chinese Foundation result probes on the public domain returned no explicit noindex instruction. The preview host’s deployment-level header alone cannot establish production behavior. The candidate sends X-Robots-Tag on personalized result, shared Profile and case-challenge routes, including Chinese variants, and the Foundation card endpoint. This requests exclusion from search. A recipient can still open or forward a link.

## Read the experience

- Start on the home page. Choose Foundation, answer one question, leave and return. Review the answers before generating a result. The [editorial passages](../review/after-passages-nov26.md) follow this journey through sharing and the historical Brazil case.
- For the mixed example use 5, 6, 7, 6, 6, 3, 5, 3, 7, 2, 6, 6, 2, 5 in displayed order. The markets score is 6.5 and the restraint score is 4. The economic tradition leads and the posture remains unresolved. Compare the local evidence with a fresh recipient window. Inspect the share card.
- Open the Security or Technology entrance and an earlier result link. The first explains the pause. The second decodes using its issued version. Check data use and opt-out in Privacy.
- Open the Brazil brief. Read the trade minister’s estimate in the context of the July 17 evidence cutoff, then open its source. Library introductions explain how the authors’ arguments relate to the scores.

## Founder decisions

Review the [14 wording candidates](FOUNDATION_CORE_CANDIDATES.md) before any administration. Three proposals change what respondents are judging. Keep the ceasefire alternatives unscored pending a separate decision. The standalone Ismograph design study and device screenshots are in the founder receipt outside the repository. Public branding remains IR Worldview Inventory. Production release is a separate owner action.

The exact tested candidate SHA, preview and final gate outcomes belong in the handoff receipt. Participant materials stay outside this repository. [Verification and release procedure](KICKOFF.md)
