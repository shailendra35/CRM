import {test, expect} from '../../fixtures/p2p.fixtures';

test.describe('P2P Flow', () => {
  test.beforeEach(async ({page, loginPage }) => {
    await loginPage.gotoLoginPage();
    await loginPage.login(process.env.TEST_USER!, process.env.TEST_PASS!);
    await page.waitForURL((url) => url.pathname === '/desk');
  });

    test('P2P Full Flow', async ({ materialReqPage, page }) => {
        await test.step('Open the Material Request module and create a material request', async () => {
            await materialReqPage.materialRequestfromCommandBar();
            await materialReqPage.createMaterialRequest();
            await expect(page).toHaveURL(/\/material-request\/new-material-request/);
        });

    });
});
