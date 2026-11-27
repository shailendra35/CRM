import {test, expect} from '../../fixtures/p2p.fixtures';

test.describe('P2P Flow', () => {
  test.beforeEach(async ({page, loginPage }) => {
    await loginPage.gotoLoginPage();
    await loginPage.login(process.env.TEST_USER!, process.env.TEST_PASS!);
    await page.waitForURL((url) => url.pathname === '/desk');
  });

    test('P2P Full Flow', async ({ materialReqPage, rfqPage, sqPage, poPage, page }) => {
        await test.step('Open the Material Request module and create a material request', async () => {
            await materialReqPage.materialRequestfromCommandBar();
            await materialReqPage.createMaterialRequest();
            await expect(page).toHaveURL(/\/material-request\/new-material-request/);
        });

        await test.step('Fill Material Request Form', async () => {
            await materialReqPage.addRequiredByDate();
            await materialReqPage.addItem('PRO-MOB-001', 2);
            await materialReqPage.clickSaveButton();
            await materialReqPage.clickSubmitButton();
        });

        await test.step('Convert MR to RFQ', async() => {
          await rfqPage.createRFQFromMR();
          setTimeout(() => {}, 2000);
          await rfqPage.addSupplierRFQ('DataWorld Services');
          await rfqPage.clickSave();
          await rfqPage.clickSubmitandConfirm();
          await expect(page).toHaveURL(/\/request-for-quotation\/RFQ-\d+/, { timeout: 15000 });
        });

        await test.step('Convert RFQ to SQ', async() =>{
          await sqPage.createSQfromRFQ();
          await sqPage.addSupplier();
          await sqPage.clickSave();
          await sqPage.clickSubmitThenConfirm();
        })

        await test.step('Convert SQ to PO', async() =>{
          await poPage.convertSQtoPO();
          await poPage.fillReqByDate();
          await poPage.clickSave();
          await poPage.clickSubmitThenConfirm();
        });
    });
});
