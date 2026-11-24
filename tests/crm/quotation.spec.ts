import {test, expect} from '../../fixtures';

test.describe('CRM Quotations', () => {
  test.beforeEach(async ({ loginPage, page }) => {
    await loginPage.gotoLoginPage();
    await loginPage.login(process.env.TEST_USER!, process.env.TEST_PASS!);
    await page.waitForURL((url) => url.pathname === '/desk');
  });

  test('opens the leads module', async ({crmPage, leadPage, page }) => {

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
    // await leadPage.clickCreateButton();
  
  })
})