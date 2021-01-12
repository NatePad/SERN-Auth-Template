'use strict';

const nodemailer = require('nodemailer');
const fromStr = `${process.env.EMAIL_FROM} <${process.env.EMAIL_USER}>`
const urlPrefix = process.env.URL_PREFIX;

const transporter = nodemailer.createTransport({
  host: process.env.EMAIL_HOST,
  port: 465,
  secure: true, // true for 465, false for other ports
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS
  }
});

const mailer = {
  sendPassReset: (recipient, bufStr) => {
    const resetUrl = `${urlPrefix}/pass-reset/${bufStr}`;
    const resetEmail = {
      from: fromStr,
      to: recipient,
      subject: 'Password Reset',
      text: `You're receiving this email because you've requested a password reset from the SERN-Auth-Template app.
            This link will expire in 10 minutes. Please copy the following link and paste it into your browser in order to reset your password:
            ${resetUrl}`,
      html: `<p>You're receiving this email because you've requested a password reset from the SERN-Auth-Template app.
            The following link is only valid for 10 minutes. Please click on <a href="${resetUrl}" target="_blank" rel="noopener noreferrer">this link</a>,
            or copy the following link text and paste it into your browser in order to reset your password:
            ${resetUrl}`
    }
    transporter.sendMail(resetEmail);
  }
}

module.exports = mailer;
