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
      .populate('reviewUsers')
      .populate('Bookings');
    res.status(200).json({ status: 'sucess', tour });
  } catch (err) {
    res.status(400).json({ status: 'fail', message: `Error:${err.message}` });
  }
};
