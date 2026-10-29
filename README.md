# Aatir Nadim — portfolio

A Vite + React personal portfolio that adapts the compact, playful panel language of `../portfolio-v3/` while using Aatir's evidence-backed material.

## Run locally

```sh
pnpm install
pnpm dev
```

Create a production build with `pnpm build`.

## Owner setup before publication

- `src/reading.config.json` lists reading topics, default visitor selections, the maximum selectable topics, and their public RSS/Atom URLs. The panel fetches only feeds for the visitor's selected topics and caches successful results in memory for six hours (failed requests for ten minutes). The visitor's topic selection is saved in local storage. Direct browser feed requests depend on each publisher allowing cross-origin access; the panel reports a load issue when a publisher blocks it. A same-origin or build-time aggregator will be needed for feeds that do not allow browser access.
- Public email, profile links, current location, résumé download, and approved employment outcome claims were not established for publication in the brief's source material, so they are omitted.
- The project repository links are the URLs listed in `projects/projects_context.md`.

## Structure

- `src/components/` contains the page shell, sections, and standalone personal widgets.
- `src/data/portfolio.js` contains reusable portfolio content.
- `src/reading.config.json` contains RSS topic/feed configuration and visitor selection defaults; `src/readingFeeds.js` loads and caches selected feed results.
- Tailwind CSS utilities style the components; the theme tokens live in `tailwind.config.js`.
