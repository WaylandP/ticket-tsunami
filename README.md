# Ticket Tsunami

[![CI](https://github.com/WaylandP/ticket-tsunami/actions/workflows/ci.yml/badge.svg)](https://github.com/WaylandP/ticket-tsunami/actions/workflows/ci.yml)

A help desk survival game for your browser. It's 9 AM, you're the only one on
the help desk, and the tickets are coming. Read each one, pick the fix that
actually solves it, and keep the queue from flooding until 5 PM — or go down
swinging in overtime.

### ▶ [Play it now](https://ticket-tsunami.vercel.app)

![The queue rising toward the water line, light mode](docs/play-light.png)

| Phone, dark mode | Shift report |
| --- | --- |
| ![Playing on a phone in dark mode](docs/play-dark-phone.png) | ![The shift report on a phone in dark mode](docs/report-dark-phone.png) |

## How to play

- Tickets pile up in the queue. The highlighted one is the most urgent.
- Pick a fix with the buttons or keys **1–5**: Restart it, Reset password,
  Check connection, Install updates, or Not an IT problem.
- The right fix closes the ticket. Faster fixes score more, streaks multiply
  your score, and VIP tickets pay double.
- The wrong fix burns the user's patience. Let a ticket time out or the queue
  overflow and someone gets unhappy. Five unhappy users and your shift is over.
- **↑/↓** change which ticket you're working, **P** or **Esc** pauses.

Works with keyboard, mouse or touch, on phones and desktops, in light and
dark mode.

## Running it locally

No build step, no dependencies. Serve the folder with any static file server:

```bash
python3 -m http.server 8000
```

Then open http://localhost:8000.

## Tests

The game engine (`src/engine.js`) is pure: no DOM, no `Date.now()`, no
`Math.random()`. Time comes in through `tick(game, dt)` and randomness from a
seeded generator, so every game can be replayed and tested in Node:

```bash
node --test
```

CI runs the same tests on every push.

## Project layout

| Path | What it is |
| --- | --- |
| `index.html` | The page: HUD, queue, overlays, fix bar |
| `src/engine.js` | The whole game, minus the screen (pure, seeded, testable) |
| `src/main.js` | Rendering, input and animation; the only file that touches the DOM |
| `src/tickets.js` | Every ticket in the game, each with exactly one right fix |
| `src/icons.js` | Inline SVG icons |
| `src/styles.css` | All styling: layout, themes, animation |
| `test/engine.test.js` | Engine test suite (`node --test`) |

See [ROADMAP.md](ROADMAP.md) for what's built and what's next.

## License

[MIT](LICENSE)
