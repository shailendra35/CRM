import { test as base, expect } from '@playwright/test';
import { LoginPage } from './pages/loginpage';
import { CRMPage } from './pages/crm/crm-page';
import { LeadPage } from './pages/crm/lead-page';
import { OpportunityPage } from './pages/crm/opportunity-page';
import { QuotationPage } from './pages/crm/quotation-page';
import { SalesOrderPage } from './pages/crm/salesorder-page';
import { SalesInvoicePage } from './pages/crm/salesinvoice-page';



type Pages = {
  loginPage: LoginPage;
  crmPage: CRMPage;
  leadPage: LeadPage;
  opportunityPage: OpportunityPage;
  quotationPage: QuotationPage;
  salesorderPage: SalesOrderPage;
  salesinvoicePage: SalesInvoicePage;
};

export const test = base.extend<Pages>({
  loginPage: async ({ page }, use) => {
    await use(new LoginPage(page));
  },
  crmPage: async ({ page }, use) => {
    await use(new CRMPage(page));
  },
  leadPage: async ({ page }, use) => {
    await use(new LeadPage(page));
  },

  opportunityPage: async ({ page }, use) => {
    await use(new OpportunityPage(page));
  },

  quotationPage: async ({ page }, use) => {
    await use(new QuotationPage(page));
  },
  salesorderPage: async ({ page }, use) => {
    await use(new SalesOrderPage(page));
  },
  salesinvoicePage: async ({ page }, use) => {
    await use(new SalesInvoicePage(page));
  }
});

export { expect } from '@playwright/test';