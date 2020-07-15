'use strict';

const bcrypt = require('bcrypt');
const db = require('../models');
const jwt = require('jsonwebtoken');
const mailer = require('../middleware/mailer');
const { resolveSoa } = require('dns');

const handleError = (err, source) => {
  // INVALID_INPUT or bad data errors:
  // err.name === 'SequelizeValidationError'
  if (err.errors[0].message.includes('INVALID_'))
    return 'BAD_REQUEST';

  // Non-unique errors:
  if (err.name === 'SequelizeUniqueConstraintError') {
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

  // Unexpected errors:
  console.log('=======================================');
  console.log(`ERROR IN USERS CONTROLLER ${source} METHOD`);
  console.log(err);
  console.log('_______________________________________');
  return 'SERVER_ERROR';
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
          res.send(handleError(err, 'AUTH'));
        });
    } catch (err) {
      res.send('JWT_ERROR');
      return;
    }
  },

  checkUsername: (req, res) => {
    db.User.findOne({
      where: {
        username: req.params.username
      }
    })
      .then(results => {
        results === null ? res.send('AVAILABLE') : res.send('TAKEN');
      })
      .catch(err => {
        res.send(handleError(err, 'CHECK_USERNAME'));
      });
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
        res.send(handleError(err, 'LOGIN'));
      })
  },

  register: (req, res, next) => {
    const { username, email, password } = req.body;

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
        res.send(handleError(err, 'REGISTER'));
      });
  },

  resetPass: (req, res) => {
    const { id, resetCode, password } = req.body;

    db.User.findOne({ where: {id} })
      .then(results => {
        if (!results) {
          res.send('INVALID_ID');
          return;
        } else if (results.passResetCode !== resetCode) {
          res.send('INVALID_CODE');
          return;
        }

        results.update({
          password,
          passResetCode: null
        });
        
        res.send('SUCCESS');
      })
      .catch(err => {
        res.send(handleError(err, 'RESET_PASS'));
      });
  },

  sendPassEmail: (req, res) => {
    const { email, urlPrefix } = req.body;
    db.User.findOne({
      where: { email }
    })
    .then(results => {
      if (!results) {
        res.send('INVALID_EMAIL');
        return;
      }

      const bufStr = require('crypto').randomBytes(32).toString('hex');
      results.update({
        passResetCode: bufStr
      });

      mailer.sendPassReset(
        results.id,
        email,
        bufStr,
        urlPrefix
      );

      res.send('EMAIL_SENT');
    })
    .catch(err => {
      res.send(handleError(err, 'SEND_PASS_EMAIL'));
    });
  },

  updatePassword: (req, res) => {
    const { newPassword, id } = req.body;

    db.User.findOne({
      where: { id }
    })
    .then(results => {
      results.update({
        password: newPassword
      });

      res.send('SUCCESS');
    })
    .catch(err => {
      res.send(handleError(err, 'UPDATE_PASSWORD'));
    })
  },

  updateProfile: (req, res) => {
    const { username, email, id } = req.body;

    db.User.findOne({
      where: { id }
    })
      .then(results => {
        results.update({ email, username })
          .then(newObject => {
            res.send('SUCCESS');
          })
          .catch(err => {
            res.send(handleError(err, 'UPDATE_PROFILE.update'));
          });
      })
      .catch(err => {
        res.send(handleError(err, 'UPDATE_PROFILE.findOne'));
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
      const correctPassword = bcrypt.compareSync(password, results.password);
      if (!correctPassword) {
        res.send('INCORRECT_PASSWORD');
        return;
      } else {
        req.body.id = id;
        next();
      }
    })
    .catch(err => {
      res.send(handleError(err, 'VERIFY_CREDENTIALS'));
    })
  }
};
