const nodemailer = require('nodemailer');

// const nodemailer = require('nodemailer');

const sendEmail = async (options) => {
  // 1) Create a transporter
  const transporter = nodemailer.createTransport({
    host: 'smtp.mailtrap.io',
    port: 2525,
    auth: {
      user: 'd959f4d5ae0427',
      pass: '56de5feab76430',
    },
  });

  // 2) Define the email options
  const mailOptions = {
    from: 'gokulJayan<gokuljayan@reubro.com>',
    to: options.email,
    subject: options.subject,
    text: options.message,
    // html:
  };

  // 3) Actually send the email
  await transporter.sendMail(mailOptions);
};

module.exports = sendEmail;
