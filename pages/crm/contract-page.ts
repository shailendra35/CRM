import {Page, expect} from '@playwright/test';

export class ContractPage {
  constructor(public page: Page) {}

async openContractFromCommandBar() {
  await this.page.getByRole('button',{name: 'Create', exact: true}).click();
    await this.page.getByRole('menuitem', { name: 'Contract' }).click();

}};
