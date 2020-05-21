const inputValidator = {

  invalUsernameMsg: 'Usernames can only contain letters, numbers, periods ".", hyphens "-", and underscores "_".',
  validateUsername: username => {
    const validChars = '0123456789abcdefghijklmnopqrstuvwxyz.-_'
    username = username.toLowerCase();

    for (let i = 0; i < username.length; i++) {
      if (!validChars.includes(username.charAt(i)))
        return false;
    }
    return (username.length > 0);
  },

  invalEmailMsg: 'Please enter a valid email address.',
  validateEmail: email => {
    const regex = /^([a-zA-Z0-9_\-.]+)@([a-zA-Z0-9_\-.]+)\.([a-zA-Z]{2,5})$/;
    return email.length > 0 && regex.test(email);
  },

  invalPasswordMsg: 'Your password must be at least 8 characters long.',
  validatePassword: password => {
    return password.length > 7;
  }

}

module.exports = inputValidator;