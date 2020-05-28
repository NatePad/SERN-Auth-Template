'use strict';

const router = require('express').Router();
const users = require('../../controllers/users');
const { validateUserInfo } = require('../../middleware/inputValidator');

// routes match: /api/users/...
router.route('/auth')
  .get(users.auth);

router.route('/login')
  .post(users.login);

router.route('/register')
  .post(validateUserInfo, users.register);

router.route('/update')
  .post(validateUserInfo, users.update);

module.exports = router;
