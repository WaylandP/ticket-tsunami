import test from 'node:test';
import assert from 'node:assert/strict';
import { createPractice, applyPracticeFix, nextPracticeCase } from '../src/practice.js';
import { REPAIRS, TICKETS } from '../src/tickets.js';
import { inspectionFor } from '../src/inspection.js';

test('practice has bounded arrivals, infinite patience and no score pressure', () => {
  const g = createPractice(42, 'extreme', true);
  assert.equal(g.mode, 'practice');
  assert.equal(g.tickets.length, 2);
  assert.equal(g.t, 0);
  assert.equal(g.score, 0);
  for (const t of g.tickets) { assert.equal(t.patience, Infinity); assert.equal(t.age, 0); assert.equal(t.selfFixAt, null); }
  assert.equal(nextPracticeCase(g), false, 'unfinished cases cannot be skipped by adding a queue');
  assert.equal(createPractice(42, 'easy', false).tickets.length, 1);
});

test('wrong practice answers do not consume patience, lives, or advance the case', () => {
  const g = createPractice(1, 'easy', false), t = g.tickets[0];
  const original = structuredClone(t);
  for (let i = 0; i < 100; i++) assert.equal(applyPracticeFix(g, t.id, 'notit').type, 'wrong');
  assert.deepEqual(t, original);
  assert.equal(g.csat, 5);
  assert.equal(g.phase, 'playing');
  assert.equal(g.score, 0);
  assert.equal(g.wrong, 100);
});

test('practice uses the same authored repair sequence and advances only on request', () => {
  const g = createPractice(3, 'hard', false), ticket = g.tickets[0];
  const stages = [...ticket.stages];
  for (let i = 0; i < stages.length; i++) {
    const result = applyPracticeFix(g, ticket.id, stages[i]);
    assert.equal(result.type, i === stages.length - 1 ? 'correct' : 'progress');
  }
  assert.equal(g.practiceCorrect, stages.length);
  assert.equal(g.closed, 1);
  assert.equal(g.tickets.length, 0);
  assert.equal(g.t, 0);
  assert.equal(g.score, 0);
  assert.equal(nextPracticeCase(g), true);
  assert.ok(g.tickets[0].id > ticket.id);
  g.phase = 'over';
  assert.equal(applyPracticeFix(g, g.tickets[0].id, g.tickets[0].fix).type, 'none');
});

test('practice difficulty selects a progressive case pool with all six devices at high levels', () => {
  for (const level of ['easy', 'medium', 'hard', 'extreme']) {
    const g = createPractice(0, level, false), devices = new Set();
    for (let round = 0; round < REPAIRS.length; round++) {
      const t = g.tickets[0];
      devices.add(t.device);
      if (level === 'easy' || level === 'medium') assert.equal(t.stages.length, 2);
      while (g.tickets.length) applyPracticeFix(g, t.id, t.fix);
      nextPracticeCase(g);
    }
    if (level === 'easy') assert.equal(devices.size, 2);
    if (level === 'hard' || level === 'extreme') assert.equal(devices.size, 6);
  }
});

test('audited cases distinguish access recovery, physical faults, and verified updates', () => {
  for (const t of TICKETS) {
    assert.ok(t.text.length <= 90);
    if (t.fix === 'password') assert.match(t.text, /identity verified|identity is verified|identity checks passed/i);
    if (t.fix === 'update') assert.match(t.text, /approved|verified/i);
  }
  assert.match(TICKETS.find(t => t.text.includes('login code device')).text, /MFA recovery/);
  for (const r of REPAIRS) {
    assert.doesNotMatch(r.text, /smells|grinding|ate 40|upside down|expired mid-backup/i);
    for (let stage = 0; stage < r.stages.length; stage++) {
      const model = inspectionFor({ ...r, stage });
      assert.equal(model.zones.find(z => z.finding).fix, r.stages[stage]);
    }
  }
});
