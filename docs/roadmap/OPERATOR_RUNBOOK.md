# V23.5 Operator Runbook

Audience: repository owner and novice release operator
Scope: dispatch, review, merge, preview, deploy, verify, and rollback
Rule: stop when evidence and authority disagree

## 1. What the operator owns

The operator decides what task runs, which exact commit it starts from, what model and data class it may use, whether evidence satisfies acceptance, and whether a patch merges. A coding model may implement a bounded contract. It does not change product behavior, methodology, public copy, design authority, privacy, dependencies, or compatibility boundaries without owner approval.

No worker commits, pushes, merges, deploys, deletes, messages external people, or changes provider settings unless its task contract grants that exact action.

## 2. Before any work

Open the repository in a terminal:

```bash
cd /Users/jinhuayip/Developer/ir-worldview-app-clean
git status --short --branch
git branch --show-current
git rev-parse HEAD
git rev-parse origin/main
git log -1 --format='%H %P %s'
```

Expected questions:

1. Is this the intended repository and worktree?
2. Is the branch the one the task names?
3. Is the worktree clean, or are the displayed changes intentional and owned?
4. Does `HEAD` equal the task's base commit?
5. Has another lane been assigned any of the same files?
6. Does the task's provider permit its data class?

Stop on a mismatch. Do not use reset, checkout, clean, or stash to make the warning disappear. First identify who owns the change.

Retrieve the current production deployment commit from Vercel project metadata or its build log. Do not infer it from page copy. Record the deployment ID and SHA in the task record.

## 3. Choose the work tier

| Tier | Use | Model boundary |
| --- | --- | --- |
| T0 | Product direction, methodology, scoring, public copy, design authority, privacy, security, schema, dependency | Owner or frontier model advice, owner decides |
| T1 | Bounded implementation that needs ordinary engineering judgment | Strong coding model in isolated worktree |
| T2 | Mechanical patch with exact files, example, oracle, and small diff | Graduated cheaper model, manual approval |
| T3 | Search, inventory, comparison, test diagnosis, evidence collection | Read-only scout |

Public copy and design decisions remain T0 even when the file edit is easy. A cheaper model may classify or route copy but cannot rewrite or approve it.

## 4. Classify the data

| Class | Examples | Provider rule |
| --- | --- | --- |
| Green | Public repository, public sources, synthetic fixtures | Eligible for approved pilot providers |
| Amber | Unpublished research, roadmaps, personal code, application material | Minimum necessary context and specifically approved provider |
| Red | Credentials, `.env`, client work, proprietary folders, patent or licence material, customer data, personal financial or legal data | No cheap external cloud model |

If a file crosses classes, apply the stricter class. A local repository dump is not safe merely because it already exists on the machine.

## 5. Build the context packet

Send the smallest packet that lets the worker act correctly:

1. complete active task contract;
2. exact base branch and SHA;
3. required authority files or exact relevant sections;
4. allowed and forbidden paths;
5. one worked example where the behavior could be misunderstood;
6. deterministic acceptance tests;
7. before evidence for visual work;
8. data class and provider;
9. diff, time, and spend budgets;
10. mandatory stop conditions.

Do not paste repository dumps. `STATE.md` may orient the worker, but the worker must print current Git facts independently.

## 6. Create an isolated write lane

Use an isolated worktree for each builder. Read-only scouts may inspect the main worktree.

First list existing lanes:

```bash
git worktree list
git branch --list 'codex/*'
```

Choose a narrow branch name such as `codex/v23-5-current-case-integrity`. Choose a new sibling directory that does not exist. Then create the lane from the verified base commit:

```bash
git worktree add -b codex/v23-5-current-case-integrity /Users/jinhuayip/Developer/ir-worldview-v23-5-current-case BASE_COMMIT
```

Replace `BASE_COMMIT` with the full verified SHA before running the command. Never use a shell variable, wildcard, home shortcut, or broad directory for a worktree target.

Inside the new worktree, repeat the Git precheck. If dependency installation would change the lockfile, stop. A worker may use the shared package cache, but V23.5 does not authorize dependency changes.

## 7. Dispatch one task

Copy one complete prompt from `V23_5_IMPLEMENTATION_PROMPT_PACK.md`. Fill every dispatch token. Read the final prompt once from top to bottom.

Check:

- one goal and explicit non-goals;
- exact path boundary;
- exact base commit;
- locked behavior and compatibility;
- deterministic tests;
- manual or visual checks;
- data and provider boundary;
- diff, time, and spend limits;
- stop conditions;
- handoff evidence and rollback boundary.

Initial portfolio concurrency is at most three read-only scouts and two write lanes. IR V23.5 should normally use one write lane because the four hotfix PRs are sequential and touch shared UI files.

## 8. While the worker runs

Ask for concise updates at these points:

1. precheck complete;
2. implementation shape chosen;
3. task-specific tests pass;
4. full gate complete;
5. handoff ready.

Intervene when the worker:

- opens a forbidden path;
- proposes a dependency;
- changes public behavior outside the contract;
- edits a bank, scorer, payload, checksum, or version tuple;
- chooses copy or design without owner approval;
- hides a test failure;
- exceeds its budget without stopping;
- asks for Red data or a repository dump.

Do not expand a task in place because the worker noticed another defect. Record a follow-up issue with evidence.

## 9. Review the patch

Return to the builder worktree and inspect:

```bash
git status --short --branch
git diff --stat BASE_COMMIT
git diff --check
git diff BASE_COMMIT --
```

Replace `BASE_COMMIT` before running the commands.

Review in this order:

1. Scope: only allowed paths and requested behavior.
2. Trust: no misleading copy, hidden loss, or fake precision.
3. Compatibility: no issued tuple, payload, route, ID, checksum, or locale boundary changed.
4. Tests: task-specific failure would have been caught before the patch.
5. Accessibility: semantics, focus, targets, contrast, motion, and reflow.
6. Visual identity: Astrolabe remains intact.
7. Maintainability: typed contracts, no duplicated source of truth, no temp imports.
8. Diff quality: smallest coherent change, no unrelated cleanup.

For visual work, compare before and after at 320, 390, 768, and 1440. For copy, read complete runtime paragraphs. For state, walk cancel, confirm, reload, back, and invalid-record paths.

An independent read-only reviewer should inspect the final diff and acceptance evidence without being shown the builder's preferred conclusion first.

## 10. Run the gates

Use task-specific tests first. Then run:

```bash
npm run typecheck
npm run validate
npm run copy:audit:strict
npm run lint
npm run test
npm run build
```

Before release, also run:

```bash
npm run evidence:audit:check
CI=1 npm run test:e2e
git diff --check
```

Record duration because the full test suite may take more than 25 minutes. A timeout is not a pass. Resume or rerun with enough time and preserve the output.

If a command fails:

1. stop merge work;
2. save the command, exit status, and relevant output;
3. decide whether failure reproduces on the exact base commit;
4. fix it only if it is caused by and within the task;
5. otherwise return a blocked handoff and open a separate issue.

## 11. Accept and commit

Only the owner or authorized operator accepts a patch. Before commit, confirm:

- independent review complete;
- all required gates pass;
- manual and visual evidence attached;
- no forbidden files or secrets appear;
- the final diff remains within budget;
- the rollback boundary is clear.

Stage only the reviewed files by explicit path. Inspect the staged diff before committing:

```bash
git diff --cached --stat
git diff --cached --check
git diff --cached
```

Use a specific commit subject, for example:

```text
V23.5: derive homepage state from reviewed cases
```

Record the commit SHA in the task handoff. Do not combine two subsystems into one commit to save time.

## 12. Preview

Push the reviewed branch only after the commit is accepted. Use the project's normal Vercel preview integration.

Record:

- branch and commit;
- preview deployment ID and URL;
- source commit shown in Vercel;
- environment differences from production;
- required route and fixture checks;
- reviewer and time.

Do not treat a successful build as a product pass. Run the relevant rows of `RELEASE_TEST_MATRIX.md` against the preview.

If Vercel cannot show the source commit, stop. Do not deploy that artifact to production.

## 13. Merge one lane

Merge only one reviewed PR at a time. After merge:

1. update local `main` by fast-forward from the trusted upstream;
2. print local and upstream SHAs;
3. run the integration gate on `main`;
4. record the accepted merge SHA;
5. fill that SHA as the next task's base;
6. verify production has not moved unexpectedly.

Do not start the next overlapping write lane before this checkpoint.

## 14. Production deployment

Production deploys from reconciled `main` only.

Before deploy:

- release matrix complete;
- no critical research issue open;
- owner approves preview;
- exact `main` SHA recorded;
- last known-good production SHA recorded;
- rollback path confirmed.

After deploy, retrieve the Vercel deployment record and confirm its source commit exactly matches the reviewed `main` SHA.

Run production smoke:

- homepage in active or inactive state as expected;
- Foundation quiz and one valid plus invalid result;
- one current and one legacy module result;
- AI v3 result;
- empty or populated Profile without exposing personal data;
- Cases and `/current`;
- Method and Feedback;
- one supported Chinese route;
- map fallback with current production configuration.

Record the production deployment ID, SHA, time, operator, and smoke outcome in `BASELINE_AND_DECISIONS.md` or a dated release record.

## 15. Rollback

Rollback immediately when:

- production SHA cannot be tied to reviewed source;
- a required route breaks;
- a destructive action loses work;
- a scorer or payload result changes;
- unsupported locale content appears;
- a materially misleading interpretation ships;
- a privacy or serious accessibility issue appears.

V23.5 has no data migration. Rollback is code-only.

Procedure:

1. stop further merges and deployments;
2. record the production deployment ID, observed failure, route, fixture, time, and screenshot or log;
3. identify the last known-good reviewed SHA;
4. revert the single offending PR through the normal Git review flow, or redeploy the known-good artifact if the hosting workflow supports it;
5. verify that the rollback deployment source equals the intended SHA;
6. run the production smoke matrix;
7. open an incident record and do not reattempt until cause and acceptance coverage are clear.

Do not delete local storage, cohort tables, Git history, branches, or worktrees as part of incident rollback.

## 16. Production incident checklist

- [ ] Stop deploys and merges.
- [ ] Record UTC and local time.
- [ ] Record route, fixture, locale, viewport, browser, and user-visible effect.
- [ ] Record production deployment ID and exact source SHA.
- [ ] Check whether preview at the same SHA reproduces the issue.
- [ ] Check whether last known-good production reproduces it.
- [ ] Assess privacy, security, compatibility, accessibility, and interpretation severity.
- [ ] Choose rollback before forward-fix when user work or result meaning is at risk.
- [ ] Verify rollback source and smoke routes.
- [ ] Record root cause, missed gate, corrective test, and owner decision.
- [ ] Resume only after independent review.

## 17. Worktree cleanup

Cleanup is not part of implementation. Do it only after merge, production verification, and a clean worktree audit.

First inspect:

```bash
git worktree list
git status --short --branch
git branch --merged main
```

Confirm the exact worktree path, its clean state, and that its branch is merged. Then use Git's worktree removal command for that exact path. Never delete the directory manually. Never use a wildcard, recursive shell deletion, home shortcut, or repository root.

Delete a merged branch only after the worktree is removed and the commit is reachable from accepted `main`. Preserve any lane with uncommitted work or uncertain ownership.

## 18. End-of-task record

Every accepted task leaves:

- task ID and contract version;
- base and accepted SHAs;
- changed paths;
- behavior and non-goals;
- automated results and duration;
- manual, visual, accessibility, and bundle evidence;
- reviewer decision;
- preview and production IDs if deployed;
- rollback boundary;
- follow-up issues outside scope;
- owner decision still required.

Update `STATE.md` only after the accepted SHA is fully gated. Keep it short and reproducible.
