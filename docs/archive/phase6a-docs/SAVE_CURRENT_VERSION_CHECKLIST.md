# Save the current Phase 5M.1 version before Phase 6A

This checklist is for preserving the current build so you can still view it later on GitHub and Vercel.

## Goal

Preserve the current state in three places:
1. the current Git branch
2. a Git tag / GitHub release point
3. a Vercel preview deployment URL you can keep referencing

## Terminal steps

From the repo root:

```bash
cd ~/Code/ir-worldview-app-clean
git branch --show-current
git status
npm run lint
npm run test
npm run build
```

Only continue if the branch is the one you want to preserve and the working tree is clean.

Push the current branch:

```bash
git push origin <CURRENT_BRANCH_NAME>
```

Create an annotated tag:

```bash
git tag -a v0.5m1-prototype -m "Phase 5M.1 prototype snapshot before Phase 6A"
git push origin v0.5m1-prototype
```

Optional but recommended: create a GitHub Release from that tag in the GitHub UI.

## Vercel steps

1. Open the correct Vercel project.
2. Go to **Deployments**.
3. Filter by the current preserved branch.
4. Open the newest successful preview deployment.
5. Copy the generated deployment URL into your notes.
6. If the deployment is protected, create a shareable link or make sure you have a way to access it again later.
7. Save that URL in a note or text file.

## Optional local note

Create a local note file with:
- branch name
- tag name
- commit SHA
- Vercel preview URL
- date
- short description of what this version contains

Example:

```text
Branch: phase-5m1-layout-copy-module-depth
Tag: v0.5m1-prototype
Commit: <SHA>
Vercel preview: <URL>
Saved on: <DATE>
Notes: latest pre-integration version before Phase 6A
```
