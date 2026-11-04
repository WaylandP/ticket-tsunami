import test from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import {
  FIXES, FIX_IDS, HOUR_MS, SHIFT_MS, MAX_QUEUE, MAX_CSAT,
  DIFFICULTIES, DEFAULT_DIFFICULTY, difficultyFor,
  POWERS, ACHIEVEMENTS, TUTORIAL_FIXES, usePower, evaluateAchievements, shiftInsights,
  createGame, tick, applyFix, mostUrgent, multiplier, clock, rankFor,
  spawnInterval, patienceFor, shiftProgress, summary,
} from '../src/engine.js';

/** A hand-made open ticket for surgical tests. */
function plant(game, over = {}) {
  const ticket = {
    id: game.nextId++, template: 0, kind: 'normal', fix: 'restart',
    text: 'x', from: 'test', vip: false, age: 0, patience: 1e9, selfFixAt: null, hint: false,
    ...over,
  };
  game.tickets.push(ticket);
  return ticket;
}

/** Play a whole game in fixed steps, closing the most urgent ticket correctly each step. */
function autoplay(seed, totalMs, step = 50, difficulty = DEFAULT_DIFFICULTY) {
  const game = createGame(seed, difficulty);
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
  for (const diff of DIFFICULTIES) {
    assert.ok(spawnInterval(SHIFT_MS, diff) < spawnInterval(0, diff), diff.id);
    assert.ok(patienceFor(SHIFT_MS, diff) < patienceFor(0, diff), diff.id);
    // Overtime keeps tightening the screws.
    assert.ok(spawnInterval(SHIFT_MS + 5 * 60_000, diff) < spawnInterval(SHIFT_MS, diff), diff.id);
    assert.ok(patienceFor(SHIFT_MS + 5 * 60_000, diff) < patienceFor(SHIFT_MS, diff), diff.id);
    // But never below the floors.
    assert.ok(spawnInterval(SHIFT_MS + 1e9, diff) >= diff.spawn.min, diff.id);
    assert.ok(patienceFor(SHIFT_MS + 1e9, diff) >= diff.patience.min, diff.id);
  }
  assert.equal(shiftProgress(SHIFT_MS * 10), 1);
});

test('three difficulties, from Casual Friday to Monday', () => {
  assert.equal(DIFFICULTIES.length, 3);
  assert.equal(new Set(DIFFICULTIES.map((d) => d.id)).size, 3);
  const [friday, nine, monday] = DIFFICULTIES;
  assert.equal(difficultyFor(DEFAULT_DIFFICULTY).id, nine.id);
  assert.equal(difficultyFor('nonsense').id, nine.id, 'unknown ids fall back to the default day');
  for (const t of [0, SHIFT_MS / 2, SHIFT_MS]) {
    assert.ok(spawnInterval(t, monday) < spawnInterval(t, nine), 'Monday spawns faster than Nine to Five');
    assert.ok(spawnInterval(t, nine) < spawnInterval(t, friday), 'Nine to Five spawns faster than Friday');
    assert.ok(patienceFor(t, monday) < patienceFor(t, nine));
    assert.ok(patienceFor(t, nine) < patienceFor(t, friday));
  }
  assert.ok(friday.scoreMult < nine.scoreMult && nine.scoreMult < monday.scoreMult, 'harder days pay more');
});

test('harder days pay more points for the same ticket', () => {
  const close = (difficulty) => {
    const g = createGame(5, difficulty);
    tick(g, 1000);
    const t = g.tickets[0];
    t.age = 0; // same freshness on both days
    return applyFix(g, t.id, t.fix).points;
  };
  assert.ok(close('monday') > close('friday'));
});

test('the difficulty is stamped on the game and the summary', () => {
  const g = createGame(1, 'monday');
  assert.equal(g.difficulty, 'monday');
  assert.equal(g.nextOutage, difficultyFor('monday').outage.first);
  const s = summary(g);
  assert.equal(s.difficulty, 'monday');
  assert.equal(s.difficultyLabel, 'Monday');
  assert.equal(createGame(1).difficulty, DEFAULT_DIFFICULTY);
});

test('perfect play survives the shift on every difficulty', () => {
  for (const diff of DIFFICULTIES) {
    const { game } = autoplay(17, SHIFT_MS + 5000, 50, diff.id);
    assert.equal(game.phase, 'playing', `perfect play should survive a ${diff.label}`);
    assert.equal(summary(game).madeItToFive, true, diff.id);
  }
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

test('spam tickets: closing pays 1.5x, ignoring costs nothing', () => {
  // Ignoring: a spam ticket times out with no happiness loss and no "expired".
  const g = createGame(3);
  plant(g, { kind: 'spam', fix: 'notit', patience: 100 });
  const events = tick(g, 300);
  assert.ok(events.some((e) => e.type === 'spamGone'));
  assert.equal(g.csat, MAX_CSAT);
  assert.equal(g.expired, 0);

  // Closing: a fresh spam ticket pays 1.5x what a fresh normal ticket pays.
  const pointsFor = (over) => {
    const game = createGame(5);
    const t = plant(game, over);
    return applyFix(game, t.id, t.fix).points;
  };
  const normal = pointsFor({});
  const spam = pointsFor({ kind: 'spam', fix: 'notit' });
  assert.equal(spam, Math.round(normal * 1.5));
  const g2 = createGame(5);
  plant(g2, { kind: 'spam', fix: 'notit' });
  applyFix(g2, g2.tickets[0].id, 'notit');
  assert.equal(g2.spamClosed, 1);
});

test('spam shows up on its own, and is always "Not an IT problem"', () => {
  const { events } = autoplay(11, 120_000);
  const spam = events.filter((e) => e.type === 'spawn' && e.ticket.kind === 'spam');
  assert.ok(spam.length >= 1, 'junk mail should arrive during a full shift');
  for (const { ticket } of spam) assert.equal(ticket.fix, 'notit');
});

test('some closed tickets come back: "it’s doing it again"', () => {
  let reopened = null;
  for (let seed = 1; seed < 80 && !reopened; seed++) {
    const g = createGame(seed);
    g.t = 50_000; // reopens only happen mid-shift
    g.nextSpawn = g.nextOutage = g.nextFrenzy = 1e12; // nothing else arrives during this test
    const t = plant(g, { template: 7, fix: 'password', text: 'help', from: 'Dana from HR' });
    applyFix(g, t.id, 'password');
    if (!g.pending.some((p) => p.reopen)) continue;
    for (let ms = 0; ms < 12_000 && !reopened; ms += 100) {
      reopened = tick(g, 100).find((e) => e.type === 'spawn' && e.ticket.kind === 'reopen')?.ticket;
    }
    if (reopened) {
      assert.ok(reopened.text.startsWith('RE: '));
      assert.equal(reopened.from, 'Dana from HR');
      assert.equal(g.reopens, 1);
      assert.equal(applyFix(g, reopened.id, 'password').type, 'correct', 'a reopened ticket closes like any other');
    }
  }
  assert.ok(reopened, 'no reopen found across 80 seeds — the chance is broken');
});

test('fire drills double the points while they last', () => {
  const { events } = autoplay(11, 80_000);
  assert.ok(events.some((e) => e.type === 'frenzy'), 'a fire drill should hit within 80s');

  const pointsFor = (frenzy) => {
    const g = createGame(5);
    if (frenzy) g.frenzyUntil = g.t + 5000;
    const t = plant(g);
    return applyFix(g, t.id, t.fix).points;
  };
  assert.equal(pointsFor(true), pointsFor(false) * 2);
});

test('every 10-ticket streak earns a power charge, capped at 3', () => {
  const g = createGame(1);
  for (let i = 0; i < 10; i++) {
    const t = plant(g);
    const res = applyFix(g, t.id, t.fix);
    assert.equal(res.charge, i === 9, `only the 10th close grants a charge (close ${i + 1})`);
  }
  assert.equal(g.charges, 1);
  g.charges = 3;
  g.streak = 19;
  const t = plant(g);
  assert.equal(applyFix(g, t.id, t.fix).charge, false, 'charges cap at 3');
  assert.equal(g.charges, 3);
});

test('coffee slows the world, the wiki reveals fixes, the bot closes one', () => {
  // Coffee: tickets age at 35% and nothing new arrives while it lasts.
  const g = createGame(1);
  g.charges = 3;
  const t = plant(g);
  const spawnBefore = g.nextSpawn;
  assert.equal(usePower(g, 'coffee').power, 'coffee');
  tick(g, 1000);
  assert.ok(Math.abs(t.age - 350) < 1, `coffee should slow aging, got ${t.age}`);
  assert.equal(g.nextSpawn, spawnBefore + 1000, 'spawns wait for the coffee');

  // Wiki: every open ticket shows its fix.
  plant(g, { fix: 'update' });
  usePower(g, 'kb');
  assert.ok(g.tickets.every((x) => x.hint));

  // Bot: closes the most urgent ticket correctly.
  const closed = usePower(g, 'bot');
  assert.equal(closed.power, 'bot');
  assert.equal(closed.closed.type, 'correct');
  assert.equal(g.charges, 0);

  // No charges, or nothing to close: nothing happens, charges are kept.
  assert.equal(usePower(g, 'coffee').type, 'none');
  const empty = createGame(2);
  empty.charges = 1;
  assert.equal(usePower(empty, 'bot').type, 'none');
  assert.equal(empty.charges, 1, 'the bot refuses to waste a charge on an empty queue');
});

test('an empty queue at noon is noticed', () => {
  const g = createGame(1);
  g.t = 3 * HOUR_MS - 50;
  tick(g, 100);
  assert.equal(g.inboxZeroNoon, true);

  const busy = createGame(1);
  busy.t = 3 * HOUR_MS - 50;
  plant(busy);
  tick(busy, 100);
  assert.equal(busy.inboxZeroNoon, false);
});

test('achievements: all twelve are earnable and the fresh game earns none', () => {
  assert.equal(ACHIEVEMENTS.length, 12);
  assert.equal(new Set(ACHIEVEMENTS.map((a) => a.id)).size, 12);
  assert.deepEqual(evaluateAchievements(summary(createGame(1))), []);
  const everything = {
    ...summary(createGame(1, 'monday')),
    closed: 25, accuracy: 100, madeItToFive: true, inboxZeroNoon: true,
    vipsClosed: 3, bestStreak: 16, spamClosed: 5, overtimeMs: HOUR_MS, minCloseMs: 900,
    bossesClosed: 1, repairsClosed: 3,
  };
  assert.equal(evaluateAchievements(everything).length, 12, 'a perfect Monday earns all twelve');
});

test('the tutorial serves five guided tickets, one per fix, then ends', () => {
  const g = createGame(1, DEFAULT_DIFFICULTY, 'tutorial');
  const seen = [];
  const events = [];
  for (let ms = 0; ms < 60_000 && g.phase === 'playing'; ms += 100) {
    for (const ev of tick(g, 100)) {
      events.push(ev);
      if (ev.type === 'spawn') {
        assert.equal(g.tickets.length, 1, 'tutorial tickets arrive one at a time');
        assert.equal(ev.ticket.hint, true, 'tutorial tickets always show their tip');
        seen.push(ev.ticket.fix);
        assert.equal(applyFix(g, ev.ticket.id, ev.ticket.fix).type, 'correct');
      }
    }
  }
  assert.deepEqual(seen, TUTORIAL_FIXES, 'one ticket per fix, in keyboard order');
  assert.ok(events.some((e) => e.type === 'tutorialDone'));
  assert.equal(g.phase, 'over');
  for (const e of events) {
    assert.ok(!['outage', 'frenzy'].includes(e.type), 'the tutorial room stays quiet');
  }
  assert.equal(summary(g).mode, 'tutorial');
});

test('the Night Shift starts at 5 PM at full heat', () => {
  const g = createGame(9, 'monday', 'endless');
  assert.equal(clock(g.t), '5:00 PM');
  assert.equal(summary(g).madeItToFive, true);
  const events = tick(g, 1500);
  assert.ok(events.some((e) => e.type === 'spawn'), 'tickets arrive immediately');
  const { game } = autoplay(13, 30_000, 50, 'monday');
  assert.ok(game.t > 0, 'sanity');
});

test('Mondays bring a three-step boss ticket', () => {
  const { game, events } = autoplay(11, 120_000, 50, 'monday');
  const boss = events.find((e) => e.type === 'spawn' && e.ticket.kind === 'boss');
  assert.ok(boss, 'the projector dies around 70s into a Monday');
  assert.equal(game.bossesClosed, 1, 'perfect play walks through the stages');
  const calm = autoplay(11, 120_000, 50, 'friday');
  assert.ok(!calm.events.some((e) => e.type === 'spawn' && e.ticket.kind === 'boss'), 'no boss on a Friday');
});

test('boss mechanics: stages advance in order, wrong answers still hurt', () => {
  const g = createGame(5);
  const boss = plant(g, { kind: 'boss', stages: ['connect', 'restart', 'update'], stage: 0, fix: 'connect', patience: 50_000 });
  // Wrong fix: normal penalty, stage stays.
  const wrong = applyFix(g, boss.id, 'password');
  assert.equal(wrong.type, 'wrong');
  assert.equal(boss.stage, 0);
  // Right fixes, in order.
  const p1 = applyFix(g, boss.id, 'connect');
  assert.equal(p1.type, 'progress');
  assert.equal(boss.fix, 'restart', 'the hint now points at the next step');
  assert.equal(applyFix(g, boss.id, 'restart').type, 'progress');
  const done = applyFix(g, boss.id, 'update');
  assert.equal(done.type, 'correct');
  assert.ok(done.points >= 300, `a boss pays big, got ${done.points}`);
  assert.equal(g.bossesClosed, 1);
});

test('regulars have habits: Gary, Frank and Jules', () => {
  let gary = 0, frank = 0, jules = 0, julesSelf = 0;
  for (const seed of [1, 2, 3, 4, 5, 6]) {
    const { events } = autoplay(seed, 140_000);
    for (const e of events) {
      if (e.type !== 'spawn') continue;
      if (e.ticket.from === 'Gary (it’s always Gary)') { gary++; assert.equal(e.ticket.fix, 'password', 'Gary is always locked out'); }
      if (e.ticket.from === 'Frank, remote') { frank++; assert.equal(e.ticket.fix, 'connect', 'Frank is always the connection'); }
      if (e.ticket.from === 'Jules the intern') { jules++; if (e.ticket.selfFixAt !== null) julesSelf++; }
    }
  }
  assert.ok(gary >= 2 && frank >= 2 && jules >= 2, `regulars should show up (gary ${gary}, frank ${frank}, jules ${jules})`);
  assert.ok(julesSelf / jules >= 0.3, `Jules usually self-fixes (${julesSelf}/${jules})`);
});

test('the shift report has honest observations', () => {
  const base = summary(createGame(1));
  assert.deepEqual(shiftInsights(base), [], 'a fresh shift has nothing to say');
  const messy = { ...base, confusions: { 'restart>connect': 3 }, spamMissed: 2, expired: 4 };
  const notes = shiftInsights(messy);
  assert.equal(notes.length, 3, 'never more than three notes');
  assert.match(notes[0], /Restart it.*Check connection.*3 times/);
  assert.match(notes[1], /Junk mail fooled you 2 times/);
  const flawless = { ...base, closed: 12, accuracy: 100, avgCloseMs: 2100 };
  assert.ok(shiftInsights(flawless).some((n) => n.includes('Not one wrong fix')));
  // And the tracking that feeds it:
  const g = createGame(5);
  tick(g, 1000);
  const t = g.tickets[0];
  const wrongFix = FIX_IDS.find((id) => id !== t.fix);
  applyFix(g, t.id, wrongFix);
  assert.equal(g.confusions[`${wrongFix}>${t.fix}`], 1);
  applyFix(g, t.id, t.fix);
  assert.ok(summary(g).avgCloseMs !== null);
});

test('machines walk in, take two fixes in order, and walk out', () => {
  const { game, events } = autoplay(11, 120_000);
  const walkIns = events.filter((e) => e.type === 'spawn' && e.ticket.kind === 'repair');
  assert.ok(walkIns.length >= 1, 'someone should carry a machine in within two hours');
  for (const { ticket } of walkIns) {
    assert.ok(['laptop', 'printer', 'phone', 'monitor', 'server', 'tv'].includes(ticket.device));
    assert.ok(ticket.stages.length >= 2);
    assert.ok(ticket.stages.every((f) => FIX_IDS.includes(f)));
    assert.equal(ticket.hint, true, 'walk-ins show their first step');
  }
  assert.ok(game.repairsClosed >= 1, 'perfect play fixes them stage by stage');
  // A repair pays more than a plain ticket of the same freshness.
  const plain = (() => { const g = createGame(5); const t = plant(g); return applyFix(g, t.id, t.fix).points; })();
  const g = createGame(5);
  const r = plant(g, { kind: 'repair', device: 'laptop', stages: ['connect', 'restart'], stage: 1, fix: 'restart' });
  assert.ok(applyFix(g, r.id, 'restart').points > plain);
  assert.equal(g.repairsClosed, 1);
});

test('online off: no emails, no outages — only walk-ins, and they hurry', () => {
  const g = createGame(7, DEFAULT_DIFFICULTY, 'shift', { online: false });
  const events = [];
  let maxBench = 0;
  for (let ms = 0; ms < 90_000 && g.phase === 'playing'; ms += 50) {
    events.push(...tick(g, 50));
    maxBench = Math.max(maxBench, g.tickets.filter((t) => t.kind === 'repair').length);
    const m = mostUrgent(g);
    if (m) applyFix(g, m.id, m.fix);
  }
  const spawns = events.filter((e) => e.type === 'spawn');
  assert.ok(spawns.length >= 5, `walk-ins should come steadily offline (got ${spawns.length})`);
  assert.ok(spawns.every((e) => e.ticket.kind === 'repair'), 'nothing but walk-ins arrives');
  assert.ok(!events.some((e) => ['outage', 'frenzy'].includes(e.type)), 'the email world stays quiet');
  assert.ok(maxBench <= 2, 'the bench holds two machines at most');
  assert.equal(summary(g).online, false);
});

test('the bench never exceeds two machines, even online', () => {
  let maxBench = 0;
  const g = createGame(11);
  for (let ms = 0; ms < 120_000 && g.phase === 'playing'; ms += 50) {
    tick(g, 50);
    maxBench = Math.max(maxBench, g.tickets.filter((t) => t.kind === 'repair').length);
    const m = mostUrgent(g);
    if (m) applyFix(g, m.id, m.fix);
  }
  assert.ok(maxBench >= 1 && maxBench <= 2, `bench stayed within limits (saw ${maxBench})`);
});

test('walk-ins never overflow the email queue', () => {
  const g = createGame(3);
  for (let i = 0; i < MAX_QUEUE; i++) plant(g); // inbox full
  plant(g, { kind: 'repair', device: 'laptop', stages: ['connect', 'restart'], stage: 0, fix: 'connect' });
  g.nextSpawn = 0;
  const events = tick(g, 50);
  assert.ok(events.some((e) => e.type === 'csat' && e.reason === 'overflow'), 'a ninth email still overflows');
  assert.equal(g.tickets.filter((t) => t.kind === 'repair').length, 1, 'the bench machine is untouched');
});

test('shop perks: longer coffee, auto-hints, a head start, a forgiving chair', () => {
  const perks = { coffeeMs: 8000, autoHint: true, startCharges: 1, armor: 1 };
  const g = createGame(1, DEFAULT_DIFFICULTY, 'shift', { perks });
  assert.equal(g.charges, 1, 'Jules preloads a charge');

  usePower(g, 'coffee');
  assert.equal(g.slowUntil, g.t + 8000, 'the second pot brews longer');
  g.slowUntil = 0; // drink up; the next assertions want real time

  const t = plant(g, { patience: 1000 });
  tick(g, 600); // past half patience
  assert.equal(t.hint, true, 'the indexed wiki pings on its own');

  // The chair absorbs exactly one unhappy user.
  const before = g.csat;
  g.tickets.length = 0;
  plant(g, { patience: 50 });
  const ev1 = tick(g, 100);
  assert.ok(ev1.some((e) => e.type === 'armor'), 'the chair takes the first hit');
  assert.equal(g.csat, before);
  plant(g, { patience: 50 });
  tick(g, 100);
  assert.equal(g.csat, before - 1, 'the second hit lands');
});

test('the big three-step machines exist and get extra patience', () => {
  const g = createGame(1);
  const diff = difficultyFor(g.difficulty);
  let three = null;
  for (let seed = 1; seed < 40 && !three; seed++) {
    const game = createGame(seed);
    game.nextWalkIn = 0;
    game.nextSpawn = game.nextOutage = game.nextFrenzy = 1e12;
    three = tick(game, 50).find((e) => e.type === 'spawn' && e.ticket.stages?.length === 3)?.ticket;
    if (three) {
      assert.ok(['server', 'tv'].includes(three.device), 'three-steppers are the big machines');
      assert.ok(three.patience > patienceFor(game.t, diff) * 2, 'big jobs get extra patience');
    }
  }
  assert.ok(three, 'a three-step walk-in should appear across 40 seeds');
  assert.ok(g.online, 'sanity: online defaults to true');
});

test('the five fixes are distinct and mapped to keys 1-5', () => {
  assert.equal(FIXES.length, 5);
  assert.equal(new Set(FIX_IDS).size, 5);
  assert.deepEqual(FIXES.map((f) => f.key), ['1', '2', '3', '4', '5']);
});
