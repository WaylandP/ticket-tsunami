// Read-only observations for the existing repair catalog. No scoring or game rules.
import { REPAIRS } from './tickets.js';

const stage = (zone, title, detail, screen, cue) => ({ zone, title, detail, screen, cue });
const observations = [
  [
    stage('ports', 'No charging light', 'Approved charger is disconnected. The battery is flat; inspection found no heat, swelling, liquid, or damage. Reconnect the charger.', 'NO POWER', 'loose'),
    stage('power', 'Power has returned', 'Charge indicator is on. The approved recovery guide calls for a power cycle to clear the failed startup. There is no unsaved work.', 'STANDBY', 'stalled'),
  ],
  [
    stage('power', 'Input is stuck', 'Keyboard hardware tests pass. The input service repeats a buffered key; the approved recovery procedure calls for a restart. Work is saved.', 'jjjjjjjj', 'stalled'),
    stage('screen', 'Input recovered', 'Keyboard responds after restart. The verified driver release fixes this confirmed input-service defect; install it through managed updates.', 'DRIVER OLD', 'update'),
  ],
  [
    stage('power', 'Print service stalled', 'Paper path is clear and hardware tests pass. The print service is unresponsive; its approved recovery procedure is to restart it.', 'QUEUE STUCK', 'stalled'),
    stage('screen', 'Queue recovered', 'Print service responds. The approved firmware release fixes this confirmed queue defect; the printer is idle and ready for maintenance.', 'FIRMWARE OLD', 'update'),
  ],
  [
    stage('screen', 'Color driver mismatch', 'Internal self-test colors are correct. Job output is magenta; diagnostics match the color-driver defect fixed by the approved release.', 'COLOR ERROR', 'update'),
    stage('power', 'Driver installed', 'Verified driver is installed. Its installer explicitly requires a restart to load the new revision; all print jobs are saved.', 'RESTART DUE', 'stalled'),
  ],
  [
    stage('security', 'Account lock', 'The work account is locked, not the device PIN. Identity verification and recovery approval are complete. Use the approved access-recovery process.', 'ACCOUNT LOCK', 'locked'),
    stage('power', 'Access restored', 'New account access is accepted. The managed mail app is unresponsive; its approved recovery procedure calls for a restart. Data is synced.', 'SESSION STALE', 'stalled'),
  ],
  [
    stage('ports', 'Radios disabled', 'The phone is powered on, but its wireless radios are disabled. There is no network link.', 'RADIOS OFF', 'offline'),
    stage('power', 'Link restored', 'Radios are enabled and signal is stable. Network service is unresponsive; its recovery guide calls for a restart. Data is saved.', 'SESSION STALE', 'stalled'),
  ],
  [
    stage('ports', 'Loose display connector', 'The dock video connector is loose. Its pins and cable are undamaged; reseat it to restore the video link.', 'NO SIGNAL', 'loose'),
    stage('power', 'Display link stable', 'Video link is stable. The dock controller is unresponsive; its recovery guide calls for a power cycle. Work is saved.', 'RESTART DUE', 'stalled'),
  ],
  [
    stage('ports', 'Intermittent connector', 'The cable fails continuity testing. Disconnect it and fit the approved replacement; do not keep bending a faulty cable.', 'NO SIGNAL', 'loose'),
    stage('screen', 'Stable picture, old driver', 'Replacement cable passes testing. Diagnostics also identify a known display-driver defect addressed by an approved update.', 'DRIVER OLD', 'update'),
  ],
  [
    stage('ports', 'Link alarm', 'The lab server network lead is disconnected and link indicator is dark. No production traffic is running; reconnect the undamaged lead.', 'LINK DOWN', 'loose'),
    stage('power', 'Link restored, service stalled', 'Link is restored. The lab service is unresponsive; its approved runbook calls for a service restart. No active jobs will be interrupted.', 'SERVICE STUCK', 'stalled'),
    stage('screen', 'Service recovered', 'Lab service responds. An approved patch fixes this known service defect; backups and rollback are ready for this maintenance window.', 'PATCH PENDING', 'update'),
  ],
  [
    stage('ports', 'Power lead disconnected', 'The lab server power lead is disconnected. No active jobs or hardware damage; reconnect the approved supply under the maintenance procedure.', 'NO POWER', 'loose'),
    stage('power', 'Supply restored', 'Power is restored. The lab controller is stuck after power loss; its approved recovery procedure calls for a power cycle. No jobs are active.', 'STANDBY', 'stalled'),
    stage('screen', 'Rack online', 'Lab server has started. The approved firmware release addresses this startup fault; backup and rollback are ready.', 'PATCH PENDING', 'update'),
  ],
  [
    stage('security', 'Verified account recovery', 'The lab backup account is locked. Operator identity and recovery approval are confirmed; use the approved access-recovery workflow.', 'ACCOUNT LOCK', 'locked'),
    stage('power', 'Credential accepted', 'Account access works. The backup service remains unresponsive; the approved runbook calls for a service restart. No backup job is active.', 'SERVICE STUCK', 'stalled'),
    stage('screen', 'Backup service recovered', 'Backup service responds. Its approved maintenance release fixes the known recovery defect. Backup and rollback are ready.', 'PATCH PENDING', 'update'),
  ],
  [
    stage('ports', 'Unstable source signal', 'Video connection is loose; the last video frame is stuck behind the static. Reseat the undamaged lead and verify the source.', 'NO SIGNAL', 'loose'),
    stage('power', 'Source restored', 'Signal is stable but the receiver is unresponsive. Its recovery guide calls for a power cycle; no presentation is active.', 'FRAME STUCK', 'stalled'),
    stage('screen', 'Picture recovered', 'Picture is restored. The verified firmware release addresses this receiver fault and is approved for the idle display.', 'FIRMWARE OLD', 'update'),
  ],
  [
    stage('ports', 'Wrong source connection', 'Receiver is still paired to the previous source. With setup authorized, disconnect the old source and connect the intended one.', 'OLD SOURCE', 'offline'),
    stage('screen', 'New source connected', 'Intended source is connected. Its required protocol needs the approved newer receiver firmware; verify and install that release.', 'FIRMWARE OLD', 'update'),
    stage('power', 'Receiver updated', 'The verified firmware is installed. The installer explicitly requires a restart to activate it; no presentation is in progress.', 'RESTART DUE', 'stalled'),
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
  power: { fix: 'restart', label: 'Restart safely' },
  security: { fix: 'password', label: 'Recover verified access' },
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
    physical: {
      powered: current.screen !== 'NO POWER',
      connector: ticket.device === 'laptop' ? 'usb-c' : ticket.device === 'phone' ? 'wireless' : ticket.device === 'server' && index === 9 ? 'power' : ticket.device === 'server' ? 'network' : ticket.device === 'printer' ? 'usb-b' : 'display',
      description: current.screen === 'NO POWER' ? 'Screen off · power indicator off' : current.cue === 'loose' ? 'Power on · connection needs inspection' : 'Power on · inspect the reported status',
    },
    zones: INSPECTION_ZONES.map(zone => ({
      ...zone, ...actions[zone.id],
      ...(ticket.device === 'phone' && zone.id === 'ports' ? { label: 'Enable wireless radios' } : {}),
      title: current.zone === zone.id ? current.title : normal[zone.id][0],
      detail: current.zone === zone.id ? current.detail : normal[zone.id][1],
      finding: current.zone === zone.id,
    })),
  };
}

