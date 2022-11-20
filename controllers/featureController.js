const FeatureModel = require('../models/featuresModel');
exports.addFeatures = async (req, res) => {
  try {
    const features = await FeatureModel.create({ name: req.body.name });
    res.status(200).json({ status: 'sucess', features });
  } catch (err) {
    res.status(400).json({ status: 'fail', message: `Error:${err.message}` });
  }
};
exports.editFeatures = async (req, res) => {
  try {
    features = await FeatureModel.findByIdAndUpdate(
      req.params.featuresId,
      'name:req.body.name'
    );
    res.status(200).json({ status: 'sucess', features });
  } catch (err) {
    res.status(400).json({ status: 'fail', message: `Error:${err.message}` });
  }
};
exports.allFeatures = async (req, res) => {
  try {
    const features = await FeatureModel.find();
    res
      .status(200)
      .json({ status: 'sucess', results: features.length, data: { features } });
  } catch (err) {
    res.status(400).json({ status: 'fail', message: `Error:${err.message}` });
  }
};

exports.deleteFeatures = async (req, res) => {
  try {
    const features = await FeatureModel.findByIdAndRemove(
      req.params.featuresId
    );
    res.status(200).json({ status: 'sucess', message: null });
  } catch (err) {
    res.status(400).json({ status: 'fail', message: `Error:${err.message}` });
  }
};
