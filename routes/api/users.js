'use strict';

const router = require('express').Router();
const users = require('../../controllers/users');
// const { validateUserInfo } = require('../../middleware/inputValidator');

// routes match: /api/users/...
router.route('/auth')
  .get(users.auth);

router.route('/login')
  .post(users.login);

router.route('/register')
  .post(users.register, users.login);

router.route('/reset-pass')
  .post(users.resetPass);

router.route('/send-password-email')
  .post(users.sendPassEmail);

router.route('/update-password')
  .post(users.verifyCredentials, users.updatePassword);

router.route('/update-profile')
  .post(users.verifyCredentials, users.updateProfile);

module.exports = router;
