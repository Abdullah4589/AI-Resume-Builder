## What changed

<!-- One logical change per PR. If this is a refactor bundled with a fix, split it. -->

## Why

<!-- The reasoning the diff can't show. Link an issue if there is one. -->

## How it was verified

<!-- Paste real output, not intent. All four must hold before review (CLAUDE.md §1). -->

- [ ] `npm run typecheck` passes
- [ ] `npm run build` passes
- [ ] `npm test` passes from a cold start
- [ ] Behaviour changes are covered by an e2e test that fails without the change

```
paste test output here
```

## Checklist

- [ ] `client/src/types/resume.ts` and `server/src/types/resume.ts` are still in sync
- [ ] No secrets, `.env` values, or API keys in the diff
- [ ] No new runtime dependency (or it's justified in "Why" above)
- [ ] No test was weakened, skipped, or deleted to make CI green
