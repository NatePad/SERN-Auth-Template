'use strict';

const router = require('express').Router();
const users = require('../../controllers/users');

// routes match: /api/users/...
router.route('/login')
  .post(users.login);

router.route('/login-cookie')
  .get(users.loginCookie);

router.route('/register')
  .post(users.register);

router.route('/update')
  .post(users.update);

router.route('/username/:username')
  .get((users.findByUsername));

module.exports = router;
