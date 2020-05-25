const express = require('express');
const bodyParser = require('body-parser');
const morgan = require('morgan');
const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const jsonwebtoken = require('jsonwebtoken');
const {DATABASE_URL, PORT, SECRET_TOKEN} = require('./config');
const {Users} = require('./models/user-model');

const app = express();
const jsonParser = bodyParser.json();

app.use(express.static("public"));
app.use(morgan('dev'));

//Endpoint called from signup.html
app.post('/api/users/signup', jsonParser, (req, res) => {
    let {firstName, lastName, email, password} = req.body;

    if(!firstName || !lastName || !email || !password) {
        res.statusMessage = "Parameter missing in the body of the request.";
        return res.status(406).end();
    }

    console.log("entro");
    bcrypt.hash(password, 10)
        .then(hashedPassword => {
            let newUser = {
                firstName,
                lastName,
                password: hashedPassword,
                email
            };

        Users
            .createUser(newUser)
            .then(result => {
                console.log(result);
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

//Endpoint called from index.html
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
            return resolve();
        })
    })
    .catch(err => {
        console.log(err);
    });
});
