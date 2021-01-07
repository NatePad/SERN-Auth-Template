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
    user_id: {
      type: DataTypes.INTEGER.UNSIGNED,
      allowNull: false
    }
  }, {
    indexes: [
      {
        unique: true,
        fields: ['user_id']
      }
    ],
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
