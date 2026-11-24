import {test, expect} from '@playwright/test';

test.describe('CRM opportunities', () => {
  test.beforeEach(async ({ loginPage, page }) => {
    await loginPage.gotoLoginPage();
    await loginPage.login(process.env.TEST_USER!, process.env.TEST_PASS!);
    await page.waitForURL((url) => url.pathname === '/desk');
  });