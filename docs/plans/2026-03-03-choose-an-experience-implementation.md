# "Choose an Experience" Implementation Plan

> **For Claude:** REQUIRED SUB-SKILL: Use superpowers:executing-plans to implement this plan task-by-task.

**Goal:** Replace the Phase 0 placeholder portal landing with a cinematic "Choose an Experience" gateway into 3 fully themed worlds (Engineering, Design, Workshop).

**Architecture:** Astro 5 static pages with React islands for interactive components (SplashGate, ExperienceLanding, BlueprintCanvas). Web Audio API for THX synthesis and ambient sound. CSS custom properties for theme bleed. Framer Motion for spring animations and flood transitions. All CSS is hand-written (no Tailwind).

**Tech Stack:** Astro 5.18, React 19, Framer Motion, Web Audio API, TypeScript, hand-written CSS

**Design Spec:** `docs/plans/2026-03-03-choose-an-experience-design.md`

---

## Task 1: Create Feature Branch and Install Dependencies

**Files:**
- Modify: `package.json`

**Step 1: Create feature branch**

```bash
cd ~/Developer/rockroque.com
git checkout -b feat/choose-an-experience
```

**Step 2: Install framer-motion**

```bash
pnpm add framer-motion
```

**Step 3: Verify install**

```bash
pnpm build
```

Expected: Build succeeds with no errors.

**Step 4: Commit**

```bash
git add package.json pnpm-lock.yaml
git commit -m "chore: add framer-motion dependency"
```

---

## Task 2: Delete Unused Domain Files

Remove the study, signal, life, and roots pages, layouts, themes, content dirs, and component dirs that are no longer part of the 3-experience architecture.

**Files to delete:**
- `src/pages/study/index.astro`
- `src/pages/signal/index.astro`
- `src/pages/life/index.astro`
- `src/layouts/StudyLayout.astro`
- `src/layouts/SignalLayout.astro`
- `src/layouts/LifeLayout.astro`
- `src/styles/themes/study.css`
- `src/styles/themes/signal.css`
- `src/styles/themes/life.css`
- `src/components/domains/study/.gitkeep`
- `src/components/domains/life/.gitkeep`
- `src/components/domains/signal/.gitkeep`
- `src/components/portal/.gitkeep`
- `src/content/study/.gitkeep`
- `src/content/signal/.gitkeep`

**Files to modify:**
- `src/content.config.ts` — remove `signal` and `study` collections (keep `workshop`)

**Step 1: Delete files**

```bash
cd ~/Developer/rockroque.com
rm -rf src/pages/study src/pages/signal src/pages/life
rm src/layouts/StudyLayout.astro src/layouts/SignalLayout.astro src/layouts/LifeLayout.astro
rm src/styles/themes/study.css src/styles/themes/signal.css src/styles/themes/life.css
rm -rf src/components/domains/study src/components/domains/life src/components/domains/signal
rm -rf src/components/portal
rm -rf src/content/study src/content/signal
```

**Step 2: Update content.config.ts**

Remove `signal` and `study` collections. Keep `workshop` only:

```typescript
import { defineCollection, z } from 'astro:content';
import { glob } from 'astro/loaders';

const workshop = defineCollection({
  loader: glob({ pattern: '**/*.{md,mdx}', base: './src/content/workshop' }),
  schema: z.object({
    title: z.string(),
    description: z.string(),
    pubDate: z.coerce.date(),
    updatedDate: z.coerce.date().optional(),
    tags: z.array(z.string()).default([]),
    repo: z.string().url().optional(),
    demo: z.string().url().optional(),
  }),
});

export const collections = { workshop };
```

**Step 3: Verify build**

```bash
pnpm build
```

Expected: Build succeeds. No references to deleted files.

**Step 4: Commit**

```bash
git add -A
git commit -m "refactor: remove unused domain files (study, signal, life)"
```

---

## Task 3: Rename Work to Engineering

Rename the Work domain to Engineering across pages, layouts, themes, and components.

**Files:**
- Move: `src/pages/work/` → `src/pages/engineering/`
- Move: `src/layouts/WorkLayout.astro` → `src/layouts/EngineeringLayout.astro`
- Move: `src/styles/themes/work.css` → `src/styles/themes/engineering.css`
- Move: `src/components/domains/work/` → `src/components/domains/engineering/`
- Modify: New `EngineeringLayout.astro` — update `data-theme` and CSS import
- Modify: New `src/pages/engineering/index.astro` — update layout import

**Step 1: Move files**

```bash
cd ~/Developer/rockroque.com
mv src/pages/work src/pages/engineering
mv src/layouts/WorkLayout.astro src/layouts/EngineeringLayout.astro
mv src/styles/themes/work.css src/styles/themes/engineering.css
mv src/components/domains/work src/components/domains/engineering
```

**Step 2: Update EngineeringLayout.astro**

Change `data-theme="work"` → `data-theme="engineering"` and update the CSS import path:

```astro
---
interface Props {
  title: string;
}

const { title } = Astro.props;
---

<!doctype html>
<html lang="en" data-theme="engineering">
  <head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <link rel="icon" type="image/svg+xml" href="/rockroque.com/favicon.svg" />
    <title>{title} — Rock Roqué</title>
    <style>
      @import '../styles/global.css';
      @import '../styles/themes/engineering.css';
    </style>
  </head>
  <body>
    <a href="#main" class="skip-link">Skip to content</a>
    <nav aria-label="Experience navigation">
      <a href="/rockroque.com/">← Choose Experience</a>
    </nav>
    <main id="main">
      <slot />
    </main>
  </body>
</html>
```

**Step 3: Update engineering.css**

Change selector from `[data-theme="work"]` to `[data-theme="engineering"]`:

```css
/* Engineering — CRT amber terminal theme */
[data-theme="engineering"] {
  --color-bg: #0d0d00;
  --color-surface: #1a1a05;
  --color-text: #ffb84d;
  --color-text-muted: #cc8a00;
  --color-accent: #ff9500;
  --color-accent-glow: rgba(255, 149, 0, 0.3);
  --color-border: #3d3d00;
}
```

**Step 4: Update engineering/index.astro**

```astro
---
import EngineeringLayout from '../../layouts/EngineeringLayout.astro';
---

<EngineeringLayout title="Engineering">
  <div class="placeholder">
    <h1>Engineering</h1>
    <p>CRT terminal experience — under construction</p>
  </div>
</EngineeringLayout>

<style>
  .placeholder {
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    min-height: 80vh;
    text-align: center;
    padding: var(--space-lg);
  }

  .placeholder h1 {
    font-size: var(--text-2xl);
    margin-bottom: var(--space-sm);
  }

  .placeholder p {
    color: var(--color-text-muted);
  }
</style>
```

**Step 5: Rename portal.css to landing.css**

```bash
mv src/styles/themes/portal.css src/styles/themes/landing.css
```

Update the CSS selector inside `landing.css`:

```css
/* Landing — dark theme for experience chooser */
[data-theme="landing"] {
  --color-bg: #0a0a0f;
  --color-surface: #12121a;
  --color-text: #e0e0e8;
  --color-text-muted: #8888a0;
  --color-accent: #6c63ff;
  --color-accent-glow: rgba(108, 99, 255, 0.3);
  --color-border: #2a2a3a;
}
```

**Step 6: Update PortalLayout.astro → LandingLayout.astro**

```bash
mv src/layouts/PortalLayout.astro src/layouts/LandingLayout.astro
```

Update `LandingLayout.astro`:

```astro
---
interface Props {
  title: string;
}

const { title } = Astro.props;
---

<!doctype html>
<html lang="en" data-theme="landing">
  <head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <meta name="description" content="Rock Roqué — Design Engineer & Civic Technologist. Choose an experience." />
    <link rel="icon" type="image/svg+xml" href="/rockroque.com/favicon.svg" />
    <title>{title}</title>
    <style>
      @import '../styles/global.css';
      @import '../styles/themes/landing.css';
    </style>
  </head>
  <body>
    <a href="#main" class="skip-link">Skip to content</a>
    <main id="main">
      <slot />
    </main>
  </body>
</html>
```

**Step 7: Update index.astro to use LandingLayout**

```astro
---
import LandingLayout from '../layouts/LandingLayout.astro';
---

<LandingLayout title="Rock Roqué — Choose an Experience">
  <div class="landing-placeholder">
    <h1>Choose an Experience</h1>
    <p>Splash gate + experience landing coming soon</p>
  </div>
</LandingLayout>

<style>
  .landing-placeholder {
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    min-height: 100vh;
    text-align: center;
    padding: var(--space-lg);
  }

  .landing-placeholder h1 {
    font-size: var(--text-3xl);
    margin-bottom: var(--space-sm);
  }

  .landing-placeholder p {
    color: var(--color-text-muted);
  }
</style>
```

**Step 8: Verify build**

```bash
pnpm build
```

Expected: Build succeeds. Routes `/engineering` and `/workshop` work. Landing at `/`.

**Step 9: Commit**

```bash
git add -A
git commit -m "refactor: rename work→engineering, portal→landing, restructure to 3 experiences"
```

---

## Task 4: Create Design Experience Scaffolding

Create the design experience route, layout, and theme CSS.

**Files:**
- Create: `src/styles/themes/design.css`
- Create: `src/layouts/DesignLayout.astro`
- Create: `src/pages/design/index.astro`

**Step 1: Create design.css**

```css
/* Design — dark editorial magazine theme */
[data-theme="design"] {
  --color-bg: #0c0c0c;
  --color-surface: #161616;
  --color-text: #f0f0f0;
  --color-text-muted: #999999;
  --color-accent: #ffffff;
  --color-accent-glow: rgba(255, 255, 255, 0.15);
  --color-border: #333333;

  --font-serif: 'Playfair Display', Georgia, serif;
}
```

**Step 2: Create DesignLayout.astro**

```astro
---
interface Props {
  title: string;
}

const { title } = Astro.props;
---

<!doctype html>
<html lang="en" data-theme="design">
  <head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <link rel="icon" type="image/svg+xml" href="/rockroque.com/favicon.svg" />
    <link rel="preconnect" href="https://fonts.googleapis.com" />
    <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin />
    <link href="https://fonts.googleapis.com/css2?family=Playfair+Display:ital,wght@0,400;0,700;0,900;1,400&display=swap" rel="stylesheet" />
    <title>{title} — Rock Roqué</title>
    <style>
      @import '../styles/global.css';
      @import '../styles/themes/design.css';
    </style>
  </head>
  <body>
    <a href="#main" class="skip-link">Skip to content</a>
    <nav aria-label="Experience navigation">
      <a href="/rockroque.com/">← Choose Experience</a>
    </nav>
    <main id="main">
      <slot />
    </main>
  </body>
</html>
```

**Step 3: Create design/index.astro**

```astro
---
import DesignLayout from '../../layouts/DesignLayout.astro';
---

<DesignLayout title="Design">
  <div class="placeholder">
    <h1>Design</h1>
    <p>Dark editorial experience — under construction</p>
  </div>
</DesignLayout>

<style>
  .placeholder {
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    min-height: 80vh;
    text-align: center;
    padding: var(--space-lg);
  }

  .placeholder h1 {
    font-family: var(--font-serif, Georgia, serif);
    font-size: var(--text-3xl);
    font-weight: 900;
    margin-bottom: var(--space-sm);
  }

  .placeholder p {
    color: var(--color-text-muted);
  }
</style>
```

**Step 4: Verify build**

```bash
pnpm build
```

Expected: Build succeeds. `/design` route works.

**Step 5: Commit**

```bash
git add src/styles/themes/design.css src/layouts/DesignLayout.astro src/pages/design/index.astro
git commit -m "feat(design): add design experience scaffolding with editorial theme"
```

---

## Task 5: Build AudioEngine.ts

The shared Web Audio singleton managing THX synthesis, preview crossfading, and ambient sound playback.

**Files:**
- Create: `src/components/landing/AudioEngine.ts`

**Step 1: Create AudioEngine.ts**

```typescript
/**
 * Shared Web Audio singleton.
 * Manages THX synthesis, preview crossfader, and ambient player.
 */

type ExperienceId = 'engineering' | 'design' | 'workshop';

interface AudioEngineState {
  initialized: boolean;
  thxPlaying: boolean;
  activeAmbient: ExperienceId | null;
}

class AudioEngine {
  private static instance: AudioEngine | null = null;
  private ctx: AudioContext | null = null;
  private masterGain: GainNode | null = null;
  private state: AudioEngineState = {
    initialized: false,
    thxPlaying: false,
    activeAmbient: null,
  };

  // Preview crossfader gains (one per experience)
  private previewGains: Map<ExperienceId, GainNode> = new Map();
  private previewOscillators: Map<ExperienceId, OscillatorNode[]> = new Map();

  // Ambient player
  private ambientSource: AudioBufferSourceNode | null = null;
  private ambientGain: GainNode | null = null;
  private ambientBuffers: Map<ExperienceId, AudioBuffer> = new Map();

  private constructor() {}

  static getInstance(): AudioEngine {
    if (!AudioEngine.instance) {
      AudioEngine.instance = new AudioEngine();
    }
    return AudioEngine.instance;
  }

  /** Must be called from a user gesture (click/tap). */
  async init(): Promise<boolean> {
    if (this.state.initialized) return true;

    try {
      this.ctx = new AudioContext();
      this.masterGain = this.ctx.createGain();
      this.masterGain.gain.value = 0.7;
      this.masterGain.connect(this.ctx.destination);

      // Create preview gain nodes for each experience
      const experiences: ExperienceId[] = ['engineering', 'design', 'workshop'];
      for (const id of experiences) {
        const gain = this.ctx.createGain();
        gain.gain.value = 0;
        gain.connect(this.masterGain);
        this.previewGains.set(id, gain);
      }

      // Ambient gain node
      this.ambientGain = this.ctx.createGain();
      this.ambientGain.gain.value = 0;
      this.ambientGain.connect(this.masterGain);

      this.state.initialized = true;
      return true;
    } catch {
      return false;
    }
  }

  isInitialized(): boolean {
    return this.state.initialized;
  }

  /**
   * THX-style crescendo: ~3 seconds.
   * 6 oscillators sweep from low rumble to a resolved harmonic chord.
   */
  async playTHX(): Promise<void> {
    if (!this.ctx || !this.masterGain || this.state.thxPlaying) return;
    this.state.thxPlaying = true;

    const now = this.ctx.currentTime;
    const duration = 3;

    // Target chord frequencies (C major spread across octaves)
    const targets = [65.41, 130.81, 196.00, 261.63, 329.63, 523.25];
    // Start frequencies: random low rumble range
    const starts = targets.map(() => 30 + Math.random() * 20);

    const thxGain = this.ctx.createGain();
    thxGain.gain.setValueAtTime(0, now);
    thxGain.gain.linearRampToValueAtTime(0.6, now + duration * 0.7);
    thxGain.gain.linearRampToValueAtTime(0.3, now + duration * 0.95);
    thxGain.gain.exponentialRampToValueAtTime(0.001, now + duration + 1.5);

    // Lowpass filter sweep
    const filter = this.ctx.createBiquadFilter();
    filter.type = 'lowpass';
    filter.frequency.setValueAtTime(200, now);
    filter.frequency.exponentialRampToValueAtTime(8000, now + duration * 0.8);
    filter.Q.value = 0.7;

    filter.connect(thxGain);
    thxGain.connect(this.masterGain);

    const oscillators: OscillatorNode[] = [];

    for (let i = 0; i < targets.length; i++) {
      const osc = this.ctx.createOscillator();
      osc.type = i < 3 ? 'sawtooth' : 'sine';
      osc.frequency.setValueAtTime(starts[i], now);
      osc.frequency.exponentialRampToValueAtTime(targets[i], now + duration * 0.85);

      const oscGain = this.ctx.createGain();
      oscGain.gain.value = 1 / targets.length;
      osc.connect(oscGain);
      oscGain.connect(filter);

      osc.start(now);
      osc.stop(now + duration + 2);
      oscillators.push(osc);
    }

    // Wait for the crescendo to resolve (not the full tail)
    return new Promise((resolve) => {
      setTimeout(() => {
        this.state.thxPlaying = false;
        resolve();
      }, duration * 1000);
    });
  }

  /**
   * Set preview volume for an experience (0-1).
   * Used by the landing page cursor proximity system.
   */
  setPreviewVolume(experience: ExperienceId, volume: number): void {
    const gain = this.previewGains.get(experience);
    if (!gain || !this.ctx) return;

    const clamped = Math.max(0, Math.min(1, volume));
    gain.gain.linearRampToValueAtTime(clamped * 0.15, this.ctx.currentTime + 0.05);
  }

  /**
   * Start preview oscillators for an experience (for landing page hover sounds).
   */
  startPreviews(): void {
    if (!this.ctx) return;

    const previewConfigs: Record<ExperienceId, { freq: number; type: OscillatorType }> = {
      engineering: { freq: 80, type: 'sawtooth' },   // Low digital hum
      design: { freq: 220, type: 'sine' },            // Refined ambient note
      workshop: { freq: 150, type: 'triangle' },      // Mechanical whisper
    };

    for (const [id, config] of Object.entries(previewConfigs) as [ExperienceId, { freq: number; type: OscillatorType }][]) {
      const gain = this.previewGains.get(id);
      if (!gain) continue;

      const osc = this.ctx.createOscillator();
      osc.type = config.type;
      osc.frequency.value = config.freq;
      osc.connect(gain);
      osc.start();

      this.previewOscillators.set(id, [osc]);
    }
  }

  /** Stop all preview oscillators. */
  stopPreviews(): void {
    for (const [, oscillators] of this.previewOscillators) {
      for (const osc of oscillators) {
        try { osc.stop(); } catch { /* already stopped */ }
      }
    }
    this.previewOscillators.clear();
  }

  /**
   * Load an ambient audio file for an experience.
   * Call this during initial load, before the user navigates.
   */
  async loadAmbient(experience: ExperienceId, url: string): Promise<void> {
    if (!this.ctx || this.ambientBuffers.has(experience)) return;

    try {
      const response = await fetch(url);
      const arrayBuffer = await response.arrayBuffer();
      const audioBuffer = await this.ctx.decodeAudioData(arrayBuffer);
      this.ambientBuffers.set(experience, audioBuffer);
    } catch {
      // Ambient is non-critical; fail silently
    }
  }

  /**
   * Play the ambient loop for an experience.
   * Fades out any current ambient first.
   */
  async playAmbient(experience: ExperienceId): Promise<void> {
    if (!this.ctx || !this.ambientGain) return;

    // Fade out current ambient
    if (this.ambientSource) {
      this.ambientGain.gain.linearRampToValueAtTime(0, this.ctx.currentTime + 0.5);
      const oldSource = this.ambientSource;
      setTimeout(() => {
        try { oldSource.stop(); } catch { /* already stopped */ }
      }, 600);
    }

    const buffer = this.ambientBuffers.get(experience);
    if (!buffer) {
      this.state.activeAmbient = null;
      return;
    }

    this.ambientSource = this.ctx.createBufferSource();
    this.ambientSource.buffer = buffer;
    this.ambientSource.loop = true;
    this.ambientSource.connect(this.ambientGain);
    this.ambientSource.start();

    this.ambientGain.gain.linearRampToValueAtTime(0.4, this.ctx.currentTime + 1);
    this.state.activeAmbient = experience;
  }

  /** Stop all ambient sound. */
  stopAmbient(): void {
    if (!this.ctx || !this.ambientGain) return;

    this.ambientGain.gain.linearRampToValueAtTime(0, this.ctx.currentTime + 0.3);
    if (this.ambientSource) {
      const source = this.ambientSource;
      setTimeout(() => {
        try { source.stop(); } catch { /* already stopped */ }
      }, 400);
      this.ambientSource = null;
    }
    this.state.activeAmbient = null;
  }

  /** Clean up everything. */
  destroy(): void {
    this.stopPreviews();
    this.stopAmbient();
    if (this.ctx && this.ctx.state !== 'closed') {
      this.ctx.close();
    }
    this.ctx = null;
    this.masterGain = null;
    this.state.initialized = false;
    AudioEngine.instance = null;
  }
}

export { AudioEngine, type ExperienceId };
```

**Step 2: Verify it compiles**

```bash
pnpm build
```

Expected: Build succeeds (Astro tree-shakes unused TS; the import will be used in later tasks).

**Step 3: Commit**

```bash
git add src/components/landing/AudioEngine.ts
git commit -m "feat(audio): add AudioEngine singleton for THX synthesis and ambient playback"
```

---

## Task 6: Build SplashGate.tsx

The cinematic entry screen. Full-viewport dark screen, "Enter" text, click triggers THX crescendo, background pulses, then fades to landing.

**Files:**
- Create: `src/components/landing/SplashGate.tsx`
- Create: `src/components/landing/SplashGate.css`

**Step 1: Create SplashGate.css**

```css
.splash-gate {
  position: fixed;
  inset: 0;
  z-index: 100;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  background: #0a0a0f;
  cursor: pointer;
  user-select: none;
}

.splash-gate__enter {
  font-family: 'Space Mono', monospace;
  font-size: clamp(1.2rem, 3vw, 2rem);
  font-weight: 400;
  letter-spacing: 0.3em;
  text-transform: uppercase;
  color: rgba(224, 224, 232, 0.7);
  border: none;
  background: none;
  cursor: pointer;
  padding: 1rem 2rem;
  transition: color 0.3s ease;
}

.splash-gate__enter:hover,
.splash-gate__enter:focus-visible {
  color: rgba(224, 224, 232, 1);
}

.splash-gate__skip {
  position: absolute;
  bottom: 2rem;
  font-family: 'IBM Plex Mono', monospace;
  font-size: 0.75rem;
  color: rgba(136, 136, 160, 0.5);
  background: none;
  border: none;
  cursor: pointer;
  padding: 0.5rem 1rem;
  transition: color 0.3s ease;
}

.splash-gate__skip:hover,
.splash-gate__skip:focus-visible {
  color: rgba(136, 136, 160, 0.9);
}

.splash-gate__pulse {
  position: fixed;
  inset: 0;
  pointer-events: none;
  background: radial-gradient(circle at center, rgba(108, 99, 255, 0.08), transparent 70%);
  opacity: 0;
}

@media (prefers-reduced-motion: reduce) {
  .splash-gate {
    display: none;
  }
}
```

**Step 2: Create SplashGate.tsx**

```tsx
import { useState, useEffect, useRef, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { AudioEngine } from './AudioEngine';
import './SplashGate.css';

interface SplashGateProps {
  onComplete: () => void;
}

export default function SplashGate({ onComplete }: SplashGateProps) {
  const [phase, setPhase] = useState<'waiting' | 'playing' | 'exiting'>('waiting');
  const [showSkip, setShowSkip] = useState(false);
  const [pulseIntensity, setPulseIntensity] = useState(0);
  const skipTimerRef = useRef<ReturnType<typeof setTimeout>>();
  const animFrameRef = useRef<number>();

  // Check reduced motion preference
  const prefersReducedMotion =
    typeof window !== 'undefined' &&
    window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  // Show skip link after 5 seconds
  useEffect(() => {
    if (prefersReducedMotion) {
      onComplete();
      return;
    }

    skipTimerRef.current = setTimeout(() => setShowSkip(true), 5000);
    return () => {
      if (skipTimerRef.current) clearTimeout(skipTimerRef.current);
      if (animFrameRef.current) cancelAnimationFrame(animFrameRef.current);
    };
  }, [prefersReducedMotion, onComplete]);

  const handleEnter = useCallback(async () => {
    if (phase !== 'waiting') return;
    setPhase('playing');

    const engine = AudioEngine.getInstance();
    const initialized = await engine.init();

    if (initialized) {
      // Animate pulse during THX crescendo
      const start = performance.now();
      const duration = 3000;

      const animatePulse = (now: number) => {
        const elapsed = now - start;
        const progress = Math.min(elapsed / duration, 1);
        // Pulse builds, peaks at 70%, then fades
        const intensity = progress < 0.7
          ? progress / 0.7
          : 1 - ((progress - 0.7) / 0.3);
        setPulseIntensity(intensity * 0.6);

        if (progress < 1) {
          animFrameRef.current = requestAnimationFrame(animatePulse);
        }
      };
      animFrameRef.current = requestAnimationFrame(animatePulse);

      await engine.playTHX();
    }

    setPhase('exiting');
    // Let exit animation play, then signal completion
    setTimeout(onComplete, 600);
  }, [phase, onComplete]);

  const handleSkip = useCallback(() => {
    setPhase('exiting');
    setTimeout(onComplete, 300);
  }, [onComplete]);

  if (prefersReducedMotion) return null;

  return (
    <AnimatePresence>
      {phase !== 'exiting' ? null : null}
      <motion.div
        className="splash-gate"
        role="dialog"
        aria-label="Welcome — click or press Enter to begin with sound"
        onClick={phase === 'waiting' ? handleEnter : undefined}
        initial={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        animate={phase === 'exiting' ? { opacity: 0 } : { opacity: 1 }}
        transition={{ duration: 0.5 }}
        key="splash"
      >
        {/* Audio-synced background pulse */}
        <div
          className="splash-gate__pulse"
          style={{ opacity: pulseIntensity }}
        />

        {phase === 'waiting' && (
          <motion.button
            className="splash-gate__enter"
            onClick={handleEnter}
            aria-label="Enter with sound"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 1, delay: 0.3 }}
          >
            Enter
          </motion.button>
        )}

        {phase === 'playing' && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 0.5 }}
            style={{
              fontFamily: "'Space Mono', monospace",
              fontSize: '0.8rem',
              color: 'rgba(224, 224, 232, 0.5)',
              letterSpacing: '0.2em',
            }}
          >
            ▶
          </motion.div>
        )}

        {showSkip && phase === 'waiting' && (
          <motion.button
            className="splash-gate__skip"
            onClick={handleSkip}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.5 }}
          >
            or skip
          </motion.button>
        )}
      </motion.div>
    </AnimatePresence>
  );
}
```

**Step 3: Verify build**

```bash
pnpm build
```

Expected: Build succeeds.

**Step 4: Commit**

```bash
git add src/components/landing/SplashGate.tsx src/components/landing/SplashGate.css
git commit -m "feat(splash): add cinematic SplashGate with THX crescendo and skip fallback"
```

---

## Task 7: Build ExperienceLanding.tsx

The interactive "Choose an Experience" landing page. Massive typography with cursor-driven theme bleed (3 gravitational fields). Clicking floods the viewport and navigates to the experience.

**Files:**
- Create: `src/components/landing/ExperienceLanding.tsx`
- Create: `src/components/landing/ExperienceLanding.css`

**Step 1: Create ExperienceLanding.css**

```css
.experience-landing {
  position: relative;
  width: 100vw;
  height: 100vh;
  overflow: hidden;
  background: #0a0a0f;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
}

.experience-landing__name {
  position: absolute;
  top: 2rem;
  left: 2.5rem;
  font-family: 'Space Mono', monospace;
  font-size: 0.85rem;
  letter-spacing: 0.1em;
  color: rgba(224, 224, 232, 0.4);
  pointer-events: none;
}

.experience-landing__headline {
  font-family: 'Space Mono', monospace;
  font-size: clamp(3rem, 12vw, 12rem);
  font-weight: 700;
  letter-spacing: -0.04em;
  line-height: 0.9;
  text-align: center;
  color: rgba(224, 224, 232, 0.9);
  pointer-events: none;
  text-transform: uppercase;
  max-width: 95vw;
}

.experience-landing__zones {
  position: absolute;
  inset: 0;
  display: flex;
  pointer-events: none;
}

.experience-landing__zone {
  flex: 1;
  display: flex;
  align-items: flex-end;
  justify-content: center;
  padding-bottom: 3rem;
  pointer-events: auto;
  cursor: pointer;
  border: none;
  background: none;
  color: inherit;
  transition: transform 0.3s cubic-bezier(0.16, 1, 0.3, 1);
}

.experience-landing__zone:focus-visible {
  outline: 2px solid currentColor;
  outline-offset: -4px;
}

.experience-landing__zone-label {
  font-family: 'Space Mono', monospace;
  font-size: clamp(0.7rem, 1.2vw, 1rem);
  letter-spacing: 0.2em;
  text-transform: uppercase;
  opacity: 0.5;
  transition: opacity 0.3s ease;
}

.experience-landing__zone:hover .experience-landing__zone-label,
.experience-landing__zone:focus-visible .experience-landing__zone-label {
  opacity: 1;
}

/* Scanline overlay (engineering bleed) */
.experience-landing__scanlines {
  position: fixed;
  inset: 0;
  pointer-events: none;
  background: repeating-linear-gradient(
    0deg,
    transparent,
    transparent 2px,
    rgba(255, 149, 0, 0.03) 2px,
    rgba(255, 149, 0, 0.03) 4px
  );
  opacity: 0;
  transition: opacity 0.5s ease;
}

/* Grid overlay (workshop bleed) */
.experience-landing__grid {
  position: fixed;
  inset: 0;
  pointer-events: none;
  background:
    linear-gradient(rgba(91, 184, 245, 0.05) 1px, transparent 1px),
    linear-gradient(90deg, rgba(91, 184, 245, 0.05) 1px, transparent 1px);
  background-size: 40px 40px;
  opacity: 0;
  transition: opacity 0.5s ease;
}

/* Flood transition overlay */
.experience-landing__flood {
  position: fixed;
  inset: 0;
  pointer-events: none;
  z-index: 50;
}

/* Mobile layout */
@media (max-width: 768px) {
  .experience-landing__zones {
    flex-direction: column;
  }

  .experience-landing__zone {
    align-items: center;
    padding-bottom: 0;
  }

  .experience-landing__headline {
    font-size: clamp(2rem, 10vw, 5rem);
  }

  .experience-landing__name {
    top: 1rem;
    left: 1.5rem;
  }
}

@media (prefers-reduced-motion: reduce) {
  .experience-landing__scanlines,
  .experience-landing__grid {
    display: none;
  }
}
```

**Step 2: Create ExperienceLanding.tsx**

```tsx
import { useState, useRef, useCallback, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { AudioEngine, type ExperienceId } from './AudioEngine';
import './ExperienceLanding.css';

interface ExperienceZone {
  id: ExperienceId;
  label: string;
  color: string;
  route: string;
}

const BASE_PATH = '/rockroque.com';

const ZONES: ExperienceZone[] = [
  { id: 'engineering', label: 'Engineering', color: '#ff9900', route: `${BASE_PATH}/engineering` },
  { id: 'design', label: 'Design', color: '#ffffff', route: `${BASE_PATH}/design` },
  { id: 'workshop', label: 'Workshop', color: '#5bb8f5', route: `${BASE_PATH}/workshop` },
];

interface BleedState {
  engineering: number;  // 0-1 proximity
  design: number;
  workshop: number;
}

export default function ExperienceLanding() {
  const [bleed, setBleed] = useState<BleedState>({ engineering: 0, design: 0, workshop: 0 });
  const [flooding, setFlooding] = useState<ExperienceId | null>(null);
  const [idleCycle, setIdleCycle] = useState(0);
  const containerRef = useRef<HTMLDivElement>(null);
  const idleTimerRef = useRef<ReturnType<typeof setTimeout>>();
  const animFrameRef = useRef<number>();
  const lastMoveRef = useRef(0);

  const prefersReducedMotion =
    typeof window !== 'undefined' &&
    window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  // Idle aurora cycle
  useEffect(() => {
    if (prefersReducedMotion) return;

    let frame: number;
    const startTime = performance.now();

    const animate = (now: number) => {
      // Only run idle cycle if no mouse movement for 2s
      if (now - lastMoveRef.current > 2000) {
        const elapsed = (now - startTime) / 1000;
        const cycle = elapsed * 0.15; // slow rotation
        setIdleCycle(cycle);

        // Gentle aurora: each experience pulses with offset
        setBleed({
          engineering: 0.15 + 0.1 * Math.sin(cycle * Math.PI * 2),
          design: 0.15 + 0.1 * Math.sin((cycle + 0.33) * Math.PI * 2),
          workshop: 0.15 + 0.1 * Math.sin((cycle + 0.66) * Math.PI * 2),
        });
      }
      frame = requestAnimationFrame(animate);
    };

    frame = requestAnimationFrame(animate);
    return () => cancelAnimationFrame(frame);
  }, [prefersReducedMotion]);

  const handleMouseMove = useCallback((e: React.MouseEvent) => {
    if (prefersReducedMotion || flooding) return;

    lastMoveRef.current = performance.now();
    const rect = containerRef.current?.getBoundingClientRect();
    if (!rect) return;

    const x = e.clientX / rect.width;   // 0-1 horizontal
    const y = e.clientY / rect.height;  // 0-1 vertical

    // Zone centers: engineering (left), design (right), workshop (bottom)
    const zones = [
      { id: 'engineering' as const, cx: 0.15, cy: 0.5 },
      { id: 'design' as const, cx: 0.85, cy: 0.5 },
      { id: 'workshop' as const, cx: 0.5, cy: 0.9 },
    ];

    const newBleed: BleedState = { engineering: 0, design: 0, workshop: 0 };

    for (const zone of zones) {
      const dx = x - zone.cx;
      const dy = y - zone.cy;
      const dist = Math.sqrt(dx * dx + dy * dy);
      // Inverse distance, capped at 1, with falloff curve
      const proximity = Math.max(0, 1 - dist * 2);
      const curved = proximity * proximity; // quadratic falloff for snappier feel
      newBleed[zone.id] = curved;
    }

    setBleed(newBleed);

    // Update audio preview volumes
    const engine = AudioEngine.getInstance();
    if (engine.isInitialized()) {
      engine.setPreviewVolume('engineering', newBleed.engineering);
      engine.setPreviewVolume('design', newBleed.design);
      engine.setPreviewVolume('workshop', newBleed.workshop);
    }
  }, [prefersReducedMotion, flooding]);

  const handleZoneClick = useCallback((zone: ExperienceZone) => {
    if (flooding) return;
    setFlooding(zone.id);

    // Stop previews before navigating
    const engine = AudioEngine.getInstance();
    engine.stopPreviews();

    // Navigate after flood animation
    setTimeout(() => {
      window.location.href = zone.route;
    }, 800);
  }, [flooding]);

  // Start audio previews after splash gate completes
  useEffect(() => {
    const engine = AudioEngine.getInstance();
    if (engine.isInitialized()) {
      engine.startPreviews();
    }
    return () => {
      engine.stopPreviews();
    };
  }, []);

  // Compute mixed color for headline based on bleed
  const headlineColor = computeMixedColor(bleed);
  const dominantBleed = Math.max(bleed.engineering, bleed.design, bleed.workshop);

  return (
    <div
      className="experience-landing"
      ref={containerRef}
      onMouseMove={handleMouseMove}
    >
      {/* Overlays for theme bleed */}
      <div
        className="experience-landing__scanlines"
        style={{ opacity: bleed.engineering * 0.8 }}
        aria-hidden="true"
      />
      <div
        className="experience-landing__grid"
        style={{ opacity: bleed.workshop * 0.8 }}
        aria-hidden="true"
      />

      {/* Name */}
      <span className="experience-landing__name" aria-hidden="true">
        Rock Roqué
      </span>

      {/* Headline */}
      <motion.h1
        className="experience-landing__headline"
        style={{ color: headlineColor }}
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
      >
        Choose an
        <br />
        Experience
      </motion.h1>

      {/* Zone buttons */}
      <div className="experience-landing__zones" role="navigation" aria-label="Experience selection">
        {ZONES.map((zone, i) => (
          <motion.button
            key={zone.id}
            className="experience-landing__zone"
            onClick={() => handleZoneClick(zone)}
            aria-label={`Enter ${zone.label} experience`}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.5, delay: 0.3 + i * 0.1 }}
            style={{ color: zone.color }}
          >
            <span className="experience-landing__zone-label">{zone.label}</span>
          </motion.button>
        ))}
      </div>

      {/* Flood transition */}
      <AnimatePresence>
        {flooding && (
          <motion.div
            className="experience-landing__flood"
            initial={{ clipPath: 'circle(0% at 50% 50%)' }}
            animate={{ clipPath: 'circle(150% at 50% 50%)' }}
            transition={{ duration: 0.7, ease: [0.16, 1, 0.3, 1] }}
            style={{
              backgroundColor: ZONES.find(z => z.id === flooding)?.color ?? '#0a0a0f',
            }}
          />
        )}
      </AnimatePresence>
    </div>
  );
}

/** Mix headline color based on proximity to each zone. */
function computeMixedColor(bleed: BleedState): string {
  const total = bleed.engineering + bleed.design + bleed.workshop;
  if (total < 0.05) return 'rgba(224, 224, 232, 0.9)';

  // Weighted RGB mix
  const colors = {
    engineering: [255, 153, 0],    // #ff9900
    design: [240, 240, 240],       // near-white
    workshop: [91, 184, 245],      // #5bb8f5
  };

  let r = 0, g = 0, b = 0;
  for (const [key, rgb] of Object.entries(colors)) {
    const weight = bleed[key as ExperienceId] / total;
    r += rgb[0] * weight;
    g += rgb[1] * weight;
    b += rgb[2] * weight;
  }

  const alpha = 0.5 + Math.min(total, 1) * 0.5;
  return `rgba(${Math.round(r)}, ${Math.round(g)}, ${Math.round(b)}, ${alpha})`;
}
```

**Step 3: Verify build**

```bash
pnpm build
```

Expected: Build succeeds.

**Step 4: Commit**

```bash
git add src/components/landing/ExperienceLanding.tsx src/components/landing/ExperienceLanding.css
git commit -m "feat(landing): add cursor-driven experience landing with theme bleed and flood transitions"
```

---

## Task 8: Integrate Splash + Landing into index.astro

Wire SplashGate and ExperienceLanding into the Astro page as React islands.

**Files:**
- Modify: `src/pages/index.astro`

**Step 1: Rewrite index.astro**

```astro
---
import LandingLayout from '../layouts/LandingLayout.astro';
import SplashGate from '../components/landing/SplashGate';
import ExperienceLanding from '../components/landing/ExperienceLanding';
---

<LandingLayout title="Rock Roqué — Choose an Experience">
  <div id="landing-root">
    <SplashGate client:only="react" onComplete="document.getElementById('landing-root').dataset.entered = 'true'" />
    <ExperienceLanding client:only="react" />
  </div>
</LandingLayout>
```

**Important:** The `client:only="react"` directive means the components render entirely on the client. However, Astro doesn't pass event handler props through island boundaries like `onComplete`. We need a wrapper component.

**Step 2: Create LandingIsland.tsx wrapper**

Create: `src/components/landing/LandingIsland.tsx`

```tsx
import { useState } from 'react';
import SplashGate from './SplashGate';
import ExperienceLanding from './ExperienceLanding';

export default function LandingIsland() {
  const [entered, setEntered] = useState(false);

  return (
    <>
      {!entered && <SplashGate onComplete={() => setEntered(true)} />}
      {entered && <ExperienceLanding />}
    </>
  );
}
```

**Step 3: Simplify index.astro to use the wrapper**

```astro
---
import LandingLayout from '../layouts/LandingLayout.astro';
import LandingIsland from '../components/landing/LandingIsland';
---

<LandingLayout title="Rock Roqué — Choose an Experience">
  <LandingIsland client:only="react" />
</LandingLayout>
```

**Step 4: Verify dev server**

```bash
pnpm dev
```

Open http://localhost:4321/rockroque.com — should show the splash gate. Click "Enter" → THX plays → landing page appears with "Choose an Experience" and three zone buttons.

**Step 5: Verify build**

```bash
pnpm build
```

Expected: Build succeeds. Static output includes client-side React bundle.

**Step 6: Commit**

```bash
git add src/components/landing/LandingIsland.tsx src/pages/index.astro
git commit -m "feat(landing): integrate splash gate + experience landing as React island"
```

---

## Task 9: Build Engineering Experience Page (CRT Terminal)

Replace the placeholder with a CRT terminal aesthetic — scanlines, phosphor glow, boot sequence, amber-on-dark.

**Files:**
- Modify: `src/styles/themes/engineering.css`
- Modify: `src/pages/engineering/index.astro`
- Modify: `src/layouts/EngineeringLayout.astro`

**Step 1: Expand engineering.css with CRT styling**

```css
/* Engineering — CRT amber terminal theme */
[data-theme="engineering"] {
  --color-bg: #0a0a0c;
  --color-surface: #141410;
  --color-text: #ffb84d;
  --color-text-muted: #cc8a00;
  --color-accent: #ff9900;
  --color-accent-glow: rgba(255, 149, 0, 0.3);
  --color-border: #3d3d00;

  --crt-scanline-color: rgba(255, 153, 0, 0.04);
  --crt-glow: 0 0 8px rgba(255, 153, 0, 0.4), 0 0 20px rgba(255, 153, 0, 0.1);
}

/* CRT container */
[data-theme="engineering"] body {
  position: relative;
  overflow-x: hidden;
}

/* Scanline overlay */
[data-theme="engineering"] body::after {
  content: '';
  position: fixed;
  inset: 0;
  pointer-events: none;
  z-index: var(--z-scanline);
  background: repeating-linear-gradient(
    0deg,
    transparent,
    transparent 2px,
    var(--crt-scanline-color) 2px,
    var(--crt-scanline-color) 4px
  );
}

/* Screen curvature via vignette */
[data-theme="engineering"] body::before {
  content: '';
  position: fixed;
  inset: 0;
  pointer-events: none;
  z-index: calc(var(--z-scanline) - 1);
  background: radial-gradient(
    ellipse at center,
    transparent 60%,
    rgba(0, 0, 0, 0.4) 100%
  );
}

/* Phosphor glow on text */
[data-theme="engineering"] h1,
[data-theme="engineering"] h2,
[data-theme="engineering"] h3 {
  text-shadow: var(--crt-glow);
}

/* Subtle flicker */
@keyframes crt-flicker {
  0%, 100% { opacity: 1; }
  92% { opacity: 1; }
  93% { opacity: 0.95; }
  94% { opacity: 1; }
}

[data-theme="engineering"] main {
  animation: crt-flicker 4s infinite;
}

/* Terminal-style nav */
[data-theme="engineering"] nav {
  padding: 1rem 1.5rem;
  font-size: 0.85rem;
}

[data-theme="engineering"] nav a {
  color: var(--color-accent);
  text-shadow: 0 0 6px rgba(255, 149, 0, 0.3);
}

[data-theme="engineering"] nav a::before {
  content: '> ';
  opacity: 0.5;
}

@media (prefers-reduced-motion: reduce) {
  [data-theme="engineering"] main {
    animation: none;
  }
}
```

**Step 2: Update engineering/index.astro with CRT content**

```astro
---
import EngineeringLayout from '../../layouts/EngineeringLayout.astro';
---

<EngineeringLayout title="Engineering">
  <section class="terminal">
    <div class="terminal__boot" aria-live="polite">
      <p class="terminal__line" style="--delay: 0">ROCK_OS v2.6.0 — Boot sequence initiated</p>
      <p class="terminal__line" style="--delay: 1">Loading engineering modules...</p>
      <p class="terminal__line" style="--delay: 2">├── claude-code-patterns</p>
      <p class="terminal__line" style="--delay: 3">├── ci-cd-pipelines</p>
      <p class="terminal__line" style="--delay: 4">├── system-architecture</p>
      <p class="terminal__line" style="--delay: 5">├── design-systems</p>
      <p class="terminal__line" style="--delay: 6">└── active-projects</p>
      <p class="terminal__line" style="--delay: 7">All modules loaded. Ready.</p>
    </div>

    <div class="terminal__prompt">
      <span class="terminal__user">rock@engineering</span>
      <span class="terminal__separator">:</span>
      <span class="terminal__path">~</span>
      <span class="terminal__dollar">$</span>
      <span class="terminal__cursor" aria-hidden="true">█</span>
    </div>

    <div class="terminal__content">
      <h1 class="visually-hidden">Engineering Experience</h1>
      <p class="terminal__description">
        Design engineer & civic technologist building at the intersection
        of government, design systems, and AI-assisted development.
      </p>
      <p class="terminal__hint">Content modules loading in future update...</p>
    </div>
  </section>
</EngineeringLayout>

<style>
  .terminal {
    max-width: 800px;
    margin: 0 auto;
    padding: var(--space-xl) var(--space-lg);
    font-family: var(--font-mono);
    font-size: 0.9rem;
    line-height: 1.8;
  }

  .terminal__boot {
    margin-bottom: var(--space-xl);
  }

  .terminal__line {
    opacity: 0;
    animation: type-in 0.05s forwards;
    animation-delay: calc(var(--delay) * 0.25s + 0.5s);
  }

  @keyframes type-in {
    from { opacity: 0; }
    to { opacity: 1; }
  }

  .terminal__prompt {
    display: flex;
    align-items: center;
    gap: 0;
    margin-bottom: var(--space-lg);
    font-size: 0.9rem;
  }

  .terminal__user { color: var(--color-accent); }
  .terminal__separator { color: var(--color-text-muted); }
  .terminal__path { color: var(--color-text); margin-left: 0.25em; }
  .terminal__dollar { color: var(--color-text-muted); margin-left: 0.5em; margin-right: 0.5em; }

  .terminal__cursor {
    animation: blink 1s step-end infinite;
    color: var(--color-accent);
    font-size: 1em;
  }

  @keyframes blink {
    0%, 50% { opacity: 1; }
    51%, 100% { opacity: 0; }
  }

  .terminal__content {
    border-top: 1px solid var(--color-border);
    padding-top: var(--space-lg);
  }

  .terminal__description {
    color: var(--color-text);
    margin-bottom: var(--space-md);
  }

  .terminal__hint {
    color: var(--color-text-muted);
    font-size: var(--text-sm);
    opacity: 0.6;
  }

  @media (prefers-reduced-motion: reduce) {
    .terminal__line {
      opacity: 1;
      animation: none;
    }
    .terminal__cursor {
      animation: none;
      opacity: 1;
    }
  }
</style>
```

**Step 3: Verify dev server**

Check http://localhost:4321/rockroque.com/engineering — should show CRT terminal with scanlines, boot sequence, and amber-on-dark theme.

**Step 4: Verify build**

```bash
pnpm build
```

Expected: Build succeeds.

**Step 5: Commit**

```bash
git add src/styles/themes/engineering.css src/pages/engineering/index.astro src/layouts/EngineeringLayout.astro
git commit -m "feat(engineering): CRT terminal aesthetic with scanlines, boot sequence, and phosphor glow"
```

---

## Task 10: Build Design Experience Page (Dark Editorial)

Create the editorial magazine experience with bold serif typography and asymmetric layouts.

**Files:**
- Modify: `src/styles/themes/design.css`
- Modify: `src/pages/design/index.astro`
- Modify: `src/layouts/DesignLayout.astro`

**Step 1: Expand design.css with editorial styling**

```css
/* Design — dark editorial magazine theme */
[data-theme="design"] {
  --color-bg: #0c0c0c;
  --color-surface: #161616;
  --color-text: #f0f0f0;
  --color-text-muted: #999999;
  --color-accent: #ffffff;
  --color-accent-glow: rgba(255, 255, 255, 0.15);
  --color-border: #333333;

  --font-serif: 'Playfair Display', Georgia, serif;
}

[data-theme="design"] body {
  font-family: var(--font-mono);
}

/* Editorial heading styles */
[data-theme="design"] h1 {
  font-family: var(--font-serif);
  font-weight: 900;
  font-style: italic;
  letter-spacing: -0.03em;
  line-height: 0.95;
}

[data-theme="design"] h2 {
  font-family: var(--font-serif);
  font-weight: 700;
  letter-spacing: -0.02em;
}

/* Rules (horizontal lines) as editorial dividers */
[data-theme="design"] hr {
  border: none;
  height: 3px;
  background: var(--color-accent);
  margin: var(--space-xl) 0;
}

/* Editorial nav */
[data-theme="design"] nav {
  padding: 1.5rem 2rem;
  font-size: 0.8rem;
  letter-spacing: 0.15em;
  text-transform: uppercase;
}

[data-theme="design"] nav a {
  color: var(--color-text-muted);
  transition: color 0.2s ease;
}

[data-theme="design"] nav a:hover {
  color: var(--color-accent);
  text-decoration: none;
}
```

**Step 2: Update design/index.astro with editorial content**

```astro
---
import DesignLayout from '../../layouts/DesignLayout.astro';
---

<DesignLayout title="Design">
  <article class="editorial">
    <header class="editorial__hero">
      <h1 class="editorial__title">
        Design is
        <br />
        <em>how it works.</em>
      </h1>
      <div class="editorial__rule" aria-hidden="true"></div>
      <p class="editorial__subtitle">
        Craft, systems, accessibility — at every layer.
      </p>
    </header>

    <section class="editorial__intro">
      <div class="editorial__col-wide">
        <p class="editorial__lead">
          Design engineering at the intersection of government,
          accessibility, and developer experience. Building systems
          that serve millions while maintaining the craft that makes
          them worth using.
        </p>
      </div>
      <div class="editorial__col-narrow">
        <p class="editorial__meta">
          <span class="editorial__label">Focus</span>
          Design Systems · Accessibility · Figma-to-Code
        </p>
        <p class="editorial__meta">
          <span class="editorial__label">Tools</span>
          Figma · Storybook · USWDS · Lit
        </p>
      </div>
    </section>

    <p class="editorial__hint">Case studies and essays loading in future update...</p>
  </article>
</DesignLayout>

<style>
  .editorial {
    max-width: 1200px;
    margin: 0 auto;
    padding: var(--space-2xl) var(--space-lg);
  }

  .editorial__hero {
    margin-bottom: var(--space-2xl);
  }

  .editorial__title {
    font-size: clamp(3rem, 10vw, 8rem);
    margin-bottom: var(--space-lg);
  }

  .editorial__rule {
    width: 120px;
    height: 4px;
    background: var(--color-accent);
    margin-bottom: var(--space-lg);
  }

  .editorial__subtitle {
    font-size: var(--text-lg);
    color: var(--color-text-muted);
    letter-spacing: 0.05em;
    text-transform: uppercase;
    font-family: var(--font-mono);
  }

  .editorial__intro {
    display: grid;
    grid-template-columns: 2fr 1fr;
    gap: var(--space-xl);
    padding-top: var(--space-xl);
    border-top: 1px solid var(--color-border);
    margin-bottom: var(--space-xl);
  }

  .editorial__lead {
    font-family: var(--font-serif, Georgia, serif);
    font-size: var(--text-lg);
    line-height: 1.6;
    color: var(--color-text);
  }

  .editorial__meta {
    font-size: var(--text-sm);
    color: var(--color-text-muted);
    margin-bottom: var(--space-md);
    line-height: 1.6;
  }

  .editorial__label {
    display: block;
    font-size: 0.7rem;
    letter-spacing: 0.2em;
    text-transform: uppercase;
    color: var(--color-accent);
    margin-bottom: var(--space-xs);
  }

  .editorial__hint {
    color: var(--color-text-muted);
    font-size: var(--text-sm);
    opacity: 0.5;
    text-align: center;
    padding-top: var(--space-xl);
    border-top: 1px solid var(--color-border);
  }

  @media (max-width: 768px) {
    .editorial__intro {
      grid-template-columns: 1fr;
    }

    .editorial {
      padding: var(--space-xl) var(--space-md);
    }
  }
</style>
```

**Step 3: Verify dev server**

Check http://localhost:4321/rockroque.com/design — should show dark editorial magazine layout with Playfair Display headings.

**Step 4: Verify build**

```bash
pnpm build
```

Expected: Build succeeds.

**Step 5: Commit**

```bash
git add src/styles/themes/design.css src/pages/design/index.astro src/layouts/DesignLayout.astro
git commit -m "feat(design): dark editorial magazine aesthetic with serif typography and asymmetric layout"
```

---

## Task 11: Build Workshop Experience Page (Blueprint)

Create the blueprint/schematic experience with deep blue background, grid overlay, dimension markers, and technical drawing feel.

**Files:**
- Modify: `src/styles/themes/workshop.css`
- Modify: `src/pages/workshop/index.astro`
- Modify: `src/layouts/WorkshopLayout.astro`

**Step 1: Expand workshop.css with blueprint styling**

```css
/* Workshop — blueprint paper theme */
[data-theme="workshop"] {
  --color-bg: #0a1628;
  --color-surface: #0d2137;
  --color-text: #c8e6ff;
  --color-text-muted: #6b9cc8;
  --color-accent: #5bb8f5;
  --color-accent-glow: rgba(91, 184, 245, 0.3);
  --color-border: #1a3a5c;

  --blueprint-line: rgba(91, 184, 245, 0.15);
  --blueprint-line-major: rgba(91, 184, 245, 0.25);
}

/* Grid paper background */
[data-theme="workshop"] body {
  background:
    linear-gradient(var(--blueprint-line) 1px, transparent 1px),
    linear-gradient(90deg, var(--blueprint-line) 1px, transparent 1px),
    linear-gradient(var(--blueprint-line-major) 1px, transparent 1px),
    linear-gradient(90deg, var(--blueprint-line-major) 1px, transparent 1px);
  background-size:
    20px 20px,
    20px 20px,
    100px 100px,
    100px 100px;
  background-color: var(--color-bg);
}

/* Dimension markers at edges */
[data-theme="workshop"] body::before {
  content: '';
  position: fixed;
  top: 0;
  left: 0;
  bottom: 0;
  width: 40px;
  pointer-events: none;
  z-index: 1;
  background: repeating-linear-gradient(
    0deg,
    transparent,
    transparent 98px,
    rgba(91, 184, 245, 0.2) 98px,
    rgba(91, 184, 245, 0.2) 100px
  );
  border-right: 1px solid rgba(91, 184, 245, 0.15);
}

/* Blueprint nav */
[data-theme="workshop"] nav {
  padding: 1rem 1.5rem;
  padding-left: 50px; /* clear dimension marker */
  font-family: var(--font-mono);
  font-size: 0.75rem;
  letter-spacing: 0.1em;
  text-transform: uppercase;
}

[data-theme="workshop"] nav a {
  color: var(--color-accent);
}

/* Title block styling */
[data-theme="workshop"] h1,
[data-theme="workshop"] h2,
[data-theme="workshop"] h3 {
  font-family: var(--font-mono);
  text-transform: uppercase;
  letter-spacing: 0.1em;
}

/* Annotation callouts */
[data-theme="workshop"] .callout {
  position: relative;
  border: 1px solid var(--color-accent);
  padding: var(--space-md);
  font-size: var(--text-sm);
}

[data-theme="workshop"] .callout::before {
  content: attr(data-label);
  position: absolute;
  top: -0.6em;
  left: var(--space-md);
  background: var(--color-bg);
  padding: 0 var(--space-xs);
  font-size: 0.65rem;
  letter-spacing: 0.15em;
  text-transform: uppercase;
  color: var(--color-accent);
}
```

**Step 2: Update WorkshopLayout.astro**

Add the dimension-marker left padding to the main content area:

```astro
---
interface Props {
  title: string;
}

const { title } = Astro.props;
---

<!doctype html>
<html lang="en" data-theme="workshop">
  <head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <link rel="icon" type="image/svg+xml" href="/rockroque.com/favicon.svg" />
    <title>{title} — Rock Roqué</title>
    <style>
      @import '../styles/global.css';
      @import '../styles/themes/workshop.css';
    </style>
  </head>
  <body>
    <a href="#main" class="skip-link">Skip to content</a>
    <nav aria-label="Experience navigation">
      <a href="/rockroque.com/">← Choose Experience</a>
    </nav>
    <main id="main">
      <slot />
    </main>
  </body>
</html>
```

**Step 3: Update workshop/index.astro with blueprint content**

```astro
---
import WorkshopLayout from '../../layouts/WorkshopLayout.astro';
---

<WorkshopLayout title="Workshop">
  <div class="blueprint">
    <header class="blueprint__header">
      <div class="blueprint__stamp">
        <h1>Workshop</h1>
        <p class="blueprint__drawing-info">
          DWG NO. RR-WK-001 &nbsp;|&nbsp; REV A &nbsp;|&nbsp; SCALE: NTS
        </p>
      </div>
    </header>

    <section class="blueprint__content">
      <div class="callout" data-label="Section A — Overview">
        <p>
          Experiments, open source tools, and AI workflow automations.
          Each project documented as a technical drawing —
          architecture diagrams, system schematics, and interactive blueprints.
        </p>
      </div>

      <div class="blueprint__grid">
        <div class="callout" data-label="Detail B — Experiments">
          <p>Live prototypes and demos</p>
          <p class="blueprint__status">Loading...</p>
        </div>

        <div class="callout" data-label="Detail C — Open Source">
          <p>Tools and contributions</p>
          <p class="blueprint__status">Loading...</p>
        </div>

        <div class="callout" data-label="Detail D — AI Workflows">
          <p>Claude patterns, n8n automations</p>
          <p class="blueprint__status">Loading...</p>
        </div>
      </div>
    </section>

    <footer class="blueprint__title-block">
      <div class="blueprint__title-block-inner">
        <p class="blueprint__title-block-label">Rock Roqué — Workshop</p>
        <p class="blueprint__title-block-meta">Date: 2026-03-03 &nbsp;|&nbsp; Sheet 1 of 1</p>
      </div>
    </footer>
  </div>
</WorkshopLayout>

<style>
  .blueprint {
    min-height: 100vh;
    padding: var(--space-lg);
    padding-left: 60px;
    font-family: var(--font-mono);
  }

  .blueprint__header {
    margin-bottom: var(--space-xl);
  }

  .blueprint__stamp {
    display: inline-block;
    border: 2px solid var(--color-accent);
    padding: var(--space-md) var(--space-lg);
  }

  .blueprint__stamp h1 {
    font-size: var(--text-2xl);
    margin-bottom: var(--space-xs);
  }

  .blueprint__drawing-info {
    font-size: 0.65rem;
    letter-spacing: 0.15em;
    text-transform: uppercase;
    color: var(--color-text-muted);
  }

  .blueprint__content {
    max-width: 900px;
  }

  .blueprint__content > .callout {
    margin-bottom: var(--space-xl);
  }

  .blueprint__grid {
    display: grid;
    grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
    gap: var(--space-lg);
    margin-bottom: var(--space-xl);
  }

  .blueprint__status {
    font-size: 0.7rem;
    color: var(--color-text-muted);
    margin-top: var(--space-sm);
    opacity: 0.5;
  }

  .blueprint__title-block {
    position: fixed;
    bottom: 1.5rem;
    right: 1.5rem;
  }

  .blueprint__title-block-inner {
    border: 1px solid var(--color-accent);
    padding: var(--space-sm) var(--space-md);
    font-size: 0.65rem;
    text-transform: uppercase;
    letter-spacing: 0.1em;
    background: var(--color-bg);
  }

  .blueprint__title-block-label {
    color: var(--color-accent);
    margin-bottom: 2px;
  }

  .blueprint__title-block-meta {
    color: var(--color-text-muted);
  }

  @media (max-width: 768px) {
    .blueprint {
      padding-left: var(--space-md);
    }

    .blueprint__title-block {
      position: static;
      margin-top: var(--space-xl);
    }

    .blueprint__grid {
      grid-template-columns: 1fr;
    }
  }
</style>
```

**Step 4: Verify dev server**

Check http://localhost:4321/rockroque.com/workshop — should show blueprint grid paper with callout annotations, dimension markers, and title block.

**Step 5: Verify build**

```bash
pnpm build
```

Expected: Build succeeds.

**Step 6: Commit**

```bash
git add src/styles/themes/workshop.css src/pages/workshop/index.astro src/layouts/WorkshopLayout.astro
git commit -m "feat(workshop): blueprint paper aesthetic with grid overlay, callouts, and title block"
```

---

## Task 12: Create Placeholder Audio Files

Create silent placeholder `.ogg` audio files for the ambient loops. These will be replaced with real recordings later but let the AudioEngine load without 404s.

**Files:**
- Create: `public/audio/engineering-ambient.ogg`
- Create: `public/audio/design-ambient.ogg`
- Create: `public/audio/workshop-ambient.ogg`

**Step 1: Create audio directory and placeholders**

We need valid (but silent) OGG files. Use ffmpeg to generate 1-second silent OGG files:

```bash
mkdir -p ~/Developer/rockroque.com/public/audio

# Generate 1-second silent OGG files (placeholder)
ffmpeg -f lavfi -i anullsrc=r=44100:cl=mono -t 1 -c:a libvorbis -q:a 0 ~/Developer/rockroque.com/public/audio/engineering-ambient.ogg -y 2>/dev/null
ffmpeg -f lavfi -i anullsrc=r=44100:cl=mono -t 1 -c:a libvorbis -q:a 0 ~/Developer/rockroque.com/public/audio/design-ambient.ogg -y 2>/dev/null
ffmpeg -f lavfi -i anullsrc=r=44100:cl=mono -t 1 -c:a libvorbis -q:a 0 ~/Developer/rockroque.com/public/audio/workshop-ambient.ogg -y 2>/dev/null
```

If ffmpeg is not available, create a simple script instead:

```bash
# Alternative: create tiny valid files by base64 decoding a minimal OGG
# Skip this step if ffmpeg works above
```

**Step 2: Verify files exist**

```bash
ls -la ~/Developer/rockroque.com/public/audio/
```

Expected: Three `.ogg` files, each a few KB.

**Step 3: Commit**

```bash
cd ~/Developer/rockroque.com
git add public/audio/
git commit -m "chore(audio): add placeholder ambient audio files"
```

---

## Task 13: Accessibility and Reduced Motion Pass

Verify all experiences respect `prefers-reduced-motion`, keyboard navigation works, and focus outlines are visible.

**Files:**
- Review: All CSS and TSX files from previous tasks

**Step 1: Verify reduced motion already handled**

Check that these are in place (they should be from earlier tasks):

1. `global.css` — has the blanket `prefers-reduced-motion: reduce` rule
2. `SplashGate.tsx` — checks `prefers-reduced-motion` and skips to landing
3. `ExperienceLanding.css` — hides scanlines/grid overlays in reduced motion
4. `engineering.css` — disables CRT flicker in reduced motion
5. `engineering/index.astro` — disables boot sequence typing animation

**Step 2: Add skip link improvements to LandingLayout**

Ensure the skip link targets `#main` and is visible on focus. Already present from Phase 0. Verify:

```bash
grep -r "skip-link" ~/Developer/rockroque.com/src/
```

Expected: Skip link in every layout.

**Step 3: Test keyboard navigation on landing page**

Open http://localhost:4321/rockroque.com in dev server. Tab through:
1. Skip link should appear on first Tab
2. "Enter" button in splash gate should be focusable
3. Three experience zones should be Tab-navigable buttons
4. Enter key on zone button should trigger flood transition

**Step 4: Lighthouse accessibility audit**

```bash
pnpm build && pnpm preview
```

In a browser, run Lighthouse on:
- `/rockroque.com/` (landing — after splash)
- `/rockroque.com/engineering`
- `/rockroque.com/design`
- `/rockroque.com/workshop`

Target: a11y score >= 90 on all pages.

**Step 5: Fix any issues found**

Address Lighthouse findings. Common issues to check:
- Color contrast ratios (amber on dark, cyan on blue)
- Button accessible names
- Heading hierarchy
- Lang attribute

**Step 6: Commit fixes (if any)**

```bash
git add -A
git commit -m "fix(a11y): address accessibility audit findings"
```

---

## Task 14: Update CLAUDE.md and Project Documentation

Update the project's CLAUDE.md to reflect the new 3-experience architecture, removing references to the 6-domain model and the 3D neural graph.

**Files:**
- Modify: `CLAUDE.md`
- Modify: `DECISIONS.md` (append new decisions)
- Modify: `CHANGELOG.md` (append new entries)

**Step 1: Update CLAUDE.md**

The key sections to update:
- THE VISION: Replace "Mind Portal" with "Choose an Experience" concept
- INFORMATION ARCHITECTURE: Replace 6 domains with 3 experiences
- TECH STACK: Remove Three.js references, add Framer Motion, note AudioEngine
- BUILD PLAN: Update phases to reflect current state
- GRAPH DATA MODEL: Remove (no longer applicable)
- Monorepo structure: Update file tree

**Step 2: Append to DECISIONS.md**

```markdown
## 2026-03-03 — Choose an Experience Redesign

- Replaced 6-domain model (work, study, signal, workshop, life, roots) with 3 experiences (Engineering, Design, Workshop)
- Removed 3D neural graph concept — replaced with typographic "Choose an Experience" landing
- Added cinematic splash gate with Web Audio THX crescendo
- Added cursor-driven theme bleed on landing page (3 gravitational fields)
- Added Framer Motion for spring animations and flood transitions
- Renamed work → engineering, portal → landing
- Removed Three.js/R3F dependency plan (saves ~220KB)
- Each experience has its own aesthetic: CRT terminal, dark editorial, blueprint
```

**Step 3: Append to CHANGELOG.md**

```markdown
## 2026-03-03 — "Choose an Experience" Implementation

### Added
- Cinematic splash gate with Web Audio THX-style crescendo (`SplashGate.tsx`)
- Interactive "Choose an Experience" landing with cursor-driven theme bleed (`ExperienceLanding.tsx`)
- Shared Web Audio singleton (`AudioEngine.ts`) for THX, previews, and ambient
- Engineering experience: CRT terminal with scanlines, boot sequence, phosphor glow
- Design experience: dark editorial magazine with Playfair Display serif
- Workshop experience: blueprint paper with grid overlay, callouts, title block
- Flood transition animations between landing and experiences
- Placeholder ambient audio files

### Changed
- Renamed work → engineering (route, layout, theme, components)
- Renamed portal → landing (layout, theme)
- Updated CLAUDE.md to reflect 3-experience architecture

### Removed
- Study, Signal, Life domain pages, layouts, themes
- Portal/graph component placeholders
- References to 3D neural graph concept
```

**Step 4: Commit**

```bash
git add CLAUDE.md DECISIONS.md CHANGELOG.md
git commit -m "docs: update project documentation for Choose an Experience architecture"
```

---

## Task 15: Build, Deploy, and Verify

Final build verification, then push to GitHub for deployment.

**Step 1: Full build**

```bash
cd ~/Developer/rockroque.com
pnpm build
```

Expected: Build succeeds with no errors or warnings.

**Step 2: Preview locally**

```bash
pnpm preview
```

Manually verify:
1. Splash gate appears at `/rockroque.com/`
2. Click "Enter" → THX crescendo plays → landing fades in
3. Cursor movement causes theme bleed (amber left, white right, cyan bottom)
4. Click Engineering → amber flood → CRT terminal page
5. Click Design → white flood → editorial magazine page
6. Click Workshop → cyan flood → blueprint page
7. Each experience has "← Choose Experience" nav link back to landing
8. Skip link works on all pages
9. Reduced motion: splash gate skipped, no animations

**Step 3: Push branch**

```bash
git push -u origin feat/choose-an-experience
```

**Step 4: Create PR**

```bash
gh pr create \
  --title "feat: Choose an Experience redesign" \
  --body "$(cat <<'EOF'
## Summary
- Cinematic splash gate with Web Audio THX crescendo
- Interactive 'Choose an Experience' landing with cursor-driven theme bleed
- 3 themed experiences: Engineering (CRT), Design (editorial), Workshop (blueprint)
- Shared AudioEngine singleton for all sound
- Refactored from 6 domains to 3 experiences

## Ship Criteria
- [x] Splash gate plays THX and transitions to landing
- [x] Landing responds to cursor with theme bleed
- [x] Click triggers flood transition to experience
- [x] All 3 experiences render with themed aesthetic
- [x] prefers-reduced-motion respected
- [x] Keyboard navigable
- [x] Lighthouse a11y >= 90

🤖 Generated with [Claude Code](https://claude.com/claude-code)
EOF
)"
```

**Step 5: Merge and verify deployment**

After PR review passes, merge to `main`. GitHub Actions will deploy to GitHub Pages automatically. Verify at https://rockroque.github.io/rockroque.com.

---

## Task Summary

| # | Task | Dependencies | Est. Size |
|---|------|-------------|-----------|
| 1 | Branch + install framer-motion | — | Small |
| 2 | Delete unused domain files | — | Small |
| 3 | Rename work→engineering, portal→landing | 2 | Medium |
| 4 | Create design experience scaffolding | 3 | Small |
| 5 | Build AudioEngine.ts | 1 | Medium |
| 6 | Build SplashGate.tsx | 5 | Medium |
| 7 | Build ExperienceLanding.tsx | 5 | Large |
| 8 | Integrate splash + landing into index.astro | 6, 7 | Small |
| 9 | Build engineering experience (CRT) | 3 | Medium |
| 10 | Build design experience (editorial) | 4 | Medium |
| 11 | Build workshop experience (blueprint) | 3 | Medium |
| 12 | Create placeholder audio files | — | Small |
| 13 | Accessibility pass | 8, 9, 10, 11 | Small |
| 14 | Update documentation | 13 | Small |
| 15 | Build, deploy, verify | 14 | Small |

**Parallelizable groups:**
- Tasks 1 + 2 can run in parallel
- Tasks 9 + 10 + 11 can run in parallel (after task 3)
- Task 12 is independent of everything except task 5
