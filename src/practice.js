// An untimed learning session. Timed engine rules and state are never advanced here.
import { createGame, FIX_IDS } from './engine.js';
import { REPAIRS, TICKETS, NAMES } from './tickets.js';
import { challengeFor } from './challenges.js';

export function createPractice(seed = 1, difficulty = 'easy', online = true) {
  const profile = challengeFor(difficulty);
  const game = createGame(seed, profile.engine, 'practice', { online });
  game.practiceLevel = profile.id;
  game.practiceRound = 0;
  game.practiceCorrect = 0;
  nextPracticeCase(game);
  return game;
}

export function nextPracticeCase(game) {
  if (game.mode !== 'practice' || game.phase !== 'playing' || game.tickets.length) return false;
  const pool = game.practiceLevel === 'easy' ? [0, 5]
    : game.practiceLevel === 'medium' ? [0, 1, 2, 3, 4, 5, 6, 7]
    : REPAIRS.map((_, index) => index);
  const offset = (game.seed >>> 0) + game.practiceRound++;
  const repair = REPAIRS[pool[offset % pool.length]];
  const base = { age: 0, patience: Infinity, hint: false, vip: false, selfFixAt: null };
  game.tickets.push({ ...base, ...repair, id: game.nextId++, template: -3,
    kind: 'repair', stage: 0, stages: [...repair.stages], fix: repair.stages[0],
    from: NAMES[offset % NAMES.length] });
  if (game.online) {
    const index = offset % TICKETS.length;
    game.tickets.push({ ...base, ...TICKETS[index], id: game.nextId++,
      template: index, kind: 'normal', from: NAMES[(offset + 5) % NAMES.length] });
  }
  return true;
}

export function applyPracticeFix(game, id, fix) {
  if (game.mode !== 'practice' || game.phase !== 'playing' || !FIX_IDS.includes(fix)) return { type: 'none' };
  const ticket = game.tickets.find(t => t.id === id);
  if (!ticket) return { type: 'none' };
  if (ticket.fix !== fix) {
    game.wrong++;
    return { type: 'wrong', ticket, tried: fix, needed: ticket.fix };
  }
  game.practiceCorrect++;
  if (ticket.stages && ticket.stage < ticket.stages.length - 1) {
    ticket.stage++;
    ticket.fix = ticket.stages[ticket.stage];
    return { type: 'progress', ticket, stage: ticket.stage, total: ticket.stages.length };
  }
  game.tickets.splice(game.tickets.indexOf(ticket), 1);
  game.closed++;
  if (ticket.kind === 'repair') game.repairsClosed++;
  return { type: 'correct', ticket, points: 0, streak: 0, charge: false };
}
