const ReviewModel = require('../models/reviewModel');

exports.newReviews = async (req, res) => {
  try {
    const reviews = await ReviewModel.create({
      reviews: req.body.reviews,
      user: req.user,
      tour: req.params.tourId,
    });
    res.status(200).json({ status: 'sucess', reviews });
  } catch (err) {
    res.status(400).json({ status: 'sucess', message: `Error:${err.message}` });
  }
};

exports.getReviews = async (req, res) => {
  try {
    console.log(req.params.reviewId);
    const reviews = await ReviewModel.findById(req.params.reviewId);
    console.log(`reviews ${reviews}`);
    res.status(200).json({ status: 'sucess', reviews });
  } catch (err) {
    res.status(400).json({ status: 'sucess', message: `Error:${err.message}` });
  }
};
