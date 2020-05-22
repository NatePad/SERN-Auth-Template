const router = require('express').Router();
const userRoutes = require('./users');

// User routes match /api/users
router.use('/users', userRoutes);

module.exports = router;
