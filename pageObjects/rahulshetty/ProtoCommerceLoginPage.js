const LOGIN_URL = 'https://rahulshettyacademy.com/loginpagePractise/';

class ProtoCommerceLoginPage {
    constructor(page) {
        this.page = page;
    }

    async goto() {
        await this.page.goto(LOGIN_URL);
    }

    async login(username, password) {
        await this.page.locator('#username').fill(username);
        await this.page.locator('#password').fill(password);
        await this.page.locator('#terms').check();
        await this.page.locator('#signInBtn').click();
    }

    errorMessage() {
        return this.page.locator("[style*='block']");
    }

    protoCommerceLink() {
        return this.page.locator("//a[text()='ProtoCommerce']");
    }

    productTitles() {
        return this.page.locator("//div[@class='card-body']//a");
    }

    async openDocumentsRequest(context) {
        const [documentsPage] = await Promise.all([
            context.waitForEvent('page'),
            this.page.locator("[href*='documents-request']").click(),
        ]);
        return documentsPage.locator("//p[@class='im-para red']").textContent();
    }
}

module.exports = { ProtoCommerceLoginPage };
