---
name: install-playwright-allure
description: Install and configure Playwright (with browsers) and Allure reporting in a Node.js/TypeScript project. Use when the user asks to set up, install, scaffold, or bootstrap Playwright and/or Allure for test automation.
---

# Install Playwright + Allure Report

Set up Playwright (test runner + browsers) and Allure reporting in the current project so the user can author and run automated tests with rich HTML reports.

## Inputs to gather (ask only if not obvious)
- Package manager: npm / yarn / pnpm (default: npm)
- Language: TypeScript or JavaScript (default: TypeScript)
- Browsers to install: chromium / firefox / webkit / all (default: all)
- Whether to overwrite an existing `playwright.config.*` (default: no — confirm first)

## Preflight checks
1. Verify `node --version` (>= 18) and the chosen package manager are available.
2. Detect existing `package.json`. If missing, run `npm init -y` (or equivalent).
3. Detect existing Playwright / Allure install and report versions; ask before upgrading.

## Install steps

### 1. Playwright
```bash
npm init playwright@latest -- --quiet --browser=all --install-deps
```
If `init playwright` is not desired (existing project), instead:
```bash
npm i -D @playwright/test
npx playwright install --with-deps
```

### 2. Allure for Playwright
```bash
npm i -D allure-playwright allure-commandline
```

### 3. Wire Allure into `playwright.config.ts`
Add the reporter:
```ts
reporter: [
  ['list'],
  ['allure-playwright', { detail: true, suiteTitle: false, outputFolder: 'allure-results' }],
],
```

### 4. Add npm scripts to `package.json`
```json
{
  "scripts": {
    "test": "playwright test",
    "test:headed": "playwright test --headed",
    "allure:generate": "allure generate allure-results --clean -o allure-report",
    "allure:open": "allure open allure-report",
    "allure:serve": "allure serve allure-results"
  }
}
```

### 5. `.gitignore` additions
```
node_modules/
test-results/
playwright-report/
allure-results/
allure-report/
```

### 6. Sample smoke test (only if `tests/` is empty)
Create `tests/smoke.spec.ts`:
```ts
import { test, expect } from '@playwright/test';

test('homepage has title', async ({ page }) => {
  await page.goto('https://playwright.dev/');
  await expect(page).toHaveTitle(/Playwright/);
});
```

## Verification
After install, run:
```bash
npx playwright --version
npx allure --version
npm test
npm run allure:generate && npm run allure:open
```
Confirm the Allure HTML report renders with the smoke test result.

## Deliverable
- Updated `package.json` with deps and scripts
- `playwright.config.ts` with Allure reporter wired in
- `.gitignore` entries for generated folders
- A short summary message to the user with the commands to run tests and view the report
