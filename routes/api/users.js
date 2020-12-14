'use strict';

const router = require('express').Router();
const users = require('../../controllers/users');

// routes match: /api/users/...
router.route('/register')
  .post(users.register);

module.exports = router;