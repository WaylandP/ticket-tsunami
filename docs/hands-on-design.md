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
| [NN/G: Progressive Disclosure](https://www.nngroup.com/articles/progressive-disclosure/) separates primary choices from secondary settings. | Lead the home screen with an original bench illustration, difficulty, and Clock in. Put sound and inbox preferences in a labeled settings panel. |
| [NN/G: Visibility of System Status](https://www.nngroup.com/articles/visibility-system-status/) explains the need for timely feedback and persistent status. | Mirror time, patience, and email backlog in the workbench. Explicitly state that the shift continues. Show success, wrong-action, and visitor-departure feedback. |
| [W3C: Dragging Movements](https://www.w3.org/WAI/WCAG22/Understanding/dragging-movements/) requires an alternative to dragging where it is not essential. | Use tap/click interactions and native buttons rather than mandatory dragging. All new controls target at least 44px. Native dialog behavior supplies keyboard focus containment. |

These sources inform the interaction design; successful usability still requires
testing the implemented screen with real users and the required browser matrix.

## Shipped in this branch

- Redesigned reception home: original SVG workbench diorama, strong title,
  shift choices, Clock in, training, daily/after-hours modes, and settings disclosure.
- Six close-up devices: laptop, printer, phone, monitor, server, room display.
- Front and connection views, numbered hotspots, equivalent component controls.
- 31 observation records covering every stage of all 13 current repair cases.
- The relevant screen state changes as the existing engine advances the repair.
- Access and identity observations support current credential-related cases.
- Repair hints are available on demand; visible walk-in prompts open examination.
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

## Verification status

- Pure-function checks completed: all 31 stages have one matching finding whose
  action agrees with the existing repair stage; inspection does not mutate tickets.
- JavaScript parsing completed for icons.js, inspection.js, and main.js.
- Device SVG checks completed for both views: no IDs, paint-server references,
  undefined values, or invalid numeric placeholders.
- Four regression tests added for CI, alongside the existing 44 engine tests.
- Browser execution environment unavailable during preparation. No new claims of
  browser-tested layout, contrast, pointer behavior, or completed playthroughs.

Release gate: keep this PR a draft until actual browser verification covers light
and dark at 1280×800 and 390×844, no-scroll home at 375×812 as well, all six devices,
front/rear controls, two visitors, keyboard navigation, wrong and correct actions,
expiration during inspection, pause/resume, reduced motion, and final reports.
Capture and inspect real screenshots. Recheck 4.5:1 text contrast and 44px controls.
