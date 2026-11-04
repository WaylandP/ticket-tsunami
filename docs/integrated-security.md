# Security at the IT desk

Verified 2026-11-04. Security now arrives as visible work during the shift instead
of a separate Home/Pause training activity.

## Experience

The workstation starts with a Security desk report above its email inbox. A
reporter, incident title, topic, open count and investigation action are visible
without opening a menu. Later arrivals also show a toast and a polite announcement.
The desk header opens the current shift's incident queue, including resolved work.

Every normal shift starts with phishing. Timed, Daily and Endless shifts receive
the next report after 60 seconds of elapsed game time, with at most two pending
and six total. Practice introduces one per round for its first six rounds. Next
case becomes available after the current repairs, emails and security report are
resolved. Later practice rounds continue with existing device/email cases.

Evidence, response attempts and feedback stay attached to each incident when
players return to repairs or inspect another report. A new shift starts fresh.
The existing browser-local first-completion record remains compatible.

The investigation shows the live shift clock. Timed play continues until the
player explicitly pauses; the dialog provides that control. Opening incidents
from an already paused shift preserves the pause. Escape returns focus to the
opener. Ending a shift closes the dialog and includes resolved, open-at-handoff
and safe-first-decision counts in the report.

The existing ticket engine, repair sequences, score, patience and happiness are
unchanged. The guided repair tutorial does not spawn security incidents. Security
is coordinated in `src/security-shift.js` and `src/security-ui.js`; it does not
write to engine state. All security scenarios remain fictional and inert.

## Verification

- `node --test`: 69 passed. Added lifecycle tests cover immediate arrival,
  tutorial exclusion, elapsed-time boundaries, a two-incident pending limit,
  manual practice progression, saved evidence, retries, per-shift reset,
  nonmutation, overtime start offsets and exactly six distinct incidents.
- Browser-tested phishing evidence, an unsafe response, closing and resuming,
  then successful resolution. Completed a phone repair, advanced the practice
  round, resolved MFA, and verified the report: two resolved, one safe first decision.
- Controlled-time preview: advanced 69 seconds with an investigation open;
  the clock reached 12:26 PM and a second incident arrived. Paused from the
  investigation, advanced another 45 seconds, and verified the clock stayed put.
  P did not resume the background shift; Escape returned focus to Pause.
- Resumed timed play, let the shift end with the dialog open, and verified the
  dialog closed and the report recorded two open incidents at handoff.
- Home fits 1280×800, 390×844 and 375×812 in both themes, without home scrolling,
  duplicate document IDs, or buttons smaller than 44px. Office and investigations
  checked at phone sizes in light and dark. The office scrolls where needed;
  Practice controls stay pinned above the repair bar.
- Existing themed color tokens are used for all additions. The global reduced
  motion override remains last. No new images, fonts, packages or build steps.
- No app console errors or warnings during browser checks. `git diff --check`
  passed. `src/engine.js` retains blob `7070e1a407e1c739e1b34fd5cb1664515c7860a6`.

Preview-only forced themes and controlled clock are excluded from the commit.
README JPGs are real browser screenshots and are not runtime assets.

## Selector contract

No existing gameplay selector was renamed or removed:

| Selector / binding | Matching `main.js` behavior |
| --- | --- |
| `.ticket-btn` | Ticket selection, disabled state and aria-current unchanged. |
| `.bubble` | Speech markup unchanged. |
| `.figure` | Device-bearing character rendering unchanged. |
| `.ticket-hint` / `dataset.fix` | Hint visibility and current-fix binding unchanged. |
| `.patience-fill` | Age and patience rendering unchanged. |
| `.chip-step` | Repair stage counter unchanged. |
| `.ticket-text` | Complaint updates unchanged. |
| `.ticket-from` | Coworker labels unchanged. |
| `cards` Map | Ticket-ID lifecycle unchanged. |

New bindings: `#security-feed` holds incident cards; `#security-inbox` opens the
queue; `#security-shift-status` and `#security-pause` expose timing and pause;
`#r-security` holds the shift summary; `#practice-guidance` explains remaining
round work. `main.js` starts, syncs, resets and closes the security controller,
announces new reports and resolutions, and fills the existing shift report.
Its keyboard handler yields to the native incident dialog.
