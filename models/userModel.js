const mongoose = require('mongoose');
const validator = require('validator');
const bcrypt = require('bcryptjs');
const crypto = require('crypto');
const userSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, 'a name nedded to register'],
      unique: true,
    },
    password: {
      type: String,
      required: [true, 'password needed'],
      minLength: [6, 'A password must need a 6 letter minimum'],
      maxLength: [50, 'A password only have 30 letter maximum'],
    },
    passwordConfirm: {
      type: String,

      required: [true, 'password needed'],

      validate: {
        validator: function (el) {
          return el === this.password;
        },
      },
    },
    email: {
      type: String,
      required: [true, 'Email required'],
      Math: [
        /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/,
        ,
        'please enter a  valid email id',
      ],

      validate: [validator.isEmail, 'please provide a email'],
      unique: true,
    },
    place: {
      type: String,
      required: [true, 'a user must need a place'],
    },
    mobile: {
      type: Number,
      required: [true, 'a user must need a mobile number'],
      unique: true,
      // min: [10, 'min 10'],
      // max: [10, 'max 10'],
    },
    // role: {
    //   type: String,
    //   enum: ['farmHouseOwner', 'admin'],
    //   default: 'user',
    // },
  },
  {
    toJSON: { virtuals: true },
    toObject: { virtuals: true },
  },
  { timestamps: true }
);

userSchema.pre('save', async function (next) {
  if (!this.isModified('password')) return next();

  this.password = await bcrypt.hash(this.password, 12);
  this.passwordConfirm = undefined;
  // next();
});
userSchema.methods.checkPassword = async function (password, dbPassword) {
  return await bcrypt.compare(password, dbPassword);
};
userSchema.methods.createResetPassword = function () {
  const resetToken = crypto.randomBytes(32).toString('hex');
  this.passwordResetToken = crypto
    .createHash('sha256')
    .update(resetToken)
    .digest('hex');
  return resetToken;
};
// userSchema.pre(/^find/, function (next) {
//   this.populate('bookings').populate('userReviews');
// });

userSchema.virtual('bookings', {
  ref: 'Booking',
  foreignField: 'users',
  localField: '_id',
});
userSchema.virtual('favouriteList', {
  ref: 'Favourite',
  foreignField: 'userId',
  localField: '_id',
});
userSchema.virtual('userReviews', {
  ref: 'review',
  foreignField: 'user',
  localField: '_id',
});
const userModel = mongoose.model('Users', userSchema);
module.exports = userModel;
