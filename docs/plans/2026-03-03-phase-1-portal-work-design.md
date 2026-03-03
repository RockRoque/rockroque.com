# Phase 1 Design: Portal Landing + Work Domain

**Date:** 2026-03-03
**Status:** Approved
**Scope:** Portal graph landing page, Work domain landing, Work/Now page

---

## Design Decisions

| Decision | Choice | Rationale |
|----------|--------|-----------|
| Portal vs Work split | Separate experiences per CLAUDE.md | Each domain gets its own themed world; portal is the neutral entry |
| Portal aesthetic | Clean, artistic, dark + soft white | Inviting to general audience, not just engineers |
| Graph technology | React Three Fiber | Real 3D, best DX for React island, supports Phase 5 growth |
| Portal-to-domain transition | Smooth camera zoom + fade | "Entering the mind" feeling |
| Work landing Phase 1 scope | Landing + Now only | Ship first, iterate live |
| CRT terminal location | /work/engineering (future) | Too niche for first impression; saved for the engineer audience |
| Boot sequence | On /work/engineering only (future) | Plays every visit with click-to-skip |
| Work landing aesthetic | "The Studio" — motion-rich, sophisticated | Showcases design engineering craft |
| Brand accent color | Soft white / silver (#e8e4df) | Maximum sophistication, lets motion and layout carry the design |

---

## 1. Portal Landing Page (`/`)

### What It Is
Full-viewport 3D neural knowledge graph rendered via React Three Fiber as an Astro React island. No header, no nav, no footer — the graph IS the page.

### Aesthetic
- Dark background (`#0c0c0e`) with subtle aurora gradient backdrop (slow-shifting muted tones — deep indigo, dark teal, near-black)
- Soft white/silver accent (`#e8e4df`) for nodes, text, UI elements
- Feeling: cosmic and intimate — a constellation map of someone's mind

### The Graph
- **Data:** 23 nodes, 31 edges (from prototype), fibonacci sphere layout with group clustering
- **Layout:** Brain-shaped organic cluster with domain groups offset for visual separation
- **Nodes:** Soft white glow on hover, domain clusters have subtle muted color tints
- **Hover:** Html overlay tooltip — label, description, connections list
- **Click node:** Activate synapse particle trails along edges
- **Click domain cluster:** Camera smoothly zooms into cluster → scene fades to domain's theme color → navigates to `/work`, `/study`, etc.
- **Controls:** OrbitControls — drag to rotate, scroll to zoom, pinch on mobile
- **Idle:** Auto-rotation with gentle drift
- **Search:** Floating input at bottom, soft white border, type to highlight matching nodes and fire synapse particles

### Below the Fold (Scroll)
Minimal fallback navigation for accessibility and no-JS users:
- "Rock Roqué" in large type
- "Design Engineer · Civic Technologist" subtitle
- 6 domain links (Work, Study, Signal, Workshop, Life, Roots)
- Status indicator

### Technical
- React island via `client:only="react"` (no SSR for WebGL)
- Graph component: `src/components/portal/BrainGraph.tsx`
- Graph data: `src/components/portal/graph-data.ts`
- Aurora background: GLSL shader or Three.js gradient mesh

---

## 2. Work Landing Page (`/work`)

### What It Is
"The Studio" — a motion-rich, sophisticated landing page for the Work domain. Dark, refined, animated. Every pixel demonstrates design engineering craft.

### Aesthetic
- Dark base with warm undertones (`#0c0c0e` to `#141412`)
- Soft white/silver accent for text and interactive elements
- Animated gradient mesh / aurora as subtle living background — reacts to mouse position
- Spring physics for all motion (Framer Motion)

### Content & Layout
- **Hero:** Bio/introduction with animated text reveals (words sliding up, staggered entrance)
- **Section cards:** 5 sub-sections (Design, Engineering, Organization, Now, Philosophy) as interactive cards
  - Each card has a micro-animation on hover (scale + glow + hint of domain color)
  - "Now" links to `/work/now`
  - Others show "Coming soon" state
- **Writing teaser:** Preview cards for upcoming blog posts (ported from prototype)
- **Navigation:** "← Back to Portal" link, internal Work nav

### Motion
- Staggered entrance animations on page load (Framer Motion)
- Scroll-triggered reveals for content sections
- Parallax depth — elements at different layers move at different speeds
- Typography animations — large confident type with animated reveals
- Mouse-reactive background gradient

### CRT References
- The Engineering card hints at what's coming: subtle scanline texture or amber tint on hover
- No CRT chrome on this page — it's the Studio, not the Terminal

---

## 3. Work Now Page (`/work/now`)

### What It Is
Active projects showcase. Same Studio aesthetic as Work landing.

### Content
- Breadcrumb or contextual nav back to /work
- Project list, each with:
  - Project name
  - Status badge (Active, Shipping, Learning)
  - One-liner description
  - Link (external or internal)
- Projects for launch:
  - AI.Maryland.gov — state AI resource site
  - LatchLog — baby tracking app, iPhone + Apple Watch
  - MDWDS — Maryland Web Design System
  - Claude Code Enterprise — AI coding tool rollout across state teams
  - rockroque.com — this site (meta, but honest)

### Motion
- Same Framer Motion spring animations as Work landing
- Staggered project card entrance

---

## 4. Shared Components

### New Components
| Component | Location | Purpose |
|-----------|----------|---------|
| `BrainGraph.tsx` | `src/components/portal/` | R3F neural graph (React island) |
| `GraphNode.tsx` | `src/components/portal/` | Individual 3D node with glow + label |
| `GraphEdge.tsx` | `src/components/portal/` | Edge line with synapse particles |
| `SearchInput.tsx` | `src/components/portal/` | Graph search overlay |
| `AuroraBackground.tsx` | `src/components/shared/` | Animated gradient mesh (reusable) |
| `AnimatedSection.tsx` | `src/components/shared/` | Scroll-triggered reveal wrapper |
| `SectionCard.tsx` | `src/components/domains/work/` | Hoverable card for Work sub-sections |
| `ProjectCard.tsx` | `src/components/domains/work/` | Now page project card |
| `graph-data.ts` | `src/components/portal/` | Node/edge definitions + types |

### Updated Files
| File | Changes |
|------|---------|
| `src/pages/index.astro` | Replace SVG glyph with R3F BrainGraph island |
| `src/pages/work/index.astro` | Replace placeholder with Studio landing |
| `src/pages/work/now.astro` | New page — active projects |
| `src/styles/global.css` | Add shared animation tokens, update portal colors |
| `src/styles/themes/portal.css` | Revise to soft white/silver palette |
| `src/styles/themes/work.css` | Revise to Studio aesthetic (save CRT for /work/engineering) |
| `src/layouts/PortalLayout.astro` | Minimal — full viewport, no nav chrome |
| `src/layouts/WorkLayout.astro` | Studio layout with nav + Framer Motion provider |

---

## 5. New Dependencies

| Package | Purpose | Size Impact |
|---------|---------|-------------|
| `three` | 3D rendering engine | ~150KB (tree-shaken) |
| `@react-three/fiber` | React renderer for Three.js | ~40KB |
| `@react-three/drei` | R3F helpers (OrbitControls, Html, etc.) | ~30KB (tree-shaken) |
| `framer-motion` | Spring animations, scroll reveals | ~30KB |

**Total JS budget impact:** ~250KB (compressed ~80KB gzip). Exceeds original 200KB budget but justified by the graph being the core experience. The graph only loads on the portal page (island architecture), so domain pages stay lightweight.

---

## 6. Performance Strategy

- Graph loads via `client:only="react"` — zero SSR overhead, no layout shift
- Domain pages (Work, Study, etc.) remain static Astro with minimal JS
- Framer Motion tree-shaken to only import used features
- Three.js tree-shaken via R3F's selective imports
- Aurora background uses a lightweight shader, not a full scene
- Images: none in Phase 1 (pure CSS/WebGL)
- Target: <3s first meaningful paint on 3G

---

## 7. Accessibility

- Graph has full keyboard navigation (Tab between nodes, Enter to activate)
- Below-fold fallback nav provides all links without JS
- Reduced motion: `prefers-reduced-motion` disables auto-rotation, particles, entrance animations — graph renders static
- All interactive elements have focus-visible outlines
- Skip link jumps past graph to fallback nav
- ARIA labels on graph container, search input, domain cluster buttons
- Color contrast: soft white on dark exceeds WCAG AA (ratio >7:1)

---

## 8. What Phase 1 Does NOT Include

- CRT terminal experience (moves to Phase 1.5 or 2, lives at /work/engineering)
- Boot sequence (same — /work/engineering only)
- Signal, Study, Workshop, Life domain content
- Blog post infrastructure
- Content collections populated
- Hierarchical graph zoom (Phase 5)
- Detail panel overlays (Phase 5)

---

## 9. Ship Criteria

Phase 1 is done when:
1. Portal landing renders the 3D graph with working hover, click, search, rotate, zoom
2. Clicking a domain cluster transitions to that domain's page
3. /work landing shows the Studio design with animated bio + section cards
4. /work/now shows active projects
5. Site deploys successfully to GitHub Pages
6. Lighthouse accessibility score >= 90
7. Works on mobile (touch controls, responsive layout)
