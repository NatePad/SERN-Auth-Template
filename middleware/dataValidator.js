'use strict';

module.exports = {
  validateUsername: username => {
    const validChars = '0123456789abcdefghijklmnopqrstuvwxyz.-_';
    username = username.toLowerCase();
  
    for (let i = 0; i < username.length; i++) {
      if (!validChars.includes(username.charAt(i)))
        return false;
    }
    return typeof username === 'string' && username.length > 0;
  },

  validateEmail: email => {
    const regex = /^([a-zA-Z0-9_\-.]+)@([a-zA-Z0-9_\-.]+)\.([a-zA-Z]{2,5})$/;
    return regex.test(email) && typeof email === 'string';
  },

  validatePassword: password => {
    const regex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.*[!@#\$%\^&\*])(?=.{8,})/;
    return regex.test(password) && typeof password === 'string';
  }
}
