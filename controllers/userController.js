// const userModel = require('../models/userModel');
const userModel = require('../models/userModel');
const validatePhoneNumber = require('validate-phone-number-node-js');
const favouriteModel = require('../models/favouriteModel');
const TourModel = require('../models/toursModle');
const jwt = require('jsonwebtoken');
const sendEmail = require('../controllers/sendMail');
const crypto = require('crypto');
const dataUser = require('../data/user.json');
const FavouriteModel = require('../models/favouriteModel');
const ReviewModel = require('../models/reviewModel');
const signToken = function (id) {
  return jwt.sign({ id }, process.env.JWT_SECRET_KEY);
};
exports.signIn = async (req, res) => {
  try {
    let { name, password, passwordConfirm, email, place, mobile } = req.body;

    const user = await userModel.create({
      name,
      password,
      passwordConfirm,
      email,
      place,
      mobile,
    });

    const token = signToken(user._id);
    res
      .status(200)
      .cookie('token', token, {
        path: '',
        expires: new Date(Date.now() + 1000 * 86400),
      })
      .json({ status: 'sucess', data: { user }, token });
  } catch (err) {
    res.status(400).json({ status: 'Fail', message: `Error:${err.message}` });
  }
};

exports.login = async (req, res) => {
  try {
    const { email, password } = req.body;
    if (!email && !password) {
      throw new Error('enter the field properly');
    }

    // check user exist and password exist
    const user = await userModel.findOne({ email });
    if (!user) {
      throw new Error('not found');
    }
    // check the password with  the encrypted one
    const answer = await user.checkPassword(password, user.password);
    console.log(answer);
    if (!user || !(await user.checkPassword(password, user.password))) {
      throw new Error('Invalid Email or Password');
    }

    let token = signToken(user._id);
    res
      .status(200)
      .cookie('token', token, {
        path: '',
        expires: new Date(Date.now() + 1000 * 86400),
        // httpOnly: true,
        // sameSite: 'none',
        // secure: true,
      })
      .json({ status: 'sucess', user, token });
  } catch (err) {
    res.status(400).json({ status: 'Fail', message: `Error:${err.message}` });
  }
};

exports.protect = async (req, res, next) => {
  try {
    console.log(`--------------------------`);
    console.log(
      req.headers.authorization.startsWith('Bearer'),
      req.cookies.token
    );
    if (!req.cookies.token) {
      throw new Error('sign in first');
    }
    if (req.cookies.token) {
      token = req.cookies;
    }
    if (
      (req.headers.authorization,
      req.headers.authorization.startsWith('Bearer'))
    ) {
      token = req.headers.authorization.split(' ')[1];
    }
    console.log(token);
    if (!token) {
      throw new Error('Login first');
    }
    const decoded = jwt.verify(token, process.env.JWT_SECRET_KEY);
    console.log(decoded);
    const currentUser = await userModel.findById(decoded.id);

    console.log(currentUser);
    if (!currentUser) {
      throw new Error('user not belongs to this token');
    }
    console.log(`*************************`);
    // check if the admin changed password after logged in
    // if (!currentAdmin.adminChangedPassword(decoded.iat)) {
    //   throw new Error();
    // }
    req.user = currentUser._id;
    console.log(req.user);

    next();
  } catch (err) {
    res.status(400).json({ status: 'Fail', message: `Error:${err.message}` });
  }
};

// exports.getAllUsers = async (req, res) => {
//   try {
//     const users = await userModel.find();
//     res
//       .status(200)
//       .json({ status: 'Sucess', results: tours.length, data: { users } });
//   } catch (err) {
//     res.status(400).json({ status: 'Fail', message: `Error:${err.message}` });
//   }
// };

// exports.getUserReviews = async (req, res) => {
//   try {
//     console.log(`------------------------`);
//     console.log(`------------------------`);
//     console.log(`------------------------`);
//     console.log(`------------------------`);
//     console.log(req.params.userId);
//     const user = await userModel
//       .findById(req.params.userId)
//       .populate('userReviews');

//     console.log(`-------------------`);
//     console.log(`-------------------`);
//     console.log(`-------------------`);

//     console.log(req.cookie);
//     console.log(`-------------------`);

//     // to getting the name who reviewed the tours

//     // console.log(
//     //   Object.values(Object.values(tour.reviewTour)).forEach((el) => {
//     //     console.log(el.user.name);
//     //   })
//     // );
//     // let values;
//     // Object.values(Object.values(tour.reviewTour)).forEach((el) => {
//     //   values = el.user.name;
//     // });

//     // const tours = tour.name;
//     res.status(200).json({ status: 'sucess', data: { user } });
//   } catch (err) {
//     res.status(400).json({ status: 'Fail', message: `Error:${err.message}` });
//   }
// };

exports.logout = async (req, res) => {
  try {
    console.log(`----------------------`);
    console.log(req.cookies);

    res
      .status(200)
      .cookie('token', '', {
        path: '/',
        expires: new Date(0),
        samSite: 'none',
        secure: true,
      })
      .json({ status: 'sucess', message: 'sucessfully logged out' });
  } catch (err) {
    res.status(400).json({ status: `Fail`, message: `Error ${err.message}` });
  }
};

exports.forgotPassword = async (req, res) => {
  try {
    // 1 get admin based on email
    user = await userModel.findOne({ email: req.body.email });
    if (!user) {
      throw new Error('Email not found');
    }
    // 2 generate random token
    const resetToken = user.createResetPassword();
    await user.save({ validateBeforeSave: false });
    const resetURL = `${req.protocol}://${req.get(
      'host'
    )}/api/v1/users/resetPassword/${resetToken}`;

    const message = `Forgot your password? Reset your password: ${resetURL}.`;

    await sendEmail({
      email: user.email,
      subject: 'Your password reset token (valid for 10 min)',
      message,
    });
    console.log(resetToken);
    // res.status(200).json({
    //   status: 'success',
    //   message: 'Token sent to email!',
    // });

    // admin.passwordResetToken = undefined;
    // // user.passwordResetExpires = undefined;
    // await admin.save({ validateBeforeSave: false });

    // throw new Error('there was a error while sending the mails');

    res.status(200).json({ status: 'sucess', message: 'Token sent to email!' });
  } catch (err) {
    user.passwordResetToken = undefined;

    res.status(400).json({ status: 'fail', message: `Error:${err.message}` });
  }
};

exports.resetpassword = async (req, res) => {
  try {
    // get admin based on token
    const hashedToken = crypto
      .createHash('sha256')
      .update(req.params.token)
      .digest('hex');
    const user = await userModel.findOne({ passwordResetToken: hashedToken });
    if (!user) {
      throw new Error('no admin invalid token');
    }
    user.password = req.body.password;
    user.passwordConfirm = req.body.passwordConfirm;
    user.passwordResetToken = undefined;
    user.passwordResetTime = undefined;
    await user.save();

    const token = signToken(user._id);
    res.status(200).json({ status: 'sucess', token });
  } catch (err) {
    res.status(400).json({ status: 'fail', message: `Error:${err.message}` });
  }
};

exports.editUser = async (req, res) => {
  try {
    user = await userModel.findById(req.params.userId);
    user.name = req.body.name || user.name;
    user.place = req.body.place || user.place;
    user.mobile = req.body.mobile || user.place;
    user = await user.save({ validateBeforeSave: false });
    res.status(200).json({ status: 'sucess', user });
  } catch (err) {
    res.status(400).json({ status: 'fail', message: `Error:${err.message}` });
  }
};

exports.addAllUsers = async (req, res) => {
  try {
    const users = await userModel.insertMany(dataUser);
    res
      .status(200)
      .json({ status: 'sucess', results: users.length, data: { users } });
  } catch (err) {
    res.status(400).json({ status: 'fail', message: `Error:${err.message}` });
  }
};

exports.addFavouriteList = async (req, res) => {
  try {
    const favourite = await FavouriteModel.create({
      userId: req.user,
      tourId: req.params.tourId,
    });
    res.status(200).json({ status: 'sucess', data: { favourite } });
  } catch (err) {
    res.status(400).json({
      status: 'fail',
      message: `Error:${err.message}`,
    });
  }
};
exports.favouriteList = async (req, res) => {
  try {
    const userFavouiriteList = await userModel
      .findById(req.params.userId)
      .populate('favouriteList');
    res.status(200).json({ status: 'sucess', data: { userFavouiriteList } });
  } catch (err) {
    res.status(400).json({ status: 'Fail', message: `Error:${err.message}` });
  }
};

exports.deleteFavourite = async (req, res) => {
  try {
    const userFavouiriteList = await favouriteModel.deleteOne({
      _id: req.params.favouriteId,
    });
    res.status(200).json({ status: 'sucess', data: { userFavouiriteList } });
  } catch (err) {
    res.status(400).json({ status: 'Fail', message: `Error:${err.message}` });
  }
};

const tourModel = require('../models/toursModle');
const tourJson = require('../data/tours-simple.json');
exports.addTours = async (req, res) => {
  try {
    const tours = await tourModel.insertMany(tourJson);
    res.status(200).json({ status: 'sucess', data: { tourJson } });
  } catch (err) {
    res.status(400).json({ status: 'fail', message: `Error:${err.message}` });
  }
};
exports.getAllTours = async (req, res) => {
  const tours = await tourModel.find();
  try {
    res.status(200).json({ status: 'sucess', data: { tours } });
  } catch (err) {
    res.status(400).json({ status: 'fail' });
  }
};

exports.getTour = async (req, res) => {
  try {
    const tour = await tourModel
      .findById(req.params.tourId)
      .populate('Bookings');
    // .populate('reviewUsers');

    res.status(200).json({ status: 'sucess', tour });
  } catch (err) {
    res.status(400).json({ status: 'fail', message: `Error:${err.message}` });
  }
};
