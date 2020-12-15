'use strict';

const db = require('../models');
const { errHandler } = require('../middleware/errorHandler');

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

        // If not array?
        if (handled[0].includes('INVALID_')) {
          res.send(handled)
        } else {
          // console.log('not handled');
        }

      });
  }
}
