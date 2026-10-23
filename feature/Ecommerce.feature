Feature : Ecommerce validations

Scenario : placing the Orderfor a product
    Given a login to the ecommerce application with '<ECOMMERCE_TEST_EMAIL>' and '<ECOMMERCE_TEST_PASSWORD>'
    When add 'Zara coat 3' to Cart
    Then Verify 'Zara coat 3' is displayed in Cart
    When enter valid details and place a order
    Then verify order in present in the OrderHistory
