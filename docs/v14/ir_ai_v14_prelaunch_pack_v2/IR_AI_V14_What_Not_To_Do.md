# V14 what not to do

## Do not reopen the whole product
The shell is good enough. Do not run another homepage/IA redesign sprint. The landing page rewrite in V14 is scoped to the hero and sample preview only.

## Do not add modules
No Development, Climate, Finance, China, Middle East, or Africa module in V14. Those will matter later, but they will multiply synthesis problems before the core result loop is strong.

## Do not deepen Analyst mode
Analyst mode is not the problem. Standard completion and result payoff are the problem.

## Do not make Profile a dashboard
Profile should not become a data cockpit. It should show the integrated read, saved layers, and a next action.

## Do not overbuild analytics
Do not build accounts, dashboards, cohort pages, or admin interfaces. Keep V13's first-party opt-in research layer small.

## Do not call pseudonymous research data anonymous
If a durable respondent ID exists, call it pseudonymous or de-identified.

## Do not chase a generic viral product
The goal is not to become 16personalities. The goal is a serious editorial interactive with enough shareability to circulate in policy, IR, and AI governance networks.

## Do not split the codebase
AI can be a standalone entry point without becoming a separate repo or product shell.

## Do not let agents modify scoring casually
No scoring changes unless a prompt explicitly asks for them and tests are updated.

## Do not share broadly if typecheck fails
If `npx tsc --noEmit` fails and `ignoreBuildErrors` is still masking errors, do not present the repo as a serious engineering portfolio artifact.

## Do not attempt dynamic OG images in V14
Dynamic per-result OG images using ImageResponse are deferred to V14.1. The fixed-viewport, no-CSS-variable, limited-font constraints of the JSX-to-PNG pipeline will compromise the browser result card if you try to design both simultaneously. Get the browser card right first. Clone it into OG format afterward.

## Do not show a family label in the midpoint preview
The midpoint preview after question 7 shows dimension pulls only. Showing a tentative family label would anchor the user's expectations and make the final result feel like a correction. Keep it to dimensions.

## Do not refactor quiz-app.tsx in V14
The 800-line component needs to be broken up, but not in this sprint. It is on the V15 deferred list. Changing the component structure while also adding section markers and transitions increases the risk of regression.
