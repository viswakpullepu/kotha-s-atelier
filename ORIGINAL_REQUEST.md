# Original User Request

## Initial Request — 2026-06-23T17:33:36Z

Auditing, diagnosing, and optimizing the premium architecture website for Kotha's Atelier. The team will profile the files for frame rate drops, rendering overlaps, script exceptions, and directly implement codebase fixes to ensure maximum responsiveness and clean interactions.

Working directory: C:\Users\gampa pranith\.gemini\antigravity\scratch\kothas-atelier
Integrity mode: development

## Requirements

### R1. Codebase Diagnostics & Bug Fixes
Review all static files (index.html, styles.css, app.js, canvas3d.js) for syntax bugs, console exceptions, redundant handlers, and structural integrity. Directly apply fixes to resolve logical regressions.

### R2. WebGL Performance Optimization
Identify and optimize frame rate bottlenecks inside Three.js loops (e.g. geometry calculations inside the rendering loop, excessive garbage collections, or memory leaks). Ensure textures and attributes update efficiently.

### R3. Responsive CSS & Interface Refinement
Diagnose and correct any visual glitches, alignment overlaps, or margins overflow issues across mobile, tablet, and desktop viewports, focusing on range sliders and attachment badges.

## Acceptance Criteria

### Diagnostics & Code Health
- [ ] No active JavaScript errors, warnings, or console exceptions on initial route sweeps.
- [ ] All JS routing configurations (#home, #about, #portfolio, #draft, #contact) execute without lag or blank overlays.
- [ ] Contact form validates data correctly and behaves as intended with attachment payloads.

### WebGL & Render Performance
- [ ] Three.js viewport renders the 3D model with smooth frame intervals during canvas mouse-sway.
- [ ] Slider dimension updates trigger immediate, non-lagging floor scale adjustments and column relocations.

### CSS & Layout Integrity
- [ ] Main site sections fit the viewport horizontally without producing horizontal scrollbars at 1920px (Desktop), 768px (Tablet), and 375px (Mobile) resolutions.
- [ ] Glassmorphism navbars and attachment badges display clean, visible layouts on dark obsidian panels.

## Follow-up — 2026-06-24T07:41:29Z

# Teamwork Project Prompt — Draft

> Status: Launched
> Goal: Craft prompt → get user approval → delegate to teamwork_preview

Adjust the Kotha's Atelier Vanilla JS website to ensure perfect layout, typography scaling, and WebGL responsiveness on mobile devices, alongside brand specific media updates.

Working directory: `C:/Users/gampa pranith/.gemini/antigravity/scratch/kothas-atelier`
Integrity mode: benchmark

## Requirements

### R1. Hide Sandbox on Mobile
Hide the "Draft My House Sandbox" section entirely when the website is viewed on mobile devices (e.g., max-width: 768px).

### R2. WebGL Mobile Rewrite
Rewrite or adjust the Three.js WebGL background logic (`canvas3d.js`) to ensure it scales, centers, and renders appropriately for portrait orientations on phones, avoiding extreme stretching or poor performance.

### R3. Responsive Typography & Layouts
Update the CSS (`styles.css`) to ensure no elements overflow horizontally on small screens (down to 375px wide). Scale down large display typography for mobile readability.

### R4. Update Logo Brand
Change the top-left logo text in the header/navbar to read exactly "Kotha's Atelier".

### R5. Hero Image to Video Swap
On the initial loading page/hero section, locate the static image positioned on the right and replace it with a `<video>` element using the video assets from previous iterations (e.g., looping `background.mp4` or `mobile-background.mp4`).

## Acceptance Criteria

### Programmatic Verification
- [ ] A new or updated Playwright test is added that launches a mobile viewport (e.g., iPhone emulation) and programmatically asserts that the `#draft` sandbox container is `isHidden()` or `display: none`.
- [ ] A programmatic check or simple assertion verifies the top-left logo text contains "Kotha's Atelier".
- [ ] A programmatic check asserts the presence of a `<video>` tag within the hero/loading section instead of an `<img>`.

### Agent-as-Judge Verification
- [ ] The Three.js camera frustum or renderer bounds in `canvas3d.js` explicitly account for portrait aspect ratios (height > width).
- [ ] The CSS contains `@media (max-width: 768px)` queries that eliminate horizontal scrollbars and scale down main headings.

---
*Next: Delegation in progress...*
