# Device Care play-screen overhaul

Original inline SVG room, characters, devices, and workstation. No packages,
image assets, build steps, or external requests were added.

## Integration contract

No existing ticket selector was renamed or removed:

| Selector / binding | Preserved behavior |
| --- | --- |
| `.ticket-btn` | Click selection and per-frame `aria-current` |
| `.bubble` | Walk-in speech and focus/urgency border |
| `.figure` | Walk-in artwork and repair-progress hop |
| `.ticket-hint`, `dataset.fix` | Visibility and current repair-step hint |
| `.patience-fill` | `scaleX(var(--left))` |
| `.chip-step` | Current stage and total |
| `.ticket-text`, `.ticket-from` | Ticket content and sender |
| `cards` Map | Ticket ID keys, insertion, and removal |

`#queue` and `#empty` now sit inside `.workstation .inbox-screen`.
`#empty` follows the email count; walk-in-only mode describes reception upstairs.
`#bench-wrap` remains visible when empty, keeping the counter in the room.
The old scenery SVGs are replaced by `#room-art` and `#desk-art` mounts.
`main.js` imports their generators and the power-button icons.

The UI derives `data-mood` from ticket patience and `data-daylight` and clock-hand
angles from game time. These are display-only values. The removal fallback now
allows the complete exit animation. Engine rules and existing tests are unchanged.

## Verification

- `node --test`: **44 passed, 0 failed**.
- `git diff --check`: passed.
- Engine blob unchanged: `7070e1a407e1c739e1b34fd5cb1664515c7860a6`.
- Static server: `python3 -m http.server 8000`.
- Chromium via the existing Playwright runtime; no installations or app
  instrumentation. Browser time advanced with Playwright's clock; tickets and
  fixes were selected through UI buttons.
- The existing Google Fonts CSS and original font files were cached for browser
  checks through the environment's working HTTP proxy. App font links are unchanged.

| Full playthrough | Light | Dark |
| --- | --- | --- |
| 1280 × 800 | Passed | Passed |
| 390 × 844 | Passed | Passed |

Each run started Casual Friday, met a walk-in after 12 seconds, advanced its
multi-step repair, let it expire while resolving emails, completed later repairs,
reached overtime and night, and finished with the report. All four patience poses
were observed. All four runs had zero console errors and uncaught exceptions.

Additional checks passed for two simultaneous visitors, reduced motion, 44px
start-screen touch targets, and zero start-screen scroll at 1280 × 800,
390 × 844, and 375 × 812 in both themes, with and without a personal-best line.
Rendered start-screen and two-visitor text passed a 4.5:1 contrast check against
its background, excluding decorative SVG and disabled controls.

Real screenshots of start, play, two visitors, sunset, night, and reports were
captured for visual inspection. Existing README images were left untouched.

Repeatability checks covered all six devices and the CEO, Gary, Jules, Frank,
and a generated visitor: identical input produces identical SVG, art colors use
theme tokens, and SVGs contain no IDs or paint-server references.
