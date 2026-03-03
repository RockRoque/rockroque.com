# CLAUDE.md — Rock Roqué's Mind Portal

> This is the master context file for the rockroque.com monorepo. Every Claude Code session should read this first. If you are a new instance, start here.

---

## WHO IS ROCK

Rock Roqué is a Design Engineer and Civic Technologist. Director of Product Engineering at the Maryland Department of Information Technology (DoIT). He leads Maryland.gov modernization, stewards the Maryland Web Design System (MDWDS, built on USWDS), and is implementing Claude Code Enterprise across state engineering teams.

Rock is a renaissance person — designer, engineer, strategist, parent, philosopher, survival skills enthusiast, automation tinkerer. His personal site must reflect ALL of these dimensions, not reduce him to one.

This site is simultaneously an explorable mind map AND a portfolio — a body of work. Every section should demonstrate craft, thinking, and shipping. The graph navigation is the unique differentiator, but each domain landing should showcase real projects, real writing, and real artifacts that prove Rock's capabilities.

Rock's long-term goal is a Design Engineer role at Anthropic on the Claude product team. Everything built here should demonstrate the depth of his thinking, the quality of his craft, and the breadth of his perspective. The site itself is portfolio piece #1.

---

## THE VISION

### Concept: "The Mind Portal"

This is NOT a traditional portfolio site. It is an explorable map of a mind.

**Entry point:** A full-screen interactive 3D neural knowledge graph — nodes representing every domain of Rock's life, work, study, and thought. The graph IS the navigation. Each major cluster is a gateway into a fully realized sub-experience with its own unique design language and UX theme.

**Core principle:** Rock cannot be reduced to one theme. Each domain gets its own aesthetic identity, but they all connect back to the central graph. The graph shows how everything relates — that's the point.

**The feeling:** Entering this site should feel like being invited into someone's mind. Curiosity-driven exploration, not linear scrolling.

---

## INFORMATION ARCHITECTURE

### The Portal (Landing)
- Full-screen 3D neural graph (brain-shaped or organic neural cluster)
- Animated intro: nodes materialize and connect like synapses firing
- Nodes are clickable gateways — click a domain cluster to enter that world
- Search bar: type a topic and the graph highlights the path to it
- Scroll-wheel zoom, drag to rotate, pinch on mobile
- Light/dark mode toggle persists across all sub-sites

### 1. ROCK'S WORK (domain: /work)
**Theme aesthetic:** CRT terminal / amber-on-dark hacker aesthetic (what we've already built)
**Sections:**
- **Design** — How Rock approaches projects in the world of AI. Case studies, design system philosophy, Figma-to-code workflows
- **Software Engineering** — Workflows with AI and ML. Claude Code patterns, GitHub Actions, CI/CD, design-to-code automation
- **Organization** — Rock's Claude setup, Obsidian vault structure, tools and productivity systems, how he organizes projects and ideas
- **Current Work** — Live "now" page showing active projects: AI.Maryland.gov, LatchLog, MDWDS, Claude Code Enterprise rollout. This doubles as a portfolio — each project should have a case-study-style writeup showing process, decisions, and outcomes.
- **Philosophy** — Rock's engineering philosophy. Craft over speed, accessibility as default, government deserves startup-quality tech

### 2. ROCK'S STUDY (domain: /study)
**Theme aesthetic:** Academic/research notebook — think clean serif typography, marginalia, paper-like textures, footnotes, a scholarly but modern feel
**Sections:**
- **Currently Studying** — Active learning topics with progress notes (neuromorphic computing, design engineering, Swift/iOS)
- **Humanities** — History, philosophy, ethics, literature — the non-technical thinking that informs the technical work
- **Perspective** — Essays and reflections on the state of technology, AI's role in society, what it means to build responsibly

### 3. ROCK'S SIGNAL (domain: /signal)
**Theme aesthetic:** Editorial / magazine — bold typography, high contrast, opinionated layout
**Sections:**
- **Writing** — Blog posts, friction logs, hot takes
- **AI Philosophy** — Dedicated space for Rock's views on AI: human agency, Anthropic's safety stance, building with conviction, neuromorphic thinking
- **Threads/Notes** — Shorter-form observations, links, responses to industry discourse

### 4. ROCK'S WORKSHOP (domain: /workshop)
**Theme aesthetic:** Blueprint/schematic — dark background, neon-accent wireframes, technical drawings feel
**Sections:**
- **Experiments** — Live prototypes and demos (embedded iframes or links to deployed experiments)
- **Open Source** — Contributions, tools, and utilities Rock has built
- **AI Workflows** — Shareable Claude Code setups, prompt patterns, n8n automations (this is the seed of the "CodePen for AI" idea)

### 5. ROCK'S LIFE (domain: /life) — INVITE ONLY
**Theme aesthetic:** Warm, personal, organic — earth tones, handwritten-feel fonts, photography
**Access:** Requires an invite code. Codes are time-limited and can be generated/revoked by Rock.
**Content:** TBD — personal stories, family, parenthood, hobbies, survival skills, the human behind the work
**Implementation:** Simple code entry screen, code validated against a list stored in environment variable or simple backend. No auth system needed for v1.

### 6. Suggested Addition: ROCK'S ROOTS (domain: /roots)
**Theme aesthetic:** Earthy, grounded — maps, timelines, cultural textures
**Content:** Rock's background, origin story, the path from where he started to where he is. Cultural identity, formative experiences, what shaped his worldview. This is optional but powerful for someone who wants to tell a complete story.

---

## TECH STACK

### Framework: Astro
- Static-first, content-focused, perfect for a multi-section site
- Content Collections for blog posts (Markdown/MDX)
- Each domain can have its own layout and styles
- Islands architecture: interactive components (graph, invite gate) hydrate only where needed

### Monorepo Structure
```
rockroque.com/
├── CLAUDE.md                    ← YOU ARE HERE
├── astro.config.mjs
├── package.json
├── tsconfig.json
├── public/
│   ├── fonts/
│   └── assets/
├── src/
│   ├── components/
│   │   ├── portal/              ← Neural graph, search, animations
│   │   │   ├── BrainGraph.astro
│   │   │   ├── GraphCanvas.tsx  ← React island for interactivity
│   │   │   └── graph-data.ts
│   │   ├── shared/              ← Theme toggle, nav, footer
│   │   └── domains/             ← Domain-specific components
│   │       ├── work/
│   │       ├── study/
│   │       ├── signal/
│   │       ├── workshop/
│   │       └── life/
│   ├── layouts/
│   │   ├── PortalLayout.astro   ← Full-screen graph landing
│   │   ├── WorkLayout.astro     ← CRT terminal theme
│   │   ├── StudyLayout.astro    ← Academic notebook theme
│   │   ├── SignalLayout.astro   ← Editorial magazine theme
│   │   ├── WorkshopLayout.astro ← Blueprint/schematic theme
│   │   └── LifeLayout.astro     ← Warm personal theme
│   ├── pages/
│   │   ├── index.astro          ← The portal (graph landing)
│   │   ├── work/
│   │   │   ├── index.astro
│   │   │   ├── design.astro
│   │   │   ├── engineering.astro
│   │   │   ├── organization.astro
│   │   │   ├── now.astro
│   │   │   └── philosophy.astro
│   │   ├── study/
│   │   │   ├── index.astro
│   │   │   ├── current.astro
│   │   │   ├── humanities.astro
│   │   │   └── perspective.astro
│   │   ├── signal/
│   │   │   ├── index.astro
│   │   │   ├── [...slug].astro  ← Dynamic blog post routes
│   │   │   └── ai-philosophy.astro
│   │   ├── workshop/
│   │   │   ├── index.astro
│   │   │   ├── experiments.astro
│   │   │   └── ai-workflows.astro
│   │   └── life/
│   │       ├── index.astro      ← Invite code gate
│   │       └── [...slug].astro
│   ├── content/
│   │   ├── config.ts            ← Content collection schemas
│   │   ├── signal/              ← Blog posts as .md files
│   │   │   ├── deploying-claude-code-gov.md
│   │   │   ├── design-systems-state-level.md
│   │   │   ├── friction-log-claude-daily.md
│   │   │   └── building-with-conviction.md
│   │   ├── study/
│   │   └── workshop/
│   └── styles/
│       ├── global.css           ← CSS variables, resets, shared
│       ├── themes/
│       │   ├── portal.css       ← Graph landing styles
│       │   ├── work.css         ← CRT amber terminal
│       │   ├── study.css        ← Academic notebook
│       │   ├── signal.css       ← Editorial magazine
│       │   ├── workshop.css     ← Blueprint schematic
│       │   └── life.css         ← Warm personal
│       └── components/
├── scripts/
│   └── generate-invite-code.ts  ← Utility for /life access codes
└── .github/
    └── workflows/
        └── deploy.yml           ← GitHub Pages deployment
```

### Key Dependencies
- `astro` — core framework
- `@astrojs/react` — for interactive islands (graph, invite gate)
- `@astrojs/mdx` — for rich blog posts
- `three` or raw Canvas API — for the 3D neural graph (evaluate complexity vs. Canvas)
- No Tailwind — hand-written CSS per theme for maximum craft signal
- Fonts: IBM Plex Mono, Space Mono (terminal), plus domain-specific fonts TBD

### Deployment
- GitHub Pages via GitHub Actions
- Domain: rockroque.com (or rockroque.dev — register whichever is available)
- Static output, no server needed for v1

---

## DESIGN SYSTEM TOKENS (Shared Across Themes)

Each theme has its own palette, but these tokens are shared:

```css
/* Spacing scale */
--space-xs: 0.25rem;
--space-sm: 0.5rem;
--space-md: 1rem;
--space-lg: 2rem;
--space-xl: 4rem;
--space-2xl: 8rem;

/* Breakpoints */
--bp-sm: 480px;
--bp-md: 768px;
--bp-lg: 1024px;
--bp-xl: 1280px;

/* Transitions */
--ease-out: cubic-bezier(0.16, 1, 0.3, 1);
--ease-in-out: cubic-bezier(0.65, 0, 0.35, 1);
--duration-fast: 150ms;
--duration-normal: 300ms;
--duration-slow: 500ms;

/* Z-index scale */
--z-base: 1;
--z-overlay: 10;
--z-modal: 100;
--z-tooltip: 200;
--z-scanline: 9999;
```

---

## BUILD PLAN — PHASED DELIVERY

### Phase 0: Foundation (DO THIS FIRST)
1. Scaffold Astro project with the monorepo structure above
2. Set up GitHub repo, GitHub Pages deployment workflow
3. Create global CSS with shared tokens
4. Get a blank site deployed and live at the domain
5. **Ship it. Even if it's empty. Get the URL working.**

### Phase 1: Portal + Work (Week 1-2)
1. Build the portal landing page with the 3D neural graph
   - Port the existing Canvas-based spherical graph into a React island
   - Make clusters clickable — clicking a domain transitions to that section
   - Brain/organic shape for node layout (not just a sphere)
2. Build Rock's Work section using the CRT terminal theme we already have
   - Start with the "Now" page (active projects)
   - Add the "Organization" page (Claude setup, tools)
3. Deploy. Share the URL.

### Phase 2: Signal (Week 2-3)
1. Build the editorial theme for Signal
2. Set up Content Collections for blog posts
3. Write and publish the first real blog post: "Deploying Claude Code Across a Government Engineering Team"
4. Deploy.

### Phase 3: Study + Workshop (Week 3-5)
1. Build the academic theme for Study
2. Build the blueprint theme for Workshop
3. Populate with initial content
4. Deploy.

### Phase 4: Life + Polish (Week 5-6)
1. Build invite code system for Life section
2. Build warm personal theme
3. Cross-domain navigation polish
4. Performance optimization
5. SEO, meta tags, Open Graph images

### Phase 5: Advanced Graph (Post-launch)
1. Hierarchical zoom (click into clusters to reveal sub-nodes)
2. Detail panel overlays when clicking specific nodes
3. 3-level depth (domains → clusters → specific items)
4. Link graph nodes directly to content pages

---

## CLAUDE CODE SESSION CONVENTIONS

### Auto-Documentation
Every Claude Code session working on this project should:
1. Update this CLAUDE.md if architectural decisions change
2. Log significant decisions in a `DECISIONS.md` file with date, context, and rationale
3. Keep a running `CHANGELOG.md` for what was built/changed per session

### Commit Messages
Use conventional commits:
- `feat(portal): add brain-shaped graph layout`
- `feat(work): build CRT terminal theme`
- `fix(graph): improve node spacing at zoom level 2`
- `docs: update CLAUDE.md with new section structure`
- `style(signal): editorial theme typography`

### Code Quality
- No TypeScript `any` types — strict mode
- Semantic HTML throughout
- WCAG 2.2 AA accessibility minimum
- Performance budget: <100KB CSS total across all themes, <200KB JS
- No unused dependencies

### When Starting a New Session
Read this file. Then check `DECISIONS.md` and `CHANGELOG.md` for recent context. Then proceed with the task.

---

## GRAPH DATA MODEL

The neural graph uses this data structure. Update this when adding new nodes:

```typescript
interface GraphNode {
  id: string;
  label: string;
  group: 'core' | 'work' | 'study' | 'signal' | 'workshop' | 'life';
  desc: string;
  size: number;          // visual weight
  route?: string;        // URL path when clicked
  children?: string[];   // IDs of child nodes (for hierarchical zoom)
}

interface GraphEdge {
  source: string;  // node ID
  target: string;  // node ID
  strength?: number;  // 0-1, affects visual weight
}
```

### Current Nodes (expand as content grows):

**Core:** Rock Roqué (center)

**Work cluster:** Design Systems, USWDS, MDWDS, Storybook, Figma, Accessibility, Claude Code, GitHub Actions, Drupal, Astro, Frontend

**Study cluster:** Neuromorphic Computing, AI Ethics, Humanities, System Design, Swift/iOS

**Signal cluster:** AI Philosophy, Friction Logs, Gov Tech Writing

**Workshop cluster:** LatchLog, AI.Maryland.gov, n8n Automations, Claude Workflows

**Life cluster:** Parenthood, Survival Skills, Home Lab (gated)

---

## KEY CONTEXT FOR NEW SESSIONS

- Rock uses Claude Code CLI daily. He is deeply familiar with the tool.
- Rock works at Maryland DoIT — state government. His perspective on AI in government is rare and valuable.
- Rock's partner is Sarah. He is a new parent and lactation consultant.
- Rock has a UGREEN DXP4800 Plus NAS running Plex and n8n.
- Rock's career goal is Anthropic — specifically the Claude product team under Boris Cherny.
- Rock tends toward over-planning and under-shipping. If he's spiraling into scope creep, redirect him to ship what exists.
- The CRT terminal theme (amber-on-dark, scanlines, boot sequence, knowledge graph) has been built and validated. It lives in the v5 HTML file from the initial conversation.
- Rock values Anthropic's stance on AI safety, their response to government/military ethics questions, and building for people.

---

## IMPORTANT: SHIPPING CADENCE

Rock's biggest risk is never shipping. Every phase above ends with "Deploy." That's non-negotiable. An imperfect live site beats a perfect local build. If Rock asks to add features before deploying, push back. Ship first, iterate live.

---

*Last updated: March 2, 2026 — Initial architecture session via claude.ai*
*Next action: Phase 0 — Scaffold Astro project, deploy empty site to GitHub Pages*
