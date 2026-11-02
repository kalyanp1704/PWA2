class ApiUtils {
  constructor(apiContext, loginPayload) {
    this.apiContext = apiContext;
    this.loginPayload = loginPayload;
  }

  async createOrder(orderPayload) {
    const loginResponse = await this.apiContext.post(
      'https://rahulshettyacademy.com/api/ecom/auth/login',
      { data: this.loginPayload },
    );
    if (!loginResponse.ok()) {
      throw new Error(
        `Login API request failed (${loginResponse.status()}): ${await loginResponse.text()}`,
      );
    }

    const loginData = await loginResponse.json();
    if (!loginData.token) {
      throw new Error('Login API response did not contain an authentication token.');
    }

    const orderResponse = await this.apiContext.post(
      'https://rahulshettyacademy.com/api/ecom/order/create-order',
      {
        data: orderPayload,
        headers: { Authorization: loginData.token },
      },
    );
    if (!orderResponse.ok()) {
      throw new Error(
        `Create-order API request failed (${orderResponse.status()}): ${await orderResponse.text()}`,
      );
    }

    const orderData = await orderResponse.json();
    if (!Array.isArray(orderData.orders) || orderData.orders.length === 0) {
      throw new Error('Create-order API response did not contain an order ID.');
    }

    return {
      token: loginData.token,
      orderId: orderData.orders[0],
    };
  }
}

module.exports = { ApiUtils };
