// Inline stroke icons, drawn on a 24px grid. currentColor, so they follow the theme.

const svg = (body) =>
  `<svg aria-hidden="true" viewBox="0 0 24 24" width="26" height="26" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">${body}</svg>`;

export const FIX_ICONS = {
  restart: svg('<path d="M12 3v7"/><path d="M6.3 6.6a8 8 0 1 0 11.4 0"/>'),
  password: svg('<circle cx="8" cy="15" r="4"/><path d="M11 12l8-8M16 7l2.5 2.5M14 9l2 2"/>'),
  connect: svg('<path d="M4.5 10a11 11 0 0 1 15 0"/><path d="M7.5 13.5a6.5 6.5 0 0 1 9 0"/><circle cx="12" cy="17.5" r="1.4" fill="currentColor" stroke="none"/>'),
  update: svg('<path d="M12 4v11"/><path d="M7.5 10.5L12 15l4.5-4.5"/><path d="M5 19h14"/>'),
  notit: svg('<circle cx="12" cy="12" r="8.5"/><path d="M6 6l12 12"/>'),
};

export const POWER_ICONS = {
  coffee: svg('<path d="M4 9h12v8a3 3 0 0 1-3 3H7a3 3 0 0 1-3-3zM16 10h2a3 3 0 1 1 0 6h-2M7 3v3m5-3v3M2 23h18"/>'),
  kb: svg('<path d="M12 6Q7 2 2 5v15q5-3 10 0 5-3 10 0V5q-5-3-10 1v14M5 9h3m-3 4h3m8-4h3m-3 4h3"/>'),
  bot: svg('<rect x="3" y="7" width="18" height="14" rx="4"/><path d="M12 3v4M8 16h8M7 11v1m10-1v1"/><circle cx="12" cy="2" r="1"/>'),
};

export function face(happy) {
  return happy
    ? `<svg aria-hidden="true" viewBox="0 0 24 24" width="24" height="24"><circle cx="12" cy="12" r="10" fill="currentColor"/><circle cx="8.6" cy="10" r="1.5" fill="var(--face-ink)"/><circle cx="15.4" cy="10" r="1.5" fill="var(--face-ink)"/><path d="M7.8 14.2q4.2 4 8.4 0" fill="none" stroke="var(--face-ink)" stroke-width="1.9" stroke-linecap="round"/></svg>`
    : `<svg aria-hidden="true" viewBox="0 0 24 24" width="24" height="24"><circle cx="12" cy="12" r="9" fill="none" stroke="currentColor" stroke-width="2"/><path d="M7.5 8.5l2.5 1.6M16.5 8.5L14 10.1" stroke="currentColor" stroke-width="1.8" stroke-linecap="round"/><path d="M8 16.5q4-3 8 0" fill="none" stroke="currentColor" stroke-width="1.9" stroke-linecap="round"/></svg>`;
}

// --- character avatars -----------------------------------------------------
// Every sender gets a face, generated deterministically from their name, so
// Gary always looks like Gary. The regulars and the CEO get custom looks.

const AV_BG = ['var(--face)', 'var(--accent-soft)', 'var(--fix-password-soft)', 'var(--good-soft)', 'var(--danger-soft)', 'var(--warn-soft)', 'var(--fix-restart-soft)', 'var(--vip-soft)'];
const AV_SKIN = ['var(--skin-1)', 'var(--skin-2)', 'var(--skin-3)', 'var(--skin-4)'];
const AV_HAIR = ['var(--hair-1)', 'var(--hair-2)', 'var(--hair-3)', 'var(--hair-4)', 'var(--hair-5)'];

const hashName = (s) => {
  let h = 0;
  for (const c of s) h = (h * 31 + c.charCodeAt(0)) | 0;
  return Math.abs(h);
};

const av = (bg, body) =>
  `<svg aria-hidden="true" viewBox="0 0 32 32"><circle cx="16" cy="16" r="16" fill="${bg}"/>${body}</svg>`;

const baseFace = (skin, extra = '') => `
  <path d="M5 29c1.6-4.6 6-7 11-7s9.4 2.4 11 7z" fill="var(--trousers)"/>
  <circle cx="16" cy="14" r="7.5" fill="${skin}"/>
  ${extra}
  <circle cx="13.2" cy="14" r="1.1" fill="var(--art-ink)"/>
  <circle cx="18.8" cy="14" r="1.1" fill="var(--art-ink)"/>
  <path d="M13 17.4q3 2.4 6 0" fill="none" stroke="var(--art-ink)" stroke-width="1.4" stroke-linecap="round"/>`;

const HAIRCUTS = [
  (c) => `<path d="M8.5 14c0-5 3.4-8 7.5-8s7.5 3 7.5 8l-2.2-.6c-.9-3-2.7-4.6-5.3-4.6s-4.4 1.6-5.3 4.6z" fill="${c}"/>`,
  (c) => `<circle cx="11" cy="9" r="3" fill="${c}"/><circle cx="16" cy="7.2" r="3.2" fill="${c}"/><circle cx="21" cy="9" r="3" fill="${c}"/>`,
  (c) => `<path d="M8.5 14c0-5 3.4-8 7.5-8s7.5 3 7.5 8l-2.2-.6c-.9-3-2.7-4.6-5.3-4.6s-4.4 1.6-5.3 4.6z" fill="${c}"/><circle cx="16" cy="4.6" r="2.3" fill="${c}"/>`,
  () => '',
];

const SPECIAL_AVATARS = {
  'The CEO': () => av('var(--face)', `
    ${baseFace('var(--skin-2)')}
    <path d="M9.5 8.5l3 2.4 3.5-3.4 3.5 3.4 3-2.4v3.3h-13z" fill="var(--shirt-gold)"/>
    <rect x="10.6" y="12.2" width="4.6" height="2.6" rx="1" fill="var(--art-ink)"/>
    <rect x="16.8" y="12.2" width="4.6" height="2.6" rx="1" fill="var(--art-ink)"/>
    <path d="M15.2 12.9h1.6" stroke="var(--art-ink)" stroke-width="1.2"/>`),
  'Gary (it’s always Gary)': () => av('var(--fix-restart-soft)', `
    ${baseFace('var(--skin-1)', `<path d="M10 9.5l2-2.5 2 1.5 2-2 2 2 2-1.5 2 2.5" fill="none" stroke="var(--hair-2)" stroke-width="2" stroke-linecap="round"/>`)}
    <path d="M11.8 12.6h2.8M17.4 12.6h2.8" stroke="var(--art-ink)" stroke-width="1.1" stroke-linecap="round"/>
    <path d="M12 16.1q1.2.8 2.4 0M17.6 16.1q1.2.8 2.4 0" fill="none" stroke="var(--hair-2)" stroke-width="0.9"/>`),
  'Jules the intern': () => av('var(--good-soft)', `
    ${baseFace('var(--skin-3)')}
    <path d="M8.5 13.5a7.5 7.5 0 0 1 15 0" fill="none" stroke="var(--art-ink)" stroke-width="2.4"/>
    <rect x="7" y="12" width="3.4" height="5.4" rx="1.6" fill="var(--art-ink)"/>
    <rect x="21.6" y="12" width="3.4" height="5.4" rx="1.6" fill="var(--art-ink)"/>`),
  'Frank, remote': () => av('var(--warn-soft)', `
    ${baseFace('var(--skin-4)', HAIRCUTS[0]('var(--hair-4)'))}
    <path d="M8.5 13.5a7.5 7.5 0 0 1 15 0" fill="none" stroke="var(--art-ink)" stroke-width="2.2"/>
    <rect x="21.4" y="12.2" width="3.2" height="5" rx="1.5" fill="var(--art-ink)"/>
    <path d="M22.8 17.2q0 3-4.2 3.2" fill="none" stroke="var(--art-ink)" stroke-width="1.6"/>
    <circle cx="18" cy="20.6" r="1.3" fill="var(--art-ink)"/>`),
  'Everyone, floor 3': () => av('var(--danger-soft)', `
    <circle cx="9.5" cy="13" r="4.4" fill="var(--skin-2)"/><circle cx="22.5" cy="13" r="4.4" fill="var(--skin-4)"/>
    <circle cx="16" cy="15.5" r="5.2" fill="var(--skin-3)"/>
    <path d="M4 29c2-5 6.5-7.5 12-7.5S26 24 28 29z" fill="var(--trousers)"/>
    <circle cx="14.2" cy="15" r="0.9" fill="var(--art-ink)"/><circle cx="17.8" cy="15" r="0.9" fill="var(--art-ink)"/>
    <path d="M14.4 18q1.6 1.2 3.2 0" fill="none" stroke="var(--art-ink)" stroke-width="1.2" stroke-linecap="round"/>`),
};

export function avatar(name, kind) {
  if (kind === 'spam') {
    return av('var(--muted)', `
      <path d="M7 16q5-5.5 11-5.5 3.6 0 6.5 2.2L27 10v12l-2.5-2.7Q21.6 21.5 18 21.5 12 21.5 7 16z" fill="var(--shirt-blue)"/>
      <circle cx="12.5" cy="14.8" r="1.2" fill="var(--paper)"/>
      <path d="M16 3v6" stroke="var(--art-ink)" stroke-width="1.4"/>
      <path d="M16 9q2.6.8 1.6 3" fill="none" stroke="var(--art-ink)" stroke-width="1.4" stroke-linecap="round"/>`);
  }
  if (SPECIAL_AVATARS[name]) return SPECIAL_AVATARS[name]();
  const h = hashName(name);
  const skin = AV_SKIN[h % AV_SKIN.length];
  const hair = HAIRCUTS[(h >> 2) % HAIRCUTS.length](AV_HAIR[(h >> 4) % AV_HAIR.length]);
  return av(AV_BG[(h >> 6) % AV_BG.length], baseFace(skin, hair));
}

// --- device art for walk-in repairs ----------------------------------------
// Bigger illustrations with a little life in them (blinks, smoke, static).

// Company equipment, with real silhouettes, ports, hinges and asset labels.
// Small device art is deliberately neutral: the examination supplies the fault.
const deviceSVG = body => `<svg aria-hidden="true" viewBox="0 0 64 64" fill="none" stroke="var(--art-ink)" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round">${body}</svg>`;
const assetTag = (x,y) => `<g stroke="none"><rect x="${x}" y="${y}" width="10" height="4" rx=".8" fill="var(--paper)"/><path d="M${x+2} ${y+1}v2m2-2v2m1-2v2m2-2v2" stroke="var(--art-ink)" stroke-width=".7"/></g>`;
export const DEVICE_ART = {
  laptop: deviceSVG(`<rect x="8" y="9" width="48" height="34" rx="4" fill="var(--machine-side)"/><rect x="11" y="12" width="42" height="27" rx="2" fill="var(--display-bg)"/><path d="M14 16h36" stroke="var(--display-line)" stroke-width=".8"/><circle cx="32" cy="10.5" r=".6" fill="var(--art-ink)" stroke="none"/><path d="M25 24h14m-14 5h9" stroke="var(--display-text)" stroke-width="2"/><circle class="blink" cx="46" cy="33" r="1.4" fill="var(--warn)" stroke="none"/><path d="M8 43h48l6 10q-1 4-5 4H7q-4 0-5-4z" fill="var(--machine-shell)"/><path d="M2 53h60M13 46h38m-40 3h42" stroke-width="1"/><path d="M25 50h14l2 3H23z" fill="var(--machine-side)"/><path d="M8 55h7m35 0h5" stroke-width="1"/>`),
  printer: deviceSVG(`<path d="M16 26V6h32v20" fill="var(--paper)"/><path d="M21 12h22m-22 5h17" stroke="var(--display-line)" stroke-width="1"/><path d="M9 23l7-5h32l7 5v26H9z" fill="var(--machine-side)"/><rect x="6" y="25" width="52" height="26" rx="5" fill="var(--machine-shell)"/><rect x="11" y="30" width="19" height="8" rx="2" fill="var(--display-bg)"/><path d="M14 34h12" stroke="var(--display-text)" stroke-width="1.5"/><circle class="blink" cx="50" cy="34" r="2" fill="var(--warn)"/><path d="M15 43h34v7H15z" fill="var(--art-ink)"/><path d="M19 45h26l3 13H16z" fill="var(--paper)"/><path d="M22 50h20m-21 4h22" stroke="var(--display-line)" stroke-width="1"/>${assetTag(39,38)}`),
  phone: deviceSVG(`<rect x="18" y="3" width="28" height="58" rx="6" fill="var(--machine-side)"/><rect x="21" y="6" width="22" height="52" rx="4" fill="var(--display-bg)"/><path d="M28 8h8" stroke="var(--machine-side)" stroke-width="3"/><path d="M18 17h-1v8m30-5v10" stroke-width="1.4"/><path d="M25 19h6m-6 5h14" stroke="var(--display-text)" stroke-width="1.5"/><rect x="25" y="33" width="14" height="11" rx="2" fill="var(--display-line)" stroke="none"/><path d="M29 36h6m-6 3h4" stroke="var(--display-text)" stroke-width="1"/><path d="M28 54h8" stroke="var(--paper)" stroke-width="1.8"/>`),
  monitor: deviceSVG(`<path d="M27 44h10l3 12H24z" fill="var(--machine-side)"/><path d="M19 56h26l4 4H15z" fill="var(--machine-shell)"/><rect x="3" y="8" width="58" height="38" rx="4" fill="var(--machine-shell)"/><rect x="6" y="11" width="52" height="30" rx="2" fill="var(--display-bg)"/><path class="signal" d="M12 25h9l4-7 7 15 5-10h14" stroke="var(--display-text)" stroke-width="1.4"/><circle class="blink" cx="55" cy="43" r="1" fill="var(--good)" stroke="none"/>${assetTag(27,42)}`),
  server: deviceSVG(`<path d="M17 4h30l6 6v48H17z" fill="var(--machine-side)"/><rect x="11" y="4" width="36" height="55" rx="4" fill="var(--machine-shell)"/>${[11,23,35].map((y,i)=>`<rect x="15" y="${y}" width="28" height="9" rx="2" fill="var(--display-bg)"/><path d="M19 ${y+3}h13m-13 3h13" stroke="var(--display-line)" stroke-width="1"/><circle class="blink" cx="39" cy="${y+5}" r="1.5" fill="var(--${i===0?'warn':'good'})" stroke="none"/>`).join('')}<circle cx="37" cy="51" r="2" fill="var(--display-bg)"/>${assetTag(17,49)}<path d="M17 59v3m26-3v3" stroke-width="3"/>`),
  tv: deviceSVG(`<rect x="2" y="9" width="60" height="39" rx="3" fill="var(--machine-side)"/><rect x="5" y="12" width="54" height="32" rx="1" fill="var(--display-bg)"/><path d="M9 18h46m-46 6h46m-46 6h46m-46 6h46" stroke="var(--display-line)" stroke-width=".7" opacity=".6"/><g class="ghost" stroke="var(--display-text)"><circle cx="27" cy="25" r="1.3"/><circle cx="37" cy="25" r="1.3"/><path d="M27 32q5 4 10 0"/></g><path d="M13 48l-5 8h9m34-8 5 8h-9" stroke-width="3"/><circle class="blink" cx="56" cy="46" r=".8" fill="var(--good)" stroke="none"/>`),
};

// --- coworkers --------------------------------------------------------------
const SHIRTS = ['var(--shirt-blue)', 'var(--shirt-purple)', 'var(--shirt-green)', 'var(--shirt-red)', 'var(--shirt-gold)'];
const HAIR_SHAPES = [
  `<path d="M66 53q-11-29 13-35 21-19 44 0 23 3 16 35l-8-16q-22 12-47 0l-12 21z"/><path d="M75 27q22-17 45 0m-37 6q20-11 39-2" fill="none" stroke="var(--paper)" opacity=".14" stroke-width="3"/>`,
  `<path d="M64 54q-10-8-6-17-6-11 5-17-1-12 13-13 8-13 21-6 13-8 22 4 15-4 19 10 15 4 10 17 7 10-6 22l-12-20q-22 11-48 0l-11 24z"/><path d="M73 18q6-10 13-4m13-8q8-2 10 6m14 3q9-2 11 6" fill="none" stroke="var(--paper)" opacity=".12" stroke-width="3"/>`,
  `<circle cx="125" cy="13" r="15"/><path d="M65 55q-9-38 32-40 46-7 43 40l-10-22q-18 14-49 2l-10 24z"/><path d="M79 26q22-11 42-3" stroke="var(--paper)" opacity=".15" fill="none" stroke-width="3"/>`,
  `<path d="M65 57q-8-16 3-28l8-4-4 31m67 0q8-16-3-28l-8-4 4 31"/><path d="M84 23q14-6 30 0" fill="none" stroke="var(--paper)" opacity=".17" stroke-width="3"/>`,
  `<path d="M64 61q-7-44 29-47 40-10 48 32l-4 40-10-12 2-41q-19 15-48 7L71 80l-10 9z"/><path d="M74 33q17-16 40-10m19 16 1 29" fill="none" stroke="var(--paper)" opacity=".14" stroke-width="3"/>`,
  `<path d="M64 58Q49 44 58 31Q49 25 54 17Q67 23 78 14Q91 1 106 10Q126-3 135 14Q151 20 145 38Q147 50 136 62L128 37Q111 45 94 35Q80 44 73 60Z"/><path d="M66 29q12 3 22-9m-3 12q16 7 30-5m-15-9q16-6 25 7" fill="none" stroke="var(--paper)" opacity=".14" stroke-width="3"/>`,
];

// All poses share one shoulder/cuff shape; only forearms and grips change.
// Mirror local coordinates for the right side, so body variants cannot detach it.
const HOLD_POSES = {
  laptop:  { x:78, y:136, size:164, gripX:91, gripY:266 },
  phone:   { x:102, y:153, size:116, gripX:137, gripY:247 },
  printer: { x:76, y:137, size:168, gripX:97, gripY:264 },
  monitor: { x:69, y:137, size:182, gripX:91, gripY:258 },
  server:  { x:91, y:132, size:154, gripX:120, gripY:263 },
  tv:      { x:64, y:137, size:192, gripX:80, gripY:260 },
};

/** Seated coworkers: continuous shoulders, rolled sleeves, forearms and device grips. */
export function personSVG(name, device, observation = null) {
  const h=hashName(name), ceo=name==='The CEO', gary=name.startsWith('Gary'), jules=name==='Jules the intern', frank=name==='Frank, remote';
  const skin=AV_SKIN[h%4], hair=AV_HAIR[(h>>>4)%5], shirt=ceo?'var(--surface-2)':SHIRTS[(h>>>6)%5];
  const haircut=gary?5:ceo||frank?0:(h>>>2)%6, blazer=ceo||h%3===1;
  const pose=HOLD_POSES[device] || HOLD_POSES.laptop;
  const { x,y,size,gripX:gx,gripY:gy }=pose;
  const mounted=(DEVICE_ART[device]||DEVICE_ART.laptop).replace(/^<svg[^>]*>/, `<svg x="${x}" y="${y}" width="${size}" height="${size}" viewBox="0 0 64 64" fill="none" stroke="var(--art-ink)" stroke-width="1.2" stroke-linecap="round" stroke-linejoin="round">`);
  const sleeve = `<path d="M111 137Q76 131 61 161Q51 177 48 199L87 214Q98 195 104 169" fill="${shirt}"/>
    <path d="M63 163q-7 13-9 27l31 12 13-31" fill="var(--paper)" opacity=".12" stroke="none"/>
    <path d="M52 193l39 14-5 14-41-15z" fill="${shirt}"/>
    <path d="M50 197l37 13m-30-29 7-11m19 21 5-11" stroke="var(--paper)" stroke-width="2" opacity=".45"/>
    <path d="M48 205l37 13" stroke-width="1.5"/>`;
  const forearm = `<path d="M50 198Q40 221 42 250Q43 277 64 282Q83 287 ${gx+3} ${gy+11}L${gx+8} ${gy-10}Q91 252 83 249Q76 244 83 210Z" fill="${skin}"/>
    <path d="M45 246q-1 24 19 28 13 5 ${gx-64} ${gy-2-274}l1 8q-${gx-74} 9-36 1-19-6-17-28z" fill="var(--art-ink)" opacity=".10" stroke="none"/>
    <path d="M50 222q-3 15 0 24" stroke="var(--paper)" stroke-width="3" opacity=".25"/>`;
  const hand = tense => `<g transform="translate(${gx} ${gy})" fill="${skin}">
    <path d="M-12 8Q-19 2-15-8L-9-17Q-6-23-2-20L4-11Q10-14 13-9L11 5Q9 12 1 13Z"/>
    <path d="M-8-3L7 0M-9 2L7 5M-7 7l10 2" stroke-width="1.2" opacity=".55"/>
    <path d="M-8-15l4 8" stroke="var(--paper)" stroke-width="2" opacity=".3"/>
    ${tense?'<path d="M-10-5l8 3m1-9 5 3" stroke-width="1.6"/>':''}
  </g>`;
  return `<svg aria-hidden="true" viewBox="0 0 320 310" class="person${observation?.physical?.powered === false ? ' device-unpowered' : ''}" fill="none" stroke="var(--art-ink)" stroke-width="2.6" stroke-linecap="round" stroke-linejoin="round">
    <g class="coworker-chair" stroke="var(--machine-edge)"><path d="M38 282L29 173Q24 127 58 121Q160 101 262 121Q296 127 291 173L282 282Z" fill="var(--machine-side)"/><path d="M44 267l-7-96q-3-35 24-41 99-18 198 0 27 6 24 41l-7 96z" fill="var(--surface-2)"/>
      ${[148,164,180,196,212,228,244].map(y=>`<path d="M43 ${y}h234" stroke="var(--line)" stroke-width="1" opacity=".65"/>`).join('')}
      ${[53,67,81,95,109,123,137,151,165,179,193,207,221,235,249,263].map(x=>`<path d="M${x} 139v112" stroke="var(--line)" stroke-width="1" opacity=".4"/>`).join('')}
      <path d="M35 263l-12 10v21h43m219-31 12 10v21h-43" stroke-width="8"/><path class="tap-foot" d="M64 295h192" stroke-width="12"/>
    </g>
    <g class="person-body">
      ${haircut===4?`<path d="M111 62l-14 110q63 23 129-1l-16-108z" fill="${hair}"/>`:''}
      <path d="M113 136q47-20 94 0l31 60-15 105H97L82 196Z" fill="${shirt}"/>
      <path d="M97 195l10 87h106l10-87-4 106H101z" fill="var(--art-ink)" opacity=".12" stroke="none"/>
      <path d="M139 110v26q20 23 42 0v-26" fill="${skin}"/><path d="M140 111q20 15 40 0v12q-20 14-40 0" fill="var(--art-ink)" opacity=".12" stroke="none"/>
      <path d="M133 135l27 21 28-21-13 56h-30z" fill="var(--paper)"/>
      <path d="M128 135l32 21-21 19-18-31m72-9-33 21 21 19 18-31" fill="${shirt}"/>
      <path d="M131 143l9 21m48-21-9 21" stroke="var(--paper)" opacity=".32" stroke-width="2"/>
      ${blazer?'<path d="M120 142l-10 27 19 6-12 17 18 65m65-115 10 27-19 6 12 17-18 65" stroke="var(--paper)" stroke-width="2" opacity=".35"/>':'<path d="M161 163v42" stroke-width="1.5"/><circle cx="166" cy="174" r="1.5"/><circle cx="166" cy="187" r="1.5"/>'}
      ${ceo?'<path d="M159 158l-7 9 9 37 8-37z" fill="var(--shirt-red)"/>':'<path d="M134 142l25 59 28-59" stroke="var(--accent)" stroke-width="4"/><path d="M197 177h24v23q-13 10-24 0z" fill="none" stroke-width="1.5"/><path d="M202 171v9m6-9v9" stroke="var(--machine-edge)" stroke-width="3"/><rect x="184" y="200" width="21" height="29" rx="3" fill="var(--paper)" stroke-width="1.5"/><rect x="191" y="197" width="7" height="5" rx="1" fill="var(--machine-side)"/><circle cx="194" cy="209" r="4" fill="var(--shirt-blue)" stroke="none"/><path d="M189 217h11m-11 4h7" stroke-width="1.2"/>'}
      <g class="coworker-arm">${forearm}${sleeve}</g>
      <g class="coworker-arm" transform="translate(320 0) scale(-1 1)">${forearm}${sleeve}</g>
      <g class="head"><g transform="translate(32 -8) scale(1.26)">
        <ellipse cx="67" cy="63" rx="8" ry="11" fill="${skin}"/><ellipse cx="136" cy="63" rx="8" ry="11" fill="${skin}"/>
        <path d="M67 47q0-28 34-28 35 0 35 29l-2 28q-2 12-13 19l-17 8q-10 1-23-9-13-8-14-20z" fill="${skin}"/>
        <path d="M130 48v24q-1 20-26 28l-7-1q26-12 27-30V44z" fill="var(--art-ink)" opacity=".09" stroke="none"/>
        <g fill="${hair}" stroke="none">${HAIR_SHAPES[haircut]}</g>
        <path d="M77 53q8-5 17-2m16 1q9-3 16 2" stroke="${hair}" stroke-width="3.2"/>
        <g class="eyes"><path d="M77 63q7-7 15 0-7 7-15 0m34 0q7-7 15 1-8 6-15-1" fill="var(--paper)" stroke-width="1"/><ellipse cx="86" cy="62" rx="2.8" ry="3.5" fill="var(--art-ink)" stroke="none"/><ellipse cx="118" cy="62" rx="2.8" ry="3.5" fill="var(--art-ink)" stroke="none"/><circle cx="87" cy="60.5" r="1" fill="var(--paper)" stroke="none"/><circle cx="119" cy="60.5" r="1" fill="var(--paper)" stroke="none"/></g>
        <path d="M102 63l-3 11q3 2 7 0" opacity=".55" stroke-width="1.7"/>
        <ellipse cx="79" cy="75" rx="6" ry="3" fill="var(--shirt-red)" opacity=".25" stroke="none"/><ellipse cx="124" cy="75" rx="6" ry="3" fill="var(--shirt-red)" opacity=".25" stroke="none"/>
        <path class="smile" d="M91 83q10 5 21-1-4 10-12 9-6-1-9-8z" fill="var(--paper)" stroke-width="1.7"/><path class="frown" d="M92 87q9-7 20-2" stroke-width="2"/>
        ${h%7===0&&!jules?`<path d="M75 79q11 15 26 15 16 0 28-15-3 18-26 23-23-3-28-23z" fill="${hair}" stroke="none"/><path d="M92 79q10-4 19 0" stroke="${hair}" stroke-width="3"/>`:''}
        ${ceo||h%4===0?`<g fill="${ceo?'var(--art-ink)':'none'}" stroke-width="2.7"><rect x="72" y="56" width="26" height="17" rx="6"/><rect x="106" y="56" width="26" height="17" rx="6"/><path d="M98 61h8m-39-3 5 2m60 0 5-2"/></g>`:''}
        ${ceo?'<path d="M73 26l-5-20 20 10L102 3l14 13 20-10-5 20z" fill="var(--shirt-gold)"/><path d="M76 18h52" stroke="var(--paper)" stroke-width="2"/>':''}
        ${gary?'<path d="M78 70h14m18 0h15" stroke-width="2" opacity=".45"/><path d="M78 59h16m16 0h15" stroke-width="2"/>':''}
        ${jules||frank?`<path d="M63 61V43q0-31 39-31 39 0 39 31v18" stroke="var(--art-ink)" stroke-width="6"/><rect x="57" y="54" width="13" height="25" rx="6" fill="var(--machine-side)"/><rect x="134" y="54" width="13" height="25" rx="6" fill="var(--machine-side)"/><path d="M60 60v12m84-12v12" stroke="var(--paper)" opacity=".5"/>${frank?'<path d="M141 77q3 17-24 13" stroke-width="3"/><rect x="111" y="86" width="11" height="6" rx="3" fill="var(--art-ink)"/>':''}`:''}
      </g></g>
      <g class="held-device">${mounted}</g>
      <g class="holding-hands">${hand(false)}<g transform="translate(320 0) scale(-1 1)">${hand(false)}</g></g>
      <g class="crossed-arms">${hand(true)}<g transform="translate(320 0) scale(-1 1)">${hand(true)}</g></g>
      <g transform="translate(${gx-27} ${gy+7}) rotate(-19)"><path d="M-6-9h12v22H-6z" fill="var(--surface-2)"/><rect x="-8" y="-6" width="16" height="17" rx="5" fill="var(--machine-side)"/><rect x="-5" y="-3" width="10" height="11" rx="3" fill="var(--display-bg)" stroke-width="1"/><path d="M0 0v4h3" stroke="var(--display-text)" stroke-width="1"/></g>
    </g>
    <g class="patience-steam" stroke="var(--muted)" stroke-width="3"><path d="M75 65q-10-12 0-24t0-18M245 65q10-12 0-24t0-18"/></g>
    <g class="celebrate" stroke="var(--good)" stroke-width="4"><path d="M78 92l-15-8m179 8 15-8M95 28l-8-10m138 10 8-10M226 111l9 9 17-22"/></g>
  </svg>`;
}

// --- interior architecture ---------------------------------------------------
const plantSVG = (x,y,scale=1) => `<g transform="translate(${x} ${y}) scale(${scale})" stroke="var(--leaf-dark)" stroke-width="2.5"><path d="M30 86V7m0 36Q0 40 5 16q28 2 25 27m0 20q-35 2-29-24 27 1 29 24m0-32q31-1 29-25-26 4-29 25m0 43q33-2 32-25-28 4-32 25" fill="var(--leaf)"/><path d="M6 81h49l-7 43H13z" fill="var(--machine-shell)" stroke="var(--machine-edge)"/><path d="M11 88h39" stroke="var(--paper)" opacity=".6"/></g>`;
const officeChair = (x,y) => `<g transform="translate(${x} ${y})" stroke="var(--machine-edge)" stroke-width="3"><rect width="42" height="55" rx="12" fill="var(--surface-2)"/><path d="M7 11h28m-28 8h28m-28 8h28m-28 8h28" stroke="var(--line)" stroke-width="1"/><path d="M-5 53h53v12H-5z" fill="var(--machine-side)"/><path d="M22 66v23m-20 7 20-7 20 7m-20-6v9"/><circle cx="2" cy="97" r="3"/><circle cx="42" cy="97" r="3"/></g>`;
export function roomSVG() {
  return `<svg class="office-room" aria-hidden="true" viewBox="0 0 1440 740" preserveAspectRatio="xMidYMin slice" fill="none" stroke-linecap="round" stroke-linejoin="round">
    <path d="M0 0h1440v740H0z" fill="var(--tile)"/><path d="M0 0h1440v350H0z" fill="var(--wall)"/>
    <path d="M0 0h1440v35H0z" fill="var(--wall-base)"/><path d="M0 36h1440v13H0z" fill="var(--art-shadow)" opacity=".25"/><path d="M0 35h1440" stroke="var(--machine-edge)" stroke-width="3"/>
    ${[100,470,840,1210].map(x=>`<path d="M${x} 0l-18 35m200-35 18 35" stroke="var(--machine-edge)" opacity=".25"/><rect x="${x+30}" y="13" width="140" height="7" rx="3" fill="var(--paper)"/><path d="M${x+23} 8h154v8H${x+23}z" fill="var(--machine-edge)"/><path d="M${x+48} 0v8m104-8v8" stroke="var(--machine-edge)" stroke-width="2"/><path d="M${x+28} 24h145" stroke="var(--paper)" opacity=".15" stroke-width="7"/>`).join('')}
    <path d="M0 350h1440v12H0z" fill="var(--wall-base)"/><path d="M0 362h1440" stroke="var(--machine-edge)" stroke-width="3"/>
    ${[480,620].map(y=>`<path d="M0 ${y}h1440" stroke="var(--mat-line)" opacity=".18" stroke-width="2"/>`).join('')}
    ${[0,260,520,780,1040,1300].map(x=>`<path d="M${x} 740L${450+x*.4} 362" stroke="var(--mat-line)" opacity=".18" stroke-width="2"/>`).join('')}
    <g class="office-corridor" stroke="var(--machine-edge)" stroke-width="3">
      <rect x="31" y="58" width="172" height="299" rx="4" fill="var(--machine-side)"/><path d="M42 69h150v278H42z" fill="var(--surface-2)"/>
      <path d="M49 76h136v260H49z" fill="var(--wall-base)"/><path d="M51 77l132 258m-132-227 105 227" stroke="var(--paper)" opacity=".12" stroke-width="14"/>
      <path d="M50 161h134v77H50z" fill="var(--paper)" opacity=".8" stroke="none"/>
      <text x="117" y="189" text-anchor="middle" fill="var(--art-ink)" stroke="none" font-family="var(--font-mono)" font-size="16" font-weight="700">IT</text><text x="117" y="211" text-anchor="middle" fill="var(--art-ink)" stroke="none" font-family="var(--font-mono)" font-size="12" font-weight="700">OPERATIONS</text>
      <path d="M50 248h134m-134 10h134" stroke="var(--paper)" opacity=".5" stroke-width="4"/><path d="M175 264v38" stroke="var(--art-ink)" stroke-width="7"/><path d="M177 265v35" stroke="var(--machine-shell)" stroke-width="3"/>
      <rect x="211" y="213" width="17" height="34" rx="3" fill="var(--surface)"/><path d="M216 221h7" stroke="var(--good)"/><path d="M216 231h7m-7 4h7" stroke="var(--accent)" stroke-width="1"/>
    </g>
    <g class="office-glass">
      <path d="M242 64h468v278H242z" fill="var(--wall-base)"/>
      <path d="M250 72h452v267H250z" fill="var(--surface-2)"/>
      <path d="M250 72h452l-28 30H280z" fill="var(--wood-light)" opacity=".35"/>
      <path d="M280 101h394v183H280z" fill="var(--wall-base)"/>
      <path d="M293 116h117v101H293zm133 0h117v101H426zm133 0h101v101H559z" fill="var(--sky)"/>
      <path d="M303 198v-37h19v-17h24v54h13v-24h29v24m49 0v-43h21v-16h29v59h14v-31h25v31m45 0v-53h25v53h14v-37h29v37" fill="var(--distant)"/>
      <path d="M292 218h368m-368 8h368" stroke="var(--machine-shell)" stroke-width="3"/>
      <path d="M250 338l30-54m422 54-28-54" stroke="var(--machine-edge)" stroke-width="2"/>
      <path d="M250 286h452v53H250z" fill="var(--wall-base)"/>
      <path d="M250 72h452v28H250z" fill="var(--wall)"/><path d="M276 86h120m73 0h120" stroke="var(--paper)" stroke-width="7"/>
      ${[280,476].map(x=>`<g stroke="var(--machine-edge)" stroke-width="2"><path d="M${x} 244h178v12H${x}z" fill="var(--wood-light)"/><path d="M${x+8} 256v65m154-65v65" stroke-width="5"/><rect x="${x+36}" y="190" width="66" height="44" rx="3" fill="var(--machine-side)"/><path d="M${x+42} 196h54v31h-54z" fill="var(--display-bg)"/><path d="M${x+48} 203h41m-41 7h21m-21 7h32" stroke="var(--display-line)" stroke-width="2"/><path d="M${x+68} 234v10m-11 0h23" stroke-width="4"/><rect x="${x+128}" y="213" width="21" height="30" rx="3" fill="var(--surface)"/><path d="M${x+132} 219h13m-13 5h13m-13 5h13" stroke="var(--line)" stroke-width="1"/><path d="M${x+14} 258h42v56h-42z" fill="var(--machine-side)"/><path d="M${x+18} 275h34m-34 17h34m-23-25h10m-10 17h10m-10 17h10" stroke-width="1"/></g>${officeChair(x+76,233)}`).join('')}
      <path d="M250 173h452v30H250z" fill="var(--paper)" opacity=".17"/><path d="M250 216h452m-452 9h452" stroke="var(--paper)" opacity=".45" stroke-width="5"/>
      <path d="M242 64h468v278H242zM398 64v278m156-278v278" stroke="var(--machine-edge)" stroke-width="7"/>
      <path d="M260 72l122 258m30-258 122 258m30-258 122 258" stroke="var(--paper)" opacity=".07" stroke-width="13"/>
    </g>
    <g class="network-rack" transform="translate(743 67)" stroke="var(--machine-edge)" stroke-width="2.5">
      <rect width="165" height="164" rx="7" fill="var(--machine-side)"/><rect x="9" y="10" width="147" height="144" rx="3" fill="var(--display-bg)"/>
      ${[22,65,113].map((y,i)=>`<rect x="18" y="${y}" width="129" height="31" rx="3" fill="var(--surface-2)"/>${Array.from({length:8},(_,n)=>`<rect x="${25+n*12}" y="${y+7}" width="8" height="7" rx="1" fill="var(--machine-side)" stroke-width="1"/><circle cx="${28+n*12}" cy="${y+20}" r="1.3" fill="var(--good)" stroke="none"/>`).join('')}<path d="M132 ${y+8}h7m-7 5h7m-7 5h7" stroke="var(--line)" stroke-width="1"/>`).join('')}
      ${[0,1,2,3,4,5].map(i=>`<path d="M${29+i*12} 35v${17+i*3}q0 ${15+i*2} ${60-i*5} ${15+i*2}v${12-i*5}" stroke="var(--${i%2?'accent':'display-text'})" stroke-width="2"/>`).join('')}
      <text x="82" y="181" text-anchor="middle" fill="var(--ink)" stroke="none" font-family="var(--font-mono)" font-size="10" font-weight="700">NETWORK / 03</text>
    </g>
    <g transform="translate(738 274)" stroke="var(--machine-edge)" stroke-width="2"><path d="M0 0h175v80H0z" fill="var(--machine-side)"/><path d="M0 38h175M5 80v8m165-8v8" stroke-width="4"/>${[10,64,118].map(x=>`<path d="M${x} 29l6-26h31l-5 26z" fill="var(--surface-2)"/><path d="M${x-2} 31h45" stroke="var(--paper)" stroke-width="3"/><rect x="${x+3}" y="49" width="35" height="23" rx="2" fill="var(--wood-light)"/>${assetTag(x+16,53)}<path d="M${x+15} 64h13" stroke="var(--paper)" stroke-width="2"/>`).join('')}</g>
    <g class="acoustic-panels" stroke="var(--machine-edge)" stroke-width="1.5"><path d="M921 90h17v66h-17zm0 79h17v101h-17z" fill="var(--machine-side)"/><path d="M925 94v58m5-58v58m4-58v58m-9 21v93m5-93v93m4-93v93" stroke="var(--line)" opacity=".7"/></g>
    <g class="city-window" transform="translate(949 59)"><rect width="454" height="285" rx="6" fill="var(--machine-edge)"/><path d="M8 8h438v264H8z" fill="var(--sky)"/>
      <circle class="window-sun" cx="360" cy="60" r="22" fill="var(--sun)"/><g class="window-stars" fill="var(--paper)"><circle cx="45" cy="39" r="2"/><circle cx="178" cy="71" r="2"/><circle cx="283" cy="30" r="2"/></g><path class="window-moon" d="M364 32a24 24 0 1 0 22 35 24 24 0 0 1-22-35" fill="var(--paper)"/>
      <path d="M8 272V163h54v-42h50v151h30V96h68v176h26V153h46v119h28V129h66v143h25V83h45v189z" fill="var(--distant)"/>
      ${[20,73,154,247,323,411].map((x,i)=>`<path d="M${x} ${180-i*8}h18m-18 15h18m-18 15h18m-18 15h18m-18 15h18" stroke="var(--paper)" stroke-width="5" stroke-dasharray="5 4" opacity=".25"/>`).join('')}
      <path d="M152 8v264m149-264v264M8 92h438" stroke="var(--machine-edge)" stroke-width="7"/><path d="M14 10l120 252m40-252 110 252m35-252 110 252" stroke="var(--paper)" opacity=".08" stroke-width="17"/>
      <path d="M-9 285h472" stroke="var(--wood-light)" stroke-width="12"/>
    </g>
    <g transform="translate(636 83)"><svg width="61" height="61" viewBox="0 0 70 70"><circle cx="35" cy="33" r="29" fill="var(--surface)" stroke="var(--machine-edge)" stroke-width="3"/><path d="M35 8v4m0 42v4M10 33h4m42 0h4" stroke="var(--muted)" stroke-width="2"/><path class="clock-hour" d="M35 33V18" stroke="var(--ink)" stroke-width="3.5"/><path class="clock-minute" d="M35 33V11" stroke="var(--accent)" stroke-width="2"/><circle cx="35" cy="33" r="3" fill="var(--ink)"/></svg></g>
    <g class="office-wall-plate" transform="translate(53 91)"><rect width="53" height="24" rx="3" fill="var(--surface)"/><text x="26" y="16" text-anchor="middle" fill="var(--ink)" font-family="var(--font-mono)" font-size="10" font-weight="700">03 / IT</text></g>
    <path d="M0 366h1440v14H0z" fill="var(--art-shadow)" opacity=".18"/>
    ${plantSVG(1303,259,.9)}${plantSVG(678,260,.7)}${plantSVG(10,286,.6)}
  </svg>`;
}

export function repairBenchSVG() {
  return `<svg class="repair-bench-art" aria-hidden="true" viewBox="0 0 1440 180" preserveAspectRatio="none" fill="none" stroke="var(--machine-edge)" stroke-width="2.5" stroke-linejoin="round" stroke-linecap="round">
    <path d="M40 111h29v69H40zm1331 0h29v69h-29z" fill="var(--machine-side)"/><path d="M69 153h1302" stroke-width="12"/><path d="M69 153l54 27m1248-27-54 27" stroke-width="8"/>
    <path d="M37 32h1366l35 63H2z" fill="var(--wood-light)"/><path d="M2 95h1436v23H2z" fill="var(--machine-side)"/><path d="M5 98h1430" stroke="var(--paper)" opacity=".65"/><path d="M14 117h1412" stroke-width="4"/>
    <path d="M207 40h474l30 46H181z" fill="var(--bench-mat)" stroke="var(--mat-line)"/>
    ${[48,57,66,75].map(y=>`<path d="M${211-(y-48)*.5} ${y}h${466+(y-48)}" stroke="var(--mat-line)" stroke-width=".7" opacity=".65"/>`).join('')}
    ${Array.from({length:22},(_,i)=>`<path d="M${217+i*21} 43l${(i-10)*1.5} 39" stroke="var(--mat-line)" stroke-width=".7" opacity=".65"/>`).join('')}
    <path d="M209 79l10-18 10 18zM219 66v6m0 3v1" stroke="var(--display-text)" stroke-width="1.5"/>
    <path d="M239 79h21m-21-4h13" stroke="var(--display-text)" stroke-width="1" opacity=".7"/>
    <g class="cable-caddy" transform="translate(47 -21)">
      <path d="M0 0h109v90H0z" fill="var(--surface-2)"/><path d="M-5 89h120l6 10H-10z" fill="var(--machine-side)"/>
      ${[18,59].map((y,n)=>`<path d="M4 ${y}h98" stroke-width="5"/><ellipse cx="18" cy="${y}" rx="10" ry="19" fill="var(--machine-side)"/><path d="M18 ${y-17}h70v34H18z" fill="var(--${n?'display-line':'accent'})"/>${Array.from({length:14},(_,i)=>`<path d="M${22+i*4.8} ${y-17}q-6 17 0 34" stroke="var(--${n?'display-text':'paper'})" opacity=".6" stroke-width="1.5"/>`).join('')}<ellipse cx="89" cy="${y}" rx="10" ry="19" fill="var(--machine-side)"/><ellipse cx="89" cy="${y}" rx="4" ry="13" fill="var(--surface-2)"/>`).join('')}
      <path d="M3-1v90m103-90v90" stroke="var(--machine-side)" stroke-width="7"/><path d="M89 79q22 0 29-13" stroke="var(--display-text)" stroke-width="3"/>
    </g>
    <g class="repair-tools" transform="translate(720 39)">
      <path d="M0 0h130l22 47H-21z" fill="var(--surface-2)"/><path d="M-16 48h166v7H-16z" fill="var(--machine-side)"/>
      ${[10,31,52,73].map((x,i)=>`<path d="M${x} 6l-5 29" stroke="var(--machine-shell)" stroke-width="3"/><path d="M${x-2} 21l-3 15" stroke="var(--accent)" stroke-width="6"/><path d="M${x} 3v4" stroke-width="1.4"/>`).join('')}
      <path d="M98 10l-5 17m12-17-5 17m-7 0 7 4" stroke="var(--display-text)" stroke-width="2.5"/><path d="M115 30l-11 12h22z" fill="var(--accent)"/>
    </g>
    <g class="tool-cup" transform="translate(166 9)"><path d="M0 0l3 45h25l3-45z" fill="var(--machine-side)"/><ellipse cx="15" cy="0" rx="16" ry="5" fill="var(--surface-2)"/><path d="M6 9l1 28m8-27v27m9-27-1 27" stroke="var(--line)"/><path d="M8 2l-7-26m15 27 1-33m6 33 8-24" stroke="var(--machine-shell)" stroke-width="3"/><path d="M1-24l-2-9m18 4v-8m14 16 3-8" stroke="var(--accent)" stroke-width="6"/></g>
    <g class="device-dock" transform="translate(889 11)"><path d="M0 0h52l10 59H8z" fill="var(--machine-side)"/><path d="M6 6h40l7 44H12z" fill="var(--surface-2)"/><path d="M-5 52h72l8 18H-9z" fill="var(--machine-shell)"/><path d="M8 61h24m7 0h7" stroke="var(--display-line)" stroke-width="3"/><circle cx="56" cy="61" r="2" fill="var(--good)" stroke="none"/></g>
    <g class="bench-plaque"><rect x="641" y="101" width="158" height="23" rx="4" fill="var(--machine-shell)"/><text x="720" y="117" fill="var(--art-ink)" stroke="none" text-anchor="middle" font-family="var(--font-mono)" font-size="10" font-weight="700" letter-spacing="1.5">INTERNAL IT / 03</text><circle cx="649" cy="112" r="2"/><circle cx="791" cy="112" r="2"/></g><path class="compact-bench-leg" d="M650 111h29v69h-29z" fill="var(--machine-side)"/>
    <path d="M86 123h147v46H86z" fill="var(--wood)"/><path d="M144 135h34" stroke="var(--machine-shell)" stroke-width="4"/>
    <path d="M1207 123h147v46h-147z" fill="var(--wood)"/><path d="M1265 135h34" stroke="var(--machine-shell)" stroke-width="4"/>
  </svg>`;
}

export function deskSVG() {
  return `<svg class="desk-art" aria-hidden="true" viewBox="0 0 900 180" preserveAspectRatio="none" fill="none" stroke="var(--machine-edge)" stroke-width="3" stroke-linejoin="round" stroke-linecap="round">
    <g class="desk-surface"><path d="M72 24h756l64 88H8z" fill="var(--wood-light)"/><path d="M8 112h884v17H8z" fill="var(--machine-side)"/><path d="M49 130h16v50H49zm786 0h16v50h-16z" fill="var(--machine-side)"/><path d="M16 116h868" stroke="var(--paper)" opacity=".4"/></g>
    <path d="M205 53h480l25 50H180z" fill="var(--bench-mat)" stroke="var(--mat-line)"/>
    <path d="M513 0l55 22 151-9 37 44" stroke="var(--machine-edge)" stroke-width="17"/><path d="M513 0l55 22 151-9 37 44" stroke="var(--machine-side)" stroke-width="9"/><circle cx="568" cy="22" r="9" fill="var(--machine-shell)"/><circle cx="719" cy="13" r="9" fill="var(--machine-shell)"/><path d="M735 56h48l8 8h-65z" fill="var(--machine-shell)"/>
    <path d="M249 62h330l19 33H229z" fill="var(--machine-side)"/><path d="M256 68h313m-318 8h324m-328 8h333" stroke="var(--machine-edge)" stroke-width="4" stroke-dasharray="13 5"/><path d="M350 90h120" stroke-width="4"/>
    <path d="M629 72q13-24 31-2l6 18q-22 12-42-1z" fill="var(--machine-shell)"/><path d="M643 64v13" stroke-width="2"/>
    <path d="M100 35h48v55h-48z" fill="var(--surface)"/><path d="M149 44h13q24 25-12 31" stroke-width="5"/><ellipse cx="124" cy="35" rx="24" ry="5" fill="var(--display-bg)"/><path d="M113 52l-5 7 5 7m22-14 5 7-5 7m-10-17-4 21" stroke="var(--accent)" stroke-width="3"/>
    <path d="M779 67l45-6 13 30-46 6z" fill="var(--paper)"/><path d="M789 74l28-4m-24 12 24-4" stroke-width="2"/>
  </svg>`;
}

// --- close-up workbench art ---------------------------------------------------
const artText = value => String(value).replace(/[&<>"']/g, c => ({ '&':'&amp;', '<':'&lt;', '>':'&gt;', '"':'&quot;', "'":'&#39;' }[c]));
export const DEVICE_NAMES = { laptop:'Laptop', printer:'Printer', phone:'Phone', monitor:'Monitor', server:'Server', tv:'Room display' };
export const DEVICE_HOTSPOTS = {
  laptop: { screen:[120,118], power:[528,272], security:[120,205] },
  printer: { screen:[440,104], power:[530,230], security:[110,180] },
  phone: { screen:[205,128], power:[440,82], security:[440,206], ports:[440,303] },
  monitor: { screen:[75,125], power:[550,267], security:[75,230] },
  server: { screen:[140,95], power:[490,320], security:[140,190] },
  tv: { screen:[65,120], power:[575,270], security:[65,230] },
};
export const DEVICE_CONNECTION_VIEWS = {
  laptop: { label:'Back & side ports', caption:'Rear lid, hinges and side connections.', hotspot:[563,341] },
  printer: { label:'Rear connections', caption:'Paper feed, service door, USB and power sockets.', hotspot:[520,270] },
  phone: { label:'Back & USB-C', caption:'Rear cameras and bottom charging port. Wireless settings are on the front.', hotspot:[440,313] },
  monitor: { label:'Rear connections', caption:'Display inputs below the rear mounting plate.', hotspot:[514,280] },
  server: { label:'Rear connections', caption:'Cooling fans, network interfaces and power supply.', hotspot:[516,250] },
  tv: { label:'Rear connections', caption:'Source inputs on the rear panel.', hotspot:[534,270] },
};
const screenPanel = (x,y,w,h,status,cue) => {
  const off=status==='NO POWER';
  return `<rect x="${x}" y="${y}" width="${w}" height="${h}" rx="7" fill="var(--display-bg)" stroke="var(--machine-edge)" stroke-width="2"/>
    ${off?`<path d="M${x+12} ${y+12}h${w*.36}l-${w*.36} ${h*.52}z" fill="var(--paper)" opacity=".035"/>`:`<path d="M${x+12} ${y+20}h${w-24}" stroke="var(--display-line)" stroke-width="1"/><circle cx="${x+14}" cy="${y+10}" r="2" fill="var(--display-text)"/>
    <text x="${x+w/2}" y="${y+h*.55}" text-anchor="middle" fill="var(--display-text)" stroke="none" font-size="${w<160?10:15}" font-family="var(--font-mono)">${artText(status)}</text>
    ${cue==='update'?`<path d="M${x+w*.27} ${y+h*.72}h${w*.46}" stroke="var(--display-line)" stroke-width="5"/><path d="M${x+w*.27} ${y+h*.72}h${w*.15}" stroke="var(--display-text)" stroke-width="5"/>`:cue==='locked'?`<rect x="${x+w/2-10}" y="${y+h*.7}" width="20" height="15" rx="3" stroke="var(--display-text)"/><path d="M${x+w/2-6} ${y+h*.7}v-5a6 6 0 0 1 12 0v5" stroke="var(--display-text)"/>`:cue==='ready'?`<path d="M${x+w/2-7} ${y+h*.72}l5 5 10-12" stroke="var(--good)" stroke-width="3"/>`:''}`}`;
};
const inspectionScrews = points => points.map(([x,y])=>`<circle cx="${x}" cy="${y}" r="2.3" fill="var(--machine-side)"/><path d="M${x-1} ${y}h2" stroke="var(--machine-edge)" stroke-width=".8"/>`).join('');
const rearLabel=(x,y)=>`<rect x="${x}" y="${y}" width="83" height="29" rx="3" fill="var(--paper)"/><path d="M${x+7} ${y+7}h43" stroke="var(--art-ink)" stroke-width="2"/><path d="M${x+7} ${y+15}h66" stroke="var(--art-ink)" stroke-width="7" stroke-dasharray="1 2 3 2"/><text x="${x+7}" y="${y+25}" font-family="var(--font-mono)" font-size="6" fill="var(--art-ink)" stroke="none">IT ASSET / 042</text>`;
const rearCable=(x,y,loose,type='display')=>`<g class="${loose?'connector-loose':'connector-seated'}" transform="translate(${x+(loose?43:0)} ${y})"><path d="M12 0h16q45 0 45 39t-54 33" stroke="var(--machine-edge)" stroke-width="8"/><path d="M12 0h16q45 0 45 39t-54 33" stroke="var(--shirt-blue)" stroke-width="4"/><rect x="-8" y="-8" width="25" height="16" rx="3" fill="var(--machine-side)"/><path d="M-16-5h8v10h-8z" fill="var(--machine-shell)"/>${type==='network'?'<path d="M-12-6h10v-4h-7z" fill="var(--paper)"/>':''}</g>`;

export function inspectionDeviceSVG(device, observation, view='front') {
  const cue=observation?.cue || 'ready', status=observation?.screen || 'READY';
  const powered=observation?.physical?.powered ?? status!=='NO POWER';
  const loose=cue==='loose', shell='var(--machine-shell)', side='var(--machine-side)', edge='var(--machine-edge)';
  const indicator=powered?'var(--good)':'var(--display-bg)';
  let body='';
  if(view==='rear' && device==='laptop') {
    body=`<g class="laptop-rear" transform="translate(0 55)">
      <path d="M168 270l278-26 74-54-278 26z" fill="${shell}"/><path d="M168 270l278-26 74-54v11l-74 54-278 26z" fill="${side}"/>
      <path d="M139 78q-2-13 12-15l252-23q13-1 16 12l27 192-278 26z" fill="${side}"/><path d="M143 78q-1-9 9-10l249-23q10-1 11 9l25 183-267 26z" fill="${shell}"/>
      <path d="M156 80l239-22 24 169-239 23z" stroke="var(--paper)" opacity=".45" stroke-width="1.5"/>
      <path d="M170 260l54-5 2 9-54 5zm219-20 49-5 2 9-49 5z" fill="${side}"/><path d="M176 264l46-4m171-15 44-4" stroke="var(--paper)" opacity=".5" stroke-width="1"/>
      <path d="M190 274l232-21" stroke="${edge}" stroke-width="3" stroke-dasharray="1 3"/>
      <path d="M174 278l268-25 73-53" stroke="var(--paper)" opacity=".6" stroke-width="1"/>
      <g transform="translate(481 224) rotate(-36)"><rect x="-10" y="-4" width="20" height="8" rx="4" fill="var(--display-bg)"/><path d="M-6 0H6" stroke="${side}" stroke-width="1"/></g>
      <g transform="translate(506 205) rotate(-36)"><path d="M-8-4H8L5 3H-5z" fill="var(--display-bg)"/></g>
      <g class="${loose?'connector-loose':'connector-seated'}" transform="translate(${loose?535:484} ${loose?222:226}) rotate(-36)"><path d="M16 0h16q35 0 32 30t-42 35" stroke="${edge}" stroke-width="7"/><path d="M16 0h16q35 0 32 30t-42 35" stroke="var(--shirt-blue)" stroke-width="3.5"/><rect x="-6" y="-7" width="22" height="14" rx="4" fill="${side}"/><rect x="-18" y="-4" width="12" height="8" rx="3" fill="${shell}"/><path d="M-16 0h7" stroke="${edge}" stroke-width="1"/></g>
      <circle cx="458" cy="242" r="1.8" fill="${indicator}" stroke="none"/>
      <g transform="translate(192 211) rotate(-5)">${rearLabel(0,0)}</g>
      <path d="M284 133l15-1 2 18-15 1z" fill="${side}" stroke-width="1.5"/><path d="M290 138l5 4-4 5" stroke="var(--paper)" stroke-width="1.3"/>
    </g>`;
  } else if(view==='rear' && device==='phone') {
    body=`<path d="M238 34h156l9 9v302l-12 12H238z" fill="${side}"/><rect x="229" y="25" width="164" height="321" rx="26" fill="${shell}"/><path d="M243 38h136v291H243z" stroke="var(--paper)" stroke-width="1" opacity=".4"/>
      <rect x="242" y="39" width="65" height="77" rx="17" fill="${side}"/><circle cx="260" cy="60" r="12" fill="var(--display-bg)"/><circle cx="287" cy="94" r="12" fill="var(--display-bg)"/><circle cx="260" cy="60" r="6" stroke="var(--display-line)"/><circle cx="287" cy="94" r="6" stroke="var(--display-line)"/><circle cx="286" cy="59" r="5" fill="var(--paper)"/>
      ${rearLabel(265,274)}<path d="M294 347h35" stroke="var(--display-bg)" stroke-width="6"/><path d="M265 347h17m66 0h17" stroke="${edge}" stroke-width="3" stroke-dasharray="1 4"/>`;
  } else if(view==='rear' && device==='printer') {
    body=`<path d="M168 105V38h243v72" fill="var(--paper)"/><path d="M165 103l-32 30v191h346V133l-32-30z" fill="${side}"/><rect x="144" y="125" width="324" height="203" rx="14" fill="${shell}"/><path d="M174 145h229v107H174z" fill="${side}"/><path d="M261 154h59v10h-59z" fill="${edge}"/>
      ${[185,196,207,218,229].map(y=>`<path d="M188 ${y}h200" stroke="${edge}" stroke-width="2"/>`).join('')}
      ${rearLabel(178,275)}<path d="M365 275h22l4 5v20h-30v-20z" fill="var(--display-bg)"/><path d="M369 284h14v9h-14z" fill="${side}"/><path d="M417 275h25v24h-25z" fill="var(--display-bg)"/>${rearCable(430,287,loose,'power')}${inspectionScrews([[155,139],[453,139],[155,314],[453,314]])}`;
  } else if(view==='rear' && device==='server') {
    const power=observation?.physical?.connector==='power';
    body=`<path d="M183 29h234l31 21v305H183z" fill="${side}"/><rect x="171" y="29" width="246" height="326" rx="8" fill="${shell}"/><path d="M185 41h218v299H185z" fill="${side}"/>
      <circle cx="321" cy="114" r="49" fill="var(--display-bg)"/>${[16,28,39].map(r=>`<circle cx="321" cy="114" r="${r}" stroke="var(--display-line)" stroke-width="2"/>`).join('')}<path d="M285 79l72 70m0-70-72 70" stroke="${side}" stroke-width="3"/><circle cx="321" cy="114" r="10" fill="${side}"/>
      <rect x="196" y="54" width="53" height="151" rx="4" fill="var(--display-bg)"/>${[70,94,118].map(y=>`<rect x="205" y="${y}" width="29" height="11" rx="2" fill="${side}"/><path d="M210 ${y+4}h19" stroke="var(--paper)" stroke-width="1"/>`).join('')}
      <rect x="204" y="160" width="32" height="27" rx="2" fill="var(--display-bg)" stroke="var(--paper)" stroke-width="1"/><path d="M209 164v9m5-9v9m5-9v9m5-9v9m5-9v9" stroke="var(--sun)" stroke-width="1"/><circle cx="240" cy="181" r="2" fill="${loose&&!power?'var(--display-bg)':'var(--good)'}" stroke="none"/>
      ${[218,234,250].map(y=>`<path d="M200 ${y}h183v10H200z" fill="var(--display-bg)"/><path d="M210 ${y+5}h143" stroke="${side}" stroke-width="2" stroke-dasharray="2 3"/>`).join('')}
      <rect x="201" y="283" width="181" height="46" rx="3" fill="var(--display-bg)"/><path d="M211 291h72m-72 7h72m-72 7h72m-72 7h72" stroke="${side}" stroke-width="2"/><path d="M335 292h28l5 5v20h-38v-20z" fill="${side}"/>
      ${power?rearCable(351,304,loose,'power'):`<g transform="translate(0 -1)">${rearCable(222,175,loose,'network')}</g>`}${inspectionScrews([[178,37],[410,37],[178,347],[410,347]])}`;
  } else if(view==='rear') {
    const tv=device==='tv', x=tv?87:119, w=tv?452:388;
    body=`<rect x="${x}" y="53" width="${w}" height="253" rx="13" fill="${side}"/><rect x="${x+8}" y="60" width="${w-16}" height="238" rx="11" fill="${shell}"/><path d="M${x+25} 83h${w-50}" stroke="${side}" stroke-width="10" stroke-dasharray="2 4"/>
      <path d="M259 125h108v119H259z" fill="${side}"/>${inspectionScrews([[270,137],[356,137],[270,231],[356,231]])}
      ${tv?'<path d="M155 303l-28 44h37m312-44 27 44h-37" stroke-width="9"/>':`<path d="M289 180h48v132l23 36h-92l21-36z" fill="${side}"/><path d="M238 349h153l25 12H214z" fill="${shell}"/>`}
      ${rearLabel(x+24,205)}<path d="M377 216h97v63h-97z" fill="${side}"/><path d="M389 233h25l-4 10h-17z" fill="var(--display-bg)"/><path d="M431 230h24v17h-24z" fill="var(--display-bg)"/><path d="M386 264h72" stroke="${edge}" stroke-width="1"/>${rearCable(442,239,loose)}
      <path d="M${x+26} 287h${w-52}" stroke="${side}" stroke-width="3"/>`;
  } else if(device==='laptop') {
    body=`<g class="laptop-front"><rect x="158" y="35" width="316" height="208" rx="14" fill="${side}"/><rect x="162" y="38" width="308" height="201" rx="12" fill="${shell}"/>
      ${screenPanel(173,52,286,171,status,cue)}<circle cx="316" cy="44" r="2" fill="var(--display-bg)"/><path d="M292 230h48" stroke="${side}" stroke-width="2"/>
      <path d="M180 240h54v9h-54zm218 0h54v9h-54z" fill="${side}"/><path d="M163 249h307l75 92H87z" fill="${shell}"/><path d="M87 341h458l-15 13H101z" fill="${side}"/><path d="M92 342h447" stroke="var(--paper)" opacity=".6" stroke-width="1"/>
      <path d="M177 259h277l35 43H144z" fill="${side}" stroke-width="1"/>
      ${Array.from({length:4},(_,row)=>Array.from({length:12},(_,col)=>`<path d="M${180+col*22-row*4} ${264+row*9}h17l2 6h-19z" fill="var(--surface-2)" stroke="${edge}" stroke-width=".65"/>`).join('')).join('')}
      <path d="M263 310h102l7 23H255z" fill="${side}" stroke-width="1"/><path d="M266 313h96" stroke="var(--paper)" stroke-width="1" opacity=".4"/>
      <path d="M156 260l-26 38m341-38 26 38" stroke="${side}" stroke-width="7" stroke-dasharray="1 2"/>
      <rect x="459" y="253" width="13" height="7" rx="3" fill="${indicator}" stroke-width="1"/>
      <path d="M461 255h8" stroke="${powered?'var(--paper)':'var(--machine-side)'}" stroke-width="1"/>
      <g transform="translate(408 314) scale(.55)">${rearLabel(0,0)}</g><path d="M288 344h58" stroke="${edge}" stroke-width="2"/></g>`;
  } else if(device==='phone') {
    body=`<path d="M243 28h155l8 9v306l-10 12H243z" fill="${side}"/><rect x="231" y="22" width="166" height="329" rx="26" fill="${shell}"/>${screenPanel(241,38,146,293,status,cue)}<rect x="292" y="42" width="44" height="8" rx="4" fill="${edge}"/><path d="M295 322h39" stroke="var(--paper)" stroke-width="3"/><path d="M401 96v29m-173-41v21m0 11v21" stroke-width="4"/>`;
  } else if(device==='printer') {
    body=`<path d="M153 142l28-38h286l28 38v179H153z" fill="${side}"/><path d="M211 142V43h190v101" fill="var(--paper)"/><path d="M234 69h145m-145 15h145m-145 15h90" stroke="var(--muted)" stroke-width="3"/><rect x="135" y="141" width="359" height="181" rx="20" fill="${shell}"/>${screenPanel(319,157,121,58,status,cue)}<circle cx="464" cy="205" r="7" fill="${indicator}"/><path d="M166 236h253v30H166z" fill="var(--display-bg)"/><path d="M201 252h187l-13 93H185z" fill="var(--paper)"/><path d="M211 274h144m-147 13h144m-147 13h83" stroke="var(--display-line)" stroke-width="3"/>${rearLabel(390,280)}`;
  } else if(device==='server') {
    body=`<path d="M192 30h231l30 22v300H192z" fill="${side}"/><rect x="173" y="30" width="249" height="322" rx="12" fill="${shell}"/>${screenPanel(190,48,215,87,status,cue)}${[154,207,260].map((y,i)=>`<rect x="190" y="${y}" width="214" height="42" rx="5" fill="var(--display-bg)"/><path d="M203 ${y+10}h151m-151 8h151m-151 8h151" stroke="var(--display-line)" stroke-width="2"/><circle cx="388" cy="${y+20}" r="4" fill="${powered?(i===0&&cue!=='ready'?'var(--warn)':'var(--good)'):'var(--display-bg)'}"/>`).join('')}<path d="M188 353v12m219-12v12" stroke-width="8"/><circle cx="398" cy="329" r="5" fill="${indicator}"/>`;
  } else {
    const tv=device==='tv',x=tv?90:120,w=tv?448:388;
    body=`${tv?'<path d="M157 284l-29 61h39m302-61 29 61h-39" stroke-width="8"/>':`<path d="M286 280h55l16 53h-87z" fill="${side}"/><path d="M238 333h153l25 13H214z" fill="${shell}"/>`}
      <rect x="${x}" y="43" width="${w}" height="244" rx="12" fill="${side}"/>${screenPanel(x+8,51,w-16,221,status,cue)}<circle cx="${x+w-16}" cy="280" r="2.5" fill="${indicator}" stroke="none"/>`;
  }
  return `<svg class="exam-device-svg" aria-hidden="true" viewBox="0 0 640 400" fill="none" stroke="${edge}" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><ellipse cx="320" cy="367" rx="245" ry="13" fill="var(--art-shadow)" stroke="none"/>${body}<path d="M66 385h510" stroke="var(--mat-line)" stroke-width="1"/>${Array.from({length:27},(_,i)=>`<path d="M${66+i*19} 385v-${i%5===0?6:3}" stroke="var(--mat-line)" stroke-width="1"/>`).join('')}</svg>`;
}

export function homeHeroSVG() {
  const room=roomSVG().replace('class="office-room"', 'x="0" y="0" width="700" height="370"').replace('xMidYMin slice','none');
  const coworker=personSVG('Jules the intern','phone').replace('<svg ', '<svg x="130" y="112" width="250" height="242" ');
  const bench=repairBenchSVG().replace('class="repair-bench-art"', 'x="0" y="321" width="700" height="87"');
  const desk=deskSVG().replace('class="desk-art"', 'x="415" y="313" width="270" height="54"');
  return `<svg class="home-illustration" aria-hidden="true" viewBox="0 0 700 430" fill="none" stroke="var(--machine-edge)" stroke-width="2.5" stroke-linejoin="round" stroke-linecap="round">
    <ellipse cx="350" cy="408" rx="330" ry="15" fill="var(--art-shadow)" stroke="none"/>
    ${room}
    ${coworker}
    ${bench}
    <g class="home-monitor"><rect x="408" y="137" width="277" height="186" rx="8" fill="var(--machine-side)"/><rect x="413" y="142" width="267" height="173" rx="5" fill="var(--display-bg)"/>
      <path d="M425 161h243" stroke="var(--display-line)" stroke-width="1"/><circle cx="426" cy="153" r="2" fill="var(--display-text)" stroke="none"/><path d="M434 153h35" stroke="var(--display-text)" stroke-width="2"/>
      ${[173,217].map((y,i)=>`<rect x="423" y="${y}" width="247" height="36" rx="5" fill="var(--surface)" stroke="var(--line)" stroke-width="1"/><circle cx="435" cy="${y+11}" r="5" fill="var(--shirt-${i?'purple':'blue'})" stroke="none"/><path d="M447 ${y+10}h66m-18 12h81m-144 0h53" stroke="var(--muted)" stroke-width="2"/><circle cx="657" cy="${y+11}" r="2" fill="var(--good)" stroke="none"/>`).join('')}
      <path d="M541 319h11" stroke="var(--paper)" stroke-width="1"/><circle cx="562" cy="319" r="1.4" fill="var(--good)" stroke="none"/>
    </g>
    ${desk}
  </svg>`;
}

// Security training art shares the same outline, equipment and theme tokens.
export function securityIcon(kind='shield') {
  const paths={
    shield:'<path d="M12 3l8 3v6q0 6-8 10-8-4-8-10V6z"/><path d="M8 12l3 3 5-6"/>',
    mail:'<rect x="3" y="5" width="18" height="14" rx="3"/><path d="M4 7l8 6 8-6m-16 11 5-5m11 5-5-5"/>',
    phone:'<rect x="6" y="2" width="12" height="20" rx="3"/><path d="M10 5h4m-3 14h2M12 9v4m0 3v.1"/>',
    usb:'<path d="M8 9V3h8v6m-6-3v1m4-1v1"/><rect x="6" y="9" width="12" height="13" rx="4"/><path d="M10 13h4"/>',
    endpoint:'<rect x="3" y="3" width="18" height="13" rx="2"/><path d="M9 21h6m-3-5v5M12 7v3m0 3v.1"/>',
    share:'<path d="M3 8V5h7l2 3h9v12H3z"/><path d="M12 12v5m-3-3 3-3 3 3"/>',
    update:'<path d="M20 9a8 8 0 0 0-14-3L3 9m0-5v5h5M4 15a8 8 0 0 0 14 3l3-3m0 5v-5h-5"/>',
  };
  return svg(paths[kind] || paths.shield);
}
export function securityArtifactSVG(kind='shield') {
  const shield='<path d="M220 45l63 24v53q0 42-63 74-63-32-63-74V69z" fill="var(--accent-soft)"/><path d="M190 115l22 23 41-49" stroke="var(--accent)" stroke-width="10"/>';
  const body=kind==='usb'?`<g transform="translate(120 30) rotate(-12 100 90)"><path d="M58 3h84v69H58z" fill="var(--machine-shell)"/><path d="M76 18h14v28H76zm34 0h14v28h-14z" fill="var(--display-bg)"/><rect x="38" y="64" width="124" height="115" rx="26" fill="var(--machine-side)"/><rect x="54" y="84" width="92" height="50" rx="7" fill="var(--paper)"/><path d="M68 98h62m-62 12h41m-41 12h52" stroke="var(--art-ink)" stroke-width="3"/><path d="M81 157h38" stroke="var(--paper)" stroke-width="3"/></g>`
    :kind==='phone'?`<rect x="154" y="13" width="132" height="202" rx="24" fill="var(--machine-side)"/><rect x="162" y="21" width="116" height="186" rx="19" fill="var(--display-bg)"/><path d="M202 30h36" stroke="var(--machine-side)" stroke-width="5"/><circle cx="220" cy="88" r="27" fill="var(--warn-soft)"/><path d="M220 70v20m0 9v1" stroke="var(--warn)" stroke-width="5"/><path d="M180 132h80m-69 11h58" stroke="var(--display-line)" stroke-width="4"/><rect x="178" y="164" width="84" height="24" rx="6" fill="var(--accent-soft)"/><path d="M201 176h38" stroke="var(--accent)" stroke-width="3"/>`
    :kind==='mail'?`<path d="M94 70l126-51 126 51v130H94z" fill="var(--machine-side)"/><rect x="122" y="43" width="196" height="131" rx="9" fill="var(--paper)"/><path d="M145 68h146m-146 17h110m-110 17h133" stroke="var(--display-line)" stroke-width="4"/><path d="M94 74l126 82L346 74v126H94z" fill="var(--machine-shell)"/><path d="M94 200l85-70m167 70-85-70"/><circle cx="329" cy="64" r="31" fill="var(--warn-soft)"/><path d="M329 48v19m0 9v1" stroke="var(--warn)" stroke-width="5"/>`
    :kind==='share'?`<path d="M99 79V48h88l23 26h129v123H99z" fill="var(--machine-side)"/><path d="M95 91h251l-19 110H111z" fill="var(--machine-shell)"/><path d="M219 115v53m-20-33 20-20 20 20" stroke="var(--accent)" stroke-width="7"/><circle cx="326" cy="60" r="28" fill="var(--warn-soft)"/><path d="M326 44v18m0 9v1" stroke="var(--warn)" stroke-width="4"/>`
    :kind==='endpoint'||kind==='update'?`<rect x="97" y="31" width="246" height="153" rx="12" fill="var(--machine-shell)"/><rect x="108" y="43" width="224" height="127" rx="6" fill="var(--display-bg)"/><path d="M98 184h244l38 27H60z" fill="var(--machine-side)"/>${kind==='endpoint'?'<path d="M220 61l36 64h-72z" fill="var(--warn-soft)"/><path d="M220 80v18m0 9v1" stroke="var(--warn)" stroke-width="5"/>':'<path d="M220 63v54m-18-18 18 18 18-18" stroke="var(--good)" stroke-width="7"/><path d="M172 144h96" stroke="var(--display-line)" stroke-width="7"/><path d="M172 144h68" stroke="var(--good)" stroke-width="7"/>'}`:shield;
  return `<svg aria-hidden="true" viewBox="0 0 440 230" fill="none" stroke="var(--machine-edge)" stroke-width="3" stroke-linejoin="round" stroke-linecap="round"><ellipse cx="220" cy="209" rx="150" ry="12" fill="var(--art-shadow)" stroke="none"/><path d="M32 212h376" stroke="var(--mat-line)" stroke-width="1"/>${body}</svg>`;
}
