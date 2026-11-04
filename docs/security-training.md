# Device graphics and security training

The original graphics/training release was verified 2026-11-04. Its standalone
Cyber lab has since been replaced by [integrated shift incidents](integrated-security.md).
The content references below still apply.

This original update replaces generic inspection panels with device-specific
art and adds six standalone defensive training cases. All runtime artwork is inline
SVG in `src/icons.js`, with themed styling in `src/styles.css`. The JPGs in this
directory are documentation screenshots; the game loads no image assets.

## Physical inspection

- Laptop: opaque rear lid, two hinges, a thin base receding behind the lid,
  side USB-C and display ports, asset label, and seated/disconnected charger.
  The front has a perspective keyboard, trackpad, camera and thin bezel.
- Phone: rear cameras, charging port and speaker apertures.
- Printer: paper feed, service door, ventilation, USB-B and power sockets.
- Monitor and room display: mounting plate, signal inputs, and distinct stands.
- Server: rear fan, I/O panel, expansion slots and power supply. Network-lead
  and power-lead cases show the appropriate connection.
- Powered-off cases show an unlit screen and indicator. Progress bars appear
  only for updates. Ready and locked states use their own status marks.
- The inspection model adds read-only `physical` metadata. The existing catalog,
  required repairs, scoring, patience and timed engine are unchanged.

## Original Cyber lab behavior (superseded)

Home and Pause open the same native modal. Each case includes an illustrated
artifact, three evidence cards and three response choices. Inspecting at least
one evidence card unlocks the responses. An unsafe response explains the issue
and permits another attempt. A correct response closes the case and explains
the next safe action. The debrief counts completed cases and safe first decisions.
Replaying a case does not inflate progress or rewrite its first completion.

Progress uses `ticket-tsunami:security:v1` in local storage. Invalid saved records
are sanitized; unavailable storage does not block play. The lab makes no network
requests, opens no scenario links, and does not accept real credentials or files.
Opening it from Pause leaves the shift paused, including after Escape closes it.

## Content references

These are scenario authoring references, not endorsements or a certification.
The game uses fictional office policies and asks players to follow their real
organization's incident response process.

| Case | Learning objective | Primary references |
| --- | --- | --- |
| Phishing | Inspect sender, destination and request; report through a known channel without opening the link. | [NIST phishing guidance](https://www.nist.gov/itl/smallbusinesscyber/guidance-topic/phishing) |
| MFA fatigue | Reject unsolicited approvals and notify security; do not disable MFA. | [MITRE ATT&CK T1621](https://attack.mitre.org/techniques/T1621/), [CISA phishing-resistant MFA](https://www.cisa.gov/sites/default/files/2023-01/fact-sheet-implementing-phishing-resistant-mfa-508c.pdf) |
| Found USB | Keep unknown media disconnected and use the authorized handoff process. | [CISA portable-device risks](https://www.cisa.gov/sites/default/files/publications/RisksOfPortableDevices.pdf) |
| Active encryption | Use the available, authorized network-isolation control, preserve evidence and escalate. The scenario explicitly permits isolation while keeping power on. | [CISA StopRansomware guide](https://www.cisa.gov/stopransomware/ransomware-guide) |
| Accidental sharing | Restrict unauthorized access, preserve activity and report; avoid assumptions about scope. | [FTC data breach response](https://www.ftc.gov/business-guidance/resources/data-breach-response-guide-business) |
| Security update | Verify the source and approval, use the managed package, and confirm the result. | [CISA software updates](https://www.cisa.gov/sites/default/files/2024-09/Secure-Our-World-Software-Updates-Tip-Sheet.pdf) |

## Verification for the original graphics/training release

- `node --test`: **63 passed, 0 failed**. New coverage checks evidence gating,
  retries, completion, first-decision credit, persistence sanitization and
  unpowered device artwork. Existing engine tests continue to pass.
- `git diff --check` passed. Engine blob remains
  `7070e1a407e1c739e1b34fd5cb1664515c7860a6`.
- 76 generated SVGs parsed as XML: all 31 repair stages, both views, plus security
  illustrations/icons. No IDs, defs, external images or fragment references.
- Browser-operated all six Cyber lab cases through the debrief, including a
  wrong phishing response followed by a successful retry. Reload preserved six
  completed cases and five safe first decisions.
- From a timed Pause, P did not resume the shift, an additional 45 seconds of
  controlled preview time left the clock unchanged, and Escape returned focus
  to the Pause menu's Cyber lab button.
- Home audited at 1280×800, 390×844 and 375×812 in both themes: no home scrolling,
  duplicate document IDs or controls below 44px.
- Cyber lab checked on desktop dark, phone dark and phone light. Case/debrief
  navigation and feedback focus worked; dialog width did not overflow and all
  measured buttons were at least 44px.
- Laptop rear hotspot and two-step repair exercised on desktop dark and 390px
  light. The carried device changed from unpowered to powered after reconnecting.
- All six device fronts and rears visually reviewed. New text token pairs have
  minimum contrast 5.37:1 in light and 5.42:1 in dark, including disabled response
  text. The existing global reduced-motion override remains last in the stylesheet.
- No app console errors or warnings in the browser review.

The preview used copies of the static source, forced theme styles and an isolated
clock adapter for timed checks. A seed-0 fixture was used for repeatable laptop
screenshots. None of those preview adapters are shipped.

## Selector contract and matching main.js changes

No existing selector was renamed or removed.

| Existing selector | Matching `main.js` handling |
| --- | --- |
| `.ticket-btn` | Selection, disabled completion state and per-frame aria-current preserved. |
| `.bubble` | Existing speech markup and layout preserved. |
| `.figure` | Still contains `personSVG`; creation now passes the read-only inspection model. |
| `.ticket-hint` / `dataset.fix` | Existing hint visibility and current-fix binding preserved. |
| `.patience-fill` | Existing age/patience rendering preserved. |
| `.chip-step` | Existing stage counter preserved. |
| `.ticket-text` | Existing displayed complaint updates preserved. |
| `.ticket-from` | Existing coworker label preserved. |
| `cards` Map | Existing ticket-ID identity and lifecycle preserved. |

`render()` now toggles `.person.device-unpowered` only when a repair stage changes.
`renderExamDevice()` uses the new per-device rear label, caption and hotspot data,
and fills `#exam-view-label` and `#exam-physical-state`. `finishInspection()` resets
the completed art and view toggle consistently. `renderInspection()` fixes singular
email grammar. The global keyboard handler yields to the Cyber lab modal before
shift shortcuts; `security-ui.js` owns its focus and Escape handling.
