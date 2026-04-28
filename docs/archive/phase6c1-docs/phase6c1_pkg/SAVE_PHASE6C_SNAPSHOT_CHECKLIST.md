# Save Current Phase 6C Snapshot Checklist

Before starting Phase 6C.1:

- [ ] Confirm you are on the Phase 6C branch
- [ ] `git status` is understood
- [ ] `npm run lint` passes
- [ ] `npm run test` passes
- [ ] `npm run build` passes
- [ ] Commit current 6C work
- [ ] Push the Phase 6C branch to GitHub
- [ ] Create and push a git tag for the 6C snapshot
- [ ] Copy the latest preview URL into a note if you want to keep viewing the exact version later

Suggested commands:

```bash
cd ~/Code/ir-worldview-app-clean
git branch --show-current
git status
npm run lint
npm run test
npm run build
git add -A
git commit -m "phase 6c atlas lite and payoff pass"
git push -u origin phase-6c-content-and-payoff
git tag -a v0.6c-prototype -m "Phase 6C prototype snapshot before Phase 6C.1"
git push origin v0.6c-prototype
```
