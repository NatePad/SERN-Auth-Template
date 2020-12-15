'use strict';

// TEST FOR !STRING

module.exports = {
  // USERNAME
  usernameValidator: {
    ERR_TYPE: 'INVALID_USERNAME',
    INVAL_MSG: `Usernames can contain ${this.MIN_LEN} to ${this.MAX_LEN} characters, letters, numbers, periods.`,
    MIN_LEN: 6,
    MAX_LEN: 35,
    validator: username => {
      const validChars = '0123456789abcdefghijklmnopqrstuvwxyz.';
      if (typeof username === 'string') {
        username = username.toLowerCase();
        for (let i = 0; i < username.length; i++) {
          if (!validChars.includes(username.charAt(i)))
            return false;
        }
      } else {
        return false;
      }

      return (username.length > MIN_LEN) && (username.length < MAX_LEN);
    }
  },


  emailValidator: {
    ERR_TYPE: 'INVALID_EMAIL',
    MAX_LEN: 320,
    INVAL_MSG: 'Please enter a valid email address.',
    validator: email => {
      const regex = /^([a-zA-Z0-9_\-.]+)@([a-zA-Z0-9_\-.]+)\.([a-zA-Z]{2,5})$/;
      return regex.test(email) && typeof email === 'string';
    }
  },


  passwordValidator: {
    ERR_TYPE: 'INVALID_PASSWORD',
    MIN_LEN: 8,
    MAX_LEN: 255,
    INVAL_MSG: `Passwords must be from ${this.MIN_LEN} to ${this.MAX_LEN} characters and must include a capital letter, a number, and a special character.`,
    validator: password => {
      const regex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.*[!@#$%^&*])(?=.{8,})/;
      return regex.test(password) && typeof password === 'string';
    }
  }
}
