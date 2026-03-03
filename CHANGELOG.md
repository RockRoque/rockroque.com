# Changelog

All notable changes to this project will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.1.0/).

## [0.2.0] — 2026-03-03

### Added

- Cinematic splash gate with Web Audio THX-style crescendo (`SplashGate.tsx`)
- Interactive "Choose an Experience" landing with cursor-driven theme bleed (`ExperienceLanding.tsx`)
- Shared Web Audio singleton (`AudioEngine.ts`) for THX synthesis, preview crossfader, and ambient player
- `LandingIsland.tsx` wrapper orchestrating splash → landing flow
- Engineering experience: CRT terminal with scanlines, boot sequence, phosphor glow, blinking cursor
- Design experience: dark editorial magazine with Playfair Display serif, asymmetric grid layout
- Workshop experience: blueprint paper with CSS grid overlay, annotation callouts, fixed title block
- Framer Motion for spring animations and flood transitions on click
- Placeholder ambient audio files (`.ogg`) for all 3 experiences
- Design experience route (`/design`), layout, and theme
- Architecture Decision Records ADR-006 through ADR-008

### Changed

- Renamed `/work` → `/engineering` (route, layout, theme, components)
- Renamed Portal → Landing (layout, theme, CSS selectors)
- Updated index.astro from placeholder SVG to React island with splash + landing
- Expanded engineering.css with CRT body overlays, flicker animation, phosphor glow
- Expanded workshop.css with grid paper background, dimension markers, callout component

### Removed

- Study, Signal, Life domain pages, layouts, themes, content collections, and component dirs
- Portal graph component placeholder
- References to 3D neural graph / Three.js concept

---

## [0.1.0] — 2026-03-02

### Added

- Astro 5.18 project scaffold with React, MDX, and Sitemap integrations
- Directory structure for all 6 domains (Work, Study, Signal, Workshop, Life, Roots)
- Global CSS design system: tokens, reset, typography, accessibility utilities
- 6 theme CSS files: Portal (dark neural), Work (CRT amber), Study (academic), Signal (editorial), Workshop (blueprint), Life (earth tones)
- Portal landing page with neural glyph SVG and status indicator
- PortalLayout + 5 domain layouts with `[data-theme]` theming
- Placeholder pages for all 5 domain routes
- Content collections (signal, study, workshop) with Astro v5 Content Layer API
- GitHub Actions workflow for GitHub Pages deployment
- WCAG 2.2 AA focus-visible styles and prefers-reduced-motion support
- Skip link utility
- Architecture Decision Records (ADR-001 through ADR-005)
