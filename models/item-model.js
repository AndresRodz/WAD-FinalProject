const uuid = require("uuid");
const mongoose = require( 'mongoose' );
mongoose.set('useFindAndModify', false);

const itemSchema = mongoose.Schema({ // Declaramos el modelo de cada item
    name : {
        type : String,
        required : true
    },
    sku : {
        type : String,
        required : true,
        unique : true
    },
    description : {
        type : String,
        required : true,
    },
    price : {
        type : Number,
        required : true
    },
    category : {
        type : String,
        required : true
    },
    keywords : [{
        type : String,
        required : true
    }],
    imgpath : {
        type : String,
        required : true
    }
});

const itemsCollection = mongoose.model( 'items' , itemSchema ); // Declaramos items collection

const Items = { // Declaramos funciones de nuestro objeto Items
    createItem : function( newItem ){
        return itemsCollection
                .create( newItem )
                .then( createdItem => {
                    return createdItem;
                })
                .catch( err => {
                    return err;
                });
    },
    getAllItems : function(){
        return itemsCollection
                .find()
                .then( allItems => {
                    return allItems;
                })
                .catch( err => {
                    return err;
                });
    },
    getItemsByName : function( itemName ){
        return itemsCollection
                .find( { name : itemName })
                .then( item => {
                    return item;
                })
                .catch( err => {
                    return err;
                })
    },
    getItemsByCategory : function( itemCategory ){
        return itemsCollection
                .find( { category : itemCategory })
                .then( item => {
                    return item;
                })
                .catch( err => {
                    return err;
                })
    },
    getItemsByKeyword : function( itemKeyword ){
        return itemsCollection
                .find( { keyword : itemKeyword })
                .then( item => {
                    return item;
                })
                .catch( err => {
                    return err;
                })
    },
    removeItemById : function( itemId ){
        return itemsCollection
                .deleteOne( {sku : itemId } )
                .then( allItems => {
                    return allItems;
                })
                .catch( err => {
                    return err;
                })
    },
    findItemById : function( itemId ){
        return itemsCollection
                .find( { sku : itemId } )
                .then( allItems => {
                    return allItems;
                })
                .catch( err => {
                    return err;
                })
    },
    updateItem: function(itemSku, update) {
        return itemsCollection
            .findOneAndUpdate({sku: itemSku}, {$set: update})
            .then(updatedItem => {
                return updatedItem;
            })
            .catch(err => {
                return err;
            });
    }
}

module.exports = { Items };