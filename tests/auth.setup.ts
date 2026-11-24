import { test } from '../fixtures/crm.fixtures';

test('authenticate and save state', async ({ loginPage, page }) => {
  await loginPage.gotoLoginPage();
  await loginPage.login(process.env.TEST_USER!, process.env.TEST_PASS!);

  await page.context().storageState({ path: 'authFile' });
});