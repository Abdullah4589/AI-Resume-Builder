# Design Decisions — Why This Project Is Built This Way

Every choice below has a cost. If I picked something and can't tell you what it
cost me, then I didn't make a decision — I just used what was popular.

This file explains five choices in plain words: what I picked, what I said no
to, what it costs me, and when I would change my mind.

**How to read this:** each section starts with **"The short answer"** — that is
the version to say out loud. Everything after it is backup for follow-up
questions.

---

## 1. I save data in the browser, not in a database

### The short answer

> A resume is written by one person, for one person, on one device. A database
> exists to let many people share data safely. This app has nothing to share.
> So I store the resume in the browser's localStorage instead. The cost is real:
> if you clear your browser data, your resume is gone. I accepted that to keep
> the app usable in one second with no signup.

### What I actually did

I use Zustand's `persist` feature. It saves the app's state into the browser's
localStorage automatically under two keys: `resume-data` and
`resume-customization`.

Files: `client/src/store/useResumeStore.ts`, `useCustomizationStore.ts`

### What I said no to

- **A real database (Postgres)** behind my Express server.
- **A ready-made backend (Supabase / Firebase)**.

### Why I said no

The moment data lives on a server, I have to answer one question: *whose data is
this?* That means login, passwords, sessions, and permission checks.

So a database doesn't cost me "a database". It costs me a **login screen**. And
a login screen is the worst thing I could add to this app, because the whole
point is that you land on the page and start typing immediately.

I would also need a schema, migrations, a database connection, and a hosted
server that costs money every month — all to store one document that only one
person ever reads.

### What it costs me (be honest about this)

- Clear your browser data → your resume is **permanently gone**. No backup.
- You cannot open your resume on your phone if you made it on your laptop.
- Two people cannot work on the same resume.

My only protection is Export/Import JSON, and that only works if the user
remembers to click it. That is a weak safety net and I know it.

### When I would change my mind

The instant someone asks for any one of these:

- "Let me open it on my phone"
- "Let me share a draft with a friend"
- "I deleted it, can I get it back?"

These sound like three small features. They are not. **All three are the same
feature: a database.** Any one of them means I rebuild persistence properly.

### The mistake I left in (say this before they find it)

Both stores are marked `version: 1`. That version number exists so that when I
change the data shape later, I can write a `migrate` function to upgrade old
saved data.

**I never wrote that function.** So if I changed the resume structure today, old
saved data would be handed to new code and quietly break. The hook is there; the
handler isn't. That's a genuine gap, not a design choice.

---

## 2. One repo with two projects inside it (monorepo)

### The short answer

> The frontend and backend are useless without each other, and they ship at the
> same time. Keeping them in one repo means one install, one typecheck, and one
> pull request when I change something that touches both. If they were in two
> repos, I'd need two PRs and there'd be a window where they disagree.

### What I actually did

npm **workspaces**. One repo, two packages: `client` and `server`. One
`npm install` at the root sets up both. One `npm run typecheck` checks both.

### The part they will attack: "you copied your types file"

There is a `types/resume.ts` in the client **and** in the server. That looks like
a beginner mistake. Here is the accurate answer:

> They are not copies. The server file is a **smaller subset** of the client
> file. The server only holds the `ResumeData` shape and the AI response types —
> that's all its ATS route needs. The client additionally owns things the server
> has no opinion about: section labels, section ordering, and all the styling
> options like template, font, and colour. The shared part is identical today.

This matters. A **subset** means the server has a narrower interface — that's
good design. Two full copies drifting apart would be bad. Know the difference.

### Why not a third `shared/` package?

That is the "correct" textbook answer, and I considered it. A third package
needs its own `package.json`, its own build step, and compiled output that both
sides import. Every time I touch a type, both sides now have to rebuild in the
right order — in development *and* in CI.

For **two** consumers and one small file, that setup costs more than the
duplication does.

### What it costs me

Nothing stops the two files from drifting apart. There's no compiler check.

So I made it a written rule instead — `CLAUDE.md` §2: *change one, change both,
in the same commit.*

I should say plainly: **that's a process guarantee, not a technical guarantee.**
A rule that a human (or an AI) must remember is weaker than one the compiler
enforces. I chose it knowingly for two consumers.

### When I would change my mind

When a **third** consumer appears — say a mobile app or a CLI. At two, the
duplication is cheaper. At three, people start forgetting the rule, and then the
build cost of a shared package becomes worth paying.

---

## 3. Mock mode: the app works fully without an API key

### The short answer

> If there's no API key, the app doesn't break — it returns realistic sample AI
> responses instead. That's how anyone can clone it and run it, and it's how my
> CI runs the whole test suite with no secret at all.

### The important detail — this is the best part of the project

There are two ways to build this, and they look the same from outside:

**The wrong way:** try to call the real API, and if it throws, return a mock
from the `catch` block.

**What I did:** check *first* whether a key exists. If not, return the mock
immediately and never attempt the call.

```
isLive = Boolean(apiKey && apiKey.trim())     // claude.ts, computed once
if (!isLive) return res.json(mockBullets(...)) // ai.ts — before any API call
```

### Why that difference matters (this is the answer that impresses)

> In the `catch` version, "no key is configured" and "the API is down" produce
> the exact same result for the user. That means a real outage looks identical
> to normal operation — I could never detect it or alert on it.
>
> By checking upfront, the two stay separate. **No key is a configuration.
> A failed API call is an error** — and it still gets a proper error path shown
> to the user. A mock is a fallback, never an error handler.

### What this buys me

- **CI runs the full test suite with zero secrets.** 19 tests pass end to end
  with no API key anywhere. Nothing to leak.
- Anyone can clone the repo and see every feature work.
- No code path is allowed to depend on a live key — so "it only works on my
  machine with the key" can never happen.

### What it costs me

The mock responses are hand-written by me (`server/src/services/mock.ts`). They
can drift from what the real model returns.

Be honest about the limit: **my tests prove the plumbing works — the request
shape, the response handling, the rendering. They do not prove my prompts are
good.** Prompt quality isn't tested here, and I won't claim it is.

---

## 4. PDFs are generated on the server with Puppeteer

### The short answer

> The PDF has to look exactly like the preview on screen. So instead of
> re-drawing the resume a second time, I take the HTML that's already rendered
> in the browser, send it to the server, and open it in headless Chrome to print
> it. One template implementation, and the PDF matches by construction.

### What I said no to, and why

**jsPDF / html2canvas (in the browser)**
This takes a *screenshot* and puts it in a PDF. So the output is an image of a
resume. The text can't be selected, can't be copied, and — critically — **can't
be read by an ATS**. For a resume builder, that defeats the entire product.

**React-PDF**
This one is actually good: real selectable text. But it requires me to rebuild
**every template a second time** in its own components. Now the preview and the
PDF are two separate codebases that I have to keep looking identical by hand.
They *will* drift.

**My approach** sends the already-rendered HTML to the same engine that drew the
preview. So there's only ever one template. The two match structurally, not
because I maintain them.

### What it costs me — this is the biggest cost in the project

- A **~200MB Chromium binary** as a dependency.
- Real CPU and memory on every single PDF.
- **It cannot run on normal serverless hosting.** Serverless has no real
  Chromium and short time limits.

I didn't leave that last one in my head — it's written into
`.github/workflows/deploy.yml` so a future deploy can't quietly ignore it.

### The failure handling (mention this, it shows care)

Launching Chrome is slow, so I launch it once and reuse it. But that creates a
trap: if Chrome crashes, the dead instance stays cached and **every future
request fails until the server restarts**.

So I listen for the `disconnected` event and clear the cache when it fires. A
render that fails after a crash retries once with a fresh browser. A failed
*launch* isn't cached either.

File: `server/src/services/pdf.ts`

### What breaks under load (say this before they ask)

> One browser instance serves every request, and there's no queue and no limit
> in front of it. A burst of PDF requests is the easiest way to take my server
> down. The fix is a browser pool with a bounded queue and a per-request
> timeout — but I'd want real load numbers before choosing the pool size.

There's also an outside dependency: the PDF loads Google Fonts over the network.
If Google Fonts is down, the PDF still renders but the fonts fall back.

---

## 5. @dnd-kit for drag-and-drop reordering

### The short answer

> I needed drag-to-reorder for resume sections. react-beautiful-dnd is the
> famous one but it's no longer maintained, so adopting it means inheriting a
> React version ceiling. The raw HTML5 drag API is free but can't be used with a
> keyboard and doesn't work on touch at all. @dnd-kit is maintained, has no
> dependencies of its own, and ships keyboard support and screen-reader
> announcements by default.

### What it costs me

Three packages (`core`, `sortable`, `utilities`) for one feature, in a project
where I'm deliberately keeping dependencies few.

### The honest part (say this — it shows judgment, not weakness)

> Plain up/down arrow buttons would have cost zero dependencies and been *more*
> accessible than drag. I chose drag because it's the better interaction for
> reordering a document you're looking at, and @dnd-kit's keyboard support means
> I'm not giving up accessibility to get it.
>
> But of the five decisions here, this is the one I hold most loosely. If I had
> to cut a dependency, this is the first one I'd cut.

### A side effect worth knowing

You can't test drag-and-drop reliably using CSS classes or DOM structure. That's
part of why my whole e2e suite is written against **roles and labels** — what a
user actually sees — instead of structure.

---

## The one-line summary of everything above

> Every decision here trades **operational power** for **setup cost**.
> No database, no login, no queue, no secret needed to run it.
> The result: a stranger can clone this and have it working with one command,
> and CI can test all of it with no credentials.
>
> That is the right trade for a product you can demo and verify.
> It's the wrong trade for a real multi-user service.
>
> And the line between those two is a single requirement: **more than one user
> needing their own data.** The day that's true, decisions 1 and 3 both fall at
> the same time — not one by one.

---

# Quick revision sheet

Read only this on the way to the interview.

| # | Decision | Rejected | Cost I accepted | Changes when |
|---|---|---|---|---|
| 1 | localStorage | Postgres, Supabase | Clear browser = data gone | Multi-device / sharing / recovery |
| 2 | Monorepo, subset types | Separate `shared/` pkg | Drift prevented by rule, not compiler | A 3rd consumer appears |
| 3 | Mock mode via upfront `isLive` | Mock inside `catch` | Mocks can drift from real model | — (this one I'd keep) |
| 4 | Server-side Puppeteer | jsPDF (image), React-PDF (2x work) | 200MB Chrome, no serverless, no queue | Load requires a browser pool |
| 5 | @dnd-kit | react-beautiful-dnd, HTML5 API | 3 packages for one feature | First thing I'd cut |

## Hard questions and my answers

**"Why not just use Next.js?"**
> The PDF route needs a long-lived Chrome process that stays alive between
> requests. Next.js API routes assume a serverless-style lifecycle where that
> kind of caching is exactly the wrong pattern. My split is honest about the
> fact that this backend is stateful.

**"Isn't localStorage a bad choice?"**
> It's a bad choice for a product with users. It's the right choice for a
> single-author document tool with no login. The moment I need multi-device, I
> rewrite it — and I know that's the trigger.

**"You duplicated your types."**
> Not quite — the server file is a subset, only what its route needs. The shared
> part is identical today, and the rule is: change one, change both, same
> commit. That's a process guarantee, not a compiler one, and I'd move to a
> shared package if a third consumer showed up.

**"What happens under load?"**
> The PDF route falls over first. One browser, no queue, no timeout. It's the
> known weak point and the fix is a bounded browser pool.

**"How do you know any of this works?"**
> `npm run typecheck`, `npm run build`, and a 19-test Playwright suite that runs
> from a cold start with no API key. CI runs all three on every PR, and `main`
> is protected so nothing merges red.

## Three things to volunteer before you're asked

Naming your own weak spots first is worth more than any polished answer.

1. **The missing `migrate` function.** `version: 1` is set on both stores, but I
   never wrote the migration handler.
2. **No queue on the PDF route.** One browser serving everything is my
   bottleneck.
3. **My tests prove the plumbing, not the prompt quality.** Mock mode means I
   never test whether the AI output is actually good.
