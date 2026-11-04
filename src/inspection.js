// Read-only observations for the existing repair catalog. No scoring or game rules.
import { REPAIRS } from './tickets.js';

const stage = (zone, title, detail, screen, cue) => ({ zone, title, detail, screen, cue });
const observations = [
  [
    stage('ports', 'No charging light', 'The power plug is sitting beside the socket. The warm smell alone does not prove a failed battery.', 'NO POWER', 'loose'),
    stage('power', 'Power has returned', 'The charging indicator is on, but the machine is still latched in its unresponsive state.', 'STANDBY', 'stalled'),
  ],
  [
    stage('power', 'Input is stuck', 'Every key produces the same letter. The screen and input controller are no longer responding normally.', 'jjjjjjjj', 'stalled'),
    stage('screen', 'Input recovered', 'After the restart, the keyboard responds. The input driver reports an available maintenance update.', 'DRIVER OLD', 'update'),
  ],
  [
    stage('power', 'Feed cycle stalled', 'The print mechanism is stuck in a repeating feed cycle. The control panel no longer accepts input.', 'FEED STUCK', 'stalled'),
    stage('screen', 'Queue recovered', 'The feed cycle cleared. The print controller now reports outdated firmware.', 'FIRMWARE OLD', 'update'),
  ],
  [
    stage('screen', 'Color driver mismatch', 'The test pattern is magenta. The controller identifies an outdated color driver.', 'COLOR ERROR', 'update'),
    stage('power', 'Driver installed', 'The updated color driver is ready. The controller needs a fresh start to load it.', 'RESTART DUE', 'stalled'),
  ],
  [
    stage('security', 'Account lock', 'The lock screen reports that the previous credential is no longer valid. Check identity before resetting access.', 'ACCOUNT LOCK', 'locked'),
    stage('power', 'Access restored', 'The replacement credential is accepted. The session is still using its old locked state.', 'SESSION STALE', 'stalled'),
  ],
  [
    stage('ports', 'Radios disabled', 'The phone is powered on, but its wireless radios are disabled. There is no network link.', 'RADIOS OFF', 'offline'),
    stage('power', 'Link restored', 'The radio indicator is back. The network service is still holding its disconnected session.', 'SESSION STALE', 'stalled'),
  ],
  [
    stage('ports', 'Display path fault', 'The cable is seated loosely at the display adapter. The image orientation is wrong.', 'UPSIDE DOWN', 'loose'),
    stage('power', 'Display link stable', 'The connection is stable. The display controller still holds the previous orientation.', 'RESET DISPLAY', 'stalled'),
  ],
  [
    stage('ports', 'Intermittent connector', 'The signal drops when the plug moves. The connector is not seated securely.', 'NO SIGNAL', 'loose'),
    stage('screen', 'Stable picture, old driver', 'The link stays on without holding the cable. The display adapter reports an outdated driver.', 'DRIVER OLD', 'update'),
  ],
  [
    stage('ports', 'Link alarm', 'The rack alarm coincides with a disconnected network lead. The link indicator is dark.', 'LINK DOWN', 'loose'),
    stage('power', 'Link restored, service stalled', 'The network lead is seated. The service remains unresponsive after the outage.', 'SERVICE STUCK', 'stalled'),
    stage('screen', 'Service recovered', 'The service responds again. Its maintenance status shows a pending software update.', 'PATCH PENDING', 'update'),
  ],
  [
    stage('ports', 'Power lead disconnected', 'A charging adapter occupies the outlet. The rack power connector has been pulled free.', 'NO POWER', 'loose'),
    stage('power', 'Supply restored', 'Power is available again. The rack controller is waiting for a restart.', 'STANDBY', 'stalled'),
    stage('screen', 'Rack online', 'The rack has started. Its maintenance panel reports a pending update.', 'PATCH PENDING', 'update'),
  ],
  [
    stage('security', 'Expired administrator credential', 'The backup console is waiting at a credential prompt. Verify the authorized operator before resetting access.', 'CREDENTIAL OLD', 'locked'),
    stage('power', 'Credential accepted', 'Access works again, but the backup service has not recovered from its interrupted session.', 'SERVICE STUCK', 'stalled'),
    stage('screen', 'Backup service recovered', 'The service responds. The management console reports a pending maintenance update.', 'PATCH PENDING', 'update'),
  ],
  [
    stage('ports', 'Unstable source signal', 'Static tracks an intermittent video connection. The occasional face belongs to a frozen frame.', 'NO SIGNAL', 'loose'),
    stage('power', 'Source restored', 'The signal is stable, but the display is still holding a corrupted frame.', 'FRAME STUCK', 'stalled'),
    stage('screen', 'Picture recovered', 'The picture has returned. The display firmware reports an available update.', 'FIRMWARE OLD', 'update'),
  ],
  [
    stage('ports', 'Wrong source connection', 'The receiver is still paired to an old presentation source. The active input needs reconnecting.', 'OLD SOURCE', 'offline'),
    stage('screen', 'New source connected', 'The current source is selected. The receiver firmware is too old for a stable session.', 'FIRMWARE OLD', 'update'),
    stage('power', 'Receiver updated', 'The receiver update is installed. A restart is needed before it can use the new software.', 'RESTART DUE', 'stalled'),
  ],
];

export const INSPECTION_ZONES = [
  { id: 'screen', label: 'Screen & status', description: 'Read the display and diagnostic indicators.' },
  { id: 'ports', label: 'Cables & connection', description: 'Examine the connectors and network link.' },
  { id: 'power', label: 'Power & controls', description: 'Check responsiveness and power indicators.' },
  { id: 'security', label: 'Access & identity', description: 'Check the sign-in state and authorization.' },
];

const actions = {
  screen: { fix: 'update', label: 'Install maintenance update' },
  ports: { fix: 'connect', label: 'Restore connection' },
  power: { fix: 'restart', label: 'Restart device' },
  security: { fix: 'password', label: 'Reset verified account' },
};
const normal = {
  screen: ['Display inspected', 'No separate display or software fault is indicated at this stage. Compare the other components with the reported symptom.'],
  ports: ['Connections inspected', 'No separate connection fault is indicated at this stage. Check the other components before deciding.'],
  power: ['Controls inspected', 'No separate power or responsiveness fault is indicated at this stage. Check the displayed status and connections.'],
  security: ['Access inspected', 'There is no separate account lock indicated at this stage. A credential reset would not address the observed symptom.'],
};

/** A deterministic observation model for a known catalog entry and engine stage. */
export function inspectionFor(ticket) {
  const index = REPAIRS.findIndex(r => r.device === ticket.device && r.text === ticket.text);
  const current = observations[index]?.[ticket.stage || 0];
  if (!current) return null; // Future content must supply its own evidence, never invent a diagnosis.
  return {
    ...current,
    device: ticket.device,
    zones: INSPECTION_ZONES.map(zone => ({
      ...zone, ...actions[zone.id],
      ...(ticket.device === 'phone' && zone.id === 'ports' ? { label: 'Enable wireless radios' } : {}),
      title: current.zone === zone.id ? current.title : normal[zone.id][0],
      detail: current.zone === zone.id ? current.detail : normal[zone.id][1],
      finding: current.zone === zone.id,
    })),
  };
}
