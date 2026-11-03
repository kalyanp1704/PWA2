const SHOPIFY_BASE_URL = 'https://sauce-demo.myshopify.com';

class ShopifyStorePage {
    constructor(page) {
        this.page = page;
    }

    async gotoRegistration() {
        await this.page.goto(`${SHOPIFY_BASE_URL}/account/register`);
    }

    cartLink() {
        return this.page.getByRole('link', { name: 'My Cart (0)' });
    }

    registrationFirstName() {
        return this.page.locator("#create_customer [name='customer[first_name]']");
    }

    registrationLastName() {
        return this.page.locator("#create_customer [name='customer[last_name]']");
    }

    registrationEmail() {
        return this.page.locator("#create_customer [name='customer[email]']");
    }

    async gotoHome() {
        await this.page.goto(SHOPIFY_BASE_URL);
    }

    productLinks() {
        return this.page.locator('a[id^="product-"]');
    }

    async productDetails() {
        return this.productLinks().evaluateAll(links =>
            links.map(link => {
                const [name, price] = link.innerText.trim().split(/\r?\n/);
                return { name, price };
            }),
        );
    }
}

module.exports = { ShopifyStorePage };
