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
  const h = hashName(name), ceo = name === 'The CEO', gary = name.startsWith('Gary'), jules = name === 'Jules the intern', frank = name === 'Frank, remote';
  const skin = AV_SKIN[h % 4], hairColor = AV_HAIR[(h >>> 4) % 5];
  const shirt = ceo ? 'var(--art-ink)' : SHIRTS[(h >>> 6) % SHIRTS.length];
  const wide = h % 3 === 0 ? 7 : 0, longHair = (h >>> 2) % 6 === 4;
  const deviceArt = (DEVICE_ART[device] || DEVICE_ART.laptop).replace('<svg aria-hidden="true" viewBox="0 0 48 48">', '<svg x="40" y="118" width="80" height="80" viewBox="0 0 48 48">');
  return `<svg aria-hidden="true" viewBox="0 0 160 250" class="person" fill="none" stroke-linecap="round" stroke-linejoin="round">
    <ellipse cx="80" cy="239" rx="51" ry="8" fill="var(--art-shadow)"/>
    <g class="person-body">
      <g class="leg"><path d="M64 175l-3 47" stroke="var(--art-ink)" stroke-width="21"/><path d="M63 178l-3 41" stroke="var(--trousers)" stroke-width="15"/><path d="M61 220l-16 9q-5 8 4 8h26v-16" fill="var(--art-ink)"/><path d="M44 234h31" stroke="var(--paper)" stroke-width="3"/></g>
      <g class="tap-foot"><path d="M94 175l4 47" stroke="var(--art-ink)" stroke-width="21"/><path d="M94 178l4 41" stroke="var(--trousers)" stroke-width="15"/><path d="M99 220l17 9q5 8-4 8H86v-16" fill="var(--art-ink)"/><path d="M87 234h31" stroke="var(--paper)" stroke-width="3"/></g>
      ${longHair ? `<path d="M49 67v51q30 16 65-3V66z" fill="${hairColor}"/>` : ''}
      <path d="M${49-wide} 104q30-23 ${60+wide*2} 0l9 74q-39 15-${78+wide*2} 0z" fill="${shirt}" stroke="var(--art-ink)" stroke-width="2.5"/>
      <path d="M67 84v18q13 13 26-1V84" fill="${skin}" stroke="var(--art-ink)" stroke-width="2.5"/>
      ${ceo ? '<path d="M58 101l22 19 22-19-9 48H68z" fill="var(--paper)"/><path d="M80 115l-7 9 7 24 7-24z" fill="var(--shirt-red)"/><path d="M52 104l12 25-16 13m60-38-12 25 16 13" stroke="var(--paper)" stroke-width="2"/>' : `<path d="M59 101l21 33 22-33" stroke="var(--paper)" stroke-width="3"/><rect x="70" y="130" width="20" height="25" rx="4" fill="var(--paper)" stroke="var(--art-ink)" stroke-width="2"/><circle cx="80" cy="138" r="4" fill="${shirt}"/><path d="M75 147h10" stroke="var(--art-ink)" stroke-width="2"/>`}
      <g class="head">
        <ellipse cx="53" cy="64" rx="7" ry="10" fill="${skin}" stroke="var(--art-ink)" stroke-width="2"/><ellipse cx="107" cy="64" rx="7" ry="10" fill="${skin}" stroke="var(--art-ink)" stroke-width="2"/>
        <path d="M54 51q0-27 26-27t26 27v20q-1 24-26 27-25-3-26-27z" fill="${skin}" stroke="var(--art-ink)" stroke-width="2.5"/>
        <g transform="translate(10 -5) scale(1.65)">${HEAD_HAIR[gary ? 5 : ceo || frank ? 0 : (h >>> 2) % 6](hairColor)}</g>
        <path d="M62 56q6-4 12-1m12 0q7-3 12 1" stroke="${hairColor}" stroke-width="3"/>
        <g class="eyes" fill="var(--art-ink)"><ellipse cx="69" cy="65" rx="2.7" ry="3.6"/><ellipse cx="92" cy="65" rx="2.7" ry="3.6"/></g>
        <path d="M80 66l-2 10h5" stroke="var(--art-ink)" stroke-width="2" opacity=".5"/>
        <ellipse cx="63" cy="76" rx="6" ry="3" fill="var(--shirt-red)" opacity=".3"/><ellipse cx="99" cy="76" rx="6" ry="3" fill="var(--shirt-red)" opacity=".3"/>
        <path class="smile" d="M72 83q8 6 17-1" stroke="var(--art-ink)" stroke-width="2.5"/><path class="frown" d="M72 86q9-6 17-1" stroke="var(--art-ink)" stroke-width="2.5"/>
        ${h % 7 === 0 && !jules ? `<path d="M59 78q7 18 21 18t22-18l-6 6q-16 11-31-1z" fill="${hairColor}"/><path d="M70 79q10-5 20 0" stroke="${hairColor}" stroke-width="3"/>` : ''}
        ${ceo || h % 4 === 0 ? `<g stroke="var(--art-ink)" stroke-width="3" fill="${ceo ? 'var(--art-ink)' : 'none'}"><rect x="58" y="59" width="20" height="14" rx="5"/><rect x="83" y="59" width="20" height="14" rx="5"/><path d="M78 64h5m-29-2h4m45 0h5"/></g>` : ''}
        ${ceo ? '<path d="M57 33l-5-21 18 9L80 5l11 16 18-9-5 21z" fill="var(--face)" stroke="var(--art-ink)" stroke-width="2.5"/>' : ''}
        ${gary ? '<path d="M62 71h13m10 0h13" stroke="var(--art-ink)" stroke-width="2" opacity=".5"/>' : ''}
        ${jules || frank ? `<path d="M49 62V50a31 31 0 0 1 62 0v13" stroke="var(--art-ink)" stroke-width="6"/><rect x="44" y="58" width="13" height="23" rx="6" fill="var(--shirt-blue)" stroke="var(--art-ink)" stroke-width="2"/><rect x="104" y="58" width="13" height="23" rx="6" fill="var(--shirt-blue)" stroke="var(--art-ink)" stroke-width="2"/>${frank ? '<path d="M111 80q0 16-23 11" stroke="var(--art-ink)" stroke-width="3"/><rect x="83" y="87" width="11" height="7" rx="3" fill="var(--art-ink)"/>' : ''}` : ''}
      </g>
      <path d="M49 116q-20 28 5 53M111 116q20 28-6 53" stroke="var(--art-ink)" stroke-width="17"/><path d="M49 116q-20 28 5 53M111 116q20 28-6 53" stroke="${skin}" stroke-width="12"/>
      <path d="M48 107q-11 9-15 24l18 7 10-26M112 107q11 9 15 24l-18 7-10-26" fill="${shirt}" stroke="var(--art-ink)" stroke-width="2.5"/>
      <g class="held-device">${deviceArt}</g>
      <g class="holding-hands" fill="${skin}" stroke="var(--art-ink)" stroke-width="2"><path d="M47 174q-4-7 3-10l10 1q5 6-1 11z"/><path d="M103 164l10-1q7 4 2 11l-12 2q-5-6 0-12z"/></g>
      <g class="crossed-arms" fill="${skin}" stroke="var(--art-ink)" stroke-width="2"><path d="M45 169q-2-8 6-8l14 5-4 10z"/><path d="M97 166l16-5q8 1 3 10l-14 5z"/></g>
      ${gary || h % 5 === 0 ? '<g transform="translate(117 167)"><path d="M14 3h5q9 9-2 13h-4" stroke="var(--art-ink)" stroke-width="3"/><rect width="16" height="22" rx="4" fill="var(--paper)" stroke="var(--art-ink)" stroke-width="2"/><path d="M4 9h7" stroke="var(--accent)" stroke-width="2"/></g>' : ''}
    </g>
    <g class="patience-steam" stroke="var(--muted)" stroke-width="3"><path d="M31 51q-10-10 0-20t0-17M129 51q10-10 0-20t0-17"/></g>
    <g class="celebrate" stroke="var(--good)" stroke-width="4"><path d="M22 80l-9-7m125 7 9-7M36 18l-7-8m95 8 7-8M122 111l8 8 15-20"/></g>
  </svg>`;
}

export function roomSVG() {
  return `<svg class="office-room" aria-hidden="true" viewBox="0 0 1440 740" preserveAspectRatio="xMidYMid slice" fill="none" stroke-linecap="round" stroke-linejoin="round">
    <path d="M0 0h1440v740H0z" fill="var(--tile)"/>
    <path d="M0 0h1440v300H0z" fill="var(--wall)"/>
    <path d="M0 300h1440v18H0z" fill="var(--wall-base)"/><path d="M0 318h1440" stroke="var(--machine-edge)" stroke-width="3"/>
    <path d="M0 740l570-422m-190 422 290-422m290 422-190-422m570 422L870 318M0 410h1440M0 550h1440" stroke="var(--mat-line)" stroke-width="2" opacity=".32"/>
    <path d="M84 444h657l132 225H13z" fill="var(--bench-mat)" stroke="var(--mat-line)" stroke-width="3"/><path d="M101 462h620l108 187H37z" stroke="var(--surface)" stroke-width="2" opacity=".45"/>
    <g stroke="var(--machine-edge)" stroke-width="3"><path d="M39 51h186v264H39z" fill="var(--machine-side)"/><path d="M50 61h164v247H50z" fill="var(--surface-2)"/><path d="M64 77h136v174H64z" fill="var(--sky)"/><path d="M73 82l117 150M80 81l116 148" stroke="var(--paper)" opacity=".45"/><path d="M194 188v34" stroke-width="6"/><path d="M60 270h144"/><rect x="91" y="113" width="85" height="31" rx="5" fill="var(--paper)"/><text x="133" y="134" text-anchor="middle" font-family="var(--font-mono)" font-size="12" fill="var(--art-ink)" stroke="none">WELCOME</text></g>
    <g transform="translate(400 40)"><rect width="410" height="188" rx="18" fill="var(--machine-edge)"/><rect x="9" y="9" width="392" height="166" rx="11" fill="var(--sky)"/>
      <circle class="window-sun" cx="323" cy="45" r="23" fill="var(--sun)"/><g class="window-stars" fill="var(--paper)"><circle cx="58" cy="37" r="2"/><circle cx="148" cy="54" r="3"/><circle cx="246" cy="30" r="2"/></g><path class="window-moon" d="M330 22a24 24 0 1 0 23 35 22 22 0 0 1-23-35" fill="var(--paper)"/>
      <path d="M10 150V113h36V92h36v58h25V103h55v47h25V84h40v66h29V98h65v52h32V76h37v74z" fill="var(--distant)"/><path d="M10 150h390v25H10z" fill="var(--leaf-dark)" opacity=".5"/><path d="M142 9v166m128-166v166M9 98h392" stroke="var(--machine-edge)" stroke-width="7"/><rect x="-12" y="178" width="434" height="13" rx="5" fill="var(--wood-light)" stroke="var(--machine-edge)" stroke-width="3"/>
    </g>
    <g transform="translate(262 64)" stroke="var(--machine-edge)" stroke-width="3"><rect width="96" height="134" rx="5" fill="var(--surface)"/><path d="M25 37h46m-23-23v46" stroke="var(--accent)" stroke-width="12"/><text x="48" y="91" text-anchor="middle" font-family="var(--font-display)" font-size="12" stroke="none" fill="var(--ink)">STAY CURIOUS</text><path d="M21 107h54m-46 7h38" stroke="var(--muted)" stroke-width="2"/></g>
    <g transform="translate(906 55)"><rect width="106" height="100" rx="8" fill="var(--surface)" stroke="var(--machine-edge)" stroke-width="3"/><svg x="18" y="4" width="70" height="70" viewBox="0 0 70 70"><circle cx="35" cy="33" r="28" fill="var(--surface-2)" stroke="var(--machine-edge)" stroke-width="3"/><path class="clock-hour" d="M35 33V18" stroke="var(--ink)" stroke-width="4"/><path class="clock-minute" d="M35 33V11" stroke="var(--accent)" stroke-width="3"/><circle cx="35" cy="33" r="4" fill="var(--ink)"/></svg><text x="53" y="88" text-anchor="middle" font-family="var(--font-mono)" font-size="10" fill="var(--ink)">ONE FIX AT A TIME</text></g>
    <g transform="translate(1110 88)" stroke="var(--machine-edge)" stroke-width="3"><rect width="204" height="220" rx="12" fill="var(--machine-side)"/><rect x="12" y="14" width="180" height="190" rx="7" fill="var(--display-bg)"/>${[26,80,134].map(y=>`<rect x="24" y="${y}" width="156" height="42" rx="5" fill="var(--machine-edge)"/><path d="M36 ${y+13}h93m-93 8h93m-93 8h93" stroke="var(--display-line)" stroke-width="3"/><circle class="blink" cx="162" cy="${y+21}" r="5" fill="var(--display-text)" stroke="none"/>`).join('')}<path d="M22 220v12m160-12v12" stroke-width="9"/></g>
    <g transform="translate(1320 190)" stroke="var(--leaf-dark)" stroke-width="4"><path d="M39 102V4m0 64Q-7 62 0 28q36 5 39 40m0-23q45-4 42-42-37 5-42 42m0 45q-44 4-45-24 33-4 45 24" fill="var(--leaf)"/><path d="M9 100h60l-9 60H18z" fill="var(--pot)" stroke="var(--machine-edge)"/></g>
    <g transform="translate(849 252)" stroke="var(--machine-edge)" stroke-width="3"><path d="M0 0h201v50H0z" fill="var(--wood-light)"/><path d="M9 50v59m180-59v59" stroke-width="9"/><path d="M7 5h188" stroke="var(--paper)"/></g>
    <path d="M271 237h555" stroke="var(--machine-edge)" stroke-width="6"/><path d="M300 240v14m490-14v14" stroke="var(--machine-edge)" stroke-width="5"/>
    <g fill="var(--paper)" stroke="var(--machine-edge)" stroke-width="2"><path d="M289 200h16v36h-16z"/><path d="M306 194h17v42h-17z"/><path d="M325 203l15-4 10 34-15 4z"/></g>
  </svg>`;
}

export function deskSVG() {
  return `<svg class="desk-art" aria-hidden="true" viewBox="0 0 900 180" preserveAspectRatio="none" fill="none" stroke="var(--machine-edge)" stroke-width="3" stroke-linejoin="round">
    <path d="M65 25h770l57 82H8z" fill="var(--wood-light)"/><path d="M8 107h884v29H8z" fill="var(--wood)"/><path d="M50 137v43m800-43v43" stroke-width="18"/><path d="M65 32h770" stroke="var(--paper)" opacity=".65"/>
    <path d="M378 0h142l19 49H359z" fill="var(--machine-side)"/><path d="M330 48h238l14 14H315z" fill="var(--machine-shell)"/>
    <path d="M245 69h350l22 28H222z" fill="var(--machine-shell)"/><path d="M258 77h324m-330 8h337" stroke="var(--machine-edge)" stroke-width="4" stroke-dasharray="13 5"/><path d="M360 92h130" stroke="var(--machine-edge)" stroke-width="4"/>
    <ellipse cx="671" cy="81" rx="39" ry="17" fill="var(--bench-mat)" stroke="var(--mat-line)"/><path d="M656 80q2-24 28-3l3 9q-16 10-31-1z" fill="var(--machine-shell)"/><path d="M672 70v8"/>
    <path d="M120 38h44v41q-22 12-44 0z" fill="var(--surface)"/><path d="M166 47h9q22 22-10 25" stroke-width="5"/><path d="M132 55h20m-10-10v20" stroke="var(--accent)" stroke-width="4"/>
    <path d="M741 56l49-7 11 27-49 7z" fill="var(--paper)"/><path d="M755 62l29-4m-26 12 20-3" stroke-width="2"/>
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
    const casing = device === 'printer'
      ? `<path d="M188 110V32h228v78" fill="var(--paper)" stroke="${edge}" stroke-width="3"/><path d="M212 50h180m-180 15h180" stroke="var(--muted)" stroke-width="3"/><path d="M125 110l30-35h302l36 35v220H125z" fill="${dark}" stroke="${edge}" stroke-width="3"/><rect x="125" y="110" width="340" height="220" rx="16" fill="${front}" stroke="${edge}" stroke-width="4"/>`
      : device === 'server'
      ? `<path d="M140 24h325l28 27v310H140z" fill="${dark}" stroke="${edge}" stroke-width="3"/><rect x="125" y="24" width="340" height="337" rx="14" fill="${front}" stroke="${edge}" stroke-width="4"/><path d="M150 35h290m-290 313h290" stroke="${dark}" stroke-width="7"/>`
      : device === 'monitor' || device === 'tv'
      ? `<path d="M275 300h62l17 47h-96z" fill="${dark}" stroke="${edge}" stroke-width="3"/><path d="M231 347h151l22 14H210z" fill="${front}" stroke="${edge}" stroke-width="3"/><rect x="${device==='tv'?80:110}" y="48" width="${device==='tv'?440:380}" height="272" rx="17" fill="${dark}" stroke="${edge}" stroke-width="4"/><rect x="125" y="62" width="340" height="249" rx="20" fill="${front}" stroke="${edge}" stroke-width="3"/>`
      : `<path d="M155 62h310l28 28v240H155z" fill="${dark}"/><rect x="125" y="62" width="340" height="268" rx="20" fill="${front}" stroke="${edge}" stroke-width="4"/><path d="M165 215h238v29H165z" fill="${dark}" stroke="${edge}" stroke-width="2"/><path d="M168 77h35m192 0h35m-262 237h35m192 0h35" stroke="${edge}" stroke-width="7"/>`;
    body = `${casing}
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
  return `<svg class="home-illustration" aria-hidden="true" viewBox="0 0 700 430" fill="none" stroke-linejoin="round" stroke-linecap="round">
    <ellipse cx="350" cy="389" rx="315" ry="28" fill="var(--art-shadow)"/>
    <path d="M48 123L360 29l282 115v190L330 417 48 294z" fill="var(--wall-base)" stroke="var(--machine-edge)" stroke-width="3"/>
    <path d="M48 123l312-94v200L48 321z" fill="var(--wall)" stroke="var(--machine-edge)" stroke-width="3"/><path d="M360 29l282 115v197L360 229z" fill="var(--surface-2)" stroke="var(--machine-edge)" stroke-width="3"/>
    <path d="M48 321l312-92 282 82-312 106z" fill="var(--tile)" stroke="var(--machine-edge)" stroke-width="3"/>
    <path d="M83 132l221-67v111L83 243z" fill="var(--sky-day)" stroke="var(--machine-edge)" stroke-width="5"/><path d="M151 112v112m76-135v112" stroke="var(--machine-edge)" stroke-width="5"/><path d="M87 204l39-12v-27l25-8v49l43-13v-37l34-10v37l72-21" fill="var(--distant)"/>
    <g transform="translate(370 56)"><svg width="125" height="196" viewBox="0 0 160 250">${personSVG('Jules the intern','laptop').replace(/^<svg[^>]*>/,'').replace(/<\/svg>$/,'')}</svg></g>
    <path d="M130 264l300-87 169 78-295 98z" fill="var(--wood-light)" stroke="var(--machine-edge)" stroke-width="3"/><path d="M130 264v72l174 80v-63z" fill="var(--wood)" stroke="var(--machine-edge)" stroke-width="3"/><path d="M304 353l295-98v73l-295 88z" fill="var(--machine-side)" stroke="var(--machine-edge)" stroke-width="3"/>
    <path d="M191 196l120-31v92l-120 31z" fill="var(--machine-shell)" stroke="var(--machine-edge)" stroke-width="3"/><path d="M199 202l104-27v73l-104 28z" fill="var(--display-bg)"/><path d="M249 272v22l-20 7 51-14-21 1v-18" fill="var(--machine-side)" stroke="var(--machine-edge)" stroke-width="3"/><path d="M217 216l64-17m-64 29 45-12m-45 24 58-16" stroke="var(--display-text)" stroke-width="4"/>
    <path d="M233 305l92-26 27 14-93 28z" fill="var(--machine-shell)" stroke="var(--machine-edge)" stroke-width="2"/>
    <path d="M463 317l79-26v30l-79 26z" fill="var(--paper)" stroke="var(--machine-edge)" stroke-width="2"/><text x="474" y="329" transform="rotate(-18 474 329)" font-family="var(--font-mono)" font-size="10" font-weight="700" fill="var(--art-ink)">DEVICE CARE</text>
    <g transform="translate(546 158)"><path d="M0 47V0m0 30q-32-6-24-27 21 4 24 27m0-11q30-2 22-25Q2-1 0 19" fill="var(--leaf)" stroke="var(--leaf-dark)" stroke-width="3"/><path d="M-20 42h40l-5 28h-30z" fill="var(--pot)" stroke="var(--machine-edge)" stroke-width="3"/></g>
  </svg>`;
}
