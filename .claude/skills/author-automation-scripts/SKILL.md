---
name: author-automation-scripts
description: Author Playwright automation scripts using a clean code structure, the Page Object Model (POM), and data-driven testing with JSON fixtures. Use when the user asks to write, scaffold, or generate automated UI/E2E test scripts.
---

# Author Automation Scripts (POM + Data-Driven)

Produce maintainable Playwright automation code that separates concerns cleanly: locators and actions live in Page Objects, test data lives in JSON, and spec files only describe behavior.

## Inputs to gather
- Feature / user flow under automation
- Target URL(s) and environment
- Pages / screens involved
- Test data variants (valid, invalid, boundary) — or ask to derive from acceptance criteria
- Existing project conventions (TypeScript vs JS, base URL, auth setup)

## Required project structure
```
tests/
  specs/                 # *.spec.ts — behavior only, no selectors
  pages/                 # one class per page/component
    BasePage.ts
    LoginPage.ts
  data/                  # JSON fixtures, one file per feature
    login.data.json
  fixtures/              # Playwright test fixtures (custom test extends)
    test-fixtures.ts
  utils/                 # helpers: api clients, data loaders, generators
    dataLoader.ts
playwright.config.ts
```

Create any missing directory before writing files.

## Clean-code rules (enforce in every file you generate)
1. **No selectors in specs** — all locators belong on Page Objects as `readonly` properties initialized in the constructor.
2. **No `page.waitForTimeout`** — rely on Playwright auto-waiting and web-first assertions (`expect(locator).toBeVisible()`).
3. **One responsibility per method** — Page Object methods either *act* (`login(user)`) or *query* (`getErrorText()`), never both silently.
4. **No hardcoded data in specs or pages** — read from JSON via the data loader.
5. **Descriptive names** — `LoginPage.submitWithInvalidPassword()` beats `LoginPage.test2()`.
6. **Prefer role/label locators** (`getByRole`, `getByLabel`) over CSS/XPath. CSS only as a last resort with a comment explaining why.
7. **No `console.log` in committed code** — use `test.step()` for traceability instead.
8. **Async/await everywhere** — never mix `.then()` chains.

## Templates

### `tests/pages/BasePage.ts`
```ts
import { Page, expect } from '@playwright/test';

export abstract class BasePage {
  constructor(protected readonly page: Page) {}

  async goto(path = '/') {
    await this.page.goto(path);
  }

  async expectUrlContains(fragment: string) {
    await expect(this.page).toHaveURL(new RegExp(fragment));
  }
}
```

### `tests/pages/LoginPage.ts` (example)
```ts
import { Page, Locator } from '@playwright/test';
import { BasePage } from './BasePage';

export class LoginPage extends BasePage {
  readonly username: Locator;
  readonly password: Locator;
  readonly submit: Locator;
  readonly errorBanner: Locator;

  constructor(page: Page) {
    super(page);
    this.username = page.getByLabel('Username');
    this.password = page.getByLabel('Password');
    this.submit = page.getByRole('button', { name: 'Sign in' });
    this.errorBanner = page.getByRole('alert');
  }

  async login(user: { username: string; password: string }) {
    await this.username.fill(user.username);
    await this.password.fill(user.password);
    await this.submit.click();
  }
}
```

### `tests/data/login.data.json` (example)
```json
{
  "validUsers": [
    { "case": "standard user", "username": "std_user", "password": "Passw0rd!" }
  ],
  "invalidUsers": [
    { "case": "wrong password", "username": "std_user", "password": "nope", "expectedError": "Invalid credentials" },
    { "case": "empty username", "username": "",         "password": "Passw0rd!", "expectedError": "Username is required" }
  ]
}
```

### `tests/utils/dataLoader.ts`
```ts
import { readFileSync } from 'node:fs';
import { resolve } from 'node:path';

export function loadJson<T>(relativePath: string): T {
  const full = resolve(process.cwd(), 'tests/data', relativePath);
  return JSON.parse(readFileSync(full, 'utf-8')) as T;
}
```

### `tests/fixtures/test-fixtures.ts`
```ts
import { test as base } from '@playwright/test';
import { LoginPage } from '../pages/LoginPage';

type Pages = { loginPage: LoginPage };

export const test = base.extend<Pages>({
  loginPage: async ({ page }, use) => {
    await use(new LoginPage(page));
  },
});
export { expect } from '@playwright/test';
```

### `tests/specs/login.spec.ts` (data-driven)
```ts
import { test, expect } from '../fixtures/test-fixtures';
import { loadJson } from '../utils/dataLoader';

type LoginData = {
  validUsers: { case: string; username: string; password: string }[];
  invalidUsers: { case: string; username: string; password: string; expectedError: string }[];
};

const data = loadJson<LoginData>('login.data.json');

test.describe('Login', () => {
  for (const user of data.validUsers) {
    test(`valid login — ${user.case}`, async ({ loginPage, page }) => {
      await loginPage.goto('/login');
      await loginPage.login(user);
      await expect(page).toHaveURL(/dashboard/);
    });
  }

  for (const user of data.invalidUsers) {
    test(`invalid login — ${user.case}`, async ({ loginPage }) => {
      await loginPage.goto('/login');
      await loginPage.login(user);
      await expect(loginPage.errorBanner).toHaveText(user.expectedError);
    });
  }
});
```

## Workflow you should follow
1. Confirm the feature, pages, and data variants with the user.
2. Scaffold any missing directories from the structure above.
3. Generate / extend the Page Object(s) — never duplicate selectors across files.
4. Generate the JSON fixture with named `case` fields for readable test titles.
5. Generate the spec using the data-driven loop pattern.
6. Run `npx playwright test --list` to validate the suite parses, then run the new spec.
7. Report what was created and the command to execute it.

## Quality checklist before finishing
- [ ] Specs contain zero selectors and zero literal credentials/URLs.
- [ ] Each Page Object exposes locators as `readonly` fields, methods are action- or query-only.
- [ ] JSON file covers happy path + at least one negative + one boundary case.
- [ ] Test titles include the `case` label so failures are self-explanatory.
- [ ] No `waitForTimeout`, no `console.log`, no `.then()` chains.
- [ ] `npx playwright test --list` succeeds.

## Deliverable
Updated `tests/` tree containing the new Page Object(s), JSON fixture, and spec, plus a short message to the user listing the new files and the run command.
