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

  const prefersReducedMotion =
    typeof window !== 'undefined' &&
    window.matchMedia('(prefers-reduced-motion: reduce)').matches;

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
      const start = performance.now();
      const duration = 3000;

      const animatePulse = (now: number) => {
        const elapsed = now - start;
        const progress = Math.min(elapsed / duration, 1);
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
    setTimeout(onComplete, 600);
  }, [phase, onComplete]);

  const handleSkip = useCallback(() => {
    setPhase('exiting');
    setTimeout(onComplete, 300);
  }, [onComplete]);

  if (prefersReducedMotion) return null;

  return (
    <AnimatePresence>
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
