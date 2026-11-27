import { Page, Locator, expect } from '@playwright/test'

export class RFQPage{
    constructor(public page: Page){}

    async createRFQFromMR(){
        await this.page.getByRole('button', {name: 'Create', exact: true}).click();
        await this.page.getByRole('menuitem', {name: 'Request for Quotation', exact: true}).click();

        await this.page.waitForTimeout(2000);

        await expect(this.page).not.toHaveURL(/material-request/, {timeout: 15000});

    }

    private async activateCell(row: Locator, fieldname: string){
        const input = row.locator(`input[data-fieldname="${fieldname}']`);
        if (!(await input.isVisible())){
            await row.locator(`.grid-static-col[data-fieldname="${fieldname}']`).click();
        }
        await expect(input).toBeVisible();
        return input;
    }
    
    
    async addSupplierRFQ(supplierName: string){
        const supplier = this.page.locator ('[data-fieldname="suppliers"]');
        await supplier.getByRole('button', {name:'Add row', exact: true}).click();
        
        const row = supplier.locator('.grid-body .grid-row').last();

        const supplierInput = row.locator('input[data-fieldname="supplier"]');
        await supplierInput.fill(supplierName);
        await expect(this.page.getByRole('option',{name:supplierName}).first()).toBeVisible();
        await supplierInput.press('Enter');
        await expect(supplierInput).toHaveValue(new RegExp(supplierName));
    }

    async clickSave(){
        await this.page.getByRole('button',{ name: 'Save', exact: true}).click();
    }
    async clickSubmitandConfirm(){
        await this.page.getByRole('button', {name: 'Submit', exact: true}).click();
        await this.page.getByRole('button',{name:'Yes', exact: true}).click();
    }
};