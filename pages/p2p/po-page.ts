import {Page, Locator, expect} from '@playwright/test'

export class POPage{
    constructor(public page: Page){}

    async convertSQtoPO(){
        await this.page.getByRole('button',{name: 'Create'}).click();
        await this.page.getByRole('menuitem',{name: 'Purchase Order', exact: true}).click();
    }

    async fillReqByDate(){

        const reqByDate = new Date();
        reqByDate.setDate(reqByDate.getDate() + 1);
        const yyyy = reqByDate.getFullYear();
        const mm = String(reqByDate.getMonth() + 1).padStart(2, '0');
        const dd = String(reqByDate.getDate()).padStart(2, '0');
        const formattedDate = `${yyyy}-${mm}-${dd}`;

        const datePicker = this.page.getByRole('application', { name: /Calendar/ });
        await this.page.locator('.frappe-control[data-fieldname="required_by"] input').first().click();

        const adToggle = datePicker.getByRole('button', { name: 'AD', exact: true });
        if ((await adToggle.getAttribute('aria-pressed')) === 'false') {
            await adToggle.click();
        }

        const targetDate = datePicker.getByRole('gridcell', {
            name: new RegExp(`AD ${formattedDate}`),
        });
        for (let month = 0; month < 3 && (await targetDate.count()) === 0; month++) {
            await datePicker.getByRole('button', { name: 'Next Month' }).click();
        }
        await expect(targetDate).toBeVisible();
        await targetDate.click();
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