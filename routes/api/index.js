const router = require('express').Router();
const userRoutes = require('./users');

// Routes match /api/...
router.use('/users', userRoutes);

module.exports = router;
