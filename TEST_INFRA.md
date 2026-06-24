# E2E Test Infra: Kotha's Atelier Mobile Adjustment

## Test Philosophy
- Opaque-box, requirement-driven. No dependency on implementation design.
- Methodology: Category-Partition + BVA + Pairwise + Workload Testing.

## Feature Inventory
| # | Feature | Source (requirement) | Tier 1 | Tier 2 | Tier 3 |
|---|---------|---------------------|:------:|:------:|:------:|
| 1 | Hide Sandbox on Mobile | ORIGINAL_REQUEST R1 | 5 | 5 | ✓ |
| 2 | WebGL Mobile Rewrite | ORIGINAL_REQUEST R2 | 5 | 5 | ✓ |
| 3 | Responsive Layout & Typography | ORIGINAL_REQUEST R3 | 5 | 5 | ✓ |
| 4 | Update Logo Brand | ORIGINAL_REQUEST R4 | 5 | 5 | ✓ |
| 5 | Hero Image to Video Swap | ORIGINAL_REQUEST R5 | 5 | 5 | ✓ |

## Test Architecture
- Test runner: Playwright (`npx playwright test`) running against local server `http://localhost:8089`.
- Directory layout: tests under `./tests/`.
- Playwright config: `playwright.config.js`.

## Real-World Application Scenarios (Tier 4)
| # | Scenario | Features Exercised | Complexity |
|---|----------|--------------------|------------|
| 1 | Mobile Viewport Experience | Sandbox hidden, WebGL responsive, responsive typography, logo check, video loop | High |
| 2 | Desktop Viewport Experience | Sandbox visible, WebGL responsive, logo check, video loop | Medium |
| 3 | Tablet Viewport Experience | Transition bounds at 768px, layout checking, responsive typography | Medium |
| 4 | Small Phone Experience | Layout down to 375px wide, typography scale, no horizontal scrollbars | High |
| 5 | Orientation Change Scenario | WebGL bounds adaptation when switching aspect ratios | High |

## Coverage Thresholds
- Tier 1 (Feature Coverage): ≥5 tests per feature (total ≥25)
- Tier 2 (Boundary & Corner Cases): ≥5 tests per feature (total ≥25)
- Tier 3 (Cross-Feature Combinations): pairwise coverage of major features (total ≥5)
- Tier 4 (Real-World Application Scenarios): ≥5 realistic application scenarios
- Total minimum test cases: ~60 tests/checks.
