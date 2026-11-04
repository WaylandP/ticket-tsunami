import {
  FIXES as ENGINE_FIXES, MAX_QUEUE, MAX_CSAT, SHIFT_MS, DEFAULT_DIFFICULTY,
  POWERS, ACHIEVEMENTS,
  createGame, tick, applyFix, usePower, mostUrgent, multiplier, clock, summary,
  evaluateAchievements, shiftInsights,
} from './engine.js';
import { FIX_ICONS, POWER_ICONS, face, avatar, personSVG, roomSVG, deskSVG, repairBenchSVG, homeHeroSVG, inspectionDeviceSVG, DEVICE_NAMES, DEVICE_HOTSPOTS, DEVICE_CONNECTION_VIEWS } from './icons.js';
import { inspectionFor, INSPECTION_ZONES } from './inspection.js';
import { CHALLENGES, challengeFor, challengeBestKey, evidenceFor } from './challenges.js';
import { createPractice, applyPracticeFix, nextPracticeCase } from './practice.js';
import { initSecurityDesk } from './security-ui.js';
import { play, setMuted, isMuted, music } from './sound.js';

const $ = (id) => document.getElementById(id);
const app = $('app');
const queueEl = $('queue');
const benchEl = $('bench');
const floodEl = $('flood');
$('room-art').innerHTML = roomSVG();
$('desk-art').innerHTML = deskSVG();
$('repair-bench-art').innerHTML = repairBenchSVG();
$('home-art').innerHTML = homeHeroSVG();
const screens = { start: $('start-screen'), pause: $('pause-screen'), over: $('over-screen'), stats: $('stats-screen'), shop: $('shop-screen') };
const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)');
const securityDesk = initSecurityDesk({onPause:()=>pause(),onResolved:()=>{render();announce('Security incident resolved.');},onArrival:title=>{toast('Security report: '+title);announce('New security report: '+title);}});

const FIXES = ENGINE_FIXES.map(f => ({ ...f, label: ({ restart: 'Restart safely', password: 'Recover access', connect: 'Check connection', update: 'Verified update', notit: 'Route / report' })[f.id] }));
const SHORT = { restart: 'Restart', password: 'Access', connect: 'Connection', update: 'Update', notit: 'Route / report' };
const FIX_LABEL = Object.fromEntries(FIXES.map((f) => [f.id, f.label]));

let game = null;
let running = false;
let mode = 'free'; // 'free' | 'daily' | 'tutorial' | 'endless'
const COACH = {
  restart: 'The approved recovery step is restart, with work saved. Press 1.',
  password: 'Identity verified? Follow approved access recovery. Press 2.',
  connect: 'Nothing loads, cable on the floor… Check connection. Press 3.',
  update: 'A verified update addresses the confirmed issue. Press 4.',
  notit: 'Route to the responsible team, or report suspicious mail. Press 5.',
};
let selectedId = null; // a ticket the player clicked; otherwise we focus the most urgent
let last = 0;
const cards = new Map(); // ticket id -> <li>

// --- storage (per-browser convenience only) ----------------------------------

function loadBest(diffId) {
  try { return JSON.parse(localStorage.getItem(`ticket-tsunami:best:${diffId}`)) || null; } catch { return null; }
}
function saveBest(diffId, best) {
  try { localStorage.setItem(`ticket-tsunami:best:${diffId}`, JSON.stringify(best)); } catch { /* private mode etc. */ }
}
function loadDifficulty() {
  try {
    const id = localStorage.getItem('ticket-tsunami:difficulty');
    return challengeFor(id).id;
  } catch { return 'easy'; }
}
function saveDifficulty(id) {
  try { localStorage.setItem('ticket-tsunami:difficulty', id); } catch { /* private mode etc. */ }
}

let difficulty = loadDifficulty();
let activeChallenge = challengeFor(difficulty);
let sessionChoice = 'practice';

function loadSet(key) {
  try { return new Set(JSON.parse(localStorage.getItem(key)) || []); } catch { return new Set(); }
}
function saveSet(key, set) {
  try { localStorage.setItem(key, JSON.stringify([...set])); } catch { /* private mode etc. */ }
}

// --- the daily shift -----------------------------------------------------------

function todayKey() {
  const d = new Date();
  return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`;
}
/** Everyone who plays today gets this seed, so everyone gets the same shift. */
function dailySeed(key) {
  let h = 0;
  for (const c of key) h = (h * 31 + c.charCodeAt(0)) | 0;
  return h || 1;
}
function dailyLabel() {
  return new Date().toLocaleDateString(undefined, { month: 'short', day: 'numeric' });
}
function loadDaily() {
  try {
    const d = JSON.parse(localStorage.getItem('ticket-tsunami:daily'));
    return d && d.date === todayKey() ? d : null;
  } catch { return null; }
}
function saveDaily(result) {
  try { localStorage.setItem('ticket-tsunami:daily', JSON.stringify(result)); } catch { /* private mode etc. */ }
}

// --- online tickets toggle -------------------------------------------------------

let onlinePref = (() => {
  try { return localStorage.getItem('ticket-tsunami:online') !== '0'; } catch { return true; }
})();

function renderOnlineToggle() {
  const btn = $('online-toggle');
  btn.setAttribute('aria-checked', String(onlinePref));
  btn.classList.toggle('on', onlinePref);
  $('online-sub').textContent = onlinePref
    ? 'On · alongside walk-ins'
    : 'Off · repairs + security';
}

// --- the supply closet (shop) ----------------------------------------------------

const UPGRADES = [
  { id: 'coffeepot', icon: '☕', name: 'Second coffee pot', desc: 'Coffee breaks last 8 seconds instead of 5.', cost: 300, perk: { coffeeMs: 8000 } },
  { id: 'intern', icon: '🧑‍💻', name: 'Jules, part-time', desc: 'Start every shift with a power charge ready.', cost: 400, perk: { startCharges: 1 } },
  { id: 'wiki2', icon: '📖', name: 'Wiki, indexed', desc: 'Tickets reveal their fix on their own at half patience.', cost: 500, perk: { autoHint: true } },
  { id: 'chair', icon: '🪑', name: 'Ergonomic chair', desc: 'The first unhappy user each shift forgives you.', cost: 600, perk: { armor: 1 } },
];

function loadShop() {
  try { return { budget: 0, owned: [], ...JSON.parse(localStorage.getItem('ticket-tsunami:shop')) }; } catch { return { budget: 0, owned: [] }; }
}
function saveShop(shop) {
  try { localStorage.setItem('ticket-tsunami:shop', JSON.stringify(shop)); } catch { /* fine */ }
}

/** Everything the owned upgrades do, merged, for the engine. */
function ownedPerks() {
  const shop = loadShop();
  return Object.assign({}, ...UPGRADES.filter((u) => shop.owned.includes(u.id)).map((u) => u.perk));
}

function renderShop() {
  const shop = loadShop();
  $('shop-budget').textContent = shop.budget.toLocaleString();
  const grid = $('shop-grid');
  grid.replaceChildren(...UPGRADES.map((u) => {
    const owned = shop.owned.includes(u.id);
    const div = document.createElement('div');
    div.className = 'shop-item' + (owned ? ' owned' : '');
    div.innerHTML = `<span class="shop-icon" aria-hidden="true">${u.icon}</span>
      <span class="shop-body"><strong>${u.name}</strong><span class="shop-desc">${u.desc}</span></span>
      <button type="button" class="btn shop-buy"></button>`;
    const btn = div.querySelector('.shop-buy');
    if (owned) {
      btn.textContent = 'Owned ✓';
      btn.disabled = true;
    } else {
      btn.textContent = `${u.cost} ☕`;
      btn.disabled = shop.budget < u.cost;
      btn.addEventListener('click', () => {
        const s = loadShop();
        if (s.owned.includes(u.id) || s.budget < u.cost) return;
        s.budget -= u.cost;
        s.owned.push(u.id);
        saveShop(s);
        play('charge');
        toast(`${u.name}: yours.`);
        renderShop();
      });
    }
    return div;
  }));
}

function openShop() {
  renderShop();
  show('shop');
}

// --- music preference ----------------------------------------------------------

const MUSIC_CHOICES = [
  { id: 'off', label: 'Off' },
  { id: 'auto', label: 'Auto' },
  { id: 'slow', label: 'Slow' },
  { id: 'medium', label: 'Med' },
  { id: 'fast', label: 'Fast' },
];
let musicPref = (() => {
  try {
    const m = localStorage.getItem('ticket-tsunami:music');
    return MUSIC_CHOICES.some((c) => c.id === m) ? m : 'auto';
  } catch { return 'auto'; }
})();

function buildMusicPicker() {
  const row = $('music');
  for (const c of MUSIC_CHOICES) {
    const btn = document.createElement('button');
    btn.type = 'button';
    btn.className = 'music-btn';
    btn.dataset.music = c.id;
    btn.textContent = c.label;
    btn.addEventListener('click', () => {
      musicPref = c.id;
      try { localStorage.setItem('ticket-tsunami:music', c.id); } catch { /* fine */ }
      renderMusicPicker();
    });
    row.append(btn);
  }
  renderMusicPicker();
}

function renderMusicPicker() {
  for (const btn of document.querySelectorAll('.music-btn')) {
    btn.setAttribute('aria-pressed', String(btn.dataset.music === musicPref));
  }
}

/** Auto picks the tempo for the day: Monday means fast. Your choice wins. */
function resolveTempo() {
  if (musicPref !== 'auto') return musicPref;
  if (mode === 'tutorial') return 'slow';
  if (mode === 'endless') return 'fast';
  if (mode === 'daily') return 'medium';
  return { easy: 'slow', medium: 'medium', hard: 'fast', extreme: 'fast' }[difficulty] || 'medium';
}

function startMusic() {
  if (musicPref !== 'off') music.start(resolveTempo());
}

// --- the coach (tutorial) -------------------------------------------------------

function coach(fixId) {
  const el = $('coach');
  for (const btn of document.querySelectorAll('.fix')) btn.classList.remove('coach-target');
  if (!fixId) { el.hidden = true; return; }
  $('coach-text').textContent = COACH[fixId];
  el.hidden = false;
  document.querySelector(`.fix[data-fix="${fixId}"]`)?.classList.add('coach-target');
}

// --- lifetime stats --------------------------------------------------------------

function loadStats() {
  try {
    return { shifts: 0, closed: 0, wrong: 0, expired: 0, totalScore: 0, fiveOClocks: 0, bosses: 0, dailies: {}, ...JSON.parse(localStorage.getItem('ticket-tsunami:stats')) };
  } catch {
    return { shifts: 0, closed: 0, wrong: 0, expired: 0, totalScore: 0, fiveOClocks: 0, bosses: 0, dailies: {} };
  }
}
function saveStats(st) {
  try { localStorage.setItem('ticket-tsunami:stats', JSON.stringify(st)); } catch { /* fine */ }
}

function recordShift(s) {
  const st = loadStats();
  st.shifts++;
  st.closed += s.closed;
  st.wrong += s.wrong;
  st.expired += s.expired;
  st.totalScore += s.score;
  if (s.madeItToFive) st.fiveOClocks++;
  st.bosses += s.bossesClosed;
  if (mode === 'daily') st.dailies[todayKey()] = { score: s.score, clock: s.clock };
  const days = Object.keys(st.dailies).sort();
  while (days.length > 30) delete st.dailies[days.shift()];
  saveStats(st);
}

function openStats() {
  const st = loadStats();
  const unlocked = loadSet('ticket-tsunami:achievements');
  const attempts = st.closed + st.wrong;
  const rows = [
    ['Shifts worked', st.shifts],
    ['Tickets closed', st.closed.toLocaleString()],
    ['Lifetime accuracy', attempts ? `${Math.round((st.closed / attempts) * 100)}%` : '—'],
    ['5 PMs reached', st.fiveOClocks],
    ['Total score', st.totalScore.toLocaleString()],
    ['Achievements', `${unlocked.size}/${ACHIEVEMENTS.length}`],
  ];
  $('career-stats').replaceChildren(...rows.map(([dt, dd]) => {
    const div = document.createElement('div');
    div.innerHTML = '<dt></dt><dd></dd>';
    div.querySelector('dt').textContent = dt;
    div.querySelector('dd').textContent = dd;
    return div;
  }));
  const days = Object.keys(st.dailies).sort().reverse().slice(0, 7);
  const list = $('daily-history');
  list.replaceChildren(...days.map((day) => {
    const li = document.createElement('li');
    li.textContent = `${day} — ${st.dailies[day].score.toLocaleString()} pts, until ${st.dailies[day].clock}`;
    return li;
  }));
  if (!days.length) {
    const li = document.createElement('li');
    li.textContent = 'No dailies yet. The storm waits.';
    list.append(li);
  }
  show('stats');
}

function updateDailyCard() {
  $('daily-date').textContent = dailyLabel();
  const played = loadDaily();
  const btn = $('daily-btn');
  btn.disabled = !!played;
  $('daily-sub').textContent = played
    ? `You scored ${played.score.toLocaleString()} and lasted until ${played.clock}. Back tomorrow.`
    : 'The same storm for everyone. One try.';
}

// --- static UI ------------------------------------------------------------------

function buildFixBar() {
  const bar = $('fixes');
  for (const fix of FIXES) {
    const btn = document.createElement('button');
    btn.type = 'button';
    btn.className = `fix fix-${fix.id}`;
    btn.dataset.fix = fix.id;
    btn.setAttribute('aria-label', `${fix.label} (key ${fix.key})`);
    btn.innerHTML = `${FIX_ICONS[fix.id]}<span class="fix-label"><span class="long">${fix.label}</span><span class="short">${SHORT[fix.id]}</span></span><kbd>${fix.key}</kbd>`;
    bar.append(btn);
  }
  bar.addEventListener('click', (e) => {
    const btn = e.target.closest('.fix');
    if (btn) useFix(btn.dataset.fix, btn);
  });
}

function buildPips() {
  $('pips').innerHTML = Array.from({ length: MAX_QUEUE }, () => '<span class="pip"></span>').join('');
}

function buildPowers() {
  const row = $('powers');
  for (const p of POWERS) {
    const btn = document.createElement('button');
    btn.type = 'button';
    btn.className = 'power-btn';
    btn.dataset.power = p.id;
    btn.disabled = true;
    btn.title = p.desc;
    btn.setAttribute('aria-label', `${p.label}: ${p.desc} (key ${p.key.toUpperCase()})`);
    btn.innerHTML = `<span class="power-emoji" aria-hidden="true">${POWER_ICONS[p.id]}</span><span class="power-label">${p.label}</span><kbd>${p.key.toUpperCase()}</kbd>`;
    btn.addEventListener('click', () => usePowerUI(p.id));
    row.append(btn);
  }
}

function usePowerUI(powerId) {
  if (!running || game?.mode === 'practice') return;
  const res = usePower(game, powerId);
  if (res.type === 'none') {
    toast(game.charges <= 0 ? 'No charges — every 10-ticket streak earns one.' : 'Nothing to use that on.');
    return;
  }
  play('power');
  if (res.power === 'coffee') toast('Coffee break. Everything slows down for 5 seconds.');
  if (res.power === 'kb') toast('You consult the wiki. All fixes revealed.');
  if (res.power === 'bot' && res.closed?.type === 'correct') {
    removeCard(res.closed.ticket.id, 'out-fixed', `+${res.closed.points}`);
    if (selectedId === res.closed.ticket.id) selectedId = null;
  }
  render();
}

function buildDiffPicker() {
  const row = $('diff');
  for (const d of CHALLENGES) {
    const btn = document.createElement('button');
    btn.type = 'button';
    btn.className = 'diff-btn';
    btn.dataset.diff = d.id;
    btn.innerHTML = `<span class="difficulty-level" aria-hidden="true">${CHALLENGES.map((_, i) => `<i class="${i <= CHALLENGES.indexOf(d) ? 'lit' : ''}"></i>`).join('')}</span><strong>${d.label}</strong><span class="difficulty-tag">${d.tag}</span><span class="difficulty-check" aria-hidden="true">✓</span>`;
    btn.setAttribute('aria-label', d.label + ': ' + d.tag);
    btn.setAttribute('aria-pressed', 'false');
    btn.addEventListener('click', () => setDifficulty(d.id));
    row.append(btn);
  }
  setDifficulty(difficulty);
}

function setDifficulty(id) {
  difficulty = challengeFor(id).id;
  saveDifficulty(difficulty);
  for (const btn of document.querySelectorAll('.diff-btn')) {
    btn.setAttribute('aria-pressed', String(btn.dataset.diff === id));
  }
  $('diff-blurb').textContent = challengeFor(id).description;
  renderSessionChoice();
  renderBest();
}

function renderSessionChoice() {
  for (const button of document.querySelectorAll('[data-session]')) button.setAttribute('aria-pressed', String(button.dataset.session === sessionChoice));
  $('start-btn').innerHTML = (sessionChoice === 'practice' ? 'Start practice' : 'Start shift') + ' <span aria-hidden="true">→</span>';
  $('start-btn').setAttribute('aria-label', (sessionChoice === 'practice' ? 'Start untimed practice' : 'Start timed shift') + ' · ' + challengeFor(difficulty).label + ' questions');
}
for (const button of document.querySelectorAll('[data-session]')) button.addEventListener('click', () => { sessionChoice = button.dataset.session; renderSessionChoice(); });

/** Fill the HUD with five happy faces before the first shift starts. */
function buildFaces() {
  const faces = $('faces');
  faces.dataset.csat = String(MAX_CSAT);
  faces.innerHTML = Array.from({ length: MAX_CSAT }, () => `<span class="face on">${face(true)}</span>`).join('');
  faces.parentElement.setAttribute('aria-label', `Coworker happiness: ${MAX_CSAT} of ${MAX_CSAT}`);
}

// --- screens ----------------------------------------------------------------------

function show(name) {
  if (name !== 'play') { closeInspection(); securityDesk.close(); }
  app.dataset.screen = name;
  for (const [key, el] of Object.entries(screens)) el.hidden = key !== name;
  const focusTarget = { start: 'start-btn', pause: 'resume-btn', over: 'again-btn', stats: 'stats-back-btn', shop: 'shop-back-btn' }[name];
  if (focusTarget) $(focusTarget).focus({ preventScroll: true });
}

function startShift(newMode = 'free') {
  if (newMode === 'daily' && loadDaily()) return; // one try a day
  mode = newMode;
  activeChallenge = challengeFor(mode === 'daily' ? 'medium' : mode === 'tutorial' ? 'easy' : difficulty);
  for (const details of document.querySelectorAll('.home-settings')) details.open = false;
  for (const el of cards.values()) el.remove();
  cards.clear();
  queueEl.replaceChildren();
  benchEl.replaceChildren();
  $('bench-wrap').hidden = false;
  selectedId = null;
  const randomSeed = (Date.now() ^ (Math.random() * 1e9)) | 0;
  const opts = { online: onlinePref, perks: ownedPerks() };
  // The Daily is the same storm for everyone: no upgrades, inbox always on.
  if (mode === 'practice') game = createPractice(randomSeed, difficulty, onlinePref);
  else if (mode === 'daily') game = createGame(dailySeed(todayKey()), DEFAULT_DIFFICULTY, 'shift', { online: true });
  else if (mode === 'tutorial') game = createGame(randomSeed, DEFAULT_DIFFICULTY, 'tutorial');
  else if (mode === 'endless') game = createGame(randomSeed, activeChallenge.engine, 'endless', opts);
  else game = createGame(randomSeed, activeChallenge.engine, 'shift', opts);
  securityDesk.begin({practice:mode==='practice',tutorial:mode==='tutorial',elapsed:game.t});
  app.dataset.session = mode;
  $('exam-running').textContent = mode === 'practice' ? 'No time limit. Inspect, try a repair, and learn from the result.' : 'The shift keeps running while you inspect.';
  $('empty-big').textContent = game.online ? 'Inbox zero.' : 'Email is off.';
  $('empty-sub').textContent = game.online ? (mode === 'practice' ? 'Ready when you are. Choose Next case below.' : 'It won’t last.') : 'Device repairs and security reports still arrive.';
  app.classList.toggle('overtime', mode === 'endless');
  coach(null);
  show('play');
  running = true;
  last = performance.now();
  startMusic();
  render();
  if (mode === 'endless') banner('The night shift.', 'It’s 5 PM. The day crew went home. You didn’t.');
}

/** Back to the start screen: clean floor, fresh HUD, no game. */
function goHome() {
  securityDesk.reset();
  running = false;
  game = null;
  delete app.dataset.session;
  $('practice-bar').hidden = true;
  selectedId = null;
  music.stop();
  coach(null);
  for (const el of cards.values()) el.remove();
  cards.clear();
  queueEl.replaceChildren();
  benchEl.replaceChildren();
  $('bench-wrap').hidden = false;
  $('empty').hidden = true;
  app.classList.remove('overtime', 'frenzy');
  $('clock').textContent = '9:00 AM';
  renderRoom(0);
  $('clock-sub').textContent = 'Shift ends at 5:00 PM';
  $('score').textContent = '0';
  $('mult').hidden = true;
  $('charge-chip').textContent = '⚡ 0';
  $('charge-chip').classList.remove('has-charge');
  buildFaces();
  for (const pip of $('pips').children) pip.classList.remove('on');
  $('queue-count').textContent = `0 of ${MAX_QUEUE}`;
  floodEl.style.setProperty('--level', '0');
  updateDailyCard();
  renderBest();
  show('start');
}

function pause() {
  if (!running) return;
  running = false;
  music.stop();
  render();
  show('pause');
}

function resume() {
  if (!game || game.phase !== 'playing') return;
  show('play');
  running = true;
  last = performance.now();
  startMusic();
}

function endShift() {
  securityDesk.report();
  running = false;
  music.stop();
  coach(null);
  if (game.mode === 'practice') {
    $('over-eyebrow').textContent = 'Practice complete · ' + activeChallenge.label;
    $('over-title').textContent = 'Good work at the desk.';
    $('r-rank').textContent = 'Learning at your pace';
    for (const id of ['r-newbest','r-budget','r-badges','r-badge-count','share-btn']) $(id).hidden = true;
    $('r-score').textContent = 'Untimed';
    $('r-closed').textContent = game.closed;
    $('r-acc').textContent = game.practiceCorrect + game.wrong ? Math.round(game.practiceCorrect / (game.practiceCorrect + game.wrong) * 100) + '%' : '—';
    for (const id of ['r-streak','r-expired','r-self']) $(id).textContent = '—';
    $('r-insights').hidden = false;
    $('r-insights').innerHTML = '<li>Practice has no clock, expiry, points, or ranking. Timed records are unchanged.</li>';
    $('share-text').textContent = '';
    show('over');
    return;
  }
  const s = summary(game);
  const tutorial = s.mode === 'tutorial';
  const endless = s.mode === 'endless';
  const bestKey = challengeBestKey(activeChallenge.id, endless);
  const best = tutorial ? null : loadBest(bestKey);
  const isBest = !best || s.score > best.score;
  if (!tutorial && isBest && s.score > 0) saveBest(bestKey, { score: s.score, clock: s.clock, rank: s.rank });
  if (mode === 'daily' && !loadDaily()) {
    saveDaily({ date: todayKey(), score: s.score, clock: s.clock, rank: s.rank });
    updateDailyCard();
  }
  if (!tutorial) recordShift(s);

  // Shifts pay the bills: budget = score / 10. The Daily pays too.
  const pay = tutorial ? 0 : Math.round(s.score / 10);
  if (pay > 0) {
    const shop = loadShop();
    shop.budget += pay;
    saveShop(shop);
  }
  $('r-budget').hidden = pay === 0;
  $('r-budget').textContent = `IT budget +${pay.toLocaleString()} ☕`;

  // Achievements: what this shift earned, and which of those are new forever.
  const earned = evaluateAchievements(s);
  const unlocked = loadSet('ticket-tsunami:achievements');
  const fresh = earned.filter((id) => !unlocked.has(id));
  for (const id of earned) unlocked.add(id);
  if (fresh.length) saveSet('ticket-tsunami:achievements', unlocked);
  const badgesEl = $('r-badges');
  badgesEl.hidden = !earned.length;
  badgesEl.replaceChildren(...earned.map((id) => {
    const a = ACHIEVEMENTS.find((x) => x.id === id);
    const span = document.createElement('span');
    span.className = 'badge' + (fresh.includes(id) ? ' badge-new' : '');
    span.title = a.desc;
    span.textContent = `★ ${a.label}`;
    return span;
  }));
  const countEl = $('r-badge-count');
  countEl.hidden = unlocked.size === 0;
  countEl.textContent = `Achievements: ${unlocked.size} of ${ACHIEVEMENTS.length} unlocked`;

  // Notes from your manager.
  const notes = tutorial
    ? ['Training complete. Now try Easy mode — the tickets won’t be this polite.']
    : shiftInsights(s);
  const insightsEl = $('r-insights');
  insightsEl.hidden = !notes.length;
  insightsEl.replaceChildren(...notes.map((n) => {
    const li = document.createElement('li');
    li.textContent = n;
    return li;
  }));

  const dayLabel = tutorial ? 'Training'
    : endless ? `Night Shift · ${activeChallenge.label}`
    : mode === 'daily' ? `Daily Shift · ${dailyLabel()}` : activeChallenge.label;
  $('over-eyebrow').textContent = `Shift report · ${dayLabel}${s.madeItToFive && !endless && !tutorial ? ' · Overtime survivor' : ''}`;
  $('over-title').innerHTML = tutorial
    ? 'You’re ready for the real thing'
    : endless ? 'You survived until <span id="r-clock"></span>' : 'You lasted until <span id="r-clock"></span>';
  if (!tutorial) $('r-clock').textContent = s.clock;
  $('r-rank').textContent = s.rank;
  $('r-score').textContent = s.score.toLocaleString();
  $('r-closed').textContent = s.closed;
  $('r-acc').textContent = `${s.accuracy}%`;
  $('r-streak').textContent = s.bestStreak;
  $('r-expired').textContent = s.expired + s.overflowed;
  $('r-self').textContent = s.selfFixed;
  $('r-newbest').hidden = !(isBest && s.score > 0 && best);
  $('share-btn').hidden = tutorial;
  $('share-text').textContent = tutorial ? '' : shareText(s);
  show('over');
  announce(`Shift over at ${s.clock}. Score ${s.score}. Rank: ${s.rank}.`);
}

function shareText(s) {
  if (s.mode === 'endless') {
    return `Ticket Tsunami Night Shift (${activeChallenge.label}): survived until ${s.clock}, closed ${s.closed} tickets, ${s.score.toLocaleString()} points. Rank: ${s.rank}.`;
  }
  if (mode === 'daily') {
    return `Ticket Tsunami Daily · ${dailyLabel()}\n🌊 Lasted until ${s.clock} · ${s.score.toLocaleString()} pts\n🎫 ${s.closed} closed · 🎯 ${s.accuracy}% · 🔥 streak ${s.bestStreak}\nRank: ${s.rank}\nhttps://ticket-tsunami.vercel.app`;
  }
  return `Ticket Tsunami (${activeChallenge.label}): lasted until ${s.clock}, closed ${s.closed} tickets, ${s.score.toLocaleString()} points, best streak ${s.bestStreak}. Rank: ${s.rank}.`;
}

function renderBest() {
  const best = loadBest(challengeBestKey(difficulty));
  const line = $('best-line');
  line.hidden = !best;
  if (best) line.textContent = `Timed best · ${challengeFor(difficulty).label}: ${best.score.toLocaleString()} points, lasted until ${best.clock}.`;
}

// --- gameplay -------------------------------------------------------------------

function focusedTicket() {
  if (!game) return null;
  return game.tickets.find((t) => t.id === selectedId) || mostUrgent(game);
}

function useFix(fixId, sourceBtn) {
  if (!running) return;
  const target = focusedTicket();
  if (!target) {
    toast('No tickets right now. Enjoy it while it lasts.');
    return;
  }
  if (target.kind === 'repair' && inspectionFor(target) && !examDialog.open) {
    openInspection(target);
    return;
  }
  const priorEvidence = target.kind === 'repair' ? inspectionFor(target)?.detail : target.text;
  const res = game.mode === 'practice' ? applyPracticeFix(game, target.id, fixId) : applyFix(game, target.id, fixId);
  pulse(sourceBtn || document.querySelector(`.fix[data-fix="${fixId}"]`), res.type);
  if (res.type === 'progress') {
    play('charge');
    toast(`Step ${res.stage + 1} of ${res.total}. Keep going.`);
    const figure = cards.get(res.ticket.id)?.querySelector('.figure');
    if (figure) restartAnim(figure, 'hop');
    render();
    if (examDialog.open) $('exam-feedback').textContent = 'Why it worked: ' + priorEvidence + ' Next: inspect the updated device.';
    return;
  }
  if (res.type === 'correct') {
    if (target.kind !== 'repair') toast(target.kind === 'spam' ? 'Reported for security review. Do not open links or attachments; verify through a known channel.' : 'Resolved: ' + ticketDisplayText(target));
    removeCard(res.ticket.id, 'out-fixed', game.mode === 'practice' ? 'Restored ✓' : `+${res.points}`);
    if (selectedId === res.ticket.id) selectedId = null;
    if (examDialog.open && priorEvidence) $('exam-feedback').textContent = 'Device restored. Why it worked: ' + priorEvidence;
    if (game.mode === 'tutorial') coach(null);
    if (res.charge) {
      play('charge');
      toast(`${res.streak} in a row — power charge earned. ⚡`);
    } else if (res.streak > 0 && res.streak % 5 === 0) {
      play('streak');
      toast(`${res.streak} in a row. Score x${multiplier(res.streak)}.`);
    } else {
      play('correct');
    }
  } else if (res.type === 'wrong') {
    play('wrong');
    const el = cards.get(res.ticket.id);
    if (el) restartAnim(el, 'shake');
    toast(`${FIX_LABEL[res.tried]} did not address the evidence. Try another component.`);
    if (examDialog.open) $('exam-feedback').textContent = 'That action did not address the fault. Compare another component with the reported symptom.';
  }
  render();
}

function pulse(btn, kind) {
  if (!btn) return;
  btn.classList.remove('hit', 'miss');
  void btn.offsetWidth;
  btn.classList.add(kind === 'correct' ? 'hit' : 'miss');
}

function restartAnim(el, cls) {
  el.classList.remove(cls);
  void el.offsetWidth;
  el.classList.add(cls);
}

function moveSelection(delta) {
  if (!game || !game.tickets.length) return;
  const current = focusedTicket();
  const i = game.tickets.indexOf(current);
  const next = game.tickets[(i + delta + game.tickets.length) % game.tickets.length];
  selectedId = next.id;
  render();
}

function handleEvents(events) {
  for (const ev of events) {
    switch (ev.type) {
      case 'spawn':
        play(ev.ticket.kind === 'repair' ? 'knock' : 'spawn');
        if (game && game.mode === 'tutorial') coach(ev.ticket.fix);
        break;
      case 'tutorialDone':
        running = false;
        setTimeout(endShift, reduceMotion.matches ? 0 : 450);
        break;
      case 'expired':
        removeCard(ev.ticket.id, 'out-expired', 'Escalated!');
        if (selectedId === ev.ticket.id) selectedId = null;
        break;
      case 'spamGone':
        removeCard(ev.ticket.id, 'out-self', 'Junk, ignored');
        if (selectedId === ev.ticket.id) selectedId = null;
        break;
      case 'selfFixed':
        removeCard(ev.ticket.id, 'out-self', 'Fixed it myself');
        if (selectedId === ev.ticket.id) selectedId = null;
        break;
      case 'csat':
        play('ouch');
        restartAnim($('faces'), 'ouch');
        if (ev.reason === 'overflow') toast('Queue full. Someone called your cell instead.');
        break;
      case 'armor':
        play('power');
        toast('Your ergonomic chair absorbs the complaint. 🪑');
        break;
      case 'outage':
        play('outage');
        banner(ev.fix === 'password' ? 'Legacy access policy' : ev.title, ev.fix === 'password' ? 'This office still expires credentials. Verify identity before approved recovery.' : ev.detail);
        announce(`${ev.title}. ${ev.detail}`);
        break;
      case 'frenzy':
        play('frenzy');
        banner('Priority window', 'Double points for 8 seconds.');
        announce('Priority window. Double points for 8 seconds.');
        break;
      case 'overtime':
        play('bell');
        banner('It’s 5 PM.', 'Nobody told the tickets. Welcome to overtime.');
        app.classList.add('overtime');
        break;
      case 'gameOver':
        play('over');
        // Let the last card animate out before the report covers it.
        setTimeout(endShift, reduceMotion.matches ? 0 : 450);
        running = false;
        break;
    }
  }
}


// --- hands-on inspection: presentation over the existing repair engine --------
const examDialog = $('exam-dialog');
const exam = { id: null, view: 'front', zone: null, key: '', finished: false, returnFocus: null };

function openInspection(ticket) {
  if (!running || ticket?.kind !== 'repair' || !inspectionFor(ticket)) return;
  exam.returnFocus = document.activeElement;
  exam.id = ticket.id;
  exam.view = 'front';
  exam.zone = null;
  exam.key = '';
  exam.finished = false;
  $('exam-feedback').textContent = '';
  selectedId = ticket.id;
  if (!examDialog.open) examDialog.showModal();
  renderInspection();
}

function closeInspection() {
  const restore = exam.returnFocus;
  if (examDialog.open) examDialog.close();
  exam.id = null;
  exam.key = '';
  exam.finished = false;
  exam.returnFocus = null;
  if (restore?.isConnected) restore.focus({ preventScroll: true });
}

function examTicket() {
  return game?.tickets.find(t => t.id === exam.id);
}

function renderExamDevice(ticket, model) {
  $('exam-device').innerHTML = inspectionDeviceSVG(ticket.device, model, exam.view);
  const positions = DEVICE_HOTSPOTS[ticket.device];
  const connectionView = DEVICE_CONNECTION_VIEWS[ticket.device];
  examDialog.querySelector('[data-exam-view="rear"]').textContent = connectionView.label;
  $('exam-view-label').textContent = exam.view === 'rear' ? connectionView.caption : 'Front view · screen and controls';
  $('exam-physical-state').textContent = model.physical.description;
  const visible = exam.view === 'rear' ? ['ports'] : (ticket.device === 'phone' ? ['screen', 'power', 'security', 'ports'] : ['screen', 'power', 'security']);
  $('exam-hotspots').replaceChildren(...visible.map(zone => {
    const button = document.createElement('button');
    const index = INSPECTION_ZONES.findIndex(z => z.id === zone);
    // Keep 44px controls beside the evidence: never cover a status label or loose plug.
    const [x, y] = exam.view === 'rear' ? DEVICE_CONNECTION_VIEWS[ticket.device].hotspot : positions[zone];
    button.type = 'button';
    button.className = 'exam-hotspot' + (activeChallenge.guided && zone === model.zone ? ' guided' : '');
    button.textContent = String(index + 1);
    button.setAttribute('aria-label', 'Inspect ' + INSPECTION_ZONES[index].label);
    button.setAttribute('aria-pressed', String(exam.zone === zone));
    button.style.left = (x / 640 * 100) + '%';
    button.style.top = (y / 400 * 100) + '%';
    button.addEventListener('click', () => inspectZone(zone));
    return button;
  }));
  for (const button of examDialog.querySelectorAll('[data-exam-view]')) {
    button.setAttribute('aria-pressed', String(button.dataset.examView === exam.view));
  }
}

function inspectZone(zoneId) {
  const ticket = examTicket();
  if (!ticket || exam.finished) return;
  const model = inspectionFor(ticket);
  const zone = model?.zones.find(z => z.id === zoneId);
  if (!zone) return;
  exam.zone = zoneId;
  exam.view = zoneId === 'ports' && ticket.device !== 'phone' ? 'rear' : 'front';
  renderExamDevice(ticket, model);
  const evidence = evidenceFor(model, zone, activeChallenge);
  $('exam-finding-title').textContent = evidence.title;
  $('exam-finding-detail').textContent = evidence.detail;
  $('exam-finding').classList.toggle('has-finding', zone.finding && activeChallenge.hints);
  $('exam-action').hidden = activeChallenge.choices;
  $('exam-actions').hidden = !activeChallenge.choices;
  $('exam-actions').replaceChildren(...(activeChallenge.raw ? FIXES : FIXES.filter(f => f.id !== 'notit')).map(fix => {
    const button = document.createElement('button');
    button.type = 'button';
    button.className = 'btn btn-ghost';
    button.dataset.fix = fix.id;
    button.textContent = fix.label;
    button.addEventListener('click', () => {
      if (!examTicket() || exam.finished || !exam.zone) return;
      selectedId = exam.id;
      useFix(fix.id, button);
    });
    return button;
  }));
  $('exam-action').disabled = false;
  $('exam-action').textContent = zone.label;
  $('exam-action').dataset.fix = zone.fix;
  $('exam-action').setAttribute('aria-label', zone.label + ' on ' + DEVICE_NAMES[ticket.device]);
  for (const button of $('exam-zones').children) {
    button.setAttribute('aria-pressed', String(button.dataset.zone === zoneId));
  }
  if (window.matchMedia('(max-width: 700px)').matches) {
    (activeChallenge.choices ? $('exam-actions') : $('exam-action')).scrollIntoView({ block: 'nearest', behavior: reduceMotion.matches ? 'instant' : 'smooth' });
  }
}

function finishInspection(id, cls, label) {
  if (!examDialog.open || exam.id !== id || exam.finished) return;
  exam.finished = true;
  $('exam-action').hidden = true;
  $('exam-actions').hidden = true;
  $('exam-actions').replaceChildren();
  $('exam-hotspots').replaceChildren();
  for (const button of $('exam-zones').children) button.disabled = true;
  for (const button of examDialog.querySelectorAll('[data-exam-view]')) button.disabled = true;
  $('exam-patience').textContent = cls === 'out-fixed' ? 'Repair complete' : 'Visitor has left';
  $('exam-feedback').textContent = cls === 'out-fixed'
    ? 'Device restored and returned. ' + label + ' — back to the office when you’re ready.'
    : 'This visitor has left the desk. Return to the office to help the next person.';
  $('exam-finding-title').textContent = cls === 'out-fixed' ? 'Back in working order.' : 'Examination ended.';
  $('exam-finding-detail').textContent = cls === 'out-fixed' ? 'All repair stages are complete.' : 'This device is no longer at your workbench.';
  if (cls === 'out-fixed') {
    const device = $('exam-device').dataset.device;
    $('exam-device').innerHTML = inspectionDeviceSVG(device, { screen: 'READY', cue: 'ready' });
    $('exam-view-label').textContent = 'Front view · repair complete';
    $('exam-physical-state').textContent = 'Power on · ready to return';
    for (const button of examDialog.querySelectorAll('[data-exam-view]')) button.setAttribute('aria-pressed', String(button.dataset.examView === 'front'));
  }
}

function renderInspection() {
  if (!examDialog.open || !game) return;
  $('exam-clock').textContent = game.mode === 'practice' ? 'Untimed' : clock(game.t);
  const waiting = game.tickets.filter(t => t.kind !== 'repair').length;
  $('exam-inbox').textContent = waiting + (waiting === 1 ? ' email waiting' : ' emails waiting');
  const ticket = examTicket();
  if (!ticket || exam.finished) return;
  const model = inspectionFor(ticket);
  if (!model) { closeInspection(); return; }
  $('exam-patience').textContent = game.mode === 'practice' ? 'Take your time' : Math.max(0, Math.ceil((ticket.patience - ticket.age) / 1000)) + 's patience';
  $('exam-patience').classList.toggle('urgent', ticket.age / ticket.patience > .65);
  const key = ticket.id + ':' + ticket.stage;
  if (key === exam.key) return;
  exam.key = key;
  exam.zone = null;
  exam.view = 'front';
  $('exam-title').textContent = DEVICE_NAMES[ticket.device] + ' examination';
  $('exam-device').dataset.device = ticket.device;
  $('exam-from').textContent = ticket.from;
  $('exam-avatar').innerHTML = avatar(ticket.from, ticket.kind);
  $('exam-complaint').textContent = '“' + ticket.text + '”';
  $('exam-step').textContent = 'Stage ' + (ticket.stage + 1) + ' / ' + ticket.stages.length;
  examDialog.querySelector('.exam-assist').hidden = !activeChallenge.hints;
  $('exam-hint').textContent = 'Current repair: ' + FIX_LABEL[ticket.fix] + '. Inspect the evidence before choosing.';
  examDialog.querySelector('.exam-assist').open = false;
  $('exam-finding-title').textContent = ticket.stage ? 'Something changed. Check again.' : 'Start with what you can see.';
  $('exam-finding-detail').textContent = activeChallenge.guided
    ? 'Start with ' + INSPECTION_ZONES.find(z => z.id === model.zone).label.toLowerCase() + '. The outlined component has a clue.'
    : activeChallenge.raw ? 'Read the component telemetry. Decide which repair addresses the observed state.'
    : 'Compare the device with the person’s description. Select a component to examine it.';
  $('exam-finding').classList.remove('has-finding');
  $('exam-action').hidden = true;
  $('exam-actions').hidden = true;
  $('exam-actions').replaceChildren();
  $('exam-feedback').textContent = '';
  for (const button of examDialog.querySelectorAll('[data-exam-view]')) button.disabled = false;
  $('exam-zones').replaceChildren(...model.zones.map((zone, index) => {
    const button = document.createElement('button');
    button.type = 'button';
    button.className = 'exam-zone' + (activeChallenge.guided && zone.finding ? ' guided' : '');
    button.dataset.zone = zone.id;
    button.setAttribute('aria-pressed', 'false');
    button.title = zone.description;
    button.textContent = (index + 1) + ' · ' + INSPECTION_ZONES[index].label;
    button.addEventListener('click', () => inspectZone(zone.id));
    return button;
  }));
  renderExamDevice(ticket, model);
  if (ticket.stage && window.matchMedia('(max-width: 700px)').matches) {
    $('exam-device').scrollIntoView({ block: 'nearest', behavior: reduceMotion.matches ? 'instant' : 'smooth' });
  }
}

$('exam-close').addEventListener('click', closeInspection);
examDialog.addEventListener('cancel', e => { e.preventDefault(); closeInspection(); });
$('exam-pause').addEventListener('click', () => { closeInspection(); pause(); });
$('exam-action').addEventListener('click', () => {
  const ticket = examTicket();
  if (!ticket || exam.finished) return;
  selectedId = ticket.id;
  useFix($('exam-action').dataset.fix, $('exam-action'));
});
for (const button of examDialog.querySelectorAll('[data-exam-view]')) {
  button.addEventListener('click', () => {
    const ticket = examTicket();
    if (!ticket || exam.finished) return;
    exam.view = button.dataset.examView;
    renderExamDevice(ticket, inspectionFor(ticket));
  });
}

// --- rendering ------------------------------------------------------------------

let roomMinute = -1;
function renderRoom(t) {
  const minute = Math.floor(9 * 60 + t / SHIFT_MS * 8 * 60);
  if (minute === roomMinute) return;
  roomMinute = minute;
  const hour = (minute / 60) % 24;
  app.dataset.daylight = hour >= 19 || hour < 6 ? 'night' : hour >= 16 ? 'sunset' : 'day';
  app.style.setProperty('--clock-hour', `${minute * 0.5}deg`);
  app.style.setProperty('--clock-minute', `${minute * 6}deg`);
}

function ticketDisplayText(ticket) {
  if (ticket.kind !== 'boss') return ticket.text;
  return [
    'Projector has no signal. Its video lead is unplugged; hardware is undamaged.',
    'Link restored. Receiver is stuck; its approved recovery guide calls for restart.',
    'Receiver responds. A verified firmware update fixes the confirmed fault.',
  ][ticket.stage] || ticket.text;
}

function createCard(ticket) {
  const li = document.createElement('li');
  li.className = 'ticket' + (ticket.vip ? ' vip' : '') + (ticket.kind === 'spam' ? ' spam' : '') + (ticket.kind === 'repair' ? ' visitor' : '');
  li.dataset.id = ticket.id;
  const chip = ticket.vip ? '<span class="chip chip-vip">VIP · 2x</span>'
    : ticket.kind === 'boss' ? '<span class="chip chip-step chip-boss">Step 1 of 3</span>'
    : ticket.kind === 'repair' ? `<span class="chip chip-step chip-repair">1 of ${ticket.stages.length}</span>`
    : ticket.kind === 'spam' ? '<span class="chip chip-spam">Report for review</span>'
    : ticket.kind === 'reopen' ? '<span class="chip chip-re">Reopened</span>' : '';
  if (ticket.kind === 'repair') {
    // A person walks up to the counter carrying the machine.
    li.innerHTML = `<button type="button" class="ticket-btn visitor-btn">
  <span class="bubble">
    <span class="ticket-meta"><span class="ticket-from"></span>${chip}</span>
    <span class="ticket-text"></span>
    <span class="ticket-hint" hidden></span>
    <span class="patience" aria-hidden="true"><span class="patience-fill"></span></span>
  </span>
  <span class="figure" aria-hidden="true">${personSVG(ticket.from, ticket.device, inspectionFor(ticket))}</span>
</button>`;
  } else {
    li.innerHTML = `<button type="button" class="ticket-btn">
  <span class="ticket-body">
    <span class="ticket-meta"><span class="avatar" aria-hidden="true">${avatar(ticket.from, ticket.kind)}</span><span class="ticket-id">INC-${String(ticket.id).padStart(4, '0')}</span><span class="ticket-from"></span>${chip}</span>
    <span class="ticket-text"></span>
    <span class="ticket-hint" hidden></span>
    <span class="patience" aria-hidden="true"><span class="patience-fill"></span></span>
  </span>
</button>`;
  }
  li.querySelector('.ticket-from').textContent = ticket.from;
  li.querySelector('.ticket-text').textContent = ticketDisplayText(ticket);
  li.querySelector('.ticket-btn').addEventListener('click', () => {
    selectedId = ticket.id;
    render();
    if (ticket.kind === 'repair') openInspection(ticket);
  });
  (ticket.kind === 'repair' ? benchEl : queueEl).append(li);
  cards.set(ticket.id, li);
  return li;
}

function removeCard(id, cls, label) {
  finishInspection(id, cls, label);
  const el = cards.get(id);
  if (!el) return;
  cards.delete(id);
  el.classList.add('leaving', cls);
  el.querySelector('.ticket-btn').disabled = true;
  if (label) {
    const stamp = document.createElement('span');
    stamp.className = 'stamp';
    stamp.textContent = label;
    el.append(stamp);
  }
  const done = () => el.remove();
  el.addEventListener('animationend', (e) => { if (e.target === el) done(); }, { once: false });
  setTimeout(done, reduceMotion.matches ? 0 : 950);
}

function render() {
  if (!game) return;
  if(game.phase==='playing') securityDesk.sync({elapsed:game.t,round:game.practiceRound||1,clock:clock(game.t),running});
  const focus = focusedTicket();

  for (const ticket of game.tickets) {
    const el = cards.get(ticket.id) || createCard(ticket);
    const textEl = el.querySelector('.ticket-text');
    const displayText = ticketDisplayText(ticket);
    if (textEl.textContent !== displayText) textEl.textContent = displayText;
    const left = Math.max(0, 1 - ticket.age / ticket.patience);
    el.style.setProperty('--left', left.toFixed(3));
    el.classList.toggle('urgent', left < 0.35);
    // Presentation only: patience comes directly from the unchanged engine.
    el.dataset.mood = left < 0.18 ? 'steaming' : left < 0.35 ? 'tapping' : left < 0.65 ? 'crossed' : 'calm';
    el.classList.toggle('focused', ticket === focus);
    // Keep the carried device in sync when a repair restores power.
    if (ticket.kind === 'repair' && el.dataset.artStage !== String(ticket.stage)) {
      el.querySelector('.person')?.classList.toggle('device-unpowered', inspectionFor(ticket)?.physical.powered === false);
      el.dataset.artStage = String(ticket.stage);
    }
    el.querySelector('.ticket-btn').setAttribute('aria-current', ticket === focus ? 'true' : 'false');
    if (ticket.stages) {
      const stepChip = el.querySelector('.chip-step');
      if (stepChip) {
        stepChip.textContent = ticket.kind === 'repair'
          ? `${ticket.stage + 1} of ${ticket.stages.length}`
          : `Step ${ticket.stage + 1} of ${ticket.stages.length}`;
      }
    }
    const hint = el.querySelector('.ticket-hint');
    const showHint = ticket.kind === 'repair' || ticket.hint || (activeChallenge.hints && ticket.id <= 3);
    // Re-render when visibility flips, or when a boss ticket moves to its next step.
    if (showHint !== !hint.hidden || (showHint && hint.dataset.fix !== ticket.fix)) {
      hint.hidden = !showHint;
      hint.dataset.fix = ticket.fix;
      if (ticket.kind === 'repair' && inspectionFor(ticket)) {
        hint.textContent = 'Examine ' + DEVICE_NAMES[ticket.device].toLowerCase() + ' ↗';
        hint.className = 'ticket-hint inspect-prompt';
      } else {
        hint.innerHTML = `${FIX_ICONS[ticket.fix]}<span>${ticket.hint ? 'Try' : 'Tip'}: ${FIX_LABEL[ticket.fix]}</span>`;
        hint.className = `ticket-hint hint-${ticket.fix}`;
      }
    }
  }

  // HUD
  $('clock').textContent = game.mode === 'practice' ? 'Practice' : clock(game.t);
  renderRoom(game.t);
  $('clock-sub').textContent = activeChallenge.label + ' · ' + (game.mode === 'practice' ? 'No time limit' : game.t >= SHIFT_MS ? 'Overtime' : 'Until 5 PM');
  $('score').textContent = game.mode === 'practice' ? game.closed : game.score.toLocaleString();
  document.querySelector('.hud-score .hud-label').textContent = game.mode === 'practice' ? 'Completed' : 'Score';
  $('practice-bar').hidden = game.mode !== 'practice';
  $('next-case-btn').disabled = game.tickets.length > 0 || securityDesk.pendingCount() > 0;
  $('practice-guidance').textContent = securityDesk.pendingCount() > 0 ? 'Resolve repairs and security to finish this round.' : game.tickets.length > 0 ? 'Finish your repairs to unlock the next round.' : 'Round complete. Ready for the next case?';
  const mult = multiplier(game.streak);
  const multEl = $('mult');
  multEl.hidden = mult === 1;
  multEl.textContent = `x${mult}`;

  const faces = $('faces');
  if (faces.dataset.csat !== String(game.csat)) {
    faces.dataset.csat = game.csat;
    faces.innerHTML = Array.from({ length: MAX_CSAT }, (_, i) => `<span class="face ${i < game.csat ? 'on' : 'off'}">${face(i < game.csat)}</span>`).join('');
    faces.parentElement.setAttribute('aria-label', `Coworker happiness: ${game.csat} of ${MAX_CSAT}`);
  }

  const emails = game.tickets.filter((t) => t.kind !== 'repair').length;
  const repairs = game.tickets.length - emails;
  $('bench-wrap').hidden = false;
  $('bench-wrap').classList.toggle('is-empty', repairs === 0);
  $('inbox-status').textContent = emails ? `${emails} open · select a ticket` : 'All quiet. Suspicious.';
  $('empty').hidden = emails !== 0 || game.phase !== 'playing';
  app.classList.toggle('frenzy', game.t < game.frenzyUntil && game.phase === 'playing');

  // Power-ups
  $('charge-chip').textContent = `⚡ ${game.charges}`;
  $('charge-chip').classList.toggle('has-charge', game.charges > 0);
  for (const btn of document.querySelectorAll('.power-btn')) {
    btn.disabled = !running || game.charges <= 0;
  }

  const n = emails; // Backlog is conveyed by the count and queue indicators.
  const pips = $('pips').children;
  for (let i = 0; i < pips.length; i++) pips[i].classList.toggle('on', i < n);
  $('pips').dataset.level = n >= MAX_QUEUE - 1 ? 'high' : n >= MAX_QUEUE - 3 ? 'mid' : 'low';
  $('queue-count').textContent = `${n} of ${MAX_QUEUE}`;
  floodEl.hidden = true;
  renderInspection();
}

// --- toasts and banners ---------------------------------------------------------

let toastTimer;
function toast(msg) {
  const el = $('toast');
  el.textContent = msg;
  el.classList.add('show');
  clearTimeout(toastTimer);
  toastTimer = setTimeout(() => el.classList.remove('show'), 1800);
}

let bannerTimer;
function banner(title, detail) {
  const el = $('banner');
  $('banner-title').textContent = title;
  $('banner-detail').textContent = detail;
  el.hidden = false;
  restartAnim(el, 'in');
  clearTimeout(bannerTimer);
  bannerTimer = setTimeout(() => { el.hidden = true; }, 3200);
}

function announce(msg) {
  $('announcer').textContent = msg;
}

// --- loop -------------------------------------------------------------------------

function frame(now) {
  const dt = Math.min(100, now - last);
  last = now;
  if (running && game) {
    if (game.mode !== 'practice') handleEvents(tick(game, dt));
    render();
  }
  requestAnimationFrame(frame);
}

// --- input ------------------------------------------------------------------------

document.addEventListener('keydown', (e) => {
  if (securityDesk.isOpen()) return; // Incident dialog owns focus, Escape and response controls.
  if (e.metaKey || e.ctrlKey || e.altKey) return;
  if (examDialog.open) {
    if (e.key === 'Escape') { e.preventDefault(); closeInspection(); return; }
    if (e.key.toLowerCase() === 'p') { e.preventDefault(); closeInspection(); pause(); return; }
    const fix = FIXES.find(f => f.key === e.key);
    if (fix && !exam.finished) {
      e.preventDefault();
      if (!exam.zone) { $('exam-feedback').textContent = 'Select a component to inspect before choosing a repair.'; return; }
      selectedId = exam.id;
      useFix(fix.id);
    }
    return; // Native dialog handles Tab; background shortcuts must not change the target.
  }
  const screen = app.dataset.screen;
  if (screen === 'play') {
    const fix = FIXES.find((f) => f.key === e.key);
    if (fix) { e.preventDefault(); useFix(fix.id); return; }
    const power = POWERS.find((p) => p.key === e.key.toLowerCase());
    if (power) { e.preventDefault(); usePowerUI(power.id); return; }
    if (e.key === 'ArrowUp') { e.preventDefault(); moveSelection(-1); return; }
    if (e.key === 'ArrowDown') { e.preventDefault(); moveSelection(1); return; }
    if (e.key === 'Escape' || e.key === 'p' || e.key === 'P') { e.preventDefault(); pause(); }
  } else if (screen === 'pause' && (e.key === 'Escape' || e.key === 'p' || e.key === 'P')) {
    e.preventDefault();
    resume();
  } else if (screen === 'over' && e.key === 'Escape') {
    e.preventDefault();
    goHome();
  }
});

document.addEventListener('visibilitychange', () => {
  if (document.hidden) pause();
});

$('start-btn').addEventListener('click', () => startShift(sessionChoice));
$('next-case-btn').addEventListener('click', () => { if (game && nextPracticeCase(game)) { selectedId = null; render(); } });
$('practice-finish-btn').addEventListener('click', () => { if (game?.mode === 'practice') { game.phase = 'over'; endShift(); } });
$('daily-btn').addEventListener('click', () => startShift('daily'));
$('endless-btn').addEventListener('click', () => startShift('endless'));
$('tutorial-btn').addEventListener('click', () => startShift('tutorial'));
$('stats-btn').addEventListener('click', openStats);
$('stats-back-btn').addEventListener('click', () => show('start'));
$('shop-btn').addEventListener('click', openShop);
$('shop-back-btn').addEventListener('click', () => show('start'));
$('online-toggle').addEventListener('click', () => {
  onlinePref = !onlinePref;
  try { localStorage.setItem('ticket-tsunami:online', onlinePref ? '1' : '0'); } catch { /* fine */ }
  renderOnlineToggle();
});
$('again-btn').addEventListener('click', () => startShift(mode === 'practice' ? 'practice' : 'free'));
$('menu-btn').addEventListener('click', goHome);
$('pause-btn').addEventListener('click', pause);

// Sound on/off, remembered per browser.
function renderMute() {
  const btn = $('mute-btn');
  btn.classList.toggle('muted', isMuted());
  btn.setAttribute('aria-pressed', String(isMuted()));
  btn.setAttribute('aria-label', isMuted() ? 'Unmute sound' : 'Mute sound');
}
try { setMuted(localStorage.getItem('ticket-tsunami:muted') === '1'); } catch { /* fine */ }
$('mute-btn').addEventListener('click', () => {
  setMuted(!isMuted());
  try { localStorage.setItem('ticket-tsunami:muted', isMuted() ? '1' : '0'); } catch { /* fine */ }
  renderMute();
});
renderMute();
$('resume-btn').addEventListener('click', resume);
$('quit-btn').addEventListener('click', () => {
  game.phase = 'over';
  endShift();
});
$('share-btn').addEventListener('click', async () => {
  const text = $('share-text').textContent;
  try {
    await navigator.clipboard.writeText(text);
    toast('Results copied. Go brag.');
  } catch {
    const range = document.createRange();
    range.selectNodeContents($('share-text'));
    const sel = window.getSelection();
    sel.removeAllRanges();
    sel.addRange(range);
    toast('Copy didn’t work here. The text is selected for you.');
  }
});

for (const details of document.querySelectorAll('.home-settings')) {
  details.addEventListener('toggle', () => {
    if (details.open) for (const other of document.querySelectorAll('.home-settings')) if (other !== details) other.open = false;
  });
}
document.addEventListener('click', event => {
  if (!event.target.closest('.home-settings')) for (const details of document.querySelectorAll('.home-settings')) details.open = false;
});
document.addEventListener('keydown', event => {
  if (event.key === 'Escape') for (const details of document.querySelectorAll('.home-settings[open]')) { details.open = false; details.querySelector('summary').focus(); }
});

renderRoom(0);
buildFixBar();
buildPips();
buildFaces();
buildDiffPicker();
buildPowers();
buildMusicPicker();
renderOnlineToggle();
updateDailyCard();
show('start');
requestAnimationFrame((now) => { last = now; frame(now); });

