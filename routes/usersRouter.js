const express = require('express');
const router = express.Router();
const userController = require('../controllers/userController');
const reviewController = require('../controllers/reviewController');
const tourController = require('../controllers/tourController');
const bookingController = require('../controllers/bookingController');
// const authorizationController = require('../controllers/authorizationController');
// router.get('/getTours');

router.route('/SignIn').post(userController.signIn);
router.route('/login').post(userController.login);
router.route('/search').post(userController.SearchTours)
router.route('/tours').get( tourController.getAllTours);
router.route('/getUsers').get(userController.getUsers)
router
  .route('/tours/:id')
  .get( userController.getTour);

// router.route('/users').get(userController.protect, userController.getAllUsers);
// router.route('/user').get(userController.protect, userController.getUser);
router.route('/logout').post(userController.protect, userController.logout);
router.route('/forgotpassword').post(userController.forgotPassword);
router.route('/resetPassword/:token').put(userController.resetpassword);
router
  .route('/editUser/:userId')
  .put(userController.protect, userController.editUser);
router.route('/addManyUsers').post(userController.addAllUsers);
/////////////////////////////
// reviews
router
  .route('/newReviews/:tourId')
  .post(userController.protect, reviewController.newReviews);
// router
//   .route('/userReview/:tourId')
//   .get(userController.protect, userController.getUserReviews);
/////////////////////////////////////////////////////////
// favourite
router
  .route('/makeFavourite/:tourId')
  .post(userController.protect, userController.addFavouriteList);
router
  .route('/favouriteList/:userId')
  .get( userController.favouriteList);
router
  .route('/deleteFavouriteList/:favouriteId')
  .delete(userController.protect, userController.deleteFavourite);

///////////////////////////////
// bookings
router
  .route('/checkOutSession')
  .get(userController.protect, bookingController.checkOutSession);

router
  .route('/sucessUrl')
  .get(userController.protect, bookingController.bookings);

router
  .route('/userBookings')
  .get(userController.protect, bookingController.userBooking);
module.exports = router;
