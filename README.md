# Aatir Nadim — portfolio

A Vite + React personal portfolio that adapts the compact, playful panel language of `../portfolio-v3/` while using Aatir's evidence-backed material.

## Run locally

```sh
pnpm install
pnpm dev
```

Create a production build with `pnpm build`.

## Owner setup before publication

- `src/reading.config.json` lists reading topics, default visitor selections, the maximum selectable topics, and empty `feeds` arrays. Add approved public RSS/Atom URLs to a topic's `feeds` array after choosing publishers. Visitor selections are saved in local storage. Use a build-time aggregator or same-origin feed endpoint to avoid browser CORS and keep credentials out of the bundle. The UI intentionally shows no headlines until real sources are connected.
- Public email, profile links, current location, résumé download, and approved employment outcome claims were not established for publication in the brief's source material, so they are omitted.
- The project repository links are the URLs listed in `projects/projects_context.md`.

## Structure

- `src/components/` contains the page shell, sections, and standalone personal widgets.
- `src/data/portfolio.js` contains reusable portfolio content.
- `src/reading.config.json` contains RSS topic/feed configuration and visitor selection defaults.
- Tailwind CSS utilities style the components; the theme tokens live in `tailwind.config.js`.
