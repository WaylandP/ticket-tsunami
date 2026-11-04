// Every ticket in the game. Each one has exactly one right fix.
// Keep text under 90 characters and keep it readable by people who don't work in IT.

// Each case supplies evidence for the best next action, not a universal diagnosis.
// Access recovery always requires identity verification; updates use trusted channels.
export const TICKETS = [
  { fix: "restart", text: "App is frozen. Work is saved; its support guide recommends a restart." },
  { fix: "restart", text: "The app still hangs after closing it. A restart is approved; work is saved." },
  { fix: "restart", text: "Call app is frozen. Network is healthy; the app recovery guide says restart." },
  { fix: "restart", text: "Desktop is unresponsive. Files are saved; the approved next step is restart." },
  { fix: "restart", text: "Update installed successfully. The system now explicitly requests a restart." },
  { fix: "restart", text: "A known stuck service is confirmed. Its approved recovery step is a restart." },
  { fix: "restart", text: "Spreadsheet app has hung. Recovery copy is saved; restart the affected app." },
  { fix: "restart", text: "Display driver stopped responding. Its recovery guide calls for a restart." },
  { fix: "restart", text: "A memory leak is confirmed. Work is saved; restart is the approved workaround." },
  { fix: "restart", text: "Print service has stalled. Paper path is clear; restart the print service." },
  { fix: "restart", text: "Headset service is stuck in a call. Its recovery guide recommends a restart." },
  { fix: "restart", text: "The pointer service has hung. Work is saved; restart is the approved next step." },
  { fix: "restart", text: "Audio service stopped responding. Its approved recovery step is restart." },
  { fix: "password", text: "I forgot my password. My identity is verified and recovery is approved." },
  { fix: "password", text: "Account is locked. Identity verified; the access-recovery workflow is approved." },
  { fix: "password", text: "Legacy app expired my password. Identity verified; reset is approved." },
  { fix: "password", text: "I lost my password. My identity is verified; use the approved recovery process." },
  { fix: "password", text: "Sign-in is locked. Identity checks passed; approved account recovery is next." },
  { fix: "password", text: "My login code device was lost. Identity verified; start approved MFA recovery." },
  { fix: "password", text: "My password was exposed. Identity verified; replace it and revoke sessions." },
  { fix: "password", text: "Account access is locked. Identity verified; recover access under our policy." },
  { fix: "password", text: "Back from leave, password forgotten. Identity verified; recovery approved." },
  { fix: "password", text: "Known-good account, forgotten password. Identity verified; recovery approved." },
  { fix: "password", text: "Old credential is rejected. Identity verified; approved account recovery next." },
  { fix: "password", text: "I lost my sign-in credentials. Identity verified; use approved recovery." },
  { fix: "connect", text: "No internet. The network cable is unplugged and the link light is off." },
  { fix: "connect", text: "Wi-Fi signal is weak. Move closer and check the approved network connection." },
  { fix: "connect", text: "Airplane mode is on. Wireless radios are disabled; no sites can load." },
  { fix: "connect", text: "Monitor has power but no signal. The display cable is not connected." },
  { fix: "connect", text: "My second screen vanished. Its connector was pulled loose by my mug." },
  { fix: "connect", text: "Printer is offline. Its network cable is disconnected; link light is off." },
  { fix: "connect", text: "Calls drop on the patio. Signal is weak; check the approved network link." },
  { fix: "connect", text: "Wireless keyboard is disconnected. Its paired receiver is unplugged." },
  { fix: "connect", text: "VPN has no underlying network. The laptop is not connected to Wi-Fi." },
  { fix: "connect", text: "Laptop battery is at 1%. Connect the approved charger; it is unplugged." },
  { fix: "connect", text: "Headset is silent. Its audio plug is visibly disconnected." },
  { fix: "connect", text: "Wrong network selected. Connect to the verified company network instead." },
  { fix: "update", text: "The app reports an unsupported version. A verified update is available." },
  { fix: "update", text: "Managed update console shows an approved security patch ready to install." },
  { fix: "update", text: "Browser version is unsupported. The approved updater has the supported build." },
  { fix: "update", text: "Meeting app requires a newer version. Verified update is ready." },
  { fix: "update", text: "The trusted update console has an approved patch, not a browser pop-up." },
  { fix: "update", text: "Management console confirms a missing security patch. Apply approved update." },
  { fix: "update", text: "Required feature needs the newer app version. Approved update is available." },
  { fix: "update", text: "Chat app version is unsupported. Install the verified supported release." },
  { fix: "update", text: "Confirmed printer-driver bug. Approved driver update fixes this exact issue." },
  { fix: "update", text: "Mail app requires a supported phone version. Verified update is available." },
  { fix: "update", text: "File needs a newer supported app version. Approved update is ready." },
  { fix: "update", text: "OS is below our supported baseline. Approved upgrade is ready and backed up." },
  { fix: "notit", text: "The coffee machine pump is broken. Facilities owns appliance repairs here." },
  { fix: "notit", text: "Can you cancel my meeting? Scheduling decisions belong to its organizer." },
  { fix: "notit", text: "There is a bird in the break room. Route this to the building team." },
  { fix: "notit", text: "My chair squeaks. Facilities handles furniture repairs here." },
  { fix: "notit", text: "The thermostat is stuck. Building services owns this equipment here." },
  { fix: "notit", text: "Can you make my manager reply faster? Please route my request to them." },
  { fix: "notit", text: "Microwave displays an appliance fault. Facilities owns its servicing." },
  { fix: "notit", text: "My labeled yogurt is missing. This belongs with the office manager." },
  { fix: "notit", text: "Parking gate badge failed. Site security owns the gate and badge checks." },
  { fix: "notit", text: "Can you fix my fantasy lineup? This is a personal request, not IT support." },
  { fix: "notit", text: "Vending machine took my money. Route it to the vending service contact." },
  { fix: "notit", text: "Can IT approve vacation? Only my manager and people team can approve it." },
  { fix: "notit", text: "My desk plant needs water. The office plant-care team can help." },
];

export const NAMES = [
  'Priya in Sales', 'Marcus in Finance', 'Dana from HR', 'Leo in Marketing', 'Aisha in Legal',
  'Tom from Ops', 'Rosa in Design', 'Ken in Accounting', 'Omar in Support',
  'Beth in Recruiting', 'Sam from Facilities', 'Nia in Product', 'Mei in Data',
  'Carlos in Sales', 'Hannah from the 3rd floor', 'Ravi in Engineering', 'Zoe in Payroll',
];

// Suspicious mail. The UI names the existing notit action Route / report.
// Report suspicious messages through the approved channel; never follow their links.
export const SPAM = [
  { text: 'CONGRATS!!! You won a free tablet. Claim it in the next 10 minutes!!', from: 'Totally Legit Prizes' },
  { text: 'Your paycheck is ON HOLD. Verify your login at pay-roll-fix.example', from: 'Payroll “Support”' },
  { text: 'I am a prince with 94 laptops to give away. Reply with your password.', from: 'A Generous Stranger' },
  { text: 'FINAL NOTICE: your printer warranty expires TODAY. Act now!!!', from: 'Warranty Central' },
  { text: 'We noticed you own a computer. Click here to make it 600% faster.', from: 'speedy-pc-deals.example' },
  { text: 'Required security webinar: enter your work password at training-check.example', from: 'The Webinar People' },
];

// Regulars you get to know. Learn their habits and you can close their
// familiar symptoms; still inspect the evidence before acting.
export const REGULARS = [
  { name: 'Gary (it\u2019s always Gary)', fix: 'password' }, // locked out, every time
  { name: 'Frank, remote', fix: 'connect' }, // it's always the connection
  { name: 'Jules the intern', selfFix: true }, // usually figures it out alone
];

// Walk-in repairs: an end user carries the machine to your desk. Each one
// takes two fixes, in order, like treating a patient — diagnose, then cure.
export const REPAIRS = [
  { device: 'laptop', text: 'Laptop battery ran flat. The charger is unplugged; no heat or damage.', stages: ['connect', 'restart'] },
  { device: 'laptop', text: 'Keyboard repeats letters. Hardware test passes; input service is stuck.', stages: ['restart', 'update'] },
  { device: 'printer', text: 'Printer has no jam. Its print service is stuck and ignores controls.', stages: ['restart', 'update'] },
  { device: 'printer', text: 'Printer self-test is fine. A confirmed driver bug makes jobs print pink.', stages: ['update', 'restart'] },
  { device: 'phone', text: 'Work account is locked on this phone. Identity verified; recovery approved.', stages: ['password', 'restart'] },
  { device: 'phone', text: 'Phone insists it’s in airplane mode. It is not on an airplane.', stages: ['connect', 'restart'] },
  { device: 'monitor', text: 'Display loses signal. The dock cable is loose; hardware is undamaged.', stages: ['connect', 'restart'] },
  { device: 'monitor', text: 'Display signal drops. A replacement cable is ready; driver fix is approved.', stages: ['connect', 'update'] },
  // The big jobs: three steps, big pay.
  { device: 'server', text: 'Lab server link is down. No production traffic; maintenance is approved.', stages: ['connect', 'restart', 'update'] },
  { device: 'server', text: 'Lab server power lead is unplugged. No active jobs; maintenance approved.', stages: ['connect', 'restart', 'update'] },
  { device: 'server', text: 'Lab backup account is locked. Identity verified; no backup job is active.', stages: ['password', 'restart', 'update'] },
  { device: 'tv', text: 'Room display has static. Video lead is loose; hardware checks passed.', stages: ['connect', 'restart', 'update'] },
  { device: 'tv', text: 'Room receiver is paired to an old source. Authorized setup changes are ready.', stages: ['connect', 'update', 'restart'] },
];
