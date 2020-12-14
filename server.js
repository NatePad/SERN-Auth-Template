'use strict';

const app = require('./app');
const db = require('./models');
const PORT = process.env.PORT || 8000;

db.sequelize.sync().then(() => {
  app.listen(PORT, () => console.log(`App listening at http://localhost:${PORT}`));
});
