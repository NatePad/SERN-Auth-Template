'use strict';

const bcrypt = require('bcrypt');
const db = require('../models');
const jwt = require('jsonwebtoken');

module.exports = {
  auth: (req, res) => {
    const cookieString = req.headers.cookie;
    
    // The following check happens on both the front
    // end to reduce API calls and here for safety.
    if (!cookieString || !cookieString.includes('user=')) {
      res.send();
      return;
    }

    const authCookie = cookieString.split('user=').pop().split(';').shift();
    try {
      const userID = jwt.verify(authCookie, process.env.JWT_SECRET).id;
      db.User.findByPk(userID)
        .then(results => {
          if (!results) {
            res.send('USER_DELETED');
            return;
          }
          res.send('AUTHENTICATED');
        })
        .catch(err => {
          console.log(err);
          res.send('SERVER_ERROR');
        });
    } catch (err) {
      console.log('Your JWT_SECRET environment variable has changed.');
      res.send('SERVER_ERROR');
      return;
    }


  },

  login: (req, res) => {
    const { email, password } = req.body;
    db.User.findOne({
      where: { email }
    })
      .then(results => {
        if (!results) {
          res.send('INVALID_EMAIL');
          return;
        }

        if (bcrypt.compareSync(password, results.password)) {
          try {
            const token = jwt.sign({ id: results.id }, process.env.JWT_SECRET);
            res.send({ success: true, token });
          } catch(err) {
            console.log("Don't forget to set your JWT_SECRET!");
            res.send('SERVER_ERROR');
          }
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
