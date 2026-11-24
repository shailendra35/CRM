import { Page, Locator, expect } from '@playwright/test';

export class QuotationPage {
  constructor(public page: Page) {}

  async convertOpportunityToQuotation() {
    const createButton = this.page.getByRole('button', { name: 'Create', exact: true });
    setTimeout(() => {}, 2000); // Wait for the create action to complete
    const quotationItem = this.page.getByRole('menuitem', { name: 'Quotation', exact: true });

    // Open the menu only if it isn't already open
    if (!(await quotationItem.isVisible())) {
      await createButton.click();
    }

    await quotationItem.click();
    await expect(
      this.page.getByRole('navigation', { name: 'Breadcrumb' }).getByText('New Quotation'),
    ).toBeVisible();
  }
  /*async convertOpportunityToQuotation() {
    const createButtonQT = this.page.getByRole('button', { name: 'Create' });
    await createButtonQT.click();
    await this.page.getByRole('menuitem', { name: 'Quotation' }).click();
    await expect(
      this.page.getByRole('navigation', { name: 'Breadcrumb' }).getByText('New Quotation'),
    ).toBeVisible();
  }*/

private async activateCell(row: Locator, fieldname: string) {
  const input = row.locator(`input[data-fieldname="${fieldname}"]`);
  if (!(await input.isVisible())) {
    await row.locator(`.grid-static-col[data-fieldname="${fieldname}"]`).click();
  }
  await expect(input).toBeVisible();
  return input;
}

async addItem(itemName: string, quantity: number) {
  const items = this.page.locator('[data-fieldname="items"]');
  await items.getByRole('button', { name: 'Add row', exact: true }).click();

  const row = items.locator('.grid-body .grid-row').last();

  const itemInput = row.locator('input[data-fieldname="item_code"]');
  await itemInput.fill(itemName);
  await expect(this.page.getByRole('option', { name: itemName }).first()).toBeVisible();
  await itemInput.press('Enter');
  await expect(itemInput).toHaveValue(new RegExp(itemName));   // confirms the selection stuck
  // await row.locator('input[data-fieldname="item_code"]').fill(itemName);
  // await this.page.getByRole('option', { name: itemName }).first().click();

  const qtyInput = row.locator('input[data-fieldname="qty"]');
  const qtyStatic = row.locator('.grid-static-col[data-fieldname="qty"]');

  // The row may be in edit mode or collapsed after the item is selected; handle both.
  await expect(async () => {
    if (!(await qtyInput.isVisible())) {
      await qtyStatic.click({ timeout: 2000 });
    }
    await qtyInput.fill(quantity.toString(), { timeout: 2000 });
  }).toPass({ timeout: 15_000 });

  await qtyInput.press('Tab'); // commit so Rate and Amount recalculate
  await expect(row.locator('input[data-fieldname="amount"], .grid-static-col[data-fieldname="amount"]').first())
    .toContainText(/\d/); // optional: confirms the row recalculated
}

async ignorePopup() {
  const popup = this.page
    .getByRole('dialog')
    .filter({ has: this.page.getByRole('heading', { name: 'Opportunity Updated' }) });

  try {
    await popup.waitFor({ state: 'visible', timeout: 5000 });
  } catch {
    return; // popup didn't appear this run
  }
  await popup.getByRole('button', { name: 'Close' }).click();
  await expect(popup).toBeHidden();
}

  async addQuotationTemplate(){
    this.page.locator('.frappe-control').filter({ hasText: 'Quotation Template' }).locator('input').fill('Dataworld Quotation Template');
    await this.page.getByRole('option', { name: 'Dataworld Quotation Template' }).click();
  }

  async clickSaveButton() {
    await this.page.getByRole('button', { name: 'Save' }).click();
  }

  async clickSubmitButton() {
    await this.page.getByRole('button', {name: 'Actions', exact: true}).click();
    await this.page.getByRole('menuitem', { name: 'Submit' }).click();
    setTimeout(() => {}, 2000); // Wait for the submission to process 
  }

  async sendToCustomer(){
    const ActionsButton = this.page.getByRole('button', { name: 'Actions', exact: true });
    await ActionsButton.click();
    setTimeout(() => {}, 2000); // Wait for the send action to complete
    const sendToCustomerButton = this.page.getByRole('menuitem', { name: 'Send to Customer', exact: true });
    await sendToCustomerButton.click();
    setTimeout(() => {}, 10000); // Wait for the send action to complete
    await this.page.getByRole('button', { name: 'Send', exact: true }).click();
  }

  async approvedByCustomer(){
    await this.page.getByRole('button', {name: 'Actions', exact: true}).click();
    await this.page.getByRole('menuitem', { name: 'Approved by Customer' }).click();
    await this.page.getByRole('textbox').fill('Approved');
    await this.page.getByRole('button', { name: 'Submit' }).click();
  }
}

function timeout(arg0: number) {
  throw new Error('Function not implemented.');
}
