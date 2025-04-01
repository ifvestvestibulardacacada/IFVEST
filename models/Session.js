
  'use strict';
const { Model } = require('sequelize');

module.exports = (sequelize, DataTypes) => {
  class Session extends Model {
    static associate(models) {
      // define association here
    }
  }
  Session.init({
    sid: {
        type: DataTypes.STRING,
        primaryKey: true,
      },
      userId: {
        type: DataTypes.STRING,
        allowNull: true, // Tente mudar para `false` se necessário
      },
      expires: {
        type: DataTypes.DATE,
        allowNull: false,
      },
      data: {
        type: DataTypes.TEXT,
        allowNull: false,
      },
  }, {
    sequelize,
    modelName: 'Session',
    tableName: 'sessions',
// ✅ Desativa createdAt/updatedAt
  });
  return Session;
};