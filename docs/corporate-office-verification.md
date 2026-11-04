# Corporate IT office verification

Verified 2026-11-04 after the coworker anatomy rebuild. Presentation only.

## What changed

The old right sleeve used a relative move after the left sleeve and did not
share the arm's shoulder coordinates. Both sides now use one local shoulder,
rolled-cuff and forearm shape, mirrored around the body center. Each of the six
devices has explicit placement and grip coordinates. The old body-width offset
no longer affects shoulder alignment. Hannah's reported laptop pose and all six
held-device silhouettes were visually reviewed in a coworker gallery.

Coworkers sit at a full-width workbench with connected forearms, larger equipment,
visible grips, chair mesh, badges and watches. Cable reels, tools, a device dock,
ceiling fixtures, layered back-office windows and desk detail bring the actual
scene closer to the office concept. The home illustration now reuses the same
room, coworker and bench art. No raster concept is shipped in the game.

## Automated checks

- `node --test`: 56/56 passed, including the original engine tests.
- `node --check` and `git diff --check`: passed.
- Engine blob unchanged: `7070e1a407e1c739e1b34fd5cb1664515c7860a6`.
- All CSS custom-property declarations match the previous release exactly.
  Previously checked primary text pairs retain their contrast of at least 4.5:1.
- 130 SVG outputs: 21 names × six devices plus room, bench, desk and home.
  XML parsing, deterministic output and no IDs, defs, external images,
  undefined values or NaN were checked.
- The global reduced-motion override remains last in the stylesheet.

## Browser checks

A temporary untracked QA page frames the actual source at exact viewport sizes.
Theme copies activate the existing light or dark media blocks without changing
their values. A preview-only clock adapter advances animation-frame time; all
repair actions use the normal game UI. QA helpers are not shipped.

| Theme / viewport | Result |
| --- | --- |
| Both / 1280 × 800 | Home fits without scrolling; controls at least 44px |
| Both / 390 × 844 | Home fits without scrolling; controls at least 44px |
| Both / 375 × 812 | Home fits without scrolling; controls at least 44px |
| Dark / 1280 × 800 | Actual Hannah/laptop pose reviewed at the connected bench |
| Light / 390 × 844 | Two simultaneous coworkers, monitor and room display; no overflow; complete two-stage monitor repair |
| Dark / 375 × 812 | Practice phone repair, email resolution, Next case, pause/resume and Finish report |
| Dark / desktop | Home and game documentation screenshots captured from the actual preview |

No duplicate DOM IDs or application console errors were found. Extension logs
are excluded from the application-error check. This revision does not claim a
new full survival-to-overtime playthrough; existing logic tests remain green.

## DOM contract

No renderer binding changed: `.ticket-btn`, `.bubble`, `.figure`, `.ticket-hint`
and `dataset.fix`, `.patience-fill`, `.chip-step`, `.ticket-text`, `.ticket-from`,
and the ticket-ID `cards` Map are intact. No matching `main.js` edits were needed;
`main.js`, `index.html`, the case catalog and `engine.js` are unchanged.
Only decorative SVG descendants and presentation styles changed.
