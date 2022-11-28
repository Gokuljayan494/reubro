const adminModel = require('../models/adminModel');
const jwt = require('jsonwebtoken');
const bcryptjs = require('bcryptjs');
// const dotenv=require(".")
require('dotenv').config();
console.log(process.env.JWT_SECRET_KEY);
/////////////////////////////////////////
const signToken = function (id) {
  return jwt.sign({ id }, process.env.JWT_SECRET_KEY);
};
exports.signIn = async (req, res) => {
  try {
    const admin = await adminModel.create({
      name: req.body.name,
      email: req.body.email,
      password: req.body.password,
      passwordConfirm: req.body.passwordConfirm,
    });
    const token = signToken(admin._id);
    res
      .status(200)
      .cookie('token', token, {
        path: '',
        expires: new Date(Date.now() + 1000 * 86400),
        // httpOnly: true,
        // sameSite: 'none',
        // secure: true,
      })
      // .cookie('jwt', token, {
      //   path: '/',
      //   expires: new Date(Date.now() + 1000 * 86400),
      //   httpOnly: true,
      //   sameSite: 'none',
      //   secure: true,
      // })
      .json({  token });
  } catch (err) {
    res.status(400).json({ status: 'Fail', message: `hello Error:${err.message}` });
  }
};

exports.login = async (req, res) => {
  try {
    const { email, password } = req.body;
    if (!email && !password) {
      throw new Error('enter the field properly');
    }

    // check user exist and password exist
    const admin = await adminModel.findOne({ email });
    if (!admin) {
      throw new Error('not found');
    }
    // check the password with  the encrypted one
    const answer = await admin.checkPassword(password, admin.password);
    console.log(answer);
    if (!admin || !(await admin.checkPassword(password, admin.password))) {
      throw new Error('Invalid Email or Password');
    }
    let token = signToken(admin._id);
    res
      .status(200)
      .cookie('token', token, {
        path: '',
        expires: new Date(Date.now() + 1000 * 86400),
        // httpOnly: true,
        // sameSite: 'none',
        // secure: true,
      })
      .json({token });
  } catch (err) {
    res.status(400).json({ status: 'Fail', message: ` hello Error:${err.message}` });
  }
};

exports.protect = async (req, res, next) => {
  try {
    console.log(`--------------------------`);
    console.log(
      
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
    const currentAdmin = await adminModel.findById(decoded.id);
    if (!currentAdmin) {
      throw new Error('user not belongs to this token');
    }
    // check if the admin changed password after logged in
    // if (!currentAdmin.adminChangedPassword(decoded.iat)) {
    //   throw new Error();
    // }
    req.user = currentAdmin._id;
    console.log(req.user);
    next();
  } catch (err) {
    res.status(400).json({ status: 'Fail', message: `Error:${err.message}` });
  }
};

const value = 'barer';

console.log(value.startsWith('barer'));
