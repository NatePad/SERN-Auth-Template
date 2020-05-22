const path = require('path');
const router = require('express').Router();
const apiRoutes = require('./api');

// Check for API Routes first.
router.use('/api', apiRoutes);

// Then, send the React app.
router.use(function(req, res) {
  res.sendFile(path.join(__dirname, '../client/build/index.html'));
});

module.exports = router;
