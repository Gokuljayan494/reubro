const toursModel = require('../models/toursModle');
const TourModel = require('../models/toursModle');
exports.SearchTours = async (req, res) => {
  try {
    const tours = await TourModel.find({
      $or: [{ name: { $regex: req.params.key } }],
    });
    res.status(200).json({ status: 'sucess', results: tours.length, tours });
  } catch (err) {
    res.status(400).json({ status: 'fail', message: `Error:${err.message}` });
  }
};
// const TourModel = require('../models/tours');
exports.SearchToursFilter = async (req, res) => {
  try {
    // Filtering

    const queryString = { ...req.query };
    console.log(queryString);
    const excluded = ['page', 'sort', 'limit', 'fields'];
    excluded.forEach((el) => {
      delete queryString[el];
    });
    // Advance Filtering
    queryStr = JSON.stringify(queryString);

    console.log(`JSONstringify${JSON.stringify(queryString)}`);

    queryStr = queryStr.replace(
      /\b(gt|gte|lt|lte)\b/g,
      (replace) => `$${replace}`
    );
    // queryStr.replace(/\b(gte|gt|lte|lt)\b/g, (match) => `$${match}`);
    console.log(queryStr);
    console.log(JSON.parse(queryStr));
    let tours = TourModel.find(JSON.parse(queryStr));
    // 3 sort
    if (req.query.sort) {
      console.log(`yes`);
      let sortBy = req.query.sort.split(',').join(' ');
      console.log(sortBy);
      console.log(sortBy);
      tours = await tours.sort(sortBy);
    }
    tours = await tours;
    res.status(200).json({ status: 'sucess', results: tours.length, tours });
  } catch (err) {
    res.status(400).json({ status: 'fail', message: `Error:${err.message}` });
  }
};
// router.route('/searchTour/:key').get(searchControllers.SearchTours);
