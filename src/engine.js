// The whole game, minus the screen. No DOM, no Date.now(), no Math.random():
// time comes in through tick(dt) and randomness from a seeded generator,
// so a game can be replayed exactly and tested in Node.

import { TICKETS, NAMES } from './tickets.js';

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

export function spawnInterval(t) {
  return Math.max(380, lerp(3200, 1050, shiftProgress(t)) / (1 + 0.6 * overtime(t)));
}

export function patienceFor(t) {
  return Math.max(3800, lerp(15_000, 8500, shiftProgress(t)) / (1 + 0.35 * overtime(t)));
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

export function createGame(seed = 1) {
  return {
    seed,
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
    tickets: [],
    nextId: 1,
    nextSpawn: 900,
    nextOutage: 50_000,
    pending: [], // scheduled spawns from outages: { at, fix }
    lastTemplate: -1,
  };
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

  const vip = game.t > 30_000 && !fix && rand(game) < 0.08;
  const patience = patienceFor(game.t) * (vip ? 0.7 : 1);
  // Now and then a user fixes it themselves before you get there.
  const selfFixAt = !vip && game.t > 20_000 && rand(game) < 0.06 ? patience * lerp(0.35, 0.6, rand(game)) : null;

  return {
    id: game.nextId++,
    template: index,
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
  const ticket = makeTicket(game, fix);
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

  if (before < SHIFT_MS && game.t >= SHIFT_MS) events.push({ type: 'overtime' });
  if (Math.floor(before / HOUR_MS) !== Math.floor(game.t / HOUR_MS)) events.push({ type: 'hour', clock: clock(game.t) });

  // Age tickets; expire or self-fix.
  for (const ticket of [...game.tickets]) {
    ticket.age += dt;
    if (ticket.selfFixAt !== null && ticket.age >= ticket.selfFixAt) {
      game.tickets.splice(game.tickets.indexOf(ticket), 1);
      game.selfFixed++;
      events.push({ type: 'selfFixed', ticket });
    } else if (ticket.age >= ticket.patience) {
      game.tickets.splice(game.tickets.indexOf(ticket), 1);
      game.expired++;
      events.push({ type: 'expired', ticket });
      loseCsat(game, events, 'expired');
    }
    if (game.phase !== 'playing') return events;
  }

  // Outages: a burst of the same kind of ticket.
  if (game.t >= game.nextOutage) {
    const outage = pick(game, OUTAGES);
    events.push({ type: 'outage', ...outage });
    for (let i = 0; i < 3; i++) game.pending.push({ at: game.t + 400 + i * 700, fix: outage.fix });
    game.nextOutage = game.t + lerp(38_000, 55_000, rand(game));
  }
  game.pending = game.pending.filter((p) => {
    if (p.at > game.t) return true;
    if (game.phase === 'playing') addTicket(game, events, p.fix);
    return false;
  });

  // Regular arrivals.
  while (game.phase === 'playing' && game.t >= game.nextSpawn) {
    addTicket(game, events, null);
    game.nextSpawn += spawnInterval(game.t) * lerp(0.75, 1.25, rand(game));
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
    const points = Math.round((100 + 100 * remaining) * mult * (ticket.vip ? 2 : 1));
    game.tickets.splice(game.tickets.indexOf(ticket), 1);
    game.score += points;
    game.streak++;
    game.bestStreak = Math.max(game.bestStreak, game.streak);
    game.closed++;
    if (ticket.vip) game.vipsClosed++;
    return { type: 'correct', ticket, points, mult, streak: game.streak };
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
    clock: clock(game.t),
    madeItToFive: game.t >= SHIFT_MS,
    closed: game.closed,
    accuracy: attempts ? Math.round((game.closed / attempts) * 100) : 0,
    bestStreak: game.bestStreak,
    expired: game.expired,
    overflowed: game.overflowed,
    vipsClosed: game.vipsClosed,
    selfFixed: game.selfFixed,
    rank: rankFor(game.score),
  };
}
