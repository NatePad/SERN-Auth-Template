'use strict';

module.exports = (sequelize, DataTypes) => {
  const PassReset = sequelize.define('PassReset', {
    pr_id: {
      type: DataTypes.INTEGER.UNSIGNED,
      allowNull: false,
      autoIncrement: true,
      primaryKey: true
    },
    passResetCode: {
      type: DataTypes.STRING(40)
    },
    passResetExpiry: {
      type: DataTypes.DATE
    }
  }, {
    tableName: 'pass_reset',
    underscored: true
  });

  PassReset.associate = models => {
    PassReset.belongsTo(models.User, {
      foreignKey: 'user_id'
    });
  }

  return PassReset;
};
