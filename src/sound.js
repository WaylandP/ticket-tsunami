// All sound is synthesized right here — no audio files, no dependencies.
// The context is created lazily on the first play(), which always follows a
// user gesture (starting the shift), so autoplay rules are satisfied.

let ctx = null;
let master = null;
let muted = false;

export function setMuted(m) {
  muted = m;
  if (master) master.gain.value = m ? 0 : 0.14; // silences effects and music alike
}
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
  knock: () => [0, 0.16].forEach((at) => note({ type: 'square', from: 180, to: 140, at, dur: 0.07, peak: 0.5 })),
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

// --- the lofi radio -------------------------------------------------------------
// A generative loop: jazzy seventh chords, a lazy bass, brushed hats and a
// little tape hiss, synthesized bar by bar. Three speeds for three moods.

export const TEMPOS = { slow: 70, medium: 85, fast: 104 };

// Dm7 → G7 → Cmaj7 → Am7, forever. The classic.
const CHORDS = [
  [146.83, 174.61, 220.0, 261.63],
  [98.0, 123.47, 146.83, 174.61],
  [130.81, 164.81, 196.0, 246.94],
  [110.0, 130.81, 164.81, 196.0],
];
const ROOTS = [73.42, 49.0, 65.41, 55.0];

let radio = null; // { timer, bar, nextBarAt, beat, bus, hiss }

function noiseBuffer() {
  const buf = ctx.createBuffer(1, ctx.sampleRate * 0.4, ctx.sampleRate);
  const data = buf.getChannelData(0);
  for (let i = 0; i < data.length; i++) data[i] = Math.random() * 2 - 1;
  return buf;
}

function hat(bus, at, gain) {
  const src = ctx.createBufferSource();
  src.buffer = noiseBuffer();
  const hp = ctx.createBiquadFilter();
  hp.type = 'highpass';
  hp.frequency.value = 6000;
  const env = ctx.createGain();
  env.gain.setValueAtTime(gain, at);
  env.gain.exponentialRampToValueAtTime(0.001, at + 0.06);
  src.connect(hp); hp.connect(env); env.connect(bus);
  src.start(at); src.stop(at + 0.08);
}

function pluck(bus, at, f, dur, gain, type = 'triangle') {
  const osc = ctx.createOscillator();
  const env = ctx.createGain();
  osc.type = type;
  osc.frequency.value = f;
  // a lazy, tape-wobbly pitch
  osc.detune.setValueAtTime(Math.random() * 14 - 7, at);
  env.gain.setValueAtTime(0, at);
  env.gain.linearRampToValueAtTime(gain, at + 0.04);
  env.gain.exponentialRampToValueAtTime(0.001, at + dur);
  osc.connect(env); env.connect(bus);
  osc.start(at); osc.stop(at + dur + 0.05);
}

function scheduleBar(at) {
  const { beat, bus } = radio;
  const chord = CHORDS[radio.bar % 4];
  // pad: the chord, breathed in slowly
  for (const f of chord) {
    const osc = ctx.createOscillator();
    const env = ctx.createGain();
    osc.type = 'triangle';
    osc.frequency.value = f;
    env.gain.setValueAtTime(0, at);
    env.gain.linearRampToValueAtTime(0.1, at + beat * 0.9);
    env.gain.setValueAtTime(0.1, at + beat * 3);
    env.gain.linearRampToValueAtTime(0.0001, at + beat * 4);
    osc.connect(env); env.connect(bus);
    osc.start(at); osc.stop(at + beat * 4.1);
  }
  // bass: root on the one, a short fifth on the and-of-three
  const root = ROOTS[radio.bar % 4];
  pluck(bus, at, root, beat * 1.8, 0.4, 'sine');
  pluck(bus, at + beat * 2.6, root * 1.5, beat * 0.9, 0.25, 'sine');
  // hats on the back beats, with a ghost now and then
  hat(bus, at + beat, 0.12);
  hat(bus, at + beat * 3, 0.12);
  if (Math.random() < 0.45) hat(bus, at + beat * 3.6, 0.06);
  // a sparse pentatonic sprinkle every other bar
  if (radio.bar % 2 === 1 && Math.random() < 0.7) {
    const scale = [523.25, 587.33, 659.25, 783.99, 880.0];
    pluck(bus, at + beat * (1.5 + Math.floor(Math.random() * 2)), scale[Math.floor(Math.random() * scale.length)], beat * 0.8, 0.07);
  }
  radio.bar++;
}

export const music = {
  start(tempoName) {
    try {
      if (!ac()) return;
      music.stop();
      const bpm = TEMPOS[tempoName] || TEMPOS.medium;
      const bus = ctx.createGain();
      bus.gain.value = 0.55;
      const lp = ctx.createBiquadFilter();
      lp.type = 'lowpass';
      lp.frequency.value = 1700;
      bus.connect(lp); lp.connect(master);
      // tape hiss, barely there
      const hiss = ctx.createBufferSource();
      hiss.buffer = noiseBuffer();
      hiss.loop = true;
      const hissLp = ctx.createBiquadFilter();
      hissLp.type = 'lowpass';
      hissLp.frequency.value = 3500;
      const hissGain = ctx.createGain();
      hissGain.gain.value = 0.012;
      hiss.connect(hissLp); hissLp.connect(hissGain); hissGain.connect(master);
      hiss.start();
      radio = { bar: 0, beat: 60 / bpm, bus, hiss, nextBarAt: ctx.currentTime + 0.1, timer: null };
      radio.timer = setInterval(() => {
        try {
          while (radio && radio.nextBarAt < ctx.currentTime + 1.2) {
            scheduleBar(radio.nextBarAt);
            radio.nextBarAt += radio.beat * 4;
          }
        } catch { /* keep quiet */ }
      }, 300);
    } catch { /* the show goes on without music */ }
  },
  stop() {
    if (!radio) return;
    clearInterval(radio.timer);
    try {
      radio.bus.gain.setTargetAtTime(0, ctx.currentTime, 0.2);
      radio.hiss.stop(ctx.currentTime + 0.6);
    } catch { /* fine */ }
    radio = null;
  },
  playing() { return radio !== null; },
};
