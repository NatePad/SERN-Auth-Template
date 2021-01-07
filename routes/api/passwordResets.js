'use strict';

const router = require('express').Router();
const { Router } = require('express');
const passwordResets = require('../../controllers/passwordResets');

// routes match: /api/password/...
router.route('/email')
  .post(passwordResets.email);

module.exports = router;