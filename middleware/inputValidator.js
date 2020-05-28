'use strict';

const validateUsername = username => {
  const validChars = '0123456789abcdefghijklmnopqrstuvwxyz.-_';
  username = username.toLowerCase();

  for (let i = 0; i < username.length; i++) {
    if (!validChars.includes(username.charAt(i)))
      return false;
  }
  return typeof username === 'string' && username.length > 0;
};

const validateEmail = email => {
  const regex = /^([a-zA-Z0-9_\-.]+)@([a-zA-Z0-9_\-.]+)\.([a-zA-Z]{2,5})$/;
  return regex.test(email) && typeof email === 'string';
};

const validatePassword = password => {
  return password.length > 7 && typeof password === 'string';
};

const inputValidator = {
  validateUserInfo: (req, res, next) => {
    const { username, email, password } = req.body;
    const valid = (validateUsername(username)
      && validateEmail(email)
      && validatePassword(password));

    valid ? next() : res.send('BAD_REQUEST');
  }
}

module.exports = inputValidator;