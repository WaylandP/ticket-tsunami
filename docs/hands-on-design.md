# Hands-on Device Care: design research and implementation notes

## Direction

Make the device the main object of attention. The visitor's complaint stays beside
a close-up workbench; the player examines components, reads findings, chooses an
action, and sees the device state change. The office, queue, and time pressure
remain part of the same game.

This is an original illustrated implementation. No reference product's art,
characters, copy, or interface code is reused.

## Research and decisions

| Evidence | Application in Ticket Tsunami |
| --- | --- |
| [Full Code's individual experience](https://fullcodemedical.com/individuals/) combines conversations, investigation, practice, and case debriefs. | Keep the complaint visible during examination. Treat the device as the subject of the encounter. This is an interaction-design analogy, not a claim that the two simulations have equivalent training outcomes. |
| [Full Code's FAQ](https://fullcodemedical.com/faq/) describes contextual assistance and replaying cases after reviewing feedback. | Move repair hints behind an explicit help control in the workbench. Preserve explanatory feedback after correct and incorrect actions. |
| [NN/G: Direct Manipulation](https://www.nngroup.com/articles/direct-manipulation/) emphasizes visible objects, physical actions, and immediate feedback, while noting precision and repetitive-action costs. | Offer front and connection views with component hotspots. Keep equivalent labeled component buttons and keyboard repair shortcuts. Update the actual device display after each repair stage. |
| [NN/G: Recognition and Recall](https://www.nngroup.com/articles/recognition-and-recall/) favors visible context and contextual cues over memorized instructions. | Put the caller's statement, current stage, device, findings, and action together. Number hotspots consistently with the component list. |
| [NN/G: Progressive Disclosure](https://www.nngroup.com/articles/progressive-disclosure/) separates primary choices from secondary settings. | Lead the home screen with an original bench illustration, difficulty, and Start playing. Put sound and inbox preferences in a labeled settings panel. |
| [NN/G: Visibility of System Status](https://www.nngroup.com/articles/visibility-system-status/) explains the need for timely feedback and persistent status. | Mirror time, patience, and email backlog in the workbench. Explicitly state that the shift continues. Show success, wrong-action, and visitor-departure feedback. |
| [W3C: Dragging Movements](https://www.w3.org/WAI/WCAG22/Understanding/dragging-movements/) requires an alternative to dragging where it is not essential. | Use tap/click interactions and native buttons rather than mandatory dragging. All new controls target at least 44px. Native dialog behavior supplies keyboard focus containment. |

These sources inform the interaction design; successful usability still requires
testing the implemented screen with real users and the required browser matrix.

## Shipped in this branch

- Redesigned reception home: original SVG workbench diorama, strong title,
  four difficulty choices, Start playing, training, and secondary mode/settings disclosure.
- Six close-up devices: laptop, printer, phone, monitor, server, room display.
- Front and connection views, numbered hotspots, equivalent component controls.
- 31 observation records covering every stage of all 13 current repair cases.
- The relevant screen state changes as the existing engine advances the repair.
- Access and identity observations support current credential-related cases.
- Easy and Medium offer on-demand workbench hints; Hard and Extreme require diagnosis. Visible walk-in prompts open examination.
- Correct, incorrect, completed, and expired-device paths have explicit feedback.

This branch does not add new malware cases, an AI conversation backend, new scoring,
or new timer rules. A deeper cybersecurity simulation would need separate case
definitions and engine work. This implementation keeps the existing engine intact.

## Code boundaries and selector contract

No existing selector was renamed or removed.

| Binding | Integration |
| --- | --- |
| .ticket-btn | Selection and aria-current remain; a repair click also opens the workbench. |
| .bubble / .figure | Visitor speech, artwork, and repair-hop behavior remain. |
| .ticket-hint / dataset.fix | Current fix is still tracked. Known repairs display an Examine prompt; the workbench exposes an optional hint. |
| .patience-fill | Existing --left transform remains unchanged. |
| .chip-step | Existing repair-stage updates remain. |
| .ticket-text / .ticket-from | Existing ticket content remains; complaint and sender are also shown in the workbench. |
| cards Map | Existing ticket-ID identity, insertion, and removal remain. Removal also ends any matching examination. |

src/inspection.js is read-only. It maps existing catalog entries and stages to
observations and existing fix IDs. Unknown future cases receive no fabricated
diagnosis and continue through the normal UI.

The workbench routes actions through existing useFix/applyFix. The engine remains
the authority for scoring, wrong repairs, timing, progression, and expiration.
It does not pause implicitly. A visible Pause button uses the existing pause flow.

## Four difficulty levels and the new home

The home leads with one choice and one primary action: choose difficulty, then
Start playing. How to play is secondary. Daily and Endless are behind More modes;
Stats, Upgrades, and Settings stay available. The original inline SVG bench now
includes a case callout, plant, handheld device, drawer, and circuit accents.
The palette is cool blue and ink in light mode, navy and luminous blue in dark.

| Level | Existing engine preset | Diagnostic challenge |
| --- | --- | --- |
| Easy | friday | A component is outlined; plain-language evidence and suggested component actions. |
| Medium | nineToFive | Find the component yourself; plain-language evidence and optional workbench hints. |
| Hard | monday | No diagnostic highlighting or workbench hints; choose among four repairs. |
| Extreme | monday | Raw component telemetry, no diagnostic highlighting or workbench hints; choose among all five repairs. |

Extreme uses Hard's existing queue pressure. It raises the diagnostic challenge,
not engine timing or scoring. All existing cases and repair sequences remain.
Engine-triggered email hints, purchased upgrades, powers, and penalties retain
existing behavior. Daily fixes the profile to Medium for fairness; training uses
Easy. Legacy saved preferences and best scores are retained, while Extreme's
personal best is stored separately. No engine state is mutated by challenge code.

No existing ticket selector was renamed. New `.exam-actions` holds explicit
repair choices; `.exam-top` groups the title, close button, clock, patience, inbox
count, and pause control so they remain reachable while scrolling on phones.
Hotspots sit beside evidence rather than covering diagnostic text or loose plugs.

## Verification

- `node --test`: 51 passing tests, including all 44 original engine tests,
  four inspection tests, and three challenge/migration/evidence regression tests.
- `src/engine.js` unchanged; Git blob `7070e1a407e1c739e1b34fd5cb1664515c7860a6`.
- Static serving with `python3 -m http.server`; actual Chromium interactions
  using the available Playwright runtime. No package installs or build step.
- Full shifts: Easy/light/1280×800, Medium/light/390×844,
  Hard/dark/1280×800, Extreme/dark/390×844. Each met a walk-in, advanced
  multi-step repairs, intentionally let a visitor expire, repaired later devices,
  reached sunset/night, and finished on the shift report. All six device types
  appeared across these runs. Hard also exercised an incorrect repair.
- No console errors in those four full playthroughs.
- Home: zero scroll at 1280×800, 390×844, 375×812 in both themes,
  all four selected levels, with and without stored personal bests. Settings
  and More modes panels stay within the viewport and dismiss with Escape.
- Rendered home and inspection text contrast checked at ≥4.5:1; visible new
  controls checked at ≥44px. Real screenshots captured and visually inspected.
- Both-theme phone checks: expiration inside the dialog, disabled stale actions,
  keyboard repair guard, native focus containment/return, pause/resume, persistent
  close controls, reduced motion, fixed Daily profile, and completed training.
- All 31 existing repair stages have immutable evidence mappings. Every stage
  supplies distinct raw telemetry in Extreme. SVGs contain no IDs, defs, external
  images, undefined values, or invalid numeric placeholders.

These are functional and visual browser checks, not a claim of user-study results.
README screenshots are unchanged.
