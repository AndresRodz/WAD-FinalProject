const {SECRET_TOKEN} = require('./../config');

function validateSession(req, res, next) {
    console.log("Validating...");
    const {sessionToken} = req.headers;

    jsonwebtoken.verify(sessionToken, SECRET_TOKEN, (err, decoded) => {
        if(err) {
            res.statusMessage = "Session expired! ";
            return res.status(400).end();
        }
        next();
    });
}

module.exports = validateSession;