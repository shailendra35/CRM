import { test, expect } from '../../fixtures/crm.fixtures';

test.describe('CRM dashboard', () => {
  test('opens CRM from the command bar', async ({ page, loginPage, crmPage }) => {
    await loginPage.gotoLoginPage();
    await loginPage.login(process.env.TEST_USER!, process.env.TEST_PASS!);

    await page.waitForURL((url) => url.pathname === '/desk');
    await expect(page).toHaveURL(new URL('/desk', process.env.BASE_URL).toString());

    await crmPage.gotoDashboard();
    await crmPage.openCRMFromCommandBar();

    await expect(page).toHaveURL(new URL('/desk/crm', process.env.BASE_URL).toString());
  });
});
