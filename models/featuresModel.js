const mongoose = require('mongoose');

const featuresSchema = new mongoose.Schema({
  name: {
    type: String,
    unique: true,
  },
});

const FeatureModel = mongoose.model('feature', featuresSchema);
module.exports = FeatureModel;
