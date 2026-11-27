import {Page, Locator, expect} from '@playwright/test';

export class SQPage{
    constructor(public page: Page){}


    private async activateCell(row: Locator, fieldname: string){
        const input = row.locator(`input[data-fieldname="${fieldname}']`);
        if (!(await input.isVisible())){
            await row.locator(`.grid-static-col[data-fieldname="${fieldname}']`).click();
        }
        await expect(input).toBeVisible();
        return input;
    }

    async createSQfromRFQ(){
        await this.page.getByRole('button', {name: 'Create', exact: true}).click();
        setTimeout(() => {}, 2000);
        await this.page.getByRole('menuitem', {name: 'Supplier Quotation', exact: true}).click();
    }

    async addSupplier(){
        await this.page.getByRole('combobox').click();
        await this.page.getByRole('option', { name: 'DataWorld Services', exact: true }).click();
        const createbtn=this.page.getByRole('dialog');
            await createbtn.getByRole('button', {name:'Create', exact: true}).click();
    }

    async clickSave(){
        await this.page.getByRole('button',{name: 'Save', exact: true}).click();
    }

    async clickSubmitThenConfirm(){
        await this.page.getByRole('button',{name: 'Submit', exact: true}).click();
        const confirm=this.page.getByRole('dialog');
            await confirm.getByRole('button',{name:'Yes', exact: true}).click();
    }

}
