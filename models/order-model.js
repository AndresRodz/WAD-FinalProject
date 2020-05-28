const mongoose = require('mongoose');

const orderSchema = mongoose.Schema({
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

const ordersCollection = mongoose.model('orders', orderSchema);

const Orders = {
    placerOrder: function(newOrder) {
        return ordersCollection
            .create(newOrder)
            .then(order => {
                return order;
            })
            .catch(err => {
                return err;
            })
    },
    getOrdersByUserID: function(userid) {
        return ordersCollection
            .find({user: userid})
            .then(orders => {
                return orders;
            })
            .catch(err => {
                return err;
            })
    }
};

module.exports = {Orders};