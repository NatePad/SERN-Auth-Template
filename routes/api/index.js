const router = require('express').Router();
const userRoutes = require('./users');
const passwordRoutes = require('./passwordResets');

// Routes match /api/...
router.use('/users', userRoutes);
router.use('/passwords', passwordRoutes);

module.exports = router;
