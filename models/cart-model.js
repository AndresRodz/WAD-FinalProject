const mongoose = require('mongoose');

const cartSchema = mongoose.Schema({
   user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'users',
        required: true
   },
   items: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'items'
    }]
});

const cartsCollection = mongoose.model('carts', cartSchema);

const Carts = {
    createCart: function(newCart){
        return cartsCollection
            .create(newCart)
            .then(cart => {
                return cart;
            })
            .catch(err => {
                return err;
            })
    },
    addItem: function(id, item) {
        return cartsCollection
        .updateOne({user : id},
            {$push : {items : item}})
        .then(cart => {
            return cart;
        })
        .catch( err => {
            return err;
        })
    },
    getCartByUserId: function(sku) {
        return cartsCollection
            .find({user: sku})
            .populate('user', ['firstName', 'lastName', 'email'])
            .then(cart => {
                return cart;
            })
            .catch(err => {
                return err;
            });
    }
};

module.exports = {Carts};