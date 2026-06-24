# Kotha's Atelier | Premium Architecture & Interior Design

A highly interactive, animated, and luxurious Single-Page Application (SPA) built for a premium architecture and interior design firm, featuring real-time interactive 3D WebGL elements, a custom scale sandbox modeler, and robust E2E test coverage.

Live Preview: Built to deploy seamlessly to platforms like **Vercel** or **Netlify**.

---

## Key Features

1. **Timeless Design & Brand Language**: Implements a curated Obsidian-Gold theme with harmonized type sizing (Cormorant Garamond + Montserrat), responsive grid viewports, glassmorphic panels, and smooth GSAP page transitions.
2. **Interactive 3D WebGL Background (`canvas3d.js`)**: Leverages **Three.js** to render floating architectural columns, slabs, and a cloud of 1,200 additive-blending particles. The camera, scale, and rotations morph smoothly using GSAP tweens when routing between sections.
3. **Draft My House Sandbox (`#draft`)**: Allows visitors to custom scale a 3D floor plan base (length/width), configure structural pillars (4, 6, 8, or 10 columns) that dynamically space themselves along the plan margins, and toggle modular furniture layouts.
4. **Consultation Inquiry Flow**: A CTA button serializes design sandbox metrics directly into a pre-filled contact form, displaying an attachment badge and packaging the 3D model payload to the admin.
5. **Fail-Safe WebGL Safeguards**: Integrates secure `try...catch` guards for Three.js contexts. If WebGL is disabled or unsupported (such as in headless browsers or legacy devices), the site automatically falls back to clean, responsive static layouts without throwing console errors.
6. **GSAP Offline/CDN Resiliency Mock**: A built-in animation fallback handles offline environments or network CDN timeouts gracefully, ensuring instant routing transitions.
7. **Form Caret Helper**: The custom ring-and-dot cursor fades into a tiny, semi-transparent `.text-mode` state when input fields are focused, preventing visual clutter during typing.

---

## Technology Stack

* **Structure & UI**: HTML5 Semantic Layout, Vanilla CSS3 Custom properties
* **WebGL & Animation Libraries**: Three.js (r128), GreenSock (GSAP 3.12.2) via CDNs
* **E2E Testing Runner**: Playwright
* **Simulated API**: Node.js microserver

---

## Getting Started

### Local Development Preview
To view the site locally with simple hosting:
```bash
# Using Python
python -m http.server 8000
```
Open [http://localhost:8000](http://localhost:8000) in your browser.

### Running the E2E Test Suite
The project contains 49 comprehensive test cases (spanning SPA routing, contact validation, WebGL sliders, CSS viewport scrollbars, and user journeys):
```bash
# Install dependencies
npm install

# Run Playwright tests
npx playwright test
```
The test suite automatically handles background server launch on port `8089` using the isolated server inside [tests/server.js](tests/server.js).

---

## Vercel Deployment

This project is optimized for direct git-push integration on **Vercel**:
1. Connect your GitHub account to Vercel.
2. Click **Add New Project** and select the `kotha-s-atelier` repository.
3. Keep default settings (Framework Preset: **Other**, Build Command: *leave empty*, Output Directory: *leave empty*).
4. Click **Deploy**. Vercel will build and serve the static files instantly.
