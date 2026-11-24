import {Page, expect} from '@playwright/test';

export class SalesOrderPage {
  constructor(public page: Page) {}

  async convertQuotationToSalesOrder(){
    await this.page.getByRole('button', {name: 'Create', exact: true}).click();
    await this.page.getByRole('menuitem', { name: 'Create Sales Order' }).click();
    await this.page.getByRole('button', { name: 'Yes' }).click();
  }

  async clickSubmitButton() {
    await this.page.getByRole('button', { name: 'Submit' }).click();
    await this.page.getByRole('button', { name: 'Yes' }).click();
    await this.page.waitForTimeout(2000);
}};