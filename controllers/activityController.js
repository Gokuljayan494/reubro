// const ActivityModel = require('../models/activitiesModel');
const ActivityModel = require('../models/activitiesModel');
const multer = require('multer');
const multerStorage = multer.diskStorage({
  destination: (req, file, cb) => {
    console.log(`*****************************`);
    console.log(`*****************************`);
    console.log(`*****************************`);
    console.log(`*****************************`);
    console.log(file);
    cb(null, 'public/img/activities');
  },
  filename: (req, file, cb) => {
    // name for the current photo to the tour
    const extension = file.mimetype.split('/')[1];
    cb(null, `activities-${req.body.name}-${Date.now()}.${extension}`);
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

exports.uploadPhoto = upload.single('photo');

exports.addActivities = async (req, res) => {
  try {
    console.log(`------------------`);
    console.log(req.body);
    const { description, name, additionCost } = req.body;
    const photo = req.file.filename;
    const activity = await ActivityModel.create({
      photo,
      description,
      name,
      additionCost,
    });
    console.log(`---------------------`);
    console.log(`---------------------`);
    console.log(`---------------------`);
    console.log(`---------------------`);
    console.log(`---------------------`);
    console.log(photo, description, name, additionCost);

    res.status(200).json({
      status: 'sucess',
      data: {
        activity,
      },
    });
  } catch (err) {
    res.status(400).json({ status: 'fail', message: `Error:${err.message}` });
  }
};

exports.Edit = async (req, res) => {
  try {
    console.log(`--------------------------`);
    console.log(`--------------------------`);
    console.log(`--------------------------`);
    console.log(`--------------------------`);
    console.log(`--------------------------`);
    // console.log(req.body.file);
    const activity = await ActivityModel.findById(req.params.activityId);
    if (req.file.filename) {
      activity.photo.push(req.file.filename);
    }
    activity.name = req.body.name || activity.name;
    activity.description = req.body.description || activity.description;
    activity.additionCost = req.body.additionCost || activity.additionCost;
    await activity.save({ validateBeforeSave: false });
    res.status(200).json({ status: 'sucess', activity });

    console.log(activity);
  } catch (err) {
    res.status(400).json({ status: 'fail', message: `Error:${err.message}` });
  }
};

exports.deleteActivity = async (req, res) => {
  try {
    res.status(200).json({ status: 'sucess' });
  } catch (err) {
    res.status(400).json({ status: 'Fail', message: `Error:${err.message}` });
  }
};
exports.allActivtys = async (req, res) => {
  try {
    const activity = await ActivityModel.find();
    res
      .status(200)
      .json({ status: 'sucess', results: activity.length, activity });
  } catch (err) {
    res.status(400).json({ status: 'fail', message: `Error:${err.message}` });
  }
};

exports.deleteActivity = async (req, res) => {
  try {
    const activity = await ActivityModel.findByIdAndRemove(
      req.params.activityId
    );
    console.log(activity);
    if (!activity) {
      throw new Error(`no activity found`);
    }

    res.status(200).json({ status: 'Sucess' });
  } catch (err) {
    res.status(400).json({ status: 'Fail', message: `Error:${err.message}` });
  }
};
