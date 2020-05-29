<h1>
    Final Project
</h1>

<p>
    This was done as part of the final project for the Web Applications Development class

    Use 'npm install' to complete the installation
</p>

This is a list of all endpoints used for this project, alognside a brief description for each
<ul>
    <li>'/api/users/signup': Endpoint called from signup.js to sign up and go to index.html</li>
    <li>'/api/users/login': Endpoint called from index.js to login and go to home.html</li>
    <li>'/api/users/validate': Endpoint called to validate the user session</li>
    <li>'/api/users/email': Endpoint called to fetch the active email in the session token</li>
    <li>'/api/users/profile': Endpoint called from profile.js and editProfile.js to fetch profile information</li>
    <li>'/api/users/update': Endpoint called from editProfile.js to update profile information</li>
    <li>'/api/items/create': Endpoint called from adminPage.js to create a new item</li>
    <li>'/api/items/get': Endpoint called from adminPage.js to get all existing items from database</li>
    <li>'/api/items/delete/:sku': Endpoint called fron adminPage.js to delete an item</li>
    <li>'/api/items/modify': Endpoint called from adminPage.js to modify an item</li>
    <li>'/api/items/getByName/:name': Endpoint called from adminPage.js to get all existing items by name</li>
<li>'/api/items/getByCategory/:category': Endpoint called from adminPage.js to get all existing items by category</li>
    <li>'/api/items/getBySKU/:sku': Endpoint called from home.js to get all the information of an item using its sku</li>
    <li>'/api/carts/Add': Endpoint called from home.js to add an item to the cart</li>
    <li>'/api/checkout/:email': Endpoint called from checkout.js to get the cart of the active user</li>
    <li>'/api/checkout/remove/:itemID': Endpoint called from checkout.js to remove an item from the cart</li>
    <li>'/api/checkout/placeOrder/:email': Endpoint called from checkout.js to place an order</li>
    <li>'/api/orders/viewByID/:email': Endpoint called from profile.js to view all orders of a user</li>
    <li>'/api/reviews/submit/:email': Endpoint called from profile.js to submit a review for an item</li>
    <li>'/api/reviews/getById/:id': Endpoint called from home.js to obtain all the reviews of an item</li>
</ul>