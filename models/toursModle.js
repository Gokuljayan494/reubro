const mongoose = require('mongoose');
const ReviewModel = require('./reviewModel');
const ToursSchema = mongoose.Schema(
  {
    name: {
      type: String,
      // required: [true, 'a name is needed for Tour name'],
    },
    NoOfPersonsOccupy: {
      type: Number,
      min: [1, 'Number of guest must be minimum 1'],
      max: [50, 'Number of maximum accommodation must be 50'],
    },
    ratePerDay: {
      type: Number,
      // required: [true],
    },
    images: [String],
    address: {
      type: String,
      // required: true,
    },
    description: {
      type: String,
      // required: [true, 'a tour must need a description'],
    },
    ownerEmail: {
      type: String,
    },
    ownerPhone: {
      type: Number,
    },
    reviews: String,
  },
  {
    toJSON: { virtuals: true },
    toObject: { virtuals: true },
  },
  {
    timestamps: true,
  }
);

// ToursSchema.virtual('reviewUsers', {
//   ref: 'review',
//   foreignField: 'tour',
//   localField: '_id',
// });
ToursSchema.virtual('Bookings', {
  ref: 'Booking',
  foreignField: 'tours',
  localField: '_id',
});
const ToursModel =
  mongoose.model('Tours', ToursSchema) || mongoose.model('Tour');

module.exports = ToursModel;
