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

export const DEVICE_ART = {
  laptop: `<svg aria-hidden="true" viewBox="0 0 48 48">
    <circle class="puff" cx="38" cy="7" r="2.2" fill="var(--muted)" opacity=".5"/>
    <circle class="puff p2" cx="42" cy="5" r="1.6" fill="var(--muted)" opacity=".4"/>
    <rect x="8" y="9" width="32" height="20" rx="4" fill="var(--surface-2)" stroke="var(--art-outline)" stroke-width="2"/>
    <path d="M11 11h26" stroke="var(--accent)" stroke-width="1.5"/><path d="M15 15l4 4m0-4l-4 4M29 15l4 4m0-4l-4 4" stroke="var(--danger)" stroke-width="2" stroke-linecap="round"/>
    <path d="M20 24q4-2.4 8 0" fill="none" stroke="var(--muted)" stroke-width="1.8" stroke-linecap="round"/>
    <path d="M4 35l4-6h32l4 6z" fill="var(--surface-2)" stroke="var(--art-outline)" stroke-width="2" stroke-linejoin="round"/>
    <rect x="20" y="31.5" width="8" height="2" rx="1" fill="var(--muted)"/>
  </svg>`,
  printer: `<svg aria-hidden="true" viewBox="0 0 48 48">
    <path d="M15 17V7h18v10" fill="var(--surface)" stroke="var(--art-outline)" stroke-width="2" stroke-linejoin="round"/>
    <path d="M17 11l3 2 4-3 4 3 3-2" fill="none" stroke="var(--muted)" stroke-width="1.6"/>
    <rect x="6" y="17" width="36" height="15" rx="3" fill="var(--surface-2)" stroke="var(--art-outline)" stroke-width="2"/>
    <path d="M8 29h32" stroke="var(--art-outline)" stroke-width="2"/><rect x="12" y="21" width="13" height="2.6" rx="1.3" fill="var(--muted)"/>
    <circle class="blink" cx="36" cy="24.5" r="2.2" fill="var(--danger)"/>
    <path d="M14 32l2 5 3.5-2.5 2 4.5 3.5-3 2.5 3.5 2.5-4" fill="none" stroke="var(--muted)" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"/>
  </svg>`,
  phone: `<svg aria-hidden="true" viewBox="0 0 48 48">
    <rect x="15" y="4" width="18" height="40" rx="4.5" fill="var(--surface-2)" stroke="var(--art-outline)" stroke-width="2"/>
    <path d="M21 6h6" stroke="var(--art-outline)" stroke-width="1.5"/><path d="M24 8l-3.5 7 5 4-4 6.5 3 5" fill="none" stroke="var(--accent)" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"/>
    <circle cx="20.5" cy="31" r="1.2" fill="var(--muted)"/>
    <circle cx="27.5" cy="31" r="1.2" fill="var(--muted)"/>
    <path d="M21 35.5q3-2 6 0" fill="none" stroke="var(--muted)" stroke-width="1.6" stroke-linecap="round"/>
    <rect x="21" y="40" width="6" height="1.8" rx="0.9" fill="var(--muted)"/>
  </svg>`,
  monitor: `<svg aria-hidden="true" viewBox="0 0 48 48">
    <rect x="6" y="8" width="36" height="24" rx="4" fill="var(--surface-2)" stroke="var(--art-outline)" stroke-width="2"/>
    <path class="signal" d="M12 20h5l3-6 4 11 3-7h9" fill="none" stroke="var(--accent)" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
    <circle class="blink" cx="39" cy="29" r="1.6" fill="var(--good)"/>
    <path d="M20 36h8l2-4H18z" fill="var(--surface-2)" stroke="var(--art-outline)" stroke-width="2" stroke-linejoin="round"/>
    <rect x="14" y="38" width="20" height="2.6" rx="1.3" fill="var(--muted)"/>
  </svg>`,
};

// The big jobs get bigger art.
DEVICE_ART.server = `<svg aria-hidden="true" viewBox="0 0 48 48">
    <path class="flame" d="M33 8c2.4 1.8 3.6 3.8 3.6 5.8 0 2.4-1.7 4-3.8 4s-3.8-1.6-3.8-4c0-1.4.6-2.4 1.6-3.6 0 1.2.7 2 1.6 2.2-.4-1.6-.1-3 0.8-4.4z" fill="var(--sun)"/>
    <rect x="12" y="10" width="20" height="32" rx="4" fill="var(--surface-2)" stroke="var(--art-outline)" stroke-width="2"/>
    <path d="M14 21h16m-16 8h16m-16 8h16" stroke="var(--line)" stroke-width="1.5"/><path d="M16 17h8M16 25h8M16 33h8" stroke="var(--art-outline)" stroke-width="2" stroke-linecap="round"/>
    <circle class="blink" cx="28" cy="17" r="1.6" fill="var(--danger)"/>
    <circle class="blink p2" cx="28" cy="25" r="1.6" fill="var(--good)"/>
    <circle class="blink" cx="28" cy="33" r="1.6" fill="var(--warn)"/>
  </svg>`;
DEVICE_ART.tv = `<svg aria-hidden="true" viewBox="0 0 48 48">
    <rect x="4" y="10" width="40" height="26" rx="3" fill="var(--surface-2)" stroke="var(--art-outline)" stroke-width="2"/>
    <g opacity=".5" fill="var(--muted)">
      <circle cx="12" cy="17" r="1"/><circle cx="20" cy="30" r="1"/><circle cx="30" cy="15" r="1"/>
      <circle cx="37" cy="27" r="1"/><circle cx="16" cy="24" r="1"/><circle cx="33" cy="21" r="1"/>
    </g>
    <path d="M8 14h32M8 33h32" stroke="var(--line)" stroke-width="1"/><g class="ghost">
      <circle cx="22" cy="21" r="1.6" fill="var(--muted)"/>
      <circle cx="28" cy="21" r="1.6" fill="var(--muted)"/>
      <path d="M22 26q3 2 6 0" fill="none" stroke="var(--muted)" stroke-width="1.6" stroke-linecap="round"/>
    </g>
    <path d="M22 36v4m4-4v4M18 42h12" stroke="var(--art-outline)" stroke-width="2" stroke-linecap="round"/>
  </svg>`;

// --- full-body visitors for the walk-in counter ------------------------------
// A person who walks up holding their broken machine, doctor-game style.
// Deterministic from the name, with custom looks for the regulars.


const SHIRTS = ['var(--shirt-blue)', 'var(--shirt-purple)', 'var(--shirt-green)', 'var(--shirt-red)', 'var(--shirt-gold)', 'var(--art-ink)'];
const HEAD_HAIR = [
  c => `<path d="M27 36q-2-19 15-19 18 0 16 20l-6-8q-12 6-22 0z" fill="${c}"/>`,
  c => `<path d="M26 36q-9-9 0-15-2-9 8-9 6-9 13-1 11-3 12 8 10 8 0 17l-5-9q-14 6-23 0z" fill="${c}"/>`,
  c => `<circle cx="51" cy="16" r="8" fill="${c}"/><path d="M26 37q-3-21 16-21t17 22l-7-11q-16 8-23 2z" fill="${c}"/>`,
  c => `<path d="M27 37q-4-9 3-13M57 37q4-9-3-13" fill="none" stroke="${c}" stroke-width="5"/>`,
  c => `<path d="M25 47V28q0-15 17-15t18 15v19l-8-4V27q-8 7-19 0v17z" fill="${c}"/>`,
  c => `<path d="M27 35l-3-13 9 2 2-11 8 8 8-9 1 12 9 1-5 12-6-10q-12 8-20 1z" fill="${c}"/>`,
];

/** Deterministic silhouettes and accessories; device stays supported in every pose. */
export function personSVG(name, device) {
  const h = hashName(name);
  const ceo = name === 'The CEO', gary = name.startsWith('Gary'), jules = name === 'Jules the intern', frank = name === 'Frank, remote';
  const skin = ceo ? AV_SKIN[1] : gary ? AV_SKIN[0] : jules ? AV_SKIN[2] : frank ? AV_SKIN[3] : AV_SKIN[h % 4];
  const hair = HEAD_HAIR[gary ? 5 : frank || ceo ? 0 : (h >>> 2) % 6](AV_HAIR[(h >>> 4) % 5]);
  const shirt = ceo ? 'var(--art-ink)' : SHIRTS[(h >>> 6) % SHIRTS.length];
  const broad = h % 3 === 0 ? 5 : 0;
  const glasses = ceo || h % 4 === 0;
  const deviceArt = (DEVICE_ART[device] || DEVICE_ART.laptop).replace(
    '<svg aria-hidden="true" viewBox="0 0 48 48">',
    '<svg viewBox="0 0 48 48" x="20" y="67" width="45" height="45">');
  return `<svg aria-hidden="true" viewBox="0 0 88 146" class="person" fill="none" stroke-linecap="round" stroke-linejoin="round">
    <ellipse cx="44" cy="140" rx="30" ry="4" fill="var(--art-shadow)"/>
    <g class="person-body">
      <g class="leg"><path d="M33 105v26" stroke="var(--trousers)" stroke-width="12"/><path d="M27 132h11" stroke="var(--art-ink)" stroke-width="8"/></g>
      <g class="tap-foot"><path d="M52 105v26" stroke="var(--trousers)" stroke-width="12"/><path d="M49 132h13" stroke="var(--art-ink)" stroke-width="8"/></g>
      <path d="M${24-broad} 67q18-13 ${36+2*broad} 0l5 42q-23 8-${46+2*broad} 0z" fill="${shirt}" stroke="var(--art-ink)" stroke-width="2"/>
      <path d="M38 53v10q4 5 9 0V53" fill="${skin}" stroke="var(--art-ink)" stroke-width="2"/>
      ${ceo ? '<path d="M32 62l10 10 12-10-5 25H36z" fill="var(--paper)"/><path d="M42 69l-4 6 4 12 4-12z" fill="var(--shirt-red)"/>' : '<path d="M33 63l9 18 11-18" stroke="var(--paper)" stroke-width="2"/><rect x="37" y="78" width="11" height="13" rx="2" fill="var(--paper)" stroke="var(--art-ink)" stroke-width="1.5"/><path d="M40 83h5m-5 3h3" stroke="var(--shirt-blue)" stroke-width="1.5"/>'}
      <g class="head">
        <circle cx="27" cy="40" r="4" fill="${skin}"/><circle cx="58" cy="40" r="4" fill="${skin}"/>
        <rect x="27" y="21" width="31" height="36" rx="14" fill="${skin}" stroke="var(--art-ink)" stroke-width="2"/>
        ${hair}
        <g class="eyes" fill="var(--art-ink)"><circle cx="36" cy="39" r="2"/><circle cx="49" cy="39" r="2"/></g>
        <path class="smile" d="M37 48q6 5 11-1" stroke="var(--art-ink)" stroke-width="2"/>
        <path class="frown" d="M37 50q5-4 11 0" stroke="var(--art-ink)" stroke-width="2"/>
        <path d="M43 41l-1 4h3" stroke="var(--art-ink)" stroke-width="1.3" opacity=".4"/>
        ${glasses ? `<g stroke="var(--art-ink)" stroke-width="2" fill="${ceo ? 'var(--art-ink)' : 'none'}"><rect x="30" y="35" width="11" height="8" rx="3"/><rect x="45" y="35" width="11" height="8" rx="3"/><path d="M41 38h4"/></g>` : ''}
        ${ceo ? '<path d="M29 23l-2-12 10 5 6-10 6 10 10-5-2 12z" fill="var(--face)" stroke="var(--art-ink)" stroke-width="2"/>' : ''}
        ${gary ? '<path d="M32 36h8m5 0h8M33 43h6m7 0h6" stroke="var(--art-ink)" stroke-width="1.6" opacity=".65"/>' : ''}
        ${jules || frank ? `<path d="M25 37V31a18 18 0 0 1 36 0v8" stroke="var(--art-ink)" stroke-width="4"/><rect x="21" y="34" width="8" height="13" rx="4" fill="var(--shirt-blue)" stroke="var(--art-ink)" stroke-width="2"/><rect x="56" y="34" width="8" height="13" rx="4" fill="var(--shirt-blue)" stroke="var(--art-ink)" stroke-width="2"/>${frank ? '<path d="M61 45q0 10-12 9" stroke="var(--art-ink)" stroke-width="2"/><circle cx="48" cy="54" r="3" fill="var(--art-ink)"/>' : ''}` : ''}
      </g>
      <path d="M24 73q-12 22 8 28M62 73q12 22-9 28" stroke="var(--art-ink)" stroke-width="10"/>
      <path d="M24 73q-12 22 8 28M62 73q12 22-9 28" stroke="${skin}" stroke-width="7"/>
      <g class="held-device">${deviceArt}</g>
      <g class="holding-hands" fill="${skin}" stroke="var(--art-ink)" stroke-width="1.5"><rect x="27" y="98" width="10" height="6" rx="3"/><rect x="50" y="98" width="10" height="6" rx="3"/></g>
      <g class="crossed-arms" stroke="var(--art-ink)" stroke-width="9"><path d="M23 89l33 14M62 89l-31 14"/><path d="M23 89l33 14M62 89l-31 14" stroke="${skin}" stroke-width="6"/></g>
      ${gary || h % 5 === 0 ? '<g transform="translate(62 105)"><path d="M10 2h3q6 5 0 8h-3" stroke="var(--art-ink)" stroke-width="2"/><rect width="11" height="14" rx="3" fill="var(--paper)" stroke="var(--art-ink)" stroke-width="2"/><path d="M3 5h5" stroke="var(--shirt-red)" stroke-width="2"/></g>' : ''}
    </g>
    <g class="patience-steam" stroke="var(--muted)" stroke-width="2.5"><path d="M15 29q-7-5 0-10t0-10"/><path d="M71 29q7-5 0-10t0-10"/></g>
    <g class="celebrate" stroke="var(--good)" stroke-width="3"><path d="M9 52l-5-4m74 4 5-4M15 12l-3-5m59 5 3-5"/><path d="M67 70l4 4 8-10"/></g>
  </svg>`;
}

// The room is decorative, repeatable SVG: no IDs, external assets or paint servers.
export function roomSVG() {
  return `<div class="room-wall">
    <div class="room-brand"><span class="room-cross">✚</span><span>DEVICE CARE<small>TECH SUPPORT · WALK-INS WELCOME</small></span></div>
    <svg class="room-window" viewBox="0 0 180 106" fill="none" stroke="var(--art-ink)" stroke-width="3" stroke-linejoin="round">
      <rect x="4" y="4" width="172" height="92" rx="9" fill="var(--sky)"/>
      <circle class="window-sun" cx="133" cy="28" r="12" fill="var(--sun)" stroke="none"/>
      <path class="window-moon" d="M140 16a15 15 0 1 0 14 23 15 15 0 0 1-14-23" fill="var(--paper)" stroke="none"/>
      <path class="window-stars" d="M28 20v8m-4-4h8m64-8v6m-3-3h6" stroke="var(--paper)" stroke-width="2"/>
      <path d="M14 43h32m-16-5h26M98 50h30" stroke="var(--paper)" stroke-width="6" stroke-linecap="round" opacity=".65"/>
      <path d="M6 77l25-14 18 10 24-21 21 16 19-8 27 13 34-18v40H6z" fill="var(--distant)" stroke="none"/>
      <path d="M6 87l45-10 27 8 41-8 55 5v13H6z" fill="var(--leaf)" stroke="none"/>
      <path d="M90 5v90M5 60h170" stroke="var(--paper)" stroke-width="6"/>
      <rect x="1" y="95" width="178" height="8" rx="3" fill="var(--wood-light)"/>
    </svg>
    <svg class="wall-clock" viewBox="0 0 70 70" fill="none" stroke="var(--art-ink)" stroke-linecap="round">
      <circle cx="35" cy="36" r="30" fill="var(--wood)" stroke-width="2"/><circle cx="35" cy="33" r="28" fill="var(--paper)" stroke-width="2.5"/>
      <path d="M35 11v3m22 19h-3M35 55v-3M13 33h3" stroke-width="2"/>
      <path class="clock-hour" d="M35 33V19" stroke-width="3"/><path class="clock-minute" d="M35 33V13" stroke-width="2"/><circle cx="35" cy="33" r="3" fill="var(--shirt-red)" stroke="none"/>
    </svg>
    <div class="room-poster"><span>HAVE YOU TRIED</span><strong>TURNING IT<br>OFF AND ON?</strong><small>A fresh start for everyone.</small></div>
    <svg class="room-shelf" viewBox="0 0 140 100" fill="none" stroke="var(--art-ink)" stroke-width="2.5" stroke-linejoin="round">
      <path d="M10 84h120v8H10z" fill="var(--wood-light)"/><path d="M20 93v6m100-6v6"/>
      <rect x="17" y="43" width="13" height="40" rx="2" fill="var(--shirt-blue)"/><rect x="31" y="36" width="14" height="47" rx="2" fill="var(--shirt-red)"/><path d="M47 43l12-3 10 40-12 3z" fill="var(--face)"/><path d="M21 53h5m9-6h6" stroke="var(--paper)"/>
      <path d="M98 62V30m0 21Q72 53 77 33q21 1 21 18m0-11q22 3 21-19-18 1-21 19m0-8Q82 27 90 14q12 6 8 18" fill="var(--leaf)" stroke="var(--leaf-dark)"/>
      <path d="M82 60h32l-4 23H86z" fill="var(--pot)"/>
    </svg>
  </div>
  <svg class="room-furniture" viewBox="0 0 1000 250" preserveAspectRatio="xMidYMax meet" fill="none" stroke="var(--art-ink)" stroke-width="3" stroke-linejoin="round">
    <g transform="translate(18 90)"><rect width="120" height="145" rx="7" fill="var(--wood)"/><path d="M6 49h108M6 96h108"/><path d="M48 23h24m-24 49h24m-24 48h24" stroke="var(--paper)" stroke-width="6"/><path d="M10 145v10m100-10v10"/>
    <rect x="14" y="-26" width="85" height="25" rx="5" fill="var(--surface-2)"/><path d="M28-26v-21h56v21" fill="var(--paper)"/><circle cx="84" cy="-14" r="3" fill="var(--good)"/></g>
    <g transform="translate(860 40)"><path d="M52 139V36m0 70Q-3 106 9 70q37 1 43 36m0-20q57-2 47-40-45 4-47 40m0-24Q11 61 24 25q29 8 28 37m0-16Q80 47 79 7q-26 6-27 39" fill="var(--leaf)" stroke="var(--leaf-dark)"/><path d="M18 135h69l-10 66H29z" fill="var(--pot)"/><path d="M17 135h71v12H17z" fill="var(--wood-light)"/></g>
  </svg>`;
}

export function deskSVG() {
  return `<svg class="desk-art" viewBox="0 0 900 80" preserveAspectRatio="none" fill="none" stroke="var(--art-ink)" stroke-width="2.5" stroke-linejoin="round">
    <path d="M30 26h840l25 26H5z" fill="var(--wood-light)"/><rect x="5" y="52" width="890" height="18" rx="5" fill="var(--wood)"/><path d="M40 70v10m820-10v10" stroke-width="12"/>
    <path d="M365 29h170l13 13H352z" fill="var(--surface-2)"/><path d="M373 34h154m-145 4h136" stroke="var(--art-outline)" stroke-width="2" stroke-dasharray="5 3"/>
    <ellipse cx="590" cy="37" rx="14" ry="8" fill="var(--surface)"/><path d="M590 30v5"/>
    <path d="M93 8h9q15 13-1 18h-8" stroke-width="4"/><path d="M64 3h32v29q-16 9-32 0z" fill="var(--paper)"/><path d="M73 15h14m-7-7v14" stroke="var(--shirt-red)" stroke-width="4"/>
    <path d="M734 30l48-5 4 14-48 5z" fill="var(--face)"/><path d="M746 34l25-3" stroke="var(--art-ink)" stroke-width="2"/>
  </svg>`;
}


// --- close-up workbench art ---------------------------------------------------
const artText = value => String(value).replace(/[&<>"']/g, c => ({ '&':'&amp;', '<':'&lt;', '>':'&gt;', '"':'&quot;', "'":'&#39;' }[c]));
const panel = (x, y, w, h, status, cue) => `
  <rect x="${x}" y="${y}" width="${w}" height="${h}" rx="8" fill="var(--display-bg)" stroke="var(--machine-edge)" stroke-width="3"/>
  <path d="M${x+14} ${y+19}h${w-28}" stroke="var(--display-line)" stroke-width="2"/>
  <circle cx="${x+16}" cy="${y+10}" r="2" fill="var(--display-text)"/>
  <text x="${x+w/2}" y="${y+h*.52}" text-anchor="middle" fill="var(--display-text)" stroke="none" font-size="${w<150?11:16}" font-family="var(--font-mono)" font-weight="700">${artText(status)}</text>
  <path d="M${x+w*.28} ${y+h*.7}h${w*.44}" stroke="var(--display-line)" stroke-width="5" stroke-linecap="round"/>
  <path d="M${x+w*.28} ${y+h*.7}h${w*(cue==='update'?.12:.32)}" stroke="var(--display-text)" stroke-width="5" stroke-linecap="round"/>
  ${cue==='locked' ? `<rect x="${x+w/2-10}" y="${y+26}" width="20" height="15" rx="3" fill="none" stroke="var(--display-text)" stroke-width="2"/><path d="M${x+w/2-6} ${y+26}v-5a6 6 0 0 1 12 0v5" stroke="var(--display-text)" stroke-width="2"/>` : ''}`;
export const DEVICE_NAMES = { laptop:'Laptop', printer:'Printer', phone:'Phone', monitor:'Monitor', server:'Server', tv:'Room display' };

export const DEVICE_HOTSPOTS = {
  laptop: { screen:[140,125], power:[520,265], security:[140,215], ports:[520,210] },
  printer: { screen:[385,100], power:[530,230], security:[190,192], ports:[520,210] },
  phone: { screen:[210,140], power:[445,80], security:[445,205], ports:[445,320] },
  monitor: { screen:[90,130], power:[550,265], security:[90,235], ports:[520,210] },
  server: { screen:[140,95], power:[480,322], security:[140,190], ports:[520,210] },
  tv: { screen:[75,120], power:[575,270], security:[75,230], ports:[520,210] },
};

export function inspectionDeviceSVG(device, observation, view = 'front') {
  const cue = observation?.cue || 'ready';
  const status = observation?.screen || 'READY';
  const edge = 'var(--machine-edge)';
  const front = 'var(--machine-shell)';
  const dark = 'var(--machine-side)';
  const loose = cue === 'loose';
  const screws = (x,y,w,h) => [[x,y],[x+w,y],[x,y+h],[x+w,y+h]].map(([a,b])=>`<circle cx="${a}" cy="${b}" r="4" fill="var(--machine-side)"/><path d="M${a-2} ${b}h4" stroke="var(--machine-edge)" stroke-width="1"/>`).join('');
  const keyboard = Array.from({length:4},(_,row)=>Array.from({length:11},(_,col)=>`<rect x="${160+col*26-row*4}" y="${278+row*14}" width="20" height="9" rx="2" fill="var(--machine-side)" stroke="var(--machine-edge)" stroke-width="1"/>`).join('')).join('');
  let body;
  if (view === 'rear' && device === 'phone') {
    body = `<rect x="231" y="20" width="168" height="331" rx="27" fill="${front}" stroke="${edge}" stroke-width="4"/><rect x="244" y="34" width="52" height="72" rx="13" fill="${dark}" stroke="${edge}" stroke-width="2"/><circle cx="260" cy="53" r="9" fill="var(--display-bg)"/><circle cx="280" cy="81" r="9" fill="var(--display-bg)"/><circle cx="280" cy="52" r="4" fill="var(--paper)"/><path d="M285 316h60" stroke="${edge}" stroke-width="3"/><rect x="300" y="341" width="30" height="8" rx="3" fill="var(--display-bg)"/><path d="M263 335h17m70 0h17" stroke="${edge}" stroke-width="2" stroke-dasharray="2 3"/>`;
  } else if (view === 'rear') {
    body = `<path d="M155 62h310l28 28v240H155z" fill="${dark}"/><rect x="125" y="62" width="340" height="268" rx="20" fill="${front}" stroke="${edge}" stroke-width="4"/>
      ${screws(145,82,300,226)}
      ${Array.from({length:9},(_,i)=>`<path d="M166 ${110+i*11}h128" stroke="${dark}" stroke-width="5"/>`).join('')}
      <rect x="326" y="104" width="100" height="70" rx="6" fill="var(--paper)"/><path d="M340 122h70m-70 12h47m-47 12h57" stroke="var(--art-ink)" stroke-width="3"/>
      <text x="376" y="162" fill="var(--art-ink)" stroke="none" text-anchor="middle" font-size="9" font-family="var(--font-mono)">ASSET · 042</text>
      <rect x="153" y="263" width="285" height="43" rx="7" fill="${dark}"/>
      <rect x="178" y="274" width="42" height="20" rx="3" fill="var(--display-bg)" stroke="${edge}" stroke-width="2"/><path d="M185 280h28m-28 7h28" stroke="var(--machine-shell)" stroke-width="2"/>
      <rect x="249" y="274" width="35" height="20" rx="2" fill="var(--display-bg)"/><path d="M255 278v8m6-8v8m6-8v8m6-8v8" stroke="var(--sun)" stroke-width="2"/>
      <rect x="382" y="270" width="42" height="28" rx="5" fill="var(--display-bg)" stroke="${edge}" stroke-width="2"/>
      <g class="${loose?'connector-loose':'connector-seated'}" transform="translate(${loose?459:406} 284)">
        <path d="M18 0h22q45 0 45 40t-70 35" fill="none" stroke="${edge}" stroke-width="9"/>
        <path d="M18 0h22q45 0 45 40t-70 35" fill="none" stroke="var(--shirt-blue)" stroke-width="5"/>
        <rect x="-9" y="-11" width="30" height="22" rx="4" fill="var(--machine-side)" stroke="${edge}" stroke-width="2"/>
        <path d="M-18-6h9m-9 12h9" stroke="var(--sun)" stroke-width="4"/>
      </g>`;
  } else if(device==='laptop') {
    body = `<path d="M175 46h290v208H175z" fill="${dark}"/><rect x="159" y="38" width="306" height="211" rx="15" fill="${front}" stroke="${edge}" stroke-width="4"/>
      ${panel(174,54,276,174,status,cue)}<circle cx="312" cy="46" r="3" fill="${edge}"/>
      <path d="M159 250h306l88 94H78z" fill="${front}" stroke="${edge}" stroke-width="3"/>
      <path d="M78 344h475l-18 18H97z" fill="${dark}" stroke="${edge}" stroke-width="3"/>
      ${keyboard}<rect x="272" y="325" width="90" height="13" rx="3" fill="${dark}"/><circle cx="467" cy="270" r="9" fill="var(--good)" stroke="${edge}" stroke-width="2"/>
      <path d="M469 266v6m-3-6a4 4 0 1 0 5 0" stroke="var(--paper)" stroke-width="1.5"/>
      <path d="M105 351h56m322 0h38" stroke="${edge}" stroke-width="3"/>`;
  } else if(device==='phone') {
    body = `<rect x="239" y="26" width="170" height="335" rx="28" fill="${dark}" stroke="${edge}" stroke-width="4"/><rect x="231" y="20" width="168" height="331" rx="27" fill="${front}" stroke="${edge}" stroke-width="4"/>
      ${panel(242,44,146,275,status,cue)}<rect x="285" y="29" width="58" height="7" rx="4" fill="${edge}"/><circle cx="315" cy="335" r="7" fill="${dark}"/><path d="M403 104v32M228 95v23m0 12v23" stroke="${edge}" stroke-width="5"/>`;
  } else if(device==='printer') {
    body = `<path d="M160 137l27-35h279l25 35v187H160z" fill="${dark}" stroke="${edge}" stroke-width="3"/>
      <path d="M213 140V40h183v103" fill="var(--paper)" stroke="${edge}" stroke-width="3"/><path d="M237 68h134m-134 16h134m-134 16h75" stroke="var(--muted)" stroke-width="4"/>
      <rect x="138" y="136" width="350" height="186" rx="22" fill="${front}" stroke="${edge}" stroke-width="4"/>
      ${panel(318,153,120,58,status,cue)}<circle cx="459" cy="215" r="9" fill="var(--warn)" stroke="${edge}" stroke-width="2"/>
      <rect x="170" y="235" width="248" height="31" rx="7" fill="${dark}" stroke="${edge}" stroke-width="3"/>
      <path d="M200 251h185l-15 97H185z" fill="var(--paper)" stroke="${edge}" stroke-width="2"/><path d="M214 279h142m-146 14h142m-146 14h90" stroke="${cue==='update'?'var(--shirt-purple)':'var(--muted)'}" stroke-width="5"/>`;
  } else if(device==='server') {
    body = `<path d="M197 28h235l30 19v306H197z" fill="${dark}" stroke="${edge}" stroke-width="3"/>
      <rect x="175" y="28" width="257" height="325" rx="14" fill="${front}" stroke="${edge}" stroke-width="4"/>
      ${panel(195,50,216,88,status,cue)}
      ${[157,212,267].map((y,i)=>`<rect x="192" y="${y}" width="222" height="43" rx="6" fill="${dark}" stroke="${edge}" stroke-width="2"/><path d="M207 ${y+13}h140m-140 9h140m-140 9h140" stroke="${front}" stroke-width="2"/><circle class="blink" cx="391" cy="${y+21}" r="5" fill="${i===0&&cue!=='ready'?'var(--warn)':'var(--good)'}"/>`).join('')}
      <path d="M190 356v12m226-12v12" stroke="${edge}" stroke-width="10"/><circle cx="415" cy="330" r="6" fill="var(--good)"/>`;
  } else {
    const tv=device==='tv';
    body = `<path d="M285 276h57l12 57h-83z" fill="${dark}" stroke="${edge}" stroke-width="3"/>
      <path d="M240 332h147l22 15H219z" fill="${front}" stroke="${edge}" stroke-width="3"/>
      <rect x="${tv?95:125}" y="40" width="${tv?440:380}" height="248" rx="17" fill="${front}" stroke="${edge}" stroke-width="4"/>
      ${panel(tv?110:140,55,tv?410:350,210,status,cue)}
      <circle cx="${tv?503:475}" cy="277" r="5" fill="var(--good)"/>
      ${tv&&cue==='loose'?'<g class="ghost" fill="var(--display-text)"><circle cx="300" cy="195" r="4"/><circle cx="330" cy="195" r="4"/><path d="M302 208q13 8 26 0" fill="none" stroke="var(--display-text)" stroke-width="3"/></g>':''}`;
  }
  return `<svg class="exam-device-svg" aria-hidden="true" viewBox="0 0 640 400" fill="none" stroke-linecap="round" stroke-linejoin="round">
    <ellipse cx="320" cy="365" rx="245" ry="18" fill="var(--art-shadow)"/>
    ${body}
    <path d="M80 384h480" stroke="var(--mat-line)" stroke-width="2" stroke-dasharray="4 8"/>
  </svg>`;
}

export function homeHeroSVG() {
  return `<svg aria-hidden="true" class="home-illustration" viewBox="0 0 640 390" fill="none" stroke-linecap="round" stroke-linejoin="round">
    <path d="M65 86h102l25-26h300l63 35v118" stroke="var(--mat-line)" stroke-width="2" stroke-dasharray="5 9"/>
    <circle cx="65" cy="86" r="5" fill="var(--accent)"/><circle cx="555" cy="213" r="5" fill="var(--accent)"/>
    <ellipse cx="320" cy="338" rx="282" ry="35" fill="var(--art-shadow)"/>
    <path d="M52 120l335-79 204 119-334 98z" fill="var(--wall)" stroke="var(--machine-edge)" stroke-width="3"/>
    <path d="M52 120v158l204 102V258z" fill="var(--wall-base)" stroke="var(--machine-edge)" stroke-width="3"/>
    <path d="M256 258l335-98v155L256 380z" fill="var(--wood)" stroke="var(--machine-edge)" stroke-width="3"/>
    <path d="M279 280l85-25v61l-85 25z" fill="var(--machine-side)" stroke="var(--machine-edge)" stroke-width="2"/><path d="M309 286l28-8" stroke="var(--paper)" stroke-width="5"/>
    <path d="M62 130l324-75 193 108-323 83z" fill="var(--wood-light)"/>
    <path d="M183 142l153-34 148 78-157 43z" fill="var(--bench-mat)" stroke="var(--mat-line)" stroke-width="2"/>
    <g transform="translate(104 18)"><path d="M37 87V28M37 63Q5 60 10 37q25 0 27 26m0-17q28-2 25-26-24 4-25 26" fill="var(--leaf)" stroke="var(--leaf-dark)" stroke-width="3"/><path d="M15 78h44l-7 34H22z" fill="var(--pot)" stroke="var(--machine-edge)" stroke-width="3"/><path d="M22 85h30" stroke="var(--paper)" stroke-width="2"/></g>
    <g transform="translate(169 15) scale(.55)">${inspectionDeviceSVG('laptop',{screen:'NO SIGNAL',cue:'loose'}).replace('<svg class="exam-device-svg" aria-hidden="true" viewBox="0 0 640 400"','<svg x="0" y="0" width="640" height="400" viewBox="0 0 640 400"')}</g>
    <path d="M168 190q-61 20-60 51t83 21" stroke="var(--shirt-blue)" stroke-width="7"/><path d="M190 254l20 9-12 17-22-12z" fill="var(--machine-shell)" stroke="var(--machine-edge)" stroke-width="3"/>
    <path d="M475 127l28-8 25 68-28 8z" fill="var(--shirt-red)" stroke="var(--machine-edge)" stroke-width="3"/><path d="M509 194l10 28" stroke="var(--machine-edge)" stroke-width="6"/>
    <path d="M120 148l28 14-11 35-29-14z" fill="var(--paper)" stroke="var(--machine-edge)" stroke-width="3"/><path d="M146 169q19 5 8 18l-13-3" stroke="var(--machine-edge)" stroke-width="3"/>
    <path d="M387 272l115-34v45l-115 35z" fill="var(--paper)" stroke="var(--machine-edge)" stroke-width="2"/>
    <text x="405" y="286" transform="rotate(-16 405 286)" fill="var(--art-ink)" font-size="14" font-family="var(--font-display)">DEVICE CARE</text>
    <g class="home-signal"><path d="M448 20h139a12 12 0 0 1 12 12v51a12 12 0 0 1-12 12h-80l-18 17V95h-41a12 12 0 0 1-12-12V32a12 12 0 0 1 12-12z" fill="var(--surface)" stroke="var(--accent)" stroke-width="3"/>
      <circle cx="459" cy="43" r="6" fill="var(--warn)"/><text x="474" y="48" font-size="13" font-family="var(--font-mono)" font-weight="700" fill="var(--ink)">CASE #001</text><text x="453" y="74" font-size="13" font-family="var(--font-body)" fill="var(--muted)">Definitely plugged in?</text></g>
    <path d="M406 183l32-9 17 43-32 10z" fill="var(--machine-shell)" stroke="var(--machine-edge)" stroke-width="3"/><path d="M412 186l22-6 11 28-22 6z" fill="var(--display-bg)"/><path d="M424 191l8 7m-10 0 10-8" stroke="var(--display-text)" stroke-width="2"/>
    <path d="M103 79l10-10m-26 23 7-7M545 286l13 4m-21 9 8 8" stroke="var(--accent)" stroke-width="3"/>
  </svg>`;
}

