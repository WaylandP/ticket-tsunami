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

## Next

- [ ] Sound effects with a mute toggle
- [ ] Daily challenge: everyone plays the same seeded shift
- [ ] More ticket variety and rare special tickets
- [ ] Difficulty settings (calm Friday / normal / Monday)
- [ ] A short tutorial first shift
- [ ] Achievements on the shift report
- [ ] Installable as an app (PWA) and playable offline
