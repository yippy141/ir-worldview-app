# Decision Record: v15 Coherence & Payoff Release

Date: 2026-06-09  
Branch: `feature/v15-coherence-payoff`  
Area: Product / UX / Engineering / Data / Methodology

## Context

The product has become structurally mature: Foundation, focus-area modules, AI Governance Compass, Profile, Atlas, Compare, Methods, and References now exist. The remaining problem is not a missing feature. It is that the product still asks users to do too much translation work before the payoff becomes clear.

Senior feedback says the profile/bucket results are confusing, the purpose of the site is not yet obvious, and some insights feel scattered or AI-written. Earlier red-team passes converge on the same issue: the result should synthesize for the reader, not hand them a taxonomy and make them interpret it.

## Decision

v15 will be a **coherence and payoff sprint**. It will leave scoring and payloads stable while improving the product frame, result hierarchy, comparison loop, and trust surface.

## Alternatives considered

1. **Full methodology/scoring overhaul.** Rejected for v15. This is important later, especially valence auditing, but it would delay the product payoff sprint and risk breaking share compatibility.
2. **Visual redesign first.** Rejected. A prettier page with the same confusing hierarchy will still confuse users.
3. **AI Governance spinout first.** Deferred unless job-hunt timing forces it. AI Governance should be made stronger in v15, but the site’s shared result architecture needs the same fix.
4. **New modules or scenario game prototype.** Deferred. These are promising but would expand scope before the current product pays off.

## Why this decision

The release targets the core user problem: “I got a label; now what?” It is also safer for a novice/agent-assisted workflow because it avoids scoring rewrites and payload migrations.

## Risks

- Result sections may become too long if the new payoff blocks are not aggressively edited.
- Agent changes may drift into scoring or payload files unless the prompts are strict.
- Current-event lens copy may sound generic if it is not tied to the user’s actual strongest dimensions.
- Analyst mode still cannot get a fully answer-specific payoff without either raw local answer reconstruction or a payload migration.

## Follow-ups

After v15:

1. Run a structural valence audit of Foundation Likert questions.
2. Consider a v3 payload migration only if analyst-mode result depth needs local/answer-specific evidence.
3. Build real research storage only after consent, deletion, and privacy architecture are explicit.
4. Revisit AI Compass spinout and methodology post based on job-hunt timing.
