# Aatir Nadim — portfolio

A Vite + React personal portfolio that adapts the compact, playful panel language of `../portfolio-v3/` while using Aatir's evidence-backed material.

## Run locally

```sh
pnpm install
pnpm dev
```

Create a production build with `pnpm build`.

## Owner setup before publication

- `src/reading.config.json` lists reading topics, default visitor selections, the maximum selectable topics, and their public RSS/Atom URLs. The panel fetches feeds for the visitor's selected topics and caches successful results in memory for six hours (failed requests for ten minutes). The visitor's topic selection is saved in local storage. Feed fetching automatically tries direct browser requests first (for CORS-enabled feeds), falls back to the `/api/feed` proxy endpoint (supported out of the box in Vite dev/preview server and Vercel serverless functions), and uses public aggregators as a final fallback.
- Public email, profile links, current location, résumé download, and approved employment outcome claims were not established for publication in the brief's source material, so they are omitted.
- The project repository links are the URLs listed in `projects/projects_context.md`.

## Structure

- `src/components/` contains the page shell, sections, and standalone personal widgets.
- `src/data/portfolio.js` contains reusable portfolio content.
- `src/reading.config.json` contains RSS topic/feed configuration and visitor selection defaults; `src/readingFeeds.js` loads and caches selected feed results.
- Tailwind CSS utilities style the components; the theme tokens live in `tailwind.config.js`.
