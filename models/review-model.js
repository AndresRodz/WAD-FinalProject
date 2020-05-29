const mongoose = require('mongoose');

const reviewSchema = mongoose.Schema({
    title: {
        type: String,
        required: true
    },
    content: {
        type: String,
        required: true
    },
    author: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'users',
        required: true
    },
    item: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'items',
        required: true
    }
});

const reviewsCollection = mongoose.model('reviews', reviewSchema);

const Reviews = {
    addReview: function(newReview) {
        return reviewsCollection
            .create(newReview)
            .then(review => {
                return review;
            })
            .catch(err => {
                return err;
            });
    },
    getReviewsByUserId: function(id) {
        return reviewsCollection
            .find({author: id})
            .populate('author', ['firstName', 'lastName'])
            .then(reviews => {
                return reviews;
            })
            .catch(err => {
                return err;
            });
    },
    getReviewsByItemId: function(id) {
        return reviewsCollection
            .find({item: id})
            .populate('author', ['firstName', 'lastName'])
            .then(reviews => {
                return reviews;
            })
            .catch(err => {
                return err;
            })
    }
};

module.exports = {Reviews};