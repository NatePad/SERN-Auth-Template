'use strict';

const router = require('express').Router();
const passwordResets = require('../../controllers/passwordResets');

// routes match: /api/passwords/...
router.route('/email')
  .post(passwordResets.email);

router.route('/reset')
  .post(passwordResets.reset);

module.exports = router;