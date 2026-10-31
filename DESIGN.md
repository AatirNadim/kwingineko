# Design System & Responsive Visual Contract: Aatir Nadim Portfolio

## Archetype: Retro Monokai Engineering Workstation
A dark, compact personal computing environment evoking Unix workstations, retro terminals, and precision developer utilities, grounded in the classic Monokai color palette.

### 60-30-10 Color Tokens
- **60% Canvas & Deep Surfaces**:
  - Main Canvas: `#272822` (Canvas background)
  - Surface Wells: `#1e1f1c` (Panel body, inset wells, directory backgrounds)
  - Window Chrome: `#252621` / `#292a25` (Title bars, telemetry headers)
- **30% Structure, Borders & Typography**:
  - Hairline Borders: `#45463e` / `#36372f` (1px crisp borders, dotted separators)
  - Selected / Focus Surfaces: `#414339` (Active tabs, keyboard focus outlines)
  - Primary Text: `#f8f8f2` (Headings, primary body)
  - Secondary Text: `#d6d4c5` / `#c8c6b7` (Readable descriptions)
  - Subdued Metadata: `#b4b19e` / `#88846f` (System tags, telemetry labels)
- **10% Purposeful Syntax Accents**:
  - Monokai Pink (`#f92672`): Primary actions, active directory markers, critical accents
  - Monokai Lime (`#a6e22e`): Positive status pings, code highlights, verified links
  - Monokai Yellow (`#e6db74`): Featured badges, timestamps, quotes, focus rings
  - Monokai Violet (`#ae81ff`): Section numbers, metadata tags, telemetry streams

---

## Anti-Slop & Craft Constraints
1. **NO AI Gradients**: No generic purple/indigo floating radial orbs or diffuse neon glows. Gradients are strictly directional Monokai linear bars or subtle ambient retro dot rasters.
2. **NO Broken Touch Gestures**: Interactive canvases (like `ParticlePortrait`) MUST NOT use `touch-none` in a way that blocks vertical page scrolling on mobile devices.
3. **NO Cramped Touch Targets**: All buttons, links, close icons, and checkboxes on mobile viewports must meet or exceed 44x44px touch targets or have adequate hit margins.
4. **NO Squished Layouts**: Layout must gracefully adapt across 5 distinct viewport tiers:
   - Ultra-wide (>= 1440px)
   - Standard Desktop (1024px - 1439px)
   - Tablet / Medium Screen (768px - 1023px)
   - Small Tablet / Mobile Landscape (481px - 767px)
   - Compact Mobile Phone (320px - 480px)

---

## Responsive Breakpoint Strategy

### 1. Intro Splash Screen
- **Compact Mobile (320px - 480px)**:
  - Font scaling: `clamp(2.5rem, 11vw, 4.5rem)` to prevent multi-line overflow for greetings like "नमस्ते" or "こんにちは".
  - Window frame: fluid padding `px-4 py-8`, max-width `94vw`.
  - Added interaction: Quick dismiss button ("TAP ANYWHERE OR [ESC] TO SKIP") and `role="dialog"`.
  - Short viewports (< 600px height): `max-h-[95vh] overflow-y-auto` so content never clips on landscape phones.

### 2. Header & Navigation Rail
- **Mobile (< 768px)**:
  - Header: Compact branding `AN_` + `AATIR NADIM` with responsive sub-bar that truncates or wraps cleanly.
  - Navigation: High-contrast modal slide-down / drawer with backdrop blur and backdrop click-to-close, avoiding layout jump.
  - Hamburger button: 44x44px minimum tap target with clear active/open state.
- **Tablet (768px - 1023px)**:
  - Responsive horizontal tab directory in header or persistent compact rail so navigation is immediate without opening a drawer.
- **Desktop (>= 1024px)**:
  - Persistent left rail (`200px`) with directory indices, focus notes, and live local session time.

### 3. Main Content Grid
- **Tablet (768px - 1023px)**:
  - 2-column layout: Main content takes prominent area, with personal widgets organized in a responsive 2-column or 3-column grid below.
- **Desktop (>= 1024px)**:
  - 3-column layout: Navigation (200px) + Main (1fr) + Personal Sidebar (258px).
- **Ultra-Wide (>= 1440px)**:
  - Centered 1360px container with ambient starfield background.

### 4. Component-Level Responsive Refinements
- **Particle Portrait**:
  - Change `touch-none` to `touch-pan-y` so users can scroll past the portrait on touch screens.
  - Touch-tap triggers dispersal shockwaves gracefully.
  - Mobile canvas pixel density and particle count tuned for consistent 60fps.
- **Contact Modal**:
  - Full-screen or bottom-sheet-friendly modal on mobile (`max-h-[92vh]`).
  - Close button expanded to 40x40px with 44px tap buffer.
  - Inputs formatted with legible 16px/1rem touch-safe font sizes to avoid unwanted browser zooming.
  - Bottom action buttons stack cleanly on narrow (< 380px) screens.
- **Desk Companion & Cursor Cat**:
  - Cursor tracking detects touch-only environments (`pointer: coarse`) and displays a touch-appropriate status ("STANDBY · TAP COMPANION ON TOUCH SCREENS" or tap-interaction mode) instead of mouse chase.
- **Expertise Section**:
  - Grid columns adapt from `grid-cols-1 gap-1 sm:grid-cols-[27px_127px_1fr]` on narrow mobile so group labels don't get crushed.
- **Projects & Experience**:
  - Timeline markers stay properly aligned on narrow screens.
  - Project cards wrap tech stack pills and metadata cleanly.
