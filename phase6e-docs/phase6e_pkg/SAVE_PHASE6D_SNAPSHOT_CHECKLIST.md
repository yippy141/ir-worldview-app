# Save current Phase 6D snapshot

Before starting Phase 6E:

1. Make sure the current branch is the one containing the latest 6D work.
2. Make sure `npm run lint`, `npm run test`, and `npm run build` all pass.
3. Commit all current 6D changes.
4. Push the branch.
5. Create and push a tag:
   - `v0.6d-prototype`
6. Optional but recommended:
   - note the latest preview deployment URL in Vercel
   - write down the current branch name in a text note

Recommended commands:

```bash
cd ~/Code/ir-worldview-app-clean
git branch --show-current
git status
npm run lint
npm run test
npm run build
git add -A
git commit -m "phase 6d snapshot before phase 6e"
git push
git tag -a v0.6d-prototype -m "Phase 6D prototype snapshot before Phase 6E"
git push origin v0.6d-prototype
```
