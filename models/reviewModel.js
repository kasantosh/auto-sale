const mongoose = require('mongoose');

const reviewSchema = new mongoose.Schema({
    review: {
        type: String,
        required: [true, 'Please write a review']
    },
    title: {
        type: String,
        required: [true, 'Please fill in a title']
    },
    rating: {
        type: Number,
        min: 1, 
        max: 5,
        set: val => Math.round(val * 10) /10
    },
    totalRatings: Number,
    ratingsAverage: Number,
    createdAt: {
        type: Date,
        default: Date.now
    },
    user:
    {
      type: mongoose.Schema.ObjectId, 
      ref: 'User',
      required: [true, 'Review must belong to a user']
    }
},
{
    toJSON: { virtuals: true },
    toObject: { virtuals: true }
}
);

reviewSchema.pre(/^find/, function(next) {
    this.populate({ 
        path: 'user',
        select: 'name email photo', 
        select: '-autos -__v -role'
    });

    next();
});

reviewSchema.statics.calcAverageRatings = async function() {
    const stats = await this.aggregate([
        {
            $group: {
                _id: '',
                nRating: { $sum: 1 },
                avgRating: { $avg: '$rating' }
             }
        }
    ]);
    this.totalRatings = stats[0].nRating;
    this.ratingsAverage = stats[0].nRating;

    // console.log(stats);
}

reviewSchema.post('save', function() {
    // this points to current review
    this.constructor.calcAverageRatings();
});

reviewSchema.pre(/^findOneAnd/, async function(next) {
    const r = await this.findOne();
    // console.log(r);
});

const Review = mongoose.model('Review', reviewSchema);

module.exports = Review;