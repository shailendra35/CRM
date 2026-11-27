import {Page, expect} from '@playwright/test';

export class SalesInvoicePage {
  constructor(public page: Page) {}

    async convertSalesOrderToSalesInvoice() {
        await this.page.getByRole('button', {name: 'Create', exact: true}).click();
        await this.page.getByRole('menuitem', { name: 'Sales Invoice' }).click();
        await this.page.getByRole('button', { name: 'No' }).click();
        await this.page.waitForTimeout(2000); // Wait for the action to complete
    }

    async contractRequired() {
        await this.page.getByRole('checkbox',{name: 'Is Contract Required'}).check();
    }

    async contractNotRequired() {
        await this.page.getByRole('checkbox',{name: 'Is Contract Required'}).uncheck();
    }

    async accountingDetails() {
    await this.page.getByRole('tab', { name: 'More Info' }).click();

    const debitTo = this.page.locator('input[data-fieldname="debit_to"]');
    const section = this.page.getByText('Accounting Details', { exact: true });

    await expect(section).toBeVisible();                       // More Info panel has rendered
    if (!(await debitTo.isVisible())) await section.click();   // expand only if collapsed
    await expect(debitTo).toBeVisible();

    await debitTo.fill('Debtors - DWPL');
    await expect(this.page.getByRole('option', { name: 'Debtors - DWPL' })).toBeVisible();
    await debitTo.press('Enter');                               // pick the highlighted match
    await expect(debitTo).toHaveValue('Debtors - DWPL');        // confirms the selection stuck
    }

    async clickSaveButton(){
        await this.page.getByRole('button', { name: 'Save' }).click();
        await this.page.waitForTimeout(2000); // Wait for the submission to process

    }

    async clickSubmitButton() {
        await this.page.getByRole('button', { name: 'Submit' }).click();
        setTimeout(() => {}, 2000); // Wait for the submission to process
    }

}