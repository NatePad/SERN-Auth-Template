'use strict';

const app = require('./app');
const PORT = process.env.PORT || 8000;

app.listen(PORT, () => console.log(`App listening at http://localhost:${PORT}`));
