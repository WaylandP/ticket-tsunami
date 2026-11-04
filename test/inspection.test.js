import test from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import { REPAIRS } from '../src/tickets.js';
import { inspectionFor } from '../src/inspection.js';
import { inspectionDeviceSVG, homeHeroSVG, personSVG } from '../src/icons.js';

test('every existing repair stage has matching, read-only physical evidence', () => {
  for (const repair of REPAIRS) {
    for (let stage = 0; stage < repair.stages.length; stage++) {
      const ticket = { ...repair, stage };
      const original = structuredClone(ticket);
      const model = inspectionFor(ticket);
      assert.ok(model, repair.text + ' stage ' + stage);
      assert.equal(model.zones.filter(zone => zone.finding).length, 1);
      assert.equal(model.zones.find(zone => zone.finding).fix, repair.stages[stage]);
      assert.deepEqual(ticket, original);
      assert.equal(new Set(model.zones.map(zone => zone.id)).size, 4);
    }
  }
});

test('unknown content does not acquire an invented diagnosis', () => {
  assert.equal(inspectionFor({ device:'laptop', text:'A new case', stage:0 }), null);
  assert.equal(inspectionFor({ ...REPAIRS[0], stage:99 }), null);
});

test('repeatable device artwork is deterministic and contains no duplicate-ID mechanisms', () => {
  const forbidden = /\bid=|<defs\b|url\(#|undefined|NaN/;
  for (const repair of REPAIRS) {
    const model = inspectionFor({ ...repair, stage:0 });
    for (const view of ['front', 'rear']) {
      const svg = inspectionDeviceSVG(repair.device, model, view);
      assert.equal(svg, inspectionDeviceSVG(repair.device, model, view));
      assert.doesNotMatch(svg, forbidden);
      assert.doesNotMatch(svg, /<image\b|https?:\/\//);
    }
  }
  assert.doesNotMatch(homeHeroSVG(), forbidden);
  for (const name of ['The CEO', 'Gary (it’s always Gary)', 'Jules the intern', 'Frank, remote']) {
    assert.equal(personSVG(name, 'laptop'), personSVG(name, 'laptop'));
  }
  assert.doesNotMatch(inspectionDeviceSVG('laptop', {screen:'<script>bad</script>'}), /<script>/);
});

test('home and workbench preserve unique document IDs and main.js parses', () => {
  const html = readFileSync(new URL('../index.html', import.meta.url), 'utf8');
  const ids = [...html.matchAll(/\bid="([^"]+)"/g)].map(match => match[1]);
  assert.equal(ids.length, new Set(ids).size);
  for (const id of ['clock','queue','bench','start-btn','daily-btn','endless-btn','tutorial-btn','diff','music','online-toggle','best-line','stats-btn','shop-btn','exam-dialog','exam-action']) {
    assert.ok(ids.includes(id), id);
  }
  const source = readFileSync(new URL('../src/main.js', import.meta.url), 'utf8');
  const withoutImports = source.replace(/^import[\s\S]*?;\n/gm, '');
  assert.doesNotThrow(() => new Function(withoutImports));
});


test('unpowered hardware has a dark screen and no active status UI',()=>{
  for(const repair of REPAIRS){
    const model=inspectionFor({...repair,stage:0});
    if(model.screen!=='NO POWER') continue;
    assert.equal(model.physical.powered,false);
    const front=inspectionDeviceSVG(repair.device,model,'front');
    assert.doesNotMatch(front,/>NO POWER<|fill="var\(--good\)"|fill="var\(--display-text\)"/);
    assert.match(model.physical.description,/Screen off/);
  }
});
test('laptop and server connections retain their physical device identities',()=>{
  const laptop=inspectionFor({...REPAIRS[0],stage:0});
  assert.equal(laptop.physical.connector,'usb-c');
  const powerServer=REPAIRS.find(r=>r.device==='server' && /power lead/i.test(r.text));
  assert.ok(powerServer);
  assert.equal(inspectionFor({...powerServer,stage:0}).physical.connector,'power');
});
