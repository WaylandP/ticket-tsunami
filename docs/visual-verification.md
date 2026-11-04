# Repair studio verification

For the latest device-art and Cyber lab update (63 passing tests), see
[security training verification](security-training.md). The report below records
the earlier repair-studio release and its broader timed/practice checks.

Verified 2026-11-04 using the static app, served with
`python3 -m http.server 8000`, and Chromium through the preinstalled Playwright
runtime. No packages were installed. Browser time was advanced with Playwright's
clock; tickets, device hotspots, repairs, and mode controls were operated through
the UI. The original Google Fonts were cached for the browser checks.

## Automated checks

- `node --test`: **56 passed, 0 failed**. This includes all **44 original engine
  tests**, four inspection tests, three challenge tests, and five practice tests.
- `git diff --check`: passed.
- Engine Git blob remains `7070e1a407e1c739e1b34fd5cb1664515c7860a6`.
- Existing light/dark values for bg, surface, surface-2, ink, muted, line,
  accent, danger, warn, good, vip, water-1, water-2, and dot are unchanged.
- Repair evidence matches every authored fix in all 31 stages. Repeatable art
  remains deterministic and contains no SVG IDs, defs, external images,
  undefined values, or invalid numeric placeholders.

## Timed playthroughs

| Theme | Viewport | Diagnosis | Result |
| --- | --- | --- | --- |
| Light | 1280×800 | Easy | Passed |
| Light | 390×844 | Medium | Passed |
| Dark | 1280×800 | Hard | Passed |
| Dark | 390×844 | Extreme | Passed |

Each run met a walk-in at approximately 12 seconds, advanced a multi-step repair,
deliberately let a visitor expire, completed later repairs, reached sunset/night,
and ended on the shift report. All six device types appeared. Hard also exercised
an incorrect repair. All four runs had zero console errors.

## Untimed playthroughs

Both themes at 1280×800 and 390×844 passed:

- Practice is reachable directly from home and explicitly says No time limit.
- After 45 seconds of frame-by-frame time and ten additional minutes, the same
  bounded work remains with no expiration or automatic arrivals.
- A wrong answer changes neither patience nor happiness and permits another try.
- Multi-step repair completion retains explanatory feedback.
- Next case stays disabled until all current work is complete, then admits new
  work only when clicked.
- Pause/resume, Finish, and Play again retain the correct session behavior.
- Practice writes no timed personal best, career statistics, or upgrade budget.
- Zero console errors.

Additional light/dark phone runs inspected all six devices, using actual hotspots
and rear views, and completed 22 repair stages per theme. Screen hotspots did not
cover diagnostic text. Two simultaneous timed visitors remained readable with
an accessible inbox. The water element was hidden in both modes.

## Home and accessibility

The home had zero vertical or horizontal scroll at **1280×800, 390×844, and
375×812**, in both themes, at all four selected difficulty levels, with either
play style selected, and with/without a saved best score.

Music, Email tickets, Question difficulty, and both play styles were visible.
All home controls measured at least 44px. Rendered home, office, and examination
text passed the 4.5:1 contrast check against its background, excluding decorative
SVG artwork and disabled controls. Reduced-motion playthroughs exercised the
global motion override.

Real screenshots were captured and visually inspected. README images now show
the current home, repair studio, phone practice, and timed report. Image files
are documentation only; game artwork remains inline SVG/CSS.

## Integration contract

No existing selector was renamed or removed:

| Binding | Preserved behavior |
| --- | --- |
| .ticket-btn | Selection and per-frame aria-current |
| .bubble / .figure | Speech, visitor artwork, mood, and repair animation |
| .ticket-hint / dataset.fix | Current next action and inspection prompt |
| .patience-fill | scaleX(var(--left)); hidden in untimed Practice |
| .chip-step | Repair stage updates |
| .ticket-text / .ticket-from | Ticket and sender; boss display text now reflects its current evidence |
| cards Map | Ticket-ID identity, creation, completion, and expiration |

The room clock and daylight still read the existing game time. The new practice
controller is separate from the unchanged timed engine. These are functional and
visual browser checks, not a claim of usability-study or training-outcome results.
