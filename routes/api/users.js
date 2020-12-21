'use strict';

const router = require('express').Router();
const users = require('../../controllers/users');

// routes match: /api/users/...
router.route('/register')
  .post(users.register);

router.route('/username/:username')
  .get((users.findByUsername));

module.exports = router;