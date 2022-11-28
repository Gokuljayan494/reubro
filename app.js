const express = require('express');
const app = express();
const cors=require('cors')
const mongoose = require('mongoose');
const bookingRouter = require('./routes/bookingsRoutes');
const toursRouter = require('./routes/toursRouter');
const adminRouter = require('./routes/adminRouter');
const userRouter = require('./routes/usersRouter');
// const stripeRouter = require('./routes/stripeRouter');
const path = require('path');
const multer = require('multer');
const cookieParser = require('cookie-parser');
const mongoSanitise = require('express-mongo-sanitize');
const xss = require('xss-clean');
const hpp = require('hpp');
var bodyParser = require('body-parser');

//////////////////////////////////////////////////
app.use(cors())
app.use(function(req, res, next) {
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE');
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type');
    res.setHeader('Access-Control-Allow-Credentials', true);
    next();
});
app.use(bodyParser.json());
app.use(mongoSanitise());
// console.log(mongoSanitise());
// app.use(xss());
app.use(express.json());
app.use(cookieParser());
app.set('view engine', 'pug');
app.set('views', path.join(__dirname, 'views'));
app.use(express.static('public'));

mongoose
  .connect(
    'mongodb+srv://gokuljayan:zAivEli2TxRdxdKZ@cluster0.v3tjrg2.mongodb.net/?retryWrites=true&w=majority'
  )
  .then((con) => {
    console.log(`Db connected`);
  })
  .catch((err) => {
    console.log(`Error :${err.message}`);
  });

//////////////////////////////////
// Routes
app.get('/api/v1', (req, res) => {
  res.status(200).render('adminSign', { title: 'Login System' });
});
app.use('/api/v1/tours', toursRouter);
app.use('/api/v1/users', userRouter);
app.use('/api/v1/bookings', bookingRouter);
app.use('/api/v1/admin', adminRouter);
// app.use('/api/v1/stripe', stripeRouter);

app.listen('3000', () => {
  console.log(`Server started working at port 3000`);
});

// aiy@7_SpjGyKHmp
//     'mongodb+srv://gokuljayan:zAivEli2TxRdxdKZ@cluster0.v3tjrg2.mongodb.net/?retryWrites=true&w=majority'
//
