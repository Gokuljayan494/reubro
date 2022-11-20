const mongoose = require('mongoose');
const toursModel = require('../models/toursModle');
const userModel = require('./userModel');
const bookingsSchema = new mongoose.Schema(
  {
    tours: {
      type: mongoose.Schema.ObjectId,
      ref: 'Tours',
    },
    users: {
      type: mongoose.Schema.ObjectId,
      ref: 'Users',
    },
    price: {
      type: Number,
    },
    fromDate: {
      type: String,
    },
    toDate: {
      type: String,
    },
    // totalAmount: {
    //   type: Number,
    //   required: true,
    // },
    // totalDays: {
    //   type: Number,
    //   required: true,
    // },
    // transcationId: {
    //   type: Number,
    //   required: true,
    // },
    status: {
      type: String,
      required: true,
      default: 'Booked',
    },
  },
  {
    toJSON: { virtuals: true },
    toObject: { virtuals: true },
  }
);
bookingsSchema.pre(/^find/, function (next) {
  this.populate('users').populate({ path: 'tours', select: 'name' });
});

const bookingsModel = mongoose.model('Booking', bookingsSchema);

module.exports = bookingsModel;
