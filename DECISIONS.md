# Architecture Decision Records

## ADR-001: Astro as Framework

**Date:** 2026-03-02
**Status:** Accepted

**Context:** Need a framework for a multi-section personal site with distinct themed domains, content collections (blog posts, study notes), and interactive islands (3D neural graph).

**Decision:** Use Astro 5 with React islands architecture.

**Rationale:**
- Static-first, content-focused — perfect for a portfolio/blog hybrid
- Islands architecture: interactive components hydrate only where needed
- Content Collections API for typed Markdown/MDX content
- Each domain can have its own layout and design language
- Excellent performance out of the box

---

## ADR-002: No Tailwind — Hand-Written CSS

**Date:** 2026-03-02
**Status:** Accepted

**Context:** Each domain (Work, Study, Signal, Workshop, Life) has a unique visual identity. Need maximum control over design language per domain.

**Decision:** Use hand-written CSS with CSS custom properties (design tokens) and `[data-theme]` selectors. No utility-first CSS framework.

**Rationale:**
- Maximum craft signal — this site IS the portfolio
- Each theme is a distinct aesthetic (CRT terminal, academic notebook, editorial, blueprint, warm earth)
- CSS custom properties enable clean theme switching
- Performance budget: <100KB CSS total
- Demonstrates CSS expertise, which is relevant to target role

---

## ADR-003: GitHub Pages Deployment

**Date:** 2026-03-02
**Status:** Accepted

**Context:** Need a hosting solution for a static Astro site.

**Decision:** Deploy to GitHub Pages via GitHub Actions using `withastro/action@v5`.

**Rationale:**
- Free hosting, integrated with GitHub
- Automatic deployments on push to main
- Custom domain support when ready
- Simple, reliable, well-documented

---

## ADR-004: pnpm Package Manager

**Date:** 2026-03-02
**Status:** Accepted

**Context:** Need a Node.js package manager.

**Decision:** Use pnpm.

**Rationale:**
- Fast installs with content-addressable storage
- Strict dependency resolution prevents phantom dependencies
- Used across all personal projects for consistency

---

## ADR-005: Astro v5 Content Layer API

**Date:** 2026-03-02
**Status:** Accepted

**Context:** Need typed content collections for blog posts (Signal), study notes, and workshop projects.

**Decision:** Use Astro v5 Content Layer API with `glob()` loaders and Zod schemas in `src/content.config.ts`.

**Rationale:**
- Current API (legacy content collections deprecated in v5)
- Typed schemas with Zod for frontmatter validation
- `glob()` loader for file-based collections
- Supports MD and MDX out of the box

---

## ADR-006: "Choose an Experience" Redesign

**Date:** 2026-03-03
**Status:** Accepted (supersedes 3D neural graph concept)

**Context:** The original Phase 1 design called for a 3D neural knowledge graph as the site's navigation center. This added Three.js/R3F (~220KB), was technically complex, and didn't communicate Rock's range as directly as needed.

**Decision:** Replace the graph with a typographic "Choose an Experience" gateway. Three themed experiences (Engineering, Design, Workshop) replace the six original domains.

**Rationale:**
- Direct, bold — the experiences speak for themselves
- Saves ~220KB of JS (Three.js/R3F/drei removed)
- Each experience is a fully realized aesthetic world (CRT, editorial, blueprint)
- Cinematic splash gate with THX-style Web Audio crescendo sets the tone
- Cursor-driven theme bleed on landing page is interactive without being gimmicky
- Easier to build, ship, and iterate than a 3D graph

---

## ADR-007: Web Audio for THX Synthesis

**Date:** 2026-03-03
**Status:** Accepted

**Context:** The cinematic entry needs sound. Options: pre-recorded audio files, or generative synthesis via Web Audio API.

**Decision:** THX crescendo is 100% synthesized via OscillatorNodes + BiquadFilterNode. Ambient loops per experience are pre-recorded .ogg files.

**Rationale:**
- THX synthesis: zero file weight, impressive craft signal, unique each time
- Ambient loops: easier to perfect musically, small file size (~80KB each)
- Web Audio API is well-supported across modern browsers
- Sound is always opt-in (splash gate is the consent mechanism)

---

## ADR-008: Framer Motion for Animations

**Date:** 2026-03-03
**Status:** Accepted

**Context:** Need spring physics, staggered entrances, and flood transitions between landing and experiences.

**Decision:** Add Framer Motion as the animation library for React islands.

**Rationale:**
- Spring-based animations feel more natural than CSS easing
- AnimatePresence handles exit animations (flood transitions)
- `clip-path` animation for the flood effect
- Well-integrated with React component lifecycle
