'use strict';

const { INVALID } = require('../middleware/errorHandler');
const bcrypt = require('bcrypt');
const {
  validateUsername,
  validateEmail,
  validatePassword
} = require('../middleware/dataValidator');

const usernameValidChars = '0123456789abcdefghijklmnopqrstuvwxyz.-_';
const usernameMaxLen = 30;
const usernameMinLen = 6;

const encryptPassword = pass => {
  return bcrypt.hashSync(pass, bcrypt.genSaltSync(10));
}

module.exports = (sequelize, DataTypes) => {
  const User = sequelize.define('User', {

    user_id: {
      type: DataTypes.INTEGER.UNSIGNED,
      allowNull: false,
      autoIncrement: true,
      primaryKey: true
    },

    username: {
      type: DataTypes.STRING(usernameMaxLen),
      allowNull: false,
      unique: true,

      validate: {
        validUsername(value) {
          let valid = true;

          if (typeof value === 'string') {
            value = value.toLowerCase();
            for (let i = 0; i < value.length; i++) {
              if (!usernameValidChars.includes(value.charAt(i)))
                valid = false;
            }
          } else {
            valid = false;
          }

          if (value.length < usernameMinLen
            || value.length > usernameMaxLen) valid = false;

          if (!valid) throw new Error(`${INVALID}USERNAME`);
        }
      }
    },

    email: {
      type: DataTypes.STRING(255),
      allowNull: false,
      unique: true,
      validate: {
        validEmail(value) {
          let valid = true;

          if (typeof value === 'string') {
            const regex = /^([a-zA-Z0-9_\-.]+)@([a-zA-Z0-9_\-.]+)\.([a-zA-Z]{2,5})$/;
            valid = regex.test(value);
          } else {
            valid = false;
          }

        if (!valid) throw new Error(`${INVALID}EMAIL`);
        }
      }
    },

    password: {
      type: DataTypes.STRING,
      allowNull: false,
      // validate: {
      //   validPassword(value) {
      //     if (!validatePassword(value)) throw new Error('INVALID_PASSWORD');
      //   }
      // }
    }
  }, {
    tableName: 'user',
    underscored: true
  });

  User.addHook('beforeCreate', user => {
    user.password = encryptPassword(user.password);
  });

  User.addHook('beforeUpdate', user => {
    user.password = encryptPassword(user.password);
  });

  User.associate = models => {
    User.hasMany(models.PassReset, {
      foreignKey: 'user_id'
    });
  }

  return User;
};
