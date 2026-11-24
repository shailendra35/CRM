import { Page, Locator } from '@playwright/test';

export class LoginPage {
    readonly page: Page;
    readonly email_textbox: Locator;
    readonly password_textbox: Locator;
    readonly continue_button: Locator;



    constructor(page: Page) {
        this.page = page;
        this.email_textbox = page.getByRole('textbox', { name: 'Email' });
        this.password_textbox = page.getByRole('textbox', { name: 'Password' });
        this.continue_button = page.getByRole('button', { name: 'Continue' });
    }

    async gotoLoginPage() {
        await this.page.goto(process.env.BASE_URL!);
    }

    async login(email: string, password: string) {
        await this.email_textbox.fill(email);
        await this.password_textbox.fill(password);
        await this.continue_button.click();

        await this.page.waitForURL(
            (url) => url.pathname === '/helpdesk/home' || url.pathname === '/desk',
        );
        await this.page.goto(new URL('/desk', process.env.BASE_URL).toString());
        await this.page.waitForURL((url) => url.pathname === '/desk');
    }

    async loginWithEmailLink(email: string){
        await this.page.getByRole('button', {name: 'Login with Email Link'}).click();
        await this.page.getByRole('textbox', {name: 'Email'}).fill(email);
        await this.page.getByRole('button', {name: 'Continue'}).click();
        await this.page.waitForURL((url) => url.pathname === '/desk');
    }

  
};