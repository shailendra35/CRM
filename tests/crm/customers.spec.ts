import { test, expect } from '../../fixtures';

test.describe('CRM customers', () => {
  test.beforeEach(async ({ loginPage, page }) => {
    await loginPage.gotoLoginPage();
    await loginPage.login(process.env.TEST_USER!, process.env.TEST_PASS!);
    await page.waitForURL((url) => url.pathname === '/desk');
  });

  test('opens the customers module', async ({ crmPage, page }) => {
    await crmPage.gotoDashboard();
    await crmPage.openCRMFromCommandBar();
    await crmPage.openModule('customer');

    await expect(page).toHaveURL(/customer/i);
  });
});
