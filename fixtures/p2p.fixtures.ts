import { test as base, expect } from '@playwright/test';
import { LoginPage } from '../pages/loginpage';
import { MaterialReqPage } from '../pages/p2p/materialreq-page';

type Pages = {
  loginPage: LoginPage;
  materialReqPage: MaterialReqPage;
};

export const test = base.extend<Pages>({
  loginPage: async ({ page }, use) => {
    await use(new LoginPage(page));
  },
  
  materialReqPage: async ({ page }, use) => {
    await use(new MaterialReqPage(page));
  }
});

export { expect } from '@playwright/test';
