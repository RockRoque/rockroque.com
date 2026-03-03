# Changelog

All notable changes to this project will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.1.0/).

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
