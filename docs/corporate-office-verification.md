# Corporate IT office verification

Verified 2026-11-04. Visual presentation changes only; no gameplay or case changes.

## Automated checks

- `node --test`: 56/56, including all 44 original engine tests.
- `node --check` and `git diff --check`: passed.
- Engine blob unchanged: `7070e1a407e1c739e1b34fd5cb1664515c7860a6`.
- Every CSS custom-property declaration matches the pre-change stylesheet.
- The primary ink, muted and accent text/background pairs pass 4.5:1 in both themes.
- 198 SVG outputs parsed as XML, with name determinism and no IDs, defs,
  external images, undefined values or NaN. All six held devices were reviewed.

## Browser verification

The static source was served through the managed preview. A temporary, untracked
QA page framed the game at exact viewport dimensions. Theme copies activated the
existing light or dark media blocks without changing their values. A preview-only
clock adapter advanced animation-frame time for timed playthroughs; all ticket
and repair actions used browser UI controls. QA helpers are not shipped.

| Theme | Viewport | Checks |
| --- | --- | --- |
| Light | 1280 x 800 | Home fits, timed multi-step repair, expirations, shift report |
| Dark | 1280 x 800 | Home fits, three-stage server repair, two visitors, impatience, expirations, report |
| Light | 390 x 844 | Home fits, three-stage room-display repair, wrong-action feedback, two visitors, report |
| Dark | 390 x 844 | Home fits, timed repair, pause/resume, expirations, report; untimed phone repair, email, Next case, Finish |
| Both | 375 x 812 | Home fits with all primary settings visible |

- No horizontal/vertical home scrolling at all six combinations.
- Visible home and sampled play controls meet the 44px minimum.
- No duplicate DOM IDs; no application console errors. Browser-extension logs
  were excluded from the application-error check.
- Two simultaneous phone visitors remain readable and leave room for the inbox.
- Reduced-motion global override remains last in the stylesheet.
- Screenshots in README are actual browser captures, not the generated concept.
- These tests end timed games through normal expirations; they do not claim a new
  survival-to-overtime run. Existing engine tests cover clock and overtime logic.

## DOM contract

No existing renderer selector was renamed or removed. `.ticket-btn`, `.bubble`,
`.figure`, `.ticket-hint` and `dataset.fix`, `.patience-fill`, `.chip-step`,
`.ticket-text`, `.ticket-from`, and the ticket-ID `cards` Map retain their bindings.
The decorative `.counter` children were replaced by inline art mounted at the new
`#repair-bench-art`; `main.js` imports `repairBenchSVG` and initializes that element.
Other `main.js` changes only update visible/accessibility wording.
