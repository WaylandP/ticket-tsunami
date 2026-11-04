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
  `<path d="M64 58l-7-21 9-6-7-12 20 3 5-17 17 15 17-17 4 18 20-5-5 18 9 9-10 20-8-24q-26 10-45-2L73 60z"/><path d="M80 27l14 3 18-4" fill="none" stroke="var(--paper)" opacity=".14" stroke-width="3"/>`,
];

/** Name-seeded adult silhouettes. Both hands contact the equipment in every pose. */
export function personSVG(name, device) {
  const h=hashName(name), ceo=name==='The CEO', gary=name.startsWith('Gary'), jules=name==='Jules the intern', frank=name==='Frank, remote';
  const skin=AV_SKIN[h%4], hair=AV_HAIR[(h>>>4)%5], shirt=ceo?'var(--surface-2)':SHIRTS[(h>>>6)%5];
  const haircut=gary?5:ceo||frank?0:(h>>>2)%6, broad=h%3===0?8:0, blazer=ceo||h%3===1;
  const phone=device==='phone', tall=device==='server';
  const placement=phone?'x="66" y="154" width="68" height="68"':'x="50" y="131" width="100" height="100"';
  const mounted=(DEVICE_ART[device]||DEVICE_ART.laptop).replace(/^<svg[^>]*>/, `<svg ${placement} viewBox="0 0 64 64" fill="none" stroke="var(--art-ink)" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round">`);
  const lx=phone?86:tall?73:59, rx=phone?115:tall?125:143, hy=phone?205:tall?207:device==='monitor'||device==='tv'?199:207;
  return `<svg aria-hidden="true" viewBox="0 0 200 260" class="person" fill="none" stroke="var(--art-ink)" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round">
    <ellipse cx="102" cy="251" rx="66" ry="8" fill="var(--art-shadow)" stroke="none"/>
    <g class="person-body">
      <path d="M65 193h73l-5 49h-29l-5-31-4 31H66z" fill="var(--trousers)"/><path d="M70 203h58m-28 0v12" opacity=".3"/>
      <g class="leg"><path d="M66 239h29v13H52q-4-7 14-13" fill="var(--art-ink)"/><path d="M53 250h42" stroke="var(--paper)" stroke-width="2"/></g>
      <g class="tap-foot"><path d="M104 239h29q22 6 18 13h-47z" fill="var(--art-ink)"/><path d="M105 250h46" stroke="var(--paper)" stroke-width="2"/></g>
      ${haircut===4?`<path d="M61 58l-9 72q46 18 96-2l-7-70z" fill="${hair}"/>`:''}
      <path d="M${59-broad} 109q39-18 ${82+broad*2} 0l13 84q-54 17-${108+broad*2} 0z" fill="${shirt}"/>
      <path d="M61 128l-5 60m87-60 4 60" stroke="var(--paper)" stroke-width="3" opacity=".17"/>
      <path d="M85 87v23q15 15 31-1V87" fill="${skin}"/><path d="M86 96q14 11 29-1v7q-15 9-29 0" fill="var(--art-ink)" opacity=".12" stroke="none"/>
      <path d="M78 106l23 20 23-20-11 37H88z" fill="var(--paper)"/>
      <path d="M78 105l22 16-15 12-15-22m54-6-24 16 15 12 17-22" fill="${shirt}"/>
      ${blazer?`<path d="M70 110l-6 17 15 4-8 12 14 40m47-73 7 17-15 4 8 12-14 40" stroke="var(--paper)" stroke-width="2" opacity=".6"/>`:`<path d="M101 129v33" stroke-width="1.3"/><circle cx="106" cy="137" r="1"/><circle cx="106" cy="148" r="1"/>`}
      ${ceo?'<path d="M100 123l-6 7 7 26 6-26z" fill="var(--shirt-red)"/>':'<path d="M81 110l19 37 22-37" stroke="var(--accent)" stroke-width="3"/><rect x="118" y="132" width="16" height="22" rx="2" fill="var(--paper)" stroke-width="1.5"/><rect x="123" y="130" width="6" height="4" rx="1" fill="var(--machine-side)" stroke-width="1"/><circle cx="126" cy="140" r="3" fill="var(--shirt-blue)" stroke="none"/><path d="M122 146h8m-8 3h5" stroke-width="1"/>'}
      <g class="head">
        <ellipse cx="67" cy="63" rx="8" ry="11" fill="${skin}"/><ellipse cx="136" cy="63" rx="8" ry="11" fill="${skin}"/>
        <path d="M67 47q0-28 34-28 35 0 35 29l-2 28q-2 12-13 19l-17 8q-10 1-23-9-13-8-14-20z" fill="${skin}"/>
        <path d="M130 48v24q-1 20-26 28l-7-1q26-12 27-30V44z" fill="var(--art-ink)" opacity=".09" stroke="none"/>
        <g fill="${hair}" stroke="none">${HAIR_SHAPES[haircut]}</g>
        <path d="M77 53q8-5 17-1m16 0q9-4 16 2" stroke="${hair}" stroke-width="3.2"/>
        <g class="eyes"><path d="M76 63q8-10 17 0-8 9-17 0m34 0q8-10 17 1-9 8-17-1" fill="var(--paper)" stroke-width="1"/><ellipse cx="86" cy="62" rx="3.3" ry="4.2" fill="var(--art-ink)" stroke="none"/><ellipse cx="118" cy="62" rx="3.3" ry="4.2" fill="var(--art-ink)" stroke="none"/><circle cx="87" cy="60.5" r="1" fill="var(--paper)" stroke="none"/><circle cx="119" cy="60.5" r="1" fill="var(--paper)" stroke="none"/></g>
        <path d="M102 63l-3 11q3 2 7 0" opacity=".55" stroke-width="1.7"/>
        <ellipse cx="79" cy="75" rx="6" ry="3" fill="var(--shirt-red)" opacity=".25" stroke="none"/><ellipse cx="124" cy="75" rx="6" ry="3" fill="var(--shirt-red)" opacity=".25" stroke="none"/>
        <path class="smile" d="M91 83q11 5 21-2-3 12-13 10-5-1-8-8z" fill="var(--paper)" stroke-width="1.7"/><path class="frown" d="M92 87q9-7 20-2" stroke-width="2"/>
        ${h%7===0&&!jules?`<path d="M75 79q11 15 26 15 16 0 28-15-3 18-26 23-23-3-28-23z" fill="${hair}" stroke="none"/><path d="M92 79q10-4 19 0" stroke="${hair}" stroke-width="3"/>`:''}
        ${ceo||h%4===0?`<g fill="${ceo?'var(--art-ink)':'none'}" stroke-width="2.7"><rect x="72" y="56" width="26" height="17" rx="6"/><rect x="106" y="56" width="26" height="17" rx="6"/><path d="M98 61h8m-39-3 5 2m60 0 5-2"/></g>`:''}
        ${ceo?'<path d="M73 26l-5-20 20 10L102 3l14 13 20-10-5 20z" fill="var(--shirt-gold)"/><path d="M76 18h52" stroke="var(--paper)" stroke-width="2"/>':''}
        ${gary?'<path d="M78 70h14m18 0h15" stroke-width="2" opacity=".45"/><path d="M78 59h16m16 0h15" stroke-width="2"/>':''}
        ${jules||frank?`<path d="M63 61V43q0-31 39-31 39 0 39 31v18" stroke="var(--art-ink)" stroke-width="6"/><rect x="57" y="54" width="13" height="25" rx="6" fill="var(--machine-side)"/><rect x="134" y="54" width="13" height="25" rx="6" fill="var(--machine-side)"/><path d="M60 60v12m84-12v12" stroke="var(--paper)" opacity=".5"/>${frank?'<path d="M141 77q3 17-24 13" stroke-width="3"/><rect x="111" y="86" width="11" height="6" rx="3" fill="var(--art-ink)"/>':''}`:''}
      </g>
      <path d="M${55-broad} 119Q26 145 38 178L${lx} ${hy}M${146+broad} 119q27 26 15 59l${rx-161} ${hy-178}" stroke="var(--art-ink)" stroke-width="22"/>
      <path d="M${55-broad} 119Q26 145 38 178L${lx} ${hy}M${146+broad} 119q27 26 15 59l${rx-161} ${hy-178}" stroke="${skin}" stroke-width="17"/>
      <path d="M${58-broad} 108q-21 5-28 35l23 9 15-31m${73+broad} -13q21 5 28 35l-23 9-15-31" fill="${shirt}"/>
      <path d="M31 141l24 9m90 0 24-9" stroke="var(--paper)" stroke-width="5"/>
      <g class="held-device">${mounted}</g>
      <g class="holding-hands" fill="${skin}" stroke-width="1.7"><path d="M${lx-8} ${hy-5}q-2-6 3-8l9 3q5 3 3 7l-3 7q-7 2-11-2z"/><path d="M${rx+8} ${hy-5}q2-6-3-8l-9 3q-5 3-3 7l3 7q7 2 11-2z"/><path d="M${lx-4} ${hy}l6 2m${rx-2} 0 6-2" stroke-width="1"/></g>
      <g class="crossed-arms" fill="${skin}" stroke-width="1.7"><path d="M${lx-8} ${hy-3}q-2-8 5-10l10 2q4 3 0 7l-5 8q-10 1-10-7z"/><path d="M${rx+8} ${hy-3}q2-8-5-10l-10 2q-4 3 0 7l5 8q10 1 10-7z"/></g>
      <path d="M41 179l-5 6" stroke="var(--surface-2)" stroke-width="6"/><rect x="33" y="178" width="9" height="10" rx="2" fill="var(--machine-shell)" stroke-width="1.5"/>
    </g>
    <g class="patience-steam" stroke="var(--muted)" stroke-width="3"><path d="M37 56q-9-11 0-21t0-17M166 56q9-11 0-21t0-17"/></g>
    <g class="celebrate" stroke="var(--good)" stroke-width="4"><path d="M28 83l-12-7m157 7 12-7M44 21l-7-9m126 9 7-9M153 111l9 9 17-22"/></g>
  </svg>`;
}

// --- interior architecture ---------------------------------------------------
const plantSVG = (x,y,scale=1) => `<g transform="translate(${x} ${y}) scale(${scale})" stroke="var(--leaf-dark)" stroke-width="2.5"><path d="M30 86V7m0 36Q0 40 5 16q28 2 25 27m0 20q-35 2-29-24 27 1 29 24m0-32q31-1 29-25-26 4-29 25m0 43q33-2 32-25-28 4-32 25" fill="var(--leaf)"/><path d="M6 81h49l-7 43H13z" fill="var(--machine-shell)" stroke="var(--machine-edge)"/><path d="M11 88h39" stroke="var(--paper)" opacity=".6"/></g>`;
const officeChair = (x,y) => `<g transform="translate(${x} ${y})" stroke="var(--machine-edge)" stroke-width="3"><rect width="42" height="55" rx="12" fill="var(--surface-2)"/><path d="M7 11h28m-28 8h28m-28 8h28m-28 8h28" stroke="var(--line)" stroke-width="1"/><path d="M-5 53h53v12H-5z" fill="var(--machine-side)"/><path d="M22 66v23m-20 7 20-7 20 7m-20-6v9"/><circle cx="2" cy="97" r="3"/><circle cx="42" cy="97" r="3"/></g>`;
export function roomSVG() {
  return `<svg class="office-room" aria-hidden="true" viewBox="0 0 1440 740" preserveAspectRatio="xMidYMin slice" fill="none" stroke-linecap="round" stroke-linejoin="round">
    <path d="M0 0h1440v740H0z" fill="var(--tile)"/><path d="M0 0h1440v350H0z" fill="var(--wall)"/>
    <path d="M0 0h1440v35H0z" fill="var(--wall-base)"/><path d="M0 35h1440" stroke="var(--machine-edge)" stroke-width="3"/>
    ${[100,470,840,1210].map(x=>`<path d="M${x} 0l-18 35m200-35 18 35" stroke="var(--machine-edge)" opacity=".25"/><rect x="${x+30}" y="13" width="140" height="7" rx="3" fill="var(--paper)"/><path d="M${x+28} 24h145" stroke="var(--paper)" opacity=".15" stroke-width="7"/>`).join('')}
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
      <path d="M250 286h452v53H250z" fill="var(--wall-base)"/>
      <path d="M250 72h452v28H250z" fill="var(--wall)"/><path d="M276 86h120m73 0h120" stroke="var(--paper)" stroke-width="7"/>
      ${[280,476].map(x=>`<g stroke="var(--machine-edge)" stroke-width="2"><path d="M${x} 244h178v12H${x}z" fill="var(--wood-light)"/><path d="M${x+8} 256v65m154-65v65" stroke-width="5"/><rect x="${x+36}" y="190" width="66" height="44" rx="3" fill="var(--machine-side)"/><path d="M${x+42} 196h54v31h-54z" fill="var(--wall)"/><path d="M${x+68} 234v10m-11 0h23" stroke-width="4"/><rect x="${x+128}" y="213" width="21" height="30" rx="3" fill="var(--surface)"/></g>${officeChair(x+76,233)}`).join('')}
      <path d="M250 153h452v54H250z" fill="var(--paper)" opacity=".27"/><path d="M250 216h452m-452 9h452" stroke="var(--paper)" opacity=".45" stroke-width="5"/>
      <path d="M242 64h468v278H242zM398 64v278m156-278v278" stroke="var(--machine-edge)" stroke-width="7"/>
      <path d="M260 72l122 258m30-258 122 258m30-258 122 258" stroke="var(--paper)" opacity=".07" stroke-width="13"/>
    </g>
    <g class="network-rack" transform="translate(743 67)" stroke="var(--machine-edge)" stroke-width="2.5">
      <rect width="165" height="164" rx="7" fill="var(--machine-side)"/><rect x="9" y="10" width="147" height="144" rx="3" fill="var(--display-bg)"/>
      ${[22,65,113].map((y,i)=>`<rect x="18" y="${y}" width="129" height="31" rx="3" fill="var(--surface-2)"/>${Array.from({length:8},(_,n)=>`<rect x="${25+n*12}" y="${y+7}" width="8" height="7" rx="1" fill="var(--machine-side)" stroke-width="1"/><circle cx="${28+n*12}" cy="${y+20}" r="1.3" fill="var(--good)" stroke="none"/>`).join('')}<path d="M132 ${y+8}h7m-7 5h7m-7 5h7" stroke="var(--line)" stroke-width="1"/>`).join('')}
      ${[0,1,2,3,4,5].map(i=>`<path d="M${29+i*12} 35v${17+i*3}q0 ${15+i*2} ${60-i*5} ${15+i*2}v${12-i*5}" stroke="var(--${i%2?'accent':'display-text'})" stroke-width="2"/>`).join('')}
      <text x="82" y="181" text-anchor="middle" fill="var(--ink)" stroke="none" font-family="var(--font-mono)" font-size="10" font-weight="700">NETWORK / 03</text>
    </g>
    <g transform="translate(738 274)" stroke="var(--machine-edge)" stroke-width="2"><path d="M0 0h175v80H0z" fill="var(--machine-side)"/><path d="M0 38h175M5 80v8m165-8v8" stroke-width="4"/>${[10,64,118].map(x=>`<path d="M${x} 29l6-26h31l-5 26z" fill="var(--surface-2)"/><path d="M${x-2} 31h45" stroke="var(--paper)" stroke-width="3"/><rect x="${x+3}" y="49" width="35" height="23" rx="2" fill="var(--wood-light)"/>${assetTag(x+16,53)}`).join('')}</g>
    <g class="city-window" transform="translate(949 59)"><rect width="454" height="285" rx="6" fill="var(--machine-edge)"/><path d="M8 8h438v264H8z" fill="var(--sky)"/>
      <circle class="window-sun" cx="360" cy="60" r="22" fill="var(--sun)"/><g class="window-stars" fill="var(--paper)"><circle cx="45" cy="39" r="2"/><circle cx="178" cy="71" r="2"/><circle cx="283" cy="30" r="2"/></g><path class="window-moon" d="M364 32a24 24 0 1 0 22 35 24 24 0 0 1-22-35" fill="var(--paper)"/>
      <path d="M8 272V163h54v-42h50v151h30V96h68v176h26V153h46v119h28V129h66v143h25V83h45v189z" fill="var(--distant)"/>
      ${[20,73,154,247,323,411].map((x,i)=>`<path d="M${x} ${180-i*8}h18m-18 15h18m-18 15h18m-18 15h18m-18 15h18" stroke="var(--paper)" stroke-width="5" stroke-dasharray="5 4" opacity=".25"/>`).join('')}
      <path d="M152 8v264m149-264v264M8 92h438" stroke="var(--machine-edge)" stroke-width="7"/><path d="M14 10l120 252m40-252 110 252m35-252 110 252" stroke="var(--paper)" opacity=".08" stroke-width="17"/>
      <path d="M-9 285h472" stroke="var(--wood-light)" stroke-width="12"/>
    </g>
    <g transform="translate(636 83)"><svg width="61" height="61" viewBox="0 0 70 70"><circle cx="35" cy="33" r="29" fill="var(--surface)" stroke="var(--machine-edge)" stroke-width="3"/><path d="M35 8v4m0 42v4M10 33h4m42 0h4" stroke="var(--muted)" stroke-width="2"/><path class="clock-hour" d="M35 33V18" stroke="var(--ink)" stroke-width="3.5"/><path class="clock-minute" d="M35 33V11" stroke="var(--accent)" stroke-width="2"/><circle cx="35" cy="33" r="3" fill="var(--ink)"/></svg></g>
    ${plantSVG(1303,259,.9)}${plantSVG(678,260,.7)}
  </svg>`;
}

export function repairBenchSVG() {
  return `<svg class="repair-bench-art" aria-hidden="true" viewBox="0 0 700 130" preserveAspectRatio="none" fill="none" stroke="var(--machine-edge)" stroke-width="2" stroke-linejoin="round" stroke-linecap="round">
    <ellipse cx="350" cy="121" rx="327" ry="8" fill="var(--art-shadow)" stroke="none"/>
    <path d="M43 60h17v62H43zM640 60h17v62h-17z" fill="var(--machine-side)"/><path d="M61 99h579" stroke="var(--machine-edge)" stroke-width="7"/>
    <path d="M22 9h656l21 55H1z" fill="var(--wood-light)"/><path d="M1 64h698v13H1z" fill="var(--machine-side)"/><path d="M4 66h692" stroke="var(--paper)" opacity=".5"/>
    <path d="M159 16h382l15 41H143z" fill="var(--bench-mat)" stroke="var(--mat-line)"/>
    ${[25,34,43,52].map(y=>`<path d="M153 ${y}h392" stroke="var(--mat-line)" stroke-width=".5" opacity=".5"/>`).join('')}
    ${Array.from({length:18},(_,i)=>`<path d="M${170+i*20} 19l-5 35" stroke="var(--mat-line)" stroke-width=".5" opacity=".5"/>`).join('')}
    <path d="M165 48l8-18 8 18zM173 35v6m0 3v1" stroke="var(--display-text)" stroke-width="1.2"/>
    <g transform="translate(38 20)"><path d="M0 0h84l-8 32H-8z" fill="var(--surface-2)"/><path d="M9 7h57" stroke="var(--line)"/><path d="M7 14h48m-51 8h35" stroke="var(--machine-side)" stroke-width="4"/><path d="M53 15l7 9m5-9 7 9" stroke="var(--accent)" stroke-width="3"/></g>
    <g transform="translate(578 14)"><path d="M0 0h29v29H0z" fill="var(--surface)"/><path d="M30 7h6q15 14-5 15" stroke-width="3"/><path d="M7 10l-3 4 3 4m15-8 3 4-3 4m-7-10-3 19" stroke="var(--accent)" stroke-width="1.5"/><ellipse cx="14" cy="0" rx="14" ry="3" fill="var(--display-bg)"/></g>
    <rect x="286" y="78" width="128" height="21" rx="3" fill="var(--surface)"/><text x="350" y="92" fill="var(--ink)" stroke="none" text-anchor="middle" font-family="var(--font-mono)" font-size="9" font-weight="700" letter-spacing="1">INTERNAL IT / 03</text>
    <path d="M65 80h93v34H65z" fill="var(--wood)"/><path d="M98 89h28" stroke="var(--paper)" stroke-width="3"/>
  </svg>`;
}

export function deskSVG() {
  return `<svg class="desk-art" aria-hidden="true" viewBox="0 0 900 180" preserveAspectRatio="none" fill="none" stroke="var(--machine-edge)" stroke-width="3" stroke-linejoin="round" stroke-linecap="round">
    <path d="M72 24h756l64 88H8z" fill="var(--wood-light)"/><path d="M8 112h884v17H8z" fill="var(--machine-side)"/><path d="M49 130h16v50H49zm786 0h16v50h-16z" fill="var(--machine-side)"/><path d="M16 116h868" stroke="var(--paper)" opacity=".4"/>
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
    <path d="M80 384h480" stroke="var(--mat-line)" stroke-width="2"/>
    ${Array.from({length:25},(_,i)=>`<path d="M${80+i*20} 384v-${i%5===0?8:4}" stroke="var(--mat-line)" stroke-width="1"/>`).join('')}
    <text x="82" y="27" font-family="var(--font-mono)" font-size="9" letter-spacing="1" fill="var(--ink)">IT / DIAGNOSTICS</text>
    <path d="M555 335h28v32h-28z" fill="var(--surface)" stroke="var(--mat-line)" stroke-width="1.5"/>
    <path d="M561 344h16m-16 7h16m-16 7h11" stroke="var(--muted)" stroke-width="1.5"/>
    <path d="M68 336l-5 29" stroke="var(--machine-edge)" stroke-width="4"/><path d="M64 355l4-19" stroke="var(--accent)" stroke-width="7"/>
  </svg>`;
}

export function homeHeroSVG() {
  return `<svg class="home-illustration" aria-hidden="true" viewBox="0 0 700 430" fill="none" stroke="var(--machine-edge)" stroke-width="2.5" stroke-linejoin="round" stroke-linecap="round">
    <ellipse cx="350" cy="397" rx="315" ry="23" fill="var(--art-shadow)" stroke="none"/>
    <path d="M34 105L340 18l323 101v214L357 420 34 314z" fill="var(--wall-base)"/>
    <path d="M34 105L340 18v224L34 335z" fill="var(--wall)"/><path d="M340 18l323 101v214l-323-91z" fill="var(--surface-2)"/>
    <path d="M34 335l306-93 323 91-306 87z" fill="var(--tile)"/>
    <path d="M58 116l254-72v152L58 272z" fill="var(--sky-day)" stroke-width="4"/><path d="M142 92v154m83-179v154" stroke-width="4"/><path d="M63 226l40-12v-42l36-10v41l45-13v-43l38-11v43l85-24v34L63 262z" fill="var(--distant)" stroke="none"/>
    <path d="M57 283l256-77" stroke="var(--wood-light)" stroke-width="8"/>
    <path d="M551 118l91 27v175l-91-26z" fill="var(--wall-base)"/><path d="M557 129l79 23v156l-79-23z" fill="var(--sky-day)" opacity=".35"/><path d="M554 192l85 25m-85-15 85 25m-85-15 85 25" stroke="var(--paper)" stroke-width="4" opacity=".5"/><path d="M625 263v24" stroke-width="4"/>
    <g transform="translate(368 53) skewY(17)"><rect width="99" height="94" rx="5" fill="var(--machine-side)"/><rect x="7" y="7" width="85" height="80" rx="3" fill="var(--display-bg)"/>${[15,37,61].map(y=>`<rect x="12" y="${y}" width="74" height="16" rx="2" fill="var(--surface-2)"/><path d="M18 ${y+6}h55" stroke="var(--display-text)" stroke-width="3" stroke-dasharray="4 3"/>`).join('')}<path d="M20 24q-5 40 40 20V24m-30 0q0 34 41 20V24" stroke="var(--accent)" stroke-width="2"/></g>
    <g transform="translate(477 111) skewY(17)"><rect width="54" height="33" rx="4" fill="var(--surface)"/><text x="27" y="14" text-anchor="middle" fill="var(--ink)" stroke="none" font-family="var(--font-mono)" font-size="8" font-weight="700">INTERNAL</text><text x="27" y="25" text-anchor="middle" fill="var(--accent)" stroke="none" font-family="var(--font-mono)" font-size="9" font-weight="700">IT / 03</text></g>
    <g transform="translate(358 98)"><svg width="153" height="199" viewBox="0 0 200 260">${personSVG('Jules the intern','laptop').replace(/^<svg[^>]*>/,'').replace(/<\/svg>$/,'')}</svg></g>
    <path d="M133 271l277-81 166 83-275 89z" fill="var(--wood-light)"/><path d="M133 271v13l168 83 275-89v-5l-275 89z" fill="var(--machine-side)"/>
    <path d="M148 285v61l12 6v-61m137 75v42l12-3v-45m248-87v53l12-4v-53" fill="var(--machine-side)"/>
    <path d="M290 267l120-36 109 48-125 40z" fill="var(--bench-mat)" stroke="var(--mat-line)"/><path d="M313 271l98-29m-82 37 98-29m-81 37 98-29m-81 37 98-29" stroke="var(--mat-line)" stroke-width="1" opacity=".5"/>
    <path d="M168 188l115-34v97l-115 34z" fill="var(--machine-shell)"/><path d="M175 194l101-30v79l-101 30z" fill="var(--display-bg)" stroke="none"/><path d="M219 270v21l-19 8 48-15-18 2v-19" fill="var(--machine-side)"/><path d="M186 206l77-23m-77 35 56-17m-56 29 69-21m-69 34 39-12" stroke="var(--display-text)" stroke-width="3"/>
    <path d="M210 311l80-24 37 17-82 26z" fill="var(--machine-shell)"/><path d="M225 313l64-19m-54 25 64-19" stroke="var(--machine-edge)" stroke-width="2" stroke-dasharray="4 3"/>
    <g transform="translate(348 335) rotate(-17)"><rect width="77" height="20" rx="3" fill="var(--surface)"/><text x="38" y="13" text-anchor="middle" font-family="var(--font-mono)" font-size="8" fill="var(--ink)" stroke="none">IT WORKBENCH</text></g>
    ${plantSVG(577,251,.52)}
    <path d="M74 302l34-10 32 15-35 11z" fill="var(--surface)"/><path d="M74 302v45l31 16v-45m0 45 35-12v-44" fill="var(--machine-side)"/><path d="M111 333l22-7" stroke="var(--paper)"/>
  </svg>`;
}
