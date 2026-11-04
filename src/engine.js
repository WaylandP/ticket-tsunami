// The whole game, minus the screen. No DOM, no Date.now(), no Math.random():
// time comes in through tick(dt) and randomness from a seeded generator,
// so a game can be replayed exactly and tested in Node.

import { TICKETS, NAMES, SPAM } from './tickets.js';

export const FIXES = [
  { id: 'restart', label: 'Restart it', key: '1' },
  { id: 'password', label: 'Reset password', key: '2' },
  { id: 'connect', label: 'Check connection', key: '3' },
  { id: 'update', label: 'Install updates', key: '4' },
  { id: 'notit', label: 'Not an IT problem', key: '5' },
];
export const FIX_IDS = FIXES.map((f) => f.id);

export const HOUR_MS = 20_000; // one in-game hour of the 9-to-5 shift
export const SHIFT_MS = 8 * HOUR_MS; // 9:00 AM to 5:00 PM
export const MAX_QUEUE = 8;
export const MAX_CSAT = 5;

const OUTAGES = [
  { fix: 'connect', title: 'Wi-Fi outage', detail: 'The office Wi-Fi just went down.' },
  { fix: 'password', title: 'Password expiry day', detail: 'Everyone’s password expired at once.' },
  { fix: 'update', title: 'Forced update', detail: 'A big update just landed on every laptop.' },
  { fix: 'restart', title: 'Everything froze', detail: 'The shared drive hiccuped and froze everyone.' },
];

// --- randomness ---------------------------------------------------------------

/** mulberry32: small, fast, good enough for a game. Mutates game.rng. */
function rand(game) {
  game.rng = (game.rng + 0x6d2b79f5) | 0;
  let t = game.rng;
  t = Math.imul(t ^ (t >>> 15), t | 1);
  t ^= t + Math.imul(t ^ (t >>> 7), t | 61);
  return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
}
const pick = (game, list) => list[Math.floor(rand(game) * list.length)];
const lerp = (a, b, p) => a + (b - a) * p;

// --- difficulty ----------------------------------------------------------------

/** 0 at 9 AM, 1 at 5 PM. */
export const shiftProgress = (t) => Math.min(1, t / SHIFT_MS);
/** Minutes of overtime, scaled: 0 during the shift, then climbs. */
const overtime = (t) => Math.max(0, (t - SHIFT_MS) / 60_000);

/**
 * Three kinds of day. Harder days spawn faster, grant less patience,
 * suffer more outages — and pay more points.
 */
export const DIFFICULTIES = [
  {
    id: 'friday',
    label: 'Casual Friday',
    blurb: 'Half the office is out. The tickets trickle in.',
    scoreMult: 0.75,
    vipChance: 0.05,
    spawn: { start: 4500, end: 2200, min: 900, overtime: 0.45 },
    patience: { start: 22_000, end: 15_000, min: 6000, overtime: 0.25 },
    outage: { first: 70_000, gapMin: 60_000, gapMax: 90_000, size: 2 },
  },
  {
    id: 'nineToFive',
    label: 'Nine to Five',
    blurb: 'A normal day at the help desk. Busy, but survivable.',
    scoreMult: 1,
    vipChance: 0.08,
    spawn: { start: 3800, end: 1600, min: 700, overtime: 0.5 },
    patience: { start: 18_000, end: 11_000, min: 5000, overtime: 0.3 },
    outage: { first: 55_000, gapMin: 45_000, gapMax: 70_000, size: 3 },
  },
  {
    id: 'monday',
    label: 'Monday',
    blurb: 'Everyone’s laptop broke over the weekend. Good luck.',
    scoreMult: 1.3,
    vipChance: 0.1,
    spawn: { start: 3000, end: 1000, min: 380, overtime: 0.6 },
    patience: { start: 14_000, end: 8000, min: 3800, overtime: 0.35 },
    outage: { first: 45_000, gapMin: 35_000, gapMax: 55_000, size: 3 },
  },
];

export const DEFAULT_DIFFICULTY = 'nineToFive';

export function difficultyFor(id) {
  return DIFFICULTIES.find((d) => d.id === id) || DIFFICULTIES[1];
}

export function spawnInterval(t, diff = DIFFICULTIES[1]) {
  const s = diff.spawn;
  return Math.max(s.min, lerp(s.start, s.end, shiftProgress(t)) / (1 + s.overtime * overtime(t)));
}

export function patienceFor(t, diff = DIFFICULTIES[1]) {
  const p = diff.patience;
  return Math.max(p.min, lerp(p.start, p.end, shiftProgress(t)) / (1 + p.overtime * overtime(t)));
}

/** Combo multiplier: x1, then +0.5 for every 5 tickets in a row, up to x3. */
export function multiplier(streak) {
  return 1 + Math.min(4, Math.floor(streak / 5)) * 0.5;
}

/** In-game clock, e.g. "9:00 AM", "5:20 PM". */
export function clock(t) {
  const minutes = 9 * 60 + Math.floor((t / HOUR_MS) * 60);
  const h24 = Math.floor(minutes / 60) % 24;
  const m = minutes % 60;
  const h12 = h24 % 12 === 0 ? 12 : h24 % 12;
  return `${h12}:${String(m).padStart(2, '0')} ${h24 < 12 ? 'AM' : 'PM'}`;
}

export function rankFor(score) {
  if (score >= 50_000) return 'Legend of the Help Desk';
  if (score >= 25_000) return 'IT Wizard';
  if (score >= 12_000) return 'Sysadmin';
  if (score >= 5_000) return 'Help Desk Hero';
  if (score >= 1_500) return 'Junior Tech';
  return 'Intern';
}

// --- game ----------------------------------------------------------------------

export function createGame(seed = 1, difficulty = DEFAULT_DIFFICULTY) {
  return {
    seed,
    difficulty: difficultyFor(difficulty).id,
    rng: seed | 0,
    phase: 'playing', // 'playing' | 'over'
    t: 0,
    score: 0,
    csat: MAX_CSAT,
    streak: 0,
    bestStreak: 0,
    closed: 0,
    wrong: 0,
    expired: 0,
    overflowed: 0,
    selfFixed: 0,
    vipsClosed: 0,
    spamClosed: 0,
    reopens: 0,
    minCloseMs: null,
    inboxZeroNoon: false,
    charges: 0, // power-up charges, earned every 10-ticket streak
    slowUntil: 0, // coffee break: the world slows until then
    frenzyUntil: 0, // printer fire: double points until then
    nextFrenzy: 60_000,
    tickets: [],
    nextId: 1,
    nextSpawn: 900,
    nextOutage: difficultyFor(difficulty).outage.first,
    pending: [], // scheduled spawns: { at, fix } or { at, reopen }
    lastTemplate: -1,
  };
}

function makeSpam(game) {
  const diff = difficultyFor(game.difficulty);
  const s = pick(game, SPAM);
  return {
    id: game.nextId++,
    template: -1,
    kind: 'spam',
    fix: 'notit',
    text: s.text,
    from: s.from,
    vip: false,
    age: 0,
    patience: patienceFor(game.t, diff) * 1.1,
    selfFixAt: null,
    hint: false,
  };
}

function spawnReopen(game, events, r) {
  if (game.tickets.length >= MAX_QUEUE) return; // they gave up and went home
  const diff = difficultyFor(game.difficulty);
  const ticket = {
    id: game.nextId++,
    template: r.template,
    kind: 'reopen',
    fix: r.fix,
    text: r.text,
    from: r.from,
    vip: false,
    age: 0,
    patience: patienceFor(game.t, diff) * 0.85,
    selfFixAt: null,
    hint: false,
  };
  game.tickets.push(ticket);
  game.reopens++;
  events.push({ type: 'spawn', ticket });
}

function makeTicket(game, fix) {
  const pool = fix ? TICKETS.map((x, i) => [x, i]).filter(([x]) => x.fix === fix) : TICKETS.map((x, i) => [x, i]);
  const open = new Set(game.tickets.map((tk) => tk.template));
  let choice = pick(game, pool);
  for (let tries = 0; tries < 6 && (open.has(choice[1]) || choice[1] === game.lastTemplate); tries++) {
    choice = pick(game, pool);
  }
  const [tpl, index] = choice;
  game.lastTemplate = index;

  const diff = difficultyFor(game.difficulty);
  const vip = game.t > 30_000 && !fix && rand(game) < diff.vipChance;
  const patience = patienceFor(game.t, diff) * (vip ? 0.7 : 1);
  // Now and then a user fixes it themselves before you get there.
  const selfFixAt = !vip && game.t > 20_000 && rand(game) < 0.06 ? patience * lerp(0.35, 0.6, rand(game)) : null;

  return {
    id: game.nextId++,
    template: index,
    kind: 'normal',
    fix: tpl.fix,
    text: tpl.text,
    from: vip ? 'The CEO' : pick(game, NAMES),
    vip,
    age: 0,
    patience,
    selfFixAt,
    hint: false,
  };
}

function addTicket(game, events, fix) {
  if (game.tickets.length >= MAX_QUEUE) {
    game.overflowed++;
    loseCsat(game, events, 'overflow');
    return;
  }
  const spam = !fix && game.t > 25_000 && rand(game) < 0.07;
  const ticket = spam ? makeSpam(game) : makeTicket(game, fix);
  game.tickets.push(ticket);
  events.push({ type: 'spawn', ticket });
}

function loseCsat(game, events, reason) {
  game.csat = Math.max(0, game.csat - 1);
  game.streak = 0;
  events.push({ type: 'csat', reason, csat: game.csat });
  if (game.csat === 0 && game.phase === 'playing') {
    game.phase = 'over';
    events.push({ type: 'gameOver' });
  }
}

/** Advance the game by dt milliseconds. Returns a list of events for the UI. */
export function tick(game, dt) {
  const events = [];
  if (game.phase !== 'playing' || dt <= 0) return events;
  const before = game.t;
  game.t += dt;

  // Coffee break: the world slows down. The clock, sadly, does not.
  const slowed = before < game.slowUntil;
  const ageDt = slowed ? dt * 0.35 : dt;
  if (slowed) {
    game.nextSpawn += dt;
    game.nextOutage += dt;
    game.nextFrenzy += dt;
    for (const p of game.pending) p.at += dt;
  }

  if (before < SHIFT_MS && game.t >= SHIFT_MS) events.push({ type: 'overtime' });
  if (Math.floor(before / HOUR_MS) !== Math.floor(game.t / HOUR_MS)) events.push({ type: 'hour', clock: clock(game.t) });
  if (before < 3 * HOUR_MS && game.t >= 3 * HOUR_MS && game.tickets.length === 0) game.inboxZeroNoon = true;

  // Age tickets; expire, self-fix, or quietly bin the junk.
  for (const ticket of [...game.tickets]) {
    ticket.age += ageDt;
    if (ticket.selfFixAt !== null && ticket.age >= ticket.selfFixAt) {
      game.tickets.splice(game.tickets.indexOf(ticket), 1);
      game.selfFixed++;
      events.push({ type: 'selfFixed', ticket });
    } else if (ticket.age >= ticket.patience) {
      game.tickets.splice(game.tickets.indexOf(ticket), 1);
      if (ticket.kind === 'spam') {
        events.push({ type: 'spamGone', ticket }); // nobody misses it
      } else {
        game.expired++;
        events.push({ type: 'expired', ticket });
        loseCsat(game, events, 'expired');
      }
    }
    if (game.phase !== 'playing') return events;
  }

  // Outages: a burst of the same kind of ticket.
  const diff = difficultyFor(game.difficulty);
  if (game.t >= game.nextOutage) {
    const outage = pick(game, OUTAGES);
    events.push({ type: 'outage', ...outage });
    for (let i = 0; i < diff.outage.size; i++) game.pending.push({ at: game.t + 400 + i * 700, fix: outage.fix });
    game.nextOutage = game.t + lerp(diff.outage.gapMin, diff.outage.gapMax, rand(game));
  }

  // Fire drill: something is literally on fire. Double points while it burns.
  if (game.t >= game.nextFrenzy) {
    game.frenzyUntil = game.t + 8000;
    events.push({ type: 'frenzy', until: game.frenzyUntil });
    game.pending.push({ at: game.t + 300, fix: null }, { at: game.t + 900, fix: null });
    game.nextFrenzy = game.t + lerp(70_000, 110_000, rand(game));
  }

  game.pending = game.pending.filter((p) => {
    if (p.at > game.t) return true;
    if (game.phase === 'playing') {
      if (p.reopen) spawnReopen(game, events, p.reopen);
      else addTicket(game, events, p.fix);
    }
    return false;
  });

  // Regular arrivals.
  while (game.phase === 'playing' && game.t >= game.nextSpawn) {
    addTicket(game, events, null);
    game.nextSpawn += spawnInterval(game.t, diff) * lerp(0.75, 1.25, rand(game));
  }
  return events;
}

/** The ticket most about to blow up. */
export function mostUrgent(game) {
  let best = null;
  for (const t of game.tickets) {
    if (!best || t.patience - t.age < best.patience - best.age) best = t;
  }
  return best;
}

/**
 * Apply a fix to a ticket (or the most urgent one when ticketId is null).
 * Returns one event: correct, wrong or none.
 */
export function applyFix(game, ticketId, fixId) {
  if (game.phase !== 'playing' || !FIX_IDS.includes(fixId)) return { type: 'none' };
  const ticket = ticketId == null ? mostUrgent(game) : game.tickets.find((t) => t.id === ticketId);
  if (!ticket) return { type: 'none' };

  if (ticket.fix === fixId) {
    const remaining = Math.max(0, 1 - ticket.age / ticket.patience);
    const mult = multiplier(game.streak);
    const frenzy = game.t < game.frenzyUntil;
    const kindMult = ticket.vip ? 2 : ticket.kind === 'spam' ? 1.5 : 1;
    const points = Math.round((100 + 100 * remaining) * mult * kindMult * (frenzy ? 2 : 1) * difficultyFor(game.difficulty).scoreMult);
    game.tickets.splice(game.tickets.indexOf(ticket), 1);
    game.score += points;
    game.streak++;
    game.bestStreak = Math.max(game.bestStreak, game.streak);
    game.closed++;
    if (ticket.vip) game.vipsClosed++;
    if (ticket.kind === 'spam') game.spamClosed++;
    game.minCloseMs = game.minCloseMs === null ? ticket.age : Math.min(game.minCloseMs, ticket.age);
    let charge = false;
    if (game.streak % 10 === 0 && game.charges < 3) {
      game.charges++;
      charge = true;
    }
    // Some users write back: "it's doing it again."
    if (ticket.kind === 'normal' && !ticket.vip && game.t > 40_000 && rand(game) < 0.1) {
      game.pending.push({
        at: game.t + lerp(6000, 10_000, rand(game)),
        reopen: { template: ticket.template, fix: fixId, text: `RE: ${ticket.text}`, from: ticket.from },
      });
    }
    return { type: 'correct', ticket, points, mult, streak: game.streak, charge, frenzy };
  }

  game.wrong++;
  game.streak = 0;
  ticket.hint = true;
  ticket.age = Math.min(ticket.patience - 1, ticket.age + ticket.patience * 0.25);
  return { type: 'wrong', ticket, tried: fixId };
}

export function summary(game) {
  const attempts = game.closed + game.wrong;
  return {
    score: game.score,
    difficulty: game.difficulty,
    difficultyLabel: difficultyFor(game.difficulty).label,
    clock: clock(game.t),
    madeItToFive: game.t >= SHIFT_MS,
    closed: game.closed,
    accuracy: attempts ? Math.round((game.closed / attempts) * 100) : 0,
    bestStreak: game.bestStreak,
    expired: game.expired,
    overflowed: game.overflowed,
    vipsClosed: game.vipsClosed,
    selfFixed: game.selfFixed,
    spamClosed: game.spamClosed,
    reopens: game.reopens,
    minCloseMs: game.minCloseMs,
    inboxZeroNoon: game.inboxZeroNoon,
    overtimeMs: Math.max(0, game.t - SHIFT_MS),
    rank: rankFor(game.score),
  };
}

// --- power-ups -----------------------------------------------------------------

export const POWERS = [
  { id: 'coffee', label: 'Coffee', key: 'q', desc: 'Everything slows down for 5 seconds' },
  { id: 'kb', label: 'Wiki', key: 'w', desc: 'Reveal the fix on every open ticket' },
  { id: 'bot', label: 'Auto-reply', key: 'e', desc: 'Close the most urgent ticket' },
];

/** Spend one charge (earned every 10-ticket streak) on a power-up. */
export function usePower(game, powerId) {
  if (game.phase !== 'playing' || game.charges <= 0) return { type: 'none' };
  if (!POWERS.some((p) => p.id === powerId)) return { type: 'none' };
  if (powerId === 'bot' && !game.tickets.length) return { type: 'none' }; // nothing to close, keep the charge
  game.charges--;
  if (powerId === 'coffee') {
    game.slowUntil = game.t + 5000;
    return { type: 'power', power: 'coffee' };
  }
  if (powerId === 'kb') {
    for (const t of game.tickets) t.hint = true;
    return { type: 'power', power: 'kb' };
  }
  const target = mostUrgent(game);
  return { type: 'power', power: 'bot', closed: applyFix(game, target.id, target.fix) };
}

// --- achievements ---------------------------------------------------------------

export const ACHIEVEMENTS = [
  { id: 'first-close', label: 'Hello, IT', desc: 'Close a ticket', test: (s) => s.closed >= 1 },
  { id: 'five-oclock', label: 'Clocked Out', desc: 'Make it to 5 PM', test: (s) => s.madeItToFive },
  { id: 'monday-survivor', label: 'Monday Survivor', desc: 'Make it to 5 PM on a Monday', test: (s) => s.madeItToFive && s.difficulty === 'monday' },
  { id: 'sharpshooter', label: 'Sharpshooter', desc: 'Close 20+ tickets with 100% accuracy', test: (s) => s.closed >= 20 && s.accuracy === 100 },
  { id: 'inbox-zero', label: 'Inbox Zero at Noon', desc: 'An empty queue at 12:00', test: (s) => s.inboxZeroNoon },
  { id: 'ceo-whisperer', label: 'CEO Whisperer', desc: 'Close 3 VIP tickets in one shift', test: (s) => s.vipsClosed >= 3 },
  { id: 'on-a-roll', label: 'On a Roll', desc: 'A 15-ticket streak', test: (s) => s.bestStreak >= 15 },
  { id: 'spam-hunter', label: 'Spam Hunter', desc: 'Flag 5 junk tickets in one shift', test: (s) => s.spamClosed >= 5 },
  { id: 'night-shift', label: 'Night Shift', desc: 'Work a full hour of overtime', test: (s) => s.overtimeMs >= HOUR_MS },
  { id: 'quick-draw', label: 'Quick Draw', desc: 'Close a ticket within 2 seconds', test: (s) => s.minCloseMs !== null && s.minCloseMs < 2000 },
];

/** Which achievements this shift earned. The caller keeps the lifetime set. */
export function evaluateAchievements(s) {
  return ACHIEVEMENTS.filter((a) => a.test(s)).map((a) => a.id);
}
