# AGENTS.md

## Cursor Cloud specific instructions

### Project overview

Static single-page charity website (React 18 + Vite 6 + Tailwind CSS 4). No backend; all external integrations (Google Sheets, payment links, Instagram widget) are optional and degrade gracefully.

### Development commands

See `README.md` for canonical instructions. Quick reference:

- **Install deps:** `npm install`
- **Dev server:** `npm run dev` — starts Vite at `http://localhost:5173/tucker-family-charity/`
- **Build:** `npm run build`

### Notes

- The Vite base path is `/tucker-family-charity/` (configured for GitHub Pages). The dev server URL includes this prefix.
- No linter or test runner is configured in the project. There are no `lint` or `test` npm scripts.
- Node 22 is used in CI (GitHub Actions). The environment ships with Node v22 which matches.
- The `package-lock.json` lockfile is present — always use **npm** (not pnpm/yarn).
