import {
  FIXES, MAX_QUEUE, MAX_CSAT, SHIFT_MS, DIFFICULTIES, DEFAULT_DIFFICULTY,
  POWERS, ACHIEVEMENTS,
  createGame, tick, applyFix, usePower, mostUrgent, multiplier, clock, summary,
  difficultyFor, evaluateAchievements,
} from './engine.js';
import { FIX_ICONS, face } from './icons.js';
import { play, setMuted, isMuted } from './sound.js';

const $ = (id) => document.getElementById(id);
const app = $('app');
const queueEl = $('queue');
const floodEl = $('flood');
const screens = { start: $('start-screen'), pause: $('pause-screen'), over: $('over-screen') };
const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)');

const SHORT = { restart: 'Restart', password: 'Password', connect: 'Connection', update: 'Update', notit: 'Not IT' };
const FIX_LABEL = Object.fromEntries(FIXES.map((f) => [f.id, f.label]));

let game = null;
let running = false;
let mode = 'free'; // 'free' | 'daily'
let selectedId = null; // a ticket the player clicked; otherwise we focus the most urgent
let last = 0;
const cards = new Map(); // ticket id -> <li>
const POWER_EMOJI = { coffee: '☕', kb: '📖', bot: '🤖' };

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
    return DIFFICULTIES.some((d) => d.id === id) ? id : DEFAULT_DIFFICULTY;
  } catch { return DEFAULT_DIFFICULTY; }
}
function saveDifficulty(id) {
  try { localStorage.setItem('ticket-tsunami:difficulty', id); } catch { /* private mode etc. */ }
}

let difficulty = loadDifficulty();

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
    btn.innerHTML = `<span class="power-emoji" aria-hidden="true">${POWER_EMOJI[p.id]}</span><span class="power-label">${p.label}</span><kbd>${p.key.toUpperCase()}</kbd>`;
    btn.addEventListener('click', () => usePowerUI(p.id));
    row.append(btn);
  }
}

function usePowerUI(powerId) {
  if (!running) return;
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
  for (const d of DIFFICULTIES) {
    const btn = document.createElement('button');
    btn.type = 'button';
    btn.className = 'diff-btn';
    btn.dataset.diff = d.id;
    btn.textContent = d.label;
    btn.setAttribute('aria-pressed', 'false');
    btn.addEventListener('click', () => setDifficulty(d.id));
    row.append(btn);
  }
  setDifficulty(difficulty);
}

function setDifficulty(id) {
  difficulty = id;
  saveDifficulty(id);
  for (const btn of document.querySelectorAll('.diff-btn')) {
    btn.setAttribute('aria-pressed', String(btn.dataset.diff === id));
  }
  $('diff-blurb').textContent = difficultyFor(id).blurb;
  renderBest();
}

/** Fill the HUD with five happy faces before the first shift starts. */
function buildFaces() {
  const faces = $('faces');
  faces.dataset.csat = String(MAX_CSAT);
  faces.innerHTML = Array.from({ length: MAX_CSAT }, () => `<span class="face on">${face(true)}</span>`).join('');
  faces.parentElement.setAttribute('aria-label', `Customer happiness: ${MAX_CSAT} of ${MAX_CSAT}`);
}

// --- screens ----------------------------------------------------------------------

function show(name) {
  app.dataset.screen = name;
  for (const [key, el] of Object.entries(screens)) el.hidden = key !== name;
  const focusTarget = { start: 'start-btn', pause: 'resume-btn', over: 'again-btn' }[name];
  if (focusTarget) $(focusTarget).focus({ preventScroll: true });
}

function startShift(newMode = 'free') {
  if (newMode === 'daily' && loadDaily()) return; // one try a day
  mode = newMode;
  for (const el of cards.values()) el.remove();
  cards.clear();
  queueEl.replaceChildren();
  selectedId = null;
  game = mode === 'daily'
    ? createGame(dailySeed(todayKey()), DEFAULT_DIFFICULTY)
    : createGame((Date.now() ^ (Math.random() * 1e9)) | 0, difficulty);
  show('play');
  running = true;
  last = performance.now();
  render();
}

/** Back to the start screen: clean floor, fresh HUD, no game. */
function goHome() {
  running = false;
  game = null;
  selectedId = null;
  for (const el of cards.values()) el.remove();
  cards.clear();
  queueEl.replaceChildren();
  $('empty').hidden = true;
  app.classList.remove('overtime', 'frenzy');
  $('clock').textContent = '9:00 AM';
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
  show('pause');
}

function resume() {
  if (!game || game.phase !== 'playing') return;
  show('play');
  running = true;
  last = performance.now();
}

function endShift() {
  running = false;
  const s = summary(game);
  const best = loadBest(s.difficulty);
  const isBest = !best || s.score > best.score;
  if (isBest && s.score > 0) saveBest(s.difficulty, { score: s.score, clock: s.clock, rank: s.rank });
  if (mode === 'daily' && !loadDaily()) {
    saveDaily({ date: todayKey(), score: s.score, clock: s.clock, rank: s.rank });
    updateDailyCard();
  }

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

  const dayLabel = mode === 'daily' ? `Daily Shift · ${dailyLabel()}` : s.difficultyLabel;
  $('over-eyebrow').textContent = `Shift report · ${dayLabel}${s.madeItToFive ? ' · Overtime survivor' : ''}`;
  $('r-clock').textContent = s.clock;
  $('r-rank').textContent = s.rank;
  $('r-score').textContent = s.score.toLocaleString();
  $('r-closed').textContent = s.closed;
  $('r-acc').textContent = `${s.accuracy}%`;
  $('r-streak').textContent = s.bestStreak;
  $('r-expired').textContent = s.expired + s.overflowed;
  $('r-self').textContent = s.selfFixed;
  $('r-newbest').hidden = !(isBest && s.score > 0 && best);
  $('share-text').textContent = shareText(s);
  show('over');
  announce(`Shift over at ${s.clock}. Score ${s.score}. Rank: ${s.rank}.`);
}

function shareText(s) {
  if (mode === 'daily') {
    return `Ticket Tsunami Daily · ${dailyLabel()}\n🌊 Lasted until ${s.clock} · ${s.score.toLocaleString()} pts\n🎫 ${s.closed} closed · 🎯 ${s.accuracy}% · 🔥 streak ${s.bestStreak}\nRank: ${s.rank}\nhttps://ticket-tsunami.vercel.app`;
  }
  return `Ticket Tsunami (${s.difficultyLabel}): lasted until ${s.clock}, closed ${s.closed} tickets, ${s.score.toLocaleString()} points, best streak ${s.bestStreak}. Rank: ${s.rank}.`;
}

function renderBest() {
  const best = loadBest(difficulty);
  const line = $('best-line');
  line.hidden = !best;
  if (best) line.textContent = `Your best ${difficultyFor(difficulty).label}: ${best.score.toLocaleString()} points, lasted until ${best.clock}.`;
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
  const res = applyFix(game, target.id, fixId);
  pulse(sourceBtn || document.querySelector(`.fix[data-fix="${fixId}"]`), res.type);
  if (res.type === 'correct') {
    removeCard(res.ticket.id, 'out-fixed', `+${res.points}`);
    if (selectedId === res.ticket.id) selectedId = null;
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
    toast(`${FIX_LABEL[res.tried]} didn’t help.`);
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
        play('spawn');
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
      case 'outage':
        play('outage');
        banner(ev.title, ev.detail);
        announce(`${ev.title}. ${ev.detail}`);
        break;
      case 'frenzy':
        play('frenzy');
        banner('🔥 Something is on fire!', 'Double points for 8 seconds. Go.');
        announce('Something is on fire. Double points for 8 seconds.');
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

// --- rendering ------------------------------------------------------------------

function createCard(ticket) {
  const li = document.createElement('li');
  li.className = 'ticket' + (ticket.vip ? ' vip' : '') + (ticket.kind === 'spam' ? ' spam' : '');
  li.dataset.id = ticket.id;
  const chip = ticket.vip ? '<span class="chip chip-vip">VIP · 2x</span>'
    : ticket.kind === 'spam' ? '<span class="chip chip-spam">Sus · 1.5x</span>'
    : ticket.kind === 'reopen' ? '<span class="chip chip-re">Reopened</span>' : '';
  li.innerHTML = `<button type="button" class="ticket-btn">
  <span class="ticket-meta"><span class="ticket-id">INC-${String(ticket.id).padStart(4, '0')}</span><span class="ticket-from"></span>${chip}</span>
  <span class="ticket-text"></span>
  <span class="ticket-hint" hidden></span>
  <span class="patience" aria-hidden="true"><span class="patience-fill"></span></span>
</button>`;
  li.querySelector('.ticket-from').textContent = ticket.from;
  li.querySelector('.ticket-text').textContent = ticket.text;
  li.querySelector('.ticket-btn').addEventListener('click', () => {
    selectedId = ticket.id;
    render();
  });
  queueEl.append(li);
  cards.set(ticket.id, li);
  return li;
}

function removeCard(id, cls, label) {
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
  setTimeout(done, reduceMotion.matches ? 0 : 700);
}

function render() {
  if (!game) return;
  const focus = focusedTicket();

  for (const ticket of game.tickets) {
    const el = cards.get(ticket.id) || createCard(ticket);
    const left = Math.max(0, 1 - ticket.age / ticket.patience);
    el.style.setProperty('--left', left.toFixed(3));
    el.classList.toggle('urgent', left < 0.35);
    el.classList.toggle('focused', ticket === focus);
    el.querySelector('.ticket-btn').setAttribute('aria-current', ticket === focus ? 'true' : 'false');
    const hint = el.querySelector('.ticket-hint');
    const showHint = ticket.hint || ticket.id <= 3;
    if (showHint !== !hint.hidden) {
      hint.hidden = !showHint;
      hint.innerHTML = `${FIX_ICONS[ticket.fix]}<span>${ticket.hint ? 'Try' : 'Tip'}: ${FIX_LABEL[ticket.fix]}</span>`;
      hint.className = `ticket-hint hint-${ticket.fix}`;
    }
  }

  // HUD
  $('clock').textContent = clock(game.t);
  $('clock-sub').textContent = game.t >= SHIFT_MS ? 'Overtime' : 'Shift ends at 5:00 PM';
  $('score').textContent = game.score.toLocaleString();
  const mult = multiplier(game.streak);
  const multEl = $('mult');
  multEl.hidden = mult === 1;
  multEl.textContent = `x${mult}`;

  const faces = $('faces');
  if (faces.dataset.csat !== String(game.csat)) {
    faces.dataset.csat = game.csat;
    faces.innerHTML = Array.from({ length: MAX_CSAT }, (_, i) => `<span class="face ${i < game.csat ? 'on' : 'off'}">${face(i < game.csat)}</span>`).join('');
    faces.parentElement.setAttribute('aria-label', `Customer happiness: ${game.csat} of ${MAX_CSAT}`);
  }

  $('empty').hidden = game.tickets.length !== 0 || game.phase !== 'playing';
  app.classList.toggle('frenzy', game.t < game.frenzyUntil && game.phase === 'playing');

  // Power-ups
  $('charge-chip').textContent = `⚡ ${game.charges}`;
  $('charge-chip').classList.toggle('has-charge', game.charges > 0);
  for (const btn of document.querySelectorAll('.power-btn')) {
    btn.disabled = !running || game.charges <= 0;
  }

  const n = game.tickets.length;
  const pips = $('pips').children;
  for (let i = 0; i < pips.length; i++) pips[i].classList.toggle('on', i < n);
  $('pips').dataset.level = n >= MAX_QUEUE - 1 ? 'high' : n >= MAX_QUEUE - 3 ? 'mid' : 'low';
  $('queue-count').textContent = `${n} of ${MAX_QUEUE}`;
  floodEl.style.setProperty('--level', (n / MAX_QUEUE).toFixed(3));
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
    handleEvents(tick(game, dt));
    render();
  }
  requestAnimationFrame(frame);
}

// --- input ------------------------------------------------------------------------

document.addEventListener('keydown', (e) => {
  if (e.metaKey || e.ctrlKey || e.altKey) return;
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

$('start-btn').addEventListener('click', () => startShift('free'));
$('daily-btn').addEventListener('click', () => startShift('daily'));
$('again-btn').addEventListener('click', () => startShift('free'));
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

buildFixBar();
buildPips();
buildFaces();
buildDiffPicker();
buildPowers();
updateDailyCard();
show('start');
requestAnimationFrame((now) => { last = now; frame(now); });
