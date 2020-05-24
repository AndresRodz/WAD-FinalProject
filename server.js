const express = require('express');
const bodyParser = require('body-parser');
const morgan = require('morgan');
const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const jsonwebtoken = require('jsonwebtoken');
const {DATABASE_URL, PORT, SECRET_TOKEN} = require('./config');

const app = express();
const jsonParser = bodyParser.json();

app.use(express.static("public"));
app.use(morgan('dev'));



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

/*
Base URL: http://localhost:8000/
GET endpoint: http://localhost:8000/bookmarks
GET by title: http://localhost:8000/bookmark?title=value
POST endpoint: http://localhost:8000/bookmarks
DELETE endpoint: http://localhost:8000/bookmark/:id
PATCH endpoint: http://localhost:8000/bookmark/:id
*/