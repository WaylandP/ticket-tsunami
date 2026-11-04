# Hands-on Device Care: design notes

## Current direction

An internal corporate IT department on floor 03. Coworkers arrive from a
badge-access corridor; glass partitions reveal shared desks and task chairs.
A network patch cabinet, loaner laptop shelf, city windows and ceiling lights
establish the office. An open technician workbench replaces the retail counter.
The established blue/navy palette remains unchanged in both themes.

Larger name-seeded coworkers have shaped faces, hair, collars, rolled sleeves,
ID badges and watches. Devices have differentiated grips, hinges, ports, bezels
and asset labels. The CEO, Gary, Jules and Frank retain their recognizable looks.
The player's inbox sits in a thin-bezel monitor above an adjustable arm,
keyboard, desk mat and mug. Home, office and inspection copy use Internal IT.

All game art is original inline SVG and CSS, with no images, SVG IDs, paint-server
references, dependencies, or build step. The documentation screenshots are real
browser captures.

## Home: choices in the open

The home screen now exposes **Question difficulty**, **Practice / Timed shift**,
**Music**, and **Email tickets** together. The primary button says which session
will start. Daily challenge, Endless shift, Stats, and Upgrades are visible below.

The previous disclosure panels hid preferences users wanted to discover. They
have been replaced by persistent controls, while preserving the no-scroll home
at 1280×800, 390×844, and 375×812 in both themes.

| Level | Existing timed preset | Diagnostic challenge | Practice case pool |
| --- | --- | --- | --- |
| Easy | friday | Plain findings, highlighted component, suggested repairs | Two simple connection cases |
| Medium | nineToFive | Find the component; optional hints | Eight two-step cases |
| Hard | monday | No workbench hints or highlighted faults; four repair choices | All 13 cases, all six devices |
| Extreme | monday | Technical readings; no workbench hints; five repair choices | All 13 cases, all six devices |

Extreme uses Hard's existing timed pace. Daily fixes diagnosis to Medium, and
training uses Easy. Existing email hints, powers, upgrades, penalties, and saved
best-score migration retain their timed behavior.

## Untimed practice

Practice is the default home choice. It starts one visitor and, if enabled, one
email. There are no automatic arrivals, expiration, score penalties, or deadlines.
The player finishes the current work, chooses Next case, and can finish whenever
they want. Wrong repairs provide feedback without ending the session.

The separate practice controller reuses the existing case catalog and sequences.
It never ticks the timed engine. Completion records practice attempts and closed
cases without writing timed bests, achievements, career statistics, or upgrade
budget. Endless remains a survival mode and is not described as untimed practice.

## Examination and research

The complaint remains beside a large device. Players inspect screen, connection,
power, and access findings, choose a repair, and see the device change. Success
feedback explains why the action matched the evidence. Front and rear views have
numbered hotspots with equivalent labeled buttons.

| Reference | Design application |
| --- | --- |
| [Full Code's individual experience](https://fullcodemedical.com/individuals/) and [FAQ](https://fullcodemedical.com/faq/) | Conversation, investigation, practice, and feedback inform the encounter structure. No art, characters, interface code, or training-outcome claims are reused. |
| [Direct manipulation](https://www.nngroup.com/articles/direct-manipulation/) | Inspect the physical device, then observe an immediate state change. |
| [Recognition and recall](https://www.nngroup.com/articles/recognition-and-recall/) | Keep complaint, stage, findings, and actions together. Make session choices visible on home. |
| [Visibility of system status](https://www.nngroup.com/articles/visibility-system-status/) | Timed sessions explicitly continue during inspection; Practice explicitly has no time limit. |
| [Accessible alternatives to dragging](https://www.w3.org/WAI/WCAG22/Understanding/dragging-movements/) | Use native buttons and click/tap hotspots, not mandatory dragging. Preserve keyboard shortcuts and dialog focus containment. |

These are design inputs, not user-study results. Technical content was separately
reviewed against primary references in the [case audit](case-audit.md).

## Selector contract

No existing ticket selector was renamed or removed.

| Binding | Integration |
| --- | --- |
| .ticket-btn | Selection and per-frame aria-current; repair clicks open examination |
| .bubble / .figure | Complaint, visitor art, mood, and progress animation |
| .ticket-hint / dataset.fix | Current fix remains tracked; walk-ins show an Examine prompt |
| .patience-fill | Existing scaleX(var(--left)); hidden only in Practice |
| .chip-step | Existing stage updates |
| .ticket-text / .ticket-from | Existing content and sender; projector display copy updates per stage |
| cards Map | Existing ticket-ID keys and removal; inspection receives completion/expiration |

Inspection and challenge modules only describe existing cases. Timed actions
still go through useFix/applyFix. Practice actions go through applyPracticeFix.
The engine file is unchanged. See [verification](visual-verification.md).
