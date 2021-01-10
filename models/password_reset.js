'use strict';

module.exports = (sequelize, DataTypes) => {
  const PassReset = sequelize.define('PassReset', {
    user_id: {
      type: DataTypes.INTEGER.UNSIGNED,
      allowNull: false,
      primaryKey: true
    },
    resetCode: {
      type: DataTypes.STRING(40),
      allowNull: false,
      unique: true
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
