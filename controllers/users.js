'use strict';

const db = require('../models');
const {
  INVALID,
  UNHANDLED,
  errHandler
} = require('../middleware/errorHandler');

module.exports = {
  register: (req, res) => {
    db.User.create(req.body)
      .then(results => {
        res.send('Hello from the back end.');
      })
      .catch(err => {
        const handled = errHandler(err);
        // if (handled === UNHANDLED) res.send(handled);
        // console.log(handled)

        if (handled[0].includes(INVALID)) {
          res.send(handled)
        } else {
          // console.log('not handled');
        }

      });
  }
}
