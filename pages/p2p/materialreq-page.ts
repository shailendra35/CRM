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

}