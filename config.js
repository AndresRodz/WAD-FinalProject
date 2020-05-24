module.exports = {
    DATABASE_URL = process.env.DATABASE_URL || "mongodb+srv://A01193126:A01193126!@cluster0-uula5.mongodb.net/shoppingAppDB?retryWrites=true&w=majority",
    TOKEN = process.env.API_TOKEN || '',
    PORT = process.env.PORT || '8000',
    SECRET_TOKEN : process.env.SECRET_TOKEN || 'secret'
};