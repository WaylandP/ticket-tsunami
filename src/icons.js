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
