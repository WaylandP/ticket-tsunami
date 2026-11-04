// All sound is synthesized right here — no audio files, no dependencies.
// The context is created lazily on the first play(), which always follows a
// user gesture (starting the shift), so autoplay rules are satisfied.

let ctx = null;
let master = null;
let muted = false;

export function setMuted(m) { muted = m; }
export function isMuted() { return muted; }

function ac() {
  if (!ctx) {
    const AC = window.AudioContext || window.webkitAudioContext;
    if (!AC) return null;
    ctx = new AC();
    master = ctx.createGain();
    master.gain.value = 0.14;
    master.connect(ctx.destination);
  }
  if (ctx.state === 'suspended') ctx.resume();
  return ctx;
}

/** One enveloped oscillator note. */
function note({ type = 'sine', from = 440, to = from, at = 0, dur = 0.12, peak = 1 }) {
  const t0 = ctx.currentTime + at;
  const osc = ctx.createOscillator();
  const env = ctx.createGain();
  osc.type = type;
  osc.frequency.setValueAtTime(from, t0);
  if (to !== from) osc.frequency.exponentialRampToValueAtTime(Math.max(1, to), t0 + dur);
  env.gain.setValueAtTime(0, t0);
  env.gain.linearRampToValueAtTime(peak, t0 + 0.008);
  env.gain.exponentialRampToValueAtTime(0.001, t0 + dur);
  osc.connect(env);
  env.connect(master);
  osc.start(t0);
  osc.stop(t0 + dur + 0.02);
}

const SOUNDS = {
  spawn: () => note({ from: 320, to: 240, dur: 0.08, peak: 0.5 }),
  correct: () => {
    note({ type: 'triangle', from: 660, dur: 0.09, peak: 0.8 });
    note({ type: 'triangle', from: 990, at: 0.07, dur: 0.12, peak: 0.6 });
  },
  streak: () => [523, 659, 784, 1047].forEach((f, i) => note({ type: 'triangle', from: f, at: i * 0.07, dur: 0.14, peak: 0.6 })),
  wrong: () => {
    note({ type: 'square', from: 140, to: 100, dur: 0.14, peak: 0.5 });
    note({ type: 'square', from: 100, to: 80, at: 0.1, dur: 0.12, peak: 0.4 });
  },
  ouch: () => note({ type: 'sawtooth', from: 220, to: 90, dur: 0.3, peak: 0.5 }),
  outage: () => [0, 0.16].forEach((at) => note({ type: 'sawtooth', from: 440, to: 466, at, dur: 0.12, peak: 0.35 })),
  frenzy: () => [660, 880, 660, 880].forEach((f, i) => note({ type: 'square', from: f, at: i * 0.08, dur: 0.07, peak: 0.3 })),
  bell: () => [0, 0.5].forEach((at) => note({ from: 880, at, dur: 1.1, peak: 0.7 })),
  charge: () => [523, 784, 1047].forEach((f, i) => note({ type: 'triangle', from: f, at: i * 0.06, dur: 0.12, peak: 0.6 })),
  power: () => {
    note({ type: 'triangle', from: 440, to: 880, dur: 0.18, peak: 0.6 });
  },
  over: () => [392, 330, 262].forEach((f, i) => note({ from: f, at: i * 0.22, dur: 0.3, peak: 0.6 })),
};

export function play(name) {
  if (muted || !SOUNDS[name]) return;
  try {
    if (!ac()) return;
    SOUNDS[name]();
  } catch { /* sound is never worth crashing over */ }
}
