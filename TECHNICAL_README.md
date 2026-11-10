# Kwingineko — Technical README

[← General README](README.md)

Kwingineko is Aatir Nadim’s personal portfolio: a single-page, retro-computer-inspired tour of his software engineering work, experience, writing, skills, and credentials. The name appears in internal code identifiers (for example, the Hashnode cache key); the page itself presents Aatir’s portfolio.

It is built as a responsive React application with a starfield backdrop, compact information panels, pixel-art accents, CRT effects, and interactive side widgets. Alongside the portfolio content, it includes live reading feeds, local weather, an interactive desk cat, a keyboard-command palette, and a browser-based DOS game arcade.

## At a glance

- **Application:** React 18 single-page app, built and served with Vite 6.
- **Styling:** Tailwind CSS 3, with project theme tokens in `tailwind.config.js` and global/component styles in `src/styles.css`.
- **Language:** JavaScript and JSX, using ES modules.
- **Package manager:** pnpm (`pnpm@9.1.3`, declared in `package.json`).
- **Hosting configuration:** Vercel (`vercel.json`), including serverless API functions under `api/`.
- **Main content:** Aatir’s profile, work history, selected projects, expertise, writing, certificates, FAQ, and contact options.
- **Interactive extras:** DOS games powered by js-dos, RSS topic reader, Hashnode articles, local weather, starfield, pixel portrait, cat companion, easter eggs, CRT mode, and keyboard navigation.

## Run it locally

Requirements: Node.js compatible with Vite 6 and pnpm.

```sh
pnpm install
pnpm dev
```

Vite prints the local development URL (normally `http://localhost:5173`). The local server also provides the `/api/feed` and `/api/hashnode` development endpoints used by the widgets.

Available package scripts:

| Command | Purpose |
| --- | --- |
| `pnpm dev` | Start the Vite development server. |
| `pnpm build` | Create the production bundle in `dist/`. |
| `pnpm preview` | Serve the production bundle locally for a manual preview. |

There is a unit-test file for the arcade runtime cache at `src/utils/arcadeCache.test.js`, but no test script is currently declared in `package.json`.

## What the site contains

The central page is composed in `src/App.jsx`. Its primary navigation follows these sections:

1. **Overview** — introduction, portrait, and résumé link.
2. **Experience** — roles and accomplishments.
3. **Selected work** — project summaries, technical details, and links.
4. **Expertise** — grouped technologies and focus areas.
5. **Writing** — Hashnode publication view.
6. **Certificates** — selected credentials.
7. **FAQ & Trivia** — searchable/categorized questions and the arcade vault.
8. **Contact** — contact details, copy actions, and message composer.

The desktop layout uses a navigation rail, central content column, and personal sidebar. At smaller widths the layout collapses, with navigation available as a drawer. The shell includes a sticky header and footer, a skip-to-content link, smooth section navigation (unless reduced motion is requested), and scroll-position-aware active navigation.

### Portfolio content

The portfolio is data-driven where practical. `src/data/portfolio.js` holds navigation labels and structured content for the projects, experience, expertise, certificates, social profiles, and contact details. Project cards include summaries, problems, contributions, outcomes, technical highlights, stacks, and links. Images and logos are served from `public/assets/`.

The résumé is `public/Aatir_Nadim - Resume.pdf`. Update the portfolio data and public assets together when changing claims, links, or imagery so that all displayed information remains consistent.

### DOS arcade

`src/data/games.js` describes the game catalogue and each game’s display metadata, controls, and audio notes. The FAQ arcade vault opens games in a lazy-loaded player (`src/components/DosPlayerModal.jsx`). Game bundles live in `public/games/*.jsdos`; the js-dos player and emulator runtime are vendored in `public/js-dos/`.

The app prewarms shared emulator runtime assets while idle. `src/utils/arcadeCache.js` manages this cache and has a corresponding test file. Individual game bundles are loaded when a game is selected. The player supports switching games and exposes pause, mute, restart, fullscreen, and close controls where supported by the runtime.

### Reading and writing feeds

There are two separate reading experiences:

- **Topic reader:** `src/reading.config.json` defines visitor-selectable RSS/Atom topics and feed URLs. Up to three topics can be selected; AI News, Anime, and Open Source are the initial defaults. Topic selections are saved in browser local storage. `src/readingFeeds.js` fetches and parses feeds, coalesces in-flight requests, shows up to eight items per feed/topic, and caches successes in memory for six hours and errors for ten minutes.
- **Aatir’s Hashnode writing:** `src/services/hashnode.js` and `BlogSection.jsx` provide the publication view for `techtom.hashnode.dev`. The component presents publication articles, with featured and grid views and loading/error/fallback states. Hashnode response caching and feed parsing are handled by the service module.

For the topic reader, requests try the feed directly first, then the same-origin `/api/feed` endpoint, then public RSS-to-JSON and CORS-proxy fallbacks. Feed sources can block browser access or be unavailable; in that case the UI can show an error and offer retry/fallback actions.

### Personal widgets and small interactions

- **Local weather:** `LocalWeather.jsx` requests current weather data from Open-Meteo for the configured location. It needs a network connection and a reachable public API.
- **Desk companion:** the cat can be clicked/petted or fed. Cursor-follow mode is optional and toggled from the sidebar. A hunger cue starts 40 seconds after the page is ready and repeats every five minutes until fed. When browser audio is available, a short synthesized note plays; the document title briefly alternates to a “Feed me!” reminder while hungry.
- **Intro splash:** shown once per browser tab session, using `sessionStorage`; it can be dismissed by its controls or keyboard interaction.
- **Command palette:** open with **Cmd/Ctrl+K** or **/** (the slash shortcut does not fire while typing in an input, textarea, or editable element). It includes navigation and site actions such as launching the arcade, toggling CRT mode, changing cat behavior, and opening the contact composer.
- **CRT and easter eggs:** the CRT overlay can be toggled from the UI and is also wired to the console easter egg. `CrtOverlay.jsx` contains the Konami-code interaction. `consoleEasterEgg.js` wires developer-console actions for CRT, arcade, and composer actions.
- **Accessibility details:** the page includes a skip link, semantic section landmarks, accessible labels for the interactive portrait and dialogs, keyboard handling, and reduced-motion-aware section scrolling.

## Project map

```text
api/
  feed.js                 RSS/Atom proxy for Vercel and local Vite
  hashnode.js             Hashnode GraphQL proxy plus RSS GET proxy
public/
  assets/                 Portfolio images, project art, and logos
  games/                  js-dos game bundle files (.jsdos)
  js-dos/                 js-dos browser player and emulator runtime
  Aatir_Nadim - Resume.pdf  Résumé download
src/
  App.jsx                 Page shell, global state, shortcuts, and section wiring
  main.jsx                React entry point
  styles.css              Global styles and Tailwind layers
  data/                   Portfolio content, game catalogue, and fortunes
  components/             Page sections, widgets, dialogs, and visual effects
  services/hashnode.js    Hashnode article/feed parsing and caching
  reading.config.json     RSS topic and feed configuration
  readingFeeds.js         Topic feed retrieval, parsing, fallback, and cache
  utils/                  Arcade cache and console easter egg utilities
```

Notable components include `SiteHeader`, `NavigationRail`, `Introduction`, `ExperienceSection`, `ProjectsSection`, `ExpertiseSection`, `BlogSection`, `CertificatesSection`, `FaqSection`, `ContactSection`, `PersonalSidebar`, `DeskCompanion`, `ParticlePortrait`, `StarfieldBackground`, `CrtOverlay`, `CommandPalette`, `ContactModal`, and `DosPlayerModal`.

## External services and API routes

| Route/service | Used for | Configuration/behavior |
| --- | --- | --- |
| `/api/feed?url=…` | Fetch an RSS/Atom feed when the browser cannot fetch it directly. | Implemented in `api/feed.js`; Vite supplies a development/preview middleware, and Vercel deploys the API file as a serverless function. |
| `/api/hashnode` | Hashnode GraphQL proxy; also accepts GET requests to proxy RSS. | Implemented in `api/hashnode.js`. POST expects a GraphQL `query` and optional `variables`; GET accepts a `url` query parameter. |
| `https://gql.hashnode.com` | Hashnode GraphQL origin. | Called server-side through `/api/hashnode`. |
| Configured RSS/Atom hosts | Visitor-selected topic articles. | Edit `src/reading.config.json`; some hosts may reject direct browser requests. |
| `api.rss2json.com`, `api.allorigins.win` | Public fallbacks for topic feeds when direct and same-origin fetching fail. | External availability and rate limits are outside this project’s control. |
| Open-Meteo | Weather widget data. | Requested by the browser from `LocalWeather.jsx`. |

The API handlers set permissive CORS response headers. The feed proxy accepts a URL from its query string and fetches it; restrict allowed upstream hosts if this endpoint is ever exposed in an environment where arbitrary proxying is not acceptable.

## Configuration and content updates

- **Personal details, projects, social links, skills, credentials:** edit `src/data/portfolio.js`.
- **Games and on-screen metadata:** edit `src/data/games.js`; keep game bundle paths aligned with files under `public/games/`.
- **Reading topics and initial selection:** edit `src/reading.config.json`. `maxSelectedTopics` controls the selection limit, and `defaultSelectedTopicIds` must refer to defined topic IDs.
- **Fortune messages:** edit `src/data/fortunes.js`.
- **Brand/theme colors and utility extensions:** edit `tailwind.config.js`; component CSS and global layers are in `src/styles.css`.
- **Page title, description, and document metadata:** edit `index.html`.
- **Crawling metadata:** `public/robots.txt`, `public/sitemap.xml`, and `public/llms.txt`.
- **Hosting headers and SPA routing:** edit `vercel.json`.

Publication notes: the current repository version intentionally omits public email/profile claims and employment outcomes that were not established in the source material used for the portfolio. Verify the URLs in `src/data/portfolio.js` against their intended destinations before publication.

## Deployment notes

The app is a Vite static build plus two Vercel serverless functions. Deploying to Vercel makes `/api/feed` and `/api/hashnode` available without additional server configuration. The Vite config also implements these API routes for local development and preview. A static-only host can serve the built page, but same-origin API routes will not exist there; Hashnode and some feed behaviors may therefore be unavailable or use their configured public fallbacks.

`vercel.json` configures clean URLs, rewrites non-API paths to `index.html` for the single-page app, and sets response headers:

- `X-Content-Type-Options: nosniff`
- `X-Frame-Options: SAMEORIGIN`
- `Referrer-Policy: strict-origin-when-cross-origin`
- `Permissions-Policy: camera=(), microphone=(), geolocation=()`
- Long-lived immutable caching for assets and built static files; revalidation for `index.html`.

The Vite build output is `dist/`; it is generated and should not be edited by hand.

## Dependencies

Runtime dependencies are React, React DOM, `js-dos` (DOS emulation), and `lucide-react` (icons). The development/build toolchain uses Vite and its React plugin, Tailwind CSS, PostCSS, and Autoprefixer. The lockfile is `pnpm-lock.yaml`.

## License and bundled game material

No top-level `LICENSE` file is present in this repository. The arcade includes third-party game bundles and the js-dos runtime under `public/`; check the relevant upstream license and redistribution terms before redistributing or repackaging those files.
