const mongoose = require('mongoose');

const cartSchema = mongoose.Schema({
   user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'users',
        required: true
   },
   items: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'items',
        required: true
    }]
});

const cartsCollection = mongoose.model('carts', cartSchema);

const Carts = {
    addItem: function(newItem) {
        return cartsCollection
            .create(newItem)
            .then(item => {
                return item;
            })
            .catch(err => {
                throw new Error(err.message);
            });
    },
    getCartByUserId: function(sku) {
        return cartsCollection
            .find({user: sku})
            .populate('user', ['firstName', 'lastName', 'email'])
            .then(cart => {
                return cart;
            })
            .catch(err => {
                throw new Error(err.message);
            });
    }
};

module.exports = {Carts};