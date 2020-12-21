'use strict';

const errorHandler = (err, req, res, next) => {

  if (err.name === 'SequelizeValidationError') {
    res.status(400).send('BAD_REQUEST');
  } else if (err.name === 'SequelizeUniqueConstraintError') {
    res.status(200).send('NON_UNIQUE');
  } else {
    // EMAIL ADMINS
    console.log('error handler default hit:', err);
    res.status(500).send('SERVER_ERROR');
  }

}

module.exports = errorHandler;
