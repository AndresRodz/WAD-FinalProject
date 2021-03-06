const express = require('express');
const bodyParser = require('body-parser');
const morgan = require('morgan');
const mongoose = require('mongoose');
const uuid = require("uuid");
const bcrypt = require('bcryptjs');
const jsonwebtoken = require('jsonwebtoken');
const {DATABASE_URL, PORT, SECRET_TOKEN, ADMIN_TOKEN} = require('./config');
const {Users} = require('./models/user-model');
const {Items} = require('./models/item-model');
const {Carts} = require('./models/cart-model');
const {Orders} = require('./models/order-model');
const {Reviews} = require('./models/review-model');
const cors = require('./middleware/cors');
const validateSession = require('./middleware/validateSession');

const app = express();
const jsonParser = bodyParser.json();

app.use(cors);
//app.use(validateSession);
app.use(express.static("public"));
app.use(morgan('dev'));

//Endpoint called from signup.js to sign up and go to index.html
app.post('/api/users/signup', jsonParser, (req, res) => {
    let {firstName, lastName, email, password, token} = req.body;

    if(!firstName || !lastName || !email || !password) {
        res.statusMessage = "Parameter missing in the body of the request.";
        return res.status(406).end();
    }

    let admin;

    if(token == ADMIN_TOKEN) {
        admin = true;
    }
    else {
        admin = false;
    }

    bcrypt.hash(password, 10)
        .then(hashedPassword => {
            let newUser = {
                firstName,
                lastName,
                email,
                password: hashedPassword,
                admin: admin
            };

        Users
            .createUser(newUser)
            .then(result => {
                let userid = result._id;
                
                console.log(userid);

                const cart = {
                    user : userid
                };
            
                Carts
                    .createCart( cart )
                    .then( result => {
                        console.log(result);
                        return res.status(201).json(result);
                    })
                    .catch( err => {
                        res.statusMessage = "Something was wrong with the database, please try again later.";
            
                        return res.status(500).end();
                    })
                
                    return res.status(201).json(result);
            })
            .catch(err => {
                res.statusMessage = err.message;
                return res.status(400).end();
            });
        })
        .catch(err => {
            console.log(err);
        });
});

//Endpoint called from index.js to login and go to home.html
app.post('/api/users/login', jsonParser, (req, res) => {
    let {email, password} = req.body;

    if(!email || !password){
        res.statusMessage = "Parameter missing in the body of the request.";
        return res.status(406).end();
    }

    Users
        .getUserByEmail(email)
        .then(user => {
            if(user) {
                bcrypt.compare(password, user.password)
                    .then(result => {
                        if(result) {
                            let userData = {
                                firstName: user.firstName,
                                lastName: user.lastName,
                                email: user.email
                            };

                            jsonwebtoken.sign(userData, SECRET_TOKEN, {expiresIn:'15m'}, (err, token) => {
                                if(err) {
                                    res.statusMessage = "Something went wrong with generating the token!";
                                    return res.status(400).end();
                                }
                                return res.status(200).json({token});
                            });
                        }
                        else {
                            throw new Error("Invalid credentials");
                        }
                    })
                    .catch(err => {
                        res.statusMessage = err.message;
                        return res.status(400).end();
                    });
            }
            else {
                throw new Error("User does not exist");
            }
        })
        .catch(err => {
            res.statusMessage = err.message;
            return res.status(400).end();
        });
});

//Endpoint called to validate the user session
app.get('/api/users/validate', validateSession, (req, res) => {
    const {sessiontoken} = req.headers;

    jsonwebtoken.verify(sessiontoken, SECRET_TOKEN, (err, decoded) => {
        if(err) {
            res.statusMessage = "Session expired!";
            return res.status(400).end();
        }

        return res.status(200).json(decoded);
    });
});

//Endpoint called to fetch the active email in the session token
app.get('/api/users/email', (req, res) => {
    const {sessiontoken} = req.headers;

    jsonwebtoken.verify(sessiontoken, SECRET_TOKEN, (err, decoded) => {
        if(err) {
            res.statusMessage = "Session expired!";
            return res.status(400).end();
        }

        return res.status(200).json(decoded);
    });
});

//Endpoint called from profile.js and editProfile.js to fetch profile information
app.get('/api/users/profile', validateSession, (req, res) => {
    let email = req.query.email;

    if(!email) {
        res.statusMessage = "The 'email' is required!";
        return res.status(406).end();
    }

    Users
        .getUserByEmail(email)
        .then(result => {
            if(result.errmsg) {
                res.statusMessage = `The email '${email}' was not found. ` + result.errmsg;
                return res.status(409).end();
            }
            res.statusMessage = "The profile was obtained successfully";
            return res.status(200).json(result);
        })
        .catch(err => {
            res.statusMessage = "Something is wrong with the database, try again later";
            return res.status(500).end();
        });
});

//Endpoint called from editProfile.js to update profile information
app.patch('/api/users/update', (validateSession, jsonParser), (req, res) => {
    let firstName = req.body.firstName;
    let lastName = req.body.lastName;
    let email = req.body.email;
    let password = req.body.password;

    let updatedUser = {};

    if(firstName) {
        updatedUser.firstName = firstName;
    }
    if(lastName) {
        updatedUser.lastName = lastName;
    }
    if(email) {
        updatedUser.email = email;
    }
    if(password) {
        bcrypt.hash(password, 10)
            .then(hashedPassword => {
                updatedUser.password = hashedPassword;

            Users
                .updateUser(email, updatedUser)
                .then(result => {
                    if(result.errmsg) {
                        res.statusMessage = "The 'email' was not found in the users list";
                        return res.status(409).end();
                    }
                    res.statusMessage = "The user was updated successfully";
                    return res.status(202).json(result);
                })
                .catch(err => {
                    res.statusMessage = "Something is wrong with the database, try again later";
                    return res.status(500).end();
                });
            })
            .catch(err => {
                console.log(err);
            });
    }
    else {
        Users
            .updateUser(email, updatedUser)
            .then(result => {
                if(result.errmsg) {
                    res.statusMessage = "The 'email' was not found in the users list";
                    return res.status(409).end();
                }
                res.statusMessage = "The user was updated successfully";
                return res.status(202).json(result);
            })
            .catch(err => {
                res.statusMessage = "Something is wrong with the database, try again later";
                return res.status(500).end();
            });
    }
    
});

//Endpoint called from adminPage.js to create a new item
app.post( '/api/items/create' , (validateSession, jsonParser), (req, res) => {
    let name = req.body.name;
    let sku = uuid.v4();
    let description = req.body.description;
    let price = req.body.price;
    let category = req.body.category;
    let keywords = req.body.keywords;
    let imgpath = req.body.imgpath;

    if( !name || !sku || !description || !price || !category || !keywords || !imgpath ){
        res.statusMessage = "One or more parameters is missing, please send all parameters required.";

        return res.status( 406 ).end();
    }

    let newItem = {name, sku, description, price, category, keywords, imgpath };

    Items
        .createItem( newItem )
        .then( createdItem => {
            return res.status(201).json( createdItem );
        })
        .catch( err => {
            res.statusMessage = "Something went wrong with the Database, please try again later.";

            return res.status( 500 ).end();
        })
});

//Endpoint called from adminPage.js to get all existing items from database
app.get( '/api/items/get' , validateSession, ( req, res ) => {
    console.log("Getting all items from database...");

    Items
        .getAllItems()
        .then( allItems => {
            return res.status( 200 ).json( allItems );
        })
        .catch( err => {
            res.statusMessage = "Something went wrong with the database, please try again later.";
            
            return res.status( 500 ).end();
        })
});

//Endpoint called fron adminPage.js to delete an item
app.delete('/api/items/delete/:sku', validateSession, (req, res) => {
    console.log("Deleting an item...");

    let sku = req.params.sku;

    if(!sku) {
        res.statusMessage = "The 'sku' paramater is missing";
        return res.status(406).end();
    }

    Items
        .removeItemById(sku)
        .then(result => {
            return res.status(200).json(result);
        })
        .catch(err => {
            res.statusMessage = "Something went wrong with the database, please try again later.";
            return res.status( 500 ).end();
        })
});

//Endpoint called from adminPage.js to modify an item
app.patch('/api/items/modify', (validateSession, jsonParser), (req, res) => {
    let name = req.body.name;
    let sku = req.body.sku;
    let description = req.body.description;
    let price = req.body.price;
    let category = req.body.category;
    let keywords = req.body.keywords;
    let imgpath = req.body.imgpath;

    let updatedItem = {};

    if(!sku) {
        res.statusMessage = "The 'sku' is missing in the body";
        return res.status(406).end();
    }

    if(name) {
        updatedItem.name = name;
    }
    if(description) {
        updatedItem.description = description;
    }
    if(price) {
        updatedItem.price = price;
    }
    if(category) {
        updatedItem.category = category;
    }
    if(keywords.length != 0) {
        updatedItem.keywords = keywords;
    }
    if(imgpath) {
        updatedItem.imgpath = imgpath;
    }

    console.log(updatedItem);
    
    Items
        .updateItem(sku, updatedItem)
        .then(result => {
            if(!result) {
                res.statusMessage = "The 'sku' was not found in the items list";
                return res.status(409).end();
            }
            else {
                res.statusMessage = "The item was updated successfully";
                return res.status(202).json(result);
            }
        })
        .catch(err => {
            console.log(err);
            res.statusMessage = "Something is wrong with the database, try again later";
            return res.status(500).end();
        });
})

//Endpoint called from adminPage.js to get all existing items by name
app.get('/api/items/getByName/:name' , validateSession, (req, res) => {
    console.log("Getting all items from database...");

    let name = req.params.name;

    Items
        .getItemsByName(name)
        .then(allItems => {
            if(!allItems){
                res.statusMessage = "No items were found by the search criteria.";

                return res.status(409).end();
            }
            else{
                return res.status(200).json(allItems);
            }
        })
        .catch(err => {
            console.log(err);
            res.statusMessage = "Something went wrong with the database, please try again later.";
            return res.status(500).end();
        })
});

//Endpoint called from adminPage.js to get all existing items by category
app.get('/api/items/getByCategory/:category' , validateSession, (req, res) => {
    console.log("Getting all items from database...");

    let category = req.params.category;

    Items
        .getItemsByCategory(category)
        .then(allItems => {
            return res.status(200).json(allItems);
        })
        .catch(err => {
            res.statusMessage = "Something went wrong with the database, please try again later.";
            return res.status(500).end();
        })
});

//Endpoint called from home.js to get all the information of an item using its sku
app.get('/api/items/getBySKU/:sku', validateSession, (req, res) => {
    let sku = req.params.sku;

    if(!sku) {
        res.statusMessage = "The 'sku' paramater is missing";
        return res.status(406).end();
    }

    Items
        .findItemById(sku)
        .then(result => {
            return res.status(200).json(result);
        })
        .catch(err => {
            res.statusMessage = "Something went wrong with the database, please try again later.";
            return res.status( 500 ).end();
        })
});

//Endpoint called from home.js to add an item to the cart
app.post('/api/carts/Add', (validateSession, jsonParser), (req, res) => {
    let itemid = req.body.itemid;
    let email = req.body.email;
    
    if(!itemid || !email) {
        res.statusMessage = "One or more parameters is missing, please send all parameters required.";
        return res.status(406).end();
    }

    Users
        .getUserByEmail(email)
        .then(user => {
            if(!user) {
                res.statusMessage = "The user does not exist";
                return res.status(409).end();
            }
           let userid = user._id;

           Carts
                .getCartByUserId(userid)
                .then( result => {
                    if(result.length === 0){
                        console.log(result);
                        console.log("No cart found, creating cart...");

                        const newCart = {
                            user: userid
                        }
                        Carts
                            .createCart(newCart)
                            .then( result => {
                                console.log("se creo carrito");
                            })
                            .catch( err => {
                                res.statusMessage = err;
                                return res.status(500).end();
                            })
                    }
                    else {
                        console.log("se encontro carrito!");
                        console.log(result.length);
                    }
                })
                .catch( err => {
                    console.log(err);
                    res.statusMessage = "Something went wrong with the database, please try again later.";
                    return res.status(500).end();
                })
        })
        .catch( err => {
            res.statusMessage = err;
            return res.status(500).end();
        })


    Users
        .getUserByEmail(email)
        .then(user => {
            if(!user) {
                res.statusMessage = "The user does not exist";
                return res.status(409).end();
            }
           let userid = user._id;
           console.log(userid);
           
           Carts
                .addItem(userid, itemid)
                .then(result => {
                    console.log("se agrego item");
                    return res.status(201).json(result);
                })
                .catch(err => {
                    res.statusMessage = "Something went wrong with the database, please try again later.";
                    return res.status(500).end();
                })
        })
        .catch(err => {
            res.statusMessage = "Something went wrong with the database, please try again later.";
            return res.status(500).end();
        })
    
    
});

//Endpoint called from checkout.js to get the cart of the active user
app.get('/api/checkout/:email', validateSession, (req, res) => {
    let email = req.params.email;

    if(!email) {
        res.statusMessage = "The user email parameter is missing";
        return res.status(406).end();
    }

    Users
        .getUserByEmail(email)
        .then(user => {
            if(!user) {
                res.statusMessage = "The user does not exist";
                return res.status(409).end();
            }
           let userid = user._id;
           console.log(userid);
           
           Carts
                .getCartByUserId(userid)
                .then(result => {
                    console.log(result);
                    return res.status(201).json(result);
                })
                .catch(err => {
                    res.statusMessage = err;
                    return res.status(500).end();
                })
        })
        .catch(err => {
            res.statusMessage = err;
            return res.status(500).end();
        })
});

//Endpoint called from checkout.js to remove an item from the cart
app.delete('/api/checkout/remove/:itemID', (validateSession, jsonParser), (req, res) => {
    let itemID = req.params.itemID;
    let email = req.body.email;

    console.log(itemID);

    if(!itemID) {
        res.statusMessage = "The item ID parameter is missing";
        return res.status(406).end();
    }

    let arrayOfItems = [];

    Users
        .getUserByEmail(email)
        .then(user => {
            if(!user) {
                res.statusMessage = "The user does not exist";
                return res.status(409).end();
            }
           let userid = user._id;
           console.log(userid);

            Carts
                .getCartByUserIdRef(userid)
                .then(result => {
                    arrayOfItems = result[0].items;
                
                    for(let i = 0; i < arrayOfItems.length; i++){
                        if(arrayOfItems[i] == itemID){
                            console.log("borrando item");
                            arrayOfItems.splice(i, 1);
                            break;
                        }
                    }
                    Carts
                        .removeItemById(userid, arrayOfItems)
                        .then(result => {
                            return res.status(202).json(result);
                        })
                        .catch(err => {
                            res.statusMessage = err;
                            return res.status(500).end();
                        })
                })
                .catch(err => {
                    res.statusMessage = err;
                    return res.status(500).end();
                })
        })
        .catch(err => {
            res.statusMessage = err;
            return res.status(500).end();
        });

})

//Endpoint called from checkout.js to place an order
app.post('/api/checkout/placeOrder/:email', validateSession, (req, res) => {
    let email = req.params.email;

    if(!email) {
        res.statusMessage = "The user email parameter is missing";
        return res.status(406).end();
    }

    Users
        .getUserByEmail(email)
        .then(user => {
            if(!user) {
                res.statusMessage = "The user does not exist";
                return res.status(409).end();
            }
           let userid = user._id;

           Carts
                .getCartByUserId(userid)
                .then(cart => {

                    const newOrder = {
                        user: cart[0].user,
                        items: cart[0].items
                    };

                    Orders
                        .placerOrder(newOrder)
                        .then(result => {
                            if(result.length === 0) {
                                res.statusMessage = "The cart does not exist";
                                return res.status(406).end();
                            }
                            else {
                                Carts
                                    .removeAllItems(userid)
                                    .then(updatedCart => {
                                        console.log("Se borro el carrito exitosamente");
                                    })
                                    .catch(err => {
                                        res.statusMessage = err;
                                        return res.status(500).end();
                                    })
                                return res.status(201).json(result);
                            }
                        })
                        .catch(err => {
                            res.statusMessage = err;
                            return res.status(500).end();
                        })
                })
                .catch(err => {
                    res.statusMessage = err;
                    return res.status(500).end();
                })
        })
        .catch(err => {
            res.statusMessage = err;
            return res.status(500).end();
        })

});

//Endpoint called from profile.js to view all orders of a user
app.get('/api/orders/viewByID/:email', validateSession, (req, res) => {
    let email = req.params.email;

    if(!email) {
        res.statusMessage = "The user email parameter is missing";
        return res.status(406).end();
    }

    Users
        .getUserByEmail(email)
        .then(user => {
            if(!user) {
                res.statusMessage = "The user does not exist";
                return res.status(409).end();
            }
           let userid = user._id;

           Orders
                .getOrdersByUserIDPop(userid)
                .then(userOrders => {
                    if(userOrders.length === 0) {
                        res.statusMessage = "The user does not have any placed orders";
                        return res.status(409).end();
                    }
                    else {
                        return res.status(201).json(userOrders);
                    }
                })
                .catch(err => {
                    res.statusMessage = err;
                    return res.status(500).end();
                })
        })
        .catch(err => {
            res.statusMessage = err;
            return res.status(500).end();
        })
});

//Endpoint called from profile.js to submit a review for an item
app.post('/api/reviews/submit/:email', (validateSession, jsonParser), (req, res) => {
    let email = req.params.email;
    let title = req.body.title;
    let content = req.body.content;
    let item = req.body.item;

    if(!email || !title || !content) {
        res.statusMessage = "One of the parameters is missing";
        return res.status(406).end();
    }

    Users
        .getUserByEmail(email)
        .then(user => {
            if(!user) {
                res.statusMessage = "The user does not exist";
                return res.status(409).end();
            }
           let userid = user._id;

           let newReview = {
               title: title,
               content: content,
               author: userid,
               item: item
           };

           Reviews
                .getReviewsByUserId(userid).
                then(reviews => {
                    console.log("este es el item id");
                    console.log(item);
                    for(let i = 0; i < reviews.length; i++) {
                        if(reviews[i].item == item) {
                            res.statusMessage = "The user has already written a review for this item";
                            return res.status(406).end();
                        }
                    }

                    Reviews
                    .addReview(newReview)
                    .then(review => {
                        if(!review) {
                            res.statusMessage = "The review could not be created";
                            return res.status(409).end();
                        }
                        return res.status(201).json(review);
                    })
                    .catch(err => {
                        res.statusMessage = err;
                        return res.status(500).end();
                    })
                })
                .catch(err => {
                    res.statusMessage = err;
                    return res.status(500).end();
                })
        })
        .catch(err => {
            res.statusMessage = err;
            return res.status(500).end();
        });
})

//Endpoint called from home.js to obtain all the reviews of an item
app.get('/api/reviews/getById/:id', validateSession, (req, res) => {
    let id = req.params.id;

    console.log("entro al endpoint");
    console.log(id);

    if(!id) {
        res.statusMessage = "The 'id' paramater is missing";
        return res.status(406).end();
    }

    Reviews
        .getReviewsByItemId(id)
        .then(reviews => {
            if(reviews.length === 0) {
                res.statusMessage = "There are no reviews for this item";
                return res.status(409).end();
            }
            else {
                return res.status(200).json(reviews);
            }
        })
        .catch(err => {
            res.statusMessage = err;
            return res.status(500).end();
        })
})

app.listen(PORT, () => {
    console.log("The server is running on port 8000");

    new Promise((resolve, reject) => {
        const settings = {
            useNewUrlParser: true,
            useUnifiedTopology: true,
            useCreateIndex: true
        };
        mongoose.connect(DATABASE_URL, settings, (err) => {
            if(err) {
                return reject(err);
            }
            else{
                console.log("Database connected successfully.")
                return resolve();
            }
        })
    })
    .catch(err => {
        console.log(err);
    });
});
