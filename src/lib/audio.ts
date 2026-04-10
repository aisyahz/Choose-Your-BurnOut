const audioCtx = typeof window !== 'undefined' ? new (window.AudioContext || (window as any).webkitAudioContext)() : null;

const playTone = (freq: number, type: OscillatorType, duration: number, volume: number) => {
  if (!audioCtx) return;
  
  const osc = audioCtx.createOscillator();
  const gain = audioCtx.createGain();
  
  osc.type = type;
  osc.frequency.setValueAtTime(freq, audioCtx.currentTime);
  
  gain.gain.setValueAtTime(volume, audioCtx.currentTime);
  gain.gain.exponentialRampToValueAtTime(0.01, audioCtx.currentTime + duration);
  
  osc.connect(gain);
  gain.connect(audioCtx.destination);
  
  osc.start();
  osc.stop(audioCtx.currentTime + duration);
};

const playNoise = (duration: number, volume: number) => {
  if (!audioCtx) return;
  
  const bufferSize = audioCtx.sampleRate * duration;
  const buffer = audioCtx.createBuffer(1, bufferSize, audioCtx.sampleRate);
  const data = buffer.getChannelData(0);
  
  for (let i = 0; i < bufferSize; i++) {
    data[i] = Math.random() * 2 - 1;
  }
  
  const noise = audioCtx.createBufferSource();
  noise.buffer = buffer;
  
  const gain = audioCtx.createGain();
  gain.gain.setValueAtTime(volume, audioCtx.currentTime);
  gain.gain.exponentialRampToValueAtTime(0.01, audioCtx.currentTime + duration);
  
  noise.connect(gain);
  gain.connect(audioCtx.destination);
  
  noise.start();
  noise.stop(audioCtx.currentTime + duration);
};

export const sounds = {
  click: () => {
    // Heavy mechanical click
    playTone(150, 'sine', 0.1, 0.3);
    playNoise(0.05, 0.1);
  },
  
  notification: () => {
    // Clean digital ping
    const now = audioCtx?.currentTime || 0;
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
