const mongoose = require('mongoose');
const adminModel = require('./adminModel');
const toursModel = require('./toursModle');
// const userModel = require('./userModel');
// mongoose.model('tour',to)
const ReviewsSchema = new mongoose.Schema(
  {
    reviews: String,
    createdAt: {
      type: Date,
      default: Date.now,
    },
    tour: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Tours',
      required: [true, 'Review must belong to a tour.'],
    },
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Users',
      required: [true, 'a review must need a user'],
    },
  },
  {
    toJSON: { virtuals: true },
    toObject: { virtuals: true },
  }
);
ReviewsSchema.pre(/^find/, function (next) {
  console.log(`hey`);
  this.populate({ path: 'tour', select: ' name' }).populate({
    path: 'user',
    select: 'name',
  });
  next();
});
// ReviewsSchema.pre;
const ReviewModel =
  mongoose.model('review', ReviewsSchema) || mongoose.model('Reviews');
module.exports = ReviewModel;
