const bookingsModel = require('../models/bookingsModel');
const ToursModel = require('../models/toursModle');
const userModel = require('../models/userModel');
const stripe = require('stripe')(process.env.STRIPE_SECRET_KEY);
const moment = require('moment');

exports.checkOutSession = async (req, res) => {
  try {
    req.user = await userModel.findById(req.user);
    console.log(req.user);

    // get the currently booked tour
    const tour = await ToursModel.findById(req.params.tourId);
    console.log(tour);
    console.log(tour.ratePerDay);
    // create checkOut session

    const session = await stripe.checkout.sessions.create({
      //session info
      payment_method_types: ['card'],
      //product info
      line_items: [
        {
          price_data: {
            currency: 'inr',
            unit_amount: tour.ratePerDay * 100,
            product_data: {
              name: `${tour.name} Tour`,
              description: tour.description,
              images: tour.images,
            },
          },
          quantity: 1,
        },
      ],
      mode: 'payment',
      success_url: `${req.protocol}://${req.get(
        'host'
      )}/users/sucessUrl/?tours=${req.params.tourId}&users=${
        req.user._id
      }&ratePerDay=${tour.ratePerDay}`,
      cancel_url: `${req.protocol}://${req.get('host')}/tour/cancelUrl`,
      customer_email: req.user.email,
      client_reference_id: req.params.tourId,
    });

    // create session as response
    console.log(session.url);

    res.status(200).json({ status: 'sucess', session });
  } catch (err) {
    res.status(400).json({ status: 'Fail', message: `Error:${err.message}` });
  }
};

exports.bookings = async (req, res, next) => {
  try {
    const { tours, users, price } = req.query;

    // if (!tours && !users && !price) return next();
    // fromDate = req.body.fromDate;
    // toDate = req.body.toDate;
    // fromDate = moment(fromDate).format('DD-MM-YYYY');
    // toDate = moment(toDate).format('DD-MM-YYYY');
    // //  condition if a user booking the tour in same date
    // if (fromDate && toDate) {
    // }

    const booking = await bookingsModel.create({ tours, users, price });
    res.status(200).json({
      status: 'sucess',
      data: {
        booking,
      },
      message: `Booked successfully`,
    });
  } catch (err) {
    res.status(400).json({ status: 'fail', message: `Error:${err.message}` });
  }
};
exports.userBooking = async (req, res) => {
  try {
    await userModel.findById(req.user).populate('bookings');
    res.status(200).json({ status: 'sucess', bookings });
  } catch (err) {
    res.status(400).json({ status: 'fail', message: `Eroor:${err.message}` });
  }
};
