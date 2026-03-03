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
      engineering: { freq: 80, type: 'sawtooth' },
      design: { freq: 220, type: 'sine' },
      workshop: { freq: 150, type: 'triangle' },
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
