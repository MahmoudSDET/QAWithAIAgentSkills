import { expect, Locator, Page } from '@playwright/test';
import { BasePage } from './BasePage';

export type RegistrationUser = {
  title: string;
  firstName: string;
  lastName: string;
  password: string;
  company: string;
  address1: string;
  address2: string;
  country: string;
  state: string;
  city: string;
  zipCode: string;
  mobileNumber: string;
};

export class AuthPage extends BasePage {
  readonly signupNameInput: Locator;
  readonly signupEmailInput: Locator;
  readonly signupButton: Locator;
  readonly accountInformationHeading: Locator;
  readonly titleMrRadio: Locator;
  readonly titleMrsRadio: Locator;
  readonly passwordInput: Locator;
  readonly firstNameInput: Locator;
  readonly lastNameInput: Locator;
  readonly companyInput: Locator;
  readonly address1Input: Locator;
  readonly address2Input: Locator;
  readonly countrySelect: Locator;
  readonly stateInput: Locator;
  readonly cityInput: Locator;
  readonly zipCodeInput: Locator;
  readonly mobileNumberInput: Locator;
  readonly createAccountButton: Locator;
  readonly accountCreatedHeading: Locator;
  readonly continueButton: Locator;

  constructor(page: Page) {
    super(page);
    this.signupNameInput = page.locator('input[data-qa="signup-name"]');
    this.signupEmailInput = page.locator('input[data-qa="signup-email"]');
    this.signupButton = page.locator('button[data-qa="signup-button"]');
    this.accountInformationHeading = page.getByRole('heading', { name: /enter account information/i });
    this.titleMrRadio = page.locator('#id_gender1');
    this.titleMrsRadio = page.locator('#id_gender2');
    this.passwordInput = page.locator('input[data-qa="password"]');
    this.firstNameInput = page.locator('input[data-qa="first_name"]');
    this.lastNameInput = page.locator('input[data-qa="last_name"]');
    this.companyInput = page.locator('input[data-qa="company"]');
    this.address1Input = page.locator('input[data-qa="address"]');
    this.address2Input = page.locator('input[data-qa="address2"]');
    this.countrySelect = page.locator('select[data-qa="country"]');
    this.stateInput = page.locator('input[data-qa="state"]');
    this.cityInput = page.locator('input[data-qa="city"]');
    this.zipCodeInput = page.locator('input[data-qa="zipcode"]');
    this.mobileNumberInput = page.locator('input[data-qa="mobile_number"]');
    this.createAccountButton = page.locator('button[data-qa="create-account"]');
    this.accountCreatedHeading = page.getByRole('heading', { name: /account created!/i });
    this.continueButton = page.locator('a[data-qa="continue-button"]');
  }

  async startSignup(name: string, email: string) {
    await this.signupNameInput.fill(name);
    await this.signupEmailInput.fill(email);
    await this.signupButton.click();
  }

  async fillAccountDetails(user: RegistrationUser) {
    if (user.title.toLowerCase() === 'mrs') {
      await this.titleMrsRadio.check();
    } else {
      await this.titleMrRadio.check();
    }

    await this.passwordInput.fill(user.password);
    await this.firstNameInput.fill(user.firstName);
    await this.lastNameInput.fill(user.lastName);
    await this.companyInput.fill(user.company);
    await this.address1Input.fill(user.address1);
    await this.address2Input.fill(user.address2);
    await this.countrySelect.selectOption(user.country);
    await this.stateInput.fill(user.state);
    await this.cityInput.fill(user.city);
    await this.zipCodeInput.fill(user.zipCode);
    await this.mobileNumberInput.fill(user.mobileNumber);
  }

  async createAccount() {
    await this.createAccountButton.click();
  }

  async continueAfterAccountCreation() {
    await this.continueButton.click();
  }

  async expectAccountInformationStep() {
    await expect(this.accountInformationHeading).toBeVisible();
  }

  async expectAccountCreated() {
    await expect(this.accountCreatedHeading).toBeVisible();
  }
}
