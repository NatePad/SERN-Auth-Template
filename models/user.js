'use strict';

const bcrypt = require('bcrypt');

const BAD_REQUEST = 'BAD_REQUEST';

const USERNAME_ALLOWED_CHARS = '0123456789abcdefghijklmnopqrstuvwxyz.'
const USERNAME_MIN_LEN = 6;
const USERNAME_MAX_LEN = 35;

const EMAIL_MAX_LEN = 350;
const EMAIL_REGEX = /^([a-zA-Z0-9_\-.]+)@([a-zA-Z0-9_\-.]+)\.([a-zA-Z]{2,5})$/;

const PASSWORD_MIN_LEN = 8;
const PASSWORD_MAX_LEN = 128;
const PASSWORD_REGEX =
  /^(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.*[!@#$%^&*])(?=.{8,})/;

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
      type: DataTypes.STRING(USERNAME_MAX_LEN),
      allowNull: false,
      unique: true,
      validate: {
        validateUsername(value) {
          let valid = true;

          if (typeof value === 'string') {
            value = value.toLowerCase();
            for (let i = 0; i < value.length; i++) {
              if (!USERNAME_ALLOWED_CHARS.includes(value.charAt(i)))
                valid = false;
            }
          } else {
            valid = false;
          }

          if (value.length < USERNAME_MIN_LEN ||
            value.length > USERNAME_MAX_LEN)
            valid = false;

          if (!valid) throw new Error(BAD_REQUEST);
        }
      }
    },
    email: {
      type: DataTypes.STRING(EMAIL_MAX_LEN),
      allowNull: false,
      unique: true,
      validate: {
        validateEmail(value) {
          let valid = true;

          if (typeof value === 'string') {
            valid = EMAIL_REGEX.test(value);
          } else {
            valid = false;
          }

          if (!valid) throw new Error(BAD_REQUEST);
        }
      }
    },
    password: {
      type: DataTypes.STRING(PASSWORD_MAX_LEN),
      allowNull: false,
      validate: {
        validatePassword(value) {
          let valid = true;

          if (typeof value === 'string') {
            valid = PASSWORD_REGEX.test(value);
          } else {
            valid = false;
          }

          if (value.length < PASSWORD_MIN_LEN ||
            value.length > PASSWORD_MAX_LEN)
            valid = false;

          if (!valid) throw new Error(BAD_REQUEST);
        }
      }
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

  User.findByCredentials = async userData => {
    const { user_id, email, password } = userData;

    try {
      const results = user_id ?
        // user_id is taken from cookie
        // when called by user.update()
        await User.findOne({ where: { user_id } }) :
        // email is used when called by user.login()
        await User.findOne({ where: { email } })

      if (results) {
        const validPass = bcrypt.compareSync(password, results.password);
        if (validPass) {
          return results;
        } else {
          return 'INCORRECT_PASSWORD';
        }
      } else {
        return -1;
      }
    } catch (err) {
      return (err);
    }
  }

  User.associate = models => {
    User.hasOne(models.PassReset, {
      foreignKey: 'user_id'
    });
  }

  return User;
};
