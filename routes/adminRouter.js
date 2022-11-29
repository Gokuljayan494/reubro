const express = require('express');
const router = express.Router();
const multer = require('multer');
const upload = multer({ dest: 'public/img' });
///////////////////////////////////////////////////////
// tours
const reviewController = require('../controllers/reviewController');
const searchControllers = require('../controllers/search');
const featureController = require('../controllers/featureController');
const activityController = require('../controllers/activityController');
const authController = require('../controllers/authorizationController');
const adminController = require('../controllers/adminController');
const FeatureModel = require('../models/featuresModel');
router.route('/').post(adminController.addAdmin);
router.route('/signin').post(authController.signIn);
router.route('/deleteTour/:TourId').delete(adminController.deleteTour)
router.route('/login').post(authController.login);
router.route('/logout').get(adminController.logout);

router
  .route('/toursEdit/:id')
  .put(
    adminController.tourEdit
  );
// router.route('/protect').post(authController.protect);
router.route('/tours').get( authController.protect,adminController.getAllTous);
// router.get('/tour:id', authController.protect, adminController);
router.route('/tour/:id').get( adminController.getTour);
router.route("/addTour").post(authController.protect,adminController.addTour)


router.route('/forgotpassword').post(adminController.forgotPassword);
router.route('/resetPassword/:token').patch(adminController.resetpassword);

// router.route('/getUses').get();

/////////////////////////////////
// activites

router
  .route('/addActivity')
  .post(
    authController.protect,
    activityController.uploadPhoto,
    activityController.addActivities
  );
router
  .route('/editActivity/:activityId')
  .put(
    authController.protect,
    activityController.uploadPhoto,
    activityController.Edit
  );
router
  .route('/allActivities')
  .get(authController.protect, activityController.allActivtys);

router
  .route('/deleteActivity/:activityId')
  .delete(authController.protect, activityController.deleteActivity);

////////////////////////////////////////////////
//  features
router
  .route('/addFeatures')
  .post(authController.protect, featureController.addFeatures);
router
  .route('/deleteFeatures/:featuresId')
  .delete(featureController.deleteFeatures);
router.route('/allFeatures').get(featureController.allFeatures);

////////////////////////////////////
// searching
router.route('/searchTour/:key').get(searchControllers.SearchTours);
router.route('/search').get(searchControllers.SearchToursFilter);
//////////////////////////////////////
// reviews
router
  .route('/review/:tourId')
  .post(authController.protect, reviewController.newReviews);

router.route('/getReviews/:reviewId').get(reviewController.getReviews);

module.exports = router;
