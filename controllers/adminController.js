const adminModel = require('../models/adminModel');
const APIFeatures = require('../util/apiFeatures');
const multer = require('multer');
const TourModel = require('../models/toursModle');
const adminJson = require('../data/admin.json');
const crypto = require('crypto');
const nodemailer = require('nodemailer');
const sendEmail = require('./sendMail');
const jwt = require('jsonwebtoken');
////////////////////////////////////////////////////
const signToken = function (id) {
  return jwt.sign({ id }, process.env.JWT_SECRET_KEY);
};
const multerStorage = multer.diskStorage({
  destination: (req, file, cb) => {
    console.log(`*****************************`);
    console.log(`*****************************`);
    console.log(`*****************************`);
    console.log(`*****************************`);
    console.log(file);
    cb(null, 'public/img/tours');
  },
  filename: (req, file, cb) => {
    // name for the current photo to the tour
    const extension = file.mimetype.split('/')[1];
    cb(null, `tour-${req.params.id}-${Date.now()}.${extension}`);
  },
});
const multerFilter = (req, file, cb) => {
  if (file.mimetype.startsWith('image')) {
    cb(null, true);
  } else {
    cb(new Error('not an image'), false);
  }
};
const upload = multer({ storage: multerStorage, fileFilter: multerFilter });

exports.uploadPhoto = upload.single('images');

exports.addAdmin = async (req, res) => {
  try {
    const admin = await adminModel.insertMany(adminJson);
    res.status(200).json({ status: 'sucess', data: { admin } });
  } catch (err) {
    res.status(400).json({ status: 'fail', message: `Error:${err.message}` });
  }
};
exports.getAllTous = async (req, res) => {
  try {
    const features = new APIFeatures(TourModel.find(), req.query)
      .filter()
      .sort()
      .limitFields()
      .paginate();

    const tours = await TourModel.find();

    res.status(200).json({ status: 'sucess', data: { tours } });
  } catch (err) {
    res.status(401).json({ status: 'Fail', Error: `${err.message}` });
  }
};
exports.deleteTour=async(req,res)=>{
try{
const tours=  await TourModel.findByIdAndDelete(req.params.TourId)
res.status(200).json({status:"sucess",message:"null"})
}
  catch(err){
  res.status(400),json({status:"fail",message:`Error:${err.message}`})
  }
}
exports.getTour = async (req, res) => {
  try {
    console.log(req.params.id);
    const tour = await TourModel.findById(req.params.id).populate('reviewTour');

    console.log(`-------------------`);

    // to getting the name who reviewed the tours

    // console.log(
    //   Object.values(Object.values(tour.reviewTour)).forEach((el) => {
    //     console.log(el.user.name);
    //   })
    // );
    // let values;
    // Object.values(Object.values(tour.reviewTour)).forEach((el) => {
    //   values = el.user.name;
    // });

    // const tours = tour.name;
    res.status(200).json({ status: 'sucess', data: { tour } });
  } catch (err) {
    res.status(400).json({ status: 'Fail', message: `Error:${err.message}` });
  }
};

exports.logout = async (req, res) => {
  try {
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
exports.addTour=async(req,res)=>{
  try{
      
   tours= await TourModel.create({
      name:req.body.name,NoOfPersonsOccupy:req.body.NoOfPersonsOccupy,ratePerDay:req.body.ratePerDay,
      address:req.body.address,description:req.body.description,ownerEmail:req.body.ownerEmail,ownerPhone:req.body.ownerPhone
 
    })
    console.log(`-------------------`)
    console.log(req.file)
   if (req.file.filename) {
      tours.images.push(req.file.filename);
    }
 tours=  await tours.save()
 
  res.status(200).json(tours)
   }
  
  catch(err){
  res.status(200).json({status:"fail",message:`Error:${err.message}`})
  }
}
exports.tourEdit = async (req, res) => {
  try {
    const tours = await TourModel.findById(req.params.id);
    // TourModel.create({ name: });
    console.log(`-------------------------------`);
    console.log(`-------------------------------`);
    console.log(`-------------------------------`);
    console.log(`-------------------------------`);
    console.log(`-------------------------------`);
    console.log(`-------------------------------`);
    console.log(req.file);
    if (req.file.filename) {
      tours.images.push(req.file.filename);
    }
    tours.name = req.body.name || tours.name;
    tours.NoOfPersonsOccupy =
      req.body.NoOfPersonsOccupy || tours.NoOfPersonsOccupy;
    tours.rateperDay = req.body.rateperDay || tours.rateperDay;
    // tours.images;
    tours.address = req.body.address || tours.address;
    tours.description = req.body.description || tours.description;
    tours.ownerEmail = req.body.ownerEmail || tours.ownerEmail;
    tours.ownerPhone = req.body.ownerPhone || tours.ownerPhone;
    tours.features = req.body.features || tours.features;
    // const tourUpdated = await TourModel.findByIdAndUpdate({
    //   req..id
    // });
    await tours.save();
    console.log(tours);
    console.log(tours);
    res.status(200).json({ status: 'sucess', tours });
  } catch (err) {
    res.status(400).json({ status: `Fail`, message: `Error:${err.message}` });
  }
};

exports.forgotPassword = async (req, res) => {
  try {
    // 1 get admin based on email
    admin = await adminModel.findOne({ email: req.body.email });
    if (!admin) {
      throw new Error('Email not found');
    }
    // 2 generate random token
    const resetToken = admin.createResetPassword();
    await admin.save({ validateBeforeSave: false });
    const resetURL = `${req.protocol}://${req.get(
      'host'
    )}/api/v1/admin/resetPassword/${resetToken}`;

    const message = `Forgot your password? Reset your password: ${resetURL}.`;

    await sendEmail({
      email: admin.email,
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
    admin.passwordResetToken = undefined;

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
    const admin = await adminModel.findOne({ passwordResetToken: hashedToken });
    if (!admin) {
      throw new Error('no admin invalid token');
    }
    admin.password = req.body.password;
    admin.passwordConfirm = req.body.passwordConfirm;
    admin.passwordResetToken = undefined;
    admin.passwordResetTime = undefined;
    await admin.save();

    const token = signToken(admin._id);
    res.status(200).json({ status: 'sucess', token });
  } catch (err) {
    res.status(400).json({ status: 'fail', message: `Error:${err.message}` });
  }
};
