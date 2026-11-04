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

export function face(happy) {
  return happy
    ? `<svg aria-hidden="true" viewBox="0 0 24 24" width="24" height="24"><circle cx="12" cy="12" r="10" fill="currentColor"/><circle cx="8.6" cy="10" r="1.5" fill="var(--face-ink)"/><circle cx="15.4" cy="10" r="1.5" fill="var(--face-ink)"/><path d="M7.8 14.2q4.2 4 8.4 0" fill="none" stroke="var(--face-ink)" stroke-width="1.9" stroke-linecap="round"/></svg>`
    : `<svg aria-hidden="true" viewBox="0 0 24 24" width="24" height="24"><circle cx="12" cy="12" r="9" fill="none" stroke="currentColor" stroke-width="2"/><path d="M7.5 8.5l2.5 1.6M16.5 8.5L14 10.1" stroke="currentColor" stroke-width="1.8" stroke-linecap="round"/><path d="M8 16.5q4-3 8 0" fill="none" stroke="currentColor" stroke-width="1.9" stroke-linecap="round"/></svg>`;
}

// --- character avatars -----------------------------------------------------
// Every sender gets a face, generated deterministically from their name, so
// Gary always looks like Gary. The regulars and the CEO get custom looks.

const AV_BG = ['#f7c948', '#7fd3e6', '#c9b1ff', '#9ad9ab', '#f2938b', '#ffd37a', '#9cc1ff', '#f9a8d4'];
const AV_SKIN = ['#ffdbac', '#f1c27d', '#c68642', '#8d5524'];
const AV_HAIR = ['#2f2a26', '#6b4423', '#b45309', '#555b63', '#d6a65c'];

const hashName = (s) => {
  let h = 0;
  for (const c of s) h = (h * 31 + c.charCodeAt(0)) | 0;
  return Math.abs(h);
};

const av = (bg, body) =>
  `<svg aria-hidden="true" viewBox="0 0 32 32"><circle cx="16" cy="16" r="16" fill="${bg}"/>${body}</svg>`;

const baseFace = (skin, extra = '') => `
  <path d="M5 29c1.6-4.6 6-7 11-7s9.4 2.4 11 7z" fill="#3e4653"/>
  <circle cx="16" cy="14" r="7.5" fill="${skin}"/>
  ${extra}
  <circle cx="13.2" cy="14" r="1.1" fill="#2b2b2b"/>
  <circle cx="18.8" cy="14" r="1.1" fill="#2b2b2b"/>
  <path d="M13 17.4q3 2.4 6 0" fill="none" stroke="#2b2b2b" stroke-width="1.4" stroke-linecap="round"/>`;

const HAIRCUTS = [
  (c) => `<path d="M8.5 14c0-5 3.4-8 7.5-8s7.5 3 7.5 8l-2.2-.6c-.9-3-2.7-4.6-5.3-4.6s-4.4 1.6-5.3 4.6z" fill="${c}"/>`,
  (c) => `<circle cx="11" cy="9" r="3" fill="${c}"/><circle cx="16" cy="7.2" r="3.2" fill="${c}"/><circle cx="21" cy="9" r="3" fill="${c}"/>`,
  (c) => `<path d="M8.5 14c0-5 3.4-8 7.5-8s7.5 3 7.5 8l-2.2-.6c-.9-3-2.7-4.6-5.3-4.6s-4.4 1.6-5.3 4.6z" fill="${c}"/><circle cx="16" cy="4.6" r="2.3" fill="${c}"/>`,
  () => '',
];

const SPECIAL_AVATARS = {
  'The CEO': () => av('#f7c948', `
    ${baseFace('#f1c27d')}
    <path d="M9.5 8.5l3 2.4 3.5-3.4 3.5 3.4 3-2.4v3.3h-13z" fill="#b8860b"/>
    <rect x="10.6" y="12.2" width="4.6" height="2.6" rx="1" fill="#1d242f"/>
    <rect x="16.8" y="12.2" width="4.6" height="2.6" rx="1" fill="#1d242f"/>
    <path d="M15.2 12.9h1.6" stroke="#1d242f" stroke-width="1.2"/>`),
  'Gary (it’s always Gary)': () => av('#9cc1ff', `
    ${baseFace('#ffdbac', `<path d="M10 9.5l2-2.5 2 1.5 2-2 2 2 2-1.5 2 2.5" fill="none" stroke="#6b4423" stroke-width="2" stroke-linecap="round"/>`)}
    <path d="M11.8 12.6h2.8M17.4 12.6h2.8" stroke="#2b2b2b" stroke-width="1.1" stroke-linecap="round"/>
    <path d="M12 16.1q1.2.8 2.4 0M17.6 16.1q1.2.8 2.4 0" fill="none" stroke="#b08968" stroke-width="0.9"/>`),
  'Jules the intern': () => av('#9ad9ab', `
    ${baseFace('#c68642')}
    <path d="M8.5 13.5a7.5 7.5 0 0 1 15 0" fill="none" stroke="#1d242f" stroke-width="2.4"/>
    <rect x="7" y="12" width="3.4" height="5.4" rx="1.6" fill="#1d242f"/>
    <rect x="21.6" y="12" width="3.4" height="5.4" rx="1.6" fill="#1d242f"/>`),
  'Frank, remote': () => av('#ffd37a', `
    ${baseFace('#8d5524', HAIRCUTS[0]('#555b63'))}
    <path d="M8.5 13.5a7.5 7.5 0 0 1 15 0" fill="none" stroke="#1d242f" stroke-width="2.2"/>
    <rect x="21.4" y="12.2" width="3.2" height="5" rx="1.5" fill="#1d242f"/>
    <path d="M22.8 17.2q0 3-4.2 3.2" fill="none" stroke="#1d242f" stroke-width="1.6"/>
    <circle cx="18" cy="20.6" r="1.3" fill="#1d242f"/>`),
  'Everyone, floor 3': () => av('#f2938b', `
    <circle cx="9.5" cy="13" r="4.4" fill="#f1c27d"/><circle cx="22.5" cy="13" r="4.4" fill="#8d5524"/>
    <circle cx="16" cy="15.5" r="5.2" fill="#c68642"/>
    <path d="M4 29c2-5 6.5-7.5 12-7.5S26 24 28 29z" fill="#3e4653"/>
    <circle cx="14.2" cy="15" r="0.9" fill="#2b2b2b"/><circle cx="17.8" cy="15" r="0.9" fill="#2b2b2b"/>
    <path d="M14.4 18q1.6 1.2 3.2 0" fill="none" stroke="#2b2b2b" stroke-width="1.2" stroke-linecap="round"/>`),
};

export function avatar(name, kind) {
  if (kind === 'spam') {
    return av('#8a93a4', `
      <path d="M7 16q5-5.5 11-5.5 3.6 0 6.5 2.2L27 10v12l-2.5-2.7Q21.6 21.5 18 21.5 12 21.5 7 16z" fill="#5f6b7d"/>
      <circle cx="12.5" cy="14.8" r="1.2" fill="#fff"/>
      <path d="M16 3v6" stroke="#2b2b2b" stroke-width="1.4"/>
      <path d="M16 9q2.6.8 1.6 3" fill="none" stroke="#2b2b2b" stroke-width="1.4" stroke-linecap="round"/>`);
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
    <rect x="8" y="9" width="32" height="20" rx="2.5" fill="var(--surface-2)" stroke="var(--muted)" stroke-width="2"/>
    <path d="M15 15l4 4m0-4l-4 4M29 15l4 4m0-4l-4 4" stroke="var(--danger)" stroke-width="2" stroke-linecap="round"/>
    <path d="M20 24q4-2.4 8 0" fill="none" stroke="var(--muted)" stroke-width="1.8" stroke-linecap="round"/>
    <path d="M4 35l4-6h32l4 6z" fill="var(--surface-2)" stroke="var(--muted)" stroke-width="2" stroke-linejoin="round"/>
    <rect x="20" y="31.5" width="8" height="2" rx="1" fill="var(--muted)"/>
  </svg>`,
  printer: `<svg aria-hidden="true" viewBox="0 0 48 48">
    <path d="M15 17V7h18v10" fill="var(--surface)" stroke="var(--muted)" stroke-width="2" stroke-linejoin="round"/>
    <path d="M17 11l3 2 4-3 4 3 3-2" fill="none" stroke="var(--muted)" stroke-width="1.6"/>
    <rect x="6" y="17" width="36" height="15" rx="3" fill="var(--surface-2)" stroke="var(--muted)" stroke-width="2"/>
    <rect x="12" y="21" width="13" height="2.6" rx="1.3" fill="var(--muted)"/>
    <circle class="blink" cx="36" cy="24.5" r="2.2" fill="var(--danger)"/>
    <path d="M14 32l2 5 3.5-2.5 2 4.5 3.5-3 2.5 3.5 2.5-4" fill="none" stroke="var(--muted)" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"/>
  </svg>`,
  phone: `<svg aria-hidden="true" viewBox="0 0 48 48">
    <rect x="15" y="4" width="18" height="40" rx="4.5" fill="var(--surface-2)" stroke="var(--muted)" stroke-width="2"/>
    <path d="M24 8l-3.5 7 5 4-4 6.5 3 5" fill="none" stroke="var(--accent)" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"/>
    <circle cx="20.5" cy="31" r="1.2" fill="var(--muted)"/>
    <circle cx="27.5" cy="31" r="1.2" fill="var(--muted)"/>
    <path d="M21 35.5q3-2 6 0" fill="none" stroke="var(--muted)" stroke-width="1.6" stroke-linecap="round"/>
    <rect x="21" y="40" width="6" height="1.8" rx="0.9" fill="var(--muted)"/>
  </svg>`,
  monitor: `<svg aria-hidden="true" viewBox="0 0 48 48">
    <rect x="6" y="8" width="36" height="24" rx="2.5" fill="var(--surface-2)" stroke="var(--muted)" stroke-width="2"/>
    <path class="signal" d="M12 20h5l3-6 4 11 3-7h9" fill="none" stroke="var(--accent)" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
    <circle class="blink" cx="39" cy="29" r="1.6" fill="var(--good)"/>
    <path d="M20 36h8l2-4H18z" fill="var(--surface-2)" stroke="var(--muted)" stroke-width="2" stroke-linejoin="round"/>
    <rect x="14" y="38" width="20" height="2.6" rx="1.3" fill="var(--muted)"/>
  </svg>`,
};

// The big jobs get bigger art.
DEVICE_ART.server = `<svg aria-hidden="true" viewBox="0 0 48 48">
    <path class="flame" d="M33 8c2.4 1.8 3.6 3.8 3.6 5.8 0 2.4-1.7 4-3.8 4s-3.8-1.6-3.8-4c0-1.4.6-2.4 1.6-3.6 0 1.2.7 2 1.6 2.2-.4-1.6-.1-3 0.8-4.4z" fill="#f59e0b"/>
    <rect x="12" y="10" width="20" height="32" rx="2.5" fill="var(--surface-2)" stroke="var(--muted)" stroke-width="2"/>
    <path d="M16 17h8M16 25h8M16 33h8" stroke="var(--muted)" stroke-width="2" stroke-linecap="round"/>
    <circle class="blink" cx="28" cy="17" r="1.6" fill="var(--danger)"/>
    <circle class="blink p2" cx="28" cy="25" r="1.6" fill="var(--good)"/>
    <circle class="blink" cx="28" cy="33" r="1.6" fill="var(--warn)"/>
  </svg>`;
DEVICE_ART.tv = `<svg aria-hidden="true" viewBox="0 0 48 48">
    <rect x="4" y="10" width="40" height="26" rx="3" fill="var(--surface-2)" stroke="var(--muted)" stroke-width="2"/>
    <g opacity=".5" fill="var(--muted)">
      <circle cx="12" cy="17" r="1"/><circle cx="20" cy="30" r="1"/><circle cx="30" cy="15" r="1"/>
      <circle cx="37" cy="27" r="1"/><circle cx="16" cy="24" r="1"/><circle cx="33" cy="21" r="1"/>
    </g>
    <g class="ghost">
      <circle cx="22" cy="21" r="1.6" fill="var(--muted)"/>
      <circle cx="28" cy="21" r="1.6" fill="var(--muted)"/>
      <path d="M22 26q3 2 6 0" fill="none" stroke="var(--muted)" stroke-width="1.6" stroke-linecap="round"/>
    </g>
    <path d="M22 36v4m4-4v4M18 42h12" stroke="var(--muted)" stroke-width="2" stroke-linecap="round"/>
  </svg>`;
