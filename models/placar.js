'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class Placar extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // Placar.belongsTo(models.Usuario, {
      // foreignKey: 'id_usuario' // A coluna que faz essa ligação
      // });
    }

  }
  Placar.init({
    nome: DataTypes.STRING,
    acertos: DataTypes.INTEGER,
    totalQuestoes: {
      type: DataTypes.INTEGER,
      field: 'total_questoes'
    },
    porcentagem: DataTypes.FLOAT,
  }, {
    sequelize,
    modelName: 'Placar',
    tableName: 'Placar',
  });
  return Placar;
};