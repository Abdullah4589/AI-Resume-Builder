# AI Resume Builder - Project Documentation

> **Two parts.** Part 1 (Engineering Rules) is binding: it constrains what you may
> do. Part 2 (Design Rationale) records *why* the system is built the way it is.
> Structure, dependencies, endpoints and scripts are deliberately not documented
> here — read the code and the package manifests for those, and when this file
> and the code disagree, the code wins.

---

# Part 1 — Engineering Rules

These rules apply to every change, whether made by a human or an agent.

## 1. Definition of done

A change is not done until all four hold:

1. `npm run typecheck` passes (both workspaces, zero errors).
2. `npm run build` passes.
3. `npm test` passes — the full Playwright suite, from a cold start.
4. Behaviour changes are covered by an e2e test that fails without the change.

Never report work as complete on the strength of "it should work". Run the
commands and quote the real output. If a step fails, say so with the output
rather than describing the intent.

## 2. Project structure

Respect the existing layout; do not invent parallel hierarchies.

- `client/src/components/{ai,form,preview,ui}/` — one component per file, named
  after the file. `ui/` holds only generic, resume-agnostic primitives; anything
  that knows what a resume is belongs in `form/` or `preview/`.
- `client/src/store/` — all shared mutable state. Component state stays local.
- `client/src/types/resume.ts` and `server/src/types/resume.ts` are duplicated by
  design. **Change one, change both in the same commit** — a silent divergence
  between the two is a production bug, not a style issue.
- `server/src/routes/` — HTTP concerns only (parse, validate, delegate, respond).
  Business logic goes in `server/src/services/`. Routes must not call the
  Anthropic SDK or Puppeteer directly.
- `tests/` — Playwright specs plus `helpers.ts`. No unit-test framework is
  installed; do not add one without being asked.

New top-level directories require explicit approval.

## 3. Code standards

- TypeScript strict mode. **`any` is prohibited** — use `unknown` and narrow it.
- No non-null assertions (`!`) on values that can genuinely be null. Handle it.
- No new runtime dependency without approval. Justify it against what is already
  installed; this project deliberately has a small dependency tree.
- Every `fetch`/API call has an error path that reaches the user. Silent
  `catch {}` is prohibited — mock mode is a fallback, not an error handler.
- Comments explain *why*, not *what*. Match surrounding comment density.
- Prefer editing an existing file over creating a new one.

## 4. Testing rules

- Selectors: user-facing roles and labels (`getByRole`, `getByLabel`). Never CSS
  classes or DOM structure — Tailwind classes change and are not a contract.
- No arbitrary `waitForTimeout`. Use web-first assertions (`toPass`, `expect`).
- Tests must pass from a cold start with no manually pre-started servers.
- Tests must be independent and parallel-safe; each seeds its own state.
- Two known environment constraints, already encoded in `playwright.config.ts` —
  do not "simplify" them back:
  - Probe `127.0.0.1`, not `localhost`. Node resolves `localhost` to IPv6 `::1`
    first while Vite and Express bind IPv4 only.
  - The API server runs via `serve:server` (plain `tsx`), not `dev:server`
    (`tsx watch`) — watch mode never boots when Playwright pipes its stdio.
- **Never make a test pass by weakening it.** Deleting an assertion, loosening a
  matcher, or adding `test.skip` to silence a real failure is prohibited. If a
  test describes a feature that does not exist, skip it *with a comment
  explaining precisely why* (see TC-02, TC-11/12, TC-16 for the expected form)
  and surface it as a product gap. A skipped test is a claim about the product,
  and it must be a true one.

## 5. Secrets and configuration

- `ANTHROPIC_API_KEY` is read server-side only. It must never reach the client
  bundle, a test fixture, a log line, or a commit.
- `.env` is ignored; `.env.example` is committed and lists every variable with a
  placeholder. Adding a variable means updating `.env.example` in the same commit.
- Never print, echo, or paste an environment variable's value.
- Mock mode (no API key) must keep working. It is how the app is demoed and how
  CI runs — never make a code path depend on a live key.

## 6. Git and GitHub workflow

- **Never commit or push unless explicitly asked.** No exceptions.
- Never commit directly to `main`. Branch as `feat/`, `fix/`, `chore/`, `test/`,
  or `docs/` + a short kebab-case description.
- Conventional Commits for messages. Imperative mood, explain *why* in the body.
- One logical change per commit. Do not bundle a refactor with a fix.
- Never commit: `node_modules/`, `dist/`, `.env`, `*.log`, test artifacts
  (`playwright-report/`, `test-results/`, `.playwright-mcp/`), screenshots, or
  scratch files. Check `git status` before staging; stage explicit paths rather
  than `git add -A`.
- Never use `--force`, `--no-verify`, or `--amend` on pushed commits. Never
  rewrite published history. Never skip a failing hook — fix the cause.
- A PR must state what changed, why, and how it was verified. CI must be green
  before merge; a red build is never merged "to fix forward".

## 7. Deployment guardrails

- Deployment is a human decision. An agent may prepare and describe a deploy; it
  may never trigger one.
- Never run a deploy, publish, or infrastructure-mutating command
  (`npm publish`, `vercel --prod`, `gh release create`, cloud CLIs) unprompted.
- Preconditions for any production deploy: green CI on `main`, `npm run build`
  clean, `ANTHROPIC_API_KEY` set in the host environment (not baked into an
  image), and CORS restricted to the real client origin — the current
  `app.use(cors())` allows every origin and must be tightened before going live.
- The PDF route runs Puppeteer/Chromium: it is CPU- and memory-heavy and needs a
  host with a real Chromium install. Do not assume a serverless target works.
- Destructive or irreversible operations (deleting branches, resources, data)
  require explicit confirmation naming the exact target.

## 8. Working with the user

- Ask before acting when a decision is genuinely ambiguous; otherwise make the
  routine call and state the assumption.
- Report failures honestly. A test that fails is information, not something to
  work around.
- If a request seems mistaken, say so once, plainly — then do as asked.

---

# Part 2 — Design Rationale

Why the system is built this way. Everything else about the architecture —
layout, dependencies, endpoints, scripts — is derivable from the code and the
package manifests, so it is deliberately not duplicated here.

## Key Design Decisions

### localStorage for Persistence
- Simplifies deployment (no backend DB required)
- Suitable for single-user/demo scenarios
- Users can save multiple resumes by exporting/importing JSON

### Monorepo Workspace Structure
- Shared TypeScript types (`types/resume.ts` in both workspaces)
- Unified dependency management via root `package.json`
- Single deploy with coordinated builds

### Mock Mode
- Enables full feature demonstration without API key
- Graceful fallback for development environments
- Realistic sample responses for UX testing

### Server-side PDF Generation
- Puppeteer ensures pixel-perfect PDF matching live preview
- Server-side processing avoids client-side complexity
- Supports all template variations

### Drag-and-drop with @dnd-kit
- Modern, accessible drag-and-drop library
- Reorder entire sections or individual entries
- Smooth animations and touch support
