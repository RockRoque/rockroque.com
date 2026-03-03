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
  engineering: number;
  design: number;
  workshop: number;
}

export default function ExperienceLanding() {
  const [bleed, setBleed] = useState<BleedState>({ engineering: 0, design: 0, workshop: 0 });
  const [flooding, setFlooding] = useState<ExperienceId | null>(null);
  const containerRef = useRef<HTMLDivElement>(null);
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
      if (now - lastMoveRef.current > 2000) {
        const elapsed = (now - startTime) / 1000;
        const cycle = elapsed * 0.15;

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

    const x = e.clientX / rect.width;
    const y = e.clientY / rect.height;

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
      const proximity = Math.max(0, 1 - dist * 2);
      const curved = proximity * proximity;
      newBleed[zone.id] = curved;
    }

    setBleed(newBleed);

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

    const engine = AudioEngine.getInstance();
    engine.stopPreviews();

    setTimeout(() => {
      window.location.href = zone.route;
    }, 800);
  }, [flooding]);

  useEffect(() => {
    const engine = AudioEngine.getInstance();
    if (engine.isInitialized()) {
      engine.startPreviews();
    }
    return () => {
      engine.stopPreviews();
    };
  }, []);

  const headlineColor = computeMixedColor(bleed);

  return (
    <div
      className="experience-landing"
      ref={containerRef}
      onMouseMove={handleMouseMove}
    >
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

      <span className="experience-landing__name" aria-hidden="true">
        Rock Roqué
      </span>

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

function computeMixedColor(bleed: BleedState): string {
  const total = bleed.engineering + bleed.design + bleed.workshop;
  if (total < 0.05) return 'rgba(224, 224, 232, 0.9)';

  const colors = {
    engineering: [255, 153, 0],
    design: [240, 240, 240],
    workshop: [91, 184, 245],
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
