const bcrypt = require('bcryptjs');
const mongoose = require('mongoose');
const crypto = require('crypto');
const validator = require('validator');
const AdminSchema = new mongoose.Schema(
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
    passwordResetToken: {
      type: String,
    },
    passwordResetTime: Date,
    // role: {
    //   type: String,
    //   enum: ['farmHouseOwner', 'admin'],
    //   default: 'user',
    // },
  },
  { timestamps: true }
);
AdminSchema.pre('save', async function (next) {
  if (!this.isModified('password')) return next();

  this.password = await bcrypt.hash(this.password, 12);
  this.passwordConfirm = undefined;
});
AdminSchema.methods.checkPassword = async function (password, dbPassword) {
  return await bcrypt.compare(password, dbPassword);
};
// adminSchema.methods.adminChangedPassword = function (iat) {
//   if (this.createdAt) {
//     const timestamps = parseInt(this.createdAt.getTime() / 1000, 10);
//     console.log(timestamps);
//     console.log(`--------------------------------------`);
//     return iat <= timestamps;
//   }
//   return false;
// };
AdminSchema.methods.createResetPassword = function () {
  const resetToken = crypto.randomBytes(32).toString('hex');
  this.passwordResetToken = crypto
    .createHash('sha256')
    .update(resetToken)
    .digest('hex');
  return resetToken;
};
const AdminModel =
  mongoose.model('Admin', AdminSchema) || mongoose.model('Admin');

module.exports = AdminModel;
