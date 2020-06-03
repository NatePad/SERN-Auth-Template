'use strict';

const nodemailer = require('nodemailer');

const fromStr = `${process.env.EMAIL_FROM} <${process.env.EMAIL_USER}>`

const transporter = nodemailer.createTransport({
  host: process.env.EMAIL_HOST,
  port: 465,
  secure: true, // true for 465, false for other ports
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS
  }
});

// MAILER METHODS
const mailer = {
  sendPassReset: (id, recipient, bufStr, urlPrefix) => {
    const resetUrl = `${urlPrefix}/reset-pass/${id}/${bufStr}`;
    const resetEmail = {
      from: fromStr,
      to: recipient,
      subject: 'Password Reset',
      text: `You're receiving this email because you've requested a password reset from the SERN-Auth-Template app.
            Please copy the following link and paste it into your browser in order to reset your password:
            ${resetUrl}`,
      html: `<p>You're receiving this email because you've requested a password reset from the SERN-Auth-Template app.
            Please click on <a href="${resetUrl}" target="_blank" rel="noopener noreferrer">this link</a>,
            or copy the following link text and paste it into your browser in order to reset your password:
            ${resetUrl}`,
    };

    transporter.sendMail(resetEmail, (err, info) => {
      if (err) {
        console.log("Don't forget to set your environment variables.");
        console.log(err);
      } else {
        // console.log(info);
      }
    });
  }
}

module.exports = mailer;