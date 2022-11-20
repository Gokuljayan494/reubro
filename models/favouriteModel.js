const mongoose = require('mongoose');

const favouriteSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Users',
    required: [true, 'a favourite need a user'],
  },
  tourId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Tours',
    required: [true, 'a favourite need tour'],
  },
  tourTitle: {
    type: String,
  },
  tourImage: {
    type: String,
  },
  favourite: {
    type: Boolean,
    default: true,
  },
});

const FavouriteModel = mongoose.model('Favourite', favouriteSchema);

module.exports = FavouriteModel;
