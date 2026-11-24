import { existsSync, mkdirSync, readFileSync, writeFileSync } from 'node:fs';
import { join } from 'node:path';
import { Page, expect } from '@playwright/test';

function nextMobileSequence(initialValue: string) {
  const outputDirectory = join(process.cwd(), 'playwright', '.cache');
  const counterFile = join(outputDirectory, 'lead-mobile-sequence.txt');
  mkdirSync(outputDirectory, { recursive: true });

  const savedValue = existsSync(counterFile)
    ? Number(readFileSync(counterFile, 'utf8'))
    : Number(initialValue);
  const currentValue = Number.isInteger(savedValue) && savedValue >= 100_000 && savedValue < 1_000_000
    ? savedValue
    : Number(initialValue);
  const nextValue = currentValue >= 999_999 ? 100_000 : currentValue + 1;

  writeFileSync(counterFile, String(nextValue), 'utf8');
  return String(nextValue).padStart(6, '0');
}

type LeadData = {
  firstName: string;
  middleName: string;
  lastName: string;
  email: string;
  mobileNo: string;
};

export class LeadPage {
  constructor(private readonly page: Page) {}

  // ----Navigation----
  async gotoLeadPage() {
    await this.page.goto(new URL('/desk/setup/lead', process.env.BASE_URL).toString());
  }

  async openLeadFromCommandBar() {
    await this.page.getByRole('button', { name: /search/i }).click();
    await this.page.getByRole('combobox', { name: /search or type a command/i }).fill('lead');
    await this.page.getByRole('link', { name: 'Lead List', exact: true }).first().click();
  }

  async openModule(moduleName: string) {
    await this.page.getByRole('link', { name: new RegExp(`^${moduleName}$`, 'i') }).first().click();
  }

  async clickAddLeadButton() {
    await this.page.getByRole('button', { name: 'Add Lead' }).click();
  }

  // ----Create Lead: fills the form only, does not save----
  async createLead(leadData: LeadData) {
    const uniqueEmail = `lead${Date.now()}@example.com`;
    const uniquePhone = `9861${nextMobileSequence(leadData.mobileNo)}`;

    await this.page
      .locator('form')
      .filter({ hasText: '__newname Lead Type' })
      .getByRole('combobox')
      .selectOption({ label: 'Business' });

    await this.page.locator('form').filter({ hasText: 'Organization Name Begin' }).getByRole('combobox').click();
    await this.page.getByRole('tabpanel', { name: 'Details' }).getByText('Testing Organisation', { exact: true }).click();

    // Expected close date: 30 days from today, built from LOCAL date parts
    // (toISOString() uses UTC, which is the previous day in Nepal before ~05:45)
    const closeDate = new Date();
    closeDate.setDate(closeDate.getDate() + 30);
    const yyyy = closeDate.getFullYear();
    const mm = String(closeDate.getMonth() + 1).padStart(2, '0');
    const dd = String(closeDate.getDate()).padStart(2, '0');
    const formattedCloseDate = `${yyyy}-${mm}-${dd}`;

    const datePicker = this.page.getByRole('application', { name: /Calendar/ });
    await this.page.locator('[data-fieldname="follow_up_date"] input').click();

    const adToggle = datePicker.getByRole('button', { name: 'AD', exact: true });
    if ((await adToggle.getAttribute('aria-pressed')) !== 'true') {
      await adToggle.click();
    }

    const targetDate = datePicker.getByRole('gridcell', {
      name: new RegExp(`AD ${formattedCloseDate}`),
    });
    for (let month = 0; month < 3 && (await targetDate.count()) === 0; month++) {
      await datePicker.getByRole('button', { name: 'Next month' }).click();
    }
    await targetDate.click();

    await this.page.locator('[data-fieldname="first_name"] input').fill(leadData.firstName);
    await this.page.locator('[data-fieldname="middle_name"] input').fill(leadData.middleName);
    await this.page.locator('[data-fieldname="last_name"] input').fill(leadData.lastName);
    await this.page.locator('[data-fieldname="email_id"] input').fill(uniqueEmail);
    await this.page.locator('[data-fieldname="mobile_no"] input').fill(uniquePhone);
    await this.page.locator('[data-fieldname="address1"] input').fill('Tripureshowr');

    const pincode = this.page.locator('[data-fieldname="pincode"] input');
    await pincode.fill('12345');
    await pincode.press('Tab'); // commit the last field so the Save click isn't swallowed

    return { email: uniqueEmail, mobile: uniquePhone };
  }

  // ----Save: returns the new lead's ID (e.g. CRM-LEAD-2026-00066)----
  async clickSaveButton() {
    const saveButton = this.page.getByRole('button', { name: 'Save', exact: true });
    await expect(saveButton).toBeEnabled();
    await saveButton.click();

    await expect(this.page).toHaveURL(/\/lead\/CRM-LEAD-\d+/, { timeout: 15000 });
    // Saved-form signal: these tabs only exist after the lead is saved
    await expect(this.page.getByRole('tab', { name: 'Connections' })).toBeVisible();

    return this.page.url().match(/CRM-LEAD-[\d-]+/)?.[0] ?? '';
  }

  async dismissDuplicateDialog() {
    const dialog = this.page.getByRole('dialog')
      .filter({ hasText: 'Possible duplicate found' });

    if (await dialog.isVisible()) {
      await dialog.getByRole('button').first().click();
      await expect(dialog).toBeHidden();
    }
}};