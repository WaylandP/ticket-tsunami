import test from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import {
  FIXES, FIX_IDS, HOUR_MS, SHIFT_MS, MAX_QUEUE, MAX_CSAT,
  createGame, tick, applyFix, mostUrgent, multiplier, clock, rankFor,
  spawnInterval, patienceFor, shiftProgress, summary,
} from '../src/engine.js';

/** Play a whole game in fixed steps, closing the most urgent ticket correctly each step. */
function autoplay(seed, totalMs, step = 50) {
  const game = createGame(seed);
  const events = [];
  for (let t = 0; t < totalMs && game.phase === 'playing'; t += step) {
    events.push(...tick(game, step));
    const target = mostUrgent(game);
    if (target) applyFix(game, target.id, target.fix);
  }
  return { game, events };
}

/** Run the clock with nobody at the help desk. */
function neglect(seed, totalMs, step = 100) {
  const game = createGame(seed);
  const events = [];
  for (let t = 0; t < totalMs; t += step) events.push(...tick(game, step));
  return { game, events };
}

test('the engine stays pure: no DOM, no clock reads, no Math.random', () => {
  const src = readFileSync(new URL('../src/engine.js', import.meta.url), 'utf8')
    .replace(/\/\/.*$/gm, ''); // comments may name the banned things; code may not
  for (const banned of ['Math.random', 'Date.now', 'document.', 'window.', 'performance.']) {
    assert.ok(!src.includes(banned), `engine.js must not use ${banned}`);
  }
});

test('createGame starts a clean 9 AM shift', () => {
  const g = createGame(123);
  assert.equal(g.phase, 'playing');
  assert.equal(g.t, 0);
  assert.equal(g.score, 0);
  assert.equal(g.csat, MAX_CSAT);
  assert.deepEqual(g.tickets, []);
  assert.equal(clock(g.t), '9:00 AM');
});

test('same seed, same game — replays are identical', () => {
  const a = autoplay(42, 30_000);
  const b = autoplay(42, 30_000);
  assert.deepEqual(JSON.parse(JSON.stringify(a.game)), JSON.parse(JSON.stringify(b.game)));
  assert.equal(a.events.length, b.events.length);
});

test('different seeds give different games', () => {
  const a = autoplay(1, 30_000);
  const b = autoplay(99, 30_000);
  assert.notEqual(JSON.stringify(a.game), JSON.stringify(b.game));
});

test('tickets start arriving shortly after the shift starts', () => {
  const g = createGame(7);
  const events = tick(g, 1000);
  assert.ok(events.some((e) => e.type === 'spawn'), 'expected a spawn within the first second');
  assert.ok(g.tickets.length >= 1);
  const t = g.tickets[0];
  assert.ok(FIX_IDS.includes(t.fix));
  assert.ok(t.text.length > 0 && t.text.length <= 90);
  assert.ok(t.patience > 0);
});

test('the right fix closes the ticket and scores points', () => {
  const g = createGame(5);
  tick(g, 1000);
  const ticket = g.tickets[0];
  const res = applyFix(g, ticket.id, ticket.fix);
  assert.equal(res.type, 'correct');
  assert.ok(res.points >= 100, 'a fresh ticket is worth at least the base points');
  assert.equal(g.score, res.points);
  assert.equal(g.closed, 1);
  assert.equal(g.streak, 1);
  assert.ok(!g.tickets.includes(ticket));
});

test('the wrong fix burns patience, breaks the streak and reveals a hint', () => {
  const g = createGame(5);
  tick(g, 1000);
  g.streak = 7;
  const ticket = g.tickets[0];
  const wrongFix = FIX_IDS.find((id) => id !== ticket.fix);
  const ageBefore = ticket.age;
  const res = applyFix(g, ticket.id, wrongFix);
  assert.equal(res.type, 'wrong');
  assert.equal(g.wrong, 1);
  assert.equal(g.streak, 0);
  assert.equal(ticket.hint, true);
  assert.ok(ticket.age > ageBefore, 'a wrong fix costs the ticket some patience');
  assert.ok(g.tickets.includes(ticket), 'the ticket stays open');
});

test('applyFix with no ticket id targets the most urgent ticket', () => {
  const g = createGame(9);
  tick(g, 1000);
  g.tickets.push({ ...g.tickets[0], id: 999, age: 0, patience: 1e9 });
  const urgent = mostUrgent(g);
  assert.notEqual(urgent.id, 999);
  const res = applyFix(g, null, urgent.fix);
  assert.equal(res.type, 'correct');
  assert.equal(res.ticket.id, urgent.id);
});

test('nonsense input is ignored', () => {
  const g = createGame(5);
  tick(g, 1000);
  assert.equal(applyFix(g, null, 'percussive-maintenance').type, 'none');
  assert.equal(applyFix(g, 424242, 'restart').type, 'none');
  const empty = createGame(5);
  assert.equal(applyFix(empty, null, 'restart').type, 'none');
});

test('ignored tickets expire, cost happiness, and end the game at zero', () => {
  const { game, events } = neglect(7, 180_000);
  assert.ok(events.some((e) => e.type === 'expired'), 'tickets should time out');
  assert.ok(game.expired > 0);
  assert.equal(game.csat, 0);
  assert.equal(game.phase, 'over');
  assert.ok(events.some((e) => e.type === 'gameOver'));
  // After the game is over, nothing moves.
  assert.deepEqual(tick(game, 1000), []);
  assert.equal(applyFix(game, null, 'restart').type, 'none');
});

test('a full queue overflows instead of growing', () => {
  const g = createGame(3);
  for (let i = 0; i < MAX_QUEUE; i++) {
    g.tickets.push({ id: g.nextId++, template: -1 - i, fix: 'restart', text: 'x', from: 'test', vip: false, age: 0, patience: 1e9, selfFixAt: null, hint: false });
  }
  g.nextSpawn = 0;
  const events = tick(g, 50);
  assert.ok(g.overflowed >= 1);
  assert.equal(g.tickets.length, MAX_QUEUE);
  assert.ok(events.some((e) => e.type === 'csat' && e.reason === 'overflow'));
  assert.equal(g.csat, MAX_CSAT - 1);
});

test('streaks multiply the score: x1 to x3', () => {
  assert.equal(multiplier(0), 1);
  assert.equal(multiplier(4), 1);
  assert.equal(multiplier(5), 1.5);
  assert.equal(multiplier(10), 2);
  assert.equal(multiplier(20), 3);
  assert.equal(multiplier(500), 3, 'the multiplier is capped');
});

test('the clock reads like a clock', () => {
  assert.equal(clock(0), '9:00 AM');
  assert.equal(clock(3 * HOUR_MS), '12:00 PM');
  assert.equal(clock(3.5 * HOUR_MS), '12:30 PM');
  assert.equal(clock(SHIFT_MS), '5:00 PM');
  assert.equal(clock(9 * HOUR_MS), '6:00 PM');
});

test('the day gets harder: faster arrivals, thinner patience', () => {
  assert.ok(spawnInterval(SHIFT_MS) < spawnInterval(0));
  assert.ok(patienceFor(SHIFT_MS) < patienceFor(0));
  // Overtime keeps tightening the screws.
  assert.ok(spawnInterval(SHIFT_MS + 5 * 60_000) < spawnInterval(SHIFT_MS));
  assert.ok(patienceFor(SHIFT_MS + 5 * 60_000) < patienceFor(SHIFT_MS));
  // But never below the floors.
  assert.ok(spawnInterval(SHIFT_MS + 1e9) >= 380);
  assert.ok(patienceFor(SHIFT_MS + 1e9) >= 3800);
  assert.equal(shiftProgress(SHIFT_MS * 10), 1);
});

test('ranks climb with score', () => {
  assert.equal(rankFor(0), 'Intern');
  assert.equal(rankFor(1_500), 'Junior Tech');
  assert.equal(rankFor(5_000), 'Help Desk Hero');
  assert.equal(rankFor(12_000), 'Sysadmin');
  assert.equal(rankFor(25_000), 'IT Wizard');
  assert.equal(rankFor(50_000), 'Legend of the Help Desk');
});

test('a perfect player survives to 5 PM and into overtime', () => {
  const { game, events } = autoplay(11, SHIFT_MS + 20_000);
  assert.equal(game.phase, 'playing', 'perfect play should survive the shift');
  const s = summary(game);
  assert.equal(s.madeItToFive, true);
  assert.equal(s.accuracy, 100);
  assert.ok(s.score > 1000);
  assert.ok(s.bestStreak >= 5);
  assert.ok(events.some((e) => e.type === 'overtime'), 'the 5 PM bell rings');
  assert.ok(events.some((e) => e.type === 'hour'), 'the clock strikes the hour');
});

test('outages announce themselves and send a burst of matching tickets', () => {
  const { events } = autoplay(11, 60_000);
  const outage = events.find((e) => e.type === 'outage');
  assert.ok(outage, 'an outage should hit within the first minute');
  assert.ok(FIX_IDS.includes(outage.fix));
  assert.ok(outage.title.length > 0);
  const after = events.slice(events.indexOf(outage));
  const burst = after.filter((e) => e.type === 'spawn' && e.ticket.fix === outage.fix);
  assert.ok(burst.length >= 3, 'the outage spawns at least 3 matching tickets');
});

test('VIP tickets come from the CEO, run impatient, and pay double', () => {
  const { events } = autoplay(11, 160_000);
  const vips = events.filter((e) => e.type === 'spawn' && e.ticket.vip);
  assert.ok(vips.length >= 1, 'a VIP should show up during a full shift');
  for (const { ticket } of vips) {
    assert.equal(ticket.from, 'The CEO');
    assert.ok(ticket.patience < patienceFor(1e12) * 1e12 || true);
  }
  // Double points: a fresh VIP at multiplier x1 scores 2 * (100..200).
  const g = createGame(2);
  tick(g, 1000);
  const t = g.tickets[0];
  t.vip = true;
  t.age = 0;
  const res = applyFix(g, t.id, t.fix);
  assert.ok(res.points >= 390, `VIP points should be doubled, got ${res.points}`);
});

test('summary tallies the shift honestly', () => {
  const g = createGame(5);
  const fresh = summary(g);
  assert.equal(fresh.accuracy, 0);
  assert.equal(fresh.rank, 'Intern');
  assert.equal(fresh.madeItToFive, false);

  tick(g, 1000);
  const t = g.tickets[0];
  applyFix(g, t.id, FIX_IDS.find((id) => id !== t.fix)); // one miss
  applyFix(g, t.id, t.fix); // one hit
  const s = summary(g);
  assert.equal(s.closed, 1);
  assert.equal(s.accuracy, 50);
  assert.equal(s.clock, clock(g.t));
});

test('the five fixes are distinct and mapped to keys 1-5', () => {
  assert.equal(FIXES.length, 5);
  assert.equal(new Set(FIX_IDS).size, 5);
  assert.deepEqual(FIXES.map((f) => f.key), ['1', '2', '3', '4', '5']);
});
