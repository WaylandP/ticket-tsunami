import test from 'node:test';
import assert from 'node:assert/strict';
import { CHALLENGES, challengeFor, challengeBestKey, evidenceFor } from '../src/challenges.js';
import { createGame } from '../src/engine.js';
import { REPAIRS } from '../src/tickets.js';
import { inspectionFor } from '../src/inspection.js';

test('four diagnosis levels use supported engine presets without changing their rules', () => {
  assert.deepEqual(CHALLENGES.map(p => p.label), ['Easy', 'Medium', 'Hard', 'Extreme']);
  assert.equal(new Set(CHALLENGES.map(({ guided, hints, choices, raw }) => JSON.stringify({ guided, hints, choices, raw }))).size, 4);
  for (const profile of CHALLENGES) assert.equal(createGame(123, profile.engine).difficulty, profile.engine);
  assert.equal(challengeFor('hard').engine, challengeFor('extreme').engine);
});

test('old difficulty preferences and best scores survive; Extreme has a separate record', () => {
  for (const [oldId, newId] of [['friday', 'easy'], ['nineToFive', 'medium'], ['monday', 'hard']]) {
    assert.equal(challengeFor(oldId).id, newId);
    assert.equal(challengeBestKey(newId), oldId);
    assert.equal(challengeBestKey(newId, true), 'endless:' + oldId);
  }
  assert.equal(challengeFor(null).id, 'easy');
  assert.equal(challengeFor('bad saved value').id, 'easy');
  assert.notEqual(challengeBestKey('hard'), challengeBestKey('extreme'));
  assert.notEqual(challengeBestKey('hard', true), challengeBestKey('extreme', true));
});

test('Extreme supplies technical evidence for every case and stage, with no mutation', () => {
  for (const repair of REPAIRS) for (let stage = 0; stage < repair.stages.length; stage++) {
    const model = inspectionFor({ ...repair, stage });
    const before = structuredClone(model);
    for (const zone of model.zones) {
      const raw = evidenceFor(model, zone, challengeFor('extreme'));
      assert.ok(raw.detail.length > 20);
      assert.equal(raw.title, 'Component telemetry');
      assert.notEqual(raw.detail, zone.detail);
      assert.doesNotMatch(raw.detail, /undefined|NaN/);
      assert.equal(evidenceFor(model, zone, challengeFor('easy')).detail, zone.detail);
    }
    assert.deepEqual(model, before);
  }
});
