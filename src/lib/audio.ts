let audioCtx: AudioContext | null | undefined;

const getAudioContext = () => {
  if (audioCtx !== undefined) return audioCtx;
  if (typeof window === 'undefined') {
    audioCtx = null;
    return audioCtx;
  }

  const AudioContextClass = window.AudioContext || (window as any).webkitAudioContext;
  if (!AudioContextClass) {
    audioCtx = null;
    return audioCtx;
  }

  try {
    audioCtx = new AudioContextClass();
  } catch {
    audioCtx = null;
  }

  return audioCtx;
};

const ensureRunningContext = () => {
  const ctx = getAudioContext();
  if (!ctx) return null;

  if (ctx.state === 'suspended') {
    void ctx.resume().catch(() => {
      // Ignore resume failures; audio is non-blocking for gameplay.
    });
  }

  return ctx;
};

const playTone = (freq: number, type: OscillatorType, duration: number, volume: number) => {
  const ctx = ensureRunningContext();
  if (!ctx) return;

  const osc = ctx.createOscillator();
  const gain = ctx.createGain();

  osc.type = type;
  osc.frequency.setValueAtTime(freq, ctx.currentTime);

  gain.gain.setValueAtTime(volume, ctx.currentTime);
  gain.gain.exponentialRampToValueAtTime(0.01, ctx.currentTime + duration);

  osc.connect(gain);
  gain.connect(ctx.destination);

  osc.start();
  osc.stop(ctx.currentTime + duration);
};

const playNoise = (duration: number, volume: number) => {
  const ctx = ensureRunningContext();
  if (!ctx) return;

  const bufferSize = Math.max(1, Math.floor(ctx.sampleRate * duration));
  const buffer = ctx.createBuffer(1, bufferSize, ctx.sampleRate);
  const data = buffer.getChannelData(0);

  for (let i = 0; i < bufferSize; i++) {
    data[i] = Math.random() * 2 - 1;
  }

  const noise = ctx.createBufferSource();
  noise.buffer = buffer;

  const gain = ctx.createGain();
  gain.gain.setValueAtTime(volume, ctx.currentTime);
  gain.gain.exponentialRampToValueAtTime(0.01, ctx.currentTime + duration);

  noise.connect(gain);
  gain.connect(ctx.destination);

  noise.start();
  noise.stop(ctx.currentTime + duration);
};

export const sounds = {
  click: () => {
    // Heavy mechanical click
    playTone(150, 'sine', 0.1, 0.3);
    playNoise(0.05, 0.1);
  },

  notification: () => {
    // Clean digital ping
    playTone(880, 'sine', 0.1, 0.2);
    setTimeout(() => playTone(1320, 'sine', 0.2, 0.1), 50);
  },

  glitch: () => {
    // Harsh digital corruption
    for (let i = 0; i < 5; i++) {
      setTimeout(() => {
        const freq = 100 + Math.random() * 2000;
        const type = Math.random() > 0.5 ? 'square' : 'sawtooth';
        playTone(freq, type, 0.05, 0.1);
      }, i * 40);
    }
  }
};
