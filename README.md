# AI Resume Builder

A full-stack AI-powered resume builder. Fill a section-based form, get Claude-powered
writing help (bullet generation, content improvement, ATS scoring), preview live across
3 templates with full customization, and download a pixel-matched PDF.

## Stack

- **Client:** React (Vite) + TypeScript + Tailwind + Zustand + @dnd-kit
- **Server:** Node + Express + TypeScript, Anthropic SDK, Puppeteer (PDF)
- **AI:** Claude `claude-sonnet-4-6` (via backend). Runs in graceful **mock mode** when no API key is set.
- **Persistence:** `localStorage` only (no DB, no auth)

## Setup

```bash
npm install            # installs both workspaces + downloads Puppeteer Chromium
cp .env.example .env    # then optionally add your ANTHROPIC_API_KEY
npm run dev             # client → http://localhost:5173, server → http://localhost:3001
```

Without an `ANTHROPIC_API_KEY`, the AI endpoints return realistic mock data so the whole
app is fully usable. Add a key to `.env` to enable real Claude calls.

## Scripts

- `npm run dev` — run client + server together
- `npm run build` — build both
- `npm run typecheck` — type-check both workspaces
