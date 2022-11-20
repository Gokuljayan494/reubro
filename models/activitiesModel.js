const mongoose = require('mongoose');
const activitiesSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, 'a activite should need a name'],
    unique: true,
  },
  photo: {
    type: [String],
  },
  description: {
    type: String,
    required: [true, 'a activite need description'],
    unique: true,
  },
  additionCost: {
    type: String,
    min: [200, 'a activite additioncost must be minimum 200 or above'],
    min: [100000, 'a activite additioncost must be maximum 100000 or above'],
  },
});

const ActivityModel = mongoose.model('activitie', activitiesSchema);
module.exports = ActivityModel;
