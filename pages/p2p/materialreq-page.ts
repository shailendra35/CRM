import { existsSync, mkdirSync, readFileSync, writeFileSync } from 'node:fs';
import { join } from 'node:path';
import { Page, expect } from '@playwright/test';

export class MaterialReqPage {
  constructor(public page: Page) {}

  async materialRequestfromCommandBar() {
    await this.page.getByRole('button', { name: /search/i }).click();
    await this.page.getByRole('combobox', { name: /search or type a command/i }).fill('Material Request List');
    await this.page.getByRole('link', { name: /Material Request List/i, exact:true }).first().click();

  }

  async createMaterialRequest() {
    await this.page.getByRole('button', { name: 'Add Material Request', exact: true }).click();
  }

  async addRequiredByDate() {

    const reqByDate = new Date();
    reqByDate.setDate(reqByDate.getDate() + 1);
    const yyyy = reqByDate.getFullYear();
    const mm = String(reqByDate.getMonth() + 1).padStart(2, '0');
    const dd = String(reqByDate.getDate()).padStart(2, '0');
    const formattedDate = `${yyyy}-${mm}-${dd}`;

    const datePicker = this.page.getByRole('application', { name: /Calendar/ });
    await this.page.locator('.frappe-control[data-fieldname="schedule_date"] input').first().click();

    const adToggle = datePicker.getByRole('button', { name: 'AD', exact: true });
    if ((await adToggle.getAttribute('aria-pressed')) === 'false') {
      await adToggle.click();
    }

    const targetDate = datePicker.getByRole('gridcell', {
      name: new RegExp(`AD ${formattedDate}`),
    });
    for (let month = 0; month < 3 && (await targetDate.count()) === 0; month++) {
      await datePicker.getByRole('button', { name: 'Next Month' }).click();
    }
    await expect(targetDate).toBeVisible();
    await targetDate.click();
  }


async addItem(itemName: string, quantity: number) {
  const items = this.page.locator('[data-fieldname="items"]');
  await expect(items.getByRole('button', { name: 'Add row', exact: true })).toBeVisible(); // grid rendered

  // Material Request opens with one empty row; add one only if there isn't one
  if ((await items.locator('.grid-body .grid-row').count()) === 0) {
    await items.getByRole('button', { name: 'Add row', exact: true }).click();
  }
  const row = items.locator('.grid-body .grid-row').last();

  const itemInput = row.locator('input[data-fieldname="item_code"]');
  if (!(await itemInput.isVisible())) {
    await row.locator('.grid-static-col[data-fieldname="item_code"]').click();
  }
  await expect(itemInput).toBeVisible();
  await itemInput.fill(itemName);

  await expect(this.page.getByRole('option', { name: itemName }).first()).toBeVisible();
  await itemInput.press('Enter');
  await expect(itemInput).toHaveValue(new RegExp(itemName));

  const qtyInput = row.locator('input[data-fieldname="qty"]');
  const qtyStatic = row.locator('.grid-static-col[data-fieldname="qty"]');
  // ...your quantity block stays as it is
  await expect(async () => {
    if (!(await qtyInput.isVisible())) {
      await qtyStatic.click({ timeout: 2000 });
      }
      await qtyInput.fill(quantity.toString());
    }).toPass({timeout: 15_000 });

    await qtyInput.press('Enter');
}

async expectRequiredByInRows() {
  const row = this.page.locator('[data-fieldname="items"] .grid-body .grid-row').last();
  await expect(row.locator('.grid-static-col[data-fieldname="schedule_date"]'))
    .toContainText(/\d{2}-\d{2}-\d{4}/);
}

  // async addItem(itemName: string, quantity: number) {
  //   const items = this.page.locator('[data-fieldname="items"]');

  //   const row = items.locator('.grid-body .grid-row').last();

  //   const itemInput = row.locator('input[data-fieldname="item_code"]');
  //   await itemInput.fill(itemName);
  //   await expect(this.page.getByRole('option', { name: itemName }).first()).toBeVisible();
  //   await itemInput.press('Enter');
  //   await expect(itemInput).toHaveValue(new RegExp(itemName));   // confirms the selection stuck

  //   const qtyInput = row.locator('input[data-fieldname="qty"]');
  //   const qtyStatic = row.locator('.grid-static-col[data-fieldname="qty"]');

  //   // The row may be in edit mode or collapsed after the item is selected; handle both.
  //   await expect(async () => {
  //     if (!(await qtyInput.isVisible())) {
  //       await qtyStatic.click({ timeout: 2000 });
  //     }
  //     await qtyInput.fill(quantity.toString());
  //   }).toPass({timeout: 15_000 });

  //   await qtyInput.press('Enter');
  // }

  async clickSaveButton() {
    const saveButton = this.page.getByRole('button', { name: 'Save', exact: true });
    await expect(saveButton).toBeEnabled();
    await saveButton.click();
    await expect(this.page).not.toHaveURL(/new-material-request/, { timeout: 15000 });
  }

  async clickSubmitButton() {
    const submitButton = this.page.getByRole('button', { name: 'Submit', exact: true });
    await expect(submitButton).toBeEnabled();
    await submitButton.click();
    await this.page.getByRole('button', { name: 'Yes', exact: true }).click();
    await this.page.waitForTimeout(2000);

  }
}