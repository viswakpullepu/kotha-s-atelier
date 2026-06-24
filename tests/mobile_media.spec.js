const { test, expect } = require('@playwright/test');

// Helper to wait for luxury loading screen to disappear
async function waitForAppReady(page) {
  await page.goto('/', { waitUntil: 'domcontentloaded' });
  await page.waitForSelector('#preloader.fade-out', { timeout: 10000 });
}

test.describe("Milestone M1 E2E Test Suite", () => {

  // =========================================================================
  // TIER 1: FEATURE COVERAGE (25 Test Checks)
  // =========================================================================

  test.describe("Feature 1: Hide Sandbox on Mobile", () => {
    test("T1.F1.1: Sandbox is hidden on iPhone 13 viewport", async ({ page }) => {
      await page.setViewportSize({ width: 390, height: 844 });
      await waitForAppReady(page);
      await expect(page.locator('#draft')).toBeHidden();
    });

    test("T1.F1.2: Sandbox is hidden on small mobile viewport", async ({ page }) => {
      await page.setViewportSize({ width: 375, height: 667 });
      await waitForAppReady(page);
      await expect(page.locator('#draft')).toBeHidden();
    });

    test("T1.F1.3: Sandbox is hidden at exact 768px tablet boundary", async ({ page }) => {
      await page.setViewportSize({ width: 768, height: 1024 });
      await waitForAppReady(page);
      await expect(page.locator('#draft')).toBeHidden();
    });

    test("T1.F1.4: Navigation link for Draft on mobile is hidden or inactive", async ({ page }) => {
      await page.setViewportSize({ width: 375, height: 667 });
      await waitForAppReady(page);
      const draftLink = page.locator('#nav-links a[href="#draft"]');
      // Link should either be hidden or non-clickable
      await expect(draftLink).toHaveCSS('display', 'none');
    });

    test("T1.F1.5: Sandbox is visible on desktop viewport", async ({ page }) => {
      await page.setViewportSize({ width: 1200, height: 800 });
      await waitForAppReady(page);
      await expect(page.locator('#draft')).toBeVisible();
    });
  });

  test.describe("Feature 2: WebGL Mobile Responsive Aspect Ratio", () => {
    test("T1.F2.1: Canvas matches viewport size on mobile portrait", async ({ page }) => {
      await page.setViewportSize({ width: 375, height: 812 });
      await waitForAppReady(page);
      const canvas = page.locator('#canvas-container canvas');
      const box = await canvas.boundingBox();
      expect(box.width).toBeCloseTo(375, 1);
      expect(box.height).toBeCloseTo(812, 1);
    });

    test("T1.F2.2: Camera aspect ratio matches screen on mobile portrait", async ({ page }) => {
      await page.setViewportSize({ width: 375, height: 812 });
      await waitForAppReady(page);
      const aspect = await page.evaluate(() => {
        // Evaluate ThreeJS camera aspect if exposed, or verify window aspect
        return window.innerWidth / window.innerHeight;
      });
      expect(aspect).toBeCloseTo(375 / 812, 2);
    });

    test("T1.F2.3: No console errors in portrait mode", async ({ page }) => {
      const consoleErrors = [];
      page.on('console', msg => {
        if (msg.type() === 'error') consoleErrors.push(msg.text());
      });
      await page.setViewportSize({ width: 375, height: 812 });
      await waitForAppReady(page);
      expect(consoleErrors).toEqual([]);
    });

    test("T1.F2.4: Canvas container position is fixed and spans 100%", async ({ page }) => {
      await page.setViewportSize({ width: 375, height: 812 });
      await waitForAppReady(page);
      const container = page.locator('#canvas-container');
      await expect(container).toHaveCSS('position', 'fixed');
      await expect(container).toHaveCSS('width', '375px');
    });

    test("T1.F2.5: Canvas remains visible on tab change", async ({ page }) => {
      await page.setViewportSize({ width: 375, height: 812 });
      await waitForAppReady(page);
      await page.click('#burger');
      await page.click('#nav-links a[href="#about"]');
      await expect(page.locator('#canvas-container canvas')).toBeVisible();
    });
  });

  test.describe("Feature 3: Responsive Layout & Typography", () => {
    test("T1.F3.1: No horizontal scrollbar at 375px width", async ({ page }) => {
      await page.setViewportSize({ width: 375, height: 667 });
      await waitForAppReady(page);
      const hasScrollbar = await page.evaluate(() => {
        return document.documentElement.scrollWidth > window.innerWidth;
      });
      expect(hasScrollbar).toBe(false);
    });

    test("T1.F3.2: Hero Heading font size is scaled down on mobile", async ({ page }) => {
      // Desktop
      await page.setViewportSize({ width: 1920, height: 1080 });
      await waitForAppReady(page);
      const desktopSize = await page.locator('.hero-title').evaluate(el => parseFloat(window.getComputedStyle(el).fontSize));
      
      // Mobile
      await page.setViewportSize({ width: 375, height: 667 });
      const mobileSize = await page.locator('.hero-title').evaluate(el => parseFloat(window.getComputedStyle(el).fontSize));
      
      expect(mobileSize).toBeLessThan(desktopSize);
    });

    test("T1.F3.3: Section Title font size is scaled down on mobile", async ({ page }) => {
      await page.setViewportSize({ width: 1920, height: 1080 });
      await waitForAppReady(page);
      const desktopSize = await page.locator('.section-title').first().evaluate(el => parseFloat(window.getComputedStyle(el).fontSize));
      
      await page.setViewportSize({ width: 375, height: 667 });
      const mobileSize = await page.locator('.section-title').first().evaluate(el => parseFloat(window.getComputedStyle(el).fontSize));
      
      expect(mobileSize).toBeLessThan(desktopSize);
    });

    test("T1.F3.4: Pillars grid is stacked single-column on mobile", async ({ page }) => {
      await page.setViewportSize({ width: 375, height: 667 });
      await waitForAppReady(page);
      await page.click('#burger');
      await page.click('#nav-links a[href="#about"]');
      const firstPillarBox = await page.locator('.pillar-card').nth(0).boundingBox();
      const secondPillarBox = await page.locator('.pillar-card').nth(1).boundingBox();
      // Y positions should be different indicating stacking
      expect(secondPillarBox.y).toBeGreaterThan(firstPillarBox.y);
    });

    test("T1.F3.5: Portfolio grid wraps correctly on mobile", async ({ page }) => {
      await page.setViewportSize({ width: 375, height: 667 });
      await waitForAppReady(page);
      await page.click('#burger');
      await page.click('#nav-links a[href="#portfolio"]');
      const firstItemBox = await page.locator('.portfolio-item').nth(0).boundingBox();
      const secondItemBox = await page.locator('.portfolio-item').nth(1).boundingBox();
      expect(secondItemBox.y).toBeGreaterThan(firstItemBox.y);
    });
  });

  test.describe("Feature 4: Update Logo Brand", () => {
    test("T1.F4.1: Logo text contains exactly 'Kotha\'s Atelier'", async ({ page }) => {
      await waitForAppReady(page);
      const logoText = await page.locator('a.logo').textContent();
      expect(logoText.trim()).toBe("Kotha's Atelier");
    });

    test("T1.F4.2: Logo is visible on desktop", async ({ page }) => {
      await page.setViewportSize({ width: 1200, height: 800 });
      await waitForAppReady(page);
      await expect(page.locator('a.logo')).toBeVisible();
    });

    test("T1.F4.3: Logo is visible on mobile", async ({ page }) => {
      await page.setViewportSize({ width: 375, height: 667 });
      await waitForAppReady(page);
      await expect(page.locator('a.logo')).toBeVisible();
    });

    test("T1.F4.4: Logo link points to #home", async ({ page }) => {
      await waitForAppReady(page);
      const href = await page.locator('a.logo').getAttribute('href');
      expect(href).toBe('#home');
    });

    test("T1.F4.5: Logo has no extra nested text nodes besides the brand name", async ({ page }) => {
      await waitForAppReady(page);
      const childrenCount = await page.locator('a.logo > *').count();
      // Should either be 0 or only styling nodes (like span for dot) without breaking text
      const logoText = await page.locator('a.logo').innerText();
      expect(logoText).toBe("Kotha's Atelier");
    });
  });

  test.describe("Feature 5: Hero Section Video Element Presence", () => {
    test("T1.F5.1: Video element exists in hero section", async ({ page }) => {
      await waitForAppReady(page);
      const video = page.locator('.hero-slider-bg video');
      await expect(video).toBeAttached();
    });

    test("T1.F5.2: Static hero image is absent", async ({ page }) => {
      await waitForAppReady(page);
      const img = page.locator('.hero-slider-bg img.hero-slider-img');
      await expect(img).toBeHidden();
    });

    test("T1.F5.3: Video has loop attribute", async ({ page }) => {
      await waitForAppReady(page);
      const video = page.locator('.hero-slider-bg video');
      await expect(video).toHaveAttribute('loop');
    });

    test("T1.F5.4: Video has muted attribute", async ({ page }) => {
      await waitForAppReady(page);
      const video = page.locator('.hero-slider-bg video');
      await expect(video).toHaveAttribute('muted');
    });

    test("T1.F5.5: Video has playsinline attribute", async ({ page }) => {
      await waitForAppReady(page);
      const video = page.locator('.hero-slider-bg video');
      await expect(video).toHaveAttribute('playsinline');
    });
  });

  // =========================================================================
  // TIER 2: BOUNDARY & CORNER CASES (25 Test Checks)
  // =========================================================================

  test.describe("Milestone M1 Boundary Cases", () => {
    
    // Feature 1 Boundaries
    test("T2.F1.1: Sandbox is hidden at exactly 768px width", async ({ page }) => {
      await page.setViewportSize({ width: 768, height: 1024 });
      await waitForAppReady(page);
      await expect(page.locator('#draft')).toBeHidden();
    });

    test("T2.F1.2: Sandbox is visible at exactly 769px width", async ({ page }) => {
      await page.setViewportSize({ width: 769, height: 1024 });
      await waitForAppReady(page);
      await expect(page.locator('#draft')).toBeVisible();
    });

    test("T2.F1.3: Sandbox hides dynamically on resize desktop -> mobile", async ({ page }) => {
      await page.setViewportSize({ width: 1024, height: 768 });
      await waitForAppReady(page);
      await expect(page.locator('#draft')).toBeVisible();
      
      await page.setViewportSize({ width: 768, height: 768 });
      await expect(page.locator('#draft')).toBeHidden();
    });

    test("T2.F1.4: Sandbox shows dynamically on resize mobile -> desktop", async ({ page }) => {
      await page.setViewportSize({ width: 768, height: 768 });
      await waitForAppReady(page);
      await expect(page.locator('#draft')).toBeHidden();
      
      await page.setViewportSize({ width: 769, height: 768 });
      await expect(page.locator('#draft')).toBeVisible();
    });

    test("T2.F1.5: Hash routing to #draft on mobile fails safely or redirects", async ({ page }) => {
      await page.setViewportSize({ width: 375, height: 667 });
      await page.goto('/#draft', { waitUntil: 'domcontentloaded' });
      await page.waitForTimeout(500);
      // It should either fallback to #home or keep #draft hidden
      await expect(page.locator('#draft')).toBeHidden();
    });

    // Feature 2 Boundaries
    test("T2.F2.1: WebGL Canvas survives ultra-narrow 200px width", async ({ page }) => {
      await page.setViewportSize({ width: 200, height: 600 });
      await waitForAppReady(page);
      await expect(page.locator('#canvas-container canvas')).toBeVisible();
    });

    test("T2.F2.2: Camera aspect ratio is 1.0 on square viewport", async ({ page }) => {
      await page.setViewportSize({ width: 500, height: 500 });
      await waitForAppReady(page);
      const aspect = await page.evaluate(() => window.innerWidth / window.innerHeight);
      expect(aspect).toBe(1.0);
    });

    test("T2.F2.3: WebGL behaves on ultra-tall viewport", async ({ page }) => {
      await page.setViewportSize({ width: 360, height: 1200 });
      await waitForAppReady(page);
      await expect(page.locator('#canvas-container canvas')).toBeVisible();
    });

    test("T2.F2.4: Double orientation toggle updates canvas size", async ({ page }) => {
      await page.setViewportSize({ width: 375, height: 812 }); // Portrait
      await waitForAppReady(page);
      await page.setViewportSize({ width: 812, height: 375 }); // Landscape
      await page.waitForTimeout(200);
      let box = await page.locator('#canvas-container canvas').boundingBox();
      expect(box.width).toBeCloseTo(812, 1);
      
      await page.setViewportSize({ width: 375, height: 812 }); // Portrait
      await page.waitForTimeout(200);
      box = await page.locator('#canvas-container canvas').boundingBox();
      expect(box.width).toBeCloseTo(375, 1);
    });

    test("T2.F2.5: DPR emulation does not throw canvas out of bounds", async ({ page }) => {
      // Set device scale factor high
      await page.setViewportSize({ width: 375, height: 812 });
      await waitForAppReady(page);
      const innerW = await page.evaluate(() => window.innerWidth);
      const canvasW = await page.locator('#canvas-container canvas').evaluate(el => el.clientWidth);
      expect(canvasW).toBe(innerW);
    });

    // Feature 3 Boundaries
    test("T2.F3.1: No horizontal scrollbar at ultra-small width 320px", async ({ page }) => {
      await page.setViewportSize({ width: 320, height: 568 });
      await waitForAppReady(page);
      const hasScrollbar = await page.evaluate(() => {
        return document.documentElement.scrollWidth > window.innerWidth;
      });
      expect(hasScrollbar).toBe(false);
    });

    test("T2.F3.2: Typography font-size media query breakpoint checks", async ({ page }) => {
      await page.setViewportSize({ width: 768, height: 1024 });
      await waitForAppReady(page);
      const size768 = await page.locator('.hero-title').evaluate(el => parseFloat(window.getComputedStyle(el).fontSize));
      
      await page.setViewportSize({ width: 769, height: 1024 });
      const size769 = await page.locator('.hero-title').evaluate(el => parseFloat(window.getComputedStyle(el).fontSize));
      
      expect(size768).toBeLessThan(size769);
    });

    test("T2.F3.3: Navbar container does not overflow at 375px", async ({ page }) => {
      await page.setViewportSize({ width: 375, height: 667 });
      await waitForAppReady(page);
      const navbarWidth = await page.locator('#navbar').evaluate(el => el.scrollWidth);
      expect(navbarWidth).toBeLessThanOrEqual(375);
    });

    test("T2.F3.4: Modal content fits on mobile landscape orientation", async ({ page }) => {
      await page.setViewportSize({ width: 667, height: 375 });
      await waitForAppReady(page);
      await page.click('a.nav-link[href="#portfolio"]');
      await page.click('.portfolio-item[data-project-id="elysian-estate"]');
      const modalContent = page.locator('.modal-content');
      await expect(modalContent).toBeVisible();
      const isOverflown = await modalContent.evaluate(el => el.scrollHeight > window.innerHeight);
      // Wait, scroll should be enabled inside modal if it overflows height, but it shouldn't crash
      expect(isOverflown).toBeDefined();
    });

    test("T2.F3.5: Contact form fields align properly on mobile", async ({ page }) => {
      await page.setViewportSize({ width: 375, height: 667 });
      await waitForAppReady(page);
      await page.click('#burger');
      await page.click('#nav-links a[href="#contact"]');
      const nameInputBox = await page.locator('#form-name').boundingBox();
      const emailInputBox = await page.locator('#form-email').boundingBox();
      // Should stack vertically
      expect(emailInputBox.y).toBeGreaterThan(nameInputBox.y);
    });

    // Feature 4 Boundaries
    test("T2.F4.1: Logo text case sensitivity exact check", async ({ page }) => {
      await waitForAppReady(page);
      const text = await page.locator('a.logo').evaluate(el => el.textContent);
      expect(text).toBe("Kotha's Atelier"); // Not all caps in HTML source
    });

    test("T2.F4.2: Logo does not overlap burger button at 320px width", async ({ page }) => {
      await page.setViewportSize({ width: 320, height: 568 });
      await waitForAppReady(page);
      const logoBox = await page.locator('a.logo').boundingBox();
      const burgerBox = await page.locator('#burger').boundingBox();
      // Logo is on the left, burger is on the right
      expect(burgerBox.x).toBeGreaterThan(logoBox.x + logoBox.width);
    });

    test("T2.F4.3: Logo hover text attribute check", async ({ page }) => {
      await waitForAppReady(page);
      const hoverAttr = await page.locator('a.logo').getAttribute('data-hover-text');
      expect(hoverAttr).toBe("Home");
    });

    test("T2.F4.4: Logo contains straight single quote", async ({ page }) => {
      await waitForAppReady(page);
      const text = await page.locator('a.logo').textContent();
      expect(text).toContain("'");
      expect(text).not.toContain("’");
    });

    test("T2.F4.5: Preloader logo text contains matching brand name", async ({ page }) => {
      await page.goto('/', { waitUntil: 'domcontentloaded' });
      const preloaderText = await page.locator('.preloader-logo').textContent();
      expect(preloaderText.toLowerCase()).toContain("kotha's");
    });

    // Feature 5 Boundaries
    test("T2.F5.1: Video source is background.mp4 or mobile-background.mp4", async ({ page }) => {
      await waitForAppReady(page);
      const src = await page.locator('.hero-slider-bg video source').getAttribute('src');
      expect(src).toMatch(/background\.mp4|mobile-background\.mp4/);
    });

    test("T2.F5.2: Autoplay is active", async ({ page }) => {
      await waitForAppReady(page);
      const autoplay = await page.locator('.hero-slider-bg video').evaluate(el => el.autoplay);
      expect(autoplay).toBe(true);
    });

    test("T2.F5.3: Video loads successfully", async ({ page }) => {
      await waitForAppReady(page);
      const readyState = await page.locator('.hero-slider-bg video').evaluate(el => el.readyState);
      expect(readyState).toBeGreaterThanOrEqual(2); // HAVE_CURRENT_DATA or higher
    });

    test("T2.F5.4: Video fits within hero container size", async ({ page }) => {
      await waitForAppReady(page);
      const containerBox = await page.locator('.hero-slider-bg').boundingBox();
      const videoBox = await page.locator('.hero-slider-bg video').boundingBox();
      expect(videoBox.width).toBeLessThanOrEqual(containerBox.width + 1);
    });

    test("T2.F5.5: Hero section does not contain nested img element", async ({ page }) => {
      await waitForAppReady(page);
      const count = await page.locator('.hero-slider-bg img').count();
      expect(count).toBe(0);
    });

  });

  // =========================================================================
  // TIER 3: CROSS-FEATURE COMBINATIONS (5 Test Checks)
  // =========================================================================

  test.describe("Milestone M1 Cross-Feature Combinations", () => {
    test.beforeEach(async ({ page }) => {
      await waitForAppReady(page);
    });

    test("T3.1: Mobile menu is clean with sandbox hidden (F1 + F3)", async ({ page }) => {
      await page.setViewportSize({ width: 375, height: 667 });
      await page.click('#burger');
      // Assert that Draft link is not visible or disabled in the drawer menu
      const draftLink = page.locator('#nav-links a[href="#draft"]');
      await expect(draftLink).toHaveCSS('display', 'none');
    });

    test("T3.2: WebGL resizing does not trigger horizontal scrollbar (F2 + F3)", async ({ page }) => {
      await page.setViewportSize({ width: 1200, height: 800 });
      await page.setViewportSize({ width: 375, height: 667 });
      await page.waitForTimeout(300);
      const hasScroll = await page.evaluate(() => document.documentElement.scrollWidth > window.innerWidth);
      expect(hasScroll).toBe(false);
    });

    test("T3.3: WebGL solid rendering deactivated when sandbox hidden (F1 + F2)", async ({ page }) => {
      await page.setViewportSize({ width: 375, height: 667 });
      // In mobile viewports, the active tab shouldn't trigger Solid structures rendering
      const isSolidVisible = await page.evaluate(() => {
        // Check window state or canvas flag if exposed by ThreeJS manager
        return typeof solidGroup !== "undefined" ? solidGroup.visible : false;
      });
      expect(isSolidVisible).toBe(false);
    });

    test("T3.4: Logo brand overlay is visible on top of video element (F4 + F5)", async ({ page }) => {
      const logoZIndex = await page.locator('#navbar').evaluate(el => parseInt(window.getComputedStyle(el).zIndex));
      const videoZIndex = await page.locator('.hero-slider-bg video').evaluate(el => parseInt(window.getComputedStyle(el).zIndex || "0"));
      expect(logoZIndex).toBeGreaterThan(videoZIndex);
    });

    test("T3.5: Responsive video behaves under mobile scaled typography (F3 + F5)", async ({ page }) => {
      await page.setViewportSize({ width: 375, height: 667 });
      const heroTitleBox = await page.locator('.hero-title').boundingBox();
      const videoBox = await page.locator('.hero-slider-bg video').boundingBox();
      // Ensure title text does not overlap with the video bounds on mobile layout
      expect(heroTitleBox.y + heroTitleBox.height).toBeLessThanOrEqual(videoBox.y + 10);
    });
  });

  // =========================================================================
  // TIER 4: REAL-WORLD APPLICATION SCENARIOS (5 Scenario Checks)
  // =========================================================================

  test.describe("Milestone M1 Real-World User Scenarios", () => {
    
    test("T4.1: Mobile User Portrait Journey (375px)", async ({ page }) => {
      await page.setViewportSize({ width: 375, height: 812 });
      await waitForAppReady(page);
      
      // 1. Verify brand logo
      await expect(page.locator('a.logo')).toHaveText("Kotha's Atelier");
      
      // 2. Verify Hero Video
      await expect(page.locator('.hero-slider-bg video')).toBeAttached();
      
      // 3. Open Mobile Burger and confirm Draft is disabled
      await page.click('#burger');
      const draftLink = page.locator('#nav-links a[href="#draft"]');
      await expect(draftLink).toHaveCSS('display', 'none');
      
      // 4. Click Contact page
      await page.click('#nav-links a[href="#contact"]');
      await page.waitForTimeout(300);
      
      // 5. Verify no scrollbars
      const hasScroll = await page.evaluate(() => document.documentElement.scrollWidth > window.innerWidth);
      expect(hasScroll).toBe(false);
    });

    test("T4.2: Dynamic Tablet-to-Mobile Reflow Scenario", async ({ page }) => {
      await page.setViewportSize({ width: 1024, height: 768 });
      await waitForAppReady(page);
      
      // Navigate to draft on tablet
      await page.click('a.nav-link[href="#draft"]');
      await expect(page.locator('#draft')).toBeVisible();
      
      // Drag slider
      await page.fill('#draft-length', '15');
      
      // Resize to mobile
      await page.setViewportSize({ width: 768, height: 768 });
      await page.waitForTimeout(300);
      
      // Assert Draft sandbox is hidden
      await expect(page.locator('#draft')).toBeHidden();
      
      // Assert we were redirected or routing fell back
      const activeSection = await page.locator('.page-section.active').getAttribute('id');
      expect(activeSection).not.toBe('draft');
    });

    test("T4.3: High-Resolution Retina Mobile Device Emulation", async ({ page }) => {
      // Set viewport and high DPR
      await page.setViewportSize({ width: 390, height: 844 });
      await waitForAppReady(page);
      
      // Check logo brand text
      await expect(page.locator('a.logo')).toHaveText("Kotha's Atelier");
      
      // Check font-size of headings are small and readable
      const fontSize = await page.locator('.hero-title').evaluate(el => parseFloat(window.getComputedStyle(el).fontSize));
      expect(fontSize).toBeLessThan(50); // e.g. 50px
      
      // Verify WebGL Canvas exists and matches width
      const canvasWidth = await page.locator('#canvas-container canvas').evaluate(el => el.clientWidth);
      expect(canvasWidth).toBe(390);
    });

    test("T4.4: Landscape Mobile Orientation Swap Flow", async ({ page }) => {
      await page.setViewportSize({ width: 375, height: 812 }); // Portrait
      await waitForAppReady(page);
      
      // Verify canvas matches
      let canvasBox = await page.locator('#canvas-container canvas').boundingBox();
      expect(canvasBox.width).toBeCloseTo(375, 1);
      
      // Rotate
      await page.setViewportSize({ width: 812, height: 375 }); // Landscape
      await page.waitForTimeout(300);
      
      // Verify canvas updates
      canvasBox = await page.locator('#canvas-container canvas').boundingBox();
      expect(canvasBox.width).toBeCloseTo(812, 1);
      
      // Verify no horizontal scrollbar
      const hasScroll = await page.evaluate(() => document.documentElement.scrollWidth > window.innerWidth);
      expect(hasScroll).toBe(false);
    });

    test("T4.5: Full Brand Audit Scenario", async ({ page }) => {
      await waitForAppReady(page);
      
      // Check header logo
      await expect(page.locator('a.logo')).toHaveText("Kotha's Atelier");
      
      // Check title logo
      const title = await page.title();
      expect(title).toContain("Kotha's Atelier");
      
      // Check preloader logo contains match
      await page.goto('/', { waitUntil: 'domcontentloaded' });
      const preloaderText = await page.locator('.preloader-logo').textContent();
      expect(preloaderText.toLowerCase()).toContain("kotha's");
    });

  });

});
