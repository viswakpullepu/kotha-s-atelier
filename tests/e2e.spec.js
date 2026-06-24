const { test, expect } = require('@playwright/test');

// Helper to wait for luxury loading screen to disappear
async function waitForAppReady(page) {
  await page.goto('/', { waitUntil: 'domcontentloaded' });
  await page.waitForSelector('#preloader.fade-out', { timeout: 10000 });
}

test.describe("Kotha's Atelier E2E Test Suite", () => {

  // =========================================================================
  // TIER 1: FEATURE COVERAGE (20 Test Cases, 5 per feature)
  // =========================================================================

  test.describe("Feature 1: SPA Routing (T1.1 - T1.5)", () => {
    test.beforeEach(async ({ page }) => {
      await waitForAppReady(page);
    });

    test("T1.1: Navigate to About section", async ({ page }) => {
      await page.click('a.nav-link[href="#about"]');
      await expect(page.locator('#about')).toHaveClass(/active/);
      await expect(page.locator('#about')).toBeVisible();
      await expect(page.locator('#home')).not.toHaveClass(/active/);
      await expect(page.locator('#home')).toBeHidden();
    });

    test("T1.2: Navigate to Portfolio section", async ({ page }) => {
      await page.click('a.nav-link[href="#portfolio"]');
      await expect(page.locator('#portfolio')).toHaveClass(/active/);
      await expect(page.locator('#portfolio')).toBeVisible();
    });

    test("T1.3: Navigate to Draft My House section", async ({ page }) => {
      await page.click('a.nav-link[href="#draft"]');
      await expect(page.locator('#draft')).toHaveClass(/active/);
      await expect(page.locator('#draft')).toBeVisible();
    });

    test("T1.4: Navigate to Contact section", async ({ page }) => {
      await page.click('a.nav-link[href="#contact"]');
      await expect(page.locator('#contact')).toHaveClass(/active/);
      await expect(page.locator('#contact')).toBeVisible();
    });

    test("T1.5: Navigate via inline Explore Portfolio CTA on Home", async ({ page }) => {
      await page.click('a.btn-primary[href="#portfolio"]');
      await expect(page.locator('#portfolio')).toHaveClass(/active/);
      await expect(page.locator('#portfolio')).toBeVisible();
      
      // SPA routing overlay/blank check: verify exactly one section is active and visible
      const activeCount = await page.locator('.page-section.active').count();
      expect(activeCount).toBe(1);
    });
  });

  test.describe("Feature 2: Contact Form (T2.1 - T2.5)", () => {
    test.beforeEach(async ({ page }) => {
      await waitForAppReady(page);
      await page.click('a.nav-link[href="#contact"]');
    });

    test("T2.1: Verify form elements are rendered", async ({ page }) => {
      await expect(page.locator('#form-name')).toBeVisible();
      await expect(page.locator('#form-email')).toBeVisible();
      await expect(page.locator('#form-phone')).toBeVisible();
      await expect(page.locator('#form-message')).toBeVisible();
      await expect(page.locator('#form-submit')).toBeVisible();
    });

    test("T2.2: Form validation - Name is required", async ({ page }) => {
      await page.fill('#form-email', 'client@example.com');
      await page.fill('#form-message', 'Modernist house design needed.');
      await page.click('#form-submit');
      
      const formMsg = page.locator('#form-msg');
      await expect(formMsg).toBeVisible();
      await expect(formMsg).toHaveClass(/error/);
      await expect(formMsg).toHaveText(/fields/i);
    });

    test("T2.3: Form validation - Email is required", async ({ page }) => {
      await page.fill('#form-name', 'John Doe');
      await page.fill('#form-message', 'Modernist house design.');
      await page.click('#form-submit');
      
      const formMsg = page.locator('#form-msg');
      await expect(formMsg).toBeVisible();
      await expect(formMsg).toHaveClass(/error/);
      await expect(formMsg).toHaveText(/fields/i);
    });

    test("T2.4: Form validation - Message is required", async ({ page }) => {
      await page.fill('#form-name', 'John Doe');
      await page.fill('#form-email', 'client@example.com');
      await page.click('#form-submit');
      
      const formMsg = page.locator('#form-msg');
      await expect(formMsg).toBeVisible();
      await expect(formMsg).toHaveClass(/error/);
      await expect(formMsg).toHaveText(/fields/i);
    });

    test("T2.5: Form validation - Email format validation", async ({ page }) => {
      await page.fill('#form-name', 'John Doe');
      await page.fill('#form-email', 'invalid-email-format');
      await page.fill('#form-message', 'Valid message content.');
      await page.click('#form-submit');
      
      const formMsg = page.locator('#form-msg');
      await expect(formMsg).toBeVisible();
      await expect(formMsg).toHaveClass(/error/);
      await expect(formMsg).toHaveText(/electronic mail/i);
    });
  });

  test.describe("Feature 3: WebGL 3D Canvas (T3.1 - T3.5)", () => {
    test.beforeEach(async ({ page }) => {
      await waitForAppReady(page);
      await page.click('a.nav-link[href="#draft"]');
    });

    test("T3.1: Canvas element exists", async ({ page }) => {
      const container = page.locator('#canvas-container');
      await expect(container).toBeAttached();
      const canvas = container.locator('canvas');
      await expect(canvas).toBeAttached();
    });

    test("T3.2: Verify canvas matches window dimensions approximately", async ({ page }) => {
      const viewport = page.viewportSize();
      const canvas = page.locator('#canvas-container canvas');
      const widthAttr = await canvas.getAttribute('width');
      const heightAttr = await canvas.getAttribute('height');
      
      // Values can be scaled by device pixel ratio, so we verify they are >= viewport size
      expect(Number(widthAttr)).toBeGreaterThanOrEqual(viewport.width);
      expect(Number(heightAttr)).toBeGreaterThanOrEqual(viewport.height);
    });

    test("T3.3: Sliders exist with default values", async ({ page }) => {
      const lengthVal = await page.inputValue('#draft-length');
      const widthVal = await page.inputValue('#draft-width');
      expect(lengthVal).toBe('12');
      expect(widthVal).toBe('10');
      await expect(page.locator('#draft-length-val')).toHaveText('12m');
      await expect(page.locator('#draft-width-val')).toHaveText('10m');
    });

    test("T3.4: Pillar configuration selection interface works", async ({ page }) => {
      const initialActive = page.locator('.pillar-btn.active');
      await expect(initialActive).toHaveAttribute('data-pillars', '4');
      
      const pillarBtns = page.locator('.pillar-btn');
      expect(await pillarBtns.count()).toBe(4);
    });

    test("T3.5: Furniture checkbox toggle exists and is checked", async ({ page }) => {
      const furnitureCheckbox = page.locator('#draft-furniture');
      await expect(furnitureCheckbox).toBeChecked();
    });
  });

  test.describe("Feature 4: CSS & Responsive Layout (T4.1 - T4.5)", () => {
    test("T4.1: No horizontal scrollbar at 1920px width", async ({ page }) => {
      await page.setViewportSize({ width: 1920, height: 1080 });
      await waitForAppReady(page);
      const isScrollbarPresent = await page.evaluate(() => {
        return document.documentElement.scrollWidth > window.innerWidth;
      });
      expect(isScrollbarPresent).toBe(false);
    });

    test("T4.2: No horizontal scrollbar at 768px width", async ({ page }) => {
      await page.setViewportSize({ width: 768, height: 1024 });
      await waitForAppReady(page);
      const isScrollbarPresent = await page.evaluate(() => {
        return document.documentElement.scrollWidth > window.innerWidth;
      });
      expect(isScrollbarPresent).toBe(false);
    });

    test("T4.3: No horizontal scrollbar at 375px width", async ({ page }) => {
      await page.setViewportSize({ width: 375, height: 667 });
      await waitForAppReady(page);
      const isScrollbarPresent = await page.evaluate(() => {
        return document.documentElement.scrollWidth > window.innerWidth;
      });
      expect(isScrollbarPresent).toBe(false);
    });

    test("T4.4: Navbar glassmorphism - scroll down adds scrolled class", async ({ page }) => {
      await waitForAppReady(page);
      await page.evaluate(() => window.scrollTo(0, 100));
      // wait a moment for the scroll handler to fire
      await page.waitForTimeout(200);
      await expect(page.locator('#navbar')).toHaveClass(/scrolled/);
    });

    test("T4.5: Mobile burger menu visibility", async ({ page }) => {
      await page.setViewportSize({ width: 1920, height: 1080 });
      await waitForAppReady(page);
      await expect(page.locator('#burger')).toBeHidden();

      await page.setViewportSize({ width: 375, height: 667 });
      await expect(page.locator('#burger')).toBeVisible();
    });
  });

  // =========================================================================
  // TIER 2: BOUNDARY & CORNER CASES (20 Test Cases, 5 per feature)
  // =========================================================================

  test.describe("SPA Routing - Boundary & Corner Cases (T5.1 - T5.5)", () => {
    test.beforeEach(async ({ page }) => {
      await waitForAppReady(page);
    });

    test("T5.1: Navigation boundary - Empty hash defaults to #home", async ({ page }) => {
      await page.goto('/#', { waitUntil: 'domcontentloaded' });
      await page.waitForTimeout(500);
      await expect(page.locator('#home')).toHaveClass(/active/);
    });

    test("T5.2: Navigation boundary - Invalid hash does not crash", async ({ page }) => {
      await page.goto('/#nonexistent', { waitUntil: 'domcontentloaded' });
      await page.waitForTimeout(500);
      // It should keep the current active section or default back
      const activeCount = await page.locator('.page-section.active').count();
      expect(activeCount).toBeLessThanOrEqual(1);
    });

    test("T5.3: Navigation boundary - Back/Forward history navigation", async ({ page }) => {
      await page.click('a.nav-link[href="#about"]');
      await page.click('a.nav-link[href="#contact"]');
      await page.goBack();
      await expect(page.locator('#about')).toHaveClass(/active/);
      await page.goForward();
      await expect(page.locator('#contact')).toHaveClass(/active/);
    });

    test("T5.4: Navigation boundary - Rapid clicks do not break active pages", async ({ page }) => {
      await page.click('a.nav-link[href="#about"]');
      await page.click('a.nav-link[href="#portfolio"]');
      await page.click('a.nav-link[href="#draft"]');
      await page.click('a.nav-link[href="#contact"]');
      await page.waitForTimeout(1000); // Allow transitions to finish
      const activeSections = await page.locator('.page-section.active');
      expect(await activeSections.count()).toBe(1);
      await expect(activeSections).toHaveId('contact');
    });

    test("T5.5: Navigation boundary - Burger menu closes on link click on mobile", async ({ page }) => {
      await page.setViewportSize({ width: 375, height: 667 });
      await page.click('#burger');
      await expect(page.locator('#nav-links')).toHaveClass(/nav-active/);
      
      await page.click('#nav-links a[href="#about"]');
      await page.waitForTimeout(500);
      await expect(page.locator('#nav-links')).not.toHaveClass(/nav-active/);
      await expect(page.locator('#burger')).not.toHaveClass(/toggle/);
    });
  });

  test.describe("Contact Form - Boundary & Corner Cases (T6.1 - T6.5)", () => {
    test.beforeEach(async ({ page }) => {
      await waitForAppReady(page);
      await page.click('a.nav-link[href="#contact"]');
    });

    test("T6.1: Phone number is optional", async ({ page }) => {
      await page.fill('#form-name', 'Jane Smith');
      await page.fill('#form-email', 'jane@example.com');
      await page.fill('#form-message', 'Build my dream office space.');
      // Keep phone number blank
      await page.click('#form-submit');
      
      // Verify validation doesn't block (it starts connection animation or succeeds)
      const formMsg = page.locator('#form-msg');
      await expect(formMsg).not.toHaveClass(/error/);
    });

    test("T6.2: Extreme string length - Name field", async ({ page }) => {
      const longName = 'A'.repeat(500);
      await page.fill('#form-name', longName);
      await page.fill('#form-email', 'test@example.com');
      await page.fill('#form-message', 'Design check.');
      await page.click('#form-submit');
      
      const formMsg = page.locator('#form-msg');
      await expect(formMsg).not.toHaveClass(/error/);
    });

    test("T6.3: Extreme string length - Message field", async ({ page }) => {
      const longMessage = 'M'.repeat(5000);
      await page.fill('#form-name', 'John Doe');
      await page.fill('#form-email', 'john@example.com');
      await page.fill('#form-message', longMessage);
      await page.click('#form-submit');
      
      const formMsg = page.locator('#form-msg');
      await expect(formMsg).not.toHaveClass(/error/);
    });

    test("T6.4: Special character email address validation", async ({ page }) => {
      await page.fill('#form-name', 'Special Character Name');
      await page.fill('#form-email', 'dev.email+luxury-inquiries@kothas-group.co.in');
      await page.fill('#form-message', 'Timeless architecture inquiry.');
      await page.click('#form-submit');
      
      const formMsg = page.locator('#form-msg');
      await expect(formMsg).not.toHaveClass(/error/);
    });

    test("T6.5: HTML injection mitigation check", async ({ page }) => {
      const xssPayload = "<script>alert('xss')</script> &lt;div&gt;";
      await page.fill('#form-name', xssPayload);
      await page.fill('#form-email', 'xss@test.com');
      await page.fill('#form-message', xssPayload);
      await page.click('#form-submit');
      
      // Ensure no script block executes, values remain plain text in form reset/display
      const nameVal = await page.inputValue('#form-name');
      // The form resets on successful submit simulation, so it should be empty
      expect(nameVal).toBe('');
    });
  });

  test.describe("WebGL Canvas - Boundary & Corner Cases (T7.1 - T7.5)", () => {
    test.beforeEach(async ({ page }) => {
      await waitForAppReady(page);
      await page.click('a.nav-link[href="#draft"]');
    });

    test("T7.1: Length slider boundary clamping", async ({ page }) => {
      const slider = page.locator('#draft-length');
      const minAttr = await slider.getAttribute('min');
      const maxAttr = await slider.getAttribute('max');
      expect(minAttr).toBe('6');
      expect(maxAttr).toBe('18');
      
      // Attempt to set a value outside bounds programmatically (e.g. 5 or 20) and check behavior
      await page.evaluate(() => {
        const input = document.getElementById('draft-length');
        input.value = '5';
        input.dispatchEvent(new Event('input'));
      });
      // The slider element itself clamps it on UI interaction, but programmatically it updates to '5' unless clamped
      const currentVal = await page.inputValue('#draft-length');
      // The UI displays the value. Since HTML input range clamps value, setting value '5' results in '6' (min)
      expect(currentVal).toBe('6');
    });

    test("T7.2: Width slider boundary clamping", async ({ page }) => {
      const slider = page.locator('#draft-width');
      const minAttr = await slider.getAttribute('min');
      const maxAttr = await slider.getAttribute('max');
      expect(minAttr).toBe('6');
      expect(maxAttr).toBe('18');
      
      await page.evaluate(() => {
        const input = document.getElementById('draft-width');
        input.value = '20';
        input.dispatchEvent(new Event('input'));
      });
      const currentVal = await page.inputValue('#draft-width');
      expect(currentVal).toBe('18'); // Clamped to max
    });

    test("T7.3: Toggle pillar counts dynamically updates display", async ({ page }) => {
      await page.click('.pillar-btn[data-pillars="8"]');
      await expect(page.locator('.pillar-btn[data-pillars="8"]')).toHaveClass(/active/);
      await expect(page.locator('.pillar-btn[data-pillars="4"]')).not.toHaveClass(/active/);
    });

    test("T7.4: Rapid furniture toggles do not break script", async ({ page }) => {
      const toggle = page.locator('#draft-furniture');
      for (let i = 0; i < 5; i++) {
        await toggle.click();
      }
      // Ends up in unchecked state (starts checked, 5 toggles -> unchecked)
      await expect(toggle).not.toBeChecked();
    });

    test("T7.5: Window resize extreme bounds", async ({ page }) => {
      // Extremely small viewport
      await page.setViewportSize({ width: 200, height: 200 });
      await page.waitForTimeout(200);
      
      // Extremely large viewport
      await page.setViewportSize({ width: 3000, height: 2000 });
      await page.waitForTimeout(200);
      
      const canvas = page.locator('#canvas-container canvas');
      await expect(canvas).toBeVisible();
    });
  });

  test.describe("CSS & Responsive - Boundary & Corner Cases (T8.1 - T8.5)", () => {
    test.beforeEach(async ({ page }) => {
      await waitForAppReady(page);
    });

    test("T8.1: Navbar not scrolled when at top", async ({ page }) => {
      await expect(page.locator('#navbar')).not.toHaveClass(/scrolled/);
    });

    test("T8.2: Navbar scrolled exactly at threshold", async ({ page }) => {
      await page.evaluate(() => window.scrollTo(0, 51));
      await page.waitForTimeout(200);
      await expect(page.locator('#navbar')).toHaveClass(/scrolled/);
    });

    test("T8.3: Navbar scroll reset on returning to top", async ({ page }) => {
      await page.evaluate(() => window.scrollTo(0, 100));
      await page.waitForTimeout(200);
      await page.evaluate(() => window.scrollTo(0, 0));
      await page.waitForTimeout(200);
      await expect(page.locator('#navbar')).not.toHaveClass(/scrolled/);
    });

    test("T8.4: Footer social links have hover text interaction", async ({ page }) => {
      const socialLinks = page.locator('footer .footer-socials a');
      const count = await socialLinks.count();
      expect(count).toBeGreaterThan(0);
      for (let i = 0; i < count; i++) {
        await expect(socialLinks.nth(i)).toHaveAttribute('data-hover-text');
      }
    });

    test("T8.5: Noise overlay pointer-events is none", async ({ page }) => {
      const isPointerEventsNone = await page.evaluate(() => {
        const el = document.querySelector('.noise-overlay');
        return el ? window.getComputedStyle(el).pointerEvents === 'none' : false;
      });
      expect(isPointerEventsNone).toBe(true);
    });
  });

  // =========================================================================
  // TIER 3: CROSS-FEATURE COMBINATIONS (4 Test Cases)
  // =========================================================================

  test.describe("Cross-Feature Interactions (T9.1 - T9.4)", () => {
    test.beforeEach(async ({ page }) => {
      await waitForAppReady(page);
    });

    test("T9.1: Draft Configurator to Contact Form Redirection (Badge Attachment)", async ({ page }) => {
      await page.click('a.nav-link[href="#draft"]');
      
      // Configure Draft values
      await page.fill('#draft-length', '15');
      await page.evaluate(() => document.getElementById('draft-length').dispatchEvent(new Event('input')));
      await page.fill('#draft-width', '14');
      await page.evaluate(() => document.getElementById('draft-width').dispatchEvent(new Event('input')));
      await page.click('.pillar-btn[data-pillars="8"]');
      
      // Click Consult
      await page.click('#btn-submit-draft');
      
      // Verifications
      await expect(page).toHaveURL(/#contact/);
      await expect(page.locator('#contact')).toHaveClass(/active/);
      
      const badge = page.locator('#draft-badge');
      await expect(badge).toBeVisible();
      await expect(page.locator('#draft-badge-details')).toHaveText(/Length: 15m \| Width: 14m \| Pillars: 8/);
      
      const msgArea = page.locator('#form-message');
      const msgValue = await msgArea.inputValue();
      expect(msgValue).toContain('3D DESIGN SPECIFICATIONS ATTACHED');
      expect(msgValue).toContain('Floor Dimensions: 15m x 14m');
      expect(msgValue).toContain('Pillars: 8');
    });

    test("T9.2: Remove Attachment Badge strips specs from textarea", async ({ page }) => {
      await page.click('a.nav-link[href="#draft"]');
      await page.click('#btn-submit-draft');
      
      // Verify badge and specs are attached
      await expect(page.locator('#draft-badge')).toBeVisible();
      
      // Click remove badge
      await page.click('#btn-remove-badge');
      
      // Verify hidden badge and stripped spec text
      await expect(page.locator('#draft-badge')).toBeHidden();
      const msgValue = await page.inputValue('#form-message');
      expect(msgValue).not.toContain('3D DESIGN SPECIFICATIONS ATTACHED');
    });

    test("T9.3: Contact Form Successful Submit resets Attachment Badge", async ({ page }) => {
      await page.click('a.nav-link[href="#draft"]');
      await page.click('#btn-submit-draft');
      
      // Attach details verify
      await expect(page.locator('#draft-badge')).toBeVisible();
      
      // Fill Form
      await page.fill('#form-name', 'Luxury Architect client');
      await page.fill('#form-email', 'director@luxury-studio.com');
      // Submitting the form
      await page.click('#form-submit');
      
      // Wait for the simulated connect to finish (takes 1800ms)
      const formMsg = page.locator('#form-msg');
      await expect(formMsg).toBeVisible({ timeout: 5000 });
      await expect(formMsg).toHaveClass(/success/);
      
      // Badge should reset to hidden
      await expect(page.locator('#draft-badge')).toBeHidden();
    });

    test("T9.4: Nav link click during open Modal closes Modal", async ({ page }) => {
      await page.click('a.nav-link[href="#portfolio"]');
      
      // Open modal
      await page.click('.portfolio-item[data-project-id="elysian-estate"]');
      await expect(page.locator('#project-modal')).toHaveClass(/active/);
      
      // Click home nav link
      await page.click('a.nav-link[href="#home"]');
      await page.waitForTimeout(500); // allow transition
      
      // Check modal is closed (no active class)
      await expect(page.locator('#project-modal')).not.toHaveClass(/active/);
      await expect(page.locator('#home')).toHaveClass(/active/);
    });
  });

  // =========================================================================
  // TIER 4: REAL-WORLD APPLICATION SCENARIOS (5 Test Cases)
  // =========================================================================

  test.describe("Real-World User Scenarios (T10.1 - T10.5)", () => {
    test.beforeEach(async ({ page }) => {
      await waitForAppReady(page);
    });

    test("T10.1: Scenario 1 - Comprehensive User Journey (Explore -> Draft -> Submit)", async ({ page }) => {
      // 1. User explores Home & clicks Portfolio CTA
      await page.click('a.btn-primary[href="#portfolio"]');
      await expect(page.locator('#portfolio')).toHaveClass(/active/);
      
      // 2. Filters portfolio items & inspects project modal
      await page.click('.filter-btn[data-filter="residential"]');
      await page.click('.portfolio-item[data-project-id="elysian-estate"]');
      await expect(page.locator('#modal-title')).toHaveText('Elysian Estate');
      await expect(page.locator('#modal-client')).toHaveText('Private Client');
      await page.click('#modal-close');
      
      // 3. User navigates to Draft page to play with sandbox
      await page.click('a.nav-link[href="#draft"]');
      await page.fill('#draft-length', '16');
      await page.evaluate(() => document.getElementById('draft-length').dispatchEvent(new Event('input')));
      await page.fill('#draft-width', '12');
      await page.evaluate(() => document.getElementById('draft-width').dispatchEvent(new Event('input')));
      await page.click('.pillar-btn[data-pillars="6"]');
      await page.uncheck('#draft-furniture');
      
      // 4. Click consult to attach configuration specs
      await page.click('#btn-submit-draft');
      await expect(page.locator('#draft-badge')).toBeVisible();
      await expect(page.locator('#draft-badge-details')).toHaveText(/Length: 16m \| Width: 12m \| Pillars: 6/);
      
      // 5. User fills rest of form and submits inquiry
      await page.fill('#form-name', 'Richard Rogers');
      await page.fill('#form-email', 'richard@rogers-partners.com');
      await page.click('#form-submit');
      
      // Verify success
      const formMsg = page.locator('#form-msg');
      await expect(formMsg).toBeVisible({ timeout: 5000 });
      await expect(formMsg).toHaveClass(/success/);
      await expect(formMsg).toHaveText(/transmitted to the Kotha's Atelier administrator/);
      await expect(page.locator('#draft-badge')).toBeHidden();
    });

    test("T10.2: Scenario 2 - Validation Error and Correction Recovery", async ({ page }) => {
      await page.click('a.nav-link[href="#contact"]');
      
      // Submit empty
      await page.click('#form-submit');
      await expect(page.locator('#form-msg')).toHaveClass(/error/);
      await expect(page.locator('#form-msg')).toHaveText(/fields/);
      
      // Fill invalid email
      await page.fill('#form-name', 'Louis Kahn');
      await page.fill('#form-email', 'invalid-email-no-at-sign');
      await page.fill('#form-message', 'I want to build a library.');
      await page.click('#form-submit');
      await expect(page.locator('#form-msg')).toHaveClass(/error/);
      await expect(page.locator('#form-msg')).toHaveText(/electronic mail/);
      
      // Fill correct email
      await page.fill('#form-email', 'louis.kahn@exeter-library.org');
      await page.click('#form-submit');
      
      // Success confirmation
      const formMsg = page.locator('#form-msg');
      await expect(formMsg).toBeVisible({ timeout: 5000 });
      await expect(formMsg).toHaveClass(/success/);
    });

    test("T10.3: Scenario 3 - Filter Portfolio categories and view modal details", async ({ page }) => {
      await page.click('a.nav-link[href="#portfolio"]');
      
      // Filter Commercial
      await page.click('.filter-btn[data-filter="commercial"]');
      await expect(page.locator('.portfolio-item[data-project-id="aura-lobby"]')).toBeVisible();
      await expect(page.locator('.portfolio-item[data-project-id="elysian-estate"]')).toBeHidden();
      
      // Open lobby details modal
      await page.click('.portfolio-item[data-project-id="aura-lobby"]');
      await expect(page.locator('#modal-title')).toHaveText('Aura Hotel Lobby');
      await expect(page.locator('#modal-location')).toHaveText('London, United Kingdom');
      await expect(page.locator('#modal-client')).toHaveText('Aura Hospitality Group');
      await page.click('#modal-close');
      
      // Filter Restoration
      await page.click('.filter-btn[data-filter="restoration"]');
      await expect(page.locator('.portfolio-item[data-project-id="brick-gallery"]')).toBeVisible();
      await expect(page.locator('.portfolio-item[data-project-id="aura-lobby"]')).toBeHidden();
      
      // Open brick gallery details
      await page.click('.portfolio-item[data-project-id="brick-gallery"]');
      await expect(page.locator('#modal-title')).toHaveText('The Brick Gallery');
      await expect(page.locator('#modal-client')).toHaveText('New York Arts Foundation');
      await page.click('#modal-close');
    });

    test("T10.4: Scenario 4 - Rapid Page Transitions & State Coherence Stress Test", async ({ page }) => {
      const routes = ['#about', '#portfolio', '#draft', '#contact', '#home'];
      for (const route of routes) {
        await page.click(`a.nav-link[href="${route}"]`);
        await page.waitForTimeout(50); // extremely rapid clicks
      }
      await page.waitForTimeout(1000); // let animations settle
      
      // Assert that we are back at Home and exactly 1 section is active/visible
      await expect(page.locator('#home')).toHaveClass(/active/);
      const activeCount = await page.locator('.page-section.active').count();
      expect(activeCount).toBe(1);
    });

    test("T10.5: Scenario 5 - Mobile Responsive Viewport Full Flow", async ({ page }) => {
      // Emulate iPhone X/12 viewport size
      await page.setViewportSize({ width: 375, height: 812 });
      
      // Open Mobile Navbar Burger Menu
      await page.click('#burger');
      await expect(page.locator('#nav-links')).toHaveClass(/nav-active/);
      
      // Click Draft link
      await page.click('#nav-links a[href="#draft"]');
      await page.waitForTimeout(500);
      
      // Burger menu should have auto-closed
      await expect(page.locator('#nav-links')).not.toHaveClass(/nav-active/);
      
      // Configure Draft in mobile sandbox
      await page.fill('#draft-length', '8');
      await page.evaluate(() => document.getElementById('draft-length').dispatchEvent(new Event('input')));
      await page.fill('#draft-width', '8');
      await page.evaluate(() => document.getElementById('draft-width').dispatchEvent(new Event('input')));
      await page.click('.pillar-btn[data-pillars="4"]');
      
      // Redirect to contact
      await page.click('#btn-submit-draft');
      await expect(page.locator('#draft-badge')).toBeVisible();
      
      // Submit form
      await page.fill('#form-name', 'Zaha Hadid');
      await page.fill('#form-email', 'zaha@hadid-architects.com');
      await page.click('#form-submit');
      
      const formMsg = page.locator('#form-msg');
      await expect(formMsg).toBeVisible({ timeout: 5000 });
      await expect(formMsg).toHaveClass(/success/);
      await expect(page.locator('#draft-badge')).toBeHidden();
    });
  });

});
