'use strict';

const { INVALID } = require('../middleware/errorHandler');
const bcrypt = require('bcrypt');
const {
  usernameValidator,
  emailValidator,
  passwordValidator
} = require('../middleware/inputValidator');

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
      type: DataTypes.STRING(usernameValidator.MAX_LEN),
      allowNull: false,
      unique: true,

      validate: {
        validUsername(value) {
          if (!usernameValidator.validator(value))
            throw new Error(usernameValidator.ERR_TYPE);
        }
      }
    },

    email: {
      type: DataTypes.STRING(255),
      allowNull: false,
      unique: true,
      validate: {
        validEmail(value) {
          if (!emailValidator.validator(value))
            throw new Error(emailValidator.ERR_TYPE);
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
