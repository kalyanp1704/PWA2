//import the files
const { When, Then, Given } = require('@cucumber/cucumber')

Given('Login to the Ecommerce application with {username} and {password}', function(username, password){
    //write a logic
    return 'pending';
});

When('Add the product {productName} to the cart', function(productName) {
    //Write a logic
    return 'pending';   
});

Then('verify {productName} is displayed in Cart', function(productName) {
    //Write a logic
    return 'pending';   
});

When('enter valid details and place a order', function() {
    //Write a logic
    return 'pending';   
});

Then('verify order in present in the OrderHistory', function() {
    //Write a logic
    return 'pending';   
});