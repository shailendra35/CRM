import {Page, expect} from '@playwright/test';

export class OpportunityPage {
  constructor(public page: Page) {}

  async convertLeadToOpportunity() {
    const createButton = this.page.getByRole('button', { name: 'Create', exact: true });
    await createButton.click();

    await this.page.getByRole('menuitem', { name: 'Opportunity' }).click();
    await this.page.getByRole('button', { name: 'Yes' }).click();

    await this.page.getByRole('button', { name: 'Save' }).click();
    setTimeout(() => {}, 2000); // Wait for the save action to complete

    await expect(this.page).toHaveURL(/\/desk\/crm\/opportunity\/CRM-OPP-\d{4}-\d+\/?$/);
    await expect(this.page.getByText('Created By You', { exact: false })).toBeVisible();
  }
}
