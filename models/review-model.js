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
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'users',
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
                throw new Error(err.message);
            });
    },
    getReviewsByUserId: function(id) {
        return reviewsCollection
            .find({user: id})
            .populate('user', ['firstName', 'lastName'])
            .then(reviews => {
                return reviews;
            })
            .catch(err => {
                throw new Error(err.message);
            });
    }
};

module.exports = {Reviews};