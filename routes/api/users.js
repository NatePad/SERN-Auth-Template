'use strict';

const router = require('express').Router();
const users = require('../../controllers/users');
const { validateNewUser } = require('../../middleware/inputValidator');

// routes match: /api/users/...
router.route('/register')
  .post(validateNewUser, users.register);

module.exports = router;
