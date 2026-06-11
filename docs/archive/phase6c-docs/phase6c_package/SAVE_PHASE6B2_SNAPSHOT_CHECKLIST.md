# Save Phase 6B2 Snapshot Checklist

Before starting Phase 6C:

- [ ] Verify you are on the correct current branch
- [ ] `git status` is clean or you understand every change
- [ ] `npm run lint` passes
- [ ] `npm run test` passes
- [ ] `npm run build` passes
- [ ] Commit current work
- [ ] Push current branch to origin
- [ ] Create a Git tag for the snapshot
- [ ] Push the tag
- [ ] Optionally save or note the latest Vercel preview URL for that branch

Suggested commands:

```bash
cd ~/Code/ir-worldview-app-clean
git branch --show-current
git status
npm run lint
npm run test
npm run build
git add -A
git commit -m "phase 6b2 snapshot before phase 6c"
git push
git tag -a v0.6b2-prototype -m "Phase 6B2 prototype snapshot before Phase 6C"
git push origin v0.6b2-prototype
```
