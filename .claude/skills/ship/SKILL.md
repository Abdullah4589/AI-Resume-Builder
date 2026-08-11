---
name: ship
description: Take a change from "written" to "ready for PR" — verify against the definition of done, loop on failures with a hard iteration cap, then draft the PR body. Use when a change is believed complete, or when asked to ship, finish, or prepare a PR.
---

# Ship

A change is not done because it was written. It is done when
`npm run typecheck`, `npm run build` and `npm test` all pass and the behaviour
is covered by a test that fails without it (CLAUDE.md §1).

This skill is the loop that gets there — and, just as importantly, the loop that
knows when to stop trying.

## Step 1 — Confirm coverage before verifying

Ask: does this change alter behaviour a user can observe?

- **Yes, and no test covers it** → delegate to the `e2e-author` subagent to
  write one before verifying. Verifying uncovered behaviour just tells you the
  old tests still pass, which was never in doubt.
- **Yes, and a test covers it** → confirm that test actually fails without the
  change. If it passes either way, it is not coverage.
- **No** (docs, config, comments) → skip to step 2 and say so.

## Step 2 — Verify in a clean context

Delegate to the `verifier` subagent. Do not run the three commands yourself.

The isolation is the point: you have just written this change and you know what
you intended it to do. That knowledge is exactly what makes you a bad reader of
its failures — you will pattern-match an error to your intent and see a
near-miss where there is a real bug. A fresh agent with no memory of the
implementation reads the output as written.

## Step 3 — The loop, with a cap

If the verdict is FAIL:

1. Read the actual error. Not the summary — the error.
2. Form a hypothesis about the cause and state it before editing.
3. Make the smallest fix that addresses that cause.
4. Re-run step 2.

**Cap: three iterations.** On the fourth failure, stop and report. Do not try a
fourth fix.

This cap exists because the failure mode of an autonomous loop is not giving up
too early — it is thrashing: each iteration edits more, understands less, and
the diff grows until nobody can review it. Three honest attempts and a clear
problem statement is a better handoff than twenty edits and a green test that
passes for the wrong reason.

Stop immediately, before the cap, if any of these appear:

- The same error recurs after a fix that should have addressed it — the
  hypothesis is wrong, and more edits will not fix a wrong hypothesis.
- A fix would require weakening a test. Never do this. Report it instead.
- A fix would need a new runtime dependency, a new top-level directory, or a
  change to both `types/resume.ts` files. All need approval first.
- The failure is environmental (port in use, missing browser binary) rather than
  a defect in the change. Report it — the change may be fine.

## Step 4 — Draft the PR

Only once the verdict is PASS. Fill `.github/pull_request_template.md`:

- **What changed** — one logical change. If the diff contains a refactor *and* a
  fix, say so and propose splitting it.
- **Why** — the reasoning the diff cannot show.
- **How it was verified** — paste the verifier's real output. Not "all tests
  pass". The actual counts.
- Walk the checklist honestly: types in sync, no secrets, no unjustified
  dependency, no test weakened.

## Step 5 — Stop

Do not commit. Do not push. Do not open the PR. CLAUDE.md §6: never commit or
push unless explicitly asked, no exceptions. Present the draft and hand back.

## Reporting a failed loop

If the cap was hit, report — and this is a successful outcome for this skill, not
a failure of it:

- What the failure is, quoting the real error.
- Each hypothesis tried and what it ruled out.
- What you would investigate next.
- The current state of the working tree, so the user can decide whether to keep
  the partial work or revert it.
