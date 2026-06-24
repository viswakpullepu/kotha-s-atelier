# Project: Kotha's Atelier Mobile Adjustment & Media Updates (Redesigned)

## Architecture
- **Vanilla JS application** with static assets.
- `index.html`: Entry point, structure, and loading/hero sections.
- `styles.css`: Visual styling, layout, typography, glassmorphism components, and media queries.
- `app.js`: Main application logic, router, and form validation.
- `canvas3d.js`: Three.js rendering viewport, animation loops, and mouse/window event handlers.
- `tests/e2e.spec.js`: Playwright E2E tests.
- `tests/server.js`: Simple Node.js static server for hosting the app during test runs.

## Milestones
| # | Name | Scope | Dependencies | Status |
|---|------|-------|-------------|--------|
| M1 | E2E Test Suite Creation | Design and implement Playwright E2E test cases covering R1-R5 on mobile viewport. Publish `TEST_READY.md`. | None | PLANNED |
| M2 | Implementation of R1-R5 | Hide Sandbox on Mobile (R1), WebGL Mobile Rewrite (R2), Responsive Layout & Typography (R3), Update Logo Brand (R4), Hero Video Swap (R5). | None | PLANNED |
| M3 | E2E Pass & Hardening (Phase 1 & 2) | Pass all E2E tests and perform adversarial coverage checks. | M1, M2 | PLANNED |

## Interface Contracts
- **Header logo**: Top-left element must read exactly "Kotha's Atelier".
- **Sandbox Container**: `#draft` container must be hidden on viewport widths <= 768px.
- **Hero Video Element**: Right-side container must contain a `<video>` element with looping sources, replacing the old `<img>` element.
- **Three.js canvas**: Render container bounds must adjust camera aspect ratio correctly when height > width (portrait).
