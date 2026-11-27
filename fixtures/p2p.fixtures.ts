import { test as base, expect } from '@playwright/test';
import { LoginPage } from '../pages/loginpage';
import { MaterialReqPage } from '../pages/p2p/materialreq-page';
import { RFQPage } from '../pages/p2p/rfq-page';
import { SQPage } from '../pages/p2p/sq-page';
import { POPage } from '../pages/p2p/po-page';


type Pages = {
  loginPage: LoginPage;
  materialReqPage: MaterialReqPage;
  rfqPage: RFQPage;
  sqPage: SQPage;
  poPage: POPage;
};

export const test = base.extend<Pages>({
  loginPage: async ({ page }, use) => {
    await use(new LoginPage(page));
  },
  
  materialReqPage: async ({ page }, use) => {
    await use(new MaterialReqPage(page));
  },

  rfqPage: async ({ page }, use) => {
    await use(new RFQPage(page));
  },

  sqPage: async({ page }, use) => {
    await use(new SQPage(page));
  },

  poPage: async({ page }, use) => {
    await use(new POPage(page));
  }
  
});

export { expect } from '@playwright/test';
