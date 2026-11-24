import { Page } from '@playwright/test';

export class CRMPage {
  constructor(private readonly page: Page) {}

  async gotoDashboard() {
    await this.page.goto(new URL('/desk', process.env.BASE_URL).toString());
  }

  async openCRMFromCommandBar() {
    await this.page.getByRole('button', { name: /search/i }).click();
    await this.page.getByRole('combobox', { name: /search or type a command/i }).fill('crm');
    await this.page.getByRole('link', { name: /open crm/i }).click();
  }

  async openModule(moduleName: string) {
    const aliases: Record<string, string> = {
      customers: 'Customer',
      customer: 'Customer',
      leads: 'Lead',
      lead: 'Lead',
      deals: 'Opportunity',
      deal: 'Opportunity',
      opportunities: 'Opportunity',
      opportunity: 'Opportunity',
    };

    const label = aliases[moduleName.toLowerCase()] ?? moduleName;
    await this.page.getByRole('link', { name: new RegExp(label, 'i') }).click();
  }

  async navigateTo(sectionName: string) {
    await this.page.getByRole('link', { name: sectionName }).click();
    await this.page.waitForLoadState('networkidle');
  }
}
