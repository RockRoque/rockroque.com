# CLAUDE.md — Rock Roqué: Choose an Experience

> This is the master context file for the rockroque.com project. Every Claude Code session should read this first. If you are a new instance, start here.

---

## WHO IS ROCK

Rock Roqué is a Design Engineer and Civic Technologist. Director of Product Engineering at the Maryland Department of Information Technology (DoIT). He leads Maryland.gov modernization, stewards the Maryland Web Design System (MDWDS, built on USWDS), and is implementing Claude Code Enterprise across state engineering teams.

Rock is a renaissance person — designer, engineer, strategist, parent, philosopher, survival skills enthusiast, automation tinkerer. His personal site reflects this range through distinct themed experiences.

Rock's long-term goal is a Design Engineer role at Anthropic on the Claude product team. Everything built here should demonstrate the depth of his thinking, the quality of his craft, and the breadth of his perspective. The site itself is portfolio piece #1.

---

## THE VISION

### Concept: "Choose an Experience"

This is NOT a traditional portfolio site. It is a gateway into three fully themed worlds.

**Entry:** Cinematic splash gate with THX-style Web Audio crescendo → interactive landing page with massive "CHOOSE AN EXPERIENCE" typography → cursor-driven theme bleed from 3 gravitational fields → flood transition on click into chosen experience.

**Core principle:** Rock cannot be reduced to one theme. Each experience has its own aesthetic identity, sound design, and UX paradigm. The landing page is a living canvas where the three worlds compete for attention based on cursor proximity.

**The feeling:** Entering this site should feel cinematic, intentional, and crafted. Sound-first design. Every detail is a signal.

---

## INFORMATION ARCHITECTURE

### Splash Gate (`/` — first load)
- Full-viewport dark screen with "Enter" button
- Click triggers Web Audio THX crescendo (~3 seconds)
- Background pulses with light synced to audio amplitude
- Skip link appears after 5 seconds
- `prefers-reduced-motion` skips directly to landing

### Landing Page (`/` — after splash)
- Massive "CHOOSE AN EXPERIENCE" typography (15-20vw)
- Three experience zones as gravitational fields
- Cursor proximity drives theme bleed (amber, white, cyan)
- Idle aurora cycle when cursor is inactive
- Click triggers flood transition (clip-path circle expand) → navigate to experience

### 1. ENGINEERING (`/engineering`)
**Theme:** CRT terminal — amber `#ff9900` on dark `#0a0a0c`
**Features:** Scanline overlay, phosphor glow, boot sequence, blinking cursor, screen vignette
**Sound:** Algorithmic generative soundscape (Web Audio oscillators)
**Content:** Claude Code patterns, CI/CD pipelines, system architecture, design systems, active projects

### 2. DESIGN (`/design`)
**Theme:** Dark editorial magazine — near-black background, Playfair Display serif, high contrast
**Features:** Bold italic display headings, asymmetric two-column grid, white rule dividers
**Sound:** Sophisticated ambient synth pad loop
**Content:** Design system philosophy, Figma-to-code workflows, accessibility-first craft, design thinking

### 3. WORKSHOP (`/workshop`)
**Theme:** Blueprint paper — deep blue `#0a1628`, white/cyan grid lines
**Features:** CSS grid overlay (graph paper), dimension markers, annotation callouts, fixed title block
**Sound:** Mechanical/drafting ambient loop
**Content:** Open source tools, experiments, AI workflow automations, architecture diagrams

### Future Experiences (not yet built)
- Study, Signal, Life, Roots — may be added in later phases

---

## TECH STACK

### Framework: Astro 5
- Static-first, content-focused
- Content Collections for blog posts (Markdown/MDX)
- Islands architecture: React components hydrate only where needed (`client:only="react"`)

### Key Dependencies
- `astro` — core framework
- `@astrojs/react` — React island integration
- `framer-motion` — spring animations, AnimatePresence, flood transitions
- `react` / `react-dom` — interactive components
- No Tailwind — hand-written CSS per theme
- No Three.js — blueprint schematics use SVG/Canvas
- Fonts: IBM Plex Mono, Space Mono (mono), Playfair Display (serif/design)

### Project Structure
```
rockroque.com/
├── CLAUDE.md                    ← YOU ARE HERE
├── astro.config.mjs
├── package.json
├── tsconfig.json
├── public/
│   └── audio/                   ← Ambient .ogg loops per experience
├── src/
│   ├── components/
│   │   ├── landing/             ← Splash gate + experience chooser
│   │   │   ├── AudioEngine.ts   ← Web Audio singleton (THX, previews, ambient)
│   │   │   ├── SplashGate.tsx   ← Cinematic entry with THX crescendo
│   │   │   ├── SplashGate.css
│   │   │   ├── ExperienceLanding.tsx ← Cursor-driven theme bleed
│   │   │   ├── ExperienceLanding.css
│   │   │   └── LandingIsland.tsx    ← Wrapper: splash → landing flow
│   │   ├── shared/              ← Shared components
│   │   └── domains/
│   │       ├── engineering/
│   │       └── workshop/
│   ├── layouts/
│   │   ├── LandingLayout.astro      ← Splash + experience chooser
│   │   ├── EngineeringLayout.astro  ← CRT terminal theme
│   │   ├── DesignLayout.astro       ← Editorial magazine theme
│   │   └── WorkshopLayout.astro     ← Blueprint/schematic theme
│   ├── pages/
│   │   ├── index.astro              ← LandingIsland (client:only)
│   │   ├── engineering/index.astro  ← CRT terminal page
│   │   ├── design/index.astro       ← Editorial magazine page
│   │   └── workshop/index.astro     ← Blueprint paper page
│   ├── content/
│   │   ├── content.config.ts        ← Content collection schemas
│   │   └── workshop/
│   └── styles/
│       ├── global.css               ← CSS variables, resets, shared
│       └── themes/
│           ├── landing.css          ← Dark landing theme
│           ├── engineering.css      ← CRT amber terminal + scanlines
│           ├── design.css           ← Editorial magazine + serif
│           └── workshop.css         ← Blueprint paper + grid
└── .github/
    └── workflows/
        └── deploy.yml           ← GitHub Pages deployment
```

### Deployment
- GitHub Pages via GitHub Actions (`withastro/action@v5`)
- Live at: https://rockroque.github.io/rockroque.com
- Static output, no server needed
- Dev server: `pnpm dev` → http://localhost:4321/rockroque.com

---

## SOUND ARCHITECTURE

### AudioEngine.ts (singleton)
```
AudioEngine
├── THX Synthesizer (6 oscillators → filter → gain → master)
├── Preview Crossfader (GainNode per experience, cursor-distance based)
└── Ambient Player (AudioBufferSourceNode, loop, one active at a time)
```

- THX crescendo is 100% synthesized — no file needed
- Ambient loops are pre-recorded `.ogg` files in `public/audio/`
- Sound is always opt-in (splash gate = consent mechanism)

---

## CLAUDE CODE SESSION CONVENTIONS

### Auto-Documentation
1. Update this CLAUDE.md if architectural decisions change
2. Log decisions in `DECISIONS.md` with date, context, and rationale
3. Keep `CHANGELOG.md` updated per session

### Commit Messages
Use conventional commits with experience scopes:
- `feat(engineering): add project cards with CLI navigation`
- `feat(design): add case study template`
- `feat(workshop): add zoomable blueprint canvas`
- `feat(landing): improve theme bleed responsiveness`
- `fix(audio): handle Safari AudioContext restrictions`

### Code Quality
- No TypeScript `any` types — strict mode
- Semantic HTML throughout
- WCAG 2.2 AA accessibility minimum
- `prefers-reduced-motion` respected in every animation
- Performance budget: <60KB JS landing, <30KB per experience, <300KB audio total
- No unused dependencies

### When Starting a New Session
Read this file. Then check `DECISIONS.md` and `CHANGELOG.md` for recent context.

---

## KEY CONTEXT FOR NEW SESSIONS

- Rock uses Claude Code CLI daily. He is deeply familiar with the tool.
- Rock works at Maryland DoIT — state government. His perspective on AI in government is rare and valuable.
- Rock's career goal is Anthropic — specifically the Claude product team.
- Rock tends toward over-planning and under-shipping. Push him to ship.
- The CRT terminal theme has been fully implemented with scanlines, boot sequence, and phosphor glow.
- Sound is a first-class design element — not an afterthought.
- Base path is `/rockroque.com` (GitHub Pages subpath).

---

## IMPORTANT: SHIPPING CADENCE

Rock's biggest risk is never shipping. An imperfect live site beats a perfect local build. If Rock asks to add features before deploying, push back. Ship first, iterate live.

---

*Last updated: March 3, 2026 — "Choose an Experience" implementation*
*Current state: Phase 1 complete — splash gate, landing, 3 themed experiences*
