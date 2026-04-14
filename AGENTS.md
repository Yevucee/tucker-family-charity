# AGENTS.md

## Cursor Cloud specific instructions

### Overview

This is the **Tucker Family Charity Website** — a static React SPA (no backend, no database) built with React 18, Vite 6, Tailwind CSS v4, MUI, Radix UI, and deployed to GitHub Pages.

### Dev server

```bash
npm run dev
```

Starts Vite on `http://localhost:5173/tucker-family-charity/` (note the base path from `vite.config.ts`).

### Build

```bash
npm run build
```

Produces `dist/` and copies `index.html` → `404.html` for SPA routing on GitHub Pages.

### Lint / Tests

No ESLint config or test framework is currently set up. There are no lint or test scripts in `package.json`.

### Environment variables

Copy `.env.example` → `.env` for local dev. All `VITE_*` vars are optional — the site degrades gracefully (mock data, disabled forms) when they are absent.

### Gotchas

- The Vite base path is `/tucker-family-charity/` (configured in `vite.config.ts`). All local dev URLs include this prefix.
- The "Keep It In The Family" directory page fetches from `opensheet.elk.sh` at runtime and falls back to mock data if the network is unavailable.
- Large image assets (several MB PNGs) are committed to the repo; builds may be slow on constrained bandwidth.
