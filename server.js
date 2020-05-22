'use strict';

const app = require('./app');
const db = require('./models');
const PORT = process.env.PORT || 8000;

// Manually toggle force to true in order to drop
// and rebuild all tables in the database
const force = false;
db.sequelize.sync({ force }).then(() => {
  app.listen(PORT, () => console.log(`App listening at http://localhost:${PORT}`));
});
