# Design: "Choose an Experience" — Landing Redesign + 3 Themed Experiences

**Date:** 2026-03-03
**Status:** Approved
**Supersedes:** `2026-03-03-phase-1-portal-work-design.md` (3D neural graph concept)
**Scope:** Cinematic entry, interactive landing page, 3 experience routes (Engineering, Design, Workshop)

---

## Overview

Replace the 3D neural knowledge graph landing with a typographic "Choose an Experience" gateway. Each experience is a fully themed world with its own visual identity, sound design, and UX paradigm. Start with 3 experiences; expand later.

---

## Design Decisions

| Decision | Choice | Rationale |
|----------|--------|-----------|
| Landing concept | "Choose an Experience" massive type | Direct, bold, lets the experiences speak for themselves |
| Entry sequence | Cinematic splash with THX-style crescendo | Sets the tone — this is not a normal portfolio site |
| Number of experiences (Phase 1) | 3: Engineering, Design, Workshop | Minimum viable breadth; more added later |
| Engineering aesthetic | CRT terminal (amber-on-dark) | Already prototyped; fits engineering content perfectly |
| Design aesthetic | Dark editorial magazine | Bold typography, asymmetric layout, high contrast |
| Workshop aesthetic | Literal blueprint paper + interactive schematics | Deep blue bg, white/cyan lines, zoom/pan canvas |
| Sound: THX crescendo | Web Audio API (generative) | Zero file weight, impressive craft signal |
| Sound: Ambient per experience | Pre-recorded .ogg loops | Easier to perfect, small file size (~50-100KB each) |
| Sound trigger | Cinematic splash gate ("Enter with sound") | Full immersion from first interaction |
| Architecture | Astro + CSS themes + React islands (Approach A) | Preserves Phase 0 work, isolates heavy interactivity |
| 3D graph | Removed | Saves ~220KB (three.js/R3F/drei), simpler, more focused |
| Framer Motion | Added | Spring physics, staggered entrances, scroll reveals |

---

## 1. Cinematic Entry Sequence

### Splash Gate (`/` — first load)

Full-viewport dark screen. Minimal centered text: "Enter" (or a subtle glyph).

**Interaction flow:**
1. User clicks/taps anywhere
2. Web Audio THX crescendo triggers (~3 seconds):
   - Low rumble → layered oscillators sweep upward → resolves into warm harmonic chord → fades
3. Background pulses with light synced to audio amplitude
4. After crescendo resolves, landing page content fades in with staggered typography

**Fallbacks:**
- No interaction after 5 seconds → show subtle "or skip" text link → skip to landing without audio
- `prefers-reduced-motion` → instant landing page, no animation
- No Web Audio support → skip to landing

**Technical:**
- React island: `SplashGate.tsx` with `client:only="react"`
- Web Audio: OscillatorNodes + GainNodes + BiquadFilterNodes
- No audio files needed for THX

---

## 2. "Choose an Experience" Landing Page

### Layout

Full viewport, dark background (`#0a0a0f`). No header, no nav, no footer.

**Content hierarchy:**
1. Top-left: "Rock Roqué" — small, understated
2. Center-dominant: **"CHOOSE AN EXPERIENCE"** — massive display type (15-20vw), tight letter-spacing
3. Three experience zones arranged around the headline

### Cursor-Driven Theme Bleed

The landing page is a living canvas. Each experience is a gravitational field:

| Zone | Visual Bleed | Audio Preview |
|------|-------------|--------------|
| **Engineering** (left) | Amber shift, faint scanlines materialize, particles speed up | Low digital hum fades in |
| **Design** (right) | Typography weight shifts bolder, contrast increases, editorial grid lines | Refined ambient note |
| **Workshop** (below) | Cyan grid lines emerge, dimension markers at edges | Mechanical drafting whisper |

**Idle state:** Three themes gently cycle — slow aurora-like rotation between amber, white, cyan.

**Click transition:** Theme that's bleeding floods the entire viewport (clip-path or scale animation) → hard cut to experience route → ambient sound begins.

**Mobile:** Stacked vertically. Tap to enter. No hover bleed (touch interactions instead).

**Technical:**
- React island: `ExperienceLanding.tsx` with `client:only="react"`
- `mousemove` → distance calculation per zone → CSS custom property interpolation
- Web Audio `GainNode` per experience for crossfading sound previews
- `requestAnimationFrame` loop for smooth rendering
- Framer Motion for flood-transition on click

---

## 3. Engineering Experience (CRT Terminal)

**Route:** `/engineering`

### Aesthetic
- Amber-on-dark: `#ff9900` on `#0a0a0c`
- CRT scanline overlay (CSS repeating-linear-gradient)
- Subtle screen curvature (border-radius + box-shadow)
- Phosphor glow on text (text-shadow)
- Slight flicker animation

### Entry Transition
Amber scanlines flood the landing → hard cut → CRT boot sequence (text lines appearing rapidly) → resolves into engineering space.

### Layout
Terminal-style UI. Navigation feels like `cd`-ing into directories. Projects are "files" you `cat` or `open`. Active projects have blinking cursor status indicators.

### Sound
Algorithmic generative soundscape — Web Audio oscillators: low ambient drone + occasional digital artifacts (bit-crushed clicks, soft static). Reacts to scroll/interaction.

### Content
- Claude Code workflows and patterns
- CI/CD pipelines and GitHub Actions
- System architecture documentation
- Technical writing / friction logs
- Active project status (AI.Maryland.gov, Claude Code Enterprise)

---

## 4. Design Experience (Dark Editorial)

**Route:** `/design`

### Aesthetic
- Near-black background (`#0c0c0c`)
- High contrast white text
- Bold display serif headlines (Playfair Display, Freight Big, or similar)
- Asymmetric grid layouts
- Magazine energy: Bloomberg Businessweek meets Monocle

### Entry Transition
Bold white rules/lines rapidly grid the viewport → type slams in at massive scale → settles into editorial layout.

### Layout
- Large hero type for section headers
- Asymmetric two/three column layouts
- Case study pages with large imagery, pull quotes, process breakdowns
- Horizontal scroll sections for timelines/galleries

### Sound
Sophisticated ambient — warm analog synth pad, minimal, gallery installation feel. Pre-recorded seamless loop (~30-60 seconds).

### Content
- Design system philosophy and case studies
- Figma-to-code workflows (MDWDS, design-system-pipeline)
- Accessibility-first craft philosophy
- Design thinking essays

---

## 5. Workshop Experience (Blueprint)

**Route:** `/workshop`

### Aesthetic
- Deep blueprint blue: `#0a1628` to `#0d2137`
- White/cyan lines: `#5bb8f5`, `#ffffff` at 60% opacity
- CSS grid overlay simulating graph paper
- Dimension markers in margins
- Annotation callouts with leader lines
- Monospace type throughout

### Entry Transition
Cyan grid lines rapidly draw across viewport (plotter/pen animation) → dimension markers appear at edges → "WORKSHOP" stamps like a technical title block → content fades in within grid.

### Layout
Literal architectural drawing structure:
- **Title block** (bottom-right): drawing number, date, scale — portfolio metadata
- **Content sections** as "detail views" with section callouts (SECTION A-A, DETAIL B)
- **Interactive schematics**: nodes and connections, click to zoom into detail
- **Zoom/pan canvas** for system architecture diagrams
- **Dashed leader lines** connecting related elements

### Sound
Mechanical/drafting ambient — pencil-on-paper scratching, compass clicks, soft machinery hum, occasional grid-snap sounds. Pre-recorded seamless loop.

### Interactive Schematics
React island (`BlueprintCanvas.tsx`): HTML Canvas or SVG-based zoomable/pannable viewport. Projects rendered as technical drawings with clickable components revealing detail views.

### Content
- Open source tools and contributions
- Experiments and live prototypes
- AI workflow automations (n8n, Claude patterns)
- LatchLog architecture diagrams
- rockroque.com site architecture (meta)

---

## 6. Sound Architecture

### Web Audio Engine (`AudioEngine.ts`)

Shared singleton managing all audio:

```
AudioEngine
├── THX Synthesizer
│   ├── 6-8 OscillatorNodes (sawtooth/sine)
│   ├── BiquadFilterNode (lowpass sweep)
│   ├── GainNode (envelope)
│   └── ConvolverNode (reverb)
├── Preview Crossfader
│   ├── GainNode per experience
│   └── Crossfade based on cursor distance
└── Ambient Player
    ├── AudioBufferSourceNode (loop)
    ├── GainNode (fade in/out)
    └── One active ambient at a time
```

### Sound Files
| File | Format | Est. Size | Source |
|------|--------|-----------|--------|
| `engineering-ambient.ogg` | OGG Vorbis | ~80KB | Pre-recorded generative loop |
| `design-ambient.ogg` | OGG Vorbis | ~80KB | Warm analog synth pad loop |
| `workshop-ambient.ogg` | OGG Vorbis | ~80KB | Mechanical/drafting ambient loop |

THX crescendo is 100% synthesized — no file needed.

---

## 7. Refactoring Scope

### Files to Delete
- `src/pages/study/`, `src/pages/signal/`, `src/pages/life/`, `src/pages/roots/`
- `src/layouts/StudyLayout.astro`, `src/layouts/SignalLayout.astro`, `src/layouts/LifeLayout.astro`
- `src/styles/themes/study.css`, `src/styles/themes/signal.css`, `src/styles/themes/life.css`
- `src/components/portal/` (graph components — replaced by landing)

### Files to Rename/Repurpose
| Current | Becomes |
|---------|---------|
| `src/pages/work/` | `src/pages/engineering/` |
| `src/layouts/WorkLayout.astro` | `src/layouts/EngineeringLayout.astro` |
| `src/styles/themes/work.css` | `src/styles/themes/engineering.css` |
| `src/styles/themes/portal.css` | `src/styles/themes/landing.css` |
| `src/layouts/WorkshopLayout.astro` | Stays — gets blueprint treatment |

### New Files
| File | Purpose |
|------|---------|
| `src/components/landing/SplashGate.tsx` | Web Audio THX + entry gate |
| `src/components/landing/ExperienceLanding.tsx` | Cursor-driven theme bleed landing |
| `src/components/landing/AudioEngine.ts` | Shared Web Audio context + helpers |
| `src/components/workshop/BlueprintCanvas.tsx` | Zoomable/pannable schematic viewer |
| `src/styles/themes/design.css` | Editorial magazine theme |
| `src/pages/design/index.astro` | Design experience landing |
| `src/layouts/DesignLayout.astro` | Editorial layout |
| `public/audio/*.ogg` | 3 ambient sound loops |

### Dependencies
| Add | Remove |
|-----|--------|
| `framer-motion` | `three` (not yet installed) |
| | `@react-three/fiber` (not yet installed) |
| | `@react-three/drei` (not yet installed) |

---

## 8. Performance Budget

| Metric | Target |
|--------|--------|
| Initial JS (landing) | <60KB gzipped (React + Framer Motion + AudioEngine) |
| Per-experience JS | <30KB additional (lazy loaded) |
| Audio files total | <300KB (3 loops × ~80-100KB) |
| CSS per theme | <15KB |
| First meaningful paint | <2s on 4G |
| Lighthouse accessibility | >= 90 |

---

## 9. Accessibility

- Splash gate: skip link bypasses to landing content
- Landing: all experience zones keyboard-navigable (Tab + Enter)
- Reduced motion: all animations disabled, instant transitions
- Sound: always opt-in (splash gate is the consent mechanism)
- Blueprint canvas: keyboard zoom/pan, screen reader descriptions for schematics
- CRT: high contrast amber passes WCAG AA against dark background
- Editorial: standard a11y — semantic HTML, heading hierarchy, alt text
- Focus-visible outlines on all interactive elements

---

## 10. What This Design Does NOT Include

- Content population (real case studies, blog posts, project writeups)
- Study, Signal, Life, Roots experiences (future expansion)
- Blog/content collection infrastructure
- SEO/Open Graph optimization (future phase)
- Invite code system for gated content
- Mobile gesture interactions (swipe between experiences)
- Hierarchical zoom in blueprint schematics (v2)

---

## 11. Ship Criteria

This design is shipped when:
1. Splash gate plays THX crescendo and transitions to landing
2. Landing page responds to cursor with theme bleed across all 3 experiences
3. Clicking an experience triggers flood transition to correct route
4. All 3 experience routes render with their themed aesthetic
5. Ambient sound plays in each experience (with sound enabled)
6. Site deploys to GitHub Pages
7. Lighthouse accessibility >= 90
8. Works on mobile (stacked layout, tap interactions)
9. `prefers-reduced-motion` respected throughout
