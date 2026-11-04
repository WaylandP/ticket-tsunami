// Presentation difficulty: engine presets and all repair/scoring rules stay intact.
export const CHALLENGES = [
  { id: 'easy', label: 'Easy', engine: 'friday', tag: 'Learn the ropes', description: 'Guided clues, suggested repairs, and a gentler queue.', hints: true, guided: true, choices: false, raw: false },
  { id: 'medium', label: 'Medium', engine: 'nineToFive', tag: 'Find your flow', description: 'Inspect the clues yourself. Hints are there if you need them.', hints: true, guided: false, choices: false, raw: false },
  { id: 'hard', label: 'Hard', engine: 'monday', tag: 'Trust your diagnosis', description: 'A busy queue. Choose from four repairs, without diagnostic hints.', hints: false, guided: false, choices: true, raw: false },
  { id: 'extreme', label: 'Extreme', engine: 'monday', tag: 'Read between the lines', description: 'Hard pace, raw readings, five repairs. No workbench hints.', hints: false, guided: false, choices: true, raw: true },
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
  'FEED STUCK': 'Feed-cycle counter: unchanged. Control input: no response.',
  'FIRMWARE OLD': 'Hardware self-test: passed. Firmware revision: below baseline.',
  'COLOR ERROR': 'Test pattern: magenta only. Color profile / driver revision: mismatch.',
  'RESTART DUE': 'Installed revision: current. Loaded revision: previous. Boot flag: pending.',
  'ACCOUNT LOCK': 'Authentication: rejected. Credential state: invalid. Device input: responsive.',
  'SESSION STALE': 'Link / credentials: accepted. Session cache: previous state.',
  'RADIOS OFF': 'Radio interface: disabled. Carrier: absent. Supply: nominal.',
  'UPSIDE DOWN': 'Display orientation: 180°. Adapter continuity: intermittent.',
  'RESET DISPLAY': 'Adapter continuity: stable. Orientation cache: previous state.',
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
  power: 'Supply indicator: nominal. Controls: no separate fault recorded.',
  security: 'Authentication indicator: no additional access rejection recorded.',
};
export function evidenceFor(model, zone, profile) {
  if (!profile.raw) return { title: zone.title, detail: zone.detail };
  return { title: 'Component telemetry', detail: zone.finding ? readings[model.screen] || model.detail : normalReadings[zone.id] };
}
