const {SECRET_TOKEN} = require('./../config');
const jsonwebtoken = require('jsonwebtoken');


function validateSession(req, res, next) {
    console.log("Validating...");
    const {sessiontoken} = req.headers;

    jsonwebtoken.verify(sessiontoken, SECRET_TOKEN, (err, decoded) => {
        if(err) {
            res.statusMessage = "Session expired! ";
            return res.status(400).end();
        }
        next();
    });
}

module.exports = validateSession;