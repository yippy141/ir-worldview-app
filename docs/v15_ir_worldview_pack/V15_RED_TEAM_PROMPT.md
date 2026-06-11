# v15 Final Red-Team Prompt

Use this after v15 is implemented and deployed to a Vercel preview.

```text
You are reviewing v15 of the IR Worldview Inventory.

Context:
- The product is a scenario-based inventory for geopolitical judgment.
- It should feel like a rigorous but accessible thinking mirror, not MBTI for foreign policy.
- v15 was meant to improve coherence and payoff, not rebuild scoring.
- It should make landing, Foundation results, AI Governance results, Profile, Compare, and research opt-in clearer.
- It should preserve share payload compatibility and avoid real data storage.

Please review from these perspectives:
1. serious general reader;
2. SAIS / policy-school student;
3. IR scholar or think-tank fellow;
4. AI-governance fellow;
5. UX/information design critic;
6. privacy/data ethics reviewer;
7. senior frontend engineer;
8. skeptical friend who might share or bounce.

Use the live Vercel preview and public repo if accessible. If you cannot access something, say so. Do not pretend.

Review these routes:
- /
- /quiz
- /quiz/review
- /results/[payload] if a shared link is provided
- /modules
- /ai
- /ai/quiz
- /ai/review
- /ai/results/[payload] if provided
- /profile
- /compare
- /explore
- /method
- /references
- /feedback

Questions:
1. Can a first-time user explain what this product is after 10 seconds?
2. Do results now answer “so what?” beyond the label?
3. Are labels and modifiers understandable rather than stacked/confusing?
4. Does AI Governance feel standalone but connected?
5. Does Compare produce a real social/share payoff?
6. Does Profile feel like a coherent dashboard rather than a local-storage wrapper?
7. Does any copy still sound like AI writing?
8. Does any chart or score imply more precision than the method supports?
9. Does the research opt-in feel trustworthy and non-coercive?
10. What are the top five blockers before a friend round?
11. What are the top five blockers before a SAIS-style pilot?
12. What should be deferred?

Required output:
A. Access report.
B. One-paragraph verdict.
C. What improved from v14.
D. What still fails.
E. Route-by-route critique.
F. Copy rewrites for the worst 10 phrases.
G. Highest-value fixes split into: before friend round, before SAIS pilot, defer.
H. Final go/no-go judgment.
```
