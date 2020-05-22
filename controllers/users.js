'use strict';

const bcrypt = require('bcrypt');
const db = require('../models');
const jwt = require('jsonwebtoken');

module.exports = {
  login: (req, res) => {
    console.log(process.env.JWT_SECRET);
    const { email, password } = req.body;
    db.User.findOne({
      where: { email }
    })
      .then(results => {
        if (!results) {
          res.send('INVALID_EMAIL');
          return;
        }
        console.log(results.id);
        if (bcrypt.compareSync(password, results.password)) {
          const token = jwt.sign({ id: results.id }, process.env.JWT_SECRET);
          res.send({ success: true, token });
        } else {
          res.send('INCORRECT_PASSWORD');
        }

      })
      .catch(err => {
        console.log('=======================================');
        console.log('ERROR IN USERS CONTROLLER .LOGIN METHOD');
        console.log(err);
        console.log('_______________________________________');
        res.send('SERVER_ERROR');
      })
  },

  register: (req, res) => {
    const { username, email, password } = req.body;
    db.User.create({
      username,
      email,
      password
    })
      .then(results => {
        res.status(201).send('ACCOUNT_CREATED');
      })
      .catch(err => {
        if (err.name === 'SequelizeUniqueConstraintError') {

          // Sequelize fails on the first error. Either username,
          // email, or both could be a duplicate. This logic could
          // be improved so that the user doesn't receive
          // this error once for username and again separately
          // for email.
          let duplicateField = err.errors[0].path.toUpperCase();

          // On Windows, duplicateField is the direct name of the db
          // field. On Linux, it is ${tableName}.${fieldName}.
          // I haven't tested on a Mac.
          if (duplicateField.includes('.')) {
            duplicateField = duplicateField.split('.').pop();
          }
          res.send(`DUPLICATE_${duplicateField}`);
        } else {

          // Handle unexpected errors.
          console.log('==========================================');
          console.log('ERROR IN USERS CONTROLLER .REGISTER METHOD');
          console.log(err);
          console.log('__________________________________________');
          res.send('SERVER_ERROR');
        }
      });
  }
};
