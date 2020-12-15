'use strict';

// const {
//   usernameValidator,
//   emailValidator,
//   passwordValidator
// } = require('./inputValidator');

const invalidData = err => {
  // console.log(err)
  const errArr = [];
  err.errors.forEach(e => {
    if (e.message.includes('INVALID_')) {
      errArr.push(e.message);
    }
  });
  console.log(errArr);
  return errArr;
}


module.exports = {
  errHandler: err => {
    // console.log(err);
    switch (err.name) {
      case 'SequelizeValidationError':
        return invalidData(err);
        break;
      default:
        // EMAIL ADMINS
        console.log('ERROR SWITCH DEFAULTED');
        console.log(err);
        return 'UNHANDLED';
    }
  }
}