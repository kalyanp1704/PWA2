const CLIENT_PORTAL_URL = 'https://rahulshettyacademy.com/client/#/auth/login';

class ClientPortalPage {
    constructor(page) {
        this.page = page;
    }

    async goto() {
        await this.page.goto(CLIENT_PORTAL_URL);
    }

    async register({ firstName, lastName, mobile, email, password }) {
        await this.goto();
        await this.page.locator("//a[@class='btn1']").click();
        await this.page.locator('#firstName').fill(firstName);
        await this.page.locator('#lastName').fill(lastName);
        await this.page.locator('#userEmail').fill(email);
        await this.page.locator('#userMobile').fill(mobile);
        await this.page.locator('select.custom-select').selectOption('Student');
        await this.page.locator("//input[@value='Male']").click();
        await this.page.locator('#userPassword').fill(password);
        await this.page.locator('#confirmPassword').fill(password);
        await this.page.locator("//input[@type='checkbox']").check();
        await this.page.locator('#login').click();
        await this.page
            .getByRole('heading', { name: 'Account Created Successfully' })
            .waitFor({ state: 'visible' });
        await this.page.getByRole('button', { name: 'Login' }).click();
    }

    async login(email, password) {
        await this.page.locator('#userEmail').fill(email);
        await this.page.locator('#userPassword').fill(password);
        await this.page.locator('#login').click();
        await this.page.waitForLoadState('networkidle');
    }

    async registerAndLogin(details) {
        await this.register(details);
        await this.login(details.email, details.password);
    }

    async productTitles() {
        const titles = this.page.locator("//h5[@style='text-transform: uppercase;']//b");
        await titles.first().waitFor({ state: 'visible' });
        return titles.allTextContents();
    }

    productCard(productName) {
        return this.page
            .locator('.card-body')
            .filter({ has: this.page.getByText(productName, { exact: true }) });
    }

    async addProductToCart(productName) {
        await this.productCard(productName).getByRole('button', { name: /Add To Cart/i }).click();
    }

    async openCart() {
        await this.page.locator("button[routerlink='/dashboard/cart']").click();
    }

    cartProduct(productName) {
        return this.page.locator('h3').filter({ hasText: productName });
    }

    async startCheckout() {
        await this.page.getByRole('button', { name: 'Checkout' }).click();
    }

    async selectCountry(searchText, countryName) {
        await this.page.getByPlaceholder('Select Country').pressSequentially(searchText);
        const countryOption = this.page
            .locator('.ta-results')
            .getByRole('button', { name: new RegExp(`${countryName}$`) })
            .first();
        await countryOption.waitFor({ state: 'visible' });
        await countryOption.click();
    }

    async placeOrder() {
        await this.page.locator('.action__submit').click();
    }

    orderConfirmation() {
        return this.page.locator('.hero-primary');
    }

    async orderId() {
        return (await this.page.locator('.em-spacer-1 .ng-star-inserted').textContent()) ?? '';
    }

    async openMyOrders() {
        await this.page.locator("button[routerlink*='myorders']").click();
    }

    async openOrderDetails(orderId) {
        const rows = this.page.locator('tbody tr');
        await rows.first().waitFor({ state: 'visible' });

        for (let index = 0; index < await rows.count(); index += 1) {
            const row = rows.nth(index);
            const rowOrderId = (await row.locator('th').textContent()) ?? '';
            if (orderId.includes(rowOrderId)) {
                await row.locator('button').first().click();
                return;
            }
        }

        throw new Error(`Could not find order ${orderId} in My Orders.`);
    }

    async orderDetailsId() {
        return (await this.page.locator('.col-text').textContent()) ?? '';
    }
}

module.exports = { ClientPortalPage };
