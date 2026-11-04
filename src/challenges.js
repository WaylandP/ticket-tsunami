// Presentation difficulty: engine presets and all repair/scoring rules stay intact.
export const CHALLENGES = [
  { id: 'easy', label: 'Easy', engine: 'friday', tag: 'Learn the ropes', description: 'Clear clues and suggested repairs. Practice starts with simple faults.', hints: true, guided: true, choices: false, raw: false },
  { id: 'medium', label: 'Medium', engine: 'nineToFive', tag: 'Find your flow', description: 'Inspect the clues yourself. Hints are there if you need them.', hints: true, guided: false, choices: false, raw: false },
  { id: 'hard', label: 'Hard', engine: 'monday', tag: 'Trust your diagnosis', description: 'Choose from four repairs. No workbench hints or highlighted faults.', hints: false, guided: false, choices: true, raw: false },
  { id: 'extreme', label: 'Extreme', engine: 'monday', tag: 'Read between the lines', description: 'Interpret technical readings. Five repair choices. No workbench hints.', hints: false, guided: false, choices: true, raw: true },
];
const LEGACY = { friday: 'easy', nineToFive: 'medium', monday: 'hard' };
export function challengeFor(id) {
  return CHALLENGES.find(item => item.id === (LEGACY[id] || id)) || CHALLENGES[0];
}
export function challengeBestKey(id, endless = false) {
  const profile = challengeFor(id);
  const key = profile.id === 'extreme' ? 'extreme' : profile.engine;
  return endless ? `endless:${key}` : key;
}

const readings = {
  'NO POWER': 'Supply: 0 V at device input. Connector: open circuit.',
  'STANDBY': 'Supply: nominal. Power latch: standby. Session: not initialized.',
  'jjjjjjjj': 'Input buffer: J / J / J / J. Controller heartbeat: absent.',
  'DRIVER OLD': 'Device link: stable. Driver build: below supported baseline.',
  'QUEUE STUCK': 'Paper path: clear. Hardware test: passed. Print-service heartbeat: absent.',
  'FIRMWARE OLD': 'Hardware self-test: passed. Firmware revision: below baseline.',
  'COLOR ERROR': 'Test pattern: magenta only. Color profile / driver revision: mismatch.',
  'RESTART DUE': 'Installed revision: current. Loaded revision: previous. Boot flag: pending.',
  'ACCOUNT LOCK': 'Authentication: rejected. Credential state: invalid. Device input: responsive.',
  'SESSION STALE': 'Link / credentials: accepted. Session cache: previous state.',
  'RADIOS OFF': 'Radio interface: disabled. Carrier: absent. Supply: nominal.',
  'NO SIGNAL': 'Signal lock: intermittent. Carrier changes with connector movement.',
  'LINK DOWN': 'Port carrier: absent. Link LED: off. Network lead: disconnected.',
  'SERVICE STUCK': 'Link: stable. Service heartbeat: absent. Process state: unresponsive.',
  'PATCH PENDING': 'Service heartbeat: present. Installed build: below maintenance baseline.',
  'CREDENTIAL OLD': 'Authentication: expired credential. Backup job: awaiting authorization.',
  'FRAME STUCK': 'Carrier: stable. Frame counter: unchanged. Display cache: stale.',
  'OLD SOURCE': 'Active input: previous presentation source. Expected source: absent.',
};
const normalReadings = {
  screen: 'Display: readable. Maintenance indicator: no additional alert at this stage.',
  ports: 'Connector continuity: stable. Interface state: no separate link alert.',
  power: 'No separate control fault confirmed. Check the connection findings for supply issues.',
  security: 'Authentication indicator: no additional access rejection recorded.',
};
export function evidenceFor(model, zone, profile) {
  if (!profile.raw) return { title: zone.title, detail: zone.detail };
  return { title: 'Component telemetry', detail: zone.finding ? (readings[model.screen] || model.detail) + ' Approved recovery procedure; work saved and maintenance authorized.' : normalReadings[zone.id] };
}
