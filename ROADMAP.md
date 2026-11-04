# Roadmap

A box gets checked only when the work is built, tested and visible in the game.

## Shipped

- [x] Pure game engine: seeded randomness, `tick(game, dt)`, replayable, tested in Node
- [x] Core loop: tickets spawn, age and expire; five fixes; score, streaks and multiplier
- [x] Difficulty curve: arrivals speed up and patience thins from 9 AM to 5 PM, then overtime
- [x] Events: outages (bursts of matching tickets), VIP tickets from the CEO, self-fixed tickets
- [x] Screens: start, pause, and shift report with rank, stats and copy-to-share
- [x] Personal best saved in the browser
- [x] Responsive layout (390px phones to desktop), light and dark mode, reduced-motion support
- [x] Keyboard (1–5, arrows, P/Esc) and touch/mouse play
- [x] Engine test suite running in CI on every push
- [x] Static deploy on Vercel
- [x] Three difficulties — Casual Friday, Nine to Five, Monday — harder days pay more, each with its own best score
- [x] Daily Shift: one seeded shift per day, the same for everyone, one try, shareable result
- [x] Sound effects, synthesized in the browser (no audio files), with a mute button
- [x] Special tickets: junk mail (bonus to flag, free to ignore), reopened tickets, fire drills (8s double points)
- [x] Power-ups: every 10-ticket streak earns a charge for Coffee, Wiki or Auto-reply
- [x] Eleven achievements, earned on the shift report and saved in the browser
- [x] A 90-second guided training shift with a coach and no way to fail
- [x] Shift insights: up to three plain-English observations on the report
- [x] Employee file: lifetime stats and recent daily results
- [x] Regulars with habits: Gary (passwords), Frank (connection), Jules (self-fixes)
- [x] The Monday boss: a three-step projector ticket that pays big
- [x] Night Shift: start at 5 PM at full heat and survive
- [x] Lofi radio, synthesized in the browser: Off / Auto / Slow / Medium / Fast, auto-matched to the day

- [x] Walk-in repairs: users carry the machine to your desk; two fixes in order, extra pay
- [x] Art pass: illustrated animated devices (laptop, printer, phone, monitor) and generated avatars for every sender

- [x] The counter: full-body characters walk up holding their machines, complaint in a speech bubble, and walk off when treated
- [x] Online tickets switch: emails + walk-ins, or walk-ins only (and they hurry)
- [x] The supply closet: shifts earn IT budget (score ÷ 10), spent on permanent upgrades — coffee pot, Jules part-time, indexed wiki, ergonomic chair (never applies to the Daily)
- [x] Big three-step machines: the beeping server rack and the haunted conference TV
- [x] Office scenery on the floor, slowly drowned by the rising inbox

## Shipped — the Internal IT redesign

- [x] Full visual identity: an illustrated corporate IT office, drawn coworkers, desk and service-desk monitor (replaces the water overlay with a direct queue meter)
- [x] Hands-on device inspection: a workbench dialog with front/rear views, numbered components and evidence-based findings for every repair stage
- [x] Practice mode: untimed sessions with manual case progression, separate from timed records
- [x] Question difficulty presentation: Easy / Medium / Hard / Extreme over the same engine presets
- [x] Cyber lab: six untimed defensive investigations (phishing, MFA fatigue, USB, ransomware containment, oversharing, verified updates) with browser-local progress
- [x] README rebuilt with real gameplay screenshots and case-accuracy notes

## Next

- [ ] Even more ticket variety
- [ ] Installable as an app (PWA) and playable offline
- [ ] Progress export/import code — move your stats between devices, still no server
- [ ] Accounts and cloud sync — needs a real backend, which breaks the static-only rule; a deliberate decision for later
