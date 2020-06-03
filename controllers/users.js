'use strict';

const bcrypt = require('bcrypt');
const db = require('../models');
const jwt = require('jsonwebtoken');
const {
  validateUsername,
  validateEmail,
  validatePassword
} = require('../middleware/inputValidator');

const handleDuplicateError = err => {
  // Sequelize fails on the first error. Either username,
  // or email, or both could be a duplicate. This logic
  // needs to be improved so that the user doesn't receive
  // this error once for username and again separately
  // for email.
  let duplicateField = err.errors[0].path.toUpperCase();

  // On Windows, duplicateField is the direct name of the db
  // field. On Linux, it is ${tableName}.${fieldName}.
  // I haven't tested on a Mac.
  if (duplicateField.includes('.')) {
    duplicateField = duplicateField.split('.').pop();
  }
  return(`DUPLICATE_${duplicateField}`);
}

const prepUserData = userData => {
  // Only send what is necessary to the front end.
  return {
    username: userData.username,
    email: userData.email
  }
}

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
          res.send(prepUserData(results));
        })
        .catch(err => {
          console.log('=======================================');
          console.log('ERROR IN USERS CONTROLLER .AUTH METHOD');
          console.log(err);
          console.log('_______________________________________');
          res.send('SERVER_ERROR');
        });
    } catch (err) {
      res.send('JWT_ERROR');
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
            const userData = prepUserData(results);
            res.send({ userData, token });
          } catch(err) {
            res.send('JWT_ERROR');
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

  register: (req, res, next) => {

    const { username, email, password } = req.body;
    if (!validateUsername(username)
        || !validateEmail(email)
        || !validatePassword(password)) {
      res.send('BAD_REQUEST');
      return;
    }

    db.User.create({
      username,
      email,
      password
    })
      .then(results => {
        // Automatically log in after registering?
        const autoLogin = true;
        if (autoLogin) {
          next();
        } else {
          res.status(201).send('ACCOUNT_CREATED');
        }
      })
      .catch(err => {
        if (err.name === 'SequelizeUniqueConstraintError') {
          res.send(handleDuplicateError(err));
        } else {

          // Handle unexpected errors.
          console.log('==========================================');
          console.log('ERROR IN USERS CONTROLLER .REGISTER METHOD');
          console.log(err);
          console.log('__________________________________________');
          res.send('SERVER_ERROR');
        }
      });
  },

  updatePassword: (req, res) => {
    const { newPassword, id } = req.body;

    if (!validatePassword(newPassword)) {
      res.send('BAD_REQUEST');
      return;
    }

    db.User.findOne({
      where: { id }
    })
    .then(results => {
      results.update({
        password: bcrypt.hashSync(req.body.newPassword, bcrypt.genSaltSync(10))
      });

      res.send('SUCCESS');
    })
    .catch(err => {
      console.log('==========================================');
      console.log('ERROR IN USERS CONTROLLER .UPDATEPASSWORD METHOD');
      console.log(err);
      console.log('__________________________________________');
      res.send('SERVER_ERROR');
    })
  },

  updateProfile: (req, res) => {
    const { username, email, id } = req.body;

    if (!validateUsername(username) || !validateEmail(email)) {
      res.send('BAD_REQUEST');
      return;
    }

    db.User.findOne({
      where: { id }
    })
      .then(results => {
        results.update({ email, username })
          .then(newObject => {
            res.send('SUCCESS');
          })
          .catch(err => {
            // check for duplicate errors on changing only username or password
            if (err.name === 'SequelizeUniqueConstraintError') {
              res.send(handleDuplicateError(err));
              return;
            } else {
              // error updating
              console.log('=======================================');
              console.log('ERROR UPDATING IN USERS CONTROLLER .UPDATE METHOD');
              console.log(err);
              console.log('_______________________________________');
              res.send('SERVER_ERROR');
            }
          });
      })
      .catch(err => {
        // error finding user by ID
        console.log('=======================================');
        console.log('ERROR FINDING IN USERS CONTROLLER .UPDATE METHOD');
        console.log(err);
        console.log('_______________________________________');
        res.send('SERVER_ERROR');
      });
  },

  verifyCredentials: (req, res, next) => {
    const { password } = req.body;

    const authCookie = req.headers.cookie.split('user=').pop().split(';').shift();
    let id;
    try {
      id = jwt.verify(authCookie, process.env.JWT_SECRET).id;
    } catch(err) {
      res.send('JWT_ERROR');
      return;
    }

    db.User.findOne({
      where: { id }
    })
    .then(results => {
      const correctPassword = bcrypt.compareSync(password, results.dataValues.password);
      if (!correctPassword) {
        res.send('INCORRECT_PASSWORD');
        return;
      } else {
        req.body.id = id;
        next();
      }
    })
    .catch(err => {
      console.log('=======================================');
      console.log('ERROR FINDING USER BY ID IN ');
      console.log('.VERIFYCREDENTIALS METHOD');
      console.log(err);
      console.log('_______________________________________');
      res.send('SERVER_ERROR');
      return;
    })
  }
};
