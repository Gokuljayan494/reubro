const express = require('express');
const router = express.Router();
const tourController = require('../controllers/tourController');
const authController = require('../controllers/authorizationController');
///////////////////////////////
router.post('/addAllTours', tourController.addTours);
router.get('/alltours', authController.protect, tourController.getAllTours);
router.get('/getTour', authController.protect);
module.exports = router;
