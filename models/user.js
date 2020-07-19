'use strict';

const bcrypt = require('bcrypt');
const {
  validateUsername,
  validateEmail,
  validatePassword
} = require('../middleware/inputValidator');

module.exports = (sequelize, DataTypes) => {
  const User = sequelize.define('User', {
    id: {
      type: DataTypes.INTEGER.UNSIGNED,
      allowNull: false,
      autoIncrement: true,
      primaryKey: true
    },
    username: {
      type: DataTypes.STRING,
      allowNull: false,
      unique: true,
      validate: {
        validUsername(value) {
          if (!validateUsername(value)) throw new Error('INVALID_USERNAME');
        }
      }
    },
    email: {
      type: DataTypes.STRING,
      allowNull: false,
      unique: true,
      validate: {
        validEmail(value) {
          if (!validateEmail(value)) throw new Error('INVALID_EMAIL');
        }
      }
    },
    password: {
      type: DataTypes.STRING,
      allowNull: false,
      validate: {
        validPassword(value) {
          if (!validatePassword(value)) throw new Error('INVALID_PASSWORD');
        }
      }
    },
    passResetCode: {
      type: DataTypes.STRING
    },
    passResetExpiry: {
      type: DataTypes.DATE
    }
  }, {
    tableName: 'user'
  });

  User.addHook('beforeCreate', user => {
    user.password = bcrypt.hashSync(user.password, bcrypt.genSaltSync(10));
  });

  User.addHook('beforeUpdate', user => {
    user.password = bcrypt.hashSync(user.password, bcrypt.genSaltSync(10));
  });

  return User;
};
