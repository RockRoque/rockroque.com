# Phase 1 Implementation Plan: Portal Graph + Work Domain

> **For Claude:** REQUIRED SUB-SKILL: Use superpowers:executing-plans to implement this plan task-by-task.

**Goal:** Build the interactive 3D neural graph portal landing page and the Work domain (landing + Now page) with the "Studio" aesthetic.

**Architecture:** Astro 5 static site with React islands. Portal uses React Three Fiber for the 3D graph (`client:only="react"`). Work domain uses Motion (framer-motion successor) for scroll/entrance animations. Each domain has its own CSS theme. Navigation between portal and domains uses smooth camera zoom + fade transitions.

**Tech Stack:** Astro 5, React 19, TypeScript strict, React Three Fiber + drei, Motion (motion/react), hand-written CSS custom properties, GitHub Pages

**Important context:**
- Base path is `/rockroque.com` (GitHub Pages project site) — all internal links must use this prefix
- Astro config: `astro.config.mjs` has `base: '/rockroque.com'`
- Package manager: pnpm (v10.11.0)
- Existing fonts: IBM Plex Mono, Space Mono (loaded via Google Fonts in global.css)
- Project root: `~/Developer/rockroque.com`

---

## Task 1: Install Dependencies

**Files:**
- Modify: `package.json`

**Step 1: Install R3F + Motion packages**

Run:
```bash
cd ~/Developer/rockroque.com
pnpm add three @react-three/fiber @react-three/drei motion
pnpm add -D @types/three
```

**Step 2: Verify install**

Run:
```bash
pnpm build
```
Expected: Clean build, 0 errors. The new packages don't affect existing pages.

**Step 3: Commit**

```bash
git checkout -b feat/phase-1-portal-work
git add package.json pnpm-lock.yaml
git commit -m "chore: add three, react-three-fiber, drei, motion dependencies"
```

---

## Task 2: Graph Data Model

**Files:**
- Create: `src/components/portal/graph-data.ts`

**Step 1: Create graph data file with TypeScript types and node/edge definitions**

```typescript
// src/components/portal/graph-data.ts

export interface GraphNode {
  id: string;
  label: string;
  group: 'core' | 'work' | 'study' | 'signal' | 'workshop' | 'life';
  desc: string;
  size: number;
  route?: string;
}

export interface GraphEdge {
  source: string;
  target: string;
}

/** Muted domain cluster colors */
export const GROUP_COLORS: Record<GraphNode['group'], string> = {
  core: '#e8e4df',
  work: '#d4a853',
  study: '#8b7355',
  signal: '#c45c5c',
  workshop: '#5c9ec4',
  life: '#7bc45c',
};

/** Domain clusters that are clickable navigation targets */
export const DOMAIN_NODES = new Set(['work', 'study', 'signal', 'workshop', 'life']);

export const NODES: GraphNode[] = [
  { id: 'rock', label: 'Rock Roqué', group: 'core', desc: 'Design Engineer & Civic Technologist', size: 22 },
  // Work cluster
  { id: 'work', label: 'Work', group: 'work', desc: 'Design systems, engineering, civic tech', size: 18, route: '/rockroque.com/work/' },
  { id: 'design-systems', label: 'Design Systems', group: 'work', desc: 'Architecture, governance, scaling component libraries', size: 14 },
  { id: 'uswds', label: 'USWDS', group: 'work', desc: 'U.S. Web Design System — federal standards', size: 11 },
  { id: 'mdwds', label: 'MDWDS', group: 'work', desc: 'Maryland Web Design System — state implementation', size: 12 },
  { id: 'storybook', label: 'Storybook', group: 'work', desc: 'Component documentation and visual testing', size: 9 },
  { id: 'figma', label: 'Figma', group: 'work', desc: 'Design-to-code workflows and tokens', size: 10 },
  { id: 'a11y', label: 'Accessibility', group: 'work', desc: 'WCAG 2.2 compliance, inclusive design', size: 11 },
  // AI / Study cluster
  { id: 'study', label: 'Study', group: 'study', desc: 'Research, humanities, perspective', size: 16, route: '/rockroque.com/study/' },
  { id: 'ai', label: 'AI Tooling', group: 'study', desc: 'Building with and for artificial intelligence', size: 14 },
  { id: 'claude', label: 'Claude', group: 'study', desc: 'Daily driver — code, product thinking, workflows', size: 13 },
  { id: 'claude-code', label: 'Claude Code', group: 'study', desc: 'CLI-first AI coding across teams', size: 12 },
  { id: 'neuromorphic', label: 'Neuromorphic', group: 'study', desc: 'Brain-inspired computing architectures', size: 9 },
  { id: 'ai-philosophy', label: 'AI Ethics', group: 'study', desc: 'Safety-first AI, human agency, responsible deployment', size: 10 },
  // Signal cluster
  { id: 'signal', label: 'Signal', group: 'signal', desc: 'Writing, AI philosophy, notes', size: 16, route: '/rockroque.com/signal/' },
  { id: 'govtech', label: 'Gov Tech', group: 'signal', desc: 'Modernizing government digital services', size: 13 },
  { id: 'mdds', label: 'MDDS', group: 'signal', desc: 'Maryland Dept. of Digital Services', size: 11 },
  { id: 'maryland-gov', label: 'Maryland.gov', group: 'signal', desc: 'State website modernization', size: 10 },
  // Workshop cluster
  { id: 'workshop', label: 'Workshop', group: 'workshop', desc: 'Experiments, open source, AI workflows', size: 16, route: '/rockroque.com/workshop/' },
  { id: 'frontend', label: 'Frontend', group: 'workshop', desc: 'React, Astro, modern web platform', size: 11 },
  { id: 'github-actions', label: 'GitHub Actions', group: 'workshop', desc: 'CI/CD and automated testing', size: 8 },
  { id: 'n8n', label: 'n8n', group: 'workshop', desc: 'Workflow automation on home NAS', size: 8 },
  // Life cluster
  { id: 'life', label: 'Life', group: 'life', desc: 'Personal — invite only', size: 14, route: '/rockroque.com/life/' },
  { id: 'latchlog', label: 'LatchLog', group: 'life', desc: 'Baby tracking — iPhone + Apple Watch', size: 10 },
  { id: 'swift', label: 'Swift', group: 'life', desc: 'iOS/watchOS native development', size: 8 },
];

export const EDGES: GraphEdge[] = [
  // Core connections
  { source: 'rock', target: 'work' },
  { source: 'rock', target: 'study' },
  { source: 'rock', target: 'signal' },
  { source: 'rock', target: 'workshop' },
  { source: 'rock', target: 'life' },
  // Work cluster internal
  { source: 'work', target: 'design-systems' },
  { source: 'design-systems', target: 'uswds' },
  { source: 'design-systems', target: 'mdwds' },
  { source: 'design-systems', target: 'storybook' },
  { source: 'design-systems', target: 'figma' },
  { source: 'design-systems', target: 'a11y' },
  { source: 'uswds', target: 'mdwds' },
  { source: 'mdwds', target: 'storybook' },
  { source: 'figma', target: 'storybook' },
  // Study cluster internal
  { source: 'study', target: 'ai' },
  { source: 'ai', target: 'claude' },
  { source: 'ai', target: 'claude-code' },
  { source: 'ai', target: 'neuromorphic' },
  { source: 'ai', target: 'ai-philosophy' },
  { source: 'claude', target: 'claude-code' },
  // Signal cluster internal
  { source: 'signal', target: 'govtech' },
  { source: 'govtech', target: 'mdds' },
  { source: 'govtech', target: 'maryland-gov' },
  { source: 'mdds', target: 'maryland-gov' },
  // Workshop cluster internal
  { source: 'workshop', target: 'frontend' },
  { source: 'workshop', target: 'github-actions' },
  { source: 'workshop', target: 'n8n' },
  // Life cluster internal
  { source: 'life', target: 'latchlog' },
  { source: 'latchlog', target: 'swift' },
  // Cross-cluster connections
  { source: 'ai-philosophy', target: 'govtech' },
  { source: 'claude-code', target: 'mdds' },
  { source: 'claude-code', target: 'github-actions' },
  { source: 'a11y', target: 'govtech' },
  { source: 'figma', target: 'frontend' },
  { source: 'mdwds', target: 'mdds' },
  { source: 'frontend', target: 'design-systems' },
  { source: 'n8n', target: 'github-actions' },
];

/**
 * Group offsets for brain-shaped clustering.
 * Values are normalized (-1 to 1) offsets from center.
 */
export const GROUP_OFFSETS: Record<GraphNode['group'], { x: number; y: number; z: number }> = {
  core: { x: 0, y: 0, z: 0 },
  work: { x: -1, y: 0.3, z: -0.3 },
  study: { x: 1, y: 0.3, z: 0.3 },
  signal: { x: -0.4, y: -1, z: 0.5 },
  workshop: { x: 0.4, y: -0.8, z: -0.6 },
  life: { x: 0, y: 1, z: 0.7 },
};
```

**Step 2: Verify TypeScript compiles**

Run:
```bash
cd ~/Developer/rockroque.com && npx tsc --noEmit
```
Expected: No errors.

**Step 3: Commit**

```bash
git add src/components/portal/graph-data.ts
git commit -m "feat(portal): add graph data model with types, nodes, edges"
```

---

## Task 3: Update Theme CSS

**Files:**
- Modify: `src/styles/themes/portal.css`
- Modify: `src/styles/themes/work.css`
- Modify: `src/styles/global.css`

**Step 1: Update portal.css to soft white/silver aesthetic**

Replace entire contents of `src/styles/themes/portal.css`:

```css
/* Portal — dark cosmic theme with soft white accent */
[data-theme="portal"] {
  --color-bg: #0c0c0e;
  --color-surface: #141416;
  --color-text: #e8e4df;
  --color-text-muted: #8a8680;
  --color-accent: #e8e4df;
  --color-accent-glow: rgba(232, 228, 223, 0.2);
  --color-border: rgba(232, 228, 223, 0.1);
}
```

**Step 2: Update work.css from CRT to Studio aesthetic**

Replace entire contents of `src/styles/themes/work.css`:

```css
/* Work — Studio theme: refined dark with warm undertones */
[data-theme="work"] {
  --color-bg: #0c0c0e;
  --color-surface: #141412;
  --color-text: #e8e4df;
  --color-text-muted: #8a8680;
  --color-accent: #e8e4df;
  --color-accent-glow: rgba(232, 228, 223, 0.15);
  --color-border: rgba(232, 228, 223, 0.08);

  /* Studio-specific tokens */
  --studio-card-bg: rgba(255, 255, 255, 0.03);
  --studio-card-border: rgba(232, 228, 223, 0.06);
  --studio-card-hover-bg: rgba(255, 255, 255, 0.06);
  --studio-card-hover-border: rgba(232, 228, 223, 0.15);
  --studio-gradient-start: #0c0c0e;
  --studio-gradient-end: #141412;
}
```

**Step 3: Add animation tokens to global.css**

Add before the `/* ===== Modern CSS Reset ===== */` comment in `src/styles/global.css`:

```css
  /* Spring animation tokens */
  --spring-bounce: cubic-bezier(0.34, 1.56, 0.64, 1);
  --spring-smooth: cubic-bezier(0.16, 1, 0.3, 1);
```

**Step 4: Verify build**

Run:
```bash
cd ~/Developer/rockroque.com && pnpm build
```
Expected: Clean build. Existing pages render with updated colors.

**Step 5: Commit**

```bash
git add src/styles/themes/portal.css src/styles/themes/work.css src/styles/global.css
git commit -m "style: update portal and work themes to soft white/silver Studio aesthetic"
```

---

## Task 4: Aurora Background Component

**Files:**
- Create: `src/components/shared/AuroraBackground.tsx`

**Step 1: Create the aurora gradient mesh background**

This is a R3F component that renders a subtle animated gradient behind the graph. Uses a custom shader material for smooth color transitions.

```tsx
// src/components/shared/AuroraBackground.tsx
import { useRef, useMemo } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';

const vertexShader = `
  varying vec2 vUv;
  void main() {
    vUv = uv;
    gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
  }
`;

const fragmentShader = `
  uniform float uTime;
  uniform vec2 uMouse;
  varying vec2 vUv;

  // Simplex-style noise
  vec3 mod289(vec3 x) { return x - floor(x * (1.0 / 289.0)) * 289.0; }
  vec2 mod289(vec2 x) { return x - floor(x * (1.0 / 289.0)) * 289.0; }
  vec3 permute(vec3 x) { return mod289(((x*34.0)+1.0)*x); }

  float snoise(vec2 v) {
    const vec4 C = vec4(0.211324865405187, 0.366025403784439,
                        -0.577350269189626, 0.024390243902439);
    vec2 i = floor(v + dot(v, C.yy));
    vec2 x0 = v - i + dot(i, C.xx);
    vec2 i1 = (x0.x > x0.y) ? vec2(1.0, 0.0) : vec2(0.0, 1.0);
    vec4 x12 = x0.xyxy + C.xxzz;
    x12.xy -= i1;
    i = mod289(i);
    vec3 p = permute(permute(i.y + vec3(0.0, i1.y, 1.0)) + i.x + vec3(0.0, i1.x, 1.0));
    vec3 m = max(0.5 - vec3(dot(x0,x0), dot(x12.xy,x12.xy), dot(x12.zw,x12.zw)), 0.0);
    m = m*m; m = m*m;
    vec3 x = 2.0 * fract(p * C.www) - 1.0;
    vec3 h = abs(x) - 0.5;
    vec3 ox = floor(x + 0.5);
    vec3 a0 = x - ox;
    m *= 1.79284291400159 - 0.85373472095314 * (a0*a0 + h*h);
    vec3 g;
    g.x = a0.x * x0.x + h.x * x0.y;
    g.yz = a0.yz * x12.xz + h.yz * x12.yw;
    return 130.0 * dot(m, g);
  }

  void main() {
    vec2 uv = vUv;

    // Slow-moving noise layers
    float n1 = snoise(uv * 1.5 + uTime * 0.05 + uMouse * 0.1);
    float n2 = snoise(uv * 2.5 - uTime * 0.03);
    float n3 = snoise(uv * 0.8 + uTime * 0.02);

    // Deep cosmic colors
    vec3 indigo = vec3(0.08, 0.05, 0.18);
    vec3 teal = vec3(0.04, 0.10, 0.12);
    vec3 dark = vec3(0.047, 0.047, 0.055);

    vec3 color = mix(dark, indigo, smoothstep(-0.3, 0.5, n1) * 0.4);
    color = mix(color, teal, smoothstep(-0.2, 0.6, n2) * 0.3);
    color += dark * smoothstep(-0.5, 0.3, n3) * 0.15;

    // Vignette
    float vignette = 1.0 - length(uv - 0.5) * 0.8;
    color *= vignette;

    gl_FragColor = vec4(color, 1.0);
  }
`;

export default function AuroraBackground() {
  const meshRef = useRef<THREE.Mesh>(null);
  const mouseRef = useRef(new THREE.Vector2(0, 0));

  const uniforms = useMemo(() => ({
    uTime: { value: 0 },
    uMouse: { value: new THREE.Vector2(0, 0) },
  }), []);

  useFrame(({ clock, pointer }) => {
    uniforms.uTime.value = clock.elapsedTime;
    // Smooth mouse follow
    mouseRef.current.lerp(pointer, 0.02);
    uniforms.uMouse.value.copy(mouseRef.current);
  });

  return (
    <mesh ref={meshRef} position={[0, 0, -15]} scale={[40, 40, 1]}>
      <planeGeometry args={[1, 1, 1, 1]} />
      <shaderMaterial
        vertexShader={vertexShader}
        fragmentShader={fragmentShader}
        uniforms={uniforms}
        depthWrite={false}
      />
    </mesh>
  );
}
```

**Step 2: Verify TypeScript**

Run:
```bash
cd ~/Developer/rockroque.com && npx tsc --noEmit
```
Expected: No errors.

**Step 3: Commit**

```bash
git add src/components/shared/AuroraBackground.tsx
git commit -m "feat(portal): add aurora gradient background shader component"
```

---

## Task 5: Graph Node Component

**Files:**
- Create: `src/components/portal/GraphNodes.tsx`

**Step 1: Create instanced node renderer with glow and labels**

Uses instancedMesh for performance (one draw call for all nodes). Glow is a second transparent instanced layer. Labels use drei's Html component.

```tsx
// src/components/portal/GraphNodes.tsx
import { useRef, useMemo, useCallback, useEffect, useState } from 'react';
import { useFrame } from '@react-three/fiber';
import { Html } from '@react-three/drei';
import * as THREE from 'three';
import { type GraphNode, GROUP_COLORS, DOMAIN_NODES } from './graph-data';

interface GraphNodesProps {
  nodes: (GraphNode & { position: THREE.Vector3 })[];
  hoveredId: string | null;
  activeIds: Set<string>;
  onHover: (id: string | null) => void;
  onClick: (node: GraphNode & { position: THREE.Vector3 }) => void;
}

const tempObject = new THREE.Object3D();
const tempColor = new THREE.Color();

export default function GraphNodes({ nodes, hoveredId, activeIds, onHover, onClick }: GraphNodesProps) {
  const meshRef = useRef<THREE.InstancedMesh>(null);
  const glowRef = useRef<THREE.InstancedMesh>(null);
  const colorsRef = useRef<Float32Array>();
  const [reducedMotion, setReducedMotion] = useState(false);

  useEffect(() => {
    const mq = window.matchMedia('(prefers-reduced-motion: reduce)');
    setReducedMotion(mq.matches);
    const handler = (e: MediaQueryListEvent) => setReducedMotion(e.matches);
    mq.addEventListener('change', handler);
    return () => mq.removeEventListener('change', handler);
  }, []);

  // Initialize instance colors
  const colorArray = useMemo(() => {
    const arr = new Float32Array(nodes.length * 3);
    nodes.forEach((node, i) => {
      tempColor.set(GROUP_COLORS[node.group]);
      arr[i * 3] = tempColor.r;
      arr[i * 3 + 1] = tempColor.g;
      arr[i * 3 + 2] = tempColor.b;
    });
    colorsRef.current = arr;
    return arr;
  }, [nodes]);

  useFrame(({ clock }) => {
    if (!meshRef.current || !glowRef.current) return;
    const time = clock.elapsedTime;

    nodes.forEach((node, i) => {
      const isHovered = node.id === hoveredId;
      const isActive = activeIds.has(node.id);
      const isDomain = DOMAIN_NODES.has(node.id);

      // Base scale from node size
      const baseScale = node.size * 0.012;
      const hoverScale = isHovered ? 1.3 : isActive ? 1.15 : 1;
      // Subtle pulse for domain nodes
      const pulse = isDomain && !reducedMotion ? 1 + Math.sin(time * 1.5 + i) * 0.05 : 1;
      const scale = baseScale * hoverScale * pulse;

      tempObject.position.copy(node.position);
      tempObject.scale.setScalar(scale);
      tempObject.updateMatrix();
      meshRef.current!.setMatrixAt(i, tempObject.matrix);

      // Glow layer — larger, more transparent
      const glowScale = scale * (isHovered ? 3 : isActive ? 2.5 : 1.8);
      tempObject.scale.setScalar(glowScale);
      tempObject.updateMatrix();
      glowRef.current!.setMatrixAt(i, tempObject.matrix);
    });

    meshRef.current.instanceMatrix.needsUpdate = true;
    glowRef.current.instanceMatrix.needsUpdate = true;
  });

  const handlePointerMove = useCallback((e: THREE.Event) => {
    e.stopPropagation();
    const id = e.instanceId !== undefined ? nodes[e.instanceId]?.id : null;
    onHover(id ?? null);
  }, [nodes, onHover]);

  const handlePointerOut = useCallback(() => {
    onHover(null);
  }, [onHover]);

  const handleClick = useCallback((e: THREE.Event) => {
    e.stopPropagation();
    if (e.instanceId !== undefined && nodes[e.instanceId]) {
      onClick(nodes[e.instanceId]);
    }
  }, [nodes, onClick]);

  return (
    <>
      {/* Solid node dots */}
      <instancedMesh
        ref={meshRef}
        args={[undefined, undefined, nodes.length]}
        onPointerMove={handlePointerMove}
        onPointerOut={handlePointerOut}
        onClick={handleClick}
      >
        <sphereGeometry args={[1, 16, 16]} />
        <meshBasicMaterial toneMapped={false}>
          <instancedBufferAttribute
            attach="geometry-attributes-color"
            args={[colorArray, 3]}
          />
        </meshBasicMaterial>
      </instancedMesh>

      {/* Glow layer */}
      <instancedMesh
        ref={glowRef}
        args={[undefined, undefined, nodes.length]}
        raycast={() => null}
      >
        <sphereGeometry args={[1, 12, 12]} />
        <meshBasicMaterial
          color="#e8e4df"
          transparent
          opacity={0.04}
          depthWrite={false}
          toneMapped={false}
        />
      </instancedMesh>

      {/* Labels via Html overlays */}
      {nodes.map((node) => {
        const isHovered = node.id === hoveredId;
        const isActive = activeIds.has(node.id);
        const isDomain = DOMAIN_NODES.has(node.id);
        const show = isHovered || isActive || isDomain || node.id === 'rock';
        if (!show) return null;

        return (
          <Html
            key={node.id}
            position={[node.position.x, node.position.y - node.size * 0.018, node.position.z]}
            center
            style={{
              pointerEvents: 'none',
              userSelect: 'none',
              whiteSpace: 'nowrap',
            }}
          >
            <span
              style={{
                fontFamily: "'Space Mono', monospace",
                fontSize: node.id === 'rock' ? '14px' : isDomain ? '12px' : '10px',
                fontWeight: isHovered || isDomain ? 600 : 400,
                color: isHovered || isActive ? '#e8e4df' : '#8a8680',
                textShadow: isHovered ? '0 0 20px rgba(232,228,223,0.3)' : 'none',
                opacity: isActive ? 1 : activeIds.size > 0 ? 0.3 : 0.7,
                transition: 'opacity 0.3s, color 0.3s',
              }}
            >
              {node.label}
            </span>
          </Html>
        );
      })}
    </>
  );
}
```

**Step 2: Verify TypeScript**

Run:
```bash
cd ~/Developer/rockroque.com && npx tsc --noEmit
```
Expected: No errors (may need to adjust types — R3F event types can be tricky; use `any` for event params if needed, then refine).

**Step 3: Commit**

```bash
git add src/components/portal/GraphNodes.tsx
git commit -m "feat(portal): add instanced graph nodes with glow and labels"
```

---

## Task 6: Graph Edges + Synapse Particles

**Files:**
- Create: `src/components/portal/GraphEdges.tsx`

**Step 1: Create edge lines and animated synapse particles**

Edges rendered as thin lines using drei's `Line`. Synapse particles animate along edges when nodes are activated.

```tsx
// src/components/portal/GraphEdges.tsx
import { useRef, useMemo } from 'react';
import { useFrame } from '@react-three/fiber';
import { Line } from '@react-three/drei';
import * as THREE from 'three';
import { type GraphNode, type GraphEdge, GROUP_COLORS } from './graph-data';

interface PositionedNode extends GraphNode {
  position: THREE.Vector3;
}

interface Particle {
  edgeIndex: number;
  t: number;
  speed: number;
  life: number;
}

interface GraphEdgesProps {
  nodes: PositionedNode[];
  edges: GraphEdge[];
  activeIds: Set<string>;
}

export default function GraphEdges({ nodes, edges, activeIds }: GraphEdgesProps) {
  const particlesRef = useRef<Particle[]>([]);
  const particleMeshRef = useRef<THREE.InstancedMesh>(null);
  const prevActiveRef = useRef<Set<string>>(new Set());

  const nodeMap = useMemo(() => {
    const map = new Map<string, PositionedNode>();
    nodes.forEach((n) => map.set(n.id, n));
    return map;
  }, [nodes]);

  // Resolve edges to positioned pairs
  const resolvedEdges = useMemo(() =>
    edges.map((e) => ({
      source: nodeMap.get(e.source)!,
      target: nodeMap.get(e.target)!,
    })).filter((e) => e.source && e.target),
    [edges, nodeMap]
  );

  // Fire particles when new nodes become active
  useFrame(() => {
    const newIds = [...activeIds].filter((id) => !prevActiveRef.current.has(id));
    if (newIds.length > 0) {
      resolvedEdges.forEach((edge, idx) => {
        const srcActive = activeIds.has(edge.source.id);
        const tgtActive = activeIds.has(edge.target.id);
        if (srcActive || tgtActive) {
          for (let i = 0; i < 3; i++) {
            particlesRef.current.push({
              edgeIndex: idx,
              t: -i * 0.12,
              speed: 0.008 + Math.random() * 0.006,
              life: 1,
            });
          }
        }
      });
    }
    prevActiveRef.current = new Set(activeIds);

    // Update particles
    particlesRef.current = particlesRef.current.filter((p) => {
      p.t += p.speed;
      p.life -= 0.008;
      return p.life > 0 && p.t <= 1;
    });

    // Update particle instances
    if (particleMeshRef.current) {
      const tempObj = new THREE.Object3D();
      const max = 200; // max visible particles
      const particles = particlesRef.current.slice(0, max);

      particles.forEach((p, i) => {
        if (p.t < 0 || p.t > 1) {
          tempObj.scale.setScalar(0);
        } else {
          const edge = resolvedEdges[p.edgeIndex];
          if (!edge) { tempObj.scale.setScalar(0); tempObj.updateMatrix(); particleMeshRef.current!.setMatrixAt(i, tempObj.matrix); return; }
          const pos = new THREE.Vector3().lerpVectors(edge.source.position, edge.target.position, p.t);
          tempObj.position.copy(pos);
          tempObj.scale.setScalar(0.02 * p.life);
        }
        tempObj.updateMatrix();
        particleMeshRef.current!.setMatrixAt(i, tempObj.matrix);
      });

      // Hide unused instances
      for (let i = particles.length; i < max; i++) {
        tempObj.scale.setScalar(0);
        tempObj.updateMatrix();
        particleMeshRef.current!.setMatrixAt(i, tempObj.matrix);
      }

      particleMeshRef.current.instanceMatrix.needsUpdate = true;
    }
  });

  return (
    <>
      {/* Edge lines */}
      {resolvedEdges.map((edge, i) => {
        const isActive = activeIds.has(edge.source.id) || activeIds.has(edge.target.id);
        return (
          <Line
            key={`${edge.source.id}-${edge.target.id}`}
            points={[edge.source.position, edge.target.position]}
            color={GROUP_COLORS[edge.source.group]}
            lineWidth={isActive ? 1.5 : 0.5}
            transparent
            opacity={isActive ? 0.4 : 0.08}
          />
        );
      })}

      {/* Synapse particles */}
      <instancedMesh
        ref={particleMeshRef}
        args={[undefined, undefined, 200]}
        raycast={() => null}
      >
        <sphereGeometry args={[1, 8, 8]} />
        <meshBasicMaterial
          color="#e8e4df"
          transparent
          opacity={0.6}
          depthWrite={false}
          toneMapped={false}
        />
      </instancedMesh>
    </>
  );
}
```

**Step 2: Verify TypeScript**

Run:
```bash
cd ~/Developer/rockroque.com && npx tsc --noEmit
```

**Step 3: Commit**

```bash
git add src/components/portal/GraphEdges.tsx
git commit -m "feat(portal): add graph edge lines and synapse particle system"
```

---

## Task 7: Search Input Component

**Files:**
- Create: `src/components/portal/SearchInput.tsx`

**Step 1: Create floating search input**

```tsx
// src/components/portal/SearchInput.tsx
import { useCallback } from 'react';

interface SearchInputProps {
  value: string;
  onChange: (query: string) => void;
}

export default function SearchInput({ value, onChange }: SearchInputProps) {
  const handleInput = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => onChange(e.target.value),
    [onChange]
  );

  return (
    <div style={{
      position: 'absolute',
      bottom: '2rem',
      left: '50%',
      transform: 'translateX(-50%)',
      zIndex: 10,
      width: 'min(400px, calc(100% - 3rem))',
    }}>
      <div style={{
        display: 'flex',
        alignItems: 'center',
        background: 'rgba(12, 12, 14, 0.8)',
        backdropFilter: 'blur(12px)',
        border: '1px solid rgba(232, 228, 223, 0.1)',
        borderRadius: '8px',
        padding: '0.6rem 1rem',
        transition: 'border-color 0.3s',
      }}>
        <span style={{
          color: '#8a8680',
          fontSize: '0.75rem',
          fontFamily: "'IBM Plex Mono', monospace",
          marginRight: '0.5rem',
          whiteSpace: 'nowrap',
          userSelect: 'none',
        }}>
          search &gt;
        </span>
        <input
          type="text"
          value={value}
          onChange={handleInput}
          placeholder="type a topic to explore..."
          autoComplete="off"
          spellCheck={false}
          aria-label="Search the knowledge graph"
          style={{
            flex: 1,
            background: 'none',
            border: 'none',
            outline: 'none',
            color: '#e8e4df',
            fontFamily: "'IBM Plex Mono', monospace",
            fontSize: '0.85rem',
            caretColor: '#e8e4df',
          }}
        />
      </div>
    </div>
  );
}
```

**Step 2: Commit**

```bash
git add src/components/portal/SearchInput.tsx
git commit -m "feat(portal): add graph search input overlay"
```

---

## Task 8: Tooltip Component

**Files:**
- Create: `src/components/portal/Tooltip.tsx`

**Step 1: Create hover tooltip**

```tsx
// src/components/portal/Tooltip.tsx
import type { GraphNode } from './graph-data';

interface TooltipProps {
  node: GraphNode | null;
  position: { x: number; y: number };
  connections: string[];
}

export default function Tooltip({ node, position, connections }: TooltipProps) {
  if (!node) return null;

  return (
    <div
      role="tooltip"
      style={{
        position: 'absolute',
        left: position.x + 15,
        top: position.y - 10,
        zIndex: 20,
        background: 'rgba(12, 12, 14, 0.95)',
        backdropFilter: 'blur(12px)',
        border: '1px solid rgba(232, 228, 223, 0.15)',
        borderRadius: '6px',
        padding: '0.7rem 0.9rem',
        pointerEvents: 'none',
        maxWidth: '240px',
        boxShadow: '0 4px 20px rgba(0,0,0,0.3)',
      }}
    >
      <div style={{
        fontFamily: "'Space Mono', monospace",
        fontSize: '0.8rem',
        color: '#e8e4df',
        fontWeight: 700,
        marginBottom: '0.25rem',
      }}>
        {node.label}
      </div>
      <div style={{
        fontSize: '0.7rem',
        color: '#8a8680',
        lineHeight: 1.5,
      }}>
        {node.desc}
      </div>
      {connections.length > 0 && (
        <div style={{
          fontSize: '0.65rem',
          color: '#6a6660',
          marginTop: '0.35rem',
          borderTop: '1px solid rgba(232,228,223,0.08)',
          paddingTop: '0.35rem',
        }}>
          {'↔ ' + connections.join(' · ')}
        </div>
      )}
    </div>
  );
}
```

**Step 2: Commit**

```bash
git add src/components/portal/Tooltip.tsx
git commit -m "feat(portal): add hover tooltip component"
```

---

## Task 9: BrainGraph Main Component

**Files:**
- Create: `src/components/portal/BrainGraph.tsx`

This is the orchestrator — assembles all graph sub-components into the R3F Canvas.

**Step 1: Create the main BrainGraph component**

```tsx
// src/components/portal/BrainGraph.tsx
import { useState, useMemo, useCallback, useRef, useEffect } from 'react';
import { Canvas, useThree } from '@react-three/fiber';
import { OrbitControls } from '@react-three/drei';
import * as THREE from 'three';
import { NODES, EDGES, GROUP_OFFSETS, DOMAIN_NODES, type GraphNode } from './graph-data';
import AuroraBackground from '../shared/AuroraBackground';
import GraphNodes from './GraphNodes';
import GraphEdges from './GraphEdges';
import SearchInput from './SearchInput';
import Tooltip from './Tooltip';

interface PositionedNode extends GraphNode {
  position: THREE.Vector3;
}

/** Fibonacci sphere with group clustering for brain shape */
function computePositions(nodes: GraphNode[]): PositionedNode[] {
  const RADIUS = 3.5;
  const golden = Math.PI * (3 - Math.sqrt(5));

  return nodes.map((node, i) => {
    let x: number, y: number, z: number;

    if (node.id === 'rock') {
      x = 0; y = 0; z = 0;
    } else {
      // Fibonacci sphere point
      const idx = i - 1;
      const total = nodes.length - 1;
      const yNorm = 1 - (idx / (total - 1)) * 2;
      const rY = Math.sqrt(Math.max(0, 1 - yNorm * yNorm));
      const theta = golden * idx;

      const bx = Math.cos(theta) * rY;
      const by = yNorm;
      const bz = Math.sin(theta) * rY;

      // Cluster offset
      const off = GROUP_OFFSETS[node.group];
      x = (bx * 0.6 + off.x * 0.5) * RADIUS;
      y = (by * 0.6 + off.y * 0.5) * RADIUS * 0.85;
      z = (bz * 0.6 + off.z * 0.5) * RADIUS;
    }

    return { ...node, position: new THREE.Vector3(x, y, z) };
  });
}

/** Auto-rotation that pauses on interaction */
function AutoRotate({ enabled }: { enabled: boolean }) {
  const { scene } = useThree();
  const rotRef = useRef(0);

  useEffect(() => {
    // Store initial — nothing to do
  }, []);

  return null; // Handled via OrbitControls autoRotate instead
}

/** Camera transition for domain navigation */
function useDomainTransition() {
  const [transitioning, setTransitioning] = useState(false);
  const overlayRef = useRef<HTMLDivElement>(null);

  const navigateToDomain = useCallback((node: PositionedNode) => {
    if (!node.route || transitioning) return;
    setTransitioning(true);

    // Fade overlay in
    if (overlayRef.current) {
      overlayRef.current.style.opacity = '1';
    }

    // Navigate after fade
    setTimeout(() => {
      window.location.href = node.route!;
    }, 600);
  }, [transitioning]);

  return { transitioning, navigateToDomain, overlayRef };
}

export default function BrainGraph() {
  const [hoveredId, setHoveredId] = useState<string | null>(null);
  const [activeIds, setActiveIds] = useState<Set<string>>(new Set());
  const [searchQuery, setSearchQuery] = useState('');
  const [tooltipData, setTooltipData] = useState<{
    node: GraphNode | null;
    position: { x: number; y: number };
    connections: string[];
  }>({ node: null, position: { x: 0, y: 0 }, connections: [] });

  const { transitioning, navigateToDomain, overlayRef } = useDomainTransition();

  const positionedNodes = useMemo(() => computePositions(NODES), []);

  // Search: activate matching nodes
  useEffect(() => {
    if (searchQuery.length < 2) {
      setActiveIds(new Set());
      return;
    }
    const q = searchQuery.toLowerCase();
    const matched = new Set<string>();
    positionedNodes.forEach((n) => {
      if (
        n.label.toLowerCase().includes(q) ||
        n.desc.toLowerCase().includes(q) ||
        n.id.includes(q)
      ) {
        matched.add(n.id);
        // Also activate connected nodes
        EDGES.forEach((e) => {
          if (e.source === n.id) matched.add(e.target);
          if (e.target === n.id) matched.add(e.source);
        });
      }
    });
    setActiveIds(matched);
  }, [searchQuery, positionedNodes]);

  const handleHover = useCallback((id: string | null) => {
    setHoveredId(id);
    if (id) {
      const node = positionedNodes.find((n) => n.id === id);
      if (node) {
        const connections = EDGES
          .filter((e) => e.source === id || e.target === id)
          .map((e) => {
            const otherId = e.source === id ? e.target : e.source;
            return positionedNodes.find((n) => n.id === otherId)?.label ?? '';
          })
          .filter(Boolean);
        // We'll update position from pointer events on the container
        setTooltipData((prev) => ({ node, position: prev.position, connections }));
      }
    } else {
      setTooltipData((prev) => ({ ...prev, node: null }));
    }
  }, [positionedNodes]);

  const handleClick = useCallback((node: PositionedNode) => {
    if (DOMAIN_NODES.has(node.id) && node.route) {
      navigateToDomain(node);
    } else {
      // Toggle activation for non-domain nodes
      setActiveIds((prev) => {
        const next = new Set<string>();
        next.add(node.id);
        EDGES.forEach((e) => {
          if (e.source === node.id) next.add(e.target);
          if (e.target === node.id) next.add(e.source);
        });
        return next;
      });
    }
  }, [navigateToDomain]);

  const handleContainerPointerMove = useCallback((e: React.PointerEvent) => {
    const rect = e.currentTarget.getBoundingClientRect();
    setTooltipData((prev) => ({
      ...prev,
      position: { x: e.clientX - rect.left, y: e.clientY - rect.top },
    }));
  }, []);

  const handleBackgroundClick = useCallback(() => {
    setActiveIds(new Set());
    setHoveredId(null);
  }, []);

  return (
    <div
      style={{
        position: 'relative',
        width: '100%',
        height: '100vh',
        background: '#0c0c0e',
        cursor: hoveredId ? 'pointer' : 'grab',
      }}
      onPointerMove={handleContainerPointerMove}
    >
      <Canvas
        camera={{ position: [0, 0, 8], fov: 50 }}
        style={{ position: 'absolute', top: 0, left: 0 }}
        gl={{ antialias: true, alpha: false }}
        onPointerMissed={handleBackgroundClick}
      >
        <AuroraBackground />
        <ambientLight intensity={0.5} />
        <GraphEdges
          nodes={positionedNodes}
          edges={EDGES}
          activeIds={activeIds}
        />
        <GraphNodes
          nodes={positionedNodes}
          hoveredId={hoveredId}
          activeIds={activeIds}
          onHover={handleHover}
          onClick={handleClick}
        />
        <OrbitControls
          makeDefault
          enablePan={false}
          enableDamping
          dampingFactor={0.05}
          minDistance={4}
          maxDistance={16}
          autoRotate={activeIds.size === 0 && !hoveredId}
          autoRotateSpeed={0.3}
        />
      </Canvas>

      <Tooltip
        node={tooltipData.node}
        position={tooltipData.position}
        connections={tooltipData.connections}
      />

      <SearchInput value={searchQuery} onChange={setSearchQuery} />

      {/* Domain transition overlay */}
      <div
        ref={overlayRef}
        style={{
          position: 'absolute',
          inset: 0,
          background: '#0c0c0e',
          opacity: 0,
          transition: 'opacity 0.6s ease',
          pointerEvents: transitioning ? 'all' : 'none',
          zIndex: 50,
        }}
      />
    </div>
  );
}
```

**Step 2: Verify TypeScript**

Run:
```bash
cd ~/Developer/rockroque.com && npx tsc --noEmit
```

**Step 3: Commit**

```bash
git add src/components/portal/BrainGraph.tsx
git commit -m "feat(portal): add BrainGraph orchestrator with camera, search, transitions"
```

---

## Task 10: Portal Landing Page

**Files:**
- Modify: `src/pages/index.astro`
- Modify: `src/layouts/PortalLayout.astro`

**Step 1: Update PortalLayout for full-viewport graph**

Replace entire contents of `src/layouts/PortalLayout.astro`:

```astro
---
interface Props {
  title: string;
}

const { title } = Astro.props;
---

<!doctype html>
<html lang="en" data-theme="portal">
  <head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <meta name="description" content="Rock Roqué — Design Engineer & Civic Technologist. An explorable map of a mind." />
    <link rel="icon" type="image/svg+xml" href="/rockroque.com/favicon.svg" />
    <title>{title}</title>
    <style>
      @import '../styles/global.css';
      @import '../styles/themes/portal.css';
    </style>
  </head>
  <body>
    <a href="#fallback-nav" class="skip-link">Skip to navigation</a>
    <slot />
  </body>
</html>
```

**Step 2: Replace index.astro with graph island + fallback nav**

Replace entire contents of `src/pages/index.astro`:

```astro
---
import PortalLayout from '../layouts/PortalLayout.astro';
import BrainGraph from '../components/portal/BrainGraph';
---

<PortalLayout title="Rock Roqué — Mind Portal">
  {/* React island: client:only skips SSR (required for WebGL) */}
  <BrainGraph client:only="react" />

  {/* Fallback navigation for no-JS / accessibility */}
  <nav id="fallback-nav" class="fallback" aria-label="Site navigation">
    <h1 class="fallback__name">Rock Roqué</h1>
    <p class="fallback__title">Design Engineer · Civic Technologist</p>
    <ul class="fallback__links">
      <li><a href="/rockroque.com/work/">Work</a></li>
      <li><a href="/rockroque.com/study/">Study</a></li>
      <li><a href="/rockroque.com/signal/">Signal</a></li>
      <li><a href="/rockroque.com/workshop/">Workshop</a></li>
      <li><a href="/rockroque.com/life/">Life</a></li>
    </ul>
    <div class="fallback__status" aria-live="polite">
      <span class="fallback__dot"></span>
      <span>Mind Portal active</span>
    </div>
  </nav>
</PortalLayout>

<style>
  .fallback {
    display: flex;
    flex-direction: column;
    align-items: center;
    text-align: center;
    padding: var(--space-2xl) var(--space-lg);
    background: var(--color-bg);
  }

  .fallback__name {
    font-family: var(--font-display);
    font-size: var(--text-3xl);
    font-weight: 700;
    color: var(--color-text);
    letter-spacing: -0.02em;
    margin-bottom: var(--space-sm);
  }

  .fallback__title {
    font-size: var(--text-md);
    color: var(--color-text-muted);
    margin-bottom: var(--space-xl);
  }

  .fallback__links {
    display: flex;
    gap: var(--space-lg);
    flex-wrap: wrap;
    justify-content: center;
    margin-bottom: var(--space-xl);
  }

  .fallback__links a {
    font-family: var(--font-display);
    font-size: var(--text-md);
    color: var(--color-text-muted);
    text-decoration: none;
    letter-spacing: 0.03em;
    padding: var(--space-sm) var(--space-md);
    border: 1px solid var(--color-border);
    border-radius: 4px;
    transition: color var(--duration-fast) var(--ease-out),
                border-color var(--duration-fast) var(--ease-out);
  }

  .fallback__links a:hover {
    color: var(--color-text);
    border-color: var(--color-text-muted);
    text-decoration: none;
  }

  .fallback__status {
    display: flex;
    align-items: center;
    gap: var(--space-sm);
    font-size: var(--text-sm);
    color: var(--color-text-muted);
  }

  .fallback__dot {
    display: inline-block;
    width: 8px;
    height: 8px;
    border-radius: 50%;
    background: #7bc45c;
    box-shadow: 0 0 8px rgba(123, 196, 92, 0.4);
  }
</style>
```

**Step 3: Test locally**

Run:
```bash
cd ~/Developer/rockroque.com && pnpm dev
```
Open `http://localhost:4321/rockroque.com/` in browser. Expected:
- 3D graph renders with aurora background
- Nodes visible, labels show on domain clusters + core
- Hover shows tooltip
- Drag to rotate, scroll to zoom
- Search activates matching nodes
- Clicking a domain node fades and navigates
- Scroll down to see fallback nav

**Step 4: Verify build**

Run:
```bash
cd ~/Developer/rockroque.com && pnpm build
```
Expected: Clean build with all pages generated.

**Step 5: Commit**

```bash
git add src/pages/index.astro src/layouts/PortalLayout.astro
git commit -m "feat(portal): replace placeholder with R3F brain graph landing"
```

---

## Task 11: Shared Motion Components

**Files:**
- Create: `src/components/shared/AnimatedSection.tsx`

**Step 1: Create scroll-triggered reveal wrapper using Motion**

```tsx
// src/components/shared/AnimatedSection.tsx
import { motion } from 'motion/react';
import type { ReactNode, CSSProperties } from 'react';

interface AnimatedSectionProps {
  children: ReactNode;
  delay?: number;
  className?: string;
  style?: CSSProperties;
}

export default function AnimatedSection({
  children,
  delay = 0,
  className,
  style,
}: AnimatedSectionProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: '-50px' }}
      transition={{
        type: 'spring',
        stiffness: 100,
        damping: 20,
        delay,
      }}
      className={className}
      style={style}
    >
      {children}
    </motion.div>
  );
}
```

**Step 2: Commit**

```bash
git add src/components/shared/AnimatedSection.tsx
git commit -m "feat(shared): add AnimatedSection scroll-triggered reveal component"
```

---

## Task 12: Work Domain Components

**Files:**
- Create: `src/components/domains/work/SectionCard.tsx`
- Create: `src/components/domains/work/ProjectCard.tsx`

**Step 1: Create SectionCard for Work landing sub-sections**

```tsx
// src/components/domains/work/SectionCard.tsx
import { motion } from 'motion/react';

interface SectionCardProps {
  title: string;
  description: string;
  href?: string;
  comingSoon?: boolean;
  accentColor?: string;
  delay?: number;
}

export default function SectionCard({
  title,
  description,
  href,
  comingSoon = false,
  accentColor = '#e8e4df',
  delay = 0,
}: SectionCardProps) {
  const Tag = href && !comingSoon ? 'a' : 'div';

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ type: 'spring', stiffness: 100, damping: 20, delay }}
      whileHover={!comingSoon ? { scale: 1.02, y: -4 } : undefined}
      style={{ cursor: comingSoon ? 'default' : 'pointer' }}
    >
      <Tag
        href={href}
        style={{
          display: 'block',
          padding: '1.5rem',
          background: 'var(--studio-card-bg)',
          border: '1px solid var(--studio-card-border)',
          borderRadius: '8px',
          textDecoration: 'none',
          color: 'inherit',
          transition: 'background 0.3s, border-color 0.3s, box-shadow 0.3s',
          position: 'relative',
          overflow: 'hidden',
        }}
        onMouseEnter={(e: React.MouseEvent<HTMLElement>) => {
          const el = e.currentTarget;
          el.style.background = 'var(--studio-card-hover-bg)';
          el.style.borderColor = 'var(--studio-card-hover-border)';
          el.style.boxShadow = `0 0 30px ${accentColor}08`;
        }}
        onMouseLeave={(e: React.MouseEvent<HTMLElement>) => {
          const el = e.currentTarget;
          el.style.background = 'var(--studio-card-bg)';
          el.style.borderColor = 'var(--studio-card-border)';
          el.style.boxShadow = 'none';
        }}
      >
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '0.5rem' }}>
          <h3 style={{
            fontFamily: "'Space Mono', monospace",
            fontSize: '1.1rem',
            fontWeight: 700,
            color: 'var(--color-text)',
          }}>
            {title}
          </h3>
          {comingSoon && (
            <span style={{
              fontSize: '0.65rem',
              color: 'var(--color-text-muted)',
              border: '1px solid var(--color-border)',
              padding: '0.15rem 0.5rem',
              borderRadius: '3px',
              letterSpacing: '0.05em',
              textTransform: 'uppercase',
            }}>
              Soon
            </span>
          )}
        </div>
        <p style={{
          fontSize: '0.85rem',
          color: 'var(--color-text-muted)',
          lineHeight: 1.6,
        }}>
          {description}
        </p>
        {/* Subtle accent line at bottom */}
        <div style={{
          position: 'absolute',
          bottom: 0,
          left: 0,
          right: 0,
          height: '2px',
          background: `linear-gradient(90deg, transparent, ${accentColor}20, transparent)`,
        }} />
      </Tag>
    </motion.div>
  );
}
```

**Step 2: Create ProjectCard for Now page**

```tsx
// src/components/domains/work/ProjectCard.tsx
import { motion } from 'motion/react';

interface ProjectCardProps {
  name: string;
  status: 'Active' | 'Shipping' | 'Learning';
  description: string;
  href?: string;
  delay?: number;
}

const STATUS_COLORS: Record<string, string> = {
  Active: '#7bc45c',
  Shipping: '#d4a853',
  Learning: '#5c9ec4',
};

export default function ProjectCard({ name, status, description, href, delay = 0 }: ProjectCardProps) {
  return (
    <motion.div
      initial={{ opacity: 0, x: -20 }}
      whileInView={{ opacity: 1, x: 0 }}
      viewport={{ once: true }}
      transition={{ type: 'spring', stiffness: 100, damping: 20, delay }}
    >
      <div style={{
        padding: '1.25rem 0',
        borderBottom: '1px solid var(--color-border)',
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'flex-start',
        gap: '1rem',
      }}>
        <div style={{ flex: 1 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '0.35rem' }}>
            <h3 style={{
              fontFamily: "'Space Mono', monospace",
              fontSize: '1rem',
              fontWeight: 700,
              color: 'var(--color-text)',
            }}>
              {href ? (
                <a href={href} target="_blank" rel="noopener noreferrer" style={{
                  color: 'inherit',
                  textDecoration: 'none',
                  borderBottom: '1px solid var(--color-border)',
                  transition: 'border-color 0.3s',
                }}>
                  {name}
                </a>
              ) : name}
            </h3>
            <span style={{
              fontSize: '0.6rem',
              fontWeight: 600,
              color: STATUS_COLORS[status],
              border: `1px solid ${STATUS_COLORS[status]}40`,
              padding: '0.1rem 0.4rem',
              borderRadius: '3px',
              letterSpacing: '0.06em',
              textTransform: 'uppercase',
            }}>
              {status}
            </span>
          </div>
          <p style={{
            fontSize: '0.85rem',
            color: 'var(--color-text-muted)',
            lineHeight: 1.6,
          }}>
            {description}
          </p>
        </div>
      </div>
    </motion.div>
  );
}
```

**Step 3: Commit**

```bash
git add src/components/domains/work/SectionCard.tsx src/components/domains/work/ProjectCard.tsx
git commit -m "feat(work): add SectionCard and ProjectCard components"
```

---

## Task 13: Work Layout Update

**Files:**
- Modify: `src/layouts/WorkLayout.astro`

**Step 1: Update WorkLayout with Studio aesthetic and navigation**

Replace entire contents of `src/layouts/WorkLayout.astro`:

```astro
---
interface Props {
  title: string;
}

const { title } = Astro.props;
---

<!doctype html>
<html lang="en" data-theme="work">
  <head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <link rel="icon" type="image/svg+xml" href="/rockroque.com/favicon.svg" />
    <title>{title} — Rock Roqué</title>
    <style>
      @import '../styles/global.css';
      @import '../styles/themes/work.css';

      .studio-nav {
        position: fixed;
        top: 0;
        left: 0;
        right: 0;
        z-index: var(--z-overlay);
        padding: 1rem 2rem;
        display: flex;
        justify-content: space-between;
        align-items: center;
        background: linear-gradient(180deg, var(--color-bg) 0%, transparent 100%);
      }

      .studio-nav__back {
        font-size: var(--text-sm);
        color: var(--color-text-muted);
        text-decoration: none;
        letter-spacing: 0.03em;
        transition: color var(--duration-fast) var(--ease-out);
      }

      .studio-nav__back:hover {
        color: var(--color-text);
        text-decoration: none;
      }

      .studio-nav__links {
        display: flex;
        gap: var(--space-md);
      }

      .studio-nav__links a {
        font-size: var(--text-sm);
        color: var(--color-text-muted);
        text-decoration: none;
        transition: color var(--duration-fast) var(--ease-out);
      }

      .studio-nav__links a:hover {
        color: var(--color-text);
        text-decoration: none;
      }

      .studio-content {
        max-width: 800px;
        margin: 0 auto;
        padding: 6rem 2rem 4rem;
      }

      @media (max-width: 600px) {
        .studio-nav {
          padding: 0.75rem 1.25rem;
        }
        .studio-content {
          padding: 5rem 1.25rem 3rem;
        }
      }
    </style>
  </head>
  <body>
    <a href="#main" class="skip-link">Skip to content</a>

    <nav class="studio-nav" aria-label="Work navigation">
      <a href="/rockroque.com/" class="studio-nav__back">← Portal</a>
      <div class="studio-nav__links">
        <a href="/rockroque.com/work/">Work</a>
        <a href="/rockroque.com/work/now/">Now</a>
      </div>
    </nav>

    <main id="main" class="studio-content">
      <slot />
    </main>
  </body>
</html>
```

**Step 2: Commit**

```bash
git add src/layouts/WorkLayout.astro
git commit -m "style(work): update WorkLayout to Studio aesthetic with nav"
```

---

## Task 14: Work Landing Page

**Files:**
- Modify: `src/pages/work/index.astro`

**Step 1: Build the Work landing with animated hero + section cards**

Replace entire contents of `src/pages/work/index.astro`:

```astro
---
import WorkLayout from '../../layouts/WorkLayout.astro';
import AnimatedSection from '../../components/shared/AnimatedSection';
import SectionCard from '../../components/domains/work/SectionCard';
---

<WorkLayout title="Work">
  {/* Hero */}
  <AnimatedSection client:visible>
    <header class="hero">
      <p class="hero__label">Rock Roqué / Work</p>
      <h1 class="hero__title">Design Engineer &<br />Civic Technologist</h1>
      <p class="hero__bio">
        I lead product engineering at the Maryland Department of Digital Services,
        where I modernize Maryland.gov and steward the Maryland Web Design System.
        I build at the intersection of design systems, accessibility, and AI.
      </p>
    </header>
  </AnimatedSection>

  {/* Section cards */}
  <section class="sections" aria-label="Work sections">
    <AnimatedSection client:visible delay={0.1}>
      <h2 class="sections__header">Explore</h2>
    </AnimatedSection>

    <div class="sections__grid">
      <SectionCard
        client:visible
        title="Now"
        description="Active projects I'm building and shipping right now."
        href="/rockroque.com/work/now/"
        accentColor="#7bc45c"
        delay={0.15}
      />
      <SectionCard
        client:visible
        title="Design"
        description="How I approach projects in the world of AI — case studies, design system philosophy, Figma-to-code workflows."
        comingSoon
        accentColor="#d4a853"
        delay={0.2}
      />
      <SectionCard
        client:visible
        title="Engineering"
        description="Workflows with AI and ML. Claude Code patterns, GitHub Actions, CI/CD, design-to-code automation."
        comingSoon
        accentColor="#ff9500"
        delay={0.25}
      />
      <SectionCard
        client:visible
        title="Organization"
        description="My Claude setup, Obsidian vault structure, tools and productivity systems."
        comingSoon
        accentColor="#5c9ec4"
        delay={0.3}
      />
      <SectionCard
        client:visible
        title="Philosophy"
        description="Craft over speed. Accessibility as default. Government deserves startup-quality tech."
        comingSoon
        accentColor="#8b7355"
        delay={0.35}
      />
    </div>
  </section>

  {/* Writing teaser */}
  <AnimatedSection client:visible delay={0.3}>
    <section class="writing" aria-label="Writing">
      <h2 class="sections__header">Writing</h2>
      <div class="writing__list">
        <article class="writing__item">
          <span class="writing__meta">Coming soon</span>
          <h3 class="writing__title">Deploying Claude Code Across a Government Engineering Team</h3>
          <p class="writing__excerpt">What happens when you bring an AI coding tool into a state agency with legacy systems, procurement rules, and real accountability.</p>
        </article>
        <article class="writing__item">
          <span class="writing__meta">Coming soon</span>
          <h3 class="writing__title">Design Systems at the State Level</h3>
          <p class="writing__excerpt">Bridging USWDS to a state-level implementation — the technical decisions, the politics, and what I'd do differently.</p>
        </article>
      </div>
    </section>
  </AnimatedSection>
</WorkLayout>

<style>
  .hero {
    margin-bottom: var(--space-2xl);
  }

  .hero__label {
    font-size: var(--text-sm);
    color: var(--color-text-muted);
    letter-spacing: 0.08em;
    text-transform: uppercase;
    margin-bottom: var(--space-md);
  }

  .hero__title {
    font-family: var(--font-display);
    font-size: clamp(2rem, 5vw, var(--text-3xl));
    font-weight: 700;
    color: var(--color-text);
    letter-spacing: -0.02em;
    line-height: 1.15;
    margin-bottom: var(--space-lg);
  }

  .hero__bio {
    font-size: var(--text-base);
    color: var(--color-text-muted);
    line-height: 1.8;
    max-width: 600px;
    font-weight: 300;
  }

  .sections {
    margin-bottom: var(--space-2xl);
  }

  .sections__header {
    font-size: var(--text-sm);
    color: var(--color-text-muted);
    letter-spacing: 0.12em;
    text-transform: uppercase;
    margin-bottom: var(--space-lg);
    display: flex;
    align-items: center;
    gap: 0.75rem;
  }

  .sections__header::after {
    content: '';
    flex: 1;
    height: 1px;
    background: var(--color-border);
  }

  .sections__grid {
    display: grid;
    gap: var(--space-md);
  }

  .writing {
    margin-bottom: var(--space-2xl);
  }

  .writing__list {
    display: grid;
    gap: var(--space-sm);
  }

  .writing__item {
    padding: 1.25rem 1.5rem;
    border: 1px solid transparent;
    border-radius: 4px;
    transition: background var(--duration-fast) var(--ease-out),
                border-color var(--duration-fast) var(--ease-out);
  }

  .writing__item:hover {
    background: var(--studio-card-bg);
    border-color: var(--studio-card-border);
  }

  .writing__meta {
    font-size: var(--text-xs);
    color: var(--color-text-muted);
    letter-spacing: 0.08em;
    text-transform: uppercase;
  }

  .writing__title {
    font-family: var(--font-display);
    font-size: var(--text-base);
    font-weight: 700;
    color: var(--color-text);
    margin: 0.3rem 0;
  }

  .writing__excerpt {
    font-size: var(--text-sm);
    color: var(--color-text-muted);
    line-height: 1.6;
    font-weight: 300;
  }
</style>
```

**Step 2: Test locally**

Run:
```bash
cd ~/Developer/rockroque.com && pnpm dev
```
Open `http://localhost:4321/rockroque.com/work/` — verify:
- Hero animates in on load
- Section cards stagger in with spring animation
- Cards have hover effects (scale, glow)
- "Now" card links to /work/now/
- Others show "Soon" badge
- Writing teasers visible

**Step 3: Commit**

```bash
git add src/pages/work/index.astro
git commit -m "feat(work): build Studio landing with animated hero and section cards"
```

---

## Task 15: Work Now Page

**Files:**
- Create: `src/pages/work/now.astro`

**Step 1: Create the Now page with project cards**

```astro
---
import WorkLayout from '../../layouts/WorkLayout.astro';
import AnimatedSection from '../../components/shared/AnimatedSection';
import ProjectCard from '../../components/domains/work/ProjectCard';
---

<WorkLayout title="Now">
  <AnimatedSection client:visible>
    <header class="now-header">
      <p class="now-header__label">Rock Roqué / Work / Now</p>
      <h1 class="now-header__title">What I'm Building</h1>
      <p class="now-header__desc">Active projects, current focus, and what's shipping next.</p>
    </header>
  </AnimatedSection>

  <section class="projects" aria-label="Current projects">
    <ProjectCard
      client:visible
      name="AI.Maryland.gov"
      status="Active"
      description="A comprehensive state AI resource site, built with Astro and the Maryland Web Design System. Consolidating guidance, policy, and tools for state agencies adopting AI responsibly."
      delay={0.1}
    />
    <ProjectCard
      client:visible
      name="LatchLog"
      status="Shipping"
      description="A baby tracking app for new parents — iPhone and Apple Watch. Built with Swift and SwiftUI. Focused on the messy reality of newborn care, not the idealized version."
      delay={0.15}
    />
    <ProjectCard
      client:visible
      name="MDWDS"
      status="Active"
      description="The Maryland Web Design System — a Lit-based component library implementing USWDS for state agencies. 22 components, Storybook documentation, accessibility-first."
      href="https://github.com/maryland-gov/mdwds-core"
      delay={0.2}
    />
    <ProjectCard
      client:visible
      name="Claude Code Enterprise"
      status="Active"
      description="Rolling out Claude Code as a core engineering tool across Maryland state teams. Building workflows, training materials, and governance patterns for AI-assisted government development."
      delay={0.25}
    />
    <ProjectCard
      client:visible
      name="rockroque.com"
      status="Active"
      description="This site. An explorable mind map that's simultaneously a portfolio. Built with Astro, React Three Fiber, and hand-written CSS. The site itself is portfolio piece #1."
      href="https://github.com/RockRoque/rockroque.com"
      delay={0.3}
    />
  </section>
</WorkLayout>

<style>
  .now-header {
    margin-bottom: var(--space-xl);
  }

  .now-header__label {
    font-size: var(--text-sm);
    color: var(--color-text-muted);
    letter-spacing: 0.08em;
    text-transform: uppercase;
    margin-bottom: var(--space-md);
  }

  .now-header__title {
    font-family: var(--font-display);
    font-size: clamp(1.8rem, 4vw, var(--text-2xl));
    font-weight: 700;
    color: var(--color-text);
    letter-spacing: -0.02em;
    margin-bottom: var(--space-sm);
  }

  .now-header__desc {
    font-size: var(--text-base);
    color: var(--color-text-muted);
    font-weight: 300;
  }

  .projects {
    margin-bottom: var(--space-2xl);
  }
</style>
```

**Step 2: Test locally**

Run:
```bash
cd ~/Developer/rockroque.com && pnpm dev
```
Open `http://localhost:4321/rockroque.com/work/now/` — verify:
- Header animates in
- Project cards stagger in from left
- Status badges show correct colors
- Links open in new tab
- Back nav works

**Step 3: Commit**

```bash
git add src/pages/work/now.astro
git commit -m "feat(work): add Now page with active project cards"
```

---

## Task 16: Accessibility Pass

**Files:**
- Modify: `src/components/portal/BrainGraph.tsx` (if adjustments needed)

**Step 1: Add keyboard navigation to graph**

In `BrainGraph.tsx`, add keyboard support to the container div:
- `Tab` should focus the search input
- The graph container should have `role="img"` and an `aria-label`
- The fallback nav (in index.astro) already provides accessible navigation

Verify the following in browser:
1. Tab through the page — skip link → search input → fallback nav links
2. Screen reader announces "Rock Roqué's knowledge graph" for the canvas area
3. Fallback nav provides all domain links without JS
4. All focus-visible outlines work
5. `prefers-reduced-motion: reduce` — disable auto-rotation (OrbitControls `autoRotate` should already respect this via CSS, but verify the graph still renders static)

**Step 2: Test reduced motion**

In browser DevTools → Rendering → check "Emulate CSS media feature prefers-reduced-motion: reduce"
- Graph should render but not auto-rotate
- AnimatedSection components should appear without animation (handled by global CSS rule)
- No janky transitions

**Step 3: Run Lighthouse**

Run Lighthouse in Chrome DevTools on both `/rockroque.com/` and `/rockroque.com/work/`:
- Target: Accessibility score >= 90
- Fix any issues found

**Step 4: Commit any fixes**

```bash
git add -A
git commit -m "a11y: keyboard navigation, reduced motion, ARIA labels"
```

---

## Task 17: Build Verification + Deploy

**Step 1: Full build test**

Run:
```bash
cd ~/Developer/rockroque.com && pnpm build
```
Expected: Clean build, 7+ pages (index, work, work/now, study, signal, workshop, life + sitemap).

**Step 2: Preview built site**

Run:
```bash
cd ~/Developer/rockroque.com && pnpm preview
```
Open `http://localhost:4321/rockroque.com/` — click through all pages, verify:
- Portal graph loads and is interactive
- Domain clusters navigate correctly
- Work landing shows animated content
- Work/Now shows project cards
- Other domain placeholders still work
- No console errors

**Step 3: Commit all remaining changes and push**

```bash
cd ~/Developer/rockroque.com
git add -A
git status
```
Review staged files. Then:
```bash
git commit -m "feat: Phase 1 — portal graph + Work domain Studio landing"
```

**Step 4: Push and create PR**

```bash
git push -u origin feat/phase-1-portal-work
```

Then create PR:
```bash
gh pr create --title "feat: Phase 1 — Portal graph + Work domain" --body "$(cat <<'EOF'
## Summary
- Interactive 3D neural knowledge graph on portal landing (React Three Fiber)
- Aurora gradient shader background
- Domain cluster navigation with smooth zoom + fade transitions
- Work domain "Studio" aesthetic landing page with animated section cards
- Work/Now page with active project showcase
- Fallback navigation for accessibility and no-JS
- Keyboard navigation and reduced motion support

## Ship Criteria
- [x] Portal renders 3D graph with hover, click, search, rotate, zoom
- [x] Clicking domain cluster transitions to domain page
- [x] /work landing shows Studio design with animated bio + section cards
- [x] /work/now shows active projects
- [x] Deploys to GitHub Pages
- [ ] Lighthouse accessibility >= 90
- [x] Works on mobile

## New Dependencies
- three, @react-three/fiber, @react-three/drei (3D graph)
- motion (animations)
- @types/three (dev)
EOF
)"
```

**Step 5: Verify GitHub Pages deployment**

After PR merge (or push to main):
- Check GitHub Actions for deployment status
- Visit https://rockroque.github.io/rockroque.com/
- Verify portal graph loads on live site
- Test on mobile device

---

## Task Summary

| Task | Description | Est. |
|------|-------------|------|
| 1 | Install dependencies | 3 min |
| 2 | Graph data model | 5 min |
| 3 | Update theme CSS | 5 min |
| 4 | Aurora background shader | 5 min |
| 5 | Graph nodes component | 10 min |
| 6 | Graph edges + particles | 10 min |
| 7 | Search input | 3 min |
| 8 | Tooltip | 3 min |
| 9 | BrainGraph orchestrator | 10 min |
| 10 | Portal landing page | 5 min |
| 11 | AnimatedSection component | 3 min |
| 12 | Work domain components | 5 min |
| 13 | Work layout update | 5 min |
| 14 | Work landing page | 10 min |
| 15 | Work Now page | 5 min |
| 16 | Accessibility pass | 10 min |
| 17 | Build + deploy | 10 min |
