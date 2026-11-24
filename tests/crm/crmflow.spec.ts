import {test, expect} from '../../fixtures';

test.describe('CRM Flow', () => {
  test.beforeEach(async ({ loginPage, page }) => {
    await loginPage.gotoLoginPage();
    await loginPage.login(process.env.TEST_USER!, process.env.TEST_PASS!);
    await page.waitForURL((url) => url.pathname === '/desk');
  });

  test('CRM Full Flow', async ({ crmPage, leadPage, opportunityPage, quotationPage, salesorderPage, salesinvoicePage, page }) => {
    await test.step('Open the Leads module and create a lead', async () => {
      await crmPage.openCRMFromCommandBar();
      await leadPage.openModule('lead');
      await expect(page).toHaveURL(/\/desk\/crm\/lead\/?$/);

      await leadPage.clickAddLeadButton();
      await leadPage.createLead({
        firstName: 'Test',
        middleName: 'User',
        lastName: 'Lead',
        email: `testuser${Date.now()}@example.com`,
        mobileNo: String(100_000 + (Date.now() % 900_000)),
      });
      await leadPage.clickSaveButton();
      await leadPage.dismissDuplicateDialog();
      
      //await expect(page).toHaveURL(/\/lead\/CRM-LEAD-\d+/, { timeout: 15000 });
    });

    await test.step('Convert the created lead to an opportunity', async () => {
      await opportunityPage.convertLeadToOpportunity();
      //await expect(page).toHaveURL(/\/opportunity\/CRM-OPP-\d+/, { timeout: 15000 });
    });

    await test.step('Quotation Flow', async () => {
      await quotationPage.convertOpportunityToQuotation();
      await quotationPage.addItem('PRO-MOB-001', 2);
      await quotationPage.addQuotationTemplate();
      await quotationPage.clickSaveButton();
      await quotationPage.ignorePopup();
      await quotationPage.clickSubmitButton();
      await quotationPage.sendToCustomer();
      await quotationPage.approvedByCustomer();
      await expect(page).toHaveURL(/\/quotation\/SAL-QTN-\d+/, { timeout: 15000 });
    });

    await test.step('Sales Order Flow', async () => {
      await salesorderPage.convertQuotationToSalesOrder();
      await salesorderPage.clickSubmitButton();
      await expect(page).toHaveURL(/\/sales-order\/SO-\d+/, { timeout: 15000 });
    });

    await test.step('Sales Invoice Flow', async () => {
      await salesinvoicePage.convertSalesOrderToSalesInvoice();
      await salesinvoicePage.contractNotRequired();
      await salesinvoicePage.accountingDetails();
      await salesinvoicePage.clickSaveButton();
      await salesinvoicePage.clickSubmitButton();
      await expect(page).toHaveURL(/\/sales-invoice\/SI-\d+/, { timeout: 15000 });
    });
});

});