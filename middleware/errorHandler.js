'use strict';

const errorHandler = (err, req, res, next) => {
  switch (err.name) {
    case 'SequelizeValidationError':
      res.status(400).send('BAD_REQUEST');
    case 'SequelizeUniqueConstraintError':
      res.status(200).send('NOT_UNIQUE');
    default:
    // EMAIL ADMINS
    console.log('error handler default hit:', err);
    res.status(500).send('SERVER_ERROR');
  }
}

module.exports = errorHandler;
