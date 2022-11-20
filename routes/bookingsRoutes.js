const express = require('express');
const authController = require('../controllers/authorizationController');
const userController = require('../controllers/userController');
const router = express.Router();
const bookingController = require('../controllers/bookingController');
router
  .route('/checkoutSession/:tourId')
  .get(userController.protect, bookingController.checkOutSession);
router.post('/postBooking', bookingController.bookings);

module.exports = router;
